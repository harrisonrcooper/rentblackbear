"use client";
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { hexRgba, fmt } from "./PortalShared";

export default function StripePayForm({ amount, onSuccess, onCancel, creditFee, C }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!stripe || !elements) return;
    setPaying(true); setErr("");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements, redirect: "if_required",
      confirmParams: { return_url: window.location.href },
    });
    if (error) { setErr(error.message); setPaying(false); }
    else if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") onSuccess(paymentIntent);
    else setPaying(false);
  };

  return (
    <div>
      <div style={{ background: "#f8f7f5", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      <div style={{ fontSize: 11, color: "#999", background: hexRgba(C.accent, .06), border: `1px solid ${hexRgba(C.accent, .15)}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
        ACH bank transfer: ~$1 flat fee. Debit/credit card: {(creditFee * 100).toFixed(1)}% convenience fee added to total.
      </div>
      {err && <div style={{ fontSize: 12, color: C.red, background: hexRgba(C.red, .06), border: `1px solid ${hexRgba(C.red, .2)}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
        <button onClick={submit} disabled={paying || !stripe} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
          {paying ? "Processing..." : `Pay ${fmt(amount)}`}
        </button>
      </div>
    </div>
  );
}
