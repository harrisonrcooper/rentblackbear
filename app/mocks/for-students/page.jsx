"use client";

// Mock ported from ~/Desktop/tenantory/for-students.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --red-bg: rgba(214,69,69,0.1);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 72px 32px 48px; text-align: center;\n      position: relative; overflow: hidden;\n    }\n    .hero::before {\n      content: \"\"; position: absolute; top: -280px; left: 50%; transform: translateX(-50%);\n      width: 900px; height: 560px;\n      background: radial-gradient(ellipse at center, var(--pink-bg), transparent 65%);\n      z-index: -1;\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(38px, 5.4vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.03;\n      max-width: 960px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 720px; margin: 0 auto 32px; line-height: 1.55;\n    }\n    .hero-sub strong { color: var(--text); font-weight: 700; }\n    .hero-actions { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center; }\n    .hero-meta {\n      display: inline-flex; gap: 28px; margin-top: 32px;\n      font-size: 13px; color: var(--text-muted); flex-wrap: wrap; justify-content: center;\n    }\n    .hero-meta-item { display: inline-flex; align-items: center; gap: 8px; }\n    .hero-meta-item svg { width: 14px; height: 14px; color: var(--green); }\n\n    /* ===== Operator cred bar ===== */\n    .cred {\n      max-width: 1100px; margin: 48px auto 0; padding: 0 32px;\n    }\n    .cred-card {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px 32px;\n      display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: center;\n    }\n    .cred-avatar {\n      width: 72px; height: 72px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--navy-dark), var(--blue));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 24px; letter-spacing: -0.02em;\n      box-shadow: var(--shadow);\n    }\n    .cred-text { font-size: 15px; color: var(--text); line-height: 1.55; }\n    .cred-text strong { color: var(--text); font-weight: 700; }\n    .cred-sig { margin-top: 8px; font-size: 13px; color: var(--text-muted); }\n\n    /* ===== Section shell ===== */\n    .section {\n      max-width: 1200px; margin: 0 auto; padding: 80px 32px 0;\n    }\n    .sec-eyebrow {\n      display: inline-block;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;\n      color: var(--blue); margin-bottom: 12px;\n    }\n    .sec-h2 {\n      font-size: clamp(28px, 3.4vw, 38px); font-weight: 900; letter-spacing: -0.025em;\n      line-height: 1.12; max-width: 820px; margin: 0 0 16px;\n    }\n    .sec-lead {\n      font-size: 17px; color: var(--text-muted); max-width: 720px; line-height: 1.55; margin-bottom: 40px;\n    }\n    .sec-lead strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Break cards (what breaks for student housing) ===== */\n    .break-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .break-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      display: flex; flex-direction: column; gap: 12px;\n      position: relative;\n    }\n    .break-card:hover { border-color: var(--border-strong); }\n    .break-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--red-bg); color: var(--red);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .break-icon svg { width: 20px; height: 20px; }\n    .break-card h3 {\n      font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: var(--text);\n    }\n    .break-card p {\n      font-size: 14px; color: var(--text-muted); line-height: 1.55;\n    }\n    .break-card p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Solution grid ===== */\n    .sol-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .sol-card {\n      background: linear-gradient(180deg, var(--surface) 0%, var(--blue-softer) 100%);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px;\n      display: flex; flex-direction: column; gap: 14px;\n      transition: all 0.2s ease;\n    }\n    .sol-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue); }\n    .sol-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--blue); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 6px 16px rgba(18,81,173,0.22);\n    }\n    .sol-icon svg { width: 22px; height: 22px; }\n    .sol-card h3 {\n      font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: var(--text);\n    }\n    .sol-card p {\n      font-size: 14px; color: var(--text-muted); line-height: 1.55;\n    }\n    .sol-card p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Stack comparison ===== */\n    .stack-wrap {\n      margin-top: 32px;\n      background: linear-gradient(135deg, var(--navy-darker), var(--navy-dark) 60%, var(--blue));\n      border-radius: var(--radius-xl);\n      padding: 44px 40px;\n      position: relative; overflow: hidden;\n    }\n    .stack-wrap::before {\n      content: \"\"; position: absolute; top: -100px; right: -100px;\n      width: 420px; height: 420px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 65%);\n    }\n    .stack-grid {\n      display: grid; grid-template-columns: 1fr auto 1fr; gap: 28px; align-items: stretch;\n      position: relative; z-index: 1;\n    }\n    .stack-col {\n      background: var(--surface); border-radius: var(--radius-lg);\n      padding: 24px; display: flex; flex-direction: column; gap: 10px;\n    }\n    .stack-col.mine {\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.06) 100%);\n      border: 2px solid var(--pink);\n    }\n    .stack-col-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;\n      color: var(--text-muted); margin-bottom: 4px;\n    }\n    .stack-col.mine .stack-col-label { color: #c21a6a; }\n    .stack-col-title {\n      font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); margin-bottom: 12px;\n    }\n    .stack-row {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 9px 12px; background: var(--surface-subtle); border-radius: var(--radius);\n      font-size: 13.5px;\n    }\n    .stack-row-name { color: var(--text); font-weight: 600; }\n    .stack-row-name small { display: block; font-size: 11.5px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n    .stack-row-price { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .stack-total {\n      margin-top: auto;\n      padding: 14px 16px; border-radius: var(--radius);\n      background: var(--surface-alt);\n      display: flex; justify-content: space-between; align-items: baseline;\n      font-size: 13px; color: var(--text-muted); font-weight: 600;\n    }\n    .stack-col.mine .stack-total {\n      background: linear-gradient(135deg, rgba(255,73,152,0.08), rgba(18,81,173,0.06));\n    }\n    .stack-total strong {\n      font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: var(--text);\n    }\n    .stack-col.mine .stack-total strong { color: var(--green-dark); }\n    .stack-arrow {\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      font-weight: 800;\n    }\n    .stack-arrow svg { width: 30px; height: 30px; opacity: 0.8; }\n    .stack-caption {\n      margin-top: 22px; color: rgba(255,255,255,0.8); font-size: 13.5px;\n      max-width: 820px; line-height: 1.55; position: relative; z-index: 1;\n    }\n    .stack-caption strong { color: #fff; font-weight: 700; }\n\n    /* ===== Case study ===== */\n    .case-wrap {\n      margin-top: 40px;\n      display: grid; grid-template-columns: 360px 1fr; gap: 32px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px;\n    }\n    .case-side {\n      display: flex; flex-direction: column; gap: 18px;\n      padding-right: 28px; border-right: 1px solid var(--border);\n    }\n    .case-avatar-row { display: flex; align-items: center; gap: 14px; }\n    .case-avatar {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, #f5a623, #e67e22);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 20px;\n    }\n    .case-name { font-weight: 800; font-size: 16px; color: var(--text); }\n    .case-role { font-size: 13px; color: var(--text-muted); }\n\n    .case-stat {\n      padding: 14px 16px; background: var(--surface-subtle);\n      border-radius: var(--radius); border: 1px solid var(--border);\n    }\n    .case-stat-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      color: var(--text-muted); margin-bottom: 4px;\n    }\n    .case-stat-value { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }\n    .case-stat-value em { font-style: normal; color: var(--green-dark); }\n\n    .case-body { padding-left: 4px; }\n    .case-quote {\n      font-size: 19px; font-weight: 600; line-height: 1.45; letter-spacing: -0.01em;\n      color: var(--text); margin-bottom: 20px;\n    }\n    .case-quote::before { content: \"\\201C\"; color: var(--pink); font-size: 40px; line-height: 0; vertical-align: -6px; margin-right: 4px; }\n    .case-quote::after { content: \"\\201D\"; color: var(--pink); font-size: 40px; line-height: 0; vertical-align: -20px; margin-left: 2px; }\n    .case-detail { font-size: 14.5px; color: var(--text-muted); line-height: 1.65; margin-bottom: 14px; }\n    .case-detail strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Pricing note ===== */\n    .pricenote {\n      margin-top: 32px;\n      background: linear-gradient(135deg, var(--blue-softer), #fff);\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 32px 36px;\n      display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;\n    }\n    .pricenote-label { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }\n    .pricenote-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin-bottom: 8px; }\n    .pricenote-sub { font-size: 15px; color: var(--text-muted); line-height: 1.55; max-width: 560px; }\n    .pricenote-sub strong { color: var(--text); font-weight: 700; }\n    .pricenote-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }\n    .pricenote-price { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); }\n    .pricenote-price span { font-size: 15px; color: var(--text-muted); font-weight: 500; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 860px; margin: 0 auto; padding: 80px 32px 0; }\n    .faq-h2 { font-size: 32px; font-weight: 900; letter-spacing: -0.025em; text-align: center; margin-bottom: 12px; }\n    .faq-sub { text-align: center; color: var(--text-muted); margin-bottom: 36px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); margin-bottom: 10px; overflow: hidden;\n    }\n    .faq-q {\n      width: 100%; text-align: left; padding: 18px 22px;\n      display: flex; align-items: center; justify-content: space-between; gap: 12px;\n      font-weight: 700; font-size: 15.5px; color: var(--text); letter-spacing: -0.01em;\n    }\n    .faq-q:hover { background: var(--surface-subtle); }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--blue); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.28s ease, padding 0.28s ease;\n      padding: 0 22px;\n      color: var(--text-muted); font-size: 15px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 640px; padding: 0 22px 20px; }\n    .faq-a strong { color: var(--text); font-weight: 700; }\n    .faq-a p + p { margin-top: 10px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 80px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -120px; left: 50%; transform: translateX(-50%);\n      width: 640px; height: 420px;\n      background: radial-gradient(ellipse, var(--pink-bg), transparent 65%);\n    }\n    .cta-card h2 {\n      font-size: clamp(28px, 3.4vw, 38px); font-weight: 900; letter-spacing: -0.025em;\n      line-height: 1.15; max-width: 760px; margin: 0 auto 16px; position: relative; z-index: 1;\n    }\n    .cta-card p {\n      font-size: 16px; color: rgba(255,255,255,0.75); max-width: 640px;\n      margin: 0 auto 28px; line-height: 1.6; position: relative; z-index: 1;\n    }\n    .cta-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }\n    .cta-card .btn-ghost { border-color: rgba(255,255,255,0.35); color: #fff; background: transparent; }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 18px; position: relative; z-index: 1; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .break-grid, .sol-grid { grid-template-columns: repeat(2, 1fr); }\n      .case-wrap { grid-template-columns: 1fr; }\n      .case-side { border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; padding-bottom: 24px; }\n      .pricenote { grid-template-columns: 1fr; }\n      .pricenote-actions { align-items: flex-start; }\n      .stack-grid { grid-template-columns: 1fr; }\n      .stack-arrow { transform: rotate(90deg); }\n    }\n\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .section { padding: 56px 20px 0; }\n      .faq { padding-left: 20px; padding-right: 20px; }\n      .cta-bottom { padding-left: 20px; padding-right: 20px; }\n      .foot { padding-left: 20px; padding-right: 20px; }\n      .break-grid, .sol-grid { grid-template-columns: 1fr; }\n      .cred-card { grid-template-columns: 1fr; text-align: center; }\n      .cred-avatar { margin: 0 auto; }\n      .stack-wrap { padding: 28px 20px; }\n      .cta-card { padding: 40px 22px; }\n      .pricenote { padding: 24px; }\n      .case-wrap { padding: 24px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="for-students.html">For student housing</a>
      <a className="tb-nav-item" href="vs-appfolio.html">vs. AppFolio</a>
      <a className="tb-nav-item" href="stories.html">Stories</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></svg>
      For student-housing operators
    </div>
    <h1>Every August is a fire drill. Tenantory makes it <em>a lot less of one</em>.</h1>
    <p className="hero-sub">If you rent to <strong>UAH, Auburn, Alabama, or any campus-adjacent crowd</strong>, you already know: 80% of your leases turn over in a six-week window, half your applicants have no US credit, parents want to cosign on their phone, and the August 15 move-in day is fifteen cars in a driveway. Tenantory was built by an operator running that exact playbook. Every feature below exists because we needed it.</p>
    <div className="hero-actions">
      <a className="btn btn-pink btn-lg" href="onboarding.html">Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="#stack">See what it replaces</a>
    </div>
    <div className="hero-meta">
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        No credit card required
      </div>
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Up to 50 rooms on Pro — $99/mo
      </div>
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Cosigner + international-applicant flows built in
      </div>
    </div>
  </section>

  
  <section className="cred">
    <div className="cred-card">
      <div className="cred-avatar">HC</div>
      <div>
        <div className="cred-text">
          I rent rooms and houses near <strong>UAH in Huntsville</strong>. Undergrads, grad students, the occasional post-doc. Every August I used to hit the same wall: a stack of applications from international students with no SSN, a parent on the phone asking where to sign, twelve move-ins on a single Saturday, and a cosigner addendum Word doc that kept growing footnotes. I built Tenantory so that stack becomes a checklist. This page is the checklist.
        </div>
        <div className="cred-sig">— Harrison Cooper, founder</div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">The problem</div>
    <h2 className="sec-h2">The 6 things that break for student housing.</h2>
    <p className="sec-lead">Nothing on the market is built for the academic calendar. You end up welding pieces together — an app for rent, another for leases, a spreadsheet for cosigners, a sticky note for the Aug 15 move-in plan. <strong>Here's where it cracks, every year.</strong></p>

    <div className="break-grid">
      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
        </div>
        <h3>The August turnover avalanche</h3>
        <p>Seventy percent of your bedrooms turn in a three-week window. Every generic PM tool gives you the same 30-day renewal nudge it sends a retiree in Boca. You need <strong>batch everything</strong> — mass move-outs, mass renewals, mass screening, mass welcome emails — or you're copy-pasting for ten hours a Saturday.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </div>
        <h3>International students with no US credit</h3>
        <p>Your best applicant is a PhD student from Hyderabad with a full assistantship and a perfect email reply time. A credit pull returns "no record found." Every screening vendor scores them a 0. You <strong>reject the wrong person</strong>, or you skip screening and take the risk blind. There's no middle path in most tools.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <h3>Parental cosigner workflow</h3>
        <p>The student signs. Then mom and dad need to sign a separate cosigner addendum with their own income verification, their own ID, their own guarantor obligations. DocuSign can technically do it, but the routing logic is on you, the W-2 upload is on you, and following up when dad forgets for five days is also on you. By mid-August you're a collections clerk.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 15 4-4 4 4 5-5" /></svg>
        </div>
        <h3>Per-semester lease structures</h3>
        <p>Academic year is 9 months. Summer is 3. Some tenants want fall-only at a premium, some want summer-only at a discount, some sign August-to-August and sublet for May–July. Every PM tool wants a clean 12-month term. You end up editing a Word doc and praying the clause you deleted wasn't load-bearing.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
        <h3>Summer-vacancy rent collection</h3>
        <p>May comes. Half the house empties out. The lease says they still owe through July but you're splitting hairs over sublet clauses, partial-month credits, and the tenant who "thought it ended when finals did." You need <strong>lease-end-date accounting that tells the truth</strong> without you running a pivot table.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="17" cy="7" r="4" /><path d="m19 13 2 2-5 5" /></svg>
        </div>
        <h3>Housemate mix-matching</h3>
        <p>Three strangers sharing a kitchen is either the best experience of the year or a refund request by October. You need to ask a few questions at application — sleep schedule, cleanliness, guests, pets — and <strong>not place the 6 a.m. gym-rat next to the 2 a.m. gamer</strong>. Most tools don't even have the field.</p>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">The fix</div>
    <h2 className="sec-h2">How Tenantory handles it.</h2>
    <p className="sec-lead">Every feature below is live in production. I use all of them on my own rental portfolio in Huntsville — the current cohort is 60% UAH students, half international, half with parental cosigners. <strong>Open the trial, add a property, all of this lights up.</strong></p>

    <div className="sol-grid">
      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <h3>Cosigner flow, built in</h3>
        <p>When a tenant checks "I need a cosigner" on the application, the portal auto-routes a parallel mini-application to the cosigner's email — ID upload, income verification, guarantor addendum e-sign, the whole thing. <strong>You see both in one dashboard</strong>, with a single "fully executed" status when both signatures land. No DocuSign seat. No routing homework.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10Z" /></svg>
        </div>
        <h3>International applicant paths</h3>
        <p>No SSN? No problem. The international track asks for <strong>passport + visa/I-20, proof of funds or sponsor letter, employer/university verification, and an optional parental cosigner</strong>. Tenantory scores the application against those alternate signals instead of a US credit pull. You make the call with real data — not a "no record found" auto-rejection.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
        </div>
        <h3>Per-semester + academic-year templates</h3>
        <p>Four lease templates shipped out of the box: <strong>fall-only (Aug–Dec), spring-only (Jan–May), summer (May–Jul), and academic year (Aug–May) with optional summer hold</strong>. Pick one, fill in rent and room, send. Each template has the right clauses baked in — subletting rules, summer-vacancy language, early-termination for study-abroad.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" /><path d="m10 15 2 2 4-4" /></svg>
        </div>
        <h3>Bulk move-out / move-in day planner</h3>
        <p>A single page for August 15: every arrival, every departure, every deposit disposition, every key handoff, every utility reading. Auto-generated checklists per room. <strong>Tenants get SMS with their arrival window</strong> (you pick 30-minute slots so fifteen cars don't hit the driveway at noon). When the day is done, one button posts all deposit statements and sends move-out summaries to every departing tenant.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" /></svg>
        </div>
        <h3>Waitlist auto-roll for August spots</h3>
        <p>When a room opens up — a student flakes, a cosigner falls through, someone gets a better offer — Tenantory pulls the next qualified applicant off the waitlist, sends them the lease, and opens a 48-hour signing window. If they pass, the next one gets it. <strong>You spend zero minutes moving names around a spreadsheet</strong> the week before move-in.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>
        </div>
        <h3>Housemate compatibility questions</h3>
        <p>Eight short questions on the application — sleep schedule, noise tolerance, cleanliness (1–5), guest frequency, pets, smoking, study environment, kitchen usage. Tenantory scores applicants against the current housemates at the property and flags <strong>green / yellow / red compatibility</strong> before you accept. Prevents the mid-semester "can you move me to the other house" email.</p>
      </div>
    </div>
  </section>

  
  <section className="section" id="stack">
    <div className="sec-eyebrow">The math</div>
    <h2 className="sec-h2">Stop paying four vendors to approximate what one tool should do.</h2>
    <p className="sec-lead">Here's what a typical 25-bed campus-area operator pays today, stitched across four products plus a spreadsheet and a 20-hour August. <strong>And here's what that same portfolio costs on Tenantory Pro.</strong></p>

    <div className="stack-wrap">
      <div className="stack-grid">
        <div className="stack-col">
          <div className="stack-col-label">Today — the stack</div>
          <div className="stack-col-title">What most campus-area PMs pay</div>

          <div className="stack-row">
            <div className="stack-row-name">AppFolio<small>Core rent + accounting</small></div>
            <div className="stack-row-price">$298/mo</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">DocuSign Business Pro<small>Cosigner addendums, lease routing</small></div>
            <div className="stack-row-price">$65/mo</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">SmartMove / TransUnion<small>Per-applicant screening</small></div>
            <div className="stack-row-price">$190/mo</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">Cosigner tracking spreadsheet<small>Plus late-night cleanup</small></div>
            <div className="stack-row-price">$0 + 8hr</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">August turnover overtime<small>VA or part-time help, Aug only</small></div>
            <div className="stack-row-price">$650/mo</div>
          </div>
          <div className="stack-total">
            <span>Monthly, all-in</span>
            <strong>~$1,200</strong>
          </div>
        </div>

        <div className="stack-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </div>

        <div className="stack-col mine">
          <div className="stack-col-label">Tenantory Pro</div>
          <div className="stack-col-title">One bill. One login.</div>

          <div className="stack-row">
            <div className="stack-row-name">Rent + accounting<small>Schedule E, 1099s, bank sync</small></div>
            <div className="stack-row-price">Included</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">E-sign + cosigner routing<small>Parallel parent flow</small></div>
            <div className="stack-row-price">Included</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">Screening + intl. alternate paths<small>No SSN, no problem</small></div>
            <div className="stack-row-price">Included</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">August move-in day planner<small>SMS windows, batch checklists</small></div>
            <div className="stack-row-price">Included</div>
          </div>
          <div className="stack-row">
            <div className="stack-row-name">Waitlist auto-roll<small>Self-fills vacant rooms</small></div>
            <div className="stack-row-price">Included</div>
          </div>
          <div className="stack-total">
            <span>Monthly, all-in</span>
            <strong>$99</strong>
          </div>
        </div>
      </div>

      <p className="stack-caption">That's <strong>$1,100+ a month you weren't spending on rehabs</strong>, plus a calendar that stops bleeding every August. The spreadsheet hours don't show up on the invoice — but they're the ones that kill operators by year three.</p>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">Case study</div>
    <h2 className="sec-h2">22 beds. Three houses. Two blocks from UAH.</h2>
    <p className="sec-lead">Rachel runs a student-focused portfolio a short walk from the UAH campus in Huntsville — three houses, 22 leaseable rooms, heavy engineering-grad mix. Here's what changed after her first full August on Tenantory.</p>

    <div className="case-wrap">
      <div className="case-side">
        <div className="case-avatar-row">
          <div className="case-avatar">RM</div>
          <div>
            <div className="case-name">Rachel M.</div>
            <div className="case-role">Operator · student housing · Huntsville, AL</div>
          </div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Portfolio</div>
          <div className="case-stat-value">22 rooms · 3 houses</div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Aug 1 occupancy (prior yr)</div>
          <div className="case-stat-value">77%</div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Aug 1 occupancy (on Tenantory)</div>
          <div className="case-stat-value"><em>95%</em></div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Avg days to fill a room</div>
          <div className="case-stat-value">31 &rarr; <em>11</em></div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Summer vacancy rate</div>
          <div className="case-stat-value">42% &rarr; <em>18%</em></div>
        </div>
      </div>

      <div className="case-body">
        <p className="case-quote">Last August I drove around with a binder of printed cosigner PDFs. This August I had the laptop open on the porch, signing waitlisted students in while the move-outs were still packing. I stopped dreading the 15th.</p>

        <p className="case-detail">Before Tenantory, Rachel ran the August turn through <strong>a Google Sheet, three Word templates, and a DocuSign seat she paid for twelve months to use for six weeks</strong>. Roughly one in four international applicants got auto-rejected by her screening tool for "no credit file" — she'd then reverse the decision by hand, chase a sponsor letter, and lose a week. Summer rent collection was, in her words, "a group text with my dad asking how much to pro-rate."</p>

        <p className="case-detail"><strong>The unlock was the cosigner + international flow.</strong> "Three of my four best tenants this fall are PhD students from India and Vietnam. Zero would have scored well on a normal credit pull. Tenantory let me see income, sponsor, assistantship — the stuff that actually predicts whether rent shows up on the first."</p>

        <p className="case-detail">The August move-in day <strong>went from a 14-hour Saturday to a staggered 6-hour stretch</strong>. Tenants got SMS'd 30-minute arrival windows, the checklist auto-generated per room, and every deposit statement for the prior cohort went out in a single click at the end of the day. "I ate lunch. I didn't eat lunch last August."</p>

        <p className="case-detail">Summer-vacancy dropped from 42% to 18% because the lease templates now handle <strong>May–July holds at reduced rent</strong> as a first-class option. "Students were always willing to pay something to keep their room. I just didn't have a clean way to offer it before."</p>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">Pricing</div>
    <h2 className="sec-h2">Most student-housing operators live on Pro.</h2>
    <p className="sec-lead">Up to 50 rooms for $99 a month. Flat. A 15-bed operator pays $6.60 per room. A 45-bed operator pays $2.20. If you're over 50 rooms, Scale is unlimited and custom-priced. <strong>The math is boring, and the August is less scary.</strong></p>

    <div className="pricenote">
      <div>
        <div className="pricenote-label">Pro</div>
        <div className="pricenote-title">$99/mo. Up to 50 rooms. Everything on this page.</div>
        <div className="pricenote-sub">Cosigner flow, international alternate screening, per-semester and academic-year lease templates, bulk move-in day planner, waitlist auto-roll, housemate compatibility scoring, e-sign, AI application review, Schedule E, 1099 automation, branded tenant subdomain. <strong>14-day free trial, no credit card</strong>. If it doesn't save you 12 hours in the first 30 paid days, full refund plus $100 wired for your time.</div>
      </div>
      <div className="pricenote-actions">
        <div className="pricenote-price">$99<span>/mo</span></div>
        <a className="btn btn-primary btn-lg" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a className="btn btn-ghost btn-nav" href="pricing.html">See all plans</a>
      </div>
    </div>
  </section>

  
  <section className="faq">
    <h2 className="faq-h2">Student-housing questions we get every August.</h2>
    <p className="faq-sub">The ones I'd ask if I were you.</p>

    <div className="faq-item">
      <button className="faq-q">
        <span>Can parents cosign online? Really online?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Yes, start to finish, from their phone. When the student submits the application, they tick "I need a cosigner" and enter a parent email. Tenantory sends the parent a mini-application: <strong>ID upload, income verification (W-2 or two pay stubs), guarantor addendum with full e-signature, and a short relationship attestation</strong>. No account creation, no DocuSign seat, no PDF back-and-forth.</p>
        <p>You see both applications in one card in your dashboard — the student's and the parent's — with a combined status. When both are signed, the lease and cosigner addendum are generated as one bundled PDF, ready to save or share with your attorney.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>Do international students without an SSN actually work?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Yes. The international applicant track skips the US credit pull entirely and scores the application on the signals that actually predict whether rent shows up: <strong>passport + visa/I-20, proof of funds (bank statements translated if needed), university verification of enrollment, an assistantship or employment letter if applicable, and an optional parental cosigner</strong>.</p>
        <p>Tenantory gives you a side-by-side view — the domestic applicants with their credit score, the international applicants with their alternate dossier — so you're deciding apples-to-apples, not auto-rejecting the best tenant in the stack because TransUnion has no file on them.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>What about per-semester leases?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>First-class. Four templates ship with the product: <strong>Fall only (Aug–Dec), Spring only (Jan–May), Summer (May–Jul), and Academic year (Aug–May)</strong>. Each has the correct clauses — subletting, summer holds, early-termination for study abroad, room-only vs. whole-house occupancy — baked in and editable.</p>
        <p>Rent can differ per term on the same room: fall at $850, spring at $850, summer at $550. Tenantory generates a single lease with the term schedule embedded, or three separate leases if you prefer — your call at property setup.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>How do I handle August move-in day with 15 move-ins?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>The Move-In Day planner. Open it the week before and Tenantory lays out every arrival and departure across your whole portfolio on a single timeline. <strong>You slot each tenant into a 30-minute window and tap Send</strong> — they all get SMS + email with their arrival time, parking instructions, key pickup location, and a welcome packet.</p>
        <p>On the day itself, you check them in from the mobile view. Each check-in auto-kicks off the room's welcome sequence: first-month rent reminder, renter's insurance requirement, housemate intro message, maintenance portal invite. <strong>No copy-paste, no forgotten welcome emails, no "where do I park?" texts at 9am.</strong></p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>Can I vary rent by semester — like a summer discount?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Yes. Each lease can carry a <strong>term schedule</strong> — e.g., $875/mo Aug–Dec, $875/mo Jan–May, $525/mo Jun–Jul. The tenant portal shows each month's scheduled rent, and the accounting engine books the right revenue to the right month so your Schedule E and rent roll both reflect reality.</p>
        <p>Most of our student operators use the summer discount to keep occupancy high instead of letting rooms fully vacate in May. The rate is usually 50–65% of academic-year rent. Tenantory doesn't prescribe — you set the number, the lease holds it.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>How does subletting work?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Three modes, set per-property. <strong>Tenant-initiated</strong>: the tenant posts the room in their portal, applicants apply through your normal pipeline, you approve or reject, and the sublet is added as a short-term lease under the original one. <strong>Operator-only</strong>: tenants can't sublet without your written approval, which the portal routes to you with a one-tap yes/no. <strong>Not allowed</strong>: the lease clause and portal flow simply forbid it.</p>
        <p>Most of our student operators use tenant-initiated for May–July. The original tenant remains on the lease, the subletter pays through the portal, and if anything goes sideways, the original tenant's deposit is still on the hook. Clean paper trail, clean collections, no group-text math.</p>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>If you rent to college kids, Tenantory is the only tool built for your August. Try it for 14 days.</h2>
      <p>14-day free trial. No card. If Tenantory doesn't save you 12 hours a week in the first 30 paid days, I refund every dollar and wire you $100 for your time. I have not paid it once.</p>
      <div className="cta-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="mailto:harrison@tenantory.com?subject=Student%20housing%20question">Email Harrison directly</a>
      </div>
      <div className="cta-note">Built in Huntsville, AL by an operator who rents to UAH students every August.</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="for-students.html">For student housing</a>
      <a href="for-coliving.html">For co-living</a>
      <a href="for-landlords.html">For solo landlords</a>
      <a href="vs-appfolio.html">vs. AppFolio</a>
      <a href="stories.html">Stories</a>
      <a href="mailto:hello@tenantory.com">Support</a>
    </div>
  </footer>

  

    </>
  );
}
