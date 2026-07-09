import { describe, it, expect } from "vitest";

import {
  parseISO, toISO, addDays, daysBetween, durationDays, indexById,
  topoSort, earliestStart, violations, reschedule, criticalPath,
  projectBounds, percentComplete,
} from "../schedule";
import type { BuildScheduleTask } from "@/actions/build/_store";

let seq = 0;
const task = (over: Partial<BuildScheduleTask> = {}): BuildScheduleTask => ({
  id: `k${seq++}`,
  phase_id: null,
  name: "Task",
  start: null,
  end: null,
  percent: 0,
  depends_on: [],
  is_milestone: false,
  ...over,
});

describe("date primitives", () => {
  it("parses ISO at UTC midnight, immune to the host timezone", () => {
    const d = parseISO("2026-07-09");
    expect(d.getTime()).toBe(Date.UTC(2026, 6, 9));
    expect(toISO(d)).toBe("2026-07-09");
  });

  it("addDays crosses month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("addDays spans a leap day", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });

  it("daysBetween is inclusive-exclusive and signed", () => {
    expect(daysBetween("2026-07-09", "2026-07-09")).toBe(0);
    expect(daysBetween("2026-07-09", "2026-07-10")).toBe(1);
    expect(daysBetween("2026-07-10", "2026-07-09")).toBe(-1);
    expect(daysBetween("2026-01-01", "2026-12-31")).toBe(364);
  });
});

describe("durationDays", () => {
  it("counts inclusively — a single-day task is 1", () => {
    expect(durationDays(task({ start: "2026-07-09", end: "2026-07-09" }))).toBe(1);
    expect(durationDays(task({ start: "2026-07-09", end: "2026-07-13" }))).toBe(5);
  });

  it("floors undated or inverted ranges to 1", () => {
    expect(durationDays(task())).toBe(1);
    expect(durationDays(task({ start: "2026-07-09", end: null }))).toBe(1);
    expect(durationDays(task({ start: "2026-07-13", end: "2026-07-09" }))).toBe(1);
  });
});

describe("topoSort", () => {
  it("orders dependencies before dependents", () => {
    const a = task({ id: "a" });
    const b = task({ id: "b", depends_on: ["a"] });
    const c = task({ id: "c", depends_on: ["b"] });
    const { order, cycle } = topoSort([c, b, a]);
    expect(cycle).toEqual([]);
    expect(order.indexOf("a")).toBeLessThan(order.indexOf("b"));
    expect(order.indexOf("b")).toBeLessThan(order.indexOf("c"));
    expect(order).toHaveLength(3);
  });

  it("ignores dangling dependency ids", () => {
    const a = task({ id: "a", depends_on: ["ghost"] });
    const { order, cycle } = topoSort([a]);
    expect(order).toEqual(["a"]);
    expect(cycle).toEqual([]);
  });

  it("detects a two-node cycle and terminates", () => {
    const a = task({ id: "a", depends_on: ["b"] });
    const b = task({ id: "b", depends_on: ["a"] });
    const { order, cycle } = topoSort([a, b]);
    expect(order).toEqual([]);
    expect(new Set(cycle)).toEqual(new Set(["a", "b"]));
  });

  it("detects a longer cycle while keeping the acyclic prefix", () => {
    const root = task({ id: "root" });
    const a = task({ id: "a", depends_on: ["root", "c"] });
    const b = task({ id: "b", depends_on: ["a"] });
    const c = task({ id: "c", depends_on: ["b"] });
    const { order, cycle } = topoSort([root, a, b, c]);
    expect(order).toEqual(["root"]);
    expect(new Set(cycle)).toEqual(new Set(["a", "b", "c"]));
  });
});

describe("earliestStart", () => {
  it("is the day after the latest dependency end", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-10" });
    const b = task({ id: "b", start: "2026-01-05", end: "2026-01-20" });
    const c = task({ id: "c", depends_on: ["a", "b"], start: "2026-01-02" });
    expect(earliestStart(c, indexById([a, b, c]))).toBe("2026-01-21");
  });

  it("falls back to the task's own start with no dated dependencies", () => {
    const c = task({ id: "c", start: "2026-01-02" });
    expect(earliestStart(c, indexById([c]))).toBe("2026-01-02");
  });
});

describe("violations", () => {
  it("flags a task starting the same day its dependency ends", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-10" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-10", end: "2026-01-15" });
    expect(violations([a, b]).map((t) => t.id)).toEqual(["b"]);
  });

  it("passes a task starting the day after — the finish-to-start minimum", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-10" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-11", end: "2026-01-15" });
    expect(violations([a, b])).toEqual([]);
  });

  it("flags a start before the dependency's end", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-10" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-05", end: "2026-01-15" });
    expect(violations([a, b]).map((t) => t.id)).toEqual(["b"]);
  });
});

describe("reschedule", () => {
  it("returns a new array without mutating the input", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-05" });
    const out = reschedule([a], "a", "2026-01-08");
    expect(out).not.toBe([a]);
    expect(a.start).toBe("2026-01-01");
    expect(out[0].start).toBe("2026-01-08");
    expect(out[0].end).toBe("2026-01-12"); // duration of 5 preserved
  });

  it("cascades a dependent that would otherwise violate, by the same delta", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-05" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-06", end: "2026-01-10" });
    const out = reschedule([a, b], "a", "2026-01-04"); // +3 days
    const byId = indexById(out);
    expect(byId.get("a")!.start).toBe("2026-01-04");
    expect(byId.get("a")!.end).toBe("2026-01-08");
    // b would now start on/before a's new end (01-08) → shifts +3
    expect(byId.get("b")!.start).toBe("2026-01-09");
    expect(byId.get("b")!.end).toBe("2026-01-13");
  });

  it("cascades transitively down a chain", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-05" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-06", end: "2026-01-10" });
    const c = task({ id: "c", depends_on: ["b"], start: "2026-01-11", end: "2026-01-15" });
    const out = reschedule([a, b, c], "a", "2026-01-06"); // +5
    const byId = indexById(out);
    expect(byId.get("b")!.start).toBe("2026-01-11");
    expect(byId.get("c")!.start).toBe("2026-01-16");
  });

  it("does not disturb a dependent that stays valid when moving earlier", () => {
    const a = task({ id: "a", start: "2026-01-10", end: "2026-01-15" });
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-16", end: "2026-01-20" });
    const out = reschedule([a, b], "a", "2026-01-05"); // -5, a now ends 01-10
    const byId = indexById(out);
    expect(byId.get("a")!.start).toBe("2026-01-05");
    expect(byId.get("b")!.start).toBe("2026-01-16"); // untouched
  });

  it("terminates on a cyclic graph", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-05", depends_on: ["b"] });
    const b = task({ id: "b", start: "2026-01-06", end: "2026-01-10", depends_on: ["a"] });
    const out = reschedule([a, b], "a", "2026-01-03");
    expect(out).toHaveLength(2);
    expect(indexById(out).get("a")!.start).toBe("2026-01-03");
  });

  it("is a no-op delta when the start does not change", () => {
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-05" });
    const out = reschedule([a], "a", "2026-01-01");
    expect(out[0].start).toBe("2026-01-01");
    expect(out[0].end).toBe("2026-01-05");
  });
});

describe("criticalPath", () => {
  it("picks the longest chain by summed duration, not by hop count", () => {
    // short chain of two long tasks vs a single longer task
    const a = task({ id: "a", start: "2026-01-01", end: "2026-01-10" }); // 10
    const b = task({ id: "b", depends_on: ["a"], start: "2026-01-11", end: "2026-01-20" }); // 10 → 20
    const solo = task({ id: "solo", start: "2026-01-01", end: "2026-01-15" }); // 15
    expect(criticalPath([a, b, solo])).toEqual(["a", "b"]);
  });

  it("follows the heavier branch when paths diverge", () => {
    const root = task({ id: "root", start: "2026-01-01", end: "2026-01-02" }); // 2
    const light = task({ id: "light", depends_on: ["root"], start: "2026-01-03", end: "2026-01-04" }); // 2
    const heavy = task({ id: "heavy", depends_on: ["root"], start: "2026-01-03", end: "2026-01-12" }); // 10
    const tip = task({ id: "tip", depends_on: ["light", "heavy"], start: "2026-01-13", end: "2026-01-14" }); // 2
    expect(criticalPath([root, light, heavy, tip])).toEqual(["root", "heavy", "tip"]);
  });

  it("returns [] on an empty schedule", () => {
    expect(criticalPath([])).toEqual([]);
  });
});

describe("projectBounds", () => {
  it("spans the earliest start to the latest end", () => {
    const a = task({ start: "2026-03-01", end: "2026-03-10" });
    const b = task({ start: "2026-02-15", end: "2026-04-01" });
    const c = task({ start: "2026-05-01", end: "2026-05-02" });
    expect(projectBounds([a, b, c])).toEqual({ start: "2026-02-15", end: "2026-05-02" });
  });

  it("is all-null when empty and tolerates undated rows", () => {
    expect(projectBounds([])).toEqual({ start: null, end: null });
    expect(projectBounds([task()])).toEqual({ start: null, end: null });
  });
});

describe("percentComplete", () => {
  it("weights by duration, in basis points", () => {
    const long = task({ start: "2026-01-01", end: "2026-01-10", percent: 100 }); // 10 days done
    const short = task({ start: "2026-01-11", end: "2026-01-11", percent: 0 });  // 1 day undone
    // (10*100 + 1*0) / 11 * 100 = 9090.9 → 9091
    expect(percentComplete([long, short])).toBe(9091);
  });

  it("returns 10000 when everything is complete", () => {
    const a = task({ start: "2026-01-01", end: "2026-01-05", percent: 100 });
    const b = task({ start: "2026-01-06", end: "2026-01-06", percent: 100 });
    expect(percentComplete([a, b])).toBe(10000);
  });

  it("clamps out-of-range percents", () => {
    const a = task({ start: "2026-01-01", end: "2026-01-01", percent: 150 });
    const b = task({ start: "2026-01-02", end: "2026-01-02", percent: -20 });
    expect(percentComplete([a, b])).toBe(5000);
  });

  it("returns 0 on an empty schedule", () => {
    expect(percentComplete([])).toBe(0);
  });
});
