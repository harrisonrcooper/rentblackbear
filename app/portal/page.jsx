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
import translations from "@/lib/i18n";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPA_URL, SUPA_ANON);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────
const hexRgba = (hex, a) => { const h = hex.replace("#", ""); const r = parseInt(h.substring(0, 2), 16); const g = parseInt(h.substring(2, 4), 16); const b = parseInt(h.substring(4, 6), 16); return `rgba(${r},${g},${b},${a})`; };
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n) => n != null ? "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
const fmtD = (d) => { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`; };
const daysLeft = (d) => { if (!d) return null; return Math.ceil((new Date(d + "T00:00:00") - new Date()) / (1e3 * 60 * 60 * 24)); };
// C is now built inside TenantPortal from pmSettings — see below
const C_DEFAULT = { bg: "#1a1714", accent: "#d4a853", green: "#4a7c59", red: "#c45c4a", text: "#1a1714", muted: "#5c4a3a" };

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
function StripePayForm({ amount, onSuccess, onCancel, creditFee, C }) {
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

// ── Signature Canvas ──────────────────────────────────────────────────
function SignatureCanvas({ onSave, onCancel, C }) {
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

// ── Autopay Setup Form ───────────────────────────────────────────────
function AutopaySetupForm({ onSuccess, onCancel, C }) {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!stripe || !elements) return;
    setSaving(true); setErr("");
    const { error, setupIntent } = await stripe.confirmSetup({
      elements, redirect: "if_required",
      confirmParams: { return_url: window.location.href },
    });
    if (error) { setErr(error.message); setSaving(false); }
    else if (setupIntent?.status === "succeeded") onSuccess(setupIntent);
    else setSaving(false);
  };

  return (
    <div>
      <div style={{ background: "#f8f7f5", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {err && <div style={{ fontSize: 12, color: C.red, background: hexRgba(C.red, .06), border: `1px solid ${hexRgba(C.red, .2)}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
        <button onClick={submit} disabled={saving || !stripe} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
          {saving ? "Saving..." : "Save Payment Method"}
        </button>
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
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab]         = useState("home");
  const [token, setToken]                 = useState(null);
  const [leaseId, setLeaseId]             = useState(null);
  const [leaseData, setLeaseData]         = useState(null);
  const [showFullLease, setShowFullLease] = useState(false);
  const [onboarding, setOnboarding]       = useState({ leaseSigned: false, sdPaid: false, firstMonthPaid: false });
  const [obStep, setObStep]               = useState(null);
  const [showSig, setShowSig]             = useState(false);
  const [stripeSecret, setStripeSecret]   = useState(null);
  const [payingCharge, setPayingCharge]   = useState(null);
  const [maintForm, setMaintForm]         = useState({ title: "", desc: "", priority: "medium", photos: [] });
  const [maintSubmitting, setMaintSubmitting] = useState(false);
  const [maintSuccess, setMaintSuccess]   = useState(false);
  const [noticeForm, setNoticeForm]       = useState({ moveOutDate: "", reason: "", showForm: false, step: 1, signature: null, submitting: false, submitted: false });
  const [autopay, setAutopay]             = useState({ enrolled: false, loading: false, setupSecret: null, showSetup: false });
  const [showDoorCode, setShowDoorCode]   = useState(false);
  const [doorCodeChange, setDoorCodeChange] = useState({ open: false, newCode: "", submitting: false, done: false, error: "" });
  const [referralCopied, setReferralCopied] = useState(false);
  const [notifPrefs, setNotifPrefs]       = useState({ payment_reminders: { email: true, text: true }, payment_confirmations: { email: true, text: true }, maintenance_updates: { email: true, text: true }, lease_reminders: { email: true, text: false }, announcements: { email: true, text: false } });
  const [contactForm, setContactForm]     = useState({ subject: "", message: "", sending: false, sent: false, showForm: false });
  const [tenantMessages, setTenantMessages] = useState([]);
  const [msgInput, setMsgInput]           = useState("");
  const [renewalModal, setRenewalModal]   = useState({ open: false, choice: null, submitting: false, submitted: false });

  // Realtime subscription for portal messages
  useEffect(() => {
    if (!tenant?.name) return;
    const channel = supabase.channel("portal-msgs-" + tenant.name).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      if (payload.new.tenant_name === tenant.name && payload.new.direction !== "note") {
        setTenantMessages(prev => [...prev, payload.new]);
      }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenant?.name]);
  const CREDIT_FEE = 0.029;

  const referralLink = typeof window !== "undefined" ? window.location.origin + "/apply?ref=" + (tenant?.id || "") : "";
  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  // Dynamic theme — PM can override bg, accent, green, red via pm_accounts columns
  const C = {
    bg:     pmSettings?.portal_bg     || C_DEFAULT.bg,
    accent: pmSettings?.portal_accent || C_DEFAULT.accent,
    green:  pmSettings?.portal_green  || C_DEFAULT.green,
    red:    pmSettings?.portal_red    || C_DEFAULT.red,
    text:   pmSettings?.portal_text   || C_DEFAULT.text,
    muted:  pmSettings?.portal_muted  || C_DEFAULT.muted,
  };

  // i18n — PM can set language per property via pmSettings.language
  const lang = pmSettings?.language || "en";
  const t = translations[lang] || translations.en;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);

    // DEV BYPASS — localhost:3000/portal?dev=true
    if (params.get("dev") === "true" && window.location.hostname === "localhost") {
      // Load real PM settings from hq-settings for dev mode too
      supabase.from("app_data").select("value").eq("key", "hq-settings").single().then(({ data: devSettings }) => {
        if (devSettings?.value) {
          const s = devSettings.value;
          setPmSettings({ company_name: s.companyName || "PropOS", phone: s.phone || "", email: s.email || "", pmName: s.pmName || "", pmEmail: s.pmEmail || "", houseRules: s.houseRules || [], referralCredit: s.referralCredit || 0, lateFeeGraceDays: s.lateFeeGraceDays, m2mIncrease: s.m2mIncrease, language: s.portalLanguage || "en" });
        } else { setPmSettings({ company_name: "PropOS", phone: "" }); }
      }).catch(() => { setPmSettings({ company_name: "PropOS", phone: "" }); });
      setUser({ email: "demo@test.com" });
      setTenant({ id: null, name: "Demo Tenant", rent: 750, security_deposit: 750, move_in: "2025-06-01", lease_end: "2026-06-01", lease_signed_at: new Date().toISOString(), door_code: "1234", property: { name: "Demo Property" }, room: { name: "Room A" } });
      setCharges([
        { id: "c1", category: "Security Deposit", description: "Security Deposit", amount: 750, amount_paid: 750, due_date: "2025-06-01", payments: [{ amount: 750, date: "2025-05-30", method: "ACH Bank Transfer", deposit_status: "deposited" }] },
        { id: "c2", category: "Rent", description: "June 2025 Rent", amount: 750, amount_paid: 750, due_date: "2025-06-01", payments: [{ amount: 750, date: "2025-06-01", method: "Debit Card", deposit_status: "deposited" }] },
        { id: "c3", category: "Rent", description: "July 2025 Rent", amount: 750, amount_paid: 0, due_date: "2025-07-01", payments: [] },
      ]);
      setLeaseId("ul56zet");
      // Load real lease data from Supabase for dev preview
      try {
        supabase.from("lease_instances").select("*").eq("id", "ul56zet").single().then(({ data: row }) => {
          if (row) setLeaseData({ ...(row.variable_data || {}), id: row.id, status: row.status, landlordSig: row.landlord_sig, tenantSig: row.tenant_sig, landlordSignedAt: row.landlord_signed_at, tenantSignedAt: row.tenant_signed_at });
        }).catch(() => {});
      } catch (e) {}
      setAnnouncements([
        { id: "demo1", title: "Water shut-off scheduled", body: "City maintenance will shut off water on April 12 from 8am to 2pm. Please plan accordingly.", createdAt: "2026-04-05T12:00:00Z", expiresAt: null, propertyId: null },
        { id: "demo2", title: "Parking lot repaving", body: "The main lot will be repaved April 15-17. Use the side lot during this time.", createdAt: "2026-04-03T09:00:00Z", expiresAt: "2026-04-18T23:59:59Z", propertyId: null },
      ]);
      setOnboarding({ leaseSigned: true, sdPaid: true, firstMonthPaid: true });
      // Load messages for dev tenant
      supabase.from("messages").select("*").eq("tenant_name", "Demo Tenant").order("created_at", { ascending: true }).then(({ data }) => { if (data) setTenantMessages(data); });
      setScreen("portal");
      return;
    }

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
      // Load settings from hq-settings (company info, announcements, house rules, referral credit)
      try {
        const { data: adRows } = await supabase.from("app_data").select("value").eq("key", "hq-settings").single();
        if (adRows?.value) {
          const hqSettings = adRows.value;
          // Merge company info into pmSettings so portal uses what PM configured
          setPmSettings(prev => ({
            ...prev,
            company_name: hqSettings.companyName || prev?.company_name || "PropOS",
            phone: hqSettings.phone || prev?.phone || "",
            email: hqSettings.email || prev?.email || "",
            pmName: hqSettings.pmName || prev?.pmName || "",
            pmEmail: hqSettings.pmEmail || prev?.pmEmail || "",
            houseRules: hqSettings.houseRules || prev?.houseRules || [],
            referralCredit: hqSettings.referralCredit || 0,
            lateFeeGraceDays: hqSettings.lateFeeGraceDays ?? prev?.lateFeeGraceDays,
            m2mIncrease: hqSettings.m2mIncrease ?? prev?.m2mIncrease,
            language: hqSettings.portalLanguage || prev?.language || "en",
          }));
          // Announcements
          if (hqSettings.announcements) {
            const now = new Date().toISOString();
            const propId = pu.tenant?.property_id || null;
            const active = hqSettings.announcements.filter(a => {
              if (a.expiresAt && a.expiresAt < now) return false;
              if (a.propertyId && a.propertyId !== propId) return false;
              return true;
            });
            setAnnouncements(active);
          }
        }
      } catch (e) { console.warn("Settings load:", e); }
      const { data: ch } = await supabase.from("charges").select("*, payments(*)").eq("tenant_id", pu.tenant_id).order("due_date", { ascending: false });
      setCharges(ch || []);
      const { data: mt } = await supabase.from("maintenance_requests").select("*").eq("tenant_id", pu.tenant_id).order("created_at", { ascending: false });
      setMaintenance(mt || []);
      // Load tenant messages
      try {
        const { data: msgs } = await supabase.from("messages").select("*").eq("tenant_name", pu.tenant?.name || "").order("created_at", { ascending: true });
        setTenantMessages(msgs || []);
      } catch (e) {}
      if (pu.tenant?.room_id) {
        const { data: leases } = await supabase.from("lease_instances").select("*").eq("room_id", pu.tenant.room_id).eq("status", "executed").order("created_at", { ascending: false }).limit(1);
        if (leases?.length) {
          setLeaseId(leases[0].id);
          const row = leases[0];
          setLeaseData({ ...(row.variable_data || {}), id: row.id, status: row.status, landlordSig: row.landlord_sig, tenantSig: row.tenant_sig, landlordSignedAt: row.landlord_signed_at, tenantSignedAt: row.tenant_signed_at });
        }
      }
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
      try {
        const { data: adRows } = await supabase.from("app_data").select("value").eq("key", "hq-settings").single();
        if (adRows?.value) {
          const hqSettings = adRows.value;
          setPmSettings(prev => ({ ...prev, company_name: hqSettings.companyName || prev?.company_name, phone: hqSettings.phone || prev?.phone, email: hqSettings.email || prev?.email, pmName: hqSettings.pmName || prev?.pmName, pmEmail: hqSettings.pmEmail || prev?.pmEmail, houseRules: hqSettings.houseRules || prev?.houseRules || [], referralCredit: hqSettings.referralCredit || 0, language: hqSettings.portalLanguage || prev?.language || "en" }));
          if (hqSettings.announcements) {
            const now = new Date().toISOString();
            const propId = pu.tenant?.property_id || null;
            setAnnouncements(hqSettings.announcements.filter(a => { if (a.expiresAt && a.expiresAt < now) return false; if (a.propertyId && a.propertyId !== propId) return false; return true; }));
          }
        }
      } catch (e) { console.warn("Settings load:", e); }
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
    if (payingCharge) return; // prevent double-click creating multiple intents
    setPayingCharge(charge);
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chargeId: charge.id, amount: charge.amount - charge.amount_paid, tenantName: tenant?.name, tenantEmail: user?.email }),
    });
    const { clientSecret } = await res.json();
    setStripeSecret(clientSecret);
    setObStep(charge.category === "Security Deposit" ? "sd" : "firstMonth");
  };

  const onPaymentSuccess = (paymentIntent) => {
    const amountPaid = payingCharge.amount - payingCharge.amount_paid;
    const now = new Date().toISOString().split("T")[0];
    const method = paymentIntent?.payment_method_types?.[0] === "us_bank_account" ? "ACH Bank Transfer" : "Card";
    const payment = { amount: amountPaid, date: now, method, deposit_status: "transit", stripe_payment_id: paymentIntent?.id || null };
    // Record payment in Supabase
    supabase.from("payments").insert({ charge_id: payingCharge.id, amount: amountPaid, date: now, method, deposit_status: "transit", stripe_payment_id: paymentIntent?.id || null });
    supabase.from("charges").update({ amount_paid: payingCharge.amount }).eq("id", payingCharge.id);
    // Update local state with the payment record
    setCharges(prev => prev.map(c => c.id === payingCharge.id ? { ...c, amount_paid: c.amount, payments: [...(c.payments || []), payment] } : c));
    if (payingCharge.category === "Security Deposit") setOnboarding(p => ({ ...p, sdPaid: true }));
    if (payingCharge.category === "Rent") setOnboarding(p => ({ ...p, firstMonthPaid: true }));
    setStripeSecret(null); setPayingCharge(null); setObStep(null);
  };

  const submitMaint = async () => {
    if (!maintForm.title.trim()) return;
    setMaintSubmitting(true);
    await supabase.from("maintenance_requests").insert({ pm_id: tenant?.pm_id, tenant_id: tenant?.id, property_id: tenant?.property_id, room_id: tenant?.room_id, title: maintForm.title, description: maintForm.desc, priority: maintForm.priority, submitted_by: tenant?.name, photos: maintForm.photos.length > 0 ? maintForm.photos : null });
    const { data: mt } = await supabase.from("maintenance_requests").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false });
    setMaintenance(mt || []);
    // Send email notification to PM
    try {
      await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: pmSettings?.pmEmail || pmSettings?.email || "",
          subject: "New Maintenance Request — " + maintForm.title,
          fromName: (pmSettings?.pmName || "PropOS") + " — Tenant Portal",
          replyTo: user?.email || "",
          html: "<p><strong>New maintenance request from " + (tenant?.name || "Tenant") + "</strong></p>" +
            "<p><strong>Issue:</strong> " + maintForm.title + "</p>" +
            (maintForm.desc ? "<p><strong>Details:</strong> " + maintForm.desc + "</p>" : "") +
            "<p><strong>Priority:</strong> " + maintForm.priority + "</p>" +
            "<p><strong>Property:</strong> " + (tenant?.property?.name || "") + " — " + (tenant?.room?.name || "") + "</p>" +
            (maintForm.photos.length > 0 ? "<p><em>" + maintForm.photos.length + " photo(s) attached</em></p>" : "") +
            "<p style='font-size:11px;color:#999;margin-top:16px;'>Submitted via tenant portal</p>",
        }),
      });
    } catch (e) {}
    setMaintForm({ title: "", desc: "", priority: "medium", photos: [] }); setMaintSuccess(true);
    setTimeout(() => setMaintSuccess(false), 4000); setMaintSubmitting(false);
  };

  // Calculate early termination details
  const getTerminationDetails = (moveOutDate) => {
    if (!moveOutDate || !tenant?.lease_end) return null;
    const moveOut = new Date(moveOutDate + "T00:00:00");
    const leaseEnd = new Date(tenant.lease_end + "T00:00:00");
    const isEarly = moveOut < leaseEnd;
    if (!isEarly) return { isEarly: false, remainingMonths: 0, remainingRent: 0, unpaidCharges: 0, sdAtRisk: false };
    const diffMs = leaseEnd - moveOut;
    const remainingMonths = Math.ceil(diffMs / (1e3 * 60 * 60 * 24 * 30));
    const remainingRent = remainingMonths * (tenant?.rent || 0);
    const unpaidCharges = charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).reduce((s, c) => s + (c.amount - c.amount_paid), 0);
    return { isEarly: true, remainingMonths, remainingRent, unpaidCharges, sdAtRisk: true, leaseEnd: tenant.lease_end };
  };

  const submitNotice = async () => {
    if (!noticeForm.moveOutDate || !noticeForm.signature) return;
    setNoticeForm(p => ({ ...p, submitting: true }));
    const moveOut = noticeForm.moveOutDate;
    const today = new Date().toISOString().split("T")[0];
    const termDetails = getTerminationDetails(moveOut);

    // Save to Supabase
    await supabase.from("notices").insert({
      pm_id: tenant?.pm_id, tenant_id: tenant?.id, property_id: tenant?.property_id,
      room_id: tenant?.room_id, tenant_name: tenant?.name, move_out_date: moveOut,
      reason: noticeForm.reason, signature: noticeForm.signature,
      is_early_termination: termDetails?.isEarly || false,
      remaining_rent: termDetails?.remainingRent || 0,
      unpaid_balance: termDetails?.unpaidCharges || 0,
      submitted_at: new Date().toISOString(),
    });
    await supabase.from("tenants").update({ notice_given_at: today, intended_move_out: moveOut }).eq("id", tenant.id);

    // Generate notice document and send to PM
    const noticeHtml = `
      <h2 style="font-family:Georgia,serif;text-align:center;">Notice to Vacate</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Tenant:</strong> ${esc(tenant?.name)}</p>
      <p><strong>Property:</strong> ${esc(tenant?.property?.name)} — ${esc(tenant?.room?.name)}</p>
      <p><strong>Intended Move-Out Date:</strong> ${fmtD(moveOut)}</p>
      ${noticeForm.reason ? `<p><strong>Reason:</strong> ${esc(noticeForm.reason)}</p>` : ""}
      <hr/>
      ${termDetails?.isEarly ? `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="color:#dc2626;font-weight:700;margin:0 0 8px;">Early Lease Termination</p>
          <p style="margin:4px 0;">Lease end date: ${fmtD(termDetails.leaseEnd)}</p>
          <p style="margin:4px 0;">Remaining months on lease: ${termDetails.remainingMonths}</p>
          <p style="margin:4px 0;">Remaining rent obligation: ${fmt(termDetails.remainingRent)}</p>
          <p style="margin:4px 0;">Current unpaid balance: ${fmt(termDetails.unpaidCharges)}</p>
          <p style="margin:4px 0;font-weight:600;">Security deposit may be forfeited per lease terms.</p>
        </div>
      ` : `<p style="color:#166534;">This is a standard end-of-lease move-out. No early termination fees apply.</p>`}
      <div style="margin-top:24px;">
        <p><strong>Tenant Signature:</strong></p>
        <img src="${noticeForm.signature}" style="max-height:60px;max-width:200px;"/>
        <p>${esc(tenant?.name)} — ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    // Email notice to PM
    try {
      await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        to: pmSettings?.pmEmail || pmSettings?.email || "",
        subject: "30-Day Notice to Vacate: " + (tenant?.name || "") + (termDetails?.isEarly ? " (EARLY TERMINATION)" : ""),
        html: noticeHtml,
        replyTo: user?.email || "",
      }) });
    } catch (e) {}

    // Also save as a message for the inbox
    await supabase.from("messages").insert({
      tenant_id: tenant?.id, tenant_name: tenant?.name, sender_email: user?.email || "",
      sender_name: tenant?.name, direction: "inbound",
      subject: "30-Day Notice to Vacate" + (termDetails?.isEarly ? " (Early Termination)" : ""),
      body: "I am submitting my 30-day notice to vacate on " + fmtD(moveOut) + "." + (noticeForm.reason ? " Reason: " + noticeForm.reason : "") + (termDetails?.isEarly ? " This is an early termination with " + termDetails.remainingMonths + " months remaining on my lease." : ""),
      property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false,
    });

    setNoticeForm({ moveOutDate: "", reason: "", showForm: false, step: 1, signature: null, submitting: false, submitted: true });
  };

  const chargeStatus = (c) => {
    if (c.voided) return "voided"; if (c.waived) return "waived";
    if (c.amount_paid >= c.amount) return "paid"; if (c.amount_paid > 0) return "partial";
    if (new Date(c.due_date + "T00:00:00") < new Date()) return "pastdue"; return "unpaid";
  };
  const totalDue = charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).reduce((s, c) => s + (c.amount - c.amount_paid), 0);
  const sdCharge = charges.find(c => c.category === "Security Deposit");
  const firstMonthCharge = charges.find(c => c.category === "Rent");
  const pm = pmSettings || { company_name: "PropOS", phone: "" };
  const dl = daysLeft(tenant?.lease_end);
  const onboardingDone = onboarding.leaseSigned && onboarding.sdPaid && onboarding.firstMonthPaid;

  const STEPS = [
    { key: "leaseSigned", label: t.onboarding.signLease, desc: t.onboarding.signLeaseDesc, action: () => setObStep("lease"), actionLabel: t.onboarding.reviewAndSign },
    { key: "sdPaid", label: t.onboarding.paySD, desc: sdCharge ? fmt(sdCharge.amount) + " — refundable at move-out" : "Pay your security deposit", action: () => sdCharge && startPayment(sdCharge), actionLabel: t.home.payNow, disabled: !onboarding.leaseSigned },
    { key: "firstMonthPaid", label: t.onboarding.payFirstMonth, desc: firstMonthCharge ? fmt(firstMonthCharge.amount) + " — due before move-in" : "Pay your first month", action: () => firstMonthCharge && startPayment(firstMonthCharge), actionLabel: t.home.payNow, disabled: !onboarding.leaseSigned },
    { key: "moveIn", label: t.onboarding.moveIn, desc: tenant?.move_in ? t.home.moveIn + ": " + fmtD(tenant.move_in) : "Portal unlocks after steps above", action: null, actionLabel: null, disabled: !onboardingDone },
  ];

  const sCard = { background: "#fff", borderRadius: 14, padding: 20, border: "1px solid rgba(0,0,0,.06)", marginBottom: 12 };
  const sLabel = { fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, display: "block" };
  const sRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 13 };

  // ── SCREENS ───────────────────────────────────────────────────────────
  const globalStyle = `*{box-sizing:border-box;margin:0;padding:0} input,textarea,select,button{font-family:inherit} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`;

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", background: "#1a1714", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{globalStyle}</style>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {/* Skeleton header */}
        <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 16, height: 120, marginBottom: 14, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 14, height: 90, animation: "pulse 1.5s ease infinite .2s" }} />
          <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 14, height: 90, animation: "pulse 1.5s ease infinite .4s" }} />
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 14, height: 160, animation: "pulse 1.5s ease infinite .6s" }} />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>{translations.en.common.loading}</div>
        </div>
      </div>
    </div>
  );

  if (screen === "no-access") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", padding: 24 }}>
      <style>{globalStyle}</style>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: hexRgba(C.red, .15), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ color: "#f5f0e8", fontSize: 20, marginBottom: 8 }}>No portal access found</h2>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Your account is not linked to a tenant record. Make sure you are using the same email your property manager sent the invite to.</p>
        <button onClick={signOut} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: C.accent, color: C.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Sign Out and Try Again</button>
        <div style={{ marginTop: 32, fontSize: 11, color: "rgba(255,255,255,.2)" }}>{t.common.poweredBy}</div>
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
          <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: C.accent, fontWeight: 700, marginBottom: 4 }}>{pm.company_name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>Tenant Portal</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 8px 40px rgba(0,0,0,.3)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>{authMode === "signin" ? t.auth.signIn : authMode === "signup" ? t.auth.createAccount : t.auth.resetPassword}</h2>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 24 }}>{authMode === "signin" ? t.auth.accessPortal : authMode === "signup" ? t.auth.needInvite : t.auth.enterEmail}</p>
          {successMsg && <div style={{ background: hexRgba(C.green, .08), border: `1px solid ${hexRgba(C.green, .2)}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, marginBottom: 16 }}>{successMsg}</div>}
          {authErr && <div style={{ background: hexRgba(C.red, .08), border: `1px solid ${hexRgba(C.red, .2)}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.red, marginBottom: 16 }}>{authErr}</div>}
          {authMode !== "forgot" && <button onClick={signInGoogle} disabled={authLoading} style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}><IcGoogle /> {t.auth.continueGoogle}</button>}
          {authMode !== "forgot" && <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.08)" }} /><span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>{t.auth.or}</span><div style={{ flex: 1, height: 1, background: "rgba(0,0,0,.08)" }} /></div>}
          <form onSubmit={authMode === "signin" ? signInEmail : authMode === "signup" ? signUpEmail : forgotPassword}>
            {authMode === "signup" && <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.auth.fullName}</label><input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Jane Smith" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>}
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.auth.emailAddress}</label><input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@email.com" autoFocus style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>
            {authMode !== "forgot" && <div style={{ marginBottom: 20 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.auth.password}</label><input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder={authMode === "signup" ? "Min. 8 characters" : "••••••••"} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>}
            <button type="submit" disabled={authLoading} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>{authLoading ? t.auth.pleaseWait : authMode === "signin" ? t.auth.signInBtn : authMode === "signup" ? t.auth.createAccountBtn : t.auth.sendResetLink}</button>
          </form>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
            {authMode === "signin" && <><button onClick={() => { setAuthMode("forgot"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>{t.auth.forgotPassword}</button><button onClick={() => { setAuthMode("signup"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>{t.auth.noAccount}</button></>}
            {authMode !== "signin" && <button onClick={() => { setAuthMode("signin"); setAuthErr(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999" }}>{t.auth.backToSignIn}</button>}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "rgba(255,255,255,.2)" }}>{t.common.poweredBy}</div>
      </div>
    </div>
  );

  // ── PORTAL ────────────────────────────────────────────────────────────
  const portalTabs = (() => { const unpaidCount = charges.filter(c => !c.waived && !c.voided && c.amount_paid < c.amount).length; const openMaintCount = maintenance.filter(m => m.status !== "resolved").length; const unreadMsgs = tenantMessages.filter(m => m.direction === "outbound" && !m.read).length; return [{ id: "home", label: t.nav.home, icon: <IcHome s={16} />, badge: 0 }, { id: "payments", label: t.nav.payments, icon: <IcDollar s={16} />, badge: unpaidCount }, { id: "messages", label: "Messages", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>, badge: unreadMsgs }, { id: "maintenance", label: t.nav.maintenance, icon: <IcWrench s={16} />, badge: openMaintCount }, { id: "documents", label: t.nav.lease, icon: <IcFile s={16} />, badge: 0 }, { id: "account", label: t.nav.account, icon: <IcUser s={16} />, badge: 0 }]; })();
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", minHeight: "100vh", background: "#f4f3f0", color: C.text }}>
      <style>{globalStyle + `
@media (max-width: 640px) {
  .portal-top-nav { display: none !important; }
  .portal-bot-nav { display: flex !important; }
  .portal-content { padding-bottom: 80px !important; }
}
`}</style>

      {/* Header */}
      <div style={{ background: C.bg, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.2)" }}>
        <div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.accent, fontWeight: 700 }}>{pm.company_name}</div>
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

      {/* Nav — only shown after onboarding (hidden on mobile via media query) */}
      {onboardingDone && (
        <div className="portal-top-nav" style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,.07)", overflowX: "auto" }}>
          <div style={{ display: "flex", maxWidth: 680, margin: "0 auto" }}>
            {portalTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "13px 8px", border: "none", background: "transparent", borderBottom: activeTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", fontSize: 11, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? C.text : "#999", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .15s", position: "relative" }}>
                <span style={{ color: activeTab === tab.id ? C.accent : "#bbb" }}>{tab.icon}</span>{tab.label}
                {tab.badge > 0 && <span style={{ position: "absolute", top: 4, right: "calc(50% - 18px)", minWidth: 16, height: 16, borderRadius: 8, background: "#c45c4a", color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff" }}>{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="portal-content" style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>

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
                            <p><strong>Property:</strong> {tenant?.property?.name} — {tenant?.room?.name}</p>
                            <p><strong>Rent:</strong> {fmt(tenant?.rent)}/mo {t.home.due1st}{pmSettings?.lateFeeGraceDays ? `, ${t.home.lateAfterDay} ${pmSettings.lateFeeGraceDays}` : ""}</p>
                            <p><strong>Term:</strong> {fmtD(tenant?.move_in)} to {fmtD(tenant?.lease_end)}</p>
                            <br />
                            {(pmSettings?.houseRules || tenant?.property?.house_rules || []).length > 0 && <p>{(pmSettings?.houseRules || tenant?.property?.house_rules || []).join(". ")}.</p>}
                            <p>Security deposit refundable at move-out minus damages. 30-day written notice required to vacate.{pmSettings?.m2mIncrease ? ` Month-to-month adds $${pmSettings.m2mIncrease}/mo after lease end.` : ""}</p>
                            <br />
                            <p>By signing you agree to all terms of this agreement and {pm.company_name} house rules.</p>
                          </div>
                          <button onClick={() => setShowSig(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>I Have Read the Agreement — Sign Now</button>
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
        )}

        {/* ── HOME ── */}
        {onboardingDone && activeTab === "home" && (
          <div style={{ animation: "fadeIn .2s" }}>
            {(() => {
              const hasPastDue = charges.some(c => !c.waived && !c.voided && c.amount_paid < c.amount && c.due_date && new Date(c.due_date + "T00:00:00") < new Date());
              return (
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ background: totalDue > 0 ? (hasPastDue ? hexRgba(C.red, .04) : "#fff") : C.bg, borderRadius: 16, padding: "28px 24px", border: totalDue > 0 ? (hasPastDue ? "2px solid " + hexRgba(C.red, .25) : "1px solid rgba(0,0,0,.06)") : "none" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: hasPastDue ? C.red : C.muted, textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>{hasPastDue ? t.home.pastDueHeader : t.home.balanceDue}</div>
                    <div style={{ fontSize: 44, fontWeight: 800, color: totalDue > 0 ? (hasPastDue ? C.red : C.text) : C.green, letterSpacing: -1 }}>{fmt(totalDue)}</div>
                    {totalDue === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}>{t.home.allPaidUp}</div>}
                    {totalDue > 0 && hasPastDue && <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginTop: 6 }}>{t.home.payImmediately}</div>}
                    {totalDue > 0 && (
                      <button onClick={() => { setActiveTab("payments"); const unpaid = charges.find(c => !c.waived && !c.voided && c.amount_paid < c.amount); if (unpaid) setTimeout(() => startPayment(unpaid), 300); }} style={{ marginTop: 14, padding: "10px 32px", borderRadius: 8, border: "none", background: hasPastDue ? C.red : C.bg, color: hasPastDue ? "#fff" : C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        {t.home.payNow}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={sCard}><span style={sLabel}>{t.home.monthlyRent}</span><div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(tenant?.rent)}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{t.home.due1st}{pmSettings?.lateFeeGraceDays ? ` \u2014 ${t.home.lateAfterDay} ${pmSettings.lateFeeGraceDays}` : ""}</div>{(() => { const now = new Date(); const y = now.getFullYear(); const mo = now.getMonth(); const firstNextMonth = new Date(y, mo + 1, 1); const firstThisMonth = new Date(y, mo, 1); const nextDue = now.getDate() > 1 ? firstNextMonth : firstThisMonth; const diffDays = Math.ceil((nextDue - now) / (1e3 * 60 * 60 * 24)); const nearestUnpaid = charges.find(c => !c.waived && !c.voided && c.amount_paid < c.amount && (c.type === "rent" || (c.label || "").toLowerCase().includes("rent"))); const isPastDue = nearestUnpaid && nearestUnpaid.due_date && new Date(nearestUnpaid.due_date + "T00:00:00") < now; if (isPastDue) { const overdueDays = Math.floor((now - new Date(nearestUnpaid.due_date + "T00:00:00")) / (1e3 * 60 * 60 * 24)); return <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginTop: 4 }}>{t.home.pastDue + " -- " + overdueDays + " " + t.home.daysOverdue}</div>; } if (diffDays === 0) return <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginTop: 4 }}>{t.home.dueToday}</div>; if (diffDays <= 3) return <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginTop: 4 }}>{t.home.dueIn + " " + diffDays + " " + t.home.days}</div>; if (diffDays <= 7) return <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 4 }}>{t.home.dueIn + " " + diffDays + " " + t.home.days}</div>; return null; })()}</div>
              <div onClick={() => { if (dl !== null && dl <= 90 && dl > 0) setRenewalModal({ open: true, choice: null, submitting: false, submitted: false }); else setActiveTab("documents"); }} style={{ ...sCard, cursor: "pointer", transition: "border-color .15s", borderColor: dl && dl <= 60 ? hexRgba(C.red, .2) : "rgba(0,0,0,.06)" }}><span style={sLabel}>{t.home.leaseEnd}</span><div style={{ fontSize: 22, fontWeight: 800, color: dl && dl <= 60 ? C.red : C.text }}>{fmtD(tenant?.lease_end)}</div>{dl !== null && <div style={{ fontSize: 11, color: dl <= 30 ? C.red : dl <= 60 ? C.accent : "#999", marginTop: 2 }}>{dl > 0 ? dl + " " + t.home.daysRemaining : t.home.expired}</div>}{dl !== null && dl <= 90 && dl > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-start" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>{t.home.renewalOptions}</div>}</div>
            </div>
            {announcements.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span style={sLabel}>{t.home.announcements}</span>
                {announcements.map(a => (
                  <div key={a.id} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,.06)", borderLeft: `4px solid ${C.accent}`, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{a.body}</div>
                        <div style={{ fontSize: 10, color: "#999", marginTop: 8 }}>{t.home.posted} {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={sCard}>
              <span style={sLabel}>{t.home.yourRoom}</span>
              {[[t.home.property, tenant?.property?.name], [t.home.room, tenant?.room?.name], [t.home.moveIn, fmtD(tenant?.move_in)]].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 600 }}>{val}</span></div>
              ))}
              {(tenant?.door_code || tenant?.room?.door_code) && (
                <div>
                  <div style={sRow}>
                    <span style={{ color: C.muted }}>{t.home.doorCode}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setShowDoorCode(!showDoorCode)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 800, letterSpacing: showDoorCode ? 4 : 2, fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                        {showDoorCode ? (tenant?.door_code || tenant?.room?.door_code) : "\u2022\u2022\u2022\u2022"}
                        {showDoorCode
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                      {pmSettings?.allowDoorCodeChange !== false && !doorCodeChange.open && (
                        <button onClick={() => setDoorCodeChange({ open: true, newCode: "", submitting: false, done: false, error: "" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.accent, fontWeight: 700, padding: 0 }}>{t.home.change}</button>
                      )}
                    </div>
                  </div>
                  {/* Door code change flow */}
                  {doorCodeChange.open && (
                    <div style={{ padding: "10px 0" }}>
                      {doorCodeChange.done ? (
                        <div style={{ background: hexRgba(C.green, .08), border: "1px solid " + hexRgba(C.green, .2), borderRadius: 8, padding: "10px 12px", fontSize: 11, color: C.green, fontWeight: 600 }}>
                          {pmSettings?.lockType === "smart_api" ? "Door code updated successfully." : pmSettings?.lockType === "smart_manual" ? "Request sent. Your PM will update the lock remotely." : "Maintenance request submitted. Your PM will update the lock."}
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                            <input value={doorCodeChange.newCode} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setDoorCodeChange(p => ({ ...p, newCode: v, error: "" })); }} placeholder="New 4-digit code" maxLength={4} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1.5px solid " + (doorCodeChange.error ? C.red : "rgba(0,0,0,.1)"), fontSize: 14, fontFamily: "monospace", letterSpacing: 6, textAlign: "center" }} />
                          </div>
                          {doorCodeChange.error && <div style={{ fontSize: 10, color: C.red, marginBottom: 6 }}>{doorCodeChange.error}</div>}
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setDoorCodeChange({ open: false, newCode: "", submitting: false, done: false, error: "" })} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.common.cancel}</button>
                            <button disabled={doorCodeChange.submitting} onClick={async () => {
                              const code = doorCodeChange.newCode;
                              if (code.length !== 4) { setDoorCodeChange(p => ({ ...p, error: "Must be exactly 4 digits" })); return; }
                              if (code === (tenant?.door_code || tenant?.room?.door_code)) { setDoorCodeChange(p => ({ ...p, error: "Same as current code" })); return; }
                              setDoorCodeChange(p => ({ ...p, submitting: true }));
                              const lockType = pmSettings?.lockType || "dumb";
                              if (lockType === "smart_api") {
                                // API-connected smart lock — update directly
                                await supabase.from("tenants").update({ door_code: code }).eq("id", tenant?.id);
                                // TODO: Call lock API here (e.g. Sifely, August, Yale)
                                setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                              } else if (lockType === "smart_manual") {
                                // Smart lock but no API — notify PM to update remotely
                                await supabase.from("tenants").update({ door_code: code }).eq("id", tenant?.id);
                                await supabase.from("messages").insert({ tenant_name: tenant?.name, sender_email: user?.email || "", sender_name: tenant?.name, direction: "inbound", subject: "Door Code Change Request", body: "Please update my door code to: " + code + "\nProperty: " + (tenant?.property?.name || "") + "\nRoom: " + (tenant?.room?.name || ""), property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false });
                                try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Door Code Change: " + (tenant?.name || "") + " \u2192 " + code, html: "<p><strong>" + esc(tenant?.name) + "</strong> has requested a door code change.</p><p>New code: <strong>" + code + "</strong></p><p>" + esc(tenant?.property?.name) + " \u2014 " + esc(tenant?.room?.name) + "</p><p>Please update the smart lock remotely.</p>" }) }); } catch (e) {}
                                setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                              } else {
                                // Dumb lock — create maintenance request
                                await supabase.from("maintenance_requests").insert({ pm_id: tenant?.pm_id, tenant_id: tenant?.id, property_id: tenant?.property_id, room_id: tenant?.room_id, title: "Door Code Change Request", description: "Tenant requests new door code: " + code, priority: "medium", submitted_by: tenant?.name });
                                try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Door Code Change Request: " + (tenant?.name || ""), html: "<p><strong>" + esc(tenant?.name) + "</strong> has requested a door code change to <strong>" + code + "</strong>.</p><p>" + esc(tenant?.property?.name) + " \u2014 " + esc(tenant?.room?.name) + "</p><p>A maintenance request has been created.</p>" }) }); } catch (e) {}
                                setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                              }
                            }} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", background: doorCodeChange.newCode.length === 4 ? C.bg : "rgba(0,0,0,.08)", color: doorCodeChange.newCode.length === 4 ? C.accent : "#bbb", cursor: doorCodeChange.newCode.length === 4 ? "pointer" : "default", fontSize: 11, fontWeight: 800 }}>
                              {doorCodeChange.submitting ? t.home.updating : t.home.updateCode}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {maintenance.filter(m => m.status !== "resolved").length > 0 && (
              <div style={sCard}>
                <span style={sLabel}>{t.home.openMaintenance}</span>
                {maintenance.filter(m => m.status !== "resolved").map(req => (
                  <div key={req.id} style={{ ...sRow, alignItems: "flex-start" }}>
                    <div><div style={{ fontSize: 12, fontWeight: 600 }}>{req.title}</div><div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString()}</div></div>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 700, background: req.status === "in-progress" ? hexRgba(C.accent, .12) : hexRgba(C.red, .08), color: req.status === "in-progress" ? C.accent : C.red }}>{req.status === "in-progress" ? t.home.inProgress : t.home.open}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {onboardingDone && activeTab === "messages" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Messages</h2>

            {/* Realtime handled in useEffect below */}

            {/* Message thread */}
            <div style={{ ...sCard, padding: 0, minHeight: 300, display: "flex", flexDirection: "column" }}>
              {/* Messages list */}
              <div ref={el => { if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50); }} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", maxHeight: 400 }}>
                {tenantMessages.length === 0 && (
                  <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 8 }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>No messages yet</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Send a message to your property manager below.</div>
                  </div>
                )}
                {tenantMessages.filter(msg => msg.direction !== "note").map(msg => {
                  const isMe = msg.direction === "inbound";
                  return (
                    <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
                      <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 14, background: isMe ? C.bg : "#f4f3f0", color: isMe ? "#f5f0e8" : C.text, borderBottomRightRadius: isMe ? 4 : 14, borderBottomLeftRadius: isMe ? 14 : 4 }}>
                        {msg.subject && <div style={{ fontSize: 10, fontWeight: 700, opacity: .6, marginBottom: 3 }}>{msg.subject}</div>}
                        <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.original_body || msg.body}</div>
                        <div style={{ fontSize: 9, opacity: .5, marginTop: 4, textAlign: "right" }}>
                          {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 8 }}>
                <input
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={async e => { if (e.key === "Enter" && !e.shiftKey && msgInput.trim()) { e.preventDefault(); const body = msgInput.trim(); setMsgInput(""); const tenantName = tenant?.name || "Tenant"; await supabase.from("messages").insert({ tenant_id: tenant?.id, tenant_name: tenantName, sender_email: user?.email || "", sender_name: tenantName, direction: "inbound", subject: "", body, property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false }); try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Portal Message from " + tenantName, html: "<p>" + esc(body).replace(/\n/g, "<br/>") + "</p>", replyTo: user?.email || "" }) }); } catch (ex) {} const { data: msgs } = await supabase.from("messages").select("*").eq("tenant_name", tenantName).order("created_at", { ascending: true }); setTenantMessages(msgs || []); } }}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                />
                <button onClick={async () => { if (!msgInput.trim()) return; const body = msgInput.trim(); setMsgInput(""); const tenantName = tenant?.name || "Tenant"; await supabase.from("messages").insert({ tenant_id: tenant?.id, tenant_name: tenantName, sender_email: user?.email || "", sender_name: tenantName, direction: "inbound", subject: "", body, property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false }); try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Portal Message from " + tenantName, html: "<p>" + esc(body).replace(/\n/g, "<br/>") + "</p>", replyTo: user?.email || "" }) }); } catch (ex) {} const { data: msgs } = await supabase.from("messages").select("*").eq("tenant_name", tenantName).order("created_at", { ascending: true }); setTenantMessages(msgs || []); }} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>

            {/* PM contact info footer */}
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,0,0,.03)", borderRadius: 8, fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              {pm.company_name}{pm.phone ? " \u00b7 " + pm.phone : ""}{pmSettings?.email ? " \u00b7 " + pmSettings.email : ""}
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {onboardingDone && activeTab === "payments" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.payments.title}</h2>
            {charges.length === 0 && <div style={{ ...sCard, textAlign: "center", padding: 40, color: "#999" }}>{t.payments.noCharges}</div>}
            {charges.map(c => {
              const st = chargeStatus(c);
              const stColor = { paid: C.green, unpaid: "#3b82f6", pastdue: C.red, partial: C.accent, waived: "#999", voided: "#999" }[st];
              const stLabel = { paid: t.payments.paid, unpaid: t.payments.unpaid, pastdue: t.payments.pastDue, partial: t.payments.partial, waived: t.payments.waived, voided: t.payments.voided }[st];
              const canPay = st === "unpaid" || st === "pastdue" || st === "partial";
              return (
                <div key={c.id} style={{ ...sCard, borderColor: st === "pastdue" ? hexRgba(C.red, .25) : "rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.description || c.category}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{t.payments.due} {fmtD(c.due_date)}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(c.amount)}</div><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor }}>{stLabel}</span></div>
                  </div>
                  {c.amount_paid > 0 && c.amount_paid < c.amount && <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{fmt(c.amount_paid)} {t.payments.paid.toLowerCase()} — {fmt(c.amount - c.amount_paid)} {t.payments.remaining}</div>}
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
                        <div class="row"><span class="label">Charge</span><span class="value">${c.category?esc(c.category)+" — ":""}${esc(c.description)}</span></div>
                        <div class="row"><span class="label">Payment Method</span><span class="value">${esc(p.method)}</span></div>
                        <div class="row"><span class="label">Status</span><span class="value">${p.deposit_status==="transit"?"In Transit":"Received &amp; Deposited"}</span></div>
                        ${p.stripe_payment_id?`<div class="row"><span class="label">Transaction ID</span><span class="value" style="font-family:monospace;font-size:11px">${p.stripe_payment_id}</span></div>`:""}
                        <div class="total"><span>Amount Paid</span><span>$${Number(p.amount).toLocaleString()}</span></div>
                        <div class="footer">${esc(pm?.company_name)}${pm?.phone?" · "+esc(pm.phone):""}<br/>This receipt confirms payment was received. Please retain for your records.</div>
                      </body></html>`);
                      w.document.close();w.print();
                    };
                    return (
                      <div key={i} style={{ padding: "8px 10px", background: hexRgba(C.green, .05), borderRadius: 8, fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ color: C.muted }}>{p.method} — {fmtD(p.date)} — {p.deposit_status === "transit" ? t.payments.inTransit : p.deposit_status === "deposited" ? t.payments.deposited : t.payments.processing}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, color: C.green }}>{fmt(p.amount)}</span>
                          {st === "paid" && <button onClick={printReceipt} title="Download Receipt" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px solid ${hexRgba(C.green, .2)}`, background: hexRgba(C.green, .06), color: C.green, fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>{t.payments.receipt}</button>}
                        </div>
                      </div>
                    );
                  })}
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
          </div>
        )}

        {/* ── MAINTENANCE ── */}
        {onboardingDone && activeTab === "maintenance" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.maintenance.title}</h2>
            <div style={sCard}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>{t.maintenance.submitRequest}</div>
              {maintSuccess && <div style={{ background: hexRgba(C.green, .08), border: `1px solid ${hexRgba(C.green, .2)}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, marginBottom: 14 }}>{t.maintenance.success}</div>}
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.whatIsIssue}</label><input value={maintForm.title} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Leaky faucet in bathroom" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.details}</label><textarea value={maintForm.desc} onChange={e => setMaintForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, resize: "vertical" }} /></div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.priority}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["low", t.maintenance.low, C.green], ["medium", t.maintenance.medium, C.accent], ["high", t.maintenance.high, C.red]].map(([v, l, col]) => (
                    <button key={v} onClick={() => setMaintForm(p => ({ ...p, priority: v }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${maintForm.priority === v ? col : "rgba(0,0,0,.1)"}`, background: maintForm.priority === v ? col + "15" : "#fff", cursor: "pointer", fontSize: 11, fontWeight: maintForm.priority === v ? 700 : 500, color: maintForm.priority === v ? col : "#999" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.photos}</label>
                {maintForm.photos.length < 3 && (
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.muted }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {t.maintenance.addPhoto}
                    <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => {
                      const files = Array.from(e.target.files || []);
                      const remaining = 3 - maintForm.photos.length;
                      files.slice(0, remaining).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (ev) => setMaintForm(p => ({ ...p, photos: p.photos.length < 3 ? [...p.photos, ev.target.result] : p.photos }));
                        reader.readAsDataURL(file);
                      });
                      e.target.value = "";
                    }} />
                  </label>
                )}
                {maintForm.photos.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {maintForm.photos.map((src, i) => (
                      <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                        <img src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)" }} />
                        <button onClick={() => setMaintForm(p => ({ ...p, photos: p.photos.filter((_, j) => j !== i) }))} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: 10, border: "none", background: C.red, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={submitMaint} disabled={maintSubmitting || !maintForm.title.trim()} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: maintForm.title.trim() ? C.bg : "rgba(0,0,0,.08)", color: maintForm.title.trim() ? C.accent : "#bbb", fontWeight: 800, fontSize: 14, cursor: maintForm.title.trim() ? "pointer" : "default" }}>{maintSubmitting ? t.maintenance.submitting : t.maintenance.submit}</button>
            </div>
            {maintenance.length > 0 && <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>{t.maintenance.history}</div>
              {maintenance.map(req => {
                const stColor = { open: C.red, "in-progress": C.accent, resolved: C.green }[req.status];
                const stLabel = { open: t.home.open, "in-progress": t.home.inProgress, resolved: t.maintenance.resolved }[req.status];
                return (
                  <div key={req.id} style={sCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{req.title}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString()}</div>{req.description && <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{req.description}</div>}</div>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor, flexShrink: 0, marginLeft: 8 }}>{stLabel}</span>
                    </div>
                    {req.photos && Array.isArray(req.photos) && req.photos.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        {req.photos.map((src, i) => (
                          <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.08)", cursor: "pointer" }} onClick={() => window.open(src, "_blank")} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>}
          </div>
        )}

        {/* ── LEASE ── */}
        {onboardingDone && activeTab === "documents" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.lease.title}</h2>

            {/* Summary Card */}
            <div style={sCard}>
              <span style={sLabel}>{t.lease.summary}</span>
              {[[t.home.property, tenant?.property?.name], [t.home.room, tenant?.room?.name], [t.home.monthlyRent, fmt(tenant?.rent)], [t.lease.securityDeposit, fmt(tenant?.security_deposit)], [t.home.moveIn, fmtD(tenant?.move_in)], [t.home.leaseEnd, fmtD(tenant?.lease_end)], [t.lease.signed, tenant?.lease_signed_at ? new Date(tenant.lease_signed_at).toLocaleDateString() : null]].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 700 }}>{val}</span></div>
              ))}
              {leaseData?.landlordSignedAt && <div style={{ ...sRow, borderBottom: "none" }}><span style={{ color: C.muted }}>{t.lease.pmSigned}</span><span style={{ fontWeight: 600, color: C.green }}>{new Date(leaseData.landlordSignedAt).toLocaleDateString()}</span></div>}
              {leaseData?.tenantSignedAt && <div style={{ ...sRow, borderBottom: "none" }}><span style={{ color: C.muted }}>{t.lease.tenantSigned}</span><span style={{ fontWeight: 600, color: C.green }}>{new Date(leaseData.tenantSignedAt).toLocaleDateString()}</span></div>}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {leaseData?.sections?.length > 0 && (
                  <button onClick={() => setShowFullLease(!showFullLease)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", color: C.text }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {showFullLease ? t.lease.hideFull : t.lease.viewFull}
                  </button>
                )}
                {leaseId && (
                  <a href={"/api/generate-lease-pdf?id=" + leaseId} target="_blank" rel="noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer", textDecoration: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {t.lease.downloadPdf}
                  </a>
                )}
              </div>
            </div>

            {/* Full Lease Preview */}
            {showFullLease && leaseData?.sections && (
              <div style={{ ...sCard, marginTop: 12, padding: 0 }}>
                {/* Lease header */}
                <div style={{ background: C.bg, borderRadius: "14px 14px 0 0", padding: "20px 24px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: C.accent, fontWeight: 700 }}>{pm.company_name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.lease.leaseAgreement}</div>
                </div>

                {/* Parties */}
                <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                  <div style={{ flex: 1, padding: 10, background: "#faf9f7", borderRadius: 6, border: "1px solid rgba(0,0,0,.05)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{t.lease.propertyManager}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{leaseData.landlordName || pm.company_name}</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: "#faf9f7", borderRadius: 6, border: "1px solid rgba(0,0,0,.05)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{t.lease.tenant}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{leaseData.tenantName || tenant?.name}</div>
                  </div>
                </div>

                {/* Sections */}
                <div style={{ padding: "16px 20px" }}>
                  <style>{`
                    .lease-content ul,.lease-content ol{padding-left:24px;margin:6px 0}
                    .lease-content li{margin:3px 0;line-height:1.7}
                    .lease-content p{margin:4px 0}
                  `}</style>
                  {(leaseData.sections || []).filter(s => s.active !== false).map((sec, i) => (
                    <div key={sec.id || i} style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.bg, color: C.accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{sec.title}</div>
                      </div>
                      <div className="lease-content" style={{ fontSize: 12, lineHeight: 1.8, color: C.muted, paddingLeft: 32 }} dangerouslySetInnerHTML={{ __html: sec.content || "" }} />
                    </div>
                  ))}
                </div>

                {/* Signatures */}
                <div style={{ display: "flex", gap: 16, padding: "16px 20px", borderTop: "2px solid rgba(0,0,0,.08)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.lease.propertyManager}</div>
                    {leaseData.landlordSig ? (
                      <div><img src={leaseData.landlordSig} alt="PM signature" style={{ height: 40, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 4 }} /><div style={{ fontSize: 11, fontWeight: 600 }}>{leaseData.landlordName}</div>{leaseData.landlordSignedAt && <div style={{ fontSize: 10, color: C.muted }}>{t.lease.signed} {new Date(leaseData.landlordSignedAt).toLocaleDateString()}</div>}</div>
                    ) : <div style={{ borderBottom: "1px solid rgba(0,0,0,.2)", height: 40, marginBottom: 4 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.lease.tenant}</div>
                    {leaseData.tenantSig ? (
                      <div><img src={leaseData.tenantSig} alt="Tenant signature" style={{ height: 40, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 4 }} /><div style={{ fontSize: 11, fontWeight: 600 }}>{leaseData.tenantName || tenant?.name}</div>{leaseData.tenantSignedAt && <div style={{ fontSize: 10, color: C.muted }}>{t.lease.signed} {new Date(leaseData.tenantSignedAt).toLocaleDateString()}</div>}</div>
                    ) : <div style={{ borderBottom: "1px solid rgba(0,0,0,.2)", height: 40, marginBottom: 4 }} />}
                  </div>
                </div>
              </div>
            )}

            {/* Lease expiration warning + renewal */}
            {dl !== null && dl <= 90 && dl > 0 && (
              <div style={{ background: dl <= 30 ? hexRgba(C.red, .06) : hexRgba(C.accent, .06), border: `1px solid ${dl <= 30 ? hexRgba(C.red, .2) : hexRgba(C.accent, .2)}`, borderRadius: 12, padding: 16, marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: dl <= 30 ? C.red : C.accent, marginBottom: 4 }}>{t.lease.expiresIn} {dl} {t.home.days}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{t.common.contact} {pm.company_name}{pm.phone ? " " + t.common.at + " " + pm.phone : ""} {t.lease.contactRenewal}</div>
                <button onClick={() => setRenewalModal({ open: true, choice: null, submitting: false, submitted: false })} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                  {t.lease.viewRenewalOptions}
                </button>
              </div>
            )}

            {/* House Rules */}
            {(pmSettings?.houseRules || tenant?.property?.house_rules || []).length > 0 && (
              <div style={{ ...sCard, marginTop: 12 }}>
                <span style={sLabel}>{t.account.houseRules}</span>
                {(pmSettings?.houseRules || tenant?.property?.house_rules || []).map((rule, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12, color: C.muted }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                    {rule}
                  </div>
                ))}
              </div>
            )}

            {/* Notice to Vacate — Multi-step flow */}
            <div style={{ ...sCard, marginTop: 12 }}>
              <span style={sLabel}>{t.lease.noticeToVacate}</span>
              {noticeForm.submitted ? (
                <div style={{ background: hexRgba(C.green, .08), border: `1px solid ${hexRgba(C.green, .2)}`, borderRadius: 8, padding: "12px 14px", fontSize: 12, color: C.green, fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}><path d="M20 6L9 17l-5-5"/></svg>
                  {t.lease.noticeSubmitted} {pm.company_name} {t.lease.moveOutDetails}
                </div>
              ) : !noticeForm.showForm ? (
                <div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>{t.lease.noticeDesc}</div>
                  <button onClick={() => setNoticeForm(p => ({ ...p, showForm: true, step: 1 }))} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1.5px solid ${hexRgba(C.red, .2)}`, background: hexRgba(C.red, .04), color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {t.lease.submitNotice}
                  </button>
                </div>
              ) : (
                <div>
                  {/* Step indicator */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: noticeForm.step >= s ? C.red : "rgba(0,0,0,.08)", transition: "background .2s" }} />)}
                  </div>

                  {/* Step 1: Date + Reason */}
                  {noticeForm.step === 1 && (
                    <div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.lease.moveOutDate}</label>
                        <input type="date" value={noticeForm.moveOutDate} onChange={e => setNoticeForm(p => ({ ...p, moveOutDate: e.target.value }))} min={new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} />
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{t.lease.moveOutMin}</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.lease.reason}</label>
                        <textarea value={noticeForm.reason} onChange={e => setNoticeForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. Relocating for work, end of internship..." rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, resize: "vertical" }} />
                      </div>
                      {/* Early termination warning */}
                      {noticeForm.moveOutDate && (() => {
                        const td = getTerminationDetails(noticeForm.moveOutDate);
                        if (!td?.isEarly) return null;
                        return (
                          <div style={{ background: hexRgba(C.red, .04), border: `1px solid ${hexRgba(C.red, .15)}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6 }}>Early Lease Termination</div>
                            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                              Your lease runs until <strong>{fmtD(td.leaseEnd)}</strong>. Moving out early means:
                            </div>
                            <div style={{ marginTop: 8, fontSize: 11 }}>
                              {[["Months remaining", td.remainingMonths], ["Rent obligation", fmt(td.remainingRent)], ["Current unpaid balance", fmt(td.unpaidCharges)]].map(([k, v]) => (
                                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}><span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 700, color: C.red }}>{v}</span></div>
                              ))}
                            </div>
                            <div style={{ fontSize: 10, color: C.red, fontWeight: 600, marginTop: 8 }}>Security deposit may be forfeited per lease terms.</div>
                          </div>
                        );
                      })()}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setNoticeForm(p => ({ ...p, showForm: false, step: 1 }))} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{t.common.cancel}</button>
                        <button onClick={() => { if (noticeForm.moveOutDate) setNoticeForm(p => ({ ...p, step: 2 })); }} disabled={!noticeForm.moveOutDate} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: noticeForm.moveOutDate ? C.bg : "rgba(0,0,0,.08)", color: noticeForm.moveOutDate ? C.accent : "#bbb", cursor: noticeForm.moveOutDate ? "pointer" : "default", fontWeight: 800, fontSize: 13 }}>Continue</button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Signature */}
                  {noticeForm.step === 2 && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Sign Your Notice</div>
                      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>Draw your signature below to confirm this notice. This is a legally binding document.</div>
                      <SignatureCanvas onSave={(sig) => setNoticeForm(p => ({ ...p, signature: sig, step: 3 }))} onCancel={() => setNoticeForm(p => ({ ...p, step: 1 }))} C={C} />
                    </div>
                  )}

                  {/* Step 3: Review + Confirm */}
                  {noticeForm.step === 3 && (
                    <div>
                      <div style={{ background: hexRgba(C.red, .04), border: `2px solid ${hexRgba(C.red, .2)}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          <span style={{ fontSize: 14, fontWeight: 800, color: C.red }}>Legal Notice</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
                          By submitting this notice, you are providing <strong>30 days written notice</strong> of your intent to vacate <strong>{tenant?.property?.name} {"\u2014"} {tenant?.room?.name}</strong> on <strong>{fmtD(noticeForm.moveOutDate)}</strong>.
                          {(() => { const td = getTerminationDetails(noticeForm.moveOutDate); return td?.isEarly ? " This is an early termination. You may be responsible for " + fmt(td.remainingRent) + " in remaining rent and your security deposit of " + fmt(tenant?.security_deposit) + " may be forfeited." : ""; })()}
                          {" "}This action cannot be undone.
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Your signature:</div>
                      {noticeForm.signature && <img src={noticeForm.signature} alt="Signature" style={{ height: 50, maxWidth: 200, objectFit: "contain", display: "block", marginBottom: 12, border: "1px solid rgba(0,0,0,.08)", borderRadius: 6, padding: 4 }} />}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setNoticeForm(p => ({ ...p, step: 2, signature: null }))} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{t.lease.goBack}</button>
                        <button onClick={submitNotice} disabled={noticeForm.submitting} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: C.red, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>
                          {noticeForm.submitting ? "Submitting..." : "I Understand \u2014 Submit Notice"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Proof of Residency */}
            <div style={{ ...sCard, marginTop: 12 }}>
              <span style={sLabel}>{t.lease.proofOfResidency}</span>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>{t.lease.proofDesc}</div>
              <button onClick={() => {
                const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                const w = window.open("","_blank");
                w.document.write(`<!DOCTYPE html><html><head><title>Proof of Residency — ${esc(tenant?.name)}</title><style>
                  body{font-family:Georgia,serif;max-width:620px;margin:50px auto;padding:0 32px;color:#1a1714;line-height:1.8}
                  .header{text-align:center;border-bottom:2px solid #1a1714;padding-bottom:16px;margin-bottom:32px}
                  .header h1{font-size:18px;font-weight:700;margin:0 0 4px}
                  .title{font-size:15px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:24px}
                  .date{font-size:13px;color:#666;margin-bottom:24px}
                  .body{font-size:14px;margin-bottom:32px;text-align:justify}
                  .closing{font-size:14px;margin-top:40px}
                  .closing .name{font-weight:700;margin-top:24px}
                  .footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:center}
                  @media print{body{margin:20px}}
                </style></head><body>
                  <div class="header"><h1>${esc(pm?.company_name)}</h1></div>
                  <div class="title">Proof of Residency</div>
                  <div class="date">${today}</div>
                  <div class="body">
                    <p>To Whom It May Concern,</p>
                    <p>This letter confirms that <strong>${esc(tenant?.name)}</strong> currently resides at <strong>${esc(tenant?.property)}, ${esc(tenant?.room)}</strong>. They have been a resident since <strong>${esc(fmtD(tenant?.move_in))}</strong>. Their monthly rent is <strong>${esc(fmt(tenant?.rent))}</strong>.</p>
                    <p>If you require any additional information, please contact ${esc(pm?.company_name)} at ${esc(pm?.phone)}${pmSettings?.email ? " or " + esc(pmSettings.email) : ""}.</p>
                  </div>
                  <div class="closing">
                    <p>Sincerely,</p>
                    <p class="name">${esc(pm?.company_name)}</p>
                  </div>
                  <div class="footer">${esc(pm?.company_name)}${pm?.phone ? " &middot; " + esc(pm.phone) : ""}${pmSettings?.email ? " &middot; " + esc(pmSettings.email) : ""}</div>
                </body></html>`);
                w.document.close();w.print();
              }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 10, border: `1.5px solid ${hexRgba(C.accent, .2)}`, background: hexRgba(C.accent, .04), color: C.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                {t.lease.generateLetter}
              </button>
            </div>
          </div>
        )}

        {/* ── ACCOUNT ── */}
        {onboardingDone && activeTab === "account" && (
          <div style={{ animation: "fadeIn .2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t.account.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <select value={lang} onChange={e => { const newLang = e.target.value; setPmSettings(p => ({ ...p, language: newLang })); }} style={{ border: "1px solid rgba(0,0,0,.1)", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "inherit", background: "#fff", cursor: "pointer", color: C.text }}>
                  <option value="en">English</option>
                  <option value="es">Espa{"\u00f1"}ol</option>
                </select>
              </div>
            </div>

            {/* Profile — editable phone */}
            <div style={sCard}>
              <span style={sLabel}>{t.account.profile}</span>
              <div style={sRow}><span style={{ color: C.muted }}>{t.account.name}</span><span style={{ fontWeight: 600 }}>{tenant?.name}</span></div>
              <div style={sRow}><span style={{ color: C.muted }}>{t.account.email}</span><span style={{ fontWeight: 600 }}>{user?.email}</span></div>
              <div style={{ ...sRow, borderBottom: "none" }}>
                <span style={{ color: C.muted }}>{t.account.phone}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    defaultValue={tenant?.phone || ""}
                    placeholder={t.account.addPhone}
                    onBlur={e => { const v = e.target.value.trim(); if (v !== (tenant?.phone || "")) supabase.from("tenants").update({ phone: v }).eq("id", tenant?.id); }}
                    style={{ border: "none", background: "transparent", textAlign: "right", fontWeight: 600, fontSize: 13, fontFamily: "inherit", outline: "none", padding: "2px 0", width: 160 }}
                  />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Payment History Export */}
            <div style={sCard}>
              <span style={sLabel}>{t.account.paymentHistory}</span>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{t.account.exportDesc}</div>
              <button onClick={() => {
                const rows = [["Date", "Category", "Description", "Amount", "Status", "Method"]];
                charges.forEach(c => {
                  const st = c.amount_paid >= c.amount ? "Paid" : c.amount_paid > 0 ? "Partial" : "Unpaid";
                  (c.payments || []).forEach(p => rows.push([p.date, c.category, c.description || "", p.amount, st, p.method || ""]));
                  if (!(c.payments || []).length) rows.push([c.due_date, c.category, c.description || "", c.amount, st, ""]);
                });
                const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "payment-history-" + (tenant?.name || "tenant").replace(/\s+/g, "-").toLowerCase() + ".csv"; a.click();
                URL.revokeObjectURL(url);
              }} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t.account.exportCsv}
              </button>
            </div>

            {/* Refer a Friend — only show if PM has set a referral credit > 0 */}
            {(pmSettings?.referralCredit || 0) > 0 && (
              <div style={sCard}>
                <span style={sLabel}>{t.account.referFriend}</span>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
                  {t.account.referDesc} When they sign a lease, you{"\u2019"}ll earn a <strong style={{ color: C.green }}>${pmSettings.referralCredit} credit</strong> on your next month{"\u2019"}s rent.
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "monospace", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {referralLink}
                  </div>
                  <button onClick={copyReferral} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {referralCopied ? t.account.copied : t.account.copyLink}
                  </button>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {(() => {
              const NOTIF_ITEMS = [
                { key: "payment_reminders", label: t.account.paymentReminders, desc: "Get reminded when rent is due" },
                { key: "payment_confirmations", label: t.account.paymentConfirmations, desc: "Confirmation when a payment is received" },
                { key: "maintenance_updates", label: t.account.maintenanceUpdates, desc: "Status changes on your requests" },
                { key: "lease_reminders", label: t.account.leaseReminders, desc: "Renewal and expiration notices" },
                { key: "announcements", label: t.account.announcementsNotif, desc: "Property-wide announcements from your PM" },
              ];
              const allOn = NOTIF_ITEMS.every(item => notifPrefs[item.key]?.email && notifPrefs[item.key]?.text);
              const allOff = NOTIF_ITEMS.every(item => !notifPrefs[item.key]?.email && !notifPrefs[item.key]?.text);
              const bulkSet = (on) => {
                const updated = { ...notifPrefs };
                NOTIF_ITEMS.forEach(item => { updated[item.key] = { email: on, text: on }; });
                setNotifPrefs(updated);
                supabase.from("portal_users").update({ notif_prefs: updated }).eq("tenant_id", tenant?.id);
              };
              const toggle = (key, channel) => {
                const cur = notifPrefs[key] || { email: false, text: false };
                const updated = { ...notifPrefs, [key]: { ...cur, [channel]: !cur[channel] } };
                setNotifPrefs(updated);
                supabase.from("portal_users").update({ notif_prefs: updated }).eq("tenant_id", tenant?.id);
              };
              const Toggle = ({ on, onClick }) => (
                <button onClick={onClick} style={{ flexShrink: 0, width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: on ? C.green : "rgba(0,0,0,.1)", transition: "background .2s", position: "relative" }}>
                  <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}/>
                </button>
              );
              return (
                <div style={sCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={sLabel}>{t.account.notifications}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => bulkSet(true)} disabled={allOn} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + (allOn ? hexRgba(C.green, .3) : "rgba(0,0,0,.1)"), background: allOn ? hexRgba(C.green, .06) : "#fff", color: allOn ? C.green : C.muted, fontSize: 10, fontWeight: 700, cursor: allOn ? "default" : "pointer" }}>All On</button>
                      <button onClick={() => bulkSet(false)} disabled={allOff} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + (allOff ? hexRgba(C.red, .3) : "rgba(0,0,0,.1)"), background: allOff ? hexRgba(C.red, .06) : "#fff", color: allOff ? C.red : C.muted, fontSize: 10, fontWeight: 700, cursor: allOff ? "default" : "pointer" }}>All Off</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>{t.account.notifDesc}</div>
                  {NOTIF_ITEMS.map((item, i, arr) => {
                    const pref = notifPrefs[item.key] || { email: false, text: false };
                    return (
                      <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,.04)" : "none" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.desc}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Email</div>
                            <Toggle on={pref.email} onClick={() => toggle(item.key, "email")} />
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Text</div>
                            <Toggle on={pref.text} onClick={() => toggle(item.key, "text")} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* House Rules moved to Lease tab */}

            {/* Contact PM */}
            <div style={{ ...sCard, background: hexRgba(C.accent, .04), border: `1px solid ${hexRgba(C.accent, .15)}` }}>
              <span style={sLabel}>{t.account.propertyManager}</span>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{pm.company_name}</div>
              {pm.phone && <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.16 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3.13 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91"/></svg>{pm.phone}</div>}
              {pmSettings?.email && <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>{pmSettings.email}</div>}
            </div>

            <button onClick={() => { if (window.confirm("Are you sure you want to sign out?")) signOut(); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1.5px solid ${hexRgba(C.red, .2)}`, background: hexRgba(C.red, .04), color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <IcLogout s={16} /> {t.account.signOut}
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: "#bbb" }}>{t.common.poweredBy}</div>
          </div>
        )}

      </div>

      {/* Bottom nav — visible on mobile only (shown via media query) */}
      {onboardingDone && (
        <div className="portal-bot-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: C.bg, borderTop: "1px solid rgba(255,255,255,.08)", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {portalTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: "1 0 auto", minWidth: 72, padding: "8px 12px", border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: activeTab === tab.id ? C.accent : "rgba(255,255,255,.4)", fontSize: 9, fontWeight: activeTab === tab.id ? 700 : 500, fontFamily: "inherit", transition: "color .15s", position: "relative" }}>
                <span style={{ color: activeTab === tab.id ? C.accent : "rgba(255,255,255,.35)" }}>{tab.icon}</span>
                {tab.label}
                {tab.badge > 0 && <span style={{ position: "absolute", top: 2, right: "calc(50% - 16px)", minWidth: 14, height: 14, borderRadius: 7, background: "#c45c4a", color: "#fff", fontSize: 7, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: `2px solid ${C.bg}` }}>{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {renewalModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setRenewalModal({ open: false, choice: null, submitting: false, submitted: false })}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 460, width: "100%", padding: 28, boxShadow: "0 12px 48px rgba(0,0,0,.2)" }}>
            {renewalModal.submitted ? (
              <div style={{ textAlign: "center" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{t.lease.renewalRequestSubmitted}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{pm.company_name} {t.lease.willReview}</div>
                <button onClick={() => setRenewalModal({ open: false, choice: null, submitting: false, submitted: false })} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{t.common.close}</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{t.lease.leaseRenewalOptions}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>{t.lease.leaseExpiresOn} {fmtD(tenant?.lease_end)}. {t.lease.chooseContinue}</div>

                {/* Fixed-term renewal options */}
                {(pmSettings?.renewalTerms || [12]).map(months => {
                  const isSelected = renewalModal.choice === months;
                  return (
                    <div key={months} onClick={() => setRenewalModal(p => ({ ...p, choice: months }))} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: isSelected ? "2px solid " + C.green : "1.5px solid rgba(0,0,0,.08)", background: isSelected ? hexRgba(C.green, .04) : "#fff", cursor: "pointer", marginBottom: 8, transition: "all .15s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "6px solid " + C.green : "2px solid rgba(0,0,0,.15)", flexShrink: 0, transition: "all .15s" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{t.lease.renewFor} {months} {t.lease.months}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.lease.sameRent} {fmt(tenant?.rent)}/mo</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.green, flexShrink: 0 }}>{t.lease.noIncrease}</div>
                    </div>
                  );
                })}

                {/* M2M option */}
                {(() => {
                  const m2m = pmSettings?.m2mIncrease || 50;
                  const newRent = (tenant?.rent || 0) + m2m;
                  const isSelected = renewalModal.choice === "m2m";
                  return (
                    <div onClick={() => setRenewalModal(p => ({ ...p, choice: "m2m" }))} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: isSelected ? "2px solid " + C.accent : "1.5px solid rgba(0,0,0,.08)", background: isSelected ? hexRgba(C.accent, .04) : "#fff", cursor: "pointer", marginBottom: 16, transition: "all .15s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "6px solid " + C.accent : "2px solid rgba(0,0,0,.15)", flexShrink: 0, transition: "all .15s" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{t.lease.goMonthToMonth}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.lease.flexibleCancel}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{fmt(newRent)}/mo (+${m2m})</div>
                    </div>
                  );
                })()}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setRenewalModal({ open: false, choice: null, submitting: false, submitted: false })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{t.common.cancel}</button>
                  <button disabled={!renewalModal.choice || renewalModal.submitting} onClick={async () => {
                    setRenewalModal(p => ({ ...p, submitting: true }));
                    const choice = renewalModal.choice;
                    const isM2M = choice === "m2m";
                    // Save renewal request to messages + notify PM
                    await supabase.from("messages").insert({
                      tenant_id: tenant?.id, tenant_name: tenant?.name, sender_email: user?.email || "",
                      sender_name: tenant?.name, direction: "inbound",
                      subject: isM2M ? "Lease Renewal: Month-to-Month" : "Lease Renewal: " + choice + " months",
                      body: isM2M
                        ? "I would like to go month-to-month when my lease expires on " + fmtD(tenant?.lease_end) + ". I understand the rent will increase to " + fmt((tenant?.rent || 0) + (pmSettings?.m2mIncrease || 50)) + "/mo."
                        : "I would like to renew my lease for " + choice + " months at " + fmt(tenant?.rent) + "/mo when my current lease expires on " + fmtD(tenant?.lease_end) + ".",
                      property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false,
                    });
                    try {
                      await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
                        to: pmSettings?.pmEmail || pmSettings?.email || "",
                        subject: "Lease Renewal Request: " + (tenant?.name || "Tenant") + " \u2014 " + (isM2M ? "Month-to-Month" : choice + " months"),
                        html: "<p><strong>" + esc(tenant?.name) + "</strong> has requested to " + (isM2M ? "go month-to-month" : "renew for " + choice + " months") + " when their lease expires on " + fmtD(tenant?.lease_end) + ".</p><p>" + esc(tenant?.property?.name) + " \u2014 " + esc(tenant?.room?.name) + "</p>",
                        replyTo: user?.email || "",
                      }) });
                    } catch (e) {}
                    setRenewalModal({ open: false, choice: null, submitting: false, submitted: true });
                    setTimeout(() => setRenewalModal(p => ({ ...p, submitted: false })), 5000);
                  }} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: renewalModal.choice ? C.bg : "rgba(0,0,0,.08)", color: renewalModal.choice ? C.accent : "#bbb", cursor: renewalModal.choice ? "pointer" : "default", fontWeight: 800, fontSize: 13 }}>
                    {renewalModal.submitting ? t.lease.submitting : t.lease.requestRenewal}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
