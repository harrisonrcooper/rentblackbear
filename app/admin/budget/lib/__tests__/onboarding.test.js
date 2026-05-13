import { describe, it, expect } from "vitest";
import { computeOnboarding } from "../onboarding";

describe("computeOnboarding", () => {
  it("returns 5 steps after the Banking removal", () => {
    const out = computeOnboarding({});
    expect(out.steps).toHaveLength(5);
    // income, categories, networth, goal are required; properties is optional.
    expect(out.totalRequired).toBe(4);
    expect(out.totalRequired).toBe(out.steps.filter((s) => !s.optional).length);
  });

  it("everything starts incomplete on an empty state", () => {
    const out = computeOnboarding({});
    expect(out.completedRequired).toBe(0);
    expect(out.completedAll).toBe(0);
    expect(out.allRequiredDone).toBe(false);
    expect(out.percent).toBe(0);
  });

  it("income step completes when ≥1 income source has a non-zero amount", () => {
    const out = computeOnboarding({
      income_sources: [{ net_amount_cents: 500_000, frequency: "monthly" }],
    });
    expect(out.steps.find((s) => s.id === "income").completed).toBe(true);
  });

  it("categories step completes once 3+ envelopes are funded", () => {
    const fund = (n) =>
      Array.from({ length: n }).map((_, i) => ({
        label: `Cat${i}`,
        default_monthly_cents: 100,
      }));

    expect(computeOnboarding({ categories: fund(2) }).steps.find((s) => s.id === "categories").completed).toBe(false);
    expect(computeOnboarding({ categories: fund(3) }).steps.find((s) => s.id === "categories").completed).toBe(true);
  });

  it("properties step (optional) completes when an operating property has gross rent", () => {
    const out = computeOnboarding({
      properties: [
        {
          status: "operating",
          rooms: [{ rent_cents: 1500_00, occupied: true }],
        },
      ],
    });
    expect(out.steps.find((s) => s.id === "properties").completed).toBe(true);
  });

  it("networth step completes when assets or debts exist", () => {
    expect(computeOnboarding({
      assets: [{ balance_cents: 5000_00, kind: "cash" }],
    }).steps.find((s) => s.id === "networth").completed).toBe(true);

    expect(computeOnboarding({
      debts: [{ balance_cents: 10000_00, kind: "auto" }],
    }).steps.find((s) => s.id === "networth").completed).toBe(true);
  });

  it("goal step completes when a non-archived goal exists", () => {
    expect(computeOnboarding({
      goals: [{ id: "1", label: "Emergency fund", target_cents: 10000_00 }],
    }).steps.find((s) => s.id === "goal").completed).toBe(true);

    expect(computeOnboarding({
      goals: [{ id: "1", label: "Emergency fund", target_cents: 10000_00, archived: true }],
    }).steps.find((s) => s.id === "goal").completed).toBe(false);
  });

  it("allRequiredDone fires when every required step is complete (optional may still be pending)", () => {
    const state = {
      income_sources: [{ net_amount_cents: 500_000, frequency: "monthly" }],
      categories: [
        { label: "A", default_monthly_cents: 100 },
        { label: "B", default_monthly_cents: 100 },
        { label: "C", default_monthly_cents: 100 },
      ],
      assets: [{ balance_cents: 5000_00, kind: "cash" }],
      goals: [{ id: "1", label: "Test", target_cents: 1000_00 }],
      // No properties (optional).
    };
    const out = computeOnboarding(state);
    expect(out.allRequiredDone).toBe(true);
    expect(out.percent).toBe(100);
  });

  it("percent reflects required-only progress", () => {
    const state = {
      income_sources: [{ net_amount_cents: 500_000, frequency: "monthly" }],
    };
    const out = computeOnboarding(state);
    // 1 of 3 required steps done = 33%
    expect(out.percent).toBeGreaterThan(20);
    expect(out.percent).toBeLessThan(50);
  });
});
