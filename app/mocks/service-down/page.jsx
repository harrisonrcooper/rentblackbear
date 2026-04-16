"use client";

// Mock ported from ~/Desktop/blackbear/service-down.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n      display: flex; flex-direction: column; min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n\n    /* ===== Hero ===== */\n    main { flex: 1; }\n    .hero {\n      min-height: 70vh; padding: 64px 32px 48px;\n      display: flex; flex-direction: column; align-items: center; justify-content: center;\n      text-align: center;\n    }\n\n    /* Gradient wrench icon */\n    .wrench-wrap {\n      width: 96px; height: 96px; margin-bottom: 24px;\n      display: flex; align-items: center; justify-content: center;\n      position: relative;\n    }\n    .wrench-wrap::before {\n      content: \"\"; position: absolute; inset: -18px;\n      background: radial-gradient(circle, rgba(255,73,152,0.14), transparent 70%);\n      z-index: 0;\n    }\n    .wrench-svg { width: 96px; height: 96px; position: relative; z-index: 1; }\n\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 16px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(32px, 4.6vw, 52px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.06;\n      max-width: 760px; margin: 0 auto 16px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 620px; margin: 0 auto 24px; line-height: 1.55;\n    }\n\n    /* ETA pill */\n    .eta-pill {\n      display: inline-flex; align-items: center; gap: 10px;\n      padding: 10px 16px; border-radius: 100px;\n      background: var(--blue-softer); border: 1px solid #d6e3ff;\n      font-size: 13px; font-weight: 600; color: var(--text);\n      margin-bottom: 22px;\n    }\n    .eta-pill svg { width: 14px; height: 14px; color: var(--blue); }\n    .eta-pill .sep { color: var(--text-faint); font-weight: 500; }\n    .eta-pill strong { font-weight: 700; }\n\n    /* Status detail box */\n    .detail-box {\n      max-width: 620px; width: 100%; margin: 0 auto 20px;\n      padding: 20px 22px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      text-align: left;\n    }\n    .detail-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;\n      text-transform: uppercase; color: var(--text-faint);\n      margin-bottom: 8px;\n    }\n    .detail-text {\n      font-size: 14px; color: var(--text); line-height: 1.6;\n    }\n    .detail-text a { color: var(--blue); font-weight: 600; border-bottom: 1px solid rgba(18,81,173,0.3); }\n    .detail-text a:hover { border-bottom-color: var(--blue); }\n\n    /* Status link */\n    .status-link {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .status-link:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); }\n    .status-link svg { width: 14px; height: 14px; }\n    .status-dot {\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--gold); box-shadow: 0 0 0 4px rgba(245,166,35,0.18);\n      animation: pulse 2s ease-in-out infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { box-shadow: 0 0 0 4px rgba(245,166,35,0.18); }\n      50% { box-shadow: 0 0 0 7px rgba(245,166,35,0.08); }\n    }\n\n    /* ===== Reassurance block ===== */\n    .reassure {\n      max-width: 820px; margin: 0 auto; padding: 0 32px 48px;\n    }\n    .reassure-head {\n      text-align: center; font-size: 13px; font-weight: 700;\n      letter-spacing: 0.08em; text-transform: uppercase;\n      color: var(--text-faint); margin-bottom: 18px;\n    }\n    .reassure-list {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n    }\n    .reassure-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n      display: flex; flex-direction: column; gap: 10px;\n    }\n    .ri-icon {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .ri-icon svg { width: 18px; height: 18px; }\n    .ri-title { font-weight: 700; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }\n    .ri-body { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n    .ri-body a { color: var(--blue); font-weight: 600; }\n    .ri-body a:hover { text-decoration: underline; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 32px auto 0; padding: 32px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 40px 20px 32px; }\n      .reassure-list { grid-template-columns: 1fr; }\n      .reassure { padding: 0 20px 40px; }\n      .eta-pill { flex-wrap: wrap; justify-content: center; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <span className="tb-brand-name">Black Bear Rentals</span>
    </a>
    <nav className="tb-nav">
      <a className="tb-nav-item" href="landing.html">Home</a>
      <a className="tb-nav-item" href="pricing.html">Pricing</a>
      <a className="tb-nav-item" href="https://status.rentblackbear.com" target="_blank" rel="noopener">Status</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <main>
    
    <section className="hero">
      
      <div className="wrench-wrap">
        <svg className="wrench-svg" viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <lineargradient id="wrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1665D8" />
              <stop offset="100%" stopColor="#FF4998" />
            </lineargradient>
          </defs>
          <g fill="none" stroke="url(#wrenchGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M62 14 a20 20 0 0 0 -18 28 L14 72 a6 6 0 0 0 0 8 l2 2 a6 6 0 0 0 8 0 l30 -30 a20 20 0 0 0 28 -18 l-12 12 -10 -2 -2 -10 z" />
          </g>
        </svg>
      </div>

      <div className="hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        Scheduled maintenance
      </div>
      <h1>Black Bear Rentals is <em>under maintenance</em>.</h1>
      <p className="hero-sub">
        We're pushing an update. Back online by <strong>2:45am ET</strong>. Your tenants aren't seeing any rent-collection disruption — that runs on Stripe and is unaffected.
      </p>

      <div className="eta-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        <span>Started <strong id="startedTime">2:04am ET</strong></span>
        <span className="sep">·</span>
        <span>ETA <strong id="etaTime">2:45am ET</strong></span>
      </div>

      <div className="detail-box">
        <div className="detail-label">What's happening</div>
        <div className="detail-text">
          Scheduled deploy of the Q2 release. ETA 15 minutes. If this is past <strong>3:15am ET</strong>, check
          <a href="https://status.rentblackbear.com" target="_blank" rel="noopener">status.rentblackbear.com</a>
          for an incident update. This page auto-refreshes every 60 seconds.
        </div>
      </div>

      <a className="status-link" href="https://status.rentblackbear.com" target="_blank" rel="noopener">
        <span className="status-dot" />
        <span>View live status at status.rentblackbear.com</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
      </a>
    </section>

    
    <section className="reassure">
      <div className="reassure-head">While we're out</div>
      <div className="reassure-list">
        <div className="reassure-item">
          <div className="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          </div>
          <div className="ri-title">Rent payments keep flowing</div>
          <div className="ri-body">Payments in flight continue to process on Stripe's infrastructure. Stripe is unaffected by this window.</div>
        </div>
        <div className="reassure-item">
          <div className="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div className="ri-title">Drafts are safe</div>
          <div className="ri-body">In-progress application drafts are preserved in your browser's local storage. Come back after the window and pick up where you left off.</div>
        </div>
        <div className="reassure-item">
          <div className="ri-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </div>
          <div className="ri-title">Tenant emergency? Text Harrison</div>
          <div className="ri-body">If a tenant emergency needs a human right now, text directly: <a href="tel:+12565551234">+1 (256) 555-1234</a>.</div>
        </div>
      </div>
    </section>
  </main>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="https://status.rentblackbear.com" target="_blank" rel="noopener">Status</a>
    </div>
  </footer>

  

    </>
  );
}
