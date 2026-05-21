// Onboarding checklist math. Inferred entirely from the live state
// blob — no extra "setup_complete" flags to maintain. Each step is a
// `done()` predicate that reads state.* and returns a boolean. The
// component layer turns the list into a banner above the hero.
//
// New steps live here, not in the UI component, so the order /
// content is editable from one place.

import { propertyMonthlyGross } from "./calc";

// Basic-mode onboarding — friendlier copy, no rentals / no assets-and-
// debts step. Three required steps total. The basic household sees this
// list; full households see the original STEPS below.
const BASIC_STEPS = [
  {
    id: "income",
    label: "Add your paychecks",
    hint: "Both incomes — your job and your partner's job.",
    section: "settings",
    done: (state) => (state.income_sources || []).some((i) => (i.net_amount_cents || 0) > 0),
  },
  {
    id: "categories",
    label: "Fill in 3 spending categories",
    hint: "Groceries, gas, eating out — what you spend money on every month.",
    section: "envelopes",
    done: (state) => {
      const cats = state.categories || [];
      const funded = cats.filter((c) => (
        (c.default_monthly_cents || 0) > 0 ||
        (c.default_biweekly_cents || 0) > 0 ||
        (c.default_yearly_cents || 0) > 0
      ));
      return funded.length >= 3;
    },
  },
  {
    id: "goal",
    label: "Pick one goal to chase",
    hint: "Emergency fund, vacation, paying off a card. One thing to win.",
    section: "goals",
    done: (state) => (state.goals || []).filter((g) => !g.archived).length > 0,
  },
];

const STEPS = [
  {
    id: "income",
    label: "Add your income sources",
    hint: "Paychecks, rental gross, self-employment — every dollar coming in.",
    section: "settings",
    done: (state) => (state.income_sources || []).some((i) => (i.net_amount_cents || 0) > 0),
  },
  {
    id: "categories",
    label: "Set your monthly envelopes",
    hint: "Groceries, gas, kids — one envelope per recurring spend bucket.",
    section: "envelopes",
    done: (state) => {
      const cats = state.categories || [];
      // ≥ 3 funded envelopes is "set up" — one is just kicking tires.
      const funded = cats.filter((c) => {
        return (c.default_monthly_cents || 0) > 0
          || (c.default_biweekly_cents || 0) > 0
          || (c.default_yearly_cents || 0) > 0;
      });
      return funded.length >= 3;
    },
  },
  {
    id: "properties",
    label: "Add your rental properties",
    hint: "Address, rooms, mortgage. Drives the rental NOI + Schedule E.",
    section: "dashboard", // properties live in the rentals drill on dashboard
    done: (state) => {
      const props = state.properties || [];
      return props.some((p) => p.status === "operating" && propertyMonthlyGross(p) > 0);
    },
    optional: true,
  },
  {
    id: "networth",
    label: "Snapshot your assets + debts",
    hint: "Cash, retirement, mortgages, consumer debt — completes net worth.",
    section: "dashboard",
    done: (state) => {
      const assets = (state.assets || []).filter((a) => (a.balance_cents || 0) > 0);
      const debts = (state.debts || []);
      return assets.length > 0 || debts.length > 0;
    },
  },
  {
    id: "goal",
    label: "Set your first goal",
    hint: "Emergency fund, debt payoff, next property — make the math chase a target.",
    section: "goals",
    done: (state) => (state.goals || []).filter((g) => !g.archived).length > 0,
  },
];

export function computeOnboarding(state) {
  const isBasic = state?.settings?.experience === "basic";
  const source = isBasic ? BASIC_STEPS : STEPS;
  const steps = source.map((s) => ({
    ...s,
    completed: Boolean(s.done(state)),
  }));
  const required = steps.filter((s) => !s.optional);
  const completedRequired = required.filter((s) => s.completed).length;
  const totalRequired = required.length;
  const completedAll = steps.filter((s) => s.completed).length;
  const allRequiredDone = completedRequired === totalRequired;
  return {
    steps,
    completedRequired,
    totalRequired,
    completedAll,
    totalAll: steps.length,
    allRequiredDone,
    percent: totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100,
  };
}
