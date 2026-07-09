"use client";

// Overview section — the build's home base and the first screen he sees.
//
// The initial state is seeded (rooms, selections, milestones, inspections) but
// carries no dollar figures, so on day one this screen is a field of zeros. The
// caveman job here is to make that first look READABLE: surface the one input
// that unlocks money tracking (the target budget), say plainly what "Needs
// attention" is for, and never render a number he can't trace to something he
// entered.

import { COLORS, FONT, Icon, ICON, fmtCompact, SERIF, Card, Field, txt, MoneyInput, ProgressRing, StatTile, SectionHead, daysFromToday, AutoTextarea } from "../ui";
import {
  approvedChangeOrderCents, estimateCents, leftToPayCents, revisedCents,
} from "@/lib/build/costs";

function Dashboard({ state, onJump }) {
  const costs = state.costs || [];
  const budget = state.budget_cents || 0;
  const totalEst = estimateCents(costs);
  const cos = state.change_orders || [];
  const coNet = approvedChangeOrderCents(cos);
  const coPending = cos.filter((o) => o.status === "pending");
  // Same rollup as the Costs screen. These two printed the same label over two
  // different numbers before lib/build/costs.ts existed.
  const revised = revisedCents(costs, cos);
  const overBudget = budget > 0 && revised > budget;
  const pays = state.payments || [];
  const totalPaid = pays.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const leftToPay = leftToPayCents(revised, totalPaid);
  const waiverDue = pays.filter((p) => p.lien_waiver === "pending");

  const ms = state.milestones || [];
  const msDone = ms.filter((m) => m.done).length;
  const msPct = ms.length ? Math.round((msDone / ms.length) * 100) : 0;
  const nextMs = ms.filter((m) => m.target && !m.done).slice()
    .sort((a, b) => (a.target < b.target ? -1 : 1))[0];
  const overdueMs = ms.filter((m) => m.target && !m.done && daysFromToday(m.target) < 0);

  const sels = state.selections || [];
  const openSel = sels.filter((s) => s.status === "open");
  const dueSel = openSel.filter((s) => s.deadline && daysFromToday(s.deadline) < 21);

  const loan = state.loan || { amount_cents: 0, rate_bps: 0 };
  const drawn = (state.draws || []).reduce((s, d) => s + (d.amount_cents || 0), 0);
  const overDrawn = loan.amount_cents > 0 && drawn > loan.amount_cents;

  const wishes = state.wishlist || [];
  const wishDone = wishes.filter((w) => w.done).length;
  const needCount = wishes.filter((w) => w.priority === "need").length;
  const docs = state.documents || [];
  const docLinked = docs.filter((d) => d.url).length;
  const photos = state.photos || [];
  const rooms = state.rooms || [];
  const insps = state.inspections || [];
  const inspPassed = insps.filter((i) => i.status === "passed").length;
  const inspFailed = insps.filter((i) => i.status === "failed");
  const openRfis = (state.rfis || []).filter((r) => r.status === "open");
  const punchOpen = (state.punch_list || []).filter((i) => !i.done);

  const alerts = [];
  if (overBudget) alerts.push({ tone: COLORS.red, text: `Revised cost is ${fmtCompact(revised - budget)} over your target budget`, to: "costs" });
  if (overdueMs.length) alerts.push({ tone: COLORS.red, text: `${overdueMs.length} milestone${overdueMs.length > 1 ? "s" : ""} past due`, to: "milestones" });
  if (inspFailed.length) alerts.push({ tone: COLORS.red, text: `${inspFailed.length} inspection${inspFailed.length > 1 ? "s" : ""} failed — needs correction and re-inspection`, to: "inspections" });
  if (overDrawn) alerts.push({ tone: COLORS.red, text: `Construction loan is over-drawn by ${fmtCompact(drawn - loan.amount_cents)}`, to: "costs" });
  if (waiverDue.length) alerts.push({ tone: COLORS.red, text: `${waiverDue.length} payment${waiverDue.length > 1 ? "s" : ""} missing a signed lien waiver`, to: "payments" });
  if (coPending.length) alerts.push({ tone: COLORS.amber, text: `${coPending.length} change order${coPending.length > 1 ? "s" : ""} awaiting your approval`, to: "changeorders" });
  if (dueSel.length) alerts.push({ tone: COLORS.amber, text: `${dueSel.length} selection${dueSel.length > 1 ? "s" : ""} need a decision soon`, to: "selections" });
  if (openRfis.length) alerts.push({ tone: COLORS.amber, text: `${openRfis.length} open question${openRfis.length > 1 ? "s" : ""} for your architect or builder`, to: "decisions" });
  if (punchOpen.length) alerts.push({ tone: COLORS.amber, text: `${punchOpen.length} punch-list item${punchOpen.length > 1 ? "s" : ""} still open`, to: "punchlist" });

  // A vital reads amber when it's blank AND it unlocks something downstream. The
  // budget gates every money tile and the over/under alert, so an unset budget
  // is a "please fill me", not inert grey.
  const vitals = [
    { label: "Budget", value: budget ? fmtCompact(budget) : "Not set yet", needs: !budget },
    { label: "Square feet", value: state.sqft ? state.sqft.toLocaleString() : "Not set", needs: false },
    { label: "Stories", value: state.stories || "Not set", needs: false },
  ];

  const selDecided = sels.length - openSel.length;
  const wishPct = wishes.length ? Math.round((wishDone / wishes.length) * 100) : 0;
  const selPct = sels.length ? Math.round((selDecided / sels.length) * 100) : 0;
  const inspPct = insps.length ? Math.round((inspPassed / insps.length) * 100) : 0;

  // Overall progress spans the three things that actually mark a build's
  // advance: milestones reached, selections decided, inspections passed.
  // Equal weight, honest arithmetic, and the caption says which.
  const overallDone = msDone + selDecided + inspPassed;
  const overallTotal = ms.length + sels.length + insps.length;
  const overallPct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  const tiles = [
    ["Revised cost", fmtCompact(revised), budget ? `of ${fmtCompact(budget)} target` : totalEst ? "from your estimates" : "add estimates and a target", overBudget ? COLORS.red : COLORS.text, undefined, "costs"],
    ["Paid to date", fmtCompact(totalPaid), pays.length ? (revised ? `${fmtCompact(leftToPay)} still to pay` : `across ${pays.length} payment${pays.length > 1 ? "s" : ""}`) : "Nothing paid yet", COLORS.text, undefined, "payments"],
    ["Milestones", `${msDone} / ${ms.length}`, nextMs ? `Next: ${nextMs.label}` : msDone ? "on track" : "none reached yet", COLORS.text, msPct, "milestones"],
    ["Selections", `${selDecided} / ${sels.length}`, openSel.length ? `${openSel.length} still to decide` : "all decided", openSel.length ? COLORS.amber : COLORS.green, selPct, "selections"],
    ["Inspections", `${inspPassed} / ${insps.length}`, inspFailed.length ? `${inspFailed.length} failed` : inspPassed ? "passing" : insps.length ? "none passed yet" : "none scheduled", inspFailed.length ? COLORS.red : COLORS.text, inspPct, "inspections"],
    ["Wants", `${wishDone} / ${wishes.length}`, `${needCount} ${needCount === 1 ? "is a must-have" : "are must-haves"}`, COLORS.text, wishPct, "wants"],
    ["Loan drawn", fmtCompact(drawn), loan.amount_cents ? `of ${fmtCompact(loan.amount_cents)} facility` : "no loan set", overDrawn ? COLORS.red : COLORS.text, undefined, "costs"],
    ["Rooms", `${rooms.length}`, rooms.length ? "spaces planned" : "add your first room", COLORS.text, undefined, "rooms"],
    ["Photos", `${photos.length}`, photos.length ? "progress photos logged" : "no photos yet", COLORS.text, undefined, "photos"],
    ["Documents", `${docLinked} / ${docs.length}`, docs.length ? "have a link on file" : "none on file yet", COLORS.text, undefined, "documents"],
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 22, rowGap: 16, marginBottom: 26 }}>
        <ProgressRing pct={overallPct} caption="Complete" />
        <div style={{ minWidth: 0, flex: "1 1 220px" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>
            {state.project_name || "Our Dream Home"}
          </h2>
          {state.style && (
            <p style={{ fontSize: 13.5, color: COLORS.textMuted, margin: "6px 0 0", maxWidth: "52ch", lineHeight: 1.5 }}>{state.style}</p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, rowGap: 10, marginTop: 14 }}>
            {vitals.map((v) => (
              <div key={v.label}>
                <div style={{ fontSize: 14, fontWeight: 600, color: v.needs ? COLORS.amber : v.value.toString().startsWith("Not set") ? COLORS.textFaint : COLORS.text }}>{v.value}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textFaint }}>{v.label}</div>
              </div>
            ))}
          </div>
          {!budget && (
            <p style={{ fontSize: 12.5, color: COLORS.amber, margin: "12px 0 0", lineHeight: 1.5 }}>
              Add your target budget below and every cost, payment, and change order gets tracked against it automatically.
            </p>
          )}
        </div>
      </div>

      <SectionHead title="Needs attention" note={alerts.length ? `${alerts.length} ${alerts.length === 1 ? "thing" : "things"}` : "Nothing right now"} />
      <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, background: COLORS.surface, overflow: "hidden", marginBottom: 4 }}>
        {alerts.length ? alerts.map((a, i) => (
          <button
            key={i}
            onClick={() => onJump(a.to)}
            style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left", width: "100%",
              background: "transparent", border: "none",
              borderBottom: i === alerts.length - 1 ? "none" : `1px solid ${COLORS.border}`,
              padding: "12px 14px", cursor: "pointer", fontFamily: FONT,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.tone, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: COLORS.text, lineHeight: 1.4 }}>{a.text}</span>
            <Icon d={ICON.chevR} size={13} color={COLORS.textFaint} />
          </button>
        )) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.45 }}>Nothing needs you right now. As you set target dates and a budget, anything running late or over shows up here on its own.</span>
          </div>
        )}
      </div>

      <SectionHead title="At a glance" note="Tap any tile to open it" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(158px, 1fr))", gap: 10 }}>
        {tiles.map(([label, value, sub, accent, pct, to]) => (
          <StatTile key={label} label={label} value={value} sub={sub} accent={accent} pct={pct} onClick={() => onJump(to)} />
        ))}
      </div>
    </>
  );
}

export default function OverviewSection({ state, setField, onJump }) {
  return (
    <>
    <Dashboard state={state} onJump={onJump} />
    <Card title="Project basics">
      <div style={{ paddingTop: 6 }}>
        <Field label="Project name">
          <input type="text" value={state.project_name} onChange={(e) => setField("project_name", e.target.value)} style={txt()} placeholder="Our New Home" />
        </Field>
        {/* Vision is the most-read field in the app — it sits high, right under the
            name, so opening basics lands on it instead of burying it below the numbers. */}
        <Field label="Vision and must-knows for the architect">
          <AutoTextarea
            value={state.notes}
            onChange={(v) => setField("notes", v)}
            minRows={8}
            placeholder="The big picture — how you want the home to feel and live, deal-breakers, inspiration…"
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Field label="Target budget">
            <MoneyInput value={state.budget_cents} onChange={(v) => setField("budget_cents", v)} />
          </Field>
          <Field label="Square footage">
            <input type="number" value={state.sqft || ""} onChange={(e) => setField("sqft", Math.max(0, Math.round(Number(e.target.value) || 0)))} style={{ ...txt(), textAlign: "right" }} placeholder="0" />
          </Field>
          <Field label="Stories">
            <input type="number" value={state.stories || ""} onChange={(e) => setField("stories", Math.max(1, Math.round(Number(e.target.value) || 1)))} style={{ ...txt(), textAlign: "right" }} placeholder="1" />
          </Field>
        </div>
        <Field label="Style and vibe">
          <input type="text" value={state.style} onChange={(e) => setField("style", e.target.value)} style={txt()} placeholder="Such as modern farmhouse, single-story, board and batten" />
        </Field>
        <Field label="Lot and location">
          <input type="text" value={state.lot} onChange={(e) => setField("lot", e.target.value)} style={txt()} placeholder="Acreage, views, orientation, setbacks…" />
        </Field>
      </div>
    </Card>
    </>
  );
}
