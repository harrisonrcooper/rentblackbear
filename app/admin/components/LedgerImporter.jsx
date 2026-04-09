"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { normAddr, parseLeaseTitle, parseUnitRoom, normalizeRoomName, isRealAddress, parseMoneyStr, fmtMoney, fuzzyNameMatch, matchChargeToTenant } from "@/lib/addressMatch";
import { saveAppData } from "@/lib/supabase-client";
import * as XLSX from "xlsx";

// ── SVG Icons ─────────────────────────────────────────────────────
const IX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IChk = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IWarn = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IFile = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IArrowR = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// ── Platform detection ────────────────────────────────────────────
const CHARGE_PRESETS = {
  turboTenant: { dueDate: "due date", category: "category", description: "description", leaseTitle: "lease title", status: "status", amount: "amount", amountDue: "amount due" },
  appFolio:    { dueDate: "date", category: "charge type", description: "description", leaseTitle: "tenant", status: "status", amount: "amount", amountDue: "balance" },
  buildium:    { dueDate: "date", category: "type", description: "memo", leaseTitle: "tenant", status: "status", amount: "amount", amountDue: "amount due" },
  innago:      { dueDate: "due date", category: "type", description: "notes", leaseTitle: "unit", status: "status", amount: "charge", amountDue: "balance" },
};

function autoMapChargeHeaders(headers) {
  const hLow = headers.map(h => h.toLowerCase().trim());
  for (const [presetKey, preset] of Object.entries(CHARGE_PRESETS)) {
    let matched = 0;
    const map = {};
    for (const [field, colName] of Object.entries(preset)) {
      const idx = hLow.indexOf(colName);
      if (idx !== -1) { map[field] = headers[idx]; matched++; }
    }
    if (matched >= 4) { map._preset = presetKey; return map; }
  }
  // Fallback: regex patterns
  const PATS = {
    dueDate: /^due\s*date$|^date$/i,
    category: /^category$|^type$|^charge\s*type$/i,
    description: /^desc(ription)?$|^memo$|^notes?$/i,
    leaseTitle: /^lease\s*title$|^tenant$|^unit$|^property$/i,
    status: /^status$/i,
    amount: /^amount$|^charge$|^total$/i,
    amountDue: /^amount\s*due$|^balance$|^remaining$/i,
  };
  const map = {};
  for (const h of headers) {
    const n = h.toLowerCase().trim();
    for (const [k, p] of Object.entries(PATS)) {
      if (p.test(n) && !map[k]) { map[k] = h; break; }
    }
  }
  return map;
}

// ── Default category mapping ──────────────────────────────────────
const DEFAULT_CAT_MAP = {
  "RENT": "Rent",
  "SECURITY_DEPOSIT": "Security Deposit",
  "UTILITY_CHARGE": "Utilities",
  "LATE_FEE": "Late Fee",
  "OTHER": "Prorated Rent",
};

const DEF_PROPOS_CATS = ["Rent","Prorated Rent","Last Month Rent","Utilities","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation","Other"];

// ── CSV Parser ────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = [];
  let current = "", inQuotes = false, row = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(current); current = "";
    } else if ((c === '\n' || (c === '\r' && text[i + 1] === '\n')) && !inQuotes) {
      row.push(current); current = "";
      if (row.some(c => c.trim())) lines.push(row);
      row = [];
      if (c === '\r') i++;
    } else {
      current += c;
    }
  }
  row.push(current);
  if (row.some(c => c.trim())) lines.push(row);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].map(h => h.trim());
  const rows = lines.slice(1).map((cols, i) => {
    const obj = { _line: i + 2 };
    headers.forEach((h, hi) => { obj[h] = (cols[hi] || "").trim(); });
    return obj;
  });
  return { headers, rows };
}

// ── Normalize date from MM/DD/YYYY or YYYY-MM-DD ──────────────────
function normDate(d) {
  if (!d) return "";
  const s = d.trim();
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // MM/DD/YYYY
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2,"0")}-${m[2].padStart(2,"0")}`;
  return s;
}

// ── XLSX Parser ──────────────────────────────────────────────────
function parseXLSX(buffer) {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (data.length < 2) return { headers: [], rows: [] };
  const headers = (data[0] || []).map(h => String(h).trim()).filter(Boolean);
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (!r || r.every(c => !String(c).trim())) continue;
    const obj = { _line: i + 1 };
    headers.forEach((h, hi) => { obj[h] = String(r[hi] || "").trim(); });
    rows.push(obj);
  }
  return { headers, rows };
}

const uid = () => Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 5);

// ══════════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════════
export default function LedgerImporter({
  props, setProps, settings, setSettings, charges, setCharges, setSdLedger, setNotifs,
  createCharge, uid: externalUid, TODAY, onClose, goTab,
  CHARGE_CATS = DEF_PROPOS_CATS, archive = [], setArchive,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _red = settings?.themeRed || "#c45c4a";
  const _gold = settings?.themeGold || "#d4a853";
  const todayStr = (TODAY instanceof Date ? TODAY : new Date()).toISOString().split("T")[0];
  const uidFn = externalUid || uid;

  // ── State ──────────────────────────────────────────────────────
  const [step, setStep] = useState(0); // 0=upload, 1=catMap, 2=tenantMatch, 3=review, 4=cutoff, 5=importing
  const [rawRows, setRawRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [colMap, setColMap] = useState({});
  const [catMap, setCatMap] = useState({});
  const [uniqueCats, setUniqueCats] = useState([]);
  const [parsedCharges, setParsedCharges] = useState([]); // after parsing + matching
  const [matchOverrides, setMatchOverrides] = useState({}); // idx → { roomId, propId, ... } manual overrides
  const [cutoffDate, setCutoffDate] = useState("");
  const [importLog, setImportLog] = useState([]);
  const [importDone, setImportDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const [removePlaceholders, setRemovePlaceholders] = useState(true);
  const [backfillRents, setBackfillRents] = useState(true);
  const [shake, setShake] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showConfirmImport, setShowConfirmImport] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showUnsavedWarn, setShowUnsavedWarn] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [customCatInput, setCustomCatInput] = useState("");
  const [showCustomCatFor, setShowCustomCatFor] = useState(null);
  const [showSkipMsg, setShowSkipMsg] = useState(false); // one-time skip reassurance
  const fileRef = useRef(null);
  const logRef = useRef(null);

  const hasDirtyState = step > 0 && step < 5;
  const tryClose = () => { if (hasDirtyState) setShowUnsavedWarn(true); else onClose(); };

  // ── Step labels ────────────────────────────────────────────────
  const steps = ["Upload", "Categories", "Match Tenants", "Review", "Cutoff", "Importing"];

  // ── Memoized category counts ──────────────────────────────────
  const catCounts = useMemo(() => {
    const counts = {};
    const catCol = colMap.category;
    if (!catCol) return counts;
    for (const r of rawRows) { const c = (r[catCol] || "").trim().toUpperCase(); if (c) counts[c] = (counts[c] || 0) + 1; }
    return counts;
  }, [rawRows, colMap]);

  // ── File handling ──────────────────────────────────────────────
  const processFile = useCallback((file) => {
    if (!file) return;
    const ext = file.name.toLowerCase().split(".").pop();
    const reader = new FileReader();
    reader.onerror = () => { setUploadError("Failed to read file."); setShake(true); };

    const handleParsed = ({ headers: h, rows }) => {
      if (h.length === 0) { setUploadError("Could not parse this file. Check that it is a valid spreadsheet."); setShake(true); return; }
      if (rows.length === 0) { setUploadError("File has headers but no charge data. Export your full charge history and try again."); setShake(true); return; }
      setHeaders(h);
      setRawRows(rows);
      const map = autoMapChargeHeaders(h);
      setColMap(map);

      const catCol = map.category;
      if (catCol) {
        const cats = [...new Set(rows.map(r => (r[catCol] || "").trim().toUpperCase()).filter(Boolean))];
        setUniqueCats(cats);
        const cm = {};
        cats.forEach(c => { cm[c] = DEFAULT_CAT_MAP[c] || ""; });
        setCatMap(cm);
      }

      if (map._preset) {
        setUploadError("");
        setStep(1);
      } else if (map.dueDate && map.amount && map.leaseTitle) {
        setUploadError("");
        setStep(1);
      } else {
        setUploadError("Unrecognized format. Expected columns: Due Date, Category, Amount, Lease Title. Check your export and try again.");
        setShake(true);
      }
    };

    if (ext === "csv") {
      reader.onload = (e) => handleParsed(parseCSV(e.target.result));
      reader.readAsText(file);
    } else {
      reader.onload = (e) => handleParsed(parseXLSX(e.target.result));
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) { setUploadError("Please upload a spreadsheet file (.csv, .xlsx, or .xls). Got: ." + ext); setShake(true); return; }
    setUploadError("");
    processFile(file);
  }, [processFile]);

  // ── Parse charges with tenant matching ─────────────────────────
  const buildParsedCharges = useCallback(() => {
    const results = [];
    const g = (row, field) => row[colMap[field]] || "";

    for (const row of rawRows) {
      const rawCat = (g(row, "category") || "").trim().toUpperCase();
      const mappedCat = catMap[rawCat] || rawCat;
      if (!mappedCat) continue;

      const rawAmount = g(row, "amount");
      const rawAmountDue = g(row, "amountDue");
      const amount = parseMoneyStr(rawAmount);
      if (amount <= 0) continue; // skip zero/negative amounts
      const amountDue = parseMoneyStr(rawAmountDue);
      const amountPaid = Math.max(0, amount - amountDue);
      const status = (g(row, "status") || "").trim().toUpperCase();
      const dueDate = normDate(g(row, "dueDate"));
      const description = g(row, "description") || "";
      const leaseTitle = g(row, "leaseTitle") || "";

      // Parse lease title
      const parsed = parseLeaseTitle(leaseTitle);
      let match = matchChargeToTenant(parsed, props || []);

      // Fallback: try matching against incoming/future tenants on rooms
      if (!match && parsed.tenantName) {
        for (const p of (props || [])) {
          for (const u of (p.units || [])) {
            for (const r of (u.rooms || [])) {
              if (!r.incomingTenant?.name) continue;
              const nameResult = fuzzyNameMatch(parsed.tenantName, r.incomingTenant.name);
              if (nameResult.match) {
                match = { roomId: r.id + "_incoming", propName: p.addr || p.name, roomName: r.name, tenantName: r.incomingTenant.name, confidence: nameResult.confidence, isFuture: true };
                break;
              }
            }
            if (match) break;
          }
          if (match) break;
        }
      }

      // Fallback: try matching against archived/past tenants by name
      if (!match && parsed.tenantName && (archive || []).length > 0) {
        for (const a of archive) {
          if (!a.name) continue;
          const nameResult = fuzzyNameMatch(parsed.tenantName, a.name);
          if (nameResult.match) {
            match = { roomId: a.roomId || a.id, propName: a.propName || "", roomName: a.roomName || "Past", tenantName: a.name, confidence: nameResult.confidence * 0.9, isPast: true };
            break;
          }
        }
      }

      // Detect split payment pattern
      const isSplit = /installment|1st\s+install|2nd\s+install/i.test(description);

      results.push({
        _line: row._line,
        rawCat,
        category: mappedCat,
        amount,
        amountDue,
        amountPaid,
        status,
        dueDate,
        description,
        leaseTitle,
        parsed,
        match,
        isSplit,
        skip: false,
      });
    }

    // Auto-detect cutoff: latest charge date
    const dates = results.filter(r => r.dueDate).map(r => r.dueDate).sort();
    if (dates.length > 0) setCutoffDate(dates[dates.length - 1].slice(0, 7) + "-01");

    setParsedCharges(results);
  }, [rawRows, colMap, catMap, props]);

  // ── Derived: group by tenant for review ────────────────────────
  const groupedByTenant = useMemo(() => {
    const groups = {};
    parsedCharges.forEach((ch, idx) => {
      if (ch.skip) return;
      const override = matchOverrides[idx];
      const m = override || ch.match;
      const key = m ? m.roomId : `unmatched-${idx}`;
      if (!groups[key]) groups[key] = {
        tenantName: m?.tenantName || ch.parsed.tenantName || "Unknown",
        propName: m?.propName || ch.parsed.address || "Unknown",
        roomName: m?.roomName || ch.parsed.room || "",
        roomId: m?.roomId || null,
        propId: m?.propId || null,
        charges: [],
        matched: !!m,
      };
      groups[key].charges.push({ ...ch, _idx: idx });
    });
    return groups;
  }, [parsedCharges, matchOverrides]);

  // ── Derived: confidence breakdown ──────────────────────────────
  const matchStats = useMemo(() => {
    let green = 0, amber = 0, red = 0;
    parsedCharges.forEach((ch, idx) => {
      if (ch.skip) return;
      const m = matchOverrides[idx] || ch.match;
      if (!m) red++;
      else if (m.confidence >= 0.85) green++;
      else amber++;
    });
    return { green, amber, red };
  }, [parsedCharges, matchOverrides]);

  // ── Derived: placeholder charges that would be replaced ────────
  const placeholderCharges = useMemo(() => {
    if (!charges) return [];
    return charges.filter(c => c.historical === true && !c.imported);
  }, [charges]);

  // ── Derived: rent backfill suggestions ─────────────────────────
  const rentSuggestions = useMemo(() => {
    const suggestions = {};
    for (const [key, group] of Object.entries(groupedByTenant)) {
      if (!group.roomId) continue;
      const rentCharges = group.charges.filter(c => c.category === "Rent" && !c.isSplit && c.amount > 0);
      if (rentCharges.length === 0) continue;
      // Find modal rent amount (most common)
      const counts = {};
      rentCharges.forEach(c => { counts[c.amount] = (counts[c.amount] || 0) + 1; });
      const modalRent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (modalRent) {
        suggestions[group.roomId] = {
          tenantName: group.tenantName,
          propName: group.propName,
          roomName: group.roomName,
          suggestedRent: Number(modalRent[0]),
          occurrences: modalRent[1],
          roomId: group.roomId,
          propId: group.propId,
        };
      }
    }
    return suggestions;
  }, [groupedByTenant]);

  // ── Derived: SD entries from imported charges ──────────────────
  const sdEntries = useMemo(() => {
    return parsedCharges.filter((ch, idx) => !ch.skip && ch.category === "Security Deposit" && (matchOverrides[idx] || ch.match));
  }, [parsedCharges, matchOverrides]);

  // ── Derived: review stats (memoized) ───────────────────────────
  const reviewStats = useMemo(() => {
    const active = parsedCharges.filter(c => !c.skip);
    return {
      count: active.length,
      totalAmount: active.reduce((s, c) => s + c.amount, 0),
      totalPaid: active.reduce((s, c) => s + c.amountPaid, 0),
      totalDue: active.reduce((s, c) => s + c.amountDue, 0),
    };
  }, [parsedCharges]);

  // ── All rooms with tenants (for manual match dropdown + matching) ─
  const allRooms = useMemo(() => {
    const rooms = [];
    for (const p of (props || [])) {
      for (const u of (p.units || [])) {
        for (const r of (u.rooms || [])) {
          if (r.tenant?.name) {
            rooms.push({
              roomId: r.id,
              propId: p.id,
              propName: p.addr || p.name,
              unitName: u.name,
              roomName: r.name,
              tenantName: r.tenant.name,
              rent: r.rent || 0,
            });
          }
          // Include incoming/future tenants assigned to this room
          if (r.incomingTenant?.name) {
            rooms.push({
              roomId: r.id + "_incoming",
              propId: p.id,
              propName: p.addr || p.name,
              unitName: u.name,
              roomName: r.name,
              tenantName: r.incomingTenant.name,
              rent: r.incomingTenant.rent || r.rent || 0,
              isFuture: true,
            });
          }
        }
      }
    }
    // Include past/archived tenants so charges can be assigned to them
    for (const a of (archive || [])) {
      if (!a.name) continue;
      // Use archive id as roomId fallback — charges link by roomId
      const existsAlready = rooms.some(r => r.tenantName === a.name && r.roomName === a.roomName);
      if (!existsAlready) {
        rooms.push({
          roomId: a.roomId || a.id,
          propId: a.propId || "",
          propName: a.propName || "",
          unitName: "",
          roomName: a.roomName || "Past",
          tenantName: a.name,
          rent: a.rent || 0,
          isPast: true,
        });
      }
    }
    rooms.sort((a, b) => a.tenantName.localeCompare(b.tenantName));
    return rooms;
  }, [props, archive]);

  // ── Execute import ─────────────────────────────────────────────
  const executeImport = async () => {
    setStep(5);
    const log = [];
    const addLog = (msg, st = "ok") => { log.push({ msg, st }); setImportLog([...log]); };
    const active = parsedCharges.filter(ch => !ch.skip);
    const total = active.length + (removePlaceholders ? 1 : 0) + (backfillRents ? 1 : 0);
    setProgressTotal(total);
    let done = 0;
    const tick = () => { done++; setProgress(done); };

    let imported = 0, skipped = 0, sdCount = 0, placeholdersRemoved = 0, rentsUpdated = 0;

    try {
      // Phase 1: Import charges
      const newCharges = [];
      const newSdEntries = [];
      const newPastCreated = {}; // track past tenants created during this import

      for (const ch of active) {
        const override = matchOverrides[parsedCharges.indexOf(ch)];
        const m = override || ch.match;

        if (!m) {
          addLog(`Skipped: ${ch.leaseTitle} — no tenant match`, "warn");
          skipped++;
          tick();
          continue;
        }

        // Handle "import as past tenant" — create archive entry if needed
        if (m.isNewPast) {
          const archiveName = m.tenantName;
          if (setArchive && !newPastCreated[archiveName]) {
            newPastCreated[archiveName] = true;
            setArchive(prev => {
              if ((prev || []).some(a => a.name === archiveName)) return prev;
              return [{ id: uidFn(), name: archiveName, email: "", phone: "", roomName: m.roomName || "Unknown", propName: m.propName || "", rent: 0, moveIn: "", leaseEnd: "", terminatedDate: "", reason: "Imported (past tenant)", isArchived: false, archivedOn: todayStr }, ...(prev || [])];
            });
          }
          m.roomId = "past_" + archiveName.replace(/\s+/g, "_").toLowerCase();
        }

        // Re-import guard: skip if identical charge already exists
        const isDupe = charges.some(c => c.roomId === m.roomId && c.dueDate === ch.dueDate && c.category === ch.category && c.amount === ch.amount);
        if (isDupe) {
          addLog(`Skipped duplicate: ${m.tenantName} ${ch.category} ${fmtMoney(ch.amount)} (${ch.dueDate})`, "warn");
          skipped++;
          tick();
          continue;
        }

        const isPaid = ch.status === "PAID";
        const isPastDue = ch.status === "PAST DUE";

        // Build charge object
        const chargeObj = {
          id: uidFn(),
          roomId: m.roomId,
          tenantName: m.tenantName,
          propName: m.propName,
          roomName: m.roomName,
          category: ch.category,
          desc: ch.description || `${ch.category} — ${ch.dueDate}`,
          amount: ch.amount,
          amountPaid: ch.amountPaid,
          dueDate: ch.dueDate,
          createdDate: ch.dueDate,
          payments: isPaid ? [{
            id: uidFn(),
            amount: ch.amount,
            method: "Imported",
            date: ch.dueDate,
            depositDate: ch.dueDate,
            depositStatus: "deposited",
            confId: "IMP-" + uidFn().slice(0, 8),
            notes: "Imported from " + (colMap._preset || "CSV"),
          }] : [],
          waived: false,
          waivedReason: "",
          sent: true,
          sentDate: ch.dueDate,
          historical: true,
          imported: true,
          importedFrom: colMap._preset || "csv",
          noLateFee: true,
        };

        if (isPastDue) chargeObj.pastDue = true;

        // Route SD charges to sdLedger as well
        if (ch.category === "Security Deposit") {
          newSdEntries.push({
            id: uidFn(),
            roomId: m.roomId,
            tenantName: m.tenantName,
            propName: m.propName,
            roomName: m.roomName,
            amountHeld: isPaid ? ch.amount : 0,
            deposits: isPaid ? [{ id: uidFn(), amount: ch.amount, date: ch.dueDate, desc: ch.description || "Security Deposit" }] : [],
            deductions: [],
            returned: null,
            returnDate: null,
          });
          sdCount++;
        }

        newCharges.push(chargeObj);
        imported++;
        addLog(`${m.tenantName}: ${ch.category} ${fmtMoney(ch.amount)} (${ch.dueDate}) — ${isPaid ? "paid" : isPastDue ? "past due" : "unpaid"}`);
        tick();
      }

      // Add imported charges
      setCharges(prev => [...newCharges, ...prev]);

      // Add SD entries (merge, don't duplicate by roomId)
      if (newSdEntries.length > 0 && setSdLedger) {
        setSdLedger(prev => {
          const existing = prev || [];
          const merged = [...existing];
          for (const entry of newSdEntries) {
            const existingIdx = merged.findIndex(s => s.roomId === entry.roomId);
            if (existingIdx === -1) {
              merged.push(entry);
            } else {
              // Update existing entry
              merged[existingIdx] = {
                ...merged[existingIdx],
                amountHeld: entry.amountHeld,
                deposits: entry.deposits,
              };
            }
          }
          return merged;
        });
        addLog(`${sdCount} security deposit entries updated in SD ledger`);
      }

      // Phase 2: Remove placeholders
      if (removePlaceholders && placeholderCharges.length > 0) {
        // Only remove placeholders for tenants that have imported charges
        const importedRoomIds = new Set(newCharges.map(c => c.roomId));
        setCharges(prev => {
          const removed = prev.filter(c => {
            if (c.historical && !c.imported && importedRoomIds.has(c.roomId)) return false;
            return true;
          });
          placeholdersRemoved = prev.length - removed.length;
          return removed;
        });
        addLog(`Removed ${placeholdersRemoved} placeholder charges`);
        tick();
      } else {
        tick();
      }

      // Phase 3: Backfill rent amounts to property rooms
      if (backfillRents && setProps && Object.keys(rentSuggestions).length > 0) {
        rentsUpdated = Object.keys(rentSuggestions).length;
        const suggestions = Object.values(rentSuggestions);
        setProps(prev => {
          const updated = JSON.parse(JSON.stringify(prev));
          for (const s of suggestions) {
            for (const p of updated) {
              for (const u of (p.units || [])) {
                for (const r of (u.rooms || [])) {
                  if (r.id === s.roomId && s.suggestedRent > 0) r.rent = s.suggestedRent;
                }
              }
            }
          }
          return updated;
        });
        addLog(`Updated ${rentsUpdated} tenant rent amounts from charge history`);
        tick();
      } else {
        tick();
      }

      // Persist explicitly to Supabase (don't rely on page.jsx auto-save timer)
      await new Promise(resolve => {
        setCharges(cur => { saveAppData("hq-charges", cur); return cur; });
        if (setSdLedger) setSdLedger(cur => { if (cur) saveAppData("hq-sdledger", cur); return cur; });
        if (setProps && rentsUpdated > 0) setProps(cur => { saveAppData("hq-props", cur); return cur; });
        setTimeout(resolve, 100);
      });

      if (setNotifs) {
        setNotifs(p => [{
          id: uidFn(), type: "system",
          msg: `Ledger import: ${imported} charges from ${colMap._preset || "CSV"}`,
          date: todayStr, read: false, urgent: false,
        }, ...(p || [])]);
      }

      setSummary({ imported, skipped, sdCount, placeholdersRemoved, rentsUpdated });
      setImportDone(true);
      addLog(`Import complete: ${imported} charges imported, ${skipped} skipped`);
    } catch (e) {
      addLog(`Fatal: ${e.message}`, "err");
      setSummary({ imported, skipped, sdCount, placeholdersRemoved: 0, rentsUpdated: 0 });
      setImportDone(true);
    }
  };

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [importLog]);

  // ── Escape key closes modal ────────────────────────────────────
  useEffect(() => {
    const handler = e => { if (e.key === "Escape" && step < 5) tryClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, hasDirtyState]);

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (<>
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => { if (step < 5) tryClose(); }}>
      <div onClick={e => e.stopPropagation()} onAnimationEnd={() => setShake(false)} style={{ background: "#fff", borderRadius: 14, maxWidth: 820, width: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.25)", animation: shake ? "shake .4s ease-in-out" : "none" }}>

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1714" }}>Import Ledger</div>
          {step < 5 && <button onClick={tryClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563" }}><IX /></button>}
        </div>

        {/* ── Step indicator ── */}
        <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {steps.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: i < step ? _ac : i === step ? _ac : "#e5e7eb", color: i <= step ? "#fff" : "#6b7280", flexShrink: 0 }}>
                {i < step ? <IChk /> : i + 1}
              </div>
              {i === step && <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1714", whiteSpace: "nowrap" }}>{s}</span>}
            </div>
            {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: i < step ? _ac : "#e5e7eb", margin: "0 2px", flexShrink: 0 }} />}
          </div>))}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>

          {/* ═══ STEP 0: Upload ═══ */}
          {step === 0 && (<>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${dragOver ? _ac : "#d1d5db"}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? _ac + "08" : "#fafaf9", transition: "all .15s" }}
            >
              <div style={{ marginBottom: 12, color: dragOver ? _ac : "#6b7280" }}><IUp /></div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Drop your charge export CSV here</div>
              <div style={{ fontSize: 12, color: "#4b5563" }}>Accepts .csv, .xlsx, and .xls {"\u2014"} any spreadsheet format</div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadError(""); processFile(f); } }} />
            </div>
            {uploadError && <div style={{ marginTop: 12, padding: "8px 12px", background: _red + "10", borderRadius: 8, fontSize: 12, color: _red, fontWeight: 600 }}>
              <IWarn /> {uploadError}
            </div>}
            {colMap._preset && !uploadError && <div style={{ marginTop: 12, padding: "8px 12px", background: _ac + "10", borderRadius: 8, fontSize: 12, color: _ac, fontWeight: 600 }}>
              <IChk /> Detected {colMap._preset} format {"\u2014"} {rawRows.length} charges found
            </div>}
          </>)}

          {/* ═══ STEP 1: Category Mapping ═══ */}
          {step === 1 && (<>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Map Categories</div>
            <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 16 }}>Map each category from your file to a PropOS charge type. Security Deposits will also route to the SD ledger.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {uniqueCats.map(cat => {
                const count = catCounts[cat] || 0;
                return (<div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fafaf9", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1714" }}>{cat}</div>
                    <div style={{ fontSize: 11, color: "#4b5563" }}>{count} charge{count !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ color: "#4b5563", fontSize: 12 }}><IArrowR /></div>
                  {showCustomCatFor === cat ? (
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <input
                        autoFocus
                        value={customCatInput}
                        onChange={e => setCustomCatInput(e.target.value)}
                        placeholder="New category name"
                        onKeyDown={e => {
                          if (e.key === "Enter" && customCatInput.trim()) {
                            const newCat = customCatInput.trim();
                            setCatMap(prev => ({ ...prev, [cat]: newCat }));
                            if (setSettings) {
                              setSettings(prev => {
                                const custom = prev.customChargeCats || [];
                                if (!custom.includes(newCat) && !CHARGE_CATS.includes(newCat)) {
                                  const u = { ...prev, customChargeCats: [...custom, newCat] };
                                  saveAppData("hq-settings", u);
                                  return u;
                                }
                                return prev;
                              });
                            }
                            setShowCustomCatFor(null);
                            setCustomCatInput("");
                          }
                          if (e.key === "Escape") { setShowCustomCatFor(null); setCustomCatInput(""); }
                        }}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid " + _ac, fontSize: 12, fontFamily: "inherit", width: 140 }}
                      />
                      <button onClick={() => { setShowCustomCatFor(null); setCustomCatInput(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: 14 }}><IX /></button>
                    </div>
                  ) : (
                    <select
                      value={catMap[cat] || ""}
                      onChange={e => {
                        if (e.target.value === "__custom__") { setShowCustomCatFor(cat); setCustomCatInput(""); return; }
                        setCatMap(prev => ({ ...prev, [cat]: e.target.value }));
                      }}
                      style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${catMap[cat] ? "#d1d5db" : _red}`, fontSize: 12, fontFamily: "inherit", minWidth: 180, background: catMap[cat] ? "#fff" : _red + "08" }}
                    >
                      <option value="">{"\u2014"} Select charge type {"\u2014"}</option>
                      {[...CHARGE_CATS, ...(CHARGE_CATS.includes("Other") ? [] : ["Other"])].map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="__custom__">+ Add custom category...</option>
                    </select>
                  )}
                </div>);
              })}
            </div>

            {uploadError && step === 1 && <div style={{ marginTop: 12, padding: "8px 12px", background: _red + "10", borderRadius: 8, fontSize: 12, color: _red, fontWeight: 600 }}>
              <IWarn /> {uploadError}
            </div>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => { setStep(0); setUploadError(""); }} style={btnOut(_ac)}>Back</button>
              <button
                onClick={() => {
                  const unmapped = uniqueCats.filter(c => !catMap[c]);
                  if (unmapped.length > 0) { setUploadError(`Map all categories before continuing. Missing: ${unmapped.join(", ")}`); setShake(true); return; }
                  setUploadError("");
                  buildParsedCharges();
                  setStep(2);
                }}
                style={btnPrimary(_ac)}
                disabled={uniqueCats.some(c => !catMap[c])}
              >Continue</button>
            </div>
          </>)}

          {/* ═══ STEP 2: Tenant Matching ═══ */}
          {step === 2 && (<>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Match Charges to Tenants</div>

            {parsedCharges.filter(c => !c.skip).length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "#4b5563" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No charges to match</div>
                <div style={{ fontSize: 12 }}>All rows were filtered out during parsing. Check your category mappings and try again.</div>
                <button onClick={() => setStep(1)} style={{ ...btnOut(_ac), marginTop: 16 }}>Back to Categories</button>
              </div>
            ) : (<>

            {/* Legend + Stats bar — sticky */}
            <div style={{ position: "sticky", top: -20, zIndex: 5, background: "#fff", paddingTop: 4, paddingBottom: 10, marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#4b5563", marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: _ac, display: "inline-block" }} /> {matchStats.green} exact match</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: _gold, display: "inline-block" }} /> {matchStats.amber} close match</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: _red, display: "inline-block" }} /> {matchStats.red} no match</span>
              </div>
              <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden" }}>
                {matchStats.green > 0 && <div style={{ flex: matchStats.green, background: _ac, borderRadius: 3 }} />}
                {matchStats.amber > 0 && <div style={{ flex: matchStats.amber, background: _gold, borderRadius: 3 }} />}
                {matchStats.red > 0 && <div style={{ flex: matchStats.red, background: _red, borderRadius: 3 }} />}
              </div>
            </div>

            {/* One-time skip reassurance */}
            {showSkipMsg && (
              <div style={{ marginBottom: 10, padding: "10px 14px", background: _ac + "08", borderRadius: 8, border: "1px solid " + _ac + "20", fontSize: 12, color: "#374151", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Skipped charges are not lost. You can restore them here, or import them later in a separate batch.</span>
                <button onClick={() => setShowSkipMsg(false)} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 11, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap", marginLeft: 12 }}>Got it</button>
              </div>
            )}

            {/* Skipped charges — un-skip support */}
            {parsedCharges.some(c => c.skip) && (
              <div style={{ marginBottom: 10, padding: "8px 12px", background: "#fafaf9", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#374151" }}>{parsedCharges.filter(c => c.skip).length} charge{parsedCharges.filter(c => c.skip).length !== 1 ? "s" : ""} skipped</span>
                <button onClick={() => setParsedCharges(prev => prev.map(c => ({ ...c, skip: false })))} style={{ background: "none", border: "none", cursor: "pointer", color: _ac, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>Restore All</button>
              </div>
            )}

            {/* Charge list with match results */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}>
              {parsedCharges.map((ch, idx) => {
                if (ch.skip) return null;
                const m = matchOverrides[idx] || ch.match;
                const conf = m ? m.confidence : 0;
                const tier = !m ? "red" : conf >= 0.85 ? "green" : "amber";
                const tierColor = tier === "green" ? _ac : tier === "amber" ? _gold : _red;

                return (<div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
                  {/* Confidence dot */}
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: tierColor, flexShrink: 0 }} title={tier === "green" ? "Exact match" : tier === "amber" ? "Close match (verify)" : "No match found"} />
                  {/* Charge info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#1a1714", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ch.parsed.tenantName || ch.leaseTitle}
                    </div>
                    <div style={{ fontSize: 10, color: "#374151" }}>{ch.category} &middot; {fmtMoney(ch.amount)}</div>
                  </div>
                  {/* Match result — always a dropdown so PM can reassign */}
                  <select
                    value={m ? m.roomId : ""}
                    onChange={e => {
                      if (!e.target.value) { setMatchOverrides(prev => { const n = { ...prev }; delete n[idx]; return n; }); return; }
                      if (e.target.value.startsWith("_newpast_")) {
                        const name = ch.parsed.tenantName || ch.leaseTitle || "Unknown";
                        setMatchOverrides(prev => ({ ...prev, [idx]: { roomId: e.target.value, tenantName: name, propName: ch.parsed.address || "", roomName: ch.parsed.room || "Unknown", confidence: 1.0, isNewPast: true } }));
                        return;
                      }
                      const room = allRooms.find(r => r.roomId === e.target.value);
                      if (room) setMatchOverrides(prev => ({ ...prev, [idx]: { ...room, confidence: 1.0 } }));
                    }}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid " + (m ? (m.isNewPast ? "#6b5e52" : "#d1d5db") : _red), fontSize: 11, fontFamily: "inherit", background: m ? (m.isNewPast ? "rgba(107,94,82,.06)" : "#fff") : _red + "08", maxWidth: 260, minWidth: 160 }}
                  >
                    <option value="">Assign tenant...</option>
                    {allRooms.filter(r => !r.isPast && !r.isFuture).map(r => (
                      <option key={r.roomId} value={r.roomId}>{r.tenantName} {"\u2014"} {r.roomName}</option>
                    ))}
                    {allRooms.some(r => r.isFuture) && <option disabled>--- Future Tenants ---</option>}
                    {allRooms.filter(r => r.isFuture).map(r => (
                      <option key={"fut-" + r.roomId} value={r.roomId}>{r.tenantName} {"\u2014"} {r.roomName} (incoming)</option>
                    ))}
                    {allRooms.some(r => r.isPast) && <option disabled>--- Past Tenants ---</option>}
                    {allRooms.filter(r => r.isPast).map(r => (
                      <option key={"past-" + r.roomId} value={r.roomId}>{r.tenantName} {"\u2014"} {r.roomName} (past)</option>
                    ))}
                    <option disabled>---</option>
                    <option value={"_newpast_" + idx}>Import as past tenant ({ch.parsed.tenantName || ch.leaseTitle || "Unknown"})</option>
                  </select>
                  {/* Skip button */}
                  <button
                    onClick={() => { if (!showSkipMsg) setShowSkipMsg(true); setParsedCharges(prev => prev.map((c, i) => i === idx ? { ...c, skip: true } : c)); }}
                    onMouseEnter={e => { e.currentTarget.style.background = _red + "10"; e.currentTarget.style.color = _red; e.currentTarget.style.borderColor = _red; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                    style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, cursor: "pointer", color: "#4b5563", fontSize: 10, padding: "4px 10px", fontFamily: "inherit", whiteSpace: "nowrap", fontWeight: 600, transition: "all .15s" }}
                  >Skip</button>
                </div>);
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={btnOut(_ac)}>Back</button>
              <button onClick={() => setStep(3)} style={btnPrimary(_ac)}>Continue to Review</button>
            </div>
          </>)}
          </>)}

          {/* ═══ STEP 3: Review & Reconciliation ═══ */}
          {step === 3 && (<>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Review Import</div>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
              {[
                ["Charges", reviewStats.count],
                ["Total Amount", fmtMoney(reviewStats.totalAmount)],
                ["Paid", fmtMoney(reviewStats.totalPaid)],
                ["Outstanding", fmtMoney(reviewStats.totalDue)],
                ["Placeholders", placeholderCharges.length],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#fafaf9", borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1714" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Grouped by tenant */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              {Object.entries(groupedByTenant).map(([key, group]) => (
                <div key={key} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: group.matched ? "#fafaf9" : _red + "08" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714" }}>{group.tenantName}</div>
                      <div style={{ fontSize: 10, color: "#4b5563" }}>{group.propName} &middot; {group.roomName}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714" }}>{fmtMoney(group.charges.reduce((s, c) => s + c.amount, 0))}</div>
                      <div style={{ fontSize: 10, color: group.charges.some(c => c.amountDue > 0) ? _red : _ac, fontWeight: 600 }}>
                        {group.charges.filter(c => c.amountDue > 0).length > 0
                          ? `${fmtMoney(group.charges.reduce((s, c) => s + c.amountDue, 0))} unpaid`
                          : "All paid"}
                      </div>
                    </div>
                  </div>
                  {/* Individual charges */}
                  {group.charges.map(ch => (
                    <div key={ch._idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 28px", fontSize: 11, borderTop: "1px solid #f9fafb" }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600 }}>{ch.category}</span>
                        {ch.description && <span style={{ color: "#4b5563" }}> — {ch.description}</span>}
                        {ch.isSplit && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: _gold + "20", color: _gold }}>SPLIT</span>}
                      </div>
                      <div style={{ fontWeight: 600, minWidth: 60, textAlign: "right" }}>{fmtMoney(ch.amount)}</div>
                      <div style={{ minWidth: 50, textAlign: "right", fontSize: 10, fontWeight: 600, color: ch.status === "PAID" ? _ac : ch.status === "PAST DUE" ? _red : _gold }}>
                        {ch.status === "PAID" ? "Paid" : ch.status === "PAST DUE" ? "Past Due" : "Unpaid"}
                      </div>
                      <div style={{ minWidth: 70, textAlign: "right", color: "#4b5563", fontSize: 10 }}>{ch.dueDate}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Flags */}
            {placeholderCharges.length > 0 && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "10px 14px", background: "#fafaf9", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer" }}>
                <input type="checkbox" checked={removePlaceholders} onChange={e => setRemovePlaceholders(e.target.checked)} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>Remove {placeholderCharges.length} placeholder charges</div>
                  <div style={{ fontSize: 10, color: "#4b5563" }}>Auto-generated during tenant import — superseded by real charge data</div>
                </div>
              </label>
            )}

            {Object.keys(rentSuggestions).length > 0 && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#fafaf9", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714", marginBottom: 8 }}>Detected Rent Amounts</div>
                {Object.values(rentSuggestions).map(s => (
                  <div key={s.roomId} style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>
                    {s.tenantName}: {fmtMoney(s.suggestedRent)}/mo ({s.occurrences} charge{s.occurrences !== 1 ? "s" : ""} at this amount)
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={btnOut(_ac)}>Back</button>
              <button onClick={() => setStep(4)} style={btnPrimary(_ac)}>Set Cutoff Date</button>
            </div>
          </>)}

          {/* ═══ STEP 4: Cutoff Date ═══ */}
          {step === 4 && (<>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Cutoff Date</div>
            <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 16 }}>
              Historical charges imported through this date. PropOS will generate new charges starting the following month.
            </div>

            <div style={{ padding: "16px 20px", background: "#fafaf9", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>Historical charges through</label>
              <input
                type="month"
                value={cutoffDate ? cutoffDate.slice(0, 7) : ""}
                onChange={e => setCutoffDate(e.target.value + "-01")}
                style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14, fontFamily: "inherit", width: "100%" }}
              />

              {cutoffDate && (() => {
                const d = new Date(cutoffDate + "T00:00:00");
                const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                const cutoffLabel = d.toLocaleString("default", { month: "long", year: "numeric" });
                const nextLabel = nextMonth.toLocaleString("default", { month: "long", year: "numeric" });
                return (
                  <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: _ac }} />
                      <span><strong>{cutoffLabel}</strong> is covered by imported charges</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: _gold }} />
                      <span>PropOS will generate <strong>{nextLabel}</strong> charges going forward</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => setStep(3)} style={btnOut(_ac)}>Back</button>
              <button onClick={() => setShowConfirmImport(true)} style={{ ...btnPrimary(_ac), background: _ac }}>
                Import {parsedCharges.filter(c => !c.skip).length} Charges
              </button>
            </div>
          </>)}

          {/* ═══ STEP 5: Importing ═══ */}
          {step === 5 && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1714" }}>{importDone ? "Complete" : "Importing..."}</span>
              <span style={{ fontSize: 11, color: "#4b5563" }}>{progress} of {progressTotal}</span>
            </div>
            <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", background: _ac, borderRadius: 3, transition: "width .2s", width: progressTotal ? `${(progress / progressTotal) * 100}%` : "0%" }} />
            </div>

            {/* Log */}
            <div ref={logRef} style={{ background: "#fafaf9", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, maxHeight: 250, overflowY: "auto", fontSize: 11, lineHeight: 1.6 }}>
              {importLog.map((l, i) => (
                <div key={i} style={{ color: l.st === "err" ? _red : l.st === "warn" ? _gold : "#374151" }}>
                  {l.st === "ok" && <span style={{ color: _ac }}><IChk /> </span>}
                  {l.st === "warn" && <span style={{ color: _gold }}><IWarn /> </span>}
                  {l.msg}
                </div>
              ))}
            </div>

            {/* Summary */}
            {importDone && summary && (<>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: _ac, marginBottom: 4 }}>
                  {summary.skipped === 0 ? "Import Complete" : "Completed with Warnings"}
                </div>
                <div style={{ fontSize: 12, color: "#4b5563" }}>
                  {summary.imported} charges imported &middot; {summary.sdCount} SD entries &middot; {summary.placeholdersRemoved} placeholders removed{summary.rentsUpdated > 0 && <> &middot; {summary.rentsUpdated} rent amounts updated</>}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {goTab && <button onClick={() => { onClose(); goTab("ledger"); }} style={btnOut(_ac)}>View Ledger</button>}
                <button onClick={onClose} style={btnPrimary(_ac)}>Done</button>
              </div>
            </>)}
          </>)}
        </div>
      </div>
    </div>

    {/* ── Unsaved Changes Warning ── */}
    {showUnsavedWarn && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowUnsavedWarn(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 380, width: "100%", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Unsaved Changes</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
            You have an import in progress. Closing will discard all parsed data and category mappings.
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowUnsavedWarn(false)} style={btnOut(_ac)}>Cancel</button>
            <button onClick={() => { setShowUnsavedWarn(false); onClose(); }} style={{ ...btnPrimary(_ac), background: _red }}>Leave Without Saving</button>
          </div>
        </div>
      </div>
    )}

    {/* ── Confirm Import Modal ── */}
    {showConfirmImport && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => { setShowConfirmImport(false); setConfirmText(""); }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 420, width: "100%", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Confirm Import</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 12 }}>
            This will import <strong>{parsedCharges.filter(c => !c.skip).length} charges</strong> into your ledger.
            {removePlaceholders && placeholderCharges.length > 0 && <> <strong>{placeholderCharges.length} placeholder charges</strong> will be removed.</>}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: _ac, marginBottom: 8 }}>Type IMPORT to confirm</div>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Type IMPORT" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13, fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowConfirmImport(false); setConfirmText(""); }} style={btnOut(_ac)}>Cancel</button>
            <button
              disabled={confirmText !== "IMPORT"}
              onClick={() => { setShowConfirmImport(false); setConfirmText(""); executeImport(); }}
              style={{ ...btnPrimary(_ac), opacity: confirmText === "IMPORT" ? 1 : .5 }}
            >Import Charges</button>
          </div>
        </div>
      </div>
    )}
  </>);
}

// ── Shared button styles ─────────────────────────────────────────
function btnPrimary(accent) {
  return { padding: "8px 16px", borderRadius: 6, border: "none", background: accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 };
}
function btnOut(accent) {
  return { padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
}
