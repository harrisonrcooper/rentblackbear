"use client";
import { Elements } from "@stripe/react-stripe-js";
import { hexRgba, fmt, fmtD, IcCheck, stripePromise } from "./PortalShared";
import StripePayForm from "./StripePayForm";
import SignatureCanvas from "./SignatureCanvas";

export default function OnboardingFlow({
  tenant, C, t, pm, pmSettings, CREDIT_FEE,
  onboarding, onboardingDone, STEPS,
  obStep, setObStep, showSig, setShowSig,
  stripeSecret, setStripeSecret, payingCharge, setPayingCharge,
  signLease, onPaymentSuccess, setActiveTab,
  sCard,
}) {
  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Welcome, {tenant?.name?.split(" ")[0]}!</h2>
        <p style={{ fontSize: 13, color: C.muted }}>Complete these steps to unlock your tenant portal.</p>
      </div>
      {STEPS.map((step, i) => {
        const done = step.key === "moveIn" ? onboardingDone : onboarding[step.key];
        const locked = step.disabled;
        return (
          <div key={step.key} style={{ ...sCard, opacity: locked ? .5 : 1, borderColor: done ? hexRgba(C.green, .25) : "rgba(0,0,0,.06)", background: done ? hexRgba(C.green, .03) : "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? C.green : locked ? "rgba(0,0,0,.08)" : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: done ? "#fff" : locked ? "#bbb" : C.accent, fontWeight: 800, fontSize: 14 }}>
                {done ? <IcCheck s={16} /> : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: done ? C.green : C.text }}>{step.label}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{step.desc}</div>
              </div>
              {!done && !locked && step.action && <button onClick={step.action} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: C.accent, color: C.text, fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>{step.actionLabel}</button>}
              {done && <span style={{ fontSize: 11, fontWeight: 700, color: C.green, flexShrink: 0 }}>Done</span>}
            </div>

            {/* Lease signing inline */}
            {obStep === "lease" && step.key === "leaseSigned" && !done && (
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 20 }}>
                {!showSig ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12 }}>Room Rental Agreement</div>
                    <div style={{ maxHeight: 280, overflowY: "auto", fontSize: 12, lineHeight: 1.8, color: C.muted, background: "#faf9f7", borderRadius: 8, padding: 16, marginBottom: 16, border: "1px solid rgba(0,0,0,.06)" }}>
                      <p><strong>Tenant:</strong> {tenant?.name}</p>
                      <p><strong>Property:</strong> {tenant?.property?.name} {"\u2014"} {tenant?.room?.name}</p>
                      <p><strong>Rent:</strong> {fmt(tenant?.rent)}/mo {t.home.due1st}{pmSettings?.lateFeeGraceDays ? `, ${t.home.lateAfterDay} ${pmSettings.lateFeeGraceDays}` : ""}</p>
                      <p><strong>Term:</strong> {fmtD(tenant?.move_in)} to {fmtD(tenant?.lease_end)}</p>
                      <br />
                      {(pmSettings?.houseRules || tenant?.property?.house_rules || []).length > 0 && <p>{(pmSettings?.houseRules || tenant?.property?.house_rules || []).join(". ")}.</p>}
                      <p>Security deposit refundable at move-out minus damages. 30-day written notice required to vacate.{pmSettings?.m2mIncrease ? ` Month-to-month adds $${pmSettings.m2mIncrease}/mo after lease end.` : ""}</p>
                      <br />
                      <p>By signing you agree to all terms of this agreement and {pm.company_name} house rules.</p>
                    </div>
                    <button onClick={() => setShowSig(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>I Have Read the Agreement {"\u2014"} Sign Now</button>
                  </>
                ) : (
                  <SignatureCanvas onSave={signLease} onCancel={() => { setShowSig(false); setObStep(null); }} C={C} />
                )}
              </div>
            )}

            {/* Payment inline */}
            {stripeSecret && payingCharge && ((obStep === "sd" && step.key === "sdPaid") || (obStep === "firstMonth" && step.key === "firstMonthPaid")) && (
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 16 }}>Paying {fmt(payingCharge.amount - payingCharge.amount_paid)}</div>
                <Elements stripe={stripePromise} options={{ clientSecret: stripeSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.accent, borderRadius: "8px" } } }}>
                  <StripePayForm amount={payingCharge.amount - payingCharge.amount_paid} onSuccess={onPaymentSuccess} onCancel={() => { setStripeSecret(null); setPayingCharge(null); setObStep(null); }} creditFee={CREDIT_FEE} C={C} />
                </Elements>
              </div>
            )}
          </div>
        );
      })}
      {onboardingDone && (
        <div style={{ textAlign: "center", padding: 28, background: hexRgba(C.green, .06), borderRadius: 14, border: `1px solid ${hexRgba(C.green, .2)}` }}>
          <div style={{ marginBottom: 8 }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginBottom: 4 }}>You are all set!</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Your portal is now unlocked. Welcome home.</div>
          <button onClick={() => setActiveTab("home")} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>Go to My Portal</button>
        </div>
      )}
    </div>
  );
}
