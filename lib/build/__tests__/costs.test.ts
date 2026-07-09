import { describe, it, expect } from "vitest";

import {
  actualCents, approvedChangeOrderCents, costBasisCents, estimateCents,
  leftToPayCents, lineCents, perSquareFootCents, revisedCents, variance,
} from "../costs";

const line = (estimate: number, actual = 0, in_basis = true) => ({
  estimate_cents: estimate, actual_cents: actual, in_basis,
});
const co = (amount: number, status = "approved", kind = "add") => ({
  amount_cents: amount, status, kind,
});

describe("lineCents", () => {
  it("uses the actual once it is recorded", () => {
    expect(lineCents(line(70_000_00, 92_000_00))).toBe(92_000_00);
  });
  it("falls back to the estimate until then", () => {
    expect(lineCents(line(70_000_00, 0))).toBe(70_000_00);
  });
  it("is zero when neither is set", () => {
    expect(lineCents({})).toBe(0);
  });
  it("never returns a float, even from bad stored data", () => {
    expect(lineCents({ estimate_cents: 10.7 } as never)).toBe(10);
    expect(lineCents({ actual_cents: NaN, estimate_cents: 500 } as never)).toBe(500);
  });
});

describe("revisedCents — the number the dashboard leads with", () => {
  // The bug: revised was sum(estimates) + change orders, so recording an actual
  // that blew past its estimate never moved the headline figure.
  it("MOVES when an actual exceeds its estimate", () => {
    const lines = [line(70_000_00, 92_000_00), line(30_000_00)];
    expect(revisedCents(lines, [])).toBe(92_000_00 + 30_000_00);
  });

  it("moves down when an actual comes in under its estimate", () => {
    expect(revisedCents([line(50_000_00, 41_000_00)], [])).toBe(41_000_00);
  });

  it("equals the estimate total when nothing has been spent", () => {
    const lines = [line(10_000_00), line(5_000_00)];
    expect(revisedCents(lines, [])).toBe(estimateCents(lines));
  });

  it("adds approved change orders and ignores pending ones", () => {
    const lines = [line(100_000_00)];
    const orders = [co(10_000_00), co(50_000_00, "pending"), co(3_000_00, "rejected")];
    expect(revisedCents(lines, orders)).toBe(110_000_00);
  });

  it("subtracts an approved credit", () => {
    expect(revisedCents([line(100_000_00)], [co(8_000_00, "approved", "credit")])).toBe(92_000_00);
  });

  it("agrees with the tax cost basis on which price a line is worth", () => {
    // The smoking gun that the old revised was wrong: basis already used
    // `actual || estimate`. Both must now agree, line for line.
    const lines = [line(70_000_00, 92_000_00), line(30_000_00)];
    expect(revisedCents(lines, [])).toBe(costBasisCents(lines));
  });
});

describe("estimateCents / actualCents", () => {
  it("estimate sums every line, actual sums only what was spent", () => {
    const lines = [line(10_000_00, 9_000_00), line(20_000_00), line(5_000_00, 6_000_00)];
    expect(estimateCents(lines)).toBe(35_000_00);
    expect(actualCents(lines)).toBe(15_000_00);
  });
  it("both are zero for an empty build", () => {
    expect(estimateCents([])).toBe(0);
    expect(actualCents([])).toBe(0);
  });
});

describe("approvedChangeOrderCents", () => {
  it("is zero with no approved orders", () => {
    expect(approvedChangeOrderCents([co(5_000_00, "pending")])).toBe(0);
  });
  it("nets adds against credits", () => {
    expect(approvedChangeOrderCents([co(9_000_00), co(4_000_00, "approved", "credit")])).toBe(5_000_00);
  });
});

describe("leftToPayCents", () => {
  it("is the forecast minus what has been paid", () => {
    expect(leftToPayCents(100_000_00, 30_000_00)).toBe(70_000_00);
  });
  it("never goes negative when overpaid", () => {
    expect(leftToPayCents(100_000_00, 130_000_00)).toBe(0);
  });
});

describe("variance", () => {
  it("is positive when over and negative when under", () => {
    expect(variance(10_000_00, 12_000_00)).toBe(2_000_00);
    expect(variance(10_000_00, 8_000_00)).toBe(-2_000_00);
  });
  it("is zero on the nose", () => {
    expect(variance(10_000_00, 10_000_00)).toBe(0);
  });
});

describe("costBasisCents", () => {
  it("excludes lines flagged out of basis", () => {
    const lines = [line(10_000_00, 0, true), line(5_000_00, 0, false)];
    expect(costBasisCents(lines)).toBe(10_000_00);
  });
  it("treats a missing in_basis flag as included", () => {
    expect(costBasisCents([{ estimate_cents: 7_000_00 }])).toBe(7_000_00);
  });
});

describe("perSquareFootCents", () => {
  it("is zero when the square footage is unknown", () => {
    expect(perSquareFootCents(500_000_00, 0)).toBe(0);
  });
  it("rounds to whole cents", () => {
    expect(perSquareFootCents(500_000_00, 3000)).toBe(Math.round(500_000_00 / 3000));
  });
});
