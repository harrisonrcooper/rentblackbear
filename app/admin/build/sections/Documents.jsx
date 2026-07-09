"use client";

// Documents section.
//
// The only question this screen answers: which papers are on file, and which
// still need a link. So the list is sorted with the missing ones on top — the
// next thing to do is always the first thing he sees — and the header carries a
// single honest count. Category is kept (it feeds search) but demoted to a
// quiet chooser, because with ten documents nobody browses by category; they
// scan for the gap.

import { COLORS, FONT, Icon, ICON, ACCENT, ACCENT_SOFT, Card, txt, DelBtn, AddBtn, SelectPill, optionsFrom, Chip, EmptyState, btn } from "../ui";
import { EXTERNAL_ICON } from "./_common";

const DOC_CATEGORY_ORDER = [
  "Plans & drawings", "Permits & approvals", "Survey & site",
  "Contracts & bids", "Financing", "Insurance & warranty", "Other",
];

// The papers every custom-home build ends up needing. One tap lays the whole
// checklist down so he never has to invent a name — he just pastes links.
const STARTER_DOCS = [
  { name: "Architectural plans & drawings", category: "Plans & drawings" },
  { name: "Structural & engineering plans", category: "Plans & drawings" },
  { name: "Land survey & plat", category: "Survey & site" },
  { name: "Building permit", category: "Permits & approvals" },
  { name: "Certificate of occupancy", category: "Permits & approvals" },
  { name: "Builder contract", category: "Contracts & bids" },
  { name: "Construction loan documents", category: "Financing" },
  { name: "Builder's risk insurance policy", category: "Insurance & warranty" },
  { name: "Homeowner warranty", category: "Insurance & warranty" },
  { name: "Final lien waivers", category: "Contracts & bids" },
];

const CATEGORY_OPTIONS = optionsFrom(DOC_CATEGORY_ORDER);

function DocumentRow({ doc, onChange, onDelete }) {
  const onFile = Boolean(doc.url);
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={doc.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Document name" style={{ ...txt(), flex: 1, fontWeight: 700 }} />
        <DelBtn onClick={onDelete} />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input value={doc.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="Paste a link — Drive, Dropbox, builder portal, county site…" style={{ ...txt(), flex: 1, minWidth: 180 }} />
        {onFile && (
          <a href={doc.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: ACCENT, background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, padding: "7px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}>
            Open <Icon d={EXTERNAL_ICON} size={12} color={ACCENT} />
          </a>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        {onFile
          ? <Chip tone="green"><Icon d="M20 6L9 17l-5-5" size={12} color={COLORS.green} /> On file</Chip>
          : <Chip tone="neutral">No link yet</Chip>}
        <SelectPill value={doc.category} options={CATEGORY_OPTIONS} onChange={(category) => onChange({ category })} ariaLabel="Filed under" minWidth={150} />
      </div>
    </div>
  );
}

export default function DocumentsSection({ state, addRow, delRow, updRow }) {
  const docs = state.documents || [];
  const withLink = docs.filter((d) => d.url).length;
  const total = docs.length;
  const pct = total ? Math.round((withLink / total) * 100) : 0;

  const setup = () => STARTER_DOCS.forEach((d) => addRow("documents", { name: d.name, category: d.category, url: "" }));
  const addOne = () => addRow("documents", { name: "New document", category: "Other", url: "" });

  // Missing links float to the top: the next paper to chase is always first.
  // A copy keeps the original order stable underneath the status sort.
  const ordered = docs
    .map((d, i) => ({ d, i }))
    .sort((a, b) => (Boolean(a.d.url) - Boolean(b.d.url)) || (a.i - b.i))
    .map((x) => x.d);

  return (
    <Card title="Documents" sub={total ? `${withLink} of ${total} on file` : null}>
      {total === 0 ? (
        <EmptyState
          icon={ICON.fileText}
          title="Every plan, permit, contract and warranty, in one place."
          action={(
            <button onClick={setup} style={btn("primary")}>
              <Icon d={ICON.plus} size={14} color="#fff" />
              Start my document checklist
            </button>
          )}
          secondary={<AddBtn label="Add just one" onClick={addOne} />}
        >
          Leave each file wherever it already lives — Drive, Dropbox, your
          builder&apos;s portal, the county site — and keep a link here, so the paper
          you need is one tap away instead of buried in an inbox.
        
          {/* The preview the unify pass dropped. Naming the ten documents the
              button will create is what turns "Start my checklist" from a leap
              into a decision. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 14 }}>
            {STARTER_DOCS.map((d) => (
              <span key={d.name} style={{
                border: `1px solid ${COLORS.border}`, borderRadius: 999,
                padding: "3px 10px", fontSize: 11.5, fontWeight: 600,
                color: COLORS.textMuted, background: COLORS.surface, whiteSpace: "nowrap",
              }}>
                {d.name}
              </span>
            ))}
          </div>
        </EmptyState>
      ) : (
        <>
          <div style={{ padding: "4px 2px 12px" }}>
            <div style={{ height: 6, borderRadius: 3, background: COLORS.surfaceTint, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11.5, color: COLORS.textFaint, fontWeight: 600, marginTop: 6 }}>
              {withLink === total ? "Every document is linked and on file." : `${total - withLink} still need a link.`}
            </div>
          </div>

          {ordered.map((d) => (
            <DocumentRow key={d.id} doc={d}
              onChange={(patch) => updRow("documents", d.id, patch)}
              onDelete={() => delRow("documents", d.id)} />
          ))}

          <AddBtn label="Add document" onClick={addOne} />
        </>
      )}
    </Card>
  );
}
