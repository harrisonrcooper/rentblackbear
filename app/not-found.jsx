"use client";

// Mock ported from ~/Desktop/tenantory/404.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n      display: flex; flex-direction: column; min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n\n    /* ===== Hero ===== */\n    main { flex: 1; }\n    .hero {\n      min-height: 70vh; padding: 64px 32px 48px;\n      display: flex; flex-direction: column; align-items: center; justify-content: center;\n      text-align: center;\n    }\n    .big-404 {\n      font-size: clamp(140px, 22vw, 240px);\n      font-weight: 900; letter-spacing: -0.06em; line-height: 0.9;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n      margin-bottom: 8px;\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(30px, 4.2vw, 44px);\n      font-weight: 900; letter-spacing: -0.03em; line-height: 1.08;\n      max-width: 720px; margin: 0 auto 14px;\n    }\n    .hero-sub {\n      font-size: 17px; color: var(--text-muted);\n      max-width: 560px; margin: 0 auto 32px; line-height: 1.55;\n    }\n\n    /* ===== Action cards ===== */\n    .actions {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n      max-width: 820px; width: 100%; margin: 0 auto 44px;\n    }\n    .action-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px 20px;\n      display: flex; flex-direction: column; align-items: flex-start; gap: 10px;\n      text-align: left; transition: all 0.18s ease;\n    }\n    .action-card:hover {\n      transform: translateY(-3px); border-color: var(--blue);\n      box-shadow: var(--shadow-lg);\n    }\n    .ac-icon {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: var(--blue-softer); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .ac-icon svg { width: 18px; height: 18px; }\n    .action-card.featured .ac-icon { background: var(--pink-bg); color: #c21a6a; }\n    .ac-title { font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -0.01em; }\n    .ac-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n    .ac-arrow {\n      margin-top: 4px; font-size: 13px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .action-card.featured .ac-arrow { color: #c21a6a; }\n\n    /* ===== Popular pages ===== */\n    .popular {\n      max-width: 820px; width: 100%; margin: 0 auto;\n      padding: 28px; border-radius: var(--radius-lg);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n    }\n    .popular-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;\n      text-transform: uppercase; color: var(--text-faint);\n      margin-bottom: 14px;\n    }\n    .pop-links {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 28px;\n    }\n    .pop-link {\n      font-size: 14px; font-weight: 600; color: var(--text);\n      padding: 6px 0; display: inline-flex; align-items: center; gap: 8px;\n      transition: color 0.15s ease;\n    }\n    .pop-link:hover { color: var(--blue); }\n    .pop-link svg { width: 12px; height: 12px; color: var(--text-faint); transition: transform 0.15s ease; }\n    .pop-link:hover svg { color: var(--blue); transform: translateX(2px); }\n\n    /* ===== Status ===== */\n    .status-wrap { text-align: center; padding: 40px 32px 24px; }\n    .status-pill {\n      display: inline-flex; align-items: center; gap: 10px;\n      padding: 8px 14px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n    }\n    .status-dot {\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--green); box-shadow: 0 0 0 4px rgba(30,169,124,0.18);\n      animation: pulse 2s ease-in-out infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { box-shadow: 0 0 0 4px rgba(30,169,124,0.18); }\n      50% { box-shadow: 0 0 0 7px rgba(30,169,124,0.08); }\n    }\n    .status-pill a { color: var(--text); font-weight: 700; }\n    .status-pill .dot-sep { color: var(--text-faint); }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 32px auto 0; padding: 32px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 40px 20px 32px; }\n      .actions { grid-template-columns: 1fr; }\n      .pop-links { grid-template-columns: 1fr 1fr; gap: 8px 16px; }\n      .popular { padding: 22px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <span className="tb-brand-name">Tenantory</span>
    </a>
    <nav className="tb-nav">
      <a className="tb-nav-item" href="landing.html">Home</a>
      <a className="tb-nav-item" href="pricing.html">Pricing</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <main>
    
    <section className="hero">
      <div className="big-404">404</div>
      <div className="hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        Page not found
      </div>
      <h1>This page took a sick day.</h1>
      <p className="hero-sub">
        It either moved, got renamed during a recent cleanup, or the URL has a typo. Pick a direction below and we'll get you back on track.
      </p>

      
      <div className="actions">
        <a className="action-card" href="landing.html">
          <div className="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
          </div>
          <div className="ac-title">Back home</div>
          <div className="ac-desc">Return to the Tenantory landing page.</div>
          <div className="ac-arrow">Go home
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </div>
        </a>
        <a className="action-card featured" href="pricing.html">
          <div className="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="ac-title">Pricing</div>
          <div className="ac-desc">$39 Starter, $99 Pro. Founders locked for life.</div>
          <div className="ac-arrow">See plans
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </div>
        </a>
        <a className="action-card" href="mailto:hello@tenantory.com">
          <div className="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
          </div>
          <div className="ac-title">Talk to support</div>
          <div className="ac-desc">Email a human. We reply within a few hours.</div>
          <div className="ac-arrow">hello@tenantory.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </div>
        </a>
      </div>

      
      <div className="popular">
        <div className="popular-label">Popular pages</div>
        <div className="pop-links">
          <a className="pop-link" href="landing.html">Landing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="pop-link" href="pricing.html">Pricing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="pop-link" href="stories.html">Stories
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="pop-link" href="security.html">Security
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="pop-link" href="integrations.html">Integrations
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="pop-link" href="tools.html">Free tools
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
        </div>
      </div>
    </section>

    
    <div className="status-wrap">
      <a className="status-pill" href="https://status.tenantory.com" target="_blank" rel="noopener">
        <span className="status-dot" />
        <span>status.tenantory.com</span>
        <span className="dot-sep">·</span>
        <span style={{color: "var(--green-dark)"}}>all systems operational</span>
      </a>
    </div>
  </main>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>


    </>
  );
}
