// A room's must-haves, as a checklist rather than a paragraph.
//
// The workbook wrote each room's requirements as one bullet string joined by
// "·". That reads fine and tracks nothing. Turning it into checkable items is
// what gives a room a completion percentage, which is what lets the dashboard
// ring mean something.
//
// The conversion is DERIVED, not destructive: `must_haves` stays exactly as it
// was, and `must_have_items` is materialized the first time you tick a box. If
// this code were deleted tomorrow, the original text would still be there.

export interface MustHave {
  id: string;
  text: string;
  done: boolean;
}

export interface RoomLike {
  id: string;
  must_haves?: string;
  must_have_items?: MustHave[];
}

// Only separators a human typed on purpose. Commas are excluded: "Microwave,
// prep counter, deep storage" is three items, but "no sink in the island, two
// dishwashers, and a glass rinser" is prose, and telling them apart is a coin
// flip. Guessing wrong silently mangles the spec, so we don't guess — the user
// can split a line in the UI.
const SEPARATORS = /[·•|;\n]+/;

export function splitMustHaves(text: string): string[] {
  if (!text) return [];
  return text
    .split(SEPARATORS)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The room's checklist. Once `must_have_items` exists it is authoritative;
 * until then the list is derived from the original text on every read.
 */
export function checklistFor(room: RoomLike): MustHave[] {
  if (Array.isArray(room.must_have_items) && room.must_have_items.length > 0) {
    return room.must_have_items;
  }
  return splitMustHaves(room.must_haves || "").map((text, i) => ({
    id: `mh${i}`,
    text,
    done: false,
  }));
}

/** True once the checklist has been written back to the row. */
export function isMaterialized(room: RoomLike): boolean {
  return Array.isArray(room.must_have_items) && room.must_have_items.length > 0;
}

export interface RoomProgress {
  done: number;
  total: number;
  /** Basis points, 0..10000. 0 when the room has no must-haves at all. */
  bps: number;
}

export function roomProgress(room: RoomLike): RoomProgress {
  const items = checklistFor(room);
  const done = items.filter((i) => i.done).length;
  return {
    done,
    total: items.length,
    bps: items.length ? Math.round((done / items.length) * 10000) : 0,
  };
}

/** Aggregate completion across rooms, weighted by each room's item count. */
export function roomsProgressBps(rooms: RoomLike[]): number {
  let done = 0;
  let total = 0;
  for (const r of rooms) {
    const p = roomProgress(r);
    done += p.done;
    total += p.total;
  }
  return total ? Math.round((done / total) * 10000) : 0;
}

/** Toggle one item, materializing the checklist on first write. */
export function toggleMustHave(room: RoomLike, itemId: string): MustHave[] {
  return checklistFor(room).map((i) => (i.id === itemId ? { ...i, done: !i.done } : i));
}

export function addMustHave(room: RoomLike, text: string): MustHave[] {
  const items = checklistFor(room);
  const trimmed = text.trim();
  if (!trimmed) return items;
  // Ids must not collide with the derived `mh<index>` ones.
  return [...items, { id: `mh_${Math.random().toString(36).slice(2, 9)}`, text: trimmed, done: false }];
}

export function removeMustHave(room: RoomLike, itemId: string): MustHave[] {
  return checklistFor(room).filter((i) => i.id !== itemId);
}

export function editMustHave(room: RoomLike, itemId: string, text: string): MustHave[] {
  return checklistFor(room).map((i) => (i.id === itemId ? { ...i, text } : i));
}
