"use client";

const STATUS_COLORS = { paid: "#4a7c59", unpaid: "#3b82f6", pastdue: "#c45c4a", partial: "#d4a853", waived: "#999", voided: "#999" };

function getChargeStatus(c, TODAY) {
  if (c.voided) return "voided";
  if (c.waived) return "waived";
  if (c.amountPaid >= c.amount) return "paid";
  if (c.amountPaid > 0) return "partial";
  if (TODAY && c.dueDate && c.dueDate < TODAY) return "pastdue";
  return "unpaid";
}

export default function TransactionDetail({ transaction: tx, type, onClose, onEdit, onDelete, onRecordPayment, onWaive, onVoid, settings }) {
  if (!tx) return null;
  const _ac = settings?.adminAccent || "#4a7c59";
  const isCharge = type === "income" || type === "charge";
  const status = isCharge ? getChargeStatus(tx, settings?.TODAY) : null;
  const sColor = status ? STATUS_COLORS[status] : null;

  const fmtDate = (d) => {
    if (!d) return "--";
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
  };
  const fmtMoney = (n) => "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const Row = ({ label, value, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 12 }}>
      <span style={{ color: "#6b5e52", fontWeight: 600 }}>{label}</span>
      <span style={{ color: color || "#1a1714", fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.25)", zIndex: 900 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 480, maxWidth: "100vw", background: "#fff", zIndex: 901, boxShadow: "-4px 0 24px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "#1a1714" }}>
            {isCharge ? "Charge Details" : "Expense Details"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {isCharge ? (
            <>
              {status && (
                <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: sColor + "18", color: sColor, textTransform: "uppercase", letterSpacing: .5, marginBottom: 14, textDecoration: status === "voided" ? "line-through" : "none" }}>
                  {status === "pastdue" ? "Past Due" : status}
                </span>
              )}
              <Row label="Tenant" value={tx.tenantName || "--"} />
              <Row label="Property" value={tx.propName || "--"} />
              <Row label="Room" value={tx.roomName || "--"} />
              <Row label="Category" value={tx.category || "--"} />
              <Row label="Description" value={tx.desc || "--"} />
              <Row label="Amount Due" value={fmtMoney(tx.amount)} />
              <Row label="Amount Paid" value={fmtMoney(tx.amountPaid)} color={tx.amountPaid >= tx.amount ? "#4a7c59" : "#d4a853"} />
              {tx.amount - tx.amountPaid > 0 && !tx.voided && !tx.waived && (
                <Row label="Remaining" value={fmtMoney(tx.amount - tx.amountPaid)} color="#c45c4a" />
              )}
              <Row label="Due Date" value={fmtDate(tx.dueDate)} />
              <Row label="Created" value={fmtDate(tx.createdDate)} />

              {/* Payment timeline */}
              {tx.payments && tx.payments.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Payment History</div>
                  {tx.payments.map((py, i) => (
                    <div key={py.id || i} style={{ display: "flex", gap: 10, marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid " + _ac }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1714" }}>{fmtMoney(py.amount)} via {py.method}</div>
                        <div style={{ fontSize: 11, color: "#6b5e52" }}>{fmtDate(py.date)}{py.confId ? " -- " + py.confId : ""}</div>
                        {py.depositStatus && <div style={{ fontSize: 10, color: py.depositStatus === "deposited" ? "#4a7c59" : "#d4a853", fontWeight: 600, marginTop: 2 }}>{py.depositStatus}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {!tx.voided && !tx.waived && tx.amountPaid < tx.amount && (
                  <button className="btn btn-green btn-sm" onClick={() => onRecordPayment?.(tx)}>Record Payment</button>
                )}
                {!tx.voided && !tx.waived && (
                  <button className="btn btn-out btn-sm" onClick={() => onWaive?.(tx)}>Waive</button>
                )}
                {!tx.voided && (
                  <button className="btn btn-out btn-sm" onClick={() => onVoid?.(tx)}>Void</button>
                )}
                <button className="btn btn-out btn-sm" onClick={() => onEdit?.(tx)}>Edit</button>
                <button className="btn btn-out btn-sm" style={{ color: "#c45c4a", borderColor: "#c45c4a" }} onClick={() => onDelete?.(tx)}>Delete</button>
              </div>
            </>
          ) : (
            <>
              <Row label="Vendor" value={tx.vendor || "--"} />
              <Row label="Property" value={tx.propName || "--"} />
              <Row label="Category" value={tx.category || "--"} />
              {tx.subcategory && <Row label="Subcategory" value={tx.subcategory} />}
              <Row label="Amount" value={fmtMoney(tx.amount)} color="#c45c4a" />
              <Row label="Payment Method" value={tx.paymentMethod || "--"} />
              <Row label="Date" value={fmtDate(tx.date)} />
              <Row label="Description" value={tx.description || "--"} />
              {tx.notes && <Row label="Notes" value={tx.notes} />}

              {tx.receiptUrl && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Receipt</div>
                  <img src={tx.receiptUrl} alt="Receipt" style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid rgba(0,0,0,.08)" }} />
                </div>
              )}

              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button className="btn btn-out btn-sm" onClick={() => onEdit?.(tx)}>Edit</button>
                <button className="btn btn-out btn-sm" style={{ color: "#c45c4a", borderColor: "#c45c4a" }} onClick={() => onDelete?.(tx)}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
