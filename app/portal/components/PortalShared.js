"use client";
import { createClient } from "@supabase/supabase-js";
import { loadStripe } from "@stripe/stripe-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPA_URL, SUPA_ANON);
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────
export const hexRgba = (hex, a) => { const h = hex.replace("#", ""); const r = parseInt(h.substring(0, 2), 16); const g = parseInt(h.substring(2, 4), 16); const b = parseInt(h.substring(4, 6), 16); return `rgba(${r},${g},${b},${a})`; };
export const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const fmt = (n) => n != null ? "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "\u2014";
export const fmtD = (d) => { if (!d) return "\u2014"; const dt = new Date(d + "T00:00:00"); return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`; };
export const daysLeft = (d) => { if (!d) return null; return Math.ceil((new Date(d + "T00:00:00") - new Date()) / (1e3 * 60 * 60 * 24)); };

export const C_DEFAULT = { bg: "#1a1714", accent: "#d4a853", green: "#4a7c59", red: "#c45c4a", text: "#1a1714", muted: "#5c4a3a" };
export const CREDIT_FEE = 0.029;

// ── Shared styles ────────────────────────────────────────────────────
export const sCard = { background: "#fff", borderRadius: 14, padding: 20, border: "1px solid rgba(0,0,0,.06)", marginBottom: 12 };
export const sLabel = { fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, display: "block" };
export const sRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 13 };

// ── Icons ─────────────────────────────────────────────────────────────
export const Ic = ({ d, s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
export const IcHome   = ({ s }) => <Ic s={s} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
export const IcDollar = ({ s }) => <Ic s={s} d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
export const IcWrench = ({ s }) => <Ic s={s} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />;
export const IcFile   = ({ s }) => <Ic s={s} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
export const IcUser   = ({ s }) => <Ic s={s} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
export const IcLogout = ({ s }) => <Ic s={s} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />;
export const IcCheck  = ({ s }) => <Ic s={s} d="M20 6L9 17l-5-5" />;
export const IcGoogle = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
