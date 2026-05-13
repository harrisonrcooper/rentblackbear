import { describe, it, expect } from "vitest";
import {
  computeAllocation,
  computeRetirementProjection,
  computeFireMetrics,
  defaultProjectionInputs,
} from "../networth";

describe("computeAllocation", () => {
  it("returns empty rows on an empty state", () => {
    const out = computeAllocation({ properties: [], assets: [], debts: [] });
    expect(out.rows).toEqual([]);
    expect(out.grossAssets).toBe(0);
    expect(out.debt).toBe(0);
    expect(out.net).toBe(0);
  });

  it("rolls property equity into real_estate (operating + equity_only only)", () => {
    const state = {
      properties: [
        // operating: $500k market, $300k mortgage → $200k equity
        { status: "operating", market_value_cents: 500_000_00, mortgage_balance_cents: 300_000_00 },
        // sold: skipped entirely
        { status: "sold",      market_value_cents: 400_000_00, mortgage_balance_cents: 0 },
      ],
      assets: [],
      debts: [],
    };
    const out = computeAllocation(state);
    const realEstate = out.rows.find((r) => r.label === "Real Estate");
    expect(realEstate.value_cents).toBe(200_000_00);
  });

  it("ignores negative-equity properties (under water)", () => {
    const state = {
      properties: [
        // under water: $200k market vs $250k mortgage = -$50k → excluded
        { status: "operating", market_value_cents: 200_000_00, mortgage_balance_cents: 250_000_00 },
      ],
      assets: [],
      debts: [],
    };
    const out = computeAllocation(state);
    expect(out.rows.find((r) => r.label === "Real Estate")).toBeUndefined();
  });

  it("buckets assets by kind, with unknown kinds falling into Other", () => {
    const state = {
      properties: [],
      assets: [
        { kind: "cash",       balance_cents: 10_000_00 },
        { kind: "retirement", balance_cents: 80_000_00 },
        { kind: "investment", balance_cents: 25_000_00 },
        { kind: "weird",      balance_cents:  5_000_00 }, // unknown → Other
      ],
      debts: [],
    };
    const out = computeAllocation(state);
    const byLabel = Object.fromEntries(out.rows.map((r) => [r.label, r.value_cents]));
    expect(byLabel["Cash"]).toBe(10_000_00);
    expect(byLabel["Retirement"]).toBe(80_000_00);
    expect(byLabel["Investments"]).toBe(25_000_00);
    expect(byLabel["Other"]).toBe(5_000_00);
  });

  it("excludes zero or negative-balance assets", () => {
    const state = {
      properties: [],
      assets: [
        { kind: "cash", balance_cents: 0 },
        { kind: "cash", balance_cents: -1000 },
      ],
      debts: [],
    };
    expect(computeAllocation(state).rows).toEqual([]);
  });

  it("subtracts debt to land at net", () => {
    const state = {
      properties: [],
      assets: [{ kind: "cash", balance_cents: 100_000_00 }],
      debts:  [{ balance_cents: 15_000_00 }, { balance_cents: 5_000_00 }],
    };
    const out = computeAllocation(state);
    expect(out.grossAssets).toBe(100_000_00);
    expect(out.debt).toBe(20_000_00);
    expect(out.net).toBe(80_000_00);
  });
});

describe("computeRetirementProjection", () => {
  it("returns a single starting point when horizon is 0", () => {
    const out = computeRetirementProjection({
      startingBalanceCents: 100_000_00,
      annualContributionCents: 0,
      annualReturnBps: 700,
      horizonYears: 0,
      startYear: 2026,
    });
    expect(out.series).toHaveLength(1);
    expect(out.series[0].balance_cents).toBe(100_000_00);
    expect(out.finalBalance).toBe(100_000_00);
    expect(out.finalYear).toBe(2026);
  });

  it("compounds correctly with no contribution", () => {
    // $100k @ 10% for 1 year → $110k
    const out = computeRetirementProjection({
      startingBalanceCents: 100_000_00,
      annualContributionCents: 0,
      annualReturnBps: 1000,
      horizonYears: 1,
      startYear: 2026,
    });
    expect(out.series[1].balance_cents).toBe(110_000_00);
  });

  it("adds the annual contribution AFTER growth each year", () => {
    // $0 start, $1000/year, 10% return, 2 years.
    // Y0: 0
    // Y1: 0 * 1.1 + 1000 = 1000
    // Y2: 1000 * 1.1 + 1000 = 2100
    const out = computeRetirementProjection({
      startingBalanceCents: 0,
      annualContributionCents: 1000_00,
      annualReturnBps: 1000,
      horizonYears: 2,
      startYear: 2026,
    });
    expect(out.series.map((s) => s.balance_cents)).toEqual([0, 100000, 210000]);
  });

  it("clamps the horizon at 80 years and 0 minimum", () => {
    const huge = computeRetirementProjection({
      startingBalanceCents: 0, annualContributionCents: 0, annualReturnBps: 0,
      horizonYears: 1000, startYear: 2026,
    });
    expect(huge.series).toHaveLength(81); // year 0 + 80 future years

    const neg = computeRetirementProjection({
      startingBalanceCents: 0, annualContributionCents: 0, annualReturnBps: 0,
      horizonYears: -5, startYear: 2026,
    });
    expect(neg.series).toHaveLength(1);
  });
});

describe("computeFireMetrics", () => {
  const baseSettings = { default_vacancy_bps: 1000, default_capex_bps: 500 };

  it("FIRE number = annual expenses × multiple (default 25)", () => {
    const state = {
      settings: baseSettings,
      categories: [{ label: "Rent", default_monthly_cents: 200_000 }],
      business_expenses: [],
      assets: [],
      income_sources: [],
    };
    const out = computeFireMetrics(state);
    // Monthly expenses = $2,000 → annual = $24,000 → FIRE = $600,000.
    expect(out.annualExpensesCents).toBe(2_400_000);
    expect(out.fireNumberCents).toBe(2_400_000 * 25);
  });

  it("liquid net worth = cash + retirement + investment only", () => {
    const state = {
      settings: baseSettings,
      categories: [],
      business_expenses: [],
      income_sources: [],
      assets: [
        { kind: "cash",       balance_cents: 10_000_00 },
        { kind: "retirement", balance_cents: 80_000_00 },
        { kind: "investment", balance_cents: 25_000_00 },
        { kind: "vehicle",    balance_cents: 30_000_00 }, // excluded
        { kind: "other",      balance_cents: 5_000_00 }, // excluded
      ],
    };
    const out = computeFireMetrics(state);
    expect(out.liquidNetWorthCents).toBe(115_000_00);
  });

  it("progressPct caps at 100%", () => {
    const state = {
      settings: baseSettings,
      categories: [{ label: "Rent", default_monthly_cents: 100_000 }],
      business_expenses: [],
      income_sources: [],
      assets: [{ kind: "cash", balance_cents: 100_000_000 }], // way over FIRE number
    };
    expect(computeFireMetrics(state).progressPct).toBe(100);
  });

  it("yearsToFire is null when annual expenses is zero (degenerate)", () => {
    const state = {
      settings: baseSettings,
      categories: [],
      business_expenses: [],
      income_sources: [],
      assets: [{ kind: "cash", balance_cents: 100_000_00 }],
    };
    expect(computeFireMetrics(state).yearsToFire).toBeNull();
  });

  it("yearsToFire = 0 when already past the FIRE number", () => {
    const state = {
      settings: baseSettings,
      categories: [{ label: "Rent", default_monthly_cents: 100_000 }],
      business_expenses: [],
      income_sources: [],
      assets: [{ kind: "cash", balance_cents: 10_000_000_00 }],
    };
    expect(computeFireMetrics(state).yearsToFire).toBe(0);
  });

  it("monthlySurplus is income minus personal + business expenses", () => {
    const state = {
      settings: baseSettings,
      categories: [{ label: "Rent", default_monthly_cents: 200_000 }],
      business_expenses: [{ monthly_cents: 50_000, frequency: "monthly" }],
      income_sources: [{ frequency: "monthly", net_amount_cents: 500_000 }],
      assets: [],
    };
    const out = computeFireMetrics(state);
    expect(out.monthlySurplusCents).toBe(500_000 - 200_000 - 50_000);
  });
});

describe("defaultProjectionInputs", () => {
  it("seeds starting balance from retirement-kind assets only", () => {
    const state = {
      assets: [
        { kind: "retirement", balance_cents: 50_000_00 },
        { kind: "cash",       balance_cents: 20_000_00 },
        { kind: "retirement", balance_cents: 30_000_00 },
      ],
      retirement_contributions: [],
      settings: {},
    };
    const out = defaultProjectionInputs(state);
    expect(out.startingBalanceCents).toBe(80_000_00);
  });

  it("uses the most recent retirement_contribution row as annual contribution", () => {
    const state = {
      assets: [],
      retirement_contributions: [
        { year: 2024, amount_cents: 10_000_00 },
        { year: 2026, amount_cents: 15_000_00 },
        { year: 2025, amount_cents: 12_000_00 },
      ],
      settings: {},
    };
    expect(defaultProjectionInputs(state).annualContributionCents).toBe(15_000_00);
  });

  it("falls back to a 7% return and 30-year horizon when settings are absent", () => {
    const out = defaultProjectionInputs({ assets: [], retirement_contributions: [], settings: {} });
    expect(out.annualReturnBps).toBe(700);
    expect(out.horizonYears).toBe(30);
  });

  it("respects user-set return / horizon in settings", () => {
    const out = defaultProjectionInputs({
      assets: [], retirement_contributions: [],
      settings: { retirement_return_bps: 1000, retirement_horizon_years: 25 },
    });
    expect(out.annualReturnBps).toBe(1000);
    expect(out.horizonYears).toBe(25);
  });
});
