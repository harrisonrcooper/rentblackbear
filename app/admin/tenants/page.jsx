"use client";

// Mock ported from ~/Desktop/blackbear/tenants.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (shared with admin) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item {\n      border-right: 1px solid var(--border); padding-right: 24px;\n    }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-delta.gray { color: var(--text-faint); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== View toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: var(--pink);\n    }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Tenants table ===== */\n    .table-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }\n    .tenants-table-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .tenants-table {\n      width: 100%; border-collapse: collapse; font-size: 13px;\n    }\n    .tenants-table thead th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em;\n      padding: 14px 18px; border-bottom: 1px solid var(--border);\n      background: var(--surface-subtle); white-space: nowrap;\n    }\n    .tenants-table tbody tr {\n      border-bottom: 1px solid var(--border);\n      transition: background 0.15s ease;\n      cursor: pointer;\n    }\n    .tenants-table tbody tr:last-child { border-bottom: none; }\n    .tenants-table tbody tr:hover { background: var(--surface-subtle); }\n    .tenants-table tbody tr.selected {\n      outline: 2px solid var(--pink);\n      outline-offset: -2px;\n      background: var(--pink-bg);\n    }\n    .tenants-table tbody tr.active-row {\n      background: var(--blue-pale);\n    }\n    .tenants-table td {\n      padding: 14px 18px; vertical-align: middle;\n    }\n\n    .tenant-cell {\n      display: flex; align-items: center; gap: 12px;\n    }\n    .tenant-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px; color: var(--blue);\n      background: var(--blue-pale); flex-shrink: 0;\n    }\n    .tenant-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .tenant-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .tenant-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .tenant-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .tenant-avatar.gold { background: rgba(245,166,35,0.12); color: var(--gold); }\n    .tenant-name { font-weight: 700; font-size: 13.5px; color: var(--text); line-height: 1.2; }\n    .tenant-email { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    .cell-property { color: var(--text); font-weight: 500; }\n    .cell-property small { display: block; color: var(--text-faint); font-weight: 500; font-size: 11px; margin-top: 2px; }\n\n    .cell-balance { font-variant-numeric: tabular-nums; font-weight: 700; }\n    .cell-balance.zero { color: var(--green-dark); }\n    .cell-balance.owed { color: var(--red); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n      white-space: nowrap;\n    }\n    .pill::before {\n      content: \"\"; width: 6px; height: 6px; border-radius: 50%;\n      background: currentColor;\n    }\n    .pill.green { background: var(--green-bg); color: var(--green-dark); }\n    .pill.blue { background: var(--blue-pale); color: var(--blue); }\n    .pill.red { background: var(--red-bg); color: var(--red); }\n    .pill.orange { background: var(--orange-bg); color: var(--orange); }\n    .pill.gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill.pink { background: var(--pink-bg); color: var(--pink); }\n\n    .row-actions {\n      display: flex; gap: 4px; justify-content: flex-end;\n      opacity: 0; transition: opacity 0.15s ease;\n    }\n    .tenants-table tbody tr:hover .row-actions { opacity: 1; }\n    .row-action {\n      width: 28px; height: 28px; border-radius: 7px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); background: var(--surface-alt);\n      transition: all 0.15s ease;\n    }\n    .row-action:hover { background: var(--blue-pale); color: var(--blue); }\n    .row-action svg { width: 14px; height: 14px; }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 520px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: flex; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 20px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 16px;\n    }\n    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }\n    .drawer-avatar {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue), var(--pink));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 18px; flex-shrink: 0;\n    }\n    .drawer-head-info h2 {\n      font-size: 20px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.2;\n    }\n    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    /* Big info row (balance / lease ends / days as tenant) */\n    .drawer-info-row {\n      padding: 18px 24px; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 16px;\n    }\n    .info-cell {\n      padding: 0 8px;\n      border-right: 1px solid var(--border);\n    }\n    .info-cell:last-child { border-right: none; }\n    .info-cell:first-child { padding-left: 0; }\n    .info-cell .info-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;\n    }\n    .info-cell .info-value {\n      font-size: 20px; font-weight: 800; letter-spacing: -0.02em;\n      line-height: 1.15; color: var(--text);\n      font-variant-numeric: tabular-nums;\n    }\n    .info-cell .info-value.green { color: var(--green-dark); }\n    .info-cell .info-value.red { color: var(--red); }\n    .info-cell .info-sub {\n      font-size: 11px; color: var(--text-muted); margin-top: 2px;\n    }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n      overflow-x: auto;\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n      white-space: nowrap; cursor: pointer;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n    .drawer-tab-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n    }\n\n    .drawer-body {\n      flex: 1; overflow-y: auto; padding: 24px;\n    }\n    .drawer-section { margin-bottom: 24px; }\n    .drawer-section:last-child { margin-bottom: 0; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .drawer-section-head .chip {\n      text-transform: none; letter-spacing: 0;\n      font-size: 11px; font-weight: 700;\n      padding: 2px 8px; border-radius: 100px;\n      background: var(--orange-bg); color: var(--orange);\n    }\n    .drawer-row {\n      display: grid; grid-template-columns: 140px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row span:first-child { color: var(--text-muted); }\n    .drawer-row span:last-child { color: var(--text); font-weight: 500; }\n\n    /* Doc tiles */\n    .doc-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;\n    }\n    .doc-tile {\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; display: flex; align-items: center; gap: 10px;\n      background: var(--surface);\n    }\n    .doc-tile.received { border-color: var(--green); background: var(--green-bg); }\n    .doc-tile.pending { border-color: var(--border); opacity: 0.7; }\n    .doc-tile-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface); flex-shrink: 0;\n    }\n    .doc-tile.received .doc-tile-icon { background: rgba(255,255,255,0.6); color: var(--green-dark); }\n    .doc-tile.pending .doc-tile-icon { background: var(--surface-alt); color: var(--text-faint); }\n    .doc-tile-icon svg { width: 14px; height: 14px; }\n    .doc-tile-text { flex: 1; min-width: 0; }\n    .doc-tile-name { font-size: 12px; font-weight: 600; color: var(--text); }\n    .doc-tile-meta { font-size: 11px; color: var(--text-muted); }\n\n    /* Activity */\n    .activity-feed { position: relative; padding-left: 24px; }\n    .activity-feed::before {\n      content: \"\"; position: absolute; left: 10px; top: 4px; bottom: 4px;\n      width: 2px; background: var(--border);\n    }\n    .activity-node {\n      position: relative; padding: 0 0 18px 0;\n    }\n    .activity-node:last-child { padding-bottom: 0; }\n    .activity-node::before {\n      content: \"\"; position: absolute; left: -18px; top: 4px;\n      width: 10px; height: 10px; border-radius: 50%;\n      background: var(--blue-pale); border: 2px solid var(--blue);\n    }\n    .activity-node.pink::before { background: var(--pink-bg); border-color: var(--pink); }\n    .activity-node.green::before { background: var(--green-bg); border-color: var(--green); }\n    .activity-node.orange::before { background: var(--orange-bg); border-color: var(--orange); }\n    .activity-node-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .activity-node-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .activity-node-time { font-size: 11px; color: var(--text-faint); margin-top: 4px; }\n\n    /* Payments list */\n    .pmt-list {\n      display: flex; flex-direction: column;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      overflow: hidden;\n    }\n    .pmt-row {\n      display: grid; grid-template-columns: auto 1fr auto auto;\n      gap: 12px; align-items: center;\n      padding: 12px 14px;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface);\n    }\n    .pmt-row:last-child { border-bottom: none; }\n    .pmt-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--green-bg); color: var(--green-dark);\n      flex-shrink: 0;\n    }\n    .pmt-icon.red { background: var(--red-bg); color: var(--red); }\n    .pmt-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .pmt-icon svg { width: 14px; height: 14px; }\n    .pmt-main { min-width: 0; }\n    .pmt-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .pmt-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .pmt-amount {\n      font-variant-numeric: tabular-nums; font-weight: 700;\n      font-size: 13px; color: var(--text);\n    }\n\n    /* Notes */\n    .note-card {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      padding: 12px 14px; background: var(--surface);\n      margin-bottom: 8px;\n    }\n    .note-card:last-child { margin-bottom: 0; }\n    .note-head {\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 11px; margin-bottom: 6px;\n    }\n    .note-author { font-weight: 700; color: var(--text); }\n    .note-time { color: var(--text-faint); }\n    .note-body { font-size: 13px; color: var(--text); line-height: 1.45; }\n\n    /* Checklist (move-out chain) */\n    .checklist {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      overflow: hidden; background: var(--surface);\n    }\n    .check-item {\n      display: flex; align-items: flex-start; gap: 10px;\n      padding: 10px 14px;\n      border-bottom: 1px solid var(--border);\n    }\n    .check-item:last-child { border-bottom: none; }\n    .check-box {\n      width: 18px; height: 18px; border-radius: 5px;\n      border: 1.5px solid var(--border-strong);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; margin-top: 1px;\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .check-box.done {\n      background: var(--green-dark); border-color: var(--green-dark); color: #fff;\n    }\n    .check-box svg { width: 12px; height: 12px; }\n    .check-text { flex: 1; min-width: 0; font-size: 13px; color: var(--text); }\n    .check-text small { display: block; color: var(--text-faint); font-size: 11px; margin-top: 2px; }\n    .check-item.done .check-text { color: var(--text-muted); text-decoration: line-through; }\n    .check-item.done .check-text small { text-decoration: none; }\n\n    /* Lease PDF download */\n    .lease-pdf {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border: 1px solid var(--border);\n      border-radius: var(--radius); background: var(--surface-subtle);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .lease-pdf:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .lease-pdf-icon {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: var(--red-bg); color: var(--red);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .lease-pdf-icon svg { width: 16px; height: 16px; }\n    .lease-pdf-text { flex: 1; min-width: 0; }\n    .lease-pdf-name { font-size: 13px; font-weight: 600; color: var(--text); }\n    .lease-pdf-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .lease-pdf-dl {\n      width: 30px; height: 30px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .lease-pdf-dl svg { width: 14px; height: 14px; }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 16px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: flex; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    @media (max-width: 1200px) {\n      .drawer { width: 420px; }\n    }\n    @media (max-width: 960px) {\n      .app { grid-template-columns: 1fr; }\n      .sidebar { display: none; }\n      .stats-strip { grid-template-columns: repeat(2, 1fr); }\n      .stat-item:nth-child(2n) { border-right: none; padding-right: 0; }\n      .stat-item { padding-bottom: 12px; }\n      .drawer { width: 100%; }\n      .tenants-table thead { display: none; }\n      .tenants-table, .tenants-table tbody, .tenants-table tr, .tenants-table td { display: block; width: 100%; }\n      .tenants-table td { padding: 6px 14px; }\n      .tenants-table tbody tr { padding: 10px 0; }\n      .drawer-info-row { grid-template-columns: 1fr; }\n      .info-cell { border-right: none; border-bottom: 1px solid var(--border); padding: 8px 0; }\n      .info-cell:last-child { border-bottom: none; }\n    }\n  ";

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
            Dashboard
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
          <strong>Tenants</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, properties..." />
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
          <h1>Tenants</h1>
          <p>Active leases, balances, and lifecycle status</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export
          </button>
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Invite tenant
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New tenant
          </button>
        </div>
      </div>

      
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">Active tenants</div>
          <div className="stat-value">12 <span className="stat-delta pink">+2 this month</span></div>
          <div className="stat-sub">Across 4 properties</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">On-time rate</div>
          <div className="stat-value">94% <span className="stat-delta up">+8% MoM</span></div>
          <div className="stat-sub">Last 90 days</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg. balance</div>
          <div className="stat-value">$0</div>
          <div className="stat-sub">Across portfolio</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Renewals due</div>
          <div className="stat-value" style={{color: "var(--orange)"}}>3 <span className="stat-delta orange">Within 60 days</span></div>
          <div className="stat-sub">Send renewal offers</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Move-outs scheduled</div>
          <div className="stat-value">1 <span className="stat-delta gray">Apr 30</span></div>
          <div className="stat-sub">Chain in progress</div>
        </div>
      </div>

      
      <div className="toolbar">
        <div className="saved-views">
          <div className="saved-view active" data-view="all">
            All <span className="saved-view-count">12</span>
          </div>
          <div className="saved-view" data-view="current">
            Current <span className="saved-view-count">10</span>
          </div>
          <div className="saved-view" data-view="late">
            <span className="saved-view-dot" />
            Late <span className="saved-view-count">1</span>
          </div>
          <div className="saved-view" data-view="renewing">
            Renewing <span className="saved-view-count">3</span>
          </div>
          <div className="saved-view" data-view="moveout">
            Move-out coming <span className="saved-view-count">1</span>
          </div>
          <div className="saved-view" data-view="past">
            Past tenants <span className="saved-view-count">8</span>
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
            <button data-view-mode="board">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="18" /><rect x="15" y="3" width="6" height="12" /></svg>
              Board
            </button>
            <button className="active" data-view-mode="table">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              Table
            </button>
          </div>
        </div>
      </div>

      
      <div className="table-wrap">
        <div className="tenants-table-card">
          <table className="tenants-table">
            <thead>
              <tr>
                <th style={{width: "28%"}}>Tenant</th>
                <th style={{width: "24%"}}>Property / Room</th>
                <th style={{width: "14%"}}>Lease ends</th>
                <th style={{width: "12%"}}>Balance</th>
                <th style={{width: "14%"}}>Status</th>
                <th style={{width: "8%", textAlign: "right"}}>Actions</th>
              </tr>
            </thead>
            <tbody id="tenants-tbody" />
          </table>
        </div>
      </div>

      
      <div className="bulk-bar">
        <div className="bulk-count">0</div>
        <span>tenants selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Message all
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add charge
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            Send statement
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
              <h2>Sarah Chen</h2>
              <p>Tenant · 2909 Wilson Dr NW, Room A</p>
            </div>
          </div>
          <button className="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        
        <div className="drawer-info-row">
          <div className="info-cell">
            <div className="info-label">Balance</div>
            <div className="info-value green">$0</div>
            <div className="info-sub">Up to date</div>
          </div>
          <div className="info-cell">
            <div className="info-label">Lease ends</div>
            <div className="info-value">Aug 31, 2026</div>
            <div className="info-sub">140 days</div>
          </div>
          <div className="info-cell">
            <div className="info-label">Days as tenant</div>
            <div className="info-value">228</div>
            <div className="info-sub">Since Aug 31, 2025</div>
          </div>
        </div>

        <div className="drawer-tabs">
          <div className="drawer-tab active" data-tab="overview">Overview</div>
          <div className="drawer-tab" data-tab="lease">Lease</div>
          <div className="drawer-tab" data-tab="payments">
            Payments
            <span className="drawer-tab-count">12</span>
          </div>
          <div className="drawer-tab" data-tab="documents">Documents</div>
          <div className="drawer-tab" data-tab="notes">Notes</div>
          <div className="drawer-tab" data-tab="activity">Activity</div>
        </div>

        <div className="drawer-body" />

        <div className="drawer-foot">
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Message
          </button>
          <button className="btn btn-dark">
            Add charge
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            Open lease
          </button>
        </div>

      </div>

    </main>

  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "100", display: "flex", flexDirection: "column", gap: "8px"}} />

  

  <style dangerouslySetInnerHTML={{__html: "\n    @keyframes slideIn {\n      from { opacity: 0; transform: translateX(20px); }\n      to { opacity: 1; transform: translateX(0); }\n    }\n  "}} />


    </>
  );
}
