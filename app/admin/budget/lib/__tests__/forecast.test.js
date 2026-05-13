import { describe, it, expect } from "vitest";
import { computeForecast } from "../forecast";

const baseState = {
  settings: { default_vacancy_bps: 1000, default_capex_bps: 500 },
  income_sources: [{ frequency: "monthly", net_amount_cents: 500_000 }],
  categories: [{ label: "Rent", default_monthly_cents: 200_000 }],
  business_expenses: [],
  properties: [],
  assets: [],
  debts: [],
  history: [],
  monthly_actuals: [],
};

describe("computeForecast", () => {
  it("returns 18 rows by default — 6 past + current + 11 future", () => {
    // Loop: i = -6 to 11 (inclusive) → 18 entries. is_future = (i > 0)
    // gives 11 future months; is_current is i = 0; the other 6 are past.
    const out = computeForecast(baseState);
    expect(out.series).toHaveLength(18);
    expect(out.series.filter((r) => r.is_future).length).toBe(11);
    expect(out.series.filter((r) => r.is_current).length).toBe(1);
    expect(out.series.filter((r) => !r.is_future && !r.is_current).length).toBe(6);
  });

  it("respects custom historyMonths + horizonMonths", () => {
    const out = computeForecast(baseState, { historyMonths: 3, horizonMonths: 6 });
    expect(out.series).toHaveLength(9);
  });

  it("marks current month with is_current and no other row", () => {
    const out = computeForecast(baseState);
    const currents = out.series.filter((r) => r.is_current);
    expect(currents).toHaveLength(1);
  });

  it("baseIncome includes rental gross from operating properties", () => {
    const state = {
      ...baseState,
      properties: [
        { status: "operating", rooms: [{ rent_cents: 1500_00, occupied: true }], expenses: [] },
      ],
    };
    const out = computeForecast(state);
    // monthly income $5k + rental $1500 = $6500
    expect(out.baseIncome).toBe(500_000 + 150_000);
  });

  it("baseNet = baseIncome − baseExpenses", () => {
    const out = computeForecast(baseState);
    expect(out.monthlyAvgNet).toBe(out.baseIncome - out.baseExpenses);
  });

  it("annualRunRate is 12 × monthlyAvgNet", () => {
    const out = computeForecast(baseState);
    expect(out.annualRunRate).toBe(out.monthlyAvgNet * 12);
  });

  it("cumulative_net_cents accumulates only over current + future months", () => {
    const out = computeForecast(baseState);
    const past = out.series.filter((r) => !r.is_future && !r.is_current);
    for (const r of past) expect(r.cumulative_net_cents).toBeNull();
    const futureCum = out.series.filter((r) => r.is_future).map((r) => r.cumulative_net_cents);
    // Cumulative should be monotonically increasing for a positive baseNet.
    for (let i = 1; i < futureCum.length; i++) {
      expect(futureCum[i]).toBeGreaterThan(futureCum[i - 1]);
    }
  });

  it("logged monthly_actuals override the derived historical expenses", () => {
    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const state = {
      ...baseState,
      monthly_actuals: [
        { month: thisMonth, category_label: "Rent", amount_cents: 999_999, paid_on: thisMonth },
      ],
    };
    const out = computeForecast(state);
    const current = out.series.find((r) => r.is_current);
    expect(current.expenses_cents).toBe(999_999);
  });

  it("netWorthIn12Months = netWorthNow + 12 accumulated future months (current + 11)", () => {
    const state = {
      ...baseState,
      assets: [{ kind: "cash", balance_cents: 10_000_00 }],
      debts: [],
      properties: [],
    };
    const out = computeForecast(state);
    // Accumulator runs over is_current + is_future rows = 1 + 11 = 12.
    expect(out.netWorthIn12Months).toBe(out.netWorthNow + (out.monthlyAvgNet * 12));
  });
});
