// Three-way merge for the build-planner blob.
//
// When two editors save at once, the loser gets a compare-and-swap conflict
// (lib/app-data.ts) instead of silently clobbering. This module is how the
// loser recovers: given the state it last saw the server hold (`base`), its
// own unsaved state (`mine`), and what the server actually holds now
// (`theirs`), produce a merged state that keeps BOTH edits.
//
// The governing rule is "never lose data." Where the two sides genuinely
// disagree about the same field, the local edit wins (the user is looking at
// it) and the collision is reported so the UI can say so out loud. Where one
// side deleted something the other side edited, the EDIT wins and the delete
// is undone — resurrecting a row is recoverable, losing one is not.

type Json = unknown;
type Row = Record<string, Json> & { id: string };
type Bag = Record<string, Json>;

export interface MergeReport {
  /** Human-readable collisions, e.g. 'rooms → Kitchen: kept your "must_haves"'. */
  conflicts: string[];
  /** Rows a delete was undone on because the other side had edited them. */
  resurrected: string[];
}

export interface MergeResult<T> {
  merged: T;
  report: MergeReport;
}

const isRow = (v: Json): v is Row =>
  typeof v === "object" && v !== null && !Array.isArray(v) && typeof (v as Row).id === "string";

const isPlainObject = (v: Json): v is Bag =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const same = (a: Json, b: Json): boolean => JSON.stringify(a) === JSON.stringify(b);

/** A short human label for a row, for conflict messages. */
function rowLabel(row: Bag): string {
  for (const k of ["name", "label", "title", "item", "question", "description", "room"]) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim().slice(0, 40);
  }
  return String(row.id ?? "?");
}

/** Merge one row's fields. Local wins a true collision. */
function mergeRow(field: string, base: Bag | undefined, mine: Bag, theirs: Bag, report: MergeReport): Bag {
  const out: Bag = { ...theirs };
  const keys = new Set([...Object.keys(mine), ...Object.keys(theirs)]);

  for (const k of keys) {
    const b = base?.[k];
    const m = mine[k];
    const t = theirs[k];

    if (same(m, t)) { out[k] = m; continue; }
    if (base && same(m, b)) { out[k] = t; continue; }   // only they changed it
    if (base && same(t, b)) { out[k] = m; continue; }   // only I changed it

    out[k] = m;                                          // both changed it — local wins
    report.conflicts.push(`${field} → ${rowLabel(mine)}: kept your "${k}"`);
  }
  return out;
}

/** Merge an array of {id,...} rows by id, preserving local ordering. */
function mergeRows(field: string, base: Row[], mine: Row[], theirs: Row[], report: MergeReport): Row[] {
  const byId = (rows: Row[]) => new Map(rows.map((r) => [r.id, r]));
  const B = byId(base);
  const M = byId(mine);
  const T = byId(theirs);

  const merged = new Map<string, Row>();
  for (const id of new Set([...M.keys(), ...T.keys(), ...B.keys()])) {
    const b = B.get(id);
    const m = M.get(id);
    const t = T.get(id);

    if (m && t) { merged.set(id, mergeRow(field, b, m, t, report) as Row); continue; }

    // Added on exactly one side — keep it.
    if (m && !t && !b) { merged.set(id, m); continue; }
    if (t && !m && !b) { merged.set(id, t); continue; }

    // Deleted on one side. An edit on the other side outranks the delete.
    if (b && m && !t) {
      if (!same(m, b)) {
        merged.set(id, m);
        report.resurrected.push(`${field} → ${rowLabel(m)} (they deleted it, you had edited it)`);
      }
      continue;
    }
    if (b && t && !m) {
      if (!same(t, b)) {
        merged.set(id, t);
        report.resurrected.push(`${field} → ${rowLabel(t)} (you deleted it, they had edited it)`);
      }
      continue;
    }
    // Deleted on both sides, or nonsense — drop it.
  }

  // Local order first, then anything only they have, in their order.
  const out: Row[] = [];
  const taken = new Set<string>();
  for (const r of mine) {
    const hit = merged.get(r.id);
    if (hit) { out.push(hit); taken.add(r.id); }
  }
  for (const r of theirs) {
    if (taken.has(r.id)) continue;
    const hit = merged.get(r.id);
    if (hit) { out.push(hit); taken.add(r.id); }
  }
  for (const [id, r] of merged) if (!taken.has(id)) out.push(r);

  return out;
}

/**
 * Three-way merge of two build-state blobs.
 *
 * Arrays whose elements carry a string `id` merge per row; every other value
 * merges as a scalar. `mine` wins any collision it cannot resolve, and the
 * collision lands in `report.conflicts` so the user is told rather than
 * quietly overruled.
 */
export function mergeBuildState<T extends Bag>(base: T, mine: T, theirs: T): MergeResult<T> {
  const report: MergeReport = { conflicts: [], resurrected: [] };
  const out: Bag = {};
  const keys = new Set([...Object.keys(mine), ...Object.keys(theirs)]);

  for (const k of keys) {
    const b = base?.[k];
    const m = mine[k];
    const t = theirs[k];

    if (same(m, t)) { out[k] = m; continue; }

    const bothRowArrays =
      Array.isArray(m) && Array.isArray(t) &&
      [...m, ...t].every((x) => isRow(x as Json));

    if (bothRowArrays) {
      out[k] = mergeRows(k, Array.isArray(b) ? (b as Row[]) : [], m as Row[], t as Row[], report);
      continue;
    }

    if (isPlainObject(m) && isPlainObject(t)) {
      out[k] = mergeRow(k, isPlainObject(b) ? b : undefined, m, t, report);
      continue;
    }

    if (same(m, b)) { out[k] = t; continue; }
    if (same(t, b)) { out[k] = m; continue; }

    out[k] = m;
    report.conflicts.push(`${k}: kept your value`);
  }

  return { merged: out as T, report };
}
