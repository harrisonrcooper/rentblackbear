"use client";

// Mock ported from ~/Desktop/tenantory/changelog.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 32px; text-align: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero-eyebrow .dot {\n      width: 7px; height: 7px; border-radius: 50%; background: var(--pink);\n      box-shadow: 0 0 0 4px var(--pink-bg);\n      animation: pulse 2s ease-in-out infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { opacity: 1; transform: scale(1); }\n      50% { opacity: 0.6; transform: scale(1.2); }\n    }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 56px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 860px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 680px; margin: 0 auto 0; line-height: 1.55;\n    }\n\n    /* ===== Subscribe ===== */\n    .subscribe {\n      max-width: 820px; margin: 40px auto 0; padding: 0 32px;\n    }\n    .sub-card {\n      background: linear-gradient(180deg, var(--blue-softer) 0%, #fff 100%);\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 22px 24px;\n      display: flex; align-items: center; gap: 14px; flex-wrap: wrap;\n    }\n    .sub-form {\n      display: flex; gap: 10px; flex: 1; min-width: 280px;\n    }\n    .sub-input {\n      flex: 1; padding: 12px 16px; border-radius: 100px; border: 1px solid var(--border-strong);\n      background: var(--surface); font-size: 14px; color: var(--text); font-family: inherit;\n      transition: border-color 0.15s ease, box-shadow 0.15s ease;\n    }\n    .sub-input:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(22,101,216,0.12); }\n    .sub-btn { padding: 12px 20px; }\n    .sub-meta {\n      display: flex; align-items: center; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .sub-meta a {\n      display: inline-flex; align-items: center; gap: 6px;\n      color: var(--text-muted); font-weight: 600; padding: 6px 10px;\n      border-radius: 100px; border: 1px solid var(--border);\n      background: var(--surface); transition: all 0.15s ease;\n    }\n    .sub-meta a:hover { color: var(--blue); border-color: var(--blue); }\n    .sub-meta svg { width: 14px; height: 14px; }\n    .sub-ok {\n      display: none; color: var(--green-dark); font-weight: 600; font-size: 13px;\n      align-items: center; gap: 6px;\n    }\n    .sub-ok svg { width: 14px; height: 14px; }\n    .sub-ok.show { display: inline-flex; }\n\n    /* ===== Filters ===== */\n    .filters-wrap {\n      max-width: 960px; margin: 48px auto 0; padding: 0 32px;\n      position: sticky; top: 65px; z-index: 20;\n      background: rgba(255,255,255,0.92); backdrop-filter: saturate(180%) blur(10px);\n    }\n    .filters {\n      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n      padding: 14px 0; border-bottom: 1px solid var(--border);\n    }\n    .filter-chip {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 7px 14px; border-radius: 100px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border: 1px solid var(--border); background: var(--surface);\n      transition: all 0.15s ease;\n    }\n    .filter-chip:hover { color: var(--text); border-color: var(--border-strong); }\n    .filter-chip.active { color: #fff; background: var(--navy-dark); border-color: var(--navy-dark); }\n    .filter-chip .count {\n      font-size: 11px; padding: 1px 7px; border-radius: 100px;\n      background: var(--surface-alt); color: var(--text-muted); font-weight: 700;\n    }\n    .filter-chip.active .count { background: rgba(255,255,255,0.18); color: #fff; }\n\n    /* ===== Timeline / entries ===== */\n    .log {\n      max-width: 960px; margin: 8px auto 0; padding: 32px 32px 64px;\n      position: relative;\n    }\n    .log::before {\n      content: \"\"; position: absolute; left: 152px; top: 40px; bottom: 80px;\n      width: 2px; background: linear-gradient(180deg, var(--border) 0%, var(--border) 80%, transparent 100%);\n    }\n\n    .entry {\n      display: grid; grid-template-columns: 120px 32px 1fr; gap: 20px;\n      padding: 24px 0 32px; position: relative;\n      transition: opacity 0.2s ease;\n    }\n    .entry.hidden { display: none; }\n\n    .entry-date {\n      padding-top: 4px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      text-align: right;\n    }\n    .entry-date .day { color: var(--text); font-weight: 800; font-size: 15px; letter-spacing: -0.01em; display: block; }\n    .entry-date .year { font-size: 11px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-top: 2px; }\n\n    .entry-bullet {\n      position: relative; display: flex; justify-content: center; padding-top: 8px;\n    }\n    .entry-bullet-dot {\n      width: 14px; height: 14px; border-radius: 50%;\n      background: var(--surface); border: 3px solid var(--navy-dark);\n      box-shadow: 0 0 0 4px var(--surface);\n      z-index: 1;\n    }\n    .entry-bullet[data-type=\"new\"] .entry-bullet-dot { border-color: var(--pink); }\n    .entry-bullet[data-type=\"improvement\"] .entry-bullet-dot { border-color: var(--blue); }\n    .entry-bullet[data-type=\"fix\"] .entry-bullet-dot { border-color: var(--gold); }\n    .entry-bullet[data-type=\"integration\"] .entry-bullet-dot { border-color: var(--green); }\n\n    .entry-body {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px 24px;\n      box-shadow: var(--shadow-sm); transition: all 0.2s ease;\n    }\n    .entry:hover .entry-body { border-color: var(--border-strong); box-shadow: var(--shadow); transform: translateY(-1px); }\n    .entry-featured .entry-body {\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.04) 100%);\n      border-color: var(--pink-strong);\n    }\n\n    .entry-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }\n    .pill {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      padding: 4px 10px; border-radius: 100px;\n    }\n    .pill svg { width: 11px; height: 11px; }\n    .pill-new { background: var(--pink-bg); color: #c21a6a; }\n    .pill-improvement { background: var(--blue-softer); color: var(--blue); }\n    .pill-fix { background: rgba(245,166,35,0.14); color: #b27214; }\n    .pill-integration { background: var(--green-bg); color: var(--green-dark); }\n    .pill-milestone {\n      background: linear-gradient(135deg, var(--pink), #ff7bb4); color: #fff;\n    }\n\n    .entry-title {\n      font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em;\n      margin-bottom: 8px; line-height: 1.25;\n    }\n    .entry-desc {\n      font-size: 14.5px; color: var(--text-muted); line-height: 1.6;\n    }\n    .entry-desc p + p { margin-top: 10px; }\n    .entry-desc strong { color: var(--text); font-weight: 600; }\n\n    .entry-visual {\n      margin-top: 14px; padding: 14px 16px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius);\n      font-size: 13px; color: var(--text-muted);\n    }\n    .entry-visual code, .entry-visual pre {\n      font-family: 'JetBrains Mono', ui-monospace, monospace;\n      font-size: 12.5px;\n    }\n    .entry-visual pre { white-space: pre-wrap; color: var(--text); line-height: 1.6; }\n    .entry-visual .label { font-size: 10px; font-weight: 700; color: var(--text-faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }\n\n    .entry-illo {\n      margin-top: 14px;\n      display: flex; align-items: center; gap: 14px;\n      padding: 16px; border: 1px dashed var(--border-strong);\n      border-radius: var(--radius); background: var(--surface-subtle);\n    }\n    .entry-illo svg { width: 72px; height: 56px; flex-shrink: 0; color: var(--blue); }\n    .entry-illo-text { font-size: 13px; color: var(--text-muted); }\n    .entry-illo-text strong { color: var(--text); font-weight: 700; display: block; margin-bottom: 2px; font-size: 13.5px; }\n\n    .entry-foot {\n      margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border);\n      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;\n      font-size: 13px;\n    }\n    .entry-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      color: var(--blue); font-weight: 600;\n    }\n    .entry-link:hover { text-decoration: underline; }\n    .entry-link svg { width: 13px; height: 13px; }\n\n    /* ===== Empty state ===== */\n    .empty {\n      display: none; text-align: center; padding: 48px 20px; color: var(--text-muted);\n      border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);\n      background: var(--surface-subtle); margin-top: 20px;\n    }\n    .empty.show { display: block; }\n    .empty strong { color: var(--text); font-weight: 700; display: block; margin-bottom: 4px; }\n\n    /* ===== Ideas CTA ===== */\n    .ideas {\n      max-width: 960px; margin: 24px auto 0; padding: 0 32px;\n    }\n    .ideas-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 36px 40px;\n      display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .ideas-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 260px; height: 260px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .ideas-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; position: relative; z-index: 1; }\n    .ideas-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; position: relative; z-index: 1; }\n    .ideas-sub { font-size: 14px; color: rgba(255,255,255,0.75); max-width: 560px; position: relative; z-index: 1; line-height: 1.55; }\n    .ideas-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; position: relative; z-index: 1; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 24px; }\n      .subscribe, .filters-wrap, .log, .ideas { padding-left: 16px; padding-right: 16px; }\n      .sub-card { flex-direction: column; align-items: stretch; }\n      .sub-meta { justify-content: space-between; }\n      .log::before { left: 11px; }\n      .entry { grid-template-columns: 24px 1fr; gap: 14px; }\n      .entry-date {\n        grid-column: 2; text-align: left; padding-top: 0; margin-bottom: 2px;\n        display: flex; align-items: baseline; gap: 8px;\n      }\n      .entry-date .day, .entry-date .year { display: inline; }\n      .entry-date .year { margin-top: 0; }\n      .entry-bullet { grid-row: span 2; padding-top: 4px; }\n      .entry-body { grid-column: 2; padding: 18px 18px; }\n      .entry-title { font-size: 17px; }\n      .ideas-card { grid-template-columns: 1fr; padding: 28px 22px; }\n      .ideas-actions { align-items: flex-start; }\n      .filters-wrap { top: 57px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <span className="tb-brand-name">Tenantory</span>
    </a>
    <nav className="tb-nav">
      <a className="tb-nav-item" href="landing.html">Home</a>
      <a className="tb-nav-item" href="pricing.html">Pricing</a>
      <a className="tb-nav-item active" href="changelog.html">Changelog</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <span className="dot" />
      Updated weekly · last shipped 2 days ago
    </div>
    <h1>What <em>shipped</em> this week.</h1>
    <p className="hero-sub">I'm building Tenantory in public. Every release that hits your account gets written down here — what changed, and why I thought it was worth my time. No marketing spin, no "we're excited to announce." If pace is a trust signal for you, this page is the signal.</p>
  </section>

  
  <section className="subscribe">
    <div className="sub-card">
      <form className="sub-form" id="subForm">
        <input className="sub-input" id="subEmail" type="email" placeholder="you@yourportfolio.com" required />
        <button className="btn btn-primary sub-btn" type="submit">
          Get release notes in your inbox
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </form>
      <div className="sub-meta">
        <span className="sub-ok" id="subOk">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          You're on the list.
        </span>
        <a href="/changelog.atom" title="Atom feed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.5" fill="currentColor" /></svg>
          RSS / Atom
        </a>
      </div>
    </div>
  </section>

  
  <div className="filters-wrap">
    <div className="filters" id="filters">
      <button className="filter-chip active" data-filter="all">All <span className="count" data-count="all">12</span></button>
      <button className="filter-chip" data-filter="new">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
        New features <span className="count" data-count="new">6</span>
      </button>
      <button className="filter-chip" data-filter="improvement">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
        Improvements <span className="count" data-count="improvement">3</span>
      </button>
      <button className="filter-chip" data-filter="fix">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z" /></svg>
        Fixes <span className="count" data-count="fix">2</span>
      </button>
      <button className="filter-chip" data-filter="integration">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M14 7h3a3 3 0 0 1 3 3v0" /><path d="M10 17H7a3 3 0 0 1-3-3v0" /></svg>
        Integrations <span className="count" data-count="integration">1</span>
      </button>
    </div>
  </div>

  
  <section className="log" id="log">

    
    <article className="entry" data-type="new">
      <div className="entry-date"><span className="day">Apr 12</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New feature
          </span>
        </div>
        <h3 className="entry-title">AI application scoring</h3>
        <div className="entry-desc">
          <p>Every application now gets a score from 0–100 and a short plain-English explanation — pulled from income-to-rent ratio, credit band, eviction history, and the applicant's own notes. It does not auto-reject anyone. It's there so you can rank a stack of 40 applications in 90 seconds instead of an afternoon.</p>
          <p>I built this after a Founder told me he was losing good tenants because he couldn't get back to them fast enough. The goal is speed, not gatekeeping.</p>
        </div>
        <div className="entry-visual">
          <div className="label">Example output</div>
          <pre>Score: 82 / 100 · Strong
Rent-to-income 28% (good)
Credit tier B+ · no flags
Notes: Relocating for job at HudsonAlpha; references solid.</pre>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="#docs-scoring">
            How scoring works
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
          <a className="entry-link" href="applications.html">
            Open Applications
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="improvement">
      <div className="entry-date"><span className="day">Apr 8</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="improvement"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
            Improvement
          </span>
        </div>
        <h3 className="entry-title">Tenant portal dark mode and per-workspace theme overrides</h3>
        <div className="entry-desc">
          <p>The tenant portal now honors a tenant's system dark mode preference, and workspace admins can override the whole brand palette — primary color, logo, subdomain favicon — from Settings → Theme. This matters for PMCs that manage on behalf of owners and want the portal to feel like the owner's brand, not mine.</p>
        </div>
        <div className="entry-illo">
          <svg viewBox="0 0 72 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="30" height="48" rx="4" />
            <rect x="40" y="4" width="30" height="48" rx="4" fill="#1a1f36" stroke="#1a1f36" />
            <line x1="8" y1="14" x2="26" y2="14" />
            <line x1="8" y1="20" x2="20" y2="20" />
            <line x1="46" y1="14" x2="64" y2="14" stroke="#fff" />
            <line x1="46" y1="20" x2="58" y2="20" stroke="#fff" />
            <circle cx="17" cy="38" r="6" />
            <circle cx="55" cy="38" r="6" stroke="#fff" />
          </svg>
          <div className="entry-illo-text">
            <strong>Same content, your palette</strong>
            Works on the main app at app.tenantory.com and on custom subdomains.
          </div>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="settings.html">
            Settings · Theme
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="improvement">
      <div className="entry-date"><span className="day">Apr 3</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="improvement"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
            Improvement
          </span>
        </div>
        <h3 className="entry-title">Schedule-E PDF export is now one click</h3>
        <div className="entry-desc">
          <p>Used to be three: pick year, pick entity, wait. Now it's a single button on Reports and the PDF comes back pre-mapped to IRS line items — rents received, repairs, depreciation, the whole thing — grouped per property. Your CPA can staple it straight into the return.</p>
          <p>This was the most common support email I got in March. Timing it for tax season felt obvious in retrospect.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="reports.html">
            Go to Reports
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
          <a className="entry-link" href="#docs-schedule-e">
            Schedule-E mapping details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="integration">
      <div className="entry-date"><span className="day">Mar 28</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="integration"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M14 7h3a3 3 0 0 1 3 3" /><path d="M10 17H7a3 3 0 0 1-3-3" /></svg>
            Integration
          </span>
        </div>
        <h3 className="entry-title">RentCast integration · live market comps on every property</h3>
        <div className="entry-desc">
          <p>Each property now shows a RentCast-powered market rent estimate with comparable units from a 1-mile radius. When your lease renewal sits inside the estimate's range, Tenantory says so. When you're 12% under market, it says that too — with the comps to back it up.</p>
          <p>Pricing a renewal used to mean opening three tabs. Now it's one column on the property page.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="integrations.html">
            Enable RentCast
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="fix">
      <div className="entry-date"><span className="day">Mar 22</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="fix"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-fix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z" /></svg>
            Fix
          </span>
        </div>
        <h3 className="entry-title">Partial rent payments were applying to the wrong month</h3>
        <div className="entry-desc">
          <p>If a tenant paid half of March's rent on April 2nd, Tenantory was crediting it to April's ledger. That's wrong — a partial payment should always clear the oldest outstanding charge first. Fixed. Every affected account was recalculated overnight and the ledger entries now sit on the correct month.</p>
          <p>If you noticed odd balances in the last two weeks, refresh — they should be right now. Sorry about that one.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="payments.html">
            Review ledgers
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="new">
      <div className="entry-date"><span className="day">Mar 15</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New feature
          </span>
        </div>
        <h3 className="entry-title">Per-room rent roll for co-living properties</h3>
        <div className="entry-desc">
          <p>If you run a house with four bedrooms and four separate leases, you shouldn't have to fake it as one "unit." Tenantory now models a property → rooms → room-leases. Rent roll, vacancy, and turnover math all work per-bedroom, and the tenant portal only shows the room that tenant signed for.</p>
          <p>This was the single biggest ask from the co-living cohort. Took a month to get the data model right. Worth it.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="for-coliving.html">
            How co-living works in Tenantory
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
          <a className="entry-link" href="properties.html">
            Set up rooms
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="new">
      <div className="entry-date"><span className="day">Mar 10</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New feature
          </span>
        </div>
        <h3 className="entry-title">Vendor portal · your plumber gets their own login</h3>
        <div className="entry-desc">
          <p>Vendors now sign into Tenantory directly. They see open jobs, accept or decline, upload photos, and invoice — all without you playing middleman over text. And because a vendor account spans workspaces, if your HVAC guy works for you and your brother-in-law's LLC, it's one login for both.</p>
        </div>
        <div className="entry-visual">
          <div className="label">Vendor payload</div>
          <pre>POST /vendors/invite
&#123; "email": "mike@acmeplumbing.com",
  "trades": ["plumbing", "drains"],
  "workspaces": ["bear-holdings", "lee-three-llc"] &#125;</pre>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="vendor.html">
            See the vendor view
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
          <a className="entry-link" href="maintenance.html">
            Invite a vendor
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="fix">
      <div className="entry-date"><span className="day">Mar 2</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="fix"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-fix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5 1 1-5z" /></svg>
            Fix
          </span>
        </div>
        <h3 className="entry-title">Stripe webhook reliability — no more silent payment failures</h3>
        <div className="entry-desc">
          <p>In rare cases a Stripe webhook would drop (timeout on our end), the payment was collected but the ledger never marked it paid. Two tenants got false late notices in February because of this. I rebuilt the webhook handler with idempotency keys and a retry queue that catches anything Stripe gives up on, and backfilled the two affected accounts.</p>
          <p>The late fees that hit wrongly are already reversed. If you think one slipped through, reply to any email from me.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="#docs-reliability">
            Webhook reliability doc
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="new">
      <div className="entry-date"><span className="day">Feb 24</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New feature
          </span>
        </div>
        <h3 className="entry-title">Bulk tenant import from an AppFolio CSV export</h3>
        <div className="entry-desc">
          <p>Drop your AppFolio tenant export straight into onboarding. Tenantory maps the columns, flags anything ambiguous, and imports tenants, leases, security deposits, and balances in one pass. What used to be a two-week switch is now under 15 minutes for a 40-unit portfolio.</p>
          <p>Buildium and Rentec exporters are next on the list.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="vs-appfolio.html">
            Switching from AppFolio
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
          <a className="entry-link" href="onboarding.html">
            Import now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry" data-type="improvement">
      <div className="entry-date"><span className="day">Feb 18</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="improvement"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-improvement">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
            Improvement
          </span>
        </div>
        <h3 className="entry-title">Branded subdomain setup · 15 minutes, not multi-day</h3>
        <div className="entry-desc">
          <p>Used to be: paste a CNAME, wait for propagation, wait for cert, email support if anything looked weird. Now: enter your domain, click verify, and Tenantory provisions the cert, the subdomain, and the branded login page automatically. If DNS isn't right, it tells you exactly what to change at your registrar.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="settings.html">
            Set up your domain
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry entry-featured" data-type="new">
      <div className="entry-date"><span className="day">Feb 10</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New
          </span>
          <span className="pill pill-milestone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Milestone
          </span>
        </div>
        <h3 className="entry-title">Founders' cohort · $99/mo locked for life, first 100 accounts</h3>
        <div className="entry-desc">
          <p>I want the first 100 operators on Tenantory to have skin in my pricing decisions. So the first 100 Pro accounts lock in $99/mo forever — no matter what I charge the 101st customer or the 10,000th. In exchange I want their feedback on the hard calls. That's the whole deal.</p>
          <p>As of this entry, 87 spots remain.</p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="pricing.html">
            Claim a Founders' spot
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </a>
        </div>
      </div>
    </article>

    
    <article className="entry entry-featured" data-type="new">
      <div className="entry-date"><span className="day">Feb 3</span><span className="year">2026</span></div>
      <div className="entry-bullet" data-type="new"><div className="entry-bullet-dot" /></div>
      <div className="entry-body">
        <div className="entry-meta">
          <span className="pill pill-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
            New
          </span>
          <span className="pill pill-milestone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
            Launch
          </span>
        </div>
        <h3 className="entry-title">Tenantory is public · v1.0</h3>
        <div className="entry-desc">
          <p>After running my own rentals on a stack of AppFolio + QuickBooks + DocuSign + a bookkeeper for three years, I got tired of paying four companies to do one job. Tenantory is what I wish had existed: one app for leasing, rent, maintenance, accounting, and the tenant portal — priced for an operator, not a conglomerate.</p>
          <p>This page is where I'll tell you everything I ship, every week. Thanks for being early.</p>
          <p><strong>— Harrison, building from Huntsville, AL</strong></p>
        </div>
        <div className="entry-foot">
          <a className="entry-link" href="landing.html">
            Why I built Tenantory
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
        </div>
      </div>
    </article>

    <div className="empty" id="empty">
      <strong>Nothing in that bucket yet.</strong>
      Try another filter — or check back next week.
    </div>
  </section>

  
  <section className="ideas">
    <div className="ideas-card">
      <div>
        <div className="ideas-label">Got an idea?</div>
        <div className="ideas-title">Email ideas@tenantory.com — I read every one.</div>
        <div className="ideas-sub">Half of what's on this page started as a reply to an email. If something's in your way, tell me. The good ones ship inside a week. The hard ones I'll at least tell you why they're hard.</div>
      </div>
      <div className="ideas-actions">
        <a className="btn btn-pink btn-lg" href="mailto:ideas@tenantory.com">
          Send Harrison an idea
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="changelog.html">Changelog</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
