"use client";

// Mock ported from ~/Desktop/tenantory/tax-pack.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name {\n      font-weight: 800; font-size: 18px; color: #fff;\n      letter-spacing: -0.02em;\n    }\n    .sb-brand-ws {\n      font-size: 11px; color: rgba(255,255,255,0.5);\n      font-weight: 500; margin-top: 2px;\n    }\n\n    .sb-section {\n      padding: 16px 12px;\n      flex: 1; overflow-y: auto;\n    }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover {\n      background: rgba(255,255,255,0.06);\n      color: #fff;\n    }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    .sb-user {\n      padding: 16px 12px;\n      border-top: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    /* Topbar */\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb a { color: var(--text-muted); transition: color 0.15s ease; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 32px; }\n    .content-inner { max-width: 1280px; margin: 0 auto; }\n\n    /* Breadcrumb (inline) */\n    .crumb {\n      display: flex; align-items: center; gap: 6px;\n      font-size: 13px; color: var(--text-muted); margin-bottom: 14px;\n    }\n    .crumb a { color: var(--text-muted); transition: color 0.15s ease; }\n    .crumb a:hover { color: var(--blue); }\n    .crumb svg { width: 12px; height: 12px; opacity: 0.5; }\n    .crumb strong { color: var(--text); font-weight: 600; }\n\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 24px; flex-wrap: wrap;\n    }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 6px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e8397f; transform: translateY(-1px); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn-lg { padding: 12px 22px; font-size: 14px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Cards ===== */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .card-head {\n      padding: 18px 20px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between; gap: 12px;\n    }\n    .card-head h3 {\n      font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em;\n    }\n    .card-head p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .card-body { padding: 20px; }\n\n    /* ===== Year + entity selectors ===== */\n    .controls-row {\n      display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px;\n      align-items: stretch;\n    }\n    .seg {\n      display: inline-flex; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 100px; padding: 4px;\n      box-shadow: var(--shadow-sm);\n    }\n    .seg-btn {\n      padding: 8px 18px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-radius: 100px;\n      transition: all 0.15s ease;\n    }\n    .seg-btn:hover { color: var(--text); }\n    .seg-btn.active { background: var(--navy); color: #fff; box-shadow: var(--shadow-sm); }\n    .seg-btn .tag {\n      font-size: 10px; font-weight: 700; padding: 1px 6px;\n      border-radius: 100px; background: var(--pink-bg); color: var(--pink);\n      margin-left: 6px;\n    }\n    .seg-btn.active .tag { background: rgba(255,255,255,0.2); color: #fff; }\n\n    .entity-wrap {\n      display: flex; align-items: center; gap: 10px; flex: 1;\n      min-width: 320px;\n    }\n    .entity-label {\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n    }\n    .entity-select {\n      flex: 1; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 100px;\n      padding: 10px 18px 10px 14px;\n      font-size: 13px; font-weight: 600; color: var(--text);\n      appearance: none;\n      background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 16px center;\n      padding-right: 40px;\n      box-shadow: var(--shadow-sm); cursor: pointer;\n      transition: all 0.15s ease;\n    }\n    .entity-select:hover { border-color: var(--border-strong); }\n    .entity-select:focus { outline: none; border-color: var(--blue); background-color: #fff; }\n\n    /* ===== Summary card (hero) ===== */\n    .summary {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);\n      border-radius: var(--radius-lg); padding: 28px 32px;\n      color: #fff; margin-bottom: 24px;\n      position: relative; overflow: hidden;\n    }\n    .summary::after {\n      content: \"\"; position: absolute; right: -60px; top: -60px;\n      width: 240px; height: 240px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);\n    }\n    .summary-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      margin-bottom: 22px; position: relative; z-index: 1; gap: 16px;\n    }\n    .summary-label {\n      display: inline-block; background: rgba(255,255,255,0.15); color: #fff;\n      padding: 4px 12px; border-radius: 100px;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.14em;\n      text-transform: uppercase; margin-bottom: 8px;\n    }\n    .summary-head h2 {\n      color: #fff; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;\n    }\n    .summary-head p {\n      color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 4px;\n    }\n    .summary-live {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11px; color: rgba(255,255,255,0.85);\n      background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 100px;\n      font-weight: 600;\n    }\n    .summary-live-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: #4ade80;\n      box-shadow: 0 0 0 4px rgba(74,222,128,0.25);\n      animation: pulse 2s infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { opacity: 1; }\n      50% { opacity: 0.5; }\n    }\n    .summary-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      gap: 24px; position: relative; z-index: 1;\n    }\n    .summary-metric-label {\n      font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 8px; display: flex; align-items: center; gap: 6px;\n    }\n    .summary-metric-label svg { width: 12px; height: 12px; opacity: 0.7; }\n    .summary-metric-value {\n      font-size: 30px; font-weight: 800; color: #fff;\n      letter-spacing: -0.02em; line-height: 1.1;\n      font-variant-numeric: tabular-nums;\n    }\n    .summary-metric-value.net { color: #80ffc6; }\n    .summary-metric-value.exp { color: #ffd3a0; }\n    .summary-metric-delta {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 12px; font-weight: 600; margin-top: 8px;\n      background: rgba(255,255,255,0.1); padding: 3px 10px;\n      border-radius: 100px;\n    }\n    .summary-metric-delta svg { width: 11px; height: 11px; }\n    .summary-metric-delta.up { color: #80ffc6; }\n    .summary-metric-delta.down { color: #ffb4b4; }\n    .summary-line {\n      font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;\n      font-style: italic;\n    }\n\n    /* ===== Two-col tax pack contents ===== */\n    .section-title {\n      font-size: 18px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em; margin: 32px 0 14px;\n    }\n    .section-title-row {\n      display: flex; justify-content: space-between; align-items: center;\n      margin: 32px 0 14px;\n    }\n    .section-title-row h2 {\n      font-size: 18px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em;\n    }\n    .section-sub { font-size: 13px; color: var(--text-muted); }\n\n    .pack-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr);\n      gap: 14px;\n    }\n    .pack-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n      display: flex; gap: 14px; align-items: flex-start;\n      transition: all 0.15s ease; position: relative;\n    }\n    .pack-card:hover {\n      border-color: var(--blue); transform: translateY(-1px);\n      box-shadow: var(--shadow);\n    }\n    .pack-card-icon {\n      width: 44px; height: 44px; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .pack-card-icon.blue { background: var(--blue-pale); color: var(--blue); }\n    .pack-card-icon.green { background: var(--green-bg); color: var(--green-dark); }\n    .pack-card-icon.pink { background: var(--pink-bg); color: var(--pink); }\n    .pack-card-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .pack-card-icon svg { width: 22px; height: 22px; }\n    .pack-card-body { flex: 1; min-width: 0; }\n    .pack-card-title {\n      font-size: 14px; font-weight: 700; color: var(--text);\n      margin-bottom: 4px; display: flex; align-items: center; gap: 8px;\n    }\n    .pack-card-title .pages {\n      font-size: 11px; font-weight: 600; color: var(--text-faint);\n      background: var(--surface-alt); padding: 2px 8px; border-radius: 100px;\n    }\n    .pack-card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }\n    .pack-card-meta {\n      font-size: 11px; color: var(--text-faint); margin-top: 8px;\n      display: flex; align-items: center; gap: 4px;\n    }\n    .pack-card-meta svg { width: 10px; height: 10px; }\n\n    /* ===== Schedule E Preview ===== */\n    .form-preview-wrap {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n      box-shadow: var(--shadow);\n    }\n    .form-preview-head {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-bottom: 16px;\n    }\n    .form-preview-head h3 {\n      font-size: 15px; font-weight: 700; color: var(--text);\n    }\n    .form-preview-actions { display: flex; gap: 8px; align-items: center; }\n    .zoom-group {\n      display: inline-flex; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 8px; padding: 2px;\n    }\n    .zoom-btn {\n      padding: 4px 10px; font-size: 11px; font-weight: 600;\n      color: var(--text-muted); border-radius: 6px;\n    }\n    .zoom-btn.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }\n\n    .form-paper {\n      background:\n        linear-gradient(#fffef8, #fffef8),\n        repeating-linear-gradient(0deg, rgba(0,0,0,0.015), rgba(0,0,0,0.015) 1px, transparent 1px, transparent 4px);\n      background-blend-mode: multiply;\n      border: 1px solid #d9d5c4;\n      border-radius: 4px;\n      padding: 28px 36px;\n      font-family: 'Courier Prime', 'Courier New', monospace;\n      color: #1a1a1a;\n      position: relative;\n      box-shadow: inset 0 0 40px rgba(196,180,110,0.05), 0 2px 8px rgba(0,0,0,0.05);\n    }\n    .form-watermark {\n      position: absolute; top: 50%; left: 50%;\n      transform: translate(-50%, -50%) rotate(-20deg);\n      font-size: 80px; font-weight: 800; letter-spacing: 0.1em;\n      color: rgba(47,62,131,0.06); pointer-events: none;\n      white-space: nowrap; font-family: 'Inter', sans-serif;\n    }\n    .form-header {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      padding-bottom: 10px; border-bottom: 2px solid #1a1a1a;\n      margin-bottom: 14px;\n    }\n    .form-header-left {\n      display: flex; gap: 10px; align-items: flex-start;\n    }\n    .form-schedule-label {\n      border: 2px solid #1a1a1a; padding: 4px 10px;\n      font-weight: 700; font-size: 18px;\n      font-family: 'Inter', sans-serif;\n    }\n    .form-title { font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }\n    .form-subtitle { font-size: 10px; margin-top: 2px; color: #4a4a4a; }\n    .form-omb { font-size: 10px; text-align: right; color: #4a4a4a; line-height: 1.4; }\n    .form-part-header {\n      background: #1a1a1a; color: #fffef8; padding: 4px 10px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;\n      margin: 12px 0 10px;\n      font-family: 'Inter', sans-serif;\n    }\n    .form-row {\n      display: grid; grid-template-columns: 20px 1fr 2fr;\n      gap: 10px; padding: 5px 0;\n      border-bottom: 1px dotted #b8b2a1;\n      align-items: center; font-size: 11px;\n    }\n    .form-line-num {\n      font-weight: 700; font-size: 11px;\n      width: 22px; height: 22px;\n      border: 1px solid #1a1a1a;\n      display: flex; align-items: center; justify-content: center;\n      background: #fffef8;\n    }\n    .form-line-label { font-size: 11px; }\n    .form-line-value {\n      text-align: right; font-weight: 700;\n      letter-spacing: 0.05em;\n      border-bottom: 1px solid #1a1a1a;\n      padding: 2px 8px;\n      background: rgba(255,253,190,0.35);\n    }\n    .form-line-value.empty { background: #fffef8; color: transparent; }\n\n    .form-props-table {\n      width: 100%; margin-top: 6px;\n      font-size: 10px; border-collapse: collapse;\n    }\n    .form-props-table th {\n      background: #e8e3d0; border: 1px solid #1a1a1a;\n      padding: 4px 6px; text-align: left; font-weight: 700;\n      font-family: 'Inter', sans-serif; font-size: 10px;\n    }\n    .form-props-table th.num { text-align: right; width: 90px; }\n    .form-props-table td {\n      border: 1px solid #1a1a1a; padding: 5px 6px;\n      font-size: 10px;\n    }\n    .form-props-table td.num {\n      text-align: right; font-weight: 700;\n      background: rgba(255,253,190,0.35);\n      letter-spacing: 0.03em;\n    }\n    .form-props-table td.label {\n      font-size: 9px; color: #4a4a4a;\n      font-weight: 700; letter-spacing: 0.04em;\n      background: #f5efd8;\n      font-family: 'Inter', sans-serif;\n    }\n    .form-props-table tr.totals td {\n      border-top: 2px solid #1a1a1a;\n      background: #e8e3d0; font-weight: 800;\n    }\n    .form-props-table tr.totals td.num {\n      background: #ffe38a; font-weight: 800;\n    }\n    .form-footer {\n      display: flex; justify-content: space-between;\n      font-size: 9px; color: #4a4a4a; margin-top: 14px;\n      padding-top: 8px; border-top: 1px solid #b8b2a1;\n      font-family: 'Inter', sans-serif;\n    }\n\n    /* ===== Per-property table ===== */\n    .prop-table { width: 100%; }\n    .prop-row-head {\n      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;\n      gap: 16px; padding: 12px 20px;\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      border-bottom: 1px solid var(--border);\n    }\n    .prop-row-head .num { text-align: right; }\n    .prop-row {\n      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;\n      gap: 16px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      cursor: pointer;\n      transition: background 0.15s ease;\n    }\n    .prop-row:hover { background: var(--surface-subtle); }\n    .prop-row.expanded { background: var(--blue-pale); }\n    .prop-row .chev {\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); background: var(--surface-alt);\n      transition: transform 0.15s ease;\n    }\n    .prop-row.expanded .chev {\n      transform: rotate(90deg); background: var(--blue); color: #fff;\n    }\n    .prop-row .chev svg { width: 12px; height: 12px; }\n    .prop-address { display: flex; flex-direction: column; gap: 2px; }\n    .prop-address-main { font-weight: 700; color: var(--text); font-size: 13px; }\n    .prop-address-meta { font-size: 11px; color: var(--text-faint); }\n    .num { text-align: right; font-variant-numeric: tabular-nums; }\n    .num-amt { font-weight: 700; color: var(--text); }\n    .num-exp { color: var(--orange); font-weight: 600; }\n    .num-dep { color: var(--blue); font-weight: 600; }\n    .num-net { font-weight: 800; color: var(--green-dark); }\n    .num-net.neg { color: var(--red); }\n    .prop-action { display: flex; justify-content: flex-end; }\n\n    .prop-expand {\n      grid-column: 1 / -1;\n      padding: 16px 60px 22px;\n      background: var(--blue-pale);\n      border-bottom: 1px solid var(--border);\n      display: none;\n    }\n    .prop-expand.open { display: block; }\n    .prop-expand-title {\n      font-size: 11px; font-weight: 700; color: var(--navy);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 10px;\n    }\n    .cat-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 8px 32px;\n    }\n    .cat-row {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 7px 0; border-bottom: 1px dashed rgba(47,62,131,0.15);\n      font-size: 12px;\n    }\n    .cat-row-label { color: var(--text-muted); display: flex; align-items: center; gap: 6px; }\n    .cat-row-label svg { width: 11px; height: 11px; color: var(--text-faint); }\n    .cat-row-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n\n    .prop-totals {\n      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;\n      gap: 16px; padding: 14px 20px;\n      background: var(--navy); color: #fff;\n      font-weight: 800; font-size: 13px; letter-spacing: -0.01em;\n    }\n    .prop-totals .num { color: #fff; }\n    .prop-totals .net { color: #80ffc6; }\n\n    /* ===== Donut chart + category legend ===== */\n    .donut-wrap {\n      display: grid; grid-template-columns: 240px 1fr;\n      gap: 28px; padding: 20px 24px; align-items: center;\n    }\n    .donut {\n      position: relative; width: 220px; height: 220px;\n      margin: 0 auto;\n    }\n    .donut-center {\n      position: absolute; inset: 0;\n      display: flex; flex-direction: column;\n      align-items: center; justify-content: center;\n      text-align: center;\n    }\n    .donut-center-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .donut-center-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; font-variant-numeric: tabular-nums;\n    }\n    .donut-center-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    .legend { display: flex; flex-direction: column; gap: 10px; }\n    .legend-row {\n      display: grid; grid-template-columns: 14px 1fr 90px 50px;\n      gap: 12px; align-items: center; font-size: 13px;\n    }\n    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }\n    .legend-label { color: var(--text); font-weight: 500; }\n    .legend-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; text-align: right; }\n    .legend-pct {\n      font-size: 11px; color: var(--text-muted);\n      text-align: right; font-variant-numeric: tabular-nums;\n      font-weight: 600;\n    }\n\n    /* ===== 1099 vendors ===== */\n    .v-row {\n      display: grid; grid-template-columns: 40px 2fr 1.2fr 1fr 1fr auto;\n      gap: 16px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n    }\n    .v-row:last-child { border-bottom: none; }\n    .v-row-head {\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .v-avatar {\n      width: 34px; height: 34px; border-radius: 9px;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px;\n      background: var(--blue-pale); color: var(--blue);\n    }\n    .v-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .v-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .v-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .v-name { font-weight: 700; color: var(--text); }\n    .v-meta { font-size: 11px; color: var(--text-faint); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 600; padding: 3px 9px;\n      border-radius: 100px; white-space: nowrap;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill svg { width: 10px; height: 10px; }\n\n    .v-action { display: flex; justify-content: flex-end; }\n    .v-btn {\n      padding: 7px 14px; font-size: 12px; font-weight: 600;\n      border-radius: 100px; background: var(--blue); color: #fff;\n      transition: all 0.15s ease;\n    }\n    .v-btn:hover { background: var(--navy); }\n    .v-btn.done {\n      background: var(--green-bg); color: var(--green-dark);\n      pointer-events: none;\n    }\n    .v-btn.disabled {\n      background: var(--surface-alt); color: var(--text-faint);\n      cursor: not-allowed;\n    }\n\n    /* ===== Send to CPA ===== */\n    .cpa-card {\n      background: linear-gradient(135deg, #fdfdff 0%, var(--surface) 100%);\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      padding: 24px; box-shadow: var(--shadow);\n      display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px;\n      align-items: flex-start;\n    }\n    .cpa-card h3 {\n      font-size: 16px; font-weight: 700; color: var(--text);\n      margin-bottom: 4px; letter-spacing: -0.01em;\n    }\n    .cpa-card-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 18px; }\n    .cpa-field { margin-bottom: 14px; }\n    .cpa-field label {\n      display: block; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); margin-bottom: 6px;\n      letter-spacing: 0.02em;\n    }\n    .cpa-field input, .cpa-field textarea {\n      width: 100%; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 10px;\n      padding: 10px 14px; font-size: 13px; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .cpa-field input:focus, .cpa-field textarea:focus {\n      outline: none; border-color: var(--blue);\n      box-shadow: 0 0 0 3px rgba(18,81,173,0.1);\n    }\n    .cpa-field textarea { min-height: 90px; resize: vertical; font-family: inherit; }\n    .cpa-actions { display: flex; gap: 10px; margin-top: 6px; flex-wrap: wrap; }\n    .cpa-side {\n      background: var(--blue-pale); border-radius: 12px; padding: 18px;\n      border: 1px solid #dbe6ff;\n    }\n    .cpa-side h4 {\n      font-size: 13px; font-weight: 700; color: var(--navy);\n      margin-bottom: 12px;\n    }\n    .cpa-file {\n      display: flex; align-items: center; gap: 10px;\n      padding: 9px 10px; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 8px;\n      margin-bottom: 6px;\n      font-size: 12px;\n    }\n    .cpa-file:last-child { margin-bottom: 0; }\n    .cpa-file-icon {\n      width: 28px; height: 28px; border-radius: 6px;\n      background: #fee5eb; color: var(--pink);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .cpa-file-icon svg { width: 14px; height: 14px; }\n    .cpa-file-name { flex: 1; font-weight: 600; color: var(--text); }\n    .cpa-file-size { font-size: 11px; color: var(--text-faint); }\n\n    /* ===== Footer note ===== */\n    .footer-note {\n      text-align: center; font-size: 12px; color: var(--text-faint);\n      padding: 20px 0 8px; margin-top: 32px;\n      border-top: 1px solid var(--border);\n      font-style: italic; line-height: 1.6;\n    }\n\n    /* ===== Modal ===== */\n    .modal-backdrop {\n      position: fixed; inset: 0; background: rgba(20,32,74,0.55);\n      backdrop-filter: blur(4px);\n      display: none; align-items: center; justify-content: center;\n      z-index: 100; padding: 24px;\n    }\n    .modal-backdrop.open { display: flex; }\n    .modal {\n      background: var(--surface); border-radius: var(--radius-lg);\n      width: 100%; max-width: 560px;\n      box-shadow: var(--shadow-lg); overflow: hidden;\n      max-height: 90vh; display: flex; flex-direction: column;\n    }\n    .modal-head {\n      padding: 18px 22px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .modal-head h3 { font-size: 15px; font-weight: 700; }\n    .modal-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted);\n    }\n    .modal-close:hover { background: var(--surface-alt); }\n    .modal-close svg { width: 16px; height: 16px; }\n    .modal-body { padding: 22px; overflow-y: auto; }\n    .email-preview {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 10px; padding: 16px 18px; font-size: 13px;\n      line-height: 1.6;\n    }\n    .email-preview-meta {\n      display: grid; grid-template-columns: 60px 1fr; gap: 4px 10px;\n      padding-bottom: 10px; margin-bottom: 10px;\n      border-bottom: 1px dashed var(--border);\n      font-size: 12px;\n    }\n    .email-preview-meta span:nth-child(odd) {\n      color: var(--text-faint); font-weight: 600;\n    }\n    .email-preview-meta span:nth-child(even) { color: var(--text); font-weight: 500; }\n    .email-preview-body { white-space: pre-line; color: var(--text); }\n    .email-preview-attach {\n      margin-top: 12px; padding-top: 10px;\n      border-top: 1px dashed var(--border);\n      display: flex; flex-direction: column; gap: 4px;\n      font-size: 12px;\n    }\n    .email-attach-item {\n      display: flex; align-items: center; gap: 6px;\n      color: var(--blue); font-weight: 600;\n    }\n    .email-attach-item svg { width: 12px; height: 12px; }\n    .modal-foot {\n      padding: 14px 22px; border-top: 1px solid var(--border);\n      display: flex; justify-content: flex-end; gap: 10px;\n    }\n\n    /* ===== Toast ===== */\n    .toast {\n      position: fixed; bottom: 24px; right: 24px;\n      background: var(--navy-darker); color: #fff;\n      padding: 12px 18px 12px 14px; border-radius: 100px;\n      box-shadow: var(--shadow-lg);\n      display: none; align-items: center; gap: 10px;\n      font-size: 13px; font-weight: 600;\n      z-index: 110;\n      animation: slide-in 0.3s ease;\n    }\n    .toast.open { display: inline-flex; }\n    .toast-icon {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--green); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .toast-icon svg { width: 12px; height: 12px; }\n    @keyframes slide-in {\n      from { transform: translateY(12px); opacity: 0; }\n      to { transform: translateY(0); opacity: 1; }\n    }\n\n    /* ===== Responsive niceties ===== */\n    @media (max-width: 1100px) {\n      .summary-grid { grid-template-columns: repeat(2, 1fr); }\n      .pack-grid { grid-template-columns: 1fr; }\n      .cpa-card { grid-template-columns: 1fr; }\n      .donut-wrap { grid-template-columns: 1fr; }\n      .cat-grid { grid-template-columns: repeat(2, 1fr); }\n    }\n  ";

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
          <a className="sb-nav-item active" href="reports.html">
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
          <a href="reports.html">Reports</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Tax Pack</strong>
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
          <button className="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Quick add
          </button>
        </div>
      </div>

      
      <div className="content">
        <div className="content-inner">

          
          <div className="crumb">
            <a href="reports.html">Reports</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            <strong>Tax pack</strong>
          </div>

          
          <div className="page-head">
            <div>
              <h1 id="pageTitle">2025 Tax Pack</h1>
              <p>Schedule-E-ready export. Email your CPA, done. Updates live as transactions land.</p>
            </div>
            <div className="page-head-actions">
              <button className="btn btn-ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                Print preview
              </button>
              <button className="btn btn-primary btn-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Download tax pack
              </button>
            </div>
          </div>

          
          <div className="controls-row">
            <div className="seg" role="tablist" aria-label="Tax year">
              <button className="seg-btn" data-year="2024">2024</button>
              <button className="seg-btn active" data-year="2025">2025</button>
              <button className="seg-btn" data-year="2026">2026 <span className="tag">YTD</span></button>
            </div>
            <div className="entity-wrap">
              <label className="entity-label" htmlFor="entitySelect">For which entity?</label>
              <select className="entity-select" id="entitySelect">
                <option value="all">All owned by me (4 properties)</option>
                <option value="llc">Black Bear Rentals LLC (3 properties)</option>
                <option value="personal">Harrison Cooper personally (1 property)</option>
                <option value="split">All — generate separate files per entity</option>
              </select>
            </div>
          </div>

          
          <div className="summary">
            <div className="summary-head">
              <div>
                <span className="summary-label">Tax Year <span id="yrLabel">2025</span> Summary</span>
                <h2>Schedule E totals, rolled up across your portfolio</h2>
                <p>Numbers below match line 26 of your Schedule E. Have your CPA verify before filing.</p>
              </div>
              <div className="summary-live">
                <span className="summary-live-dot" />
                Live — last synced 2m ago
              </div>
            </div>
            <div className="summary-grid">
              <div>
                <div className="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  Gross rental income
                </div>
                <div className="summary-metric-value" id="mGross">$62,400</div>
                <div className="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  +8.3% YoY
                </div>
                <div className="summary-line">Schedule E, line 3</div>
              </div>
              <div>
                <div className="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                  Total expenses
                </div>
                <div className="summary-metric-value exp" id="mExp">$28,840</div>
                <div className="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  +4.1% YoY
                </div>
                <div className="summary-line">Lines 5–19</div>
              </div>
              <div>
                <div className="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  Depreciation
                </div>
                <div className="summary-metric-value" id="mDep">$11,260</div>
                <div className="summary-metric-delta neutral">
                  Identical to 2024
                </div>
                <div className="summary-line">Line 18 · Form 4562</div>
              </div>
              <div>
                <div className="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                  Net rental income
                </div>
                <div className="summary-metric-value net" id="mNet">$22,300</div>
                <div className="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  +14.6% YoY
                </div>
                <div className="summary-line">Line 26 — flows to 1040</div>
              </div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>What's in your Tax Pack</h2>
            <span className="section-sub">Four PDFs, one ZIP. Everything your CPA needs.</span>
          </div>

          <div className="pack-grid">
            <div className="pack-card">
              <div className="pack-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" /></svg>
              </div>
              <div className="pack-card-body">
                <div className="pack-card-title">Schedule E worksheet <span className="pages">2 pp</span></div>
                <div className="pack-card-desc">Pre-filled IRS-form-style Schedule E with property totals mapped to each line. Ready to copy into your 1040.</div>
                <div className="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Reconciled against bank feed
                </div>
              </div>
            </div>
            <div className="pack-card">
              <div className="pack-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21V12h6v9" /></svg>
              </div>
              <div className="pack-card-body">
                <div className="pack-card-title">Property-by-property P&amp;L <span className="pages">4 pp</span></div>
                <div className="pack-card-desc">One page per property. Income, every expense line, net operating income, and cap rate — all rendered clean.</div>
                <div className="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  One page per entity
                </div>
              </div>
            </div>
            <div className="pack-card">
              <div className="pack-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>
              </div>
              <div className="pack-card-body">
                <div className="pack-card-title">Transaction ledger <span className="pages">18 pp</span></div>
                <div className="pack-card-desc">Every expense with date, amount, vendor, category, and a clickable link to the receipt image. Audit-ready.</div>
                <div className="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  287 transactions · 214 receipts attached
                </div>
              </div>
            </div>
            <div className="pack-card">
              <div className="pack-card-icon pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
              </div>
              <div className="pack-card-body">
                <div className="pack-card-title">Depreciation schedule <span className="pages">3 pp</span></div>
                <div className="pack-card-desc">Per-property MACRS schedule with basis, acquisition date, accumulated depreciation, and current-year amount.</div>
                <div className="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Straight-line · 27.5 years residential
                </div>
              </div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>Schedule E preview</h2>
            <span className="section-sub">Read-only preview · the PDF version is in your tax pack</span>
          </div>

          <div className="form-preview-wrap">
            <div className="form-preview-head">
              <h3>Form 1040 · Schedule E · Part I — Rental Real Estate</h3>
              <div className="form-preview-actions">
                <div className="zoom-group">
                  <button className="zoom-btn">75%</button>
                  <button className="zoom-btn active">100%</button>
                  <button className="zoom-btn">125%</button>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                  Full screen
                </button>
              </div>
            </div>

            <div className="form-paper">
              <div className="form-watermark">PREVIEW</div>

              <div className="form-header">
                <div className="form-header-left">
                  <div className="form-schedule-label">SCHEDULE E<br /><span style={{fontSize: "9px", fontWeight: "400"}}>(Form 1040)</span></div>
                  <div>
                    <div className="form-title">Supplemental Income and Loss</div>
                    <div className="form-subtitle">(From rental real estate, royalties, partnerships, S corporations, estates, trusts, REMICs, etc.)</div>
                    <div className="form-subtitle" style={{marginTop: "6px"}}>Department of the Treasury · Internal Revenue Service</div>
                  </div>
                </div>
                <div className="form-omb">
                  OMB No. 1545-0074<br />
                  <strong style={{fontSize: "14px", color: "#1a1a1a", fontFamily: "'Inter',sans-serif", fontWeight: "800"}}>2025</strong><br />
                  Attachment<br />Sequence No. 13
                </div>
              </div>

              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px", fontSize: "10px"}}>
                <div><strong style={{fontFamily: "'Inter',sans-serif"}}>Name(s) shown on return</strong><div style={{borderBottom: "1px solid #1a1a1a", padding: "3px 0", fontWeight: "700"}}>Harrison Cooper &amp; Black Bear Rentals LLC</div></div>
                <div><strong style={{fontFamily: "'Inter',sans-serif"}}>Your SSN / EIN</strong><div style={{borderBottom: "1px solid #1a1a1a", padding: "3px 0", fontWeight: "700"}}>XXX-XX-4821 / 88-•••••••</div></div>
              </div>

              <div className="form-part-header">PART I — INCOME OR LOSS FROM RENTAL REAL ESTATE AND ROYALTIES</div>

              <div className="form-row">
                <div className="form-line-num">1a</div>
                <div className="form-line-label">Physical address of each property (street, city, state, ZIP)</div>
                <div className="form-line-value" style={{textAlign: "left", fontSize: "10px"}}>See table below — 4 properties</div>
              </div>
              <div className="form-row">
                <div className="form-line-num">1b</div>
                <div className="form-line-label">Type of property (1 = Single family, 2 = Multi-family, 3 = Vacation, 4 = Commercial)</div>
                <div className="form-line-value" style={{textAlign: "left", fontSize: "10px"}}>1, 2, 1, 1</div>
              </div>
              <div className="form-row">
                <div className="form-line-num">2</div>
                <div className="form-line-label">Fair rental days &nbsp;·&nbsp; Personal use days &nbsp;·&nbsp; QJV</div>
                <div className="form-line-value" style={{textAlign: "left", fontSize: "10px"}}>365 / 0 / No</div>
              </div>

              <table className="form-props-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Address</th>
                    <th className="num">A · Income</th>
                    <th className="num">B · Expenses</th>
                    <th className="num">C · Depreciation</th>
                    <th className="num">D · Net</th>
                  </tr>
                </thead>
                <tbody id="formPropsBody">
                  <tr>
                    <td className="label">A</td>
                    <td>2909 Wilson Ave NW · Huntsville AL</td>
                    <td className="num">19,800</td>
                    <td className="num">8,420</td>
                    <td className="num">3,640</td>
                    <td className="num">7,740</td>
                  </tr>
                  <tr>
                    <td className="label">B</td>
                    <td>2907 Wilson Ave NW · Huntsville AL</td>
                    <td className="num">17,400</td>
                    <td className="num">7,180</td>
                    <td className="num">3,120</td>
                    <td className="num">7,100</td>
                  </tr>
                  <tr>
                    <td className="label">C</td>
                    <td>1523 Oak Ave · Huntsville AL</td>
                    <td className="num">16,200</td>
                    <td className="num">8,090</td>
                    <td className="num">2,780</td>
                    <td className="num">5,330</td>
                  </tr>
                  <tr>
                    <td className="label">D</td>
                    <td>908 Lee Dr NW · Huntsville AL</td>
                    <td className="num">9,000</td>
                    <td className="num">5,150</td>
                    <td className="num">1,720</td>
                    <td className="num">2,130</td>
                  </tr>
                  <tr className="totals">
                    <td colSpan="2">TOTAL — Line 3 / 20 / 18 / 26</td>
                    <td className="num">62,400</td>
                    <td className="num">28,840</td>
                    <td className="num">11,260</td>
                    <td className="num">22,300</td>
                  </tr>
                </tbody>
              </table>

              <div className="form-part-header" style={{marginTop: "16px"}}>EXPENSE DETAIL (LINES 5 – 19)</div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0 24px", fontSize: "11px"}}>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">5</div>
                  <div className="form-line-label">Advertising</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>640</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">12</div>
                  <div className="form-line-label">Mortgage interest</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>9,820</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">7</div>
                  <div className="form-line-label">Cleaning &amp; maintenance</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>4,310</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">14</div>
                  <div className="form-line-label">Repairs</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>3,680</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">9</div>
                  <div className="form-line-label">Insurance</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>2,950</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">16</div>
                  <div className="form-line-label">Taxes (property)</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>4,620</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">10</div>
                  <div className="form-line-label">Legal &amp; other professional</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>420</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">17</div>
                  <div className="form-line-label">Utilities</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>2,040</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">11</div>
                  <div className="form-line-label">Management fees</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>0</div>
                </div>
                <div className="form-row" style={{gridTemplateColumns: "20px 1fr auto"}}>
                  <div className="form-line-num">18</div>
                  <div className="form-line-label">Depreciation (Form 4562)</div>
                  <div className="form-line-value" style={{minWidth: "90px"}}>11,260</div>
                </div>
              </div>

              <div className="form-footer">
                <span>For Paperwork Reduction Act Notice, see the Instructions for Form 1040.</span>
                <span>Cat. No. 11344L · Schedule E (Form 1040) 2025</span>
              </div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>Per-property breakdown</h2>
            <span className="section-sub">Click any row to expand expense categories</span>
          </div>

          <div className="card">
            <div className="prop-table">
              <div className="prop-row-head">
                <span />
                <span>Property</span>
                <span className="num">Income</span>
                <span className="num">Expenses</span>
                <span className="num">Depreciation</span>
                <span className="num">Net</span>
                <span />
              </div>

              <div id="propRows">
                
                <div className="prop-row" data-entity="llc">
                  <div className="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
                  <div className="prop-address">
                    <div className="prop-address-main">2909 Wilson Ave NW</div>
                    <div className="prop-address-meta">Huntsville, AL · 3-bed co-living · Black Bear Rentals LLC</div>
                  </div>
                  <div className="num num-amt">$19,800</div>
                  <div className="num num-exp">$8,420</div>
                  <div className="num num-dep">$3,640</div>
                  <div className="num num-net">$7,740</div>
                  <div className="prop-action"><span className="pill pill-green">Synced</span></div>
                </div>
                <div className="prop-expand">
                  <div className="prop-expand-title">Expense categories · 2909 Wilson Ave NW</div>
                  <div className="cat-grid">
                    <div className="cat-row"><span className="cat-row-label">Mortgage interest</span><span className="cat-row-amt">$3,240</span></div>
                    <div className="cat-row"><span className="cat-row-label">Property tax</span><span className="cat-row-amt">$1,480</span></div>
                    <div className="cat-row"><span className="cat-row-label">Insurance</span><span className="cat-row-amt">$920</span></div>
                    <div className="cat-row"><span className="cat-row-label">Maintenance</span><span className="cat-row-amt">$1,640</span></div>
                    <div className="cat-row"><span className="cat-row-label">Utilities</span><span className="cat-row-amt">$620</span></div>
                    <div className="cat-row"><span className="cat-row-label">Management fees</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Advertising</span><span className="cat-row-amt">$220</span></div>
                    <div className="cat-row"><span className="cat-row-label">Legal &amp; professional</span><span className="cat-row-amt">$180</span></div>
                    <div className="cat-row"><span className="cat-row-label">Other</span><span className="cat-row-amt">$120</span></div>
                  </div>
                </div>

                
                <div className="prop-row" data-entity="llc">
                  <div className="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
                  <div className="prop-address">
                    <div className="prop-address-main">2907 Wilson Ave NW</div>
                    <div className="prop-address-meta">Huntsville, AL · SFH · Black Bear Rentals LLC</div>
                  </div>
                  <div className="num num-amt">$17,400</div>
                  <div className="num num-exp">$7,180</div>
                  <div className="num num-dep">$3,120</div>
                  <div className="num num-net">$7,100</div>
                  <div className="prop-action"><span className="pill pill-green">Synced</span></div>
                </div>
                <div className="prop-expand">
                  <div className="prop-expand-title">Expense categories · 2907 Wilson Ave NW</div>
                  <div className="cat-grid">
                    <div className="cat-row"><span className="cat-row-label">Mortgage interest</span><span className="cat-row-amt">$2,860</span></div>
                    <div className="cat-row"><span className="cat-row-label">Property tax</span><span className="cat-row-amt">$1,260</span></div>
                    <div className="cat-row"><span className="cat-row-label">Insurance</span><span className="cat-row-amt">$780</span></div>
                    <div className="cat-row"><span className="cat-row-label">Maintenance</span><span className="cat-row-amt">$1,100</span></div>
                    <div className="cat-row"><span className="cat-row-label">Utilities</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Management fees</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Advertising</span><span className="cat-row-amt">$180</span></div>
                    <div className="cat-row"><span className="cat-row-label">Legal &amp; professional</span><span className="cat-row-amt">$120</span></div>
                    <div className="cat-row"><span className="cat-row-label">Other</span><span className="cat-row-amt">$880</span></div>
                  </div>
                </div>

                
                <div className="prop-row" data-entity="llc">
                  <div className="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
                  <div className="prop-address">
                    <div className="prop-address-main">1523 Oak Ave</div>
                    <div className="prop-address-meta">Huntsville, AL · SFH · Black Bear Rentals LLC</div>
                  </div>
                  <div className="num num-amt">$16,200</div>
                  <div className="num num-exp">$8,090</div>
                  <div className="num num-dep">$2,780</div>
                  <div className="num num-net">$5,330</div>
                  <div className="prop-action"><span className="pill pill-green">Synced</span></div>
                </div>
                <div className="prop-expand">
                  <div className="prop-expand-title">Expense categories · 1523 Oak Ave</div>
                  <div className="cat-grid">
                    <div className="cat-row"><span className="cat-row-label">Mortgage interest</span><span className="cat-row-amt">$2,640</span></div>
                    <div className="cat-row"><span className="cat-row-label">Property tax</span><span className="cat-row-amt">$1,180</span></div>
                    <div className="cat-row"><span className="cat-row-label">Insurance</span><span className="cat-row-amt">$740</span></div>
                    <div className="cat-row"><span className="cat-row-label">Maintenance</span><span className="cat-row-amt">$1,290</span></div>
                    <div className="cat-row"><span className="cat-row-label">Utilities</span><span className="cat-row-amt">$1,420</span></div>
                    <div className="cat-row"><span className="cat-row-label">Management fees</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Advertising</span><span className="cat-row-amt">$140</span></div>
                    <div className="cat-row"><span className="cat-row-label">Legal &amp; professional</span><span className="cat-row-amt">$60</span></div>
                    <div className="cat-row"><span className="cat-row-label">Other</span><span className="cat-row-amt">$620</span></div>
                  </div>
                </div>

                
                <div className="prop-row" data-entity="personal">
                  <div className="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></div>
                  <div className="prop-address">
                    <div className="prop-address-main">908 Lee Dr NW</div>
                    <div className="prop-address-meta">Huntsville, AL · SFH · Harrison Cooper (personal)</div>
                  </div>
                  <div className="num num-amt">$9,000</div>
                  <div className="num num-exp">$5,150</div>
                  <div className="num num-dep">$1,720</div>
                  <div className="num num-net">$2,130</div>
                  <div className="prop-action"><span className="pill pill-orange">Partial year</span></div>
                </div>
                <div className="prop-expand">
                  <div className="prop-expand-title">Expense categories · 908 Lee Dr NW</div>
                  <div className="cat-grid">
                    <div className="cat-row"><span className="cat-row-label">Mortgage interest</span><span className="cat-row-amt">$1,080</span></div>
                    <div className="cat-row"><span className="cat-row-label">Property tax</span><span className="cat-row-amt">$700</span></div>
                    <div className="cat-row"><span className="cat-row-label">Insurance</span><span className="cat-row-amt">$510</span></div>
                    <div className="cat-row"><span className="cat-row-label">Maintenance</span><span className="cat-row-amt">$280</span></div>
                    <div className="cat-row"><span className="cat-row-label">Utilities</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Management fees</span><span className="cat-row-amt">$0</span></div>
                    <div className="cat-row"><span className="cat-row-label">Advertising</span><span className="cat-row-amt">$100</span></div>
                    <div className="cat-row"><span className="cat-row-label">Legal &amp; professional</span><span className="cat-row-amt">$60</span></div>
                    <div className="cat-row"><span className="cat-row-label">Other (turn-over)</span><span className="cat-row-amt">$2,420</span></div>
                  </div>
                </div>
              </div>

              <div className="prop-totals">
                <span />
                <span>TOTAL · 4 properties</span>
                <span className="num">$62,400</span>
                <span className="num">$28,840</span>
                <span className="num">$11,260</span>
                <span className="num net">$22,300</span>
                <span />
              </div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>Where the money went</h2>
            <span className="section-sub">2025 expenses by category · excludes depreciation</span>
          </div>

          <div className="card">
            <div className="donut-wrap">
              <div className="donut">
                <svg viewBox="0 0 120 120" width="220" height="220">
                  
                  
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#eef3ff" strokeWidth="20" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1251AD" strokeWidth="20" strokeDasharray="102.5 301.5" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#2F3E83" strokeWidth="20" strokeDasharray="48.2 301.5" strokeDashoffset="-102.5" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#FF4998" strokeWidth="20" strokeDasharray="45.2 301.5" strokeDashoffset="-150.7" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1ea97c" strokeWidth="20" strokeDasharray="30.8 301.5" strokeDashoffset="-195.9" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#ea8c3a" strokeWidth="20" strokeDasharray="38.6 301.5" strokeDashoffset="-226.7" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#f5a623" strokeWidth="20" strokeDasharray="21.4 301.5" strokeDashoffset="-265.3" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#8a93a5" strokeWidth="20" strokeDasharray="6.6 301.5" strokeDashoffset="-286.7" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#c9d1dd" strokeWidth="20" strokeDasharray="4.5 301.5" strokeDashoffset="-293.3" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#d64545" strokeWidth="20" strokeDasharray="3.6 301.5" strokeDashoffset="-297.8" transform="rotate(-90 60 60)" />
                </svg>
                <div className="donut-center">
                  <div className="donut-center-label">Total expenses</div>
                  <div className="donut-center-value">$28,840</div>
                  <div className="donut-center-sub">across 9 categories</div>
                </div>
              </div>
              <div className="legend">
                <div className="legend-row"><span className="legend-dot" style={{background: "#1251AD"}} /><span className="legend-label">Mortgage interest</span><span className="legend-amt">$9,820</span><span className="legend-pct">34.0%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#2F3E83"}} /><span className="legend-label">Property tax</span><span className="legend-amt">$4,620</span><span className="legend-pct">16.0%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#FF4998"}} /><span className="legend-label">Maintenance</span><span className="legend-amt">$4,310</span><span className="legend-pct">14.9%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#1ea97c"}} /><span className="legend-label">Insurance</span><span className="legend-amt">$2,950</span><span className="legend-pct">10.2%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#ea8c3a"}} /><span className="legend-label">Repairs</span><span className="legend-amt">$3,680</span><span className="legend-pct">12.8%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#f5a623"}} /><span className="legend-label">Utilities</span><span className="legend-amt">$2,040</span><span className="legend-pct">7.1%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#8a93a5"}} /><span className="legend-label">Advertising</span><span className="legend-amt">$640</span><span className="legend-pct">2.2%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#c9d1dd"}} /><span className="legend-label">Legal &amp; professional</span><span className="legend-amt">$420</span><span className="legend-pct">1.5%</span></div>
                <div className="legend-row"><span className="legend-dot" style={{background: "#d64545"}} /><span className="legend-label">Other</span><span className="legend-amt">$360</span><span className="legend-pct">1.3%</span></div>
              </div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>1099-NEC status</h2>
            <span className="section-sub">Vendors paid &gt; $600 need a 1099 filed by Jan 31</span>
          </div>

          <div className="card">
            <div className="v-row v-row-head">
              <span />
              <span>Vendor</span>
              <span>Category</span>
              <span>Paid (2025)</span>
              <span>W-9 status</span>
              <span />
            </div>
            <div className="v-row" data-vendor="joel">
              <div className="v-avatar green">JP</div>
              <div>
                <div className="v-name">Joel's Plumbing &amp; Drain</div>
                <div className="v-meta">Huntsville, AL · individual · 4 invoices</div>
              </div>
              <div>Maintenance</div>
              <div className="num-amt">$2,860</div>
              <div><span className="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>W-9 on file</span></div>
              <div className="v-action"><button className="v-btn">Generate 1099</button></div>
            </div>
            <div className="v-row" data-vendor="tina">
              <div className="v-avatar orange">TR</div>
              <div>
                <div className="v-name">Tina Ramos Painting</div>
                <div className="v-meta">Madison, AL · individual · 2 invoices</div>
              </div>
              <div>Turnover</div>
              <div className="num-amt">$1,480</div>
              <div><span className="pill pill-red">W-9 missing</span></div>
              <div className="v-action"><button className="v-btn disabled">Request W-9</button></div>
            </div>
            <div className="v-row" data-vendor="clearview">
              <div className="v-avatar blue">CL</div>
              <div>
                <div className="v-name">ClearView Window Co.</div>
                <div className="v-meta">Huntsville, AL · LLC (taxed C-corp) · 1 invoice</div>
              </div>
              <div>Repairs</div>
              <div className="num-amt">$920</div>
              <div><span className="pill pill-gray">C-corp · exempt</span></div>
              <div className="v-action"><button className="v-btn disabled">Not required</button></div>
            </div>
            <div className="v-row" data-vendor="atlas">
              <div className="v-avatar pink">AL</div>
              <div>
                <div className="v-name">Atlas Landscaping</div>
                <div className="v-meta">Huntsville, AL · sole prop · 11 invoices</div>
              </div>
              <div>Maintenance</div>
              <div className="num-amt">$1,640</div>
              <div><span className="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>W-9 on file</span></div>
              <div className="v-action"><button className="v-btn">Generate 1099</button></div>
            </div>
          </div>

          
          <div className="section-title-row">
            <h2>Send it</h2>
            <span className="section-sub">One email to your CPA. Done for the year.</span>
          </div>

          <div className="cpa-card">
            <div>
              <h3>Email tax pack to your CPA</h3>
              <p className="cpa-card-sub">We'll attach the 4 PDFs plus a signed summary cover letter. Your CPA gets everything, in the order they expect it.</p>

              <div className="cpa-field">
                <label htmlFor="cpaEmail">CPA email</label>
                <input id="cpaEmail" type="email" value="rebecca@ccookecpa.com" placeholder="name@firm.com" />
              </div>
              <div className="cpa-field">
                <label htmlFor="cpaSubject">Subject</label>
                <input id="cpaSubject" type="text" value="2025 Rental Tax Pack — Harrison Cooper / Black Bear Rentals" />
              </div>
              <div className="cpa-field">
                <label htmlFor="cpaNote">Note to your CPA</label>
                <textarea id="cpaNote">Hi Rebecca — attached is my 2025 tax pack from Tenantory. Schedule E totals, property P&amp;Ls, the full transaction ledger with receipts, and depreciation schedule are included.

I added one property mid-year (908 Lee Dr NW, acquired May 14) — depreciation is pro-rated. Let me know what else you need. Thanks!</textarea>
              </div>
              <div className="cpa-actions">
                <button className="btn btn-primary btn-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
                  Email tax pack to CPA
                </button>
                <button className="btn btn-ghost">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  Download all as ZIP
                </button>
              </div>
            </div>

            <div className="cpa-side">
              <h4>Attached (4 files · 4.2 MB)</h4>
              <div className="cpa-file">
                <div className="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
                <div className="cpa-file-name">Schedule_E_2025.pdf</div>
                <div className="cpa-file-size">180 KB</div>
              </div>
              <div className="cpa-file">
                <div className="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
                <div className="cpa-file-name">Property_PL_2025.pdf</div>
                <div className="cpa-file-size">320 KB</div>
              </div>
              <div className="cpa-file">
                <div className="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
                <div className="cpa-file-name">Transaction_Ledger_2025.pdf</div>
                <div className="cpa-file-size">3.4 MB</div>
              </div>
              <div className="cpa-file">
                <div className="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
                <div className="cpa-file-name">Depreciation_Schedule_2025.pdf</div>
                <div className="cpa-file-size">260 KB</div>
              </div>
            </div>
          </div>

          
          <div className="footer-note">
            Tenantory does not provide tax advice. This is a data export generated from your verified transactions and receipts.<br />
            Have your CPA verify before filing.
          </div>

        </div>
      </div>

    </main>
  </div>

  
  <div className="modal-backdrop" id="emailModal">
    <div className="modal">
      <div className="modal-head">
        <h3>Ready to send · Preview</h3>
        <button className="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="modal-body">
        <div className="email-preview">
          <div className="email-preview-meta">
            <span>From</span><span>Harrison Cooper &lt;harrison@rentblackbear.com&gt;</span>
            <span>To</span><span id="eTo">rebecca@ccookecpa.com</span>
            <span>Subject</span><span id="eSubj">2025 Rental Tax Pack — Harrison Cooper / Black Bear Rentals</span>
          </div>
          <div className="email-preview-body" id="eBody" />
          <div className="email-preview-attach">
            <div className="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>Schedule_E_2025.pdf · 180 KB</div>
            <div className="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>Property_PL_2025.pdf · 320 KB</div>
            <div className="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>Transaction_Ledger_2025.pdf · 3.4 MB</div>
            <div className="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>Depreciation_Schedule_2025.pdf · 260 KB</div>
          </div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
          Send now
        </button>
      </div>
    </div>
  </div>

  
  <div className="toast" id="toast">
    <span className="toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
    <span id="toastMsg">Done.</span>
  </div>

  

    </>
  );
}
