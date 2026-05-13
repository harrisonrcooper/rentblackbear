import { describe, it, expect } from "vitest";
import {
  propertyMonthlyGross,
  propertyMonthlyExpenses,
  propertyMonthlyNet,
  computeNetWorthCents,
} from "../calc";

const settings = { default_vacancy_bps: 1000, default_capex_bps: 500 };

describe("propertyMonthlyGross", () => {
  it("sums occupied room rents only", () => {
    const p = {
      rooms: [
        { rent_cents: 100_000, occupied: true },
        { rent_cents: 90_000, occupied: false },
        { rent_cents: 110_000, occupied: true },
      ],
    };
    expect(propertyMonthlyGross(p)).toBe(210_000);
  });
  it("returns 0 when every room is vacant", () => {
    const p = { rooms: [{ rent_cents: 100_000, occupied: false }] };
    expect(propertyMonthlyGross(p)).toBe(0);
  });
});

describe("propertyMonthlyExpenses", () => {
  it("sums fixed-cost expenses verbatim", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [
        { kind: "fixed", monthly_cents: 20_000 },
        { kind: "fixed", monthly_cents: 15_000 },
      ],
    };
    expect(propertyMonthlyExpenses(p, settings)).toBe(35_000);
  });

  it("applies vacancy_pct against gross", () => {
    // gross = 100k, 10% vacancy = 10k
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [{ kind: "vacancy_pct" }],
    };
    expect(propertyMonthlyExpenses(p, settings)).toBe(10_000);
  });

  it("applies capex_pct against gross", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [{ kind: "capex_pct" }],
    };
    expect(propertyMonthlyExpenses(p, settings)).toBe(5_000);
  });

  it("respects per-expense pct_bps override over the settings default", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [{ kind: "vacancy_pct", pct_bps: 1500 }],
    };
    expect(propertyMonthlyExpenses(p, settings)).toBe(15_000);
  });
});

describe("propertyMonthlyNet", () => {
  it("is gross minus expenses", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [
        { kind: "fixed", monthly_cents: 30_000 },
        { kind: "vacancy_pct" },
      ],
    };
    // gross 100k - fixed 30k - vacancy 10k = 60k
    expect(propertyMonthlyNet(p, settings)).toBe(60_000);
  });
});

describe("computeNetWorthCents", () => {
  it("adds property equity + cash assets, subtracts debts", () => {
    const state = {
      settings,
      properties: [
        // equity = 500k - 300k = 200k
        {
          status: "operating",
          market_value_cents: 500_000_00,
          mortgage_balance_cents: 300_000_00,
          rooms: [],
        },
      ],
      assets: [
        { kind: "cash", balance_cents: 25_000_00 },
        { kind: "retirement", balance_cents: 75_000_00 },
      ],
      debts: [
        { kind: "auto", balance_cents: 15_000_00 },
      ],
    };
    expect(computeNetWorthCents(state)).toBe(
      (500_000_00 - 300_000_00) + 25_000_00 + 75_000_00 - 15_000_00,
    );
  });

  it("returns zero when properties/assets/debts are all empty", () => {
    expect(computeNetWorthCents({ settings, properties: [], assets: [], debts: [] })).toBe(0);
  });
});
