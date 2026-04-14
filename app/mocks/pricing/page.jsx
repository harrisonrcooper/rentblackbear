"use client";

// Mock ported verbatim from ~/Desktop/tenantory/pricing.html.
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
    .hero { padding: 72px 32px 40px; text-align: center; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
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
      max-width: 640px; margin: 0 auto 32px; line-height: 1.55;
    }

    /* ===== Billing toggle ===== */
    .bill-toggle {
      display: inline-flex; background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 100px; padding: 4px; position: relative;
    }
    .bill-opt {
      padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); cursor: pointer; transition: all 0.2s ease;
      position: relative; z-index: 1;
    }
    .bill-opt.active { color: var(--text); background: var(--surface); box-shadow: var(--shadow-sm); }
    .bill-save {
      display: inline-block; margin-left: 6px;
      font-size: 10px; padding: 2px 7px; border-radius: 100px;
      background: var(--green-bg); color: var(--green-dark); font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    }

    /* ===== Plans ===== */
    .plans {
      max-width: 1200px; margin: 40px auto 0;
      padding: 0 32px;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    }
    .plan {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 32px 28px;
      display: flex; flex-direction: column; position: relative;
      transition: all 0.2s ease;
    }
    .plan:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .plan-featured {
      border: 2px solid var(--pink);
      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);
      box-shadow: 0 20px 60px rgba(255,73,152,0.18);
      transform: translateY(-8px);
    }
    .plan-featured:hover { transform: translateY(-12px); }
    .plan-ribbon {
      position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, var(--pink), #ff7bb4);
      color: #fff; padding: 6px 16px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      box-shadow: 0 8px 22px rgba(255,73,152,0.4);
      white-space: nowrap;
    }

    .plan-name { font-weight: 800; font-size: 15px; color: var(--text); letter-spacing: -0.01em; margin-bottom: 4px; }
    .plan-tag { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
    .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
    .plan-price-amount { font-size: 52px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--text); }
    .plan-price-period { font-size: 15px; color: var(--text-muted); font-weight: 500; }
    .plan-price-old { font-size: 13px; color: var(--text-faint); text-decoration: line-through; margin-bottom: 14px; }
    .plan-cap { font-size: 13px; color: var(--text-muted); margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
    .plan-cap strong { color: var(--text); font-weight: 700; }

    .plan-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }
    .plan-features li {
      list-style: none; display: flex; align-items: flex-start; gap: 10px;
      font-size: 13.5px; color: var(--text); line-height: 1.45;
    }
    .plan-features li svg {
      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;
      color: var(--green-dark); padding: 2px;
      background: var(--green-bg); border-radius: 50%;
    }
    .plan-features li.dim { color: var(--text-faint); }
    .plan-features li.dim svg { color: var(--text-faint); background: var(--surface-alt); }

    .plan-cta { margin-top: auto; }
    .plan .btn { width: 100%; justify-content: center; }
    .plan-note { text-align: center; font-size: 11px; color: var(--text-faint); margin-top: 10px; }

    /* ===== Enterprise strip ===== */
    .enterprise {
      max-width: 1200px; margin: 24px auto 0; padding: 0 32px;
    }
    .ent-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl); padding: 32px;
      display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;
      position: relative; overflow: hidden;
    }
    .ent-card::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 260px; height: 260px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .ent-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; position: relative; z-index: 1; }
    .ent-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; position: relative; z-index: 1; }
    .ent-sub { font-size: 14px; color: rgba(255,255,255,0.75); max-width: 520px; position: relative; z-index: 1; }
    .ent-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; position: relative; z-index: 1; }
    .ent-price { font-size: 14px; color: rgba(255,255,255,0.7); }
    .ent-price strong { color: #fff; font-weight: 700; font-size: 15px; }

    /* ===== Guarantee callout ===== */
    .guarantee {
      max-width: 1000px; margin: 72px auto 0; padding: 0 32px;
    }
    .guar-card {
      background: var(--surface);
      border: 2px solid var(--pink);
      border-radius: var(--radius-xl); padding: 32px 36px;
      display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;
      box-shadow: var(--shadow);
    }
    .guar-shield {
      width: 72px; height: 72px; border-radius: 22px;
      background: linear-gradient(135deg, var(--pink), #ff7bb4);
      color: #fff; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 14px 32px rgba(255,73,152,0.35);
    }
    .guar-shield svg { width: 36px; height: 36px; }
    .guar-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .guar-text { font-size: 15px; color: var(--text-muted); line-height: 1.55; }
    .guar-text strong { color: var(--text); font-weight: 700; }

    /* ===== Replaces stack ===== */
    .replaces {
      max-width: 1000px; margin: 80px auto 0; padding: 0 32px;
    }
    .section-head { text-align: center; margin-bottom: 40px; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 580px; margin: 0 auto; }

    .rep-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
      margin-bottom: 24px;
    }
    .rep-row {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px 18px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .rep-name { font-weight: 600; font-size: 14px; color: var(--text); }
    .rep-name small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }
    .rep-price { font-weight: 700; font-size: 16px; color: var(--text); font-variant-numeric: tabular-nums; }
    .rep-price-strike { color: var(--text-faint); text-decoration: line-through; font-size: 14px; font-weight: 500; margin-right: 6px; }

    .rep-total {
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;
      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));
      border: 1px solid var(--blue-pale);
      border-radius: var(--radius-lg); padding: 26px 32px;
    }
    .rep-total-side { display: flex; flex-direction: column; gap: 2px; }
    .rep-total-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; }
    .rep-total-amount { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
    .rep-total-side.right .rep-total-amount { color: var(--green-dark); }
    .rep-total-side.right .rep-total-label { color: var(--green-dark); }
    .rep-total-arrow {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--surface); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--blue);
    }
    .rep-total-arrow svg { width: 18px; height: 18px; }
    .rep-total-after { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 4px; }

    /* ===== Comparison table ===== */
    .compare-wrap {
      max-width: 1100px; margin: 80px auto 0; padding: 0 32px;
    }
    .compare {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .compare-table {
      width: 100%; border-collapse: collapse; font-size: 14px;
    }
    .compare-table thead th {
      padding: 20px 16px; text-align: center;
      font-weight: 800; font-size: 14px; color: var(--text);
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
      vertical-align: middle;
    }
    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
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
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .compare-table td:first-child { color: var(--text); font-weight: 500; }
    .compare-table td:not(:first-child) { text-align: center; }
    .compare-table tbody tr:last-child td { border-bottom: none; }

    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }
    .cmp-no { color: var(--text-faint); font-weight: 500; }
    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }

    /* ===== FAQ ===== */
    .faq {
      max-width: 800px; margin: 80px auto 0; padding: 0 32px;
    }
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
      cursor: pointer; user-select: none; width: 100%; text-align: left;
    }
    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }
    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }
    .faq-a {
      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;
      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6;
    }
    .faq-item.open .faq-a { max-height: 500px; padding: 0 22px 20px; }

    /* ===== Bottom CTA ===== */
    .cta-bottom {
      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;
    }
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
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto 28px; }
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

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .plans, .enterprise, .guarantee, .replaces, .compare-wrap, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .plans { grid-template-columns: 1fr; }
      .plan-featured { transform: none; }
      .plan-featured:hover { transform: translateY(-4px); }
      .ent-card { grid-template-columns: 1fr; }
      .ent-actions { align-items: flex-start; }
      .guar-card { grid-template-columns: 1fr; }
      .rep-grid { grid-template-columns: 1fr; }
      .rep-total { grid-template-columns: 1fr; text-align: center; gap: 12px; }
      .rep-total-side { align-items: center; }
      .rep-total-arrow { transform: rotate(90deg); margin: 0 auto; }
      .compare { overflow-x: auto; }
      .compare-table { min-width: 640px; }
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
      <a class="tb-nav-item active" href="pricing.html">Pricing</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      87 Founders' spots left at $99 for life
    </div>
    <h1>One price replaces <em>five tools</em>.</h1>
    <p class="hero-sub">Every plan includes the tenant portal, online rent, lease e-sign, maintenance, and accounting. Pay what's fair for your portfolio size — not for each feature.</p>

    <div class="bill-toggle" id="billToggle">
      <button class="bill-opt active" data-period="monthly">Monthly</button>
      <button class="bill-opt" data-period="annual">Annual <span class="bill-save">Save 2 months</span></button>
    </div>
  </section>

  <!-- Plans -->
  <section class="plans">

    <!-- Starter -->
    <div class="plan">
      <div class="plan-name">Starter</div>
      <div class="plan-tag">Solo landlord · a few units</div>
      <div class="plan-price">
        <span class="plan-price-amount" data-monthly="39" data-annual="33">$39</span>
        <span class="plan-price-period">/mo</span>
      </div>
      <div class="plan-price-old" data-monthly="&nbsp;" data-annual="$39/mo billed monthly"></div>
      <div class="plan-cap"><strong>Up to 5 units.</strong> Perfect if this is a side hustle with a house or two.</div>
      <ul class="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenant portal (generic Tenantory URL)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Online rent collection (ACH free, cards 2.95%)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Lease e-sign &amp; stored documents</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Maintenance ticketing</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Generic application link</li>
        <li class="dim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>No branded subdomain</li>
        <li class="dim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>No investor reports</li>
      </ul>
      <div class="plan-cta">
        <a class="btn btn-ghost" href="onboarding.html">Start free trial</a>
        <div class="plan-note">No credit card required</div>
      </div>
    </div>

    <!-- Pro (featured) -->
    <div class="plan plan-featured">
      <div class="plan-ribbon">Founders · $99 for life</div>
      <div class="plan-name">Pro</div>
      <div class="plan-tag">The hero plan · where most PMs live</div>
      <div class="plan-price">
        <span class="plan-price-amount" data-monthly="99" data-annual="82">$99</span>
        <span class="plan-price-period">/mo</span>
      </div>
      <div class="plan-price-old" data-monthly="&nbsp;" data-annual="$99/mo billed monthly"></div>
      <div class="plan-cap"><strong>Up to 50 units.</strong> Branded subdomain, investor reports, and the full Founders' bonus stack.</div>
      <ul class="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Everything in Starter</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><strong>Your own branded subdomain</strong> — yourname.tenantory.com</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Branded tenant portal &amp; application</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Monthly investor reports &amp; Schedule-E export</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Accounting ledger + 1099 generation</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>AI application scoring</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><strong>$3,850 bonus stack</strong> — data migration, lease template, onboarding call</li>
      </ul>
      <div class="plan-cta">
        <a class="btn btn-pink" href="onboarding.html">Start 14-day trial</a>
        <div class="plan-note">Locks $99/mo for life · 13 spots/week going</div>
      </div>
    </div>

    <!-- Scale -->
    <div class="plan">
      <div class="plan-name">Scale</div>
      <div class="plan-tag">Brand-forward PMs · full white-label</div>
      <div class="plan-price">
        <span class="plan-price-amount" data-monthly="299" data-annual="249">$299</span>
        <span class="plan-price-period">/mo</span>
      </div>
      <div class="plan-price-old" data-monthly="&nbsp;" data-annual="$299/mo billed monthly"></div>
      <div class="plan-cap"><strong>Unlimited units.</strong> Connect your own domain. No "Powered by Tenantory" anywhere.</div>
      <ul class="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Everything in Pro</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><strong>Custom domain</strong> (rentblackbear.com) with automatic SSL</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Full white-label — no Tenantory branding</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Priority support (2-hour response SLA)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>API access &amp; webhooks</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Custom email domain for tenant communication</li>
      </ul>
      <div class="plan-cta">
        <a class="btn btn-ghost" href="onboarding.html">Launch my brand</a>
        <div class="plan-note">Cancel anytime · no card for trial</div>
      </div>
    </div>
  </section>

  <!-- Enterprise strip -->
  <section class="enterprise">
    <div class="ent-card">
      <div>
        <div class="ent-label">Enterprise</div>
        <div class="ent-title">Multi-market operators &amp; franchises</div>
        <div class="ent-sub">SSO (Okta, Google Workspace, Microsoft Entra), multi-workspace, dedicated customer success manager, custom onboarding, and SLA-backed uptime. You get a human on a call, not a chatbot.</div>
      </div>
      <div class="ent-actions">
        <div class="ent-price">From <strong>$1,499/mo</strong></div>
        <a class="btn btn-pink" href="mailto:sales@tenantory.com">
          Talk to sales
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- Guarantee -->
  <section class="guarantee">
    <div class="guar-card">
      <div class="guar-shield">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <div>
        <div class="guar-title">If Tenantory doesn't save you 10 hours in your first 30 paid days, we pay you $100.</div>
        <p class="guar-text">Start the 14-day trial without a card. After that, you have 30 days as a paying customer. If your time-saved report doesn't show at least <strong>10 hours saved</strong> vs. your prior workflow, email us one sentence and we'll refund every dollar plus wire you <strong>$100 for your time</strong>. Less than 2% of customers claim this. We're that confident.</p>
      </div>
    </div>
  </section>

  <!-- Replaces stack -->
  <section class="replaces">
    <div class="section-head">
      <div class="section-kicker">What you're replacing</div>
      <h2>The stack you're already paying for.</h2>
      <p>Tenantory replaces the tools below. Most PMs we talk to are paying for five of these, patched together with spreadsheets.</p>
    </div>
    <div class="rep-grid">
      <div class="rep-row"><div class="rep-name">AppFolio or Buildium<small>Property management software</small></div><div class="rep-price">$280/mo</div></div>
      <div class="rep-row"><div class="rep-name">QuickBooks + bookkeeper<small>Accounting &amp; tax prep</small></div><div class="rep-price">$590/mo</div></div>
      <div class="rep-row"><div class="rep-name">DocuSign<small>Lease e-signing</small></div><div class="rep-price">$45/mo</div></div>
      <div class="rep-row"><div class="rep-name">Squarespace / Wix<small>Your marketing website</small></div><div class="rep-price">$30/mo</div></div>
      <div class="rep-row"><div class="rep-name">SimpleTexting / Twilio<small>Tenant SMS notifications</small></div><div class="rep-price">$50/mo</div></div>
      <div class="rep-row"><div class="rep-name">Latchel / Property Meld<small>Maintenance coordinator</small></div><div class="rep-price">$50/mo</div></div>
      <div class="rep-row"><div class="rep-name">Investor reports (manual)<small>Your time at $50/hr × 4 hrs/mo</small></div><div class="rep-price">$200/mo</div></div>
      <div class="rep-row"><div class="rep-name">Rental application service<small>TransUnion SmartMove etc.</small></div><div class="rep-price">$50/mo</div></div>
    </div>
    <div class="rep-total">
      <div class="rep-total-side">
        <div class="rep-total-label">You pay today</div>
        <div class="rep-total-amount">$1,295<small style="font-size:15px;color:var(--text-muted);font-weight:500;">/mo</small></div>
      </div>
      <div class="rep-total-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
      <div class="rep-total-side right">
        <div class="rep-total-label">Pro plan</div>
        <div class="rep-total-amount">$99<small style="font-size:15px;color:inherit;font-weight:500;">/mo</small></div>
        <div class="rep-total-after">You save $14,352/yr</div>
      </div>
    </div>
  </section>

  <!-- Comparison -->
  <section class="compare-wrap">
    <div class="section-head">
      <div class="section-kicker">Compare plans</div>
      <h2>Every feature, every plan.</h2>
      <p>No hidden asterisks. What's on this table is what you get.</p>
    </div>
    <div class="compare">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Starter<span class="compare-col-sub">$39/mo</span></th>
            <th class="featured">Pro<span class="compare-col-sub">$99/mo · Founders</span></th>
            <th>Scale<span class="compare-col-sub">$299/mo</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-head"><td colspan="4">Portfolio</td></tr>
          <tr><td>Units</td><td><span class="cmp-val">Up to 5</span></td><td><span class="cmp-val">Up to 50</span></td><td><span class="cmp-val">Unlimited</span></td></tr>
          <tr><td>Team members</td><td><span class="cmp-val">1</span></td><td><span class="cmp-val">5</span></td><td><span class="cmp-val">Unlimited</span></td></tr>
          <tr><td>Workspaces (multi-entity)</td><td class="cmp-no">—</td><td class="cmp-no">—</td><td><span class="cmp-val">Unlimited</span></td></tr>

          <tr class="group-head"><td colspan="4">Tenant-facing</td></tr>
          <tr><td>Tenant portal</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Branded subdomain (yourname.tenantory.com)</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Custom domain (rentyourname.com)</td><td class="cmp-no">—</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Full white-label (no "Powered by Tenantory")</td><td class="cmp-no">—</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="4">Rent &amp; payments</td></tr>
          <tr><td>ACH transfers</td><td><span class="cmp-val">Free</span></td><td><span class="cmp-val">Free</span></td><td><span class="cmp-val">Free</span></td></tr>
          <tr><td>Card payments</td><td><span class="cmp-val">2.95%</span></td><td><span class="cmp-val">2.95%</span></td><td><span class="cmp-val">2.5%</span></td></tr>
          <tr><td>Autopay</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Late fee automation</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="4">Leasing</td></tr>
          <tr><td>Lease e-sign &amp; storage</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>State-specific lease templates</td><td><span class="cmp-val">1 state</span></td><td><span class="cmp-val">All states</span></td><td><span class="cmp-val">All states</span></td></tr>
          <tr><td>Application scoring (AI)</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Branded application page</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="4">Accounting &amp; reporting</td></tr>
          <tr><td>Income/expense ledger</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Schedule-E / tax pack export</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>1099 generation for vendors</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Investor reports (monthly PDF)</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Rent roll + occupancy analytics</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>

          <tr class="group-head"><td colspan="4">Operations</td></tr>
          <tr><td>Maintenance ticketing</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Vendor management + 1099 tracking</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>SMS notifications</td><td><span class="cmp-val">200/mo</span></td><td><span class="cmp-val">2,000/mo</span></td><td><span class="cmp-val">Unlimited</span></td></tr>

          <tr class="group-head"><td colspan="4">Support &amp; extras</td></tr>
          <tr><td>Founders' bonus stack ($3,850 value)</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Free data migration from AppFolio/Buildium</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>Email support</td><td><span class="cmp-val">48 hr</span></td><td><span class="cmp-val">Same-day</span></td><td><span class="cmp-val">2-hour SLA</span></td></tr>
          <tr><td>API access</td><td class="cmp-no">—</td><td class="cmp-no">—</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
          <tr><td>$100 time-back guarantee</td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td><td><span class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq" id="faq">
    <div class="section-head">
      <div class="section-kicker">Questions</div>
      <h2>Stuff people actually ask us.</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">Do I need a credit card to start? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">No. 14-day trial on every plan with no card required. You add payment only when you decide to stay. Nothing auto-charges.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What's the "Founders for life" deal? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">The first 100 PMs on Pro lock in $99/mo forever — even when we raise the price. We will raise it (likely to $149 within 6 months). If you're in the first 100 and you stay subscribed, you never pay more. 87 spots left as of today.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">How does the $100 guarantee work? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">14-day trial (no card). Then 30 days as a paying customer. After day 30, if your in-app "time saved" report doesn't show 10+ hours vs. your prior workflow, email us. We refund every dollar you've paid AND wire you $100 for wasting your time. Single-question email, no interrogation.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What happens if I outgrow my plan? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">You'll get a heads-up email at 80% of your cap (4/5 units on Starter, 40/50 on Pro). One click upgrades you on a prorated bill. If you added a unit that pushes you over, you get 30 days to stay at the lower price before we bump you.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Will you migrate my data from AppFolio / Buildium? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Yes — free on Pro and Scale. Export a CSV from your current system (we'll show you exactly how), send it over, and we map it into Tenantory for you. Typical migration is 48–72 hours. You keep using your current tool the whole time until we say go.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can I cancel anytime? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Yes. One click in Settings → Billing. No "talk to your account manager" nonsense. Your data exports to CSV on the way out.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Is my tenants' data safe? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Hosted on Vercel + Supabase (SOC 2 Type II). Payments via Stripe (PCI Level 1). Passwords are never stored — auth is via Clerk. Every workspace is isolated at the database level, so tenant data from one PM can't leak to another.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What makes this different from AppFolio? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Three things. (1) AppFolio charges $280/mo per portfolio and needs you to hit 50+ units. We start at $39 for 5 units. (2) Your tenants see "AppFolio." Our tenants see YOUR brand, your colors, your domain. (3) Tenantory was built by an operator running 15+ units — not by a VC who's never fixed a toilet. <a href="vs-appfolio.html" style="color:var(--blue);font-weight:600;text-decoration:underline;">Full side-by-side comparison &rarr;</a></div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>Start the 14-day trial. Lock $99 for life.</h2>
      <p>No credit card. No onboarding fee. Free data migration. If it doesn't save you 10 hours in the first 30 paid days, we refund you and wire $100 for your time.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Claim a Founders' spot
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="portal.html" target="_blank">
          See the tenant view
        </a>
      </div>
      <div class="cta-note">87 spots left · 13 claimed this week</div>
    </div>
  </section>

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
