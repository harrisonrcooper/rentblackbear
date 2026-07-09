// Materials & Products catalogue — pure logic (brief §6.5).
//
// No React, no network. The section (app/admin/build/sections/Materials.jsx)
// imports these; the tests import these. Keeping the arithmetic here, isolated
// from rendering, is what lets the money math be tested to the penny.
//
// Money is integer cents throughout. `extendedCents` is the only place a
// price is multiplied by a quantity, so it is also the only place a fractional
// unit (12.5 sq ft of tile) could produce fractional cents — and the one place
// that rounds. Everything downstream sums already-rounded integers.

import type { BuildMaterial, MaterialStatus } from "@/actions/build/_store";

/** Chip tones the section may hand to <Chip tone=…>. */
export type ChipTone = "neutral" | "accent" | "green" | "amber" | "red";

/** Lifecycle of a material, earliest → latest. Drives ordering and the picker. */
export const STATUS_ORDER: MaterialStatus[] = [
  "idea",
  "researching",
  "decided",
  "ordered",
  "received",
  "installed",
];

export const STATUS_LABEL: Record<MaterialStatus, string> = {
  idea: "Idea",
  researching: "Researching",
  decided: "Decided",
  ordered: "Ordered",
  received: "Received",
  installed: "Installed",
};

/**
 * Colour is rationed to three honest tiers, not one hue per status:
 *   · still exploring (idea, researching)        → neutral
 *   · committed / in the pipeline (decided, ordered) → accent
 *   · physically in hand (received, installed)   → green
 * A glance tells you what is real and what is still a maybe.
 */
export function statusTone(status: MaterialStatus): ChipTone {
  switch (status) {
    case "decided":
    case "ordered":
      return "accent";
    case "received":
    case "installed":
      return "green";
    default:
      return "neutral";
  }
}

/** The trimmed comparison key, or "" for an ungrouped material. */
function groupKey(m: BuildMaterial): string {
  return (m.compare_group || "").trim();
}

/**
 * Extended price = unit price × quantity, in integer cents.
 *
 * Rounded because a quantity can be fractional (per-sq-ft materials) and money
 * must never carry a partial cent into a sum. For whole quantities this is a
 * no-op, so the plain "price × qty" arithmetic the brief calls for is exact.
 */
export function extendedCents(m: BuildMaterial): number {
  const price = Number(m.unit_price_cents) || 0;
  const qty = Number(m.quantity) || 0;
  return Math.round(price * qty);
}

/**
 * Bucket materials by their comparison group. Ungrouped rows (blank
 * compare_group) are skipped — they are not competing with anything. Insertion
 * order is preserved both across groups and within each group.
 */
export function groupsOf(materials: BuildMaterial[]): Map<string, BuildMaterial[]> {
  const out = new Map<string, BuildMaterial[]>();
  for (const m of materials) {
    const key = groupKey(m);
    if (!key) continue;
    const existing = out.get(key);
    if (existing) existing.push(m);
    else out.set(key, [m]);
  }
  return out;
}

/** The one row marked as the winner, or null while the decision is open. */
export function chosenIn(group: BuildMaterial[]): BuildMaterial | null {
  return group.find((m) => m.is_chosen) || null;
}

/** Lowest extended price; null on an empty group; the first row wins a tie. */
export function cheapestIn(group: BuildMaterial[]): BuildMaterial | null {
  let best: BuildMaterial | null = null;
  let bestCents = Infinity;
  for (const m of group) {
    const c = extendedCents(m);
    if (c < bestCents) {
      bestCents = c;
      best = m;
    }
  }
  return best;
}

/**
 * Return a NEW array in which `id` is the chosen winner and every sibling in
 * its comparison group is un-chosen. Rows in other groups (and ungrouped rows)
 * are returned untouched. If `id` is not found the array is copied unchanged —
 * callers always receive a fresh array they can diff against.
 */
export function chooseWinner(materials: BuildMaterial[], id: string): BuildMaterial[] {
  const target = materials.find((m) => m.id === id);
  const group = target ? groupKey(target) : "";
  return materials.map((m) => {
    if (m.id === id) return { ...m, is_chosen: true };
    if (group && groupKey(m) === group) return { ...m, is_chosen: false };
    return m;
  });
}

/**
 * Catalogue total in cents, without double-counting a comparison.
 *
 * An ungrouped material is always counted. A grouped material counts only when
 * it is the chosen winner — so a group of three alternatives with one chosen
 * contributes that row's extended price exactly once, and a group with no
 * choice yet contributes nothing (you haven't committed the money).
 */
export function totalCents(materials: BuildMaterial[]): number {
  // A "group" of one is not a comparison — it is a material that happens to
  // carry a label. Excluding it because nothing is marked chosen makes its
  // price silently vanish from the catalogue total, which is how a budget ends
  // up wrong by the cost of a kitchen.
  const sizes = new Map<string, number>();
  for (const m of materials) {
    const key = groupKey(m);
    if (key) sizes.set(key, (sizes.get(key) || 0) + 1);
  }

  let sum = 0;
  let counted: Set<string> | null = null;

  for (const m of materials) {
    const key = groupKey(m);
    const isRealComparison = key !== "" && (sizes.get(key) || 0) > 1;

    if (!isRealComparison) { sum += extendedCents(m); continue; }
    if (!m.is_chosen) continue;

    // Defensive: two chosen rows in one group means the blob was written by
    // something other than chooseWinner. Count the group once, not twice.
    counted ??= new Set<string>();
    if (counted.has(key)) continue;
    counted.add(key);
    sum += extendedCents(m);
  }
  return sum;
}

/** Materials that go into a given room. */
export function byRoom(materials: BuildMaterial[], roomId: string): BuildMaterial[] {
  return materials.filter((m) => Array.isArray(m.room_ids) && m.room_ids.includes(roomId));
}

/** Materials at a given lifecycle status. */
export function byStatus(materials: BuildMaterial[], status: MaterialStatus): BuildMaterial[] {
  return materials.filter((m) => m.status === status);
}
