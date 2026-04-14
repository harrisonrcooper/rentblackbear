"use client";

// Mock ported from ~/Desktop/tenantory/admin-late-rent.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, textarea, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb a { color: var(--text-muted); transition: color 0.15s ease; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 100px; min-width: 280px; color: var(--text-faint); transition: all 0.15s ease; }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 32px 32px 60px; }\n\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 28px; flex-wrap: wrap;\n    }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin-bottom: 6px; }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-danger { background: var(--red); color: #fff; }\n    .btn-danger:hover { background: #b83838; transform: translateY(-1px); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== KPI cards row ===== */\n    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }\n    .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; transition: all 0.15s ease; }\n    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }\n    .kpi-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }\n    .kpi-card-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }\n    .kpi-card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }\n    .kpi-card-icon svg { width: 16px; height: 16px; }\n    .kpi-card-icon.red { background: var(--red-bg); color: var(--red); }\n    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }\n    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }\n    .kpi-card-value { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; }\n    .kpi-card-meta { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n\n    /* ===== Automation status card (featured) ===== */\n    .auto-card {\n      background: linear-gradient(135deg, #fff 0%, #fbfcff 100%);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 24px;\n      margin-bottom: 24px;\n      box-shadow: var(--shadow-sm);\n      position: relative;\n      overflow: hidden;\n    }\n    .auto-card::before {\n      content: \"\"; position: absolute; top: 0; left: 0; right: 0; height: 3px;\n      background: linear-gradient(90deg, var(--green), var(--blue-bright));\n    }\n    .auto-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 20px; flex-wrap: wrap;\n    }\n    .auto-title { display: flex; align-items: center; gap: 12px; }\n    .auto-title-icon {\n      width: 42px; height: 42px; border-radius: 12px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .auto-title-icon svg { width: 20px; height: 20px; }\n    .auto-title h2 { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; display: flex; align-items: center; gap: 10px; }\n    .auto-title p { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n    .auto-controls { display: flex; align-items: center; gap: 14px; }\n    .auto-link { font-size: 13px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }\n    .auto-link:hover { color: var(--navy); }\n    .auto-link svg { width: 14px; height: 14px; }\n\n    /* Toggle switch */\n    .toggle-wrap { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--text); }\n    .toggle {\n      position: relative; width: 40px; height: 22px;\n      background: var(--green); border-radius: 100px;\n      transition: background 0.2s ease; cursor: pointer;\n    }\n    .toggle::after {\n      content: \"\"; position: absolute; top: 2px; left: 20px;\n      width: 18px; height: 18px; border-radius: 50%;\n      background: #fff; transition: left 0.2s ease;\n      box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n    }\n    .toggle.off { background: var(--border-strong); }\n    .toggle.off::after { left: 2px; }\n\n    /* Cadence timeline */\n    .cadence { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 6px; }\n    .cadence-step {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 12px;\n      position: relative;\n    }\n    .cadence-step-day {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .cadence-step-title { font-size: 13px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.01em; }\n    .cadence-step-desc { font-size: 11px; color: var(--text-muted); margin-top: 3px; line-height: 1.4; }\n    .cadence-step-icon {\n      width: 24px; height: 24px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 8px;\n    }\n    .cadence-step-icon svg { width: 12px; height: 12px; }\n    .cadence-step-icon.grace { background: var(--blue-pale); color: var(--blue); }\n    .cadence-step-icon.reminder { background: var(--blue-pale); color: var(--blue); }\n    .cadence-step-icon.fee { background: var(--orange-bg); color: var(--orange); }\n    .cadence-step-icon.second { background: var(--orange-bg); color: var(--orange); }\n    .cadence-step-icon.notice { background: var(--red-bg); color: var(--red); }\n    .cadence-step-icon.filing { background: var(--red-bg); color: var(--red); }\n\n    /* Card */\n    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; }\n    .card-head { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 16px; }\n    .card-head h3 { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n    .card-head p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .card-head-actions { display: flex; gap: 8px; align-items: center; }\n    .card-head-link { font-size: 13px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }\n    .card-head-link:hover { color: var(--navy); }\n    .card-head-link svg { width: 14px; height: 14px; }\n\n    /* Table */\n    .tbl { width: 100%; }\n    .tbl-row {\n      display: grid;\n      grid-template-columns: 2fr 1fr 0.9fr 1.5fr 1.6fr 1fr 1fr;\n      gap: 14px; padding: 14px 22px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      transition: background 0.15s ease;\n    }\n    .tbl-row:last-child { border-bottom: none; }\n    .tbl-row-head {\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .tbl-row-body { cursor: pointer; }\n    .tbl-row-body:hover { background: var(--surface-subtle); }\n    .tbl-row-body.open { background: var(--surface-subtle); }\n    .tbl-tenant { display: flex; align-items: center; gap: 10px; }\n    .tbl-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--red-bg); color: var(--red); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }\n    .tbl-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .tbl-tenant-name { font-weight: 600; color: var(--text); }\n    .tbl-tenant-meta { font-size: 12px; color: var(--text-faint); }\n    .tbl-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .tbl-days { font-weight: 700; color: var(--red); font-variant-numeric: tabular-nums; }\n    .tbl-days.warn { color: var(--orange); }\n    .tbl-contact { font-size: 12px; color: var(--text-muted); }\n    .tbl-contact strong { color: var(--text); font-weight: 600; display: block; }\n    .tbl-contact-channel { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n    .tbl-contact-channel svg { width: 11px; height: 11px; }\n    .tbl-next { font-size: 12px; color: var(--text-muted); }\n    .tbl-next strong { color: var(--text); font-weight: 600; display: block; }\n    .tbl-action { display: flex; justify-content: flex-end; gap: 6px; align-items: center; }\n    .chevron { width: 18px; height: 18px; color: var(--text-faint); transition: transform 0.2s ease; }\n    .tbl-row-body.open .chevron { transform: rotate(180deg); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 600; padding: 3px 9px;\n      border-radius: 100px; white-space: nowrap;\n    }\n    .pill::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.8; }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill.nodot::before { display: none; }\n\n    .icon-btn { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.15s ease; }\n    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    /* Expanded panel */\n    .tbl-detail {\n      display: none;\n      padding: 0 22px 22px;\n      background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n    }\n    .tbl-detail.open { display: block; }\n    .detail-inner {\n      display: grid; grid-template-columns: 1fr 1fr 1fr;\n      gap: 18px; padding-top: 4px;\n    }\n    .detail-panel {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px;\n    }\n    .detail-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 12px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .detail-row {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 8px 0; border-bottom: 1px dashed var(--border);\n      font-size: 13px;\n    }\n    .detail-row:last-child { border-bottom: none; }\n    .detail-row-date { color: var(--text-muted); font-size: 12px; }\n    .detail-row-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .detail-row-amt.paid { color: var(--green-dark); }\n    .detail-row-amt.due { color: var(--red); }\n\n    .thread { display: flex; flex-direction: column; gap: 10px; }\n    .thread-item {\n      display: flex; gap: 10px; padding: 10px;\n      border-radius: var(--radius-sm);\n      background: var(--surface-alt);\n      border-left: 3px solid var(--border-strong);\n    }\n    .thread-item.sent { border-left-color: var(--blue); }\n    .thread-item.system { border-left-color: var(--green); }\n    .thread-item.call { border-left-color: var(--orange); }\n    .thread-icon {\n      width: 26px; height: 26px; border-radius: 6px;\n      background: var(--surface); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .thread-icon svg { width: 13px; height: 13px; }\n    .thread-body { flex: 1; min-width: 0; font-size: 12px; }\n    .thread-body strong { color: var(--text); font-weight: 600; display: block; font-size: 12px; }\n    .thread-body p { color: var(--text-muted); line-height: 1.45; margin-top: 2px; }\n    .thread-time { font-size: 10px; color: var(--text-faint); margin-top: 4px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }\n\n    .notes-list { display: flex; flex-direction: column; gap: 8px; max-height: 170px; overflow-y: auto; margin-bottom: 10px; }\n    .note-item {\n      padding: 10px 12px;\n      background: #fffdf6;\n      border: 1px solid #f6e9b8;\n      border-radius: var(--radius-sm);\n      font-size: 12px; color: var(--text);\n    }\n    .note-item-meta { font-size: 10px; color: var(--text-faint); margin-top: 4px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }\n    .note-input {\n      display: flex; gap: 6px; margin-top: 8px;\n    }\n    .note-input input {\n      flex: 1; padding: 8px 12px;\n      border: 1px solid var(--border); border-radius: var(--radius-sm);\n      background: var(--surface); color: var(--text);\n      outline: none; transition: border-color 0.15s ease;\n    }\n    .note-input input:focus { border-color: var(--blue); }\n    .note-input button {\n      padding: 8px 14px; border-radius: var(--radius-sm);\n      background: var(--blue); color: #fff;\n      font-size: 12px; font-weight: 600;\n    }\n    .note-input button:hover { background: var(--navy); }\n\n    .quick-actions {\n      display: grid; grid-template-columns: 1fr 1fr;\n      gap: 8px; margin-top: 14px;\n    }\n    .quick-actions .btn { padding: 9px 12px; font-size: 12px; justify-content: center; }\n\n    /* Eviction section */\n    .eviction-card {\n      background: linear-gradient(135deg, #fff8f6 0%, #fff 80%);\n      border: 1px solid #f3cfc9;\n      border-radius: var(--radius-lg);\n      padding: 22px;\n      margin-bottom: 24px;\n    }\n    .eviction-row {\n      display: grid;\n      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr auto;\n      gap: 14px; align-items: center;\n      padding: 16px; background: var(--surface);\n      border: 1px solid var(--border); border-radius: var(--radius);\n      margin-top: 14px;\n    }\n    .eviction-prop { display: flex; align-items: center; gap: 12px; }\n    .eviction-prop-icon {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: var(--red-bg); color: var(--red);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .eviction-prop-icon svg { width: 17px; height: 17px; }\n    .eviction-prop-name { font-weight: 600; color: var(--text); font-size: 13px; }\n    .eviction-prop-addr { font-size: 11px; color: var(--text-faint); }\n    .eviction-field-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }\n    .eviction-field-val { font-size: 13px; color: var(--text); font-weight: 600; }\n    .eviction-partner-link {\n      margin-top: 14px;\n      padding: 12px 14px;\n      background: var(--surface); border: 1px dashed var(--border-strong);\n      border-radius: var(--radius);\n      display: flex; align-items: center; justify-content: space-between;\n      font-size: 13px;\n    }\n    .eviction-partner-link strong { color: var(--text); font-weight: 600; }\n    .eviction-partner-link p { color: var(--text-muted); font-size: 12px; margin-top: 2px; }\n\n    /* Templates section */\n    .tpl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 18px 22px 22px; }\n    .tpl-card {\n      padding: 16px;\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      background: var(--surface);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .tpl-card:hover { border-color: var(--blue); transform: translateY(-1px); box-shadow: var(--shadow-sm); }\n    .tpl-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }\n    .tpl-icon {\n      width: 30px; height: 30px; border-radius: 7px;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .tpl-icon svg { width: 14px; height: 14px; }\n    .tpl-icon.blue { background: var(--blue-pale); color: var(--blue); }\n    .tpl-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .tpl-icon.pink { background: var(--pink-bg); color: var(--pink); }\n    .tpl-icon.red { background: var(--red-bg); color: var(--red); }\n    .tpl-name { font-size: 13px; font-weight: 700; color: var(--text); }\n    .tpl-meta { font-size: 11px; color: var(--text-faint); margin-top: 1px; }\n    .tpl-preview {\n      font-size: 12px; color: var(--text-muted); line-height: 1.5;\n      padding: 10px 12px; background: var(--surface-alt); border-radius: var(--radius-sm);\n      border-left: 3px solid var(--border-strong);\n      font-style: italic;\n    }\n    .tpl-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }\n    .tpl-edit { font-size: 12px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }\n    .tpl-edit svg { width: 12px; height: 12px; }\n\n    /* Honesty callout */\n    .callout {\n      background: linear-gradient(135deg, #fef9f2 0%, #fff 100%);\n      border: 1px solid #f0dcbf;\n      border-radius: var(--radius-lg);\n      padding: 18px 22px;\n      margin-bottom: 24px;\n      display: flex; align-items: flex-start; gap: 14px;\n    }\n    .callout-icon {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: #fff; border: 1px solid #f0dcbf;\n      color: var(--gold);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .callout-icon svg { width: 18px; height: 18px; }\n    .callout-body h4 { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n    .callout-body p { font-size: 13px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }\n\n    /* Modal */\n    .modal-backdrop {\n      position: fixed; inset: 0;\n      background: rgba(20, 32, 74, 0.55);\n      backdrop-filter: blur(4px);\n      z-index: 100;\n      display: none;\n      align-items: center; justify-content: center;\n      padding: 20px;\n    }\n    .modal-backdrop.open { display: flex; }\n    .modal {\n      background: var(--surface);\n      border-radius: var(--radius-lg);\n      width: 100%; max-width: 520px;\n      box-shadow: var(--shadow-lg);\n      overflow: hidden;\n      animation: modalIn 0.18s ease;\n    }\n    .modal.wide { max-width: 640px; }\n    @keyframes modalIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }\n    .modal-head { padding: 20px 22px 0; }\n    .modal-head h3 { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .modal-head p { font-size: 13px; color: var(--text-muted); margin-top: 4px; line-height: 1.5; }\n    .modal-body { padding: 18px 22px; }\n    .modal-foot {\n      padding: 14px 22px; border-top: 1px solid var(--border);\n      display: flex; justify-content: flex-end; gap: 10px;\n      background: var(--surface-subtle);\n    }\n    .field { margin-bottom: 14px; }\n    .field:last-child { margin-bottom: 0; }\n    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }\n    .field input, .field select, .field textarea {\n      width: 100%; padding: 10px 12px;\n      border: 1px solid var(--border); border-radius: var(--radius-sm);\n      background: var(--surface); color: var(--text);\n      outline: none; transition: border-color 0.15s ease;\n    }\n    .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--blue); }\n    .field textarea { resize: vertical; min-height: 120px; font-family: inherit; line-height: 1.5; }\n    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n    .warn-box {\n      padding: 12px 14px;\n      background: #fff8f5; border: 1px solid #f3cfc9;\n      border-radius: var(--radius-sm);\n      font-size: 13px; color: #8a3636;\n      display: flex; gap: 10px;\n    }\n    .warn-box svg { flex-shrink: 0; width: 16px; height: 16px; color: var(--red); margin-top: 1px; }\n\n    /* Toast */\n    .toast-wrap {\n      position: fixed; bottom: 24px; right: 24px;\n      z-index: 200; display: flex; flex-direction: column; gap: 10px;\n      pointer-events: none;\n    }\n    .toast {\n      background: var(--text); color: #fff;\n      padding: 12px 16px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      min-width: 260px; max-width: 380px;\n      animation: toastIn 0.2s ease;\n      pointer-events: auto;\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n\n    @media (max-width: 1200px) {\n      .cadence { grid-template-columns: repeat(3, 1fr); }\n      .detail-inner { grid-template-columns: 1fr; }\n      .tbl-row { grid-template-columns: 2fr 1fr 1fr; }\n      .tbl-row > *:nth-child(n+4):not(.tbl-action) { display: none; }\n    }\n  ";

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
            Dashboard
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>
            Applications
          </a>
        </div>
        <div className="sb-section-label" style={{marginTop: "20px"}}>Operations</div>
        <div className="sb-nav">
          <a className="sb-nav-item active" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Payments
          </a>
          <a className="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>Maintenance
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>Settings
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" /><path d="M14 2v6h6" /></svg>Documents
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
        </div>
      </div>
    </aside>

    
    <main className="main">

      
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <a href="payments.html">Payments</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Late rent</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, notices, filings..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      <div className="content">

        
        <div className="page-head">
          <div>
            <h1>Late rent</h1>
            <p>2 tenants late this month. Automated reminders run by default — jump in only when you need to.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
              Export report
            </button>
            <button className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Message all late
            </button>
          </div>
        </div>

        
        <div className="callout">
          <div className="callout-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div className="callout-body">
            <h4>Late rent sucks.</h4>
            <p>Our job is to make this as automatic and dignified as possible — for both of you. Everything below runs on a steady cadence unless you step in.</p>
          </div>
        </div>

        
        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Currently late</div>
              <div className="kpi-card-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">2</div>
            <div className="kpi-card-meta">of 12 tenants · 17% of portfolio</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Total owed</div>
              <div className="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">$1,500</div>
            <div className="kpi-card-meta">rent + $75 in late fees</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Oldest delinquency</div>
              <div className="kpi-card-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">4 days</div>
            <div className="kpi-card-meta">Marcus Lee · 908 Lee Dr</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">On autopay</div>
              <div className="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">10<span style={{fontSize: "18px", color: "var(--text-faint)", fontWeight: "700"}}> / 12</span></div>
            <div className="kpi-card-meta">83% adoption · prevents most lates</div>
          </div>
        </div>

        
        <div className="auto-card">
          <div className="auto-head">
            <div className="auto-title">
              <div className="auto-title-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
              </div>
              <div>
                <h2>Auto-reminders enabled <span className="pill pill-green nodot" style={{fontSize: "10px", padding: "2px 8px"}}>LIVE</span></h2>
                <p>Tenantory handles the chase. You only get pinged when something needs a human decision.</p>
              </div>
            </div>
            <div className="auto-controls">
              <a className="auto-link" href="#">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                Edit cadence
              </a>
              <label className="toggle-wrap">
                <span id="toggleLabel">Automation on</span>
                <span className="toggle" id="autoToggle" />
              </label>
            </div>
          </div>
          <div className="cadence">
            <div className="cadence-step">
              <div className="cadence-step-icon grace"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg></div>
              <div className="cadence-step-day">Day 1</div>
              <div className="cadence-step-title">Grace</div>
              <div className="cadence-step-desc">Silent 24h window. No action yet.</div>
            </div>
            <div className="cadence-step">
              <div className="cadence-step-icon reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></div>
              <div className="cadence-step-day">Day 5</div>
              <div className="cadence-step-title">Email nudge</div>
              <div className="cadence-step-desc">Friendly reminder with autopay link.</div>
            </div>
            <div className="cadence-step">
              <div className="cadence-step-icon fee"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
              <div className="cadence-step-day">Day 6</div>
              <div className="cadence-step-title">Late fee + SMS</div>
              <div className="cadence-step-desc">$50 fee applied, SMS notification.</div>
            </div>
            <div className="cadence-step">
              <div className="cadence-step-icon second"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h4.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg></div>
              <div className="cadence-step-day">Day 10</div>
              <div className="cadence-step-title">2nd reminder + call task</div>
              <div className="cadence-step-desc">Task lands in your inbox.</div>
            </div>
            <div className="cadence-step">
              <div className="cadence-step-icon notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 18v-6M9 15h6" /></svg></div>
              <div className="cadence-step-day">Day 15</div>
              <div className="cadence-step-title">Certified notice</div>
              <div className="cadence-step-desc">Legal notice auto-drafted for send.</div>
            </div>
            <div className="cadence-step">
              <div className="cadence-step-icon filing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /></svg></div>
              <div className="cadence-step-day">Day 30</div>
              <div className="cadence-step-title">Eviction option</div>
              <div className="cadence-step-desc">Filing workflow unlocked — you approve.</div>
            </div>
          </div>
        </div>

        
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Late tenants</h3>
              <p>Click a row to see payment history, message thread, and notes.</p>
            </div>
            <div className="card-head-actions">
              <button className="btn btn-ghost btn-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                Filter
              </button>
            </div>
          </div>

          <div className="tbl">
            <div className="tbl-row tbl-row-head">
              <div>Tenant + property</div>
              <div>Amount owed</div>
              <div>Days late</div>
              <div>Last contact</div>
              <div>Automation next step</div>
              <div>Status</div>
              <div style={{textAlign: "right"}}>Actions</div>
            </div>

            
            <div className="tbl-row tbl-row-body" data-row="marcus">
              <div className="tbl-tenant">
                <div className="tbl-avatar">ML</div>
                <div>
                  <div className="tbl-tenant-name">Marcus Lee</div>
                  <div className="tbl-tenant-meta">908 Lee Dr NW · Unit A</div>
                </div>
              </div>
              <div className="tbl-amount">$950.00</div>
              <div className="tbl-days">4d</div>
              <div className="tbl-contact">
                <strong>Yesterday, 9:02am</strong>
                <span className="tbl-contact-channel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                  Email · auto reminder
                </span>
              </div>
              <div className="tbl-next">
                <strong>Late fee + SMS</strong>
                Tomorrow, 8:00am
              </div>
              <div><span className="pill pill-orange">Warning</span></div>
              <div className="tbl-action">
                <button className="btn btn-ghost btn-sm">Send reminder</button>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
            <div className="tbl-detail" data-detail="marcus">
              <div className="detail-inner">
                <div className="detail-panel">
                  <div className="detail-label">
                    <span>Payment history</span>
                    <a href="#" className="auto-link" style={{fontSize: "11px"}}>Log payment</a>
                  </div>
                  <div className="detail-row">
                    <div><strong>Apr 2026 rent</strong><div className="detail-row-date">Due Apr 1 · 4 days late</div></div>
                    <div className="detail-row-amt due">$950.00</div>
                  </div>
                  <div className="detail-row">
                    <div><strong>Mar 2026 rent</strong><div className="detail-row-date">Paid Mar 3 · ACH</div></div>
                    <div className="detail-row-amt paid">$950.00</div>
                  </div>
                  <div className="detail-row">
                    <div><strong>Feb 2026 rent</strong><div className="detail-row-date">Paid Feb 1 · ACH</div></div>
                    <div className="detail-row-amt paid">$950.00</div>
                  </div>
                  <div className="detail-row">
                    <div><strong>Jan 2026 rent</strong><div className="detail-row-date">Paid Jan 6 · 5 days late · ACH</div></div>
                    <div className="detail-row-amt paid">$1,000.00</div>
                  </div>
                </div>

                <div className="detail-panel">
                  <div className="detail-label"><span>Communication thread</span></div>
                  <div className="thread">
                    <div className="thread-item sent">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></div>
                      <div className="thread-body">
                        <strong>Auto reminder email sent</strong>
                        <p>"Hi Marcus — just a friendly heads up that April rent hasn't posted yet…"</p>
                        <div className="thread-time">Apr 13 · 9:02 AM</div>
                      </div>
                    </div>
                    <div className="thread-item system">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>
                      <div className="thread-body">
                        <strong>Grace period ended</strong>
                        <p>No payment detected · entered automation cadence.</p>
                        <div className="thread-time">Apr 2 · 12:00 AM</div>
                      </div>
                    </div>
                    <div className="thread-item">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                      <div className="thread-body">
                        <strong>Rent due</strong>
                        <p>$950.00 invoice issued.</p>
                        <div className="thread-time">Apr 1 · 12:00 AM</div>
                      </div>
                    </div>
                  </div>
                  <div className="quick-actions">
                    <button className="btn btn-primary btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
                      Send reminder now
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                      Log payment
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                      Apply late fee
                    </button>
                    <button className="btn btn-danger btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
                      Escalate to notice
                    </button>
                  </div>
                </div>

                <div className="detail-panel">
                  <div className="detail-label"><span>Private notes</span><span style={{fontWeight: "500", color: "var(--text-faint)", textTransform: "none", letterSpacing: "0"}}>Only you</span></div>
                  <div className="notes-list" id="notes-marcus">
                    <div className="note-item">
                      Marcus called last month — new job started late, said he'd be on time from now on. Usually reliable.
                      <div className="note-item-meta">Mar 3, 2026 · Harrison</div>
                    </div>
                    <div className="note-item">
                      Tenant since Aug 2023. Never more than 5 days late. Don't escalate early.
                      <div className="note-item-meta">Jan 15, 2026 · Harrison</div>
                    </div>
                  </div>
                  <div className="note-input">
                    <input id="note-input-marcus" placeholder="Add a private note…" />
                    <button>Add</button>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="tbl-row tbl-row-body" data-row="dana">
              <div className="tbl-tenant">
                <div className="tbl-avatar orange">DO</div>
                <div>
                  <div className="tbl-tenant-name">Dana Okafor</div>
                  <div className="tbl-tenant-meta">3026 Turf Ave NW · Unit 2</div>
                </div>
              </div>
              <div className="tbl-amount">$550.00</div>
              <div className="tbl-days warn">2d</div>
              <div className="tbl-contact">
                <strong>Apr 12, 6:14pm</strong>
                <span className="tbl-contact-channel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  SMS · tenant replied
                </span>
              </div>
              <div className="tbl-next">
                <strong>Waiting on reply</strong>
                No action scheduled
              </div>
              <div><span className="pill pill-blue">Grace</span></div>
              <div className="tbl-action">
                <button className="btn btn-ghost btn-sm">Send reminder</button>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
            <div className="tbl-detail" data-detail="dana">
              <div className="detail-inner">
                <div className="detail-panel">
                  <div className="detail-label">
                    <span>Payment history</span>
                    <a href="#" className="auto-link" style={{fontSize: "11px"}}>Log payment</a>
                  </div>
                  <div className="detail-row">
                    <div><strong>Apr 2026 rent (partial)</strong><div className="detail-row-date">$700 received Apr 5 · $550 short</div></div>
                    <div className="detail-row-amt due">$550.00</div>
                  </div>
                  <div className="detail-row">
                    <div><strong>Mar 2026 rent</strong><div className="detail-row-date">Paid Mar 1 · Autopay</div></div>
                    <div className="detail-row-amt paid">$1,250.00</div>
                  </div>
                  <div className="detail-row">
                    <div><strong>Feb 2026 rent</strong><div className="detail-row-date">Paid Feb 1 · Autopay</div></div>
                    <div className="detail-row-amt paid">$1,250.00</div>
                  </div>
                </div>

                <div className="detail-panel">
                  <div className="detail-label"><span>Communication thread</span></div>
                  <div className="thread">
                    <div className="thread-item">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                      <div className="thread-body">
                        <strong>Tenant replied · SMS</strong>
                        <p>"Had a car repair this week — can I split the balance across the 15th and 20th?"</p>
                        <div className="thread-time">Apr 12 · 6:14 PM</div>
                      </div>
                    </div>
                    <div className="thread-item sent">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                      <div className="thread-body">
                        <strong>Auto SMS sent</strong>
                        <p>"Hi Dana — we've received $700 of April rent. $550 balance still outstanding."</p>
                        <div className="thread-time">Apr 12 · 5:00 PM</div>
                      </div>
                    </div>
                    <div className="thread-item system">
                      <div className="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                      <div className="thread-body">
                        <strong>Partial payment received</strong>
                        <p>$700.00 ACH · balance $550.00.</p>
                        <div className="thread-time">Apr 5 · 2:18 PM</div>
                      </div>
                    </div>
                  </div>
                  <div className="quick-actions">
                    <button className="btn btn-primary btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
                      Send reminder now
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                      Log payment
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                      Apply late fee
                    </button>
                    <button className="btn btn-danger btn-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
                      Escalate to notice
                    </button>
                  </div>
                </div>

                <div className="detail-panel">
                  <div className="detail-label"><span>Private notes</span><span style={{fontWeight: "500", color: "var(--text-faint)", textTransform: "none", letterSpacing: "0"}}>Only you</span></div>
                  <div className="notes-list" id="notes-dana">
                    <div className="note-item">
                      Dana asked for a split payment this month (15th and 20th). Agreed verbally — don't auto-escalate.
                      <div className="note-item-meta">Apr 12, 2026 · Harrison</div>
                    </div>
                  </div>
                  <div className="note-input">
                    <input id="note-input-dana" placeholder="Add a private note…" />
                    <button>Add</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        
        <div className="eviction-card">
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap"}}>
            <div>
              <h3 style={{fontSize: "15px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "10px"}}>
                Eviction filings in progress
                <span className="pill pill-red nodot" style={{fontSize: "10px"}}>1 ACTIVE</span>
              </h3>
              <p style={{fontSize: "12px", color: "var(--text-muted)", marginTop: "2px"}}>Legal cases currently moving through court. Keep your attorney looped in.</p>
            </div>
            <button className="btn btn-ghost btn-sm">View archive</button>
          </div>

          <div className="eviction-row">
            <div className="eviction-prop">
              <div className="eviction-prop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
              </div>
              <div>
                <div className="eviction-prop-name">Jordan Whitt</div>
                <div className="eviction-prop-addr">1412 Church St · Unit B (vacated)</div>
              </div>
            </div>
            <div>
              <div className="eviction-field-label">Jurisdiction</div>
              <div className="eviction-field-val">Madison County, AL</div>
            </div>
            <div>
              <div className="eviction-field-label">Filing date</div>
              <div className="eviction-field-val">Mar 28, 2026</div>
            </div>
            <div>
              <div className="eviction-field-label">Next court date</div>
              <div className="eviction-field-val">Apr 22, 2026</div>
            </div>
            <div>
              <div className="eviction-field-label">Attorney</div>
              <div className="eviction-field-val">Holt &amp; Pierce LLC</div>
            </div>
            <div>
              <button className="btn btn-ghost btn-sm">Case file</button>
            </div>
          </div>

          <div className="eviction-partner-link">
            <div>
              <strong>Need an attorney in another state?</strong>
              <p>We maintain a vetted partner list across all 50 states — Alabama, Tennessee, Georgia, and more.</p>
            </div>
            <a href="#" className="btn btn-ghost btn-sm">
              Find an attorney
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Message templates</h3>
              <p>The four messages the system sends on your behalf. Edit the voice to match yours.</p>
            </div>
            <a href="#" className="card-head-link">
              Preview all
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="tpl-grid">
            <div className="tpl-card">
              <div className="tpl-head">
                <div className="tpl-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </div>
                <div>
                  <div className="tpl-name">Reminder email</div>
                  <div className="tpl-meta">Day 5 · Email · friendly tone</div>
                </div>
              </div>
              <div className="tpl-preview">"Hi &#123;&#123;tenant_first_name&#125;&#125; — just a friendly heads up that &#123;&#123;month&#125;&#125; rent hasn't posted yet. No worries if it's on the way. Here's your payment link…"</div>
              <div className="tpl-foot">
                <span className="pill pill-green">Active</span>
                <span className="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                </span>
              </div>
            </div>

            <div className="tpl-card">
              <div className="tpl-head">
                <div className="tpl-icon orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div>
                  <div className="tpl-name">Late fee SMS</div>
                  <div className="tpl-meta">Day 6 · SMS · direct</div>
                </div>
              </div>
              <div className="tpl-preview">"Hi &#123;&#123;tenant_first_name&#125;&#125;, a $50 late fee was added to &#123;&#123;month&#125;&#125; rent. Total now due: &#123;&#123;balance&#125;&#125;. Pay: &#123;&#123;link&#125;&#125;"</div>
              <div className="tpl-foot">
                <span className="pill pill-green">Active</span>
                <span className="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                </span>
              </div>
            </div>

            <div className="tpl-card">
              <div className="tpl-head">
                <div className="tpl-icon pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h4.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <div className="tpl-name">Second reminder + call task</div>
                  <div className="tpl-meta">Day 10 · Email + call task for Harrison</div>
                </div>
              </div>
              <div className="tpl-preview">"Hey &#123;&#123;tenant_first_name&#125;&#125; — reaching out again. If something's going on, let's talk. We'd rather work it out than escalate. Reply here or call &#123;&#123;landlord_phone&#125;&#125;."</div>
              <div className="tpl-foot">
                <span className="pill pill-green">Active</span>
                <span className="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                </span>
              </div>
            </div>

            <div className="tpl-card">
              <div className="tpl-head">
                <div className="tpl-icon red">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </div>
                <div>
                  <div className="tpl-name">Certified notice (legal)</div>
                  <div className="tpl-meta">Day 15 · Certified mail PDF</div>
                </div>
              </div>
              <div className="tpl-preview">"NOTICE OF PAST DUE RENT AND DEMAND FOR PAYMENT — pursuant to &#123;&#123;state_code&#125;&#125;. You have &#123;&#123;cure_days&#125;&#125; days from receipt to cure the default of &#123;&#123;balance&#125;&#125;…"</div>
              <div className="tpl-foot">
                <span className="pill pill-gray nodot">Jurisdiction-aware</span>
                <span className="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  

  
  <div className="modal-backdrop" id="modal-log-payment">
    <div className="modal">
      <div className="modal-head">
        <h3>Log a payment</h3>
        <p>Use this when rent came in outside Tenantory (cash, check, bank transfer).</p>
      </div>
      <div className="modal-body">
        <div className="field-row">
          <div className="field">
            <label>Amount</label>
            <input type="text" placeholder="$950.00" value="$950.00" />
          </div>
          <div className="field">
            <label>Date received</label>
            <input type="date" value="2026-04-14" />
          </div>
        </div>
        <div className="field">
          <label>Method</label>
          <select>
            <option>Bank transfer</option>
            <option>Cash</option>
            <option>Check</option>
            <option>Money order</option>
            <option>Zelle / Venmo</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label>Notes (optional)</label>
          <input type="text" placeholder="Check #4421 · dropped off in person" />
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Log payment</button>
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop" id="modal-escalate">
    <div className="modal">
      <div className="modal-head">
        <h3>Escalate to formal notice</h3>
        <p>This generates a certified-mail-ready legal notice. The tenant will be given the jurisdiction-required cure period.</p>
      </div>
      <div className="modal-body">
        <div className="warn-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
          <div>
            Continuing will pause all automated reminders, draft a certified notice, and open a legal timeline in the tenant file. You'll review and sign before anything sends.
          </div>
        </div>
        <div className="field" style={{marginTop: "14px"}}>
          <label>Reason for escalation</label>
          <select>
            <option>Non-payment of rent</option>
            <option>Habitual late payment</option>
            <option>Lease violation + arrears</option>
          </select>
        </div>
        <div className="field">
          <label>Internal note</label>
          <input type="text" placeholder="Why now? (private, for your records)" />
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-danger">Continue</button>
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop" id="modal-pause">
    <div className="modal">
      <div className="modal-head">
        <h3 id="pause-title">Pause automation?</h3>
        <p id="pause-body">Reminders, late fees, and SMS will stop firing until you turn it back on. You'll still see who's late — you just won't chase automatically.</p>
      </div>
      <div className="modal-body">
        <div className="warn-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          <div>Most operators find manual chasing takes 30–60 minutes per late tenant, per month. We recommend keeping automation on unless you're handling a specific situation.</div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Keep on</button>
        <button className="btn btn-danger">Pause automation</button>
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop" id="modal-message-all">
    <div className="modal wide">
      <div className="modal-head">
        <h3>Message all late tenants</h3>
        <p>This sends to 2 recipients: Marcus Lee, Dana Okafor. Personalization tokens auto-fill per tenant.</p>
      </div>
      <div className="modal-body">
        <div className="field">
          <label>Channel</label>
          <select>
            <option>Email + SMS (recommended)</option>
            <option>Email only</option>
            <option>SMS only</option>
          </select>
        </div>
        <div className="field">
          <label>Message</label>
          <textarea placeholder="Hi {{tenant_first_name}}, I wanted to check in on {{month}} rent…">Hi &#123;&#123;tenant_first_name&#125;&#125;, just a quick check-in on &#123;&#123;month&#125;&#125; rent. Your balance is &#123;&#123;balance&#125;&#125;. If anything's going on, reply here and we'll work something out. — Harrison</textarea>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Send to all</button>
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop" id="modal-template">
    <div className="modal wide">
      <div className="modal-head">
        <h3 id="tpl-title">Edit template</h3>
        <p id="tpl-subtitle">Use tokens like &#123;&#123;tenant_first_name&#125;&#125;, &#123;&#123;month&#125;&#125;, &#123;&#123;balance&#125;&#125;, &#123;&#123;link&#125;&#125;.</p>
      </div>
      <div className="modal-body">
        <div className="field">
          <label>Subject / first line</label>
          <input id="tpl-subject" type="text" value="Quick note on {{month}} rent" />
        </div>
        <div className="field">
          <label>Message body</label>
          <textarea id="tpl-body" style={{minHeight: "180px"}}>Hi &#123;&#123;tenant_first_name&#125;&#125;,

Just a friendly heads up that &#123;&#123;month&#125;&#125; rent hasn't posted yet — no stress if it's already on the way.

If you need to pay now: &#123;&#123;link&#125;&#125;

Thanks,
Harrison</textarea>
        </div>
        <div className="field">
          <label>Tone</label>
          <select>
            <option>Friendly (default)</option>
            <option>Neutral / business</option>
            <option>Firm</option>
          </select>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Save template</button>
      </div>
    </div>
  </div>

  <div className="toast-wrap" id="toast-wrap" />

  

    </>
  );
}
