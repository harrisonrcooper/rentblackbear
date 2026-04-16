"use client";

// Mock ported from ~/Desktop/blackbear/listings.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;\n      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12); --accent-pale: #fdf3e0;\n      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;\n      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;\n      --border: #e5e1d4; --border-strong: #c9c3b0;\n      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;\n      --red: #b23a3a;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* ===== Topbar (Black Bear branded) ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-right { display: flex; gap: 16px; align-items: center; font-size: 13px; }\n    .tb-right a { color: rgba(255,255,255,0.85); }\n    .tb-right a:hover { color: #fff; }\n    .tb-cta {\n      background: var(--accent); color: #fff;\n      padding: 9px 18px; border-radius: 100px; font-weight: 700; font-size: 13px;\n      transition: all 0.15s ease;\n    }\n    .tb-cta:hover { background: #b8742d; transform: translateY(-1px); }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 60px 32px 36px; text-align: center;\n      background:\n        linear-gradient(180deg, var(--brand-pale) 0%, var(--surface-alt) 100%);\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--brand-pale); color: var(--brand-dark);\n      font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;\n      margin-bottom: 16px; border: 1px solid var(--brand-soft);\n    }\n    .hero-eyebrow svg { width: 11px; height: 11px; }\n    .hero h1 {\n      font-size: clamp(32px, 4.5vw, 46px);\n      font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;\n      margin: 0 auto 14px; max-width: 720px; color: var(--text);\n    }\n    .hero-sub { font-size: 16px; color: var(--text-muted); max-width: 580px; margin: 0 auto; }\n\n    /* ===== Filters ===== */\n    .filters-wrap { max-width: 1180px; margin: -22px auto 0; padding: 0 32px; position: relative; z-index: 2; }\n    .filters {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 14px;\n      box-shadow: var(--shadow);\n      display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr auto; gap: 8px;\n      align-items: center;\n    }\n    .f-group { display: flex; flex-direction: column; gap: 2px; padding: 6px 12px; border-radius: 10px; transition: background 0.15s ease; }\n    .f-group:hover { background: var(--surface-subtle); }\n    .f-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }\n    .f-input, .f-select {\n      border: none; outline: none; background: transparent;\n      font-size: 14px; color: var(--text); font-weight: 600; padding: 0;\n      width: 100%;\n    }\n    .f-select {\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231f2b24' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 0 center; padding-right: 18px;\n      cursor: pointer;\n    }\n    .f-cta {\n      background: var(--brand); color: #fff;\n      padding: 12px 22px; border-radius: 100px; font-weight: 700; font-size: 13px;\n      display: inline-flex; align-items: center; gap: 8px;\n      transition: all 0.15s ease;\n    }\n    .f-cta:hover { background: var(--brand-dark); }\n    .f-cta svg { width: 14px; height: 14px; }\n\n    /* ===== Results bar ===== */\n    .results-bar {\n      max-width: 1180px; margin: 36px auto 16px; padding: 0 32px;\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;\n    }\n    .results-count { font-size: 14px; color: var(--text-muted); }\n    .results-count strong { color: var(--text); font-weight: 700; }\n    .sort-wrap { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .sort-select {\n      padding: 6px 26px 6px 12px; border: 1px solid var(--border); border-radius: 100px;\n      background: var(--surface); font-weight: 600; font-size: 13px; color: var(--text);\n      cursor: pointer; -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231f2b24' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 10px center;\n    }\n\n    .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }\n    .chip {\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--brand-pale); color: var(--brand-dark);\n      font-size: 12px; font-weight: 600;\n      display: inline-flex; align-items: center; gap: 6px;\n      border: 1px solid var(--brand-soft);\n    }\n    .chip-x { color: var(--brand-dark); opacity: 0.6; cursor: pointer; }\n    .chip-x:hover { opacity: 1; }\n    .chip-x svg { width: 10px; height: 10px; }\n    .chip-clear { color: var(--text-muted); font-size: 12px; font-weight: 600; padding: 5px 8px; }\n    .chip-clear:hover { color: var(--brand); }\n\n    /* ===== Listings grid ===== */\n    .listings { max-width: 1180px; margin: 0 auto 60px; padding: 0 32px; }\n    .grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;\n    }\n\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      transition: all 0.2s ease; cursor: pointer;\n      display: flex; flex-direction: column; position: relative;\n    }\n    .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--brand-soft); }\n    .card.unavailable { opacity: 0.65; cursor: default; }\n    .card.unavailable:hover { transform: none; box-shadow: none; }\n\n    .card-photo {\n      aspect-ratio: 4 / 3; position: relative;\n      display: flex; align-items: flex-end; padding: 14px;\n    }\n    .card-photo.green {\n      background:\n        linear-gradient(135deg, rgba(30,111,71,0.6), rgba(199,132,59,0.4)),\n        radial-gradient(ellipse at 25% 65%, var(--brand-bright), transparent 60%),\n        linear-gradient(180deg, #b8a478, #8a7653);\n    }\n    .card-photo.amber {\n      background:\n        linear-gradient(135deg, rgba(199,132,59,0.55), rgba(30,111,71,0.4)),\n        radial-gradient(ellipse at 70% 30%, #e2a04a, transparent 60%),\n        linear-gradient(180deg, #c79a64, #8c6c3f);\n    }\n    .card-photo.dusk {\n      background:\n        linear-gradient(135deg, rgba(20,77,49,0.5), rgba(178,58,58,0.3)),\n        radial-gradient(ellipse at 20% 30%, #4a7d62, transparent 60%),\n        linear-gradient(180deg, #7a8a78, #4d5b50);\n    }\n    .card-photo.morning {\n      background:\n        linear-gradient(135deg, rgba(231,244,237,0.4), rgba(252,243,224,0.5)),\n        radial-gradient(ellipse at 60% 80%, #b9d4c2, transparent 60%),\n        linear-gradient(180deg, #d2c5a6, #a89878);\n    }\n    .card-photo.evening {\n      background:\n        linear-gradient(135deg, rgba(0,0,0,0.4), rgba(199,132,59,0.5)),\n        radial-gradient(ellipse at 75% 70%, #c5762e, transparent 60%),\n        linear-gradient(180deg, #5a3e1e, #2a1e0a);\n    }\n    .card-photo.creek {\n      background:\n        linear-gradient(135deg, rgba(30,111,71,0.55), rgba(74,125,98,0.4)),\n        radial-gradient(ellipse at 30% 50%, #4a8e6e, transparent 60%),\n        linear-gradient(180deg, #6a8a72, #3d5048);\n    }\n\n    .card-badges { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; gap: 6px; align-items: flex-start; }\n    .badge {\n      padding: 5px 10px; border-radius: 100px;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n    }\n    .badge-available { background: rgba(255,255,255,0.92); color: var(--brand-dark); }\n    .badge-soon { background: rgba(199,132,59,0.92); color: #fff; }\n    .badge-occupied { background: rgba(0,0,0,0.55); color: #fff; }\n    .badge-new { background: var(--accent); color: #fff; box-shadow: 0 2px 8px rgba(199,132,59,0.4); }\n    .badge-popular { background: rgba(30,111,71,0.92); color: #fff; }\n\n    .card-photo-count {\n      position: absolute; bottom: 14px; right: 14px;\n      background: rgba(0,0,0,0.55); color: #fff;\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 600;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .card-photo-count svg { width: 11px; height: 11px; }\n\n    .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }\n    .card-rent {\n      font-size: 26px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); line-height: 1;\n    }\n    .card-rent small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }\n    .card-title { font-size: 15px; font-weight: 700; color: var(--text); margin-top: 8px; }\n    .card-addr { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n    .card-meta {\n      display: flex; gap: 14px; flex-wrap: wrap;\n      margin: 14px 0; padding: 12px 0;\n      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);\n      font-size: 12px; color: var(--text-muted);\n    }\n    .card-meta-item { display: inline-flex; align-items: center; gap: 5px; }\n    .card-meta-item svg { width: 14px; height: 14px; color: var(--brand); flex-shrink: 0; }\n    .card-meta-item strong { color: var(--text); font-weight: 700; }\n\n    .card-includes {\n      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;\n    }\n    .pill-incl {\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 600; color: var(--text);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n    }\n\n    .card-foot {\n      margin-top: auto; display: flex; justify-content: space-between; align-items: center;\n    }\n    .card-available { font-size: 12px; color: var(--text-muted); }\n    .card-available strong { color: var(--brand-dark); font-weight: 700; }\n    .card-cta {\n      background: var(--brand); color: #fff;\n      padding: 9px 18px; border-radius: 100px;\n      font-weight: 700; font-size: 13px;\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .card-cta:hover { background: var(--brand-dark); transform: translateX(2px); }\n    .card-cta svg { width: 13px; height: 13px; }\n    .card-cta-disabled {\n      background: var(--surface-subtle); color: var(--text-muted);\n      padding: 9px 18px; border-radius: 100px;\n      font-weight: 700; font-size: 13px; cursor: not-allowed;\n    }\n\n    /* ===== About strip ===== */\n    .about {\n      max-width: 1180px; margin: 24px auto 60px; padding: 0 32px;\n    }\n    .about-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px;\n      display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center;\n    }\n    .about-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .about-card h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; }\n    .about-card p { color: var(--text-muted); font-size: 14.5px; line-height: 1.6; }\n    .about-card p + p { margin-top: 12px; }\n    .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n    .about-stat {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius-lg); padding: 22px;\n    }\n    .about-stat-num { font-size: 36px; font-weight: 800; color: var(--brand-dark); letter-spacing: -0.03em; line-height: 1; }\n    .about-stat-label { font-size: 12px; color: var(--brand-dark); margin-top: 8px; font-weight: 600; }\n\n    /* ===== FAQ strip ===== */\n    .faq-strip {\n      max-width: 980px; margin: 0 auto 60px; padding: 0 32px;\n    }\n    .faq-strip-head { text-align: center; margin-bottom: 28px; }\n    .faq-strip-head h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .faq-strip-head p { color: var(--text-muted); font-size: 14px; }\n\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); margin-bottom: 8px; overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--brand-soft); }\n    .faq-q {\n      padding: 16px 20px; font-weight: 700; font-size: 14px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 16px; height: 16px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--brand); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 20px; color: var(--text-muted); font-size: 13.5px; line-height: 1.6;\n    }\n    .faq-item.open .faq-a { max-height: 400px; padding: 0 20px 18px; }\n\n    /* ===== Empty state (when filters yield nothing) ===== */\n    .empty {\n      max-width: 600px; margin: 60px auto; text-align: center; padding: 0 32px;\n      display: none;\n    }\n    .empty.show { display: block; }\n    .empty-icon {\n      width: 72px; height: 72px; border-radius: 50%;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); margin: 0 auto 20px;\n    }\n    .empty-icon svg { width: 32px; height: 32px; }\n    .empty h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }\n    .empty p { color: var(--text-muted); margin-bottom: 18px; }\n    .empty .btn {\n      background: var(--brand); color: #fff;\n      padding: 10px 20px; border-radius: 100px; font-weight: 700; font-size: 13px;\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n\n    /* ===== Footer ===== */\n    .legal-foot {\n      max-width: 1180px; margin: 0 auto; padding: 28px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;\n      color: var(--text-faint); font-size: 11px;\n    }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n    .legal-foot a:hover { color: var(--brand); }\n\n    @media (max-width: 980px) {\n      .grid { grid-template-columns: repeat(2, 1fr); }\n      .about-card { grid-template-columns: 1fr; padding: 24px; }\n      .filters { grid-template-columns: 1fr 1fr; }\n      .filters .f-cta { grid-column: 1 / -1; justify-content: center; }\n    }\n    @media (max-width: 620px) {\n      .topbar { padding: 14px 16px; flex-wrap: wrap; gap: 10px; }\n      .tb-right { width: 100%; justify-content: space-between; }\n      .hero { padding: 36px 16px 28px; }\n      .filters-wrap, .results-bar, .listings, .about, .faq-strip, .legal-foot { padding-left: 16px; padding-right: 16px; }\n      .grid { grid-template-columns: 1fr; }\n      .filters { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z" /><circle cx="9" cy="9" r="0.8" fill="currentColor" /><circle cx="15" cy="9" r="0.8" fill="currentColor" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Black Bear Rentals</div>
        <div className="tb-brand-sub">Co-living &amp; rental homes · Huntsville, AL</div>
      </div>
    </div>
    <div className="tb-right">
      <a href="mailto:hello@rentblackbear.com">Contact</a>
      <a href="portal.html">Tenant sign in</a>
      <a className="tb-cta" href="apply.html">Apply now</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      Updated <span id="updated">today</span> · 4 homes available
    </div>
    <h1>Find your room in Huntsville.</h1>
    <p className="hero-sub">Furnished rooms, all utilities included, monthly leases as short as 6 months. Apply online — most decisions in 48 hours.</p>
  </section>

  
  <div className="filters-wrap">
    <div className="filters" id="filters">
      <div className="f-group">
        <span className="f-label">Search</span>
        <input className="f-input" type="text" placeholder="Address, neighborhood, or feature" id="searchInput" />
      </div>
      <div className="f-group">
        <span className="f-label">Type</span>
        <select className="f-select" id="filterType">
          <option value="">Any</option>
          <option value="coliving">Co-living room</option>
          <option value="studio">Studio</option>
          <option value="single">Single-family</option>
          <option value="apartment">Apartment</option>
        </select>
      </div>
      <div className="f-group">
        <span className="f-label">Bedrooms</span>
        <select className="f-select" id="filterBeds">
          <option value="">Any</option>
          <option value="0">Studio</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>
      <div className="f-group">
        <span className="f-label">Max rent</span>
        <select className="f-select" id="filterRent">
          <option value="">Any</option>
          <option value="800">Under $800</option>
          <option value="1000">Under $1,000</option>
          <option value="1500">Under $1,500</option>
          <option value="2000">Under $2,000</option>
        </select>
      </div>
      <div className="f-group">
        <span className="f-label">Available by</span>
        <select className="f-select" id="filterDate">
          <option value="">Any time</option>
          <option value="now">This month</option>
          <option value="60">Within 60 days</option>
          <option value="90">Within 90 days</option>
        </select>
      </div>
      <button className="f-cta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        Search
      </button>
    </div>
  </div>

  
  <div className="results-bar">
    <div className="results-count">
      <strong id="visibleCount">6</strong> of 6 homes · <span id="filterChips" className="filter-chips" style={{display: "inline-flex"}} />
    </div>
    <div className="sort-wrap">
      Sort by
      <select className="sort-select" id="sortSelect">
        <option value="recent">Newly listed</option>
        <option value="rent-asc">Rent: low to high</option>
        <option value="rent-desc">Rent: high to low</option>
        <option value="available">Available soonest</option>
      </select>
    </div>
  </div>

  
  <section className="listings">
    <div className="grid" id="grid">

      <a className="card" href="apply.html" data-rent="750" data-beds="1" data-type="coliving" data-status="available" data-days="17" data-popular="true">
        <div className="card-photo green">
          <div className="card-badges">
            <span className="badge badge-available">Available May 1</span>
            <span className="badge badge-popular">Popular</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            12 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$750<small>/mo</small></div>
          <div className="card-title">Room A · Co-living house</div>
          <div className="card-addr">908 Lee Dr NW, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>135</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> <strong>12-mo</strong> lease</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9" y2="9" /><line x1="15" y1="9" x2="15" y2="9" /></svg> Pets OK</span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">All utilities</span>
            <span className="pill-incl">Furnished</span>
            <span className="pill-incl">Wi-Fi</span>
            <span className="pill-incl">Parking</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Available <strong>May 1</strong></span>
            <span className="card-cta">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
          </div>
        </div>
      </a>

      <a className="card" href="apply.html" data-rent="725" data-beds="1" data-type="coliving" data-status="soon" data-days="32">
        <div className="card-photo amber">
          <div className="card-badges">
            <span className="badge badge-soon">Available June 1</span>
            <span className="badge badge-new">New</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            8 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$725<small>/mo</small></div>
          <div className="card-title">Room B · Co-living house</div>
          <div className="card-addr">908 Lee Dr NW, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>120</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> <strong>12-mo</strong> lease</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9" y2="9" /><line x1="15" y1="9" x2="15" y2="9" /></svg> Pets OK</span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">All utilities</span>
            <span className="pill-incl">Furnished</span>
            <span className="pill-incl">Wi-Fi</span>
            <span className="pill-incl">Quietest room</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Available <strong>June 1</strong></span>
            <span className="card-cta">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
          </div>
        </div>
      </a>

      <div className="card unavailable" data-rent="700" data-beds="1" data-type="coliving" data-status="occupied">
        <div className="card-photo dusk">
          <div className="card-badges">
            <span className="badge badge-occupied">Occupied · waitlist open</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            6 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$700<small>/mo</small></div>
          <div className="card-title">Room C · Co-living house</div>
          <div className="card-addr">908 Lee Dr NW, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>110</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> <strong>Until Dec 2026</strong></span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">All utilities</span>
            <span className="pill-incl">Furnished</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Next opening <strong>Jan 2027</strong></span>
            <a className="card-cta-disabled" style={{cursor: "pointer"}}>Join waitlist</a>
          </div>
        </div>
      </div>

      <a className="card" href="apply.html" data-rent="1450" data-beds="1" data-type="studio" data-status="available" data-days="24">
        <div className="card-photo morning">
          <div className="card-badges">
            <span className="badge badge-available">Available May 8</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            14 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$1,450<small>/mo</small></div>
          <div className="card-title">Garden studio · Five Points</div>
          <div className="card-addr">412 Walker Ave, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>520</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Private entry</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9" y2="9" /><line x1="15" y1="9" x2="15" y2="9" /></svg> Cats only</span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">Water included</span>
            <span className="pill-incl">Backyard access</span>
            <span className="pill-incl">In-unit laundry</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Available <strong>May 8</strong></span>
            <span className="card-cta">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
          </div>
        </div>
      </a>

      <a className="card" href="apply.html" data-rent="1850" data-beds="2" data-type="single" data-status="available" data-days="44">
        <div className="card-photo creek">
          <div className="card-badges">
            <span className="badge badge-soon">Available June 15</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            22 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$1,850<small>/mo</small></div>
          <div className="card-title">2BR cottage · Monte Sano</div>
          <div className="card-addr">2104 Bankhead Pkwy, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>980</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22v-5l5-5 5 5-5 5z" /><path d="M9.5 14.5 5 19" /></svg> 2 bed · 1 bath</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9" y2="9" /><line x1="15" y1="9" x2="15" y2="9" /></svg> Dogs OK</span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">Fenced yard</span>
            <span className="pill-incl">Carport</span>
            <span className="pill-incl">Hardwoods</span>
            <span className="pill-incl">W/D included</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Available <strong>June 15</strong></span>
            <span className="card-cta">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
          </div>
        </div>
      </a>

      <a className="card" href="apply.html" data-rent="950" data-beds="0" data-type="apartment" data-status="available" data-days="61">
        <div className="card-photo evening">
          <div className="card-badges">
            <span className="badge badge-soon">Available July 1</span>
          </div>
          <div className="card-photo-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg>
            10 photos
          </div>
        </div>
        <div className="card-body">
          <div className="card-rent">$950<small>/mo</small></div>
          <div className="card-title">Loft studio · Downtown</div>
          <div className="card-addr">221 Holmes Ave NE, Huntsville</div>
          <div className="card-meta">
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 12h8M3 7l2-4h14l2 4" /></svg> <strong>410</strong> sq ft</span>
            <span className="card-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Doorman building</span>
            <span className="card-meta-item">No pets</span>
          </div>
          <div className="card-includes">
            <span className="pill-incl">Walkable</span>
            <span className="pill-incl">Roof deck</span>
            <span className="pill-incl">Gym</span>
          </div>
          <div className="card-foot">
            <span className="card-available">Available <strong>July 1</strong></span>
            <span className="card-cta">Apply <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
          </div>
        </div>
      </a>

    </div>

    
    <div className="empty" id="empty">
      <div className="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </div>
      <h3>No homes match those filters</h3>
      <p>Try widening your rent or move-in window — or join the waitlist and we'll email you the moment something opens up.</p>
      <button className="btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        Clear filters
      </button>
    </div>
  </section>

  
  <section className="about">
    <div className="about-card">
      <div>
        <div className="about-eyebrow">About Black Bear</div>
        <h2>Built by an operator who actually fixes things.</h2>
        <p>Black Bear Rentals is a Huntsville-based co-living and small-portfolio operator. We focus on furnished rooms in great houses near UAH and downtown — the kind of places we'd want to live in ourselves.</p>
        <p>Our application process is online, our maintenance response is under 24 hours, and we read every word of every application. Most decisions in 48 hours.</p>
      </div>
      <div className="about-stats">
        <div className="about-stat">
          <div className="about-stat-num">4.9</div>
          <div className="about-stat-label">Tenant rating · 38 reviews</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">&lt;24h</div>
          <div className="about-stat-label">Maintenance response time</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">15+</div>
          <div className="about-stat-label">Rooms across Huntsville</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">96%</div>
          <div className="about-stat-label">Annual occupancy rate</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="faq-strip">
    <div className="faq-strip-head">
      <h2>Common questions</h2>
      <p>Reach out at <a href="mailto:hello@rentblackbear.com" style={{color: "var(--brand)", fontWeight: "600"}}>hello@rentblackbear.com</a> if you don't see your answer.</p>
    </div>
    <div className="faq-item">
      <button className="faq-q">What's included in rent? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      <div className="faq-a">For our co-living rooms, rent includes electricity, gas, water, sewer, trash, internet, lawn care, all furniture, and access to shared kitchen, laundry, and living areas. The studio and house listings vary — each card lists what's included.</div>
    </div>
    <div className="faq-item">
      <button className="faq-q">How long does the application take? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      <div className="faq-a">About 6 minutes to fill out, plus a few minutes to upload your ID and pay stub. After you submit, we run automated credit/background checks (~10 min) and call your current landlord and employer. You'll hear back within 48 hours, often sooner.</div>
    </div>
    <div className="faq-item">
      <button className="faq-q">Is the $45 application fee refundable? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      <div className="faq-a">No — it pays for the credit and background checks plus the time we spend personally reviewing your file. You only pay it if you decide to submit. We'll never charge you to look.</div>
    </div>
    <div className="faq-item">
      <button className="faq-q">What's your pet policy? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      <div className="faq-a">Pet-friendly across most properties, with a $250 refundable pet deposit per animal. Each listing notes the specific pet rules — no aggressive breeds, no more than 2 pets per unit. Service animals are always welcome with no deposit.</div>
    </div>
    <div className="faq-item">
      <button className="faq-q">Can I tour before applying? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
      <div className="faq-a">Yes — email us and we'll set up a 20-minute walkthrough. For shared houses we ask that you also chat with your future housemates over a coffee. Both are free, no commitment.</div>
    </div>
  </section>

  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Fair Housing</a> · <a href="#">Accessibility</a> · <a href="#">Privacy</a></div>
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>

  

    </>
  );
}
