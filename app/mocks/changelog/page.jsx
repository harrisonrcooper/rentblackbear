"use client";

// Mock ported verbatim from ~/Desktop/tenantory/changelog.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;
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
    .tb-nav-item.active { color: var(--blue); }
    .tb-cta { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-nav { padding: 9px 16px; font-size: 13px; }
    .btn-lg { padding: 14px 28px; font-size: 15px; }

    /* ===== Hero ===== */
    .hero { padding: 72px 32px 32px; text-align: center; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero-eyebrow .dot {
      width: 7px; height: 7px; border-radius: 50%; background: var(--pink);
      box-shadow: 0 0 0 4px var(--pink-bg);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    .hero h1 {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 860px; margin: 0 auto 18px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 680px; margin: 0 auto 0; line-height: 1.55;
    }

    /* ===== Subscribe ===== */
    .subscribe {
      max-width: 820px; margin: 40px auto 0; padding: 0 32px;
    }
    .sub-card {
      background: linear-gradient(180deg, var(--blue-softer) 0%, #fff 100%);
      border: 1px solid var(--border); border-radius: var(--radius-xl);
      padding: 22px 24px;
      display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    }
    .sub-form {
      display: flex; gap: 10px; flex: 1; min-width: 280px;
    }
    .sub-input {
      flex: 1; padding: 12px 16px; border-radius: 100px; border: 1px solid var(--border-strong);
      background: var(--surface); font-size: 14px; color: var(--text); font-family: inherit;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .sub-input:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(22,101,216,0.12); }
    .sub-btn { padding: 12px 20px; }
    .sub-meta {
      display: flex; align-items: center; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .sub-meta a {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--text-muted); font-weight: 600; padding: 6px 10px;
      border-radius: 100px; border: 1px solid var(--border);
      background: var(--surface); transition: all 0.15s ease;
    }
    .sub-meta a:hover { color: var(--blue); border-color: var(--blue); }
    .sub-meta svg { width: 14px; height: 14px; }
    .sub-ok {
      display: none; color: var(--green-dark); font-weight: 600; font-size: 13px;
      align-items: center; gap: 6px;
    }
    .sub-ok svg { width: 14px; height: 14px; }
    .sub-ok.show { display: inline-flex; }

    /* ===== Filters ===== */
    .filters-wrap {
      max-width: 960px; margin: 48px auto 0; padding: 0 32px;
      position: sticky; top: 65px; z-index: 20;
      background: rgba(255,255,255,0.92); backdrop-filter: saturate(180%) blur(10px);
    }
    .filters {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .filter-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 100px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border: 1px solid var(--border); background: var(--surface);
      transition: all 0.15s ease;
    }
    .filter-chip:hover { color: var(--text); border-color: var(--border-strong); }
    .filter-chip.active { color: #fff; background: var(--navy-dark); border-color: var(--navy-dark); }
    .filter-chip .count {
      font-size: 11px; padding: 1px 7px; border-radius: 100px;
      background: var(--surface-alt); color: var(--text-muted); font-weight: 700;
    }
    .filter-chip.active .count { background: rgba(255,255,255,0.18); color: #fff; }

    /* ===== Timeline / entries ===== */
    .log {
      max-width: 960px; margin: 8px auto 0; padding: 32px 32px 64px;
      position: relative;
    }
    .log::before {
      content: ""; position: absolute; left: 152px; top: 40px; bottom: 80px;
      width: 2px; background: linear-gradient(180deg, var(--border) 0%, var(--border) 80%, transparent 100%);
    }

    .entry {
      display: grid; grid-template-columns: 120px 32px 1fr; gap: 20px;
      padding: 24px 0 32px; position: relative;
      transition: opacity 0.2s ease;
    }
    .entry.hidden { display: none; }

    .entry-date {
      padding-top: 4px;
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      text-align: right;
    }
    .entry-date .day { color: var(--text); font-weight: 800; font-size: 15px; letter-spacing: -0.01em; display: block; }
    .entry-date .year { font-size: 11px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-top: 2px; }

    .entry-bullet {
      position: relative; display: flex; justify-content: center; padding-top: 8px;
    }
    .entry-bullet-dot {
      width: 14px; height: 14px; border-radius: 50%;
      background: var(--surface); border: 3px solid var(--navy-dark);
      box-shadow: 0 0 0 4px var(--surface);
      z-index: 1;
    }
    .entry-bullet[data-type="new"] .entry-bullet-dot { border-color: var(--pink); }
    .entry-bullet[data-type="improvement"] .entry-bullet-dot { border-color: var(--blue); }
    .entry-bullet[data-type="fix"] .entry-bullet-dot { border-color: var(--gold); }
    .entry-bullet[data-type="integration"] .entry-bullet-dot { border-color: var(--green); }

    .entry-body {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px 24px;
      box-shadow: var(--shadow-sm); transition: all 0.2s ease;
    }
    .entry:hover .entry-body { border-color: var(--border-strong); box-shadow: var(--shadow); transform: translateY(-1px); }
    .entry-featured .entry-body {
      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.04) 100%);
      border-color: var(--pink-strong);
    }

    .entry-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 4px 10px; border-radius: 100px;
    }
    .pill svg { width: 11px; height: 11px; }
    .pill-new { background: var(--pink-bg); color: #c21a6a; }
    .pill-improvement { background: var(--blue-softer); color: var(--blue); }
    .pill-fix { background: rgba(245,166,35,0.14); color: #b27214; }
    .pill-integration { background: var(--green-bg); color: var(--green-dark); }
    .pill-milestone {
      background: linear-gradient(135deg, var(--pink), #ff7bb4); color: #fff;
    }

    .entry-title {
      font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em;
      margin-bottom: 8px; line-height: 1.25;
    }
    .entry-desc {
      font-size: 14.5px; color: var(--text-muted); line-height: 1.6;
    }
    .entry-desc p + p { margin-top: 10px; }
    .entry-desc strong { color: var(--text); font-weight: 600; }

    .entry-visual {
      margin-top: 14px; padding: 14px 16px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 13px; color: var(--text-muted);
    }
    .entry-visual code, .entry-visual pre {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 12.5px;
    }
    .entry-visual pre { white-space: pre-wrap; color: var(--text); line-height: 1.6; }
    .entry-visual .label { font-size: 10px; font-weight: 700; color: var(--text-faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }

    .entry-illo {
      margin-top: 14px;
      display: flex; align-items: center; gap: 14px;
      padding: 16px; border: 1px dashed var(--border-strong);
      border-radius: var(--radius); background: var(--surface-subtle);
    }
    .entry-illo svg { width: 72px; height: 56px; flex-shrink: 0; color: var(--blue); }
    .entry-illo-text { font-size: 13px; color: var(--text-muted); }
    .entry-illo-text strong { color: var(--text); font-weight: 700; display: block; margin-bottom: 2px; font-size: 13.5px; }

    .entry-foot {
      margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border);
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      font-size: 13px;
    }
    .entry-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--blue); font-weight: 600;
    }
    .entry-link:hover { text-decoration: underline; }
    .entry-link svg { width: 13px; height: 13px; }

    /* ===== Empty state ===== */
    .empty {
      display: none; text-align: center; padding: 48px 20px; color: var(--text-muted);
      border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);
      background: var(--surface-subtle); margin-top: 20px;
    }
    .empty.show { display: block; }
    .empty strong { color: var(--text); font-weight: 700; display: block; margin-bottom: 4px; }

    /* ===== Ideas CTA ===== */
    .ideas {
      max-width: 960px; margin: 24px auto 0; padding: 0 32px;
    }
    .ideas-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl); padding: 36px 40px;
      display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;
      position: relative; overflow: hidden;
    }
    .ideas-card::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 260px; height: 260px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .ideas-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; position: relative; z-index: 1; }
    .ideas-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; position: relative; z-index: 1; }
    .ideas-sub { font-size: 14px; color: rgba(255,255,255,0.75); max-width: 560px; position: relative; z-index: 1; line-height: 1.55; }
    .ideas-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; position: relative; z-index: 1; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 24px; }
      .subscribe, .filters-wrap, .log, .ideas { padding-left: 16px; padding-right: 16px; }
      .sub-card { flex-direction: column; align-items: stretch; }
      .sub-meta { justify-content: space-between; }
      .log::before { left: 11px; }
      .entry { grid-template-columns: 24px 1fr; gap: 14px; }
      .entry-date {
        grid-column: 2; text-align: left; padding-top: 0; margin-bottom: 2px;
        display: flex; align-items: baseline; gap: 8px;
      }
      .entry-date .day, .entry-date .year { display: inline; }
      .entry-date .year { margin-top: 0; }
      .entry-bullet { grid-row: span 2; padding-top: 4px; }
      .entry-body { grid-column: 2; padding: 18px 18px; }
      .entry-title { font-size: 17px; }
      .ideas-card { grid-template-columns: 1fr; padding: 28px 22px; }
      .ideas-actions { align-items: flex-start; }
      .filters-wrap { top: 57px; }
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
      <a class="tb-nav-item active" href="changelog.html">Changelog</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a class="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <span class="dot"></span>
      Updated weekly · last shipped 2 days ago
    </div>
    <h1>What <em>shipped</em> this week.</h1>
    <p class="hero-sub">I'm building Tenantory in public. Every release that hits your account gets written down here — what changed, and why I thought it was worth my time. No marketing spin, no "we're excited to announce." If pace is a trust signal for you, this page is the signal.</p>
  </section>

  <!-- Subscribe -->
  <section class="subscribe">
    <div class="sub-card">
      <form class="sub-form" id="subForm" onsubmit="return handleSubscribe(event)">
        <input class="sub-input" id="subEmail" type="email" placeholder="you@yourportfolio.com" required>
        <button class="btn btn-primary sub-btn" type="submit">
          Get release notes in your inbox
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </form>
      <div class="sub-meta">
        <span class="sub-ok" id="subOk">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          You're on the list.
        </span>
        <a href="/changelog.atom" title="Atom feed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/></svg>
          RSS / Atom
        </a>
      </div>
    </div>
  </section>

  <!-- Filters -->
  <div class="filters-wrap">
    <div class="filters" id="filters">
      <button class="filter-chip active" data-filter="all">All <span class="count" data-count="all">12</span></button>
      <button class="filter-chip" data-filter="new">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        New features <span class="count" data-count="new">6</span>
      </button>
      <button class="filter-chip" data-filter="improvement">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
        Improvements <span class="count" data-count="improvement">3</span>
      </button>
      <button class="filter-chip" data-filter="fix">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z"/></svg>
        Fixes <span class="count" data-count="fix">2</span>
      </button>
      <button class="filter-chip" data-filter="integration">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M14 7h3a3 3 0 0 1 3 3v0"/><path d="M10 17H7a3 3 0 0 1-3-3v0"/></svg>
        Integrations <span class="count" data-count="integration">1</span>
      </button>
    </div>
  </div>

  <!-- Changelog entries -->
  <section class="log" id="log">

    <!-- Apr 12 — AI application scoring -->
    <article class="entry" data-type="new">
      <div class="entry-date"><span class="day">Apr 12</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New feature
          </span>
        </div>
        <h3 class="entry-title">AI application scoring</h3>
        <div class="entry-desc">
          <p>Every application now gets a score from 0–100 and a short plain-English explanation — pulled from income-to-rent ratio, credit band, eviction history, and the applicant's own notes. It does not auto-reject anyone. It's there so you can rank a stack of 40 applications in 90 seconds instead of an afternoon.</p>
          <p>I built this after a Founder told me he was losing good tenants because he couldn't get back to them fast enough. The goal is speed, not gatekeeping.</p>
        </div>
        <div class="entry-visual">
          <div class="label">Example output</div>
          <pre>Score: 82 / 100 · Strong
Rent-to-income 28% (good)
Credit tier B+ · no flags
Notes: Relocating for job at HudsonAlpha; references solid.</pre>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="#docs-scoring">
            How scoring works
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
          <a class="entry-link" href="applications.html">
            Open Applications
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Apr 8 — Dark mode / workspace theme overrides -->
    <article class="entry" data-type="improvement">
      <div class="entry-date"><span class="day">Apr 8</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="improvement"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            Improvement
          </span>
        </div>
        <h3 class="entry-title">Tenant portal dark mode and per-workspace theme overrides</h3>
        <div class="entry-desc">
          <p>The tenant portal now honors a tenant's system dark mode preference, and workspace admins can override the whole brand palette — primary color, logo, subdomain favicon — from Settings → Theme. This matters for PMCs that manage on behalf of owners and want the portal to feel like the owner's brand, not mine.</p>
        </div>
        <div class="entry-illo">
          <svg viewBox="0 0 72 56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="30" height="48" rx="4"/>
            <rect x="40" y="4" width="30" height="48" rx="4" fill="#1a1f36" stroke="#1a1f36"/>
            <line x1="8" y1="14" x2="26" y2="14"/>
            <line x1="8" y1="20" x2="20" y2="20"/>
            <line x1="46" y1="14" x2="64" y2="14" stroke="#fff"/>
            <line x1="46" y1="20" x2="58" y2="20" stroke="#fff"/>
            <circle cx="17" cy="38" r="6"/>
            <circle cx="55" cy="38" r="6" stroke="#fff"/>
          </svg>
          <div class="entry-illo-text">
            <strong>Same content, your palette</strong>
            Works on the main app at app.tenantory.com and on custom subdomains.
          </div>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="settings.html">
            Settings · Theme
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Apr 3 — Schedule-E PDF one click -->
    <article class="entry" data-type="improvement">
      <div class="entry-date"><span class="day">Apr 3</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="improvement"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            Improvement
          </span>
        </div>
        <h3 class="entry-title">Schedule-E PDF export is now one click</h3>
        <div class="entry-desc">
          <p>Used to be three: pick year, pick entity, wait. Now it's a single button on Reports and the PDF comes back pre-mapped to IRS line items — rents received, repairs, depreciation, the whole thing — grouped per property. Your CPA can staple it straight into the return.</p>
          <p>This was the most common support email I got in March. Timing it for tax season felt obvious in retrospect.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="reports.html">
            Go to Reports
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
          <a class="entry-link" href="#docs-schedule-e">
            Schedule-E mapping details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Mar 28 — RentCast -->
    <article class="entry" data-type="integration">
      <div class="entry-date"><span class="day">Mar 28</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="integration"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M14 7h3a3 3 0 0 1 3 3"/><path d="M10 17H7a3 3 0 0 1-3-3"/></svg>
            Integration
          </span>
        </div>
        <h3 class="entry-title">RentCast integration · live market comps on every property</h3>
        <div class="entry-desc">
          <p>Each property now shows a RentCast-powered market rent estimate with comparable units from a 1-mile radius. When your lease renewal sits inside the estimate's range, Tenantory says so. When you're 12% under market, it says that too — with the comps to back it up.</p>
          <p>Pricing a renewal used to mean opening three tabs. Now it's one column on the property page.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="integrations.html">
            Enable RentCast
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Mar 22 — Partial rent bug -->
    <article class="entry" data-type="fix">
      <div class="entry-date"><span class="day">Mar 22</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="fix"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-fix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z"/></svg>
            Fix
          </span>
        </div>
        <h3 class="entry-title">Partial rent payments were applying to the wrong month</h3>
        <div class="entry-desc">
          <p>If a tenant paid half of March's rent on April 2nd, Tenantory was crediting it to April's ledger. That's wrong — a partial payment should always clear the oldest outstanding charge first. Fixed. Every affected account was recalculated overnight and the ledger entries now sit on the correct month.</p>
          <p>If you noticed odd balances in the last two weeks, refresh — they should be right now. Sorry about that one.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="payments.html">
            Review ledgers
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Mar 15 — Per-room rent roll -->
    <article class="entry" data-type="new">
      <div class="entry-date"><span class="day">Mar 15</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New feature
          </span>
        </div>
        <h3 class="entry-title">Per-room rent roll for co-living properties</h3>
        <div class="entry-desc">
          <p>If you run a house with four bedrooms and four separate leases, you shouldn't have to fake it as one "unit." Tenantory now models a property → rooms → room-leases. Rent roll, vacancy, and turnover math all work per-bedroom, and the tenant portal only shows the room that tenant signed for.</p>
          <p>This was the single biggest ask from the co-living cohort. Took a month to get the data model right. Worth it.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="for-coliving.html">
            How co-living works in Tenantory
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
          <a class="entry-link" href="properties.html">
            Set up rooms
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Mar 10 — Vendor portal -->
    <article class="entry" data-type="new">
      <div class="entry-date"><span class="day">Mar 10</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New feature
          </span>
        </div>
        <h3 class="entry-title">Vendor portal · your plumber gets their own login</h3>
        <div class="entry-desc">
          <p>Vendors now sign into Tenantory directly. They see open jobs, accept or decline, upload photos, and invoice — all without you playing middleman over text. And because a vendor account spans workspaces, if your HVAC guy works for you and your brother-in-law's LLC, it's one login for both.</p>
        </div>
        <div class="entry-visual">
          <div class="label">Vendor payload</div>
          <pre>POST /vendors/invite
{ "email": "mike@acmeplumbing.com",
  "trades": ["plumbing", "drains"],
  "workspaces": ["bear-holdings", "lee-three-llc"] }</pre>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="vendor.html">
            See the vendor view
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
          <a class="entry-link" href="maintenance.html">
            Invite a vendor
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Mar 2 — Stripe webhook reliability -->
    <article class="entry" data-type="fix">
      <div class="entry-date"><span class="day">Mar 2</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="fix"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-fix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z"/></svg>
            Fix
          </span>
        </div>
        <h3 class="entry-title">Stripe webhook reliability — no more silent payment failures</h3>
        <div class="entry-desc">
          <p>In rare cases a Stripe webhook would drop (timeout on our end), the payment was collected but the ledger never marked it paid. Two tenants got false late notices in February because of this. I rebuilt the webhook handler with idempotency keys and a retry queue that catches anything Stripe gives up on, and backfilled the two affected accounts.</p>
          <p>The late fees that hit wrongly are already reversed. If you think one slipped through, reply to any email from me.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="#docs-reliability">
            Webhook reliability doc
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Feb 24 — Bulk AppFolio import -->
    <article class="entry" data-type="new">
      <div class="entry-date"><span class="day">Feb 24</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New feature
          </span>
        </div>
        <h3 class="entry-title">Bulk tenant import from an AppFolio CSV export</h3>
        <div class="entry-desc">
          <p>Drop your AppFolio tenant export straight into onboarding. Tenantory maps the columns, flags anything ambiguous, and imports tenants, leases, security deposits, and balances in one pass. What used to be a two-week switch is now under 15 minutes for a 40-unit portfolio.</p>
          <p>Buildium and Rentec exporters are next on the list.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="vs-appfolio.html">
            Switching from AppFolio
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
          <a class="entry-link" href="onboarding.html">
            Import now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Feb 18 — Subdomain setup -->
    <article class="entry" data-type="improvement">
      <div class="entry-date"><span class="day">Feb 18</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="improvement"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            Improvement
          </span>
        </div>
        <h3 class="entry-title">Branded subdomain setup · 15 minutes, not multi-day</h3>
        <div class="entry-desc">
          <p>Used to be: paste a CNAME, wait for propagation, wait for cert, email support if anything looked weird. Now: enter your domain, click verify, and Tenantory provisions the cert, the subdomain, and the branded login page automatically. If DNS isn't right, it tells you exactly what to change at your registrar.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="settings.html">
            Set up your domain
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Feb 10 — Founders cohort -->
    <article class="entry entry-featured" data-type="new">
      <div class="entry-date"><span class="day">Feb 10</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New
          </span>
          <span class="pill pill-milestone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Milestone
          </span>
        </div>
        <h3 class="entry-title">Founders' cohort · $99/mo locked for life, first 100 accounts</h3>
        <div class="entry-desc">
          <p>I want the first 100 operators on Tenantory to have skin in my pricing decisions. So the first 100 Pro accounts lock in $99/mo forever — no matter what I charge the 101st customer or the 10,000th. In exchange I want their feedback on the hard calls. That's the whole deal.</p>
          <p>As of this entry, 87 spots remain.</p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="pricing.html">
            Claim a Founders' spot
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </article>

    <!-- Feb 3 — Initial launch -->
    <article class="entry entry-featured" data-type="new">
      <div class="entry-date"><span class="day">Feb 3</span><span class="year">2026</span></div>
      <div class="entry-bullet" data-type="new"><div class="entry-bullet-dot"></div></div>
      <div class="entry-body">
        <div class="entry-meta">
          <span class="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            New
          </span>
          <span class="pill pill-milestone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
            Launch
          </span>
        </div>
        <h3 class="entry-title">Tenantory is public · v1.0</h3>
        <div class="entry-desc">
          <p>After running my own rentals on a stack of AppFolio + QuickBooks + DocuSign + a bookkeeper for three years, I got tired of paying four companies to do one job. Tenantory is what I wish had existed: one app for leasing, rent, maintenance, accounting, and the tenant portal — priced for an operator, not a conglomerate.</p>
          <p>This page is where I'll tell you everything I ship, every week. Thanks for being early.</p>
          <p><strong>— Harrison, building from Huntsville, AL</strong></p>
        </div>
        <div class="entry-foot">
          <a class="entry-link" href="landing.html">
            Why I built Tenantory
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
          </a>
        </div>
      </div>
    </article>

    <div class="empty" id="empty">
      <strong>Nothing in that bucket yet.</strong>
      Try another filter — or check back next week.
    </div>
  </section>

  <!-- Ideas CTA -->
  <section class="ideas">
    <div class="ideas-card">
      <div>
        <div class="ideas-label">Got an idea?</div>
        <div class="ideas-title">Email ideas@tenantory.com — I read every one.</div>
        <div class="ideas-sub">Half of what's on this page started as a reply to an email. If something's in your way, tell me. The good ones ship inside a week. The hard ones I'll at least tell you why they're hard.</div>
      </div>
      <div class="ideas-actions">
        <a class="btn btn-pink btn-lg" href="mailto:ideas@tenantory.com">
          Send Harrison an idea
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="changelog.html">Changelog</a>
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
