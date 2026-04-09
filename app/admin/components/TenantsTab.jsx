"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { syncTenantToSupabase } from "@/lib/syncTenant";

/* ── Icons (flat SVG only) ────────────────────────────────── */
const IconSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7a7067" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX = () => <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>;
const IconExport = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const IconImport = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
const IconSort = ({ dir }) => <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d={dir === "asc" ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"}/></svg>;
const IconChevL = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>;
const IconChevR = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>;
const IconTrash = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const IconMail = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconFile = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

const MONO = "'SF Mono',Monaco,Consolas,monospace";
const PER_PAGE = 25;

/* [M6] Extracted outside render to avoid re-creating on each render */
function SortHdrCell({ col, sortCol, sortDir, toggleSort, hdrStyle, children }) {
  return (
    <div style={{ ...hdrStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, userSelect: "none" }} onClick={() => toggleSort(col)}>
      {children} {sortCol === col && <IconSort dir={sortDir} />}
    </div>
  );
}

export default function TenantsTab({
  allTenants, archive, props, settings, payments, obStatuses, renewalRequests,
  charges = [], uid, leases = [], maint = [],
  tenantSearch, setTenantSearch, tenantPropFilter, setTenantPropFilter,
  tenantSel, setTenantSel, drill, setDrill,
  setModal, setArchive, setProps, setCharges,
  setPayments, setMaint, setLeases, setNotifs, createCharge,
  setTenantProfileTab, setPiState,
  fmtD, fmtS, getPropDisplayName, TODAY, MO, onSmartImport,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acRgb = settings?.adminAccentRgb || "74,124,89";
  const tenantView = drill || "active";
  const TODAY_STR = TODAY.toISOString().split("T")[0];

  /* ── Local state ──────────────────────────────────────────── */
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [quickFilter, setQuickFilter] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importRows, setImportRows] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importStep, setImportStep] = useState(0); /* 0=upload, 1=preview/assign, 2=done */
  const [importResult, setImportResult] = useState(null); /* { ok: N, skipped: N, errors: [] } */
  const [importMappings, setImportMappings] = useState([]); /* [{ propId, unitId, roomId }] per row */
  const [dragOver, setDragOver] = useState(false);
  const [showNuke, setShowNuke] = useState(false);
  const [nukeConfirm, setNukeConfirm] = useState("");
  const [bulkMsg, setBulkMsg] = useState(null);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkErrs, setBulkErrs] = useState({});
  const [shaking, setShaking] = useState(false);
  const fileRef = useRef(null);
  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 500); };

  /* ── [C1] Balance calc — uses roomId as primary key, falls back to tenantName ── */
  const tenantBalance = useMemo(() => {
    const bal = {};
    (charges || []).forEach(c => {
      if (c.voided || c.deleted || c.waived) return;
      const owed = (c.amount || 0) - (c.amountPaid || 0);
      if (owed <= 0) return;
      if (c.roomId) bal[c.roomId] = (bal[c.roomId] || 0) + owed;
    });
    return bal;
  }, [charges]);

  /* ── Future tenants — moveIn > today ──────────────────────── */
  const futureTenants = useMemo(() => allTenants.filter(r => r.tenant?.moveIn && r.tenant.moveIn > TODAY_STR), [allTenants, TODAY_STR]);
  const activeTenantCount = allTenants.length - futureTenants.length;

  /* ── SD paid status for future tenants ─────────────────────── */
  const sdStatus = useMemo(() => {
    const map = {};
    (charges || []).forEach(c => {
      if (c.category !== "Security Deposit" || c.voided || c.deleted) return;
      if (!c.roomId) return;
      const paid = (c.amountPaid || 0) >= (c.amount || 0);
      map[c.roomId] = { paid, amount: c.amount || 0, amountPaid: c.amountPaid || 0 };
    });
    return map;
  }, [charges]);

  const leaseStatus = useCallback((r) => {
    if (!r?.le) return "month-to-month";
    const dl = Math.ceil((new Date(r.le + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24));
    if (dl < 0) return "expired";
    if (dl <= 30) return "expiring-30";
    if (dl <= 90) return "expiring-90";
    return "active";
  }, [TODAY]);

  /* ── Filtering ────────────────────────────────────────────── */
  const filteredActive = useMemo(() => {
    let list = allTenants.filter(r => {
      if (!r.tenant) return false;
      /* Exclude future tenants from active view */
      if (r.tenant.moveIn && r.tenant.moveIn > TODAY_STR) return false;
      if (tenantPropFilter !== "all" && r.propId !== tenantPropFilter) return false;
      if (tenantSearch) { const q = tenantSearch.toLowerCase(); if (![r.tenant?.name, r.tenant?.email, r.tenant?.phone, r.propName, r.name].some(v => (v || "").toLowerCase().includes(q))) return false; }
      return true;
    });
    if (quickFilter === "expiring") list = list.filter(r => { const s = leaseStatus(r); return s === "expiring-30" || s === "expiring-90" || s === "expired"; });
    if (quickFilter === "pastdue") list = list.filter(r => (tenantBalance[r.id] || 0) > 0);
    if (quickFilter === "noportal") list = list.filter(r => !obStatuses[(r.tenant?.email || "").toLowerCase()]);
    if (quickFilter === "new") list = list.filter(r => { if (!r.tenant?.moveIn) return false; const d = Math.ceil((TODAY - new Date(r.tenant.moveIn + "T00:00:00")) / (1e3 * 60 * 60 * 24)); return d >= 0 && d <= 90; });
    return list;
  }, [allTenants, tenantPropFilter, tenantSearch, quickFilter, leaseStatus, tenantBalance, obStatuses, TODAY]);

  /* ── Future tenants filtering ─────────────────────────────── */
  const filteredFuture = useMemo(() => {
    return futureTenants.filter(r => {
      if (tenantPropFilter !== "all" && r.propId !== tenantPropFilter) return false;
      if (tenantSearch) { const q = tenantSearch.toLowerCase(); if (![r.tenant?.name, r.tenant?.email, r.tenant?.phone, r.propName, r.name].some(v => (v || "").toLowerCase().includes(q))) return false; }
      return true;
    }).sort((a, b) => (a.tenant?.moveIn || "").localeCompare(b.tenant?.moveIn || ""));
  }, [futureTenants, tenantPropFilter, tenantSearch]);

  /* ── Sorting ──────────────────────────────────────────────── */
  const sortedActive = useMemo(() => {
    const arr = [...filteredActive];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let va, vb;
      if (sortCol === "name") { va = a.tenant?.name || ""; vb = b.tenant?.name || ""; return dir * va.localeCompare(vb); }
      if (sortCol === "rent") { va = a.rent || 0; vb = b.rent || 0; return dir * (va - vb); }
      if (sortCol === "balance") { va = tenantBalance[a.id] || 0; vb = tenantBalance[b.id] || 0; return dir * (va - vb); }
      if (sortCol === "leaseEnd") { va = a.le || "9999"; vb = b.le || "9999"; return dir * va.localeCompare(vb); }
      if (sortCol === "moveIn") { va = a.tenant?.moveIn || ""; vb = b.tenant?.moveIn || ""; return dir * va.localeCompare(vb); }
      if (sortCol === "property") { va = a.propName || ""; vb = b.propName || ""; return dir * va.localeCompare(vb); }
      return 0;
    });
    return arr;
  }, [filteredActive, sortCol, sortDir, tenantBalance]);

  /* ── [C2] Pagination — fix setPage during render, use useEffect ── */
  const totalPages = Math.max(1, Math.ceil(sortedActive.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  useEffect(() => { if (safePage !== page && page > 0) setPage(safePage); }, [safePage, page]);
  const pageRows = sortedActive.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);

  /* ── Archive ──────────────────────────────────────────────── */
  const pastTenants = archive.filter(a => !a.isArchived);
  const archivedTenants = archive.filter(a => a.isArchived);
  /* [M5] Archive filter — match by propId if available, fall back to display name */
  const filterArchiveList = (list) => list.filter(a => {
    if (tenantPropFilter !== "all") {
      if (a.propId) { if (a.propId !== tenantPropFilter) return false; }
      else { const p = props.find(p => (p.addr || p.name) === a.propName || p.name === a.propName); if (!p || p.id !== tenantPropFilter) return false; }
    }
    if (tenantSearch) { const q = tenantSearch.toLowerCase(); if (![a.name, a.email, a.propName, a.roomName].some(v => (v || "").toLowerCase().includes(q))) return false; }
    return true;
  });
  const filteredPast = filterArchiveList(pastTenants);
  const filteredArchived = filterArchiveList(archivedTenants);
  const filteredArchive = tenantView === "archived" ? filteredArchived : filteredPast;
  const allSelected = tenantView === "active" && tenantSel.length === pageRows.length && pageRows.length > 0;
  const archiveTenant = (id) => setArchive(p => p.map(a => a.id === id ? { ...a, isArchived: true } : a));
  const unarchiveTenant = (id) => setArchive(p => p.map(a => a.id === id ? { ...a, isArchived: false } : a));

  /* ── Timezone ─────────────────────────────────────────────── */
  const tz = settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzShort = useMemo(() => { try { return new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: tz }).format(new Date()).split(" ").pop(); } catch { return ""; } }, [tz]);
  const fmtLastActive = (iso) => { if (!iso) return null; try { return new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }).format(new Date(iso)); } catch { return iso; } };

  /* ── Sort toggle ──────────────────────────────────────────── */
  const toggleSort = useCallback((col) => { setSortCol(prev => { if (prev === col) { setSortDir(d => d === "asc" ? "desc" : "asc"); return prev; } setSortDir("asc"); return col; }); setPage(0); }, []);

  /* ── Quick filter counts ──────────────────────────────────── */
  const qfCounts = useMemo(() => {
    let expiring = 0, pastdue = 0, noportal = 0, newT = 0;
    allTenants.forEach(r => {
      if (!r.tenant) return;
      if (r.tenant.moveIn && r.tenant.moveIn > TODAY_STR) return; /* skip future */
      const s = leaseStatus(r);
      if (s === "expiring-30" || s === "expiring-90" || s === "expired") expiring++;
      if ((tenantBalance[r.id] || 0) > 0) pastdue++;
      if (!obStatuses[(r.tenant?.email || "").toLowerCase()]) noportal++;
      if (r.tenant?.moveIn) { const d = Math.ceil((TODAY - new Date(r.tenant.moveIn + "T00:00:00")) / (1e3 * 60 * 60 * 24)); if (d >= 0 && d <= 90) newT++; }
    });
    return { expiring, pastdue, noportal, new: newT };
  }, [allTenants, leaseStatus, tenantBalance, obStatuses, TODAY]);

  /* ── [C3] CSV Export — fixed duplicate column, added lease start ── */
  const exportCSV = () => {
    const header = ["Name","Email","Phone","Property","Unit/Room","Rent","Move-In","Lease End","Balance","Payment Status","Portal Status","Lease Status"];
    const rows = (tenantView === "active" ? filteredActive : filteredArchive).map(r => {
      const t = r.tenant || r;
      const name = t.name || r.name || "";
      const email = t.email || r.email || "";
      const phone = t.phone || r.phone || "";
      const bal = tenantBalance[r.id] || 0;
      const pd = (payments[r.id] && payments[r.id][MO]) || 0;
      const ob = obStatuses[(email).toLowerCase()];
      return [name, email, phone, r.propName || "", r.name || r.roomName || "", r.rent || 0, t.moveIn || r.moveIn || "", r.le || r.leaseEnd || "", bal, pd ? "Paid" : "Unpaid", ob ? "Connected" : "Not invited", leaseStatus(r)];
    });
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tenants-" + TODAY.toISOString().split("T")[0] + ".csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── CSV Import ────────────────────────────────────────────── */
  const downloadTemplate = () => {
    const header = "Name,Email,Phone,Rent,Lease End (YYYY-MM-DD),Move-In (YYYY-MM-DD),Security Deposit,Notes";
    const example = "John Smith,john@email.com,(555) 555-1234,850,2026-08-01,2025-08-01,850,";
    const csv = header + "\n" + example;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tenant-import-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* [M2] Improved CSV parser — handles quoted fields with commas */
  const parseCSV = (text) => {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));
    if (lines.length < 2) return [];
    const parseLine = (line) => {
      const result = []; let current = ""; let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { if (inQuotes && line[i + 1] === '"') { current += '"'; i++; } else { inQuotes = !inQuotes; } }
        else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ""; }
        else { current += ch; }
      }
      result.push(current.trim());
      return result;
    };
    const headers = parseLine(lines[0]);
    return lines.slice(1).map(line => {
      const vals = parseLine(line);
      const row = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ""; });
      return row;
    });
  };

  const processImportFile = (file) => {
    if (!file) return;
    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      setImportRows(rows);
      const mappings = rows.map(row => {
        const prop = fuzzyFind(props, row["Property"] || "", p => p.addr || p.name || "");
        const units = prop ? (prop.units || []) : [];
        const unit = fuzzyFind(units, row["Unit"] || "", u => u.name || "");
        const rooms = unit ? (unit.rooms || []) : [];
        const room = fuzzyFind(rooms, row["Room"] || row["Unit/Room"] || "", r => r.name || "");
        return { propId: prop?.id || "", unitId: unit?.id || "", roomId: room?.id || "" };
      });
      setImportMappings(mappings);
      setImportStep(1);
      setImportResult(null);
    };
    reader.readAsText(file);
  };
  const handleImportFile = (e) => processImportFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) processImportFile(file);
  };

  /* Fuzzy match helper — normalizes then tries exact, then stripped, then closest */
  const normalize = (s) => (s || "").trim().toLowerCase();
  const strip = (s) => normalize(s).replace(/[\s\-_.,#]+/g, "");
  const fuzzyFind = (list, input, getName) => {
    const inp = normalize(input);
    if (!inp) return null;
    /* 1) Exact (case-insensitive) */
    const exact = list.find(x => normalize(getName(x)) === inp);
    if (exact) return exact;
    /* 2) Stripped match — ignore spaces, dashes, punctuation */
    const inpStripped = strip(input);
    const stripped = list.find(x => strip(getName(x)) === inpStripped);
    if (stripped) return stripped;
    /* 3) Starts-with or contains */
    const starts = list.find(x => normalize(getName(x)).startsWith(inp) || inp.startsWith(normalize(getName(x))));
    if (starts) return starts;
    const contains = list.find(x => normalize(getName(x)).includes(inp) || inp.includes(normalize(getName(x))));
    if (contains) return contains;
    return null;
  };
  /* [C4][X1][X2][X3][M3] Import — immutable update, creates charges, syncs Supabase, shows errors */
  const executeImport = () => {
    if (!importRows.length) return;
    let okCount = 0;
    const errors = [];
    const todayStr = TODAY.toISOString().split("T")[0];

    setProps(prev => {
      /* Deep clone to avoid mutation [C4] */
      const updated = JSON.parse(JSON.stringify(prev));
      importRows.forEach((row, idx) => {
        const m = importMappings[idx] || {};
        const prop = updated.find(p => p.id === m.propId);
        if (!prop) { errors.push(`Row ${idx + 1}: No property selected for "${row["Name"] || "Unnamed"}"`); return; }
        const unit = (prop.units || []).find(u => u.id === m.unitId);
        if (!unit) { errors.push(`Row ${idx + 1}: No unit selected for "${row["Name"] || "Unnamed"}"`); return; }
        const isWhole = (unit.rentalMode || "byRoom") === "wholeHouse";
        const room = isWhole ? (unit.rooms || [])[0] : (unit.rooms || []).find(r => r.id === m.roomId);
        if (!room) { errors.push(`Row ${idx + 1}: No room selected for "${row["Name"] || "Unnamed"}"`); return; }
        const tenantData = { name: row["Name"] || "", email: row["Email"] || "", phone: row["Phone"] || "", moveIn: row["Move-In (YYYY-MM-DD)"] || row["Move-In"] || "" };
        room.tenant = tenantData;
        room.rent = Number(row["Rent"]) || room.rent || 0;
        room.le = row["Lease End (YYYY-MM-DD)"] || row["Lease End"] || "";
        room.st = "occupied";
        if (createCharge && tenantData.name) {
          const mk = (tenantData.moveIn || todayStr).slice(0, 7);
          createCharge({ roomId: room.id, tenantName: tenantData.name, propName: prop.addr || prop.name, roomName: room.name, category: "Rent", desc: mk + " Rent", amount: room.rent, dueDate: mk + "-01", sent: false, sentDate: todayStr });
        }
        syncTenantToSupabase({ name: tenantData.name, email: tenantData.email, phone: tenantData.phone, moveIn: tenantData.moveIn, leaseEnd: room.le, rent: room.rent, sd: Number(row["Security Deposit"]) || 0, propName: prop.addr || prop.name, roomName: room.name, doorCode: "", appDataRoomId: room.id, charges }).catch(() => {});
        okCount++;
      });
      return updated;
    });
    /* [X3] Notification */
    if (setNotifs && okCount > 0) {
      setNotifs(p => [{ id: uid ? uid() : "imp-" + Date.now(), type: "lease", msg: `Imported ${okCount} tenant${okCount !== 1 ? "s" : ""} via CSV`, date: TODAY.toISOString().split("T")[0], read: false, urgent: false }, ...(p || [])]);
    }
    setImportResult({ ok: okCount, skipped: errors.length, errors });
    setImportStep(2);
  };

  /* ── [C5][X4][X5][X6] Nuke — only clears tenant-related data, clears all connected state ── */
  const nukeAllTenants = () => {
    /* Clear tenant from rooms */
    setProps(prev => prev.map(p => ({
      ...p,
      units: (p.units || []).map(u => ({
        ...u,
        rooms: (u.rooms || []).map(r => ({ ...r, tenant: null, st: "vacant", le: "" }))
      }))
    })));
    /* [C5] Only clear tenant-related charges (Rent, Late Fee, Security Deposit, etc.) — keep expense-like charges */
    setCharges(prev => (prev || []).filter(c => !c.roomId));
    setArchive([]);
    /* [X6] Clear payments */
    if (setPayments) setPayments({});
    /* [X5] Clear maintenance tied to rooms */
    if (setMaint) setMaint(prev => (prev || []).filter(m => !m.roomId));
    /* [X4] Cancel draft/pending leases (keep executed for records) */
    if (setLeases) setLeases(prev => (prev || []).map(l => (l.status === "draft" || l.status === "pending_tenant" || l.status === "pending_landlord") ? { ...l, status: "cancelled" } : l));
    if (setNotifs) setNotifs(p => [{ id: uid ? uid() : "nuke-" + Date.now(), type: "system", msg: "All tenant data has been reset", date: TODAY.toISOString().split("T")[0], read: false, urgent: false }, ...(p || [])]);
    setShowNuke(false);
    setNukeConfirm("");
  };

  /* ── [C6] Bulk invite — collect all, then open one modal with queue info ── */
  const openBulkInvite = () => {
    const uninvited = filteredActive.filter(r => tenantSel.includes(r.id) && r.tenant?.email && !obStatuses[(r.tenant.email || "").toLowerCase()]);
    if (!uninvited.length) return;
    /* Open first invite; user can cycle through or we batch them */
    const first = uninvited[0];
    setPiState("idle");
    setModal({ type: "sendPortalInviteApp", data: { ...first.tenant, id: first.id, name: first.tenant.name, email: first.tenant.email, property: first.propName, room: first.name }, _bulkQueue: uninvited.slice(1).map(r => ({ ...r.tenant, id: r.id, name: r.tenant.name, email: r.tenant.email, property: r.propName, room: r.name })), _bulkTotal: uninvited.length });
  };

  /* ── [M1] Bulk message — actually sends via Resend API ── */
  const openBulkMessage = () => {
    const selected = filteredActive.filter(r => tenantSel.includes(r.id) && r.tenant?.email);
    if (!selected.length) return;
    setBulkMsg({ emails: selected.map(r => r.tenant.email), names: selected.map(r => r.tenant.name), count: selected.length });
    setBulkSubject(""); setBulkBody(""); setBulkSending(false);
  };

  const sendBulkMessage = async () => {
    if (!bulkMsg || !bulkSubject.trim() || !bulkBody.trim()) return;
    setBulkSending(true);
    try {
      for (const email of bulkMsg.emails) {
        await fetch("/api/send-email", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email, subject: bulkSubject,
            fromName: (settings?.pmName || "Property Manager") + " | " + (settings?.companyName || "Black Bear Rentals"),
            replyTo: settings?.pmEmail || settings?.email || "info@rentblackbear.com",
            html: `<div style="font-family:sans-serif;font-size:14px;color:#333;line-height:1.6">${bulkBody.replace(/\n/g, "<br>")}</div>`,
          }),
        });
      }
      if (setNotifs) {
        setNotifs(p => [{ id: uid ? uid() : "msg-" + Date.now(), type: "message", msg: `Bulk message sent to ${bulkMsg.count} tenant${bulkMsg.count !== 1 ? "s" : ""}: "${bulkSubject}"`, date: TODAY.toISOString().split("T")[0], read: false, urgent: false }, ...(p || [])]);
      }
    } catch (e) { console.error("Bulk message error:", e); }
    setBulkSending(false);
    setBulkMsg(null);
    setTenantSel([]);
  };

  /* ── Styles ────────────────────────────────────────────────── */
  const COLS = "40px 1fr 160px 120px 100px 160px";
  const HDR = { fontSize: 10, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .7 };
  const chipS = (active) => ({ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: active ? `1px solid ${_ac}` : "1px solid rgba(0,0,0,.1)", background: active ? `rgba(${_acRgb},.1)` : "#fff", color: active ? _ac : "#6b5e52", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" });
  const btnSm = { fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", background: "#fff", color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", display: "inline-flex", alignItems: "center", gap: 4 };
  const leaseColor = (s) => s === "expired" ? "#dc2626" : s === "expiring-30" ? "#c45c4a" : s === "expiring-90" ? "#d4a853" : s === "month-to-month" ? "#6b5e52" : "#2d6a3f";

  /* [D1] Payment badge — shows context beyond just current month */
  const payBadge = (r) => {
    const bal = tenantBalance[r.id] || 0;
    const pd = (payments[r.id] && payments[r.id][MO]) || 0;
    if (bal > 0 && !pd) return { label: "Past Due", cls: "b-red" };
    if (bal > 0 && pd) return { label: "Partial", cls: "b-gold" };
    if (pd) return { label: "Paid", cls: "b-green" };
    return { label: "Unpaid", cls: "b-red" };
  };

  return (<>

    {/* ═══ Browser-tab header ═══ */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 0, flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
        {[["active", "Active", activeTenantCount], ["future", "Future", futureTenants.length], ["archive", "Past", pastTenants.length], ["archived", "Archived", archivedTenants.length]].map(([v, l, c]) => {
          const on = tenantView === v;
          return (
            <button key={v} onClick={() => { setDrill(v === "active" ? null : v); setTenantSel([]); setPage(0); setQuickFilter(null); }}
              style={{ padding: "10px 22px", border: "1px solid rgba(0,0,0,.1)", borderBottom: on ? "none" : "1px solid rgba(0,0,0,.1)", borderRadius: "8px 8px 0 0", marginRight: 4, background: on ? "#fff" : "rgba(0,0,0,.04)", color: on ? "#1a1714" : "#7a7067", fontWeight: on ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", position: "relative", zIndex: on ? 2 : 1, boxShadow: on ? "0 -2px 0 0 " + _ac + " inset" : "none" }}>
              {l} <span style={{ fontSize: 11, fontWeight: 400, opacity: .7 }}>({c})</span>
            </button>);
        })}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
        <button style={btnSm} onClick={() => onSmartImport ? onSmartImport() : null}><IconImport /> Import</button>
        <button style={btnSm} onClick={exportCSV}><IconExport /> Export</button>
        <button className="btn btn-green btn-sm" onClick={() => setModal({ type: "addExistingTenant", propId: "", unitId: "", roomId: "", form: { name: "", email: "", phone: "", moveIn: TODAY.toISOString().split("T")[0], leaseEnd: "", rent: "", sd: "", doorCode: "", notes: "", gender: "", occupationType: "" } })}>+ Add Tenant</button>
      </div>
    </div>

    {/* ═══ Table card ═══ */}
    <div className="card" style={{ borderRadius: "0 8px 8px 8px", marginBottom: 14, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 200px)", overflow: "hidden" }}><div className="card-bd" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>

      {/* Search + filter + quick filters */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(0,0,0,.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: tenantView === "active" ? 8 : 0 }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <div style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><IconSearch /></div>
            <input value={tenantSearch} onChange={e => { setTenantSearch(e.target.value); setPage(0); }} placeholder="Search name, email or phone..." style={{ width: "100%", padding: "6px 10px 6px 28px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit" }} />
          </div>
          <select value={tenantPropFilter} onChange={e => { setTenantPropFilter(e.target.value); setPage(0); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit", background: "#fff" }}>
            <option value="all">All Properties</option>
            {props.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
          </select>
          {tenantSel.length > 0 && <>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a" }}>{tenantSel.length} selected</span>
            <button style={btnSm} onClick={openBulkMessage}><IconMail /> Message</button>
            <button style={btnSm} onClick={openBulkInvite}>Portal Invite</button>
            <button style={{ ...btnSm, color: "#6b5e52" }} onClick={() => setTenantSel([])}>Clear</button>
          </>}
        </div>
        {tenantView === "active" && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {[
              ["expiring", `Expiring Soon (${qfCounts.expiring})`],
              ["pastdue", `Past Due (${qfCounts.pastdue})`],
              ["noportal", `No Portal (${qfCounts.noportal})`],
              ["new", `New (${qfCounts.new})`],
            ].map(([k, l]) => (
              <button key={k} style={chipS(quickFilter === k)} onClick={() => { setQuickFilter(quickFilter === k ? null : k); setPage(0); }}>{l}</button>
            ))}
            {(quickFilter || tenantSearch || tenantPropFilter !== "all") && (
              <button style={{ ...chipS(false), color: "#9ca3af", fontSize: 9 }} onClick={() => { setQuickFilter(null); setTenantSearch(""); setTenantPropFilter("all"); setPage(0); }}>Clear all</button>
            )}
          </div>
        )}
      </div>

      {/* ═══ Column headers (active) ═══ */}
      {tenantView === "active" && (
        <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "8px 16px", borderBottom: "1px solid rgba(0,0,0,.08)", background: "rgba(0,0,0,.02)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type="checkbox" checked={allSelected} ref={el => { if (el) el.indeterminate = tenantSel.length > 0 && !allSelected; }} onChange={e => setTenantSel(e.target.checked ? pageRows.map(r => r.id) : [])} style={{ width: 14, height: 14, cursor: "pointer" }} />
          </div>
          <SortHdrCell col="name" sortCol={sortCol} sortDir={sortDir} toggleSort={toggleSort} hdrStyle={HDR}>Tenant</SortHdrCell>
          <div style={HDR}>Contact</div>
          <SortHdrCell col="rent" sortCol={sortCol} sortDir={sortDir} toggleSort={toggleSort} hdrStyle={HDR}>Rent</SortHdrCell>
          <SortHdrCell col="balance" sortCol={sortCol} sortDir={sortDir} toggleSort={toggleSort} hdrStyle={HDR}>Balance</SortHdrCell>
          <div style={HDR}>Portal <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 9 }}>({tzShort})</span></div>
        </div>
      )}

      {/* ═══ Future column headers ═══ */}
      {tenantView === "future" && (
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 160px 100px 120px 160px", padding: "8px 16px", borderBottom: "1px solid rgba(0,0,0,.08)", background: "rgba(0,0,0,.02)", flexShrink: 0 }}>
          <div />
          <div style={HDR}>Tenant</div>
          <div style={HDR}>Contact</div>
          <div style={HDR}>Rent</div>
          <div style={HDR}>Move-In</div>
          <div style={HDR}>Security Deposit</div>
        </div>
      )}

      {/* ═══ Archive column headers ═══ */}
      {(tenantView === "archive" || tenantView === "archived") && (
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 160px 150px 160px", padding: "8px 16px", borderBottom: "1px solid rgba(0,0,0,.08)", background: "rgba(0,0,0,.02)", flexShrink: 0 }}>
          <div />
          <div style={HDR}>Tenant</div>
          <div style={HDR}>Contact</div>
          <div style={HDR}>Rent</div>
          <div style={HDR}>{tenantView === "archived" ? "Archived" : "Actions"}</div>
        </div>
      )}

      {/* ═══ Scrollable rows area ═══ */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

      {/* ═══ Active rows ═══ */}
      {tenantView === "active" && <>{pageRows.map(r => {
        if (!r.tenant) return null;
        const dl = r.le ? Math.ceil((new Date(r.le + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24)) : null;
        const bal = tenantBalance[r.id] || 0;
        const ls = leaseStatus(r);
        const pb = payBadge(r);
        const sel = tenantSel.includes(r.id);
        const prop = props.find(p => p.id === r.propId);
        const ob = obStatuses[(r.tenant?.email || "").toLowerCase()];
        const lastActive = ob?.lastActive || null;
        /* [D2] Find lease for this tenant */
        const tLease = leases.find(l => l.tenantEmail === r.tenant?.email || l.tenantName === r.tenant?.name);
        return (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: COLS, padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,.05)", background: sel ? "rgba(74,124,89,.06)" : "#fff", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = sel ? "rgba(74,124,89,.08)" : "rgba(0,0,0,.03)"; e.currentTarget.style.boxShadow = "inset 3px 0 0 " + _ac; }}
            onMouseLeave={e => { e.currentTarget.style.background = sel ? "rgba(74,124,89,.06)" : "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            onClick={() => { setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); }}>
            <div style={{ display: "flex", alignItems: "center" }} onClick={e => e.stopPropagation()}>
              <input type="checkbox" checked={sel} onChange={e => setTenantSel(p => e.target.checked ? [...p, r.id] : p.filter(x => x !== r.id))} style={{ width: 14, height: 14, cursor: "pointer" }} />
            </div>
            {/* Tenant */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 1, display: "flex", alignItems: "center", gap: 6 }}>
                {r.tenant.name}
                {renewalRequests.some(rr => rr.tenant_name === r.tenant.name && !rr.read) && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: "rgba(212,168,83,.15)", color: "#9a7422", whiteSpace: "nowrap" }}>RENEWAL REQUEST</span>}
              </div>
              <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 3 }}>{prop ? getPropDisplayName(prop) : r.propName} · {r.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: leaseColor(ls) }}>
                  {ls === "active" ? (r.le ? `Lease to ${fmtD(r.le)}` : "Active") : ls === "month-to-month" ? "Month-to-month" : ls === "expired" ? "Lease expired" : dl !== null ? `Expires ${dl}d` : ls}
                </span>
                {/* [D2] Lease quick link */}
                {tLease && tLease.status === "executed" && (
                  <button onClick={e => { e.stopPropagation(); setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); }} style={{ fontSize: 9, fontWeight: 600, color: _ac, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 2 }}><IconFile /> Lease</button>
                )}
              </div>
            </div>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "#3b82f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.tenant.email || "\u2014"}</div>
              <div style={{ fontSize: 11, color: "#5c4a3a" }}>{r.tenant.phone || "\u2014"}</div>
            </div>
            {/* [D1] Rent — improved badge */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", fontFamily: MONO }}>{fmtS(r.rent)}<span style={{ fontSize: 9, fontWeight: 400, color: "#7a7067" }}>/mo</span></div>
              <span className={`badge ${pb.cls}`} style={{ alignSelf: "flex-start", fontSize: 9 }}>{pb.label}</span>
            </div>
            {/* Balance */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              {bal > 0
                ? <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", fontFamily: MONO }}>{fmtS(bal)}</div>
                : <div style={{ fontSize: 11, color: "#2d6a3f", fontWeight: 600 }}>Clear</div>}
            </div>
            {/* Portal */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              {ob ? (
                <>
                  <span className="badge b-green" style={{ alignSelf: "flex-start", fontSize: 9 }}>Connected</span>
                  {lastActive ? <div style={{ fontSize: 9, color: "#5c4a3a" }}>{fmtLastActive(lastActive)}</div> : <div style={{ fontSize: 9, color: "#7a7067" }}>Never logged in</div>}
                </>
              ) : (
                <>
                  <span className="badge b-gray" style={{ alignSelf: "flex-start", fontSize: 9 }}>Not invited</span>
                  {r.tenant?.email && <button onClick={e => { e.stopPropagation(); setPiState("idle"); setModal({ type: "sendPortalInviteApp", data: { ...r.tenant, id: r.id, name: r.tenant.name, email: r.tenant.email, property: r.propName, room: r.name } }); }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(74,124,89,.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(74,124,89,.08)"}
                    style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(74,124,89,.25)", background: "rgba(74,124,89,.08)", color: "#4a7c59", cursor: "pointer", fontFamily: "inherit", transition: "background .12s" }}>
                    Send Invite
                  </button>}
                </>
              )}
            </div>
          </div>);
      })}
        {pageRows.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52" }}>
          {allTenants.length === 0 ? "No active tenants yet." : quickFilter ? "No tenants match this filter." : "No tenants match your search."}
        </div>}
      </>}

      {/* ═══ Pagination ═══ */}
      {tenantView === "active" && sortedActive.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,.06)", fontSize: 11, color: "#6b5e52" }}>
          <span>{sortedActive.length} tenant{sortedActive.length !== 1 ? "s" : ""} {quickFilter ? "(filtered)" : ""}</span>
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button disabled={safePage === 0} onClick={() => setPage(p => p - 1)} style={{ ...btnSm, opacity: safePage === 0 ? .4 : 1 }}><IconChevL /></button>
              <span style={{ fontSize: 11, fontWeight: 600, minWidth: 60, textAlign: "center" }}>{safePage + 1} / {totalPages}</span>
              <button disabled={safePage >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ ...btnSm, opacity: safePage >= totalPages - 1 ? .4 : 1 }}><IconChevR /></button>
            </div>
          )}
        </div>
      )}

      {/* ═══ Future rows ═══ */}
      {tenantView === "future" && <>{filteredFuture.map(r => {
        if (!r.tenant) return null;
        const prop = props.find(p => p.id === r.propId);
        const daysUntilMoveIn = Math.ceil((new Date(r.tenant.moveIn + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24));
        const sd = sdStatus[r.id];
        const tLease = leases.find(l => l.tenantEmail === r.tenant?.email || l.tenantName === r.tenant?.name);
        const hasLease = tLease && tLease.status === "executed";
        const leaseLabel = hasLease ? "Lease signed" : tLease && tLease.status === "pending_tenant" ? "Pending signature" : "Set up lease";
        const leaseColor = hasLease ? "#2d6a3f" : "#c45c4a";
        return (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 160px 100px 120px 160px", padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,.05)", background: "#fff", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.03)"; e.currentTarget.style.boxShadow = "inset 3px 0 0 " + _ac; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            onClick={() => { setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: `rgba(${_acRgb},.5)`, flexShrink: 0 }} />
            </div>
            {/* Tenant */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 1, display: "flex", alignItems: "center", gap: 6 }}>
                {r.tenant.name}
                <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: `rgba(${_acRgb},.12)`, color: _ac, whiteSpace: "nowrap" }}>UPCOMING</span>
              </div>
              <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 3 }}>{prop ? getPropDisplayName(prop) : r.propName} &middot; {r.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: leaseColor }}>{leaseLabel}</span>
                {hasLease && (
                  <button onClick={e => { e.stopPropagation(); setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); }} style={{ fontSize: 9, fontWeight: 600, color: _ac, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 2 }}><IconFile /> Lease</button>
                )}
              </div>
            </div>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", overflow: "hidden" }}>
              <div style={{ fontSize: 11, color: "#3b82f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.tenant.email || "\u2014"}</div>
              <div style={{ fontSize: 11, color: "#5c4a3a" }}>{r.tenant.phone || "\u2014"}</div>
            </div>
            {/* Rent */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", fontFamily: MONO }}>{fmtS(r.rent)}<span style={{ fontSize: 9, fontWeight: 400, color: "#5c4a3a" }}>/mo</span></div>
            </div>
            {/* Move-In */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{fmtD(r.tenant.moveIn)}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: daysUntilMoveIn <= 7 ? "#c45c4a" : daysUntilMoveIn <= 30 ? "#9a7422" : "#3d3529" }}>{daysUntilMoveIn}d away</div>
            </div>
            {/* Security Deposit Status */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
              {sd ? (
                sd.paid
                  ? <span className="badge b-green" style={{ alignSelf: "flex-start", fontSize: 9 }}>Deposit Paid</span>
                  : <><span className="badge b-gold" style={{ alignSelf: "flex-start", fontSize: 9 }}>Deposit Partial</span><div style={{ fontSize: 9, color: "#3d3529" }}>{fmtS(sd.amountPaid)} of {fmtS(sd.amount)}</div></>
              ) : (
                <span className="badge b-gray" style={{ alignSelf: "flex-start", fontSize: 9 }}>No Deposit</span>
              )}
            </div>
          </div>);
      })}
        {filteredFuture.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52" }}>
          {futureTenants.length === 0 ? "No upcoming tenants." : "No future tenants match your search."}
        </div>}
      </>}

      {/* ═══ Past + Archived rows [D3] ═══ */}
      {(tenantView === "archive" || tenantView === "archived") && <>{filteredArchive.map(a => {
        const isArch = a.isArchived;
        return (
          <div key={a.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 160px 150px 160px", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,.05)", background: "#fff", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.04)"; e.currentTarget.style.boxShadow = "inset 3px 0 0 #8a7d74"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            onClick={() => setModal({ type: "archived", data: a })}>
            <div />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 2 }}>{a.propName} · {a.roomName}</div>
              {a.reason && <div style={{ fontSize: 10, color: "#7a7067", fontStyle: "italic" }}>{a.reason}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", overflow: "hidden" }}>
              <div style={{ fontSize: 11, color: "#5c4a3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email || "\u2014"}</div>
              <div style={{ fontSize: 11, color: "#5c4a3a" }}>{a.phone || "\u2014"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtS(a.rent)}<span style={{ fontSize: 10, fontWeight: 400, color: "#7a7067" }}>/mo</span></div>
              <div style={{ fontSize: 10, color: "#7a7067" }}>{fmtD(a.moveIn)} &rarr; {fmtD(a.leaseEnd)}</div>
              {a.terminatedDate && <div style={{ fontSize: 10, color: "#7a7067" }}>{a.reason === "Moved out" ? "Moved out" : "Ended"} {fmtD(a.terminatedDate)}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }} onClick={e => e.stopPropagation()}>
              {isArch
                ? <>
                  <span className="badge b-gray" style={{ alignSelf: "flex-start", fontSize: 9 }}>Archived</span>
                  <button onClick={() => unarchiveTenant(a.id)}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"}
                    style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)", background: "rgba(0,0,0,.04)", color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit", transition: "background .12s", alignSelf: "flex-start" }}>
                    Unarchive
                  </button>
                </>
                : <>
                  <span className="badge b-gray" style={{ alignSelf: "flex-start", fontSize: 9 }}>Past</span>
                  <button onClick={() => archiveTenant(a.id)}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.1)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,.04)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.1)"; }}
                    style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)", background: "rgba(0,0,0,.04)", color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", alignSelf: "flex-start" }}>
                    Archive
                  </button>
                </>
              }
            </div>
          </div>);
      })}
        {filteredArchive.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52" }}>
          {tenantView === "archived"
            ? <><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>No archived tenants</div><div style={{ fontSize: 12 }}>Move past tenants here when they{"'"}re fully resolved &mdash; SD returned, no disputes.</div></>
            : "No past tenants yet."}
        </div>}
      </>}
      </div>{/* close scroll container */}
    </div></div>

    {/* ═══ Nuke link ═══ */}
    {tenantView === "active" && allTenants.length > 0 && (
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <button onClick={() => setShowNuke(true)} style={{ fontSize: 9, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Reset all tenant data</button>
      </div>
    )}

    {/* ═══ IMPORT MODAL [M3][M4] — with error feedback ═══ */}
    {showImport && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => { setShowImport(false); setImportStep(0); setImportRows([]); setImportFile(null); setImportResult(null); setImportMappings([]); }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 640, width: "100%", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}>
          <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Import Tenants</div>
            <button onClick={() => { setShowImport(false); setImportStep(0); setImportRows([]); setImportFile(null); setImportResult(null); setImportMappings([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
          </div>
          <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
            {importStep === 0 && (<>
              <div style={{ fontSize: 12, color: "#6b5e52", marginBottom: 16 }}>Upload a CSV file with tenant data. Download the template to see the expected format.</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={downloadTemplate} style={{ ...btnSm, background: _ac, color: "#fff", border: "none" }}><IconExport /> Download Template</button>
              </div>

              {/* Import guidance */}
              <div style={{ background: "rgba(212,168,83,.08)", border: "1px solid rgba(212,168,83,.25)", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#1a1714", lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>How it works</div>
                <div>Your CSV just needs tenant info — name, email, phone, rent, etc. After uploading, you'll use <strong>dropdowns</strong> to assign each tenant to the right property, unit, and room.</div>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragEnter={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{ border: dragOver ? "2px solid #4a7c59" : "2px dashed rgba(0,0,0,.15)", borderRadius: 10, padding: 40, textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(74,124,89,.06)" : "transparent", transition: "all .15s" }}
              >
                <IconImport />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5c4a3a", marginTop: 8 }}>{dragOver ? "Drop CSV here" : "Click to upload CSV"}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>or drag and drop</div>
                <input ref={fileRef} type="file" accept=".csv" onChange={handleImportFile} style={{ display: "none" }} />
              </div>
            </>)}
            {importStep === 1 && (<>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1714", marginBottom: 4 }}>Assign each tenant to a space</div>
              <div style={{ fontSize: 12, color: "#5c4a3a", marginBottom: 12 }}>{importRows.length} tenant{importRows.length !== 1 ? "s" : ""} found in <strong>{importFile?.name}</strong>. Verify the dropdowns are correct.</div>
              <div style={{ overflowX: "auto", marginBottom: 16 }}>
                {importRows.map((row, i) => {
                  const m = importMappings[i] || {};
                  const selProp = props.find(p => p.id === m.propId);
                  const selUnits = selProp ? (selProp.units || []) : [];
                  const selUnit = selUnits.find(u => u.id === m.unitId);
                  const selRooms = selUnit ? (selUnit.rooms || []) : [];
                  const isWhole = selUnit && (selUnit.rentalMode || "byRoom") === "wholeHouse";
                  const allMapped = m.propId && m.unitId && (isWhole || m.roomId);
                  const selStyle = { padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.12)", fontSize: 11, fontFamily: "inherit", background: "#fff", width: "100%", color: "#1a1714" };
                  const updateMapping = (field, val) => {
                    setImportMappings(prev => {
                      const next = [...prev];
                      const cur = { ...next[i] };
                      cur[field] = val;
                      if (field === "propId") { cur.unitId = ""; cur.roomId = ""; }
                      if (field === "unitId") {
                        cur.roomId = "";
                        /* Auto-select room if whole-unit */
                        const u = (props.find(p => p.id === cur.propId)?.units || []).find(u => u.id === val);
                        if (u && (u.rentalMode || "byRoom") === "wholeHouse" && (u.rooms || [])[0]) cur.roomId = u.rooms[0].id;
                      }
                      next[i] = cur;
                      return next;
                    });
                  };
                  return (
                    <div key={i} style={{ padding: "10px 12px", background: i % 2 === 0 ? "rgba(0,0,0,.02)" : "#fff", borderRadius: 6, marginBottom: 2, border: allMapped ? "1px solid rgba(0,0,0,.06)" : "1px solid rgba(196,92,74,.3)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1714", flex: 1 }}>{row["Name"] || "Unnamed"}</div>
                        <div style={{ fontSize: 11, color: "#5c4a3a" }}>{row["Email"] || ""}</div>
                        <div style={{ fontSize: 11, color: "#5c4a3a" }}>${row["Rent"] || "0"}/mo</div>
                        {allMapped && <span style={{ fontSize: 9, fontWeight: 700, color: "#2d6a3f", background: "rgba(45,106,63,.1)", padding: "2px 8px", borderRadius: 100 }}>Ready</span>}
                        {!allMapped && <span style={{ fontSize: 9, fontWeight: 700, color: "#c45c4a", background: "rgba(196,92,74,.1)", padding: "2px 8px", borderRadius: 100 }}>Needs assignment</span>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Property</div>
                          <select value={m.propId || ""} onChange={e => updateMapping("propId", e.target.value)} style={selStyle}>
                            <option value="">Select property...</option>
                            {props.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Unit</div>
                          <select value={m.unitId || ""} onChange={e => updateMapping("unitId", e.target.value)} style={{ ...selStyle, opacity: selUnits.length ? 1 : 0.4 }} disabled={!selUnits.length}>
                            <option value="">Select unit...</option>
                            {selUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Room</div>
                          {isWhole ? (
                            <div style={{ ...selStyle, display: "flex", alignItems: "center", color: "#5c4a3a", background: "rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.06)" }}>Whole unit</div>
                          ) : (
                            <select value={m.roomId || ""} onChange={e => updateMapping("roomId", e.target.value)} style={{ ...selStyle, opacity: selRooms.length ? 1 : 0.4 }} disabled={!selRooms.length}>
                              <option value="">Select room...</option>
                              {selRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => { setImportStep(0); setImportRows([]); setImportFile(null); setImportMappings([]); }} style={btnSm}>Back</button>
                <button onClick={executeImport} disabled={importMappings.some((m, i) => { const u = props.find(p => p.id === m.propId)?.units?.find(u => u.id === m.unitId); return !m.propId || !m.unitId || (!m.roomId && (!u || (u.rentalMode || "byRoom") !== "wholeHouse")); })} style={{ ...btnSm, background: _ac, color: "#fff", border: "none", opacity: importMappings.some((m, i) => { const u = props.find(p => p.id === m.propId)?.units?.find(u => u.id === m.unitId); return !m.propId || !m.unitId || (!m.roomId && (!u || (u.rentalMode || "byRoom") !== "wholeHouse")); }) ? 0.4 : 1 }}>Import {importRows.length} Tenants</button>
                {importMappings.filter(m => { const u = props.find(p => p.id === m.propId)?.units?.find(u => u.id === m.unitId); return !m.propId || !m.unitId || (!m.roomId && (!u || (u.rentalMode || "byRoom") !== "wholeHouse")); }).length > 0 && (
                  <span style={{ fontSize: 11, color: "#c45c4a" }}>{importMappings.filter(m => { const u = props.find(p => p.id === m.propId)?.units?.find(u => u.id === m.unitId); return !m.propId || !m.unitId || (!m.roomId && (!u || (u.rentalMode || "byRoom") !== "wholeHouse")); }).length} still need assignment</span>
                )}
              </div>
            </>)}
            {/* [M3] Import results with error feedback */}
            {importStep === 2 && importResult && (<>
              <div style={{ textAlign: "center", padding: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: importResult.ok > 0 ? "#2d6a3f" : "#c45c4a", marginBottom: 8 }}>
                  {importResult.ok > 0 ? "Import Complete" : "Import Failed"}
                </div>
                <div style={{ fontSize: 12, color: "#6b5e52", marginBottom: 12 }}>
                  {importResult.ok} imported, {importResult.skipped} skipped
                </div>
                {importResult.errors.length > 0 && (
                  <div style={{ textAlign: "left", background: "rgba(196,92,74,.05)", border: "1px solid rgba(196,92,74,.2)", borderRadius: 8, padding: 12, maxHeight: 200, overflowY: "auto" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#c45c4a", marginBottom: 6 }}>Errors:</div>
                    {importResult.errors.map((err, i) => <div key={i} style={{ fontSize: 11, color: "#5c4a3a", padding: "2px 0" }}>{err}</div>)}
                  </div>
                )}
              </div>
            </>)}
          </div>
        </div>
      </div>
    )}

    {/* ═══ NUKE MODAL ═══ */}
    {showNuke && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => { setShowNuke(false); setNukeConfirm(""); }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 440, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.2)", padding: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>Reset All Tenant Data</div>
          <div style={{ fontSize: 12, color: "#5c4a3a", marginBottom: 6 }}>This will permanently:</div>
          <ul style={{ fontSize: 12, color: "#5c4a3a", marginBottom: 16, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Remove all tenants from all rooms</li>
            <li>Set all rooms to vacant</li>
            <li>Delete all tenant-related charges (rent, late fees, SD)</li>
            <li>Clear payments and archived tenants</li>
            <li>Cancel draft/pending leases</li>
            <li>Remove room-linked maintenance requests</li>
          </ul>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>Type DELETE to confirm</div>
          <input value={nukeConfirm} onChange={e => setNukeConfirm(e.target.value)} placeholder="Type DELETE" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #fca5a5", fontSize: 13, fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowNuke(false); setNukeConfirm(""); }} style={btnSm}>Cancel</button>
            <button disabled={nukeConfirm !== "DELETE"} onClick={nukeAllTenants} style={{ ...btnSm, background: nukeConfirm === "DELETE" ? "#dc2626" : "#fca5a5", color: "#fff", border: "none", opacity: nukeConfirm === "DELETE" ? 1 : .5 }}><IconTrash /> Reset Everything</button>
          </div>
        </div>
      </div>
    )}

    {/* ═══ BULK MESSAGE MODAL ═══ */}
    {bulkMsg && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => { setBulkMsg(null); setBulkErrs({}); }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, maxWidth: 520, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.2)", padding: 24, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1714" }}>Message {bulkMsg.count} Tenant{bulkMsg.count !== 1 ? "s" : ""}</div>
            <button onClick={() => { setBulkMsg(null); setBulkErrs({}); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}><IconX /></button>
          </div>
          <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 12 }}>To: {bulkMsg.names.slice(0, 5).join(", ")}{bulkMsg.names.length > 5 ? ` +${bulkMsg.names.length - 5} more` : ""}</div>
          <div className="fld" style={{ marginBottom: 10 }}>
            <label>Subject *</label>
            <input value={bulkSubject} onChange={e => { setBulkSubject(e.target.value); setBulkErrs(p => ({ ...p, subject: null })); }} placeholder="Message subject..." style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid " + (bulkErrs.subject ? "#c45c4a" : "rgba(0,0,0,.12)"), fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
            {bulkErrs.subject && <div className="err-msg">{bulkErrs.subject}</div>}
          </div>
          <div className="fld" style={{ marginBottom: 16 }}>
            <label>Message *</label>
            <textarea value={bulkBody} onChange={e => { setBulkBody(e.target.value); setBulkErrs(p => ({ ...p, body: null })); }} placeholder="Write your message..." rows={5} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid " + (bulkErrs.body ? "#c45c4a" : "rgba(0,0,0,.12)"), fontSize: 12, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            {bulkErrs.body && <div className="err-msg">{bulkErrs.body}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setBulkMsg(null); setBulkErrs({}); }} style={btnSm}>Cancel</button>
            <button disabled={bulkSending} onClick={() => {
              const e = {};
              if (!bulkSubject.trim()) e.subject = "Enter a subject line for your message";
              if (!bulkBody.trim()) e.body = "Write the message you want to send to your tenants";
              if (Object.keys(e).length) { setBulkErrs(e); shake(); return; }
              sendBulkMessage();
            }}
              style={{ ...btnSm, background: _ac, color: "#fff", border: "none", opacity: bulkSending ? .5 : 1 }}>
              <IconMail /> {bulkSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>);
}
