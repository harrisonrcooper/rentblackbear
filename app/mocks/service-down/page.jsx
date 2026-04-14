"use client";

// Mock ported verbatim from ~/Desktop/tenantory/service-down.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;
      display: flex; flex-direction: column; min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }

    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);
    }
    .tb-brand { display: flex; align-items: center; gap: 10px; }
    .tb-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }
    .tb-nav { display: flex; align-items: center; gap: 4px; }
    .tb-nav-item {
      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }
    .tb-cta { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-nav { padding: 9px 16px; font-size: 13px; }

    /* ===== Hero ===== */
    main { flex: 1; }
    .hero {
      min-height: 70vh; padding: 64px 32px 48px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center;
    }

    /* Gradient wrench icon */
    .wrench-wrap {
      width: 96px; height: 96px; margin-bottom: 24px;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .wrench-wrap::before {
      content: ""; position: absolute; inset: -18px;
      background: radial-gradient(circle, rgba(255,73,152,0.14), transparent 70%);
      z-index: 0;
    }
    .wrench-svg { width: 96px; height: 96px; position: relative; z-index: 1; }

    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 16px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(32px, 4.6vw, 52px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.06;
      max-width: 760px; margin: 0 auto 16px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 620px; margin: 0 auto 24px; line-height: 1.55;
    }

    /* ETA pill */
    .eta-pill {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 10px 16px; border-radius: 100px;
      background: var(--blue-softer); border: 1px solid #d6e3ff;
      font-size: 13px; font-weight: 600; color: var(--text);
      margin-bottom: 22px;
    }
    .eta-pill svg { width: 14px; height: 14px; color: var(--blue); }
    .eta-pill .sep { color: var(--text-faint); font-weight: 500; }
    .eta-pill strong { font-weight: 700; }

    /* Status detail box */
    .detail-box {
      max-width: 620px; width: 100%; margin: 0 auto 20px;
      padding: 20px 22px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      text-align: left;
    }
    .detail-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-faint);
      margin-bottom: 8px;
    }
    .detail-text {
      font-size: 14px; color: var(--text); line-height: 1.6;
    }
    .detail-text a { color: var(--blue); font-weight: 600; border-bottom: 1px solid rgba(18,81,173,0.3); }
    .detail-text a:hover { border-bottom-color: var(--blue); }

    /* Status link */
    .status-link {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 13px; font-weight: 600; color: var(--text);
      transition: all 0.15s ease;
    }
    .status-link:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); }
    .status-link svg { width: 14px; height: 14px; }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--gold); box-shadow: 0 0 0 4px rgba(245,166,35,0.18);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(245,166,35,0.18); }
      50% { box-shadow: 0 0 0 7px rgba(245,166,35,0.08); }
    }

    /* ===== Reassurance block ===== */
    .reassure {
      max-width: 820px; margin: 0 auto; padding: 0 32px 48px;
    }
    .reassure-head {
      text-align: center; font-size: 13px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--text-faint); margin-bottom: 18px;
    }
    .reassure-list {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    }
    .reassure-item {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .ri-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
    }
    .ri-icon svg { width: 18px; height: 18px; }
    .ri-title { font-weight: 700; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }
    .ri-body { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .ri-body a { color: var(--blue); font-weight: 600; }
    .ri-body a:hover { text-decoration: underline; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 32px auto 0; padding: 32px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 40px 20px 32px; }
      .reassure-list { grid-template-columns: 1fr; }
      .reassure { padding: 0 20px 40px; }
      .eta-pill { flex-wrap: wrap; justify-content: center; }
    }`;

const MOCK_HTML = `<!-- Topbar -->
  <header class="topbar">
    <a class="tb-brand" href="landing.html">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <span class="tb-brand-name">Tenantory</span>
    </a>
    <nav class="tb-nav">
      <a class="tb-nav-item" href="landing.html">Home</a>
      <a class="tb-nav-item" href="pricing.html">Pricing</a>
      <a class="tb-nav-item" href="https://status.tenantory.com" target="_blank" rel="noopener">Status</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="hero">
      <!-- Gradient wrench icon -->
      <div class="wrench-wrap">
        <svg class="wrench-svg" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="wrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1665D8"/>
              <stop offset="100%" stop-color="#FF4998"/>
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#wrenchGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M62 14 a20 20 0 0 0 -18 28 L14 72 a6 6 0 0 0 0 8 l2 2 a6 6 0 0 0 8 0 l30 -30 a20 20 0 0 0 28 -18 l-12 12 -10 -2 -2 -10 z"/>
          </g>
        </svg>
      </div>

      <div class="hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Scheduled maintenance
      </div>
      <h1>Tenantory is <em>under maintenance</em>.</h1>
      <p class="hero-sub">
        We're pushing an update. Back online by <strong>2:45am ET</strong>. Your tenants aren't seeing any rent-collection disruption — that runs on Stripe and is unaffected.
      </p>

      <div class="eta-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Started <strong id="startedTime">2:04am ET</strong></span>
        <span class="sep">·</span>
        <span>ETA <strong id="etaTime">2:45am ET</strong></span>
      </div>

      <div class="detail-box">
        <div class="detail-label">What's happening</div>
        <div class="detail-text">
          Scheduled deploy of the Q2 release. ETA 15 minutes. If this is past <strong>3:15am ET</strong>, check
          <a href="https://status.tenantory.com" target="_blank" rel="noopener">status.tenantory.com</a>
          for an incident update. This page auto-refreshes every 60 seconds.
        </div>
      </div>

      <a class="status-link" href="https://status.tenantory.com" target="_blank" rel="noopener">
        <span class="status-dot"></span>
        <span>View live status at status.tenantory.com</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </section>

    <!-- Reassurance block -->
    <section class="reassure">
      <div class="reassure-head">While we're out</div>
      <div class="reassure-list">
        <div class="reassure-item">
          <div class="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div class="ri-title">Rent payments keep flowing</div>
          <div class="ri-body">Payments in flight continue to process on Stripe's infrastructure. Stripe is unaffected by this window.</div>
        </div>
        <div class="reassure-item">
          <div class="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="ri-title">Drafts are safe</div>
          <div class="ri-body">In-progress application drafts are preserved in your browser's local storage. Come back after the window and pick up where you left off.</div>
        </div>
        <div class="reassure-item">
          <div class="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="ri-title">Tenant emergency? Text Harrison</div>
          <div class="ri-body">If a tenant emergency needs a human right now, text directly: <a href="tel:+12565551234">+1 (256) 555-1234</a>.</div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="https://status.tenantory.com" target="_blank" rel="noopener">Status</a>
    </div>
  </footer>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
