// Goal math + templates + milestone helpers. Pure functions. Money
// in cents, counts as integers.

import { computeNetWorthCents, propertyMonthlyGross } from "./calc";

// Pre-baked goal templates surfaced in the "Add from template" picker.
// Each one fills in sensible defaults; the user can edit anything
// post-add. `target_cents: null` flags a dynamic field the picker
// resolves at add-time (e.g. emergency fund = 6× monthly expenses).
// Sum of the user's recurring monthly expenses, normalizing biweekly /
// yearly cadences to a monthly figure. Used by the dynamic savings goals.
function monthlyExpenses(state) {
  return (state.categories || []).reduce(
    (s, c) => s + (c.default_monthly_cents
      || (c.default_biweekly_cents ? Math.round(c.default_biweekly_cents * 26 / 12)
      : Math.round((c.default_yearly_cents || 0) / 12))),
    0,
  );
}

export const GOAL_TEMPLATES = [
  // ── Net worth ───────────────────────────────────────────────────────
  { label: "Hit $100k net worth", kind: "net_worth", target_cents: 10_000_000,
    milestones: [ { id: "nw-25", label: "$25k", target_cents: 2_500_000 }, { id: "nw-50", label: "$50k", target_cents: 5_000_000 } ] },
  { label: "Hit $250k net worth", kind: "net_worth", target_cents: 25_000_000,
    milestones: [ { id: "nw-50", label: "$50k", target_cents: 5_000_000 }, { id: "nw-100", label: "$100k", target_cents: 10_000_000 } ] },
  { label: "Hit $500k net worth", kind: "net_worth", target_cents: 50_000_000,
    milestones: [ { id: "nw-100", label: "$100k", target_cents: 10_000_000 }, { id: "nw-250", label: "$250k", target_cents: 25_000_000 } ] },
  { label: "Hit $1M net worth", kind: "net_worth", target_cents: 100_000_000,
    milestones: [ { id: "nw-250", label: "$250k", target_cents: 25_000_000 }, { id: "nw-500", label: "$500k", target_cents: 50_000_000 }, { id: "nw-750", label: "$750k", target_cents: 75_000_000 } ] },
  { label: "Hit $2M net worth", kind: "net_worth", target_cents: 200_000_000,
    milestones: [ { id: "nw-500", label: "$500k", target_cents: 50_000_000 }, { id: "nw-1m", label: "$1M", target_cents: 100_000_000 }, { id: "nw-15m", label: "$1.5M", target_cents: 150_000_000 } ] },
  { label: "Hit $5M net worth", kind: "net_worth", target_cents: 500_000_000,
    milestones: [ { id: "nw-1m", label: "$1M", target_cents: 100_000_000 }, { id: "nw-25m", label: "$2.5M", target_cents: 250_000_000 } ] },
  { label: "Hit $10M net worth", kind: "net_worth", target_cents: 1_000_000_000,
    milestones: [ { id: "nw-25m", label: "$2.5M", target_cents: 250_000_000 }, { id: "nw-5m", label: "$5M", target_cents: 500_000_000 } ] },

  // ── Properties ──────────────────────────────────────────────────────
  { label: "Own 3 properties", kind: "property_count", target_count: 3, target_cents: 0,
    milestones: [ { id: "p-1", label: "1 property", target_count: 1 }, { id: "p-2", label: "2 properties", target_count: 2 } ] },
  { label: "Own 5 properties", kind: "property_count", target_count: 5, target_cents: 0,
    milestones: [ { id: "p-2", label: "2 properties", target_count: 2 }, { id: "p-3", label: "3 properties", target_count: 3 } ] },
  { label: "Own 10 properties", kind: "property_count", target_count: 10, target_cents: 0,
    milestones: [ { id: "p-5", label: "5 properties", target_count: 5 }, { id: "p-7", label: "7 properties", target_count: 7 } ] },
  { label: "Own 20 properties", kind: "property_count", target_count: 20, target_cents: 0,
    milestones: [ { id: "p-10", label: "10 properties", target_count: 10 }, { id: "p-15", label: "15 properties", target_count: 15 } ] },
  { label: "Own 50 properties", kind: "property_count", target_count: 50, target_cents: 0,
    milestones: [ { id: "p-25", label: "25 properties", target_count: 25 }, { id: "p-40", label: "40 properties", target_count: 40 } ] },

  // ── Rental income ───────────────────────────────────────────────────
  { label: "Rental income $2k / month", kind: "rental_income", target_cents: 200_000 },
  { label: "Rental income $5k / month", kind: "rental_income", target_cents: 500_000,
    milestones: [ { id: "r-1", label: "$1k/mo", target_cents: 100_000 }, { id: "r-25", label: "$2.5k/mo", target_cents: 250_000 } ] },
  { label: "Rental income $10k / month", kind: "rental_income", target_cents: 1_000_000,
    milestones: [ { id: "r-2", label: "$2k/mo", target_cents: 200_000 }, { id: "r-5", label: "$5k/mo", target_cents: 500_000 }, { id: "r-7", label: "$7.5k/mo", target_cents: 750_000 } ] },
  { label: "Rental income $25k / month", kind: "rental_income", target_cents: 2_500_000,
    milestones: [ { id: "r-10", label: "$10k/mo", target_cents: 1_000_000 }, { id: "r-15", label: "$15k/mo", target_cents: 1_500_000 } ] },

  // ── Debt payoff ─────────────────────────────────────────────────────
  { label: "Pay off HELOC", kind: "debt_payoff", target_cents: 0,
    dynamic: (state) => {
      const heloc = (state.debts || []).find((d) => (d.kind || "") === "heloc");
      return { target_cents: heloc?.original_amount_cents || heloc?.balance_cents || 0 };
    } },
  { label: "Pay off all debt", kind: "debt_payoff", target_cents: 0,
    dynamic: (state) => ({ target_cents: (state.debts || []).reduce((s, d) => s + (d.original_amount_cents || d.balance_cents || 0), 0) }) },
  { label: "Pay off the mortgage", kind: "debt_payoff", target_cents: 30_000_000 },
  { label: "Pay off car loan", kind: "debt_payoff", target_cents: 3_500_000 },
  { label: "Kill credit card debt", kind: "debt_payoff", target_cents: 1_000_000 },
  { label: "Pay off student loans", kind: "debt_payoff", target_cents: 5_000_000 },

  // ── Savings ─────────────────────────────────────────────────────────
  { label: "Emergency fund (3 months)", kind: "savings", target_cents: 0,
    dynamic: (state) => ({ target_cents: monthlyExpenses(state) * 3 }) },
  { label: "Emergency fund (6 months)", kind: "savings", target_cents: 0,
    dynamic: (state) => ({ target_cents: monthlyExpenses(state) * 6 }) },
  { label: "$10k cash cushion", kind: "savings", target_cents: 1_000_000 },
  { label: "$25k cash reserve", kind: "savings", target_cents: 2_500_000 },
  { label: "$50k cash reserve", kind: "savings", target_cents: 5_000_000 },
  { label: "Down payment fund ($60k)", kind: "savings", target_cents: 6_000_000 },

  // ── Custom / life ───────────────────────────────────────────────────
  { label: "Vacation fund ($5k)", kind: "custom", target_cents: 500_000 },
  { label: "New car ($40k)", kind: "custom", target_cents: 4_000_000 },
  { label: "Dream wedding ($30k)", kind: "custom", target_cents: 3_000_000 },
  { label: "Home renovation ($25k)", kind: "custom", target_cents: 2_500_000 },
  { label: "Dream home down payment ($100k)", kind: "custom", target_cents: 10_000_000 },
  { label: "College fund ($100k)", kind: "custom", target_cents: 10_000_000 },
  { label: "Retirement nest egg ($1M)", kind: "custom", target_cents: 100_000_000 },
];

// Resolve a template into a concrete goal payload (with id + timestamp).
export function templateToGoal(template, state) {
  const dyn = template.dynamic ? template.dynamic(state) : {};
  const base = {
    id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    label: template.label,
    kind: template.kind,
    target_cents: template.target_cents || 0,
    target_count: template.target_count,
    milestones: (template.milestones || []).map((m) => ({ ...m })),
    created_at: new Date().toISOString(),
  };
  return { ...base, ...dyn };
}

// Live progress + ETA for a goal. monthlyRate (cents/mo) is used to
// compute "months until I cross the target." Property-count goals get
// no ETA unless the caller supplies one.
export function computeGoalProgress(goal, state, monthlyRate = 0) {
  let value;
  let target;
  let unit;

  switch (goal.kind) {
    case "net_worth":
      value = Math.max(0, computeNetWorthCents(state));
      target = goal.target_cents;
      unit = "money";
      break;
    case "property_count":
      value = (state.properties || []).length;
      target = goal.target_count || 0;
      unit = "count";
      break;
    case "rental_income": {
      const ops = (state.properties || []).filter((p) => p.status === "operating");
      value = ops.reduce((s, p) => s + propertyMonthlyGross(p), 0);
      target = goal.target_cents;
      unit = "money";
      break;
    }
    case "debt_payoff": {
      // Sum of how much principal has been knocked off, across debts
      // that have an `original_amount_cents` set. Without originals we
      // can't measure progress, so fall back to current_value_cents.
      const paidDown = (state.debts || []).reduce(
        (s, d) => s + Math.max(0, (d.original_amount_cents || d.balance_cents) - d.balance_cents),
        0,
      );
      value = paidDown || goal.current_value_cents || 0;
      target = goal.target_cents;
      unit = "money";
      break;
    }
    case "savings":
    case "custom":
    default:
      value = goal.current_value_cents || 0;
      target = goal.target_cents;
      unit = "money";
      break;
  }

  const pct = target > 0 ? Math.min(1, value / target) : 0;
  const remaining = Math.max(0, target - value);
  const etaMonths = monthlyRate > 0 && remaining > 0 && unit === "money"
    ? Math.ceil(remaining / monthlyRate)
    : null;

  return { value, target, pct: pct * 100, remaining, etaMonths, unit };
}

// Friendly ETA string. Picks months / years gracefully and notes the
// projected target date.
export function formatEta(etaMonths) {
  if (etaMonths == null) return null;
  const d = new Date();
  d.setMonth(d.getMonth() + etaMonths);
  const month = d.toLocaleString("en-US", { month: "short", year: "numeric" });
  if (etaMonths >= 24) return `${(etaMonths / 12).toFixed(1)} yrs · by ${month}`;
  if (etaMonths >= 12) {
    const yrs = Math.floor(etaMonths / 12);
    const mos = etaMonths % 12;
    return mos === 0 ? `${yrs} yr · by ${month}` : `${yrs}y ${mos}mo · by ${month}`;
  }
  return `${etaMonths} mo · by ${month}`;
}

// Returns the next unhit milestone or null when they're all reached.
export function nextUnhitMilestone(goal, currentValue) {
  if (!goal.milestones || goal.milestones.length === 0) return null;
  const sorted = goal.milestones.slice().sort((a, b) => {
    const at = a.target_cents ?? a.target_count ?? 0;
    const bt = b.target_cents ?? b.target_count ?? 0;
    return at - bt;
  });
  for (const m of sorted) {
    const mt = m.target_cents ?? m.target_count ?? 0;
    if (currentValue < mt) return m;
  }
  return null;
}
