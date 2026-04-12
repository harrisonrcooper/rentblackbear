/**
 * AddExpenseSheet.jsx
 * PropOS — Mobile Add Expense Flow
 *
 * HOW TO INTEGRATE INTO admin/page.jsx:
 * 1. Import at the top of admin/page.jsx:
 *      import AddExpenseSheet from "./components/AddExpenseSheet";
 *
 * 2. Add state near other modal state:
 *      const [showAddExpense, setShowAddExpense] = useState(false);
 *
 * 3. Place the component inside the fixed-position modal layer
 *    (the second <div style={{zoom:_zoom,fontFamily:_font}}> that holds all modals),
 *    passing the required props:
 *
 *      <AddExpenseSheet
 *        open={showAddExpense}
 *        onClose={() => setShowAddExpense(false)}
 *        acc={_acc}
 *        props={props}
 *        vendors={vendors}
 *        setVendors={setVendors}
 *        subcats={subcats}
 *        setSubcats={setSubcats}
 *        txns={txns}
 *        setTxns={setTxns}
 *        expenses={expenses}
 *        setExpenses={setExpenses}
 *        settings={settings}
 *        uid={uid}
 *      />
 *
 * 4. Add the FAB trigger button inside the Accounting tab render block.
 *    Place it OUTSIDE the scrollable content, fixed to bottom-right:
 *
 *      <button
 *        onClick={() => setShowAddExpense(true)}
 *        style={{
 *          position:"fixed", bottom:80, right:20,
 *          width:56, height:56, borderRadius:"50%",
 *          background:_acc, border:"none", cursor:"pointer",
 *          display:"flex", alignItems:"center", justifyContent:"center",
 *          boxShadow:`0 4px 20px rgba(0,0,0,.35)`,
 *          zIndex:40,
 *        }}
 *        aria-label="Add expense"
 *      >
 *        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
 *          stroke={isDarkColor(_acc) ? "#fff" : "#111"}
 *          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 *          <line x1="12" y1="5" x2="12" y2="19"/>
 *          <line x1="5" y1="12" x2="19" y2="12"/>
 *        </svg>
 *      </button>
 *
 * NOTES:
 * - All accent colors derive from `acc` prop (settings.adminAccent / _acc) — zero hardcoded hex values except the 3 depth levels
 * - Depth levels: L0 #0d0d0f (overlay bg), L1 #161618 (sheet bg / cards), L2 #1f1f22 (elevated elements)
 * - All icons are Lucide-style inline SVGs, 20x20, stroke-width 1.5, round caps+joins
 * - Saves to hq-txns (via setTxns) on confirm
 * - If type=Property and prop="all", splits equally across all active props
 * - Vendors with totalPaid >= 600 are flagged for 1099
 * - Subcats are dynamic per category, stored in hq-subcats (via setSubcats)
 */

"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── helpers ─── */
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const fmtAmt = (s) => {
  if (!s) return "$0";
  const [int, dec] = s.split(".");
  const formatted = "$" + (parseInt(int) || 0).toLocaleString();
  return dec !== undefined ? formatted + "." + dec : formatted;
};
const isDark = (hex) => {
  if (!hex || hex.length < 4) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 155;
};
const rgba = (hex, a) => {
  if (!hex || hex.length < 4) return `rgba(0,0,0,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const today = () => new Date();
const fmtDate = (m, d, y) => `${MONTHS[m]} ${d + 1}, ${y}`;
const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
const getYears = () => {
  const now = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => now - 3 + i);
};

const SCHED_E_CATS = [
  { key: "Advertising",              line: "Line 5",  types: ["property"] },
  { key: "Auto & Travel",            line: "Line 6",  types: ["business","property"] },
  { key: "Cleaning & Maintenance",   line: "Line 7",  types: ["property"] },
  { key: "Commissions",              line: "Line 8",  types: ["property"] },
  { key: "Insurance",                line: "Line 9",  types: ["property","business"] },
  { key: "Legal & Professional Fees",line: "Line 10", types: ["property","business"] },
  { key: "Management Fees",          line: "Line 11", types: ["property","business"] },
  { key: "Mortgage Interest",        line: "Line 12", types: ["property"] },
  { key: "Other Interest",           line: "Line 13", types: ["property"] },
  { key: "Repairs",                  line: "Line 14", types: ["property"] },
  { key: "Supplies",                 line: "Line 15", types: ["property","business"] },
  { key: "Taxes — Property",         line: "Line 16", types: ["property"] },
  { key: "Utilities",                line: "Line 17", types: ["property"] },
  { key: "Depreciation",             line: "Line 18", types: ["capex"] },
  { key: "Other",                    line: "Line 19", types: ["property","business","capex"] },
];

const EXPENSE_TYPES = [
  {
    key: "property",
    name: "Property Expense",
    desc: "Tied to a specific property",
    examples: "Repairs, utilities, insurance, advertising",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: "business",
    name: "Business Expense",
    desc: "Cost of running your PM business",
    examples: "Software, legal fees, CPA, phone bill",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  },
  {
    key: "capex",
    name: "Capital Improvement",
    desc: "Major upgrade — depreciated over time",
    examples: "New roof, HVAC system, full flooring replacement",
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
];

/* ─── scroll wheel col ─── */
function WheelCol({ items, selIdx, onSnap, style, acc }) {
  const innerRef = useRef(null);
  const dragRef = useRef({ startY: 0, curIdx: selIdx, dragging: false });
  const ITEM_H = 46;
  const PAD = 3;

  const setTransform = (idx, animate = true) => {
    if (!innerRef.current) return;
    innerRef.current.style.transition = animate ? "transform .18s cubic-bezier(.25,.46,.45,.94)" : "none";
    innerRef.current.style.transform = `translateY(${(PAD - idx) * ITEM_H}px)`;
  };

  useEffect(() => { setTransform(selIdx, false); dragRef.current.curIdx = selIdx; }, [selIdx, items.length]);

  const onStart = (e) => {
    dragRef.current.startY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current.dragging = true;
    if (innerRef.current) innerRef.current.style.transition = "none";
  };
  const onMove = (e) => {
    if (!dragRef.current.dragging) return;
    e.preventDefault();
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = y - dragRef.current.startY;
    const base = (PAD - dragRef.current.curIdx) * ITEM_H;
    const raw = base + dy;
    const min = (PAD - (items.length - 1)) * ITEM_H;
    if (innerRef.current) innerRef.current.style.transform = `translateY(${Math.max(min, Math.min(PAD * ITEM_H, raw))}px)`;
  };
  const onEnd = (e) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const dy = y - dragRef.current.startY;
    const rawIdx = dragRef.current.curIdx - Math.round(dy / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, rawIdx));
    dragRef.current.curIdx = clamped;
    setTransform(clamped, true);
    onSnap(clamped);
  };

  return (
    <div
      style={{ flex: 1, overflow: "hidden", height: ITEM_H * (PAD * 2 + 1), cursor: "grab", userSelect: "none", ...style }}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
    >
      <div ref={innerRef} style={{ display: "flex", flexDirection: "column" }}>
        {Array.from({ length: PAD }, (_, i) => <div key={"pre" + i} style={{ height: ITEM_H }} />)}
        {items.map((item, i) => {
          const dist = Math.abs(i - selIdx);
          return (
            <div key={i} style={{
              height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: i === selIdx ? 21 : dist === 1 ? 18 : 16,
              fontWeight: i === selIdx ? 600 : 400,
              color: i === selIdx ? acc : dist === 1 ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.18)",
              transition: "color .15s, font-size .1s",
              flexShrink: 0,
            }}>{item}</div>
          );
        })}
        {Array.from({ length: PAD }, (_, i) => <div key={"post" + i} style={{ height: ITEM_H }} />)}
      </div>
    </div>
  );
}

/* ─── main component ─── */
export default function AddExpenseSheet({ open, onClose, acc = "#4a7c59", props = [], vendors = [], setVendors, subcats = {}, setSubcats, txns = [], setTxns, expenses = [], setExpenses, settings = {}, uid: uidFn }) {
  const uidGen = uidFn || uid;
  const tc = isDark(acc) ? "#fff" : "#111";

  /* form state */
  const [step, setStep] = useState(0);
  const [digs, setDigs] = useState("");
  const [hasDot, setHasDot] = useState(false);
  const [expType, setExpType] = useState("");
  const [propKey, setPropKey] = useState("");
  const [propSplit, setPropSplit] = useState("one"); /* "one" | "all" | "custom" */
  const [category, setCategory] = useState("");
  const [subcat, setSubcat] = useState("");
  const [vendor, setVendor] = useState("");
  const [vendorQuery, setVendorQuery] = useState("");
  const [selM, setSelM] = useState(today().getMonth());
  const [selD, setSelD] = useState(today().getDate() - 1);
  const [selY, setSelY] = useState(today().getFullYear());
  const [dateMode, setDateMode] = useState("today");
  const [note, setNote] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shake, setShake] = useState(false);

  /* derived */
  const activeProps = props.filter(p => !(p.units||[]).every(u => u.ownerOccupied));
  const filteredCats = SCHED_E_CATS.filter(c => !expType || c.types.includes(expType));
  const catSubcats = (subcats && subcats[category]) || [];
  const filteredVendors = vendors.filter(v => !vendorQuery || (v.name||v).toLowerCase().includes(vendorQuery.toLowerCase()));
  const years = getYears();
  const yearIdx = years.indexOf(selY);
  const days = Array.from({ length: daysInMonth(selM, selY) }, (_, i) => String(i + 1));
  const dateStr = fmtDate(selM, selD, selY);

  /* steps: 0=amount 1=type 2=property 3=category 4=subcat 5=vendor 6=date 7=note 8=review */
  const TOTAL_STEPS = 9;
  const STEP_TITLES = ["Add Expense", "Expense Type", "Property", "Category", "Subcategory", "Vendor", "Date", "Note", "Review"];

  /* reset on open */
  useEffect(() => {
    if (open) {
      setStep(0); setDigs(""); setHasDot(false); setExpType(""); setPropKey(""); setPropSplit("one");
      setCategory(""); setSubcat(""); setVendor(""); setVendorQuery(""); setNote("");
      setSelM(today().getMonth()); setSelD(today().getDate() - 1); setSelY(today().getFullYear());
      setDateMode("today"); setSaving(false); setShowHelp(false);
    }
  }, [open]);

  /* keypad */
  const pk = (k) => {
    if (k === "del") {
      setDigs(p => { const n = p.slice(0, -1); if (p.endsWith(".")) setHasDot(false); return n; });
    } else if (k === ".") {
      if (!hasDot && digs.length > 0) { setDigs(p => p + "."); setHasDot(true); }
    } else {
      setDigs(p => {
        if (hasDot) { const parts = p.split("."); if (parts[1] && parts[1].length >= 2) return p; }
        if (p.length >= 8) return p;
        return p + k;
      });
    }
  };

  /* navigation */
  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 400); };

  const fwd = () => {
    if (step === 0 && !digs) { triggerShake(); return; }
    if (step === 1 && !expType) { triggerShake(); return; }
    if (step === 2 && expType === "property" && !propKey) { triggerShake(); return; }
    if (step === 3 && !category) { triggerShake(); return; }
    // subcat optional, vendor optional, date always set, note optional
    if (step === 8) { handleSave(); return; }

    // Skip property step for business expenses
    if (step === 1 && expType === "business") { setStep(3); return; }
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 0) { onClose(); return; }
    if (step === 3 && expType === "business") { setStep(1); return; }
    setStep(s => s - 1);
  };

  /* date quick-set */
  const quickDate = (mode) => {
    setDateMode(mode);
    const d = new Date();
    if (mode === "yesterday") d.setDate(d.getDate() - 1);
    if (mode !== "other") { setSelM(d.getMonth()); setSelD(d.getDate() - 1); setSelY(d.getFullYear()); }
  };

  /* add new subcat */
  const addNewSubcat = () => {
    const name = window.prompt("New subcategory name:");
    if (!name || !name.trim() || !category) return;
    const newSc = { id: "sc-" + uidGen(), label: name.trim() };
    setSubcats(p => ({ ...p, [category]: [...(p[category] || []), newSc] }));
  };

  /* add new vendor */
  const addNewVendor = () => {
    const name = vendorQuery.trim();
    if (!name) return;
    const newV = { id: "v-" + uidGen(), name, totalPaid: 0 };
    setVendors(p => [newV, ...p]);
    setVendor(name);
    setVendorQuery(name);
  };

  /* save */
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const amount = parseFloat(digs) || 0;
    const dateISO = new Date(selY, selM, selD + 1).toISOString().split("T")[0];
    const base = {
      type: expType,
      category,
      subcat,
      vendor,
      date: dateISO,
      note,
      createdAt: new Date().toISOString(),
    };

    if (expType === "property" && propKey === "all") {
      // split equally across all active props
      const perProp = Math.round((amount / activeProps.length) * 100) / 100;
      const records = activeProps.map(p => ({
        id: uidGen(),
        ...base,
        propId: p.id,
        propName: p.name,
        amount: perProp,
        desc: `${category}${subcat ? " — " + subcat : ""}${vendor ? " / " + vendor : ""}`,
        splitOf: "all",
      }));
      setExpenses(prev => [...records, ...prev]);
      setTxns(prev => [...records.map(r => ({ ...r, txnType: "expense" })), ...prev]);
    } else {
      const selectedProp = activeProps.find(p => p.id === propKey);
      const record = {
        id: uidGen(),
        ...base,
        propId: propKey || null,
        propName: selectedProp ? selectedProp.name : null,
        amount,
        desc: `${category}${subcat ? " — " + subcat : ""}${vendor ? " / " + vendor : ""}`,
      };
      setExpenses(prev => [record, ...prev]);
      setTxns(prev => [{ ...record, txnType: "expense" }, ...prev]);
    }

    // Update vendor totalPaid for 1099 tracking
    if (vendor) {
      setVendors(prev => prev.map(v => {
        const vName = v.name || v;
        return vName === vendor ? { ...(typeof v === "object" ? v : { name: v }), totalPaid: ((v.totalPaid || 0) + amount) } : v;
      }));
    }

    setSaving(false);
    onClose();
  };

  /* ─── styles ─── */
  const S = {
    overlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200,
      display: "flex", alignItems: "stretch",
    },
    sheet: {
      width: "100%", background: "#161618", borderRadius: 0,
      height: "100dvh", minHeight: "100vh", display: "flex", flexDirection: "column",
      overflow: "hidden",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    pill: {
      width: 36, height: 4, background: "rgba(255,255,255,.15)", borderRadius: 2,
      margin: "12px auto 0",
    },
    hdr: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px 0", flexShrink: 0,
    },
    hdrBtn: {
      background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
      fontSize: 15, color: acc, padding: "4px 0",
    },
    hdrTitle: { fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-.3px" },
    prog: { display: "flex", gap: 3, padding: "12px 20px 0", flexShrink: 0 },
    stepContent: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 },
    /* amount */
    amtScene: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 },
    amtLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,.3)" },
    amtNum: { fontSize: 72, fontWeight: 200, color: "#fff", letterSpacing: -3, lineHeight: 1 },
    amtCursor: { display: "inline-block", width: 2.5, height: 52, background: acc, marginLeft: 3, verticalAlign: "middle", borderRadius: 2, animation: "blink 1s infinite" },
    /* keypad */
    kp: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,.04)", flexShrink: 0 },
    k: { background: "#161618", height: 68, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", fontFamily: "inherit" },
    kn: { fontSize: 28, fontWeight: 300, color: "#fff", lineHeight: 1 },
    ks: { fontSize: 9, color: "rgba(255,255,255,.25)", marginTop: 2, letterSpacing: .5 },
    /* pick list */
    pickHd: { padding: "16px 20px 8px", flexShrink: 0 },
    pickTitle: { fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-.5px", marginBottom: 3 },
    pickSub: { fontSize: 13, color: "rgba(255,255,255,.3)" },
    pickScroll: { flex: 1, overflowY: "auto", padding: "0 16px 8px", display: "flex", flexDirection: "column", gap: 7, scrollbarWidth: "none" },
    card: (sel) => ({
      background: sel ? rgba(acc, .1) : "#1f1f22",
      border: `1.5px solid ${sel ? acc : "rgba(255,255,255,.06)"}`,
      borderRadius: 16, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 13,
      cursor: "pointer", transition: "all .15s",
    }),
    cardIc: { width: 40, height: 40, borderRadius: 12, background: "#161618", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    cardNm: { fontSize: 15, fontWeight: 500, color: "#fff", letterSpacing: "-.2px" },
    cardDs: { fontSize: 12, color: "rgba(255,255,255,.3)", marginTop: 2 },
    cardEx: { fontSize: 11, color: "rgba(255,255,255,.18)", marginTop: 5, lineHeight: 1.5 },
    ck: (sel) => ({
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginLeft: "auto",
      background: sel ? acc : "transparent",
      border: `1.5px solid ${sel ? acc : "rgba(255,255,255,.2)"}`,
      display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
    }),
    /* type cards (bigger) */
    typeCard: (sel) => ({
      background: sel ? rgba(acc, .1) : "#1f1f22",
      border: `1.5px solid ${sel ? acc : "rgba(255,255,255,.06)"}`,
      borderRadius: 18, padding: "18px 18px 16px",
      cursor: "pointer", transition: "all .15s",
    }),
    typeIcWrap: { width: 44, height: 44, borderRadius: 13, background: "#161618", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 },
    typeNm: { fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-.3px", marginBottom: 3 },
    typeDs: { fontSize: 13, color: "rgba(255,255,255,.4)" },
    typeEx: { fontSize: 11, color: "rgba(255,255,255,.2)", marginTop: 7, lineHeight: 1.5 },
    /* bottom btn */
    bot: { padding: "12px 20px 36px", flexShrink: 0, background: "#161618" },
    botBtn: (disabled) => ({
      width: "100%", padding: 18, borderRadius: 16, fontSize: 16, fontWeight: 600,
      border: "none", cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
      background: disabled ? "rgba(255,255,255,.08)" : acc,
      color: disabled ? "rgba(255,255,255,.3)" : tc,
      transition: "all .2s",
      animation: shake ? "shake .4s ease" : "none",
    }),
    /* vendor search */
    srch: { margin: "0 16px 10px", background: "#1f1f22", borderRadius: 13, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, border: `1.5px solid rgba(255,255,255,.08)`, flexShrink: 0 },
    srchInp: { background: "none", border: "none", color: "#fff", fontSize: 16, fontFamily: "inherit", flex: 1, outline: "none" },
    addRow: { display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", cursor: "pointer", flexShrink: 0, color: acc },
    /* date */
    quickRow: { display: "flex", gap: 8, padding: "0 16px 12px", flexShrink: 0 },
    qb: (on) => ({
      flex: 1, padding: "13px 0", borderRadius: 13, border: `1.5px solid ${on ? rgba(acc, .5) : "rgba(255,255,255,.08)"}`,
      background: on ? rgba(acc, .12) : "#1f1f22", color: on ? acc : "rgba(255,255,255,.4)",
      fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "center", transition: "all .2s",
    }),
    wheelWrap: { flex: 1, position: "relative", margin: "0 16px" },
    selBar: { position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: 46, borderRadius: 12, background: rgba(acc, .1), border: `1.5px solid ${rgba(acc, .25)}`, pointerEvents: "none", zIndex: 2 },
    fadeT: { position: "absolute", left: 0, right: 0, top: 0, height: 80, background: "linear-gradient(to bottom,#161618,transparent)", pointerEvents: "none", zIndex: 3 },
    fadeB: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "linear-gradient(to top,#161618,transparent)", pointerEvents: "none", zIndex: 3 },
    dateSel: { textAlign: "center", fontSize: 13, color: rgba(acc, .9), padding: "8px 0 4px", flexShrink: 0 },
    /* note */
    noteArea: { flex: 1, background: "#1f1f22", borderRadius: 16, padding: 16, margin: "0 16px 12px", border: "1.5px solid rgba(255,255,255,.06)" },
    noteInp: { background: "none", border: "none", color: "#fff", fontSize: 16, fontFamily: "inherit", width: "100%", height: "100%", resize: "none", outline: "none", lineHeight: 1.7 },
    skip: { textAlign: "center", padding: "8px 0", fontSize: 14, color: "rgba(255,255,255,.25)", cursor: "pointer", flexShrink: 0 },
    /* review */
    revAmt: { fontSize: 54, fontWeight: 200, color: "#fff", letterSpacing: -3, textAlign: "center", padding: "12px 20px 10px", flexShrink: 0 },
    revScroll: { flex: 1, overflowY: "auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 6, scrollbarWidth: "none" },
    revRow: { background: "#1f1f22", borderRadius: 13, padding: "12px 14px", display: "flex", alignItems: "center", gap: 11 },
    revIc: { width: 32, height: 32, borderRadius: 9, background: "#161618", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    revLbl: { fontSize: 11, color: "rgba(255,255,255,.3)", marginBottom: 2 },
    revVal: { fontSize: 14, fontWeight: 500, color: "#fff" },
    /* help sheet */
    helpOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 10, display: "flex", alignItems: "flex-end" },
    helpSheet: { background: "#1f1f22", borderRadius: "22px 22px 0 0", padding: "20px 20px 40px", width: "100%", animation: "slideUp .25s ease" },
    helpPill: { width: 32, height: 4, background: "rgba(255,255,255,.15)", borderRadius: 2, margin: "0 auto 20px" },
    helpTitle: { fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 18, letterSpacing: "-.3px" },
    helpRow: { display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" },
    helpDot: (c) => ({ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 5 }),
    helpTxt: { fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.6 },
    helpClose: { width: "100%", padding: 15, background: "#161618", border: "none", borderRadius: 13, color: "rgba(255,255,255,.5)", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },
  };

  /* ─── icon helpers ─── */
  const CheckIc = () => (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 6 5 9 10 3"/>
    </svg>
  );
  const SearchIc = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
  const PlusIc = ({ color }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
  const QuestionIc = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );

  /* ─── pick card helper ─── */
  const PickCard = ({ selected, onClick, icon, name, desc, extra, showCheck = true }) => (
    <motion.div style={S.card(selected)} onClick={onClick} whileTap={{ scale: .98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
      {icon && <div style={S.cardIc}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={S.cardNm}>{name}</div>
        {desc && <div style={S.cardDs}>{desc}</div>}
        {extra && <div style={S.typeEx}>{extra}</div>}
      </div>
      {showCheck && <div style={S.ck(selected)}>{selected && <CheckIc />}</div>}
    </motion.div>
  );

  /* review row icon */
  const RevIcSvg = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  /* ─── render ─── */
  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes shake { 0%,100% { transform:translateX(0) } 20%,60% { transform:translateX(-6px) } 40%,80% { transform:translateX(6px) } }
        .exp-sheet *::-webkit-scrollbar { display:none }
        .exp-k:active { background:#222 !important }
        .exp-qb:active { opacity:.8 }
      `}</style>

      <AnimatePresence>
        {open && (
        <motion.div
          key="exp-overlay"
          style={S.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .18 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="exp-sheet"
            style={S.sheet}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >

          {/* HEADER */}
          <div style={S.hdr}>
            <button style={S.hdrBtn} onClick={back}>{step === 0 ? "Cancel" : "← Back"}</button>
            <span style={S.hdrTitle}>{STEP_TITLES[step]}</span>
            {step === 1
              ? <button style={{ ...S.hdrBtn, display: "flex", alignItems: "center" }} onClick={() => setShowHelp(true)}><QuestionIc /></button>
              : <span style={{ width: 60 }} />}
          </div>

          {/* PROGRESS */}
          <div style={S.prog}>
            {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i < step ? acc : i === step ? rgba(acc, .4) : "rgba(255,255,255,.08)", transition: "background .3s" }} />
            ))}
          </div>

          <div style={S.stepContent}>
          <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: .2 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
          >

            {/* ── STEP 0: AMOUNT ── */}
            {step === 0 && <>
              <div style={S.amtScene}>
                <div style={S.amtLabel}>Amount</div>
                <div style={S.amtNum}>
                  {fmtAmt(digs)}
                  <span style={S.amtCursor} />
                </div>
                {!digs && <div style={{ fontSize: 13, color: "rgba(255,255,255,.2)" }}>tap to enter</div>}
              </div>
              <div style={S.kp}>
                {["1","2","3","4","5","6","7","8","9",".","0","del"].map((k, i) => (
                  <button key={k} className="exp-k" style={S.k} onClick={() => pk(k)}>
                    {k === "del"
                      ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="14" y2="13"/><line x1="14" y1="9" x2="18" y2="13"/></svg>
                      : k === "."
                        ? <div style={{ ...S.kn, fontSize: 32, lineHeight: "1.1" }}>.</div>
                        : <div>
                            <div style={S.kn}>{k}</div>
                            {["2","3","4","5","6","7","8","9"].includes(k) && (
                              <div style={S.ks}>{["ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"][parseInt(k)-2]}</div>
                            )}
                          </div>
                    }
                  </button>
                ))}
              </div>
            </>}

            {/* ── STEP 1: TYPE ── */}
            {step === 1 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>What kind?</div>
                <div style={S.pickSub}>Determines how it&apos;s categorized for taxes</div>
              </div>
              <div style={{ ...S.pickScroll, gap: 9 }}>
                {EXPENSE_TYPES.map(t => (
                  <motion.div key={t.key} style={S.typeCard(expType === t.key)} onClick={() => setExpType(t.key)} whileTap={{ scale: .98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <div style={S.typeIcWrap}>{t.icon(expType === t.key ? acc : "rgba(255,255,255,.4)")}</div>
                    <div style={S.typeNm}>{t.name}</div>
                    <div style={S.typeDs}>{t.desc}</div>
                    <div style={S.typeEx}>{t.examples}</div>
                  </motion.div>
                ))}
              </div>
            </>}

            {/* ── STEP 2: PROPERTY ── */}
            {step === 2 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>Which property?</div>
                <div style={S.pickSub}>Required for Schedule E deduction</div>
              </div>
              <div style={S.pickScroll}>
                {activeProps.map(p => (
                  <PickCard
                    key={p.id}
                    selected={propKey === p.id}
                    onClick={() => { setPropKey(p.id); setPropSplit("one"); }}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={propKey === p.id ? acc : "rgba(255,255,255,.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                    name={p.name || p.addr || "Property"}
                    desc={p.addr && p.name !== p.addr ? p.addr : null}
                  />
                ))}
                <PickCard
                  selected={propKey === "all"}
                  onClick={() => { setPropKey("all"); setPropSplit("all"); }}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={propKey === "all" ? acc : "rgba(255,255,255,.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                  name="All Properties"
                  desc={`Split equally — ${activeProps.length} properties`}
                />
              </div>
            </>}

            {/* ── STEP 3: CATEGORY ── */}
            {step === 3 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>Category</div>
                <div style={S.pickSub}>IRS Schedule E line item</div>
              </div>
              <div style={S.pickScroll}>
                {filteredCats.map(c => (
                  <PickCard
                    key={c.key}
                    selected={category === c.key}
                    onClick={() => { setCategory(c.key); setSubcat(""); }}
                    name={c.key}
                    desc={c.line}
                  />
                ))}
              </div>
            </>}

            {/* ── STEP 4: SUBCAT ── */}
            {step === 4 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>Subcategory</div>
                <div style={S.pickSub}>{category}</div>
              </div>
              <div style={S.pickScroll}>
                {catSubcats.map(sc => (
                  <PickCard
                    key={sc.id}
                    selected={subcat === sc.label}
                    onClick={() => setSubcat(sc.label)}
                    name={sc.label}
                  />
                ))}
              </div>
              <div style={S.addRow} onClick={addNewSubcat}>
                <PlusIc color={acc} />
                <span style={{ fontSize: 14, fontWeight: 500, color: acc }}>Add subcategory</span>
              </div>
            </>}

            {/* ── STEP 5: VENDOR ── */}
            {step === 5 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>Vendor</div>
                <div style={S.pickSub}>Who did you pay? Tracked for 1099</div>
              </div>
              <div style={S.srch}>
                <SearchIc />
                <input
                  style={S.srchInp}
                  placeholder="Search or type name…"
                  value={vendorQuery}
                  onChange={e => setVendorQuery(e.target.value)}
                  autoComplete="off"
                />
                {vendorQuery && <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.3)", fontSize: 18, padding: 0, fontFamily: "inherit" }} onClick={() => setVendorQuery("")}>×</button>}
              </div>
              <div style={S.pickScroll}>
                {filteredVendors.map((v, i) => {
                  const vName = typeof v === "object" ? v.name : v;
                  const totalPaid = typeof v === "object" ? (v.totalPaid || 0) : 0;
                  return (
                    <PickCard
                      key={i}
                      selected={vendor === vName}
                      onClick={() => { setVendor(vName); setVendorQuery(vName); }}
                      name={vName}
                      desc={totalPaid >= 600 ? `$${totalPaid.toLocaleString()} YTD — 1099 required` : totalPaid > 0 ? `$${totalPaid.toLocaleString()} YTD` : null}
                    />
                  );
                })}
                {vendorQuery && !filteredVendors.find(v => (typeof v === "object" ? v.name : v).toLowerCase() === vendorQuery.toLowerCase()) && (
                  <div style={S.addRow} onClick={addNewVendor}>
                    <PlusIc color={acc} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: acc }}>Add &ldquo;{vendorQuery}&rdquo;</span>
                  </div>
                )}
              </div>
            </>}

            {/* ── STEP 6: DATE ── */}
            {step === 6 && <>
              <div style={{ padding: "14px 20px 8px", flexShrink: 0 }}>
                <div style={S.pickTitle}>When?</div>
              </div>
              <div style={S.quickRow}>
                {[["today","Today"],["yesterday","Yesterday"],["other","Other"]].map(([m, lbl]) => (
                  <button key={m} className="exp-qb" style={S.qb(dateMode === m)} onClick={() => quickDate(m)}>{lbl}</button>
                ))}
              </div>
              <div style={{ ...S.wheelWrap, flex: 1 }}>
                <div style={S.fadeT} />
                <div style={S.selBar} />
                <div style={S.fadeB} />
                <div style={{ display: "flex", height: "100%" }}>
                  <WheelCol items={MONTHS} selIdx={selM} onSnap={i => { setSelM(i); setDateMode("other"); }} acc={acc} />
                  <WheelCol items={days} selIdx={Math.min(selD, days.length - 1)} onSnap={i => { setSelD(i); setDateMode("other"); }} style={{ flex: .55 }} acc={acc} />
                  <WheelCol items={years.map(String)} selIdx={Math.max(0, yearIdx)} onSnap={i => { setSelY(years[i]); setDateMode("other"); }} style={{ flex: .75 }} acc={acc} />
                </div>
              </div>
              <div style={S.dateSel}>{dateStr}</div>
            </>}

            {/* ── STEP 7: NOTE ── */}
            {step === 7 && <>
              <div style={S.pickHd}>
                <div style={S.pickTitle}>Note <span style={{ fontSize: 17, fontWeight: 400, color: "rgba(255,255,255,.25)" }}>(optional)</span></div>
                <div style={S.pickSub}>For your CPA or future reference</div>
              </div>
              <div style={S.noteArea}>
                <textarea
                  style={S.noteInp}
                  placeholder={"e.g. Replaced bathroom faucet, bedroom 3. Ask CPA about bonus depreciation."}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={5}
                />
              </div>
              <div style={S.skip} onClick={fwd}>Skip</div>
            </>}

            {/* ── STEP 8: REVIEW ── */}
            {step === 8 && <>
              <div style={S.revAmt}>{fmtAmt(digs)}</div>
              <div style={S.revScroll}>
                {[
                  { label: "Type", value: EXPENSE_TYPES.find(t => t.key === expType)?.name || expType },
                  expType === "property" && { label: "Property", value: propKey === "all" ? `All Properties (÷ ${activeProps.length})` : activeProps.find(p => p.id === propKey)?.name || propKey },
                  { label: "Category", value: category },
                  subcat && { label: "Subcategory", value: subcat },
                  vendor && { label: "Vendor", value: vendor },
                  { label: "Date", value: dateStr },
                  note && { label: "Note", value: note },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={S.revRow}>
                    <div style={S.revIc}><RevIcSvg /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={S.revLbl}>{row.label}</div>
                      <div style={{ ...S.revVal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>}

          </motion.div>
          </AnimatePresence>
          </div>

          {/* BOTTOM BUTTON */}
          <div style={S.bot}>
            <motion.button
              style={S.botBtn(!digs && step === 0)}
              onClick={fwd}
              disabled={!digs && step === 0}
              whileTap={{ scale: .96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {step === 8 ? (saving ? "Saving…" : "Add Expense") : step === 7 ? "Review →" : "Continue"}
            </motion.button>
          </div>

          {/* HELP SHEET */}
          <AnimatePresence>
          {showHelp && (
            <motion.div
              key="exp-help-overlay"
              style={S.helpOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .18 }}
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                style={S.helpSheet}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <div style={S.helpPill} />
                <div style={S.helpTitle}>What type of expense?</div>
                <div style={S.helpRow}>
                  <div style={S.helpDot(acc)} />
                  <div style={S.helpTxt}><strong style={{ color: "rgba(255,255,255,.9)" }}>Property expense</strong> &mdash; tied to a specific property. Goes on Schedule E and reduces taxable rental income. Examples: repairs, utilities, insurance.</div>
                </div>
                <div style={S.helpRow}>
                  <div style={S.helpDot(rgba(acc, .6))} />
                  <div style={S.helpTxt}><strong style={{ color: "rgba(255,255,255,.9)" }}>Business expense</strong> &mdash; the cost of running your PM business, not tied to one property. Examples: software, legal fees, CPA fees.</div>
                </div>
                <div style={S.helpRow}>
                  <div style={S.helpDot(rgba(acc, .35))} />
                  <div style={S.helpTxt}><strong style={{ color: "rgba(255,255,255,.9)" }}>Capital improvement</strong> &mdash; a major upgrade depreciated over years, not deducted immediately. Examples: new roof, HVAC system, full flooring.</div>
                </div>
                <button style={S.helpClose} onClick={() => setShowHelp(false)}>Got it</button>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
