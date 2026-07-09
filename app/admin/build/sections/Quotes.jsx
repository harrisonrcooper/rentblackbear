"use client";

// Contractor quotes and bids (brief section 6.9).
//
// Collect what each builder bid, grouped by the job, and compare like-for-like
// bids side by side. The one job here that a spreadsheet does badly: catching
// when a builder's stated total disagrees with his own line items. We show both
// numbers in red rather than silently trusting one — a transposed digit on a
// six-figure bid is a five-figure surprise later.
//
// The homeowner never types the word "scope"; he thinks in jobs — framing,
// roofing, plumbing. The stored field is still `scope` for continuity, but
// every label he reads says "job".
//
// All comparison math lives in lib/build/quotes.ts; this file is presentation
// and wiring only. Money is integer cents end to end.

import { useEffect, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, btn,
  Icon, ICON, fmtUsd,
  Card, Field, txt, MoneyInput, DelBtn, AddBtn, AutoTextarea,
  SectionHead, Chip, StatStrip, fmtBuildDate, SelectPill,
  DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";
import { useIsMobile } from "../../budget/lib/responsive";
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

const JOB_LABEL = (scope) => (scope || "").trim() || "Untitled job";

export default function QuotesSection({ state, setField, addRow, updRow, delRow }) {
  const quotes = state.quotes;
  const isMobile = useIsMobile();
  const [openId, setOpenId] = useState(null);
  const openQuote = quotes.find((q) => q.id === openId) || null;

  const groups = [...byScope(quotes).entries()];

  // Adding a bid drops the user straight into it to fill it in — no hunting for
  // a blank "New bid" row in a table. addRow appends, so the newest visible row
  // is last; open it once React has committed the new state.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = quotes[quotes.length - 1];
    if (last) setOpenId(last.id);
  }, [quotes]);

  function accept(id) {
    const accepted = quotes.find((q) => q.id === id);
    if (!accepted) return;

    // acceptQuote returns the whole array with the target accepted and its
    // same-job siblings declined; write it back atomically as one field set so
    // no intermediate render shows two accepted bids in a job.
    setField("quotes", acceptQuote(quotes, id));

    const line = budgetLineFor(accepted);

    // One budget line per scope, not one per click. Accepting bid A and then a
    // cheaper bid B for the same scope used to leave A's line behind, so the
    // budget silently counted the job twice.
    const existing = (state.costs || []).find(
      (c) => c.group === "Bids" && c.label.startsWith(`${accepted.scope} — `),
    );
    if (existing) updRow("costs", existing.id, line);
    else addRow("costs", { group: "Bids", in_basis: true, actual_cents: 0, ...line });

    // The winning contractor is someone you will call. Don't make him retype the
    // name he just chose.
    const name = (accepted.vendor || "").trim();
    const known = (state.team || []).some(
      (t) => (t.name || "").trim().toLowerCase() === name.toLowerCase(),
    );
    if (name && !known) {
      addRow("team", { role: accepted.scope || "Contractor", name, contact: "", notes: `Won the ${accepted.scope || "bid"} on ${fmtBuildDate(accepted.date) || "an unrecorded date"}.` });
    }
  }

  function addBid(scope) {
    wantNewest.current = true;
    addRow("quotes", {
      vendor: "", scope: scope || "", date: null, status: "requested",
      total_cents: 0, lines: [], doc_url: "", notes: "",
    });
  }

  const totalBids = quotes.length;
  const decided = quotes.filter((q) => q.status === "accepted").length;
  const mismatches = quotes.filter(hasLineMismatch).length;

  if (totalBids === 0) {
    return (
      <>
        <SectionHead title="Quotes & Bids" note="Gather bids for each job and compare them side by side" />
        <EmptyState onAdd={() => addBid("")} />
        <QuoteDrawer
          quote={openQuote}
          isMobile={isMobile}
          onClose={() => setOpenId(null)}
          onChange={(patch) => openQuote && updRow("quotes", openQuote.id, patch)}
          onDelete={() => { if (openQuote) { delRow("quotes", openQuote.id); setOpenId(null); } }}
          onAccept={() => openQuote && accept(openQuote.id)}
        />
      </>
    );
  }

  return (
    <>
      <SectionHead
        title="Quotes & Bids"
        note={`${totalBids} ${totalBids === 1 ? "bid" : "bids"} across ${groups.length} ${groups.length === 1 ? "job" : "jobs"}`}
      />

      <StatStrip items={[
        ["Bids", String(totalBids), COLORS.text],
        ["Jobs", String(groups.length), COLORS.text],
        ["Accepted", String(decided), decided ? COLORS.green : COLORS.textFaint],
        ["Totals that don't add up", String(mismatches), mismatches ? COLORS.red : COLORS.textFaint],
      ]} />

      {groups.map(([scope, bids]) => (
        <ScopeGroup
          key={scope}
          scope={scope}
          bids={bids}
          isMobile={isMobile}
          onOpen={setOpenId}
          onAccept={accept}
          onAddBid={() => addBid(scope)}
        />
      ))}

      <div style={{ marginTop: 2 }}>
        <AddBtn label="Add a bid for a different job" onClick={() => addBid("")} />
      </div>

      <QuoteDrawer
        quote={openQuote}
        isMobile={isMobile}
        onClose={() => setOpenId(null)}
        onChange={(patch) => openQuote && updRow("quotes", openQuote.id, patch)}
        onDelete={() => { if (openQuote) { delRow("quotes", openQuote.id); setOpenId(null); } }}
        onAccept={() => openQuote && accept(openQuote.id)}
      />
    </>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
      <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
        <Icon d={ICON.scales} size={24} color={ACCENT} />
      </div>
      <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Compare your bids</h3>
      <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 8px", maxWidth: 400 }}>
        Add what each contractor bid for a job — framing, roofing, plumbing. Two or
        more bids for the same job line up side by side, with the lowest marked and
        the gap between them worked out for you.
      </p>
      <p style={{ fontSize: 12.5, color: COLORS.textFaint, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 400 }}>
        Enter each bid&rsquo;s line items and we&rsquo;ll flag any whose numbers
        don&rsquo;t add up to the total the builder wrote.
      </p>
      <AddBtn label="Add your first bid" onClick={onAdd} />
    </div>
  );
}

function ScopeGroup({ scope, bids, isMobile, onOpen, onAccept, onAddBid }) {
  const lowest = lowestIn(bids);
  const spread = spreadCents(bids);
  const accepted = acceptedIn(bids);
  const liveCount = bids.filter((b) => b.status !== "declined").length;
  const comparable = liveCount >= 2;
  const sub = accepted
    ? "Decided"
    : comparable
      ? `${liveCount} bids · ${fmtUsd(spread)} apart`
      : `${bids.length} ${bids.length === 1 ? "bid" : "bids"}`;

  const rows = bids.map((q) => ({
    quote: q,
    isLowestLive: comparable && q.status !== "declined" && effectiveTotalCents(q) === lowest,
  }));

  return (
    <Card title={JOB_LABEL(scope)} sub={sub}>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
          {rows.map(({ quote, isLowestLive }) => (
            <BidCard
              key={quote.id}
              quote={quote}
              lowest={lowest}
              isLowestLive={isLowestLive}
              onOpen={() => onOpen(quote.id)}
              onAccept={() => onAccept(quote.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: "auto", margin: "0 -4px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                {["Contractor", "Date", "Total", "Vs lowest", "", ""].map((h, i) => (
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
              {rows.map(({ quote, isLowestLive }) => (
                <BidRow
                  key={quote.id}
                  quote={quote}
                  lowest={lowest}
                  isLowestLive={isLowestLive}
                  onOpen={() => onOpen(quote.id)}
                  onAccept={() => onAccept(quote.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 4 }}>
        <AddBtn label="Add another bid for this job" onClick={onAddBid} />
      </div>
    </Card>
  );
}

// Shared derivation so the desktop row and mobile card can never disagree.
function bidView(quote, lowest) {
  const total = effectiveTotalCents(quote);
  const declined = quote.status === "declined";
  return {
    total,
    declined,
    mismatch: hasLineMismatch(quote),
    // Delta only means something when there's a live lowest to measure against
    // and this bid is itself in the running.
    delta: lowest != null && !declined ? total - lowest : null,
  };
}

function DeltaText({ delta }) {
  if (delta == null) return "—";
  if (delta === 0) return "lowest";
  return `${fmtUsd(delta)} more`;
}

function LowestMark({ show }) {
  if (!show) return null;
  return (
    <span title="Lowest bid" style={{ lineHeight: 0, color: COLORS.green, flexShrink: 0 }}>
      <Icon d={ICON.check} size={14} color={COLORS.green} />
    </span>
  );
}

function MismatchChip({ quote }) {
  return (
    <Chip tone="red">
      Line items add to {fmtUsd(linesTotalCents(quote))}, not {fmtUsd(quote.total_cents)}
    </Chip>
  );
}

function BidRow({ quote, lowest, isLowestLive, onOpen, onAccept }) {
  const { total, declined, mismatch, delta } = bidView(quote, lowest);

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
          <LowestMark show={isLowestLive} />
          <span>{quote.vendor || "Unnamed contractor"}</span>
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
            <MismatchChip quote={quote} />
          </div>
        )}
      </td>

      <td style={{ padding: "9px 8px", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", color: COLORS.textMuted }}>
        <DeltaText delta={delta} />
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

// The same bid, stacked for a phone. A table that scrolls sideways on a 390px
// screen is a table nobody reads — so on mobile every bid is a card.
function BidCard({ quote, lowest, isLowestLive, onOpen, onAccept }) {
  const { total, declined, mismatch, delta } = bidView(quote, lowest);

  return (
    <div
      style={{
        border: `1px solid ${isLowestLive ? COLORS.green : COLORS.border}`,
        borderRadius: 12, background: COLORS.surface, overflow: "hidden",
        opacity: declined ? 0.6 : 1,
      }}
    >
      <button
        onClick={onOpen}
        style={{
          display: "block", width: "100%", textAlign: "left", cursor: "pointer",
          background: "transparent", border: "none", padding: "12px 13px 2px", fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            <LowestMark show={isLowestLive} />
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {quote.vendor || "Unnamed contractor"}
            </span>
          </span>
          <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: isLowestLive ? COLORS.green : COLORS.text, flexShrink: 0 }}>
            {fmtUsd(total)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          <Chip tone={STATUS_TONE[quote.status]}>{STATUS_LABEL[quote.status]}</Chip>
          {quote.date && <Chip>{fmtBuildDate(quote.date)}</Chip>}
          {delta != null && (
            <span style={{ fontSize: 11.5, fontWeight: 600, color: delta === 0 ? COLORS.green : COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
              {delta === 0 ? "Lowest bid" : `${fmtUsd(delta)} more than lowest`}
            </span>
          )}
        </div>

        {mismatch && (
          <div style={{ marginTop: 8 }}>
            <MismatchChip quote={quote} />
          </div>
        )}
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 13px 12px" }}>
        {quote.status === "accepted" ? (
          <Chip tone="green">Accepted</Chip>
        ) : declined ? (
          <span style={{ fontSize: 12, color: COLORS.textFaint }}>Declined</span>
        ) : (
          <button onClick={onAccept} style={{ ...btn("ghost"), padding: "8px 16px" }}>
            Accept this bid
          </button>
        )}
        <button
          onClick={onOpen}
          style={{ ...btn("ghost"), padding: "8px 12px", color: COLORS.textMuted }}
        >
          Open <Icon d={ICON.chevR} size={13} />
        </button>
      </div>
    </div>
  );
}

function QuoteDrawer({ quote, isMobile, onClose, onChange, onDelete, onAccept }) {
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
      title={quote ? (quote.vendor || "Unnamed contractor") : ""}
      footer={quote && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <button onClick={onDelete} style={{ ...btn("ghost"), color: COLORS.red }}>
            <Icon d={ICON.x} size={13} /> Delete bid
          </button>
          {quote.status !== "accepted" && quote.status !== "declined" && (
            <button onClick={onAccept} style={{ ...btn("ghost"), color: COLORS.green }}>
              <Icon d={ICON.check} size={14} /> Accept this bid
            </button>
          )}
        </div>
      )}
    >
      {quote && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            <Field label="Contractor">
              <input type="text" value={quote.vendor} onChange={(e) => onChange({ vendor: e.target.value })} style={txt()} placeholder="Who gave this bid" />
            </Field>
            <Field label="Job this bid is for">
              <input type="text" value={quote.scope} onChange={(e) => onChange({ scope: e.target.value })} style={txt()} placeholder="Framing, roofing, plumbing…" />
            </Field>
            <Field label="Date of bid">
              <DateField value={quote.date} onChange={(v) => onChange({ date: v })} ariaLabel="Date of bid" />
            </Field>
            <Field label="Status">
              <SelectPill value={quote.status} options={STATUS_ORDER.map((v) => ({ value: v, label: STATUS_LABEL[v], tone: STATUS_TONE[v] || "neutral" }))} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={132} />
            </Field>
          </div>

          <Field label="Total the builder wrote at the bottom">
            <MoneyInput value={quote.total_cents} onChange={(v) => onChange({ total_cents: v })} />
          </Field>

          {mismatch && (
            <div style={{ margin: "-4px 0 14px", display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 11px", background: COLORS.redBg, borderRadius: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.red, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.5 }}>
                His line items add to <strong style={{ fontVariantNumeric: "tabular-nums" }}>{fmtUsd(lineTotal)}</strong>, but he wrote{" "}
                <strong style={{ fontVariantNumeric: "tabular-nums" }}>{fmtUsd(quote.total_cents)}</strong> — off by{" "}
                <strong style={{ fontVariantNumeric: "tabular-nums" }}>{fmtUsd(Math.abs(lineTotal - quote.total_cents))}</strong>. Check it before you sign.
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "18px 0 10px" }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "-0.01em" }}>Line items</span>
            {(quote.lines || []).length > 0 && (
              <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>
                These add to <strong style={{ color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(lineTotal)}</strong>
              </span>
            )}
          </div>

          {(quote.lines || []).length === 0 ? (
            <p style={{ margin: "0 0 10px", fontSize: 12.5, color: COLORS.textFaint, lineHeight: 1.5 }}>
              Optional. Add the builder&rsquo;s line items and we&rsquo;ll check his total against his own numbers.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quote.lines.map((l) => (
                <LineRow key={l.id} line={l} onChange={(p) => updLine(l.id, p)} onDelete={() => delLine(l.id)} />
              ))}
            </div>
          )}

          <AddBtn label="Add line item" onClick={addLine} />

          <div style={{ marginTop: 16 }}>
            <Field label="Link to the bid (PDF, email, portal)">
              <input type="url" value={quote.doc_url} onChange={(e) => onChange({ doc_url: e.target.value })} style={txt()} placeholder="https://…" />
            </Field>
            <div>
              <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
                Notes
              </span>
              <AutoTextarea
                value={quote.notes}
                onChange={(v) => onChange({ notes: v })}
                minRows={3}
                placeholder="Exclusions, allowances, timeline, what he said…"
              />
            </div>
          </div>
        </div>
      )}
    </DetailDrawer>
  );
}

// One line item, self-labeled so nobody has to guess which box is the quantity
// and which is the price. The line total is computed — never typed.
function LineRow({ line, onChange, onDelete }) {
  const ext = Math.round((line.quantity || 0) * (line.unit_price_cents || 0));
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, background: COLORS.surface, padding: "10px 11px 12px", display: "grid", gap: 9 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          value={line.description}
          onChange={(e) => onChange({ description: e.target.value })}
          style={{ ...txt(), fontWeight: 600, flex: 1, minWidth: 0 }}
          placeholder="What is this line? e.g. Labor, lumber, permit"
        />
        <DelBtn onClick={onDelete} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" }}>
        <MiniField label="Quantity">
          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={Number.isFinite(line.quantity) ? line.quantity : ""}
            onChange={(e) => onChange({ quantity: Math.max(0, Number(e.target.value) || 0) })}
            style={{ ...txt(), textAlign: "right", fontWeight: 600 }}
            aria-label="Quantity"
          />
        </MiniField>
        <MiniField label="Price each">
          <MoneyInput value={line.unit_price_cents} onChange={(v) => onChange({ unit_price_cents: v })} />
        </MiniField>
        <div style={{ textAlign: "right", paddingBottom: 6, minWidth: 72 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 3 }}>
            Line total
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: COLORS.text, whiteSpace: "nowrap" }}>
            {fmtUsd(ext)}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniField({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 4 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
