import { describe, it, expect } from "vitest";
import {
  monthsBetween,
  envelopeBalance,
  parseBulkPaste,
} from "../envelopes";

describe("monthsBetween", () => {
  it("is inclusive of both endpoints", () => {
    expect(monthsBetween("2026-01-01", "2026-01-01")).toBe(1);
    expect(monthsBetween("2026-01-01", "2026-03-01")).toBe(3);
  });
  it("handles year crossing", () => {
    expect(monthsBetween("2025-11-01", "2026-02-01")).toBe(4);
  });
  it("returns 0 for unparseable input", () => {
    expect(monthsBetween("not a date", "2026-01-01")).toBe(0);
  });
});

describe("envelopeBalance carryover math", () => {
  const cat = { label: "Groceries", default_monthly_cents: 50_000 };

  it("returns just this month's budget when no history", () => {
    const state = { monthly_actuals: [] };
    const b = envelopeBalance(state, cat, "2026-05-01", "2026-05-01");
    expect(b.budget).toBe(50_000);
    expect(b.priorMonths).toBe(0);
    expect(b.carryover).toBe(0);
    expect(b.thisMonthSpent).toBe(0);
    expect(b.available).toBe(50_000);
  });

  it("carries unspent prior-month budget forward", () => {
    // 3 prior months × $500 budget = $1500 priorBudget
    // 1 prior-month $200 spend → carryover = 1500 - 200 = 1300
    const state = {
      monthly_actuals: [
        { id: "1", category_label: "Groceries", month: "2026-02-01", amount_cents: 20_000 },
      ],
    };
    const b = envelopeBalance(state, cat, "2026-05-01", "2026-02-01");
    expect(b.priorMonths).toBe(3);
    expect(b.priorBudget).toBe(150_000);
    expect(b.priorSpent).toBe(20_000);
    expect(b.carryover).toBe(130_000);
    expect(b.available).toBe(130_000 + 50_000);
  });

  it("reflects this-month spend in available", () => {
    const state = {
      monthly_actuals: [
        { id: "1", category_label: "Groceries", month: "2026-05-01", amount_cents: 30_000 },
      ],
    };
    const b = envelopeBalance(state, cat, "2026-05-01", "2026-05-01");
    expect(b.thisMonthSpent).toBe(30_000);
    expect(b.available).toBe(20_000);
  });

  it("goes negative when overspent past carryover", () => {
    const state = {
      monthly_actuals: [
        { id: "1", category_label: "Groceries", month: "2026-05-01", amount_cents: 75_000 },
      ],
    };
    const b = envelopeBalance(state, cat, "2026-05-01", "2026-05-01");
    expect(b.available).toBe(-25_000);
  });

  it("category label match is case-insensitive and trim-tolerant", () => {
    const state = {
      monthly_actuals: [
        { id: "1", category_label: "  GROCERIES  ", month: "2026-05-01", amount_cents: 10_000 },
      ],
    };
    const b = envelopeBalance(state, cat, "2026-05-01", "2026-05-01");
    expect(b.thisMonthSpent).toBe(10_000);
  });
});

describe("envelopeBalance with transfers", () => {
  const food = { label: "Food", default_monthly_cents: 50_000 };
  const vacation = { label: "Vacation", default_monthly_cents: 0 };

  it("a transfer OUT this month lowers available; IN raises it", () => {
    const state = {
      monthly_actuals: [],
      envelope_transfers: [
        { id: "t1", from_label: "Food", to_label: "Vacation", amount_cents: 20_000, month: "2026-05-01" },
      ],
    };
    const f = envelopeBalance(state, food, "2026-05-01", "2026-05-01");
    expect(f.transfersOut).toBe(20_000);
    expect(f.transferNet).toBe(-20_000);
    expect(f.available).toBe(50_000 - 20_000); // budget − moved out

    const v = envelopeBalance(state, vacation, "2026-05-01", "2026-05-01");
    expect(v.transfersIn).toBe(20_000);
    expect(v.transferNet).toBe(20_000);
    expect(v.available).toBe(20_000); // $0 budget + moved in
  });

  it("prior-month transfers fold into carryover", () => {
    const state = {
      monthly_actuals: [],
      envelope_transfers: [
        { id: "t1", from_label: "Food", to_label: "Vacation", amount_cents: 15_000, month: "2026-04-01" },
      ],
    };
    // May, started April: 1 prior month of $0 budget for Vacation + $15k in.
    const v = envelopeBalance(state, vacation, "2026-05-01", "2026-04-01");
    expect(v.carryover).toBe(15_000);
    expect(v.transfersIn).toBe(0); // not this month
    expect(v.available).toBe(15_000);
  });

  it("conserves total money — out of one equals into another", () => {
    const state = {
      monthly_actuals: [],
      envelope_transfers: [
        { id: "t1", from_label: "Food", to_label: "Vacation", amount_cents: 12_345, month: "2026-05-01" },
      ],
    };
    const f = envelopeBalance(state, food, "2026-05-01", "2026-05-01");
    const v = envelopeBalance(state, vacation, "2026-05-01", "2026-05-01");
    expect(f.transferNet + v.transferNet).toBe(0);
  });
});

describe("parseBulkPaste", () => {
  it("extracts amount + note from common formats", () => {
    const out = parseBulkPaste(`
      Costco run 45
      $12.99 spotify
      Restaurants: 38.50
      13 walmart
    `);
    expect(out).toHaveLength(4);
    expect(out[0]).toMatchObject({ amount_cents: 4500 });
    expect(out[0].note.toLowerCase()).toContain("costco");
    expect(out[1]).toMatchObject({ amount_cents: 1299 });
    expect(out[2]).toMatchObject({ amount_cents: 3850 });
    expect(out[3]).toMatchObject({ amount_cents: 1300 });
  });

  it("ignores blank lines", () => {
    expect(parseBulkPaste("\n\n   \n")).toEqual([]);
  });

  it("documents a known limitation: thousand-separator commas aren't parsed", () => {
    // Real PMs typing into the bulk-paste box write "1200" not "1,200".
    // The regex grabs $1.20 here. If users ever paste tool exports
    // directly, the CSV import path is the correct route — not this one.
    const out = parseBulkPaste("Rent $1,200.00");
    expect(out[0].amount_cents).toBe(120);
  });
});
