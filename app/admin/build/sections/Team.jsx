"use client";

// Team & vendors.
//
// The whole job of this screen on a phone: reach a person in one tap. So the
// number a vendor is stored with is turned into live Call / Text / WhatsApp /
// Email actions right on the card — no copying a number into the dialer, no
// hunting. The Charlie Hartwig advice thread and any quotes live in Notes,
// which grows to fit whatever gets pasted in.

import { useEffect, useRef, useState } from "react";

import { COLORS, FONT, btn, Icon, ICON, txt, AddBtn, AutoTextarea, SectionHead, EmptyState } from "../ui";
import DetailDrawer from "../DetailDrawer";

// A phone icon and a chat icon aren't in the shared set; the shared <Icon>
// takes any Lucide path directly, which is the sanctioned way to add one.
const PHONE_PATH =
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z";
const CHAT_PATH =
  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";

// Pull a callable phone and a mailable email out of one free-text field, so a
// vendor stored as "+86 138 0013 8000 / li@factory.cn" lights up both.
const EMAIL_RE = /[^\s,;/|<>()]+@[^\s,;/|<>()]+\.[^\s,;/|<>()]+/;

function extractEmail(raw) {
  const m = String(raw || "").match(EMAIL_RE);
  return m ? m[0] : "";
}

function extractPhone(raw) {
  const withoutEmail = String(raw || "").replace(new RegExp(EMAIL_RE, "g"), " ");
  const m = withoutEmail.match(/\+?\d[\d\s().-]{6,}\d/);
  return m ? m[0].trim() : "";
}

// tel:/sms: tolerate a leading +; wa.me wants digits only.
const dialDigits = (phone) => phone.replace(/[^\d+]/g, "");
const waDigits = (phone) => phone.replace(/\D/g, "");

function ActionPill({ href, iconPath, label, tone = "neutral", ariaLabel }) {
  const primary = tone === "primary";
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, minHeight: 38,
        padding: "8px 13px", borderRadius: 10, textDecoration: "none",
        fontFamily: FONT, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
        border: `1px solid ${primary ? COLORS.accent : COLORS.borderStrong}`,
        background: primary ? COLORS.accentSoft : COLORS.surface,
        color: primary ? COLORS.accent : COLORS.text,
      }}
    >
      <Icon d={iconPath} size={15} color={primary ? COLORS.accent : COLORS.textMuted} />
      {label}
    </a>
  );
}

function ContactActions({ contact, onNeedNumber }) {
  const phone = extractPhone(contact);
  const email = extractEmail(contact);

  if (!phone && !email) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNeedNumber(); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, minHeight: 38,
          padding: "8px 13px", borderRadius: 10, cursor: "pointer",
          border: `1px dashed ${COLORS.borderStrong}`, background: COLORS.surface,
          fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: COLORS.textFaint,
        }}
      >
        <Icon d={ICON.plus} size={14} color={COLORS.textFaint} />
        Add a number
      </button>
    );
  }

  return (
    <>
      {phone && (
        <ActionPill href={`tel:${dialDigits(phone)}`} iconPath={PHONE_PATH} label="Call" tone="primary" ariaLabel={`Call ${phone}`} />
      )}
      {phone && (
        <ActionPill href={`sms:${dialDigits(phone)}`} iconPath={CHAT_PATH} label="Text" ariaLabel={`Text ${phone}`} />
      )}
      {phone && (
        <ActionPill href={`https://wa.me/${waDigits(phone)}`} iconPath={CHAT_PATH} label="WhatsApp" ariaLabel={`Message ${phone} on WhatsApp`} />
      )}
      {email && (
        <ActionPill href={`mailto:${email}`} iconPath={ICON.envelope} label="Email" tone={phone ? "neutral" : "primary"} ariaLabel={`Email ${email}`} />
      )}
    </>
  );
}

function VendorCard({ vendor, onEdit }) {
  const name = vendor.name?.trim() || "New vendor";
  const role = vendor.role?.trim();

  return (
    <div
      data-item-id={vendor.id}
      style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", minWidth: 0,
      }}
    >
      <button
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8,
          textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
          padding: 0, fontFamily: FONT, width: "100%",
        }}
      >
        <span style={{ minWidth: 0 }}>
          <span style={{
            display: "block", fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {name}
          </span>
          <span style={{ display: "block", fontSize: 12, color: COLORS.textFaint, marginTop: 1 }}>
            {role || "Tap to name their trade"}
          </span>
        </span>
        <Icon d={ICON.edit} size={15} color={COLORS.textFaint} />
      </button>

      {vendor.notes?.trim() && (
        <p style={{
          fontSize: 12.5, color: COLORS.textMuted, margin: "10px 0 0", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {vendor.notes}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <ContactActions contact={vendor.contact} onNeedNumber={onEdit} />
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`, borderRadius: 14, background: COLORS.surface,
      padding: "34px 22px", textAlign: "center", maxWidth: 440, margin: "8px auto 0",
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, margin: "0 auto 14px",
        background: COLORS.accentSoft, display: "grid", placeItems: "center",
      }}>
        <Icon d={ICON.family} size={22} color={COLORS.accent} />
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>
        Your build crew, one tap away
      </div>
      <p style={{ fontSize: 13, color: COLORS.textFaint, lineHeight: 1.55, margin: "8px auto 18px", maxWidth: 320 }}>
        Add each contractor and supplier with their number. It turns into a Call,
        Text, or WhatsApp button right on their card — even for overseas suppliers.
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AddBtn label="Add your first vendor" onClick={onAdd} />
      </div>
    </div>
  );
}

function DrawerField({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 15 }}>
      <span style={{
        display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em",
        textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 6,
      }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export default function TeamSection({ state, addRow, updRow, delRow }) {
  const [openId, setOpenId] = useState(null);
  const [pendingOpen, setPendingOpen] = useState(false);
  const knownIds = useRef(new Set(state.team.map((t) => t.id)));

  // addRow doesn't hand back the new id, so watch for the row that appears and
  // drop the user straight into editing it — Add is one tap, not two.
  useEffect(() => {
    const ids = state.team.map((t) => t.id);
    if (pendingOpen) {
      const fresh = ids.find((id) => !knownIds.current.has(id));
      if (fresh) { setOpenId(fresh); setPendingOpen(false); }
    }
    knownIds.current = new Set(ids);
  }, [state.team, pendingOpen]);

  const vendor = state.team.find((t) => t.id === openId) || null;
  const patch = (p) => vendor && updRow("team", vendor.id, p);

  function addVendor() {
    addRow("team", { role: "", name: "", contact: "", notes: "" });
    setPendingOpen(true);
  }

  function close() { setOpenId(null); }

  return (
    <>
      <SectionHead title="Team & Vendors" note={`${state.team.length} ${state.team.length === 1 ? "contact" : "contacts"} · tap to call or message`} />

      {state.team.length === 0 ? (
        <EmptyState onAdd={addVendor} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(258px, 1fr))", gap: 12 }}>
            {state.team.map((t) => (
              <VendorCard key={t.id} vendor={t} onEdit={() => setOpenId(t.id)} />
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <AddBtn label="Add vendor" onClick={addVendor} />
          </div>
        </>
      )}

      <DetailDrawer
        open={Boolean(vendor)}
        onClose={close}
        kind={vendor?.role?.trim() || "Vendor"}
        title={vendor?.name?.trim() || "New vendor"}
      >
        {vendor && (
          <>
            <DrawerField label="Name">
              <input
                value={vendor.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="Who is this?"
                style={txt()}
                autoFocus={!vendor.name}
              />
            </DrawerField>

            <DrawerField label="Trade or role">
              <input
                value={vendor.role}
                onChange={(e) => patch({ role: e.target.value })}
                placeholder="Electrician, tile supplier, architect…"
                style={txt()}
              />
            </DrawerField>

            <DrawerField label="Phone or email">
              <input
                value={vendor.contact}
                onChange={(e) => patch({ contact: e.target.value })}
                placeholder="Phone, email, or both"
                style={txt()}
              />
              <span style={{ display: "block", fontSize: 11.5, color: COLORS.textFaint, marginTop: 6, lineHeight: 1.5 }}>
                A number here becomes Call, Text, and WhatsApp buttons. An email becomes an Email button.
              </span>
            </DrawerField>

            <DrawerField label="Notes">
              <AutoTextarea
                value={vendor.notes || ""}
                onChange={(v) => patch({ notes: v })}
                minRows={4}
                placeholder="Advice, quotes, anything said about this vendor…"
              />
            </DrawerField>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => { delRow("team", vendor.id); close(); }} style={btn("ghost")}>
                <Icon d={ICON.x} size={13} /> Remove vendor
              </button>
            </div>
          </>
        )}
      </DetailDrawer>
    </>
  );
}
