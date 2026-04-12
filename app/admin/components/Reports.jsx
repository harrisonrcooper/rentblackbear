"use client";
import { useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────
const fmt = n => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtParen = n => n < 0 ? "(" + fmt(Math.abs(n)) + ")" : fmt(n);
const hexToRgba = (hex, opacity) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16) || 0;
  const g = parseInt(h.substr(2, 2), 16) || 0;
  const b = parseInt(h.substr(4, 2), 16) || 0;
  return `rgba(${r},${g},${b},${opacity})`;
};

const allRooms = (prop) => {
  if (!prop) return [];
  if (prop.units && prop.units.length > 0) return prop.units.flatMap(u => u.rooms || []);
  return prop.rooms || [];
};

// ── AR Aging tenant row (collapsible) ─────────────────────────────
function AgingTenantRow({ name, t, i, has90, bucketDefs, daysPastDue, getBucket, fmt, thS, tdS, trAlt, _red, _grn, _gold, hexToRgba }) {
  const [open, setOpen] = useState(false);
  return (<>
    <tr style={{ ...trAlt(i), cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
      <td style={{ ...tdS, fontWeight: 700, color: has90 ? _red : "inherit" }}>
        <span style={{ display: "inline-block", width: 14, fontSize: 9, color: "#999", marginRight: 4, transition: "transform .15s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
        {name}
      </td>
      <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: has90 ? _red : "inherit" }}>{fmt(t.total)}</td>
      {bucketDefs.map(b => <td key={b.key} style={{ ...tdS, textAlign: "right", fontWeight: 600, color: t[b.key] > 0 ? b.color : "#ccc" }}>{t[b.key] > 0 ? fmt(t[b.key]) : "\u2014"}</td>)}
      <td style={{ ...tdS, textAlign: "center", fontWeight: 600 }}>{t.charges.length}</td>
    </tr>
    {open && t.charges.sort((a, b) => daysPastDue(b) - daysPastDue(a)).map(c => {
      const bal = c.amount - c.amountPaid;
      const days = daysPastDue(c);
      const bk = getBucket(c);
      return (<tr key={c.id} style={{ background: "rgba(0,0,0,.02)" }}>
        <td style={{ ...tdS, paddingLeft: 32, fontSize: 10, color: "#6b5e52" }}>{c.propName} &mdash; {c.desc || c.category}</td>
        <td style={{ ...tdS, textAlign: "right", fontWeight: 600, fontSize: 10 }}>{fmt(bal)}</td>
        <td colSpan={4} style={{ ...tdS, fontSize: 10, color: bk.color, textAlign: "center" }}>Due: {c.dueDate} ({days} days)</td>
        <td />
      </tr>);
    })}
  </>);
}

// ── Component ──────────────────────────────────────────────────────
export default function Reports({
  settings, properties, charges, expenses, mortgages, sdLedger,
  apps, archive, SCHED_E_CATS, getPropDisplayName, propDisplay,
  chargeStatus, uid, vendors = [], improvements = [],
}) {
  const [reportPeriod, setReportPeriod] = useState({ from: "", to: "" });
  const [reportProp, setReportProp] = useState("all");
  const [activeReport, setActiveReport] = useState(null);

  const _acc = settings?.adminAccent || "#4a7c59";
  const _grn = settings?.themeGreen || "#4a7c59";
  const _red = settings?.themeRed || "#c45c4a";
  const _gold = settings?.themeGold || "#d4a853";
  const TODAY = new Date();
  const props = properties || [];

  const rFrom = reportPeriod.from || (TODAY.getFullYear() + "-01-01");
  const rTo = reportPeriod.to || TODAY.toISOString().split("T")[0];
  const rProps = reportProp === "all" ? props : props.filter(p => p.id === reportProp);

  // ── Filtered data ────────────────────────────────────────────────
  const rCharges = charges.filter(c => c.dueDate >= rFrom && c.dueDate <= rTo && (reportProp === "all" || rProps.some(p => p.name === c.propName)));

  const rPayments = charges.flatMap(c => (c.payments || []).map(p => ({
    ...p, propName: c.propName, tenantName: c.tenantName, category: c.category, chargeId: c.id
  }))).filter(p => p.date >= rFrom && p.date <= rTo && (reportProp === "all" || rProps.some(x => x.name === p.propName)));

  // P2 FIX: Exclude security deposit payments from income
  const rIncomePayments = rPayments.filter(p => p.category !== "Security Deposit");

  const rExpenses = expenses.filter(e => e.date >= rFrom && e.date <= rTo && (reportProp === "all" || rProps.some(p => p.id === e.propId) || e.propId === "shared"));
  const rMortgages = mortgages.filter(mg => reportProp === "all" || rProps.some(p => p.id === mg.propId));

  const totalIncome = rIncomePayments.reduce((s, p) => s + p.amount, 0);
  const totalExp = rExpenses.reduce((s, e) => s + e.amount, 0);
  const totalNOI = totalIncome - totalExp;

  // P0 FIX: Compute period months for pro-rating annual debt service
  const periodMonths = Math.max(1, Math.round((new Date(rTo + "T00:00:00") - new Date(rFrom + "T00:00:00")) / (1e3 * 60 * 60 * 24 * 30.44)));
  const periodDebt = rMortgages.reduce((s, mg) => s + (mg.monthlyPI || 0) * periodMonths, 0);
  const annualDebt = rMortgages.reduce((s, mg) => s + (mg.monthlyPI || 0) * 12, 0);
  const rDSCR = annualDebt > 0 ? (totalNOI / (periodMonths >= 11 ? annualDebt : periodDebt)) : null;

  // P2 FIX: Shared expense allocation uses filtered property count
  const sharedExpAlloc = (amount) => Math.round(amount / (rProps.length || 1) * 100) / 100;

  // Per-property helpers
  const propIncome = (pr) => rIncomePayments.filter(p => p.propName === pr.name).reduce((s, p) => s + p.amount, 0);
  const propDirectExp = (pr) => rExpenses.filter(e => e.propId === pr.id).reduce((s, e) => s + e.amount, 0);
  const propSharedExp = () => rExpenses.filter(e => e.propId === "shared").reduce((s, e) => s + sharedExpAlloc(e.amount), 0);
  const propTotalExp = (pr) => propDirectExp(pr) + propSharedExp();
  const propNOI = (pr) => propIncome(pr) - propTotalExp(pr);

  // ── Actions ──────────────────────────────────────────────────────
  const printReport = () => window.print();
  const exportCSV = (rows, headers, filename) => {
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = filename + ".csv"; a.click();
  };

  // ── Icon helper ──────────────────────────────────────────────────
  const RIcon = ({ d, d2 }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d} />{d2 && <path d={d2} />}</svg>;

  const reports = [
    { id: "rentroll", icon: <RIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8" />, title: "Rent Roll", desc: "Live snapshot of all units \u2014 tenant, lease dates, rent, status" },
    { id: "pnl", icon: <RIcon d="M18 20V10M12 20V4M6 20v-6" />, title: "P&L by Property", desc: "Income minus expenses per property \u2014 Net Operating Income" },
    { id: "schede", icon: <RIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />, title: "Schedule E Summary", desc: "All 19 Schedule E lines per property \u2014 ready for your CPA" },
    { id: "cashflow", icon: <RIcon d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, title: "Cash Flow Statement", desc: "Collected rent minus expenses minus debt service" },
    { id: "aging", icon: <RIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "AR Aging", desc: "Outstanding receivables bucketed: current, 30, 60, 90+ days" },
    { id: "sdledger", icon: <RIcon d="M19 11H5M19 11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2M19 11V9a7 7 0 1 0-14 0v2" />, title: "SD Liability Ledger", desc: "Security deposits held \u2014 liability for your balance sheet" },
    { id: "occupancy", icon: <RIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" />, title: "Occupancy Report", desc: "Occupancy rate, vacancy days, and lost revenue per property" },
    { id: "trailing12", icon: <RIcon d="M23 6l-9.5 9.5-5-5L1 18" />, title: "Trailing 12 Income", desc: "Month-by-month collected rent for the past 12 months" },
    { id: "dscr", icon: <RIcon d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" d2="M13 13l6 6" />, title: "DSCR Report", desc: "Debt Service Coverage Ratio \u2014 required for refi/acquisition loans" },
    { id: "tenantledger", icon: <RIcon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" d2="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z" />, title: "Tenant Ledger", desc: "Full charge and payment history per tenant \u2014 printable statement" },
    { id: "leadsource", icon: <RIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />, title: "Lead Source Analytics", desc: "Which channels convert best \u2014 pipeline, approvals, denials by source" },
    { id: "tenantquality", icon: <RIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Tenant Quality by Source", desc: "Avg tenure, lease completion rate, and broke-lease % by acquisition channel" },
    { id: "taxprep", icon: <RIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />, title: "Tax Prep Package", desc: "Schedule E + P&L for every property in one export \u2014 hand this to your CPA" },
    { id: "lenderpacket", icon: <RIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8" />, title: "Lender Packet", desc: "Rent roll + DSCR + trailing 12 + cash flow \u2014 one download for your banker" },
    { id: "periodcompare", icon: <RIcon d="M18 20V10M12 20V4M6 20v-6" />, title: "Period Comparison", desc: "Side-by-side P&L \u2014 this year vs last year, or any two date ranges" },
    { id: "qbexport", icon: <RIcon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" d2="M7 10l5 5 5-5M12 15V3" />, title: "QuickBooks Export", desc: "Export income and expenses as QuickBooks-compatible CSV for easy import" },
    { id: "1099report", icon: <RIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />, title: "1099 Vendor Report", desc: "Vendors paid >= $600 for 1099-NEC filing \u2014 export for your CPA or e-file" },
    { id: "yearendtax", icon: <RIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />, title: "Year-End Tax Package", desc: "Schedule E, 1099 list, mortgage interest, deposits, depreciation \u2014 all in one download" },
  ];

  // ── Table wrapper for mobile scroll ──────────────────────────────
  const TW = ({ children }) => <div style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)", overflowX: "auto" }}>{children}</div>;

  // ── Shared table styles ──────────────────────────────────────────
  const thS = { padding: "9px 12px", fontSize: 9, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, whiteSpace: "nowrap" };
  const tdS = { padding: "8px 12px" };
  const trAlt = (i) => ({ borderBottom: "1px solid rgba(0,0,0,.03)", background: i % 2 === 0 ? "#fff" : "rgba(0,0,0,.01)" });

  return (<>
    <div className="sec-hd"><div><h2>Reports</h2></div></div>

    {/* Filters */}
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16, padding: "12px 14px", background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
      <select value={reportProp} onChange={e => setReportProp(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit" }}>
        <option value="all">All Properties</option>
        {props.map(p => <option key={p.id} value={p.id}>{getPropDisplayName(p)}</option>)}
      </select>
      <input type="date" value={reportPeriod.from} onChange={e => setReportPeriod(p => ({ ...p, from: e.target.value }))} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11 }} />
      <span style={{ fontSize: 11, color: "#6b5e52" }}>to</span>
      <input type="date" value={reportPeriod.to} onChange={e => setReportPeriod(p => ({ ...p, to: e.target.value }))} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11 }} />
      <button className="btn btn-out btn-sm" onClick={() => setReportPeriod({ from: TODAY.getFullYear() + "-01-01", to: TODAY.toISOString().split("T")[0] })}>YTD</button>
      <button className="btn btn-out btn-sm" onClick={() => { const y = TODAY.getFullYear() - 1; setReportPeriod({ from: y + "-01-01", to: y + "-12-31" }); }}>Last Year</button>
      <button className="btn btn-out btn-sm" onClick={() => { const m = String(TODAY.getMonth() + 1).padStart(2, "0"); setReportPeriod({ from: TODAY.getFullYear() + "-" + m + "-01", to: rTo }); }}>MTD</button>
    </div>

    {/* Report cards grid */}
    {!activeReport && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
      {reports.map(r => (
        <div key={r.id} style={{ background: "#fff", borderRadius: 10, padding: "16px", border: "1px solid rgba(0,0,0,.06)", cursor: "pointer", transition: "all .15s" }}
          onClick={() => setActiveReport(r.id)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = hexToRgba(_acc, .4); e.currentTarget.style.background = hexToRgba(_acc, .02); }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,.06)"; e.currentTarget.style.background = "#fff"; }}>
          <div style={{ marginBottom: 10, color: "#5c4a3a" }}>{r.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{r.title}</div>
          <div style={{ fontSize: 11, color: "#6b5e52", lineHeight: 1.5 }}>{r.desc}</div>
          <div style={{ marginTop: 10, fontSize: 10, color: _acc, fontWeight: 700 }}>Open &rarr;</div>
        </div>
      ))}
    </div>}

    {/* Active report */}
    {activeReport && (() => {
      const rep = reports.find(r => r.id === activeReport);
      // Build CSV rows for the active report
      const csvBtn = (rows, headers, filename) => (
        <button className="btn btn-out btn-sm" onClick={() => exportCSV(rows, headers, filename)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export CSV
        </button>
      );
      return (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn btn-out btn-sm" onClick={() => setActiveReport(null)}>&larr; Back</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#5c4a3a" }}>{rep.icon}<h3 style={{ margin: 0, fontSize: 15 }}>{rep.title}</h3></div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button className="btn btn-out btn-sm" onClick={printReport}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
              Print / PDF
            </button>
          </div>
        </div>

        {/* ── Rent Roll ── */}
        {activeReport === "rentroll" && (() => {
          const rows = rProps.flatMap(pr => (pr.units || []).flatMap(u => {
            if (u.ownerOccupied) return [];
            const isWhole = (u.rentalMode || "byRoom") === "wholeHouse";
            if (isWhole) { const rep = (u.rooms || []).find(r => r.tenant); return [{ prop: getPropDisplayName(pr), unit: u.name || pr.name, type: "Whole Unit", tenant: rep?.tenant?.name || "Vacant", rent: rep?.tenant ? (u.rent || 0) : 0, moveIn: rep?.tenant?.moveIn || "\u2014", leaseEnd: rep?.le || "\u2014", status: rep ? "Occupied" : "Vacant" }]; }
            return (u.rooms || []).filter(r => !r.ownerOccupied).map(r => ({ prop: getPropDisplayName(pr), unit: r.name, type: "By Room", tenant: r.tenant?.name || "Vacant", rent: r.rent, moveIn: r.tenant?.moveIn || "\u2014", leaseEnd: r.le || "\u2014", status: r.st === "occupied" ? "Occupied" : "Vacant" }));
          }));
          const csvRows = rows.map(r => ({ ...r, rent: fmt(r.rent) }));
          const headers = ["prop", "unit", "type", "tenant", "rent", "moveIn", "leaseEnd", "status"];
          return (<>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>{csvBtn(csvRows, headers, "rent-roll-" + rFrom)}</div>
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  {["Property", "Unit", "Type", "Tenant", "Rent/Mo", "Move-In", "Lease End", "Status"].map(h => <th key={h} style={{ ...thS, textAlign: "left" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#6b5e52" }}>No units found for the selected property filter.</td></tr>}
                  {rows.map((r, i) => <tr key={i} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 600 }}>{r.prop}</td><td style={tdS}>{r.unit}</td><td style={{ ...tdS, fontSize: 10, color: "#6b5e52" }}>{r.type}</td>
                    <td style={{ ...tdS, fontWeight: r.tenant !== "Vacant" ? 700 : 400, color: r.tenant === "Vacant" ? _red : "inherit" }}>{r.tenant}</td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{fmt(r.rent)}</td>
                    <td style={{ ...tdS, fontSize: 10, color: "#6b5e52" }}>{r.moveIn}</td>
                    <td style={{ ...tdS, fontSize: 10, color: "#6b5e52" }}>{r.leaseEnd}</td>
                    <td style={tdS}><span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: r.status === "Occupied" ? hexToRgba(_grn, .08) : hexToRgba(_red, .08), color: r.status === "Occupied" ? _grn : _red }}>{r.status}</span></td>
                  </tr>)}
                </tbody>
                <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                  <td colSpan={4} style={{ ...tdS, fontWeight: 800 }}>Totals: {rows.length} units &middot; {rows.filter(r => r.status === "Occupied").length} occupied &middot; {rows.filter(r => r.status === "Vacant").length} vacant</td>
                  <td style={{ ...tdS, fontWeight: 800, color: _grn }}>{fmt(rows.reduce((s, r) => s + r.rent, 0))}/mo</td>
                  <td colSpan={3} />
                </tr></tfoot>
              </table>
            </TW>
          </>);
        })()}

        {/* ── P&L by Property ── */}
        {activeReport === "pnl" && (() => {
          const pnlRows = rProps.map(pr => {
            const inc = propIncome(pr); const exp = propTotalExp(pr); const noi = inc - exp;
            const margin = inc > 0 ? Math.round(noi / inc * 100) : 0;
            return { prop: getPropDisplayName(pr), income: inc, expenses: exp, noi, margin };
          });
          const csvRows = pnlRows.map(r => ({ Property: r.prop, "Gross Income": fmt(r.income), "Total Expenses": fmt(r.expenses), NOI: fmt(r.noi), "Margin %": r.margin + "%" }));
          return (<>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>{csvBtn(csvRows, ["Property", "Gross Income", "Total Expenses", "NOI", "Margin %"], "pnl-" + rFrom)}</div>
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  {["Property", "Gross Income ($)", "Total Expenses ($)", "NOI ($)", "Margin"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Property" ? "left" : "right" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {pnlRows.map((r, i) => (
                    <tr key={i} style={trAlt(i)}>
                      <td style={{ ...tdS, fontWeight: 700 }}>{r.prop}</td>
                      <td style={{ ...tdS, textAlign: "right", color: _grn, fontWeight: 700 }}>{fmt(r.income)}</td>
                      <td style={{ ...tdS, textAlign: "right", color: _red, fontWeight: 700 }}>{fmt(r.expenses)}</td>
                      <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: r.noi >= 0 ? _grn : _red }}>{fmtParen(r.noi)}</td>
                      <td style={{ ...tdS, textAlign: "right", color: r.margin >= 0 ? _grn : _red, fontWeight: 700 }}>{r.margin}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                  <td style={{ ...tdS, fontWeight: 800 }}>Portfolio Total</td>
                  <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _grn }}>{fmt(totalIncome)}</td>
                  <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(totalExp)}</td>
                  <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: totalNOI >= 0 ? _grn : _red, fontSize: 14 }}>{fmtParen(totalNOI)}</td>
                  <td style={{ ...tdS, textAlign: "right", fontWeight: 800 }}>{totalIncome > 0 ? Math.round(totalNOI / totalIncome * 100) : 0}%</td>
                </tr></tfoot>
              </table>
            </TW>
          </>);
        })()}

        {/* ── Schedule E ── */}
        {activeReport === "schede" && (() => {
          return (<>
            {rProps.map(pr => {
              const prIncome = propIncome(pr);
              const prExp = [...rExpenses.filter(e => e.propId === pr.id), ...rExpenses.filter(e => e.propId === "shared").map(e => ({ ...e, amount: sharedExpAlloc(e.amount) }))];
              const expByLine = {}; prExp.forEach(e => { expByLine[e.category] = (expByLine[e.category] || 0) + e.amount; });
              const prTotalExp = prExp.reduce((s, e) => s + e.amount, 0);
              // P0 FIX: Mortgage interest — use monthlyPI * period months as estimate, clearly labeled
              const mg = rMortgages.filter(m => m.propId === pr.id);
              const mgInterestEst = mg.reduce((s, m) => s + (m.monthlyPI || 0) * periodMonths * (m.interestRate || 0) / 100 / ((m.interestRate || 0) / 100 + 1 / (m.termMonths || 360)), 0);
              // Simpler: use monthlyPI * rate_fraction as rough estimate — flag as estimate
              const simpleMgInterest = mg.reduce((s, m) => {
                if (!m.currentBalance || !m.interestRate) return s;
                // Monthly interest on current balance = balance * rate / 12
                return s + (m.currentBalance * (m.interestRate / 100) / 12) * periodMonths;
              }, 0);
              if (simpleMgInterest > 0 && !expByLine["Mortgage Interest"]) expByLine["Mortgage Interest"] = simpleMgInterest;
              else if (simpleMgInterest > 0 && expByLine["Mortgage Interest"]) {
                // P0 FIX: Don't double-count — only add auto-calc if no manual entry exists
                // Keep the manually entered amount as-is
              }
              const finalTotalExp = Object.values(expByLine).reduce((s, v) => s + v, 0);
              return (
                <div key={pr.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)", marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "2px solid rgba(0,0,0,.06)", fontWeight: 800, fontSize: 13, background: "#f8f7f4" }}>{getPropDisplayName(pr)} &mdash; Schedule E Summary ({rFrom.slice(0, 4)})</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <tbody>
                      <tr style={{ background: hexToRgba(_grn, .04) }}><td style={{ padding: "8px 16px", fontWeight: 700, color: _grn }}>Line 3 &mdash; Gross Rents Received</td><td style={{ padding: "8px 16px", textAlign: "right", fontWeight: 800, color: _grn }}>{fmt(prIncome)}</td></tr>
                      {SCHED_E_CATS.map(({ label: cat }) => { const amt = expByLine[cat] || 0; return amt > 0 ? (
                        <tr key={cat} style={{ borderTop: "1px solid rgba(0,0,0,.03)" }}><td style={{ padding: "8px 16px", color: "#5c4a3a" }}>{cat}</td><td style={{ padding: "8px 16px", textAlign: "right", fontWeight: 700, color: _red }}>{fmt(amt)}</td></tr>
                      ) : null; })}
                      <tr style={{ borderTop: "2px solid rgba(0,0,0,.08)", background: hexToRgba(_acc, .04) }}><td style={{ padding: "10px 16px", fontWeight: 800, color: _acc }}>Line 22 &mdash; Total Expenses</td><td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 800, color: _red }}>{fmt(finalTotalExp)}</td></tr>
                      <tr style={{ background: hexToRgba(_grn, .04) }}><td style={{ padding: "10px 16px", fontWeight: 800, color: _grn }}>Net Income / (Loss)</td><td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 800, fontSize: 14, color: (prIncome - finalTotalExp) >= 0 ? _grn : _red }}>{fmtParen(prIncome - finalTotalExp)}</td></tr>
                    </tbody>
                  </table>
                  {simpleMgInterest > 0 && !rExpenses.some(e => e.propId === pr.id && e.category === "Mortgage Interest") && (
                    <div style={{ padding: "8px 16px", fontSize: 10, color: "#6b5e52", borderTop: "1px solid rgba(0,0,0,.04)" }}>Mortgage interest is estimated from current balance and rate. Replace with actual 1098 amount for filing.</div>
                  )}
                </div>);
            })}
          </>);
        })()}

        {/* ── Cash Flow ── */}
        {activeReport === "cashflow" && (() => {
          const fcf = totalNOI - periodDebt;
          const periodLabel = periodMonths >= 11 ? "Annual" : periodMonths + "-Month";
          return (<TW>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {[
                  ["Gross Rent Collected", totalIncome, _grn, false],
                  ["Total Operating Expenses", -totalExp, _red, false],
                  ["Net Operating Income (NOI)", totalNOI, totalNOI >= 0 ? _grn : _red, true],
                  [periodLabel + " Debt Service (P&I)", -periodDebt, "#9a7422", false],
                  ["Free Cash Flow", fcf, fcf >= 0 ? _grn : _red, true],
                ].map(([label, val, color, bold]) => (
                  <tr key={label} style={{ borderBottom: "1px solid rgba(0,0,0,.04)", background: bold ? "rgba(0,0,0,.02)" : "#fff" }}>
                    <td style={{ padding: "12px 16px", fontWeight: bold ? 800 : 500, color: bold ? "#1a1714" : "#5c4a3a" }}>{label}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: bold ? 800 : 600, color, fontSize: bold ? 15 : 13 }}>{fmtParen(val)}</td>
                  </tr>
                ))}
                <tr style={{ background: hexToRgba(_gold, .06), borderTop: "2px solid " + hexToRgba(_gold, .2) }}>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: "#9a7422" }}>DSCR ({periodLabel})</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: rDSCR == null ? "#999" : rDSCR >= 1.25 ? _grn : _red, fontSize: 16 }}>{rDSCR != null ? rDSCR.toFixed(2) + "x" : "N/A \u2014 no mortgages"}</td>
                </tr>
              </tbody>
            </table>
            {rDSCR != null && <div style={{ padding: "10px 16px", fontSize: 11, color: "#6b5e52", borderTop: "1px solid rgba(0,0,0,.04)" }}>Lenders typically require DSCR &ge; 1.25. {rDSCR >= 1.25 ? "Meets threshold." : "Below typical lender threshold."}</div>}
          </TW>);
        })()}

        {/* ── AR Aging ── */}
        {activeReport === "aging" && (() => {
          const unpaid = charges.filter(c => !c.voided && !c.waived && c.amountPaid < c.amount && (reportProp === "all" || rProps.some(p => p.name === c.propName)));
          const daysPastDue = (c) => { const diff = Math.floor((TODAY - new Date(c.dueDate + "T00:00:00")) / 86400000); return diff > 0 ? diff : 0; };
          const bucketDefs = [
            { key: "current", label: "Current (0-30)", min: 0, max: 30, color: _grn },
            { key: "d31_60", label: "31-60 Days", min: 31, max: 60, color: _gold },
            { key: "d61_90", label: "61-90 Days", min: 61, max: 90, color: _red },
            { key: "d90plus", label: "90+ Days", min: 91, max: Infinity, color: _red },
          ];
          const getBucket = (c) => { const d = daysPastDue(c); return bucketDefs.find(b => d >= b.min && d <= b.max); };
          const totalAR = unpaid.reduce((s, c) => s + c.amount - c.amountPaid, 0);

          // Group by tenant
          const byTenant = {};
          unpaid.forEach(c => {
            const name = c.tenantName || "Unknown";
            if (!byTenant[name]) byTenant[name] = { charges: [], current: 0, d31_60: 0, d61_90: 0, d90plus: 0, total: 0 };
            const bal = c.amount - c.amountPaid;
            const bk = getBucket(c);
            byTenant[name][bk.key] += bal;
            byTenant[name].total += bal;
            byTenant[name].charges.push(c);
          });
          const tenants = Object.entries(byTenant).sort((a, b) => b[1].total - a[1].total);

          // Portfolio totals per bucket
          const totals = { current: 0, d31_60: 0, d61_90: 0, d90plus: 0 };
          tenants.forEach(([, t]) => { totals.current += t.current; totals.d31_60 += t.d31_60; totals.d61_90 += t.d61_90; totals.d90plus += t.d90plus; });

          // CSV export rows
          const csvRows = tenants.map(([name, t]) => ({ Tenant: name, Total: fmt(t.total), "Current (0-30)": fmt(t.current), "31-60 Days": fmt(t.d31_60), "61-90 Days": fmt(t.d61_90), "90+ Days": fmt(t.d90plus), Charges: t.charges.length }));
          const csvHeaders = ["Tenant", "Total", "Current (0-30)", "31-60 Days", "61-90 Days", "90+ Days", "Charges"];

          return (<>
            {/* Total AR banner */}
            {totalAR > 0 && <div style={{ background: hexToRgba(_red, .06), borderRadius: 8, padding: "14px 18px", border: "1px solid " + hexToRgba(_red, .12), marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div><span style={{ fontWeight: 800, color: _red, fontSize: 13 }}>Total Accounts Receivable: </span><span style={{ fontWeight: 800, fontSize: 20, color: _red }}>{fmt(totalAR)}</span></div>
              <div style={{ display: "flex", gap: 14, fontSize: 11, fontWeight: 600 }}>
                {bucketDefs.map(b => <span key={b.key} style={{ color: b.color }}>{b.label}: {fmt(totals[b.key])}</span>)}
              </div>
            </div>}

            {totalAR === 0 && <div style={{ textAlign: "center", padding: 36, color: "#6b5e52", background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>No outstanding receivables.</div>}

            {totalAR > 0 && <>
              <div style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>{csvBtn(csvRows, csvHeaders, "ar-aging-" + TODAY.toISOString().split("T")[0])}</div>
              <TW>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                    <th style={{ ...thS, textAlign: "left" }}>Tenant</th>
                    <th style={{ ...thS, textAlign: "right", fontWeight: 800 }}>Total</th>
                    {bucketDefs.map(b => <th key={b.key} style={{ ...thS, textAlign: "right", color: b.color }}>{b.label}</th>)}
                    <th style={{ ...thS, textAlign: "center" }}>Charges</th>
                  </tr></thead>
                  <tbody>
                    {tenants.map(([name, t], i) => {
                      const has90 = t.d90plus > 0;
                      return (<AgingTenantRow key={name} name={name} t={t} i={i} has90={has90} bucketDefs={bucketDefs} daysPastDue={daysPastDue} getBucket={getBucket} fmt={fmt} thS={thS} tdS={tdS} trAlt={trAlt} _red={_red} _grn={_grn} _gold={_gold} hexToRgba={hexToRgba} />);
                    })}
                  </tbody>
                  <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                    <td style={{ ...tdS, fontWeight: 800 }}>Portfolio Total</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red, fontSize: 13 }}>{fmt(totalAR)}</td>
                    {bucketDefs.map(b => <td key={b.key} style={{ ...tdS, textAlign: "right", fontWeight: 800, color: b.color }}>{fmt(totals[b.key])}</td>)}
                    <td style={{ ...tdS, textAlign: "center", fontWeight: 800 }}>{unpaid.length}</td>
                  </tr></tfoot>
                </table>
              </TW>
            </>}
          </>);
        })()}

        {/* ── SD Liability Ledger ── */}
        {activeReport === "sdledger" && (() => {
          const rows = sdLedger.filter(s => reportProp === "all" || rProps.some(p => p.name === s.propName));
          const totalHeld = rows.reduce((s, r) => s + (r.amountHeld || 0), 0);
          const totalDed = rows.reduce((s, r) => s + (r.deductions || []).reduce((d, x) => d + x.amount, 0), 0);
          return (<TW>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>{["Tenant", "Property", "Room", "SD Held ($)", "Deductions ($)", "Net Liability ($)", "Status"].map(h => <th key={h} style={{ ...thS, textAlign: ["SD Held ($)", "Deductions ($)", "Net Liability ($)"].includes(h) ? "right" : "left" }}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#6b5e52" }}>No security deposit records found.</td></tr>}
                {rows.map((r, i) => { const ded = (r.deductions || []).reduce((s, d) => s + d.amount, 0); const net = (r.amountHeld || 0) - ded; return (
                  <tr key={r.id} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 600 }}>{r.tenantName}</td><td style={{ ...tdS, fontSize: 10 }}>{propDisplay(r.propName)}</td><td style={{ ...tdS, fontSize: 10, color: "#6b5e52" }}>{r.roomName}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700 }}>{fmt(r.amountHeld || 0)}</td>
                    <td style={{ ...tdS, textAlign: "right", color: _red }}>{ded > 0 ? fmt(ded) : "\u2014"}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _gold }}>{fmt(net)}</td>
                    <td style={tdS}><span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 100, fontWeight: 700, background: r.returned ? hexToRgba(_grn, .08) : hexToRgba(_gold, .1), color: r.returned ? _grn : "#9a7422" }}>{r.returned ? "Returned" : "Held"}</span></td>
                  </tr>); })}
              </tbody>
              <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                <td colSpan={3} style={{ ...tdS, fontWeight: 800 }}>Total SD Liability</td>
                <td style={{ ...tdS, textAlign: "right", fontWeight: 800 }}>{fmt(totalHeld)}</td>
                <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(totalDed)}</td>
                <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _gold, fontSize: 14 }}>{fmt(totalHeld - totalDed)}</td>
                <td />
              </tr></tfoot>
            </table>
          </TW>);
        })()}

        {/* ── Occupancy Report ── */}
        {activeReport === "occupancy" && (() => {
          return (<TW>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>{["Property", "Total Units", "Occupied", "Vacant", "Occ Rate", "Potential Rent ($/mo)", "Actual Rent ($/mo)", "Vacancy Loss ($/mo)"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Property" ? "left" : "center" }}>{h}</th>)}</tr></thead>
              <tbody>
                {rProps.map((pr, i) => {
                  const rooms = allRooms(pr).filter(r => !r.ownerOccupied);
                  const occ = rooms.filter(r => r.st === "occupied");
                  const vac = rooms.filter(r => r.st !== "occupied");
                  const potRent = rooms.reduce((s, r) => s + r.rent, 0);
                  const actRent = occ.reduce((s, r) => s + r.rent, 0);
                  const occRate = rooms.length ? Math.round(occ.length / rooms.length * 100) : 0;
                  return (<tr key={pr.id} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 700 }}>{getPropDisplayName(pr)}</td>
                    <td style={{ ...tdS, textAlign: "center" }}>{rooms.length}</td>
                    <td style={{ ...tdS, textAlign: "center", color: _grn, fontWeight: 700 }}>{occ.length}</td>
                    <td style={{ ...tdS, textAlign: "center", color: vac.length > 0 ? _red : "#999", fontWeight: vac.length > 0 ? 700 : 400 }}>{vac.length}</td>
                    <td style={{ ...tdS, textAlign: "center" }}><span style={{ fontWeight: 800, color: occRate >= 90 ? _grn : occRate >= 70 ? _gold : _red }}>{occRate}%</span></td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 600 }}>{fmt(potRent)}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: _grn }}>{fmt(actRent)}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: potRent - actRent > 0 ? _red : _grn }}>{fmt(potRent - actRent)}</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </TW>);
        })()}

        {/* ── Trailing 12 ── */}
        {activeReport === "trailing12" && (() => {
          // P0 FIX: Always use trailing 12 months from TODAY, use ALL payments (not date-filtered)
          const months = Array.from({ length: 12 }, (_, i) => { const d = new Date(TODAY); d.setMonth(d.getMonth() - 11 + i); return d.toISOString().slice(0, 7); });
          const allPayments = charges.flatMap(c => (c.payments || []).map(p => ({ ...p, propName: c.propName, category: c.category }))).filter(p => p.category !== "Security Deposit");
          const t12Props = reportProp === "all" ? props : rProps;
          const t12Payments = reportProp === "all" ? allPayments : allPayments.filter(p => t12Props.some(x => x.name === p.propName));
          return (<TW>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                <th style={{ ...thS, textAlign: "left" }}>Month</th>
                {t12Props.map(p => <th key={p.id} style={{ ...thS, textAlign: "right" }}>{getPropDisplayName(p)}</th>)}
                <th style={{ ...thS, textAlign: "right" }}>Total</th>
              </tr></thead>
              <tbody>
                {months.map((mo, i) => {
                  const moPays = t12Payments.filter(p => p.date?.slice(0, 7) === mo);
                  const total = moPays.reduce((s, p) => s + p.amount, 0);
                  return (<tr key={mo} style={trAlt(i)}>
                    <td style={{ ...tdS, fontSize: 11, color: "#5c4a3a" }}>{mo}</td>
                    {t12Props.map(p => { const amt = moPays.filter(x => x.propName === p.name).reduce((s, x) => s + x.amount, 0); return <td key={p.id} style={{ ...tdS, textAlign: "right", color: amt > 0 ? _grn : "#ccc" }}>{amt > 0 ? fmt(amt) : "\u2014"}</td>; })}
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: total > 0 ? _grn : "#999" }}>{total > 0 ? fmt(total) : "\u2014"}</td>
                  </tr>);
                })}
              </tbody>
              <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                <td style={{ ...tdS, fontWeight: 800 }}>12-Month Total</td>
                {t12Props.map(p => { const amt = t12Payments.filter(x => x.propName === p.name && months.includes(x.date?.slice(0, 7))).reduce((s, x) => s + x.amount, 0); return <td key={p.id} style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _grn }}>{fmt(amt)}</td>; })}
                <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _grn, fontSize: 14 }}>{fmt(t12Payments.filter(p => months.includes(p.date?.slice(0, 7))).reduce((s, p) => s + p.amount, 0))}</td>
              </tr></tfoot>
            </table>
          </TW>);
        })()}

        {/* ── DSCR Report ── */}
        {activeReport === "dscr" && (() => {
          if (rMortgages.length === 0) return <div style={{ textAlign: "center", padding: 36, color: "#6b5e52", background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>No mortgages on record. Add mortgages in the Accounting tab first.</div>;
          return (<>
            {rProps.map(pr => {
              const prInc = propIncome(pr);
              // P0 FIX: Include shared expenses in DSCR property NOI
              const prExp = propTotalExp(pr);
              const prNOI = prInc - prExp;
              const prMg = rMortgages.filter(mg => mg.propId === pr.id);
              const prDebt = prMg.reduce((s, mg) => s + (mg.monthlyPI || 0) * periodMonths, 0);
              const prAnnualDebt = prMg.reduce((s, mg) => s + (mg.monthlyPI || 0) * 12, 0);
              const prDSCR = prDebt > 0 ? (prNOI / prDebt) : null;
              if (prMg.length === 0) return null;
              return (
                <div key={pr.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)", padding: "16px", marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>{getPropDisplayName(pr)}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))", gap: 8, marginBottom: 12 }}>
                    {[
                      ["NOI", fmtParen(prNOI), prNOI >= 0 ? _grn : _red],
                      ["Debt Service", fmt(prDebt), "#9a7422"],
                      ["DSCR", prDSCR != null ? prDSCR.toFixed(2) + "x" : "\u2014", prDSCR == null ? "#999" : prDSCR >= 1.25 ? _grn : prDSCR >= 1.0 ? _gold : _red],
                      ["Status", prDSCR == null ? "No debt" : prDSCR >= 1.25 ? "Strong" : prDSCR >= 1.0 ? "Marginal" : "At Risk", prDSCR == null ? "#999" : prDSCR >= 1.25 ? _grn : prDSCR >= 1.0 ? _gold : _red],
                    ].map(([lbl, v, clr]) => (
                      <div key={lbl} style={{ textAlign: "center", padding: "10px", background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
                        <div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{lbl}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: clr }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {prMg.map(mg => <div key={mg.id} style={{ fontSize: 11, color: "#6b5e52", padding: "6px 0", borderTop: "1px solid rgba(0,0,0,.04)" }}>{mg.lender} &middot; Balance: {fmt(mg.currentBalance || 0)} &middot; Rate: {mg.interestRate || 0}% &middot; P&I: {fmt(mg.monthlyPI || 0)}/mo</div>)}
                </div>);
            })}
          </>);
        })()}

        {/* ── Tenant Ledger ── */}
        {activeReport === "tenantledger" && (() => {
          const [selTenant, setSelTenant] = useState("all");
          const tenantNames = [...new Set(charges.map(c => c.tenantName))].sort();
          const selCharges = selTenant === "all" ? charges : charges.filter(c => c.tenantName === selTenant);
          const entries = selCharges.flatMap(c => [
            { date: c.createdDate || c.dueDate, desc: c.desc, category: c.category, type: "debit", amount: c.amount, tenant: c.tenantName, prop: c.propName, status: chargeStatus(c) },
            ...(c.payments || []).map(p => ({ date: p.date, desc: "Payment \u2014 " + p.method, category: "Payment", type: "credit", amount: p.amount, tenant: c.tenantName, prop: c.propName }))
          ]).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
          let bal = 0; const withBal = entries.map(e => { bal += e.type === "debit" ? e.amount : -e.amount; return { ...e, balance: bal }; });
          const csvRows = withBal.map(e => ({ Date: e.date, Tenant: e.tenant, Description: e.desc, Category: e.category, Debit: e.type === "debit" ? fmt(e.amount) : "", Credit: e.type === "credit" ? fmt(e.amount) : "", Balance: fmt(e.balance) }));
          return (<>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
              <select value={selTenant} onChange={e => setSelTenant(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit" }}>
                <option value="all">All Tenants</option>{tenantNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {csvBtn(csvRows, ["Date", "Tenant", "Description", "Category", "Debit", "Credit", "Balance"], "tenant-ledger-" + (selTenant === "all" ? "all" : selTenant.replace(/\s/g, "-")))}
            </div>
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>{["Date", "Tenant", "Description", "Category", "Debit ($)", "Credit ($)", "Balance ($)"].map(h => <th key={h} style={{ ...thS, textAlign: ["Debit ($)", "Credit ($)", "Balance ($)"].includes(h) ? "right" : "left" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {withBal.map((e, i) => <tr key={i} style={trAlt(i)}>
                    <td style={{ ...tdS, fontSize: 10, color: "#6b5e52", whiteSpace: "nowrap" }}>{e.date}</td>
                    <td style={{ ...tdS, fontWeight: 600, fontSize: 10 }}>{e.tenant}</td>
                    <td style={tdS}>{e.desc}</td>
                    <td style={tdS}><span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 100, background: e.category === "Payment" ? hexToRgba(_grn, .08) : hexToRgba(_acc, .08), color: e.category === "Payment" ? _grn : _acc, fontWeight: 700 }}>{e.category}</span></td>
                    <td style={{ ...tdS, textAlign: "right", color: e.type === "debit" ? _red : "#ccc", fontWeight: e.type === "debit" ? 700 : 400 }}>{e.type === "debit" ? fmt(e.amount) : "\u2014"}</td>
                    <td style={{ ...tdS, textAlign: "right", color: e.type === "credit" ? _grn : "#ccc", fontWeight: e.type === "credit" ? 700 : 400 }}>{e.type === "credit" ? fmt(e.amount) : "\u2014"}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: e.balance > 0 ? _red : e.balance < 0 ? _acc : _grn }}>{e.balance === 0 ? "$0.00" : fmt(e.balance)}</td>
                  </tr>)}
                  {withBal.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#6b5e52" }}>No records found.</td></tr>}
                </tbody>
              </table>
            </TW>
          </>);
        })()}

        {/* ── Lead Source Analytics ── */}
        {activeReport === "leadsource" && (() => {
          const sources = [...new Set((apps || []).map(a => a.source || "Unknown"))];
          return (<TW>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>{["Source", "Leads", "In Pipeline", "Approved", "Denied", "Conv %"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Source" ? "left" : "center" }}>{h}</th>)}</tr></thead>
              <tbody>
                {sources.map((src, i) => {
                  const sa = apps.filter(a => (a.source || "Unknown") === src);
                  const inPipe = sa.filter(a => !["denied", "approved", "onboarding"].includes(a.status)).length;
                  const approved = sa.filter(a => ["approved", "onboarding"].includes(a.status)).length;
                  const denied = sa.filter(a => a.status === "denied").length;
                  const rate = sa.length ? Math.round(approved / sa.length * 100) : 0;
                  return (<tr key={src} style={trAlt(i)}><td style={{ ...tdS, fontWeight: 600 }}>{src}</td><td style={{ ...tdS, textAlign: "center" }}>{sa.length}</td><td style={{ ...tdS, textAlign: "center" }}>{inPipe}</td><td style={{ ...tdS, textAlign: "center", color: approved ? _grn : "#999" }}>{approved}</td><td style={{ ...tdS, textAlign: "center", color: denied ? _red : "#999" }}>{denied}</td><td style={{ ...tdS, textAlign: "center" }}><span style={{ fontWeight: 700, color: rate >= 50 ? _grn : rate >= 20 ? _gold : "#999" }}>{rate}%</span></td></tr>);
                })}
              </tbody>
            </table>
          </TW>);
        })()}

        {/* ── Tenant Quality by Source ── */}
        {/* ── Tax Prep Package ── */}
        {activeReport === "taxprep" && (() => {
          const year = rFrom.slice(0, 4);
          // Build bundled CSV: one file with all properties, all Schedule E lines
          const allRows = [];
          rProps.forEach(pr => {
            const prInc = propIncome(pr);
            const prExp = [...rExpenses.filter(e => e.propId === pr.id), ...rExpenses.filter(e => e.propId === "shared").map(e => ({ ...e, amount: sharedExpAlloc(e.amount) }))];
            const expByLine = {}; prExp.forEach(e => { expByLine[e.category] = (expByLine[e.category] || 0) + e.amount; });
            // Mortgage interest estimate
            const mg = rMortgages.filter(m => m.propId === pr.id);
            const simpleMgInterest = mg.reduce((s, m) => {
              if (!m.currentBalance || !m.interestRate) return s;
              return s + (m.currentBalance * (m.interestRate / 100) / 12) * periodMonths;
            }, 0);
            if (simpleMgInterest > 0 && !expByLine["Mortgage Interest"]) expByLine["Mortgage Interest"] = simpleMgInterest;
            const totalExp = Object.values(expByLine).reduce((s, v) => s + v, 0);
            allRows.push({ Property: getPropDisplayName(pr), Line: "3 - Gross Rents", Amount: fmt(prInc) });
            SCHED_E_CATS.forEach(({ label: cat }) => { if (expByLine[cat]) allRows.push({ Property: getPropDisplayName(pr), Line: cat, Amount: fmt(expByLine[cat]) }); });
            allRows.push({ Property: getPropDisplayName(pr), Line: "22 - Total Expenses", Amount: fmt(totalExp) });
            allRows.push({ Property: getPropDisplayName(pr), Line: "Net Income / (Loss)", Amount: fmt(prInc - totalExp) });
          });
          // Also build P&L summary rows
          const pnlRows = rProps.map(pr => ({
            Property: getPropDisplayName(pr), Income: fmt(propIncome(pr)), Expenses: fmt(propTotalExp(pr)),
            NOI: fmt(propNOI(pr)), Margin: propIncome(pr) > 0 ? Math.round(propNOI(pr) / propIncome(pr) * 100) + "%" : "0%",
          }));

          const exportAll = () => {
            // Export Schedule E CSV
            exportCSV(allRows, ["Property", "Line", "Amount"], `schedule-e-all-properties-${year}`);
            // Export P&L CSV after a brief delay so browser handles both downloads
            setTimeout(() => exportCSV(pnlRows, ["Property", "Income", "Expenses", "NOI", "Margin"], `pnl-all-properties-${year}`), 300);
          };

          // Check for incomplete data
          const warnings = [];
          rProps.forEach(pr => {
            const mg = rMortgages.filter(m => m.propId === pr.id);
            const hasMgExp = rExpenses.some(e => e.propId === pr.id && e.category === "Mortgage Interest");
            if (mg.length > 0 && !hasMgExp) warnings.push(`${getPropDisplayName(pr)}: Mortgage interest is estimated. Replace with 1098 amount.`);
            const prExp = rExpenses.filter(e => e.propId === pr.id);
            if (prExp.length === 0) warnings.push(`${getPropDisplayName(pr)}: No expenses recorded for this period.`);
          });

          return (<>
            <div style={{ padding: "14px 16px", background: "rgba(212,168,83,.06)", borderRadius: 10, border: "1px solid rgba(212,168,83,.2)", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#9a7422", marginBottom: 6 }}>Tax Prep Package &mdash; {year}</div>
              <div style={{ fontSize: 11, color: "#6b5e52", lineHeight: 1.6, marginBottom: 10 }}>
                Downloads Schedule E summary + P&L for {rProps.length === props.length ? "all" : rProps.length} propert{rProps.length === 1 ? "y" : "ies"}.
                Hand both files to your CPA for Schedule E filing. Cash-basis accounting.
              </div>
              <button className="btn btn-gold btn-sm" style={{ fontWeight: 700, fontSize: 12, padding: "8px 20px" }} onClick={exportAll}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Tax Package (2 CSVs)
              </button>
            </div>
            {warnings.length > 0 && <div style={{ padding: "10px 14px", background: "rgba(196,92,74,.04)", borderRadius: 8, border: "1px solid rgba(196,92,74,.15)", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#c45c4a", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Review Before Filing</div>
              {warnings.map((w, i) => <div key={i} style={{ fontSize: 11, color: "#8b4a3a", padding: "3px 0" }}>{w}</div>)}
            </div>}
            {/* Preview: per-property summary */}
            {rProps.map(pr => {
              const inc = propIncome(pr); const exp = propTotalExp(pr); const noi = inc - exp;
              return (<div key={pr.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,.06)", padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700, fontSize: 12 }}>{getPropDisplayName(pr)}</div><div style={{ fontSize: 10, color: "#6b5e52", marginTop: 2 }}>Income {fmt(inc)} &middot; Expenses {fmt(exp)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, fontSize: 15, color: noi >= 0 ? _grn : _red }}>{fmtParen(noi)}</div><div style={{ fontSize: 9, color: "#6b5e52" }}>NOI</div></div>
              </div>);
            })}
          </>);
        })()}

        {/* ── Lender Packet ── */}
        {activeReport === "lenderpacket" && (() => {
          const year = rFrom.slice(0, 4);
          // Rent roll data
          const rrRows = rProps.flatMap(pr => (pr.units || []).flatMap(u => {
            if (u.ownerOccupied) return [];
            const isWhole = (u.rentalMode || "byRoom") === "wholeHouse";
            if (isWhole) { const rep = (u.rooms || []).find(r => r.tenant); return [{ Property: getPropDisplayName(pr), Unit: u.name || pr.name, Tenant: rep?.tenant?.name || "Vacant", Rent: rep?.tenant ? "$" + (u.rent || 0) : "$0", LeaseEnd: rep?.le || "", Status: rep ? "Occupied" : "Vacant" }]; }
            return (u.rooms || []).filter(r => !r.ownerOccupied).map(r => ({ Property: getPropDisplayName(pr), Unit: r.name, Tenant: r.tenant?.name || "Vacant", Rent: "$" + r.rent, LeaseEnd: r.le || "", Status: r.st === "occupied" ? "Occupied" : "Vacant" }));
          }));
          // Trailing 12 data
          const t12 = []; const now = TODAY;
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
            const inc = charges.flatMap(c => (c.payments || []).filter(p => (p.date || "").slice(0, 7) === ym).map(p => p.amount)).reduce((s, a) => s + a, 0);
            t12.push({ Month: label, Collected: fmt(inc) });
          }
          // Cash flow summary
          const fcf = totalNOI - periodDebt;
          const cfRows = [
            { Item: "Gross Rent Collected", Amount: fmt(totalIncome) },
            { Item: "Operating Expenses", Amount: fmt(-totalExp) },
            { Item: "NOI", Amount: fmtParen(totalNOI) },
            { Item: "Debt Service (P&I)", Amount: fmt(-periodDebt) },
            { Item: "Free Cash Flow", Amount: fmtParen(fcf) },
            { Item: "DSCR", Amount: rDSCR != null ? rDSCR.toFixed(2) + "x" : "N/A" },
          ];

          const exportAll = () => {
            exportCSV(rrRows, ["Property", "Unit", "Tenant", "Rent", "LeaseEnd", "Status"], `rent-roll-${year}`);
            setTimeout(() => exportCSV(t12, ["Month", "Collected"], `trailing-12-income-${year}`), 200);
            setTimeout(() => exportCSV(cfRows, ["Item", "Amount"], `cash-flow-dscr-${year}`), 400);
          };

          const occRooms = rProps.flatMap(p => allRooms(p)).filter(r => !r.ownerOccupied);
          const occupied = occRooms.filter(r => r.st === "occupied" || r.tenant).length;
          const occRate = occRooms.length > 0 ? Math.round(occupied / occRooms.length * 100) : 0;
          const totalMonthlyRent = occRooms.filter(r => r.tenant).reduce((s, r) => s + (r.rent || 0), 0);

          return (<>
            <div style={{ padding: "14px 16px", background: "rgba(74,124,89,.04)", borderRadius: 10, border: "1px solid rgba(74,124,89,.2)", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: _grn, marginBottom: 6 }}>Lender Packet &mdash; {year}</div>
              <div style={{ fontSize: 11, color: "#6b5e52", lineHeight: 1.6, marginBottom: 10 }}>
                Downloads rent roll, trailing 12-month income, and cash flow with DSCR.
                Three CSVs your banker can open directly.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-green btn-sm" style={{ fontWeight: 700, fontSize: 12, padding: "8px 20px" }} onClick={exportAll}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Lender Packet (3 CSVs)
                </button>
                <button className="btn btn-green btn-sm" style={{ fontWeight: 700, fontSize: 12, padding: "8px 20px", background: "#1a1714", border: "1px solid #1a1714" }} onClick={() => window.open("/api/generate-rent-roll", "_blank")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
                  Rent Roll PDF
                </button>
              </div>
            </div>
            {/* Key metrics preview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Occupancy", value: occRate + "%", color: occRate >= 90 ? _grn : _red },
                { label: "Monthly Rent", value: "$" + totalMonthlyRent.toLocaleString(), color: "#1a1714" },
                { label: "DSCR", value: rDSCR != null ? rDSCR.toFixed(2) + "x" : "N/A", color: rDSCR && rDSCR >= 1.25 ? _grn : _red },
                { label: "Free Cash Flow", value: fmtParen(fcf), color: fcf >= 0 ? _grn : _red },
              ].map(k => <div key={k.label} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(0,0,0,.06)", textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.value}</div>
              </div>)}
            </div>
            <div style={{ fontSize: 10, color: "#6b5e52", padding: "8px 12px", background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
              {rDSCR != null && rDSCR >= 1.25 ? "DSCR meets typical lender threshold (1.25x)." : rDSCR != null ? "DSCR is below the typical 1.25x lender threshold." : "Add mortgage data in Ledger to calculate DSCR."}
            </div>
          </>);
        })()}

        {/* ── Period Comparison ── */}
        {activeReport === "periodcompare" && (() => {
          // Compare current filter period vs same-length prior period
          const fromD = new Date(rFrom + "T00:00:00"), toD = new Date(rTo + "T00:00:00");
          const days = Math.max(1, Math.round((toD - fromD) / 864e5));
          const priorTo = new Date(fromD.getTime() - 864e5); // day before rFrom
          const priorFrom = new Date(priorTo.getTime() - days * 864e5);
          const pFrom = priorFrom.toISOString().slice(0, 10);
          const pTo = priorTo.toISOString().slice(0, 10);
          const pLabel = pFrom.slice(0, 7) + " to " + pTo.slice(0, 7);
          const cLabel = rFrom.slice(0, 7) + " to " + rTo.slice(0, 7);

          // Prior period data
          const pPayments = charges.flatMap(c => (c.payments || []).map(p => ({
            ...p, propName: c.propName, category: c.category
          }))).filter(p => p.date >= pFrom && p.date <= pTo && p.category !== "Security Deposit");
          const pExpenses = expenses.filter(e => e.date >= pFrom && e.date <= pTo);
          const pIncome = pPayments.reduce((s, p) => s + p.amount, 0);
          const pExp = pExpenses.reduce((s, e) => s + e.amount, 0);
          const pNOI = pIncome - pExp;

          const delta = (cur, prev) => {
            if (prev === 0 && cur === 0) return { pct: 0, dir: "flat" };
            if (prev === 0) return { pct: 100, dir: "up" };
            const p = Math.round((cur - prev) / Math.abs(prev) * 100);
            return { pct: Math.abs(p), dir: p > 0 ? "up" : p < 0 ? "down" : "flat" };
          };

          const rows = [
            { metric: "Gross Income", current: totalIncome, prior: pIncome, goodDir: "up" },
            { metric: "Total Expenses", current: totalExp, prior: pExp, goodDir: "down" },
            { metric: "NOI", current: totalNOI, prior: pNOI, goodDir: "up" },
          ];

          // Per-property comparison
          const propRows = rProps.map(pr => {
            const cInc = propIncome(pr); const cExp = propTotalExp(pr);
            const pPropInc = pPayments.filter(p => p.propName === pr.name).reduce((s, p) => s + p.amount, 0);
            const pPropExp = pExpenses.filter(e => e.propId === pr.id || e.propId === "shared").reduce((s, e) => s + (e.propId === "shared" ? sharedExpAlloc(e.amount) : e.amount), 0);
            return { name: getPropDisplayName(pr), cInc, cExp, cNOI: cInc - cExp, pInc: pPropInc, pExp: pPropExp, pNOI: pPropInc - pPropExp };
          });

          const DeltaBadge = ({ cur, prev, goodDir }) => {
            const d = delta(cur, prev);
            if (d.dir === "flat") return <span style={{ fontSize: 10, color: "#999" }}>--</span>;
            const isGood = d.dir === goodDir;
            const color = isGood ? _grn : _red;
            const arrow = d.dir === "up" ? "\u25B2" : "\u25BC";
            return <span style={{ fontSize: 10, fontWeight: 700, color }}>{arrow} {d.pct}%</span>;
          };

          return (<>
            <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 14, padding: "10px 14px", background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
              Comparing <strong>{cLabel}</strong> vs <strong>{pLabel}</strong> (prior equivalent period). Adjust the date range above to change comparison windows.
            </div>
            {/* Portfolio summary */}
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  <th style={{ ...thS, textAlign: "left" }}>Metric</th>
                  <th style={{ ...thS, textAlign: "right" }}>{cLabel}</th>
                  <th style={{ ...thS, textAlign: "right" }}>{pLabel}</th>
                  <th style={{ ...thS, textAlign: "center" }}>Change</th>
                </tr></thead>
                <tbody>
                  {rows.map((r, i) => <tr key={r.metric} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 700 }}>{r.metric}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700 }}>{fmt(r.current)}</td>
                    <td style={{ ...tdS, textAlign: "right", color: "#6b5e52" }}>{fmt(r.prior)}</td>
                    <td style={{ ...tdS, textAlign: "center" }}><DeltaBadge cur={r.current} prev={r.prior} goodDir={r.goodDir} /></td>
                  </tr>)}
                </tbody>
              </table>
            </TW>
            {/* Per-property breakdown */}
            {rProps.length > 1 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .8, marginTop: 16, marginBottom: 8 }}>By Property</div>
              <TW>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                    <th style={{ ...thS, textAlign: "left" }}>Property</th>
                    <th style={{ ...thS, textAlign: "right" }}>Income (Now)</th>
                    <th style={{ ...thS, textAlign: "right" }}>Income (Prior)</th>
                    <th style={{ ...thS, textAlign: "right" }}>NOI (Now)</th>
                    <th style={{ ...thS, textAlign: "right" }}>NOI (Prior)</th>
                    <th style={{ ...thS, textAlign: "center" }}>NOI Change</th>
                  </tr></thead>
                  <tbody>
                    {propRows.map((pr, i) => <tr key={pr.name} style={trAlt(i)}>
                      <td style={{ ...tdS, fontWeight: 600 }}>{pr.name}</td>
                      <td style={{ ...tdS, textAlign: "right" }}>{fmt(pr.cInc)}</td>
                      <td style={{ ...tdS, textAlign: "right", color: "#6b5e52" }}>{fmt(pr.pInc)}</td>
                      <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: pr.cNOI >= 0 ? _grn : _red }}>{fmtParen(pr.cNOI)}</td>
                      <td style={{ ...tdS, textAlign: "right", color: "#6b5e52" }}>{fmtParen(pr.pNOI)}</td>
                      <td style={{ ...tdS, textAlign: "center" }}><DeltaBadge cur={pr.cNOI} prev={pr.pNOI} goodDir="up" /></td>
                    </tr>)}
                  </tbody>
                </table>
              </TW>
            </>}
          </>);
        })()}

        {activeReport === "tenantquality" && (() => {
          const allSources = [...new Set((apps || []).map(a => a.source || "Unknown"))];
          return (<>
            <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 12, padding: "8px 12px", background: "rgba(0,0,0,.02)", borderRadius: 8 }}>
              Quality score is based on lease completion rate, broke-lease rate, and average tenure from past tenants linked to each source.
            </div>
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  {["Source", "Leads", "Approved", "Past Tenants", "Avg Tenure", "Broke Lease", "Completion %", "Quality Score"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Source" ? "left" : "center" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {allSources.map((src, si) => {
                    const srcApps = apps.filter(a => (a.source || "Unknown") === src);
                    const approved = srcApps.filter(a => ["approved", "onboarding"].includes(a.status)).length;
                    const srcEmails = new Set(srcApps.map(a => (a.email || "").toLowerCase()).filter(Boolean));
                    const pastFromSrc = (archive || []).filter(t => srcEmails.has((t.email || "").toLowerCase()));
                    const totalPast = pastFromSrc.length;
                    const completed = pastFromSrc.filter(t => t.terminatedDate && t.leaseEnd && new Date(t.terminatedDate + "T00:00:00") >= new Date(t.leaseEnd + "T00:00:00")).length;
                    const broke = pastFromSrc.filter(t => { const r = (t.reason || "").toLowerCase(); return r.includes("broke") || r.includes("early") || r.includes("evict") || r.includes("noise") || r.includes("violat"); }).length;
                    const tenures = pastFromSrc.map(t => { if (!t.moveIn || !t.terminatedDate) return null; return Math.round((new Date(t.terminatedDate + "T00:00:00") - new Date(t.moveIn + "T00:00:00")) / (1e3 * 60 * 60 * 24 * 30)); }).filter(v => v !== null && v > 0);
                    const avgTenure = tenures.length ? Math.round(tenures.reduce((s, v) => s + v, 0) / tenures.length) : null;
                    const completionRate = totalPast > 0 ? Math.round(completed / totalPast * 100) : null;
                    const brokeRate = totalPast > 0 ? Math.round(broke / totalPast * 100) : 0;
                    let qs = 50;
                    if (completionRate !== null) { if (completionRate >= 80) qs += 25; else if (completionRate >= 50) qs += 10; else qs -= 10; }
                    if (brokeRate > 30) qs -= 20; else if (brokeRate > 10) qs -= 10;
                    if (avgTenure) { if (avgTenure >= 10) qs += 15; else if (avgTenure >= 6) qs += 5; }
                    if (approved >= 3) qs += 10;
                    qs = Math.max(0, Math.min(100, qs));
                    const qsColor = qs >= 70 ? _grn : qs >= 50 ? _gold : _red;
                    return (<tr key={src} style={trAlt(si)}>
                      <td style={{ ...tdS, fontWeight: 600 }}>{src}</td>
                      <td style={{ ...tdS, textAlign: "center" }}>{srcApps.length}</td>
                      <td style={{ ...tdS, textAlign: "center", color: approved ? _grn : "#999" }}>{approved}</td>
                      <td style={{ ...tdS, textAlign: "center" }}>{totalPast || "\u2014"}</td>
                      <td style={{ ...tdS, textAlign: "center" }}>{avgTenure ? avgTenure + "mo" : "\u2014"}</td>
                      <td style={{ ...tdS, textAlign: "center", color: brokeRate > 20 ? _red : "#999" }}>{totalPast ? brokeRate + "%" : "\u2014"}</td>
                      <td style={{ ...tdS, textAlign: "center" }}>{completionRate !== null ? <span style={{ fontWeight: 700, color: completionRate >= 70 ? _grn : completionRate >= 40 ? _gold : _red }}>{completionRate}%</span> : "\u2014"}</td>
                      <td style={tdS}><div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                        <div style={{ height: 6, width: 60, borderRadius: 3, background: "rgba(0,0,0,.06)" }}><div style={{ height: "100%", borderRadius: 3, background: qsColor, width: qs + "%" }} /></div>
                        <span style={{ fontWeight: 800, color: qsColor, fontSize: 12 }}>{qs}</span>
                      </div></td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </TW>
          </>);
        })()}

        {/* ── QuickBooks Export ── */}
        {activeReport === "qbexport" && (() => {
          const SCHED_E_TO_QB = {
            "Advertising": "Advertising Expense",
            "Cleaning & Maintenance": "Repairs & Maintenance",
            "Insurance": "Insurance Expense",
            "Legal & Professional Fees": "Professional Fees",
            "Mortgage Interest": "Mortgage Interest",
            "Repairs": "Repairs & Maintenance",
            "Supplies": "Supplies",
            "Taxes": "Property Tax",
            "Utilities": "Utilities",
            "Other": "Miscellaneous Expense",
          };
          const mapAccount = (cat) => SCHED_E_TO_QB[cat] || "Miscellaneous Expense";

          const [qbRange, setQbRange] = [reportPeriod, setReportPeriod];

          const qbPresets = [
            { label: "This Month", fn: () => { const m = String(TODAY.getMonth() + 1).padStart(2, "0"); setQbRange({ from: TODAY.getFullYear() + "-" + m + "-01", to: TODAY.toISOString().split("T")[0] }); }},
            { label: "This Quarter", fn: () => { const q = Math.floor(TODAY.getMonth() / 3); const qStart = new Date(TODAY.getFullYear(), q * 3, 1); setQbRange({ from: qStart.toISOString().split("T")[0], to: TODAY.toISOString().split("T")[0] }); }},
            { label: "This Year", fn: () => setQbRange({ from: TODAY.getFullYear() + "-01-01", to: TODAY.toISOString().split("T")[0] }) },
          ];

          // Income rows from payments (charges with amountPaid > 0)
          const incomeRows = rIncomePayments.map(p => ({
            Date: p.date,
            "Transaction Type": "Invoice",
            Account: "Rental Income",
            Description: (p.category || "Rent") + (p.tenantName ? " - " + p.tenantName : ""),
            Amount: Number(p.amount).toFixed(2),
            Name: p.tenantName || "",
            Class: p.propName || "",
          }));

          // Expense rows
          const expenseRows = rExpenses.map(e => {
            const propObj = props.find(p => p.id === e.propId);
            return {
              Date: e.date,
              "Transaction Type": "Expense",
              Account: mapAccount(e.category),
              Description: e.desc || e.category || "",
              Amount: Number(e.amount).toFixed(2),
              Name: e.vendor || e.payee || "",
              Class: propObj ? getPropDisplayName(propObj) : (e.propId === "shared" ? "Shared" : ""),
            };
          });

          const allRows = [...incomeRows, ...expenseRows].sort((a, b) => a.Date.localeCompare(b.Date));
          const qbHeaders = ["Date", "Transaction Type", "Account", "Description", "Amount", "Name", "Class"];

          const downloadQB = () => {
            const csv = [qbHeaders.join(","), ...allRows.map(r => qbHeaders.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "propos-qb-export-" + TODAY.toISOString().split("T")[0] + ".csv";
            a.click();
            URL.revokeObjectURL(url);
          };

          return (<>
            {/* Date range presets */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b5e52" }}>Quick range:</span>
              {qbPresets.map(p => (
                <button key={p.label} className="btn btn-out btn-sm" onClick={p.fn}>{p.label}</button>
              ))}
              <span style={{ fontSize: 10, color: "#999", marginLeft: 8 }}>or use the date filters above</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn btn-sm" style={{ background: _acc, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }} onClick={downloadQB}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Download QuickBooks CSV
              </button>
              <span style={{ fontSize: 11, color: "#6b5e52" }}>{allRows.length} transactions ({incomeRows.length} income, {expenseRows.length} expenses) &middot; {rFrom} to {rTo}</span>
            </div>

            {/* Account mapping reference */}
            <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(0,0,0,.02)", borderRadius: 8, border: "1px solid rgba(0,0,0,.04)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Schedule E to QuickBooks Account Mapping</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "2px 16px", fontSize: 10, color: "#6b5e52" }}>
                {Object.entries(SCHED_E_TO_QB).map(([k, v]) => (
                  <div key={k}><span style={{ fontWeight: 600 }}>{k}</span> &rarr; {v}</div>
                ))}
              </div>
            </div>

            {/* Preview table */}
            <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  {qbHeaders.map(h => <th key={h} style={{ ...thS, textAlign: h === "Amount" ? "right" : "left" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {allRows.length === 0 && <tr><td colSpan={7} style={{ ...tdS, textAlign: "center", color: "#999", padding: 32 }}>No transactions in this date range</td></tr>}
                  {allRows.slice(0, 50).map((r, i) => (
                    <tr key={i} style={trAlt(i)}>
                      {qbHeaders.map(h => <td key={h} style={{ ...tdS, textAlign: h === "Amount" ? "right" : "left", fontWeight: h === "Amount" ? 600 : 400, color: r["Transaction Type"] === "Invoice" ? _grn : "inherit" }}>{r[h]}</td>)}
                    </tr>
                  ))}
                  {allRows.length > 50 && <tr><td colSpan={7} style={{ ...tdS, textAlign: "center", color: "#999", fontSize: 10, padding: 12 }}>Showing first 50 of {allRows.length} rows. Download CSV for full data.</td></tr>}
                </tbody>
              </table>
            </TW>
          </>);
        })()}

        {/* ── 1099 Vendor Report ── */}
        {activeReport === "1099report" && (() => {
          const [taxYear, setTaxYear] = useState(String(TODAY.getFullYear()));
          const yearStart = taxYear + "-01-01";
          const yearEnd = taxYear + "-12-31";
          // Compute total paid per vendor from expenses in the selected tax year
          const yearExpenses = expenses.filter(e => e.date >= yearStart && e.date <= yearEnd);
          const vendorTotals = {};
          yearExpenses.forEach(e => {
            const vName = e.vendor || "";
            if (!vName) return;
            vendorTotals[vName] = (vendorTotals[vName] || 0) + (e.amount || 0);
          });
          // Merge with vendor records
          const vendorRows = (vendors || []).map(v => {
            const paid = vendorTotals[v.name] || 0;
            return { name: v.name, totalPaid: paid, tin: v.ein || v.ssn || v.tin || v.taxId || "", address: v.address || "", phone: v.phone || "", email: v.email || "" };
          });
          // Also include vendors from expenses that aren't in the vendors list
          Object.keys(vendorTotals).forEach(vName => {
            if (!vendorRows.find(r => r.name === vName)) {
              vendorRows.push({ name: vName, totalPaid: vendorTotals[vName], tin: "", address: "", phone: "", email: "" });
            }
          });
          vendorRows.sort((a, b) => b.totalPaid - a.totalPaid);
          const threshold600 = vendorRows.filter(v => v.totalPaid >= 600);
          const approaching = vendorRows.filter(v => v.totalPaid >= 500 && v.totalPaid < 600);
          const payerName = settings?.companyName || settings?.ownerName || "Owner";
          const payerEIN = settings?.ein || settings?.taxId || "";
          const necRows = threshold600.map(v => ({
            "Payer Name": payerName, "Payer EIN": payerEIN, "Recipient Name": v.name,
            "Recipient TIN": v.tin || "Not on file", "Nonemployee Compensation": v.totalPaid.toFixed(2),
            "Recipient Address": v.address || "Not on file",
          }));

          return (<>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a" }}>Tax Year:</label>
              <select value={taxYear} onChange={e => setTaxYear(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit" }}>
                {[String(TODAY.getFullYear()), String(TODAY.getFullYear() - 1), String(TODAY.getFullYear() - 2)].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {threshold600.length > 0 && csvBtn(necRows, ["Payer Name", "Payer EIN", "Recipient Name", "Recipient TIN", "Nonemployee Compensation", "Recipient Address"], `1099-nec-${taxYear}`)}
            </div>

            {/* Summary banner */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Vendors >= $600", value: threshold600.length, color: _red },
                { label: "Approaching ($500-599)", value: approaching.length, color: _gold },
                { label: "Total Vendors", value: vendorRows.length, color: "#5c4a3a" },
                { label: "Total Paid", value: fmt(vendorRows.reduce((s, v) => s + v.totalPaid, 0)), color: _acc },
              ].map(k => <div key={k.label} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(0,0,0,.06)", textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.value}</div>
              </div>)}
            </div>

            {vendorRows.length === 0 && <div style={{ textAlign: "center", padding: 36, color: "#6b5e52", background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>No vendor expenses found for {taxYear}. Log expenses with vendor names in the Accounting tab.</div>}

            {vendorRows.length > 0 && <TW>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                  {["Vendor Name", "Total Paid ($)", "EIN / SSN", "Address", "1099 Required"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Vendor Name" ? "left" : h === "Total Paid ($)" ? "right" : "center" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {vendorRows.filter(v => v.totalPaid > 0).map((v, i) => {
                    const needs1099 = v.totalPaid >= 600;
                    const isApproaching = v.totalPaid >= 500 && v.totalPaid < 600;
                    return (<tr key={v.name} style={{ ...trAlt(i), background: isApproaching ? hexToRgba(_gold, .06) : needs1099 ? hexToRgba(_red, .03) : trAlt(i).background }}>
                      <td style={{ ...tdS, fontWeight: 700 }}>{v.name}</td>
                      <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: needs1099 ? _red : isApproaching ? "#9a7422" : "inherit" }}>{fmt(v.totalPaid)}</td>
                      <td style={{ ...tdS, textAlign: "center", fontSize: 10, color: v.tin ? "#5c4a3a" : "#c45c4a" }}>{v.tin || "Not on file"}</td>
                      <td style={{ ...tdS, textAlign: "center", fontSize: 10, color: v.address ? "#5c4a3a" : "#999" }}>{v.address || "Not on file"}</td>
                      <td style={{ ...tdS, textAlign: "center" }}>
                        {needs1099 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: hexToRgba(_red, .08), color: _red }}>Yes</span>}
                        {isApproaching && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: hexToRgba(_gold, .1), color: "#9a7422" }}>Approaching</span>}
                        {!needs1099 && !isApproaching && <span style={{ fontSize: 9, color: "#999" }}>No</span>}
                      </td>
                    </tr>);
                  })}
                </tbody>
                <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                  <td style={{ ...tdS, fontWeight: 800 }}>Total ({vendorRows.filter(v => v.totalPaid > 0).length} vendors)</td>
                  <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _acc }}>{fmt(vendorRows.reduce((s, v) => s + v.totalPaid, 0))}</td>
                  <td colSpan={3} />
                </tr></tfoot>
              </table>
            </TW>}

            {threshold600.length > 0 && !payerEIN && <div style={{ padding: "10px 14px", background: "rgba(196,92,74,.04)", borderRadius: 8, border: "1px solid rgba(196,92,74,.15)", marginTop: 14, fontSize: 11, color: "#8b4a3a" }}>
              Payer EIN is not configured. Add your EIN in Settings for accurate 1099-NEC exports.
            </div>}
          </>);
        })()}

        {/* ── Year-End Tax Package ── */}
        {activeReport === "yearendtax" && (() => {
          const [taxYear, setTaxYear] = useState(String(TODAY.getFullYear()));
          const yearStart = taxYear + "-01-01";
          const yearEnd = taxYear + "-12-31";
          const yearMonths = 12;

          // Year-filtered data
          const yCharges = charges.filter(c => c.dueDate >= yearStart && c.dueDate <= yearEnd);
          const yPayments = charges.flatMap(c => (c.payments || []).map(p => ({ ...p, propName: c.propName, category: c.category }))).filter(p => p.date >= yearStart && p.date <= yearEnd && p.category !== "Security Deposit");
          const yExpenses = expenses.filter(e => e.date >= yearStart && e.date <= yearEnd);
          const yMortgages = mortgages || [];
          const ySD = sdLedger || [];
          const yImprovements = (improvements || []).filter(im => im.date >= yearStart && im.date <= yearEnd);
          const ySharedExpAlloc = (amount) => Math.round(amount / (props.length || 1) * 100) / 100;

          // 1. Schedule E per property
          const schedERows = [];
          props.forEach(pr => {
            const prIncome = yPayments.filter(p => p.propName === pr.name).reduce((s, p) => s + p.amount, 0);
            const prExp = [...yExpenses.filter(e => e.propId === pr.id), ...yExpenses.filter(e => e.propId === "shared").map(e => ({ ...e, amount: ySharedExpAlloc(e.amount) }))];
            const expByLine = {}; prExp.forEach(e => { expByLine[e.category] = (expByLine[e.category] || 0) + e.amount; });
            // Mortgage interest estimate
            const mg = yMortgages.filter(m => m.propId === pr.id);
            const mgInterest = mg.reduce((s, m) => {
              if (!m.currentBalance || !m.interestRate) return s;
              return s + (m.currentBalance * (m.interestRate / 100) / 12) * yearMonths;
            }, 0);
            if (mgInterest > 0 && !expByLine["Mortgage Interest"]) expByLine["Mortgage Interest"] = mgInterest;
            const totalExp = Object.values(expByLine).reduce((s, v) => s + v, 0);
            schedERows.push({ Property: getPropDisplayName(pr), Line: "3 - Gross Rents", Amount: prIncome.toFixed(2) });
            SCHED_E_CATS.forEach(({ label: cat }) => { if (expByLine[cat]) schedERows.push({ Property: getPropDisplayName(pr), Line: cat, Amount: expByLine[cat].toFixed(2) }); });
            schedERows.push({ Property: getPropDisplayName(pr), Line: "22 - Total Expenses", Amount: totalExp.toFixed(2) });
            schedERows.push({ Property: getPropDisplayName(pr), Line: "Net Income / (Loss)", Amount: (prIncome - totalExp).toFixed(2) });
          });

          // 2. 1099 vendor list
          const vendorTotals = {};
          yExpenses.forEach(e => { if (e.vendor) vendorTotals[e.vendor] = (vendorTotals[e.vendor] || 0) + (e.amount || 0); });
          const vendor1099Rows = Object.entries(vendorTotals).filter(([, amt]) => amt >= 600).sort((a, b) => b[1] - a[1]).map(([name, amt]) => {
            const v = (vendors || []).find(x => x.name === name) || {};
            return { "Vendor Name": name, "Total Paid": amt.toFixed(2), "TIN": v.ein || v.ssn || v.tin || v.taxId || "Not on file", "Address": v.address || "Not on file" };
          });

          // 3. Mortgage interest summary
          const mortgageRows = [];
          props.forEach(pr => {
            const mg = yMortgages.filter(m => m.propId === pr.id);
            mg.forEach(m => {
              const interest = m.currentBalance && m.interestRate ? (m.currentBalance * (m.interestRate / 100) / 12) * yearMonths : 0;
              mortgageRows.push({ Property: getPropDisplayName(pr), Lender: m.lender || "", Balance: (m.currentBalance || 0).toFixed(2), Rate: (m.interestRate || 0) + "%", "Est. Interest Paid": interest.toFixed(2), "Monthly P&I": (m.monthlyPI || 0).toFixed(2) });
            });
          });

          // 4. Security deposit summary
          const sdRows = ySD.map(s => {
            const ded = (s.deductions || []).reduce((sum, d) => sum + d.amount, 0);
            return { Tenant: s.tenantName || "", Property: propDisplay(s.propName), Room: s.roomName || "", "Amount Held": (s.amountHeld || 0).toFixed(2), Deductions: ded.toFixed(2), "Net Held": ((s.amountHeld || 0) - ded).toFixed(2), Status: s.returned ? "Returned" : "Held" };
          });

          // 5. Depreciation schedule
          const usefulLifeMap = { "Roof": 27.5, "HVAC": 27.5, "Appliance": 5, "Appliances": 5, "Flooring": 5, "Plumbing": 15, "Electrical": 15, "Addition": 27.5, "Renovation": 27.5, "Landscaping": 15, "Paving": 15 };
          const allImprovements = (improvements || []).filter(im => im.date <= yearEnd);
          const depRows = allImprovements.map(im => {
            const life = usefulLifeMap[im.improvementType] || 27.5;
            const annualDep = im.amount / life;
            const yearsInService = Math.max(0, parseInt(taxYear) - parseInt((im.date || "").slice(0, 4)));
            const propName = (props.find(p => p.id === im.propId) || {}).name || "";
            return { Property: propName ? getPropDisplayName(props.find(p => p.id === im.propId) || { name: propName }) : "Unknown", Asset: im.description || im.improvementType || "", "Date Placed": im.date || "", "Cost Basis": im.amount.toFixed(2), "Useful Life (yrs)": life, "Annual Depreciation": annualDep.toFixed(2), "Years in Service": yearsInService, "Accum. Depreciation": Math.min(im.amount, annualDep * Math.max(1, yearsInService)).toFixed(2) };
          });

          const exportTaxPackage = () => {
            // Schedule E
            exportCSV(schedERows, ["Property", "Line", "Amount"], `schedule-e-${taxYear}`);
            let delay = 200;
            // 1099 vendors
            if (vendor1099Rows.length > 0) { setTimeout(() => exportCSV(vendor1099Rows, ["Vendor Name", "Total Paid", "TIN", "Address"], `1099-vendors-${taxYear}`), delay); delay += 200; }
            // Mortgage interest
            if (mortgageRows.length > 0) { setTimeout(() => exportCSV(mortgageRows, ["Property", "Lender", "Balance", "Rate", "Est. Interest Paid", "Monthly P&I"], `mortgage-interest-${taxYear}`), delay); delay += 200; }
            // Security deposits
            if (sdRows.length > 0) { setTimeout(() => exportCSV(sdRows, ["Tenant", "Property", "Room", "Amount Held", "Deductions", "Net Held", "Status"], `security-deposits-${taxYear}`), delay); delay += 200; }
            // Depreciation
            if (depRows.length > 0) { setTimeout(() => exportCSV(depRows, ["Property", "Asset", "Date Placed", "Cost Basis", "Useful Life (yrs)", "Annual Depreciation", "Years in Service", "Accum. Depreciation"], `depreciation-${taxYear}`), delay); }
          };

          // Count sections
          const sectionCount = 1 + (vendor1099Rows.length > 0 ? 1 : 0) + (mortgageRows.length > 0 ? 1 : 0) + (sdRows.length > 0 ? 1 : 0) + (depRows.length > 0 ? 1 : 0);

          return (<>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a" }}>Tax Year:</label>
              <select value={taxYear} onChange={e => setTaxYear(e.target.value)} style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 11, fontFamily: "inherit" }}>
                {[String(TODAY.getFullYear()), String(TODAY.getFullYear() - 1), String(TODAY.getFullYear() - 2)].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Main download card */}
            <div style={{ padding: "14px 16px", background: hexToRgba(_acc, .04), borderRadius: 10, border: "1px solid " + hexToRgba(_acc, .2), marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: _acc, marginBottom: 6 }}>Year-End Tax Package -- {taxYear}</div>
              <div style={{ fontSize: 11, color: "#6b5e52", lineHeight: 1.6, marginBottom: 10 }}>
                Downloads {sectionCount} CSV file{sectionCount !== 1 ? "s" : ""}: Schedule E summary{vendor1099Rows.length > 0 ? ", 1099 vendor list" : ""}{mortgageRows.length > 0 ? ", mortgage interest" : ""}{sdRows.length > 0 ? ", security deposits" : ""}{depRows.length > 0 ? ", depreciation schedule" : ""}. Hand these to your CPA.
              </div>
              <button className="btn btn-green btn-sm" style={{ fontWeight: 700, fontSize: 12, padding: "8px 20px" }} onClick={exportTaxPackage}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Generate Tax Package ({sectionCount} CSVs)
              </button>
            </div>

            {/* Section previews */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Schedule E Summary</div>
            {props.map(pr => {
              const inc = yPayments.filter(p => p.propName === pr.name).reduce((s, p) => s + p.amount, 0);
              const prExpArr = [...yExpenses.filter(e => e.propId === pr.id), ...yExpenses.filter(e => e.propId === "shared").map(e => ({ ...e, amount: ySharedExpAlloc(e.amount) }))];
              const exp = prExpArr.reduce((s, e) => s + e.amount, 0);
              const noi = inc - exp;
              return (<div key={pr.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(0,0,0,.06)", padding: "10px 16px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700, fontSize: 12 }}>{getPropDisplayName(pr)}</div><div style={{ fontSize: 10, color: "#6b5e52", marginTop: 2 }}>Income {fmt(inc)} / Expenses {fmt(exp)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, fontSize: 15, color: noi >= 0 ? _grn : _red }}>{fmtParen(noi)}</div><div style={{ fontSize: 9, color: "#6b5e52" }}>NOI</div></div>
              </div>);
            })}

            {vendor1099Rows.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .8, marginTop: 16, marginBottom: 8 }}>1099 Vendors ({vendor1099Rows.length})</div>
              <TW>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                    {["Vendor", "Total Paid ($)", "TIN", "Address"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Vendor" ? "left" : h === "Total Paid ($)" ? "right" : "center" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{vendor1099Rows.map((v, i) => <tr key={v["Vendor Name"]} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 700 }}>{v["Vendor Name"]}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(parseFloat(v["Total Paid"]))}</td>
                    <td style={{ ...tdS, textAlign: "center", fontSize: 10, color: v.TIN !== "Not on file" ? "#5c4a3a" : "#c45c4a" }}>{v.TIN}</td>
                    <td style={{ ...tdS, textAlign: "center", fontSize: 10, color: v.Address !== "Not on file" ? "#5c4a3a" : "#999" }}>{v.Address}</td>
                  </tr>)}</tbody>
                </table>
              </TW>
            </>}

            {mortgageRows.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .8, marginTop: 16, marginBottom: 8 }}>Mortgage Interest Summary</div>
              <TW>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                    {["Property", "Lender", "Balance ($)", "Rate", "Est. Interest ($)"].map(h => <th key={h} style={{ ...thS, textAlign: h === "Property" || h === "Lender" ? "left" : "right" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{mortgageRows.map((m, i) => <tr key={i} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 600 }}>{m.Property}</td>
                    <td style={tdS}>{m.Lender}</td>
                    <td style={{ ...tdS, textAlign: "right" }}>{fmt(parseFloat(m.Balance))}</td>
                    <td style={{ ...tdS, textAlign: "right" }}>{m.Rate}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(parseFloat(m["Est. Interest Paid"]))}</td>
                  </tr>)}</tbody>
                  <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                    <td colSpan={4} style={{ ...tdS, fontWeight: 800 }}>Total Interest</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(mortgageRows.reduce((s, m) => s + parseFloat(m["Est. Interest Paid"]), 0))}</td>
                  </tr></tfoot>
                </table>
              </TW>
              <div style={{ fontSize: 10, color: "#6b5e52", padding: "6px 12px", marginTop: 4 }}>Interest amounts are estimated from current balance and rate. Replace with actual 1098 amounts for filing.</div>
            </>}

            {sdRows.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .8, marginTop: 16, marginBottom: 8 }}>Security Deposit Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8, marginBottom: 8 }}>
                {[
                  { label: "Total Held", value: fmt(sdRows.reduce((s, r) => s + parseFloat(r["Amount Held"]), 0)), color: _gold },
                  { label: "Returned", value: sdRows.filter(r => r.Status === "Returned").length, color: _grn },
                  { label: "Still Held", value: sdRows.filter(r => r.Status === "Held").length, color: "#5c4a3a" },
                  { label: "Total Deductions", value: fmt(sdRows.reduce((s, r) => s + parseFloat(r.Deductions), 0)), color: _red },
                ].map(k => <div key={k.label} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(0,0,0,.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{k.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.value}</div>
                </div>)}
              </div>
            </>}

            {depRows.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .8, marginTop: 16, marginBottom: 8 }}>Depreciation Schedule ({depRows.length} assets)</div>
              <TW>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead><tr style={{ background: "#f8f7f4", borderBottom: "2px solid rgba(0,0,0,.06)" }}>
                    {["Property", "Asset", "Date Placed", "Cost Basis ($)", "Life (yrs)", "Annual Dep ($)"].map(h => <th key={h} style={{ ...thS, textAlign: ["Property", "Asset", "Date Placed"].includes(h) ? "left" : "right" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{depRows.map((d, i) => <tr key={i} style={trAlt(i)}>
                    <td style={{ ...tdS, fontWeight: 600, fontSize: 10 }}>{d.Property}</td>
                    <td style={tdS}>{d.Asset}</td>
                    <td style={{ ...tdS, fontSize: 10, color: "#6b5e52" }}>{d["Date Placed"]}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700 }}>{fmt(parseFloat(d["Cost Basis"]))}</td>
                    <td style={{ ...tdS, textAlign: "right" }}>{d["Useful Life (yrs)"]}</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: _red }}>{fmt(parseFloat(d["Annual Depreciation"]))}</td>
                  </tr>)}</tbody>
                  <tfoot><tr style={{ background: "#f8f7f4", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                    <td colSpan={3} style={{ ...tdS, fontWeight: 800 }}>Total</td>
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800 }}>{fmt(depRows.reduce((s, d) => s + parseFloat(d["Cost Basis"]), 0))}</td>
                    <td />
                    <td style={{ ...tdS, textAlign: "right", fontWeight: 800, color: _red }}>{fmt(depRows.reduce((s, d) => s + parseFloat(d["Annual Depreciation"]), 0))}/yr</td>
                  </tr></tfoot>
                </table>
              </TW>
            </>}
          </>);
        })()}

      </>);
    })()}
  </>);
}
