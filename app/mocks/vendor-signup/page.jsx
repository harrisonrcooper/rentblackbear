"use client";

// Mock ported verbatim from ~/Desktop/tenantory/vendor-signup.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;
      min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* Tenantory Flagship tokens (vendor sees Tenantory brand across workspaces) */
    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --gold-bg: rgba(245,166,35,0.12);
      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545; --red-bg: rgba(214,69,69,0.1);
      --orange: #ea8c3a; --orange-bg: rgba(234,140,58,0.12);
      --purple: #7c4dff; --purple-bg: rgba(124,77,255,0.12);
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);
    }
    [data-theme="hearth"] {
      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;
      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;
      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12);
      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;
      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;
      --border: #ecdbb5; --border-strong: #d4bd87;
    }
    [data-theme="nocturne"] {
      --navy: #000; --navy-dark: #000; --navy-darker: #000;
      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);
      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15);
      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;
      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;
      --border: #2a2a3a; --border-strong: #3a3a4a;
    }
    [data-theme="slate"] {
      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;
      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;
      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1);
      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;
      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;
      --border: #e3e3e6; --border-strong: #c0c0c8;
    }

    /* ===== Topbar (Tenantory branded — vendor works across workspaces) ===== */
    .topbar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.9); padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 14px;
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 36px; height: 36px; border-radius: 9px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; margin-top: 1px; }

    .tb-right { display: flex; align-items: center; gap: 14px; font-size: 12.5px; color: rgba(255,255,255,0.72); }
    .tb-right a { color: #fff; font-weight: 600; }
    .tb-right .tb-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.3); }

    /* ===== Invite banner ===== */
    .invite-banner {
      background: var(--blue-pale);
      border-bottom: 1px solid var(--border);
      padding: 14px 32px;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    }
    .invite-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #1e6f47, #138a60);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; flex-shrink: 0;
    }
    .invite-text { flex: 1; min-width: 280px; }
    .invite-text strong { color: var(--text); font-weight: 700; }
    .invite-text-line { font-size: 13.5px; color: var(--text); }
    .invite-text-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .invite-eta {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; font-weight: 700; color: var(--blue);
    }
    .invite-eta svg { width: 13px; height: 13px; }

    /* ===== Shell ===== */
    .shell { display: grid; grid-template-columns: 300px 1fr; min-height: calc(100vh - 140px); }

    /* ===== Left rail ===== */
    .rail {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.8);
      padding: 32px 28px;
      display: flex; flex-direction: column;
      position: sticky; top: 0; align-self: start;
      min-height: calc(100vh - 140px);
    }
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
    .rail-step-label { flex: 1; line-height: 1.25; }
    .rail-step-req { font-size: 9.5px; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }

    .rail-card {
      margin-top: 28px; padding: 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      font-size: 12.5px; color: rgba(255,255,255,0.8); line-height: 1.55;
    }
    .rail-card-title { font-weight: 700; color: #fff; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
    .rail-card-title svg { width: 14px; height: 14px; color: var(--pink); }

    .rail-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.55); }
    .rail-footer a { color: rgba(255,255,255,0.85); font-weight: 600; }

    /* ===== Right content ===== */
    .content { background: var(--surface-alt); display: flex; flex-direction: column; min-height: calc(100vh - 140px); }
    .content-progress {
      height: 4px; background: var(--border); position: sticky; top: 0; z-index: 2;
    }
    .content-progress-bar {
      height: 100%; background: linear-gradient(90deg, var(--blue), var(--pink));
      width: 20%; transition: width 0.35s cubic-bezier(.2,.9,.3,1);
    }

    .content-body {
      flex: 1; max-width: 720px; width: 100%;
      margin: 0 auto; padding: 48px 48px 32px;
    }

    .step-head { margin-bottom: 28px; }
    .step-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
    .step-title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; color: var(--text); line-height: 1.15; }
    .step-desc { font-size: 14.5px; color: var(--text-muted); max-width: 560px; line-height: 1.55; }

    /* Form primitives */
    .field { margin-bottom: 18px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .field-label .req { color: var(--pink); margin-left: 2px; }
    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; line-height: 1.5; }
    .input-row {
      display: flex; align-items: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
      transition: border 0.15s ease, box-shadow 0.15s ease;
    }
    .input-row:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .input-row input, .input-row select {
      flex: 1; padding: 12px 14px; border: none; outline: none; background: transparent;
      font-size: 14px; color: var(--text); min-width: 0;
    }
    .input-row-prefix, .input-row-suffix {
      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;
      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;
    }
    .input-row-prefix { border-right: 1px solid var(--border); }
    .input-row-suffix { border-left: 1px solid var(--border); }

    select.plain {
      width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--surface); font-size: 14px; color: var(--text); cursor: pointer;
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px;
      transition: border 0.15s ease, box-shadow 0.15s ease;
    }
    select.plain:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

    /* Radio group tiles */
    .radio-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .radio-tile {
      border: 2px solid var(--border); border-radius: var(--radius);
      padding: 12px 10px; background: var(--surface); cursor: pointer;
      transition: all 0.15s ease; text-align: center;
      font-size: 13px; font-weight: 600; color: var(--text);
    }
    .radio-tile:hover { border-color: var(--blue); }
    .radio-tile.selected { border-color: var(--blue); background: var(--blue-pale); color: var(--blue); }

    .radio-stack { display: flex; flex-direction: column; gap: 8px; }
    .radio-card {
      border: 2px solid var(--border); border-radius: var(--radius-lg);
      padding: 14px 16px; background: var(--surface); cursor: pointer;
      transition: all 0.15s ease; display: flex; gap: 12px; align-items: flex-start;
    }
    .radio-card:hover { border-color: var(--blue); }
    .radio-card.selected { border-color: var(--blue); background: var(--blue-softer); }
    .radio-card-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 2px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .radio-card.selected .radio-card-dot { border-color: var(--blue); background: var(--blue); }
    .radio-card.selected .radio-card-dot::after {
      content: ""; width: 6px; height: 6px; border-radius: 50%; background: #fff;
    }
    .radio-card-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }
    .radio-card-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

    /* Drop zone */
    .drop-zone {
      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
      padding: 26px; text-align: center; cursor: pointer;
      transition: all 0.15s ease; background: var(--surface-subtle);
    }
    .drop-zone:hover { border-color: var(--blue); background: var(--blue-pale); }
    .drop-zone.filled { border-color: var(--green); background: var(--green-bg); border-style: solid; }
    .drop-zone svg { width: 32px; height: 32px; color: var(--text-faint); margin: 0 auto 10px; }
    .drop-zone.filled svg { color: var(--green-dark); }
    .drop-zone-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 4px; }
    .drop-zone.filled .drop-zone-title { color: var(--green-dark); }
    .drop-zone-sub { font-size: 12px; color: var(--text-muted); }

    /* Info callouts */
    .callout {
      padding: 14px 16px; border-radius: var(--radius-lg);
      font-size: 13px; display: flex; align-items: flex-start; gap: 12px;
      margin-bottom: 18px; line-height: 1.55;
    }
    .callout svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
    .callout-info { background: var(--blue-pale); color: var(--navy); }
    .callout-info svg { color: var(--blue); }
    .callout-ok { background: var(--green-bg); color: var(--green-dark); }
    .callout-ok svg { color: var(--green); }
    .callout-warn { background: var(--gold-bg); color: #8a5a10; }
    .callout-warn svg { color: var(--gold); }
    .callout strong { font-weight: 700; }

    /* Toggle switch */
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface);
    }
    .toggle-row-text { flex: 1; padding-right: 16px; }
    .toggle-row-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }
    .toggle-row-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }
    .toggle {
      width: 44px; height: 24px; border-radius: 100px;
      background: var(--border-strong); cursor: pointer;
      position: relative; transition: background 0.15s ease; flex-shrink: 0;
    }
    .toggle::after {
      content: ""; position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; border-radius: 50%; background: #fff;
      transition: transform 0.2s cubic-bezier(.2,.9,.3,1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle.on { background: var(--blue); }
    .toggle.on::after { transform: translateX(20px); }

    /* Hours grid */
    .hours-row {
      display: grid; grid-template-columns: 120px 1fr 1fr 80px;
      gap: 10px; align-items: center; margin-bottom: 8px;
    }
    .hours-day { font-weight: 600; color: var(--text); font-size: 13px; }
    .hours-row .input-row { height: 40px; }
    .hours-row .input-row input { padding: 8px 12px; font-size: 13px; }

    /* Review summary */
    .review-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px; margin-bottom: 18px;
    }
    .review-section { margin-bottom: 18px; }
    .review-section:last-child { margin-bottom: 0; }
    .review-section-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
    }
    .review-section-title { font-size: 12px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
    .review-edit { font-size: 12px; color: var(--blue); font-weight: 600; }
    .review-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px;
      font-size: 13px;
    }
    .review-item-label { color: var(--text-muted); font-size: 12px; font-weight: 600; }
    .review-item-val { color: var(--text); font-weight: 600; margin-top: 2px; }

    /* Agreement box */
    .agreement-box {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px;
    }
    .agreement-box h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
    .agreement-list {
      list-style: none; display: flex; flex-direction: column; gap: 8px;
      font-size: 13px; color: var(--text-muted); line-height: 1.55;
    }
    .agreement-list li { display: flex; gap: 10px; align-items: flex-start; }
    .agreement-list li::before {
      content: ""; width: 4px; height: 4px; border-radius: 50%;
      background: var(--text-faint); margin-top: 8px; flex-shrink: 0;
    }
    .agreement-list strong { color: var(--text); font-weight: 700; }

    .check-row {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 0 4px;
      font-size: 13px; color: var(--text); line-height: 1.55;
    }
    .check-row input[type="checkbox"] {
      width: 18px; height: 18px; accent-color: var(--blue); cursor: pointer;
      margin-top: 2px; flex-shrink: 0;
    }
    .check-row a { color: var(--blue); font-weight: 600; }

    /* Footer buttons */
    .step-footer {
      border-top: 1px solid var(--border);
      padding: 18px 48px; background: var(--surface);
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px; flex-wrap: wrap;
    }
    .step-footer-left, .step-footer-right { display: flex; gap: 10px; align-items: center; }
    .step-footer-note { font-size: 12px; color: var(--text-muted); }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(18,81,173,0.3); }
    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,73,152,0.3); }
    .btn-pink:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }
    .btn svg { width: 16px; height: 16px; }

    .step-panel { display: none; }
    .step-panel.active { display: block; animation: fadeIn 0.32s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

    /* ===== Success overlay ===== */
    .success-overlay {
      position: fixed; inset: 0;
      background: linear-gradient(180deg, rgba(20,32,74,0.55) 0%, rgba(20,32,74,0.75) 100%);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center;
      z-index: 100; padding: 24px;
    }
    .success-overlay.show { display: flex; animation: fadeIn 0.3s ease; }
    .success-card {
      max-width: 720px; width: 100%;
      background: var(--surface); border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      padding: 48px 48px 36px;
      animation: popIn 0.45s cubic-bezier(.2,.9,.3,1);
    }
    @keyframes popIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
    .success-badge {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 22px;
      color: #fff; box-shadow: 0 14px 40px rgba(255,73,152,0.3);
    }
    .success-badge svg { width: 38px; height: 38px; }
    .success-card h2 {
      font-size: 30px; font-weight: 800; letter-spacing: -0.02em;
      text-align: center; margin-bottom: 10px;
    }
    .success-sub {
      text-align: center; font-size: 14.5px; color: var(--text-muted);
      margin-bottom: 28px; max-width: 520px; margin-left: auto; margin-right: auto;
      line-height: 1.55;
    }
    .success-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
      margin-bottom: 24px;
    }
    .success-tile {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 16px; transition: all 0.15s ease;
      display: flex; flex-direction: column; gap: 8px;
    }
    .success-tile:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }
    .success-tile-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
    }
    .success-tile-icon svg { width: 18px; height: 18px; }
    .success-tile-title { font-weight: 700; font-size: 13.5px; color: var(--text); }
    .success-tile-sub { font-size: 12px; color: var(--text-muted); line-height: 1.45; }
    .success-cta {
      display: flex; justify-content: center; padding-top: 4px;
    }
    .success-cta .btn { padding: 14px 28px; font-size: 15px; }

    /* Phone hint */
    .phone-hint {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 11px; font-weight: 700; padding: 3px 9px;
      border-radius: 100px; margin-left: 8px; letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .phone-hint svg { width: 11px; height: 11px; }

    /* License expiry group */
    .license-group {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px; margin-top: 14px;
    }
    .license-group-title {
      font-size: 12px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
    }

    @media (max-width: 900px) {
      .shell { grid-template-columns: 1fr; }
      .rail { position: relative; min-height: auto; padding: 20px 24px; }
      .rail-steps { flex-direction: row; overflow-x: auto; gap: 6px; padding-bottom: 4px; }
      .rail-step-label, .rail-step-req { display: none; }
      .rail-card { display: none; }
      .content-body { padding: 32px 24px 24px; }
      .step-footer { padding: 14px 20px; }
      .grid-2, .grid-3, .radio-row, .review-grid, .success-grid { grid-template-columns: 1fr; }
      .hours-row { grid-template-columns: 100px 1fr 1fr; }
      .hours-row .hours-closed { grid-column: 1 / -1; justify-self: start; }
      .success-card { padding: 32px 24px 24px; }
      .topbar { padding: 12px 16px; }
      .invite-banner { padding: 12px 16px; }
    }`;

const MOCK_HTML = `<!-- ===== Topbar ===== -->
  <header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Tenantory</div>
        <div class="tb-brand-sub">Vendor onboarding</div>
      </div>
    </div>
    <div class="tb-right">
      <span>Already set up?</span>
      <a href="vendor.html">Sign in</a>
      <span class="tb-dot"></span>
      <a href="mailto:vendors@tenantory.com">vendors@tenantory.com</a>
    </div>
  </header>

  <!-- ===== Invite banner ===== -->
  <div class="invite-banner">
    <div class="invite-avatar">HC</div>
    <div class="invite-text">
      <div class="invite-text-line"><strong>Harrison Cooper</strong> (Black Bear Rentals) invited you to join Tenantory as a vendor.</div>
      <div class="invite-text-sub">Set up your account below — takes about 4 minutes. Once you're done, Harrison can start assigning jobs.</div>
    </div>
    <div class="invite-eta">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ~4 minutes
    </div>
  </div>

  <div class="shell">

    <!-- ===== Left rail ===== -->
    <aside class="rail">
      <div class="rail-heading">Your setup</div>
      <div class="rail-steps" id="railSteps">
        <div class="rail-step active" data-step="1">
          <div class="rail-step-num">1</div>
          <div class="rail-step-label">Your business<div class="rail-step-req">Required</div></div>
        </div>
        <div class="rail-step" data-step="2">
          <div class="rail-step-num">2</div>
          <div class="rail-step-label">How you charge<div class="rail-step-req">Required</div></div>
        </div>
        <div class="rail-step" data-step="3">
          <div class="rail-step-num">3</div>
          <div class="rail-step-label">Tax info (W-9)<div class="rail-step-req">Required</div></div>
        </div>
        <div class="rail-step" data-step="4">
          <div class="rail-step-num">4</div>
          <div class="rail-step-label">Insurance &amp; license<div class="rail-step-req">Required</div></div>
        </div>
        <div class="rail-step" data-step="5">
          <div class="rail-step-num">5</div>
          <div class="rail-step-label">How to reach you<div class="rail-step-req">Required</div></div>
        </div>
        <div class="rail-step" data-step="6">
          <div class="rail-step-num">6</div>
          <div class="rail-step-label">Review &amp; agree</div>
        </div>
      </div>

      <div class="rail-card">
        <div class="rail-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          What you get
        </div>
        Free to join. Get paid direct to your bank. No app to learn — you'll get a text when a job comes in, reply to accept.
      </div>

      <div class="rail-footer">
        Stuck on something?<br>
        <a href="mailto:vendors@tenantory.com">vendors@tenantory.com</a><br>
        <a href="tel:18558360000">(855) 836-0000</a>
      </div>
    </aside>

    <!-- ===== Right content ===== -->
    <main class="content">
      <div class="content-progress"><div class="content-progress-bar" id="progressBar"></div></div>

      <div class="content-body" id="contentBody">

        <!-- ============ STEP 1 ============ -->
        <section class="step-panel active" data-panel="1">
          <div class="step-head">
            <div class="step-kicker">Step 1 of 6</div>
            <h1 class="step-title">Tell us about your business</h1>
            <p class="step-desc">The basics — who you are on paper, what trade you're in, and how far you'll drive for a job. This info lives on your W-9 and your invoices.</p>
          </div>

          <div class="field">
            <label class="field-label" for="legalName">Legal business name <span class="req">*</span></label>
            <div class="input-row"><input id="legalName" type="text" placeholder="Joel Ramirez Plumbing LLC" data-required="1"></div>
            <div class="field-hint">Exactly as it appears on your tax forms. If you're a sole prop, this is your legal name.</div>
          </div>

          <div class="field">
            <label class="field-label" for="dba">DBA <span style="color:var(--text-faint);font-weight:500;">(if different)</span></label>
            <div class="input-row"><input id="dba" type="text" placeholder="Joel's Plumbing"></div>
            <div class="field-hint">The name customers know you by. Shown on work orders and invoices.</div>
          </div>

          <div class="field">
            <label class="field-label">Business type <span class="req">*</span></label>
            <div class="radio-row" id="bizTypeRow" data-required="1">
              <div class="radio-tile" data-value="sole">Sole prop</div>
              <div class="radio-tile selected" data-value="llc">LLC</div>
              <div class="radio-tile" data-value="scorp">S-corp</div>
              <div class="radio-tile" data-value="partner">Partnership</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="trade">Primary trade <span class="req">*</span></label>
            <select class="plain" id="trade" data-required="1">
              <option value="">Choose your trade…</option>
              <option>Plumbing</option>
              <option>HVAC</option>
              <option>Electrical</option>
              <option>Landscaping</option>
              <option>Handyman / general</option>
              <option>Pest control</option>
              <option>Roofing</option>
              <option>Painting</option>
              <option>Appliance repair</option>
              <option>Other</option>
            </select>
            <div class="field-hint">Pick the one you do most. You can add secondary trades in your profile later.</div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="years">Years in business <span class="req">*</span></label>
              <div class="input-row"><input id="years" type="number" min="0" max="80" placeholder="8" data-required="1"></div>
            </div>
            <div class="field">
              <label class="field-label">Service area <span class="req">*</span></label>
              <div class="radio-row" id="radiusRow" style="grid-template-columns: repeat(3,1fr);" data-required="1">
                <div class="radio-tile" data-value="10">10 mi</div>
                <div class="radio-tile selected" data-value="25">25 mi</div>
                <div class="radio-tile" data-value="50">50 mi</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ STEP 2 ============ -->
        <section class="step-panel" data-panel="2">
          <div class="step-head">
            <div class="step-kicker">Step 2 of 6</div>
            <h1 class="step-title">How you charge</h1>
            <p class="step-desc">Your rate card. Operators see this when they request a job, so there are no surprises for either side. You can always adjust on a per-job basis.</p>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="hourly">Hourly rate <span class="req">*</span></label>
              <div class="input-row">
                <span class="input-row-prefix">$</span>
                <input id="hourly" type="number" min="0" step="5" placeholder="95" data-required="1">
                <span class="input-row-suffix">/hr</span>
              </div>
            </div>
            <div class="field">
              <label class="field-label" for="afterHours">After-hours rate</label>
              <div class="input-row">
                <span class="input-row-prefix">$</span>
                <input id="afterHours" type="number" min="0" step="5" placeholder="145">
                <span class="input-row-suffix">/hr</span>
              </div>
              <div class="field-hint">Nights, weekends, urgent calls outside your posted hours.</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="minCall">Minimum service call <span class="req">*</span></label>
            <div class="input-row">
              <span class="input-row-prefix">$</span>
              <input id="minCall" type="number" min="0" step="5" placeholder="85" data-required="1">
            </div>
            <div class="field-hint">What you charge just to show up, even for a 10-minute fix.</div>
          </div>

          <div class="field">
            <label class="field-label">Payment terms <span class="req">*</span></label>
            <div class="radio-row" id="termsRow" style="grid-template-columns: repeat(3,1fr);" data-required="1">
              <div class="radio-tile" data-value="completion">On completion</div>
              <div class="radio-tile selected" data-value="net15">Net 15</div>
              <div class="radio-tile" data-value="net30">Net 30</div>
            </div>
            <div class="field-hint">When operators owe you money after you submit an invoice. Net 15 is the Tenantory default and what most vendors pick.</div>
          </div>

          <div class="field">
            <label class="field-label">Accept direct ACH payouts? <span class="req">*</span></label>
            <div class="radio-stack" id="achRow" data-required="1">
              <div class="radio-card selected" data-value="yes">
                <div class="radio-card-dot"></div>
                <div>
                  <div class="radio-card-title">Yes, pay me by ACH</div>
                  <div class="radio-card-sub">Money hits your bank in 1–2 business days after an operator approves your invoice. No paper checks, no "the check is in the mail." We'll collect your bank info after you finish setup.</div>
                </div>
              </div>
              <div class="radio-card" data-value="no">
                <div class="radio-card-dot"></div>
                <div>
                  <div class="radio-card-title">No, I'll invoice the operator directly</div>
                  <div class="radio-card-sub">You handle billing and collection yourself. Tenantory still tracks the job, but money stays between you and the operator.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ STEP 3 ============ -->
        <section class="step-panel" data-panel="3">
          <div class="step-head">
            <div class="step-kicker">Step 3 of 6</div>
            <h1 class="step-title">Tax info (W-9)</h1>
            <p class="step-desc">We need this to issue your 1099 at year-end. Your EIN or SSN is encrypted and never shown to operators — they only see what you made, not your tax ID.</p>
          </div>

          <div class="callout callout-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div>Your tax ID is stored encrypted at rest. Only our 1099 system touches it — not support, not operators, not us.</div>
          </div>

          <div class="field">
            <label class="field-label">Tax ID type <span class="req">*</span></label>
            <div class="radio-row" id="taxTypeRow" style="grid-template-columns: repeat(2,1fr);" data-required="1">
              <div class="radio-tile selected" data-value="ein">EIN (business)</div>
              <div class="radio-tile" data-value="ssn">SSN (sole prop)</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="taxId">Tax ID number <span class="req">*</span></label>
            <div class="input-row">
              <span class="input-row-prefix">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input id="taxId" type="text" placeholder="12-3456789" maxlength="11" data-required="1" autocomplete="off">
            </div>
            <div class="field-hint">Format: XX-XXXXXXX for EIN, XXX-XX-XXXX for SSN. Input is masked after you blur.</div>
          </div>

          <div class="field">
            <label class="field-label" for="w9Name">Legal name on W-9 <span class="req">*</span></label>
            <div class="input-row"><input id="w9Name" type="text" placeholder="Joel A. Ramirez" data-required="1"></div>
            <div class="field-hint">Usually the same as your legal business name. If your LLC is a disregarded entity, use your personal name.</div>
          </div>

          <div class="field">
            <label class="field-label" for="mailAddr">Mailing address <span class="req">*</span></label>
            <div class="input-row"><input id="mailAddr" type="text" placeholder="4821 Maple St, Huntsville AL 35801" data-required="1"></div>
            <div class="field-hint">Where you want your 1099 mailed in January. PO boxes are fine.</div>
          </div>

          <div class="field">
            <label class="field-label">Upload your W-9 <span style="color:var(--text-faint);font-weight:500;">(optional — we can auto-generate one from the info above)</span></label>
            <div class="drop-zone" id="dropW9" onclick="fillDrop(this, 'W9-Joel-Ramirez.pdf')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div class="drop-zone-title">Drop a W-9 PDF, or click to upload</div>
              <div class="drop-zone-sub">PDF or photo of a paper W-9. Up to 10 MB.</div>
            </div>
          </div>
        </section>

        <!-- ============ STEP 4 ============ -->
        <section class="step-panel" data-panel="4">
          <div class="step-head">
            <div class="step-kicker">Step 4 of 6</div>
            <h1 class="step-title">Insurance &amp; license</h1>
            <p class="step-desc">Operators need to see you're covered before they hand you keys to their property. We hold these docs securely and surface them automatically on every job.</p>
          </div>

          <div class="callout callout-ok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div><strong>We'll remind you 30 days before each expires.</strong> SMS + email. No lapses, no lost jobs — you just re-upload when you renew.</div>
          </div>

          <div class="field">
            <label class="field-label">General liability insurance <span class="req">*</span></label>
            <div class="drop-zone" id="dropGL" onclick="fillDrop(this, 'COI-General-Liability-2026.pdf')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div class="drop-zone-title">Drop your COI here, or click to upload</div>
              <div class="drop-zone-sub">Certificate of Insurance. PDF preferred. Most operators need at least $1M/$2M.</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Workers' comp <span style="color:var(--text-faint);font-weight:500;">(if you have employees)</span></label>
            <div class="drop-zone" id="dropWC" onclick="fillDrop(this, 'Workers-Comp-Certificate.pdf')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <div class="drop-zone-title">Drop your workers' comp cert, or click to upload</div>
              <div class="drop-zone-sub">Skip if you're a one-person shop in a state where it's not required.</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Trade license <span class="req">*</span></label>
            <div class="drop-zone" id="dropLic" onclick="fillDrop(this, 'AL-Plumbing-License.pdf')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div class="drop-zone-title">Drop a copy of your trade license</div>
              <div class="drop-zone-sub">Photo or scan is fine. Must be current.</div>
            </div>

            <div class="license-group">
              <div class="license-group-title">License details</div>
              <div class="grid-3">
                <div class="field" style="margin-bottom:0;">
                  <label class="field-label" for="licState">State</label>
                  <select class="plain" id="licState">
                    <option>Alabama</option><option>Georgia</option><option>Tennessee</option><option>Mississippi</option><option>Florida</option><option>Other</option>
                  </select>
                </div>
                <div class="field" style="margin-bottom:0;">
                  <label class="field-label" for="licNum">License #</label>
                  <div class="input-row"><input id="licNum" type="text" placeholder="MP-58421"></div>
                </div>
                <div class="field" style="margin-bottom:0;">
                  <label class="field-label" for="licExp">Expires</label>
                  <div class="input-row"><input id="licExp" type="month" value="2027-06"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ STEP 5 ============ -->
        <section class="step-panel" data-panel="5">
          <div class="step-head">
            <div class="step-kicker">Step 5 of 6</div>
            <h1 class="step-title">How to reach you</h1>
            <p class="step-desc">When a job comes in, how should we ping you? Most vendors pick SMS — it's the fastest way to lock in the work before someone else grabs it.</p>
          </div>

          <div class="field">
            <label class="field-label" for="mobile">Mobile phone <span class="req">*</span><span class="phone-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              SMS alerts
            </span></label>
            <div class="input-row"><input id="mobile" type="tel" placeholder="(256) 555-0188" data-required="1"></div>
            <div class="field-hint">We'll text you when a job is assigned. Reply "YES" to accept or "NO" to decline — no app required.</div>
          </div>

          <div class="field">
            <label class="field-label" for="phone2">Secondary phone <span style="color:var(--text-faint);font-weight:500;">(optional)</span></label>
            <div class="input-row"><input id="phone2" type="tel" placeholder="(256) 555-0147"></div>
            <div class="field-hint">Shop line, spouse, dispatcher — whoever answers when you can't.</div>
          </div>

          <div class="field">
            <label class="field-label">Preferred notification channel <span class="req">*</span></label>
            <div class="radio-row" id="channelRow" style="grid-template-columns: repeat(3,1fr);" data-required="1">
              <div class="radio-tile selected" data-value="sms">SMS only</div>
              <div class="radio-tile" data-value="email">Email only</div>
              <div class="radio-tile" data-value="both">Both</div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Work hours</label>
            <div class="field-hint" style="margin-top:0;margin-bottom:12px;">We won't ping you outside these hours unless a job is marked urgent.</div>
            <div id="hoursList">
              <div class="hours-row"><div class="hours-day">Mon – Fri</div>
                <div class="input-row"><input type="time" value="07:00"></div>
                <div class="input-row"><input type="time" value="18:00"></div>
                <div></div>
              </div>
              <div class="hours-row"><div class="hours-day">Saturday</div>
                <div class="input-row"><input type="time" value="08:00"></div>
                <div class="input-row"><input type="time" value="14:00"></div>
                <div></div>
              </div>
              <div class="hours-row"><div class="hours-day">Sunday</div>
                <div class="input-row" style="opacity:0.5;"><input type="time" value="00:00" disabled></div>
                <div class="input-row" style="opacity:0.5;"><input type="time" value="00:00" disabled></div>
                <div style="font-size:12px;color:var(--text-muted);font-weight:600;">Closed</div>
              </div>
            </div>
          </div>

          <div class="toggle-row">
            <div class="toggle-row-text">
              <div class="toggle-row-title">Available for emergency calls</div>
              <div class="toggle-row-sub">Burst pipe, no heat, no hot water — operators pay your after-hours rate. We only ping you if nobody on your tier is available.</div>
            </div>
            <div class="toggle on" id="emergencyToggle" onclick="this.classList.toggle('on')"></div>
          </div>
        </section>

        <!-- ============ STEP 6 ============ -->
        <section class="step-panel" data-panel="6">
          <div class="step-head">
            <div class="step-kicker">Step 6 of 6</div>
            <h1 class="step-title">Review &amp; agree</h1>
            <p class="step-desc">One last look. Fix anything that's wrong, then sign off and we'll flip your account live.</p>
          </div>

          <div class="review-card">
            <div class="review-section">
              <div class="review-section-head">
                <div class="review-section-title">Your business</div>
                <a class="review-edit" href="#" onclick="goStep(1);return false;">Edit</a>
              </div>
              <div class="review-grid">
                <div><div class="review-item-label">Legal name</div><div class="review-item-val" id="rv-legal">Joel Ramirez Plumbing LLC</div></div>
                <div><div class="review-item-label">DBA</div><div class="review-item-val" id="rv-dba">Joel's Plumbing</div></div>
                <div><div class="review-item-label">Trade</div><div class="review-item-val" id="rv-trade">Plumbing</div></div>
                <div><div class="review-item-label">Service area</div><div class="review-item-val" id="rv-radius">25 mi</div></div>
              </div>
            </div>

            <div class="review-section">
              <div class="review-section-head">
                <div class="review-section-title">Rates</div>
                <a class="review-edit" href="#" onclick="goStep(2);return false;">Edit</a>
              </div>
              <div class="review-grid">
                <div><div class="review-item-label">Hourly</div><div class="review-item-val" id="rv-hourly">$95/hr</div></div>
                <div><div class="review-item-label">After-hours</div><div class="review-item-val" id="rv-afterhours">$145/hr</div></div>
                <div><div class="review-item-label">Minimum call</div><div class="review-item-val" id="rv-mincall">$85</div></div>
                <div><div class="review-item-label">Terms</div><div class="review-item-val" id="rv-terms">Net 15, ACH payout</div></div>
              </div>
            </div>

            <div class="review-section">
              <div class="review-section-head">
                <div class="review-section-title">Tax &amp; docs</div>
                <a class="review-edit" href="#" onclick="goStep(3);return false;">Edit</a>
              </div>
              <div class="review-grid">
                <div><div class="review-item-label">Tax ID</div><div class="review-item-val" id="rv-taxid">EIN ending ••6789</div></div>
                <div><div class="review-item-label">W-9</div><div class="review-item-val" id="rv-w9">Auto-generated</div></div>
                <div><div class="review-item-label">General liability</div><div class="review-item-val" id="rv-gl">Uploaded</div></div>
                <div><div class="review-item-label">Trade license</div><div class="review-item-val" id="rv-lic">AL · MP-58421 · exp 06/2027</div></div>
              </div>
            </div>

            <div class="review-section">
              <div class="review-section-head">
                <div class="review-section-title">Contact</div>
                <a class="review-edit" href="#" onclick="goStep(5);return false;">Edit</a>
              </div>
              <div class="review-grid">
                <div><div class="review-item-label">Mobile</div><div class="review-item-val" id="rv-mobile">(256) 555-0188</div></div>
                <div><div class="review-item-label">Alerts</div><div class="review-item-val" id="rv-channel">SMS</div></div>
                <div><div class="review-item-label">Hours</div><div class="review-item-val">Mon–Fri 7–6, Sat 8–2</div></div>
                <div><div class="review-item-label">Emergency calls</div><div class="review-item-val" id="rv-emerg">Available</div></div>
              </div>
            </div>
          </div>

          <div class="agreement-box">
            <h4>Vendor agreement — the short version</h4>
            <ul class="agreement-list">
              <li><span><strong>1% payment processing fee</strong> is deducted from each ACH payout. Nothing else. No subscription, no monthly charge, no listing fee.</span></li>
              <li><span><strong>30-day notice</strong> to end the relationship — either side, any reason. You keep your data and any outstanding payouts.</span></li>
              <li><span><strong>Disputes</strong> between you and an operator go to binding arbitration (AAA commercial rules). See the full <a href="#">vendor terms</a> and <a href="#">arbitration clause</a>.</span></li>
              <li><span>You're an <strong>independent contractor</strong>. Tenantory doesn't withhold taxes, provide benefits, or direct how you do the work. We just connect you and handle payment.</span></li>
              <li><span>Keep your <strong>insurance and license current</strong>. We'll remind you 30 days out. If docs lapse, jobs pause until you re-upload.</span></li>
            </ul>
          </div>

          <div class="check-row">
            <input type="checkbox" id="agreeCheck" onchange="updateFinalBtn()">
            <label for="agreeCheck">I've read the <a href="#">vendor agreement</a>, I understand the 1% payout fee, and I agree to the <a href="#">arbitration clause</a>. I certify the tax info I've provided is accurate.</label>
          </div>
        </section>

      </div>

      <!-- Footer buttons -->
      <footer class="step-footer" id="stepFooter">
        <div class="step-footer-left">
          <button class="btn btn-ghost" id="backBtn" onclick="goBack()" disabled style="opacity:0.5;pointer-events:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span class="step-footer-note" id="footerNote">Step 1 of 6</span>
        </div>
        <div class="step-footer-right">
          <button class="btn btn-primary" id="nextBtn" onclick="goNext()">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </footer>
    </main>
  </div>

  <!-- ===== Success overlay ===== -->
  <div class="success-overlay" id="successOverlay">
    <div class="success-card">
      <div class="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2>You're in, Joel.</h2>
      <p class="success-sub">
        Harrison can now assign jobs to you. Here's what happens next — you'll get a <strong>text</strong> when your first job is assigned. Mark yourself <strong>available</strong> in the app to start getting jobs.
      </p>

      <div class="success-grid">
        <a class="success-tile" href="vendor.html">
          <div class="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
          </div>
          <div>
            <div class="success-tile-title">Open vendor portal</div>
            <div class="success-tile-sub">See jobs, schedule, and payouts in one place.</div>
          </div>
        </a>
        <a class="success-tile" href="vendor.html#schedule">
          <div class="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div class="success-tile-title">Set available hours</div>
            <div class="success-tile-sub">Block off time when you're out. Jobs won't ping you.</div>
          </div>
        </a>
        <a class="success-tile" href="#">
          <div class="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div>
            <div class="success-tile-title">Read the vendor guide</div>
            <div class="success-tile-sub">5-min read. How jobs, invoices, and payouts flow.</div>
          </div>
        </a>
      </div>

      <div class="success-cta">
        <a class="btn btn-pink" href="vendor.html">
          Go to vendor portal
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
