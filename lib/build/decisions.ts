// The decisions log: choices already MADE, kept so that in eighteen months
// someone can still answer "why did we do it that way?".
//
// A log entry without its reasoning is just a list. So the two fields that
// decide whether an entry is worth keeping are `decision` (what we chose) and
// `why` (why we chose it) — everything here treats those as the load-bearing
// pair, and `isComplete`/`incompleteCount` exist to surface the ones that
// forgot the reason before the memory of it fades.
//
// Pure functions only. No React, no I/O — the section imports these.

// Structural shape rather than a hard dependency on BuildDecision, so this
// module (and its tests) never pull the store's server code into scope. Any
// BuildDecision satisfies it.
export interface DecisionLike {
  id: string;
  title: string;
  decided_on: string | null; // ISO YYYY-MM-DD, or null when undated
  decision: string;
  why: string;
  alternatives: string;
  url?: string;
}

export interface MonthGroup<T> {
  /** "July 2026", or "No date" for the undated bucket. */
  label: string;
  items: T[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const NO_DATE_LABEL = "No date";

// A stored date counts only when it's a real, non-blank string. A decision can
// be logged before its date is filled in, and those must never masquerade as
// dated — they sort and group as undated.
function hasDate(d: DecisionLike): boolean {
  return typeof d.decided_on === "string" && d.decided_on.trim() !== "";
}

// "2026-07-15" -> "2026-07". Purely lexical: no Date parsing, so a stored ISO
// day is never shifted across a month boundary by the runner's timezone.
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  const idx = Number(month) - 1;
  const name = MONTH_NAMES[idx];
  // Fall back to the raw key rather than "undefined 2026" on a malformed month.
  return name ? `${name} ${year}` : key;
}

/**
 * Newest `decided_on` first; undated rows last. Order within an equal key
 * (same date, or the undated tail) is preserved. Does not mutate the input.
 */
export function sortByDate<T extends DecisionLike>(decisions: T[]): T[] {
  // Decorate with the original index so ties resolve to input order regardless
  // of the host engine's sort stability guarantees.
  return decisions
    .map((d, i) => ({ d, i }))
    .sort((a, b) => {
      const aDated = hasDate(a.d);
      const bDated = hasDate(b.d);
      if (aDated !== bDated) return aDated ? -1 : 1; // dated before undated
      if (aDated && bDated && a.d.decided_on !== b.d.decided_on) {
        // ISO YYYY-MM-DD sorts correctly as plain strings; descending = newest first.
        return a.d.decided_on! < b.d.decided_on! ? 1 : -1;
      }
      return a.i - b.i;
    })
    .map((x) => x.d);
}

/**
 * Groups decisions into month buckets, newest month first, with every undated
 * row collected under a final "No date" group. Items inside each group are
 * ordered newest-first. The "No date" group is omitted when nothing is undated.
 */
export function groupByMonth<T extends DecisionLike>(decisions: T[]): MonthGroup<T>[] {
  const sorted = sortByDate(decisions);
  const groups: MonthGroup<T>[] = [];
  // Encounter-order bucketing over an already-sorted list yields newest-first
  // months for free, and drops every undated row into one shared trailing key.
  const byKey = new Map<string, MonthGroup<T>>();

  for (const d of sorted) {
    const key = hasDate(d) ? monthKey(d.decided_on!) : NO_DATE_LABEL;
    let group = byKey.get(key);
    if (!group) {
      group = { label: key === NO_DATE_LABEL ? NO_DATE_LABEL : monthLabel(key), items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(d);
  }

  // A trailing "No date" bucket may only appear because undated rows sort last,
  // so it is already positioned correctly — no reordering needed.
  return groups;
}

/**
 * A log entry earns its keep only when it records both the choice and the
 * reason for it. Whitespace-only counts as absent.
 */
export function isComplete(d: DecisionLike): boolean {
  return d.decision.trim() !== "" && d.why.trim() !== "";
}

export function incompleteCount(decisions: DecisionLike[]): number {
  return decisions.reduce((n, d) => (isComplete(d) ? n : n + 1), 0);
}

/**
 * Case-insensitive substring match across the fields a reader actually
 * searches by: title, the choice, the reason, and the rejected alternatives.
 * An empty or whitespace query returns the list unchanged.
 */
export function searchDecisions<T extends DecisionLike>(decisions: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (q === "") return decisions;
  return decisions.filter((d) => {
    const hay = `${d.title}\n${d.decision}\n${d.why}\n${d.alternatives}`.toLowerCase();
    return hay.includes(q);
  });
}
