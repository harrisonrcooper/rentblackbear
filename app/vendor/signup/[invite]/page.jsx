"use client";

// Mock ported from ~/Desktop/tenantory/vendor-signup.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Tenantory Flagship tokens (vendor sees Tenantory brand across workspaces) */\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --gold-bg: rgba(245,166,35,0.12);\n      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --red-bg: rgba(214,69,69,0.1);\n      --orange: #ea8c3a; --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff; --purple-bg: rgba(124,77,255,0.12);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;\n      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;\n      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12);\n      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;\n      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;\n      --border: #ecdbb5; --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000; --navy-dark: #000; --navy-darker: #000;\n      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15);\n      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;\n      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;\n      --border: #2a2a3a; --border-strong: #3a3a4a;\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;\n      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;\n      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1);\n      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;\n      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;\n      --border: #e3e3e6; --border-strong: #c0c0c8;\n    }\n\n    /* ===== Topbar (Tenantory branded — vendor works across workspaces) ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      flex-wrap: wrap; gap: 14px;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 36px; height: 36px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; margin-top: 1px; }\n\n    .tb-right { display: flex; align-items: center; gap: 14px; font-size: 12.5px; color: rgba(255,255,255,0.72); }\n    .tb-right a { color: #fff; font-weight: 600; }\n    .tb-right .tb-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.3); }\n\n    /* ===== Invite banner ===== */\n    .invite-banner {\n      background: var(--blue-pale);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;\n    }\n    .invite-avatar {\n      width: 40px; height: 40px; border-radius: 50%;\n      background: linear-gradient(135deg, #1e6f47, #138a60);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 14px; flex-shrink: 0;\n    }\n    .invite-text { flex: 1; min-width: 280px; }\n    .invite-text strong { color: var(--text); font-weight: 700; }\n    .invite-text-line { font-size: 13.5px; color: var(--text); }\n    .invite-text-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .invite-eta {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 12px; font-weight: 700; color: var(--blue);\n    }\n    .invite-eta svg { width: 13px; height: 13px; }\n\n    /* ===== Shell ===== */\n    .shell { display: grid; grid-template-columns: 300px 1fr; min-height: calc(100vh - 140px); }\n\n    /* ===== Left rail ===== */\n    .rail {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.8);\n      padding: 32px 28px;\n      display: flex; flex-direction: column;\n      position: sticky; top: 0; align-self: start;\n      min-height: calc(100vh - 140px);\n    }\n    .rail-heading { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }\n\n    .rail-steps { display: flex; flex-direction: column; gap: 4px; }\n    .rail-step {\n      display: flex; align-items: center; gap: 12px;\n      padding: 11px 12px; border-radius: 10px;\n      color: rgba(255,255,255,0.55); font-weight: 500; font-size: 13px;\n      transition: all 0.15s ease;\n    }\n    .rail-step-num {\n      width: 24px; height: 24px; border-radius: 50%;\n      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; flex-shrink: 0;\n    }\n    .rail-step-num svg { width: 12px; height: 12px; }\n    .rail-step.done { color: rgba(255,255,255,0.85); }\n    .rail-step.done .rail-step-num {\n      background: var(--green); border-color: var(--green); color: #fff;\n    }\n    .rail-step.active {\n      background: rgba(255,255,255,0.08); color: #fff;\n    }\n    .rail-step.active .rail-step-num {\n      background: var(--pink); border-color: var(--pink); color: #fff;\n      box-shadow: 0 0 0 4px var(--pink-bg);\n    }\n    .rail-step-label { flex: 1; line-height: 1.25; }\n    .rail-step-req { font-size: 9.5px; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }\n\n    .rail-card {\n      margin-top: 28px; padding: 16px;\n      background: rgba(255,255,255,0.05);\n      border: 1px solid rgba(255,255,255,0.08);\n      border-radius: 12px;\n      font-size: 12.5px; color: rgba(255,255,255,0.8); line-height: 1.55;\n    }\n    .rail-card-title { font-weight: 700; color: #fff; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }\n    .rail-card-title svg { width: 14px; height: 14px; color: var(--pink); }\n\n    .rail-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.55); }\n    .rail-footer a { color: rgba(255,255,255,0.85); font-weight: 600; }\n\n    /* ===== Right content ===== */\n    .content { background: var(--surface-alt); display: flex; flex-direction: column; min-height: calc(100vh - 140px); }\n    .content-progress {\n      height: 4px; background: var(--border); position: sticky; top: 0; z-index: 2;\n    }\n    .content-progress-bar {\n      height: 100%; background: linear-gradient(90deg, var(--blue), var(--pink));\n      width: 20%; transition: width 0.35s cubic-bezier(.2,.9,.3,1);\n    }\n\n    .content-body {\n      flex: 1; max-width: 720px; width: 100%;\n      margin: 0 auto; padding: 48px 48px 32px;\n    }\n\n    .step-head { margin-bottom: 28px; }\n    .step-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }\n    .step-title { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; color: var(--text); line-height: 1.15; }\n    .step-desc { font-size: 14.5px; color: var(--text-muted); max-width: 560px; line-height: 1.55; }\n\n    /* Form primitives */\n    .field { margin-bottom: 18px; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .field-label .req { color: var(--pink); margin-left: 2px; }\n    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; line-height: 1.5; }\n    .input-row {\n      display: flex; align-items: center;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); overflow: hidden;\n      transition: border 0.15s ease, box-shadow 0.15s ease;\n    }\n    .input-row:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .input-row input, .input-row select {\n      flex: 1; padding: 12px 14px; border: none; outline: none; background: transparent;\n      font-size: 14px; color: var(--text); min-width: 0;\n    }\n    .input-row-prefix, .input-row-suffix {\n      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;\n      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;\n    }\n    .input-row-prefix { border-right: 1px solid var(--border); }\n    .input-row-suffix { border-left: 1px solid var(--border); }\n\n    select.plain {\n      width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius);\n      background: var(--surface); font-size: 14px; color: var(--text); cursor: pointer;\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px;\n      transition: border 0.15s ease, box-shadow 0.15s ease;\n    }\n    select.plain:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n\n    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }\n\n    /* Radio group tiles */\n    .radio-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }\n    .radio-tile {\n      border: 2px solid var(--border); border-radius: var(--radius);\n      padding: 12px 10px; background: var(--surface); cursor: pointer;\n      transition: all 0.15s ease; text-align: center;\n      font-size: 13px; font-weight: 600; color: var(--text);\n    }\n    .radio-tile:hover { border-color: var(--blue); }\n    .radio-tile.selected { border-color: var(--blue); background: var(--blue-pale); color: var(--blue); }\n\n    .radio-stack { display: flex; flex-direction: column; gap: 8px; }\n    .radio-card {\n      border: 2px solid var(--border); border-radius: var(--radius-lg);\n      padding: 14px 16px; background: var(--surface); cursor: pointer;\n      transition: all 0.15s ease; display: flex; gap: 12px; align-items: flex-start;\n    }\n    .radio-card:hover { border-color: var(--blue); }\n    .radio-card.selected { border-color: var(--blue); background: var(--blue-softer); }\n    .radio-card-dot {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 2px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .radio-card.selected .radio-card-dot { border-color: var(--blue); background: var(--blue); }\n    .radio-card.selected .radio-card-dot::after {\n      content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: #fff;\n    }\n    .radio-card-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }\n    .radio-card-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n\n    /* Drop zone */\n    .drop-zone {\n      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);\n      padding: 26px; text-align: center; cursor: pointer;\n      transition: all 0.15s ease; background: var(--surface-subtle);\n    }\n    .drop-zone:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .drop-zone.filled { border-color: var(--green); background: var(--green-bg); border-style: solid; }\n    .drop-zone svg { width: 32px; height: 32px; color: var(--text-faint); margin: 0 auto 10px; }\n    .drop-zone.filled svg { color: var(--green-dark); }\n    .drop-zone-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 4px; }\n    .drop-zone.filled .drop-zone-title { color: var(--green-dark); }\n    .drop-zone-sub { font-size: 12px; color: var(--text-muted); }\n\n    /* Info callouts */\n    .callout {\n      padding: 14px 16px; border-radius: var(--radius-lg);\n      font-size: 13px; display: flex; align-items: flex-start; gap: 12px;\n      margin-bottom: 18px; line-height: 1.55;\n    }\n    .callout svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }\n    .callout-info { background: var(--blue-pale); color: var(--navy); }\n    .callout-info svg { color: var(--blue); }\n    .callout-ok { background: var(--green-bg); color: var(--green-dark); }\n    .callout-ok svg { color: var(--green); }\n    .callout-warn { background: var(--gold-bg); color: #8a5a10; }\n    .callout-warn svg { color: var(--gold); }\n    .callout strong { font-weight: 700; }\n\n    /* Toggle switch */\n    .toggle-row {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);\n      background: var(--surface);\n    }\n    .toggle-row-text { flex: 1; padding-right: 16px; }\n    .toggle-row-title { font-weight: 700; color: var(--text); font-size: 14px; margin-bottom: 2px; }\n    .toggle-row-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n    .toggle {\n      width: 44px; height: 24px; border-radius: 100px;\n      background: var(--border-strong); cursor: pointer;\n      position: relative; transition: background 0.15s ease; flex-shrink: 0;\n    }\n    .toggle::after {\n      content: \"\"; position: absolute; top: 2px; left: 2px;\n      width: 20px; height: 20px; border-radius: 50%; background: #fff;\n      transition: transform 0.2s cubic-bezier(.2,.9,.3,1);\n      box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n    }\n    .toggle.on { background: var(--blue); }\n    .toggle.on::after { transform: translateX(20px); }\n\n    /* Hours grid */\n    .hours-row {\n      display: grid; grid-template-columns: 120px 1fr 1fr 80px;\n      gap: 10px; align-items: center; margin-bottom: 8px;\n    }\n    .hours-day { font-weight: 600; color: var(--text); font-size: 13px; }\n    .hours-row .input-row { height: 40px; }\n    .hours-row .input-row input { padding: 8px 12px; font-size: 13px; }\n\n    /* Review summary */\n    .review-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px; margin-bottom: 18px;\n    }\n    .review-section { margin-bottom: 18px; }\n    .review-section:last-child { margin-bottom: 0; }\n    .review-section-head {\n      display: flex; align-items: center; justify-content: space-between;\n      margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);\n    }\n    .review-section-title { font-size: 12px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }\n    .review-edit { font-size: 12px; color: var(--blue); font-weight: 600; }\n    .review-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px;\n      font-size: 13px;\n    }\n    .review-item-label { color: var(--text-muted); font-size: 12px; font-weight: 600; }\n    .review-item-val { color: var(--text); font-weight: 600; margin-top: 2px; }\n\n    /* Agreement box */\n    .agreement-box {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px;\n    }\n    .agreement-box h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 10px; }\n    .agreement-list {\n      list-style: none; display: flex; flex-direction: column; gap: 8px;\n      font-size: 13px; color: var(--text-muted); line-height: 1.55;\n    }\n    .agreement-list li { display: flex; gap: 10px; align-items: flex-start; }\n    .agreement-list li::before {\n      content: \"\"; width: 4px; height: 4px; border-radius: 50%;\n      background: var(--text-faint); margin-top: 8px; flex-shrink: 0;\n    }\n    .agreement-list strong { color: var(--text); font-weight: 700; }\n\n    .check-row {\n      display: flex; align-items: flex-start; gap: 12px;\n      padding: 14px 0 4px;\n      font-size: 13px; color: var(--text); line-height: 1.55;\n    }\n    .check-row input[type=\"checkbox\"] {\n      width: 18px; height: 18px; accent-color: var(--blue); cursor: pointer;\n      margin-top: 2px; flex-shrink: 0;\n    }\n    .check-row a { color: var(--blue); font-weight: 600; }\n\n    /* Footer buttons */\n    .step-footer {\n      border-top: 1px solid var(--border);\n      padding: 18px 48px; background: var(--surface);\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 12px; flex-wrap: wrap;\n    }\n    .step-footer-left, .step-footer-right { display: flex; gap: 10px; align-items: center; }\n    .step-footer-note { font-size: 12px; color: var(--text-muted); }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(18,81,173,0.3); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,73,152,0.3); }\n    .btn-pink:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }\n    .btn svg { width: 16px; height: 16px; }\n\n    .step-panel { display: none; }\n    .step-panel.active { display: block; animation: fadeIn 0.32s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n\n    /* ===== Success overlay ===== */\n    .success-overlay {\n      position: fixed; inset: 0;\n      background: linear-gradient(180deg, rgba(20,32,74,0.55) 0%, rgba(20,32,74,0.75) 100%);\n      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n      display: none; align-items: center; justify-content: center;\n      z-index: 100; padding: 24px;\n    }\n    .success-overlay.show { display: flex; animation: fadeIn 0.3s ease; }\n    .success-card {\n      max-width: 720px; width: 100%;\n      background: var(--surface); border-radius: var(--radius-xl);\n      box-shadow: var(--shadow-xl);\n      padding: 48px 48px 36px;\n      animation: popIn 0.45s cubic-bezier(.2,.9,.3,1);\n    }\n    @keyframes popIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }\n    .success-badge {\n      width: 80px; height: 80px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 22px;\n      color: #fff; box-shadow: 0 14px 40px rgba(255,73,152,0.3);\n    }\n    .success-badge svg { width: 38px; height: 38px; }\n    .success-card h2 {\n      font-size: 30px; font-weight: 800; letter-spacing: -0.02em;\n      text-align: center; margin-bottom: 10px;\n    }\n    .success-sub {\n      text-align: center; font-size: 14.5px; color: var(--text-muted);\n      margin-bottom: 28px; max-width: 520px; margin-left: auto; margin-right: auto;\n      line-height: 1.55;\n    }\n    .success-grid {\n      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;\n      margin-bottom: 24px;\n    }\n    .success-tile {\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      padding: 16px; transition: all 0.15s ease;\n      display: flex; flex-direction: column; gap: 8px;\n    }\n    .success-tile:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }\n    .success-tile-icon {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .success-tile-icon svg { width: 18px; height: 18px; }\n    .success-tile-title { font-weight: 700; font-size: 13.5px; color: var(--text); }\n    .success-tile-sub { font-size: 12px; color: var(--text-muted); line-height: 1.45; }\n    .success-cta {\n      display: flex; justify-content: center; padding-top: 4px;\n    }\n    .success-cta .btn { padding: 14px 28px; font-size: 15px; }\n\n    /* Phone hint */\n    .phone-hint {\n      display: inline-flex; align-items: center; gap: 6px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 11px; font-weight: 700; padding: 3px 9px;\n      border-radius: 100px; margin-left: 8px; letter-spacing: 0.04em;\n      text-transform: uppercase;\n    }\n    .phone-hint svg { width: 11px; height: 11px; }\n\n    /* License expiry group */\n    .license-group {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px; margin-top: 14px;\n    }\n    .license-group-title {\n      font-size: 12px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n    }\n\n    @media (max-width: 900px) {\n      .shell { grid-template-columns: 1fr; }\n      .rail { position: relative; min-height: auto; padding: 20px 24px; }\n      .rail-steps { flex-direction: row; overflow-x: auto; gap: 6px; padding-bottom: 4px; }\n      .rail-step-label, .rail-step-req { display: none; }\n      .rail-card { display: none; }\n      .content-body { padding: 32px 24px 24px; }\n      .step-footer { padding: 14px 20px; }\n      .grid-2, .grid-3, .radio-row, .review-grid, .success-grid { grid-template-columns: 1fr; }\n      .hours-row { grid-template-columns: 100px 1fr 1fr; }\n      .hours-row .hours-closed { grid-column: 1 / -1; justify-self: start; }\n      .success-card { padding: 32px 24px 24px; }\n      .topbar { padding: 12px 16px; }\n      .invite-banner { padding: 12px 16px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Tenantory</div>
        <div className="tb-brand-sub">Vendor onboarding</div>
      </div>
    </div>
    <div className="tb-right">
      <span>Already set up?</span>
      <a href="vendor.html">Sign in</a>
      <span className="tb-dot" />
      <a href="mailto:vendors@tenantory.com">vendors@tenantory.com</a>
    </div>
  </header>

  
  <div className="invite-banner">
    <div className="invite-avatar">HC</div>
    <div className="invite-text">
      <div className="invite-text-line"><strong>Harrison Cooper</strong> (Black Bear Rentals) invited you to join Tenantory as a vendor.</div>
      <div className="invite-text-sub">Set up your account below — takes about 4 minutes. Once you're done, Harrison can start assigning jobs.</div>
    </div>
    <div className="invite-eta">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      ~4 minutes
    </div>
  </div>

  <div className="shell">

    
    <aside className="rail">
      <div className="rail-heading">Your setup</div>
      <div className="rail-steps" id="railSteps">
        <div className="rail-step active" data-step="1">
          <div className="rail-step-num">1</div>
          <div className="rail-step-label">Your business<div className="rail-step-req">Required</div></div>
        </div>
        <div className="rail-step" data-step="2">
          <div className="rail-step-num">2</div>
          <div className="rail-step-label">How you charge<div className="rail-step-req">Required</div></div>
        </div>
        <div className="rail-step" data-step="3">
          <div className="rail-step-num">3</div>
          <div className="rail-step-label">Tax info (W-9)<div className="rail-step-req">Required</div></div>
        </div>
        <div className="rail-step" data-step="4">
          <div className="rail-step-num">4</div>
          <div className="rail-step-label">Insurance &amp; license<div className="rail-step-req">Required</div></div>
        </div>
        <div className="rail-step" data-step="5">
          <div className="rail-step-num">5</div>
          <div className="rail-step-label">How to reach you<div className="rail-step-req">Required</div></div>
        </div>
        <div className="rail-step" data-step="6">
          <div className="rail-step-num">6</div>
          <div className="rail-step-label">Review &amp; agree</div>
        </div>
      </div>

      <div className="rail-card">
        <div className="rail-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
          What you get
        </div>
        Free to join. Get paid direct to your bank. No app to learn — you'll get a text when a job comes in, reply to accept.
      </div>

      <div className="rail-footer">
        Stuck on something?<br />
        <a href="mailto:vendors@tenantory.com">vendors@tenantory.com</a><br />
        <a href="tel:18558360000">(855) 836-0000</a>
      </div>
    </aside>

    
    <main className="content">
      <div className="content-progress"><div className="content-progress-bar" id="progressBar" /></div>

      <div className="content-body" id="contentBody">

        
        <section className="step-panel active" data-panel="1">
          <div className="step-head">
            <div className="step-kicker">Step 1 of 6</div>
            <h1 className="step-title">Tell us about your business</h1>
            <p className="step-desc">The basics — who you are on paper, what trade you're in, and how far you'll drive for a job. This info lives on your W-9 and your invoices.</p>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="legalName">Legal business name <span className="req">*</span></label>
            <div className="input-row"><input id="legalName" type="text" placeholder="Joel Ramirez Plumbing LLC" data-required="1" /></div>
            <div className="field-hint">Exactly as it appears on your tax forms. If you're a sole prop, this is your legal name.</div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="dba">DBA <span style={{color: "var(--text-faint)", fontWeight: "500"}}>(if different)</span></label>
            <div className="input-row"><input id="dba" type="text" placeholder="Joel's Plumbing" /></div>
            <div className="field-hint">The name customers know you by. Shown on work orders and invoices.</div>
          </div>

          <div className="field">
            <label className="field-label">Business type <span className="req">*</span></label>
            <div className="radio-row" id="bizTypeRow" data-required="1">
              <div className="radio-tile" data-value="sole">Sole prop</div>
              <div className="radio-tile selected" data-value="llc">LLC</div>
              <div className="radio-tile" data-value="scorp">S-corp</div>
              <div className="radio-tile" data-value="partner">Partnership</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="trade">Primary trade <span className="req">*</span></label>
            <select className="plain" id="trade" data-required="1">
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
            <div className="field-hint">Pick the one you do most. You can add secondary trades in your profile later.</div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label" htmlFor="years">Years in business <span className="req">*</span></label>
              <div className="input-row"><input id="years" type="number" min="0" max="80" placeholder="8" data-required="1" /></div>
            </div>
            <div className="field">
              <label className="field-label">Service area <span className="req">*</span></label>
              <div className="radio-row" id="radiusRow" style={{gridTemplateColumns: "repeat(3,1fr)"}} data-required="1">
                <div className="radio-tile" data-value="10">10 mi</div>
                <div className="radio-tile selected" data-value="25">25 mi</div>
                <div className="radio-tile" data-value="50">50 mi</div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="2">
          <div className="step-head">
            <div className="step-kicker">Step 2 of 6</div>
            <h1 className="step-title">How you charge</h1>
            <p className="step-desc">Your rate card. Operators see this when they request a job, so there are no surprises for either side. You can always adjust on a per-job basis.</p>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label" htmlFor="hourly">Hourly rate <span className="req">*</span></label>
              <div className="input-row">
                <span className="input-row-prefix">$</span>
                <input id="hourly" type="number" min="0" step="5" placeholder="95" data-required="1" />
                <span className="input-row-suffix">/hr</span>
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="afterHours">After-hours rate</label>
              <div className="input-row">
                <span className="input-row-prefix">$</span>
                <input id="afterHours" type="number" min="0" step="5" placeholder="145" />
                <span className="input-row-suffix">/hr</span>
              </div>
              <div className="field-hint">Nights, weekends, urgent calls outside your posted hours.</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="minCall">Minimum service call <span className="req">*</span></label>
            <div className="input-row">
              <span className="input-row-prefix">$</span>
              <input id="minCall" type="number" min="0" step="5" placeholder="85" data-required="1" />
            </div>
            <div className="field-hint">What you charge just to show up, even for a 10-minute fix.</div>
          </div>

          <div className="field">
            <label className="field-label">Payment terms <span className="req">*</span></label>
            <div className="radio-row" id="termsRow" style={{gridTemplateColumns: "repeat(3,1fr)"}} data-required="1">
              <div className="radio-tile" data-value="completion">On completion</div>
              <div className="radio-tile selected" data-value="net15">Net 15</div>
              <div className="radio-tile" data-value="net30">Net 30</div>
            </div>
            <div className="field-hint">When operators owe you money after you submit an invoice. Net 15 is the Tenantory default and what most vendors pick.</div>
          </div>

          <div className="field">
            <label className="field-label">Accept direct ACH payouts? <span className="req">*</span></label>
            <div className="radio-stack" id="achRow" data-required="1">
              <div className="radio-card selected" data-value="yes">
                <div className="radio-card-dot" />
                <div>
                  <div className="radio-card-title">Yes, pay me by ACH</div>
                  <div className="radio-card-sub">Money hits your bank in 1–2 business days after an operator approves your invoice. No paper checks, no "the check is in the mail." We'll collect your bank info after you finish setup.</div>
                </div>
              </div>
              <div className="radio-card" data-value="no">
                <div className="radio-card-dot" />
                <div>
                  <div className="radio-card-title">No, I'll invoice the operator directly</div>
                  <div className="radio-card-sub">You handle billing and collection yourself. Tenantory still tracks the job, but money stays between you and the operator.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="3">
          <div className="step-head">
            <div className="step-kicker">Step 3 of 6</div>
            <h1 className="step-title">Tax info (W-9)</h1>
            <p className="step-desc">We need this to issue your 1099 at year-end. Your EIN or SSN is encrypted and never shown to operators — they only see what you made, not your tax ID.</p>
          </div>

          <div className="callout callout-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <div>Your tax ID is stored encrypted at rest. Only our 1099 system touches it — not support, not operators, not us.</div>
          </div>

          <div className="field">
            <label className="field-label">Tax ID type <span className="req">*</span></label>
            <div className="radio-row" id="taxTypeRow" style={{gridTemplateColumns: "repeat(2,1fr)"}} data-required="1">
              <div className="radio-tile selected" data-value="ein">EIN (business)</div>
              <div className="radio-tile" data-value="ssn">SSN (sole prop)</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="taxId">Tax ID number <span className="req">*</span></label>
            <div className="input-row">
              <span className="input-row-prefix">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <input id="taxId" type="text" placeholder="12-3456789" maxLength="11" data-required="1" autoComplete="off" />
            </div>
            <div className="field-hint">Format: XX-XXXXXXX for EIN, XXX-XX-XXXX for SSN. Input is masked after you blur.</div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="w9Name">Legal name on W-9 <span className="req">*</span></label>
            <div className="input-row"><input id="w9Name" type="text" placeholder="Joel A. Ramirez" data-required="1" /></div>
            <div className="field-hint">Usually the same as your legal business name. If your LLC is a disregarded entity, use your personal name.</div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="mailAddr">Mailing address <span className="req">*</span></label>
            <div className="input-row"><input id="mailAddr" type="text" placeholder="4821 Maple St, Huntsville AL 35801" data-required="1" /></div>
            <div className="field-hint">Where you want your 1099 mailed in January. PO boxes are fine.</div>
          </div>

          <div className="field">
            <label className="field-label">Upload your W-9 <span style={{color: "var(--text-faint)", fontWeight: "500"}}>(optional — we can auto-generate one from the info above)</span></label>
            <div className="drop-zone" id="dropW9">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <div className="drop-zone-title">Drop a W-9 PDF, or click to upload</div>
              <div className="drop-zone-sub">PDF or photo of a paper W-9. Up to 10 MB.</div>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="4">
          <div className="step-head">
            <div className="step-kicker">Step 4 of 6</div>
            <h1 className="step-title">Insurance &amp; license</h1>
            <p className="step-desc">Operators need to see you're covered before they hand you keys to their property. We hold these docs securely and surface them automatically on every job.</p>
          </div>

          <div className="callout callout-ok">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <div><strong>We'll remind you 30 days before each expires.</strong> SMS + email. No lapses, no lost jobs — you just re-upload when you renew.</div>
          </div>

          <div className="field">
            <label className="field-label">General liability insurance <span className="req">*</span></label>
            <div className="drop-zone" id="dropGL">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <div className="drop-zone-title">Drop your COI here, or click to upload</div>
              <div className="drop-zone-sub">Certificate of Insurance. PDF preferred. Most operators need at least $1M/$2M.</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Workers' comp <span style={{color: "var(--text-faint)", fontWeight: "500"}}>(if you have employees)</span></label>
            <div className="drop-zone" id="dropWC">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <div className="drop-zone-title">Drop your workers' comp cert, or click to upload</div>
              <div className="drop-zone-sub">Skip if you're a one-person shop in a state where it's not required.</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Trade license <span className="req">*</span></label>
            <div className="drop-zone" id="dropLic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <div className="drop-zone-title">Drop a copy of your trade license</div>
              <div className="drop-zone-sub">Photo or scan is fine. Must be current.</div>
            </div>

            <div className="license-group">
              <div className="license-group-title">License details</div>
              <div className="grid-3">
                <div className="field" style={{marginBottom: "0"}}>
                  <label className="field-label" htmlFor="licState">State</label>
                  <select className="plain" id="licState">
                    <option>Alabama</option><option>Georgia</option><option>Tennessee</option><option>Mississippi</option><option>Florida</option><option>Other</option>
                  </select>
                </div>
                <div className="field" style={{marginBottom: "0"}}>
                  <label className="field-label" htmlFor="licNum">License #</label>
                  <div className="input-row"><input id="licNum" type="text" placeholder="MP-58421" /></div>
                </div>
                <div className="field" style={{marginBottom: "0"}}>
                  <label className="field-label" htmlFor="licExp">Expires</label>
                  <div className="input-row"><input id="licExp" type="month" value="2027-06" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="step-panel" data-panel="5">
          <div className="step-head">
            <div className="step-kicker">Step 5 of 6</div>
            <h1 className="step-title">How to reach you</h1>
            <p className="step-desc">When a job comes in, how should we ping you? Most vendors pick SMS — it's the fastest way to lock in the work before someone else grabs it.</p>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="mobile">Mobile phone <span className="req">*</span><span className="phone-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              SMS alerts
            </span></label>
            <div className="input-row"><input id="mobile" type="tel" placeholder="(256) 555-0188" data-required="1" /></div>
            <div className="field-hint">We'll text you when a job is assigned. Reply "YES" to accept or "NO" to decline — no app required.</div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="phone2">Secondary phone <span style={{color: "var(--text-faint)", fontWeight: "500"}}>(optional)</span></label>
            <div className="input-row"><input id="phone2" type="tel" placeholder="(256) 555-0147" /></div>
            <div className="field-hint">Shop line, spouse, dispatcher — whoever answers when you can't.</div>
          </div>

          <div className="field">
            <label className="field-label">Preferred notification channel <span className="req">*</span></label>
            <div className="radio-row" id="channelRow" style={{gridTemplateColumns: "repeat(3,1fr)"}} data-required="1">
              <div className="radio-tile selected" data-value="sms">SMS only</div>
              <div className="radio-tile" data-value="email">Email only</div>
              <div className="radio-tile" data-value="both">Both</div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Work hours</label>
            <div className="field-hint" style={{marginTop: "0", marginBottom: "12px"}}>We won't ping you outside these hours unless a job is marked urgent.</div>
            <div id="hoursList">
              <div className="hours-row"><div className="hours-day">Mon – Fri</div>
                <div className="input-row"><input type="time" value="07:00" /></div>
                <div className="input-row"><input type="time" value="18:00" /></div>
                <div />
              </div>
              <div className="hours-row"><div className="hours-day">Saturday</div>
                <div className="input-row"><input type="time" value="08:00" /></div>
                <div className="input-row"><input type="time" value="14:00" /></div>
                <div />
              </div>
              <div className="hours-row"><div className="hours-day">Sunday</div>
                <div className="input-row" style={{opacity: "0.5"}}><input type="time" value="00:00" disabled /></div>
                <div className="input-row" style={{opacity: "0.5"}}><input type="time" value="00:00" disabled /></div>
                <div style={{fontSize: "12px", color: "var(--text-muted)", fontWeight: "600"}}>Closed</div>
              </div>
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-row-text">
              <div className="toggle-row-title">Available for emergency calls</div>
              <div className="toggle-row-sub">Burst pipe, no heat, no hot water — operators pay your after-hours rate. We only ping you if nobody on your tier is available.</div>
            </div>
            <div className="toggle on" id="emergencyToggle" />
          </div>
        </section>

        
        <section className="step-panel" data-panel="6">
          <div className="step-head">
            <div className="step-kicker">Step 6 of 6</div>
            <h1 className="step-title">Review &amp; agree</h1>
            <p className="step-desc">One last look. Fix anything that's wrong, then sign off and we'll flip your account live.</p>
          </div>

          <div className="review-card">
            <div className="review-section">
              <div className="review-section-head">
                <div className="review-section-title">Your business</div>
                <a className="review-edit" href="#">Edit</a>
              </div>
              <div className="review-grid">
                <div><div className="review-item-label">Legal name</div><div className="review-item-val" id="rv-legal">Joel Ramirez Plumbing LLC</div></div>
                <div><div className="review-item-label">DBA</div><div className="review-item-val" id="rv-dba">Joel's Plumbing</div></div>
                <div><div className="review-item-label">Trade</div><div className="review-item-val" id="rv-trade">Plumbing</div></div>
                <div><div className="review-item-label">Service area</div><div className="review-item-val" id="rv-radius">25 mi</div></div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-head">
                <div className="review-section-title">Rates</div>
                <a className="review-edit" href="#">Edit</a>
              </div>
              <div className="review-grid">
                <div><div className="review-item-label">Hourly</div><div className="review-item-val" id="rv-hourly">$95/hr</div></div>
                <div><div className="review-item-label">After-hours</div><div className="review-item-val" id="rv-afterhours">$145/hr</div></div>
                <div><div className="review-item-label">Minimum call</div><div className="review-item-val" id="rv-mincall">$85</div></div>
                <div><div className="review-item-label">Terms</div><div className="review-item-val" id="rv-terms">Net 15, ACH payout</div></div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-head">
                <div className="review-section-title">Tax &amp; docs</div>
                <a className="review-edit" href="#">Edit</a>
              </div>
              <div className="review-grid">
                <div><div className="review-item-label">Tax ID</div><div className="review-item-val" id="rv-taxid">EIN ending ••6789</div></div>
                <div><div className="review-item-label">W-9</div><div className="review-item-val" id="rv-w9">Auto-generated</div></div>
                <div><div className="review-item-label">General liability</div><div className="review-item-val" id="rv-gl">Uploaded</div></div>
                <div><div className="review-item-label">Trade license</div><div className="review-item-val" id="rv-lic">AL · MP-58421 · exp 06/2027</div></div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-head">
                <div className="review-section-title">Contact</div>
                <a className="review-edit" href="#">Edit</a>
              </div>
              <div className="review-grid">
                <div><div className="review-item-label">Mobile</div><div className="review-item-val" id="rv-mobile">(256) 555-0188</div></div>
                <div><div className="review-item-label">Alerts</div><div className="review-item-val" id="rv-channel">SMS</div></div>
                <div><div className="review-item-label">Hours</div><div className="review-item-val">Mon–Fri 7–6, Sat 8–2</div></div>
                <div><div className="review-item-label">Emergency calls</div><div className="review-item-val" id="rv-emerg">Available</div></div>
              </div>
            </div>
          </div>

          <div className="agreement-box">
            <h4>Vendor agreement — the short version</h4>
            <ul className="agreement-list">
              <li><span><strong>1% payment processing fee</strong> is deducted from each ACH payout. Nothing else. No subscription, no monthly charge, no listing fee.</span></li>
              <li><span><strong>30-day notice</strong> to end the relationship — either side, any reason. You keep your data and any outstanding payouts.</span></li>
              <li><span><strong>Disputes</strong> between you and an operator go to binding arbitration (AAA commercial rules). See the full <a href="#">vendor terms</a> and <a href="#">arbitration clause</a>.</span></li>
              <li><span>You're an <strong>independent contractor</strong>. Tenantory doesn't withhold taxes, provide benefits, or direct how you do the work. We just connect you and handle payment.</span></li>
              <li><span>Keep your <strong>insurance and license current</strong>. We'll remind you 30 days out. If docs lapse, jobs pause until you re-upload.</span></li>
            </ul>
          </div>

          <div className="check-row">
            <input type="checkbox" id="agreeCheck" />
            <label htmlFor="agreeCheck">I've read the <a href="#">vendor agreement</a>, I understand the 1% payout fee, and I agree to the <a href="#">arbitration clause</a>. I certify the tax info I've provided is accurate.</label>
          </div>
        </section>

      </div>

      
      <footer className="step-footer" id="stepFooter">
        <div className="step-footer-left">
          <button className="btn btn-ghost" id="backBtn" disabled style={{opacity: "0.5", pointerEvents: "none"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <span className="step-footer-note" id="footerNote">Step 1 of 6</span>
        </div>
        <div className="step-footer-right">
          <button className="btn btn-primary" id="nextBtn">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </footer>
    </main>
  </div>

  
  <div className="success-overlay" id="successOverlay">
    <div className="success-card">
      <div className="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2>You're in, Joel.</h2>
      <p className="success-sub">
        Harrison can now assign jobs to you. Here's what happens next — you'll get a <strong>text</strong> when your first job is assigned. Mark yourself <strong>available</strong> in the app to start getting jobs.
      </p>

      <div className="success-grid">
        <a className="success-tile" href="vendor.html">
          <div className="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
          </div>
          <div>
            <div className="success-tile-title">Open vendor portal</div>
            <div className="success-tile-sub">See jobs, schedule, and payouts in one place.</div>
          </div>
        </a>
        <a className="success-tile" href="vendor.html#schedule">
          <div className="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </div>
          <div>
            <div className="success-tile-title">Set available hours</div>
            <div className="success-tile-sub">Block off time when you're out. Jobs won't ping you.</div>
          </div>
        </a>
        <a className="success-tile" href="#">
          <div className="success-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          </div>
          <div>
            <div className="success-tile-title">Read the vendor guide</div>
            <div className="success-tile-sub">5-min read. How jobs, invoices, and payouts flow.</div>
          </div>
        </a>
      </div>

      <div className="success-cta">
        <a className="btn btn-pink" href="vendor.html">
          Go to vendor portal
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
      </div>
    </div>
  </div>

  


    </>
  );
}
