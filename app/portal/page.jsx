"use client";
// ═══════════════════════════════════════════════════════════════════
// TENANT PORTAL — rentblackbear.com/portal
// Auth: Supabase (Google OAuth + Email/Password)
// Onboarding: Sign Lease → Pay SD → Pay First Month → Move In
// Payments: Stripe (ACH / Debit / Credit)
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPA_URL, SUPA_ANON);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (n) => n != null ? "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
const fmtD = (d) => { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`; };
const daysLeft = (d) => { if (!d) return null; return Math.ceil((new Date(d + "T00:00:00") - new Date()) / (1e3 * 60 * 60 * 24)); };
const C = { bg: "#1a1714", accent: "#d4a853", green: "#4a7c59", red: "#c45c4a", text: "#1a1714", muted: "#5c4a3a" };

// ── Icons ─────────────────────────────────────────────────────────────
const Ic = ({ d, s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const IcHome   = ({ s }) => <Ic s={s} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const IcDollar = ({ s }) => <Ic s={s} d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const IcWrench = ({ s }) => <Ic s={s} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />;
const IcFile   = ({ s }) => <Ic s={s} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const IcUser   = ({ s }) => <Ic s={s} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcLogout = ({ s }) => <Ic s={s} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />;
const IcCheck  = ({ s }) => <Ic s={s} d="M20 6L9 17l-5-5" />;
const IcGoogle = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

// ── Stripe Pay Form ───────────────────────────────────────────────────
function StripePayForm({ amount, onSuccess, onCancel, creditFee }) {
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
      <div style={{ fontSize: 11, color: "#999", background: "rgba(212,168,83,.06)", border: "1px solid rgba(212,168,83,.15)", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
        ACH bank transfer: ~$1 flat fee. Debit/credit card: {(creditFee * 100).toFixed(1)}% convenience fee added to total.
      </div>
      {err && <div style={{ fontSize: 12, color: C.red, background: "rgba(196,92,74,.06)", border: "1px solid rgba(196,92,74,.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
        <button onClick={submit} disabled={paying || !stripe} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
          {paying ? "Processing..." : `Pay ${fmt(amount)}`}
        </button>
      </div>
    </div>
  );
}

// ── Signature Canvas ──────────────────────────────────────────────────
function SignatureCanvas({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);
  const getPos = (e, c) => { const r = c.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const start = (e) => { drawing.current = true; const c = canvasRef.current; const ctx = c.getContext("2d"); const p = getPos(e, c); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw = (e) => { if (!drawing.current) return; e.preventDefault(); const c = canvasRef.current; const ctx = c.getContext("2d"); ctx.strokeStyle = "#1a1714"; ctx.lineWidth = 2; ctx.lineCap = "round"; const p = getPos(e, c); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasSig(true); };
  const stop = () => { drawing.current = false; };
  const clear = () => { canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); setHasSig(false); };
  return (
    <div>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>Sign below using your mouse or finger</div>
      <canvas ref={canvasRef} width={480} height={120} style={{ width: "100%", height: 120, border: "1.5px solid rgba(0,0,0,.12)", borderRadius: 8, background: "#fafaf8", cursor: "crosshair", touchAction: "none" }}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={clear} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Clear</button>
        <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Cancel</button>
        <button onClick={() => hasSig && onSave(canvasRef.current.toDataURL())} disabled={!hasSig} style={{ flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", background: hasSig ? C.bg : "rgba(0,0,0,.08)", color: hasSig ? C.accent : "#bbb", cursor: hasSig ? "pointer" : "default", fontSize: 13, fontWeight: 800 }}>Sign Lease</button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function TenantPortal() {
  const [screen, setScreen]               = useState("loading");
  const [authMode, setAuthMode]           = useState("signin");
  const [authEmail, setAuthEmail]         = useState("");
  const [authPassword, setAuthPassword]   = useState("");
  const [authName, setAuthName]           = useState("");
  const [authErr, setAuthErr]             = useState("");
  const [authLoading, setAuthLoading]     = useState(false);
  const [successMsg, setSuccessMsg]       = useState("");
  const [user, setUser]                   = useState(null);
  const [tenant, setTenant]               = useState(null);
  const [pmSettings, setPmSettings]       = useState(null);
  const [charges, setCharges]             = useState([]);
  const [maintenance, setMaintenance]     = useState([]);
  const [activeTab, setActiveTab]         = useState("home");
  const [token, setToken]                 = useState(null);
  const [onboarding, setOnboarding]       = useState({ leaseSigned: false, sdPaid: false, firstMonthPaid: false });
  const [obStep, setObStep]               = useState(null);
  const [showSig, setShowSig]             = useState(false);
  const [stripeSecret, setStripeSecret]   = useState(null);
  const [payingCharge, setPayingCharge]   = useState(null);
  const [maintForm, setMaintForm]         = useState({ title: "", desc: "", priority: "medium" });
  const [maintSubmitting, setMaintSubmitting] = useState(false);
  const [maintSuccess, setMaintSuccess]   = useState(false);
  const CREDIT_FEE = 0.029;

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (t) setToken(t);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadPortalData(session.user.id); }
      else setScreen("auth");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); loadPortalData(session.user.id); }
      else { setUser(null); setTenant(null); setScreen("auth"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadPortalData = useCallback(async (authUserId) => {
    try {
      const { data: pu, error: puErr } = await supabase.from("portal_users")
        .select("*, tenant:tenants(*, property:properties(*), room:rooms(*))").eq("auth_user_id", authUserId).single();
      if (puErr || !pu) {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (u?.email) {
          const { data: inv } = await supabase.from("invites").select("*").eq("email", u.email).is("accepted_at", null).gt("expires_at", new Date().toISOString()).single();
          if (inv) { await acceptInvite(inv, authUserId, u.email); return; }
        }
        setScreen("no-access"); return;
      }
      setTenant(pu.tenant);
      await supabase.from("portal_users").update({ last_seen_at: new Date().toISOString() }).eq("id", pu.id);
      if (pu.pm_id) { const { data: pm } = await supabase.from("pm_accounts").select("*").eq("id", pu.pm_id).single(); setPmSettings(pm); }
      const { data: ch } = await supabase.from("charges").select("*, payments(*)").eq("tenant_id", pu.tenant_id).order("due_date", { ascending: false });
      setCharges(ch || []);
      const { data: mt } = await supabase.from("maintenance_requests").select("*").eq("tenant_id", pu.tenant_id).order("created_at", { ascending: false });
      setMaintenance(mt || []);
      const allCh = ch || [];
      setOnboarding({
        leaseSigned: !!pu.tenant?.lease_signed_at,
        sdPaid: !!(allCh.find(c => c.category === "Security Deposit" && c.amount_paid >= c.amount)),
        firstMonthPaid: !!(allCh.find(c => c.category === "Rent" && c.amount_paid >= c.amount)),
      });
      setScreen("portal");
    } catch (e) { console.error(e); setScreen("error"); }
  }, []);

  const acceptInvite = async (inv, authUserId, email) => {
    try {
      const { data: pu, error } = await supabase.from("portal_users").insert({ auth_user_id: authUserId, pm_id: inv.pm_id, tenant_id: inv.tenant_id, email })
        .select("*, tenant:tenants(*, property:properties(*), room:rooms(*))").single();
      if (error) throw error;
      await supabase.from("invites").update({ accepted_at: new Date().toISOString() }).eq("id", inv.id);
      setTenant(pu.tenant);
      const { data: pm } = await supabase.from("pm_accounts").select("*").eq("id", inv.pm_id).single(); setPmSettings(pm);
      const { data: ch } = await supabase.from("charges").select("*, payments(*)").eq("tenant_id", inv.tenant_id).order("due_date", { ascending: false }); setCharges(ch || []);
      const { data: mt } = await supabase.from("maintenance_requests").select("*").eq("tenant_id", inv.tenant_id).order("created_at", { ascending: false }); setMaintenance(mt || []);
      setOnboarding({ leaseSigned: false, sdPaid: !!(ch || []).find(c => c.category === "Security Deposit" && c.amount_paid >= c.amount), firstMonthPaid: !!(ch || []).find(c => c.category === "Rent" && c.amount_paid >= c.amount) });
      setScreen("portal");
    } catch (e) { console.error(e); setScreen("error"); }
  };

  const signInGoogle = async () => {
    setAuthLoading(true); setAuthErr("");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/portal" + (token ? `?token=${token}` : "") } });
    if (error) { setAuthErr(error.message); setAuthLoading(false); }
  };
  const signInEmail = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) { setAuthErr("Email and password are required"); return; }
    setAuthLoading(true); setAuthErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) { setAuthErr(error.message); setAuthLoading(false); }
  };
  const signUpEmail = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName) { setAuthErr("All fields are required"); return; }
    if (authPassword.length < 8) { setAuthErr("Password must be at least 8 characters"); return; }
    setAuthLoading(true); setAuthErr("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { data: { full_name: authName }, emailRedirectTo: window.location.origin + "/portal" + (token ? `?token=${token}` : "") } });
    if (error) { setAuthErr(error.message); setAuthLoading(false); }
    else { setSuccessMsg("Check your email to verify your account, then sign in."); setAuthMode("signin"); setAuthLoading(false); }
  };
  const forgotPassword = async (e) => {
    e.preventDefault();
    if (!authEmail) { setAuthErr("Enter your email address"); return; }
    setAuthLoading(true); setAuthErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, { redirectTo: window.location.origin + "/portal" });
    if (error) { setAuthErr(error.message); } else { setSuccessMsg("Password reset email sent."); setAuthMode("signin"); }
    setAuthLoading(false);
  };
  const signOut = async () => { await supabase.auth.signOut(); setTenant(null); setCharges([]); setMaintenance([]); };

  const signLease = async (sigDataUrl) => {
    await supabase.from("tenants").update({ lease_signed_at: new Date().toISOString(), lease_signature: sigDataUrl }).eq("id", tenant.id);
    setOnboarding(p => ({ ...p, leaseSigned: true }));
    setObStep(null); setShowSig(false);
  };

  const startPayment = async (charge) => {
    setPayingCharge(charge);
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chargeId: charge.id, amount: charge.amount - charge.amount_paid, tenantName: tenant?.name, tenantEmail: user?.email }),
    });
    const { clientSecret } = await res.json();
    setStripeSecret(clientSecret);
    setObStep(charge.category === "Security Deposit" ? "sd" : "firstMonth");
  };

  const onPaymentSuccess = () => {
    setCharges(prev => prev.map(c => c.id === payingCharge.id ? { ...c, amount_paid: c.amount } : c));
    if (payingCharge.category === "Security Deposit") setOnboarding(p => ({ ...p, sdPaid: true }));
    if (payingCharge.category === "Rent") setOnboarding(p => ({ ...p, firstMonthPaid: true }));
    setStripeSecret(null); setPayingCharge(null); setObStep(null);
  };

  const submitMaint = async () => {
    if (!maintForm.title.trim()) return;
    setMaintSubmitting(true);
    await supabase.from("maintenance_requests").insert({ pm_id: tenant?.pm_id, tenant_id: tenant?.id, property_id: tenant?.property_id, room_id: tenant?.room_id, title: maintForm.title, description: maintForm.desc, priority: maintForm.priority, submitted_by: tenant?.name });
    const { data: mt } = await supabase.from("maintenance_requests").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false });
    setMaintenance(mt || []); setMaintForm({ title: "", desc: "", priority: "medium" }); setMaintSuccess(true);
    setTimeout(() => setMaintSuccess(false), 4000); setMaintSubmitting(false);
  };

  const chargeStatus = (c) => {
    if (c.voided) return "voided"; if (c.waived) return "waived";
    if (c.amount_paid >= c.amount) return "paid"; if (c.amount_paid > 0) return "partial";
    if (new Date(c.due_date + "T00:00:00") < new Date()) return "pastdue"; return "unpaid";
  };
  const totalDue = charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).reduce((s, c) => s + (c.amount - c.amount_paid), 0);
  const sdCharge = charges.find(c => c.category === "Security Deposit");
  const firstMonthCharge = charges.find(c => c.category === "Rent");
  const pm = pmSettings || { company_name: "Black Bear Rentals", phone: "(850) 696-8101" };
  const dl = daysLeft(tenant?.lease_end);
  const onboardingDone = onboarding.leaseSigned && onboarding.sdPaid && onboarding.firstMonthPaid;

  const STEPS = [
    { key: "leaseSigned", label: "Sign Your Lease", desc: "Review and sign your rental agreement", action: () => setObStep("lease"), actionLabel: "Review and Sign" },
    { key: "sdPaid", label: "Pay Security Deposit", desc: sdCharge ? fmt(sdCharge.amount) + " — refundable at move-out" : "Pay your security deposit", action: () => sdCharge && startPayment(sdCharge), actionLabel: "Pay Now", disabled: !onboarding.leaseSigned },
    { key: "firstMonthPaid", label: "Pay First Month's Rent", desc: firstMonthCharge ? fmt(firstMonthCharge.amount) + " — due before move-in" : "Pay your first month", action: () => firstMonthCharge && startPayment(firstMonthCharge), actionLabel: "Pay Now", disabled: !onboarding.leaseSigned },
    { key: "moveIn", label: "Move In", desc: tenant?.move_in ? "Move-in date: " + fmtD(tenant.move_in) : "Portal unlocks after steps above", action: null, actionLabel: null, disabled: !onboardingDone },
  ];

  const sCard = { background: "#fff", borderRadius: 14, padding: 20, border: "1px solid rgba(0,0,0,.06)", marginBottom: 12 };
  const sLabel = { fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, display: "block" };
  const sRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 13 };

  // ── SCREENS ───────────────────────────────────────────────────────────
  const globalStyle = `*{box-sizing:border-box;margin:0;padding:0} input,textarea,select,button{font-family:inherit} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`;

  if (screen === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{globalStyle}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${C.accent}`, borderTopColor: "transparent", animation: "spin .8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>Loading your portal...</div>
      </div>
    </div>
  );

  if (screen === "no-access") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", padding: 24 }}>
      <style>{globalStyle}</style>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(196,92,74,.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ color: "#f5f0e8", fontSize: 20, marginBottom: 8 }}>No portal access found</h2>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Your account is not linked to a tenant record. Make sure you are using the same email your property manager sent the invite to.</p>
        <button onClick={signOut} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: C.accent, color: C.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Sign Out and Try Again</button>
        <div style={{ marginTop: 32, fontSize: 11, color: "rgba(255,255,255,.2)" }}>Powered by PropOS</div>
      </div>
    </div>
  );

  if (screen === "error") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}><div style={{ color: C.red, fontSize: 18, marginBottom: 12 }}>Something went wrong</div><button onClick={() => window.location.reload()} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: C.accent, color: C.text, fontWeight: 700, cursor: "pointer" }}>Reload</button></div>
    </div>
  );

  if (screen === "auth") return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{globalStyle + " input{outline:none}"}</style>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: C.accent, fontWeight: 700, marginBottom: 4 }}>Black Bear Rentals</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>Tenant Portal</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 8px 40px rgba(0,0,0,.3)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>{authMode === "signin" ? "Sign in" : authMode === "signup" ? "Create account" : "Reset password"}</h2>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 24 }}>{authMode === "signin" ? "Access your lease, payments, and maintenance." : authMode === "signup" ? "You need an invite from your property manager." : "Enter your email to receive a reset link."}</p>
          {successMsg && <div style={{ background: "rgba(74,124,89,.08)", border: "1px solid rgba(74,124,89,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, marginBottom: 16 }}>{successMsg}</div>}
          {authErr && <div style={{ background: "rgba(196,92,74,.08)", border: "1px solid rgba(196,92,74,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.red, marginBottom: 16 }}>{authErr}</div>}
          {authMode !== "forgot" && <button onClick={signInGoogle} disabled={authLoading} style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}><IcGoogle /> Continue with Google</button>}
          {authMode !== "forgot" && <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.08)" }} /><span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>or</span><div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.08)" }} /></div>}
          <form onSubmit={authMode === "signin" ? signInEmail : authMode === "signup" ? signUpEmail : forgotPassword}>
            {authMode === "signup" && <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>Full Name</label><input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Jane Smith" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>}
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>Email Address</label><input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@email.com" autoFocus style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>
            {authMode !== "forgot" && <div style={{ marginBottom: 20 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>Password</label><input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder={authMode === "signup" ? "Min. 8 characters" : "••••••••"} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>}
            <button type="submit" disabled={authLoading} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>{authLoading ? "Please wait..." : authMode === "signin" ? "Sign In" : authMode === "signup" ? "Create Account" : "Send Reset Link"}</button>
          </form>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
            {authMode === "signin" && <><button onClick={() => { setAuthMode("forgot"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>Forgot your password?</button><button onClick={() => { setAuthMode("signup"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>Don't have an account? Sign up</button></>}
            {authMode !== "signin" && <button onClick={() => { setAuthMode("signin"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>Back to sign in</button>}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "rgba(255,255,255,.2)" }}>Powered by PropOS</div>
      </div>
    </div>
  );

  // ── PORTAL ────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", minHeight: "100vh", background: "#f4f3f0", color: C.text }}>
      <style>{globalStyle}</style>

      {/* Header */}
      <div style={{ background: C.bg, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.2)" }}>
        <div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.accent, fontWeight: 700 }}>Black Bear Rentals</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 1 }}>Tenant Portal</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#f5f0e8", fontWeight: 600 }}>{tenant?.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{tenant?.property?.name}</div>
          </div>
          <button onClick={signOut} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.4)", padding: 4, display: "flex" }}><IcLogout s={16} /></button>
        </div>
      </div>

      {/* Nav — only shown after onboarding */}
      {onboardingDone && (
        <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,.07)", overflowX: "auto" }}>
          <div style={{ display: "flex", maxWidth: 680, margin: "0 auto" }}>
            {[{ id: "home", label: "Home", icon: <IcHome s={16} /> }, { id: "payments", label: "Payments", icon: <IcDollar s={16} /> }, { id: "maintenance", label: "Maintenance", icon: <IcWrench s={16} /> }, { id: "documents", label: "Lease", icon: <IcFile s={16} /> }, { id: "account", label: "Account", icon: <IcUser s={16} /> }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "13px 8px", border: "none", background: "transparent", borderBottom: activeTab === t.id ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", fontSize: 11, fontWeight: activeTab === t.id ? 700 : 500, color: activeTab === t.id ? C.text : "#999", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .15s" }}>
                <span style={{ color: activeTab === t.id ? C.accent : "#bbb" }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>

        {/* ── ONBOARDING ── */}
        {!onboardingDone && (
          <div style={{ animation: "fadeIn .2s" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Welcome, {tenant?.name?.split(" ")[0]}!</h2>
              <p style={{ fontSize: 13, color: C.muted }}>Complete these steps to unlock your tenant portal.</p>
            </div>
            {STEPS.map((step, i) => {
              const done = step.key === "moveIn" ? onboardingDone : onboarding[step.key];
              const locked = step.disabled;
              return (
                <div key={step.key} style={{ ...sCard, opacity: locked ? .5 : 1, borderColor: done ? "rgba(74,124,89,.25)" : "rgba(0,0,0,.06)", background: done ? "rgba(74,124,89,.03)" : "#fff" }}>
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
                            <p><strong>Property:</strong> {tenant?.property?.name} — {tenant?.room?.name}</p>
                            <p><strong>Rent:</strong> {fmt(tenant?.rent)}/mo due 1st, $50 late fee after 3rd</p>
                            <p><strong>Term:</strong> {fmtD(tenant?.move_in)} to {fmtD(tenant?.lease_end)}</p>
                            <br />
                            <p>No smoking, no pets, shoes off at the door. Quiet hours 10pm-7am weekdays, 11pm-10am weekends. Security deposit refundable at move-out minus damages. 30-day written notice required to vacate. Month-to-month adds $50/mo after lease end.</p>
                            <br />
                            <p>By signing you agree to all terms of this agreement and {pm.company_name} house rules.</p>
                          </div>
                          <button onClick={() => setShowSig(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>I Have Read the Agreement — Sign Now</button>
                        </>
                      ) : (
                        <SignatureCanvas onSave={signLease} onCancel={() => { setShowSig(false); setObStep(null); }} />
                      )}
                    </div>
                  )}

                  {/* Payment inline */}
                  {stripeSecret && payingCharge && ((obStep === "sd" && step.key === "sdPaid") || (obStep === "firstMonth" && step.key === "firstMonthPaid")) && (
                    <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 16 }}>Paying {fmt(payingCharge.amount - payingCharge.amount_paid)}</div>
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.accent, borderRadius: "8px" } } }}>
                        <StripePayForm amount={payingCharge.amount - payingCharge.amount_paid} onSuccess={onPaymentSuccess} onCancel={() => { setStripeSecret(null); setPayingCharge(null); setObStep(null); }} creditFee={CREDIT_FEE} />
                      </Elements>
                    </div>
                  )}
                </div>
              );
            })}
            {onboardingDone && (
              <div style={{ textAlign: "center", padding: 28, background: "rgba(74,124,89,.06)", borderRadius: 14, border: "1px solid rgba(74,124,89,.2)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginBottom: 4 }}>You are all set!</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Your portal is now unlocked. Welcome home.</div>
                <button onClick={() => setActiveTab("home")} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>Go to My Portal</button>
              </div>
            )}
          </div>
        )}

        {/* ── HOME ── */}
        {onboardingDone && activeTab === "home" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <div style={{ background: C.bg, borderRadius: 16, padding: 24, marginBottom: 14 }}>
              <span style={sLabel}>Balance Due</span>
              <div style={{ fontSize: 40, fontWeight: 800, color: totalDue > 0 ? "#f87171" : C.accent, marginBottom: 4 }}>{fmt(totalDue)}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{totalDue === 0 ? "You're all paid up" : "Contact your property manager to pay"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={sCard}><span style={sLabel}>Monthly Rent</span><div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(tenant?.rent)}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Due 1st — late after 3rd</div></div>
              <div style={sCard}><span style={sLabel}>Lease End</span><div style={{ fontSize: 22, fontWeight: 800, color: dl && dl <= 60 ? C.red : C.text }}>{fmtD(tenant?.lease_end)}</div>{dl !== null && <div style={{ fontSize: 11, color: dl <= 30 ? C.red : dl <= 60 ? "#d4a853" : "#999", marginTop: 2 }}>{dl > 0 ? dl + " days remaining" : "Expired"}</div>}</div>
            </div>
            <div style={sCard}>
              <span style={sLabel}>Your Room</span>
              {[["Property", tenant?.property?.name], ["Room", tenant?.room?.name], ["Move-in", fmtD(tenant?.move_in)], ["Door Code", tenant?.door_code || tenant?.room?.door_code]].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: label === "Door Code" ? 800 : 600, letterSpacing: label === "Door Code" ? 4 : 0, fontFamily: label === "Door Code" ? "monospace" : "inherit" }}>{val}</span></div>
              ))}
            </div>
            {maintenance.filter(m => m.status !== "resolved").length > 0 && (
              <div style={sCard}>
                <span style={sLabel}>Open Maintenance</span>
                {maintenance.filter(m => m.status !== "resolved").map(req => (
                  <div key={req.id} style={{ ...sRow, alignItems: "flex-start" }}>
                    <div><div style={{ fontSize: 12, fontWeight: 600 }}>{req.title}</div><div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString()}</div></div>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 700, background: req.status === "in-progress" ? "rgba(212,168,83,.12)" : "rgba(196,92,74,.08)", color: req.status === "in-progress" ? "#9a7422" : C.red }}>{req.status === "in-progress" ? "In Progress" : "Open"}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: "rgba(212,168,83,.06)", border: "1px solid rgba(212,168,83,.2)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9a7422", marginBottom: 4 }}>Questions?</div>
              <div style={{ fontSize: 12, color: C.muted }}>Contact {pm.company_name} at <strong>{pm.phone}</strong></div>
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {onboardingDone && activeTab === "payments" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Payments</h2>
            {charges.length === 0 && <div style={{ ...sCard, textAlign: "center", padding: 40, color: "#999" }}>No charges on file yet.</div>}
            {charges.map(c => {
              const st = chargeStatus(c);
              const stColor = { paid: C.green, unpaid: "#3b82f6", pastdue: C.red, partial: "#d4a853", waived: "#999", voided: "#999" }[st];
              const stLabel = { paid: "Paid", unpaid: "Unpaid", pastdue: "Past Due", partial: "Partial", waived: "Waived", voided: "Voided" }[st];
              const canPay = st === "unpaid" || st === "pastdue" || st === "partial";
              return (
                <div key={c.id} style={{ ...sCard, borderColor: st === "pastdue" ? "rgba(196,92,74,.25)" : "rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.description || c.category}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Due {fmtD(c.due_date)}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(c.amount)}</div><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor }}>{stLabel}</span></div>
                  </div>
                  {c.amount_paid > 0 && c.amount_paid < c.amount && <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{fmt(c.amount_paid)} paid — {fmt(c.amount - c.amount_paid)} remaining</div>}
                  {(c.payments || []).map((p, i) => (
                    <div key={i} style={{ padding: "8px 10px", background: "rgba(74,124,89,.05)", borderRadius: 8, fontSize: 11, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: C.muted }}>{p.method} — {fmtD(p.date)} — {p.deposit_status === "transit" ? "In Transit" : p.deposit_status === "deposited" ? "Deposited" : "Processing"}</span>
                      <span style={{ fontWeight: 700, color: C.green }}>{fmt(p.amount)}</span>
                    </div>
                  ))}
                  {canPay && !stripeSecret && <button onClick={() => startPayment(c)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 8 }}>Pay {fmt(c.amount - c.amount_paid)} Online</button>}
                  {stripeSecret && payingCharge?.id === c.id && (
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 16 }}>
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.accent, borderRadius: "8px" } } }}>
                        <StripePayForm amount={c.amount - c.amount_paid} onSuccess={onPaymentSuccess} onCancel={() => { setStripeSecret(null); setPayingCharge(null); }} creditFee={CREDIT_FEE} />
                      </Elements>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MAINTENANCE ── */}
        {onboardingDone && activeTab === "maintenance" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Maintenance</h2>
            <div style={sCard}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>Submit a Request</div>
              {maintSuccess && <div style={{ background: "rgba(74,124,89,.08)", border: "1px solid rgba(74,124,89,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, marginBottom: 14 }}>Request submitted. We will be in touch soon.</div>}
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>What is the issue?</label><input value={maintForm.title} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Leaky faucet in bathroom" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>Details (optional)</label><textarea value={maintForm.desc} onChange={e => setMaintForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, resize: "vertical" }} /></div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>Priority</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["low", "Low", C.green], ["medium", "Medium", "#d4a853"], ["high", "High", C.red]].map(([v, l, col]) => (
                    <button key={v} onClick={() => setMaintForm(p => ({ ...p, priority: v }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${maintForm.priority === v ? col : "rgba(0,0,0,.1)"}`, background: maintForm.priority === v ? col + "15" : "#fff", cursor: "pointer", fontSize: 11, fontWeight: maintForm.priority === v ? 700 : 500, color: maintForm.priority === v ? col : "#999" }}>{l}</button>
                  ))}
                </div>
              </div>
              <button onClick={submitMaint} disabled={maintSubmitting || !maintForm.title.trim()} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: maintForm.title.trim() ? C.bg : "rgba(0,0,0,.08)", color: maintForm.title.trim() ? C.accent : "#bbb", fontWeight: 800, fontSize: 14, cursor: maintForm.title.trim() ? "pointer" : "default" }}>{maintSubmitting ? "Submitting..." : "Submit Request"}</button>
            </div>
            {maintenance.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>History</div>
              {maintenance.map(req => {
                const stColor = { open: C.red, "in-progress": "#d4a853", resolved: C.green }[req.status];
                const stLabel = { open: "Open", "in-progress": "In Progress", resolved: "Resolved" }[req.status];
                return (
                  <div key={req.id} style={sCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{req.title}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString()}</div>{req.description && <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{req.description}</div>}</div>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor, flexShrink: 0, marginLeft: 8 }}>{stLabel}</span>
                    </div>
                  </div>
                );
              })}
            </>}
          </div>
        )}

        {/* ── LEASE ── */}
        {onboardingDone && activeTab === "documents" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Your Lease</h2>
            <div style={sCard}>
              <span style={sLabel}>Lease Summary</span>
              {[["Property", tenant?.property?.name], ["Room", tenant?.room?.name], ["Monthly Rent", fmt(tenant?.rent)], ["Security Deposit", fmt(tenant?.security_deposit)], ["Move-in", fmtD(tenant?.move_in)], ["Lease End", fmtD(tenant?.lease_end)], ["Signed", tenant?.lease_signed_at ? new Date(tenant.lease_signed_at).toLocaleDateString() : null]].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 700 }}>{val}</span></div>
              ))}
            </div>
            {dl !== null && dl <= 60 && (
              <div style={{ background: dl <= 30 ? "rgba(196,92,74,.06)" : "rgba(212,168,83,.06)", border: `1px solid ${dl <= 30 ? "rgba(196,92,74,.2)" : "rgba(212,168,83,.2)"}`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: dl <= 30 ? C.red : "#9a7422", marginBottom: 4 }}>Lease expires in {dl} days</div>
                <div style={{ fontSize: 12, color: C.muted }}>Contact {pm.company_name} at {pm.phone} to discuss renewal.</div>
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNT ── */}
        {onboardingDone && activeTab === "account" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Account</h2>
            <div style={sCard}>
              <span style={sLabel}>Profile</span>
              {[["Name", tenant?.name], ["Email", user?.email], ["Phone", tenant?.phone]].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 600 }}>{val}</span></div>
              ))}
            </div>
            <div style={sCard}>
              <span style={sLabel}>House Rules</span>
              {["No smoking or vaping anywhere on property", "No pets", "Remove shoes at the door", "Quiet hours: 10pm-7am weekdays, 11pm-10am weekends", "Keep shared spaces clean"].map((rule, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12, color: C.muted }}>
                  <span style={{ color: C.green, fontWeight: 800, flexShrink: 0 }}>✓</span>{rule}
                </div>
              ))}
            </div>
            <button onClick={signOut} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1.5px solid rgba(196,92,74,.2)", background: "rgba(196,92,74,.04)", color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <IcLogout s={16} /> Sign Out
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: "#bbb" }}>Powered by PropOS</div>
          </div>
        )}

      </div>
    </div>
  );
}
