import { describe, it, expect } from "vitest";

import {
  addMustHave, checklistFor, editMustHave, isMaterialized, removeMustHave,
  roomProgress, roomsProgressBps, splitMustHaves, toggleMustHave,
} from "../rooms";
import type { RoomLike } from "../rooms";

// The Kitchen's real must_haves string, verbatim from the workbook.
const KITCHEN = "No sink in the island · butler's pantry · 2 dishwashers · microwave in island or pantry · coffee & tea bar · glass rinser in sink · water-bottle dispenser";

describe("splitMustHaves", () => {
  it("splits the real Kitchen string into its seven items", () => {
    expect(splitMustHaves(KITCHEN)).toEqual([
      "No sink in the island",
      "butler's pantry",
      "2 dishwashers",
      "microwave in island or pantry",
      "coffee & tea bar",
      "glass rinser in sink",
      "water-bottle dispenser",
    ]);
  });

  it("returns nothing for empty text", () => {
    expect(splitMustHaves("")).toEqual([]);
    expect(splitMustHaves("   ")).toEqual([]);
  });

  it("treats a lone phrase as one item", () => {
    expect(splitMustHaves("Two-story closet")).toEqual(["Two-story closet"]);
  });

  // Deliberate: "Microwave, prep counter, deep storage" is three items, but
  // "no sink in the island, and two dishwashers" is prose. We do not guess.
  it("does NOT split on commas", () => {
    expect(splitMustHaves("Microwave, prep counter, deep storage"))
      .toEqual(["Microwave, prep counter, deep storage"]);
  });

  it("splits on bullets, pipes, semicolons and newlines", () => {
    expect(splitMustHaves("a • b | c ; d\ne")).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("collapses runs of separators and drops empties", () => {
    expect(splitMustHaves("a ·· b ·  · c")).toEqual(["a", "b", "c"]);
  });

  it("keeps ampersands and hyphens inside an item", () => {
    expect(splitMustHaves("coffee & tea bar · water-bottle dispenser"))
      .toEqual(["coffee & tea bar", "water-bottle dispenser"]);
  });
});

describe("checklistFor", () => {
  it("derives from must_haves when nothing has been materialized", () => {
    const room = { id: "r0", must_haves: "a · b" };
    expect(checklistFor(room)).toEqual([
      { id: "mh0", text: "a", done: false },
      { id: "mh1", text: "b", done: false },
    ]);
    expect(isMaterialized(room)).toBe(false);
  });

  it("prefers materialized items once they exist", () => {
    const room = {
      id: "r0",
      must_haves: "a · b",
      must_have_items: [{ id: "mh0", text: "a", done: true }],
    };
    expect(checklistFor(room)).toHaveLength(1);
    expect(checklistFor(room)[0].done).toBe(true);
    expect(isMaterialized(room)).toBe(true);
  });

  it("never mutates the original text", () => {
    const room: RoomLike = { id: "r0", must_haves: KITCHEN };
    checklistFor(room);
    toggleMustHave(room, "mh0");
    expect(room.must_haves).toBe(KITCHEN);
    expect(room.must_have_items).toBeUndefined();
  });
});

describe("roomProgress", () => {
  it("is zero when the room has no must-haves", () => {
    expect(roomProgress({ id: "r", must_haves: "" })).toEqual({ done: 0, total: 0, bps: 0 });
  });

  it("counts done over total", () => {
    const room = {
      id: "r",
      must_have_items: [
        { id: "a", text: "a", done: true },
        { id: "b", text: "b", done: true },
        { id: "c", text: "c", done: false },
        { id: "d", text: "d", done: false },
      ],
    };
    expect(roomProgress(room)).toEqual({ done: 2, total: 4, bps: 5000 });
  });

  it("reports 0% for a freshly derived room", () => {
    expect(roomProgress({ id: "r", must_haves: KITCHEN })).toEqual({ done: 0, total: 7, bps: 0 });
  });
});

describe("roomsProgressBps", () => {
  it("weights by item count, not by room", () => {
    // Room A: 1 of 1 done. Room B: 0 of 9 done.
    // Per-room average would say 50%. Weighted says 10%.
    const rooms = [
      { id: "a", must_have_items: [{ id: "1", text: "x", done: true }] },
      { id: "b", must_have_items: Array.from({ length: 9 }, (_, i) => ({ id: `${i}`, text: "y", done: false })) },
    ];
    expect(roomsProgressBps(rooms)).toBe(1000);
  });

  it("is zero when no room has any must-haves", () => {
    expect(roomsProgressBps([{ id: "a", must_haves: "" }])).toBe(0);
  });
});

describe("mutations", () => {
  const room = { id: "r0", must_haves: "a · b · c" };

  it("toggles an item without touching the others", () => {
    const next = toggleMustHave(room, "mh1");
    expect(next.map((i) => i.done)).toEqual([false, true, false]);
  });

  it("adds an item with an id that cannot collide with derived ids", () => {
    const next = addMustHave(room, "d");
    expect(next).toHaveLength(4);
    expect(next[3].text).toBe("d");
    expect(next[3].id).not.toMatch(/^mh\d+$/);
  });

  it("ignores an empty addition", () => {
    expect(addMustHave(room, "   ")).toHaveLength(3);
  });

  it("removes an item", () => {
    expect(removeMustHave(room, "mh1").map((i) => i.text)).toEqual(["a", "c"]);
  });

  it("edits an item's text and keeps its done state", () => {
    const toggled = toggleMustHave(room, "mh0");
    const edited = editMustHave({ ...room, must_have_items: toggled }, "mh0", "A!");
    expect(edited[0]).toEqual({ id: "mh0", text: "A!", done: true });
  });
});
