// Per-property real estate analytics. All inputs/outputs in cents
// (money) and basis points (rates). Pure functions.

import { propertyMonthlyGross, propertyMonthlyExpenses, propertyHelocPayment, propertyRentalShare } from "./calc";

// IRS Schedule E depreciation: 27.5-year straight-line on the BUILDING
// basis (land doesn't depreciate). We don't track a land allocation,
// so use a sensible 80%-of-purchase-price building default that PMs
// commonly use (real numbers vary; user can edit in a later session).
const BUILDING_RATIO = 0.8;
const DEPRECIATION_YEARS = 27.5;

export function computePropertyAnalytics(property, settings) {
  const monthlyGross = propertyMonthlyGross(property);
  const monthlyExpenses = propertyMonthlyExpenses(property, settings);
  const monthlyNoi = monthlyGross - monthlyExpenses;
  const annualGross = monthlyGross * 12;
  const annualExpenses = monthlyExpenses * 12;
  const annualNoi = monthlyNoi * 12;

  // Cap rate: annualized NOI / property market value. Cap rate is
  // unlevered by convention — it excludes ALL debt service. Our
  // `monthlyExpenses` includes both the mortgage payment and the
  // per-property HELOC payment, so subtract both back out here.
  // House hack: rental NOI and rental value are both measured at the
  // rental share, so the cap rate reflects the rental unit, not the
  // owner-occupied half.
  const rentalShare = propertyRentalShare(property);
  const mortgagePayment = (property.mortgage_payment_cents || 0) * rentalShare;
  const helocPayment = propertyHelocPayment(property);
  const unleveredAnnualExpenses = annualExpenses - (mortgagePayment + helocPayment) * 12;
  const unleveredAnnualNoi = annualGross - unleveredAnnualExpenses;
  const rentalValue = property.market_value_cents * rentalShare;
  const capRateBps = rentalValue > 0
    ? Math.round((unleveredAnnualNoi / rentalValue) * 10000)
    : 0;

  // Cash-on-cash return: levered annual cash flow / cash invested.
  // Cash invested defaults to current equity when no purchase data;
  // explicit `cash_invested_cents` overrides.
  const cashInvested = property.cash_invested_cents
    ?? Math.max(0, property.market_value_cents - property.mortgage_balance_cents);
  const cocBps = cashInvested > 0
    ? Math.round((annualNoi / cashInvested) * 10000)
    : 0;

  // Occupancy across rentable rooms.
  const totalRooms = (property.rooms || []).length;
  const occupiedRooms = (property.rooms || []).filter((r) => r.occupied).length;
  const occupancyBps = totalRooms > 0
    ? Math.round((occupiedRooms / totalRooms) * 10000)
    : 0;

  // Annual depreciation (Schedule E "Asset" entry).
  const basis = property.purchase_price_cents ?? property.market_value_cents;
  const depreciableBasis = Math.round(basis * BUILDING_RATIO);
  const annualDepreciation = depreciableBasis > 0
    ? Math.round(depreciableBasis / DEPRECIATION_YEARS)
    : 0;

  // Taxable income = NOI − depreciation (rough; ignores mortgage
  // interest split for now — that's a v2 enhancement).
  const taxableAnnualIncome = unleveredAnnualNoi - annualDepreciation;

  // Maintenance log totals (last 12 months and all-time).
  const today = new Date();
  const oneYearAgoIso = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    .toISOString().slice(0, 10);
  const log = property.maintenance_log || [];
  const maintenanceL12mCents = log
    .filter((e) => e.date && e.date >= oneYearAgoIso)
    .reduce((s, e) => s + (e.amount_cents || 0), 0);
  const maintenanceAllTimeCents = log.reduce((s, e) => s + (e.amount_cents || 0), 0);

  return {
    monthlyGross,
    monthlyExpenses,
    monthlyNoi,
    annualGross,
    annualExpenses,
    annualNoi,
    unleveredAnnualNoi,
    capRateBps,
    cocBps,
    cashInvested,
    totalRooms,
    occupiedRooms,
    occupancyBps,
    annualDepreciation,
    depreciableBasis,
    taxableAnnualIncome,
    maintenanceL12mCents,
    maintenanceAllTimeCents,
    mortgageBalance: property.mortgage_balance_cents || 0,
    marketValue: property.market_value_cents || 0,
    equity: (property.market_value_cents || 0) - (property.mortgage_balance_cents || 0),
  };
}

// Project property value + equity over N years at a given annual
// appreciation rate. Mortgage paydown is approximated linearly using
// term_years; if unknown, balance is assumed flat (conservative).
//
// Returns a list of yearly snapshots usable in a recharts LineChart.
export function projectPropertyROI(property, opts = {}) {
  const years = opts.horizonYears ?? 10;
  const appreciationBps = opts.appreciationBps ?? 300;
  const mr = appreciationBps / 10000;
  const startValue = property.market_value_cents || 0;
  const startBal = property.mortgage_balance_cents || 0;
  const termYears = property.mortgage_term_years || 0;
  const yearlyPaydown = termYears > 0
    ? Math.round(startBal / Math.max(termYears, 1))
    : 0;
  const out = [];
  let value = startValue;
  let bal = startBal;
  for (let y = 0; y <= years; y++) {
    out.push({
      year: y,
      value_cents: Math.round(value),
      mortgage_cents: Math.round(Math.max(0, bal)),
      equity_cents: Math.round(value - Math.max(0, bal)),
    });
    value = value * (1 + mr);
    bal = Math.max(0, bal - yearlyPaydown);
  }
  return out;
}

// Schedule E-ready row for tax export later. One per property per year.
export function scheduleERow(property, settings, year) {
  const a = computePropertyAnalytics(property, settings);
  return {
    label: property.label,
    address: property.address,
    year,
    annual_gross_rents_cents: a.annualGross,
    annual_expenses_cents: a.annualExpenses,
    mortgage_interest_cents: 0, // v2: split interest from principal
    depreciation_cents: a.annualDepreciation,
    taxable_income_cents: a.taxableAnnualIncome,
  };
}
