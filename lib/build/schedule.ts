// Schedule / Gantt arithmetic for the home-build planner.
//
// Pure date math — NO React, NO network. The section imports these.
//
// Dates are ISO calendar days ("YYYY-MM-DD") with no time or zone. They are
// parsed at UTC midnight on purpose: a local-time parse in any timezone west
// of UTC lands the instant on the *previous* calendar day, which would shift
// every Gantt bar one column to the left. Anchoring at UTC keeps "a day" a
// pure calendar quantity, and because UTC has no daylight-saving jumps the
// millisecond arithmetic below is always an exact multiple of 86_400_000.

import type { BuildScheduleTask } from "@/actions/build/_store";

const MS_PER_DAY = 86_400_000;

/** Parse an ISO day string at UTC midnight. */
export function parseISO(s: string): Date {
  return new Date(`${s}T00:00:00Z`);
}

/** Format a Date back to its ISO calendar day (UTC). */
export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** The ISO day `n` days after `iso` (n may be negative). */
export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

/**
 * Signed whole-day distance from `a` to `b`, inclusive-exclusive: the number
 * of midnights crossed. daysBetween(d, d) === 0; daysBetween(d, d+1) === 1.
 */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / MS_PER_DAY);
}

/**
 * Inclusive calendar-day span of a task — a one-day task (start === end) is 1,
 * never 0. Undated tasks and inverted ranges both floor to 1 so a bar always
 * has width and weighting never divides by zero.
 */
export function durationDays(task: Pick<BuildScheduleTask, "start" | "end">): number {
  if (!task.start || !task.end) return 1;
  const span = daysBetween(task.start, task.end) + 1;
  return span < 1 ? 1 : span;
}

type Task = BuildScheduleTask;

/** id → task lookup, ignoring rows without an id. */
export function indexById(tasks: Task[]): Map<string, Task> {
  const m = new Map<string, Task>();
  for (const t of tasks) if (t?.id) m.set(t.id, t);
  return m;
}

/**
 * Dependency-first ordering via Kahn's algorithm. Edges point from a
 * dependency to the task that waits on it, so a task always follows every
 * `depends_on` it names. Dangling ids (a dependency that was deleted) are
 * ignored rather than treated as an unsatisfiable edge.
 *
 * A cycle can't be linearised, so when one exists `order` holds only the
 * acyclic prefix and `cycle` holds one concrete cycle of ids. Callers that
 * walk `order` therefore terminate even on a corrupt graph.
 */
export function topoSort(tasks: Task[]): { order: string[]; cycle: string[] } {
  const ids = tasks.map((t) => t.id);
  const present = new Set(ids);
  const indeg = new Map<string, number>(ids.map((id) => [id, 0] as [string, number]));
  const dependents = new Map<string, string[]>(ids.map((id) => [id, []] as const));

  for (const t of tasks) {
    for (const dep of t.depends_on || []) {
      if (!present.has(dep) || dep === t.id) continue;
      indeg.set(t.id, (indeg.get(t.id) || 0) + 1);
      dependents.get(dep)!.push(t.id);
    }
  }

  const queue = ids.filter((id) => indeg.get(id) === 0);
  const order: string[] = [];
  for (let head = 0; head < queue.length; head++) {
    const id = queue[head];
    order.push(id);
    for (const next of dependents.get(id) || []) {
      const d = (indeg.get(next) || 0) - 1;
      indeg.set(next, d);
      if (d === 0) queue.push(next);
    }
  }

  if (order.length === ids.length) return { order, cycle: [] };
  return { order, cycle: findCycle(tasks, indexById(tasks)) };
}

/** One concrete dependency cycle (ids in traversal order), or [] if none. */
function findCycle(tasks: Task[], byId: Map<string, Task>): string[] {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>(tasks.map((t) => [t.id, WHITE]));
  const stack: string[] = [];
  let found: string[] | null = null;

  const walk = (id: string): void => {
    if (found) return;
    color.set(id, GRAY);
    stack.push(id);
    for (const dep of byId.get(id)?.depends_on || []) {
      if (found) break;
      if (!byId.has(dep) || dep === id) continue;
      if (color.get(dep) === GRAY) {
        found = stack.slice(stack.indexOf(dep));
        break;
      }
      if (color.get(dep) === WHITE) walk(dep);
    }
    stack.pop();
    color.set(id, BLACK);
  };

  for (const t of tasks) {
    if (found) break;
    if (color.get(t.id) === WHITE) walk(t.id);
  }
  return found || [];
}

/**
 * The earliest a task may begin under finish-to-start: the day after the
 * latest `end` among its dependencies. With no dated dependencies it keeps its
 * own `start`. Returns null only when it has neither.
 */
export function earliestStart(task: Task, byId: Map<string, Task>): string | null {
  let latestEnd: string | null = null;
  for (const depId of task.depends_on || []) {
    const dep = byId.get(depId);
    if (!dep?.end) continue;
    if (latestEnd === null || parseISO(dep.end) > parseISO(latestEnd)) latestEnd = dep.end;
  }
  return latestEnd ? addDays(latestEnd, 1) : task.start;
}

/**
 * Tasks that break finish-to-start: they start on or before a dependency's
 * end. Same-day is a violation — finish-to-start means start STRICTLY after
 * the dependency finishes. Undated pairs can't be judged and are skipped.
 */
export function violations(tasks: Task[]): Task[] {
  const byId = indexById(tasks);
  return tasks.filter((t) => {
    if (!t.start) return false;
    const start = parseISO(t.start);
    for (const depId of t.depends_on || []) {
      const dep = byId.get(depId);
      if (!dep?.end) continue;
      if (start.getTime() <= parseISO(dep.end).getTime()) return true;
    }
    return false;
  });
}

/**
 * Move one task to `newStartISO`, preserving its duration, and cascade: every
 * dependent shifts by the SAME delta, but only if it would otherwise violate
 * finish-to-start. Moving a task earlier therefore usually disturbs nothing,
 * while moving it later drags its whole downstream chain along.
 *
 * Returns a brand-new array; input tasks are never mutated. Cascade walks the
 * acyclic topo order, so a cyclic graph terminates (cyclic rows just don't
 * propagate) instead of looping forever.
 */
export function reschedule(tasks: Task[], id: string, newStartISO: string): Task[] {
  const byId = indexById(tasks);
  const target = byId.get(id);
  if (!target || !target.start) return tasks.map((t) => ({ ...t }));

  const delta = daysBetween(target.start, newStartISO);
  if (delta === 0) return tasks.map((t) => ({ ...t }));

  // id → shifted {start,end}. Duration is preserved by re-deriving end.
  const moved = new Map<string, { start: string; end: string | null }>();
  const place = (t: Task, start: string) => {
    const end = t.start && t.end ? addDays(start, durationDays(t) - 1) : t.end;
    moved.set(t.id, { start, end });
  };
  place(target, newStartISO);

  const startOf = (t: Task) => (moved.has(t.id) ? moved.get(t.id)!.start : t.start);
  const endOf = (t: Task) => (moved.has(t.id) ? moved.get(t.id)!.end : t.end);

  const { order } = topoSort(tasks);
  for (const tid of order) {
    if (tid === id) continue;
    const t = byId.get(tid)!;
    if (!t.start) continue;
    const s = startOf(t);
    if (!s) continue;
    const sTime = parseISO(s).getTime();
    let violates = false;
    for (const depId of t.depends_on || []) {
      const dep = byId.get(depId);
      const de = dep && endOf(dep);
      if (de && sTime <= parseISO(de).getTime()) { violates = true; break; }
    }
    if (violates) place(t, addDays(t.start, delta));
  }

  return tasks.map((t) => {
    const m = moved.get(t.id);
    return m ? { ...t, start: m.start, end: m.end } : { ...t };
  });
}

/**
 * The longest dependency chain measured by summed duration — the sequence
 * that sets the project's floor. Standard DAG longest-path over topo order;
 * returns the chain's task ids from root to tip, or [] when there are none.
 */
export function criticalPath(tasks: Task[]): string[] {
  const byId = indexById(tasks);
  const { order } = topoSort(tasks);
  const best = new Map<string, number>();   // longest total ending at this id
  const prev = new Map<string, string | null>();
  let tipId: string | null = null;
  let tipLen = -1;

  for (const id of order) {
    const t = byId.get(id)!;
    let inherited = 0;
    let from: string | null = null;
    for (const depId of t.depends_on || []) {
      const d = best.get(depId);
      if (d != null && d > inherited) { inherited = d; from = depId; }
    }
    const total = inherited + durationDays(t);
    best.set(id, total);
    prev.set(id, from);
    if (total > tipLen) { tipLen = total; tipId = id; }
  }

  const path: string[] = [];
  for (let cur = tipId; cur != null; cur = prev.get(cur) ?? null) path.unshift(cur);
  return path;
}

/**
 * Earliest start and latest end across all dated tasks. Either endpoint is
 * null when nothing carries that date; both null on an empty schedule.
 */
export function projectBounds(tasks: Task[]): { start: string | null; end: string | null } {
  let start: string | null = null;
  let end: string | null = null;
  for (const t of tasks) {
    if (t.start && (start === null || parseISO(t.start) < parseISO(start))) start = t.start;
    if (t.end && (end === null || parseISO(t.end) > parseISO(end))) end = t.end;
  }
  return { start, end };
}

/**
 * Duration-weighted completion in basis points (0..10000) — a long phase that
 * is half done moves the needle more than a one-day task that is finished.
 * Zero when there is nothing to weigh.
 */
export function percentComplete(tasks: Task[]): number {
  let weighted = 0;
  let total = 0;
  for (const t of tasks) {
    const dur = durationDays(t);
    const pct = Math.min(100, Math.max(0, t.percent || 0));
    weighted += dur * pct;
    total += dur;
  }
  if (total === 0) return 0;
  return Math.round((weighted / total) * 100);
}
