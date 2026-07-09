"use client";

// Costs section.

import { COLORS, inputStyle, fmtCompact, ACCENT, Card, txt, MoneyInput, DelBtn, Check, AddBtn } from "../ui";

const COST_GROUP_ORDER = [
  "Land & site", "Structure", "Exterior", "Mechanical", "Interior",
  "Finishes", "Soft costs", "Landscaping & extras", "Reserve", "Add-ons",
];

export default function CostsSection({ state, setField, addRow, updRow, delRow }) {
  const costs = state.costs;
  const totalEst = costs.reduce((s, c) => s + c.estimate_cents, 0);
  const sqft = parseFloat(String(state.sqft || "").replace(/[^0-9.]/g, "")) || 0;
  const groups = [...new Set(costs.map((c) => c.group))]
    .sort((a, b) => COST_GROUP_ORDER.indexOf(a) - COST_GROUP_ORDER.indexOf(b));
  const loan = state.loan || { amount_cents: 0, rate_bps: 0 };
  const draws = state.draws || [];
  const drawn = draws.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const setLoan = (patch) => setField("loan", { ...loan, ...patch });

  const cos = state.change_orders || [];
  const coSigned = (o) => (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0);
  const coNet = cos.filter((o) => o.status === "approved").reduce((s, o) => s + coSigned(o), 0);
  const revised = totalEst + coNet;
  const totalPaid = (state.payments || []).reduce((s, p) => s + (p.amount_cents || 0), 0);
  const leftToPay = revised - totalPaid;
  const perSqft = sqft > 0 ? Math.round(revised / sqft) : 0;
  const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));
  const basisLines = costs.filter((c) => c.estimate_cents > 0 || c.actual_cents > 0);
  const basis = basisLines
    .filter((c) => c.in_basis !== false)
    .reduce((s, c) => s + (c.actual_cents || c.estimate_cents || 0), 0);

  return (
    <>
      <Card title="Cost to complete">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(124px, 1fr))", gap: 8, paddingTop: 6 }}>
          {[
            ["Estimated", fmtCompact(totalEst), COLORS.text],
            ["Change orders", coNet ? signed(coNet) : "—", coNet > 0 ? COLORS.amber : coNet < 0 ? COLORS.green : COLORS.textFaint],
            ["Revised cost", fmtCompact(revised), COLORS.text],
            ["Paid to date", fmtCompact(totalPaid), COLORS.text],
            ["Left to pay", fmtCompact(leftToPay), leftToPay < 0 ? COLORS.green : ACCENT],
            [
              state.budget_cents ? (state.budget_cents - revised >= 0 ? "Under budget" : "Over budget") : "No target",
              state.budget_cents ? fmtCompact(Math.abs(state.budget_cents - revised)) : "—",
              !state.budget_cents ? COLORS.textFaint : state.budget_cents - revised >= 0 ? COLORS.green : COLORS.red,
            ],
            ["Cost / sq ft", perSqft ? fmtCompact(perSqft) : "—", COLORS.text],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
              <div style={{ marginTop: 3, fontSize: 16, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Costs" sub={`${fmtCompact(totalEst)} est`}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 92px 92px 26px", gap: 8, padding: "4px 4px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>
          <div>Line item</div><div style={{ textAlign: "right" }}>Estimate</div><div style={{ textAlign: "right" }}>Actual</div><div />
        </div>
        {groups.map((g) => {
          const lines = state.costs.filter((c) => c.group === g);
          const gt = lines.reduce((s, c) => s + c.estimate_cents, 0);
          return (
            <div key={g}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 4px 3px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase" }}>{g}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(gt)}</span>
              </div>
              {lines.map((c) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 92px 92px 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                  <input type="text" value={c.label} onChange={(e) => updRow("costs", c.id, { label: e.target.value })} style={{ ...txt(), fontWeight: 600 }} />
                  <MoneyInput value={c.estimate_cents} onChange={(v) => updRow("costs", c.id, { estimate_cents: v })} />
                  <MoneyInput value={c.actual_cents} onChange={(v) => updRow("costs", c.id, { actual_cents: v })} />
                  <DelBtn onClick={() => delRow("costs", c.id)} />
                </div>
              ))}
            </div>
          );
        })}
        <AddBtn label="Add cost line" onClick={() => addRow("costs", { label: "New cost", group: "Add-ons", estimate_cents: 0, actual_cents: 0, in_basis: true })} />
      </Card>

      <Card title="Tax cost basis" sub={fmtCompact(basis)}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          Land plus everything you spend building this home becomes its cost basis — it lowers
          the capital-gains tax when you eventually sell, so keep every receipt. Uncheck anything
          you&apos;re deducting instead of capitalizing (e.g. construction-loan interest).
        </div>
        {basisLines.length === 0 ? (
          <div style={{ fontSize: 12, color: COLORS.textFaint, padding: "0 2px 6px" }}>
            Add estimates or actuals in Costs above and they&apos;ll appear here to include or exclude.
          </div>
        ) : (
          <>
            {basisLines.map((c) => {
              const amt = c.actual_cents || c.estimate_cents || 0;
              const inB = c.in_basis !== false;
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                  <Check done={inB} onClick={() => updRow("costs", c.id, { in_basis: !inB })} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: inB ? COLORS.text : COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: inB ? COLORS.text : COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(amt)}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 4px 2px" }}>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4, color: ACCENT }}>Total cost basis</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(basis)}</span>
            </div>
          </>
        )}
      </Card>

      <Card title="Construction loan" sub={loan.amount_cents ? `${fmtCompact(drawn)} drawn` : "Track your draw schedule"}>
        <div style={{ display: "flex", gap: 8, padding: "6px 2px 12px" }}>
          <div style={{ flex: 2 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Loan amount</span>
            <MoneyInput value={loan.amount_cents} onChange={(v) => setLoan({ amount_cents: v })} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Rate %</span>
            <input
              type="number" step="0.01" inputMode="decimal"
              value={loan.rate_bps ? loan.rate_bps / 100 : ""}
              onChange={(e) => setLoan({ rate_bps: Math.round((parseFloat(e.target.value) || 0) * 100) })}
              placeholder="0.00"
              style={{ ...txt(), textAlign: "right" }}
            />
          </div>
        </div>
        {loan.amount_cents > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, paddingBottom: 12 }}>
            {[
              ["Drawn", fmtCompact(drawn), COLORS.text],
              ["Available", fmtCompact(Math.max(0, loan.amount_cents - drawn)), COLORS.green],
              ["% used", `${Math.round((drawn / loan.amount_cents) * 100)}%`, drawn > loan.amount_cents ? COLORS.red : COLORS.text],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
                <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, padding: "2px 4px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>
          <div>Draw</div><div>Date</div><div style={{ textAlign: "right" }}>Amount</div><div />
        </div>
        {draws.map((d) => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <input type="text" value={d.label} onChange={(e) => updRow("draws", d.id, { label: e.target.value })} style={{ ...txt(), fontWeight: 600 }} placeholder="Foundation draw…" />
            <input type="date" value={d.date || ""} onChange={(e) => updRow("draws", d.id, { date: e.target.value || null })} aria-label="Draw date" style={inputStyle()} />
            <MoneyInput value={d.amount_cents} onChange={(v) => updRow("draws", d.id, { amount_cents: v })} />
            <DelBtn onClick={() => delRow("draws", d.id)} />
          </div>
        ))}
        <AddBtn label="Add draw" onClick={() => addRow("draws", { label: "New draw", date: null, amount_cents: 0 })} />
      </Card>
    </>
  );
}
