"use client";

// Mock ported verbatim from ~/Desktop/tenantory/docs.html.
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
    input { font-family: inherit; }

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
    .hero {
      padding: 80px 32px 48px; text-align: center;
      background: radial-gradient(ellipse at top, var(--blue-softer) 0%, transparent 60%);
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 820px; margin: 0 auto 16px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 620px; margin: 0 auto 32px; line-height: 1.55;
    }
    .search-wrap {
      max-width: 680px; margin: 0 auto;
      position: relative;
    }
    .search-input {
      width: 100%; padding: 20px 56px 20px 56px;
      border: 1.5px solid var(--border); border-radius: 100px;
      font-size: 16px; color: var(--text); background: var(--surface);
      box-shadow: var(--shadow);
      transition: all 0.15s ease;
    }
    .search-input:focus { outline: none; border-color: var(--blue-bright); box-shadow: 0 10px 30px rgba(22,101,216,0.16); }
    .search-input::placeholder { color: var(--text-faint); }
    .search-icon {
      position: absolute; left: 22px; top: 50%; transform: translateY(-50%);
      color: var(--text-faint); width: 20px; height: 20px;
      pointer-events: none;
    }
    .search-clear {
      position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
      width: 28px; height: 28px; border-radius: 50%;
      display: none; align-items: center; justify-content: center;
      background: var(--surface-alt); color: var(--text-muted);
    }
    .search-clear:hover { background: var(--border); color: var(--text); }
    .search-clear svg { width: 14px; height: 14px; }
    .search-wrap.has-value .search-clear { display: flex; }
    .search-meta {
      display: none; margin-top: 14px; font-size: 13px; color: var(--text-muted);
    }
    .search-wrap.has-value + .search-meta { display: block; }

    /* ===== Quick links ===== */
    .quick-wrap { max-width: 1200px; margin: 0 auto; padding: 48px 32px 0; }
    .quick-title {
      font-size: 12px; font-weight: 700; color: var(--text-faint);
      letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 14px;
    }
    .quick-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
    }
    .quick-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      display: flex; align-items: flex-start; gap: 14px;
      transition: all 0.15s ease;
    }
    .quick-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-2px); }
    .quick-ico {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
    }
    .quick-ico svg { width: 18px; height: 18px; }
    .quick-body { flex: 1; min-width: 0; }
    .quick-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;
    }
    .quick-ttl { font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.35; letter-spacing: -0.01em; }

    /* ===== Section header ===== */
    .section-wrap { max-width: 1200px; margin: 0 auto; padding: 72px 32px 0; }
    .section-head {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 28px; gap: 20px; flex-wrap: wrap;
    }
    .section-head h2 {
      font-size: 30px; font-weight: 800; letter-spacing: -0.025em; color: var(--text);
    }
    .section-sub { font-size: 15px; color: var(--text-muted); margin-top: 4px; }
    .section-meta { font-size: 13px; color: var(--text-muted); }
    .section-meta strong { color: var(--text); font-weight: 700; }

    /* ===== Category grid ===== */
    .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
    .cat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px;
      display: flex; flex-direction: column; gap: 14px;
      transition: all 0.2s ease;
      position: relative;
    }
    .cat-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-3px); }
    .cat-head {
      display: flex; align-items: center; gap: 12px;
    }
    .cat-ico {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .cat-ico svg { width: 20px; height: 20px; }
    .cat-ico.c-blue { background: var(--blue-pale); color: var(--blue); }
    .cat-ico.c-pink { background: var(--pink-bg); color: #c21a6a; }
    .cat-ico.c-green { background: var(--green-bg); color: var(--green-dark); }
    .cat-ico.c-gold { background: rgba(245,166,35,0.14); color: #b77500; }
    .cat-ico.c-navy { background: rgba(47,62,131,0.1); color: var(--navy); }
    .cat-ico.c-red { background: rgba(214,69,69,0.1); color: var(--red); }
    .cat-ico.c-purple { background: rgba(124,77,255,0.12); color: #5e35d1; }
    .cat-ico.c-teal { background: rgba(30,169,124,0.12); color: var(--green-dark); }
    .cat-name { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; color: var(--text); }
    .cat-count { font-size: 12px; color: var(--text-muted); margin-top: 2px; font-weight: 500; }
    .cat-list {
      display: flex; flex-direction: column; gap: 2px;
      padding-top: 12px; border-top: 1px solid var(--border);
    }
    .cat-article {
      display: flex; align-items: flex-start; gap: 8px;
      padding: 8px 0; font-size: 13.5px; color: var(--text);
      line-height: 1.45; transition: color 0.15s ease;
    }
    .cat-article:hover { color: var(--blue); }
    .cat-article svg {
      width: 12px; height: 12px; flex-shrink: 0; margin-top: 4px; color: var(--text-faint);
    }
    .cat-all {
      margin-top: auto; padding-top: 10px;
      font-size: 13px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .cat-all svg { width: 12px; height: 12px; transition: transform 0.15s ease; }
    .cat-card:hover .cat-all svg { transform: translateX(3px); }

    /* ===== Popular articles (horizontal scroll) ===== */
    .pop-wrap {
      max-width: 1200px; margin: 0 auto; padding: 72px 0 0;
    }
    .pop-head { padding: 0 32px; margin-bottom: 28px; }
    .pop-scroller {
      display: flex; gap: 16px;
      overflow-x: auto;
      padding: 6px 32px 24px;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
    }
    .pop-scroller::-webkit-scrollbar { height: 8px; }
    .pop-scroller::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 100px; }
    .pop-card {
      flex: 0 0 340px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      scroll-snap-align: start;
      display: flex; flex-direction: column; gap: 10px;
      transition: all 0.15s ease;
    }
    .pop-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-2px); }
    .pop-tag {
      align-self: flex-start;
      font-size: 10px; font-weight: 700; color: var(--text-muted);
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 4px 10px; border-radius: 100px;
      background: var(--surface-alt); border: 1px solid var(--border);
    }
    .pop-ttl { font-size: 16px; font-weight: 700; line-height: 1.35; letter-spacing: -0.015em; color: var(--text); }
    .pop-sum { font-size: 13.5px; color: var(--text-muted); line-height: 1.5; flex: 1; }
    .pop-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 10px; border-top: 1px solid var(--border);
      font-size: 12px; color: var(--text-faint);
    }
    .pop-read { display: inline-flex; align-items: center; gap: 5px; }
    .pop-read svg { width: 12px; height: 12px; }
    .pop-link { font-size: 12px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 3px; }
    .pop-link svg { width: 11px; height: 11px; }

    /* ===== Contact callout ===== */
    .help-wrap { max-width: 1200px; margin: 72px auto 0; padding: 0 32px; }
    .help-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl); padding: 48px 40px;
      position: relative; overflow: hidden;
    }
    .help-card::after {
      content: ""; position: absolute; top: -80px; right: -80px;
      width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .help-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; position: relative; z-index: 1; }
    .help-ttl { font-size: 30px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px; position: relative; z-index: 1; }
    .help-sub { font-size: 15px; color: rgba(255,255,255,0.72); max-width: 540px; margin-bottom: 32px; position: relative; z-index: 1; }
    .help-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      position: relative; z-index: 1;
    }
    .help-ch {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      border-radius: var(--radius-lg); padding: 22px;
      display: flex; flex-direction: column; gap: 10px;
      transition: all 0.15s ease;
    }
    .help-ch:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
    .help-ch-ico {
      width: 38px; height: 38px; border-radius: 10px;
      background: rgba(255,73,152,0.18); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
    }
    .help-ch-ico svg { width: 18px; height: 18px; }
    .help-ch-ttl { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
    .help-ch-sub { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.45; }
    .help-ch-act {
      margin-top: auto; padding-top: 6px;
      font-size: 12px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.1em;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .help-ch-act svg { width: 12px; height: 12px; }

    .help-form {
      display: flex; flex-direction: column; gap: 8px;
    }
    .help-form input, .help-form textarea {
      width: 100%; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; padding: 10px 12px;
      font-size: 13px; color: #fff; resize: vertical;
    }
    .help-form input::placeholder, .help-form textarea::placeholder { color: rgba(255,255,255,0.45); }
    .help-form input:focus, .help-form textarea:focus { outline: none; border-color: var(--pink); }
    .help-form textarea { min-height: 60px; }
    .help-form button {
      background: var(--pink); color: #fff; border-radius: 8px;
      padding: 10px 12px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: all 0.15s ease;
    }
    .help-form button:hover { background: #e63882; }

    /* ===== Changelog strip ===== */
    .chg-wrap { max-width: 1200px; margin: 48px auto 0; padding: 0 32px; }
    .chg-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px 28px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; flex-wrap: wrap;
    }
    .chg-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 260px; }
    .chg-ico {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      background: var(--pink-bg); color: #c21a6a;
      display: flex; align-items: center; justify-content: center;
    }
    .chg-ico svg { width: 20px; height: 20px; }
    .chg-ttl { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; color: var(--text); }
    .chg-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .chg-link {
      color: var(--blue); font-weight: 600; font-size: 14px;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .chg-link svg { width: 14px; height: 14px; transition: transform 0.15s ease; }
    .chg-card:hover .chg-link svg { transform: translateX(3px); }

    /* ===== Empty search state ===== */
    .empty-state {
      display: none;
      max-width: 560px; margin: 32px auto 0;
      text-align: center; padding: 48px 24px;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);
      background: var(--surface-alt);
    }
    .empty-state.show { display: block; }
    .empty-state svg { width: 36px; height: 36px; color: var(--text-faint); margin: 0 auto 12px; }
    .empty-state h3 { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }
    .empty-state p { font-size: 14px; color: var(--text-muted); }

    .hidden { display: none !important; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 1000px) {
      .cat-grid { grid-template-columns: repeat(2, 1fr); }
      .quick-grid { grid-template-columns: repeat(2, 1fr); }
      .help-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 700px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .quick-wrap, .section-wrap, .help-wrap, .chg-wrap { padding-left: 16px; padding-right: 16px; }
      .quick-grid, .cat-grid { grid-template-columns: 1fr; }
      .pop-head { padding: 0 16px; }
      .pop-scroller { padding: 6px 16px 24px; }
      .help-card { padding: 32px 22px; }
      .help-ttl { font-size: 24px; }
      .section-head h2 { font-size: 24px; }
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
      <a class="tb-nav-item active" href="docs.html">Help</a>
      <a class="tb-nav-item" href="changelog.html">Changelog</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      Help center · 71 articles
    </div>
    <h1>How can we <em>help</em>?</h1>
    <p class="hero-sub">Guides, troubleshooting, and step-by-step tutorials for every corner of Tenantory. Written by the humans who built it.</p>
    <div class="search-wrap" id="searchWrap">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="text" id="searchInput" class="search-input" placeholder="Search for articles, e.g. &quot;autopay failed&quot; or &quot;Schedule E&quot;" autocomplete="off">
      <button class="search-clear" id="searchClear" aria-label="Clear search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="search-meta" id="searchMeta">Showing <strong id="searchCount">0</strong> matching articles</div>
  </section>

  <!-- Quick links -->
  <section class="quick-wrap">
    <div class="quick-title">Popular starting points</div>
    <div class="quick-grid">
      <a href="#" class="quick-card">
        <div class="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
        </div>
        <div class="quick-body">
          <div class="quick-label">Guide · 15 min</div>
          <div class="quick-ttl"><span class="article-title">Get your first property live on Tenantory in 15 minutes</span></div>
        </div>
      </a>
      <a href="#" class="quick-card">
        <div class="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div class="quick-body">
          <div class="quick-label">Migration</div>
          <div class="quick-ttl"><span class="article-title">Import your portfolio from AppFolio, Buildium, or DoorLoop</span></div>
        </div>
      </a>
      <a href="#" class="quick-card">
        <div class="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
        <div class="quick-body">
          <div class="quick-label">Payments</div>
          <div class="quick-ttl"><span class="article-title">Turn on autopay and get paid on the 1st — every month</span></div>
        </div>
      </a>
      <a href="#" class="quick-card">
        <div class="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="quick-body">
          <div class="quick-label">Branding</div>
          <div class="quick-ttl"><span class="article-title">Set up your branded subdomain (rent.yourcompany.com)</span></div>
        </div>
      </a>
    </div>
  </section>

  <!-- Category grid -->
  <section class="section-wrap">
    <div class="section-head">
      <div>
        <h2>Browse by topic</h2>
        <div class="section-sub">Eight categories, seventy-one articles, zero fluff.</div>
      </div>
      <div class="section-meta">Updated weekly · <strong>Last: 3 days ago</strong></div>
    </div>

    <div class="cat-grid" id="catGrid">

      <!-- Getting started -->
      <a href="#category-getting-started" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div class="cat-name">Getting started</div>
            <div class="cat-count">8 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Add your first property and unit in under 5 minutes</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Invite an existing tenant without breaking their lease dates</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Upload your logo, accent color, and email footer</span></a>
        </div>
        <span class="cat-all">See all 8 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Rent & payments -->
      <a href="#category-rent-payments" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div class="cat-name">Rent &amp; payments</div>
            <div class="cat-count">12 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Why did my tenant's bank payment fail with code R01?</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">ACH vs card: who pays the fee and how to pass it on</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Refund a rent payment after it's already settled</span></a>
        </div>
        <span class="cat-all">See all 12 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Applications & screening -->
      <a href="#category-applications" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          </div>
          <div>
            <div class="cat-name">Applications &amp; screening</div>
            <div class="cat-count">9 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">What the AI scoring engine flags (and what it ignores by law)</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Send a compliant adverse action letter when declining an applicant</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Re-run a credit check without charging the applicant twice</span></a>
        </div>
        <span class="cat-all">See all 9 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Leases -->
      <a href="#category-leases" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-navy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>
          </div>
          <div>
            <div class="cat-name">Leases</div>
            <div class="cat-count">11 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Pick the right state-specific lease template (all 50 states)</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Send a lease for e-signature and track who hasn't signed yet</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Renew a lease with a rent increase and keep payment continuity</span></a>
        </div>
        <span class="cat-all">See all 11 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Maintenance & vendors -->
      <a href="#category-maintenance" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <div class="cat-name">Maintenance &amp; vendors</div>
            <div class="cat-count">10 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Auto-assign tickets to the right vendor by category and zip</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Give a vendor portal access without exposing tenant contact info</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Collect W-9s and track 1099-eligible payments for each vendor</span></a>
        </div>
        <span class="cat-all">See all 10 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Accounting & taxes -->
      <a href="#category-accounting" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
          </div>
          <div>
            <div class="cat-name">Accounting &amp; taxes</div>
            <div class="cat-count">8 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Generate a Schedule E export your CPA will actually accept</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">File 1099-NECs for your vendors directly from Tenantory</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Sync your ledger to QuickBooks Online (class-by-property)</span></a>
        </div>
        <span class="cat-all">See all 8 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Account & billing -->
      <a href="#category-account" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <div class="cat-name">Account &amp; billing</div>
            <div class="cat-count">6 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Upgrade from Starter to Pro mid-cycle (we prorate the difference)</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">How the Founders $99-for-life pricing works if your portfolio grows</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Add a team seat for your bookkeeper with read-only ledger access</span></a>
        </div>
        <span class="cat-all">See all 6 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

      <!-- Integrations -->
      <a href="#category-integrations" class="cat-card" data-cat>
        <div class="cat-head">
          <div class="cat-ico c-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.59 13.41a2 2 0 0 1 0-2.83l5-5a2 2 0 0 1 2.83 2.83l-1.5 1.5"/><path d="M13.41 10.59a2 2 0 0 1 0 2.83l-5 5a2 2 0 0 1-2.83-2.83l1.5-1.5"/></svg>
          </div>
          <div>
            <div class="cat-name">Integrations</div>
            <div class="cat-count">7 articles</div>
          </div>
        </div>
        <div class="cat-list">
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Connect your Stripe account and reduce ACH payouts to T+1</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Push showing requests into your Google Calendar automatically</span></a>
          <a href="#" class="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span class="article-title">Post a vacant unit to Zillow, Trulia, and Hotpads in one click</span></a>
        </div>
        <span class="cat-all">See all 7 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </a>

    </div>

    <!-- Empty state -->
    <div class="empty-state" id="emptyState">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <h3>No articles match that search</h3>
      <p>Try a shorter phrase, or email <a href="mailto:hello@tenantory.com" style="color: var(--blue); font-weight: 600;">hello@tenantory.com</a> and we'll answer directly.</p>
    </div>
  </section>

  <!-- Popular articles (horizontal scroller) -->
  <section class="pop-wrap">
    <div class="pop-head">
      <div class="section-head">
        <div>
          <h2>Popular this month</h2>
          <div class="section-sub">The six articles that saved our customers the most time in the last 30 days.</div>
        </div>
        <div class="section-meta">Based on <strong>2,140 reads</strong></div>
      </div>
    </div>
    <div class="pop-scroller">

      <a href="#" class="pop-card">
        <span class="pop-tag">Payments</span>
        <div class="pop-ttl"><span class="article-title">Why did my tenant's bank payment fail with code R01?</span></div>
        <div class="pop-sum">R01 means "insufficient funds" from the tenant's bank. Here's how to auto-retry, notify the tenant with a pay-by-link, and apply the late fee cleanly.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>4 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

      <a href="#" class="pop-card">
        <span class="pop-tag">Migration</span>
        <div class="pop-ttl"><span class="article-title">Migrating 40+ units from AppFolio without losing ledger history</span></div>
        <div class="pop-sum">A field-tested checklist — export which reports, match tenant IDs, reconcile the security-deposit trust account, and cut over on the 1st.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>11 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

      <a href="#" class="pop-card">
        <span class="pop-tag">Leases</span>
        <div class="pop-ttl"><span class="article-title">Amending a signed lease without voiding the original signatures</span></div>
        <div class="pop-sum">Use an addendum, not a rewrite. We'll walk through when each works, which states require notarization, and how to e-send it through DocuSign or Tenantory Sign.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>6 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

      <a href="#" class="pop-card">
        <span class="pop-tag">Accounting</span>
        <div class="pop-ttl"><span class="article-title">The fastest way to reconcile December rent before you see your CPA</span></div>
        <div class="pop-sum">A 22-minute routine: match Stripe payouts, categorize vendor bills, tag capital improvements vs repairs, and export Schedule E.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>7 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

      <a href="#" class="pop-card">
        <span class="pop-tag">Maintenance</span>
        <div class="pop-ttl"><span class="article-title">Stop approving $180 emergency plumber calls for a clogged sink</span></div>
        <div class="pop-sum">Set a tiered approval rule — auto-approve under $150, require photo evidence over that, and route HVAC after hours differently. Saved the average customer $1,240 last quarter.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>5 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

      <a href="#" class="pop-card">
        <span class="pop-tag">Applications</span>
        <div class="pop-ttl"><span class="article-title">How to decline an applicant legally (with the letter we send for you)</span></div>
        <div class="pop-sum">Federal law requires specific adverse-action language when credit reports are involved. Here's how Tenantory auto-generates a compliant letter the moment you click decline.</div>
        <div class="pop-foot">
          <span class="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>3 min read</span>
          <span class="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </div>
      </a>

    </div>
  </section>

  <!-- Can't find -->
  <section class="help-wrap">
    <div class="help-card">
      <div class="help-label">Still stuck</div>
      <div class="help-ttl">Can't find what you need?</div>
      <p class="help-sub">We're based in Huntsville, AL and a real human answers every channel below. Average first response time last month: 47 minutes.</p>
      <div class="help-grid">

        <a class="help-ch" href="mailto:hello@tenantory.com?subject=Help%20with%20Tenantory">
          <div class="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="help-ch-ttl">Email support</div>
          <div class="help-ch-sub">hello@tenantory.com — tag it with your portfolio size and we'll route you to the right engineer.</div>
          <span class="help-ch-act">Send email <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>

        <a class="help-ch" href="https://calendly.com/tenantory/15min" target="_blank" rel="noopener">
          <div class="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="help-ch-ttl">Book a 15-min call</div>
          <div class="help-ch-sub">Grab a time on Calendly for live screen-share. Weekdays 9–6 CT, and Mark answers after hours when he's around.</div>
          <span class="help-ch-act">Open calendar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
        </a>

        <form class="help-ch" id="requestForm" onsubmit="return requestArticle(event)">
          <div class="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div class="help-ch-ttl">Request a new article</div>
          <div class="help-ch-sub">Missing something specific? Tell us the exact problem and we'll write a guide for it.</div>
          <div class="help-form">
            <input type="text" name="topic" placeholder="What should we write about?" required>
            <button type="submit">Send to articles@tenantory.com</button>
          </div>
        </form>

      </div>
    </div>
  </section>

  <!-- Changelog strip -->
  <section class="chg-wrap">
    <a class="chg-card" href="changelog.html">
      <div class="chg-left">
        <div class="chg-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div class="chg-ttl">Looking for what's new?</div>
          <div class="chg-sub">Weekly product updates, bug fixes, and what's shipping next — all in one page.</div>
        </div>
      </div>
      <span class="chg-link">See the changelog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
    </a>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="docs.html">Help</a>
      <a href="changelog.html">Changelog</a>
      <a href="security.html">Security</a>
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
