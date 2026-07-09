"use client";

// Standalone home-build planner. Its own nav and sections; saves to
// its own app_data row via saveBuildStateAction. Reuses the budget
// app's design tokens, icons and money helpers so it feels native.

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { COLORS, FONT, STYLES, inputStyle, btnStyle as btn, themeStylesheet } from "../budget/lib/tokens";
import { Icon, ICON } from "../budget/lib/icons";
import { fmtUsd, fmtCompact } from "../budget/lib/money";
import { genId } from "../budget/lib/calc";
import { useIsMobile } from "../budget/lib/responsive";
import { saveBuildStateAction } from "@/actions/build/state";
import { createTask, listTasks, updateTask } from "@/actions/build/engine";
import { mergeBuildState } from "@/lib/build/merge";
import { visibleState } from "@/lib/build/visible";
import { tasksFor } from "@/lib/build/tasks";
import {
  addMustHave, checklistFor, editMustHave, removeMustHave, roomProgress, toggleMustHave,
} from "@/lib/build/rooms";
import CommandPalette from "./CommandPalette";
import QuickCapture from "./QuickCapture";
import BackupPanel from "./BackupPanel";
import DetailDrawer from "./DetailDrawer";
import MaterialsSection from "./sections/Materials";
import DecisionsSection2 from "./sections/Decisions";
import QuotesSection from "./sections/Quotes";
import ScheduleSection from "./sections/Schedule";
import TripsSection from "./sections/Trips";

/** Best available human name for a row, used in the undo snackbar. */
import { ACCENT, ACCENT_SOFT, SERIF } from "./ui";
import { CAMERA_ICON } from "./sections/_common";
import OverviewSection from "./sections/Overview";
import WantsSection from "./sections/Wants";
import RoomsSection from "./sections/Rooms";
import CostsSection from "./sections/Costs";
import ChangeOrdersSection from "./sections/ChangeOrders";
import PaymentsSection from "./sections/Payments";
import MilestonesSection from "./sections/Milestones";
import SelectionsSection from "./sections/Selections";
import TeamSection from "./sections/Team";
import DocumentsSection from "./sections/Documents";
import PhotosSection from "./sections/Photos";
import InspectionsSection from "./sections/Inspections";
import PunchListSection from "./sections/PunchList";
import DecisionsSection from "./sections/OpenQuestions";
import AsBuiltSection from "./sections/AsBuilt";
import EnergySection from "./sections/Energy";
import BriefSection from "./sections/Brief";
import InspirationSection from "./sections/Inspiration";
import ReferencesSection from "./sections/References";
import PaletteSection from "./sections/Palette";

function rowLabel(row) {
  if (!row) return "item";
  for (const k of ["name", "label", "title", "item", "question", "description", "room", "caption"]) {
    if (typeof row[k] === "string" && row[k].trim()) return row[k].trim().slice(0, 40);
  }
  return "item";
}

const DOC_ICON = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8";

const CHANGE_ORDER_ICON = "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 2v6h6 M12 18v-6 M9 15h6";

const PAYMENT_ICON = "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M2 10h20";

const INSPECTION_ICON = "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M9 14l2 2 4-4";

const PUNCH_ICON = "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11";

const RFI_ICON = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";

const ASBUILT_ICON = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4";

const ENERGY_ICON = "M13 2L3 14h7l-1 8 10-12h-7z";

const NAV_GROUPS = ["Plan", "Decide", "Track"];

const SECTIONS = [
  { id: "overview",   group: "Plan",   label: "Overview",       icon: ICON.home },
  { id: "inspiration", group: "Plan",  label: "Inspiration",    icon: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21", count: "boards" },
  { id: "rooms",      group: "Plan",   label: "Rooms & Spaces", icon: ICON.building, count: "rooms" },
  { id: "materials",  group: "Plan",   label: "Materials",      icon: "M20 7h-9 M14 17H5 M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", count: "materials" },
  { id: "trips",      group: "Plan",   label: "Sourcing Trips", icon: "M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z M12 2a10 10 0 0 0 0 20", count: "trips" },
  { id: "wants",      group: "Plan",   label: "Wants & Needs",  icon: ICON.flag, count: "wishlist" },
  { id: "references", group: "Plan",   label: "References",     icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z", count: "references" },
  // Renamed: this section renders the `palette` array — colour swatches and
  // finishes, not a product catalogue. The catalogue does not exist yet.
  { id: "palette",    group: "Plan",   label: "Colors & Finishes", icon: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z", count: "palette" },

  { id: "selections", group: "Decide", label: "Selections",     icon: ICON.edit, count: "selections" },
  // Renamed: this renders the `rfis` array — open questions awaiting an
  // answer, not a log of decisions made and why.
  { id: "decisions",  group: "Decide", label: "Open Questions", icon: RFI_ICON, count: "rfis" },
  { id: "decisionlog", group: "Decide", label: "Decisions",     icon: "M9 11l3 3 8-8 M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9", count: "decisions_log" },
  { id: "quotes",     group: "Decide", label: "Quotes & Bids",  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3", count: "quotes" },
  { id: "team",       group: "Decide", label: "Team & Vendors", icon: ICON.family, count: "team" },
  { id: "brief",      group: "Decide", label: "Architect Brief", icon: DOC_ICON },

  { id: "costs",      group: "Track",  label: "Costs",          icon: ICON.envelope, count: "costs" },
  { id: "changeorders", group: "Track", label: "Change Orders", icon: CHANGE_ORDER_ICON, count: "change_orders" },
  { id: "payments",   group: "Track",  label: "Payments",       icon: PAYMENT_ICON, count: "payments" },
  { id: "schedule",   group: "Track",  label: "Schedule",       icon: "M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4", count: "schedule_tasks" },
  { id: "milestones", group: "Track",  label: "Milestones",     icon: ICON.calendar, count: "milestones" },
  { id: "inspections", group: "Track", label: "Inspections",    icon: INSPECTION_ICON, count: "inspections" },
  { id: "punchlist",  group: "Track",  label: "Punch List",     icon: PUNCH_ICON, count: "punch_list" },
  { id: "photos",     group: "Track",  label: "Progress Photos", icon: CAMERA_ICON, count: "photos" },
  { id: "documents",  group: "Track",  label: "Documents",      icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z", count: "documents" },
  { id: "asbuilt",    group: "Track",  label: "As-Built & Warranty", icon: ASBUILT_ICON },
  { id: "energy",     group: "Track",  label: "Energy",         icon: ENERGY_ICON },
];

const MAX_SAVE_ATTEMPTS = 3;

function Snack({ tone = "dark", children }) {
  const bg = tone === "danger" ? "#b3261e" : tone === "warn" ? "#7a5a00" : "#1f2430";
  return (
    <div style={{
      background: bg, color: "#fff", borderRadius: 12, padding: "12px 14px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.28)", fontSize: 13.5, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 14, pointerEvents: "auto",
      maxWidth: 520,
    }}>
      {children}
    </div>
  );
}

function SnackButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)",
        color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
        fontFamily: FONT, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Snackbars({ undo, onUndo, onDismissUndo, mergeNote, onDismissMerge, saveError }) {
  if (!undo && !mergeNote && !saveError) return null;

  const merged = mergeNote
    ? [...(mergeNote.conflicts || []), ...(mergeNote.resurrected || [])]
    : [];

  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 18, zIndex: 400,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      padding: "0 12px", pointerEvents: "none", fontFamily: FONT,
    }}>
      {saveError && (
        <Snack tone="danger">
          <span style={{ flex: 1 }}>{saveError}</span>
          <SnackButton onClick={() => window.location.reload()}>Reload</SnackButton>
        </Snack>
      )}

      {mergeNote && (
        <Snack tone="warn">
          <div style={{ flex: 1 }}>
            <div>Someone else was editing. Both sets of changes were kept.</div>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontWeight: 500, opacity: 0.92 }}>
              {merged.slice(0, 3).map((line) => <li key={line}>{line}</li>)}
              {merged.length > 3 && <li>and {merged.length - 3} more</li>}
            </ul>
          </div>
          <SnackButton onClick={onDismissMerge}>Got it</SnackButton>
        </Snack>
      )}

      {undo && (
        <Snack>
          <span style={{ flex: 1 }}>Deleted “{undo.label}”</span>
          <SnackButton onClick={onUndo}>Undo</SnackButton>
          <SnackButton onClick={onDismissUndo}>Dismiss</SnackButton>
        </Snack>
      )}
    </div>
  );
}

export default function BuildClient({ initialState, initialVersion = 0, initialSection = "overview" }) {
  const [state, setState] = useState(initialState);
  const [section, setSection] = useState(initialSection);
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [mergeNote, setMergeNote] = useState(null); // { conflicts, resurrected }
  const [undo, setUndo] = useState(null);           // { key, id, label }
  const isMobile = useIsMobile();
  const saveTimer = useRef(null);

  // The version we last read from the server, and the state the server is
  // known to hold at that version. Both are refs: a save in flight must see
  // the latest values, not the ones captured when it was scheduled.
  const version = useRef(initialVersion);
  const base = useRef(initialState);

  // Compare-and-swap save. If someone else wrote first, three-way merge our
  // edits into theirs and retry — never blindly overwrite their work.
  const commit = useCallback(async (next, attempt = 1) => {
    const res = await saveBuildStateAction(next, version.current);

    if (res.ok) {
      version.current = res.version;
      base.current = next;
      setSaved(true);
      setSaveError("");
      return;
    }

    if (res.conflict) {
      if (attempt >= MAX_SAVE_ATTEMPTS) {
        setSaved(false);
        setSaveError("Another session keeps saving over this one. Reload to continue.");
        return;
      }
      const { merged, report } = mergeBuildState(base.current, next, res.state);
      version.current = res.version;
      setState(merged);
      if (report.conflicts.length || report.resurrected.length) setMergeNote(report);
      await commit(merged, attempt + 1);
      return;
    }

    setSaved(false);
    setSaveError(res.message || "Could not save.");
  }, []);

  const persist = useCallback((next) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    saveTimer.current = setTimeout(() => {
      startTransition(() => { commit(next); });
    }, 500);
  }, [commit]);

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  const setField = useCallback((k, v) => update((s) => ({ ...s, [k]: v })), [update]);
  const addRow = useCallback((k, item) => update((s) => ({ ...s, [k]: [...s[k], { id: genId(), ...item }] })), [update]);
  const updRow = useCallback((k, id, patch) => update((s) => ({ ...s, [k]: s[k].map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [update]);

  // Soft delete: archive the row rather than drop it, so nothing that
  // references it by id is orphaned and the delete stays undoable.
  const delRow = useCallback((k, id) => {
    update((s) => {
      const row = s[k].find((x) => x.id === id);
      setUndo({ key: k, id, label: rowLabel(row) });
      return { ...s, [k]: s[k].map((x) => (x.id === id ? { ...x, archived: true } : x)) };
    });
  }, [update]);

  const undoDelete = useCallback(() => {
    if (!undo) return;
    const { key, id } = undo;
    setUndo(null);
    update((s) => ({ ...s, [key]: s[key].map((x) => (x.id === id ? { ...x, archived: false } : x)) }));
  }, [undo, update]);

  useEffect(() => {
    if (!undo) return undefined;
    const t = setTimeout(() => setUndo(null), 8000);
    return () => clearTimeout(t);
  }, [undo]);

  // ── Cmd+K, quick capture, deep links ───────────────────────────────

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const refreshTasks = useCallback(async () => {
    const res = await listTasks();
    if (res.ok) setTasks(res.tasks || []);
  }, []);

  useEffect(() => { refreshTasks(); }, [refreshTasks]);

  const jumpTo = useCallback((nextSection, itemId) => {
    setSection(nextSection);
    const q = new URLSearchParams({ s: nextSection });
    if (itemId) q.set("item", itemId);
    window.history.replaceState(null, "", `/admin/build?${q.toString()}`);

    if (!itemId) return;
    // The target section has to render before we can scroll to the row.
    setTimeout(() => {
      const el = document.querySelector(`[data-item-id="${itemId}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }, []);

  const captureTask = useCallback(async ({ title, notes }) => {
    const res = await createTask({ title, notes });
    if (res.ok) await refreshTasks();
    else setSaveError(res.message || "Could not add that task.");
  }, [refreshTasks]);

  const captureReference = useCallback(async ({ url, title, note }) => {
    addRow("references", { url, title, tag: "Inbox", note });
  }, [addRow]);

  // Tasks attached to a room. Optimistic locally, reconciled from the server —
  // the engine's replay makes a lost write impossible, but a stale list is
  // still possible if two tabs are open, so we refetch after every write.
  const addRoomTask = useCallback(async (roomId, title) => {
    const res = await createTask({ title, entityType: "room", entityId: roomId });
    if (res.ok) await refreshTasks();
    else setSaveError(res.message || "Could not add that task.");
  }, [refreshTasks]);

  const toggleTaskDone = useCallback(async (task) => {
    const next = task.status === "done" ? "todo" : "done";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    const res = await updateTask(task.id, { status: next });
    if (!res.ok) setSaveError(res.message || "Could not update that task.");
    await refreshTasks();
  }, [refreshTasks]);

  // Sections render the live rows only; helpers still mutate the full state.
  const shown = useMemo(() => visibleState(state), [state]);
  const helpers = { state: shown, setField, addRow, updRow, delRow };
  const view = useMemo(() => {
    switch (section) {
      case "inspiration": return <InspirationSection {...helpers} />;
      case "references": return <ReferencesSection {...helpers} />;
      case "palette": return <PaletteSection {...helpers} />;
      case "wants": return <WantsSection {...helpers} />;
      case "rooms": return (
        <RoomsSection {...helpers} tasks={tasks} onAddTask={addRoomTask} onToggleTask={toggleTaskDone} />
      );
      case "costs": return <CostsSection {...helpers} />;
      case "changeorders": return <ChangeOrdersSection {...helpers} />;
      case "payments": return <PaymentsSection {...helpers} />;
      case "milestones": return <MilestonesSection {...helpers} />;
      case "inspections": return <InspectionsSection {...helpers} />;
      case "selections": return <SelectionsSection {...helpers} />;
      case "decisions": return <DecisionsSection {...helpers} />;
      case "team": return <TeamSection {...helpers} />;
      case "documents": return <DocumentsSection {...helpers} />;
      case "photos": return <PhotosSection {...helpers} />;
      case "punchlist": return <PunchListSection {...helpers} />;
      case "asbuilt": return <AsBuiltSection {...helpers} />;
      case "energy": return <EnergySection {...helpers} />;
      case "materials": return <MaterialsSection {...helpers} />;
      case "decisionlog": return <DecisionsSection2 {...helpers} />;
      case "quotes": return <QuotesSection {...helpers} />;
      case "schedule": return <ScheduleSection {...helpers} />;
      case "trips": return <TripsSection {...helpers} tasks={tasks} />;
      case "brief": return <BriefSection state={shown} />;
      default: return (
        <>
          <QuickCapture onCaptureTask={captureTask} onCaptureReference={captureReference} />
          <OverviewSection state={shown} setField={setField} onJump={setSection} />
        </>
      );
    }
    // `tasks` matters: without it the rooms drawer renders a task list that
    // never updates after an add or a toggle.
  }, [section, shown, tasks, captureTask, captureReference, addRoomTask, toggleTaskDone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-bb-theme="quarry" style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: FONT }}>
      <style dangerouslySetInnerHTML={{ __html: themeStylesheet() }} />
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .build-chrome { display: none !important; }
          .build-main { padding: 0 !important; }
        }
        @media (max-width: 540px) {
          input[type=number], input[type=text], input[type=date], textarea, select { font-size: 16px !important; }
        }
      ` }} />

      {!isMobile && (
        <aside className="build-chrome" style={{
          width: 232, flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start",
          height: "100vh", overflowY: "auto", background: COLORS.surface,
          borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <a href="/admin/budget" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: COLORS.textFaint, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <Icon d={ICON.chevL} size={12} /> Admin
            </a>
            <div style={{ marginTop: 8, fontFamily: SERIF, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>Build</div>
            <div style={{ marginTop: 2, fontSize: 11, color: saveError ? "#b3261e" : COLORS.textFaint, fontWeight: 600 }}>
              {saveError ? "Not saved" : saved ? "All changes saved" : "Saving…"}
            </div>
            <button
              onClick={() => setPaletteOpen(true)}
              style={{
                marginTop: 12, width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontFamily: FONT,
                border: `1px solid ${COLORS.border}`, background: COLORS.bg,
                color: COLORS.textFaint, fontSize: 12.5, fontWeight: 600,
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.65" y2="16.65" />
              </svg>
              <span style={{ flex: 1, textAlign: "left" }}>Search</span>
              <kbd style={{ fontSize: 10, fontWeight: 700, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "1px 5px" }}>⌘K</kbd>
            </button>
          </div>
          <nav style={{ padding: "10px 10px 16px", display: "flex", flexDirection: "column", gap: 1, flex: 1, overflowY: "auto" }}>
            {NAV_GROUPS.map((group) => (
              <div key={group}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
                  color: COLORS.textFaint, padding: "14px 8px 6px",
                }}>
                  {group}
                </div>
                {SECTIONS.filter((s) => s.group === group).map((s) => {
                  const on = section === s.id;
                  const n = s.count ? (shown[s.count] || []).length : null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => jumpTo(s.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", width: "100%",
                        borderRadius: 6, border: "none", cursor: "pointer", textAlign: "left",
                        fontFamily: FONT, fontSize: 13, fontWeight: on ? 600 : 500,
                        background: on ? ACCENT_SOFT : "transparent",
                        color: on ? ACCENT : COLORS.textMuted,
                      }}
                    >
                      <Icon d={s.icon} size={15} />
                      <span style={{ flex: 1 }}>{s.label}</span>
                      {n ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: on ? ACCENT : COLORS.textFaint }}>{n}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          {/* A quiet door at the bottom of the nav. Backing up is a chore you do
              twice a year; it does not get the only filled button on the page. */}
          <div style={{ padding: "10px 12px 14px", borderTop: `1px solid ${COLORS.surfaceTint}` }}>
            <BackupPanel />
          </div>
        </aside>
      )}

      <main className="build-main" style={{ flex: 1, minWidth: 0, padding: isMobile ? "0 0 24px" : "24px 28px" }}>
        {isMobile && (
          <div className="build-chrome" style={{ position: "sticky", top: 0, zIndex: 10, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
              <a href="/admin/budget" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textDecoration: "none" }}>
                <Icon d={ICON.chevL} size={13} /> Admin
              </a>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Build</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint }}>{saved ? "Saved" : "Saving…"}</span>
                {/* Backup lived only in the desktop sidebar, so on a phone — the
                    device this planner is actually used on — there was none. */}
                <span style={{ width: 104, flexShrink: 0 }}><BackupPanel /></span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 12px 10px", WebkitOverflowScrolling: "touch" }}>
              {SECTIONS.map((s) => {
                const on = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    style={{
                      flexShrink: 0, padding: "8px 12px", borderRadius: 100, border: "none", cursor: "pointer",
                      fontFamily: FONT, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
                      background: on ? ACCENT : COLORS.surfaceTint,
                      color: on ? "#fff" : COLORS.textMuted,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: isMobile ? "14px 12px 0" : 0 }}>
          {view}
        </div>
      </main>

      <CommandPalette
        open={paletteOpen}
        onOpen={() => setPaletteOpen(true)}
        onClose={() => setPaletteOpen(false)}
        state={shown}
        tasks={tasks}
        onJump={jumpTo}
      />

      <Snackbars
        undo={undo}
        onUndo={undoDelete}
        onDismissUndo={() => setUndo(null)}
        mergeNote={mergeNote}
        onDismissMerge={() => setMergeNote(null)}
        saveError={saveError}
      />
    </div>
  );
}
