"use client";
import { useState, useMemo } from "react";

export default function QuickAddPayment({ charges, props, onRecord, onCancel, uid, TODAY }) {
  const PAY_METHODS = ["Zelle","Venmo","Cash","Bank Transfer","CashApp","Stripe/ACH","Check"];
  const [selTenant, setSelTenant] = useState("");
  const [selCharge, setSelCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Zelle");
  const [date, setDate] = useState(TODAY || new Date().toISOString().slice(0,10));
  const [notes, setNotes] = useState("");

  const unpaid = useMemo(() =>
    (charges || []).filter(c => !c.voided && !c.waived && c.amountPaid < c.amount),
    [charges]
  );

  const tenants = useMemo(() => {
    const map = {};
    unpaid.forEach(c => { if (c.tenantName) map[c.tenantName] = true; });
    return Object.keys(map).sort();
  }, [unpaid]);

  const tenantCharges = useMemo(() =>
    selTenant ? unpaid.filter(c => c.tenantName === selTenant) : [],
    [unpaid, selTenant]
  );

  const handleTenantChange = (name) => {
    setSelTenant(name);
    const tc = unpaid.filter(c => c.tenantName === name);
    if (tc.length === 1) {
      setSelCharge(tc[0].id);
      setAmount(String(tc[0].amount - tc[0].amountPaid));
    } else {
      setSelCharge("");
      setAmount("");
    }
  };

  const handleChargeChange = (id) => {
    setSelCharge(id);
    const c = unpaid.find(x => x.id === id);
    if (c) setAmount(String(c.amount - c.amountPaid));
  };

  const submit = () => {
    if (!selCharge || !amount || !method) return;
    onRecord(selCharge, {
      id: uid ? uid() : "py-" + Date.now(),
      amount: parseFloat(amount),
      method,
      date,
      depositDate: date,
      depositStatus: "pending",
      confId: "BB-" + Math.random().toString(36).slice(2,10).toUpperCase(),
      notes,
    });
  };

  const remaining = selCharge ? (() => { const c = unpaid.find(x => x.id === selCharge); return c ? c.amount - c.amountPaid : 0; })() : 0;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="card-bd">
        <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Record Payment
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
          <div className="fld">
            <label>Tenant</label>
            <select value={selTenant} onChange={e => handleTenantChange(e.target.value)} style={{ width: "100%" }}>
              <option value="">Select tenant...</option>
              {tenants.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Charge {remaining > 0 && <span style={{ fontWeight: 400, color: "#6b5e52" }}> -- ${remaining.toFixed(2)} remaining</span>}</label>
            <select value={selCharge} onChange={e => handleChargeChange(e.target.value)} disabled={!selTenant} style={{ width: "100%" }}>
              <option value="">{tenantCharges.length === 0 ? "Select tenant first" : "Select charge..."}</option>
              {tenantCharges.map(c => (
                <option key={c.id} value={c.id}>{c.desc || c.category} -- ${(c.amount - c.amountPaid).toFixed(2)} due</option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Amount</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: "100%" }}>
              {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Notes <span style={{ fontWeight: 400, color: "#6b5e52" }}>(optional)</span></label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" style={{ width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button className="btn btn-out btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-green btn-sm" disabled={!selCharge || !amount || !method} onClick={submit}>Record Payment</button>
        </div>
      </div>
    </div>
  );
}
