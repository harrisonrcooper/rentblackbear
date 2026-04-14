"use client";

// Mock ported from ~/Desktop/tenantory/leases.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 320px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item {\n      border-right: 1px solid var(--border); padding-right: 24px;\n    }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-delta.gray { color: var(--text-muted); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== View toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: var(--pink);\n    }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Kanban board ===== */\n    .kanban-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }\n    .kanban {\n      display: grid;\n      grid-template-columns: repeat(4, minmax(300px, 1fr));\n      gap: 14px; height: 100%;\n    }\n\n    .column {\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      display: flex; flex-direction: column;\n      min-width: 300px;\n      overflow: hidden;\n    }\n    .column-head {\n      padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface);\n    }\n    .column-title {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; font-weight: 700; color: var(--text);\n    }\n    .column-title .count {\n      background: var(--surface-alt); color: var(--text-muted);\n      font-size: 11px; font-weight: 700;\n      padding: 2px 8px; border-radius: 100px;\n    }\n    .column-title .dot-badge {\n      width: 8px; height: 8px; border-radius: 50%;\n    }\n    .column-title .dot-badge.pink { background: var(--pink); }\n    .column-title .dot-badge.blue { background: var(--blue); }\n    .column-title .dot-badge.orange { background: var(--orange); }\n    .column-title .dot-badge.green { background: var(--green); }\n    .column-title .dot-badge.gray { background: var(--text-faint); }\n    .column-title .dot-badge.red { background: var(--red); }\n    .column-alert {\n      font-size: 11px; font-weight: 700;\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 8px; border-radius: 100px;\n    }\n    .column-alert.pink { background: var(--pink-bg); color: var(--pink); }\n    .column-alert.orange { background: var(--orange-bg); color: var(--orange); }\n    .column-alert svg { width: 11px; height: 11px; }\n    .column-body {\n      padding: 12px; display: flex; flex-direction: column; gap: 10px;\n      overflow-y: auto; flex: 1;\n    }\n\n    /* ===== Lease card ===== */\n    .lease-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n      transition: all 0.15s ease;\n      cursor: pointer; position: relative;\n    }\n    .lease-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }\n    .lease-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }\n    .lease-card.stale { border-left: 3px solid var(--pink); }\n    .lease-card.expiring { border-left: 3px solid var(--pink); }\n\n    .lease-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 10px; margin-bottom: 10px;\n    }\n    .lease-identity {\n      display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;\n    }\n    .lease-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px; color: var(--blue);\n      background: var(--blue-pale); flex-shrink: 0;\n    }\n    .lease-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .lease-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .lease-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .lease-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .lease-avatar.gold { background: rgba(245,166,35,0.12); color: var(--gold); }\n    .lease-name { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.2; }\n    .lease-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    .lease-rent-chip {\n      display: inline-flex; align-items: baseline; gap: 2px;\n      padding: 4px 10px; border-radius: 100px;\n      background: var(--surface-alt); color: var(--text);\n      font-size: 13px; font-weight: 800; letter-spacing: -0.01em;\n      flex-shrink: 0;\n    }\n    .lease-rent-chip small { font-size: 10px; font-weight: 700; color: var(--text-muted); }\n\n    .lease-property {\n      display: flex; align-items: center; gap: 6px;\n      font-size: 12px; color: var(--text-muted);\n      margin-bottom: 10px;\n    }\n    .lease-property svg { width: 12px; height: 12px; }\n\n    .lease-term {\n      display: flex; align-items: center; gap: 6px;\n      font-size: 11px; color: var(--text); font-weight: 600;\n      background: var(--surface-alt); padding: 6px 10px;\n      border-radius: 8px; margin-bottom: 10px;\n      font-variant-numeric: tabular-nums;\n    }\n    .lease-term svg { width: 12px; height: 12px; color: var(--text-faint); }\n    .lease-term .arrow { color: var(--text-faint); margin: 0 2px; }\n\n    .lease-flags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }\n    .lease-flag {\n      display: inline-flex; align-items: center; gap: 3px;\n      padding: 2px 7px; border-radius: 4px;\n      font-size: 10px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .lease-flag.stale { background: var(--pink-bg); color: var(--pink); }\n    .lease-flag.renewal { background: var(--orange-bg); color: var(--orange); }\n    .lease-flag.signed { background: var(--green-bg); color: var(--green-dark); }\n    .lease-flag svg { width: 10px; height: 10px; }\n\n    /* Status bar at bottom of card */\n    .lease-status {\n      display: flex; align-items: center; gap: 6px;\n      padding: 8px 10px; border-radius: 8px;\n      font-size: 11px; font-weight: 600;\n      margin-bottom: 10px;\n    }\n    .lease-status svg { width: 12px; height: 12px; flex-shrink: 0; }\n    .lease-status.pending { background: var(--orange-bg); color: var(--orange); }\n    .lease-status.executed { background: var(--green-bg); color: var(--green-dark); }\n    .lease-status.expiring { background: var(--pink-bg); color: var(--pink); }\n    .lease-status.draft { background: var(--surface-alt); color: var(--text-muted); }\n\n    /* Footer */\n    .lease-foot {\n      display: flex; justify-content: space-between; align-items: center;\n      padding-top: 10px; border-top: 1px solid var(--border);\n    }\n    .lease-time {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; color: var(--text-faint); font-weight: 500;\n    }\n    .lease-time svg { width: 12px; height: 12px; }\n    .lease-time.warn { color: var(--orange); }\n    .lease-time.urgent { color: var(--pink); }\n    .lease-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }\n    .lease-card:hover .lease-actions { opacity: 1; }\n    .lease-action {\n      width: 26px; height: 26px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .lease-action:hover { background: var(--surface-alt); color: var(--blue); }\n    .lease-action.remind:hover { background: var(--orange-bg); color: var(--orange); }\n    .lease-action.edit:hover { background: var(--blue-pale); color: var(--blue); }\n    .lease-action svg { width: 14px; height: 14px; }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 620px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: flex; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 20px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 16px;\n    }\n    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }\n    .drawer-avatar {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue), var(--pink));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 18px; flex-shrink: 0;\n    }\n    .drawer-head-info { min-width: 0; flex: 1; }\n    .drawer-head-info h2 {\n      font-size: 20px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.2;\n      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;\n    }\n    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n    .status-pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.02em;\n    }\n    .status-pill.pending { background: var(--orange-bg); color: var(--orange); }\n    .status-pill.executed { background: var(--green-bg); color: var(--green-dark); }\n    .status-pill.expiring { background: var(--pink-bg); color: var(--pink); }\n    .status-pill.draft { background: var(--surface-alt); color: var(--text-muted); }\n    .status-pill::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    /* Snapshot bar */\n    .drawer-snapshot {\n      padding: 16px 24px; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;\n      background: var(--surface-subtle);\n    }\n    .snapshot-item { border-right: 1px solid var(--border); padding-right: 16px; }\n    .snapshot-item:last-child { border-right: none; padding-right: 0; }\n    .snapshot-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;\n    }\n    .snapshot-value {\n      font-size: 13px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em; line-height: 1.3;\n      font-variant-numeric: tabular-nums;\n    }\n    .snapshot-value.green { color: var(--green-dark); }\n    .snapshot-value.orange { color: var(--orange); }\n    .snapshot-value.pink { color: var(--pink); }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n      cursor: pointer;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n    .drawer-tab-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n    }\n    .drawer-tab.active .drawer-tab-count {\n      background: var(--blue-pale); color: var(--blue);\n    }\n\n    .drawer-body {\n      flex: 1; overflow-y: auto; padding: 24px;\n    }\n    .drawer-section { margin-bottom: 24px; }\n    .drawer-section:last-child { margin-bottom: 0; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .drawer-section-head-action {\n      text-transform: none; letter-spacing: 0; font-size: 11px; color: var(--blue);\n      font-weight: 600; cursor: pointer;\n    }\n    .drawer-section-head-action:hover { text-decoration: underline; }\n    .drawer-row {\n      display: grid; grid-template-columns: 140px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row span:first-child { color: var(--text-muted); }\n    .drawer-row span:last-child { color: var(--text); font-weight: 500; }\n\n    /* Move-in chain */\n    .chain { display: flex; flex-direction: column; gap: 2px; }\n    .chain-step {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      transition: all 0.15s ease;\n    }\n    .chain-step.done { background: var(--green-bg); border-color: rgba(30,169,124,0.2); }\n    .chain-step.pending { opacity: 0.75; }\n    .chain-step-icon {\n      width: 26px; height: 26px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface-alt); color: var(--text-faint);\n      flex-shrink: 0;\n    }\n    .chain-step.done .chain-step-icon { background: var(--green); color: #fff; }\n    .chain-step-icon svg { width: 14px; height: 14px; }\n    .chain-step-text { flex: 1; }\n    .chain-step-name { font-size: 13px; font-weight: 600; color: var(--text); }\n    .chain-step.pending .chain-step-name { color: var(--text-muted); }\n    .chain-step-meta { font-size: 11px; color: var(--text-faint); margin-top: 1px; }\n\n    /* Sections list */\n    .sections-list { display: flex; flex-direction: column; gap: 2px; }\n    .section-row {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .section-row:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .section-number {\n      width: 26px; height: 26px; border-radius: 6px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 11px;\n      flex-shrink: 0; font-variant-numeric: tabular-nums;\n    }\n    .section-row:hover .section-number { background: var(--blue); color: #fff; }\n    .section-name { flex: 1; font-size: 13px; font-weight: 600; color: var(--text); }\n    .section-status {\n      font-size: 10px; font-weight: 700; color: var(--green-dark);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .section-status.custom { color: var(--orange); }\n    .section-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }\n    .section-row:hover .section-actions { opacity: 1; }\n    .section-action {\n      width: 24px; height: 24px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted);\n    }\n    .section-action:hover { background: var(--surface); color: var(--blue); }\n    .section-action svg { width: 13px; height: 13px; }\n\n    /* Signature boxes */\n    .sig-grid {\n      display: grid; grid-template-columns: 1fr; gap: 14px;\n    }\n    .sig-card {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      padding: 18px; background: var(--surface);\n    }\n    .sig-card.signed { border-color: rgba(30,169,124,0.3); background: linear-gradient(180deg, var(--green-bg), #fff); }\n    .sig-card.pending { border-style: dashed; }\n    .sig-head {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-bottom: 12px;\n    }\n    .sig-party { display: flex; align-items: center; gap: 10px; }\n    .sig-party-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700;\n    }\n    .sig-party-avatar.landlord { background: var(--navy); color: #fff; }\n    .sig-party-avatar.tenant { background: var(--pink-bg); color: var(--pink); }\n    .sig-party-name { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }\n    .sig-party-role { font-size: 11px; color: var(--text-muted); margin-top: 1px; }\n    .sig-status-pill {\n      font-size: 10px; font-weight: 700;\n      padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .sig-status-pill.signed { background: var(--green); color: #fff; }\n    .sig-status-pill.pending { background: var(--orange-bg); color: var(--orange); }\n    .sig-box {\n      height: 80px; border: 1px dashed var(--border);\n      border-radius: 8px; background: var(--surface-subtle);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); font-size: 12px;\n      position: relative; overflow: hidden;\n    }\n    .sig-card.signed .sig-box {\n      background: var(--surface); border-style: solid; border-color: rgba(30,169,124,0.2);\n      padding: 0 20px;\n    }\n    .sig-drawn {\n      font-family: 'Dancing Script', 'Brush Script MT', cursive;\n      font-size: 32px; color: var(--navy-dark); font-weight: 500;\n      letter-spacing: -0.02em; transform: rotate(-3deg);\n    }\n    .sig-meta {\n      display: flex; justify-content: space-between;\n      font-size: 11px; color: var(--text-muted); margin-top: 10px;\n      font-variant-numeric: tabular-nums;\n    }\n    .sig-meta strong { color: var(--text); font-weight: 600; }\n\n    /* Documents tab */\n    .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }\n    .doc-tile {\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; display: flex; align-items: center; gap: 10px;\n      background: var(--surface); transition: all 0.15s ease; cursor: pointer;\n    }\n    .doc-tile:hover { border-color: var(--blue); }\n    .doc-tile-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--blue-pale); color: var(--blue); flex-shrink: 0;\n    }\n    .doc-tile-icon svg { width: 14px; height: 14px; }\n    .doc-tile-text { flex: 1; min-width: 0; }\n    .doc-tile-name { font-size: 12px; font-weight: 600; color: var(--text); }\n    .doc-tile-meta { font-size: 11px; color: var(--text-muted); }\n\n    /* Activity */\n    .activity-feed { position: relative; padding-left: 24px; }\n    .activity-feed::before {\n      content: \"\"; position: absolute; left: 10px; top: 4px; bottom: 4px;\n      width: 2px; background: var(--border);\n    }\n    .activity-node {\n      position: relative; padding: 0 0 18px 0;\n    }\n    .activity-node:last-child { padding-bottom: 0; }\n    .activity-node::before {\n      content: \"\"; position: absolute; left: -18px; top: 4px;\n      width: 10px; height: 10px; border-radius: 50%;\n      background: var(--blue-pale); border: 2px solid var(--blue);\n    }\n    .activity-node.pink::before { background: var(--pink-bg); border-color: var(--pink); }\n    .activity-node.green::before { background: var(--green-bg); border-color: var(--green); }\n    .activity-node.orange::before { background: var(--orange-bg); border-color: var(--orange); }\n    .activity-node-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .activity-node-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .activity-node-time { font-size: 11px; color: var(--text-faint); margin-top: 4px; }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 16px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: flex; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    @media (max-width: 1280px) {\n      .drawer { width: 520px; }\n      .drawer-snapshot { grid-template-columns: repeat(3, 1fr); }\n      .drawer-snapshot .snapshot-item:nth-child(3) { border-right: none; }\n      .drawer-snapshot .snapshot-item:nth-child(4),\n      .drawer-snapshot .snapshot-item:nth-child(5) { border-right: 1px solid var(--border); padding-right: 16px; }\n    }\n\n    @keyframes slideIn {\n      from { opacity: 0; transform: translateX(20px); }\n      to { opacity: 1; transform: translateX(0); }\n    }\n  ";

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
          <a className="sb-nav-item active" href="leases.html">
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
          <strong>Leases</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search leases, tenants, properties..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      
      <div className="page-head-bar">
        <div>
          <h1>Leases</h1>
          <p>Templates, signatures, renewals — every contract in one place.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>
            Lease templates
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New lease
          </button>
        </div>
      </div>

      
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">Active leases</div>
          <div className="stat-value">11 <span className="stat-delta up">+1 this month</span></div>
          <div className="stat-sub">Across 4 properties</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Pending signature</div>
          <div className="stat-value" style={{color: "var(--orange)"}}>2</div>
          <div className="stat-sub">Avg 2.3 days to sign</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Expiring in 60 days</div>
          <div className="stat-value" style={{color: "var(--pink)"}}>3</div>
          <div className="stat-sub">Renewal prompts sent</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg lease value</div>
          <div className="stat-value">$1,025<span style={{fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "0"}}>/mo</span></div>
          <div className="stat-sub">Across portfolio</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Templates</div>
          <div className="stat-value">4 <span className="stat-delta gray">Last edited 3d ago</span></div>
          <div className="stat-sub">2 state-compliant</div>
        </div>
      </div>

      
      <div className="toolbar">
        <div className="saved-views">
          <div className="saved-view active" data-filter="all">
            All <span className="saved-view-count">11</span>
          </div>
          <div className="saved-view" data-filter="active">
            <span className="saved-view-dot" style={{background: "var(--green)"}} />
            Active <span className="saved-view-count">11</span>
          </div>
          <div className="saved-view" data-filter="draft">
            <span className="saved-view-dot" style={{background: "var(--text-faint)"}} />
            Draft <span className="saved-view-count">1</span>
          </div>
          <div className="saved-view" data-filter="pending">
            <span className="saved-view-dot" style={{background: "var(--orange)"}} />
            Pending signature <span className="saved-view-count">2</span>
          </div>
          <div className="saved-view" data-filter="executed">
            <span className="saved-view-dot" style={{background: "var(--green)"}} />
            Executed <span className="saved-view-count">8</span>
          </div>
          <div className="saved-view" data-filter="expiring">
            <span className="saved-view-dot" />
            Expiring soon <span className="saved-view-count">3</span>
          </div>
          <div className="saved-view" data-filter="templates">
            Templates <span className="saved-view-count">4</span>
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

          
          <div className="column" data-column="draft">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge gray" />
                Drafts
                <span className="count">1</span>
              </div>
            </div>
            <div className="column-body">

              <div className="lease-card" data-lease="tara-ramirez" data-status="draft">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar purple">TR</div>
                    <div>
                      <div className="lease-name">Tara Ramirez</div>
                      <div className="lease-sub">Incoming tenant · from application</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$825<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room D
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  May 1, 2026 <span className="arrow">→</span> Apr 30, 2027
                </div>
                <div className="lease-status draft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
                  Draft — 18 of 20 sections filled
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Created 4h ago</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-column="pending">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge orange" />
                Pending Signature
                <span className="count">2</span>
              </div>
              <span className="column-alert pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                1 stale 5d+
              </span>
            </div>
            <div className="column-body">

              <div className="lease-card" data-lease="sarah-chen" data-status="pending">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar">SC</div>
                    <div>
                      <div className="lease-name">Sarah Chen</div>
                      <div className="lease-sub">Sent via DocuSign · 2h ago</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$850<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room A
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  May 1, 2026 <span className="arrow">→</span> Apr 30, 2027
                </div>
                <div className="lease-status pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  Awaiting tenant signature · sent 2h ago
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Landlord signed</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card stale" data-lease="carmen-miller" data-status="pending">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar pink">CM</div>
                    <div>
                      <div className="lease-name">Carmen Miller</div>
                      <div className="lease-sub">Sent via DocuSign · 5 days ago</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,425<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2907 Wilson Dr NW
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  May 1, 2026 <span className="arrow">→</span> Apr 30, 2027
                </div>
                <div className="lease-flags">
                  <span className="lease-flag stale">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                    5 days stale
                  </span>
                </div>
                <div className="lease-status pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  Awaiting tenant signature · 3 reminders sent
                </div>
                <div className="lease-foot">
                  <div className="lease-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>5d in stage</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-column="executed">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge green" />
                Executed
                <span className="count">8</span>
              </div>
            </div>
            <div className="column-body">

              <div className="lease-card" data-lease="marcus-lee" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar green">ML</div>
                    <div>
                      <div className="lease-name">Marcus Lee</div>
                      <div className="lease-sub">Current tenant · 14 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,350<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Feb 1, 2025 <span className="arrow">→</span> Jan 31, 2027
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Auto-renews in 293d
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>14 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="priya-patel" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar orange">PP</div>
                    <div>
                      <div className="lease-name">Priya Patel</div>
                      <div className="lease-sub">Current tenant · 9 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$925<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room B
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Jul 15, 2025 <span className="arrow">→</span> Jul 14, 2026
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Auto-renews in 92d
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>9 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="jordan-brooks" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar green">JB</div>
                    <div>
                      <div className="lease-name">Jordan Brooks</div>
                      <div className="lease-sub">New tenant · just signed</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$900<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room C
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Apr 1, 2026 <span className="arrow">→</span> Mar 31, 2027
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Move-in chain 4/5
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Signed 12d ago</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="kai-wong" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar">KW</div>
                    <div>
                      <div className="lease-name">Kai Wong</div>
                      <div className="lease-sub">Current tenant · 7 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$875<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room E
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Sep 1, 2025 <span className="arrow">→</span> Aug 31, 2026
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Auto-renews in 140d
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>7 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="elena-garcia" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar pink">EG</div>
                    <div>
                      <div className="lease-name">Elena Garcia</div>
                      <div className="lease-sub">Current tenant · 22 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,100<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  412 Maple St · Unit 2
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Jun 1, 2024 <span className="arrow">→</span> May 31, 2026
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · 2-year term
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>22 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="tomas-rivera" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar gold">TR</div>
                    <div>
                      <div className="lease-name">Tomás Rivera</div>
                      <div className="lease-sub">Current tenant · 11 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$795<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson Dr NW · Room F
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  May 15, 2025 <span className="arrow">→</span> May 14, 2026
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Renewal pending
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>11 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="amelia-ford" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar purple">AF</div>
                    <div>
                      <div className="lease-name">Amelia Ford</div>
                      <div className="lease-sub">Current tenant · 5 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,250<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  412 Maple St · Unit 1
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Nov 1, 2025 <span className="arrow">→</span> Oct 31, 2026
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Auto-renews in 201d
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>5 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card" data-lease="nate-singh" data-status="executed">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar orange">NS</div>
                    <div>
                      <div className="lease-name">Nate Singh</div>
                      <div className="lease-sub">Current tenant · 3 mo</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,050<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave · Basement
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Jan 15, 2026 <span className="arrow">→</span> Jan 14, 2027
                </div>
                <div className="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Fully executed · Month-to-month after
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>3 mo active</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column" data-column="expiring">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge pink" />
                Expiring Soon
                <span className="count">3</span>
              </div>
              <span className="column-alert orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                Renewal action needed
              </span>
            </div>
            <div className="column-body">

              <div className="lease-card expiring" data-lease="daniel-kim" data-status="expiring">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar pink">DK</div>
                    <div>
                      <div className="lease-name">Daniel Kim</div>
                      <div className="lease-sub">Expires in 48 days</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$980<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2907 Wilson Dr NW · Upper
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Jun 1, 2025 <span className="arrow">→</span> May 31, 2026
                </div>
                <div className="lease-flags">
                  <span className="lease-flag renewal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
                    Renewal offer sent
                  </span>
                </div>
                <div className="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Expires May 31 · 48 days left
                </div>
                <div className="lease-foot">
                  <div className="lease-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Response pending</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card expiring" data-lease="olivia-reed" data-status="expiring">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar green">OR</div>
                    <div>
                      <div className="lease-name">Olivia Reed</div>
                      <div className="lease-sub">Expires in 78 days</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,180<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave · Upstairs
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Jul 1, 2025 <span className="arrow">→</span> Jun 30, 2026
                </div>
                <div className="lease-flags">
                  <span className="lease-flag renewal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
                    Renewal offer queued
                  </span>
                </div>
                <div className="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Expires Jun 30 · 78 days left
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Offer sends in 18d</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="lease-card expiring" data-lease="brandon-hayes" data-status="expiring">
                <div className="lease-head">
                  <div className="lease-identity">
                    <div className="lease-avatar">BH</div>
                    <div>
                      <div className="lease-name">Brandon Hayes</div>
                      <div className="lease-sub">Expires in 140 days</div>
                    </div>
                  </div>
                  <div className="lease-rent-chip">$1,395<small>/mo</small></div>
                </div>
                <div className="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  412 Maple St · Unit 3
                </div>
                <div className="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  Sep 1, 2025 <span className="arrow">→</span> Aug 31, 2026
                </div>
                <div className="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Expires Aug 31 · 140 days left
                </div>
                <div className="lease-foot">
                  <div className="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Offer sends in 80d</div>
                  <div className="lease-actions">
                    <div className="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                    <div className="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></div>
                    <div className="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      
      <div className="bulk-bar">
        <div className="bulk-count">3</div>
        <span>leases selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            Send reminders
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
            Renew all
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
            <div className="drawer-avatar">SC</div>
            <div className="drawer-head-info">
              <h2>
                <span className="drawer-name">Sarah Chen</span>
                <span className="status-pill pending"><span className="status-pill-label">Pending signature</span></span>
              </h2>
              <p className="drawer-subtitle">2909 Wilson Dr NW · Room A · Lease #TNT-2026-017</p>
            </div>
          </div>
          <button className="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="drawer-snapshot">
          <div className="snapshot-item">
            <div className="snapshot-label">Term</div>
            <div className="snapshot-value snap-term">May 1, 2026<br /><span style={{color: "var(--text-muted)", fontWeight: "500"}}>→ Apr 30, 2027</span></div>
          </div>
          <div className="snapshot-item">
            <div className="snapshot-label">Monthly rent</div>
            <div className="snapshot-value snap-rent">$850/mo</div>
          </div>
          <div className="snapshot-item">
            <div className="snapshot-label">Security deposit</div>
            <div className="snapshot-value snap-deposit">$850</div>
          </div>
          <div className="snapshot-item">
            <div className="snapshot-label">Signatures</div>
            <div className="snapshot-value orange snap-sig">1 of 2</div>
          </div>
          <div className="snapshot-item">
            <div className="snapshot-label">Time on stage</div>
            <div className="snapshot-value snap-stage">2h</div>
          </div>
        </div>

        <div className="drawer-tabs">
          <div className="drawer-tab active" data-tab="overview">Overview</div>
          <div className="drawer-tab" data-tab="sections">
            Sections
            <span className="drawer-tab-count">20</span>
          </div>
          <div className="drawer-tab" data-tab="signatures">
            Signatures
            <span className="drawer-tab-count sig-count">1/2</span>
          </div>
          <div className="drawer-tab" data-tab="documents">
            Documents
            <span className="drawer-tab-count">4</span>
          </div>
          <div className="drawer-tab" data-tab="activity">Activity</div>
        </div>

        <div className="drawer-body" />

        <div className="drawer-foot">
          <button className="btn btn-ghost" data-action="reminder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            Send reminder
          </button>
          <button className="btn btn-dark" data-action="pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download PDF
          </button>
          <button className="btn btn-primary" data-action="edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
            Edit lease
          </button>
        </div>

      </div>

    </main>

  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "100", display: "flex", flexDirection: "column", gap: "8px"}} />

  


    </>
  );
}
