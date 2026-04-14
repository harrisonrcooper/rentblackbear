"use client";

// Mock ported verbatim from ~/Desktop/tenantory/sign-in.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input { font-family: inherit; font-size: inherit; color: inherit; }

    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8; --blue-pale: #eef3ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
    }

    .shell { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

    /* Left brand panel */
    .brand {
      background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-darker) 60%, #2c1045 120%);
      color: #fff; padding: 48px; display: flex; flex-direction: column;
      position: relative; overflow: hidden;
    }
    .brand::before {
      content: ""; position: absolute; top: -20%; left: -10%;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);
    }
    .brand::after {
      content: ""; position: absolute; bottom: -30%; right: -20%;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(22,101,216,0.3), transparent 70%);
    }
    .brand > * { position: relative; z-index: 1; }
    .brand-mark { display: flex; align-items: center; gap: 12px; margin-bottom: 56px; }
    .brand-logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(255,73,152,0.35);
    }
    .brand-logo svg { width: 22px; height: 22px; color: #fff; }
    .brand-name { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }

    .brand-body { margin: auto 0; }
    .brand-eyebrow { font-size: 11px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; }
    .brand-body h1 {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 38px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15;
      max-width: 440px; margin-bottom: 20px;
    }
    .brand-body h1 em { font-style: italic; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .brand-body p { font-size: 16px; color: rgba(255,255,255,0.8); max-width: 440px; line-height: 1.55; }

    .brand-stat-row {
      display: flex; gap: 36px; margin-top: 48px; padding-top: 28px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .brand-stat-num { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
    .brand-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 6px; }

    .brand-foot { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: auto; padding-top: 36px; }
    .brand-foot a { color: rgba(255,255,255,0.8); font-weight: 600; }

    /* Right form panel */
    .form-col {
      display: flex; flex-direction: column;
      padding: 48px; background: var(--surface);
      justify-content: center;
    }
    .form-wrap { width: 100%; max-width: 400px; margin: 0 auto; }
    .form-back {
      font-size: 13px; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 6px; margin-bottom: 32px;
    }
    .form-back svg { width: 14px; height: 14px; }
    .form-back:hover { color: var(--blue); }

    .form-wrap h2 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px;
    }
    .form-wrap .sub {
      font-size: 14px; color: var(--text-muted); margin-bottom: 28px;
    }

    /* Social buttons */
    .social-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
    .social-btn {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--surface); color: var(--text); font-weight: 600; font-size: 14px;
      transition: all 0.15s ease;
    }
    .social-btn:hover { border-color: var(--border-strong); background: var(--surface-alt); transform: translateY(-1px); }
    .social-btn svg { width: 18px; height: 18px; }
    .social-btn.apple svg { color: #000; }

    .divider { display: flex; align-items: center; gap: 14px; margin: 22px 0; font-size: 12px; color: var(--text-faint); }
    .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--border); }

    /* Form fields */
    .field { margin-bottom: 14px; }
    .field-label {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;
    }
    .field-label a { font-size: 12px; color: var(--blue); font-weight: 600; }
    .field-label a:hover { text-decoration: underline; }
    .input {
      width: 100%; padding: 11px 14px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 14px; color: var(--text);
      transition: all 0.15s ease; outline: none;
    }
    .input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }

    .remember-row {
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: var(--text); margin: 16px 0 20px;
      cursor: pointer;
    }
    .remember-box {
      width: 18px; height: 18px; border-radius: 5px;
      border: 2px solid var(--border-strong); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .remember-row.checked .remember-box { background: var(--blue); border-color: var(--blue); }
    .remember-box svg { width: 11px; height: 11px; color: #fff; opacity: 0; }
    .remember-row.checked .remember-box svg { opacity: 1; }

    .submit-btn {
      width: 100%; padding: 13px 18px; border-radius: var(--radius);
      background: linear-gradient(135deg, var(--blue-bright), var(--navy));
      color: #fff; font-weight: 700; font-size: 14.5px;
      transition: all 0.15s ease; margin-bottom: 18px;
      box-shadow: 0 6px 20px rgba(18,81,173,0.28);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(18,81,173,0.38); }
    .submit-btn svg { width: 16px; height: 16px; transition: transform 0.2s ease; }
    .submit-btn:hover svg { transform: translateX(3px); }

    .switch-auth { text-align: center; font-size: 13px; color: var(--text-muted); }
    .switch-auth a { color: var(--blue); font-weight: 700; }
    .switch-auth a:hover { text-decoration: underline; }

    .trust-row {
      margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--border);
      display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
      font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .trust-item { display: inline-flex; align-items: center; gap: 5px; }
    .trust-item svg { width: 11px; height: 11px; color: var(--green-dark); }

    @media (max-width: 820px) {
      .shell { grid-template-columns: 1fr; }
      .brand { padding: 32px 24px; min-height: 280px; }
      .brand-body h1 { font-size: 26px; }
      .brand-body p { display: none; }
      .brand-stat-row { display: none; }
      .brand-foot { display: none; }
      .form-col { padding: 28px 20px; }
    }`;

const MOCK_HTML = `<div class="shell">

    <!-- Left brand panel -->
    <aside class="brand">
      <div class="brand-mark">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </div>
        <div class="brand-name">Tenantory</div>
      </div>

      <div class="brand-body">
        <div class="brand-eyebrow">Built by an operator, for operators</div>
        <h1>Run your PM company like a <em>billion-dollar operation.</em></h1>
        <p>One tool replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper. Your tenants see your brand, not ours.</p>

        <div class="brand-stat-row">
          <div>
            <div class="brand-stat-num">11.2 hrs</div>
            <div class="brand-stat-label">Avg weekly time saved</div>
          </div>
          <div>
            <div class="brand-stat-num">$1,146</div>
            <div class="brand-stat-label">Avg monthly tool savings</div>
          </div>
          <div>
            <div class="brand-stat-num">96%</div>
            <div class="brand-stat-label">Stay past the trial</div>
          </div>
        </div>
      </div>

      <div class="brand-foot">
        Don't have an account yet? <a href="onboarding.html">Start your 14-day trial →</a>
      </div>
    </aside>

    <!-- Right form panel -->
    <main class="form-col">
      <div class="form-wrap">
        <a class="form-back" href="landing.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to tenantory.com
        </a>

        <h2>Welcome back.</h2>
        <p class="sub">Sign in to your Tenantory workspace to keep managing like the operator you are.</p>

        <div class="social-row">
          <button class="social-btn" onclick="alert('Would open Google SSO via Clerk')">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.46a5.54 5.54 0 0 1-2.4 3.64v3.04h3.89c2.28-2.1 3.59-5.2 3.59-8.92z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.89-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.09A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.28 14.27A7.22 7.22 0 0 1 4.9 12c0-.79.13-1.55.38-2.27V6.64H1.26A12 12 0 0 0 0 12a12 12 0 0 0 1.26 5.36l4.02-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.64l4.02 3.09C6.23 6.85 8.88 4.75 12 4.75z"/></svg>
            Continue with Google
          </button>
          <button class="social-btn apple" onclick="alert('Would open Apple SSO via Clerk')">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/></svg>
            Continue with Apple
          </button>
          <button class="social-btn" onclick="alert('Would open Microsoft SSO via Clerk')">
            <svg viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>
            Continue with Microsoft
          </button>
        </div>

        <div class="divider">or sign in with email</div>

        <form onsubmit="event.preventDefault(); window.location.href='admin-v2.html';">
          <div class="field">
            <label class="field-label" for="email">Email</label>
            <input class="input" id="email" type="email" placeholder="you@yourcompany.com" required autocomplete="email">
          </div>
          <div class="field">
            <label class="field-label" for="pw">Password <a href="#" onclick="event.preventDefault(); alert('Password reset flow');">Forgot?</a></label>
            <input class="input" id="pw" type="password" placeholder="Your password" required autocomplete="current-password">
          </div>
          <div class="remember-row" onclick="this.classList.toggle('checked')">
            <div class="remember-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            Keep me signed in for 30 days
          </div>
          <button class="submit-btn" type="submit">
            Sign in
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>

        <div class="switch-auth">New to Tenantory? <a href="onboarding.html">Start your free trial</a></div>

        <div class="trust-row">
          <span class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/></svg>
            SOC 2
          </span>
          <span class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            MFA available
          </span>
          <span class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Auth by Clerk
          </span>
        </div>
      </div>
    </main>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
