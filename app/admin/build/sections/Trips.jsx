"use client";

// Sourcing Trips — the China planner.
//
// Windows, doors, cabinets, lighting and more are bought at factories in China.
// A trip is the plan for one visit: what to shop for, the budget, and the
// photos/videos you flew there to capture. The owner already wrote the
// checklist as engine tasks ("Source windows in China", note: film the factory
// install) — a trip that ignores it is useless, so we surface it two ways: the
// "start from my tasks" seed, and the matched-tasks panel in each trip.

import { useMemo, useState, useRef, useEffect } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, ACCENT_SOFT, Icon, fmtUsd,
  Field, txt, MoneyInput, DelBtn, AddBtn, SectionHead, Chip, StatStrip,
  fmtBuildDate, AutoTextarea,
  DateField} from "../ui";
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
  const pct = tripProgressBps(trip) / 100;
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

      {total === 0 ? (
        <div style={{ fontSize: 12.5, color: COLORS.textFaint }}>Nothing on the list yet — open to add what you&apos;re sourcing.</div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6 }}>
            <span>{captured} of {total} captured</span>
            <span style={{ color: needed ? COLORS.textMuted : COLORS.green }}>{needed ? `${needed} still needed` : "All sourced"}</span>
          </div>
          <ProgressBar trip={trip} />
        </div>
      )}

      {missing > 0 && (
        <Chip tone="amber">
          <Icon d={CAMERA} size={12} />
          {missing} marked done with no photos
        </Chip>
      )}
    </button>
  );
}

// A count of photos brought back, stepped up and down. Zero is the signal that
// matters — an item marked captured with zero photos earns the amber flag — so
// the control keeps a running count while staying one tap from proving it.
function MediaStepper({ count, onChange }) {
  const n = count || 0;
  const stepBtn = {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${COLORS.border}`,
    background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer", flexShrink: 0,
    display: "grid", placeItems: "center",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => onChange(Math.max(0, n - 1))} aria-label="One fewer photo" disabled={n === 0} style={{ ...stepBtn, opacity: n === 0 ? 0.4 : 1 }}>
        <Icon d="M5 12h14" size={14} />
      </button>
      <span style={{ minWidth: 22, textAlign: "center", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{n}</span>
      <button onClick={() => onChange(n + 1)} aria-label="One more photo" style={stepBtn}>
        <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
      </button>
    </div>
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
          {label("Photos and videos")}
          <MediaStepper count={item.media_count} onChange={(media_count) => onPatch({ media_count })} />
        </label>
      </div>

      <label style={{ display: "block", marginTop: 10 }}>
        {label("Specs")}
        <AutoTextarea
          value={item.specs}
          onChange={(specs) => onPatch({ specs })}
          minRows={2}
          placeholder="Dimensions, finish, materials to confirm on site"
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

  // After creating a trip, land the owner straight inside it — no hunting the
  // grid for a card he just made. addRow appends, so the newest visible row is
  // last; open it (on the tab that matters) once React has committed the state.
  const wantOpen = useRef(null);
  useEffect(() => {
    if (!wantOpen.current) return;
    const goTab = wantOpen.current;
    wantOpen.current = null;
    const last = trips[trips.length - 1];
    if (last) { setOpenId(last.id); setTab(goTab); }
  }, [trips]);

  const startFromTasks = () => {
    wantOpen.current = "checklist";
    addRow("trips", {
      name: "China sourcing trip",
      start: null, end: null,
      notes: "Factory visits to source and photograph what we're buying in China.",
      items: suggestItemsFromTasks(tasks),
    });
  };
  const addBlankTrip = () => {
    wantOpen.current = "itinerary";
    addRow("trips", { name: "New sourcing trip", start: null, end: null, notes: "", items: [] });
  };

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

  // ── Empty state — the first (and often only) screen he'll see here ─────────
  if (trips.length === 0) {
    return (
      <>
        <SectionHead title="Sourcing trips" note="Plan each China factory visit — the shopping list, the budget, and the photos you bring home." />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: ACCENT_SOFT, display: "grid", placeItems: "center" }}>
            <Icon d={MAP_PIN} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Plan your China sourcing trip</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 400 }}>
            Windows, doors, cabinets, stairs and lighting are being made at factories in China. A trip turns
            that into a checklist you can work: what to buy, the budget for each, and — the whole reason to fly
            there — the photos and videos you bring home.
          </p>

          {suggested.length > 0 ? (
            <>
              <AddBtn label={`Start my trip from ${suggested.length} sourcing tasks`} onClick={startFromTasks} />
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={addBlankTrip}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: FONT,
                    padding: "7px 12px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                    color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  }}
                >
                  Start an empty trip instead
                </button>
              </div>
            </>
          ) : (
            <AddBtn label="Plan your first trip" onClick={addBlankTrip} />
          )}
        </div>
        {renderDrawer()}
      </>
    );
  }

  function renderDrawer() {
    return (
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
    );
  }

  return (
    <div>
      <SectionHead title="Sourcing trips" note="Plan each China factory visit — the shopping list, the budget, and the photos you bring home." />

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

      {renderDrawer()}
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
          <DateField value={trip.start} onChange={(v) => onField({ start: v })} />
        </Field>
        <Field label="End">
          <DateField value={trip.end} onChange={(v) => onField({ end: v })} />
        </Field>
      </div>
      {(trip.start || trip.end) && (
        <div style={{ margin: "-4px 0 12px", fontSize: 12, color: COLORS.textFaint }}>
          {[trip.start, trip.end].filter(Boolean).map(fmtBuildDate).join(" – ")}
        </div>
      )}
      <Field label="Notes">
        <AutoTextarea
          value={trip.notes}
          onChange={(notes) => onField({ notes })}
          minRows={3}
          placeholder="Flights, hotels, translator, factory addresses…"
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
      {total > 0 && (
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
      )}

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
