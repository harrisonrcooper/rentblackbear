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
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, ComposedChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid } from "recharts";

import { seedBudget } from "@/actions/budget/seed";
import { saveBudgetStateAction } from "@/actions/budget/state";

import { COLORS, FONT, STYLES, btnStyle as btn, inputStyle, textBtnStyle, stepBtnStyle, pillSelectStyle, themeStylesheet } from "./lib/tokens";
import { Icon, ICON } from "./lib/icons";
import { fmtUsd, fmtCompact, biweeklyToMonthly, yearlyToMonthly, categoryMonthly, incomeMonthly } from "./lib/money";
import { propertyMonthlyGross, propertyMonthlyExpenses, propertyMonthlyNet, computeNetWorthCents, computeHero, genId, todayISODate } from "./lib/calc";
import { GROUP_META, intensityColor, mixColors, hexToRgb } from "./lib/colors";
import { computeHelocSeries, computeHelocPlan, computeStrategies, defaultStrategyInputs } from "./lib/heloc";
import { DEFAULT_HABITS, HABIT_OWNERS, HABIT_STYLES, computeHabitStreak, buildHeatmap, buildGardenGrid, last7Days, longestStreak } from "./lib/habits";
import { ACHIEVEMENT_DEFS, TIERS, TIER_COLOR, computeAchievements, computeStreaks, fireConfetti } from "./lib/achievements";
import { formatRelativeTime, titleCase } from "./lib/time";
import { envelopeBalance, envelopeStartMonth, parseBulkPaste } from "./lib/envelopes";
import { computeAllocation, computeRetirementProjection, computeFireMetrics, defaultProjectionInputs } from "./lib/networth";
import { computePropertyAnalytics, projectPropertyROI } from "./lib/property";
import { computeForecast } from "./lib/forecast";
import { computeGoalProgress, formatEta, nextUnhitMilestone, templateToGoal, GOAL_TEMPLATES } from "./lib/goals";
import { predictCategory } from "./lib/predict";
import { nextDueDate, upcomingBills, billsHittingMonth, monthlyBillTotal, subscriptionAudit, billCalendarGrid, billPeriodKey } from "./lib/bills";
import { computeMonthlySnapshots, computeCategoryTrend, withCumulativeNet, REPORT_RANGES } from "./lib/reports";
import { buildSpendingHeatmap } from "./lib/heatmap";
import { computeOnboarding } from "./lib/onboarding";
import { computeYearStats } from "./lib/yearstats";
import { detectRecurring } from "./lib/recurring";
import { createBill } from "@/actions/budget/bills";
import { parseCSV, detectColumns, buildImportRows } from "./lib/csvImport";
import { importHistoricalActuals } from "@/actions/budget/state";
import { buildScheduleE, buildMonthlyActuals, buildHistorySnapshot, buildBills, buildFullSnapshotJSON, downloadCSV, downloadJSON, defaultFilename } from "./lib/csv";
import { useIsMobile } from "./lib/responsive";
import { DashboardSkeleton } from "./primitives/Skeleton";
import { Mascot, moodForCashflow, MASCOT_MESSAGES } from "./primitives/Mascot";
import { SortableList, DragHandle } from "./primitives/Sortable";
import { usePlaidLink } from "react-plaid-link";
import {
  createPlaidLinkToken,
  exchangePlaidPublicToken,
  syncPlaidTransactions,
  refreshPlaidBalances,
  disconnectPlaidItem,
  importPlaidTransaction,
  dismissPlaidTransaction,
  undoPlaidTransaction,
} from "@/actions/budget/plaid";
import {
  addCategorizationRule,
  updateCategorizationRule,
  deleteCategorizationRule,
} from "@/actions/budget/rules";
import { describeRule } from "./lib/rules";

// ── Top-level component ──────────────────────────────────────────────
// All tokens, icons, money/calc/habit/achievement/heloc helpers, and
// time formatters live in ./lib/* and ./primitives/* — imported above.

export default function BudgetClient({ initialState, userId }) {
  const [state, setState] = useState(initialState);
  const [activeMonth, setActiveMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [drill, setDrill] = useState(null); // 'personal' | 'rentals' | 'networth' | 'heloc' | 'mom' | null
  const [activeSection, setActiveSection] = useState("dashboard"); // 'dashboard' | 'envelopes' | 'habits' | 'goals' | 'achievements' | 'settings'
  const [fabOpen, setFabOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState(null); // { kind, message }
  const [seeding, setSeeding] = useState(false);

  // Global keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if (e.key === "Escape") { setDrill(null); setFabOpen(false); }
      if (e.key === "+" || (e.key === "n" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); setFabOpen(true); }
      if (e.key === "1") setDrill("personal");
      if (e.key === "2") setDrill("rentals");
      if (e.key === "3") setDrill("networth");
      if (e.key === "4") setDrill("heloc");
      if (e.key === "5") setDrill("mom");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-clear toast after 6s.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const hasData = state.categories.length > 0 || state.properties.length > 0;

  // Debounced save — every state mutation persists 400ms later.
  const saveTimer = useRef(null);
  const persistState = useCallback((nextState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        const res = await saveBudgetStateAction(nextState);
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

  // ── Hero number math ────────────────────────────────────────────────

  const hero = useMemo(() => computeHero(state), [state]);

  const streaks = useMemo(() => computeStreaks(state), [state]);
  const achievements = useMemo(() => computeAchievements(state), [state]);
  const achievementsUnlocked = achievements.filter((a) => a.unlocked).length;
  const isMobile = useIsMobile();

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

  // Theme switcher — resolves "system" → "light" | "dark" via
  // prefers-color-scheme, then writes the result to a scoped wrapper
  // attribute. Stays off <html> so the rentblackbear shell's own
  // data-theme system (in app/layout.jsx + app/globals.css) is
  // untouched when the user is on this page.
  const themeChoice = state.settings.theme || "system";
  const [resolvedTheme, setResolvedTheme] = useState("light");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (themeChoice !== "system") {
      setResolvedTheme(themeChoice);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolvedTheme(mq.matches ? "dark" : "light");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [themeChoice]);

  return (
    <div data-bb-theme={resolvedTheme} style={STYLES.page}>
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
        /* iOS Safari polish */
        body, button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 899px) {
          /* Prevent iOS Safari's auto-zoom on input focus when font-size < 16px */
          input[type=number], input[type=text], input[type=date], input[type=email], textarea, select {
            font-size: 16px !important;
          }
          /* Touch devices have no hover — keep delete + stepper affordances visible */
          .bb-step-btn { opacity: 0.5 !important; }
          .bb-row:hover .bb-step-btn { opacity: 1 !important; }
          /* Larger tap targets on mobile */
          button, [role="button"] { min-height: 32px; }
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
            profiles={state.profiles || []}
            activeProfileId={state.active_profile_id}
            onProfileChange={(id) => updateState((s) => ({ ...s, active_profile_id: id }))}
          />
        )}
        <div style={{ flex: 1, minWidth: 0, paddingBottom: hasData && isMobile ? "calc(72px + env(safe-area-inset-bottom))" : 0 }}>
          <BudgetHeader pending={pending} />

          <main id="bb-main" style={STYLES.inner}>
            {!hasData ? (
              <EmptyState onStart={handleSeed} seeding={seeding} />
            ) : activeSection === "envelopes" ? (
              <EnvelopesView state={state} updateState={updateState} activeMonth={activeMonth} setActiveMonth={setActiveMonth} />
            ) : activeSection === "bills" ? (
              <BillsView state={state} updateState={updateState} />
            ) : activeSection === "banking" ? (
              <BankingView state={state} updateState={updateState} />
            ) : activeSection === "habits" ? (
              <HabitsView state={state} updateState={updateState} />
            ) : activeSection === "goals" ? (
              <GoalsView state={state} updateState={updateState} />
            ) : activeSection === "achievements" ? (
              <AchievementsGridView achievements={achievements} streaks={streaks} />
            ) : activeSection === "reports" ? (
              <ReportsView state={state} />
            ) : activeSection === "settings" ? (
              <SettingsView state={state} updateState={updateState} />
            ) : (
              <>
                <OnboardingChecklist
                  state={state}
                  onJump={setActiveSection}
                  onDismiss={() => updateState((s) => ({ ...s, settings: { ...s.settings, onboarding_dismissed: true } }))}
                />

                <HeroNumber
                  hero={hero}
                  mode={state.settings.hero_mode}
                  onModeChange={(mode) =>
                    updateState((s) => ({ ...s, settings: { ...s.settings, hero_mode: mode } }))
                  }
                />

                <YearInReviewStrip state={state} />

                <HabitsStrip
                  streaks={streaks}
                  achievements={achievements}
                  netWorth={computeNetWorthCents(state)}
                  savingsThisMonth={hero.conservative}
                />

                <TodaysHabitsBanner state={state} onJump={() => setActiveSection("habits")} />

                <UpcomingBillsBanner state={state} onJump={() => setActiveSection("bills")} />

                <CashFlowForecastPanel state={state} />

                <SpendingHeatmapPanel state={state} />

                <MonthScrubber value={activeMonth} onChange={setActiveMonth} />

                <TileGrid>
              <PersonalTile
                state={state}
                onClick={() => setDrill("personal")}
              />
              <RentalsTile
                state={state}
                onClick={() => setDrill("rentals")}
              />
              <NetWorthTile
                state={state}
                onClick={() => setDrill("networth")}
              />
              <HelocTile
                state={state}
                onClick={() => setDrill("heloc")}
              />
              <MomLoanTile
                state={state}
                onClick={() => setDrill("mom")}
                onLogPayment={() => {
                  const loan = state.mom_loans[0];
                  if (!loan) return;
                  updateState((s) => ({
                    ...s,
                    mom_loans: [{ ...loan, payments: [...loan.payments, { paid_on: new Date().toISOString().slice(0, 10), amount_cents: loan.monthly_payment_cents }] }],
                  }));
                  setToast({ kind: "success", message: `Payment of ${fmtUsd(loan.monthly_payment_cents)} logged` });
                  fireConfetti({ originY: 0.4 });
                }}
              />
            </TileGrid>

                <AchievementStrip achievements={achievements} />

                <div style={{ marginTop: 28, color: COLORS.textFaint, fontSize: 12, textAlign: "center" }}>
                  {state.last_modified_at
                    ? `Last edit ${formatRelativeTime(state.last_modified_at)} · ${pending ? "saving…" : "all changes saved"}`
                    : (pending ? "saving…" : "all changes saved")}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {drill && (
        <DrillSheet onClose={() => setDrill(null)}>
          {drill === "personal" && <PersonalDrill state={state} updateState={updateState} />}
          {drill === "rentals" && <RentalsDrill state={state} updateState={updateState} />}
          {drill === "networth" && <NetWorthDrill state={state} updateState={updateState} />}
          {drill === "heloc" && <HelocDrill state={state} updateState={updateState} />}
          {drill === "mom" && <MomLoanDrill state={state} updateState={updateState} />}
        </DrillSheet>
      )}

      {toast && <Toast kind={toast.kind} message={toast.message} onDismiss={() => setToast(null)} />}

      {quickAddOpen && (
        <QuickAddSheet
          state={state}
          onClose={() => setQuickAddOpen(false)}
          onSubmit={(entry) => {
            updateState((s) => ({
              ...s,
              monthly_actuals: [
                ...(s.monthly_actuals || []),
                entry,
              ],
            }));
            fireConfetti({ count: 40, originY: 0.45 });
            setToast({ kind: "success", message: `Logged ${fmtUsd(entry.amount_cents)} to ${entry.category_label}` });
            setQuickAddOpen(false);
          }}
        />
      )}

      {hasData && isMobile && (
        <MobileNav
          active={activeSection}
          onChange={setActiveSection}
          achievementsUnlocked={achievementsUnlocked}
          achievementsTotal={achievements.length}
          streak={streaks.trackedStreak}
        />
      )}

      {hasData && (
        <>
          <FAB onClick={() => setFabOpen(true)} bottomOffset={isMobile ? 84 : 24} />
          {fabOpen && (
            <FABMenu
              onClose={() => setFabOpen(false)}
              items={[
                { icon: ICON.plus,      label: "Log expense (smart)", onClick: () => setQuickAddOpen(true) },
                { icon: ICON.family,    label: "Personal expense", onClick: () => setDrill("personal") },
                { icon: ICON.arrowUp,   label: "Income source",    onClick: () => setDrill("personal") },
                { icon: ICON.building,  label: "Property line",    onClick: () => setDrill("rentals") },
                { icon: ICON.scales,    label: "Asset / debt",     onClick: () => setDrill("networth") },
                ...(state.mom_loans[0] ? [{
                  icon: ICON.home,
                  label: `Log Mom's ${fmtUsd(state.mom_loans[0].monthly_payment_cents, { compact: true })} payment`,
                  onClick: () => {
                    const loan = state.mom_loans[0];
                    updateState((s) => ({
                      ...s,
                      mom_loans: [{ ...loan, payments: [...loan.payments, { paid_on: new Date().toISOString().slice(0, 10), amount_cents: loan.monthly_payment_cents }] }],
                    }));
                    setToast({ kind: "success", message: "Mom's payment logged" });
                    fireConfetti({ originY: 0.4 });
                  },
                }] : []),
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}

// Quick-add log-an-expense modal. Predicts the category from the
// description, supports voice input on browsers that ship the Web
// Speech API (Chrome/Edge desktop, recent iOS Safari). Falls back
// gracefully when SpeechRecognition isn't available.
function QuickAddSheet({ state, onClose, onSubmit }) {
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const monthISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidOn, setPaidOn] = useState(todayISO);
  const [manualCategoryLabel, setManualCategoryLabel] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Live prediction. User can override via the dropdown.
  const predicted = useMemo(() => predictCategory(description, state.categories || []), [description, state.categories]);
  const chosenLabel = manualCategoryLabel ?? predicted?.label ?? "";

  // Web Speech API setup — feature-detected, browser-prefixed.
  const speechSupported = typeof window !== "undefined"
    && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleListening = useCallback(() => {
    if (!speechSupported) return;
    if (listening) {
      try { recognitionRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ")
        .trim();
      setDescription(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }, [listening, speechSupported]);

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch {}
  }, []);

  const commit = () => {
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0) return;
    if (!chosenLabel) return;
    onSubmit({
      id: genId(),
      category_label: chosenLabel,
      month: monthISO,
      paid_on: paidOn,
      amount_cents: Math.round(n * 100),
      note: description.trim() || undefined,
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(15,23,41,0.55)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface, borderRadius: 24,
          width: "100%", maxWidth: 460, maxHeight: "calc(100vh - 40px)",
          boxShadow: "0 24px 80px rgba(15,23,41,0.32)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{
          padding: "18px 20px 14px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Log an expense</div>
            <div style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>
              We'll guess the category from what you type.
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

        <div style={{ padding: 20, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Amount</div>
            <input
              autoFocus
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
              aria-label="Amount"
              style={{
                ...inputStyle(), width: "100%",
                fontSize: 32, fontWeight: 800, padding: "10px 14px",
                fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</div>
              {predicted && !manualCategoryLabel && (
                <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.accent }}>
                  → {predicted.label}
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="e.g. costco run, shell gas, spotify"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
                aria-label="Description"
                style={{ ...inputStyle(), width: "100%", paddingRight: speechSupported ? 44 : 12, fontSize: 16, padding: "10px 14px", fontWeight: 600 }}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  aria-label={listening ? "Stop voice input" : "Start voice input"}
                  title={listening ? "Tap to stop" : "Voice input"}
                  style={{
                    position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                    width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                    background: listening ? COLORS.red : COLORS.surfaceTint,
                    color: listening ? "#fff" : COLORS.textMuted,
                    display: "grid", placeItems: "center",
                    transition: "all 0.15s ease",
                    animation: listening ? "bb-pulse 1s ease-in-out infinite" : "none",
                  }}
                >
                  <Icon d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 11a7 7 0 0 1-14 0 M12 18v3 M8 21h8" size={14} />
                </button>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Category</div>
            <select
              value={chosenLabel}
              onChange={(e) => setManualCategoryLabel(e.target.value)}
              aria-label="Category"
              style={{ ...inputStyle(), width: "100%", fontSize: 16, padding: "10px 14px", fontWeight: 600 }}
            >
              <option value="">— pick a category —</option>
              {(state.categories || [])
                .slice()
                .sort((a, b) => (a.group_key || "").localeCompare(b.group_key || ""))
                .map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.group_key ? `${c.group_key} · ` : ""}{c.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>When</div>
            <input
              type="date"
              value={paidOn}
              onChange={(e) => setPaidOn(e.target.value)}
              aria-label="Paid on"
              style={{ ...inputStyle(), width: "100%", fontSize: 16, padding: "10px 14px", fontWeight: 600 }}
            />
          </div>
        </div>

        <div style={{
          padding: "12px 20px", borderTop: `1px solid ${COLORS.surfaceTint}`,
          display: "flex", gap: 8,
        }}>
          <button onClick={onClose} style={{ ...btn("ghost"), flex: 1 }}>Cancel</button>
          <button
            onClick={commit}
            disabled={!amount || !chosenLabel}
            style={{
              ...btn("primary"), flex: 2,
              opacity: (!amount || !chosenLabel) ? 0.5 : 1,
            }}
          >
            <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
            Log {amount ? fmtUsd(Math.round((parseFloat(amount) || 0) * 100)) : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function FABMenu({ onClose, items }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 38, background: "rgba(15,23,41,0.18)", animation: "fadeIn 0.18s ease" }} />
      <div style={{
        position: "fixed", bottom: 92, right: 24, zIndex: 39,
        background: COLORS.surface,
        borderRadius: 18,
        boxShadow: "0 18px 48px rgba(13,20,36,0.32)",
        padding: 8, minWidth: 240,
        fontFamily: FONT,
        animation: "slideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 10px 8px" }}>
          Quick add
        </div>
        {items.map((item, i) => (
          <button key={i} onClick={() => { item.onClick(); onClose(); }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              width: "100%", padding: "10px 12px", borderRadius: 10,
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, color: COLORS.text,
              textAlign: "left",
              fontFamily: FONT,
              transition: "background 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceTint; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: COLORS.surfaceTint, color: COLORS.textMuted,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Icon d={item.icon} size={14} />
            </div>
            {item.label}
          </button>
        ))}
      </div>
    </>
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

function HeroNumber({ hero, mode, onModeChange }) {
  const value = hero[mode];
  const isZero = value === 0;
  const positive = value > 0;
  const valueColor = isZero ? COLORS.text : positive ? COLORS.green : COLORS.red;
  const sign = isZero ? "" : positive ? "+" : "−";
  const totalIn = hero.incomeMonthlyTotal + hero.rentalGross;
  const totalOut = hero.personalMonthlyTotal + hero.rentalExpensesWithReserves + hero.businessMonthlyTotal;
  const mood = moodForCashflow(value);
  const messages = MASCOT_MESSAGES[mood] || MASCOT_MESSAGES.neutral;
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
            padding: "8px 14px",
            borderRadius: 100,
            border: m.current ? `1px solid ${COLORS.text}` : `1px solid ${COLORS.border}`,
            background: m.current ? COLORS.text : COLORS.surface,
            color: m.current ? "#fff" : COLORS.textMuted,
            fontSize: 12, fontWeight: 700,
            cursor: "pointer",
            scrollSnapAlign: "center",
            transition: "all 0.15s ease",
          }}
        >
          {m.label} <span style={{ opacity: 0.7, fontWeight: 500 }}>{String(year).slice(2)}</span>
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

function PersonalTile({ state, onClick }) {
  const totalIn = state.income_sources.reduce((s, i) => s + incomeMonthly(i), 0);
  const totalOut = state.categories.reduce((s, c) => s + categoryMonthly(c), 0);
  const left = totalIn - totalOut;
  const history = (state.history || []).slice(-30).map((h) => h.personal_monthly_cents);
  return (
    <Tile
      title="Personal"
      icon={ICON.family}
      iconColor={COLORS.blue} iconBg={COLORS.blueBg}
      primary={<AnimatedNumber value={left} format={(v) => fmtUsd(v, { compact: true })} />}
      primaryColor={left >= 0 ? COLORS.text : COLORS.red}
      secondary={`${fmtUsd(totalIn, { compact: true })} in · ${fmtUsd(totalOut, { compact: true })} out`}
      footer={`${state.categories.length} categories`}
      onClick={onClick}
      sparkline={<Sparkline values={history} />}
    />
  );
}

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
  const paid = loan.payments.reduce((s, p) => s + p.amount_cents, 0);
  const remaining = loan.starting_balance_cents - paid;
  const pct = loan.starting_balance_cents > 0 ? (paid / loan.starting_balance_cents) * 100 : 0;
  return (
    <Tile
      title="Mom's Loan"
      icon={ICON.home}
      iconColor={COLORS.amber} iconBg={COLORS.amberBg}
      primary={<AnimatedNumber value={remaining} format={(v) => fmtUsd(v, { compact: true })} />}
      primaryColor={remaining > 0 ? COLORS.text : COLORS.green}
      secondary={`${pct.toFixed(0)}% paid · ${loan.payments.length} payment${loan.payments.length === 1 ? "" : "s"}`}
      footer={`${fmtUsd(loan.monthly_payment_cents, { compact: true })} / mo · due day ${loan.due_day ?? 1}`}
      onClick={onClick}
      action={remaining > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onLogPayment(); }}
          style={{
            padding: "5px 10px", borderRadius: 100,
            background: COLORS.amber, color: "#fff",
            border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
            fontFamily: FONT,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
        >
          Pay {fmtUsd(loan.monthly_payment_cents, { compact: true })}
        </button>
      )}
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
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(15,23,41,0.55)",
        backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface,
          width: "100%",
          maxWidth: 720,
          maxHeight: "calc(100vh - 40px)",
          borderRadius: 24,
          boxShadow: "0 24px 80px rgba(15,23,41,0.28)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          fontFamily: FONT,
          color: COLORS.text,
          animation: "slideUp 0.25s ease",
        }}
      >
        <div style={{
          position: "sticky", top: 0,
          display: "flex", justifyContent: "flex-end",
          padding: "14px 16px 0",
          background: COLORS.surface,
          zIndex: 1,
        }}>
          <button onClick={onClose} aria-label="Close" style={{
            width: 34, height: 34, borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer",
            background: COLORS.surface, color: COLORS.textMuted, display: "grid", placeItems: "center",
            transition: "all 0.12s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceAlt; e.currentTarget.style.color = COLORS.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textMuted; }}
          >
            <Icon d={ICON.x} size={16} />
          </button>
        </div>
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "8px 24px 28px",
          WebkitOverflowScrolling: "touch",
        }}>
          {children}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      ` }} />
    </div>
  );
}

// ── Drills (v1: read-only summaries with edit-on-next-iteration stubs) ─

function PersonalDrill({ state, updateState }) {
  const grouped = useMemo(() => {
    const g = {};
    for (const c of state.categories) {
      const key = c.group_key || "other";
      (g[key] = g[key] || []).push(c);
    }
    return g;
  }, [state.categories]);
  const total = state.categories.reduce((s, c) => s + categoryMonthly(c), 0);
  const incomeMo = state.income_sources.reduce((s, i) => s + incomeMonthly(i), 0);
  const left = incomeMo - total;

  // Build a stacked breakdown of expense groups (in proportion of total).
  const breakdown = useMemo(() => {
    if (total === 0) return [];
    const order = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
    return order
      .map((g) => {
        const items = grouped[g];
        if (!items || items.length === 0) return null;
        const sum = items.reduce((s, c) => s + categoryMonthly(c), 0);
        if (sum === 0) return null;
        return {
          label: GROUP_META[g]?.label || g,
          color: GROUP_META[g]?.accent || COLORS.textMuted,
          pct: (sum / total) * 100,
          value: fmtCompact(sum),
        };
      })
      .filter(Boolean);
  }, [grouped, total]);

  return (
    <div>
      <DrillTitle
        title="Personal"
        subtitle={`${state.categories.length} categories · ${incomeMo > 0 ? `${fmtUsd(left, { compact: true })} left after expenses` : "income not set"}`}
        icon={ICON.family}
        iconColor={COLORS.blue}
        iconBg={COLORS.blueBg}
        heroValue={fmtUsd(total)}
        heroLabel="/ month"
      />
      {breakdown.length > 0 && (
        <div style={{
          ...STYLES.card,
          padding: 18, marginBottom: 14,
          display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)",
          gap: 18, alignItems: "center",
        }}>
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <PieChart width={140} height={140}>
              <Pie data={breakdown.map((b) => ({ name: b.label, value: b.pct }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={2} strokeWidth={0}>
                {breakdown.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Pie>
              <RTooltip cursor={false} contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "6px 10px", fontFamily: FONT }}
                formatter={(v, n) => [`${v.toFixed(0)}%`, n]} />
            </PieChart>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", pointerEvents: "none",
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em" }}>{fmtCompact(total)}</div>
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
      <PersonalEditor state={state} updateState={updateState} grouped={grouped} />
    </div>
  );
}

function PersonalEditor({ state, updateState, grouped }) {
  const groupOrder = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
  // Show groups that have items first, then any "common" empty groups (so
  // user can still add a Housing line if they don't have one yet) — but
  // don't show empty groups for unusual categories like "other".
  const populated = groupOrder.filter((g) => (grouped[g] || []).length > 0);
  const emptyCommon = groupOrder.filter((g) => !(grouped[g] && grouped[g].length) && ["housing", "food", "personal"].includes(g));
  const allToShow = [...populated, ...emptyCommon];
  return (
    <div style={{ display: "grid", gap: 14, marginTop: 6 }}>
      <IncomeSourcesBlock state={state} updateState={updateState} />
      {allToShow.map((g) => (
        <CategoryGroup
          key={g}
          group={g}
          items={grouped[g] || []}
          onChange={(id, patch) => updateState((s) => ({
            ...s,
            categories: s.categories.map((c) => c.label === id ? { ...c, ...patch } : c),
          }))}
          onRename={(oldLabel, newLabel) => updateState((s) => ({
            ...s,
            categories: s.categories.map((c) => c.label === oldLabel ? { ...c, label: newLabel } : c),
            monthly_actuals: s.monthly_actuals.map((a) => a.category_label === oldLabel ? { ...a, category_label: newLabel } : a),
          }))}
          onAdd={() => updateState((s) => ({
            ...s,
            categories: [
              ...s.categories,
              {
                label: `New ${GROUP_META[g]?.label || g} item`,
                group_key: g,
                default_monthly_cents: 0,
                default_biweekly_cents: 0,
                default_yearly_cents: 0,
                sort_order: (grouped[g]?.length || 0),
              },
            ],
          }))}
          onDelete={(label) => updateState((s) => ({
            ...s,
            categories: s.categories.filter((c) => c.label !== label),
            monthly_actuals: s.monthly_actuals.filter((a) => a.category_label !== label),
          }))}
        />
      ))}
      <YearlyExpensesBlock state={state} updateState={updateState} />
    </div>
  );
}

const YEARLY_CATEGORIES = [
  { id: "insurance",    label: "insurance"    },
  { id: "tax",          label: "tax"          },
  { id: "subscription", label: "subscription" },
  { id: "other",        label: "other"        },
];

const MONTH_OPTIONS = [
  { id: "", label: "—" },
  { id: 1, label: "Jan" }, { id: 2, label: "Feb" }, { id: 3, label: "Mar" },
  { id: 4, label: "Apr" }, { id: 5, label: "May" }, { id: 6, label: "Jun" },
  { id: 7, label: "Jul" }, { id: 8, label: "Aug" }, { id: 9, label: "Sep" },
  { id: 10, label: "Oct" }, { id: 11, label: "Nov" }, { id: 12, label: "Dec" },
];

function YearlyExpensesBlock({ state, updateState }) {
  const list = state.yearly_expenses || [];
  const yearlyTotal = list.reduce((s, y) => s + y.yearly_amount_cents, 0);
  const update = (idx, patch) => updateState((s) => ({
    ...s,
    yearly_expenses: s.yearly_expenses.map((y, i) => i === idx ? { ...y, ...patch } : y),
  }));
  return (
    <BlockCard
      title="Paid Yearly"
      sub={`${fmtCompact(yearlyTotal)} / yr`}
      accent={GROUP_META.yearly.accent}
      icon={GROUP_META.yearly.icon}
      count={`${list.length}`}
    >
      {list.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
          Big once-a-year bills — car insurance, property taxes, prime, the stuff that surprises you.
        </div>
      )}
      {list.map((y, idx) => (
        <div key={idx} className="bb-row" style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto auto 22px",
          gap: 10, alignItems: "center", padding: "9px 4px",
        }}>
          <InlineText value={y.label} onChange={(v) => update(idx, { label: v })} />
          <select
            value={y.category || "other"}
            onChange={(e) => update(idx, { category: e.target.value })}
            aria-label="Category"
            style={pillSelectStyle()}
          >
            {YEARLY_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select
            value={y.due_month ?? ""}
            onChange={(e) => update(idx, { due_month: e.target.value === "" ? null : Number(e.target.value) })}
            aria-label="Due month"
            style={pillSelectStyle()}
          >
            {MONTH_OPTIONS.map((m) => <option key={String(m.id)} value={m.id}>{m.label}</option>)}
          </select>
          <InlineNumber value={y.yearly_amount_cents} onChange={(v) => update(idx, { yearly_amount_cents: v })} width={120} />
          <button
            onClick={() => updateState((s) => ({ ...s, yearly_expenses: s.yearly_expenses.filter((_, i) => i !== idx) }))}
            aria-label="Delete yearly expense"
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
        label="Add yearly expense"
        accent={GROUP_META.yearly.accent}
        onClick={() => updateState((s) => ({
          ...s,
          yearly_expenses: [
            ...(s.yearly_expenses || []),
            { label: "New yearly item", yearly_amount_cents: 0, due_month: null, category: "other", sort_order: (s.yearly_expenses || []).length },
          ],
        }))}
      />
    </BlockCard>
  );
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
      className="bb-row bb-row-income"
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

function CategoryGroup({ group, items, onChange, onRename, onAdd, onDelete }) {
  const meta = GROUP_META[group] || GROUP_META.other;
  const total = items.reduce((s, c) => s + categoryMonthly(c), 0);
  return (
    <BlockCard
      title={meta.label}
      sub={total > 0 ? fmtUsd(total, { compact: true }) : null}
      accent={meta.accent}
      icon={meta.icon}
      count={items.length > 0 ? `${items.length}` : null}
    >
      {items.length === 0 && (
        <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "6px 0", fontStyle: "italic" }}>
          Nothing here yet.
        </div>
      )}
      {items.map((c) => (
        <EditableRow
          key={c.label}
          label={c.label}
          monthly={categoryMonthly(c)}
          onLabelChange={(next) => onRename(c.label, next)}
          onMonthlyChange={(cents) => onChange(c.label, {
            default_monthly_cents: cents,
            default_biweekly_cents: 0,
            default_yearly_cents: 0,
          })}
          onDelete={onDelete ? () => onDelete(c.label) : undefined}
        />
      ))}
      {onAdd && <AddRowButton label="Add line" accent={meta.accent} onClick={onAdd} />}
    </BlockCard>
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
function InlineNumber({ value, onChange, width = 110 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String((value / 100).toFixed(2)));
  useEffect(() => setDraft(String((value / 100).toFixed(2))), [value]);
  return editing ? (
    <input
      autoFocus
      type="number"
      step="0.01"
      inputMode="decimal"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { setEditing(false); const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") { setDraft(String((value / 100).toFixed(2))); setEditing(false); } }}
      style={{ ...inputStyle(), width, textAlign: "right", fontVariantNumeric: "tabular-nums" }}
    />
  ) : (
    <button onClick={() => setEditing(true)} className="bb-edit-btn" style={{ ...textBtnStyle(), width, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: value === 0 ? COLORS.textFaint : COLORS.text }}>
      {fmtUsd(value)}
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
      {state.properties.length >= 2 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            onClick={() => setCompareOpen(true)}
            style={{ ...btn("ghost") }}
          >
            <Icon d={ICON.scales} size={14} />
            Compare properties
          </button>
        </div>
      )}
      {compareOpen && (
        <PropertyComparisonSheet
          state={state}
          onClose={() => setCompareOpen(false)}
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
  const exp = propertyMonthlyExpenses(property, settings);
  const noi = gross - exp;
  const statusColor = property.status === "operating" ? COLORS.green : property.status === "pipeline" ? COLORS.amber : COLORS.textMuted;
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
          <div style={{ marginTop: 4 }}>
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
          <SectionLabel>Expenses · {fmtUsd(exp)}</SectionLabel>
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
          {onAddExpense && <AddRowButton label="Add expense" onClick={onAddExpense} />}
        </div>
      </div>

      <MortgageDetails property={property} onChange={onChange} />
      <MaintenanceLog property={property} onChange={onChange} />
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
          width: "100%", maxWidth: 760, maxHeight: "calc(100vh - 40px)",
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
      borderLeft: `3px solid ${accent}`,
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

// ── Net Worth drill ──────────────────────────────────────────────────

function NetWorthDrill({ state, updateState }) {
  const propEquity = state.properties.reduce((s, p) => s + (p.market_value_cents - p.mortgage_balance_cents), 0);
  const cash = state.assets.reduce((s, a) => s + a.balance_cents, 0);
  const debt = state.debts.reduce((s, d) => s + d.balance_cents, 0);
  const total = propEquity + cash - debt;
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

        <BlockCard title="Real Estate Equity" sub={fmtCompact(propEquity)} accent={COLORS.accent} icon={ICON.building} count={`${state.properties.length}`}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(72px, 0.8fr)",
            gap: 10, padding: "6px 4px 8px",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textFaint,
            borderBottom: `1px solid ${COLORS.border}`,
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
                <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</div>
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

        <BlockCard title="Cash & Investments" sub={fmtCompact(cash)} accent={COLORS.green} icon={ICON.trending} count={`${state.assets.length}`}>
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

        <BlockCard title="Liabilities" sub={fmtCompact(debt)} accent={COLORS.red} icon={ICON.arrowDn} count={`${state.debts.length}`}>
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

        <RetirementContributionsBlock state={state} updateState={updateState} />
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
      <InlineNumber value={asset.balance_cents} onChange={(v) => onChange({ balance_cents: v })} width={120} />
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
        <InlineNumber value={debt.balance_cents} onChange={(v) => onChange({ balance_cents: v })} width={120} />
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

function RetirementContributionsBlock({ state, updateState }) {
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
      title="Retirement Contributions"
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
                value={c.year * 100}
                onChange={(v) => updateState((s) => ({
                  ...s,
                  retirement_contributions: s.retirement_contributions.map((x, i) => i === realIdx ? { ...x, year: Math.max(1970, Math.min(2200, Math.round(v / 100))) } : x),
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
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px" }}>
          <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Annual contribution</div>
          <InlineNumber
            value={annualContributionCents}
            onChange={(v) => setContribOverride(v)}
            width={120}
          />
        </div>
        <PctRow label="Expected return" bps={defaults.annualReturnBps} onChange={(v) => setS({ retirement_return_bps: v })} />
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", padding: "8px 4px" }}>
          <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Horizon (years)</div>
          <InlineNumber
            value={defaults.horizonYears * 100}
            onChange={(v) => setS({ retirement_horizon_years: Math.max(1, Math.min(80, Math.round(v / 100))) })}
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
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Financial Independence</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px", fontSize: 12.5 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>FIRE number</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginTop: 2 }}>{fmtCompact(metrics.fireNumberCents)}</div>
            <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 1 }}>{fireMultiple}× annual expenses</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>You have</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.green, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginTop: 2 }}>{fmtCompact(metrics.liquidNetWorthCents)}</div>
            <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 1 }}>liquid (cash + retirement + invest)</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Yearly expenses</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{fmtCompact(metrics.annualExpensesCents)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Years to FIRE</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: metrics.yearsToFire == null ? COLORS.textFaint : COLORS.text, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
              {metrics.yearsToFire == null ? "—" : `${metrics.yearsToFire}`}
            </div>
            <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 1 }}>at {fmtCompact(metrics.annualContributionCents)} / yr saved</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.surfaceTint}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Multiplier</span>
          <select
            value={fireMultiple}
            onChange={(e) => updateState((s) => ({ ...s, settings: { ...s.settings, fire_multiple: Number(e.target.value) } }))}
            aria-label="FIRE multiple"
            style={pillSelectStyle()}
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
          subtitle="Track a family loan with monthly payments and history"
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
  const paid = loan.payments.reduce((s, p) => s + p.amount_cents, 0);
  const remaining = loan.starting_balance_cents - paid;
  const pctPaid = loan.starting_balance_cents > 0 ? Math.min(100, (paid / loan.starting_balance_cents) * 100) : 0;
  return (
    <div>
      <DrillTitle
        title={loan.label}
        subtitle={`${loan.payments.length} payment${loan.payments.length === 1 ? "" : "s"} logged`}
        icon={ICON.home}
        iconColor={COLORS.amber}
        iconBg={COLORS.amberBg}
        heroValue={fmtUsd(remaining)}
        heroLabel={`remaining of ${fmtUsd(loan.starting_balance_cents)}`}
        heroColor={remaining > 0 ? COLORS.text : COLORS.green}
      />
      <div style={{
        ...STYLES.card, padding: 18, marginBottom: 14,
        display: "flex", alignItems: "center", gap: 18, justifyContent: "space-between",
      }}>
        <ProgressRing
          value={paid}
          max={loan.starting_balance_cents || 1}
          color={COLORS.amber}
          label={`${pctPaid.toFixed(0)}%`}
          sublabel="paid"
          size={104}
        />
        <div style={{ flex: 1, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Paid so far</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.green, fontVariantNumeric: "tabular-nums" }}>{fmtUsd(paid)}</div>
          </div>
          <button
            onClick={() => updateState((s) => ({
              ...s,
              mom_loans: [{ ...loan, payments: [...loan.payments, { paid_on: new Date().toISOString().slice(0, 10), amount_cents: loan.monthly_payment_cents }] }],
            }))}
            style={{
              ...btn("primary"),
              background: COLORS.amber,
              alignSelf: "flex-start",
            }}
          >
            <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
            Log {fmtUsd(loan.monthly_payment_cents, { compact: true })} payment
          </button>
        </div>
      </div>
      <BlockCard title="Terms" sub="" accent={COLORS.amber} icon={ICON.edit} style={{ marginTop: 6 }}>
        <InputRow label="Starting balance" value={loan.starting_balance_cents} onChange={(v) => updateState((s) => ({ ...s, mom_loans: [{ ...loan, starting_balance_cents: v }] }))} />
        <InputRow label="Monthly payment" value={loan.monthly_payment_cents} onChange={(v) => updateState((s) => ({ ...s, mom_loans: [{ ...loan, monthly_payment_cents: v }] }))} />
      </BlockCard>
      <BlockCard title="Payment history" sub={fmtUsd(paid, { compact: true })} accent={COLORS.green} icon={ICON.arrowUp} count={`${loan.payments.length}`} style={{ marginTop: 14 }}>
        {loan.payments.map((p, i) => (
          <Row key={i} label={new Date(p.paid_on).toLocaleDateString()} value={fmtUsd(p.amount_cents)} sub={p.note} />
        ))}
        <button
          onClick={() => updateState((s) => ({
            ...s,
            mom_loans: [{ ...loan, payments: [...loan.payments, { paid_on: new Date().toISOString().slice(0, 10), amount_cents: loan.monthly_payment_cents }] }],
          }))}
          style={{ ...btn("ghost"), marginTop: 12 }}
        >
          + Log {fmtUsd(loan.monthly_payment_cents)} payment today
        </button>
      </BlockCard>
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

function BlockCard({ title, sub, children, style, accent, icon, count }) {
  const accentColor = accent || COLORS.textMuted;
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      ...style,
    }}>
      {accent && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 3, background: accentColor, borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
        }} />
      )}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 10, padding: "14px 18px 10px",
        borderBottom: `1px solid ${COLORS.surfaceTint}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {icon && (
            <div style={{
              width: 26, height: 26, borderRadius: 8,
              background: accent ? `${accentColor}1F` : COLORS.surfaceTint,
              color: accentColor,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Icon d={icon} size={14} />
            </div>
          )}
          <div style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.005em" }}>{title}</div>
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
      padding: "10px 4px",
    }}>
      <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>{label}</div>
      <input
        type="number"
        step="0.01"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        style={{ ...inputStyle(), width: 140, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
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
      padding: "10px 4px",
    }}>
      <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="number"
          step="0.01"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { const n = parseFloat(draft); if (!isNaN(n)) onChange(Math.round(n * 100)); }}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          style={{ ...inputStyle(), width: 90, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
        />
        <span style={{ color: COLORS.textFaint, fontWeight: 600 }}>%</span>
      </div>
    </div>
  );
}

function Toast({ kind, message, onDismiss }) {
  const bg = kind === "error" ? COLORS.red : COLORS.text;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: bg, color: "#fff",
      padding: "12px 18px", borderRadius: 100,
      boxShadow: "0 8px 28px rgba(15,23,41,0.25)",
      fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 10,
      zIndex: 60,
      maxWidth: "calc(100vw - 32px)",
    }}>
      {message}
      <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#fff", opacity: 0.7, cursor: "pointer", padding: 0 }}>
        <Icon d={ICON.x} size={14} color="#fff" />
      </button>
    </div>
  );
}

// ── Section views (Envelopes / Habits / Goals / Achievements / Settings) ──

function EnvelopesView({ state, updateState, activeMonth, setActiveMonth }) {
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

  const groupOrder = ["giving", "housing", "transport", "food", "personal", "kids", "debt", "yearly", "retirement", "other"];
  const populated = groupOrder.filter((g) => (grouped[g] || []).length > 0);

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

  return (
    <div>
      <DrillTitle
        title="Envelopes"
        subtitle="Ramsey-style budgeting. Each category is an envelope. Unspent money rolls into next month — overspent shows up red."
        icon="M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z M10 12h4"
        iconColor={COLORS.accent}
        iconBg={COLORS.accentSoft}
        heroValue={fmtUsd(totalAvailable)}
        heroLabel={`available · ${fmtUsd(totalCarryover, { compact: true })} carried in + ${fmtUsd(totalBudget, { compact: true })} budgeted − ${fmtUsd(totalSpent, { compact: true })} spent`}
        heroColor={totalAvailable >= 0 ? COLORS.green : COLORS.red}
      />
      <MonthScrubber value={activeMonth} onChange={setActiveMonth} />
      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
        {populated.map((g) => {
          const meta = GROUP_META[g] || GROUP_META.other;
          const items = grouped[g];
          const groupAvailable = items.reduce(
            (s, c) => s + (balancesByLabel.get(c.label.toLowerCase())?.available ?? 0), 0,
          );
          return (
            <BlockCard
              key={g}
              title={meta.label}
              sub={`${fmtUsd(groupAvailable, { compact: true })} available`}
              accent={meta.accent}
              icon={meta.icon}
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
                          onLog={(amount, note) => logEntry(c.label, amount, note)}
                          onBulk={(parsed) => bulkLog(c.label, parsed)}
                          onUpdateEntry={updateEntry}
                          onDeleteEntry={deleteEntry}
                        />
                      </div>
                    </div>
                  );
                }}
              />
            </BlockCard>
          );
        })}
      </div>
    </div>
  );
}

function EnvelopeRow({ category, balance, accent, onLog, onBulk, onUpdateEntry, onDeleteEntry }) {
  const { budget, carryover, thisMonthSpent, available, entries } = balance;
  const [expanded, setExpanded] = useState(false);
  const [logging, setLogging] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

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
        {logging ? (
          <QuickLog accent={accent} onCommit={(amt, note) => { onLog(amt, note); setLogging(false); }} onCancel={() => setLogging(false)} />
        ) : (
          <button
            onClick={() => setLogging(true)}
            style={{
              padding: "5px 10px", borderRadius: 100,
              background: `${accent}1A`, color: accent,
              border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 4,
              whiteSpace: "nowrap",
              transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}26`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}1A`; }}
          >
            <Icon d={["M12 5v14", "M5 12h14"]} size={11} />
            Log
          </button>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: 10, paddingLeft: 18, borderLeft: `2px solid ${accent}33` }}>
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
function QuickLog({ accent, onCommit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const commit = () => {
    const n = parseFloat(amount);
    if (!isNaN(n) && n > 0) onCommit(Math.round(n * 100), note.trim() || undefined);
    else onCancel();
  };
  return (
    <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      <input
        autoFocus
        type="number"
        step="0.01"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }}
        placeholder="0.00"
        aria-label="Amount"
        style={{ ...inputStyle(), width: 76, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onCancel(); }}
        placeholder="note"
        aria-label="Note"
        style={{ ...inputStyle(), width: 110, fontWeight: 600 }}
      />
      <button
        onClick={commit}
        aria-label="Save entry"
        style={{
          width: 26, height: 26, borderRadius: 8, border: "none",
          background: accent, color: "#fff", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}
      >
        <Icon d="M20 6L9 17l-5-5" size={12} />
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
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(15,23,41,0.45)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
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
  );
}

// ── Bills view (recurring obligations + calendar + audit) ────────────

function BillsView({ state, updateState }) {
  const bills = state.bills || [];
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  const monthly = useMemo(() => monthlyBillTotal(bills), [bills]);
  const upcoming = useMemo(() => upcomingBills(bills, 7), [bills]);
  const upcomingTotal = upcoming.reduce((s, b) => s + b.amount_cents, 0);
  const audit = useMemo(() => subscriptionAudit(bills, 90), [bills]);
  const calCells = useMemo(() => billCalendarGrid(bills, calMonth.year, calMonth.month), [bills, calMonth]);

  const active = bills.filter((b) => !b.archived_at);
  const archived = bills.filter((b) => !!b.archived_at);

  const addBill = () => updateState((s) => ({
    ...s,
    bills: [
      ...(s.bills || []),
      {
        id: genId(),
        label: "New bill",
        amount_cents: 0,
        cadence: "monthly",
        due_day: 1,
        created_at: new Date().toISOString(),
      },
    ],
  }));

  const updateBill = (id, patch) => updateState((s) => ({
    ...s,
    bills: (s.bills || []).map((b) => b.id === id ? { ...b, ...patch } : b),
  }));

  const deleteBill = (id) => updateState((s) => ({
    ...s,
    bills: (s.bills || []).filter((b) => b.id !== id),
  }));

  const markPaid = (bill) => {
    const today = new Date();
    const paidISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const monthISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    updateState((s) => {
      // Stamp the bill as paid + log an actual if a category is linked.
      const nextBills = (s.bills || []).map((b) => b.id === bill.id
        ? { ...b, last_paid_at: paidISO, last_used_at: paidISO }
        : b);
      const nextActuals = bill.category_label
        ? [
            ...(s.monthly_actuals || []),
            {
              id: genId(),
              category_label: bill.category_label,
              month: monthISO,
              paid_on: paidISO,
              amount_cents: bill.amount_cents,
              note: `${bill.label}${bill.vendor ? ` · ${bill.vendor}` : ""}`,
            },
          ]
        : (s.monthly_actuals || []);
      return { ...s, bills: nextBills, monthly_actuals: nextActuals };
    });
    fireConfetti({ count: 35, originY: 0.45 });
  };

  const stillUsing = (bill) => {
    const today = new Date().toISOString().slice(0, 10);
    updateBill(bill.id, { last_used_at: today });
  };

  const archive = (id) => updateBill(id, { archived_at: new Date().toISOString() });
  const unarchive = (id) => updateBill(id, { archived_at: null });

  const monthName = new Date(calMonth.year, calMonth.month - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <DrillTitle
        title="Bills"
        subtitle="Recurring obligations — log them once, see them coming, kill the ones you don't use."
        icon={ICON.calendar}
        iconColor="#0bafb0"
        iconBg="rgba(11,175,176,0.10)"
        heroValue={fmtCompact(monthly)}
        heroLabel="/ month equivalent across all cadences"
      />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14,
      }}>
        <BillStat label="Active bills" value={`${active.length}`} sub="recurring" color={COLORS.text} />
        <BillStat label="Due in 7 days" value={fmtCompact(upcomingTotal)} sub={`${upcoming.length} bill${upcoming.length === 1 ? "" : "s"}`} color={upcomingTotal > 0 ? COLORS.amber : COLORS.textFaint} />
        <BillStat label="Audit candidates" value={`${audit.length}`} sub="not tagged 'used' in 90 days" color={audit.length > 0 ? COLORS.red : COLORS.green} />
        <BillStat label="Annualized" value={fmtCompact(monthly * 12)} sub="all bills × 12" color={COLORS.text} />
      </div>

      <div style={{ ...STYLES.card, padding: "14px 14px 10px", marginBottom: 14 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 6px 10px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{monthName}</div>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setCalMonth(({ year, month }) => month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 })}
              aria-label="Previous month"
              style={calNavBtn()}
            ><Icon d={ICON.chevL} size={14} /></button>
            <button
              onClick={() => {
                const d = new Date();
                setCalMonth({ year: d.getFullYear(), month: d.getMonth() + 1 });
              }}
              aria-label="Today"
              style={{ ...calNavBtn(), padding: "0 10px", width: "auto", fontSize: 11, fontWeight: 700, fontFamily: FONT }}
            >Today</button>
            <button
              onClick={() => setCalMonth(({ year, month }) => month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 })}
              aria-label="Next month"
              style={calNavBtn()}
            ><Icon d={ICON.chevR} size={14} /></button>
          </div>
        </div>
        <BillCalendar cells={calCells} />
      </div>

      {upcoming.length > 0 && (
        <BlockCard title="Upcoming · next 7 days" sub={fmtCompact(upcomingTotal)} accent="#0bafb0" icon={ICON.bell} count={`${upcoming.length}`} style={{ marginBottom: 14 }}>
          {upcoming.map((b) => (
            <BillRow key={b.id} bill={b} state={state}
              onUpdate={(patch) => updateBill(b.id, patch)}
              onDelete={() => deleteBill(b.id)}
              onMarkPaid={() => markPaid(b)}
              onStillUsing={() => stillUsing(b)}
              onArchive={() => archive(b.id)}
              accent="#0bafb0"
              showDaysAway
            />
          ))}
        </BlockCard>
      )}

      {audit.length > 0 && (
        <BlockCard title="Audit · review or cancel" sub={fmtCompact(audit.reduce((s, b) => s + (b.amount_cents || 0), 0))} accent={COLORS.red} icon={ICON.bell} count={`${audit.length}`} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, padding: "4px 4px 10px", lineHeight: 1.5 }}>
            You haven't tagged these as "still using" in the last 90 days. Tap "I still use this" to clear the flag — or archive the bill.
          </div>
          {audit.map((b) => (
            <BillRow key={b.id} bill={b} state={state}
              onUpdate={(patch) => updateBill(b.id, patch)}
              onDelete={() => deleteBill(b.id)}
              onMarkPaid={() => markPaid(b)}
              onStillUsing={() => stillUsing(b)}
              onArchive={() => archive(b.id)}
              accent={COLORS.red}
              showAuditNote
            />
          ))}
        </BlockCard>
      )}

      <BlockCard title="All active bills" sub={`${active.length}`} accent="#0bafb0" icon={ICON.envelope}>
        {active.length === 0 && (
          <div style={{ fontSize: 13, color: COLORS.textFaint, padding: "8px 0", fontStyle: "italic" }}>
            No bills yet. Add your first one.
          </div>
        )}
        {active.map((b) => (
          <BillRow key={b.id} bill={b} state={state}
            onUpdate={(patch) => updateBill(b.id, patch)}
            onDelete={() => deleteBill(b.id)}
            onMarkPaid={() => markPaid(b)}
            onStillUsing={() => stillUsing(b)}
            onArchive={() => archive(b.id)}
            accent="#0bafb0"
          />
        ))}
        <AddRowButton label="Add bill" accent="#0bafb0" onClick={addBill} />
      </BlockCard>

      {archived.length > 0 && (
        <BlockCard title="Archived" sub={`${archived.length}`} accent={COLORS.textMuted} icon={ICON.x} style={{ marginTop: 14 }}>
          {archived.map((b) => (
            <div key={b.id} className="bb-row" style={{
              display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto",
              gap: 10, alignItems: "center", padding: "9px 4px",
              opacity: 0.7,
            }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(b.amount_cents)} / {b.cadence}</div>
              <button
                onClick={() => unarchive(b.id)}
                style={{
                  padding: "4px 10px", borderRadius: 100,
                  background: COLORS.surfaceTint, color: COLORS.textMuted,
                  border: `1px solid ${COLORS.border}`, cursor: "pointer",
                  fontSize: 11, fontWeight: 700, fontFamily: FONT,
                }}
              >Restore</button>
            </div>
          ))}
        </BlockCard>
      )}
    </div>
  );
}

function calNavBtn() {
  return {
    width: 28, height: 28, borderRadius: 8,
    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    color: COLORS.textMuted, cursor: "pointer",
    display: "grid", placeItems: "center",
  };
}

function BillStat({ label, value, sub, color }) {
  return (
    <div style={{
      ...STYLES.card, padding: "12px 14px",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ marginTop: 1, fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

function BillCalendar({ cells }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
        fontSize: 9, fontWeight: 700, color: COLORS.textFaint,
        textTransform: "uppercase", letterSpacing: "0.08em",
        padding: "0 4px 6px",
      }}>
        {weekdays.map((d) => <div key={d} style={{ textAlign: "center" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            minHeight: 64,
            padding: "5px 6px",
            borderRadius: 8,
            border: c.isToday ? `1px solid #0bafb0` : `1px solid ${COLORS.surfaceTint}`,
            background: c.inMonth ? COLORS.surface : COLORS.surfaceTint,
            opacity: c.inMonth ? 1 : 0.45,
            display: "flex", flexDirection: "column", gap: 3,
            minWidth: 0,
          }}>
            <div style={{
              fontSize: 11, fontWeight: c.isToday ? 800 : 600,
              color: c.isToday ? "#0bafb0" : COLORS.textMuted,
              fontVariantNumeric: "tabular-nums",
            }}>{c.day}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}>
              {c.bills.slice(0, 3).map((b, bi) => (
                <span key={bi} title={`${b.label} · ${fmtUsd(b.amount_cents)}`}
                  style={{
                    fontSize: 9.5, fontWeight: 700,
                    padding: "1px 5px", borderRadius: 4,
                    background: "rgba(11,175,176,0.16)", color: "#0a8b8c",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{b.label}</span>
              ))}
              {c.bills.length > 3 && (
                <span style={{ fontSize: 9, color: COLORS.textFaint, fontWeight: 600 }}>+{c.bills.length - 3} more</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BILL_CADENCES = [
  { id: "weekly",    label: "weekly"    },
  { id: "biweekly",  label: "biweekly"  },
  { id: "monthly",   label: "monthly"   },
  { id: "quarterly", label: "quarterly" },
  { id: "yearly",    label: "yearly"    },
];

function BillRow({ bill, state, onUpdate, onDelete, onMarkPaid, onStillUsing, onArchive, accent, showDaysAway, showAuditNote }) {
  const nextDue = bill.next_due || nextDueDate(bill, new Date());
  const daysAway = bill.days_away ?? (nextDue ? Math.round((new Date(nextDue) - new Date(new Date().toDateString())) / 86400000) : null);
  const lastPaid = bill.last_paid_at ? new Date(bill.last_paid_at) : null;
  return (
    <div className="bb-row" style={{ padding: "10px 4px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto auto",
        gap: 10, alignItems: "center",
      }}>
        <div style={{ minWidth: 0 }}>
          <InlineText value={bill.label} onChange={(v) => onUpdate({ label: v })} />
          <div style={{ marginTop: 3, fontSize: 11, color: COLORS.textFaint, fontWeight: 600, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            {nextDue && (
              <span style={{ color: daysAway != null && daysAway <= 3 ? COLORS.amber : COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
                Due {new Date(nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {showDaysAway && daysAway != null && ` · ${daysAway === 0 ? "today" : daysAway === 1 ? "tomorrow" : `${daysAway} days`}`}
              </span>
            )}
            {lastPaid && (
              <span style={{ color: COLORS.textFaint }}>
                · last paid {lastPaid.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {showAuditNote && bill.days_since_used != null && (
              <span style={{ color: COLORS.red }}>
                · not used in {bill.days_since_used} days
              </span>
            )}
            {showAuditNote && bill.days_since_used == null && (
              <span style={{ color: COLORS.red }}>· never tagged used</span>
            )}
          </div>
          <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <select
              value={bill.cadence}
              onChange={(e) => onUpdate({ cadence: e.target.value })}
              aria-label="Cadence"
              style={pillSelectStyle()}
            >
              {BILL_CADENCES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <div className="bb-row" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Day
              <input
                type="number"
                min={1} max={31}
                value={bill.due_day || 1}
                onChange={(e) => onUpdate({ due_day: Math.max(1, Math.min(31, parseInt(e.target.value || "1", 10))) })}
                aria-label="Due day"
                style={{ ...inputStyle(), width: 56, padding: "2px 6px", fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              />
            </div>
            {bill.cadence === "yearly" && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Month
                <select
                  value={bill.due_month || 1}
                  onChange={(e) => onUpdate({ due_month: parseInt(e.target.value, 10) })}
                  aria-label="Due month"
                  style={pillSelectStyle()}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i + 1}>{new Date(2026, i, 1).toLocaleString("en-US", { month: "short" })}</option>
                  ))}
                </select>
              </div>
            )}
            <select
              value={bill.category_label || ""}
              onChange={(e) => onUpdate({ category_label: e.target.value || undefined })}
              aria-label="Category"
              style={{ ...pillSelectStyle(), textTransform: "none", letterSpacing: 0, maxWidth: 160 }}
            >
              <option value="">no category</option>
              {(state.categories || []).map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
            <button
              type="button"
              onClick={() => onUpdate({ auto_post: !bill.auto_post })}
              aria-pressed={!!bill.auto_post}
              title={bill.auto_post ? "Auto-post is on — bill writes itself to monthly_actuals on due date" : "Auto-post is off"}
              style={{
                ...pillSelectStyle(),
                padding: "2px 10px",
                color: bill.auto_post ? "#fff" : COLORS.textMuted,
                background: bill.auto_post ? COLORS.green : COLORS.surface,
                borderColor: bill.auto_post ? COLORS.green : COLORS.border,
                cursor: "pointer",
              }}
            >
              {bill.auto_post ? "auto-post ON" : "auto-post off"}
            </button>
            {bill.auto_post && bill.last_auto_posted_period === billPeriodKey(bill) ? (
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: COLORS.green, padding: "2px 8px", borderRadius: 100, background: COLORS.greenBg }}>
                POSTED
              </span>
            ) : null}
          </div>
        </div>
        <InlineNumber value={bill.amount_cents} onChange={(v) => onUpdate({ amount_cents: v })} width={120} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={onMarkPaid}
            style={{
              padding: "5px 10px", borderRadius: 100,
              background: accent, color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: FONT,
              whiteSpace: "nowrap",
            }}
          >Mark paid</button>
          {showAuditNote && (
            <button
              onClick={onStillUsing}
              style={{
                padding: "4px 8px", borderRadius: 100,
                background: COLORS.surfaceTint, color: COLORS.textMuted,
                border: `1px solid ${COLORS.border}`, cursor: "pointer",
                fontSize: 10, fontWeight: 700, fontFamily: FONT,
                whiteSpace: "nowrap",
              }}
            >Still using</button>
          )}
        </div>
        <button
          onClick={onArchive}
          aria-label="Archive bill"
          title="Archive"
          style={{
            width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
            background: "transparent", color: COLORS.textFaint, opacity: 0.5,
            display: "grid", placeItems: "center", transition: "all 0.12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textFaint; }}
        >
          <Icon d={ICON.x} size={12} />
        </button>
      </div>
    </div>
  );
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
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color }} />
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
              />
            ) : (
              <InlineNumber
                value={g.target_cents}
                onChange={(v) => onChange({ target_cents: v })}
                width={120}
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
          width: "100%", maxWidth: 560, maxHeight: "calc(100vh - 40px)",
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
            borderLeft: `3px solid ${t.color}`,
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

// ── Reports view (monthly aggregates + zoomable ranges) ──────────────

function ReportsView({ state }) {
  const [range, setRange] = useState("1y");
  const [categoryLabel, setCategoryLabel] = useState(() => state.categories?.[0]?.label || "");

  const snapshots = useMemo(() => computeMonthlySnapshots(state, range), [state, range]);
  const withCumulative = useMemo(() => withCumulativeNet(snapshots), [snapshots]);
  const catTrend = useMemo(() => computeCategoryTrend(state, categoryLabel, range), [state, categoryLabel, range]);

  const avgNet = snapshots.length > 0
    ? snapshots.reduce((s, r) => s + r.net_cents, 0) / snapshots.length
    : 0;
  const avgSavingsRateBps = snapshots.length > 0
    ? snapshots.reduce((s, r) => s + r.savings_rate_bps, 0) / snapshots.length
    : 0;
  const lastNW = snapshots[snapshots.length - 1]?.net_worth_cents ?? 0;
  const firstNW = snapshots.find((r) => r.net_worth_cents > 0)?.net_worth_cents ?? lastNW;
  const nwDelta = lastNW - firstNW;
  const catTotal = catTrend.reduce((s, r) => s + r.amount_cents, 0);
  const catAvg = catTrend.length > 0 ? catTotal / catTrend.length : 0;

  return (
    <div>
      <DrillTitle
        title="Reports"
        subtitle="Cash flow, net worth, savings rate, per-category trends. Pick a range to zoom."
        icon="M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6"
        iconColor={COLORS.blue}
        iconBg={COLORS.blueBg}
        heroValue={fmtCompact(lastNW)}
        heroLabel={`net worth · ${nwDelta >= 0 ? "+" : "−"}${fmtCompact(Math.abs(nwDelta))} this range`}
        heroColor={nwDelta >= 0 ? COLORS.green : COLORS.red}
      />

      <ReportRangePicker value={range} onChange={setRange} />

      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
        {/* Cash flow */}
        <ReportCard title="Cash flow"
          subtitle={`Avg ${fmtCompact(avgNet)} / mo over ${snapshots.length} month${snapshots.length === 1 ? "" : "s"}`}
          legend={[
            { label: "Income", color: COLORS.green, kind: "bar" },
            { label: "Expenses", color: COLORS.red, kind: "bar" },
            { label: "Net (cumulative)", color: COLORS.text, kind: "line" },
          ]}
        >
          {snapshots.length < 1 ? (
            <EmptyReport text="No history yet — your charts fill in as the daily snapshots accumulate." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={withCumulative} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceTint} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 10, fontFamily: FONT }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Bar dataKey="income_cents"   fill={COLORS.green} opacity={0.22} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses_cents" fill={COLORS.red}   opacity={0.22} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="cumulative_net_cents" stroke={COLORS.text} strokeWidth={2.5} dot={false} />
                <RTooltip
                  contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "8px 12px", fontFamily: FONT }}
                  formatter={(v, key) => {
                    if (key === "income_cents")          return [fmtCompact(v), "Income"];
                    if (key === "expenses_cents")        return [fmtCompact(v), "Expenses"];
                    if (key === "cumulative_net_cents")  return [fmtCompact(v), "Cumulative net"];
                    return [fmtCompact(v), key];
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ReportCard>

        {/* Net worth trajectory */}
        <ReportCard title="Net worth trajectory"
          subtitle={`${nwDelta >= 0 ? "Up" : "Down"} ${fmtCompact(Math.abs(nwDelta))} over the range`}
        >
          {snapshots.filter((r) => r.net_worth_cents > 0).length < 2 ? (
            <EmptyReport text="At least two months of net-worth snapshots needed for this chart." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={snapshots} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceTint} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 10, fontFamily: FONT }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Line type="monotone" dataKey="net_worth_cents" stroke={COLORS.amber} strokeWidth={2.5} dot={false} />
                <RTooltip
                  contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "8px 12px", fontFamily: FONT }}
                  formatter={(v) => [fmtCompact(v), "Net worth"]}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ReportCard>

        {/* Savings rate */}
        <ReportCard title="Savings rate"
          subtitle={`Avg ${(avgSavingsRateBps / 100).toFixed(1)}% of income kept`}
        >
          {snapshots.length < 1 ? (
            <EmptyReport text="No history yet." />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={snapshots} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceTint} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 10, fontFamily: FONT }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                <ReferenceLine y={0} stroke={COLORS.borderStrong} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="savings_rate_bps" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.accent }} />
                <RTooltip
                  contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "8px 12px", fontFamily: FONT }}
                  formatter={(v) => [`${(v / 100).toFixed(1)}%`, "Savings rate"]}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ReportCard>

        <ExportsBlock state={state} />
        <ImportBlock state={state} />

        {/* Per-category trend */}
        <ReportCard
          title="Category trend"
          subtitle={catTotal > 0 ? `Avg ${fmtCompact(catAvg)} / mo · ${fmtCompact(catTotal)} total` : "Pick a category to see its trend"}
          rightSlot={
            <select
              value={categoryLabel}
              onChange={(e) => setCategoryLabel(e.target.value)}
              aria-label="Category"
              style={{ ...inputStyle(), fontSize: 12, fontWeight: 600, padding: "4px 8px", maxWidth: 220 }}
            >
              <option value="">— pick a category —</option>
              {(state.categories || [])
                .slice()
                .sort((a, b) => (a.group_key || "").localeCompare(b.group_key || ""))
                .map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.group_key ? `${c.group_key} · ` : ""}{c.label}
                  </option>
                ))}
            </select>
          }
        >
          {!categoryLabel ? (
            <EmptyReport text="Pick a category above to see its month-by-month spending." />
          ) : catTrend.every((r) => r.amount_cents === 0) ? (
            <EmptyReport text="No logged spending for this category in the range." />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={catTrend} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surfaceTint} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 10, fontFamily: FONT }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Line type="monotone" dataKey="amount_cents" stroke={COLORS.purple} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.purple }} />
                <RTooltip
                  contentStyle={{ background: COLORS.text, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, padding: "8px 12px", fontFamily: FONT }}
                  formatter={(v) => [fmtCompact(v), categoryLabel]}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ReportCard>
      </div>
    </div>
  );
}

function ReportRangePicker({ value, onChange }) {
  return (
    <div style={{
      display: "inline-flex", padding: 4, gap: 2,
      background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
      borderRadius: 100,
    }}>
      {REPORT_RANGES.map((r) => {
        const active = value === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            style={{
              padding: "5px 12px", borderRadius: 100,
              background: active ? COLORS.text : "transparent",
              color: active ? "#fff" : COLORS.textMuted,
              border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: FONT,
              transition: "all 0.15s ease",
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function ReportCard({ title, subtitle, legend, rightSlot, children }) {
  return (
    <div style={{ ...STYLES.card, padding: "16px 14px 12px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 12, flexWrap: "wrap", padding: "0 6px 10px",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
          {subtitle && <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>{subtitle}</div>}
        </div>
        {legend && (
          <div style={{ display: "flex", gap: "4px 14px", fontSize: 11, fontWeight: 600, flexWrap: "wrap" }}>
            {legend.map((l) => (
              <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: COLORS.textMuted }}>
                <span style={{
                  width: l.kind === "bar" ? 12 : 14,
                  height: l.kind === "bar" ? 8 : 2,
                  background: l.color,
                  borderRadius: l.kind === "bar" ? 2 : 2,
                  opacity: l.kind === "bar" ? 0.55 : 1,
                }} />
                {l.label}
              </span>
            ))}
          </div>
        )}
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

function EmptyReport({ text }) {
  return (
    <div style={{ padding: 28, textAlign: "center", color: COLORS.textFaint, fontSize: 12, fontStyle: "italic" }}>
      {text}
    </div>
  );
}

function ImportBlock({ state }) {
  const [parsed, setParsed] = useState(null); // rows[][]
  const [columnMap, setColumnMap] = useState(null);
  const [preview, setPreview] = useState(null); // { rows, warnings }
  const [defaultCategory, setDefaultCategory] = useState("");
  const [amountSign, setAmountSign] = useState("negative_is_outflow");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const categories = state.categories || [];
  const knownLabels = useMemo(() => categories.map((c) => c.label), [categories]);

  const reset = () => {
    setParsed(null);
    setColumnMap(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const onFile = (file) => {
    if (!file) return;
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || "");
        const rows = parseCSV(text);
        if (rows.length < 2) {
          setError("CSV had no data rows.");
          return;
        }
        const headers = rows[0];
        const detected = detectColumns(headers);
        setParsed(rows);
        setColumnMap(detected);
      } catch (err) {
        setError(err?.message || String(err));
      }
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file);
  };

  // Recompute preview whenever the user changes mapping / default
  // category / amount sign.
  useEffect(() => {
    if (!parsed || !columnMap) { setPreview(null); return; }
    const r = buildImportRows(parsed, columnMap, {
      categoriesKnown: knownLabels,
      defaultCategory: defaultCategory || null,
      amountSign,
    });
    setPreview(r);
  }, [parsed, columnMap, knownLabels, defaultCategory, amountSign]);

  const headers = parsed?.[0] || [];

  const commit = async () => {
    if (!preview) return;
    const rows = preview.rows.filter((r) => r.category_label);
    if (rows.length === 0) {
      setError("No rows have a recognized envelope. Pick a default category or pre-create the envelopes first.");
      return;
    }
    setError(null);
    setBusy(true);
    const res = await importHistoricalActuals(rows.map((r) => ({
      date: r.date,
      amount_cents: r.amount_cents,
      category_label: r.category_label,
      note: r.note,
    })));
    setBusy(false);
    if (res.ok) {
      setResult(res);
      // Reload after a short delay so the user sees the success
      // banner before the page refreshes.
      setTimeout(() => { if (typeof window !== "undefined") window.location.reload(); }, 1200);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ ...STYLES.card, padding: "16px 14px", marginTop: 14 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Import history · CSV</div>
        <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
          Drop a Mint / YNAB / bank CSV export to backfill historical expenses. Columns auto-detected; preview before commit.
        </div>
      </div>

      {!parsed ? (
        <FileDrop onFile={onFile} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
            <ColumnPicker label="Date column"        headers={headers} value={columnMap?.date}        onChange={(idx) => setColumnMap({ ...columnMap, date: idx })} />
            <ColumnPicker label="Amount column"      headers={headers} value={columnMap?.amount}      onChange={(idx) => setColumnMap({ ...columnMap, amount: idx })} />
            <ColumnPicker label="Outflow column"     headers={headers} value={columnMap?.outflow}     onChange={(idx) => setColumnMap({ ...columnMap, outflow: idx })} />
            <ColumnPicker label="Inflow column"      headers={headers} value={columnMap?.inflow}      onChange={(idx) => setColumnMap({ ...columnMap, inflow: idx })} />
            <ColumnPicker label="Description column" headers={headers} value={columnMap?.description} onChange={(idx) => setColumnMap({ ...columnMap, description: idx })} />
            <ColumnPicker label="Category column"    headers={headers} value={columnMap?.category}    onChange={(idx) => setColumnMap({ ...columnMap, category: idx })} />
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Default envelope (fallback)
              <select value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value)} style={inputStyle()}>
                <option value="">— none —</option>
                {categories.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Amount convention
              <select value={amountSign} onChange={(e) => setAmountSign(e.target.value)} style={inputStyle()}>
                <option value="negative_is_outflow">Negative = expense (Mint, banks)</option>
                <option value="positive_is_outflow">Positive = expense (YNAB-style)</option>
              </select>
            </label>
          </div>

          {preview ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 6 }}>
                Preview · {preview.rows.length} ready · {preview.rows.filter((r) => !r.category_label).length} need a category
              </div>
              <div style={{ maxHeight: 260, overflowY: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                {preview.rows.slice(0, 50).map((r, i) => (
                  <div key={i} className="bb-row" style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto auto", gap: 10, padding: "8px 10px", fontSize: 12 }}>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: COLORS.textMuted, minWidth: 80 }}>{r.date}</span>
                    <span style={{ minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.description}</span>
                    <span style={{ color: r.category_label ? COLORS.text : COLORS.red, fontWeight: 600 }}>
                      {r.category_label || "no envelope"}
                    </span>
                    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, color: r.amount_cents >= 0 ? COLORS.text : COLORS.green }}>
                      {fmtUsd(r.amount_cents)}
                    </span>
                  </div>
                ))}
                {preview.rows.length > 50 ? (
                  <div style={{ padding: "8px 10px", fontSize: 11, color: COLORS.textFaint, fontWeight: 600, textAlign: "center" }}>
                    … and {preview.rows.length - 50} more rows
                  </div>
                ) : null}
              </div>
              {preview.warnings.length > 0 ? (
                <details style={{ marginTop: 8, fontSize: 11, color: COLORS.amber }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700 }}>{preview.warnings.length} parsing warning{preview.warnings.length === 1 ? "" : "s"}</summary>
                  <ul style={{ margin: "6px 0 0 18px", lineHeight: 1.5 }}>
                    {preview.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                    {preview.warnings.length > 8 ? <li>… +{preview.warnings.length - 8} more</li> : null}
                  </ul>
                </details>
              ) : null}
            </div>
          ) : null}

          <div style={{ marginTop: 12, display: "inline-flex", gap: 8 }}>
            <button
              onClick={commit}
              disabled={busy || !preview || preview.rows.filter((r) => r.category_label).length === 0}
              style={{ ...btnStyle(), background: COLORS.accent, border: `1px solid ${COLORS.accent}`, color: "#fff", padding: "8px 16px", fontSize: 13 }}
            >
              {busy ? "importing…" : `import ${preview ? preview.rows.filter((r) => r.category_label).length : 0} rows`}
            </button>
            <button onClick={reset} disabled={busy} style={{ ...textBtnStyle(), padding: "8px 12px", fontSize: 12 }}>
              cancel
            </button>
          </div>

          {result?.ok ? (
            <div role="status" style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: COLORS.greenBg, color: COLORS.green, fontSize: 12, fontWeight: 700 }}>
              Imported {result.inserted} rows{result.skipped ? ` · ${result.skipped} skipped (no matching envelope)` : ""}. Reloading…
            </div>
          ) : null}
          {error ? (
            <div role="alert" style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, fontSize: 12, fontWeight: 600 }}>
              {error}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function FileDrop({ onFile }) {
  const [hover, setHover] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) onFile(file);
      }}
      style={{
        display: "grid",
        placeItems: "center",
        padding: "28px 18px",
        borderRadius: 14,
        border: `2px dashed ${hover ? COLORS.accent : COLORS.borderStrong}`,
        background: hover ? COLORS.accentSoft : COLORS.surfaceTint,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <Icon d={ICON.upload} size={22} color={hover ? COLORS.accent : COLORS.textMuted} />
      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: hover ? COLORS.accent : COLORS.textMuted }}>
        Drop a CSV here or tap to choose
      </div>
      <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 500 }}>
        .csv exports from Mint, YNAB, banks, or any tool with a header row
      </div>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => onFile(e.target.files?.[0])}
        style={{ display: "none" }}
      />
    </label>
  );
}

function ColumnPicker({ label, headers, value, onChange }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 0.4, textTransform: "uppercase" }}>
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : parseInt(e.target.value, 10))}
        style={inputStyle()}
      >
        <option value="">— skip —</option>
        {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
      </select>
    </label>
  );
}

function ExportsBlock({ state }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [pendingPdf, setPendingPdf] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  const operatingCount = useMemo(
    () => (state.properties || []).filter((p) => p.status === "operating" || p.status === "pipeline").length,
    [state.properties],
  );

  // react-pdf is heavy — lazy-import lib/pdf only when the user
  // actually clicks a PDF tile so it doesn't bloat the main bundle.
  const downloadPdf = async (key, filename, factoryName, factoryArgs = []) => {
    if (pendingPdf) return;
    setPdfError(null);
    setPendingPdf(key);
    try {
      const mod = await import("./lib/pdf");
      const factory = mod[factoryName];
      await mod.generateAndDownload(filename, () => factory(...factoryArgs));
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : String(e));
    } finally {
      setPendingPdf(null);
    }
  };

  const pdfDownloads = useMemo(() => [
    {
      key: "monthly-pdf",
      label: "Monthly statement",
      sub: "One-page cash-flow snapshot — income, expenses, property NOI, savings rate",
      accent: COLORS.green,
      rowCount: 1,
      filename: defaultFilename("monthly-statement", "pdf"),
      factory: "MonthlyStatementPDF",
      args: [{ state }],
    },
    {
      key: "networth-pdf",
      label: "Net worth statement",
      sub: "Lender-ready: assets, liabilities, signature block. Print, sign, send.",
      accent: COLORS.blue,
      rowCount: 1,
      filename: defaultFilename("net-worth-statement", "pdf"),
      factory: "NetWorthStatementPDF",
      args: [{ state }],
    },
    {
      key: "schedule-e-pdf",
      label: "Schedule E tax packet",
      sub: `One page per property + portfolio summary · TY ${year}`,
      accent: COLORS.amber,
      rowCount: operatingCount,
      filename: defaultFilename("schedule-e-packet", "pdf", String(year)),
      factory: "ScheduleEPacketPDF",
      args: [{ state, year }],
    },
  ], [state, year, operatingCount]);

  const exports = useMemo(() => [
    {
      key: "schedule-e",
      label: "Schedule E (per-property tax row)",
      sub: "One row per property — gross rents, expenses, depreciation, taxable income",
      build: () => buildScheduleE(state, year),
      suffix: String(year),
      accent: COLORS.accent,
      icon: ICON.building,
    },
    {
      key: "actuals",
      label: "Expense ledger (monthly_actuals)",
      sub: "Every logged expense with date, category, amount, note",
      build: () => buildMonthlyActuals(state),
      accent: "#3b6fd1",
      icon: ICON.envelope,
    },
    {
      key: "history",
      label: "Net-worth + cash-flow daily snapshots",
      sub: "Auto-snapshotted daily totals — net worth, hero conservative, monthly savings",
      build: () => buildHistorySnapshot(state),
      accent: COLORS.amber,
      icon: ICON.trending,
    },
    {
      key: "bills",
      label: "Active recurring bills",
      sub: "Every non-archived bill with cadence, due day, vendor, autopay",
      build: () => buildBills(state),
      accent: "#0bafb0",
      icon: ICON.calendar,
    },
  ], [state, year]);

  const handleDownload = (e) => {
    const result = e.build();
    if (!result.csv || result.rowCount === 0) return;
    downloadCSV(defaultFilename(e.key, "csv", e.suffix), result.csv);
  };

  const handleJsonBackup = () => {
    downloadJSON(defaultFilename("snapshot", "json"), buildFullSnapshotJSON(state));
  };

  return (
    <div style={{ ...STYLES.card, padding: "16px 14px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 12, flexWrap: "wrap", padding: "0 6px 12px",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Exports · PDF, CSV, backup</div>
          <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
            Print-ready statements for a CPA or lender. CSVs for spreadsheet drill-down.
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: COLORS.textMuted }}>
          Schedule E year
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            aria-label="Schedule E year"
            style={pillSelectStyle()}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: COLORS.textFaint, padding: "0 6px 6px" }}>
          PRINT-READY PDFS
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {pdfDownloads.map((d) => {
            const disabled = d.rowCount === 0 || (pendingPdf && pendingPdf !== d.key);
            const busy = pendingPdf === d.key;
            return (
              <button
                key={d.key}
                onClick={() => downloadPdf(d.key, d.filename, d.factory, d.args)}
                disabled={disabled || busy}
                style={{
                  display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
                  gap: 12, alignItems: "center", textAlign: "left",
                  padding: "12px 14px", borderRadius: 12,
                  background: disabled ? COLORS.surfaceTint : COLORS.surface,
                  border: `1px solid ${disabled ? COLORS.surfaceTint : COLORS.border}`,
                  cursor: disabled || busy ? "default" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                  fontFamily: FONT,
                  transition: "border-color 0.12s ease",
                }}
                onMouseEnter={(ev) => { if (!disabled && !busy) ev.currentTarget.style.borderColor = d.accent; }}
                onMouseLeave={(ev) => { if (!disabled && !busy) ev.currentTarget.style.borderColor = COLORS.border; }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `${d.accent}1A`, color: d.accent,
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon d={ICON.fileText} size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</div>
                  <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{d.sub}</div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 11, fontWeight: 700,
                  color: disabled ? COLORS.textFaint : d.accent,
                  whiteSpace: "nowrap",
                }}>
                  {busy ? "generating…" : d.rowCount === 0 ? "no data" : "PDF"}
                  <Icon d={busy ? ICON.refresh : (d.rowCount === 0 ? ICON.x : ICON.download)} size={14} />
                </div>
              </button>
            );
          })}
        </div>
        {pdfError ? (
          <div role="alert" style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, fontSize: 11, fontWeight: 600 }}>
            PDF generation failed: {pdfError}
          </div>
        ) : null}
      </div>
      <div style={{ height: 1, background: COLORS.border, margin: "0 0 14px" }} />
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: COLORS.textFaint, padding: "0 6px 6px" }}>
        SPREADSHEET CSVS
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {exports.map((e) => {
          const preview = e.build();
          const disabled = !preview.rowCount;
          return (
            <button
              key={e.key}
              onClick={() => handleDownload(e)}
              disabled={disabled}
              style={{
                display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
                gap: 12, alignItems: "center", textAlign: "left",
                padding: "12px 14px", borderRadius: 12,
                background: disabled ? COLORS.surfaceTint : COLORS.surface,
                border: `1px solid ${disabled ? COLORS.surfaceTint : COLORS.border}`,
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.55 : 1,
                fontFamily: FONT,
                transition: "border-color 0.12s ease",
              }}
              onMouseEnter={(ev) => { if (!disabled) ev.currentTarget.style.borderColor = e.accent; }}
              onMouseLeave={(ev) => { if (!disabled) ev.currentTarget.style.borderColor = COLORS.border; }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${e.accent}1A`, color: e.accent,
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Icon d={e.icon} size={16} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
                <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{e.sub}</div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, fontWeight: 700,
                color: disabled ? COLORS.textFaint : e.accent,
                whiteSpace: "nowrap",
              }}>
                {disabled ? "no rows" : `${preview.rowCount} row${preview.rowCount === 1 ? "" : "s"}`}
                <Icon d={disabled ? ICON.x : ICON.download} size={14} />
              </div>
            </button>
          );
        })}
        <button
          onClick={handleJsonBackup}
          style={{
            display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
            gap: 12, alignItems: "center", textAlign: "left",
            padding: "12px 14px", borderRadius: 12,
            background: COLORS.surface,
            border: `1px dashed ${COLORS.borderStrong}`,
            cursor: "pointer", fontFamily: FONT,
            transition: "border-color 0.12s ease",
          }}
          onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = COLORS.text; }}
          onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = COLORS.borderStrong; }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: COLORS.surfaceTint, color: COLORS.text,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon d={ICON.download} size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>Full state backup (JSON)</div>
            <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
              Everything: settings, categories, properties, bills, habits, goals, history. Restore later by pasting into app_data.
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, whiteSpace: "nowrap" }}>
            JSON
            <Icon d={ICON.download} size={14} />
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Banking view ─────────────────────────────────────────────────────

function BankingView({ state, updateState }) {
  const items = state.plaid_items || [];
  const transactions = state.plaid_transactions || [];
  const categories = state.categories || [];

  const reloadFromServer = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  const inbox = useMemo(() => transactions
    .filter((t) => !t.imported_at && !t.dismissed_at && t.amount_cents > 0)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
  [transactions]);

  const credits = useMemo(() => transactions
    .filter((t) => !t.imported_at && !t.dismissed_at && t.amount_cents <= 0)
    .sort((a, b) => (a.date < b.date ? 1 : -1)),
  [transactions]);

  const recentlyImported = useMemo(() => transactions
    .filter((t) => t.imported_at)
    .sort((a, b) => ((a.imported_at || "") < (b.imported_at || "") ? 1 : -1))
    .slice(0, 6),
  [transactions]);

  return (
    <div>
      <DrillTitle
        title="Banking"
        subtitle="Connect a bank, pull recent transactions, drop them into envelopes."
        icon="M3 22h18 M3 10h18 M5 6l7-3 7 3 M4 10v12 M20 10v12 M8 14v4 M12 14v4 M16 14v4"
        iconColor={COLORS.green}
        iconBg={COLORS.greenBg}
      />

      <BlockCard
        title={`Connected institutions${items.length > 0 ? ` · ${items.length}` : ""}`}
        accent={COLORS.green}
        icon="M3 22h18 M3 10h18 M5 6l7-3 7 3 M4 10v12 M20 10v12"
        style={{ marginTop: 14 }}
      >
        {items.length === 0 ? (
          <div style={{ padding: "18px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 600, marginBottom: 4 }}>
              No bank connected yet.
            </div>
            <div style={{ fontSize: 12, color: COLORS.textFaint, marginBottom: 14 }}>
              Plaid encrypts the connection. Tokens never leave the server — only
              transaction descriptions, dates, and amounts come back to your dashboard.
            </div>
            <PlaidLinkButton onConnected={reloadFromServer}>
              Connect a bank
            </PlaidLinkButton>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <ConnectedItemCard
                key={item.id}
                item={item}
                onAfter={reloadFromServer}
              />
            ))}
            <div style={{ padding: "10px 4px 0", display: "flex", justifyContent: "flex-end" }}>
              <PlaidLinkButton onConnected={reloadFromServer} compact>
                Connect another
              </PlaidLinkButton>
            </div>
          </>
        )}
      </BlockCard>

      {items.length > 0 ? (
        <>
          <BlockCard
            title={`Transaction inbox · ${inbox.length}`}
            sub="Outflows only. Categorize → accept into envelopes."
            accent={COLORS.amber}
            icon="M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z"
            style={{ marginTop: 14 }}
          >
            {inbox.length === 0 ? (
              <div style={{ padding: 14, fontSize: 13, color: COLORS.textMuted, textAlign: "center" }}>
                Inbox empty — all caught up.
              </div>
            ) : (
              inbox.slice(0, 200).map((t) => (
                <TransactionInboxRow
                  key={t.id}
                  txn={t}
                  categories={categories}
                  onAfter={reloadFromServer}
                />
              ))
            )}
          </BlockCard>

          {credits.length > 0 ? (
            <BlockCard
              title={`Credits / refunds · ${credits.length}`}
              accent={COLORS.blue}
              icon="M12 19V5 M5 12l7-7 7 7"
              style={{ marginTop: 14 }}
            >
              {credits.slice(0, 30).map((t) => (
                <CreditInboxRow
                  key={t.id}
                  txn={t}
                  onAfter={reloadFromServer}
                />
              ))}
            </BlockCard>
          ) : null}

          <RecurringSuggestionsBlock state={state} onAfter={reloadFromServer} />

          {recentlyImported.length > 0 ? (
            <BlockCard
              title="Recently imported"
              accent={COLORS.textMuted}
              icon="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 7v5l3 3"
              style={{ marginTop: 14 }}
            >
              {recentlyImported.map((t) => (
                <ImportedTxnRow
                  key={t.id}
                  txn={t}
                  onAfter={reloadFromServer}
                />
              ))}
            </BlockCard>
          ) : null}
        </>
      ) : null}

      <RulesBlock state={state} onAfter={reloadFromServer} />
    </div>
  );
}

function RulesBlock({ state, onAfter }) {
  const rules = state.categorization_rules || [];
  const categories = state.categories || [];
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const toggle = async (rule) => {
    setBusyId(rule.id);
    const res = await updateCategorizationRule(rule.id, { enabled: !rule.enabled });
    setBusyId(null);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  const toggleAuto = async (rule) => {
    setBusyId(rule.id);
    const res = await updateCategorizationRule(rule.id, { auto_import: !rule.auto_import });
    setBusyId(null);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  const remove = async (rule) => {
    if (typeof window !== "undefined" && !window.confirm(`Delete rule "${describeRule(rule)}"?`)) return;
    setBusyId(rule.id);
    const res = await deleteCategorizationRule(rule.id);
    setBusyId(null);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  return (
    <BlockCard
      title={`Auto-categorization rules · ${rules.length}`}
      sub="Rules run on every sync. First match wins — higher rules trump lower."
      accent={COLORS.purple}
      icon="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2 M16 11h6 M19 8v6"
      style={{ marginTop: 14 }}
    >
      {rules.length === 0 ? (
        <div style={{ padding: "12px 4px", fontSize: 12.5, color: COLORS.textMuted, textAlign: "center" }}>
          No rules yet. Check &ldquo;Always send …&rdquo; while accepting a transaction to learn one.
        </div>
      ) : (
        rules.map((r) => (
          <div key={r.id} className="bb-row" style={{ padding: "10px 4px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, alignItems: "center" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.enabled ? COLORS.text : COLORS.textFaint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: r.enabled ? "none" : "line-through" }}>
                  {describeRule(r)}
                </div>
                <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted }}>
                  {r.hit_count ? `${r.hit_count} hit${r.hit_count === 1 ? "" : "s"}` : "0 hits"}
                  {r.last_hit_at ? ` · last ${formatRelativeTime(r.last_hit_at)}` : ""}
                  {r.auto_import ? " · auto-import ON" : ""}
                </div>
              </div>
              <div style={{ display: "inline-flex", gap: 4 }}>
                <button onClick={() => toggleAuto(r)} disabled={busyId === r.id} style={{ ...textBtnStyle(), padding: "4px 8px", fontSize: 11, color: r.auto_import ? COLORS.green : COLORS.textMuted }} title="Auto-import on sync">
                  auto
                </button>
                <button onClick={() => toggle(r)} disabled={busyId === r.id} style={{ ...textBtnStyle(), padding: "4px 8px", fontSize: 11, color: r.enabled ? COLORS.amber : COLORS.green }}>
                  {r.enabled ? "pause" : "enable"}
                </button>
                <button onClick={() => remove(r)} disabled={busyId === r.id} style={{ ...textBtnStyle(), padding: "4px 8px", fontSize: 11, color: COLORS.red }}>
                  delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {adding ? (
        <NewRuleForm
          categories={categories}
          onCancel={() => setAdding(false)}
          onSaved={() => { setAdding(false); onAfter?.(); }}
          onError={setError}
        />
      ) : (
        <div style={{ padding: "10px 4px 0" }}>
          <button onClick={() => setAdding(true)} style={{ ...textBtnStyle(), color: COLORS.purple, fontSize: 12 }}>
            <Icon d={ICON.plus} size={14} />
            new rule
          </button>
        </div>
      )}
      {error ? (
        <div role="alert" style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, background: COLORS.redBg, color: COLORS.red, fontSize: 11, fontWeight: 600 }}>{error}</div>
      ) : null}
    </BlockCard>
  );
}

function RecurringSuggestionsBlock({ state, onAfter }) {
  const suggestions = useMemo(() => detectRecurring(state), [state]);
  const [dismissed, setDismissed] = useState(new Set());
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState(null);

  // Hide suggestions for merchants that already have a bill, and the
  // ones the user dismissed this session.
  const visible = suggestions.filter((s) => !s.existing_bill_id && !dismissed.has(s.key));

  if (suggestions.length === 0) return null;

  const addAsBill = async (s) => {
    setError(null);
    setBusyKey(s.key);
    const res = await createBill({
      label: s.merchant_name,
      vendor: s.merchant_name,
      amount_cents: s.median_amount_cents,
      cadence: s.cadence,
      due_day: s.due_day,
      category_label: s.category_label,
      auto_post: false,
      last_paid_at: s.last_paid_on,
    });
    setBusyKey(null);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  return (
    <BlockCard
      title={`Recurring detected · ${visible.length}`}
      sub="Charges that hit on a regular cadence. One tap turns each into a tracked bill."
      accent={COLORS.blue}
      icon="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 7v5l3 3"
      style={{ marginTop: 14 }}
    >
      {visible.length === 0 ? (
        <div style={{ padding: 14, fontSize: 12.5, color: COLORS.textMuted, textAlign: "center" }}>
          {suggestions.length > 0
            ? "All detected patterns are already tracked or dismissed."
            : "No recurring patterns yet — need at least 3 charges per merchant."}
        </div>
      ) : (
        visible.map((s) => {
          const busy = busyKey === s.key;
          return (
            <div key={s.key} className="bb-row" style={{ padding: "10px 4px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 10, alignItems: "center" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.merchant_name}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
                    {fmtUsd(s.median_amount_cents)} · {s.cadence} · {s.occurrences} charges · last {s.last_paid_on}
                    {s.category_label ? ` · ${s.category_label}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => addAsBill(s)}
                  disabled={busy}
                  style={{ ...btnStyle(), background: COLORS.blue, border: `1px solid ${COLORS.blue}`, color: "#fff", padding: "6px 12px", fontSize: 12 }}
                >
                  {busy ? "adding…" : "add as bill"}
                </button>
                <button
                  onClick={() => setDismissed((prev) => new Set(prev).add(s.key))}
                  disabled={busy}
                  style={{ ...textBtnStyle(), padding: "6px 10px", fontSize: 12 }}
                >
                  skip
                </button>
              </div>
            </div>
          );
        })
      )}
      {error ? (
        <div role="alert" style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, background: COLORS.redBg, color: COLORS.red, fontSize: 11, fontWeight: 600 }}>{error}</div>
      ) : null}
    </BlockCard>
  );
}

function NewRuleForm({ categories, onCancel, onSaved, onError }) {
  const [field, setField] = useState("merchant_name");
  const [op, setOp] = useState("contains");
  const [value, setValue] = useState("");
  const [target, setTarget] = useState(categories[0]?.label || "");
  const [autoImport, setAutoImport] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!value.trim() || !target) return;
    setBusy(true);
    const res = await addCategorizationRule({
      match_field: field,
      match_op: op,
      match_value: value.trim(),
      target_category_label: target,
      enabled: true,
      auto_import: autoImport,
    });
    setBusy(false);
    if (res.ok) onSaved?.();
    else onError?.(res.message);
  };

  return (
    <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <select value={field} onChange={(e) => setField(e.target.value)} style={inputStyle()} aria-label="Match field">
          <option value="merchant_name">Merchant</option>
          <option value="name">Description</option>
          <option value="plaid_category">Plaid category</option>
        </select>
        <select value={op} onChange={(e) => setOp(e.target.value)} style={inputStyle()} aria-label="Match operator">
          <option value="contains">contains</option>
          <option value="starts_with">starts with</option>
          <option value="equals">equals</option>
          <option value="regex">regex</option>
        </select>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Costco"
        style={{ ...inputStyle(), marginTop: 8, width: "100%" }}
        aria-label="Match value"
      />
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{ ...inputStyle(), marginTop: 8, width: "100%" }}
        aria-label="Target envelope"
      >
        {categories.map((c) => (
          <option key={c.label} value={c.label}>{c.label}</option>
        ))}
      </select>
      <label style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textMuted, cursor: "pointer" }}>
        <input type="checkbox" checked={autoImport} onChange={(e) => setAutoImport(e.target.checked)} style={{ accentColor: COLORS.green }} />
        Auto-import matched transactions on sync
      </label>
      <div style={{ marginTop: 10, display: "inline-flex", gap: 6 }}>
        <button onClick={save} disabled={busy || !value.trim() || !target} style={{ ...btnStyle(), background: COLORS.purple, border: `1px solid ${COLORS.purple}`, color: "#fff", padding: "8px 14px", fontSize: 12 }}>
          save rule
        </button>
        <button onClick={onCancel} disabled={busy} style={{ ...textBtnStyle(), padding: "8px 12px", fontSize: 12 }}>
          cancel
        </button>
      </div>
    </div>
  );
}

// PlaidLinkButton — fetches a link token on click, then mounts the
// hook-using opener which fires Plaid Link.
function PlaidLinkButton({ onConnected, children, compact }) {
  const [token, setToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const start = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await createPlaidLinkToken();
      if (!res.ok) {
        setError(res.message);
        setBusy(false);
        return;
      }
      setToken(res.link_token);
    } catch (e) {
      setError(e?.message || String(e));
      setBusy(false);
    }
  };

  const baseStyle = compact ? {
    ...btnStyle(),
    padding: "8px 14px",
    fontSize: 12,
  } : {
    ...btnStyle(),
    background: COLORS.green,
    border: `1px solid ${COLORS.green}`,
    color: "#fff",
    padding: "10px 18px",
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <>
      <button onClick={start} disabled={busy} style={baseStyle}>
        {!compact ? <Icon d={ICON.link2} size={16} color="#fff" /> : null}
        {busy && !token ? "Opening…" : children}
      </button>
      {error ? (
        <div role="alert" style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, fontSize: 12, fontWeight: 600 }}>
          {error}
        </div>
      ) : null}
      {token ? (
        <PlaidLinkOpener
          token={token}
          onSuccess={async (publicToken, metadata) => {
            const res = await exchangePlaidPublicToken(publicToken, {
              institution_id: metadata?.institution?.institution_id,
              institution_name: metadata?.institution?.name,
              accounts: (metadata?.accounts || []).map((a) => ({
                id: a.id, name: a.name, mask: a.mask, type: a.type, subtype: a.subtype,
              })),
            });
            setBusy(false);
            setToken(null);
            if (res.ok) {
              onConnected?.();
            } else {
              setError(res.message);
            }
          }}
          onExit={() => { setBusy(false); setToken(null); }}
        />
      ) : null}
    </>
  );
}

function PlaidLinkOpener({ token, onSuccess, onExit }) {
  const { open, ready } = usePlaidLink({ token, onSuccess, onExit });
  useEffect(() => {
    if (ready) open();
  }, [ready, open]);
  return null;
}

function ConnectedItemCard({ item, onAfter }) {
  const [syncing, setSyncing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const doSync = async () => {
    setError(null);
    setSyncing(true);
    const res = await syncPlaidTransactions(item.id);
    setSyncing(false);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  const doRefresh = async () => {
    setBusy(true);
    const res = await refreshPlaidBalances(item.id);
    setBusy(false);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  const doDisconnect = async () => {
    if (typeof window !== "undefined" && !window.confirm(`Disconnect ${item.institution_name}? Existing transactions stay.`)) return;
    setBusy(true);
    const res = await disconnectPlaidItem(item.id);
    setBusy(false);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  return (
    <div className="bb-row" style={{ padding: "12px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: COLORS.greenBg, color: COLORS.green, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon d={ICON.landmark} size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{item.institution_name}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
              {item.last_synced_at
                ? `Synced ${formatRelativeTime(item.last_synced_at)} · ${item.accounts.length} account${item.accounts.length === 1 ? "" : "s"}`
                : "Not synced yet"}
              {item.needs_relink ? " · login required" : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 6 }}>
          <button onClick={doSync} disabled={syncing || busy} style={{ ...textBtnStyle(), color: COLORS.green, padding: "6px 10px" }} aria-label="Sync now">
            <Icon d={ICON.refresh} size={14} />
            {syncing ? "syncing…" : "sync"}
          </button>
          <button onClick={doRefresh} disabled={syncing || busy} style={{ ...textBtnStyle(), padding: "6px 10px" }} aria-label="Refresh balances">
            balances
          </button>
          <button onClick={doDisconnect} disabled={syncing || busy} style={{ ...textBtnStyle(), color: COLORS.red, padding: "6px 10px" }} aria-label="Disconnect">
            <Icon d={ICON.unlink} size={14} />
          </button>
        </div>
      </div>
      {item.needs_relink ? (
        <div role="alert" style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, fontSize: 12, fontWeight: 600 }}>
          The connection needs to be repaired. Disconnect and reconnect to re-authorize.
        </div>
      ) : null}
      {error ? (
        <div role="alert" style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, fontSize: 12, fontWeight: 600 }}>
          {error}
        </div>
      ) : null}
      <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
        {item.accounts.map((a) => (
          <div key={a.plaid_account_id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, fontSize: 12 }}>
            <div style={{ color: COLORS.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {a.name}{a.mask ? ` ····${a.mask}` : ""} · <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, color: COLORS.textFaint }}>{a.subtype || a.type}</span>
            </div>
            <div style={{ fontWeight: 700, color: COLORS.text }}>
              {a.current_balance_cents != null ? fmtUsd(a.current_balance_cents) : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionInboxRow({ txn, categories, onAfter }) {
  const initial = txn.predicted_category_label
    || (categories.find((c) => c.label.toLowerCase() === (txn.predicted_category_label || "").toLowerCase())?.label)
    || (categories[0]?.label || "");
  const [category, setCategory] = useState(initial);
  const [learn, setLearn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const sortedCats = useMemo(() => {
    return [...categories].sort((a, b) => {
      if ((a.group_key || "") !== (b.group_key || "")) return (a.group_key || "").localeCompare(b.group_key || "");
      return a.label.localeCompare(b.label);
    });
  }, [categories]);

  const accept = async () => {
    if (!category) return;
    setError(null);
    setBusy(true);
    const res = await importPlaidTransaction(txn.plaid_txn_id, category, { learn });
    setBusy(false);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  const dismiss = async () => {
    setBusy(true);
    const res = await dismissPlaidTransaction(txn.plaid_txn_id);
    setBusy(false);
    if (res.ok) onAfter?.();
    else setError(res.message);
  };

  return (
    <div className="bb-row" style={{ padding: "10px 4px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {txn.merchant_name || txn.name}
          </div>
          <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>
            {txn.date}
            {txn.account_name ? ` · ${txn.account_name}` : ""}
            {txn.pending ? " · pending" : ""}
            {txn.plaid_category_primary ? ` · ${titleCase(String(txn.plaid_category_primary).toLowerCase().replace(/_/g, " "))}` : ""}
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text, whiteSpace: "nowrap" }}>
          {fmtUsd(txn.amount_cents)}
        </div>
      </div>
      <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 6, alignItems: "center" }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Envelope"
          style={{ ...inputStyle(), fontWeight: 600, fontSize: 12, padding: "6px 10px" }}
        >
          {sortedCats.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}{c.group_key ? `  ·  ${c.group_key}` : ""}
            </option>
          ))}
        </select>
        <button onClick={accept} disabled={busy || !category} style={{ ...btnStyle(), background: COLORS.green, border: `1px solid ${COLORS.green}`, color: "#fff", padding: "6px 12px", fontSize: 12 }}>
          accept
        </button>
        <button onClick={dismiss} disabled={busy} style={{ ...textBtnStyle(), padding: "6px 10px", fontSize: 12 }}>
          skip
        </button>
      </div>
      <label style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: COLORS.textMuted, fontWeight: 500, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={learn}
          onChange={(e) => setLearn(e.target.checked)}
          style={{ accentColor: COLORS.green }}
        />
        Always send <strong style={{ fontWeight: 700, color: COLORS.text }}>{txn.merchant_name || txn.name.split(/\s+/).slice(0, 2).join(" ")}</strong> to <strong style={{ fontWeight: 700, color: COLORS.text }}>{category}</strong>
      </label>
      {error ? (
        <div role="alert" style={{ marginTop: 6, fontSize: 11, color: COLORS.red, fontWeight: 600 }}>{error}</div>
      ) : null}
    </div>
  );
}

function CreditInboxRow({ txn, onAfter }) {
  const [busy, setBusy] = useState(false);
  const dismiss = async () => {
    setBusy(true);
    await dismissPlaidTransaction(txn.plaid_txn_id);
    setBusy(false);
    onAfter?.();
  };
  return (
    <div className="bb-row" style={{ padding: "8px 4px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 10, alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {txn.merchant_name || txn.name}
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>
          {txn.date}{txn.account_name ? ` · ${txn.account_name}` : ""}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, whiteSpace: "nowrap" }}>
        {fmtUsd(Math.abs(txn.amount_cents))} in
      </div>
      <button onClick={dismiss} disabled={busy} style={{ ...textBtnStyle(), padding: "6px 10px", fontSize: 12 }}>
        dismiss
      </button>
    </div>
  );
}

function ImportedTxnRow({ txn, onAfter }) {
  const [busy, setBusy] = useState(false);
  const undo = async () => {
    setBusy(true);
    await undoPlaidTransaction(txn.plaid_txn_id);
    setBusy(false);
    onAfter?.();
  };
  return (
    <div className="bb-row" style={{ padding: "8px 4px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 10, alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {txn.merchant_name || txn.name}
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>
          {txn.date} · {txn.predicted_category_label || "—"}
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap" }}>
        {fmtUsd(txn.amount_cents)}
      </div>
      <button onClick={undo} disabled={busy} style={{ ...textBtnStyle(), padding: "6px 10px", fontSize: 12 }}>
        undo
      </button>
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
        <div className="bb-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", padding: "10px 4px" }}>
          <div>
            <div style={{ fontSize: 13.5, color: COLORS.textMuted, fontWeight: 500 }}>Appearance</div>
            <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>System follows your phone&apos;s setting.</div>
          </div>
          <ThemeToggle value={s.theme || "system"} onChange={(v) => set({ theme: v })} />
        </div>
      </BlockCard>
    </div>
  );
}

function ThemeToggle({ value, onChange }) {
  const opts = [
    { id: "system", label: "System" },
    { id: "light",  label: "Light" },
    { id: "dark",   label: "Dark" },
  ];
  return (
    <div role="radiogroup" aria-label="Theme" style={{ display: "inline-flex", padding: 2, borderRadius: 100, background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}` }}>
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
              padding: "6px 12px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.4,
              fontFamily: FONT,
              border: "none",
              cursor: "pointer",
              background: active ? COLORS.surface : "transparent",
              color: active ? COLORS.text : COLORS.textMuted,
              boxShadow: active ? "0 1px 2px rgba(15,23,41,0.06)" : "none",
              transition: "all 0.12s ease",
            }}
          >
            {o.label}
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
function MobileNav({ active, onChange, achievementsUnlocked, achievementsTotal, streak }) {
  return (
    <nav
      aria-label="Sections"
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 35,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        borderTop: `1px solid ${COLORS.border}`,
        padding: "6px 4px max(6px, env(safe-area-inset-bottom)) 4px",
        display: "grid",
        gridTemplateColumns: `repeat(${SIDEBAR_SECTIONS.length}, 1fr)`,
        gap: 0,
        fontFamily: FONT,
      }}
    >
      {SIDEBAR_SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={s.label}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 2px 4px",
              background: "transparent", border: "none", cursor: "pointer",
              color: isActive ? s.accent : COLORS.textMuted,
              fontFamily: FONT,
              position: "relative",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div style={{
              width: 36, height: 28, borderRadius: 14,
              background: isActive ? `${s.accent}1F` : "transparent",
              display: "grid", placeItems: "center",
              transition: "background 0.18s ease",
              position: "relative",
            }}>
              <Icon d={s.icon} size={18} />
              {s.id === "achievements" && achievementsUnlocked > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -4,
                  background: s.accent, color: "#fff",
                  fontSize: 9, fontWeight: 800,
                  padding: "1px 5px", borderRadius: 100,
                  lineHeight: 1.2, fontVariantNumeric: "tabular-nums",
                }}>{achievementsUnlocked}</span>
              )}
              {s.id === "habits" && streak > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -4,
                  background: s.accent, color: "#fff",
                  fontSize: 9, fontWeight: 800,
                  padding: "1px 5px", borderRadius: 100,
                  lineHeight: 1.2, fontVariantNumeric: "tabular-nums",
                }}>{streak}</span>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.01em",
              maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  { id: "dashboard",    label: "Dashboard",    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10", accent: "#3b6fd1" },
  { id: "envelopes",    label: "Envelopes",    icon: "M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z M10 12h4", accent: "#4a7c59" },
  { id: "bills",        label: "Bills",        icon: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", accent: "#0bafb0" },
  { id: "banking",      label: "Banking",      icon: "M3 22h18 M3 10h18 M5 6l7-3 7 3 M4 10v12 M20 10v12 M8 14v4 M12 14v4 M16 14v4", accent: "#138a60" },
  { id: "habits",       label: "Habits",       icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3", accent: "#d6448f" },
  { id: "goals",        label: "Goals",        icon: "M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6 M4 22h6", accent: "#c88318" },
  { id: "achievements", label: "Achievements", icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z", accent: "#8c5ad9" },
  { id: "reports",      label: "Reports",      icon: "M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6", accent: "#3b6fd1" },
  { id: "settings",     label: "Settings",     icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", accent: "#5f6675" },
];

function ProfileSwitcher({ profiles, activeId, onChange }) {
  const [open, setOpen] = useState(false);
  const active = profiles.find((p) => p.id === activeId) || profiles[0];
  if (!active) return null;
  return (
    <div style={{ position: "relative", marginTop: 12 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch active profile"
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "8px 10px", borderRadius: 10,
          background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
          cursor: "pointer", fontFamily: FONT, textAlign: "left",
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
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
          <div role="listbox" style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 31,
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: 4,
            boxShadow: "0 10px 28px rgba(13,20,36,0.18)",
          }}>
            {profiles.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { onChange(p.id); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 10px", borderRadius: 8,
                    background: isActive ? `${p.color}1A` : "transparent",
                    border: "none", cursor: "pointer", fontFamily: FONT,
                    color: COLORS.text, textAlign: "left",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = COLORS.surfaceTint; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: p.color, color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 10, fontWeight: 800, flexShrink: 0,
                  }}>{p.label.slice(0, 1).toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 600 }}>{p.label}</span>
                  {isActive && <Icon d="M20 6L9 17l-5-5" size={12} color={p.color} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Sidebar({ active, onChange, achievementsUnlocked, achievementsTotal, streak, lastEdit, pending, profiles, activeProfileId, onProfileChange }) {
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
        {profiles && profiles.length > 0 && (
          <ProfileSwitcher profiles={profiles} activeId={activeProfileId} onChange={onProfileChange} />
        )}
      </div>

      <nav style={{ padding: "12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {SIDEBAR_SECTIONS.map((s) => {
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

function OnboardingChecklist({ state, onJump, onDismiss }) {
  const [expanded, setExpanded] = useState(true);
  const status = useMemo(() => computeOnboarding(state), [state]);

  // Hide entirely once dismissed OR once all required steps are done.
  if (state.settings.onboarding_dismissed) return null;
  if (status.allRequiredDone) return null;

  const SECTION_LABELS = {
    dashboard: "Dashboard tiles",
    envelopes: "Envelopes",
    bills:     "Bills",
    banking:   "Banking",
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

function UpcomingBillsBanner({ state, onJump }) {
  const upcoming = useMemo(() => upcomingBills(state.bills || [], 7), [state.bills]);
  if (upcoming.length === 0) return null;
  const total = upcoming.reduce((s, b) => s + (b.amount_cents || 0), 0);
  const soonest = upcoming[0];
  const daysAway = soonest.days_away;
  const dayPhrase = daysAway === 0 ? "today" : daysAway === 1 ? "tomorrow" : `in ${daysAway} days`;
  return (
    <button
      onClick={onJump}
      aria-label={`${upcoming.length} bills due in the next 7 days — open bills`}
      style={{
        marginTop: 12, width: "100%", textAlign: "left",
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 14, padding: "12px 14px",
        cursor: "pointer", fontFamily: FONT,
        display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
        gap: 12, alignItems: "center",
        transition: "border-color 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0bafb0"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "rgba(11,175,176,0.10)", color: "#0bafb0",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon d={ICON.bell} size={18} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
          {fmtCompact(total)} due across {upcoming.length} bill{upcoming.length === 1 ? "" : "s"} in the next 7 days
        </div>
        <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textMuted, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Next: <strong style={{ color: COLORS.text }}>{soonest.label}</strong> — {fmtUsd(soonest.amount_cents)} {dayPhrase}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: COLORS.textMuted, whiteSpace: "nowrap" }}>
        Open bills
        <Icon d={ICON.chevR} size={12} />
      </div>
    </button>
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
