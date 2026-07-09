// Storage for the build planner's cross-cutting engine: tasks, tags,
// comments, activity, attachments, links.
//
// Each collection is its OWN app_data row (`build:<name>:<workspace>`) with
// its own `_v` counter, rather than another array inside the one big blob.
// Two consequences, both good:
//
//   1. Independent versions. Adding a task never conflicts with editing a
//      room, because they are different rows with different versions. The
//      single-blob design made every write contend with every other write.
//   2. Operation replay. A collection write is expressed as a pure function
//      of the current items, so when compare-and-swap refuses a stale write
//      we re-read and re-apply the SAME function. The user's intent ("add
//      this task", "mark that one done") is replayed against fresh data
//      rather than merged after the fact — no heuristics, no lost intent.
//
// There are no Postgres tables here on purpose: the project's data plane is
// reachable with the service_role key, but DDL is not. lib/build/entities.ts
// hides the storage shape behind a resolver, so if these collections ever
// become real tables, nothing above this layer changes.

import { loadVersioned, saveCas } from "@/lib/app-data";

/** Every row in every collection carries these. */
export interface EngineRow {
  id: string;
  created_at: string;
  updated_at: string;
  /** Soft delete. Rows are archived, never dropped — see Archivable in _store.ts. */
  archived?: boolean;
}

export type CollectionName =
  | "tasks"
  | "tags"
  | "taggings"
  | "comments"
  | "activity"
  | "attachments"
  | "links";

interface Envelope<T> {
  items: T[];
}

// Retry until a DEADLINE, not until an attempt count.
//
// A fixed cap is a bet on how fast the machine is. Each contended writer loses
// at most once per round of winners, so N concurrent writers need ~N attempts
// — but under CPU pressure or network latency the same N writers take longer
// per round, and a cap of 8 starts throwing "too many concurrent writers" at a
// user whose only crime was ticking a checkbox during a rebuild. A deadline
// tracks the thing we actually care about: how long the user waits.
const REPLAY_DEADLINE_MS = 15_000;
const MAX_REPLAY_ATTEMPTS = 40; // runaway guard, not the real limit

/**
 * Full-jitter exponential backoff. Without jitter, writers that collide once
 * collide again on the retry, having been released from the previous round at
 * the same instant. Sleeping a RANDOM slice of the window (rather than the
 * whole window) spreads them out and converges faster under contention.
 */
function backoff(attempt: number): Promise<void> {
  const ceiling = Math.min(20 * 2 ** (attempt - 1), 400);
  return new Promise((r) => setTimeout(r, Math.random() * ceiling));
}

export function collectionKey(workspaceId: string, name: CollectionName): string {
  return `build:${name}:${workspaceId}`;
}

const empty = <T>(): Envelope<T> => ({ items: [] });

/** All rows, including archived ones. Callers usually want `listLive`. */
export async function listAll<T extends EngineRow>(
  workspaceId: string,
  name: CollectionName,
): Promise<T[]> {
  const { value } = await loadVersioned<Envelope<T>>(collectionKey(workspaceId, name), empty<T>());
  return Array.isArray(value.items) ? value.items : [];
}

/** Rows that have not been archived. */
export async function listLive<T extends EngineRow>(
  workspaceId: string,
  name: CollectionName,
): Promise<T[]> {
  return (await listAll<T>(workspaceId, name)).filter((r) => !r.archived);
}

/**
 * Apply `mutate` to the collection and persist it.
 *
 * On a compare-and-swap conflict the CURRENT items are re-read and `mutate`
 * runs again against them, up to `MAX_REPLAY_ATTEMPTS`. `mutate` must
 * therefore be pure and idempotent-ish: derive everything from the `items`
 * it is handed, never from a value captured outside.
 */
export async function mutate<T extends EngineRow>(
  workspaceId: string,
  name: CollectionName,
  mutate_: (items: T[]) => T[],
): Promise<T[]> {
  const key = collectionKey(workspaceId, name);
  const deadline = Date.now() + REPLAY_DEADLINE_MS;
  let attempt = 0;

  while (attempt < MAX_REPLAY_ATTEMPTS) {
    attempt += 1;

    const { value, version } = await loadVersioned<Envelope<T>>(key, empty<T>());
    const items = Array.isArray(value.items) ? value.items : [];
    const next = mutate_(items);

    const res = await saveCas<Envelope<T>>(key, { items: next }, version, empty<T>());
    if (res.ok) return next;

    if (!res.conflict) {
      throw new Error(res.message || `Could not save ${name}.`);
    }
    // Conflict: back off, then replay the mutation against whatever is there now.
    if (Date.now() >= deadline) break;
    await backoff(attempt);
  }

  throw new Error(
    `Could not save ${name}: another editor kept winning for ${REPLAY_DEADLINE_MS / 1000}s. ` +
      `Nothing was lost — reload and try again.`,
  );
}

/** Timestamp helper so every row stamps time the same way. */
export const now = (): string => new Date().toISOString();

/**
 * Collision-resistant id. Not a UUID — these ids are only ever unique within
 * one household's collection, and they stay readable in the JSON.
 */
export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}
