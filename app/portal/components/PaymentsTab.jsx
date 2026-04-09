"use client";
import { Elements } from "@stripe/react-stripe-js";
import { hexRgba, fmt, fmtD, esc, sCard, sLabel, stripePromise, CREDIT_FEE } from "./PortalShared";
import StripePayForm from "./StripePayForm";
import AutopaySetupForm from "./AutopaySetupForm";

export default function PaymentsTab({
  tenant, C, t, pm, pmSettings, user, charges, chargeStatus,
  stripeSecret, setStripeSecret, payingCharge, setPayingCharge,
  startPayment, onPaymentSuccess,
  autopay, setAutopay,
  scheduledPayments, setScheduledPayments,
  scheduleForm, setScheduleForm, schedulePayment,
  installmentForm, setInstallmentForm, createInstallmentPlan,
  cancelScheduledPayment,
  supabase,
  utilities, utilityConfig, getUtilityShare,
}) {
  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.payments.title}</h2>
      {charges.length === 0 && <div style={{ ...sCard, textAlign: "center", padding: 40, color: "#999" }}>{t.payments.noCharges}</div>}
      {charges.map(c => {
        const st = chargeStatus(c);
        const stColor = { paid: C.green, unpaid: "#3b82f6", pastdue: C.red, partial: C.accent, waived: "#999", voided: "#999" }[st];
        const stLabel2 = { paid: t.payments.paid, unpaid: t.payments.unpaid, pastdue: t.payments.pastDue, partial: t.payments.partial, waived: t.payments.waived, voided: t.payments.voided }[st];
        const canPay = st === "unpaid" || st === "pastdue" || st === "partial";
        return (
          <div key={c.id} style={{ ...sCard, borderColor: st === "pastdue" ? hexRgba(C.red, .25) : "rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.description || c.category}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{t.payments.due} {fmtD(c.due_date)}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(c.amount)}</div><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor }}>{stLabel2}</span></div>
            </div>
            {c.amount_paid > 0 && c.amount_paid < c.amount && <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{fmt(c.amount_paid)} {t.payments.paid.toLowerCase()} {"\u2014"} {fmt(c.amount - c.amount_paid)} {t.payments.remaining}</div>}
            {(c.payments || []).map((p, i) => {
              const confId = p.stripe_payment_id || `BB-${c.id.slice(0,6).toUpperCase()}-${i+1}`;
              const printReceipt = () => {
                const w = window.open("","_blank");
                w.document.write(`<!DOCTYPE html><html><head><title>Payment Receipt ${confId}</title><style>
                  body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}
                  h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}
                  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}
                  .label{color:#666}.value{font-weight:600}
                  .total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}
                  .conf{font-family:monospace;font-size:18px;font-weight:900;color:#1a1714;letter-spacing:2px;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}
                  .footer{margin-top:32px;font-size:11px;color:#999;text-align:center}
                  @media print{body{margin:20px}}
                </style></head><body>
                  <h1>Payment Receipt</h1>
                  <div class="conf">${confId}</div>
                  <div class="row"><span class="label">Date</span><span class="value">${new Date(p.date).toLocaleDateString()}</span></div>
                  <div class="row"><span class="label">Tenant</span><span class="value">${esc(tenant?.name)}</span></div>
                  <div class="row"><span class="label">Charge</span><span class="value">${c.category?esc(c.category)+" \u2014 ":""}${esc(c.description)}</span></div>
                  <div class="row"><span class="label">Payment Method</span><span class="value">${esc(p.method)}</span></div>
                  <div class="row"><span class="label">Status</span><span class="value">${p.deposit_status==="transit"?"In Transit":"Received &amp; Deposited"}</span></div>
                  ${p.stripe_payment_id?`<div class="row"><span class="label">Transaction ID</span><span class="value" style="font-family:monospace;font-size:11px">${p.stripe_payment_id}</span></div>`:""}
                  <div class="total"><span>Amount Paid</span><span>$${Number(p.amount).toLocaleString()}</span></div>
                  <div class="footer">${esc(pm?.company_name)}${pm?.phone?" \u00b7 "+esc(pm.phone):""}<br/>This receipt confirms payment was received. Please retain for your records.</div>
                </body></html>`);
                w.document.close();w.print();
              };
              return (
                <div key={i} style={{ padding: "8px 10px", background: hexRgba(C.green, .05), borderRadius: 8, fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: C.muted }}>{p.method} {"\u2014"} {fmtD(p.date)} {"\u2014"} {p.deposit_status === "transit" ? t.payments.inTransit : p.deposit_status === "deposited" ? t.payments.deposited : t.payments.processing}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: C.green }}>{fmt(p.amount)}</span>
                    {st === "paid" && <button onClick={printReceipt} title="Download Receipt" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px solid ${hexRgba(C.green, .2)}`, background: hexRgba(C.green, .06), color: C.green, fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>{t.payments.receipt}</button>}
                  </div>
                </div>
              );
            })}
            {/* Late fee explainer */}
            {(c.category === "Late Fee" || (c.description || "").toLowerCase().includes("late fee")) && (
              <div style={{ background: hexRgba(C.red, .04), border: "1px solid " + hexRgba(C.red, .12), borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: C.red, marginBottom: 2 }}>How this was calculated</div>
                {pmSettings?.lateFeeGraceDays ? "Rent was not paid within " + pmSettings.lateFeeGraceDays + " days of the due date. " : ""}
                $50 initial late fee + $5/day for each additional day until paid.
              </div>
            )}
            {canPay && !stripeSecret && <button onClick={() => startPayment(c)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 8 }}>{t.payments.payOnline} {fmt(c.amount - c.amount_paid)}</button>}
            {stripeSecret && payingCharge?.id === c.id && (
              <div style={{ marginTop: 16, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 16 }}>
                <Elements stripe={stripePromise} options={{ clientSecret: stripeSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.accent, borderRadius: "8px" } } }}>
                  <StripePayForm amount={c.amount - c.amount_paid} onSuccess={onPaymentSuccess} onCancel={() => { setStripeSecret(null); setPayingCharge(null); }} creditFee={CREDIT_FEE} C={C} />
                </Elements>
              </div>
            )}
          </div>
        );
      })}

      {/* Rent Ledger */}
      {charges.filter(c => c.category === "Rent" || (c.description || "").toLowerCase().includes("rent")).length > 0 && (
        <div style={{ ...sCard, marginTop: 16 }}>
          <span style={sLabel}>Rent Ledger</span>
          <div style={{ fontSize: 10, borderBottom: "1px solid rgba(0,0,0,.06)", display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: 0, padding: "6px 0" }}>
            <div style={{ fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>Period</div>
            <div style={{ fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, textAlign: "right" }}>Charged</div>
            <div style={{ fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, textAlign: "right" }}>Paid</div>
            <div style={{ fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, textAlign: "right" }}>Balance</div>
          </div>
          {charges.filter(c => c.category === "Rent" || (c.description || "").toLowerCase().includes("rent")).map(c => {
            const bal = c.amount - (c.amount_paid || 0);
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: 0, padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 11 }}>
                <div style={{ fontWeight: 600 }}>{c.description || fmtD(c.due_date)}</div>
                <div style={{ textAlign: "right" }}>{fmt(c.amount)}</div>
                <div style={{ textAlign: "right", color: C.green }}>{fmt(c.amount_paid || 0)}</div>
                <div style={{ textAlign: "right", fontWeight: 700, color: bal > 0 ? C.red : C.green }}>{bal > 0 ? fmt(bal) : fmt(0)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Utility Cost Trend */}
      {(utilities || []).length > 1 && getUtilityShare && (
        <div style={{ ...sCard, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={sLabel}>Your Utility Share</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{fmt(getUtilityShare(utilities[0]).share)}<span style={{ fontSize: 10, fontWeight: 500, color: C.muted }}>/mo</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 50 }}>
            {(() => {
              const recent = utilities.slice(0, 6).reverse();
              const maxShare = Math.max(...recent.map(u => getUtilityShare(u).share), 1);
              return recent.map((u, i) => {
                const share = getUtilityShare(u).share;
                const h = (share / maxShare) * 40 + 4;
                const isLast = i === recent.length - 1;
                return (
                  <div key={u.id || i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: "100%", height: h, background: isLast ? C.accent : hexRgba(C.accent, .25), borderRadius: "3px 3px 0 0" }} title={u.billing_month + ": " + fmt(share)} />
                    <div style={{ fontSize: 8, color: "#999" }}>{(u.billing_month || "").slice(5)}</div>
                  </div>
                );
              });
            })()}
          </div>
          <div style={{ fontSize: 9, color: C.muted, textAlign: "right", marginTop: 4 }}>
            Avg: {fmt(utilities.slice(0, 6).reduce((s, u) => s + getUtilityShare(u).share, 0) / Math.min(utilities.length, 6))}/mo
            {" \u2014 "}First ${utilityConfig?.coverageAmount || 100} covered
          </div>
        </div>
      )}

      {/* Auto-Pay Enrollment */}
      <div style={{ ...sCard, marginTop: 16 }}>
        <span style={sLabel}>{t.payments.autopay}</span>
        {autopay.enrolled ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{t.payments.autopayActive}</div>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>{t.payments.autopayDesc}</div>
            <button onClick={async () => {
              setAutopay(p => ({ ...p, loading: true }));
              await fetch("/api/stripe/cancel-autopay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tenantId: tenant?.id }) });
              setAutopay({ enrolled: false, loading: false, setupSecret: null, showSetup: false });
            }} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${hexRgba(C.red, .2)}`, background: hexRgba(C.red, .04), color: C.red, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              {autopay.loading ? t.payments.canceling : t.payments.cancelAutopay}
            </button>
          </div>
        ) : !autopay.showSetup ? (
          <div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>{t.payments.enrollDesc}</div>
            <div style={{ fontSize: 11, color: "#999", background: hexRgba(C.accent, .06), border: `1px solid ${hexRgba(C.accent, .15)}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
              {t.payments.achNote} {t.payments.cardFeeNote} {(CREDIT_FEE * 100).toFixed(1)}{t.payments.convenienceFee}
            </div>
            <button onClick={async () => {
              setAutopay(p => ({ ...p, loading: true }));
              try {
                const res = await fetch("/api/stripe/create-setup-intent", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tenantId: tenant?.id, tenantName: tenant?.name, tenantEmail: user?.email }),
                });
                const { clientSecret } = await res.json();
                if (clientSecret) setAutopay({ enrolled: false, loading: false, setupSecret: clientSecret, showSetup: true });
                else setAutopay(p => ({ ...p, loading: false }));
              } catch (e) { setAutopay(p => ({ ...p, loading: false })); }
            }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
              {autopay.loading ? t.payments.settingUp : t.payments.enrollAutopay}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12 }}>{t.payments.saveMethod}</div>
            <Elements stripe={stripePromise} options={{ clientSecret: autopay.setupSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.accent, borderRadius: "8px" } } }}>
              <AutopaySetupForm onSuccess={(setupIntent) => {
                setAutopay({ enrolled: true, loading: false, setupSecret: null, showSetup: false });
                supabase.from("portal_users").update({
                  autopay_enabled: true,
                  stripe_customer_id: setupIntent?.customer || null,
                  stripe_payment_method_id: setupIntent?.payment_method || null,
                }).eq("tenant_id", tenant?.id);
              }} onCancel={() => setAutopay({ enrolled: false, loading: false, setupSecret: null, showSetup: false })} C={C} />
            </Elements>
          </div>
        )}
      </div>

      {/* Scheduled Payments */}
      <div style={{ ...sCard, marginTop: 16 }}>
        <span style={sLabel}>{t.scheduledPayments?.title || "Scheduled Payments"}</span>
        {scheduledPayments.length === 0 && !scheduleForm.open && !installmentForm.open && (
          <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>{t.scheduledPayments?.noScheduled || "No scheduled payments"}</div>
        )}
        {scheduledPayments.map(sp => {
          const ch = charges.find(c => c.id === sp.charge_id);
          return (
            <div key={sp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{ch?.description || ch?.category || "Payment"}{sp.is_installment ? " (" + sp.installment_number + "/" + sp.installment_total + ")" : ""}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{fmtD(sp.scheduled_date)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{fmt(sp.amount)}</span>
                <button onClick={() => cancelScheduledPayment(sp.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.red, display: "flex" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          );
        })}

        {!scheduleForm.open && !installmentForm.open && (() => {
          const payableCharges = charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount);
          if (!payableCharges.length) return null;
          return (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => setScheduleForm({ open: true, chargeId: payableCharges[0]?.id, date: "", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {t.scheduledPayments?.schedule || "Schedule Payment"}
              </button>
              <button onClick={() => setInstallmentForm({ open: true, chargeId: payableCharges[0]?.id, numPayments: 3, frequency: "monthly", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                {t.scheduledPayments?.splitIntoPlan || "Split into Installments"}
              </button>
            </div>
          );
        })()}

        {scheduleForm.open && (
          <div style={{ marginTop: 12, padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.scheduledPayments?.schedule || "Schedule Payment"}</div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>Charge</label>
              <select value={scheduleForm.chargeId || ""} onChange={e => setScheduleForm(p => ({ ...p, chargeId: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                {charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).map(c => <option key={c.id} value={c.id}>{c.description || c.category} {"\u2014"} {fmt(c.amount - c.amount_paid)}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.scheduledPayments?.scheduledDate || "Payment Date"}</label>
              <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setScheduleForm({ open: false, chargeId: null, date: "", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
              <button onClick={schedulePayment} disabled={!scheduleForm.date || scheduleForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: scheduleForm.date ? C.bg : "rgba(0,0,0,.08)", color: scheduleForm.date ? C.accent : "#bbb", cursor: scheduleForm.date ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{scheduleForm.submitting ? "Scheduling..." : t.scheduledPayments?.schedule || "Schedule Payment"}</button>
            </div>
          </div>
        )}

        {installmentForm.open && (
          <div style={{ marginTop: 12, padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.scheduledPayments?.installmentPlan || "Installment Plan"}</div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>Charge</label>
              <select value={installmentForm.chargeId || ""} onChange={e => setInstallmentForm(p => ({ ...p, chargeId: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                {charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).map(c => <option key={c.id} value={c.id}>{c.description || c.category} {"\u2014"} {fmt(c.amount - c.amount_paid)}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.scheduledPayments?.numPayments || "Number of payments"}</label>
                <select value={installmentForm.numPayments} onChange={e => setInstallmentForm(p => ({ ...p, numPayments: parseInt(e.target.value) }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                  {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {t.scheduledPayments?.installments || "installments"}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.scheduledPayments?.frequency || "Frequency"}</label>
                <select value={installmentForm.frequency} onChange={e => setInstallmentForm(p => ({ ...p, frequency: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                  <option value="weekly">{t.scheduledPayments?.weekly || "Weekly"}</option>
                  <option value="biweekly">{t.scheduledPayments?.biweekly || "Bi-weekly"}</option>
                  <option value="monthly">{t.scheduledPayments?.monthly || "Monthly"}</option>
                </select>
              </div>
            </div>
            {(() => {
              const ch = charges.find(c => c.id === installmentForm.chargeId);
              const remaining = ch ? ch.amount - ch.amount_paid : 0;
              const perPayment = Math.ceil(remaining / installmentForm.numPayments * 100) / 100;
              return (
                <div style={{ background: hexRgba(C.accent, .06), border: "1px solid " + hexRgba(C.accent, .15), borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: C.muted }}>
                  {installmentForm.numPayments} payments of <strong style={{ color: C.text }}>{fmt(perPayment)}</strong> ({installmentForm.frequency})
                </div>
              );
            })()}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setInstallmentForm({ open: false, chargeId: null, numPayments: 3, frequency: "monthly", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
              <button onClick={createInstallmentPlan} disabled={installmentForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>{installmentForm.submitting ? "Creating..." : t.scheduledPayments?.createPlan || "Create Plan"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
