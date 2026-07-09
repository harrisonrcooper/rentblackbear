// Energy load and solar payback. Pure arithmetic, no React, no network.
//
// The brief asks for two calculators: what this house will consume in a year,
// and whether a solar array pays for itself. Both are simple models — and the
// point of a simple model is that every number is traceable to an assumption
// the owner can see and change. There are no hidden constants here: every
// coefficient is a named, documented input with a default.
//
// Money is integer cents throughout. Energy is whole kilowatt-hours. Rates are
// cents per kWh, so a 12.3¢ rate is 12.3 — the one place a fraction is allowed,
// because a rate is a ratio, not an amount of money.

export interface Amenity {
  id: string;
  label: string;
  /** Annual consumption at typical use. */
  kwhPerYear: number;
  enabled: boolean;
}

export interface LoadInputs {
  /** Conditioned square feet of the main house. */
  mainSqft: number;
  /** Conditioned square feet of the carriage apartment. */
  carriageSqft: number;
  /** Conditioned square feet of a finished basement. Zero until it is finished. */
  basementSqft: number;
  /**
   * Annual kWh per conditioned square foot for an all-electric house.
   *
   * 12 is a well-built, air-sealed, heat-pump house in a mixed-humid climate
   * (roughly Huntsville). A code-minimum build runs 16–18; a passive house
   * runs 6–8. This is the single assumption the whole load estimate turns on,
   * so it is an input, not a constant buried in a formula.
   */
  kwhPerSqft: number;
  amenities: Amenity[];
}

export interface LoadResult {
  conditionedSqft: number;
  envelopeKwh: number;
  amenitiesKwh: number;
  totalKwh: number;
  /** What the utility charges for that, in cents. */
  annualCostCents: number;
}

const int = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : 0);
const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** The amenities this build actually contemplates, with defensible annual figures. */
export const DEFAULT_AMENITIES: Amenity[] = [
  { id: "pool", label: "Swimming pool (pump and heater)", kwhPerYear: 4200, enabled: true },
  { id: "chiller", label: "Pool chiller", kwhPerYear: 1500, enabled: false },
  { id: "sauna", label: "Sauna", kwhPerYear: 1000, enabled: true },
  { id: "plunge", label: "Cold plunge", kwhPerYear: 1300, enabled: true },
  { id: "ev", label: "Electric-vehicle charging", kwhPerYear: 3000, enabled: true },
  { id: "shop", label: "Garage and workshop", kwhPerYear: 800, enabled: false },
  { id: "well", label: "Well pump", kwhPerYear: 600, enabled: false },
  { id: "generator", label: "Whole-house generator (exercise cycles)", kwhPerYear: 120, enabled: false },
];

export function estimateLoad(inputs: LoadInputs): LoadResult {
  const conditionedSqft = int(inputs.mainSqft) + int(inputs.carriageSqft) + int(inputs.basementSqft);
  const envelopeKwh = Math.round(conditionedSqft * num(inputs.kwhPerSqft));
  const amenitiesKwh = (inputs.amenities || [])
    .filter((a) => a.enabled)
    .reduce((s, a) => s + int(a.kwhPerYear), 0);

  return { conditionedSqft, envelopeKwh, amenitiesKwh, totalKwh: envelopeKwh + amenitiesKwh, annualCostCents: 0 };
}

/** The same, priced at a utility rate given in cents per kWh. */
export function priceLoad(load: LoadResult, rateCentsPerKwh: number): LoadResult {
  return { ...load, annualCostCents: Math.round(load.totalKwh * num(rateCentsPerKwh)) };
}

// ── Solar ────────────────────────────────────────────────────────────

export interface SolarInputs {
  panelCount: number;
  /** Nameplate watts per panel. A modern bifacial panel is 430–450 W. */
  panelWatts: number;
  /**
   * Annual kWh produced per installed kW, before any bifacial gain.
   *
   * ~1,350 for a fixed south-facing array in northern Alabama. A pergola whose
   * panels are flat rather than tilted gives up roughly 10% of that.
   */
  kwhPerKwYear: number;
  /** Extra yield from light reflected onto a bifacial panel's back face. 0.05–0.15. */
  bifacialGain: number;
  /** Installed cost, in cents per installed watt, before incentives. */
  costCentsPerWatt: number;
  /** The federal residential clean-energy credit, as a fraction. 0.30 today. */
  taxCreditFraction: number;
  /** What the utility charges, cents per kWh. */
  rateCentsPerKwh: number;
  /** Annual utility rate inflation, as a fraction. 0.03 is a common assumption. */
  rateInflation: number;
  /** The house's annual consumption, from estimateLoad. */
  householdKwh: number;
}

export interface SolarResult {
  systemKw: number;
  annualKwh: number;
  /** Fraction of the household's use the array covers. May exceed 1. */
  offsetFraction: number;
  grossCostCents: number;
  taxCreditCents: number;
  netCostCents: number;
  firstYearSavingsCents: number;
  /**
   * Years until cumulative savings repay the net cost, accounting for rate
   * inflation. `null` when it never pays back inside 40 years — which is the
   * honest answer, not a large number pretending to be one.
   */
  paybackYears: number | null;
  /** Net savings over 25 years, after the array has paid for itself. */
  lifetimeSavingsCents: number;
}

const PANEL_DEGRADATION = 0.005; // 0.5%/yr, the industry warranty figure
const HORIZON_YEARS = 25;
const MAX_PAYBACK_YEARS = 40;

export function solarPayback(inputs: SolarInputs): SolarResult {
  const watts = int(inputs.panelCount) * int(inputs.panelWatts);
  const systemKw = watts / 1000;

  const annualKwh = Math.round(systemKw * num(inputs.kwhPerKwYear) * (1 + num(inputs.bifacialGain)));

  const grossCostCents = Math.round(watts * num(inputs.costCentsPerWatt));
  const taxCreditCents = Math.round(grossCostCents * num(inputs.taxCreditFraction));
  const netCostCents = grossCostCents - taxCreditCents;

  const household = int(inputs.householdKwh);
  const offsetFraction = household > 0 ? annualKwh / household : 0;

  // You only save on the power you would otherwise have bought. Exporting the
  // surplus may earn something, but at what rate depends on a utility tariff
  // this model does not know — so it is worth zero here rather than a guess.
  const offsetKwh = household > 0 ? Math.min(annualKwh, household) : annualKwh;
  const firstYearSavingsCents = Math.round(offsetKwh * num(inputs.rateCentsPerKwh));

  let cumulative = 0;
  let paybackYears: number | null = null;
  let lifetimeSavingsCents = 0;

  for (let year = 1; year <= MAX_PAYBACK_YEARS; year++) {
    const production = annualKwh * (1 - PANEL_DEGRADATION) ** (year - 1);
    const offset = household > 0 ? Math.min(production, household) : production;
    const rate = num(inputs.rateCentsPerKwh) * (1 + num(inputs.rateInflation)) ** (year - 1);
    const saved = offset * rate;

    const before = cumulative;
    cumulative += saved;

    if (paybackYears === null && cumulative >= netCostCents && saved > 0) {
      // Interpolate inside the year rather than rounding up to the next whole
      // one: "6.4 years" is a truer answer than "7".
      const shortfall = netCostCents - before;
      paybackYears = Math.round((year - 1 + shortfall / saved) * 10) / 10;
    }
    if (year === HORIZON_YEARS) lifetimeSavingsCents = Math.round(cumulative - netCostCents);
  }

  return {
    systemKw: Math.round(systemKw * 100) / 100,
    annualKwh,
    offsetFraction: Math.round(offsetFraction * 1000) / 1000,
    grossCostCents,
    taxCreditCents,
    netCostCents,
    firstYearSavingsCents,
    paybackYears,
    lifetimeSavingsCents,
  };
}

/**
 * The owner's actual scenario, from the brief: an all-electric ~3,000 sq ft main
 * house plus a 1,500 sq ft carriage apartment, Huntsville at about 12¢/kWh, and
 * a four-car CHIKO solar pergola carrying up to 48 bifacial panels (~21 kW).
 */
export const DEFAULT_LOAD: LoadInputs = {
  mainSqft: 3000,
  carriageSqft: 1500,
  basementSqft: 0,
  kwhPerSqft: 12,
  amenities: DEFAULT_AMENITIES,
};

export const DEFAULT_SOLAR: Omit<SolarInputs, "householdKwh"> = {
  panelCount: 48,
  panelWatts: 440,
  kwhPerKwYear: 1350,
  bifacialGain: 0.08,
  costCentsPerWatt: 280,
  taxCreditFraction: 0.3,
  rateCentsPerKwh: 12,
  rateInflation: 0.03,
};
