import { describe, it, expect } from "vitest";
import { computeYearStats } from "../yearstats";

const today = new Date(2026, 4, 13); // May 13, 2026

describe("computeYearStats", () => {
  it("returns zero stats when there's no history", () => {
    const out = computeYearStats({}, today);
    expect(out.year).toBe(2026);
    expect(out.savedYTD).toBe(0);
    expect(out.netWorthDelta).toBe(0);
    expect(out.totalSpent).toBe(0);
    expect(out.bestMonthLabel).toBeNull();
    expect(out.monthsTracked).toBe(0);
  });

  it("uses the LATEST snapshot per month (collapses daily to monthly)", () => {
    const state = {
      history: [
        { day: "2026-03-01", net_worth_cents: 100_000_00, saved_this_month_cents: 5_000_00 },
        { day: "2026-03-15", net_worth_cents: 110_000_00, saved_this_month_cents: 8_000_00 },
        { day: "2026-03-31", net_worth_cents: 120_000_00, saved_this_month_cents: 12_000_00 }, // wins
      ],
    };
    const out = computeYearStats(state, today);
    // Only the March 31 snapshot counts → savedYTD = 12_000_00.
    expect(out.savedYTD).toBe(12_000_00);
    expect(out.monthsTracked).toBe(1);
  });

  it("sums saved_this_month across distinct months in the year", () => {
    const state = {
      history: [
        { day: "2026-01-31", saved_this_month_cents: 5_000_00, net_worth_cents: 100_000_00 },
        { day: "2026-02-28", saved_this_month_cents: 6_000_00, net_worth_cents: 106_000_00 },
        { day: "2026-03-31", saved_this_month_cents: 7_000_00, net_worth_cents: 113_000_00 },
      ],
    };
    const out = computeYearStats(state, today);
    expect(out.savedYTD).toBe(18_000_00);
    expect(out.monthsTracked).toBe(3);
  });

  it("excludes snapshots from other years", () => {
    const state = {
      history: [
        { day: "2025-12-31", saved_this_month_cents: 999_999_00, net_worth_cents: 0 },
        { day: "2026-01-31", saved_this_month_cents: 5_000_00,   net_worth_cents: 100_000_00 },
      ],
    };
    const out = computeYearStats(state, today);
    expect(out.savedYTD).toBe(5_000_00);
    expect(out.year).toBe(2026);
  });

  it("netWorthDelta = latest − first snapshot in the year", () => {
    const state = {
      history: [
        { day: "2026-01-15", net_worth_cents: 100_000_00, saved_this_month_cents: 0 },
        { day: "2026-05-12", net_worth_cents: 125_000_00, saved_this_month_cents: 0 },
      ],
    };
    const out = computeYearStats(state, today);
    expect(out.netWorthDelta).toBe(25_000_00);
  });

  it("identifies the best savings month by amount", () => {
    const state = {
      history: [
        { day: "2026-01-31", saved_this_month_cents: 5_000_00, net_worth_cents: 0 },
        { day: "2026-02-28", saved_this_month_cents: 9_000_00, net_worth_cents: 0 }, // best
        { day: "2026-03-31", saved_this_month_cents: 7_000_00, net_worth_cents: 0 },
      ],
    };
    const out = computeYearStats(state, today);
    expect(out.bestMonthLabel).toBe("February");
    expect(out.bestMonthAmount).toBe(9_000_00);
  });

  it("totalSpent sums all positive amount_cents in the year", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-01-01", amount_cents: 5_000_00 },
        { month: "2026-02-01", amount_cents: 3_000_00 },
        { month: "2026-05-01", amount_cents: -100_00 }, // refund — excluded
        { month: "2025-12-01", amount_cents: 999_999 }, // prior year — excluded
      ],
    };
    const out = computeYearStats(state, today);
    expect(out.totalSpent).toBe(8_000_00);
  });
});
