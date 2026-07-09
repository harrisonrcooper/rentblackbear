"use client";

// Sourcing Trips — the China planner.
//
// Windows, doors, cabinets, lighting and more are bought at factories in China.
// A trip is the plan for one visit: what to shop for, the budget, and the
// photos/videos you flew there to capture. The owner already wrote the
// checklist as engine tasks ("Source windows in China", note: film the factory
// install) — a trip that ignores it is useless, so we surface it two ways: the
// "start from my tasks" seed, and the matched-tasks panel in each trip.

import { useMemo, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, ACCENT_SOFT, Icon, fmtUsd,
  Card, Field, txt, MoneyInput, DelBtn, AddBtn, SectionHead, Chip, StatStrip,
  fmtBuildDate,
} from "../ui";
import DetailDrawer from "../DetailDrawer";
import {
  capturedCount, totalCount, tripProgressBps, budgetCents, stillNeeded,
  itemsWithoutMedia, tripTasks, suggestItemsFromTasks,
} from "@/lib/build/trips";

const CAMERA = ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"];
const MAP_PIN = ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"];
const CLIPBOARD = ["M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2", "M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1z"];

const STATUSES = [
  { id: "todo", label: "To source", tone: "neutral" },
  { id: "captured", label: "Captured", tone: "accent" },
  { id: "ordered", label: "Ordered", tone: "green" },
];
const STATUS_META = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

const uid = () => `it_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;

const blankItem = () => ({
  id: uid(), item: "", vendor: "", specs: "",
  budget_cents: 0, status: "todo", media_count: 0, notes: "",
});

function label(text) {
  return (
    <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
      {text}
    </span>
  );
}

// Segmented status control. Each segment carries a visible outline; the active
// one fills with its meaning's tone, so colour is never decorative here.
function StatusSeg({ value, onChange }) {
  const tone = {
    neutral: [COLORS.textMuted, COLORS.borderStrong, COLORS.surface],
    accent: [ACCENT, ACCENT, ACCENT_SOFT],
    green: [COLORS.green, COLORS.green, COLORS.greenBg],
  };
  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
      {STATUSES.map((s) => {
        const on = s.id === value;
        const [fg, bd, bg] = tone[s.tone];
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-pressed={on}
            style={{
              padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
              fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
              border: `1px solid ${on ? bd : COLORS.border}`,
              background: on ? bg : COLORS.surface,
              color: on ? fg : COLORS.textFaint,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// The captured / still-needed bar. Two segments that sum to the total.
function ProgressBar({ trip }) {
  const bps = tripProgressBps(trip);
  const pct = bps / 100;
  return (
    <span style={{ display: "block", height: 6, borderRadius: 3, background: COLORS.surfaceTint, overflow: "hidden" }}>
      <span style={{ display: "block", height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 3, transition: "width .2s ease" }} />
    </span>
  );
}

function TripCard({ trip, onOpen }) {
  const captured = capturedCount(trip);
  const total = totalCount(trip);
  const needed = stillNeeded(trip).length;
  const missing = itemsWithoutMedia(trip).length;
  const budget = budgetCents(trip);
  const dates = [trip.start, trip.end].filter(Boolean).map(fmtBuildDate).join(" – ");

  return (
    <button
      onClick={onOpen}
      style={{
        textAlign: "left", width: "100%", fontFamily: FONT, cursor: "pointer",
        background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14,
        padding: 16, display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: COLORS.text }}>
            {trip.name || "Untitled trip"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontSize: 12, color: COLORS.textFaint }}>
            <Icon d={MAP_PIN} size={13} />
            {dates || "No dates set"}
          </div>
        </div>
        {budget > 0 && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(budget)}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.textFaint }}>Budget</div>
          </div>
        )}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6 }}>
          <span>{captured} of {total} captured</span>
          <span style={{ color: needed ? COLORS.textMuted : COLORS.green }}>{needed ? `${needed} still needed` : "All sourced"}</span>
        </div>
        <ProgressBar trip={trip} />
      </div>

      {missing > 0 && (
        <Chip tone="amber">
          <Icon d={CAMERA} size={12} />
          {missing} marked done with no photos
        </Chip>
      )}
    </button>
  );
}

// One item in the checklist. Everything editable inline; captured/ordered with
// zero media earns the amber "No photos captured" flag — the point of the trip.
function ItemRow({ item, onPatch, onDelete }) {
  const noMedia = (item.status === "captured" || item.status === "ordered") && (item.media_count || 0) <= 0;
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10, background: COLORS.surface }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <input
          value={item.item}
          onChange={(e) => onPatch({ item: e.target.value })}
          placeholder="What to source"
          style={{ ...txt(), fontWeight: 700 }}
        />
        <DelBtn onClick={onDelete} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <StatusSeg value={item.status} onChange={(status) => onPatch({ status })} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <label style={{ display: "block" }}>
          {label("Vendor")}
          <input value={item.vendor} onChange={(e) => onPatch({ vendor: e.target.value })} placeholder="Factory / contact" style={txt()} />
        </label>
        <label style={{ display: "block" }}>
          {label("Budget")}
          <MoneyInput value={item.budget_cents} onChange={(budget_cents) => onPatch({ budget_cents })} />
        </label>
        <label style={{ display: "block" }}>
          {label("Photos / videos")}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => onPatch({ media_count: Math.max(0, (item.media_count || 0) - 1) })}
              aria-label="One fewer"
              style={{ width: 30, height: 32, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer", flexShrink: 0 }}
            >
              <Icon d="M5 12h14" size={13} />
            </button>
            <span style={{ minWidth: 22, textAlign: "center", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{item.media_count || 0}</span>
            <button
              onClick={() => onPatch({ media_count: (item.media_count || 0) + 1 })}
              aria-label="One more"
              style={{ width: 30, height: 32, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer", flexShrink: 0 }}
            >
              <Icon d={["M12 5v14", "M5 12h14"]} size={13} />
            </button>
          </div>
        </label>
      </div>

      <label style={{ display: "block", marginTop: 10 }}>
        {label("Specs")}
        <textarea
          value={item.specs}
          onChange={(e) => onPatch({ specs: e.target.value })}
          placeholder="Dimensions, finish, materials to confirm on site"
          rows={2}
          style={{ ...txt(), height: "auto", padding: "8px 10px", resize: "vertical", lineHeight: 1.4 }}
        />
      </label>

      {item.notes && (
        <div style={{ marginTop: 10, fontSize: 12, color: COLORS.textMuted, background: COLORS.surfaceTint, borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 }}>
          {item.notes}
        </div>
      )}

      {noMedia && (
        <div style={{ marginTop: 10 }}>
          <Chip tone="amber">
            <Icon d={CAMERA} size={12} />
            No photos captured
          </Chip>
        </div>
      )}
    </div>
  );
}

export default function TripsSection({ state, addRow, updRow, delRow, tasks = [] }) {
  const trips = state.trips || [];
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("itinerary");

  const suggested = useMemo(() => suggestItemsFromTasks(tasks), [tasks]);
  const openTrip = trips.find((t) => t.id === openId) || null;

  const patchItems = (trip, nextItems) => updRow("trips", trip.id, { items: nextItems });
  const patchItem = (trip, itemId, patch) =>
    patchItems(trip, trip.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)));
  // Soft delete: flag the item archived; visibleState hides it, the blob keeps it.
  const removeItem = (trip, itemId) =>
    patchItems(trip, trip.items.map((it) => (it.id === itemId ? { ...it, archived: true } : it)));
  const addItem = (trip) => patchItems(trip, [...trip.items, blankItem()]);

  const startFromTasks = () => {
    addRow("trips", {
      name: "China sourcing trip",
      start: null, end: null,
      notes: "Factory visits to source and photograph what we're buying in China.",
      items: suggestItemsFromTasks(tasks),
    });
  };
  const addBlankTrip = () => addRow("trips", { name: "New sourcing trip", start: null, end: null, notes: "", items: [] });

  const openDrawer = (id) => { setOpenId(id); setTab("itinerary"); };

  // Cross-trip roll-up, only worth showing once there's more than a first trip.
  const totals = useMemo(() => {
    let needed = 0, budget = 0, missing = 0, items = 0;
    for (const t of trips) {
      needed += stillNeeded(t).length;
      budget += budgetCents(t);
      missing += itemsWithoutMedia(t).length;
      items += totalCount(t);
    }
    return { needed, budget, missing, items };
  }, [trips]);

  return (
    <div>
      <SectionHead title="Sourcing trips" note="Plan each China factory visit — the shopping list, the budget, and the photos you bring home." />

      {trips.length === 0 ? (
        <Card title="No trips planned yet">
          <div style={{ padding: "6px 4px 4px", maxWidth: 520 }}>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: COLORS.textMuted, margin: "0 0 4px" }}>
              Windows, doors, cabinets, stairs and lighting are being sourced at factories in China. A trip
              turns that into a checklist you can work: what to buy, who the vendor is, the budget per item,
              and — the whole reason to fly there — the photos and videos you capture on site.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: COLORS.textMuted, margin: "0 0 16px" }}>
              You already wrote the checklist as sourcing tasks. Start a trip pre-filled with all of them,
              instructions and all, or build one from scratch.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggested.length > 0 && (
                <button
                  onClick={startFromTasks}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: FONT,
                    padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    color: ACCENT, background: ACCENT_SOFT, border: `1px solid ${ACCENT}`,
                  }}
                >
                  <Icon d={CLIPBOARD} size={15} />
                  Start a trip from my {suggested.length} sourcing tasks
                </button>
              )}
              <button
                onClick={addBlankTrip}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: FONT,
                  padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  color: COLORS.text, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                }}
              >
                <Icon d={["M12 5v14", "M5 12h14"]} size={15} />
                Add a blank trip
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {totals.items > 0 && (
            <StatStrip
              items={[
                ["Trips", String(trips.length), COLORS.text],
                ["Still to source", String(totals.needed), totals.needed ? COLORS.amber : COLORS.green],
                ["Total budget", fmtUsd(totals.budget), COLORS.text],
                ["Missing photos", String(totals.missing), totals.missing ? COLORS.amber : COLORS.green],
              ]}
            />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 4 }}>
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onOpen={() => openDrawer(trip.id)} />
            ))}
          </div>

          <AddBtn label="Add a trip" onClick={addBlankTrip} />
        </>
      )}

      <DetailDrawer
        open={!!openTrip}
        onClose={() => setOpenId(null)}
        kind="Sourcing trip"
        title={openTrip?.name || "Trip"}
        tabs={[
          { id: "itinerary", label: "Itinerary" },
          { id: "checklist", label: "Checklist", count: openTrip ? totalCount(openTrip) : 0 },
        ]}
        activeTab={tab}
        onTab={setTab}
        footer={
          openTrip ? (
            <button
              onClick={() => { delRow("trips", openTrip.id); setOpenId(null); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: FONT,
                padding: "8px 12px", borderRadius: 9, fontSize: 12.5, fontWeight: 700,
                color: COLORS.red, background: COLORS.redBg, border: `1px solid ${COLORS.red}`,
              }}
            >
              <Icon d={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} size={14} />
              Delete this trip
            </button>
          ) : null
        }
      >
        {openTrip && tab === "itinerary" && (
          <ItineraryTab trip={openTrip} tasks={tasks} onField={(patch) => updRow("trips", openTrip.id, patch)} />
        )}
        {openTrip && tab === "checklist" && (
          <ChecklistTab
            trip={openTrip}
            onAdd={() => addItem(openTrip)}
            onPatch={(itemId, patch) => patchItem(openTrip, itemId, patch)}
            onDelete={(itemId) => removeItem(openTrip, itemId)}
          />
        )}
      </DetailDrawer>
    </div>
  );
}

function ItineraryTab({ trip, tasks, onField }) {
  const matched = tripTasks(tasks, trip);
  return (
    <div>
      <Field label="Trip name">
        <input value={trip.name} onChange={(e) => onField({ name: e.target.value })} placeholder="China sourcing trip" style={txt()} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Start">
          <input type="date" value={trip.start || ""} onChange={(e) => onField({ start: e.target.value || null })} style={txt()} />
        </Field>
        <Field label="End">
          <input type="date" value={trip.end || ""} onChange={(e) => onField({ end: e.target.value || null })} style={txt()} />
        </Field>
      </div>
      {(trip.start || trip.end) && (
        <div style={{ margin: "-4px 0 12px", fontSize: 12, color: COLORS.textFaint }}>
          {[trip.start, trip.end].filter(Boolean).map(fmtBuildDate).join(" – ")}
        </div>
      )}
      <Field label="Notes">
        <textarea
          value={trip.notes}
          onChange={(e) => onField({ notes: e.target.value })}
          placeholder="Flights, hotels, translator, factory addresses…"
          rows={4}
          style={{ ...txt(), height: "auto", padding: "8px 10px", resize: "vertical", lineHeight: 1.5 }}
        />
      </Field>

      {matched.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Icon d={CLIPBOARD} size={14} color={ACCENT} />
            <span style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.text }}>From your sourcing checklist</span>
          </div>
          <p style={{ fontSize: 12, color: COLORS.textFaint, margin: "0 0 10px", lineHeight: 1.5 }}>
            Instructions you wrote for these items. Don&apos;t leave the factory without them.
          </p>
          {matched.map((t) => (
            <div key={t.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8, background: COLORS.surface }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{t.title}</div>
              {t.notes && (
                <div style={{ marginTop: 4, fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5 }}>{t.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistTab({ trip, onAdd, onPatch, onDelete }) {
  const items = trip.items || [];
  const captured = capturedCount(trip);
  const total = totalCount(trip);
  const missing = itemsWithoutMedia(trip);

  return (
    <div>
      <div style={{ background: COLORS.surfaceTint, borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8 }}>
          <span>{captured} of {total} captured</span>
          <span>{fmtUsd(budgetCents(trip))} budgeted</span>
        </div>
        <ProgressBar trip={trip} />
        {missing.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <Chip tone="amber">
              <Icon d={CAMERA} size={12} />
              {missing.length} item{missing.length === 1 ? "" : "s"} marked done with no photos
            </Chip>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: COLORS.textFaint, lineHeight: 1.6, margin: "4px 0 12px" }}>
          Nothing on the list yet. Add the first thing you&apos;re sourcing on this trip.
        </p>
      ) : (
        items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onPatch={(patch) => onPatch(item.id, patch)}
            onDelete={() => onDelete(item.id)}
          />
        ))
      )}

      <AddBtn label="Add an item" onClick={onAdd} />
    </div>
  );
}
