import { describe, it, expect } from "vitest";

import { mergeBuildState } from "../merge";

// A miniature BuildState: one scalar, one row array, one nested object.
const state = (over: Record<string, unknown> = {}) => ({
  project_name: "Our Dream Home",
  loan: { amount_cents: 0, rate_bps: 0 },
  rooms: [
    { id: "r0", name: "Kitchen", must_haves: "butler's pantry" },
    { id: "r1", name: "Studio", must_haves: "vaulted" },
  ],
  ...over,
});

describe("mergeBuildState", () => {
  it("keeps both sides when each adds a different row", () => {
    const base = state();
    const mine = state({ rooms: [...base.rooms, { id: "rA", name: "Sauna", must_haves: "" }] });
    const theirs = state({ rooms: [...base.rooms, { id: "rB", name: "Pool house", must_haves: "" }] });

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms.map((r) => r.id)).toEqual(["r0", "r1", "rA", "rB"]);
    expect(report.conflicts).toEqual([]);
  });

  it("keeps both edits when they touch different fields of the same row", () => {
    const base = state();
    const mine = state({ rooms: [{ ...base.rooms[0], must_haves: "two dishwashers" }, base.rooms[1]] });
    const theirs = state({ rooms: [{ ...base.rooms[0], name: "Kitchen & pantry" }, base.rooms[1]] });

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms[0]).toMatchObject({
      id: "r0",
      name: "Kitchen & pantry",     // their edit survived
      must_haves: "two dishwashers", // mine survived
    });
    expect(report.conflicts).toEqual([]);
  });

  it("prefers the local edit on a true collision and reports it", () => {
    const base = state();
    const mine = state({ rooms: [{ ...base.rooms[0], must_haves: "MINE" }, base.rooms[1]] });
    const theirs = state({ rooms: [{ ...base.rooms[0], must_haves: "THEIRS" }, base.rooms[1]] });

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms[0].must_haves).toBe("MINE");
    expect(report.conflicts).toEqual(['rooms → Kitchen: kept your "must_haves"']);
  });

  it("undoes a remote delete when the local side had edited that row", () => {
    const base = state();
    const mine = state({ rooms: [{ ...base.rooms[0], must_haves: "edited, do not lose" }, base.rooms[1]] });
    const theirs = state({ rooms: [base.rooms[1]] }); // they deleted r0

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms.map((r) => r.id)).toContain("r0");
    expect(merged.rooms.find((r) => r.id === "r0")!.must_haves).toBe("edited, do not lose");
    expect(report.resurrected).toHaveLength(1);
  });

  it("undoes a local delete when the remote side had edited that row", () => {
    const base = state();
    const mine = state({ rooms: [base.rooms[1]] }); // I deleted r0
    const theirs = state({ rooms: [{ ...base.rooms[0], must_haves: "they edited it" }, base.rooms[1]] });

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms.find((r) => r.id === "r0")!.must_haves).toBe("they edited it");
    expect(report.resurrected).toHaveLength(1);
  });

  it("honors a delete when the other side never touched the row", () => {
    const base = state();
    const mine = state({ rooms: [base.rooms[1]] }); // I deleted r0, they did nothing
    const theirs = state();

    const { merged, report } = mergeBuildState(base, mine, theirs);

    expect(merged.rooms.map((r) => r.id)).toEqual(["r1"]);
    expect(report.resurrected).toEqual([]);
  });

  it("drops a row both sides deleted", () => {
    const base = state();
    const mine = state({ rooms: [base.rooms[1]] });
    const theirs = state({ rooms: [base.rooms[1]] });

    const { merged } = mergeBuildState(base, mine, theirs);
    expect(merged.rooms.map((r) => r.id)).toEqual(["r1"]);
  });

  it("takes the remote scalar when only the remote side changed it", () => {
    const base = state();
    const mine = state();
    const theirs = state({ project_name: "The Château" });

    const { merged, report } = mergeBuildState(base, mine, theirs);
    expect(merged.project_name).toBe("The Château");
    expect(report.conflicts).toEqual([]);
  });

  it("merges nested objects field by field", () => {
    const base = state();
    const mine = state({ loan: { amount_cents: 90_000_000, rate_bps: 0 } });
    const theirs = state({ loan: { amount_cents: 0, rate_bps: 725 } });

    const { merged, report } = mergeBuildState(base, mine, theirs);
    expect(merged.loan).toEqual({ amount_cents: 90_000_000, rate_bps: 725 });
    expect(report.conflicts).toEqual([]);
  });

  it("never drops a row that exists on either side", () => {
    const base = state({ rooms: [] });
    const mine = state({ rooms: [{ id: "a", name: "A" }] });
    const theirs = state({ rooms: [{ id: "b", name: "B" }] });

    const { merged } = mergeBuildState(base, mine, theirs);
    expect(merged.rooms).toHaveLength(2);
  });
});
