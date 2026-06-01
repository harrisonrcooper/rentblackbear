"use client";

// Top-level client component for /admin/budget. Owns:
//   * the in-memory state mirror (BudgetState shape from _writer.ts)
//   * the hero math (which of the three "net this month" formulas the
//     toggle is currently showing)
//   * the active month for the scrubber
//   * a coarse "active drill" (which tile is expanded)
//
// All persistent writes go through saveBudgetStateAction (in
// `@/actions/budget/state`). The action re-derives auth on every call
// so the client can't be spoofed into writing without permission.

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, ComposedChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid } from "recharts";

import { seedBudget } from "@/actions/budget/seed";
import { saveBudgetStateAction, switchBudgetAction, createBudgetAction } from "@/actions/budget/state";

import { COLORS, FONT, STYLES, TYPE, SPACE, RADII, btnStyle as btn, inputStyle, textBtnStyle, stepBtnStyle, pillSelectStyle, selectStyle, themeStylesheet, THEMES, DEFAULT_THEME, resolveThemeId } from "./lib/tokens";
import { Icon, ICON } from "./lib/icons";
import { fmtUsd, fmtCompact, biweeklyToMonthly, yearlyToMonthly, categoryMonthly, incomeMonthly } from "./lib/money";
import { propertyMonthlyGross, propertyMonthlyExpenses, propertyOperatingExpenses, propertyHelocPayment, propertyRentalShare, propertyMonthlyNet, computeNetWorthCents, computeHero, genId, todayISODate } from "./lib/calc";
import { GROUP_META, categoryEmoji, intensityColor, mixColors, hexToRgb } from "./lib/colors";
import { computeHelocSeries, computeHelocPlan, computeStrategies, defaultStrategyInputs } from "./lib/heloc";
import { DEFAULT_HABITS, HABIT_OWNERS, HABIT_STYLES, computeHabitStreak, buildHeatmap, buildGardenGrid, last7Days, longestStreak } from "./lib/habits";
import { ACHIEVEMENT_DEFS, TIERS, TIER_COLOR, computeAchievements, computeStreaks, fireConfetti } from "./lib/achievements";
import { formatRelativeTime, titleCase } from "./lib/time";
import { envelopeBalance, envelopeStartMonth, parseBulkPaste } from "./lib/envelopes";
import { computeAllocation, computeRetirementProjection, computeFireMetrics, defaultProjectionInputs } from "./lib/networth";
import { computePropertyAnalytics, projectPropertyROI } from "./lib/property";
import { computeForecast } from "./lib/forecast";
import { computeGoalProgress, formatEta, nextUnhitMilestone, templateToGoal, GOAL_TEMPLATES } from "./lib/goals";
import { buildGoalTrajectory } from "./lib/goalTrajectory";
import { predictCategory } from "./lib/predict";
import { buildEnvelopeTrend } from "./lib/envelopeTrend";
import { buildSpendingHeatmap } from "./lib/heatmap";
import { computeOnboarding } from "./lib/onboarding";
import { computeYearStats } from "./lib/yearstats";
import { computeInsights } from "./lib/insights";
import { useIsMobile } from "./lib/responsive";
import { DashboardSkeleton } from "./primitives/Skeleton";
import { Mascot, moodForCashflow, MASCOT_MESSAGES, contextMascotMessages } from "./primitives/Mascot";
import { SortableList, DragHandle } from "./primitives/Sortable";

// ── Top-level component ──────────────────────────────────────────────
// All tokens, icons, money/calc/habit/achievement/heloc helpers, and
// time formatters live in ./lib/* and ./primitives/* — imported above.

export default function BudgetClient({ initialState, userId, initialRegistry, initialBudgetId }) {
  const [state, setState] = useState(initialState);
  // Multi-budget: the registry indexes every budget this user owns;
  // `activeBudgetId` (null → the primary budget) records which one is
  // open. The id is mirrored into a ref so the debounced save closure
  // can tag each write with the budget it belongs to.
  const [registry, setRegistry] = useState(
    () => initialRegistry || { primary_label: "Main budget", budgets: [], active_id: null },
  );
  const [activeBudgetId, setActiveBudgetId] = useState(initialBudgetId ?? null);
  const activeBudgetIdRef = useRef(initialBudgetId ?? null);
  const [switchingBudget, setSwitchingBudget] = useState(false);
  const [activeMonth, setActiveMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [drill, setDrill] = useState(null); // 'rentals' | 'networth' | 'heloc' | 'mom' | null
  const [activeSection, setActiveSection] = useState("dashboard"); // 'dashboard' | 'envelopes' | 'habits' | 'goals' | 'achievements' | 'settings'
  const [addOpen, setAddOpen] = useState(false);
  const [addPreset, setAddPreset] = useState(null); // envelope label to pre-fill the log keypad
  const openLog = useCallback((cat) => { setAddPreset(typeof cat === "string" ? cat : null); setAddOpen(true); }, []);
  const [navEditorOpen, setNavEditorOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Toast queue. setToast(null) clears all; setToast({...}) appends.
  // Cap at 3 — the oldest gets shifted off when a fourth arrives.
  const [toasts, setToasts] = useState([]);
  const setToast = useCallback((t) => {
    if (t == null) { setToasts([]); return; }
    setToasts((prev) => {
      const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const next = [...prev, { ...t, id, at: Date.now() }];
      return next.length > 3 ? next.slice(-3) : next;
    });
  }, []);
  const [seeding, setSeeding] = useState(false);

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [editingLayout, setEditingLayout] = useState(false);

  // Global keyboard shortcuts. Gmail-style two-key nav ("g d" =
  // Dashboard) so we don't burn every single-letter key. The prefix
  // state lives in a ref so consecutive g-presses still work without
  // re-rendering each time.
  const gPrefixRef = useRef({ active: false, timer: null });
  useEffect(() => {
    const G_NAV = {
      d: "dashboard",
      e: "envelopes",
      h: "habits",
      o: "goals", // "g g" feels weird and conflicts with prefix
      a: "achievements",
      s: "settings",
    };

    const onKey = (e) => {
      const tag = e.target.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
      if (e.metaKey || e.ctrlKey || e.altKey) {
        // Only the existing Cmd/Ctrl-N shortcut survives modifier presses.
        if (e.key === "n" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setFabOpen(true); }
        return;
      }

      // Always available, even in input fields.
      if (e.key === "Escape") {
        setDrill(null); setFabOpen(false); setShowShortcutsHelp(false);
        gPrefixRef.current.active = false;
        return;
      }
      if (inField) return;

      // g-prefix mode — after pressing g, the next key picks a section.
      if (gPrefixRef.current.active) {
        const target = G_NAV[e.key];
        gPrefixRef.current.active = false;
        if (gPrefixRef.current.timer) clearTimeout(gPrefixRef.current.timer);
        if (target) {
          e.preventDefault();
          setDrill(null);
          setActiveSection(target);
        }
        return;
      }
      if (e.key === "g") {
        e.preventDefault();
        gPrefixRef.current.active = true;
        if (gPrefixRef.current.timer) clearTimeout(gPrefixRef.current.timer);
        // 1.5-second window to type the second key.
        gPrefixRef.current.timer = setTimeout(() => { gPrefixRef.current.active = false; }, 1500);
        return;
      }

      // Single-key shortcuts.
      if (e.key === "?") { e.preventDefault(); setShowShortcutsHelp((v) => !v); return; }
      if (e.key === "q") { e.preventDefault(); setFabOpen(true); return; }
      if (e.key === "+") { e.preventDefault(); setFabOpen(true); return; }
      if (e.key === "1") setDrill("rentals");
      if (e.key === "2") setDrill("networth");
      if (e.key === "3") setDrill("heloc");
      if (e.key === "4") setDrill("mom");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gPrefixRef.current.timer) clearTimeout(gPrefixRef.current.timer);
    };
  }, []);

  // Auto-clear toasts 6 seconds after they're added.
  useEffect(() => {
    if (toasts.length === 0) return;
    const oldest = toasts[0];
    const elapsed = Date.now() - oldest.at;
    const remaining = Math.max(0, 6000 - elapsed);
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== oldest.id));
    }, remaining);
    return () => clearTimeout(t);
  }, [toasts]);

  const hasData = state.categories.length > 0 || state.properties.length > 0;

  // Debounced save — every state mutation persists 400ms later.
  const saveTimer = useRef(null);
  const persistState = useCallback((nextState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    // Tag the write with whichever budget was active when the edit was
    // made, so a save debounced across a budget switch still lands in
    // the correct budget rather than the newly-opened one.
    const budgetId = activeBudgetIdRef.current;
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        const res = await saveBudgetStateAction(nextState, budgetId);
        if (!res.ok) setToast({ kind: "error", message: res.message || "Save failed." });
      });
    }, 400);
  }, []);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistState(next);
      return next;
    });
  }, [persistState]);

  // Pin/unpin a section in the mobile bottom bar (cap of 4).
  const toggleMobileNavTab = useCallback((id) => {
    updateState((s) => {
      const allowed = allowedNavSections(s.settings?.experience !== "full").map((x) => x.id);
      const raw = (s.settings.mobile_nav && s.settings.mobile_nav.length
        ? s.settings.mobile_nav
        : DEFAULT_MOBILE_NAV
      ).filter((x) => allowed.includes(x));
      let next;
      if (raw.includes(id)) next = raw.filter((x) => x !== id);
      else if (raw.length >= 4) return s;
      else next = [...raw, id];
      return { ...s, settings: { ...s.settings, mobile_nav: next } };
    });
  }, [updateState]);

  const handleSeed = useCallback(() => {
    setSeeding(true);
    setToast(null);
    startTransition(async () => {
      const result = await seedBudget();
      setSeeding(false);
      if (!result.ok) {
        setToast({ kind: "error", message: result.message || "Setup failed." });
        return;
      }
      // Reload to pick up the seeded state on the next render.
      window.location.reload();
    });
  }, []);

  // ── Multi-budget switching ──────────────────────────────────────────
  // Switch to another budget the user owns. The server records the
  // choice and returns that budget's state; we swap the whole tree.
  const handleSwitchBudget = useCallback((budgetId) => {
    const target = budgetId ?? null;
    if (target === activeBudgetIdRef.current) return;
    setSwitchingBudget(true);
    setToast(null);
    startTransition(async () => {
      const res = await switchBudgetAction(target);
      setSwitchingBudget(false);
      if (!res.ok) {
        setToast({ kind: "error", message: res.message || "Couldn't switch budget." });
        return;
      }
      activeBudgetIdRef.current = res.activeBudgetId;
      setActiveBudgetId(res.activeBudgetId);
      setRegistry(res.registry);
      setState(res.state);
      setDrill(null);
      setActiveSection("dashboard");
    });
  }, []);

  // Create a brand-new blank-slate budget and switch straight into it.
  const handleCreateBudget = useCallback((label) => {
    const name = (label || "").trim();
    if (!name) return;
    setSwitchingBudget(true);
    setToast(null);
    startTransition(async () => {
      const res = await createBudgetAction(name);
      setSwitchingBudget(false);
      if (!res.ok) {
        setToast({ kind: "error", message: res.message || "Couldn't create budget." });
        return;
      }
      activeBudgetIdRef.current = res.activeBudgetId;
      setActiveBudgetId(res.activeBudgetId);
      setRegistry(res.registry);
      setState(res.state);
      setDrill(null);
      setActiveSection("dashboard");
      setToast({ kind: "success", message: `"${name}" created — blank slate ready.` });
    });
  }, []);

  // ── Hero number math ────────────────────────────────────────────────

  const hero = useMemo(() => computeHero(state), [state]);

  const streaks = useMemo(() => computeStreaks(state), [state]);
  const achievements = useMemo(() => computeAchievements(state), [state]);
  const achievementsUnlocked = achievements.filter((a) => a.unlocked).length;
  const isMobile = useIsMobile();
  // Experience gate: "basic" keeps the app to the money essentials and
  // hides the gamified surfaces (Habits, Achievements). This is now the
  // DEFAULT — a personal household budget shouldn't open onto a wall of
  // features. Opt into the advanced view by setting experience === "full".
  const isBasic = state.settings.experience !== "full";

  // Auto-activate the profile whose clerk_user_id matches the logged
  // in Clerk user. Runs once when state + userId first load — keeps
  // explicit `active_profile_id` overrides intact thereafter.
  const autoProfileAppliedRef = useRef(false);
  useEffect(() => {
    if (autoProfileAppliedRef.current) return;
    if (!userId) return;
    const profiles = state.profiles || [];
    if (profiles.length === 0) return;
    const match = profiles.find((p) => p.clerk_user_id === userId);
    if (match && state.active_profile_id !== match.id) {
      updateState((s) => ({ ...s, active_profile_id: match.id }));
    }
    autoProfileAppliedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, state.profiles]);

  // Auto-detect newly unlocked achievements between renders and
  // celebrate. The first render of the session seeds the baseline so
  // we don't fire for every achievement already earned at page load.
  const prevUnlockedRef = useRef(null);
  useEffect(() => {
    const currentSet = new Set(achievements.filter((a) => a.unlocked).map((a) => a.id));
    if (prevUnlockedRef.current === null) {
      prevUnlockedRef.current = currentSet;
      return;
    }
    const newlyUnlocked = achievements.filter((a) => a.unlocked && !prevUnlockedRef.current.has(a.id));
    if (newlyUnlocked.length > 0) {
      // Fire confetti once with extra particles; toast the first one
      // (queueing N toasts would be noisy).
      fireConfetti({ count: 120, originY: 0.4 });
      const top = newlyUnlocked[0];
      setToast({ kind: "success", message: `Achievement unlocked — ${top.label}${newlyUnlocked.length > 1 ? ` (+${newlyUnlocked.length - 1} more)` : ""}` });
    }
    prevUnlockedRef.current = currentSet;
  }, [achievements]);

  // Auto-detect newly-completed goals: a goal whose progress crosses
  // 100% gets `completed_at` stamped and triggers a celebration. Skip
  // goals already marked complete and goals with no target set.
  useEffect(() => {
    const goals = state.goals || [];
    const monthlyRate = 0; // ETA isn't relevant here; we just need value/target
    for (const g of goals) {
      if (g.completed_at) continue;
      const prog = computeGoalProgress(g, state, monthlyRate);
      if (prog.target > 0 && prog.value >= prog.target) {
        updateState((s) => ({
          ...s,
          goals: (s.goals || []).map((x) => x.id === g.id ? { ...x, completed_at: new Date().toISOString() } : x),
        }));
        fireConfetti({ count: 150, originY: 0.4 });
        setToast({ kind: "success", message: `Goal complete — ${g.label}` });
        break; // one celebration per render
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.goals, state.properties, state.assets, state.debts, state.income_sources, state.categories]);

  // Theme switcher — resolves the stored choice (daylight / midnight /
  // aurora, or "system") to a concrete palette id, then writes it to a
  // scoped wrapper attribute. Stays off <html> so the rentblackbear
  // shell's own data-theme system (in app/layout.jsx + app/globals.css)
  // is untouched when the user is on this page.
  const themeChoice = state.settings.theme || DEFAULT_THEME;
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveThemeId(themeChoice, false));
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (themeChoice !== "system") {
      setResolvedTheme(resolveThemeId(themeChoice, false));
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolvedTheme(resolveThemeId("system", mq.matches));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [themeChoice]);

  return (
    <div id="bb-budget-root" data-bb-theme={resolvedTheme} style={STYLES.page}>
      <style dangerouslySetInnerHTML={{ __html: themeStylesheet() }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .bb-edit-btn:hover { background: ${COLORS.surfaceAlt} !important; }
        .bb-edit-btn:focus { outline: 2px solid ${COLORS.accentSoft}; outline-offset: 1px; }
        .bb-tile:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(15,23,41,0.08); border-color: ${COLORS.borderStrong} !important; }
        .bb-tile { transition: all 0.18s ease; }
        .bb-row { border-bottom: 1px solid ${COLORS.border}; transition: background 0.12s ease; }
        .bb-row:last-child { border-bottom: none; }
        .bb-row.bb-row-faint { border-bottom-color: ${COLORS.surfaceTint}; }
        .bb-row:hover { background: ${COLORS.surfaceTint}; }
        .bb-row-income:hover { background: rgba(19,138,96,0.05); }
        .bb-row:hover .bb-step-btn { opacity: 1 !important; }
        .bb-step-btn:hover { background: ${COLORS.surfaceAlt} !important; color: ${COLORS.text} !important; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes bb-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes bb-toast-in { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bb-wiggle {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        /* iOS Safari polish */
        body, button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
        /* Kill the 300 ms tap delay iOS adds for double-tap-to-zoom on
           interactive elements. */
        button, [role="button"], a, input, select, textarea, label {
          touch-action: manipulation;
        }
        /* Smooth-scroll any overflow:auto container on iOS. */
        [class*="bb-row"], [style*="overflow-y: auto"], [style*="overflowY"] {
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 899px) {
          /* Prevent iOS Safari's auto-zoom on input focus when font-size < 16px */
          input[type=number], input[type=text], input[type=date], input[type=email], textarea, select {
            font-size: 16px !important;
          }
          /* Touch devices have no hover — keep delete + stepper affordances visible */
          .bb-step-btn { opacity: 0.5 !important; }
          .bb-row:hover .bb-step-btn { opacity: 1 !important; }
          /* Apple HIG recommends 44 pt tap targets; 40 keeps dense rows
             usable without breaking the existing visual scale. */
          button, [role="button"] { min-height: 40px; }
          /* Allow vertical-only swipe on body — prevents bounce-back when
             the user is interacting with horizontally-scrolling strips
             like the heatmap. */
          html, body { overscroll-behavior-y: contain; }
          /* Pop-up sheets become bottom-anchored, full-width sheets —
             the native iOS feel, and they stop overflowing the screen. */
          .bb-modal { padding: 0 !important; place-items: end stretch !important; }
          .bb-modal-card {
            max-width: 100% !important; width: 100% !important;
            max-height: 92dvh !important;
            border-radius: 20px 20px 0 0 !important;
          }
          /* Income rows stack: label on its own line, controls beneath. */
          .bb-income-row { grid-template-columns: 1fr 1fr !important; }
          .bb-income-row > :first-child { grid-column: 1 / -1 !important; }
          /* Keep the big "amount" field big on mobile — the generic
             16px input rule above would otherwise shrink it. (≥16px so
             iOS still won't zoom on focus.) */
          input.bb-amount-input { font-size: 30px !important; }
        }
        /* A11y: focus rings only on keyboard navigation, never mouse */
        *:focus { outline: none; }
        *:focus-visible {
          outline: 2px solid ${COLORS.accent};
          outline-offset: 2px;
          border-radius: 6px;
        }
        button:focus-visible,
        a:focus-visible,
        select:focus-visible,
        input:focus-visible {
          outline: 2px solid ${COLORS.accent};
          outline-offset: 2px;
        }
        /* Skip-to-content link only visible on keyboard focus */
        .bb-skip {
          position: fixed; top: 0; left: 0; z-index: 100;
          background: ${COLORS.text}; color: #fff;
          padding: 10px 14px; border-radius: 0 0 8px 0;
          font-size: 13px; font-weight: 700; font-family: ${FONT};
          transform: translateY(-100%);
          transition: transform 0.15s ease;
        }
        .bb-skip:focus { transform: translateY(0); }
        /* Visually hidden but available to screen readers */
        .bb-sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
        @media (max-width: 540px) {
          .bb-hero-num { font-size: 56px !important; }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      ` }} />
      <a href="#bb-main" className="bb-skip">Skip to main content</a>
      <div role="status" aria-live="polite" aria-atomic="true" className="bb-sr-only">
        {pending ? "Saving changes" : "All changes saved"}
      </div>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {hasData && !isMobile && (
          <Sidebar
            active={activeSection}
            onChange={setActiveSection}
            achievementsUnlocked={achievementsUnlocked}
            achievementsTotal={achievements.length}
            streak={streaks.trackedStreak}
            lastEdit={state.last_modified_at}
            pending={pending}
            registry={registry}
            activeBudgetId={activeBudgetId}
            onSwitchBudget={handleSwitchBudget}
            onCreateBudget={handleCreateBudget}
            switchingBudget={switchingBudget}
            isBasic={isBasic}
          />
        )}
        <div style={{ flex: 1, minWidth: 0, paddingBottom: hasData && isMobile ? "calc(72px + env(safe-area-inset-bottom))" : 0 }}>
          <BudgetHeader pending={pending} />

          <main id="bb-main" style={STYLES.inner}>
            {!hasData ? (
              <EmptyState onStart={handleSeed} seeding={seeding} />
            ) : activeSection === "envelopes" ? (
              <EnvelopesView state={state} updateState={updateState} activeMonth={activeMonth} setActiveMonth={setActiveMonth} />
            ) : activeSection === "money" ? (
              <MoneyView state={state} setDrill={setDrill} />
            ) : activeSection === "more" ? (
              <MoreMenu onNavigate={setActiveSection} isBasic={isBasic} />
            ) : activeSection === "habits" && !isBasic ? (
              <HabitsView state={state} updateState={updateState} />
            ) : activeSection === "goals" ? (
              <GoalsView state={state} updateState={updateState} />
            ) : activeSection === "achievements" && !isBasic ? (
              <AchievementsGridView achievements={achievements} streaks={streaks} />
            ) : activeSection === "settings" ? (
              <SettingsView state={state} updateState={updateState} />
            ) : (
              <DashboardLayout
                state={state}
                updateState={updateState}
                hero={hero}
                streaks={streaks}
                achievements={achievements}
                activeMonth={activeMonth}
                setActiveMonth={setActiveMonth}
                setActiveSection={setActiveSection}
                setDrill={setDrill}
                setToast={setToast}
                onLog={openLog}
                isBasic={isBasic}
                pending={pending}
                editingLayout={editingLayout}
                setEditingLayout={setEditingLayout}
              />
            )}
          </main>
        </div>
      </div>

      {drill && (
        <DrillSheet onClose={() => setDrill(null)}>
          {drill === "rentals" && <RentalsDrill state={state} updateState={updateState} />}
          {drill === "networth" && <NetWorthDrill state={state} updateState={updateState} />}
          {drill === "heloc" && <HelocDrill state={state} updateState={updateState} />}
          {drill === "mom" && <MomLoanDrill state={state} updateState={updateState} />}
        </DrillSheet>
      )}

      {showShortcutsHelp ? (
        <ShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />
      ) : null}
      {toasts.length > 0 ? (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          display: "grid", gap: 8, zIndex: 60,
          width: "max-content", maxWidth: "calc(100vw - 32px)",
        }}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              kind={t.kind}
              message={t.message}
              onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            />
          ))}
        </div>
      ) : null}

      {addOpen && (
        <AddSheet
          state={state}
          initialCategory={addPreset}
          onClose={() => { setAddOpen(false); setAddPreset(null); }}
          onAddExpense={(entry) => {
            updateState((s) => ({
              ...s,
              monthly_actuals: [...(s.monthly_actuals || []), entry],
            }));
            fireConfetti({ count: 40, originY: 0.45 });
            setToast({ kind: "success", message: `Logged ${fmtUsd(entry.amount_cents)} to ${entry.category_label}` });
            setAddOpen(false);
          }}
          onAddIncome={(source) => {
            updateState((s) => ({
              ...s,
              income_sources: [...(s.income_sources || []), source],
            }));
            fireConfetti({ count: 40, originY: 0.45 });
            setToast({ kind: "success", message: `Added income · ${source.label}` });
            setAddOpen(false);
          }}
        />
      )}

      {hasData && isMobile && (
        <MobileNav
          active={activeSection}
          onChange={setActiveSection}
          onAdd={() => openLog()}
          onEditNav={() => setNavEditorOpen(true)}
          navIds={resolveMobileNav(state.settings, isBasic)}
          achievementsUnlocked={achievementsUnlocked}
          streak={streaks.trackedStreak}
        />
      )}

      {hasData && !isMobile && (
        <FAB onClick={() => openLog()} bottomOffset={24} />
      )}

      {navEditorOpen && (
        <MobileNavEditor
          sections={allowedNavSections(isBasic)}
          pinned={rawMobileNav(state.settings, isBasic)}
          active={activeSection}
          onToggle={toggleMobileNavTab}
          onNavigate={(id) => { setActiveSection(id); setNavEditorOpen(false); }}
          onClose={() => setNavEditorOpen(false)}
        />
      )}
    </div>
  );
}

// On-screen numeric keypad — the amount step uses this instead of the
// OS keyboard: feels native, never triggers iOS zoom, keeps the flow
// fully under our control.
function Keypad({ onKey }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
      padding: "10px 12px 14px",
    }}>
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onKey(k)}
          aria-label={k === "del" ? "Delete" : k}
          style={{
            height: 58, borderRadius: 16, border: "none", cursor: "pointer", fontFamily: FONT,
            background: COLORS.surface, color: COLORS.text,
            fontSize: 24, fontWeight: 700, display: "grid", placeItems: "center",
            boxShadow: "0 1px 2px rgba(15,23,41,0.06)",
            WebkitTapHighlightColor: "transparent",
            transition: "background 0.08s ease, transform 0.06s ease",
          }}
          onPointerDown={(e) => { e.currentTarget.style.background = COLORS.accentSoft; e.currentTarget.style.transform = "scale(0.96)"; }}
          onPointerUp={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.transform = ""; }}
          onPointerLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.transform = ""; }}
        >
          {k === "del"
            ? <Icon d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M18 9l-6 6 M12 9l6 6" size={22} />
            : k}
        </button>
      ))}
    </div>
  );
}

// Full-screen, two-step Add flow — Step 1: amount on a custom keypad.
// Step 2: category (expense, ranked by how often you use it) or the
// source details (income). Theme-aware — uses the app's own surface
// colors, so it's light/dark with the rest of the app.
function AddSheet({ state, onClose, onAddExpense, onAddIncome, initialCategory }) {
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [mode, setMode] = useState("expense"); // "expense" | "income"
  const [step, setStep] = useState(0);          // 0 = amount, 1 = details
  const [amt, setAmt] = useState("");
  const [err, setErr] = useState("");

  // Expense step 2
  const [note, setNote] = useState("");
  const [category, setCategory] = useState(initialCategory ?? null);
  const [search, setSearch] = useState("");
  const [paidOn, setPaidOn] = useState(todayISO);
  const [dateOpen, setDateOpen] = useState(false);
  // Income step 2
  const [incLabel, setIncLabel] = useState("");
  const [incFreq, setIncFreq] = useState("biweekly");
  const [incOwner, setIncOwner] = useState("joint");

  // Lock the page behind the full-screen flow so it doesn't show its
  // own scrollbar alongside the category list's.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const amountCents = Math.round((parseFloat(amt) || 0) * 100);

  const keyPress = (k) => {
    setErr("");
    setAmt((cur) => {
      if (k === "del") return cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : (cur === "" ? "0." : `${cur}.`);
      if (cur.includes(".")) {
        if (cur.split(".")[1].length >= 2) return cur; // max 2 decimals
      } else if (cur.replace(".", "").length >= 7) {
        return cur; // cap at ~$99,999.99
      }
      if (cur === "0") return k; // replace a lone leading zero
      return cur + k;
    });
  };

  const categories = state.categories || [];
  const usage = useMemo(() => {
    const u = {};
    for (const a of state.monthly_actuals || []) {
      const k = (a.category_label || "").toLowerCase();
      u[k] = (u[k] || 0) + 1;
    }
    return u;
  }, [state.monthly_actuals]);
  const predicted = useMemo(() => predictCategory(note, categories), [note, categories]);
  // Categories ranked by how often the user actually logs to them, so
  // the common picks sit at the top. Before any usage exists, fall back
  // to the user's own grouping + arrangement (Envelopes order) — never
  // a flat A–Z wall.
  const ranked = useMemo(() => {
    const groupOrder = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
    const groupIdx = (c) => {
      const i = groupOrder.indexOf(c.group_key || "other");
      return i < 0 ? groupOrder.length : i;
    };
    return categories.slice().sort((a, b) => {
      const ua = usage[a.label.toLowerCase()] || 0;
      const ub = usage[b.label.toLowerCase()] || 0;
      if (ub !== ua) return ub - ua;
      const ga = groupIdx(a);
      const gb = groupIdx(b);
      if (ga !== gb) return ga - gb;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  }, [categories, usage]);
  const q = search.trim().toLowerCase();
  const shownCategories = q
    ? ranked.filter((c) => c.label.toLowerCase().includes(q))
    : ranked;
  const effectiveCategory = category ?? predicted?.label ?? null;

  const amtDisplay = (() => {
    const raw = amt === "" ? "0" : amt;
    const [ip, dp] = raw.split(".");
    const grouped = Number(ip || "0").toLocaleString("en-US");
    return raw.includes(".") ? `${grouped}.${dp}` : grouped;
  })();

  const goNext = () => {
    if (amountCents <= 0) { setErr("Enter an amount first."); return; }
    setErr("");
    setStep(1);
  };
  const finish = () => {
    if (mode === "expense") {
      if (!effectiveCategory) { setErr("Pick a category."); return; }
      onAddExpense({
        id: genId(),
        category_label: effectiveCategory,
        month: `${paidOn.slice(0, 7)}-01`,
        paid_on: paidOn,
        amount_cents: amountCents,
        note: note.trim() || undefined,
      });
    } else {
      onAddIncome({
        label: incLabel.trim() || "New income",
        owner: incOwner,
        source_type: "salary",
        frequency: incFreq,
        net_amount_cents: amountCents,
      });
    }
  };

  const labelStyle = {
    display: "block", fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: COLORS.textFaint, marginBottom: 8,
  };
  const chip = (active, label, onClick, key) => (
    <button
      key={key}
      onClick={onClick}
      style={{
        padding: "10px 14px", borderRadius: 100, cursor: "pointer", fontFamily: FONT,
        fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
        border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
        background: active ? COLORS.accent : COLORS.surface,
        color: active ? "#fff" : COLORS.text,
      }}
    >
      {label}
    </button>
  );
  const headerBtn = {
    background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT,
    fontSize: 14, fontWeight: 600, color: COLORS.accent, padding: "6px 4px",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: COLORS.surface, fontFamily: FONT,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        width: "100%", maxWidth: 480, margin: "0 auto",
        flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          paddingTop: "max(14px, env(safe-area-inset-top))",
          display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
          padding: "max(14px, env(safe-area-inset-top)) 12px 10px",
        }}>
          <div style={{ justifySelf: "start" }}>
            {step === 0 ? (
              <button onClick={onClose} style={headerBtn}>Cancel</button>
            ) : (
              <button onClick={() => { setStep(0); setErr(""); }} style={headerBtn}>Back</button>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>
            {mode === "expense" ? "Add expense" : "Add income"}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              justifySelf: "end", width: 32, height: 32, borderRadius: 9,
              border: "none", background: COLORS.surfaceTint, color: COLORS.textMuted,
              cursor: "pointer", display: "grid", placeItems: "center",
            }}
          >
            <Icon d={ICON.x} size={15} />
          </button>
        </div>
        {/* Progress */}
        <div style={{ display: "flex", gap: 4, padding: "0 14px 4px" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: step >= i ? COLORS.accent : COLORS.surfaceTint,
              transition: "background 0.2s ease",
            }} />
          ))}
        </div>

        {step === 0 ? (
          <>
            <div style={{ padding: "14px 16px 0" }}>
              <div style={{ display: "flex", background: COLORS.surfaceTint, borderRadius: 13, padding: 4, gap: 4 }}>
                {[["expense", "Expense"], ["income", "Income"]].map(([m, label]) => {
                  const on = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setErr(""); }}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                        fontFamily: FONT, fontSize: 13.5, fontWeight: 700,
                        background: on ? COLORS.accent : "transparent",
                        color: on ? "#fff" : COLORS.textMuted,
                        boxShadow: on ? "0 4px 12px rgba(15,23,41,0.16)" : "none",
                        transition: "all 0.14s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{
              flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "20px 16px",
            }}>
              <div style={{
                width: "100%", background: COLORS.accentSoft, borderRadius: 24,
                padding: "30px 20px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.accent }}>
                  {mode === "expense" ? "Amount spent" : "Amount per paycheck"}
                </span>
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 4,
                  fontWeight: 800, letterSpacing: "-0.03em",
                  fontVariantNumeric: "tabular-nums", lineHeight: 1.05,
                }}>
                  <span style={{ fontSize: 40, color: COLORS.accent }}>$</span>
                  <span style={{ fontSize: 68, color: amt === "" ? COLORS.textFaint : COLORS.text }}>
                    {amtDisplay}
                  </span>
                </div>
              </div>
              {err && <span style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: COLORS.red }}>{err}</span>}
            </div>
            <div style={{
              background: COLORS.surfaceTint, borderTop: `1px solid ${COLORS.border}`,
              borderRadius: "20px 20px 0 0",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}>
              <div style={{ padding: "14px 16px 2px" }}>
                <button
                  onClick={goNext}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "15px 0", fontSize: 15, fontWeight: 800, fontFamily: FONT,
                    borderRadius: 14, cursor: "pointer",
                    border: amountCents <= 0 ? `1px solid ${COLORS.border}` : "none",
                    background: amountCents <= 0 ? COLORS.surface : COLORS.text,
                    color: amountCents <= 0 ? COLORS.textFaint : "#fff",
                    boxShadow: amountCents <= 0 ? "none" : "0 8px 20px rgba(13,20,36,0.28)",
                    transition: "all 0.14s ease",
                  }}
                >
                  Next
                  <Icon d="M5 12h14 M13 5l7 7-7 7" size={15} color={amountCents <= 0 ? COLORS.textFaint : "#fff"} />
                </button>
              </div>
              <Keypad onKey={keyPress} />
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "16px" }}>
              <div style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${COLORS.surfaceTint}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>
                  {mode === "expense" ? "Spending" : "Income"}
                </span>
                <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>
                  ${amtDisplay}
                </span>
              </div>

              {mode === "expense" ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <span style={labelStyle}>What for?</span>
                    <input
                      type="text"
                      placeholder="e.g. costco run, shell gas"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      aria-label="Note"
                      style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", padding: "12px 14px", fontWeight: 600 }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={labelStyle}>
                      Category{predicted && !category ? " · suggested" : ""}
                    </span>
                    <input
                      type="text"
                      placeholder="Search categories"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search categories"
                      style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", padding: "11px 14px", fontWeight: 600, marginBottom: 8 }}
                    />
                    <div style={{ display: "grid", gap: 4 }}>
                      {shownCategories.length === 0 && (
                        <span style={{ fontSize: 13, color: COLORS.textFaint, fontStyle: "italic", padding: "6px 2px" }}>
                          No match. Add envelopes in the Envelopes tab.
                        </span>
                      )}
                      {shownCategories.map((c) => {
                        const sel = c.label === effectiveCategory;
                        const count = usage[c.label.toLowerCase()] || 0;
                        return (
                          <button
                            key={c.label}
                            onClick={() => { setCategory(c.label); setErr(""); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 10, width: "100%",
                              padding: "12px 14px", borderRadius: 12, cursor: "pointer", fontFamily: FONT,
                              textAlign: "left",
                              border: `1px solid ${sel ? COLORS.accent : COLORS.border}`,
                              background: sel ? `${COLORS.accent}14` : COLORS.surface,
                            }}
                          >
                            <span style={{
                              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                              border: `2px solid ${sel ? COLORS.accent : COLORS.border}`,
                              background: sel ? COLORS.accent : "transparent",
                              display: "grid", placeItems: "center",
                            }}>
                              {sel && <Icon d="M20 6L9 17l-5-5" size={11} color="#fff" />}
                            </span>
                            <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: sel ? 700 : 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {c.label}
                            </span>
                            {count > 0 && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textFaint }}>
                                {count}×
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    {dateOpen ? (
                      <>
                        <span style={labelStyle}>When</span>
                        <input
                          type="date"
                          value={paidOn}
                          onChange={(e) => setPaidOn(e.target.value || todayISO)}
                          aria-label="Date"
                          style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", padding: "11px 14px", fontWeight: 600 }}
                        />
                      </>
                    ) : (
                      <button
                        onClick={() => setDateOpen(true)}
                        style={{
                          background: "transparent", border: "none", padding: 0, cursor: "pointer",
                          fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: COLORS.textMuted,
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}
                      >
                        <Icon d={ICON.calendar} size={13} color={COLORS.textFaint} />
                        {paidOn === todayISO ? "Today" : paidOn} · change date
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <span style={labelStyle}>What is it?</span>
                    <input
                      type="text"
                      placeholder="e.g. My paycheck, Side gig"
                      value={incLabel}
                      onChange={(e) => setIncLabel(e.target.value)}
                      aria-label="Income label"
                      style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", padding: "12px 14px", fontWeight: 600 }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={labelStyle}>How often?</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[
                        ["weekly", "Weekly"], ["biweekly", "Every 2 weeks"],
                        ["semimonthly", "Twice a month"], ["monthly", "Monthly"], ["yearly", "Yearly"],
                      ].map(([f, label]) => chip(incFreq === f, label, () => setIncFreq(f), f))}
                    </div>
                  </div>
                  <div>
                    <span style={labelStyle}>Whose income?</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[
                        ["harrison", "You"], ["wife", "Partner"], ["joint", "Joint"], ["other", "Other"],
                      ].map(([o, label]) => chip(incOwner === o, label, () => setIncOwner(o), o))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: "12px 16px max(12px, env(safe-area-inset-bottom))", borderTop: `1px solid ${COLORS.surfaceTint}` }}>
              {err && (
                <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.red, marginBottom: 8, textAlign: "center" }}>{err}</div>
              )}
              <button
                onClick={finish}
                style={{ ...btn("primary"), width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15 }}
              >
                <Icon d={["M12 5v14", "M5 12h14"]} size={15} />
                {mode === "expense" ? "Add expense" : "Add income"} · ${amtDisplay}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Header / sidebar replacement (slim top bar for now) ──────────────

function BudgetHeader({ pending }) {
  return (
    <header style={{
      background: COLORS.surface,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 10,
      backdropFilter: "saturate(180%) blur(8px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/admin" style={{ color: COLORS.textMuted, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d={ICON.chevL} size={14} /> Admin
        </a>
        <div style={{ width: 1, height: 18, background: COLORS.border }} />
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>Budget</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {pending && (
          <span style={{ fontSize: 12, color: COLORS.textFaint }}>saving…</span>
        )}
      </div>
    </header>
  );
}

// ── Empty state ──────────────────────────────────────────────────────

function EmptyState({ onStart, seeding }) {
  return (
    <div style={{
      ...STYLES.card,
      padding: 48,
      textAlign: "center",
      marginTop: 32,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, margin: "0 auto 18px",
        background: COLORS.accentSoft, color: COLORS.accent,
        display: "grid", placeItems: "center",
      }}>
        <Icon d={ICON.scales} size={28} />
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
        Your budget, one screen
      </h1>
      <p style={{ color: COLORS.textMuted, fontSize: 14, maxWidth: 480, margin: "0 auto 22px", lineHeight: 1.55 }}>
        Household expenses, rental cash flow, net worth, HELOC payoff, family loans — all in one place. Start with a clean template, fill in your numbers, edit anything anytime.
      </p>
      <button
        onClick={onStart}
        disabled={seeding}
        style={{
          ...btn("primary"),
          fontSize: 14,
          padding: "12px 22px",
          opacity: seeding ? 0.7 : 1,
        }}
      >
        {seeding ? "Setting up…" : "Start fresh"}
      </button>
      <div style={{ marginTop: 14, fontSize: 12, color: COLORS.textFaint }}>
        We'll seed common categories at $0. You can rename, add, delete, or zero out anything you don't use.
      </div>
    </div>
  );
}

// ── Hero number ──────────────────────────────────────────────────────

const MODE_LABELS = {
  conservative: { title: "Saved this month", sub: "after vacancy & CapEx reserves" },
  optimistic: { title: "Saved this month", sub: "if every room is rented" },
  rentals_only: { title: "Rental cash flow", sub: "after reserves, salary excluded" },
};

function HeroNumber({ hero, mode, onModeChange, state }) {
  const value = hero[mode];
  const isZero = value === 0;
  const positive = value > 0;
  const valueColor = isZero ? COLORS.text : positive ? COLORS.green : COLORS.red;
  const sign = isZero ? "" : positive ? "+" : "−";
  const totalIn = hero.incomeMonthlyTotal + hero.rentalGross;
  const totalOut = hero.personalMonthlyTotal + hero.rentalExpensesWithReserves + hero.businessMonthlyTotal;
  const mood = moodForCashflow(value);
  // Pool: state-aware facts first, then mood-specific generic nudges.
  // The state-aware ones surface real numbers from the live blob so the
  // mascot teaches rather than greets.
  const messages = useMemo(() => {
    const generic = MASCOT_MESSAGES[mood] || MASCOT_MESSAGES.neutral;
    const context = state ? contextMascotMessages(state) : [];
    return [...context, ...generic];
  }, [mood, state]);
  const [msgIdx, setMsgIdx] = useState(0);
  const message = messages[msgIdx % messages.length];
  return (
    <section style={{
      ...STYLES.card,
      marginTop: 16,
      padding: "32px 24px 28px",
      textAlign: "center",
      overflow: "hidden",
      position: "relative",
    }}>
      <div
        onClick={() => setMsgIdx((i) => i + 1)}
        role="button"
        tabIndex={0}
        aria-label={`Mascot — ${mood}. Tap for a different note.`}
        style={{
          position: "absolute", top: 16, right: 16,
          display: "flex", alignItems: "center", gap: 10,
          maxWidth: "min(280px, 60%)",
          cursor: "pointer", userSelect: "none",
        }}
      >
        <div style={{
          fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
          textAlign: "right", lineHeight: 1.4,
          background: COLORS.surfaceAlt,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12, padding: "8px 10px",
          position: "relative",
          maxWidth: 200,
        }}>
          {message}
          <span style={{
            position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
            width: 10, height: 10, background: COLORS.surfaceAlt,
            borderRight: `1px solid ${COLORS.border}`, borderTop: `1px solid ${COLORS.border}`,
            transform: "translateY(-50%) rotate(45deg)",
          }} />
        </div>
        <Mascot mood={mood} size={60} />
      </div>
      <div style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        background: COLORS.surfaceAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 100,
        marginBottom: 22,
      }}>
        {Object.keys(MODE_LABELS).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 100,
              border: "none",
              background: m === mode ? COLORS.text : "transparent",
              color: m === mode ? "#fff" : COLORS.textMuted,
              cursor: "pointer",
              transition: "all 0.15s ease",
              letterSpacing: 0,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {m.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="bb-hero-num" style={{
        fontSize: "clamp(52px, 12vw, 104px)",
        fontWeight: 800,
        letterSpacing: "-0.045em",
        lineHeight: 1,
        color: valueColor,
        fontVariantNumeric: "tabular-nums",
      }}>
        {sign}<AnimatedNumber value={Math.abs(value)} format={fmtUsd} />
      </div>
      <div style={{ marginTop: 10, color: COLORS.textMuted, fontSize: 14, lineHeight: 1.5 }}>
        {MODE_LABELS[mode].title} <span style={{ color: COLORS.textFaint }}>· {MODE_LABELS[mode].sub}</span>
      </div>
      <div style={{
        marginTop: 22,
        display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
      }}>
        <SummaryPill icon={ICON.arrowUp} iconColor={COLORS.green} label="In" value={fmtUsd(totalIn)} />
        <SummaryPill icon={ICON.arrowDn} iconColor={COLORS.red}   label="Out" value={fmtUsd(totalOut)} />
      </div>
    </section>
  );
}

function SummaryPill({ icon, iconColor, label, value }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 14px",
      background: COLORS.surfaceAlt,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 100,
      fontSize: 13,
    }}>
      <Icon d={icon} size={14} color={iconColor} />
      <span style={{ color: COLORS.textMuted, fontWeight: 600 }}>{label}</span>
      <strong style={{ color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{value}</strong>
    </span>
  );
}

// ── Month scrubber ───────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MonthScrubber({ value, onChange }) {
  const [year, month] = value.split("-").map(Number);
  const months = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const m = i + 1;
      arr.push({
        iso: `${year}-${String(m).padStart(2, "0")}-01`,
        label: MONTH_NAMES[i],
        current: m === month,
      });
    }
    return arr;
  }, [year, month]);

  return (
    <div style={{
      marginTop: 16,
      display: "flex", gap: 4,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 6,
      scrollSnapType: "x mandatory",
    }}>
      {months.map((m) => (
        <button
          key={m.iso}
          onClick={() => onChange(m.iso)}
          style={{
            flex: "0 0 auto",
            padding: "9px 15px",
            borderRadius: 13,
            border: "none",
            background: m.current ? COLORS.accent : COLORS.surfaceTint,
            color: m.current ? COLORS.onAccent : COLORS.textMuted,
            fontSize: 12.5, fontWeight: 700,
            cursor: "pointer",
            scrollSnapAlign: "center",
            transition: "all 0.15s ease",
            boxShadow: m.current ? COLORS.shadow : "none",
          }}
        >
          {m.label} <span style={{ opacity: 0.65, fontWeight: 500 }}>{String(year).slice(2)}</span>
        </button>
      ))}
    </div>
  );
}

// ── Tile grid ────────────────────────────────────────────────────────

function TileGrid({ children }) {
  return (
    <div style={{
      marginTop: 20,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 16,
    }}>
      {children}
    </div>
  );
}

// Base tile presentation. children = body content, action = primary number.
function Tile({ title, icon, iconColor, iconBg, primary, primaryColor, secondary, footer, onClick, sparkline, action }) {
  return (
    <button
      onClick={onClick}
      className="bb-tile"
      style={{
        ...STYLES.card,
        padding: "20px 22px",
        textAlign: "left",
        cursor: "pointer",
        border: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column", gap: 14,
        background: COLORS.surface,
        fontFamily: FONT,
        minHeight: 168,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: iconBg || COLORS.surfaceAlt,
            color: iconColor || COLORS.textMuted,
            display: "grid", placeItems: "center",
          }}>
            <Icon d={icon} size={17} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.005em" }}>{title}</div>
        </div>
        <Icon d={ICON.chevR} size={14} color={COLORS.textFaint} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em",
            color: primaryColor || COLORS.text,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.05,
          }}>
            {primary}
          </div>
          {secondary && (
            <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.45 }}>{secondary}</div>
          )}
        </div>
        {sparkline && (
          <div style={{ flexShrink: 0, marginBottom: 2 }}>{sparkline}</div>
        )}
      </div>
      {(footer || action) && (
        <div style={{
          marginTop: "auto", paddingTop: 12,
          borderTop: `1px solid ${COLORS.surfaceAlt}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }}>
          {footer && (
            <div style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", flex: 1, minWidth: 0 }}>
              {footer}
            </div>
          )}
          {action}
        </div>
      )}
    </button>
  );
}

// ── The five tiles ───────────────────────────────────────────────────

function RentalsTile({ state, onClick }) {
  const ops = state.properties.filter((p) => p.status === "operating");
  const gross = ops.reduce((s, p) => s + propertyMonthlyGross(p), 0);
  const exp = ops.reduce((s, p) => s + propertyMonthlyExpenses(p, state.settings), 0);
  const noi = gross - exp;
  const history = (state.history || []).slice(-30).map((h) => h.rental_noi_cents);
  return (
    <Tile
      title="Rentals"
      icon={ICON.building}
      iconColor={COLORS.accent} iconBg={COLORS.accentSoft}
      primary={<AnimatedNumber value={noi} format={(v) => fmtUsd(v, { compact: true })} />}
      primaryColor={noi >= 0 ? COLORS.green : COLORS.red}
      secondary={`${fmtUsd(gross, { compact: true })} rent · ${fmtUsd(exp, { compact: true })} costs`}
      footer={`${ops.length} operating${state.properties.length > ops.length ? ` · ${state.properties.length - ops.length} pipeline` : ""}`}
      onClick={onClick}
      sparkline={<Sparkline values={history} />}
    />
  );
}

function NetWorthTile({ state, onClick }) {
  const propEquity = state.properties.reduce(
    (s, p) => s + (p.market_value_cents - p.mortgage_balance_cents),
    0,
  );
  const cash = state.assets.reduce((s, a) => s + a.balance_cents, 0);
  const debt = state.debts.reduce((s, d) => s + d.balance_cents, 0);
  const total = propEquity + cash - debt;
  const history = (state.history || []).slice(-30).map((h) => h.net_worth_cents);
  return (
    <Tile
      title="Net Worth"
      icon={ICON.scales}
      iconColor={COLORS.amber} iconBg={COLORS.amberBg}
      primary={<AnimatedNumber value={total} format={fmtCompact} />}
      primaryColor={total >= 0 ? COLORS.text : COLORS.red}
      secondary={`${fmtCompact(propEquity + cash)} assets · ${fmtCompact(debt)} debt`}
      footer={`${state.properties.length} properties · ${state.assets.length} accounts`}
      onClick={onClick}
      sparkline={<Sparkline values={history} />}
    />
  );
}

function HelocTile({ state, onClick }) {
  const m = state.heloc_model;
  if (!m || !m.mortgage_balance_cents) {
    return (
      <Tile
        title="HELOC Velocity"
        icon={ICON.trending}
        iconColor={COLORS.purple} iconBg={COLORS.purpleBg}
        primary="—"
        secondary="Not configured"
        footer="Tap to set up"
        onClick={onClick}
      />
    );
  }
  const plan = computeHelocPlan(m);
  const yrsSaved = plan.tradMonths && plan.helocMonths ? ((plan.tradMonths - plan.helocMonths) / 12).toFixed(1) : null;
  return (
    <Tile
      title="HELOC Velocity"
      icon={ICON.trending}
      iconColor={COLORS.purple} iconBg={COLORS.purpleBg}
      primary={<AnimatedNumber value={m.mortgage_balance_cents} format={fmtCompact} />}
      secondary={`${m.mortgage_rate_bps ? (m.mortgage_rate_bps / 100).toFixed(2) + "% mortgage" : "rate unset"} · ${m.heloc_rate_bps ? (m.heloc_rate_bps / 100).toFixed(2) + "% HELOC" : ""}`}
      footer={yrsSaved ? `${yrsSaved} years saved · ${fmtCompact(plan.savings)} interest saved` : "Tap to model"}
      onClick={onClick}
    />
  );
}

function MomLoanTile({ state, onClick, onLogPayment }) {
  const loan = state.mom_loans[0];
  if (!loan) {
    return (
      <Tile
        title="Mom's Loan"
        icon={ICON.home}
        iconColor={COLORS.amber} iconBg={COLORS.amberBg}
        primary="—"
        secondary="No loan tracked"
        footer="Tap to add"
        onClick={onClick}
      />
    );
  }
  // Net balance under the bidirectional model:
  //   net = starting_balance + out − in
  //   net > 0  → Mom owes you
  //   net < 0  → you owe Mom
  const moneyIn  = loan.payments.filter((p) => p.direction !== "out").reduce((s, p) => s + p.amount_cents, 0);
  const moneyOut = loan.payments.filter((p) => p.direction === "out").reduce((s, p) => s + p.amount_cents, 0);
  const net = loan.starting_balance_cents + moneyOut - moneyIn;
  const owesYou = net > 0;
  const youOwe = net < 0;
  return (
    <Tile
      title="Mom's Loan"
      icon={ICON.home}
      iconColor={COLORS.amber} iconBg={COLORS.amberBg}
      primary={<AnimatedNumber value={Math.abs(net)} format={(v) => fmtUsd(v, { compact: true })} />}
      primaryColor={youOwe ? COLORS.amber : net === 0 ? COLORS.green : COLORS.text}
      secondary={
        net === 0
          ? "settled up"
          : owesYou
          ? `Mom owes you · ${loan.payments.length} entr${loan.payments.length === 1 ? "y" : "ies"}`
          : `you owe Mom · ${loan.payments.length} entr${loan.payments.length === 1 ? "y" : "ies"}`
      }
      footer={`in ${fmtUsd(moneyIn, { compact: true })} · out ${fmtUsd(moneyOut, { compact: true })}`}
      onClick={onClick}
      action={
        <button
          onClick={(e) => { e.stopPropagation(); onLogPayment(); }}
          style={{
            padding: "5px 10px", borderRadius: 100,
            background: COLORS.green, color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
            fontFamily: FONT,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
        >
          + {fmtUsd(loan.monthly_payment_cents, { compact: true })} in
        </button>
      }
    />
  );
}

// ── Drill sheet (slide-up modal on mobile, side panel on desktop) ────

function DrillSheet({ children, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div
      className="bb-drill"
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: COLORS.surfaceAlt,
        display: "flex", flexDirection: "column",
        fontFamily: FONT, color: COLORS.text,
        animation: "fadeIn 0.18s ease",
      }}
    >
      {/* Full-screen top bar — always says "Budget" so the screen is
          self-explanatory, with a clear way back out. */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: 10,
        padding: "max(12px, env(safe-area-inset-top)) 16px 12px",
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <button onClick={onClose} aria-label="Back to budget" style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          height: 36, padding: "0 12px 0 8px", borderRadius: 10,
          border: `1px solid ${COLORS.border}`, cursor: "pointer",
          background: COLORS.surface, color: COLORS.textMuted,
          fontFamily: FONT, fontSize: 13.5, fontWeight: 700,
        }}>
          <Icon d={ICON.chevL || "M15 18l-6-6 6-6"} size={17} />
          Back
        </button>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textFaint }}>Budget</span>
        <button onClick={onClose} aria-label="Close" style={{
          marginLeft: "auto",
          width: 36, height: 36, borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer",
          background: COLORS.surface, color: COLORS.textMuted, display: "grid", placeItems: "center",
        }}>
          <Icon d={ICON.x} size={16} />
        </button>
      </div>
      {/* Scrollable content — fills the window, content column capped for
          readability on wide screens and centered. */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        padding: "20px 16px max(28px, env(safe-area-inset-bottom))",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {children}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }} />
    </div>
  );
}

// ── Drills (v1: read-only summaries with edit-on-next-iteration stubs) ─

// Group header labels are SHARED between the Personal drill and the
// Envelopes view — both render the same `categories`, just grouped, so
// a rename in one place must show in the other. The override lives
// under a canonical `group.<key>` slug. `envelopes.<key>` is the legacy
// slug (Envelopes-only renames before this was unified) — still read as
// a fallback so older renames survive; the next rename migrates it.
function groupLabel(state, g) {
  const sl = state?.settings?.section_labels || {};
  return sl[`group.${g}`] ?? sl[`envelopes.${g}`] ?? GROUP_META[g]?.label ?? g;
}

function renameGroup(updateState, g, value) {
  updateState((s) => {
    const prev = s.settings.section_labels || {};
    const next = { ...prev };
    delete next[`envelopes.${g}`]; // retire the legacy Envelopes-only key
    const fallback = GROUP_META[g]?.label || g;
    const trimmed = (value || "").trim();
    if (!trimmed || trimmed === fallback) delete next[`group.${g}`];
    else next[`group.${g}`] = trimmed;
    return { ...s, settings: { ...s.settings, section_labels: next } };
  });
}

function IncomeSourcesBlock({ state, updateState }) {
  const total = state.income_sources.reduce((s, i) => s + incomeMonthly(i), 0);
  return (
    <BlockCard
      title="Income"
      sub={`${fmtUsd(total, { compact: true })} / mo`}
      accent={COLORS.green}
      icon={ICON.arrowUp}
      count={state.income_sources.length > 0 ? `${state.income_sources.length} source${state.income_sources.length === 1 ? "" : "s"}` : null}
      style={{ background: `linear-gradient(180deg, ${COLORS.greenBg} 0%, ${COLORS.surface} 60%)` }}
    >
      {state.income_sources.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textMuted, padding: "6px 0", fontStyle: "italic" }}>
          Add your take-home pay to see what's left over.
        </div>
      )}
      {state.income_sources.map((i, idx) => (
        <IncomeRow
          key={idx}
          source={i}
          onChange={(patch) => updateState((s) => ({
            ...s,
            income_sources: s.income_sources.map((src, j) => j === idx ? { ...src, ...patch } : src),
          }))}
          onDelete={() => updateState((s) => ({
            ...s,
            income_sources: s.income_sources.filter((_, j) => j !== idx),
          }))}
        />
      ))}
      <AddRowButton
        label="Add income"
        accent={COLORS.green}
        onClick={() => updateState((s) => ({
          ...s,
          income_sources: [
            ...s.income_sources,
            { label: "New income", owner: "joint", source_type: "salary", frequency: "biweekly", net_amount_cents: 0 },
          ],
        }))}
      />
    </BlockCard>
  );
}

function IncomeRow({ source, onChange, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const showDelete = hovered;
  return (
    <div
      className="bb-row bb-row-income bb-income-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto auto auto",
        gap: 8, alignItems: "center", padding: "10px 4px",
      }}
    >
      <InlineText value={source.label} onChange={(v) => onChange({ label: v })} />
      <select
        value={source.owner || "joint"}
        onChange={(e) => onChange({ owner: e.target.value })}
        aria-label="Owner"
        style={{ ...inputStyle(), fontSize: 12, padding: "4px 8px" }}
      >
        <option value="harrison">harrison</option>
        <option value="wife">wife</option>
        <option value="joint">joint</option>
        <option value="other">other</option>
      </select>
      <select
        value={source.frequency}
        onChange={(e) => onChange({ frequency: e.target.value })}
        aria-label="Frequency"
        style={{ ...inputStyle(), fontSize: 12, padding: "4px 8px" }}
      >
        <option value="weekly">weekly</option>
        <option value="biweekly">biweekly</option>
        <option value="semimonthly">semimonthly</option>
        <option value="monthly">monthly</option>
        <option value="yearly">yearly</option>
      </select>
      <InlineNumber value={source.net_amount_cents} onChange={(v) => onChange({ net_amount_cents: v })} width={110} />
      <button
        onClick={onDelete}
        aria-label="Delete income"
        style={{
          width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
          background: showDelete ? COLORS.redBg : "transparent",
          color: showDelete ? COLORS.red : "transparent",
          display: "grid", placeItems: "center",
          transition: "all 0.12s ease",
        }}
      >
        <Icon d={ICON.x} size={12} />
      </button>
    </div>
  );
}

// Tiny helpers used inline by IncomeRow + future inline editors.
function InlineText({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return editing ? (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { setEditing(false); if (draft.trim() && draft !== value) onChange(draft.trim()); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      style={inputStyle()}
    />
  ) : (
    <button onClick={() => setEditing(true)} className="bb-edit-btn" style={textBtnStyle()}>{value}</button>
  );
}
// mode="currency" (default) treats `value` as cents and renders as USD.
// mode="integer"  treats `value` as a raw int (years, units, count, …)
//                 and renders it plain — bounds use the same int space.
// `suffix` appends after the rendered value in view mode ("yr", "%", etc).
function InlineNumber({ value, onChange, width = 110, min, max, allowNegative = true, mode = "currency", suffix }) {
  const isInt = mode === "integer";
  const fmtValue = isInt ? (v) => `${Math.round(v)}${suffix ? ` ${suffix}` : ""}` : (v) => fmtUsd(v);
  const fmtDraft = isInt ? (v) => String(Math.round(v)) : (v) => String((v / 100).toFixed(2));
  const parseDraft = isInt
    ? (s) => parseInt(s, 10)
    : (s) => Math.round(parseFloat(s) * 100);
  const fmtBound = isInt ? (n) => String(n) : (n) => fmtUsd(n);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(fmtDraft(value));
  const [error, setError] = useState(null);
  const [wiggleKey, setWiggleKey] = useState(0);
  useEffect(() => setDraft(fmtDraft(value)), [value, isInt]);

  // Validate the draft against optional bounds. Returns error string or null.
  const validate = (rawDraft) => {
    if (rawDraft === "" || rawDraft === "-" || rawDraft === ".") return "Enter a number";
    const n = isInt ? parseInt(rawDraft, 10) : parseFloat(rawDraft);
    if (isNaN(n)) return "Not a number";
    const normalized = isInt ? Math.round(n) : Math.round(n * 100);
    if (!allowNegative && normalized < 0) return "Must be 0 or more";
    if (min != null && normalized < min) return `Must be ≥ ${fmtBound(min)}`;
    if (max != null && normalized > max) return `Must be ≤ ${fmtBound(max)}`;
    return null;
  };

  const commit = () => {
    const err = validate(draft);
    if (err) {
      setError(err);
      setWiggleKey((k) => k + 1);
      return;
    }
    setError(null);
    setEditing(false);
    const parsed = parseDraft(draft);
    if (!isNaN(parsed)) onChange(parsed);
  };

  return editing ? (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch", gap: 2, width }}>
      <input
        key={wiggleKey}
        autoFocus
        type="number"
        step={isInt ? "1" : "0.01"}
        inputMode={isInt ? "numeric" : "decimal"}
        value={draft}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "inline-num-err" : undefined}
        onChange={(e) => { setDraft(e.target.value); if (error) setError(validate(e.target.value)); }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(fmtDraft(value)); setError(null); setEditing(false); }
        }}
        style={{
          ...inputStyle(),
          width: "100%",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          fontWeight: 700,
          borderColor: error ? COLORS.red : undefined,
          animation: error ? "bb-wiggle 0.32s cubic-bezier(0.36, 0.07, 0.19, 0.97)" : undefined,
        }}
      />
      {error ? (
        <span id="inline-num-err" role="alert" style={{ fontSize: 10, fontWeight: 700, color: COLORS.red, textAlign: "right" }}>
          {error}
        </span>
      ) : null}
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="bb-edit-btn"
      style={{
        ...textBtnStyle(),
        width,
        justifyContent: "flex-end",
        fontVariantNumeric: "tabular-nums",
        fontWeight: 700,
        color: value === 0 ? COLORS.textFaint : COLORS.text,
      }}
    >
      {fmtValue(value)}
    </button>
  );
}

function EditableRow({ label, monthly, onLabelChange, onMonthlyChange, onDelete }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [labelDraft, setLabelDraft] = useState(label);
  const [valueDraft, setValueDraft] = useState(String((monthly / 100).toFixed(2)));
  const [hovered, setHovered] = useState(false);
  useEffect(() => setLabelDraft(label), [label]);
  useEffect(() => setValueDraft(String((monthly / 100).toFixed(2))), [monthly]);
  const cols = onDelete ? "minmax(0, 1fr) 120px 22px" : "minmax(0, 1fr) 120px";
  return (
    <div
      className="bb-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: cols,
        alignItems: "center", padding: "10px 4px", gap: 10,
        minHeight: 38,
      }}
    >
      {editingLabel ? (
        <input
          autoFocus
          value={labelDraft}
          onChange={(e) => setLabelDraft(e.target.value)}
          onBlur={() => { setEditingLabel(false); if (labelDraft.trim() && labelDraft !== label) onLabelChange(labelDraft.trim()); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setLabelDraft(label); setEditingLabel(false); } }}
          style={{ ...inputStyle(), minWidth: 0 }}
        />
      ) : (
        <button onClick={() => setEditingLabel(true)} className="bb-edit-btn" style={{ ...textBtnStyle(), minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</button>
      )}
      {editingValue ? (
        <input
          autoFocus
          type="number"
          step="0.01"
          inputMode="decimal"
          value={valueDraft}
          onChange={(e) => setValueDraft(e.target.value)}
          onBlur={() => { setEditingValue(false); const n = parseFloat(valueDraft); if (!isNaN(n)) onMonthlyChange(Math.round(n * 100)); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setValueDraft(String((monthly / 100).toFixed(2))); setEditingValue(false); } }}
          style={{ ...inputStyle(), width: "100%", textAlign: "right", fontVariantNumeric: "tabular-nums" }}
        />
      ) : (
        <button onClick={() => setEditingValue(true)} className="bb-edit-btn" style={{ ...textBtnStyle(), width: "100%", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: monthly === 0 ? COLORS.textFaint : COLORS.text }}>
          {fmtUsd(monthly)}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete row"
          style={{
            width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
            background: hovered ? COLORS.redBg : "transparent",
            color: hovered ? COLORS.red : COLORS.textFaint,
            opacity: hovered ? 1 : 0.35,
            display: "grid", placeItems: "center",
            transition: "all 0.12s ease",
          }}
        >
          <Icon d={ICON.x} size={12} />
        </button>
      )}
    </div>
  );
}

function AddRowButton({ label, onClick, accent }) {
  const color = accent || COLORS.accent;
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 6, marginLeft: -8,
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        background: "transparent",
        color: color,
        fontSize: 12.5, fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT,
        display: "inline-flex", alignItems: "center", gap: 6,
        transition: "background 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceTint; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 5,
        background: color, color: "#fff",
        display: "inline-grid", placeItems: "center",
        fontSize: 13, fontWeight: 700, lineHeight: 1,
      }}>+</span>
      {label}
    </button>
  );
}

// ── Rentals drill ────────────────────────────────────────────────────

function RentalsDrill({ state, updateState }) {
  const operating = state.properties.filter((p) => p.status === "operating");
  const pipeline = state.properties.filter((p) => p.status !== "operating");
  const totalGross = operating.reduce((s, p) => s + propertyMonthlyGross(p), 0);
  const totalExp = operating.reduce((s, p) => s + propertyMonthlyExpenses(p, state.settings), 0);
  const totalNoi = totalGross - totalExp;
  const [compareOpen, setCompareOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const addProperty = () => updateState((s) => ({
    ...s,
    properties: [
      ...s.properties,
      {
        label: `Property ${s.properties.length + 1}`,
        address: null,
        status: "operating",
        market_value_cents: 0,
        mortgage_balance_cents: 0,
        mortgage_payment_cents: 0,
        mortgage_rate_bps: null,
        mortgage_term_years: null,
        mortgage_origin_date: null,
        vacancy_bps_override: null,
        capex_bps_override: null,
        sort_order: s.properties.length,
        notes: null,
        expenses: [
          { label: "Mortgage", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 0 },
          { label: "Utilities", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 1 },
          { label: "Vacancy reserve", kind: "vacancy_pct", monthly_cents: 0, pct_bps: 1000, sort_order: 2 },
          { label: "CapEx reserve", kind: "capex_pct", monthly_cents: 0, pct_bps: 500, sort_order: 3 },
        ],
        rooms: [{ label: "Bedroom 1", rent_cents: 0, occupied: false, sort_order: 0 }],
      },
    ],
  }));

  return (
    <div>
      <DrillTitle
        title="Rentals"
        subtitle={`${operating.length} operating · ${pipeline.length} pipeline · ${state.properties.reduce((s, p) => s + p.rooms.length, 0)} rooms`}
        icon={ICON.building}
        iconColor={COLORS.accent}
        iconBg={COLORS.accentSoft}
        heroValue={fmtUsd(totalNoi)}
        heroLabel={`NOI / month · ${fmtUsd(totalGross, { compact: true })} gross`}
        heroColor={totalNoi >= 0 ? COLORS.green : COLORS.red}
      />
      {state.properties.length >= 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setSellOpen(true)}
            style={{ ...btn("ghost") }}
          >
            <Icon d={["M3 3v18h18", "M7 16V9", "M12 16V6", "M17 16v-4"]} size={14} />
            Sell analysis
          </button>
          {state.properties.length >= 2 && (
            <button
              onClick={() => setCompareOpen(true)}
              style={{ ...btn("ghost") }}
            >
              <Icon d={ICON.scales} size={14} />
              Compare properties
            </button>
          )}
        </div>
      )}
      {compareOpen && (
        <PropertyComparisonSheet
          state={state}
          onClose={() => setCompareOpen(false)}
        />
      )}
      {sellOpen && (
        <SellAnalysisSheet
          state={state}
          onClose={() => setSellOpen(false)}
        />
      )}
      <div style={{ display: "grid", gap: 16, marginTop: 6 }}>
        {state.properties.length === 0 && (
          <div style={{ ...STYLES.card, padding: 24, textAlign: "center", color: COLORS.textMuted, fontSize: 14 }}>
            No properties yet. Add your first one below.
          </div>
        )}
        {state.properties.map((p, idx) => (
          <PropertyCard
            key={idx}
            property={p}
            settings={state.settings}
            onChange={(patch) => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) => i === idx ? { ...pp, ...patch } : pp),
            }))}
            onRoomChange={(ri, patch) => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, rooms: pp.rooms.map((r, j) => j === ri ? { ...r, ...patch } : r) } : pp,
              ),
            }))}
            onExpenseChange={(ei, patch) => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, expenses: pp.expenses.map((e, j) => j === ei ? { ...e, ...patch } : e) } : pp,
              ),
            }))}
            onAddRoom={() => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, rooms: [...pp.rooms, { label: `Bedroom ${pp.rooms.length + 1}`, rent_cents: 0, occupied: false, sort_order: pp.rooms.length }] } : pp,
              ),
            }))}
            onAddExpense={() => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, expenses: [...pp.expenses, { label: "New expense", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: pp.expenses.length }] } : pp,
              ),
            }))}
            onDeleteRoom={(ri) => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, rooms: pp.rooms.filter((_, j) => j !== ri) } : pp,
              ),
            }))}
            onDeleteExpense={(ei) => updateState((s) => ({
              ...s,
              properties: s.properties.map((pp, i) =>
                i === idx ? { ...pp, expenses: pp.expenses.filter((_, j) => j !== ei) } : pp,
              ),
            }))}
            onDeleteProperty={() => updateState((s) => ({
              ...s,
              properties: s.properties.filter((_, i) => i !== idx),
            }))}
          />
        ))}
        <AddRowButton label="Add property" onClick={addProperty} />

        <BusinessExpensesBlock state={state} updateState={updateState} />
      </div>
    </div>
  );
}

const BUSINESS_FREQS = [
  { id: "monthly",   label: "monthly"   },
  { id: "quarterly", label: "quarterly" },
  { id: "yearly",    label: "yearly"    },
];

function BusinessExpensesBlock({ state, updateState }) {
  const list = state.business_expenses || [];
  // Always express in equivalent monthly cents so the total reads honestly.
  const monthlyTotal = list.reduce((s, b) => {
    if (b.frequency === "yearly") return s + Math.round(b.monthly_cents / 12);
    if (b.frequency === "quarterly") return s + Math.round(b.monthly_cents / 3);
    return s + b.monthly_cents;
  }, 0);
  const update = (idx, patch) => updateState((s) => ({
    ...s,
    business_expenses: s.business_expenses.map((b, i) => i === idx ? { ...b, ...patch } : b),
  }));
  return (
    <BlockCard
      title="Real Estate Business Expenses"
      sub={`${fmtCompact(monthlyTotal)} / mo`}
      accent={COLORS.accent}
      icon={ICON.scales}
      count={`${list.length}`}
    >
      {list.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
          Umbrella policy, business cell, realtor association — track them all here.
        </div>
      )}
      {list.map((b, idx) => (
        <div key={idx} className="bb-row" style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto 22px",
          gap: 10, alignItems: "center", padding: "9px 4px",
        }}>
          <InlineText value={b.label} onChange={(v) => update(idx, { label: v })} />
          <select
            value={b.frequency || "monthly"}
            onChange={(e) => update(idx, { frequency: e.target.value })}
            aria-label="Frequency"
            style={pillSelectStyle()}
          >
            {BUSINESS_FREQS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <InlineNumber value={b.monthly_cents} onChange={(v) => update(idx, { monthly_cents: v })} width={110} />
          <button
            onClick={() => updateState((s) => ({ ...s, business_expenses: s.business_expenses.filter((_, i) => i !== idx) }))}
            aria-label="Delete expense"
            style={{
              width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
              background: "transparent", color: COLORS.textFaint, opacity: 0.4,
              display: "grid", placeItems: "center", transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
          >
            <Icon d={ICON.x} size={12} />
          </button>
        </div>
      ))}
      <AddRowButton
        label="Add business expense"
        accent={COLORS.accent}
        onClick={() => updateState((s) => ({
          ...s,
          business_expenses: [
            ...(s.business_expenses || []),
            { label: "New expense", monthly_cents: 0, frequency: "monthly", sort_order: (s.business_expenses || []).length },
          ],
        }))}
      />
    </BlockCard>
  );
}

function PropertyCard({ property, settings, onChange, onRoomChange, onExpenseChange, onAddRoom, onAddExpense, onDeleteRoom, onDeleteExpense, onDeleteProperty }) {
  const gross = propertyMonthlyGross(property);
  const opex = propertyOperatingExpenses(property, settings);
  const exp = propertyMonthlyExpenses(property, settings); // opex + HELOC
  const noi = gross - exp;
  const statusColor = property.status === "operating" ? COLORS.green : property.status === "pipeline" ? COLORS.amber : COLORS.textMuted;
  // House-hack split: the owner-occupied share of fixed costs is shown
  // as a credit row so the Expenses subtotal reconciles with the rows.
  const personalBps = property.personal_use_bps || 0;
  const fullFixed = (property.expenses || [])
    .filter((e) => e.kind === "fixed")
    .reduce((s, e) => s + e.monthly_cents, 0);
  const ownerCredit = Math.round(fullFixed * (1 - propertyRentalShare(property)));
  const analytics = useMemo(() => computePropertyAnalytics(property, settings), [property, settings]);
  return (
    <div style={{ ...STYLES.card, padding: 18 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto auto",
        alignItems: "center", gap: 12,
        marginBottom: 16, paddingBottom: 14,
        borderBottom: `1px solid ${COLORS.surfaceAlt}`,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.015em", display: "flex", alignItems: "center", gap: 8 }}>
            <InlineText value={property.label} onChange={(v) => onChange({ label: v })} />
          </div>
          <div style={{ marginTop: 4, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={property.status}
              onChange={(e) => onChange({ status: e.target.value })}
              style={{
                background: COLORS.surfaceAlt,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 100,
                padding: "3px 10px 3px 10px",
                fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: statusColor,
                cursor: "pointer", fontFamily: FONT,
                appearance: "none", WebkitAppearance: "none",
                paddingRight: 22,
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%238a93a5' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="operating">operating</option>
              <option value="pipeline">pipeline</option>
              <option value="equity_only">equity only</option>
              <option value="sold">sold</option>
            </select>
            {personalBps > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                color: COLORS.amber, background: COLORS.amberBg,
                padding: "3px 9px", borderRadius: 100,
              }}>
                House hack · {Math.round(personalBps / 100)}% home
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: noi >= 0 ? COLORS.green : COLORS.red, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
            {fmtUsd(noi)}
          </div>
          <div style={{ marginTop: 2, fontSize: 10, color: COLORS.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>NOI / month</div>
        </div>
        {onDeleteProperty && (
          <button
            onClick={onDeleteProperty}
            aria-label="Delete property"
            style={{
              width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.border}`, cursor: "pointer",
              background: COLORS.surface, color: COLORS.textMuted,
              display: "grid", placeItems: "center",
              transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; e.currentTarget.style.borderColor = COLORS.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.borderColor = COLORS.border; }}
          >
            <Icon d={ICON.x} size={14} />
          </button>
        )}
      </div>

      <PropertyAnalyticsStrip analytics={analytics} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18,
      }}>
        <div style={{ minWidth: 0 }}>
          <SectionLabel>Rooms · {fmtUsd(gross)}</SectionLabel>
          {property.rooms.map((r, ri) => (
            <div key={ri} className="bb-row" style={{
              display: "grid", gridTemplateColumns: "auto minmax(0,1fr) 110px 22px",
              alignItems: "center", padding: "10px 4px", gap: 8, minHeight: 40,
            }}>
              <OccupancyToggle occupied={r.occupied} onChange={(val) => onRoomChange(ri, { occupied: val })} />
              <InlineText value={r.label} onChange={(v) => onRoomChange(ri, { label: v })} />
              <InlineNumber value={r.rent_cents} onChange={(v) => onRoomChange(ri, { rent_cents: v, occupied: v > 0 || r.occupied })} width="100%" />
              {onDeleteRoom ? (
                <button onClick={() => onDeleteRoom(ri)} aria-label="Delete room"
                  className="bb-step-btn"
                  style={{ ...stepBtnStyle(), opacity: 0.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textMuted; }}
                >
                  <Icon d={ICON.x} size={12} />
                </button>
              ) : <span />}
            </div>
          ))}
          {onAddRoom && <AddRowButton label="Add room" onClick={onAddRoom} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <SectionLabel>Expenses · {fmtUsd(opex)}</SectionLabel>
          {property.expenses.map((e, ei) => (
            <EditableRow
              key={ei}
              label={e.label + (e.kind === "vacancy_pct" ? ` (${((e.pct_bps ?? settings.default_vacancy_bps) / 100).toFixed(0)}%)` : e.kind === "capex_pct" ? ` (${((e.pct_bps ?? settings.default_capex_bps) / 100).toFixed(0)}%)` : "")}
              monthly={e.kind === "fixed" ? e.monthly_cents : Math.round((gross * (e.pct_bps ?? (e.kind === "vacancy_pct" ? settings.default_vacancy_bps : settings.default_capex_bps))) / 10000)}
              onLabelChange={(next) => onExpenseChange(ei, { label: next })}
              onMonthlyChange={(cents) => onExpenseChange(ei, { monthly_cents: cents, kind: "fixed", pct_bps: null })}
              onDelete={onDeleteExpense ? () => onDeleteExpense(ei) : undefined}
            />
          ))}
          {ownerCredit > 0 && (
            <div className="bb-row" style={{
              display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto",
              alignItems: "center", padding: "10px 4px", gap: 8, minHeight: 40,
            }}>
              <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>
                Owner-occupied credit ({Math.round(personalBps / 100)}%)
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: COLORS.green }}>
                −{fmtUsd(ownerCredit)}
              </span>
            </div>
          )}
          {onAddExpense && <AddRowButton label="Add expense" onClick={onAddExpense} />}
        </div>
      </div>

      <MortgageDetails property={property} onChange={onChange} />
      <HelocDetails property={property} onChange={onChange} />
      <OwnerOccupiedDetails property={property} onChange={onChange} />
      <MaintenanceLog property={property} onChange={onChange} />
    </div>
  );
}

// Sell analysis — ranks rentals by TOTAL return on current equity
// (cash flow + appreciation + mortgage paydown), the metric that
// actually answers "is this equity working hard enough to keep?".
// House hacks are scored separately — they're not pure rentals.
function SellAnalysisSheet({ state, onClose }) {
  const [apprPct, setApprPct] = useState("3.0");
  const apprRate = Math.max(0, parseFloat(apprPct) || 0) / 100;

  const rows = useMemo(() => {
    return state.properties
      .filter((p) => p.status === "operating" || p.status === "pipeline")
      .map((p) => {
        const noi = propertyMonthlyGross(p) - propertyMonthlyExpenses(p, state.settings);
        const equity = (p.market_value_cents || 0) - (p.mortgage_balance_cents || 0);
        const annualCash = noi * 12;
        const appreciation = Math.round((p.market_value_cents || 0) * apprRate);
        const mp = p.mortgage_payment_cents || 0;
        const mr = (p.mortgage_rate_bps || 0) / 10000;
        const hasMortgageData = mp > 0 && mr > 0;
        // First-year principal paydown ≈ annual payments − annual interest.
        const paydown = hasMortgageData
          ? Math.max(0, mp * 12 - Math.round((p.mortgage_balance_cents || 0) * mr))
          : 0;
        const totalReturn = annualCash + appreciation + paydown;
        return {
          p, noi, equity, annualCash, appreciation, paydown, totalReturn,
          hasMortgageData,
          totalRoe: equity > 0 ? totalReturn / equity : null,
          cashRoe: equity > 0 ? annualCash / equity : null,
          personal: p.personal_use_bps || 0,
        };
      });
  }, [state.properties, state.settings, apprRate]);

  const rentals = rows.filter((r) => !r.personal).sort((a, b) => (a.totalRoe ?? 9) - (b.totalRoe ?? 9));
  const hacks = rows.filter((r) => r.personal);

  const verdict = (r) => {
    if (r.totalRoe == null) return { label: "No equity yet", color: COLORS.textMuted, bg: COLORS.surfaceTint };
    const pct = r.totalRoe * 100;
    if (pct >= 12) return { label: "Strong — keep", color: COLORS.green, bg: COLORS.greenBg };
    if (pct >= 8) return { label: "Healthy", color: COLORS.green, bg: COLORS.greenBg };
    if (pct >= 4) return { label: "Lagging", color: COLORS.amber, bg: COLORS.amberBg };
    return { label: "Review — sell candidate", color: COLORS.red, bg: COLORS.redBg };
  };
  const pctText = (v) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`);

  return (
    <div
      onClick={onClose}
      className="bb-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(15,23,41,0.55)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bb-modal-card"
        style={{
          background: COLORS.surface, borderRadius: 24,
          width: "100%", maxWidth: 640, maxHeight: "calc(100dvh - 40px)",
          boxShadow: "0 24px 80px rgba(15,23,41,0.28)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{
          position: "sticky", top: 0, zIndex: 1,
          padding: "16px 20px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
          background: COLORS.surface,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Sell analysis</div>
            <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>
              Ranked by total return on equity — worst first.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}>
            <Icon d={ICON.x} size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px 24px" }}>
          <div className="bb-row" style={{
            display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            padding: "8px 10px", background: COLORS.surfaceTint, borderRadius: 10, marginBottom: 14,
          }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.textMuted }}>Assumed yearly appreciation</span>
            <input
              type="number" step="0.5" inputMode="decimal"
              value={apprPct}
              onChange={(e) => setApprPct(e.target.value)}
              aria-label="Assumed appreciation percent"
              style={{ ...inputStyle(), width: 70, textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.textFaint }}>% / yr</span>
          </div>

          {rentals.length === 0 && (
            <div style={{ fontSize: 13, color: COLORS.textFaint, fontStyle: "italic", padding: "8px 0" }}>
              No pure rentals to rank yet.
            </div>
          )}

          {rentals.map((r, i) => {
            const v = verdict(r);
            const seg = (cents) => (r.equity > 0 ? `${((cents / r.equity) * 100).toFixed(1)}%` : "—");
            return (
              <div key={r.p.label + i} style={{
                border: `1px solid ${i === 0 ? v.color : COLORS.border}`,
                borderRadius: 12, padding: "12px 14px", marginBottom: 10,
                background: i === 0 ? v.bg : COLORS.surface,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.p.label}</span>
                  <span style={{
                    flexShrink: 0, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
                    color: v.color, background: v.bg, padding: "3px 9px", borderRadius: 100,
                  }}>{v.label}</span>
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: v.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                    {pctText(r.totalRoe)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>total return on equity</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
                  {fmtUsd(r.noi)}/mo cash flow · {fmtCompact(r.equity)} equity
                </div>
                <div style={{ marginTop: 6, fontSize: 11.5, color: COLORS.textFaint }}>
                  cash {seg(r.annualCash)} + appreciation {seg(r.appreciation)} + paydown {r.hasMortgageData ? seg(r.paydown) : "n/a"}
                  {!r.hasMortgageData && " — add mortgage rate & payment for paydown"}
                </div>
              </div>
            );
          })}

          {hacks.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ ...TYPE.eyebrow, marginBottom: 6 }}>House hacks — judged separately</div>
              {hacks.map((r, i) => (
                <div key={r.p.label + i} style={{
                  border: `1px solid ${COLORS.border}`, borderRadius: 12,
                  padding: "12px 14px", marginBottom: 10, background: COLORS.surface,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{r.p.label}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
                    {fmtUsd(r.noi)}/mo rental contribution · {Math.round(r.personal / 100)}% your home
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11.5, color: COLORS.textFaint }}>
                    A house hack isn&apos;t a pure rental — score it on how much of your housing the
                    tenants cover, not on ROE. Don&apos;t rank it against the rentals above.
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5 }}>
            <strong style={{ color: COLORS.textMuted }}>How to read it:</strong> total return on equity
            = a year of cash flow + appreciation + loan paydown, divided by the equity you have
            tied up today. Below ~4% means good money is sitting idle — sell only if you have a
            better home for that equity. Tax, depreciation recapture and selling costs aren&apos;t
            modeled — run a real net-of-sale number before you list anything.
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyComparisonSheet({ state, onClose }) {
  // Pick the two highest-NOI properties by default so the sheet opens
  // useful instead of "pick something".
  const defaultPicks = useMemo(() => {
    const byNoi = state.properties
      .map((p, idx) => ({ idx, noi: propertyMonthlyGross(p) - propertyMonthlyExpenses(p, state.settings) }))
      .sort((a, b) => b.noi - a.noi)
      .map((x) => x.idx);
    return [byNoi[0] ?? 0, byNoi[1] ?? 1];
  }, [state.properties, state.settings]);
  const [leftIdx, setLeftIdx] = useState(defaultPicks[0]);
  const [rightIdx, setRightIdx] = useState(defaultPicks[1]);

  const left = state.properties[leftIdx];
  const right = state.properties[rightIdx];
  const leftA = useMemo(() => left ? computePropertyAnalytics(left, state.settings) : null, [left, state.settings]);
  const rightA = useMemo(() => right ? computePropertyAnalytics(right, state.settings) : null, [right, state.settings]);

  // 10-year projection at 3% appreciation.
  const leftProj = useMemo(() => left ? projectPropertyROI(left, { horizonYears: 10, appreciationBps: 300 }) : [], [left]);
  const rightProj = useMemo(() => right ? projectPropertyROI(right, { horizonYears: 10, appreciationBps: 300 }) : [], [right]);

  const rows = leftA && rightA ? [
    { label: "Monthly NOI",      l: fmtUsd(leftA.monthlyNoi),               r: fmtUsd(rightA.monthlyNoi),               win: leftA.monthlyNoi > rightA.monthlyNoi ? "l" : leftA.monthlyNoi < rightA.monthlyNoi ? "r" : null },
    { label: "Annual NOI",       l: fmtCompact(leftA.annualNoi),            r: fmtCompact(rightA.annualNoi),            win: leftA.annualNoi > rightA.annualNoi ? "l" : leftA.annualNoi < rightA.annualNoi ? "r" : null },
    { label: "Cap rate",         l: `${(leftA.capRateBps / 100).toFixed(2)}%`, r: `${(rightA.capRateBps / 100).toFixed(2)}%`, win: leftA.capRateBps > rightA.capRateBps ? "l" : leftA.capRateBps < rightA.capRateBps ? "r" : null },
    { label: "Cash-on-cash",     l: `${(leftA.cocBps / 100).toFixed(2)}%`,  r: `${(rightA.cocBps / 100).toFixed(2)}%`,  win: leftA.cocBps > rightA.cocBps ? "l" : leftA.cocBps < rightA.cocBps ? "r" : null },
    { label: "Occupancy",        l: `${leftA.occupiedRooms}/${leftA.totalRooms}`, r: `${rightA.occupiedRooms}/${rightA.totalRooms}`, win: leftA.occupancyBps > rightA.occupancyBps ? "l" : leftA.occupancyBps < rightA.occupancyBps ? "r" : null },
    { label: "Equity",           l: fmtCompact(leftA.equity),               r: fmtCompact(rightA.equity),               win: leftA.equity > rightA.equity ? "l" : leftA.equity < rightA.equity ? "r" : null },
    { label: "Market value",     l: fmtCompact(leftA.marketValue),          r: fmtCompact(rightA.marketValue),          win: null },
    { label: "Mortgage balance", l: fmtCompact(leftA.mortgageBalance),      r: fmtCompact(rightA.mortgageBalance),      win: leftA.mortgageBalance < rightA.mortgageBalance ? "l" : leftA.mortgageBalance > rightA.mortgageBalance ? "r" : null },
    { label: "Annual depreciation", l: fmtCompact(leftA.annualDepreciation), r: fmtCompact(rightA.annualDepreciation), win: leftA.annualDepreciation > rightA.annualDepreciation ? "l" : leftA.annualDepreciation < rightA.annualDepreciation ? "r" : null },
    { label: "L12M maintenance", l: fmtCompact(leftA.maintenanceL12mCents), r: fmtCompact(rightA.maintenanceL12mCents), win: leftA.maintenanceL12mCents < rightA.maintenanceL12mCents ? "l" : leftA.maintenanceL12mCents > rightA.maintenanceL12mCents ? "r" : null },
  ] : [];

  // Combine both projection series into one chart dataset.
  const chartData = useMemo(() => {
    const len = Math.max(leftProj.length, rightProj.length);
    const out = [];
    for (let i = 0; i < len; i++) {
      out.push({
        year: i,
        left_equity: leftProj[i]?.equity_cents ?? null,
        right_equity: rightProj[i]?.equity_cents ?? null,
      });
    }
    return out;
  }, [leftProj, rightProj]);

  return (
    <div
      onClick={onClose}
      className="bb-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(15,23,41,0.55)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bb-modal-card"
        style={{
          background: COLORS.surface, borderRadius: 24,
          width: "100%", maxWidth: 760, maxHeight: "calc(100dvh - 40px)",
          boxShadow: "0 24px 80px rgba(15,23,41,0.28)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{
          position: "sticky", top: 0, zIndex: 1,
          padding: "16px 20px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
          background: COLORS.surface,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Compare properties</div>
            <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>Best value in green per row.</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}>
            <Icon d={ICON.x} size={14} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <PropertyPicker label="Property A" value={leftIdx} onChange={setLeftIdx} properties={state.properties} accent={COLORS.accent} />
            <PropertyPicker label="Property B" value={rightIdx} onChange={setRightIdx} properties={state.properties} accent={COLORS.purple} />
          </div>

          {leftA && rightA && (
            <div style={{ ...STYLES.card, padding: 0, marginBottom: 14 }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr",
                padding: "10px 14px", fontSize: 10, fontWeight: 700,
                color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em",
                borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <div>Metric</div>
                <div style={{ textAlign: "right" }}>{left.label}</div>
                <div style={{ textAlign: "right" }}>{right.label}</div>
              </div>
              {rows.map((row, i) => (
                <div key={i} className="bb-row" style={{
                  display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr",
                  padding: "10px 14px", alignItems: "center",
                  fontSize: 13.5,
                }}>
                  <div style={{ color: COLORS.textMuted, fontWeight: 500 }}>{row.label}</div>
                  <div style={{
                    textAlign: "right", fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    color: row.win === "l" ? COLORS.green : COLORS.text,
                  }}>{row.l}</div>
                  <div style={{
                    textAlign: "right", fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    color: row.win === "r" ? COLORS.green : COLORS.text,
                  }}>{row.r}</div>
                </div>
              ))}
            </div>
          )}

          {chartData.length > 1 && (
            <div style={{ ...STYLES.card, padding: "14px 12px 8px" }}>
              <div style={{ padding: "0 6px 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>10-year equity projection · 3% appreciation</div>
                <div style={{ display: "flex", gap: 14, fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 12, height: 2, background: COLORS.accent, borderRadius: 2 }} />
                    {left?.label}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 12, height: 2, background: COLORS.purple, borderRadius: 2 }} />
                    {right?.label}
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <Line type="monotone" dataKey="left_equity"  stroke={COLORS.accent} strokeWidth={2.5} dot={false} isAnimationActive />
                  <Line type="monotone" dataKey="right_equity" stroke={COLORS.purple} strokeWidth={2.5} dot={false} isAnimationActive />
                  <RTooltip
                    contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
                    labelFormatter={(y) => `Year ${y}`}
                    formatter={(v, key) => [fmtCompact(v), key === "left_equity" ? left?.label : right?.label]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PropertyPicker({ label, value, onChange, properties, accent }) {
  return (
    <div style={{
      background: COLORS.surfaceTint, borderRadius: 12,
      padding: "10px 12px", border: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{
          background: "transparent", border: "none", outline: "none",
          fontSize: 16, fontWeight: 700, color: COLORS.text,
          fontFamily: FONT, cursor: "pointer", width: "100%",
        }}
      >
        {properties.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
      </select>
    </div>
  );
}

function PropertyAnalyticsStrip({ analytics }) {
  const stats = [
    {
      label: "NOI / mo",
      value: fmtUsd(analytics.monthlyNoi),
      sub: `${fmtCompact(analytics.annualNoi)} / yr`,
      color: analytics.monthlyNoi >= 0 ? COLORS.green : COLORS.red,
    },
    {
      label: "Cap rate",
      value: `${(analytics.capRateBps / 100).toFixed(2)}%`,
      sub: "unlevered, annual",
      color: analytics.capRateBps >= 600 ? COLORS.green : analytics.capRateBps >= 400 ? COLORS.amber : COLORS.red,
    },
    {
      label: "Cash-on-cash",
      value: `${(analytics.cocBps / 100).toFixed(2)}%`,
      sub: `${fmtCompact(analytics.cashInvested)} invested`,
      color: analytics.cocBps >= 800 ? COLORS.green : analytics.cocBps >= 400 ? COLORS.amber : COLORS.red,
    },
    {
      label: "Occupancy",
      value: analytics.totalRooms > 0 ? `${analytics.occupiedRooms}/${analytics.totalRooms}` : "—",
      sub: analytics.totalRooms > 0 ? `${(analytics.occupancyBps / 100).toFixed(0)}%` : "no rooms",
      color: analytics.occupancyBps >= 9000 ? COLORS.green : analytics.occupancyBps >= 6000 ? COLORS.amber : COLORS.red,
    },
    {
      label: "Equity",
      value: fmtCompact(analytics.equity),
      sub: `${fmtCompact(analytics.marketValue)} − ${fmtCompact(analytics.mortgageBalance)}`,
      color: analytics.equity >= 0 ? COLORS.text : COLORS.red,
    },
    {
      label: "Depreciation",
      value: fmtCompact(analytics.annualDepreciation),
      sub: "Schedule E / yr",
      color: COLORS.purple,
    },
  ];
  return (
    <div style={{
      marginBottom: 16,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: 8,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "10px 12px",
          background: COLORS.surfaceTint,
          borderRadius: 10,
          minWidth: 0,
        }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
          <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
          <div style={{ marginTop: 1, fontSize: 10, color: COLORS.textFaint, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

const MAINTENANCE_CATEGORIES = [
  { id: "repair",      label: "repair"      },
  { id: "improvement", label: "improvement" },
  { id: "cleaning",    label: "cleaning"    },
  { id: "landscaping", label: "landscaping" },
  { id: "inspection",  label: "inspection"  },
  { id: "other",       label: "other"       },
];

function MaintenanceLog({ property, onChange }) {
  const [open, setOpen] = useState(false);
  const log = property.maintenance_log || [];
  const total = log.reduce((s, e) => s + (e.amount_cents || 0), 0);
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const updateLog = (next) => onChange({ maintenance_log: next });
  const addEvent = () => updateLog([
    ...log,
    { id: genId(), date: todayISO, vendor: "", category: "repair", amount_cents: 0, note: "" },
  ]);
  const updateEvent = (id, patch) => updateLog(log.map((e) => e.id === id ? { ...e, ...patch } : e));
  const deleteEvent = (id) => updateLog(log.filter((e) => e.id !== id));

  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceAlt}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "4px 0", display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT,
        }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={10} />
        Maintenance log
        {log.length > 0 && (
          <span style={{ marginLeft: 6, fontWeight: 600, color: COLORS.textFaint }}>
            · {log.length} · {fmtCompact(total)}
          </span>
        )}
      </button>
      {open && (
        <div style={{ marginTop: 10, padding: "10px 12px", background: COLORS.surfaceTint, borderRadius: 10 }}>
          {log.length === 0 && (
            <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
              Repairs, improvements, cleanings — log them here so they roll into your tax-ready P&L.
            </div>
          )}
          {log
            .slice()
            .sort((a, b) => (a.date || "") < (b.date || "") ? 1 : -1)
            .map((e) => (
              <div key={e.id || `${e.date}-${e.amount_cents}-${e.vendor}`} className="bb-row" style={{
                display: "grid",
                gridTemplateColumns: "auto auto minmax(0, 1fr) auto 22px",
                gap: 8, alignItems: "center", padding: "8px 4px",
              }}>
                <input
                  type="date"
                  value={e.date || ""}
                  onChange={(ev) => updateEvent(e.id, { date: ev.target.value })}
                  aria-label="Date"
                  style={{ ...inputStyle(), width: 140 }}
                />
                <select
                  value={e.category || "other"}
                  onChange={(ev) => updateEvent(e.id, { category: ev.target.value })}
                  aria-label="Category"
                  style={pillSelectStyle()}
                >
                  {MAINTENANCE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <InlineText
                  value={e.note || ""}
                  onChange={(v) => updateEvent(e.id, { note: v })}
                />
                <InlineNumber
                  value={e.amount_cents || 0}
                  onChange={(v) => updateEvent(e.id, { amount_cents: v })}
                  width={110}
                />
                <button
                  onClick={() => deleteEvent(e.id)}
                  aria-label="Delete event"
                  style={{
                    width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
                    background: "transparent", color: COLORS.textFaint, opacity: 0.4,
                    display: "grid", placeItems: "center", transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(ev) => { ev.currentTarget.style.opacity = 1; ev.currentTarget.style.background = COLORS.redBg; ev.currentTarget.style.color = COLORS.red; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.opacity = 0.4; ev.currentTarget.style.background = "transparent"; ev.currentTarget.style.color = COLORS.textFaint; }}
                >
                  <Icon d={ICON.x} size={12} />
                </button>
              </div>
            ))}
          <AddRowButton label="Add maintenance event" accent={COLORS.accent} onClick={addEvent} />
        </div>
      )}
    </div>
  );
}

function MortgageDetails({ property, onChange }) {
  const [open, setOpen] = useState(false);
  const has = property.mortgage_balance_cents > 0 || property.mortgage_rate_bps || property.mortgage_term_years || property.mortgage_payment_cents;
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceAlt}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "4px 0", display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT,
        }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={10} />
        Mortgage details{!has && " (none set)"}
      </button>
      {open && (
        <div style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 8,
          padding: "10px 12px",
          background: COLORS.surfaceTint,
          borderRadius: 10,
        }}>
          <InputRow label="Mortgage balance" value={property.mortgage_balance_cents} onChange={(v) => onChange({ mortgage_balance_cents: v })} />
          <InputRow label="Mortgage payment" value={property.mortgage_payment_cents} onChange={(v) => onChange({ mortgage_payment_cents: v })} />
          <InputRow label="Market value" value={property.market_value_cents} onChange={(v) => onChange({ market_value_cents: v })} />
          <PctRow label="Mortgage rate" bps={property.mortgage_rate_bps} onChange={(v) => onChange({ mortgage_rate_bps: v })} />
          <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px" }}>
            <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Term (years)</div>
            <InlineNumber
              value={(property.mortgage_term_years || 0) * 100}
              onChange={(v) => onChange({ mortgage_term_years: Math.max(0, Math.round(v / 100)) })}
              width={80}
            />
          </div>
          <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px" }}>
            <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Origin date</div>
            <input
              type="date"
              value={property.mortgage_origin_date || ""}
              onChange={(e) => onChange({ mortgage_origin_date: e.target.value || null })}
              aria-label="Mortgage origin date"
              style={{ ...inputStyle(), width: 150 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Per-property HELOC. Balance, rate and credit limit are fully
// editable. The monthly payment defaults to interest-only (balance ×
// rate ÷ 12) and recomputes live; typing a number sets a custom
// override. Whatever the effective payment is, it's folded into the
// property's costs and NOI (see propertyHelocPayment in lib/calc.js).
function HelocDetails({ property, onChange }) {
  const [open, setOpen] = useState(false);
  const balance = property.heloc_balance_cents || 0;
  const rateBps = property.heloc_rate_bps ?? 0;
  const limit = property.heloc_limit_cents || 0;
  const override = property.heloc_payment_cents;
  const isOverride = override != null && override > 0;
  const autoPayment = balance > 0 && rateBps > 0 ? Math.round((balance * (rateBps / 10000)) / 12) : 0;
  const payment = isOverride ? override : autoPayment;
  const has = balance > 0 || rateBps > 0 || limit > 0 || isOverride;
  const available = Math.max(0, limit - balance);
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceAlt}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "4px 0", display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT,
        }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={10} />
        HELOC{!has && " (none set)"}
        {has && payment > 0 && (
          <span style={{ color: COLORS.accent, textTransform: "none", letterSpacing: 0 }}>
            · {fmtUsd(payment)}/mo
          </span>
        )}
      </button>
      {open && (
        <div style={{
          marginTop: 10,
          padding: "10px 12px",
          background: COLORS.surfaceTint,
          borderRadius: 10,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 8,
          }}>
            <InputRow label="HELOC balance" value={balance} onChange={(v) => onChange({ heloc_balance_cents: v })} />
            <PctRow label="Interest rate" bps={property.heloc_rate_bps} onChange={(v) => onChange({ heloc_rate_bps: v })} />
            <InputRow label="Credit limit" value={limit} onChange={(v) => onChange({ heloc_limit_cents: v })} />
            <div className="bb-row" style={{
              display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center",
              padding: "8px 4px", minHeight: 40, gap: 12,
            }}>
              <div style={TYPE.label}>Monthly payment</div>
              <InlineNumber
                value={payment}
                onChange={(v) => onChange({ heloc_payment_cents: v })}
                width={140}
                min={0}
                allowNegative={false}
              />
            </div>
          </div>
          <div style={{
            marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8,
            alignItems: "center", fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint,
          }}>
            {isOverride ? (
              <>
                <span>Custom payment.</span>
                <button
                  onClick={() => onChange({ heloc_payment_cents: null })}
                  style={{
                    background: "transparent", border: "none", padding: 0, cursor: "pointer",
                    fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: COLORS.accent,
                  }}
                >
                  Use interest-only{autoPayment > 0 ? ` (${fmtUsd(autoPayment)})` : ""}
                </button>
              </>
            ) : (
              <span>Interest-only — balance × rate ÷ 12. Type a payment to set a custom amount.</span>
            )}
            {limit > 0 && <span>· {fmtUsd(available)} available to draw</span>}
          </div>
          <div style={{ marginTop: 6, fontSize: 11.5, color: COLORS.textFaint }}>
            Included in this property&apos;s costs &amp; NOI.
          </div>
        </div>
      )}
    </div>
  );
}

// Owner-occupied / house-hack share. When a property is partly the
// owner's residence (a duplex you live in half of), only the rental
// share of fixed building costs is a rental expense — see
// propertyRentalShare / propertyOperatingExpenses in lib/calc.js.
function OwnerOccupiedDetails({ property, onChange }) {
  const [open, setOpen] = useState(false);
  const bps = property.personal_use_bps || 0;
  const has = bps > 0;
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceAlt}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: "4px 0", display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT,
        }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={10} />
        Owner-occupied{!has && " (none)"}
        {has && (
          <span style={{ color: COLORS.amber, textTransform: "none", letterSpacing: 0 }}>
            · {Math.round(bps / 100)}% your home
          </span>
        )}
      </button>
      {open && (
        <div style={{
          marginTop: 10,
          padding: "10px 12px",
          background: COLORS.surfaceTint,
          borderRadius: 10,
        }}>
          <PctRow
            label="Your share of this property"
            bps={property.personal_use_bps}
            onChange={(v) => onChange({ personal_use_bps: Math.min(10000, Math.max(0, v)) })}
          />
          <div style={{ marginTop: 6, fontSize: 11.5, color: COLORS.textFaint }}>
            Live in half a duplex? Enter 50%. The mortgage, taxes, insurance and other
            building costs get split — only the rental share counts against this
            property&apos;s cash flow. Vacancy &amp; CapEx aren&apos;t split (they already
            scale with rental rent).
          </div>
        </div>
      )}
    </div>
  );
}

// ── Net Worth drill ──────────────────────────────────────────────────

function NetWorthDrill({ state, updateState }) {
  const propEquity = state.properties.reduce((s, p) => s + (p.market_value_cents - p.mortgage_balance_cents), 0);
  const cash = state.assets.reduce((s, a) => s + a.balance_cents, 0);
  const debt = state.debts.reduce((s, d) => s + d.balance_cents, 0);
  const total = propEquity + cash - debt;

  // Resolve section header overrides. Falls back to the default when no
  // user override exists. Slugs are stable so renames travel with state.
  const labelFor = (id, fallback) => state.settings.section_labels?.[id] || fallback;
  const renameSection = (id, fallback, value) => {
    updateState((s) => {
      const prev = s.settings.section_labels || {};
      const next = { ...prev };
      const trimmed = (value || "").trim();
      if (!trimmed || trimmed === fallback) delete next[id];
      else next[id] = trimmed;
      return { ...s, settings: { ...s.settings, section_labels: next } };
    });
  };
  return (
    <div>
      <DrillTitle
        title="Net Worth"
        subtitle={`${fmtCompact(propEquity + cash)} in assets · ${fmtCompact(debt)} in debt`}
        icon={ICON.scales}
        iconColor={COLORS.amber}
        iconBg={COLORS.amberBg}
        heroValue={fmtCompact(total)}
        heroLabel="total"
        heroColor={total >= 0 ? COLORS.text : COLORS.red}
      />

      <div style={{ display: "grid", gap: 14, marginTop: 6 }}>
        <AllocationPanel state={state} />
        <NetWorthHistoryPanel state={state} />
        <RetirementProjectionPanel state={state} updateState={updateState} />
        <FireCalculatorPanel state={state} updateState={updateState} />

        <BlockCard
          title={labelFor("networth.real-estate", "Real Estate Equity")}
          onTitleChange={(v) => renameSection("networth.real-estate", "Real Estate Equity", v)}
          sub={fmtCompact(propEquity)}
          accent={COLORS.accent}
          icon={ICON.building}
          count={`${state.properties.length}`}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(72px, 0.8fr)",
            gap: 10, padding: "6px 4px 8px",
            borderBottom: `1px solid ${COLORS.border}`,
            ...TYPE.eyebrow,
          }}>
            <div>Property</div>
            <div style={{ textAlign: "right" }}>Market</div>
            <div style={{ textAlign: "right" }}>Owed</div>
            <div style={{ textAlign: "right" }}>Equity</div>
          </div>
          {state.properties.map((p, idx) => {
            const equity = p.market_value_cents - p.mortgage_balance_cents;
            return (
              <div key={idx} className="bb-row" style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.4fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(72px, 0.8fr)",
                alignItems: "center", gap: 10, padding: "10px 4px",
                minHeight: 40,
              }}>
                <div style={{ minWidth: 0, fontWeight: 600 }}>
                  <InlineText
                    value={p.label}
                    onChange={(v) => updateState((s) => ({ ...s, properties: s.properties.map((pp, i) => i === idx ? { ...pp, label: v } : pp) }))}
                  />
                </div>
                <InlineNumber
                  value={p.market_value_cents}
                  onChange={(v) => updateState((s) => ({ ...s, properties: s.properties.map((pp, i) => i === idx ? { ...pp, market_value_cents: v } : pp) }))}
                  width="100%"
                />
                <InlineNumber
                  value={p.mortgage_balance_cents}
                  onChange={(v) => updateState((s) => ({ ...s, properties: s.properties.map((pp, i) => i === idx ? { ...pp, mortgage_balance_cents: v } : pp) }))}
                  width="100%"
                />
                <div style={{ textAlign: "right", fontWeight: 700, color: equity > 0 ? COLORS.green : equity < 0 ? COLORS.red : COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
                  {fmtCompact(equity)}
                </div>
              </div>
            );
          })}
        </BlockCard>

        <BlockCard
          title={labelFor("networth.cash", "Cash & Investments")}
          onTitleChange={(v) => renameSection("networth.cash", "Cash & Investments", v)}
          sub={fmtCompact(cash)}
          accent={COLORS.green}
          icon={ICON.trending}
          count={`${state.assets.length}`}
        >
          {state.assets.map((a, idx) => (
            <AssetRow
              key={idx}
              asset={a}
              onChange={(patch) => updateState((s) => ({ ...s, assets: s.assets.map((aa, i) => i === idx ? { ...aa, ...patch } : aa) }))}
              onDelete={() => updateState((s) => ({ ...s, assets: s.assets.filter((_, i) => i !== idx) }))}
            />
          ))}
          <AddRowButton
            label="Add account"
            accent={COLORS.green}
            onClick={() => updateState((s) => ({
              ...s,
              assets: [...s.assets, { label: "New account", kind: "cash", balance_cents: 0, sort_order: s.assets.length }],
            }))}
          />
        </BlockCard>

        <BlockCard
          title={labelFor("networth.liabilities", "Liabilities")}
          onTitleChange={(v) => renameSection("networth.liabilities", "Liabilities", v)}
          sub={fmtCompact(debt)}
          accent={COLORS.red}
          icon={ICON.arrowDn}
          count={`${state.debts.length}`}
        >
          {state.debts.map((d, idx) => (
            <DebtRow
              key={idx}
              debt={d}
              onChange={(patch) => updateState((s) => ({ ...s, debts: s.debts.map((dd, i) => i === idx ? { ...dd, ...patch } : dd) }))}
              onDelete={() => updateState((s) => ({ ...s, debts: s.debts.filter((_, i) => i !== idx) }))}
            />
          ))}
          <AddRowButton
            label="Add debt"
            accent={COLORS.red}
            onClick={() => updateState((s) => ({
              ...s,
              debts: [...s.debts, { label: "New debt", kind: "other", balance_cents: 0, original_amount_cents: null, monthly_payment_cents: 0, interest_rate_bps: null, sort_order: s.debts.length }],
            }))}
          />
        </BlockCard>

        <RetirementContributionsBlock
          state={state}
          updateState={updateState}
          title={labelFor("networth.retirement", "Retirement Contributions")}
          onTitleChange={(v) => renameSection("networth.retirement", "Retirement Contributions", v)}
        />
      </div>
    </div>
  );
}

const ASSET_KINDS = [
  { id: "cash",       label: "cash" },
  { id: "retirement", label: "retirement" },
  { id: "investment", label: "investment" },
  { id: "vehicle",    label: "vehicle" },
  { id: "other",      label: "other" },
];

const DEBT_KINDS = [
  { id: "student",     label: "student" },
  { id: "auto",        label: "auto" },
  { id: "heloc",       label: "HELOC" },
  { id: "credit_card", label: "credit card" },
  { id: "personal",    label: "personal" },
  { id: "other",       label: "other" },
];

function AssetRow({ asset, onChange, onDelete }) {
  return (
    <div className="bb-row" style={{
      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto 22px",
      gap: 10, alignItems: "center", padding: "9px 4px",
    }}>
      <InlineText value={asset.label} onChange={(v) => onChange({ label: v })} />
      <select
        value={asset.kind || "cash"}
        onChange={(e) => onChange({ kind: e.target.value })}
        aria-label="Asset kind"
        style={pillSelectStyle()}
      >
        {ASSET_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
      </select>
      <InlineNumber value={asset.balance_cents} onChange={(v) => onChange({ balance_cents: v })} width={120} allowNegative={false} />
      <button
        onClick={onDelete}
        aria-label="Delete account"
        style={{
          width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
          background: "transparent", color: COLORS.textFaint, opacity: 0.4,
          display: "grid", placeItems: "center", transition: "all 0.12s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
      >
        <Icon d={ICON.x} size={12} />
      </button>
    </div>
  );
}

function DebtRow({ debt, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bb-row" style={{ padding: "9px 4px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto auto 22px",
        gap: 10, alignItems: "center",
      }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse" : "Expand"}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textFaint, padding: 0, display: "grid", placeItems: "center" }}
        >
          <Icon d={expanded ? ICON.chevD : ICON.chevR} size={12} />
        </button>
        <InlineText value={debt.label} onChange={(v) => onChange({ label: v })} />
        <select
          value={debt.kind || "other"}
          onChange={(e) => onChange({ kind: e.target.value })}
          aria-label="Debt kind"
          style={pillSelectStyle()}
        >
          {DEBT_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
        </select>
        <InlineNumber value={debt.balance_cents} onChange={(v) => onChange({ balance_cents: v })} width={120} allowNegative={false} />
        <button
          onClick={onDelete}
          aria-label="Delete debt"
          style={{
            width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
            background: "transparent", color: COLORS.textFaint, opacity: 0.4,
            display: "grid", placeItems: "center", transition: "all 0.12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
        >
          <Icon d={ICON.x} size={12} />
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 8, marginLeft: 24, padding: "8px 12px", background: COLORS.surfaceTint, borderRadius: 10 }}>
          <InputRow label="Monthly payment" value={debt.monthly_payment_cents} onChange={(v) => onChange({ monthly_payment_cents: v })} />
          <InputRow label="Original amount" value={debt.original_amount_cents || 0} onChange={(v) => onChange({ original_amount_cents: v })} />
          <PctRow label="Interest rate" bps={debt.interest_rate_bps} onChange={(v) => onChange({ interest_rate_bps: v })} />
        </div>
      )}
    </div>
  );
}

function RetirementContributionsBlock({ state, updateState, title, onTitleChange }) {
  const contribs = state.retirement_contributions || [];
  const total = contribs.reduce((s, c) => s + c.amount_cents, 0);
  const addYear = () => {
    const nextYear = (contribs.reduce((m, c) => Math.max(m, c.year), new Date().getFullYear() - 1)) + 1;
    updateState((s) => ({
      ...s,
      retirement_contributions: [
        ...(s.retirement_contributions || []),
        { account_label: "NASA TSP", year: nextYear, amount_cents: 0 },
      ],
    }));
  };
  return (
    <BlockCard
      title={title || "Retirement Contributions"}
      onTitleChange={onTitleChange}
      sub={fmtCompact(total)}
      accent={COLORS.green}
      icon={ICON.award}
      count={`${contribs.length} year${contribs.length === 1 ? "" : "s"}`}
    >
      {contribs.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
          Track your TSP / 401(k) contributions year by year.
        </div>
      )}
      {contribs
        .slice()
        .sort((a, b) => a.year - b.year)
        .map((c, idx) => {
          const realIdx = contribs.findIndex((x) => x.year === c.year && x.account_label === c.account_label);
          return (
            <div key={`${c.account_label}-${c.year}`} className="bb-row" style={{
              display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto auto 22px",
              gap: 10, alignItems: "center", padding: "9px 4px",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: COLORS.green,
                background: COLORS.greenBg, padding: "3px 9px", borderRadius: 100,
                fontVariantNumeric: "tabular-nums",
              }}>{c.year}</span>
              <InlineText
                value={c.account_label}
                onChange={(v) => updateState((s) => ({
                  ...s,
                  retirement_contributions: s.retirement_contributions.map((x, i) => i === realIdx ? { ...x, account_label: v } : x),
                }))}
              />
              <InlineNumber
                mode="integer"
                min={1970}
                max={2200}
                value={c.year}
                onChange={(v) => updateState((s) => ({
                  ...s,
                  retirement_contributions: s.retirement_contributions.map((x, i) => i === realIdx ? { ...x, year: v } : x),
                }))}
                width={70}
              />
              <InlineNumber
                value={c.amount_cents}
                onChange={(v) => updateState((s) => ({
                  ...s,
                  retirement_contributions: s.retirement_contributions.map((x, i) => i === realIdx ? { ...x, amount_cents: v } : x),
                }))}
                width={110}
              />
              <button
                onClick={() => updateState((s) => ({
                  ...s,
                  retirement_contributions: s.retirement_contributions.filter((_, i) => i !== realIdx),
                }))}
                aria-label="Delete year"
                style={{
                  width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
                  background: "transparent", color: COLORS.textFaint, opacity: 0.4,
                  display: "grid", placeItems: "center", transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
              >
                <Icon d={ICON.x} size={12} />
              </button>
            </div>
          );
        })}
      <AddRowButton label="Add year" accent={COLORS.green} onClick={addYear} />
    </BlockCard>
  );
}

// ── Net Worth insight panels ────────────────────────────────────────

function AllocationPanel({ state }) {
  const { rows, grossAssets, debt, net } = useMemo(() => computeAllocation(state), [state]);
  if (rows.length === 0) {
    return (
      <div style={{ ...STYLES.card, padding: 18, textAlign: "center", color: COLORS.textFaint, fontSize: 13 }}>
        Add at least one asset to see your allocation.
      </div>
    );
  }
  return (
    <div style={{
      ...STYLES.card, padding: 18,
      display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)",
      gap: 22, alignItems: "center",
    }}>
      <div style={{ position: "relative", width: 168, height: 168, flexShrink: 0 }}>
        <PieChart width={168} height={168}>
          <Pie
            data={rows.map((r) => ({ name: r.label, value: r.value_cents }))}
            dataKey="value" nameKey="name"
            cx="50%" cy="50%" innerRadius={50} outerRadius={80}
            paddingAngle={2} strokeWidth={0}
          >
            {rows.map((r, i) => <Cell key={i} fill={r.color} />)}
          </Pie>
          <RTooltip
            cursor={false}
            contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
            formatter={(v, n) => [fmtCompact(v), n]}
          />
        </PieChart>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", textAlign: "center", lineHeight: 1,
        }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Net</div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 800, color: net >= 0 ? COLORS.text : COLORS.red, letterSpacing: "-0.02em" }}>{fmtCompact(net)}</div>
          <div style={{ marginTop: 2, fontSize: 10, color: COLORS.textFaint, fontWeight: 600 }}>of {fmtCompact(grossAssets)} gross</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Asset allocation</div>
        <div style={{ display: "grid", gap: 6 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "12px minmax(0,1fr) auto auto", gap: 10, alignItems: "center", fontSize: 12.5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: r.color }} />
              <span style={{ color: COLORS.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
              <span style={{ color: COLORS.textMuted, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{r.pct.toFixed(0)}%</span>
              <span style={{ color: COLORS.text, fontVariantNumeric: "tabular-nums", fontWeight: 700, minWidth: 56, textAlign: "right" }}>{fmtCompact(r.value_cents)}</span>
            </div>
          ))}
          {debt > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "12px minmax(0,1fr) auto auto", gap: 10, alignItems: "center", fontSize: 12.5, marginTop: 6, paddingTop: 6, borderTop: `1px solid ${COLORS.surfaceTint}` }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.red }} />
              <span style={{ color: COLORS.textMuted, fontWeight: 600 }}>Liabilities</span>
              <span />
              <span style={{ color: COLORS.red, fontVariantNumeric: "tabular-nums", fontWeight: 700, minWidth: 56, textAlign: "right" }}>−{fmtCompact(debt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NetWorthHistoryPanel({ state }) {
  const history = (state.history || []).filter((h) => typeof h.net_worth_cents === "number");
  if (history.length < 2) {
    return (
      <div style={{ ...STYLES.card, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Net worth over time</div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.55 }}>
          We snapshot your net worth daily. Your chart will fill in over the next few days as data accumulates.
        </div>
      </div>
    );
  }
  const data = history.map((h) => ({ day: h.day, value: h.net_worth_cents }));
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const delta = last - first;
  const trendUp = delta >= 0;
  return (
    <div style={{ ...STYLES.card, padding: "16px 14px 8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 6px 8px" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Net worth over time</div>
          <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>
            {data.length} day{data.length === 1 ? "" : "s"} of history
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmtCompact(last)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: trendUp ? COLORS.green : COLORS.red, fontVariantNumeric: "tabular-nums" }}>
            {trendUp ? "+" : "−"}{fmtCompact(Math.abs(delta))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke={COLORS.amber} strokeWidth={2.5} dot={false} isAnimationActive />
          <RTooltip
            contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
            labelFormatter={(d) => d}
            formatter={(v) => [fmtCompact(v), "Net Worth"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RetirementProjectionPanel({ state, updateState }) {
  const defaults = useMemo(() => defaultProjectionInputs(state), [state]);
  const setS = (patch) => updateState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  // Local input override for "this session's annual contribution guess".
  const [contribOverride, setContribOverride] = useState(null);
  const annualContributionCents = contribOverride ?? defaults.annualContributionCents;

  const projection = useMemo(() => computeRetirementProjection({
    startingBalanceCents: defaults.startingBalanceCents,
    annualContributionCents,
    annualReturnBps: defaults.annualReturnBps,
    horizonYears: defaults.horizonYears,
  }), [defaults, annualContributionCents]);

  return (
    <div style={{ ...STYLES.card, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Retirement projection</div>
          <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>
            {defaults.horizonYears}-year compound · {(defaults.annualReturnBps / 100).toFixed(1)}% return
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.purple, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
            {fmtCompact(projection.finalBalance)}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>by {projection.finalYear}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={projection.series} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="balance_cents" stroke={COLORS.purple} strokeWidth={2.5} dot={false} isAnimationActive />
          <RTooltip
            contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
            labelFormatter={(y) => `Year ${y}`}
            formatter={(v) => [fmtCompact(v), "Balance"]}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}`,
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 6,
      }}>
        <InputRow
          label={`Starting balance · ${fmtCompact(defaults.startingBalanceCents)} (auto)`}
          value={defaults.startingBalanceCents}
          onChange={() => {}}
        />
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px", minHeight: 40, gap: 12 }}>
          <div style={{ ...TYPE.label }}>Annual contribution</div>
          <InlineNumber
            value={annualContributionCents}
            onChange={(v) => setContribOverride(v)}
            width={120}
          />
        </div>
        <PctRow label="Expected return" bps={defaults.annualReturnBps} onChange={(v) => setS({ retirement_return_bps: v })} />
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px", minHeight: 40, gap: 12 }}>
          <div style={{ ...TYPE.label }}>Horizon (years)</div>
          <InlineNumber
            mode="integer"
            suffix="yr"
            min={1}
            max={80}
            value={defaults.horizonYears}
            onChange={(v) => setS({ retirement_horizon_years: v })}
            allowNegative={false}
            width={80}
          />
        </div>
      </div>
    </div>
  );
}

function FireCalculatorPanel({ state, updateState }) {
  const fireMultiple = state.settings?.fire_multiple ?? 25;
  const swrBps = 10000 / fireMultiple; // e.g. multiple 25 → 4% SWR
  const metrics = useMemo(() => computeFireMetrics(state, {
    multiple: fireMultiple,
    annualReturnBps: state.settings?.retirement_return_bps ?? 700,
  }), [state, fireMultiple]);
  return (
    <div style={{ ...STYLES.card, padding: 18, display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 18, alignItems: "center" }}>
      <ProgressRing
        value={metrics.liquidNetWorthCents}
        max={metrics.fireNumberCents || 1}
        color={COLORS.green}
        label={`${metrics.progressPct.toFixed(0)}%`}
        sublabel="to FIRE"
        size={120}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ ...TYPE.titleSm, marginBottom: 10 }}>Financial Independence</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
          <div>
            <div style={TYPE.eyebrow}>FIRE number</div>
            <div style={{ ...TYPE.titleMd, marginTop: 4 }}>{fmtCompact(metrics.fireNumberCents)}</div>
            <div style={{ ...TYPE.caption, marginTop: 2 }}>{fireMultiple}× annual expenses</div>
          </div>
          <div>
            <div style={TYPE.eyebrow}>You have</div>
            <div style={{ ...TYPE.titleMd, color: COLORS.green, marginTop: 4 }}>{fmtCompact(metrics.liquidNetWorthCents)}</div>
            <div style={{ ...TYPE.caption, marginTop: 2 }}>liquid (cash + retirement + invest)</div>
          </div>
          <div>
            <div style={TYPE.eyebrow}>Yearly expenses</div>
            <div style={{ ...TYPE.value, marginTop: 4 }}>{fmtCompact(metrics.annualExpensesCents)}</div>
          </div>
          <div>
            <div style={TYPE.eyebrow}>Years to FIRE</div>
            <div style={{ ...TYPE.value, color: metrics.yearsToFire == null ? COLORS.textFaint : COLORS.text, marginTop: 4 }}>
              {metrics.yearsToFire == null ? "—" : `${metrics.yearsToFire}`}
            </div>
            <div style={{ ...TYPE.caption, marginTop: 2 }}>at {fmtCompact(metrics.annualContributionCents)} / yr saved</div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}`, flexWrap: "wrap" }}>
          <span style={TYPE.eyebrow}>Multiplier</span>
          <select
            value={fireMultiple}
            onChange={(e) => updateState((s) => ({ ...s, settings: { ...s.settings, fire_multiple: Number(e.target.value) } }))}
            aria-label="FIRE multiple"
            style={selectStyle()}
          >
            <option value="20">20× (5% SWR — aggressive)</option>
            <option value="25">25× (4% SWR — Trinity)</option>
            <option value="30">30× (3.3% SWR — conservative)</option>
            <option value="33">33× (3% SWR — very safe)</option>
          </select>
          <span style={{ fontSize: 11, color: COLORS.textFaint }}>= {(swrBps / 100).toFixed(1)}% safe withdrawal</span>
        </div>
      </div>
    </div>
  );
}

// ── HELOC drill ──────────────────────────────────────────────────────

function HelocDrill({ state, updateState }) {
  const m = state.heloc_model || {
    home_value_cents: 0, heloc_limit_cents: 0, mortgage_balance_cents: 0,
    mortgage_rate_bps: null, mortgage_term_years: 30, mortgage_payment_cents: 0,
    heloc_rate_bps: null, monthly_income_cents: 0, monthly_expenses_cents: 0,
    extra_payment_cents: 0,
  };
  const setM = (patch) => updateState((s) => ({ ...s, heloc_model: { ...m, ...patch } }));

  const stratInputs = useMemo(() => defaultStrategyInputs(state), [state]);
  const setS = (patch) => updateState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const strategies = useMemo(() => computeStrategies(m, stratInputs), [m, stratInputs]);

  // Build a merged dataset for the multi-line overlay — each strategy
  // becomes a column keyed by its id. recharts handles the missing
  // values gracefully when one strategy's series is shorter.
  const chartData = useMemo(() => {
    if (strategies.length === 0) return [];
    const maxLen = strategies.reduce((m, s) => Math.max(m, (s.series || []).length), 0);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      const row = { month: i };
      for (const s of strategies) {
        row[s.id] = s.series?.[i]?.balance ?? null;
      }
      out.push(row);
    }
    return out;
  }, [strategies]);

  const baseline = strategies.find((s) => s.id === "traditional");
  const best = strategies
    .slice()
    .filter((s) => s.months != null)
    .sort((a, b) => a.totalCost - b.totalCost)[0];
  const bestSavings = best && baseline ? baseline.totalCost - best.totalCost : 0;

  return (
    <div>
      <DrillTitle
        title="HELOC Strategy Lab"
        subtitle="Compare five payoff strategies side-by-side. Refinance scenarios + tax-adjusted real cost included."
        icon={ICON.trending}
        iconColor={COLORS.purple}
        iconBg={COLORS.purpleBg}
        heroValue={fmtCompact(m.mortgage_balance_cents)}
        heroLabel={`mortgage balance · ${m.mortgage_rate_bps ? (m.mortgage_rate_bps / 100).toFixed(2) + "% rate" : "rate not set"}`}
      />

      {best && baseline && best.id !== "traditional" && (
        <div style={{
          marginBottom: 14, padding: "12px 16px",
          background: `linear-gradient(135deg, ${COLORS.greenBg} 0%, ${COLORS.surface} 80%)`,
          border: `1px solid ${COLORS.green}33`,
          borderRadius: 14,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: COLORS.green, color: "#fff",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={ICON.award} size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
              Best: <strong style={{ color: COLORS.green }}>{best.label}</strong> — saves <strong>{fmtCompact(bestSavings)}</strong> over Traditional
            </div>
            <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted }}>
              Pays off in {best.yearsToPayoff?.toFixed(1) ?? "—"} yrs vs {baseline.yearsToPayoff?.toFixed(1) ?? "—"} yrs for the baseline.
            </div>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div style={{ ...STYLES.card, padding: "16px 14px 10px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, padding: "0 6px", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Payoff trajectory</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 11, fontWeight: 600 }}>
              {strategies.map((s) => (
                <span key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: COLORS.textMuted }}>
                  <span style={{ width: 14, height: 2, background: s.color, borderRadius: 2 }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              {strategies.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  stroke={s.color}
                  strokeWidth={s.id === "traditional" ? 2 : 2.5}
                  strokeDasharray={s.id === "traditional" ? "4 4" : undefined}
                  dot={false}
                  isAnimationActive
                  animationDuration={500}
                  connectNulls={false}
                />
              ))}
              <RTooltip
                contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
                labelFormatter={(label) => `Month ${label} (yr ${(label / 12).toFixed(1)})`}
                formatter={(v, key) => {
                  const s = strategies.find((x) => x.id === key);
                  return [fmtCompact(v), s?.label || key];
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {strategies.length > 0 && (
        <div style={{ ...STYLES.card, padding: 0, marginBottom: 14, overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) 90px 110px 110px 110px",
            gap: 12, padding: "10px 14px",
            background: COLORS.surfaceTint,
            fontSize: 10, fontWeight: 700, color: COLORS.textFaint,
            textTransform: "uppercase", letterSpacing: "0.08em",
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div>Strategy</div>
            <div style={{ textAlign: "right" }}>Payoff</div>
            <div style={{ textAlign: "right" }}>Total cost</div>
            <div style={{ textAlign: "right" }}>After-tax</div>
            <div style={{ textAlign: "right" }}>vs baseline</div>
          </div>
          {strategies.map((s) => {
            const isWinner = best && s.id === best.id;
            return (
              <div key={s.id} className="bb-row" style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) 90px 110px 110px 110px",
                gap: 12, padding: "11px 14px", alignItems: "center",
                fontSize: 13,
                background: isWinner ? COLORS.greenBg : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: isWinner ? 800 : 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                  {isWinner && <span style={{ fontSize: 9, fontWeight: 800, color: COLORS.green, background: "#fff", padding: "2px 6px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>Best</span>}
                </div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: COLORS.text }}>
                  {s.yearsToPayoff != null ? `${s.yearsToPayoff.toFixed(1)} yr` : "—"}
                </div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: COLORS.text }}>
                  {fmtCompact(s.totalCost)}
                </div>
                <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: COLORS.textMuted }}>
                  {fmtCompact(s.afterTaxCost)}
                </div>
                <div style={{
                  textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 800,
                  color: s.savingsVsBaseline > 0 ? COLORS.green : s.savingsVsBaseline < 0 ? COLORS.red : COLORS.textFaint,
                }}>
                  {s.id === "traditional" ? "—" : (s.savingsVsBaseline >= 0 ? "−" : "+") + fmtCompact(Math.abs(s.savingsVsBaseline))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ ...STYLES.card, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <SectionLabel>Extra payment each month</SectionLabel>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.accent, fontVariantNumeric: "tabular-nums" }}>
            {fmtUsd(m.extra_payment_cents)}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          value={m.extra_payment_cents}
          onChange={(e) => setM({ extra_payment_cents: parseInt(e.target.value, 10) })}
          aria-label="Extra monthly payment"
          style={{ width: "100%", accentColor: COLORS.accent }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textFaint, marginTop: 4, fontWeight: 600 }}>
          <span>$0</span><span>$2,500</span><span>$5,000</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>
          The slider feeds the Extra-Principal, HELOC, and Refi+Extra strategies — everything updates live.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <BlockCard title="Mortgage" sub="" accent={COLORS.purple} icon={ICON.edit}>
          <InputRow label="Mortgage balance" value={m.mortgage_balance_cents} onChange={(v) => setM({ mortgage_balance_cents: v })} />
          <InputRow label="Mortgage payment" value={m.mortgage_payment_cents} onChange={(v) => setM({ mortgage_payment_cents: v })} />
          <PctRow    label="Mortgage rate"    bps={m.mortgage_rate_bps}    onChange={(b) => setM({ mortgage_rate_bps: b })} />
          <PctRow    label="HELOC rate"       bps={m.heloc_rate_bps}       onChange={(b) => setM({ heloc_rate_bps: b })} />
          <InputRow label="Home value" value={m.home_value_cents} onChange={(v) => setM({ home_value_cents: v })} />
          <InputRow label="HELOC limit" value={m.heloc_limit_cents} onChange={(v) => setM({ heloc_limit_cents: v })} />
          <InputRow label="Monthly income"   value={m.monthly_income_cents}   onChange={(v) => setM({ monthly_income_cents: v })} />
          <InputRow label="Monthly expenses" value={m.monthly_expenses_cents} onChange={(v) => setM({ monthly_expenses_cents: v })} />
        </BlockCard>
        <BlockCard title="Refinance scenario" sub="" accent={COLORS.green} icon={ICON.refresh}>
          <PctRow
            label="Refi target rate"
            bps={stratInputs.refiRateBps}
            onChange={(b) => setS({ refi_target_rate_bps: b })}
          />
          <InputRow
            label="Refi closing costs"
            value={stratInputs.refiCostCents}
            onChange={(v) => setS({ refi_cost_cents: v })}
          />
          <PctRow
            label="Marginal tax rate"
            bps={stratInputs.marginalBps}
            onChange={(b) => setS({ marginal_tax_bps: b })}
          />
          <div style={{ marginTop: 8, padding: "10px 12px", background: COLORS.surfaceTint, borderRadius: 10, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5 }}>
            Refi scenarios appear in the comparison only when the target rate is below your current mortgage rate. After-tax cost = total interest × (1 − marginal rate). Real tax treatment varies — this is a planning estimate, not tax advice.
          </div>
        </BlockCard>
      </div>
    </div>
  );
}

// ── Mom's loan drill ─────────────────────────────────────────────────

function MomLoanDrill({ state, updateState }) {
  const loan = state.mom_loans[0];
  if (!loan) {
    return (
      <div>
        <DrillTitle
          title="Mom's Loan"
          subtitle="Bidirectional ledger — track money going to her and coming back."
          icon={ICON.home}
          iconColor={COLORS.amber}
          iconBg={COLORS.amberBg}
        />
        <button
          onClick={() => updateState((s) => ({
            ...s,
            mom_loans: [{ label: "Mom's loan", starting_balance_cents: 0, monthly_payment_cents: 30000, due_day: 1, payments: [] }],
          }))}
          style={btn("primary")}
        >
          Create loan
        </button>
      </div>
    );
  }

  // Legacy entries have no `direction` — treat as "in" (paying down the
  // original appliance loan).
  const entries = (loan.payments || []).map((p) => ({
    ...p,
    direction: p.direction === "out" ? "out" : "in",
  }));
  const moneyIn  = entries.filter((p) => p.direction === "in").reduce((s, p) => s + p.amount_cents, 0);
  const moneyOut = entries.filter((p) => p.direction === "out").reduce((s, p) => s + p.amount_cents, 0);
  // Positive net → Mom owes Harrison. Negative → Harrison owes Mom.
  const net = loan.starting_balance_cents + moneyOut - moneyIn;
  const sortedEntries = [...entries]
    .map((p, originalIdx) => ({ ...p, originalIdx }))
    .sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1));

  const addEntry = (direction, amount_cents, note) => {
    if (!amount_cents || amount_cents <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    updateState((s) => ({
      ...s,
      mom_loans: [{
        ...loan,
        payments: [...loan.payments, { paid_on: today, amount_cents, direction, note: note || undefined }],
      }],
    }));
    fireConfetti({ count: 30, originY: 0.45 });
  };

  const deleteEntry = (originalIdx) => {
    updateState((s) => ({
      ...s,
      mom_loans: [{ ...loan, payments: loan.payments.filter((_, i) => i !== originalIdx) }],
    }));
  };

  const heroLabel = net === 0
    ? "settled up"
    : net > 0
    ? `Mom owes you · started at ${fmtUsd(loan.starting_balance_cents)}`
    : `you owe Mom · started at ${fmtUsd(loan.starting_balance_cents)}`;
  const heroColor = net > 0 ? COLORS.text : net < 0 ? COLORS.amber : COLORS.green;

  return (
    <div>
      <DrillTitle
        title={loan.label}
        subtitle={`${entries.length} entr${entries.length === 1 ? "y" : "ies"} · in ${fmtUsd(moneyIn, { compact: true })} · out ${fmtUsd(moneyOut, { compact: true })}`}
        icon={ICON.home}
        iconColor={COLORS.amber}
        iconBg={COLORS.amberBg}
        heroValue={fmtUsd(Math.abs(net))}
        heroLabel={heroLabel}
        heroColor={heroColor}
      />

      {/* Quick log — two side-by-side inline forms */}
      <div style={{
        ...STYLES.card,
        padding: 16,
        marginBottom: 14,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}>
        <MomLoanQuickLog
          direction="in"
          accent={COLORS.green}
          label="Money in"
          hint="She paid you (appliance payback, etc.)"
          defaultAmount={loan.monthly_payment_cents}
          onSubmit={(amt, note) => addEntry("in", amt, note)}
        />
        <MomLoanQuickLog
          direction="out"
          accent={COLORS.amber}
          label="Money out"
          hint="You paid her (retirement support from cash flow)"
          defaultAmount={loan.monthly_payment_cents}
          onSubmit={(amt, note) => addEntry("out", amt, note)}
        />
      </div>

      <BlockCard
        title="Terms"
        accent={COLORS.amber}
        icon={ICON.edit}
        style={{ marginBottom: 14 }}
      >
        <InputRow
          label="Starting balance owed (appliances)"
          value={loan.starting_balance_cents}
          onChange={(v) => updateState((s) => ({ ...s, mom_loans: [{ ...loan, starting_balance_cents: v }] }))}
        />
        <InputRow
          label="Suggested payment amount"
          value={loan.monthly_payment_cents}
          onChange={(v) => updateState((s) => ({ ...s, mom_loans: [{ ...loan, monthly_payment_cents: v }] }))}
        />
      </BlockCard>

      <BlockCard
        title="Ledger"
        sub={`net ${net >= 0 ? "" : "−"}${fmtUsd(Math.abs(net), { compact: true })}`}
        accent={COLORS.accent}
        icon={ICON.refresh}
        count={`${entries.length}`}
      >
        {sortedEntries.length === 0 ? (
          <div style={{ ...TYPE.caption, fontStyle: "italic", padding: "8px 4px" }}>
            No entries yet. Tap a button above to log the first one.
          </div>
        ) : (
          sortedEntries.map((p) => (
            <MomLoanLedgerRow
              key={p.originalIdx}
              entry={p}
              onDelete={() => deleteEntry(p.originalIdx)}
            />
          ))
        )}
      </BlockCard>
    </div>
  );
}

function MomLoanQuickLog({ direction, accent, label, hint, defaultAmount, onSubmit }) {
  const [amount, setAmount] = useState(defaultAmount ? String((defaultAmount / 100).toFixed(2)) : "");
  const [note, setNote] = useState("");
  const commit = () => {
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0) return;
    onSubmit(Math.round(n * 100), note.trim() || undefined);
    setAmount(defaultAmount ? String((defaultAmount / 100).toFixed(2)) : "");
    setNote("");
  };
  const arrow = direction === "in" ? ICON.arrowDn : ICON.arrowUp;
  return (
    <div style={{
      padding: 12,
      borderRadius: RADII.lg,
      border: `1px solid ${accent}33`,
      background: `${accent}0A`,
      display: "grid",
      gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 7,
          background: `${accent}1F`, color: accent,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Icon d={arrow} size={12} />
        </div>
        <div style={{ ...TYPE.bodyBold, color: accent }}>{label}</div>
      </div>
      <div style={TYPE.caption}>{hint}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="number"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
          placeholder="0.00"
          aria-label={`${label} amount`}
          style={{ ...inputStyle(), width: 92, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
          placeholder="note"
          aria-label={`${label} note`}
          style={{ ...inputStyle(), flex: 1, minWidth: 0 }}
        />
        <button
          type="button"
          onClick={commit}
          aria-label={`Log ${label.toLowerCase()}`}
          style={{
            ...btn("primary"),
            background: accent,
            padding: "0 14px",
            height: 32,
            borderRadius: RADII.sm,
          }}
        >
          Log
        </button>
      </div>
    </div>
  );
}

function MomLoanLedgerRow({ entry, onDelete }) {
  const isIn = entry.direction === "in";
  const tone = isIn ? COLORS.green : COLORS.amber;
  const sign = isIn ? "+" : "−";
  const displayDate = (() => {
    const d = new Date(entry.paid_on);
    if (isNaN(d)) return entry.paid_on;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  })();
  return (
    <div className="bb-row" style={{
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr) auto 22px",
      gap: 10,
      alignItems: "center",
      padding: "9px 4px",
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: RADII.pill,
        background: `${tone}1A`,
        color: tone,
        ...TYPE.eyebrow,
        fontSize: 9,
      }}>
        <Icon d={isIn ? ICON.arrowDn : ICON.arrowUp} size={10} />
        {isIn ? "IN" : "OUT"}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...TYPE.body, color: COLORS.text }}>
          {entry.note || (isIn ? "Payment from Mom" : "Sent to Mom")}
        </div>
        <div style={{ ...TYPE.caption, marginTop: 2 }}>{displayDate}</div>
      </div>
      <div style={{ ...TYPE.value, color: tone }}>
        {sign}{fmtUsd(entry.amount_cents)}
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete entry"
        style={{
          width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
          background: "transparent", color: COLORS.textFaint, opacity: 0.4,
          display: "grid", placeItems: "center", transition: "all 0.12s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
      >
        <Icon d={ICON.x} size={12} />
      </button>
    </div>
  );
}

// ── Small reusable bits ──────────────────────────────────────────────

function DrillTitle({ title, subtitle, icon, iconColor, iconBg, heroValue, heroLabel, heroColor, breakdown }) {
  return (
    <div style={{
      marginBottom: 16,
      padding: "20px 22px 24px",
      borderRadius: 18,
      background: iconBg ? `linear-gradient(135deg, ${iconBg} 0%, ${COLORS.surface} 80%)` : COLORS.surfaceTint,
      border: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: heroValue ? 16 : 0 }}>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: iconBg ? "rgba(255,255,255,0.85)" : COLORS.surface,
            color: iconColor || COLORS.textMuted,
            display: "grid", placeItems: "center", flexShrink: 0,
            boxShadow: "0 1px 2px rgba(13,20,36,0.06)",
          }}>
            <Icon d={icon} size={22} />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15 }}>{title}</h2>
          {subtitle && <div style={{ marginTop: 4, color: COLORS.textMuted, fontSize: 13.5, lineHeight: 1.45 }}>{subtitle}</div>}
        </div>
      </div>
      {heroValue != null && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
          <div style={{
            fontSize: 36, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1,
            color: heroColor || COLORS.text, fontVariantNumeric: "tabular-nums",
          }}>
            {heroValue}
          </div>
          {heroLabel && (
            <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600 }}>{heroLabel}</div>
          )}
        </div>
      )}
      {breakdown && breakdown.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: "flex", height: 8, borderRadius: 100, overflow: "hidden",
            background: COLORS.surfaceTint,
          }}>
            {breakdown.map((b, i) => (
              <div key={i} title={`${b.label}: ${b.value}`} style={{
                width: `${b.pct}%`, background: b.color, transition: "width 0.3s ease",
              }} />
            ))}
          </div>
          <div style={{
            marginTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 14px",
            fontSize: 11.5, color: COLORS.textMuted,
          }}>
            {breakdown.filter((b) => b.pct >= 1).map((b, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, display: "inline-block" }} />
                <span style={{ color: COLORS.text, fontWeight: 600 }}>{b.label}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{b.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockCard({ title, sub, children, style, accent, icon, emoji, count, onTitleChange }) {
  const accentColor = accent || COLORS.textMuted;
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18,
      overflow: "hidden",
      position: "relative",
      boxShadow: COLORS.shadow,
      ...style,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 10, padding: "14px 18px 10px",
        borderBottom: `1px solid ${COLORS.surfaceTint}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {emoji ? (
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: accent ? `${accentColor}1F` : COLORS.surfaceTint,
              display: "grid", placeItems: "center", flexShrink: 0,
              fontSize: 16, lineHeight: 1,
            }}>
              {emoji}
            </div>
          ) : icon && (
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: accent ? `${accentColor}1F` : COLORS.surfaceTint,
              color: accentColor,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Icon d={icon} size={15} />
            </div>
          )}
          <div style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
            {onTitleChange ? (
              <EditableHeader value={title} onChange={onTitleChange} />
            ) : (
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.005em" }}>{title}</div>
            )}
            {count != null && (
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textFaint }}>{count}</div>
            )}
          </div>
        </div>
        {sub && (
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{ padding: "6px 14px 14px" }}>
        {children}
      </div>
    </div>
  );
}

// Same UX as InlineText but sized for section headers — bigger, bolder,
// no padding shift on click. Click → input. Blur or Enter commits.
function EditableHeader({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const base = {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.text,
    letterSpacing: "-0.005em",
    fontFamily: FONT,
  };
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); const t = draft.trim(); if (t && t !== value) onChange(t); else setDraft(value); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") { setDraft(value); setEditing(false); }
        }}
        maxLength={60}
        aria-label={`Rename ${value}`}
        style={{
          ...base,
          background: COLORS.surfaceTint,
          border: `1px solid ${COLORS.border}`,
          outline: "none",
          padding: "2px 8px",
          borderRadius: 6,
          minWidth: 120,
          maxWidth: 280,
        }}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to rename"
      style={{
        ...base,
        background: "transparent",
        border: "none",
        padding: "2px 4px",
        margin: "0 -4px",
        borderRadius: 6,
        cursor: "text",
        textAlign: "left",
        transition: "background 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceTint; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {value}
    </button>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.textFaint, marginBottom: 6, marginTop: 4 }}>{children}</div>;
}

function Row({ label, value, sub }) {
  return (
    <div className="bb-row" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 4px",
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "14px 16px",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.textFaint }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || COLORS.text, fontVariantNumeric: "tabular-nums", marginTop: 6, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function InputRow({ label, value, onChange }) {
  const [draft, setDraft] = useState(String((value / 100).toFixed(2)));
  useEffect(() => setDraft(String((value / 100).toFixed(2))), [value]);
  return (
    <div className="bb-row" style={{
      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center",
      padding: "8px 4px", minHeight: 40, gap: 12,
    }}>
      <div style={TYPE.label}>{label}</div>
      <input
        type="number"
        step="0.01"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        style={{ ...inputStyle(), width: 140, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
      />
    </div>
  );
}

function PctRow({ label, bps, onChange }) {
  const [draft, setDraft] = useState(bps != null ? (bps / 100).toFixed(2) : "");
  useEffect(() => setDraft(bps != null ? (bps / 100).toFixed(2) : ""), [bps]);
  return (
    <div className="bb-row" style={{
      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center",
      padding: "8px 4px", minHeight: 40, gap: 12,
    }}>
      <div style={TYPE.label}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="number"
          step="0.01"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          style={{ ...inputStyle(), width: 90, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
        />
        <span style={{ ...TYPE.body, color: COLORS.textFaint, fontWeight: 700 }}>%</span>
      </div>
    </div>
  );
}

function ShortcutsHelp({ onClose }) {
  const groups = [
    {
      title: "Jump to a section",
      items: [
        ["g d", "Dashboard"],
        ["g e", "Envelopes"],
        ["g h", "Habits"],
        ["g o", "Goals"],
        ["g a", "Achievements"],
        ["g s", "Settings"],
      ],
    },
    {
      title: "Open a drill",
      items: [
        ["1", "Rentals"],
        ["2", "Net worth"],
        ["3", "HELOC"],
        ["4", "Family loan"],
      ],
    },
    {
      title: "Quick actions",
      items: [
        ["q", "Quick add expense"],
        ["+", "Quick add expense"],
        ["⌘ N", "Quick add expense"],
        ["?", "Show / hide this list"],
        ["Esc", "Close any open drill or modal"],
      ],
    },
  ];
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 70,
        background: "rgba(13,20,36,0.55)",
        backdropFilter: "blur(2px)",
        display: "grid", placeItems: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...STYLES.card,
          padding: 22,
          maxWidth: 520, width: "100%",
          maxHeight: "82vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Keyboard shortcuts</div>
            <div style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
              Two-key nav like Gmail. Press <kbd>g</kbd> then the destination key.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ ...textBtnStyle(), padding: "4px 8px" }}>
            <Icon d={ICON.x} size={14} />
          </button>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 6 }}>
                {g.title}
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                {g.items.map(([key, label]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 10, alignItems: "center", padding: "6px 8px", borderRadius: 8 }}>
                    <kbd style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 36, padding: "2px 8px",
                      background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
                      borderRadius: 6, fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                      fontSize: 11, fontWeight: 700, color: COLORS.text,
                    }}>{key}</kbd>
                    <span style={{ fontSize: 12.5, color: COLORS.text, fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toast({ kind, message, onDismiss }) {
  const bg = kind === "error" ? COLORS.red : kind === "success" ? COLORS.green : COLORS.text;
  return (
    <div style={{
      background: bg, color: "#fff",
      padding: "12px 18px", borderRadius: 100,
      boxShadow: "0 8px 28px rgba(15,23,41,0.25)",
      fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 10,
      animation: "bb-toast-in 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      {message}
      <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#fff", opacity: 0.7, cursor: "pointer", padding: 0 }} aria-label="Dismiss">
        <Icon d={ICON.x} size={14} color="#fff" />
      </button>
    </div>
  );
}

// ── Section views (Envelopes / Habits / Goals / Achievements / Settings) ──

// Inline panel for moving money from one envelope's balance into
// another (recorded as an envelope transfer — see moveMoney). Pure UI:
// validates, then hands a clean (from, to, cents, note) to onMove.
function MoveMoneyPanel({ categories, balancesByLabel, onMove, onClose }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const amountRef = useRef(null);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.label.localeCompare(b.label)),
    [categories],
  );
  const fromBal = from ? balancesByLabel.get(from.toLowerCase()) : null;
  const fromAvailable = fromBal ? fromBal.available : 0;

  const labelStyle = {
    display: "block", fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.06em", textTransform: "uppercase",
    color: COLORS.textFaint, marginBottom: 4,
  };
  const selStyle = { ...inputStyle(), width: "100%", cursor: "pointer", fontWeight: 600 };

  function submit() {
    const n = parseFloat(amount);
    const cents = isNaN(n) ? 0 : Math.round(n * 100);
    if (!from || !to) { setErr("Pick which envelope to move from and to."); return; }
    if (from === to) { setErr("Pick two different envelopes."); return; }
    if (cents <= 0) {
      setErr("Enter an amount to move.");
      if (amountRef.current) {
        amountRef.current.style.animation = "none";
        void amountRef.current.offsetWidth; // reflow so the wiggle re-fires
        amountRef.current.style.animation = "bb-wiggle 0.4s ease";
      }
      return;
    }
    onMove(from, to, cents, note.trim() || undefined);
  }

  return (
    <div style={{ ...STYLES.card, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>Move money between envelopes</div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 28, height: 28, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}
        >
          <Icon d={ICON.x} size={13} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        <div>
          <label style={labelStyle}>From</label>
          <select
            value={from}
            onChange={(e) => { setFrom(e.target.value); if (err) setErr(""); }}
            aria-label="Move money from"
            style={selStyle}
          >
            <option value="">Select envelope…</option>
            {sorted.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
          </select>
          {from && (
            <div style={{ marginTop: 5, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
              <span style={{ color: fromAvailable >= 0 ? COLORS.green : COLORS.red }}>{fmtUsd(fromAvailable)}</span> available ·{" "}
              <button
                onClick={() => { setAmount((Math.max(0, fromAvailable) / 100).toFixed(2)); if (err) setErr(""); }}
                style={{
                  background: "transparent", border: "none", padding: 0, cursor: "pointer",
                  fontFamily: FONT, fontSize: 11, fontWeight: 700, color: COLORS.accent,
                }}
              >
                Move all
              </button>
            </div>
          )}
        </div>
        <div>
          <label style={labelStyle}>To</label>
          <select
            value={to}
            onChange={(e) => { setTo(e.target.value); if (err) setErr(""); }}
            aria-label="Move money to"
            style={selStyle}
          >
            <option value="">Select envelope…</option>
            {sorted.map((c) => <option key={c.label} value={c.label} disabled={c.label === from}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 10 }}>
        <div>
          <label style={labelStyle}>Amount</label>
          <input
            ref={amountRef}
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); if (err) setErr(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="0.00"
            aria-label="Amount to move"
            style={{ ...inputStyle(), width: "100%", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
          />
        </div>
        <div>
          <label style={labelStyle}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="e.g. leftover groceries"
            aria-label="Transfer note"
            maxLength={80}
            style={{ ...inputStyle(), width: "100%", fontWeight: 600 }}
          />
        </div>
      </div>
      {err && (
        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{err}</div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={submit} style={{ ...btn("primary") }}>
          <Icon d={["M8 3L4 7l4 4", "M4 7h16", "M16 21l4-4-4-4", "M20 17H4"]} size={13} />
          Move money
        </button>
        <button onClick={onClose} style={{ ...btn("ghost") }}>Cancel</button>
      </div>
    </div>
  );
}

function EnvelopesView({ state, updateState, activeMonth, setActiveMonth }) {
  const [moveOpen, setMoveOpen] = useState(false);
  const grouped = useMemo(() => {
    const g = {};
    for (const c of state.categories) {
      const key = c.group_key || "other";
      (g[key] = g[key] || []).push(c);
    }
    return g;
  }, [state.categories]);

  const startMonth = useMemo(() => envelopeStartMonth(state), [state]);

  // Compute every envelope balance once so the totals + per-row math
  // never go out of sync.
  const balancesByLabel = useMemo(() => {
    const map = new Map();
    for (const c of state.categories) {
      map.set(c.label.toLowerCase(), envelopeBalance(state, c, activeMonth, startMonth));
    }
    return map;
  }, [state, activeMonth, startMonth]);

  const totalBudget = state.categories.reduce((s, c) => s + categoryMonthly(c), 0);
  const totalCarryover = state.categories.reduce(
    (s, c) => s + (balancesByLabel.get(c.label.toLowerCase())?.carryover ?? 0), 0,
  );
  const totalSpent = state.categories.reduce(
    (s, c) => s + (balancesByLabel.get(c.label.toLowerCase())?.thisMonthSpent ?? 0), 0,
  );
  const totalAvailable = totalCarryover + totalBudget - totalSpent;

  // Spending-plan breakdown by group (folded in from the old Personal
  // drill) — shows the shape of the monthly budget as a pie + legend.
  const incomeMo = state.income_sources.reduce((s, i) => s + incomeMonthly(i), 0);
  const breakdown = useMemo(() => {
    if (totalBudget === 0) return [];
    const order = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
    return order
      .map((g) => {
        const items = grouped[g];
        if (!items || items.length === 0) return null;
        const sum = items.reduce((s, c) => s + categoryMonthly(c), 0);
        if (sum === 0) return null;
        return {
          label: groupLabel(state, g),
          color: GROUP_META[g]?.accent || COLORS.textMuted,
          pct: (sum / totalBudget) * 100,
          value: fmtCompact(sum),
        };
      })
      .filter(Boolean);
  }, [grouped, totalBudget, state]);

  const groupOrder = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
  const populated = groupOrder.filter((g) => (grouped[g] || []).length > 0);
  // Always offer common groups so the user can drop a new envelope into
  // Housing / Food / Personal even before any exists in them.
  const emptyCommon = groupOrder.filter((g) =>
    !(grouped[g] && grouped[g].length) && ["housing", "food", "personal"].includes(g),
  );
  const groupsToShow = [...populated, ...emptyCommon];

  // Always create a NEW entry per log (no merging). Each entry carries
  // its own id, paid_on, and optional note so it can be edited or
  // deleted later.
  const logEntry = (categoryLabel, amount, note) => {
    if (!amount || amount <= 0) return;
    const today = new Date();
    const paid_on = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    updateState((s) => ({
      ...s,
      monthly_actuals: [
        ...(s.monthly_actuals || []),
        { id: genId(), category_label: categoryLabel, month: activeMonth, amount_cents: amount, paid_on, note: note || undefined },
      ],
    }));
    fireConfetti({ count: 30, originY: 0.45 });
  };

  const updateEntry = (id, patch) => updateState((s) => ({
    ...s,
    monthly_actuals: (s.monthly_actuals || []).map((a) =>
      (a.id && a.id === id) ? { ...a, ...patch } : a,
    ),
  }));

  const deleteEntry = (id) => updateState((s) => ({
    ...s,
    monthly_actuals: (s.monthly_actuals || []).filter((a) => a.id !== id),
  }));

  const bulkLog = (categoryLabel, parsed) => {
    if (!parsed || parsed.length === 0) return;
    const today = new Date();
    const paid_on = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    updateState((s) => ({
      ...s,
      monthly_actuals: [
        ...(s.monthly_actuals || []),
        ...parsed.map((p) => ({
          id: genId(),
          category_label: categoryLabel,
          month: activeMonth,
          amount_cents: p.amount_cents,
          paid_on,
          note: p.note || undefined,
        })),
      ],
    }));
    fireConfetti({ count: 60, originY: 0.45 });
  };

  // ── Envelope transfers ──────────────────────────────────────────────
  // Move money from one envelope's balance into another (e.g. month-end
  // leftover Food → Vacation). Recorded in its own ledger so it never
  // shows up as spending. Stamped with the month being viewed.
  const moveMoney = (fromLabel, toLabel, cents, note) => {
    if (!fromLabel || !toLabel || fromLabel === toLabel || !cents || cents <= 0) return;
    const today = new Date();
    const moved_on = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    updateState((s) => ({
      ...s,
      envelope_transfers: [
        ...(s.envelope_transfers || []),
        { id: genId(), from_label: fromLabel, to_label: toLabel, amount_cents: cents, month: activeMonth, moved_on, note: note || undefined },
      ],
    }));
    fireConfetti({ count: 30, originY: 0.45 });
  };

  // Deleting a transfer fully reverses it — money returns to both
  // envelopes — since every balance is derived from the ledger.
  const deleteTransfer = (id) => updateState((s) => ({
    ...s,
    envelope_transfers: (s.envelope_transfers || []).filter((t) => t.id !== id),
  }));

  // Category CRUD — same shape as PersonalDrill so editing an envelope
  // here writes back to the same `categories` array. Rename also
  // cascades to monthly_actuals.category_label so existing entries stay
  // linked to their envelope after a rename.
  const renameCategory = (oldLabel, newLabel) => {
    const trimmed = (newLabel || "").trim();
    if (!trimmed || trimmed === oldLabel) return;
    updateState((s) => {
      // Prevent collisions: if another category already owns this label
      // (case-insensitive), refuse silently rather than merging two.
      const exists = s.categories.some((c) =>
        c.label.toLowerCase() === trimmed.toLowerCase() && c.label !== oldLabel,
      );
      if (exists) return s;
      return {
        ...s,
        categories: s.categories.map((c) => c.label === oldLabel ? { ...c, label: trimmed } : c),
        monthly_actuals: (s.monthly_actuals || []).map((a) =>
          a.category_label === oldLabel ? { ...a, category_label: trimmed } : a,
        ),
        // Keep transfers pointed at the renamed envelope.
        envelope_transfers: (s.envelope_transfers || []).map((t) => ({
          ...t,
          from_label: t.from_label === oldLabel ? trimmed : t.from_label,
          to_label: t.to_label === oldLabel ? trimmed : t.to_label,
        })),
      };
    });
  };

  const deleteCategory = (label) => {
    updateState((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.label !== label),
      monthly_actuals: (s.monthly_actuals || []).filter((a) => a.category_label !== label),
      // Drop transfers touching the removed envelope — consistent with
      // dropping its logged spending.
      envelope_transfers: (s.envelope_transfers || []).filter(
        (t) => t.from_label !== label && t.to_label !== label,
      ),
    }));
  };

  const addCategory = (groupKey) => {
    updateState((s) => {
      const existingInGroup = s.categories.filter((c) => (c.group_key || "other") === groupKey);
      // Find a unique placeholder label so React keys stay stable and
      // the rename collision check in renameCategory still works.
      const base = `New ${GROUP_META[groupKey]?.label || groupKey} item`;
      let label = base;
      let i = 2;
      const taken = new Set(s.categories.map((c) => c.label.toLowerCase()));
      while (taken.has(label.toLowerCase())) { label = `${base} ${i++}`; }
      return {
        ...s,
        categories: [
          ...s.categories,
          {
            label,
            group_key: groupKey,
            default_monthly_cents: 0,
            default_biweekly_cents: 0,
            default_yearly_cents: 0,
            sort_order: existingInGroup.length,
          },
        ],
      };
    });
  };

  return (
    <div>
      <DrillTitle
        title="Envelopes"
        subtitle="Each category is a pot of money for the month. Leftover rolls into next month; overspent shows up red."
        icon="M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z M10 12h4"
        iconColor={COLORS.accent}
        iconBg={COLORS.accentSoft}
        heroValue={fmtUsd(totalAvailable)}
        heroLabel={`available · ${fmtUsd(totalCarryover, { compact: true })} carried in + ${fmtUsd(totalBudget, { compact: true })} budgeted − ${fmtUsd(totalSpent, { compact: true })} spent`}
        heroColor={totalAvailable >= 0 ? COLORS.green : COLORS.red}
      />

      {/* Income (set your take-home) — folded in from the old Personal
          drill so Envelopes is the one place to plan AND run the budget. */}
      <div style={{ marginBottom: 14 }}>
        <IncomeSourcesBlock state={state} updateState={updateState} />
      </div>

      {/* Where the monthly plan goes — pie of budgeted amounts by group. */}
      {breakdown.length > 0 && (
        <div className="bb-breakdown" style={{
          ...STYLES.card,
          padding: 18, marginBottom: 14,
          display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)",
          gap: 18, alignItems: "center",
        }}>
          <div style={{ position: "relative", width: 128, height: 128, justifySelf: "center" }}>
            <PieChart width={128} height={128}>
              <Pie data={breakdown.map((b) => ({ name: b.label, value: b.pct }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={2} strokeWidth={0}>
                {breakdown.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Pie>
              <RTooltip cursor={false} contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
                formatter={(v, n) => [`${v.toFixed(0)}%`, n]} />
            </PieChart>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em" }}>{fmtCompact(totalBudget)}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>/ mo</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "6px 14px" }}>
            {breakdown.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, minWidth: 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: b.color, flexShrink: 0 }} />
                <span style={{ color: COLORS.textMuted, fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</span>
                <span style={{ color: COLORS.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <MonthScrubber value={activeMonth} onChange={setActiveMonth} />
      <div style={{ marginTop: 12 }}>
        {moveOpen ? (
          <MoveMoneyPanel
            categories={state.categories}
            balancesByLabel={balancesByLabel}
            onMove={(from, to, cents, note) => { moveMoney(from, to, cents, note); setMoveOpen(false); }}
            onClose={() => setMoveOpen(false)}
          />
        ) : (
          <button
            onClick={() => setMoveOpen(true)}
            style={{ ...btn("ghost") }}
          >
            <Icon d={["M8 3L4 7l4 4", "M4 7h16", "M16 21l4-4-4-4", "M20 17H4"]} size={14} />
            Move money
          </button>
        )}
      </div>
      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
        {groupsToShow.map((g) => {
          const meta = GROUP_META[g] || GROUP_META.other;
          const items = grouped[g] || [];
          const groupAvailable = items.reduce(
            (s, c) => s + (balancesByLabel.get(c.label.toLowerCase())?.available ?? 0), 0,
          );
          return (
            <BlockCard
              key={g}
              title={groupLabel(state, g)}
              onTitleChange={(v) => renameGroup(updateState, g, v)}
              sub={`${fmtUsd(groupAvailable, { compact: true })} available`}
              accent={meta.accent}
              emoji={meta.emoji}
              count={`${items.length}`}
            >
              <SortableList
                items={items}
                getId={(c) => c.label}
                onReorder={(next) => updateState((s) => {
                  // Re-number sort_order within this group only — leave
                  // every other category's order untouched. Anchor on
                  // the group's lowest existing sort_order so we don't
                  // accidentally float this group above earlier ones.
                  const startOrder = Math.min(...items.map((i) => i.sort_order ?? 0));
                  const nextOrder = new Map(next.map((c, idx) => [c.label, startOrder + idx]));
                  return {
                    ...s,
                    categories: s.categories.map((c) =>
                      nextOrder.has(c.label) ? { ...c, sort_order: nextOrder.get(c.label) } : c,
                    ),
                  };
                })}
                renderItem={(c, handleProps) => {
                  const b = balancesByLabel.get(c.label.toLowerCase()) || envelopeBalance(state, c, activeMonth, startMonth);
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "stretch" }}>
                      <DragHandle handleProps={handleProps} style={{ alignSelf: "center" }} />
                      <div style={{ minWidth: 0 }}>
                        <EnvelopeRow
                          category={c}
                          balance={b}
                          accent={meta.accent}
                          state={state}
                          activeMonth={activeMonth}
                          onLog={(amount, note) => logEntry(c.label, amount, note)}
                          onBulk={(parsed) => bulkLog(c.label, parsed)}
                          onUpdateEntry={updateEntry}
                          onDeleteEntry={deleteEntry}
                          onDeleteTransfer={deleteTransfer}
                          onBudgetChange={(cents) => updateState((s) => ({
                            ...s,
                            categories: s.categories.map((cat) =>
                              cat.label.toLowerCase() === c.label.toLowerCase()
                                ? { ...cat, default_monthly_cents: cents, default_biweekly_cents: 0, default_yearly_cents: 0 }
                                : cat,
                            ),
                          }))}
                          onRename={(newLabel) => renameCategory(c.label, newLabel)}
                          onDeleteCategory={() => deleteCategory(c.label)}
                        />
                      </div>
                    </div>
                  );
                }}
              />
              <AddRowButton
                label={`Add ${meta.label.toLowerCase()} envelope`}
                accent={meta.accent}
                onClick={() => addCategory(g)}
              />
            </BlockCard>
          );
        })}
      </div>
    </div>
  );
}

function EnvelopeRow({ category, balance, accent, state, activeMonth, onLog, onBulk, onUpdateEntry, onDeleteEntry, onDeleteTransfer, onBudgetChange, onRename, onDeleteCategory }) {
  const { budget, carryover, thisMonthSpent, available, entries, transferNet = 0 } = balance;
  // Transfers touching this envelope in the month being viewed.
  const transfers = useMemo(() => {
    const lc = category.label.trim().toLowerCase();
    return (state?.envelope_transfers || []).filter(
      (t) => t.month === activeMonth
        && ((t.from_label || "").trim().toLowerCase() === lc
          || (t.to_label || "").trim().toLowerCase() === lc),
    );
  }, [state, category.label, activeMonth]);
  const [expanded, setExpanded] = useState(false);
  const [logging, setLogging] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState(category.label);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  useEffect(() => { setRenameDraft(category.label); }, [category.label]);
  const trend = useMemo(
    () => (state ? buildEnvelopeTrend(state, category.label, 6) : []),
    [state, category.label],
  );
  const trendHasData = trend.some((m) => m.spent > 0);

  const overspent = available < 0;
  // Progress: spent vs (budget + carryover, but at least the budget).
  const denom = Math.max(budget, budget + carryover);
  const pct = denom > 0 ? Math.min(100, (thisMonthSpent / denom) * 100) : 0;

  return (
    <div className="bb-row" style={{ padding: "12px 4px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse entries" : "Expand entries"}
          style={{
            minWidth: 0, textAlign: "left",
            background: "transparent", border: "none", cursor: "pointer",
            padding: 0, fontFamily: FONT, color: COLORS.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={expanded ? ICON.chevD : ICON.chevR} size={12} color={COLORS.textFaint} />
            <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{category.label}</span>
          </div>
          <div style={{ marginTop: 2, marginLeft: 18, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtUsd(thisMonthSpent)}</span>
            <span> of </span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtUsd(budget)}</span>
            {carryover !== 0 && (
              <>
                <span> · </span>
                <span style={{ color: carryover >= 0 ? COLORS.green : COLORS.red, fontVariantNumeric: "tabular-nums" }}>
                  {carryover >= 0 ? "+" : "−"}{fmtUsd(Math.abs(carryover))} carry
                </span>
              </>
            )}
            {transferNet !== 0 && (
              <>
                <span> · </span>
                <span style={{ color: transferNet > 0 ? COLORS.green : COLORS.amber, fontVariantNumeric: "tabular-nums" }}>
                  {transferNet > 0 ? "+" : "−"}{fmtUsd(Math.abs(transferNet))} moved
                </span>
              </>
            )}
            <span> · </span>
            <span style={{ color: overspent ? COLORS.red : available > 0 ? COLORS.green : COLORS.textFaint, fontWeight: 700 }}>
              {overspent ? `${fmtUsd(Math.abs(available))} over` : `${fmtUsd(available)} available`}
            </span>
          </div>
        </button>
        <div style={{ width: 96, height: 8, background: COLORS.surfaceTint, borderRadius: 100, overflow: "hidden", flexShrink: 0 }}>
          <div style={{
            width: `${Math.min(100, pct)}%`, height: "100%",
            background: overspent ? COLORS.red : accent,
            borderRadius: 100,
            transition: "width 0.4s cubic-bezier(0.2, 0.6, 0.4, 1)",
          }} />
        </div>
        <button
          onClick={() => setBulkOpen(true)}
          aria-label="Bulk paste"
          title="Bulk paste"
          style={{
            width: 28, height: 28, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
        >
          <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" size={12} />
        </button>
        <button
          onClick={() => setLogging((v) => !v)}
          aria-expanded={logging}
          style={{
            padding: "7px 12px", borderRadius: 100,
            background: logging ? `${accent}26` : `${accent}1A`, color: accent,
            border: "none", cursor: "pointer",
            fontSize: 11.5, fontWeight: 700, fontFamily: FONT,
            display: "inline-flex", alignItems: "center", gap: 4,
            whiteSpace: "nowrap", minHeight: 34,
            transition: "all 0.12s ease",
          }}
        >
          <Icon d={logging ? ICON.chevD : ["M12 5v14", "M5 12h14"]} size={11} />
          Log
        </button>
      </div>
      {logging && (
        <QuickLog
          accent={accent}
          onCommit={(amt, note) => { onLog(amt, note); setLogging(false); }}
          onCancel={() => setLogging(false)}
        />
      )}

      {trendHasData ? (
        <div style={{ marginTop: 8, marginLeft: 18, display: "flex", alignItems: "flex-end", gap: 3, height: 18 }} aria-label="Last 6 months">
          {(() => {
            const maxSpend = Math.max(budget || 1, ...trend.map((m) => m.spent));
            const lastIdx = trend.length - 1;
            return trend.map((m, i) => {
              const heightPct = maxSpend > 0 ? Math.max(2, (m.spent / maxSpend) * 100) : 2;
              const isCurrent = i === lastIdx;
              const overBudget = budget > 0 && m.spent > budget;
              return (
                <div
                  key={m.month}
                  title={`${m.month}: ${fmtUsd(m.spent)}${budget > 0 ? ` of ${fmtUsd(budget)}` : ""}`}
                  style={{
                    width: 8,
                    height: `${heightPct}%`,
                    background: overBudget ? COLORS.red : isCurrent ? accent : `${accent}88`,
                    borderRadius: 2,
                    transition: "height 0.3s ease",
                  }}
                />
              );
            });
          })()}
          <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>
            6 mo
          </span>
        </div>
      ) : null}

      {expanded && (
        <div style={{ marginTop: 10, paddingLeft: 18, borderLeft: `2px solid ${accent}33` }}>
          {onRename ? (
            <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", padding: "8px 4px 10px" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>Envelope name</div>
                <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
                  Rename without losing any logged spending.
                </div>
              </div>
              <input
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                onBlur={() => {
                  const next = renameDraft.trim();
                  if (next && next !== category.label) onRename(next);
                  else setRenameDraft(category.label);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") { setRenameDraft(category.label); e.currentTarget.blur(); }
                }}
                aria-label={`Rename ${category.label}`}
                maxLength={48}
                style={{ ...inputStyle(), width: 180, fontWeight: 600, fontSize: 13 }}
              />
            </div>
          ) : null}
          {onBudgetChange ? (
            <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", padding: "8px 4px 10px" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>Monthly budget</div>
                <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
                  Tap the number to set how much you can spend each month.
                </div>
              </div>
              <InlineNumber
                value={category.default_monthly_cents || 0}
                onChange={(v) => onBudgetChange(v)}
                width={130}
                allowNegative={false}
              />
            </div>
          ) : null}
          {entries.length === 0 ? (
            <div style={{ fontSize: 12, color: COLORS.textFaint, fontStyle: "italic", padding: "8px 4px" }}>
              No entries this month yet.
            </div>
          ) : entries.map((e) => (
            <EnvelopeEntry
              key={e.id || `${e.category_label}-${e.paid_on || e.month}-${e.amount_cents}`}
              entry={e}
              accent={accent}
              onUpdate={(patch) => onUpdateEntry(e.id, patch)}
              onDelete={() => onDeleteEntry(e.id)}
            />
          ))}
          {transfers.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase", padding: "10px 4px 2px" }}>
                Transfers this month
              </div>
              {transfers.map((t) => {
                const isOut = (t.from_label || "").trim().toLowerCase() === category.label.trim().toLowerCase();
                const other = isOut ? t.to_label : t.from_label;
                return (
                  <div key={t.id} className="bb-row" style={{
                    display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto 22px",
                    alignItems: "center", gap: 8, padding: "9px 4px",
                  }}>
                    <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: COLORS.textMuted }}>
                      <Icon
                        d={isOut ? ["M5 12h14", "M13 5l7 7-7 7"] : ["M19 12H5", "M11 19l-7-7 7-7"]}
                        size={12}
                        color={isOut ? COLORS.amber : COLORS.green}
                      />
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {isOut ? "To " : "From "}
                        <strong style={{ fontWeight: 700, color: COLORS.text }}>{other}</strong>
                        {t.note ? ` · ${t.note}` : ""}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: isOut ? COLORS.amber : COLORS.green }}>
                      {isOut ? "−" : "+"}{fmtUsd(t.amount_cents)}
                    </span>
                    {onDeleteTransfer ? (
                      <button
                        onClick={() => onDeleteTransfer(t.id)}
                        aria-label="Undo transfer"
                        className="bb-step-btn"
                        style={{ ...stepBtnStyle(), opacity: 0.4 }}
                        onMouseEnter={(ev) => { ev.currentTarget.style.opacity = 1; ev.currentTarget.style.background = COLORS.redBg; ev.currentTarget.style.color = COLORS.red; }}
                        onMouseLeave={(ev) => { ev.currentTarget.style.opacity = 0.4; ev.currentTarget.style.background = "transparent"; ev.currentTarget.style.color = COLORS.textMuted; }}
                      >
                        <Icon d={ICON.x} size={12} />
                      </button>
                    ) : <span />}
                  </div>
                );
              })}
            </div>
          )}
          {onDeleteCategory ? (
            <div style={{ marginTop: 12, padding: "8px 4px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${COLORS.border}` }}>
              {confirmingDelete ? (
                <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
                    Delete {category.label} and {entries.length} logged {entries.length === 1 ? "entry" : "entries"}?
                  </span>
                  <button
                    onClick={() => { onDeleteCategory(); setConfirmingDelete(false); }}
                    style={{
                      padding: "5px 12px", borderRadius: 100,
                      background: "#c45c4a", color: "#fff",
                      border: "none", cursor: "pointer",
                      fontSize: 11, fontWeight: 700, fontFamily: FONT,
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    style={{
                      padding: "5px 10px", borderRadius: 100,
                      background: "transparent", color: COLORS.textMuted,
                      border: `1px solid ${COLORS.border}`, cursor: "pointer",
                      fontSize: 11, fontWeight: 600, fontFamily: FONT,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  aria-label={`Delete ${category.label}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 8,
                    background: "transparent", color: COLORS.textFaint,
                    border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, fontFamily: FONT,
                    transition: "color 0.12s ease, background 0.12s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#c45c4a"; e.currentTarget.style.background = "rgba(196,92,74,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textFaint; e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon d={ICON.x} size={11} />
                  Delete envelope
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}

      {bulkOpen && (
        <BulkPasteSheet
          accent={accent}
          categoryLabel={category.label}
          onClose={() => setBulkOpen(false)}
          onSubmit={(parsed) => { onBulk(parsed); setBulkOpen(false); }}
        />
      )}
    </div>
  );
}

// Inline +/-amount/note entry. Tab into note, Enter commits, Esc cancels.
// Inline expense logger — a full-width row that drops below the
// envelope header (no longer crammed into a table cell). Note field
// flexes; the amount + buttons stay comfortable tap targets.
function QuickLog({ accent, onCommit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const commit = () => {
    const n = parseFloat(amount);
    if (!isNaN(n) && n > 0) onCommit(Math.round(n * 100), note.trim() || undefined);
    else onCancel();
  };
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, marginLeft: 18 }}>
      <input
        autoFocus
        type="text"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }}
        placeholder="$0.00"
        aria-label="Amount"
        style={{ ...inputStyle(), width: 104, flexShrink: 0, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, padding: "10px 12px" }}
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }}
        placeholder="note (optional)"
        aria-label="Note"
        style={{ ...inputStyle(), flex: 1, minWidth: 0, fontWeight: 600, padding: "10px 12px" }}
      />
      <button
        onClick={commit}
        aria-label="Save entry"
        style={{
          width: 38, height: 38, flexShrink: 0, borderRadius: 10, border: "none",
          background: accent, color: "#fff", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}
      >
        <Icon d="M20 6L9 17l-5-5" size={15} />
      </button>
      <button
        onClick={onCancel}
        aria-label="Cancel"
        style={{
          width: 38, height: 38, flexShrink: 0, borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
          display: "grid", placeItems: "center",
        }}
      >
        <Icon d={ICON.x} size={14} />
      </button>
    </div>
  );
}

function EnvelopeEntry({ entry, accent, onUpdate, onDelete }) {
  const [editingAmount, setEditingAmount] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [amountDraft, setAmountDraft] = useState(String((entry.amount_cents / 100).toFixed(2)));
  const [noteDraft, setNoteDraft] = useState(entry.note || "");
  useEffect(() => setAmountDraft(String((entry.amount_cents / 100).toFixed(2))), [entry.amount_cents]);
  useEffect(() => setNoteDraft(entry.note || ""), [entry.note]);

  const displayDate = (() => {
    const iso = entry.paid_on || entry.month;
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  return (
    <div className="bb-row" style={{
      display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) 100px 24px",
      gap: 10, alignItems: "center", padding: "8px 4px", borderRadius: 8,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: accent,
        background: `${accent}14`, padding: "2px 8px", borderRadius: 100,
        textTransform: "uppercase", letterSpacing: "0.06em",
        fontVariantNumeric: "tabular-nums",
      }}>{displayDate}</span>

      {editingNote ? (
        <input
          autoFocus
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          onBlur={() => { setEditingNote(false); onUpdate({ note: noteDraft.trim() || undefined }); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setNoteDraft(entry.note || ""); setEditingNote(false); } }}
          placeholder="note"
          aria-label="Edit note"
          style={{ ...inputStyle(), width: "100%" }}
        />
      ) : (
        <button
          onClick={() => setEditingNote(true)}
          className="bb-edit-btn"
          style={{
            ...textBtnStyle(),
            color: entry.note ? COLORS.text : COLORS.textFaint,
            fontStyle: entry.note ? "normal" : "italic",
            fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {entry.note || "add a note"}
        </button>
      )}

      {editingAmount ? (
        <input
          autoFocus
          type="number"
          step="0.01"
          inputMode="decimal"
          value={amountDraft}
          onChange={(e) => setAmountDraft(e.target.value)}
          onBlur={() => { setEditingAmount(false); const n = parseFloat(amountDraft); if (!isNaN(n)) onUpdate({ amount_cents: Math.round(n * 100) }); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setAmountDraft(String((entry.amount_cents / 100).toFixed(2))); setEditingAmount(false); } }}
          aria-label="Edit amount"
          style={{ ...inputStyle(), width: "100%", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
        />
      ) : (
        <button
          onClick={() => setEditingAmount(true)}
          className="bb-edit-btn"
          style={{ ...textBtnStyle(), textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: COLORS.text }}
        >
          {fmtUsd(entry.amount_cents)}
        </button>
      )}

      <button
        onClick={onDelete}
        aria-label="Delete entry"
        style={{
          width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
          background: "transparent", color: COLORS.textFaint, opacity: 0.4,
          display: "grid", placeItems: "center",
          transition: "all 0.12s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
      >
        <Icon d={ICON.x} size={12} />
      </button>
    </div>
  );
}

function BulkPasteSheet({ accent, categoryLabel, onClose, onSubmit }) {
  const [text, setText] = useState("");
  const parsed = useMemo(() => parseBulkPaste(text), [text]);
  const total = parsed.reduce((s, p) => s + p.amount_cents, 0);
  // Portal to <body> so the overlay escapes the per-row stacking context
  // created by SortableRow (position:relative; z-index:1) — without it,
  // later sibling envelope rows paint over the fixed sheet. The wrapper
  // re-declares [data-bb-theme] locally so the card's var(--bb-surface)
  // still resolves to an opaque color once it's outside the page tree.
  if (typeof document === "undefined") return null;
  const theme = document.getElementById("bb-budget-root")?.getAttribute("data-bb-theme") || DEFAULT_THEME;
  return createPortal((
    <div
      data-bb-theme={theme}
      onClick={onClose}
      className="bb-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(15,23,41,0.45)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bb-modal-card"
        style={{
          background: COLORS.surface, borderRadius: 18,
          width: "100%", maxWidth: 480, maxHeight: "90vh",
          boxShadow: "0 24px 80px rgba(15,23,41,0.28)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.015em" }}>Bulk add to {categoryLabel}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>
                One per line. We'll grab the dollar amount and use the rest as a note.
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{
              width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.border}`,
              background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
              display: "grid", placeItems: "center",
            }}>
              <Icon d={ICON.x} size={14} />
            </button>
          </div>
        </div>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Costco run 45\n12.99 spotify\nLunch 18.50"}
          spellCheck={false}
          style={{
            flex: 1, padding: 16, fontSize: 13,
            fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
            border: "none", outline: "none", resize: "none",
            color: COLORS.text, background: COLORS.surfaceAlt,
            minHeight: 160,
          }}
        />
        <div style={{
          padding: "12px 20px", borderTop: `1px solid ${COLORS.surfaceTint}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
            {parsed.length === 0 ? "Nothing to add yet." : `${parsed.length} entry${parsed.length === 1 ? "" : "s"} · ${fmtUsd(total)}`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ ...btn("ghost") }}>Cancel</button>
            <button
              onClick={() => onSubmit(parsed)}
              disabled={parsed.length === 0}
              style={{ ...btn("primary"), background: accent, opacity: parsed.length === 0 ? 0.5 : 1 }}
            >
              <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
              Add {parsed.length || ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  ), document.body);
}

// ── Habits view — daily/weekly/monthly check-ins with streaks ────────

function HabitsView({ state, updateState }) {
  // Merge stored habits with starter templates (if user has no habits yet,
  // they see the templates as suggestions that "activate" on first check).
  const stored = state.habits || [];
  const habits = stored.length > 0
    ? stored
    : DEFAULT_HABITS.map((d) => ({ ...d, completions: [], created_at: new Date().toISOString() }));
  const isDefault = stored.length === 0;

  const profile = state.settings.habit_profile || "all";
  const style = state.settings.habit_style || "heatmap";
  const setProfile = (id) => updateState((s) => ({ ...s, settings: { ...s.settings, habit_profile: id } }));
  const setStyle = (id) => updateState((s) => ({ ...s, settings: { ...s.settings, habit_style: id } }));

  const visibleHabits = useMemo(() => {
    if (profile === "all") return habits;
    return habits.filter((h) => (h.owner || "shared") === profile);
  }, [habits, profile]);

  const today = new Date().toISOString().slice(0, 10);

  const toggle = (habit) => {
    updateState((s) => {
      // If using defaults, materialize them into state on first interaction.
      let next = s.habits ? [...s.habits] : [];
      if (next.length === 0) {
        next = DEFAULT_HABITS.map((d) => ({ ...d, completions: [], created_at: new Date().toISOString() }));
      }
      const idx = next.findIndex((h) => h.id === habit.id);
      if (idx < 0) return s;
      const set = new Set(next[idx].completions || []);
      if (set.has(today)) set.delete(today); else { set.add(today); fireConfetti({ count: 35, originY: 0.4 }); }
      next[idx] = { ...next[idx], completions: Array.from(set).sort() };
      return { ...s, habits: next };
    });
  };

  const addHabit = () => updateState((s) => ({
    ...s,
    habits: [
      ...(s.habits || (isDefault ? DEFAULT_HABITS.map((d) => ({ ...d, completions: [], created_at: new Date().toISOString() })) : [])),
      {
        id: genId(),
        label: "New habit",
        cadence: "daily",
        color: "#4a7c59",
        owner: profile === "all" ? "shared" : profile,
        completions: [],
        created_at: new Date().toISOString(),
      },
    ],
  }));

  const updateHabit = (id, patch) => updateState((s) => ({
    ...s,
    habits: (s.habits || []).map((h) => h.id === id ? { ...h, ...patch } : h),
  }));

  const deleteHabit = (id) => updateState((s) => ({
    ...s,
    habits: (s.habits || []).filter((h) => h.id !== id),
  }));

  const overallStreak = useMemo(() => {
    let best = 0;
    for (const h of visibleHabits) {
      const s = computeHabitStreak(h);
      if (s > best) best = s;
    }
    return best;
  }, [visibleHabits]);

  const completedToday = visibleHabits.filter((h) => (h.completions || []).includes(today)).length;

  const renderHabit = (h) => {
    const common = {
      habit: h,
      today,
      goals: state.goals || [],
      onToggle: () => toggle(h),
      onLabelChange: (v) => updateHabit(h.id, { label: v }),
      onCadenceChange: (v) => updateHabit(h.id, { cadence: v }),
      onOwnerChange: (v) => updateHabit(h.id, { owner: v }),
      onColorChange: (v) => updateHabit(h.id, { color: v }),
      onGroupChange: (v) => updateHabit(h.id, { group: v }),
      onLinkedGoalChange: (v) => updateHabit(h.id, { linked_goal_id: v || null }),
      onDelete: isDefault ? null : () => deleteHabit(h.id),
    };
    if (style === "garden") return <HabitCardGarden key={h.id} {...common} />;
    if (style === "stride") return <HabitCardStride key={h.id} {...common} />;
    return <HabitCardHeatmap key={h.id} {...common} />;
  };

  // Bucket visible habits by their `group` field so the view reads
  // top-down: Money → Marriage → Health → Uncategorized, etc.
  const habitsByGroup = useMemo(() => {
    const m = new Map();
    for (const h of visibleHabits) {
      const key = h.group?.trim() || "Uncategorized";
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(h);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [visibleHabits]);

  return (
    <div>
      <DrillTitle
        title="Habits"
        subtitle="The small daily wins that make the big numbers move. Tap to mark done."
        icon="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3"
        iconColor="#d6448f"
        iconBg="rgba(214,68,143,0.10)"
        heroValue={`${completedToday}/${visibleHabits.length || habits.length}`}
        heroLabel={`done today · best streak ${overallStreak} day${overallStreak === 1 ? "" : "s"}`}
      />

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <ProfileTabs value={profile} onChange={setProfile} habits={habits} />
        <StylePicker value={style} onChange={setStyle} />
      </div>

      {visibleHabits.length === 0 ? (
        <div style={{ ...STYLES.card, padding: 28, textAlign: "center", color: COLORS.textMuted }}>
          No habits for this profile yet — add one below.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {habitsByGroup.map(([groupName, items]) => {
            const doneInGroup = items.filter((h) => (h.completions || []).includes(today)).length;
            return (
              <section key={groupName}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "0 4px 10px" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.text }}>
                    {groupName}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>
                    {doneInGroup}/{items.length} today
                  </span>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: style === "garden" ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
                  gap: 14,
                }}>
                  <SortableList
                    items={items}
                    getId={(h) => h.id}
                    strategy={style === "garden" ? "rect" : "vertical"}
                    disabled={isDefault}
                    onReorder={(next) => updateState((s) => {
                      // Re-order habits[] so the next sync write
                      // persists the user's chosen order. Habits
                      // grouped by `group` field are reordered only
                      // within their visible bucket — other habits
                      // keep their relative position.
                      const visibleIds = new Set(items.map((h) => h.id));
                      const orderInGroup = next.map((h) => h.id);
                      let visibleCursor = 0;
                      const reordered = (s.habits || []).map((h) => {
                        if (!visibleIds.has(h.id)) return h;
                        const id = orderInGroup[visibleCursor++];
                        return (s.habits || []).find((x) => x.id === id) || h;
                      });
                      return { ...s, habits: reordered };
                    })}
                    renderItem={(h, handleProps) => (
                      <div style={{ position: "relative" }}>
                        {handleProps ? (
                          <div style={{ position: "absolute", top: 6, left: 6, zIndex: 2 }}>
                            <DragHandle handleProps={handleProps} />
                          </div>
                        ) : null}
                        {renderHabit(h)}
                      </div>
                    )}
                  />
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <AddRowButton label="Add habit" onClick={addHabit} accent="#d6448f" />
      </div>
    </div>
  );
}

function ProfileTabs({ value, onChange, habits }) {
  const counts = HABIT_OWNERS.reduce((acc, o) => {
    acc[o.id] = o.id === "all" ? habits.length : habits.filter((h) => (h.owner || "shared") === o.id).length;
    return acc;
  }, {});
  return (
    <div style={{
      display: "inline-flex", padding: 4, gap: 2,
      background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
      borderRadius: 100,
    }}>
      {HABIT_OWNERS.map((o) => {
        const active = value === o.id;
        return (
          <button key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 100,
              background: active ? COLORS.surface : "transparent",
              color: active ? o.accent : COLORS.textMuted,
              border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: FONT,
              boxShadow: active ? "0 1px 2px rgba(13,20,36,0.06)" : "none",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: active ? `${o.accent}26` : COLORS.surfaceTint,
              color: o.accent,
              display: "grid", placeItems: "center",
              fontSize: 9, fontWeight: 800,
            }}>{o.initial}</span>
            {o.label}
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: active ? o.accent : COLORS.textFaint,
              fontVariantNumeric: "tabular-nums",
            }}>{counts[o.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

function StylePicker({ value, onChange }) {
  return (
    <div style={{
      display: "inline-flex", padding: 4, gap: 2,
      background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
      borderRadius: 100,
    }}>
      {HABIT_STYLES.map((st) => {
        const active = value === st.id;
        return (
          <button key={st.id}
            onClick={() => onChange(st.id)}
            style={{
              padding: "5px 12px", borderRadius: 100,
              background: active ? COLORS.text : "transparent",
              color: active ? "#fff" : COLORS.textMuted,
              border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: FONT,
              transition: "all 0.15s ease",
            }}
          >
            {st.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Habit card style A: Heatmap row (compact horizontal, 12-week strip) ──

function HabitCardHeatmap({ habit, today, goals, onToggle, onLabelChange, onCadenceChange, onOwnerChange, onColorChange, onGroupChange, onLinkedGoalChange, onDelete }) {
  const done = (habit.completions || []).includes(today);
  const streak = computeHabitStreak(habit);
  const color = habit.color || "#d6448f";
  const heatmap = useMemo(() => buildHeatmap(habit.completions, 84), [habit.completions]);
  return (
    <div style={{ ...STYLES.card, padding: 18, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto auto", gap: 14, alignItems: "center" }}>
        <CheckButton done={done} color={color} onClick={onToggle} size={44} />
        <div style={{ minWidth: 0 }}>
          <InlineText value={habit.label} onChange={onLabelChange} />
          <HabitMeta habit={habit} streak={streak} color={color} goals={goals}
            onCadenceChange={onCadenceChange} onOwnerChange={onOwnerChange} onColorChange={onColorChange}
            onGroupChange={onGroupChange} onLinkedGoalChange={onLinkedGoalChange} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 3, alignContent: "center" }}>
          {heatmap.map((d, i) => (
            <div key={i} title={d.iso} style={{
              width: 10, height: 10, borderRadius: 2,
              background: d.done ? color : COLORS.surfaceTint, opacity: d.done ? 1 : 0.6,
            }} />
          ))}
        </div>
        <DeleteIconBtn onClick={onDelete} />
      </div>
    </div>
  );
}

// ── Habit card style B: Garden (large pixel grid, 26 weeks, intensity) ──

function HabitCardGarden({ habit, today, goals, onToggle, onLabelChange, onCadenceChange, onOwnerChange, onColorChange, onGroupChange, onLinkedGoalChange, onDelete }) {
  const done = (habit.completions || []).includes(today);
  const streak = computeHabitStreak(habit);
  const color = habit.color || "#4a7c59";
  const totalDone = (habit.completions || []).length;
  // 26 weeks × 7 days = 182 days. Compute intensity 0..4 per cell based
  // on rolling-7-day completion count (so the garden "grows greener" in
  // weeks where the habit was consistently done).
  const grid = useMemo(() => buildGardenGrid(habit.completions, 26), [habit.completions]);
  const longest = useMemo(() => longestStreak(habit.completions), [habit.completions]);
  return (
    <div style={{ ...STYLES.card, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9,
              background: `${color}26`, color,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Icon d={habit.icon || ICON.target} size={14} />
            </div>
            <div style={{ minWidth: 0, fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", flex: 1 }}>
              <InlineText value={habit.label} onChange={onLabelChange} />
            </div>
          </div>
          <HabitMeta habit={habit} streak={streak} color={color} goals={goals}
            onCadenceChange={onCadenceChange} onOwnerChange={onOwnerChange} onColorChange={onColorChange}
            onGroupChange={onGroupChange} onLinkedGoalChange={onLinkedGoalChange} />
        </div>
        <CheckButton done={done} color={color} onClick={onToggle} size={48} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: 3 }}>
        {grid.map((row, ri) => (
          row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} title={cell.iso} style={{
              aspectRatio: "1 / 1",
              borderRadius: 3,
              background: cell.intensity === 0 ? COLORS.surfaceTint : intensityColor(color, cell.intensity),
              opacity: cell.intensity === 0 ? 0.55 : 1,
              transition: "background 0.18s ease",
            }} />
          ))
        ))}
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", gap: 12,
        paddingTop: 10, borderTop: `1px solid ${COLORS.surfaceTint}`,
        fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
        flexWrap: "wrap",
      }}>
        <GardenStat label="Current" value={`${streak}d`} accent={color} />
        <GardenStat label="Longest" value={`${longest}d`} accent={color} />
        <GardenStat label="Total" value={`${totalDone}`} accent={color} />
        <DeleteIconBtn onClick={onDelete} />
      </div>
    </div>
  );
}

function GardenStat({ label, value, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
      <span style={{ fontSize: 10, color: COLORS.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

// ── Habit card style C: Stride (compact list row, ring + 7-day dots) ──

function HabitCardStride({ habit, today, goals, onToggle, onLabelChange, onCadenceChange, onOwnerChange, onColorChange, onGroupChange, onLinkedGoalChange, onDelete }) {
  const done = (habit.completions || []).includes(today);
  const streak = computeHabitStreak(habit);
  const color = habit.color || "#3b6fd1";
  const week = useMemo(() => last7Days(habit.completions), [habit.completions]);
  const weekDone = week.filter((d) => d.done).length;
  return (
    <div style={{
      ...STYLES.card,
      padding: "14px 18px",
      display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto auto auto",
      gap: 16, alignItems: "center",
    }}>
      <ProgressRing
        value={weekDone}
        max={7}
        color={color}
        size={56}
        label={`${weekDone}/7`}
        sublabel="this week"
      />
      <div style={{ minWidth: 0 }}>
        <InlineText value={habit.label} onChange={onLabelChange} />
        <HabitMeta habit={habit} streak={streak} color={color}
          onCadenceChange={onCadenceChange} onOwnerChange={onOwnerChange} onColorChange={onColorChange} />
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {week.map((d, i) => (
          <div key={i} title={d.iso} style={{
            width: 14, height: 14, borderRadius: "50%",
            background: d.done ? color : "transparent",
            border: `2px solid ${d.done ? color : COLORS.border}`,
            transition: "background 0.18s ease",
          }} />
        ))}
      </div>
      <CheckButton done={done} color={color} onClick={onToggle} size={40} />
      <DeleteIconBtn onClick={onDelete} />
    </div>
  );
}

// ── Habit shared bits ─────────────────────────────────────────────────

function HabitMeta({ habit, streak, color, goals = [], onCadenceChange, onOwnerChange, onColorChange, onGroupChange, onLinkedGoalChange }) {
  const activeGoals = (goals || []).filter((g) => !g.completed_at);
  const linkedGoal = activeGoals.find((g) => g.id === habit.linked_goal_id);
  return (
    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
      <select
        value={habit.cadence}
        onChange={(e) => onCadenceChange(e.target.value)}
        aria-label="Cadence"
        style={pillSelectStyle()}
      >
        <option value="daily">daily</option>
        <option value="weekly">weekly</option>
        <option value="monthly">monthly</option>
      </select>
      <select
        value={habit.owner || "shared"}
        onChange={(e) => onOwnerChange(e.target.value)}
        aria-label="Owner"
        style={pillSelectStyle()}
      >
        <option value="shared">shared</option>
        <option value="harrison">harrison</option>
        <option value="carolina">carolina</option>
      </select>
      {onGroupChange && (
        <HabitGroupPicker value={habit.group || ""} onChange={onGroupChange} />
      )}
      {onLinkedGoalChange && activeGoals.length > 0 && (
        <select
          value={habit.linked_goal_id || ""}
          onChange={(e) => onLinkedGoalChange(e.target.value || null)}
          aria-label="Linked goal"
          title="Pair this habit with a goal"
          style={{ ...pillSelectStyle(), maxWidth: 130, textTransform: "none", letterSpacing: 0 }}
        >
          <option value="">— no goal —</option>
          {activeGoals.map((g) => <option key={g.id} value={g.id}>→ {g.label}</option>)}
        </select>
      )}
      <ColorSwatch value={color} onChange={onColorChange} />
      {linkedGoal && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", borderRadius: 100,
          background: `${color}1A`, color,
          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          → {linkedGoal.label}
        </span>
      )}
      {streak > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color, fontWeight: 700 }}>
          <Icon d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" size={11} />
          {streak}d
        </span>
      )}
    </div>
  );
}

function HabitGroupPicker({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  useEffect(() => setDraft(value || ""), [value]);
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); onChange(draft.trim()); }}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setDraft(value || ""); setEditing(false); } }}
        placeholder="group"
        aria-label="Habit group"
        style={{
          background: COLORS.surfaceTint,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 100,
          padding: "2px 10px",
          fontSize: 10, fontWeight: 700,
          color: COLORS.text, cursor: "text", fontFamily: FONT,
          width: 100,
          outline: "none",
        }}
      />
    );
  }
  return (
    <button
      onClick={() => setEditing(true)}
      aria-label="Edit group"
      style={{
        background: COLORS.surfaceTint,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 100,
        padding: "2px 10px",
        fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: value ? COLORS.textMuted : COLORS.textFaint,
        cursor: "pointer", fontFamily: FONT,
      }}
    >
      {value || "+ group"}
    </button>
  );
}

function CheckButton({ done, color, onClick, size = 44 }) {
  return (
    <button
      onClick={onClick}
      aria-label={done ? "Mark not done" : "Mark done"}
      style={{
        width: size, height: size, borderRadius: 12,
        background: done ? color : "transparent",
        color: done ? "#fff" : color,
        border: `2px solid ${color}`,
        cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0,
        transition: "all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      onMouseEnter={(e) => { if (!done) e.currentTarget.style.background = `${color}1A`; }}
      onMouseLeave={(e) => { if (!done) e.currentTarget.style.background = "transparent"; }}
    >
      {done ? <Icon d="M20 6L9 17l-5-5" size={Math.round(size * 0.5)} /> : null}
    </button>
  );
}

function DeleteIconBtn({ onClick }) {
  if (!onClick) return <span />;
  return (
    <button
      onClick={onClick}
      aria-label="Delete habit"
      style={{
        width: 24, height: 24, borderRadius: 7, border: "none", cursor: "pointer",
        background: "transparent", color: COLORS.textFaint,
        display: "grid", placeItems: "center", opacity: 0.4,
        transition: "all 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
    >
      <Icon d={ICON.x} size={12} />
    </button>
  );
}

const COLOR_SWATCHES = ["#3b6fd1", "#4a7c59", "#c88318", "#d6448f", "#0bafb0", "#8c5ad9", "#d64545", "#5f6675"];

function ColorSwatch({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Pick color"
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: value, border: `2px solid ${COLORS.surface}`,
          cursor: "pointer", boxShadow: `0 0 0 1px ${COLORS.border}`,
        }}
      />
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{
            position: "absolute", top: 22, left: -8, zIndex: 41,
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: 6,
            boxShadow: "0 8px 20px rgba(13,20,36,0.18)",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4,
          }}>
            {COLOR_SWATCHES.map((c) => (
              <button key={c} onClick={() => { onChange(c); setOpen(false); }}
                style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: c, border: c === value ? `2px solid ${COLORS.text}` : `2px solid transparent`,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Goals view ───────────────────────────────────────────────────────

function GoalsView({ state, updateState }) {
  const goals = state.goals || [];
  const active = goals.filter((g) => !g.completed_at);
  const achieved = goals.filter((g) => !!g.completed_at);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Monthly rate for ETA = current run-rate net.
  const forecast = useMemo(() => computeForecast(state), [state]);
  const monthlyRate = forecast.monthlyAvgNet;

  const update = (id, patch) => updateState((s) => ({
    ...s,
    goals: (s.goals || []).map((g) => g.id === id ? { ...g, ...patch } : g),
  }));
  const del = (id) => updateState((s) => ({
    ...s,
    goals: (s.goals || []).filter((g) => g.id !== id),
  }));
  const addBlank = () => updateState((s) => ({
    ...s,
    goals: [...(s.goals || []), {
      id: genId(),
      label: "New goal",
      kind: "net_worth",
      target_cents: 100_000_000,
      created_at: new Date().toISOString(),
    }],
  }));
  const addFromTemplate = (tpl) => updateState((s) => ({
    ...s,
    goals: [...(s.goals || []), templateToGoal(tpl, s)],
  }));

  return (
    <div>
      <DrillTitle
        title="Goals"
        subtitle="Pin the big numbers you're working toward. Progress + ETA update automatically."
        icon="M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6 M4 22h6"
        iconColor="#c88318"
        iconBg="rgba(200,131,24,0.10)"
        heroValue={`${active.length}`}
        heroLabel={`active${achieved.length > 0 ? ` · ${achieved.length} achieved` : ""}`}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setPickerOpen(true)} style={btn("primary")}>
          <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
          Add from template
        </button>
        <button onClick={addBlank} style={btn("ghost")}>
          <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
          Blank goal
        </button>
      </div>

      {pickerOpen && (
        <GoalTemplatePicker
          state={state}
          onPick={(tpl) => { addFromTemplate(tpl); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {active.length === 0 && achieved.length === 0 && (
        <div style={{ ...STYLES.card, padding: 28, textAlign: "center", color: COLORS.textMuted, marginBottom: 14 }}>
          No goals yet. Add one from a template or start blank.
        </div>
      )}

      {active.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionLabel>Active</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
            <SortableList
              items={active}
              getId={(g) => g.id}
              strategy="rect"
              onReorder={(next) => updateState((s) => {
                // Preserve the relative position of archived/completed
                // goals; only reorder the active subset.
                const activeIds = new Set(active.map((g) => g.id));
                const nextOrderActive = next.map((g) => g.id);
                let cursor = 0;
                const reordered = (s.goals || []).map((g) => {
                  if (!activeIds.has(g.id)) return g;
                  const id = nextOrderActive[cursor++];
                  return (s.goals || []).find((x) => x.id === id) || g;
                });
                return { ...s, goals: reordered };
              })}
              renderItem={(g, handleProps) => (
                <div style={{ position: "relative" }}>
                  {handleProps ? (
                    <div style={{ position: "absolute", top: 6, left: 6, zIndex: 2 }}>
                      <DragHandle handleProps={handleProps} />
                    </div>
                  ) : null}
                  <GoalCard
                    goal={g}
                    state={state}
                    monthlyRate={monthlyRate}
                    onChange={(patch) => update(g.id, patch)}
                    onDelete={() => del(g.id)}
                    onComplete={() => update(g.id, { completed_at: new Date().toISOString() })}
                  />
                </div>
              )}
            />
          </div>
        </section>
      )}

      {achieved.length > 0 && (
        <section>
          <SectionLabel>Achieved · {achieved.length}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
            {achieved
              .slice()
              .sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1))
              .map((g) => (
                <div key={g.id} style={{
                  ...STYLES.card, padding: 14,
                  display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto auto",
                  alignItems: "center", gap: 12,
                  background: `linear-gradient(135deg, ${COLORS.greenBg} 0%, ${COLORS.surface} 75%)`,
                  border: `1px solid ${COLORS.green}55`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: COLORS.green, color: "#fff",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <Icon d="M20 6L9 17l-5-5" size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                      Hit {new Date(g.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => update(g.id, { completed_at: null })}
                    title="Move back to Active"
                    aria-label="Reopen goal"
                    style={{
                      width: 26, height: 26, borderRadius: 7, border: `1px solid ${COLORS.border}`,
                      background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
                      display: "grid", placeItems: "center",
                    }}
                  >
                    <Icon d={ICON.refresh} size={12} />
                  </button>
                  <button
                    onClick={() => del(g.id)}
                    aria-label="Delete goal"
                    style={{
                      width: 26, height: 26, borderRadius: 7, border: "none",
                      background: "transparent", color: COLORS.textFaint, cursor: "pointer",
                      display: "grid", placeItems: "center",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
                  >
                    <Icon d={ICON.x} size={12} />
                  </button>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

function GoalCard({ goal, state, monthlyRate, onChange, onDelete, onComplete }) {
  const g = goal;
  const prog = computeGoalProgress(g, state, monthlyRate);
  const accent = "#c88318";

  // Milestone positions as percentages along the progress bar.
  const sortedMilestones = (g.milestones || []).slice().sort((a, b) => {
    const at = a.target_cents ?? a.target_count ?? 0;
    const bt = b.target_cents ?? b.target_count ?? 0;
    return at - bt;
  });

  return (
    <div style={{ ...STYLES.card, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing
          value={prog.value}
          max={Math.max(prog.target, 1)}
          color={accent}
          label={`${Math.round(prog.pct)}%`}
          sublabel="done"
          size={88}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <InlineText value={g.label} onChange={(v) => onChange({ label: v })} />
          <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>
              {prog.unit === "money" ? fmtCompact(prog.value) : prog.value}
            </span>
            <span style={{ fontSize: 11, color: COLORS.textFaint }}>of</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
              {prog.unit === "money" ? fmtCompact(prog.target) : prog.target}
            </span>
          </div>
          {prog.etaMonths != null && (
            <div style={{ marginTop: 3, fontSize: 11.5, fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums" }}>
              ETA · {formatEta(prog.etaMonths)}
            </div>
          )}
          <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={g.kind}
              onChange={(e) => onChange({ kind: e.target.value })}
              aria-label="Goal kind"
              style={pillSelectStyle()}
            >
              <option value="net_worth">Net worth</option>
              <option value="property_count">Property count</option>
              <option value="rental_income">Rental income</option>
              <option value="debt_payoff">Debt payoff</option>
              <option value="savings">Savings</option>
              <option value="custom">Custom</option>
            </select>
            {g.kind === "property_count" ? (
              <InlineNumber
                value={(g.target_count || 0) * 100}
                onChange={(v) => onChange({ target_count: Math.max(1, Math.round(v / 100)) })}
                width={80}
                min={100}
                allowNegative={false}
              />
            ) : (
              <InlineNumber
                value={g.target_cents}
                onChange={(v) => onChange({ target_cents: v })}
                width={120}
                min={1}
                allowNegative={false}
              />
            )}
            {g.kind === "custom" && (
              <InlineNumber
                value={g.current_value_cents || 0}
                onChange={(v) => onChange({ current_value_cents: v })}
                width={120}
              />
            )}
          </div>
        </div>
      </div>

      {sortedMilestones.length > 0 && prog.target > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}` }}>
          <div style={{ position: "relative", height: 6, background: COLORS.surfaceTint, borderRadius: 100, marginBottom: 18 }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${Math.min(100, prog.pct)}%`,
              background: accent, borderRadius: 100,
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
            {sortedMilestones.map((m) => {
              const mt = m.target_cents ?? m.target_count ?? 0;
              const pct = prog.target > 0 ? Math.min(100, (mt / prog.target) * 100) : 0;
              const hit = prog.value >= mt;
              return (
                <div key={m.id} title={m.label} style={{
                  position: "absolute", top: -3, left: `${pct}%`,
                  width: 12, height: 12, borderRadius: "50%",
                  background: hit ? accent : COLORS.surface,
                  border: `2px solid ${hit ? accent : COLORS.borderStrong}`,
                  transform: "translateX(-50%)",
                  transition: "background 0.25s ease",
                }} />
              );
            })}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>
            {sortedMilestones.map((m) => {
              const mt = m.target_cents ?? m.target_count ?? 0;
              const hit = prog.value >= mt;
              return (
                <span key={m.id} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  color: hit ? accent : COLORS.textFaint,
                  textDecoration: hit ? "none" : "none",
                  fontWeight: hit ? 800 : 600,
                }}>
                  <Icon d={hit ? "M20 6L9 17l-5-5" : "M12 17h.01 M12 6v6"} size={10} />
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <GoalTrajectory goal={g} state={state} accent={accent} target={prog.target} />

      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <button onClick={onComplete} style={{ ...btn("primary"), background: COLORS.green }}>
          <Icon d="M20 6L9 17l-5-5" size={14} />
          Mark complete
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete goal"
          style={{
            width: 28, height: 28, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.red; e.currentTarget.style.color = COLORS.red; e.currentTarget.style.background = COLORS.redBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.background = COLORS.surface; }}
        >
          <Icon d={ICON.x} size={14} />
        </button>
      </div>
    </div>
  );
}

function GoalTrajectory({ goal, state, accent, target }) {
  const series = useMemo(() => buildGoalTrajectory(goal, state, 12), [goal, state]);

  // No trajectory data — show a short hint for kinds that aren't
  // recoverable from history alone (debt_payoff, property_count,
  // custom) so the card doesn't feel incomplete.
  if (series.length < 2) {
    const unsupportedKind = goal.kind === "debt_payoff" || goal.kind === "property_count" || goal.kind === "custom";
    return (
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}` }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 6 }}>
          Trajectory
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
          {unsupportedKind
            ? `Trajectory for ${goal.kind.replace(/_/g, " ")} goals coming once we snapshot more state daily.`
            : "Needs at least two months of history."}
        </div>
      </div>
    );
  }

  // Scale to viewBox 100×30. Y inverts (SVG origin = top-left).
  const values = series.map((p) => p.value);
  const minV = Math.min(...values, target || 0, 0);
  const maxV = Math.max(...values, target || 0, 1);
  const range = Math.max(1, maxV - minV);

  const x = (i) => (series.length === 1 ? 50 : (i / (series.length - 1)) * 100);
  const y = (v) => 28 - ((v - minV) / range) * 26;
  const linePoints = series.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  const areaPath = `M ${x(0)},28 L ${linePoints.replace(/ /g, " L ")} L ${x(series.length - 1)},28 Z`;

  const last = series[series.length - 1];
  const first = series[0];
  const delta = last.value - first.value;
  const targetY = target > 0 ? y(target) : null;

  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.surfaceTint}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: COLORS.textFaint, textTransform: "uppercase" }}>
          Trajectory · last {series.length} mo
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: delta >= 0 ? COLORS.green : COLORS.red, fontVariantNumeric: "tabular-nums" }}>
          {delta >= 0 ? "+" : "−"}{fmtCompact(Math.abs(delta))}
        </span>
      </div>
      <svg viewBox="0 0 100 30" width="100%" height="36" preserveAspectRatio="none" aria-label="Goal trajectory">
        {targetY != null && targetY > 0 && targetY < 30 ? (
          <line x1={0} y1={targetY} x2={100} y2={targetY} stroke={COLORS.green} strokeWidth={0.3} strokeDasharray="1 1" />
        ) : null}
        <path d={areaPath} fill={accent} opacity="0.15" />
        <polyline points={linePoints} fill="none" stroke={accent} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(series.length - 1)} cy={y(last.value)} r={1.4} fill={accent} />
      </svg>
      <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textFaint, fontWeight: 600 }}>
        <span>{first.label}</span>
        <span>{last.label}</span>
      </div>
    </div>
  );
}

function GoalTemplatePicker({ state, onPick, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(15,23,41,0.55)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface, borderRadius: 24,
          width: "100%", maxWidth: 560, maxHeight: "calc(100dvh - 40px)",
          boxShadow: "0 24px 80px rgba(15,23,41,0.28)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{
          padding: "18px 20px 14px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Pick a goal template</div>
            <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>You can edit anything after adding.</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}>
            <Icon d={ICON.x} size={14} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {GOAL_TEMPLATES.map((tpl) => {
              const resolved = templateToGoal(tpl, state);
              const targetLabel = tpl.kind === "property_count"
                ? `${resolved.target_count} properties`
                : fmtCompact(resolved.target_cents);
              const kindLabel = {
                net_worth: "Net Worth",
                property_count: "Properties",
                rental_income: "Rental Income",
                debt_payoff: "Debt Payoff",
                savings: "Savings",
                custom: "Custom",
              }[tpl.kind] || tpl.kind;
              return (
                <button
                  key={tpl.label}
                  onClick={() => onPick(tpl)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center",
                    padding: "12px 14px", borderRadius: 12,
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    cursor: "pointer", textAlign: "left", fontFamily: FONT,
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = COLORS.surfaceTint; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.surface; }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{tpl.label}</div>
                    <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {kindLabel}{tpl.milestones?.length ? ` · ${tpl.milestones.length} milestones` : ""}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{targetLabel}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Achievements grid (full view) ────────────────────────────────────

function AchievementsGridView({ achievements }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  // Group enriched achievements by tier in the canonical TIERS order.
  const byTier = TIERS.map((t) => ({
    ...t,
    items: achievements.filter((a) => a.tier === t.id),
  }));
  // Per-tier completion percent for the section header bar.
  const tierStats = byTier.map((t) => {
    const total = t.items.length;
    const got = t.items.filter((a) => a.unlocked).length;
    return { ...t, got, total, pct: total > 0 ? (got / total) * 100 : 0 };
  });

  return (
    <div>
      <DrillTitle
        title="Achievements"
        subtitle="Milestones you've unlocked — and a progress bar on the ones you haven't yet."
        icon="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z"
        iconColor="#8c5ad9"
        iconBg="rgba(140,90,217,0.10)"
        heroValue={`${unlocked}/${achievements.length}`}
        heroLabel="unlocked"
      />

      <div style={{
        marginBottom: 18, display: "grid",
        gridTemplateColumns: `repeat(${tierStats.length}, 1fr)`, gap: 8,
      }}>
        {tierStats.map((t) => (
          <div key={t.id} style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.label}</div>
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{t.got} / {t.total}</div>
            <div style={{ marginTop: 6, height: 4, background: COLORS.surfaceTint, borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: 100, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {byTier.map((t) => (
          <section key={t.id}>
            <div style={{
              display: "flex", alignItems: "baseline", gap: 10,
              padding: "0 4px 10px",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 800, color: t.color,
                textTransform: "uppercase", letterSpacing: "0.12em",
              }}>{t.label}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>
                {t.items.filter((a) => a.unlocked).length}/{t.items.length}
              </span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 10,
            }}>
              {t.items.map((a) => (
                <AchievementCard key={a.id} achievement={a} tierColor={t.color} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement, tierColor }) {
  const a = achievement;
  const showProgress = !a.unlocked && a.progress && a.progress.target > 0;
  return (
    <div style={{
      ...STYLES.card,
      padding: 16,
      display: "flex", alignItems: "center", gap: 14,
      opacity: a.unlocked ? 1 : 0.85,
      background: a.unlocked
        ? `linear-gradient(135deg, ${tierColor}1A 0%, ${COLORS.surface} 75%)`
        : COLORS.surface,
      border: a.unlocked ? `1px solid ${tierColor}55` : `1px solid ${COLORS.border}`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: a.unlocked ? tierColor : COLORS.surfaceTint,
        color: a.unlocked ? "#fff" : COLORS.borderStrong,
        display: "grid", placeItems: "center", flexShrink: 0,
        boxShadow: a.unlocked ? `0 4px 14px ${tierColor}55` : "none",
      }}>
        <Icon d={a.unlocked ? "M20 6L9 17l-5-5" : "M12 17h.01 M12 6v6"} size={20} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</div>
        {showProgress ? (
          <>
            <div style={{ marginTop: 6, height: 5, background: COLORS.surfaceTint, borderRadius: 100, overflow: "hidden" }}>
              <div style={{
                width: `${a.progress.pct}%`, height: "100%", background: tierColor,
                borderRadius: 100, transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
              {a.progress.format === "money" ? fmtCompact(a.progress.value) : a.progress.value}
              <span style={{ color: COLORS.textFaint }}> of </span>
              {a.progress.format === "money" ? fmtCompact(a.progress.target) : a.progress.target}
            </div>
          </>
        ) : (
          <div style={{
            marginTop: 4, fontSize: 11, fontWeight: 700,
            color: a.unlocked ? tierColor : COLORS.textFaint,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {a.unlocked ? "Unlocked" : "Locked"}
          </div>
        )}
      </div>
    </div>
  );
}


// ── Settings view ────────────────────────────────────────────────────

function SettingsView({ state, updateState }) {
  const s = state.settings;
  const set = (patch) => updateState((curr) => ({ ...curr, settings: { ...curr.settings, ...patch } }));
  return (
    <div>
      <DrillTitle
        title="Settings"
        subtitle="Defaults that apply across the whole budget."
        icon="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        iconColor="#5f6675"
        iconBg="rgba(95,102,117,0.10)"
      />
      <PeopleBlock state={state} updateState={updateState} />

      <BlockCard title="Defaults" accent="#5f6675" icon="M12.22 2h-.44a2 2 0 0 0-2 2" style={{ marginTop: 14 }}>
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", padding: "10px 4px" }}>
          <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Default hero mode</div>
          <select
            value={s.hero_mode}
            onChange={(e) => set({ hero_mode: e.target.value })}
            style={{ ...inputStyle(), fontWeight: 600 }}
          >
            <option value="conservative">Conservative</option>
            <option value="optimistic">Optimistic</option>
            <option value="rentals_only">Rentals only</option>
          </select>
        </div>
        <PctRow label="Default vacancy %" bps={s.default_vacancy_bps} onChange={(v) => set({ default_vacancy_bps: v })} />
        <PctRow label="Default CapEx %" bps={s.default_capex_bps} onChange={(v) => set({ default_capex_bps: v })} />
        <div className="bb-row" style={{ padding: "12px 4px" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Theme</div>
            <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>Pick a look. System matches your phone&apos;s light/dark setting.</div>
          </div>
          <ThemeToggle value={s.theme || DEFAULT_THEME} onChange={(v) => set({ theme: v })} />
        </div>
      </BlockCard>
    </div>
  );
}

function ThemeToggle({ value, onChange }) {
  // Each named theme renders a live preview swatch (its real surface +
  // accent), plus a "System" card that follows the OS. Selecting one
  // re-themes the whole budget surface instantly.
  const opts = [
    ...THEMES,
    { id: "system", label: "System", swatch: null, ring: COLORS.borderStrong, accent: COLORS.textMuted },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(78px, 1fr))", gap: 8 }}
    >
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "12px 8px 10px",
              borderRadius: RADII.lg,
              border: `1.5px solid ${active ? COLORS.accent : COLORS.border}`,
              background: active ? COLORS.accentSoft : COLORS.surface,
              cursor: "pointer", fontFamily: FONT,
              transition: "border-color 0.12s ease, background 0.12s ease",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `2px solid ${o.ring}`,
                background: o.swatch
                  ? o.swatch
                  : "conic-gradient(#ffffff 0 50%, #131a26 50% 100%)",
                display: "grid", placeItems: "center",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.12)",
              }}
            >
              {o.swatch && (
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: o.accent }} />
              )}
            </span>
            <span style={{
              fontSize: 11.5, fontWeight: 700, letterSpacing: 0.2,
              color: active ? COLORS.text : COLORS.textMuted,
            }}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PeopleBlock({ state, updateState }) {
  const profiles = state.profiles || [];
  const update = (id, patch) => updateState((s) => ({
    ...s,
    profiles: (s.profiles || []).map((p) => p.id === id ? { ...p, ...patch } : p),
  }));
  const del = (id) => updateState((s) => ({
    ...s,
    profiles: (s.profiles || []).filter((p) => p.id !== id),
    active_profile_id: s.active_profile_id === id ? null : s.active_profile_id,
  }));
  const add = () => updateState((s) => ({
    ...s,
    profiles: [
      ...(s.profiles || []),
      {
        id: genId(),
        label: "New person",
        color: "#5f6675",
        pay_frequency: "biweekly",
        created_at: new Date().toISOString(),
      },
    ],
  }));

  return (
    <BlockCard
      title="People"
      sub={`${profiles.length}`}
      accent={COLORS.accent}
      icon={ICON.family}
      count={null}
    >
      {profiles.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
          Add the people sharing this budget. Each can have their own pay schedule + accent color.
        </div>
      )}
      {profiles.map((p) => (
        <div key={p.id} className="bb-row" style={{
          display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto auto 22px",
          gap: 10, alignItems: "center", padding: "10px 4px",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `${p.color}1A`, color: p.color,
            display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 800, fontFamily: FONT,
          }}>
            {p.label.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <InlineText value={p.label} onChange={(v) => update(p.id, { label: v })} />
            <div style={{ marginTop: 3, fontSize: 11, color: COLORS.textFaint, fontWeight: 600, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <ColorSwatch value={p.color} onChange={(v) => update(p.id, { color: v })} />
              <select
                value={p.pay_frequency || "biweekly"}
                onChange={(e) => update(p.id, { pay_frequency: e.target.value })}
                aria-label="Pay frequency"
                style={pillSelectStyle()}
              >
                <option value="weekly">weekly</option>
                <option value="biweekly">biweekly</option>
                <option value="semimonthly">semimonthly</option>
                <option value="monthly">monthly</option>
              </select>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                pay day
                <input
                  type="number"
                  min={1} max={31}
                  value={p.pay_day || ""}
                  onChange={(e) => update(p.id, { pay_day: e.target.value === "" ? null : Math.max(1, Math.min(31, parseInt(e.target.value, 10))) })}
                  placeholder="—"
                  aria-label="Pay day of month"
                  style={{ ...inputStyle(), width: 56, padding: "2px 6px", fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                />
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                clerk id
                <input
                  type="text"
                  value={p.clerk_user_id || ""}
                  onChange={(e) => update(p.id, { clerk_user_id: e.target.value || undefined })}
                  placeholder="user_…"
                  aria-label="Clerk user id"
                  style={{ ...inputStyle(), width: 130, padding: "2px 8px", fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                />
              </span>
            </div>
          </div>
          <span style={{ fontSize: 11, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
            {p.id === state.active_profile_id ? "active" : ""}
          </span>
          <button
            onClick={() => updateState((s) => ({ ...s, active_profile_id: p.id }))}
            disabled={p.id === state.active_profile_id}
            style={{
              padding: "5px 10px", borderRadius: 100,
              background: p.id === state.active_profile_id ? COLORS.surfaceTint : p.color,
              color: p.id === state.active_profile_id ? COLORS.textFaint : "#fff",
              border: "none", cursor: p.id === state.active_profile_id ? "default" : "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: FONT,
              whiteSpace: "nowrap",
            }}
          >
            {p.id === state.active_profile_id ? "viewing" : "view as"}
          </button>
          <button
            onClick={() => del(p.id)}
            aria-label="Remove person"
            style={{
              width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
              background: "transparent", color: COLORS.textFaint, opacity: 0.4,
              display: "grid", placeItems: "center", transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
          >
            <Icon d={ICON.x} size={12} />
          </button>
        </div>
      ))}
      <AddRowButton label="Add person" accent={COLORS.accent} onClick={add} />
    </BlockCard>
  );
}

// ── Reusable visual primitives ───────────────────────────────────────

// Tiny inline-SVG line chart used inside tiles. Trend color = green
// when the last value beats the first, red when it lags, gray when
// there's not enough data yet.
function Sparkline({ values, height = 28, width = 96 }) {
  const filtered = (values || []).filter((v) => typeof v === "number" && !isNaN(v));
  if (filtered.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
        <line x1={2} y1={height - 4} x2={width - 2} y2={height - 4}
          stroke={COLORS.border} strokeWidth={1.5} strokeDasharray="3 3" strokeLinecap="round" />
      </svg>
    );
  }
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const range = max - min || 1;
  const pad = 3;
  const stepX = (width - pad * 2) / (filtered.length - 1);
  const coords = filtered.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return [x, y];
  });
  const linePts = coords.map((c) => `${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const areaPts = `${pad},${height} ${linePts} ${width - pad},${height}`;
  const trendUp = filtered[filtered.length - 1] >= filtered[0];
  const tint = trendUp ? COLORS.green : COLORS.red;
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polyline points={areaPts} fill={tint} opacity={0.08} />
      <polyline points={linePts} fill="none" stroke={tint} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={2.5} fill={tint} />
    </svg>
  );
}

// Animated radial progress ring. Renders a center label + sublabel.
function ProgressRing({ value, max, size = 96, color = COLORS.accent, trackColor, label, sublabel }) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={trackColor || COLORS.surfaceTint} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", lineHeight: 1,
      }}>
        <div style={{ fontSize: size >= 96 ? 18 : 15, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{sublabel}</div>}
      </div>
    </div>
  );
}

// Smoothly animates a number from its previous value to the current value
// using requestAnimationFrame. Skips animation when reduce-motion is on.
function AnimatedNumber({ value, format = (v) => v, duration = 600 }) {
  const [displayed, setDisplayed] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const to = value;
    const from = fromRef.current;
    if (from === to) return;
    const reduce = typeof window !== "undefined"
      && window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplayed(to);
      fromRef.current = to;
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(displayed)}</>;
}

// Number input wrapped with +/- buttons (revealed on row hover via CSS).
// `step` is in cents.
function NumberStepper({ value, onChange, step = 1000, color, faintWhenZero = true }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String((value / 100).toFixed(2)));
  useEffect(() => setDraft(String((value / 100).toFixed(2))), [value]);
  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="0.01"
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") { setDraft(String((value / 100).toFixed(2))); setEditing(false); }
        }}
        style={{ ...inputStyle(), width: "100%", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
      />
    );
  }
  return (
    <div className="bb-stepper" style={{ display: "inline-flex", alignItems: "center", gap: 2, justifySelf: "end" }}>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onChange(Math.max(0, value - step)); }}
        aria-label="Decrease"
        className="bb-step-btn"
        style={stepBtnStyle()}
      ><Icon d="M5 12h14" size={11} /></button>
      <button onClick={() => setEditing(true)} className="bb-edit-btn"
        style={{
          ...textBtnStyle(),
          textAlign: "right",
          fontVariantNumeric: "tabular-nums", fontWeight: 700,
          minWidth: 90,
          color: faintWhenZero && value === 0 ? COLORS.textFaint : (color || COLORS.text),
        }}
      >
        {fmtUsd(value)}
      </button>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onChange(value + step); }}
        aria-label="Increase"
        className="bb-step-btn"
        style={stepBtnStyle()}
      ><Icon d={["M12 5v14", "M5 12h14"]} size={11} /></button>
    </div>
  );
}

// Floating Action Button — global "quick add" affordance. `bottomOffset`
// lifts it above the mobile bottom-tab nav so the two don't collide.
function FAB({ onClick, bottomOffset = 24 }) {
  return (
    <button
      onClick={onClick}
      aria-label="Quick add"
      style={{
        position: "fixed",
        bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px))`,
        right: 24, zIndex: 40,
        width: 56, height: 56, borderRadius: "50%",
        background: COLORS.text, color: "#fff", border: "none", cursor: "pointer",
        boxShadow: "0 10px 32px rgba(13,20,36,0.32)",
        display: "grid", placeItems: "center",
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.06)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(13,20,36,0.42)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 32px rgba(13,20,36,0.32)"; }}
    >
      <Icon d={["M12 5v14", "M5 12h14"]} size={22} />
    </button>
  );
}

// Bottom-tab navigation — primary nav on mobile. Same 6 sections as
// the desktop sidebar, rendered as a fixed bar with safe-area-aware
// padding so it sits above the iPhone home indicator.
// Bottom-bar tab set when the user hasn't customized it.
const DEFAULT_MOBILE_NAV = ["dashboard", "money", "goals", "more"];

// Section ids allowed in the bottom bar for this experience mode.
function allowedNavSections(isBasic) {
  return isBasic
    ? SIDEBAR_SECTIONS.filter((s) => !["habits", "achievements"].includes(s.id))
    : SIDEBAR_SECTIONS;
}

// The bottom bar always renders exactly 4 tabs (2 each side of the
// center "+"): the user's pinned set, filtered to valid sections and
// padded from the defaults so the bar is never short.
function resolveMobileNav(settings, isBasic) {
  const allowed = new Set(allowedNavSections(isBasic).map((s) => s.id));
  const chosen = (settings?.mobile_nav || DEFAULT_MOBILE_NAV).filter((id) => allowed.has(id));
  for (const id of [...DEFAULT_MOBILE_NAV, ...SIDEBAR_SECTIONS.map((s) => s.id)]) {
    if (chosen.length >= 4) break;
    if (allowed.has(id) && !chosen.includes(id)) chosen.push(id);
  }
  return chosen.slice(0, 4);
}

// The user's RAW pinned set (1–4, unpadded) — what the editor toggles
// against. The bar pads this via resolveMobileNav; the editor must not.
function rawMobileNav(settings, isBasic) {
  const allowed = new Set(allowedNavSections(isBasic).map((s) => s.id));
  return (settings?.mobile_nav && settings.mobile_nav.length
    ? settings.mobile_nav
    : DEFAULT_MOBILE_NAV
  ).filter((id) => allowed.has(id));
}

function MobileNav({ active, onChange, onAdd, onEditNav, navIds, achievementsUnlocked, streak }) {
  const pressTimer = useRef(null);
  const longPressed = useRef(false);
  const byId = Object.fromEntries(SIDEBAR_SECTIONS.map((s) => [s.id, s]));
  const tabs = navIds.map((id) => byId[id]).filter(Boolean);

  const startPress = () => {
    longPressed.current = false;
    pressTimer.current = setTimeout(() => { longPressed.current = true; onEditNav(); }, 500);
  };
  const cancelPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  // Long-press fires onEditNav; the trailing tap must then be ignored.
  const guardedTap = (fn) => () => {
    if (longPressed.current) { longPressed.current = false; return; }
    fn();
  };

  const renderTab = (s, key) => {
    if (!s) return <span key={key} />;
    const isActive = active === s.id;
    const badge = s.id === "achievements" && achievementsUnlocked > 0 ? achievementsUnlocked
      : s.id === "habits" && streak > 0 ? streak : null;
    return (
      <button
        key={key}
        onClick={guardedTap(() => onChange(s.id))}
        aria-current={isActive ? "page" : undefined}
        aria-label={s.label}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "6px 2px 4px", background: "transparent", border: "none", cursor: "pointer",
          color: isActive ? s.accent : COLORS.textMuted, fontFamily: FONT, minWidth: 0,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div style={{
          width: 38, height: 28, borderRadius: 14,
          background: isActive ? `${s.accent}1F` : "transparent",
          display: "grid", placeItems: "center", position: "relative",
          transition: "background 0.18s ease",
        }}>
          <span style={{ fontSize: 18, lineHeight: 1, filter: isActive ? "none" : "saturate(0.85)" }}>{s.emoji}</span>
          {badge != null && (
            <span style={{
              position: "absolute", top: -2, right: -4,
              background: s.accent, color: "#fff", fontSize: 9, fontWeight: 800,
              padding: "1px 5px", borderRadius: 100, lineHeight: 1.2, fontVariantNumeric: "tabular-nums",
            }}>{badge}</span>
          )}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.01em",
          maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{s.label}</span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Sections"
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => { e.preventDefault(); onEditNav(); }}
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 35,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        borderTop: `1px solid ${COLORS.border}`,
        padding: "6px 6px max(6px, env(safe-area-inset-bottom)) 6px",
        display: "grid", gridTemplateColumns: "1fr 1fr auto 1fr 1fr",
        alignItems: "center", gap: 2, fontFamily: FONT,
      }}
    >
      {renderTab(tabs[0], "t0")}
      {renderTab(tabs[1], "t1")}
      <button
        onClick={guardedTap(onAdd)}
        aria-label="Add expense or income"
        style={{
          width: 54, height: 54, borderRadius: "50%", marginTop: -24,
          justifySelf: "center",
          background: "linear-gradient(135deg, #1665D8, #FF4998)", color: "#fff",
          border: "none", cursor: "pointer",
          display: "grid", placeItems: "center",
          fontSize: 26, fontWeight: 400, lineHeight: 1,
          boxShadow: "0 8px 20px rgba(18,81,173,0.40)",
        }}
      >
        ＋
      </button>
      {renderTab(tabs[2], "t2")}
      {renderTab(tabs[3], "t3")}
    </nav>
  );
}

// Bottom-bar customizer — reached by long-pressing the bar. Lists every
// section: tap a name to jump there, tap the pin to add/remove it from
// the bottom bar (up to 4).
function MobileNavEditor({ sections, pinned, active, onToggle, onNavigate, onClose }) {
  const pinnedSet = new Set(pinned);
  const full = pinnedSet.size >= 4;
  return (
    <div
      onClick={onClose}
      className="bb-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 58,
        background: "rgba(15,23,41,0.55)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bb-modal-card"
        style={{
          background: COLORS.surface, borderRadius: 24,
          width: "100%", maxWidth: 440, maxHeight: "calc(100dvh - 40px)",
          boxShadow: "0 24px 80px rgba(15,23,41,0.32)",
          display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT,
        }}
      >
        <div style={{
          padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Bottom bar</div>
            <div style={{ marginTop: 3, fontSize: 11.5, color: COLORS.textMuted }}>
              Tap a name to jump there · pin up to 4 tabs ({pinnedSet.size}/4)
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 36, height: 36, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: COLORS.surface, color: COLORS.textMuted, cursor: "pointer",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={ICON.x} size={15} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: 8 }}>
          {sections.map((s) => {
            const isPinned = pinnedSet.has(s.id);
            const isActive = active === s.id;
            return (
              <div key={s.id} className="bb-row" style={{
                display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto",
                alignItems: "center", gap: 10, padding: "4px 6px",
              }}>
                <button
                  onClick={() => onNavigate(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, gridColumn: "1 / 3",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontFamily: FONT, textAlign: "left", padding: "8px 0", minWidth: 0,
                  }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: `${s.accent}1A`, color: s.accent,
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon d={s.icon} size={15} />
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: isActive ? 800 : 600, color: COLORS.text,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{s.label}</span>
                </button>
                <button
                  onClick={() => onToggle(s.id)}
                  disabled={!isPinned && full}
                  aria-pressed={isPinned}
                  aria-label={isPinned ? `Unpin ${s.label}` : `Pin ${s.label}`}
                  style={{
                    width: 30, height: 30, borderRadius: 8, cursor: (!isPinned && full) ? "default" : "pointer",
                    border: `1px solid ${isPinned ? COLORS.accent : COLORS.border}`,
                    background: isPinned ? COLORS.accent : COLORS.surface,
                    color: isPinned ? "#fff" : COLORS.textFaint,
                    opacity: (!isPinned && full) ? 0.4 : 1,
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}
                >
                  <Icon d={isPinned ? "M20 6L9 17l-5-5" : ["M12 5v14", "M5 12h14"]} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  { id: "dashboard",    label: "This Month",   icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10", accent: "#3b6fd1", emoji: "🏠" },
  { id: "envelopes",    label: "Envelopes",    icon: "M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z M10 12h4", accent: "#4a7c59", emoji: "✉️" },
  { id: "money",        label: "Money",        icon: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3", accent: "#1251AD", emoji: "📊" },
  { id: "habits",       label: "Habits",       icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3", accent: "#d6448f", emoji: "🌱" },
  { id: "goals",        label: "Goals",        icon: "M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6 M4 22h6", accent: "#c88318", emoji: "🎯" },
  { id: "achievements", label: "Achievements", icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z", accent: "#8c5ad9", emoji: "🏆" },
  { id: "settings",     label: "Settings",     icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", accent: "#5f6675", emoji: "⚙️" },
  { id: "more",         label: "More",         icon: "M5 12h.01 M12 12h.01 M19 12h.01", accent: "#5f6675", emoji: "⋯" },
];

// Sections that exist only as mobile bottom-nav destinations — kept out
// of the desktop sidebar (which already shows the money tiles on the
// dashboard and lists every real section).
const MOBILE_ONLY_SECTIONS = new Set(["money", "more"]);

// Budget switcher — the sidebar "VIEWING AS" control. Unlike a profile
// tag, picking an entry here swaps the ENTIRE budget: its own
// envelopes, bills, goals and net worth, fully isolated from every
// other budget. "New budget" spins up a fresh blank-slate budget on
// the spot and switches straight into it.
function BudgetSwitcher({ registry, activeBudgetId, onSwitch, onCreate, switching }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  const reg = registry || { primary_label: "Main budget", budgets: [], active_id: null };
  // The primary budget is the implicit first entry (id null); secondary
  // budgets follow in creation order.
  const entries = [
    { id: null, label: reg.primary_label || "Main budget", color: "#3b6fd1" },
    ...(reg.budgets || []),
  ];
  const activeKey = activeBudgetId ?? null;
  const active = entries.find((e) => (e.id ?? null) === activeKey) || entries[0];

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  if (!active) return null;

  function close() {
    setOpen(false);
    setAdding(false);
    setName("");
    setErr("");
  }

  function submitNew() {
    const clean = name.trim();
    if (!clean) {
      // Validation: wiggle + red explanatory text, never a silent fail.
      setErr("Give the budget a name.");
      if (inputRef.current) {
        inputRef.current.style.animation = "none";
        void inputRef.current.offsetWidth; // force reflow so it re-fires
        inputRef.current.style.animation = "bb-wiggle 0.4s ease";
      }
      return;
    }
    onCreate(clean);
    close();
  }

  return (
    <div style={{ position: "relative", marginTop: 12 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={switching}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch budget"
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "8px 10px", borderRadius: 10,
          background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
          cursor: switching ? "wait" : "pointer", fontFamily: FONT, textAlign: "left",
          opacity: switching ? 0.6 : 1,
          transition: "border-color 0.12s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = active.color; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
      >
        <span style={{
          width: 26, height: 26, borderRadius: "50%",
          background: active.color, color: "#fff",
          display: "grid", placeItems: "center",
          fontSize: 11, fontWeight: 800, flexShrink: 0,
        }}>{active.label.slice(0, 1).toUpperCase()}</span>
        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Viewing as</span>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active.label}</span>
        </span>
        <Icon d={ICON.chevD} size={12} color={COLORS.textMuted} />
      </button>
      {open && (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
          <div role="listbox" aria-label="Budgets" style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 31,
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 4,
            boxShadow: "0 10px 28px rgba(13,20,36,0.18)",
          }}>
            {entries.map((e) => {
              const id = e.id ?? null;
              const isActive = id === activeKey;
              return (
                <button
                  key={id ?? "__primary__"}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { onSwitch(id); close(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 10px", borderRadius: 8,
                    background: isActive ? `${e.color}1A` : "transparent",
                    border: "none", cursor: "pointer", fontFamily: FONT,
                    color: COLORS.text, textAlign: "left",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(ev) => { if (!isActive) ev.currentTarget.style.background = COLORS.surfaceTint; }}
                  onMouseLeave={(ev) => { if (!isActive) ev.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: e.color, color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 10, fontWeight: 800, flexShrink: 0,
                  }}>{e.label.slice(0, 1).toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</span>
                  {isActive && <Icon d="M20 6L9 17l-5-5" size={12} color={e.color} />}
                </button>
              );
            })}
            <div style={{ height: 1, background: COLORS.surfaceTint, margin: "4px 6px" }} />
            {!adding ? (
              <button
                onClick={() => setAdding(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 10px", borderRadius: 8,
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: FONT, textAlign: "left",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(ev) => { ev.currentTarget.style.background = COLORS.surfaceTint; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: `1px dashed ${COLORS.borderStrong}`,
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon d="M12 5v14 M5 12h14" size={12} color={COLORS.accent} />
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: COLORS.accent }}>New budget</span>
              </button>
            ) : (
              <div style={{ padding: "6px 8px 8px" }}>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(ev) => { setName(ev.target.value); if (err) setErr(""); }}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") { ev.preventDefault(); submitNew(); }
                    if (ev.key === "Escape") { ev.preventDefault(); setAdding(false); setName(""); setErr(""); }
                  }}
                  placeholder="e.g. Caitlin &amp; Michael"
                  maxLength={60}
                  aria-label="New budget name"
                  aria-invalid={err ? "true" : "false"}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "8px 10px", borderRadius: 8,
                    border: `1px solid ${err ? COLORS.red : COLORS.border}`,
                    background: COLORS.surface, color: COLORS.text,
                    fontFamily: FONT, fontSize: 13, outline: "none",
                  }}
                />
                {err && (
                  <div style={{ marginTop: 5, fontSize: 11, fontWeight: 600, color: COLORS.red }}>{err}</div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                  <button
                    onClick={submitNew}
                    style={{
                      flex: 1, padding: "7px 10px", borderRadius: 8,
                      border: "none", cursor: "pointer", fontFamily: FONT,
                      fontSize: 12, fontWeight: 700,
                      background: COLORS.accent, color: "#fff",
                    }}
                  >Create blank budget</button>
                  <button
                    onClick={() => { setAdding(false); setName(""); setErr(""); }}
                    style={{
                      padding: "7px 10px", borderRadius: 8,
                      border: `1px solid ${COLORS.border}`, cursor: "pointer",
                      fontFamily: FONT, fontSize: 12, fontWeight: 600,
                      background: "transparent", color: COLORS.textMuted,
                    }}
                  >Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Sidebar({ active, onChange, achievementsUnlocked, achievementsTotal, streak, lastEdit, pending, registry, activeBudgetId, onSwitchBudget, onCreateBudget, switchingBudget, isBasic }) {
  const sections = SIDEBAR_SECTIONS.filter((s) =>
    !MOBILE_ONLY_SECTIONS.has(s.id) && !(isBasic && ["habits", "achievements"].includes(s.id)));
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      position: "sticky", top: 0, alignSelf: "flex-start",
      height: "100vh", overflowY: "auto",
      background: COLORS.surface,
      borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column",
      fontFamily: FONT,
    }}>
      <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
        <a href="/admin" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 600, color: COLORS.textFaint,
          textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          <Icon d={ICON.chevL} size={12} /> Admin
        </a>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Budget</div>
        <BudgetSwitcher
          registry={registry}
          activeBudgetId={activeBudgetId}
          onSwitch={onSwitchBudget}
          onCreate={onCreateBudget}
          switching={switchingBudget}
        />
      </div>

      <nav style={{ padding: "12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: isActive ? `${s.accent}14` : "transparent",
                color: isActive ? s.accent : COLORS.textMuted,
                border: "none", cursor: "pointer",
                fontSize: 13.5, fontWeight: isActive ? 700 : 600,
                textAlign: "left",
                fontFamily: FONT,
                position: "relative",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = COLORS.surfaceTint; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && (
                <div style={{ position: "absolute", left: -12, top: 8, bottom: 8, width: 3, background: s.accent, borderRadius: 3 }} />
              )}
              <div style={{
                width: 24, height: 24, borderRadius: 7,
                background: isActive ? `${s.accent}26` : COLORS.surfaceTint,
                color: isActive ? s.accent : COLORS.textMuted,
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Icon d={s.icon} size={13} />
              </div>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === "achievements" && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: isActive ? s.accent : COLORS.surfaceTint,
                  color: isActive ? "#fff" : COLORS.textFaint,
                  padding: "2px 7px", borderRadius: 100,
                }}>{achievementsUnlocked}/{achievementsTotal}</span>
              )}
              {s.id === "habits" && streak > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: `${s.accent}26`, color: s.accent,
                  padding: "2px 7px", borderRadius: 100,
                  display: "inline-flex", alignItems: "center", gap: 3,
                }}>
                  <Icon d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" size={10} />
                  {streak}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "12px 14px 16px", borderTop: `1px solid ${COLORS.surfaceTint}`, fontSize: 11, color: COLORS.textFaint, lineHeight: 1.45 }}>
        <div>{pending ? "Saving…" : "All changes saved"}</div>
        {lastEdit && <div>Last edit {formatRelativeTime(lastEdit)}</div>}
      </div>
    </aside>
  );
}

// Habits / streaks / achievements strip above the tile grid.
function InsightsPanel({ state }) {
  const insights = useMemo(() => computeInsights(state), [state]);
  if (insights.length === 0) return null;

  const KIND_STYLES = {
    good: { color: COLORS.green, bg: COLORS.greenBg },
    warn: { color: COLORS.amber, bg: COLORS.amberBg },
    info: { color: COLORS.blue,  bg: COLORS.blueBg },
  };

  return (
    <section
      style={{
        ...STYLES.card,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: COLORS.text, textTransform: "uppercase" }}>
          What&apos;s happening this month
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint }}>
          {insights.length} insight{insights.length === 1 ? "" : "s"}
        </span>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {insights.map((ins) => {
          const styles = KIND_STYLES[ins.kind] || KIND_STYLES.info;
          return (
            <div
              key={ins.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 10,
                background: styles.bg,
                border: `1px solid ${styles.color}22`,
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: styles.color, color: "#fff",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Icon d={ICON[ins.icon] || ICON.target} size={14} color="#fff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ins.headline}
                </div>
                <div style={{ marginTop: 1, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
                  {ins.body}
                </div>
              </div>
              {ins.value != null ? (
                <div style={{ fontSize: 14, fontWeight: 800, color: styles.color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {fmtCompact(ins.value)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function YearInReviewStrip({ state }) {
  const stats = useMemo(() => computeYearStats(state), [state]);

  // Suppress until there's actually something to show. Months-tracked
  // gate keeps a fresh user from seeing "$0 saved" their first day.
  if (stats.monthsTracked < 2) return null;

  const tiles = [
    {
      key: "saved",
      label: `Saved · ${stats.year}`,
      value: fmtUsd(stats.savedYTD, { compact: stats.savedYTD >= 100_000 }),
      sub: `${stats.monthsTracked} mo tracked`,
      color: stats.savedYTD >= 0 ? COLORS.green : COLORS.red,
      bg: stats.savedYTD >= 0 ? COLORS.greenBg : COLORS.redBg,
      icon: ICON.trending,
    },
    {
      key: "delta",
      label: "Net worth Δ",
      value: `${stats.netWorthDelta >= 0 ? "+" : "−"}${fmtUsd(Math.abs(stats.netWorthDelta), { compact: Math.abs(stats.netWorthDelta) >= 100_000 })}`,
      sub: "since Jan 1",
      color: stats.netWorthDelta >= 0 ? COLORS.green : COLORS.red,
      bg: stats.netWorthDelta >= 0 ? COLORS.greenBg : COLORS.redBg,
      icon: stats.netWorthDelta >= 0 ? ICON.arrowUp : ICON.arrowDn,
    },
    {
      key: "spent",
      label: "Total spent",
      value: fmtUsd(stats.totalSpent, { compact: stats.totalSpent >= 100_000 }),
      sub: `across logged categories`,
      color: COLORS.amber,
      bg: COLORS.amberBg,
      icon: ICON.envelope,
    },
    {
      key: "best",
      label: "Best month",
      value: stats.bestMonthLabel || "—",
      sub: stats.bestMonthLabel ? `${fmtUsd(stats.bestMonthAmount, { compact: true })} saved` : "needs more history",
      color: COLORS.purple,
      bg: COLORS.purpleBg,
      icon: ICON.trophy,
    },
  ];

  return (
    <section style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
      gap: 10,
      marginBottom: 14,
    }}>
      {tiles.map((t) => (
        <div
          key={t.key}
          style={{
            ...STYLES.card,
            padding: "12px 14px",
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr)",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: t.bg, color: t.color,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={t.icon} size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: COLORS.textFaint, textTransform: "uppercase" }}>
              {t.label}
            </div>
            <div style={{
              marginTop: 1, fontSize: 18, fontWeight: 800, color: t.color,
              fontVariantNumeric: "tabular-nums", letterSpacing: -0.02,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {t.value}
            </div>
            <div style={{ marginTop: 1, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
              {t.sub}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

// Basic-mode dashboard CTA strip — replaces the 5-tile drill grid
// with two big buttons that route to the sections that matter:
// Envelopes (where your money goes) and Goals (what you're saving toward).
function BasicQuickActions({ onEnvelopes, onGoals }) {
  const actions = [
    { label: "Edit my envelopes", sub: "Groceries, gas, rent — set what you can spend each month.", accent: COLORS.accent, icon: ICON.envelope, onClick: onEnvelopes },
    { label: "Pick a goal",       sub: "Emergency fund, vacation, payoff. Make the math chase a target.", accent: COLORS.amber, icon: ICON.flag,     onClick: onGoals },
  ];
  return (
    <section style={{ marginTop: 16, display: "grid", gap: 10 }}>
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          style={{
            ...STYLES.card,
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            gap: 14,
            alignItems: "center",
            padding: 18,
            cursor: "pointer",
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            textAlign: "left",
            fontFamily: FONT,
            transition: "border-color 0.12s ease, transform 0.12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = ""; }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${a.accent}1A`, color: a.accent,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={a.icon} size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>{a.label}</div>
            <div style={{ marginTop: 3, fontSize: 12.5, color: COLORS.textMuted, fontWeight: 500 }}>{a.sub}</div>
          </div>
          <Icon d={ICON.chevR} size={16} color={COLORS.textFaint} />
        </button>
      ))}
    </section>
  );
}

function OnboardingChecklist({ state, onJump, onDismiss }) {
  const [expanded, setExpanded] = useState(true);
  const status = useMemo(() => computeOnboarding(state), [state]);

  // Hide entirely once dismissed OR once all required steps are done.
  if (state.settings.onboarding_dismissed) return null;
  if (status.allRequiredDone) return null;

  const SECTION_LABELS = {
    dashboard: "Dashboard tiles",
    envelopes: "Envelopes",
    habits:    "Habits",
    goals:     "Goals",
    settings:  "Settings",
  };

  return (
    <section
      style={{
        ...STYLES.card,
        padding: 16,
        marginBottom: 14,
        background: `linear-gradient(135deg, ${COLORS.accentSoft} 0%, ${COLORS.surface} 70%)`,
        border: `1px solid ${COLORS.accent}33`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: COLORS.accent, color: "#fff",
            display: "grid", placeItems: "center", flexShrink: 0,
            fontSize: 14, fontWeight: 800, letterSpacing: -0.4,
          }}>
            {status.completedRequired}/{status.totalRequired}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              Let&apos;s get the basics in
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>
              {status.percent}% of the required setup done · {status.completedAll}/{status.totalAll} including optional
            </div>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 6 }}>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{ ...textBtnStyle(), padding: "6px 10px", fontSize: 12 }}
            aria-expanded={expanded}
          >
            <Icon d={expanded ? ICON.chevD : ICON.chevR} size={12} />
            {expanded ? "hide" : "show"}
          </button>
          <button
            onClick={onDismiss}
            title="Hide forever"
            aria-label="Dismiss onboarding"
            style={{ ...textBtnStyle(), padding: "6px 8px", fontSize: 12, color: COLORS.textFaint }}
          >
            <Icon d={ICON.x} size={12} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        marginTop: 12,
        height: 6,
        background: COLORS.surfaceTint,
        borderRadius: 100,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${status.percent}%`,
          height: "100%",
          background: COLORS.accent,
          transition: "width 0.4s ease",
        }} />
      </div>

      {expanded ? (
        <div style={{ marginTop: 12, display: "grid", gap: 4 }}>
          {status.steps.map((s) => (
            <button
              key={s.id}
              onClick={() => onJump?.(s.section)}
              disabled={s.completed}
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                textAlign: "left",
                padding: "10px 8px",
                borderRadius: 10,
                background: "transparent",
                border: "none",
                cursor: s.completed ? "default" : "pointer",
                fontFamily: FONT,
                opacity: s.completed ? 0.55 : 1,
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => { if (!s.completed) e.currentTarget.style.background = COLORS.surface; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: s.completed ? COLORS.accent : "transparent",
                border: s.completed ? "none" : `2px solid ${COLORS.borderStrong}`,
                color: "#fff",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                {s.completed ? <Icon d={ICON.check} size={12} color="#fff" /> : null}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: COLORS.text,
                  textDecoration: s.completed ? "line-through" : "none",
                }}>
                  {s.label}{s.optional ? <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>optional</span> : null}
                </div>
                <div style={{ marginTop: 1, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
                  {s.hint}
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: s.completed ? COLORS.textFaint : COLORS.accent, textTransform: "uppercase" }}>
                {s.completed ? "done" : SECTION_LABELS[s.section] || "open"}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TodaysHabitsBanner({ state, onJump }) {
  const stored = state.habits || [];
  const habits = stored.length > 0 ? stored : DEFAULT_HABITS.map((d) => ({ ...d, completions: [] }));
  // Only count daily habits — weekly/monthly cadences don't belong in a "today" check.
  const daily = habits.filter((h) => h.cadence === "daily" && !h.archived);
  if (daily.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const done = daily.filter((h) => (h.completions || []).includes(today)).length;
  const pct = (done / daily.length) * 100;
  const allDone = done === daily.length;
  return (
    <button
      onClick={onJump}
      aria-label={`${done} of ${daily.length} daily habits done today — open habits`}
      style={{
        marginTop: 12, width: "100%", textAlign: "left",
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 14, padding: "12px 14px",
        cursor: "pointer", fontFamily: FONT,
        display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
        gap: 12, alignItems: "center",
        transition: "border-color 0.12s ease, background 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d6448f"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: allDone ? "#d6448f" : "rgba(214,68,143,0.10)",
        color: allDone ? "#fff" : "#d6448f",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon d={allDone ? "M20 6L9 17l-5-5" : "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3"} size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
          {allDone ? "All daily habits done — nice." : `${done} of ${daily.length} daily habits done today`}
        </div>
        <div style={{ marginTop: 6, height: 5, background: COLORS.surfaceTint, borderRadius: 100, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", background: "#d6448f",
            borderRadius: 100, transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, whiteSpace: "nowrap" }}>
        Open habits
        <Icon d={ICON.chevR} size={12} />
      </div>
    </button>
  );
}

function CashFlowForecastPanel({ state }) {
  const forecast = useMemo(() => computeForecast(state), [state]);
  const { series, monthlyAvgNet, annualRunRate, netWorthIn12Months, baseIncome, baseExpenses } = forecast;
  const positive = monthlyAvgNet >= 0;

  // recharts wants "today" as a real x-axis category match — pull the
  // label of the current month so ReferenceLine pins to the right tick.
  const todayLabel = series.find((s) => s.is_current)?.label;

  return (
    <section style={{ ...STYLES.card, marginTop: 12, padding: "16px 14px 6px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        gap: 12, flexWrap: "wrap", padding: "0 6px 10px",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Cash flow · 18-month view</div>
          <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>
            6 months of history + 12 months projected at today's run-rate
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 2, background: COLORS.green, borderRadius: 2 }} />Income
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 2, background: COLORS.red, borderRadius: 2 }} />Expenses
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 2, background: COLORS.text, borderRadius: 2 }} />Net
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={series} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceTint} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: COLORS.textFaint, fontSize: 10, fontFamily: FONT }}
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
          />
          <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
          <Bar dataKey="income_cents" fill={COLORS.green} opacity={0.18} radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses_cents" fill={COLORS.red} opacity={0.18} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="net_cents" stroke={COLORS.text} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.text }} activeDot={{ r: 4 }} />
          {todayLabel && (
            <ReferenceLine
              x={todayLabel}
              stroke={COLORS.accent}
              strokeDasharray="4 4"
              label={{ value: "today", position: "top", fill: COLORS.accent, fontSize: 10, fontFamily: FONT, fontWeight: 700 }}
            />
          )}
          <RTooltip
            contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "8px 12px", fontFamily: FONT }}
            labelStyle={{ color: COLORS.textFaint, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}
            formatter={(v, key) => {
              if (key === "income_cents")   return [fmtCompact(v), "Income"];
              if (key === "expenses_cents") return [fmtCompact(v), "Expenses"];
              if (key === "net_cents")      return [fmtCompact(v), "Net"];
              return [fmtCompact(v), key];
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: 10, padding: "12px 8px 4px",
        borderTop: `1px solid ${COLORS.surfaceTint}`,
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14,
      }}>
        <ForecastStat label="Monthly avg" value={fmtUsd(monthlyAvgNet)} color={positive ? COLORS.green : COLORS.red} sub={`${fmtCompact(baseIncome)} in − ${fmtCompact(baseExpenses)} out`} />
        <ForecastStat label="Annual run-rate" value={fmtCompact(annualRunRate)} color={positive ? COLORS.green : COLORS.red} sub="at today's pace" />
        <ForecastStat label="Net worth in 12mo" value={fmtCompact(netWorthIn12Months)} color={COLORS.text} sub={positive ? `+${fmtCompact(annualRunRate)} saved` : `${fmtCompact(annualRunRate)} drawn down`} />
        <ForecastStat
          label="Cash flow streak"
          value={(() => {
            let cur = 0;
            for (let i = series.length - 1; i >= 0; i--) {
              if (series[i].is_future) continue;
              if (series[i].net_cents > 0) cur++; else break;
            }
            return cur > 0 ? `${cur} mo` : "—";
          })()}
          color={COLORS.accent}
          sub="positive months in a row"
        />
      </div>
    </section>
  );
}

function SpendingHeatmapPanel({ state }) {
  const grid = useMemo(() => buildSpendingHeatmap(state, 53), [state]);
  const [hover, setHover] = useState(null);

  // Empty state — no logged spend at all.
  if (grid.activeDays === 0) {
    return (
      <section style={{
        ...STYLES.card,
        padding: "16px 14px",
        marginTop: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Spending heatmap</div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>
          Log expenses or connect a bank to see your spending intensity here.
        </div>
      </section>
    );
  }

  const cellSize = 11;
  const cellGap = 2;
  const gridWidth = grid.weeks * (cellSize + cellGap);
  const dayLabels = ["", "M", "", "W", "", "F", ""];

  // Bucket → background. Bucket 0 = $0 day (subtle tint). Buckets 1-5
  // ramp from accentSoft to accent. Bucket -1 = future day (invisible).
  const bucketColor = (b) => {
    if (b < 0) return "transparent";
    if (b === 0) return COLORS.surfaceTint;
    if (b === 1) return "color-mix(in srgb, var(--bb-accent) 20%, var(--bb-surface))";
    if (b === 2) return "color-mix(in srgb, var(--bb-accent) 40%, var(--bb-surface))";
    if (b === 3) return "color-mix(in srgb, var(--bb-accent) 60%, var(--bb-surface))";
    if (b === 4) return "color-mix(in srgb, var(--bb-accent) 80%, var(--bb-surface))";
    return COLORS.accent;
  };

  return (
    <section style={{
      ...STYLES.card,
      padding: "16px 14px",
      marginTop: 14,
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 12, flexWrap: "wrap", marginBottom: 12,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Spending heatmap</div>
          <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
            Past year · {fmtUsd(grid.totalCents, { compact: true })} across {grid.activeDays} day{grid.activeDays === 1 ? "" : "s"}
            {grid.heaviest ? ` · heaviest ${grid.heaviest.iso} (${fmtUsd(grid.heaviest.cents, { compact: true })})` : ""}
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: COLORS.textMuted }}>
          less
          {[0, 1, 2, 3, 4, 5].map((b) => (
            <span key={b} style={{
              width: cellSize, height: cellSize, borderRadius: 2,
              background: bucketColor(b),
              border: b === 0 ? `1px solid ${COLORS.border}` : "none",
              display: "inline-block",
            }} />
          ))}
          more
        </div>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "inline-block", position: "relative", paddingTop: 16, paddingLeft: 22 }}>
          {/* Month labels */}
          <div style={{ position: "absolute", top: 0, left: 22, right: 0, height: 14 }}>
            {grid.monthLabels.map((m) => (
              <span
                key={`${m.weekIndex}-${m.label}`}
                style={{
                  position: "absolute",
                  left: m.weekIndex * (cellSize + cellGap),
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  color: COLORS.textFaint,
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Day-of-week labels (M/W/F) */}
          <div style={{ position: "absolute", top: 16, left: 0, width: 18, height: 7 * (cellSize + cellGap) }}>
            {dayLabels.map((lbl, d) => (
              <span key={d} style={{
                position: "absolute",
                top: d * (cellSize + cellGap),
                left: 0,
                width: 18,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: COLORS.textFaint,
                lineHeight: `${cellSize}px`,
                textAlign: "right",
                paddingRight: 4,
              }}>
                {lbl}
              </span>
            ))}
          </div>

          {/* Cell grid */}
          <svg
            width={gridWidth}
            height={7 * (cellSize + cellGap)}
            role="img"
            aria-label="Spending heatmap, past 53 weeks"
          >
            {grid.cells.map((c, i) => (
              <rect
                key={i}
                x={c.weekIndex * (cellSize + cellGap)}
                y={c.dow * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                ry={2}
                fill={bucketColor(c.bucket)}
                stroke={c.bucket === 0 ? COLORS.border : "none"}
                strokeWidth={c.bucket === 0 ? 1 : 0}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover((h) => (h === c ? null : h))}
                onTouchStart={() => setHover(c)}
                style={{ cursor: c.inFuture ? "default" : "pointer" }}
              >
                <title>
                  {c.inFuture
                    ? `${c.iso} · future`
                    : c.cents > 0
                      ? `${c.iso} · ${fmtUsd(c.cents)}`
                      : `${c.iso} · no spend`}
                </title>
              </rect>
            ))}
          </svg>
        </div>
      </div>

      {hover && !hover.inFuture ? (
        <div
          role="status"
          style={{
            marginTop: 10,
            padding: "6px 10px",
            borderRadius: 8,
            background: COLORS.surfaceTint,
            border: `1px solid ${COLORS.border}`,
            fontSize: 12,
            color: COLORS.text,
            fontWeight: 600,
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: 2,
            background: bucketColor(hover.bucket),
            border: hover.bucket === 0 ? `1px solid ${COLORS.border}` : "none",
          }} />
          {hover.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          <span style={{ color: COLORS.textMuted, fontWeight: 500 }}>·</span>
          <span style={{ color: hover.cents > 0 ? COLORS.text : COLORS.textFaint }}>
            {hover.cents > 0 ? fmtUsd(hover.cents) : "no spend"}
          </span>
        </div>
      ) : null}
    </section>
  );
}

function ForecastStat({ label, value, color, sub }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ marginTop: 3, fontSize: 18, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ marginTop: 1, fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

function HabitsStrip({ streaks, achievements, netWorth, savingsThisMonth }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const cards = [
    {
      key: "tracked",
      label: "Day streak",
      value: String(streaks.trackedStreak),
      sub: streaks.trackedStreak >= 7 ? "on fire" : streaks.trackedStreak >= 2 ? "keep going" : "first day",
      color: "#d6448f",
      icon: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
    },
    {
      key: "positive",
      label: "Positive month",
      value: streaks.cfStreak > 0 ? String(streaks.cfStreak) : "—",
      sub: streaks.cfStreak > 0 ? "in a row" : "this month",
      color: "#138a60",
      icon: "M22 7l-8.5 8.5-5-5L2 17",
    },
    {
      key: "achievements",
      label: "Achievements",
      value: `${unlocked}/${achievements.length}`,
      sub: unlocked === achievements.length ? "all unlocked" : "earned",
      color: "#c88318",
      icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z",
    },
    {
      key: "networth",
      label: "Net worth",
      value: fmtCompact(netWorth),
      sub: netWorth >= 100_000_000 ? "millionaire" : netWorth >= 50_000_000 ? "halfway to $1M" : "building",
      color: "#3b6fd1",
      icon: "M22 7l-8.5 8.5-5-5L2 17",
    },
  ];
  return (
    <div style={{
      marginTop: 12,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 10,
    }}>
      {cards.map((c) => (
        <div key={c.key} style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 12,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, right: "auto", width: 3,
            background: c.color,
          }} />
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${c.color}1A`, color: c.color,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={c.icon} size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginTop: 1 }}>{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Achievement strip: pill row of unlocked + locked badges.
function AchievementStrip({ achievements }) {
  return (
    <div style={{
      ...STYLES.card,
      marginTop: 12, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.textMuted }}>
          Achievements
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>
          {achievements.filter((a) => a.unlocked).length} / {achievements.length}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {achievements.map((a) => (
          <div key={a.id} title={a.label} style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            borderRadius: 100,
            background: a.unlocked ? `${a.color}14` : COLORS.surfaceTint,
            border: `1px solid ${a.unlocked ? `${a.color}33` : COLORS.border}`,
            opacity: a.unlocked ? 1 : 0.55,
            transition: "all 0.18s ease",
            cursor: "default",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: a.unlocked ? a.color : COLORS.borderStrong,
              color: "#fff",
              display: "grid", placeItems: "center",
            }}>
              <Icon d={a.unlocked ? "M20 6L9 17l-5-5" : "M12 17h.01 M12 6v6"} size={12} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: a.unlocked ? COLORS.text : COLORS.textFaint, whiteSpace: "nowrap" }}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Slim left↔right occupancy toggle for property rooms.
function OccupancyToggle({ occupied, onChange, size = "sm" }) {
  const dims = size === "sm" ? { w: 36, h: 20, knob: 16 } : { w: 44, h: 24, knob: 20 };
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!occupied); }}
      aria-label={occupied ? "Mark vacant" : "Mark occupied"}
      style={{
        width: dims.w, height: dims.h, borderRadius: dims.h,
        background: occupied ? COLORS.green : COLORS.borderStrong,
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.18s ease",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: (dims.h - dims.knob) / 2,
        left: occupied ? dims.w - dims.knob - (dims.h - dims.knob) / 2 : (dims.h - dims.knob) / 2,
        width: dims.knob, height: dims.knob, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
        transition: "left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }} />
    </button>
  );
}

// ── Customizable dashboard layout ────────────────────────────────────
// Each tile on the /admin/budget dashboard is a row in this registry.
// Drag-to-reorder and rename happen via the "Edit layout" button.
// Order + labels persist in state.settings.dashboard_layout.
//
//   { id, defaultLabel, basic, full, group? }
//
// `basic`/`full` gate the tile against state.settings.experience.
// `group` causes consecutive same-group tiles to render together inside
// a CSS grid wrapper in view mode (preserves the 4-column "Categories"
// row on desktop). Edit mode always renders flat for clean reordering.
// Dashboard glance — every envelope at a glance, toggleable between
// Spent / Remaining / Budget. Sits at the top of the dashboard so it's
// the first thing seen on login.
// A single envelope row inside a group: name · spent-vs-budget bar ·
// the toggle-driven value. The bar is the always-on health signal — it
// reads spent/budget regardless of which value the toggle shows, so a
// near-empty envelope looks full whether you're viewing Spent or Left.
function GlanceRow({ r, view, accent, isMobile }) {
  const value = view === "spent" ? r.spent : view === "budget" ? r.budget : r.available;
  const over = r.available < 0;
  const pct = r.budget > 0 ? Math.min(100, Math.round((r.spent / r.budget) * 100)) : 0;
  const near = !over && pct >= 85;
  const barColor = over ? COLORS.red : near ? COLORS.amber : accent;
  const valColor = view === "remaining"
    ? (value < 0 ? COLORS.red : value > 0 ? COLORS.green : COLORS.textFaint)
    : view === "spent"
      ? (over ? COLORS.red : value > 0 ? COLORS.text : COLORS.textFaint)
      : (value > 0 ? COLORS.text : COLORS.textFaint);
  return (
    <div
      className="bb-row"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: isMobile ? "11px 16px 11px 24px" : "8px 16px 8px 25px",
        background: over ? COLORS.redBg : "transparent",
      }}
    >
      <span style={{
        fontSize: isMobile ? 15 : 13, fontWeight: 600, color: over ? COLORS.red : COLORS.text,
        flex: isMobile ? "0 0 104px" : "0 0 96px", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {r.label}
      </span>
      <span style={{ flex: 1, height: isMobile ? 7 : 6, borderRadius: 4, background: COLORS.surfaceTint, overflow: "hidden", minWidth: 0 }}>
        <span style={{ display: "block", height: "100%", width: `${over ? 100 : pct}%`, borderRadius: 4, background: barColor, transition: "width 0.2s ease" }} />
      </span>
      <span style={{
        fontSize: isMobile ? 15 : 13, fontWeight: 700, fontVariantNumeric: "tabular-nums",
        flex: isMobile ? "0 0 66px" : "0 0 60px", textAlign: "right", color: valColor,
      }}>
        {fmtUsd(value)}
      </span>
    </div>
  );
}

function EnvelopesGlance({ state, activeMonth, onOpen }) {
  const isMobile = useIsMobile();
  const [view, setView] = useState("remaining"); // "spent" | "remaining" | "budget"
  const [collapsed, setCollapsed] = useState(() => new Set());
  const startMonth = useMemo(() => envelopeStartMonth(state), [state]);

  // Group envelopes by category, preserving the canonical group order and
  // each envelope's sort_order within its group.
  const groups = useMemo(() => {
    const order = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
    const byKey = new Map();
    for (const c of state.categories || []) {
      const gk = c.group_key || "other";
      const b = envelopeBalance(state, c, activeMonth, startMonth);
      if (!byKey.has(gk)) byKey.set(gk, []);
      byKey.get(gk).push({
        label: c.label,
        budget: b.budget,
        spent: b.thisMonthSpent,
        available: b.available,
        so: c.sort_order ?? 0,
      });
    }
    return order
      .filter((gk) => byKey.has(gk))
      .map((gk) => ({
        key: gk,
        meta: GROUP_META[gk] || GROUP_META.other,
        rows: byKey.get(gk).sort((a, b) => a.so - b.so),
      }));
  }, [state, activeMonth, startMonth]);

  if (groups.length === 0) return null;

  const valueOf = (r) => (view === "spent" ? r.spent : view === "budget" ? r.budget : r.available);
  const allRows = groups.flatMap((g) => g.rows);
  const total = allRows.reduce((s, r) => s + valueOf(r), 0);
  const totalSpent = allRows.reduce((s, r) => s + r.spent, 0);
  const totalBudget = allRows.reduce((s, r) => s + r.budget, 0);
  const usedPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const overBudget = totalSpent > totalBudget && totalBudget > 0;

  const headerLabel = view === "spent" ? "Spent this month" : view === "budget" ? "Monthly budget" : "Left to spend";
  const totalColor = view === "remaining" ? (total >= 0 ? COLORS.green : COLORS.red) : COLORS.text;
  const subtotalColor = (sub) => (view === "remaining" ? (sub < 0 ? COLORS.red : COLORS.text) : COLORS.text);

  const toggleGroup = (key) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <section style={{ ...STYLES.cardLg, padding: 0, overflow: "hidden" }}>
      {/* Hero band — themed gradient/glass treatment (see --bb-hero-*). */}
      <div style={{ background: COLORS.heroBg, color: COLORS.heroInk, padding: isMobile ? "20px 18px 18px" : "22px 22px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 11.5 : 11, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: COLORS.heroInkSoft }}>
              {headerLabel}
            </div>
            <div style={{
              marginTop: 4, fontSize: isMobile ? 38 : 34, fontWeight: 800, letterSpacing: "-0.03em",
              color: COLORS.heroInk, fontVariantNumeric: "tabular-nums", lineHeight: 1,
            }}>
              {fmtUsd(total)}
            </div>
          </div>
          <button
            onClick={onOpen}
            style={{
              background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT,
              fontSize: isMobile ? 13 : 12, fontWeight: 700, color: COLORS.heroInkSoft, flexShrink: 0,
              display: "inline-flex", alignItems: "center", gap: 2, padding: "4px 0",
            }}
          >
            All envelopes
            <Icon d={ICON.chevR} size={13} color={COLORS.heroInkSoft} />
          </button>
        </div>

        {/* Overall budget meter — spent vs budgeted across every envelope. */}
        {totalBudget > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 8, borderRadius: 6, background: COLORS.heroTrack, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${usedPct}%`, borderRadius: 6, background: overBudget ? COLORS.red : COLORS.heroFill, transition: "width 0.2s ease" }} />
            </div>
            <div style={{ marginTop: 8, fontSize: isMobile ? 12 : 11, fontWeight: 600, color: COLORS.heroInkSoft }}>
              <span style={{ color: COLORS.heroInk }}>{fmtUsd(totalSpent, { compact: true })} spent</span>
              {" of "}{fmtUsd(totalBudget, { compact: true })} budgeted · {usedPct}% used
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: "flex", gap: 3, margin: isMobile ? "12px 16px 8px" : "14px 16px 8px",
        background: COLORS.surfaceTint, borderRadius: 10, padding: 3,
      }}>
        {[["spent", "Spent"], ["remaining", "Remaining"], ["budget", "Budget"]].map(([v, label]) => {
          const on = view === v;
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                flex: 1, padding: isMobile ? "9px 0" : "7px 0", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: FONT, fontSize: isMobile ? 13.5 : 12, fontWeight: 700,
                background: on ? COLORS.surface : "transparent",
                color: on ? COLORS.text : COLORS.textMuted,
                boxShadow: on ? "0 1px 2px rgba(15,23,41,0.12)" : "none",
                transition: "all 0.12s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div>
        {groups.map((g) => {
          const isCollapsed = collapsed.has(g.key);
          const subtotal = g.rows.reduce((s, r) => s + valueOf(r), 0);
          const hasOver = g.rows.some((r) => r.available < 0);
          return (
            <div key={g.key} style={{ borderTop: `1px solid ${COLORS.surfaceTint}` }}>
              <button
                onClick={() => toggleGroup(g.key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: isMobile ? 10 : 9,
                  padding: isMobile ? "13px 16px 12px" : "11px 16px 10px", border: "none", background: "transparent",
                  cursor: "pointer", fontFamily: FONT, textAlign: "left",
                }}
              >
                <span style={{
                  width: isMobile ? 30 : 26, height: isMobile ? 30 : 26, borderRadius: 9, flexShrink: 0,
                  display: "grid", placeItems: "center", background: g.meta.bg,
                  fontSize: isMobile ? 16 : 14, lineHeight: 1,
                }}>
                  {g.meta.emoji}
                </span>
                <span style={{
                  fontSize: isMobile ? 12.5 : 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: COLORS.textMuted,
                }}>
                  {groupLabel(state, g.key)}
                </span>
                {hasOver && (
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: COLORS.red, flexShrink: 0 }} />
                )}
                <span style={{
                  marginLeft: "auto", fontSize: isMobile ? 15 : 13, fontWeight: 800, fontVariantNumeric: "tabular-nums",
                  color: subtotalColor(subtotal),
                }}>
                  {fmtUsd(subtotal)}
                </span>
                <Icon
                  d={ICON.chevD}
                  size={isMobile ? 17 : 15}
                  color={COLORS.textFaint}
                  style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s ease" }}
                />
              </button>
              {!isCollapsed && (
                <div style={{ paddingBottom: 4 }}>
                  {g.rows.map((r, i) => (
                    <GlanceRow key={r.label + i} r={r} view={view} accent={g.meta.accent} isMobile={isMobile} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// The day-one action row. "Log spending" is the hero action (opens the
// keypad AddSheet); "Move money" jumps to envelopes where transfers live.
function QuickActionsRow({ onLog, onMove }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button
        onClick={onLog}
        style={{
          flex: 1.6, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: isMobile ? "14px 0" : "13px 0", borderRadius: RADII.lg, border: "none", cursor: "pointer",
          fontFamily: FONT, fontSize: isMobile ? 14.5 : 14, fontWeight: 800,
          background: COLORS.accent, color: COLORS.onAccent, boxShadow: COLORS.shadow,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 400 }}>＋</span>
        Log spending
      </button>
      <button
        onClick={onMove}
        style={{
          flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
          padding: isMobile ? "14px 0" : "13px 0", borderRadius: RADII.lg, cursor: "pointer",
          fontFamily: FONT, fontSize: isMobile ? 14 : 13.5, fontWeight: 700,
          background: COLORS.surface, color: COLORS.text, border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow,
        }}
      >
        Move money
      </button>
    </div>
  );
}

// Attention-first: surfaces over-budget + nearly-spent envelopes so the
// app points the user at what needs a decision. Hidden entirely when
// everything is healthy (no empty-state noise).
function NeedsAttention({ state, activeMonth, onOpen }) {
  const isMobile = useIsMobile();
  const startMonth = useMemo(() => envelopeStartMonth(state), [state]);
  const flagged = useMemo(() => {
    const rows = [];
    for (const c of state.categories || []) {
      const b = envelopeBalance(state, c, activeMonth, startMonth);
      if (b.budget <= 0) continue;
      const pct = Math.round((b.thisMonthSpent / b.budget) * 100);
      const over = b.available < 0;
      const near = !over && pct >= 85;
      if (!over && !near) continue;
      rows.push({
        label: c.label,
        gk: c.group_key || "other",
        over, near, pct,
        available: b.available,
      });
    }
    // Over-budget first (worst overage first), then nearly-spent.
    return rows.sort((a, b) => {
      if (a.over !== b.over) return a.over ? -1 : 1;
      if (a.over) return a.available - b.available;
      return b.pct - a.pct;
    }).slice(0, 4);
  }, [state, activeMonth, startMonth]);

  if (flagged.length === 0) return null;

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "0 4px 10px" }}>
        <span style={{ fontSize: 13, lineHeight: 1 }}>⚠️</span>
        <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.red }}>
          Needs attention
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 800, color: COLORS.textFaint }}>{flagged.length}</span>
      </div>
      <div style={{ ...STYLES.card, overflow: "hidden" }}>
        {flagged.map((r, i) => {
          const meta = GROUP_META[r.gk] || GROUP_META.other;
          const right = r.over ? `−${fmtUsd(Math.abs(r.available))}` : `${fmtUsd(r.available)} left`;
          const rightColor = r.over ? COLORS.red : COLORS.amber;
          const sub = r.over
            ? `${meta.label} · over by ${fmtUsd(Math.abs(r.available))}`
            : `${meta.label} · ${r.pct}% spent`;
          return (
            <button
              key={r.label + i}
              onClick={() => onOpen(r.label)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                padding: isMobile ? "13px 16px" : "12px 16px", cursor: "pointer", fontFamily: FONT,
                background: "transparent", border: "none",
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.surfaceTint}`,
              }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center",
                background: r.over ? COLORS.redBg : COLORS.amberBg, fontSize: 17, lineHeight: 1,
              }}>
                {categoryEmoji(r.label, r.gk)}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 1 }}>{sub}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 800, color: rightColor, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{right}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// "Money" nav destination — the whole financial picture (net worth,
// rentals, loans), each tapping into its drill sheet. Reuses the same
// tiles the desktop dashboard shows.
function MoneyView({ state, setDrill }) {
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ margin: "0 0 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: COLORS.text }}>Money</div>
        <div style={{ marginTop: 3, fontSize: 13, color: COLORS.textMuted }}>Net worth, rentals and loans at a glance.</div>
      </div>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <RentalsTile  state={state} onClick={() => setDrill("rentals")} />
        <NetWorthTile state={state} onClick={() => setDrill("networth")} />
        <HelocTile    state={state} onClick={() => setDrill("heloc")} />
        <MomLoanTile  state={state} onClick={() => setDrill("mom")} onLogPayment={() => setDrill("mom")} />
      </div>
    </div>
  );
}

// "More" nav destination — the sections that don't earn a bottom-bar
// slot (Envelopes, Habits, Achievements, Settings).
function MoreMenu({ onNavigate, isBasic }) {
  const ids = ["envelopes", "habits", "achievements", "settings"].filter(
    (id) => !(isBasic && (id === "habits" || id === "achievements")),
  );
  const byId = Object.fromEntries(SIDEBAR_SECTIONS.map((s) => [s.id, s]));
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ margin: "0 0 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: COLORS.text }}>More</div>
      </div>
      <div style={{ ...STYLES.card, overflow: "hidden" }}>
        {ids.map((id, i) => {
          const s = byId[id];
          if (!s) return null;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 13, textAlign: "left",
                padding: "15px 16px", cursor: "pointer", fontFamily: FONT, background: "transparent",
                border: "none", borderTop: i === 0 ? "none" : `1px solid ${COLORS.surfaceTint}`,
              }}
            >
              <span style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center", background: `${s.accent}1A`, color: s.accent }}>
                <Icon d={s.icon} size={17} color={s.accent} />
              </span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: COLORS.text }}>{s.label}</span>
              <Icon d={ICON.chevR} size={16} color={COLORS.textFaint} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Phone-first "This Month" screen ──────────────────────────────────
// A purpose-built mobile dashboard that renders the redesigned flow as
// discrete cards (hero · log/move · attention · envelopes), instead of
// the desktop's configurable tile grid. Shown whenever the viewport is
// phone-width; desktop keeps DashboardLayout's tile system.
function ThisMonthMobile({ state, activeMonth, setActiveMonth, onLog, onMove, onOpenEnvelopes, setDrill }) {
  const startMonth = useMemo(() => envelopeStartMonth(state), [state]);
  const [collapsed, setCollapsed] = useState(() => new Set());

  const groups = useMemo(() => {
    const order = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
    const byKey = new Map();
    for (const c of state.categories || []) {
      const gk = c.group_key || "other";
      const b = envelopeBalance(state, c, activeMonth, startMonth);
      if (!byKey.has(gk)) byKey.set(gk, []);
      byKey.get(gk).push({ label: c.label, budget: b.budget, spent: b.thisMonthSpent, available: b.available, so: c.sort_order ?? 0 });
    }
    return order.filter((gk) => byKey.has(gk)).map((gk) => ({
      key: gk, meta: GROUP_META[gk] || GROUP_META.other, rows: byKey.get(gk).sort((a, b) => a.so - b.so),
    }));
  }, [state, activeMonth, startMonth]);

  const allRows = groups.flatMap((g) => g.rows);
  const totalAvail = allRows.reduce((s, r) => s + r.available, 0);
  const totalSpent = allRows.reduce((s, r) => s + r.spent, 0);
  const totalBudget = allRows.reduce((s, r) => s + r.budget, 0);
  const usedPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const over = totalSpent > totalBudget && totalBudget > 0;

  // Days remaining in the active month (0 for past months) — drives the
  // hero caption, matching the mockup's "· 12 days left".
  const daysLeft = useMemo(() => {
    const [y, m] = activeMonth.split("-").map(Number);
    const now = new Date();
    const isCurrent = now.getFullYear() === y && now.getMonth() + 1 === m;
    if (!isCurrent) return 0;
    return Math.max(0, new Date(y, m, 0).getDate() - now.getDate());
  }, [activeMonth]);

  // Compact money glance + a single pacing insight (matches the prototype).
  const money = useMemo(() => {
    const ops = (state.properties || []).filter((p) => p.status === "operating");
    const noi = ops.reduce((s, p) => s + propertyMonthlyGross(p) - propertyMonthlyExpenses(p, state.settings), 0);
    const loan = (state.mom_loans || [])[0];
    const momNet = loan
      ? loan.starting_balance_cents
        + loan.payments.filter((p) => p.direction === "out").reduce((s, p) => s + p.amount_cents, 0)
        - loan.payments.filter((p) => p.direction !== "out").reduce((s, p) => s + p.amount_cents, 0)
      : null;
    const heloc = state.heloc_model?.mortgage_balance_cents ?? null;
    return { networth: computeNetWorthCents(state), noi, opsCount: ops.length, momNet, heloc };
  }, [state]);
  const insight = useMemo(() => {
    if (totalBudget <= 0) return null;
    const [, m] = activeMonth.split("-").map(Number);
    const now = new Date();
    const isCurrent = now.getMonth() + 1 === m;
    const daysInMonth = new Date(now.getFullYear(), m, 0).getDate();
    const dayOfMonth = isCurrent ? now.getDate() : daysInMonth;
    const paceFrac = Math.max(0.001, dayOfMonth / daysInMonth);
    const projected = totalSpent / paceFrac;
    const leftover = totalBudget - projected;
    if (leftover > 0) return { kind: "good", text: `You're pacing under budget — on track to finish with about ${fmtUsd(leftover, { compact: true })} left over.` };
    return { kind: "warn", text: `At this pace you'll go about ${fmtUsd(Math.abs(leftover), { compact: true })} over budget this month.` };
  }, [activeMonth, totalSpent, totalBudget]);

  const toggle = (key) => setCollapsed((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const secLabel = (txt, right) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 4px 10px" }}>
      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>{txt}</span>
      {right}
    </div>
  );

  return (
    // Pinned to the "daylight" (RentCaddie Default) palette so this screen
    // always matches the approved mockup's blue->pink look, regardless of
    // the theme selected elsewhere. Re-scopes every --bb-* var inside.
    <div data-bb-theme="daylight" style={{ display: "grid", gap: 16, marginTop: 4 }}>
      {/* Clear orientation: this screen is your budget for the month. */}
      <div style={{ margin: "0 2px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: COLORS.text }}>Your budget</div>
        <div style={{ marginTop: 2, fontSize: 13, color: COLORS.textMuted }}>What you can spend, where it's going, what needs a look.</div>
      </div>
      <MonthScrubber value={activeMonth} onChange={setActiveMonth} />

      {/* HERO — safe to spend */}
      <section style={{ borderRadius: RADII.xl, padding: "22px", color: COLORS.heroInk, background: COLORS.heroBg, boxShadow: COLORS.shadowLg }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: COLORS.heroInkSoft }}>Safe to spend</div>
        <div style={{ marginTop: 5, fontSize: 44, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(totalAvail)}</div>
        {totalBudget > 0 && (
          <>
            <div style={{ height: 8, borderRadius: 6, background: COLORS.heroTrack, overflow: "hidden", marginTop: 16 }}>
              <div style={{ height: "100%", width: `${usedPct}%`, borderRadius: 6, background: over ? COLORS.red : COLORS.heroFill }} />
            </div>
            <div style={{ marginTop: 9, fontSize: 12, fontWeight: 600, color: COLORS.heroInkSoft }}>
              <span style={{ color: COLORS.heroInk }}>{fmtUsd(totalSpent)} spent</span>{" of "}{fmtUsd(totalBudget)} budgeted{daysLeft > 0 ? ` · ${daysLeft} days left` : ""}
            </div>
          </>
        )}
      </section>

      {/* LOG / MOVE */}
      <QuickActionsRow onLog={onLog} onMove={onMove} />

      {/* NEEDS ATTENTION */}
      <NeedsAttention state={state} activeMonth={activeMonth} onOpen={onLog} />

      {/* ENVELOPES — one card per group */}
      <div>
        {secLabel("Envelopes", (
          <button onClick={onOpenEnvelopes} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: COLORS.accent, display: "inline-flex", alignItems: "center", gap: 3 }}>
            All <span style={{ fontSize: 15, lineHeight: 1 }}>›</span>
          </button>
        ))}
        <div style={{ display: "grid", gap: 12 }}>
          {groups.map((g) => {
            const isCol = collapsed.has(g.key);
            const subtotal = g.rows.reduce((s, r) => s + r.available, 0);
            const hasOver = g.rows.some((r) => r.available < 0);
            return (
              <div key={g.key} style={{ ...STYLES.card, overflow: "hidden" }}>
                <button onClick={() => toggle(g.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 15px", border: "none", background: "transparent", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
                  <span style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center", background: g.meta.bg, fontSize: 17, lineHeight: 1 }}>
                    {g.meta.emoji}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textMuted }}>{groupLabel(state, g.key)}</span>
                  {hasOver && <span style={{ width: 6, height: 6, borderRadius: 999, background: COLORS.red, flexShrink: 0 }} />}
                  <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: subtotal < 0 ? COLORS.red : COLORS.text }}>{fmtUsd(subtotal)}</span>
                  <span style={{ fontSize: 17, lineHeight: 1, color: COLORS.textFaint, display: "inline-block", transform: isCol ? "none" : "rotate(90deg)", transition: "transform 0.2s ease" }}>›</span>
                </button>
                {!isCol && g.rows.map((r, i) => {
                  const o = r.available < 0;
                  const pct = r.budget > 0 ? Math.min(100, Math.round((r.spent / r.budget) * 100)) : 0;
                  const near = !o && pct >= 85;
                  const barColor = o ? COLORS.red : near ? COLORS.amber : g.meta.accent;
                  return (
                    <div key={r.label + i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px 10px 16px", borderTop: `1px solid ${COLORS.surfaceTint}`, background: o ? COLORS.redBg : "transparent" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: o ? COLORS.red : COLORS.text, flex: "0 0 88px", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
                      <span style={{ flex: 1, height: 6, borderRadius: 4, background: COLORS.surfaceTint, overflow: "hidden", minWidth: 0 }}>
                        <span style={{ display: "block", height: "100%", width: `${o ? 100 : pct}%`, borderRadius: 4, background: barColor }} />
                      </span>
                      <span style={{ flex: "0 0 56px", textAlign: "right", fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: o ? COLORS.red : r.available > 0 ? COLORS.green : COLORS.textFaint }}>{fmtUsd(r.available)}</span>
                      <button onClick={() => onLog(r.label)} aria-label={`Log to ${r.label}`} style={{ flex: "0 0 26px", display: "grid", placeItems: "center", background: "transparent", border: "none", cursor: "pointer", color: COLORS.accent, fontFamily: FONT, fontSize: 19, fontWeight: 800, lineHeight: 1 }}>
                        ＋
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* MONEY AT A GLANCE */}
      <div>
        {secLabel("Money at a glance", null)}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { l: "Net worth", n: fmtUsd(money.networth, { compact: true }), d: "Tap to drill", drill: "networth", c: COLORS.text },
            { l: "Rentals NOI", n: fmtUsd(money.noi, { compact: true }), d: money.opsCount === 1 ? "1 operating" : `${money.opsCount} operating`, drill: "rentals", c: money.noi >= 0 ? COLORS.green : COLORS.red },
            { l: "Mom's loan", n: money.momNet == null ? "—" : fmtUsd(Math.abs(money.momNet), { compact: true }), d: money.momNet == null ? "not tracked" : money.momNet > 0 ? "owed to you" : "you owe", drill: "mom", c: COLORS.text },
            { l: "HELOC", n: money.heloc == null ? "—" : fmtUsd(money.heloc, { compact: true }), d: "balance", drill: "heloc", c: COLORS.purple },
          ].map((m) => (
            <button key={m.l} onClick={() => setDrill && setDrill(m.drill)} style={{ ...STYLES.card, padding: 14, textAlign: "left", cursor: "pointer", fontFamily: FONT }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: COLORS.textFaint }}>{m.l}</div>
              <div style={{ marginTop: 4, fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", color: m.c, fontVariantNumeric: "tabular-nums" }}>{m.n}</div>
              <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted }}>{m.d}</div>
            </button>
          ))}
        </div>
      </div>

      {/* INSIGHT */}
      {insight && (
        <div>
          {secLabel("Heads up", null)}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderRadius: RADII.lg, background: insight.kind === "good" ? COLORS.accentSoft : COLORS.amberBg, border: `1px solid ${insight.kind === "good" ? COLORS.accentSoft : COLORS.amberBg}` }}>
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{insight.kind === "good" ? "💡" : "⚠️"}</span>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text, lineHeight: 1.5 }}>{insight.text}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const DASHBOARD_TILE_DEFS = [
  { id: "balances",     defaultLabel: "Envelope balances",  basic: true,  full: true  },
  { id: "quickactions", defaultLabel: "Log & move",         basic: true,  full: true  },
  { id: "attention",    defaultLabel: "Needs attention",    basic: true,  full: true  },
  { id: "hero",         defaultLabel: "This month",         basic: true,  full: true  },
  { id: "yir",          defaultLabel: "Year in review",     basic: false, full: true  },
  { id: "insights",     defaultLabel: "What's happening",   basic: false, full: true  },
  { id: "stats",        defaultLabel: "Stats",              basic: false, full: true  },
  { id: "todays",       defaultLabel: "Today's habits",     basic: false, full: true  },
  { id: "cashflow",     defaultLabel: "Cash flow",          basic: false, full: true  },
  { id: "heatmap",      defaultLabel: "Spending heatmap",   basic: false, full: true  },
  { id: "month",        defaultLabel: "Month picker",       basic: true,  full: true  },
  { id: "actions",      defaultLabel: "Quick actions",      basic: true,  full: false },
  { id: "rentals",      defaultLabel: "Rentals",            basic: false, full: true,  group: "category" },
  { id: "networth",     defaultLabel: "Net Worth",          basic: false, full: true,  group: "category" },
  { id: "heloc",        defaultLabel: "HELOC Velocity",     basic: false, full: true,  group: "category" },
  { id: "mom",          defaultLabel: "Mom's Loan",         basic: false, full: true,  group: "category" },
  { id: "achievements", defaultLabel: "Achievements",       basic: false, full: true  },
];

// Group consecutive same-group tiles into runs so they render inside
// the same grid container in view mode.
function groupTileRuns(tiles) {
  const runs = [];
  for (const tile of tiles) {
    const last = runs[runs.length - 1];
    if (tile.group && last && last.group === tile.group) last.items.push(tile);
    else runs.push({ group: tile.group || null, items: [tile] });
  }
  return runs;
}

function DashboardLayout({
  state,
  updateState,
  hero,
  streaks,
  achievements,
  activeMonth,
  setActiveMonth,
  setActiveSection,
  setDrill,
  setToast,
  onLog,
  isBasic,
  pending,
  editingLayout,
  setEditingLayout,
}) {
  const isMobile = useIsMobile();
  const tileRenderers = useMemo(() => ({
    balances: <EnvelopesGlance state={state} activeMonth={activeMonth} onOpen={() => setActiveSection("envelopes")} />,
    quickactions: <QuickActionsRow onLog={onLog} onMove={() => setActiveSection("envelopes")} />,
    attention: <NeedsAttention state={state} activeMonth={activeMonth} onOpen={onLog} />,
    hero: (
      <HeroNumber
        hero={hero}
        mode={state.settings.hero_mode}
        state={state}
        onModeChange={(mode) =>
          updateState((s) => ({ ...s, settings: { ...s.settings, hero_mode: mode } }))
        }
      />
    ),
    yir:          <YearInReviewStrip state={state} />,
    insights:     <InsightsPanel state={state} />,
    stats: (
      <HabitsStrip
        streaks={streaks}
        achievements={achievements}
        netWorth={computeNetWorthCents(state)}
        savingsThisMonth={hero.conservative}
      />
    ),
    todays:       <TodaysHabitsBanner state={state} onJump={() => setActiveSection("habits")} />,
    cashflow:     <CashFlowForecastPanel state={state} />,
    heatmap:      <SpendingHeatmapPanel state={state} />,
    month:        <MonthScrubber value={activeMonth} onChange={setActiveMonth} />,
    actions: (
      <BasicQuickActions
        onEnvelopes={() => setActiveSection("envelopes")}
        onGoals={() => setActiveSection("goals")}
      />
    ),
    rentals:  <RentalsTile  state={state} onClick={() => setDrill("rentals")} />,
    networth: <NetWorthTile state={state} onClick={() => setDrill("networth")} />,
    heloc:    <HelocTile    state={state} onClick={() => setDrill("heloc")} />,
    mom: (
      <MomLoanTile
        state={state}
        onClick={() => setDrill("mom")}
        onLogPayment={() => {
          const loan = state.mom_loans[0];
          if (!loan) return;
          updateState((s) => ({
            ...s,
            mom_loans: [{
              ...loan,
              payments: [
                ...loan.payments,
                { paid_on: new Date().toISOString().slice(0, 10), amount_cents: loan.monthly_payment_cents, direction: "in" },
              ],
            }],
          }));
          setToast({ kind: "success", message: `Payment from Mom (${fmtUsd(loan.monthly_payment_cents)}) logged` });
          fireConfetti({ originY: 0.4 });
        }}
      />
    ),
    achievements: <AchievementStrip achievements={achievements} />,
  }), [state, hero, streaks, achievements, activeMonth, setActiveMonth, setActiveSection, setDrill, setToast, updateState, onLog]);

  const { orderedTiles, hiddenTiles } = useMemo(() => {
    const allowed = DASHBOARD_TILE_DEFS.filter((t) => (isBasic ? t.basic : t.full));
    const allowedSet = new Set(allowed.map((t) => t.id));
    const layout = state.settings.dashboard_layout || {};
    const userOrder = layout.order || [];
    const labels = layout.labels || {};
    const hiddenSet = new Set(layout.hidden || []);
    const seen = new Set();
    const orderedIds = [];
    for (const id of userOrder) {
      if (allowedSet.has(id) && !seen.has(id)) { orderedIds.push(id); seen.add(id); }
    }
    // Tiles the user hasn't explicitly placed slot in at their canonical
    // position from DASHBOARD_TILE_DEFS — so a new tile lands where it's
    // meant to (e.g. first), not dumped at the end of a custom layout.
    allowed.forEach((t, idx) => {
      if (seen.has(t.id)) return;
      let insertAt = 0;
      for (let i = idx - 1; i >= 0; i--) {
        const pos = orderedIds.indexOf(allowed[i].id);
        if (pos >= 0) { insertAt = pos + 1; break; }
      }
      orderedIds.splice(insertAt, 0, t.id);
      seen.add(t.id);
    });
    // Pin the redesign spine: "Log & move" + "Needs attention" always
    // sit directly under the hero (balances), no matter what's in a saved
    // custom order. Insert attention first, then quickactions, so the
    // final order reads balances -> quickactions -> attention.
    ["attention", "quickactions"].forEach((id) => {
      const from = orderedIds.indexOf(id);
      if (from < 0) return;
      orderedIds.splice(from, 1);
      const anchor = orderedIds.indexOf("balances");
      orderedIds.splice(anchor >= 0 ? anchor + 1 : 0, 0, id);
    });
    const decorate = (id) => {
      const def = allowed.find((t) => t.id === id);
      const customLabel = labels[id];
      return {
        id,
        defaultLabel: def.defaultLabel,
        group: def.group || null,
        label: customLabel || def.defaultLabel,
        customLabel: customLabel && customLabel !== def.defaultLabel ? customLabel : null,
      };
    };
    return {
      orderedTiles: orderedIds.filter((id) => !hiddenSet.has(id)).map(decorate),
      hiddenTiles: orderedIds.filter((id) => hiddenSet.has(id)).map(decorate),
    };
  }, [state.settings.dashboard_layout, isBasic]);

  const handleReorder = useCallback((next) => {
    updateState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        dashboard_layout: { ...(s.settings.dashboard_layout || {}), order: next.map((t) => t.id) },
      },
    }));
  }, [updateState]);

  const handleLabelChange = useCallback((id, value) => {
    updateState((s) => {
      const prev = s.settings.dashboard_layout || {};
      const labels = { ...(prev.labels || {}) };
      const def = DASHBOARD_TILE_DEFS.find((t) => t.id === id);
      const trimmed = (value || "").slice(0, 60);
      if (!trimmed || trimmed === def?.defaultLabel) delete labels[id];
      else labels[id] = trimmed;
      return { ...s, settings: { ...s.settings, dashboard_layout: { ...prev, labels } } };
    });
  }, [updateState]);

  const handleRemoveTile = useCallback((id) => {
    updateState((s) => {
      const prev = s.settings.dashboard_layout || {};
      const hidden = Array.from(new Set([...(prev.hidden || []), id]));
      return { ...s, settings: { ...s.settings, dashboard_layout: { ...prev, hidden } } };
    });
  }, [updateState]);

  const handleRestoreTile = useCallback((id) => {
    updateState((s) => {
      const prev = s.settings.dashboard_layout || {};
      const hidden = (prev.hidden || []).filter((x) => x !== id);
      return { ...s, settings: { ...s.settings, dashboard_layout: { ...prev, hidden } } };
    });
  }, [updateState]);

  // View mode: render runs of same-group tiles inside a grid wrapper.
  const runs = useMemo(() => groupTileRuns(orderedTiles), [orderedTiles]);

  // Phone width gets the purpose-built "This Month" screen, not the
  // configurable desktop tile grid.
  if (isMobile) {
    return (
      <ThisMonthMobile
        state={state}
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        onLog={onLog}
        onMove={() => setActiveSection("envelopes")}
        onOpenEnvelopes={() => setActiveSection("envelopes")}
        setDrill={setDrill}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes bb-tile-wiggle {
          0%, 100% { transform: rotate(-0.35deg); }
          50%      { transform: rotate(0.35deg); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          onClick={() => setEditingLayout((v) => !v)}
          aria-pressed={editingLayout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.1,
            color: editingLayout ? "#fff" : COLORS.text,
            background: editingLayout ? COLORS.accent : COLORS.surface,
            border: `1px solid ${editingLayout ? COLORS.accent : COLORS.border}`,
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: FONT,
            transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
          }}
        >
          <Icon d={editingLayout ? ICON.check : ICON.edit} size={13} />
          {editingLayout ? "Done" : "Edit layout"}
        </button>
      </div>

      {editingLayout ? (
        <>
          <SortableList
            items={orderedTiles}
            onReorder={handleReorder}
            renderItem={(tile, handleProps, isDragging) => (
              <DashboardTileFrame
                tile={tile}
                editing
                isDragging={isDragging}
                handleProps={handleProps}
                onLabelChange={(v) => handleLabelChange(tile.id, v)}
                onRemove={() => handleRemoveTile(tile.id)}
              >
                {tileRenderers[tile.id] || null}
              </DashboardTileFrame>
            )}
          />
          <HiddenTilesTray
            tiles={hiddenTiles}
            onRestore={handleRestoreTile}
          />
        </>
      ) : (
        runs.map((run, idx) => {
          if (run.group === "category") {
            return (
              <div
                key={`run-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {run.items.map((tile) => (
                  <div key={tile.id}>{tileRenderers[tile.id] || null}</div>
                ))}
              </div>
            );
          }
          return run.items.map((tile) => (
            <div key={tile.id} style={{ marginBottom: 14 }}>
              {tileRenderers[tile.id] || null}
            </div>
          ));
        })
      )}

      <div style={{ marginTop: 28, color: COLORS.textFaint, fontSize: 12, textAlign: "center" }}>
        {state.last_modified_at
          ? `Last edit ${formatRelativeTime(state.last_modified_at)} · ${pending ? "saving…" : "all changes saved"}`
          : (pending ? "saving…" : "all changes saved")}
      </div>
    </>
  );
}

function DashboardTileFrame({ tile, editing, isDragging, handleProps, onLabelChange, onRemove, children }) {
  // Local input state so typing doesn't re-render the whole dashboard
  // on every keystroke. Commit to the persisted layout on blur or Enter.
  const [draft, setDraft] = useState(tile.label);
  const [focused, setFocused] = useState(false);
  useEffect(() => { setDraft(tile.label); }, [tile.label]);

  if (!editing) {
    return <div style={{ marginBottom: 14 }}>{children}</div>;
  }

  // Per-tile random wiggle offset so they don't all sway in lockstep.
  // Deterministic from the id so it doesn't reshuffle every render.
  const seed = tile.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const delay = ((seed % 30) / 100).toFixed(2);

  return (
    <div
      style={{
        marginBottom: 14,
        animation: isDragging ? "none" : `bb-tile-wiggle 1.4s ease-in-out ${delay}s infinite`,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 6px",
          marginBottom: 6,
          minHeight: 24,
        }}
      >
        <DragHandle handleProps={handleProps} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (draft !== tile.label) onLabelChange(draft); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.currentTarget.blur(); }
            if (e.key === "Escape") { setDraft(tile.label); e.currentTarget.blur(); }
          }}
          placeholder={tile.defaultLabel}
          aria-label={`Rename ${tile.defaultLabel}`}
          maxLength={60}
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: -0.1,
            color: COLORS.text,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "2px 4px",
            borderBottom: `1px solid ${focused ? COLORS.accent : "transparent"}`,
            transition: "border-color 0.15s ease",
            fontFamily: FONT,
          }}
        />
        <Icon d={ICON.edit} size={12} color={COLORS.textFaint} />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${tile.defaultLabel}`}
          title="Remove from dashboard"
          style={{
            width: 22,
            height: 22,
            padding: 0,
            border: "none",
            borderRadius: "50%",
            background: "transparent",
            color: COLORS.textFaint,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            transition: "background 0.12s ease, color 0.12s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,92,74,0.12)"; e.currentTarget.style.color = "#c45c4a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
        >
          <Icon d={ICON.x} size={12} />
        </button>
      </div>

      <div
        style={{
          pointerEvents: "none",
          userSelect: "none",
          borderRadius: 18,
          boxShadow: isDragging
            ? `0 12px 28px rgba(0,0,0,0.18), 0 0 0 1px ${COLORS.accent}66`
            : `0 0 0 1px ${COLORS.accent}1F`,
          transition: "box-shadow 0.15s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HiddenTilesTray({ tiles, onRestore }) {
  if (!tiles || tiles.length === 0) return null;
  return (
    <div
      style={{
        marginTop: 18,
        padding: "14px 16px 16px",
        borderRadius: 14,
        background: COLORS.surfaceTint,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: COLORS.textMuted,
          marginBottom: 10,
        }}
      >
        Hidden tiles — tap to add back
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => onRestore(tile.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.text,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: FONT,
              transition: "border-color 0.12s ease, color 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.text; }}
          >
            <Icon d={ICON.plus} size={12} />
            {tile.label}
          </button>
        ))}
      </div>
    </div>
  );
}
