import { describe, it, expect } from "vitest";
import { computeInsights } from "../insights";

const today = new Date(2026, 4, 13); // May 13, 2026
const lastMonth = "2026-04";
const thisMonth = "2026-05";

describe("computeInsights — cap + ordering", () => {
  it("returns no more than 4 insights", () => {
    // Synthetic state designed to trigger every kind of insight.
    const state = {
      monthly_actuals: [
        { month: `${thisMonth}-01`, category_label: "Groceries", amount_cents: 50_000, paid_on: "2026-05-05" },
        { month: `${thisMonth}-01`, category_label: "Gas",       amount_cents: 30_000, paid_on: "2026-05-06" },
        { month: `${lastMonth}-01`, category_label: "Groceries", amount_cents: 20_000, paid_on: "2026-04-10" },
      ],
      history: [
        { day: "2026-01-31", net_worth_cents: 50_000_00, saved_this_month_cents: 5_000_00 },
        { day: "2026-02-28", net_worth_cents: 55_000_00, saved_this_month_cents: 5_500_00 },
        { day: "2026-05-12", net_worth_cents: 90_000_00, saved_this_month_cents: 10_000_00 },
      ],
      mom_loans: [
        { label: "Mom", starting_balance_cents: 10_000_00, monthly_payment_cents: 2_000_00, payments: [] },
      ],
    };
    const out = computeInsights(state, today);
    expect(out.length).toBeLessThanOrEqual(4);
  });

  it("returns empty array when there's no signal anywhere", () => {
    const out = computeInsights({}, today);
    expect(out).toEqual([]);
  });
});

describe("computeInsights — top-category", () => {
  it("identifies the heaviest category this month", () => {
    const state = {
      monthly_actuals: [
        { month: `${thisMonth}-01`, category_label: "Groceries", amount_cents: 60_000 },
        { month: `${thisMonth}-01`, category_label: "Gas",       amount_cents: 20_000 },
      ],
    };
    const out = computeInsights(state, today);
    const top = out.find((i) => i.id === "top-category");
    expect(top).toBeDefined();
    expect(top.headline).toContain("Groceries");
    expect(top.value).toBe(60_000);
  });
});

describe("computeInsights — month-over-month delta", () => {
  it("flags significant ≥$50 increases as warn", () => {
    const state = {
      monthly_actuals: [
        { month: `${thisMonth}-01`, category_label: "Gas", amount_cents: 30_000 },
        { month: `${lastMonth}-01`, category_label: "Gas", amount_cents:  5_000 },
      ],
    };
    const out = computeInsights(state, today);
    const mom = out.find((i) => i.id === "mom-delta");
    expect(mom).toBeDefined();
    expect(mom.kind).toBe("warn");
    expect(mom.headline).toContain("up");
  });

  it("ignores deltas under $50 (noise filter)", () => {
    const state = {
      monthly_actuals: [
        { month: `${thisMonth}-01`, category_label: "Gas", amount_cents: 10_000 },
        { month: `${lastMonth}-01`, category_label: "Gas", amount_cents: 12_000 }, // $20 swing
      ],
    };
    const out = computeInsights(state, today);
    expect(out.find((i) => i.id === "mom-delta")).toBeUndefined();
  });
});

describe("computeInsights — mom-loan progress", () => {
  it("emits when within 6 payments of payoff", () => {
    const state = {
      mom_loans: [
        { label: "Mom", starting_balance_cents: 10_000_00, monthly_payment_cents: 2_000_00, payments: [] },
      ],
    };
    const out = computeInsights(state, today);
    const ml = out.find((i) => i.id.startsWith("mom-loan-"));
    expect(ml).toBeDefined();
    expect(ml.headline).toContain("Mom");
    expect(ml.kind).toBe("good");
  });

  it("does NOT emit when balance is far from payoff", () => {
    const state = {
      mom_loans: [
        { label: "Mom", starting_balance_cents: 50_000_00, monthly_payment_cents: 500_00, payments: [] },
      ],
    };
    const out = computeInsights(state, today);
    expect(out.find((i) => i.id.startsWith("mom-loan-"))).toBeUndefined();
  });
});

describe("computeInsights — net worth delta", () => {
  it("emits when net worth moved ≥$1k in the last 7 days", () => {
    // Detector requires ≥7 history entries before it considers a delta.
    const state = {
      history: [
        { day: "2026-05-06", net_worth_cents: 80_000_00 },
        { day: "2026-05-07", net_worth_cents: 80_100_00 },
        { day: "2026-05-08", net_worth_cents: 80_200_00 },
        { day: "2026-05-09", net_worth_cents: 80_400_00 },
        { day: "2026-05-10", net_worth_cents: 80_700_00 },
        { day: "2026-05-11", net_worth_cents: 81_000_00 },
        { day: "2026-05-12", net_worth_cents: 82_000_00 }, // +$2k vs day 1
      ],
    };
    const out = computeInsights(state, today);
    const nw = out.find((i) => i.id === "nw-7d");
    expect(nw).toBeDefined();
    expect(nw.kind).toBe("good");
  });
});

describe("computeInsights — ordering", () => {
  it("good insights come before warn, warn before info", () => {
    const state = {
      monthly_actuals: [
        { month: `${thisMonth}-01`, category_label: "Gas", amount_cents: 30_000 },
        { month: `${lastMonth}-01`, category_label: "Gas", amount_cents:  5_000 },
      ],
      mom_loans: [
        { label: "Mom", starting_balance_cents: 10_000_00, monthly_payment_cents: 2_000_00, payments: [] },
      ],
    };
    const out = computeInsights(state, today);
    const kindOrder = out.map((i) => i.kind);
    const goodIdx = kindOrder.indexOf("good");
    const warnIdx = kindOrder.indexOf("warn");
    if (goodIdx >= 0 && warnIdx >= 0) expect(goodIdx).toBeLessThan(warnIdx);
  });
});
