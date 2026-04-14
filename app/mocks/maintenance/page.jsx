"use client";

// Mock ported from ~/Desktop/tenantory/maintenance.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 320px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-green { background: var(--green-dark); color: #fff; }\n    .btn-green:hover { background: #0d6f4c; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item { border-right: 1px solid var(--border); padding-right: 24px; }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }\n    .stat-value { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; display: flex; align-items: baseline; gap: 8px; }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.down { color: var(--red); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== View toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }\n    .saved-view-dot.red { background: var(--red); }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Kanban board ===== */\n    .kanban-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }\n    .kanban {\n      display: grid;\n      grid-template-columns: repeat(5, minmax(280px, 1fr));\n      gap: 14px; height: 100%;\n    }\n\n    .column {\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      display: flex; flex-direction: column;\n      min-width: 280px;\n      overflow: hidden;\n    }\n    .column-head {\n      padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface);\n    }\n    .column-title {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; font-weight: 700; color: var(--text);\n    }\n    .column-title .count {\n      background: var(--surface-alt); color: var(--text-muted);\n      font-size: 11px; font-weight: 700;\n      padding: 2px 8px; border-radius: 100px;\n    }\n    .column-title .dot-badge { width: 8px; height: 8px; border-radius: 50%; }\n    .column-title .dot-badge.pink { background: var(--pink); }\n    .column-title .dot-badge.blue { background: var(--blue); }\n    .column-title .dot-badge.orange { background: var(--orange); }\n    .column-title .dot-badge.green { background: var(--green); }\n    .column-title .dot-badge.gray { background: var(--text-faint); }\n    .column-title .dot-badge.red { background: var(--red); }\n    .column-alert {\n      font-size: 11px; font-weight: 700; color: var(--orange);\n      display: inline-flex; align-items: center; gap: 3px;\n    }\n    .column-alert svg { width: 12px; height: 12px; }\n    .column-body {\n      padding: 12px; display: flex; flex-direction: column; gap: 10px;\n      overflow-y: auto; flex: 1;\n    }\n    .column-foot {\n      padding: 10px 14px; border-top: 1px solid var(--border);\n      background: var(--surface); font-size: 12px; font-weight: 600;\n      color: var(--blue); text-align: center; cursor: pointer;\n      transition: all 0.15s ease;\n    }\n    .column-foot:hover { background: var(--blue-pale); }\n\n    /* ===== Ticket card ===== */\n    .ticket-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n      transition: all 0.15s ease;\n      cursor: pointer; position: relative;\n    }\n    .ticket-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }\n    .ticket-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }\n    .ticket-card.urgent-rail { border-left: 3px solid var(--pink); }\n\n    .ticket-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 10px; margin-bottom: 8px;\n    }\n    .ticket-title { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.25; }\n    .ticket-sub {\n      display: flex; align-items: center; gap: 6px;\n      font-size: 11px; color: var(--text-faint); margin-top: 3px;\n    }\n    .ticket-sub svg { width: 11px; height: 11px; }\n\n    .urgency-pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 8px; border-radius: 100px;\n      font-size: 10px; font-weight: 800;\n      letter-spacing: 0.04em; text-transform: uppercase;\n      flex-shrink: 0;\n    }\n    .urgency-pill.urgent { background: var(--red-bg); color: var(--red); }\n    .urgency-pill.normal { background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); }\n    .urgency-pill.low { background: var(--blue-pale); color: var(--blue); }\n\n    .ticket-meta-row {\n      display: flex; align-items: center; gap: 8px;\n      margin-top: 10px; flex-wrap: wrap;\n    }\n    .ticket-vendor {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 12px; color: var(--text);\n    }\n    .vendor-avatar {\n      width: 20px; height: 20px; border-radius: 50%;\n      background: var(--blue-pale); color: var(--blue);\n      display: inline-flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 9px; letter-spacing: 0.02em;\n      flex-shrink: 0;\n    }\n    .vendor-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .vendor-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .vendor-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .vendor-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .vendor-avatar.gray { background: var(--surface-alt); color: var(--text-muted); }\n\n    .cost-pill {\n      display: inline-flex; align-items: center; gap: 3px;\n      padding: 2px 8px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n      background: var(--surface-alt); color: var(--text);\n      border: 1px solid var(--border);\n    }\n    .cost-pill.actual { background: var(--green-bg); color: var(--green-dark); border-color: transparent; }\n\n    .ticket-foot {\n      display: flex; justify-content: space-between; align-items: center;\n      padding-top: 10px; border-top: 1px solid var(--border);\n      margin-top: 10px;\n    }\n    .ticket-time {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; color: var(--text-faint); font-weight: 500;\n    }\n    .ticket-time svg { width: 11px; height: 11px; }\n    .ticket-time.warn { color: var(--orange); }\n    .ticket-time.urgent { color: var(--red); }\n    .ticket-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }\n    .ticket-card:hover .ticket-actions { opacity: 1; }\n    .ticket-action {\n      width: 24px; height: 24px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .ticket-action:hover { background: var(--surface-alt); color: var(--blue); }\n    .ticket-action.assign:hover { background: var(--blue-pale); color: var(--blue); }\n    .ticket-action.message:hover { background: var(--pink-bg); color: var(--pink); }\n    .ticket-action.status:hover { background: var(--green-bg); color: var(--green-dark); }\n    .ticket-action svg { width: 14px; height: 14px; }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 560px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: flex; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 20px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 16px;\n    }\n    .drawer-head-left { flex: 1; min-width: 0; }\n    .drawer-head-left h2 {\n      font-size: 20px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 4px;\n    }\n    .drawer-head-sub {\n      display: flex; align-items: center; gap: 10px;\n      font-size: 12px; color: var(--text-muted); flex-wrap: wrap;\n    }\n    .drawer-head-sub svg { width: 12px; height: 12px; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    /* Status pipeline bar */\n    .pipeline-bar {\n      padding: 18px 24px; border-bottom: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .pipeline-label {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;\n    }\n    .pipeline-steps {\n      display: flex; align-items: center; gap: 0;\n    }\n    .pipeline-step {\n      flex: 1; display: flex; flex-direction: column; align-items: center;\n      position: relative; font-size: 11px; font-weight: 600;\n      color: var(--text-faint); text-align: center;\n    }\n    .pipeline-step .dot {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--surface); border: 2px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); font-size: 10px; font-weight: 700;\n      position: relative; z-index: 1; margin-bottom: 6px;\n      transition: all 0.2s ease;\n    }\n    .pipeline-step.done .dot { background: var(--pink); border-color: var(--pink); color: #fff; }\n    .pipeline-step.current .dot {\n      background: var(--surface); border-color: var(--pink); color: var(--pink);\n      box-shadow: 0 0 0 4px var(--pink-bg);\n    }\n    .pipeline-step.done, .pipeline-step.current { color: var(--text); }\n    .pipeline-step .line {\n      position: absolute; top: 11px; left: 50%; right: -50%;\n      height: 2px; background: var(--border); z-index: 0;\n    }\n    .pipeline-step.done .line { background: var(--pink); }\n    .pipeline-step:last-child .line { display: none; }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n      cursor: pointer;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n    .drawer-tab-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n    }\n\n    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }\n    .drawer-section { margin-bottom: 24px; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .drawer-section-head a {\n      font-size: 11px; color: var(--blue); font-weight: 600;\n      text-transform: none; letter-spacing: 0; cursor: pointer;\n    }\n    .drawer-section-head a:hover { text-decoration: underline; }\n    .drawer-row {\n      display: grid; grid-template-columns: 140px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row span:first-child { color: var(--text-muted); }\n    .drawer-row span:last-child { color: var(--text); font-weight: 500; }\n\n    .drawer-desc {\n      background: var(--surface-alt); border-radius: var(--radius);\n      padding: 12px 14px; font-size: 13px; color: var(--text);\n      line-height: 1.5; border: 1px solid var(--border);\n    }\n\n    /* Vendor card inside drawer */\n    .vendor-card {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: var(--radius); background: var(--surface);\n    }\n    .vendor-card-avatar {\n      width: 42px; height: 42px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue), var(--blue-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 13px; flex-shrink: 0;\n    }\n    .vendor-card-avatar.orange { background: linear-gradient(135deg, var(--orange), var(--gold)); }\n    .vendor-card-avatar.green { background: linear-gradient(135deg, var(--green-dark), var(--green)); }\n    .vendor-card-avatar.purple { background: linear-gradient(135deg, var(--purple), var(--purple-light, #a78bfa)); }\n    .vendor-card-info { flex: 1; min-width: 0; }\n    .vendor-card-name { font-weight: 700; font-size: 14px; color: var(--text); }\n    .vendor-card-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }\n    .vendor-card-meta svg { width: 11px; height: 11px; vertical-align: -1px; margin-right: 3px; }\n    .badge-1099 {\n      display: inline-flex; align-items: center; gap: 3px;\n      padding: 2px 7px; border-radius: 4px;\n      font-size: 10px; font-weight: 700;\n      background: var(--green-bg); color: var(--green-dark);\n      text-transform: uppercase; letter-spacing: 0.04em;\n    }\n\n    /* Photo grid */\n    .photo-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;\n    }\n    .photo-tile {\n      aspect-ratio: 4 / 3; border-radius: var(--radius);\n      background: linear-gradient(135deg, var(--blue-pale), var(--surface-subtle));\n      border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); position: relative;\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .photo-tile:hover { border-color: var(--blue); }\n    .photo-tile svg { width: 32px; height: 32px; opacity: 0.5; }\n    .photo-tile-label {\n      position: absolute; bottom: 8px; left: 10px;\n      font-size: 10px; font-weight: 700; color: var(--text);\n      background: rgba(255,255,255,0.9); padding: 2px 7px;\n      border-radius: 4px;\n    }\n\n    /* Comms (chat) */\n    .comms-thread { display: flex; flex-direction: column; gap: 12px; }\n    .comms-msg {\n      max-width: 82%; padding: 10px 14px;\n      border-radius: 14px; font-size: 13px; line-height: 1.45;\n    }\n    .comms-msg.me {\n      align-self: flex-end; background: var(--blue); color: #fff;\n      border-bottom-right-radius: 4px;\n    }\n    .comms-msg.them {\n      align-self: flex-start; background: var(--surface-alt);\n      color: var(--text); border: 1px solid var(--border);\n      border-bottom-left-radius: 4px;\n    }\n    .comms-time { font-size: 10px; color: var(--text-faint); margin-top: 2px; padding: 0 4px; }\n    .comms-msg.me + .comms-time { align-self: flex-end; }\n\n    /* Costs */\n    .cost-table {\n      width: 100%; border-collapse: collapse;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      overflow: hidden;\n    }\n    .cost-table th, .cost-table td {\n      text-align: left; padding: 10px 14px; font-size: 13px;\n      border-bottom: 1px solid var(--border);\n    }\n    .cost-table th {\n      background: var(--surface-alt); font-size: 11px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n      color: var(--text-muted); font-weight: 700;\n    }\n    .cost-table td:last-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }\n    .cost-table tfoot td {\n      font-weight: 800; background: var(--surface-subtle);\n      border-bottom: none; color: var(--text);\n    }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 16px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* Bulk action bar */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: flex; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    /* Vendor directory panel */\n    .vendor-panel-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3); z-index: 42;\n    }\n    .vendor-panel {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 400px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      z-index: 43; display: flex; flex-direction: column;\n      border-left: 1px solid var(--border);\n    }\n\n    @media (max-width: 1400px) {\n      .kanban { grid-template-columns: repeat(5, minmax(260px, 1fr)); }\n    }\n    @media (max-width: 1200px) {\n      .drawer { width: 440px; }\n    }\n  ";

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
          <a className="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>Payments
          </a>
          <a className="sb-nav-item active" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>Maintenance
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
          <strong>Maintenance</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tickets, vendors, properties..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon" id="open-vendor-panel" title="Open vendor directory">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          </button>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      
      <div className="page-head-bar">
        <div>
          <h1>Maintenance</h1>
          <p>Tickets from open to closed — vendors, costs, and tenant comms in one queue.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost" data-action="Vendors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            Vendors
          </button>
          <button className="btn btn-primary" data-action="New ticket">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New ticket
          </button>
        </div>
      </div>

      
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">Open tickets</div>
          <div className="stat-value">5 <span className="stat-delta orange">1 urgent</span></div>
          <div className="stat-sub">Across 3 properties</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg response time</div>
          <div className="stat-value">4.2h <span className="stat-delta up">-60% vs Q1</span></div>
          <div className="stat-sub">First vendor reply</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">In progress</div>
          <div className="stat-value">2</div>
          <div className="stat-sub">Vendors on-site</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Cost MTD</div>
          <div className="stat-value">$1,420</div>
          <div className="stat-sub">April · 5 tickets paid</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Resolved this month</div>
          <div className="stat-value">18 <span className="stat-delta up">+6</span></div>
          <div className="stat-sub">vs. 12 last month</div>
        </div>
      </div>

      
      <div className="toolbar">
        <div className="saved-views">
          <div className="saved-view active" data-view="all">
            All <span className="saved-view-count">5</span>
          </div>
          <div className="saved-view" data-view="urgent">
            <span className="saved-view-dot red" />
            Urgent <span className="saved-view-count">1</span>
          </div>
          <div className="saved-view" data-view="open">
            Open <span className="saved-view-count">3</span>
          </div>
          <div className="saved-view" data-view="awaiting-vendor">
            Awaiting Vendor <span className="saved-view-count">2</span>
          </div>
          <div className="saved-view" data-view="in-progress">
            In Progress <span className="saved-view-count">2</span>
          </div>
          <div className="saved-view" data-view="awaiting-tenant">
            Awaiting Tenant <span className="saved-view-count">1</span>
          </div>
          <div className="saved-view" data-view="completed">
            Completed <span className="saved-view-count">15</span>
          </div>
          <div className="saved-view" data-view="mine">
            My tickets <span className="saved-view-count">3</span>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></svg>
            Filter
          </button>
          <button className="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16" /></svg>
            Sort
          </button>
          <div className="view-toggle">
            <button className="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="18" /><rect x="15" y="3" width="6" height="12" /></svg>
              Board
            </button>
            <button>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              Table
            </button>
          </div>
        </div>
      </div>

      
      <div className="kanban-wrap">
        <div className="kanban">

          
          <div className="column" data-col="new">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge gray" />
                New
                <span className="count">1</span>
              </div>
            </div>
            <div className="column-body">

              <div className="ticket-card" data-ticket="garage-not-closing">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Garage door not closing</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span className="urgency-pill normal">Normal</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar gray">KW</span>
                    Submitted by Kai Wong
                  </div>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    2h ago
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign" title="Assign vendor">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message" title="Message tenant">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status" title="Change status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-col="assigned">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge blue" />
                Assigned
                <span className="count">2</span>
              </div>
              <span className="column-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                1 urgent
              </span>
            </div>
            <div className="column-body">

              <div className="ticket-card urgent-rail" data-ticket="leaky-faucet">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Leaky bathroom faucet</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      2909 Wilson · Room B
                    </div>
                  </div>
                  <span className="urgency-pill urgent">Urgent</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar">JP</span>
                    Joe's Plumbing
                  </div>
                  <span className="cost-pill">$180 est.</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    Submitted yesterday
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign" title="Reassign vendor">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message" title="Message tenant">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status" title="Change status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-card" data-ticket="disposal-jammed">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Kitchen disposal jammed</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      2907 Wilson
                    </div>
                  </div>
                  <span className="urgency-pill normal">Normal</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar orange">AR</span>
                    Acme Repair
                  </div>
                  <span className="cost-pill">$120 est.</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    Submitted 3d ago
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-col="in-progress">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge orange" />
                In Progress
                <span className="count">2</span>
              </div>
            </div>
            <div className="column-body">

              <div className="ticket-card urgent-rail" data-ticket="hvac-not-cooling">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">HVAC not cooling</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      2909 Wilson
                    </div>
                  </div>
                  <span className="urgency-pill urgent">Urgent</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar green">TH</span>
                    Trane HVAC
                  </div>
                  <span className="cost-pill">$450 est.</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    Started today
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-card" data-ticket="garage-spring">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Garage door spring replacement</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span className="urgency-pill normal">Normal</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar purple">AG</span>
                    Acme Garage Co
                  </div>
                  <span className="cost-pill">$320 est.</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    On-site 1h
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-col="awaiting-tenant">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge pink" />
                Awaiting Tenant
                <span className="count">1</span>
              </div>
            </div>
            <div className="column-body">

              <div className="ticket-card" data-ticket="carpet-consult">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Carpet cleaning consult</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      412 Pine St
                    </div>
                  </div>
                  <span className="urgency-pill low">Low</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar pink">CC</span>
                    Coastal Cleaning
                  </div>
                  <span className="cost-pill">$90 est.</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    Pending scheduling
                  </div>
                  <div className="ticket-actions">
                    <div className="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div className="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div className="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-col="completed">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge green" />
                Completed
                <span className="count">15</span>
              </div>
            </div>
            <div className="column-body">

              <div className="ticket-card" data-ticket="hvac-filter">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">HVAC filter replacement</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      2909 Wilson
                    </div>
                  </div>
                  <span className="urgency-pill normal">Normal</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar green">AH</span>
                    Acme HVAC
                  </div>
                  <span className="cost-pill actual">$45 actual</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    Completed Apr 8
                  </div>
                </div>
              </div>

              <div className="ticket-card" data-ticket="doorbell">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Doorbell repair</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span className="urgency-pill low">Low</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar">HM</span>
                    Handyman (Joe)
                  </div>
                  <span className="cost-pill actual">$85 actual</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    Completed Apr 5
                  </div>
                </div>
              </div>

              <div className="ticket-card" data-ticket="smoke-detector">
                <div className="ticket-head">
                  <div>
                    <div className="ticket-title">Smoke detector batteries</div>
                    <div className="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                      2907 Wilson
                    </div>
                  </div>
                  <span className="urgency-pill low">Low</span>
                </div>
                <div className="ticket-meta-row">
                  <div className="ticket-vendor">
                    <span className="vendor-avatar gray">HC</span>
                    Self (Harrison)
                  </div>
                  <span className="cost-pill actual">$0</span>
                </div>
                <div className="ticket-foot">
                  <div className="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    Completed Apr 2
                  </div>
                </div>
              </div>

            </div>
            <div className="column-foot" id="view-all-completed">
              View all 15 completed →
            </div>
          </div>

        </div>
      </div>

      
      <div className="bulk-bar">
        <div className="bulk-count">3</div>
        <span>tickets selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
            Reassign vendor
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
            Update status
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Mark complete
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export
          </button>
        </div>
      </div>

      
      <div className="drawer-backdrop" />
      <div className="drawer">

        <div className="drawer-head">
          <div className="drawer-head-left">
            <h2 id="drawer-title">Leaky bathroom faucet</h2>
            <div className="drawer-head-sub">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline", width: "12px", height: "12px", verticalAlign: "-1px", marginRight: "4px"}}><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                <span id="drawer-sub">2909 Wilson · Room B</span>
              </span>
              <span id="drawer-urgency" className="urgency-pill urgent">Urgent</span>
            </div>
          </div>
          <button className="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        
        <div className="pipeline-bar">
          <div className="pipeline-label">Status pipeline</div>
          <div className="pipeline-steps" id="pipeline-steps">
            <div className="pipeline-step done"><div className="dot">1</div>New<div className="line" /></div>
            <div className="pipeline-step current"><div className="dot">2</div>Assigned<div className="line" /></div>
            <div className="pipeline-step"><div className="dot">3</div>In Progress<div className="line" /></div>
            <div className="pipeline-step"><div className="dot">4</div>Awaiting Tenant<div className="line" /></div>
            <div className="pipeline-step"><div className="dot">5</div>Completed<div className="line" /></div>
          </div>
        </div>

        <div className="drawer-tabs">
          <div className="drawer-tab active" data-tab="details">Details</div>
          <div className="drawer-tab" data-tab="photos">
            Photos <span className="drawer-tab-count">4</span>
          </div>
          <div className="drawer-tab" data-tab="vendor">Vendor</div>
          <div className="drawer-tab" data-tab="comms">
            Comms <span className="drawer-tab-count">4</span>
          </div>
          <div className="drawer-tab" data-tab="costs">Costs</div>
        </div>

        <div className="drawer-body" id="drawer-body" />

        <div className="drawer-foot">
          <button className="btn btn-ghost" data-drawer-action="message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Message tenant
          </button>
          <button className="btn btn-dark" data-drawer-action="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
            Update status
          </button>
          <button className="btn btn-primary" data-drawer-action="complete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Mark complete
          </button>
        </div>

      </div>

    </main>

  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "200", display: "flex", flexDirection: "column", gap: "8px"}} />

  

  <style dangerouslySetInnerHTML={{__html: "\n    @keyframes slideIn {\n      from { opacity: 0; transform: translateX(20px); }\n      to { opacity: 1; transform: translateX(0); }\n    }\n  "}} />


    </>
  );
}
