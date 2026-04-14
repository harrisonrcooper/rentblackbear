"use client";

// Mock ported verbatim from ~/Desktop/tenantory/vs-appfolio.html.
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
    .hero { padding: 72px 32px 48px; text-align: center; max-width: 1080px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 58px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 940px; margin: 0 auto 20px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 700px; margin: 0 auto 34px; line-height: 1.55;
    }
    .hero-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
    .hero-trust {
      display: inline-flex; align-items: center; gap: 14px;
      font-size: 13px; color: var(--text-muted);
    }
    .hero-trust svg { width: 14px; height: 14px; color: var(--green-dark); }
    .hero-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }

    /* ===== Logos matchup ===== */
    .matchup {
      max-width: 700px; margin: 44px auto 0; padding: 0 32px;
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;
    }
    .matchup-side {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 22px;
      text-align: center;
    }
    .matchup-side.them { opacity: 0.82; }
    .matchup-side.us {
      border: 2px solid var(--pink);
      box-shadow: 0 14px 40px rgba(255,73,152,0.14);
    }
    .matchup-logo { font-weight: 900; font-size: 20px; letter-spacing: -0.02em; margin-bottom: 4px; color: var(--text); }
    .matchup-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .matchup-side.us .matchup-sub { color: var(--pink); font-weight: 700; }
    .matchup-vs {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--text); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; letter-spacing: 0.06em;
    }

    /* ===== Sections ===== */
    .section { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }
    .section-head { text-align: center; margin-bottom: 48px; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }
    .section-head h2 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 0 auto; line-height: 1.55; }

    /* ===== Reasons grid ===== */
    .reasons {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    }
    .reason-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 26px 24px;
      transition: all 0.2s ease; position: relative;
      display: flex; flex-direction: column;
    }
    .reason-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }
    .reason-index {
      position: absolute; top: 20px; right: 22px;
      font-size: 11px; font-weight: 800; color: var(--text-faint); letter-spacing: 0.1em;
    }
    .reason-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .reason-icon svg { width: 20px; height: 20px; }
    .reason-card.hot .reason-icon { background: var(--pink-bg); color: var(--pink); }
    .reason-card h3 {
      font-size: 16px; font-weight: 800; letter-spacing: -0.01em;
      margin-bottom: 8px; line-height: 1.3;
    }
    .reason-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; }
    .reason-card .reason-contrast {
      display: flex; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);
      font-size: 12px;
    }
    .reason-contrast-col { flex: 1; }
    .reason-contrast-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
    .reason-contrast-col.them .reason-contrast-label { color: var(--text-faint); }
    .reason-contrast-col.us .reason-contrast-label { color: var(--green-dark); }
    .reason-contrast-val { font-weight: 700; color: var(--text); font-size: 13px; }
    .reason-contrast-col.them .reason-contrast-val { color: var(--text-muted); text-decoration: line-through; text-decoration-color: var(--border-strong); }

    /* ===== Compare table ===== */
    .compare-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }
    .compare {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .compare-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .compare-table thead th {
      padding: 22px 16px; text-align: center;
      font-weight: 800; font-size: 15px; color: var(--text);
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
      vertical-align: middle;
    }
    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .compare-table thead th.featured {
      background: linear-gradient(180deg, var(--pink-bg), transparent);
      color: var(--pink);
    }
    .compare-table thead th.dim { color: var(--text-muted); }
    .compare-table thead th .compare-col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .compare-table thead th.featured .compare-col-sub { color: #c21a6a; }

    .compare-table tbody tr:nth-child(odd) td { background: var(--surface-subtle); }
    .compare-table tbody tr.group-head td {
      background: var(--surface) !important;
      padding-top: 24px !important; padding-bottom: 10px !important;
      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
      border-top: 1px solid var(--border);
    }
    .compare-table tbody tr.group-head:first-child td { border-top: none; padding-top: 16px !important; }
    .compare-table td {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .compare-table td:first-child { color: var(--text); font-weight: 500; }
    .compare-table td:not(:first-child) { text-align: center; }
    .compare-table tbody tr:last-child td { border-bottom: none; }
    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }
    .cmp-no svg { width: 18px; height: 18px; color: var(--text-faint); margin: 0 auto; padding: 2px; background: var(--surface-alt); border-radius: 50%; }
    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }
    .cmp-val-dim { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .cmp-val-strong { font-size: 14px; font-weight: 800; color: var(--pink); }

    /* ===== Migration callout ===== */
    .migrate-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }
    .migrate-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 44px 48px;
      display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
      box-shadow: var(--shadow);
    }
    .migrate-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--green-bg); color: var(--green-dark);
      padding: 5px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 16px;
    }
    .migrate-eyebrow svg { width: 12px; height: 12px; }
    .migrate-card h3 {
      font-size: clamp(24px, 3vw, 32px); font-weight: 800; letter-spacing: -0.025em;
      margin-bottom: 14px; line-height: 1.15;
    }
    .migrate-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 22px; }
    .migrate-card p strong { color: var(--text); font-weight: 700; }
    .migrate-cta { display: flex; gap: 10px; flex-wrap: wrap; }

    .migrate-steps { display: flex; flex-direction: column; gap: 14px; }
    .migrate-step {
      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 18px;
    }
    .migrate-step-num {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px;
      box-shadow: 0 6px 18px rgba(18,81,173,0.25);
    }
    .migrate-step-text { font-size: 14px; color: var(--text); font-weight: 600; }
    .migrate-step-text small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }
    .migrate-step-clock {
      font-size: 11px; color: var(--text-muted); font-weight: 700;
      background: var(--surface); border: 1px solid var(--border);
      padding: 4px 9px; border-radius: 100px; white-space: nowrap;
    }

    /* ===== Testimonials ===== */
    .testi-wrap { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }
    .testi-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    }
    .testi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 30px 30px 26px;
      display: flex; flex-direction: column;
      box-shadow: var(--shadow-sm);
    }
    .testi-card:nth-child(2) { background: linear-gradient(180deg, var(--surface) 0%, var(--blue-softer) 100%); }
    .testi-card:nth-child(3) { background: linear-gradient(180deg, var(--surface) 0%, rgba(255,73,152,0.04) 100%); }
    .testi-quote-mark {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--pink-bg); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .testi-quote-mark svg { width: 16px; height: 16px; }
    .testi-quote {
      font-size: 17px; line-height: 1.55; color: var(--text); font-weight: 500;
      letter-spacing: -0.005em; margin-bottom: 22px; flex: 1;
    }
    .testi-quote strong { background: var(--pink-bg); color: #c21a6a; padding: 1px 5px; border-radius: 4px; font-weight: 700; }
    .testi-person { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--border); }
    .testi-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--blue-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px; letter-spacing: 0.02em;
      flex-shrink: 0;
    }
    .testi-card:nth-child(2) .testi-avatar { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }
    .testi-card:nth-child(3) .testi-avatar { background: linear-gradient(135deg, var(--pink), var(--gold)); }
    .testi-card:nth-child(4) .testi-avatar { background: linear-gradient(135deg, var(--green-dark), var(--blue)); }
    .testi-name { font-weight: 700; font-size: 14px; color: var(--text); }
    .testi-role { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
    .testi-switched {
      margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
      background: var(--green-bg); color: var(--green-dark);
      font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;
      letter-spacing: 0.02em;
    }
    .testi-switched svg { width: 10px; height: 10px; }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 60px 52px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 440px; height: 440px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card::after {
      content: ""; position: absolute; bottom: -50%; right: -10%;
      width: 420px; height: 420px; border-radius: 50%;
      background: radial-gradient(circle, rgba(22,101,216,0.35), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.12); color: #fff;
      padding: 5px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .cta-eyebrow svg { width: 12px; height: 12px; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }
    .cta-card p { font-size: 17px; color: rgba(255,255,255,0.85); max-width: 620px; margin: 0 auto 30px; line-height: 1.55; }
    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .cta-note-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.4); }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 960px) {
      .reasons { grid-template-columns: repeat(2, 1fr); }
      .migrate-card { grid-template-columns: 1fr; gap: 32px; padding: 32px 28px; }
      .testi-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .section, .compare-wrap, .migrate-wrap, .testi-wrap, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .reasons { grid-template-columns: 1fr; }
      .matchup { grid-template-columns: 1fr auto 1fr; padding: 0 16px; }
      .compare { overflow-x: auto; }
      .compare-table { min-width: 560px; }
      .cta-card { padding: 40px 22px; }
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
      <a class="tb-nav-item active" href="vs-appfolio.html">vs AppFolio</a>
      <a class="tb-nav-item" href="portal.html" target="_blank">Tenant view</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      AppFolio vs Tenantory · honest comparison
    </div>
    <h1>AppFolio is built for <em>250-unit portfolios</em>. Tenantory is built for the rest of us.</h1>
    <p class="hero-sub">If you run 1 to 50 doors, AppFolio's $280/mo minimum, generic "AppFolio" tenant portal, and 6-week onboarding are overkill. Tenantory gives you the same capability for <strong style="color:var(--text);font-weight:700;">$99/mo</strong>, with your brand on every tenant surface — and we migrate you in 48 hours, free.</p>
    <div class="hero-cta-row">
      <a class="btn btn-pink btn-lg" href="onboarding.html">
        Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a class="btn btn-ghost btn-lg" href="#compare">See full comparison</a>
    </div>
    <div class="hero-trust">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>No credit card</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Free migration</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>We'll buy out your AppFolio contract</span>
    </div>

    <div class="matchup">
      <div class="matchup-side them">
        <div class="matchup-logo">AppFolio</div>
        <div class="matchup-sub">Built for 250+ units · $280/mo floor</div>
      </div>
      <div class="matchup-vs">VS</div>
      <div class="matchup-side us">
        <div class="matchup-logo">Tenantory</div>
        <div class="matchup-sub">Built for 1–50 units · $99/mo for life</div>
      </div>
    </div>
  </section>

  <!-- 9 reasons -->
  <section class="section" id="reasons">
    <div class="section-head">
      <div class="section-kicker">Why PMs are switching</div>
      <h2>9 reasons PMs leave AppFolio for <em>Tenantory</em>.</h2>
      <p>We pulled these from 40+ switch-conversations with independent PMs running 5 to 50 units. Every one of these was named as a direct reason.</p>
    </div>

    <div class="reasons">

      <div class="reason-card hot">
        <div class="reason-index">01</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3>The $280/mo entry price is punitive at 10 units</h3>
        <p>AppFolio's minimum is $280/mo before add-ons — that's $28 per door if you only have 10 units. Tenantory Pro is $99/mo for up to 50 doors. At 20 units you save $2,172/year; at 50 you save $9,600+.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">$280/mo min</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">$99/mo for life</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">02</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3>Tenants see "AppFolio" — not your brand</h3>
        <p>Your applicants log into a generic AppFolio subdomain with AppFolio colors. Tenantory gives every PM a branded subdomain on Pro (<em>yourco.tenantory.com</em>) and a full custom domain on Scale. Tenants see you, not us.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Generic portal</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Your subdomain + logo</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">03</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 3v6"/><path d="M15 3v6"/><path d="M9 15v6"/><path d="M15 15v6"/></svg>
        </div>
        <h3>No AI application scoring</h3>
        <p>AppFolio screening returns a credit score and a background check. That's it. Tenantory scores every applicant on 7 signals (income-to-rent, employment stability, prior evictions, pet/smoker flags, app completeness) and surfaces duplicate applications across your units.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Credit report only</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">7-signal AI score</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">04</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <h3>No Schedule-E export for your CPA</h3>
        <p>AppFolio's accounting exports a generic P&amp;L. Your CPA still has to re-categorize everything for Schedule E. Tenantory ships a one-click Schedule-E export grouped by property, with mortgage interest, depreciation, and repair/capex split out the way the IRS wants it.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Generic P&amp;L only</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">1-click Schedule-E</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">05</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3>Onboarding takes 4–6 weeks. Yours takes 15 minutes.</h3>
        <p>AppFolio charges a $400+ onboarding fee and schedules you 3–4 weeks out for implementation. Tenantory's wizard is 6 steps, ~15 minutes, and every single bit of it is skippable except your workspace name.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">4–6 weeks + $400 fee</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">15 min, no fee</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">06</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3>Investor reports built by hand, monthly</h3>
        <p>If you manage units for other investors, AppFolio makes you export-to-Excel and pretty it up yourself. Tenantory auto-generates a per-owner monthly statement (rent collected, expenses, NOI, reserves) as a shareable PDF they can pull anytime.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Manual Excel build</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Auto owner PDF</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">07</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M8 14h2"/><path d="M14 14h2"/></svg>
        </div>
        <h3>1099 season becomes a spreadsheet war</h3>
        <p>AppFolio requires you to export vendor payment data, W-9s, and bank info to a third-party filer. Tenantory tracks W-9s at onboarding, auto-totals payments per vendor, and files 1099-NECs with the IRS for you in January. One click.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">3rd-party filer</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Built-in e-file</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">08</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        </div>
        <h3>Rent-by-the-bedroom isn't really supported</h3>
        <p>AppFolio models a unit as a unit. If you're running co-living or student rentals with per-bedroom leases, you end up hacking it with fake sub-units. Tenantory has native room-level leases, rent, and photos inside one property — no workarounds.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Unit-level only</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Native room leases</div>
          </div>
        </div>
      </div>

      <div class="reason-card hot">
        <div class="reason-index">09</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3>No money-back guarantee. You're stuck on contract.</h3>
        <p>AppFolio is annual, non-refundable, and you negotiate through your CSM to cancel. Tenantory is month-to-month, cancel in one click in Settings. Plus our guarantee: if Tenantory doesn't save you 10 hours in the first 30 paid days, we refund every dollar <strong>and wire you $100</strong>.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">AppFolio</div>
            <div class="reason-contrast-val">Annual, no refund</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Monthly + $100 back</div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Comparison table -->
  <section class="compare-wrap" id="compare">
    <div class="section-head">
      <div class="section-kicker">Head-to-head</div>
      <h2>The full comparison, line by line.</h2>
      <p>We tried to be fair. Where AppFolio genuinely wins (scale, accountant certifications, mature API) we say so. Everywhere else, the gap is real.</p>
    </div>
    <div class="compare">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="dim">AppFolio<span class="compare-col-sub">Core plan</span></th>
            <th class="featured">Tenantory<span class="compare-col-sub">Pro · $99/mo</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-head"><td colspan="3">Pricing &amp; commitment</td></tr>
          <tr><td>Starting price</td><td><span class="cmp-val-dim">$280/mo</span></td><td><span class="cmp-val-strong">$99/mo for life</span></td></tr>
          <tr><td>Minimum unit count</td><td><span class="cmp-val-dim">50 units (soft)</span></td><td><span class="cmp-val">1 unit</span></td></tr>
          <tr><td>Per-unit fee on top</td><td><span class="cmp-val-dim">$1.40–$1.50 / unit / mo</span></td><td><span class="cmp-val">None (flat)</span></td></tr>
          <tr><td>Setup / onboarding fee</td><td><span class="cmp-val-dim">$400+ one-time</span></td><td><span class="cmp-val">$0</span></td></tr>
          <tr><td>Contract length</td><td><span class="cmp-val-dim">Annual</span></td><td><span class="cmp-val">Month-to-month</span></td></tr>
          <tr><td>Free trial without a card</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>10-hour money-back guarantee</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Your brand</td></tr>
          <tr><td>Branded subdomain (yourco.xxx.com)</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Full custom domain + SSL</td><td><span class="cmp-val-dim">Add-on</span></td><td><span class="cmp-val">Scale plan ($299)</span></td></tr>
          <tr><td>Tenant-facing logo &amp; colors</td><td><span class="cmp-val-dim">Logo only</span></td><td><span class="cmp-val">Logo + accent + email</span></td></tr>
          <tr><td>"Powered by" removal</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td><span class="cmp-val">Scale plan</span></td></tr>

          <tr class="group-head"><td colspan="3">Applications &amp; leasing</td></tr>
          <tr><td>Online rental application</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>AI application scoring</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Duplicate applicant detection</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Lease e-sign</td><td><span class="cmp-val-dim">Via add-on ($45/mo)</span></td><td><span class="cmp-val">Unlimited, included</span></td></tr>
          <tr><td>State-specific lease templates</td><td><span class="cmp-val-dim">Generic only</span></td><td><span class="cmp-val">20-section AL/TN/GA/FL</span></td></tr>
          <tr><td>Room-level / co-living leases</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Rent &amp; accounting</td></tr>
          <tr><td>ACH rent collection</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Autopay with retry logic</td><td><span class="cmp-val-dim">Basic</span></td><td><span class="cmp-val">Smart retry + late fees</span></td></tr>
          <tr><td>Schedule-E tax export</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Built-in 1099-NEC e-file</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Investor / owner statements</td><td><span class="cmp-val-dim">Manual build</span></td><td><span class="cmp-val">Auto monthly PDF</span></td></tr>
          <tr><td>A/R aging 30/60/90+</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Onboarding &amp; support</td></tr>
          <tr><td>Time to first value</td><td><span class="cmp-val-dim">4–6 weeks</span></td><td><span class="cmp-val-strong">15 minutes</span></td></tr>
          <tr><td>Free data migration</td><td><span class="cmp-val-dim">Paid, $500+</span></td><td><span class="cmp-val">Free, 48 hours</span></td></tr>
          <tr><td>We'll buy out your existing contract</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Direct support (no ticket queue)</td><td><span class="cmp-val-dim">CSM on Plus+ only</span></td><td><span class="cmp-val">Founder email, 24h</span></td></tr>

          <tr class="group-head"><td colspan="3">Where AppFolio still wins</td></tr>
          <tr><td>Enterprise scale (1000+ units)</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Enterprise tier only</span></td></tr>
          <tr><td>Certified by large CPA firms</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Smaller firms only</span></td></tr>
          <tr><td>Mature public API</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Scale plan (beta)</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Migration callout -->
  <section class="migrate-wrap" id="migrate">
    <div class="migrate-card">
      <div>
        <div class="migrate-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Free of charge · done for you
        </div>
        <h3>Switch from AppFolio in 48 hours. We do the work.</h3>
        <p>Tell us you're ready, email us an export from AppFolio, and our migration team rebuilds your workspace inside Tenantory the same week. <strong>You keep using AppFolio until we say go-live.</strong> No downtime, no data loss, no double-entry. If you're stuck on an annual AppFolio contract, we'll credit up to $500 of buyout into your first invoice.</p>
        <div class="migrate-cta">
          <a class="btn btn-pink" href="mailto:migrate@tenantory.com?subject=AppFolio%20migration">
            Start my 48-hour switch
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="onboarding.html">Or start a trial first</a>
        </div>
      </div>
      <div class="migrate-steps">
        <div class="migrate-step">
          <div class="migrate-step-num">1</div>
          <div class="migrate-step-text">Export your AppFolio data<small>We send the exact click-path. 5 minutes.</small></div>
          <div class="migrate-step-clock">Day 1</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">2</div>
          <div class="migrate-step-text">We rebuild your workspace<small>Properties, tenants, leases, balances, documents.</small></div>
          <div class="migrate-step-clock">Day 1–2</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">3</div>
          <div class="migrate-step-text">You review &amp; sign off<small>Side-by-side reconciliation with your AppFolio numbers.</small></div>
          <div class="migrate-step-clock">Day 2</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">4</div>
          <div class="migrate-step-text">Tenants get a branded welcome email<small>They move from AppFolio to your new portal seamlessly.</small></div>
          <div class="migrate-step-clock">Go-live</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">5</div>
          <div class="migrate-step-text">We buy out your AppFolio contract<small>Up to $500 credit on your first Tenantory invoice.</small></div>
          <div class="migrate-step-clock">Bonus</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testi-wrap">
    <div class="section-head">
      <div class="section-kicker">Switch stories</div>
      <h2>From PMs who made the jump.</h2>
      <p>These are real operators in the 5–40 unit range who moved off AppFolio in the last six months.</p>
    </div>

    <div class="testi-grid">

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"I was paying AppFolio <strong>$312/mo for 11 doors</strong> and my tenants thought they were paying some company called AppFolio. On Tenantory I pay $99, my logo is on everything, and the Schedule-E export cut my CPA bill by $400 at tax time. No-brainer."</p>
        <div class="testi-person">
          <div class="testi-avatar">MR</div>
          <div>
            <div class="testi-name">Marcus R.</div>
            <div class="testi-role">Cardinal Rentals · 11 units · Birmingham, AL</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Nov '25
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"The migration was the part I was dreading, and it took <strong>36 hours end-to-end</strong>. They reconciled every tenant balance against AppFolio before cutover. We went live on a Monday and three tenants emailed asking if we'd rebranded — they had no idea we'd switched software."</p>
        <div class="testi-person">
          <div class="testi-avatar">JL</div>
          <div>
            <div class="testi-name">Jessica L.</div>
            <div class="testi-role">Hollow Creek Properties · 28 units · Chattanooga, TN</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Jan '26
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"I run co-living houses — 6 bedrooms per property, 18 tenants across 3 houses. AppFolio treats that like 3 units, which means I was faking sub-units with garbage workarounds. Tenantory has room-level leases out of the box. <strong>Saved me probably 6 hours a week</strong> just on the accounting alone."</p>
        <div class="testi-person">
          <div class="testi-avatar">DK</div>
          <div>
            <div class="testi-name">Devon K.</div>
            <div class="testi-role">Bridge House Co-Living · 18 tenants · Nashville, TN</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Feb '26
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"We had 14 months left on our AppFolio annual contract. Tenantory credited <strong>$500 toward the buyout</strong> on the first invoice and that plus the $213/mo I'm saving means I broke even in under 2 months. The owner statements going out to my investors look three times more professional, too."</p>
        <div class="testi-person">
          <div class="testi-avatar">AT</div>
          <div>
            <div class="testi-name">Amanda T.</div>
            <div class="testi-role">North Lake Capital · 34 units · Huntsville, AL</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Mar '26
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <div class="cta-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        87 Founders' spots left
      </div>
      <h2>Switch from AppFolio in 48 hours. Lock $99/mo for life.</h2>
      <p>We handle the migration, we credit your AppFolio buyout, and if Tenantory doesn't save you 10 hours in the first 30 paid days, we refund every dollar and wire you $100 for the inconvenience.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start my 14-day trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="mailto:migrate@tenantory.com?subject=AppFolio%20migration">
          Talk to a migration specialist
        </a>
      </div>
      <div class="cta-note">
        <span>No credit card required</span>
        <span class="cta-note-dot"></span>
        <span>Cancel anytime</span>
        <span class="cta-note-dot"></span>
        <span>Free data migration</span>
        <span class="cta-note-dot"></span>
        <span>$500 contract buyout credit</span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="vs-appfolio.html">vs AppFolio</a>
      <a href="portal.html">Tenant view</a>
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
