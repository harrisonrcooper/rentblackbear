"use client";

// The admin sign-in screen.
//
// Chrome was ported from ~/Desktop/blackbear/sign-in.html; the form is
// live. Auth is a single shared password (POST /api/auth/login), so there
// is no email field, no social sign-in, and no self-serve sign-up — every
// caller who knows the password is the same principal. See lib/auth.ts.
//
// Original <style> blocks are injected via dangerouslySetInnerHTML so the
// mock CSS doesn't get re-parsed as JSX.

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px; }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8; --blue-pale: #eef3ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n    }\n\n    .shell { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }\n\n    /* Left brand panel */\n    .brand {\n      background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-darker) 60%, #2c1045 120%);\n      color: #fff; padding: 48px; display: flex; flex-direction: column;\n      position: relative; overflow: hidden;\n    }\n    .brand::before {\n      content: \"\"; position: absolute; top: -20%; left: -10%;\n      width: 500px; height: 500px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);\n    }\n    .brand::after {\n      content: \"\"; position: absolute; bottom: -30%; right: -20%;\n      width: 500px; height: 500px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(22,101,216,0.3), transparent 70%);\n    }\n    .brand > * { position: relative; z-index: 1; }\n    .brand-mark { display: flex; align-items: center; gap: 12px; margin-bottom: 56px; }\n    .brand-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 14px rgba(255,73,152,0.35);\n    }\n    .brand-logo svg { width: 22px; height: 22px; color: #fff; }\n    .brand-name { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }\n\n    .brand-body { margin: auto 0; }\n    .brand-eyebrow { font-size: 11px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; }\n    .brand-body h1 {\n      font-family: 'Source Serif 4', Georgia, serif;\n      font-size: 38px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15;\n      max-width: 440px; margin-bottom: 20px;\n    }\n    .brand-body h1 em { font-style: italic; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n    .brand-body p { font-size: 16px; color: rgba(255,255,255,0.8); max-width: 440px; line-height: 1.55; }\n\n    .brand-stat-row {\n      display: flex; gap: 36px; margin-top: 48px; padding-top: 28px;\n      border-top: 1px solid rgba(255,255,255,0.1);\n    }\n    .brand-stat-num { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }\n    .brand-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 6px; }\n\n    .brand-foot { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: auto; padding-top: 36px; }\n    .brand-foot a { color: rgba(255,255,255,0.8); font-weight: 600; }\n\n    /* Right form panel */\n    .form-col {\n      display: flex; flex-direction: column;\n      padding: 48px; background: var(--surface);\n      justify-content: center;\n    }\n    .form-wrap { width: 100%; max-width: 400px; margin: 0 auto; }\n    .form-back {\n      font-size: 13px; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px; margin-bottom: 32px;\n    }\n    .form-back svg { width: 14px; height: 14px; }\n    .form-back:hover { color: var(--blue); }\n\n    .form-wrap h2 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px;\n    }\n    .form-wrap .sub {\n      font-size: 14px; color: var(--text-muted); margin-bottom: 28px;\n    }\n\n    /* Validation */\n    .field-error { color: var(--red); font-size: 12.5px; font-weight: 600; margin-top: 6px; }\n    .input.invalid { border-color: var(--red); }\n    .input.invalid:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,69,69,0.14); }\n    @keyframes wiggle {\n      0%, 100% { transform: translateX(0); }\n      20% { transform: translateX(-6px); }\n      40% { transform: translateX(6px); }\n      60% { transform: translateX(-4px); }\n      80% { transform: translateX(4px); }\n    }\n    .wiggle { animation: wiggle 0.35s ease; }\n    @media (prefers-reduced-motion: reduce) { .wiggle { animation: none; } }\n\n    .submit-btn[disabled] { opacity: 0.65; cursor: not-allowed; }\n    .submit-btn[disabled]:hover { transform: none; box-shadow: 0 6px 20px rgba(18,81,173,0.28); }\n\n    /* Form fields */\n    .field { margin-bottom: 14px; }\n    .field-label {\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;\n    }\n    .field-label a { font-size: 12px; color: var(--blue); font-weight: 600; }\n    .field-label a:hover { text-decoration: underline; }\n    .input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n\n    .remember-row {\n      display: flex; align-items: center; gap: 10px;\n      font-size: 13px; color: var(--text); margin: 16px 0 20px;\n      cursor: pointer;\n    }\n    .remember-box {\n      width: 18px; height: 18px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .remember-row.checked .remember-box { background: var(--blue); border-color: var(--blue); }\n    .remember-box svg { width: 11px; height: 11px; color: #fff; opacity: 0; }\n    .remember-row.checked .remember-box svg { opacity: 1; }\n\n    .submit-btn {\n      width: 100%; padding: 13px 18px; border-radius: var(--radius);\n      background: linear-gradient(135deg, var(--blue-bright), var(--navy));\n      color: #fff; font-weight: 700; font-size: 14.5px;\n      transition: all 0.15s ease; margin-bottom: 18px;\n      box-shadow: 0 6px 20px rgba(18,81,173,0.28);\n      display: flex; align-items: center; justify-content: center; gap: 8px;\n    }\n    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(18,81,173,0.38); }\n    .submit-btn svg { width: 16px; height: 16px; transition: transform 0.2s ease; }\n    .submit-btn:hover svg { transform: translateX(3px); }\n\n    .switch-auth { text-align: center; font-size: 13px; color: var(--text-muted); }\n    .switch-auth a { color: var(--blue); font-weight: 700; }\n    .switch-auth a:hover { text-decoration: underline; }\n\n    .trust-row {\n      margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--border);\n      display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;\n      font-size: 11px; color: var(--text-faint); font-weight: 500;\n    }\n    .trust-item { display: inline-flex; align-items: center; gap: 5px; }\n    .trust-item svg { width: 11px; height: 11px; color: var(--green-dark); }\n\n    @media (max-width: 820px) {\n      .shell { grid-template-columns: 1fr; }\n      .brand { padding: 32px 24px; min-height: 280px; }\n      .brand-body h1 { font-size: 26px; }\n      .brand-body p { display: none; }\n      .brand-stat-row { display: none; }\n      .brand-foot { display: none; }\n      .form-col { padding: 28px 20px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      <Suspense fallback={null}>
        <SignInScreen />
      </Suspense>
    </>
  );
}

function SignInScreen() {
  const searchParams = useSearchParams();
  // Only ever follow same-origin paths — an attacker-supplied absolute URL
  // in ?redirect_url= would otherwise turn sign-in into an open redirect.
  const requested = searchParams.get("redirect_url") || "";
  const redirectTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/admin";

  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [wiggle, setWiggle] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function fail(message) {
    setError(message);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    if (!password) {
      fail("Enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, remember }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        fail(data.error || "Sign-in failed. Try again.");
        setPassword("");
        return;
      }

      // Full navigation, not router.push — the middleware must re-run and
      // see the freshly-set cookie before the admin shell renders.
      window.location.assign(redirectTo);
    } catch (err) {
      console.error("[sign-in] request failed:", err);
      fail("Couldn't reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>

  <div className="shell">

    
    <aside className="brand">
      <div className="brand-mark">
        <div className="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </div>
        <div className="brand-name">Black Bear Rentals</div>
      </div>

      <div className="brand-body">
        <div className="brand-eyebrow">Built by an operator, for operators</div>
        <h1>Run your PM company like a <em>billion-dollar operation.</em></h1>
        <p>One tool replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper. Your tenants see your brand, not ours.</p>

        <div className="brand-stat-row">
          <div>
            <div className="brand-stat-num">11.2 hrs</div>
            <div className="brand-stat-label">Avg weekly time saved</div>
          </div>
          <div>
            <div className="brand-stat-num">$1,146</div>
            <div className="brand-stat-label">Avg monthly tool savings</div>
          </div>
          <div>
            <div className="brand-stat-num">96%</div>
            <div className="brand-stat-label">Stay past the trial</div>
          </div>
        </div>
      </div>

      <div className="brand-foot">
        Don't have an account yet? <a href="onboarding.html">Start your 14-day trial →</a>
      </div>
    </aside>

    
    <main className="form-col">
      <div className="form-wrap">
        <a className="form-back" href="landing.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to rentblackbear.com
        </a>

        <h2>Welcome back.</h2>
        <p className="sub">Enter the workspace password to open your admin.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field${wiggle ? " wiggle" : ""}`}>
            <label className="field-label" htmlFor="pw">Password</label>
            <input
              className={`input${error ? " invalid" : ""}`}
              id="pw"
              type="password"
              placeholder="Workspace password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "pw-error" : undefined}
            />
            {error ? <div className="field-error" id="pw-error" role="alert">{error}</div> : null}
          </div>

          <div
            className={`remember-row${remember ? " checked" : ""}`}
            role="checkbox"
            aria-checked={remember}
            tabIndex={0}
            onClick={() => setRemember((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") { e.preventDefault(); setRemember((v) => !v); }
            }}
          >
            <div className="remember-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
            Keep me signed in for 30 days
          </div>

          <button className="submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in\u2026" : "Sign in"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </form>

        <div className="trust-row">
          <span className="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Password-protected workspace
          </span>
        </div>
      </div>
    </main>
  </div>


    </>
  );
}
