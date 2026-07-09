import { describe, it, expect } from "vitest";

import {
  DEFAULT_AMENITIES, DEFAULT_LOAD, DEFAULT_SOLAR,
  estimateLoad, priceLoad, solarPayback,
} from "../energy";
import type { Amenity, SolarInputs } from "../energy";

const amenity = (id: string, kwh: number, enabled = true): Amenity => ({
  id, label: id, kwhPerYear: kwh, enabled,
});

describe("estimateLoad", () => {
  it("sums the three conditioned areas", () => {
    const r = estimateLoad({ mainSqft: 3000, carriageSqft: 1500, basementSqft: 1200, kwhPerSqft: 12, amenities: [] });
    expect(r.conditionedSqft).toBe(5700);
  });

  it("multiplies area by the per-square-foot assumption", () => {
    const r = estimateLoad({ mainSqft: 1000, carriageSqft: 0, basementSqft: 0, kwhPerSqft: 12, amenities: [] });
    expect(r.envelopeKwh).toBe(12_000);
  });

  it("counts only enabled amenities", () => {
    const r = estimateLoad({
      mainSqft: 0, carriageSqft: 0, basementSqft: 0, kwhPerSqft: 0,
      amenities: [amenity("a", 1000), amenity("b", 500, false), amenity("c", 250)],
    });
    expect(r.amenitiesKwh).toBe(1250);
  });

  it("is zero for an empty house", () => {
    const r = estimateLoad({ mainSqft: 0, carriageSqft: 0, basementSqft: 0, kwhPerSqft: 12, amenities: [] });
    expect(r.totalKwh).toBe(0);
  });

  it("survives garbage stored in the blob", () => {
    const r = estimateLoad({
      mainSqft: NaN as never, carriageSqft: 1500, basementSqft: undefined as never,
      kwhPerSqft: 12, amenities: [{ id: "x", label: "x", kwhPerYear: NaN as never, enabled: true }],
    });
    expect(r.conditionedSqft).toBe(1500);
    expect(r.amenitiesKwh).toBe(0);
  });

  it("prices the load at a rate in cents per kWh", () => {
    const priced = priceLoad(estimateLoad({ mainSqft: 1000, carriageSqft: 0, basementSqft: 0, kwhPerSqft: 10, amenities: [] }), 12);
    expect(priced.totalKwh).toBe(10_000);
    expect(priced.annualCostCents).toBe(120_000); // $1,200.00
  });

  // The owner's real house, from the brief.
  it("estimates the actual build at a defensible figure", () => {
    const priced = priceLoad(estimateLoad(DEFAULT_LOAD), 12);
    // 4,500 sq ft × 12 = 54,000 kWh envelope, plus pool/sauna/plunge/EV.
    expect(priced.envelopeKwh).toBe(54_000);
    expect(priced.amenitiesKwh).toBe(4200 + 1000 + 1300 + 3000);
    expect(priced.totalKwh).toBe(63_500);
    expect(priced.annualCostCents).toBe(762_000); // $7,620/yr, all-electric
  });

  it("ships defaults that match the amenities the brief names", () => {
    const ids = DEFAULT_AMENITIES.map((a) => a.id);
    for (const id of ["pool", "sauna", "plunge", "ev"]) expect(ids).toContain(id);
  });
});

describe("solarPayback", () => {
  const base = (over: Partial<SolarInputs> = {}): SolarInputs => ({
    ...DEFAULT_SOLAR, householdKwh: 63_500, ...over,
  });

  it("sizes the array from panel count and wattage", () => {
    expect(solarPayback(base()).systemKw).toBe(21.12); // 48 × 440 W
  });

  it("applies the bifacial gain to production", () => {
    const flat = solarPayback(base({ bifacialGain: 0 })).annualKwh;
    const bi = solarPayback(base({ bifacialGain: 0.08 })).annualKwh;
    expect(bi).toBeGreaterThan(flat);
    expect(bi).toBe(Math.round(flat * 1.08));
  });

  it("subtracts the federal tax credit from the gross cost", () => {
    const r = solarPayback(base());
    expect(r.grossCostCents).toBe(48 * 440 * 280);
    expect(r.taxCreditCents).toBe(Math.round(r.grossCostCents * 0.3));
    expect(r.netCostCents).toBe(r.grossCostCents - r.taxCreditCents);
  });

  // The honest bit: you only save on power you would have bought. An array
  // that produces double what the house uses does not save double.
  it("caps first-year savings at what the household actually consumes", () => {
    const small = solarPayback(base({ householdKwh: 1000 }));
    expect(small.firstYearSavingsCents).toBe(1000 * 12);
    expect(small.offsetFraction).toBeGreaterThan(1);
  });

  it("reports an offset fraction below 1 when the array under-produces", () => {
    const r = solarPayback(base({ panelCount: 10 }));
    expect(r.offsetFraction).toBeLessThan(1);
  });

  it("pays back inside the horizon for the owner's scenario", () => {
    const r = solarPayback(base());
    expect(r.paybackYears).not.toBeNull();
    expect(r.paybackYears!).toBeGreaterThan(3);
    expect(r.paybackYears!).toBeLessThan(15);
    expect(r.lifetimeSavingsCents).toBeGreaterThan(0);
  });

  it("returns null rather than a fake number when it never pays back", () => {
    const r = solarPayback(base({ costCentsPerWatt: 5000, taxCreditFraction: 0, rateCentsPerKwh: 1, rateInflation: 0 }));
    expect(r.paybackYears).toBeNull();
  });

  it("pays back sooner when power costs more", () => {
    const cheap = solarPayback(base({ rateCentsPerKwh: 8 })).paybackYears!;
    const dear = solarPayback(base({ rateCentsPerKwh: 20 })).paybackYears!;
    expect(dear).toBeLessThan(cheap);
  });

  it("pays back sooner when the utility raises rates faster", () => {
    const flat = solarPayback(base({ rateInflation: 0 })).paybackYears!;
    const rising = solarPayback(base({ rateInflation: 0.06 })).paybackYears!;
    expect(rising).toBeLessThan(flat);
  });

  it("accounts for panel degradation: year 25 produces less than year 1", () => {
    const noDegradationSavings = solarPayback(base({ rateInflation: 0 })).lifetimeSavingsCents;
    const naive = solarPayback(base({ rateInflation: 0 }));
    // 25 undegraded years would exceed the modelled figure.
    const undegraded = naive.firstYearSavingsCents * 25 - naive.netCostCents;
    expect(noDegradationSavings).toBeLessThan(undegraded);
  });

  it("is zero-safe with no panels", () => {
    const r = solarPayback(base({ panelCount: 0 }));
    expect(r.systemKw).toBe(0);
    expect(r.annualKwh).toBe(0);
    expect(r.paybackYears).toBeNull();
  });

  // I first asserted the payback must have a decimal. It doesn't have to — the
  // owner's own scenario lands on exactly 10.0. What actually matters is that
  // the answer has finer resolution than a whole year, i.e. it interpolates
  // inside the year rather than rounding up to the next one.
  it("resolves payback finer than a whole year", () => {
    const a = solarPayback(base({ rateCentsPerKwh: 12 })).paybackYears!;
    const b = solarPayback(base({ rateCentsPerKwh: 12.5 })).paybackYears!;
    expect(a).not.toBe(b);
    expect(b).toBeLessThan(a);
    expect(Number.isInteger(a) && Number.isInteger(b)).toBe(false);
  });

  it("lands the payback in the year the savings actually cross the net cost", () => {
    const r = solarPayback(base());
    // Cumulative savings must be short of the net cost the year before, and at
    // or past it in the payback year itself.
    const before = Math.floor(r.paybackYears!);
    const cum = (years: number) => {
      let total = 0;
      for (let y = 1; y <= years; y++) {
        const prod = r.annualKwh * 0.995 ** (y - 1);
        total += Math.min(prod, 63_500) * 12 * 1.03 ** (y - 1);
      }
      return total;
    };
    expect(cum(before)).toBeLessThan(r.netCostCents);
    expect(cum(before + 1)).toBeGreaterThanOrEqual(r.netCostCents);
  });
});
