import { describe, it, expect } from "vitest";
import {
  GOAL_TEMPLATES,
  templateToGoal,
  computeGoalProgress,
  formatEta,
  nextUnhitMilestone,
} from "../goals";

const baseState = {
  settings: { default_vacancy_bps: 1000, default_capex_bps: 500 },
  properties: [],
  assets: [],
  debts: [],
  income_sources: [],
  categories: [{ label: "Rent", default_monthly_cents: 200_000 }],
  business_expenses: [],
};

describe("GOAL_TEMPLATES", () => {
  it("ships at least the canonical templates", () => {
    const labels = GOAL_TEMPLATES.map((t) => t.label);
    expect(labels).toContain("Hit $1M net worth");
    expect(labels).toContain("Pay off HELOC");
    expect(labels).toContain("Emergency fund (6 months expenses)");
  });

  it("every template carries kind + target_cents (or target_count) + label", () => {
    for (const t of GOAL_TEMPLATES) {
      expect(t.label).toBeTruthy();
      expect(t.kind).toBeTruthy();
      const hasTarget = (t.target_cents != null) || (t.target_count != null);
      expect(hasTarget).toBe(true);
    }
  });
});

describe("templateToGoal", () => {
  it("clones milestones into a new array (no shared refs)", () => {
    const tpl = GOAL_TEMPLATES.find((t) => t.label === "Hit $1M net worth");
    const g1 = templateToGoal(tpl, baseState);
    const g2 = templateToGoal(tpl, baseState);
    expect(g1.milestones).not.toBe(g2.milestones);
    g1.milestones[0].label = "tampered";
    expect(g2.milestones[0].label).not.toBe("tampered");
  });

  it("static templates pass target_cents through unchanged", () => {
    const tpl = GOAL_TEMPLATES.find((t) => t.label === "Hit $1M net worth");
    const g = templateToGoal(tpl, baseState);
    expect(g.target_cents).toBe(100_000_000);
  });

  it("dynamic emergency-fund template resolves to 6 × monthly expenses", () => {
    const tpl = GOAL_TEMPLATES.find((t) => t.label === "Emergency fund (6 months expenses)");
    const g = templateToGoal(tpl, baseState);
    // categories = $2000/mo total → 6× = $12k
    expect(g.target_cents).toBe(6 * 200_000);
  });

  it("dynamic HELOC payoff uses original_amount_cents when present", () => {
    const tpl = GOAL_TEMPLATES.find((t) => t.label === "Pay off HELOC");
    const state = {
      ...baseState,
      debts: [{ kind: "heloc", balance_cents: 30_000_00, original_amount_cents: 50_000_00 }],
    };
    const g = templateToGoal(tpl, state);
    expect(g.target_cents).toBe(50_000_00);
  });

  it("dynamic HELOC payoff falls back to balance when no original_amount", () => {
    const tpl = GOAL_TEMPLATES.find((t) => t.label === "Pay off HELOC");
    const state = {
      ...baseState,
      debts: [{ kind: "heloc", balance_cents: 30_000_00 }],
    };
    const g = templateToGoal(tpl, state).target_cents;
    expect(g).toBe(30_000_00);
  });

  it("stamps an id + created_at timestamp", () => {
    const tpl = GOAL_TEMPLATES[0];
    const g = templateToGoal(tpl, baseState);
    expect(typeof g.id).toBe("string");
    expect(g.id.length).toBeGreaterThan(4);
    expect(new Date(g.created_at).toString()).not.toBe("Invalid Date");
  });
});

describe("computeGoalProgress", () => {
  it("net_worth uses computeNetWorthCents, never negative", () => {
    const state = {
      ...baseState,
      assets: [{ kind: "cash", balance_cents: 25_000_00 }],
      debts:  [{ balance_cents: 5_000_00 }],
    };
    const out = computeGoalProgress({ kind: "net_worth", target_cents: 50_000_00 }, state);
    expect(out.value).toBe(20_000_00);
    expect(out.unit).toBe("money");
    expect(out.pct).toBeCloseTo(40, 1);
  });

  it("net_worth value clamped at 0 (no negative progress)", () => {
    const state = { ...baseState, debts: [{ balance_cents: 100_000_00 }] };
    const out = computeGoalProgress({ kind: "net_worth", target_cents: 50_000_00 }, state);
    expect(out.value).toBe(0);
  });

  it("property_count counts the properties array regardless of status", () => {
    const state = {
      ...baseState,
      properties: [
        { status: "operating", rooms: [], expenses: [] },
        { status: "sold",      rooms: [], expenses: [] },
        { status: "pipeline",  rooms: [], expenses: [] },
      ],
    };
    const out = computeGoalProgress({ kind: "property_count", target_count: 5 }, state);
    expect(out.value).toBe(3);
    expect(out.unit).toBe("count");
    expect(out.pct).toBeCloseTo(60, 1);
  });

  it("rental_income sums propertyMonthlyGross across operating properties only", () => {
    const state = {
      ...baseState,
      properties: [
        { status: "operating", rooms: [{ rent_cents: 1500_00, occupied: true }], expenses: [] },
        { status: "sold",      rooms: [{ rent_cents: 9999_00, occupied: true }], expenses: [] },
      ],
    };
    const out = computeGoalProgress({ kind: "rental_income", target_cents: 5_000_00 }, state);
    expect(out.value).toBe(1500_00);
  });

  it("debt_payoff sums Δ paid across debts with original_amount_cents", () => {
    const state = {
      ...baseState,
      debts: [
        { balance_cents: 30_000_00, original_amount_cents: 50_000_00 }, // 20k paid
        { balance_cents:  8_000_00, original_amount_cents: 10_000_00 }, //  2k paid
      ],
    };
    const out = computeGoalProgress({ kind: "debt_payoff", target_cents: 50_000_00 }, state);
    expect(out.value).toBe(22_000_00);
  });

  it("custom / savings use current_value_cents directly", () => {
    const out = computeGoalProgress(
      { kind: "custom", target_cents: 500_00, current_value_cents: 200_00 },
      baseState,
    );
    expect(out.value).toBe(200_00);
    expect(out.pct).toBeCloseTo(40, 1);
  });

  it("etaMonths is null when monthlyRate is 0 or target already met", () => {
    expect(
      computeGoalProgress({ kind: "custom", target_cents: 1000_00, current_value_cents: 0 }, baseState).etaMonths,
    ).toBeNull();
    expect(
      computeGoalProgress(
        { kind: "custom", target_cents: 1000_00, current_value_cents: 1000_00 },
        baseState,
        100_00,
      ).etaMonths,
    ).toBeNull();
  });

  it("etaMonths = ceil(remaining / monthlyRate) for money goals with positive rate", () => {
    const out = computeGoalProgress(
      { kind: "custom", target_cents: 1000_00, current_value_cents: 0 },
      baseState,
      100_00,
    );
    expect(out.etaMonths).toBe(10);
  });

  it("pct caps at 100 even when value exceeds target", () => {
    const out = computeGoalProgress(
      { kind: "custom", target_cents: 1000_00, current_value_cents: 50_000_00 },
      baseState,
    );
    expect(out.pct).toBe(100);
  });
});

describe("formatEta", () => {
  it("renders months when under 12", () => {
    const s = formatEta(7);
    expect(s).toMatch(/7 mo/);
  });
  it("renders 1y Nmo between 12 and 23", () => {
    const s = formatEta(15);
    expect(s).toMatch(/1y 3mo/);
  });
  it("renders exact year when months % 12 === 0 in the 1-2 year band", () => {
    const s = formatEta(12);
    expect(s).toMatch(/^1 yr/);
  });
  it("renders decimal years for ≥24 months", () => {
    const s = formatEta(30);
    expect(s).toMatch(/yrs/);
  });
  it("returns null on null input", () => {
    expect(formatEta(null)).toBeNull();
  });
});

describe("nextUnhitMilestone", () => {
  const milestones = [
    { id: "a", target_cents: 10_000_00 },
    { id: "c", target_cents: 30_000_00 },
    { id: "b", target_cents: 20_000_00 },
  ];

  it("returns null when no milestones", () => {
    expect(nextUnhitMilestone({ milestones: [] }, 100)).toBeNull();
    expect(nextUnhitMilestone({}, 100)).toBeNull();
  });

  it("returns the smallest unhit milestone", () => {
    const m = nextUnhitMilestone({ milestones }, 15_000_00);
    expect(m.id).toBe("b"); // 20k is the next milestone above 15k
  });

  it("returns null when all milestones are hit", () => {
    const m = nextUnhitMilestone({ milestones }, 99_999_00);
    expect(m).toBeNull();
  });

  it("handles count-based milestones", () => {
    const m = nextUnhitMilestone(
      { milestones: [{ id: "p2", target_count: 2 }, { id: "p5", target_count: 5 }] },
      3,
    );
    expect(m.id).toBe("p5");
  });
});
