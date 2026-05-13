import { describe, it, expect } from "vitest";
import {
  fmtUsd,
  fmtCompact,
  biweeklyToMonthly,
  yearlyToMonthly,
  categoryMonthly,
  incomeMonthly,
} from "../money";

describe("fmtUsd", () => {
  it("formats sub-$1k amounts with two decimals", () => {
    // Intl applies a thousands separator only when there are thousands.
    expect(fmtUsd(0)).toBe("$0.00");
    expect(fmtUsd(1)).toBe("$0.01");
    expect(fmtUsd(99999)).toBe("$999.99");
  });
  it("drops decimals once we cross $1k", () => {
    expect(fmtUsd(123456)).toBe("$1,235");
    expect(fmtUsd(100_000)).toBe("$1,000");
  });
  it("returns the em-dash placeholder for null / NaN", () => {
    expect(fmtUsd(null)).toBe("—");
    expect(fmtUsd(NaN)).toBe("—");
  });
  it("compact opt zeroes decimals even for small amounts", () => {
    expect(fmtUsd(99, { compact: true })).toBe("$1");
  });
});

describe("fmtCompact", () => {
  it("renders millions with M suffix", () => {
    expect(fmtCompact(2_500_000_00)).toBe("$2.50M");
    expect(fmtCompact(12_000_000_00)).toBe("$12.0M");
  });
  it("renders thousands with k suffix", () => {
    expect(fmtCompact(5_000_00)).toBe("$5k");
  });
  it("renders sub-$1k as bare integers", () => {
    expect(fmtCompact(75_00)).toBe("$75");
  });
});

describe("biweeklyToMonthly", () => {
  it("converts a $1,000 biweekly paycheck to ~$2,167/mo", () => {
    // 26 paychecks/year / 12 months = 2.1667
    expect(biweeklyToMonthly(100_000)).toBe(Math.round((100_000 * 26) / 12));
  });
  it("returns 0 for 0", () => {
    expect(biweeklyToMonthly(0)).toBe(0);
  });
});

describe("yearlyToMonthly", () => {
  it("divides by 12 with rounding", () => {
    expect(yearlyToMonthly(120_000)).toBe(10_000);
    // 100_001 / 12 = 8333.4167 → Math.round → 8333
    expect(yearlyToMonthly(100_001)).toBe(8333);
  });
});

describe("categoryMonthly", () => {
  it("prefers default_monthly_cents when present", () => {
    expect(categoryMonthly({ default_monthly_cents: 50_000, default_biweekly_cents: 100_000 })).toBe(50_000);
  });
  it("falls back to biweekly when monthly is zero", () => {
    expect(categoryMonthly({ default_monthly_cents: 0, default_biweekly_cents: 100_000 })).toBe(biweeklyToMonthly(100_000));
  });
  it("falls back to yearly when monthly + biweekly are zero", () => {
    expect(categoryMonthly({ default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 120_000 })).toBe(10_000);
  });
  it("returns 0 for an empty category", () => {
    expect(categoryMonthly({})).toBe(0);
  });
});

describe("incomeMonthly", () => {
  it("handles weekly", () => {
    expect(incomeMonthly({ frequency: "weekly", net_amount_cents: 100_000 })).toBe(Math.round((100_000 * 52) / 12));
  });
  it("handles biweekly", () => {
    expect(incomeMonthly({ frequency: "biweekly", net_amount_cents: 200_000 })).toBe(biweeklyToMonthly(200_000));
  });
  it("handles semimonthly (twice/month)", () => {
    expect(incomeMonthly({ frequency: "semimonthly", net_amount_cents: 150_000 })).toBe(300_000);
  });
  it("handles monthly", () => {
    expect(incomeMonthly({ frequency: "monthly", net_amount_cents: 500_000 })).toBe(500_000);
  });
  it("handles yearly", () => {
    expect(incomeMonthly({ frequency: "yearly", net_amount_cents: 12_000_000 })).toBe(1_000_000);
  });
});
