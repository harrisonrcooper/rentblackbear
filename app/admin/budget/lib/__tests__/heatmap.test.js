import { describe, it, expect } from "vitest";
import { buildSpendingHeatmap } from "../heatmap";

const today = new Date(2026, 4, 13); // May 13, 2026 (Wed)

describe("buildSpendingHeatmap", () => {
  it("returns a 53-week × 7-day grid by default", () => {
    const g = buildSpendingHeatmap({ monthly_actuals: [] }, 53, today);
    expect(g.cells).toHaveLength(53 * 7);
    expect(g.weeks).toBe(53);
  });

  it("respects a custom weeks count", () => {
    const g = buildSpendingHeatmap({ monthly_actuals: [] }, 12, today);
    expect(g.cells).toHaveLength(12 * 7);
  });

  it("flags future cells with bucket = -1", () => {
    const g = buildSpendingHeatmap({ monthly_actuals: [] }, 4, today);
    const future = g.cells.filter((c) => c.inFuture);
    expect(future.length).toBeGreaterThan(0);
    expect(future.every((c) => c.bucket === -1)).toBe(true);
  });

  it("ignores refunds / inflows (amount_cents <= 0)", () => {
    const state = {
      monthly_actuals: [
        { paid_on: "2026-05-10", amount_cents: 5000 },
        { paid_on: "2026-05-10", amount_cents: -1500 }, // refund
      ],
    };
    const g = buildSpendingHeatmap(state, 4, today);
    const cell = g.cells.find((c) => c.iso === "2026-05-10");
    expect(cell.cents).toBe(5000);
  });

  it("sums multiple same-day transactions", () => {
    const state = {
      monthly_actuals: [
        { paid_on: "2026-05-10", amount_cents: 5000 },
        { paid_on: "2026-05-10", amount_cents: 3000 },
        { paid_on: "2026-05-10", amount_cents: 1500 },
      ],
    };
    const g = buildSpendingHeatmap(state, 4, today);
    const cell = g.cells.find((c) => c.iso === "2026-05-10");
    expect(cell.cents).toBe(9500);
  });

  it("buckets days by percentile of non-zero spend", () => {
    // Three small days + one huge day. The huge day should land at
    // bucket 4 or 5; small days at 1.
    const state = {
      monthly_actuals: [
        { paid_on: "2026-05-01", amount_cents: 100 },
        { paid_on: "2026-05-02", amount_cents: 100 },
        { paid_on: "2026-05-03", amount_cents: 100 },
        { paid_on: "2026-05-04", amount_cents: 100000 },
      ],
    };
    const g = buildSpendingHeatmap(state, 4, today);
    const small = g.cells.find((c) => c.iso === "2026-05-01");
    const big = g.cells.find((c) => c.iso === "2026-05-04");
    expect(big.bucket).toBeGreaterThan(small.bucket);
  });

  it("totals + activeDays + heaviest are computed correctly", () => {
    const state = {
      monthly_actuals: [
        { paid_on: "2026-05-10", amount_cents: 5000 },
        { paid_on: "2026-05-11", amount_cents: 7500 },
      ],
    };
    const g = buildSpendingHeatmap(state, 4, today);
    expect(g.totalCents).toBe(12500);
    expect(g.activeDays).toBe(2);
    expect(g.heaviest.iso).toBe("2026-05-11");
    expect(g.heaviest.cents).toBe(7500);
  });
});
