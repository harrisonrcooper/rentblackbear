// The universal task. The backbone of the planner: every module's rows can
// carry tasks, and checking one off rolls progress up the chain.
//
// A task attaches to any entity via (entity_type, entity_id), or to nothing
// at all (a loose todo). Subtasks are tasks with a parent_id. Nothing here
// touches the network — see actions/build/engine.ts for the server actions
// and lib/build/collections.ts for storage.

import type { EngineRow } from "./collections";
import type { EntityType } from "./entities";

export const TASK_STATUSES = ["todo", "in_progress", "blocked", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface BuildTask extends EngineRow {
  title: string;
  notes: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** ISO YYYY-MM-DD, or null. */
  due: string | null;
  assignee: string;
  /** What this task hangs off. Both null for a loose todo. */
  entity_type: EntityType | null;
  entity_id: string | null;
  /** Set when this is a subtask. */
  parent_id: string | null;
  tags: string[];
  /** Manual ordering within its list. */
  position: number;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const isDone = (t: BuildTask): boolean => t.status === "done";
export const isOpen = (t: BuildTask): boolean => !isDone(t) && !t.archived;

/** Tasks attached to one entity (excluding subtasks, which roll up to parents). */
export function tasksFor(tasks: BuildTask[], type: EntityType, id: string): BuildTask[] {
  return tasks.filter((t) => !t.archived && !t.parent_id && t.entity_type === type && t.entity_id === id);
}

export function subtasksOf(tasks: BuildTask[], parentId: string): BuildTask[] {
  return tasks.filter((t) => !t.archived && t.parent_id === parentId);
}

/**
 * Completion of a task list, in basis points (0..10000), so callers can render
 * a percentage without float drift. A task with subtasks contributes its
 * subtasks' completion rather than its own flag, which is what "progress rolls
 * up the chain" means.
 */
export function progressBps(tasks: BuildTask[], scope: BuildTask[]): number {
  if (scope.length === 0) return 0;

  let earned = 0;
  for (const t of scope) {
    const kids = subtasksOf(tasks, t.id);
    if (kids.length === 0) {
      earned += isDone(t) ? 1 : 0;
    } else {
      earned += kids.filter(isDone).length / kids.length;
    }
  }
  return Math.round((earned / scope.length) * 10000);
}

/** Progress for one entity's tasks. 0 when it has none. */
export function entityProgressBps(tasks: BuildTask[], type: EntityType, id: string): number {
  return progressBps(tasks, tasksFor(tasks, type, id));
}

/** Overdue = past due and not done. Today counts as not overdue. */
export function isOverdue(t: BuildTask, today: string): boolean {
  return Boolean(t.due) && !isDone(t) && !t.archived && (t.due as string) < today;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  entityType?: EntityType;
  entityId?: string;
  tag?: string;
  /** ISO date; matches tasks due on or before it. */
  dueBefore?: string;
  /** Substring match on title and notes, case-insensitive. */
  text?: string;
  includeArchived?: boolean;
  includeSubtasks?: boolean;
}

export function filterTasks(tasks: BuildTask[], f: TaskFilter = {}): BuildTask[] {
  const needle = f.text?.trim().toLowerCase();

  return tasks.filter((t) => {
    if (!f.includeArchived && t.archived) return false;
    if (!f.includeSubtasks && t.parent_id) return false;
    if (f.status?.length && !f.status.includes(t.status)) return false;
    if (f.priority?.length && !f.priority.includes(t.priority)) return false;
    if (f.entityType && t.entity_type !== f.entityType) return false;
    if (f.entityId && t.entity_id !== f.entityId) return false;
    if (f.tag && !t.tags.includes(f.tag)) return false;
    if (f.dueBefore && (!t.due || t.due > f.dueBefore)) return false;
    if (needle) {
      const hay = `${t.title} ${t.notes}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

const PRIORITY_RANK: Record<TaskPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

/** Overdue first, then by due date, then priority, then manual position. */
export function sortTasks(tasks: BuildTask[], today: string): BuildTask[] {
  return [...tasks].sort((a, b) => {
    const ao = isOverdue(a, today) ? 0 : 1;
    const bo = isOverdue(b, today) ? 0 : 1;
    if (ao !== bo) return ao - bo;

    if (a.due !== b.due) {
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due < b.due ? -1 : 1;
    }
    const ap = PRIORITY_RANK[a.priority] ?? 9;
    const bp = PRIORITY_RANK[b.priority] ?? 9;
    if (ap !== bp) return ap - bp;

    return a.position - b.position;
  });
}
