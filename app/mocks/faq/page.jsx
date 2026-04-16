"use client";

// Mock ported from ~/Desktop/blackbear/faq.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 64px 32px 24px; text-align: center; max-width: 900px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 52px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      margin: 0 auto 16px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 17px; color: var(--text-muted);\n      max-width: 620px; margin: 0 auto 28px; line-height: 1.55;\n    }\n\n    /* ===== Search ===== */\n    .search-wrap { max-width: 720px; margin: 0 auto 8px; padding: 0 32px; }\n    .search-box {\n      position: relative; background: var(--surface);\n      border: 2px solid var(--border); border-radius: 100px;\n      transition: all 0.15s ease;\n      box-shadow: var(--shadow-sm);\n    }\n    .search-box:focus-within { border-color: var(--blue); box-shadow: 0 0 0 4px var(--blue-pale), var(--shadow); }\n    .search-box svg.search-icon {\n      position: absolute; left: 22px; top: 50%; transform: translateY(-50%);\n      width: 20px; height: 20px; color: var(--text-faint);\n    }\n    .search-input {\n      width: 100%; padding: 20px 22px 20px 56px;\n      border: none; background: transparent; outline: none;\n      font-size: 16px; font-family: inherit; color: var(--text);\n      border-radius: 100px;\n    }\n    .search-input::placeholder { color: var(--text-faint); }\n    .search-meta {\n      text-align: center; font-size: 13px; color: var(--text-faint);\n      margin-top: 14px; padding: 0 32px;\n    }\n    .search-meta strong { color: var(--text-muted); font-weight: 600; }\n\n    /* ===== Main layout ===== */\n    .main-wrap {\n      max-width: 1200px; margin: 48px auto 0; padding: 0 32px;\n      display: grid; grid-template-columns: 240px 1fr; gap: 48px;\n    }\n\n    /* Jump-nav */\n    .jump-nav {\n      position: sticky; top: 88px; align-self: start;\n      max-height: calc(100vh - 120px); overflow-y: auto;\n      padding-right: 8px;\n    }\n    .jump-nav-title {\n      font-size: 11px; font-weight: 800; color: var(--text-muted);\n      letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 14px;\n    }\n    .jump-nav-list { display: flex; flex-direction: column; gap: 2px; }\n    .jump-nav-list a {\n      display: flex; align-items: center; gap: 10px;\n      padding: 9px 12px; border-radius: var(--radius);\n      font-size: 13.5px; font-weight: 500; color: var(--text-muted);\n      border-left: 2px solid transparent;\n      transition: all 0.15s ease;\n    }\n    .jump-nav-list a:hover { background: var(--surface-alt); color: var(--text); }\n    .jump-nav-list a.active {\n      color: var(--blue); background: var(--blue-pale);\n      border-left-color: var(--blue); font-weight: 600;\n    }\n    .jump-nav-list a .count {\n      margin-left: auto; font-size: 11px; color: var(--text-faint);\n      background: var(--surface-alt); padding: 2px 7px; border-radius: 100px;\n      font-weight: 600;\n    }\n    .jump-nav-list a.active .count { background: var(--surface); color: var(--blue); }\n\n    /* Content */\n    .content { min-width: 0; }\n    .faq-section {\n      margin-bottom: 56px; scroll-margin-top: 88px;\n    }\n    .faq-section:last-child { margin-bottom: 0; }\n    .faq-section-head {\n      display: flex; align-items: center; gap: 12px;\n      margin-bottom: 20px; padding-bottom: 16px;\n      border-bottom: 1px solid var(--border);\n    }\n    .faq-section-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .faq-section-icon svg { width: 20px; height: 20px; }\n    .faq-section-title {\n      font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text);\n    }\n    .faq-section-sub {\n      font-size: 13px; color: var(--text-muted); margin-top: 2px;\n    }\n\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-item.hidden { display: none; }\n    .faq-q {\n      padding: 18px 22px; font-weight: 600; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center; gap: 16px;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q .q-text { line-height: 1.45; }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.3s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 800px; padding: 0 22px 18px; }\n    .faq-a p + p { margin-top: 10px; }\n    .faq-a strong { color: var(--text); font-weight: 600; }\n    .faq-a a { color: var(--blue); font-weight: 600; border-bottom: 1px solid var(--blue-pale); }\n    .faq-a a:hover { border-bottom-color: var(--blue); }\n    .faq-a code {\n      background: var(--surface-alt); padding: 2px 6px; border-radius: 4px;\n      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px;\n      color: var(--text);\n    }\n\n    .helpful {\n      margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border);\n      display: flex; align-items: center; gap: 10px;\n      font-size: 12px; color: var(--text-faint);\n    }\n    .helpful-label { font-weight: 600; }\n    .helpful-btn {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 5px 11px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .helpful-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }\n    .helpful-btn.active { background: var(--green-bg); color: var(--green-dark); border-color: var(--green); }\n    .helpful-btn.active-no { background: var(--pink-bg); color: #c21a6a; border-color: var(--pink); }\n    .helpful-btn svg { width: 12px; height: 12px; }\n\n    /* Empty state */\n    .empty-state {\n      padding: 60px 32px; text-align: center;\n      background: var(--surface-subtle); border: 1px dashed var(--border);\n      border-radius: var(--radius-lg); display: none;\n    }\n    .empty-state.show { display: block; }\n    .empty-state svg { width: 36px; height: 36px; color: var(--text-faint); margin: 0 auto 14px; }\n    .empty-state h3 { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 6px; }\n    .empty-state p { font-size: 14px; color: var(--text-muted); max-width: 420px; margin: 0 auto; }\n\n    /* ===== Didn't see your question callout ===== */\n    .unanswered {\n      max-width: 1000px; margin: 88px auto 0; padding: 0 32px;\n    }\n    .unans-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 48px 44px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .unans-card::before {\n      content: \"\"; position: absolute; top: -60px; right: -80px;\n      width: 300px; height: 300px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .unans-card::after {\n      content: \"\"; position: absolute; bottom: -100px; left: -60px;\n      width: 280px; height: 280px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(18,81,173,0.35), transparent 70%);\n    }\n    .unans-card > * { position: relative; z-index: 1; }\n    .unans-label {\n      display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.14em;\n      text-transform: uppercase; color: var(--pink);\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--pink-bg); margin-bottom: 16px;\n    }\n    .unans-card h2 {\n      font-size: clamp(26px, 3.5vw, 36px); font-weight: 800;\n      letter-spacing: -0.025em; margin-bottom: 10px;\n    }\n    .unans-card p {\n      font-size: 15px; color: rgba(255,255,255,0.75);\n      max-width: 560px; margin: 0 auto 28px; line-height: 1.55;\n    }\n    .unans-actions {\n      display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;\n    }\n    .unans-actions .btn-ghost {\n      color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05);\n    }\n    .unans-actions .btn-ghost:hover {\n      border-color: #fff; background: rgba(255,255,255,0.12); color: #fff;\n    }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .main-wrap { grid-template-columns: 1fr; gap: 24px; }\n      .jump-nav {\n        position: static; max-height: none; overflow: visible;\n        background: var(--surface-subtle); border: 1px solid var(--border);\n        border-radius: var(--radius-lg); padding: 16px;\n      }\n      .jump-nav-list { flex-direction: row; flex-wrap: wrap; }\n      .jump-nav-list a { border-left: none; padding: 7px 12px; }\n      .jump-nav-list a.active { border-left: none; }\n      .jump-nav-list a .count { margin-left: 6px; }\n    }\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 44px 20px 24px; }\n      .search-wrap, .main-wrap, .unanswered { padding-left: 16px; padding-right: 16px; }\n      .unans-card { padding: 32px 20px; }\n      .faq-q { padding: 16px 18px; font-size: 14.5px; }\n      .faq-item.open .faq-a { padding: 0 18px 16px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="faq.html">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      Help center
    </div>
    <h1>Frequently asked <em>questions</em>.</h1>
    <p className="hero-sub">The ones we actually hear. Search, or jump to a section.</p>
  </section>

  
  <div className="search-wrap">
    <div className="search-box">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      <input className="search-input" id="searchInput" type="text" placeholder={"Try \"ACH fee\", \"roommate\", \"cancel\", \"1099\"..."} autoComplete="off" spellCheck="false" />
    </div>
    <div className="search-meta">
      <span id="searchCount"><strong>48</strong> questions across 8 sections</span>
    </div>
  </div>

  
  <div className="main-wrap">

    
    <aside className="jump-nav">
      <div className="jump-nav-title">Jump to</div>
      <div className="jump-nav-list" id="jumpNav">
        <a href="#pricing" data-section="pricing">Pricing &amp; plans <span className="count">7</span></a>
        <a href="#getting-started" data-section="getting-started">Getting started <span className="count">6</span></a>
        <a href="#payments" data-section="payments">Rent &amp; payments <span className="count">7</span></a>
        <a href="#tenants-apps" data-section="tenants-apps">Tenants &amp; applications <span className="count">6</span></a>
        <a href="#leases" data-section="leases">Leases &amp; documents <span className="count">6</span></a>
        <a href="#accounting" data-section="accounting">Accounting &amp; taxes <span className="count">6</span></a>
        <a href="#tenants-asking" data-section="tenants-asking">For tenants <span className="count">5</span></a>
        <a href="#security" data-section="security">Security &amp; trust <span className="count">5</span></a>
      </div>
    </aside>

    
    <main className="content">

      
      <div className="empty-state" id="emptyState">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
        <h3>No matches for that search</h3>
        <p>Try a shorter phrase, or <a href="mailto:hello@rentblackbear.com" style={{color: "var(--blue)", fontWeight: "600"}}>email us</a> and we'll answer directly (and add it here).</p>
      </div>

      
      <section className="faq-section" id="pricing" data-section="pricing">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Pricing &amp; plans</div>
            <div className="faq-section-sub">Trials, upgrades, unit limits, the guarantee.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do I need a credit card to start a trial?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>No. The 14-day trial asks for an email and your first property address, nothing else. We don't collect a card until you actively choose a plan on day 14 (or sooner if you want to lock in Founders pricing). If you don't pick a plan, your account pauses — we don't auto-charge you into existence.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What's the Founders cohort and how do I get it?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Founders is the first 200 paid customers. You get <strong>$99/mo locked for life</strong> on the Pro plan (normally $149 after we exit Founders), a free data migration, a free custom lease template reviewed against your state laws, and a 45-minute onboarding call where we set up your first property with you.</p>
              <p>To claim a spot, start a trial and convert before we hit 200 paid accounts. We show the live counter on <a href="pricing.html">pricing.html</a>. Once it's gone, it's gone — we don't reopen it for anyone, not even my mother-in-law.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I upgrade or downgrade mid-subscription?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes, both directions, one click in Settings &rarr; Billing. Upgrades prorate immediately — if you're 10 days into the month on Starter and upgrade to Pro, you pay the difference for the remaining 20 days, not a full month.</p>
              <p>Downgrades take effect at the next billing cycle so you don't lose paid time, and we never downgrade you automatically if your unit count drops — you have to click it yourself.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What happens if I exceed my plan's unit limit?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>We email you at 80% of your cap (4 of 5 on Starter, 40 of 50 on Pro) with a heads-up. Add a unit that pushes you over, and you get 30 days at your current price before we auto-bump you to the next tier. Nothing breaks — we don't freeze your portal or stop rent collection. We just bill differently next cycle.</p>
              <p>If you legitimately need more than the next tier offers, we have a "portfolio" arrangement — <a href="mailto:hello@rentblackbear.com">email us</a>.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do you offer annual billing discounts?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. Annual billing is roughly two months free — on Pro that's $82/mo billed annually ($990/yr) vs. $99/mo monthly ($1,188/yr). You can toggle between monthly and annual on the pricing page before signing up, or switch in Settings &rarr; Billing after the fact.</p>
              <p>Annual customers also get a no-questions prorated refund if you cancel in the first 60 days of a yearly cycle.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Is there a setup fee or migration fee?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>No. Setup is free on every plan. Data migration from AppFolio, Buildium, DoorLoop, Rentec, or a spreadsheet is free on Pro and Scale — you export a CSV from your current system, we map and import it, and you get to review everything before it goes live. Typical migration is 48–72 hours.</p>
              <p>Starter plan users can self-import via our CSV template (takes about 15 minutes). The only thing that ever costs extra is SMS/phone concierge at $0.02 per message, and that's optional.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How does the $100 guarantee actually work?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>You get a 14-day free trial (no card), then 30 days as a paying customer. On day 30, your dashboard shows a "time saved" report — hours you spent in Black Bear Rentals vs. the manual equivalent we benchmark against. If the number is less than 10 hours, email us one line: "I'd like the guarantee." We refund every dollar you've paid <strong>and</strong> wire $100 to your bank for wasting your time.</p>
              <p>No interrogation, no "let's get on a call first", no asking you to try three more features. We do this because if we can't save you 10 hours a month, we haven't earned the subscription.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="getting-started" data-section="getting-started">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Getting started</div>
            <div className="faq-section-sub">First day, migrations, state laws, whether you need an IT person.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How long does setup take?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>About 20 minutes for one property from scratch — address, unit count, current tenants, bank account for payouts, lease template. Inviting your first tenant is another two minutes. After that, rent collection starts on the next due date you pick.</p>
              <p>If you're migrating a portfolio, the import itself takes us 48–72 hours behind the scenes, and you keep using your current tool until we say "go." The cutover itself is a 15-minute checklist you do on a Sunday.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do I need to be tech-savvy?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>If you can use Gmail and online banking, you can run Black Bear Rentals. There's no IT setup, no VPN, no server, no Chrome extension. You sign in from a browser — phone, laptop, whatever.</p>
              <p>We deliberately don't have a 40-button admin screen. If a feature is buried behind settings, we've failed the design. Our benchmark is "a landlord who hates tech can run a first rent payment in 20 minutes without calling us."</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I import data from AppFolio, Buildium, or DoorLoop?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. For each of those platforms we have a documented CSV export recipe at <a href="import.html">import.html</a>. You export tenants, properties, leases, and the last 12 months of payment history, and we import them — preserving lease start/end dates, deposit amounts, and recurring rent charges.</p>
              <p>Signed lease PDFs come over as-is and stay attached to each unit. If you've already collected deposits, we import those as liability entries so your books still balance on day one. Migration is free on Pro and Scale.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What if I'm coming from spreadsheets?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Most of our early customers came from Google Sheets or Excel, so we've made this easy. Download our template (one row per unit, one sheet per section), paste in what you have, upload it. Missing columns are fine — we'll prompt for just the minimum we need to collect rent.</p>
              <p>If your spreadsheet is a mess (it's always a mess, that's okay), send it to us and we'll do the reformatting for free. Pro tip: don't try to reconcile past history. Start clean from your next rent due date — the old stuff stays in the spreadsheet for taxes.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do you work with my state's lease laws?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>We have state-specific lease templates for all 50 states and DC, reviewed annually by a real-estate attorney in each state. Required disclosures (lead paint, mold, bedbug, eviction history) are baked in based on the property address. Grace periods, late fee caps, and notice-to-enter rules are pre-configured by state.</p>
              <p>If you're in a city with extra rules (NYC, SF, LA, Chicago, Seattle, DC), we add the municipal layer on top. We are <strong>not</strong> a replacement for your attorney on tricky cases — eviction, habitability disputes, rent-control, ESA conflicts. Use the template for normal leasing, use your lawyer for disputes.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I run this as a side-hustle landlord?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes — that's literally who we built it for first. If you own one to five doors while holding a day job, Starter at $39/mo is designed so the time it saves pays for itself on month one. Autopay, automatic late fees, and maintenance ticketing mean you're not getting 11pm phone calls about rent or leaky faucets.</p>
              <p>A lot of our Starter users check the dashboard once a week on Sunday morning with coffee. That's it. That's the job.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="payments" data-section="payments">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Rent &amp; payments</div>
            <div className="faq-section-sub">How money moves, fees, late charges, bounced ACH.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How do my tenants pay?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Tenants get a branded portal link (yourname.rentblackbear.com or your own domain on Scale). They can pay by ACH (bank account), debit card, or credit card. Autopay is one click — most of your tenants will turn it on during move-in because it kills late fees.</p>
              <p>For tenants who insist on paying with cash or check, you can still record a manual payment in the app. And for the wire-transfer types, there's a direct-deposit reference number on every invoice.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What are the ACH and card fees?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p><strong>ACH is free</strong> for you and free for the tenant — Stripe passes through at no cost and we eat the pennies. <strong>Debit card is 2.95%</strong> and <strong>credit card is 2.95%</strong>, charged to the tenant by default (you can toggle to absorb it if you want, but nobody does).</p>
              <p>No monthly gateway fee, no minimums, no per-transaction fee on top. ACH returns cost $4 if a payment bounces, also passed to the tenant.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Who holds my money — you or me?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>You do. Black Bear Rentals is not a custodian — we don't hold rent in a pooled account with our name on it. Payments go through Stripe Connect, where each landlord has their own Stripe account connected to their own bank. Money goes tenant &rarr; Stripe &rarr; your bank. Black Bear Rentals never touches the funds.</p>
              <p>For security deposits, we recommend a separate sub-account you create with your bank (many states require this anyway). We help you track it; we don't hold it.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">When do I get paid out?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>ACH payments land in your bank <strong>2 business days</strong> after the tenant pays. Card payments land <strong>next business day</strong>. The first payout after connecting a new bank takes 5–7 days because Stripe verifies your account — after that it's the schedule above.</p>
              <p>You can switch to weekly rollup if you prefer fewer deposits on your statement. If a payout fails (closed account, ACH return from your side), you get an email with next steps within 24 hours.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What about split rent between roommates?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Add each roommate as a co-tenant on the lease, and the rent is split evenly by default — or you can set custom splits (say, the master-bedroom tenant pays more). Each roommate gets their own invoice, pays their own share, with their own autopay schedule.</p>
              <p>Miss a share? Only that roommate is flagged late — the others still show current. For student and coliving setups this is the feature people don't realize they need until they've lived without it. See <a href="roommate.html">roommate.html</a> for the full flow.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What happens when a payment bounces?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>If an ACH returns (insufficient funds, closed account, unauthorized), we email you and the tenant within an hour. The invoice flips back to "unpaid," the $4 return fee is added to the tenant's balance, and your configured late-fee policy kicks in if the grace window has passed.</p>
              <p>We automatically retry the ACH once, three business days later, unless the return code is R01 (insufficient funds) — in that case we don't retry, because banks charge the tenant an overdraft fee on the second bounce and they hate us for it.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I add late fees automatically?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. In Settings &rarr; Late fees you set a grace window (usually 3–5 days after due date), a fee type (flat dollar amount, percentage of rent, or tiered escalation), and a cap. The system respects your state's legal late-fee max automatically — so you can't accidentally charge 15% in a state that caps it at 5%.</p>
              <p>Late fees post the moment the grace period expires, appear on the tenant's next invoice, and are notated on their ledger. You can waive any single late fee with a one-click override and a one-line reason stored for audit.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="tenants-apps" data-section="tenants-apps">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Tenants &amp; applications</div>
            <div className="faq-section-sub">Screening, fees, cosigners, FCRA compliance.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How do tenants apply?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>You share a listing link — yourname.rentblackbear.com/apply/unit-name, or your own domain on Scale. The applicant fills out a single-page form (identity, income, employment, rental history, pets, move-in date) and pays the $45 application fee from their card.</p>
              <p>Behind the scenes we run credit, criminal background, eviction history, and income verification via TransUnion SmartMove-equivalent checks. You get a scored report in your dashboard within 15–60 minutes.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Who pays the $45 application fee?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>The applicant pays it, by default, directly from their card at submission. The $45 covers the actual cost of the credit/criminal/eviction reports — we don't mark it up. You can set a lower fee or waive it entirely per listing (useful for repeat tenants or internal transfers).</p>
              <p>Some states cap application fees (California is $62.02, New York is $20, Washington has disclosure rules) — we enforce the cap automatically based on the property address.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What credit and background check do you run?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>A soft-pull credit report (no impact on the applicant's score), nationwide criminal record check, nationwide eviction records, and income verification via either pay-stub upload, Plaid bank connection, or employer letter. The credit data comes from TransUnion.</p>
              <p>You get a report with a clear recommendation (approve / conditional / decline) plus the raw data so you can decide for yourself. We also flag anything that looks fraudulent (SSN mismatch, IP/geo inconsistency, fake pay stubs we've seen before).</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I require cosigners?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. You can set a per-listing rule like "require cosigner if applicant credit &lt; 650" or "require cosigner for all students," and the application flow will automatically prompt the applicant to invite one. The cosigner fills out a short parallel form, pays their own $45, and gets screened the same way.</p>
              <p>Cosigners sign the lease as a guarantor, and their obligation shows up in your dashboard for the duration of the lease. Common setup for student housing — see <a href="for-students.html">for-students.html</a>.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What if my applicant is self-employed?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Self-employed applicants can submit the last two years of tax returns (1040 with Schedule C or K-1), six months of business bank statements via Plaid, or a CPA letter. Our income verification handles all three and produces a "verified monthly income" number you can compare against rent.</p>
              <p>We deliberately don't auto-decline self-employed — a contractor making $180k on 1099s is a better tenant than a W-2 employee making $40k. You see the data, you make the call.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Is there an FCRA-compliant rejection letter?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. When you mark an application as declined, the applicant automatically gets an FCRA-compliant adverse action notice — generated with the credit bureau's name and contact info, the specific reasons for denial (from our pre-approved reason codes that comply with HUD fair housing rules), and instructions on how to dispute.</p>
              <p>You never have to draft this yourself. The exact letter is archived with the application so you have a record if a fair-housing complaint ever surfaces. See <a href="tenant-declined.html">tenant-declined.html</a> for the template preview.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="leases" data-section="leases">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Leases &amp; documents</div>
            <div className="faq-section-sub">Templates, e-sign, amendments, renewals.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do you have state-specific lease templates?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes, for all 50 states and DC — attorney-reviewed annually and updated when state law changes (we track it). The template picks up your property address, rent, deposit, pets, parking, utilities, and late-fee rules automatically, fills in the state-required disclosures, and produces a ready-to-sign PDF in under a minute.</p>
              <p>Local add-ons (NYC, SF, LA, Chicago, Seattle, DC, rent-control riders) are applied automatically if your address is in-scope.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Is your e-sign legally binding?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. Our e-signature complies with the U.S. ESIGN Act and UETA (the two federal + state frameworks that make electronic signatures legally equivalent to ink on paper). Every signature produces an audit trail: signer identity, email verification, IP address, geolocation, timestamp, and a cryptographic hash of the final document.</p>
              <p>If you ever end up in court over a lease, you can download a tamper-evident certificate of completion that has held up in every eviction case we've seen. We don't practice law, but DocuSign and Dropbox Sign use the same framework.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I use my own custom lease?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. Upload your own PDF or Word doc, drag signature/date/initial fields onto the pages, and it's ready to send. You can save your custom lease as a template and reuse it across properties. Merge fields (tenant name, rent, start date, address) work with your uploaded doc, too.</p>
              <p>Most Pro customers upload their existing lease on day one and never look at our template. That's fine — we want you to use what your attorney already blessed.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Where are signed leases stored?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Inside your workspace, attached to each unit and each tenant, forever — even after they move out. Signed PDFs are stored encrypted at rest (AES-256) in US-region cloud storage, backed up nightly to a second region. Tenants keep access to their signed lease in their portal for seven years post-move-out.</p>
              <p>You can download any lease as a PDF anytime, or bulk-export all leases for an attorney review. If you cancel Black Bear Rentals, you get a ZIP of every document in your workspace on the way out.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How do I amend a lease mid-term?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>From the lease detail page, click "Add amendment." You can change rent, add or remove a roommate, update pet policy, adjust parking, or attach any free-form rider. The amendment generates as a separate one-pager, references the original lease, and both parties e-sign it. The original lease stays intact — you now have the original PDF plus the addendum stored together.</p>
              <p>Rent changes auto-apply to the next invoice on the date you pick. No double-billing, no manual ledger surgery.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What happens at renewal time?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>90 days before the current lease ends, you get a renewal queue entry for each unit. You choose a renewal rent (we suggest a number based on local comps) or let the lease go month-to-month, and with one click we send the tenant a pre-filled renewal offer. They e-sign or decline from their portal.</p>
              <p>If they decline, the unit flips to "notice given" status and goes onto your vacancy timeline. If they ignore the offer, we nudge them at 60, 30, and 15 days before lease-end. See the full flow at <a href="renew.html">renew.html</a>.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="accounting" data-section="accounting">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="3" y1="20" x2="21" y2="20" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Accounting &amp; taxes</div>
            <div className="faq-section-sub">QuickBooks, Schedule E, 1099s, CPA access.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Will my accountant understand this?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. We produce standard real-estate chart-of-accounts output: rent income, late fees, pet fees, operating expenses (by IRS category), capital expenses, depreciation schedule, and a property-by-property P&amp;L. Every number traces to an underlying transaction — your CPA can drill from the Schedule E line item back to the exact ACH deposit or repair invoice.</p>
              <p>If your CPA wants raw data, we export to CSV, IIF (QuickBooks), or a formatted PDF packet. Nobody's ever asked us for something we couldn't produce.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Do you sync with QuickBooks?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes, on Pro and Scale. Connect your QuickBooks Online account (one click, OAuth) and Black Bear Rentals pushes rent receipts, deposits, expenses, and fees as journal entries on a nightly sync. Property-level class codes map to your QB locations so your P&amp;L stays per-property.</p>
              <p>If you prefer to not sync, the manual export is a one-click IIF file you drop into QuickBooks Desktop. Either way, you're not double-entering anything.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How does Schedule E work?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>In January you click "Generate Schedule E packet." We produce a per-property Schedule E PDF with every line IRS expects (rent income, advertising, repairs, insurance, mortgage interest, taxes, utilities, depreciation), a supporting ledger for each line, and receipts attached. You hand it to your CPA and the return takes them 30 minutes instead of three hours.</p>
              <p>If you file yourself with TurboTax, the data exports to TurboTax-compatible format. See <a href="tax-pack.html">tax-pack.html</a> for a sample.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Will I get a 1099 for my vendors?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. For any vendor you've paid $600+ in a calendar year, we generate a 1099-NEC, collect the W-9 from the vendor automatically (they fill it out once in their vendor portal), and e-file with the IRS on your behalf in January. You get the vendor's copy emailed and a file-stamped IRS confirmation.</p>
              <p>Black Bear Rentals also generates your 1099-K reconciliation if Stripe issued one to you — so your total "rent income per the IRS" matches what you actually received. Included on Pro and Scale at no extra cost.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What about multi-LLC tax tracking?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Every property can be assigned to a specific legal entity (LLC, sole prop, S-corp, partnership). Income, expenses, bank payouts, and 1099s all segregate by entity. At tax time you get one Schedule E packet per LLC, ready for that LLC's return.</p>
              <p>We support as many entities as you need on the same login, no extra charge. Common setup for investors with asset-protection structures — one LLC per property, one master dashboard.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can I give my CPA access?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. Invite your CPA with a "read-only accountant" role, no extra cost. They see all reports and transactions, can export anything, but can't edit rent, send invoices, or touch tenant data. You can revoke access with one click after tax season.</p>
              <p>CPAs who handle multiple Black Bear Rentals clients get a multi-client dashboard so they can jump between workspaces without logging out. A few of our most senior CPA partners have consolidated 20+ landlord clients on our accountant portal.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="tenants-asking" data-section="tenants-asking">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div>
            <div className="faq-section-title">For tenants</div>
            <div className="faq-section-sub">If you rent from a Black Bear Rentals landlord and showed up here confused.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Why is my rent going through Black Bear Rentals?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Your landlord uses Black Bear Rentals to manage their properties, which means rent is paid online instead of by check or cash app. You still rent from your landlord — we're the software they use to handle invoicing, leases, and maintenance tickets. Your rent still goes to your landlord's bank account, not ours.</p>
              <p>If you have a question about your lease or a repair, you contact your landlord through the portal. If you have a question about the <em>portal itself</em> (can't log in, card won't work), email us at <a href="mailto:support@rentblackbear.com">support@rentblackbear.com</a>.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Is my information safe?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. Your bank info and card data never touch Black Bear Rentals's servers — it's stored by Stripe, which is PCI Level 1 (the highest standard) and used by Target, Shopify, and Lyft. Your Social Security number (submitted during application screening) is encrypted end-to-end and not visible to your landlord in plaintext.</p>
              <p>We never sell data. We never share your info with marketers. Read the full <a href="privacy.html">privacy policy</a> for the specifics.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">How do I set up autopay?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Log into your tenant portal, click Payments &rarr; Autopay, and pick the day of the month you want rent pulled (most people pick the 1st or the day after their paycheck lands). Choose ACH (free) or card (2.95%). Toggle it on and you're done.</p>
              <p>You can pause or change autopay anytime — there's no 30-day lock-in. You'll always get an email the day before autopay runs so nothing surprises you.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Who do I contact if something breaks?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>If something broke in your apartment (leak, HVAC, busted appliance), file a maintenance ticket inside your portal — your landlord gets notified instantly with photos and a description. Emergencies (no heat, flooding, smell of gas) route to your landlord's emergency line.</p>
              <p>If the portal itself is broken (can't log in, payment failed, page won't load), email <a href="mailto:support@rentblackbear.com">support@rentblackbear.com</a> and we reply within a few hours, weekends included.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What happens when my lease ends?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>About 90 days before your lease ends, your landlord either sends you a renewal offer through the portal (you accept, decline, or negotiate) or sends a notice of non-renewal. Either way you'll get an email — check your portal for the details.</p>
              <p>At move-out, your security deposit gets itemized in the portal with photos and receipts for any deductions. Most states require this within 14–30 days of move-out. You keep portal access for seven years to look up past payments or the signed lease for background checks, apartments, etc.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

      
      <section className="faq-section" id="security" data-section="security">
        <div className="faq-section-head">
          <div className="faq-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <div className="faq-section-title">Security &amp; trust</div>
            <div className="faq-section-sub">Encryption, compliance, bus-factor, data agreements.</div>
          </div>
        </div>
        <div className="faq-list">

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Is my data encrypted?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Yes. In transit: TLS 1.3 everywhere, no exceptions. At rest: AES-256 on all databases, file storage, and backups. Passwords are never stored — authentication runs through Clerk (OAuth, magic link, or passkey). Sensitive fields like SSN are additionally field-level encrypted so even our engineers can't read them in logs.</p>
              <p>Full technical detail is at <a href="security.html">security.html</a>, including our sub-processor list and threat model.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Are you SOC 2 certified?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>We are in an active SOC 2 Type I audit as of Q1 2026, targeting Type II by end of year. Our underlying infrastructure (Vercel, Supabase, Stripe, Clerk) is all SOC 2 Type II certified today, so the data path itself has been audited end-to-end — it's our internal controls that are in final review.</p>
              <p>If you need the current Type I letter, our Trust Center (available on request) will include it, along with penetration test results and our data retention policies. Email <a href="mailto:security@rentblackbear.com">security@rentblackbear.com</a>.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Can your engineers see my tenant data?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>No, not casually. Production database access is restricted to two people on our team (me and our CTO), requires short-lived tokens that expire in 30 minutes, and every query is logged to an append-only audit trail we can't edit. Customer support staff use a separate "impersonation" tool that's read-only, scoped to one workspace, requires the customer to approve the session, and auto-logs out after 15 minutes.</p>
              <p>We never use production data in development. Staging is seeded with synthetic data we generate ourselves.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">What if you go out of business?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Fair question. We have a documented "orderly shutdown" policy: 90 days notice, full CSV export of all your data (properties, tenants, leases, ledgers, signed PDFs), and rent collection keeps running the entire 90 days so you have time to migrate. Your Stripe Connect account is yours — payouts keep going to your bank regardless of what happens to us.</p>
              <p>We also escrow three months of runway with our payment partner specifically to fund that shutdown process. So even worst case: you're not stranded.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q"><span className="q-text">Where can I get a DPA?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="faq-a">
              <p>Email <a href="mailto:security@rentblackbear.com">security@rentblackbear.com</a> with your entity name and we send back a standard Data Processing Agreement within one business day. GDPR Article 28 compliant, with the Standard Contractual Clauses attached for any EU data subjects you're processing.</p>
              <p>We don't charge for a DPA and we don't make you jump through sales calls. Same for our sub-processor list, our SIG-Lite questionnaire, and our insurance certificates — all available to any customer who asks.</p>
              <div className="helpful"><span className="helpful-label">Was this helpful?</span><button className="helpful-btn" data-vote="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.3-6.88a1.3 1.3 0 0 1 2.38 0Z" /></svg>Yes</button><button className="helpful-btn" data-vote="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.3 6.88a1.3 1.3 0 0 1-2.38 0Z" /></svg>No</button></div>
            </div>
          </div>

        </div>
      </section>

    </main>
  </div>

  
  <section className="unanswered">
    <div className="unans-card">
      <div className="unans-label">Still stuck?</div>
      <h2>Didn't see your question?</h2>
      <p>The three fastest ways to reach a human. Email gets a reply the same business day. The 15-minute call is a screen-share where we open your account and answer in context.</p>
      <div className="unans-actions">
        <a className="btn btn-pink btn-lg" href="mailto:hello@rentblackbear.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Email support
        </a>
        <a className="btn btn-ghost btn-lg" href="demo.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          Book a 15-min call
        </a>
        <a className="btn btn-ghost btn-lg" href="mailto:faq@rentblackbear.com?subject=FAQ%20suggestion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Submit a question
        </a>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="faq.html">FAQ</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
