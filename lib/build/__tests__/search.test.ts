import { describe, it, expect } from "vitest";

import { ENTITY_REGISTRY, ENTITY_TYPES } from "../entities";
import { buildSearchIndex, search } from "../search";
import type { BuildState } from "@/actions/build/_store";

const state = {
  project_name: "Our Dream Home",
  style: "Modern French Country",
  notes: "butler's pantry, two-story closet",
  rooms: [
    { id: "r0", name: "Kitchen", level: "Main", must_haves: "no sink in the island, two dishwashers" },
    { id: "r1", name: "Studio", level: "Upstairs", must_haves: "vaulted ceilings" },
    { id: "r2", name: "Gone", level: "", must_haves: "", archived: true },
  ],
  team: [
    { id: "t0", role: "Cabinets", name: "Sjumbo — Kasin", contact: "+86 191 292 64057" },
    { id: "t1", role: "Interior doors", name: "Tryba Home — Sukie", contact: "+86 181 5108 3705" },
  ],
  references: [
    { id: "ref0", title: "Aquafire Pro", url: "https://www.aquafire.com/products/aquafire-pro", tag: "Products", note: "" },
  ],
  selections: [
    { id: "s0", label: "Flooring", choice: "White oak (Rainforest)", vendor: "", status: "open" },
  ],
  wishlist: [], costs: [], milestones: [], boards: [], palette: [], documents: [], photos: [],
  change_orders: [], payments: [], inspections: [], punch_list: [], rfis: [], as_built: [],
  warranties: [], energy: [], draws: [],
  loan: { amount_cents: 0, rate_bps: 0 },
  budget_cents: 0, sqft: 0, stories: 2, lot: "", schema_version: 1, last_modified_at: null,
} as unknown as BuildState;

const tasks = [
  { id: "tsk0", title: "Order white oak doors", notes: "confirm hinge count with Sukie", status: "todo" },
  { id: "tsk1", title: "Archived task", notes: "", status: "todo", archived: true },
];

const index = buildSearchIndex(state, { task: tasks });

describe("buildSearchIndex", () => {
  it("indexes every registered entity type that has rows", () => {
    const types = new Set(index.map((d) => d.type));
    expect(types).toContain("project");
    expect(types).toContain("room");
    expect(types).toContain("team");
    expect(types).toContain("reference");
    expect(types).toContain("task");
  });

  it("skips archived rows", () => {
    expect(index.find((d) => d.id === "r2")).toBeUndefined();
    expect(index.find((d) => d.id === "tsk1")).toBeUndefined();
  });

  it("gives every doc a deep link carrying its section and id", () => {
    const kitchen = index.find((d) => d.id === "r0")!;
    expect(kitchen.url).toBe("/admin/build?s=rooms&item=r0");
    expect(kitchen.section).toBe("rooms");
    expect(kitchen.kindLabel).toBe("Room");
  });

  it("every entity type in the closed union has a registry entry", () => {
    for (const t of ENTITY_TYPES) expect(ENTITY_REGISTRY[t]).toBeDefined();
  });
});

describe("search", () => {
  it("returns nothing for an empty query", () => {
    expect(search(index, "")).toEqual([]);
    expect(search(index, "   ")).toEqual([]);
  });

  it("finds a room by name", () => {
    expect(search(index, "kitchen")[0].id).toBe("r0");
  });

  it("finds a vendor by a mid-name word start", () => {
    // 'Kasin' starts a word after an em-dash-space in "Sjumbo — Kasin".
    expect(search(index, "kasin")[0].id).toBe("t0");
  });

  it("finds a vendor by phone number fragment", () => {
    expect(search(index, "5108")[0].id).toBe("t1");
  });

  it("searches fields beyond the title — a room's must-haves", () => {
    expect(search(index, "dishwashers")[0].id).toBe("r0");
  });

  it("searches a task's notes", () => {
    const hits = search(index, "hinge");
    expect(hits[0].type).toBe("task");
    expect(hits[0].id).toBe("tsk0");
  });

  it("requires EVERY term to match", () => {
    expect(search(index, "kitchen dishwashers").map((d) => d.id)).toEqual(["r0"]);
    expect(search(index, "kitchen zebra")).toEqual([]);
  });

  it("ranks a title hit above a body hit", () => {
    // "oak" is in the task title and in the selection's choice field.
    const hits = search(index, "oak");
    expect(hits[0].id).toBe("tsk0");         // "Order white oak doors" — title
    expect(hits.map((d) => d.id)).toContain("s0"); // "White oak (Rainforest)" — subtitle
  });

  it("ranks an exact title match first", () => {
    expect(search(index, "studio")[0].id).toBe("r1");
  });

  it("prefers a word-start match over a mid-word one", () => {
    // 'kit' starts "Kitchen"; it appears nowhere else as a word start.
    expect(search(index, "kit")[0].id).toBe("r0");
  });

  it("is case-insensitive", () => {
    expect(search(index, "KITCHEN")[0].id).toBe("r0");
  });

  it("respects the limit", () => {
    expect(search(index, "o", 2)).toHaveLength(2);
  });

  it("finds the project itself", () => {
    expect(search(index, "dream home")[0].type).toBe("project");
  });
});

describe("nested rows are searchable", () => {
  // A room's requirements move from `must_haves` (frozen seed text) into
  // `must_have_items` the moment the user ticks one. Indexing only the former
  // made every item he added afterwards unfindable.
  it("finds a checklist item the user added after materialization", () => {
    const withChecklist = {
      ...state,
      rooms: [{
        id: "r9", name: "Pantry", level: "Main", must_haves: "shelving",
        must_have_items: [
          { id: "a", text: "shelving", done: true },
          { id: "b", text: "glass rinser at the prep sink", done: false },
        ],
      }],
    } as unknown as BuildState;

    const idx = buildSearchIndex(withChecklist, {});
    expect(search(idx, "rinser").map((d) => d.id)).toEqual(["r9"]);
    expect(search(idx, "shelving").map((d) => d.id)).toEqual(["r9"]);
  });

  it("finds a sourcing trip by one of its item names", () => {
    const withTrip = {
      ...state,
      trips: [{
        id: "trip1", name: "Guangzhou, October", start: null, end: null, notes: "",
        items: [{ id: "i1", item: "Water-vapor fireplace", vendor: "", specs: "", budget_cents: 0, status: "todo", media_count: 0, notes: "" }],
      }],
    } as unknown as BuildState;

    const idx = buildSearchIndex(withTrip, {});
    expect(search(idx, "vapor").map((d) => d.type)).toContain("trip");
  });
});
