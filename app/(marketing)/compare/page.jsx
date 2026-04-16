"use client";

// Mock ported from ~/Desktop/blackbear/compare.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 40px; text-align: center; max-width: 960px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 900px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 720px; margin: 0 auto 28px; line-height: 1.6;\n    }\n    .hero-byline {\n      display: inline-flex; gap: 10px; align-items: center;\n      font-size: 13px; color: var(--text-muted);\n      background: var(--surface-alt); border: 1px solid var(--border);\n      padding: 8px 14px; border-radius: 100px;\n    }\n    .hero-byline-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-bg); }\n    .hero-byline strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Section head ===== */\n    .section-head { text-align: center; margin-bottom: 36px; max-width: 720px; margin-left: auto; margin-right: auto; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 0 auto; }\n\n    /* ===== At-a-glance cards ===== */\n    .glance { max-width: 1200px; margin: 16px auto 0; padding: 0 32px; }\n    .glance-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;\n    }\n    .vcard {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 24px 22px;\n      display: flex; flex-direction: column; gap: 12px;\n      transition: all 0.2s ease;\n    }\n    .vcard:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }\n    .vcard-featured {\n      border: 2px solid var(--pink);\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);\n      box-shadow: 0 20px 60px rgba(255,73,152,0.18);\n      position: relative;\n    }\n    .vcard-ribbon {\n      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; padding: 5px 14px; border-radius: 100px;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      box-shadow: 0 8px 22px rgba(255,73,152,0.4);\n    }\n    .vcard-logo {\n      width: 48px; height: 48px; border-radius: 12px;\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      font-weight: 900; font-size: 20px; letter-spacing: -0.02em;\n    }\n    .vcard-logo svg { width: 24px; height: 24px; }\n    .vl-blackbear { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }\n    .vl-appfolio { background: linear-gradient(135deg, #0066a5, #1e8fce); }\n    .vl-buildium { background: linear-gradient(135deg, #0b8457, #14a870); }\n    .vl-doorloop { background: linear-gradient(135deg, #f5a623, #f07c2b); }\n    .vcard-name { font-weight: 800; font-size: 18px; letter-spacing: -0.02em; }\n    .vcard-price { font-weight: 800; font-size: 22px; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }\n    .vcard-price small { font-size: 13px; font-weight: 500; color: var(--text-muted); }\n    .vcard-meta { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-muted); }\n    .vcard-meta div { display: flex; justify-content: space-between; gap: 10px; }\n    .vcard-meta strong { color: var(--text); font-weight: 600; }\n    .vcard-best {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 10px 12px;\n      font-size: 13px; color: var(--text); line-height: 1.45;\n    }\n    .vcard-best-label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; display: block; }\n    .vcard-featured .vcard-best { background: var(--pink-bg); border-color: var(--pink-strong); }\n    .vcard-featured .vcard-best-label { color: #c21a6a; }\n    .vcard-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      color: var(--blue); font-weight: 600; font-size: 13px;\n      margin-top: auto;\n    }\n    .vcard-link:hover { color: var(--navy); }\n    .vcard-link svg { width: 14px; height: 14px; }\n    .vcard-nolink { font-size: 12px; color: var(--text-faint); margin-top: auto; }\n\n    /* ===== Verdict ===== */\n    .verdict { max-width: 900px; margin: 88px auto 0; padding: 0 32px; }\n    .verdict-card {\n      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius-xl); padding: 36px 40px;\n      display: grid; grid-template-columns: 64px 1fr; gap: 24px; align-items: start;\n    }\n    .verdict-icon {\n      width: 56px; height: 56px; border-radius: 16px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--navy));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 10px 24px rgba(18,81,173,0.28);\n    }\n    .verdict-icon svg { width: 28px; height: 28px; }\n    .verdict-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .verdict p { font-size: 15.5px; color: var(--text); line-height: 1.65; margin-bottom: 10px; }\n    .verdict p:last-child { margin-bottom: 0; }\n    .verdict strong { font-weight: 700; color: var(--text); }\n\n    /* ===== Comparison table ===== */\n    .compare-wrap { max-width: 1180px; margin: 88px auto 0; padding: 0 32px; }\n    .compare {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .compare-table {\n      width: 100%; border-collapse: collapse; font-size: 14px;\n    }\n    .compare-table thead th {\n      padding: 20px 14px; text-align: center;\n      font-weight: 800; font-size: 14px; color: var(--text);\n      border-bottom: 1px solid var(--border); background: var(--surface-subtle);\n      vertical-align: middle;\n    }\n    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; width: 26%; }\n    .compare-table thead th.featured {\n      background: linear-gradient(180deg, var(--pink-bg), transparent);\n      color: var(--pink);\n    }\n    .compare-table thead th .compare-col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .compare-table thead th.featured .compare-col-sub { color: #c21a6a; }\n\n    .compare-table tbody tr:nth-child(odd) td { background: var(--surface-subtle); }\n    .compare-table tbody tr.group-head td {\n      background: var(--surface) !important;\n      padding-top: 24px !important; padding-bottom: 10px !important;\n      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;\n      border-top: 1px solid var(--border);\n    }\n    .compare-table tbody tr.group-head:first-child td { border-top: none; padding-top: 16px !important; }\n    .compare-table td {\n      padding: 13px 14px; border-bottom: 1px solid var(--border);\n      vertical-align: middle;\n    }\n    .compare-table td:first-child { color: var(--text); font-weight: 500; }\n    .compare-table td:not(:first-child) { text-align: center; }\n    .compare-table tbody tr:last-child td { border-bottom: none; }\n\n    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }\n    .cmp-no { color: var(--text-faint); font-weight: 500; }\n    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }\n    .cmp-partial { font-size: 12px; font-weight: 600; color: var(--gold); }\n    .cmp-win { box-shadow: inset 3px 0 0 var(--pink); }\n    td.tn-col { background: rgba(255,73,152,0.04) !important; }\n\n    /* ===== Cost chart ===== */\n    .cost { max-width: 1080px; margin: 96px auto 0; padding: 0 32px; }\n    .cost-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px 40px;\n      box-shadow: var(--shadow-sm);\n    }\n    .cost-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }\n    .cost-head h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .cost-head p { font-size: 14px; color: var(--text-muted); max-width: 420px; }\n    .cost-legend { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }\n    .cost-legend-item { display: flex; align-items: center; gap: 6px; }\n    .cost-legend-swatch { width: 12px; height: 12px; border-radius: 3px; }\n    .cl-tn { background: linear-gradient(135deg, var(--pink), #ff7bb4); }\n    .cl-af { background: linear-gradient(135deg, #0066a5, #1e8fce); }\n    .cl-bd { background: linear-gradient(135deg, #0b8457, #14a870); }\n    .cl-dl { background: linear-gradient(135deg, #f5a623, #f07c2b); }\n\n    .chart { width: 100%; height: 340px; }\n    .cost-rows { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 24px; }\n    .cost-row {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n    }\n    .cost-row-name { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }\n    .cost-row-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }\n    .cost-row-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .cost-row.win { background: var(--pink-bg); border-color: var(--pink-strong); }\n    .cost-row.win .cost-row-name { color: #c21a6a; }\n    .cost-note { font-size: 12px; color: var(--text-faint); margin-top: 16px; line-height: 1.55; }\n\n    /* ===== Switching cards ===== */\n    .switch { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }\n    .switch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n    .switch-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 24px 22px;\n      display: flex; flex-direction: column; gap: 10px;\n      transition: all 0.2s ease;\n    }\n    .switch-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue-bright); }\n    .switch-card-head { display: flex; align-items: center; gap: 10px; }\n    .switch-card-logo { width: 36px; height: 36px; border-radius: 10px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; letter-spacing: -0.02em; }\n    .switch-card h4 { font-weight: 800; font-size: 16px; letter-spacing: -0.02em; }\n    .switch-card p { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; flex: 1; }\n    .switch-card .switch-meta { font-size: 12px; color: var(--text-faint); }\n    .switch-card .switch-meta strong { color: var(--text); font-weight: 700; }\n    .switch-card-link { display: inline-flex; align-items: center; gap: 6px; color: var(--blue); font-weight: 600; font-size: 13px; margin-top: 6px; }\n    .switch-card-link svg { width: 14px; height: 14px; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 820px; margin: 96px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left; gap: 14px;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }\n    .faq-a strong { color: var(--text); font-weight: 700; }\n    .faq-a a { color: var(--blue); font-weight: 600; text-decoration: underline; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .glance, .verdict, .compare-wrap, .cost, .switch, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .glance-grid { grid-template-columns: repeat(2, 1fr); }\n      .verdict-card { grid-template-columns: 1fr; padding: 28px; }\n      .compare { overflow-x: auto; }\n      .compare-table { min-width: 780px; }\n      .cost-card { padding: 24px 22px; }\n      .cost-rows { grid-template-columns: repeat(2, 1fr); }\n      .switch-grid { grid-template-columns: 1fr; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="compare.html">Compare</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
      Updated April 2026 · Real pricing, no referral spin
    </div>
    <h1>Compare <em>Black Bear Rentals</em> vs AppFolio vs Buildium vs DoorLoop.</h1>
    <p className="hero-sub">The most honest four-way comparison of property management software on the internet — because I paid for all four of them myself before building Black Bear Rentals. No strawmen, no cherry-picked screenshots. Here's what each one actually does, what it actually costs, and which one you should pick.</p>
    <div className="hero-byline">
      <span className="hero-byline-dot" />
      Written by <strong>Harrison Cooper</strong> · operator, 15 units in Huntsville, AL
    </div>
  </section>

  
  <section className="glance">
    <div className="glance-grid">

      
      <div className="vcard vcard-featured">
        <div className="vcard-ribbon">Recommended</div>
        <div className="vcard-logo vl-blackbear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </div>
        <div className="vcard-name">Black Bear Rentals</div>
        <div className="vcard-price">$99<small>/mo flat · any portfolio size</small></div>
        <div className="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>$0</strong></div>
          <div><span>Setup fee</span><strong>$0</strong></div>
          <div><span>Annual contract</span><strong>No</strong></div>
        </div>
        <div className="vcard-best">
          <span className="vcard-best-label">Best for</span>
          Solo landlords and small PMs with 5&ndash;50 units who want a branded tenant portal without paying enterprise prices.
        </div>
        <span className="vcard-nolink">You are here.</span>
      </div>

      
      <div className="vcard">
        <div className="vcard-logo vl-appfolio">AF</div>
        <div className="vcard-name">AppFolio</div>
        <div className="vcard-price">$1.40<small>/unit/mo + $280 base</small></div>
        <div className="vcard-meta">
          <div><span>Min units</span><strong>50</strong></div>
          <div><span>Per-unit fee</span><strong>Yes</strong></div>
          <div><span>Setup fee</span><strong>$400&ndash;$1,500</strong></div>
          <div><span>Annual contract</span><strong>Yes</strong></div>
        </div>
        <div className="vcard-best">
          <span className="vcard-best-label">Best for</span>
          Regional PM companies with 250&ndash;5,000 doors who need a leasing team, corporate AP workflow, and a full CRM.
        </div>
        <a className="vcard-link" href="vs-appfolio.html">Black Bear Rentals vs AppFolio <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
      </div>

      
      <div className="vcard">
        <div className="vcard-logo vl-buildium">BD</div>
        <div className="vcard-name">Buildium</div>
        <div className="vcard-price">$58<small>/mo Essential · +$0.50/unit</small></div>
        <div className="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>$0.50&ndash;$1.50</strong></div>
          <div><span>Setup fee</span><strong>$0 self-serve</strong></div>
          <div><span>Annual contract</span><strong>Month-to-month</strong></div>
        </div>
        <div className="vcard-best">
          <span className="vcard-best-label">Best for</span>
          Mid-sized PMs (50&ndash;500 units) who care about real double-entry accounting and have an in-house bookkeeper.
        </div>
        <a className="vcard-link" href="vs-buildium.html">Black Bear Rentals vs Buildium <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
      </div>

      
      <div className="vcard">
        <div className="vcard-logo vl-doorloop">DL</div>
        <div className="vcard-name">DoorLoop</div>
        <div className="vcard-price">$69<small>/mo Starter · 20 units capped</small></div>
        <div className="vcard-meta">
          <div><span>Min units</span><strong>1</strong></div>
          <div><span>Per-unit fee</span><strong>Built-in tier</strong></div>
          <div><span>Setup fee</span><strong>$0</strong></div>
          <div><span>Annual contract</span><strong>Annual preferred</strong></div>
        </div>
        <div className="vcard-best">
          <span className="vcard-best-label">Best for</span>
          Landlords who like a polished modern UI, don't need branded portals, and are fine locking in an annual contract.
        </div>
        <a className="vcard-link" href="vs-doorloop.html">Black Bear Rentals vs DoorLoop <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
      </div>

    </div>
  </section>

  
  <section className="verdict">
    <div className="verdict-card">
      <div className="verdict-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3 8-8" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></svg>
      </div>
      <div>
        <div className="verdict-title">Which one should you actually use?</div>
        <p>If you have <strong>5&ndash;50 units</strong> and want tenants to see your brand when they pay rent, pick <strong>Black Bear Rentals</strong>. The $99 flat price beats every other option at that size, and you get a branded subdomain without needing a Scale plan.</p>
        <p>If you run <strong>250+ doors</strong> with a leasing team and need deep GL accounting, bank reconciliation, or corporate AP approvals, <strong>AppFolio</strong> or <strong>Buildium</strong> are still the right answer. Buildium wins if you care about accounting depth; AppFolio wins if you need enterprise tooling (Plus plan).</p>
        <p>If you like <strong>DoorLoop's UI</strong> (it's genuinely the prettiest of the legacy tools), you don't care about branded tenant portals, and you're okay signing an annual contract — DoorLoop is a fine pick. Pricing is similar to Black Bear Rentals at comparable unit counts.</p>
        <p>Everyone else &mdash; which is most landlords under 50 units &mdash; should save the $180&ndash;$400/mo and switch to Black Bear Rentals.</p>
      </div>
    </div>
  </section>

  
  <section className="compare-wrap">
    <div className="section-head">
      <div className="section-kicker">Feature-by-feature</div>
      <h2>Every line, no asterisks.</h2>
      <p>If a vendor partially does something, we say "partial" instead of a green checkmark. If I haven't personally verified a number in the last 60 days, it isn't on this table.</p>
    </div>
    <div className="compare">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th className="featured">Black Bear Rentals<span className="compare-col-sub">$99/mo flat</span></th>
            <th>AppFolio<span className="compare-col-sub">$280/mo + /unit</span></th>
            <th>Buildium<span className="compare-col-sub">$58&ndash;$479/mo</span></th>
            <th>DoorLoop<span className="compare-col-sub">$69&ndash;$229/mo</span></th>
          </tr>
        </thead>
        <tbody>

          <tr className="group-head"><td colSpan="5">Pricing</td></tr>
          <tr><td>Starting price</td><td className="tn-col"><span className="cmp-val">$39/mo</span></td><td><span className="cmp-val">$280/mo base</span></td><td><span className="cmp-val">$58/mo</span></td><td><span className="cmp-val">$69/mo</span></td></tr>
          <tr><td>Minimum units required</td><td className="tn-col"><span className="cmp-val">1</span></td><td><span className="cmp-val">50</span></td><td><span className="cmp-val">1</span></td><td><span className="cmp-val">1</span></td></tr>
          <tr><td>Per-unit fees</td><td className="tn-col"><span className="cmp-val">None</span></td><td><span className="cmp-val">$1.40/unit</span></td><td><span className="cmp-val">$0.50&ndash;$1.50</span></td><td><span className="cmp-val">Tiered cap</span></td></tr>
          <tr><td>Annual discount</td><td className="tn-col"><span className="cmp-val">2 months off</span></td><td><span className="cmp-val">None</span></td><td><span className="cmp-val">~10%</span></td><td><span className="cmp-val">~20%</span></td></tr>

          <tr className="group-head"><td colSpan="5">Tenant experience</td></tr>
          <tr><td>Branded tenant portal</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-partial">Enterprise only</span></td><td><span className="cmp-partial">Logo only</span></td><td><span className="cmp-partial">Logo only</span></td></tr>
          <tr><td>Custom domain (rentyourname.com)</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td className="cmp-no">&mdash;</td><td className="cmp-no">&mdash;</td><td className="cmp-no">&mdash;</td></tr>
          <tr><td>Tenant iOS/Android app</td><td className="tn-col"><span className="cmp-partial">PWA (web)</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>SMS notifications included</td><td className="tn-col"><span className="cmp-val">2,000/mo</span></td><td><span className="cmp-val">Add-on</span></td><td><span className="cmp-val">Add-on</span></td><td><span className="cmp-val">Included</span></td></tr>

          <tr className="group-head"><td colSpan="5">Leasing</td></tr>
          <tr><td>Lease e-signature</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>State-specific lease templates</td><td className="tn-col"><span className="cmp-val">All 50</span></td><td><span className="cmp-val">All 50</span></td><td><span className="cmp-val">All 50</span></td><td><span className="cmp-val">All 50</span></td></tr>
          <tr><td>AI application scoring</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-partial">Beta</span></td><td className="cmp-no">&mdash;</td><td className="cmp-no">&mdash;</td></tr>
          <tr><td>Cosigner / guarantor support</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-partial">Manual</span></td></tr>

          <tr className="group-head"><td colSpan="5">Payments</td></tr>
          <tr><td>ACH fee</td><td className="tn-col"><span className="cmp-val">$0</span></td><td><span className="cmp-val">$1.00/txn</span></td><td><span className="cmp-val">$0 (Premium)</span></td><td><span className="cmp-val">$0</span></td></tr>
          <tr><td>Card fee</td><td className="tn-col"><span className="cmp-val">2.95%</span></td><td><span className="cmp-val">2.99%</span></td><td><span className="cmp-val">2.95%</span></td><td><span className="cmp-val">2.95%</span></td></tr>
          <tr><td>Tenant autopay</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Split-rent between roommates</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td className="cmp-no">&mdash;</td><td><span className="cmp-partial">Workaround</span></td><td><span className="cmp-partial">Workaround</span></td></tr>

          <tr className="group-head"><td colSpan="5">Accounting</td></tr>
          <tr><td>Income/expense ledger</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>True double-entry GL</td><td className="tn-col"><span className="cmp-partial">Simplified</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>1099 generation</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Schedule E tax pack export</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-partial">CSV only</span></td><td><span className="cmp-partial">CSV only</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>QuickBooks sync</td><td className="tn-col"><span className="cmp-partial">Export only</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="5">Operations</td></tr>
          <tr><td>Maintenance ticketing</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Vendor portal</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-partial">Growth plan</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Listing syndication (Zillow, Trulia, etc.)</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>

          <tr className="group-head"><td colSpan="5">Support &amp; trust</td></tr>
          <tr><td>Support response SLA</td><td className="tn-col"><span className="cmp-val">Same-day</span></td><td><span className="cmp-val">1&ndash;2 business days</span></td><td><span className="cmp-val">24 hr</span></td><td><span className="cmp-val">Same-day chat</span></td></tr>
          <tr><td>SOC 2 Type II</td><td className="tn-col"><span className="cmp-partial">In progress</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Money-back guarantee</td><td className="tn-col"><span className="cmp-val">$100 + refund</span></td><td className="cmp-no">&mdash;</td><td><span className="cmp-val">30-day</span></td><td><span className="cmp-val">30-day</span></td></tr>

          <tr className="group-head"><td colSpan="5">Setup &amp; migration</td></tr>
          <tr><td>Typical onboarding time</td><td className="tn-col"><span className="cmp-val">3 days</span></td><td><span className="cmp-val">4&ndash;6 weeks</span></td><td><span className="cmp-val">1&ndash;2 weeks</span></td><td><span className="cmp-val">5&ndash;10 days</span></td></tr>
          <tr><td>Free data migration help</td><td className="tn-col"><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td><td className="cmp-no">&mdash;</td><td><span className="cmp-partial">Paid tier</span></td><td><span className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span></td></tr>
          <tr><td>Required implementation call</td><td className="tn-col"><span className="cmp-val">Optional</span></td><td><span className="cmp-val">Mandatory</span></td><td><span className="cmp-val">Optional</span></td><td><span className="cmp-val">Mandatory</span></td></tr>

        </tbody>
      </table>
    </div>
  </section>

  
  <section className="cost">
    <div className="cost-card">
      <div className="cost-head">
        <div>
          <h3>3-year cost for a 25-unit portfolio.</h3>
          <p>Annual plan where available. Base software only &mdash; card processing is roughly equal across all four, so it's excluded.</p>
        </div>
        <div className="cost-legend">
          <div className="cost-legend-item"><span className="cost-legend-swatch cl-tn" />Black Bear Rentals</div>
          <div className="cost-legend-item"><span className="cost-legend-swatch cl-af" />AppFolio</div>
          <div className="cost-legend-item"><span className="cost-legend-swatch cl-bd" />Buildium</div>
          <div className="cost-legend-item"><span className="cost-legend-swatch cl-dl" />DoorLoop</div>
        </div>
      </div>

      <svg className="chart" viewBox="0 0 960 340" preserveAspectRatio="none" aria-label="3-year cost chart">
        <defs>
          <lineargradient id="gTn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF4998" /><stop offset="100%" stopColor="#ff7bb4" /></lineargradient>
          <lineargradient id="gAf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e8fce" /><stop offset="100%" stopColor="#0066a5" /></lineargradient>
          <lineargradient id="gBd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14a870" /><stop offset="100%" stopColor="#0b8457" /></lineargradient>
          <lineargradient id="gDl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5a623" /><stop offset="100%" stopColor="#f07c2b" /></lineargradient>
        </defs>

        
        <g stroke="#e3e8ef" strokeWidth="1">
          <line x1="60" y1="40" x2="920" y2="40" />
          <line x1="60" y1="100" x2="920" y2="100" />
          <line x1="60" y1="160" x2="920" y2="160" />
          <line x1="60" y1="220" x2="920" y2="220" />
          <line x1="60" y1="280" x2="920" y2="280" />
        </g>
        
        <g fill="#8a93a5" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
          <text x="50" y="44" textAnchor="end">$32k</text>
          <text x="50" y="104" textAnchor="end">$24k</text>
          <text x="50" y="164" textAnchor="end">$16k</text>
          <text x="50" y="224" textAnchor="end">$8k</text>
          <text x="50" y="284" textAnchor="end">$0</text>
        </g>

        
        
        <g>
          
          <rect x="100" y="253" width="36" height="27" fill="url(#gTn)" rx="4" />
          
          <rect x="140" y="253" width="36" height="27" fill="url(#gDl)" rx="4" />
          
          <rect x="180" y="242" width="36" height="38" fill="url(#gBd)" rx="4" />
          
          <rect x="220" y="209" width="36" height="71" fill="url(#gAf)" rx="4" />
          <text x="178" y="302" textAnchor="middle" fill="#5a6478" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">Year 1</text>
        </g>
        
        <g>
          
          <rect x="380" y="226" width="36" height="54" fill="url(#gTn)" rx="4" />
          
          <rect x="420" y="226" width="36" height="54" fill="url(#gDl)" rx="4" />
          
          <rect x="460" y="202" width="36" height="78" fill="url(#gBd)" rx="4" />
          
          <rect x="500" y="134" width="36" height="146" fill="url(#gAf)" rx="4" />
          <text x="458" y="302" textAnchor="middle" fill="#5a6478" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">Year 2</text>
        </g>
        
        <g>
          
          <rect x="660" y="199" width="36" height="81" fill="url(#gTn)" rx="4" />
          <text x="678" y="193" textAnchor="middle" fill="#1a1f36" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">$10.8k</text>
          
          <rect x="700" y="198" width="36" height="82" fill="url(#gDl)" rx="4" />
          
          <rect x="740" y="159" width="36" height="121" fill="url(#gBd)" rx="4" />
          
          <rect x="780" y="55" width="36" height="225" fill="url(#gAf)" rx="4" />
          <text x="798" y="49" textAnchor="middle" fill="#1a1f36" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">$30k</text>
          <text x="738" y="302" textAnchor="middle" fill="#5a6478" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">Year 3</text>
        </g>

        
        <line x1="60" y1="280" x2="920" y2="280" stroke="#c9d1dd" strokeWidth="1.5" />
      </svg>

      <div className="cost-rows">
        <div className="cost-row win">
          <div className="cost-row-name">Black Bear Rentals</div>
          <div className="cost-row-val">$10,800</div>
          <div className="cost-row-sub">$3,600/yr · locked for Founders</div>
        </div>
        <div className="cost-row">
          <div className="cost-row-name">DoorLoop</div>
          <div className="cost-row-val">$11,000</div>
          <div className="cost-row-sub">~$3,600/yr at 25 units on Pro</div>
        </div>
        <div className="cost-row">
          <div className="cost-row-name">Buildium</div>
          <div className="cost-row-val">$16,200</div>
          <div className="cost-row-sub">Growth plan + $0.80/unit</div>
        </div>
        <div className="cost-row">
          <div className="cost-row-name">AppFolio</div>
          <div className="cost-row-val">$30,000</div>
          <div className="cost-row-sub">$280 base + $1.40/unit + setup</div>
        </div>
      </div>

      <p className="cost-note">AppFolio requires 50 units minimum, so at 25 units you'd either be ineligible or pay the 50-unit floor ($280 + $70 = $350/mo). Numbers assume you meet the floor. Includes one-time $1,500 implementation fee amortized into Year 1.</p>
    </div>
  </section>

  
  <section className="switch">
    <div className="section-head">
      <div className="section-kicker">Switching guides</div>
      <h2>Already on one of these?</h2>
      <p>We migrate your data for free. Pick your current tool &mdash; the deeper guide covers CSV exports, what transfers cleanly, and what doesn't.</p>
    </div>
    <div className="switch-grid">

      <a className="switch-card" href="vs-appfolio.html">
        <div className="switch-card-head">
          <div className="switch-card-logo vl-appfolio">AF</div>
          <h4>Switching from AppFolio</h4>
        </div>
        <p>Export the Tenant Directory, Rent Roll, and Owner Statements from AppFolio's Reports tab. Everything except internal chat threads and appraisal docs transfers. Typical cutover: 72 hours.</p>
        <div className="switch-meta">Biggest gotcha: <strong>AppFolio holds your owner funds for 3 business days after cancellation</strong>. Plan your cutover around the 1st.</div>
        <span className="switch-card-link">Full AppFolio migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      <a className="switch-card" href="vs-buildium.html">
        <div className="switch-card-head">
          <div className="switch-card-logo vl-buildium">BD</div>
          <h4>Switching from Buildium</h4>
        </div>
        <p>Buildium's CSV export is the cleanest of the four &mdash; they give you a zip with properties, units, tenants, leases, and transactions as separate files. We re-map columns and you're live in 3 days.</p>
        <div className="switch-meta">Biggest gotcha: <strong>Buildium's chart of accounts is more granular than Black Bear Rentals</strong>. We consolidate 80+ categories into 14 Schedule-E lines.</div>
        <span className="switch-card-link">Full Buildium migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

      <a className="switch-card" href="vs-doorloop.html">
        <div className="switch-card-head">
          <div className="switch-card-logo vl-doorloop">DL</div>
          <h4>Switching from DoorLoop</h4>
        </div>
        <p>DoorLoop exports cleanly from Settings &rarr; Data Export. The only thing that doesn't transfer is their internal Task list &mdash; but those map neatly into Black Bear Rentals's Maintenance module as open tickets.</p>
        <div className="switch-meta">Biggest gotcha: <strong>DoorLoop annual contracts lock you for 12 months</strong>. We'll help you time the cutover to your renewal date so you don't double-pay.</div>
        <span className="switch-card-link">Full DoorLoop migration guide <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></span>
      </a>

    </div>
  </section>

  
  <section className="faq" id="faq">
    <div className="section-head">
      <div className="section-kicker">Questions</div>
      <h2>The honest answers.</h2>
    </div>
    <div className="faq-list">

      <div className="faq-item">
        <button className="faq-q">Isn't this a biased comparison? You sell one of the four. <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes, it's biased in the sense that I think Black Bear Rentals is the best fit for most small PMs &mdash; that's why I built it after using the other three. It's <strong>not</strong> biased in the sense of misrepresenting the competition. Every number on this page is from the vendor's public pricing page or a real invoice I've personally paid. Where they beat Black Bear Rentals &mdash; AppFolio's deeper accounting, Buildium's double-entry GL, DoorLoop's native mobile apps &mdash; I say so.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">What if I need a feature only AppFolio has? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Then use AppFolio. Specifically: if you need AppFolio Plus features (AI leasing assistant for 500+ unit leasing teams, corporate AP approval chains, investor-grade fund accounting), Black Bear Rentals isn't there yet. If you need AppFolio Core features (rent roll, owner statements, maintenance, e-sign, CAM reconciliation), Black Bear Rentals does all of those at 1/3 the price. The real question is whether you'll ever <strong>actually use</strong> the $280/mo worth of features. Most 25-unit PMs don't.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">Can I really migrate in 3 days? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes, <strong>for portfolios under 100 units with clean data</strong>. Day 1: you send us your CSV export. Day 2: we map and load it, you review. Day 3: we switch tenant payment links and you're live. If you have 200+ units or messy data (e.g. leases not in the system, security deposits in a separate spreadsheet), budget a week. Either way, you keep using your old tool the whole time until you say go.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">Does Black Bear Rentals work for 500+ unit portfolios? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">It works, but it's not yet the <em>best</em> pick at that scale. The Scale plan handles unlimited units technically, and we have customers with 200+ doors. But if you have a leasing team of 5, a full-time bookkeeper, and multiple entities doing inter-company transfers &mdash; Buildium or AppFolio's workflows are more mature for that. We'll get there. For now, if you're over 500 units with a real back-office team, I'll tell you honestly: start with Buildium, come back when we ship multi-entity (Q3 2026).</div>
      </div>

    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Still not sure? Try Black Bear Rentals for 14 days.</h2>
      <p>No credit card, no contract, no onboarding fee. If it doesn't save you 10 hours in the first 30 paid days, we refund every dollar and wire you $100 for your time.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="portal.html" target="_blank">
          See the tenant view
        </a>
      </div>
      <div className="cta-note">87 Founders' spots left at $99 for life</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="compare.html">Compare</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
