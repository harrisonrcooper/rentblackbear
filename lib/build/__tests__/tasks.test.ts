import { describe, it, expect } from "vitest";

import {
  entityProgressBps, filterTasks, isOverdue, progressBps, sortTasks, subtasksOf, tasksFor,
} from "../tasks";
import type { BuildTask } from "../tasks";

let seq = 0;
const task = (over: Partial<BuildTask> = {}): BuildTask => ({
  id: `t${seq++}`,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  title: "Task",
  notes: "",
  status: "todo",
  priority: "normal",
  due: null,
  assignee: "",
  entity_type: null,
  entity_id: null,
  parent_id: null,
  tags: [],
  position: 0,
  ...over,
});

describe("tasksFor / subtasksOf", () => {
  it("returns only top-level tasks attached to the entity", () => {
    const parent = task({ id: "p", entity_type: "room", entity_id: "r0" });
    const child = task({ id: "c", parent_id: "p", entity_type: "room", entity_id: "r0" });
    const other = task({ entity_type: "room", entity_id: "r1" });
    const loose = task({});
    const all = [parent, child, other, loose];

    expect(tasksFor(all, "room", "r0").map((t) => t.id)).toEqual(["p"]);
    expect(subtasksOf(all, "p").map((t) => t.id)).toEqual(["c"]);
  });

  it("hides archived tasks", () => {
    const all = [task({ id: "a", entity_type: "room", entity_id: "r0", archived: true })];
    expect(tasksFor(all, "room", "r0")).toEqual([]);
  });
});

describe("progressBps", () => {
  it("is 0 for an empty scope", () => {
    expect(progressBps([], [])).toBe(0);
  });

  it("counts a leaf task by its own status", () => {
    const a = task({ status: "done" });
    const b = task({ status: "todo" });
    expect(progressBps([a, b], [a, b])).toBe(5000);
  });

  it("rolls a parent's progress up from its subtasks, not its own flag", () => {
    // Parent is still 'todo' but 3 of its 4 subtasks are done.
    const p = task({ id: "p", status: "todo" });
    const kids = [
      task({ parent_id: "p", status: "done" }),
      task({ parent_id: "p", status: "done" }),
      task({ parent_id: "p", status: "done" }),
      task({ parent_id: "p", status: "todo" }),
    ];
    const all = [p, ...kids];
    expect(progressBps(all, [p])).toBe(7500);
  });

  it("ignores a parent's own done flag when it has subtasks", () => {
    const p = task({ id: "p", status: "done" });
    const kids = [task({ parent_id: "p", status: "todo" }), task({ parent_id: "p", status: "todo" })];
    expect(progressBps([p, ...kids], [p])).toBe(0);
  });

  it("mixes leaves and parents", () => {
    const leaf = task({ id: "l", status: "done" });          // 1.0
    const p = task({ id: "p", status: "todo" });
    const kids = [task({ parent_id: "p", status: "done" }), task({ parent_id: "p", status: "todo" })]; // 0.5
    const all = [leaf, p, ...kids];
    expect(progressBps(all, [leaf, p])).toBe(7500);          // (1 + 0.5) / 2
  });

  it("scopes progress to one entity", () => {
    const all = [
      task({ entity_type: "room", entity_id: "r0", status: "done" }),
      task({ entity_type: "room", entity_id: "r0", status: "todo" }),
      task({ entity_type: "room", entity_id: "r1", status: "todo" }),
    ];
    expect(entityProgressBps(all, "room", "r0")).toBe(5000);
    expect(entityProgressBps(all, "room", "r1")).toBe(0);
    expect(entityProgressBps(all, "room", "nope")).toBe(0);
  });
});

describe("isOverdue", () => {
  const today = "2026-07-09";
  it("is false when due today", () => {
    expect(isOverdue(task({ due: today }), today)).toBe(false);
  });
  it("is true when due before today and not done", () => {
    expect(isOverdue(task({ due: "2026-07-08" }), today)).toBe(true);
  });
  it("is false once done", () => {
    expect(isOverdue(task({ due: "2026-07-08", status: "done" }), today)).toBe(false);
  });
  it("is false with no due date", () => {
    expect(isOverdue(task({ due: null }), today)).toBe(false);
  });
});

describe("filterTasks", () => {
  const all = [
    task({ id: "a", title: "Order white oak doors", status: "todo", priority: "urgent", tags: ["china"], due: "2026-08-01" }),
    task({ id: "b", title: "Call Kasin", status: "done", priority: "normal", tags: ["china"] }),
    task({ id: "c", title: "Pick tile", status: "blocked", priority: "high", entity_type: "room", entity_id: "r0" }),
    task({ id: "d", title: "Sub", parent_id: "c" }),
    task({ id: "e", title: "Gone", archived: true }),
  ];

  it("excludes archived and subtasks by default", () => {
    expect(filterTasks(all).map((t) => t.id)).toEqual(["a", "b", "c"]);
  });
  it("filters by status", () => {
    expect(filterTasks(all, { status: ["blocked"] }).map((t) => t.id)).toEqual(["c"]);
  });
  it("filters by entity", () => {
    expect(filterTasks(all, { entityType: "room", entityId: "r0" }).map((t) => t.id)).toEqual(["c"]);
  });
  it("filters by tag", () => {
    expect(filterTasks(all, { tag: "china" }).map((t) => t.id)).toEqual(["a", "b"]);
  });
  it("matches text case-insensitively across title and notes", () => {
    expect(filterTasks(all, { text: "KASIN" }).map((t) => t.id)).toEqual(["b"]);
  });
  it("dueBefore excludes tasks with no due date", () => {
    expect(filterTasks(all, { dueBefore: "2026-09-01" }).map((t) => t.id)).toEqual(["a"]);
  });
  it("can include subtasks and archived on request", () => {
    expect(filterTasks(all, { includeArchived: true, includeSubtasks: true })).toHaveLength(5);
  });
});

describe("sortTasks", () => {
  const today = "2026-07-09";
  it("puts overdue first, then earliest due, then priority, then position", () => {
    const overdue = task({ id: "overdue", due: "2026-07-01" });
    const soon = task({ id: "soon", due: "2026-07-20" });
    const later = task({ id: "later", due: "2026-08-20" });
    const noDueUrgent = task({ id: "urgent", due: null, priority: "urgent" });
    const noDueLow = task({ id: "low", due: null, priority: "low" });

    const order = sortTasks([later, noDueLow, soon, noDueUrgent, overdue], today).map((t) => t.id);
    expect(order).toEqual(["overdue", "soon", "later", "urgent", "low"]);
  });

  it("does not mutate the input array", () => {
    const input = [task({ id: "z", due: "2026-09-01" }), task({ id: "a", due: "2026-07-01" })];
    const copy = [...input];
    sortTasks(input, today);
    expect(input).toEqual(copy);
  });
});
