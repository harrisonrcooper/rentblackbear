import { describe, it, expect } from "vitest";

import {
  groupByMonth, incompleteCount, isComplete, searchDecisions, sortByDate,
} from "../decisions";
import type { DecisionLike } from "../decisions";

// Minimal factory: every field present, overridable. Keeps each test focused
// on the one axis it exercises.
function dec(over: Partial<DecisionLike> & { id: string }): DecisionLike {
  return {
    title: "",
    decided_on: null,
    decision: "chose it",
    why: "because",
    alternatives: "",
    ...over,
  };
}

describe("sortByDate", () => {
  it("orders newest decided_on first", () => {
    const input = [
      dec({ id: "old", decided_on: "2026-01-05" }),
      dec({ id: "new", decided_on: "2026-07-01" }),
      dec({ id: "mid", decided_on: "2026-04-10" }),
    ];
    expect(sortByDate(input).map((d) => d.id)).toEqual(["new", "mid", "old"]);
  });

  it("pushes undated rows to the end", () => {
    const input = [
      dec({ id: "undated", decided_on: null }),
      dec({ id: "dated", decided_on: "2026-03-01" }),
    ];
    expect(sortByDate(input).map((d) => d.id)).toEqual(["dated", "undated"]);
  });

  it("treats a blank string date as undated", () => {
    const input = [
      dec({ id: "blank", decided_on: "   " }),
      dec({ id: "real", decided_on: "2025-12-31" }),
    ];
    expect(sortByDate(input).map((d) => d.id)).toEqual(["real", "blank"]);
  });

  it("keeps input order among rows sharing the same date", () => {
    const input = [
      dec({ id: "a", decided_on: "2026-05-05" }),
      dec({ id: "b", decided_on: "2026-05-05" }),
      dec({ id: "c", decided_on: "2026-05-05" }),
    ];
    expect(sortByDate(input).map((d) => d.id)).toEqual(["a", "b", "c"]);
  });

  it("keeps input order among the undated tail", () => {
    const input = [
      dec({ id: "u1", decided_on: null }),
      dec({ id: "d", decided_on: "2026-02-02" }),
      dec({ id: "u2", decided_on: null }),
    ];
    expect(sortByDate(input).map((d) => d.id)).toEqual(["d", "u1", "u2"]);
  });

  it("does not mutate its input", () => {
    const input = [
      dec({ id: "old", decided_on: "2026-01-01" }),
      dec({ id: "new", decided_on: "2026-09-01" }),
    ];
    sortByDate(input);
    expect(input.map((d) => d.id)).toEqual(["old", "new"]);
  });

  it("returns an empty array unchanged", () => {
    expect(sortByDate([])).toEqual([]);
  });
});

describe("groupByMonth", () => {
  it("buckets by calendar month, newest month first", () => {
    const groups = groupByMonth([
      dec({ id: "jan", decided_on: "2026-01-20" }),
      dec({ id: "jul", decided_on: "2026-07-04" }),
      dec({ id: "jul2", decided_on: "2026-07-31" }),
    ]);
    expect(groups.map((g) => g.label)).toEqual(["July 2026", "January 2026"]);
    expect(groups[0].items.map((d) => d.id)).toEqual(["jul2", "jul"]);
    expect(groups[1].items.map((d) => d.id)).toEqual(["jan"]);
  });

  it("collects undated rows under a trailing 'No date' group", () => {
    const groups = groupByMonth([
      dec({ id: "u1", decided_on: null }),
      dec({ id: "m", decided_on: "2026-06-15" }),
      dec({ id: "u2", decided_on: "" }),
    ]);
    expect(groups.map((g) => g.label)).toEqual(["June 2026", "No date"]);
    expect(groups[1].items.map((d) => d.id)).toEqual(["u1", "u2"]);
  });

  it("omits the 'No date' group when everything is dated", () => {
    const groups = groupByMonth([dec({ id: "m", decided_on: "2026-03-03" })]);
    expect(groups.map((g) => g.label)).toEqual(["March 2026"]);
  });

  it("returns no groups for an empty input", () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it("does not merge the same month across different years", () => {
    const groups = groupByMonth([
      dec({ id: "y25", decided_on: "2025-07-10" }),
      dec({ id: "y26", decided_on: "2026-07-10" }),
    ]);
    expect(groups.map((g) => g.label)).toEqual(["July 2026", "July 2025"]);
  });
});

describe("isComplete", () => {
  it("is true only when both decision and why are present", () => {
    expect(isComplete(dec({ id: "a", decision: "x", why: "y" }))).toBe(true);
  });

  it("is false when the reason is missing", () => {
    expect(isComplete(dec({ id: "a", decision: "x", why: "" }))).toBe(false);
  });

  it("is false when the choice is missing", () => {
    expect(isComplete(dec({ id: "a", decision: "", why: "y" }))).toBe(false);
  });

  it("treats whitespace-only fields as absent", () => {
    expect(isComplete(dec({ id: "a", decision: "  ", why: "\t" }))).toBe(false);
  });
});

describe("incompleteCount", () => {
  it("counts entries missing a decision or a why", () => {
    const list = [
      dec({ id: "full", decision: "a", why: "b" }),
      dec({ id: "noWhy", decision: "a", why: "" }),
      dec({ id: "noDecision", decision: "", why: "b" }),
    ];
    expect(incompleteCount(list)).toBe(2);
  });

  it("is zero for an empty list", () => {
    expect(incompleteCount([])).toBe(0);
  });
});

describe("searchDecisions", () => {
  const list = [
    dec({ id: "roof", title: "Roof material", decision: "standing seam metal", why: "50-year life", alternatives: "asphalt shingle, rejected on lifespan" }),
    dec({ id: "hvac", title: "Heating system", decision: "ground-source heat pump", why: "lowest operating cost", alternatives: "propane furnace" }),
  ];

  it("matches on the title", () => {
    expect(searchDecisions(list, "roof").map((d) => d.id)).toEqual(["roof"]);
  });

  it("matches on the decision text", () => {
    expect(searchDecisions(list, "heat pump").map((d) => d.id)).toEqual(["hvac"]);
  });

  it("matches on the reason", () => {
    expect(searchDecisions(list, "50-year").map((d) => d.id)).toEqual(["roof"]);
  });

  it("matches on the rejected alternatives", () => {
    expect(searchDecisions(list, "propane").map((d) => d.id)).toEqual(["hvac"]);
  });

  it("is case-insensitive", () => {
    expect(searchDecisions(list, "STANDING SEAM").map((d) => d.id)).toEqual(["roof"]);
  });

  it("returns the full list for an empty or whitespace query", () => {
    expect(searchDecisions(list, "").map((d) => d.id)).toEqual(["roof", "hvac"]);
    expect(searchDecisions(list, "   ").map((d) => d.id)).toEqual(["roof", "hvac"]);
  });

  it("returns nothing when no field matches", () => {
    expect(searchDecisions(list, "solar")).toEqual([]);
  });
});
