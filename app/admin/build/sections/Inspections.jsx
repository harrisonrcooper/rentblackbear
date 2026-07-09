"use client";

// Inspections — the municipal sign-offs, in build order.
//
// A failed inspection legally stops the whole build, so it can never be a quiet
// red word in a list. Three things make it impossible to miss: a banner opens at
// the top of the section, the failed row opens itself, and its body spells out
// the single next move — log what the inspector flagged, then mark the
// re-inspection scheduled. Status labels and tones come from the shared
// INSPECTION_STATUSES, so a chip here can never drift from the same chip
// elsewhere.

import { useState } from "react";

import {
  COLORS, FONT, SERIF, btn, Icon, ICON, ACCENT,
  txt, Card, Chip, AddBtn, StatStrip, DelBtn, AutoTextarea, SelectPill,
  fmtBuildDate, INSPECTION_STATUSES,
  DateField} from "../ui";

// One source of truth for label + tone, keyed by value.
const STATUS = Object.fromEntries(INSPECTION_STATUSES.map((o) => [o.value, o]));

// The standard residential inspection sequence, in the order a build hits them.
// Seeding these is the whole reason the empty state has one button instead of a
// blank text field twelve times over. Every one is editable and removable after.
const STANDARD_INSPECTIONS = [
  "Temporary power and site",
  "Footing",
  "Foundation",
  "Under-slab plumbing",
  "Rough plumbing",
  "Rough electrical",
  "Rough mechanical (heating and cooling)",
  "Framing",
  "Insulation",
  "Drywall",
  "Final building",
  "Certificate of occupancy",
];

const blankInspection = (name = "New inspection") => ({
  name, date: null, status: "not_scheduled", inspector: "", notes: "",
});

function InspectionCard({ insp, onChange, onDelete, onCreatePunchItem }) {
  const failed = insp.status === "failed";
  // A failed row opens itself so the corrections and the re-schedule action are
  // in front of him the moment he lands on the section.
  const [open, setOpen] = useState(failed);
  const meta = STATUS[insp.status] || STATUS.not_scheduled;

  // Setting a date on an unscheduled inspection IS scheduling it — bump the
  // status in the same edit so he never has to do the second step by hand.
  const onDate = (date) =>
    onChange({ date, ...(date && insp.status === "not_scheduled" ? { status: "scheduled" } : {}) });

  return (
    <div style={{
      border: `1px solid ${failed ? COLORS.red : COLORS.border}`,
      borderRadius: 12, marginBottom: 10, overflow: "hidden",
      background: failed ? COLORS.redBg : COLORS.surface,
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "11px 12px", background: "transparent", border: "none",
          cursor: "pointer", fontFamily: FONT, textAlign: "left",
        }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {insp.name || "Inspection"}
          </span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint, marginTop: 1 }}>
            {insp.date ? fmtBuildDate(insp.date) : "No date yet"}
          </span>
        </span>
        <Chip tone={meta.tone}>{meta.label}</Chip>
      </button>

      {open && (
        <div style={{ padding: "0 14px 14px", display: "grid", gap: 10 }}>
          {failed && (
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: COLORS.surface, border: `1px solid ${COLORS.red}`, borderRadius: 10, padding: "10px 12px" }}>
              <Icon d={ICON.flag} size={15} color={COLORS.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.red }}>
                  This failed — the build can&apos;t move past it.
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3, lineHeight: 1.45 }}>
                  Write down what the inspector flagged, fix it, then mark the re-inspection scheduled.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  <button onClick={() => onChange({ status: "scheduled" })} style={btn("primary")}>
                    <Icon d={ICON.calendar} size={13} color="#fff" /> Re-inspection scheduled
                  </button>
                  {/* The fix has to be tracked somewhere, and the punch list is
                      where fixes live. Retyping the inspector's note into another
                      section is exactly the kind of copying this planner exists to
                      abolish. */}
                  <button onClick={onCreatePunchItem} style={btn("ghost")}>
                    <Icon d={ICON.check} size={13} /> Add to punch list
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            value={insp.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="What is being inspected"
            style={{ ...txt(), fontWeight: 700 }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <DateField value={insp.date} onChange={(v) => onDate(v)} ariaLabel="Inspection date" />
            <SelectPill value={insp.status} options={INSPECTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={128} />
          </div>

          {!failed && insp.status === "not_scheduled" && (
            <div style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.45 }}>
              Set a date above and it schedules itself.
            </div>
          )}

          <input
            value={insp.inspector}
            onChange={(e) => onChange({ inspector: e.target.value })}
            placeholder="Inspector or department"
            style={txt()}
          />
          <AutoTextarea
            value={insp.notes}
            onChange={(v) => onChange({ notes: v })}
            minRows={3}
            placeholder={failed ? "What did the inspector flag? What is the fix?" : "Corrections, re-inspection notes…"}
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={btn("ghost")}>
              <Icon d={ICON.x} size={13} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InspectionsSection({ state, addRow, updRow, delRow }) {
  // A failed inspection with no route into the punch list is a dead end: the
  // corrective work exists only as a note on a row nobody revisits.
  const createPunchItem = (insp) =>
    addRow("punch_list", {
      room: "General",
      description: insp.notes?.trim() || `Correct what failed the ${insp.name || "inspection"}`,
      trade: insp.inspector || "",
      done: false,
      photo: "",
    });

  const insps = state.inspections || [];

  // Empty state — the first (and, until he starts, the only) screen here.
  // One button seeds the whole standard sequence so he never types twelve names.
  if (insps.length === 0) {
    return (
      <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 40px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
        <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
          <Icon d={ICON.landmark} size={24} color={ACCENT} />
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Track your inspections</h3>
        <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 400 }}>
          Every build passes the same municipal checkpoints, in order — footing, framing,
          final, and the rest. Start with the standard list and mark each one as you go.
          If any fails, this page makes sure you can&apos;t miss it.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <AddBtn label="Add the standard inspections" onClick={() => STANDARD_INSPECTIONS.forEach((name) => addRow("inspections", blankInspection(name)))} />
            {/* Seeding twelve then deleting eleven is not a way to add one. */}
            <AddBtn label="Add just one" onClick={() => addRow("inspections", blankInspection(""))} />
          </div>
      </div>
    );
  }

  const passed = insps.filter((i) => i.status === "passed").length;
  const failedRows = insps.filter((i) => i.status === "failed");
  const failed = failedRows.length;

  return (
    <Card title="Inspections" sub={`${passed} of ${insps.length} passed`}>
      {failed > 0 && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: COLORS.redBg, border: `1px solid ${COLORS.red}`, borderRadius: 12, padding: "12px 14px", margin: "4px 2px 12px" }}>
          <Icon d={ICON.flag} size={17} color={COLORS.red} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.red }}>
              {failed === 1 ? "1 inspection failed" : `${failed} inspections failed`} — the build can&apos;t proceed.
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3, lineHeight: 1.45 }}>
              {failedRows.map((i) => i.name || "Inspection").join(" · ")}. Open each one below to log the corrections and re-schedule.
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "2px 2px 12px", lineHeight: 1.5 }}>
        Municipal sign-offs, in build order. Set a date to schedule one — it flips to
        scheduled on its own.
      </div>

      <StatStrip items={[
        ["Passed", String(passed), COLORS.green],
        ["Failed", String(failed), failed ? COLORS.red : COLORS.text],
        ["Remaining", String(insps.length - passed - failed), COLORS.text],
      ]} />

      {insps.map((insp) => (
        <InspectionCard
          onCreatePunchItem={() => createPunchItem(insp)}
              key={insp.id}
          insp={insp}
          onChange={(p) => updRow("inspections", insp.id, p)}
          onDelete={() => delRow("inspections", insp.id)}
        />
      ))}

      <AddBtn label="Add inspection" onClick={() => addRow("inspections", blankInspection())} />
    </Card>
  );
}
