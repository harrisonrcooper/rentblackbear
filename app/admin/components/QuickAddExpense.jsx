"use client";
import { useState, useMemo } from "react";

const SCHED_E_CATS = [
  { cat: "Advertising", hint: "Listing fees, signage, online ads" },
  { cat: "Auto & Travel", hint: "Mileage to properties" },
  { cat: "Cleaning & Maintenance", hint: "Routine cleaning, landscaping" },
  { cat: "Commissions", hint: "Leasing agent fees" },
  { cat: "Insurance", hint: "Hazard, liability policies" },
  { cat: "Legal & Professional Fees", hint: "CPA, attorney" },
  { cat: "Management Fees", hint: "PM software, services" },
  { cat: "Mortgage Interest", hint: "Interest from 1098" },
  { cat: "Other Interest", hint: "Hard money interest" },
  { cat: "Repairs", hint: "Fixes that restore" },
  { cat: "Supplies", hint: "Cleaning supplies, tools" },
  { cat: "Taxes -- Property", hint: "Annual property tax" },
  { cat: "Utilities", hint: "Electric, gas, water" },
  { cat: "Depreciation", hint: "Calculated by CPA" },
  { cat: "Other", hint: "Catch-all" },
];

const PAY_METHODS = ["Zelle","Venmo","Cash","Bank Transfer","CashApp","Stripe/ACH","Check","Credit Card"];

export default function QuickAddExpense({ props, vendors, expenses, onAdd, onCancel, uid, TODAY }) {
  const [date, setDate] = useState(TODAY || new Date().toISOString().slice(0,10));
  const [amount, setAmount] = useState("");
  const [propId, setPropId] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [desc, setDesc] = useState("");
  const [method, setMethod] = useState("Zelle");
  const [receipt, setReceipt] = useState(null);

  const existingVendors = useMemo(() => {
    const set = new Set((vendors || []).map(v => typeof v === "string" ? v : v.name));
    (expenses || []).forEach(e => { if (e.vendor) set.add(e.vendor); });
    return [...set].sort();
  }, [vendors, expenses]);

  const subcats = useMemo(() => {
    if (!category) return [];
    const map = {
      "Repairs": ["Plumbing","Electrical","HVAC","Appliance","Structural","General"],
      "Cleaning & Maintenance": ["Cleaning","Landscaping","Snow Removal","Pest Control","General"],
      "Utilities": ["Electric","Gas","Water/Sewer","Trash","Internet"],
      "Insurance": ["Hazard","Liability","Flood","Umbrella"],
    };
    return map[category] || [];
  }, [category]);

  const submit = () => {
    if (!amount || !category) return;
    const prop = (props || []).find(p => p.id === propId);
    onAdd({
      id: uid ? uid() : "exp-" + Date.now(),
      date,
      propId: propId || null,
      propName: prop ? (prop.name || prop.addr) : (propId ? propId : "Shared"),
      category,
      subcategory: subcategory || null,
      description: desc,
      vendor: vendor || null,
      amount: parseFloat(amount),
      paymentMethod: method,
      notes: "",
      receiptUrl: receipt ? URL.createObjectURL(receipt) : null,
      receatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="card-bd">
        <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Expense
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="fld">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Amount</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Property</label>
            <select value={propId} onChange={e => setPropId(e.target.value)} style={{ width: "100%" }}>
              <option value="">Shared across all</option>
              {(props || []).map(p => <option key={p.id} value={p.id}>{p.name || p.addr}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory(""); }} style={{ width: "100%" }}>
              <option value="">Select category...</option>
              {SCHED_E_CATS.map(c => <option key={c.cat} value={c.cat}>{c.cat} -- {c.hint}</option>)}
            </select>
          </div>
          {subcats.length > 0 && (
            <div className="fld">
              <label>Subcategory</label>
              <select value={subcategory} onChange={e => setSubcategory(e.target.value)} style={{ width: "100%" }}>
                <option value="">Select...</option>
                {subcats.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
          <div className="fld">
            <label>Vendor</label>
            <select value={vendor} onChange={e => setVendor(e.target.value)} style={{ width: "100%" }}>
              <option value="">Select or type...</option>
              {existingVendors.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="fld" style={{ gridColumn: subcats.length > 0 ? "1 / -1" : undefined }}>
            <label>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What was this expense for?" style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: "100%" }}>
              {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Receipt</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => setReceipt(e.target.files?.[0] || null)}
              style={{ fontSize: 11, padding: "6px 0" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button className="btn btn-out btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-green btn-sm" disabled={!amount || !category} onClick={submit}>Add Expense</button>
        </div>
      </div>
    </div>
  );
}
