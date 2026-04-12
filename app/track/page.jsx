"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, ReferenceLine,
} from "recharts";

/* ── Supabase ─────────────────────────────────────────────────────── */
const SUPA_URL = "https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa = (path, opts = {}) =>
  fetch(SUPA_URL + "/rest/v1/" + path, {
    ...opts,
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "return=representation",
      ...(opts.headers || {}),
    },
  });
async function load(k, fb) {
  try {
    const r = await supa("app_data?key=eq." + k + "&select=value");
    const d = await r.json();
    return d && d.length > 0 && d[0].value != null ? d[0].value : fb;
  } catch { return fb; }
}
async function save(k, d) {
  try {
    await supa("app_data", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify({ key: k, value: d }),
    });
  } catch (e) { console.error("save:", k, e); }
}
const uid   = () => Math.random().toString(36).slice(2, 9);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const TODAY = new Date().toISOString().split("T")[0];
const DOW   = new Date().getDay(); // 0=Sun

/* ── Icons ────────────────────────────────────────────────────────── */
const Iv = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcToday   = () => <Iv d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const IcHabits  = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IcCal     = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
const IcBody    = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcHistory = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="4" rx="1"/><rect x="3" y="10" width="10" height="4" rx="1"/><rect x="3" y="16" width="7" height="4" rx="1"/><line x1="12" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>;
const IcGear    = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcAdmin   = () => <Iv d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />;
const IcPlus    = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcX       = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcChk     = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcFire    = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.43 2.3C11.13 4.2 10.73 6.33 10.91 7.8 8.64 6.2 8.5 3.7 8.5 3.7 5.6 5.7 4 9.12 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4.11-7.7-7.57-9.7z"/></svg>;
const IcArrow   = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcScale   = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="6"/><path d="M5 7l7-1 7 1"/><path d="M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>;

/* ── Defaults ─────────────────────────────────────────────────────── */
const DEF_CFG = {
  name: "Harrison",
  calGoal: 1500,
  proteinGoal: 160,
  carbGoal: 120,
  fatGoal: 60,
  tdee: 2100,
  weightGoal: 180,
  accent: "#2d6a4f",
  accentRgb: "45,106,79",
};

const DEF_HABITS = [
  { id: "h1", name: "Workout",            category: "Fitness",   active: true, created: TODAY },
  { id: "h2", name: "Hit Protein Goal",   category: "Nutrition", active: true, created: TODAY },
  { id: "h3", name: "Drink 8 Cups Water", category: "Health",    active: true, created: TODAY },
  { id: "h4", name: "Read 20 min",        category: "Mind",      active: true, created: TODAY },
  { id: "h5", name: "No Late Snacking",   category: "Nutrition", active: true, created: TODAY },
  { id: "h6", name: "Walk 7,000 Steps",   category: "Fitness",   active: true, created: TODAY },
  { id: "h7", name: "Meal Prep Sunday",   category: "Nutrition", active: true, created: TODAY },
];

const QUICK_FOODS = [
  { name: "Chicken Breast (4oz)",             cals: 185, protein: 35, carbs: 0,  fat: 4  },
  { name: "Chicken Thigh boneless (4oz)",     cals: 210, protein: 28, carbs: 0,  fat: 11 },
  { name: "Ground Beef 70/30 rinsed (4oz)",   cals: 215, protein: 25, carbs: 0,  fat: 13 },
  { name: "Eggs (2 large)",                   cals: 140, protein: 12, carbs: 1,  fat: 10 },
  { name: "Broccoli cooked (1 cup)",          cals: 55,  protein: 4,  carbs: 11, fat: 1  },
  { name: "White Rice cooked (1 cup)",        cals: 205, protein: 4,  carbs: 45, fat: 0  },
  { name: "Protein Shake (1 scoop)",          cals: 120, protein: 25, carbs: 3,  fat: 2  },
  { name: "Greek Yogurt nonfat (1 cup)",      cals: 130, protein: 23, carbs: 9,  fat: 0  },
  { name: "Sweet Potato (medium)",            cals: 130, protein: 3,  carbs: 30, fat: 0  },
  { name: "Cottage Cheese (1/2 cup)",         cals: 90,  protein: 14, carbs: 5,  fat: 1  },
  { name: "Black Coffee",                     cals: 5,   protein: 0,  carbs: 1,  fat: 0  },
  { name: "Banana",                           cals: 105, protein: 1,  carbs: 27, fat: 0  },
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const CAT_COLORS = { Fitness: "#3b82f6", Nutrition: "#2d6a4f", Health: "#8b5cf6", Mind: "#f59e0b", Other: "#6b7280" };

/* ── CSS ──────────────────────────────────────────────────────────── */
const S = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.trk { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 13px; color: #1a1714; background: #f2f1ee; color-scheme: light !important; }
.trk-side { width: 216px; min-width: 216px; background: #1a1714; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.trk-main { flex: 1; min-width: 0; padding: 32px 32px 60px; }
.trk-logo { padding: 20px 16px 16px; font-size: 14px; font-weight: 800; color: #f5f0e8; letter-spacing: -.3px; border-bottom: 1px solid rgba(255,255,255,.06); }
.trk-logo span { opacity: .55; font-weight: 500; font-size: 11px; display: block; margin-top: 2px; letter-spacing: 0; }
.s-lbl { font-size: 9px; font-weight: 700; color: rgba(255,255,255,.28); text-transform: uppercase; letter-spacing: 1.2px; padding: 12px 16px 4px; }
.sn { display: flex; align-items: center; gap: 9px; padding: 7px 12px; margin: 1px 6px; border-radius: 7px; cursor: pointer; color: rgba(255,255,255,.58); font-size: 12px; font-weight: 500; transition: all .15s; user-select: none; }
.sn:hover { background: rgba(255,255,255,.07); color: #fff; }
.sn.on { color: #fff; font-weight: 700; }
.trk-spacer { flex: 1; }
.trk-divider { border: none; border-top: 1px solid rgba(255,255,255,.06); margin: 8px 0; }
.card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,.06); padding: 22px; margin-bottom: 16px; }
.card-sm { background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,.06); padding: 16px 18px; }
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
.pg-hd { font-size: 20px; font-weight: 800; color: #1a1714; }
.pg-sub { font-size: 12px; color: #6b5e52; margin-top: 2px; margin-bottom: 24px; }
.sec-hd { font-size: 10px; font-weight: 700; color: #7a7067; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 10px; }
.stat-num { font-size: 30px; font-weight: 800; line-height: 1; color: #1a1714; }
.stat-lbl { font-size: 11px; color: #6b5e52; margin-top: 4px; }
.tbtn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; font-family: inherit; transition: all .15s; }
.tbtn-p { color: #fff; }
.tbtn-p:hover { opacity: .88; }
.tbtn-out { background: transparent; border: 1px solid rgba(0,0,0,.12); color: #1a1714; }
.tbtn-out:hover { background: rgba(0,0,0,.04); }
.tbtn-red { background: #c45c4a; color: #fff; }
.tbtn-sm { padding: 5px 11px; font-size: 11px; border-radius: 7px; }
.inp { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,.1); font-size: 12px; font-family: inherit; outline: none; background: #fff; transition: border-color .15s, box-shadow .15s; }
.inp:focus { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(var(--acc-rgb), .12); }
.lbl { font-size: 10px; font-weight: 700; color: #6b5e52; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; display: block; }
.fld { margin-bottom: 12px; }
.err { font-size: 10px; color: #c45c4a; margin-top: 4px; font-weight: 600; }
.habit-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; border: 1px solid rgba(0,0,0,.06); background: #faf9f7; margin-bottom: 8px; transition: border-color .15s; }
.habit-row:hover { border-color: rgba(var(--acc-rgb), .25); }
.hchk { width: 22px; height: 22px; border-radius: 6px; border: 2px solid rgba(0,0,0,.15); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
.hchk.done { border-color: var(--acc); }
.streak-pill { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgba(245,158,11,.1); color: #92400e; display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
.streak-pill.hot { background: rgba(239,68,68,.1); color: #991b1b; }
.streak-pill.zero { background: rgba(0,0,0,.05); color: #999; }
.macro-wrap { margin-bottom: 10px; }
.macro-bg { height: 7px; background: rgba(0,0,0,.07); border-radius: 4px; overflow: hidden; margin-top: 4px; }
.macro-fill { height: 100%; border-radius: 4px; transition: width .5s cubic-bezier(.4,0,.2,1); }
.food-row { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,.06); background: #faf9f7; margin-bottom: 6px; }
.badge { display: inline-block; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; }
.badge-g { background: rgba(45,106,79,.1); color: #2d6a4f; }
.badge-r { background: rgba(196,92,74,.1); color: #c45c4a; }
.badge-y { background: rgba(212,168,83,.1); color: #9a7422; }
.badge-b { background: rgba(59,130,246,.1); color: #1d4ed8; }
.mini-tabs { display: flex; gap: 4px; margin-bottom: 18px; }
.mini-tab { padding: 5px 13px; border-radius: 7px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid rgba(0,0,0,.1); background: transparent; color: #6b5e52; font-family: inherit; transition: all .15s; }
.mini-tab.on { color: #fff; border-color: transparent; }
.heat-cell { width: 13px; height: 13px; border-radius: 2px; flex-shrink: 0; }
.mbg { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 200; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 20px; }
.mbox { background: #fff; border-radius: 16px; width: 100%; max-width: 480px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.mft { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,.06); }
.fasting-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(0,0,0,.05); color: #5c4a3a; }
.score-grade { font-size: 48px; font-weight: 900; line-height: 1; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
.shake { animation: shake .38s ease; }
@keyframes pop { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.07)} 100%{transform:scale(1);opacity:1} }
.pop { animation: pop .25s ease forwards; }
@media(max-width:768px){
  .trk-side{display:none}
  .trk-main{padding:16px 14px 60px}
  .g2,.g3,.g4{grid-template-columns:1fr}
}
`;

/* ── Helpers ──────────────────────────────────────────────────────── */
function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

function calcStreak(logs, habitId) {
  const done = new Set(
    logs.filter(l => l.habitId === habitId && l.done).map(l => l.date)
  );
  let current = 0;
  let i = 0;
  while (true) {
    const ds = dateStr(-i);
    if (done.has(ds)) { current++; i++; } else break;
  }
  // Best streak
  const sorted = [...done].sort();
  let best = 0, run = 0, prev = null;
  for (const ds of sorted) {
    if (prev) {
      const diff = (new Date(ds) - new Date(prev)) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else { run = 1; }
    best = Math.max(best, run);
    prev = ds;
  }
  best = Math.max(best, current);
  return { current, best };
}

function weeklyDots(logs, habitId) {
  return Array.from({ length: 7 }, (_, i) => {
    const ds = dateStr(-(6 - i));
    return logs.some(l => l.habitId === habitId && l.date === ds && l.done);
  });
}

function consistencyScore(logs, habits, days = 30) {
  const active = habits.filter(h => h.active);
  if (!active.length) return 0;
  let total = 0, done = 0;
  for (let i = 0; i < days; i++) {
    const ds = dateStr(-i);
    total += active.length;
    done += active.filter(h => logs.some(l => l.habitId === h.id && l.date === ds && l.done)).length;
  }
  return total ? Math.round((done / total) * 100) : 0;
}

function scoreGrade(pct) {
  if (pct >= 90) return { grade: "A", color: "#2d6a4f" };
  if (pct >= 80) return { grade: "B", color: "#3b82f6" };
  if (pct >= 70) return { grade: "C", color: "#f59e0b" };
  if (pct >= 60) return { grade: "D", color: "#f97316" };
  return { grade: "F", color: "#c45c4a" };
}

function formatFasting(ts) {
  if (!ts) return null;
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? h + "h " + m + "m" : m + "m";
}

function dayLabel(ds) {
  const d = new Date(ds + "T00:00:00");
  return (d.getMonth() + 1) + "/" + d.getDate();
}

function friendlyDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function sumCals(entries) {
  return entries.reduce((s, e) => s + (Number(e.cals) || 0), 0);
}
function sumMacro(entries, key) {
  return entries.reduce((s, e) => s + (Number(e[key]) || 0), 0);
}

/* ── CalRing SVG ──────────────────────────────────────────────────── */
function CalRing({ eaten, goal, accent }) {
  const R = 54, C = 2 * Math.PI * R;
  const pct = clamp(eaten / Math.max(goal, 1), 0, 1);
  const over = eaten > goal;
  const fill = pct * C;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={65} cy={65} r={R} fill="none" stroke="rgba(0,0,0,.07)" strokeWidth={10} />
      <circle cx={65} cy={65} r={R} fill="none"
        stroke={over ? "#c45c4a" : accent}
        strokeWidth={10}
        strokeDasharray={C}
        strokeDashoffset={C - fill}
        strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px", transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x={65} y={60} textAnchor="middle" fontSize={22} fontWeight={800} fill="#1a1714" fontFamily="inherit">
        {eaten > 999 ? Math.round(eaten / 100) / 10 + "k" : eaten}
      </text>
      <text x={65} y={74} textAnchor="middle" fontSize={10} fill="#6b5e52" fontFamily="inherit">
        eaten
      </text>
      <text x={65} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill={over ? "#c45c4a" : "#2d6a4f"} fontFamily="inherit">
        {over ? "+" + (eaten - goal) + " over" : (goal - eaten) + " left"}
      </text>
    </svg>
  );
}

/* ── MacroBar ─────────────────────────────────────────────────────── */
function MacroBar({ label, eaten, goal, color }) {
  const pct = clamp(eaten / Math.max(goal, 1), 0, 1);
  const over = eaten > goal;
  return (
    <div className="macro-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#5c4a3a" }}>{label}</span>
        <span style={{ fontSize: 10, color: over ? "#c45c4a" : "#6b5e52", fontWeight: over ? 700 : 400 }}>
          {eaten}<span style={{ color: "#aaa" }}>/{goal}g</span>
        </span>
      </div>
      <div className="macro-bg">
        <div className="macro-fill" style={{ width: (pct * 100) + "%", background: over ? "#c45c4a" : color }} />
      </div>
    </div>
  );
}

/* ── HabitCheck ───────────────────────────────────────────────────── */
function HabitCheck({ done, accent, onToggle }) {
  return (
    <div className={"hchk" + (done ? " done" : "")}
      style={done ? { background: accent } : {}}
      onClick={onToggle}>
      {done && <span style={{ color: "#fff" }}><IcChk /></span>}
    </div>
  );
}

/* ── WeekDots ─────────────────────────────────────────────────────── */
function WeekDots({ dots, accent }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {dots.map((done, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: 2,
          background: done ? accent : "rgba(0,0,0,.08)",
          title: days[i],
        }} />
      ))}
    </div>
  );
}

/* ── HeatMap ──────────────────────────────────────────────────────── */
function HeatMap({ logs, habits, weeks = 16, accent }) {
  const active = habits.filter(h => h.active);
  const total = active.length || 1;
  const cells = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const offset = -(w * 7 + (6 - d));
      const ds = dateStr(offset);
      const done = active.filter(h => logs.some(l => l.habitId === h.id && l.date === ds && l.done)).length;
      const pct = done / total;
      col.push({ ds, pct, done, total });
    }
    cells.push(col);
  }
  const alpha = (pct) => {
    if (pct === 0) return "rgba(0,0,0,.07)";
    if (pct < 0.34) return accent + "44";
    if (pct < 0.67) return accent + "88";
    if (pct < 1) return accent + "cc";
    return accent;
  };
  return (
    <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
      {cells.map((col, wi) => (
        <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {col.map((cell, di) => (
            <div key={di} className="heat-cell"
              style={{ background: alpha(cell.pct) }}
              title={cell.ds + " - " + cell.done + "/" + cell.total + " habits"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */
export default function TrackPage() {
  const [tab, setTab]         = useState("today");
  const [loaded, setLoaded]   = useState(false);
  const [cfg, setCfg]         = useState(DEF_CFG);
  const [habits, setHabits]   = useState(DEF_HABITS);
  const [logs, setLogs]       = useState([]);      // [{id,date,habitId,done}]
  const [calLog, setCalLog]   = useState([]);      // [{id,date,ts,name,cals,protein,carbs,fat,meal}]
  const [weight, setWeight]   = useState([]);      // [{id,date,lbs}]
  const [modal, setModal]     = useState(null);
  const [shake, setShake]     = useState(false);
  const [now, setNow]         = useState(Date.now());
  const [sideOpen, setSideOpen] = useState(false);

  // Fasting clock — tick every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Load
  useEffect(() => {
    (async () => {
      const [c, h, l, cl, w] = await Promise.all([
        load("trk-cfg", DEF_CFG),
        load("trk-habits", DEF_HABITS),
        load("trk-logs", []),
        load("trk-callog", []),
        load("trk-weight", []),
      ]);
      setCfg({ ...DEF_CFG, ...c });
      setHabits(h);
      setLogs(l);
      setCalLog(cl);
      setWeight(w);
      setLoaded(true);
    })();
  }, []);

  // Autosave
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      Promise.all([
        save("trk-cfg", cfg),
        save("trk-habits", habits),
        save("trk-logs", logs),
        save("trk-callog", calLog),
        save("trk-weight", weight),
      ]);
    }, 700);
    return () => clearTimeout(t);
  }, [cfg, habits, logs, calLog, weight, loaded]);

  const acc     = cfg.accent || "#2d6a4f";
  const accRgb  = cfg.accentRgb || "45,106,79";

  // Today calorie totals
  const todayEntries = useMemo(() => calLog.filter(e => e.date === TODAY), [calLog]);
  const todayCals    = sumCals(todayEntries);
  const todayP       = sumMacro(todayEntries, "protein");
  const todayC       = sumMacro(todayEntries, "carbs");
  const todayF       = sumMacro(todayEntries, "fat");
  const deficit      = (cfg.tdee || 2100) - todayCals;

  // Fasting timer
  const lastMealTs = useMemo(() => {
    const all = [...calLog].filter(e => e.ts).sort((a, b) => b.ts.localeCompare(a.ts));
    return all.length ? all[0].ts : null;
  }, [calLog, now]);
  const fastingStr = formatFasting(lastMealTs);

  // Today's habits
  const todayLogs = useMemo(() => logs.filter(l => l.date === TODAY), [logs]);
  const activeHabits = useMemo(() => habits.filter(h => h.active), [habits]);
  const habitsDoneToday = activeHabits.filter(h => todayLogs.some(l => l.habitId === h.id && l.done)).length;

  // Weight
  const sortedWeight = useMemo(() => [...weight].sort((a, b) => a.date.localeCompare(b.date)), [weight]);
  const latestWeight = sortedWeight.length ? sortedWeight[sortedWeight.length - 1].lbs : null;
  const prevWeight   = sortedWeight.length > 1 ? sortedWeight[sortedWeight.length - 2].lbs : null;
  const weightDelta  = latestWeight && prevWeight ? (latestWeight - prevWeight).toFixed(1) : null;
  const lbsToGoal    = latestWeight ? (latestWeight - cfg.weightGoal).toFixed(1) : null;

  // Consistency
  const consistency = useMemo(() => consistencyScore(logs, habits, 30), [logs, habits]);
  const { grade, color: gradeColor } = scoreGrade(consistency);

  // Calorie chart — last 14 days
  const calChart = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const ds = dateStr(-(13 - i));
    const total = calLog.filter(e => e.date === ds).reduce((s, e) => s + (Number(e.cals) || 0), 0);
    return { day: dayLabel(ds), cals: total, goal: cfg.calGoal };
  }), [calLog, cfg.calGoal]);

  // Weight chart — last 30 entries
  const weightChart = useMemo(() =>
    sortedWeight.slice(-30).map(w => ({ date: dayLabel(w.date), lbs: w.lbs, goal: cfg.weightGoal })),
    [sortedWeight, cfg.weightGoal]);

  function toggleHabit(habitId) {
    const existing = todayLogs.find(l => l.habitId === habitId);
    if (existing) {
      setLogs(prev => prev.map(l => l.id === existing.id ? { ...l, done: !l.done } : l));
    } else {
      setLogs(prev => [...prev, { id: uid(), date: TODAY, habitId, done: true }]);
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  }

  // ── Tab: Today ─────────────────────────────────────────────────────
  function TabToday() {
    const isSunday = DOW === 0;
    return (
      <div>
        <div className="pg-hd">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          {cfg.name || "there"}
        </div>
        <div className="pg-sub">{friendlyDate()}</div>

        {isSunday && (
          <div style={{ background: "rgba(45,106,79,.08)", border: "1px solid rgba(45,106,79,.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "#2d6a4f", fontWeight: 600 }}>
            Sunday meal prep day - log your Meal Prep habit when done!
          </div>
        )}

        {/* Calorie overview */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="sec-hd">Today's Nutrition</div>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <CalRing eaten={todayCals} goal={cfg.calGoal} accent={acc} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <MacroBar label="Protein" eaten={todayP} goal={cfg.proteinGoal} color="#3b82f6" />
              <MacroBar label="Carbs"   eaten={todayC} goal={cfg.carbGoal}    color="#f59e0b" />
              <MacroBar label="Fat"     eaten={todayF} goal={cfg.fatGoal}     color="#f97316" />
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className={"badge " + (deficit >= 0 ? "badge-g" : "badge-r")}>
                  {deficit >= 0 ? "-" + deficit : "+" + Math.abs(deficit)} cal vs TDEE
                </span>
                {fastingStr && (
                  <span className="fasting-pill">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Fasting {fastingStr}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 10 }}>
                <button className="tbtn tbtn-p tbtn-sm" style={{ background: acc }} onClick={() => setModal({ type: "addFood" })}>
                  <IcPlus /> Log Food
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Habits today */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="sec-hd" style={{ marginBottom: 0 }}>Today's Habits</div>
            <span className={"badge " + (habitsDoneToday === activeHabits.length ? "badge-g" : habitsDoneToday > 0 ? "badge-y" : "badge-r")}>
              {habitsDoneToday}/{activeHabits.length} done
            </span>
          </div>
          {activeHabits.length === 0 && (
            <div style={{ color: "#aaa", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              No habits yet. Go to Habits tab to add some.
            </div>
          )}
          {activeHabits.map(h => {
            const isDone = todayLogs.some(l => l.habitId === h.id && l.done);
            const { current } = calcStreak(logs, h.id);
            const isHot = current >= 5;
            return (
              <div key={h.id} className="habit-row" style={isDone ? { opacity: .75 } : {}}>
                <HabitCheck done={isDone} accent={acc} onToggle={() => toggleHabit(h.id)} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: isDone ? 500 : 600, color: isDone ? "#999" : "#1a1714", textDecoration: isDone ? "line-through" : "none" }}>
                  {h.name}
                </span>
                <span style={{ fontSize: 10, color: CAT_COLORS[h.category] || "#aaa", fontWeight: 600, marginRight: 4 }}>
                  {h.category}
                </span>
                {current > 0 ? (
                  <div className={"streak-pill" + (isHot ? " hot" : "")}>
                    <IcFire />
                    {current}d
                  </div>
                ) : (
                  <div className="streak-pill zero">--</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stat row */}
        <div className="g4" style={{ marginTop: 0 }}>
          <div className="card-sm">
            <div className="stat-num">{todayCals}</div>
            <div className="stat-lbl">cal eaten</div>
          </div>
          <div className="card-sm">
            <div className="stat-num" style={{ color: deficit >= 0 ? "#2d6a4f" : "#c45c4a" }}>
              {deficit >= 0 ? deficit : "+" + Math.abs(deficit)}
            </div>
            <div className="stat-lbl">{deficit >= 0 ? "cal deficit" : "cal surplus"}</div>
          </div>
          <div className="card-sm">
            <div className="stat-num">{todayP}g</div>
            <div className="stat-lbl">protein</div>
          </div>
          <div className="card-sm">
            <div className="stat-num">{consistency}%</div>
            <div className="stat-lbl">30-day consistency</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Tab: Habits ────────────────────────────────────────────────────
  function TabHabits() {
    const [addForm, setAddForm]   = useState(null); // null | {name, category}
    const [editId, setEditId]     = useState(null);
    const [fErrs, setFErrs]       = useState({});
    const [shk, setShk]           = useState(false);

    function submitHabit() {
      const e = {};
      if (!addForm.name || !addForm.name.trim()) e.name = "Habit name is required";
      if (Object.keys(e).length) { setFErrs(e); setShk(true); setTimeout(() => setShk(false), 420); return; }
      if (editId) {
        setHabits(prev => prev.map(h => h.id === editId ? { ...h, ...addForm } : h));
      } else {
        setHabits(prev => [...prev, { id: uid(), ...addForm, active: true, created: TODAY }]);
      }
      setAddForm(null); setEditId(null); setFErrs({});
    }

    return (
      <div>
        <div className="pg-hd">Habits</div>
        <div className="pg-sub">Track daily habits and build streaks</div>

        {/* Consistency hero */}
        <div className="card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ textAlign: "center" }}>
            <div className="score-grade" style={{ color: gradeColor }}>{grade}</div>
            <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 4 }}>30-day grade</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1714" }}>{consistency}%</div>
            <div style={{ fontSize: 12, color: "#6b5e52", marginBottom: 10 }}>consistency over last 30 days</div>
            <div style={{ height: 8, background: "rgba(0,0,0,.07)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: consistency + "%", background: gradeColor, borderRadius: 4, transition: "width .6s ease" }} />
            </div>
            <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 6 }}>
              {habitsDoneToday}/{activeHabits.length} habits done today
            </div>
          </div>
        </div>

        {/* Habit list */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="sec-hd" style={{ marginBottom: 0 }}>All Habits</div>
            <button className="tbtn tbtn-p tbtn-sm" style={{ background: acc }}
              onClick={() => { setAddForm({ name: "", category: "Health" }); setEditId(null); setFErrs({}); }}>
              <IcPlus /> Add Habit
            </button>
          </div>

          {addForm !== null && (
            <div className={"card-sm" + (shk ? " shake" : "")} style={{ marginBottom: 14, border: "1px solid rgba(45,106,79,.2)", background: "rgba(45,106,79,.03)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: "#1a1714" }}>
                {editId ? "Edit Habit" : "New Habit"}
              </div>
              <div className="g2" style={{ gap: 10, marginBottom: 0 }}>
                <div className="fld">
                  <label className="lbl">Habit Name</label>
                  <input className="inp" value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Walk 30 minutes" />
                  {fErrs.name && <div className="err">{fErrs.name}</div>}
                </div>
                <div className="fld">
                  <label className="lbl">Category</label>
                  <select className="inp" value={addForm.category}
                    onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}>
                    {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="tbtn tbtn-p tbtn-sm" style={{ background: acc }} onClick={submitHabit}>
                  {editId ? "Save Changes" : "Add Habit"}
                </button>
                <button className="tbtn tbtn-out tbtn-sm" onClick={() => { setAddForm(null); setEditId(null); }}>Cancel</button>
              </div>
            </div>
          )}

          {habits.map(h => {
            const isDone = todayLogs.some(l => l.habitId === h.id && l.done);
            const { current, best } = calcStreak(logs, h.id);
            const dots = weeklyDots(logs, h.id);
            const isHot = current >= 5;
            return (
              <div key={h.id} className="habit-row" style={{ opacity: h.active ? 1 : .45 }}>
                <HabitCheck done={isDone} accent={acc} onToggle={() => h.active && toggleHabit(h.id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1714" }}>{h.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: CAT_COLORS[h.category] || "#aaa", textTransform: "uppercase", letterSpacing: .6 }}>
                      {h.category}
                    </span>
                    {!h.active && <span className="badge badge-r">Paused</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                    <WeekDots dots={dots} accent={acc} />
                    <span style={{ fontSize: 10, color: "#aaa" }}>7-day</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <div className={"streak-pill" + (isHot ? " hot" : current === 0 ? " zero" : "")}>
                    {current > 0 ? <IcFire /> : null}
                    {current > 0 ? current + " day streak" : "No streak"}
                  </div>
                  <span style={{ fontSize: 10, color: "#aaa" }}>Best: {best}d</span>
                </div>
                <button className="tbtn tbtn-out tbtn-sm" style={{ marginLeft: 6 }}
                  onClick={() => { setAddForm({ name: h.name, category: h.category }); setEditId(h.id); setFErrs({}); }}>
                  Edit
                </button>
                <button className="tbtn tbtn-out tbtn-sm"
                  onClick={() => setHabits(prev => prev.map(x => x.id === h.id ? { ...x, active: !x.active } : x))}>
                  {h.active ? "Pause" : "Resume"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Heatmap */}
        <div className="card">
          <div className="sec-hd">Habit Completion History (16 weeks)</div>
          <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#aaa" }}>
            <span>Less</span>
            {["rgba(0,0,0,.07)", acc + "44", acc + "88", acc + "cc", acc].map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />
            ))}
            <span>More</span>
          </div>
          <HeatMap logs={logs} habits={habits} weeks={16} accent={acc} />
        </div>
      </div>
    );
  }

  // ── Tab: Calories ──────────────────────────────────────────────────
  function TabCalories() {
    const [view, setView]       = useState("log"); // log | chart
    const [showQuick, setShowQuick] = useState(false);

    return (
      <div>
        <div className="pg-hd">Calories</div>
        <div className="pg-sub">Food log and macro tracking</div>

        <div className="mini-tabs">
          {["log", "chart"].map(v => (
            <button key={v} className={"mini-tab" + (view === v ? " on" : "")}
              style={view === v ? { background: acc, borderColor: acc } : {}}
              onClick={() => setView(v)}>
              {v === "log" ? "Today's Log" : "7-Day Chart"}
            </button>
          ))}
        </div>

        {view === "log" && (
          <div>
            {/* Macro summary */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <CalRing eaten={todayCals} goal={cfg.calGoal} accent={acc} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <MacroBar label="Protein" eaten={todayP} goal={cfg.proteinGoal} color="#3b82f6" />
                  <MacroBar label="Carbs"   eaten={todayC} goal={cfg.carbGoal}    color="#f59e0b" />
                  <MacroBar label="Fat"     eaten={todayF} goal={cfg.fatGoal}     color="#f97316" />
                  <div style={{ marginTop: 12, fontSize: 11, color: "#6b5e52" }}>
                    Protein remaining:{" "}
                    <strong style={{ color: "#3b82f6" }}>
                      {Math.max(0, cfg.proteinGoal - todayP)}g
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal groups */}
            {MEAL_TYPES.map(meal => {
              const entries = todayEntries.filter(e => e.meal === meal);
              const mealCals = sumCals(entries);
              return (
                <div key={meal} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1714" }}>{meal}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {mealCals > 0 && <span style={{ fontSize: 11, color: "#6b5e52", fontWeight: 600 }}>{mealCals} cal</span>}
                      <button className="tbtn tbtn-p tbtn-sm" style={{ background: acc }}
                        onClick={() => setModal({ type: "addFood", meal })}>
                        <IcPlus />
                      </button>
                    </div>
                  </div>
                  {entries.length === 0 && (
                    <div style={{ fontSize: 11, color: "#aaa", paddingBottom: 4 }}>Nothing logged yet</div>
                  )}
                  {entries.map(e => (
                    <div key={e.id} className="food-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{e.name}</div>
                        <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>
                          P: {e.protein || 0}g &bull; C: {e.carbs || 0}g &bull; F: {e.fat || 0}g
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#1a1714", minWidth: 44, textAlign: "right" }}>
                        {e.cals}
                      </span>
                      <button onClick={() => setCalLog(prev => prev.filter(x => x.id !== e.id))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", padding: "2px 4px", borderRadius: 4 }}>
                        <IcX />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Quick-add presets */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div className="sec-hd" style={{ marginBottom: 0 }}>Quick Add</div>
                <button className="tbtn tbtn-out tbtn-sm" onClick={() => setShowQuick(s => !s)}>
                  {showQuick ? "Hide" : "Show Presets"}
                </button>
              </div>
              {showQuick && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {QUICK_FOODS.map((f, i) => (
                    <button key={i} className="tbtn tbtn-out tbtn-sm"
                      style={{ justifyContent: "space-between", padding: "7px 10px", textAlign: "left" }}
                      onClick={() => {
                        const entry = { id: uid(), date: TODAY, ts: new Date().toISOString(), name: f.name, cals: f.cals, protein: f.protein, carbs: f.carbs, fat: f.fat, meal: "Snacks" };
                        setCalLog(prev => [...prev, entry]);
                      }}>
                      <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: acc, fontWeight: 700, flexShrink: 0 }}>{f.cals}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "chart" && (
          <div className="card">
            <div className="sec-hd">Calories - Last 14 Days</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={calChart} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
                <XAxis dataKey="day" fontSize={9} tick={{ fill: "#aaa" }} />
                <YAxis fontSize={9} tick={{ fill: "#aaa" }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <ReferenceLine y={cfg.calGoal} stroke={acc} strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "Goal", fontSize: 9, fill: acc }} />
                <Bar dataKey="cals" fill={acc} opacity={.8} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  // ── Tab: Body ──────────────────────────────────────────────────────
  function TabBody() {
    const [wForm, setWForm]   = useState({ lbs: "", date: TODAY });
    const [wErrs, setWErrs]   = useState({});
    const [wShk, setWShk]     = useState(false);

    function logWeight() {
      const e = {};
      if (!wForm.lbs || isNaN(Number(wForm.lbs)) || Number(wForm.lbs) <= 0) e.lbs = "Enter a valid weight";
      if (!wForm.date) e.date = "Date required";
      if (Object.keys(e).length) { setWErrs(e); setWShk(true); setTimeout(() => setWShk(false), 420); return; }
      const entry = { id: uid(), date: wForm.date, lbs: Number(wForm.lbs) };
      setWeight(prev => {
        const filtered = prev.filter(w => w.date !== wForm.date);
        return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
      });
      setWForm({ lbs: "", date: TODAY });
      setWErrs({});
    }

    const startWeight = sortedWeight.length ? sortedWeight[0].lbs : null;
    const lbsLost = startWeight && latestWeight ? (startWeight - latestWeight).toFixed(1) : null;
    const paceLabel = (() => {
      if (sortedWeight.length < 7) return null;
      const old = sortedWeight[sortedWeight.length - 7];
      const rate = ((old.lbs - latestWeight) / 7 * 7).toFixed(1);
      return rate + " lbs/wk";
    })();

    return (
      <div>
        <div className="pg-hd">Body</div>
        <div className="pg-sub">Weight tracking and progress</div>

        {/* Stat cards */}
        <div className="g4" style={{ marginBottom: 16 }}>
          <div className="card-sm">
            <div className="stat-num">{latestWeight || "--"}</div>
            <div className="stat-lbl">current lbs</div>
          </div>
          <div className="card-sm">
            <div className="stat-num" style={{ color: weightDelta < 0 ? "#2d6a4f" : "#c45c4a" }}>
              {weightDelta ? (weightDelta > 0 ? "+" : "") + weightDelta : "--"}
            </div>
            <div className="stat-lbl">since last weigh-in</div>
          </div>
          <div className="card-sm">
            <div className="stat-num" style={{ color: lbsToGoal > 0 ? "#c45c4a" : "#2d6a4f" }}>
              {lbsLost ? (lbsLost > 0 ? "-" : "+") + Math.abs(lbsLost) : "--"}
            </div>
            <div className="stat-lbl">lbs lost total</div>
          </div>
          <div className="card-sm">
            <div className="stat-num" style={{ color: lbsToGoal > 0 ? "#f97316" : "#2d6a4f" }}>
              {lbsToGoal !== null ? Math.abs(lbsToGoal) : "--"}
            </div>
            <div className="stat-lbl">{lbsToGoal > 0 ? "lbs to goal" : lbsToGoal < 0 ? "below goal" : "at goal!"}</div>
          </div>
        </div>

        {/* Log form */}
        <div className={"card" + (wShk ? " shake" : "")} style={{ marginBottom: 16 }}>
          <div className="sec-hd">Log Weight</div>
          <div className="g2" style={{ gap: 12, marginBottom: 0 }}>
            <div className="fld">
              <label className="lbl">Weight (lbs)</label>
              <input className="inp" type="number" step="0.1" value={wForm.lbs} placeholder="e.g. 195.5"
                onChange={e => setWForm(f => ({ ...f, lbs: e.target.value }))} />
              {wErrs.lbs && <div className="err">{wErrs.lbs}</div>}
            </div>
            <div className="fld">
              <label className="lbl">Date</label>
              <input className="inp" type="date" value={wForm.date}
                onChange={e => setWForm(f => ({ ...f, date: e.target.value }))} />
              {wErrs.date && <div className="err">{wErrs.date}</div>}
            </div>
          </div>
          <button className="tbtn tbtn-p" style={{ background: acc }} onClick={logWeight}>
            Save Weight
          </button>
          {paceLabel && (
            <span style={{ marginLeft: 12, fontSize: 11, color: "#6b5e52" }}>
              Current pace: <strong>{paceLabel}</strong>
            </span>
          )}
        </div>

        {/* Chart */}
        {weightChart.length > 1 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="sec-hd">Weight Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
                <XAxis dataKey="date" fontSize={9} tick={{ fill: "#aaa" }} />
                <YAxis domain={["auto", "auto"]} fontSize={9} tick={{ fill: "#aaa" }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <ReferenceLine y={cfg.weightGoal} stroke="#4a7c59" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "Goal", fontSize: 9, fill: "#4a7c59" }} />
                <Line type="monotone" dataKey="lbs" stroke={acc} strokeWidth={2.5} dot={{ r: 3, fill: acc }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Log */}
        <div className="card">
          <div className="sec-hd">Weight Log</div>
          {sortedWeight.length === 0 && <div style={{ color: "#aaa", fontSize: 12 }}>No entries yet.</div>}
          {[...sortedWeight].reverse().slice(0, 20).map(w => (
            <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,.05)" }}>
              <span style={{ fontSize: 12, color: "#5c4a3a" }}>{dayLabel(w.date)}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1714" }}>{w.lbs} lbs</span>
              <button onClick={() => setWeight(prev => prev.filter(x => x.id !== w.id))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", padding: "2px 4px" }}>
                <IcX />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Tab: History ───────────────────────────────────────────────────
  function TabHistory() {
    return (
      <div>
        <div className="pg-hd">History</div>
        <div className="pg-sub">Long-term trends and habit streaks</div>

        {/* Habit streaks table */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="sec-hd">Streak Records</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", padding: "4px 0 8px" }}>Habit</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", padding: "4px 0 8px", textAlign: "center" }}>Current</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", padding: "4px 0 8px", textAlign: "center" }}>Best</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#aaa", textTransform: "uppercase", padding: "4px 0 8px", textAlign: "center" }}>30d %</div>
            {habits.filter(h => h.active).map(h => {
              const { current, best } = calcStreak(logs, h.id);
              const done30 = Array.from({ length: 30 }, (_, i) => dateStr(-i)).filter(ds => logs.some(l => l.habitId === h.id && l.date === ds && l.done)).length;
              const pct30 = Math.round((done30 / 30) * 100);
              return (
                <div key={h.id} style={{ display: "contents" }}>
                  <div style={{ padding: "8px 0", borderTop: "1px solid rgba(0,0,0,.05)", fontSize: 12, fontWeight: 500, color: "#1a1714" }}>
                    {h.name}
                  </div>
                  <div style={{ padding: "8px 0", borderTop: "1px solid rgba(0,0,0,.05)", textAlign: "center", fontWeight: 700, fontSize: 13, color: current >= 5 ? "#dc2626" : current > 0 ? acc : "#aaa" }}>
                    {current > 0 ? current + "d" : "--"}
                  </div>
                  <div style={{ padding: "8px 0", borderTop: "1px solid rgba(0,0,0,.05)", textAlign: "center", fontWeight: 700, fontSize: 13, color: "#1a1714" }}>
                    {best > 0 ? best + "d" : "--"}
                  </div>
                  <div style={{ padding: "8px 0", borderTop: "1px solid rgba(0,0,0,.05)", textAlign: "center", fontSize: 12 }}>
                    <span className={"badge " + (pct30 >= 80 ? "badge-g" : pct30 >= 60 ? "badge-y" : "badge-r")}>
                      {pct30}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full heatmap */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="sec-hd">Habit Heatmap - Last 24 Weeks</div>
          <div style={{ marginBottom: 6, display: "flex", gap: 6, alignItems: "center", fontSize: 10, color: "#aaa" }}>
            <span>Less</span>
            {["rgba(0,0,0,.07)", acc + "44", acc + "88", acc + "cc", acc].map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />
            ))}
            <span>More</span>
          </div>
          <HeatMap logs={logs} habits={habits} weeks={24} accent={acc} />
        </div>

        {/* Calorie history */}
        <div className="card">
          <div className="sec-hd">Calorie History - Last 14 Days</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={calChart} barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
              <XAxis dataKey="day" fontSize={9} tick={{ fill: "#aaa" }} />
              <YAxis fontSize={9} tick={{ fill: "#aaa" }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <ReferenceLine y={cfg.calGoal} stroke={acc} strokeDasharray="4 3" strokeWidth={1.5} />
              <Bar dataKey="cals" fill={acc} opacity={.75} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ── Tab: Settings ──────────────────────────────────────────────────
  function TabSettings() {
    const [draft, setDraft]   = useState({ ...cfg });
    const [errs, setErrs]     = useState({});
    const [shk, setShk]       = useState(false);
    const [saved, setSaved]   = useState(false);

    function saveCfg() {
      const e = {};
      if (!draft.name || !draft.name.trim()) e.name = "Name required";
      if (!draft.calGoal || draft.calGoal <= 0) e.calGoal = "Enter a calorie goal";
      if (!draft.tdee || draft.tdee <= 0) e.tdee = "Enter your TDEE";
      if (Object.keys(e).length) { setErrs(e); setShk(true); setTimeout(() => setShk(false), 420); return; }
      const rgb = hexToRgb(draft.accent || "#2d6a4f");
      setCfg({ ...draft, accentRgb: rgb });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    function hexToRgb(hex) {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r ? parseInt(r[1], 16) + "," + parseInt(r[2], 16) + "," + parseInt(r[3], 16) : "45,106,79";
    }

    const F = ({ label, field, type = "text", placeholder = "" }) => (
      <div className="fld">
        <label className="lbl">{label}</label>
        <input className="inp" type={type} value={draft[field] || ""}
          placeholder={placeholder}
          onChange={e => setDraft(f => ({ ...f, [field]: type === "number" ? Number(e.target.value) : e.target.value }))} />
        {errs[field] && <div className="err">{errs[field]}</div>}
      </div>
    );

    return (
      <div>
        <div className="pg-hd">Settings</div>
        <div className="pg-sub">Goals, preferences, and configuration</div>

        <div className={"card" + (shk ? " shake" : "")} style={{ marginBottom: 16 }}>
          <div className="sec-hd">Profile</div>
          <F label="Your Name" field="name" placeholder="Harrison" />

          <div className="sec-hd" style={{ marginTop: 8 }}>Calorie Goals</div>
          <div className="g2" style={{ gap: 12, marginBottom: 0 }}>
            <F label="Daily Calorie Goal" field="calGoal" type="number" placeholder="1500" />
            <F label="TDEE (maintenance)" field="tdee" type="number" placeholder="2100" />
          </div>
          <div className="g3" style={{ gap: 12, marginBottom: 0 }}>
            <F label="Protein Goal (g)" field="proteinGoal" type="number" placeholder="160" />
            <F label="Carb Goal (g)" field="carbGoal" type="number" placeholder="120" />
            <F label="Fat Goal (g)" field="fatGoal" type="number" placeholder="60" />
          </div>

          <div className="sec-hd" style={{ marginTop: 8 }}>Body Goals</div>
          <div className="g2" style={{ gap: 12, marginBottom: 0 }}>
            <F label="Target Weight (lbs)" field="weightGoal" type="number" placeholder="180" />
          </div>

          <div className="sec-hd" style={{ marginTop: 8 }}>Appearance</div>
          <div className="fld">
            <label className="lbl">Accent Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={draft.accent || "#2d6a4f"}
                onChange={e => setDraft(f => ({ ...f, accent: e.target.value }))}
                style={{ width: 40, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 2 }} />
              <input className="inp" value={draft.accent || "#2d6a4f"}
                onChange={e => setDraft(f => ({ ...f, accent: e.target.value }))}
                style={{ maxWidth: 120 }} />
              {["#2d6a4f", "#3b82f6", "#8b5cf6", "#f59e0b", "#c45c4a"].map(c => (
                <div key={c} onClick={() => setDraft(f => ({ ...f, accent: c }))}
                  style={{ width: 24, height: 24, borderRadius: 6, background: c, cursor: "pointer", border: draft.accent === c ? "3px solid #1a1714" : "2px solid transparent" }} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
            <button className="tbtn tbtn-p" style={{ background: acc }} onClick={saveCfg}>
              Save Settings
            </button>
            {saved && <span style={{ fontSize: 11, color: "#2d6a4f", fontWeight: 600 }}>Saved!</span>}
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ border: "1px solid rgba(196,92,74,.15)" }}>
          <div className="sec-hd" style={{ color: "#c45c4a" }}>Data</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="tbtn tbtn-out tbtn-sm"
              onClick={() => { if (window.confirm("Clear all food log entries? This cannot be undone.")) setCalLog([]); }}>
              Clear Food Log
            </button>
            <button className="tbtn tbtn-out tbtn-sm"
              onClick={() => { if (window.confirm("Clear all habit logs? Streaks will reset.")) setLogs([]); }}>
              Clear Habit Logs
            </button>
            <button className="tbtn tbtn-out tbtn-sm"
              onClick={() => { if (window.confirm("Clear all weight entries?")) setWeight([]); }}>
              Clear Weight Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Add Food Modal ─────────────────────────────────────────────────
  function AddFoodModal() {
    const m = modal || {};
    const [form, setForm] = useState({
      name: "", cals: "", protein: "", carbs: "", fat: "",
      meal: m.meal || "Lunch",
    });
    const [errs, setErrs] = useState({});
    const [shk, setShk]   = useState(false);
    const [tab2, setTab2]  = useState("manual"); // manual | quick
    const [qSearch, setQSearch] = useState("");

    function submit() {
      const e = {};
      if (!form.name.trim()) e.name = "Food name is required";
      if (!form.cals || isNaN(Number(form.cals)) || Number(form.cals) < 0) e.cals = "Enter calories";
      if (Object.keys(e).length) { setErrs(e); setShk(true); setTimeout(() => setShk(false), 420); return; }
      const entry = {
        id: uid(),
        date: TODAY,
        ts: new Date().toISOString(),
        name: form.name.trim(),
        cals: Number(form.cals) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        meal: form.meal,
      };
      setCalLog(prev => [...prev, entry]);
      setModal(null);
    }

    function quickAdd(f) {
      const entry = {
        id: uid(),
        date: TODAY,
        ts: new Date().toISOString(),
        name: f.name,
        cals: f.cals,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        meal: form.meal,
      };
      setCalLog(prev => [...prev, entry]);
      setModal(null);
    }

    const filtered = QUICK_FOODS.filter(f => f.name.toLowerCase().includes(qSearch.toLowerCase()));

    return (
      <div className="mbg" onClick={() => setModal(null)}>
        <div className={"mbox" + (shk ? " shake" : "")} onClick={e => e.stopPropagation()}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#1a1714" }}>Log Food</h2>
          <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
            <select className="inp" value={form.meal} onChange={e => setForm(f => ({ ...f, meal: e.target.value }))} style={{ maxWidth: 140 }}>
              {MEAL_TYPES.map(m2 => <option key={m2}>{m2}</option>)}
            </select>
          </div>
          <div className="mini-tabs" style={{ marginBottom: 14 }}>
            {["manual", "quick"].map(v => (
              <button key={v} className={"mini-tab" + (tab2 === v ? " on" : "")}
                style={tab2 === v ? { background: acc, borderColor: acc, color: "#fff" } : {}}
                onClick={() => setTab2(v)}>
                {v === "manual" ? "Manual Entry" : "Quick Add"}
              </button>
            ))}
          </div>
          {tab2 === "manual" && (
            <div>
              <div className="fld">
                <label className="lbl">Food Name</label>
                <input className="inp" value={form.name} placeholder="e.g. Grilled chicken breast"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {errs.name && <div className="err">{errs.name}</div>}
              </div>
              <div className="g2" style={{ gap: 10, marginBottom: 0 }}>
                <div className="fld">
                  <label className="lbl">Calories</label>
                  <input className="inp" type="number" value={form.cals} placeholder="0"
                    onChange={e => setForm(f => ({ ...f, cals: e.target.value }))} />
                  {errs.cals && <div className="err">{errs.cals}</div>}
                </div>
                <div className="fld">
                  <label className="lbl">Protein (g)</label>
                  <input className="inp" type="number" value={form.protein} placeholder="0"
                    onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} />
                </div>
                <div className="fld">
                  <label className="lbl">Carbs (g)</label>
                  <input className="inp" type="number" value={form.carbs} placeholder="0"
                    onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} />
                </div>
                <div className="fld">
                  <label className="lbl">Fat (g)</label>
                  <input className="inp" type="number" value={form.fat} placeholder="0"
                    onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} />
                </div>
              </div>
            </div>
          )}
          {tab2 === "quick" && (
            <div>
              <input className="inp" value={qSearch} placeholder="Search presets..."
                onChange={e => setQSearch(e.target.value)} style={{ marginBottom: 10 }} />
              <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                {filtered.map((f, i) => (
                  <button key={i} className="tbtn tbtn-out"
                    style={{ justifyContent: "space-between", padding: "8px 12px", textAlign: "left" }}
                    onClick={() => quickAdd(f)}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>P: {f.protein}g &bull; C: {f.carbs}g &bull; F: {f.fat}g</div>
                    </div>
                    <span style={{ fontWeight: 700, color: acc, fontSize: 13 }}>{f.cals}</span>
                  </button>
                ))}
                {filtered.length === 0 && <div style={{ color: "#aaa", fontSize: 12, padding: "8px 0" }}>No matches</div>}
              </div>
            </div>
          )}
          <div className="mft">
            <button className="tbtn tbtn-out" onClick={() => setModal(null)}>Cancel</button>
            {tab2 === "manual" && (
              <button className="tbtn tbtn-p" style={{ background: acc }} onClick={submit}>Add Food</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: "#6b5e52" }}>
      Loading...
    </div>
  );

  const navItems = [
    { id: "today",   label: "Today",    icon: <IcToday /> },
    { id: "habits",  label: "Habits",   icon: <IcHabits /> },
    { id: "calories",label: "Calories", icon: <IcCal /> },
    { id: "body",    label: "Body",     icon: <IcBody /> },
    { id: "history", label: "History",  icon: <IcHistory /> },
  ];

  const dynCSS = `.sn.on{background:rgba(${accRgb},.22)!important}.tbtn-p{background:${acc}}.mini-tab.on{background:${acc};border-color:${acc}}`;

  return (
    <div className="trk" style={{ "--acc": acc, "--acc-rgb": accRgb }}>
      <style>{S}</style>
      <style>{dynCSS}</style>

      {/* Sidebar */}
      <div className="trk-side">
        <div className="trk-logo">
          Track
          <span>PropOS Track</span>
        </div>

        <div className="s-lbl">Daily</div>
        {navItems.map(n => (
          <div key={n.id} className={"sn" + (tab === n.id ? " on" : "")} onClick={() => setTab(n.id)}>
            {n.icon}
            {n.label}
          </div>
        ))}

        <div className="trk-spacer" />
        <hr className="trk-divider" />

        <div className="s-lbl">App</div>
        <div className="sn" onClick={() => setTab("settings")}>
          <IcGear /> Settings
        </div>
        <a href="/admin" className="sn" style={{ textDecoration: "none" }}>
          <IcAdmin /> Back to Admin
        </a>
        <div style={{ height: 16 }} />
      </div>

      {/* Main */}
      <div className="trk-main">
        {tab === "today"    && <TabToday />}
        {tab === "habits"   && <TabHabits />}
        {tab === "calories" && <TabCalories />}
        {tab === "body"     && <TabBody />}
        {tab === "history"  && <TabHistory />}
        {tab === "settings" && <TabSettings />}
      </div>

      {/* Modals */}
      {modal && modal.type === "addFood" && <AddFoodModal />}
    </div>
  );
}
