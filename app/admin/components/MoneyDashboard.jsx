"use client";
import { useState, useMemo } from "react";

export default function MoneyDashboard({ charges = [], expenses = [], credits = [], sdLedger = [], mortgages = [], props = [], settings, vendors, improvements = [], goTab, setModal, createCharge, TODAY }) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const [period, setPeriod] = useState("month");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  /* ---- helpers ---- */
  const chargeStatus = (c) => {
    if (c.voided) return "voided";
    if (c.waived) return "waived";
    if (c.amountPaid >= c.amount) return "paid";
    if (c.amountPaid > 0) return "partial";
    if (new Date(c.dueDate + "T00:00:00") < TODAY) return "pastdue";
    return "unpaid";
  };
  const allRooms = (p) => (p.units || []).flatMap(u => (u.rooms || []).map(r => ({ ...r, unitName: u.name, propName: p.addr || p.name, propId: p.id })));
  const fmt = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const pct = (n) => Math.round(n * 100);
  const toYM = (d) => (d || "").slice(0, 7);
  const now = TODAY || new Date();
  const curYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const curYear = now.getFullYear();
  const daysBetween = (a, b) => Math.max(0, Math.floor((b - new Date(a + "T00:00:00")) / 864e5));

  /* ---- period logic ---- */
  const periodRange = useMemo(() => {
    const y = now.getFullYear(), m = now.getMonth(), q = Math.floor(m / 3);
    if (period === "month") return { from: `${y}-${String(m + 1).padStart(2, "0")}-01`, to: `${y}-${String(m + 1).padStart(2, "0")}-31` };
    if (period === "q1") { const qs = q * 3; return { from: `${y}-${String(qs + 1).padStart(2, "0")}-01`, to: `${y}-${String(qs + 3).padStart(2, "0")}-31` }; }
    if (period === "ytd") return { from: `${y}-01-01`, to: `${y}-12-31` };
    if (period === "lastyear") return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
    if (period === "custom" && customRange.from && customRange.to) return customRange;
    return { from: `${y}-${String(m + 1).padStart(2, "0")}-01`, to: `${y}-${String(m + 1).padStart(2, "0")}-31` };
  }, [period, customRange, now]);

  /* ---- computed ---- */
  const data = useMemo(() => {
    /* all payments flattened with dates */
    const allPayments = charges.flatMap(c => (c.payments || []).map(p => ({ ...p, chargeId: c.id, propName: c.propName, propId: c.propId, tenantName: c.tenantName })));

    /* MTD payments */
    const mtdPayments = allPayments.filter(p => toYM(p.date) === curYM);
    const collectedMTD = mtdPayments.reduce((s, p) => s + (p.amount || 0), 0);

    /* YTD payments */
    const ytdPayments = allPayments.filter(p => (p.date || "").startsWith(String(curYear)));
    const collectedYTD = ytdPayments.reduce((s, p) => s + (p.amount || 0), 0);

    /* Expected this month: charges due this month, not voided/waived */
    const mtdCharges = charges.filter(c => toYM(c.dueDate) === curYM && !c.voided && !c.waived);
    const expectedMTD = mtdCharges.reduce((s, c) => s + (c.amount || 0), 0);

    /* Past due */
    const pastDue = charges.filter(c => { const st = chargeStatus(c); return st === "pastdue" || (st === "partial" && new Date(c.dueDate + "T00:00:00") < now); });
    const pastDueAmt = pastDue.reduce((s, c) => s + ((c.amount || 0) - (c.amountPaid || 0)), 0);
    const pastDueTenants = new Set(pastDue.map(c => c.tenantName)).size;

    /* Expenses MTD & YTD */
    const expMTD = expenses.filter(e => toYM(e.date) === curYM).reduce((s, e) => s + (e.amount || 0), 0);
    const expYTD = expenses.filter(e => (e.date || "").startsWith(String(curYear))).reduce((s, e) => s + (e.amount || 0), 0);

    /* NOI */
    const noiMTD = collectedMTD - expMTD;
    const noiYTD = collectedYTD - expYTD;
    const noiMarginMTD = collectedMTD > 0 ? noiMTD / collectedMTD : 0;

    /* DSCR */
    const annualDebt = (mortgages || []).reduce((s, m) => s + (m.monthlyPI || 0) * 12, 0);
    /* Annualize from trailing 12 months */
    const t12Payments = allPayments.filter(p => { const d = new Date(p.date + "T00:00:00"); return d >= new Date(now.getFullYear() - 1, now.getMonth(), 1); });
    const t12Income = t12Payments.reduce((s, p) => s + (p.amount || 0), 0);
    const t12Start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const t12Exp = expenses.filter(e => new Date(e.date + "T00:00:00") >= t12Start).reduce((s, e) => s + (e.amount || 0), 0);
    const annualNOI = t12Income - t12Exp;
    const dscr = annualDebt > 0 ? annualNOI / annualDebt : null;

    /* Collection rate + trailing 3 months */
    const collectionRate = expectedMTD > 0 ? collectedMTD / expectedMTD : 0;
    const trail3 = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const exp = charges.filter(c => toYM(c.dueDate) === ym && !c.voided && !c.waived).reduce((s, c) => s + (c.amount || 0), 0);
      const col = allPayments.filter(p => toYM(p.date) === ym).reduce((s, p) => s + (p.amount || 0), 0);
      trail3.push(exp > 0 ? col / exp : 0);
    }

    /* Trailing 12 months chart */
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      const inc = allPayments.filter(p => toYM(p.date) === ym).reduce((s, p) => s + (p.amount || 0), 0);
      const exp = expenses.filter(e => toYM(e.date) === ym).reduce((s, e) => s + (e.amount || 0), 0);
      months.push({ ym, label, inc, exp, net: inc - exp });
    }
    const chartMax = Math.max(1, ...months.map(m => Math.max(m.inc, m.exp)));
    const avgInc = Math.round(months.reduce((s, m) => s + m.inc, 0) / 12);
    const avgExp = Math.round(months.reduce((s, m) => s + m.exp, 0) / 12);

    /* Forecast next 3 months */
    const last3Exp = months.slice(-3).reduce((s, m) => s + m.exp, 0) / 3;
    const occupiedRooms = (props || []).flatMap(p => allRooms(p)).filter(r => r.tenant);
    const monthlyRentTotal = occupiedRooms.reduce((s, r) => s + (r.rent || 0), 0);
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleString("en-US", { month: "long" });
      forecast.push({ label, income: monthlyRentTotal, expenses: Math.round(last3Exp), net: monthlyRentTotal - Math.round(last3Exp) });
    }

    /* Property performance */
    const propPerf = (props || []).map(p => {
      const pName = p.addr || p.name;
      const rooms = allRooms(p);
      const occupied = rooms.filter(r => r.tenant).length;
      const total = rooms.length;
      const pPayments = mtdPayments.filter(pm => pm.propName === pName);
      const rev = pPayments.reduce((s, pm) => s + (pm.amount || 0), 0);
      const pExpMTD = expenses.filter(e => toYM(e.date) === curYM && (e.propId === p.id || e.propName === pName)).reduce((s, e) => s + (e.amount || 0), 0);
      /* Shared expenses (no propId) split equally */
      const sharedExp = expenses.filter(e => toYM(e.date) === curYM && !e.propId && !e.propName).reduce((s, e) => s + (e.amount || 0), 0);
      const propShare = (props || []).length > 0 ? sharedExp / props.length : 0;
      const expTotal = pExpMTD + propShare;
      const noi = rev - expTotal;
      const margin = rev > 0 ? noi / rev : 0;
      /* Annual figures for DSCR & cap rate */
      const pPaymentsAnnual = allPayments.filter(pm => pm.propName === pName && new Date(pm.date + "T00:00:00") >= t12Start);
      const annRev = pPaymentsAnnual.reduce((s, pm) => s + (pm.amount || 0), 0);
      const pExpAnnual = expenses.filter(e => new Date(e.date + "T00:00:00") >= t12Start && (e.propId === p.id || e.propName === pName)).reduce((s, e) => s + (e.amount || 0), 0);
      const annNOI = annRev - pExpAnnual;
      const pMortgage = (mortgages || []).filter(m => m.propId === p.id);
      const annDebt = pMortgage.reduce((s, m) => s + (m.monthlyPI || 0) * 12, 0);
      const pDSCR = annDebt > 0 ? annNOI / annDebt : null;
      const capRate = p.value > 0 ? annNOI / p.value : null;
      return { id: p.id, name: pName, occupied, total, rev, exp: expTotal, noi, margin, dscr: pDSCR, capRate };
    });

    /* Needs attention */
    const pastDueSorted = [...pastDue].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const soon = charges.filter(c => {
      if (c.voided || c.waived || c.amountPaid >= c.amount) return false;
      const diff = (new Date(c.dueDate + "T00:00:00") - now) / 864e5;
      return diff >= 0 && diff <= 7;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const transit = charges.flatMap(c => (c.payments || []).filter(p => {
      if (p.depositStatus !== "transit") return false;
      return daysBetween(p.date, now) >= 3;
    }).map(p => ({ ...p, tenantName: c.tenantName, propName: c.propName })));

    return { collectedMTD, collectedYTD, expectedMTD, pastDueAmt, pastDueTenants, pastDueCount: pastDue.length, expMTD, expYTD, noiMTD, noiYTD, noiMarginMTD, dscr, annualDebt, collectionRate, trail3, months, chartMax, avgInc, avgExp, forecast, propPerf, pastDueSorted, soon, transit };
  }, [charges, expenses, props, mortgages, now, curYM, curYear]);

  /* ---- SVG icons ---- */
  const Ic = {
    dollar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={_ac} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    trend: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={_ac} strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    percent: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    building: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>,
    arrow: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };

  /* ---- sparkline for collection trend ---- */
  const Spark = ({ values, color }) => {
    const h = 20, w = 40;
    const max = Math.max(0.01, ...values);
    const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(" ");
    return <svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />{values.map((v, i) => <circle key={i} cx={(i / (values.length - 1)) * w} cy={h - (v / max) * h} r="2.5" fill={color} />)}</svg>;
  };

  /* ---- styles ---- */
  const s = {
    kpi: { flex: "1 1 170px", minWidth: 170, background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.06)", padding: "20px 22px", position: "relative", overflow: "hidden" },
    kpiAccent: (color) => ({ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: "12px 0 0 12px" }),
    kpiLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#7a7067", margin: 0 },
    kpiBig: { fontSize: 30, fontWeight: 800, margin: "6px 0 4px", lineHeight: 1.1 },
    kpiSub: { fontSize: 12, color: "#6b5e52", margin: 0, lineHeight: 1.4 },
    pill: (active) => ({ fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 20, border: "1px solid " + (active ? _ac : "rgba(0,0,0,.12)"), background: active ? _ac : "#fff", color: active ? "#fff" : "#6b5e52", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", minHeight: 44 }),
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 14, fontWeight: 800, color: "#1a1714", margin: "0 0 14px", letterSpacing: -0.2 },
    dot: (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }),
  };

  const dscrColor = dscr => dscr >= 1.25 ? _ac : dscr >= 1.0 ? "#d4a853" : "#c45c4a";
  const dscrLabel = dscr => dscr >= 1.25 ? "Strong" : dscr >= 1.0 ? "Adequate" : "At Risk";
  const crColor = r => r >= 0.95 ? _ac : r >= 0.8 ? "#d4a853" : "#c45c4a";
  const marginColor = m => m > 0.6 ? _ac : m > 0.3 ? "#d4a853" : "#c45c4a";

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Period selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["month", "This Month"], ["q1", "Quarter"], ["ytd", "YTD"], ["lastyear", "Last Year"], ["custom", "Custom"]].map(([k, l]) => (
          <button key={k} style={s.pill(period === k)} onClick={() => setPeriod(k)}>{l}</button>
        ))}
        {period === "custom" && (
          <span style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 4, flexWrap: "wrap" }}>
            <input type="date" value={customRange.from} onChange={e => setCustomRange(p => ({ ...p, from: e.target.value }))} style={{ fontSize: 16, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,.12)", fontFamily: "inherit", minHeight: 44 }} />
            <span style={{ color: "#7a7067", fontSize: 12 }}>to</span>
            <input type="date" value={customRange.to} onChange={e => setCustomRange(p => ({ ...p, to: e.target.value }))} style={{ fontSize: 16, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,.12)", fontFamily: "inherit", minHeight: 44 }} />
          </span>
        )}
      </div>

      {/* Section 1: KPI Strip */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4, ...s.section }}>
        {/* Collected */}
        <div style={s.kpi}>
          <div style={s.kpiAccent(_ac)} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>{Ic.dollar}<p style={s.kpiLabel}>Collected (MTD)</p></div>
          <p style={{ ...s.kpiBig, color: _ac }}>{fmt(data.collectedMTD)}</p>
          <p style={s.kpiSub}>of {fmt(data.expectedMTD)} expected</p>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,.06)", marginTop: 10 }}>
            <div style={{ height: 4, borderRadius: 2, background: _ac, width: `${Math.min(100, data.expectedMTD ? pct(data.collectedMTD / data.expectedMTD) : 0)}%`, transition: "width .4s" }} />
          </div>
          <p style={{ ...s.kpiSub, marginTop: 8, fontSize: 11 }}>YTD: {fmt(data.collectedYTD)}</p>
        </div>

        {/* Past Due */}
        <div style={{ ...s.kpi, cursor: data.pastDueAmt > 0 ? "pointer" : "default" }} onClick={() => data.pastDueAmt > 0 && goTab?.("ledger")}>
          <div style={s.kpiAccent(data.pastDueAmt > 0 ? "#c45c4a" : "rgba(0,0,0,.08)")} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>{Ic.alert}<p style={s.kpiLabel}>Past Due</p></div>
          <p style={{ ...s.kpiBig, color: data.pastDueAmt > 0 ? "#c45c4a" : "#1a1714" }}>{fmt(data.pastDueAmt)}</p>
          <p style={s.kpiSub}>{data.pastDueCount} charge{data.pastDueCount !== 1 ? "s" : ""} across {data.pastDueTenants} tenant{data.pastDueTenants !== 1 ? "s" : ""}</p>
        </div>

        {/* NOI */}
        <div style={s.kpi}>
          <div style={s.kpiAccent(data.noiMTD >= 0 ? _ac : "#c45c4a")} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>{Ic.trend}<p style={s.kpiLabel}>NOI (MTD)</p></div>
          <p style={{ ...s.kpiBig, color: data.noiMTD >= 0 ? _ac : "#c45c4a" }}>{fmt(data.noiMTD)}</p>
          <p style={s.kpiSub}>{pct(data.noiMarginMTD)}% margin</p>
          <p style={{ ...s.kpiSub, marginTop: 4, fontSize: 11 }}>YTD: {fmt(data.noiYTD)}</p>
        </div>

        {/* DSCR */}
        <div style={s.kpi}>
          <div style={s.kpiAccent(data.dscr != null ? dscrColor(data.dscr) : "rgba(0,0,0,.08)")} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>{Ic.shield}<p style={s.kpiLabel}>DSCR</p></div>
          <p style={{ ...s.kpiBig, color: data.dscr != null ? dscrColor(data.dscr) : "#6b5e52" }}>{data.dscr != null ? data.dscr.toFixed(2) + "x" : "N/A"}</p>
          <p style={s.kpiSub}>{data.dscr != null ? dscrLabel(data.dscr) : "No mortgages"}</p>
        </div>

        {/* Collection Rate */}
        <div style={s.kpi}>
          <div style={s.kpiAccent(crColor(data.collectionRate))} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>{Ic.percent}<p style={s.kpiLabel}>Collection Rate</p></div>
          <p style={{ ...s.kpiBig, color: crColor(data.collectionRate) }}>{pct(data.collectionRate)}%</p>
          <div style={{ marginTop: 6 }}><Spark values={data.trail3.map(v => Math.max(v, 0.01))} color={crColor(data.collectionRate)} /></div>
          <p style={{ ...s.kpiSub, marginTop: 4, fontSize: 10 }}>Trailing 3-month trend</p>
        </div>
      </div>

      {/* Section 2: Two-column */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, ...s.section }}>
        {/* Cash Flow Chart */}
        <div className="card"><div className="card-bd" style={{ padding: 22 }}>
          <h3 style={s.sectionTitle}>Cash Flow -- Trailing 12 Months</h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180, minWidth: 500 }}>
            {data.months.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: m.net >= 0 ? _ac : "#c45c4a", marginBottom: 2 }}>{m.net >= 0 ? "+" : ""}{fmt(m.net)}</span>
                <div style={{ position: "relative", width: "100%", height: 140, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 1 }}>
                  <div style={{ width: "45%", background: "rgba(0,0,0,.06)", borderRadius: "3px 3px 0 0", height: `${Math.max(2, (m.exp / data.chartMax) * 130)}px`, position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0, zIndex: 0 }} title={`Expenses: ${fmt(m.exp)}`} />
                  <div style={{ width: "45%", background: _ac, borderRadius: "3px 3px 0 0", height: `${Math.max(2, (m.inc / data.chartMax) * 130)}px`, position: "relative", zIndex: 1, opacity: 0.85 }} title={`Income: ${fmt(m.inc)}`} />
                </div>
                <span style={{ fontSize: 9, color: "#7a7067", marginTop: 4 }}>{m.label}</span>
              </div>
            ))}
          </div></div>
          <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 12, color: "#6b5e52" }}>
            <span>Avg income: <b style={{ color: _ac }}>{fmt(data.avgInc)}/mo</b></span>
            <span>Avg expenses: <b style={{ color: "#6b5e52" }}>{fmt(data.avgExp)}/mo</b></span>
            <span>Net: <b style={{ color: data.avgInc - data.avgExp >= 0 ? _ac : "#c45c4a" }}>{fmt(data.avgInc - data.avgExp)}/mo</b></span>
          </div>
        </div></div>

        {/* Forecast */}
        <div className="card"><div className="card-bd" style={{ padding: 22 }}>
          <h3 style={s.sectionTitle}>Cash Flow Forecast -- Next 90 Days</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.forecast.map((f, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,.02)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 6 }}>{f.label}</div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b5e52" }}>
                  <span>+{fmt(f.income)}</span>
                  <span>-{fmt(f.expenses)}</span>
                  <span style={{ fontWeight: 700, color: f.net >= 0 ? _ac : "#c45c4a", marginLeft: "auto" }}>= {fmt(f.net)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: "#7a7067", lineHeight: 1.5 }}>
            Income based on current occupied rents. Expenses averaged from last 3 months.
          </div>
        </div></div>
      </div>

      {/* Section 3: Property Performance */}
      {data.propPerf.length > 0 && <div style={s.section}>
        <h3 style={s.sectionTitle}>Property Performance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {data.propPerf.map(p => {
            const mColor = marginColor(p.margin);
            return (
              <div key={p.id} className="card" style={{ cursor: "pointer", overflow: "hidden" }} onClick={() => goTab?.("ledger")}>
                <div className="card-bd" style={{ padding: "18px 20px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{Ic.building}<span style={{ fontSize: 14, fontWeight: 700, color: "#1a1714" }}>{p.name}</span></div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: p.occupied === p.total ? "rgba(74,124,89,.1)" : "rgba(212,168,83,.1)", color: p.occupied === p.total ? _ac : "#d4a853" }}>
                      {p.occupied}/{p.total} occupied
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", fontSize: 12, marginBottom: 16 }}>
                    {[
                      ["Revenue (MTD)", fmt(p.rev), "#1a1714"],
                      ["Expenses (MTD)", fmt(p.exp), "#1a1714"],
                      ["NOI", fmt(p.noi), p.noi >= 0 ? _ac : "#c45c4a"],
                      ["Margin", pct(p.margin) + "%", mColor],
                      ["DSCR", p.dscr != null ? p.dscr.toFixed(2) + "x" : "N/A", p.dscr != null ? dscrColor(p.dscr) : "#6b5e52"],
                      ["Cap Rate", p.capRate != null ? (p.capRate * 100).toFixed(1) + "%" : "N/A", "#1a1714"],
                    ].map(([label, val, color], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#6b5e52" }}>{label}</span>
                        <span style={{ fontWeight: 700, color }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${mColor}, ${mColor}88)` }} />
              </div>
            );
          })}
        </div>
      </div>}

      {/* Section 4: Needs Attention */}
      {(data.pastDueSorted.length > 0 || data.soon.length > 0 || data.transit.length > 0) && <div style={s.section}>
        <h3 style={s.sectionTitle}>Needs Attention</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {/* Past Due */}
          {data.pastDueSorted.length > 0 && <div className="card"><div className="card-bd" style={{ padding: "16px 18px" }}>
            <p style={{ ...s.kpiLabel, color: "#c45c4a", marginBottom: 12 }}>Past Due</p>
            {data.pastDueSorted.slice(0, 8).map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12 }}>
                <div style={s.dot("#c45c4a")} />
                <span style={{ fontWeight: 600, color: "#1a1714", flex: 1 }}>{c.tenantName}</span>
                <span style={{ fontWeight: 700, color: "#c45c4a" }}>{fmt((c.amount || 0) - (c.amountPaid || 0))}</span>
                <span style={{ color: "#7a7067", fontSize: 11, minWidth: 65 }}>{daysBetween(c.dueDate, now)}d overdue</span>
              </div>
            ))}
            {data.pastDueSorted.length > 8 && (
              <button onClick={() => goTab?.("ledger")} style={{ background: "none", border: "none", color: _ac, fontWeight: 600, fontSize: 12, padding: "8px 0 0", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                View all {data.pastDueSorted.length} {Ic.arrow}
              </button>
            )}
          </div></div>}

          {/* Upcoming */}
          {data.soon.length > 0 && <div className="card"><div className="card-bd" style={{ padding: "16px 18px" }}>
            <p style={{ ...s.kpiLabel, color: "#d4a853", marginBottom: 12 }}>Upcoming (7 Days)</p>
            {data.soon.slice(0, 8).map(c => {
              const daysOut = Math.max(0, Math.ceil((new Date(c.dueDate + "T00:00:00") - now) / 864e5));
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12 }}>
                  <div style={s.dot("#d4a853")} />
                  <span style={{ fontWeight: 600, color: "#1a1714", flex: 1 }}>{c.tenantName}</span>
                  <span style={{ fontWeight: 700 }}>{fmt((c.amount || 0) - (c.amountPaid || 0))}</span>
                  <span style={{ color: "#7a7067", fontSize: 11, minWidth: 65 }}>in {daysOut}d</span>
                </div>
              );
            })}
            {data.soon.length > 8 && (
              <button onClick={() => goTab?.("ledger")} style={{ background: "none", border: "none", color: _ac, fontWeight: 600, fontSize: 12, padding: "8px 0 0", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                View all {data.soon.length} {Ic.arrow}
              </button>
            )}
          </div></div>}

          {/* Deposits in Transit */}
          {data.transit.length > 0 && <div className="card"><div className="card-bd" style={{ padding: "16px 18px" }}>
            <p style={{ ...s.kpiLabel, color: "#3b7dd8", marginBottom: 12 }}>Deposits in Transit</p>
            {data.transit.slice(0, 8).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12 }}>
                <div style={s.dot("#3b7dd8")} />
                <span style={{ fontWeight: 600, color: "#1a1714", flex: 1 }}>{p.tenantName}</span>
                <span style={{ fontWeight: 700, color: "#3b7dd8" }}>{fmt(p.amount)}</span>
                <span style={{ color: "#7a7067", fontSize: 11 }}>{p.method || "ACH"}</span>
                <span style={{ color: "#7a7067", fontSize: 11, minWidth: 65 }}>{daysBetween(p.date, now)}d in transit</span>
              </div>
            ))}
            {data.transit.length > 8 && (
              <button onClick={() => goTab?.("ledger")} style={{ background: "none", border: "none", color: _ac, fontWeight: 600, fontSize: 12, padding: "8px 0 0", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                View all {data.transit.length} {Ic.arrow}
              </button>
            )}
          </div></div>}
        </div>
      </div>}
    </div>
  );
}
