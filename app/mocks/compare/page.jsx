"use client";

// Mock ported verbatim from ~/Desktop/tenantory/compare.html.
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
    .hero { padding: 72px 32px 40px; text-align: center; max-width: 960px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 60px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 900px; margin: 0 auto 20px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 720px; margin: 0 auto 28px; line-height: 1.6;
    }
    .hero-byline {
      display: inline-flex; gap: 10px; align-items: center;
      font-size: 13px; color: var(--text-muted);
      background: var(--surface-alt); border: 1px solid var(--border);
      padding: 8px 14px; border-radius: 100px;
    }
    .hero-byline-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-bg); }
    .hero-byline strong { color: var(--text); font-weight: 700; }

    /* ===== Section head ===== */
    .section-head { text-align: center; margin-bottom: 36px; max-width: 720px; margin-left: auto; margin-right: auto; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 0 auto; }

    /* ===== At-a-glance cards ===== */
    .glance { max-width: 1200px; margin: 16px auto 0; padding: 0 32px; }
    .glance-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }
    .vcard {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 24px 22px;
      display: flex; flex-direction: column; gap: 12px;
      transition: all 0.2s ease;
    }
    .vcard:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .vcard-featured {
      border: 2px solid var(--pink);
      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);
      box-shadow: 0 20px 60px rgba(255,73,152,0.18);
      position: relative;
    }
    .vcard-ribbon {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, var(--pink), #ff7bb4);
      color: #fff; padding: 5px 14px; border-radius: 100px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      box-shadow: 0 8px 22px rgba(255,73,152,0.4);
    }
    .vcard-logo {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: #fff;
      font-weight: 900; font-size: 20px; letter-spacing: -0.02em;
    }
    .vcard-logo svg { width: 24px; height: 24px; }
    .vl-tenantory { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }
    .vl-appfolio { background: linear-gradient(135deg, #0066a5, #1e8fce); }
    .vl-buildium { background: linear-gradient(135deg, #0b8457, #14a870); }
    .vl-doorloop { background: linear-gradient(135deg, #f5a623, #f07c2b); }
    .vcard-name { font-weight: 800; font-size: 18px; letter-spacing: -0.02em; }
    .vcard-price { font-weight: 800; font-size: 22px; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }
    .vcard-price small { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .vcard-meta { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-muted); }
    .vcard-meta div { display: flex; justify-content: space-between; gap: 10px; }
    .vcard-meta strong { color: var(--text); font-weight: 600; }
    .vcard-best {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 12px;
      font-size: 13px; color: var(--text); line-height: 1.45;
    }
    .vcard-best-label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; display: block; }
    .vcard-featured .vcard-best { background: var(--pink-bg); border-color: var(--pink-strong); }
    .vcard-featured .vcard-best-label { color: #c21a6a; }
    .vcard-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--blue); font-weight: 600; font-size: 13px;
      margin-top: auto;
    }
    .vcard-link:hover { color: var(--navy); }
    .vcard-link svg { width: 14px; height: 14px; }
    .vcard-nolink { font-size: 12px; color: var(--text-faint); margin-top: auto; }

    /* ===== Verdict ===== */
    .verdict { max-width: 900px; margin: 88px auto 0; padding: 0 32px; }
    .verdict-card {
      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));
      border: 1px solid var(--blue-pale);
      border-radius: var(--radius-xl); padding: 36px 40px;
      display: grid; grid-template-columns: 64px 1fr; gap: 24px; align-items: start;
    }
    .verdict-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, var(--blue-bright), var(--navy));
      color: #fff; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 24px rgba(18,81,173,0.28);
    }
    .verdict-icon svg { width: 28px; height: 28px; }
    .verdict-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }
    .verdict p { font-size: 15.5px; color: var(--text); line-height: 1.65; margin-bottom: 10px; }
    .verdict p:last-child { margin-bottom: 0; }
    .verdict strong { font-weight: 700; color: var(--text); }

    /* ===== Comparison table ===== */
    .compare-wrap { max-width: 1180px; margin: 88px auto 0; padding: 0 32px; }
    .compare {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .compare-table {
      width: 100%; border-collapse: collapse; font-size: 14px;
    }
    .compare-table thead th {
      padding: 20px 14px; text-align: center;
      font-weight: 800; font-size: 14px; color: var(--text);
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
      vertical-align: middle;
    }
    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; width: 26%; }
    .compare-table thead th.featured {
      background: linear-gradient(180deg, var(--pink-bg), transparent);
      color: var(--pink);
    }
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
      padding: 13px 14px; border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .compare-table td:first-child { color: var(--text); font-weight: 500; }
    .compare-table td:not(:first-child) { text-align: center; }
    .compare-table tbody tr:last-child td { border-bottom: none; }

    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }
    .cmp-no { color: var(--text-faint); font-weight: 500; }
    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }
    .cmp-partial { font-size: 12px; font-weight: 600; color: var(--gold); }
    .cmp-win { box-shadow: inset 3px 0 0 var(--pink); }
    td.tn-col { background: rgba(255,73,152,0.04) !important; }

    /* ===== Cost chart ===== */
    .cost { max-width: 1080px; margin: 96px auto 0; padding: 0 32px; }
    .cost-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 36px 40px;
      box-shadow: var(--shadow-sm);
    }
    .cost-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
    .cost-head h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .cost-head p { font-size: 14px; color: var(--text-muted); max-width: 420px; }
    .cost-legend { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }
    .cost-legend-item { display: flex; align-items: center; gap: 6px; }
    .cost-legend-swatch { width: 12px; height: 12px; border-radius: 3px; }
    .cl-tn { background: linear-gradient(135deg, var(--pink), #ff7bb4); }
    .cl-af { background: linear-gradient(135deg, #0066a5, #1e8fce); }
    .cl-bd { background: linear-gradient(135deg, #0b8457, #14a870); }
    .cl-dl { background: linear-gradient(135deg, #f5a623, #f07c2b); }

    .chart { width: 100%; height: 340px; }
    .cost-rows { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 24px; }
    .cost-row {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
    }
    .cost-row-name { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .cost-row-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }
    .cost-row-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .cost-row.win { background: var(--pink-bg); border-color: var(--pink-strong); }
    .cost-row.win .cost-row-name { color: #c21a6a; }
    .cost-note { font-size: 12px; color: var(--text-faint); margin-top: 16px; line-height: 1.55; }

    /* ===== Switching cards ===== */
    .switch { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .switch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .switch-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 24px 22px;
      display: flex; flex-direction: column; gap: 10px;
      transition: all 0.2s ease;
    }
    .switch-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue-bright); }
    .switch-card-head { display: flex; align-items: center; gap: 10px; }
    .switch-card-logo { width: 36px; height: 36px; border-radius: 10px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; letter-spacing: -0.02em; }
    .switch-card h4 { font-weight: 800; font-size: 16px; letter-spacing: -0.02em; }
    .switch-card p { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; flex: 1; }
    .switch-card .switch-meta { font-size: 12px; color: var(--text-faint); }
    .switch-card .switch-meta strong { color: var(--text); font-weight: 700; }
    .switch-card-link { display: inline-flex; align-items: center; gap: 6px; color: var(--blue); font-weight: 600; font-size: 13px; margin-top: 6px; }
    .switch-card-link svg { width: 14px; height: 14px; }

    /* ===== FAQ ===== */
    .faq { max-width: 820px; margin: 96px auto 0; padding: 0 32px; }
    .faq-list { display: flex; flex-direction: column; gap: 10px; }
    .faq-item {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: all 0.15s ease;
    }
    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }
    .faq-q {
      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);
      display: flex; justify-content: space-between; align-items: center;
      cursor: pointer; user-select: none; width: 100%; text-align: left; gap: 14px;
    }
    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }
    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }
    .faq-a {
      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;
      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;
    }
    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }
    .faq-a strong { color: var(--text); font-weight: 700; }
    .faq-a a { color: var(--blue); font-weight: 600; text-decoration: underline; }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }
    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 960px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .glance, .verdict, .compare-wrap, .cost, .switch, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .glance-grid { grid-template-columns: repeat(2, 1fr); }
      .verdict-card { grid-template-columns: 1fr; padding: 28px; }
      .compare { overflow-x: auto; }
      .compare-table { min-width: 780px; }
      .cost-card { padding: 24px 22px; }
      .cost-rows { grid-template-columns: repeat(2, 1fr); }
      .switch-grid { grid-template-columns: 1fr; }
      .cta-card { padding: 36px 22px; }
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
      <a class="tb-nav-item active" href="compare.html">Compare</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      Updated April 2026 · Real pricing, no referral spin
    </div>
    <h1>Compare <em>Tenantory</em> vs AppFolio vs Buildium vs DoorLoop.</h1>
    <p class="hero-sub">The most honest four-way comparison of property management software on the internet — because I paid for all four of them myself before building Tenantory. No strawmen, no cherry-picked screenshots. Here's what each one actually does, what it actually costs, and which one you should pick.</p>
    <div class="hero-byline">
      <span class="hero-byline-dot"></span>
      Written by <strong>Harrison Cooper</strong> · operator, 15 units in Huntsville, AL
    </div>
  </section>

  <!-- At-a-glance -->
  <section class="glance">
    <div class="glance-grid">

      <!-- Tenantory -->
      <div class="vcard vcard-featured">
        <div class="vcard-ribbon">Recommended</div>
        <div class="vcard-logo vl-tenantory">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </div>
        <div class="vcard-name">Tenantory</div>
        <div class="vcard-price">$99<small>/mo flat · any portfolio size</small></div>
        <div class="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>$0</strong></div>
          <div><span>Setup fee</span><strong>$0</strong></div>
          <div><span>Annual contract</span><strong>No</strong></div>
        </div>
        <div class="vcard-best">
          <span class="vcard-best-label">Best for</span>
          Solo landlords and small PMs with 5&ndash;50 units who want a branded tenant portal without paying enterprise prices.
        </div>
        <span class="vcard-nolink">You are here.</span>
      </div>

      <!-- AppFolio -->
      <div class="vcard">
        <div class="vcard-logo vl-appfolio">AF</div>
        <div class="vcard-name">AppFolio</div>
        <div class="vcard-price">$1.40<small>/unit/mo + $280 base</small></div>
        <div class="vcard-meta">
          <div><span>Min units</span><strong>50</strong></div>
          <div><span>Per-unit fee</span><strong>Yes</strong></div>
          <div><span>Setup fee</span><strong>$400&ndash;$1,500</strong></div>
          <div><span>Annual contract</span><strong>Yes</strong></div>
        </div>
        <div class="vcard-best">
          <span class="vcard-best-label">Best for</span>
          Regional PM companies with 250&ndash;5,000 doors who need a leasing team, corporate AP workflow, and a full CRM.
        </div>
        <a class="vcard-link" href="vs-appfolio.html">Tenantory vs AppFolio <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>

      <!-- Buildium -->
      <div class="vcard">
        <div class="vcard-logo vl-buildium">BD</div>
        <div class="vcard-name">Buildium</div>
        <div class="vcard-price">$58<small>/mo Essential · +$0.50/unit</small></div>
        <div class="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>$0.50&ndash;$1.50</strong></div>
          <div><span>Setup fee</span><strong>$0 self-serve</strong></div>
          <div><span>Annual contract</span><strong>Month-to-month</strong></div>
        </div>
        <div class="vcard-best">
          <span class="vcard-best-label">Best for</span>
          Mid-sized PMs (50&ndash;500 units) who care about real double-entry accounting and have an in-house bookkeeper.
        </div>
        <a class="vcard-link" href="vs-buildium.html">Tenantory vs Buildium <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>

      <!-- DoorLoop -->
      <div class="vcard">
        <div class="vcard-logo vl-doorloop">DL</div>
        <div class="vcard-name">DoorLoop</div>
        <div class="vcard-price">$69<small>/mo Starter · 20 units capped</small></div>
        <div class="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>Built-in tier</strong></div>
          <div><span>Setup fee</span><strong>$0</strong></div>
          <div><span>Annual contract</span><strong>Annual preferred</strong></div>
        </div>
        <div class="vcard-best">
          <span class="vcard-best-label">Best for</span>
          Landlords who like a polished modern UI, don't need branded portals, and are fine locking in an annual contract.
        </div>
        <a class="vcard-link" href="vs-doorloop.html">Tenantory vs DoorLoop <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
      </div>

    </div>
  </section>

  <!-- Verdict -->
  <section class="verdict">
    <div class="verdict-card">
      <div class="verdict-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>
      </div>
      <div>
        <div class="verdict-title">Which one should you actually use?</div>
        <p>If you have <strong>5&ndash;50 units</strong> and want tenants to see your brand when they pay rent, pick <strong>Tenantory</strong>. The $99 flat price beats every other option at that size, and you get a branded subdomain without needing a Scale plan.</p>
        <p>If you run <strong>250+ doors</strong> with a leasing team and need deep GL accounting, bank reconciliation, or corporate AP approvals, <strong>AppFolio</strong> or <strong>Buildium</strong> are still the right answer. Buildium wins if you care about accounting depth; AppFolio wins if you need enterprise tooling (Plus plan).</p>
        <p>If you like <strong>DoorLoop's UI</strong> (it's genuinely the prettiest of the legacy tools), you don't care about branded tenant portals, and you're okay signing an annual contract — DoorLoop is a fine pick. Pricing is similar to Tenantory at comparable unit counts.</p>
        <p>Everyone else &mdash; which is most landlords under 50 units &mdash; should save the $180&ndash;$400/mo and switch to Tenantory.</p>
      </div>
    </div>
  </section>

  <!-- Comparison table -->
  <section class="compare-wrap">
    <div class="section-head">
      <div class="section-kicker">Feature-by-feature</div>
      <h2>Every line, no asterisks.</h2>
      <p>If a vendor partially does something, we say "partial" instead of a green checkmark. If I haven't personally verified a number in the last 60 days, it isn't on this table.</p>
    </div>
    <div class="compare">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="featured">Tenantory<span class="compare-col-sub">$99/mo flat</span></th>
            <th>AppFolio<span class="compare-col-sub">$280/mo + /unit</span></th>
            <th>Buildium<span class="compare-col-sub">$58&ndash;$479/mo</span></th>
            <th>DoorLoop<span class="compare-col-sub">$69&ndash;$229/mo</span></th>
          </tr>
        </thead>
        <tbody>

          <tr class="group-head"><td colspan="5">Pricing</td></tr>
          <tr><td>Starting price</td><td class="tn-col"><span class="cmp-val">$39/mo</span></td><td><span class="cmp-val">$280/mo base</span></td><td><span class="cmp-val">$58/mo</span></td><td><span class="cmp-val">$69/mo</span></td></tr>
          <tr><td>Minimum units required</td><td class="tn-col"><span class="cmp-val">1</span></td><td><span class="cmp-val">50</span></td><td><span class="cmp-val">1</span></td><td><span class="cmp-val">1</span></td></tr>
          <tr><td>Per-unit fees</td><td class="tn-col"><span class="cmp-val">None</span></td><td><span class="cmp-val">$1.40/unit</span></td><td><span class="cmp-val">$0.50&ndash;$1.50</span></td><td><span class="cmp-val">Tiered cap</span></td></tr>
          <tr><td>Annual discount</td><td class="tn-col"><span class="cmp-val">2 months off</span></td><td><span class="cmp-val">None</span></td><td><span class="cmp-val">~10%</span></td><td><span class="cmp-val">~20%</span></td></tr>

          <tr class="group-head"><td colspan="5">Tenant experience</td></tr>
          <tr><td>Branded tenant portal</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-partial">Enterprise only</span></td><td><span class="cmp-partial">Logo only</span></td><td><span class="cmp-partial">Logo only</span></td></tr>
          <tr><td>Custom domain (rentyourname.com)</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td class="cmp-no">&mdash;</td><td class="cmp-no">&mdash;</td><td class="cmp-no">&mdash;</td></tr>
          <tr><td>Tenant iOS/Android app</td><td class="tn-col"><span class="cmp-partial">PWA (web)</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>SMS notifications included</td><td class="tn-col"><span class="cmp-val">2,000/mo</span></td><td><span class="cmp-val">Add-on</span></td><td><span class="cmp-val">Add-on</span></td><td><span class="cmp-val">Included</span></td></tr>

          <tr class="group-head"><td colspan="5">Leasing</td></tr>
          <tr><td>Lease e-signature</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>State-specific lease templates</td><td class="tn-col"><span class="cmp-val">All 50</span></td><td><span class="cmp-val">All 50</span></td><td><span class="cmp-val">All 50</span></td><td><span class="cmp-val">All 50</span></td></tr>
          <tr><td>AI application scoring</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-partial">Beta</span></td><td class="cmp-no">&mdash;</td><td class="cmp-no">&mdash;</td></tr>
          <tr><td>Cosigner / guarantor support</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-partial">Manual</span></td></tr>

          <tr class="group-head"><td colspan="5">Payments</td></tr>
          <tr><td>ACH fee</td><td class="tn-col"><span class="cmp-val">$0</span></td><td><span class="cmp-val">$1.00/txn</span></td><td><span class="cmp-val">$0 (Premium)</span></td><td><span class="cmp-val">$0</span></td></tr>
          <tr><td>Card fee</td><td class="tn-col"><span class="cmp-val">2.95%</span></td><td><span class="cmp-val">2.99%</span></td><td><span class="cmp-val">2.95%</span></td><td><span class="cmp-val">2.95%</span></td></tr>
          <tr><td>Tenant autopay</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Split-rent between roommates</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td class="cmp-no">&mdash;</td><td><span class="cmp-partial">Workaround</span></td><td><span class="cmp-partial">Workaround</span></td></tr>

          <tr class="group-head"><td colspan="5">Accounting</td></tr>
          <tr><td>Income/expense ledger</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>True double-entry GL</td><td class="tn-col"><span class="cmp-partial">Simplified</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>1099 generation</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Schedule E tax pack export</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-partial">CSV only</span></td><td><span class="cmp-partial">CSV only</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>QuickBooks sync</td><td class="tn-col"><span class="cmp-partial">Export only</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="5">Operations</td></tr>
          <tr><td>Maintenance ticketing</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Vendor portal</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-partial">Growth plan</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Listing syndication (Zillow, Trulia, etc.)</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="5">Support &amp; trust</td></tr>
          <tr><td>Support response SLA</td><td class="tn-col"><span class="cmp-val">Same-day</span></td><td><span class="cmp-val">1&ndash;2 business days</span></td><td><span class="cmp-val">24 hr</span></td><td><span class="cmp-val">Same-day chat</span></td></tr>
          <tr><td>SOC 2 Type II</td><td class="tn-col"><span class="cmp-partial">In progress</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Money-back guarantee</td><td class="tn-col"><span class="cmp-val">$100 + refund</span></td><td class="cmp-no">&mdash;</td><td><span class="cmp-val">30-day</span></td><td><span class="cmp-val">30-day</span></td></tr>

          <tr class="group-head"><td colspan="5">Setup &amp; migration</td></tr>
          <tr><td>Typical onboarding time</td><td class="tn-col"><span class="cmp-val">3 days</span></td><td><span class="cmp-val">4&ndash;6 weeks</span></td><td><span class="cmp-val">1&ndash;2 weeks</span></td><td><span class="cmp-val">5&ndash;10 days</span></td></tr>
          <tr><td>Free data migration help</td><td class="tn-col"><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td class="cmp-no">&mdash;</td><td><span class="cmp-partial">Paid tier</span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Required implementation call</td><td class="tn-col"><span class="cmp-val">Optional</span></td><td><span class="cmp-val">Mandatory</span></td><td><span class="cmp-val">Optional</span></td><td><span class="cmp-val">Mandatory</span></td></tr>

        </tbody>
      </table>
    </div>
  </section>

  <!-- Cost chart -->
  <section class="cost">
    <div class="cost-card">
      <div class="cost-head">
        <div>
          <h3>3-year cost for a 25-unit portfolio.</h3>
          <p>Annual plan where available. Base software only &mdash; card processing is roughly equal across all four, so it's excluded.</p>
        </div>
        <div class="cost-legend">
          <div class="cost-legend-item"><span class="cost-legend-swatch cl-tn"></span>Tenantory</div>
          <div class="cost-legend-item"><span class="cost-legend-swatch cl-af"></span>AppFolio</div>
          <div class="cost-legend-item"><span class="cost-legend-swatch cl-bd"></span>Buildium</div>
          <div class="cost-legend-item"><span class="cost-legend-swatch cl-dl"></span>DoorLoop</div>
        </div>
      </div>

      <svg class="chart" viewBox="0 0 960 340" preserveAspectRatio="none" aria-label="3-year cost chart">
        <defs>
          <linearGradient id="gTn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4998"/><stop offset="100%" stop-color="#ff7bb4"/></linearGradient>
          <linearGradient id="gAf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e8fce"/><stop offset="100%" stop-color="#0066a5"/></linearGradient>
          <linearGradient id="gBd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#14a870"/><stop offset="100%" stop-color="#0b8457"/></linearGradient>
          <linearGradient id="gDl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5a623"/><stop offset="100%" stop-color="#f07c2b"/></linearGradient>
        </defs>

        <!-- Grid lines -->
        <g stroke="#e3e8ef" stroke-width="1">
          <line x1="60" y1="40"  x2="920" y2="40"/>
          <line x1="60" y1="100" x2="920" y2="100"/>
          <line x1="60" y1="160" x2="920" y2="160"/>
          <line x1="60" y1="220" x2="920" y2="220"/>
          <line x1="60" y1="280" x2="920" y2="280"/>
        </g>
        <!-- Y-axis labels -->
        <g fill="#8a93a5" font-size="11" font-family="Inter, sans-serif" font-weight="600">
          <text x="50" y="44"  text-anchor="end">$32k</text>
          <text x="50" y="104" text-anchor="end">$24k</text>
          <text x="50" y="164" text-anchor="end">$16k</text>
          <text x="50" y="224" text-anchor="end">$8k</text>
          <text x="50" y="284" text-anchor="end">$0</text>
        </g>

        <!-- Year groups. Scale: 280 = $0, 40 = $32k. 1px = ~$133. -->
        <!-- Year 1 -->
        <g>
          <!-- TN: $3600 -> h=27 -->
          <rect x="100" y="253" width="36" height="27" fill="url(#gTn)" rx="4"/>
          <!-- DL: $3600 -> h=27 -->
          <rect x="140" y="253" width="36" height="27" fill="url(#gDl)" rx="4"/>
          <!-- BD: $5000 -> h=37.5 -->
          <rect x="180" y="242" width="36" height="38" fill="url(#gBd)" rx="4"/>
          <!-- AF: $9500 -> h=71 -->
          <rect x="220" y="209" width="36" height="71" fill="url(#gAf)" rx="4"/>
          <text x="178" y="302" text-anchor="middle" fill="#5a6478" font-size="12" font-family="Inter, sans-serif" font-weight="700">Year 1</text>
        </g>
        <!-- Year 2 (cumulative) -->
        <g>
          <!-- TN: $7200 -> h=54 -->
          <rect x="380" y="226" width="36" height="54" fill="url(#gTn)" rx="4"/>
          <!-- DL: $7200 -> h=54 -->
          <rect x="420" y="226" width="36" height="54" fill="url(#gDl)" rx="4"/>
          <!-- BD: $10400 (+400 growth) -> h=78 -->
          <rect x="460" y="202" width="36" height="78" fill="url(#gBd)" rx="4"/>
          <!-- AF: $19500 (+500) -> h=146 -->
          <rect x="500" y="134" width="36" height="146" fill="url(#gAf)" rx="4"/>
          <text x="458" y="302" text-anchor="middle" fill="#5a6478" font-size="12" font-family="Inter, sans-serif" font-weight="700">Year 2</text>
        </g>
        <!-- Year 3 (cumulative) -->
        <g>
          <!-- TN: $10800 -> h=81 -->
          <rect x="660" y="199" width="36" height="81" fill="url(#gTn)" rx="4"/>
          <text x="678" y="193" text-anchor="middle" fill="#1a1f36" font-size="11" font-family="Inter, sans-serif" font-weight="700">$10.8k</text>
          <!-- DL: $11000 (small raise) -> h=82.5 -->
          <rect x="700" y="198" width="36" height="82" fill="url(#gDl)" rx="4"/>
          <!-- BD: $16200 -> h=121.5 -->
          <rect x="740" y="159" width="36" height="121" fill="url(#gBd)" rx="4"/>
          <!-- AF: $30000 -> h=225 -->
          <rect x="780" y="55" width="36" height="225" fill="url(#gAf)" rx="4"/>
          <text x="798" y="49" text-anchor="middle" fill="#1a1f36" font-size="11" font-family="Inter, sans-serif" font-weight="700">$30k</text>
          <text x="738" y="302" text-anchor="middle" fill="#5a6478" font-size="12" font-family="Inter, sans-serif" font-weight="700">Year 3</text>
        </g>

        <!-- Baseline -->
        <line x1="60" y1="280" x2="920" y2="280" stroke="#c9d1dd" stroke-width="1.5"/>
      </svg>

      <div class="cost-rows">
        <div class="cost-row win">
          <div class="cost-row-name">Tenantory</div>
          <div class="cost-row-val">$10,800</div>
          <div class="cost-row-sub">$3,600/yr · locked for Founders</div>
        </div>
        <div class="cost-row">
          <div class="cost-row-name">DoorLoop</div>
          <div class="cost-row-val">$11,000</div>
          <div class="cost-row-sub">~$3,600/yr at 25 units on Pro</div>
        </div>
        <div class="cost-row">
          <div class="cost-row-name">Buildium</div>
          <div class="cost-row-val">$16,200</div>
          <div class="cost-row-sub">Growth plan + $0.80/unit</div>
        </div>
        <div class="cost-row">
          <div class="cost-row-name">AppFolio</div>
          <div class="cost-row-val">$30,000</div>
          <div class="cost-row-sub">$280 base + $1.40/unit + setup</div>
        </div>
      </div>

      <p class="cost-note">AppFolio requires 50 units minimum, so at 25 units you'd either be ineligible or pay the 50-unit floor ($280 + $70 = $350/mo). Numbers assume you meet the floor. Includes one-time $1,500 implementation fee amortized into Year 1.</p>
    </div>
  </section>

  <!-- Switching cards -->
  <section class="switch">
    <div class="section-head">
      <div class="section-kicker">Switching guides</div>
      <h2>Already on one of these?</h2>
      <p>We migrate your data for free. Pick your current tool &mdash; the deeper guide covers CSV exports, what transfers cleanly, and what doesn't.</p>
    </div>
    <div class="switch-grid">

      <a class="switch-card" href="vs-appfolio.html">
        <div class="switch-card-head">
          <div class="switch-card-logo vl-appfolio">AF</div>
          <h4>Switching from AppFolio</h4>
        </div>
        <p>Export the Tenant Directory, Rent Roll, and Owner Statements from AppFolio's Reports tab. Everything except internal chat threads and appraisal docs transfers. Typical cutover: 72 hours.</p>
        <div class="switch-meta">Biggest gotcha: <strong>AppFolio holds your owner funds for 3 business days after cancellation</strong>. Plan your cutover around the 1st.</div>
        <span class="switch-card-link">Full AppFolio migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <a class="switch-card" href="vs-buildium.html">
        <div class="switch-card-head">
          <div class="switch-card-logo vl-buildium">BD</div>
          <h4>Switching from Buildium</h4>
        </div>
        <p>Buildium's CSV export is the cleanest of the four &mdash; they give you a zip with properties, units, tenants, leases, and transactions as separate files. We re-map columns and you're live in 3 days.</p>
        <div class="switch-meta">Biggest gotcha: <strong>Buildium's chart of accounts is more granular than Tenantory</strong>. We consolidate 80+ categories into 14 Schedule-E lines.</div>
        <span class="switch-card-link">Full Buildium migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <a class="switch-card" href="vs-doorloop.html">
        <div class="switch-card-head">
          <div class="switch-card-logo vl-doorloop">DL</div>
          <h4>Switching from DoorLoop</h4>
        </div>
        <p>DoorLoop exports cleanly from Settings &rarr; Data Export. The only thing that doesn't transfer is their internal Task list &mdash; but those map neatly into Tenantory's Maintenance module as open tickets.</p>
        <div class="switch-meta">Biggest gotcha: <strong>DoorLoop annual contracts lock you for 12 months</strong>. We'll help you time the cutover to your renewal date so you don't double-pay.</div>
        <span class="switch-card-link">Full DoorLoop migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

    </div>
  </section>

  <!-- FAQ -->
  <section class="faq" id="faq">
    <div class="section-head">
      <div class="section-kicker">Questions</div>
      <h2>The honest answers.</h2>
    </div>
    <div class="faq-list">

      <div class="faq-item">
        <button class="faq-q">Isn't this a biased comparison? You sell one of the four. <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Yes, it's biased in the sense that I think Tenantory is the best fit for most small PMs &mdash; that's why I built it after using the other three. It's <strong>not</strong> biased in the sense of misrepresenting the competition. Every number on this page is from the vendor's public pricing page or a real invoice I've personally paid. Where they beat Tenantory &mdash; AppFolio's deeper accounting, Buildium's double-entry GL, DoorLoop's native mobile apps &mdash; I say so.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">What if I need a feature only AppFolio has? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Then use AppFolio. Specifically: if you need AppFolio Plus features (AI leasing assistant for 500+ unit leasing teams, corporate AP approval chains, investor-grade fund accounting), Tenantory isn't there yet. If you need AppFolio Core features (rent roll, owner statements, maintenance, e-sign, CAM reconciliation), Tenantory does all of those at 1/3 the price. The real question is whether you'll ever <strong>actually use</strong> the $280/mo worth of features. Most 25-unit PMs don't.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">Can I really migrate in 3 days? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Yes, <strong>for portfolios under 100 units with clean data</strong>. Day 1: you send us your CSV export. Day 2: we map and load it, you review. Day 3: we switch tenant payment links and you're live. If you have 200+ units or messy data (e.g. leases not in the system, security deposits in a separate spreadsheet), budget a week. Either way, you keep using your old tool the whole time until you say go.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">Does Tenantory work for 500+ unit portfolios? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">It works, but it's not yet the <em>best</em> pick at that scale. The Scale plan handles unlimited units technically, and we have customers with 200+ doors. But if you have a leasing team of 5, a full-time bookkeeper, and multiple entities doing inter-company transfers &mdash; Buildium or AppFolio's workflows are more mature for that. We'll get there. For now, if you're over 500 units with a real back-office team, I'll tell you honestly: start with Buildium, come back when we ship multi-entity (Q3 2026).</div>
      </div>

    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>Still not sure? Try Tenantory for 14 days.</h2>
      <p>No credit card, no contract, no onboarding fee. If it doesn't save you 10 hours in the first 30 paid days, we refund every dollar and wire you $100 for your time.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="portal.html" target="_blank">
          See the tenant view
        </a>
      </div>
      <div class="cta-note">87 Founders' spots left at $99 for life</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="compare.html">Compare</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
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
