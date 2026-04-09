"use client";
import React, { useState, useMemo, useCallback } from "react";

/* ---- Constants ---- */
const PAY_METHODS = ["Zelle","Venmo","Cash","Bank Transfer","CashApp","Stripe/ACH","Check","Other"];
const ROWS_PER_PAGE = 50;
const MONO = "'SF Mono','Cascadia Code','Consolas',monospace";

/* ---- SVG Icons (minimal, flat) ---- */
const SortArrow = ({ dir }) => <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" style={{ marginLeft: 3, verticalAlign: "middle" }}>{dir === "asc" ? <polyline points="2 6 5 3 8 6"/> : <polyline points="2 4 5 7 8 4"/>}</svg>;
const IconSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX = () => <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>;
const IconPlus = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconReceipt = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 00-2-2z"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="12" y2="12"/></svg>;
const IconEdit = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const IconLock = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconExport = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 3, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const IconUpload = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconPhone = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IconMail = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconGrip = () => <svg width="10" height="10" viewBox="0 0 16 16" fill="#9ca3af"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>;
const IconSortAZ = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h7M3 12h5M3 18h3M16 6v14M12 16l4 4 4-4"/></svg>;
const IconSortZA = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 18h7M3 12h5M3 6h3M16 18V4M12 8l4-4 4 4"/></svg>;

/* ---- Helpers ---- */
const allRooms = (p) => (p.units || []).flatMap(u => (u.rooms || []).map(r => ({ ...r, unitName: u.name, propName: p.addr || p.name, propId: p.id })));
const chargeStatus = (c, TODAY) => { if (c.deleted) return "deleted"; if (c.voided) return "voided"; if (c.waived) return "waived"; if (c.amountPaid >= c.amount) return "paid"; if (c.amountPaid > 0) return "partial"; if (new Date(c.dueDate + "T00:00:00") < TODAY) return "pastdue"; return "unpaid"; };
const fmt = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmt2 = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtD = (d) => { if (!d) return "--"; const dt = new Date(d + "T00:00:00"); return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear(); };
const todayStr = (T) => { const d = T || new Date(); return d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10); };
const ymStr = (d) => d ? d.slice(0, 7) : "";
const monthOf = (T) => { const d = T instanceof Date ? T : new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); };

/* ---- Shared style factories ---- */
const rowBorder = () => "none";

const thS = (align) => ({
  textAlign: align || "left", padding: "6px 8px", fontSize: 9, fontWeight: 600,
  color: "#6b7280", textTransform: "uppercase", letterSpacing: .8,
  cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
  borderBottom: "1px solid #e5e7eb", fontFamily: "inherit",
});

const inputS = {
  fontSize: 12, padding: "6px 8px", borderRadius: 6,
  border: "1px solid #d1d5db", fontFamily: "inherit",
  width: "100%", boxSizing: "border-box", minHeight: 44, color: "#1a1714",
  outline: "none", background: "#fff", WebkitAppearance: "auto", appearance: "auto",
};

const selectS = {
  fontSize: 11, padding: "4px 6px", borderRadius: 6,
  border: "1px solid #d1d5db", fontFamily: "inherit", color: "#374151",
  height: 28, outline: "none",
};

const labelS = {
  fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase",
  letterSpacing: .6, marginBottom: 3, display: "block",
};

const kpiS = (accentColor) => ({
  flex: 1, padding: "12px 14px", background: "#fff",
  border: "1px solid rgba(0,0,0,.08)", borderRadius: 6,
  borderLeft: accentColor ? `3px solid ${accentColor}` : "1px solid rgba(0,0,0,.08)",
  minWidth: 120,
});

const statusText = (status) => {
  const base = { fontSize: 11, fontWeight: 600, textTransform: "capitalize", letterSpacing: .2 };
  if (status === "paid") return { ...base, color: "#2d6a3f" };
  if (status === "unpaid") return { ...base, color: "#374151" };
  if (status === "pastdue") return { ...base, color: "#dc2626", display: "inline-flex", alignItems: "center", gap: 4 };
  if (status === "partial") return { ...base, color: "#374151" };
  if (status === "deleted") return { ...base, color: "#6b7280", textDecoration: "line-through", fontStyle: "italic" };
  if (status === "waived" || status === "voided") return { ...base, color: "#6b7280", textDecoration: "line-through" };
  if (status === "applied") return { ...base, color: "#d4a853" };
  return { ...base, color: "#6b7280" };
};

const monoRight = { textAlign: "right", fontFamily: MONO, fontVariantNumeric: "tabular-nums" };

const sectionLabel = {
  fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase",
  letterSpacing: 1, marginBottom: 8,
};

const cardS = {
  background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 6,
};

const btnPrimary = {
  fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6,
  border: "none", background: "#1a1714", color: "#fff",
  cursor: "pointer", fontFamily: "inherit", display: "inline-flex",
  alignItems: "center", gap: 4, height: 30, minHeight: 44, transition: "opacity .15s",
};

const btnSecondary = {
  fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6,
  border: "1px solid #d1d5db", background: "#fff", color: "#374151",
  cursor: "pointer", fontFamily: "inherit", display: "inline-flex",
  alignItems: "center", gap: 4, height: 30, minHeight: 44, transition: "all .15s",
};

const btnDanger = {
  ...btnSecondary, color: "#dc2626", borderColor: "#fca5a5",
};

const btnGhost = {
  background: "none", border: "none", cursor: "pointer", padding: 3,
  color: "#6b7280", display: "inline-flex", alignItems: "center",
  transition: "color .15s", minWidth: 44, minHeight: 44, justifyContent: "center",
};

/* ==================================================================== */
const TipStyle = ({ _ac }) => <style>{`
[data-tip]{position:relative}
[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);white-space:nowrap;font-size:10px;font-weight:500;color:#fff;background:#1a1714;padding:3px 8px;border-radius:4px;pointer-events:none;z-index:999;font-family:inherit;letter-spacing:0}
[data-tip]:hover::before{content:"";position:absolute;bottom:calc(100%);left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#1a1714;pointer-events:none;z-index:99}
[data-ledger] [data-sbtn]:not([data-on]):hover{border-color:#374151!important;color:#374151!important;background:#f3f4f6!important}
`}</style>;

export default function Ledger({
  charges = [], expenses = [], credits = [], sdLedger = [], mortgages = [], improvements = [], props = [], vendors = [], settings, subcats = {},
  TODAY, setCharges, setExpenses, setCredits, setVendors, setMortgages, setImprovements, setSubcats,
  createCharge, recordPayment, setModal, uid, adminGoTab,
  CHARGE_CATS = ["Rent","Last Month Rent","Utilities","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"],
  SCHED_E_CATS = [{cat:"Advertising",hint:"Listing fees, signage"},{cat:"Auto & Travel",hint:"Mileage"},{cat:"Cleaning & Maintenance",hint:"Routine cleaning"},{cat:"Commissions",hint:"Leasing agent fees"},{cat:"Insurance",hint:"Hazard, liability"},{cat:"Legal & Professional Fees",hint:"CPA, attorney"},{cat:"Management Fees",hint:"PM software"},{cat:"Mortgage Interest",hint:"Interest from 1098"},{cat:"Other Interest",hint:"Hard money"},{cat:"Repairs",hint:"Fixes that restore"},{cat:"Supplies",hint:"Cleaning supplies, tools"},{cat:"Taxes \u2014 Property",hint:"Annual property tax"},{cat:"Utilities",hint:"Electric, gas, water"},{cat:"Depreciation",hint:"Calculated by CPA"},{cat:"Other",hint:"Catch-all"}],
  IMPROVEMENT_TYPES = ["Addition","Appliance","Flooring","HVAC","Landscaping","Plumbing","Electrical","Roof","Windows","Other"],
}) {
  const _ac = settings?.adminAccent || "#4a7c59";

  /* ---- Global state ---- */
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState({ name: "", property: "", vendor: "", category: "" });

  /* Switch tab with optional filter context */
  const goTab = useCallback((tab, filter = {}) => {
    setActiveTab(tab);
    setGlobalFilter(f => ({ name: "", property: "", vendor: "", category: "", ...filter }));
  }, []);

  /* ---- Tab bar ---- */
  const TABS = [
    { key: "all", label: "All Activity" },
    { key: "income", label: "Income" },
    { key: "expenses", label: "Expenses" },
    { key: "vendors", label: "Vendors" },
    { key: "assets", label: "Assets" },
  ];

  return (
    <div data-ledger>
      <TipStyle _ac={_ac} />
      {/* Sub-tab bar -- clean underline style */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e5e7eb", marginBottom: 16, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => goTab(t.key)}
            style={{
              padding: "8px 16px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              background: "none", border: "none",
              borderBottom: activeTab === t.key ? "2px solid #d4a853" : "2px solid transparent",
              color: activeTab === t.key ? "#1a1714" : "#6b7280",
              cursor: "pointer", marginBottom: -1, transition: "all .15s",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "all" && <AllActivityTab charges={charges} expenses={expenses} credits={credits} props={props} vendors={vendors} settings={settings} subcats={subcats} TODAY={TODAY} setCharges={setCharges} setExpenses={setExpenses} setCredits={setCredits} setVendors={setVendors} setSubcats={setSubcats} createCharge={createCharge} recordPayment={recordPayment} setModal={setModal} uid={uid} CHARGE_CATS={CHARGE_CATS} SCHED_E_CATS={SCHED_E_CATS} goTab={goTab} globalFilter={globalFilter} _ac={_ac} adminGoTab={adminGoTab} />}
      {activeTab === "income" && <IncomeTab charges={charges} expenses={expenses} props={props} TODAY={TODAY} goTab={goTab} _ac={_ac} globalFilter={globalFilter} adminGoTab={adminGoTab} CHARGE_CATS={CHARGE_CATS} />}
      {activeTab === "expenses" && <ExpensesTab expenses={expenses} props={props} vendors={vendors} settings={settings} subcats={subcats} TODAY={TODAY} setExpenses={setExpenses} uid={uid} SCHED_E_CATS={SCHED_E_CATS} goTab={goTab} globalFilter={globalFilter} _ac={_ac} />}
      {activeTab === "vendors" && <VendorsTab vendors={vendors} expenses={expenses} setVendors={setVendors} uid={uid} TODAY={TODAY} SCHED_E_CATS={SCHED_E_CATS} goTab={goTab} globalFilter={globalFilter} _ac={_ac} />}
      {activeTab === "assets" && <AssetsTab props={props} mortgages={mortgages} improvements={improvements} charges={charges} expenses={expenses} setMortgages={setMortgages} setImprovements={setImprovements} uid={uid} TODAY={TODAY} IMPROVEMENT_TYPES={IMPROVEMENT_TYPES} goTab={goTab} _ac={_ac} />}
    </div>
  );
}

/* ====================================================================
   SUB-TAB 1: ALL ACTIVITY
   ==================================================================== */
function AllActivityTab({ charges, expenses, credits, props, vendors, settings, subcats, TODAY, setCharges, setExpenses, setCredits, setVendors, setSubcats, createCharge, recordPayment, setModal, uid, CHARGE_CATS, SCHED_E_CATS, goTab, globalFilter, _ac, adminGoTab }) {
  const [quickAdd, setQuickAdd] = useState(null);
  const [search, setSearch] = useState(globalFilter.name || "");
  const [typeFilter, setTypeFilter] = useState("all");
  const [propFilter, setPropFilter] = useState(globalFilter.property ? [globalFilter.property] : []);
  const [catFilter, setCatFilter] = useState(globalFilter.category ? [globalFilter.category] : []);
  const [subcatFilter, setSubcatFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [vendorFilter, setVendorFilter] = useState([]);
  const [tenantFilter, setTenantFilter] = useState([]);
  const [dateRange, setDateRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [openDrop, setOpenDrop] = useState(null);
  React.useEffect(() => {
    if (!openDrop) return;
    const close = (e) => { if (!e.target.closest("[data-multidrop]")) setOpenDrop(null); };
    const t = setTimeout(() => document.addEventListener("mousedown", close), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", close); };
  }, [openDrop]);
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedRow, setExpandedRow] = useState(null);
  const [checked, setChecked] = useState({});
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeModal, setActiveModal] = useState(null); /* {type: "edit"|"reminder"|"payment"|"delete", charge: {...}} */
  const [manageModal, setManageModal] = useState(null);
  const [customPayMethods, setCustomPayMethods] = useState([]);
  const [subcatSort, setSubcatSort] = useState("custom"); /* custom | az | za | used */
  const [vendorSort, setVendorSort] = useState("custom"); /* custom | az | za | used | spend */
  const [propSort, setPropSort] = useState("custom"); /* custom | az | za | used | income */
  const [catSort, setCatSort] = useState("custom"); /* custom | az | za | used */
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [newSubcat, setNewSubcat] = useState("");
  const [newVName, setNewVName] = useState("");
  const [newVPhone, setNewVPhone] = useState("");
  const [newVEmail, setNewVEmail] = useState("");
  const [editVId, setEditVId] = useState(null);
  const [editVName, setEditVName] = useState("");
  const [editVPhone, setEditVPhone] = useState("");
  const [editVEmail, setEditVEmail] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [hiddenCols, setHiddenCols] = useState({});
  const [showColMenu, setShowColMenu] = useState(false);
  React.useEffect(() => {
    if (!showColMenu) return;
    const close = (e) => { if (!e.target.closest("[data-col-menu]")) setShowColMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showColMenu]);

  /* Payment form state */
  const [payTenant, setPayTenant] = useState("");
  const [payCharge, setPayCharge] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Zelle");
  const [payDate, setPayDate] = useState(todayStr(TODAY));
  const [payNotes, setPayNotes] = useState("");

  /* Expense form state */
  const [expDate, setExpDate] = useState(todayStr(TODAY));
  const [expAmount, setExpAmount] = useState("");
  const [expProp, setExpProp] = useState("");
  const [expCat, setExpCat] = useState("");
  const [expSubcat, setExpSubcat] = useState("");
  const [expVendor, setExpVendor] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expMethod, setExpMethod] = useState("Zelle");

  /* Charge form state */
  const [chgTenant, setChgTenant] = useState("");
  const [chgCat, setChgCat] = useState("Rent");
  const [chgAmount, setChgAmount] = useState("");
  const [chgDue, setChgDue] = useState(todayStr(TODAY));
  const [chgDesc, setChgDesc] = useState("");

  /* Unify rows — charges, payments (from charges), expenses, credits */
  const allRows = useMemo(() => {
    const rows = [];
    (charges || []).forEach(c => {
      /* The charge itself */
      rows.push({
        _src: c, _type: "charge", id: c.id,
        date: c.dueDate || c.createdDate, name: c.tenantName || "",
        property: c.propName || "", category: c.category || "", subcategory: "",
        desc: c.desc || "", amount: c.amount || 0,
        status: chargeStatus(c, TODAY), method: "",
      });
      /* Each individual payment on this charge */
      (c.payments || []).forEach((p, pi) => {
        rows.push({
          _src: { ...p, _charge: c }, _type: "payment", id: (c.id || "") + "-pay-" + pi,
          date: p.date || c.dueDate, name: c.tenantName || "",
          property: c.propName || "", category: c.category || "", subcategory: "",
          desc: "Payment — " + (c.desc || c.category || ""), amount: p.amount || 0,
          status: "paid", method: p.method || "",
        });
      });
    });
    (expenses || []).forEach(e => rows.push({
      _src: e, _type: "expense", id: e.id,
      date: e.date, name: e.vendor || "",
      property: e.propName || "", category: e.category || "", subcategory: e.subcategory || "",
      desc: e.description || "", amount: e.amount || 0,
      status: "paid", method: e.paymentMethod || "",
    }));
    (credits || []).forEach(cr => rows.push({
      _src: cr, _type: "credit", id: cr.id,
      date: cr.date || cr.createdDate, name: cr.tenantName || "",
      property: cr.propName || "", category: "Credit", subcategory: "",
      desc: cr.reason || cr.desc || "", amount: cr.amount || 0,
      status: cr.applied ? "applied" : "pending", method: "",
    }));
    return rows;
  }, [charges, expenses, credits, TODAY]);

  /* Date filter */
  const inDateRange = useCallback((dateStr) => {
    if (!dateStr || dateRange === "all") return true;
    const now = TODAY || new Date();
    const y = now instanceof Date ? now.getFullYear() : parseInt(String(now).slice(0, 4));
    const m = now instanceof Date ? now.getMonth() + 1 : parseInt(String(now).slice(5, 7));
    const prefix = y + "-" + String(m).padStart(2, "0");
    if (dateRange === "month") return dateStr.startsWith(prefix);
    if (dateRange === "lastmonth") { const lm = m === 1 ? 12 : m - 1; const ly = m === 1 ? y - 1 : y; return dateStr.startsWith(ly + "-" + String(lm).padStart(2, "0")); }
    if (dateRange === "quarter") { const qStart = Math.floor((m - 1) / 3) * 3 + 1; return dateStr >= y + "-" + String(qStart).padStart(2, "0") + "-01"; }
    if (dateRange === "lastquarter") { const cq = Math.floor((m - 1) / 3); const lqStart = cq === 0 ? 10 : (cq - 1) * 3 + 1; const lqy = cq === 0 ? y - 1 : y; const lqEnd = lqStart + 2; return dateStr >= lqy + "-" + String(lqStart).padStart(2, "0") + "-01" && dateStr < (lqEnd === 12 ? (lqy + 1) + "-01-01" : lqy + "-" + String(lqEnd + 1).padStart(2, "0") + "-01"); }
    if (dateRange === "ytd") return dateStr >= y + "-01-01";
    if (dateRange === "t12") { const d = new Date(now); d.setMonth(d.getMonth() - 12); return dateStr >= d.toISOString().split("T")[0]; }
    if (dateRange === "lastyear") return dateStr >= (y - 1) + "-01-01" && dateStr < y + "-01-01";
    if (dateRange === "custom") { if (customFrom && dateStr < customFrom) return false; if (customTo && dateStr > customTo) return false; return true; }
    return true;
  }, [dateRange, customFrom, customTo, TODAY]);

  /* Filter + sort */
  const filtered = useMemo(() => {
    let rows = allRows;
    /* Hide deleted by default unless explicitly filtered */
    if (!statusFilter.includes("deleted")) rows = rows.filter(r => r.status !== "deleted");
    if (typeFilter !== "all") rows = rows.filter(r => typeFilter === "charges" ? r._type === "charge" : typeFilter === "payments" ? r._type === "payment" : typeFilter === "expenses" ? r._type === "expense" : r._type === "credit");
    if (propFilter.length) rows = rows.filter(r => propFilter.includes(r.property));
    if (catFilter.length) rows = rows.filter(r => catFilter.includes(r.category));
    if (subcatFilter.length) rows = rows.filter(r => subcatFilter.includes(r.subcategory));
    if (statusFilter.length) rows = rows.filter(r => statusFilter.includes(r.status));
    if (vendorFilter.length) rows = rows.filter(r => r._type === "expense" && vendorFilter.includes(r.name));
    if (tenantFilter.length) rows = rows.filter(r => (r._type === "charge" || r._type === "payment") && tenantFilter.includes(r.name));
    rows = rows.filter(r => inDateRange(r.date));
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r => r.name.toLowerCase().includes(q) || r.property.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || (r.subcategory || "").toLowerCase().includes(q) || String(r.amount).includes(q));
    }
    rows.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortCol === "amount") { va = Number(va); vb = Number(vb); }
      else { va = String(va || ""); vb = String(vb || ""); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [allRows, typeFilter, propFilter, catFilter, subcatFilter, statusFilter, vendorFilter, tenantFilter, search, sortCol, sortDir, inDateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  /* Group by month for display (only when sorted by date) */
  const monthGroups = useMemo(() => {
    if (sortCol !== "date") {
      return [{ label: null, ym: "all", rows: pageRows }];
    }
    const groups = [];
    let currentMonth = null;
    pageRows.forEach(r => {
      const d = r.date || "";
      const ym = d.slice(0, 7);
      const label = ym ? (() => { const dt = new Date(d + "T00:00:00"); return dt.toLocaleString("default", { month: "long", year: "numeric" }); })() : "Unknown";
      if (ym !== currentMonth) { groups.push({ label, ym, rows: [] }); currentMonth = ym; }
      groups[groups.length - 1].rows.push(r);
    });
    return groups;
  }, [pageRows, sortCol]);
  const checkedIds = Object.keys(checked).filter(k => checked[k]);
  const toggleSort = (col) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("desc"); } };
  const propNames = useMemo(() => [...new Set(allRows.map(r => r.property).filter(Boolean))].sort(), [allRows]);
  const catNames = useMemo(() => {
    const fromData = allRows.map(r => r.category).filter(Boolean);
    const fromCharge = (CHARGE_CATS || []).filter(c => typeof c === "string");
    const fromSched = (SCHED_E_CATS || []).map(c => typeof c === "string" ? c : (c.label || c.cat || "")).filter(Boolean);
    return [...new Set([...fromData, ...fromCharge, ...fromSched])].filter(v => typeof v === "string" && v).sort();
  }, [allRows, CHARGE_CATS, SCHED_E_CATS]);
  const subcatNames = useMemo(() => catFilter.length ? [...new Set(allRows.filter(r => catFilter.includes(r.category)).map(r => r.subcategory).filter(Boolean))].sort() : [...new Set(allRows.map(r => r.subcategory).filter(Boolean))].sort(), [allRows, catFilter]);
  const vendorNames = useMemo(() => [...new Set(allRows.filter(r => r._type === "expense").map(r => r.name).filter(Boolean))].sort(), [allRows]);
  const tenantNames = useMemo(() => [...new Set(allRows.filter(r => r._type === "charge" || r._type === "payment").map(r => r.name).filter(Boolean))].sort(), [allRows]);
  const hasActiveFilters = propFilter.length || catFilter.length || subcatFilter.length || statusFilter.length || vendorFilter.length || tenantFilter.length || dateRange !== "all";

  /* All tenants from properties + charges */
  /* Active tenants = only from props (matches Tenants tab) */
  const activeTenantNames = useMemo(() => {
    const names = new Set();
    (props || []).forEach(p => allRooms(p).forEach(r => {
      const n = r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "");
      if (n) names.add(n);
    }));
    return [...names].sort();
  }, [props]);
  /* All tenant names including from charges (for filters — shows historical too) */
  const allTenantNames = useMemo(() => {
    const names = new Set(activeTenantNames);
    (charges || []).forEach(c => { if (c.tenantName) names.add(c.tenantName); });
    return [...names].sort();
  }, [charges, activeTenantNames]);
  const unpaidCharges = useMemo(() => (charges || []).filter(c => !c.voided && !c.waived && (c.amountPaid || 0) < (c.amount || 0)), [charges]);
  const payTenants = activeTenantNames; /* Only active tenants for payment form */
  const payTenantCharges = useMemo(() => payTenant ? (charges || []).filter(c => c.tenantName === payTenant && !c.voided && !c.waived) : [], [charges, payTenant]);

  /* Occupied rooms for charge form */
  const occupiedRooms = useMemo(() => {
    const rooms = [];
    (props || []).forEach(p => allRooms(p).forEach(r => { if (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) rooms.push(r); }));
    return rooms;
  }, [props]);

  const handlePayTenantChange = (name) => {
    setPayTenant(name);
    const tc = (charges || []).filter(c => c.tenantName === name && !c.voided && !c.waived && (c.amountPaid || 0) < (c.amount || 0)).sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
    if (tc.length > 0) { setPayCharge(tc[0].id); setPayAmount(String((tc[0].amount || 0) - (tc[0].amountPaid || 0))); }
    else { setPayCharge(""); setPayAmount(""); }
  };

  const submitPayment = () => {
    if (!payTenant || !payAmount || !payMethod) return;
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    const payData = { id: uid ? uid() : "py-" + Date.now(), amount: amt, method: payMethod, date: payDate, depositDate: payDate, depositStatus: "deposited", confId: "BB-" + Math.random().toString(36).slice(2, 10).toUpperCase(), notes: payNotes };
    if (payCharge && payCharge !== "_credit") {
      /* Apply to specific charge */
      recordPayment?.(payCharge, payData);
    } else {
      /* No charge selected — create account credit */
      const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === payTenant);
      setCredits?.(prev => [...(prev || []), { id: uid ? uid() : "cr-" + Date.now(), roomId: room?.id || "", tenantName: payTenant, propName: room?.propName || "", amount: amt, reason: "Account payment — " + payMethod + (payNotes ? " — " + payNotes : ""), date: payDate, applied: false }]);
    }
    setQuickAdd(null); setPayTenant(""); setPayCharge(""); setPayAmount(""); setPayNotes("");
  };

  const submitExpense = () => {
    if (!expAmount || !expCat) return;
    const propObj = (props || []).find(p => p.id === expProp);
    setExpenses?.(prev => [...(prev || []), { id: uid ? uid() : "ex-" + Date.now(), date: expDate, amount: parseFloat(expAmount), propId: expProp, propName: propObj ? (propObj.addr || propObj.name) : (expProp === "shared" ? "Shared" : ""), category: expCat, subcategory: expSubcat, vendor: expVendor, description: expDesc, paymentMethod: expMethod }]);
    setQuickAdd(null); setExpAmount(""); setExpDesc(""); setExpSubcat("");
  };

  const autoDesc = (cat, tenant) => {
    if (!cat || !tenant) return "";
    const now = TODAY instanceof Date ? TODAY : new Date();
    const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    if (cat === "Rent") return monthName + " Rent";
    if (cat === "Late Fee") return monthName + " Late Fee";
    if (cat === "Security Deposit") return "Security Deposit";
    if (cat === "Utilities") return monthName + " Utilities";
    return cat;
  };
  const submitCharge = () => {
    if (!chgTenant || !chgAmount || !chgCat) return;
    const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === chgTenant);
    const desc = chgDesc || autoDesc(chgCat, chgTenant);
    createCharge?.({ id: uid ? uid() : "ch-" + Date.now(), tenantName: chgTenant, propName: room?.propName || "", roomName: room?.name || "", roomId: room?.id, category: chgCat, amount: parseFloat(chgAmount), amountPaid: 0, dueDate: chgDue, desc, createdDate: todayStr(TODAY), payments: [] });
    setQuickAdd(null); setChgAmount(""); setChgDesc("");
  };

  /* Return SD form state */
  const [sdTenant, setSdTenant] = useState("");
  const [sdDeductionItems, setSdDeductionItems] = useState([]);
  const [sdNotes, setSdNotes] = useState("");
  const DEDUCTION_TYPES = ["Damages", "Cleaning", "Unpaid Rent", "Lock Change", "Key Replacement", "Painting", "Carpet Repair", "Other"];
  /* Auto-populate deposit held from charges */
  const sdHeld = useMemo(() => {
    if (!sdTenant) return 0;
    return (charges || []).filter(c => c.tenantName === sdTenant && c.category === "Security Deposit" && !c.voided && !c.deleted).reduce((s, c) => s + (c.amountPaid || 0), 0);
  }, [sdTenant, charges]);
  const sdTotalDeductions = sdDeductionItems.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const sdReturnAmount = Math.max(0, sdHeld - sdTotalDeductions);
  const addDeductionItem = () => setSdDeductionItems(prev => [...prev, { id: uid ? uid() : "ded-" + Date.now(), type: "Damages", description: "", amount: "" }]);
  const updateDeductionItem = (id, field, value) => setSdDeductionItems(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  const removeDeductionItem = (id) => setSdDeductionItems(prev => prev.filter(d => d.id !== id));
  /* Credit form state */
  const [crTenant, setCrTenant] = useState("");
  const [crAmount, setCrAmount] = useState("");
  const [crReason, setCrReason] = useState("");
  /* Export menu */
  const [showExport, setShowExport] = useState(false);
  React.useEffect(() => {
    if (!showExport) return;
    const close = (e) => { if (!e.target.closest("[data-export-menu]")) setShowExport(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showExport]);

  const submitReturnSD = () => {
    if (!sdTenant || sdHeld <= 0) return;
    const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === sdTenant);
    const propName = room?.propName || "";
    const roomName = room?.name || "";
    /* Create credit for the return amount */
    const deductionSummary = sdDeductionItems.filter(d => parseFloat(d.amount) > 0).map(d => d.type + (d.description ? ": " + d.description : "") + " — " + fmt2(parseFloat(d.amount))).join("; ");
    setCredits?.(prev => [...(prev || []), { id: uid ? uid() : "cr-" + Date.now(), roomId: room?.id || "", tenantName: sdTenant, propName, amount: sdReturnAmount, reason: "Security deposit return" + (sdTotalDeductions > 0 ? " (deductions: " + fmt2(sdTotalDeductions) + ")" : "") + (sdNotes ? " — " + sdNotes : ""), date: todayStr(TODAY), applied: false }]);
    /* Generate PDF statement */
    const w = window.open("", "_blank");
    const deductionRows = sdDeductionItems.filter(d => parseFloat(d.amount) > 0).map(d =>
      `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px">${d.type}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px">${d.description || "--"}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-family:monospace;font-weight:600">-${fmt2(parseFloat(d.amount))}</td></tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Security Deposit Disposition — ${sdTenant}</title><style>
      body{font-family:Georgia,serif;max-width:620px;margin:40px auto;padding:0 32px;color:#1a1714;line-height:1.6}
      .header{text-align:center;border-bottom:2px solid #1a1714;padding-bottom:16px;margin-bottom:24px}
      .header h1{font-size:18px;font-weight:700;margin:0 0 4px}
      .title{font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:24px}
      .info{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;font-size:13px}
      .info .label{font-weight:700;color:#333;margin-bottom:2px}
      .info .value{color:#555}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#666;border-bottom:2px solid #1a1714;padding:8px}
      th:last-child{text-align:right}
      .summary{border-top:2px solid #1a1714;padding:8px 0}
      .summary-row{display:flex;justify-content:space-between;padding:4px 8px;font-size:13px}
      .summary-row.total{font-weight:800;font-size:16px;border-top:1px solid #ccc;padding-top:8px;margin-top:4px}
      .footer{margin-top:40px;font-size:11px;color:#999;text-align:center}
      .sig{margin-top:40px;border-top:1px solid #999;width:200px;padding-top:4px;font-size:11px;color:#666}
      @media print{body{margin:20px}}
    </style></head><body>
      <div class="header"><h1>${settings?.company_name || "Property Management"}</h1></div>
      <div class="title">Security Deposit Disposition Statement</div>
      <div style="font-size:12px;color:#666;text-align:center;margin-bottom:20px">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      <div class="info">
        <div><div class="label">Tenant</div><div class="value">${sdTenant}</div></div>
        <div><div class="label">Property</div><div class="value">${propName}${roomName ? " — " + roomName : ""}</div></div>
        <div><div class="label">Move-In</div><div class="value">${room?.moveIn ? fmtD(room.moveIn) : (room?.tenant?.moveIn ? fmtD(room.tenant.moveIn) : "--")}</div></div>
        <div><div class="label">Security Deposit Held</div><div class="value" style="font-weight:700;font-size:16px">${fmt2(sdHeld)}</div></div>
      </div>
      ${sdDeductionItems.filter(d => parseFloat(d.amount) > 0).length > 0 ? `
        <table>
          <thead><tr><th>Deduction Type</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${deductionRows}</tbody>
        </table>
      ` : ""}
      <div class="summary">
        <div class="summary-row"><span>Security Deposit Held</span><span style="font-family:monospace;font-weight:600">${fmt2(sdHeld)}</span></div>
        <div class="summary-row"><span>Total Deductions</span><span style="font-family:monospace;font-weight:600;color:#dc2626">-${fmt2(sdTotalDeductions)}</span></div>
        <div class="summary-row total"><span>Net Refund to Tenant</span><span style="font-family:monospace">${fmt2(sdReturnAmount)}</span></div>
      </div>
      ${sdNotes ? `<div style="margin-top:16px;font-size:12px;color:#555"><strong>Notes:</strong> ${sdNotes}</div>` : ""}
      <div class="sig">Property Manager Signature</div>
      <div class="footer">${settings?.company_name || ""}${settings?.phone ? " | " + settings.phone : ""}${settings?.email ? " | " + settings.email : ""}</div>
    </body></html>`);
    w.document.close(); w.print();
    setQuickAdd(null); setSdTenant(""); setSdDeductionItems([]); setSdNotes("");
  };

  const submitCredit = () => {
    if (!crTenant || !crAmount) return;
    const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === crTenant);
    setCredits?.(prev => [...(prev || []), { id: uid ? uid() : "cr-" + Date.now(), roomId: room?.id || "", tenantName: crTenant, propName: room?.propName || "", amount: parseFloat(crAmount), reason: crReason || "Account credit", date: todayStr(TODAY), applied: false }]);
    setQuickAdd(null); setCrTenant(""); setCrAmount(""); setCrReason("");
  };

  const handleWaive = (c) => setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, waived: true } : x));
  const handleUnwaive = (c) => setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, waived: false, waivedReason: "" } : x));
  const handleDeleteExpense = (e) => setExpenses?.(prev => (prev || []).filter(x => x.id !== e.id));
  const startEditExpense = (e) => { setEditingId(e.id); setEditData({ _type: "expense", date: e.date || "", amount: String(e.amount || ""), category: e.category || "", subcategory: e.subcategory || "", vendor: e.vendor || "", description: e.description || "", paymentMethod: e.paymentMethod || "" }); };
  const saveEditExpense = () => { setExpenses?.(prev => (prev || []).map(x => x.id === editingId ? { ...x, date: editData.date, amount: parseFloat(editData.amount) || x.amount, category: editData.category, subcategory: editData.subcategory, vendor: editData.vendor, description: editData.description, paymentMethod: editData.paymentMethod } : x)); setEditingId(null); setEditData({}); };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };
  const DEFAULT_COLS = [
    { key: "date", label: "Date" },
    { key: "name", label: "Name" },
    { key: "property", label: "Property" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "desc", label: "Description" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];
  const [colOrder, setColOrder] = useState(DEFAULT_COLS.map(c => c.key));
  const [dragCol, setDragCol] = useState(null);
  const orderedCols = colOrder.map(k => DEFAULT_COLS.find(c => c.key === k)).filter(Boolean);
  const visibleCols = orderedCols.filter(c => !hiddenCols[c.key]);
  const dragTimer = React.useRef(null);
  const isDragging = React.useRef(false);
  const handleColMouseDown = (key) => {
    isDragging.current = false;
    dragTimer.current = setTimeout(() => { isDragging.current = true; setDragCol(key); }, 200);
  };
  const handleColMouseUp = (key) => {
    clearTimeout(dragTimer.current);
    if (!isDragging.current) { toggleSort(key); }
    setDragCol(null); isDragging.current = false;
  };
  const handleDragOver = (e, key) => { e.preventDefault(); if (!dragCol || dragCol === key) return; setColOrder(prev => { const next = [...prev]; const from = next.indexOf(dragCol); const to = next.indexOf(key); next.splice(from, 1); next.splice(to, 0, dragCol); return next; }); };
  const handleDragEnd = () => { setDragCol(null); isDragging.current = false; };

  /* CSV export */
  const exportCSV = () => {
    const exportRows = checkedIds.length > 0 ? filtered.filter(r => checkedIds.includes(r.id)) : filtered;
    const headers = ["Type", "Date", "Name", "Property", "Category", "Subcategory", "Description", "Amount", "Status"];
    const csvRows = [headers.join(",")];
    exportRows.forEach(r => {
      csvRows.push([r._type, r.date, '"' + (r.name || "").replace(/"/g, '""') + '"', '"' + (r.property || "").replace(/"/g, '""') + '"', '"' + (r.category || "") + '"', '"' + (r.subcategory || "") + '"', '"' + (r.desc || "").replace(/"/g, '""') + '"', r._type === "expense" ? "-" + r.amount : r.amount, r.status].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "ledger-export.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const exportRows = checkedIds.length > 0 ? filtered.filter(r => checkedIds.includes(r.id)) : filtered;
    const w = window.open("", "_blank");
    const rows = exportRows.map(r => `<tr><td>${r._type}</td><td>${fmtD(r.date)}</td><td>${r.name || "--"}</td><td>${r.property || "--"}</td><td>${r.category || "--"}</td><td>${r.subcategory || "--"}</td><td>${r.desc || "--"}</td><td style="text-align:right;font-family:monospace">${r._type === "expense" ? "-" : ""}${fmt2(r.amount)}</td><td>${r.status}</td></tr>`).join("");
    const total = exportRows.reduce((s, r) => s + (r._type === "expense" ? -(r.amount || 0) : (r.amount || 0)), 0);
    w.document.write(`<!DOCTYPE html><html><head><title>Ledger Export</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:32px auto;font-size:12px;color:#1a1714}h1{font-size:18px;border-bottom:2px solid #1a1714;padding-bottom:8px}table{width:100%;border-collapse:collapse;margin:16px 0}th{text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:#6b7280;border-bottom:2px solid #1a1714;padding:6px 4px}td{padding:5px 4px;border-bottom:1px solid #eee;font-size:11px}.total{font-weight:700;font-size:13px;text-align:right;border-top:2px solid #1a1714;padding:8px 4px}@media print{body{margin:12px}}</style></head><body><h1>Ledger Export</h1><div style="font-size:11px;color:#6b7280;margin-bottom:12px">${exportRows.length} transactions | Generated ${new Date().toLocaleDateString()}</div><table><thead><tr><th>Type</th><th>Date</th><th>Name</th><th>Property</th><th>Category</th><th>Subcat</th><th>Description</th><th style="text-align:right">Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="7" class="total">Net Total</td><td class="total" style="font-family:monospace">${fmt2(total)}</td><td></td></tr></tfoot></table></body></html>`);
    w.document.close(); w.print();
  };

  const visibleColCount = visibleCols.length + 1; /* +1 for checkbox */

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 200px)" }}>
      {/* Quick-add bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center", flexShrink: 0 }}>
        {[["payment", "Payment"], ["expense", "Record Expense"], ["charge", "Charge"], ["returnsd", "Return SD"], ["credit", "Credit"]].map(([k, l]) => k === "payment" ? (
          <button key={k} onClick={() => setActiveModal({ type: "payment", charge: null })}
            onMouseEnter={e => { e.currentTarget.style.background = _ac + "12"; e.currentTarget.style.borderColor = _ac; e.currentTarget.style.color = _ac; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
            style={btnSecondary}>
            <IconPlus /> {l}
          </button>
        ) : (
          <button key={k} onClick={() => setQuickAdd(quickAdd === k ? null : k)}
            onMouseEnter={e => { if (quickAdd !== k) { e.currentTarget.style.background = _ac + "12"; e.currentTarget.style.borderColor = _ac; e.currentTarget.style.color = _ac; } }}
            onMouseLeave={e => { if (quickAdd !== k) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; } }}
            style={quickAdd === k ? { ...btnPrimary, background: _ac, borderColor: _ac } : btnSecondary}>
            <IconPlus /> {l}
          </button>
        ))}
      </div>

      {/* Quick Add Expense */}
      {quickAdd === "expense" && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>Add Expense</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={labelS}>Date</label>
              <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Amount</label>
              <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="0.00" style={inputS} />
            </div>
            <div>
              <label style={labelS}>Property <button onClick={() => setManageModal("properties")} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 9, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit", padding: 0, marginLeft: 4 }}>Manage</button></label>
              <select value={expProp} onChange={e => setExpProp(e.target.value)} style={inputS}>
                <option value="">Select...</option>
                <option value="shared">Shared</option>
                {(props || []).map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Category <button onClick={() => setManageModal("categories")} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 9, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit", padding: 0, marginLeft: 4 }}>Manage</button></label>
              <select value={expCat} onChange={e => setExpCat(e.target.value)} style={inputS}>
                <option value="">Select...</option>
                {SCHED_E_CATS.map(c => <option key={c.label||c.cat} value={c.label||c.cat}>{c.label||c.cat}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <label style={labelS}>Subcategory <button onClick={() => setManageModal("subcats")} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 9, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit", padding: 0, marginLeft: 4 }}>Manage</button></label>
              <select value={expSubcat} onChange={e => setExpSubcat(e.target.value)} style={inputS}>
                <option value="">None</option>
                {(subcats?.[expCat] || []).map(sc => { const lbl = typeof sc === "object" ? (sc.label || sc.id || "") : sc; return <option key={lbl} value={lbl}>{lbl}</option>; })}
              </select>
            </div>
            <div>
              <label style={labelS}>Vendor <button onClick={() => setManageModal("vendors")} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 9, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit", padding: 0, marginLeft: 4 }}>Manage</button></label>
              <select value={expVendor} onChange={e => setExpVendor(e.target.value)} style={inputS}>
                <option value="">Select...</option>
                {(vendors || []).map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Description</label>
              <input value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="What was this for?" style={inputS} />
            </div>
            <div>
              <label style={labelS}>Pay Method <button onClick={() => setManageModal("payMethods")} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 9, fontWeight: 600, textDecoration: "underline", fontFamily: "inherit", padding: 0, marginLeft: 4 }}>Manage</button></label>
              <select value={expMethod} onChange={e => setExpMethod(e.target.value)} style={inputS}>
                {[...PAY_METHODS, ...customPayMethods].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnPrimary} onClick={submitExpense}>Save Expense</button>
            <button style={btnSecondary} onClick={() => setQuickAdd(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Quick Add Charge */}
      {quickAdd === "charge" && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>Create Charge</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={labelS}>Tenant</label>
              <select value={chgTenant} onChange={e => {
                setChgTenant(e.target.value);
                if (chgCat === "Rent") {
                  const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === e.target.value);
                  if (room?.rent) setChgAmount(String(room.rent));
                  const now = TODAY instanceof Date ? TODAY : new Date(); const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                  setChgDue(next.toISOString().split("T")[0]);
                  setChgDesc(autoDesc("Rent", e.target.value));
                }
              }} style={inputS}>
                <option value="">Select tenant...</option>
                {occupiedRooms.map(r => <option key={r.id} value={r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")}>{r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")} ({r.propName})</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {["Rent", "Late Fee", "Utilities", "Security Deposit"].map(cat => (
                  <button key={cat} onClick={() => {
                    setChgCat(cat);
                    if (cat === "Rent" && chgTenant) {
                      const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === chgTenant);
                      if (room?.rent) setChgAmount(String(room.rent));
                      const now = TODAY instanceof Date ? TODAY : new Date(); const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                      setChgDue(next.toISOString().split("T")[0]);
                    } else if (cat !== "Rent") { setChgAmount(""); }
                    setChgDesc(autoDesc(cat, chgTenant));
                  }} style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4,
                    border: chgCat === cat ? "1px solid #1a1714" : "1px solid #d1d5db",
                    background: chgCat === cat ? "#1a1714" : "#fff",
                    color: chgCat === cat ? "#fff" : "#374151",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{cat}</button>
                ))}
                <select value={!["Rent", "Late Fee", "Utilities", "Security Deposit"].includes(chgCat) ? chgCat : ""} onChange={e => { setChgCat(e.target.value); setChgAmount(""); setChgDesc(autoDesc(e.target.value, chgTenant)); }} style={{ fontSize: 10, padding: "3px 6px", borderRadius: 4, border: !["Rent", "Late Fee", "Utilities", "Security Deposit", ""].includes(chgCat) ? "1px solid #1a1714" : "1px solid #d1d5db", background: !["Rent", "Late Fee", "Utilities", "Security Deposit", ""].includes(chgCat) ? "#1a1714" : "#fff", color: !["Rent", "Late Fee", "Utilities", "Security Deposit", ""].includes(chgCat) ? "#fff" : "#374151", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  <option value="">Other...</option>
                  {CHARGE_CATS.filter(c => !["Rent", "Late Fee", "Utilities", "Security Deposit"].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelS}>Amount</label>
              <input type="number" value={chgAmount} onChange={e => setChgAmount(e.target.value)} placeholder="0.00" style={inputS} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <label style={labelS}>Due Date</label>
              <input type="date" value={chgDue} onChange={e => setChgDue(e.target.value)} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Description</label>
              <input value={chgDesc} onChange={e => setChgDesc(e.target.value)} placeholder="Optional note" style={inputS} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnPrimary} onClick={submitCharge}>Create Charge</button>
            <button style={btnSecondary} onClick={() => setQuickAdd(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Quick Add Return SD */}
      {quickAdd === "returnsd" && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>Return Security Deposit</div>
          {/* Tenant + Deposit Held (read-only) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Tenant</label>
              <select value={sdTenant} onChange={e => { setSdTenant(e.target.value); setSdDeductionItems([]); }} style={inputS}>
                <option value="">Select tenant...</option>
                {activeTenantNames.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Deposit Held</label>
              <div style={{ ...inputS, background: "#f3f4f6", display: "flex", alignItems: "center", fontWeight: 700, fontFamily: MONO, color: "#1a1714", cursor: "default" }}>
                {sdTenant ? fmt2(sdHeld) : "--"}
                {sdTenant && sdHeld === 0 && <span style={{ fontSize: 9, color: "#dc2626", marginLeft: 6, fontFamily: "inherit", fontWeight: 500 }}>No SD on file</span>}
              </div>
            </div>
          </div>

          {/* Itemized deductions */}
          {sdTenant && sdHeld > 0 && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={labelS}>Deductions</label>
              <button style={{ ...btnSecondary, height: 24, fontSize: 10, padding: "2px 8px" }} onClick={addDeductionItem}><IconPlus /> Add Deduction</button>
            </div>
            {sdDeductionItems.length === 0 && <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10, padding: "8px 10px", background: "#f9fafb", borderRadius: 4 }}>No deductions — full deposit will be returned.</div>}
            {sdDeductionItems.map((d, i) => (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 28px", gap: 6, marginBottom: 4, alignItems: "center" }}>
                <select value={d.type} onChange={e => updateDeductionItem(d.id, "type", e.target.value)} style={{ ...inputS, height: 28, fontSize: 11 }}>
                  {DEDUCTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={d.description} onChange={e => updateDeductionItem(d.id, "description", e.target.value)} placeholder="Description" style={{ ...inputS, height: 28, fontSize: 11 }} />
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: 6, overflow: "hidden", height: 28 }}>
                  <span style={{ padding: "0 6px", background: "#f9fafb", color: "#6b7280", fontSize: 11, borderRight: "1px solid #d1d5db", height: "100%", display: "flex", alignItems: "center" }}>$</span>
                  <input type="number" value={d.amount} onChange={e => updateDeductionItem(d.id, "amount", e.target.value)} placeholder="0" style={{ border: "none", padding: "0 6px", fontSize: 11, fontFamily: MONO, width: "100%", outline: "none", height: "100%" }} />
                </div>
                <button onClick={() => removeDeductionItem(d.id)} style={{ ...btnGhost, color: "#dc2626" }} data-tip="Remove"><IconX /></button>
              </div>
            ))}

            {/* Summary */}
            <div style={{ marginTop: 10, padding: "10px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#374151" }}>Deposit Held</span>
                <span style={{ fontFamily: MONO, fontWeight: 600 }}>{fmt2(sdHeld)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#dc2626" }}>Total Deductions</span>
                <span style={{ fontFamily: MONO, fontWeight: 600, color: "#dc2626" }}>-{fmt2(sdTotalDeductions)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, borderTop: "1px solid #e5e7eb", paddingTop: 6 }}>
                <span>Net Refund</span>
                <span style={{ fontFamily: MONO, color: sdReturnAmount > 0 ? "#2d6a3f" : "#1a1714" }}>{fmt2(sdReturnAmount)}</span>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 10 }}>
              <label style={labelS}>Notes (optional)</label>
              <input value={sdNotes} onChange={e => setSdNotes(e.target.value)} placeholder="Additional notes for the disposition statement" style={inputS} />
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button style={btnPrimary} onClick={submitReturnSD}>Return Deposit + Generate Statement</button>
              <button style={btnSecondary} onClick={() => setQuickAdd(null)}>Cancel</button>
            </div>
          </>)}
          {sdTenant && sdHeld === 0 && <div style={{ fontSize: 11, color: "#dc2626", padding: "10px 0" }}>This tenant has no security deposit on file. Record a Security Deposit charge and payment first.</div>}
        </div>
      )}

      {/* Quick Add Credit */}
      {quickAdd === "credit" && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>Add Credit</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div>
              <label style={labelS}>Tenant</label>
              <select value={crTenant} onChange={e => setCrTenant(e.target.value)} style={inputS}>
                <option value="">Select tenant...</option>
                {activeTenantNames.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Amount</label>
              <input type="number" value={crAmount} onChange={e => setCrAmount(e.target.value)} placeholder="0.00" style={inputS} />
            </div>
            <div>
              <label style={labelS}>Reason</label>
              <input value={crReason} onChange={e => setCrReason(e.target.value)} placeholder="e.g. Overpayment, referral credit" style={inputS} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnPrimary} onClick={submitCredit}>Add Credit</button>
            <button style={btnSecondary} onClick={() => setQuickAdd(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 8, flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}><IconSearch /></div>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search all transactions..."
          style={{ width: "100%", padding: "6px 8px 6px 28px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box", height: 32, color: "#1a1714", outline: "none" }} />
      </div>

      {/* Filter row */}
      {(() => {
        const MultiDrop = ({ id, label, options, selected, setSelected }) => {
          const isOpen = openDrop === id;
          const safeStr = (v) => typeof v === "object" && v !== null ? (v.label || v.value || v.cat || v.id || String(v)) : String(v || "");
          const toggle = (val) => { const sv = safeStr(val); setSelected(selected.map(safeStr).includes(sv) ? selected.map(safeStr).filter(v => v !== sv) : [...selected.map(safeStr), sv]); setPage(0); };
          return (
            <div data-multidrop style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); setOpenDrop(isOpen ? null : id); }} style={{ ...selectS, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", background: selected.length ? "#f3f4f6" : "#fff", fontWeight: selected.length ? 600 : 400, color: selected.length ? "#1a1714" : "#6b7280", minWidth: 100, minHeight: 44 }}>
                {label}{selected.length > 0 && <span style={{ background: "#1a1714", color: "#fff", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 3, marginLeft: 2 }}>{selected.length}</span>}
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><path d="M3 5l3 3 3-3"/></svg>
              </button>
              {isOpen && <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 2, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 50, minWidth: 200, maxHeight: 260, overflowY: "auto", padding: "4px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 10px", borderBottom: "1px solid #f3f4f6" }}>
                  <button onClick={e => { e.stopPropagation(); setSelected(options.filter(Boolean).map(o => safeStr(o)).filter(Boolean)); }} style={{ fontSize: 9, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Select All</button>
                  <button onClick={e => { e.stopPropagation(); setSelected([]); }} style={{ fontSize: 9, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
                </div>
                {options.filter(Boolean).map(opt => { const val = safeStr(opt); const lbl = typeof opt === "string" ? opt : (opt?.label || opt?.value || opt?.cat || ""); if (!val) return null; const on = selected.map(safeStr).includes(val); return (
                  <div key={val} onClick={e => { e.stopPropagation(); toggle(val); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", fontSize: 11, color: "#374151", cursor: "pointer", background: on ? "rgba(0,0,0,.03)" : "transparent" }}
                    onMouseEnter={e => { if (!on) e.currentTarget.style.background = "rgba(0,0,0,.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = on ? "rgba(0,0,0,.03)" : "transparent"; }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: on ? "none" : "1.5px solid #d1d5db", background: on ? "#1a1714" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {on && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 8 6.5 11.5 13 5"/></svg>}
                    </div>
                    {lbl}
                  </div>);
                })}
              </div>}
            </div>);
        };
        return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8, alignItems: "center", flexShrink: 0 }}>
          {[["all", "All"], ["charges", "Charges"], ["payments", "Payments"], ["expenses", "Expenses"], ["credits", "Credits"]].map(([v, l]) => (
            <button key={v} onClick={e => { e.stopPropagation(); setTypeFilter(v); setPage(0); }} style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4,
              border: typeFilter === v ? "1px solid #1a1714" : "1px solid #d1d5db",
              background: typeFilter === v ? "#1a1714" : "#fff",
              color: typeFilter === v ? "#fff" : "#6b7280",
              cursor: "pointer", fontFamily: "inherit",
            }}>{l}</button>
          ))}
          <span style={{ width: 1, height: 18, background: "#e5e7eb", margin: "0 3px" }} />
          <MultiDrop id="prop" label="Properties" options={propNames} selected={propFilter} setSelected={s => { setPropFilter(s); setPage(0); }} />
          <MultiDrop id="cat" label="Categories" options={catNames} selected={catFilter} setSelected={s => { setCatFilter(s); setSubcatFilter([]); setPage(0); }} />
          {subcatNames.length > 0 && <MultiDrop id="subcat" label="Subcategories" options={subcatNames} selected={subcatFilter} setSelected={s => { setSubcatFilter(s); setPage(0); }} />}
          <MultiDrop id="status" label="Status" options={[{value:"paid",label:"Paid"},{value:"unpaid",label:"Unpaid"},{value:"pastdue",label:"Past Due"},{value:"partial",label:"Partial"},{value:"waived",label:"Waived"},{value:"deleted",label:"Deleted"}]} selected={statusFilter} setSelected={s => { setStatusFilter(s); setPage(0); }} />
          {(typeFilter === "all" || typeFilter === "expenses") && vendorNames.length > 0 && <MultiDrop id="vendor" label="Vendors" options={vendorNames} selected={vendorFilter} setSelected={s => { setVendorFilter(s); setPage(0); }} />}
          {(typeFilter === "all" || typeFilter === "charges" || typeFilter === "payments") && tenantNames.length > 0 && <MultiDrop id="tenant" label="Tenants" options={tenantNames} selected={tenantFilter} setSelected={s => { setTenantFilter(s); setPage(0); }} />}
          <select value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(0); }} style={selectS}>
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="lastmonth">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="lastquarter">Last Quarter</option>
            <option value="ytd">YTD</option>
            <option value="t12">Trailing 12</option>
            <option value="lastyear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateRange === "custom" && (
            <>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ ...selectS, width: 120 }} />
              <span style={{ fontSize: 10, color: "#6b7280" }}>to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ ...selectS, width: 120 }} />
            </>
          )}
          {hasActiveFilters && <button onClick={() => { setPropFilter([]); setCatFilter([]); setSubcatFilter([]); setStatusFilter([]); setVendorFilter([]); setTenantFilter([]); setDateRange("all"); setCustomFrom(""); setCustomTo(""); setPage(0); }} style={{ fontSize: 10, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Clear all</button>}
          <div style={{ marginLeft: "auto", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button data-export-menu onClick={() => setShowExport(!showExport)}
              onMouseEnter={e => { e.currentTarget.style.background = _ac + "12"; e.currentTarget.style.borderColor = _ac; e.currentTarget.style.color = _ac; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
              style={{ ...btnSecondary, fontWeight: 600 }}>
              <IconExport /> Export
            </button>
            {showExport && <div data-export-menu style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 50, minWidth: 200, padding: "4px 0" }}>
              <div style={{ padding: "6px 12px", fontSize: 10, color: "#6b7280", borderBottom: "1px solid #f3f4f6", lineHeight: 1.4 }}>{checkedIds.length > 0 ? "Exports " + checkedIds.length + " selected transaction" + (checkedIds.length !== 1 ? "s" : "") + "." : "Exports " + filtered.length + " transaction" + (filtered.length !== 1 ? "s" : "") + " matching your current filters."}</div>
              <button onClick={() => { exportCSV(); setShowExport(false); }} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "7px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, color: "#374151", fontFamily: "inherit", textAlign: "left" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                Export CSV
              </button>
              <button onClick={() => { exportPDF(); setShowExport(false); }} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "7px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, color: "#374151", fontFamily: "inherit", textAlign: "left" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print / PDF
              </button>
            </div>}
          </div>
        </div>);
      })()}
      {/* Active filter chips */}
      {hasActiveFilters && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {propFilter.map(p => <span key={"p-"+p} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{p}<button onClick={() => setPropFilter(prev => prev.filter(x => x !== p))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>)}
          {catFilter.map(c => { const lbl = typeof c === "object" ? (c.label || c.cat || c.id || "") : String(c); return <span key={"c-"+lbl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{lbl}<button onClick={() => setCatFilter(prev => prev.filter(x => (typeof x === "object" ? (x.label||x.cat||x.id) : x) !== lbl))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>; })}
          {subcatFilter.map(s => { const lbl = typeof s === "object" ? (s.label || s.cat || "") : String(s); return <span key={"sc-"+lbl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{lbl}<button onClick={() => setSubcatFilter(prev => prev.filter(x => x !== s))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>; })}
          {statusFilter.map(s => { const lbl = typeof s === "object" ? (s.label || s.value || "") : String(s); return <span key={"st-"+lbl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{lbl}<button onClick={() => setStatusFilter(prev => prev.filter(x => x !== s))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>; })}
          {vendorFilter.map(v => <span key={"v-"+v} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{v}<button onClick={() => setVendorFilter(prev => prev.filter(x => x !== v))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>)}
          {tenantFilter.map(t => <span key={"t-"+t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{t}<button onClick={() => setTenantFilter(prev => prev.filter(x => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>)}
          {dateRange !== "all" && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{dateRange === "custom" ? customFrom + " to " + customTo : dateRange}<button onClick={() => { setDateRange("all"); setCustomFrom(""); setCustomTo(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0, lineHeight: 1 }}>x</button></span>}
        </div>
      )}

      {/* Batch toolbar */}
      {checkedIds.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", marginBottom: 6, background: _ac + "12", borderRadius: 6, border: "1px solid " + _ac + "30" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: _ac }}>{checkedIds.length} selected</span>
          <button style={{ ...btnSecondary, height: 24, fontSize: 10, padding: "2px 8px", marginLeft: "auto" }} onClick={() => setChecked({})}>Deselect All</button>
        </div>
      )}

      {/* Month-grouped table */}
      <div>
        {/* Column toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, position: "relative" }}>
          <button data-col-menu onClick={() => setShowColMenu(!showColMenu)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 4, padding: "3px 8px", fontSize: 10, color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", minWidth: 44, minHeight: 44 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Columns
          </button>
          {showColMenu && <div data-col-menu style={{ position: "absolute", top: "100%", right: 0, marginTop: 2, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 50, padding: "6px 0", minWidth: 140 }}>
            {orderedCols.map(col => (
              <label key={col.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", fontSize: 11, color: "#374151", cursor: "pointer" }}>
                <input type="checkbox" checked={!hiddenCols[col.key]} onChange={() => setHiddenCols(p => ({ ...p, [col.key]: !p[col.key] }))} style={{ accentColor: "#1a1714" }} />{col.label}
              </label>
            ))}
          </div>}
        </div>
        {/* Month-grouped rows — scrollable */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {monthGroups.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#6b7280", fontSize: 12 }}>No transactions found</div>}
        {monthGroups.map(group => (
          <div key={group.ym} style={{ ...cardS, marginBottom: 12 }}>
            {group.label && <div style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1714" }}>{group.label}</div>
            </div>}
            <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ ...thS(), width: 36, padding: "6px 8px 6px 12px", cursor: "default" }}>
                  <input type="checkbox" checked={group.rows.length > 0 && group.rows.every(r => checked[r.id])}
                    onChange={e => { const next = { ...checked }; group.rows.forEach(r => next[r.id] = e.target.checked); setChecked(next); }} style={{ accentColor: "#1a1714" }} />
                </th>
                {visibleCols.map(col => (
                  <th key={col.key}
                    draggable
                    onMouseDown={() => handleColMouseDown(col.key)}
                    onMouseUp={() => handleColMouseUp(col.key)}
                    onDragOver={e => handleDragOver(e, col.key)}
                    onDragEnd={handleDragEnd}
                    style={{ ...thS(col.key === "amount" ? "right" : undefined), cursor: dragCol === col.key ? "grabbing" : "pointer", opacity: dragCol === col.key ? 0.5 : 1 }}>
                    {col.label}{sortCol === col.key && <SortArrow dir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((r, i) => {
                const isExpanded = expandedRow === r.id;
                return (
                  <React.Fragment key={r.id}>
                    <tr onClick={() => setExpandedRow(isExpanded ? null : r.id)}
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px solid #f3f4f6",
                        borderLeft: checked[r.id] ? "3px solid #1a1714" : rowBorder(r._type),
                        background: checked[r.id] ? "#eef2ff" : (i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"),
                      }}
                      onMouseEnter={e => { if (!checked[r.id]) e.currentTarget.style.background = "rgba(0,0,0,.03)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = checked[r.id] ? "#eef2ff" : (i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"); }}>
                      <td style={{ padding: "6px 8px 6px 12px" }} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={!!checked[r.id]} onChange={e => setChecked(p => ({ ...p, [r.id]: e.target.checked }))} style={{ accentColor: "#1a1714" }} />
                      </td>
                      {visibleCols.map(col => {
                        if (col.key === "date") return <td key={col.key} style={{ padding: "6px 8px", whiteSpace: "nowrap", color: "#374151", fontSize: 11 }}>{fmtD(r.date)}</td>;
                        if (col.key === "name") return <td key={col.key} style={{ padding: "6px 8px", fontWeight: 600, color: "#1a1714", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name || "--"}</td>;
                        if (col.key === "property") return <td key={col.key} style={{ padding: "6px 8px", color: "#374151", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{r.property || "--"}</td>;
                        if (col.key === "category") return <td key={col.key} style={{ padding: "6px 8px", color: "#374151", fontSize: 11 }}>{r.category}</td>;
                        if (col.key === "subcategory") return <td key={col.key} style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>{r.subcategory || "--"}</td>;
                        if (col.key === "desc") return <td key={col.key} style={{ padding: "6px 8px", color: "#374151", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{r.desc || "--"}</td>;
                        if (col.key === "amount") return <td key={col.key} style={{ padding: "6px 8px", ...monoRight, fontWeight: 600, fontSize: 12, color: r._type === "expense" ? "#374151" : r._type === "credit" ? "#d4a853" : "#2d6a3f" }}>{r._type === "expense" ? "-" : ""}{fmt2(r.amount)}</td>;
                        if (col.key === "status") return <td key={col.key} style={{ padding: "6px 8px" }}><span style={statusText(r.status)}>{r.status === "pastdue" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />}{r.status === "pastdue" ? "Past Due" : r.status}</span></td>;
                        return null;
                      })}
                    </tr>
                    {/* Expanded detail */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={visibleColCount} style={{ padding: "14px 24px 14px 48px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          {r._type === "charge" && (
                            <div>
                              {/* Tenant name + View Profile on same line */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1714" }}>{r._src.tenantName || "--"}</span>
                                {r._src.tenantName && adminGoTab && (
                                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: _ac, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3, padding: 0 }} onClick={e => { e.stopPropagation(); adminGoTab("tenants"); }} data-tip="View tenant profile">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    View Profile
                                  </button>
                                )}
                              </div>
                              {/* Property/Room as clickable link */}
                              <div style={{ fontSize: 11, marginBottom: 8 }}>
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontWeight: 600, fontSize: 11, padding: 0, fontFamily: "inherit", textDecoration: "underline" }} onClick={e => { e.stopPropagation(); if (adminGoTab) adminGoTab("properties"); }} data-tip="View property">{r._src.propName || "--"}{r._src.roomName ? " / " + r._src.roomName : ""}</button>
                              </div>

                              {/* Description */}
                              {r._src.desc && <div style={{ fontSize: 11, color: "#374151", marginBottom: 6 }}><strong style={{ color: "#6b7280" }}>DESCRIPTION:</strong> {r._src.desc}</div>}

                              {/* Sent info */}
                              {r._src.sentDate && <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Sent to your tenant(s) on {fmtD(r._src.sentDate)}</div>}

                                  {/* Payment history */}
                                  <div style={sectionLabel}>Payment History</div>
                                  {(r._src.payments || []).length === 0 ? (
                                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>No payments recorded yet.</div>
                                  ) : (
                                    <div style={{ marginBottom: 8 }}>
                                      {(r._src.payments || []).map((p, pi) => {
                                        const payDone = true;
                                        const transferDone = p.depositStatus === "deposited" || p.depositDate;
                                        const depositDone = p.depositStatus === "deposited";
                                        const isExternal = p.stripe_payment_id || (p.method === "Stripe/ACH") || (p.confId && !p.confId.startsWith("BB-"));
                                        const stepDot = (done) => <div style={{ width: 16, height: 16, borderRadius: 8, background: done ? "#2d6a3f" : "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{done && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 8 6.5 11.5 13 5"/></svg>}</div>;
                                        const stepLine = (done) => <div style={{ width: 2, height: 10, background: done ? "#2d6a3f" : "#d1d5db", marginLeft: 7 }} />;
                                        const isManual = !p.stripe_payment_id && (p.confId ? p.confId.startsWith("BB-") : true);
                                        const receiptPrint = (e) => { e.stopPropagation(); const w = window.open("", "_blank"); w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${p.confId || ""}</title><style>body{font-family:system-ui;max-width:400px;margin:40px auto;font-size:12px}.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee}.total{font-size:16px;font-weight:800;border-top:2px solid #000;padding:8px 0;text-align:right}</style></head><body><h2>Payment Receipt</h2><div class="row"><span>Tenant</span><span>${r._src.tenantName}</span></div><div class="row"><span>Date</span><span>${fmtD(p.date)}</span></div><div class="row"><span>Method</span><span>${p.method}</span></div><div class="row"><span>Confirmation</span><span>${p.confId || "--"}</span></div><div class="total">${fmt2(p.amount)}</div></body></html>`); w.document.close(); w.print(); };
                                        const bal = (r._src.amount || 0) - (r._src.amountPaid || 0);
                                        return isManual ? (
                                        /* ── Manual payment: simple card like TT ── */
                                        <div key={pi} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "12px 16px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                          <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{r._src.tenantName}</div>
                                            <div style={{ fontSize: 10, color: "#6b7280" }}>Paid on {fmtD(p.date)}</div>
                                          </div>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#374151" }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{
                                              p.method === "Zelle" ? <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 9l8 6M16 9l-8 6"/></> :
                                              p.method === "Venmo" ? <path d="M20 4c.6 1 .9 2.1.9 3.3 0 3.7-3.2 8.5-5.8 11.7H8.3L5 4l5.8-.5.9 7.1c1.7-2.8 3.5-6.4 3.5-8.3 0-1.1-.2-1.8-.5-2.4L20 4z"/> :
                                              p.method === "Cash" ? <><rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M1 10h2M21 10h2M1 14h2M21 14h2"/></> :
                                              p.method === "Bank Transfer" ? <><path d="M3 21h18M3 10h18M5 6l7-4 7 4"/><path d="M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></> :
                                              p.method === "CashApp" ? <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M15 10.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5"/></> :
                                              p.method === "Stripe/ACH" ? <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M6 15h2M11 15h4"/></> :
                                              p.method === "Check" ? <><path d="M9 7h6l2 5H7l2-5z"/><rect x="4" y="12" width="16" height="7" rx="1"/><line x1="4" y1="15" x2="20" y2="15"/><path d="M7 18h6"/></> :
                                              <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M15 10.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5"/></>
                                            }</svg>
                                            <span style={{ fontWeight: 600 }}>Paid via {p.method}</span>
                                            <span style={{ color: "#6b7280" }}>-</span>
                                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 11, fontWeight: 600, fontFamily: "inherit", padding: 0, textDecoration: "underline" }} onClick={e => { e.stopPropagation(); setCharges?.(prev => (prev || []).map(c => c.id === r._src.id ? { ...c, amountPaid: Math.max(0, (c.amountPaid || 0) - (p.amount || 0)), payments: (c.payments || []).filter((_, j) => j !== pi) } : c)); }}>DELETE</button>
                                          </div>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ textAlign: "right" }}>
                                              <div style={{ fontWeight: 700, fontSize: 14, fontFamily: MONO, color: "#2d6a3f" }}>{fmt2(p.amount)}</div>
                                              <div style={{ fontSize: 10, color: "#6b7280", fontFamily: MONO }}>Due: {fmt2(Math.max(0, bal))}</div>
                                            </div>
                                            <button style={btnGhost} data-tip="Download receipt" onClick={receiptPrint}>
                                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                                            </button>
                                          </div>
                                        </div>
                                        ) : (
                                        /* ── External payment: timeline tracker ── */
                                        <div key={pi} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "16px 20px", marginBottom: 6 }}>
                                          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", alignItems: "start", gap: 16 }}>
                                            <div>
                                              <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1714", marginBottom: 2 }}>{p.confId ? "PAYMENT #" + p.confId : "Payment #" + (pi + 1)}</div>
                                              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{r._src.tenantName}</div>
                                              <div style={{ fontSize: 10, color: "#6b7280" }}>Paid on {fmtD(p.date)}</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                                STATUS:
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                              </div>
                                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>{stepDot(payDone)}<span style={{ color: "#2d6a3f", fontWeight: 600, textTransform: "uppercase", fontSize: 10 }}>Payment Made</span></div>
                                              {stepLine(transferDone)}
                                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>{stepDot(transferDone)}<span style={{ color: transferDone ? "#2d6a3f" : "#6b7280", fontWeight: transferDone ? 600 : 400, textTransform: "uppercase", fontSize: 10 }}>Transfer Initiated</span></div>
                                              {stepLine(depositDone)}
                                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{stepDot(depositDone)}<span style={{ color: depositDone ? "#2d6a3f" : "#6b7280", fontWeight: depositDone ? 600 : 400, textTransform: "uppercase", fontSize: 10 }}>Deposited{p.depositDate ? " " + fmtD(p.depositDate) : " EST. " + fmtD(p.date)}</span></div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 16 }}>
                                              <div style={{ textAlign: "right" }}>
                                                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: MONO, color: "#2d6a3f" }}>{fmt2(p.amount)}</div>
                                                <div style={{ fontSize: 10, color: "#6b7280", fontFamily: MONO }}>Due: {fmt2(Math.max(0, bal))}</div>
                                              </div>
                                              <button style={btnGhost} data-tip="Download receipt" onClick={receiptPrint}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                                              </button>
                                            </div>
                                          </div>
                                          <div style={{ fontSize: 9, color: "#6b7280", marginTop: 8, fontStyle: "italic" }}>Processed via {p.method} — cannot be edited</div>
                                        </div>);
                                      })}
                                    </div>
                                  )}

                              {/* TT-style action buttons with SVG icons */}
                              <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                                {r.status === "deleted" ? (
                                  <button style={{ ...btnSecondary, gap: 5, color: "#2d6a3f", borderColor: "#86efac" }} onClick={e => { e.stopPropagation(); setCharges?.(prev => (prev || []).map(x => x.id === r._src.id ? { ...x, deleted: false, deletedDate: null } : x)); }} data-tip="Restore this charge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-11.36L1 10"/></svg>
                                    Restore Charge
                                  </button>
                                ) : (<>
                                  {r.status !== "paid" && r.status !== "waived" && (
                                    <button style={{ ...btnSecondary, gap: 5 }} onClick={e => { e.stopPropagation(); setActiveModal({ type: "payment", charge: r._src }); }} data-tip="Record a payment">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                                      Record Payment
                                    </button>
                                  )}
                                  {r.status !== "paid" && r.status !== "waived" && (
                                    <button style={{ ...btnSecondary, gap: 5 }} onClick={e => { e.stopPropagation(); setActiveModal({ type: "reminder", charge: r._src }); }} data-tip="Send payment reminder">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                      Send Reminder
                                    </button>
                                  )}
                                  {(() => { const hasExtPay = (r._src.payments || []).some(p => p.stripe_payment_id || (p.method === "Stripe/ACH" && p.confId && !p.confId.startsWith("BB-"))); return !hasExtPay; })() && (<>
                                    <button style={{ ...btnSecondary, gap: 5 }} onClick={e => { e.stopPropagation(); setActiveModal({ type: "edit", charge: r._src }); }} data-tip="Edit charge">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                      Edit
                                    </button>
                                    <button style={{ ...btnSecondary, gap: 5, color: "#dc2626", borderColor: "#fca5a5" }} onClick={e => { e.stopPropagation(); setActiveModal({ type: "delete", charge: r._src }); }} data-tip="Delete charge">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                      Delete
                                    </button>
                                  </>)}
                                </>)}
                              </div>
                            </div>
                          )}
                          {r._type === "payment" && (
                            <div>
                              {/* Same layout as charge — tenant name + View Profile */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1714" }}>{r.name || "--"}</span>
                                {r.name && adminGoTab && (
                                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: _ac, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3, padding: 0 }} onClick={e => { e.stopPropagation(); adminGoTab("tenants"); }} data-tip="View tenant profile">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    View Profile
                                  </button>
                                )}
                              </div>
                              <div style={{ fontSize: 11, marginBottom: 8 }}>
                                <button style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontWeight: 600, fontSize: 11, padding: 0, fontFamily: "inherit", textDecoration: "underline" }} onClick={e => { e.stopPropagation(); if (adminGoTab) adminGoTab("properties"); }} data-tip="View property">{r.property || "--"}</button>
                              </div>
                              {/* Applied to */}
                              {r._src._charge && <div style={{ fontSize: 11, color: "#374151", marginBottom: 6 }}><strong style={{ color: "#6b7280" }}>APPLIED TO:</strong> {r._src._charge.desc || r._src._charge.category} — {fmt2(r._src._charge.amount)} (due {fmtD(r._src._charge.dueDate)})</div>}
                              {r._src.notes && <div style={{ fontSize: 11, color: "#374151", marginBottom: 6 }}><strong style={{ color: "#6b7280" }}>NOTES:</strong> {r._src.notes}</div>}
                              {/* Payment card with centered timeline — same as charge payment cards */}
                              {(() => {
                                const p = r._src;
                                const payDone = true;
                                const transferDone = p.depositStatus === "deposited" || p.depositDate;
                                const depositDone = p.depositStatus === "deposited";
                                const isExternal = p.stripe_payment_id || (p.method === "Stripe/ACH" && p.confId && !p.confId.startsWith("BB-"));
                                const stepDot = (done) => <div style={{ width: 16, height: 16, borderRadius: 8, background: done ? "#2d6a3f" : "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{done && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 8 6.5 11.5 13 5"/></svg>}</div>;
                                const stepLine = (done) => <div style={{ width: 2, height: 10, background: done ? "#2d6a3f" : "#d1d5db", marginLeft: 7 }} />;
                                return (
                                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "12px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                      <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1714" }}>{p.confId ? "PAYMENT " + p.confId : "Payment"}</div>
                                        <div style={{ fontSize: 10, color: "#6b7280" }}>{r.name} — Paid on {fmtD(p.date)} via {p.method || "--"}</div>
                                      </div>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: MONO, color: "#2d6a3f" }}>{fmt2(p.amount)}</div>
                                        <button style={btnGhost} data-tip="Download receipt" onClick={e => { e.stopPropagation(); const w = window.open("", "_blank"); w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${p.confId || ""}</title><style>body{font-family:system-ui;max-width:400px;margin:40px auto;font-size:12px}.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee}.total{font-size:16px;font-weight:800;border-top:2px solid #000;padding:8px 0;text-align:right}</style></head><body><h2>Payment Receipt</h2><div class="row"><span>Tenant</span><span>${r.name}</span></div><div class="row"><span>Date</span><span>${fmtD(p.date)}</span></div><div class="row"><span>Method</span><span>${p.method}</span></div><div class="row"><span>Confirmation</span><span>${p.confId || "--"}</span></div><div class="total">${fmt2(p.amount)}</div></body></html>`); w.document.close(); w.print(); }}>
                                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                                        </button>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                      <div style={{ fontSize: 10 }}>
                                        <div style={{ fontSize: 8, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>STATUS:</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>{stepDot(payDone)}<span style={{ color: "#2d6a3f", fontWeight: 600, textTransform: "uppercase", fontSize: 10 }}>Payment Made</span></div>
                                        {stepLine(transferDone)}
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>{stepDot(transferDone)}<span style={{ color: transferDone ? "#2d6a3f" : "#6b7280", fontWeight: transferDone ? 600 : 400, textTransform: "uppercase", fontSize: 10 }}>Transfer Initiated</span></div>
                                        {stepLine(depositDone)}
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{stepDot(depositDone)}<span style={{ color: depositDone ? "#2d6a3f" : "#6b7280", fontWeight: depositDone ? 600 : 400, textTransform: "uppercase", fontSize: 10 }}>Deposited{p.depositDate ? " " + fmtD(p.depositDate) : " EST. " + fmtD(p.date)}</span></div>
                                      </div>
                                    </div>
                                    {isExternal && <div style={{ fontSize: 9, color: "#6b7280", textAlign: "center", marginTop: 6, fontStyle: "italic" }}>Processed via {p.method} — cannot be edited</div>}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                          {r._type === "expense" && (
                            <div>
                              {editingId === r._src.id ? (
                                <div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Date</label><input type="date" value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }} /></div>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Amount</label><input type="number" value={editData.amount} onChange={e => setEditData(p => ({ ...p, amount: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }} /></div>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Category</label><select value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value, subcategory: "" }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }}>{SCHED_E_CATS.map(c => <option key={c.label||c.cat} value={c.label||c.cat}>{c.label||c.cat}</option>)}</select></div>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Subcategory</label><select value={editData.subcategory} onChange={e => setEditData(p => ({ ...p, subcategory: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }}><option value="">None</option>{(subcats?.[editData.category] || []).map(sc => { const lbl = typeof sc === "object" ? (sc.label || sc.id || "") : sc; return <option key={lbl} value={lbl}>{lbl}</option>; })}</select></div>
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Vendor</label><input value={editData.vendor} onChange={e => setEditData(p => ({ ...p, vendor: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }} /></div>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Description</label><input value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }} /></div>
                                    <div><label style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>Method</label><input value={editData.paymentMethod} onChange={e => setEditData(p => ({ ...p, paymentMethod: e.target.value }))} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit" }} /></div>
                                  </div>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button style={btnPrimary} onClick={e => { e.stopPropagation(); saveEditExpense(); }}>Save</button>
                                    <button style={btnSecondary} onClick={e => { e.stopPropagation(); cancelEdit(); }}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ display: "flex", gap: 16, fontSize: 11, marginBottom: 6, color: "#374151" }}>
                                    <span><strong>Vendor:</strong> {r._src.vendor || "--"}</span>
                                    <span><strong>Method:</strong> {r._src.paymentMethod || "--"}</span>
                                    <span><strong>Category:</strong> {r._src.category}</span>
                                    {r._src.subcategory && <span><strong>Subcategory:</strong> {r._src.subcategory}</span>}
                                  </div>
                                  {r._src.receiptUrl && (
                                    <div style={{ marginBottom: 6 }}>
                                      <a href={r._src.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#374151", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                                        <IconReceipt /> View Receipt
                                      </a>
                                    </div>
                                  )}
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button style={btnSecondary} onClick={e => { e.stopPropagation(); startEditExpense(r._src); }}>Edit</button>
                                    <button style={btnDanger} onClick={e => { e.stopPropagation(); handleDeleteExpense(r._src); setExpandedRow(null); }}>Delete</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {r._type === "payment" && (
                            <div style={{ fontSize: 11, color: "#6b7280" }}>
                              <div style={{ display: "flex", gap: 16, marginBottom: 4 }}>
                                <span><strong style={{ color: "#374151" }}>Method:</strong> {r._src.method || "--"}</span>
                                <span><strong style={{ color: "#374151" }}>Date:</strong> {fmtD(r._src.date)}</span>
                                {r._src.confId && <span><strong style={{ color: "#374151" }}>Conf:</strong> <span style={{ fontFamily: MONO, fontSize: 10 }}>{r._src.confId}</span></span>}
                                {r._src.depositStatus && <span><strong style={{ color: "#374151" }}>Deposit:</strong> {r._src.depositStatus}</span>}
                              </div>
                              {r._src.notes && <div><strong style={{ color: "#374151" }}>Notes:</strong> {r._src.notes}</div>}
                              {r._src._charge && <div style={{ marginTop: 4 }}><strong style={{ color: "#374151" }}>For charge:</strong> {r._src._charge.desc || r._src._charge.category} — {fmt2(r._src._charge.amount)}</div>}
                            </div>
                          )}
                          {r._type === "credit" && (
                            <div style={{ fontSize: 11, color: "#6b7280" }}>
                              <div style={{ marginBottom: 3 }}><strong style={{ color: "#374151" }}>Reason:</strong> {r._src.reason || r.desc || "--"}</div>
                              <div style={{ marginBottom: 3 }}><strong style={{ color: "#374151" }}>Tenant:</strong> {r._src.tenantName || "--"}</div>
                              <div style={{ marginBottom: 3 }}><strong style={{ color: "#374151" }}>Amount:</strong> <span style={{ fontFamily: MONO, fontWeight: 600, color: "#d4a853" }}>{fmt2(r._src.amount)}</span></div>
                              <div style={{ marginBottom: 8 }}><strong style={{ color: "#374151" }}>Status:</strong> {r._src.applied ? "Applied" : "Available"}</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {!r._src.applied && <button style={{ ...btnSecondary, gap: 5 }} onClick={e => { e.stopPropagation(); setCredits?.(prev => (prev || []).map(x => x.id === r._src.id ? { ...x, applied: true } : x)); }} data-tip="Mark this credit as applied">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                  Mark Applied
                                </button>}
                                {r._src.applied && <button style={{ ...btnSecondary, gap: 5 }} onClick={e => { e.stopPropagation(); setCredits?.(prev => (prev || []).map(x => x.id === r._src.id ? { ...x, applied: false } : x)); }} data-tip="Undo application">Undo Apply</button>}
                                <button style={{ ...btnSecondary, gap: 5, color: "#dc2626", borderColor: "#fca5a5" }} onClick={e => { e.stopPropagation(); setCredits?.(prev => (prev || []).filter(x => x.id !== r._src.id)); setExpandedRow(null); }} data-tip="Delete credit">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
            </div>
          </div>
        ))}
        </div>{/* close scroll container */}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 11, color: "#6b7280", flexShrink: 0 }}>
        <span>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {totalPages > 1 && (
            <>
              <button style={{ ...btnSecondary, height: 24, fontSize: 10, padding: "2px 8px" }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Page {page + 1} of {totalPages}</span>
              <button style={{ ...btnSecondary, height: 24, fontSize: 10, padding: "2px 8px" }} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
            </>
          )}
        </div>
      </div>

      {/* ═══ MANAGE MODALS ═══ */}
      {manageModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setManageModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}>

            {/* Manage Subcategories */}
            {manageModal === "subcats" && (() => {
              const scLabel = (s) => typeof s === "object" ? (s.label || s.id || "") : s;
              const rawList = subcats?.[expCat] || [];
              /* Usage counts for "most used" sort */
              const scUsage = {};
              (expenses || []).filter(e => e.category === expCat && e.subcategory).forEach(e => { scUsage[e.subcategory] = (scUsage[e.subcategory] || 0) + 1; });
              /* Sort the list */
              const sortedSubs = [...rawList];
              if (subcatSort === "az") sortedSubs.sort((a, b) => scLabel(a).localeCompare(scLabel(b)));
              else if (subcatSort === "za") sortedSubs.sort((a, b) => scLabel(b).localeCompare(scLabel(a)));
              else if (subcatSort === "used") sortedSubs.sort((a, b) => (scUsage[scLabel(b)] || 0) - (scUsage[scLabel(a)] || 0));
              /* Drag-and-drop reorder */
              const onDragStart = (i) => { setDragIdx(i); };
              const onDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
              const onDrop = (i) => {
                if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
                const arr = [...rawList];
                const [moved] = arr.splice(dragIdx, 1);
                arr.splice(i, 0, moved);
                setSubcats?.(prev => ({ ...prev, [expCat]: arr }));
                setDragIdx(null); setDragOverIdx(null); setSubcatSort("custom");
              };
              const sortBtnS = (active) => ({ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, border: active ? "1px solid #1a1714" : "1px solid #e5e7eb", background: active ? "#1a1714" : "#fff", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 3 });
              return (
              <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Manage Subcategories</div>
                  <button onClick={() => setManageModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelS}>Category</label>
                  <select value={expCat} onChange={e => { setExpCat(e.target.value); setSubcatSort("custom"); }} style={inputS}>
                    <option value="">Select category...</option>
                    {SCHED_E_CATS.map(c => <option key={c.label||c.cat} value={c.label||c.cat}>{c.label||c.cat}</option>)}
                  </select>
                </div>
                {expCat ? (<>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>Subcategories for <strong>{expCat}</strong></div>
                    {rawList.length > 1 && (
                      <div style={{ display: "flex", gap: 3 }}>
                        <button data-sbtn data-on={subcatSort === "custom" || undefined} style={sortBtnS(subcatSort === "custom")} onClick={() => setSubcatSort("custom")} data-tip="Manual order"><IconGrip /></button>
                        <button data-sbtn data-on={subcatSort === "az" || undefined} style={sortBtnS(subcatSort === "az")} onClick={() => setSubcatSort("az")} data-tip="A to Z"><IconSortAZ /></button>
                        <button data-sbtn data-on={subcatSort === "za" || undefined} style={sortBtnS(subcatSort === "za")} onClick={() => setSubcatSort("za")} data-tip="Z to A"><IconSortZA /></button>
                        <button data-sbtn data-on={subcatSort === "used" || undefined} style={sortBtnS(subcatSort === "used")} onClick={() => setSubcatSort("used")} data-tip="Most used first">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {rawList.length === 0 && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>No subcategories yet. Add one below.</div>}
                  {sortedSubs.map((s, i) => { const lbl = scLabel(s); const usage = scUsage[lbl] || 0; return (
                    <div key={lbl}
                      draggable={subcatSort === "custom"}
                      onDragStart={() => onDragStart(rawList.indexOf(s))}
                      onDragOver={e => onDragOver(e, rawList.indexOf(s))}
                      onDrop={() => onDrop(rawList.indexOf(s))}
                      onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: "1px solid #f3f4f6", borderTop: dragOverIdx === rawList.indexOf(s) ? "2px solid #1a1714" : "none", opacity: dragIdx === rawList.indexOf(s) ? 0.4 : 1, transition: "opacity .15s" }}>
                      {subcatSort === "custom" && <span style={{ cursor: "grab", flexShrink: 0, display: "inline-flex", alignItems: "center" }}><IconGrip /></span>}
                      <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{lbl}</span>
                      {usage > 0 && <span style={{ fontSize: 9, color: "#9ca3af", flexShrink: 0 }}>{usage} expense{usage !== 1 ? "s" : ""}</span>}
                      <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => setSubcats?.(prev => ({ ...prev, [expCat]: (prev?.[expCat] || []).filter(x => (typeof x === "object" ? (x.label||x.id) : x) !== lbl) }))}><IconX /></button>
                    </div>
                  ); })}
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    <input value={newSubcat} onChange={e => setNewSubcat(e.target.value)} placeholder="New subcategory name" style={{ ...inputS, flex: 1 }} onKeyDown={e => { if (e.key === "Enter" && newSubcat.trim()) { setSubcats?.(prev => ({ ...prev, [expCat]: [...(prev?.[expCat] || []), newSubcat.trim()] })); setNewSubcat(""); } }} />
                    <button style={btnPrimary} disabled={!newSubcat.trim()} onClick={() => { if (newSubcat.trim()) { setSubcats?.(prev => ({ ...prev, [expCat]: [...(prev?.[expCat] || []), newSubcat.trim()] })); setNewSubcat(""); } }}><IconPlus /> Add</button>
                  </div>
                </>) : <div style={{ fontSize: 12, color: "#6b7280" }}>Select a category above to manage its subcategories.</div>}
              </div>);
            })()}

            {/* Manage Vendors */}
            {manageModal === "vendors" && (() => {
              const vendorCounts = {};
              const vendorSpend = {};
              (expenses || []).forEach(e => { if (e.vendor) { vendorCounts[e.vendor] = (vendorCounts[e.vendor] || 0) + 1; vendorSpend[e.vendor] = (vendorSpend[e.vendor] || 0) + (e.amount || 0); } });
              const rawVendors = vendors || [];
              const sortedV = [...rawVendors];
              if (vendorSort === "az") sortedV.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
              else if (vendorSort === "za") sortedV.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
              else if (vendorSort === "used") sortedV.sort((a, b) => (vendorCounts[b.name] || 0) - (vendorCounts[a.name] || 0));
              else if (vendorSort === "spend") sortedV.sort((a, b) => (vendorSpend[b.name] || 0) - (vendorSpend[a.name] || 0));
              /* else "custom" — original array order */
              const onVDragStart = (i) => { setDragIdx(i); };
              const onVDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
              const onVDrop = (i) => {
                if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
                const arr = [...rawVendors];
                const [moved] = arr.splice(dragIdx, 1);
                arr.splice(i, 0, moved);
                setVendors(arr);
                setDragIdx(null); setDragOverIdx(null); setVendorSort("custom");
              };
              const sortBtnS = (active) => ({ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, border: active ? "1px solid #1a1714" : "1px solid #e5e7eb", background: active ? "#1a1714" : "#fff", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 3 });
              return (
                <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Manage Vendors</div>
                    <button onClick={() => setManageModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  {rawVendors.length > 1 && (
                    <div style={{ display: "flex", gap: 3, marginBottom: 10, flexWrap: "wrap" }}>
                      <button data-sbtn data-on={vendorSort === "custom" || undefined} style={sortBtnS(vendorSort === "custom")} onClick={() => setVendorSort("custom")} data-tip="Manual order"><IconGrip /> Custom</button>
                      <button data-sbtn data-on={vendorSort === "az" || undefined} style={sortBtnS(vendorSort === "az")} onClick={() => setVendorSort("az")} data-tip="A to Z"><IconSortAZ /> A-Z</button>
                      <button data-sbtn data-on={vendorSort === "za" || undefined} style={sortBtnS(vendorSort === "za")} onClick={() => setVendorSort("za")} data-tip="Z to A"><IconSortZA /> Z-A</button>
                      <button data-sbtn data-on={vendorSort === "used" || undefined} style={sortBtnS(vendorSort === "used")} onClick={() => setVendorSort("used")} data-tip="Most expenses first">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> Most Used
                      </button>
                      <button data-sbtn data-on={vendorSort === "spend" || undefined} style={sortBtnS(vendorSort === "spend")} onClick={() => setVendorSort("spend")} data-tip="Highest spend first">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> Top Spend
                      </button>
                    </div>
                  )}
                  {rawVendors.length === 0 && <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>No vendors yet.</div>}
                  {sortedV.map((v, si) => { const origIdx = rawVendors.indexOf(v); return (
                    <div key={v.id}
                      draggable={vendorSort === "custom" && editVId !== v.id}
                      onDragStart={() => onVDragStart(origIdx)}
                      onDragOver={e => onVDragOver(e, origIdx)}
                      onDrop={() => onVDrop(origIdx)}
                      onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                      style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6", borderTop: dragOverIdx === origIdx ? "2px solid #1a1714" : "none", opacity: dragIdx === origIdx ? 0.4 : 1, transition: "opacity .15s" }}>
                      {editVId === v.id ? (
                        <div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
                            <input value={editVName} onChange={e => setEditVName(e.target.value)} placeholder="Name" style={inputS} />
                            <input value={editVPhone} onChange={e => setEditVPhone(e.target.value)} placeholder="Phone" style={inputS} />
                            <input value={editVEmail} onChange={e => setEditVEmail(e.target.value)} placeholder="Email" style={inputS} />
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button style={{ ...btnPrimary, height: 26, fontSize: 10, padding: "2px 8px" }} onClick={() => { setVendors(prev => (prev || []).map(x => x.id === v.id ? { ...x, name: editVName.trim() || x.name, phone: editVPhone.trim(), email: editVEmail.trim() } : x)); setEditVId(null); }}>Save</button>
                            <button style={{ ...btnSecondary, height: 26, fontSize: 10, padding: "2px 8px" }} onClick={() => setEditVId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {vendorSort === "custom" && <span style={{ cursor: "grab", flexShrink: 0, display: "inline-flex", alignItems: "center" }}><IconGrip /></span>}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{v.name}</span>
                            {v.phone && <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 8 }}><IconPhone /> {v.phone}</span>}
                            {v.email && <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 8 }}><IconMail /> {v.email}</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            {(vendorCounts[v.name] || vendorSpend[v.name]) ? (
                              <span style={{ fontSize: 9, color: "#9ca3af", whiteSpace: "nowrap" }}>
                                {vendorCounts[v.name] || 0} txn{(vendorCounts[v.name] || 0) !== 1 ? "s" : ""}
                                {vendorSpend[v.name] ? <span style={{ marginLeft: 4, fontFamily: MONO }}>${Math.round(vendorSpend[v.name]).toLocaleString()}</span> : null}
                              </span>
                            ) : null}
                            <button style={btnGhost} onClick={() => { setEditVId(v.id); setEditVName(v.name || ""); setEditVPhone(v.phone || ""); setEditVEmail(v.email || ""); }}><IconEdit /></button>
                            <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => setVendors(prev => (prev || []).filter(x => x.id !== v.id))}><IconTrash /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ); })}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ ...sectionLabel, marginBottom: 6 }}>Add New Vendor</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
                      <input value={newVName} onChange={e => setNewVName(e.target.value)} placeholder="Name *" style={inputS} />
                      <input value={newVPhone} onChange={e => setNewVPhone(e.target.value)} placeholder="Phone" style={inputS} />
                      <input value={newVEmail} onChange={e => setNewVEmail(e.target.value)} placeholder="Email" style={inputS} />
                    </div>
                    <button style={btnPrimary} disabled={!newVName.trim()} onClick={() => { setVendors(prev => [...(prev || []), { id: uid ? uid() : "vn-" + Date.now(), name: newVName.trim(), phone: newVPhone.trim(), email: newVEmail.trim() }]); setNewVName(""); setNewVPhone(""); setNewVEmail(""); }}><IconPlus /> Add</button>
                  </div>
                </div>
              );
            })()}

            {/* Manage Payment Methods */}
            {manageModal === "payMethods" && (() => {
              /* state hoisted to component level */
              return (
                <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Manage Payment Methods</div>
                    <button onClick={() => setManageModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  <div style={{ ...sectionLabel, marginBottom: 6 }}>Built-in Methods</div>
                  {PAY_METHODS.map(m => (
                    <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>{m}</span>
                      <span style={{ color: "#9ca3af", display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9 }}><IconLock /> Built-in</span>
                    </div>
                  ))}
                  {customPayMethods.length > 0 && (
                    <>
                      <div style={{ ...sectionLabel, marginTop: 16, marginBottom: 6 }}>Custom Methods</div>
                      {customPayMethods.map(m => (
                        <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ fontSize: 12, color: "#374151" }}>{m}</span>
                          <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => setCustomPayMethods(prev => prev.filter(x => x !== m))}><IconX /></button>
                        </div>
                      ))}
                    </>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                    <input value={newMethod} onChange={e => setNewMethod(e.target.value)} placeholder="Custom method name" style={{ ...inputS, flex: 1 }} onKeyDown={e => { if (e.key === "Enter" && newMethod.trim()) { setCustomPayMethods(prev => [...prev, newMethod.trim()]); setNewMethod(""); } }} />
                    <button style={btnPrimary} disabled={!newMethod.trim()} onClick={() => { if (newMethod.trim()) { setCustomPayMethods(prev => [...prev, newMethod.trim()]); setNewMethod(""); } }}><IconPlus /> Add</button>
                  </div>
                </div>
              );
            })()}

            {/* Manage Properties */}
            {manageModal === "properties" && (() => {
              const rawProps = props || [];
              const propExpCount = {};
              const propIncome = {};
              (expenses || []).forEach(e => { const pn = e.propName || ""; if (pn) propExpCount[pn] = (propExpCount[pn] || 0) + 1; });
              (charges || []).forEach(c => { const pn = c.propName || ""; if (pn) propIncome[pn] = (propIncome[pn] || 0) + (c.amountPaid || 0); });
              const sortedProps = [...rawProps];
              const pName = (p) => p.addr || p.name || "";
              if (propSort === "az") sortedProps.sort((a, b) => pName(a).localeCompare(pName(b)));
              else if (propSort === "za") sortedProps.sort((a, b) => pName(b).localeCompare(pName(a)));
              else if (propSort === "used") sortedProps.sort((a, b) => (propExpCount[pName(b)] || 0) - (propExpCount[pName(a)] || 0));
              else if (propSort === "income") sortedProps.sort((a, b) => (propIncome[pName(b)] || 0) - (propIncome[pName(a)] || 0));
              const onPDragStart = (i) => { setDragIdx(i); };
              const onPDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
              const onPDrop = (i) => {
                if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
                /* Properties are not reorderable in the source array — just switch to custom view */
                setDragIdx(null); setDragOverIdx(null);
              };
              const sortBtnS = (active) => ({ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, border: active ? "1px solid #1a1714" : "1px solid #e5e7eb", background: active ? "#1a1714" : "#fff", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 3 });
              const rooms = (p) => (p.units || []).flatMap(u => u.rooms || []);
              const occupied = (p) => rooms(p).filter(r => r.tenant?.name || r.tenantName).length;
              return (
                <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Manage Properties</div>
                    <button onClick={() => setManageModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  {rawProps.length > 1 && (
                    <div style={{ display: "flex", gap: 3, marginBottom: 10, flexWrap: "wrap" }}>
                      <button data-sbtn data-on={propSort === "custom" || undefined} style={sortBtnS(propSort === "custom")} onClick={() => setPropSort("custom")}>Default</button>
                      <button data-sbtn data-on={propSort === "az" || undefined} style={sortBtnS(propSort === "az")} onClick={() => setPropSort("az")}><IconSortAZ /> A-Z</button>
                      <button data-sbtn data-on={propSort === "za" || undefined} style={sortBtnS(propSort === "za")} onClick={() => setPropSort("za")}><IconSortZA /> Z-A</button>
                      <button data-sbtn data-on={propSort === "used" || undefined} style={sortBtnS(propSort === "used")} onClick={() => setPropSort("used")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> Most Expenses
                      </button>
                      <button data-sbtn data-on={propSort === "income" || undefined} style={sortBtnS(propSort === "income")} onClick={() => setPropSort("income")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> Top Income
                      </button>
                    </div>
                  )}
                  {rawProps.length === 0 && <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>No properties yet.</div>}
                  {sortedProps.map(p => { const name = pName(p); const rc = rooms(p).length; const oc = occupied(p); const expC = propExpCount[name] || 0; const inc = propIncome[name] || 0; return (
                    <div key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{name}</div>
                          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                            {rc} room{rc !== 1 ? "s" : ""} &middot; {oc} occupied
                            {expC > 0 && <span style={{ marginLeft: 6 }}>{expC} expense{expC !== 1 ? "s" : ""}</span>}
                            {inc > 0 && <span style={{ marginLeft: 6, fontFamily: MONO }}>${Math.round(inc).toLocaleString()} collected</span>}
                          </div>
                        </div>
                        <button style={{ ...btnGhost, color: _ac }} onClick={() => { setManageModal(null); if (adminGoTab) adminGoTab("properties"); }} data-tip="Edit in Properties tab"><IconEdit /></button>
                      </div>
                    </div>
                  ); })}
                  <div style={{ marginTop: 16 }}>
                    <button style={btnPrimary} onClick={() => { setManageModal(null); if (adminGoTab) adminGoTab("properties"); }}>
                      <IconPlus /> Add New Property
                    </button>
                    <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 8 }}>Opens Properties tab</span>
                  </div>
                </div>
              );
            })()}

            {/* Manage Categories */}
            {manageModal === "categories" && (() => {
              const catLabel = (c) => typeof c === "object" ? (c.label || c.cat || "") : c;
              const rawCats = SCHED_E_CATS || [];
              const catExpCount = {};
              const catExpSpend = {};
              (expenses || []).forEach(e => { const cat = e.category || ""; if (cat) { catExpCount[cat] = (catExpCount[cat] || 0) + 1; catExpSpend[cat] = (catExpSpend[cat] || 0) + (e.amount || 0); } });
              const sortedCats = [...rawCats];
              if (catSort === "az") sortedCats.sort((a, b) => catLabel(a).localeCompare(catLabel(b)));
              else if (catSort === "za") sortedCats.sort((a, b) => catLabel(b).localeCompare(catLabel(a)));
              else if (catSort === "used") sortedCats.sort((a, b) => (catExpCount[catLabel(b)] || 0) - (catExpCount[catLabel(a)] || 0));
              else if (catSort === "spend") sortedCats.sort((a, b) => (catExpSpend[catLabel(b)] || 0) - (catExpSpend[catLabel(a)] || 0));
              const sortBtnS = (active) => ({ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, border: active ? "1px solid #1a1714" : "1px solid #e5e7eb", background: active ? "#1a1714" : "#fff", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 3 });
              return (
                <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Manage Categories</div>
                    <button onClick={() => setManageModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 10 }}>Schedule E expense categories (IRS lines 5-19)</div>
                  {rawCats.length > 1 && (
                    <div style={{ display: "flex", gap: 3, marginBottom: 10, flexWrap: "wrap" }}>
                      <button data-sbtn data-on={catSort === "custom" || undefined} style={sortBtnS(catSort === "custom")} onClick={() => setCatSort("custom")}>Default</button>
                      <button data-sbtn data-on={catSort === "az" || undefined} style={sortBtnS(catSort === "az")} onClick={() => setCatSort("az")}><IconSortAZ /> A-Z</button>
                      <button data-sbtn data-on={catSort === "za" || undefined} style={sortBtnS(catSort === "za")} onClick={() => setCatSort("za")}><IconSortZA /> Z-A</button>
                      <button data-sbtn data-on={catSort === "used" || undefined} style={sortBtnS(catSort === "used")} onClick={() => setCatSort("used")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> Most Used
                      </button>
                      <button data-sbtn data-on={catSort === "spend" || undefined} style={sortBtnS(catSort === "spend")} onClick={() => setCatSort("spend")}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> Top Spend
                      </button>
                    </div>
                  )}
                  {sortedCats.map(c => { const lbl = catLabel(c); const hint = typeof c === "object" ? (c.hint || "") : ""; const line = typeof c === "object" ? c.line : null; const cnt = catExpCount[lbl] || 0; const spend = catExpSpend[lbl] || 0; const scCount = (subcats?.[lbl] || []).length; return (
                    <div key={lbl} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{lbl}</span>
                            {line && <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: MONO }}>Line {line}</span>}
                          </div>
                          {hint && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{hint}</div>}
                          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                            {cnt > 0 ? <span>{cnt} expense{cnt !== 1 ? "s" : ""}</span> : <span style={{ color: "#d1d5db" }}>No expenses</span>}
                            {spend > 0 && <span style={{ marginLeft: 6, fontFamily: MONO }}>${Math.round(spend).toLocaleString()}</span>}
                            {scCount > 0 && <span style={{ marginLeft: 6 }}>{scCount} subcategor{scCount !== 1 ? "ies" : "y"}</span>}
                          </div>
                        </div>
                        <button style={{ ...btnGhost, color: _ac }} onClick={() => { setManageModal("subcats"); setExpCat(lbl); setSubcatSort("custom"); }} data-tip="Manage subcategories"><IconEdit /></button>
                      </div>
                    </div>
                  ); })}
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setActiveModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 480, width: "100%", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}>

            {/* Edit Charge Modal */}
            {activeModal.type === "edit" && (() => {
              const c = activeModal.charge;
              return (
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Edit Charge</div>
                    <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>This ONLY affects this charge and no future charges.</div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ ...labelS, marginBottom: 6 }}>Category *</label>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {["Rent", "Security Deposit", "Utilities", "Late Fee", "Cleaning Fee", "Other"].map(cat => (
                        <button key={cat} onClick={() => setEditData(p => ({ ...p, category: cat }))} style={{ padding: "5px 14px", borderRadius: 4, border: (editData.category || c.category) === cat ? "1.5px solid #1a1714" : "1.5px solid #d1d5db", background: (editData.category || c.category) === cat ? "#1a1714" : "#fff", color: (editData.category || c.category) === cat ? "#fff" : "#374151", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelS}>Amount *</label>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: 6, overflow: "hidden" }}>
                      <span style={{ padding: "8px 10px", background: "#f9fafb", color: "#6b7280", fontSize: 13, fontWeight: 600, borderRight: "1px solid #d1d5db" }}>$</span>
                      <input type="number" defaultValue={c.amount} onChange={e => setEditData(p => ({ ...p, amount: e.target.value }))} style={{ flex: 1, border: "none", padding: "8px 10px", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelS}>Description (Optional)</label>
                    <input defaultValue={c.desc || ""} onChange={e => setEditData(p => ({ ...p, desc: e.target.value }))} maxLength={50} style={{ ...inputS, height: 36 }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelS}>Due Date *</label>
                    <input type="date" defaultValue={c.dueDate || ""} onChange={e => setEditData(p => ({ ...p, dueDate: e.target.value }))} style={{ ...inputS, height: 36 }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setActiveModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 6, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", color: "#374151" }}>Cancel</button>
                    <button onClick={() => { setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, category: editData.category || x.category, amount: parseFloat(editData.amount) || x.amount, desc: editData.desc !== undefined ? editData.desc : x.desc, dueDate: editData.dueDate || x.dueDate } : x)); setActiveModal(null); setEditData({}); }} style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", background: "#1a1714", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Save</button>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 12 }}>
                    <button onClick={() => { setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, deleted: true, deletedDate: todayStr(TODAY) } : x)); setActiveModal(null); setExpandedRow(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>DELETE CHARGE</button>
                  </div>
                </div>);
            })()}

            {/* Send Reminder Modal */}
            {activeModal.type === "reminder" && (() => {
              const c = activeModal.charge;
              return (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <div style={{ marginBottom: 12 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={_ac} strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/><path d="M16 2l4 4-4 4"/></svg>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Send a Charge Reminder Email</div>
                  {c.sentDate && <div style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", borderRadius: 4, padding: "6px 10px", display: "inline-block", marginBottom: 10 }}>Sent to your tenant(s) on {fmtD(c.sentDate)}</div>}
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>We'll send an email reminding your tenants to pay their charge of <strong style={{ color: "#1a1714" }}>{fmt2(c.amount)}</strong>.</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button onClick={() => setActiveModal(null)} style={{ ...btnSecondary, padding: "10px 24px", fontSize: 13 }}>Cancel</button>
                    <button onClick={() => { setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, sentDate: todayStr(TODAY), sent: true } : x)); setActiveModal(null); }} style={{ ...btnPrimary, padding: "10px 24px", fontSize: 13 }}>Send Reminder Email</button>
                  </div>
                </div>);
            })()}

            {/* Record Payment Modal */}
            {activeModal.type === "payment" && (() => {
              const c = activeModal.charge;
              const remaining = c ? (c.amount || 0) - (c.amountPaid || 0) : 0;
              /* When no specific charge, use editData to track tenant/charge selection */
              const modalTenant = c ? c.tenantName : (editData._modalTenant || "");
              const modalCharges = modalTenant ? (charges || []).filter(ch => ch.tenantName === modalTenant && !ch.voided && !ch.deleted && !ch.waived) : [];
              const modalSelectedCharge = c || (editData._modalChargeId ? modalCharges.find(ch => ch.id === editData._modalChargeId) : null);
              const modalRemaining = modalSelectedCharge ? (modalSelectedCharge.amount || 0) - (modalSelectedCharge.amountPaid || 0) : 0;
              return (
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Record Payment</div>
                    <button onClick={() => { setActiveModal(null); setEditData({}); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>Keep your records accurate by recording external payments.</div>
                  {/* Tenant selector (only when no specific charge) */}
                  {!c && (
                    <div style={{ marginBottom: 12 }}>
                      <label style={labelS}>Which tenant made the payment?</label>
                      <select value={modalTenant} onChange={e => setEditData(p => ({ ...p, _modalTenant: e.target.value, _modalChargeId: "", amount: "" }))} style={inputS}>
                        <option value="">Select tenant...</option>
                        {activeTenantNames.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                  {/* Charge selector (when tenant selected but no specific charge) */}
                  {!c && modalTenant && (
                    <div style={{ marginBottom: 12 }}>
                      <label style={labelS}>Select the charge(s) to record as paid:</label>
                      {modalCharges.filter(ch => (ch.amountPaid || 0) < (ch.amount || 0)).length === 0 && <div style={{ fontSize: 11, color: "#6b7280", padding: "8px 0" }}>No unpaid charges for this tenant.</div>}
                      {modalCharges.filter(ch => (ch.amountPaid || 0) < (ch.amount || 0)).map(ch => {
                        const rem = (ch.amount || 0) - (ch.amountPaid || 0);
                        const isSel = editData._modalChargeId === ch.id;
                        return (
                          <div key={ch.id} onClick={() => setEditData(p => ({ ...p, _modalChargeId: ch.id, amount: String(rem) }))} style={{ background: isSel ? "#f9fafb" : "#fff", border: isSel ? "2px solid #1a1714" : "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px", marginBottom: 6, cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                              <span style={{ fontWeight: 600 }}>DUE ON {fmtD(ch.dueDate)}</span>
                              <span style={{ fontWeight: 600, fontFamily: MONO }}>{fmt2(rem)}</span>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{ch.category}</div>
                            {ch.desc && <div style={{ fontSize: 10, color: "#6b7280" }}>{ch.desc}</div>}
                          </div>
                        );
                      })}
                      <button style={{ ...btnSecondary, fontSize: 10, marginTop: 4 }} onClick={() => setEditData(p => ({ ...p, _modalChargeId: "_credit", amount: "" }))}>
                        <IconPlus /> Account Credit (no charge)
                      </button>
                    </div>
                  )}
                  {/* Show charge info when specific charge provided */}
                  {c && <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{c.tenantName}</div>}
                  {c && <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 12px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                      <span style={{ fontWeight: 600 }}>DUE ON {fmtD(c.dueDate)}</span>
                      <span style={{ fontWeight: 600 }}>BALANCE: {fmt2(remaining)}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{c.category}</div>
                    {c.desc && <div style={{ fontSize: 10, color: "#6b7280" }}>{c.desc}</div>}
                  </div>}
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelS}>How did they pay?</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                      {(() => {
                        const methodIcons = {
                          "Zelle": <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 9l8 6M16 9l-8 6"/></>,
                          "Venmo": <><path d="M20 4c.6 1 .9 2.1.9 3.3 0 3.7-3.2 8.5-5.8 11.7H8.3L5 4l5.8-.5.9 7.1c1.7-2.8 3.5-6.4 3.5-8.3 0-1.1-.2-1.8-.5-2.4L20 4z"/></>,
                          "Cash": <><rect x="1" y="4" width="22" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M1 10h2M21 10h2M1 14h2M21 14h2"/></>,
                          "Bank Transfer": <><path d="M3 21h18M3 10h18M5 6l7-4 7 4"/><path d="M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></>,
                          "CashApp": <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M15 10.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5"/></>,
                          "Stripe/ACH": <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M6 15h2M11 15h4"/></>,
                          "Check": <><path d="M9 7h6l2 5H7l2-5z"/><rect x="4" y="12" width="16" height="7" rx="1"/><line x1="4" y1="15" x2="20" y2="15"/><path d="M7 18h6"/></>,
                          "Other": <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M15 10.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5"/></>,
                        };
                        return PAY_METHODS.map(m => {
                          const sel = editData?.method === m;
                          return (
                          <button key={m} onClick={() => setEditData(p => ({ ...p, method: m }))} style={{ padding: "10px 4px", borderRadius: 6, border: sel ? "2px solid #1a1714" : "1.5px solid #d1d5db", background: sel ? "#f9fafb" : "#fff", cursor: "pointer", textAlign: "center" }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? "#1a1714" : "#6b7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 4px" }}>{methodIcons[m] || methodIcons["Other"]}</svg>
                            <div style={{ fontSize: 9, fontWeight: 600, color: sel ? "#1a1714" : "#6b7280" }}>{m}</div>
                          </button>);
                        });
                      })()}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div><label style={labelS}>Date Paid</label><input type="date" defaultValue={todayStr(TODAY)} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} style={{ ...inputS, height: 36 }} /></div>
                    <div><label style={labelS}>Amount</label>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: 6, overflow: "hidden" }}>
                        <span style={{ padding: "6px 8px", background: "#f9fafb", color: "#6b7280", fontSize: 12, fontWeight: 600, borderRight: "1px solid #d1d5db" }}>$</span>
                        <input type="number" defaultValue={remaining} onChange={e => setEditData(p => ({ ...p, amount: e.target.value }))} style={{ flex: 1, border: "none", padding: "6px 8px", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelS}>Payment Note (Optional)</label>
                    <textarea onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))} rows={2} style={{ ...inputS, height: "auto", resize: "vertical" }} />
                  </div>
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: MONO }}>{fmt2(parseFloat(editData.amount) || remaining)}</span>
                  </div>
                  {(() => {
                    const targetCharge = c || modalSelectedCharge;
                    const targetId = targetCharge?.id;
                    const targetRemaining = c ? remaining : modalRemaining;
                    const isCredit = editData._modalChargeId === "_credit";
                    const canSubmit = editData?.method && (targetId || isCredit);
                    return <button disabled={!canSubmit} onClick={() => {
                      const payData = { id: uid ? uid() : "py-" + Date.now(), amount: parseFloat(editData.amount) || targetRemaining, method: editData?.method, date: editData.date || todayStr(TODAY), depositDate: editData.date || todayStr(TODAY), depositStatus: "deposited", confId: "BB-" + Math.random().toString(36).slice(2, 10).toUpperCase(), notes: editData.notes || "" };
                      if (isCredit) {
                        const room = occupiedRooms.find(r => (r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : "")) === modalTenant);
                        setCredits?.(prev => [...(prev || []), { id: uid ? uid() : "cr-" + Date.now(), roomId: room?.id || "", tenantName: modalTenant, propName: room?.propName || "", amount: parseFloat(editData.amount) || 0, reason: "Account payment — " + editData?.method + (editData.notes ? " — " + editData.notes : ""), date: editData.date || todayStr(TODAY), applied: false }]);
                      } else if (targetId) {
                        recordPayment?.(targetId, payData);
                      }
                      setActiveModal(null); setEditData({});
                    }} style={{ width: "100%", padding: "12px", borderRadius: 6, border: "none", background: canSubmit ? "#1a1714" : "#d1d5db", color: canSubmit ? "#fff" : "#6b7280", cursor: canSubmit ? "pointer" : "default", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>Record Payment</button>;
                  })()}
                </div>);
            })()}

            {/* Delete Charge Modal */}
            {activeModal.type === "delete" && (() => {
              const c = activeModal.charge;
              return (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Delete this Charge?</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>The charge will be removed and not be shown to your tenants.</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button onClick={() => setActiveModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 6, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", color: "#374151" }}>Cancel</button>
                    <button onClick={() => { setCharges?.(prev => (prev || []).map(x => x.id === c.id ? { ...x, deleted: true, deletedDate: todayStr(TODAY) } : x)); setActiveModal(null); setExpandedRow(null); }} style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", background: "#1a1714", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Delete Charge</button>
                  </div>
                </div>);
            })()}

          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   SUB-TAB 2: INCOME
   ==================================================================== */
function IncomeTab({ charges, expenses, props, TODAY, goTab, _ac, globalFilter, adminGoTab, CHARGE_CATS }) {
  const [sortCol, setSortCol] = useState("tenant");
  const [sortDir, setSortDir] = useState("asc");
  const toggleSort = (col) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("asc"); } };

  /* Filters */
  const [propFilter, setPropFilter] = useState([]);
  const [tenantFilter, setTenantFilter] = useState([]);
  const [catFilter, setCatFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [dateRange, setDateRange] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [search, setSearch] = useState("");

  /* Pinned widgets */
  const ALL_WIDGETS = [
    { id: "collected", label: "Collected" },
    { id: "expected", label: "Expected" },
    { id: "collectionRate", label: "Collection Rate" },
    { id: "pastDue", label: "Past Due" },
    { id: "occupancy", label: "Occupancy" },
    { id: "revByProp", label: "Revenue by Property" },
    { id: "monthlyTrend", label: "Monthly Trend" },
    { id: "aging", label: "AR Aging" },
  ];
  const [pinnedWidgets, setPinnedWidgets] = useState(["collected", "expected", "collectionRate", "pastDue"]);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  React.useEffect(() => {
    if (!showWidgetPicker) return;
    const close = (e) => { if (!e.target.closest("[data-widget-picker]")) setShowWidgetPicker(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showWidgetPicker]);
  const toggleWidget = (id) => setPinnedWidgets(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);

  const now = TODAY instanceof Date ? TODAY : new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const ym = monthOf(TODAY);

  const inDateRange = useCallback((dateStr) => {
    if (!dateStr || dateRange === "all") return true;
    const prefix = y + "-" + String(m).padStart(2, "0");
    if (dateRange === "month") return dateStr.startsWith(prefix);
    if (dateRange === "lastmonth") { const lm = m === 1 ? 12 : m - 1; const ly = m === 1 ? y - 1 : y; return dateStr.startsWith(ly + "-" + String(lm).padStart(2, "0")); }
    if (dateRange === "quarter") { const qStart = Math.floor((m - 1) / 3) * 3 + 1; return dateStr >= y + "-" + String(qStart).padStart(2, "0") + "-01"; }
    if (dateRange === "ytd") return dateStr >= y + "-01-01";
    if (dateRange === "t12") { const d = new Date(now); d.setMonth(d.getMonth() - 12); return dateStr >= d.toISOString().split("T")[0]; }
    if (dateRange === "lastyear") return dateStr >= (y - 1) + "-01-01" && dateStr < y + "-01-01";
    if (dateRange === "custom") { if (customFrom && dateStr < customFrom) return false; if (customTo && dateStr > customTo) return false; return true; }
    return true;
  }, [dateRange, customFrom, customTo, y, m, now]);

  /* Property & tenant name lists */
  const propNames = useMemo(() => [...new Set((props || []).map(p => p.addr || p.name).filter(Boolean))].sort(), [props]);
  const allTenantNames = useMemo(() => {
    const names = new Set();
    (props || []).forEach(p => allRooms(p).forEach(r => { const n = r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : ""); if (n) names.add(n); }));
    return [...names].sort();
  }, [props]);
  const catNames = useMemo(() => [...new Set((charges || []).map(c => typeof c.category === "object" ? (c.category.label || c.category.cat || "") : (c.category || "")).filter(Boolean))].sort(), [charges]);

  const data = useMemo(() => {
    let filteredCharges = (charges || []).filter(c => !c.voided && !c.deleted && !c.waived);
    if (propFilter.length) filteredCharges = filteredCharges.filter(c => propFilter.includes(c.propName));
    if (tenantFilter.length) filteredCharges = filteredCharges.filter(c => tenantFilter.includes(c.tenantName));
    if (catFilter.length) filteredCharges = filteredCharges.filter(c => catFilter.includes(c.category));
    if (statusFilter.length) filteredCharges = filteredCharges.filter(c => statusFilter.includes(chargeStatus(c, TODAY)));
    const periodCharges = filteredCharges.filter(c => inDateRange(c.dueDate));

    const totalCollected = periodCharges.reduce((s, c) => s + (c.amountPaid || 0), 0);
    const totalExpected = periodCharges.reduce((s, c) => s + (c.amount || 0), 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
    const pastDueTotal = filteredCharges.filter(c => chargeStatus(c, TODAY) === "pastdue" || chargeStatus(c, TODAY) === "partial").reduce((s, c) => s + ((c.amount || 0) - (c.amountPaid || 0)), 0);

    /* Occupancy */
    const totalRooms = (props || []).reduce((s, p) => s + allRooms(p).filter(r => !r.ownerOccupied).length, 0);
    const occupiedRooms = (props || []).reduce((s, p) => s + allRooms(p).filter(r => !r.ownerOccupied && (r.tenant?.name || r.tenantName)).length, 0);
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    /* Revenue by property */
    const revByProp = {};
    periodCharges.forEach(c => { revByProp[c.propName || "Unknown"] = (revByProp[c.propName || "Unknown"] || 0) + (c.amountPaid || 0); });
    const revByPropArr = Object.entries(revByProp).sort((a, b) => b[1] - a[1]);
    const revMax = revByPropArr.length ? revByPropArr[0][1] : 1;

    /* Monthly trend (last 6 months) */
    const months = [];
    for (let i = 5; i >= 0; i--) { const d = new Date(now); d.setMonth(d.getMonth() - i); months.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0")); }
    const monthlyTrend = months.map(mo => {
      const moCharges = filteredCharges.filter(c => ymStr(c.dueDate) === mo);
      return { month: mo, label: new Date(mo + "-01T00:00:00").toLocaleString("default", { month: "short" }), collected: moCharges.reduce((s, c) => s + (c.amountPaid || 0), 0), expected: moCharges.reduce((s, c) => s + (c.amount || 0), 0) };
    });
    const trendMax = Math.max(...monthlyTrend.map(t => t.expected), 1);

    /* Rent roll */
    const tenantMap = {};
    (props || []).forEach(p => { allRooms(p).forEach(r => { const tName = r.tenant?.name || r.tenantName || (typeof r.tenant === "string" ? r.tenant : ""); if (!tName) return; if (!tenantMap[tName]) tenantMap[tName] = { tenant: tName, property: r.propName, room: r.unitName ? r.unitName + " / " + (r.name || "") : (r.name || ""), rent: r.rent || 0, leaseEnd: r.leaseEnd || r.tenant?.leaseEnd || "", mtdPaid: 0, totalBalance: 0, status: "current" }; }); });
    periodCharges.forEach(c => { const t = tenantMap[c.tenantName]; if (!t) return; if (c.category === "Rent") { t.mtdPaid += (c.amountPaid || 0); t.status = chargeStatus(c, TODAY); } });
    filteredCharges.forEach(c => { const t = tenantMap[c.tenantName]; if (!t) return; if ((c.amountPaid || 0) < (c.amount || 0)) t.totalBalance += ((c.amount || 0) - (c.amountPaid || 0)); });
    let rentRoll = Object.values(tenantMap);
    if (propFilter.length) rentRoll = rentRoll.filter(t => propFilter.includes(t.property));
    if (tenantFilter.length) rentRoll = rentRoll.filter(t => tenantFilter.includes(t.tenant));
    if (search.trim()) { const q = search.toLowerCase(); rentRoll = rentRoll.filter(t => t.tenant.toLowerCase().includes(q) || t.property.toLowerCase().includes(q)); }

    /* Aging */
    const unpaid = filteredCharges.filter(c => (c.amountPaid || 0) < (c.amount || 0));
    const buckets = { current: [], d30: [], d60: [], d90: [] };
    unpaid.forEach(c => { const due = new Date(c.dueDate + "T00:00:00"); const days = Math.floor((now - due) / 86400000); const bal = (c.amount || 0) - (c.amountPaid || 0); const entry = { tenant: c.tenantName, amount: bal, days, property: c.propName }; if (days < 0 || days <= 30) buckets.current.push(entry); else if (days <= 60) buckets.d30.push(entry); else if (days <= 90) buckets.d60.push(entry); else buckets.d90.push(entry); });

    return { totalCollected, totalExpected, collectionRate, pastDueTotal, occupancyRate, occupiedRooms, totalRooms, revByPropArr, revMax, monthlyTrend, trendMax, rentRoll, buckets };
  }, [charges, props, TODAY, ym, propFilter, tenantFilter, catFilter, statusFilter, inDateRange, search]);

  const sorted = useMemo(() => {
    const rows = [...data.rentRoll];
    rows.sort((a, b) => { let va = a[sortCol], vb = b[sortCol]; if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va; va = String(va || ""); vb = String(vb || ""); return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va); });
    return rows;
  }, [data.rentRoll, sortCol, sortDir]);

  const bucketTotal = (bucket) => bucket.reduce((s, e) => s + e.amount, 0);
  const hasFilters = propFilter.length || tenantFilter.length || catFilter.length || statusFilter.length || dateRange !== "month" || search;

  /* Widget render */
  const renderWidget = (id) => {
    if (id === "collected") return <div style={kpiS("#2d6a3f")}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>Collected</div><div style={{ fontSize: 24, fontWeight: 600, color: "#1a1714", fontFamily: MONO }}>{fmt2(data.totalCollected)}</div>{data.totalExpected > 0 && <div style={{ width: "100%", height: 4, background: "#e5e7eb", borderRadius: 2, marginTop: 4 }}><div style={{ width: Math.min(100, data.collectionRate) + "%", height: 4, background: "#2d6a3f", borderRadius: 2 }} /></div>}</div>;
    if (id === "expected") return <div style={kpiS("#64748b")}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>Expected</div><div style={{ fontSize: 24, fontWeight: 600, color: "#1a1714", fontFamily: MONO }}>{fmt2(data.totalExpected)}</div></div>;
    if (id === "collectionRate") return <div style={kpiS(data.collectionRate >= 90 ? "#2d6a3f" : data.collectionRate >= 70 ? "#d4a853" : "#dc2626")}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>Collection Rate</div><div style={{ fontSize: 24, fontWeight: 600, color: "#1a1714", fontFamily: MONO }}>{data.collectionRate}%</div></div>;
    if (id === "pastDue") return <div style={kpiS(data.pastDueTotal > 0 ? "#dc2626" : "#2d6a3f")}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>Past Due</div><div style={{ fontSize: 24, fontWeight: 600, color: data.pastDueTotal > 0 ? "#dc2626" : "#1a1714", fontFamily: MONO }}>{fmt2(data.pastDueTotal)}</div></div>;
    if (id === "occupancy") return <div style={kpiS(_ac)}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>Occupancy</div><div style={{ fontSize: 24, fontWeight: 600, color: "#1a1714", fontFamily: MONO }}>{data.occupancyRate}%</div><div style={{ fontSize: 10, color: "#6b7280" }}>{data.occupiedRooms}/{data.totalRooms} rooms</div></div>;
    if (id === "revByProp") return <div style={{ ...kpiS("#64748b"), minWidth: 200 }}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>Revenue by Property</div>{data.revByPropArr.slice(0, 5).map(([name, amt]) => <div key={name} style={{ marginBottom: 3 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 1 }}><span style={{ color: "#374151" }}>{name}</span><span style={{ fontFamily: MONO, fontWeight: 600 }}>{fmt(amt)}</span></div><div style={{ width: "100%", height: 3, background: "#e5e7eb", borderRadius: 2 }}><div style={{ width: Math.max(2, (amt / data.revMax) * 100) + "%", height: 3, background: _ac, borderRadius: 2 }} /></div></div>)}</div>;
    if (id === "monthlyTrend") return <div style={{ ...kpiS("#64748b"), minWidth: 200 }}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>Monthly Trend</div><div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>{data.monthlyTrend.map(t => <div key={t.month} style={{ flex: 1, textAlign: "center" }}><div style={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "flex-end", height: 40 }}><div style={{ width: 8, height: Math.max(2, (t.collected / data.trendMax) * 38), background: "#2d6a3f", borderRadius: "2px 2px 0 0" }} /><div style={{ width: 8, height: Math.max(2, (t.expected / data.trendMax) * 38), background: "#e5e7eb", borderRadius: "2px 2px 0 0" }} /></div><div style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>{t.label}</div></div>)}</div></div>;
    if (id === "aging") return <div style={{ ...kpiS("#d4a853"), minWidth: 200 }}><div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>AR Aging</div>{[["Current", data.buckets.current, "#2d6a3f"], ["30d", data.buckets.d30, "#d4a853"], ["60d", data.buckets.d60, "#dc2626"], ["90+", data.buckets.d90, "#991b1b"]].map(([label, items, color]) => <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0" }}><span style={{ color }}>{label}</span><span style={{ fontFamily: MONO, fontWeight: 600 }}>{fmt2(bucketTotal(items))}</span></div>)}</div>;
    return null;
  };

  return (
    <div>
      {/* Pinned widgets + picker */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {pinnedWidgets.map(id => <div key={id} style={{ position: "relative" }}>{renderWidget(id)}<button onClick={() => toggleWidget(id)} style={{ position: "absolute", top: 4, right: 4, background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 10, lineHeight: 1, padding: 0 }} data-tip="Unpin widget"><IconX /></button></div>)}
        </div>
        <div style={{ position: "relative" }}>
          <button data-widget-picker onClick={() => setShowWidgetPicker(!showWidgetPicker)} style={{ ...btnSecondary, fontSize: 10, whiteSpace: "nowrap" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Widgets
          </button>
          {showWidgetPicker && <div data-widget-picker style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 50, padding: "6px 0", minWidth: 180 }}>
            {ALL_WIDGETS.map(w => <div key={w.id} onClick={() => toggleWidget(w.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", fontSize: 11, color: "#374151", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: pinnedWidgets.includes(w.id) ? "none" : "1.5px solid #d1d5db", background: pinnedWidgets.includes(w.id) ? "#1a1714" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{pinnedWidgets.includes(w.id) && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 8 6.5 11.5 13 5"/></svg>}</div>
              {w.label}
            </div>)}
          </div>}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 200px" }}>
          <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}><IconSearch /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." style={{ width: "100%", padding: "5px 8px 5px 26px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 11, fontFamily: "inherit", height: 28, color: "#1a1714", outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value="" onChange={e => { if (e.target.value && !propFilter.includes(e.target.value)) setPropFilter(p => [...p, e.target.value]); }} style={selectS}><option value="">Properties</option>{propNames.map(p => <option key={p} value={p}>{p}</option>)}</select>
        <select value="" onChange={e => { if (e.target.value && !tenantFilter.includes(e.target.value)) setTenantFilter(p => [...p, e.target.value]); }} style={selectS}><option value="">Tenants</option>{allTenantNames.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <select value="" onChange={e => { if (e.target.value && !catFilter.includes(e.target.value)) setCatFilter(p => [...p, e.target.value]); }} style={selectS}><option value="">Categories</option>{catNames.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <select value="" onChange={e => { if (e.target.value && !statusFilter.includes(e.target.value)) setStatusFilter(p => [...p, e.target.value]); }} style={selectS}><option value="">Status</option>{["paid","unpaid","pastdue","partial","waived"].map(s => <option key={s} value={s}>{s === "pastdue" ? "Past Due" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={selectS}>
          <option value="month">This Month</option><option value="lastmonth">Last Month</option><option value="quarter">This Quarter</option><option value="ytd">YTD</option><option value="t12">Trailing 12</option><option value="lastyear">Last Year</option><option value="all">All Time</option><option value="custom">Custom</option>
        </select>
        {dateRange === "custom" && <><input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ ...selectS, width: 110 }} /><span style={{ fontSize: 10, color: "#6b7280" }}>to</span><input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ ...selectS, width: 110 }} /></>}
        {hasFilters && <button onClick={() => { setPropFilter([]); setTenantFilter([]); setCatFilter([]); setStatusFilter([]); setDateRange("month"); setSearch(""); }} style={{ fontSize: 10, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Clear</button>}
      </div>
      {/* Filter chips */}
      {(propFilter.length > 0 || tenantFilter.length > 0 || catFilter.length > 0 || statusFilter.length > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {propFilter.map(p => <span key={"p-"+p} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{p}<button onClick={() => setPropFilter(prev => prev.filter(x => x !== p))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0 }}>x</button></span>)}
          {tenantFilter.map(t => <span key={"t-"+t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{t}<button onClick={() => setTenantFilter(prev => prev.filter(x => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0 }}>x</button></span>)}
          {catFilter.map(c => { const lbl = typeof c === "object" ? (c.label || c.cat || c.id || "") : String(c); return <span key={"c-"+lbl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{lbl}<button onClick={() => setCatFilter(prev => prev.filter(x => (typeof x === "object" ? (x.label||x.cat||x.id) : x) !== lbl))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0 }}>x</button></span>; })}
          {statusFilter.map(s => { const lbl = typeof s === "object" ? (s.label || s.value || "") : String(s); return <span key={"s-"+lbl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#374151", display: "inline-flex", alignItems: "center", gap: 3 }}>{lbl}<button onClick={() => setStatusFilter(prev => prev.filter(x => x !== s))} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 10, padding: 0 }}>x</button></span>; })}
        </div>
      )}

      {/* Rent Roll */}
      <div style={{ ...cardS, marginBottom: 16 }}>
        <div style={{ padding: "10px 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={sectionLabel}>Rent Roll</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>{sorted.length} tenant{sorted.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={thS()} onClick={() => toggleSort("tenant")}>Tenant{sortCol === "tenant" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("property")}>Property / Room{sortCol === "property" && <SortArrow dir={sortDir} />}</th>
                <th style={thS("right")} onClick={() => toggleSort("rent")}>Monthly Rent{sortCol === "rent" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("leaseEnd")}>Lease End{sortCol === "leaseEnd" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("status")}>Status{sortCol === "status" && <SortArrow dir={sortDir} />}</th>
                <th style={thS("right")} onClick={() => toggleSort("mtdPaid")}>Paid{sortCol === "mtdPaid" && <SortArrow dir={sortDir} />}</th>
                <th style={thS("right")} onClick={() => toggleSort("totalBalance")}>Balance{sortCol === "totalBalance" && <SortArrow dir={sortDir} />}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#6b7280", fontSize: 12 }}>No tenants match filters</td></tr>}
              {sorted.map((t, i) => (
                <tr key={t.tenant + i} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)" }}
                  onClick={() => goTab("all", { name: t.tenant })}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"}>
                  <td style={{ padding: "6px 8px", fontWeight: 600, color: "#1a1714" }}>{t.tenant}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>{t.property} {t.room ? "/ " + t.room : ""}</td>
                  <td style={{ padding: "6px 8px", ...monoRight, fontWeight: 600 }}>{fmt2(t.rent)}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>{fmtD(t.leaseEnd)}</td>
                  <td style={{ padding: "6px 8px" }}><span style={statusText(t.status)}>{t.status === "pastdue" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />}{t.status === "pastdue" ? "Past Due" : t.status}</span></td>
                  <td style={{ padding: "6px 8px", ...monoRight, fontWeight: 600, color: "#2d6a3f" }}>{fmt2(t.mtdPaid)}</td>
                  <td style={{ padding: "6px 8px", ...monoRight, fontWeight: 600, color: t.totalBalance > 0 ? "#dc2626" : "#2d6a3f" }}>{fmt2(t.totalBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aging buckets (always visible) */}
      <div style={sectionLabel}>Aging Buckets</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", WebkitOverflowScrolling: "touch", flexWrap: "nowrap" }}>
        {[
          { label: "Current", items: data.buckets.current, accent: "#2d6a3f" },
          { label: "31-60 Days", items: data.buckets.d30, accent: "#d4a853" },
          { label: "61-90 Days", items: data.buckets.d60, accent: "#dc2626" },
          { label: "90+ Days", items: data.buckets.d90, accent: "#991b1b" },
        ].map((b, i) => (
          <div key={i} style={kpiS(b.accent)}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>{b.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#1a1714", fontFamily: MONO, marginBottom: 4 }}>{fmt2(bucketTotal(b.items))}</div>
            {b.items.length === 0 && <div style={{ fontSize: 10, color: "#6b7280" }}>None</div>}
            {b.items.slice(0, 5).map((e, j) => <div key={j} style={{ fontSize: 10, color: "#6b7280", display: "flex", justifyContent: "space-between", padding: "1px 0" }}><span>{e.tenant}</span><span style={{ fontWeight: 600, fontFamily: MONO }}>{fmt2(e.amount)}</span></div>)}
            {b.items.length > 5 && <div style={{ fontSize: 10, color: "#6b7280" }}>+{b.items.length - 5} more</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================
   SUB-TAB 3: EXPENSES
   ==================================================================== */
function ExpensesTab({ expenses, props, vendors, settings, subcats, TODAY, setExpenses, uid, SCHED_E_CATS, goTab, globalFilter, _ac }) {
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [catFilterLocal, setCatFilterLocal] = useState(globalFilter.category || "");
  const [showAddForm, setShowAddForm] = useState(false);
  const toggleSort = (col) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("desc"); } };

  /* Add expense form state */
  const [fDate, setFDate] = useState(todayStr(TODAY));
  const [fAmount, setFAmount] = useState("");
  const [fProp, setFProp] = useState("");
  const [fCat, setFCat] = useState("");
  const [fSubcat, setFSubcat] = useState("");
  const [fVendor, setFVendor] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fMethod, setFMethod] = useState("Zelle");

  const ym = monthOf(TODAY);

  const data = useMemo(() => {
    const mtdExpenses = (expenses || []).filter(e => ymStr(e.date) === ym);
    const mtdTotal = mtdExpenses.reduce((s, e) => s + (e.amount || 0), 0);

    /* Top category */
    const catTotals = {};
    mtdExpenses.forEach(e => { catTotals[e.category || "Other"] = (catTotals[e.category || "Other"] || 0) + (e.amount || 0); });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    /* Avg monthly (last 12) */
    const allTotal = (expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
    const months = new Set((expenses || []).map(e => ymStr(e.date)).filter(Boolean));
    const avgMonthly = months.size > 0 ? allTotal / months.size : 0;

    /* YoY */
    const now = TODAY instanceof Date ? TODAY : new Date();
    const thisYear = now.getFullYear();
    const ytdExp = (expenses || []).filter(e => e.date && e.date >= thisYear + "-01-01").reduce((s, e) => s + (e.amount || 0), 0);
    const lytdExp = (expenses || []).filter(e => e.date && e.date >= (thisYear - 1) + "-01-01" && e.date < (thisYear - 1) + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0")).reduce((s, e) => s + (e.amount || 0), 0);
    const yoy = lytdExp > 0 ? Math.round(((ytdExp - lytdExp) / lytdExp) * 100) : 0;

    /* Category breakdown for chart */
    const allCatTotals = {};
    (expenses || []).forEach(e => { allCatTotals[e.category || "Other"] = (allCatTotals[e.category || "Other"] || 0) + (e.amount || 0); });
    const catBreakdown = Object.entries(allCatTotals).sort((a, b) => b[1] - a[1]);
    const catMax = catBreakdown.length > 0 ? catBreakdown[0][1] : 1;

    return { mtdTotal, topCat: topCat ? topCat[0] : "--", avgMonthly, yoy, catBreakdown, catMax };
  }, [expenses, TODAY, ym]);

  const filtered = useMemo(() => {
    let rows = [...(expenses || [])];
    if (catFilterLocal) rows = rows.filter(e => e.category === catFilterLocal);
    rows.sort((a, b) => {
      let va = a[sortCol === "vendor" ? "vendor" : sortCol], vb = b[sortCol === "vendor" ? "vendor" : sortCol];
      if (sortCol === "amount") { va = Number(va || 0); vb = Number(vb || 0); }
      else { va = String(va || ""); vb = String(vb || ""); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [expenses, catFilterLocal, sortCol, sortDir]);

  const submitExpense = () => {
    if (!fAmount || !fCat) return;
    const propObj = (props || []).find(p => p.id === fProp);
    setExpenses?.(prev => [...(prev || []), { id: uid ? uid() : "ex-" + Date.now(), date: fDate, amount: parseFloat(fAmount), propId: fProp, propName: propObj ? (propObj.addr || propObj.name) : (fProp === "shared" ? "Shared" : ""), category: fCat, subcategory: fSubcat, vendor: fVendor, description: fDesc, paymentMethod: fMethod }]);
    setShowAddForm(false); setFAmount(""); setFDesc(""); setFSubcat("");
  };

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", WebkitOverflowScrolling: "touch", flexWrap: "nowrap" }}>
        {[
          { label: "Expenses (MTD)", value: fmt2(data.mtdTotal), accent: "#64748b" },
          { label: "Top Category", value: data.topCat, accent: "#6b7280", isText: true },
          { label: "Avg Monthly", value: fmt2(data.avgMonthly), accent: "#64748b" },
          { label: "YoY Change", value: (data.yoy >= 0 ? "+" : "") + data.yoy + "%", accent: data.yoy > 0 ? "#dc2626" : "#2d6a3f" },
        ].map((kpi, i) => (
          <div key={i} style={kpiS(kpi.accent)}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>{kpi.label}</div>
            <div style={{ fontSize: kpi.isText ? 16 : 24, fontWeight: 600, color: "#1a1714", fontFamily: kpi.isText ? "inherit" : MONO, fontVariantNumeric: "tabular-nums" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Add Expense button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        {catFilterLocal && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Filtered:</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }} onClick={() => setCatFilterLocal("")}>
              {typeof catFilterLocal === "object" ? (catFilterLocal.label || catFilterLocal.cat || "") : catFilterLocal} <IconX />
            </span>
          </div>
        )}
        <div style={{ marginLeft: "auto" }}>
          <button style={btnPrimary} onClick={() => setShowAddForm(!showAddForm)}>
            <IconPlus /> Add Expense
          </button>
        </div>
      </div>

      {/* Add expense form */}
      {showAddForm && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>New Expense</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div><label style={labelS}>Date</label><input type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={inputS} /></div>
            <div><label style={labelS}>Amount</label><input type="number" value={fAmount} onChange={e => setFAmount(e.target.value)} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Property</label><select value={fProp} onChange={e => setFProp(e.target.value)} style={inputS}><option value="">Select...</option><option value="shared">Shared</option>{(props || []).map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}</select></div>
            <div><label style={labelS}>Category</label><select value={fCat} onChange={e => setFCat(e.target.value)} style={inputS}><option value="">Select...</option>{SCHED_E_CATS.map(c => <option key={c.label||c.cat} value={c.label||c.cat}>{c.label||c.cat}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div><label style={labelS}>Subcategory</label><select value={fSubcat} onChange={e => setFSubcat(e.target.value)} style={inputS}><option value="">None</option>{(subcats?.[fCat] || []).map(sc => { const lbl = typeof sc === "object" ? (sc.label || sc.id || "") : sc; return <option key={lbl} value={lbl}>{lbl}</option>; })}</select></div>
            <div><label style={labelS}>Vendor</label><select value={fVendor} onChange={e => setFVendor(e.target.value)} style={inputS}><option value="">Select...</option>{(vendors || []).map(v => <option key={v.id} value={v.name}>{v.name}</option>)}</select></div>
            <div><label style={labelS}>Description</label><input value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="What was this for?" style={inputS} /></div>
            <div><label style={labelS}>Pay Method</label><select value={fMethod} onChange={e => setFMethod(e.target.value)} style={inputS}>{PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnPrimary} onClick={submitExpense}>Save Expense</button>
            <button style={btnSecondary} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Expense table */}
      <div style={{ ...cardS, marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={thS()} onClick={() => toggleSort("date")}>Date{sortCol === "date" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("vendor")}>Vendor{sortCol === "vendor" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("propName")}>Property{sortCol === "propName" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()} onClick={() => toggleSort("category")}>Category{sortCol === "category" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()}>Sub</th>
                <th style={thS()} onClick={() => toggleSort("description")}>Description{sortCol === "description" && <SortArrow dir={sortDir} />}</th>
                <th style={thS("right")} onClick={() => toggleSort("amount")}>Amount{sortCol === "amount" && <SortArrow dir={sortDir} />}</th>
                <th style={thS()}>Method</th>
                <th style={{ ...thS(), width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 20, color: "#6b7280", fontSize: 12 }}>No expenses found</td></tr>
              )}
              {filtered.map((e, i) => (
                <tr key={e.id}
                  style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "rgba(0,0,0,.03)"}
                  onMouseLeave={ev => ev.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"}>
                  <td style={{ padding: "6px 8px", whiteSpace: "nowrap", color: "#6b7280", fontSize: 11 }}>{fmtD(e.date)}</td>
                  <td style={{ padding: "6px 8px", fontWeight: 600, color: "#374151", cursor: "pointer", fontSize: 12 }}
                    onClick={() => goTab("vendors", { vendor: e.vendor })}>{e.vendor || "--"}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>{e.propName || "--"}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", cursor: "pointer", fontSize: 11 }}
                    onClick={() => setCatFilterLocal(e.category)}>{e.category || "--"}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 10 }}>{e.subcategory || "--"}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{e.description || "--"}</td>
                  <td style={{ padding: "6px 8px", ...monoRight, fontWeight: 600, color: "#374151", fontSize: 12 }}>-{fmt2(e.amount)}</td>
                  <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 10 }}>{e.paymentMethod || "--"}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", whiteSpace: "nowrap" }}>
                    {e.receiptUrl && (
                      <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" data-tip="View receipt" style={{ marginRight: 4 }}><IconReceipt /></a>
                    )}
                    <button style={btnGhost} onClick={() => { /* inline edit - go to All Activity */ goTab("all", { name: e.vendor }); }} data-tip="Edit in ledger"><IconEdit /></button>
                    <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => setExpenses?.(prev => (prev || []).filter(x => x.id !== e.id))} data-tip="Delete expense"><IconTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category breakdown bar chart */}
      <div style={sectionLabel}>Expense by Category</div>
      <div style={{ ...cardS, padding: 14 }}>
        {data.catBreakdown.length === 0 && <div style={{ fontSize: 12, color: "#6b7280" }}>No expense data</div>}
        {data.catBreakdown.map(([cat, total]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, cursor: "pointer" }} onClick={() => setCatFilterLocal(cat)}>
            <div style={{ width: 130, fontSize: 11, fontWeight: 600, color: "#374151", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat}</div>
            <div style={{ flex: 1, height: 14, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: Math.max(2, (total / data.catMax) * 100) + "%", height: "100%", background: "#64748b", borderRadius: 2, transition: "width .3s" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", fontFamily: MONO, fontVariantNumeric: "tabular-nums", minWidth: 60, textAlign: "right" }}>{fmt2(total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================
   SUB-TAB 4: VENDORS
   ==================================================================== */
function VendorsTab({ vendors, expenses, setVendors, uid, TODAY, SCHED_E_CATS, goTab, globalFilter, _ac }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fDefaultCat, setFDefaultCat] = useState("");
  const [searchV, setSearchV] = useState(globalFilter.vendor || "");

  const now = TODAY instanceof Date ? TODAY : new Date();
  const thisYear = now.getFullYear();

  const vendorData = useMemo(() => {
    return (vendors || []).map(v => {
      const vExpenses = (expenses || []).filter(e => e.vendor === v.name);
      const ytdSpend = vExpenses.filter(e => e.date && e.date >= thisYear + "-01-01").reduce((s, e) => s + (e.amount || 0), 0);
      const txCount = vExpenses.length;
      const cats = {};
      vExpenses.forEach(e => { if (e.category) cats[e.category] = (cats[e.category] || 0) + 1; });
      const defaultCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      return { ...v, ytdSpend, txCount, defaultCat };
    });
  }, [vendors, expenses, thisYear]);

  const filteredVendors = useMemo(() => {
    if (!searchV.trim()) return vendorData;
    const q = searchV.toLowerCase();
    return vendorData.filter(v => v.name.toLowerCase().includes(q) || (v.email || "").toLowerCase().includes(q));
  }, [vendorData, searchV]);

  const totalVendors = (vendors || []).length;
  const totalSpendYTD = vendorData.reduce((s, v) => s + v.ytdSpend, 0);
  const over600 = vendorData.filter(v => v.ytdSpend >= 600).length;

  const addVendor = () => {
    if (!fName.trim()) return;
    setVendors?.(prev => [...(prev || []), { id: uid ? uid() : "vn-" + Date.now(), name: fName.trim(), phone: fPhone, email: fEmail, notes: fNotes, defaultCategory: fDefaultCat }]);
    setShowAdd(false); setFName(""); setFPhone(""); setFEmail(""); setFNotes(""); setFDefaultCat("");
  };

  const startEdit = (v) => {
    setEditId(v.id); setFName(v.name); setFPhone(v.phone || ""); setFEmail(v.email || ""); setFNotes(v.notes || ""); setFDefaultCat(v.defaultCategory || "");
  };

  const saveEdit = () => {
    setVendors?.(prev => (prev || []).map(v => v.id === editId ? { ...v, name: fName.trim(), phone: fPhone, email: fEmail, notes: fNotes, defaultCategory: fDefaultCat } : v));
    setEditId(null); setFName(""); setFPhone(""); setFEmail(""); setFNotes(""); setFDefaultCat("");
  };

  const deleteVendor = (id) => setVendors?.(prev => (prev || []).filter(v => v.id !== id));

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", WebkitOverflowScrolling: "touch", flexWrap: "nowrap" }}>
        {[
          { label: "Total Vendors", value: String(totalVendors), accent: "#64748b" },
          { label: "Total Spend (YTD)", value: fmt2(totalSpendYTD), accent: "#64748b" },
          { label: "Over $600 (1099)", value: String(over600), accent: over600 > 0 ? "#d4a853" : "#2d6a3f" },
        ].map((kpi, i) => (
          <div key={i} style={kpiS(kpi.accent)}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .8, marginBottom: 3 }}>{kpi.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1714", fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center" }}>
        <button style={btnPrimary} onClick={() => { setShowAdd(!showAdd); setEditId(null); }}>
          <IconPlus /> Add Vendor
        </button>
        <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
          <div style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}><IconSearch /></div>
          <input value={searchV} onChange={e => setSearchV(e.target.value)} placeholder="Search vendors..."
            style={{ width: "100%", padding: "6px 8px 6px 28px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box", height: 32, color: "#1a1714", outline: "none" }} />
        </div>
      </div>

      {/* Add vendor form */}
      {showAdd && !editId && (
        <div style={{ ...cardS, marginBottom: 10, padding: 14 }}>
          <div style={sectionLabel}>New Vendor</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div><label style={labelS}>Name</label><input value={fName} onChange={e => setFName(e.target.value)} placeholder="Vendor name" style={inputS} /></div>
            <div><label style={labelS}>Phone</label><input value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="555-555-5555" style={inputS} /></div>
            <div><label style={labelS}>Email</label><input value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="email@example.com" style={inputS} /></div>
            <div><label style={labelS}>Notes</label><input value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Optional" style={inputS} /></div>
            <div><label style={labelS}>Default Category</label><select value={fDefaultCat} onChange={e => setFDefaultCat(e.target.value)} style={inputS}><option value="">None</option>{SCHED_E_CATS.map(c => <option key={c.label||c.cat} value={c.label||c.cat}>{c.label||c.cat}</option>)}</select></div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnPrimary} onClick={addVendor}>Add Vendor</button>
            <button style={btnSecondary} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Vendor table (list layout, not cards) */}
      <div style={cardS}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={thS()}>Vendor</th>
                <th style={thS()}>Contact</th>
                <th style={thS()}>Category</th>
                <th style={thS("right")}>YTD Spend</th>
                <th style={thS("right")}>Txns</th>
                <th style={thS()}>1099</th>
                <th style={{ ...thS(), width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#6b7280", fontSize: 12 }}>No vendors found</td></tr>
              )}
              {filteredVendors.map((v, i) => (
                <React.Fragment key={v.id}>
                  {editId === v.id ? (
                    <tr style={{ background: "#f9fafb" }}>
                      <td colSpan={7} style={{ padding: 12 }}>
                        <div style={sectionLabel}>Edit Vendor</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div><label style={labelS}>Name</label><input value={fName} onChange={e => setFName(e.target.value)} style={inputS} /></div>
                          <div><label style={labelS}>Phone</label><input value={fPhone} onChange={e => setFPhone(e.target.value)} style={inputS} /></div>
                          <div><label style={labelS}>Email</label><input value={fEmail} onChange={e => setFEmail(e.target.value)} style={inputS} /></div>
                          <div><label style={labelS}>Notes</label><input value={fNotes} onChange={e => setFNotes(e.target.value)} style={inputS} /></div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={btnPrimary} onClick={saveEdit}>Save</button>
                          <button style={btnSecondary} onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"}>
                      <td style={{ padding: "6px 8px", fontWeight: 600, color: "#1a1714" }}>{v.name}</td>
                      <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>
                        {v.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginRight: 8 }}><IconPhone /> {v.phone}</span>}
                        {v.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><IconMail /> {v.email}</span>}
                        {!v.phone && !v.email && "--"}
                      </td>
                      <td style={{ padding: "6px 8px", color: "#6b7280", fontSize: 11 }}>{v.defaultCat || "--"}</td>
                      <td style={{ padding: "6px 8px", ...monoRight, fontWeight: 600, color: "#374151", fontSize: 12 }}>{fmt2(v.ytdSpend)}</td>
                      <td style={{ padding: "6px 8px", ...monoRight, color: "#6b7280", fontSize: 11 }}>{v.txCount}</td>
                      <td style={{ padding: "6px 8px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: v.ytdSpend >= 600 ? "#dc2626" : "#6b7280" }}>
                          {v.ytdSpend >= 600 ? "Required" : "No"}
                        </span>
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>
                        <button style={btnGhost} onClick={() => startEdit(v)} title="Edit"><IconEdit /></button>
                        <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => deleteVendor(v.id)} title="Delete"><IconTrash /></button>
                        <button style={{ ...btnSecondary, height: 22, fontSize: 10, padding: "1px 6px", marginLeft: 4 }} onClick={() => goTab("all", { name: v.name })}>Txns</button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   SUB-TAB 5: ASSETS
   ==================================================================== */
function AssetsTab({ props, mortgages, improvements, charges, expenses, setMortgages, setImprovements, uid, TODAY, IMPROVEMENT_TYPES, goTab, _ac }) {
  const [editMortgageId, setEditMortgageId] = useState(null);
  const [addMortgageProp, setAddMortgageProp] = useState(null);
  const [addImprovementProp, setAddImprovementProp] = useState(null);

  /* Mortgage form */
  const [mLender, setMLender] = useState("");
  const [mLoanAmt, setMLoanAmt] = useState("");
  const [mBalance, setMBalance] = useState("");
  const [mRate, setMRate] = useState("");
  const [mMonthlyPI, setMMonthlyPI] = useState("");

  /* Improvement form */
  const [impDate, setImpDate] = useState(todayStr(TODAY));
  const [impType, setImpType] = useState("");
  const [impDesc, setImpDesc] = useState("");
  const [impCost, setImpCost] = useState("");

  const now = TODAY instanceof Date ? TODAY : new Date();
  const thisYear = now.getFullYear();

  const propData = useMemo(() => {
    return (props || []).map(p => {
      const pName = p.addr || p.name;
      const mortgage = (mortgages || []).find(m => m.propId === p.id);
      const propImprovements = (improvements || []).filter(im => im.propId === p.id);
      const totalImprovement = propImprovements.reduce((s, im) => s + (im.cost || 0), 0);

      /* Annual income/expense for this property */
      const pCharges = (charges || []).filter(c => !c.voided && !c.waived && c.propName === pName && c.dueDate && c.dueDate >= thisYear + "-01-01");
      const annualIncome = pCharges.reduce((s, c) => s + (c.amountPaid || 0), 0);
      const pExpenses = (expenses || []).filter(e => (e.propId === p.id || e.propName === pName) && e.date && e.date >= thisYear + "-01-01");
      const annualExpenses = pExpenses.reduce((s, e) => s + (e.amount || 0), 0);

      /* Annualize (scale partial year) */
      const monthsElapsed = now.getMonth() + 1;
      const annualizedIncome = monthsElapsed > 0 ? (annualIncome / monthsElapsed) * 12 : 0;
      const annualizedExpenses = monthsElapsed > 0 ? (annualExpenses / monthsElapsed) * 12 : 0;
      const noi = annualizedIncome - annualizedExpenses;
      const debtService = mortgage ? (mortgage.monthlyPI || 0) * 12 : 0;
      const dscr = debtService > 0 ? noi / debtService : null;
      const capRate = p.value ? (noi / p.value) * 100 : null;
      const costBasis = (p.purchasePrice || p.value || 0) + totalImprovement;

      return { prop: p, pName, mortgage, improvements: propImprovements, totalImprovement, noi, debtService, dscr, capRate, costBasis, annualizedIncome, annualizedExpenses };
    });
  }, [props, mortgages, improvements, charges, expenses, thisYear, now]);

  const saveMortgage = (propId) => {
    if (!mLender && !mLoanAmt) return;
    const data = { id: editMortgageId || (uid ? uid() : "mt-" + Date.now()), propId, lenderName: mLender, loanAmount: parseFloat(mLoanAmt) || 0, currentBalance: parseFloat(mBalance) || 0, interestRate: parseFloat(mRate) || 0, monthlyPI: parseFloat(mMonthlyPI) || 0 };
    if (editMortgageId) {
      setMortgages?.(prev => (prev || []).map(m => m.id === editMortgageId ? data : m));
    } else {
      setMortgages?.(prev => [...(prev || []), data]);
    }
    setAddMortgageProp(null); setEditMortgageId(null); setMLender(""); setMLoanAmt(""); setMBalance(""); setMRate(""); setMMonthlyPI("");
  };

  const deleteMortgage = (id) => setMortgages?.(prev => (prev || []).filter(m => m.id !== id));

  const startEditMortgage = (m) => {
    setEditMortgageId(m.id); setAddMortgageProp(m.propId); setMLender(m.lenderName || ""); setMLoanAmt(String(m.loanAmount || "")); setMBalance(String(m.currentBalance || "")); setMRate(String(m.interestRate || "")); setMMonthlyPI(String(m.monthlyPI || ""));
  };

  const saveImprovement = (propId) => {
    if (!impType || !impCost) return;
    setImprovements?.(prev => [...(prev || []), { id: uid ? uid() : "imp-" + Date.now(), propId, date: impDate, type: impType, description: impDesc, cost: parseFloat(impCost) || 0 }]);
    setAddImprovementProp(null); setImpDate(todayStr(TODAY)); setImpType(""); setImpDesc(""); setImpCost("");
  };

  const deleteImprovement = (id) => setImprovements?.(prev => (prev || []).filter(im => im.id !== id));

  const dscrColor = (dscr) => { if (dscr === null) return "#6b7280"; if (dscr >= 1.25) return "#2d6a3f"; if (dscr >= 1.0) return "#d4a853"; return "#dc2626"; };

  return (
    <div>
      {propData.length === 0 && (
        <div style={{ textAlign: "center", padding: 32, color: "#6b7280", fontSize: 12 }}>No properties found. Add properties to see asset details.</div>
      )}
      {propData.map(pd => (
        <div key={pd.prop.id} style={{ ...cardS, marginBottom: 12 }}>
          {/* Header row */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => goTab("all", { property: pd.pName })}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1714" }}>{pd.pName}</span>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280" }}>
              {pd.prop.value && <span>Value: <span style={{ fontFamily: MONO, color: "#374151", fontWeight: 600 }}>{fmt2(pd.prop.value)}</span></span>}
              {pd.mortgage && <span>Lender: <span style={{ color: "#374151" }}>{pd.mortgage.lenderName}</span></span>}
            </div>
          </div>

          {/* Metrics row - data table style */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "1px solid #e5e7eb" }}>
            {[
              { label: "NOI", value: fmt2(pd.noi), color: pd.noi >= 0 ? "#2d6a3f" : "#dc2626" },
              { label: "Debt Service", value: fmt2(pd.debtService), color: "#374151" },
              { label: "DSCR", value: pd.dscr !== null ? pd.dscr.toFixed(2) + "x" : "--", color: dscrColor(pd.dscr) },
              { label: "Cap Rate", value: pd.capRate !== null ? pd.capRate.toFixed(1) + "%" : "--", color: "#374151" },
              { label: "Cost Basis", value: fmt2(pd.costBasis), color: "#374151" },
              { label: "Income / Exp (ann.)", value: fmt2(pd.annualizedIncome) + " / " + fmt2(pd.annualizedExpenses), color: "#6b7280" },
            ].map((m, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRight: i < 5 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: .6, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: m.color, fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Two-column: Mortgage + Improvements */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {/* Mortgage */}
            <div style={{ padding: "10px 14px", borderRight: "1px solid #f3f4f6" }}>
              <div style={{ ...sectionLabel, marginBottom: 6 }}>Mortgage</div>
              {pd.mortgage && addMortgageProp !== pd.prop.id ? (
                <div>
                  <table style={{ fontSize: 11, borderCollapse: "collapse" }}>
                    <tbody>
                      {[
                        ["Loan Amount", fmt2(pd.mortgage.loanAmount)],
                        ["Balance", fmt2(pd.mortgage.currentBalance)],
                        ["Rate", pd.mortgage.interestRate + "%"],
                        ["Monthly P&I", fmt2(pd.mortgage.monthlyPI)],
                      ].map(([k, v], i) => (
                        <tr key={i}>
                          <td style={{ padding: "2px 8px 2px 0", color: "#6b7280" }}>{k}</td>
                          <td style={{ padding: "2px 0", fontWeight: 600, color: "#374151", fontFamily: MONO }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <button style={{ ...btnSecondary, height: 22, fontSize: 10, padding: "1px 6px" }} onClick={() => startEditMortgage(pd.mortgage)}><IconEdit /> Edit</button>
                    <button style={{ ...btnGhost, color: "#dc2626" }} onClick={() => deleteMortgage(pd.mortgage.id)}><IconTrash /></button>
                  </div>
                </div>
              ) : addMortgageProp === pd.prop.id ? (
                <div>
                  <div style={{ display: "grid", gap: 4, marginBottom: 6 }}>
                    <input value={mLender} onChange={e => setMLender(e.target.value)} placeholder="Lender name" style={{ ...inputS, height: 28, fontSize: 11 }} />
                    <input type="number" value={mLoanAmt} onChange={e => setMLoanAmt(e.target.value)} placeholder="Loan amount" style={{ ...inputS, height: 28, fontSize: 11 }} />
                    <input type="number" value={mBalance} onChange={e => setMBalance(e.target.value)} placeholder="Current balance" style={{ ...inputS, height: 28, fontSize: 11 }} />
                    <input type="number" value={mRate} onChange={e => setMRate(e.target.value)} placeholder="Interest rate %" style={{ ...inputS, height: 28, fontSize: 11 }} />
                    <input type="number" value={mMonthlyPI} onChange={e => setMMonthlyPI(e.target.value)} placeholder="Monthly P&I" style={{ ...inputS, height: 28, fontSize: 11 }} />
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ ...btnPrimary, height: 24, fontSize: 10, padding: "2px 8px" }} onClick={() => saveMortgage(pd.prop.id)}>{editMortgageId ? "Save" : "Add"}</button>
                    <button style={{ ...btnSecondary, height: 24, fontSize: 10, padding: "2px 8px" }} onClick={() => { setAddMortgageProp(null); setEditMortgageId(null); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>No mortgage on file</div>
                  <button style={{ ...btnSecondary, height: 22, fontSize: 10, padding: "1px 6px" }} onClick={() => setAddMortgageProp(pd.prop.id)}>
                    <IconPlus /> Add Mortgage
                  </button>
                </div>
              )}
            </div>

            {/* Capital Improvements */}
            <div style={{ padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={sectionLabel}>Capital Improvements</div>
                <button style={{ ...btnSecondary, height: 22, fontSize: 10, padding: "1px 6px" }} onClick={() => setAddImprovementProp(addImprovementProp === pd.prop.id ? null : pd.prop.id)}>
                  <IconPlus /> Add
                </button>
              </div>
              {addImprovementProp === pd.prop.id && (
                <div style={{ marginBottom: 8, padding: 8, background: "#f9fafb", borderRadius: 4, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 4 }}>
                    <input type="date" value={impDate} onChange={e => setImpDate(e.target.value)} style={{ ...inputS, height: 26, fontSize: 11 }} />
                    <select value={impType} onChange={e => setImpType(e.target.value)} style={{ ...inputS, height: 26, fontSize: 11 }}>
                      <option value="">Type...</option>
                      {IMPROVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <input value={impDesc} onChange={e => setImpDesc(e.target.value)} placeholder="Description" style={{ ...inputS, height: 26, fontSize: 11, marginBottom: 4 }} />
                  <input type="number" value={impCost} onChange={e => setImpCost(e.target.value)} placeholder="Cost" style={{ ...inputS, height: 26, fontSize: 11, marginBottom: 4 }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ ...btnPrimary, height: 22, fontSize: 10, padding: "1px 6px" }} onClick={() => saveImprovement(pd.prop.id)}>Save</button>
                    <button style={{ ...btnSecondary, height: 22, fontSize: 10, padding: "1px 6px" }} onClick={() => setAddImprovementProp(null)}>Cancel</button>
                  </div>
                </div>
              )}
              {pd.improvements.length === 0 && (
                <div style={{ fontSize: 11, color: "#6b7280" }}>No improvements recorded</div>
              )}
              {pd.improvements.map(im => (
                <div key={im.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <span style={{ color: "#6b7280", fontSize: 10 }}>{fmtD(im.date)}</span>
                    <span style={{ fontWeight: 600, color: "#374151", marginLeft: 6 }}>{im.type}</span>
                    {im.description && <span style={{ color: "#6b7280", marginLeft: 4 }}>- {im.description}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontWeight: 600, fontFamily: MONO, fontVariantNumeric: "tabular-nums", color: "#374151" }}>{fmt2(im.cost)}</span>
                    <button onClick={() => deleteImprovement(im.id)} style={{ ...btnGhost, color: "#dc2626" }}><IconTrash /></button>
                  </div>
                </div>
              ))}
              {pd.improvements.length > 0 && (
                <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginTop: 6, paddingTop: 4, borderTop: "1px solid #e5e7eb", fontFamily: MONO }}>
                  Total: {fmt2(pd.totalImprovement)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
