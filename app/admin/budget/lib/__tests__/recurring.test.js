import { describe, it, expect } from "vitest";
import { detectRecurring } from "../recurring";

// Helper: build a Plaid-shaped transaction record.
const txn = (over = {}) => ({
  plaid_txn_id: over.plaid_txn_id || `t_${Math.random().toString(36).slice(2, 8)}`,
  merchant_name: "Netflix",
  name: "Netflix",
  amount_cents: 15_99,
  date: "2026-05-01",
  pending: false,
  dismissed_at: null,
  imported_at: null,
  predicted_category_label: null,
  ...over,
});

describe("detectRecurring", () => {
  it("returns nothing when there are no Plaid transactions", () => {
    expect(detectRecurring({})).toEqual([]);
    expect(detectRecurring({ plaid_transactions: [] })).toEqual([]);
  });

  it("requires ≥3 occurrences to consider a pattern recurring", () => {
    const state = {
      plaid_transactions: [
        txn({ date: "2026-03-01" }),
        txn({ date: "2026-04-01" }),
      ],
    };
    expect(detectRecurring(state)).toEqual([]);
  });

  it("detects a clean monthly subscription", () => {
    const state = {
      plaid_transactions: [
        txn({ date: "2026-02-01" }),
        txn({ date: "2026-03-01" }),
        txn({ date: "2026-04-01" }),
        txn({ date: "2026-05-01" }),
      ],
    };
    const out = detectRecurring(state);
    expect(out).toHaveLength(1);
    expect(out[0].cadence).toBe("monthly");
    expect(out[0].occurrences).toBe(4);
    expect(out[0].median_amount_cents).toBe(1599);
    expect(out[0].last_paid_on).toBe("2026-05-01");
    expect(out[0].due_day).toBe(1);
  });

  it("detects a biweekly cadence", () => {
    const state = {
      plaid_transactions: [
        txn({ date: "2026-04-01", merchant_name: "Lawn Co" }),
        txn({ date: "2026-04-15", merchant_name: "Lawn Co" }),
        txn({ date: "2026-04-29", merchant_name: "Lawn Co" }),
      ],
    };
    const out = detectRecurring(state);
    expect(out).toHaveLength(1);
    expect(out[0].cadence).toBe("biweekly");
  });

  it("rejects clusters whose amounts swing by >10%", () => {
    // 3 charges, but amounts 1000 / 1200 / 800 — way too variable
    const state = {
      plaid_transactions: [
        txn({ date: "2026-02-01", amount_cents: 1000 }),
        txn({ date: "2026-03-01", amount_cents: 1200 }),
        txn({ date: "2026-04-01", amount_cents: 800 }),
      ],
    };
    expect(detectRecurring(state)).toEqual([]);
  });

  it("ignores transactions for merchants that already have a bill", () => {
    const state = {
      bills: [{ id: "b1", vendor: "Netflix" }],
      plaid_transactions: [
        txn({ date: "2026-03-01" }),
        txn({ date: "2026-04-01" }),
        txn({ date: "2026-05-01" }),
      ],
    };
    const out = detectRecurring(state);
    // Detector still produces the suggestion but flags existing_bill_id
    // so the UI can hide it. Verify both.
    expect(out).toHaveLength(1);
    expect(out[0].existing_bill_id).toBe("b1");
  });

  it("ignores dismissed, pending, and inflow transactions", () => {
    const state = {
      plaid_transactions: [
        txn({ date: "2026-03-01", dismissed_at: "2026-03-02" }),
        txn({ date: "2026-04-01", pending: true }),
        txn({ date: "2026-05-01", amount_cents: -1599 }), // refund
      ],
    };
    expect(detectRecurring(state)).toEqual([]);
  });

  it("sorts suggestions by impact — biggest median first", () => {
    const state = {
      plaid_transactions: [
        // Small ($16) — 3 charges
        txn({ date: "2026-03-01", merchant_name: "Netflix",   amount_cents: 1599 }),
        txn({ date: "2026-04-01", merchant_name: "Netflix",   amount_cents: 1599 }),
        txn({ date: "2026-05-01", merchant_name: "Netflix",   amount_cents: 1599 }),
        // Big ($500) — 3 charges
        txn({ date: "2026-03-01", merchant_name: "Mortgage",  amount_cents: 500_00 }),
        txn({ date: "2026-04-01", merchant_name: "Mortgage",  amount_cents: 500_00 }),
        txn({ date: "2026-05-01", merchant_name: "Mortgage",  amount_cents: 500_00 }),
      ],
    };
    const out = detectRecurring(state);
    expect(out.map((s) => s.merchant_name)).toEqual(["Mortgage", "Netflix"]);
  });
});
