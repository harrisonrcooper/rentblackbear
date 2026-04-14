"use client";

// Mock ported from ~/Desktop/tenantory/admin-property-new.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    /* Topbar */\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 32px 40px 80px; }\n    .wizard { max-width: 980px; margin: 0 auto; }\n\n    /* Page head */\n    .page-head { margin-bottom: 28px; }\n    .page-head h1 {\n      font-size: 30px; font-weight: 800; letter-spacing: -0.025em;\n      color: var(--text); margin-bottom: 6px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; }\n\n    /* Buttons */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-text { color: var(--blue); font-weight: 600; padding: 6px 10px; font-size: 13px; }\n    .btn-text:hover { color: var(--navy); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn-lg { padding: 13px 26px; font-size: 14px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stepper ===== */\n    .stepper {\n      display: flex; align-items: center; gap: 0;\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 14px 18px;\n      margin-bottom: 24px;\n      box-shadow: var(--shadow-sm);\n    }\n    .step-pill {\n      display: flex; align-items: center; gap: 10px;\n      flex: 1; padding: 6px 4px; border-radius: 8px;\n      cursor: pointer;\n      transition: all 0.15s ease;\n      opacity: 0.55;\n    }\n    .step-pill:hover { opacity: 0.85; }\n    .step-pill.active { opacity: 1; }\n    .step-pill.done { opacity: 1; }\n    .step-pill.disabled { cursor: not-allowed; opacity: 0.35; }\n    .step-pill.disabled:hover { opacity: 0.35; }\n    .step-dot {\n      width: 28px; height: 28px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface-alt);\n      border: 1.5px solid var(--border-strong);\n      color: var(--text-muted);\n      font-weight: 700; font-size: 12px;\n      flex-shrink: 0;\n      transition: all 0.15s ease;\n    }\n    .step-pill.active .step-dot {\n      background: var(--blue); color: #fff; border-color: var(--blue);\n      box-shadow: 0 0 0 4px var(--blue-pale);\n    }\n    .step-pill.done .step-dot {\n      background: var(--green); color: #fff; border-color: var(--green);\n    }\n    .step-pill.done .step-dot svg { width: 14px; height: 14px; }\n    .step-label {\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.05em;\n      line-height: 1.1;\n    }\n    .step-sub {\n      font-size: 13px; font-weight: 600; color: var(--text);\n      margin-top: 2px;\n    }\n    .step-pill.active .step-label { color: var(--blue); }\n    .step-connector {\n      width: 32px; height: 2px; background: var(--border);\n      flex-shrink: 0; margin: 0 4px;\n    }\n    .step-connector.done { background: var(--green); }\n\n    /* ===== Panels ===== */\n    .panel {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      box-shadow: var(--shadow-sm);\n      margin-bottom: 20px;\n      overflow: hidden;\n    }\n    .panel[hidden] { display: none; }\n    .panel-head {\n      padding: 22px 26px 18px;\n      border-bottom: 1px solid var(--border);\n    }\n    .panel-head h2 {\n      font-size: 20px; font-weight: 700; letter-spacing: -0.015em;\n      color: var(--text); margin-bottom: 4px;\n    }\n    .panel-head p { color: var(--text-muted); font-size: 13px; }\n    .panel-body { padding: 26px; }\n\n    .panel-foot {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 18px 26px;\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n\n    /* ===== Tile cards (step 1) ===== */\n    .tile-grid {\n      display: grid; grid-template-columns: 1fr 1fr;\n      gap: 16px;\n    }\n    .tile {\n      display: flex; flex-direction: column; gap: 14px;\n      padding: 22px;\n      border: 1.5px solid var(--border);\n      border-radius: var(--radius-lg);\n      background: var(--surface);\n      cursor: pointer;\n      transition: all 0.15s ease;\n      text-align: left;\n      position: relative;\n    }\n    .tile:hover {\n      border-color: var(--blue);\n      transform: translateY(-2px);\n      box-shadow: var(--shadow);\n    }\n    .tile.selected {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n      box-shadow: 0 0 0 4px rgba(18,81,173,0.08);\n    }\n    .tile.selected::after {\n      content: \"\"; position: absolute; top: 14px; right: 14px;\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--blue) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>\") center / 14px no-repeat;\n    }\n    .tile-icon {\n      width: 46px; height: 46px; border-radius: 12px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .tile.selected .tile-icon { background: var(--blue); color: #fff; }\n    .tile-icon svg { width: 22px; height: 22px; }\n    .tile-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n    .tile-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n    .tile-eg {\n      font-size: 11px; color: var(--text-faint);\n      font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;\n      margin-top: auto;\n    }\n    .tile-eg span { color: var(--text-muted); text-transform: none; font-weight: 500; letter-spacing: 0; }\n\n    /* ===== Forms ===== */\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field label {\n      font-size: 12px; font-weight: 600; color: var(--text);\n      letter-spacing: 0.01em;\n    }\n    .field label .opt { color: var(--text-faint); font-weight: 500; margin-left: 4px; }\n    .field input, .field select, .field textarea {\n      padding: 10px 12px;\n      border: 1px solid var(--border);\n      border-radius: var(--radius-sm);\n      background: var(--surface);\n      color: var(--text);\n      font-size: 13px;\n      transition: all 0.15s ease;\n      outline: none;\n    }\n    .field input:focus, .field select:focus, .field textarea:focus {\n      border-color: var(--blue);\n      box-shadow: 0 0 0 3px var(--blue-pale);\n    }\n    .field input::placeholder { color: var(--text-faint); }\n    .field-hint { font-size: 12px; color: var(--text-faint); }\n    .field-prefix {\n      display: flex; align-items: center;\n      border: 1px solid var(--border);\n      border-radius: var(--radius-sm);\n      background: var(--surface);\n      overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .field-prefix:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .field-prefix span {\n      padding: 10px 12px;\n      background: var(--surface-alt);\n      color: var(--text-muted);\n      font-size: 13px; font-weight: 600;\n      border-right: 1px solid var(--border);\n    }\n    .field-prefix input { border: none; flex: 1; padding: 10px 12px; }\n    .field-prefix input:focus { box-shadow: none; }\n\n    .form-grid { display: grid; gap: 16px; }\n    .form-grid.cols-2 { grid-template-columns: 1fr 1fr; }\n    .form-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }\n    .form-grid.addr { grid-template-columns: 2fr 1fr 1fr 1fr; }\n    .section-divider {\n      height: 1px; background: var(--border);\n      margin: 24px 0;\n    }\n    .section-label {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 12px;\n    }\n\n    /* Autofill */\n    .autofill-bar {\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px;\n      padding: 14px 16px;\n      background: linear-gradient(90deg, rgba(18,81,173,0.06), rgba(255,73,152,0.04));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius);\n      margin-bottom: 20px;\n    }\n    .autofill-bar-text { display: flex; align-items: center; gap: 12px; }\n    .autofill-bar-icon {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: var(--surface); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: var(--shadow-sm);\n    }\n    .autofill-bar-icon svg { width: 18px; height: 18px; }\n    .autofill-bar h4 { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }\n    .autofill-bar p { font-size: 12px; color: var(--text-muted); }\n\n    .btn.loading .spinner { display: inline-block; }\n    .spinner {\n      display: none;\n      width: 14px; height: 14px;\n      border: 2px solid rgba(255,255,255,0.4);\n      border-top-color: #fff;\n      border-radius: 50%;\n      animation: spin 0.6s linear infinite;\n    }\n    @keyframes spin { to { transform: rotate(360deg); } }\n\n    /* Dropzone */\n    .dropzone {\n      border: 2px dashed var(--border-strong);\n      border-radius: var(--radius);\n      padding: 32px 20px;\n      text-align: center;\n      background: var(--surface-subtle);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .dropzone:hover {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n    }\n    .dropzone-icon {\n      width: 48px; height: 48px; margin: 0 auto 10px;\n      border-radius: 50%;\n      background: var(--surface); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: var(--shadow-sm);\n    }\n    .dropzone-icon svg { width: 22px; height: 22px; }\n    .dropzone-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }\n    .dropzone-sub { font-size: 12px; color: var(--text-muted); }\n\n    /* ===== Units table (step 3) ===== */\n    .units-ctrl {\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px;\n      padding: 16px; margin-bottom: 16px;\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n    }\n    .units-ctrl .field { flex: 0 0 240px; }\n    .units-ctrl-hint { font-size: 12px; color: var(--text-muted); }\n\n    .units-head {\n      display: grid; grid-template-columns: 1.6fr 0.8fr 0.8fr 0.9fr 1fr 1fr 30px;\n      gap: 10px; padding: 10px 12px;\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-sm) var(--radius-sm) 0 0;\n    }\n    .units-list { border: 1px solid var(--border); border-top: none; border-radius: 0 0 var(--radius-sm) var(--radius-sm); overflow: hidden; }\n    .unit-row {\n      display: grid; grid-template-columns: 1.6fr 0.8fr 0.8fr 0.9fr 1fr 1fr 30px;\n      gap: 10px;\n      padding: 10px 12px;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface);\n      align-items: center;\n    }\n    .unit-row:last-child { border-bottom: none; }\n    .unit-row input {\n      width: 100%; padding: 8px 10px;\n      border: 1px solid var(--border);\n      border-radius: var(--radius-sm);\n      background: var(--surface);\n      font-size: 13px; color: var(--text);\n      outline: none;\n      transition: all 0.15s ease;\n    }\n    .unit-row input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .unit-remove {\n      width: 30px; height: 30px; border-radius: 50%;\n      color: var(--text-faint);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .unit-remove:hover { background: var(--red-bg); color: var(--red); }\n    .unit-remove svg { width: 14px; height: 14px; }\n\n    .add-row-btn {\n      margin-top: 12px;\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 8px 14px;\n      border: 1px dashed var(--border-strong);\n      border-radius: var(--radius-sm);\n      color: var(--text-muted);\n      font-size: 13px; font-weight: 600;\n      transition: all 0.15s ease;\n      background: var(--surface);\n    }\n    .add-row-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }\n\n    /* ===== Ownership (step 4) ===== */\n    .radio-grid {\n      display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;\n      gap: 10px;\n    }\n    .radio-card {\n      display: flex; flex-direction: column; align-items: flex-start; gap: 8px;\n      padding: 14px;\n      border: 1.5px solid var(--border);\n      border-radius: var(--radius);\n      cursor: pointer; text-align: left;\n      transition: all 0.15s ease;\n      background: var(--surface);\n    }\n    .radio-card:hover { border-color: var(--blue); }\n    .radio-card.selected {\n      border-color: var(--blue); background: var(--blue-pale);\n    }\n    .radio-card-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .radio-card.selected .radio-card-icon { background: var(--blue); color: #fff; }\n    .radio-card-icon svg { width: 16px; height: 16px; }\n    .radio-card-title { font-size: 13px; font-weight: 700; color: var(--text); }\n    .radio-card-sub { font-size: 11px; color: var(--text-muted); }\n\n    .entity-block {\n      margin-top: 16px;\n      padding: 16px;\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n    }\n    .entity-block[hidden] { display: none; }\n\n    .info-note {\n      display: flex; align-items: flex-start; gap: 10px;\n      padding: 12px 14px;\n      background: var(--blue-pale);\n      border: 1px solid rgba(18,81,173,0.15);\n      border-radius: var(--radius-sm);\n      color: var(--navy);\n      font-size: 12px; line-height: 1.5;\n      margin-top: 16px;\n    }\n    .info-note svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--blue); }\n    .info-note strong { font-weight: 700; }\n\n    /* ===== Summary (step 5) ===== */\n    .summary-card {\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      overflow: hidden;\n      margin-bottom: 20px;\n    }\n    .summary-head {\n      padding: 14px 18px;\n      background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .summary-head h4 {\n      font-size: 13px; font-weight: 700; color: var(--text);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .summary-head .edit-link { color: var(--blue); font-size: 12px; font-weight: 600; }\n    .summary-head .edit-link:hover { color: var(--navy); }\n    .summary-body {\n      padding: 16px 18px;\n      display: grid; grid-template-columns: 1fr 1fr;\n      gap: 12px 24px;\n    }\n    .summary-row { display: flex; flex-direction: column; gap: 2px; }\n    .summary-row .label {\n      font-size: 11px; font-weight: 600; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .summary-row .value { font-size: 14px; font-weight: 600; color: var(--text); }\n\n    .checklist {\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      padding: 18px 20px;\n      margin-bottom: 22px;\n    }\n    .checklist h4 {\n      font-size: 13px; font-weight: 700; color: var(--text);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      margin-bottom: 12px;\n    }\n    .checklist ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }\n    .checklist li {\n      display: flex; align-items: flex-start; gap: 10px;\n      font-size: 13px; color: var(--text);\n    }\n    .checklist li svg {\n      width: 18px; height: 18px; flex-shrink: 0;\n      color: var(--green); margin-top: 1px;\n    }\n    .checklist li span.meta { color: var(--text-muted); font-weight: 500; }\n\n    /* ===== Success overlay ===== */\n    .overlay {\n      position: fixed; inset: 0;\n      background: rgba(20,32,74,0.55);\n      backdrop-filter: blur(6px);\n      display: flex; align-items: center; justify-content: center;\n      z-index: 100;\n      padding: 24px;\n      animation: fade 0.25s ease;\n    }\n    .overlay[hidden] { display: none; }\n    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }\n    .overlay-modal {\n      width: 100%; max-width: 560px;\n      background: var(--surface);\n      border-radius: var(--radius-xl);\n      box-shadow: var(--shadow-lg);\n      overflow: hidden;\n      animation: pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1);\n    }\n    @keyframes pop {\n      from { transform: translateY(20px) scale(0.96); opacity: 0; }\n      to { transform: translateY(0) scale(1); opacity: 1; }\n    }\n    .overlay-head {\n      padding: 32px 32px 20px; text-align: center;\n    }\n    .success-badge {\n      width: 64px; height: 64px; border-radius: 50%;\n      background: var(--green); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 18px;\n      box-shadow: 0 0 0 8px var(--green-bg);\n    }\n    .success-badge svg { width: 30px; height: 30px; }\n    .overlay-head h2 {\n      font-size: 22px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; margin-bottom: 6px;\n    }\n    .overlay-head p { color: var(--text-muted); font-size: 14px; }\n    .overlay-body { padding: 0 32px 24px; }\n    .next-card {\n      display: flex; align-items: center; gap: 14px;\n      padding: 14px 16px;\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      margin-bottom: 10px;\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .next-card:hover { border-color: var(--blue); background: var(--blue-pale); transform: translateX(2px); }\n    .next-card-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .next-card-icon svg { width: 18px; height: 18px; }\n    .next-card-text { flex: 1; }\n    .next-card-title { font-size: 14px; font-weight: 700; color: var(--text); }\n    .next-card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .next-card-arrow { color: var(--text-faint); }\n    .next-card-arrow svg { width: 16px; height: 16px; }\n    .overlay-foot {\n      padding: 16px 32px 28px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: center;\n      background: var(--surface-subtle);\n    }\n    .overlay-foot a { color: var(--text-muted); font-size: 13px; font-weight: 600; }\n    .overlay-foot a:hover { color: var(--blue); }\n\n    /* utility */\n    .row-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n    .muted { color: var(--text-muted); font-size: 12px; }\n\n  ";

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
          <div className="sb-brand-name">Tenantory</div>
          <div className="sb-brand-ws">Black Bear Rentals</div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-label">Overview</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>Dashboard
          </a>
          <a className="sb-nav-item active" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>Properties
            <span className="sb-nav-count">4</span>
          </a>
          <a className="sb-nav-item" href="tenants.html">
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
          <a href="properties.html">Properties</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>New property</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, leases, invoices…" />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
          <a className="btn btn-ghost btn-sm" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Cancel
          </a>
        </div>
      </div>

      
      <div className="content">
        <div className="wizard">

          
          <div className="page-head">
            <h1>Add a new property</h1>
            <p>About 3 minutes. You can edit everything later.</p>
          </div>

          
          <div className="stepper" id="stepper">
            <div className="step-pill active" data-step="1">
              <div className="step-dot">1</div>
              <div>
                <div className="step-label">Step 1</div>
                <div className="step-sub">Type</div>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step-pill disabled" data-step="2">
              <div className="step-dot">2</div>
              <div>
                <div className="step-label">Step 2</div>
                <div className="step-sub">Address</div>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step-pill disabled" data-step="3">
              <div className="step-dot">3</div>
              <div>
                <div className="step-label">Step 3</div>
                <div className="step-sub">Units</div>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step-pill disabled" data-step="4">
              <div className="step-dot">4</div>
              <div>
                <div className="step-label">Step 4</div>
                <div className="step-sub">Financials</div>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step-pill disabled" data-step="5">
              <div className="step-dot">5</div>
              <div>
                <div className="step-label">Step 5</div>
                <div className="step-sub">Done</div>
              </div>
            </div>
          </div>

          
          <section className="panel" data-panel="1">
            <div className="panel-head">
              <h2>What kind of property is this?</h2>
              <p>Pick the setup that fits best. You can still fine-tune units on the next step.</p>
            </div>
            <div className="panel-body">
              <div className="tile-grid" id="typeGrid">
                <button className="tile" data-type="single">
                  <div className="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>
                  </div>
                  <div>
                    <div className="tile-title">Single-family home</div>
                    <div className="tile-desc">One unit, one lease. The whole house rents as a single tenancy.</div>
                  </div>
                  <div className="tile-eg">Examples <span>— 908 Lee Dr, 3026 Turf Ave</span></div>
                </button>

                <button className="tile" data-type="coliving">
                  <div className="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /><path d="M7 11h2M11 11h2M15 11h2" /></svg>
                  </div>
                  <div>
                    <div className="tile-title">Co-living house</div>
                    <div className="tile-desc">One building, per-room leases, shared kitchen / living / utilities.</div>
                  </div>
                  <div className="tile-eg">Examples <span>— 5-bed rooming house, student rental</span></div>
                </button>

                <button className="tile" data-type="multi">
                  <div className="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="18" /><rect x="13" y="8" width="8" height="13" /><path d="M6 7h2M6 11h2M6 15h2M16 11h2M16 15h2" /></svg>
                  </div>
                  <div>
                    <div className="tile-title">Multi-family</div>
                    <div className="tile-desc">Duplex, triplex or apartment — multiple units, each with its own kitchen.</div>
                  </div>
                  <div className="tile-eg">Examples <span>— 2-unit duplex, 6-unit apartment</span></div>
                </button>

                <button className="tile" data-type="adu">
                  <div className="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10l7-5 7 5v11" /><rect x="8" y="14" width="6" height="7" /><path d="M18 21v-6h3v6" /></svg>
                  </div>
                  <div>
                    <div className="tile-title">ADU / unit in larger structure</div>
                    <div className="tile-desc">Separate entrance, shared lot — garage apartment, basement suite, casita.</div>
                  </div>
                  <div className="tile-eg">Examples <span>— Carriage house, in-law suite</span></div>
                </button>
              </div>
            </div>
            <div className="panel-foot">
              <a href="properties.html" className="btn-text">Cancel</a>
              <button className="btn btn-primary btn-lg" id="next1" disabled>
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </section>

          
          <section className="panel" data-panel="2" hidden>
            <div className="panel-head">
              <h2>Where is it?</h2>
              <p>The address tenants see and what we use for rent-roll and mail.</p>
            </div>
            <div className="panel-body">

              <div className="autofill-bar">
                <div className="autofill-bar-text">
                  <div className="autofill-bar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7z" /><path d="m9 12 2 2 4-4" /></svg>
                  </div>
                  <div>
                    <h4>Autofill from county assessor</h4>
                    <p>Alabama parcels only. Pre-fills sq ft and year built from public records.</p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" id="autofillBtn">
                  <span className="spinner" />
                  <span className="label">Autofill (AL only)</span>
                </button>
              </div>

              <div className="form-grid addr">
                <div className="field">
                  <label>Street address</label>
                  <input type="text" id="fAddr" placeholder="908 Lee Drive NW" />
                </div>
                <div className="field">
                  <label>Apt / unit<span className="opt">optional</span></label>
                  <input type="text" placeholder="—" />
                </div>
                <div className="field">
                  <label>City</label>
                  <input type="text" id="fCity" value="Huntsville" />
                </div>
                <div className="field">
                  <label>State</label>
                  <select id="fState">
                    <option value="AL">Alabama</option>
                    <option value="GA">Georgia</option>
                    <option value="TN">Tennessee</option>
                    <option value="FL">Florida</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>
              </div>

              <div className="form-grid cols-3" style={{marginTop: "16px"}}>
                <div className="field">
                  <label>ZIP code</label>
                  <input type="text" id="fZip" placeholder="35816" maxLength="5" />
                  <span className="field-hint" id="zipHint">Auto-filled from state</span>
                </div>
                <div className="field">
                  <label>Year built</label>
                  <input type="number" id="fYear" placeholder="1958" />
                </div>
                <div className="field">
                  <label>Square feet<span className="opt">optional</span></label>
                  <input type="number" id="fSqft" placeholder="1,420" />
                </div>
              </div>

              <div className="section-divider" />

              <div className="form-grid cols-2">
                <div className="field">
                  <label>Nickname / display name</label>
                  <input type="text" id="fNick" placeholder="908 Lee" />
                  <span className="field-hint">Shown in lists and on tenant receipts.</span>
                </div>
                <div className="field">
                  <label>Property photos<span className="opt">optional</span></label>
                  <div className="dropzone">
                    <div className="dropzone-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
                    </div>
                    <div className="dropzone-title">Drag 1–8 photos here</div>
                    <div className="dropzone-sub">JPG or PNG, up to 10 MB each</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-foot">
              <button className="btn btn-ghost" data-back="1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary btn-lg" data-next="3">
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </section>

          
          <section className="panel" data-panel="3" hidden>
            <div className="panel-head">
              <h2 id="step3Title">Set up your units</h2>
              <p id="step3Sub">One unit, one lease — we'll pre-fill it for you.</p>
            </div>
            <div className="panel-body">
              <div className="units-ctrl" id="unitsCtrl">
                <div className="field">
                  <label id="countLabel">How many rooms?</label>
                  <input type="number" id="unitCount" min="1" max="20" value="5" />
                </div>
                <div className="units-ctrl-hint" id="ctrlHint">
                  Rows are auto-named. Rename any row inline — Room A can become "Primary suite".
                </div>
              </div>

              <div className="units-head" id="unitsHead">
                <div>Name</div>
                <div>Beds</div>
                <div>Baths</div>
                <div>Sq ft</div>
                <div>Market rent</div>
                <div>Deposit</div>
                <div />
              </div>
              <div className="units-list" id="unitsList" />
              <button className="add-row-btn" id="addRowBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 5v14M5 12h14" /></svg>
                Add another row
              </button>

              <div className="info-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <div><strong>Deposit defaults to one month's rent.</strong> Tenants can pay in installments if you allow it in settings.</div>
              </div>
            </div>
            <div className="panel-foot">
              <button className="btn btn-ghost" data-back="2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary btn-lg" data-next="4">
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </section>

          
          <section className="panel" data-panel="4" hidden>
            <div className="panel-head">
              <h2>Financials &amp; ownership</h2>
              <p>All optional, but it helps us build your Schedule E and cash-flow reports.</p>
            </div>
            <div className="panel-body">

              <div className="section-label">Acquisition</div>
              <div className="form-grid cols-3">
                <div className="field">
                  <label>Purchase price<span className="opt">optional</span></label>
                  <div className="field-prefix"><span>$</span><input type="number" placeholder="225,000" /></div>
                </div>
                <div className="field">
                  <label>Purchase date<span className="opt">optional</span></label>
                  <input type="date" />
                </div>
                <div className="field">
                  <label>Mortgage / month<span className="opt">optional</span></label>
                  <div className="field-prefix"><span>$</span><input type="number" placeholder="1,140" /></div>
                </div>
              </div>

              <div className="section-divider" />

              <div className="section-label">Recurring carry costs</div>
              <div className="form-grid cols-3">
                <div className="field">
                  <label>Property tax / year</label>
                  <div className="field-prefix"><span>$</span><input type="number" placeholder="1,820" /></div>
                </div>
                <div className="field">
                  <label>Insurance / year</label>
                  <div className="field-prefix"><span>$</span><input type="number" placeholder="1,260" /></div>
                </div>
                <div className="field">
                  <label>HOA / condo fees<span className="opt">if any</span></label>
                  <div className="field-prefix"><span>$</span><input type="number" placeholder="0 / month" /></div>
                </div>
              </div>

              <div className="section-divider" />

              <div className="section-label">Who owns this property?</div>
              <div className="radio-grid" id="ownerGrid">
                <button className="radio-card selected" data-own="me">
                  <div className="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
                  </div>
                  <div className="radio-card-title">Me personally</div>
                  <div className="radio-card-sub">Reports on your Schedule E</div>
                </button>
                <button className="radio-card" data-own="llc">
                  <div className="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </div>
                  <div className="radio-card-title">An LLC</div>
                  <div className="radio-card-sub">Tenantory tracks it separately</div>
                </button>
                <button className="radio-card" data-own="partnership">
                  <div className="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="3" /><circle cx="17" cy="9" r="3" /><path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 20c0-3 2-5 5-5" /></svg>
                  </div>
                  <div className="radio-card-title">A partnership</div>
                  <div className="radio-card-sub">Multiple owners, K-1s issued</div>
                </button>
                <button className="radio-card" data-own="trust">
                  <div className="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z" /></svg>
                  </div>
                  <div className="radio-card-title">A trust</div>
                  <div className="radio-card-sub">Held for a beneficiary</div>
                </button>
              </div>

              
              <div className="entity-block" id="entityBlock" hidden>
                <div className="form-grid cols-2">
                  <div className="field">
                    <label id="entityLabel">Owning entity</label>
                    <select id="entitySelect">
                      <option>The Lee Three LLC</option>
                      <option>Black Bear Rentals LLC</option>
                      <option>Cooper Holdings LLC</option>
                      <option>3026 Turf Partnership</option>
                    </select>
                  </div>
                  <div className="field" style={{justifyContent: "flex-end"}}>
                    <label style={{visibility: "hidden"}}>spacer</label>
                    <a href="settings.html" className="btn-text" style={{alignSelf: "flex-start"}}>+ Add new entity</a>
                  </div>
                </div>

                
                <div style={{marginTop: "16px"}}>
                  <div className="section-label">Profit split</div>
                  <div className="units-head" style={{gridTemplateColumns: "2fr 1fr 1fr 30px"}}>
                    <div>Owner</div>
                    <div>% ownership</div>
                    <div>Role</div>
                    <div />
                  </div>
                  <div className="units-list">
                    <div className="unit-row" style={{gridTemplateColumns: "2fr 1fr 1fr 30px"}}>
                      <input type="text" value="Harrison Cooper" />
                      <input type="number" value="50" />
                      <input type="text" value="Managing member" />
                      <button className="unit-remove" aria-label="remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="unit-row" style={{gridTemplateColumns: "2fr 1fr 1fr 30px"}}>
                      <input type="text" value="Partner name" />
                      <input type="number" value="50" />
                      <input type="text" value="Member" />
                      <button className="unit-remove" aria-label="remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                  <button className="add-row-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 5v14M5 12h14" /></svg>
                    Add owner
                  </button>
                </div>
              </div>

              <div className="info-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                <div><strong>Tax reporting entity.</strong> This is what shows on 1099s and Schedule E. You can change it later under Settings → Entities.</div>
              </div>
            </div>
            <div className="panel-foot">
              <button className="btn btn-ghost" data-back="3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary btn-lg" data-next="5">
                Review
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </div>
          </section>

          
          <section className="panel" data-panel="5" hidden>
            <div className="panel-head">
              <h2>Ready to go</h2>
              <p>Here's what we'll create. Click any section to jump back and edit.</p>
            </div>
            <div className="panel-body">

              <div className="summary-card">
                <div className="summary-head">
                  <h4>Property</h4>
                  <a className="edit-link" data-jump="2">Edit</a>
                </div>
                <div className="summary-body" id="sumProperty">
                  <div className="summary-row"><div className="label">Address</div><div className="value" data-k="address">908 Lee Drive NW, Huntsville AL 35816</div></div>
                  <div className="summary-row"><div className="label">Type</div><div className="value" data-k="type">Single-family home</div></div>
                  <div className="summary-row"><div className="label">Nickname</div><div className="value" data-k="nick">908 Lee</div></div>
                  <div className="summary-row"><div className="label">Year built · sq ft</div><div className="value" data-k="sqft">1958 · 1,420 sq ft</div></div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-head">
                  <h4>Units</h4>
                  <a className="edit-link" data-jump="3">Edit</a>
                </div>
                <div className="summary-body" id="sumUnits" style={{gridTemplateColumns: "1fr"}} />
              </div>

              <div className="summary-card">
                <div className="summary-head">
                  <h4>Financials &amp; ownership</h4>
                  <a className="edit-link" data-jump="4">Edit</a>
                </div>
                <div className="summary-body">
                  <div className="summary-row"><div className="label">Owner</div><div className="value" id="sumOwner">Me personally</div></div>
                  <div className="summary-row"><div className="label">Tax-reporting entity</div><div className="value" id="sumEntity">Harrison Cooper · Schedule E</div></div>
                  <div className="summary-row"><div className="label">Property tax / year</div><div className="value">$1,820</div></div>
                  <div className="summary-row"><div className="label">Insurance / year</div><div className="value">$1,260</div></div>
                </div>
              </div>

              <div className="checklist">
                <h4>What happens when you click create</h4>
                <ul>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Property record is created with your address and photos
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Each unit or room is created with its own market rent and deposit
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    You'll be ready to invite tenants <span className="meta">— send invites from the property page</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Autopay for rent collection <span className="meta">— set up when your first tenant is invited</span>
                  </li>
                </ul>
              </div>

            </div>
            <div className="panel-foot">
              <button className="btn btn-ghost" data-back="4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary btn-lg" id="createBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
                Create property
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>

  
  <div className="overlay" id="successOverlay" hidden>
    <div className="overlay-modal">
      <div className="overlay-head">
        <div className="success-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 id="successTitle">908 Lee Drive created</h2>
        <p>It's live in your portfolio. Pick what to do next.</p>
      </div>
      <div className="overlay-body">
        <a className="next-card" href="tenants.html">
          <div className="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
          </div>
          <div className="next-card-text">
            <div className="next-card-title">Add tenants</div>
            <div className="next-card-sub">Invite by email or SMS — they'll sign the lease online</div>
          </div>
          <div className="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
        </a>
        <a className="next-card" href="#">
          <div className="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
          </div>
          <div className="next-card-text">
            <div className="next-card-title">List the property publicly</div>
            <div className="next-card-sub">Syndicate to Zillow, Trulia, and your tenantory.com page</div>
          </div>
          <div className="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
        </a>
        <a className="next-card" href="import.html">
          <div className="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </div>
          <div className="next-card-text">
            <div className="next-card-title">Import prior tenants</div>
            <div className="next-card-sub">Bring over existing leases, deposits, and ledgers from a CSV</div>
          </div>
          <div className="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
        </a>
      </div>
      <div className="overlay-foot">
        <a href="properties.html">Back to all properties →</a>
      </div>
    </div>
  </div>

  

    </>
  );
}
