"use server";

// Server actions for the build planner's cross-cutting engine.
//
// Every mutation goes through collections.mutate, which replays the operation
// against fresh data if another writer got there first — so two people adding
// tasks at the same moment both keep their task.
//
// Mutations append to the activity log. That write is best-effort: failing to
// record history must never fail the thing that actually happened.

import { auth } from "@/lib/auth";

import { resolveHousehold, isAuthorizedForBudget } from "../budget/_households";
import { listAll, listLive, mutate, newId, now } from "@/lib/build/collections";
import type { EntityType } from "@/lib/build/entities";
import { isEntityType } from "@/lib/build/entities";
import type { BuildTask, TaskPriority, TaskStatus } from "@/lib/build/tasks";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/build/tasks";

interface ActivityRow {
  id: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
  verb: string;
  summary: string;
  entity_type: EntityType | null;
  entity_id: string | null;
}

/** Keep the activity log from growing without bound in a single JSON row. */
const ACTIVITY_LIMIT = 500;

async function workspaceKey(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (!isAuthorizedForBudget(userId)) return null;
  return resolveHousehold(userId).workspaceKey;
}

async function record(ws: string, verb: string, summary: string, type: EntityType | null, id: string | null) {
  try {
    await mutate<ActivityRow>(ws, "activity", (rows) => {
      const row: ActivityRow = {
        id: newId("act"), created_at: now(), updated_at: now(),
        verb, summary, entity_type: type, entity_id: id,
      };
      return [row, ...rows].slice(0, ACTIVITY_LIMIT);
    });
  } catch (e) {
    console.error("[build/engine] activity write failed:", e instanceof Error ? e.message : e);
  }
}

// ── Tasks ────────────────────────────────────────────────────────────

export async function listTasks(): Promise<{ ok: boolean; tasks?: BuildTask[]; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };
  try {
    return { ok: true, tasks: await listAll<BuildTask>(ws, "tasks") };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function createTask(input: {
  title: string;
  notes?: string;
  status?: string;
  priority?: string;
  due?: string | null;
  assignee?: string;
  entityType?: string | null;
  entityId?: string | null;
  parentId?: string | null;
  tags?: string[];
}): Promise<{ ok: boolean; task?: BuildTask; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };

  const title = (input.title || "").trim();
  if (!title) return { ok: false, message: "A task needs a title." };

  // Validate at the boundary; never trust the caller's strings.
  const status = (TASK_STATUSES as readonly string[]).includes(input.status || "")
    ? (input.status as TaskStatus) : "todo";
  const priority = (TASK_PRIORITIES as readonly string[]).includes(input.priority || "")
    ? (input.priority as TaskPriority) : "normal";
  const entityType = input.entityType && isEntityType(input.entityType) ? input.entityType : null;
  const entityId = entityType ? (input.entityId || null) : null;

  try {
    let created: BuildTask | undefined;
    await mutate<BuildTask>(ws, "tasks", (rows) => {
      // Position derived from the rows we were handed, so a replay after a
      // conflict recomputes it rather than reusing a stale number.
      const siblings = rows.filter((r) => !r.archived && r.parent_id === (input.parentId || null));
      created = {
        id: newId("tsk"),
        created_at: now(),
        updated_at: now(),
        title,
        notes: input.notes || "",
        status,
        priority,
        due: input.due || null,
        assignee: input.assignee || "",
        entity_type: entityType,
        entity_id: entityId,
        parent_id: input.parentId || null,
        tags: Array.isArray(input.tags) ? input.tags : [],
        position: siblings.length,
      };
      return [...rows, created];
    });

    await record(ws, "task.created", `Added task “${title}”`, entityType, entityId);
    return { ok: true, task: created };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function updateTask(
  id: string,
  patch: { title?: string; notes?: string; status?: string; priority?: string; due?: string | null; assignee?: string; tags?: string[] },
): Promise<{ ok: boolean; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };

  const clean: Partial<BuildTask> = {};
  if (typeof patch.title === "string" && patch.title.trim()) clean.title = patch.title.trim();
  if (typeof patch.notes === "string") clean.notes = patch.notes;
  if (patch.status && (TASK_STATUSES as readonly string[]).includes(patch.status)) clean.status = patch.status as TaskStatus;
  if (patch.priority && (TASK_PRIORITIES as readonly string[]).includes(patch.priority)) clean.priority = patch.priority as TaskPriority;
  if (patch.due !== undefined) clean.due = patch.due || null;
  if (typeof patch.assignee === "string") clean.assignee = patch.assignee;
  if (Array.isArray(patch.tags)) clean.tags = patch.tags;

  if (Object.keys(clean).length === 0) return { ok: true };

  try {
    let title = "";
    let type: EntityType | null = null;
    let entId: string | null = null;
    await mutate<BuildTask>(ws, "tasks", (rows) =>
      rows.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...clean, updated_at: now() };
        title = next.title;
        type = next.entity_type;
        entId = next.entity_id;
        return next;
      }),
    );

    if (clean.status) await record(ws, "task.status", `“${title}” → ${clean.status}`, type, entId);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

/** Soft delete: archive the task and its subtasks so nothing is orphaned. */
export async function archiveTask(id: string): Promise<{ ok: boolean; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };
  try {
    let title = "";
    await mutate<BuildTask>(ws, "tasks", (rows) =>
      rows.map((r) => {
        if (r.id === id) { title = r.title; return { ...r, archived: true, updated_at: now() }; }
        if (r.parent_id === id) return { ...r, archived: true, updated_at: now() };
        return r;
      }),
    );
    await record(ws, "task.archived", `Deleted task “${title}”`, null, null);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function restoreTask(id: string): Promise<{ ok: boolean; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };
  try {
    await mutate<BuildTask>(ws, "tasks", (rows) =>
      rows.map((r) => (r.id === id || r.parent_id === id ? { ...r, archived: false, updated_at: now() } : r)),
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

// ── Activity ─────────────────────────────────────────────────────────

export async function listActivity(): Promise<{ ok: boolean; activity?: ActivityRow[]; message?: string }> {
  const ws = await workspaceKey();
  if (!ws) return { ok: false, message: "Not authorized." };
  try {
    return { ok: true, activity: await listLive<ActivityRow>(ws, "activity") };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
