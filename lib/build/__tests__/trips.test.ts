import { describe, it, expect } from "vitest";

import type { BuildTrip, BuildTripItem, TripItemStatus } from "@/actions/build/_store";
import {
  capturedCount,
  totalCount,
  tripProgressBps,
  budgetCents,
  stillNeeded,
  itemsWithoutMedia,
  tripTasks,
  itemNameFromTaskTitle,
  suggestItemsFromTasks,
  CHINA_SOURCING_TAG,
  type SourcingTaskLike,
} from "../trips";

// The thirteen real titles the workbook import produces (Sheet21). Kept in
// sync with scripts/build/plan-import.mjs CHINA_SOURCING.
const REAL_TITLES = [
  "Source windows in China",
  "Source doors in China",
  "Source cabinets in China",
  "Source closets in China",
  "Source stairs in China",
  "Source door handles in China",
  "Source furniture in China",
  "Source gym equipment in China",
  "Source sauna in China",
  "Source cold plunge in China",
  "Source turf grass in China",
  "Source water-vapor fireplace in China",
  "Source christmas tree in China",
];

const task = (over: Partial<SourcingTaskLike> & { id: string; title: string }): SourcingTaskLike => ({
  notes: "",
  tags: [CHINA_SOURCING_TAG],
  archived: false,
  ...over,
});

const realTasks = (): SourcingTaskLike[] =>
  REAL_TITLES.map((title, i) => task({ id: `t${i}`, title }));

let seq = 0;
const item = (over: Partial<BuildTripItem> = {}): BuildTripItem => ({
  id: `i${seq++}`,
  item: "Windows",
  vendor: "",
  specs: "",
  budget_cents: 0,
  status: "todo" as TripItemStatus,
  media_count: 0,
  notes: "",
  ...over,
});

const trip = (items: BuildTripItem[], over: Partial<BuildTrip> = {}): BuildTrip => ({
  id: "trip1",
  name: "China sourcing trip",
  start: null,
  end: null,
  notes: "",
  items,
  ...over,
});

describe("counts and progress", () => {
  it("counts captured AND ordered as handled, todo as still-needed", () => {
    const t = trip([
      item({ status: "todo" }),
      item({ status: "captured" }),
      item({ status: "ordered" }),
      item({ status: "todo" }),
    ]);
    expect(totalCount(t)).toBe(4);
    expect(capturedCount(t)).toBe(2);
    expect(stillNeeded(t)).toHaveLength(2);
    // The partition is total-covering: handled + still-needed = total.
    expect(capturedCount(t) + stillNeeded(t).length).toBe(totalCount(t));
  });

  it("progress is captured+ordered over total, in basis points", () => {
    const t = trip([
      item({ status: "captured" }),
      item({ status: "ordered" }),
      item({ status: "todo" }),
      item({ status: "todo" }),
    ]);
    expect(tripProgressBps(t)).toBe(5000);
  });

  it("rounds progress to the nearest basis point", () => {
    const t = trip([item({ status: "captured" }), item({ status: "todo" }), item({ status: "todo" })]);
    expect(tripProgressBps(t)).toBe(3333);
  });

  it("returns 0 progress on an empty trip rather than dividing by zero", () => {
    expect(tripProgressBps(trip([]))).toBe(0);
    expect(totalCount(trip([]))).toBe(0);
    expect(capturedCount(trip([]))).toBe(0);
    expect(stillNeeded(trip([]))).toEqual([]);
  });

  it("ignores archived items in every count", () => {
    const t = trip([
      item({ status: "captured" }),
      item({ status: "captured", archived: true }),
      item({ status: "todo", archived: true }),
      item({ status: "todo" }),
    ]);
    expect(totalCount(t)).toBe(2);
    expect(capturedCount(t)).toBe(1);
    expect(stillNeeded(t)).toHaveLength(1);
    expect(tripProgressBps(t)).toBe(5000);
  });
});

describe("budgetCents", () => {
  it("sums item budgets in integer cents", () => {
    const t = trip([
      item({ budget_cents: 150000 }),
      item({ budget_cents: 899_99 }),
      item({ budget_cents: 0 }),
    ]);
    expect(budgetCents(t)).toBe(150000 + 89999);
  });

  it("excludes archived items from the budget", () => {
    const t = trip([item({ budget_cents: 100000 }), item({ budget_cents: 500000, archived: true })]);
    expect(budgetCents(t)).toBe(100000);
  });

  it("is 0 for an empty trip", () => {
    expect(budgetCents(trip([]))).toBe(0);
  });
});

describe("itemsWithoutMedia", () => {
  it("flags captured/ordered items that came back with no photos", () => {
    const noPhotos = item({ status: "captured", media_count: 0, item: "Doors" });
    const ordered = item({ status: "ordered", media_count: 0, item: "Stairs" });
    const t = trip([
      noPhotos,
      ordered,
      item({ status: "captured", media_count: 3 }), // has media — fine
      item({ status: "todo", media_count: 0 }), // still on the list — not a lie
    ]);
    const flagged = itemsWithoutMedia(t);
    expect(flagged.map((i) => i.item)).toEqual(["Doors", "Stairs"]);
  });

  it("does not flag a todo item with no media", () => {
    expect(itemsWithoutMedia(trip([item({ status: "todo", media_count: 0 })]))).toEqual([]);
  });
});

describe("itemNameFromTaskTitle", () => {
  it("strips the Source prefix and the in-China suffix, capitalizing the noun", () => {
    expect(itemNameFromTaskTitle("Source windows in China")).toBe("Windows");
    expect(itemNameFromTaskTitle("Source water-vapor fireplace in China")).toBe("Water-vapor fireplace");
    expect(itemNameFromTaskTitle("Source door handles in China")).toBe("Door handles");
  });

  it("falls back to the raw title when the framing is absent", () => {
    expect(itemNameFromTaskTitle("Buy a tractor")).toBe("Buy a tractor");
  });
});

describe("suggestItemsFromTasks", () => {
  it("derives all thirteen items from the real sourcing titles", () => {
    const items = suggestItemsFromTasks(realTasks());
    expect(items).toHaveLength(13);
    const names = items.map((i) => i.item);
    expect(names).toContain("Windows");
    expect(names).toContain("Water-vapor fireplace");
    expect(names).toContain("Door handles");
    expect(names).toContain("Christmas tree");
  });

  it("carries each task's notes onto the item", () => {
    const tasks = [
      task({
        id: "tw",
        title: "Source windows in China",
        notes: "At the window factory, take videos of how they are installed and put together.",
      }),
    ];
    const [it] = suggestItemsFromTasks(tasks);
    expect(it.notes).toContain("take videos of how they are installed");
  });

  it("seeds items todo, with zero budget and zero media", () => {
    const [it] = suggestItemsFromTasks([task({ id: "tw", title: "Source windows in China" })]);
    expect(it.status).toBe("todo");
    expect(it.budget_cents).toBe(0);
    expect(it.media_count).toBe(0);
  });

  it("derives a stable item id from the task id so re-seeding never duplicates", () => {
    const t = task({ id: "abc", title: "Source doors in China" });
    expect(suggestItemsFromTasks([t])[0].id).toBe("ti_abc");
    expect(suggestItemsFromTasks([t])[0].id).toBe(suggestItemsFromTasks([t])[0].id);
  });

  it("ignores tasks that are not tagged china sourcing", () => {
    const tasks = [
      task({ id: "a", title: "Source doors in China", tags: ["kitchen"] }),
      task({ id: "b", title: "Source cabinets in China" }),
    ];
    expect(suggestItemsFromTasks(tasks)).toHaveLength(1);
    expect(suggestItemsFromTasks(tasks)[0].item).toBe("Cabinets");
  });

  it("ignores archived tasks", () => {
    const tasks = [task({ id: "a", title: "Source doors in China", archived: true })];
    expect(suggestItemsFromTasks(tasks)).toEqual([]);
  });
});

describe("tripTasks", () => {
  it("returns only china-sourcing tasks whose title names one of the trip's items", () => {
    const tasks = realTasks();
    const t = trip([item({ item: "Windows" }), item({ item: "Door handles" })]);
    const matched = tripTasks(tasks, t).map((x) => x.title);
    expect(matched).toContain("Source windows in China");
    expect(matched).toContain("Source door handles in China");
    expect(matched).not.toContain("Source cabinets in China");
  });

  it("tolerates singular/plural mismatch between item name and task title", () => {
    const tasks = [task({ id: "a", title: "Source windows in China" })];
    // Item named in the singular still matches the plural task title.
    const t = trip([item({ item: "Window" })]);
    expect(tripTasks(tasks, t)).toHaveLength(1);
  });

  it("matches case-insensitively", () => {
    const tasks = [task({ id: "a", title: "SOURCE DOORS IN CHINA" })];
    expect(tripTasks(tasks, trip([item({ item: "doors" })]))).toHaveLength(1);
  });

  it("excludes tasks missing the china sourcing tag even if the title matches", () => {
    const tasks = [task({ id: "a", title: "Source doors in China", tags: [] })];
    expect(tripTasks(tasks, trip([item({ item: "Doors" })]))).toEqual([]);
  });

  it("excludes archived tasks", () => {
    const tasks = [task({ id: "a", title: "Source doors in China", archived: true })];
    expect(tripTasks(tasks, trip([item({ item: "Doors" })]))).toEqual([]);
  });

  it("returns nothing for a trip with no items", () => {
    expect(tripTasks(realTasks(), trip([]))).toEqual([]);
  });

  it("round-trips: items suggested from tasks all match back via tripTasks", () => {
    const tasks = realTasks();
    const t = trip(suggestItemsFromTasks(tasks));
    // Every suggested item should re-associate with its source task.
    expect(tripTasks(tasks, t)).toHaveLength(13);
  });
});
