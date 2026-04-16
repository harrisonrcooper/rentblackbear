"use client";

// Mock ported from ~/Desktop/blackbear/press.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 40px; text-align: center; max-width: 920px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(40px, 5.4vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.03;\n      max-width: 860px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 640px; margin: 0 auto 32px; line-height: 1.55;\n    }\n    .hero-actions { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }\n\n    /* ===== Shared section frame ===== */\n    .section { max-width: 1160px; margin: 0 auto; padding: 56px 32px; }\n    .sec-head { margin-bottom: 28px; }\n    .sec-eyebrow {\n      font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 8px;\n    }\n    .sec-title { font-size: clamp(26px, 3vw, 34px); font-weight: 800; letter-spacing: -0.025em; color: var(--text); }\n    .sec-sub { font-size: 15px; color: var(--text-muted); margin-top: 8px; max-width: 640px; }\n\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);\n    }\n\n    /* ===== Fast facts ===== */\n    .facts-card { padding: 8px; }\n    .facts-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n    }\n    .fact {\n      padding: 22px 20px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);\n    }\n    .fact:nth-child(4n) { border-right: none; }\n    .fact:nth-last-child(-n+4) { border-bottom: none; }\n    .fact-key {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px;\n    }\n    .fact-val { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.35; }\n    .fact-val span { color: var(--text-muted); font-weight: 500; }\n    .fact-val.num { font-variant-numeric: tabular-nums; }\n\n    /* ===== Boilerplate ===== */\n    .boiler-tabs { display: inline-flex; background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px; margin-bottom: 18px; }\n    .boiler-tab {\n      padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .boiler-tab.active { color: var(--text); background: var(--surface); box-shadow: var(--shadow-sm); }\n    .boiler-panel { display: none; }\n    .boiler-panel.active { display: block; }\n    .boiler-card {\n      padding: 28px 28px 20px; display: grid; grid-template-columns: 1fr auto; gap: 22px; align-items: flex-start;\n    }\n    .boiler-text {\n      font-family: 'Source Serif 4', Georgia, serif;\n      font-size: 17px; line-height: 1.65; color: var(--text);\n    }\n    .copy-btn {\n      display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;\n      border-radius: 100px; font-size: 12px; font-weight: 600;\n      background: var(--blue-pale); color: var(--blue); border: 1px solid rgba(18,81,173,0.16);\n      transition: all 0.15s ease;\n    }\n    .copy-btn:hover { background: var(--blue); color: #fff; }\n    .copy-btn.done { background: var(--green-bg); color: var(--green-dark); border-color: rgba(30,169,124,0.2); }\n    .copy-btn svg { width: 13px; height: 13px; }\n    .boiler-meta { margin-top: 14px; padding: 10px 28px 22px; font-size: 12px; color: var(--text-faint); letter-spacing: 0.04em; text-transform: uppercase; font-weight: 600; }\n    .boiler-meta strong { color: var(--text-muted); }\n\n    /* ===== Brand assets ===== */\n    .assets-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }\n    .asset {\n      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;\n      background: var(--surface); display: flex; flex-direction: column;\n      transition: all 0.15s ease;\n    }\n    .asset:hover { transform: translateY(-2px); box-shadow: var(--shadow); }\n    .asset-preview {\n      height: 160px; display: flex; align-items: center; justify-content: center;\n      border-bottom: 1px solid var(--border);\n    }\n    .asset-preview.bg-light { background: var(--surface-subtle); }\n    .asset-preview.bg-dark { background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker)); border-bottom-color: transparent; }\n    .asset-preview.bg-gradient { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); border-bottom-color: transparent; }\n    .asset-lockup { display: flex; align-items: center; gap: 10px; color: var(--text); font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }\n    .asset-lockup.light { color: #fff; }\n    .asset-mark {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .asset-mark.solid-white { background: #fff; color: var(--navy-dark); }\n    .asset-mark svg { width: 22px; height: 22px; }\n    .asset-mark.lg { width: 64px; height: 64px; border-radius: 16px; }\n    .asset-mark.lg svg { width: 36px; height: 36px; }\n    .asset-body { padding: 16px 18px; }\n    .asset-name { font-weight: 700; font-size: 14px; color: var(--text); }\n    .asset-meta { font-size: 12px; color: var(--text-faint); margin-top: 2px; }\n    .asset-actions { display: flex; gap: 6px; padding: 0 14px 14px; }\n    .asset-btn {\n      flex: 1; padding: 8px 10px; border-radius: 8px;\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      border: 1px solid var(--border); background: var(--surface);\n      transition: all 0.15s ease; text-align: center;\n    }\n    .asset-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }\n\n    /* ===== Palette ===== */\n    .palette {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;\n    }\n    .swatch {\n      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;\n      background: var(--surface);\n    }\n    .swatch-chip { height: 120px; display: flex; align-items: flex-end; padding: 14px; color: #fff; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }\n    .swatch-body { padding: 14px 16px 16px; }\n    .swatch-name { font-weight: 700; font-size: 14px; color: var(--text); }\n    .swatch-hex {\n      font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;\n      font-size: 13px; color: var(--text-muted); margin-top: 4px;\n      font-variant-numeric: tabular-nums;\n    }\n    .swatch-var { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* ===== Founder bio ===== */\n    .founder {\n      display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: flex-start;\n      padding: 32px;\n    }\n    .founder-photo {\n      width: 220px; height: 220px; border-radius: var(--radius-lg);\n      background:\n        radial-gradient(circle at 50% 38%, #d2dcf5 0 70px, transparent 71px),\n        radial-gradient(circle at 50% 110%, #aab8df 0 150px, transparent 151px),\n        linear-gradient(160deg, #eef3ff, #dbe4f8);\n      border: 1px solid var(--border);\n      position: relative; overflow: hidden;\n      display: flex; align-items: flex-end; justify-content: center;\n    }\n    .founder-photo-label {\n      position: absolute; bottom: 10px; left: 10px;\n      background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: 100px;\n      font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;\n    }\n    .founder-name { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }\n    .founder-role { font-size: 13px; color: var(--blue); font-weight: 600; margin-top: 2px; margin-bottom: 16px; letter-spacing: 0.02em; }\n    .founder-bio { font-size: 15px; color: var(--text); line-height: 1.7; }\n    .founder-socials { display: flex; gap: 10px; margin-top: 20px; }\n    .founder-social {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 8px 14px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .founder-social:hover { border-color: var(--blue); color: var(--blue); }\n    .founder-social svg { width: 14px; height: 14px; }\n\n    /* ===== Screenshots ===== */\n    .shots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }\n    .shot {\n      border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden;\n      background: var(--surface); box-shadow: var(--shadow-sm);\n      transition: all 0.2s ease;\n    }\n    .shot:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }\n    .shot-preview {\n      height: 220px; position: relative; overflow: hidden;\n      background: linear-gradient(160deg, var(--surface-subtle), var(--blue-softer));\n      border-bottom: 1px solid var(--border);\n    }\n    .shot-chrome {\n      position: absolute; top: 10px; left: 10px; display: flex; gap: 5px;\n    }\n    .shot-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,31,54,0.15); }\n    .shot-dot:nth-child(1) { background: #ff6b6b; }\n    .shot-dot:nth-child(2) { background: var(--gold); }\n    .shot-dot:nth-child(3) { background: var(--green); }\n    .shot-skeleton {\n      position: absolute; inset: 36px 16px 16px;\n      display: grid; gap: 8px; grid-template-rows: 22px repeat(4, 1fr);\n    }\n    .sk-bar { background: #fff; border: 1px solid var(--border); border-radius: 6px; }\n    .sk-row { display: grid; grid-template-columns: 0.9fr 1fr 1fr; gap: 8px; }\n    .sk-tile { background: #fff; border: 1px solid var(--border); border-radius: 8px; position: relative; overflow: hidden; }\n    .sk-tile::after {\n      content: \"\"; position: absolute; left: 10px; right: 10px; top: 10px; height: 6px; border-radius: 4px;\n      background: linear-gradient(90deg, var(--blue-bright), var(--pink));\n      opacity: 0.6;\n    }\n    .sk-tile.tall { grid-row: span 2; }\n    .shot-body { padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; }\n    .shot-name { font-weight: 700; color: var(--text); font-size: 14px; }\n    .shot-meta { font-size: 12px; color: var(--text-faint); }\n\n    /* ===== Featured in ===== */\n    .featured {\n      display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;\n      padding: 28px; background: var(--surface-subtle); border-radius: var(--radius-xl);\n      border: 1px solid var(--border);\n    }\n    .feat-cell {\n      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;\n      padding: 18px 10px; border-radius: var(--radius-lg);\n      background: var(--surface); border: 1px solid var(--border);\n      filter: grayscale(1); opacity: 0.72;\n      transition: all 0.2s ease; text-align: center;\n    }\n    .feat-cell:hover { filter: grayscale(0); opacity: 1; transform: translateY(-2px); }\n    .feat-name { font-weight: 800; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }\n    .feat-tag { font-size: 10px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }\n    .featured-note { margin-top: 10px; font-size: 12px; color: var(--text-faint); text-align: center; font-style: italic; }\n\n    /* ===== Mentions ===== */\n    .mentions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n    .mention {\n      padding: 22px; border: 1px solid var(--border); border-radius: var(--radius-xl);\n      background: var(--surface); display: flex; flex-direction: column; gap: 10px;\n      transition: all 0.15s ease;\n    }\n    .mention:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--border-strong); }\n    .mention-pub { font-size: 11px; color: var(--pink); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }\n    .mention-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.4; }\n    .mention-meta { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 10px; border-top: 1px dashed var(--border); font-size: 12px; color: var(--text-muted); font-variant-numeric: tabular-nums; }\n    .mention-pill {\n      padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 700;\n      background: var(--surface-alt); color: var(--text-faint); letter-spacing: 0.08em; text-transform: uppercase;\n    }\n\n    /* ===== Contact ===== */\n    .contact-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 40px;\n      display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 32px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .contact-card::after {\n      content: \"\"; position: absolute; top: -80px; right: -80px;\n      width: 320px; height: 320px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .contact-card > * { position: relative; z-index: 1; }\n    .contact-title { font-size: 26px; font-weight: 800; letter-spacing: -0.025em; }\n    .contact-sub { font-size: 14px; color: rgba(255,255,255,0.72); margin-top: 6px; max-width: 340px; }\n    .contact-field-label { font-size: 10px; font-weight: 700; color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }\n    .contact-field-val { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }\n    .contact-field-val a:hover { color: var(--pink); }\n    .contact-field-meta { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    /* ===== Toast ===== */\n    .toast {\n      position: fixed; left: 50%; bottom: 32px; transform: translate(-50%, 20px);\n      background: var(--text); color: #fff; padding: 11px 18px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; box-shadow: var(--shadow-lg);\n      opacity: 0; pointer-events: none; transition: all 0.25s ease;\n      display: inline-flex; align-items: center; gap: 8px;\n      z-index: 100;\n    }\n    .toast.show { opacity: 1; transform: translate(-50%, 0); }\n    .toast svg { width: 14px; height: 14px; color: var(--green); }\n\n    @media (max-width: 980px) {\n      .facts-grid { grid-template-columns: repeat(2, 1fr); }\n      .fact:nth-child(4n) { border-right: 1px solid var(--border); }\n      .fact:nth-child(2n) { border-right: none; }\n      .fact:nth-last-child(-n+4) { border-bottom: 1px solid var(--border); }\n      .fact:nth-last-child(-n+2) { border-bottom: none; }\n      .assets-grid { grid-template-columns: repeat(2, 1fr); }\n      .palette { grid-template-columns: repeat(2, 1fr); }\n      .founder { grid-template-columns: 1fr; }\n      .founder-photo { width: 100%; height: 240px; }\n      .shots { grid-template-columns: 1fr; }\n      .featured { grid-template-columns: repeat(2, 1fr); }\n      .mentions { grid-template-columns: 1fr; }\n      .contact-card { grid-template-columns: 1fr; padding: 28px; }\n    }\n    @media (max-width: 680px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .section { padding: 40px 16px; }\n      .boiler-card { grid-template-columns: 1fr; }\n    }\n  ";

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
      <a className="tb-nav-item" href="about.html">About</a>
      <a className="tb-nav-item active" href="press.html">Press</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="M4 9h16" /><path d="M9 4v16" /></svg>
      Press room
    </div>
    <h1>Press &amp; <em>media</em></h1>
    <p className="hero-sub">Welcome, journalists, podcasters, and partners. Everything you need to cover Black Bear Rentals is on this page, and the founder replies same-day on weekdays.</p>
    <div className="hero-actions">
      <a className="btn btn-primary btn-lg" href="mailto:press@rentblackbear.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
        Email press@rentblackbear.com
      </a>
      <button className="btn btn-pink btn-lg" data-toast="Media kit download starting…">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
        Download media kit (ZIP)
      </button>
      <a className="btn btn-ghost btn-lg" href="mailto:press@rentblackbear.com?subject=Founder call request">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
        Book a founder call
      </a>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Fast facts</div>
      <h2 className="sec-title">The short version</h2>
      <p className="sec-sub">Cleared for print. Ping press@rentblackbear.com if you need a number verified on deadline.</p>
    </div>
    <div className="card facts-card">
      <div className="facts-grid">
        <div className="fact">
          <div className="fact-key">Founded</div>
          <div className="fact-val">Feb 2026</div>
        </div>
        <div className="fact">
          <div className="fact-key">Founder</div>
          <div className="fact-val">Harrison Cooper</div>
        </div>
        <div className="fact">
          <div className="fact-key">HQ</div>
          <div className="fact-val">Huntsville, AL</div>
        </div>
        <div className="fact">
          <div className="fact-key">Funding</div>
          <div className="fact-val">Bootstrapped</div>
        </div>
        <div className="fact">
          <div className="fact-key">Customers</div>
          <div className="fact-val num">100+ <span>property managers</span></div>
        </div>
        <div className="fact">
          <div className="fact-key">Units managed</div>
          <div className="fact-val num">1,800+ <span>doors</span></div>
        </div>
        <div className="fact">
          <div className="fact-key">Category</div>
          <div className="fact-val">Property mgmt software</div>
        </div>
        <div className="fact">
          <div className="fact-key">Pricing</div>
          <div className="fact-val num">Starter $39 <span>/</span> Pro $99 <span>/</span> Scale $299</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Boilerplate</div>
      <h2 className="sec-title">Company description</h2>
      <p className="sec-sub">Three lengths, copy-paste ready. All current as of April 2026.</p>
    </div>
    <div className="boiler-tabs" role="tablist">
      <button className="boiler-tab active" data-panel="short">Short · 25 words</button>
      <button className="boiler-tab" data-panel="medium">Medium · 50 words</button>
      <button className="boiler-tab" data-panel="long">Long · 100 words</button>
    </div>

    <div className="card boiler-panel active" id="panel-short">
      <div className="boiler-card">
        <p className="boiler-text" id="text-short">Black Bear Rentals is the modern operating system for independent landlords and co-living operators. One app replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper.</p>
        <button className="copy-btn" data-copy="text-short">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          <span>Copy</span>
        </button>
      </div>
      <div className="boiler-meta"><strong>25 words</strong> &nbsp;·&nbsp; ideal for tickers, intros, and link previews</div>
    </div>

    <div className="card boiler-panel" id="panel-medium">
      <div className="boiler-card">
        <p className="boiler-text" id="text-medium">Black Bear Rentals is an all-in-one property management platform for independent landlords and co-living operators. It replaces AppFolio, QuickBooks, DocuSign, and bookkeeping services with a single app that handles listings, applications, leases, rent, maintenance, and move-outs. Founded in 2026 in Huntsville, Alabama, Black Bear Rentals is bootstrapped and operator-built.</p>
        <button className="copy-btn" data-copy="text-medium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          <span>Copy</span>
        </button>
      </div>
      <div className="boiler-meta"><strong>50 words</strong> &nbsp;·&nbsp; about-the-company blurbs, newsletter copy</div>
    </div>

    <div className="card boiler-panel" id="panel-long">
      <div className="boiler-card">
        <p className="boiler-text" id="text-long">Black Bear Rentals is the operating system for independent landlords and co-living operators. Founded in February 2026 in Huntsville, Alabama by operator Harrison Cooper, the bootstrapped software company replaces AppFolio, QuickBooks, DocuSign, and bookkeeping services with a single app purpose-built for small-to-mid portfolios. Black Bear Rentals covers listings, applications, screening, leases, rent collection, maintenance, bookkeeping, and move-outs, with tenant-facing tools that feel modern enough to recruit residents from Zillow. Plans start at $39/month for Starter, $99/month for Pro, and $299/month for Scale. Black Bear Rentals serves more than 100 property managers across the United States and is building in public toward a multi-tenant SaaS platform.</p>
        <button className="copy-btn" data-copy="text-long">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          <span>Copy</span>
        </button>
      </div>
      <div className="boiler-meta"><strong>100 words</strong> &nbsp;·&nbsp; press releases, longer editorial</div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Brand assets</div>
      <h2 className="sec-title">Logo &amp; lockups</h2>
      <p className="sec-sub">Use the wordmark on white, the reversed lockup on dark, and the mark on its own only when space is tight. Please don't recolor.</p>
    </div>

    <div className="assets-grid">
      <div className="asset">
        <div className="asset-preview bg-light">
          <div className="asset-lockup">
            <div className="asset-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
            </div>
            Black Bear Rentals
          </div>
        </div>
        <div className="asset-body">
          <div className="asset-name">Wordmark · light</div>
          <div className="asset-meta">Primary lockup, horizontal</div>
        </div>
        <div className="asset-actions">
          <button className="asset-btn" data-toast="Wordmark PNG queued">Download PNG</button>
          <button className="asset-btn" data-toast="Wordmark SVG queued">Download SVG</button>
        </div>
      </div>

      <div className="asset">
        <div className="asset-preview bg-dark">
          <div className="asset-lockup light">
            <div className="asset-mark solid-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
            </div>
            Black Bear Rentals
          </div>
        </div>
        <div className="asset-body">
          <div className="asset-name">Wordmark · dark</div>
          <div className="asset-meta">Reversed for navy backgrounds</div>
        </div>
        <div className="asset-actions">
          <button className="asset-btn" data-toast="Reversed PNG queued">Download PNG</button>
          <button className="asset-btn" data-toast="Reversed SVG queued">Download SVG</button>
        </div>
      </div>

      <div className="asset">
        <div className="asset-preview bg-gradient">
          <div className="asset-mark lg solid-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
          </div>
        </div>
        <div className="asset-body">
          <div className="asset-name">Icon · on brand</div>
          <div className="asset-meta">App icon, avatars, favicons</div>
        </div>
        <div className="asset-actions">
          <button className="asset-btn" data-toast="Icon PNG queued">Download PNG</button>
          <button className="asset-btn" data-toast="Icon SVG queued">Download SVG</button>
        </div>
      </div>

      <div className="asset">
        <div className="asset-preview bg-light">
          <div className="asset-mark lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
          </div>
        </div>
        <div className="asset-body">
          <div className="asset-name">Icon · light</div>
          <div className="asset-meta">Use on white or cream backgrounds</div>
        </div>
        <div className="asset-actions">
          <button className="asset-btn" data-toast="Icon PNG queued">Download PNG</button>
          <button className="asset-btn" data-toast="Icon SVG queued">Download SVG</button>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Color palette</div>
      <h2 className="sec-title">Brand colors</h2>
      <p className="sec-sub">Navy for depth, blue for action, pink for moments that matter, gold for the small stuff.</p>
    </div>
    <div className="palette">
      <div className="swatch">
        <div className="swatch-chip" style={{background: "#2F3E83"}}>Navy</div>
        <div className="swatch-body">
          <div className="swatch-name">Flagship Navy</div>
          <div className="swatch-hex">#2F3E83</div>
          <div className="swatch-var">--navy</div>
        </div>
      </div>
      <div className="swatch">
        <div className="swatch-chip" style={{background: "#1251AD"}}>Blue</div>
        <div className="swatch-body">
          <div className="swatch-name">Action Blue</div>
          <div className="swatch-hex">#1251AD</div>
          <div className="swatch-var">--blue</div>
        </div>
      </div>
      <div className="swatch">
        <div className="swatch-chip" style={{background: "#FF4998"}}>Pink</div>
        <div className="swatch-body">
          <div className="swatch-name">Moment Pink</div>
          <div className="swatch-hex">#FF4998</div>
          <div className="swatch-var">--pink</div>
        </div>
      </div>
      <div className="swatch">
        <div className="swatch-chip" style={{background: "#F5A623", color: "#3a2a06"}}>Gold</div>
        <div className="swatch-body">
          <div className="swatch-name">Signal Gold</div>
          <div className="swatch-hex">#F5A623</div>
          <div className="swatch-var">--gold</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Founder</div>
      <h2 className="sec-title">Meet Harrison Cooper</h2>
      <p className="sec-sub">Available for interviews, podcast appearances, and guest essays on bootstrapped SaaS and operator-built software.</p>
    </div>
    <div className="card founder">
      <div className="founder-photo">
        <div className="founder-photo-label">Headshot · high-res in kit</div>
      </div>
      <div>
        <div className="founder-name">Harrison Cooper</div>
        <div className="founder-role">Founder &amp; CEO, Black Bear Rentals</div>
        <p className="founder-bio">Harrison Cooper is a Huntsville, Alabama operator who runs 15+ co-living rooms under Black Bear Rentals and builds software for the landlords he drinks coffee with. After a decade of spreadsheets, duct-taped integrations, and AppFolio invoices, he started Black Bear Rentals in early 2026 to give small-to-mid portfolios the same operating tools the giants have. He writes openly about revenue, churn, and lessons learned as the company grows.</p>
        <div className="founder-socials">
          <a className="founder-social" href="https://x.com/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            @harrisoncooper
          </a>
          <a className="founder-social" href="https://linkedin.com/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.06c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.63 4.74 6.06V21h-4v-5.55c0-1.32-.02-3.02-1.84-3.02-1.85 0-2.13 1.44-2.13 2.92V21h-4V9z" /></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Product shots</div>
      <h2 className="sec-title">Screenshots</h2>
      <p className="sec-sub">Quick previews below. Full-resolution PNGs (3×, up to 2560px) ship inside the media kit ZIP.</p>
    </div>
    <div className="shots">
      <div className="shot">
        <div className="shot-preview">
          <div className="shot-chrome"><span className="shot-dot" /><span className="shot-dot" /><span className="shot-dot" /></div>
          <div className="shot-skeleton">
            <div className="sk-bar" />
            <div className="sk-row"><div className="sk-tile tall" /><div className="sk-tile" /><div className="sk-tile" /></div>
            <div className="sk-row" style={{gridTemplateColumns: "1fr 1fr 1fr 1fr"}}><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
            <div className="sk-row"><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
          </div>
        </div>
        <div className="shot-body">
          <div className="shot-name">Admin dashboard</div>
          <div className="shot-meta">2560 × 1440</div>
        </div>
      </div>

      <div className="shot">
        <div className="shot-preview" style={{background: "linear-gradient(160deg, #fff, var(--blue-pale))"}}>
          <div className="shot-chrome"><span className="shot-dot" /><span className="shot-dot" /><span className="shot-dot" /></div>
          <div className="shot-skeleton">
            <div className="sk-bar" />
            <div className="sk-row" style={{gridTemplateColumns: "1fr"}}><div className="sk-tile" /></div>
            <div className="sk-row"><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
            <div className="sk-row" style={{gridTemplateColumns: "1fr 1fr"}}><div className="sk-tile" /><div className="sk-tile" /></div>
          </div>
        </div>
        <div className="shot-body">
          <div className="shot-name">Tenant portal</div>
          <div className="shot-meta">2560 × 1440</div>
        </div>
      </div>

      <div className="shot">
        <div className="shot-preview" style={{background: "linear-gradient(160deg, #fff, rgba(255,73,152,0.08))"}}>
          <div className="shot-chrome"><span className="shot-dot" /><span className="shot-dot" /><span className="shot-dot" /></div>
          <div className="shot-skeleton">
            <div className="sk-bar" />
            <div className="sk-row"><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
            <div className="sk-row"><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
            <div className="sk-row"><div className="sk-tile" /><div className="sk-tile" /><div className="sk-tile" /></div>
          </div>
        </div>
        <div className="shot-body">
          <div className="shot-name">Vacancy listings</div>
          <div className="shot-meta">2560 × 1440</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">As featured in</div>
      <h2 className="sec-title">Where operators hear about us</h2>
      <p className="sec-sub">Publications and communities where Black Bear Rentals shows up most. Drop us a note if we should be on your list.</p>
    </div>
    <div className="featured">
      <div className="feat-cell">
        <div className="feat-name">Indie Hackers</div>
        <div className="feat-tag">Community</div>
      </div>
      <div className="feat-cell">
        <div className="feat-name">Product Hunt</div>
        <div className="feat-tag">Launch</div>
      </div>
      <div className="feat-cell">
        <div className="feat-name">BiggerPockets</div>
        <div className="feat-tag">Investing</div>
      </div>
      <div className="feat-cell">
        <div className="feat-name">PropertyCast</div>
        <div className="feat-tag">Podcast</div>
      </div>
      <div className="feat-cell">
        <div className="feat-name">The Residential</div>
        <div className="feat-tag">Newsletter</div>
      </div>
      <div className="feat-cell">
        <div className="feat-name">Landlord Daily</div>
        <div className="feat-tag">Trade</div>
      </div>
    </div>
    <p className="featured-note">Hover to restore color. Logos shown with permission or pending.</p>
  </section>

  
  <section className="section">
    <div className="sec-head">
      <div className="sec-eyebrow">Recent mentions</div>
      <h2 className="sec-title">Press &amp; podcasts</h2>
      <p className="sec-sub">We're a young company; the archive is short on purpose. Want to be the first write-up? We'd love that.</p>
    </div>
    <div className="mentions">
      <div className="mention">
        <div className="mention-pub">Indie Hackers</div>
        <div className="mention-title">How an Alabama operator is rebuilding property management from the roof down</div>
        <div className="mention-meta">
          <span>Coming soon</span>
          <span className="mention-pill">Interview</span>
        </div>
      </div>
      <div className="mention">
        <div className="mention-pub">PropertyCast podcast</div>
        <div className="mention-title">Episode #312 &mdash; The operator-built software wave (with Harrison Cooper)</div>
        <div className="mention-meta">
          <span>Coming soon</span>
          <span className="mention-pill">Podcast</span>
        </div>
      </div>
      <div className="mention">
        <div className="mention-pub">BiggerPockets</div>
        <div className="mention-title">Tooling up: the new stack replacing AppFolio for portfolios under 500 doors</div>
        <div className="mention-meta">
          <span>Coming soon</span>
          <span className="mention-pill">Feature</span>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="contact-card">
      <div>
        <div className="contact-title">Talk to a human</div>
        <p className="contact-sub">Harrison answers the press inbox personally. Urgent requests ring through to his cell.</p>
      </div>
      <div>
        <div className="contact-field-label">Email</div>
        <div className="contact-field-val"><a href="mailto:press@rentblackbear.com">press@rentblackbear.com</a></div>
        <div className="contact-field-meta">Same-day reply, Mon–Fri</div>
      </div>
      <div>
        <div className="contact-field-label">Urgent &amp; on deadline</div>
        <div className="contact-field-val"><a href="tel:+12569995500">+1 (256) 999-5500</a></div>
        <div className="contact-field-meta">Text preferred after 6pm CT</div>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="about.html">About</a>
      <a href="press.html">Press</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  
  <div className="toast" id="toast" role="status" aria-live="polite">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    <span id="toast-msg">Done</span>
  </div>

  

    </>
  );
}
