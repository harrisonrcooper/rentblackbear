import { describe, it, expect } from "vitest";
import {
  nextDueDate,
  billPeriodKey,
  billsToAutoPost,
  monthlyBillTotal,
} from "../bills";

describe("nextDueDate", () => {
  it("returns today's-month date if the due day hasn't passed", () => {
    const today = new Date(2026, 4, 5); // May 5
    const due = nextDueDate({ cadence: "monthly", due_day: 20 }, today);
    expect(due).toBe("2026-05-20");
  });

  it("rolls into next month once the due day has passed", () => {
    const today = new Date(2026, 4, 25); // May 25
    const due = nextDueDate({ cadence: "monthly", due_day: 20 }, today);
    expect(due).toBe("2026-06-20");
  });

  it("clamps Feb 31 → Feb 28 in a non-leap year", () => {
    const today = new Date(2026, 1, 1); // Feb 1, 2026 (not a leap year)
    const due = nextDueDate({ cadence: "monthly", due_day: 31 }, today);
    expect(due).toBe("2026-02-28");
  });

  it("clamps Feb 31 → Feb 29 in a leap year", () => {
    const today = new Date(2028, 1, 1); // Feb 1, 2028 (leap year)
    const due = nextDueDate({ cadence: "monthly", due_day: 31 }, today);
    expect(due).toBe("2028-02-29");
  });

  it("rolls yearly bills to next year once their month has passed", () => {
    const today = new Date(2026, 6, 1); // July 1
    const due = nextDueDate({ cadence: "yearly", due_day: 15, due_month: 3 }, today);
    expect(due).toBe("2027-03-15");
  });
});

describe("billPeriodKey", () => {
  it("returns YYYY-MM for monthly bills", () => {
    const k = billPeriodKey({ cadence: "monthly", due_day: 1 }, new Date(2026, 4, 13));
    expect(k).toBe("2026-05");
  });
  it("returns YYYY for yearly bills", () => {
    const k = billPeriodKey({ cadence: "yearly", due_month: 3, due_day: 15 }, new Date(2026, 0, 1));
    expect(k).toBe("2026");
  });
  it("returns YYYY-Qn for quarterly bills", () => {
    expect(billPeriodKey({ cadence: "quarterly", due_day: 1 }, new Date(2026, 0, 1))).toBe("2026-Q1");
    expect(billPeriodKey({ cadence: "quarterly", due_day: 1 }, new Date(2026, 3, 1))).toBe("2026-Q2");
    expect(billPeriodKey({ cadence: "quarterly", due_day: 1 }, new Date(2026, 9, 1))).toBe("2026-Q4");
  });
});

describe("billsToAutoPost", () => {
  it("returns nothing for bills with auto_post off", () => {
    const bills = [{ id: "1", cadence: "monthly", due_day: 1, amount_cents: 10000, auto_post: false }];
    expect(billsToAutoPost(bills, new Date(2026, 4, 15))).toEqual([]);
  });

  it("returns nothing when the due day hasn't been reached yet", () => {
    const bills = [{ id: "1", cadence: "monthly", due_day: 28, amount_cents: 10000, auto_post: true }];
    expect(billsToAutoPost(bills, new Date(2026, 4, 5))).toEqual([]);
  });

  it("queues a bill whose due date passed and period hasn't been posted", () => {
    const bills = [{ id: "1", cadence: "monthly", due_day: 1, amount_cents: 10000, auto_post: true, last_auto_posted_period: null }];
    const out = billsToAutoPost(bills, new Date(2026, 4, 15));
    expect(out).toHaveLength(1);
    expect(out[0].period).toBe("2026-05");
  });

  it("is idempotent — re-runs in the same period find nothing", () => {
    const bills = [{
      id: "1",
      cadence: "monthly",
      due_day: 1,
      amount_cents: 10000,
      auto_post: true,
      last_auto_posted_period: "2026-05",
    }];
    expect(billsToAutoPost(bills, new Date(2026, 4, 15))).toEqual([]);
  });

  it("skips archived bills", () => {
    const bills = [{
      id: "1", cadence: "monthly", due_day: 1, amount_cents: 10000,
      auto_post: true, archived_at: "2026-04-01",
    }];
    expect(billsToAutoPost(bills, new Date(2026, 4, 15))).toEqual([]);
  });
});

describe("monthlyBillTotal", () => {
  it("converts every cadence to a monthly equivalent", () => {
    const bills = [
      { cadence: "monthly",   amount_cents: 100_00 },
      { cadence: "yearly",    amount_cents: 1200_00 }, // /12 = 100
      { cadence: "quarterly", amount_cents: 300_00 },  // /3 = 100
      { cadence: "weekly",    amount_cents: 23_00 },   // *52/12 ≈ 99.67
    ];
    const total = monthlyBillTotal(bills);
    // Sum is the rounded sum of the four ~$100 monthly-equivalents.
    expect(total).toBeGreaterThanOrEqual(396_00);
    expect(total).toBeLessThanOrEqual(400_00);
  });

  it("ignores archived bills", () => {
    const bills = [
      { cadence: "monthly", amount_cents: 100_00 },
      { cadence: "monthly", amount_cents: 50_00, archived_at: "2026-01-01" },
    ];
    expect(monthlyBillTotal(bills)).toBe(100_00);
  });
});
