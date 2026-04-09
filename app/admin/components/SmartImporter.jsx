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
  contactInfo: /^(contact.?info|contact)/i,
  leaseComposite: /^(lease)$/i,
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
  let headers = parse(lines[0]);
  let dataStart = 1;

  // Check if first row is actually data (no headers)
  if (looksLikeData(headers)) {
    const colCount = headers.length;
    headers = generateSyntheticHeaders(headers, colCount);
    dataStart = 0; // first row is data, not headers
  }

  const rows = [];
  for (let i = dataStart; i < lines.length; i++) {
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

/* ── Detect if a row looks like data (not headers) ── */
// Headers are short labels like "Name", "Email", "Lease Term"
// Data has emails, phone numbers, addresses, long strings
function looksLikeData(row) {
  const vals = Array.isArray(row) ? row : Object.values(row);
  const strings = vals.map(v => String(v || "").trim()).filter(Boolean);
  if (!strings.length) return false;
  // If any cell contains an email, phone pattern, or street address — it's data
  const hasEmail = strings.some(s => /@/.test(s) && s.length > 10);
  const hasPhone = strings.some(s => /\(\d{3}\)/.test(s) || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(s));
  const hasAddress = strings.some(s => /^\d+\s+\w/.test(s) && (s.includes("Dr") || s.includes("Ave") || s.includes("St") || s.includes("NW") || s.includes("NE") || s.includes("Blvd") || s.includes("Ln")));
  const hasLongStrings = strings.filter(s => s.length > 25).length >= 2;
  return hasEmail || hasPhone || hasAddress || hasLongStrings;
}

// Generate synthetic headers for headerless data
function generateSyntheticHeaders(firstRow, colCount) {
  // Try to guess what each column is based on the data
  const vals = Array.isArray(firstRow) ? firstRow : Object.values(firstRow);
  const headers = [];
  for (let i = 0; i < colCount; i++) {
    const v = String(vals[i] || "").trim();
    if (/^[A-Z][a-z]+\s+[A-Z]/.test(v) && !v.includes("@") && v.length < 40) headers.push("Name");
    else if (/@/.test(v) && /\(?\d{3}\)?/.test(v)) headers.push("Contact Info");
    else if (/@/.test(v)) headers.push("Email");
    else if (/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(v.replace(/\D/g, "").length === 10 ? v : "")) headers.push("Phone");
    else if (/^\d+\s+\w/.test(v) && (v.includes("Dr") || v.includes("Ave") || v.includes("St") || v.includes("NW") || v.includes("Ln"))) headers.push("Lease");
    else if (/last active/i.test(v)) headers.push("Tenant Portal Access");
    else headers.push("Column " + (i + 1));
  }
  return headers;
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
  let headers = (data[hIdx] || []).map(h => String(h).trim()).filter(h => h);
  let dataStart = hIdx + 1;

  // Check if detected header row is actually data
  if (looksLikeData(data[hIdx])) {
    const colCount = headers.length;
    headers = generateSyntheticHeaders(data[hIdx], colCount);
    dataStart = hIdx; // this row is data
  }

  const rows = [];
  for (let i = dataStart; i < data.length; i++) {
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

const normAddr = s => {
  let a = (s||"").trim().replace(/\s+/g," ").replace(/[.,#]/g,"").toLowerCase();
  // Strip city/state/zip if appended (e.g. "3026 Turf AVE NW Huntsville AL 35816")
  a = a.replace(/\s+(huntsville|madison|decatur|athens)\s+(al|alabama)\s*\d{0,5}\s*$/i, "");
  // Normalize street abbreviations
  a = a.replace(/\bdrive\b/gi, "dr").replace(/\bavenue\b/gi, "ave").replace(/\bstreet\b/gi, "st").replace(/\bboulevard\b/gi, "blvd").replace(/\blane\b/gi, "ln").replace(/\bcourt\b/gi, "ct");
  return a.trim();
};
const fmtPhone = v => { const d = (v||"").replace(/\D/g,""); return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : v; };
const fmtMoney = n => { const v = Number(n); return isNaN(v) ? "$0" : "$" + v.toLocaleString(); };
const parseRent = s => Number(String(s||"").replace(/[^0-9.]/g,"")) || 0;

/* ── Composite field parsers (TurboTenant copy-paste) ── */

// Split "email(phone)" → { email, phone }
function parseContactInfo(str) {
  if (!str) return { email: "", phone: "" };
  const s = String(str).trim();
  // Pattern: email followed by (xxx) xxx-xxxx or (xxx)xxx-xxxx
  const m = s.match(/^(.+?)\((\d{3})\)\s*(\d{3})[- ]?(\d{4})$/);
  if (m) return { email: m[1].trim(), phone: `(${m[2]}) ${m[3]}-${m[4]}` };
  // Just email, no phone
  if (s.includes("@") && !s.includes("(")) return { email: s, phone: "" };
  // Just phone
  const digits = s.replace(/\D/g, "");
  if (digits.length === 10 && !s.includes("@")) return { email: "", phone: fmtPhone(s) };
  return { email: s, phone: "" };
}

// Split "ADDRESS, UNIT, ROOM - TENANT NAME" → { address, unit, room, tenantName }
function parseLeaseColumn(str) {
  if (!str) return { address: "", unit: "", room: "", tenantName: "" };
  let s = String(str).trim();

  // Handle UB-R3, UB-MB patterns BEFORE splitting on dash (so we don't confuse unit-room dash with name dash)
  // Replace UB-R3 with U.B-R.3 temporarily to protect it from dash splitting
  s = s.replace(/\bU([A-Z])-(?=R\d|MB|Master)/gi, "U$1~");

  // Split on " - " or "- " to separate address+room from tenant name
  // Look for dash followed by a capital letter (name start)
  let addressPart = s, tenantName = "";
  const dashMatch = s.match(/^(.*?)[\s]*-[\s]*([A-Z][a-z].*)/);
  if (dashMatch) {
    addressPart = dashMatch[1].trim();
    tenantName = dashMatch[2].trim();
  }

  // Restore UB~R3 → UB-R3
  addressPart = addressPart.replace(/U([A-Z])~/gi, "U$1-");
  tenantName = tenantName.replace(/U([A-Z])~/gi, "U$1-");

  // Strip city/state/zip from address part
  addressPart = addressPart.replace(/,?\s*(Huntsville|Madison|Decatur|Athens)\s+(AL|Alabama)\s*\d{0,5}\s*$/i, "").trim();

  // Strip tenant name if it leaked into room or address (e.g. "2 Manvith Amara" or "3026 Turf Ave. NW B, 2 Manvith Amara")
  // Detect: string ending with two+ capitalized words that look like a name, optionally after a number
  const nameInAddr = addressPart.match(/^(.*?(?:\d|NW|NE|SW|SE))\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*$/);
  if (nameInAddr && !tenantName) {
    addressPart = nameInAddr[1].trim();
    tenantName = nameInAddr[2].trim();
  }

  // Handle "address B2" pattern (no comma before unit code)
  // e.g. "908 Lee DR NW B2" → address="908 Lee DR NW", unit+room="B2"
  const addrUnitMatch = addressPart.match(/^(.+?\b(?:NW|NE|SW|SE|N|S|E|W)\b)\s+([A-Z]\d+|U[A-Z]-?(?:R\d+|MB|Master))$/i);
  if (addrUnitMatch) {
    addressPart = addrUnitMatch[1];
    const ur = parseUnitRoom(addrUnitMatch[2]);
    if (ur.unit || ur.room) {
      // Prepend to parts
      addressPart = addrUnitMatch[1] + "," + addrUnitMatch[2];
    }
  }

  // Split address part by commas
  const parts = addressPart.split(",").map(p => p.trim()).filter(Boolean);
  let address = "", unit = "", room = "";

  if (parts.length >= 3) {
    address = parts[0]; unit = parts[1]; room = parts[2];
  } else if (parts.length === 2) {
    address = parts[0];
    const val = parts[1];
    const unitRoom = parseUnitRoom(val);
    if (unitRoom.unit && unitRoom.room) {
      unit = unitRoom.unit; room = unitRoom.room;
    } else if (/^\d+$/.test(val) || /^master$|^primary/i.test(val)) {
      room = val;
    } else if (/^[A-Z]$/i.test(val)) {
      unit = val;
    } else if (/^[A-Z][a-z]+ [A-Z]/.test(val) && !tenantName) {
      tenantName = val; // tenant name in room position
    } else {
      room = val;
    }
  } else {
    address = parts[0] || "";
  }

  // Handle "address B, 2" where B stuck to address (e.g. "3026 Turf Ave. NW B")
  if (!unit && !room && address) {
    const m = address.match(/^(.+?)\s+([A-Z])$/i);
    if (m) { address = m[1]; unit = m[2]; }
  }

  return { address: address.trim(), unit: unit.trim(), room: room.trim(), tenantName: tenantName.trim() };
}

// Parse combined unit+room codes: "B1" → {unit:"B", room:"1"}, "UB-R3" → {unit:"B", room:"3"}, "UB-MB" → {unit:"B", room:"Master"}
function parseUnitRoom(val) {
  if (!val) return { unit: "", room: "" };
  const s = val.trim();
  // "UB-R3" or "UB-MB" pattern (U=unit prefix, B=unit, R/MB=room)
  const ubr = s.match(/^U([A-Z])-?(R(\d+)|MB|Master)$/i);
  if (ubr) return { unit: ubr[1], room: ubr[3] ? ubr[3] : "Master" };
  // "B1", "A3" pattern (single letter + number)
  const ln = s.match(/^([A-Z])(\d+)$/i);
  if (ln) return { unit: ln[1].toUpperCase(), room: ln[2] };
  // "A1" already handled by ln above
  return { unit: "", room: "" };
}

// Detect TurboTenant copy-paste format
function isTurboTenantPaste(headers) {
  const h = headers.map(s => s.toLowerCase().trim());
  return h.includes("name") && h.includes("contact info") && h.includes("lease");
}

// Pre-process rows from TurboTenant paste format into standard fields
function preprocessTurboTenantRows(rows, headers) {
  return rows.map(row => {
    const newRow = { ...row, _line: row._line };
    const contactRaw = row["Contact Info"] || row["contact info"] || "";
    const leaseRaw = row["Lease"] || row["lease"] || "";

    // Parse contact info → email + phone
    const contact = parseContactInfo(contactRaw);
    newRow["_email"] = contact.email;
    newRow["_phone"] = contact.phone;

    // Parse lease column → address + unit + room + tenant name
    const lease = parseLeaseColumn(leaseRaw);
    newRow["_address"] = lease.address;
    newRow["_unit"] = lease.unit;
    newRow["_room"] = lease.room;
    newRow["_leaseTenantName"] = lease.tenantName;

    return newRow;
  });
}

// Check if a string looks like a real street address (has a number + street name)
function isRealAddress(addr) {
  if (!addr) return false;
  return /^\d+\s+\w/.test(addr.trim());
}

function buildStructure(rows, colMap, existingProps, uid, todayStr) {
  const grouped = {}; const skipped = []; const mergeLog = [];

  for (const row of rows) {
    const g = k => row[colMap[k]] || "";
    const name = g("name"), addr = g("propertyAddress");
    if (!name) { skipped.push({ line: row._line, reason: "Missing tenant name" }); continue; }
    if (!addr) { skipped.push({ line: row._line, reason: `No property address for "${name}"` }); continue; }

    let na = normAddr(addr);
    let un = g("unit") || "Main";
    let rn = g("room");

    // ── Smart merge: if address doesn't look right, try to match a known property ──

    // Case 1: Address has a trailing letter that's actually a unit (e.g. "3026 Turf Ave NW B")
    if (!grouped[na]) {
      const trailingUnit = na.match(/^(.+?)\s+([a-z])$/i);
      if (trailingUnit) {
        const baseAddr = trailingUnit[1].trim();
        // Check if base address exists in grouped
        const matchKey = Object.keys(grouped).find(k => k === baseAddr || normAddr(k) === baseAddr);
        if (matchKey) {
          na = matchKey;
          un = trailingUnit[2].toUpperCase();
          mergeLog.push({ from: addr, to: grouped[matchKey].raw, reason: `"${trailingUnit[2].toUpperCase()}" extracted as unit` });
        }
      }
    }

    // Case 2: Address doesn't look like a real address (no street number — e.g. "Crestview B2")
    if (!grouped[na] && !isRealAddress(addr)) {
      // Try to find a matching property by partial name match
      const matchKey = Object.keys(grouped).find(k => {
        const raw = grouped[k].raw.toLowerCase();
        const addrLow = addr.toLowerCase().replace(/[.,#]/g, "");
        // Check if any word from the non-address appears in an existing property
        return addrLow.split(/\s+/).some(w => w.length > 3 && raw.includes(w));
      });
      if (matchKey) {
        // Try to extract unit+room from the non-address string
        const ur = parseUnitRoom(addr.replace(/[^A-Z0-9]/gi, ""));
        if (ur.unit) un = ur.unit;
        if (ur.room) rn = ur.room;
        mergeLog.push({ from: addr, to: grouped[matchKey].raw, reason: "Partial name match — not a full address" });
        na = matchKey;
      } else {
        // Can't match — flag it but still create the entry (PM will reassign)
        skipped.push({ line: row._line, reason: `"${addr}" doesn't look like a full address for "${name}". You can reassign this tenant in the review step.`, soft: true });
      }
    }

    // Case 3: Address matches an existing property after normalization with trailing stuff stripped
    if (!grouped[na]) {
      // Try stripping everything after the directional (NW/NE/SW/SE) + extra words
      const stripped = na.replace(/\s+(nw|ne|sw|se)\s+.*$/i, (m, dir) => " " + dir);
      if (stripped !== na) {
        const matchKey = Object.keys(grouped).find(k => k === stripped);
        if (matchKey) {
          // Whatever was after the directional might be a unit
          const extra = na.replace(stripped, "").trim();
          if (extra && /^[a-z]$/i.test(extra)) un = extra.toUpperCase();
          mergeLog.push({ from: addr, to: grouped[matchKey].raw, reason: `Stripped extra text after direction` });
          na = matchKey;
        }
      }
    }
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
        // Multiple tenants in same room: detect overlap vs sequential, auto-suggest mode
        let multiMode = null;
        if (tenants.length > 1) {
          const sorted = [...tenants].filter(t => t.moveIn).sort((a, b) => (a.moveIn || "").localeCompare(b.moveIn || ""));
          let hasOverlap = false;
          for (let ti = 0; ti < sorted.length - 1; ti++) {
            const curEnd = sorted[ti].leaseEnd;
            const nextStart = sorted[ti + 1].moveIn;
            if (curEnd && nextStart && curEnd !== "MTM" && curEnd > nextStart) { hasOverlap = true; break; }
            if (!curEnd && !nextStart) { hasOverlap = true; break; }
          }
          if (hasOverlap) {
            warnings.push({ type: "co-living", msg: `${tenants.length} tenants in ${rn} with overlapping leases` });
            multiMode = "co-tenant";
          } else {
            warnings.push({ type: "transition", msg: `${tenants.length} tenants in ${rn} with sequential leases` });
            multiMode = "sequential";
          }
        }
        if (existing) {
          for (const eu of (existing.units || [])) {
            const er = (eu.rooms || []).find(r => r.name.toLowerCase() === rn.toLowerCase());
            if (er?.tenant?.name && er.st === "occupied") warnings.push({ type: "occupied", msg: `${rn} occupied by ${er.tenant.name}` });
          }
        }
        unit.rooms.push({ _id: uid(), name: rn, tenants, warnings, multiMode });
      }
      prop.units.push(unit);
    });
    structure.push(prop);
  }
  return { structure, skipped, mergeLog };
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
  const [merges, setMerges] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editingSet, setEditingSet] = useState(new Set());
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
    if (!["csv", "xlsx", "xls"].includes(ext)) { setFileErr("Please upload a spreadsheet file (.csv, .xlsx, or .xls)."); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onerror = () => setFileErr("Failed to read file.");

    const handleParsed = ({ headers: h, rows }) => {
      if (!rows.length) { setFileErr("No data rows found."); return; }

      // Detect TurboTenant copy-paste format and pre-process
      if (isTurboTenantPaste(h)) {
        const processed = preprocessTurboTenantRows(rows, h);
        // Add virtual columns to headers
        const virtualHeaders = [...h, "_email", "_phone", "_address", "_unit", "_room"];
        setHeaders(virtualHeaders);
        setCsvRows(processed);
        setDirty(true);
        // Auto-map using virtual columns
        const ttMap = {
          name: "Name",
          email: "_email",
          phone: "_phone",
          propertyAddress: "_address",
          unit: "_unit",
          room: "_room",
        };
        setColMap(ttMap);
        const { structure: s, skipped: sk, mergeLog: ml } = buildStructure(processed, ttMap, props, uid, todayStr);
        setStructure(s); setSkipped(sk); setMerges(ml||[]); setStep(1);
        return;
      }

      setHeaders(h); setCsvRows(rows); setDirty(true);
      const am = autoMap(h);
      setColMap(am);
      if (am.name && am.propertyAddress) {
        const { structure: s, skipped: sk, mergeLog: ml } = buildStructure(rows, am, props, uid, todayStr);
        setStructure(s); setSkipped(sk); setMerges(ml||[]); setStep(1);
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
    const { structure: s, skipped: sk, mergeLog: ml } = buildStructure(csvRows, colMap, props, uid, todayStr);
    setStructure(s); setSkipped(sk); setMerges(ml||[]); setShowMapper(false); setStep(1);
  };

  // Counts
  const nProps = structure.length;
  const nUnits = structure.reduce((s, p) => s + p.units.length, 0);
  const nRooms = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.length, 0), 0);
  const nTenants = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).length, 0), 0), 0);
  const nWarn = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.warnings.filter(w => !(r.multiMode && (w.type === "co-living" || w.type === "transition"))).length, 0), 0), 0);
  const totalRent = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).reduce((s4, t) => s4 + (Number(t.rent) || 0), 0), 0), 0), 0);
  const totalSD = structure.reduce((s, p) => s + p.units.reduce((s2, u) => s2 + u.rooms.reduce((s3, r) => s3 + r.tenants.filter(t => !t.excluded).reduce((s4, t) => s4 + (parseRent(t.sd) || Number(t.rent) || 0), 0), 0), 0), 0);

  // Editing helpers
  const uProp = (pi, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, [f]: v } : x)); };
  const uUnit = (pi, ui, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, [f]: v } : u) } : x)); };
  const uRoom = (pi, ui, ri, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, [f]: v } : r) } : u) } : x)); };
  const uTen = (pi, ui, ri, ti, f, v) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, tenants: r.tenants.map((t, l) => l === ti ? { ...t, [f]: v } : t) } : r) } : u) } : x)); };
  const rmProp = pi => { setDirty(true); setStructure(p => p.filter((_, i) => i !== pi)); };
  const toggleSkip = (pi, ui, ri, ti) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, tenants: r.tenants.map((t, l) => l === ti ? { ...t, excluded: !t.excluded } : t) } : r) } : u) } : x)); };
  const addRoom = (pi, ui) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: [...u.rooms, { _id: uid(), name: "Bedroom " + (u.rooms.length + 1), tenants: [], warnings: [] }] } : u) } : x)); };

  // Add a new unit to a property
  const addUnit = (pi) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: [...x.units, { _id: uid(), name: "Unit " + String.fromCharCode(65 + x.units.length), label: String.fromCharCode(65 + x.units.length), rentalMode: "byRoom", rooms: [] }] } : x)); };

  // Delete a unit (moves tenants to skipped)
  const delUnit = (pi, ui) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.filter((_, j) => j !== ui) } : x)); };

  // Delete a room
  const delRoom = (pi, ui, ri) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.filter((_, k) => k !== ri) } : u) } : x)); };

  // Set multi-tenant mode for a room (co-tenant, sequential, separate) — toggle off if same mode clicked
  const setRoomMode = (pi, ui, ri, mode) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, multiMode: r.multiMode === mode ? null : mode } : r) } : u) } : x));
  };

  // Move a tenant to a different unit within the same property
  const moveTenantToUnit = (pi, fromUi, ri, ti, toUi) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => {
      if (i !== pi) return x;
      const units = JSON.parse(JSON.stringify(x.units));
      const tenant = { ...units[fromUi].rooms[ri].tenants[ti] };
      const roomName = units[fromUi].rooms[ri].name;
      // Remove tenant from source room
      units[fromUi].rooms[ri].tenants.splice(ti, 1);
      // Keep the room even if empty (PM might want the room structure)
      // Only remove if it was a single-tenant room and now truly empty
      if (units[fromUi].rooms[ri].tenants.length === 0) {
        // Mark as vacant instead of deleting
        // Keep the room — PM can delete it manually if they want
      }
      // Add to target unit — create a new room with the same name or next number
      const newRoomName = units[toUi].rooms.some(r => r.name === roomName)
        ? "Bedroom " + (units[toUi].rooms.length + 1)
        : roomName;
      units[toUi].rooms.push({ _id: uid(), name: newRoomName, tenants: [tenant], warnings: [] });
      return { ...x, units };
    }));
  };

  // Rename all rooms in a unit with a naming convention
  const applyRoomNaming = (pi, ui, convention) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => {
      if (i !== pi) return x;
      return { ...x, units: x.units.map((u, j) => {
        if (j !== ui) return u;
        return { ...u, rooms: u.rooms.map((r, k) => {
          // Check if this room is "Master" or "Primary Suite" — keep special names
          const isSpecial = /master|primary/i.test(r.name);
          if (isSpecial) return r;
          const num = k + 1;
          let newName;
          if (convention === "bedroom") newName = "Bedroom " + num;
          else if (convention === "br") newName = "BR" + num;
          else if (convention === "r") newName = "R" + num;
          else if (convention === "number") newName = String(num);
          else newName = r.name;
          return { ...r, name: newName };
        })};
      })};
    }));
  };

  // Set rent for all rooms in a unit
  const setUnitRent = (pi, ui, rent) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map(r => ({ ...r, tenants: r.tenants.map(t => ({ ...t, rent: Number(rent) || 0 })) })) } : u) } : x));
  };

  // Toggle owner-occupied on a unit
  const toggleOwnerOccupied = (pi, ui) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, ownerOccupied: !u.ownerOccupied } : u) } : x));
  };

  // Toggle private bath on a room
  const togglePrivateBath = (pi, ui, ri) => {
    setDirty(true);
    setStructure(p => p.map((x, i) => i === pi ? { ...x, units: x.units.map((u, j) => j === ui ? { ...u, rooms: u.rooms.map((r, k) => k === ri ? { ...r, privateBath: !r.privateBath } : r) } : u) } : x));
  };

  // Rename property address
  const renamePropAddr = (pi, newAddr) => { setDirty(true); setStructure(p => p.map((x, i) => i === pi ? { ...x, addr: newAddr } : x)); };
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
                const room = { id: uid(), name: rd.name, rent: 0, sqft: 0, pb: false, st: "vacant", le: "", tenant: null, desc: "", photos: [] };
                unit.rooms.push(room); rC++;
                addLog(`  Vacant room: ${rd.name}`);
                continue;
              }

              const mode = rd.multiMode || (active.length > 1 ? "separate" : null);
              const mkTenant = t => ({ name: t.name, email: t.email, phone: t.phone, moveIn: t.moveIn, gender: t.gender, occupationType: t.occupationType, doorCode: t.doorCode, notes: t.notes });

              if (mode === "co-tenant" && active.length > 1) {
                // Co-tenants: all share one room
                const primary = active[0];
                const rent = Number(primary.rent) || 0;
                const coTenants = active.slice(1).map(t => ({ ...mkTenant(t), rent: Number(t.rent) || 0, leaseEnd: t.leaseEnd }));
                let room = unit.rooms.find(r => r.name.toLowerCase() === rd.name.toLowerCase());
                if (!room) {
                  room = { id: uid(), name: rd.name, rent, sqft: 0, pb: false, st: "occupied", le: primary.leaseEnd || "", tenant: mkTenant(primary), coTenants, desc: "", photos: [] };
                  unit.rooms.push(room); rC++;
                } else {
                  room.rent = rent || room.rent; room.le = primary.leaseEnd || room.le; room.st = "occupied";
                  room.tenant = mkTenant(primary); room.coTenants = coTenants;
                }
                for (let ti = 0; ti < active.length; ti++) {
                  roomMap[`${pd._id}-${ud._id}-${rd._id}-${ti}`] = { id: room.id, addr: prop.addr || pd.addr, name: room.name, rent: Number(active[ti].rent) || 0, sd: parseRent(active[ti].sd) || Number(active[ti].rent) || 0 };
                  ok++; tick();
                }
                addLog(`  ${rd.name}: ${active.length} co-tenants (${active.map(t => t.name).join(", ")})`);

              } else if (mode === "sequential" && active.length > 1) {
                // Sequential: current tenant active, others archived
                const sorted = [...active].sort((a, b) => (a.moveIn || "").localeCompare(b.moveIn || ""));
                let currentIdx = sorted.length - 1;
                for (let si = 0; si < sorted.length; si++) {
                  const t = sorted[si];
                  if (t.moveIn && t.moveIn <= todayStr && (!t.leaseEnd || t.leaseEnd === "MTM" || t.leaseEnd >= todayStr)) { currentIdx = si; break; }
                }
                const current = sorted[currentIdx];
                const history = sorted.filter((_, si) => si !== currentIdx).map(t => ({ ...mkTenant(t), rent: Number(t.rent) || 0, leaseEnd: t.leaseEnd }));
                const rent = Number(current.rent) || 0;
                let room = unit.rooms.find(r => r.name.toLowerCase() === rd.name.toLowerCase());
                if (!room) {
                  room = { id: uid(), name: rd.name, rent, sqft: 0, pb: false, st: "occupied", le: current.leaseEnd || "", tenant: mkTenant(current), tenantHistory: history, desc: "", photos: [] };
                  unit.rooms.push(room); rC++;
                } else {
                  room.rent = rent || room.rent; room.le = current.leaseEnd || room.le; room.st = "occupied";
                  room.tenant = mkTenant(current); room.tenantHistory = history;
                }
                for (let ti = 0; ti < active.length; ti++) {
                  roomMap[`${pd._id}-${ud._id}-${rd._id}-${ti}`] = { id: room.id, addr: prop.addr || pd.addr, name: room.name, rent: Number(active[ti].rent) || 0, sd: parseRent(active[ti].sd) || Number(active[ti].rent) || 0 };
                  ok++; tick();
                }
                addLog(`  ${rd.name}: ${current.name} (current), ${history.length} archived`);

              } else {
                // Separate rooms (default): each tenant gets own room
                for (let ti = 0; ti < active.length; ti++) {
                  const t = active[ti];
                  const rent = Number(t.rent) || 0;
                  const sd = parseRent(t.sd) || rent;
                  let room = ti === 0 ? unit.rooms.find(r => r.name.toLowerCase() === rd.name.toLowerCase()) : null;
                  const roomName = ti === 0 ? rd.name : `${rd.name} (${t.name})`;
                  if (!room) {
                    room = { id: uid(), name: roomName, rent, sqft: 0, pb: false, st: "occupied", le: t.leaseEnd || "", tenant: mkTenant(t), desc: "", photos: [] };
                    unit.rooms.push(room); rC++;
                  } else {
                    room.rent = rent || room.rent; room.le = t.leaseEnd || room.le; room.st = "occupied";
                    room.tenant = mkTenant(t);
                  }
                  roomMap[`${pd._id}-${ud._id}-${rd._id}-${ti}`] = { id: room.id, addr: prop.addr || pd.addr, name: room.name, rent, sd };
                  ok++; tick();
                }
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
  const steps = ["Upload Spreadsheet", "Review & Confirm", "Importing"];

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
              <button onClick={downloadTemplate} style={{ ...btn, background: _ac, color: "#fff", border: "none", fontSize: 12 }}><IDl /> Download Template</button>
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
              <div style={{ fontSize: 12, color: "#7a7067", marginTop: 4 }}>Accepts .csv, .xlsx, and .xls — any spreadsheet format</div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={e => processFile(e.target.files?.[0])} style={{ display: "none" }} />
            </div>

            {/* Paste zone */}
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#7a7067", marginBottom: 8 }}>or paste directly from your browser</div>
              <textarea
                placeholder="Select rows in TurboTenant / AppFolio / any table → Ctrl+C → paste here"
                rows={3}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px dashed rgba(0,0,0,.12)", fontSize: 12, fontFamily: "inherit", color: "#1a1714", resize: "vertical", background: "rgba(0,0,0,.015)" }}
                onPaste={e => {
                  const text = e.clipboardData.getData("text");
                  if (!text || !text.includes("\t")) return; // not tab-separated
                  e.preventDefault();
                  // Parse tab-separated pasted data
                  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim());
                  if (lines.length < 2) { setFileErr("Paste needs at least a header row and one data row."); return; }
                  const parseRow = line => line.split("\t").map(c => c.trim());
                  const firstRowVals = parseRow(lines[0]);
                  let headers, dataStart;

                  // Detect if first row is data (no headers)
                  if (looksLikeData(firstRowVals)) {
                    headers = generateSyntheticHeaders(firstRowVals, firstRowVals.length);
                    dataStart = 0;
                  } else {
                    headers = firstRowVals;
                    dataStart = 1;
                  }

                  const rows = [];
                  for (let i = dataStart; i < lines.length; i++) {
                    const vals = parseRow(lines[i]);
                    if (vals.every(v => !v)) continue;
                    const row = {};
                    headers.forEach((h, j) => { row[h] = vals[j] || ""; });
                    row._line = i + 1;
                    rows.push(row);
                  }
                  if (!rows.length) { setFileErr("No data rows found in pasted content."); return; }
                  setFileName("Pasted data");
                  // Use the same handleParsed logic
                  if (isTurboTenantPaste(headers)) {
                    const processed = preprocessTurboTenantRows(rows, headers);
                    const virtualHeaders = [...headers, "_email", "_phone", "_address", "_unit", "_room"];
                    setHeaders(virtualHeaders); setCsvRows(processed); setDirty(true);
                    const ttMap = { name: "Name", email: "_email", phone: "_phone", propertyAddress: "_address", unit: "_unit", room: "_room" };
                    setColMap(ttMap);
                    const { structure: s, skipped: sk, mergeLog: ml } = buildStructure(processed, ttMap, props, uid, todayStr);
                    setStructure(s); setSkipped(sk); setMerges(ml||[]); setStep(1);
                  } else {
                    setHeaders(headers); setCsvRows(rows); setDirty(true);
                    const am = autoMap(headers);
                    setColMap(am);
                    if (am.name && am.propertyAddress) {
                      const { structure: s, skipped: sk, mergeLog: ml } = buildStructure(rows, am, props, uid, todayStr);
                      setStructure(s); setSkipped(sk); setMerges(ml||[]); setStep(1);
                    } else { setShowMapper(true); }
                  }
                }}
              />
            </div>

            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
              Works with TurboTenant, AppFolio, Buildium, Stessa, or any spreadsheet
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

            {/* Merge log */}
            {merges.length > 0 && (
              <div style={{ background: `rgba(${_acR},.05)`, border: `1px solid rgba(${_acR},.15)`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#5c4a3a" }}>
                <strong style={{ color: _ac }}>Auto-merged {merges.length} row{merges.length !== 1 ? "s" : ""}:</strong>
                {merges.map((m, i) => <div key={i} style={{ marginTop: 2, fontSize: 11 }}>"{m.from}" → <strong>{m.to}</strong> <span style={{ color: "#9ca3af" }}>({m.reason})</span></div>)}
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
                    <div style={{ flex: 1, minWidth: 0 }} onClick={e => e.stopPropagation()}>
                      <input value={prop.addr} onChange={e => renamePropAddr(pi, e.target.value)} style={{ fontSize: 14, fontWeight: 700, color: "#1a1714", border: "none", borderBottom: "1px dashed transparent", background: "transparent", padding: "1px 2px", width: "100%", fontFamily: "inherit" }} onFocus={e => { e.currentTarget.style.borderBottom = "1px dashed rgba(0,0,0,.2)"; }} onBlur={e => { e.currentTarget.style.borderBottom = "1px dashed transparent"; }} />
                      <div style={{ fontSize: 11, color: "#7a7067" }}>{prop.units.length} unit{prop.units.length !== 1 ? "s" : ""} · {pT} tenant{pT !== 1 ? "s" : ""}</div>
                    </div>
                    <select value={prop.type} onClick={e => e.stopPropagation()} onChange={e => uProp(pi, "type", e.target.value)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", minHeight: 32 }}>
                      {PTYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: prop.isExisting ? "rgba(45,106,63,.1)" : `rgba(${_acR},.1)`, color: prop.isExisting ? "#2d6a3f" : _ac }}>{prop.isExisting ? "EXISTS" : "NEW"}</span>
                    <button onClick={e => { e.stopPropagation(); rmProp(pi); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", padding: 6, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><IX /></button>
                  </div>

                  {/* Collapsed summary — tenant names by room */}
                  {!open && pT > 0 && (
                    <div style={{ padding: "6px 16px 8px", borderTop: "1px solid rgba(0,0,0,.04)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {prop.units.map((unit, ui) => unit.rooms.map((room, ri) => {
                        const active = room.tenants.filter(t => !t.excluded);
                        if (!active.length) return null;
                        return active.map((t, ti) => (
                          <span key={`${ui}-${ri}-${ti}`} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "rgba(0,0,0,.04)", color: "#1a1714", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 9, color: "#5c4a3a" }}>{room.name}</span>
                            <span style={{ color: "#5c4a3a" }}>{"\u00B7"}</span>
                            {t.name}
                            {t.rent > 0 && <span style={{ color: "#5c4a3a" }}>${t.rent}</span>}
                          </span>
                        ));
                      }))}
                    </div>
                  )}

                  {open && (
                    <div style={{ padding: "4px 16px 14px", borderTop: "1px solid rgba(0,0,0,.04)" }}>
                      {prop.units.map((unit, ui) => (
                        <div key={ui} style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                            <input value={unit.name} onChange={e => uUnit(pi, ui, "name", e.target.value)} onClick={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 700, color: "#5c4a3a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.15)", background: "transparent", padding: "2px 4px", width: 100, fontFamily: "inherit" }} />
                            <span style={{ fontSize: 11, color: "#5c4a3a" }}>{unit.rooms.length} room{unit.rooms.length !== 1 ? "s" : ""}</span>
                            {/* Room naming convention */}
                            <select onChange={e => { if (e.target.value) applyRoomNaming(pi, ui, e.target.value); e.target.value = ""; }} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a", minHeight: 28 }}>
                              <option value="">Rename rooms...</option>
                              <option value="bedroom">Bedroom 1, 2, 3...</option>
                              <option value="br">BR1, BR2, BR3...</option>
                              <option value="r">R1, R2, R3...</option>
                              <option value="number">1, 2, 3...</option>
                            </select>
                            {/* Bulk rent */}
                            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ fontSize: 10, color: "#5c4a3a", fontWeight: 600 }}>All $</span>
                              <input type="number" placeholder="rent" style={{ width: 50, fontSize: 10, padding: "2px 4px", border: "1px solid rgba(0,0,0,.08)", borderRadius: 4, fontFamily: "inherit" }}
                                onBlur={e => { if (e.target.value) { setUnitRent(pi, ui, e.target.value); e.target.value = ""; } }} onKeyDown={e => { if (e.key === "Enter" && e.target.value) { setUnitRent(pi, ui, e.target.value); e.target.value = ""; } }} />
                            </div>
                            {/* Owner-occupied toggle */}
                            <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: unit.ownerOccupied ? _ac : "#5c4a3a", cursor: "pointer", minHeight: 28, fontWeight: 600 }}>
                              <input type="checkbox" checked={!!unit.ownerOccupied} onChange={() => toggleOwnerOccupied(pi, ui)} /> Owner-occupied
                            </label>
                            {/* Delete unit */}
                            {prop.units.length > 1 && <button onClick={() => delUnit(pi, ui)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", fontSize: 9, padding: "2px 4px" }}><IX /></button>}
                          </div>

                          {unit.rooms.map((room, ri) => (
                            <div key={ri} style={{ marginLeft: 20, borderLeft: room.tenants.length > 1 ? `2px solid rgba(212,168,83,.4)` : `2px solid rgba(0,0,0,.08)`, marginBottom: room.tenants.length > 1 ? 10 : 3, paddingBottom: room.tenants.length > 1 ? 6 : 0, borderBottom: ri < unit.rooms.length - 1 ? "1px solid rgba(0,0,0,.06)" : "none" }}>
                              {/* Multi-tenant mode selector */}
                              {room.tenants.length > 1 && (
                                <div style={{ padding: "8px 12px", fontSize: 11, color: "#5c4a3a", background: "rgba(212,168,83,.06)", borderBottom: "1px solid rgba(212,168,83,.15)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <IW />
                                    <strong style={{ color: "#1a1714" }}>{room.tenants.length} tenants in {room.name}</strong>
                                  </div>
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                                    {[["co-tenant", "Co-tenants (share room)", "Couples or roommates sharing the same room"], ["sequential", "Sequential (one after other)", "One lease ends, next begins \u2014 current tenant stays active, others archived"], ["separate", "Separate rooms", "Creates a separate room entry for each tenant"]].map(([mode, label, tip]) => (
                                      <button key={mode} title={tip} onClick={() => setRoomMode(pi, ui, ri, mode)} style={{ ...btn, fontSize: 10, padding: "4px 12px", minHeight: 32, background: room.multiMode === mode ? _ac : "#fff", color: room.multiMode === mode ? "#fff" : "#1a1714", borderColor: room.multiMode === mode ? _ac : "rgba(0,0,0,.1)" }}>{label}</button>
                                    ))}
                                    <span style={{ fontSize: 10, color: "#7a7067", marginLeft: 4 }}>
                                      {room.multiMode === "co-tenant" ? "Both imported to same room as co-tenants" : room.multiMode === "sequential" ? "Current tenant active, past tenants archived" : room.multiMode === "separate" ? "Each tenant gets their own room" : "Choose how to handle"}
                                    </span>
                                  </div>
                                  {/* Mini Gantt timeline for sequential mode */}
                                  {room.multiMode === "sequential" && (() => {
                                    const active = room.tenants.filter(t => !t.excluded);
                                    const withDates = active.filter(t => t.moveIn || t.leaseEnd);
                                    if (!withDates.length) return <div style={{ fontSize: 10, color: "#5c4a3a", marginTop: 6, fontWeight: 600 }}>Add move-in / lease-end dates to see the timeline</div>;
                                    const ganttKey = `gantt-${pi}-${ui}-${ri}`;
                                    const ganttHidden = expanded[ganttKey] === false;
                                    const sorted = [...active].sort((a, b) => (a.moveIn || "").localeCompare(b.moveIn || ""));
                                    const allDates = [];
                                    for (const t of sorted) {
                                      if (t.moveIn && t.moveIn !== "MTM") allDates.push(t.moveIn);
                                      if (t.leaseEnd && t.leaseEnd !== "MTM") allDates.push(t.leaseEnd);
                                    }
                                    allDates.push(todayStr);
                                    allDates.sort();
                                    const minD = allDates[0];
                                    const maxD = allDates[allDates.length - 1];
                                    const toMs = d => new Date(d).getTime();
                                    const rangeMs = Math.max(toMs(maxD) - toMs(minD), 86400000);
                                    const pct = d => d ? Math.max(0, Math.min(100, ((toMs(d) - toMs(minD)) / rangeMs) * 100)) : 0;
                                    const todayPct = pct(todayStr);
                                    const fmtD = d => { if (!d || d === "MTM") return "MTM"; const p = d.split("-"); return p[1] + "/" + p[2] + "/" + p[0].slice(2); };
                                    const daysBetween = (a, b) => Math.round((toMs(b) - toMs(a)) / 86400000);
                                    // Bar colors matching TenantTimeline
                                    const getBarStyle = (t) => {
                                      const isPast = t.leaseEnd && t.leaseEnd !== "MTM" && t.leaseEnd < todayStr;
                                      const isUpcoming = t.moveIn && t.moveIn > todayStr;
                                      if (isPast) return { bg: "#FCA5A5", text: "#791F1F" };
                                      if (isUpcoming) return { bg: "#B5D4F4", text: "#0C447C" };
                                      return { bg: _ac, text: "#fff" };
                                    };
                                    // Find gaps AND overlaps between sequential tenants
                                    const gaps = [];
                                    const overlaps = [];
                                    for (let gi = 0; gi < sorted.length - 1; gi++) {
                                      const prevEnd = sorted[gi].leaseEnd;
                                      const nextStart = sorted[gi + 1].moveIn;
                                      if (prevEnd && nextStart && prevEnd !== "MTM" && nextStart !== "MTM") {
                                        if (prevEnd < nextStart) {
                                          gaps.push({ from: prevEnd, to: nextStart, days: daysBetween(prevEnd, nextStart) });
                                        } else if (prevEnd > nextStart) {
                                          overlaps.push({ from: nextStart, to: prevEnd, days: daysBetween(nextStart, prevEnd), tenantA: sorted[gi].name, tenantB: sorted[gi + 1].name });
                                        }
                                      }
                                    }
                                    return (
                                      <div style={{ marginTop: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: ganttHidden ? 0 : 6 }}>
                                          <button onClick={() => setExpanded(p => ({ ...p, [ganttKey]: ganttHidden }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "#5c4a3a", padding: "2px 0", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                                            <ICh open={!ganttHidden} /> Timeline
                                          </button>
                                          {/* Legend */}
                                          {!ganttHidden && <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                                            {[[_ac, "Current"], ["#FCA5A5", "Past"], ["#B5D4F4", "Upcoming"], ...(gaps.length ? [[`rgba(${_acR},.2)`, "Vacancy"]] : []), ...(overlaps.length ? [["rgba(196,92,74,.2)", "Overlap"]] : [])].map(([c, l]) => (
                                              <div key={l} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#5c4a3a" }}>
                                                <div style={{ width: 8, height: 8, borderRadius: 2, background: c, border: l === "Vacancy" ? `1px dashed ${_ac}` : l === "Overlap" ? "1px dashed #c45c4a" : "none", boxSizing: "border-box" }} />{l}
                                              </div>
                                            ))}
                                          </div>}
                                        </div>
                                        {!ganttHidden && <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 8, padding: "8px 10px" }}>
                                          {/* Gantt bars */}
                                          <div style={{ position: "relative", height: sorted.length * 30 + 14 }}>
                                            {/* Today marker */}
                                            <div style={{ position: "absolute", left: todayPct + "%", top: 0, bottom: 14, width: 1.5, background: "#c45c4a", zIndex: 3, opacity: .7 }} />
                                            <div style={{ position: "absolute", left: todayPct + "%", bottom: 0, transform: "translateX(-50%)", fontSize: 8, fontWeight: 700, color: "#c45c4a", whiteSpace: "nowrap" }}>today</div>
                                            {/* Gap zones */}
                                            {gaps.map((g, gi) => {
                                              const gLeft = pct(g.from);
                                              const gRight = pct(g.to);
                                              return <div key={"g" + gi} style={{ position: "absolute", left: gLeft + "%", width: Math.max(gRight - gLeft, 0.5) + "%", top: 0, bottom: 14, background: `rgba(${_acR},.08)`, border: `1px dashed rgba(${_acR},.3)`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 1 }}>
                                                {g.days > 7 && <span style={{ fontSize: 8, fontWeight: 700, color: _ac, whiteSpace: "nowrap" }}>{g.days}d gap</span>}
                                              </div>;
                                            })}
                                            {/* Overlap zones */}
                                            {overlaps.map((o, oi) => {
                                              const oLeft = pct(o.from);
                                              const oRight = pct(o.to);
                                              return <div key={"o" + oi} style={{ position: "absolute", left: oLeft + "%", width: Math.max(oRight - oLeft, 0.5) + "%", top: 0, bottom: 14, background: "rgba(196,92,74,.1)", border: "1px dashed rgba(196,92,74,.4)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 4 }}>
                                                <span style={{ fontSize: 8, fontWeight: 700, color: "#c45c4a", whiteSpace: "nowrap" }}>{o.days}d overlap</span>
                                              </div>;
                                            })}
                                            {/* Bars — click to open edit */}
                                            {sorted.map((t, ti) => {
                                              const start = t.moveIn && t.moveIn !== "MTM" ? pct(t.moveIn) : 0;
                                              const end = t.leaseEnd && t.leaseEnd !== "MTM" ? pct(t.leaseEnd) : 100;
                                              const bc = getBarStyle(t);
                                              const barW = Math.max(end - start, 2);
                                              const realTi = room.tenants.indexOf(t);
                                              const editKey = `${pi}-${ui}-${ri}-${realTi >= 0 ? realTi : ti}`;
                                              return (
                                                <div key={ti} onClick={() => setEditingSet(prev => { const next = new Set(prev); if (next.has(editKey)) next.delete(editKey); else next.add(editKey); return next; })} title={"Click to edit " + t.name} style={{ position: "absolute", top: ti * 30 + 2, left: start + "%", width: barW + "%", height: 24, zIndex: 2, cursor: "pointer" }}>
                                                  <div style={{ width: "100%", height: "100%", borderRadius: 4, background: bc.bg, display: "flex", alignItems: "center", padding: "0 6px", overflow: "hidden", transition: "filter .1s" }}
                                                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(.92)"; }} onMouseLeave={e => { e.currentTarget.style.filter = ""; }}>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: bc.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                      {t.name}{t.moveIn ? " \u00B7 " + fmtD(t.moveIn) : ""}{t.leaseEnd && t.leaseEnd !== "MTM" ? " \u2013 " + fmtD(t.leaseEnd) : t.leaseEnd === "MTM" ? " \u00B7 MTM" : ""}
                                                    </span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                          {/* Date summary rows */}
                                          <div style={{ borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 6, marginTop: 2 }}>
                                            {sorted.map((t, ti) => {
                                              const bc = getBarStyle(t);
                                              const isPast = t.leaseEnd && t.leaseEnd !== "MTM" && t.leaseEnd < todayStr;
                                              const isUpcoming = t.moveIn && t.moveIn > todayStr;
                                              const label = isPast ? "PAST" : isUpcoming ? "UPCOMING" : "CURRENT";
                                              const realTi = room.tenants.indexOf(t);
                                              return (
                                                <div key={ti} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#1a1714", lineHeight: "24px" }}>
                                                  <span style={{ width: 8, height: 8, borderRadius: 2, background: bc.bg, flexShrink: 0 }} />
                                                  <span onClick={() => { const k = `${pi}-${ui}-${ri}-${realTi >= 0 ? realTi : ti}`; setEditingSet(prev => { const next = new Set(prev); if (next.has(k)) next.delete(k); else next.add(k); return next; }); }} style={{ fontWeight: 600, minWidth: 80, cursor: "pointer", borderBottom: "1px dashed transparent" }} title={"Click to edit " + t.name}
                                                    onMouseEnter={e => { e.currentTarget.style.borderBottom = "1px dashed rgba(0,0,0,.2)"; }} onMouseLeave={e => { e.currentTarget.style.borderBottom = "1px dashed transparent"; }}>{t.name}</span>
                                                  <input type="date" value={t.moveIn || ""} onChange={e => uTen(pi, ui, ri, realTi >= 0 ? realTi : ti, "moveIn", e.target.value)} style={{ fontSize: 10, padding: "1px 4px", border: "1px solid rgba(0,0,0,.08)", borderRadius: 4, fontFamily: "inherit", width: 105, color: "#5c4a3a", minHeight: 24 }} title="Move-in date" />
                                                  <span style={{ color: "#5c4a3a" }}>{"\u2192"}</span>
                                                  <input type="date" value={t.leaseEnd === "MTM" ? "" : (t.leaseEnd || "")} onChange={e => uTen(pi, ui, ri, realTi >= 0 ? realTi : ti, "leaseEnd", e.target.value)} style={{ fontSize: 10, padding: "1px 4px", border: "1px solid rgba(0,0,0,.08)", borderRadius: 4, fontFamily: "inherit", width: 105, color: "#5c4a3a", minHeight: 24 }} title="Lease end date" />
                                                  <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 100, background: isPast ? "rgba(252,165,165,.3)" : isUpcoming ? "rgba(181,212,244,.3)" : `rgba(${_acR},.15)`, color: isPast ? "#791F1F" : isUpcoming ? "#0C447C" : _ac }}>{label}</span>
                                                </div>
                                              );
                                            })}
                                            {gaps.length > 0 && gaps.map((g, gi) => (
                                              <div key={"gl" + gi} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#5c4a3a", lineHeight: "20px" }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 2, background: `rgba(${_acR},.2)`, border: `1px dashed ${_ac}`, flexShrink: 0, boxSizing: "border-box" }} />
                                                <span style={{ fontWeight: 600, color: _ac }}>{g.days}-day vacancy gap</span>
                                                <span>{fmtD(g.from)} {"\u2192"} {fmtD(g.to)}</span>
                                              </div>
                                            ))}
                                            {overlaps.length > 0 && overlaps.map((o, oi) => (
                                              <div key={"ol" + oi} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#c45c4a", lineHeight: "20px" }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(196,92,74,.2)", border: "1px dashed #c45c4a", flexShrink: 0, boxSizing: "border-box" }} />
                                                <span style={{ fontWeight: 600 }}>{o.days}-day overlap</span>
                                                <span>{o.tenantA} {"\u00D7"} {o.tenantB}</span>
                                                <span style={{ color: "#5c4a3a" }}>{fmtD(o.from)} {"\u2192"} {fmtD(o.to)}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                              {room.tenants.map((t, ti) => {
                                const isEditing = editingSet.has(`${pi}-${ui}-${ri}`) || editingSet.has(`${pi}-${ui}-${ri}-${ti}`);
                                return (
                                <div key={ti} style={{ padding: "8px 12px", opacity: t.excluded ? 0.35 : 1, background: isEditing ? "rgba(0,0,0,.015)" : "transparent", borderRadius: isEditing ? 8 : 0, marginBottom: isEditing ? 4 : 0, border: isEditing ? "1px solid rgba(0,0,0,.06)" : "none" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  {ti === 0 ? <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <input value={room.name} onChange={e => uRoom(pi, ui, ri, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 600, color: "#1a1714", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 90, fontFamily: "inherit" }} />
                                    <select value="" onChange={e => { if (e.target.value) uRoom(pi, ui, ri, "name", e.target.value); }} style={{ fontSize: 9, padding: "2px 3px", border: "1px solid rgba(0,0,0,.1)", borderRadius: 3, color: "#5c4a3a", width: 16, minHeight: 20, cursor: "pointer", appearance: "none", textAlign: "center" }} title="Quick rename">
                                      <option value="">...</option>
                                      <option value="Master">Master</option>
                                      <option value="Primary Suite">Primary Suite</option>
                                      <option value={"Bedroom " + (ri + 1)}>Bedroom {ri + 1}</option>
                                      <option value={"BR" + (ri + 1)}>BR{ri + 1}</option>
                                    </select>
                                  </div>
                                    : <span style={{ width: 100, fontSize: 10, color: "#7a7067" }}>(shared room)</span>}
                                  <span style={{ fontSize: 12, color: "#5c4a3a" }}>—</span>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1714", flex: 1, display: "flex", alignItems: "center", gap: 6 }}>{t.name}{room.multiMode === "sequential" && room.tenants.length > 1 && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: (t.leaseEnd && t.leaseEnd !== "MTM" && t.leaseEnd < todayStr) ? "rgba(0,0,0,.05)" : `rgba(${_acR},.1)`, color: (t.leaseEnd && t.leaseEnd !== "MTM" && t.leaseEnd < todayStr) ? "#7a7067" : _ac }}>{(t.leaseEnd && t.leaseEnd !== "MTM" && t.leaseEnd < todayStr) ? "PAST" : (t.moveIn && t.moveIn > todayStr) ? "UPCOMING" : "CURRENT"}</span>}{room.multiMode === "co-tenant" && room.tenants.length > 1 && ti > 0 && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: `rgba(${_acR},.1)`, color: _ac }}>CO-TENANT</span>}</span>
                                  {t.email && <span style={{ fontSize: 10, color: "#7a7067" }}>{t.email}</span>}
                                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <span style={{ fontSize: 11, color: "#5c4a3a" }}>$</span>
                                    <input type="number" value={t.rent || ""} onChange={e => uTen(pi, ui, ri, ti, "rent", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: t.rent ? "#1a1714" : "#c45c4a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 55, fontFamily: "inherit", textAlign: "right" }} placeholder="0" />
                                    <span style={{ fontSize: 10, color: "#5c4a3a" }}>/mo</span>
                                  </div>
                                  {ti === 0 && room.warnings.filter(w => !(room.multiMode && (w.type === "co-living" || w.type === "transition"))).map((w, wi) => (
                                    <span key={wi} onClick={e => { e.stopPropagation(); setConfirmModal({ title: "Needs Review", body: w.msg, onConfirm: null }); }} style={{ fontSize: 9, fontWeight: 700, color: "#b8860b", background: "rgba(184,134,11,.08)", padding: "3px 8px", borderRadius: 100, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                                      <IW /> {w.type === "no-rent" ? "No rent" : w.type === "past-lease" ? "Expired" : w.type === "co-living" ? "Co-living" : w.type === "transition" ? "Transition" : w.type === "occupied" ? "Occupied" : "Review"}
                                    </span>
                                  ))}
                                  {t.sdAutoFilled && <span style={{ fontSize: 9, color: "#5c4a3a" }}>SD={fmtMoney(t.sd)}</span>}
                                  {/* Right-aligned: Skip + Delete + Edit */}
                                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#5c4a3a", cursor: "pointer", minHeight: 28, fontWeight: 600 }}>
                                      <input type="checkbox" checked={!!t.excluded} onChange={() => toggleSkip(pi, ui, ri, ti)} /> Skip
                                    </label>
                                    {ti === 0 && <button onClick={() => setEditingSet(prev => { const next = new Set(prev); const rk = `${pi}-${ui}-${ri}`; const anyOpen = next.has(rk) || room.tenants.some((_, i) => next.has(rk + "-" + i)); if (anyOpen) { next.delete(rk); room.tenants.forEach((_, i) => next.delete(rk + "-" + i)); } else { next.add(rk); } return next; })} style={{ ...btn, fontSize: 10, padding: "3px 10px", minHeight: 28 }}>{(editingSet.has(`${pi}-${ui}-${ri}`) || room.tenants.some((_, i) => editingSet.has(`${pi}-${ui}-${ri}-${i}`))) ? "Close" : "Edit"}</button>}
                                    {ti === 0 && <button onClick={() => { const tenantNames = room.tenants.filter(t => !t.excluded).map(t => t.name).join(", "); setConfirmModal({ title: "Delete " + room.name + "?", body: tenantNames ? tenantNames + " will be removed from import." : "This empty room will be removed.", onConfirm: () => delRoom(pi, ui, ri), danger: true }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", padding: "2px", minHeight: 28, minWidth: 28, display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete room"><IX /></button>}
                                  </div>
                                  </div>{/* close inner flex row */}
                                </div>
                              );})}

                              {/* Inline edit — show when room-level OR tenant-level key is in editingSet */}
                              {room.tenants.filter(t => !t.excluded).map((t, ti) => {
                                const origTi = room.tenants.indexOf(t);
                                const showEdit = editingSet.has(`${pi}-${ui}-${ri}`) || editingSet.has(`${pi}-${ui}-${ri}-${origTi}`);
                                if (!showEdit) return null;
                                return (
                                <div key={`e${ti}`} style={{ margin: "4px 12px 8px", padding: 12, background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
                                  {room.tenants.length > 1 && <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>{t.name}</div>}
                                  {/* Room + move options — available for every tenant */}
                                  <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                                    {ti === 0 && <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: room.privateBath ? _ac : "#5c4a3a", cursor: "pointer", fontWeight: 600 }}>
                                      <input type="checkbox" checked={!!room.privateBath} onChange={() => togglePrivateBath(pi, ui, ri)} /> Private Bath
                                    </label>}
                                    {prop.units.length > 1 && (
                                      <select value="" onChange={e => { if (e.target.value !== "") moveTenantToUnit(pi, ui, ri, ti, Number(e.target.value)); }} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a", minHeight: 28 }}>
                                        <option value="">Move to unit...</option>
                                        {prop.units.map((u2, ui2) => ui2 !== ui ? <option key={ui2} value={ui2}>{u2.name}</option> : null)}
                                      </select>
                                    )}
                                    {unit.rooms.length > 1 && (
                                      <select value="" onChange={e => { if (e.target.value !== "") { const toRi = Number(e.target.value); setDirty(true); setStructure(p => p.map((x, i) => { if (i !== pi) return x; const units = JSON.parse(JSON.stringify(x.units)); const tenant = { ...units[ui].rooms[ri].tenants[ti] }; units[ui].rooms[ri].tenants.splice(ti, 1); units[ui].rooms[toRi].tenants.push(tenant); return { ...x, units }; })); } }} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a", minHeight: 28 }}>
                                        <option value="">Move to room...</option>
                                        {unit.rooms.map((r2, ri2) => ri2 !== ri ? <option key={ri2} value={ri2}>{r2.name}</option> : null)}
                                      </select>
                                    )}
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                                    <div><label style={lbl}>Move-In</label><input type="date" value={t.moveIn || ""} onChange={e => uTen(pi, ui, ri, ti, "moveIn", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Lease End</label><input type="date" value={t.leaseEnd || ""} onChange={e => uTen(pi, ui, ri, ti, "leaseEnd", e.target.value)} style={fld} /></div>
                                    <div><label style={lbl}>Security Deposit</label><input type="number" value={t.sd || ""} onChange={e => uTen(pi, ui, ri, ti, "sd", e.target.value)} style={fld} placeholder="$" /></div>
                                    <div><label style={lbl}>Door Code</label><input value={t.doorCode || ""} onChange={e => uTen(pi, ui, ri, ti, "doorCode", e.target.value)} style={fld} /></div>
                                  </div>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginTop: 10 }}>
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
                              );
                              })}

                              {/* No tenants (vacant room) */}
                              {room.tenants.length === 0 && (
                                <div style={{ padding: "8px 12px", fontSize: 11, color: "#7a7067", fontStyle: "italic" }}>
                                  <input value={room.name} onChange={e => uRoom(pi, ui, ri, "name", e.target.value)} style={{ fontSize: 11, color: "#5c4a3a", border: "none", borderBottom: "1px dashed rgba(0,0,0,.1)", background: "transparent", padding: "1px 4px", width: 100, fontFamily: "inherit" }} /> — vacant
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Add vacant room */}
                          <button onClick={() => addRoom(pi, ui)} style={{ marginLeft: 20, marginTop: 4, background: "none", border: "1px dashed rgba(0,0,0,.1)", borderRadius: 6, padding: "4px 12px", fontSize: 11, color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, minHeight: 32, fontWeight: 600 }}>
                            <IPlus /> Add vacant room
                          </button>
                        </div>
                      ))}
                      {/* Add unit */}
                      <button onClick={() => addUnit(pi)} style={{ marginTop: 8, background: "none", border: "1px dashed rgba(0,0,0,.1)", borderRadius: 6, padding: "4px 12px", fontSize: 11, color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, minHeight: 32, fontWeight: 600 }}>
                        <IPlus /> Add unit
                      </button>
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
