"use client";
import { useState, useMemo } from "react";

const DEF_CHARGE_CATS = ["Rent","Last Month Rent","Utilities","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
const DEF_DEF_QUICK_CATS = ["Rent","Late Fee","Utilities","Security Deposit"];

export default function QuickAddCharge({ charges, props, onAdd, onCancel, uid, TODAY, CHARGE_CATS = DEF_CHARGE_CATS }) {
  const today = TODAY || new Date().toISOString().slice(0, 10);
  const [roomId, setRoomId] = useState("");
  const [category, setCategory] = useState("");
  const [showAllCats, setShowAllCats] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [desc, setDesc] = useState("");

  const occupiedRooms = useMemo(() => {
    const rooms = [];
    (props || []).forEach(p => {
      (p.rooms || []).forEach(r => {
        if (r.tenant) {
          rooms.push({
            roomId: r.id,
            tenantName: r.tenant,
            propName: p.name || p.addr,
            roomName: r.name,
            rent: r.rent || 0,
            propId: p.id,
          });
        }
      });
    });
    return rooms;
  }, [props]);

  const selectedRoom = useMemo(() => occupiedRooms.find(r => r.roomId === roomId), [occupiedRooms, roomId]);

  const pickCategory = (cat) => {
    setCategory(cat);
    setShowAllCats(false);
    if (selectedRoom && cat === "Rent") {
      setAmount(String(selectedRoom.rent || ""));
      const d = new Date(today);
      d.setMonth(d.getMonth() + 1, 1);
      setDueDate(d.toISOString().slice(0, 10));
      const mo = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      setDesc(mo + " Rent");
    } else {
      if (cat !== "Rent") setDueDate(today);
      setDesc(cat);
    }
  };

  const submit = () => {
    if (!roomId || !category || !amount) return;
    const r = selectedRoom;
    onAdd({
      id: uid ? uid() : "ch-" + Date.now(),
      roomId: r.roomId,
      tenantName: r.tenantName,
      propName: r.propName,
      roomName: r.roomName,
      category,
      desc: desc || category,
      amount: parseFloat(amount),
      amountPaid: 0,
      dueDate: dueDate || today,
      createdDate: today,
      payments: [],
      waived: false,
      voided: false,
    });
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="card-bd">
        <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Create Charge
        </h3>
        <div className="fld" style={{ marginBottom: 10 }}>
          <label>Tenant</label>
          <select value={roomId} onChange={e => { setRoomId(e.target.value); if (category) pickCategory(category); }} style={{ width: "100%" }}>
            <option value="">Select tenant...</option>
            {occupiedRooms.map(r => (
              <option key={r.roomId} value={r.roomId}>{r.tenantName} -- {r.propName}, {r.roomName}</option>
            ))}
          </select>
        </div>
        <div className="fld" style={{ marginBottom: 10 }}>
          <label>Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {DEF_QUICK_CATS.map(c => (
              <button key={c} onClick={() => pickCategory(c)}
                style={{
                  fontSize: 11, fontWeight: 600, padding: "5px 12px", minHeight: 44, borderRadius: 6,
                  border: "1px solid " + (category === c ? "#1a1714" : "rgba(0,0,0,.1)"),
                  background: category === c ? "#1a1714" : "#fff",
                  color: category === c ? "#f5f0e8" : "#5c4a3a",
                  cursor: "pointer", fontFamily: "inherit",
                }}>{c}</button>
            ))}
            <button onClick={() => setShowAllCats(!showAllCats)}
              style={{
                fontSize: 11, fontWeight: 600, padding: "5px 12px", minHeight: 44, borderRadius: 6,
                border: "1px solid " + (showAllCats || (category && !DEF_QUICK_CATS.includes(category)) ? "#1a1714" : "rgba(0,0,0,.1)"),
                background: (showAllCats || (category && !DEF_QUICK_CATS.includes(category))) ? "#1a1714" : "#fff",
                color: (showAllCats || (category && !DEF_QUICK_CATS.includes(category))) ? "#f5f0e8" : "#5c4a3a",
                cursor: "pointer", fontFamily: "inherit",
              }}>Other</button>
          </div>
          {showAllCats && (
            <select value={category} onChange={e => pickCategory(e.target.value)} style={{ width: "100%", marginTop: 6 }}>
              <option value="">Select category...</option>
              {CHARGE_CATS.filter(c => !DEF_QUICK_CATS.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
          <div className="fld">
            <label>Amount</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%" }} />
          </div>
          <div className="fld">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div className="fld" style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Auto-generated" style={{ width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button className="btn btn-out btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-green btn-sm" disabled={!roomId || !category || !amount} onClick={submit}>Create Charge</button>
        </div>
      </div>
    </div>
  );
}
