"use client";

// Mock ported from ~/Desktop/blackbear/docs.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 80px 32px 48px; text-align: center;\n      background: radial-gradient(ellipse at top, var(--blue-softer) 0%, transparent 60%);\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 56px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 820px; margin: 0 auto 16px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 620px; margin: 0 auto 32px; line-height: 1.55;\n    }\n    .search-wrap {\n      max-width: 680px; margin: 0 auto;\n      position: relative;\n    }\n    .search-input {\n      width: 100%; padding: 20px 56px 20px 56px;\n      border: 1.5px solid var(--border); border-radius: 100px;\n      font-size: 16px; color: var(--text); background: var(--surface);\n      box-shadow: var(--shadow);\n      transition: all 0.15s ease;\n    }\n    .search-input:focus { outline: none; border-color: var(--blue-bright); box-shadow: 0 10px 30px rgba(22,101,216,0.16); }\n    .search-input::placeholder { color: var(--text-faint); }\n    .search-icon {\n      position: absolute; left: 22px; top: 50%; transform: translateY(-50%);\n      color: var(--text-faint); width: 20px; height: 20px;\n      pointer-events: none;\n    }\n    .search-clear {\n      position: absolute; right: 18px; top: 50%; transform: translateY(-50%);\n      width: 28px; height: 28px; border-radius: 50%;\n      display: none; align-items: center; justify-content: center;\n      background: var(--surface-alt); color: var(--text-muted);\n    }\n    .search-clear:hover { background: var(--border); color: var(--text); }\n    .search-clear svg { width: 14px; height: 14px; }\n    .search-wrap.has-value .search-clear { display: flex; }\n    .search-meta {\n      display: none; margin-top: 14px; font-size: 13px; color: var(--text-muted);\n    }\n    .search-wrap.has-value + .search-meta { display: block; }\n\n    /* ===== Quick links ===== */\n    .quick-wrap { max-width: 1200px; margin: 0 auto; padding: 48px 32px 0; }\n    .quick-title {\n      font-size: 12px; font-weight: 700; color: var(--text-faint);\n      letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 14px;\n    }\n    .quick-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n    }\n    .quick-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n      display: flex; align-items: flex-start; gap: 14px;\n      transition: all 0.15s ease;\n    }\n    .quick-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-2px); }\n    .quick-ico {\n      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .quick-ico svg { width: 18px; height: 18px; }\n    .quick-body { flex: 1; min-width: 0; }\n    .quick-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;\n    }\n    .quick-ttl { font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.35; letter-spacing: -0.01em; }\n\n    /* ===== Section header ===== */\n    .section-wrap { max-width: 1200px; margin: 0 auto; padding: 72px 32px 0; }\n    .section-head {\n      display: flex; justify-content: space-between; align-items: flex-end;\n      margin-bottom: 28px; gap: 20px; flex-wrap: wrap;\n    }\n    .section-head h2 {\n      font-size: 30px; font-weight: 800; letter-spacing: -0.025em; color: var(--text);\n    }\n    .section-sub { font-size: 15px; color: var(--text-muted); margin-top: 4px; }\n    .section-meta { font-size: 13px; color: var(--text-muted); }\n    .section-meta strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Category grid ===== */\n    .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }\n    .cat-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px;\n      display: flex; flex-direction: column; gap: 14px;\n      transition: all 0.2s ease;\n      position: relative;\n    }\n    .cat-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-3px); }\n    .cat-head {\n      display: flex; align-items: center; gap: 12px;\n    }\n    .cat-ico {\n      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .cat-ico svg { width: 20px; height: 20px; }\n    .cat-ico.c-blue { background: var(--blue-pale); color: var(--blue); }\n    .cat-ico.c-pink { background: var(--pink-bg); color: #c21a6a; }\n    .cat-ico.c-green { background: var(--green-bg); color: var(--green-dark); }\n    .cat-ico.c-gold { background: rgba(245,166,35,0.14); color: #b77500; }\n    .cat-ico.c-navy { background: rgba(47,62,131,0.1); color: var(--navy); }\n    .cat-ico.c-red { background: rgba(214,69,69,0.1); color: var(--red); }\n    .cat-ico.c-purple { background: rgba(124,77,255,0.12); color: #5e35d1; }\n    .cat-ico.c-teal { background: rgba(30,169,124,0.12); color: var(--green-dark); }\n    .cat-name { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; color: var(--text); }\n    .cat-count { font-size: 12px; color: var(--text-muted); margin-top: 2px; font-weight: 500; }\n    .cat-list {\n      display: flex; flex-direction: column; gap: 2px;\n      padding-top: 12px; border-top: 1px solid var(--border);\n    }\n    .cat-article {\n      display: flex; align-items: flex-start; gap: 8px;\n      padding: 8px 0; font-size: 13.5px; color: var(--text);\n      line-height: 1.45; transition: color 0.15s ease;\n    }\n    .cat-article:hover { color: var(--blue); }\n    .cat-article svg {\n      width: 12px; height: 12px; flex-shrink: 0; margin-top: 4px; color: var(--text-faint);\n    }\n    .cat-all {\n      margin-top: auto; padding-top: 10px;\n      font-size: 13px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .cat-all svg { width: 12px; height: 12px; transition: transform 0.15s ease; }\n    .cat-card:hover .cat-all svg { transform: translateX(3px); }\n\n    /* ===== Popular articles (horizontal scroll) ===== */\n    .pop-wrap {\n      max-width: 1200px; margin: 0 auto; padding: 72px 0 0;\n    }\n    .pop-head { padding: 0 32px; margin-bottom: 28px; }\n    .pop-scroller {\n      display: flex; gap: 16px;\n      overflow-x: auto;\n      padding: 6px 32px 24px;\n      scroll-snap-type: x mandatory;\n      scrollbar-width: thin;\n    }\n    .pop-scroller::-webkit-scrollbar { height: 8px; }\n    .pop-scroller::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 100px; }\n    .pop-card {\n      flex: 0 0 340px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      scroll-snap-align: start;\n      display: flex; flex-direction: column; gap: 10px;\n      transition: all 0.15s ease;\n    }\n    .pop-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-2px); }\n    .pop-tag {\n      align-self: flex-start;\n      font-size: 10px; font-weight: 700; color: var(--text-muted);\n      letter-spacing: 0.1em; text-transform: uppercase;\n      padding: 4px 10px; border-radius: 100px;\n      background: var(--surface-alt); border: 1px solid var(--border);\n    }\n    .pop-ttl { font-size: 16px; font-weight: 700; line-height: 1.35; letter-spacing: -0.015em; color: var(--text); }\n    .pop-sum { font-size: 13.5px; color: var(--text-muted); line-height: 1.5; flex: 1; }\n    .pop-foot {\n      display: flex; align-items: center; justify-content: space-between;\n      padding-top: 10px; border-top: 1px solid var(--border);\n      font-size: 12px; color: var(--text-faint);\n    }\n    .pop-read { display: inline-flex; align-items: center; gap: 5px; }\n    .pop-read svg { width: 12px; height: 12px; }\n    .pop-link { font-size: 12px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 3px; }\n    .pop-link svg { width: 11px; height: 11px; }\n\n    /* ===== Contact callout ===== */\n    .help-wrap { max-width: 1200px; margin: 72px auto 0; padding: 0 32px; }\n    .help-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 48px 40px;\n      position: relative; overflow: hidden;\n    }\n    .help-card::after {\n      content: \"\"; position: absolute; top: -80px; right: -80px;\n      width: 320px; height: 320px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .help-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; position: relative; z-index: 1; }\n    .help-ttl { font-size: 30px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px; position: relative; z-index: 1; }\n    .help-sub { font-size: 15px; color: rgba(255,255,255,0.72); max-width: 540px; margin-bottom: 32px; position: relative; z-index: 1; }\n    .help-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n      position: relative; z-index: 1;\n    }\n    .help-ch {\n      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);\n      border-radius: var(--radius-lg); padding: 22px;\n      display: flex; flex-direction: column; gap: 10px;\n      transition: all 0.15s ease;\n    }\n    .help-ch:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }\n    .help-ch-ico {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: rgba(255,73,152,0.18); color: var(--pink);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .help-ch-ico svg { width: 18px; height: 18px; }\n    .help-ch-ttl { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }\n    .help-ch-sub { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.45; }\n    .help-ch-act {\n      margin-top: auto; padding-top: 6px;\n      font-size: 12px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.1em;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .help-ch-act svg { width: 12px; height: 12px; }\n\n    .help-form {\n      display: flex; flex-direction: column; gap: 8px;\n    }\n    .help-form input, .help-form textarea {\n      width: 100%; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15);\n      border-radius: 8px; padding: 10px 12px;\n      font-size: 13px; color: #fff; resize: vertical;\n    }\n    .help-form input::placeholder, .help-form textarea::placeholder { color: rgba(255,255,255,0.45); }\n    .help-form input:focus, .help-form textarea:focus { outline: none; border-color: var(--pink); }\n    .help-form textarea { min-height: 60px; }\n    .help-form button {\n      background: var(--pink); color: #fff; border-radius: 8px;\n      padding: 10px 12px; font-size: 12px; font-weight: 700;\n      letter-spacing: 0.06em; text-transform: uppercase;\n      transition: all 0.15s ease;\n    }\n    .help-form button:hover { background: #e63882; }\n\n    /* ===== Changelog strip ===== */\n    .chg-wrap { max-width: 1200px; margin: 48px auto 0; padding: 0 32px; }\n    .chg-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .chg-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 260px; }\n    .chg-ico {\n      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;\n      background: var(--pink-bg); color: #c21a6a;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .chg-ico svg { width: 20px; height: 20px; }\n    .chg-ttl { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; color: var(--text); }\n    .chg-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n    .chg-link {\n      color: var(--blue); font-weight: 600; font-size: 14px;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .chg-link svg { width: 14px; height: 14px; transition: transform 0.15s ease; }\n    .chg-card:hover .chg-link svg { transform: translateX(3px); }\n\n    /* ===== Empty search state ===== */\n    .empty-state {\n      display: none;\n      max-width: 560px; margin: 32px auto 0;\n      text-align: center; padding: 48px 24px;\n      border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);\n      background: var(--surface-alt);\n    }\n    .empty-state.show { display: block; }\n    .empty-state svg { width: 36px; height: 36px; color: var(--text-faint); margin: 0 auto 12px; }\n    .empty-state h3 { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .empty-state p { font-size: 14px; color: var(--text-muted); }\n\n    .hidden { display: none !important; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 1000px) {\n      .cat-grid { grid-template-columns: repeat(2, 1fr); }\n      .quick-grid { grid-template-columns: repeat(2, 1fr); }\n      .help-grid { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 700px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .quick-wrap, .section-wrap, .help-wrap, .chg-wrap { padding-left: 16px; padding-right: 16px; }\n      .quick-grid, .cat-grid { grid-template-columns: 1fr; }\n      .pop-head { padding: 0 16px; }\n      .pop-scroller { padding: 6px 16px 24px; }\n      .help-card { padding: 32px 22px; }\n      .help-ttl { font-size: 24px; }\n      .section-head h2 { font-size: 24px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="docs.html">Help</a>
      <a className="tb-nav-item" href="changelog.html">Changelog</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
      Help center · 71 articles
    </div>
    <h1>How can we <em>help</em>?</h1>
    <p className="hero-sub">Guides, troubleshooting, and step-by-step tutorials for every corner of Black Bear Rentals. Written by the humans who built it.</p>
    <div className="search-wrap" id="searchWrap">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input type="text" id="searchInput" className="search-input" placeholder={"Search for articles, e.g. \"autopay failed\" or \"Schedule E\""} autoComplete="off" />
      <button className="search-clear" id="searchClear" aria-label="Clear search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
    </div>
    <div className="search-meta" id="searchMeta">Showing <strong id="searchCount">0</strong> matching articles</div>
  </section>

  
  <section className="quick-wrap">
    <div className="quick-title">Popular starting points</div>
    <div className="quick-grid">
      <a href="#" className="quick-card">
        <div className="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" /></svg>
        </div>
        <div className="quick-body">
          <div className="quick-label">Guide · 15 min</div>
          <div className="quick-ttl"><span className="article-title">Get your first property live on Black Bear Rentals in 15 minutes</span></div>
        </div>
      </a>
      <a href="#" className="quick-card">
        <div className="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        </div>
        <div className="quick-body">
          <div className="quick-label">Migration</div>
          <div className="quick-ttl"><span className="article-title">Import your portfolio from AppFolio, Buildium, or DoorLoop</span></div>
        </div>
      </a>
      <a href="#" className="quick-card">
        <div className="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        </div>
        <div className="quick-body">
          <div className="quick-label">Payments</div>
          <div className="quick-ttl"><span className="article-title">Turn on autopay and get paid on the 1st — every month</span></div>
        </div>
      </a>
      <a href="#" className="quick-card">
        <div className="quick-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </div>
        <div className="quick-body">
          <div className="quick-label">Branding</div>
          <div className="quick-ttl"><span className="article-title">Set up your branded subdomain (rent.yourcompany.com)</span></div>
        </div>
      </a>
    </div>
  </section>

  
  <section className="section-wrap">
    <div className="section-head">
      <div>
        <h2>Browse by topic</h2>
        <div className="section-sub">Eight categories, seventy-one articles, zero fluff.</div>
      </div>
      <div className="section-meta">Updated weekly · <strong>Last: 3 days ago</strong></div>
    </div>

    <div className="cat-grid" id="catGrid">

      
      <a href="#category-getting-started" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <div>
            <div className="cat-name">Getting started</div>
            <div className="cat-count">8 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Add your first property and unit in under 5 minutes</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Invite an existing tenant without breaking their lease dates</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Upload your logo, accent color, and email footer</span></a>
        </div>
        <span className="cat-all">See all 8 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-rent-payments" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div>
            <div className="cat-name">Rent &amp; payments</div>
            <div className="cat-count">12 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Why did my tenant's bank payment fail with code R01?</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">ACH vs card: who pays the fee and how to pass it on</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Refund a rent payment after it's already settled</span></a>
        </div>
        <span className="cat-all">See all 12 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-applications" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
          </div>
          <div>
            <div className="cat-name">Applications &amp; screening</div>
            <div className="cat-count">9 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">What the AI scoring engine flags (and what it ignores by law)</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Send a compliant adverse action letter when declining an applicant</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Re-run a credit check without charging the applicant twice</span></a>
        </div>
        <span className="cat-all">See all 9 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-leases" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-navy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /></svg>
          </div>
          <div>
            <div className="cat-name">Leases</div>
            <div className="cat-count">11 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Pick the right state-specific lease template (all 50 states)</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Send a lease for e-signature and track who hasn't signed yet</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Renew a lease with a rent increase and keep payment continuity</span></a>
        </div>
        <span className="cat-all">See all 11 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-maintenance" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
          </div>
          <div>
            <div className="cat-name">Maintenance &amp; vendors</div>
            <div className="cat-count">10 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Auto-assign tickets to the right vendor by category and zip</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Give a vendor portal access without exposing tenant contact info</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Collect W-9s and track 1099-eligible payments for each vendor</span></a>
        </div>
        <span className="cat-all">See all 10 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-accounting" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>
          </div>
          <div>
            <div className="cat-name">Accounting &amp; taxes</div>
            <div className="cat-count">8 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Generate a Schedule E export your CPA will actually accept</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">File 1099-NECs for your vendors directly from Black Bear Rentals</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Sync your ledger to QuickBooks Online (class-by-property)</span></a>
        </div>
        <span className="cat-all">See all 8 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-account" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div>
            <div className="cat-name">Account &amp; billing</div>
            <div className="cat-count">6 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Upgrade from Starter to Pro mid-cycle (we prorate the difference)</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">How the Founders $99-for-life pricing works if your portfolio grows</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Add a team seat for your bookkeeper with read-only ledger access</span></a>
        </div>
        <span className="cat-all">See all 6 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      
      <a href="#category-integrations" className="cat-card" data-cat="">
        <div className="cat-head">
          <div className="cat-ico c-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.59 13.41a2 2 0 0 1 0-2.83l5-5a2 2 0 0 1 2.83 2.83l-1.5 1.5" /><path d="M13.41 10.59a2 2 0 0 1 0 2.83l-5 5a2 2 0 0 1-2.83-2.83l1.5-1.5" /></svg>
          </div>
          <div>
            <div className="cat-name">Integrations</div>
            <div className="cat-count">7 articles</div>
          </div>
        </div>
        <div className="cat-list">
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Connect your Stripe account and reduce ACH payouts to T+1</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Push showing requests into your Google Calendar automatically</span></a>
          <a href="#" className="cat-article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg><span className="article-title">Post a vacant unit to Zillow, Trulia, and Hotpads in one click</span></a>
        </div>
        <span className="cat-all">See all 7 articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

    </div>

    
    <div className="empty-state" id="emptyState">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <h3>No articles match that search</h3>
      <p>Try a shorter phrase, or email <a href="mailto:hello@rentblackbear.com" style={{color: "var(--blue)", fontWeight: "600"}}>hello@rentblackbear.com</a> and we'll answer directly.</p>
    </div>
  </section>

  
  <section className="pop-wrap">
    <div className="pop-head">
      <div className="section-head">
        <div>
          <h2>Popular this month</h2>
          <div className="section-sub">The six articles that saved our customers the most time in the last 30 days.</div>
        </div>
        <div className="section-meta">Based on <strong>2,140 reads</strong></div>
      </div>
    </div>
    <div className="pop-scroller">

      <a href="#" className="pop-card">
        <span className="pop-tag">Payments</span>
        <div className="pop-ttl"><span className="article-title">Why did my tenant's bank payment fail with code R01?</span></div>
        <div className="pop-sum">R01 means "insufficient funds" from the tenant's bank. Here's how to auto-retry, notify the tenant with a pay-by-link, and apply the late fee cleanly.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>4 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

      <a href="#" className="pop-card">
        <span className="pop-tag">Migration</span>
        <div className="pop-ttl"><span className="article-title">Migrating 40+ units from AppFolio without losing ledger history</span></div>
        <div className="pop-sum">A field-tested checklist — export which reports, match tenant IDs, reconcile the security-deposit trust account, and cut over on the 1st.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>11 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

      <a href="#" className="pop-card">
        <span className="pop-tag">Leases</span>
        <div className="pop-ttl"><span className="article-title">Amending a signed lease without voiding the original signatures</span></div>
        <div className="pop-sum">Use an addendum, not a rewrite. We'll walk through when each works, which states require notarization, and how to e-send it through DocuSign or Black Bear Rentals Sign.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>6 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

      <a href="#" className="pop-card">
        <span className="pop-tag">Accounting</span>
        <div className="pop-ttl"><span className="article-title">The fastest way to reconcile December rent before you see your CPA</span></div>
        <div className="pop-sum">A 22-minute routine: match Stripe payouts, categorize vendor bills, tag capital improvements vs repairs, and export Schedule E.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>7 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

      <a href="#" className="pop-card">
        <span className="pop-tag">Maintenance</span>
        <div className="pop-ttl"><span className="article-title">Stop approving $180 emergency plumber calls for a clogged sink</span></div>
        <div className="pop-sum">Set a tiered approval rule — auto-approve under $150, require photo evidence over that, and route HVAC after hours differently. Saved the average customer $1,240 last quarter.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>5 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

      <a href="#" className="pop-card">
        <span className="pop-tag">Applications</span>
        <div className="pop-ttl"><span className="article-title">How to decline an applicant legally (with the letter we send for you)</span></div>
        <div className="pop-sum">Federal law requires specific adverse-action language when credit reports are involved. Here's how Black Bear Rentals auto-generates a compliant letter the moment you click decline.</div>
        <div className="pop-foot">
          <span className="pop-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>3 min read</span>
          <span className="pop-link">Read<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </div>
      </a>

    </div>
  </section>

  
  <section className="help-wrap">
    <div className="help-card">
      <div className="help-label">Still stuck</div>
      <div className="help-ttl">Can't find what you need?</div>
      <p className="help-sub">We're based in Huntsville, AL and a real human answers every channel below. Average first response time last month: 47 minutes.</p>
      <div className="help-grid">

        <a className="help-ch" href="mailto:hello@rentblackbear.com?subject=Help%20with%20Black Bear Rentals">
          <div className="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
          <div className="help-ch-ttl">Email support</div>
          <div className="help-ch-sub">hello@rentblackbear.com — tag it with your portfolio size and we'll route you to the right engineer.</div>
          <span className="help-ch-act">Send email <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </a>

        <a className="help-ch" href="https://calendly.com/blackbear/15min" target="_blank" rel="noopener">
          <div className="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </div>
          <div className="help-ch-ttl">Book a 15-min call</div>
          <div className="help-ch-sub">Grab a time on Calendly for live screen-share. Weekdays 9–6 CT, and Mark answers after hours when he's around.</div>
          <span className="help-ch-act">Open calendar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
        </a>

        <form className="help-ch" id="requestForm">
          <div className="help-ch-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </div>
          <div className="help-ch-ttl">Request a new article</div>
          <div className="help-ch-sub">Missing something specific? Tell us the exact problem and we'll write a guide for it.</div>
          <div className="help-form">
            <input type="text" name="topic" placeholder="What should we write about?" required />
            <button type="submit">Send to articles@rentblackbear.com</button>
          </div>
        </form>

      </div>
    </div>
  </section>

  
  <section className="chg-wrap">
    <a className="chg-card" href="changelog.html">
      <div className="chg-left">
        <div className="chg-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </div>
        <div>
          <div className="chg-ttl">Looking for what's new?</div>
          <div className="chg-sub">Weekly product updates, bug fixes, and what's shipping next — all in one page.</div>
        </div>
      </div>
      <span className="chg-link">See the changelog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
    </a>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="docs.html">Help</a>
      <a href="changelog.html">Changelog</a>
      <a href="security.html">Security</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
