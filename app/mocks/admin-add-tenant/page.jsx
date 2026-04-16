"use client";

// Mock ported from ~/Desktop/blackbear/admin-add-tenant.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (copied from admin-v2) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease; position: relative;\n    }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    /* Topbar */\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n\n    .content { flex: 1; overflow-y: auto; padding: 28px 32px 60px; }\n\n    /* Page breadcrumb link row (inside content) */\n    .page-crumbs {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n      margin-bottom: 12px;\n    }\n    .page-crumbs a { color: var(--blue); font-weight: 600; }\n    .page-crumbs a:hover { color: var(--navy); }\n    .page-crumbs svg { width: 12px; height: 12px; opacity: 0.5; }\n    .page-crumbs strong { color: var(--text); font-weight: 600; }\n\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 20px; flex-wrap: wrap;\n    }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 6px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    /* Buttons */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn-lg { padding: 12px 24px; font-size: 14px; }\n    .btn svg { width: 14px; height: 14px; }\n    .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }\n\n    /* Warning callout */\n    .callout {\n      background: linear-gradient(90deg, rgba(234,140,58,0.07), rgba(234,140,58,0.02));\n      border: 1px solid rgba(234,140,58,0.35);\n      border-left: 3px solid var(--orange);\n      border-radius: var(--radius-lg);\n      padding: 16px 18px;\n      display: flex; align-items: flex-start; gap: 14px;\n      margin-bottom: 24px;\n    }\n    .callout-icon {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: var(--orange-bg); color: var(--orange);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .callout-icon svg { width: 18px; height: 18px; }\n    .callout-body { flex: 1; }\n    .callout-body strong { color: var(--text); font-weight: 700; font-size: 13px; display: block; margin-bottom: 2px; }\n    .callout-body p { color: var(--text-muted); font-size: 13px; }\n    .callout-body a { color: var(--blue); font-weight: 600; }\n    .callout-body a:hover { color: var(--navy); text-decoration: underline; }\n\n    /* ===== Wizard layout ===== */\n    .wizard {\n      display: grid; grid-template-columns: 280px 1fr;\n      gap: 24px; align-items: flex-start;\n    }\n\n    .stepper {\n      position: sticky; top: 0;\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 20px;\n    }\n    .stepper-title {\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em;\n      margin-bottom: 14px;\n    }\n    .step {\n      display: flex; gap: 12px; padding: 12px;\n      border-radius: 10px;\n      cursor: pointer; transition: all 0.15s ease;\n      position: relative;\n    }\n    .step + .step::before {\n      content: \"\"; position: absolute;\n      left: 27px; top: -6px; height: 12px;\n      width: 2px; background: var(--border);\n    }\n    .step.done + .step::before { background: var(--green); }\n    .step:hover { background: var(--surface-alt); }\n    .step.active { background: var(--blue-pale); }\n    .step-num {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: var(--surface-alt);\n      border: 1.5px solid var(--border);\n      color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 12px; font-weight: 700; flex-shrink: 0;\n      transition: all 0.15s ease;\n    }\n    .step.active .step-num {\n      background: var(--blue); border-color: var(--blue); color: #fff;\n      box-shadow: 0 0 0 4px var(--blue-pale);\n    }\n    .step.done .step-num {\n      background: var(--green); border-color: var(--green); color: #fff;\n    }\n    .step.done .step-num svg { width: 14px; height: 14px; }\n    .step-body { flex: 1; min-width: 0; padding-top: 3px; }\n    .step-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 2px;\n    }\n    .step-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .step.active .step-title { color: var(--blue); }\n    .step-hint { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* Form card */\n    .form-card {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .form-card-head {\n      padding: 22px 28px 18px;\n      border-bottom: 1px solid var(--border);\n      background: linear-gradient(180deg, var(--surface), var(--surface-subtle));\n    }\n    .form-card-head h2 {\n      font-size: 20px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em; margin-bottom: 4px;\n    }\n    .form-card-head p { color: var(--text-muted); font-size: 13px; }\n    .form-card-body { padding: 26px 28px; }\n    .form-card-foot {\n      padding: 16px 28px;\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; justify-content: space-between; align-items: center; gap: 12px;\n    }\n    .form-card-foot-left { font-size: 12px; color: var(--text-faint); display: flex; align-items: center; gap: 6px; }\n    .form-card-foot-left svg { width: 14px; height: 14px; }\n    .form-card-foot-right { display: flex; gap: 10px; }\n\n    /* Step panels */\n    .step-panel { display: none; }\n    .step-panel.active { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }\n\n    /* Form grid */\n    .field-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px;\n    }\n    .field-grid .full { grid-column: span 2; }\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field label {\n      font-size: 12px; font-weight: 600; color: var(--text);\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .field label .opt {\n      font-size: 10px; font-weight: 600; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .field-hint { font-size: 11px; color: var(--text-faint); }\n    .input, .select, textarea.input {\n      padding: 10px 12px; font-size: 13px;\n      border: 1px solid var(--border);\n      border-radius: 8px;\n      background: var(--surface);\n      color: var(--text);\n      transition: all 0.15s ease;\n      width: 100%;\n    }\n    .input:focus, .select:focus, textarea.input:focus {\n      outline: none;\n      border-color: var(--blue);\n      box-shadow: 0 0 0 3px var(--blue-pale);\n    }\n    .select {\n      appearance: none; -webkit-appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat;\n      background-position: right 10px center;\n      background-size: 16px;\n      padding-right: 36px;\n    }\n    .input-prefix {\n      position: relative; display: flex; align-items: center;\n    }\n    .input-prefix .prefix {\n      position: absolute; left: 12px;\n      color: var(--text-faint); font-size: 13px; font-weight: 600;\n      pointer-events: none;\n    }\n    .input-prefix .input { padding-left: 26px; }\n\n    /* Dropzone */\n    .dropzone {\n      border: 1.5px dashed var(--border-strong);\n      border-radius: 10px;\n      padding: 24px;\n      background: var(--surface-subtle);\n      display: flex; align-items: center; gap: 14px;\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .dropzone:hover {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n    }\n    .dropzone-icon {\n      width: 42px; height: 42px; border-radius: 10px;\n      background: var(--surface); color: var(--blue);\n      border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .dropzone-icon svg { width: 20px; height: 20px; }\n    .dropzone-body { flex: 1; }\n    .dropzone-body strong { display: block; font-size: 13px; color: var(--text); font-weight: 600; margin-bottom: 2px; }\n    .dropzone-body span { font-size: 12px; color: var(--text-muted); }\n    .dropzone-action {\n      font-size: 12px; font-weight: 600; color: var(--blue);\n      padding: 7px 14px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n    }\n\n    /* Section heading inside step */\n    .form-section-head {\n      margin-top: 24px; padding-top: 20px;\n      border-top: 1px solid var(--border);\n    }\n    .form-section-head:first-child { margin-top: 0; padding-top: 0; border-top: none; }\n    .form-section-head h3 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }\n    .form-section-head p { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }\n\n    /* Soft warning inline */\n    .soft-warn {\n      display: none;\n      margin-top: 10px;\n      padding: 10px 12px;\n      background: var(--orange-bg);\n      border: 1px solid rgba(234,140,58,0.35);\n      border-radius: 8px;\n      font-size: 12px; color: var(--text);\n      align-items: flex-start; gap: 10px;\n    }\n    .soft-warn.show { display: flex; }\n    .soft-warn svg { width: 14px; height: 14px; color: var(--orange); flex-shrink: 0; margin-top: 2px; }\n    .soft-warn strong { color: var(--orange); font-weight: 700; }\n\n    /* Co-tenant chip */\n    .cotenant-list {\n      display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;\n    }\n    .cotenant {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 6px 12px 6px 6px;\n      background: var(--blue-pale); color: var(--blue);\n      border-radius: 100px; font-size: 12px; font-weight: 600;\n    }\n    .cotenant-avatar {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--blue); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 10px; font-weight: 700;\n    }\n\n    /* Pet policy radio group */\n    .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }\n    .chip-radio { position: relative; }\n    .chip-radio input { position: absolute; opacity: 0; pointer-events: none; }\n    .chip-radio label {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 8px 14px;\n      border: 1px solid var(--border);\n      border-radius: 100px;\n      font-size: 12px; font-weight: 600;\n      color: var(--text-muted);\n      cursor: pointer; transition: all 0.15s ease;\n      background: var(--surface);\n    }\n    .chip-radio label:hover { border-color: var(--blue); color: var(--blue); }\n    .chip-radio input:checked + label {\n      background: var(--blue); border-color: var(--blue); color: #fff;\n    }\n\n    /* Review summary */\n    .summary-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;\n    }\n    .summary-card {\n      border: 1px solid var(--border); border-radius: 12px;\n      padding: 18px; background: var(--surface);\n    }\n    .summary-card h4 {\n      font-size: 10px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em;\n      margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;\n    }\n    .summary-card h4 a { color: var(--blue); font-weight: 600; letter-spacing: 0; text-transform: none; font-size: 11px; }\n    .summary-rows { display: flex; flex-direction: column; gap: 8px; }\n    .summary-row {\n      display: flex; justify-content: space-between; align-items: baseline;\n      font-size: 13px; gap: 12px;\n    }\n    .summary-row span:first-child { color: var(--text-muted); }\n    .summary-row span:last-child { color: var(--text); font-weight: 600; text-align: right; }\n\n    /* Invite option cards */\n    .option-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }\n    .option {\n      display: flex; gap: 14px; padding: 16px;\n      border: 1.5px solid var(--border); border-radius: 12px;\n      cursor: pointer; transition: all 0.15s ease;\n      background: var(--surface);\n    }\n    .option:hover { border-color: var(--blue); background: var(--surface-subtle); }\n    .option input { display: none; }\n    .option.selected {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n      box-shadow: 0 0 0 3px rgba(18,81,173,0.08);\n    }\n    .option-radio {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong);\n      flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .option.selected .option-radio {\n      border-color: var(--blue);\n    }\n    .option.selected .option-radio::after {\n      content: \"\"; width: 8px; height: 8px; border-radius: 50%; background: var(--blue);\n    }\n    .option-body { flex: 1; }\n    .option-body strong { display: block; font-size: 14px; color: var(--text); font-weight: 700; margin-bottom: 2px; }\n    .option-body p { font-size: 12px; color: var(--text-muted); }\n\n    /* Checkbox row */\n    .check-row {\n      margin-top: 16px;\n      display: flex; align-items: flex-start; gap: 10px;\n      padding: 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 10px;\n      cursor: pointer;\n    }\n    .check-row input { display: none; }\n    .check-box {\n      width: 18px; height: 18px; border-radius: 5px;\n      border: 1.5px solid var(--border-strong);\n      flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface);\n      transition: all 0.15s ease;\n    }\n    .check-row.checked .check-box {\n      background: var(--blue); border-color: var(--blue);\n    }\n    .check-row.checked .check-box svg { display: block; }\n    .check-box svg { display: none; width: 12px; height: 12px; color: #fff; }\n    .check-row-body strong { display: block; font-size: 13px; color: var(--text); font-weight: 600; margin-bottom: 2px; }\n    .check-row-body p { font-size: 12px; color: var(--text-muted); }\n\n    /* Success overlay */\n    .overlay {\n      display: none;\n      position: fixed; inset: 0;\n      background: rgba(20,32,74,0.5);\n      backdrop-filter: blur(6px);\n      z-index: 100;\n      align-items: center; justify-content: center;\n      padding: 24px;\n    }\n    .overlay.show { display: flex; animation: fadeIn 0.3s ease; }\n    .overlay-card {\n      background: var(--surface);\n      border-radius: var(--radius-xl);\n      box-shadow: var(--shadow-lg);\n      max-width: 560px; width: 100%;\n      padding: 36px;\n      text-align: center;\n    }\n    .overlay-icon {\n      width: 64px; height: 64px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);\n      color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 18px;\n      box-shadow: 0 10px 24px rgba(30,169,124,0.3);\n    }\n    .overlay-icon svg { width: 32px; height: 32px; }\n    .overlay-card h2 {\n      font-size: 24px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 8px;\n    }\n    .overlay-card p {\n      font-size: 14px; color: var(--text-muted); margin-bottom: 24px;\n      max-width: 420px; margin-left: auto; margin-right: auto;\n    }\n    .overlay-actions {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 12px; margin-bottom: 18px;\n    }\n    .overlay-action {\n      padding: 16px 14px;\n      border: 1px solid var(--border); border-radius: 12px;\n      background: var(--surface);\n      cursor: pointer; transition: all 0.15s ease;\n      text-align: left;\n    }\n    .overlay-action:hover {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n      transform: translateY(-2px);\n    }\n    .overlay-action-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 10px;\n    }\n    .overlay-action-icon svg { width: 16px; height: 16px; }\n    .overlay-action strong { display: block; font-size: 13px; color: var(--text); font-weight: 700; margin-bottom: 2px; }\n    .overlay-action span { font-size: 11px; color: var(--text-muted); }\n    .overlay-foot { font-size: 12px; color: var(--text-faint); }\n    .overlay-foot a { color: var(--blue); font-weight: 600; }\n\n    @media (max-width: 1080px) {\n      .wizard { grid-template-columns: 1fr; }\n      .stepper { position: static; }\n    }\n\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <div className="app">

    
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </div>
        <div>
          <div className="sb-brand-name">Black Bear Rentals</div>
          <div className="sb-brand-ws">Black Bear Rentals</div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-label">Overview</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>Dashboard
          </a>
          <a className="sb-nav-item" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>Properties
            <span className="sb-nav-count">4</span>
          </a>
          <a className="sb-nav-item active" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Tenants
            <span className="sb-nav-count">12</span>
          </a>
          <a className="sb-nav-item" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>Leases
          </a>
          <a className="sb-nav-item" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>Applications
            <span className="sb-nav-badge">3</span>
          </a>
        </div>

        <div className="sb-section-label" style={{marginTop: "20px"}}>Operations</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>Payments
          </a>
          <a className="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1" /></svg>Maintenance
            <span className="sb-nav-count">5</span>
          </a>
          <a className="sb-nav-item" href="reports.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>Reports
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>Vendors
          </a>
        </div>

        <div className="sb-section-label" style={{marginTop: "20px"}}>Workspace</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5" /></svg>Settings
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>Documents
          </a>
        </div>
      </div>

      <div className="sb-user">
        <div className="sb-user-card">
          <div className="sb-user-avatar">HC</div>
          <div className="sb-user-info">
            <div className="sb-user-name">Harrison Cooper</div>
            <div className="sb-user-email">harrison@rentblackbear.com</div>
          </div>
          <div className="sb-user-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </aside>

    
    <main className="main">

      
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <a href="tenants.html">Tenants</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Add tenant</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, leases, invoices…" />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          </button>
          <button className="topbar-icon" aria-label="Inbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
        </div>
      </div>

      
      <div className="content">

        <div className="page-crumbs">
          <a href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "-2px", marginRight: "4px", width: "12px", height: "12px"}}><path d="M15 18l-6-6 6-6" /></svg>
            Back to tenants
          </a>
        </div>

        <div className="page-head">
          <div>
            <h1>Add a tenant manually</h1>
            <p>Skip the application flow. Use this for existing tenants, grandfathered occupants, or bulk-imports that need finesse.</p>
          </div>
          <div className="page-head-actions">
            <a href="tenants.html" className="btn btn-ghost btn-sm">Cancel</a>
            <button className="btn btn-ghost btn-sm" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Import CSV instead
            </button>
          </div>
        </div>

        
        <div className="callout">
          <div className="callout-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div className="callout-body">
            <strong>Heads up — no background or credit check runs on manual adds.</strong>
            <p>This tenant won't have gone through credit/background checks. If you want that, use the regular <a href="tenants.html">invite-to-apply</a> flow instead.</p>
          </div>
        </div>

        
        <div className="wizard">

          
          <aside className="stepper" id="stepper">
            <div className="stepper-title">Manual add</div>

            <div className="step active" data-step="1">
              <div className="step-num">1</div>
              <div className="step-body">
                <div className="step-label">Step 1</div>
                <div className="step-title">Who is this tenant?</div>
                <div className="step-hint">Name, contact, ID</div>
              </div>
            </div>

            <div className="step" data-step="2">
              <div className="step-num">2</div>
              <div className="step-body">
                <div className="step-label">Step 2</div>
                <div className="step-title">Where are they going?</div>
                <div className="step-hint">Property &amp; unit</div>
              </div>
            </div>

            <div className="step" data-step="3">
              <div className="step-num">3</div>
              <div className="step-body">
                <div className="step-label">Step 3</div>
                <div className="step-title">Lease terms</div>
                <div className="step-hint">Rent, deposit, dates</div>
              </div>
            </div>

            <div className="step" data-step="4">
              <div className="step-num">4</div>
              <div className="step-body">
                <div className="step-label">Step 4</div>
                <div className="step-title">Review &amp; invite</div>
                <div className="step-hint">Portal access</div>
              </div>
            </div>
          </aside>

          
          <section className="form-card">

            
            <div className="step-panel active" data-panel="1">
              <div className="form-card-head">
                <h2>Who is this tenant?</h2>
                <p>Just the basics to create their profile. You can fill in the rest from their tenant page later.</p>
              </div>
              <div className="form-card-body">
                <div className="field-grid">
                  <div className="field">
                    <label>First name</label>
                    <input className="input" id="f_first" placeholder="Ramon" value="Ramon" required />
                  </div>
                  <div className="field">
                    <label>Last name</label>
                    <input className="input" id="f_last" placeholder="Jackson" value="Jackson" required />
                  </div>
                  <div className="field">
                    <label>Email <span className="opt">Required for portal invite</span></label>
                    <input className="input" id="f_email" type="email" placeholder="ramon@example.com" value="ramon.jackson@gmail.com" required />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input className="input" id="f_phone" type="tel" placeholder="(256) 555-0134" value="(256) 555-0134" />
                  </div>
                  <div className="field">
                    <label>Date of birth</label>
                    <input className="input" id="f_dob" type="date" value="1989-04-22" />
                  </div>
                  <div className="field">
                    <label>SSN last 4 <span className="opt">Optional</span></label>
                    <div className="input-prefix">
                      <span className="prefix">***-**-</span>
                      <input className="input" id="f_ssn" maxLength="4" inputMode="numeric" placeholder="0000" />
                    </div>
                  </div>
                  <div className="field full">
                    <label>Current employer <span className="opt">Optional</span></label>
                    <input className="input" id="f_employer" placeholder="Redstone Federal Credit Union" value="Redstone Federal Credit Union" />
                    <span className="field-hint">Helps with income verification and communication if rent is late.</span>
                  </div>
                  <div className="field full">
                    <label>Government ID <span className="opt">Optional</span></label>
                    <div className="dropzone">
                      <div className="dropzone-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M15 8h3M15 12h3M5 18h14" /></svg>
                      </div>
                      <div className="dropzone-body">
                        <strong>Drop ID or click to upload</strong>
                        <span>Driver's license, passport, or state ID — PDF, JPG, or PNG up to 10MB</span>
                      </div>
                      <div className="dropzone-action">Choose file</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-card-foot">
                <div className="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  We never share tenant PII. Encrypted at rest.
                </div>
                <div className="form-card-foot-right">
                  <button className="btn btn-ghost" type="button" disabled>Back</button>
                  <button className="btn btn-primary" type="button" data-next="2">
                    Continue to placement
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            
            <div className="step-panel" data-panel="2">
              <div className="form-card-head">
                <h2>Where are they going?</h2>
                <p>Pick the property and unit. We'll warn you if the unit already has a tenant.</p>
              </div>
              <div className="form-card-body">
                <div className="field-grid">
                  <div className="field">
                    <label>Property</label>
                    <select className="select" id="f_property">
                      <option value="">Select a property…</option>
                      <option value="lee" data-units="2" selected>908 Lee Dr NW — 2 units</option>
                      <option value="turf" data-units="3">3026 Turf Ave NW — 3 units</option>
                      <option value="pinhook" data-units="1">1145 Pinhook Rd — 1 unit</option>
                      <option value="oakwood" data-units="6">412 Oakwood St — 6 units</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Unit / room</label>
                    <select className="select" id="f_unit">
                      <option value="A" data-status="available">Unit A — Available</option>
                      <option value="B" data-status="occupied" selected>Unit B — Occupied by Dana Meyer</option>
                    </select>
                    <div className="soft-warn show" id="unit_warn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      <div>
                        <strong>Unit B is currently occupied by Dana Meyer.</strong> They'll be listed as a co-tenant. To replace instead, end Dana's lease first from the lease page.
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label>Move-in date</label>
                    <input className="input" id="f_movein" type="date" value="2026-05-01" />
                  </div>
                  <div className="field">
                    <label>Relationship <span className="opt">Optional</span></label>
                    <select className="select" id="f_rel">
                      <option>Tenant (standard)</option>
                      <option>Grandfathered occupant</option>
                      <option>Friend or family</option>
                      <option>Migrated from other system</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label>Co-tenants already in this unit</label>
                    <div className="cotenant-list">
                      <span className="cotenant">
                        <span className="cotenant-avatar">DM</span>
                        Dana Meyer — lease thru Dec 2026
                      </span>
                    </div>
                    <span className="field-hint">Ramon will share rent responsibility with existing co-tenants unless you mark separate rent on the lease step.</span>
                  </div>
                </div>
              </div>
              <div className="form-card-foot">
                <div className="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  4 properties · 12 units managed
                </div>
                <div className="form-card-foot-right">
                  <button className="btn btn-ghost" type="button" data-prev="1">Back</button>
                  <button className="btn btn-primary" type="button" data-next="3">
                    Continue to lease
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            
            <div className="step-panel" data-panel="3">
              <div className="form-card-head">
                <h2>Lease terms</h2>
                <p>We pre-filled from 908 Lee Dr NW's defaults. Override anything that doesn't match their existing lease.</p>
              </div>
              <div className="form-card-body">

                <div className="form-section-head">
                  <h3>Rent &amp; deposit</h3>
                  <p>Set what Ramon pays and when.</p>
                </div>
                <div className="field-grid">
                  <div className="field">
                    <label>Monthly rent</label>
                    <div className="input-prefix">
                      <span className="prefix">$</span>
                      <input className="input" id="f_rent" type="number" value="1450" step="25" />
                    </div>
                    <span className="field-hint">Pre-filled from property default ($1,450).</span>
                  </div>
                  <div className="field">
                    <label>Security deposit</label>
                    <div className="input-prefix">
                      <span className="prefix">$</span>
                      <input className="input" id="f_deposit" type="number" value="1450" step="25" />
                    </div>
                    <span className="field-hint">Pre-filled to one month of rent.</span>
                  </div>
                  <div className="field">
                    <label>Rent due on</label>
                    <select className="select" id="f_day">
                      <option>1st of the month</option>
                      <option>5th of the month</option>
                      <option>15th of the month</option>
                      <option selected>1st — aligned with portfolio</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Late fee grace</label>
                    <select className="select">
                      <option>3 days</option>
                      <option selected>5 days</option>
                      <option>7 days</option>
                      <option>No grace period</option>
                    </select>
                  </div>
                </div>

                <div className="form-section-head">
                  <h3>Lease window</h3>
                  <p>If they signed a paper lease before Black Bear Rentals, put those dates.</p>
                </div>
                <div className="field-grid">
                  <div className="field">
                    <label>Lease start</label>
                    <input className="input" id="f_start" type="date" value="2026-05-01" />
                  </div>
                  <div className="field">
                    <label>Lease end</label>
                    <input className="input" id="f_end" type="date" value="2027-04-30" />
                  </div>
                </div>

                <div className="form-section-head">
                  <h3>Pet policy</h3>
                  <p>This flags the unit if they bring an animal in later.</p>
                </div>
                <div className="chip-group">
                  <div className="chip-radio">
                    <input type="radio" name="pets" id="pets_none" checked />
                    <label htmlFor="pets_none">No pets</label>
                  </div>
                  <div className="chip-radio">
                    <input type="radio" name="pets" id="pets_cat" />
                    <label htmlFor="pets_cat">Cats OK</label>
                  </div>
                  <div className="chip-radio">
                    <input type="radio" name="pets" id="pets_dog" />
                    <label htmlFor="pets_dog">Dogs OK</label>
                  </div>
                  <div className="chip-radio">
                    <input type="radio" name="pets" id="pets_all" />
                    <label htmlFor="pets_all">Pets allowed (all)</label>
                  </div>
                  <div className="chip-radio">
                    <input type="radio" name="pets" id="pets_case" />
                    <label htmlFor="pets_case">Case by case</label>
                  </div>
                </div>

                <div className="form-section-head">
                  <h3>Existing lease PDF <span style={{fontWeight: "500", color: "var(--text-faint)", fontSize: "12px"}}>— optional</span></h3>
                  <p>Upload the signed paper lease. We'll attach it to their profile so payments and maintenance stay tied to a real document.</p>
                </div>
                <div className="dropzone">
                  <div className="dropzone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
                  </div>
                  <div className="dropzone-body">
                    <strong>Drop signed lease PDF here</strong>
                    <span>Or click to browse — PDF only, up to 25MB</span>
                  </div>
                  <div className="dropzone-action">Choose file</div>
                </div>

              </div>
              <div className="form-card-foot">
                <div className="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  Projected ARR impact: <strong style={{color: "var(--text)", marginLeft: "4px"}}>+$17,400/yr</strong>
                </div>
                <div className="form-card-foot-right">
                  <button className="btn btn-ghost" type="button" data-prev="2">Back</button>
                  <button className="btn btn-primary" type="button" data-next="4">
                    Continue to review
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            
            <div className="step-panel" data-panel="4">
              <div className="form-card-head">
                <h2>Review &amp; send portal invite</h2>
                <p>One last look. Edit any section before you hit create.</p>
              </div>
              <div className="form-card-body">

                <div className="summary-grid">
                  <div className="summary-card">
                    <h4>Tenant <a href="#" data-jump="1">Edit</a></h4>
                    <div className="summary-rows">
                      <div className="summary-row"><span>Name</span><span id="s_name">Ramon Jackson</span></div>
                      <div className="summary-row"><span>Email</span><span id="s_email">ramon.jackson@gmail.com</span></div>
                      <div className="summary-row"><span>Phone</span><span id="s_phone">(256) 555-0134</span></div>
                      <div className="summary-row"><span>Employer</span><span>Redstone Federal Credit Union</span></div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <h4>Placement <a href="#" data-jump="2">Edit</a></h4>
                    <div className="summary-rows">
                      <div className="summary-row"><span>Property</span><span>908 Lee Dr NW</span></div>
                      <div className="summary-row"><span>Unit</span><span>Unit B (w/ Dana Meyer)</span></div>
                      <div className="summary-row"><span>Move-in</span><span>May 1, 2026</span></div>
                      <div className="summary-row"><span>Relationship</span><span>Tenant (standard)</span></div>
                    </div>
                  </div>

                  <div className="summary-card" style={{gridColumn: "span 2"}}>
                    <h4>Lease <a href="#" data-jump="3">Edit</a></h4>
                    <div className="summary-rows" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px"}}>
                      <div className="summary-row"><span>Rent</span><span>$1,450 / mo</span></div>
                      <div className="summary-row"><span>Deposit</span><span>$1,450</span></div>
                      <div className="summary-row"><span>Term</span><span>May 1, 2026 — Apr 30, 2027</span></div>
                      <div className="summary-row"><span>Due day</span><span>1st of month</span></div>
                      <div className="summary-row"><span>Pet policy</span><span>No pets</span></div>
                      <div className="summary-row"><span>Signed lease</span><span style={{color: "var(--text-faint)", fontWeight: "500"}}>Not uploaded</span></div>
                    </div>
                  </div>
                </div>

                <div className="form-section-head" style={{marginTop: "28px"}}>
                  <h3>Portal access</h3>
                  <p>How should Ramon get into Black Bear Rentals?</p>
                </div>

                <div className="option-list">
                  <div className="option selected" data-opt="invite">
                    <input type="radio" name="invite" checked />
                    <div className="option-radio" />
                    <div className="option-body">
                      <strong>Send portal invite now</strong>
                      <p>Ramon gets an email at ramon.jackson@gmail.com, sets his own password, and lands in the tenant portal.</p>
                    </div>
                  </div>
                  <div className="option" data-opt="later">
                    <input type="radio" name="invite" />
                    <div className="option-radio" />
                    <div className="option-body">
                      <strong>Create without invite — I'll send it later</strong>
                      <p>Profile gets created, but no email goes out. You can invite from their tenant page whenever you're ready.</p>
                    </div>
                  </div>
                </div>

                <label className="check-row" id="skip_row">
                  <input type="checkbox" id="f_skip" />
                  <div className="check-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="check-row-body">
                    <strong>Skip the onboarding flow for this tenant — they're already living here</strong>
                    <p>Drops them straight on the portal dashboard. No welcome tour, no "verify your ID," no autopay wizard. Good for grandfathered residents.</p>
                  </div>
                </label>

              </div>
              <div className="form-card-foot">
                <div className="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  Ready to create
                </div>
                <div className="form-card-foot-right">
                  <button className="btn btn-ghost" type="button" data-prev="3">Back</button>
                  <button className="btn btn-primary btn-lg" type="button" id="submit_btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                    Create tenant &amp; send invite
                  </button>
                </div>
              </div>
            </div>

          </section>
        </div>

      </div>

    </main>
  </div>

  
  <div className="overlay" id="success_overlay">
    <div className="overlay-card">
      <div className="overlay-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2 id="overlay_title">Ramon Jackson added. Portal invite sent.</h2>
      <p id="overlay_sub">They'll get a welcome email at ramon.jackson@gmail.com within the next minute. You can track whether they've activated from their tenant page.</p>

      <div className="overlay-actions">
        <a className="overlay-action" href="tenant-profile.html">
          <div className="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <strong>View tenant profile</strong>
          <span>Open Ramon's page</span>
        </a>
        <a className="overlay-action" href="admin-add-tenant.html">
          <div className="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <strong>Add another tenant</strong>
          <span>Keep going</span>
        </a>
        <a className="overlay-action" href="#" id="autopay_card">
          <div className="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.2-8.55" /><polyline points="21 4 21 10 15 10" /></svg>
          </div>
          <strong>Set up autopay</strong>
          <span>For Ramon</span>
        </a>
      </div>

      <div className="overlay-foot">
        Changed your mind? <a href="tenants.html">Back to tenants list</a>
      </div>
    </div>
  </div>

  


    </>
  );
}
