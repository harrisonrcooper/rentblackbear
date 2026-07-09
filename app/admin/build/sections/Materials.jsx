"use client";

// Materials & Products — the catalogue of everything going into the house
// (brief §6.5). The load-bearing feature is side-by-side comparison: rows that
// share a compare_group are alternatives for ONE decision, laid out so the
// cheapest option is flagged and one tap crowns a winner. On a phone that
// comparison becomes a stack of option cards — never a table you have to
// scroll sideways to read.
//
// All arithmetic lives in lib/build/materials.ts and is unit-tested there; this
// file is presentation and wiring only. State is mutated exclusively through the
// addRow / updRow / delRow helpers — never by rewriting the array here.

import { useMemo, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, btn, Icon, ICON, fmtUsd,
  Card, Field, txt, MoneyInput, AddBtn, Chip, SectionHead, StatStrip, SelectPill, AutoTextarea,
} from "../ui";
import DetailDrawer from "../DetailDrawer";
import { useIsMobile } from "../../budget/lib/responsive";
import {
  STATUS_ORDER, STATUS_LABEL, statusTone, extendedCents, groupsOf,
  chosenIn, cheapestIn, chooseWinner, totalCents,
} from "@/lib/build/materials";

const EXTERNAL_ICON = "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3";
const SEARCH_ICON = "M21 21l-4.35-4.35 M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z";
const UNCATEGORIZED = "Uncategorized";

// Chip palette, mirrored from the shared <Chip> so a *selectable* status pill
// can fill with the same tone when active. Colour still means the same thing.
const TONE = {
  neutral: [COLORS.textMuted, COLORS.borderStrong, COLORS.surface],
  accent: [COLORS.accent, COLORS.accent, COLORS.accentSoft],
  green: [COLORS.green, COLORS.green, COLORS.greenBg],
  amber: [COLORS.amber, COLORS.amber, COLORS.amberBg],
  red: [COLORS.red, COLORS.red, COLORS.redBg],
};

function newMaterial(category) {
  return {
    name: "New material", category: category && category !== "all" ? category : "",
    room_ids: [], spec: "", vendor: "", unit_price_cents: 0, quantity: 1, unit: "each",
    lead_time: "", status: "idea", url: "", photo_url: "", compare_group: "", is_chosen: false, notes: "",
  };
}

// "12 each × $40.00" — spelled out so the total on the right is never a number
// the user has to trust blindly. Hidden when the quantity is one (nothing to
// multiply) so it doesn't add noise to the common case.
function qtyNote(m) {
  const qty = Number(m.quantity) || 0;
  if (qty === 1) return null;
  const unit = (m.unit || "each").trim() || "each";
  return `${qty} ${unit} × ${fmtUsd(Number(m.unit_price_cents) || 0)}`;
}

// A filter is a dropdown; SelectPill is the planner's dropdown.
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 128, flex: "1 1 128px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>{label}</span>
      <SelectPill value={value} options={options} onChange={onChange} ariaLabel={label} minWidth={128} />
    </div>
  );
}

// A row of selectable status pills — the native-free way to set status.
function StatusPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {STATUS_ORDER.map((s) => {
        const on = s === value;
        const [fg, bd, bg] = on ? TONE[statusTone(s)] : [COLORS.textMuted, COLORS.border, COLORS.surface];
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={on}
            style={{
              border: `1px solid ${bd}`, background: bg, color: fg, borderRadius: 999,
              padding: "5px 11px", fontSize: 11.5, fontWeight: on ? 700 : 600, cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {STATUS_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}

// A catalogue line — click to open the full editor. The item's own total on the
// right.
function MaterialCard({ m, roomNames, onOpen }) {
  const meta = [m.vendor, `${m.quantity} ${m.unit || ""}`.trim()].filter(Boolean).join(" · ");
  const rooms = (m.room_ids || []).map((id) => roomNames.get(id)).filter(Boolean);
  return (
    <button
      data-item-id={m.id}
      onClick={onOpen}
      style={{
        textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || "Material"}</span>
          {meta && <span style={{ display: "block", fontSize: 11.5, color: COLORS.textFaint, marginTop: 1 }}>{meta}</span>}
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{fmtUsd(extendedCents(m))}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <Chip tone={statusTone(m.status)}>{STATUS_LABEL[m.status]}</Chip>
        {m.lead_time && <Chip>{m.lead_time}</Chip>}
        {rooms.slice(0, 2).map((r) => <Chip key={r}>{r}</Chip>)}
        {rooms.length > 2 && <Chip>+{rooms.length - 2}</Chip>}
      </div>
    </button>
  );
}

// One option inside a comparison, as a card — the phone-friendly row. Big total,
// cheapest flagged, one full-width tap to pick it.
function CompareOption({ m, cheapest, multiple, onOpen, onChoose }) {
  const win = m.is_chosen;
  const note = qtyNote(m);
  const details = [["Vendor", m.vendor], ["Spec", m.spec], ["Lead time", m.lead_time]]
    .filter(([, v]) => v && String(v).trim());
  return (
    <div style={{
      border: `1px solid ${win ? ACCENT : COLORS.border}`, background: win ? COLORS.accentSoft : COLORS.surface,
      borderRadius: 12, padding: 13, display: "flex", flexDirection: "column", gap: 9,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <button
          onClick={() => onOpen(m.id)}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: FONT, textAlign: "left", color: COLORS.text, fontSize: 14, fontWeight: 700, minWidth: 0 }}
        >
          {m.name || "Option"}
        </button>
        {win && <Chip tone="accent">Chosen</Chip>}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 21, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: cheapest && multiple ? COLORS.green : COLORS.text }}>{fmtUsd(extendedCents(m))}</span>
        {cheapest && multiple && <Chip tone="green">Cheapest</Chip>}
      </div>
      {note && <div style={{ fontSize: 11.5, color: COLORS.textFaint, marginTop: -4 }}>{note}</div>}

      {details.map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12.5 }}>
          <span style={{ color: COLORS.textFaint, fontWeight: 600, flexShrink: 0 }}>{l}</span>
          <span style={{ color: COLORS.textMuted, textAlign: "right", minWidth: 0 }}>{v}</span>
        </div>
      ))}

      {win ? (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 2, padding: "8px 12px", borderRadius: 10, border: `1px solid ${COLORS.green}`, background: COLORS.greenBg, color: COLORS.green, fontSize: 12.5, fontWeight: 700 }}>
          <Icon d={ICON.check} size={14} color={COLORS.green} /> Winner
        </span>
      ) : (
        <button onClick={() => onChoose(m.id)} style={{ ...btn("ghost"), marginTop: 2, justifyContent: "center", width: "100%" }}>Choose this</button>
      )}
    </div>
  );
}

// The comparison for one decision. Alternatives side by side (a table on a wide
// screen, a stack of option cards on a phone), cheapest flagged, one tap to
// choose a winner.
function CompareCard({ group, cheapestId, stacked, onOpen, onChoose }) {
  const chosen = chosenIn(group);
  const key = (group[0].compare_group || "").trim();
  const overpay = chosen && cheapestId && chosen.id !== cheapestId
    ? extendedCents(chosen) - extendedCents(group.find((m) => m.id === cheapestId))
    : 0;

  return (
    <Card title={key || "Comparison"} sub={chosen ? "Winner picked" : `${group.length} options · pick one`}>
      {stacked ? (
        <div style={{ display: "grid", gap: 10, paddingTop: 4 }}>
          {group.map((m) => (
            <CompareOption key={m.id} m={m} cheapest={m.id === cheapestId} multiple={group.length > 1} onOpen={onOpen} onChoose={onChoose} />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: "auto", margin: "0 -12px", padding: "0 12px" }}>
          <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontFamily: FONT }}>
            <thead>
              <tr>
                {["Option", "Vendor", "Spec", "Lead time", "Total", ""].map((h, i) => (
                  <th key={h || "act"} style={{
                    textAlign: i === 4 ? "right" : "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                    textTransform: "uppercase", color: COLORS.textFaint, padding: "4px 10px 8px", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.map((m) => {
                const win = m.is_chosen;
                const cheap = m.id === cheapestId;
                const note = qtyNote(m);
                return (
                  <tr key={m.id} style={{ background: win ? COLORS.accentSoft : "transparent", borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "9px 10px" }}>
                      <button
                        onClick={() => onOpen(m.id)}
                        style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: FONT, textAlign: "left", color: COLORS.text, fontSize: 13, fontWeight: 700 }}
                      >
                        {m.name || "Option"}
                      </button>
                      {win && <span style={{ marginLeft: 8, verticalAlign: "middle" }}><Chip tone="accent">Chosen</Chip></span>}
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 12.5, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{m.vendor || "—"}</td>
                    <td style={{ padding: "9px 10px", fontSize: 12.5, color: COLORS.textMuted, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.spec || "—"}</td>
                    <td style={{ padding: "9px 10px", fontSize: 12.5, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{m.lead_time || "—"}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: cheap && group.length > 1 ? COLORS.green : COLORS.text }}>{fmtUsd(extendedCents(m))}</span>
                      {cheap && group.length > 1 && (
                        <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.green }}>Cheapest</span>
                      )}
                      {note && <span style={{ display: "block", fontSize: 10.5, color: COLORS.textFaint, marginTop: 2 }}>{note}</span>}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", whiteSpace: "nowrap" }}>
                      {win ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: COLORS.green }}>
                          <Icon d={ICON.check} size={14} color={COLORS.green} /> Winner
                        </span>
                      ) : (
                        <button onClick={() => onChoose(m.id)} style={{ ...btn("ghost"), padding: "6px 12px" }}>Choose</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {overpay > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "8px 11px", background: COLORS.amberBg, borderRadius: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.amber, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: COLORS.text }}>
            The option you picked costs {fmtUsd(overpay)} more than the cheapest one. That&apos;s fine — just so you know.
          </span>
        </div>
      )}
    </Card>
  );
}

// The full editor for one material, hosted in the shared DetailDrawer.
function MaterialEditor({ m, rooms, categories, groupNames, patch, onDelete }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <Field label="Name">
        <input value={m.name} onChange={(e) => patch({ name: e.target.value })} style={txt()} placeholder="e.g. Shaker cabinet door" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <Field label="Category">
          <input value={m.category} list="material-categories" onChange={(e) => patch({ category: e.target.value })} style={txt()} placeholder="Cabinets" />
        </Field>
        <Field label="Vendor">
          <input value={m.vendor} onChange={(e) => patch({ vendor: e.target.value })} style={txt()} placeholder="Where you'd buy it" />
        </Field>
      </div>
      <datalist id="material-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>

      <Field label="Spec">
        <AutoTextarea value={m.spec} onChange={(v) => patch({ spec: v })} minRows={2} placeholder="Finish, dimensions, model number…" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 84px 84px", gap: 10, alignItems: "end" }}>
        <Field label="Unit price"><MoneyInput value={m.unit_price_cents} onChange={(v) => patch({ unit_price_cents: v })} /></Field>
        <Field label="Quantity">
          <input
            type="number" min="0" step="any" inputMode="decimal"
            value={Number.isFinite(m.quantity) ? m.quantity : ""}
            onChange={(e) => { const v = parseFloat(e.target.value); patch({ quantity: isNaN(v) || v < 0 ? 0 : v }); }}
            style={{ ...txt(), textAlign: "right", fontWeight: 700 }}
          />
        </Field>
        <Field label="Unit">
          <input value={m.unit} onChange={(e) => patch({ unit: e.target.value })} style={txt()} placeholder="each" />
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "-4px 2px 14px", fontSize: 12 }}>
        <span style={{ color: COLORS.textFaint, fontWeight: 600 }}>Total{qtyNote(m) ? ` · ${qtyNote(m)}` : ""}</span>
        <span style={{ fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(extendedCents(m))}</span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 6 }}>Status</span>
        <StatusPicker value={m.status} onChange={(s) => patch({ status: s })} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 6 }}>Rooms it goes in</span>
        {rooms.length === 0 ? (
          <p style={{ fontSize: 12, color: COLORS.textFaint, margin: 0 }}>Add rooms in Rooms &amp; Spaces first.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {rooms.map((r) => {
              const on = (m.room_ids || []).includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => patch({ room_ids: on ? (m.room_ids || []).filter((x) => x !== r.id) : [...(m.room_ids || []), r.id] })}
                  aria-pressed={on}
                  style={{
                    border: `1px solid ${on ? ACCENT : COLORS.border}`, background: on ? COLORS.accentSoft : COLORS.surface,
                    color: on ? ACCENT : COLORS.textMuted, borderRadius: 999, padding: "5px 11px",
                    fontSize: 11.5, fontWeight: on ? 700 : 600, cursor: "pointer", fontFamily: FONT,
                  }}
                >
                  {r.name || "Room"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Field label="Lead time">
        <input value={m.lead_time} onChange={(e) => patch({ lead_time: e.target.value })} style={txt()} placeholder="8 weeks" />
      </Field>

      <Field label="Comparison group">
        <input value={m.compare_group} list="material-groups" onChange={(e) => patch({ compare_group: e.target.value })} style={txt()} placeholder="Name a decision to compare, e.g. Cabinet doors" />
      </Field>
      <datalist id="material-groups">{groupNames.map((g) => <option key={g} value={g} />)}</datalist>
      <p style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5, margin: "-6px 2px 14px" }}>
        Give two or more materials the same group name and they line up side by side so you can pick a winner.
      </p>

      <Field label="Product link">
        <div style={{ display: "flex", gap: 8 }}>
          <input value={m.url} onChange={(e) => patch({ url: e.target.value })} style={{ ...txt(), flex: 1, minWidth: 0 }} placeholder="https://…" />
          {m.url && (
            <a href={m.url} target="_blank" rel="noreferrer" aria-label="Open link" style={{ ...btn("ghost"), textDecoration: "none", flexShrink: 0 }}>
              <Icon d={EXTERNAL_ICON} size={15} />
            </a>
          )}
        </div>
      </Field>

      <Field label="Photo link">
        <input value={m.photo_url} onChange={(e) => patch({ photo_url: e.target.value })} style={txt()} placeholder="https://… image URL" />
      </Field>
      {m.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.photo_url} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12, border: `1px solid ${COLORS.border}`, marginBottom: 14 }} />
      )}

      <Field label="Notes">
        <AutoTextarea value={m.notes} onChange={(v) => patch({ notes: v })} minRows={3} placeholder="Quotes, caveats, follow-ups…" />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete material</button>
      </div>
    </div>
  );
}

export default function MaterialsSection({ state, addRow, updRow, delRow }) {
  const materials = state.materials || [];
  const rooms = state.rooms || [];
  const roomNames = useMemo(() => new Map(rooms.map((r) => [r.id, r.name])), [rooms]);
  const stacked = useIsMobile();

  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [fRoom, setFRoom] = useState("all");

  const categories = useMemo(
    () => [...new Set(materials.map((m) => (m.category || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [materials],
  );
  const groupNames = useMemo(() => [...groupsOf(materials).keys()], [materials]);

  const matches = (m) => {
    if (fStatus !== "all" && m.status !== fStatus) return false;
    if (fCat !== "all") {
      const c = (m.category || "").trim() || UNCATEGORIZED;
      if (c !== fCat) return false;
    }
    if (fRoom !== "all" && !(m.room_ids || []).includes(fRoom)) return false;
    if (q.trim()) {
      const hay = [m.name, m.vendor, m.spec, m.notes, m.category, m.compare_group].join(" ").toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  };

  const allGroups = useMemo(() => groupsOf(materials), [materials]);
  // A comparison (2+ options) is shown whole whenever any member passes the
  // filters — you can't compare alternatives if a room filter hides one.
  const multiGroups = [...allGroups.entries()].filter(([, g]) => g.length > 1);
  const shownGroups = multiGroups.filter(([, g]) => g.some(matches));
  const inMulti = new Set(multiGroups.flatMap(([, g]) => g.map((m) => m.id)));

  // Catalogue = everything not in a multi-option comparison, that passes filters.
  const catalogue = materials.filter((m) => !inMulti.has(m.id) && matches(m));
  const catByCategory = useMemo(() => {
    const map = new Map();
    for (const m of catalogue) {
      const c = (m.category || "").trim() || UNCATEGORIZED;
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(m);
    }
    return [...map.entries()].sort((a, b) => {
      if (a[0] === UNCATEGORIZED) return 1;
      if (b[0] === UNCATEGORIZED) return -1;
      return a[0].localeCompare(b[0]);
    });
  }, [catalogue]);

  const undecided = multiGroups.filter(([, g]) => !chosenIn(g)).length;
  const anyShown = shownGroups.length > 0 || catalogue.length > 0;
  const filtersActive = q.trim() || fCat !== "all" || fStatus !== "all" || fRoom !== "all";

  const openMaterial = materials.find((m) => m.id === openId) || null;
  const patch = (p) => openMaterial && updRow("materials", openMaterial.id, p);

  // The pure chooseWinner is the brain; we apply only the rows that changed.
  const choose = (id) => {
    const next = chooseWinner(materials, id);
    const byId = new Map(next.map((m) => [m.id, m]));
    for (const m of materials) {
      const n = byId.get(m.id);
      if (n && n.is_chosen !== m.is_chosen) updRow("materials", m.id, { is_chosen: n.is_chosen });
    }
  };

  const add = () => addRow("materials", newMaterial(fCat));

  const catOptions = [{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c, label: c }))];
  if (catalogue.some((m) => !(m.category || "").trim()) || materials.some((m) => !inMulti.has(m.id) && !(m.category || "").trim())) {
    catOptions.push({ value: UNCATEGORIZED, label: UNCATEGORIZED });
  }
  const statusOptions = [{ value: "all", label: "All statuses" }, ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))];
  const roomOptions = [{ value: "all", label: "All rooms" }, ...rooms.map((r) => ({ value: r.id, label: r.name || "Room" }))];

  // ── Empty state — the first (and often only) screen he'll see here ─────────
  if (materials.length === 0) {
    return (
      <>
        <SectionHead title="Materials" note="Everything going into the house — priced, sourced, compared" />
        <Card title="Start your catalogue">
          <div style={{ textAlign: "center", padding: "22px 16px 26px", maxWidth: 460, margin: "0 auto" }}>
            <div style={{ width: 46, height: 46, margin: "0 auto 14px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
              <Icon d={"M20 7h-9 M14 17H5 M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"} size={22} color={ACCENT} />
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, margin: "0 0 6px" }}>Catalogue every product</h3>
            <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 0 18px" }}>
              List each material with its price, vendor, lead time and the rooms it goes in. Give two or
              more the same comparison group and they line up side by side — cheapest flagged, one tap
              to pick the winner.
            </p>
            <AddBtn label="Add your first material" onClick={add} />
          </div>
        </Card>
      </>
    );
  }

  const itemWord = materials.length === 1 ? "item" : "items";

  return (
    <>
      <SectionHead title="Materials" note={`${materials.length} ${itemWord} · ${fmtUsd(totalCents(materials))} committed`} />

      <StatStrip items={[
        ["Committed so far", fmtUsd(totalCents(materials)), COLORS.text],
        ["Items", String(materials.length), COLORS.text],
        ["Comparisons", String(multiGroups.length), COLORS.text],
        ["Still to decide", String(undecided), undecided ? COLORS.amber : COLORS.green],
      ]} />

      {multiGroups.length > 0 && (
        <p style={{ fontSize: 12, color: COLORS.textFaint, lineHeight: 1.5, margin: "-2px 2px 14px" }}>
          <strong style={{ color: COLORS.textMuted }}>Committed so far</strong> adds up each item once. Inside a comparison,
          only the option you picked counts — the alternatives, and any comparison you haven&apos;t decided, aren&apos;t in this number yet.
        </p>
      )}

      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", margin: "4px 0 8px" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "2 1 200px", minWidth: 160 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>Search</span>
          <span style={{ position: "relative", display: "block" }}>
            <span style={{ position: "absolute", left: 9, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <Icon d={SEARCH_ICON} size={14} color={COLORS.textFaint} />
            </span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, vendor, spec…" style={{ ...txt(), paddingLeft: 30 }} />
          </span>
        </label>
        <FilterSelect label="Category" value={fCat} onChange={setFCat} options={catOptions} />
        <FilterSelect label="Status" value={fStatus} onChange={setFStatus} options={statusOptions} />
        <FilterSelect label="Room" value={fRoom} onChange={setFRoom} options={roomOptions} />
      </div>

      {!anyShown && (
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "22px 16px", textAlign: "center", color: COLORS.textMuted, fontSize: 13.5 }}>
          {filtersActive ? "Nothing matches these filters." : "No materials yet."}
        </div>
      )}

      {shownGroups.length > 0 && (
        <>
          <SectionHead title="Comparisons" note="Pick a winner for each decision" />
          {shownGroups.map(([key, g]) => (
            <CompareCard
              key={key}
              group={g}
              cheapestId={cheapestIn(g)?.id || null}
              stacked={stacked}
              onOpen={(id) => setOpenId(id)}
              onChoose={choose}
            />
          ))}
        </>
      )}

      {catByCategory.length > 0 && (
        <>
          <SectionHead title="Catalogue" note={`${catalogue.length} ${catalogue.length === 1 ? "item" : "items"}`} />
          {catByCategory.map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "2px 2px 8px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: ACCENT, textTransform: "uppercase" }}>{cat}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(items.reduce((s, m) => s + extendedCents(m), 0))}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                {items.map((m) => <MaterialCard key={m.id} m={m} roomNames={roomNames} onOpen={() => setOpenId(m.id)} />)}
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: 6 }}>
        <AddBtn label="Add material" onClick={add} />
      </div>

      <DetailDrawer
        open={Boolean(openMaterial)}
        onClose={() => setOpenId(null)}
        kind={openMaterial ? `Material${openMaterial.category ? ` · ${openMaterial.category}` : ""}` : ""}
        title={openMaterial?.name || ""}
      >
        {openMaterial && (
          <MaterialEditor
            key={openMaterial.id}
            m={openMaterial}
            rooms={rooms}
            categories={categories}
            groupNames={groupNames}
            patch={patch}
            onDelete={() => { delRow("materials", openMaterial.id); setOpenId(null); }}
          />
        )}
      </DetailDrawer>
    </>
  );
}
