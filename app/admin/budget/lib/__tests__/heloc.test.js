import { describe, it, expect } from "vitest";
import { computeStrategies, defaultStrategyInputs } from "../heloc";

// Reference scenario: a $200k loan @ 6% APR with a 30-year amortizing
// payment of $1,199.10. Used as the baseline across tests below so
// the assertions stay in roughly the same financial neighborhood.
const baseLoan = {
  mortgage_balance_cents: 200_000_00,
  mortgage_rate_bps: 600,
  mortgage_payment_cents: 1199_10,
  mortgage_term_years: 30,
  monthly_income_cents: 10_000_00,
  monthly_expenses_cents: 5_000_00,
};

describe("computeStrategies", () => {
  it("returns an empty array when inputs are incomplete", () => {
    expect(computeStrategies({})).toEqual([]);
    expect(computeStrategies({ mortgage_balance_cents: 0 })).toEqual([]);
    expect(computeStrategies({ mortgage_balance_cents: 100_000_00 })).toEqual([]);
  });

  it("always emits a Traditional strategy as the baseline", () => {
    const out = computeStrategies({ ...baseLoan, extra_payment_cents: 0 });
    const trad = out.find((s) => s.id === "traditional");
    expect(trad).toBeDefined();
    expect(trad.upfrontCost).toBe(0);
    expect(trad.savingsVsBaseline).toBe(0);
    // 30-year payoff is ~360 months — give a generous ±12 month window
    // since edge-of-amortization rounding shifts the final month.
    expect(trad.months).toBeGreaterThan(340);
    expect(trad.months).toBeLessThan(380);
  });

  it("Extra Principal pays off faster and saves interest", () => {
    const out = computeStrategies({ ...baseLoan, extra_payment_cents: 500_00 });
    const trad = out.find((s) => s.id === "traditional");
    const extra = out.find((s) => s.id === "extra_principal");
    expect(extra).toBeDefined();
    expect(extra.months).toBeLessThan(trad.months);
    expect(extra.totalInterest).toBeLessThan(trad.totalInterest);
    expect(extra.savingsVsBaseline).toBeGreaterThan(0);
  });

  it("HELOC Velocity emits when there's a heloc rate + surplus", () => {
    const out = computeStrategies({
      ...baseLoan,
      heloc_rate_bps: 800,
      extra_payment_cents: 0,
    });
    const heloc = out.find((s) => s.id === "heloc");
    expect(heloc).toBeDefined();
    expect(heloc.totalInterest).toBeGreaterThan(0);
  });

  it("Refinance strategies emit only when the target rate is lower", () => {
    const baseline = computeStrategies({ ...baseLoan });
    expect(baseline.find((s) => s.id === "refi")).toBeUndefined();

    const refi = computeStrategies(baseLoan, { refiRateBps: 500, refiCostCents: 4_000_00 });
    const r = refi.find((s) => s.id === "refi");
    expect(r).toBeDefined();
    expect(r.upfrontCost).toBe(4_000_00);
    expect(r.totalCost).toBeGreaterThanOrEqual(r.upfrontCost);
    // A higher target rate must NOT produce a refi strategy.
    const noRefi = computeStrategies(baseLoan, { refiRateBps: 700, refiCostCents: 4_000_00 });
    expect(noRefi.find((s) => s.id === "refi")).toBeUndefined();
  });

  it("applies marginal tax adjustment to the after-tax columns", () => {
    const out = computeStrategies({ ...baseLoan, extra_payment_cents: 500_00 }, { marginalBps: 2400 });
    const trad = out.find((s) => s.id === "traditional");
    expect(trad.afterTaxCost).toBe(Math.round(trad.totalCost * (1 - 0.24)));
  });
});

describe("defaultStrategyInputs", () => {
  it("falls back to a 24% federal marginal rate when settings are absent", () => {
    const out = defaultStrategyInputs({ heloc_model: baseLoan });
    expect(out.marginalBps).toBe(2400);
  });

  it("returns 0 refi target when current rate is too low to refinance", () => {
    const out = defaultStrategyInputs({ heloc_model: { ...baseLoan, mortgage_rate_bps: 100 } });
    expect(out.refiRateBps).toBe(0);
  });
});
