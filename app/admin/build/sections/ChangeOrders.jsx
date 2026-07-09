"use client";

// Change orders — the single biggest reason a build blows its budget.
//
// The whole job of this screen is one decision: approve or reject each change
// to the signed contract. Approved changes flow straight into the Costs total
// (Costs.jsx sums approved orders into "Revised cost"), so the number a tired
// homeowner watches move here is the same number he pays.

import { useEffect, useRef, useState } from "react";

import {
  COLORS, FONT, Icon, ICON, ACCENT, ACCENT_SOFT, txt, MoneyInput, AddBtn, Chip,
  SectionHead, AutoTextarea, SelectPill, fmtCompact, fmtBuildDate,
  CHANGE_ORDER_KINDS, CHANGE_ORDER_STATUSES, todayIso
} from "../ui";

// Same glyph the sidebar uses for this tab, so the empty state reads as
// "this is that screen" rather than a generic placeholder.
const CO_GLYPH = "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 2v6h6 M12 18v-6 M9 15h6";

const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));
const sgn = (o) => (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0);
// Added cost reads amber, credit reads green, flat reads faint — matched to
// the Costs "Change orders" tile so the two screens never disagree.
const netColor = (n) => (n > 0 ? COLORS.amber : n < 0 ? COLORS.green : COLORS.textFaint);

function ActionBtn({ tone, icon, label, onClick }) {
  const map = {
    green: [COLORS.green, COLORS.greenBg],
    neutral: [COLORS.textMuted, COLORS.surface],
  };
  const [fg, bg] = map[tone] || map.neutral;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "9px 12px", borderRadius: 9, cursor: "pointer", fontFamily: FONT,
        fontSize: 13, fontWeight: 700, color: fg, background: bg,
        border: `1px solid ${tone === "neutral" ? COLORS.borderStrong : fg}`,
      }}
    >
      <Icon d={icon} size={15} color={fg} /> {label}
    </button>
  );
}

function ChangeOrderCard({ co, editing, onToggleEdit, onChange, onDelete }) {
  const credit = co.kind === "credit";
  const status = CHANGE_ORDER_STATUSES.find((s) => s.value === co.status) || CHANGE_ORDER_STATUSES[0];
  const amtLabel = `${credit ? "−" : "+"}${fmtCompact(co.amount_cents || 0)}`;

  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, background: COLORS.surface, overflow: "hidden" }}>
      <button
        onClick={onToggleEdit}
        aria-expanded={editing}
        style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 13px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={editing ? ICON.chevD : ICON.chevR} size={14} color={COLORS.textFaint} style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {co.description || "Untitled change"}
          </span>
          {co.reason && !editing && (
            <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: 12.5, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.45 }}>
              {co.reason}
            </span>
          )}
          {co.date && (
            <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint, marginTop: 3 }}>
              {fmtBuildDate(co.date)}
            </span>
          )}
        </span>
        <span style={{ flexShrink: 0, fontSize: 14, fontWeight: 800, color: credit ? COLORS.green : COLORS.text, fontVariantNumeric: "tabular-nums" }}>
          {amtLabel}
        </span>
      </button>

      {editing && (
        <div style={{ padding: "0 13px 13px 37px", display: "grid", gap: 9 }}>
          <input
            value={co.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="What changed? e.g. Add a window in the office"
            style={{ ...txt(), fontWeight: 700 }}
          />
          <AutoTextarea
            value={co.reason}
            onChange={(v) => onChange({ reason: v })}
            minRows={2}
            placeholder="Why? Who asked for it? (optional)"
          />
          <div style={{ display: "flex", gap: 8 }}>
            <SelectPill value={co.kind} options={CHANGE_ORDER_KINDS} onChange={(kind) => onChange({ kind })} ariaLabel="Cost or credit" minWidth={124} />
            <div style={{ flex: 1, minWidth: 0 }}><MoneyInput value={co.amount_cents} onChange={(v) => onChange({ amount_cents: v })} /></div>
          </div>
          <input
            type="date"
            value={co.date || ""}
            onChange={(e) => onChange({ date: e.target.value || null })}
            aria-label="Date of the change"
            style={{ ...txt() }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onDelete}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 9, cursor: "pointer", fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              <Icon d={ICON.x} size={13} /> Delete change order
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: "0 13px 13px 37px" }}>
        {co.status === "pending" ? (
          <div style={{ display: "flex", gap: 8 }}>
            <ActionBtn tone="neutral" icon={ICON.x} label="Reject" onClick={() => onChange({ status: "rejected" })} />
            <ActionBtn tone="green" icon={ICON.check} label="Approve" onClick={() => onChange({ status: "approved" })} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Chip tone={status.tone}>{status.label}</Chip>
            <span style={{ flex: 1 }} />
            <button
              onClick={() => onChange({ status: "pending" })}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              <Icon d={ICON.refresh} size={13} /> Change decision
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ImpactPanel({ approvedNet, baseEst, revised, pendingCount, pendingNet }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, background: COLORS.surface, boxShadow: COLORS.shadow, padding: "16px 16px 14px", marginBottom: 6 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>
        Approved changes to your budget
      </div>
      <div style={{ marginTop: 5, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: netColor(approvedNet), fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
        {approvedNet === 0 ? "No change yet" : signed(approvedNet)}
      </div>
      <div style={{ marginTop: 6, fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5 }}>
        {baseEst > 0
          ? <>Your <strong style={{ color: COLORS.text }}>{fmtCompact(baseEst)}</strong> estimate is now a revised <strong style={{ color: COLORS.text }}>{fmtCompact(revised)}</strong>.</>
          : <>Approve a change below and it flows into your Costs total.</>}
      </div>
      {pendingCount > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.surfaceTint}`, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: COLORS.textMuted }}>
          <Chip tone="amber">{pendingCount} waiting on you</Chip>
          <span>would move it {signed(pendingNet)} more if you approve them all.</span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 24px 34px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT_SOFT, display: "grid", placeItems: "center", marginBottom: 14 }}>
        <Icon d={CO_GLYPH} size={26} color={ACCENT} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>No change orders yet</div>
      <p style={{ maxWidth: 360, margin: "8px 0 18px", fontSize: 13, color: COLORS.textMuted, lineHeight: 1.55 }}>
        A change order is any change to your signed contract — an added window, a credit for a
        finish you dropped. Log each one, decide it, and every approved change flows straight into
        your Costs total.
      </p>
      <AddBtn label="Add your first change order" onClick={onAdd} />
    </div>
  );
}

export default function ChangeOrdersSection({ state, addRow, updRow, delRow }) {
  const cos = state.change_orders || [];
  const [editId, setEditId] = useState(null);

  // Newly-added orders open straight into edit mode so he types immediately
  // instead of hunting for an expand control. addRow doesn't hand back the id,
  // so watch the list grow and open whatever landed last.
  const wantEdit = useRef(false);
  const prevLen = useRef(cos.length);
  useEffect(() => {
    if (wantEdit.current && cos.length > prevLen.current) {
      const last = cos[cos.length - 1];
      if (last) setEditId(last.id);
      wantEdit.current = false;
    }
    prevLen.current = cos.length;
  }, [cos]);

  const addNew = () => {
    wantEdit.current = true;
    addRow("change_orders", {
      date: todayIso(),
      description: "", reason: "", amount_cents: 0, kind: "add", status: "pending",
    });
  };

  const pending = cos.filter((o) => o.status === "pending");
  const decided = cos.filter((o) => o.status !== "pending");
  const approvedNet = cos.filter((o) => o.status === "approved").reduce((s, o) => s + sgn(o), 0);
  const pendingNet = pending.reduce((s, o) => s + sgn(o), 0);
  const baseEst = (state.costs || []).reduce((s, c) => s + (c.estimate_cents || 0), 0);
  const revised = baseEst + approvedNet;

  const card = (co) => (
    <ChangeOrderCard
      key={co.id}
      co={co}
      editing={editId === co.id}
      onToggleEdit={() => setEditId((id) => (id === co.id ? null : co.id))}
      onChange={(p) => updRow("change_orders", co.id, p)}
      onDelete={() => { delRow("change_orders", co.id); setEditId(null); }}
    />
  );

  if (cos.length === 0) {
    return (
      <>
        <SectionHead title="Change orders" note="Changes to your contract after signing" />
        <EmptyState onAdd={addNew} />
      </>
    );
  }

  return (
    <>
      <SectionHead title="Change orders" note={`${cos.length} logged · approved changes move your Costs total`} />

      <ImpactPanel approvedNet={approvedNet} baseEst={baseEst} revised={revised} pendingCount={pending.length} pendingNet={pendingNet} />

      {pending.length > 0 && (
        <>
          <SectionHead title="Needs your decision" note={`${pending.length} to approve or reject`} />
          {pending.map(card)}
        </>
      )}

      {decided.length > 0 && (
        <>
          <SectionHead title="Decided" note={`${decided.length} settled`} />
          {decided.map(card)}
        </>
      )}

      <div style={{ marginTop: 14 }}>
        <AddBtn label="Add change order" onClick={addNew} />
      </div>
    </>
  );
}
