"use client";

// Costs — budget lines by group, estimate vs actual, with the variance always
// computed for the homeowner. He never subtracts one column from another in his
// head: every line, every group, and the whole build show over/under in words
// and colour (red = spent more than planned, green = came in at or under).
//
// Change orders (../ChangeOrders), payments (../Payments), target budget and
// square footage (../Overview) are owned by other sections; here they are read
// only, to roll the "cost to complete" picture together in one place.

import {
  COLORS, ACCENT, SERIF, Icon, ICON, inputStyle,
  Card, txt, MoneyInput, DelBtn, Check, AddBtn, Chip, fmtCompact,
  DateField} from "../ui";
import {
  approvedChangeOrderCents, costBasisCents, leftToPayCents, perSquareFootCents, revisedCents,
} from "@/lib/build/costs";

const COST_GROUP_ORDER = [
  "Land & site", "Structure", "Exterior", "Mechanical", "Interior",
  "Finishes", "Soft costs", "Landscaping & extras", "Reserve", "Add-ons",
];

// A signed compact amount with a true minus sign, e.g. "+$12k" / "−$3k".
const signedCompact = (n) =>
  (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));

// The one sentence the user should never have to work out himself: did the
// actual land over, under, or on the estimate? Returns null when there is
// nothing to compare yet (no estimate, or nothing actually spent).
function variance(estimate_cents, actual_cents) {
  if (!(estimate_cents > 0) || !(actual_cents > 0)) return null;
  const delta = actual_cents - estimate_cents;
  if (delta > 0) return { tone: "red", icon: ICON.arrowUp, label: `${fmtCompact(delta)} over` };
  if (delta < 0) return { tone: "green", icon: ICON.arrowDn, label: `${fmtCompact(-delta)} under` };
  return { tone: "green", icon: ICON.check, label: "On estimate" };
}

// Roll variance across a set of lines, comparing only the ones that actually
// have a spend — so a group where one of six lines is filled in isn't reported
// as wildly "under". Returns null when there's nothing yet to compare.
function rollupVariance(lines) {
  const spent = lines.filter((c) => c.actual_cents > 0);
  if (spent.length === 0) return null;
  const actual = spent.reduce((s, c) => s + c.actual_cents, 0);
  const against = spent.reduce((s, c) => s + (c.estimate_cents || 0), 0);
  return variance(against, actual);
}

const VarChip = ({ v }) => (
  <Chip tone={v.tone}>
    <Icon d={v.icon} size={12} color="currentColor" />
    {v.label}
  </Chip>
);

export default function CostsSection({ state, setField, addRow, updRow, delRow }) {
  const costs = state.costs || [];
  const totalEst = costs.reduce((s, c) => s + c.estimate_cents, 0);
  const spentLines = costs.filter((c) => c.actual_cents > 0);
  const totalActual = spentLines.reduce((s, c) => s + c.actual_cents, 0);
  // The Total row prints Estimate and Actual side by side, so its chip must be
  // exactly Actual − Estimate of those two printed figures — never a rollup on a
  // different basis, or the badge would contradict the columns it sits beside.
  const totalVar = variance(totalEst, totalActual);

  const sqft = parseFloat(String(state.sqft || "").replace(/[^0-9.]/g, "")) || 0;
  const groups = [...new Set(costs.map((c) => c.group))]
    .sort((a, b) => COST_GROUP_ORDER.indexOf(a) - COST_GROUP_ORDER.indexOf(b));

  const loan = state.loan || { amount_cents: 0, rate_bps: 0 };
  const draws = state.draws || [];
  const drawn = draws.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const setLoan = (patch) => setField("loan", { ...loan, ...patch });

  const cos = state.change_orders || [];
  const coNet = approvedChangeOrderCents(cos);
  // Every line at its best-known price — the actual once recorded, the estimate
  // until then — plus approved change orders. Recording an actual MUST move this
  // number, or the dashboard is quoting a forecast the user has already disproved.
  const revised = revisedCents(costs, cos);
  const totalPaid = (state.payments || []).reduce((s, p) => s + (p.amount_cents || 0), 0);
  const leftToPay = leftToPayCents(revised, totalPaid);
  const perSqft = perSquareFootCents(revised, sqft);

  const basisLines = costs.filter((c) => c.estimate_cents > 0 || c.actual_cents > 0);
  const basis = costBasisCents(basisLines);

  const addLine = () =>
    addRow("costs", { label: "New cost", group: "Add-ons", estimate_cents: 0, actual_cents: 0, in_basis: true });

  const cellHead = { fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" };
  const GRID = "minmax(0,1fr) 84px 84px 26px";

  // ── Worksheet (the usual view — costs are seeded, so this is the norm) ──────
  const worksheet = (
    <>
      {/* Cost to complete — every figure here is derived, nothing to fill in. */}
      <Card title="Cost to complete">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(124px, 1fr))", gap: 8, paddingTop: 6 }}>
          {[
            ["Estimated", fmtCompact(totalEst), COLORS.text],
            ["Change orders", coNet ? signedCompact(coNet) : "—", coNet < 0 ? COLORS.green : COLORS.text],
            ["Revised cost", fmtCompact(revised), COLORS.text],
            ["Paid to date", fmtCompact(totalPaid), COLORS.text],
            ["Left to pay", fmtCompact(leftToPay), leftToPay < 0 ? COLORS.green : ACCENT],
            [
              state.budget_cents ? (state.budget_cents - revised >= 0 ? "Under target" : "Over target") : "No target set",
              state.budget_cents ? fmtCompact(Math.abs(state.budget_cents - revised)) : "—",
              !state.budget_cents ? COLORS.textFaint : state.budget_cents - revised >= 0 ? COLORS.green : COLORS.red,
            ],
            ["Cost per square foot", perSqft ? fmtCompact(perSqft) : "—", COLORS.text],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "10px 12px" }}>
              <div style={cellHead}>{l}</div>
              <div style={{ marginTop: 3, fontSize: 16, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Budget lines" sub={totalActual > 0 ? `${fmtCompact(totalActual)} spent of ${fmtCompact(totalEst)}` : `${fmtCompact(totalEst)} estimated`}>
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 8, padding: "4px 4px 6px", ...cellHead }}>
          <div>Line item</div>
          <div style={{ textAlign: "right" }}>Estimate</div>
          <div style={{ textAlign: "right" }}>Actual</div>
          <div />
        </div>

        {groups.map((g) => {
          const lines = costs.filter((c) => c.group === g);
          const gEst = lines.reduce((s, c) => s + c.estimate_cents, 0);
          const gv = rollupVariance(lines);
          return (
            <div key={g}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 4px 3px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {gv && <VarChip v={gv} />}
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(gEst)}</span>
                </span>
              </div>
              {lines.map((c) => {
                const v = variance(c.estimate_cents, c.actual_cents);
                const untouched = !c.estimate_cents && !c.actual_cents;
                return (
                  <div key={c.id} style={{ display: "grid", gridTemplateColumns: GRID, gap: 8, alignItems: "start", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                    <div style={{ minWidth: 0 }}>
                      <input
                        type="text"
                        value={c.label}
                        onChange={(e) => updRow("costs", c.id, { label: e.target.value })}
                        aria-label="Line item name"
                        style={{ ...txt(), fontWeight: 600, color: untouched ? COLORS.textMuted : COLORS.text }}
                      />
                      {v && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, fontWeight: 700, color: v.tone === "red" ? COLORS.red : COLORS.green }}>
                          <Icon d={v.icon} size={12} color="currentColor" />
                          {v.label}
                        </span>
                      )}
                    </div>
                    <MoneyInput value={c.estimate_cents} onChange={(val) => updRow("costs", c.id, { estimate_cents: val })} />
                    <MoneyInput value={c.actual_cents} onChange={(val) => updRow("costs", c.id, { actual_cents: val })} />
                    <DelBtn onClick={() => delRow("costs", c.id)} />
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Whole-build totals — the last thing he'd otherwise add up by hand. */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 8, alignItems: "center", padding: "12px 4px 4px", marginTop: 4, borderTop: `2px solid ${COLORS.border}` }}>
          <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4, color: COLORS.text }}>Total</span>
            {totalVar && <VarChip v={totalVar} />}
          </span>
          <span style={{ textAlign: "right", fontSize: 14, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(totalEst)}</span>
          <span style={{ textAlign: "right", fontSize: 14, fontWeight: 800, color: totalActual > 0 ? COLORS.text : COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{totalActual > 0 ? fmtCompact(totalActual) : "—"}</span>
          <span />
        </div>

        <AddBtn label="Add cost line" onClick={addLine} />
      </Card>

      {/* Shown even with nothing recorded. The explanation IS the feature: most
          homeowners have never heard of cost basis until an accountant asks for it,
          and by then the receipts are gone. */}
      <Card title="Tax cost basis" sub={basisLines.length > 0 ? fmtCompact(basis) : "Nothing recorded yet"}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
            Land plus everything you spend building this home becomes its cost basis — it lowers
            the capital-gains tax when you eventually sell, so keep every receipt. Uncheck anything
            you&apos;re deducting instead of capitalizing (for example, construction-loan interest).
          </div>
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
        </Card>
    </>
  );

  return (
    <>
      {costs.length === 0 ? (
        <Card title="Budget">
          <div style={{ textAlign: "center", padding: "22px 16px 26px", maxWidth: 460, margin: "0 auto" }}>
            <div style={{ width: 46, height: 46, margin: "0 auto 14px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
              <Icon d={ICON.scales} size={22} color={ACCENT} />
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, margin: "0 0 6px" }}>Track every dollar</h3>
            <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 0 18px" }}>
              List what each part of the build should cost, then fill in what it actually cost as the
              invoices land. We do the subtraction for you — every line, every group, and the whole
              build show whether you&apos;re over or under, so you never reach for a calculator.
            </p>
            <AddBtn label="Add your first cost line" onClick={addLine} />
          </div>
        </Card>
      ) : worksheet}

      {/* Construction loan — an independent tracker, always reachable. */}
      <Card title="Construction loan" sub={loan.amount_cents ? `${fmtCompact(drawn)} drawn` : "Track your draw schedule"}>
        <div style={{ display: "flex", gap: 8, padding: "6px 2px 12px" }}>
          <div style={{ flex: 2 }}>
            <span style={{ display: "block", ...cellHead, marginBottom: 4 }}>Loan amount</span>
            <MoneyInput value={loan.amount_cents} onChange={(v) => setLoan({ amount_cents: v })} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", ...cellHead, marginBottom: 4 }}>Interest rate percent</span>
            <input
              type="number" step="0.01" inputMode="decimal"
              value={loan.rate_bps ? loan.rate_bps / 100 : ""}
              onChange={(e) => setLoan({ rate_bps: Math.round((parseFloat(e.target.value) || 0) * 100) })}
              placeholder="0.00"
              aria-label="Interest rate percent"
              style={{ ...txt(), textAlign: "right" }}
            />
          </div>
        </div>
        {loan.amount_cents > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, paddingBottom: 12 }}>
            {[
              ["Drawn", fmtCompact(drawn), COLORS.text],
              ["Available", fmtCompact(Math.max(0, loan.amount_cents - drawn)), COLORS.green],
              ["Percent used", `${Math.round((drawn / loan.amount_cents) * 100)}%`, drawn > loan.amount_cents ? COLORS.red : COLORS.text],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
                <div style={cellHead}>{l}</div>
                <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, padding: "2px 4px 6px", ...cellHead }}>
          <div>Draw</div><div>Date</div><div style={{ textAlign: "right" }}>Amount</div><div />
        </div>
        {draws.map((d) => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <input type="text" value={d.label} onChange={(e) => updRow("draws", d.id, { label: e.target.value })} style={{ ...txt(), fontWeight: 600 }} placeholder="Foundation draw" aria-label="Draw name" />
            <DateField value={d.date} onChange={(v) => updRow("draws", d.id, { date: v })} ariaLabel="Draw date" />
            <MoneyInput value={d.amount_cents} onChange={(v) => updRow("draws", d.id, { amount_cents: v })} />
            <DelBtn onClick={() => delRow("draws", d.id)} />
          </div>
        ))}
        <AddBtn label="Add draw" onClick={() => addRow("draws", { label: "New draw", date: null, amount_cents: 0 })} />
      </Card>
    </>
  );
}
