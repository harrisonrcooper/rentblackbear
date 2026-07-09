"use client";

// Payments — every dollar out the door, and the lien waiver that protects it.
//
// The load-bearing idea of this screen is legal, not financial: a payment with
// no signed lien waiver is money you've spent that a sub or supplier can still
// put a lien against. So a missing waiver is drawn as a RISK (red), not as a
// neutral status, and the running dollar figure of unprotected payments is the
// number the banner leads with.
//
// State is mutated only through addRow / updRow / delRow. Editing happens in the
// shared DetailDrawer (full-screen on mobile), matching Rooms and Materials.

import { useMemo, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, inputStyle, btn, Icon, ICON, fmtUsd, fmtCompact,
  Card, Field, txt, MoneyInput, AddBtn, Chip, SectionHead, StatStrip, SelectPill,
  optionsFrom, fmtBuildDate, todayIso
, DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";

const PAY_METHODS = ["Check", "ACH", "Wire", "Card", "Cash", "Loan draw"];

// The lien-waiver options for the in-drawer picker. Stored values are unchanged
// (not_needed / pending / received); only the labels and tones are chosen to
// speak plainly and to make an unsigned waiver read as the risk it is.
const WAIVER_OPTIONS = [
  { value: "not_needed", label: "Not needed", tone: "neutral" },
  { value: "pending", label: "Not signed yet", tone: "red" },
  { value: "received", label: "Signed & received", tone: "green" },
];

// How each waiver state reads on a payment card.
const WAIVER_CHIP = {
  not_needed: { label: "No waiver needed", tone: "neutral" },
  pending: { label: "Waiver missing", tone: "red" },
  received: { label: "Waiver signed", tone: "green" },
};

// Fill colours for an active picker pill — [text, border, background].
const TONE = {
  neutral: [COLORS.textMuted, COLORS.borderStrong, COLORS.surface],
  red: [COLORS.red, COLORS.red, COLORS.redBg],
  green: [COLORS.green, COLORS.green, COLORS.greenBg],
};

function newPayment() {
  return {
    date: todayIso(),
    vendor: "New payment",
    description: "",
    amount_cents: 0,
    method: "Check",
    lien_waiver: "pending",
  };
}

// A row of tappable pills — the one legal decision on this screen, set in one
// touch rather than hidden behind a dropdown.
function WaiverPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {WAIVER_OPTIONS.map((o) => {
        const on = o.value === value;
        const [fg, bd, bg] = on ? TONE[o.tone] : [COLORS.textMuted, COLORS.border, COLORS.surface];
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            style={{
              border: `1px solid ${bd}`, background: bg, color: fg, borderRadius: 999,
              padding: "7px 13px", fontSize: 12.5, fontWeight: on ? 700 : 600, cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// One payment in the ledger. Click to open the full editor.
function PaymentCard({ pay, onOpen }) {
  const chip = WAIVER_CHIP[pay.lien_waiver] || WAIVER_CHIP.not_needed;
  const meta = [pay.method, pay.date ? fmtBuildDate(pay.date) : null].filter(Boolean).join(" · ");
  return (
    <button
      data-item-id={pay.id}
      onClick={onOpen}
      style={{
        textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {pay.vendor || "Payment"}
          </span>
          {pay.description && (
            <span style={{ display: "block", fontSize: 11.5, color: COLORS.textFaint, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {pay.description}
            </span>
          )}
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
          {fmtUsd(pay.amount_cents || 0)}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <Chip tone={chip.tone}>{chip.label}</Chip>
        {meta && <Chip>{meta}</Chip>}
      </div>
    </button>
  );
}

// The full editor for one payment, hosted in the shared DetailDrawer.
function PaymentEditor({ pay, patch, onDelete }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <Field label="Who you paid">
        <input value={pay.vendor} onChange={(e) => patch({ vendor: e.target.value })} style={txt()} placeholder="e.g. Coastal Framing" />
      </Field>

      <Field label="What it was for">
        <input value={pay.description} onChange={(e) => patch({ description: e.target.value })} style={txt()} placeholder="e.g. Framing draw 2" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Amount">
          <MoneyInput value={pay.amount_cents} onChange={(v) => patch({ amount_cents: v })} />
        </Field>
        <Field label="Date paid">
          <DateField value={pay.date} onChange={(v) => patch({ date: v })} ariaLabel="Date paid" />
        </Field>
      </div>

      <Field label="How you paid">
        <SelectPill value={pay.method} options={optionsFrom(PAY_METHODS)} onChange={(method) => patch({ method })} ariaLabel="How you paid" minWidth={140} />
      </Field>

      <div style={{ marginBottom: 14 }}>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 6 }}>
          Lien waiver
        </span>
        <WaiverPicker value={pay.lien_waiver} onChange={(lien_waiver) => patch({ lien_waiver })} />
        <p style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5, margin: "9px 2px 0" }}>
          A lien waiver is the sub or supplier&apos;s signed receipt. Without one, someone
          you&apos;ve already paid can still file a lien against your finished home. Mark it
          &quot;Signed &amp; received&quot; only once the paper is in your hands.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onDelete} style={{ ...btn("ghost") }}>
          <Icon d={ICON.x} size={13} /> Delete payment
        </button>
      </div>
    </div>
  );
}

// The red legal-risk banner — dollars unprotected, in plain words, up top.
function RiskBanner({ unprotected, count }) {
  return (
    <div style={{
      display: "flex", gap: 11, alignItems: "flex-start",
      background: COLORS.redBg, border: `1px solid ${COLORS.red}`,
      borderRadius: 12, padding: "12px 14px", marginBottom: 12,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>
        <Icon d={ICON.flag} size={18} color={COLORS.red} />
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.red, marginBottom: 3 }}>
          Legal risk — {count} {count === 1 ? "payment" : "payments"} unprotected
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.5 }}>
          You&apos;ve paid {fmtUsd(unprotected)} with no signed lien waiver. Until each sub or
          supplier signs one, they can still put a lien on your finished home. Open each payment
          below and mark its waiver signed once you have the paper.
        </div>
      </div>
    </div>
  );
}

// The quiet green all-clear — shown only when there's real coverage to confirm.
function SafeBanner() {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "center",
      background: COLORS.greenBg, borderRadius: 10, padding: "9px 12px", marginBottom: 12,
    }}>
      <Icon d={ICON.check} size={15} color={COLORS.green} />
      <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text }}>
        Every payment has its lien waiver on file. You&apos;re covered.
      </span>
    </div>
  );
}

export default function PaymentsSection({ state, addRow, updRow, delRow }) {
  const pays = state.payments || [];
  const [openId, setOpenId] = useState(null);

  const total = pays.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const waiverDue = pays.filter((p) => p.lien_waiver === "pending");
  const unprotected = waiverDue.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const protectedCount = pays.filter((p) => p.lien_waiver === "received").length;

  const sorted = useMemo(
    () => pays.slice().sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date < b.date ? 1 : -1;
    }),
    [pays],
  );

  const open = pays.find((p) => p.id === openId) || null;
  const patch = (p) => open && updRow("payments", open.id, p);
  const add = () => addRow("payments", newPayment());

  // ── Empty state — the main screen until the first payment lands ──────────
  if (pays.length === 0) {
    return (
      <>
        <SectionHead title="Payments" note="Every dollar out the door — with the lien waiver that protects it" />
        <Card title="Record your first payment">
          <div style={{ textAlign: "center", padding: "22px 16px 26px", maxWidth: 460, margin: "0 auto" }}>
            <div style={{ width: 46, height: 46, margin: "0 auto 14px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
              <Icon d={ICON.fileText} size={22} color={ACCENT} />
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, margin: "0 0 6px" }}>
              Log what you pay, protect what you build
            </h3>
            <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 0 18px" }}>
              Write down every payment to a sub, supplier or contractor. For each one, collect a
              signed lien waiver — their receipt that they&apos;ve been paid and won&apos;t put a
              lien on your home. This screen keeps a running total and flags any payment still
              missing its waiver.
            </p>
            <AddBtn label="Add your first payment" onClick={add} />
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHead title="Payments" note={`${pays.length} ${pays.length === 1 ? "payment" : "payments"} · ${fmtUsd(total)} paid`} />

      <StatStrip items={[
        ["Paid to date", fmtCompact(total), COLORS.text],
        ["Payments", String(pays.length), COLORS.text],
        ["Waivers due", String(waiverDue.length), waiverDue.length ? COLORS.red : COLORS.green],
      ]} />

      {waiverDue.length > 0
        ? <RiskBanner unprotected={unprotected} count={waiverDue.length} />
        : protectedCount > 0
          ? <SafeBanner />
          : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {sorted.map((pay) => (
          <PaymentCard key={pay.id} pay={pay} onOpen={() => setOpenId(pay.id)} />
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <AddBtn label="Add payment" onClick={add} />
      </div>

      <DetailDrawer
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
        kind="Payment"
        title={open?.vendor || "Payment"}
      >
        {open && (
          <PaymentEditor
            key={open.id}
            pay={open}
            patch={patch}
            onDelete={() => { delRow("payments", open.id); setOpenId(null); }}
          />
        )}
      </DetailDrawer>
    </>
  );
}
