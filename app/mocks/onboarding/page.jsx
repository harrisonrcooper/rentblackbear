"use client";

// Mock ported verbatim from ~/Desktop/tenantory/onboarding.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text);
      background: var(--surface-alt);
      line-height: 1.5;
      font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    :root {
      --navy: #2F3E83;
      --navy-dark: #1e2a5e;
      --navy-darker: #14204a;
      --blue: #1251AD;
      --blue-bright: #1665D8;
      --blue-pale: #eef3ff;
      --pink: #FF4998;
      --pink-bg: rgba(255,73,152,0.12);
      --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36;
      --text-muted: #5a6478;
      --text-faint: #8a93a5;
      --surface: #ffffff;
      --surface-alt: #f7f9fc;
      --surface-subtle: #fafbfd;
      --border: #e3e8ef;
      --border-strong: #c9d1dd;
      --gold: #f5a623;
      --green: #1ea97c;
      --green-dark: #138a60;
      --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --red-bg: rgba(214,69,69,0.12);
      --orange: #ea8c3a;
      --purple: #7c4dff;
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);
    }

    /* ===== Theme overrides (data-theme switches) ===== */
    [data-theme="hearth"] {
      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;
      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;
      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12); --pink-strong: rgba(30,169,124,0.22);
      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;
      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;
      --border: #ecdbb5; --border-strong: #d4bd87;
    }
    [data-theme="nocturne"] {
      --navy: #000; --navy-dark: #000; --navy-darker: #000;
      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);
      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15); --pink-strong: rgba(255,0,170,0.28);
      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;
      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;
      --border: #2a2a3a; --border-strong: #3a3a4a;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4); --shadow: 0 4px 16px rgba(0,0,0,0.5); --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
    }
    [data-theme="slate"] {
      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;
      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;
      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1); --pink-strong: rgba(44,111,224,0.22);
      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;
      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;
      --border: #e3e3e6; --border-strong: #c0c0c8;
    }

    .shell { display: grid; grid-template-columns: 300px 1fr; min-height: 100vh; }

    /* ===== Left: step rail ===== */
    .rail {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.8);
      padding: 32px 28px;
      display: flex; flex-direction: column;
      position: sticky; top: 0; height: 100vh;
    }
    .rail-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
    .rail-logo {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(18,81,173,0.4);
    }
    .rail-logo svg { width: 20px; height: 20px; color: #fff; }
    .rail-brand-name { font-weight: 800; font-size: 19px; color: #fff; letter-spacing: -0.02em; }
    .rail-brand-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

    .rail-heading { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }

    .rail-steps { display: flex; flex-direction: column; gap: 4px; }
    .rail-step {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 12px; border-radius: 10px;
      color: rgba(255,255,255,0.55); font-weight: 500; font-size: 13px;
      transition: all 0.15s ease;
    }
    .rail-step-num {
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .rail-step-num svg { width: 12px; height: 12px; }
    .rail-step.done { color: rgba(255,255,255,0.85); }
    .rail-step.done .rail-step-num {
      background: var(--green); border-color: var(--green); color: #fff;
    }
    .rail-step.active {
      background: rgba(255,255,255,0.08); color: #fff;
    }
    .rail-step.active .rail-step-num {
      background: var(--pink); border-color: var(--pink); color: #fff;
      box-shadow: 0 0 0 4px var(--pink-bg);
    }
    .rail-step-label { flex: 1; }
    .rail-step-req { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }

    .rail-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.5); }
    .rail-footer a { color: rgba(255,255,255,0.8); font-weight: 600; }

    /* ===== Right: step content ===== */
    .content { background: var(--surface-alt); display: flex; flex-direction: column; min-height: 100vh; }
    .content-progress {
      height: 4px; background: var(--border); position: sticky; top: 0; z-index: 2;
    }
    .content-progress-bar {
      height: 100%; background: linear-gradient(90deg, var(--blue), var(--pink));
      width: 16.6%; transition: width 0.35s cubic-bezier(.2,.9,.3,1);
    }

    .content-body {
      flex: 1; max-width: 720px; width: 100%;
      margin: 0 auto; padding: 56px 48px 32px;
    }

    .step-head { margin-bottom: 32px; }
    .step-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
    .step-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; color: var(--text); }
    .step-desc { font-size: 15px; color: var(--text-muted); max-width: 540px; }

    /* Form primitives */
    .field { margin-bottom: 20px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .input-row {
      display: flex; align-items: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
      transition: border 0.15s ease, box-shadow 0.15s ease;
    }
    .input-row:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .input-row input {
      flex: 1; padding: 12px 14px; border: none; outline: none; background: transparent;
      font-size: 14px; color: var(--text); min-width: 0;
    }
    .input-row-prefix, .input-row-suffix {
      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;
      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;
    }
    .input-row-prefix { border-right: 1px solid var(--border); }
    .input-row-suffix { border-left: 1px solid var(--border); }
    .field-state { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; font-weight: 600; }
    .field-state.ok { color: var(--green-dark); }
    .field-state.bad { color: var(--red); }
    .field-state.check { color: var(--text-muted); }
    .field-state svg { width: 14px; height: 14px; }
    .dot-spin { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--blue); animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    /* Accent color picker (step 2) */
    .accent-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
    .accent-swatch {
      width: 42px; height: 42px; border-radius: 12px; cursor: pointer;
      border: 3px solid transparent; transition: all 0.15s ease;
      position: relative;
    }
    .accent-swatch:hover { transform: translateY(-2px); }
    .accent-swatch.active { border-color: var(--text); box-shadow: 0 0 0 2px var(--surface), 0 4px 12px rgba(0,0,0,0.15); }
    .accent-swatch.active::after {
      content: ""; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center/50% no-repeat;
    }

    /* Logo upload */
    .drop-zone {
      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
      padding: 32px; text-align: center; cursor: pointer;
      transition: all 0.15s ease; background: var(--surface-subtle);
    }
    .drop-zone:hover { border-color: var(--blue); background: var(--blue-pale); }
    .drop-zone svg { width: 36px; height: 36px; color: var(--text-faint); margin: 0 auto 10px; }
    .drop-zone-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 4px; }
    .drop-zone-sub { font-size: 12px; color: var(--text-muted); }

    /* Invite rows (step 5) */
    .invite-row {
      display: grid; grid-template-columns: 1fr 140px 36px;
      gap: 10px; margin-bottom: 10px; align-items: center;
    }
    .invite-row select, .invite-row .input-row { height: 42px; }
    .invite-row select {
      padding: 0 12px; border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--surface); font-size: 13px; color: var(--text); cursor: pointer;
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px;
    }
    .invite-remove {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface-subtle); border: 1px solid var(--border);
      color: var(--text-muted); display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .invite-remove:hover { background: var(--red-bg); border-color: var(--red); color: var(--red); }
    .invite-remove svg { width: 14px; height: 14px; }
    .link-btn { color: var(--blue); font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; }
    .link-btn svg { width: 14px; height: 14px; }

    /* Property type tiles (step 4) */
    .tile-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .tile {
      border: 2px solid var(--border); border-radius: var(--radius-lg);
      padding: 16px; background: var(--surface); cursor: pointer;
      transition: all 0.15s ease; text-align: left;
    }
    .tile:hover { border-color: var(--blue); }
    .tile.selected { border-color: var(--blue); background: var(--blue-pale); }
    .tile-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--blue-pale); color: var(--blue); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
    .tile-icon svg { width: 20px; height: 20px; }
    .tile.selected .tile-icon { background: var(--blue); color: #fff; }
    .tile-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }
    .tile-sub { font-size: 12px; color: var(--text-muted); }

    /* Plan cards (step 6) */
    .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
    .plan {
      border: 2px solid var(--border); border-radius: var(--radius-lg);
      padding: 22px; background: var(--surface); cursor: pointer;
      transition: all 0.15s ease; position: relative;
    }
    .plan:hover { border-color: var(--blue); }
    .plan.selected { border-color: var(--blue); box-shadow: 0 8px 24px rgba(18,81,173,0.12); }
    .plan.recommended { border-color: var(--pink); }
    .plan.recommended.selected { border-color: var(--blue); }
    .plan-ribbon {
      position: absolute; top: -12px; left: 22px;
      background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
      padding: 5px 10px; border-radius: 100px; text-transform: uppercase;
    }
    .plan-name { font-weight: 800; color: var(--text); font-size: 15px; margin-bottom: 10px; }
    .plan-price { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
    .plan-price small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }
    .plan-cap { font-size: 12px; color: var(--text-muted); margin-top: 6px; margin-bottom: 16px; }
    .plan-features { font-size: 12px; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); padding-top: 14px; }
    .plan-features svg { width: 12px; height: 12px; color: var(--green); flex-shrink: 0; }
    .plan-features li { display: flex; align-items: center; gap: 8px; list-style: none; }

    .trial-banner {
      padding: 14px 18px; border-radius: var(--radius-lg);
      background: var(--green-bg); color: var(--green-dark);
      font-size: 13px; display: flex; align-items: flex-start; gap: 12px;
      margin-bottom: 20px;
    }
    .trial-banner svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
    .trial-banner strong { font-weight: 700; }

    /* Footer buttons */
    .step-footer {
      border-top: 1px solid var(--border);
      padding: 20px 48px;
      background: var(--surface);
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px; flex-wrap: wrap;
    }
    .step-footer-left, .step-footer-right { display: flex; gap: 10px; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(18,81,173,0.3); }
    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-text { color: var(--text-muted); font-weight: 500; font-size: 13px; padding: 11px 8px; }
    .btn-text:hover { color: var(--text); }
    .btn svg { width: 16px; height: 16px; }

    /* Step panels */
    .step-panel { display: none; }
    .step-panel.active { display: block; animation: fadeIn 0.35s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

    /* Welcome screen */
    .welcome {
      max-width: 680px; margin: 0 auto; padding: 80px 48px 40px; text-align: center;
    }
    .welcome-badge {
      width: 88px; height: 88px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 28px; box-shadow: 0 14px 40px rgba(255,73,152,0.3);
      color: #fff;
    }
    .welcome-badge svg { width: 44px; height: 44px; }
    .welcome h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 14px; }
    .welcome-sub { font-size: 16px; color: var(--text-muted); margin-bottom: 36px; }
    .welcome-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      text-align: left; margin-bottom: 28px;
    }
    .welcome-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px; display: flex; gap: 14px;
      transition: all 0.15s ease;
    }
    .welcome-card:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }
    .welcome-card-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .welcome-card-icon svg { width: 20px; height: 20px; }
    .welcome-card-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }
    .welcome-card-sub { font-size: 12px; color: var(--text-muted); }

    /* Toast */
    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 100; }
    .toast {
      background: var(--text); color: var(--surface);
      padding: 12px 18px; border-radius: var(--radius);
      font-size: 13px; font-weight: 500;
      box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 10px;
      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);
    }
    .toast svg { width: 16px; height: 16px; color: var(--green); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

    @media (max-width: 900px) {
      .shell { grid-template-columns: 1fr; }
      .rail { position: relative; height: auto; padding: 20px 24px; }
      .rail-steps { flex-direction: row; overflow-x: auto; gap: 6px; }
      .rail-step-label { display: none; }
      .content-body { padding: 32px 24px 24px; }
      .step-footer { padding: 16px 24px; }
      .grid-2, .tile-row, .plan-grid, .welcome-grid { grid-template-columns: 1fr; }
    }`;

const MOCK_HTML = `<div class="shell">

    <!-- Left rail -->
    <aside class="rail">
      <div class="rail-brand">
        <div class="rail-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </div>
        <div>
          <div class="rail-brand-name">Tenantory</div>
          <div class="rail-brand-sub">14-day free trial</div>
        </div>
      </div>

      <div class="rail-heading">Setup</div>
      <div class="rail-steps" id="railSteps">
        <div class="rail-step active" data-step="1">
          <div class="rail-step-num">1</div>
          <div class="rail-step-label">Workspace identity</div>
          <div class="rail-step-req">Req</div>
        </div>
        <div class="rail-step" data-step="2">
          <div class="rail-step-num">2</div>
          <div class="rail-step-label">Brand</div>
        </div>
        <div class="rail-step" data-step="3">
          <div class="rail-step-num">3</div>
          <div class="rail-step-label">Contact info</div>
        </div>
        <div class="rail-step" data-step="4">
          <div class="rail-step-num">4</div>
          <div class="rail-step-label">First property</div>
        </div>
        <div class="rail-step" data-step="5">
          <div class="rail-step-num">5</div>
          <div class="rail-step-label">Invite team</div>
        </div>
        <div class="rail-step" data-step="6">
          <div class="rail-step-num">6</div>
          <div class="rail-step-label">Pick a plan</div>
        </div>
      </div>

      <div class="rail-footer">
        Need a hand? <br><a href="mailto:hello@tenantory.com">hello@tenantory.com</a>
      </div>
    </aside>

    <!-- Right content -->
    <main class="content">
      <div class="content-progress"><div class="content-progress-bar" id="progressBar"></div></div>

      <div class="content-body" id="contentBody">

        <!-- Step 1: Workspace identity -->
        <section class="step-panel active" data-panel="1">
          <div class="step-head">
            <div class="step-kicker">Step 1 of 6</div>
            <h1 class="step-title">Claim your workspace</h1>
            <p class="step-desc">Name your workspace and pick the subdomain your tenants will use to pay rent, submit maintenance requests, and sign leases.</p>
          </div>

          <div class="field">
            <label class="field-label" for="wsName">Workspace name</label>
            <div class="input-row">
              <input id="wsName" type="text" value="Black Bear Rentals" placeholder="Acme Property Management">
            </div>
            <div class="field-hint">This is the name on lease PDFs, rent reminders, and your tenant portal.</div>
          </div>

          <div class="field">
            <label class="field-label" for="wsSlug">Subdomain</label>
            <div class="input-row">
              <input id="wsSlug" type="text" value="blackbear" placeholder="acme" autocomplete="off">
              <span class="input-row-suffix">.tenantory.com</span>
            </div>
            <div class="field-state ok" id="slugState">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>blackbear.tenantory.com is available</span>
            </div>
            <div class="field-hint">3–32 characters. Letters, numbers, and hyphens only. You can move to a custom domain later on Scale.</div>
          </div>
        </section>

        <!-- Step 2: Brand -->
        <section class="step-panel" data-panel="2">
          <div class="step-head">
            <div class="step-kicker">Step 2 of 6 · Optional</div>
            <h1 class="step-title">Make it feel like yours</h1>
            <p class="step-desc">Upload your logo and pick an accent color. Tenants see this on every page, email, and lease.</p>
          </div>

          <div class="field">
            <label class="field-label">Logo</label>
            <div class="drop-zone" id="dropZone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div class="drop-zone-title">Drop a logo here, or click to browse</div>
              <div class="drop-zone-sub">PNG or SVG, up to 2MB. Transparent background looks best.</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Accent color</label>
            <div class="accent-swatches" id="accentSwatches">
              <div class="accent-swatch active" data-color="#1251AD" style="background:#1251AD"></div>
              <div class="accent-swatch" data-color="#FF4998" style="background:#FF4998"></div>
              <div class="accent-swatch" data-color="#1ea97c" style="background:#1ea97c"></div>
              <div class="accent-swatch" data-color="#f5a623" style="background:#f5a623"></div>
              <div class="accent-swatch" data-color="#7c4dff" style="background:#7c4dff"></div>
              <div class="accent-swatch" data-color="#d64545" style="background:#d64545"></div>
              <div class="accent-swatch" data-color="#2a2a2e" style="background:#2a2a2e"></div>
              <div class="accent-swatch" data-color="#ea8c3a" style="background:#ea8c3a"></div>
            </div>
            <div class="field-hint">You can fine-tune the full theme later in Settings → Theme.</div>
          </div>
        </section>

        <!-- Step 3: Contact info -->
        <section class="step-panel" data-panel="3">
          <div class="step-head">
            <div class="step-kicker">Step 3 of 6 · Optional</div>
            <h1 class="step-title">Contact info</h1>
            <p class="step-desc">We use this in lease variables, email footers, and the "contact us" block on your tenant portal.</p>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label">Company name</label>
              <div class="input-row"><input type="text" value="Black Bear Rentals" placeholder="Acme Property Management LLC"></div>
            </div>
            <div class="field">
              <label class="field-label">Phone</label>
              <div class="input-row"><input type="tel" value="(256) 555-0139" placeholder="(555) 123-4567"></div>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Public email</label>
            <div class="input-row"><input type="email" value="hello@rentblackbear.com" placeholder="hello@acme.com"></div>
            <div class="field-hint">Shown on your tenant portal. Separate from your Tenantory login.</div>
          </div>
          <div class="field">
            <label class="field-label">Mailing address</label>
            <div class="input-row"><input type="text" value="908 Lee Dr NW, Huntsville AL 35816" placeholder="Street, City, State, ZIP"></div>
          </div>
        </section>

        <!-- Step 4: First property -->
        <section class="step-panel" data-panel="4">
          <div class="step-head">
            <div class="step-kicker">Step 4 of 6 · Optional</div>
            <h1 class="step-title">Add your first property</h1>
            <p class="step-desc">We'll use this to scaffold the dashboard. Don't worry — you can bulk-import the rest after onboarding.</p>
          </div>

          <div class="field">
            <label class="field-label">Property type</label>
            <div class="tile-row" id="tileRow">
              <div class="tile" data-type="single">
                <div class="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9 12 2l9 7v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/><path d="M9 22V12h6v10"/></svg></div>
                <div class="tile-title">Single family</div>
                <div class="tile-sub">One unit, one lease</div>
              </div>
              <div class="tile selected" data-type="coliving">
                <div class="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg></div>
                <div class="tile-title">Co-living</div>
                <div class="tile-sub">One house, per-room leases</div>
              </div>
              <div class="tile" data-type="multi">
                <div class="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/></svg></div>
                <div class="tile-title">Multi-family</div>
                <div class="tile-sub">Apartment complex</div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Property name</label>
            <div class="input-row"><input type="text" value="908 Lee Drive" placeholder="Maple Court"></div>
          </div>
          <div class="field">
            <label class="field-label">Address</label>
            <div class="input-row"><input type="text" value="908 Lee Dr NW, Huntsville AL 35816" placeholder="Street, City, State, ZIP"></div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label class="field-label">Bedrooms</label>
              <div class="input-row"><input type="number" value="5" min="1" max="20"></div>
              <div class="field-hint">We'll auto-create one room per bedroom.</div>
            </div>
            <div class="field">
              <label class="field-label">Target rent per room</label>
              <div class="input-row">
                <span class="input-row-prefix">$</span>
                <input type="number" value="750" min="100" step="25">
                <span class="input-row-suffix">/mo</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 5: Invite team -->
        <section class="step-panel" data-panel="5">
          <div class="step-head">
            <div class="step-kicker">Step 5 of 6 · Optional</div>
            <h1 class="step-title">Invite your team</h1>
            <p class="step-desc">Co-owners, property managers, maintenance coordinators. Everyone gets their own login with role-based access.</p>
          </div>

          <div id="inviteList">
            <div class="invite-row">
              <div class="input-row"><input type="email" placeholder="teammate@example.com"></div>
              <select><option>Admin</option><option>Manager</option><option>Viewer</option></select>
              <button class="invite-remove" onclick="removeInvite(this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <button class="link-btn" onclick="addInvite()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add another teammate
          </button>
        </section>

        <!-- Step 6: Plan -->
        <section class="step-panel" data-panel="6">
          <div class="step-head">
            <div class="step-kicker">Step 6 of 6</div>
            <h1 class="step-title">Pick your plan</h1>
            <p class="step-desc">Every plan starts with a 14-day free trial. No card required. Cancel in one click. If Tenantory doesn't save you 10 hours in the first 30 paid days, we refund you and send you $100 for your time.</p>
          </div>

          <div class="trial-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div><strong>14-day free trial · no credit card.</strong> You won't be charged until day 15 — and only if you decide to stay.</div>
          </div>

          <div class="plan-grid" id="planGrid">
            <div class="plan" data-plan="starter">
              <div class="plan-name">Starter</div>
              <div class="plan-price">$39<small>/mo</small></div>
              <div class="plan-cap">Up to 5 units</div>
              <ul class="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenant portal</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Online rent</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Generic apply link</li>
              </ul>
            </div>

            <div class="plan recommended selected" data-plan="pro">
              <div class="plan-ribbon">Founders — $99 for life</div>
              <div class="plan-name">Pro</div>
              <div class="plan-price">$99<small>/mo</small></div>
              <div class="plan-cap">Up to 50 units</div>
              <ul class="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Branded subdomain</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>E-sign leases</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Investor reports</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>$3,850 bonus stack</li>
              </ul>
            </div>

            <div class="plan" data-plan="scale">
              <div class="plan-name">Scale</div>
              <div class="plan-price">$299<small>/mo</small></div>
              <div class="plan-cap">Unlimited units</div>
              <ul class="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Custom domain</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Full white-label</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Priority support</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Final welcome -->
        <section class="step-panel" data-panel="done">
          <div class="welcome">
            <div class="welcome-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1>You're in. Welcome to Tenantory.</h1>
            <p class="welcome-sub">Your workspace is live at <strong>blackbear.tenantory.com</strong>. Here's what most operators do next — pick one or jump straight to the dashboard.</p>
            <div class="welcome-grid">
              <a class="welcome-card" href="admin-v2.html">
                <div class="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg></div>
                <div><div class="welcome-card-title">Open dashboard</div><div class="welcome-card-sub">See your rent roll, maintenance queue, and activity feed</div></div>
              </a>
              <a class="welcome-card" href="properties.html">
                <div class="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg></div>
                <div><div class="welcome-card-title">Add more properties</div><div class="welcome-card-sub">Bulk-import from a spreadsheet or add one at a time</div></div>
              </a>
              <a class="welcome-card" href="tenants.html">
                <div class="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <div><div class="welcome-card-title">Invite your first tenant</div><div class="welcome-card-sub">Send them a branded portal link to pay rent</div></div>
              </a>
              <a class="welcome-card" href="portal.html" target="_blank">
                <div class="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/></svg></div>
                <div><div class="welcome-card-title">Preview your tenant portal</div><div class="welcome-card-sub">See what your tenants see at blackbear.tenantory.com — your brand, not ours</div></div>
              </a>
            </div>
            <a class="btn btn-primary" href="admin-v2.html" style="padding:14px 28px;font-size:15px;">
              Go to dashboard
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </section>

      </div>

      <!-- Footer buttons (hidden on welcome) -->
      <footer class="step-footer" id="stepFooter">
        <div class="step-footer-left">
          <button class="btn btn-ghost" id="backBtn" onclick="goBack()" disabled style="opacity:0.5;pointer-events:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
        </div>
        <div class="step-footer-right">
          <button class="btn btn-text" id="skipBtn" onclick="skipStep()" style="display:none;">Skip for now</button>
          <button class="btn btn-primary" id="nextBtn" onclick="goNext()">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </footer>

    </main>
  </div>

  <div class="toast-stack" id="toastStack"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
