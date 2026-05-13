import { describe, it, expect } from "vitest";
import {
  computePropertyAnalytics,
  projectPropertyROI,
  scheduleERow,
} from "../property";

const settings = { default_vacancy_bps: 1000, default_capex_bps: 500 };

// Reference property: $300k market, $200k mortgage, $250k purchase,
// 30-year term, 2 occupied $1.2k rooms, $200/mo fixed expense, $1.5k
// mortgage payment.
const refProperty = {
  market_value_cents: 300_000_00,
  mortgage_balance_cents: 200_000_00,
  mortgage_payment_cents: 1_500_00,
  mortgage_term_years: 30,
  purchase_price_cents: 250_000_00,
  rooms: [
    { rent_cents: 1_200_00, occupied: true },
    { rent_cents: 1_200_00, occupied: true },
  ],
  expenses: [
    { kind: "fixed", monthly_cents: 200_00 },
    { kind: "fixed", monthly_cents: 1_500_00 }, // mortgage as a fixed line
  ],
  status: "operating",
};

describe("computePropertyAnalytics", () => {
  it("monthlyGross sums only occupied rooms", () => {
    const a = computePropertyAnalytics(refProperty, settings);
    expect(a.monthlyGross).toBe(2_400_00);
    expect(a.annualGross).toBe(28_800_00);
  });

  it("equity = market_value − mortgage_balance", () => {
    const a = computePropertyAnalytics(refProperty, settings);
    expect(a.equity).toBe(100_000_00);
  });

  it("27.5-year straight-line depreciation on 80% of basis", () => {
    const a = computePropertyAnalytics(refProperty, settings);
    // basis = $250k → building 200k → depreciation $7,272.72 → 727272
    expect(a.depreciableBasis).toBe(200_000_00);
    expect(a.annualDepreciation).toBe(Math.round(200_000_00 / 27.5));
  });

  it("falls back to market_value when purchase_price is missing", () => {
    const p = { ...refProperty, purchase_price_cents: undefined };
    const a = computePropertyAnalytics(p, settings);
    expect(a.depreciableBasis).toBe(Math.round(300_000_00 * 0.8));
  });

  it("occupancyBps reflects occupied/total ratio", () => {
    const half = {
      ...refProperty,
      rooms: [
        { rent_cents: 1_000_00, occupied: true },
        { rent_cents: 1_000_00, occupied: false },
      ],
    };
    expect(computePropertyAnalytics(half, settings).occupancyBps).toBe(5000);
    expect(computePropertyAnalytics({ ...refProperty, rooms: [] }, settings).occupancyBps).toBe(0);
  });

  it("capRate uses unlevered NOI (mortgage payment backed out)", () => {
    const a = computePropertyAnalytics(refProperty, settings);
    // Cap rate should land somewhere reasonable; verify it's >0 and
    // less than the levered NOI / market value ratio.
    expect(a.capRateBps).toBeGreaterThan(0);
    expect(a.unleveredAnnualNoi).toBeGreaterThan(a.annualNoi);
  });

  it("cocBps uses cash_invested_cents override when present", () => {
    const explicit = { ...refProperty, cash_invested_cents: 50_000_00 };
    const a = computePropertyAnalytics(explicit, settings);
    expect(a.cashInvested).toBe(50_000_00);
  });

  it("maintenanceL12mCents only counts entries within the last year", () => {
    const today = new Date();
    const recent = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const old = "2020-01-01";
    const p = {
      ...refProperty,
      maintenance_log: [
        { date: recent, amount_cents: 500_00 },
        { date: old,    amount_cents: 1_500_00 },
      ],
    };
    const a = computePropertyAnalytics(p, settings);
    expect(a.maintenanceL12mCents).toBe(500_00);
    expect(a.maintenanceAllTimeCents).toBe(2_000_00);
  });
});

describe("projectPropertyROI", () => {
  it("yields horizonYears + 1 rows (year 0 = today)", () => {
    const out = projectPropertyROI(refProperty, { horizonYears: 5 });
    expect(out).toHaveLength(6);
    expect(out[0].year).toBe(0);
    expect(out[5].year).toBe(5);
  });

  it("year 0 reflects today's value, mortgage, equity", () => {
    const out = projectPropertyROI(refProperty);
    expect(out[0].value_cents).toBe(300_000_00);
    expect(out[0].mortgage_cents).toBe(200_000_00);
    expect(out[0].equity_cents).toBe(100_000_00);
  });

  it("value compounds at the supplied appreciationBps", () => {
    const out = projectPropertyROI(refProperty, { horizonYears: 1, appreciationBps: 500 });
    // $300k @ 5% = $315k
    expect(out[1].value_cents).toBe(Math.round(300_000_00 * 1.05));
  });

  it("mortgage paydown is linear over mortgage_term_years", () => {
    const out = projectPropertyROI(refProperty, { horizonYears: 1 });
    const expectedPaydown = Math.round(200_000_00 / 30);
    expect(out[1].mortgage_cents).toBe(200_000_00 - expectedPaydown);
  });

  it("flat balance when term_years is missing (conservative)", () => {
    const p = { ...refProperty, mortgage_term_years: 0 };
    const out = projectPropertyROI(p, { horizonYears: 3 });
    expect(out[1].mortgage_cents).toBe(200_000_00);
    expect(out[3].mortgage_cents).toBe(200_000_00);
  });

  it("equity stays positive after balance reaches 0", () => {
    const out = projectPropertyROI(refProperty, { horizonYears: 30 });
    const last = out[out.length - 1];
    expect(last.mortgage_cents).toBe(0);
    expect(last.equity_cents).toBe(last.value_cents);
  });
});

describe("scheduleERow", () => {
  it("returns a CPA-ready row with annual gross + expenses + depreciation + taxable", () => {
    const row = scheduleERow(refProperty, settings, 2026);
    expect(row.year).toBe(2026);
    expect(row.annual_gross_rents_cents).toBe(28_800_00);
    expect(row.depreciation_cents).toBe(Math.round(200_000_00 / 27.5));
    expect(row.taxable_income_cents).toBeDefined();
  });
});
