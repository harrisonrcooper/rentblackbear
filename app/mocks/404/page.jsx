"use client";

// Mock ported verbatim from ~/Desktop/tenantory/404.html.
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
    .big-404 {
      font-size: clamp(140px, 22vw, 240px);
      font-weight: 900; letter-spacing: -0.06em; line-height: 0.9;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
      margin-bottom: 8px;
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(30px, 4.2vw, 44px);
      font-weight: 900; letter-spacing: -0.03em; line-height: 1.08;
      max-width: 720px; margin: 0 auto 14px;
    }
    .hero-sub {
      font-size: 17px; color: var(--text-muted);
      max-width: 560px; margin: 0 auto 32px; line-height: 1.55;
    }

    /* ===== Action cards ===== */
    .actions {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
      max-width: 820px; width: 100%; margin: 0 auto 44px;
    }
    .action-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px 20px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
      text-align: left; transition: all 0.18s ease;
    }
    .action-card:hover {
      transform: translateY(-3px); border-color: var(--blue);
      box-shadow: var(--shadow-lg);
    }
    .ac-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--blue-softer); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
    }
    .ac-icon svg { width: 18px; height: 18px; }
    .action-card.featured .ac-icon { background: var(--pink-bg); color: #c21a6a; }
    .ac-title { font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -0.01em; }
    .ac-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .ac-arrow {
      margin-top: 4px; font-size: 13px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .action-card.featured .ac-arrow { color: #c21a6a; }

    /* ===== Popular pages ===== */
    .popular {
      max-width: 820px; width: 100%; margin: 0 auto;
      padding: 28px; border-radius: var(--radius-lg);
      background: var(--surface-subtle); border: 1px solid var(--border);
    }
    .popular-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-faint);
      margin-bottom: 14px;
    }
    .pop-links {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 28px;
    }
    .pop-link {
      font-size: 14px; font-weight: 600; color: var(--text);
      padding: 6px 0; display: inline-flex; align-items: center; gap: 8px;
      transition: color 0.15s ease;
    }
    .pop-link:hover { color: var(--blue); }
    .pop-link svg { width: 12px; height: 12px; color: var(--text-faint); transition: transform 0.15s ease; }
    .pop-link:hover svg { color: var(--blue); transform: translateX(2px); }

    /* ===== Status ===== */
    .status-wrap { text-align: center; padding: 40px 32px 24px; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 8px 14px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; font-weight: 600; color: var(--text-muted);
    }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--green); box-shadow: 0 0 0 4px rgba(30,169,124,0.18);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(30,169,124,0.18); }
      50% { box-shadow: 0 0 0 7px rgba(30,169,124,0.08); }
    }
    .status-pill a { color: var(--text); font-weight: 700; }
    .status-pill .dot-sep { color: var(--text-faint); }

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
      .actions { grid-template-columns: 1fr; }
      .pop-links { grid-template-columns: 1fr 1fr; gap: 8px 16px; }
      .popular { padding: 22px; }
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
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a class="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="big-404">404</div>
      <div class="hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Page not found
      </div>
      <h1>This page took a sick day.</h1>
      <p class="hero-sub">
        It either moved, got renamed during a recent cleanup, or the URL has a typo. Pick a direction below and we'll get you back on track.
      </p>

      <!-- Action cards -->
      <div class="actions">
        <a class="action-card" href="landing.html">
          <div class="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
          </div>
          <div class="ac-title">Back home</div>
          <div class="ac-desc">Return to the Tenantory landing page.</div>
          <div class="ac-arrow">Go home
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
        <a class="action-card featured" href="pricing.html">
          <div class="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="ac-title">Pricing</div>
          <div class="ac-desc">$39 Starter, $99 Pro. Founders locked for life.</div>
          <div class="ac-arrow">See plans
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
        <a class="action-card" href="mailto:hello@tenantory.com">
          <div class="ac-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <div class="ac-title">Talk to support</div>
          <div class="ac-desc">Email a human. We reply within a few hours.</div>
          <div class="ac-arrow">hello@tenantory.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
      </div>

      <!-- Popular pages -->
      <div class="popular">
        <div class="popular-label">Popular pages</div>
        <div class="pop-links">
          <a class="pop-link" href="landing.html">Landing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="pop-link" href="pricing.html">Pricing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="pop-link" href="stories.html">Stories
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="pop-link" href="security.html">Security
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="pop-link" href="integrations.html">Integrations
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="pop-link" href="tools.html">Free tools
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Status indicator -->
    <div class="status-wrap">
      <a class="status-pill" href="https://status.tenantory.com" target="_blank" rel="noopener">
        <span class="status-dot"></span>
        <span>status.tenantory.com</span>
        <span class="dot-sep">·</span>
        <span style="color: var(--green-dark);">all systems operational</span>
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
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
