import { describe, it, expect } from "vitest";
import {
  TIERS,
  TIER_COLOR,
  ACHIEVEMENT_DEFS,
  computeAchievements,
  computeStreaks,
  fireConfetti,
} from "../achievements";

// computeAchievements calls computeNetWorthCents() under the hood,
// which reduces over state.properties / assets / debts directly. Real
// callers always pass a fully-shaped state (built from emptyBudgetState).
// Tests need to mirror that shape — this helper takes the override and
// merges over empty defaults.
const fullState = (overrides = {}) => ({
  properties: [], assets: [], debts: [],
  categories: [], income_sources: [], monthly_actuals: [],
  habits: [], history: [], mom_loans: [],
  ...overrides,
});

describe("tier tables", () => {
  it("ships five tiers with consistent ids + colors", () => {
    expect(TIERS.map((t) => t.id)).toEqual(["bronze", "silver", "gold", "platinum", "legendary"]);
    for (const t of TIERS) {
      expect(t.label).toBeTruthy();
      expect(t.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("TIER_COLOR exposes a flat id → hex map", () => {
    expect(TIER_COLOR.bronze).toBe("#c88318");
    expect(Object.keys(TIER_COLOR)).toHaveLength(5);
  });
});

describe("ACHIEVEMENT_DEFS", () => {
  it("every definition has id + label + tier + reach()", () => {
    expect(ACHIEVEMENT_DEFS.length).toBeGreaterThanOrEqual(10);
    for (const a of ACHIEVEMENT_DEFS) {
      expect(a.id).toBeTruthy();
      expect(a.label).toBeTruthy();
      expect(TIERS.map((t) => t.id)).toContain(a.tier);
      expect(typeof a.reach).toBe("function");
    }
  });

  it("ids are unique", () => {
    const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("bronze tier exists and contains the first-setup achievement", () => {
    const bronzes = ACHIEVEMENT_DEFS.filter((a) => a.tier === "bronze");
    expect(bronzes.length).toBeGreaterThan(0);
    expect(bronzes.find((a) => a.id === "first_setup")).toBeDefined();
  });
});

describe("computeAchievements", () => {
  it("returns one entry per definition, with color + unlocked + progress", () => {
    const out = computeAchievements(fullState());
    expect(out).toHaveLength(ACHIEVEMENT_DEFS.length);
    for (const a of out) {
      expect(a.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(typeof a.unlocked).toBe("boolean");
      if (a.progress) {
        expect(typeof a.progress.pct).toBe("number");
        expect(a.progress.pct).toBeGreaterThanOrEqual(0);
        expect(a.progress.pct).toBeLessThanOrEqual(100);
      }
    }
  });

  it("empty state → most/all achievements locked", () => {
    const out = computeAchievements(fullState());
    const unlocked = out.filter((a) => a.unlocked);
    expect(unlocked.length).toBeLessThan(out.length / 2);
  });

  it("first_setup unlocks once a category exists", () => {
    const before = computeAchievements(fullState()).find((a) => a.id === "first_setup");
    const after  = computeAchievements(fullState({ categories: [{ label: "Groceries" }] })).find((a) => a.id === "first_setup");
    expect(before.unlocked).toBe(false);
    expect(after.unlocked).toBe(true);
  });

  it("first_property unlocks once a property exists", () => {
    const out = computeAchievements(fullState({
      properties: [{ status: "operating", rooms: [], expenses: [], market_value_cents: 0, mortgage_balance_cents: 0 }],
    }));
    expect(out.find((a) => a.id === "first_property").unlocked).toBe(true);
  });

  it("first_envelope unlocks once any monthly_actuals row exists", () => {
    const out = computeAchievements(fullState({
      monthly_actuals: [{ id: "1", category_label: "Gas", month: "2026-05-01", amount_cents: 5000 }],
    }));
    expect(out.find((a) => a.id === "first_envelope").unlocked).toBe(true);
  });

  it("first_mom_pay unlocks once a mom-loan payment is logged", () => {
    const out = computeAchievements(fullState({
      mom_loans: [{ payments: [{ paid_on: "2026-05-10", amount_cents: 1000_00 }] }],
    }));
    expect(out.find((a) => a.id === "first_mom_pay").unlocked).toBe(true);
  });

  it("progress.pct caps at 100 even when value exceeds target", () => {
    const out = computeAchievements(fullState({
      categories: Array.from({ length: 50 }).map((_, i) => ({ label: `c${i}` })),
    }));
    const first = out.find((a) => a.id === "first_setup");
    expect(first.progress.pct).toBe(100);
  });
});

describe("computeStreaks", () => {
  it("returns trackedStreak + cfStreak on an empty state", () => {
    const out = computeStreaks({});
    expect(out).toEqual({ trackedStreak: 0, cfStreak: 0 });
  });

  it("trackedStreak counts consecutive trailing days in history", () => {
    const today = new Date();
    const iso = (offset) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const state = {
      history: [
        { day: iso(2), net_worth_cents: 0, hero_conservative_cents: 100 },
        { day: iso(1), net_worth_cents: 0, hero_conservative_cents: 200 },
        { day: iso(0), net_worth_cents: 0, hero_conservative_cents: 300 },
      ],
    };
    expect(computeStreaks(state).trackedStreak).toBe(3);
  });

  it("cfStreak counts the trailing run of positive hero_conservative_cents", () => {
    const state = {
      history: [
        { day: "2026-05-01", hero_conservative_cents: -100 },
        { day: "2026-05-02", hero_conservative_cents: 100 },
        { day: "2026-05-03", hero_conservative_cents: 200 },
        { day: "2026-05-04", hero_conservative_cents: 300 },
      ],
    };
    expect(computeStreaks(state).cfStreak).toBe(3);
  });

  it("cfStreak resets on a negative day", () => {
    const state = {
      history: [
        { day: "2026-05-01", hero_conservative_cents: 100 },
        { day: "2026-05-02", hero_conservative_cents: 200 },
        { day: "2026-05-03", hero_conservative_cents: -50 },
      ],
    };
    expect(computeStreaks(state).cfStreak).toBe(0);
  });
});

describe("fireConfetti", () => {
  it("returns silently in a non-DOM environment", () => {
    // Vitest's default environment is node → document is undefined.
    expect(() => fireConfetti()).not.toThrow();
  });
});
