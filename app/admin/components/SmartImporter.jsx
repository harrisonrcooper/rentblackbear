"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { syncTenantToSupabase } from "@/lib/syncTenant";
import { supa } from "@/lib/supabase-client";
import * as XLSX from "xlsx";

/* ── Icons ── */
const IX = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>;
const IUp = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
const IDl = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const ICh = ({ open }) => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s", flexShrink: 0 }}><path d="M3 1l4 4-4 4"/></svg>;
const IW = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IOk = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IH = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const IPlus = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;

/* ── Constants ── */
const FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "propertyAddress", label: "Property Address", required: true },
  { key: "unit", label: "Unit" },
  { key: "room", label: "Room" },
  { key: "rent", label: "Rent" },
  { key: "moveIn", label: "Move-In" },
  { key: "leaseEnd", label: "Lease End" },
  { key: "leaseTerm", label: "Lease Term (combined)" },
  { key: "sd", label: "Security Deposit" },
  { key: "doorCode", label: "Door Code" },
  { key: "notes", label: "Notes" },
  { key: "gender", label: "Gender" },
  { key: "occupationType", label: "Occupation Type" },
  { key: "propertyType", label: "Property Type" },
];

const PTYPES = ["SFH","Townhome","Duplex","Triplex","Fourplex","ADU","Apartment"];
const LT_ID = "2d9d0941-2802-468a-a6e8-b2cceacf78d1";

const PRESETS = {
  propOS: { name: "name", email: "email", phone: "phone", propertyAddress: "property address", unit: "unit", room: "room", rent: "rent", moveIn: "move-in (yyyy-mm-dd)", leaseEnd: "lease end (yyyy-mm-dd)", sd: "security deposit", doorCode: "door code", notes: "notes", gender: "gender", occupationType: "occupation type" },
  turboTenant: { name: "tenant name", email: "email", phone: "phone number", propertyAddress: "property", unit: "unit", rent: "rent amount", moveIn: "lease start", leaseEnd: "lease end" },
  appFolio: { name: "tenant", email: "email", phone: "phone", propertyAddress: "property address", unit: "unit name", rent: "market rent", moveIn: "move in", leaseEnd: "lease to" },
};

const PATS = {
  name: /^(name|tenant.?name|full.?name|resident|first.?name|tenant)$/i,
  email: /^(e.?mail|email.?addr)/i,
  phone: /^(phone|tel|mobile|cell|phone.?num)/i,
  propertyAddress: /^(address|property.?addr|property$|street|location)/i,
  unit: /^(unit|unit.?(name|#|num|number))/i,
  room: /^(room|room.?(name|#|num|number)|bedroom|bed)/i,
  rent: /^(rent|monthly.?rent|amount|rate|price)/i,
  moveIn: /^(move.?in|start.?date|lease.?start|begin)/i,
  leaseEnd: /^(lease.?end|end.?date|move.?out|expir)/i,
  leaseTerm: /^(lease.?term|term|lease.?dates?|duration)/i,
  sd: /^(security|deposit|sd$|security.?dep)/i,
  doorCode: /^(door.?code|access|gate|key.?code|lock)/i,
  notes: /^(notes?|comments?|memo)/i,
  gender: /^(gender|sex)$/i,
  occupationType: /^(occupation|type|category|employ|job)$/i,
  propertyType: /^(property.?type|prop.?type|building.?type|structure)$/i,
};

/* ── Helpers ── */
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));
  if (lines.length < 2) return { headers: [], rows: [] };
  const parse = (line) => {
    const r = []; let c = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (q && line[i+1] === '"') { c += '"'; i++; } else q = !q; }
      else if (ch === ',' && !q) { r.push(c.trim()); c = ""; }
      else c += ch;
    }
    r.push(c.trim());
    return r;
  };
  const headers = parse(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parse(lines[i]);
    if (vals.every(v => !v)) continue;
    const row = {}; headers.forEach((h, j) => { row[h] = vals[j] || ""; }); row._line = i + 1;
    rows.push(row);
  }
  return { headers, rows };
}

/* ── Smart header detection: find the first row with 3+ non-empty cells ── */
function findHeaderRow(data) {
  for (let i = 0; i < Math.min(20, data.length); i++) {
    const filled = (data[i] || []).filter(v => v !== "" && v != null).length;
    if (filled >= 3) return i;
  }
  return 0;
}

/* ── Convert date formats: "MM/DD/YYYY" → "YYYY-MM-DD", handle "Month-to-Month" ── */
function normalizeDate(s) {
  if (!s) return "";
  const str = String(s).trim();
  if (/month.to.month/i.test(str)) return "MTM";
  // MM/DD/YYYY or M/D/YYYY
  const mdy = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2,"0")}-${mdy[2].padStart(2,"0")}`;
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return str;
}

/* ── Split combined lease term: "03/05/2025 – 02/28/2027" → [moveIn, leaseEnd] ── */
function splitLeaseTerm(s) {
  if (!s) return ["", ""];
  const str = String(s).trim();
  // Try splitting on dash/en-dash/em-dash with spaces
  const parts = str.split(/\s*[–—\-]+\s*/);
  if (parts.length >= 2) {
    return [normalizeDate(parts[0]), normalizeDate(parts[1])];
  }
  return [normalizeDate(str), ""];
}

function parseXLSX(buffer) {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (data.length < 2) return { headers: [], rows: [] };

  // Smart: find actual header row (skip titles, empty rows)
  const hIdx = findHeaderRow(data);
  const headers = (data[hIdx] || []).map(h => String(h).trim()).filter(h => h);

  const rows = [];
  for (let i = hIdx + 1; i < data.length; i++) {
    const vals = data[i];
    if (!vals || vals.every(v => !v && v !== 0)) continue;
    const row = {};
    headers.forEach((h, j) => { row[h] = String(vals[j] ?? "").trim(); });
    row._line = i + 1;
    rows.push(row);
  }
  return { headers, rows };
}

function autoMap(headers) {
  const m = {};
  for (const h of headers) { const n = h.toLowerCase().trim(); for (const [k, p] of Object.entries(PATS)) { if (p.test(n) && !m[k]) { m[k] = h; break; } } }
  return m;
}

function applyPreset(key, headers) {
  const pre = PRESETS[key]; if (!pre) return {};
  const m = {};
  for (const [can, ph] of Object.entries(pre)) { const match = headers.find(h => h.toLowerCase().trim() === ph); if (match) m[can] = match; }
  return m;
}

const normAddr = s => (s||"").trim().replace(/\s+/g," ").replace(/[.,#]/g,"").toLowerCase();
const fmtPhone = v => { const d = (v||"").replace(/\D/g,""); return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : v; };
const fmtMoney = n => { const v = Number(n); return isNaN(v) ? "$0" : "$" + v.toLocaleString(); };
const parseRent = s => Number(String(s||"").replace(/[^0-9.]/g,"")) || 0;

function buildStructure(rows, colMap, existingProps, uid, todayStr) {
  const grouped = {}; const skipped = [];

  for (const row of rows) {
    const g = k => row[colMap[k]] || "";
    const name = g("name"), addr = g("propertyAddress");
    if (!name) { skipped.push({ line: row._line, reason: "Missing tenant name" }); continue; }
    if (!addr) { skipped.push({ line: row._line, reason: `No property address for "${name}"` }); continue; }

    const na = normAddr(addr);
    let un = g("unit") || "Main";
    let rn = g("room");
    // Normalize room formats: "1" → "Bedroom 1", "R1" → "Bedroom 1", "Room 1" → "Bedroom 1"
    if (rn) {
      const trimmed = rn.trim();
      if (/^\d+$/.test(trimmed)) rn = "Bedroom " + trimmed;
      else if (/^R\d+$/i.test(trimmed)) rn = "Bedroom " + trimmed.replace(/^R/i, "");
      else if (/^Room\s*\d+$/i.test(trimmed)) rn = "Bedroom " + trimmed.replace(/^Room\s*/i, "");
    }
    // "Whole Unit" in unit column means whole-house rental
    if (/whole\s*unit/i.test(un)) { rn = rn || "Whole Unit"; }
    rn = rn || un;

    if (!grouped[na]) grouped[na] = { raw: addr, units: {} };
    if (!grouped[na].units[un]) grouped[na].units[un] = { rooms: {} };
    if (!grouped[na].units[un].rooms[rn]) grouped[na].units[un].rooms[rn] = [];

    // Handle combined "Lease Term" column (e.g. "03/05/2025 – 02/28/2027")
    let moveIn = g("moveIn"), leaseEnd = g("leaseEnd");
    const leaseTerm = g("leaseTerm");
    if (leaseTerm && (!moveIn || !leaseEnd)) {
      const [start, end] = splitLeaseTerm(leaseTerm);
      if (!moveIn) moveIn = start;
      if (!leaseEnd) leaseEnd = end;
    }
    // Normalize date formats
    moveIn = normalizeDate(moveIn);
    leaseEnd = normalizeDate(leaseEnd);

    grouped[na].units[un].rooms[rn].push({
      name, email: g("email"), phone: fmtPhone(g("phone")),
      rent: parseRent(g("rent")), rentRaw: g("rent"),
      moveIn, leaseEnd,
      sd: g("sd"), doorCode: g("doorCode"), notes: g("notes"),
      gender: g("gender"), occupationType: g("occupationType"), propertyType: g("propertyType"),
      _line: row._line, excluded: false, sdAutoFilled: false,
    });
  }

  const structure = []; const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const [na, pd] of Object.entries(grouped)) {
    const uns = Object.keys(pd.units), uc = uns.length;
    // Use explicit property type from CSV if provided, otherwise auto-detect from unit count
    const firstRow = Object.values(pd.units)[0] ? Object.values(Object.values(pd.units)[0].rooms)[0]?.[0] : null;
    const csvType = firstRow ? (firstRow.propertyType || "").trim() : "";
    const matchedType = PTYPES.find(t => t.toLowerCase() === csvType.toLowerCase());
    const autoType = uc === 1 ? "SFH" : uc === 2 ? "Duplex" : uc === 3 ? "Triplex" : uc === 4 ? "Fourplex" : "Apartment";
    const type = matchedType || autoType;
    const existing = existingProps.find(p => normAddr(p.addr || p.name) === na);

    const prop = { _id: uid(), addr: pd.raw, type, isExisting: !!existing, existingId: existing?.id || null, units: [] };

    uns.forEach((un, ui) => {
      const rns = Object.keys(pd.units[un].rooms);
      const unit = { _id: uid(), name: un, label: uc > 1 ? labels[ui] || String(ui+1) : "", rentalMode: rns.length === 1 && rns[0] === un ? "wholeHouse" : "byRoom", rooms: [] };

      for (const rn of rns) {
        const tenants = pd.units[un].rooms[rn].map(t => {
          // Auto-fill SD from rent if empty
          if (!t.sd && t.rent > 0) { t.sd = String(t.rent); t.sdAutoFilled = true; }
          return t;
        });
        const warnings = [];
        for (const t of tenants) {
          if (!t.rent) warnings.push({ type: "no-rent", msg: `No rent for ${t.name}` });
          if (t.leaseEnd && t.leaseEnd < todayStr) warnings.push({ type: "past-lease", msg: `Lease ended ${t.leaseEnd} for ${t.name}` });
        }
        // Multiple tenants in same room: check if leases overlap or are sequential transitions
        if (tenants.length > 1) {
          // Sort by move-in date
          const sorted = [...tenants].filter(t => t.moveIn).sort((a, b) => (a.moveIn || "").localeCompare(b.moveIn || ""));
          let hasOverlap = false;
          for (let ti = 0; ti < sorted.length - 1; ti++) {
            const curEnd = sorted[ti].leaseEnd;
            const nextStart = sorted[ti + 1].moveIn;
            // If current has no end date or end is after next start, it's an overlap
            if (curEnd && nextStart && curEnd !== "MTM" && curEnd > nextStart) { hasOverlap = true; break; }
            // If neither has dates, we can't tell — assume transition
            if (!curEnd && !nextStart) { hasOverlap = true; break; }
          }
          if (hasOverlap) {
            warnings.push({ type: "co-living", msg: `${tenants.length} tenants in ${rn} with overlapping leases — co-living?` });
          } else {
            warnings.push({ type: "transition", msg: `${tenants.length} tenants in ${rn} — lease transition (sequential dates). All will be imported as separate rooms.` });
          }
        }
        if (existing) {
          for (const eu of (existing.units || [])) {
            const er = (eu.rooms || []).find(r => r.name.toLowerCase() === rn.toLowerCase());
            if (er?.tenant?.name && er.st === "occupied") warnings.push({ type: "occupied", msg: `${rn} occupied by ${er.tenant.name}` });
          }
        }
        unit.rooms.push({ _id: uid(), name: rn, tenants, warnings });
      }
      prop.units.push(unit);
    });
    structure.push(prop);
  }
  return { structure, skipped };
}

/* ══════════════════════════════════════════════════════════ */
/*  COMPONENT                                                 */
/* ══════════════════════════════════════════════════════════ */

export default function SmartImporter({
  props, setProps, settings, uid, createCharge, setCharges, setNotifs, setSdLedger,
  charges, TODAY, onClose, goTab,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acR = settings?.adminAccentRgb || "74,124,89";
  const fileRef = useRef(null);
  const logRef = useRef(null);

  const [step, setStep] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [colMap, setColMap] = useState({});
  const [showMapper, setShowMapper] = useState(false);
  const [structure, setStructure] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [importLog, setImportLog] = useState([]);
  const [importDone, setImportDone] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [bulkApplied, setBulkApplied] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { title, body, onConfirm, danger }
  const [confirmShake, setConfirmShake] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importConfirmText, setImportConfirmText] = useState("");

  const todayStr = TODAY.toISOString().split("T")[0];

  const handleClose = useCallback(() => {
    if (dirty && step < 2) {
      setConfirmModal({ title: "Leave without saving?", body: "You have unsaved import data. Your progress will be lost.", onConfirm: onClose, danger: true });
      return;
    }
    onClose();
  }, [dirty, step, onClose]);

  // Styles
  const btn = { padding: "8px 16px", borderRadius: 7, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: "#fff", color: "#1a1714", display: "inline-flex", alignItems: "center", gap: 5, minHeight: 40, transition: "all .1s" };
  const btnP = { ...btn, background: _ac, color: "#fff", border: "none" };
  const fld = { width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.12)", fontSize: 12, fontFamily: "inherit", color: "#1a1714", minHeight: 36 };
  const lbl = { fontSize: 10, fontWeight: 700, color: "#5c4a3a", marginBottom: 3, display: "block" };

  // Template
  const downloadTemplate = () => {
    const h = "Name,Email,Phone,Property Address,Unit,Room,Rent,Move-In (YYYY-MM-DD),Lease End (YYYY-MM-DD),Security Deposit,Door Code,Notes,Gender,Occupation Type,Property Type";
    const r1 = "John Smith,john@email.com,(555) 555-1234,123 Main St,Unit A,Bedroom 1,850,2025-08-01,2026-07-31,850,1234,,Male,Remote Worker,Duplex";
    const r2 = "Jane Doe,jane@email.com,(555) 555-5678,123 Main St,Unit A,Bedroom 2,750,2025-09-01,2026-08-31,750,,,Female,Student,Duplex";
    const r3 = "Bob Lee,bob@email.com,(555) 555-9012,456 Oak Ave,Main,Primary Suite,1200,2025-07-01,2026-06-30,1200,5678,,Male,Military,SFH";
    const blob = new Blob([h + "\n" + r1 + "\n" + r2 + "\n" + r3], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "propos-import-template.csv"; a.click(); URL.revokeObjectURL(url);
  };

  // File handling — supports CSV and Excel
  const processFile = (file) => {
    if (!file) return;
    setFileErr("");
    const ext = file.name.toLowerCase().split(".").pop();
    if (!["csv", "xlsx", "xls"].includes(ext)) { setFileErr("Please upload a .csv or .xlsx file."); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onerror = () => setFileErr("Failed to read file.");

    const handleParsed = ({ headers: h, rows }) => {
      if (!rows.length) { setFileErr("No data rows found."); return; }
      setHeaders(h); setCsvRows(rows); setDirty(true);
      const am = autoMap(h);
      setColMap(am);
      if (am.name && am.propertyAddress) {
        const { structure: s, skipped: sk } = buildStructure(rows, am, props, uid, todayStr);
        setStructure(s); setSkipped(sk); setStep(1);
      } else { setShowMapper(true); }
    };

    if (ext === "csv") {
      reader.onload = (ev) => handleParsed(parseCSV(ev.target.result));
      reader.readAsText(file);
    } else {
      reader.onload = (ev) => handleParsed(parseXLSX(ev.target.result));
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files?.[0]); };

  const doMap = () => {
    if (!colMap.name || !colMap.propertyAddress) return;
    const { structure: s, skipped: sk } = buildStructure(csvRows, colMap, props, uid, todayStr);
    setStructure(s); setSkipped(sk); setShowMapper(false); setStep(1);
  };

  // Counts
  const nProps = structure.length;
  const nUnits = structure.reduce((s, p) => s + p.units.length, 0);
  const nRooms = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.length, 0), 0);
  const nTenants = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).length, 0), 0), 0);
  const nWarn = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.warnings.length, 0), 0), 0);
  const totalRent = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).reduce((s4, t) => s4 + (Number(t.rent) || 0), 0), 0), 0), 0);
  const totalSD = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).reduce((s4, t) => s4 + (parseRent(t.sd) || Number(t.rent) || 0), 0), 0), 0), 0);

  // Editing helpers
  const uProp = (pi, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, [f]: v } : x)); };
  const uUnit = (pi, ui, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, [f]: v } : u) } : x)); };
  const uRoom = (pi, ui, ri, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, [f]: v } : r) } : u) } : x)); };
  const uTen = (pi, ui, ri, ti, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, tenants: r.tenants.map((t, l) => l === ti ? { ...t, [f]: v } : t) } : r) } : u) } : x)); };
  const rmProp = pi => { setDirty(true); setStructure(p => p.filter((_, i) => i !== pi)); };
  const toggleSkip = (pi, ui, ri, ti) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, tenants: r.tenants.map((t, l) => l === ti ? { ...t, excluded: !t.excluded } : t) } : r) } : u) } : x)); };
  const addRoom = (pi, ui) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: [...u.rooms, { _id: uid(), name: "New Room", tenants: [], warnings: [] }] } : u) } : x)); };
  const bulkSet = (f, v) => {
    if (!v) return; setDirty(true);
    setStructure(p => p.map(x => ({ ...x, units: x.units.map(u => ({ ...u, rooms: u.rooms.map(r => ({ ...r, tenants: r.tenants.map(t => ({ ...t, [f]: v })) })) })) })));
    setBulkApplied(`${f === "moveIn" ? "Move-In" : f === "leaseEnd" ? "Lease End" : f} set for all ${nTenants} tenants`);
    setTimeout(() => setBulkApplied(null), 3000);
  };

  // ── Execute Import ──
  const executeImport = async () => {
    setStep(2); setDirty(false);
    const log = []; let ok = 0, err = 0, pC = 0, rC = 0;
    const roomMap = {};
    const total = nTenants * 3; // props + charges + sync
    setProgressTotal(total); let done = 0;
    const tick = () => { done++; setProgress(done); };
    const addLog = (msg, st = "ok") => { log.push({ msg, st }); setImportLog([...log]); };

    try {
      // Phase 1: Create property structure
      setProps(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        for (const pd of structure) {
          let prop;
          if (pd.isExisting && pd.existingId) {
            prop = updated.find(p => p.id === pd.existingId);
            if (!prop) { addLog(`Property not found: ${pd.addr}`, "err"); err++; continue; }
            addLog(`Using existing: ${pd.addr}`);
          } else {
            prop = { id: uid(), name: "", addr: pd.addr, type: pd.type, sqft: 0, lat: 0, lng: 0, photos: [], units: [] };
            updated.push(prop); pC++;
            addLog(`Created: ${pd.addr} (${pd.type})`);
          }

          for (const ud of pd.units) {
            let unit = prop.units.find(u => u.name.toLowerCase() === ud.name.toLowerCase());
            if (!unit) {
              unit = { id: uid(), name: ud.name, label: ud.label, sqft: 0, baths: 1, utils: "", clean: "", rentalMode: ud.rentalMode, rent: 0, sd: 0, desc: "", photos: [], rooms: [] };
              prop.units.push(unit);
            }

            for (const rd of ud.rooms) {
              const active = rd.tenants.filter(t => !t.excluded);
              if (!active.length && rd.tenants.length === 0) {
                // Vacant room added by user
                const room = { id: uid(), name: rd.name, rent: 0, sqft: 0, pb: false, st: "vacant", le: "", tenant: null, desc: "", photos: [] };
                unit.rooms.push(room); rC++;
                addLog(`  Vacant room: ${rd.name}`);
                continue;
              }
              for (let ti = 0; ti < active.length; ti++) {
                const t = active[ti];
                const rent = Number(t.rent) || 0;
                const sd = parseRent(t.sd) || rent;
                let room = ti === 0 ? unit.rooms.find(r => r.name.toLowerCase() === rd.name.toLowerCase()) : null;
                const roomName = ti === 0 ? rd.name : `${rd.name} (${t.name})`;
                if (!room) {
                  room = { id: uid(), name: roomName, rent, sqft: 0, pb: false, st: "occupied", le: t.leaseEnd || "", tenant: { name: t.name, email: t.email, phone: t.phone, moveIn: t.moveIn, gender: t.gender, occupationType: t.occupationType, doorCode: t.doorCode, notes: t.notes }, desc: "", photos: [] };
                  unit.rooms.push(room); rC++;
                } else {
                  room.rent = rent || room.rent; room.le = t.leaseEnd || room.le; room.st = "occupied";
                  room.tenant = { name: t.name, email: t.email, phone: t.phone, moveIn: t.moveIn, gender: t.gender, occupationType: t.occupationType, doorCode: t.doorCode, notes: t.notes };
                }
                roomMap[`${pd._id}-${ud._id}-${rd._id}-${ti}`] = { id: room.id, addr: prop.addr || pd.addr, name: room.name, rent, sd };
                ok++; tick();
              }
            }
          }
        }
        return updated;
      });

      // Phase 2: Charges + SD Ledger
      for (const pd of structure) {
        for (const ud of pd.units) {
          for (const rd of ud.rooms) {
            const active = rd.tenants.filter(t => !t.excluded);
            for (let ti = 0; ti < active.length; ti++) {
              const t = active[ti];
              const key = `${pd._id}-${ud._id}-${rd._id}-${ti}`;
              const rm = roomMap[key]; if (!rm) continue;
              const { rent, sd } = rm;

              try {
                if (createCharge && t.name && rent > 0) {
                  const mk = (t.moveIn || todayStr).slice(0, 7);
                  createCharge({ roomId: rm.id, tenantName: t.name, propName: rm.addr, roomName: rm.name, category: "Rent", desc: mk + " Rent", amount: rent, dueDate: mk + "-01", sent: false, sentDate: todayStr });
                }
                if (createCharge && t.name && sd > 0) {
                  createCharge({ roomId: rm.id, tenantName: t.name, propName: rm.addr, roomName: rm.name, category: "Security Deposit", desc: "Security Deposit", amount: sd, dueDate: t.moveIn || todayStr, sent: false, sentDate: todayStr });
                  // SD Ledger entry
                  if (setSdLedger) {
                    setSdLedger(prev => [...(prev || []), {
                      id: uid(), roomId: rm.id, tenantName: t.name, propName: rm.addr, roomName: rm.name,
                      amountHeld: sd, deposits: [{ id: uid(), amount: sd, date: todayStr, desc: "Security Deposit" }],
                      deductions: [], returned: null, returnDate: null,
                    }]);
                  }
                }
                tick();
              } catch (e) { addLog(`Charge error: ${t.name} — ${e.message}`, "err"); err++; tick(); }

              // Phase 3: Sync + Lease
              try {
                await syncTenantToSupabase({ name: t.name, email: t.email, phone: t.phone, moveIn: t.moveIn, leaseEnd: t.leaseEnd, rent, sd, propName: rm.addr, roomName: rm.name, doorCode: t.doorCode || "", appDataRoomId: rm.id, charges });
                if (t.moveIn || t.leaseEnd) {
                  const lid = uid() + uid();
                  await supa("lease_instances", { method: "POST", prefer: "resolution=merge-duplicates", body: JSON.stringify({ id: lid, workspace_id: null, template_id: LT_ID, tenant_id: t.email || null, room_id: rm.id, property_id: null, variable_data: { id: lid, tenantName: t.name, tenantEmail: t.email, roomId: rm.id, LEASE_START: t.moveIn || "", LEASE_END: t.leaseEnd || "", MONTHLY_RENT: rent, SECURITY_DEPOSIT: sd }, status: "draft", updated_at: new Date().toISOString() }) });
                }
                tick();
              } catch (e) { addLog(`Sync error: ${t.name} — ${e.message || "failed"}`, "err"); err++; tick(); }
            }
          }
        }
      }

      if (setNotifs) setNotifs(p => [{ id: uid(), type: "system", msg: `Import: ${ok} tenants, ${pC} properties created`, date: todayStr, read: false, urgent: false }, ...(p || [])]);
      setSummary({ ok, err, pC, rC, totalRent, totalSD });
      setImportDone(true);
    } catch (e) {
      addLog(`Fatal: ${e.message}`, "err");
      setSummary({ ok, err: err + 1, pC, rC, totalRent, totalSD });
      setImportDone(true);
    }
  };

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [importLog]);

  /* ═══════════════════════════════════════════════ */
  /*  RENDER                                         */
  /* ═══════════════════════════════════════════════ */
  const steps = ["Upload CSV", "Review & Confirm", "Importing"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={handleClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 880, maxHeight: "93vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.3)" }}>

        {/* Header */}
        <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1714" }}>Move In</div>
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 6, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><IX /></button>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: i < step ? _ac : i === step ? _ac : "rgba(0,0,0,.06)", color: i <= step ? "#fff" : "#9ca3af", transition: "all .25s", flexShrink: 0 }}>
                  {i < step ? <IOk /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i <= step ? "#1a1714" : "#9ca3af", marginLeft: 6, whiteSpace: "nowrap" }}>{s}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? _ac : "rgba(0,0,0,.08)", margin: "0 10px", borderRadius: 1, transition: "background .25s" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>

          {/* ═══ STEP 0: Upload ═══ */}
          {step === 0 && !showMapper && (<>
            {/* Recommendation banner */}
            <div style={{ background: `rgba(${_acR},.05)`, border: `1px solid rgba(${_acR},.12)`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 6 }}>We recommend using our template</div>
              <div style={{ fontSize: 12, color: "#5c4a3a", lineHeight: 1.7, marginBottom: 10 }}>
                Download the template, fill it in, and upload it back. Not all fields are required — but <strong>each tenant needs their property address in its own cell</strong> so we can auto-create your properties.
              </div>
              <button onClick={downloadTemplate} style={{ ...btn, background: _ac, color: "#fff", border: "none", fontSize: 12 }}><IDl /> Download Template (CSV)</button>
            </div>

            {/* Example table */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#5c4a3a", marginBottom: 6 }}>What your spreadsheet should look like:</div>
              <div style={{ overflowX: "auto", border: "1px solid rgba(0,0,0,.08)", borderRadius: 8 }}>
                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", fontFamily: "inherit" }}>
                  <thead><tr style={{ background: "rgba(0,0,0,.04)" }}>
                    {["Name","Property Address","Unit","Room","Rent","Lease Term"].map(h => (
                      <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, color: "#1a1714", borderBottom: "2px solid rgba(0,0,0,.1)", whiteSpace: "nowrap", fontSize: 10 }}>{h}{(h === "Name" || h === "Property Address") && <span style={{ color: "#c45c4a" }}> *</span>}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      ["John Smith","123 Main St","Unit A","1","850","08/01/2025 – 07/31/2026"],
                      ["Jane Doe","123 Main St","Unit A","Bedroom 2","750","2025-09-01 – 2026-08-31"],
                      ["Bob Lee","456 Oak Ave","Main","Primary Suite","1200","Month-to-Month"],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)" }}>
                        {r.map((c, j) => <td key={j} style={{ padding: "6px 10px", color: "#1a1714", borderBottom: "1px solid rgba(0,0,0,.04)", whiteSpace: "nowrap", fontSize: 11 }}>{c || <span style={{ color: "#ccc" }}>—</span>}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 10, color: "#7a7067", marginTop: 8, lineHeight: 1.8 }}>
                <div><span style={{ color: "#c45c4a", fontWeight: 700 }}>*</span> Only Name and Property Address are required — everything else is optional</div>
                <div>Dates can be any format (08/01/2025, 2025-08-01, or combined "start – end" in one column)</div>
                <div>Phone numbers can be any format — we'll auto-format them</div>
                <div>Rent can be "850", "$850", or "850/mo" — we'll parse the number</div>
                <div>Rooms can be "1", "R1", "Room 1", "Bedroom 1", "Primary Suite" — we'll clean it up</div>
                <div>Use "Main" for Unit on single-unit properties, or leave it blank</div>
              </div>
            </div>

            {/* Upload zone */}
            {fileErr && <div style={{ background: "rgba(196,92,74,.06)", border: "1px solid rgba(196,92,74,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#c45c4a", fontWeight: 600 }}>{fileErr}</div>}
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragEnter={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}
              style={{ border: dragOver ? `2px solid ${_ac}` : "2px dashed rgba(0,0,0,.12)", borderRadius: 14, padding: "40px 40px", textAlign: "center", cursor: "pointer", background: dragOver ? `rgba(${_acR},.04)` : "transparent", transition: "all .15s" }}>
              <IUp />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1714", marginTop: 10 }}>{dragOver ? "Drop file here" : "Upload your spreadsheet"}</div>
              <div style={{ fontSize: 12, color: "#7a7067", marginTop: 4 }}>CSV or Excel (.xlsx) — any format, we'll figure it out</div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={e => processFile(e.target.files?.[0])} style={{ display: "none" }} />
            </div>

            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
              Also works with TurboTenant, AppFolio, Buildium, and Stessa exports
            </div>
          </>)}

          {/* ═══ Column Mapper — click-on-header style ═══ */}
          {step === 0 && showMapper && (() => {
            const mapped = Object.values(colMap).filter(Boolean);
            const unmapped = headers.filter(h => !mapped.includes(h));
            const hasRequired = colMap.name && colMap.propertyAddress;
            const reverseMap = {}; for (const [k, v] of Object.entries(colMap)) { if (v) reverseMap[v] = k; }
            const fieldLabel = k => FIELDS.find(f => f.key === k)?.label || k;

            return (<>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1714", marginBottom: 4 }}>Tell us what each column is</div>
                <div style={{ fontSize: 13, color: "#5c4a3a", lineHeight: 1.6 }}>
                  We found {headers.length} columns and {csvRows.length} rows in <strong>{fileName}</strong>.
                  Click each column header to tell us what it contains.
                  {Object.keys(colMap).length > 0 && <span style={{ color: "#2d6a3f", fontWeight: 600 }}> We auto-detected {Object.keys(colMap).length} — verify they're correct.</span>}
                </div>
              </div>

              {/* Data preview with clickable headers */}
              <div style={{ overflowX: "auto", marginBottom: 16, border: "1px solid rgba(0,0,0,.08)", borderRadius: 10 }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead><tr>
                    {headers.map(h => {
                      const assignedKey = reverseMap[h];
                      const isRequired = assignedKey && FIELDS.find(f => f.key === assignedKey)?.required;
                      return (
                        <th key={h} style={{ padding: 0, borderBottom: "2px solid rgba(0,0,0,.08)", background: assignedKey ? `rgba(${_acR},.08)` : "rgba(0,0,0,.02)", position: "relative" }}>
                          <select
                            value={assignedKey || ""}
                            onChange={e => {
                              const newKey = e.target.value;
                              setColMap(prev => {
                                const next = { ...prev };
                                // Remove old assignment for this header
                                for (const [k, v] of Object.entries(next)) { if (v === h) delete next[k]; }
                                // Remove old assignment for this field (if reassigning)
                                if (newKey) next[newKey] = h;
                                return next;
                              });
                            }}
                            style={{ width: "100%", padding: "10px 8px", border: "none", background: "transparent", fontSize: 11, fontWeight: 700, color: assignedKey ? _ac : "#5c4a3a", cursor: "pointer", fontFamily: "inherit", appearance: "auto", minHeight: 40 }}>
                            <option value="">{h}</option>
                            <option disabled>── assign as ──</option>
                            {FIELDS.map(f => <option key={f.key} value={f.key} disabled={colMap[f.key] && colMap[f.key] !== h}>{f.label}{f.required ? " *" : ""}</option>)}
                          </select>
                          {assignedKey && (
                            <div style={{ padding: "0 8px 6px", fontSize: 9, fontWeight: 700, color: _ac, display: "flex", alignItems: "center", gap: 3 }}>
                              <IOk /> {fieldLabel(assignedKey)}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr></thead>
                  <tbody>
                    {csvRows.slice(0, 3).map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)" }}>
                        {headers.map(h => (
                          <td key={h} style={{ padding: "7px 10px", color: "#1a1714", borderBottom: "1px solid rgba(0,0,0,.04)", whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", fontSize: 12 }}>{row[h] || <span style={{ color: "#ccc" }}>—</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status */}
              <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#5c4a3a" }}>
                  <strong style={{ color: "#2d6a3f" }}>{Object.keys(colMap).length}</strong> of {headers.length} columns mapped
                </div>
                {!colMap.name && <span style={{ fontSize: 11, color: "#c45c4a", fontWeight: 600 }}>Name column is required — click a header to assign it</span>}
                {colMap.name && !colMap.propertyAddress && <span style={{ fontSize: 11, color: "#c45c4a", fontWeight: 600 }}>Property address column is required</span>}
                {hasRequired && unmapped.length > 0 && <span style={{ fontSize: 11, color: "#7a7067" }}>{unmapped.length} column{unmapped.length !== 1 ? "s" : ""} skipped — that's OK</span>}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowMapper(false); setHeaders([]); setCsvRows([]); }} style={btn}>Back</button>
                <button onClick={doMap} disabled={!hasRequired} style={{ ...btnP, opacity: hasRequired ? 1 : 0.4 }}>
                  {hasRequired ? `Continue with ${csvRows.length} rows` : "Assign required columns first"}
                </button>
              </div>
            </>);
          })()}

          {/* ═══ STEP 1: Confirm ═══ */}
          {step === 1 && (<>
            {/* Summary card */}
            <div style={{ background: `rgba(${_acR},.05)`, border: `1px solid rgba(${_acR},.15)`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1714", marginBottom: 6 }}>
                {nProps} {nProps === 1 ? "property" : "properties"} · {nRooms} rooms · {nTenants} tenants
              </div>
              <div style={{ fontSize: 12, color: "#5c4a3a", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>Monthly rent: <strong>{fmtMoney(totalRent)}</strong></span>
                <span>Security deposits: <strong>{fmtMoney(totalSD)}</strong></span>
                {nWarn > 0 && <span style={{ color: "#b8860b", display: "flex", alignItems: "center", gap: 3 }}><IW /> {nWarn} need review</span>}
              </div>
            </div>

            {skipped.length > 0 && (
              <div style={{ background: "rgba(196,92,74,.05)", border: "1px solid rgba(196,92,74,.15)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#c45c4a" }}>
                <strong>{skipped.length} row{skipped.length !== 1 ? "s" : ""} skipped:</strong>
                {skipped.slice(0, 5).map((r, i) => <div key={i}>Line {r.line}: {r.reason}</div>)}
                {skipped.length > 5 && <div>...and {skipped.length - 5} more</div>}
              </div>
            )}

            {/* Bulk apply */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center", position: "sticky", top: -20, background: "#fff", padding: "8px 0", zIndex: 5, borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a" }}>Apply to all:</span>
              {[["moveIn", "Move-In"], ["leaseEnd", "Lease End"]].map(([k, l]) => (
                <div key={k} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "#5c4a3a" }}>{l}</label>
                  <input type="date" style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.12)", fontFamily: "inherit", minHeight: 32 }} onChange={e => bulkSet(k, e.target.value)} />
                </div>
              ))}
              {bulkApplied && <span style={{ fontSize: 11, color: "#2d6a3f", fontWeight: 600 }}>{bulkApplied}</span>}
            </div>

            {/* Property tree */}
            {structure.map((prop, pi) => {
              const open = expanded[pi];
              const pT = prop.units.reduce((s, u) => s + u.rooms.reduce((s2, r) => s2 + r.tenants.filter(t => !t.excluded).length, 0), 0);
              return (
                <div key={pi} style={{ border: "1px solid rgba(0,0,0,.08)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
                  <div onClick={() => setExpanded(p => ({ ...p, [pi]: !p[pi] }))} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "rgba(0,0,0,.015)", minHeight: 48 }}>
                    <ICh open={open} />
                    <IH />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1714", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prop.addr}</div>
                      <div style={{ fontSize: 11, color: "#7a7067" }}>{prop.units.length} unit{prop.units.length !== 1 ? "s" : ""} · {pT} tenant{pT !== 1 ? "s" : ""}</div>
                    </div>
                    <select value={prop.type} onClick={e => e.stopPropagation()} onChange={e => uProp(pi, "type", e.target.value)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", minHeight: 32 }}>
                      {PTYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: prop.isExisting ? "rgba(45,106,63,.1)" : `rgba(${_acR},.1)`, color: prop.isExisting ? "#2d6a3f" : _ac }}>{prop.isExisting ? "EXISTS" : "NEW"}</span>
                    <button onClick={e => { e.stopPropagation(); rmProp(pi); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", padding: 6, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><IX /></button>
                  </div>

                  {open && (
                    <div style={{ padding: "4px 16px 14px", borderTop: "1px solid rgba(0,0,0,.04)" }}>
                      {prop.units.map((unit, ui) => (
                        <div key={ui} style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <input value={unit.name} onChange={e => uUnit(pi, ui, "name", e.target.value)} onClick={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 700, color: "#5c4a3a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.15)", background: "transparent", padding: "2px 4px", width: 140, fontFamily: "inherit" }} />
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>{unit.rooms.length} room{unit.rooms.length !== 1 ? "s" : ""}</span>
                          </div>

                          {unit.rooms.map((room, ri) => (
                            <div key={ri} style={{ marginLeft: 20, borderLeft: `2px solid rgba(0,0,0,.05)`, marginBottom: 3 }}>
                              {room.tenants.map((t, ti) => (
                                <div key={ti} style={{ padding: "7px 12px", opacity: t.excluded ? 0.35 : 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  {ti === 0 ? <input value={room.name} onChange={e => uRoom(pi, ui, ri, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 600, color: "#1a1714", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 100, fontFamily: "inherit" }} />
                                    : <span style={{ width: 100, fontSize: 10, color: "#9ca3af" }}>(shared)</span>}
                                  <span style={{ fontSize: 12, color: "#5c4a3a" }}>—</span>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1714", flex: 1 }}>{t.name}</span>
                                  {t.email && <span style={{ fontSize: 10, color: "#7a7067" }}>{t.email}</span>}
                                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <span style={{ fontSize: 11, color: "#5c4a3a" }}>$</span>
                                    <input type="number" value={t.rent || ""} onChange={e => uTen(pi, ui, ri, ti, "rent", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: t.rent ? "#1a1714" : "#c45c4a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 55, fontFamily: "inherit", textAlign: "right" }} placeholder="0" />
                                    <span style={{ fontSize: 9, color: "#9ca3af" }}>/mo</span>
                                  </div>
                                  {ti === 0 && room.warnings.map((w, wi) => (
                                    <span key={wi} onClick={e => { e.stopPropagation(); setConfirmModal({ title: "Needs Review", body: w.msg, onConfirm: null }); }} style={{ fontSize: 9, fontWeight: 700, color: "#b8860b", background: "rgba(184,134,11,.08)", padding: "3px 8px", borderRadius: 100, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                                      <IW /> {w.type === "no-rent" ? "No rent" : w.type === "past-lease" ? "Expired" : w.type === "co-living" ? "Co-living" : w.type === "transition" ? "Transition" : w.type === "occupied" ? "Occupied" : "Review"}
                                    </span>
                                  ))}
                                  {t.sdAutoFilled && <span style={{ fontSize: 9, color: "#7a7067" }}>SD={fmtMoney(t.sd)}</span>}
                                  <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#9ca3af", cursor: "pointer", minHeight: 32 }}>
                                    <input type="checkbox" checked={!!t.excluded} onChange={() => toggleSkip(pi, ui, ri, ti)} /> Skip
                                  </label>
                                  {ti === 0 && <button onClick={() => setEditing(editing === `${pi}-${ui}-${ri}` ? null : `${pi}-${ui}-${ri}`)} style={{ ...btn, fontSize: 10, padding: "3px 10px", minHeight: 28 }}>{editing === `${pi}-${ui}-${ri}` ? "Close" : "Edit"}</button>}
                                </div>
                              ))}

                              {/* Inline edit */}
                              {editing === `${pi}-${ui}-${ri}` && room.tenants.filter(t => !t.excluded).map((t, ti) => (
                                <div key={`e${ti}`} style={{ margin: "4px 12px 8px", padding: 12, background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
                                  {room.tenants.length > 1 && <div style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a", marginBottom: 6 }}>{t.name}</div>}
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                                    <div><label style={lbl}>Move-In</label><input type="date" value={t.moveIn || ""} onChange={e => uTen(pi, ui, ri, ti, "moveIn", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Lease End</label><input type="date" value={t.leaseEnd || ""} onChange={e => uTen(pi, ui, ri, ti, "leaseEnd", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Security Deposit</label><input type="number" value={t.sd || ""} onChange={e => uTen(pi, ui, ri, ti, "sd", e.target.value)} style={fld} placeholder="$" /></div>
                                    <div><label style={lbl}>Door Code</label><input value={t.doorCode || ""} onChange={e => uTen(pi, ui, ri, ti, "doorCode", e.target.value)} style={fld} /></div>
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
                                    <div><label style={lbl}>Email</label><input value={t.email || ""} onChange={e => uTen(pi, ui, ri, ti, "email", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Phone</label><input value={t.phone || ""} onBlur={e => uTen(pi, ui, ri, ti, "phone", fmtPhone(e.target.value))} onChange={e => uTen(pi, ui, ri, ti, "phone", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Occupation</label>
                                      <select value={t.occupationType || ""} onChange={e => uTen(pi, ui, ri, ti, "occupationType", e.target.value)} style={fld}>
                                        <option value="">—</option>
                                        {["Intern","DoD Contractor","Military","Remote Worker","Student","Travel Nurse","Other"].map(o => <option key={o}>{o}</option>)}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* No tenants (vacant room) */}
                              {room.tenants.length === 0 && (
                                <div style={{ padding: "8px 12px", fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>
                                  <input value={room.name} onChange={e => uRoom(pi, ui, ri, "name", e.target.value)} style={{ fontSize: 11, color: "#5c4a3a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 100, fontFamily: "inherit" }} /> — vacant
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Add vacant room */}
                          <button onClick={() => addRoom(pi, ui)} style={{ marginLeft: 20, marginTop: 4, background: "none", border: "1px dashed rgba(0,0,0,.1)", borderRadius: 6, padding: "4px 12px", fontSize: 10, color: "#7a7067", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, minHeight: 32 }}>
                            <IPlus /> Add vacant room
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Import confirmation */}
            <div style={{ marginTop: 16, background: "rgba(0,0,0,.02)", borderRadius: 10, padding: "16px 18px", border: "1px solid rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 6 }}>This will create:</div>
              <div style={{ fontSize: 12, color: "#5c4a3a", lineHeight: 1.8 }}>
                {structure.filter(p => !p.isExisting).length > 0 && <div>{structure.filter(p => !p.isExisting).length} new {structure.filter(p => !p.isExisting).length === 1 ? "property" : "properties"}</div>}
                {structure.filter(p => p.isExisting).length > 0 && <div>{structure.filter(p => p.isExisting).length} existing {structure.filter(p => p.isExisting).length === 1 ? "property" : "properties"} updated</div>}
                <div>{nRooms} rooms · {nTenants} tenant records · {nTenants} lease drafts</div>
                <div>{nTenants} rent charges ({fmtMoney(totalRent)}) · {nTenants} security deposit charges ({fmtMoney(totalSD)})</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
              <button onClick={() => {
                if (dirty) { setConfirmModal({ title: "Go back?", body: "Your edits on this page will be lost.", onConfirm: () => { setStep(0); setStructure([]); setShowMapper(false); setSkipped([]); setConfirmModal(null); }, danger: false }); return; }
                setStep(0); setStructure([]); setShowMapper(false); setSkipped([]);
              }} style={btn}>Back</button>
              <button onClick={() => { setShowImportConfirm(true); setImportConfirmText(""); }} disabled={nTenants === 0} style={{ ...btnP, fontSize: 13, padding: "10px 24px", opacity: nTenants === 0 ? 0.4 : 1 }}>
                Import {nTenants} Tenant{nTenants !== 1 ? "s" : ""}
              </button>
            </div>
          </>)}

          {/* ═══ STEP 2: Progress ═══ */}
          {step === 2 && (<>
            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1714" }}>{importDone ? "Complete" : "Importing..."}</span>
                <span style={{ fontSize: 12, color: "#5c4a3a" }}>{Math.min(progress, progressTotal)} of {progressTotal}</span>
              </div>
              <div style={{ height: 6, background: "rgba(0,0,0,.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: _ac, width: `${progressTotal ? Math.min((progress / progressTotal) * 100, 100) : 0}%`, borderRadius: 3, transition: "width .3s" }} />
              </div>
            </div>

            {/* Log */}
            <div ref={logRef} style={{ background: "#1a1714", borderRadius: 10, padding: 16, maxHeight: 280, overflowY: "auto", fontSize: 12, lineHeight: 1.7, fontFamily: "inherit" }}>
              {importLog.map((e, i) => (
                <div key={i} style={{ color: e.st === "err" ? "#ef4444" : "rgba(255,255,255,.7)", display: "flex", gap: 6 }}>
                  <span style={{ flexShrink: 0, color: e.st === "err" ? "#ef4444" : "#a3e635" }}>{e.st === "ok" ? <IOk /> : <IX />}</span>
                  <span>{e.msg}</span>
                </div>
              ))}
              {!importDone && <div style={{ color: "#d4a853", marginTop: 4 }}>Working...</div>}
            </div>

            {importDone && summary && (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: summary.err === 0 ? "#2d6a3f" : "#b8860b", marginBottom: 8 }}>
                  {summary.err === 0 ? "Import Complete" : "Completed with Warnings"}
                </div>
                <div style={{ fontSize: 14, color: "#5c4a3a", marginBottom: 4 }}>
                  {summary.pC} properties created · {summary.rC} rooms · {summary.ok} tenants
                </div>
                <div style={{ fontSize: 13, color: "#7a7067", marginBottom: 20 }}>
                  {fmtMoney(summary.totalRent)}/mo rent · {fmtMoney(summary.totalSD)} in deposits
                  {summary.err > 0 && <span style={{ color: "#c45c4a" }}> · {summary.err} errors</span>}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {goTab && <button onClick={() => { onClose(); goTab("tenants"); }} style={btn}>View Tenants</button>}
                  {goTab && <button onClick={() => { onClose(); goTab("properties"); }} style={btn}>View Properties</button>}
                  <button onClick={onClose} style={btnP}>Done</button>
                </div>
              </div>
            )}
          </>)}
        </div>
      </div>

      {/* ── Import Confirmation Modal (type IMPORT) ── */}
      {showImportConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowImportConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, maxWidth: 480, width: "100%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1714", marginBottom: 12 }}>Confirm Import</div>
            <div style={{ fontSize: 13, color: "#5c4a3a", lineHeight: 1.7, marginBottom: 16 }}>
              This will create the following in your account:
            </div>
            <div style={{ background: "rgba(0,0,0,.03)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#1a1714", lineHeight: 1.8 }}>
              <div><strong>{structure.filter(p => !p.isExisting).length}</strong> new properties</div>
              <div><strong>{nRooms}</strong> rooms</div>
              <div><strong>{nTenants}</strong> tenant records with lease drafts</div>
              <div><strong>{nTenants}</strong> rent charges ({fmtMoney(totalRent)})</div>
              <div><strong>{nTenants}</strong> security deposit charges ({fmtMoney(totalSD)})</div>
            </div>
            <div style={{ fontSize: 12, color: "#c45c4a", fontWeight: 600, marginBottom: 12 }}>
              Type <strong>IMPORT</strong> below to confirm
            </div>
            <input
              value={importConfirmText}
              onChange={e => setImportConfirmText(e.target.value.toUpperCase())}
              placeholder="Type IMPORT"
              autoFocus
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: importConfirmText === "IMPORT" ? `2px solid ${_ac}` : "2px solid rgba(0,0,0,.1)", fontSize: 14, fontWeight: 700, fontFamily: "inherit", textAlign: "center", letterSpacing: 2, color: "#1a1714", marginBottom: 16, transition: "border .15s" }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowImportConfirm(false)} style={btn}>Cancel</button>
              <button
                onClick={() => { setShowImportConfirm(false); executeImport(); }}
                disabled={importConfirmText !== "IMPORT"}
                style={{ ...btnP, opacity: importConfirmText === "IMPORT" ? 1 : 0.4 }}>
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Modal ── */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setConfirmModal(null)}>
          <div onClick={e => e.stopPropagation()}
            onAnimationEnd={() => setConfirmShake(false)}
            style={{
              background: "#fff", borderRadius: 14, maxWidth: 400, width: "100%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.25)",
              animation: confirmShake ? "shake .4s ease-in-out" : "none",
            }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: confirmModal.danger ? "#c45c4a" : "#1a1714", marginBottom: 8 }}>{confirmModal.title}</div>
            <div style={{ fontSize: 13, color: "#5c4a3a", lineHeight: 1.6, marginBottom: 20 }}>{confirmModal.body}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmModal(null)} style={btn}>Cancel</button>
              {confirmModal.onConfirm && (
                <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                  style={{ ...btn, background: confirmModal.danger ? "#c45c4a" : _ac, color: "#fff", border: "none" }}>
                  {confirmModal.danger ? "Leave" : "Continue"}
                </button>
              )}
              {!confirmModal.onConfirm && (
                <button onClick={() => setConfirmModal(null)} style={{ ...btnP }}>Got it</button>
              )}
            </div>
          </div>
          <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-6px)} 60%{transform:translateX(4px)} 75%{transform:translateX(-2px)} }`}</style>
        </div>
      )}
    </div>
  );
}
