"use client";

// Contractor quotes and bids (brief section 6.9).
//
// Collect what each builder bid, grouped by the job (scope), and compare
// like-for-like bids side by side. The one job here that a spreadsheet does
// badly: catching when a builder's stated total disagrees with his own line
// items. We show both numbers in red rather than silently trusting one — a
// transposed digit on a six-figure bid is a five-figure surprise later.
//
// All comparison math lives in lib/build/quotes.ts; this file is presentation
// and wiring only. Money is integer cents end to end.

import { useState } from "react";

import {
  COLORS, FONT, inputStyle, btn,
  Icon, ICON, fmtUsd,
  Card, Field, txt, MoneyInput, DelBtn, AddBtn,
  SectionHead, Chip, StatStrip, fmtBuildDate, SelectPill
} from "../ui";
import DetailDrawer from "../DetailDrawer";
import {
  byScope, effectiveTotalCents, linesTotalCents, hasLineMismatch,
  lowestIn, spreadCents, acceptedIn, acceptQuote, budgetLineFor,
} from "@/lib/build/quotes";

const STATUS_LABEL = {
  requested: "Requested",
  received: "Received",
  accepted: "Accepted",
  declined: "Declined",
};
const STATUS_TONE = {
  requested: "neutral",
  received: "accent",
  accepted: "green",
  declined: "red",
};
const STATUS_ORDER = ["requested", "received", "accepted", "declined"];

export default function QuotesSection({ state, setField, addRow, updRow, delRow }) {
  const quotes = state.quotes;
  const [openId, setOpenId] = useState(null);
  const openQuote = quotes.find((q) => q.id === openId) || null;

  const groups = [...byScope(quotes).entries()];

  function accept(id) {
    const accepted = quotes.find((q) => q.id === id);
    if (!accepted) return;
    // acceptQuote returns the whole array with the target accepted and its
    // same-scope siblings declined; write it back atomically as one field set
    // so no intermediate render shows two accepted bids in a scope.
    setField("quotes", acceptQuote(quotes, id));
    addRow("costs", { group: "Bids", in_basis: true, actual_cents: 0, ...budgetLineFor(accepted) });
  }

  function addBid(scope) {
    addRow("quotes", {
      vendor: "New bid", scope: scope || "New scope", date: null, status: "requested",
      total_cents: 0, lines: [], doc_url: "", notes: "",
    });
  }

  const totalBids = quotes.length;
  const decided = quotes.filter((q) => q.status === "accepted").length;
  const mismatches = quotes.filter(hasLineMismatch).length;

  return (
    <div>
      <SectionHead
        title="Quotes & Bids"
        note={totalBids ? `${totalBids} ${totalBids === 1 ? "bid" : "bids"} across ${groups.length} ${groups.length === 1 ? "scope" : "scopes"}` : "Gather bids and compare"}
      />

      {totalBids > 0 && (
        <StatStrip items={[
          ["Bids", String(totalBids), COLORS.text],
          ["Scopes", String(groups.length), COLORS.text],
          ["Accepted", String(decided), decided ? COLORS.green : COLORS.textFaint],
          ["Total mismatches", String(mismatches), mismatches ? COLORS.red : COLORS.textFaint],
        ]} />
      )}

      {totalBids === 0 ? (
        <EmptyState onAdd={() => addBid("")} />
      ) : (
        groups.map(([scope, bids]) => (
          <ScopeGroup
            key={scope}
            scope={scope}
            bids={bids}
            onOpen={setOpenId}
            onAccept={accept}
            onAddBid={() => addBid(scope)}
          />
        ))
      )}

      {totalBids > 0 && (
        <AddBtn label="Add a bid for a new scope" onClick={() => addBid("")} />
      )}

      <QuoteDrawer
        quote={openQuote}
        onClose={() => setOpenId(null)}
        onChange={(patch) => openQuote && updRow("quotes", openQuote.id, patch)}
        onDelete={() => { if (openQuote) { delRow("quotes", openQuote.id); setOpenId(null); } }}
        onAccept={() => openQuote && accept(openQuote.id)}
      />
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <Card title="No bids yet">
      <div style={{ padding: "8px 4px 14px", maxWidth: 460 }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>
          Track what each contractor bid for a job — framing, roofing, plumbing.
          Add two or more bids for the same scope and they line up side by side,
          with the lowest marked and the gap between them shown.
        </p>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: COLORS.textFaint, lineHeight: 1.5 }}>
          Enter each bid&rsquo;s line items and we&rsquo;ll flag any whose numbers
          don&rsquo;t add up to the total the builder wrote.
        </p>
        <AddBtn label="Add your first bid" onClick={onAdd} />
      </div>
    </Card>
  );
}

function ScopeGroup({ scope, bids, onOpen, onAccept, onAddBid }) {
  const lowest = lowestIn(bids);
  const spread = spreadCents(bids);
  const accepted = acceptedIn(bids);
  const liveCount = bids.filter((b) => b.status !== "declined").length;
  const comparable = liveCount >= 2;

  return (
    <Card
      title={scope}
      sub={accepted ? "Decided" : comparable ? `${liveCount} bids · spread ${fmtUsd(spread)}` : `${bids.length} ${bids.length === 1 ? "bid" : "bids"}`}
    >
      <div style={{ overflowX: "auto", margin: "0 -4px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr>
              {["Vendor", "Date", "Total", "Vs lowest", "", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i >= 2 && i <= 3 ? "right" : "left",
                    padding: "6px 8px", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: COLORS.textFaint, whiteSpace: "nowrap",
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bids.map((q) => (
              <BidRow
                key={q.id}
                quote={q}
                lowest={lowest}
                isLowestLive={comparable && q.status !== "declined" && effectiveTotalCents(q) === lowest}
                onOpen={() => onOpen(q.id)}
                onAccept={() => onAccept(q.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 4 }}>
        <AddBtn label="Add another bid for this scope" onClick={onAddBid} />
      </div>
    </Card>
  );
}

function BidRow({ quote, lowest, isLowestLive, onOpen, onAccept }) {
  const total = effectiveTotalCents(quote);
  const declined = quote.status === "declined";
  const mismatch = hasLineMismatch(quote);
  // Delta only means something when there's a live lowest to measure against
  // and this bid is itself in the running.
  const delta = lowest != null && !declined ? total - lowest : null;

  return (
    <tr style={{ borderBottom: `1px solid ${COLORS.border}`, opacity: declined ? 0.55 : 1 }}>
      <td style={{ padding: "9px 8px", verticalAlign: "middle" }}>
        <button
          onClick={onOpen}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: "transparent",
            border: "none", padding: 0, cursor: "pointer", fontFamily: FONT,
            fontSize: 12.5, fontWeight: 700, color: COLORS.text, textAlign: "left",
          }}
        >
          {isLowestLive && (
            <span title="Lowest bid" style={{ lineHeight: 0, color: COLORS.green }}>
              <Icon d={ICON.check} size={14} color={COLORS.green} />
            </span>
          )}
          <span>{quote.vendor || "Unnamed vendor"}</span>
        </button>
        <div style={{ marginTop: 4 }}>
          <Chip tone={STATUS_TONE[quote.status]}>{STATUS_LABEL[quote.status]}</Chip>
        </div>
      </td>

      <td style={{ padding: "9px 8px", verticalAlign: "middle", color: COLORS.textMuted, whiteSpace: "nowrap" }}>
        {quote.date ? fmtBuildDate(quote.date) : "—"}
      </td>

      <td style={{ padding: "9px 8px", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", color: isLowestLive ? COLORS.green : COLORS.text }}>
          {fmtUsd(total)}
        </span>
        {mismatch && (
          <div style={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}>
            <Chip tone="red">
              Lines {fmtUsd(linesTotalCents(quote))} ≠ stated {fmtUsd(quote.total_cents)}
            </Chip>
          </div>
        )}
      </td>

      <td style={{ padding: "9px 8px", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", color: COLORS.textMuted }}>
        {delta == null ? "—" : delta === 0 ? "lowest" : `+${fmtUsd(delta)}`}
      </td>

      <td style={{ padding: "9px 8px", verticalAlign: "middle", textAlign: "right" }}>
        {quote.status === "accepted" ? (
          <Chip tone="green">Accepted</Chip>
        ) : declined ? (
          <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>Declined</span>
        ) : (
          <button onClick={onAccept} style={{ ...btn("ghost"), fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap" }}>
            Accept
          </button>
        )}
      </td>

      <td style={{ padding: "9px 8px 9px 0", verticalAlign: "middle", textAlign: "right" }}>
        <button
          onClick={onOpen}
          aria-label="Open bid details"
          style={{
            width: 26, height: 26, borderRadius: 7, cursor: "pointer",
            border: `1px solid ${COLORS.border}`, background: COLORS.surface,
            color: COLORS.textFaint, display: "grid", placeItems: "center",
          }}
        >
          <Icon d={ICON.chevR} size={14} />
        </button>
      </td>
    </tr>
  );
}

function QuoteDrawer({ quote, onClose, onChange, onDelete, onAccept }) {
  const lineTotal = quote ? linesTotalCents(quote) : 0;
  const mismatch = quote ? hasLineMismatch(quote) : false;

  function addLine() {
    onChange({ lines: [...(quote.lines || []), { id: `ln${Date.now()}`, description: "", quantity: 1, unit_price_cents: 0 }] });
  }
  function updLine(id, patch) {
    onChange({ lines: (quote.lines || []).map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }
  function delLine(id) {
    onChange({ lines: (quote.lines || []).filter((l) => l.id !== id) });
  }

  return (
    <DetailDrawer
      open={!!quote}
      onClose={onClose}
      kind="Bid"
      title={quote ? (quote.vendor || "Unnamed vendor") : ""}
      tabs={[{ id: "detail", label: "Detail" }]}
      activeTab="detail"
      onTab={() => {}}
      footer={quote && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <button onClick={onDelete} style={{ ...btn("ghost"), color: COLORS.red, borderColor: COLORS.border }}>
            Delete bid
          </button>
          {quote.status !== "accepted" && quote.status !== "declined" && (
            <button onClick={onAccept} style={{ ...btn("ghost"), color: COLORS.green, borderColor: COLORS.border }}>
              Accept this bid
            </button>
          )}
        </div>
      )}
    >
      {quote && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Vendor">
              <input type="text" value={quote.vendor} onChange={(e) => onChange({ vendor: e.target.value })} style={txt()} placeholder="Contractor name" />
            </Field>
            <Field label="Scope">
              <input type="text" value={quote.scope} onChange={(e) => onChange({ scope: e.target.value })} style={txt()} placeholder="Framing, roofing…" />
            </Field>
            <Field label="Bid date">
              <input type="date" value={quote.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} style={txt()} aria-label="Bid date" />
            </Field>
            <Field label="Status">
              <SelectPill value={quote.status} options={STATUS_ORDER.map((v) => ({ value: v, label: STATUS_LABEL[v], tone: STATUS_TONE[v] || "neutral" }))} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={132} />
            </Field>
          </div>

          <Field label="Stated total (what the builder wrote)">
            <MoneyInput value={quote.total_cents} onChange={(v) => onChange({ total_cents: v })} />
          </Field>

          {mismatch && (
            <div style={{ margin: "-4px 0 14px", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <Chip tone="red">
                Lines add to {fmtUsd(lineTotal)}, not {fmtUsd(quote.total_cents)}
              </Chip>
              <span style={{ fontSize: 11.5, color: COLORS.textMuted }}>
                Off by {fmtUsd(Math.abs(lineTotal - quote.total_cents))} — check before you sign.
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "18px 0 8px" }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "-0.01em" }}>Line items</span>
            <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>
              Lines total <strong style={{ color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(lineTotal)}</strong>
            </span>
          </div>

          {(quote.lines || []).length === 0 ? (
            <p style={{ margin: "0 0 10px", fontSize: 12.5, color: COLORS.textFaint }}>
              No line items yet. Add them to check the builder&rsquo;s total against his own numbers.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quote.lines.map((l) => (
                <LineRow key={l.id} line={l} onChange={(p) => updLine(l.id, p)} onDelete={() => delLine(l.id)} />
              ))}
            </div>
          )}

          <AddBtn label="Add line item" onClick={addLine} />

          <div style={{ marginTop: 16 }}>
            <Field label="Document link (PDF, email, portal)">
              <input type="url" value={quote.doc_url} onChange={(e) => onChange({ doc_url: e.target.value })} style={txt()} placeholder="https://…" />
            </Field>
            <Field label="Notes">
              <textarea
                value={quote.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                rows={3}
                style={{ ...txt(), resize: "vertical", fontWeight: 500, lineHeight: 1.5 }}
                placeholder="Exclusions, allowances, timeline, what he said…"
              />
            </Field>
          </div>
        </div>
      )}
    </DetailDrawer>
  );
}

function LineRow({ line, onChange, onDelete }) {
  const ext = Math.round((line.quantity || 0) * (line.unit_price_cents || 0));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 96px auto 26px", gap: 6, alignItems: "center" }}>
      <input
        type="text"
        value={line.description}
        onChange={(e) => onChange({ description: e.target.value })}
        style={{ ...txt(), fontWeight: 600 }}
        placeholder="Description"
      />
      <input
        type="number"
        min="0"
        step="any"
        value={line.quantity}
        onChange={(e) => onChange({ quantity: Math.max(0, Number(e.target.value) || 0) })}
        style={{ ...txt(), textAlign: "right", fontWeight: 600 }}
        aria-label="Quantity"
      />
      <MoneyInput value={line.unit_price_cents} onChange={(v) => onChange({ unit_price_cents: v })} />
      <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", textAlign: "right", color: COLORS.textMuted, whiteSpace: "nowrap", minWidth: 64 }}>
        {fmtUsd(ext)}
      </span>
      <DelBtn onClick={onDelete} />
    </div>
  );
}
