"use client";

// Mock ported from ~/Desktop/blackbear/import.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (copied verbatim from admin-v2) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name {\n      font-weight: 800; font-size: 18px; color: #fff;\n      letter-spacing: -0.02em;\n    }\n    .sb-brand-ws {\n      font-size: 11px; color: rgba(255,255,255,0.5);\n      font-weight: 500; margin-top: 2px;\n    }\n\n    .sb-section {\n      padding: 16px 12px;\n      flex: 1; overflow-y: auto;\n    }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover {\n      background: rgba(255,255,255,0.06);\n      color: #fff;\n    }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    .sb-user {\n      padding: 16px 12px;\n      border-top: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    .content { flex: 1; overflow-y: auto; padding: 32px; }\n\n    .page-head { margin-bottom: 28px; }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 6px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 680px; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-primary:disabled { background: var(--border-strong); color: #fff; cursor: not-allowed; transform: none; }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e33a85; transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-ghost:disabled { color: var(--text-faint); cursor: not-allowed; }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Step indicator ===== */\n    .stepper {\n      display: flex; align-items: center; gap: 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 24px;\n      margin-bottom: 24px;\n    }\n    .step {\n      display: flex; align-items: center; gap: 12px;\n      flex: 1; cursor: pointer;\n      transition: all 0.15s ease;\n    }\n    .step-num {\n      width: 32px; height: 32px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface-alt); border: 1.5px solid var(--border);\n      color: var(--text-muted); font-weight: 700; font-size: 13px;\n      flex-shrink: 0; transition: all 0.2s ease;\n    }\n    .step-num svg { width: 14px; height: 14px; }\n    .step-label {\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      letter-spacing: -0.01em;\n    }\n    .step-sub { font-size: 11px; color: var(--text-faint); margin-top: 1px; }\n    .step.active .step-num {\n      background: var(--pink); border-color: var(--pink);\n      color: #fff; box-shadow: 0 4px 12px rgba(255,73,152,0.25);\n    }\n    .step.active .step-label { color: var(--text); }\n    .step.done .step-num {\n      background: var(--green); border-color: var(--green); color: #fff;\n    }\n    .step.done .step-label { color: var(--text); }\n    .step-bar {\n      flex: 0 0 40px; height: 2px; background: var(--border);\n      margin: 0 4px; border-radius: 1px;\n    }\n    .step.done + .step-bar { background: var(--green); }\n\n    /* ===== Panel card ===== */\n    .panel {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      display: none; overflow: hidden;\n    }\n    .panel.active { display: block; }\n    .panel-head {\n      padding: 22px 28px 18px;\n      border-bottom: 1px solid var(--border);\n    }\n    .panel-head h2 {\n      font-size: 18px; font-weight: 700; letter-spacing: -0.01em;\n      color: var(--text); margin-bottom: 4px;\n    }\n    .panel-head p { color: var(--text-muted); font-size: 13px; }\n    .panel-body { padding: 28px; }\n\n    /* ===== Step 1: Source cards ===== */\n    .source-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr);\n      gap: 16px;\n    }\n    .source-card {\n      background: var(--surface); border: 1.5px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      cursor: pointer; transition: all 0.2s ease;\n      display: flex; flex-direction: column; gap: 14px;\n      text-align: left;\n    }\n    .source-card:hover {\n      border-color: var(--blue); transform: translateY(-2px);\n      box-shadow: var(--shadow);\n    }\n    .source-card.selected {\n      border-color: var(--pink);\n      box-shadow: 0 0 0 3px rgba(255,73,152,0.12);\n    }\n    .source-head { display: flex; align-items: center; gap: 14px; }\n    .source-logo {\n      width: 48px; height: 48px; border-radius: 12px;\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 800; font-size: 18px;\n      letter-spacing: -0.02em; flex-shrink: 0;\n      box-shadow: 0 4px 12px rgba(26,31,54,0.1);\n    }\n    .source-logo.appfolio { background: linear-gradient(135deg, #0d47a1, #1976d2); }\n    .source-logo.buildium { background: linear-gradient(135deg, #00897b, #4db6ac); }\n    .source-logo.doorloop { background: linear-gradient(135deg, #6a1b9a, #ab47bc); }\n    .source-logo.csv { background: linear-gradient(135deg, var(--navy), var(--blue-bright)); }\n    .source-name { font-weight: 700; font-size: 16px; color: var(--text); letter-spacing: -0.01em; }\n    .source-meta { font-size: 12px; color: var(--text-faint); margin-top: 2px; }\n    .source-desc { color: var(--text-muted); font-size: 13px; line-height: 1.55; }\n    .source-chips { display: flex; flex-wrap: wrap; gap: 6px; }\n    .source-chip {\n      font-size: 11px; font-weight: 600;\n      background: var(--blue-pale); color: var(--blue);\n      padding: 4px 9px; border-radius: 100px;\n    }\n    .source-cta {\n      margin-top: auto;\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 13px; font-weight: 600; color: var(--blue);\n      padding-top: 10px; border-top: 1px solid var(--border);\n    }\n    .source-card:hover .source-cta { color: var(--pink); }\n\n    /* ===== Step 2: Upload ===== */\n    .dropzone {\n      border: 2px dashed var(--border-strong);\n      border-radius: var(--radius-lg);\n      padding: 56px 32px; text-align: center;\n      background: var(--surface-subtle);\n      transition: all 0.2s ease; cursor: pointer;\n    }\n    .dropzone:hover, .dropzone.hover {\n      border-color: var(--blue);\n      background: var(--blue-pale);\n    }\n    .dropzone-icon {\n      width: 56px; height: 56px; border-radius: 14px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 16px;\n    }\n    .dropzone-icon svg { width: 26px; height: 26px; }\n    .dropzone h3 {\n      font-size: 16px; font-weight: 700; color: var(--text);\n      margin-bottom: 6px; letter-spacing: -0.01em;\n    }\n    .dropzone p { color: var(--text-muted); font-size: 13px; margin-bottom: 14px; }\n    .dropzone-meta {\n      font-size: 12px; color: var(--text-faint);\n      display: flex; align-items: center; justify-content: center; gap: 14px;\n    }\n    .dropzone-meta span { display: inline-flex; align-items: center; gap: 5px; }\n    .dropzone-meta svg { width: 12px; height: 12px; }\n\n    .uploaded-file {\n      display: flex; align-items: center; gap: 14px;\n      padding: 16px 18px; background: var(--surface);\n      border: 1.5px solid var(--green);\n      border-radius: var(--radius-lg); margin-top: 16px;\n      box-shadow: 0 0 0 3px rgba(30,169,124,0.08);\n    }\n    .file-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .file-icon svg { width: 20px; height: 20px; }\n    .file-info { flex: 1; min-width: 0; }\n    .file-name { font-weight: 600; color: var(--text); font-size: 14px; }\n    .file-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .file-remove {\n      color: var(--text-faint); padding: 6px; border-radius: 6px;\n      transition: all 0.15s ease;\n    }\n    .file-remove:hover { background: var(--red-bg); color: var(--red); }\n    .file-remove svg { width: 16px; height: 16px; }\n\n    .format-hint {\n      margin-top: 18px; padding: 14px 16px;\n      background: var(--blue-pale); border-radius: var(--radius);\n      font-size: 12px; color: var(--blue);\n      display: flex; align-items: flex-start; gap: 10px;\n    }\n    .format-hint svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }\n    .format-hint strong { font-weight: 700; }\n    .format-hint a { color: var(--blue); text-decoration: underline; font-weight: 600; }\n\n    /* ===== Step 3: Mapping ===== */\n    .map-table {\n      width: 100%; border-collapse: collapse;\n    }\n    .map-table thead th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.08em;\n      color: var(--text-muted); padding: 10px 14px;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .map-table tbody td {\n      padding: 12px 14px; border-bottom: 1px solid var(--border);\n      font-size: 13px; vertical-align: middle;\n    }\n    .map-table tbody tr:last-child td { border-bottom: none; }\n    .col-name {\n      font-family: 'JetBrains Mono', monospace; font-weight: 500;\n      color: var(--text); font-size: 12px;\n    }\n    .col-sample { color: var(--text-faint); font-size: 12px; font-style: italic; }\n    .map-arrow { color: var(--text-faint); text-align: center; }\n    .map-arrow svg { width: 16px; height: 16px; margin: 0 auto; }\n    .map-select {\n      width: 100%; padding: 8px 32px 8px 12px;\n      border: 1px solid var(--border); border-radius: 8px;\n      background: var(--surface); color: var(--text);\n      font-size: 13px; font-weight: 500;\n      cursor: pointer; transition: all 0.15s ease;\n      appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat;\n      background-position: right 10px center;\n    }\n    .map-select:hover { border-color: var(--blue); }\n    .map-select:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .map-select.unsure { border-color: var(--orange); background-color: rgba(234,140,58,0.04); }\n    .map-status { text-align: right; }\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 10px; font-weight: 700;\n      padding: 3px 8px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.04em;\n    }\n    .pill.confident { background: var(--green-bg); color: var(--green-dark); }\n    .pill.unsure { background: var(--orange-bg); color: var(--orange); }\n    .pill.skip { background: var(--surface-alt); color: var(--text-faint); }\n    .pill svg { width: 10px; height: 10px; }\n\n    /* ===== Step 4: Preview ===== */\n    .preview-stats {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 12px; margin-bottom: 22px;\n    }\n    .stat-card {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px;\n      display: flex; align-items: center; gap: 12px;\n    }\n    .stat-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .stat-icon svg { width: 20px; height: 20px; }\n    .stat-val { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }\n    .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }\n\n    .preview-section-title {\n      font-size: 13px; font-weight: 700; color: var(--text);\n      margin-bottom: 10px; letter-spacing: -0.01em;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .preview-section-title span { font-size: 11px; font-weight: 500; color: var(--text-faint); }\n\n    .preview-table {\n      width: 100%; border-collapse: collapse;\n      border: 1px solid var(--border);\n      border-radius: var(--radius); overflow: hidden;\n    }\n    .preview-table thead th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n      color: var(--text-muted); padding: 10px 12px;\n      background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n      white-space: nowrap;\n    }\n    .preview-table tbody td {\n      padding: 11px 12px; font-size: 12px; color: var(--text);\n      border-bottom: 1px solid var(--border);\n    }\n    .preview-table tbody tr:last-child td { border-bottom: none; }\n    .preview-table tbody tr:hover { background: var(--surface-subtle); }\n\n    .error-row {\n      margin-top: 14px;\n      display: flex; align-items: center; gap: 12px;\n      padding: 14px 16px;\n      background: var(--red-bg); border: 1px solid rgba(214,69,69,0.25);\n      border-radius: var(--radius); cursor: pointer;\n      transition: all 0.15s ease;\n    }\n    .error-row:hover { background: rgba(214,69,69,0.18); }\n    .error-row svg { width: 18px; height: 18px; color: var(--red); flex-shrink: 0; }\n    .error-row-text { flex: 1; font-size: 13px; color: var(--red); font-weight: 600; }\n    .error-row-cta { font-size: 12px; color: var(--red); font-weight: 700; }\n\n    /* ===== Step 5: Import progress ===== */\n    .import-progress {\n      padding: 40px 20px; text-align: center;\n    }\n    .progress-icon {\n      width: 72px; height: 72px; border-radius: 50%;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 18px;\n      animation: pulse 1.6s ease-in-out infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(18,81,173,0.25); }\n      50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(18,81,173,0); }\n    }\n    .progress-icon svg { width: 32px; height: 32px; }\n    .progress-title {\n      font-size: 20px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.02em; margin-bottom: 6px;\n    }\n    .progress-sub {\n      font-size: 13px; color: var(--text-muted); margin-bottom: 24px;\n    }\n    .progress-bar-wrap {\n      max-width: 460px; margin: 0 auto;\n      background: var(--surface-alt); border-radius: 100px;\n      height: 10px; overflow: hidden;\n      border: 1px solid var(--border);\n    }\n    .progress-bar {\n      height: 100%;\n      background: linear-gradient(90deg, var(--blue-bright), var(--pink));\n      width: 0%; border-radius: 100px;\n      transition: width 0.3s ease;\n    }\n    .progress-pct {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 12px; color: var(--text-muted); margin-top: 10px;\n    }\n    .progress-log {\n      max-width: 460px; margin: 22px auto 0;\n      text-align: left; font-family: 'JetBrains Mono', monospace;\n      font-size: 11px; color: var(--text-muted);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n      height: 120px; overflow-y: auto;\n    }\n    .progress-log div { padding: 2px 0; }\n    .progress-log .ok { color: var(--green-dark); }\n    .progress-log .info { color: var(--blue); }\n\n    /* Success overlay */\n    .success-panel {\n      display: none;\n      padding: 40px 28px; text-align: center;\n    }\n    .success-panel.shown { display: block; }\n    .success-icon {\n      width: 84px; height: 84px; border-radius: 50%;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 20px;\n      animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1);\n    }\n    @keyframes pop {\n      0% { transform: scale(0); opacity: 0; }\n      60% { transform: scale(1.12); }\n      100% { transform: scale(1); opacity: 1; }\n    }\n    .success-icon svg { width: 40px; height: 40px; }\n    .success-panel h3 {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; margin-bottom: 8px;\n    }\n    .success-panel > p {\n      color: var(--text-muted); font-size: 14px; margin-bottom: 28px;\n    }\n    .success-stats {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 12px; max-width: 540px; margin: 0 auto 28px;\n    }\n    .success-stat {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 18px 14px;\n    }\n    .success-stat .num {\n      font-size: 28px; font-weight: 800; color: var(--green-dark);\n      letter-spacing: -0.02em; line-height: 1;\n    }\n    .success-stat .lbl {\n      font-size: 12px; color: var(--text-muted); margin-top: 6px; font-weight: 500;\n    }\n    .success-actions {\n      display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;\n    }\n\n    /* ===== Panel footer ===== */\n    .panel-footer {\n      padding: 16px 28px;\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 12px;\n    }\n    .footer-left { font-size: 12px; color: var(--text-faint); }\n    .footer-right { display: flex; gap: 10px; }\n\n    /* ===== Bottom skip link ===== */\n    .skip-link {\n      text-align: center; margin-top: 18px;\n      font-size: 12px; color: var(--text-faint);\n    }\n    .skip-link a { color: var(--text-muted); text-decoration: underline; font-weight: 500; }\n    .skip-link a:hover { color: var(--blue); }\n\n  ";

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
        </div>

        <div className="sb-section-label" style={{marginTop: "20px"}}>Workspace</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5" /></svg>Settings
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
          <a href="admin-v2.html">Workspace</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <a href="settings.html">Settings</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Bulk import</strong>
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
        </div>
      </div>

      
      <div className="content">

        <div className="page-head">
          <h1>Import tenants, leases, and properties from your old system</h1>
          <p>Bring your existing portfolio into Black Bear Rentals in five guided steps. We'll auto-detect common exports from AppFolio, Buildium, and DoorLoop — and you can map columns yourself if you're coming from something custom.</p>
        </div>

        
        <div className="stepper" id="stepper">
          <div className="step active" data-step="1">
            <div className="step-num">1</div>
            <div>
              <div className="step-label">Source</div>
              <div className="step-sub">Pick your old system</div>
            </div>
          </div>
          <div className="step-bar" />
          <div className="step" data-step="2">
            <div className="step-num">2</div>
            <div>
              <div className="step-label">Upload</div>
              <div className="step-sub">Drop the CSV</div>
            </div>
          </div>
          <div className="step-bar" />
          <div className="step" data-step="3">
            <div className="step-num">3</div>
            <div>
              <div className="step-label">Map</div>
              <div className="step-sub">Match columns</div>
            </div>
          </div>
          <div className="step-bar" />
          <div className="step" data-step="4">
            <div className="step-num">4</div>
            <div>
              <div className="step-label">Preview</div>
              <div className="step-sub">Review rows</div>
            </div>
          </div>
          <div className="step-bar" />
          <div className="step" data-step="5">
            <div className="step-num">5</div>
            <div>
              <div className="step-label">Import</div>
              <div className="step-sub">Go live</div>
            </div>
          </div>
        </div>

        
        <div className="panel active" data-panel="1">
          <div className="panel-head">
            <h2>Where's your data coming from?</h2>
            <p>Select your previous property management system. We'll auto-detect the column layout and pre-map fields for you.</p>
          </div>
          <div className="panel-body">
            <div className="source-grid">

              <button className="source-card" data-source="appfolio">
                <div className="source-head">
                  <div className="source-logo appfolio">Af</div>
                  <div>
                    <div className="source-name">AppFolio</div>
                    <div className="source-meta">Property Manager export · tenants.csv</div>
                  </div>
                </div>
                <div className="source-desc">We recognize AppFolio's "Tenant Directory" and "Rent Roll" exports, including unit references and move-in dates.</div>
                <div className="source-chips">
                  <span className="source-chip">Tenant Name</span>
                  <span className="source-chip">Unit</span>
                  <span className="source-chip">Rent</span>
                  <span className="source-chip">Move-in</span>
                </div>
                <div className="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </button>

              <button className="source-card" data-source="buildium">
                <div className="source-head">
                  <div className="source-logo buildium">Bu</div>
                  <div>
                    <div className="source-name">Buildium</div>
                    <div className="source-meta">Rentals export · rental_owners.xlsx</div>
                  </div>
                </div>
                <div className="source-desc">Reads Buildium's Lease Listing and Tenant Balance reports. Handles co-tenants and security deposit fields automatically.</div>
                <div className="source-chips">
                  <span className="source-chip">Lease Start</span>
                  <span className="source-chip">Lease End</span>
                  <span className="source-chip">Deposit</span>
                  <span className="source-chip">Balance</span>
                </div>
                <div className="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </button>

              <button className="source-card" data-source="doorloop">
                <div className="source-head">
                  <div className="source-logo doorloop">Dl</div>
                  <div>
                    <div className="source-name">DoorLoop</div>
                    <div className="source-meta">People export · tenants_full.csv</div>
                  </div>
                </div>
                <div className="source-desc">Parses DoorLoop's People and Lease exports. Pulls emergency contacts, vehicle info, and notes into custom fields.</div>
                <div className="source-chips">
                  <span className="source-chip">Full Name</span>
                  <span className="source-chip">Email</span>
                  <span className="source-chip">Phone</span>
                  <span className="source-chip">Notes</span>
                </div>
                <div className="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </button>

              <button className="source-card" data-source="csv">
                <div className="source-head">
                  <div className="source-logo csv">Cs</div>
                  <div>
                    <div className="source-name">Generic CSV</div>
                    <div className="source-meta">Spreadsheet · any format</div>
                  </div>
                </div>
                <div className="source-desc">Coming from Excel, Google Sheets, or a custom system? Upload any CSV and we'll walk you through mapping it yourself.</div>
                <div className="source-chips">
                  <span className="source-chip">Any columns</span>
                  <span className="source-chip">Manual mapping</span>
                </div>
                <div className="source-cta">
                  Use my own spreadsheet
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </button>

            </div>
          </div>
          <div className="panel-footer">
            <div className="footer-left">Step 1 of 5 · Pick a source to continue</div>
            <div className="footer-right">
              <button className="btn btn-ghost" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary" id="next-1" disabled>
                Next: Upload
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        
        <div className="panel" data-panel="2">
          <div className="panel-head">
            <h2>Upload your <span id="source-name-2">AppFolio</span> export</h2>
            <p>Drop the file below or click to browse. We accept .csv and .xlsx up to 25 MB.</p>
          </div>
          <div className="panel-body">
            <div className="dropzone" id="dropzone">
              <div className="dropzone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </div>
              <h3>Drop your file here, or click to browse</h3>
              <p>We'll scan the first 1,000 rows to auto-detect columns.</p>
              <div className="dropzone-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  .csv, .xlsx
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Up to 25 MB
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Encrypted in transit
                </span>
              </div>
            </div>

            <div className="uploaded-file" id="uploaded-file" style={{display: "none"}}>
              <div className="file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
              </div>
              <div className="file-info">
                <div className="file-name">blackbear_tenants_export_2026-04-14.csv</div>
                <div className="file-meta">284 KB · 47 rows · 18 columns detected · Parsed in 0.3s</div>
              </div>
              <button className="file-remove" id="file-remove" title="Remove file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="format-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              <div>
                <strong>Not sure which file?</strong> From <span id="source-name-hint">AppFolio</span>, go to <em>Reports → Tenant Directory → Export CSV</em>. First row should be column headers.
                <a href="#">Download a sample CSV template</a>.
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <div className="footer-left">Step 2 of 5 · Upload your export</div>
            <div className="footer-right">
              <button className="btn btn-ghost" data-back="">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary" id="next-2" disabled>
                Next: Map columns
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        
        <div className="panel" data-panel="3">
          <div className="panel-head">
            <h2>Map your columns</h2>
            <p>We auto-detected most of your fields. Review the matches below — amber rows need your attention before you can continue.</p>
          </div>
          <div className="panel-body" style={{padding: "0"}}>
            <table className="map-table">
              <thead>
                <tr>
                  <th style={{width: "28%"}}>Your column</th>
                  <th style={{width: "20%"}}>Sample value</th>
                  <th style={{width: "4%"}} />
                  <th style={{width: "32%"}}>Black Bear Rentals field</th>
                  <th style={{width: "16%", textAlign: "right"}}>Status</th>
                </tr>
              </thead>
              <tbody id="map-tbody" />
            </table>
          </div>
          <div className="panel-footer">
            <div className="footer-left"><span id="map-summary">10 of 12 mapped · 2 unsure</span></div>
            <div className="footer-right">
              <button className="btn btn-ghost" data-back="">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-primary" id="next-3">
                Next: Preview
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        
        <div className="panel" data-panel="4">
          <div className="panel-head">
            <h2>Preview your import</h2>
            <p>Here's how the first 5 rows will look in Black Bear Rentals. Everything green is ready. Anything red needs a second look.</p>
          </div>
          <div className="panel-body">

            <div className="preview-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div>
                  <div className="stat-val">47</div>
                  <div className="stat-label">Tenants ready to import</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>
                </div>
                <div>
                  <div className="stat-val">12</div>
                  <div className="stat-label">Leases detected</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                </div>
                <div>
                  <div className="stat-val">4</div>
                  <div className="stat-label">Properties to create</div>
                </div>
              </div>
            </div>

            <div className="preview-section-title">
              Sample rows <span>Showing 5 of 47</span>
            </div>

            <div style={{overflowX: "auto"}}>
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Property</th>
                    <th>Room</th>
                    <th>Rent</th>
                    <th>Lease start</th>
                    <th>Lease end</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Marcus Whitfield</td>
                    <td>marcus.w@gmail.com</td>
                    <td>(256) 555-0142</td>
                    <td>3026 Turf Ave NW</td>
                    <td>A</td>
                    <td>$925</td>
                    <td>Aug 1, 2025</td>
                    <td>Jul 31, 2026</td>
                  </tr>
                  <tr>
                    <td>Jasmine Okonkwo</td>
                    <td>jokonkwo@outlook.com</td>
                    <td>(256) 555-0198</td>
                    <td>3026 Turf Ave NW</td>
                    <td>B</td>
                    <td>$950</td>
                    <td>Sep 15, 2025</td>
                    <td>Sep 14, 2026</td>
                  </tr>
                  <tr>
                    <td>Devon Ramirez</td>
                    <td>devon.ramirez@yahoo.com</td>
                    <td>(256) 555-0276</td>
                    <td>908 Lee Dr NW</td>
                    <td>2</td>
                    <td>$875</td>
                    <td>Jun 1, 2025</td>
                    <td>May 31, 2026</td>
                  </tr>
                  <tr>
                    <td>Priya Shankar</td>
                    <td>p.shankar@uah.edu</td>
                    <td>(256) 555-0311</td>
                    <td>908 Lee Dr NW</td>
                    <td>3</td>
                    <td>$895</td>
                    <td>Jan 8, 2026</td>
                    <td>Jan 7, 2027</td>
                  </tr>
                  <tr>
                    <td>Thomas Breaux</td>
                    <td>tbreaux.work@icloud.com</td>
                    <td>(256) 555-0489</td>
                    <td>1205 Poplar St SW</td>
                    <td>Whole</td>
                    <td>$1,450</td>
                    <td>Oct 1, 2025</td>
                    <td>Sep 30, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="error-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              <div className="error-row-text">3 validation errors detected — missing email, bad phone format, and a lease end before start</div>
              <div className="error-row-cta">Click to review →</div>
            </div>

          </div>
          <div className="panel-footer">
            <div className="footer-left">Step 4 of 5 · Clean import looks ready</div>
            <div className="footer-right">
              <button className="btn btn-ghost" data-back="">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
              </button>
              <button className="btn btn-pink" id="next-4">
                Start import
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        
        <div className="panel" data-panel="5">
          <div className="panel-head">
            <h2>Importing to Black Bear Rentals</h2>
            <p>Hang tight — we're writing everything into your workspace. This usually takes under a minute.</p>
          </div>
          <div className="panel-body">

            
            <div className="import-progress" id="import-progress">
              <div className="progress-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              </div>
              <div className="progress-title" id="progress-title">Importing your records…</div>
              <div className="progress-sub" id="progress-sub">Writing tenants, leases, and properties into Black Bear Rentals.</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" id="progress-bar" />
              </div>
              <div className="progress-pct" id="progress-pct">0%</div>
              <div className="progress-log" id="progress-log">
                <div className="info">→ Preparing import payload…</div>
              </div>
            </div>

            
            <div className="success-panel" id="success-panel">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <h3>Your portfolio is live in Black Bear Rentals</h3>
              <p>All done. You can manage your tenants, leases, and properties like you've always been here.</p>
              <div className="success-stats">
                <div className="success-stat">
                  <div className="num">47</div>
                  <div className="lbl">Tenants imported</div>
                </div>
                <div className="success-stat">
                  <div className="num">12</div>
                  <div className="lbl">Leases imported</div>
                </div>
                <div className="success-stat">
                  <div className="num">4</div>
                  <div className="lbl">Properties created</div>
                </div>
              </div>
              <div className="success-actions">
                <a className="btn btn-primary" href="tenants.html">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  Go to Tenants
                </a>
                <a className="btn btn-ghost" href="admin-v2.html">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
                  Go to Dashboard
                </a>
                <button className="btn btn-ghost" id="btn-another">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /></svg>
                  Import another batch
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="skip-link">
          <a href="settings.html">I'll import manually later — take me back to Settings</a>
        </div>

      </div>

    </main>
  </div>

  


    </>
  );
}
