"use client";

// Mock ported from ~/Desktop/blackbear/api-docs.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.55; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    code, pre, .mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n\n      /* Code colors */\n      --code-bg: #0f172a;\n      --code-bg-soft: #111a2e;\n      --code-border: #1f2a44;\n      --code-text: #e6edf7;\n      --code-muted: #8aa0c2;\n      --code-keyword: #ff7bb4;\n      --code-string: #79e0c2;\n      --code-number: #f5a623;\n      --code-prop: #8ab4ff;\n      --code-comment: #6b7a99;\n      --code-func: #c7a8ff;\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 64px 32px 28px;\n      text-align: center;\n      background:\n        radial-gradient(1000px 400px at 50% -100px, rgba(22,101,216,0.10), transparent 60%),\n        linear-gradient(180deg, var(--surface) 0%, var(--surface-subtle) 100%);\n      border-bottom: 1px solid var(--border);\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 8px;\n      margin-bottom: 18px;\n    }\n    .version-pill {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border-strong);\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 12px; font-weight: 600; color: var(--text);\n    }\n    .version-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-bg); }\n    .tier-badge {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n    }\n    .tier-badge svg { width: 11px; height: 11px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 56px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 860px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 680px; margin: 0 auto 28px; line-height: 1.55; }\n    .hero-actions { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }\n\n    /* ===== Quickstart ===== */\n    .quickstart { max-width: 1200px; margin: -40px auto 0; padding: 0 32px 32px; position: relative; z-index: 2; }\n    .qs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n    .qs-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      box-shadow: var(--shadow);\n    }\n    .qs-icon {\n      width: 34px; height: 34px; border-radius: 8px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 14px;\n    }\n    .qs-icon svg { width: 18px; height: 18px; }\n    .qs-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 6px; }\n    .qs-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }\n    .qs-body { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; }\n    .qs-body code {\n      display: inline-block; background: var(--surface-alt); border: 1px solid var(--border);\n      padding: 2px 7px; border-radius: 6px; font-size: 12.5px; color: var(--navy-darker);\n    }\n\n    /* ===== Layout: sidebar + main ===== */\n    .docs {\n      max-width: 1280px; margin: 40px auto 0; padding: 0 32px;\n      display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 48px;\n      align-items: start;\n    }\n    .sidebar {\n      position: sticky; top: 88px;\n      padding-bottom: 40px;\n      max-height: calc(100vh - 104px);\n      overflow-y: auto;\n    }\n    .side-group { margin-bottom: 22px; }\n    .side-title {\n      font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;\n      color: var(--text-faint); margin-bottom: 8px; padding: 0 10px;\n    }\n    .side-link {\n      display: block; padding: 7px 10px; border-radius: 8px;\n      font-size: 13.5px; font-weight: 500; color: var(--text-muted);\n      transition: all 0.12s ease; line-height: 1.3;\n    }\n    .side-link:hover { color: var(--text); background: var(--surface-alt); }\n    .side-link.active { color: var(--blue); background: var(--blue-pale); font-weight: 600; }\n    .side-link .method {\n      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;\n      padding: 1px 5px; border-radius: 4px; margin-right: 6px;\n      background: var(--surface-alt); color: var(--text-muted);\n    }\n\n    /* ===== Main content ===== */\n    .main { min-width: 0; padding-bottom: 80px; }\n    .section { padding-top: 32px; scroll-margin-top: 88px; }\n    .section:first-child { padding-top: 0; }\n    .section h2 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 8px; line-height: 1.15;\n    }\n    .section h3 {\n      font-size: 19px; font-weight: 700; letter-spacing: -0.01em;\n      color: var(--text); margin: 28px 0 10px; line-height: 1.25;\n    }\n    .section p { font-size: 14.5px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.65; }\n    .section p strong { color: var(--text); font-weight: 600; }\n    .section ul { margin: 8px 0 16px 0; padding-left: 20px; color: var(--text-muted); font-size: 14.5px; line-height: 1.7; }\n    .section li { margin-bottom: 4px; }\n    .section code.inline {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      padding: 1.5px 6px; border-radius: 5px; font-size: 12.5px; color: var(--navy-darker);\n    }\n\n    .kicker {\n      font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;\n      color: var(--blue); margin-bottom: 6px;\n    }\n\n    /* Tables */\n    .params {\n      width: 100%; border-collapse: collapse; margin: 12px 0 16px;\n      border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;\n      font-size: 13.5px;\n    }\n    .params th {\n      background: var(--surface-alt); color: var(--text);\n      font-weight: 700; font-size: 12px; letter-spacing: 0.04em;\n      padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border);\n    }\n    .params td {\n      padding: 12px 14px; border-bottom: 1px solid var(--border);\n      vertical-align: top; color: var(--text-muted);\n    }\n    .params tr:last-child td { border-bottom: none; }\n    .params td:first-child { color: var(--text); font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 13px; }\n    .params td:nth-child(2) { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--navy); }\n    .pill {\n      display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.04em;\n      padding: 2px 7px; border-radius: 100px; margin-left: 6px;\n      background: var(--surface-alt); color: var(--text-muted);\n    }\n    .pill.req { background: var(--pink-bg); color: #c21a6a; }\n    .pill.opt { background: var(--surface-alt); color: var(--text-muted); }\n\n    /* Endpoint header */\n    .endpoint {\n      margin: 24px 0 18px; padding: 14px 16px;\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: var(--radius);\n      display: flex; align-items: center; gap: 12px; flex-wrap: wrap;\n    }\n    .method-badge {\n      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800;\n      padding: 4px 9px; border-radius: 6px; letter-spacing: 0.04em;\n    }\n    .m-get { background: rgba(22,101,216,0.12); color: #0d4a9e; }\n    .m-post { background: var(--green-bg); color: var(--green-dark); }\n    .m-patch { background: rgba(245,166,35,0.16); color: #a7670a; }\n    .m-delete { background: rgba(214,69,69,0.14); color: #a03434; }\n    .endpoint-path {\n      font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600;\n      color: var(--text);\n    }\n    .endpoint-desc { color: var(--text-muted); font-size: 13.5px; margin-left: auto; }\n\n    /* Code block */\n    .codeblock {\n      position: relative;\n      background: var(--code-bg);\n      border: 1px solid var(--code-border);\n      border-radius: var(--radius);\n      overflow: hidden;\n      margin: 10px 0 18px;\n    }\n    .code-head {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 8px 12px; background: var(--code-bg-soft);\n      border-bottom: 1px solid var(--code-border);\n    }\n    .code-tabs { display: flex; gap: 2px; }\n    .code-tab {\n      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600;\n      color: var(--code-muted); padding: 5px 11px; border-radius: 6px;\n      transition: all 0.12s ease;\n    }\n    .code-tab:hover { color: var(--code-text); }\n    .code-tab.active { background: rgba(255,255,255,0.08); color: var(--code-text); }\n    .code-copy {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11.5px; font-weight: 600; color: var(--code-muted);\n      padding: 5px 10px; border-radius: 6px; transition: all 0.12s ease;\n    }\n    .code-copy:hover { color: var(--code-text); background: rgba(255,255,255,0.06); }\n    .code-copy svg { width: 12px; height: 12px; }\n    .code-body { padding: 14px 16px; overflow-x: auto; }\n    .code-body pre { margin: 0; }\n    .code-body code {\n      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65;\n      color: var(--code-text); white-space: pre;\n    }\n    .code-body .lang-pane { display: none; }\n    .code-body .lang-pane.active { display: block; }\n\n    .tok-k { color: var(--code-keyword); }\n    .tok-s { color: var(--code-string); }\n    .tok-n { color: var(--code-number); }\n    .tok-p { color: var(--code-prop); }\n    .tok-c { color: var(--code-comment); font-style: italic; }\n    .tok-f { color: var(--code-func); }\n    .tok-m { color: var(--code-muted); }\n\n    /* Callout */\n    .callout {\n      background: var(--blue-softer); border: 1px solid rgba(22,101,216,0.2);\n      border-left: 3px solid var(--blue-bright);\n      padding: 12px 14px 12px 14px; border-radius: var(--radius);\n      color: var(--text); font-size: 13.5px; line-height: 1.6;\n      margin: 12px 0 18px;\n    }\n    .callout strong { font-weight: 700; }\n\n    /* Status codes */\n    .status-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0 20px;\n    }\n    .status-card {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      padding: 12px 14px; background: var(--surface);\n    }\n    .status-code {\n      font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px;\n      color: var(--text); margin-bottom: 2px;\n    }\n    .status-code.ok { color: var(--green-dark); }\n    .status-code.warn { color: #a7670a; }\n    .status-code.err { color: var(--red); }\n    .status-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n\n    /* Webhook catalog */\n    .webhooks-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0 20px;\n    }\n    .webhook-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n    }\n    .webhook-event {\n      font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px;\n      color: var(--navy-darker); margin-bottom: 4px;\n    }\n    .webhook-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n\n    /* Ready-to-build callout */\n    .ready {\n      max-width: 1200px; margin: 40px auto 0; padding: 0 32px;\n    }\n    .ready-card {\n      position: relative;\n      border-radius: var(--radius-xl);\n      background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 55%, var(--blue-bright) 100%);\n      color: #fff;\n      padding: 48px 44px;\n      display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap;\n      overflow: hidden;\n    }\n    .ready-card::before {\n      content: \"\"; position: absolute; inset: 0;\n      background:\n        radial-gradient(500px 200px at 10% 20%, rgba(255,73,152,0.35), transparent 60%),\n        radial-gradient(500px 200px at 90% 90%, rgba(22,101,216,0.4), transparent 60%);\n      pointer-events: none;\n    }\n    .ready-text { position: relative; z-index: 1; max-width: 620px; }\n    .ready-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 10px; }\n    .ready-card h3 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }\n    .ready-card p { color: rgba(255,255,255,0.82); font-size: 15px; line-height: 1.6; }\n    .ready-actions { position: relative; z-index: 1; display: flex; gap: 10px; flex-wrap: wrap; }\n    .ready-actions .btn-primary { background: #fff; color: var(--navy-darker); }\n    .ready-actions .btn-primary:hover { background: #f2f4f8; color: var(--navy-darker); }\n    .ready-actions .btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.3); }\n    .ready-actions .btn-ghost:hover { border-color: #fff; color: #fff; }\n\n    /* Toast */\n    .toast {\n      position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%) translateY(20px);\n      background: var(--navy-darker); color: #fff;\n      padding: 10px 18px; border-radius: 100px;\n      font-size: 13px; font-weight: 600;\n      display: flex; align-items: center; gap: 8px;\n      box-shadow: var(--shadow-lg);\n      opacity: 0; pointer-events: none;\n      transition: all 0.22s ease;\n      z-index: 100;\n    }\n    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }\n    .toast svg { width: 14px; height: 14px; color: var(--green); }\n\n    /* Footer */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .docs { grid-template-columns: 1fr; gap: 24px; }\n      .sidebar { position: static; max-height: none; overflow: visible; display: none; }\n      .qs-grid { grid-template-columns: 1fr; }\n      .status-grid, .webhooks-grid { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 28px; }\n      .quickstart, .docs, .ready { padding-left: 16px; padding-right: 16px; }\n      .ready-card { padding: 32px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item" href="integrations.html">Integrations</a>
      <a className="tb-nav-item active" href="api-docs.html">API</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <span className="version-pill"><span className="dot" />v1 · stable</span>
      <span className="tier-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>
        Scale &amp; Enterprise
      </span>
    </div>
    <h1>Black Bear Rentals <em>API v1</em></h1>
    <p className="hero-sub">REST endpoints, signed webhooks, workspace-scoped bearer tokens. OpenAPI 3.1 spec available.</p>
    <div className="hero-actions">
      <a className="btn btn-primary" href="#authentication">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        Get started
      </a>
      <a className="btn btn-ghost" href="#openapi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        Download OpenAPI 3.1
      </a>
    </div>
  </section>

  
  <section className="quickstart">
    <div className="qs-grid">
      <div className="qs-card">
        <div className="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </div>
        <div className="qs-label">Auth</div>
        <div className="qs-title">Bearer tokens</div>
        <div className="qs-body">Generate an API key in <strong>Settings &rarr; API</strong>. Scoped to a single workspace; prefix <code>tnt_live_</code> for production, <code>tnt_test_</code> for sandbox.</div>
      </div>
      <div className="qs-card">
        <div className="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </div>
        <div className="qs-label">Base URL</div>
        <div className="qs-title">Single endpoint</div>
        <div className="qs-body"><code>https://api.rentblackbear.com/v1</code><br />All requests must be HTTPS. Sandbox mirror at <code>sandbox.rentblackbear.com/v1</code>.</div>
      </div>
      <div className="qs-card">
        <div className="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div className="qs-label">Rate limits</div>
        <div className="qs-title">100 req/s</div>
        <div className="qs-body">Per workspace. Burst to 200 for 10s. Headers: <code>x-ratelimit-remaining</code>, <code>x-ratelimit-reset</code>. 429s include <code>retry-after</code>.</div>
      </div>
    </div>
  </section>

  
  <section className="docs">
    
    <aside className="sidebar">
      <div className="side-group">
        <div className="side-title">Overview</div>
        <a className="side-link" href="#authentication">Authentication</a>
        <a className="side-link" href="#errors">Errors</a>
        <a className="side-link" href="#pagination">Pagination</a>
        <a className="side-link" href="#rate-limits">Rate limiting</a>
      </div>
      <div className="side-group">
        <div className="side-title">Resources</div>
        <a className="side-link" href="#tenants">Tenants</a>
        <a className="side-link" href="#properties">Properties</a>
        <a className="side-link" href="#units">Units</a>
        <a className="side-link" href="#leases">Leases</a>
        <a className="side-link" href="#applications">Applications</a>
        <a className="side-link" href="#payments">Payments</a>
        <a className="side-link" href="#maintenance">Maintenance</a>
        <a className="side-link" href="#vendors">Vendors</a>
        <a className="side-link" href="#documents">Documents</a>
      </div>
      <div className="side-group">
        <div className="side-title">Events</div>
        <a className="side-link" href="#webhooks">Webhooks catalog</a>
        <a className="side-link" href="#webhook-verify">Verifying signatures</a>
      </div>
      <div className="side-group">
        <div className="side-title">Tools</div>
        <a className="side-link" href="#openapi">OpenAPI 3.1 &amp; SDKs</a>
      </div>
    </aside>

    
    <div className="main">

      
      <section className="section" id="authentication">
        <div className="kicker">Overview</div>
        <h2>Authentication</h2>
        <p>The Black Bear Rentals API uses <strong>workspace-scoped bearer tokens</strong>. Every request must include an <code className="inline">Authorization</code> header and a <code className="inline">x-workspace-id</code> header. Keys are prefixed <code className="inline">tnt_live_</code> or <code className="inline">tnt_test_</code>; the prefix determines which environment the key operates against. Keys are not transferable across workspaces.</p>

        <h3>Request headers</h3>
        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Header</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Authorization <span className="pill req">required</span></td><td>string</td><td>Bearer token, e.g. <code className="inline">Bearer tnt_live_sk_9fHd2...</code></td></tr>
            <tr><td>x-workspace-id <span className="pill req">required</span></td><td>string</td><td>Workspace this request runs against. Format: <code className="inline">wks_</code> + 14 chars.</td></tr>
            <tr><td>x-idempotency-key <span className="pill opt">optional</span></td><td>string</td><td>Provide a unique key on POST requests to make them safely retriable.</td></tr>
            <tr><td>BlackBear-Version <span className="pill opt">optional</span></td><td>string</td><td>Pin to a date, e.g. <code className="inline">2026-04-01</code>. Defaults to the key's pinned version.</td></tr>
          </tbody>
        </table>

        <h3>Example: authenticated request</h3>
        <div className="codeblock" data-copy="curl https://api.rentblackbear.com/v1/tenants -H 'Authorization: Bearer tnt_live_sk_9fHd2...' -H 'x-workspace-id: wks_9aB2xQ7r1LmZc4'">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">shell</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code><span className="tok-c"># Fetch the first page of tenants in a workspace</span>
<span className="tok-f">curl</span> https://api.rentblackbear.com/v1/tenants \
  -H <span className="tok-s">"Authorization: Bearer tnt_live_sk_9fHd2..."</span> \
  -H <span className="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span> \
  -H <span className="tok-s">"BlackBear-Version: 2026-04-01"</span></code></pre>
          </div>
        </div>

        <div className="callout"><strong>Key hygiene.</strong> Keys are shown once at creation. Rotate quarterly. Revoke immediately if exposed. Workspace admins can view last-used timestamps in Settings &rarr; API.</div>
      </section>

      
      <section className="section" id="errors">
        <h2>Errors</h2>
        <p>Errors return a consistent JSON envelope. The <code className="inline">code</code> field is machine-stable; the <code className="inline">message</code> is human-readable and may change. <code className="inline">request_id</code> is always returned and should be logged — it's the fastest way for support to trace an issue.</p>

        <div className="codeblock" data-copy={"{\"error\":{\"code\":\"tenant.not_found\",\"message\":\"No tenant matches tnt_missing.\",\"request_id\":\"req_01HW3X...\",\"param\":\"id\"}}"}>
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"error"</span>: &#123;
    <span className="tok-p">"code"</span>: <span className="tok-s">"tenant.not_found"</span>,
    <span className="tok-p">"message"</span>: <span className="tok-s">"No tenant matches tnt_missing."</span>,
    <span className="tok-p">"request_id"</span>: <span className="tok-s">"req_01HW3XQZ8V7A2K1S9ZDYR0B3MN"</span>,
    <span className="tok-p">"param"</span>: <span className="tok-s">"id"</span>,
    <span className="tok-p">"doc_url"</span>: <span className="tok-s">"https://rentblackbear.com/api-docs#tenants"</span>
  &#125;
&#125;</code></pre>
          </div>
        </div>

        <h3>Status code reference</h3>
        <div className="status-grid">
          <div className="status-card"><div className="status-code ok">200 OK</div><div className="status-desc">Successful GET, PATCH, or DELETE (with body).</div></div>
          <div className="status-card"><div className="status-code ok">201 Created</div><div className="status-desc">Successful POST. Response body contains the new resource.</div></div>
          <div className="status-card"><div className="status-code ok">204 No Content</div><div className="status-desc">Successful DELETE with no response body.</div></div>
          <div className="status-card"><div className="status-code warn">400 Bad Request</div><div className="status-desc">Malformed JSON or invalid parameter. See <code className="inline">param</code>.</div></div>
          <div className="status-card"><div className="status-code warn">401 Unauthorized</div><div className="status-desc">Missing, invalid, or revoked API key.</div></div>
          <div className="status-card"><div className="status-code warn">403 Forbidden</div><div className="status-desc">Key lacks scope, or resource lives in another workspace.</div></div>
          <div className="status-card"><div className="status-code warn">404 Not Found</div><div className="status-desc">Resource id does not exist in this workspace.</div></div>
          <div className="status-card"><div className="status-code warn">409 Conflict</div><div className="status-desc">Idempotency key reused with different body, or unique constraint violated.</div></div>
          <div className="status-card"><div className="status-code warn">422 Unprocessable</div><div className="status-desc">Validation failed. <code className="inline">errors[]</code> lists per-field issues.</div></div>
          <div className="status-card"><div className="status-code warn">429 Too Many Requests</div><div className="status-desc">Rate limit exceeded. Honor <code className="inline">retry-after</code>.</div></div>
          <div className="status-card"><div className="status-code err">500 Server Error</div><div className="status-desc">Unexpected. Retry with backoff; log <code className="inline">request_id</code>.</div></div>
          <div className="status-card"><div className="status-code err">503 Unavailable</div><div className="status-desc">Maintenance or degraded upstream. Retry with backoff.</div></div>
        </div>
      </section>

      
      <section className="section" id="pagination">
        <h2>Pagination</h2>
        <p>List endpoints are <strong>cursor-paginated</strong>. Pass <code className="inline">limit</code> (1–100, default 25) and <code className="inline">cursor</code>. The response includes <code className="inline">next_cursor</code> (null when the page is the last) and <code className="inline">has_more</code>. Cursors are opaque — don't parse them.</p>

        <div className="codeblock" data-copy={"GET /v1/tenants?limit=25&cursor=eyJpZCI6InRudF8...\""}>
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"object"</span>: <span className="tok-s">"list"</span>,
  <span className="tok-p">"data"</span>: [ <span className="tok-c">/* ...25 resources... */</span> ],
  <span className="tok-p">"has_more"</span>: <span className="tok-k">true</span>,
  <span className="tok-p">"next_cursor"</span>: <span className="tok-s">"eyJpZCI6InRudF8wMUhXMlBRIn0"</span>,
  <span className="tok-p">"total_estimate"</span>: <span className="tok-n">412</span>
&#125;</code></pre>
          </div>
        </div>
      </section>

      
      <section className="section" id="rate-limits">
        <h2>Rate limiting</h2>
        <p>Each workspace gets <strong>100 requests/second sustained</strong> with a 200 req burst bucket refilled at 10/s. Per-IP limits also apply for unauthenticated routes. All responses include:</p>
        <ul>
          <li><code className="inline">x-ratelimit-limit</code> — current ceiling (integer, per second)</li>
          <li><code className="inline">x-ratelimit-remaining</code> — requests left in the current window</li>
          <li><code className="inline">x-ratelimit-reset</code> — unix timestamp when the bucket refills</li>
        </ul>
        <p>On 429, honor the <code className="inline">retry-after</code> header (in seconds). Recommended client strategy: exponential backoff with full jitter, base 200ms, cap 8s, max 5 retries. Idempotent operations (GET, PATCH with <code className="inline">x-idempotency-key</code>, DELETE) are safe to retry.</p>

        <div className="codeblock" data-copy="exponential backoff with jitter">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">js</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code><span className="tok-k">async function</span> <span className="tok-f">withBackoff</span>(fn, tries = <span className="tok-n">5</span>) &#123;
  <span className="tok-k">for</span> (<span className="tok-k">let</span> i = <span className="tok-n">0</span>; i &lt; tries; i++) &#123;
    <span className="tok-k">const</span> res = <span className="tok-k">await</span> <span className="tok-f">fn</span>();
    <span className="tok-k">if</span> (res.status !== <span className="tok-n">429</span> &amp;&amp; res.status &lt; <span className="tok-n">500</span>) <span className="tok-k">return</span> res;
    <span className="tok-k">const</span> retry = <span className="tok-f">Number</span>(res.headers.<span className="tok-f">get</span>(<span className="tok-s">"retry-after"</span>)) || <span className="tok-n">0</span>;
    <span className="tok-k">const</span> wait = retry ? retry * <span className="tok-n">1000</span> : <span className="tok-f">Math</span>.<span className="tok-f">min</span>(<span className="tok-n">8000</span>, <span className="tok-n">200</span> * <span className="tok-n">2</span> ** i) * <span className="tok-f">Math</span>.<span className="tok-f">random</span>();
    <span className="tok-k">await</span> <span className="tok-k">new</span> <span className="tok-f">Promise</span>(r =&gt; <span className="tok-f">setTimeout</span>(r, wait));
  &#125;
  <span className="tok-k">throw</span> <span className="tok-k">new</span> <span className="tok-f">Error</span>(<span className="tok-s">"Black Bear Rentals: retry budget exhausted"</span>);
&#125;</code></pre>
          </div>
        </div>
      </section>

      
      <section className="section" id="tenants">
        <div className="kicker">Resource</div>
        <h2>Tenants</h2>
        <p>A tenant is a person renting one or more units. Tenants are workspace-scoped and can be attached to zero or more leases. IDs are prefixed <code className="inline">tnt_</code>.</p>

        <h3>Object</h3>
        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Field</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td>Unique id, e.g. <code className="inline">tnt_01HW2PQ...</code></td></tr>
            <tr><td>object</td><td>string</td><td>Always <code className="inline">"tenant"</code>.</td></tr>
            <tr><td>first_name</td><td>string</td><td>Given name.</td></tr>
            <tr><td>last_name</td><td>string</td><td>Family name.</td></tr>
            <tr><td>email</td><td>string</td><td>Unique per workspace.</td></tr>
            <tr><td>phone</td><td>string | null</td><td>E.164 format.</td></tr>
            <tr><td>status</td><td>enum</td><td><code className="inline">applicant</code>, <code className="inline">active</code>, <code className="inline">past</code>, <code className="inline">blocked</code>.</td></tr>
            <tr><td>lease_ids</td><td>string[]</td><td>Active lease ids.</td></tr>
            <tr><td>metadata</td><td>object</td><td>Up to 50 keys, 500 chars each.</td></tr>
            <tr><td>created_at</td><td>timestamp</td><td>ISO-8601.</td></tr>
          </tbody>
        </table>

        
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/tenants</span><span className="endpoint-desc">List tenants in the workspace.</span></div>

        <div className="codeblock" data-copy="multi">
          <div className="code-head">
            <div className="code-tabs">
              <button className="code-tab active" data-lang="curl">curl</button>
              <button className="code-tab" data-lang="js">node</button>
              <button className="code-tab" data-lang="py">python</button>
            </div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
            <div className="lang-pane active" data-lang="curl">
<pre><code><span className="tok-f">curl</span> <span className="tok-s">"https://api.rentblackbear.com/v1/tenants?status=active&amp;limit=25"</span> \
  -H <span className="tok-s">"Authorization: Bearer tnt_live_sk_..."</span> \
  -H <span className="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span></code></pre>
            </div>
            <div className="lang-pane" data-lang="js">
<pre><code><span className="tok-k">import</span> Black Bear Rentals <span className="tok-k">from</span> <span className="tok-s">"blackbear"</span>;
<span className="tok-k">const</span> t = <span className="tok-k">new</span> <span className="tok-f">Black Bear Rentals</span>(&#123; apiKey: process.env.BLACKBEAR_KEY, workspace: <span className="tok-s">"wks_9aB2xQ7r1LmZc4"</span> &#125;);

<span className="tok-k">const</span> page = <span className="tok-k">await</span> t.tenants.<span className="tok-f">list</span>(&#123; status: <span className="tok-s">"active"</span>, limit: <span className="tok-n">25</span> &#125;);
<span className="tok-f">console</span>.<span className="tok-f">log</span>(page.data.length, page.next_cursor);</code></pre>
            </div>
            <div className="lang-pane" data-lang="py">
<pre><code><span className="tok-k">import</span> blackbear
client = blackbear.<span className="tok-f">Client</span>(api_key=os.environ[<span className="tok-s">"BLACKBEAR_KEY"</span>], workspace=<span className="tok-s">"wks_9aB2xQ7r1LmZc4"</span>)

page = client.tenants.<span className="tok-f">list</span>(status=<span className="tok-s">"active"</span>, limit=<span className="tok-n">25</span>)
<span className="tok-f">print</span>(<span className="tok-f">len</span>(page.data), page.next_cursor)</code></pre>
            </div>
          </div>
        </div>

        <div className="codeblock" data-copy="response">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">200 · json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"object"</span>: <span className="tok-s">"list"</span>,
  <span className="tok-p">"data"</span>: [
    &#123;
      <span className="tok-p">"id"</span>: <span className="tok-s">"tnt_01HW2PQZ8K7A3V6M1R4F9X2S0B"</span>,
      <span className="tok-p">"object"</span>: <span className="tok-s">"tenant"</span>,
      <span className="tok-p">"first_name"</span>: <span className="tok-s">"Marisol"</span>,
      <span className="tok-p">"last_name"</span>: <span className="tok-s">"Ortega"</span>,
      <span className="tok-p">"email"</span>: <span className="tok-s">"marisol@example.com"</span>,
      <span className="tok-p">"phone"</span>: <span className="tok-s">"+12565550137"</span>,
      <span className="tok-p">"status"</span>: <span className="tok-s">"active"</span>,
      <span className="tok-p">"lease_ids"</span>: [<span className="tok-s">"lse_01HW2RABCDV7..."</span>],
      <span className="tok-p">"metadata"</span>: &#123; <span className="tok-p">"source"</span>: <span className="tok-s">"zillow"</span> &#125;,
      <span className="tok-p">"created_at"</span>: <span className="tok-s">"2026-02-14T17:22:08Z"</span>
    &#125;
  ],
  <span className="tok-p">"has_more"</span>: <span className="tok-k">true</span>,
  <span className="tok-p">"next_cursor"</span>: <span className="tok-s">"eyJpZCI6InRudF8wMUhXMl..."</span>
&#125;</code></pre>
          </div>
        </div>

        
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/tenants</span><span className="endpoint-desc">Create a tenant.</span></div>

        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Param</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>first_name <span className="pill req">required</span></td><td>string</td><td>1–80 chars.</td></tr>
            <tr><td>last_name <span className="pill req">required</span></td><td>string</td><td>1–80 chars.</td></tr>
            <tr><td>email <span className="pill req">required</span></td><td>string</td><td>Must be unique within the workspace.</td></tr>
            <tr><td>phone <span className="pill opt">optional</span></td><td>string</td><td>E.164. Enables SMS if SMS is enabled.</td></tr>
            <tr><td>metadata <span className="pill opt">optional</span></td><td>object</td><td>Freeform key/value.</td></tr>
          </tbody>
        </table>

        <div className="codeblock" data-copy="create tenant">
          <div className="code-head">
            <div className="code-tabs">
              <button className="code-tab active" data-lang="curl">curl</button>
              <button className="code-tab" data-lang="js">node</button>
              <button className="code-tab" data-lang="py">python</button>
            </div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
            <div className="lang-pane active" data-lang="curl">
<pre><code><span className="tok-f">curl</span> https://api.rentblackbear.com/v1/tenants \
  -H <span className="tok-s">"Authorization: Bearer tnt_live_sk_..."</span> \
  -H <span className="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span> \
  -H <span className="tok-s">"x-idempotency-key: c8f9a7e2-4d1b-4f23-9a83-3b6d3c0fa221"</span> \
  -H <span className="tok-s">"Content-Type: application/json"</span> \
  -d <span className="tok-s">'&#123;
    "first_name": "Marisol",
    "last_name": "Ortega",
    "email": "marisol@example.com",
    "phone": "+12565550137"
  &#125;'</span></code></pre>
            </div>
            <div className="lang-pane" data-lang="js">
<pre><code><span className="tok-k">const</span> tenant = <span className="tok-k">await</span> t.tenants.<span className="tok-f">create</span>(&#123;
  first_name: <span className="tok-s">"Marisol"</span>,
  last_name: <span className="tok-s">"Ortega"</span>,
  email: <span className="tok-s">"marisol@example.com"</span>,
  phone: <span className="tok-s">"+12565550137"</span>
&#125;, &#123; idempotencyKey: <span className="tok-f">crypto</span>.<span className="tok-f">randomUUID</span>() &#125;);</code></pre>
            </div>
            <div className="lang-pane" data-lang="py">
<pre><code>tenant = client.tenants.<span className="tok-f">create</span>(
    first_name=<span className="tok-s">"Marisol"</span>,
    last_name=<span className="tok-s">"Ortega"</span>,
    email=<span className="tok-s">"marisol@example.com"</span>,
    phone=<span className="tok-s">"+12565550137"</span>,
    idempotency_key=<span className="tok-f">uuid</span>.<span className="tok-f">uuid4</span>().<span className="tok-f">hex</span>,
)</code></pre>
            </div>
          </div>
        </div>

        
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/tenants/&#123;id&#125;</span><span className="endpoint-desc">Retrieve a tenant.</span></div>
        
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/tenants/&#123;id&#125;</span><span className="endpoint-desc">Update. Only supplied fields change.</span></div>
        
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/tenants/&#123;id&#125;</span><span className="endpoint-desc">Archive. Sets <code className="inline">status</code> to <code className="inline">past</code>. Idempotent.</span></div>

        <div className="callout"><strong>Note.</strong> Deleting a tenant with an active lease returns <code className="inline">409</code>. Terminate the lease first via <code className="inline">POST /v1/leases/&#123;id&#125;/terminate</code>.</div>
      </section>

      
      <section className="section" id="properties">
        <h2>Properties</h2>
        <p>A property is a physical building, lot, or complex. Properties contain one or more units. IDs are prefixed <code className="inline">prp_</code>.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/properties</span><span className="endpoint-desc">List properties.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/properties</span><span className="endpoint-desc">Create a property.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/properties/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/properties/&#123;id&#125;</span><span className="endpoint-desc">Update.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/properties/&#123;id&#125;</span><span className="endpoint-desc">Archive. Cascades units (soft).</span></div>

        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Field</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td><code className="inline">prp_</code> prefix.</td></tr>
            <tr><td>name</td><td>string</td><td>Display name, e.g. <code className="inline">"3026 Turf Ave NW"</code>.</td></tr>
            <tr><td>type</td><td>enum</td><td><code className="inline">sfr</code>, <code className="inline">multifamily</code>, <code className="inline">condo</code>, <code className="inline">townhouse</code>, <code className="inline">coliving</code>, <code className="inline">commercial</code>.</td></tr>
            <tr><td>address</td><td>object</td><td><code className="inline">line1</code>, <code className="inline">line2</code>, <code className="inline">city</code>, <code className="inline">region</code>, <code className="inline">postal_code</code>, <code className="inline">country</code>.</td></tr>
            <tr><td>unit_count</td><td>integer</td><td>Active unit count.</td></tr>
            <tr><td>year_built</td><td>integer | null</td><td>Four-digit year.</td></tr>
            <tr><td>metadata</td><td>object</td><td>Freeform.</td></tr>
          </tbody>
        </table>

        <div className="codeblock" data-copy="property">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">201 · json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"id"</span>: <span className="tok-s">"prp_01HW2NBCD7KZ1F4M6X9R3A0L2P"</span>,
  <span className="tok-p">"object"</span>: <span className="tok-s">"property"</span>,
  <span className="tok-p">"name"</span>: <span className="tok-s">"3026 Turf Ave NW"</span>,
  <span className="tok-p">"type"</span>: <span className="tok-s">"sfr"</span>,
  <span className="tok-p">"address"</span>: &#123;
    <span className="tok-p">"line1"</span>: <span className="tok-s">"3026 Turf Ave NW"</span>,
    <span className="tok-p">"city"</span>: <span className="tok-s">"Huntsville"</span>,
    <span className="tok-p">"region"</span>: <span className="tok-s">"AL"</span>,
    <span className="tok-p">"postal_code"</span>: <span className="tok-s">"35816"</span>,
    <span className="tok-p">"country"</span>: <span className="tok-s">"US"</span>
  &#125;,
  <span className="tok-p">"unit_count"</span>: <span className="tok-n">1</span>,
  <span className="tok-p">"year_built"</span>: <span className="tok-n">1968</span>,
  <span className="tok-p">"created_at"</span>: <span className="tok-s">"2026-03-02T12:40:11Z"</span>
&#125;</code></pre>
          </div>
        </div>
      </section>

      
      <section className="section" id="units">
        <h2>Units</h2>
        <p>A unit is a rentable space inside a property. For SFR, a property typically has one unit. IDs prefixed <code className="inline">unt_</code>.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/units</span><span className="endpoint-desc">List units. Filter by <code className="inline">property_id</code>, <code className="inline">status</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/units</span><span className="endpoint-desc">Create a unit under a property.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/units/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/units/&#123;id&#125;</span><span className="endpoint-desc">Update rent, beds/baths, status.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/units/&#123;id&#125;</span><span className="endpoint-desc">Archive.</span></div>

        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Field</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td><code className="inline">unt_</code> prefix.</td></tr>
            <tr><td>property_id</td><td>string</td><td>Parent property.</td></tr>
            <tr><td>label</td><td>string</td><td>e.g. <code className="inline">"Unit A"</code>, <code className="inline">"2B"</code>.</td></tr>
            <tr><td>beds</td><td>number</td><td>Half-beds allowed (e.g. 2.5).</td></tr>
            <tr><td>baths</td><td>number</td><td>Half-baths allowed.</td></tr>
            <tr><td>sqft</td><td>integer | null</td><td>Square footage.</td></tr>
            <tr><td>market_rent_cents</td><td>integer</td><td>Asking rent, minor units (USD cents).</td></tr>
            <tr><td>status</td><td>enum</td><td><code className="inline">vacant</code>, <code className="inline">occupied</code>, <code className="inline">notice</code>, <code className="inline">offline</code>.</td></tr>
          </tbody>
        </table>
      </section>

      
      <section className="section" id="leases">
        <h2>Leases</h2>
        <p>A lease ties tenants to a unit for a term, with rent, deposit, and charges. IDs prefixed <code className="inline">lse_</code>.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/leases</span><span className="endpoint-desc">List leases.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/leases</span><span className="endpoint-desc">Draft a lease. Does not send.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/leases/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/leases/&#123;id&#125;</span><span className="endpoke-desc">Update while in <code className="inline">draft</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/leases/&#123;id&#125;/send</span><span className="endpoint-desc">Send for e-signature. Emits <code className="inline">lease.sent</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/leases/&#123;id&#125;/terminate</span><span className="endpoint-desc">End early. Body: <code className="inline">&#123;end_date, reason&#125;</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/leases/&#123;id&#125;</span><span className="endpoint-desc">Only permitted on <code className="inline">draft</code>.</span></div>

        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Field</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>unit_id <span className="pill req">required</span></td><td>string</td><td>Target unit.</td></tr>
            <tr><td>tenant_ids <span className="pill req">required</span></td><td>string[]</td><td>One or more tenants.</td></tr>
            <tr><td>start_date <span className="pill req">required</span></td><td>date</td><td>Inclusive. Format <code className="inline">YYYY-MM-DD</code>.</td></tr>
            <tr><td>end_date <span className="pill req">required</span></td><td>date</td><td>Inclusive.</td></tr>
            <tr><td>rent_cents <span className="pill req">required</span></td><td>integer</td><td>Monthly rent.</td></tr>
            <tr><td>deposit_cents <span className="pill opt">optional</span></td><td>integer</td><td>Security deposit.</td></tr>
            <tr><td>due_day</td><td>integer</td><td>Day of month rent is due (1–28). Default 1.</td></tr>
            <tr><td>status</td><td>enum</td><td><code className="inline">draft</code>, <code className="inline">sent</code>, <code className="inline">signed</code>, <code className="inline">active</code>, <code className="inline">ended</code>.</td></tr>
          </tbody>
        </table>
      </section>

      
      <section className="section" id="applications">
        <h2>Applications</h2>
        <p>Rental applications submitted through the public apply flow or the API. IDs prefixed <code className="inline">app_</code>.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/applications</span><span className="endpoint-desc">List applications.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/applications</span><span className="endpoint-desc">Create one (e.g. from an external lead form).</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/applications/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/applications/&#123;id&#125;/approve</span><span className="endpoint-desc">Approve. Optionally auto-draft a lease.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/applications/&#123;id&#125;/decline</span><span className="endpoint-desc">Decline with reason code.</span></div>
      </section>

      
      <section className="section" id="payments">
        <h2>Payments</h2>
        <p>Rent collections, late fees, deposits, refunds. IDs prefixed <code className="inline">pay_</code>. Amounts are always in minor units (cents for USD).</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/payments</span><span className="endpoint-desc">List payments. Filter by <code className="inline">lease_id</code>, <code className="inline">status</code>, <code className="inline">created[gte]</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/payments</span><span className="endpoint-desc">Record a manual payment (cash, check) or charge a saved method.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/payments/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/payments/&#123;id&#125;/refund</span><span className="endpoint-desc">Partial or full refund.</span></div>

        <div className="codeblock" data-copy="payment">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">200 · json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"id"</span>: <span className="tok-s">"pay_01HW3CDZ9V2F7A4M0R1S3B6X8K"</span>,
  <span className="tok-p">"object"</span>: <span className="tok-s">"payment"</span>,
  <span className="tok-p">"lease_id"</span>: <span className="tok-s">"lse_01HW2RABCDV7..."</span>,
  <span className="tok-p">"tenant_id"</span>: <span className="tok-s">"tnt_01HW2PQZ8K..."</span>,
  <span className="tok-p">"amount_cents"</span>: <span className="tok-n">145000</span>,
  <span className="tok-p">"currency"</span>: <span className="tok-s">"usd"</span>,
  <span className="tok-p">"method"</span>: <span className="tok-s">"ach"</span>,
  <span className="tok-p">"status"</span>: <span className="tok-s">"succeeded"</span>,
  <span className="tok-p">"category"</span>: <span className="tok-s">"rent"</span>,
  <span className="tok-p">"period"</span>: <span className="tok-s">"2026-04"</span>,
  <span className="tok-p">"processor_fee_cents"</span>: <span className="tok-n">0</span>,
  <span className="tok-p">"processed_at"</span>: <span className="tok-s">"2026-04-01T09:14:27Z"</span>,
  <span className="tok-p">"created_at"</span>: <span className="tok-s">"2026-03-30T23:00:02Z"</span>
&#125;</code></pre>
          </div>
        </div>
      </section>

      
      <section className="section" id="maintenance">
        <h2>Maintenance</h2>
        <p>Tickets opened by tenants or staff. IDs prefixed <code className="inline">mnt_</code>.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/maintenance</span><span className="endpoint-desc">List tickets.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/maintenance</span><span className="endpoint-desc">Open a ticket.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/maintenance/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/maintenance/&#123;id&#125;</span><span className="endpoint-desc">Update status, priority, assignee.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/maintenance/&#123;id&#125;/assign</span><span className="endpoint-desc">Assign a vendor. Body: <code className="inline">&#123;vendor_id&#125;</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/maintenance/&#123;id&#125;</span><span className="endpoint-desc">Close ticket. Body: <code className="inline">&#123;resolution&#125;</code>.</span></div>

        <table className="params">
          <thead><tr><th style={{width: "26%"}}>Field</th><th style={{width: "18%"}}>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>unit_id <span className="pill req">required</span></td><td>string</td><td>Unit the issue affects.</td></tr>
            <tr><td>title <span className="pill req">required</span></td><td>string</td><td>Short summary.</td></tr>
            <tr><td>priority</td><td>enum</td><td><code className="inline">low</code>, <code className="inline">normal</code>, <code className="inline">high</code>, <code className="inline">emergency</code>.</td></tr>
            <tr><td>category</td><td>enum</td><td><code className="inline">plumbing</code>, <code className="inline">hvac</code>, <code className="inline">electrical</code>, <code className="inline">appliance</code>, <code className="inline">pest</code>, <code className="inline">other</code>.</td></tr>
            <tr><td>status</td><td>enum</td><td><code className="inline">open</code>, <code className="inline">scheduled</code>, <code className="inline">in_progress</code>, <code className="inline">resolved</code>, <code className="inline">closed</code>.</td></tr>
            <tr><td>photos</td><td>string[]</td><td>Document ids (<code className="inline">doc_</code>).</td></tr>
          </tbody>
        </table>
      </section>

      
      <section className="section" id="vendors">
        <h2>Vendors</h2>
        <p>Contractors, handymen, cleaners, inspectors. IDs prefixed <code className="inline">vnd_</code>. Vendors can receive assigned tickets and submit invoices.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/vendors</span><span className="endpoint-desc">List vendors.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/vendors</span><span className="endpoint-desc">Create.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/vendors/&#123;id&#125;</span><span className="endpoint-desc">Retrieve.</span></div>
        <div className="endpoint"><span className="method-badge m-patch">PATCH</span><span className="endpoint-path">/v1/vendors/&#123;id&#125;</span><span className="endpoint-desc">Update.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/vendors/&#123;id&#125;</span><span className="endpoint-desc">Archive. Past invoices retained.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/vendors/&#123;id&#125;/invoices</span><span className="endpoint-desc">Record an invoice against a ticket. Emits <code className="inline">vendor.invoice.submitted</code>.</span></div>
      </section>

      
      <section className="section" id="documents">
        <h2>Documents</h2>
        <p>Signed leases, W-9s, inspection photos, receipts. IDs prefixed <code className="inline">doc_</code>. Upload via multipart or presigned URL.</p>

        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/documents</span><span className="endpoint-desc">List. Filter by <code className="inline">owner_type</code>, <code className="inline">owner_id</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-post">POST</span><span className="endpoint-path">/v1/documents</span><span className="endpoint-desc">Begin upload. Returns a presigned URL valid 10 min.</span></div>
        <div className="endpoint"><span className="method-badge m-get">GET</span><span className="endpoint-path">/v1/documents/&#123;id&#125;</span><span className="endpoint-desc">Retrieve metadata. Body includes time-limited <code className="inline">download_url</code>.</span></div>
        <div className="endpoint"><span className="method-badge m-delete">DELETE</span><span className="endpoint-path">/v1/documents/&#123;id&#125;</span><span className="endpoint-desc">Delete. Originals retained 90 days for audit.</span></div>

        <div className="callout"><strong>Max upload size.</strong> 25 MB per file. For bulk imports use the <code className="inline">POST /v1/batches</code> endpoint (Enterprise only).</div>
      </section>

      
      <section className="section" id="webhooks">
        <div className="kicker">Events</div>
        <h2>Webhooks catalog</h2>
        <p>Black Bear Rentals delivers signed JSON payloads via HTTPS POST to URLs you configure in <strong>Settings &rarr; API &rarr; Webhooks</strong>. Every delivery includes <code className="inline">t-signature</code> and <code className="inline">t-signature-timestamp</code> headers. Failed deliveries retry with exponential backoff for up to 72 hours.</p>

        <div className="webhooks-grid">
          <div className="webhook-card"><div className="webhook-event">tenant.created</div><div className="webhook-desc">A new tenant was added via API, CSV import, or admin UI.</div></div>
          <div className="webhook-card"><div className="webhook-event">lease.signed</div><div className="webhook-desc">All parties have e-signed. Lease moves to <code className="inline">signed</code>.</div></div>
          <div className="webhook-card"><div className="webhook-event">payment.succeeded</div><div className="webhook-desc">Payment settled. Emitted on ACH settlement or card capture.</div></div>
          <div className="webhook-card"><div className="webhook-event">payment.failed</div><div className="webhook-desc">Charge declined, NSF, or ACH return. Payload includes <code className="inline">failure_reason</code>.</div></div>
          <div className="webhook-card"><div className="webhook-event">maintenance.opened</div><div className="webhook-desc">Ticket created. Includes priority, category, unit.</div></div>
          <div className="webhook-card"><div className="webhook-event">application.submitted</div><div className="webhook-desc">Prospect completed the apply flow.</div></div>
          <div className="webhook-card"><div className="webhook-event">application.approved</div><div className="webhook-desc">Application approved. May include auto-drafted <code className="inline">lease_id</code>.</div></div>
          <div className="webhook-card"><div className="webhook-event">application.declined</div><div className="webhook-desc">Application declined with <code className="inline">reason_code</code>.</div></div>
          <div className="webhook-card"><div className="webhook-event">vendor.invoice.submitted</div><div className="webhook-desc">Vendor attached an invoice to a maintenance ticket.</div></div>
        </div>

        <h3>Example payload — <code className="inline">payment.succeeded</code></h3>
        <div className="codeblock" data-copy="webhook payload">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">POST body · json</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code>&#123;
  <span className="tok-p">"id"</span>: <span className="tok-s">"evt_01HW3D4ZK8M7A2V6R1S9B0X3QP"</span>,
  <span className="tok-p">"object"</span>: <span className="tok-s">"event"</span>,
  <span className="tok-p">"type"</span>: <span className="tok-s">"payment.succeeded"</span>,
  <span className="tok-p">"workspace_id"</span>: <span className="tok-s">"wks_9aB2xQ7r1LmZc4"</span>,
  <span className="tok-p">"livemode"</span>: <span className="tok-k">true</span>,
  <span className="tok-p">"created"</span>: <span className="tok-n">1775203467</span>,
  <span className="tok-p">"data"</span>: &#123;
    <span className="tok-p">"object"</span>: &#123;
      <span className="tok-p">"id"</span>: <span className="tok-s">"pay_01HW3CDZ9V2F7A4M0R1S3B6X8K"</span>,
      <span className="tok-p">"object"</span>: <span className="tok-s">"payment"</span>,
      <span className="tok-p">"lease_id"</span>: <span className="tok-s">"lse_01HW2RABCDV7..."</span>,
      <span className="tok-p">"tenant_id"</span>: <span className="tok-s">"tnt_01HW2PQZ8K..."</span>,
      <span className="tok-p">"amount_cents"</span>: <span className="tok-n">145000</span>,
      <span className="tok-p">"currency"</span>: <span className="tok-s">"usd"</span>,
      <span className="tok-p">"method"</span>: <span className="tok-s">"ach"</span>,
      <span className="tok-p">"status"</span>: <span className="tok-s">"succeeded"</span>,
      <span className="tok-p">"category"</span>: <span className="tok-s">"rent"</span>,
      <span className="tok-p">"period"</span>: <span className="tok-s">"2026-04"</span>,
      <span className="tok-p">"processor_fee_cents"</span>: <span className="tok-n">0</span>,
      <span className="tok-p">"processed_at"</span>: <span className="tok-s">"2026-04-01T09:14:27Z"</span>
    &#125;
  &#125;
&#125;</code></pre>
          </div>
        </div>

        <h3>Delivery headers</h3>
        <div className="codeblock" data-copy="headers">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">http</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code><span className="tok-p">POST</span> /hooks/blackbear <span className="tok-p">HTTP</span>/<span className="tok-n">1.1</span>
<span className="tok-p">Host</span>: app.example.com
<span className="tok-p">Content-Type</span>: application/json
<span className="tok-p">User-Agent</span>: BlackBear-Webhooks/1.0
<span className="tok-p">t-signature-timestamp</span>: <span className="tok-n">1775203467</span>
<span className="tok-p">t-signature</span>: v1=9c2a7f3e1b8d0a4c6e5f2a9b1d3c4e7a0f8b2c6d5e4a1b9c3f7e0a2d4b6c8e1a
<span className="tok-p">t-event-id</span>: evt_01HW3D4ZK8M7A2V6R1S9B0X3QP
<span className="tok-p">t-delivery-attempt</span>: <span className="tok-n">1</span></code></pre>
          </div>
        </div>

        <h3 id="webhook-verify">Verifying signatures (Node.js)</h3>
        <p>Signatures are HMAC-SHA256 over <code className="inline">timestamp + "." + raw_body</code>, using the webhook secret shown once at endpoint creation. Reject anything older than 5 minutes and always compare with a constant-time function.</p>

        <div className="codeblock" data-copy="verification">
          <div className="code-head">
            <div className="code-tabs"><button className="code-tab active">node</button></div>
            <button className="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</button>
          </div>
          <div className="code-body">
<pre><code><span className="tok-k">import</span> crypto <span className="tok-k">from</span> <span className="tok-s">"node:crypto"</span>;
<span className="tok-k">import</span> express <span className="tok-k">from</span> <span className="tok-s">"express"</span>;

<span className="tok-k">const</span> SECRET = process.env.BLACKBEAR_WEBHOOK_SECRET;
<span className="tok-k">const</span> app = <span className="tok-f">express</span>();

<span className="tok-c">// IMPORTANT: capture the raw body for HMAC</span>
app.<span className="tok-f">post</span>(<span className="tok-s">"/hooks/blackbear"</span>,
  express.<span className="tok-f">raw</span>(&#123; type: <span className="tok-s">"application/json"</span> &#125;),
  (req, res) =&gt; &#123;
    <span className="tok-k">const</span> ts  = req.headers[<span className="tok-s">"t-signature-timestamp"</span>];
    <span className="tok-k">const</span> sig = <span className="tok-f">String</span>(req.headers[<span className="tok-s">"t-signature"</span>] ?? <span className="tok-s">""</span>);
    <span className="tok-k">const</span> raw = req.body; <span className="tok-c">// Buffer</span>

    <span className="tok-c">// 1. Reject stale timestamps (replay protection)</span>
    <span className="tok-k">if</span> (<span className="tok-f">Math</span>.<span className="tok-f">abs</span>(<span className="tok-f">Date</span>.<span className="tok-f">now</span>() / <span className="tok-n">1000</span> - <span className="tok-f">Number</span>(ts)) &gt; <span className="tok-n">300</span>) &#123;
      <span className="tok-k">return</span> res.<span className="tok-f">status</span>(<span className="tok-n">400</span>).<span className="tok-f">send</span>(<span className="tok-s">"stale"</span>);
    &#125;

    <span className="tok-c">// 2. Compute expected signature</span>
    <span className="tok-k">const</span> expected = crypto
      .<span className="tok-f">createHmac</span>(<span className="tok-s">"sha256"</span>, SECRET)
      .<span className="tok-f">update</span>(`$&#123;ts&#125;.$&#123;raw.<span className="tok-f">toString</span>(<span className="tok-s">"utf8"</span>)&#125;`)
      .<span className="tok-f">digest</span>(<span className="tok-s">"hex"</span>);

    <span className="tok-c">// 3. Constant-time compare ("v1=" prefix from the header)</span>
    <span className="tok-k">const</span> received = sig.<span className="tok-f">replace</span>(<span className="tok-s">/^v1=/</span>, <span className="tok-s">""</span>);
    <span className="tok-k">const</span> ok = received.length === expected.length &amp;&amp;
      crypto.<span className="tok-f">timingSafeEqual</span>(<span className="tok-f">Buffer</span>.<span className="tok-f">from</span>(received), <span className="tok-f">Buffer</span>.<span className="tok-f">from</span>(expected));

    <span className="tok-k">if</span> (!ok) <span className="tok-k">return</span> res.<span className="tok-f">status</span>(<span className="tok-n">401</span>).<span className="tok-f">send</span>(<span className="tok-s">"bad signature"</span>);

    <span className="tok-k">const</span> event = <span className="tok-f">JSON</span>.<span className="tok-f">parse</span>(raw.<span className="tok-f">toString</span>(<span className="tok-s">"utf8"</span>));
    <span className="tok-c">// ack fast, process async</span>
    res.<span className="tok-f">status</span>(<span className="tok-n">200</span>).<span className="tok-f">end</span>();
    <span className="tok-f">handle</span>(event).<span className="tok-f">catch</span>(console.error);
  &#125;
);</code></pre>
          </div>
        </div>

        <div className="callout"><strong>Delivery guarantees.</strong> At-least-once. Store <code className="inline">t-event-id</code> and dedupe on the consumer side. A 2xx response within 10s is treated as successful; otherwise we retry.</div>
      </section>

      
      <section className="section" id="openapi">
        <h2>OpenAPI 3.1 and SDKs</h2>
        <p>Our spec is the source of truth. SDKs are generated from it on every release. If a field exists in the spec but not the SDK, file an issue — the SDK is wrong.</p>
        <ul>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>OpenAPI 3.1 spec</a> — <code className="inline">openapi.yaml</code>, updated on each release</li>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>Postman collection</a> — pre-configured with workspace &amp; bearer env</li>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>blackbear-node</a> — <code className="inline">npm i blackbear</code></li>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>blackbear-python</a> — <code className="inline">pip install blackbear</code></li>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>blackbear-ruby</a> — <code className="inline">gem install blackbear</code></li>
          <li><a href="#" style={{color: "var(--blue)", fontWeight: "600"}}>Status page</a> — subscribe to incident updates</li>
        </ul>
      </section>

    </div>
  </section>

  
  <section className="ready">
    <div className="ready-card">
      <div className="ready-text">
        <div className="ready-kicker">Ready to build?</div>
        <h3>The API is included on Scale and Enterprise.</h3>
        <p>Upgrade once and you get a production key, a sandbox key, signed webhooks, and priority engineering support. No metering, no per-call billing.</p>
      </div>
      <div className="ready-actions">
        <a className="btn btn-primary" href="pricing.html#scale">
          Upgrade to Scale
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </a>
        <a className="btn btn-ghost" href="onboarding.html#settings-api">Open Settings &rarr; API</a>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="integrations.html">Integrations</a>
      <a href="api-docs.html">API</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  
  <div className="toast" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    <span id="toastMsg">Copied to clipboard</span>
  </div>

  


    </>
  );
}
