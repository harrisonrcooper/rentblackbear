"use client";

// Inspections — the municipal sign-offs, in build order.
//
// A failed inspection legally stops the whole build, so it can never be a quiet
// red word in a list. The ordinary fields — name, date, inspector, notes — are
// edited in the shared slide-in DetailDrawer, exactly like every other section.
// But the two things that MATTER about a failure never hide behind a tap: the
// red banner, the "Re-inspection scheduled" button and the "Add to punch list"
// button all live on the collapsed row, visible the moment he lands here. Status
// labels and tones come from the shared INSPECTION_STATUSES, so a chip here can
// never drift from the same chip elsewhere.

import { useState } from "react";

import {
  COLORS, FONT, btn, Icon, ICON,
  txt, Card, Field, Chip, AddBtn, StatStrip, AutoTextarea, SelectPill,
  EmptyState, fmtBuildDate, INSPECTION_STATUSES,
  DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";

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

// One inspection on the ledger. The whole row opens the editor — EXCEPT the two
// failure actions, which are real buttons in their own right and so cannot nest
// inside the row button. A failed row therefore renders the red block as a
// sibling of the open-editor button, keeping both fully clickable.
function InspectionCard({ insp, onOpen, onChange, onCreatePunchItem }) {
  const failed = insp.status === "failed";
  const meta = STATUS[insp.status] || STATUS.not_scheduled;

  return (
    <div style={{
      border: `1px solid ${failed ? COLORS.red : COLORS.border}`,
      borderRadius: 12, marginBottom: 10, overflow: "hidden",
      background: failed ? COLORS.redBg : COLORS.surface,
    }}>
      <button
        data-item-id={insp.id}
        onClick={onOpen}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "11px 12px", background: "transparent", border: "none",
          cursor: "pointer", fontFamily: FONT, textAlign: "left",
        }}
      >
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {insp.name || "Inspection"}
          </span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint, marginTop: 1 }}>
            {insp.date ? fmtBuildDate(insp.date) : "No date yet"}
          </span>
        </span>
        <Chip tone={meta.tone}>{meta.label}</Chip>
        <Icon d={ICON.edit} size={14} color={COLORS.textFaint} />
      </button>

      {failed && (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: COLORS.surface, border: `1px solid ${COLORS.red}`, borderRadius: 10, padding: "10px 12px" }}>
            <Icon d={ICON.flag} size={15} color={COLORS.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.red }}>
                This failed — the build can&apos;t move past it.
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3, lineHeight: 1.45 }}>
                Send the fix to your punch list, then mark the re-inspection scheduled. Open the
                row to write down what the inspector flagged.
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
        </div>
      )}
    </div>
  );
}

// The ordinary fields, hosted in the shared DetailDrawer. Everything here is a
// routine edit; the failure decision itself stays out on the row.
function InspectionEditor({ insp, patch, onDelete }) {
  const failed = insp.status === "failed";

  // Setting a date on an unscheduled inspection IS scheduling it — bump the
  // status in the same edit so he never has to do the second step by hand.
  const onDate = (date) =>
    patch({ date, ...(date && insp.status === "not_scheduled" ? { status: "scheduled" } : {}) });

  return (
    <div style={{ display: "grid", gap: 2 }}>
      <Field label="What is being inspected">
        <input
          value={insp.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="e.g. Framing"
          style={{ ...txt(), fontWeight: 700 }}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Date">
          <DateField value={insp.date} onChange={(v) => onDate(v)} ariaLabel="Inspection date" />
        </Field>
        <Field label="Status">
          <SelectPill value={insp.status} options={INSPECTION_STATUSES} onChange={(status) => patch({ status })} ariaLabel="Status" minWidth={128} />
        </Field>
      </div>

      {!failed && insp.status === "not_scheduled" && (
        <div style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.45, margin: "-4px 2px 12px" }}>
          Set a date above and it schedules itself.
        </div>
      )}

      <Field label="Inspector or department">
        <input
          value={insp.inspector}
          onChange={(e) => patch({ inspector: e.target.value })}
          placeholder="e.g. City building department"
          style={txt()}
        />
      </Field>

      <Field label="Notes">
        <AutoTextarea
          value={insp.notes}
          onChange={(v) => patch({ notes: v })}
          minRows={3}
          placeholder={failed ? "What did the inspector flag? What is the fix?" : "Corrections, re-inspection notes…"}
        />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onDelete} style={btn("ghost")}>
          <Icon d={ICON.x} size={13} /> Delete inspection
        </button>
      </div>
    </div>
  );
}

export default function InspectionsSection({ state, addRow, updRow, delRow }) {
  const insps = state.inspections || [];
  const [openId, setOpenId] = useState(null);

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

  // Empty state — the first (and, until he starts, the only) screen here.
  // One button seeds the whole standard sequence so he never types twelve names.
  if (insps.length === 0) {
    return (
      <EmptyState
        icon={ICON.landmark}
        title="Track your inspections"
        action={<AddBtn label="Add the standard inspections" onClick={() => STANDARD_INSPECTIONS.forEach((name) => addRow("inspections", blankInspection(name)))} />}
        secondary={<AddBtn label="Add just one" onClick={() => addRow("inspections", blankInspection(""))} />}
      >
        Every build passes the same municipal checkpoints, in order — footing, framing, final,
        and the rest. Start with the standard list and mark each one as you go. If any fails,
        this page makes sure you can&apos;t miss it.
      </EmptyState>
    );
  }

  const passed = insps.filter((i) => i.status === "passed").length;
  const failedRows = insps.filter((i) => i.status === "failed");
  const failed = failedRows.length;

  const open = insps.find((i) => i.id === openId) || null;
  const patch = (p) => open && updRow("inspections", open.id, p);

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
              {failedRows.map((i) => i.name || "Inspection").join(" · ")}. Each is flagged below — re-schedule it or send the fix to your punch list right from its card.
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
          key={insp.id}
          insp={insp}
          onOpen={() => setOpenId(insp.id)}
          onChange={(p) => updRow("inspections", insp.id, p)}
          onCreatePunchItem={() => createPunchItem(insp)}
        />
      ))}

      <AddBtn label="Add inspection" onClick={() => addRow("inspections", blankInspection())} />

      <DetailDrawer
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
        kind="Inspection"
        title={open?.name || "Inspection"}
      >
        {open && (
          <InspectionEditor
            key={open.id}
            insp={open}
            patch={patch}
            onDelete={() => { delRow("inspections", open.id); setOpenId(null); }}
          />
        )}
      </DetailDrawer>
    </Card>
  );
}
