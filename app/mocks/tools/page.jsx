"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tools.html.
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
    input, select { font-family: inherit; }

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
      max-width: 880px; margin: 0 auto 18px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 680px; margin: 0 auto 8px; line-height: 1.55;
    }
    .hero-meta {
      margin-top: 22px; display: inline-flex; align-items: center; gap: 16px;
      font-size: 13px; color: var(--text-faint); flex-wrap: wrap; justify-content: center;
    }
    .hero-meta span { display: inline-flex; align-items: center; gap: 6px; }
    .hero-meta svg { width: 14px; height: 14px; color: var(--green-dark); }

    /* ===== Section heads ===== */
    .section-head { text-align: center; margin-bottom: 40px; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 640px; margin: 0 auto; }

    /* ===== Calculator grid ===== */
    .tools-grid {
      max-width: 1200px; margin: 24px auto 0;
      padding: 0 32px;
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    }
    .tool {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 28px;
      display: flex; flex-direction: column;
      transition: all 0.2s ease;
      position: relative;
    }
    .tool:hover { box-shadow: var(--shadow-lg); border-color: var(--border-strong); }

    .tool-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 14px; margin-bottom: 4px;
    }
    .tool-title-wrap { display: flex; align-items: center; gap: 12px; }
    .tool-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .tool-icon svg { width: 20px; height: 20px; }
    .tool-title { font-weight: 800; font-size: 17px; letter-spacing: -0.01em; color: var(--text); }
    .tool-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

    .tool-tip {
      position: relative;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; cursor: help; flex-shrink: 0;
      border: 1px solid var(--border);
    }
    .tool-tip:hover { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-bright); }
    .tool-tip .tip-body {
      position: absolute; top: calc(100% + 8px); right: -4px;
      width: 260px; padding: 12px 14px;
      background: var(--navy-darker); color: #fff;
      border-radius: 10px; font-size: 12px; line-height: 1.5; font-weight: 500;
      opacity: 0; pointer-events: none; transform: translateY(-4px);
      transition: all 0.15s ease; z-index: 10; text-align: left;
      box-shadow: var(--shadow-lg);
    }
    .tool-tip:hover .tip-body, .tool-tip:focus .tip-body { opacity: 1; pointer-events: auto; transform: translateY(0); }
    .tool-tip .tip-body::before {
      content: ""; position: absolute; bottom: 100%; right: 8px;
      border: 6px solid transparent; border-bottom-color: var(--navy-darker);
    }

    .tool-body { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; flex: 1; }

    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label {
      font-size: 12px; font-weight: 700; color: var(--text);
      letter-spacing: 0.02em; text-transform: uppercase;
    }
    .input-wrap {
      position: relative; display: flex; align-items: center;
      background: var(--surface-subtle);
      border: 1px solid var(--border); border-radius: 10px;
      transition: all 0.15s ease;
    }
    .input-wrap:focus-within { border-color: var(--blue-bright); background: var(--surface); box-shadow: 0 0 0 3px rgba(22,101,216,0.14); }
    .input-prefix, .input-suffix {
      font-size: 13px; color: var(--text-faint); font-weight: 600;
      padding: 0 12px; flex-shrink: 0;
    }
    .input-prefix { border-right: 1px solid var(--border); }
    .input-suffix { border-left: 1px solid var(--border); }
    .field input {
      width: 100%; padding: 11px 12px; font-size: 15px; font-weight: 600;
      color: var(--text); background: transparent; border: none; outline: none;
      font-variant-numeric: tabular-nums;
    }
    .field input::placeholder { color: var(--text-faint); font-weight: 500; }

    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    /* ===== Output panel ===== */
    .tool-output {
      margin-top: 18px; padding: 20px;
      border-radius: var(--radius-lg);
      background: var(--surface-alt);
      border: 1px solid var(--border);
      transition: all 0.25s ease;
    }
    .tool-output.state-green { background: var(--green-bg); border-color: rgba(30,169,124,0.35); }
    .tool-output.state-amber { background: rgba(245,166,35,0.12); border-color: rgba(245,166,35,0.4); }
    .tool-output.state-red { background: rgba(214,69,69,0.1); border-color: rgba(214,69,69,0.35); }

    .out-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
    .out-row + .out-row { margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(26,31,54,0.08); }
    .out-label { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .out-value {
      font-size: 28px; font-weight: 900; color: var(--text);
      font-variant-numeric: tabular-nums; letter-spacing: -0.02em; line-height: 1;
    }
    .out-value.sm { font-size: 18px; }
    .state-green .out-value { color: var(--green-dark); }
    .state-amber .out-value { color: #a5720f; }
    .state-red .out-value { color: var(--red); }

    .verdict {
      margin-top: 14px; padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px; font-weight: 600; line-height: 1.45;
      color: var(--text);
      background: rgba(255,255,255,0.5);
    }
    .state-green .verdict { background: rgba(255,255,255,0.55); color: #0c5a3e; }
    .state-amber .verdict { background: rgba(255,255,255,0.6); color: #7a520a; }
    .state-red .verdict { background: rgba(255,255,255,0.6); color: #8a2929; }

    .tool-foot {
      margin-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;
    }
    .tool-foot-note { font-size: 11px; color: var(--text-faint); }
    .btn-save {
      padding: 9px 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.03em;
      background: var(--blue-pale); color: var(--blue);
      border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s ease; border: none;
    }
    .btn-save:hover { background: var(--blue); color: #fff; }
    .btn-save svg { width: 14px; height: 14px; }

    /* ===== Toast ===== */
    .toast {
      position: fixed; bottom: 24px; left: 50%; transform: translate(-50%, 80px);
      background: var(--navy-darker); color: #fff;
      padding: 12px 18px; border-radius: 100px;
      font-size: 13px; font-weight: 600;
      box-shadow: var(--shadow-xl);
      display: flex; align-items: center; gap: 10px;
      opacity: 0; transition: all 0.25s ease; z-index: 100;
      pointer-events: none;
    }
    .toast.show { transform: translate(-50%, 0); opacity: 1; }
    .toast svg { width: 16px; height: 16px; color: var(--pink); }

    /* ===== Cross-sell ===== */
    .cross-sell {
      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;
    }
    .cross-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl); padding: 48px;
      display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
      position: relative; overflow: hidden;
    }
    .cross-card::after {
      content: ""; position: absolute; top: -60px; right: -80px;
      width: 340px; height: 340px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .cross-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; position: relative; z-index: 1; }
    .cross-title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; position: relative; z-index: 1; line-height: 1.15; }
    .cross-sub { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 22px; position: relative; z-index: 1; line-height: 1.55; }
    .cross-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; position: relative; z-index: 1; }
    .cross-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.9); }
    .cross-list li svg { width: 16px; height: 16px; color: var(--pink); flex-shrink: 0; margin-top: 2px; }
    .cross-actions { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
    .cross-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cross-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }

    /* Mockup inside cross-sell */
    .mockup {
      background: #fff; border-radius: 14px; padding: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.35);
      position: relative; z-index: 1;
      color: var(--text);
    }
    .mock-head {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 12px; border-bottom: 1px solid var(--border);
      margin-bottom: 14px;
    }
    .mock-title { font-size: 13px; font-weight: 800; letter-spacing: -0.01em; }
    .mock-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 100px; background: var(--blue-pale); color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; }
    .mock-row {
      display: grid; grid-template-columns: 1.6fr 1fr 0.9fr; gap: 10px;
      padding: 10px 4px; border-bottom: 1px solid var(--surface-alt);
      align-items: center;
    }
    .mock-row:last-child { border-bottom: none; }
    .mock-addr { font-size: 13px; font-weight: 700; color: var(--text); }
    .mock-addr small { display: block; font-size: 11px; color: var(--text-faint); font-weight: 500; margin-top: 2px; }
    .mock-cap {
      font-size: 13px; font-weight: 800; font-variant-numeric: tabular-nums;
      letter-spacing: -0.01em;
    }
    .mock-badge {
      font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px;
      text-align: center; letter-spacing: 0.04em; text-transform: uppercase;
    }
    .mock-badge.good { background: var(--green-bg); color: var(--green-dark); }
    .mock-badge.mid { background: rgba(245,166,35,0.14); color: #a5720f; }
    .mock-badge.bad { background: rgba(214,69,69,0.12); color: var(--red); }

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

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .tools-grid, .cross-sell, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .tools-grid { grid-template-columns: 1fr; }
      .cross-card { grid-template-columns: 1fr; padding: 36px 24px; gap: 30px; }
      .cta-card { padding: 36px 22px; }
      .field-row { grid-template-columns: 1fr; }
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
      <a class="tb-nav-item" href="stories.html">Stories</a>
      <a class="tb-nav-item active" href="tools.html">Tools</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      Free forever · no signup
    </div>
    <h1>Free tools for people who <em>own rentals</em>.</h1>
    <p class="hero-sub">Four calculators we built for ourselves to decide which houses to buy and which tenants to approve. Same math that powers Tenantory's internal analytics. Given away because gatekeeping a cap rate formula is embarrassing.</p>
    <div class="hero-meta">
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        No email required
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Numbers update as you type
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Works on your phone
      </span>
    </div>
  </section>

  <!-- Tools -->
  <section class="tools-grid">

    <!-- 1. Cap rate -->
    <div class="tool" id="cap">
      <div class="tool-head">
        <div class="tool-title-wrap">
          <div class="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
          </div>
          <div>
            <div class="tool-title">Cap rate calculator</div>
            <div class="tool-sub">Net operating income ÷ purchase price.</div>
          </div>
        </div>
        <div class="tool-tip" tabindex="0">?
          <div class="tip-body">Under 6% is thin — you're buying appreciation, not cash flow. 6–8% is a normal buy in a decent market. 8%+ is where real landlords live. Goes by market: 5% in San Diego isn't the same sin as 5% in Huntsville.</div>
        </div>
      </div>
      <div class="tool-body">
        <div class="field">
          <label class="field-label" for="cap-price">Purchase price</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="cap-price" value="185000" min="0" step="1000" inputmode="decimal">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="cap-rent">Annual rent (gross)</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="cap-rent" value="22800" min="0" step="100" inputmode="decimal">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="cap-exp">Annual expenses (tax, insurance, maint, vacancy)</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="cap-exp" value="6800" min="0" step="100" inputmode="decimal">
          </div>
        </div>

        <div class="tool-output" id="cap-out">
          <div class="out-row">
            <div>
              <div class="out-label">Cap rate</div>
              <div class="verdict" id="cap-verdict" style="margin-top:6px; padding:0; background:transparent;">Calculating…</div>
            </div>
            <div class="out-value" id="cap-value">—</div>
          </div>
          <div class="out-row">
            <div class="out-label">Net operating income</div>
            <div class="out-value sm" id="cap-noi">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Cash-on-cash -->
    <div class="tool" id="coc">
      <div class="tool-head">
        <div class="tool-title-wrap">
          <div class="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div class="tool-title">Cash-on-cash return</div>
            <div class="tool-sub">What your actual cash is earning, after the mortgage.</div>
          </div>
        </div>
        <div class="tool-tip" tabindex="0">?
          <div class="tip-body">Cap rate ignores financing. Cash-on-cash tells you what your down payment is really making each year. Anything under 6% and you'd be better off in an index fund. 8–12% is healthy. Above 15% usually means you lied on expenses.</div>
        </div>
      </div>
      <div class="tool-body">
        <div class="field">
          <label class="field-label" for="coc-cash">Total cash in (down + closing + rehab)</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="coc-cash" value="48000" min="0" step="500" inputmode="decimal">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="coc-rent">Monthly rent</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="coc-rent" value="1900" min="0" step="25" inputmode="decimal">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label" for="coc-pi">Mortgage (P&amp;I)</label>
            <div class="input-wrap">
              <span class="input-prefix">$</span>
              <input type="number" id="coc-pi" value="980" min="0" step="10" inputmode="decimal">
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="coc-tax">Tax + insurance</label>
            <div class="input-wrap">
              <span class="input-prefix">$</span>
              <input type="number" id="coc-tax" value="320" min="0" step="10" inputmode="decimal">
            </div>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label" for="coc-vac">Vacancy %</label>
            <div class="input-wrap">
              <input type="number" id="coc-vac" value="8" min="0" max="100" step="1" inputmode="decimal">
              <span class="input-suffix">%</span>
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="coc-maint">Maintenance %</label>
            <div class="input-wrap">
              <input type="number" id="coc-maint" value="8" min="0" max="100" step="1" inputmode="decimal">
              <span class="input-suffix">%</span>
            </div>
          </div>
        </div>

        <div class="tool-output" id="coc-out">
          <div class="out-row">
            <div>
              <div class="out-label">Annual cash-on-cash</div>
              <div class="verdict" id="coc-verdict" style="margin-top:6px; padding:0; background:transparent;">Calculating…</div>
            </div>
            <div class="out-value" id="coc-value">—</div>
          </div>
          <div class="out-row">
            <div class="out-label">Monthly cash flow</div>
            <div class="out-value sm" id="coc-monthly">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 1% rule -->
    <div class="tool" id="onepct">
      <div class="tool-head">
        <div class="tool-title-wrap">
          <div class="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
          </div>
          <div>
            <div class="tool-title">1% rule checker</div>
            <div class="tool-sub">Monthly rent ≥ 1% of purchase price.</div>
          </div>
        </div>
        <div class="tool-tip" tabindex="0">?
          <div class="tip-body">Old-school back-of-napkin test. A $150k house should rent for $1,500+ to cash flow. The rule is a filter, not a verdict — nothing under 0.7% pencils, anything over 1.2% deserves a phone call today.</div>
        </div>
      </div>
      <div class="tool-body">
        <div class="field">
          <label class="field-label" for="one-price">Purchase price</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="one-price" value="165000" min="0" step="1000" inputmode="decimal">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="one-rent">Monthly rent</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="one-rent" value="1650" min="0" step="25" inputmode="decimal">
          </div>
        </div>

        <div class="tool-output" id="one-out">
          <div class="out-row">
            <div>
              <div class="out-label">Rent-to-price ratio</div>
              <div class="verdict" id="one-verdict" style="margin-top:6px; padding:0; background:transparent;">Calculating…</div>
            </div>
            <div class="out-value" id="one-value">—</div>
          </div>
          <div class="out-row">
            <div class="out-label">Rent needed to hit 1%</div>
            <div class="out-value sm" id="one-target">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Rent affordability -->
    <div class="tool" id="afford">
      <div class="tool-head">
        <div class="tool-title-wrap">
          <div class="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <div class="tool-title">Tenant rent affordability</div>
            <div class="tool-sub">Rent-to-income ratio for applicant screening.</div>
          </div>
        </div>
        <div class="tool-tip" tabindex="0">?
          <div class="tip-body">Industry standard is 3x rent. Under 33% is safe. 33–40% is stretched and they'll be late when the car breaks down. Over 50% is a red flag — they'll either skip or ask you for relief in month three.</div>
        </div>
      </div>
      <div class="tool-body">
        <div class="field">
          <label class="field-label" for="aff-income">Applicant monthly gross income</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="aff-income" value="5400" min="0" step="100" inputmode="decimal">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="aff-rent">Monthly rent</label>
          <div class="input-wrap">
            <span class="input-prefix">$</span>
            <input type="number" id="aff-rent" value="1750" min="0" step="25" inputmode="decimal">
          </div>
        </div>

        <div class="tool-output" id="aff-out">
          <div class="out-row">
            <div>
              <div class="out-label">Rent-to-income</div>
              <div class="verdict" id="aff-verdict" style="margin-top:6px; padding:0; background:transparent;">Calculating…</div>
            </div>
            <div class="out-value" id="aff-value">—</div>
          </div>
          <div class="out-row">
            <div class="out-label">Income multiple</div>
            <div class="out-value sm" id="aff-mult">—</div>
          </div>
        </div>

        <div class="tool-foot">
          <div class="tool-foot-note">Save this to the applicant's profile in Tenantory.</div>
          <button class="btn-save" id="aff-save">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save to applicant
          </button>
        </div>
      </div>
    </div>

  </section>

  <!-- Cross-sell -->
  <section class="cross-sell">
    <div class="cross-card">
      <div>
        <div class="cross-label">The shameless cross-sell</div>
        <div class="cross-title">These calculators are nice. Running them on your whole portfolio is nicer.</div>
        <div class="cross-sub">Inside Tenantory, every property gets a live cap rate, cash-on-cash, and occupancy score — updated every time rent hits the bank. Stop opening a spreadsheet to know if your rentals are working.</div>
        <ul class="cross-list">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Cap rate per property, auto-updated from your ledger
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Applicant screening with affordability built in
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Monthly investor report that does the math for you
          </li>
        </ul>
        <div class="cross-actions">
          <a class="btn btn-pink" href="onboarding.html">
            Start free trial
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="pricing.html">See pricing</a>
        </div>
      </div>

      <div class="mockup">
        <div class="mock-head">
          <div class="mock-title">Portfolio · Rent roll</div>
          <div class="mock-pill">Live</div>
        </div>
        <div class="mock-row">
          <div class="mock-addr">908 Lee Dr NW<small>Huntsville, AL · SFR</small></div>
          <div class="mock-cap">9.2%</div>
          <div class="mock-badge good">Strong</div>
        </div>
        <div class="mock-row">
          <div class="mock-addr">3026 Turf Ave NW<small>Huntsville, AL · SFR</small></div>
          <div class="mock-cap">7.4%</div>
          <div class="mock-badge mid">Okay</div>
        </div>
        <div class="mock-row">
          <div class="mock-addr">221 Bradford Dr<small>Huntsville, AL · Duplex</small></div>
          <div class="mock-cap">11.1%</div>
          <div class="mock-badge good">Strong</div>
        </div>
        <div class="mock-row">
          <div class="mock-addr">44 Holmes Ave SE<small>Huntsville, AL · SFR</small></div>
          <div class="mock-cap">5.2%</div>
          <div class="mock-badge bad">Thin</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq" id="faq">
    <div class="section-head">
      <div class="section-kicker">Tool FAQ</div>
      <h2>Quick answers, real numbers.</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">How do you calculate cap rate? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Net Operating Income (annual rent minus operating expenses — tax, insurance, maintenance, vacancy, management fees, but NOT the mortgage) divided by purchase price. That's it. If somebody quotes you a cap rate that includes debt service, they're pitching you, not teaching you.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Is the 1% rule still valid? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">As a filter, yes. As a verdict, no. In most Sun Belt markets you can still hit 1% on smaller SFRs. In Denver, Austin, or coastal California, 0.6% is a "great" deal and you're buying for appreciation. Use it to eliminate obvious losers in 5 seconds — then do the real math.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What's a realistic vacancy rate? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">In a stable market with a decent property, pencil 5–8%. In a rougher class-C neighborhood or a college town, 10%+ is honest. If you're modeling 0% vacancy you're lying to yourself — every unit turns, and every turn has 2–4 weeks of empty.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What income multiple should I require on applicants? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">3x gross monthly rent is the industry standard and what Fair Housing attorneys recommend applying uniformly. 2.5x in hot rental markets is defensible if you're also requiring a cosigner or extra deposit. Below 2x is usually a late-rent story with extra steps.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can I save these results? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Not on this page — these calculators are stateless on purpose. Bookmark the page, or if you want a cap rate and affordability score attached to every property and applicant in your portfolio, that's what Tenantory is for. Start the 14-day trial, no card.</div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>Put the math on autopilot.</h2>
      <p>Tenantory runs these calculators on your whole portfolio, every day, automatically — plus it collects the rent, signs the leases, and ships the investor reports. 14-day free trial. No credit card.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
      <div class="cta-note">No credit card · Free data migration on Pro</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
      <a href="tools.html">Tools</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  <!-- Toast -->
  <div class="toast" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toast-msg">Saved.</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
