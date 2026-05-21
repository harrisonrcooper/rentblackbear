import { describe, it, expect } from "vitest";
import {
  propertyMonthlyGross,
  propertyMonthlyExpenses,
  propertyOperatingExpenses,
  propertyHelocPayment,
  propertyRentalShare,
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

describe("propertyHelocPayment", () => {
  it("is zero when no HELOC is configured", () => {
    expect(propertyHelocPayment({ rooms: [], expenses: [] })).toBe(0);
  });

  it("auto-computes interest-only — balance x rate / 12", () => {
    // $100,000 balance @ 9% → 100_000_00 * 0.09 / 12 = 75_000 cents
    const p = { heloc_balance_cents: 100_000_00, heloc_rate_bps: 900 };
    expect(propertyHelocPayment(p)).toBe(75_000);
  });

  it("returns zero when balance or rate is missing", () => {
    expect(propertyHelocPayment({ heloc_balance_cents: 100_000_00 })).toBe(0);
    expect(propertyHelocPayment({ heloc_rate_bps: 900 })).toBe(0);
  });

  it("a manual payment override wins over the interest-only calc", () => {
    const p = { heloc_balance_cents: 100_000_00, heloc_rate_bps: 900, heloc_payment_cents: 120_000 };
    expect(propertyHelocPayment(p)).toBe(120_000);
  });
});

describe("propertyMonthlyExpenses with HELOC", () => {
  it("folds the HELOC payment in on top of operating expenses", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [{ kind: "fixed", monthly_cents: 20_000 }],
      heloc_balance_cents: 100_000_00,
      heloc_rate_bps: 900, // interest-only = 75_000
    };
    expect(propertyOperatingExpenses(p, settings)).toBe(20_000);
    expect(propertyMonthlyExpenses(p, settings)).toBe(20_000 + 75_000);
    // NOI: gross 100k - opex 20k - HELOC 75k = 5k
    expect(propertyMonthlyNet(p, settings)).toBe(5_000);
  });
});

describe("propertyRentalShare (owner-occupied / house hack)", () => {
  it("is 1 for a pure rental", () => {
    expect(propertyRentalShare({})).toBe(1);
    expect(propertyRentalShare({ personal_use_bps: 0 })).toBe(1);
  });
  it("is 0.5 for a 50/50 house hack", () => {
    expect(propertyRentalShare({ personal_use_bps: 5000 })).toBe(0.5);
  });
  it("clamps out-of-range values", () => {
    expect(propertyRentalShare({ personal_use_bps: -100 })).toBe(1);
    expect(propertyRentalShare({ personal_use_bps: 20000 })).toBe(0);
  });
});

describe("propertyOperatingExpenses with owner-occupied split", () => {
  it("splits FIXED costs by rental share, leaves vacancy/capex whole", () => {
    const p = {
      personal_use_bps: 5000, // 50% owner-occupied duplex
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [
        { kind: "fixed", monthly_cents: 40_000 }, // → 20_000 at 50%
        { kind: "vacancy_pct" },                  // 10% of 100k = 10_000, NOT split
        { kind: "capex_pct" },                    // 5% of 100k = 5_000, NOT split
      ],
    };
    expect(propertyOperatingExpenses(p, settings)).toBe(20_000 + 10_000 + 5_000);
    // NOI: gross 100k − rental-share expenses 35k = 65k
    expect(propertyMonthlyNet(p, settings)).toBe(65_000);
  });
  it("leaves a pure rental (no personal use) unchanged", () => {
    const p = {
      rooms: [{ rent_cents: 100_000, occupied: true }],
      expenses: [{ kind: "fixed", monthly_cents: 40_000 }],
    };
    expect(propertyOperatingExpenses(p, settings)).toBe(40_000);
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
