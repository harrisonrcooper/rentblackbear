// Sourcing Trips — the China planner.
//
// Windows, doors, cabinets, stairs, lighting and more are being bought in
// China (see Team & Vendors). A sourcing trip is the plan for a factory
// visit: the shopping list, the budget, and — the whole point of flying
// there — the photographs and videos you came back with.
//
// Pure logic only. No React, no network. The section (Trips.jsx) imports these.

import type { BuildTrip, BuildTripItem } from "@/actions/build/_store";

/** The engine task fields this module reads. `BuildTask` satisfies it. */
export interface SourcingTaskLike {
  id: string;
  title: string;
  notes?: string;
  tags?: string[];
  archived?: boolean;
}

/** The tag the workbook import stamps on every China-sourcing task. */
export const CHINA_SOURCING_TAG = "china sourcing";

const TITLE_PREFIX = /^source\s+/i;
const TITLE_SUFFIX = /\s+in china\s*$/i;

// Archived items still live in the blob (soft delete). visibleState already
// strips them from a trip's items before the section renders, but the pure
// functions defend the invariant themselves so a direct caller — or a test —
// can pass an unfiltered trip and still get honest counts.
const liveItems = (trip: BuildTrip): BuildTripItem[] =>
  (trip.items || []).filter((it) => !it.archived);

/**
 * Items that are handled — captured or ordered. "Ordered" is past "captured":
 * both belong on the done side of the captured / still-needed bar, so this
 * count plus `stillNeeded` always sums to `totalCount`.
 */
export function capturedCount(trip: BuildTrip): number {
  return liveItems(trip).filter((it) => it.status === "captured" || it.status === "ordered").length;
}

export function totalCount(trip: BuildTrip): number {
  return liveItems(trip).length;
}

/** Handled over total, in basis points (0..10000). Zero on an empty trip. */
export function tripProgressBps(trip: BuildTrip): number {
  const total = totalCount(trip);
  if (total === 0) return 0;
  return Math.round((capturedCount(trip) / total) * 10000);
}

/** Sum of every live item's budget, in integer cents. */
export function budgetCents(trip: BuildTrip): number {
  return liveItems(trip).reduce((sum, it) => sum + (it.budget_cents || 0), 0);
}

/** Items not yet sourced — still on the shopping list. */
export function stillNeeded(trip: BuildTrip): BuildTripItem[] {
  return liveItems(trip).filter((it) => it.status === "todo");
}

/**
 * Items marked captured or ordered that came back with no photos or videos.
 * Flying to a factory and returning empty-handed defeats the purpose; an item
 * claimed captured with a zero media count is a lie the UI must surface.
 */
export function itemsWithoutMedia(trip: BuildTrip): BuildTripItem[] {
  return liveItems(trip).filter(
    (it) => (it.status === "captured" || it.status === "ordered") && (it.media_count || 0) <= 0,
  );
}

const normalize = (s: string): string => s.toLowerCase().replace(/\s+/g, " ").trim();

// Naive singular/plural: "doors" ⇆ "door", "windows" ⇆ "window". Enough to
// match a task titled "Source windows in China" against an item named "Window",
// without a stemming library the planner doesn't need.
function variants(name: string): string[] {
  const n = normalize(name);
  if (!n) return [];
  const out = new Set([n]);
  if (n.endsWith("s")) out.add(n.slice(0, -1));
  else out.add(`${n}s`);
  return [...out];
}

/** Does a task title mention this item name, tolerating singular/plural? */
function titleMentions(title: string, itemName: string): boolean {
  const t = normalize(title);
  return variants(itemName).some((v) => v.length > 0 && t.includes(v));
}

const isChinaSourcing = (task: SourcingTaskLike): boolean =>
  !task.archived && Array.isArray(task.tags) && task.tags.includes(CHINA_SOURCING_TAG);

/**
 * The engine's China-sourcing tasks whose title names one of this trip's items.
 * The trip already knows what it's shopping for; this pulls back the matching
 * checklist the owner wrote — e.g. the windows task's note to film the factory
 * install — so a trip never ignores its own instructions.
 */
export function tripTasks<T extends SourcingTaskLike>(tasks: T[], trip: BuildTrip): T[] {
  const names = liveItems(trip).map((it) => it.item).filter(Boolean);
  if (names.length === 0) return [];
  return tasks.filter(
    (task) => isChinaSourcing(task) && names.some((name) => titleMentions(task.title, name)),
  );
}

/** "Source windows in China" -> "Windows". Strips the framing, keeps the noun. */
export function itemNameFromTaskTitle(title: string): string {
  const stripped = title.replace(TITLE_PREFIX, "").replace(TITLE_SUFFIX, "").trim();
  if (!stripped) return title.trim();
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

/**
 * Seed a NEW trip's checklist from the China-sourcing tasks: one item per task,
 * its name lifted out of the title and its instructions carried into the notes.
 * The item id is derived from the task id so the same task never seeds two rows.
 */
export function suggestItemsFromTasks<T extends SourcingTaskLike>(tasks: T[]): BuildTripItem[] {
  return tasks.filter(isChinaSourcing).map((task) => ({
    id: `ti_${task.id}`,
    item: itemNameFromTaskTitle(task.title),
    vendor: "",
    specs: "",
    budget_cents: 0,
    status: "todo",
    media_count: 0,
    notes: task.notes || "",
  }));
}
