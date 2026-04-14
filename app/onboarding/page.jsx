"use client";

// Mock ported from ~/Desktop/tenantory/onboarding.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --purple: #7c4dff;\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;\n      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;\n      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12); --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;\n      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;\n      --border: #ecdbb5; --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000; --navy-dark: #000; --navy-darker: #000;\n      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15); --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;\n      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;\n      --border: #2a2a3a; --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4); --shadow: 0 4px 16px rgba(0,0,0,0.5); --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;\n      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;\n      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1); --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;\n      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;\n      --border: #e3e3e6; --border-strong: #c0c0c8;\n    }\n\n    .shell { display: grid; grid-template-columns: 300px 1fr; min-height: 100vh; }\n\n    /* ===== Left: step rail ===== */\n    .rail {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.8);\n      padding: 32px 28px;\n      display: flex; flex-direction: column;\n      position: sticky; top: 0; height: 100vh;\n    }\n    .rail-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }\n    .rail-logo {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 14px rgba(18,81,173,0.4);\n    }\n    .rail-logo svg { width: 20px; height: 20px; color: #fff; }\n    .rail-brand-name { font-weight: 800; font-size: 19px; color: #fff; letter-spacing: -0.02em; }\n    .rail-brand-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n\n    .rail-heading { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }\n\n    .rail-steps { display: flex; flex-direction: column; gap: 4px; }\n    .rail-step {\n      display: flex; align-items: center; gap: 12px;\n      padding: 11px 12px; border-radius: 10px;\n      color: rgba(255,255,255,0.55); font-weight: 500; font-size: 13px;\n      transition: all 0.15s ease;\n    }\n    .rail-step-num {\n      width: 24px; height: 24px; border-radius: 50%;\n      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; flex-shrink: 0;\n    }\n    .rail-step-num svg { width: 12px; height: 12px; }\n    .rail-step.done { color: rgba(255,255,255,0.85); }\n    .rail-step.done .rail-step-num {\n      background: var(--green); border-color: var(--green); color: #fff;\n    }\n    .rail-step.active {\n      background: rgba(255,255,255,0.08); color: #fff;\n    }\n    .rail-step.active .rail-step-num {\n      background: var(--pink); border-color: var(--pink); color: #fff;\n      box-shadow: 0 0 0 4px var(--pink-bg);\n    }\n    .rail-step-label { flex: 1; }\n    .rail-step-req { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }\n\n    .rail-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.5); }\n    .rail-footer a { color: rgba(255,255,255,0.8); font-weight: 600; }\n\n    /* ===== Right: step content ===== */\n    .content { background: var(--surface-alt); display: flex; flex-direction: column; min-height: 100vh; }\n    .content-progress {\n      height: 4px; background: var(--border); position: sticky; top: 0; z-index: 2;\n    }\n    .content-progress-bar {\n      height: 100%; background: linear-gradient(90deg, var(--blue), var(--pink));\n      width: 16.6%; transition: width 0.35s cubic-bezier(.2,.9,.3,1);\n    }\n\n    .content-body {\n      flex: 1; max-width: 720px; width: 100%;\n      margin: 0 auto; padding: 56px 48px 32px;\n    }\n\n    .step-head { margin-bottom: 32px; }\n    .step-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }\n    .step-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; color: var(--text); }\n    .step-desc { font-size: 15px; color: var(--text-muted); max-width: 540px; }\n\n    /* Form primitives */\n    .field { margin-bottom: 20px; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n    .input-row {\n      display: flex; align-items: center;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); overflow: hidden;\n      transition: border 0.15s ease, box-shadow 0.15s ease;\n    }\n    .input-row:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .input-row input {\n      flex: 1; padding: 12px 14px; border: none; outline: none; background: transparent;\n      font-size: 14px; color: var(--text); min-width: 0;\n    }\n    .input-row-prefix, .input-row-suffix {\n      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;\n      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;\n    }\n    .input-row-prefix { border-right: 1px solid var(--border); }\n    .input-row-suffix { border-left: 1px solid var(--border); }\n    .field-state { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; font-weight: 600; }\n    .field-state.ok { color: var(--green-dark); }\n    .field-state.bad { color: var(--red); }\n    .field-state.check { color: var(--text-muted); }\n    .field-state svg { width: 14px; height: 14px; }\n    .dot-spin { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--blue); animation: spin 0.7s linear infinite; }\n    @keyframes spin { to { transform: rotate(360deg); } }\n\n    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n\n    /* Accent color picker (step 2) */\n    .accent-swatches { display: flex; flex-wrap: wrap; gap: 10px; }\n    .accent-swatch {\n      width: 42px; height: 42px; border-radius: 12px; cursor: pointer;\n      border: 3px solid transparent; transition: all 0.15s ease;\n      position: relative;\n    }\n    .accent-swatch:hover { transform: translateY(-2px); }\n    .accent-swatch.active { border-color: var(--text); box-shadow: 0 0 0 2px var(--surface), 0 4px 12px rgba(0,0,0,0.15); }\n    .accent-swatch.active::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\") center/50% no-repeat;\n    }\n\n    /* Logo upload */\n    .drop-zone {\n      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);\n      padding: 32px; text-align: center; cursor: pointer;\n      transition: all 0.15s ease; background: var(--surface-subtle);\n    }\n    .drop-zone:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .drop-zone svg { width: 36px; height: 36px; color: var(--text-faint); margin: 0 auto 10px; }\n    .drop-zone-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 4px; }\n    .drop-zone-sub { font-size: 12px; color: var(--text-muted); }\n\n    /* Invite rows (step 5) */\n    .invite-row {\n      display: grid; grid-template-columns: 1fr 140px 36px;\n      gap: 10px; margin-bottom: 10px; align-items: center;\n    }\n    .invite-row select, .invite-row .input-row { height: 42px; }\n    .invite-row select {\n      padding: 0 12px; border: 1px solid var(--border); border-radius: var(--radius);\n      background: var(--surface); font-size: 13px; color: var(--text); cursor: pointer;\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px;\n    }\n    .invite-remove {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      color: var(--text-muted); display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .invite-remove:hover { background: var(--red-bg); border-color: var(--red); color: var(--red); }\n    .invite-remove svg { width: 14px; height: 14px; }\n    .link-btn { color: var(--blue); font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; }\n    .link-btn svg { width: 14px; height: 14px; }\n\n    /* Property type tiles (step 4) */\n    .tile-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }\n    .tile {\n      border: 2px solid var(--border); border-radius: var(--radius-lg);\n      padding: 16px; background: var(--surface); cursor: pointer;\n      transition: all 0.15s ease; text-align: left;\n    }\n    .tile:hover { border-color: var(--blue); }\n    .tile.selected { border-color: var(--blue); background: var(--blue-pale); }\n    .tile-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--blue-pale); color: var(--blue); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }\n    .tile-icon svg { width: 20px; height: 20px; }\n    .tile.selected .tile-icon { background: var(--blue); color: #fff; }\n    .tile-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }\n    .tile-sub { font-size: 12px; color: var(--text-muted); }\n\n    /* Plan cards (step 6) */\n    .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }\n    .plan {\n      border: 2px solid var(--border); border-radius: var(--radius-lg);\n      padding: 22px; background: var(--surface); cursor: pointer;\n      transition: all 0.15s ease; position: relative;\n    }\n    .plan:hover { border-color: var(--blue); }\n    .plan.selected { border-color: var(--blue); box-shadow: 0 8px 24px rgba(18,81,173,0.12); }\n    .plan.recommended { border-color: var(--pink); }\n    .plan.recommended.selected { border-color: var(--blue); }\n    .plan-ribbon {\n      position: absolute; top: -12px; left: 22px;\n      background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;\n      padding: 5px 10px; border-radius: 100px; text-transform: uppercase;\n    }\n    .plan-name { font-weight: 800; color: var(--text); font-size: 15px; margin-bottom: 10px; }\n    .plan-price { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }\n    .plan-price small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }\n    .plan-cap { font-size: 12px; color: var(--text-muted); margin-top: 6px; margin-bottom: 16px; }\n    .plan-features { font-size: 12px; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); padding-top: 14px; }\n    .plan-features svg { width: 12px; height: 12px; color: var(--green); flex-shrink: 0; }\n    .plan-features li { display: flex; align-items: center; gap: 8px; list-style: none; }\n\n    .trial-banner {\n      padding: 14px 18px; border-radius: var(--radius-lg);\n      background: var(--green-bg); color: var(--green-dark);\n      font-size: 13px; display: flex; align-items: flex-start; gap: 12px;\n      margin-bottom: 20px;\n    }\n    .trial-banner svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }\n    .trial-banner strong { font-weight: 700; }\n\n    /* Footer buttons */\n    .step-footer {\n      border-top: 1px solid var(--border);\n      padding: 20px 48px;\n      background: var(--surface);\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 12px; flex-wrap: wrap;\n    }\n    .step-footer-left, .step-footer-right { display: flex; gap: 10px; align-items: center; }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(18,81,173,0.3); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-text { color: var(--text-muted); font-weight: 500; font-size: 13px; padding: 11px 8px; }\n    .btn-text:hover { color: var(--text); }\n    .btn svg { width: 16px; height: 16px; }\n\n    /* Step panels */\n    .step-panel { display: none; }\n    .step-panel.active { display: block; animation: fadeIn 0.35s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n\n    /* Welcome screen */\n    .welcome {\n      max-width: 680px; margin: 0 auto; padding: 80px 48px 40px; text-align: center;\n    }\n    .welcome-badge {\n      width: 88px; height: 88px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 28px; box-shadow: 0 14px 40px rgba(255,73,152,0.3);\n      color: #fff;\n    }\n    .welcome-badge svg { width: 44px; height: 44px; }\n    .welcome h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 14px; }\n    .welcome-sub { font-size: 16px; color: var(--text-muted); margin-bottom: 36px; }\n    .welcome-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n      text-align: left; margin-bottom: 28px;\n    }\n    .welcome-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px; display: flex; gap: 14px;\n      transition: all 0.15s ease;\n    }\n    .welcome-card:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }\n    .welcome-card-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .welcome-card-icon svg { width: 20px; height: 20px; }\n    .welcome-card-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }\n    .welcome-card-sub { font-size: 12px; color: var(--text-muted); }\n\n    /* Toast */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 100; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--green); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    @media (max-width: 900px) {\n      .shell { grid-template-columns: 1fr; }\n      .rail { position: relative; height: auto; padding: 20px 24px; }\n      .rail-steps { flex-direction: row; overflow-x: auto; gap: 6px; }\n      .rail-step-label { display: none; }\n      .content-body { padding: 32px 24px 24px; }\n      .step-footer { padding: 16px 24px; }\n      .grid-2, .tile-row, .plan-grid, .welcome-grid { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <div className="shell">

    
    <aside className="rail">
      <div className="rail-brand">
        <div className="rail-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </div>
        <div>
          <div className="rail-brand-name">Tenantory</div>
          <div className="rail-brand-sub">14-day free trial</div>
        </div>
      </div>

      <div className="rail-heading">Setup</div>
      <div className="rail-steps" id="railSteps">
        <div className="rail-step active" data-step="1">
          <div className="rail-step-num">1</div>
          <div className="rail-step-label">Workspace identity</div>
          <div className="rail-step-req">Req</div>
        </div>
        <div className="rail-step" data-step="2">
          <div className="rail-step-num">2</div>
          <div className="rail-step-label">Brand</div>
        </div>
        <div className="rail-step" data-step="3">
          <div className="rail-step-num">3</div>
          <div className="rail-step-label">Contact info</div>
        </div>
        <div className="rail-step" data-step="4">
          <div className="rail-step-num">4</div>
          <div className="rail-step-label">First property</div>
        </div>
        <div className="rail-step" data-step="5">
          <div className="rail-step-num">5</div>
          <div className="rail-step-label">Invite team</div>
        </div>
        <div className="rail-step" data-step="6">
          <div className="rail-step-num">6</div>
          <div className="rail-step-label">Pick a plan</div>
        </div>
      </div>

      <div className="rail-footer">
        Need a hand? <br /><a href="mailto:hello@tenantory.com">hello@tenantory.com</a>
      </div>
    </aside>

    
    <main className="content">
      <div className="content-progress"><div className="content-progress-bar" id="progressBar" /></div>

      <div className="content-body" id="contentBody">

        
        <section className="step-panel active" data-panel="1">
          <div className="step-head">
            <div className="step-kicker">Step 1 of 6</div>
            <h1 className="step-title">Claim your workspace</h1>
            <p className="step-desc">Name your workspace and pick the subdomain your tenants will use to pay rent, submit maintenance requests, and sign leases.</p>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="wsName">Workspace name</label>
            <div className="input-row">
              <input id="wsName" type="text" value="Black Bear Rentals" placeholder="Acme Property Management" />
            </div>
            <div className="field-hint">This is the name on lease PDFs, rent reminders, and your tenant portal.</div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="wsSlug">Subdomain</label>
            <div className="input-row">
              <input id="wsSlug" type="text" value="blackbear" placeholder="acme" autoComplete="off" />
              <span className="input-row-suffix">.tenantory.com</span>
            </div>
            <div className="field-state ok" id="slugState">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span>blackbear.tenantory.com is available</span>
            </div>
            <div className="field-hint">3–32 characters. Letters, numbers, and hyphens only. You can move to a custom domain later on Scale.</div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="2">
          <div className="step-head">
            <div className="step-kicker">Step 2 of 6 · Optional</div>
            <h1 className="step-title">Make it feel like yours</h1>
            <p className="step-desc">Upload your logo and pick an accent color. Tenants see this on every page, email, and lease.</p>
          </div>

          <div className="field">
            <label className="field-label">Logo</label>
            <div className="drop-zone" id="dropZone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <div className="drop-zone-title">Drop a logo here, or click to browse</div>
              <div className="drop-zone-sub">PNG or SVG, up to 2MB. Transparent background looks best.</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Accent color</label>
            <div className="accent-swatches" id="accentSwatches">
              <div className="accent-swatch active" data-color="#1251AD" style={{background: "#1251AD"}} />
              <div className="accent-swatch" data-color="#FF4998" style={{background: "#FF4998"}} />
              <div className="accent-swatch" data-color="#1ea97c" style={{background: "#1ea97c"}} />
              <div className="accent-swatch" data-color="#f5a623" style={{background: "#f5a623"}} />
              <div className="accent-swatch" data-color="#7c4dff" style={{background: "#7c4dff"}} />
              <div className="accent-swatch" data-color="#d64545" style={{background: "#d64545"}} />
              <div className="accent-swatch" data-color="#2a2a2e" style={{background: "#2a2a2e"}} />
              <div className="accent-swatch" data-color="#ea8c3a" style={{background: "#ea8c3a"}} />
            </div>
            <div className="field-hint">You can fine-tune the full theme later in Settings → Theme.</div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="3">
          <div className="step-head">
            <div className="step-kicker">Step 3 of 6 · Optional</div>
            <h1 className="step-title">Contact info</h1>
            <p className="step-desc">We use this in lease variables, email footers, and the "contact us" block on your tenant portal.</p>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label">Company name</label>
              <div className="input-row"><input type="text" value="Black Bear Rentals" placeholder="Acme Property Management LLC" /></div>
            </div>
            <div className="field">
              <label className="field-label">Phone</label>
              <div className="input-row"><input type="tel" value="(256) 555-0139" placeholder="(555) 123-4567" /></div>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Public email</label>
            <div className="input-row"><input type="email" value="hello@rentblackbear.com" placeholder="hello@acme.com" /></div>
            <div className="field-hint">Shown on your tenant portal. Separate from your Tenantory login.</div>
          </div>
          <div className="field">
            <label className="field-label">Mailing address</label>
            <div className="input-row"><input type="text" value="908 Lee Dr NW, Huntsville AL 35816" placeholder="Street, City, State, ZIP" /></div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="4">
          <div className="step-head">
            <div className="step-kicker">Step 4 of 6 · Optional</div>
            <h1 className="step-title">Add your first property</h1>
            <p className="step-desc">We'll use this to scaffold the dashboard. Don't worry — you can bulk-import the rest after onboarding.</p>
          </div>

          <div className="field">
            <label className="field-label">Property type</label>
            <div className="tile-row" id="tileRow">
              <div className="tile" data-type="single">
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 2l9 7v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" /><path d="M9 22V12h6v10" /></svg></div>
                <div className="tile-title">Single family</div>
                <div className="tile-sub">One unit, one lease</div>
              </div>
              <div className="tile selected" data-type="coliving">
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg></div>
                <div className="tile-title">Co-living</div>
                <div className="tile-sub">One house, per-room leases</div>
              </div>
              <div className="tile" data-type="multi">
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="6" x2="9" y2="6" /><line x1="15" y1="6" x2="15" y2="6" /><line x1="9" y1="10" x2="9" y2="10" /><line x1="15" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="9" y2="14" /><line x1="15" y1="14" x2="15" y2="14" /></svg></div>
                <div className="tile-title">Multi-family</div>
                <div className="tile-sub">Apartment complex</div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Property name</label>
            <div className="input-row"><input type="text" value="908 Lee Drive" placeholder="Maple Court" /></div>
          </div>
          <div className="field">
            <label className="field-label">Address</label>
            <div className="input-row"><input type="text" value="908 Lee Dr NW, Huntsville AL 35816" placeholder="Street, City, State, ZIP" /></div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Bedrooms</label>
              <div className="input-row"><input type="number" value="5" min="1" max="20" /></div>
              <div className="field-hint">We'll auto-create one room per bedroom.</div>
            </div>
            <div className="field">
              <label className="field-label">Target rent per room</label>
              <div className="input-row">
                <span className="input-row-prefix">$</span>
                <input type="number" value="750" min="100" step="25" />
                <span className="input-row-suffix">/mo</span>
              </div>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="5">
          <div className="step-head">
            <div className="step-kicker">Step 5 of 6 · Optional</div>
            <h1 className="step-title">Invite your team</h1>
            <p className="step-desc">Co-owners, property managers, maintenance coordinators. Everyone gets their own login with role-based access.</p>
          </div>

          <div id="inviteList">
            <div className="invite-row">
              <div className="input-row"><input type="email" placeholder="teammate@example.com" /></div>
              <select><option>Admin</option><option>Manager</option><option>Viewer</option></select>
              <button className="invite-remove">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>
          <button className="link-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add another teammate
          </button>
        </section>

        
        <section className="step-panel" data-panel="6">
          <div className="step-head">
            <div className="step-kicker">Step 6 of 6</div>
            <h1 className="step-title">Pick your plan</h1>
            <p className="step-desc">Every plan starts with a 14-day free trial. No card required. Cancel in one click. If Tenantory doesn't save you 10 hours in the first 30 paid days, we refund you and send you $100 for your time.</p>
          </div>

          <div className="trial-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <div><strong>14-day free trial · no credit card.</strong> You won't be charged until day 15 — and only if you decide to stay.</div>
          </div>

          <div className="plan-grid" id="planGrid">
            <div className="plan" data-plan="starter">
              <div className="plan-name">Starter</div>
              <div className="plan-price">$39<small>/mo</small></div>
              <div className="plan-cap">Up to 5 units</div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Tenant portal</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Online rent</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Generic apply link</li>
              </ul>
            </div>

            <div className="plan recommended selected" data-plan="pro">
              <div className="plan-ribbon">Founders — $99 for life</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price">$99<small>/mo</small></div>
              <div className="plan-cap">Up to 50 units</div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Branded subdomain</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>E-sign leases</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Investor reports</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>$3,850 bonus stack</li>
              </ul>
            </div>

            <div className="plan" data-plan="scale">
              <div className="plan-name">Scale</div>
              <div className="plan-price">$299<small>/mo</small></div>
              <div className="plan-cap">Unlimited units</div>
              <ul className="plan-features">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Custom domain</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Full white-label</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Priority support</li>
              </ul>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="done">
          <div className="welcome">
            <div className="welcome-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1>You're in. Welcome to Tenantory.</h1>
            <p className="welcome-sub">Your workspace is live at <strong>blackbear.tenantory.com</strong>. Here's what most operators do next — pick one or jump straight to the dashboard.</p>
            <div className="welcome-grid">
              <a className="welcome-card" href="admin-v2.html">
                <div className="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg></div>
                <div><div className="welcome-card-title">Open dashboard</div><div className="welcome-card-sub">See your rent roll, maintenance queue, and activity feed</div></div>
              </a>
              <a className="welcome-card" href="properties.html">
                <div className="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg></div>
                <div><div className="welcome-card-title">Add more properties</div><div className="welcome-card-sub">Bulk-import from a spreadsheet or add one at a time</div></div>
              </a>
              <a className="welcome-card" href="tenants.html">
                <div className="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg></div>
                <div><div className="welcome-card-title">Invite your first tenant</div><div className="welcome-card-sub">Send them a branded portal link to pay rent</div></div>
              </a>
              <a className="welcome-card" href="portal.html" target="_blank">
                <div className="welcome-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" /></svg></div>
                <div><div className="welcome-card-title">Preview your tenant portal</div><div className="welcome-card-sub">See what your tenants see at blackbear.tenantory.com — your brand, not ours</div></div>
              </a>
            </div>
            <a className="btn btn-primary" href="admin-v2.html" style={{padding: "14px 28px", fontSize: "15px"}}>
              Go to dashboard
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
          </div>
        </section>

      </div>

      
      <footer className="step-footer" id="stepFooter">
        <div className="step-footer-left">
          <button className="btn btn-ghost" id="backBtn" disabled style={{opacity: "0.5", pointerEvents: "none"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
        </div>
        <div className="step-footer-right">
          <button className="btn btn-text" id="skipBtn" style={{display: "none"}}>Skip for now</button>
          <button className="btn btn-primary" id="nextBtn">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </footer>

    </main>
  </div>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
