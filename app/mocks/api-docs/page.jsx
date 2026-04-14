"use client";

// Mock ported verbatim from ~/Desktop/tenantory/api-docs.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface); line-height: 1.55; font-size: 15px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    code, pre, .mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);

      /* Code colors */
      --code-bg: #0f172a;
      --code-bg-soft: #111a2e;
      --code-border: #1f2a44;
      --code-text: #e6edf7;
      --code-muted: #8aa0c2;
      --code-keyword: #ff7bb4;
      --code-string: #79e0c2;
      --code-number: #f5a623;
      --code-prop: #8ab4ff;
      --code-comment: #6b7a99;
      --code-func: #c7a8ff;
    }

    /* ===== Topbar ===== */
    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);
    }
    .tb-brand { display: flex; align-items: center; gap: 10px; }
    .tb-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }
    .tb-nav { display: flex; align-items: center; gap: 4px; }
    .tb-nav-item {
      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }
    .tb-nav-item.active { color: var(--blue); }
    .tb-cta { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-nav { padding: 9px 16px; font-size: 13px; }

    /* ===== Hero ===== */
    .hero {
      padding: 64px 32px 28px;
      text-align: center;
      background:
        radial-gradient(1000px 400px at 50% -100px, rgba(22,101,216,0.10), transparent 60%),
        linear-gradient(180deg, var(--surface) 0%, var(--surface-subtle) 100%);
      border-bottom: 1px solid var(--border);
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      margin-bottom: 18px;
    }
    .version-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border-strong);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 600; color: var(--text);
    }
    .version-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-bg); }
    .tier-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .tier-badge svg { width: 11px; height: 11px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 860px; margin: 0 auto 18px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 680px; margin: 0 auto 28px; line-height: 1.55; }
    .hero-actions { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

    /* ===== Quickstart ===== */
    .quickstart { max-width: 1200px; margin: -40px auto 0; padding: 0 32px 32px; position: relative; z-index: 2; }
    .qs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .qs-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      box-shadow: var(--shadow);
    }
    .qs-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }
    .qs-icon svg { width: 18px; height: 18px; }
    .qs-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 6px; }
    .qs-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .qs-body { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; }
    .qs-body code {
      display: inline-block; background: var(--surface-alt); border: 1px solid var(--border);
      padding: 2px 7px; border-radius: 6px; font-size: 12.5px; color: var(--navy-darker);
    }

    /* ===== Layout: sidebar + main ===== */
    .docs {
      max-width: 1280px; margin: 40px auto 0; padding: 0 32px;
      display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 48px;
      align-items: start;
    }
    .sidebar {
      position: sticky; top: 88px;
      padding-bottom: 40px;
      max-height: calc(100vh - 104px);
      overflow-y: auto;
    }
    .side-group { margin-bottom: 22px; }
    .side-title {
      font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--text-faint); margin-bottom: 8px; padding: 0 10px;
    }
    .side-link {
      display: block; padding: 7px 10px; border-radius: 8px;
      font-size: 13.5px; font-weight: 500; color: var(--text-muted);
      transition: all 0.12s ease; line-height: 1.3;
    }
    .side-link:hover { color: var(--text); background: var(--surface-alt); }
    .side-link.active { color: var(--blue); background: var(--blue-pale); font-weight: 600; }
    .side-link .method {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      padding: 1px 5px; border-radius: 4px; margin-right: 6px;
      background: var(--surface-alt); color: var(--text-muted);
    }

    /* ===== Main content ===== */
    .main { min-width: 0; padding-bottom: 80px; }
    .section { padding-top: 32px; scroll-margin-top: 88px; }
    .section:first-child { padding-top: 0; }
    .section h2 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 8px; line-height: 1.15;
    }
    .section h3 {
      font-size: 19px; font-weight: 700; letter-spacing: -0.01em;
      color: var(--text); margin: 28px 0 10px; line-height: 1.25;
    }
    .section p { font-size: 14.5px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.65; }
    .section p strong { color: var(--text); font-weight: 600; }
    .section ul { margin: 8px 0 16px 0; padding-left: 20px; color: var(--text-muted); font-size: 14.5px; line-height: 1.7; }
    .section li { margin-bottom: 4px; }
    .section code.inline {
      background: var(--surface-alt); border: 1px solid var(--border);
      padding: 1.5px 6px; border-radius: 5px; font-size: 12.5px; color: var(--navy-darker);
    }

    .kicker {
      font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--blue); margin-bottom: 6px;
    }

    /* Tables */
    .params {
      width: 100%; border-collapse: collapse; margin: 12px 0 16px;
      border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;
      font-size: 13.5px;
    }
    .params th {
      background: var(--surface-alt); color: var(--text);
      font-weight: 700; font-size: 12px; letter-spacing: 0.04em;
      padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border);
    }
    .params td {
      padding: 12px 14px; border-bottom: 1px solid var(--border);
      vertical-align: top; color: var(--text-muted);
    }
    .params tr:last-child td { border-bottom: none; }
    .params td:first-child { color: var(--text); font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 13px; }
    .params td:nth-child(2) { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--navy); }
    .pill {
      display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
      padding: 2px 7px; border-radius: 100px; margin-left: 6px;
      background: var(--surface-alt); color: var(--text-muted);
    }
    .pill.req { background: var(--pink-bg); color: #c21a6a; }
    .pill.opt { background: var(--surface-alt); color: var(--text-muted); }

    /* Endpoint header */
    .endpoint {
      margin: 24px 0 18px; padding: 14px 16px;
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: var(--radius);
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    }
    .method-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800;
      padding: 4px 9px; border-radius: 6px; letter-spacing: 0.04em;
    }
    .m-get { background: rgba(22,101,216,0.12); color: #0d4a9e; }
    .m-post { background: var(--green-bg); color: var(--green-dark); }
    .m-patch { background: rgba(245,166,35,0.16); color: #a7670a; }
    .m-delete { background: rgba(214,69,69,0.14); color: #a03434; }
    .endpoint-path {
      font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600;
      color: var(--text);
    }
    .endpoint-desc { color: var(--text-muted); font-size: 13.5px; margin-left: auto; }

    /* Code block */
    .codeblock {
      position: relative;
      background: var(--code-bg);
      border: 1px solid var(--code-border);
      border-radius: var(--radius);
      overflow: hidden;
      margin: 10px 0 18px;
    }
    .code-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; background: var(--code-bg-soft);
      border-bottom: 1px solid var(--code-border);
    }
    .code-tabs { display: flex; gap: 2px; }
    .code-tab {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600;
      color: var(--code-muted); padding: 5px 11px; border-radius: 6px;
      transition: all 0.12s ease;
    }
    .code-tab:hover { color: var(--code-text); }
    .code-tab.active { background: rgba(255,255,255,0.08); color: var(--code-text); }
    .code-copy {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11.5px; font-weight: 600; color: var(--code-muted);
      padding: 5px 10px; border-radius: 6px; transition: all 0.12s ease;
    }
    .code-copy:hover { color: var(--code-text); background: rgba(255,255,255,0.06); }
    .code-copy svg { width: 12px; height: 12px; }
    .code-body { padding: 14px 16px; overflow-x: auto; }
    .code-body pre { margin: 0; }
    .code-body code {
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65;
      color: var(--code-text); white-space: pre;
    }
    .code-body .lang-pane { display: none; }
    .code-body .lang-pane.active { display: block; }

    .tok-k { color: var(--code-keyword); }
    .tok-s { color: var(--code-string); }
    .tok-n { color: var(--code-number); }
    .tok-p { color: var(--code-prop); }
    .tok-c { color: var(--code-comment); font-style: italic; }
    .tok-f { color: var(--code-func); }
    .tok-m { color: var(--code-muted); }

    /* Callout */
    .callout {
      background: var(--blue-softer); border: 1px solid rgba(22,101,216,0.2);
      border-left: 3px solid var(--blue-bright);
      padding: 12px 14px 12px 14px; border-radius: var(--radius);
      color: var(--text); font-size: 13.5px; line-height: 1.6;
      margin: 12px 0 18px;
    }
    .callout strong { font-weight: 700; }

    /* Status codes */
    .status-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0 20px;
    }
    .status-card {
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 12px 14px; background: var(--surface);
    }
    .status-code {
      font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px;
      color: var(--text); margin-bottom: 2px;
    }
    .status-code.ok { color: var(--green-dark); }
    .status-code.warn { color: #a7670a; }
    .status-code.err { color: var(--red); }
    .status-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

    /* Webhook catalog */
    .webhooks-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0 20px;
    }
    .webhook-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
    }
    .webhook-event {
      font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px;
      color: var(--navy-darker); margin-bottom: 4px;
    }
    .webhook-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

    /* Ready-to-build callout */
    .ready {
      max-width: 1200px; margin: 40px auto 0; padding: 0 32px;
    }
    .ready-card {
      position: relative;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 55%, var(--blue-bright) 100%);
      color: #fff;
      padding: 48px 44px;
      display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap;
      overflow: hidden;
    }
    .ready-card::before {
      content: ""; position: absolute; inset: 0;
      background:
        radial-gradient(500px 200px at 10% 20%, rgba(255,73,152,0.35), transparent 60%),
        radial-gradient(500px 200px at 90% 90%, rgba(22,101,216,0.4), transparent 60%);
      pointer-events: none;
    }
    .ready-text { position: relative; z-index: 1; max-width: 620px; }
    .ready-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 10px; }
    .ready-card h3 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }
    .ready-card p { color: rgba(255,255,255,0.82); font-size: 15px; line-height: 1.6; }
    .ready-actions { position: relative; z-index: 1; display: flex; gap: 10px; flex-wrap: wrap; }
    .ready-actions .btn-primary { background: #fff; color: var(--navy-darker); }
    .ready-actions .btn-primary:hover { background: #f2f4f8; color: var(--navy-darker); }
    .ready-actions .btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.3); }
    .ready-actions .btn-ghost:hover { border-color: #fff; color: #fff; }

    /* Toast */
    .toast {
      position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--navy-darker); color: #fff;
      padding: 10px 18px; border-radius: 100px;
      font-size: 13px; font-weight: 600;
      display: flex; align-items: center; gap: 8px;
      box-shadow: var(--shadow-lg);
      opacity: 0; pointer-events: none;
      transition: all 0.22s ease;
      z-index: 100;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast svg { width: 14px; height: 14px; color: var(--green); }

    /* Footer */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 960px) {
      .docs { grid-template-columns: 1fr; gap: 24px; }
      .sidebar { position: static; max-height: none; overflow: visible; display: none; }
      .qs-grid { grid-template-columns: 1fr; }
      .status-grid, .webhooks-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 28px; }
      .quickstart, .docs, .ready { padding-left: 16px; padding-right: 16px; }
      .ready-card { padding: 32px 22px; }
    }`;

const MOCK_HTML = `<!-- Topbar -->
  <header class="topbar">
    <a class="tb-brand" href="landing.html">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <span class="tb-brand-name">Tenantory</span>
    </a>
    <nav class="tb-nav">
      <a class="tb-nav-item" href="landing.html">Home</a>
      <a class="tb-nav-item" href="pricing.html">Pricing</a>
      <a class="tb-nav-item" href="integrations.html">Integrations</a>
      <a class="tb-nav-item active" href="api-docs.html">API</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <span class="version-pill"><span class="dot"></span>v1 · stable</span>
      <span class="tier-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
        Scale &amp; Enterprise
      </span>
    </div>
    <h1>Tenantory <em>API v1</em></h1>
    <p class="hero-sub">REST endpoints, signed webhooks, workspace-scoped bearer tokens. OpenAPI 3.1 spec available.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#authentication">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        Get started
      </a>
      <a class="btn btn-ghost" href="#openapi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download OpenAPI 3.1
      </a>
    </div>
  </section>

  <!-- Quickstart -->
  <section class="quickstart">
    <div class="qs-grid">
      <div class="qs-card">
        <div class="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="qs-label">Auth</div>
        <div class="qs-title">Bearer tokens</div>
        <div class="qs-body">Generate an API key in <strong>Settings &rarr; API</strong>. Scoped to a single workspace; prefix <code>tnt_live_</code> for production, <code>tnt_test_</code> for sandbox.</div>
      </div>
      <div class="qs-card">
        <div class="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="qs-label">Base URL</div>
        <div class="qs-title">Single endpoint</div>
        <div class="qs-body"><code>https://api.tenantory.com/v1</code><br>All requests must be HTTPS. Sandbox mirror at <code>sandbox.tenantory.com/v1</code>.</div>
      </div>
      <div class="qs-card">
        <div class="qs-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div class="qs-label">Rate limits</div>
        <div class="qs-title">100 req/s</div>
        <div class="qs-body">Per workspace. Burst to 200 for 10s. Headers: <code>x-ratelimit-remaining</code>, <code>x-ratelimit-reset</code>. 429s include <code>retry-after</code>.</div>
      </div>
    </div>
  </section>

  <!-- Docs: sidebar + main -->
  <section class="docs">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="side-group">
        <div class="side-title">Overview</div>
        <a class="side-link" href="#authentication">Authentication</a>
        <a class="side-link" href="#errors">Errors</a>
        <a class="side-link" href="#pagination">Pagination</a>
        <a class="side-link" href="#rate-limits">Rate limiting</a>
      </div>
      <div class="side-group">
        <div class="side-title">Resources</div>
        <a class="side-link" href="#tenants">Tenants</a>
        <a class="side-link" href="#properties">Properties</a>
        <a class="side-link" href="#units">Units</a>
        <a class="side-link" href="#leases">Leases</a>
        <a class="side-link" href="#applications">Applications</a>
        <a class="side-link" href="#payments">Payments</a>
        <a class="side-link" href="#maintenance">Maintenance</a>
        <a class="side-link" href="#vendors">Vendors</a>
        <a class="side-link" href="#documents">Documents</a>
      </div>
      <div class="side-group">
        <div class="side-title">Events</div>
        <a class="side-link" href="#webhooks">Webhooks catalog</a>
        <a class="side-link" href="#webhook-verify">Verifying signatures</a>
      </div>
      <div class="side-group">
        <div class="side-title">Tools</div>
        <a class="side-link" href="#openapi">OpenAPI 3.1 &amp; SDKs</a>
      </div>
    </aside>

    <!-- Main -->
    <div class="main">

      <!-- AUTHENTICATION -->
      <section class="section" id="authentication">
        <div class="kicker">Overview</div>
        <h2>Authentication</h2>
        <p>The Tenantory API uses <strong>workspace-scoped bearer tokens</strong>. Every request must include an <code class="inline">Authorization</code> header and a <code class="inline">x-workspace-id</code> header. Keys are prefixed <code class="inline">tnt_live_</code> or <code class="inline">tnt_test_</code>; the prefix determines which environment the key operates against. Keys are not transferable across workspaces.</p>

        <h3>Request headers</h3>
        <table class="params">
          <thead><tr><th style="width:26%">Header</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Authorization <span class="pill req">required</span></td><td>string</td><td>Bearer token, e.g. <code class="inline">Bearer tnt_live_sk_9fHd2...</code></td></tr>
            <tr><td>x-workspace-id <span class="pill req">required</span></td><td>string</td><td>Workspace this request runs against. Format: <code class="inline">wks_</code> + 14 chars.</td></tr>
            <tr><td>x-idempotency-key <span class="pill opt">optional</span></td><td>string</td><td>Provide a unique key on POST requests to make them safely retriable.</td></tr>
            <tr><td>Tenantory-Version <span class="pill opt">optional</span></td><td>string</td><td>Pin to a date, e.g. <code class="inline">2026-04-01</code>. Defaults to the key's pinned version.</td></tr>
          </tbody>
        </table>

        <h3>Example: authenticated request</h3>
        <div class="codeblock" data-copy="curl https://api.tenantory.com/v1/tenants -H 'Authorization: Bearer tnt_live_sk_9fHd2...' -H 'x-workspace-id: wks_9aB2xQ7r1LmZc4'">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">shell</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code><span class="tok-c"># Fetch the first page of tenants in a workspace</span>
<span class="tok-f">curl</span> https://api.tenantory.com/v1/tenants \\
  -H <span class="tok-s">"Authorization: Bearer tnt_live_sk_9fHd2..."</span> \\
  -H <span class="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span> \\
  -H <span class="tok-s">"Tenantory-Version: 2026-04-01"</span></code></pre>
          </div>
        </div>

        <div class="callout"><strong>Key hygiene.</strong> Keys are shown once at creation. Rotate quarterly. Revoke immediately if exposed. Workspace admins can view last-used timestamps in Settings &rarr; API.</div>
      </section>

      <!-- ERRORS -->
      <section class="section" id="errors">
        <h2>Errors</h2>
        <p>Errors return a consistent JSON envelope. The <code class="inline">code</code> field is machine-stable; the <code class="inline">message</code> is human-readable and may change. <code class="inline">request_id</code> is always returned and should be logged — it's the fastest way for support to trace an issue.</p>

        <div class="codeblock" data-copy='{"error":{"code":"tenant.not_found","message":"No tenant matches tnt_missing.","request_id":"req_01HW3X...","param":"id"}}'>
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"error"</span>: {
    <span class="tok-p">"code"</span>: <span class="tok-s">"tenant.not_found"</span>,
    <span class="tok-p">"message"</span>: <span class="tok-s">"No tenant matches tnt_missing."</span>,
    <span class="tok-p">"request_id"</span>: <span class="tok-s">"req_01HW3XQZ8V7A2K1S9ZDYR0B3MN"</span>,
    <span class="tok-p">"param"</span>: <span class="tok-s">"id"</span>,
    <span class="tok-p">"doc_url"</span>: <span class="tok-s">"https://tenantory.com/api-docs#tenants"</span>
  }
}</code></pre>
          </div>
        </div>

        <h3>Status code reference</h3>
        <div class="status-grid">
          <div class="status-card"><div class="status-code ok">200 OK</div><div class="status-desc">Successful GET, PATCH, or DELETE (with body).</div></div>
          <div class="status-card"><div class="status-code ok">201 Created</div><div class="status-desc">Successful POST. Response body contains the new resource.</div></div>
          <div class="status-card"><div class="status-code ok">204 No Content</div><div class="status-desc">Successful DELETE with no response body.</div></div>
          <div class="status-card"><div class="status-code warn">400 Bad Request</div><div class="status-desc">Malformed JSON or invalid parameter. See <code class="inline">param</code>.</div></div>
          <div class="status-card"><div class="status-code warn">401 Unauthorized</div><div class="status-desc">Missing, invalid, or revoked API key.</div></div>
          <div class="status-card"><div class="status-code warn">403 Forbidden</div><div class="status-desc">Key lacks scope, or resource lives in another workspace.</div></div>
          <div class="status-card"><div class="status-code warn">404 Not Found</div><div class="status-desc">Resource id does not exist in this workspace.</div></div>
          <div class="status-card"><div class="status-code warn">409 Conflict</div><div class="status-desc">Idempotency key reused with different body, or unique constraint violated.</div></div>
          <div class="status-card"><div class="status-code warn">422 Unprocessable</div><div class="status-desc">Validation failed. <code class="inline">errors[]</code> lists per-field issues.</div></div>
          <div class="status-card"><div class="status-code warn">429 Too Many Requests</div><div class="status-desc">Rate limit exceeded. Honor <code class="inline">retry-after</code>.</div></div>
          <div class="status-card"><div class="status-code err">500 Server Error</div><div class="status-desc">Unexpected. Retry with backoff; log <code class="inline">request_id</code>.</div></div>
          <div class="status-card"><div class="status-code err">503 Unavailable</div><div class="status-desc">Maintenance or degraded upstream. Retry with backoff.</div></div>
        </div>
      </section>

      <!-- PAGINATION -->
      <section class="section" id="pagination">
        <h2>Pagination</h2>
        <p>List endpoints are <strong>cursor-paginated</strong>. Pass <code class="inline">limit</code> (1–100, default 25) and <code class="inline">cursor</code>. The response includes <code class="inline">next_cursor</code> (null when the page is the last) and <code class="inline">has_more</code>. Cursors are opaque — don't parse them.</p>

        <div class="codeblock" data-copy='GET /v1/tenants?limit=25&cursor=eyJpZCI6InRudF8..."'>
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"object"</span>: <span class="tok-s">"list"</span>,
  <span class="tok-p">"data"</span>: [ <span class="tok-c">/* ...25 resources... */</span> ],
  <span class="tok-p">"has_more"</span>: <span class="tok-k">true</span>,
  <span class="tok-p">"next_cursor"</span>: <span class="tok-s">"eyJpZCI6InRudF8wMUhXMlBRIn0"</span>,
  <span class="tok-p">"total_estimate"</span>: <span class="tok-n">412</span>
}</code></pre>
          </div>
        </div>
      </section>

      <!-- RATE LIMITING -->
      <section class="section" id="rate-limits">
        <h2>Rate limiting</h2>
        <p>Each workspace gets <strong>100 requests/second sustained</strong> with a 200 req burst bucket refilled at 10/s. Per-IP limits also apply for unauthenticated routes. All responses include:</p>
        <ul>
          <li><code class="inline">x-ratelimit-limit</code> — current ceiling (integer, per second)</li>
          <li><code class="inline">x-ratelimit-remaining</code> — requests left in the current window</li>
          <li><code class="inline">x-ratelimit-reset</code> — unix timestamp when the bucket refills</li>
        </ul>
        <p>On 429, honor the <code class="inline">retry-after</code> header (in seconds). Recommended client strategy: exponential backoff with full jitter, base 200ms, cap 8s, max 5 retries. Idempotent operations (GET, PATCH with <code class="inline">x-idempotency-key</code>, DELETE) are safe to retry.</p>

        <div class="codeblock" data-copy="exponential backoff with jitter">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">js</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code><span class="tok-k">async function</span> <span class="tok-f">withBackoff</span>(fn, tries = <span class="tok-n">5</span>) {
  <span class="tok-k">for</span> (<span class="tok-k">let</span> i = <span class="tok-n">0</span>; i &lt; tries; i++) {
    <span class="tok-k">const</span> res = <span class="tok-k">await</span> <span class="tok-f">fn</span>();
    <span class="tok-k">if</span> (res.status !== <span class="tok-n">429</span> &amp;&amp; res.status &lt; <span class="tok-n">500</span>) <span class="tok-k">return</span> res;
    <span class="tok-k">const</span> retry = <span class="tok-f">Number</span>(res.headers.<span class="tok-f">get</span>(<span class="tok-s">"retry-after"</span>)) || <span class="tok-n">0</span>;
    <span class="tok-k">const</span> wait = retry ? retry * <span class="tok-n">1000</span> : <span class="tok-f">Math</span>.<span class="tok-f">min</span>(<span class="tok-n">8000</span>, <span class="tok-n">200</span> * <span class="tok-n">2</span> ** i) * <span class="tok-f">Math</span>.<span class="tok-f">random</span>();
    <span class="tok-k">await</span> <span class="tok-k">new</span> <span class="tok-f">Promise</span>(r =&gt; <span class="tok-f">setTimeout</span>(r, wait));
  }
  <span class="tok-k">throw</span> <span class="tok-k">new</span> <span class="tok-f">Error</span>(<span class="tok-s">"Tenantory: retry budget exhausted"</span>);
}</code></pre>
          </div>
        </div>
      </section>

      <!-- TENANTS -->
      <section class="section" id="tenants">
        <div class="kicker">Resource</div>
        <h2>Tenants</h2>
        <p>A tenant is a person renting one or more units. Tenants are workspace-scoped and can be attached to zero or more leases. IDs are prefixed <code class="inline">tnt_</code>.</p>

        <h3>Object</h3>
        <table class="params">
          <thead><tr><th style="width:26%">Field</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td>Unique id, e.g. <code class="inline">tnt_01HW2PQ...</code></td></tr>
            <tr><td>object</td><td>string</td><td>Always <code class="inline">"tenant"</code>.</td></tr>
            <tr><td>first_name</td><td>string</td><td>Given name.</td></tr>
            <tr><td>last_name</td><td>string</td><td>Family name.</td></tr>
            <tr><td>email</td><td>string</td><td>Unique per workspace.</td></tr>
            <tr><td>phone</td><td>string | null</td><td>E.164 format.</td></tr>
            <tr><td>status</td><td>enum</td><td><code class="inline">applicant</code>, <code class="inline">active</code>, <code class="inline">past</code>, <code class="inline">blocked</code>.</td></tr>
            <tr><td>lease_ids</td><td>string[]</td><td>Active lease ids.</td></tr>
            <tr><td>metadata</td><td>object</td><td>Up to 50 keys, 500 chars each.</td></tr>
            <tr><td>created_at</td><td>timestamp</td><td>ISO-8601.</td></tr>
          </tbody>
        </table>

        <!-- GET list -->
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/tenants</span><span class="endpoint-desc">List tenants in the workspace.</span></div>

        <div class="codeblock" data-copy="multi">
          <div class="code-head">
            <div class="code-tabs">
              <button class="code-tab active" data-lang="curl">curl</button>
              <button class="code-tab" data-lang="js">node</button>
              <button class="code-tab" data-lang="py">python</button>
            </div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
            <div class="lang-pane active" data-lang="curl">
<pre><code><span class="tok-f">curl</span> <span class="tok-s">"https://api.tenantory.com/v1/tenants?status=active&amp;limit=25"</span> \\
  -H <span class="tok-s">"Authorization: Bearer tnt_live_sk_..."</span> \\
  -H <span class="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span></code></pre>
            </div>
            <div class="lang-pane" data-lang="js">
<pre><code><span class="tok-k">import</span> Tenantory <span class="tok-k">from</span> <span class="tok-s">"tenantory"</span>;
<span class="tok-k">const</span> t = <span class="tok-k">new</span> <span class="tok-f">Tenantory</span>({ apiKey: process.env.TENANTORY_KEY, workspace: <span class="tok-s">"wks_9aB2xQ7r1LmZc4"</span> });

<span class="tok-k">const</span> page = <span class="tok-k">await</span> t.tenants.<span class="tok-f">list</span>({ status: <span class="tok-s">"active"</span>, limit: <span class="tok-n">25</span> });
<span class="tok-f">console</span>.<span class="tok-f">log</span>(page.data.length, page.next_cursor);</code></pre>
            </div>
            <div class="lang-pane" data-lang="py">
<pre><code><span class="tok-k">import</span> tenantory
client = tenantory.<span class="tok-f">Client</span>(api_key=os.environ[<span class="tok-s">"TENANTORY_KEY"</span>], workspace=<span class="tok-s">"wks_9aB2xQ7r1LmZc4"</span>)

page = client.tenants.<span class="tok-f">list</span>(status=<span class="tok-s">"active"</span>, limit=<span class="tok-n">25</span>)
<span class="tok-f">print</span>(<span class="tok-f">len</span>(page.data), page.next_cursor)</code></pre>
            </div>
          </div>
        </div>

        <div class="codeblock" data-copy="response">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">200 · json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"object"</span>: <span class="tok-s">"list"</span>,
  <span class="tok-p">"data"</span>: [
    {
      <span class="tok-p">"id"</span>: <span class="tok-s">"tnt_01HW2PQZ8K7A3V6M1R4F9X2S0B"</span>,
      <span class="tok-p">"object"</span>: <span class="tok-s">"tenant"</span>,
      <span class="tok-p">"first_name"</span>: <span class="tok-s">"Marisol"</span>,
      <span class="tok-p">"last_name"</span>: <span class="tok-s">"Ortega"</span>,
      <span class="tok-p">"email"</span>: <span class="tok-s">"marisol@example.com"</span>,
      <span class="tok-p">"phone"</span>: <span class="tok-s">"+12565550137"</span>,
      <span class="tok-p">"status"</span>: <span class="tok-s">"active"</span>,
      <span class="tok-p">"lease_ids"</span>: [<span class="tok-s">"lse_01HW2RABCDV7..."</span>],
      <span class="tok-p">"metadata"</span>: { <span class="tok-p">"source"</span>: <span class="tok-s">"zillow"</span> },
      <span class="tok-p">"created_at"</span>: <span class="tok-s">"2026-02-14T17:22:08Z"</span>
    }
  ],
  <span class="tok-p">"has_more"</span>: <span class="tok-k">true</span>,
  <span class="tok-p">"next_cursor"</span>: <span class="tok-s">"eyJpZCI6InRudF8wMUhXMl..."</span>
}</code></pre>
          </div>
        </div>

        <!-- POST create -->
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/tenants</span><span class="endpoint-desc">Create a tenant.</span></div>

        <table class="params">
          <thead><tr><th style="width:26%">Param</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>first_name <span class="pill req">required</span></td><td>string</td><td>1–80 chars.</td></tr>
            <tr><td>last_name <span class="pill req">required</span></td><td>string</td><td>1–80 chars.</td></tr>
            <tr><td>email <span class="pill req">required</span></td><td>string</td><td>Must be unique within the workspace.</td></tr>
            <tr><td>phone <span class="pill opt">optional</span></td><td>string</td><td>E.164. Enables SMS if SMS is enabled.</td></tr>
            <tr><td>metadata <span class="pill opt">optional</span></td><td>object</td><td>Freeform key/value.</td></tr>
          </tbody>
        </table>

        <div class="codeblock" data-copy="create tenant">
          <div class="code-head">
            <div class="code-tabs">
              <button class="code-tab active" data-lang="curl">curl</button>
              <button class="code-tab" data-lang="js">node</button>
              <button class="code-tab" data-lang="py">python</button>
            </div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
            <div class="lang-pane active" data-lang="curl">
<pre><code><span class="tok-f">curl</span> https://api.tenantory.com/v1/tenants \\
  -H <span class="tok-s">"Authorization: Bearer tnt_live_sk_..."</span> \\
  -H <span class="tok-s">"x-workspace-id: wks_9aB2xQ7r1LmZc4"</span> \\
  -H <span class="tok-s">"x-idempotency-key: c8f9a7e2-4d1b-4f23-9a83-3b6d3c0fa221"</span> \\
  -H <span class="tok-s">"Content-Type: application/json"</span> \\
  -d <span class="tok-s">'{
    "first_name": "Marisol",
    "last_name": "Ortega",
    "email": "marisol@example.com",
    "phone": "+12565550137"
  }'</span></code></pre>
            </div>
            <div class="lang-pane" data-lang="js">
<pre><code><span class="tok-k">const</span> tenant = <span class="tok-k">await</span> t.tenants.<span class="tok-f">create</span>({
  first_name: <span class="tok-s">"Marisol"</span>,
  last_name: <span class="tok-s">"Ortega"</span>,
  email: <span class="tok-s">"marisol@example.com"</span>,
  phone: <span class="tok-s">"+12565550137"</span>
}, { idempotencyKey: <span class="tok-f">crypto</span>.<span class="tok-f">randomUUID</span>() });</code></pre>
            </div>
            <div class="lang-pane" data-lang="py">
<pre><code>tenant = client.tenants.<span class="tok-f">create</span>(
    first_name=<span class="tok-s">"Marisol"</span>,
    last_name=<span class="tok-s">"Ortega"</span>,
    email=<span class="tok-s">"marisol@example.com"</span>,
    phone=<span class="tok-s">"+12565550137"</span>,
    idempotency_key=<span class="tok-f">uuid</span>.<span class="tok-f">uuid4</span>().<span class="tok-f">hex</span>,
)</code></pre>
            </div>
          </div>
        </div>

        <!-- GET id -->
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/tenants/{id}</span><span class="endpoint-desc">Retrieve a tenant.</span></div>
        <!-- PATCH id -->
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/tenants/{id}</span><span class="endpoint-desc">Update. Only supplied fields change.</span></div>
        <!-- DELETE id -->
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/tenants/{id}</span><span class="endpoint-desc">Archive. Sets <code class="inline">status</code> to <code class="inline">past</code>. Idempotent.</span></div>

        <div class="callout"><strong>Note.</strong> Deleting a tenant with an active lease returns <code class="inline">409</code>. Terminate the lease first via <code class="inline">POST /v1/leases/{id}/terminate</code>.</div>
      </section>

      <!-- PROPERTIES -->
      <section class="section" id="properties">
        <h2>Properties</h2>
        <p>A property is a physical building, lot, or complex. Properties contain one or more units. IDs are prefixed <code class="inline">prp_</code>.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/properties</span><span class="endpoint-desc">List properties.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/properties</span><span class="endpoint-desc">Create a property.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/properties/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/properties/{id}</span><span class="endpoint-desc">Update.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/properties/{id}</span><span class="endpoint-desc">Archive. Cascades units (soft).</span></div>

        <table class="params">
          <thead><tr><th style="width:26%">Field</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td><code class="inline">prp_</code> prefix.</td></tr>
            <tr><td>name</td><td>string</td><td>Display name, e.g. <code class="inline">"3026 Turf Ave NW"</code>.</td></tr>
            <tr><td>type</td><td>enum</td><td><code class="inline">sfr</code>, <code class="inline">multifamily</code>, <code class="inline">condo</code>, <code class="inline">townhouse</code>, <code class="inline">coliving</code>, <code class="inline">commercial</code>.</td></tr>
            <tr><td>address</td><td>object</td><td><code class="inline">line1</code>, <code class="inline">line2</code>, <code class="inline">city</code>, <code class="inline">region</code>, <code class="inline">postal_code</code>, <code class="inline">country</code>.</td></tr>
            <tr><td>unit_count</td><td>integer</td><td>Active unit count.</td></tr>
            <tr><td>year_built</td><td>integer | null</td><td>Four-digit year.</td></tr>
            <tr><td>metadata</td><td>object</td><td>Freeform.</td></tr>
          </tbody>
        </table>

        <div class="codeblock" data-copy="property">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">201 · json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"id"</span>: <span class="tok-s">"prp_01HW2NBCD7KZ1F4M6X9R3A0L2P"</span>,
  <span class="tok-p">"object"</span>: <span class="tok-s">"property"</span>,
  <span class="tok-p">"name"</span>: <span class="tok-s">"3026 Turf Ave NW"</span>,
  <span class="tok-p">"type"</span>: <span class="tok-s">"sfr"</span>,
  <span class="tok-p">"address"</span>: {
    <span class="tok-p">"line1"</span>: <span class="tok-s">"3026 Turf Ave NW"</span>,
    <span class="tok-p">"city"</span>: <span class="tok-s">"Huntsville"</span>,
    <span class="tok-p">"region"</span>: <span class="tok-s">"AL"</span>,
    <span class="tok-p">"postal_code"</span>: <span class="tok-s">"35816"</span>,
    <span class="tok-p">"country"</span>: <span class="tok-s">"US"</span>
  },
  <span class="tok-p">"unit_count"</span>: <span class="tok-n">1</span>,
  <span class="tok-p">"year_built"</span>: <span class="tok-n">1968</span>,
  <span class="tok-p">"created_at"</span>: <span class="tok-s">"2026-03-02T12:40:11Z"</span>
}</code></pre>
          </div>
        </div>
      </section>

      <!-- UNITS -->
      <section class="section" id="units">
        <h2>Units</h2>
        <p>A unit is a rentable space inside a property. For SFR, a property typically has one unit. IDs prefixed <code class="inline">unt_</code>.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/units</span><span class="endpoint-desc">List units. Filter by <code class="inline">property_id</code>, <code class="inline">status</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/units</span><span class="endpoint-desc">Create a unit under a property.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/units/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/units/{id}</span><span class="endpoint-desc">Update rent, beds/baths, status.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/units/{id}</span><span class="endpoint-desc">Archive.</span></div>

        <table class="params">
          <thead><tr><th style="width:26%">Field</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>id</td><td>string</td><td><code class="inline">unt_</code> prefix.</td></tr>
            <tr><td>property_id</td><td>string</td><td>Parent property.</td></tr>
            <tr><td>label</td><td>string</td><td>e.g. <code class="inline">"Unit A"</code>, <code class="inline">"2B"</code>.</td></tr>
            <tr><td>beds</td><td>number</td><td>Half-beds allowed (e.g. 2.5).</td></tr>
            <tr><td>baths</td><td>number</td><td>Half-baths allowed.</td></tr>
            <tr><td>sqft</td><td>integer | null</td><td>Square footage.</td></tr>
            <tr><td>market_rent_cents</td><td>integer</td><td>Asking rent, minor units (USD cents).</td></tr>
            <tr><td>status</td><td>enum</td><td><code class="inline">vacant</code>, <code class="inline">occupied</code>, <code class="inline">notice</code>, <code class="inline">offline</code>.</td></tr>
          </tbody>
        </table>
      </section>

      <!-- LEASES -->
      <section class="section" id="leases">
        <h2>Leases</h2>
        <p>A lease ties tenants to a unit for a term, with rent, deposit, and charges. IDs prefixed <code class="inline">lse_</code>.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/leases</span><span class="endpoint-desc">List leases.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/leases</span><span class="endpoint-desc">Draft a lease. Does not send.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/leases/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/leases/{id}</span><span class="endpoke-desc">Update while in <code class="inline">draft</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/leases/{id}/send</span><span class="endpoint-desc">Send for e-signature. Emits <code class="inline">lease.sent</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/leases/{id}/terminate</span><span class="endpoint-desc">End early. Body: <code class="inline">{end_date, reason}</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/leases/{id}</span><span class="endpoint-desc">Only permitted on <code class="inline">draft</code>.</span></div>

        <table class="params">
          <thead><tr><th style="width:26%">Field</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>unit_id <span class="pill req">required</span></td><td>string</td><td>Target unit.</td></tr>
            <tr><td>tenant_ids <span class="pill req">required</span></td><td>string[]</td><td>One or more tenants.</td></tr>
            <tr><td>start_date <span class="pill req">required</span></td><td>date</td><td>Inclusive. Format <code class="inline">YYYY-MM-DD</code>.</td></tr>
            <tr><td>end_date <span class="pill req">required</span></td><td>date</td><td>Inclusive.</td></tr>
            <tr><td>rent_cents <span class="pill req">required</span></td><td>integer</td><td>Monthly rent.</td></tr>
            <tr><td>deposit_cents <span class="pill opt">optional</span></td><td>integer</td><td>Security deposit.</td></tr>
            <tr><td>due_day</td><td>integer</td><td>Day of month rent is due (1–28). Default 1.</td></tr>
            <tr><td>status</td><td>enum</td><td><code class="inline">draft</code>, <code class="inline">sent</code>, <code class="inline">signed</code>, <code class="inline">active</code>, <code class="inline">ended</code>.</td></tr>
          </tbody>
        </table>
      </section>

      <!-- APPLICATIONS -->
      <section class="section" id="applications">
        <h2>Applications</h2>
        <p>Rental applications submitted through the public apply flow or the API. IDs prefixed <code class="inline">app_</code>.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/applications</span><span class="endpoint-desc">List applications.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/applications</span><span class="endpoint-desc">Create one (e.g. from an external lead form).</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/applications/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/applications/{id}/approve</span><span class="endpoint-desc">Approve. Optionally auto-draft a lease.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/applications/{id}/decline</span><span class="endpoint-desc">Decline with reason code.</span></div>
      </section>

      <!-- PAYMENTS -->
      <section class="section" id="payments">
        <h2>Payments</h2>
        <p>Rent collections, late fees, deposits, refunds. IDs prefixed <code class="inline">pay_</code>. Amounts are always in minor units (cents for USD).</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/payments</span><span class="endpoint-desc">List payments. Filter by <code class="inline">lease_id</code>, <code class="inline">status</code>, <code class="inline">created[gte]</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/payments</span><span class="endpoint-desc">Record a manual payment (cash, check) or charge a saved method.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/payments/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/payments/{id}/refund</span><span class="endpoint-desc">Partial or full refund.</span></div>

        <div class="codeblock" data-copy="payment">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">200 · json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"id"</span>: <span class="tok-s">"pay_01HW3CDZ9V2F7A4M0R1S3B6X8K"</span>,
  <span class="tok-p">"object"</span>: <span class="tok-s">"payment"</span>,
  <span class="tok-p">"lease_id"</span>: <span class="tok-s">"lse_01HW2RABCDV7..."</span>,
  <span class="tok-p">"tenant_id"</span>: <span class="tok-s">"tnt_01HW2PQZ8K..."</span>,
  <span class="tok-p">"amount_cents"</span>: <span class="tok-n">145000</span>,
  <span class="tok-p">"currency"</span>: <span class="tok-s">"usd"</span>,
  <span class="tok-p">"method"</span>: <span class="tok-s">"ach"</span>,
  <span class="tok-p">"status"</span>: <span class="tok-s">"succeeded"</span>,
  <span class="tok-p">"category"</span>: <span class="tok-s">"rent"</span>,
  <span class="tok-p">"period"</span>: <span class="tok-s">"2026-04"</span>,
  <span class="tok-p">"processor_fee_cents"</span>: <span class="tok-n">0</span>,
  <span class="tok-p">"processed_at"</span>: <span class="tok-s">"2026-04-01T09:14:27Z"</span>,
  <span class="tok-p">"created_at"</span>: <span class="tok-s">"2026-03-30T23:00:02Z"</span>
}</code></pre>
          </div>
        </div>
      </section>

      <!-- MAINTENANCE -->
      <section class="section" id="maintenance">
        <h2>Maintenance</h2>
        <p>Tickets opened by tenants or staff. IDs prefixed <code class="inline">mnt_</code>.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/maintenance</span><span class="endpoint-desc">List tickets.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/maintenance</span><span class="endpoint-desc">Open a ticket.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/maintenance/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/maintenance/{id}</span><span class="endpoint-desc">Update status, priority, assignee.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/maintenance/{id}/assign</span><span class="endpoint-desc">Assign a vendor. Body: <code class="inline">{vendor_id}</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/maintenance/{id}</span><span class="endpoint-desc">Close ticket. Body: <code class="inline">{resolution}</code>.</span></div>

        <table class="params">
          <thead><tr><th style="width:26%">Field</th><th style="width:18%">Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>unit_id <span class="pill req">required</span></td><td>string</td><td>Unit the issue affects.</td></tr>
            <tr><td>title <span class="pill req">required</span></td><td>string</td><td>Short summary.</td></tr>
            <tr><td>priority</td><td>enum</td><td><code class="inline">low</code>, <code class="inline">normal</code>, <code class="inline">high</code>, <code class="inline">emergency</code>.</td></tr>
            <tr><td>category</td><td>enum</td><td><code class="inline">plumbing</code>, <code class="inline">hvac</code>, <code class="inline">electrical</code>, <code class="inline">appliance</code>, <code class="inline">pest</code>, <code class="inline">other</code>.</td></tr>
            <tr><td>status</td><td>enum</td><td><code class="inline">open</code>, <code class="inline">scheduled</code>, <code class="inline">in_progress</code>, <code class="inline">resolved</code>, <code class="inline">closed</code>.</td></tr>
            <tr><td>photos</td><td>string[]</td><td>Document ids (<code class="inline">doc_</code>).</td></tr>
          </tbody>
        </table>
      </section>

      <!-- VENDORS -->
      <section class="section" id="vendors">
        <h2>Vendors</h2>
        <p>Contractors, handymen, cleaners, inspectors. IDs prefixed <code class="inline">vnd_</code>. Vendors can receive assigned tickets and submit invoices.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/vendors</span><span class="endpoint-desc">List vendors.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/vendors</span><span class="endpoint-desc">Create.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/vendors/{id}</span><span class="endpoint-desc">Retrieve.</span></div>
        <div class="endpoint"><span class="method-badge m-patch">PATCH</span><span class="endpoint-path">/v1/vendors/{id}</span><span class="endpoint-desc">Update.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/vendors/{id}</span><span class="endpoint-desc">Archive. Past invoices retained.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/vendors/{id}/invoices</span><span class="endpoint-desc">Record an invoice against a ticket. Emits <code class="inline">vendor.invoice.submitted</code>.</span></div>
      </section>

      <!-- DOCUMENTS -->
      <section class="section" id="documents">
        <h2>Documents</h2>
        <p>Signed leases, W-9s, inspection photos, receipts. IDs prefixed <code class="inline">doc_</code>. Upload via multipart or presigned URL.</p>

        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/documents</span><span class="endpoint-desc">List. Filter by <code class="inline">owner_type</code>, <code class="inline">owner_id</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-post">POST</span><span class="endpoint-path">/v1/documents</span><span class="endpoint-desc">Begin upload. Returns a presigned URL valid 10 min.</span></div>
        <div class="endpoint"><span class="method-badge m-get">GET</span><span class="endpoint-path">/v1/documents/{id}</span><span class="endpoint-desc">Retrieve metadata. Body includes time-limited <code class="inline">download_url</code>.</span></div>
        <div class="endpoint"><span class="method-badge m-delete">DELETE</span><span class="endpoint-path">/v1/documents/{id}</span><span class="endpoint-desc">Delete. Originals retained 90 days for audit.</span></div>

        <div class="callout"><strong>Max upload size.</strong> 25 MB per file. For bulk imports use the <code class="inline">POST /v1/batches</code> endpoint (Enterprise only).</div>
      </section>

      <!-- WEBHOOKS -->
      <section class="section" id="webhooks">
        <div class="kicker">Events</div>
        <h2>Webhooks catalog</h2>
        <p>Tenantory delivers signed JSON payloads via HTTPS POST to URLs you configure in <strong>Settings &rarr; API &rarr; Webhooks</strong>. Every delivery includes <code class="inline">t-signature</code> and <code class="inline">t-signature-timestamp</code> headers. Failed deliveries retry with exponential backoff for up to 72 hours.</p>

        <div class="webhooks-grid">
          <div class="webhook-card"><div class="webhook-event">tenant.created</div><div class="webhook-desc">A new tenant was added via API, CSV import, or admin UI.</div></div>
          <div class="webhook-card"><div class="webhook-event">lease.signed</div><div class="webhook-desc">All parties have e-signed. Lease moves to <code class="inline">signed</code>.</div></div>
          <div class="webhook-card"><div class="webhook-event">payment.succeeded</div><div class="webhook-desc">Payment settled. Emitted on ACH settlement or card capture.</div></div>
          <div class="webhook-card"><div class="webhook-event">payment.failed</div><div class="webhook-desc">Charge declined, NSF, or ACH return. Payload includes <code class="inline">failure_reason</code>.</div></div>
          <div class="webhook-card"><div class="webhook-event">maintenance.opened</div><div class="webhook-desc">Ticket created. Includes priority, category, unit.</div></div>
          <div class="webhook-card"><div class="webhook-event">application.submitted</div><div class="webhook-desc">Prospect completed the apply flow.</div></div>
          <div class="webhook-card"><div class="webhook-event">application.approved</div><div class="webhook-desc">Application approved. May include auto-drafted <code class="inline">lease_id</code>.</div></div>
          <div class="webhook-card"><div class="webhook-event">application.declined</div><div class="webhook-desc">Application declined with <code class="inline">reason_code</code>.</div></div>
          <div class="webhook-card"><div class="webhook-event">vendor.invoice.submitted</div><div class="webhook-desc">Vendor attached an invoice to a maintenance ticket.</div></div>
        </div>

        <h3>Example payload — <code class="inline">payment.succeeded</code></h3>
        <div class="codeblock" data-copy="webhook payload">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">POST body · json</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code>{
  <span class="tok-p">"id"</span>: <span class="tok-s">"evt_01HW3D4ZK8M7A2V6R1S9B0X3QP"</span>,
  <span class="tok-p">"object"</span>: <span class="tok-s">"event"</span>,
  <span class="tok-p">"type"</span>: <span class="tok-s">"payment.succeeded"</span>,
  <span class="tok-p">"workspace_id"</span>: <span class="tok-s">"wks_9aB2xQ7r1LmZc4"</span>,
  <span class="tok-p">"livemode"</span>: <span class="tok-k">true</span>,
  <span class="tok-p">"created"</span>: <span class="tok-n">1775203467</span>,
  <span class="tok-p">"data"</span>: {
    <span class="tok-p">"object"</span>: {
      <span class="tok-p">"id"</span>: <span class="tok-s">"pay_01HW3CDZ9V2F7A4M0R1S3B6X8K"</span>,
      <span class="tok-p">"object"</span>: <span class="tok-s">"payment"</span>,
      <span class="tok-p">"lease_id"</span>: <span class="tok-s">"lse_01HW2RABCDV7..."</span>,
      <span class="tok-p">"tenant_id"</span>: <span class="tok-s">"tnt_01HW2PQZ8K..."</span>,
      <span class="tok-p">"amount_cents"</span>: <span class="tok-n">145000</span>,
      <span class="tok-p">"currency"</span>: <span class="tok-s">"usd"</span>,
      <span class="tok-p">"method"</span>: <span class="tok-s">"ach"</span>,
      <span class="tok-p">"status"</span>: <span class="tok-s">"succeeded"</span>,
      <span class="tok-p">"category"</span>: <span class="tok-s">"rent"</span>,
      <span class="tok-p">"period"</span>: <span class="tok-s">"2026-04"</span>,
      <span class="tok-p">"processor_fee_cents"</span>: <span class="tok-n">0</span>,
      <span class="tok-p">"processed_at"</span>: <span class="tok-s">"2026-04-01T09:14:27Z"</span>
    }
  }
}</code></pre>
          </div>
        </div>

        <h3>Delivery headers</h3>
        <div class="codeblock" data-copy="headers">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">http</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code><span class="tok-p">POST</span> /hooks/tenantory <span class="tok-p">HTTP</span>/<span class="tok-n">1.1</span>
<span class="tok-p">Host</span>: app.example.com
<span class="tok-p">Content-Type</span>: application/json
<span class="tok-p">User-Agent</span>: Tenantory-Webhooks/1.0
<span class="tok-p">t-signature-timestamp</span>: <span class="tok-n">1775203467</span>
<span class="tok-p">t-signature</span>: v1=9c2a7f3e1b8d0a4c6e5f2a9b1d3c4e7a0f8b2c6d5e4a1b9c3f7e0a2d4b6c8e1a
<span class="tok-p">t-event-id</span>: evt_01HW3D4ZK8M7A2V6R1S9B0X3QP
<span class="tok-p">t-delivery-attempt</span>: <span class="tok-n">1</span></code></pre>
          </div>
        </div>

        <h3 id="webhook-verify">Verifying signatures (Node.js)</h3>
        <p>Signatures are HMAC-SHA256 over <code class="inline">timestamp + "." + raw_body</code>, using the webhook secret shown once at endpoint creation. Reject anything older than 5 minutes and always compare with a constant-time function.</p>

        <div class="codeblock" data-copy="verification">
          <div class="code-head">
            <div class="code-tabs"><button class="code-tab active">node</button></div>
            <button class="code-copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          </div>
          <div class="code-body">
<pre><code><span class="tok-k">import</span> crypto <span class="tok-k">from</span> <span class="tok-s">"node:crypto"</span>;
<span class="tok-k">import</span> express <span class="tok-k">from</span> <span class="tok-s">"express"</span>;

<span class="tok-k">const</span> SECRET = process.env.TENANTORY_WEBHOOK_SECRET;
<span class="tok-k">const</span> app = <span class="tok-f">express</span>();

<span class="tok-c">// IMPORTANT: capture the raw body for HMAC</span>
app.<span class="tok-f">post</span>(<span class="tok-s">"/hooks/tenantory"</span>,
  express.<span class="tok-f">raw</span>({ type: <span class="tok-s">"application/json"</span> }),
  (req, res) =&gt; {
    <span class="tok-k">const</span> ts  = req.headers[<span class="tok-s">"t-signature-timestamp"</span>];
    <span class="tok-k">const</span> sig = <span class="tok-f">String</span>(req.headers[<span class="tok-s">"t-signature"</span>] ?? <span class="tok-s">""</span>);
    <span class="tok-k">const</span> raw = req.body; <span class="tok-c">// Buffer</span>

    <span class="tok-c">// 1. Reject stale timestamps (replay protection)</span>
    <span class="tok-k">if</span> (<span class="tok-f">Math</span>.<span class="tok-f">abs</span>(<span class="tok-f">Date</span>.<span class="tok-f">now</span>() / <span class="tok-n">1000</span> - <span class="tok-f">Number</span>(ts)) &gt; <span class="tok-n">300</span>) {
      <span class="tok-k">return</span> res.<span class="tok-f">status</span>(<span class="tok-n">400</span>).<span class="tok-f">send</span>(<span class="tok-s">"stale"</span>);
    }

    <span class="tok-c">// 2. Compute expected signature</span>
    <span class="tok-k">const</span> expected = crypto
      .<span class="tok-f">createHmac</span>(<span class="tok-s">"sha256"</span>, SECRET)
      .<span class="tok-f">update</span>(\`\${ts}.\${raw.<span class="tok-f">toString</span>(<span class="tok-s">"utf8"</span>)}\`)
      .<span class="tok-f">digest</span>(<span class="tok-s">"hex"</span>);

    <span class="tok-c">// 3. Constant-time compare ("v1=" prefix from the header)</span>
    <span class="tok-k">const</span> received = sig.<span class="tok-f">replace</span>(<span class="tok-s">/^v1=/</span>, <span class="tok-s">""</span>);
    <span class="tok-k">const</span> ok = received.length === expected.length &amp;&amp;
      crypto.<span class="tok-f">timingSafeEqual</span>(<span class="tok-f">Buffer</span>.<span class="tok-f">from</span>(received), <span class="tok-f">Buffer</span>.<span class="tok-f">from</span>(expected));

    <span class="tok-k">if</span> (!ok) <span class="tok-k">return</span> res.<span class="tok-f">status</span>(<span class="tok-n">401</span>).<span class="tok-f">send</span>(<span class="tok-s">"bad signature"</span>);

    <span class="tok-k">const</span> event = <span class="tok-f">JSON</span>.<span class="tok-f">parse</span>(raw.<span class="tok-f">toString</span>(<span class="tok-s">"utf8"</span>));
    <span class="tok-c">// ack fast, process async</span>
    res.<span class="tok-f">status</span>(<span class="tok-n">200</span>).<span class="tok-f">end</span>();
    <span class="tok-f">handle</span>(event).<span class="tok-f">catch</span>(console.error);
  }
);</code></pre>
          </div>
        </div>

        <div class="callout"><strong>Delivery guarantees.</strong> At-least-once. Store <code class="inline">t-event-id</code> and dedupe on the consumer side. A 2xx response within 10s is treated as successful; otherwise we retry.</div>
      </section>

      <!-- OPENAPI -->
      <section class="section" id="openapi">
        <h2>OpenAPI 3.1 and SDKs</h2>
        <p>Our spec is the source of truth. SDKs are generated from it on every release. If a field exists in the spec but not the SDK, file an issue — the SDK is wrong.</p>
        <ul>
          <li><a href="#" style="color:var(--blue); font-weight:600;">OpenAPI 3.1 spec</a> — <code class="inline">openapi.yaml</code>, updated on each release</li>
          <li><a href="#" style="color:var(--blue); font-weight:600;">Postman collection</a> — pre-configured with workspace &amp; bearer env</li>
          <li><a href="#" style="color:var(--blue); font-weight:600;">tenantory-node</a> — <code class="inline">npm i tenantory</code></li>
          <li><a href="#" style="color:var(--blue); font-weight:600;">tenantory-python</a> — <code class="inline">pip install tenantory</code></li>
          <li><a href="#" style="color:var(--blue); font-weight:600;">tenantory-ruby</a> — <code class="inline">gem install tenantory</code></li>
          <li><a href="#" style="color:var(--blue); font-weight:600;">Status page</a> — subscribe to incident updates</li>
        </ul>
      </section>

    </div>
  </section>

  <!-- Ready-to-build callout -->
  <section class="ready">
    <div class="ready-card">
      <div class="ready-text">
        <div class="ready-kicker">Ready to build?</div>
        <h3>The API is included on Scale and Enterprise.</h3>
        <p>Upgrade once and you get a production key, a sandbox key, signed webhooks, and priority engineering support. No metering, no per-call billing.</p>
      </div>
      <div class="ready-actions">
        <a class="btn btn-primary" href="pricing.html#scale">
          Upgrade to Scale
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <a class="btn btn-ghost" href="onboarding.html#settings-api">Open Settings &rarr; API</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="integrations.html">Integrations</a>
      <a href="api-docs.html">API</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  <!-- Toast -->
  <div class="toast" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toastMsg">Copied to clipboard</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
