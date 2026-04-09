"use client";
import { useState, useMemo, useCallback } from "react";
import QuickAddPayment from "./QuickAddPayment";
import QuickAddExpense from "./QuickAddExpense";
import QuickAddCharge from "./QuickAddCharge";
import TransactionDetail from "./TransactionDetail";

const STATUS_COLORS = { paid: "#4a7c59", unpaid: "#3b82f6", pastdue: "#c45c4a", partial: "#d4a853", waived: "#999", voided: "#999" };
const ROWS_PER_PAGE = 100;

function getChargeStatus(c, TODAY) {
  if (c.voided) return "voided";
  if (c.waived) return "waived";
  if (c.amountPaid >= c.amount) return "paid";
  if (c.amountPaid > 0) return "partial";
  if (TODAY && c.dueDate && c.dueDate < TODAY) return "pastdue";
  return "unpaid";
}

function fmtDate(d) {
  if (!d) return "--";
  try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
}
function fmtMoney(n) { return "$" + Math.abs(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* SVG icons */
const IconUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const IconDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
const IconCredit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="#d4a853"/></svg>;
const SortArrow = ({ dir }) => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#6b5e52" strokeWidth="1.5" strokeLinecap="round" style={{ marginLeft: 4 }}>{dir === "asc" ? <polyline points="2 6 5 3 8 6"/> : <polyline points="2 4 5 7 8 4"/>}</svg>;
const IconSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX = () => <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>;
const IconPlus = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;

export default function TransactionLedger({
  charges, expenses, credits, props, vendors, settings,
  TODAY, setCharges, setExpenses, setCredits,
  createCharge, recordPayment, setModal, uid,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const [quickAdd, setQuickAdd] = useState(null); // "payment" | "expense" | "charge" | null
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [propFilter, setPropFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [checked, setChecked] = useState({});
  const [page, setPage] = useState(0);

  /* Unify into rows */
  const allRows = useMemo(() => {
    const rows = [];
    (charges || []).forEach(c => rows.push({
      _src: c, _type: "income", id: c.id,
      date: c.dueDate || c.createdDate, name: c.tenantName || "",
      property: c.propName || "", category: c.category || "",
      desc: c.desc || "", amount: c.amount || 0,
      status: getChargeStatus(c, TODAY), method: (c.payments || []).map(p => p.method).join(", "),
    }));
    (expenses || []).forEach(e => rows.push({
      _src: e, _type: "expense", id: e.id,
      date: e.date, name: e.vendor || "",
      property: e.propName || "", category: e.category || "",
      desc: e.description || "", amount: e.amount || 0,
      status: "paid", method: e.paymentMethod || "",
    }));
    (credits || []).forEach(cr => rows.push({
      _src: cr, _type: "credit", id: cr.id,
      date: cr.date || cr.createdDate, name: cr.tenantName || "",
      property: cr.propName || "", category: cr.category || "Credit",
      desc: cr.desc || cr.description || "", amount: cr.amount || 0,
      status: "applied", method: "",
    }));
    return rows;
  }, [charges, expenses, credits, TODAY]);

  /* Date range helper */
  const inDateRange = useCallback((dateStr) => {
    if (!dateStr || dateRange === "all") return true;
    const y = TODAY ? parseInt(TODAY.slice(0, 4)) : new Date().getFullYear();
    const m = TODAY ? parseInt(TODAY.slice(5, 7)) : new Date().getMonth() + 1;
    if (dateRange === "month") {
      const prefix = String(y) + "-" + String(m).padStart(2, "0");
      return dateStr.startsWith(prefix);
    }
    if (dateRange === "ytd") return dateStr >= y + "-01-01";
    if (dateRange === "lastyear") return dateStr >= (y - 1) + "-01-01" && dateStr < y + "-01-01";
    if (dateRange === "custom") {
      if (customFrom && dateStr < customFrom) return false;
      if (customTo && dateStr > customTo) return false;
      return true;
    }
    return true;
  }, [dateRange, customFrom, customTo, TODAY]);

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let rows = allRows;
    if (typeFilter !== "all") rows = rows.filter(r => {
      if (typeFilter === "income") return r._type === "income";
      if (typeFilter === "expenses") return r._type === "expense";
      if (typeFilter === "credits") return r._type === "credit";
      return true;
    });
    if (propFilter) rows = rows.filter(r => r.property === propFilter);
    if (catFilter) rows = rows.filter(r => r.category === catFilter);
    if (statusFilter) rows = rows.filter(r => r.status === statusFilter);
    rows = rows.filter(r => inDateRange(r.date));
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) || r.property.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) ||
        r.method.toLowerCase().includes(q) || String(r.amount).includes(q)
      );
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
  }, [allRows, typeFilter, propFilter, catFilter, statusFilter, dateRange, customFrom, customTo, search, sortCol, sortDir, inDateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRows = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  const checkedIds = Object.keys(checked).filter(k => checked[k]);
  const anyChecked = checkedIds.length > 0;

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const propNames = useMemo(() => [...new Set(allRows.map(r => r.property).filter(Boolean))].sort(), [allRows]);
  const catNames = useMemo(() => [...new Set(allRows.map(r => r.category).filter(Boolean))].sort(), [allRows]);

  const activeFilters = [];
  if (typeFilter !== "all") activeFilters.push({ key: "type", label: typeFilter, clear: () => setTypeFilter("all") });
  if (propFilter) activeFilters.push({ key: "prop", label: propFilter, clear: () => setPropFilter("") });
  if (catFilter) activeFilters.push({ key: "cat", label: catFilter, clear: () => setCatFilter("") });
  if (statusFilter) activeFilters.push({ key: "status", label: statusFilter, clear: () => setStatusFilter("") });
  if (dateRange !== "all") activeFilters.push({ key: "date", label: dateRange === "month" ? "This Month" : dateRange === "ytd" ? "YTD" : dateRange === "lastyear" ? "Last Year" : "Custom", clear: () => setDateRange("all") });

  /* CSV export */
  const exportCSV = () => {
    const headers = ["Type","Date","Name","Property","Category","Description","Amount","Status","Method"];
    const csvRows = [headers.join(",")];
    filtered.forEach(r => {
      csvRows.push([r._type, r.date, '"' + r.name.replace(/"/g, '""') + '"', '"' + r.property.replace(/"/g, '""') + '"', '"' + r.category + '"', '"' + r.desc.replace(/"/g, '""') + '"', r._type === "expense" ? "-" + r.amount : r.amount, r.status, '"' + r.method + '"'].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleRecordPayment = (chargeId, payData) => {
    recordPayment?.(chargeId, payData);
    setQuickAdd(null);
  };

  const handleAddExpense = (data) => {
    setExpenses?.(prev => [...(prev || []), data]);
    setQuickAdd(null);
  };

  const handleAddCharge = (data) => {
    createCharge?.(data);
    setQuickAdd(null);
  };

  const pillStyle = (active) => ({
    fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 99,
    border: "1px solid " + (active ? "#1a1714" : "rgba(0,0,0,.1)"),
    background: active ? "#1a1714" : "#fff",
    color: active ? "#f5f0e8" : "#5c4a3a",
    cursor: "pointer", fontFamily: "inherit",
  });

  const thStyle = (col) => ({
    textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700,
    color: "#6b5e52", textTransform: "uppercase", letterSpacing: .5,
    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    borderBottom: "1px solid rgba(0,0,0,.08)",
  });

  return (
    <div>
      {/* Quick-add bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["payment","expense","charge"].map(t => (
          <button key={t} onClick={() => setQuickAdd(quickAdd === t ? null : t)}
            className={quickAdd === t ? "btn btn-green btn-sm" : "btn btn-out btn-sm"}
            style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconPlus /> {t === "payment" ? "Payment" : t === "expense" ? "Expense" : "Charge"}
          </button>
        ))}
      </div>

      {/* Inline forms */}
      {quickAdd === "payment" && <QuickAddPayment charges={charges} props={props} onRecord={handleRecordPayment} onCancel={() => setQuickAdd(null)} uid={uid} TODAY={TODAY} />}
      {quickAdd === "expense" && <QuickAddExpense props={props} vendors={vendors} expenses={expenses} onAdd={handleAddExpense} onCancel={() => setQuickAdd(null)} uid={uid} TODAY={TODAY} />}
      {quickAdd === "charge" && <QuickAddCharge charges={charges} props={props} onAdd={handleAddCharge} onCancel={() => setQuickAdd(null)} uid={uid} TODAY={TODAY} />}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><IconSearch /></div>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search transactions..."
          style={{ width: "100%", padding: "8px 10px 8px 32px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, alignItems: "center" }}>
        {/* Type pills */}
        {[["all","All"],["income","Income"],["expenses","Expenses"],["credits","Credits"]].map(([v,l]) => (
          <button key={v} onClick={() => { setTypeFilter(v); setPage(0); }} style={pillStyle(typeFilter === v)}>{l}</button>
        ))}
        <span style={{ width: 1, height: 20, background: "rgba(0,0,0,.1)", margin: "0 4px" }} />
        {/* Property */}
        <select value={propFilter} onChange={e => { setPropFilter(e.target.value); setPage(0); }}
          style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a" }}>
          <option value="">All Properties</option>
          {propNames.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {/* Category */}
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(0); }}
          style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a" }}>
          <option value="">All Categories</option>
          {catNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Status */}
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a" }}>
          <option value="">All Statuses</option>
          {["paid","unpaid","pastdue","partial","voided","waived"].map(s => <option key={s} value={s}>{s === "pastdue" ? "Past Due" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        {/* Date range */}
        <select value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(0); }}
          style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontFamily: "inherit", color: "#5c4a3a" }}>
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="ytd">YTD</option>
          <option value="lastyear">Last Year</option>
          <option value="custom">Custom</option>
        </select>
        {dateRange === "custom" && (
          <>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ fontSize: 11, padding: "4px 6px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)" }} />
            <span style={{ fontSize: 11, color: "#6b5e52" }}>to</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ fontSize: 11, padding: "4px 6px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)" }} />
          </>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {activeFilters.map(f => (
            <span key={f.key} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 99, background: _ac + "14", color: _ac, cursor: "pointer" }} onClick={f.clear}>
              {f.label} <IconX />
            </span>
          ))}
          {activeFilters.length > 1 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 99, color: "#6b5e52", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setTypeFilter("all"); setPropFilter(""); setCatFilter(""); setStatusFilter(""); setDateRange("all"); }}>
              Clear all
            </span>
          )}
        </div>
      )}

      {/* Batch toolbar */}
      {anyChecked && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8, background: _ac + "0c", borderRadius: 8, border: "1px solid " + _ac + "20" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: _ac }}>{checkedIds.length} selected</span>
          <button className="btn btn-out btn-sm" style={{ fontSize: 10 }} onClick={() => { checkedIds.forEach(id => { const r = allRows.find(x => x.id === id); if (r && r._type === "income") { /* parent handles void */ } }); }}>Void</button>
          <button className="btn btn-out btn-sm" style={{ fontSize: 10 }} onClick={exportCSV}>Export</button>
          <button className="btn btn-out btn-sm" style={{ fontSize: 10, marginLeft: "auto" }} onClick={() => setChecked({})}>Deselect</button>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#faf9f7" }}>
                <th style={{ ...thStyle(), width: 32, padding: "8px 6px" }}>
                  <input type="checkbox" checked={pageRows.length > 0 && pageRows.every(r => checked[r.id])}
                    onChange={e => { const next = { ...checked }; pageRows.forEach(r => next[r.id] = e.target.checked); setChecked(next); }} />
                </th>
                <th style={{ ...thStyle(), width: 32 }}></th>
                <th style={thStyle("date")} onClick={() => toggleSort("date")}>Date{sortCol === "date" && <SortArrow dir={sortDir} />}</th>
                <th style={thStyle("name")} onClick={() => toggleSort("name")}>Name{sortCol === "name" && <SortArrow dir={sortDir} />}</th>
                <th style={thStyle("property")} onClick={() => toggleSort("property")}>Property{sortCol === "property" && <SortArrow dir={sortDir} />}</th>
                <th style={thStyle("category")} onClick={() => toggleSort("category")}>Category{sortCol === "category" && <SortArrow dir={sortDir} />}</th>
                <th style={thStyle("desc")} onClick={() => toggleSort("desc")}>Description{sortCol === "desc" && <SortArrow dir={sortDir} />}</th>
                <th style={{ ...thStyle("amount"), textAlign: "right" }} onClick={() => toggleSort("amount")}>Amount{sortCol === "amount" && <SortArrow dir={sortDir} />}</th>
                <th style={thStyle("status")} onClick={() => toggleSort("status")}>Status{sortCol === "status" && <SortArrow dir={sortDir} />}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "#6b5e52", fontSize: 12 }}>No transactions found</td></tr>
              )}
              {pageRows.map(r => {
                const sColor = STATUS_COLORS[r.status] || "#999";
                return (
                  <tr key={r.id} onClick={() => { setSelectedTx(r._src); setSelectedType(r._type); }}
                    style={{ cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "8px 6px" }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={!!checked[r.id]} onChange={e => setChecked(p => ({ ...p, [r.id]: e.target.checked }))} />
                    </td>
                    <td style={{ padding: "8px 4px" }}>
                      {r._type === "income" ? <IconUp /> : r._type === "expense" ? <IconDown /> : <IconCredit />}
                    </td>
                    <td style={{ padding: "8px 10px", whiteSpace: "nowrap", color: "#1a1714" }}>{fmtDate(r.date)}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 600, color: "#1a1714", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name || "--"}</td>
                    <td style={{ padding: "8px 10px", color: "#6b5e52", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.property || "--"}</td>
                    <td style={{ padding: "8px 10px", color: "#6b5e52" }}>{r.category}</td>
                    <td style={{ padding: "8px 10px", color: "#6b5e52", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.desc || "--"}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: r._type === "expense" ? "#c45c4a" : "#4a7c59" }}>
                      {r._type === "expense" ? "-" : ""}{fmtMoney(r.amount)}
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: sColor + "18", color: sColor, textTransform: "uppercase", letterSpacing: .3, textDecoration: r.status === "voided" ? "line-through" : "none" }}>
                        {r.status === "pastdue" ? "Past Due" : r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11, color: "#6b5e52" }}>
        <span>Showing {Math.min(filtered.length, page * ROWS_PER_PAGE + 1)}--{Math.min(filtered.length, (page + 1) * ROWS_PER_PAGE)} of {filtered.length} transactions</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {totalPages > 1 && (
            <>
              <button className="btn btn-out btn-sm" style={{ fontSize: 10 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span style={{ fontSize: 11 }}>Page {page + 1} of {totalPages}</span>
              <button className="btn btn-out btn-sm" style={{ fontSize: 10 }} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
            </>
          )}
          <button className="btn btn-out btn-sm" style={{ fontSize: 10 }} onClick={exportCSV}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 4, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Detail slide-over */}
      {selectedTx && (
        <TransactionDetail
          transaction={selectedTx}
          type={selectedType}
          onClose={() => { setSelectedTx(null); setSelectedType(null); }}
          onEdit={(tx) => { setModal?.({ type: "editTransaction", data: tx }); }}
          onDelete={(tx) => {
            if (selectedType === "income" || selectedType === "charge") {
              setCharges?.(prev => (prev || []).filter(c => c.id !== tx.id));
            } else {
              setExpenses?.(prev => (prev || []).filter(e => e.id !== tx.id));
            }
            setSelectedTx(null);
          }}
          onRecordPayment={(tx) => { setSelectedTx(null); setQuickAdd("payment"); }}
          onWaive={(tx) => { setCharges?.(prev => (prev || []).map(c => c.id === tx.id ? { ...c, waived: true } : c)); setSelectedTx(null); }}
          onVoid={(tx) => { setCharges?.(prev => (prev || []).map(c => c.id === tx.id ? { ...c, voided: true } : c)); setSelectedTx(null); }}
          settings={settings}
        />
      )}
    </div>
  );
}
