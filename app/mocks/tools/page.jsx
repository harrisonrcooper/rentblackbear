"use client";

// Mock ported from ~/Desktop/tenantory/tools.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 40px; text-align: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 56px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 880px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 680px; margin: 0 auto 8px; line-height: 1.55;\n    }\n    .hero-meta {\n      margin-top: 22px; display: inline-flex; align-items: center; gap: 16px;\n      font-size: 13px; color: var(--text-faint); flex-wrap: wrap; justify-content: center;\n    }\n    .hero-meta span { display: inline-flex; align-items: center; gap: 6px; }\n    .hero-meta svg { width: 14px; height: 14px; color: var(--green-dark); }\n\n    /* ===== Section heads ===== */\n    .section-head { text-align: center; margin-bottom: 40px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 640px; margin: 0 auto; }\n\n    /* ===== Calculator grid ===== */\n    .tools-grid {\n      max-width: 1200px; margin: 24px auto 0;\n      padding: 0 32px;\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\n    }\n    .tool {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl);\n      padding: 28px;\n      display: flex; flex-direction: column;\n      transition: all 0.2s ease;\n      position: relative;\n    }\n    .tool:hover { box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n\n    .tool-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 14px; margin-bottom: 4px;\n    }\n    .tool-title-wrap { display: flex; align-items: center; gap: 12px; }\n    .tool-icon {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .tool-icon svg { width: 20px; height: 20px; }\n    .tool-title { font-weight: 800; font-size: 17px; letter-spacing: -0.01em; color: var(--text); }\n    .tool-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n\n    .tool-tip {\n      position: relative;\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: inline-flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; cursor: help; flex-shrink: 0;\n      border: 1px solid var(--border);\n    }\n    .tool-tip:hover { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-bright); }\n    .tool-tip .tip-body {\n      position: absolute; top: calc(100% + 8px); right: -4px;\n      width: 260px; padding: 12px 14px;\n      background: var(--navy-darker); color: #fff;\n      border-radius: 10px; font-size: 12px; line-height: 1.5; font-weight: 500;\n      opacity: 0; pointer-events: none; transform: translateY(-4px);\n      transition: all 0.15s ease; z-index: 10; text-align: left;\n      box-shadow: var(--shadow-lg);\n    }\n    .tool-tip:hover .tip-body, .tool-tip:focus .tip-body { opacity: 1; pointer-events: auto; transform: translateY(0); }\n    .tool-tip .tip-body::before {\n      content: \"\"; position: absolute; bottom: 100%; right: 8px;\n      border: 6px solid transparent; border-bottom-color: var(--navy-darker);\n    }\n\n    .tool-body { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; flex: 1; }\n\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field-label {\n      font-size: 12px; font-weight: 700; color: var(--text);\n      letter-spacing: 0.02em; text-transform: uppercase;\n    }\n    .input-wrap {\n      position: relative; display: flex; align-items: center;\n      background: var(--surface-subtle);\n      border: 1px solid var(--border); border-radius: 10px;\n      transition: all 0.15s ease;\n    }\n    .input-wrap:focus-within { border-color: var(--blue-bright); background: var(--surface); box-shadow: 0 0 0 3px rgba(22,101,216,0.14); }\n    .input-prefix, .input-suffix {\n      font-size: 13px; color: var(--text-faint); font-weight: 600;\n      padding: 0 12px; flex-shrink: 0;\n    }\n    .input-prefix { border-right: 1px solid var(--border); }\n    .input-suffix { border-left: 1px solid var(--border); }\n    .field input {\n      width: 100%; padding: 11px 12px; font-size: 15px; font-weight: 600;\n      color: var(--text); background: transparent; border: none; outline: none;\n      font-variant-numeric: tabular-nums;\n    }\n    .field input::placeholder { color: var(--text-faint); font-weight: 500; }\n\n    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n\n    /* ===== Output panel ===== */\n    .tool-output {\n      margin-top: 18px; padding: 20px;\n      border-radius: var(--radius-lg);\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      transition: all 0.25s ease;\n    }\n    .tool-output.state-green { background: var(--green-bg); border-color: rgba(30,169,124,0.35); }\n    .tool-output.state-amber { background: rgba(245,166,35,0.12); border-color: rgba(245,166,35,0.4); }\n    .tool-output.state-red { background: rgba(214,69,69,0.1); border-color: rgba(214,69,69,0.35); }\n\n    .out-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }\n    .out-row + .out-row { margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(26,31,54,0.08); }\n    .out-label { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }\n    .out-value {\n      font-size: 28px; font-weight: 900; color: var(--text);\n      font-variant-numeric: tabular-nums; letter-spacing: -0.02em; line-height: 1;\n    }\n    .out-value.sm { font-size: 18px; }\n    .state-green .out-value { color: var(--green-dark); }\n    .state-amber .out-value { color: #a5720f; }\n    .state-red .out-value { color: var(--red); }\n\n    .verdict {\n      margin-top: 14px; padding: 10px 12px;\n      border-radius: 8px;\n      font-size: 13px; font-weight: 600; line-height: 1.45;\n      color: var(--text);\n      background: rgba(255,255,255,0.5);\n    }\n    .state-green .verdict { background: rgba(255,255,255,0.55); color: #0c5a3e; }\n    .state-amber .verdict { background: rgba(255,255,255,0.6); color: #7a520a; }\n    .state-red .verdict { background: rgba(255,255,255,0.6); color: #8a2929; }\n\n    .tool-foot {\n      margin-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;\n    }\n    .tool-foot-note { font-size: 11px; color: var(--text-faint); }\n    .btn-save {\n      padding: 9px 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.03em;\n      background: var(--blue-pale); color: var(--blue);\n      border-radius: 100px; display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; border: none;\n    }\n    .btn-save:hover { background: var(--blue); color: #fff; }\n    .btn-save svg { width: 14px; height: 14px; }\n\n    /* ===== Toast ===== */\n    .toast {\n      position: fixed; bottom: 24px; left: 50%; transform: translate(-50%, 80px);\n      background: var(--navy-darker); color: #fff;\n      padding: 12px 18px; border-radius: 100px;\n      font-size: 13px; font-weight: 600;\n      box-shadow: var(--shadow-xl);\n      display: flex; align-items: center; gap: 10px;\n      opacity: 0; transition: all 0.25s ease; z-index: 100;\n      pointer-events: none;\n    }\n    .toast.show { transform: translate(-50%, 0); opacity: 1; }\n    .toast svg { width: 16px; height: 16px; color: var(--pink); }\n\n    /* ===== Cross-sell ===== */\n    .cross-sell {\n      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;\n    }\n    .cross-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 48px;\n      display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .cross-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -80px;\n      width: 340px; height: 340px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .cross-label { font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; position: relative; z-index: 1; }\n    .cross-title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; position: relative; z-index: 1; line-height: 1.15; }\n    .cross-sub { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 22px; position: relative; z-index: 1; line-height: 1.55; }\n    .cross-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; position: relative; z-index: 1; }\n    .cross-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.9); }\n    .cross-list li svg { width: 16px; height: 16px; color: var(--pink); flex-shrink: 0; margin-top: 2px; }\n    .cross-actions { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }\n    .cross-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cross-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n\n    /* Mockup inside cross-sell */\n    .mockup {\n      background: #fff; border-radius: 14px; padding: 18px;\n      box-shadow: 0 30px 80px rgba(0,0,0,0.35);\n      position: relative; z-index: 1;\n      color: var(--text);\n    }\n    .mock-head {\n      display: flex; align-items: center; justify-content: space-between;\n      padding-bottom: 12px; border-bottom: 1px solid var(--border);\n      margin-bottom: 14px;\n    }\n    .mock-title { font-size: 13px; font-weight: 800; letter-spacing: -0.01em; }\n    .mock-pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 100px; background: var(--blue-pale); color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; }\n    .mock-row {\n      display: grid; grid-template-columns: 1.6fr 1fr 0.9fr; gap: 10px;\n      padding: 10px 4px; border-bottom: 1px solid var(--surface-alt);\n      align-items: center;\n    }\n    .mock-row:last-child { border-bottom: none; }\n    .mock-addr { font-size: 13px; font-weight: 700; color: var(--text); }\n    .mock-addr small { display: block; font-size: 11px; color: var(--text-faint); font-weight: 500; margin-top: 2px; }\n    .mock-cap {\n      font-size: 13px; font-weight: 800; font-variant-numeric: tabular-nums;\n      letter-spacing: -0.01em;\n    }\n    .mock-badge {\n      font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px;\n      text-align: center; letter-spacing: 0.04em; text-transform: uppercase;\n    }\n    .mock-badge.good { background: var(--green-bg); color: var(--green-dark); }\n    .mock-badge.mid { background: rgba(245,166,35,0.14); color: #a5720f; }\n    .mock-badge.bad { background: rgba(214,69,69,0.12); color: var(--red); }\n\n    /* ===== FAQ ===== */\n    .faq {\n      max-width: 800px; margin: 80px auto 0; padding: 0 32px;\n    }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6;\n    }\n    .faq-item.open .faq-a { max-height: 500px; padding: 0 22px 20px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom {\n      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;\n    }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .tools-grid, .cross-sell, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .tools-grid { grid-template-columns: 1fr; }\n      .cross-card { grid-template-columns: 1fr; padding: 36px 24px; gap: 30px; }\n      .cta-card { padding: 36px 22px; }\n      .field-row { grid-template-columns: 1fr; }\n    }\n  ";

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
      <a className="tb-nav-item" href="stories.html">Stories</a>
      <a className="tb-nav-item active" href="tools.html">Tools</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
      Free forever · no signup
    </div>
    <h1>Free tools for people who <em>own rentals</em>.</h1>
    <p className="hero-sub">Four calculators we built for ourselves to decide which houses to buy and which tenants to approve. Same math that powers Tenantory's internal analytics. Given away because gatekeeping a cap rate formula is embarrassing.</p>
    <div className="hero-meta">
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        No email required
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        Numbers update as you type
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        Works on your phone
      </span>
    </div>
  </section>

  
  <section className="tools-grid">

    
    <div className="tool" id="cap">
      <div className="tool-head">
        <div className="tool-title-wrap">
          <div className="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>
          </div>
          <div>
            <div className="tool-title">Cap rate calculator</div>
            <div className="tool-sub">Net operating income ÷ purchase price.</div>
          </div>
        </div>
        <div className="tool-tip" tabIndex="0">?
          <div className="tip-body">Under 6% is thin — you're buying appreciation, not cash flow. 6–8% is a normal buy in a decent market. 8%+ is where real landlords live. Goes by market: 5% in San Diego isn't the same sin as 5% in Huntsville.</div>
        </div>
      </div>
      <div className="tool-body">
        <div className="field">
          <label className="field-label" htmlFor="cap-price">Purchase price</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="cap-price" value="185000" min="0" step="1000" inputMode="decimal" />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cap-rent">Annual rent (gross)</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="cap-rent" value="22800" min="0" step="100" inputMode="decimal" />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="cap-exp">Annual expenses (tax, insurance, maint, vacancy)</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="cap-exp" value="6800" min="0" step="100" inputMode="decimal" />
          </div>
        </div>

        <div className="tool-output" id="cap-out">
          <div className="out-row">
            <div>
              <div className="out-label">Cap rate</div>
              <div className="verdict" id="cap-verdict" style={{marginTop: "6px", padding: "0", background: "transparent"}}>Calculating…</div>
            </div>
            <div className="out-value" id="cap-value">—</div>
          </div>
          <div className="out-row">
            <div className="out-label">Net operating income</div>
            <div className="out-value sm" id="cap-noi">—</div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="tool" id="coc">
      <div className="tool-head">
        <div className="tool-title-wrap">
          <div className="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div>
            <div className="tool-title">Cash-on-cash return</div>
            <div className="tool-sub">What your actual cash is earning, after the mortgage.</div>
          </div>
        </div>
        <div className="tool-tip" tabIndex="0">?
          <div className="tip-body">Cap rate ignores financing. Cash-on-cash tells you what your down payment is really making each year. Anything under 6% and you'd be better off in an index fund. 8–12% is healthy. Above 15% usually means you lied on expenses.</div>
        </div>
      </div>
      <div className="tool-body">
        <div className="field">
          <label className="field-label" htmlFor="coc-cash">Total cash in (down + closing + rehab)</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="coc-cash" value="48000" min="0" step="500" inputMode="decimal" />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="coc-rent">Monthly rent</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="coc-rent" value="1900" min="0" step="25" inputMode="decimal" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="coc-pi">Mortgage (P&amp;I)</label>
            <div className="input-wrap">
              <span className="input-prefix">$</span>
              <input type="number" id="coc-pi" value="980" min="0" step="10" inputMode="decimal" />
            </div>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="coc-tax">Tax + insurance</label>
            <div className="input-wrap">
              <span className="input-prefix">$</span>
              <input type="number" id="coc-tax" value="320" min="0" step="10" inputMode="decimal" />
            </div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="coc-vac">Vacancy %</label>
            <div className="input-wrap">
              <input type="number" id="coc-vac" value="8" min="0" max="100" step="1" inputMode="decimal" />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="coc-maint">Maintenance %</label>
            <div className="input-wrap">
              <input type="number" id="coc-maint" value="8" min="0" max="100" step="1" inputMode="decimal" />
              <span className="input-suffix">%</span>
            </div>
          </div>
        </div>

        <div className="tool-output" id="coc-out">
          <div className="out-row">
            <div>
              <div className="out-label">Annual cash-on-cash</div>
              <div className="verdict" id="coc-verdict" style={{marginTop: "6px", padding: "0", background: "transparent"}}>Calculating…</div>
            </div>
            <div className="out-value" id="coc-value">—</div>
          </div>
          <div className="out-row">
            <div className="out-label">Monthly cash flow</div>
            <div className="out-value sm" id="coc-monthly">—</div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="tool" id="onepct">
      <div className="tool-head">
        <div className="tool-title-wrap">
          <div className="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
          </div>
          <div>
            <div className="tool-title">1% rule checker</div>
            <div className="tool-sub">Monthly rent ≥ 1% of purchase price.</div>
          </div>
        </div>
        <div className="tool-tip" tabIndex="0">?
          <div className="tip-body">Old-school back-of-napkin test. A $150k house should rent for $1,500+ to cash flow. The rule is a filter, not a verdict — nothing under 0.7% pencils, anything over 1.2% deserves a phone call today.</div>
        </div>
      </div>
      <div className="tool-body">
        <div className="field">
          <label className="field-label" htmlFor="one-price">Purchase price</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="one-price" value="165000" min="0" step="1000" inputMode="decimal" />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="one-rent">Monthly rent</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="one-rent" value="1650" min="0" step="25" inputMode="decimal" />
          </div>
        </div>

        <div className="tool-output" id="one-out">
          <div className="out-row">
            <div>
              <div className="out-label">Rent-to-price ratio</div>
              <div className="verdict" id="one-verdict" style={{marginTop: "6px", padding: "0", background: "transparent"}}>Calculating…</div>
            </div>
            <div className="out-value" id="one-value">—</div>
          </div>
          <div className="out-row">
            <div className="out-label">Rent needed to hit 1%</div>
            <div className="out-value sm" id="one-target">—</div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="tool" id="afford">
      <div className="tool-head">
        <div className="tool-title-wrap">
          <div className="tool-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div>
            <div className="tool-title">Tenant rent affordability</div>
            <div className="tool-sub">Rent-to-income ratio for applicant screening.</div>
          </div>
        </div>
        <div className="tool-tip" tabIndex="0">?
          <div className="tip-body">Industry standard is 3x rent. Under 33% is safe. 33–40% is stretched and they'll be late when the car breaks down. Over 50% is a red flag — they'll either skip or ask you for relief in month three.</div>
        </div>
      </div>
      <div className="tool-body">
        <div className="field">
          <label className="field-label" htmlFor="aff-income">Applicant monthly gross income</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="aff-income" value="5400" min="0" step="100" inputMode="decimal" />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="aff-rent">Monthly rent</label>
          <div className="input-wrap">
            <span className="input-prefix">$</span>
            <input type="number" id="aff-rent" value="1750" min="0" step="25" inputMode="decimal" />
          </div>
        </div>

        <div className="tool-output" id="aff-out">
          <div className="out-row">
            <div>
              <div className="out-label">Rent-to-income</div>
              <div className="verdict" id="aff-verdict" style={{marginTop: "6px", padding: "0", background: "transparent"}}>Calculating…</div>
            </div>
            <div className="out-value" id="aff-value">—</div>
          </div>
          <div className="out-row">
            <div className="out-label">Income multiple</div>
            <div className="out-value sm" id="aff-mult">—</div>
          </div>
        </div>

        <div className="tool-foot">
          <div className="tool-foot-note">Save this to the applicant's profile in Tenantory.</div>
          <button className="btn-save" id="aff-save">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save to applicant
          </button>
        </div>
      </div>
    </div>

  </section>

  
  <section className="cross-sell">
    <div className="cross-card">
      <div>
        <div className="cross-label">The shameless cross-sell</div>
        <div className="cross-title">These calculators are nice. Running them on your whole portfolio is nicer.</div>
        <div className="cross-sub">Inside Tenantory, every property gets a live cap rate, cash-on-cash, and occupancy score — updated every time rent hits the bank. Stop opening a spreadsheet to know if your rentals are working.</div>
        <ul className="cross-list">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Cap rate per property, auto-updated from your ledger
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Applicant screening with affordability built in
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Monthly investor report that does the math for you
          </li>
        </ul>
        <div className="cross-actions">
          <a className="btn btn-pink" href="onboarding.html">
            Start free trial
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="btn btn-ghost" href="pricing.html">See pricing</a>
        </div>
      </div>

      <div className="mockup">
        <div className="mock-head">
          <div className="mock-title">Portfolio · Rent roll</div>
          <div className="mock-pill">Live</div>
        </div>
        <div className="mock-row">
          <div className="mock-addr">908 Lee Dr NW<small>Huntsville, AL · SFR</small></div>
          <div className="mock-cap">9.2%</div>
          <div className="mock-badge good">Strong</div>
        </div>
        <div className="mock-row">
          <div className="mock-addr">3026 Turf Ave NW<small>Huntsville, AL · SFR</small></div>
          <div className="mock-cap">7.4%</div>
          <div className="mock-badge mid">Okay</div>
        </div>
        <div className="mock-row">
          <div className="mock-addr">221 Bradford Dr<small>Huntsville, AL · Duplex</small></div>
          <div className="mock-cap">11.1%</div>
          <div className="mock-badge good">Strong</div>
        </div>
        <div className="mock-row">
          <div className="mock-addr">44 Holmes Ave SE<small>Huntsville, AL · SFR</small></div>
          <div className="mock-cap">5.2%</div>
          <div className="mock-badge bad">Thin</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="faq" id="faq">
    <div className="section-head">
      <div className="section-kicker">Tool FAQ</div>
      <h2>Quick answers, real numbers.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">How do you calculate cap rate? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Net Operating Income (annual rent minus operating expenses — tax, insurance, maintenance, vacancy, management fees, but NOT the mortgage) divided by purchase price. That's it. If somebody quotes you a cap rate that includes debt service, they're pitching you, not teaching you.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Is the 1% rule still valid? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">As a filter, yes. As a verdict, no. In most Sun Belt markets you can still hit 1% on smaller SFRs. In Denver, Austin, or coastal California, 0.6% is a "great" deal and you're buying for appreciation. Use it to eliminate obvious losers in 5 seconds — then do the real math.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What's a realistic vacancy rate? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">In a stable market with a decent property, pencil 5–8%. In a rougher class-C neighborhood or a college town, 10%+ is honest. If you're modeling 0% vacancy you're lying to yourself — every unit turns, and every turn has 2–4 weeks of empty.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What income multiple should I require on applicants? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">3x gross monthly rent is the industry standard and what Fair Housing attorneys recommend applying uniformly. 2.5x in hot rental markets is defensible if you're also requiring a cosigner or extra deposit. Below 2x is usually a late-rent story with extra steps.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I save these results? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Not on this page — these calculators are stateless on purpose. Bookmark the page, or if you want a cap rate and affordability score attached to every property and applicant in your portfolio, that's what Tenantory is for. Start the 14-day trial, no card.</div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Put the math on autopilot.</h2>
      <p>Tenantory runs these calculators on your whole portfolio, every day, automatically — plus it collects the rent, signs the leases, and ships the investor reports. 14-day free trial. No credit card.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
      <div className="cta-note">No credit card · Free data migration on Pro</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
      <a href="tools.html">Tools</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  
  <div className="toast" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    <span id="toast-msg">Saved.</span>
  </div>

  

    </>
  );
}
