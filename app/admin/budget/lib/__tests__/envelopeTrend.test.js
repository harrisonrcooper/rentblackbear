import { describe, it, expect } from "vitest";
import { buildEnvelopeTrend } from "../envelopeTrend";

const today = new Date(2026, 4, 13); // May 13, 2026

describe("buildEnvelopeTrend", () => {
  it("returns 6 months by default, oldest first", () => {
    const out = buildEnvelopeTrend({}, "Groceries", 6, today);
    expect(out).toHaveLength(6);
    expect(out[0].month).toBe("2025-12");
    expect(out[5].month).toBe("2026-05");
  });

  it("returns [] when categoryLabel is missing", () => {
    expect(buildEnvelopeTrend({ monthly_actuals: [] }, "", 6, today)).toEqual([]);
    expect(buildEnvelopeTrend({ monthly_actuals: [] }, null, 6, today)).toEqual([]);
  });

  it("sums multiple entries in the same month", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 5000 },
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 3000 },
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 2000 },
      ],
    };
    const out = buildEnvelopeTrend(state, "Groceries", 6, today);
    const may = out.find((m) => m.month === "2026-05");
    expect(may.spent).toBe(10000);
  });

  it("matches category labels case-insensitively + trim-tolerant", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-05-01", category_label: " GROCERIES ", amount_cents: 10000 },
        { month: "2026-05-01", category_label: "groceries",   amount_cents: 5000 },
      ],
    };
    const out = buildEnvelopeTrend(state, "Groceries", 6, today);
    const may = out.find((m) => m.month === "2026-05");
    expect(may.spent).toBe(15000);
  });

  it("excludes refunds / inflows (amount_cents <= 0)", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 10000 },
        { month: "2026-05-01", category_label: "Groceries", amount_cents: -2000 }, // refund
      ],
    };
    const out = buildEnvelopeTrend(state, "Groceries", 6, today);
    const may = out.find((m) => m.month === "2026-05");
    expect(may.spent).toBe(10000);
  });

  it("respects custom monthsBack count", () => {
    const out = buildEnvelopeTrend({}, "Groceries", 3, today);
    expect(out).toHaveLength(3);
    expect(out[0].month).toBe("2026-03");
    expect(out[2].month).toBe("2026-05");
  });

  it("fills missing months with $0 (so the strip has uniform width)", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 10000 },
      ],
    };
    const out = buildEnvelopeTrend(state, "Groceries", 6, today);
    expect(out).toHaveLength(6);
    expect(out.filter((m) => m.spent === 0)).toHaveLength(5);
    expect(out.find((m) => m.month === "2026-05").spent).toBe(10000);
  });

  it("ignores actuals for other categories", () => {
    const state = {
      monthly_actuals: [
        { month: "2026-05-01", category_label: "Groceries", amount_cents: 10000 },
        { month: "2026-05-01", category_label: "Gas",       amount_cents: 5000 },
      ],
    };
    const out = buildEnvelopeTrend(state, "Groceries", 6, today);
    const may = out.find((m) => m.month === "2026-05");
    expect(may.spent).toBe(10000);
  });
});
