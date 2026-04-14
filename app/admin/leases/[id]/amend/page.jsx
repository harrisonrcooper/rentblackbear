"use client";

// Mock ported from ~/Desktop/tenantory/lease-amendment.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    /* Topbar */\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 28px 32px 48px; }\n\n    /* Secondary breadcrumb */\n    .subcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 12px; color: var(--text-faint);\n      font-weight: 500; margin-bottom: 18px;\n    }\n    .subcrumb a { color: var(--text-muted); }\n    .subcrumb a:hover { color: var(--blue); }\n    .subcrumb svg { width: 12px; height: 12px; opacity: 0.6; }\n    .subcrumb .current { color: var(--text); font-weight: 600; }\n\n    /* Context card */\n    .ctx-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 22px;\n      display: grid; grid-template-columns: auto 1fr auto auto auto auto; gap: 28px;\n      align-items: center; margin-bottom: 24px;\n      box-shadow: var(--shadow-sm);\n    }\n    .ctx-avatar {\n      width: 52px; height: 52px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      color: #fff; font-weight: 700; font-size: 16px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .ctx-title { font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -0.01em; }\n    .ctx-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }\n    .ctx-sub { font-size: 12.5px; color: var(--text-muted); }\n    .ctx-stat-label {\n      font-size: 10.5px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;\n    }\n    .ctx-stat-value { font-weight: 700; font-size: 14px; color: var(--text); font-variant-numeric: tabular-nums; }\n    .ctx-link {\n      font-size: 12.5px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .ctx-link:hover { color: var(--navy); }\n    .ctx-link svg { width: 12px; height: 12px; }\n\n    /* Page head */\n    .page-head { margin-bottom: 26px; }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.025em;\n      color: var(--text); margin-bottom: 6px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 6px 20px rgba(255,73,152,0.3); }\n    .btn-pink:hover { background: #e8357f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,73,152,0.4); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn-lg { padding: 14px 28px; font-size: 14px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Two-column layout ===== */\n    .two-col {\n      display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; align-items: flex-start;\n    }\n\n    /* ===== Card ===== */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .card-head {\n      padding: 18px 22px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between; gap: 14px;\n    }\n    .card-head h3 {\n      font-size: 15px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em;\n    }\n    .card-head p { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }\n    .card-body { padding: 22px; }\n\n    /* Section spacing for stacked cards */\n    .stack { display: flex; flex-direction: column; gap: 16px; }\n\n    /* ===== Amendment type chips ===== */\n    .type-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;\n    }\n    .type-chip {\n      border: 1.5px solid var(--border); border-radius: 12px;\n      padding: 14px 14px; display: flex; align-items: flex-start; gap: 11px;\n      cursor: pointer; transition: all 0.15s ease;\n      background: var(--surface);\n      text-align: left; position: relative;\n    }\n    .type-chip:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .type-chip.selected {\n      border-color: var(--pink); background: var(--pink-bg);\n      box-shadow: 0 2px 10px rgba(255,73,152,0.12);\n    }\n    .type-chip-icon {\n      width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .type-chip.selected .type-chip-icon { background: #fff; color: var(--pink); }\n    .type-chip-icon svg { width: 16px; height: 16px; }\n    .type-chip-body { flex: 1; min-width: 0; }\n    .type-chip-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }\n    .type-chip-desc { font-size: 11.5px; color: var(--text-muted); line-height: 1.35; }\n    .type-chip-check {\n      position: absolute; top: 10px; right: 10px;\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 1.5px solid var(--border-strong); background: #fff;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .type-chip.selected .type-chip-check { background: var(--pink); border-color: var(--pink); }\n    .type-chip-check svg { width: 10px; height: 10px; color: #fff; opacity: 0; }\n    .type-chip.selected .type-chip-check svg { opacity: 1; }\n\n    /* ===== Form fields ===== */\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }\n    .field-hint { font-size: 11.5px; color: var(--text-faint); }\n    .input, .select, .textarea {\n      border: 1.5px solid var(--border); border-radius: 10px;\n      padding: 10px 13px; font-size: 13.5px; background: var(--surface);\n      transition: all 0.15s ease; width: 100%;\n      color: var(--text);\n    }\n    .input:focus, .select:focus, .textarea:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .textarea { resize: vertical; min-height: 84px; line-height: 1.5; font-family: inherit; }\n    .select {\n      appearance: none; -webkit-appearance: none;\n      background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\");\n      background-repeat: no-repeat; background-position: right 12px center; background-size: 14px;\n      padding-right: 36px;\n    }\n\n    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }\n\n    .input-addon-wrap { position: relative; }\n    .input-addon {\n      position: absolute; left: 13px; top: 50%; transform: translateY(-50%);\n      font-weight: 600; color: var(--text-muted); font-size: 13.5px; pointer-events: none;\n    }\n    .input-addon-wrap .input { padding-left: 28px; font-variant-numeric: tabular-nums; font-weight: 600; }\n\n    /* Conditional panels */\n    .cond {\n      display: none;\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      background: var(--surface);\n      overflow: hidden;\n    }\n    .cond.visible { display: block; animation: slideDown 0.25s ease; }\n    @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }\n    .cond-head {\n      padding: 14px 20px; background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; gap: 10px;\n    }\n    .cond-head-icon {\n      width: 28px; height: 28px; border-radius: 7px;\n      background: var(--pink-bg); color: var(--pink);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .cond-head-icon svg { width: 14px; height: 14px; }\n    .cond-head h4 { font-size: 13.5px; font-weight: 700; color: var(--text); }\n    .cond-head-meta { margin-left: auto; font-size: 11.5px; color: var(--text-muted); }\n    .cond-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }\n\n    /* Legal notice strip */\n    .notice {\n      display: flex; gap: 10px; padding: 12px 14px;\n      background: var(--blue-pale); border: 1px solid #d7e3fb;\n      border-radius: 10px; font-size: 12.5px; color: var(--navy-dark);\n      line-height: 1.5;\n    }\n    .notice svg { width: 16px; height: 16px; flex-shrink: 0; color: var(--blue); margin-top: 1px; }\n    .notice strong { color: var(--navy-darker); font-weight: 700; }\n    .notice.warn { background: #fff7ed; border-color: #ffe0bf; color: #8a4b10; }\n    .notice.warn svg { color: var(--orange); }\n    .notice.danger { background: var(--red-bg); border-color: #fbd0d0; color: #8a2525; }\n    .notice.danger svg { color: var(--red); }\n\n    /* Split rent toggle */\n    .toggle-row {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px;\n      background: var(--surface-subtle);\n    }\n    .toggle-row + .toggle-row { margin-top: 8px; }\n    .toggle-row-label { font-size: 13px; font-weight: 600; color: var(--text); }\n    .toggle-row-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n    .switch { position: relative; width: 38px; height: 22px; flex-shrink: 0; }\n    .switch input { opacity: 0; width: 0; height: 0; }\n    .switch-slider {\n      position: absolute; inset: 0; background: var(--border-strong);\n      border-radius: 100px; cursor: pointer; transition: 0.2s;\n    }\n    .switch-slider::before {\n      content: \"\"; position: absolute; top: 3px; left: 3px;\n      width: 16px; height: 16px; background: #fff; border-radius: 50%;\n      transition: 0.2s; box-shadow: var(--shadow-sm);\n    }\n    .switch input:checked + .switch-slider { background: var(--pink); }\n    .switch input:checked + .switch-slider::before { transform: translateX(16px); }\n\n    /* File upload */\n    .upload {\n      border: 2px dashed var(--border-strong);\n      border-radius: 10px; padding: 18px; text-align: center;\n      background: var(--surface-subtle); transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .upload:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .upload svg { width: 22px; height: 22px; color: var(--text-muted); margin: 0 auto 8px; }\n    .upload-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .upload-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n\n    /* Character count */\n    .char-count {\n      text-align: right; font-size: 11px; color: var(--text-faint);\n      margin-top: -4px; font-variant-numeric: tabular-nums;\n    }\n\n    /* Roommate applicant card */\n    .applicant-card {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border: 1px solid var(--border);\n      border-radius: 10px; background: var(--surface-subtle);\n    }\n    .applicant-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px;\n    }\n    .applicant-body { flex: 1; min-width: 0; }\n    .applicant-name { font-size: 13px; font-weight: 600; color: var(--text); }\n    .applicant-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }\n\n    /* Pill */\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 600; padding: 3px 9px;\n      border-radius: 100px; white-space: nowrap;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill svg { width: 10px; height: 10px; }\n\n    /* Preview column (right) */\n    .preview-wrap {\n      position: sticky; top: 24px;\n      display: flex; flex-direction: column; gap: 14px;\n    }\n    .preview-head {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 0 4px;\n    }\n    .preview-head-title {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.12em;\n      display: flex; align-items: center; gap: 7px;\n    }\n    .preview-head-title::before {\n      content: \"\"; width: 6px; height: 6px; border-radius: 50%;\n      background: var(--pink); box-shadow: 0 0 0 3px var(--pink-bg);\n    }\n    .preview-zoom {\n      font-size: 11px; color: var(--text-muted); font-weight: 600;\n      display: inline-flex; align-items: center; gap: 8px;\n    }\n\n    /* PDF-looking preview */\n    .preview-doc {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: 12px; box-shadow: var(--shadow-lg);\n      overflow: hidden;\n      max-height: calc(100vh - 120px);\n      overflow-y: auto;\n    }\n    .preview-doc::-webkit-scrollbar { width: 6px; }\n    .preview-doc::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }\n    .preview-page {\n      padding: 42px 44px 52px;\n      font-family: 'Lora', Georgia, serif;\n      color: #1a1a1a; font-size: 12.5px; line-height: 1.6;\n    }\n    .preview-header-bar {\n      display: flex; align-items: center; justify-content: space-between;\n      padding-bottom: 14px; border-bottom: 1.5px solid #111;\n      margin-bottom: 22px;\n    }\n    .preview-brand {\n      font-family: 'Inter', sans-serif;\n      font-size: 10px; font-weight: 800; color: #111;\n      letter-spacing: 0.18em; text-transform: uppercase;\n    }\n    .preview-doc-id {\n      font-family: 'JetBrains Mono', monospace; font-size: 9.5px;\n      color: #666; letter-spacing: 0.04em;\n    }\n    .preview-title {\n      font-family: 'Lora', serif; font-size: 20px; font-weight: 600;\n      color: #111; text-align: center; margin-bottom: 6px; letter-spacing: -0.01em;\n    }\n    .preview-sub {\n      font-family: 'Inter', sans-serif; font-size: 10.5px;\n      color: #666; text-align: center; margin-bottom: 26px;\n      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;\n    }\n    .preview-section { margin-bottom: 18px; }\n    .preview-section-h {\n      font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 800;\n      color: #111; text-transform: uppercase; letter-spacing: 0.1em;\n      margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #ddd;\n    }\n    .preview-section p { margin-bottom: 6px; }\n    .preview-section em { font-style: italic; color: #444; }\n    .preview-kv { display: flex; justify-content: space-between; gap: 12px; font-family: 'Inter', sans-serif; font-size: 11.5px; padding: 3px 0; }\n    .preview-kv dt { color: #666; }\n    .preview-kv dd { color: #111; font-weight: 600; font-variant-numeric: tabular-nums; }\n    .preview-change {\n      margin-bottom: 14px; padding: 10px 12px;\n      background: #fcfbf5; border-left: 3px solid var(--pink);\n      border-radius: 0 6px 6px 0;\n    }\n    .preview-change-h {\n      font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 800;\n      color: var(--pink); text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 4px;\n    }\n    .preview-change-body { font-size: 12px; color: #222; }\n    .preview-change-body strong { font-weight: 600; color: #111; }\n    .preview-placeholder {\n      text-align: center; padding: 40px 20px; font-family: 'Inter', sans-serif;\n      font-size: 12.5px; color: #999;\n    }\n    .preview-placeholder svg { width: 32px; height: 32px; margin: 0 auto 12px; color: #ccc; }\n    .preview-signatures {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 28px;\n      margin-top: 32px; padding-top: 20px; border-top: 1px solid #ddd;\n    }\n    .preview-sig-block { font-family: 'Inter', sans-serif; }\n    .preview-sig-line {\n      height: 36px; border-bottom: 1.5px solid #111; margin-bottom: 6px;\n      display: flex; align-items: flex-end; padding-bottom: 2px;\n      font-family: 'Caveat', cursive; font-size: 18px; color: #999;\n    }\n    .preview-sig-label { font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }\n    .preview-sig-name { font-size: 12px; color: #111; font-weight: 600; margin-top: 2px; }\n    .preview-sig-date { font-size: 10px; color: #666; margin-top: 6px; }\n\n    .preview-footer {\n      margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc;\n      font-family: 'Inter', sans-serif; font-size: 9.5px; color: #999;\n      display: flex; justify-content: space-between;\n    }\n\n    /* Bottom CTA bar */\n    .cta-bar {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 18px 22px; margin-top: 24px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 18px; box-shadow: var(--shadow-sm);\n    }\n    .cta-bar-info { display: flex; align-items: center; gap: 14px; }\n    .cta-bar-icon {\n      width: 44px; height: 44px; border-radius: 11px;\n      background: linear-gradient(135deg, var(--pink), #e85a9a);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; box-shadow: 0 4px 12px rgba(255,73,152,0.3);\n    }\n    .cta-bar-icon svg { width: 20px; height: 20px; }\n    .cta-bar-title { font-size: 14px; font-weight: 700; color: var(--text); }\n    .cta-bar-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .cta-bar-actions { display: flex; gap: 10px; align-items: center; }\n\n    /* Activity log */\n    .activity-log { margin-top: 28px; }\n    .activity-log h3 {\n      font-size: 14px; font-weight: 700; color: var(--text);\n      margin-bottom: 14px; display: flex; align-items: center; gap: 8px;\n    }\n    .activity-log h3 svg { width: 16px; height: 16px; color: var(--text-muted); }\n    .log-list { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }\n    .log-row {\n      display: flex; gap: 14px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border); align-items: flex-start;\n    }\n    .log-row:last-child { border-bottom: none; }\n    .log-dot {\n      width: 30px; height: 30px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .log-dot.green { background: var(--green-bg); color: var(--green-dark); }\n    .log-dot.blue { background: var(--blue-pale); color: var(--blue); }\n    .log-dot.pink { background: var(--pink-bg); color: var(--pink); }\n    .log-dot.gray { background: var(--surface-alt); color: var(--text-muted); }\n    .log-dot svg { width: 13px; height: 13px; }\n    .log-body { flex: 1; font-size: 13px; }\n    .log-body strong { color: var(--text); font-weight: 600; }\n    .log-body p { color: var(--text-muted); margin-top: 2px; }\n    .log-time { font-size: 11.5px; color: var(--text-faint); flex-shrink: 0; font-variant-numeric: tabular-nums; }\n\n    /* Modal */\n    .modal-backdrop {\n      position: fixed; inset: 0; background: rgba(26,31,54,0.55);\n      backdrop-filter: blur(4px); z-index: 40;\n      display: none; align-items: center; justify-content: center;\n      padding: 24px;\n    }\n    .modal-backdrop.visible { display: flex; animation: fadeIn 0.18s ease; }\n    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n    .modal {\n      background: #fff; border-radius: 16px;\n      max-width: 520px; width: 100%;\n      box-shadow: var(--shadow-lg); overflow: hidden;\n      animation: popIn 0.22s ease;\n    }\n    @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }\n    .modal-head {\n      padding: 22px 24px 6px;\n    }\n    .modal-head h3 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }\n    .modal-head p { font-size: 13px; color: var(--text-muted); margin-top: 6px; }\n    .modal-body { padding: 16px 24px 6px; }\n    .modal-foot {\n      padding: 16px 24px 20px;\n      display: flex; gap: 10px; justify-content: flex-end;\n    }\n    .recipient-box {\n      display: flex; align-items: center; gap: 12px;\n      padding: 14px; border: 1px solid var(--border);\n      border-radius: 12px; background: var(--surface-alt);\n      margin-bottom: 14px;\n    }\n    .recipient-box .ctx-avatar { width: 40px; height: 40px; font-size: 13px; }\n    .summary-list { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; }\n    .summary-list li { display: flex; gap: 8px; align-items: flex-start; }\n    .summary-list svg { width: 13px; height: 13px; color: var(--green); margin-top: 3px; flex-shrink: 0; }\n    .summary-list span { color: var(--text); }\n\n    /* Success overlay */\n    .success-overlay {\n      position: fixed; inset: 0;\n      background: linear-gradient(180deg, rgba(47,62,131,0.95), rgba(20,32,74,0.98));\n      backdrop-filter: blur(10px);\n      z-index: 50; display: none;\n      align-items: center; justify-content: center; padding: 24px;\n    }\n    .success-overlay.visible { display: flex; animation: fadeIn 0.3s ease; }\n    .success-card {\n      background: #fff; border-radius: 20px;\n      max-width: 560px; width: 100%; overflow: hidden;\n      box-shadow: 0 32px 80px rgba(0,0,0,0.3);\n      animation: popIn 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.2);\n    }\n    .success-head {\n      padding: 36px 36px 24px; text-align: center;\n      background: linear-gradient(180deg, #fff, var(--surface-subtle));\n    }\n    .success-icon {\n      width: 68px; height: 68px; margin: 0 auto 18px;\n      border-radius: 50%; display: flex; align-items: center; justify-content: center;\n      background: linear-gradient(135deg, var(--green), var(--green-dark));\n      color: #fff;\n      box-shadow: 0 12px 30px rgba(30,169,124,0.4);\n      animation: bounceIn 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.2);\n    }\n    @keyframes bounceIn { 0% { transform: scale(0); } 60% { transform: scale(1.1); } 100% { transform: scale(1); } }\n    .success-icon svg { width: 32px; height: 32px; stroke-width: 3; }\n    .success-head h3 { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }\n    .success-head p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }\n\n    .success-timeline {\n      padding: 20px 36px 24px;\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .success-timeline-label {\n      font-size: 10.5px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n    }\n    .success-step {\n      display: flex; gap: 12px; align-items: flex-start;\n      padding: 8px 0;\n    }\n    .success-step-dot {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--surface); border: 2px solid var(--border-strong);\n      flex-shrink: 0; display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint);\n      position: relative;\n    }\n    .success-step.done .success-step-dot {\n      background: var(--green); border-color: var(--green); color: #fff;\n    }\n    .success-step-dot svg { width: 10px; height: 10px; }\n    .success-step-dot::after {\n      content: \"\"; position: absolute; top: 22px; left: 50%;\n      transform: translateX(-50%); width: 2px; height: 14px;\n      background: var(--border);\n    }\n    .success-step:last-child .success-step-dot::after { display: none; }\n    .success-step-body { padding-top: 1px; }\n    .success-step-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .success-step-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }\n\n    .success-foot {\n      padding: 20px 36px 32px;\n      display: flex; gap: 10px; justify-content: center;\n    }\n\n    /* Small util */\n    .hidden { display: none !important; }\n\n  ";

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
          <a className="sb-nav-item" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>Properties
            <span className="sb-nav-count">4</span>
          </a>
          <a className="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Tenants
            <span className="sb-nav-count">12</span>
          </a>
          <a className="sb-nav-item active" href="leases.html">
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
          <strong>Leases</strong>
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

        
        <div className="subcrumb">
          <a href="leases.html">Leases</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <a href="#">Maya Thompson (Room C)</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <span className="current">Amendment</span>
        </div>

        
        <div className="ctx-card">
          <div className="ctx-avatar">MT</div>
          <div>
            <div className="ctx-title-row">
              <div className="ctx-title">Maya Thompson</div>
              <span className="pill pill-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                Active
              </span>
            </div>
            <div className="ctx-sub">3026 Turf Ave NW, Room C &middot; Lease #L-2025-0428</div>
          </div>
          <div>
            <div className="ctx-stat-label">Term</div>
            <div className="ctx-stat-value">Dec 28 2025 → Dec 27 2026</div>
          </div>
          <div>
            <div className="ctx-stat-label">Current rent</div>
            <div className="ctx-stat-value">$895 / month</div>
          </div>
          <div>
            <div className="ctx-stat-label">Days remaining</div>
            <div className="ctx-stat-value">257 of 365</div>
          </div>
          <a className="ctx-link" href="#">
            View full lease
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </a>
        </div>

        
        <div className="page-head">
          <h1>Amend Maya's lease</h1>
          <p>All changes take effect after Maya e-signs. You can stack multiple changes in a single amendment.</p>
        </div>

        
        <div className="two-col">

          
          <div className="stack">

            
            <div className="card">
              <div className="card-head">
                <div>
                  <h3>What are you changing?</h3>
                  <p>Select one or more. The right changes appear below.</p>
                </div>
              </div>
              <div className="card-body">
                <div className="type-grid">
                  <button type="button" className="type-chip" data-type="rent">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Rent change</div>
                      <div className="type-chip-desc">Raise or lower monthly rent</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>

                  <button type="button" className="type-chip" data-type="pet">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="14" r="2" /><path d="M9 10a5 5 0 0 0-4.79 6.94l1.76 5.13A2 2 0 0 0 7.87 23h6.26a2 2 0 0 0 1.9-1.93l1.76-5.13A5 5 0 0 0 13 10z" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Add pet</div>
                      <div className="type-chip-desc">New pet with deposit</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>

                  <button type="button" className="type-chip" data-type="roommate">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Add roommate</div>
                      <div className="type-chip-desc">New co-signer on lease</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>

                  <button type="button" className="type-chip" data-type="extend">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Extend term</div>
                      <div className="type-chip-desc">Push out the end date</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>

                  <button type="button" className="type-chip" data-type="payday">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Change payment day</div>
                      <div className="type-chip-desc">Shift monthly due date</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>

                  <button type="button" className="type-chip" data-type="other">
                    <div className="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></svg></div>
                    <div className="type-chip-body">
                      <div className="type-chip-title">Other clause</div>
                      <div className="type-chip-desc">Free-text addendum</div>
                    </div>
                    <span className="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  </button>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="rent">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <h4>Rent change</h4>
                <div className="cond-head-meta">Current: $895 / month</div>
              </div>
              <div className="cond-body">
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">New monthly rent</label>
                    <div className="input-addon-wrap">
                      <span className="input-addon">$</span>
                      <input className="input" type="number" id="rent-new" value="950" step="5" />
                    </div>
                    <span className="field-hint" id="rent-delta">+$55 / month &middot; +6.1%</span>
                  </div>
                  <div className="field">
                    <label className="field-label">Effective date</label>
                    <input className="input" type="date" id="rent-effective" value="2026-05-14" min="2026-05-14" />
                    <span className="field-hint">Earliest allowed by state notice rules.</span>
                  </div>
                </div>
                <div className="notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <div><strong>30 days notice required</strong> per Alabama Code §35-9A-161 for month-to-month terms. Today is Apr 14 2026 &mdash; earliest effective date is <strong>May 14 2026</strong>. Auto-calculated.</div>
                </div>
                <div className="field">
                  <label className="field-label">Reason (for your records)</label>
                  <select className="select" id="rent-reason">
                    <option value="market">Market adjustment</option>
                    <option value="capex">Capex recovery (improvements to unit)</option>
                    <option value="tenant-added">Added tenant / roommate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="pet">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="14" r="2" /><path d="M9 10a5 5 0 0 0-4.79 6.94l1.76 5.13A2 2 0 0 0 7.87 23h6.26a2 2 0 0 0 1.9-1.93l1.76-5.13A5 5 0 0 0 13 10z" /></svg>
                </div>
                <h4>Pet details</h4>
                <div className="cond-head-meta">Black Bear policy: 2 pets max, 50 lb each</div>
              </div>
              <div className="cond-body">
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">Pet type</label>
                    <select className="select" id="pet-type">
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Small mammal</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Pet name</label>
                    <input className="input" id="pet-name" placeholder="e.g. Biscuit" value="Biscuit" />
                  </div>
                </div>
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">Breed</label>
                    <input className="input" id="pet-breed" placeholder="e.g. Mini Goldendoodle" value="Mini Goldendoodle" />
                  </div>
                  <div className="field">
                    <label className="field-label">Weight (lbs)</label>
                    <input className="input" type="number" id="pet-weight" value="22" />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Pet deposit</label>
                  <div className="input-addon-wrap">
                    <span className="input-addon">$</span>
                    <input className="input" type="number" id="pet-deposit" value="250" step="25" />
                  </div>
                  <span className="field-hint">Default $250 &middot; Refundable on move-out (less damages).</span>
                </div>
                <div className="field">
                  <label className="field-label">Vaccination / license records</label>
                  <div className="upload">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                    <div className="upload-title">Drop file or click to upload</div>
                    <div className="upload-sub">PDF, JPG, PNG &middot; up to 10 MB</div>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Pet rules (editable)</label>
                  <textarea className="textarea" id="pet-rules">Pet must be leashed in common areas. Tenant is responsible for all damages caused by pet and for cleaning any waste from grounds. Excessive noise may result in removal of pet privileges with 14 days notice.</textarea>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="roommate">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h4>Add roommate</h4>
                <div className="cond-head-meta">They become jointly and severally liable</div>
              </div>
              <div className="cond-body">
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">Full name</label>
                    <input className="input" id="rm-name" value="Jordan Patel" />
                  </div>
                  <div className="field">
                    <label className="field-label">Email</label>
                    <input className="input" type="email" id="rm-email" value="jordan.patel@gmail.com" />
                  </div>
                </div>

                <div>
                  <label className="field-label" style={{display: "block", marginBottom: "8px"}}>Application status</label>
                  <div className="applicant-card">
                    <div className="applicant-avatar">JP</div>
                    <div className="applicant-body">
                      <div className="applicant-name">Jordan Patel</div>
                      <div className="applicant-sub">Credit 742 &middot; Income 3.2x rent &middot; No flags</div>
                    </div>
                    <span className="pill pill-green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      Approved Mar 28
                    </span>
                  </div>
                </div>

                <div className="toggle-row">
                  <div>
                    <div className="toggle-row-label">Split rent with Maya</div>
                    <div className="toggle-row-sub">Auto-generates two invoices each month, 50 / 50.</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" id="rm-split" checked />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="toggle-row">
                  <div>
                    <div className="toggle-row-label">Collect additional security deposit</div>
                    <div className="toggle-row-sub">Request $447.50 (half of one month's rent) from Jordan.</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" id="rm-deposit" />
                    <span className="switch-slider" />
                  </label>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="extend">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                </div>
                <h4>Extend term</h4>
                <div className="cond-head-meta">Current end: Dec 27 2026</div>
              </div>
              <div className="cond-body">
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">New end date</label>
                    <input className="input" type="date" id="ext-end" value="2027-06-27" />
                    <span className="field-hint" id="ext-hint">Extends 182 days &middot; 6 months added</span>
                  </div>
                  <div className="field">
                    <label className="field-label">Rent during extension</label>
                    <select className="select" id="ext-rent">
                      <option value="same">Stays the same</option>
                      <option value="step">Step up to market rate</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                <div className="notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                  <div><strong>Renewal notice deadlines updated.</strong> 60-day notice window now opens Apr 28 2027. Auto-reminder scheduled.</div>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="payday">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <h4>Change payment day</h4>
                <div className="cond-head-meta">Current: 1st of month</div>
              </div>
              <div className="cond-body">
                <div className="row-2">
                  <div className="field">
                    <label className="field-label">New due date</label>
                    <select className="select" id="pd-day">
                      <option>1st</option><option>5th</option><option selected>15th</option>
                      <option>20th</option><option>25th</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Handle pro-rate</label>
                    <select className="select" id="pd-prorate">
                      <option value="credit">Credit Maya the difference</option>
                      <option value="charge">Charge Maya the difference</option>
                      <option value="skip">Skip &mdash; start fresh next cycle</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="cond" data-panel="other">
              <div className="cond-head">
                <div className="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                </div>
                <h4>Custom clause</h4>
                <div className="cond-head-meta">Plain English &middot; we'll tidy the legalese</div>
              </div>
              <div className="cond-body">
                <div className="field">
                  <label className="field-label">Clause text</label>
                  <textarea className="textarea" id="other-text" maxLength="1200" style={{minHeight: "110px"}} placeholder="e.g. Tenant agrees to maintain the backyard fence in good repair in exchange for a $25/month credit..." />
                  <div className="char-count"><span id="other-count">0</span> / 1200</div>
                </div>
              </div>
            </div>

            
            <div className="card">
              <div className="card-head">
                <div>
                  <h3>Finishing touches</h3>
                  <p>Fees, effective date, internal notes.</p>
                </div>
              </div>
              <div className="card-body" style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                <div className="toggle-row">
                  <div>
                    <div className="toggle-row-label">Charge amendment fee</div>
                    <div className="toggle-row-sub">$50 one-time fee invoiced with next rent payment.</div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" id="fee-on" />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="field">
                  <label className="field-label">Overall effective date</label>
                  <input className="input" type="date" id="eff-date" value="2026-05-14" min="2026-05-14" />
                  <span className="field-hint">Validated against legal notice minimums for selected changes.</span>
                </div>

                <div className="field">
                  <label className="field-label">Internal notes <span style={{color: "var(--text-faint)", fontWeight: "500"}}>(not on the document)</span></label>
                  <textarea className="textarea" id="notes" placeholder="Why are you making this change? Any tenant context worth remembering…" />
                </div>
              </div>
            </div>
          </div>

          
          <div className="preview-wrap">
            <div className="preview-head">
              <div className="preview-head-title">Live preview &middot; updates as you type</div>
              <div className="preview-zoom">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="11" cy="11" r="8" /><path d="M11 8v6M8 11h6M21 21l-4.3-4.3" /></svg>
                100%
              </div>
            </div>
            <div className="preview-doc">
              <div className="preview-page">
                <div className="preview-header-bar">
                  <div className="preview-brand">Black Bear Rentals</div>
                  <div className="preview-doc-id">AMEND-L2025-0428-01</div>
                </div>

                <div className="preview-title">Amendment No. 1</div>
                <div className="preview-sub">To Residential Lease dated Dec 28 2025</div>

                <div className="preview-section">
                  <div className="preview-section-h">Parties</div>
                  <p>This First Amendment ("Amendment") is entered into this <em>14th day of April, 2026</em>, by and between <strong>Black Bear Rentals LLC</strong> ("Landlord") and <strong>Maya Thompson</strong> ("Tenant"), collectively referred to as the "Parties."</p>
                </div>

                <div className="preview-section">
                  <div className="preview-section-h">Original Lease</div>
                  <dl>
                    <div className="preview-kv"><dt>Premises</dt><dd>3026 Turf Ave NW, Room C</dd></div>
                    <div className="preview-kv"><dt>Term</dt><dd>Dec 28, 2025 &ndash; Dec 27, 2026</dd></div>
                    <div className="preview-kv"><dt>Current rent</dt><dd>$895.00 / month</dd></div>
                    <div className="preview-kv"><dt>Lease ID</dt><dd>L-2025-0428</dd></div>
                  </dl>
                </div>

                <div id="preview-changes">
                  <div className="preview-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15h6M9 11h4" /></svg>
                    Select an amendment type to preview the legal text.
                  </div>
                </div>

                <div id="preview-effective" className="preview-section" style={{display: "none"}}>
                  <div className="preview-section-h">Effective Date &amp; Reaffirmation</div>
                  <p>All changes above take effect on <strong id="preview-eff-date">May 14, 2026</strong>. All other terms of the Original Lease remain in full force and effect. Tenant acknowledges receipt of this Amendment and reaffirms all obligations under the Original Lease as modified herein.</p>
                </div>

                <div className="preview-signatures">
                  <div className="preview-sig-block">
                    <div className="preview-sig-line" />
                    <div className="preview-sig-label">Tenant</div>
                    <div className="preview-sig-name">Maya Thompson</div>
                    <div className="preview-sig-date">Date: ____________________</div>
                  </div>
                  <div className="preview-sig-block">
                    <div className="preview-sig-line" style={{fontFamily: "'Caveat', cursive", color: "#1a1f36"}}>Harrison Cooper</div>
                    <div className="preview-sig-label">Landlord / Agent</div>
                    <div className="preview-sig-name">Harrison Cooper, Black Bear Rentals LLC</div>
                    <div className="preview-sig-date">Date: Apr 14, 2026</div>
                  </div>
                </div>

                <div className="preview-footer">
                  <span>Page 1 of 1</span>
                  <span>Generated by Tenantory</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="cta-bar">
          <div className="cta-bar-info">
            <div className="cta-bar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
            </div>
            <div>
              <div className="cta-bar-title" id="cta-title">Nothing to send yet</div>
              <div className="cta-bar-sub" id="cta-sub">Pick at least one change to continue.</div>
            </div>
          </div>
          <div className="cta-bar-actions">
            <button className="btn btn-ghost" id="btn-download">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download PDF preview
            </button>
            <button className="btn btn-ghost" id="btn-draft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
              Save as draft
            </button>
            <button className="btn btn-pink btn-lg" id="btn-send" disabled style={{opacity: "0.5", pointerEvents: "none"}}>
              Send to Maya for signature
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        
        <div className="activity-log">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            Amendment &amp; change history
          </h3>
          <div className="log-list">
            <div className="log-row">
              <div className="log-dot gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
              </div>
              <div className="log-body">
                <strong>Amendment draft started</strong>
                <p>Harrison opened a new amendment to lease L-2025-0428.</p>
              </div>
              <div className="log-time">Just now</div>
            </div>
            <div className="log-row">
              <div className="log-dot green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <div className="log-body">
                <strong>Rent paid on time</strong>
                <p>April rent of $895 received via ACH &middot; no outstanding balances.</p>
              </div>
              <div className="log-time">Apr 1 2026</div>
            </div>
            <div className="log-row">
              <div className="log-dot blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
              </div>
              <div className="log-body">
                <strong>Lease signed &amp; activated</strong>
                <p>Both parties e-signed. Move-in walkthrough completed Dec 30.</p>
              </div>
              <div className="log-time">Dec 28 2025</div>
            </div>
            <div className="log-row">
              <div className="log-dot pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>
              </div>
              <div className="log-body">
                <strong>Application approved</strong>
                <p>Credit 768 &middot; Income 3.4x rent &middot; No prior flags.</p>
              </div>
              <div className="log-time">Dec 18 2025</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  
  <div className="modal-backdrop" id="confirm-modal">
    <div className="modal">
      <div className="modal-head">
        <h3>Send amendment for signature?</h3>
        <p>Maya will receive an email + portal notification. Nothing changes until she signs.</p>
      </div>
      <div className="modal-body">
        <div className="recipient-box">
          <div className="ctx-avatar">MT</div>
          <div>
            <div style={{fontWeight: "700", fontSize: "14px", color: "var(--text)"}}>Maya Thompson</div>
            <div style={{fontSize: "12px", color: "var(--text-muted)"}}>maya.thompson@gmail.com &middot; (256) 555-0142</div>
          </div>
        </div>
        <div style={{fontSize: "11px", fontWeight: "700", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>She'll be asked to sign</div>
        <ul className="summary-list" id="modal-summary" />
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost" id="modal-cancel">Cancel</button>
        <button className="btn btn-pink" id="modal-confirm">
          Send now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </div>

  
  <div className="success-overlay" id="success-overlay">
    <div className="success-card">
      <div className="success-head">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3>Sent to Maya</h3>
        <p>She'll get an email and a portal notification. We'll ping you the moment she signs.</p>
      </div>
      <div className="success-timeline">
        <div className="success-timeline-label">What happens next</div>
        <div className="success-step done">
          <div className="success-step-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <div className="success-step-body">
            <div className="success-step-title">Amendment sent</div>
            <div className="success-step-sub">Just now &middot; email + SMS delivered</div>
          </div>
        </div>
        <div className="success-step">
          <div className="success-step-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg></div>
          <div className="success-step-body">
            <div className="success-step-title">Maya reviews &amp; e-signs</div>
            <div className="success-step-sub">Typical turnaround: under 24 hours</div>
          </div>
        </div>
        <div className="success-step">
          <div className="success-step-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
          <div className="success-step-body">
            <div className="success-step-title">Changes apply automatically</div>
            <div className="success-step-sub">Rent, roster &amp; reminders update on effective date.</div>
          </div>
        </div>
      </div>
      <div className="success-foot">
        <button className="btn btn-ghost" id="success-close">Close</button>
        <a className="btn btn-primary" href="leases.html">
          View in leases
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </div>

  


    </>
  );
}
