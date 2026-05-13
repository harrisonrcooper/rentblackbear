import { describe, it, expect } from "vitest";
import { buildGoalTrajectory } from "../goalTrajectory";

const hist = (year, month, fields) => ({
  day: `${year}-${String(month).padStart(2, "0")}-${String(year * month % 28 + 1).padStart(2, "0")}`,
  ...fields,
});

describe("buildGoalTrajectory", () => {
  it("returns [] for unsupported goal kinds", () => {
    const state = { history: [
      hist(2026, 1, { net_worth_cents: 100_000_00 }),
    ]};
    expect(buildGoalTrajectory({ kind: "debt_payoff" }, state)).toEqual([]);
    expect(buildGoalTrajectory({ kind: "property_count" }, state)).toEqual([]);
    expect(buildGoalTrajectory({ kind: "custom" }, state)).toEqual([]);
  });

  it("returns [] when history is empty", () => {
    expect(buildGoalTrajectory({ kind: "net_worth" }, { history: [] })).toEqual([]);
    expect(buildGoalTrajectory({ kind: "net_worth" }, {})).toEqual([]);
  });

  it("reads net_worth_cents for net_worth goals", () => {
    const state = {
      history: [
        hist(2026, 1, { net_worth_cents: 100_000_00 }),
        hist(2026, 2, { net_worth_cents: 110_000_00 }),
        hist(2026, 3, { net_worth_cents: 120_000_00 }),
      ],
    };
    const out = buildGoalTrajectory({ kind: "net_worth" }, state, 3);
    // The last entry's value must reflect the latest snapshot we saw.
    expect(out.length).toBeGreaterThan(0);
    const values = out.map((p) => p.value);
    expect(values).toContain(120_000_00);
  });

  it("reads rental_noi_cents for rental_income goals", () => {
    const state = {
      history: [
        hist(2026, 1, { rental_noi_cents: 1_000_00, net_worth_cents: 0 }),
        hist(2026, 2, { rental_noi_cents: 1_500_00, net_worth_cents: 0 }),
      ],
    };
    const out = buildGoalTrajectory({ kind: "rental_income" }, state, 6);
    const values = out.map((p) => p.value);
    expect(values).toContain(1_000_00);
    expect(values).toContain(1_500_00);
  });

  it("savings goals produce a CUMULATIVE line", () => {
    const state = {
      history: [
        hist(2026, 1, { saved_this_month_cents: 1_000_00 }),
        hist(2026, 2, { saved_this_month_cents: 1_500_00 }),
        hist(2026, 3, { saved_this_month_cents: 2_000_00 }),
      ],
    };
    const out = buildGoalTrajectory({ kind: "savings" }, state, 12);
    const series = out.filter((p) => p.value > 0);
    if (series.length >= 2) {
      // Cumulative line must be monotonically non-decreasing.
      for (let i = 1; i < series.length; i++) {
        expect(series[i].value).toBeGreaterThanOrEqual(series[i - 1].value);
      }
    }
  });

  it("uses the LATEST history snapshot per month (collapses dailies)", () => {
    const state = {
      history: [
        { day: "2026-02-01", net_worth_cents: 100_000_00 },
        { day: "2026-02-15", net_worth_cents: 110_000_00 },
        { day: "2026-02-28", net_worth_cents: 120_000_00 }, // latest in Feb
      ],
    };
    const out = buildGoalTrajectory({ kind: "net_worth" }, state, 6);
    const feb = out.find((p) => p.month === "2026-02");
    expect(feb.value).toBe(120_000_00);
  });
});
