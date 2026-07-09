"use client";

// Documents section.

import { COLORS, FONT, Icon, ACCENT, Card, txt, DelBtn, AddBtn, SelectPill, optionsFrom } from "../ui";
import { EXTERNAL_ICON } from "./_common";

const DOC_CATEGORY_ORDER = [
  "Plans & drawings", "Permits & approvals", "Survey & site",
  "Contracts & bids", "Financing", "Insurance & warranty", "Other",
];

function DocumentRow({ doc, onChange, onDelete }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10, display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={doc.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Document name" style={{ ...txt(), flex: 1, fontWeight: 700 }} />
        <SelectPill value={doc.category} options={optionsFrom(DOC_CATEGORY_ORDER)} onChange={(category) => onChange({ category })} ariaLabel="Category" minWidth={150} />
        <DelBtn onClick={onDelete} />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={doc.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="Paste a link — Drive, Dropbox, builder portal, county site…" style={{ ...txt(), flex: 1 }} />
        {doc.url ? (
          <a href={doc.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, padding: "8px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}>
            Open <Icon d={EXTERNAL_ICON} size={12} color="#fff" />
          </a>
        ) : (
          <span style={{ fontSize: 11, color: COLORS.textFaint, flexShrink: 0, fontWeight: 600 }}>No link yet</span>
        )}
      </div>
    </div>
  );
}

export default function DocumentsSection({ state, addRow, updRow, delRow }) {
  const docs = state.documents || [];
  const withLink = docs.filter((d) => d.url).length;
  const cats = [...new Set(docs.map((d) => d.category))]
    .sort((a, b) => DOC_CATEGORY_ORDER.indexOf(a) - DOC_CATEGORY_ORDER.indexOf(b));
  return (
    <Card title="Document vault" sub={`${withLink}/${docs.length} linked`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        One home for every plan, permit, contract and warranty. Keep the file wherever it
        lives — Drive, Dropbox, your builder's portal — and paste the link here so it&apos;s never lost.
      </div>
      {cats.map((cat) => {
        const rows = docs.filter((d) => d.category === cat);
        const linked = rows.filter((d) => d.url).length;
        return (
          <div key={cat}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 4px 6px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase" }}>{cat}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>{linked}/{rows.length}</span>
            </div>
            {rows.map((d) => (
              <DocumentRow key={d.id} doc={d}
                onChange={(patch) => updRow("documents", d.id, patch)}
                onDelete={() => delRow("documents", d.id)} />
            ))}
          </div>
        );
      })}
      <AddBtn label="Add document" onClick={() => addRow("documents", { name: "New document", category: "Other", url: "" })} />
    </Card>
  );
}
