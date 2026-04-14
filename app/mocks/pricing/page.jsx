"use client";

// Mock ported from ~/Desktop/tenantory/pricing.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 40px; text-align: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 56px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 860px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 640px; margin: 0 auto 32px; line-height: 1.55;\n    }\n\n    /* ===== Billing toggle ===== */\n    .bill-toggle {\n      display: inline-flex; background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px; position: relative;\n    }\n    .bill-opt {\n      padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); cursor: pointer; transition: all 0.2s ease;\n      position: relative; z-index: 1;\n    }\n    .bill-opt.active { color: var(--text); background: var(--surface); box-shadow: var(--shadow-sm); }\n    .bill-save {\n      display: inline-block; margin-left: 6px;\n      font-size: 10px; padding: 2px 7px; border-radius: 100px;\n      background: var(--green-bg); color: var(--green-dark); font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;\n    }\n\n    /* ===== Plans ===== */\n    .plans {\n      max-width: 1200px; margin: 40px auto 0;\n      padding: 0 32px;\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;\n    }\n    .plan {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px 28px;\n      display: flex; flex-direction: column; position: relative;\n      transition: all 0.2s ease;\n    }\n    .plan:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }\n    .plan-featured {\n      border: 2px solid var(--pink);\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);\n      box-shadow: 0 20px 60px rgba(255,73,152,0.18);\n      transform: translateY(-8px);\n    }\n    .plan-featured:hover { transform: translateY(-12px); }\n    .plan-ribbon {\n      position: absolute; top: -14px; left: 50%; transform: translateX(-50%);\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; padding: 6px 16px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      box-shadow: 0 8px 22px rgba(255,73,152,0.4);\n      white-space: nowrap;\n    }\n\n    .plan-name { font-weight: 800; font-size: 15px; color: var(--text); letter-spacing: -0.01em; margin-bottom: 4px; }\n    .plan-tag { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }\n    .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }\n    .plan-price-amount { font-size: 52px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--text); }\n    .plan-price-period { font-size: 15px; color: var(--text-muted); font-weight: 500; }\n    .plan-price-old { font-size: 13px; color: var(--text-faint); text-decoration: line-through; margin-bottom: 14px; }\n    .plan-cap { font-size: 13px; color: var(--text-muted); margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }\n    .plan-cap strong { color: var(--text); font-weight: 700; }\n\n    .plan-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }\n    .plan-features li {\n      list-style: none; display: flex; align-items: flex-start; gap: 10px;\n      font-size: 13.5px; color: var(--text); line-height: 1.45;\n    }\n    .plan-features li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;\n      color: var(--green-dark); padding: 2px;\n      background: var(--green-bg); border-radius: 50%;\n    }\n    .plan-features li.dim { color: var(--text-faint); }\n    .plan-features li.dim svg { color: var(--text-faint); background: var(--surface-alt); }\n\n    .plan-cta { margin-top: auto; }\n    .plan .btn { width: 100%; justify-content: center; }\n    .plan-note { text-align: center; font-size: 11px; color: var(--text-faint); margin-top: 10px; }\n\n    /* ===== Enterprise strip ===== */\n    .enterprise {\n      max-width: 1200px; margin: 24px auto 0; padding: 0 32px;\n    }\n    .ent-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 32px;\n      display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .ent-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 260px; height: 260px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .ent-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; position: relative; z-index: 1; }\n    .ent-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; position: relative; z-index: 1; }\n    .ent-sub { font-size: 14px; color: rgba(255,255,255,0.75); max-width: 520px; position: relative; z-index: 1; }\n    .ent-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; position: relative; z-index: 1; }\n    .ent-price { font-size: 14px; color: rgba(255,255,255,0.7); }\n    .ent-price strong { color: #fff; font-weight: 700; font-size: 15px; }\n\n    /* ===== Guarantee callout ===== */\n    .guarantee {\n      max-width: 1000px; margin: 72px auto 0; padding: 0 32px;\n    }\n    .guar-card {\n      background: var(--surface);\n      border: 2px solid var(--pink);\n      border-radius: var(--radius-xl); padding: 32px 36px;\n      display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;\n      box-shadow: var(--shadow);\n    }\n    .guar-shield {\n      width: 72px; height: 72px; border-radius: 22px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 14px 32px rgba(255,73,152,0.35);\n    }\n    .guar-shield svg { width: 36px; height: 36px; }\n    .guar-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .guar-text { font-size: 15px; color: var(--text-muted); line-height: 1.55; }\n    .guar-text strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Replaces stack ===== */\n    .replaces {\n      max-width: 1000px; margin: 80px auto 0; padding: 0 32px;\n    }\n    .section-head { text-align: center; margin-bottom: 40px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 580px; margin: 0 auto; }\n\n    .rep-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;\n      margin-bottom: 24px;\n    }\n    .rep-row {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px 18px;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .rep-name { font-weight: 600; font-size: 14px; color: var(--text); }\n    .rep-name small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n    .rep-price { font-weight: 700; font-size: 16px; color: var(--text); font-variant-numeric: tabular-nums; }\n    .rep-price-strike { color: var(--text-faint); text-decoration: line-through; font-size: 14px; font-weight: 500; margin-right: 6px; }\n\n    .rep-total {\n      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;\n      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius-lg); padding: 26px 32px;\n    }\n    .rep-total-side { display: flex; flex-direction: column; gap: 2px; }\n    .rep-total-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; }\n    .rep-total-amount { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }\n    .rep-total-side.right .rep-total-amount { color: var(--green-dark); }\n    .rep-total-side.right .rep-total-label { color: var(--green-dark); }\n    .rep-total-arrow {\n      width: 44px; height: 44px; border-radius: 50%;\n      background: var(--surface); border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--blue);\n    }\n    .rep-total-arrow svg { width: 18px; height: 18px; }\n    .rep-total-after { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 4px; }\n\n    /* ===== Comparison table ===== */\n    .compare-wrap {\n      max-width: 1100px; margin: 80px auto 0; padding: 0 32px;\n    }\n    .compare {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .compare-table {\n      width: 100%; border-collapse: collapse; font-size: 14px;\n    }\n    .compare-table thead th {\n      padding: 20px 16px; text-align: center;\n      font-weight: 800; font-size: 14px; color: var(--text);\n      border-bottom: 1px solid var(--border); background: var(--surface-subtle);\n      vertical-align: middle;\n    }\n    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }\n    .compare-table thead th.featured {\n      background: linear-gradient(180deg, var(--pink-bg), transparent);\n      color: var(--pink);\n    }\n    .compare-table thead th .compare-col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .compare-table thead th.featured .compare-col-sub { color: #c21a6a; }\n\n    .compare-table tbody tr:nth-child(odd) td { background: var(--surface-subtle); }\n    .compare-table tbody tr.group-head td {\n      background: var(--surface) !important;\n      padding-top: 24px !important; padding-bottom: 10px !important;\n      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;\n      border-top: 1px solid var(--border);\n    }\n    .compare-table tbody tr.group-head:first-child td { border-top: none; padding-top: 16px !important; }\n    .compare-table td {\n      padding: 14px 16px; border-bottom: 1px solid var(--border);\n      vertical-align: middle;\n    }\n    .compare-table td:first-child { color: var(--text); font-weight: 500; }\n    .compare-table td:not(:first-child) { text-align: center; }\n    .compare-table tbody tr:last-child td { border-bottom: none; }\n\n    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }\n    .cmp-no { color: var(--text-faint); font-weight: 500; }\n    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }\n\n    /* ===== FAQ ===== */\n    .faq {\n      max-width: 800px; margin: 80px auto 0; padding: 0 32px;\n    }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6;\n    }\n    .faq-item.open .faq-a { max-height: 500px; padding: 0 22px 20px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom {\n      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;\n    }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .plans, .enterprise, .guarantee, .replaces, .compare-wrap, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .plans { grid-template-columns: 1fr; }\n      .plan-featured { transform: none; }\n      .plan-featured:hover { transform: translateY(-4px); }\n      .ent-card { grid-template-columns: 1fr; }\n      .ent-actions { align-items: flex-start; }\n      .guar-card { grid-template-columns: 1fr; }\n      .rep-grid { grid-template-columns: 1fr; }\n      .rep-total { grid-template-columns: 1fr; text-align: center; gap: 12px; }\n      .rep-total-side { align-items: center; }\n      .rep-total-arrow { transform: rotate(90deg); margin: 0 auto; }\n      .compare { overflow-x: auto; }\n      .compare-table { min-width: 640px; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="pricing.html">Pricing</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      87 Founders' spots left at $99 for life
    </div>
    <h1>One price replaces <em>five tools</em>.</h1>
    <p className="hero-sub">Every plan includes the tenant portal, online rent, lease e-sign, maintenance, and accounting. Pay what's fair for your portfolio size — not for each feature.</p>

    <div className="bill-toggle" id="billToggle">
      <button className="bill-opt active" data-period="monthly">Monthly</button>
      <button className="bill-opt" data-period="annual">Annual <span className="bill-save">Save 2 months</span></button>
    </div>
  </section>

  
  <section className="plans">

    
    <div className="plan">
      <div className="plan-name">Starter</div>
      <div className="plan-tag">Solo landlord · a few units</div>
      <div className="plan-price">
        <span className="plan-price-amount" data-monthly="39" data-annual="33">$39</span>
        <span className="plan-price-period">/mo</span>
      </div>
      <div className="plan-price-old" data-monthly=" " data-annual="$39/mo billed monthly" />
      <div className="plan-cap"><strong>Up to 5 units.</strong> Perfect if this is a side hustle with a house or two.</div>
      <ul className="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Tenant portal (generic Tenantory URL)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Online rent collection (ACH free, cards 2.95%)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Lease e-sign &amp; stored documents</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Maintenance ticketing</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Generic application link</li>
        <li className="dim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>No branded subdomain</li>
        <li className="dim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>No investor reports</li>
      </ul>
      <div className="plan-cta">
        <a className="btn btn-ghost" href="onboarding.html">Start free trial</a>
        <div className="plan-note">No credit card required</div>
      </div>
    </div>

    
    <div className="plan plan-featured">
      <div className="plan-ribbon">Founders · $99 for life</div>
      <div className="plan-name">Pro</div>
      <div className="plan-tag">The hero plan · where most PMs live</div>
      <div className="plan-price">
        <span className="plan-price-amount" data-monthly="99" data-annual="82">$99</span>
        <span className="plan-price-period">/mo</span>
      </div>
      <div className="plan-price-old" data-monthly=" " data-annual="$99/mo billed monthly" />
      <div className="plan-cap"><strong>Up to 50 units.</strong> Branded subdomain, investor reports, and the full Founders' bonus stack.</div>
      <ul className="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Everything in Starter</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>Your own branded subdomain</strong> — yourname.tenantory.com</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Branded tenant portal &amp; application</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Monthly investor reports &amp; Schedule-E export</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Accounting ledger + 1099 generation</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>AI application scoring</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>$3,850 bonus stack</strong> — data migration, lease template, onboarding call</li>
      </ul>
      <div className="plan-cta">
        <a className="btn btn-pink" href="onboarding.html">Start 14-day trial</a>
        <div className="plan-note">Locks $99/mo for life · 13 spots/week going</div>
      </div>
    </div>

    
    <div className="plan">
      <div className="plan-name">Scale</div>
      <div className="plan-tag">Brand-forward PMs · full white-label</div>
      <div className="plan-price">
        <span className="plan-price-amount" data-monthly="299" data-annual="249">$299</span>
        <span className="plan-price-period">/mo</span>
      </div>
      <div className="plan-price-old" data-monthly=" " data-annual="$299/mo billed monthly" />
      <div className="plan-cap"><strong>Unlimited units.</strong> Connect your own domain. No "Powered by Tenantory" anywhere.</div>
      <ul className="plan-features">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Everything in Pro</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>Custom domain</strong> (rentblackbear.com) with automatic SSL</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Full white-label — no Tenantory branding</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Priority support (2-hour response SLA)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>API access &amp; webhooks</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Custom email domain for tenant communication</li>
      </ul>
      <div className="plan-cta">
        <a className="btn btn-ghost" href="onboarding.html">Launch my brand</a>
        <div className="plan-note">Cancel anytime · no card for trial</div>
      </div>
    </div>
  </section>

  
  <section className="enterprise">
    <div className="ent-card">
      <div>
        <div className="ent-label">Enterprise</div>
        <div className="ent-title">Multi-market operators &amp; franchises</div>
        <div className="ent-sub">SSO (Okta, Google Workspace, Microsoft Entra), multi-workspace, dedicated customer success manager, custom onboarding, and SLA-backed uptime. You get a human on a call, not a chatbot.</div>
      </div>
      <div className="ent-actions">
        <div className="ent-price">From <strong>$1,499/mo</strong></div>
        <a className="btn btn-pink" href="mailto:sales@tenantory.com">
          Talk to sales
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
      </div>
    </div>
  </section>

  
  <section className="guarantee">
    <div className="guar-card">
      <div className="guar-shield">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
      </div>
      <div>
        <div className="guar-title">If Tenantory doesn't save you 10 hours in your first 30 paid days, we pay you $100.</div>
        <p className="guar-text">Start the 14-day trial without a card. After that, you have 30 days as a paying customer. If your time-saved report doesn't show at least <strong>10 hours saved</strong> vs. your prior workflow, email us one sentence and we'll refund every dollar plus wire you <strong>$100 for your time</strong>. Less than 2% of customers claim this. We're that confident.</p>
      </div>
    </div>
  </section>

  
  <section className="replaces">
    <div className="section-head">
      <div className="section-kicker">What you're replacing</div>
      <h2>The stack you're already paying for.</h2>
      <p>Tenantory replaces the tools below. Most PMs we talk to are paying for five of these, patched together with spreadsheets.</p>
    </div>
    <div className="rep-grid">
      <div className="rep-row"><div className="rep-name">AppFolio or Buildium<small>Property management software</small></div><div className="rep-price">$280/mo</div></div>
      <div className="rep-row"><div className="rep-name">QuickBooks + bookkeeper<small>Accounting &amp; tax prep</small></div><div className="rep-price">$590/mo</div></div>
      <div className="rep-row"><div className="rep-name">DocuSign<small>Lease e-signing</small></div><div className="rep-price">$45/mo</div></div>
      <div className="rep-row"><div className="rep-name">Squarespace / Wix<small>Your marketing website</small></div><div className="rep-price">$30/mo</div></div>
      <div className="rep-row"><div className="rep-name">SimpleTexting / Twilio<small>Tenant SMS notifications</small></div><div className="rep-price">$50/mo</div></div>
      <div className="rep-row"><div className="rep-name">Latchel / Property Meld<small>Maintenance coordinator</small></div><div className="rep-price">$50/mo</div></div>
      <div className="rep-row"><div className="rep-name">Investor reports (manual)<small>Your time at $50/hr × 4 hrs/mo</small></div><div className="rep-price">$200/mo</div></div>
      <div className="rep-row"><div className="rep-name">Rental application service<small>TransUnion SmartMove etc.</small></div><div className="rep-price">$50/mo</div></div>
    </div>
    <div className="rep-total">
      <div className="rep-total-side">
        <div className="rep-total-label">You pay today</div>
        <div className="rep-total-amount">$1,295<small style={{fontSize: "15px", color: "var(--text-muted)", fontWeight: "500"}}>/mo</small></div>
      </div>
      <div className="rep-total-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </div>
      <div className="rep-total-side right">
        <div className="rep-total-label">Pro plan</div>
        <div className="rep-total-amount">$99<small style={{fontSize: "15px", color: "inherit", fontWeight: "500"}}>/mo</small></div>
        <div className="rep-total-after">You save $14,352/yr</div>
      </div>
    </div>
  </section>

  
  <section className="compare-wrap">
    <div className="section-head">
      <div className="section-kicker">Compare plans</div>
      <h2>Every feature, every plan.</h2>
      <p>No hidden asterisks. What's on this table is what you get.</p>
    </div>
    <div className="compare">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Starter<span className="compare-col-sub">$39/mo</span></th>
            <th className="featured">Pro<span className="compare-col-sub">$99/mo · Founders</span></th>
            <th>Scale<span className="compare-col-sub">$299/mo</span></th>
          </tr>
        </thead>
        <tbody>
          <tr className="group-head"><td colSpan="4">Portfolio</td></tr>
          <tr><td>Units</td><td><span className="cmp-val">Up to 5</span></td><td><span className="cmp-val">Up to 50</span></td><td><span className="cmp-val">Unlimited</span></td></tr>
          <tr><td>Team members</td><td><span className="cmp-val">1</span></td><td><span className="cmp-val">5</span></td><td><span className="cmp-val">Unlimited</span></td></tr>
          <tr><td>Workspaces (multi-entity)</td><td className="cmp-no">—</td><td className="cmp-no">—</td><td><span className="cmp-val">Unlimited</span></td></tr>

          <tr className="group-head"><td colSpan="4">Tenant-facing</td></tr>
          <tr><td>Tenant portal</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Branded subdomain (yourname.tenantory.com)</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Custom domain (rentyourname.com)</td><td className="cmp-no">—</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Full white-label (no "Powered by Tenantory")</td><td className="cmp-no">—</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="4">Rent &amp; payments</td></tr>
          <tr><td>ACH transfers</td><td><span className="cmp-val">Free</span></td><td><span className="cmp-val">Free</span></td><td><span className="cmp-val">Free</span></td></tr>
          <tr><td>Card payments</td><td><span className="cmp-val">2.95%</span></td><td><span className="cmp-val">2.95%</span></td><td><span className="cmp-val">2.5%</span></td></tr>
          <tr><td>Autopay</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Late fee automation</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="4">Leasing</td></tr>
          <tr><td>Lease e-sign &amp; storage</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>State-specific lease templates</td><td><span className="cmp-val">1 state</span></td><td><span className="cmp-val">All states</span></td><td><span className="cmp-val">All states</span></td></tr>
          <tr><td>Application scoring (AI)</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Branded application page</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="4">Accounting &amp; reporting</td></tr>
          <tr><td>Income/expense ledger</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Schedule-E / tax pack export</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>1099 generation for vendors</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Investor reports (monthly PDF)</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Rent roll + occupancy analytics</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="4">Operations</td></tr>
          <tr><td>Maintenance ticketing</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Vendor management + 1099 tracking</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>SMS notifications</td><td><span className="cmp-val">200/mo</span></td><td><span className="cmp-val">2,000/mo</span></td><td><span className="cmp-val">Unlimited</span></td></tr>

          <tr className="group-head"><td colSpan="4">Support &amp; extras</td></tr>
          <tr><td>Founders' bonus stack ($3,850 value)</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Free data migration from AppFolio/Buildium</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Email support</td><td><span className="cmp-val">48 hr</span></td><td><span className="cmp-val">Same-day</span></td><td><span className="cmp-val">2-hour SLA</span></td></tr>
          <tr><td>API access</td><td className="cmp-no">—</td><td className="cmp-no">—</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>$100 time-back guarantee</td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  
  <section className="faq" id="faq">
    <div className="section-head">
      <div className="section-kicker">Questions</div>
      <h2>Stuff people actually ask us.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">Do I need a credit card to start? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">No. 14-day trial on every plan with no card required. You add payment only when you decide to stay. Nothing auto-charges.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What's the "Founders for life" deal? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">The first 100 PMs on Pro lock in $99/mo forever — even when we raise the price. We will raise it (likely to $149 within 6 months). If you're in the first 100 and you stay subscribed, you never pay more. 87 spots left as of today.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">How does the $100 guarantee work? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">14-day trial (no card). Then 30 days as a paying customer. After day 30, if your in-app "time saved" report doesn't show 10+ hours vs. your prior workflow, email us. We refund every dollar you've paid AND wire you $100 for wasting your time. Single-question email, no interrogation.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What happens if I outgrow my plan? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">You'll get a heads-up email at 80% of your cap (4/5 units on Starter, 40/50 on Pro). One click upgrades you on a prorated bill. If you added a unit that pushes you over, you get 30 days to stay at the lower price before we bump you.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Will you migrate my data from AppFolio / Buildium? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes — free on Pro and Scale. Export a CSV from your current system (we'll show you exactly how), send it over, and we map it into Tenantory for you. Typical migration is 48–72 hours. You keep using your current tool the whole time until we say go.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I cancel anytime? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes. One click in Settings → Billing. No "talk to your account manager" nonsense. Your data exports to CSV on the way out.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Is my tenants' data safe? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Hosted on Vercel + Supabase (SOC 2 Type II). Payments via Stripe (PCI Level 1). Passwords are never stored — auth is via Clerk. Every workspace is isolated at the database level, so tenant data from one PM can't leak to another.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What makes this different from AppFolio? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Three things. (1) AppFolio charges $280/mo per portfolio and needs you to hit 50+ units. We start at $39 for 5 units. (2) Your tenants see "AppFolio." Our tenants see YOUR brand, your colors, your domain. (3) Tenantory was built by an operator running 15+ units — not by a VC who's never fixed a toilet. <a href="vs-appfolio.html" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>Full side-by-side comparison &rarr;</a></div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Start the 14-day trial. Lock $99 for life.</h2>
      <p>No credit card. No onboarding fee. Free data migration. If it doesn't save you 10 hours in the first 30 paid days, we refund you and wire $100 for your time.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Claim a Founders' spot
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="portal.html" target="_blank">
          See the tenant view
        </a>
      </div>
      <div className="cta-note">87 spots left · 13 claimed this week</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
