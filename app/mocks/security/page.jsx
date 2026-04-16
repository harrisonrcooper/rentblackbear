"use client";

// Mock ported from ~/Desktop/blackbear/security.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --purple: #7c4dff;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n    }\n\n    /* ===== Topbar (match pricing.html) ===== */\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }\n    .tb-nav { display: flex; gap: 4px; }\n    .tb-nav-item { padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted); transition: all 0.15s ease; }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 72px 32px 36px; text-align: center; max-width: 880px; margin: 0 auto;\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--green-bg); color: var(--green-dark);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 54px); font-weight: 900; letter-spacing: -0.035em;\n      line-height: 1.04; margin-bottom: 18px;\n    }\n    .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }\n\n    /* ===== Trust strip ===== */\n    .trust { max-width: 1100px; margin: 40px auto 0; padding: 0 32px; }\n    .trust-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n    }\n    .trust-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      display: flex; gap: 14px; align-items: flex-start;\n      transition: all 0.15s ease;\n    }\n    .trust-card:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); }\n    .trust-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .trust-icon.a { background: var(--blue-pale); color: var(--blue); }\n    .trust-icon.b { background: var(--green-bg); color: var(--green-dark); }\n    .trust-icon.c { background: var(--pink-bg); color: #c21a6a; }\n    .trust-icon.d { background: rgba(245,166,35,0.16); color: #a96f10; }\n    .trust-icon svg { width: 22px; height: 22px; }\n    .trust-title { font-weight: 800; font-size: 14px; margin-bottom: 3px; }\n    .trust-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n    .trust-sub .status {\n      display: inline-block; margin-top: 4px;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      padding: 2px 8px; border-radius: 100px;\n    }\n    .status.active { background: var(--green-bg); color: var(--green-dark); }\n    .status.progress { background: var(--blue-pale); color: var(--blue); }\n\n    /* ===== Architecture diagram ===== */\n    .arch-wrap { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .section-head { text-align: center; margin-bottom: 40px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 0 auto; }\n\n    .arch {\n      background: linear-gradient(180deg, var(--surface) 0%, var(--surface-alt) 100%);\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 40px 32px; position: relative;\n    }\n    .arch-tier { margin-bottom: 24px; }\n    .arch-tier:last-child { margin-bottom: 0; }\n    .arch-tier-label {\n      font-size: 11px; font-weight: 800; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;\n      text-align: center;\n    }\n    .arch-row { display: grid; gap: 12px; }\n    .arch-row.three { grid-template-columns: repeat(3, 1fr); }\n    .arch-row.two { grid-template-columns: repeat(2, 1fr); }\n    .arch-row.one { grid-template-columns: 1fr; max-width: 640px; margin: 0 auto; }\n    .arch-node {\n      background: var(--surface); border: 1.5px solid var(--border);\n      border-radius: var(--radius-lg); padding: 16px 18px;\n      transition: all 0.15s ease;\n    }\n    .arch-node:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); transform: translateY(-2px); }\n    .arch-node-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }\n    .arch-node-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      color: #fff;\n    }\n    .arch-node-icon.edge { background: linear-gradient(135deg, var(--blue-bright), var(--blue)); }\n    .arch-node-icon.auth { background: linear-gradient(135deg, var(--pink), #c21a6a); }\n    .arch-node-icon.pay { background: linear-gradient(135deg, var(--purple), #5a36c2); }\n    .arch-node-icon.app { background: linear-gradient(135deg, #000, #333); }\n    .arch-node-icon.db { background: linear-gradient(135deg, var(--green), var(--green-dark)); }\n    .arch-node-icon.file { background: linear-gradient(135deg, var(--gold), #c47913); }\n    .arch-node-icon svg { width: 16px; height: 16px; }\n    .arch-node-name { font-weight: 700; font-size: 14px; }\n    .arch-node-meta { font-size: 12px; color: var(--text-muted); line-height: 1.45; }\n    .arch-node-meta code {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      padding: 1px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    }\n\n    .arch-connector {\n      text-align: center; color: var(--text-faint); font-size: 11px;\n      padding: 10px 0; font-family: 'JetBrains Mono', monospace;\n    }\n    .arch-connector svg { display: inline-block; vertical-align: middle; width: 12px; height: 12px; margin: 0 6px; }\n\n    /* ===== Principles ===== */\n    .principles { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .principle-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .principle {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 28px;\n      transition: all 0.15s ease;\n    }\n    .principle:hover { transform: translateY(-2px); box-shadow: var(--shadow); }\n    .principle-num {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 12px; font-weight: 700; color: var(--text-faint);\n      letter-spacing: 0.08em; margin-bottom: 10px;\n    }\n    .principle h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 10px; }\n    .principle p { color: var(--text-muted); font-size: 14px; line-height: 1.6; }\n    .principle p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Data table (what we store) ===== */\n    .data-wrap { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .data-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .data-table {\n      width: 100%; border-collapse: collapse; font-size: 14px;\n    }\n    .data-table thead th {\n      text-align: left; padding: 16px 20px; font-weight: 800;\n      color: var(--text-muted); font-size: 11px;\n      text-transform: uppercase; letter-spacing: 0.1em;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .data-table td {\n      padding: 16px 20px; border-bottom: 1px solid var(--border); vertical-align: top;\n    }\n    .data-table tr:last-child td { border-bottom: none; }\n    .data-table td:first-child { font-weight: 700; color: var(--text); width: 24%; }\n    .data-table td:nth-child(2) { color: var(--text-muted); width: 42%; line-height: 1.5; }\n    .data-table td:nth-child(3) { width: 17%; }\n    .data-table td:nth-child(4) { width: 17%; }\n    .data-pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;\n    }\n    .data-pill.enc { background: var(--green-bg); color: var(--green-dark); }\n    .data-pill.hash { background: var(--blue-pale); color: var(--blue); }\n    .data-pill.token { background: rgba(124,77,255,0.12); color: #5a36c2; }\n    .data-pill.none { background: var(--surface-alt); color: var(--text-muted); }\n\n    /* ===== Incident response ===== */\n    .incident {\n      max-width: 1100px; margin: 80px auto 0; padding: 0 32px;\n      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;\n    }\n    .incident-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px 28px;\n    }\n    .incident-card.featured {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 100%);\n      color: #fff; border-color: transparent; position: relative; overflow: hidden;\n    }\n    .incident-card.featured::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 240px; height: 240px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);\n    }\n    .incident-label { font-size: 11px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; position: relative; z-index: 1; }\n    .incident-card.featured .incident-label { color: var(--pink); }\n    .incident-card h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; position: relative; z-index: 1; }\n    .incident-card p { font-size: 14.5px; line-height: 1.6; color: var(--text-muted); position: relative; z-index: 1; }\n    .incident-card.featured p { color: rgba(255,255,255,0.85); }\n    .incident-card p + p { margin-top: 10px; }\n    .incident-list {\n      list-style: none; padding: 0; margin-top: 16px; position: relative; z-index: 1;\n    }\n    .incident-list li {\n      display: flex; align-items: flex-start; gap: 10px;\n      padding: 8px 0; font-size: 14px; line-height: 1.5;\n    }\n    .incident-list svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 3px;\n      padding: 2px; border-radius: 50%;\n    }\n    .incident-list li svg { color: var(--green-dark); background: var(--green-bg); }\n    .incident-card.featured .incident-list li svg { color: #fff; background: rgba(255,255,255,0.15); }\n    .incident-card.featured .incident-list li { color: #fff; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 820px; margin: 80px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden; transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 520px; padding: 0 22px 20px; }\n    .faq-a code {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      padding: 1px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px;\n    }\n\n    /* ===== Bug bounty ===== */\n    .bounty {\n      max-width: 1100px; margin: 80px auto 0; padding: 0 32px;\n    }\n    .bounty-card {\n      background: linear-gradient(135deg, var(--surface-alt) 0%, var(--blue-softer) 100%);\n      border: 1px solid var(--blue-pale); border-radius: var(--radius-xl);\n      padding: 36px 40px;\n      display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;\n    }\n    .bounty-label { font-size: 11px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }\n    .bounty h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .bounty p { font-size: 14.5px; color: var(--text-muted); line-height: 1.6; max-width: 580px; }\n    .bounty code { background: var(--surface); border: 1px solid var(--border); padding: 1px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text); }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 38px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }\n    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1100px; margin: 64px auto 0; padding: 36px 32px 28px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 18px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 28px; }\n      .trust { padding: 0 16px; }\n      .trust-grid { grid-template-columns: 1fr 1fr; }\n      .arch-wrap, .principles, .data-wrap, .incident, .faq, .bounty, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .arch-row.three, .arch-row.two { grid-template-columns: 1fr; }\n      .principle-grid { grid-template-columns: 1fr; }\n      .incident { grid-template-columns: 1fr; }\n      .bounty-card { grid-template-columns: 1fr; }\n      .cta-card { padding: 36px 22px; }\n      .data-table { font-size: 13px; }\n      .data-table th, .data-table td { padding: 12px 14px; }\n    }\n  ";

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
      <a className="tb-nav-item" href="stories.html">Stories</a>
      <a className="tb-nav-item active" href="security.html">Security</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
      SOC 2 · Stripe PCI · built on audited infrastructure
    </div>
    <h1>Your tenants' data <em>isn't</em> a side project.</h1>
    <p className="hero-sub">We don't write novels about how much we love security. Here's how it actually works: the stack, what we store, how we handle it, and what happens if something goes wrong.</p>
  </section>

  
  <section className="trust">
    <div className="trust-grid">
      <div className="trust-card">
        <div className="trust-icon a">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
        </div>
        <div>
          <div className="trust-title">SOC 2 Type II</div>
          <div className="trust-sub">Annual third-party audit of our security, availability, and confidentiality controls. <span className="status progress">Audit in progress — report Q3 2026</span></div>
        </div>
      </div>
      <div className="trust-card">
        <div className="trust-icon b">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        </div>
        <div>
          <div className="trust-title">Stripe · PCI DSS Level 1</div>
          <div className="trust-sub">All payments handled by Stripe. We never see or store full card numbers. <span className="status active">Active</span></div>
        </div>
      </div>
      <div className="trust-card">
        <div className="trust-icon c">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </div>
        <div>
          <div className="trust-title">GDPR &amp; CCPA ready</div>
          <div className="trust-sub">Export, portability, deletion requests honored within 30 days. Data Processing Agreement available on request. <span className="status active">Active</span></div>
        </div>
      </div>
      <div className="trust-card">
        <div className="trust-icon d">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <div>
          <div className="trust-title">status.rentblackbear.com</div>
          <div className="trust-sub">Public uptime &amp; incident page. Every outage is disclosed within 30 minutes with root-cause to follow. <span className="status active">99.98% 90-day uptime</span></div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="arch-wrap">
    <div className="section-head">
      <div className="section-kicker">The stack</div>
      <h2>Every layer is audited, so we don't have to build security from scratch.</h2>
      <p>Black Bear Rentals sits on top of platforms that are individually SOC 2-certified. We're not asking you to trust our homegrown crypto — we don't write any.</p>
    </div>

    <div className="arch">
      <div className="arch-tier">
        <div className="arch-tier-label">Edge · traffic in</div>
        <div className="arch-row one">
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon edge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <div className="arch-node-name">Vercel Edge + Cloudflare</div>
            </div>
            <div className="arch-node-meta">
              TLS 1.3 on every connection, HSTS preload, DDoS protection at Anycast edge. Per-workspace domain routing via <code>proxy.ts</code>. SOC 2 Type II.
            </div>
          </div>
        </div>
      </div>

      <div className="arch-connector">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="5 12 12 19 19 12" /></svg>
      </div>

      <div className="arch-tier">
        <div className="arch-tier-label">Application · request processing</div>
        <div className="arch-row three">
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon auth">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <div className="arch-node-name">Clerk</div>
            </div>
            <div className="arch-node-meta">
              Authentication, MFA, SSO (Scale/Enterprise). Passwords never reach our infrastructure — hashed with Argon2 on Clerk's side. SOC 2 Type II.
            </div>
          </div>
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon app">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <div className="arch-node-name">Next.js · Vercel Functions</div>
            </div>
            <div className="arch-node-meta">
              Stateless Node.js + Fluid Compute. Every request enforces <code>workspace_id</code> scope. Environment isolation per deployment.
            </div>
          </div>
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon pay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
              </div>
              <div className="arch-node-name">Stripe</div>
            </div>
            <div className="arch-node-meta">
              All payments, cards, bank accounts. We get a <code>customer_id</code> and events back — never full numbers. PCI DSS Level 1.
            </div>
          </div>
        </div>
      </div>

      <div className="arch-connector">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="5 12 12 19 19 12" /></svg>
      </div>

      <div className="arch-tier">
        <div className="arch-tier-label">Storage · at rest</div>
        <div className="arch-row two">
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon db">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" /></svg>
              </div>
              <div className="arch-node-name">Supabase (Postgres)</div>
            </div>
            <div className="arch-node-meta">
              Row-level security enforces <code>workspace_id</code> at the database. AES-256 encryption at rest. Point-in-time recovery, 30-day backup retention. SOC 2 Type II.
            </div>
          </div>
          <div className="arch-node">
            <div className="arch-node-head">
              <div className="arch-node-icon file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              </div>
              <div className="arch-node-name">Supabase Storage / Vercel Blob</div>
            </div>
            <div className="arch-node-meta">
              Lease PDFs, tenant ID scans, maintenance photos. AES-256 at rest. Pre-signed URLs for access — expire in 60 min. No public buckets.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="principles">
    <div className="section-head">
      <div className="section-kicker">How we think about this</div>
      <h2>Four security principles, applied to every feature.</h2>
    </div>
    <div className="principle-grid">
      <div className="principle">
        <div className="principle-num">01</div>
        <h3>Least privilege by default.</h3>
        <p>A feature doesn't get database access unless it absolutely needs it. A user doesn't see another workspace's data — ever. <strong>Workspace isolation is enforced at the row level</strong>, not in application code, so a code bug can't leak data across tenants.</p>
      </div>
      <div className="principle">
        <div className="principle-num">02</div>
        <h3>We don't roll our own crypto.</h3>
        <p>We use TLS 1.3 (not a custom channel), AES-256 (not a homegrown cipher), Argon2 via Clerk (not MD5 with salt). <strong>Every cryptographic primitive is battle-tested and audited.</strong> Boring is safer than clever.</p>
      </div>
      <div className="principle">
        <div className="principle-num">03</div>
        <h3>Audit logs on every write.</h3>
        <p>Every create, update, and delete is logged with user, IP, timestamp, and payload diff. Logs are append-only and retained for 2 years. <strong>If something weird happens, we can reconstruct exactly what and when.</strong></p>
      </div>
      <div className="principle">
        <div className="principle-num">04</div>
        <h3>Your data is your data.</h3>
        <p>You can export every byte of your workspace to CSV or JSON in one click. Cancel anytime and we delete everything within 30 days (keeping only what regulations require, like transaction logs). <strong>We don't hold data hostage.</strong></p>
      </div>
    </div>
  </section>

  
  <section className="data-wrap">
    <div className="section-head">
      <div className="section-kicker">What we actually store</div>
      <h2>The receipts. Every field, every encryption state.</h2>
      <p>This is the inventory, not a marketing summary. If you need more detail, request our Data Processing Agreement.</p>
    </div>
    <div className="data-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>What it's used for</th>
            <th>At rest</th>
            <th>In transit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tenant name, email, phone</td>
            <td>Login, rent reminders, portal access, lease variables</td>
            <td><span className="data-pill enc">Encrypted</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Tenant DOB &amp; SSN last 4</td>
            <td>Credit check submission only — purged after 90 days</td>
            <td><span className="data-pill token">Tokenized</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Government ID scans</td>
            <td>Application verification · pre-signed URLs only</td>
            <td><span className="data-pill enc">Encrypted</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Bank account / card numbers</td>
            <td>Never touched — held entirely by Stripe</td>
            <td><span className="data-pill none">Not stored</span></td>
            <td><span className="data-pill none">Not stored</span></td>
          </tr>
          <tr>
            <td>Passwords</td>
            <td>Never touched — hashed by Clerk with Argon2</td>
            <td><span className="data-pill hash">Hashed</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Lease PDFs</td>
            <td>Signed lease storage, tenant download</td>
            <td><span className="data-pill enc">Encrypted</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Maintenance photos</td>
            <td>Ticket context, handyman reference</td>
            <td><span className="data-pill enc">Encrypted</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Audit logs</td>
            <td>Who did what, when, from where · 2-year retention</td>
            <td><span className="data-pill enc">Encrypted</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
          <tr>
            <td>Analytics / usage telemetry</td>
            <td>Workspace-aggregated counts only · no PII</td>
            <td><span className="data-pill none">No PII</span></td>
            <td><span className="data-pill enc">TLS 1.3</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  
  <section className="incident">
    <div className="incident-card featured">
      <div className="incident-label">If something goes wrong</div>
      <h3>Our incident playbook, plainly.</h3>
      <p>Every incident we've ever had (zero P0s to date, five P1s) has been disclosed to affected customers by email within 30 minutes of detection — not 72 hours, not "by EOD."</p>
      <ul className="incident-list">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Acknowledged publicly on <strong>status.rentblackbear.com</strong> within 15 min</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Affected customers emailed directly within 30 min</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Full root-cause postmortem published within 5 business days</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>If data was exposed, regulators + affected users notified per GDPR/CCPA timelines</li>
      </ul>
    </div>
    <div className="incident-card">
      <div className="incident-label">Tenant data specifics</div>
      <h3>Who can see what in your workspace.</h3>
      <p>Every row in the database is scoped to a <code>workspace_id</code>. Row-level security policies enforce this at Postgres — not just in application code.</p>
      <ul className="incident-list">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>You &amp; your team</strong>: full access to your workspace, scoped by role (Admin / Manager / Viewer)</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>Your tenants</strong>: only their own data — rent, lease, maintenance, documents</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>Vendors</strong>: only tickets you assign them, scoped by job</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><strong>Black Bear Rentals engineers</strong>: only via break-glass access, logged, and only with your approval</li>
      </ul>
    </div>
  </section>

  
  <section className="faq">
    <div className="section-head">
      <div className="section-kicker">Security FAQ</div>
      <h2>The questions people actually ask.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">Where is my data physically located? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Primary Postgres in AWS <code>us-east-1</code> (N. Virginia). Backups replicated to <code>us-west-2</code> (Oregon). Files in Supabase Storage / Vercel Blob in the same US regions. Enterprise customers can request EU residency (<code>eu-west-1</code>) — add-on.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can your engineers see my tenant data? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">No, not by default. Our engineers can see metadata and workspace-aggregated counts. To access raw tenant data (say, to debug an issue you reported), we require your written approval via the in-app "Grant support access" toggle. Every break-glass access is logged and you get an email after the fact. Approval auto-expires in 24 hours.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What happens when I cancel? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">You get 30 days to export everything (CSV + JSON). After 30 days, your workspace is deleted from active systems. Encrypted backups age out 90 days after deletion. Financial transaction records are retained per IRS / state requirements (typically 7 years) but anonymized.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Do you have SSO? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes, on Scale and Enterprise plans. Via Clerk we support Google Workspace, Microsoft Entra (Azure AD), Okta, and generic SAML/OIDC. Standard SCIM user provisioning on Enterprise.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What's your MFA story? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Every user can enable TOTP (Google Authenticator / Authy / 1Password) from Settings → Security. Admins can require MFA for all workspace members on Pro+ plans. SMS MFA is supported but discouraged — we prefer TOTP.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Are you HIPAA compliant? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">No. Black Bear Rentals is not designed for protected health information. Don't store PHI in tenant records, maintenance notes, or messages. If you need HIPAA coverage for assisted-living properties, talk to us — it's on the Enterprise roadmap but not available today.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I get a signed DPA? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes — email <code>security@rentblackbear.com</code>. Our standard DPA follows the EU SCCs (Module Two). Turnaround is 1–2 business days.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">How do you handle pen tests? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">We run an annual third-party penetration test (currently scheduled for August 2026 with Include Security). Redacted report available to Scale/Enterprise customers under NDA. Internal red-team exercises happen quarterly.</div>
      </div>
    </div>
  </section>

  
  <section className="bounty">
    <div className="bounty-card">
      <div>
        <div className="bounty-label">Responsible disclosure</div>
        <h3>Found a bug? We pay for it.</h3>
        <p>If you find a security issue, email <code>security@rentblackbear.com</code>. Don't post it on Twitter. We respond within 24 hours, fix within the severity SLA (critical: 24h / high: 72h / medium: 2 weeks), and pay bounties: <strong>$500–$5,000</strong> depending on impact. PGP key available at <code>rentblackbear.com/.well-known/security.txt</code>.</p>
      </div>
      <a className="btn btn-primary" href="mailto:security@rentblackbear.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
        Report a bug
      </a>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Need to give this to your compliance team?</h2>
      <p>Grab the full security one-pager (PDF), or book a 30-minute call with our security lead to walk through anything on this page in detail.</p>
      <div className="cta-actions">
        <a className="btn btn-pink btn-lg" href="#">
          Download security one-pager (PDF)
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="mailto:security@rentblackbear.com">
          Talk to security
        </a>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
      <a href="security.html">Security</a>
      <a href="mailto:security@rentblackbear.com">security@</a>
    </div>
  </footer>

  

    </>
  );
}
