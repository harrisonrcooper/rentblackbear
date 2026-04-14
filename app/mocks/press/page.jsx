"use client";

// Mock ported verbatim from ~/Desktop/tenantory/press.html.
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
      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
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
    .hero { padding: 72px 32px 40px; text-align: center; max-width: 920px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(40px, 5.4vw, 60px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.03;
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
    .hero-actions { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

    /* ===== Shared section frame ===== */
    .section { max-width: 1160px; margin: 0 auto; padding: 56px 32px; }
    .sec-head { margin-bottom: 28px; }
    .sec-eyebrow {
      font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 8px;
    }
    .sec-title { font-size: clamp(26px, 3vw, 34px); font-weight: 800; letter-spacing: -0.025em; color: var(--text); }
    .sec-sub { font-size: 15px; color: var(--text-muted); margin-top: 8px; max-width: 640px; }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);
    }

    /* ===== Fast facts ===== */
    .facts-card { padding: 8px; }
    .facts-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
    }
    .fact {
      padding: 22px 20px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);
    }
    .fact:nth-child(4n) { border-right: none; }
    .fact:nth-last-child(-n+4) { border-bottom: none; }
    .fact-key {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px;
    }
    .fact-val { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.35; }
    .fact-val span { color: var(--text-muted); font-weight: 500; }
    .fact-val.num { font-variant-numeric: tabular-nums; }

    /* ===== Boilerplate ===== */
    .boiler-tabs { display: inline-flex; background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 100px; padding: 4px; margin-bottom: 18px; }
    .boiler-tab {
      padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .boiler-tab.active { color: var(--text); background: var(--surface); box-shadow: var(--shadow-sm); }
    .boiler-panel { display: none; }
    .boiler-panel.active { display: block; }
    .boiler-card {
      padding: 28px 28px 20px; display: grid; grid-template-columns: 1fr auto; gap: 22px; align-items: flex-start;
    }
    .boiler-text {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 17px; line-height: 1.65; color: var(--text);
    }
    .copy-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
      border-radius: 100px; font-size: 12px; font-weight: 600;
      background: var(--blue-pale); color: var(--blue); border: 1px solid rgba(18,81,173,0.16);
      transition: all 0.15s ease;
    }
    .copy-btn:hover { background: var(--blue); color: #fff; }
    .copy-btn.done { background: var(--green-bg); color: var(--green-dark); border-color: rgba(30,169,124,0.2); }
    .copy-btn svg { width: 13px; height: 13px; }
    .boiler-meta { margin-top: 14px; padding: 10px 28px 22px; font-size: 12px; color: var(--text-faint); letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }
    .boiler-meta strong { color: var(--text-muted); }

    /* ===== Brand assets ===== */
    .assets-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .asset {
      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;
      background: var(--surface); display: flex; flex-direction: column;
      transition: all 0.15s ease;
    }
    .asset:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
    .asset-preview {
      height: 160px; display: flex; align-items: center; justify-content: center;
      border-bottom: 1px solid var(--border);
    }
    .asset-preview.bg-light { background: var(--surface-subtle); }
    .asset-preview.bg-dark { background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker)); border-bottom-color: transparent; }
    .asset-preview.bg-gradient { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); border-bottom-color: transparent; }
    .asset-lockup { display: flex; align-items: center; gap: 10px; color: var(--text); font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }
    .asset-lockup.light { color: #fff; }
    .asset-mark {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .asset-mark.solid-white { background: #fff; color: var(--navy-dark); }
    .asset-mark svg { width: 22px; height: 22px; }
    .asset-mark.lg { width: 64px; height: 64px; border-radius: 16px; }
    .asset-mark.lg svg { width: 36px; height: 36px; }
    .asset-body { padding: 16px 18px; }
    .asset-name { font-weight: 700; font-size: 14px; color: var(--text); }
    .asset-meta { font-size: 12px; color: var(--text-faint); margin-top: 2px; }
    .asset-actions { display: flex; gap: 6px; padding: 0 14px 14px; }
    .asset-btn {
      flex: 1; padding: 8px 10px; border-radius: 8px;
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      border: 1px solid var(--border); background: var(--surface);
      transition: all 0.15s ease; text-align: center;
    }
    .asset-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }

    /* ===== Palette ===== */
    .palette {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }
    .swatch {
      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;
      background: var(--surface);
    }
    .swatch-chip { height: 120px; display: flex; align-items: flex-end; padding: 14px; color: #fff; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
    .swatch-body { padding: 14px 16px 16px; }
    .swatch-name { font-weight: 700; font-size: 14px; color: var(--text); }
    .swatch-hex {
      font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
      font-size: 13px; color: var(--text-muted); margin-top: 4px;
      font-variant-numeric: tabular-nums;
    }
    .swatch-var { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* ===== Founder bio ===== */
    .founder {
      display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: flex-start;
      padding: 32px;
    }
    .founder-photo {
      width: 220px; height: 220px; border-radius: var(--radius-lg);
      background:
        radial-gradient(circle at 50% 38%, #d2dcf5 0 70px, transparent 71px),
        radial-gradient(circle at 50% 110%, #aab8df 0 150px, transparent 151px),
        linear-gradient(160deg, #eef3ff, #dbe4f8);
      border: 1px solid var(--border);
      position: relative; overflow: hidden;
      display: flex; align-items: flex-end; justify-content: center;
    }
    .founder-photo-label {
      position: absolute; bottom: 10px; left: 10px;
      background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: 100px;
      font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
    }
    .founder-name { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    .founder-role { font-size: 13px; color: var(--blue); font-weight: 600; margin-top: 2px; margin-bottom: 16px; letter-spacing: 0.02em; }
    .founder-bio { font-size: 15px; color: var(--text); line-height: 1.7; }
    .founder-socials { display: flex; gap: 10px; margin-top: 20px; }
    .founder-social {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 100px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 13px; font-weight: 600; color: var(--text);
      transition: all 0.15s ease;
    }
    .founder-social:hover { border-color: var(--blue); color: var(--blue); }
    .founder-social svg { width: 14px; height: 14px; }

    /* ===== Screenshots ===== */
    .shots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .shot {
      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;
      background: var(--surface); box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }
    .shot:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .shot-preview {
      height: 220px; position: relative; overflow: hidden;
      background: linear-gradient(160deg, var(--surface-subtle), var(--blue-softer));
      border-bottom: 1px solid var(--border);
    }
    .shot-chrome {
      position: absolute; top: 10px; left: 10px; display: flex; gap: 5px;
    }
    .shot-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,31,54,0.15); }
    .shot-dot:nth-child(1) { background: #ff6b6b; }
    .shot-dot:nth-child(2) { background: var(--gold); }
    .shot-dot:nth-child(3) { background: var(--green); }
    .shot-skeleton {
      position: absolute; inset: 36px 16px 16px;
      display: grid; gap: 8px; grid-template-rows: 22px repeat(4, 1fr);
    }
    .sk-bar { background: #fff; border: 1px solid var(--border); border-radius: 6px; }
    .sk-row { display: grid; grid-template-columns: 0.9fr 1fr 1fr; gap: 8px; }
    .sk-tile { background: #fff; border: 1px solid var(--border); border-radius: 8px; position: relative; overflow: hidden; }
    .sk-tile::after {
      content: ""; position: absolute; left: 10px; right: 10px; top: 10px; height: 6px; border-radius: 4px;
      background: linear-gradient(90deg, var(--blue-bright), var(--pink));
      opacity: 0.6;
    }
    .sk-tile.tall { grid-row: span 2; }
    .shot-body { padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; }
    .shot-name { font-weight: 700; color: var(--text); font-size: 14px; }
    .shot-meta { font-size: 12px; color: var(--text-faint); }

    /* ===== Featured in ===== */
    .featured {
      display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;
      padding: 28px; background: var(--surface-subtle); border-radius: var(--radius-xl);
      border: 1px solid var(--border);
    }
    .feat-cell {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      padding: 18px 10px; border-radius: var(--radius-lg);
      background: var(--surface); border: 1px solid var(--border);
      filter: grayscale(1); opacity: 0.72;
      transition: all 0.2s ease; text-align: center;
    }
    .feat-cell:hover { filter: grayscale(0); opacity: 1; transform: translateY(-2px); }
    .feat-name { font-weight: 800; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }
    .feat-tag { font-size: 10px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
    .featured-note { margin-top: 10px; font-size: 12px; color: var(--text-faint); text-align: center; font-style: italic; }

    /* ===== Mentions ===== */
    .mentions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .mention {
      padding: 22px; border: 1px solid var(--border); border-radius: var(--radius-xl);
      background: var(--surface); display: flex; flex-direction: column; gap: 10px;
      transition: all 0.15s ease;
    }
    .mention:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--border-strong); }
    .mention-pub { font-size: 11px; color: var(--pink); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
    .mention-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.4; }
    .mention-meta { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 10px; border-top: 1px dashed var(--border); font-size: 12px; color: var(--text-muted); font-variant-numeric: tabular-nums; }
    .mention-pill {
      padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 700;
      background: var(--surface-alt); color: var(--text-faint); letter-spacing: 0.08em; text-transform: uppercase;
    }

    /* ===== Contact ===== */
    .contact-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl); padding: 40px;
      display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 32px; align-items: center;
      position: relative; overflow: hidden;
    }
    .contact-card::after {
      content: ""; position: absolute; top: -80px; right: -80px;
      width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .contact-card > * { position: relative; z-index: 1; }
    .contact-title { font-size: 26px; font-weight: 800; letter-spacing: -0.025em; }
    .contact-sub { font-size: 14px; color: rgba(255,255,255,0.72); margin-top: 6px; max-width: 340px; }
    .contact-field-label { font-size: 10px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }
    .contact-field-val { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
    .contact-field-val a:hover { color: var(--pink); }
    .contact-field-meta { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    /* ===== Toast ===== */
    .toast {
      position: fixed; left: 50%; bottom: 32px; transform: translate(-50%, 20px);
      background: var(--text); color: #fff; padding: 11px 18px; border-radius: 100px;
      font-size: 13px; font-weight: 600; box-shadow: var(--shadow-lg);
      opacity: 0; pointer-events: none; transition: all 0.25s ease;
      display: inline-flex; align-items: center; gap: 8px;
      z-index: 100;
    }
    .toast.show { opacity: 1; transform: translate(-50%, 0); }
    .toast svg { width: 14px; height: 14px; color: var(--green); }

    @media (max-width: 980px) {
      .facts-grid { grid-template-columns: repeat(2, 1fr); }
      .fact:nth-child(4n) { border-right: 1px solid var(--border); }
      .fact:nth-child(2n) { border-right: none; }
      .fact:nth-last-child(-n+4) { border-bottom: 1px solid var(--border); }
      .fact:nth-last-child(-n+2) { border-bottom: none; }
      .assets-grid { grid-template-columns: repeat(2, 1fr); }
      .palette { grid-template-columns: repeat(2, 1fr); }
      .founder { grid-template-columns: 1fr; }
      .founder-photo { width: 100%; height: 240px; }
      .shots { grid-template-columns: 1fr; }
      .featured { grid-template-columns: repeat(2, 1fr); }
      .mentions { grid-template-columns: 1fr; }
      .contact-card { grid-template-columns: 1fr; padding: 28px; }
    }
    @media (max-width: 680px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .section { padding: 40px 16px; }
      .boiler-card { grid-template-columns: 1fr; }
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
      <a class="tb-nav-item" href="about.html">About</a>
      <a class="tb-nav-item active" href="press.html">Press</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16"/><path d="M9 4v16"/></svg>
      Press room
    </div>
    <h1>Press &amp; <em>media</em></h1>
    <p class="hero-sub">Welcome, journalists, podcasters, and partners. Everything you need to cover Tenantory is on this page, and the founder replies same-day on weekdays.</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-lg" href="mailto:press@tenantory.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        Email press@tenantory.com
      </a>
      <button class="btn btn-pink btn-lg" data-toast="Media kit download starting…">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
        Download media kit (ZIP)
      </button>
      <a class="btn btn-ghost btn-lg" href="mailto:press@tenantory.com?subject=Founder call request">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>
        Book a founder call
      </a>
    </div>
  </section>

  <!-- Fast facts -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Fast facts</div>
      <h2 class="sec-title">The short version</h2>
      <p class="sec-sub">Cleared for print. Ping press@tenantory.com if you need a number verified on deadline.</p>
    </div>
    <div class="card facts-card">
      <div class="facts-grid">
        <div class="fact">
          <div class="fact-key">Founded</div>
          <div class="fact-val">Feb 2026</div>
        </div>
        <div class="fact">
          <div class="fact-key">Founder</div>
          <div class="fact-val">Harrison Cooper</div>
        </div>
        <div class="fact">
          <div class="fact-key">HQ</div>
          <div class="fact-val">Huntsville, AL</div>
        </div>
        <div class="fact">
          <div class="fact-key">Funding</div>
          <div class="fact-val">Bootstrapped</div>
        </div>
        <div class="fact">
          <div class="fact-key">Customers</div>
          <div class="fact-val num">100+ <span>property managers</span></div>
        </div>
        <div class="fact">
          <div class="fact-key">Units managed</div>
          <div class="fact-val num">1,800+ <span>doors</span></div>
        </div>
        <div class="fact">
          <div class="fact-key">Category</div>
          <div class="fact-val">Property mgmt software</div>
        </div>
        <div class="fact">
          <div class="fact-key">Pricing</div>
          <div class="fact-val num">Starter $39 <span>/</span> Pro $99 <span>/</span> Scale $299</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Boilerplate -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Boilerplate</div>
      <h2 class="sec-title">Company description</h2>
      <p class="sec-sub">Three lengths, copy-paste ready. All current as of April 2026.</p>
    </div>
    <div class="boiler-tabs" role="tablist">
      <button class="boiler-tab active" data-panel="short">Short · 25 words</button>
      <button class="boiler-tab" data-panel="medium">Medium · 50 words</button>
      <button class="boiler-tab" data-panel="long">Long · 100 words</button>
    </div>

    <div class="card boiler-panel active" id="panel-short">
      <div class="boiler-card">
        <p class="boiler-text" id="text-short">Tenantory is the modern operating system for independent landlords and co-living operators. One app replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper.</p>
        <button class="copy-btn" data-copy="text-short">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          <span>Copy</span>
        </button>
      </div>
      <div class="boiler-meta"><strong>25 words</strong> &nbsp;·&nbsp; ideal for tickers, intros, and link previews</div>
    </div>

    <div class="card boiler-panel" id="panel-medium">
      <div class="boiler-card">
        <p class="boiler-text" id="text-medium">Tenantory is an all-in-one property management platform for independent landlords and co-living operators. It replaces AppFolio, QuickBooks, DocuSign, and bookkeeping services with a single app that handles listings, applications, leases, rent, maintenance, and move-outs. Founded in 2026 in Huntsville, Alabama, Tenantory is bootstrapped and operator-built.</p>
        <button class="copy-btn" data-copy="text-medium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          <span>Copy</span>
        </button>
      </div>
      <div class="boiler-meta"><strong>50 words</strong> &nbsp;·&nbsp; about-the-company blurbs, newsletter copy</div>
    </div>

    <div class="card boiler-panel" id="panel-long">
      <div class="boiler-card">
        <p class="boiler-text" id="text-long">Tenantory is the operating system for independent landlords and co-living operators. Founded in February 2026 in Huntsville, Alabama by operator Harrison Cooper, the bootstrapped software company replaces AppFolio, QuickBooks, DocuSign, and bookkeeping services with a single app purpose-built for small-to-mid portfolios. Tenantory covers listings, applications, screening, leases, rent collection, maintenance, bookkeeping, and move-outs, with tenant-facing tools that feel modern enough to recruit residents from Zillow. Plans start at $39/month for Starter, $99/month for Pro, and $299/month for Scale. Tenantory serves more than 100 property managers across the United States and is building in public toward a multi-tenant SaaS platform.</p>
        <button class="copy-btn" data-copy="text-long">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          <span>Copy</span>
        </button>
      </div>
      <div class="boiler-meta"><strong>100 words</strong> &nbsp;·&nbsp; press releases, longer editorial</div>
    </div>
  </section>

  <!-- Brand assets -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Brand assets</div>
      <h2 class="sec-title">Logo &amp; lockups</h2>
      <p class="sec-sub">Use the wordmark on white, the reversed lockup on dark, and the mark on its own only when space is tight. Please don't recolor.</p>
    </div>

    <div class="assets-grid">
      <div class="asset">
        <div class="asset-preview bg-light">
          <div class="asset-lockup">
            <div class="asset-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
            </div>
            Tenantory
          </div>
        </div>
        <div class="asset-body">
          <div class="asset-name">Wordmark · light</div>
          <div class="asset-meta">Primary lockup, horizontal</div>
        </div>
        <div class="asset-actions">
          <button class="asset-btn" data-toast="Wordmark PNG queued">Download PNG</button>
          <button class="asset-btn" data-toast="Wordmark SVG queued">Download SVG</button>
        </div>
      </div>

      <div class="asset">
        <div class="asset-preview bg-dark">
          <div class="asset-lockup light">
            <div class="asset-mark solid-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
            </div>
            Tenantory
          </div>
        </div>
        <div class="asset-body">
          <div class="asset-name">Wordmark · dark</div>
          <div class="asset-meta">Reversed for navy backgrounds</div>
        </div>
        <div class="asset-actions">
          <button class="asset-btn" data-toast="Reversed PNG queued">Download PNG</button>
          <button class="asset-btn" data-toast="Reversed SVG queued">Download SVG</button>
        </div>
      </div>

      <div class="asset">
        <div class="asset-preview bg-gradient">
          <div class="asset-mark lg solid-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
          </div>
        </div>
        <div class="asset-body">
          <div class="asset-name">Icon · on brand</div>
          <div class="asset-meta">App icon, avatars, favicons</div>
        </div>
        <div class="asset-actions">
          <button class="asset-btn" data-toast="Icon PNG queued">Download PNG</button>
          <button class="asset-btn" data-toast="Icon SVG queued">Download SVG</button>
        </div>
      </div>

      <div class="asset">
        <div class="asset-preview bg-light">
          <div class="asset-mark lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
          </div>
        </div>
        <div class="asset-body">
          <div class="asset-name">Icon · light</div>
          <div class="asset-meta">Use on white or cream backgrounds</div>
        </div>
        <div class="asset-actions">
          <button class="asset-btn" data-toast="Icon PNG queued">Download PNG</button>
          <button class="asset-btn" data-toast="Icon SVG queued">Download SVG</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Palette -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Color palette</div>
      <h2 class="sec-title">Brand colors</h2>
      <p class="sec-sub">Navy for depth, blue for action, pink for moments that matter, gold for the small stuff.</p>
    </div>
    <div class="palette">
      <div class="swatch">
        <div class="swatch-chip" style="background:#2F3E83;">Navy</div>
        <div class="swatch-body">
          <div class="swatch-name">Flagship Navy</div>
          <div class="swatch-hex">#2F3E83</div>
          <div class="swatch-var">--navy</div>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip" style="background:#1251AD;">Blue</div>
        <div class="swatch-body">
          <div class="swatch-name">Action Blue</div>
          <div class="swatch-hex">#1251AD</div>
          <div class="swatch-var">--blue</div>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip" style="background:#FF4998;">Pink</div>
        <div class="swatch-body">
          <div class="swatch-name">Moment Pink</div>
          <div class="swatch-hex">#FF4998</div>
          <div class="swatch-var">--pink</div>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip" style="background:#F5A623; color:#3a2a06;">Gold</div>
        <div class="swatch-body">
          <div class="swatch-name">Signal Gold</div>
          <div class="swatch-hex">#F5A623</div>
          <div class="swatch-var">--gold</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Founder -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Founder</div>
      <h2 class="sec-title">Meet Harrison Cooper</h2>
      <p class="sec-sub">Available for interviews, podcast appearances, and guest essays on bootstrapped SaaS and operator-built software.</p>
    </div>
    <div class="card founder">
      <div class="founder-photo">
        <div class="founder-photo-label">Headshot · high-res in kit</div>
      </div>
      <div>
        <div class="founder-name">Harrison Cooper</div>
        <div class="founder-role">Founder &amp; CEO, Tenantory</div>
        <p class="founder-bio">Harrison Cooper is a Huntsville, Alabama operator who runs 15+ co-living rooms under Black Bear Rentals and builds software for the landlords he drinks coffee with. After a decade of spreadsheets, duct-taped integrations, and AppFolio invoices, he started Tenantory in early 2026 to give small-to-mid portfolios the same operating tools the giants have. He writes openly about revenue, churn, and lessons learned as the company grows.</p>
        <div class="founder-socials">
          <a class="founder-social" href="https://x.com/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            @harrisoncooper
          </a>
          <a class="founder-social" href="https://linkedin.com/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.06c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.63 4.74 6.06V21h-4v-5.55c0-1.32-.02-3.02-1.84-3.02-1.85 0-2.13 1.44-2.13 2.92V21h-4V9z"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Screenshots -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Product shots</div>
      <h2 class="sec-title">Screenshots</h2>
      <p class="sec-sub">Quick previews below. Full-resolution PNGs (3×, up to 2560px) ship inside the media kit ZIP.</p>
    </div>
    <div class="shots">
      <div class="shot">
        <div class="shot-preview">
          <div class="shot-chrome"><span class="shot-dot"></span><span class="shot-dot"></span><span class="shot-dot"></span></div>
          <div class="shot-skeleton">
            <div class="sk-bar"></div>
            <div class="sk-row"><div class="sk-tile tall"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
            <div class="sk-row" style="grid-template-columns: 1fr 1fr 1fr 1fr;"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
            <div class="sk-row"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
          </div>
        </div>
        <div class="shot-body">
          <div class="shot-name">Admin dashboard</div>
          <div class="shot-meta">2560 × 1440</div>
        </div>
      </div>

      <div class="shot">
        <div class="shot-preview" style="background: linear-gradient(160deg, #fff, var(--blue-pale));">
          <div class="shot-chrome"><span class="shot-dot"></span><span class="shot-dot"></span><span class="shot-dot"></span></div>
          <div class="shot-skeleton">
            <div class="sk-bar"></div>
            <div class="sk-row" style="grid-template-columns: 1fr;"><div class="sk-tile"></div></div>
            <div class="sk-row"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
            <div class="sk-row" style="grid-template-columns: 1fr 1fr;"><div class="sk-tile"></div><div class="sk-tile"></div></div>
          </div>
        </div>
        <div class="shot-body">
          <div class="shot-name">Tenant portal</div>
          <div class="shot-meta">2560 × 1440</div>
        </div>
      </div>

      <div class="shot">
        <div class="shot-preview" style="background: linear-gradient(160deg, #fff, rgba(255,73,152,0.08));">
          <div class="shot-chrome"><span class="shot-dot"></span><span class="shot-dot"></span><span class="shot-dot"></span></div>
          <div class="shot-skeleton">
            <div class="sk-bar"></div>
            <div class="sk-row"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
            <div class="sk-row"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
            <div class="sk-row"><div class="sk-tile"></div><div class="sk-tile"></div><div class="sk-tile"></div></div>
          </div>
        </div>
        <div class="shot-body">
          <div class="shot-name">Vacancy listings</div>
          <div class="shot-meta">2560 × 1440</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured in -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">As featured in</div>
      <h2 class="sec-title">Where operators hear about us</h2>
      <p class="sec-sub">Publications and communities where Tenantory shows up most. Drop us a note if we should be on your list.</p>
    </div>
    <div class="featured">
      <div class="feat-cell">
        <div class="feat-name">Indie Hackers</div>
        <div class="feat-tag">Community</div>
      </div>
      <div class="feat-cell">
        <div class="feat-name">Product Hunt</div>
        <div class="feat-tag">Launch</div>
      </div>
      <div class="feat-cell">
        <div class="feat-name">BiggerPockets</div>
        <div class="feat-tag">Investing</div>
      </div>
      <div class="feat-cell">
        <div class="feat-name">PropertyCast</div>
        <div class="feat-tag">Podcast</div>
      </div>
      <div class="feat-cell">
        <div class="feat-name">The Residential</div>
        <div class="feat-tag">Newsletter</div>
      </div>
      <div class="feat-cell">
        <div class="feat-name">Landlord Daily</div>
        <div class="feat-tag">Trade</div>
      </div>
    </div>
    <p class="featured-note">Hover to restore color. Logos shown with permission or pending.</p>
  </section>

  <!-- Mentions -->
  <section class="section">
    <div class="sec-head">
      <div class="sec-eyebrow">Recent mentions</div>
      <h2 class="sec-title">Press &amp; podcasts</h2>
      <p class="sec-sub">We're a young company; the archive is short on purpose. Want to be the first write-up? We'd love that.</p>
    </div>
    <div class="mentions">
      <div class="mention">
        <div class="mention-pub">Indie Hackers</div>
        <div class="mention-title">How an Alabama operator is rebuilding property management from the roof down</div>
        <div class="mention-meta">
          <span>Coming soon</span>
          <span class="mention-pill">Interview</span>
        </div>
      </div>
      <div class="mention">
        <div class="mention-pub">PropertyCast podcast</div>
        <div class="mention-title">Episode #312 &mdash; The operator-built software wave (with Harrison Cooper)</div>
        <div class="mention-meta">
          <span>Coming soon</span>
          <span class="mention-pill">Podcast</span>
        </div>
      </div>
      <div class="mention">
        <div class="mention-pub">BiggerPockets</div>
        <div class="mention-title">Tooling up: the new stack replacing AppFolio for portfolios under 500 doors</div>
        <div class="mention-meta">
          <span>Coming soon</span>
          <span class="mention-pill">Feature</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="section">
    <div class="contact-card">
      <div>
        <div class="contact-title">Talk to a human</div>
        <p class="contact-sub">Harrison answers the press inbox personally. Urgent requests ring through to his cell.</p>
      </div>
      <div>
        <div class="contact-field-label">Email</div>
        <div class="contact-field-val"><a href="mailto:press@tenantory.com">press@tenantory.com</a></div>
        <div class="contact-field-meta">Same-day reply, Mon–Fri</div>
      </div>
      <div>
        <div class="contact-field-label">Urgent &amp; on deadline</div>
        <div class="contact-field-val"><a href="tel:+12569995500">+1 (256) 999-5500</a></div>
        <div class="contact-field-meta">Text preferred after 6pm CT</div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="about.html">About</a>
      <a href="press.html">Press</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  <!-- Toast -->
  <div class="toast" id="toast" role="status" aria-live="polite">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toast-msg">Done</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
