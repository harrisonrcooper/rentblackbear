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

// Each contended writer loses at most once per round of winners, so N
// concurrent writers need ~N attempts in the worst case. Two humans is the
// real workload; the headroom covers a batch import racing a human edit.
const MAX_REPLAY_ATTEMPTS = 8;

/**
 * Back off before replaying, with jitter. Without it, writers that collide
 * once tend to collide again on the retry, having been released from the
 * previous round at the same moment.
 */
function backoff(attempt: number): Promise<void> {
  const ceiling = Math.min(20 * 2 ** (attempt - 1), 250);
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

  for (let attempt = 1; attempt <= MAX_REPLAY_ATTEMPTS; attempt++) {
    const { value, version } = await loadVersioned<Envelope<T>>(key, empty<T>());
    const items = Array.isArray(value.items) ? value.items : [];
    const next = mutate_(items);

    const res = await saveCas<Envelope<T>>(key, { items: next }, version, empty<T>());
    if (res.ok) return next;

    if (!res.conflict) {
      throw new Error(res.message || `Could not save ${name}.`);
    }
    // Conflict: back off, then replay the mutation against whatever is there now.
    if (attempt < MAX_REPLAY_ATTEMPTS) await backoff(attempt);
  }

  throw new Error(`Could not save ${name}: too many concurrent writers.`);
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
