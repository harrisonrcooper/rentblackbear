"use client";

// Mock ported from ~/Desktop/blackbear/for-landlords.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 80px 32px 48px; text-align: center; max-width: 1100px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(38px, 5.2vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 920px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 680px; margin: 0 auto 32px; line-height: 1.6;\n    }\n    .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }\n    .hero-note { font-size: 12px; color: var(--text-faint); }\n\n    .hero-portrait {\n      max-width: 880px; margin: 56px auto 0;\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n    }\n    .hp-stat {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 22px;\n      text-align: left;\n    }\n    .hp-stat-num {\n      font-size: 28px; font-weight: 900; letter-spacing: -0.03em; color: var(--text);\n      margin-bottom: 2px;\n    }\n    .hp-stat-num em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hp-stat-lbl { font-size: 13px; color: var(--text-muted); line-height: 1.45; }\n\n    /* ===== Section head ===== */\n    .section-head { text-align: center; margin-bottom: 44px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 0 auto; line-height: 1.6; }\n\n    /* ===== Toolkit ===== */\n    .toolkit { max-width: 1120px; margin: 88px auto 0; padding: 0 32px; }\n    .tk-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .tk-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px;\n      transition: all 0.2s ease;\n    }\n    .tk-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n    .tk-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 16px;\n    }\n    .tk-icon svg { width: 22px; height: 22px; }\n    .tk-card.accent .tk-icon { background: var(--pink-bg); color: #c21a6a; }\n    .tk-card h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .tk-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }\n\n    /* ===== NOT list ===== */\n    .notlist { max-width: 1120px; margin: 96px auto 0; padding: 0 32px; }\n    .nl-wrap {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 28px;\n      background: linear-gradient(135deg, var(--surface-subtle), var(--blue-softer));\n      border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 44px;\n    }\n    .nl-side h3 {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 14px;\n    }\n    .nl-side.not h3 { color: var(--red); }\n    .nl-side.is h3 { color: var(--green-dark); }\n    .nl-side ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }\n    .nl-side li {\n      display: flex; align-items: flex-start; gap: 10px;\n      font-size: 15px; line-height: 1.5;\n    }\n    .nl-side li svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; padding: 2px; border-radius: 50%; }\n    .nl-side.not li svg { color: var(--red); background: rgba(214,69,69,0.1); }\n    .nl-side.is li svg { color: var(--green-dark); background: var(--green-bg); }\n    .nl-side.not li { color: var(--text-muted); }\n    .nl-side.is li { color: var(--text); font-weight: 500; }\n    .nl-side.is li strong { font-weight: 700; }\n\n    /* ===== Scenarios ===== */\n    .scenarios { max-width: 1120px; margin: 96px auto 0; padding: 0 32px; }\n    .sc-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;\n    }\n    .sc-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px;\n      position: relative; overflow: hidden;\n    }\n    .sc-card::before {\n      content: \"\"; position: absolute; top: 0; left: 0; width: 4px; height: 100%;\n      background: linear-gradient(180deg, var(--blue-bright), var(--pink));\n    }\n    .sc-time {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      color: var(--pink); margin-bottom: 10px;\n    }\n    .sc-card h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; line-height: 1.25; }\n    .sc-pain {\n      font-size: 14.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 18px;\n    }\n    .sc-pain strong { color: var(--text); font-weight: 600; }\n    .sc-fix {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n      display: flex; align-items: flex-start; gap: 12px;\n    }\n    .sc-fix-ico {\n      width: 28px; height: 28px; border-radius: 8px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .sc-fix-ico svg { width: 16px; height: 16px; }\n    .sc-fix-txt { font-size: 13.5px; line-height: 1.5; color: var(--text); }\n    .sc-fix-txt strong { font-weight: 700; }\n\n    /* ===== Pricing callout ===== */\n    .pricing-call { max-width: 1120px; margin: 96px auto 0; padding: 0 32px; }\n    .pc-wrap {\n      display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;\n    }\n    .pc-card {\n      background: var(--surface); border: 2px solid var(--pink);\n      border-radius: var(--radius-xl); padding: 36px;\n      position: relative; overflow: hidden;\n      box-shadow: 0 20px 60px rgba(255,73,152,0.14);\n    }\n    .pc-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 220px; height: 220px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .pc-ribbon {\n      display: inline-flex; align-items: center; gap: 6px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; padding: 5px 13px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 20px; position: relative; z-index: 1;\n    }\n    .pc-name { font-weight: 800; font-size: 15px; color: var(--text); margin-bottom: 4px; position: relative; z-index: 1; }\n    .pc-tag { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; position: relative; z-index: 1; }\n    .pc-price { display: flex; align-items: baseline; gap: 6px; margin-bottom: 20px; position: relative; z-index: 1; }\n    .pc-amt { font-size: 64px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--text); }\n    .pc-per { font-size: 16px; color: var(--text-muted); font-weight: 500; }\n    .pc-feats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; position: relative; z-index: 1; }\n    .pc-feats li {\n      list-style: none; display: flex; align-items: flex-start; gap: 10px;\n      font-size: 14px; color: var(--text); line-height: 1.45;\n    }\n    .pc-feats li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;\n      color: var(--green-dark); padding: 2px;\n      background: var(--green-bg); border-radius: 50%;\n    }\n    .pc-cta { position: relative; z-index: 1; }\n    .pc-cta .btn { width: 100%; justify-content: center; }\n    .pc-note { text-align: center; font-size: 12px; color: var(--text-faint); margin-top: 10px; }\n\n    .pc-side {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px;\n      display: flex; flex-direction: column; justify-content: center;\n    }\n    .pc-side h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; }\n    .pc-side p { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }\n    .pc-side p strong { color: var(--text); font-weight: 700; }\n    .pc-side .pc-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 14px; color: var(--blue); font-weight: 600;\n    }\n    .pc-side .pc-link:hover { color: var(--navy); }\n    .pc-side .pc-link svg { width: 14px; height: 14px; }\n\n    /* ===== Case study ===== */\n    .case { max-width: 1000px; margin: 96px auto 0; padding: 0 32px; }\n    .case-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 48px;\n      position: relative; overflow: hidden;\n    }\n    .case-card::before {\n      content: \"\"; position: absolute; top: -40%; right: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.25), transparent 70%);\n    }\n    .case-card > * { position: relative; z-index: 1; }\n    .case-kicker {\n      font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 14px;\n    }\n    .case-quote {\n      font-size: clamp(20px, 2.3vw, 26px); font-weight: 600; line-height: 1.4; letter-spacing: -0.015em;\n      margin-bottom: 28px; max-width: 780px;\n    }\n    .case-quote em { font-style: normal; color: #ffb5d4; }\n    .case-who {\n      display: flex; align-items: center; gap: 16px;\n      padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12);\n    }\n    .case-avatar {\n      width: 52px; height: 52px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 17px; color: #fff; letter-spacing: -0.01em;\n      flex-shrink: 0;\n    }\n    .case-who-txt { flex: 1; }\n    .case-who-name { font-weight: 700; font-size: 15px; margin-bottom: 2px; }\n    .case-who-role { font-size: 13px; color: rgba(255,255,255,0.7); }\n    .case-stats {\n      display: grid; grid-template-columns: repeat(3, auto); gap: 28px;\n      margin-left: auto;\n    }\n    .case-stat-num { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }\n    .case-stat-num em { font-style: normal; color: #ffb5d4; }\n    .case-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 820px; margin: 96px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }\n    .faq-a strong { color: var(--text); font-weight: 600; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 60px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 620px; margin: 0 auto 28px; line-height: 1.6; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 18px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 56px 20px 32px; }\n      .toolkit, .notlist, .scenarios, .pricing-call, .case, .faq, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .hero-portrait { grid-template-columns: 1fr; }\n      .tk-grid { grid-template-columns: 1fr; }\n      .nl-wrap { grid-template-columns: 1fr; padding: 28px; }\n      .sc-grid { grid-template-columns: 1fr; }\n      .pc-wrap { grid-template-columns: 1fr; }\n      .case-card { padding: 32px 22px; }\n      .case-who { flex-direction: column; align-items: flex-start; gap: 20px; }\n      .case-stats { margin-left: 0; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n      .cta-card { padding: 40px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="for-landlords.html">For landlords</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
      For the 1–5 door operator
    </div>
    <h1>Own a rental? You shouldn't need a <em>second job</em> to manage it.</h1>
    <p className="hero-sub">You've got a day job. You inherited a house, or bought one as an investment, or turned your starter home into a rental. You don't want to <em>become</em> a property manager — you just want the rent to show up and the tenant to stop texting you on Sunday night.</p>
    <div className="hero-actions">
      <a className="btn btn-pink btn-lg" href="onboarding.html">
        Start free trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="pricing.html">See Starter — $39/mo</a>
    </div>
    <div className="hero-note">14-day free trial · no credit card · built for up to 5 units</div>

    <div className="hero-portrait">
      <div className="hp-stat">
        <div className="hp-stat-num"><em>~4 hrs/mo</em></div>
        <div className="hp-stat-lbl">Average time a 2-unit landlord spends chasing rent, receipts, and texts</div>
      </div>
      <div className="hp-stat">
        <div className="hp-stat-num"><em>$1,860</em></div>
        <div className="hp-stat-lbl">What the average accidental landlord overpays at tax time without a ledger</div>
      </div>
      <div className="hp-stat">
        <div className="hp-stat-num"><em>30 min</em></div>
        <div className="hp-stat-lbl">How long tax season takes once Schedule-E is one click away</div>
      </div>
    </div>
  </section>

  
  <section className="toolkit">
    <div className="section-head">
      <div className="section-kicker">The toolkit</div>
      <h2>The accidental landlord's toolkit.</h2>
      <p>Every landlord we talked to wanted the same five things. Not twenty. Not a dashboard with eleven KPIs. Five things. Here they are.</p>
    </div>
    <div className="tk-grid">
      <div className="tk-card">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        </div>
        <h3>Rent lands in your bank</h3>
        <p>Tenant pays by ACH (free) or card. It clears to your bank in 2–3 business days. Autopay so you stop "reminding." No more Venmo screenshots.</p>
      </div>
      <div className="tk-card">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
        </div>
        <h3>Lease is where you can find it</h3>
        <p>Sign a new lease in the browser. Store the old one. Three years from now when you need to pull the pet clause, it's not in a Gmail thread — it's right there.</p>
      </div>
      <div className="tk-card accent">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        </div>
        <h3>Maintenance without the 9pm text</h3>
        <p>Tenant submits a ticket with a photo. You approve, assign your handyman, close it out. Nobody has your cell. You sleep through Sunday night.</p>
      </div>
      <div className="tk-card">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        </div>
        <h3>One place to talk to your tenant</h3>
        <p>Every message, every notice, every receipt in one thread. No more "which text did they send?" If you ever need to show a paper trail, it's there.</p>
      </div>
      <div className="tk-card">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 11v6" /><path d="M9 14l3 3 3-3" /></svg>
        </div>
        <h3>A tax export that doesn't take a weekend</h3>
        <p>One click pulls every rent check and every expense into a clean Schedule-E summary. Send it to your CPA. Tax season goes from a weekend to a coffee.</p>
      </div>
      <div className="tk-card">
        <div className="tk-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </div>
        <h3>Set it up in an afternoon</h3>
        <p>You are not spinning up AppFolio. You add a property, invite your tenant by email, and they onboard themselves. The whole setup fits between soccer practice and dinner.</p>
      </div>
    </div>
  </section>

  
  <section className="notlist">
    <div className="section-head">
      <div className="section-kicker">Counter-positioning</div>
      <h2>What you're <em style={{fontStyle: "normal", background: "linear-gradient(135deg,var(--blue-bright),var(--pink))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"}}>not</em>.</h2>
      <p>A quick gut-check so you don't buy the wrong thing. Black Bear Rentals Starter is intentionally simple. Here's what you're avoiding and what you actually are.</p>
    </div>
    <div className="nl-wrap">
      <div className="nl-side not">
        <h3>You are NOT</h3>
        <ul>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Running AppFolio. You don't need 600 features to manage 2 houses.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            A full-time property manager. This is a side hustle, not a career change.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Managing investor capital. Your only "investor" is your spouse.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Paying $280/mo for software that requires a 50-unit minimum.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Learning accounting software. You shouldn't have to know what "GL code" means.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Building a brand. You don't need your own domain and investor-facing portal yet.
          </li>
        </ul>
      </div>
      <div className="nl-side is">
        <h3>You ARE</h3>
        <ul>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            A pilot, teacher, nurse, or engineer <strong>with a rental or three</strong>.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Someone who wants rent to <strong>just work</strong> — automatic, on time, in your bank.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Looking for <strong>one clean record</strong> for your CPA in April.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Tired of your tenant texting your personal cell for <strong>a broken garbage disposal</strong>.
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            The perfect fit for <strong>Starter — $39/mo, up to 5 units</strong>.
          </li>
        </ul>
      </div>
    </div>
  </section>

  
  <section className="scenarios">
    <div className="section-head">
      <div className="section-kicker">Real moments</div>
      <h2>Four moments that made you Google this.</h2>
      <p>Specific scenarios. Specific fixes. If any of these sound like your week, Starter is built for you.</p>
    </div>
    <div className="sc-grid">

      <div className="sc-card">
        <div className="sc-time">Sunday · 9:07 pm</div>
        <h3>"The one text I don't want to get at 9pm on a Sunday."</h3>
        <p className="sc-pain">Your phone buzzes. It's your tenant. <strong>"Hey sorry, the water heater just started leaking."</strong> You're in pajamas. Your handyman isn't picking up. You stare at the text for three minutes trying to figure out the right response.</p>
        <div className="sc-fix">
          <div className="sc-fix-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="sc-fix-txt"><strong>With Black Bear Rentals:</strong> Tenant opens the portal, submits a ticket with a photo and a priority. You see it, tap "assign to Mike," and Mike gets a text with the address. Total time: 90 seconds. Your Sunday stays your Sunday.</div>
        </div>
      </div>

      <div className="sc-card">
        <div className="sc-time">April · 11:42 pm</div>
        <h3>"Tax season in 30 minutes."</h3>
        <p className="sc-pain">It's April 12. Your CPA needs Schedule E numbers by Friday. You open a shoebox of receipts. You open Chase. You open Venmo. You try to remember if that $340 Home Depot run was for <strong>the rental or for your kitchen</strong>. You lose a Saturday.</p>
        <div className="sc-fix">
          <div className="sc-fix-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="sc-fix-txt"><strong>With Black Bear Rentals:</strong> Every rent payment is categorized. Every expense you log gets a tag. Hit "Export Schedule E" and a clean PDF + CSV drops in your inbox. Forward to your CPA. Done before the coffee is cold.</div>
        </div>
      </div>

      <div className="sc-card">
        <div className="sc-time">Tuesday · 7:14 am</div>
        <h3>"The tenant paid but I still forget to mark it."</h3>
        <p className="sc-pain">Rent hit your Chase account last Saturday. You forgot to tell your tenant "got it, thanks." You forgot to write it down. <strong>Three weeks later you can't remember</strong> if March rent came through — because April rent is on top of it in the statement.</p>
        <div className="sc-fix">
          <div className="sc-fix-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="sc-fix-txt"><strong>With Black Bear Rentals:</strong> Tenant sets up autopay. Rent is drafted on the 1st. The ledger auto-marks it paid. You get a "Rent landed — $1,450" email. If a payment ever fails, you know the same day.</div>
        </div>
      </div>

      <div className="sc-card">
        <div className="sc-time">November · 2:31 pm</div>
        <h3>"The lease that's still in my email from 2021."</h3>
        <p className="sc-pain">Your tenant wants to know if they can get a second cat. You said yes to one cat in the lease. Was it the 2021 lease? The renewal? You scroll through Gmail. You find three versions. <strong>Two are unsigned</strong>. You panic-search "pet clause."</p>
        <div className="sc-fix">
          <div className="sc-fix-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="sc-fix-txt"><strong>With Black Bear Rentals:</strong> Every lease is signed in-app and filed under the property. Searchable. Dated. Clearly marked "current" vs. "expired." The pet clause is one click away — for you and the tenant.</div>
        </div>
      </div>

    </div>
  </section>

  
  <section className="pricing-call">
    <div className="section-head">
      <div className="section-kicker">Pricing</div>
      <h2>Starter is built for you. Literally you.</h2>
      <p>$39/mo. Up to 5 units. Everything the toolkit above does. No upsell, no "starter-tier-but-actually-pay-more" nonsense.</p>
    </div>
    <div className="pc-wrap">
      <div className="pc-card">
        <div className="pc-ribbon">Built for 1–5 doors</div>
        <div className="pc-name">Starter</div>
        <div className="pc-tag">For the accidental landlord · up to 5 units</div>
        <div className="pc-price">
          <span className="pc-amt">$39</span>
          <span className="pc-per">/month</span>
        </div>
        <ul className="pc-feats">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Online rent collection — ACH free, cards 2.95%</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Autopay + late-fee automation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Lease e-sign &amp; document storage</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Maintenance ticketing with photo upload</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Income/expense ledger + Schedule-E friendly export</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Tenant portal at rentblackbear.com/you</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Email support (48hr) and our $100 time-back guarantee</li>
        </ul>
        <div className="pc-cta">
          <a className="btn btn-pink btn-lg" href="onboarding.html">
            Start Starter free for 14 days
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <div className="pc-note">No credit card · cancel in one click</div>
        </div>
      </div>

      <div className="pc-side">
        <h3>Someday you'll add a 6th door.</h3>
        <p>When that happens — a neighbor sells, you close on a duplex, life happens — you move up to <strong>Pro at $99/mo</strong> (up to 50 units). We email you at 4 of 5, one click upgrades you, and you keep all your data, leases, and tenant history. No migration. No "start over."</p>
        <p style={{fontSize: "14px"}}>Until then, Starter is the whole product for the whole job. Don't pay for Pro before you need it.</p>
        <a className="pc-link" href="pricing.html">
          See every plan
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
      </div>
    </div>
  </section>

  
  <section className="case">
    <div className="case-card">
      <div className="case-kicker">Accidental landlord story</div>
      <div className="case-quote">
        "I'm a regional pilot. I inherited my grandma's house in 2022 and bought a duplex two years later. I didn't want to be a landlord — I wanted the cash flow. <em>Black Bear Rentals is the only reason my wife doesn't hate those houses.</em> Rent shows up. Maintenance tickets route to Mike. Tax season took me 20 minutes this year."
      </div>
      <div className="case-who">
        <div className="case-avatar">DR</div>
        <div className="case-who-txt">
          <div className="case-who-name">Derek R.</div>
          <div className="case-who-role">Regional pilot · 3 units in Huntsville, AL</div>
        </div>
        <div className="case-stats">
          <div>
            <div className="case-stat-num"><em>3</em></div>
            <div className="case-stat-lbl">Units</div>
          </div>
          <div>
            <div className="case-stat-num"><em>20 min</em></div>
            <div className="case-stat-lbl">Tax season</div>
          </div>
          <div>
            <div className="case-stat-num"><em>$39</em></div>
            <div className="case-stat-lbl">Monthly</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="faq" id="faq">
    <div className="section-head">
      <div className="section-kicker">Questions</div>
      <h2>The things a solo landlord actually asks.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">I only have one rental — is this overkill? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Honest answer: no, and that's exactly who we built Starter for. One rental is where the forgetfulness starts — one missed rent, one unsigned renewal, one Home Depot receipt you can't find in April. <strong>$39/mo for rent collection + lease storage + a clean tax export</strong> pays for itself the first time you don't lose a $280 expense because you threw the receipt away.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What if my tenant already pays by Venmo? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Venmo works until it doesn't. Three problems it quietly creates: (1) no paper trail your CPA will accept, (2) no autopay — you're still "reminding" the tenant, and (3) personal-account Venmo starts flagging rent transfers as a business and can freeze them. Black Bear Rentals gives the tenant the same "tap to pay" experience, but the receipts, ledger, and autopay all happen in the background. <strong>Most tenants prefer it</strong> once they try it.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Do I really need lease e-signing for one unit? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">You need a signed lease. You don't need DocuSign. We give you a free state-specific template, you fill in the blanks, both of you sign in the browser in about four minutes, and the signed PDF lives in the property file forever. <strong>The lease you actually need is the one you can find three years from now</strong> — that's the part most single-unit landlords skip and regret.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What about Schedule E? Do you "do taxes"? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">We don't file your taxes — your CPA does that. But we give you the one document your CPA actually wants: a per-property <strong>income and expense summary in the Schedule-E format</strong>, plus a CSV of every transaction. Export it, email your CPA, done. Most of our landlords tell us their CPA bill dropped because they stopped paying for "bookkeeping cleanup."</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">I'm not tech-savvy — can I actually do this? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes. If you can use Gmail and Venmo, you're over-qualified. The whole setup is: add your property (name + address), invite your tenant by email, they click the link and enter their bank info. <strong>Average first-time setup is 18 minutes.</strong> If you get stuck, email hello@rentblackbear.com — a real human responds, usually same day.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What if my tenant doesn't want to use a portal? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">They won't see "a portal." They'll get an email that says "Pay March rent — $1,450" with a button. They click, enter their bank once, and never think about it again. <strong>We designed the tenant side to look like a receipt, not a dashboard.</strong> Zero learning curve. If they really want to keep paying by check, that's fine too — you just log the check in the ledger and everything else still works.</div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Your rental shouldn't run your weekends.</h2>
      <p>Try Starter free for 14 days. No credit card. Set up your first property in an afternoon. If Black Bear Rentals doesn't save you 10+ hours in your first 30 paid days, we refund you and wire $100 for wasting your time.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Start Starter — $39/mo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="portal.html" target="_blank">See what your tenant sees</a>
      </div>
      <div className="cta-note">14-day free trial · no credit card · cancel in one click</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="for-landlords.html">For landlords</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
