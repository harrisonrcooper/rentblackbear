"use client";

// Energy & commissioning — the performance scorecard (brief §Energy).
//
// The job here is not to store two strings; it is to answer one question the
// homeowner actually has: "did the house hit the numbers we paid for?" So every
// metric is JUDGED — target versus verified result — and rendered as Met (green),
// Missed (red), or still Awaiting a test (amber). He never compares two numbers in
// his head.
//
// The stored row shape is fixed at { id, label, target, value } (all strings), and
// this file honours that — direction (is lower better?) and units are DERIVED from
// the metric name against the standards table below, never stored. That keeps the
// data trivial and lets the scorecard stay smart.
//
// A solar-payback estimator lives at the bottom. It is a live calculator, not a
// saved record — the scorecard is the record; the estimator is the "is solar worth
// it?" tool you run once while deciding.

import { useMemo, useState } from "react";

import {
  DEFAULT_AMENITIES, DEFAULT_LOAD, DEFAULT_SOLAR, estimateLoad, priceLoad, solarPayback,
} from "@/lib/build/energy";
import {
  COLORS, FONT, SERIF, ACCENT, Icon,
  Card, Field, AddBtn, DelBtn, Chip, SectionHead, StatStrip, ProgressRing,
  MoneyInput, txt, fmtUsd
} from "../ui";

const BOLT = "M13 2L3 14h9l-1 8 10-12h-9l1-8z";
const TARGET_ICON = "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3";

// The commissioning tests a high-performance custom home is graded on. Each
// carries the one thing the row can't store: which direction is "good". The hint
// gives him the ballpark so he doesn't have to look it up, and the placeholder
// pre-loads a sensible target.
const STANDARD_METRICS = [
  { label: "HERS Index", unit: "index", lowerBetter: true, typical: "45", hint: "Lower is better. New-build code lands near 60; a tight custom home aims for 45 or below." },
  { label: "Blower door (ACH50)", unit: "ACH50", lowerBetter: true, typical: "3.0", hint: "Air changes per hour at 50 pascals. Lower is tighter — 3.0 is good, Passive House is 0.6." },
  { label: "Duct leakage (CFM25)", unit: "CFM25", lowerBetter: true, typical: "4", hint: "Leakage at 25 pascals. Lower means tighter ductwork and less wasted conditioning." },
  { label: "Solar production", unit: "kilowatt-hours per year", lowerBetter: false, typical: "9000", hint: "Higher is better. What the array actually generates versus the design estimate." },
];

// Pull the first number out of a free-typed field. "3.0 ACH50" and "45" both work.
function num(s) {
  const m = String(s ?? "").match(/-?\d[\d,]*\.?\d*/);
  return m ? parseFloat(m[0].replace(/,/g, "")) : null;
}

// Trim a computed number to something readable: 2 not 2.00, 0.4 not 0.40.
function fmtNum(n) {
  return Number.isFinite(n) ? String(+n.toFixed(2)) : "";
}

// What kind of metric is this? Exact match to a standard first, then keywords so a
// renamed or custom metric still gets judged in the right direction. null means we
// genuinely can't tell which way is good — then we record, but don't grade.
function metricSpec(label) {
  const clean = (label || "").trim().toLowerCase();
  const std = STANDARD_METRICS.find((s) => s.label.toLowerCase() === clean);
  if (std) return std;
  if (/hers|ach|blower|duct|leak|infiltrat/.test(clean)) return { unit: "", lowerBetter: true };
  if (/solar|produc|kwh|kilowatt|r-?value|seer|hspf|efficien|\bcop\b|output|yield/.test(clean)) return { unit: "", lowerBetter: false };
  return null;
}

// The verdict for one metric — the whole point of the screen.
function judge(m) {
  const spec = metricSpec(m.label);
  const t = num(m.target);
  const v = num(m.value);
  if (t == null) return { tone: "neutral", text: "Set a target", state: "no_target" };
  if (v == null) return { tone: "amber", text: "Awaiting result", state: "awaiting" };
  if (!spec) return { tone: "neutral", text: "Result recorded", state: "recorded" };
  const pass = spec.lowerBetter ? v <= t : v >= t;
  const diff = Math.abs(v - t);
  const unit = spec.unit && !/per year/.test(spec.unit) ? ` ${spec.unit}` : "";
  if (pass) {
    return { tone: "green", text: diff === 0 ? "Met target" : `Beat target by ${fmtNum(diff)}${unit}`, state: "met" };
  }
  return { tone: "red", text: `Missed by ${fmtNum(diff)}${unit}`, state: "missed" };
}

const numColStyle = { ...txt(), textAlign: "right", fontWeight: 800, fontVariantNumeric: "tabular-nums" };
const capStyle = { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 };

// One metric = one graded card. Name, its two numbers, and the plain-English verdict.
function MetricCard({ m, onPatch, onDelete }) {
  const spec = metricSpec(m.label);
  const unitLabel = spec?.unit || "";
  const verdict = judge(m);
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10, background: COLORS.surface, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={m.label}
          onChange={(e) => onPatch({ label: e.target.value })}
          placeholder="Name this metric"
          style={{ ...txt(), flex: 1, minWidth: 0, fontWeight: 700 }}
        />
        <DelBtn onClick={onDelete} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <label style={{ display: "block", minWidth: 0 }}>
          <span style={capStyle}>Target</span>
          <input
            value={m.target}
            onChange={(e) => onPatch({ target: e.target.value })}
            inputMode="decimal"
            placeholder={spec?.typical || "goal"}
            style={numColStyle}
          />
          {unitLabel && <span style={{ display: "block", fontSize: 10.5, color: COLORS.textFaint, marginTop: 3, textAlign: "right" }}>{unitLabel}</span>}
        </label>
        <label style={{ display: "block", minWidth: 0 }}>
          <span style={capStyle}>Verified result</span>
          <input
            value={m.value}
            onChange={(e) => onPatch({ value: e.target.value })}
            inputMode="decimal"
            placeholder="measured"
            style={numColStyle}
          />
          {unitLabel && <span style={{ display: "block", fontSize: 10.5, color: COLORS.textFaint, marginTop: 3, textAlign: "right" }}>{unitLabel}</span>}
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Chip tone={verdict.tone}>{verdict.text}</Chip>
        {spec?.hint && <span style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.4, flex: "1 1 180px", minWidth: 0 }}>{spec.hint}</span>}
      </div>
    </div>
  );
}

// A one-tap way to add a standard test, pre-named and ready for its two numbers.
function StandardPill({ spec, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px",
        borderRadius: 10, cursor: "pointer", fontFamily: FONT, fontSize: 12.5, fontWeight: 700,
        color: COLORS.text, background: COLORS.surfaceTint, border: `1px solid ${COLORS.borderStrong}`,
      }}
    >
      <Icon d={["M12 5v14", "M5 12h14"]} size={13} color={ACCENT} />
      {spec.label}
    </button>
  );
}

// ── The two calculators the brief asks for ───────────────────────────────────
//
// Load first, then solar — because "is solar worth it?" is unanswerable until
// you know what the house will actually eat. The old estimator asked him for
// annual production, a number nobody knows; this one derives it from a panel
// count, which anyone can read off a quote.
//
// Every coefficient is a visible, editable assumption. Money is integer cents.
// All arithmetic lives in lib/build/energy.ts, under test.

function NumField({ label, value, onChange, suffix, step = 1, min = 0 }) {
  return (
    <Field label={label}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        style={{ ...txt(), textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
      />
      {suffix && (
        <span style={{ display: "block", fontSize: 10.5, color: COLORS.textFaint, marginTop: 3, textAlign: "right" }}>
          {suffix}
        </span>
      )}
    </Field>
  );
}

function AmenityToggle({ amenity, onToggle }) {
  const on = amenity.enabled;
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
        padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontFamily: FONT,
        border: `1px solid ${on ? COLORS.accent : COLORS.border}`,
        background: on ? COLORS.accentSoft : COLORS.surface,
      }}
    >
      <span style={{
        width: 15, height: 15, borderRadius: 4, flexShrink: 0, display: "grid", placeItems: "center",
        border: `1.5px solid ${on ? COLORS.accent : COLORS.borderStrong}`,
        background: on ? COLORS.accent : COLORS.surface,
      }}>
        {on && <Icon d="M20 6L9 17l-5-5" size={9} color="#fff" />}
      </span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: on ? COLORS.text : COLORS.textMuted }}>
        {amenity.label}
      </span>
      <span style={{ fontSize: 11.5, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>
        {amenity.kwhPerYear.toLocaleString()} kWh
      </span>
    </button>
  );
}

function EnergyCalculators({ sqft }) {
  const [main, setMain] = useState(sqft || DEFAULT_LOAD.mainSqft);
  const [carriage, setCarriage] = useState(DEFAULT_LOAD.carriageSqft);
  const [basement, setBasement] = useState(DEFAULT_LOAD.basementSqft);
  const [perSqft, setPerSqft] = useState(DEFAULT_LOAD.kwhPerSqft);
  const [amenities, setAmenities] = useState(DEFAULT_AMENITIES);

  const [panels, setPanels] = useState(DEFAULT_SOLAR.panelCount);
  const [panelWatts, setPanelWatts] = useState(DEFAULT_SOLAR.panelWatts);
  const [costPerWatt, setCostPerWatt] = useState(DEFAULT_SOLAR.costCentsPerWatt / 100);
  const [rate, setRate] = useState(DEFAULT_SOLAR.rateCentsPerKwh);
  const [inflation, setInflation] = useState(DEFAULT_SOLAR.rateInflation * 100);

  const n = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

  const load = useMemo(
    () => priceLoad(estimateLoad({
      mainSqft: n(main), carriageSqft: n(carriage), basementSqft: n(basement),
      kwhPerSqft: n(perSqft), amenities,
    }), n(rate)),
    [main, carriage, basement, perSqft, amenities, rate],
  );

  const solar = useMemo(
    () => solarPayback({
      ...DEFAULT_SOLAR,
      panelCount: n(panels), panelWatts: n(panelWatts),
      costCentsPerWatt: Math.round(n(costPerWatt) * 100),
      rateCentsPerKwh: n(rate), rateInflation: n(inflation) / 100,
      householdKwh: load.totalKwh,
    }),
    [panels, panelWatts, costPerWatt, rate, inflation, load.totalKwh],
  );

  const toggle = (id) =>
    setAmenities((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));

  const offsetPct = Math.round(solar.offsetFraction * 100);

  return (
    <>
      <Card title="What this house will use" sub={`${load.totalKwh.toLocaleString()} kilowatt-hours a year`}>
        <p style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5, margin: "2px 2px 14px" }}>
          An all-electric house of this size, plus whatever you switch on below. Change any
          assumption and everything downstream moves — nothing here is hidden in a formula.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: 12 }}>
          <NumField label="Main house" value={main} onChange={setMain} suffix="square feet" step={50} />
          <NumField label="Carriage apartment" value={carriage} onChange={setCarriage} suffix="square feet" step={50} />
          <NumField label="Finished basement" value={basement} onChange={setBasement} suffix="square feet" step={50} />
          <NumField label="Efficiency" value={perSqft} onChange={setPerSqft} suffix="kWh per square foot" step={0.5} />
        </div>
        <p style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5, margin: "0 2px 12px" }}>
          Twelve is a well-sealed heat-pump house. Code-minimum runs sixteen to eighteen; a
          passive house runs six to eight.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(228px, 1fr))", gap: 6, marginBottom: 12 }}>
          {amenities.map((a) => <AmenityToggle key={a.id} amenity={a} onToggle={() => toggle(a.id)} />)}
        </div>

        <StatStrip items={[
          ["The house itself", `${load.envelopeKwh.toLocaleString()} kWh`, COLORS.text],
          ["What you switched on", `${load.amenitiesKwh.toLocaleString()} kWh`, COLORS.text],
          ["A year of power", fmtUsd(load.annualCostCents), COLORS.text],
        ]} />
      </Card>

      <Card title="Is solar worth it?" sub={solar.paybackYears === null ? "Never pays back" : `Pays back in ${solar.paybackYears} years`}>
        <p style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5, margin: "2px 2px 14px" }}>
          Read the panel count off the quote. Production, degradation and rising utility rates
          are worked out for you. Nothing here is saved — the array itself belongs in the
          scorecard above.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: 12 }}>
          <NumField label="Panels" value={panels} onChange={setPanels} suffix="on the pergola" />
          <NumField label="Each panel" value={panelWatts} onChange={setPanelWatts} suffix="watts" step={10} />
          <NumField label="Installed cost" value={costPerWatt} onChange={setCostPerWatt} suffix="dollars per watt" step={0.05} />
          <NumField label="Electricity rate" value={rate} onChange={setRate} suffix="cents per kilowatt-hour" step={0.5} />
          <NumField label="Rate rises" value={inflation} onChange={setInflation} suffix="percent a year" step={0.5} />
        </div>

        <StatStrip items={[
          ["Array", `${solar.systemKw} kW`, COLORS.text],
          ["Covers", `${offsetPct}% of your power`, offsetPct >= 100 ? COLORS.green : COLORS.text],
          ["Cost after the tax credit", fmtUsd(solar.netCostCents), COLORS.text],
          ["Saved the first year", fmtUsd(solar.firstYearSavingsCents), COLORS.text],
          [
            "Pays for itself in",
            solar.paybackYears === null ? "Never" : `${solar.paybackYears} years`,
            solar.paybackYears === null ? COLORS.red : solar.paybackYears <= 25 ? COLORS.green : COLORS.amber,
          ],
          ["Net over 25 years", fmtUsd(solar.lifetimeSavingsCents), solar.lifetimeSavingsCents >= 0 ? COLORS.green : COLORS.red],
        ]} />

        <p style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5, margin: "12px 2px 2px" }}>
          You only save on power you would otherwise have bought, so an array covering more than
          your use does not save more. Panels lose half a percent a year. Exported surplus is
          worth nothing here, because what your utility pays for it is a tariff this does not know.
        </p>
      </Card>
    </>
  );
}

export default function EnergySection({ state, addRow, updRow, delRow }) {
  // The project's square footage, if he has set it, so the load calculator
  // opens with his house rather than a stranger's.
  const sqft = Number(state.sqft) || 0;
  const metrics = state.energy || [];

  const summary = useMemo(() => {
    let withTarget = 0, resultsIn = 0, met = 0, missed = 0, awaiting = 0;
    for (const m of metrics) {
      const v = judge(m);
      if (v.state !== "no_target") withTarget += 1;
      if (v.state === "met" || v.state === "missed" || v.state === "recorded") resultsIn += 1;
      if (v.state === "met") met += 1;
      if (v.state === "missed") missed += 1;
      if (v.state === "awaiting") awaiting += 1;
    }
    return { withTarget, resultsIn, met, missed, awaiting };
  }, [metrics]);

  const addStandard = (spec) => addRow("energy", { label: spec.label, target: "", value: "" });
  const addCustom = () => addRow("energy", { label: "", target: "", value: "" });
  const notYetAdded = STANDARD_METRICS.filter(
    (s) => !metrics.some((m) => (m.label || "").trim().toLowerCase() === s.label.toLowerCase()),
  );

  // ── Empty state — the first (often only) thing he sees, so it's the main screen ──
  if (metrics.length === 0) {
    return (
      <>
        <SectionHead title="Energy & commissioning" note="Prove the house performs — targets versus tested results" />
        <Card title="Start your scorecard">
          <div style={{ textAlign: "center", padding: "20px 16px 8px", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ width: 48, height: 48, margin: "0 auto 15px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
              <Icon d={BOLT} size={22} color={ACCENT} />
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Track the numbers you paid for</h3>
            <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 0 18px" }}>
              Set a target for each energy test, then record the verified result. The scorecard grades every
              one for you — met, missed, or still awaiting a test — so you never compare numbers in your head.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 6 }}>
              {STANDARD_METRICS.map((s) => <StandardPill key={s.label} spec={s} onClick={() => addStandard(s)} />)}
            </div>
            <div style={{ marginTop: 4 }}>
              <AddBtn label="Add a different metric" onClick={addCustom} />
            </div>
          </div>
        </Card>
        <EnergyCalculators sqft={sqft} />
      </>
    );
  }

  const ringPct = summary.withTarget ? Math.round((summary.met / summary.withTarget) * 100) : 0;

  return (
    <>
      <SectionHead
        title="Energy & commissioning"
        note={`${metrics.length} ${metrics.length === 1 ? "metric" : "metrics"} · ${summary.met} of ${summary.withTarget} targets met`}
      />

      <Card title="Scorecard">
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", padding: "4px 2px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ProgressRing pct={ringPct} caption="targets met" size={104} />
          </div>
          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
            <StatStrip items={[
              ["Results in", `${summary.resultsIn} of ${metrics.length}`, COLORS.text],
              ["Missed", String(summary.missed), summary.missed ? COLORS.red : COLORS.textMuted],
              ["Awaiting test", String(summary.awaiting), summary.awaiting ? COLORS.amber : COLORS.textMuted],
            ]} />
          </div>
        </div>
      </Card>

      <div>
        {metrics.map((m) => (
          <MetricCard
            key={m.id}
            m={m}
            onPatch={(p) => updRow("energy", m.id, p)}
            onDelete={() => delRow("energy", m.id)}
          />
        ))}
      </div>

      {notYetAdded.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", margin: "4px 0 6px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textFaint }}>
            <Icon d={TARGET_ICON} size={13} color={COLORS.textFaint} /> Add a standard test
          </span>
          {notYetAdded.map((s) => <StandardPill key={s.label} spec={s} onClick={() => addStandard(s)} />)}
        </div>
      )}

      <div style={{ marginTop: 2, marginBottom: 6 }}>
        <AddBtn label="Add a different metric" onClick={addCustom} />
      </div>

      <EnergyCalculators sqft={sqft} />
    </>
  );
}
