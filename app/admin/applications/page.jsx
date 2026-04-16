"use client";

// Mock ported from ~/Desktop/blackbear/applications.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (shared with admin) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item {\n      border-right: 1px solid var(--border); padding-right: 24px;\n    }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== View toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: var(--pink);\n    }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Kanban board ===== */\n    .kanban-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }\n    .kanban {\n      display: grid;\n      grid-template-columns: repeat(6, minmax(280px, 1fr));\n      gap: 14px; height: 100%;\n    }\n\n    .column {\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      display: flex; flex-direction: column;\n      min-width: 280px;\n      overflow: hidden;\n    }\n    .column-head {\n      padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;\n      border-bottom: 1px solid var(--border);\n      background: var(--surface);\n    }\n    .column-title {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; font-weight: 700; color: var(--text);\n    }\n    .column-title .count {\n      background: var(--surface-alt); color: var(--text-muted);\n      font-size: 11px; font-weight: 700;\n      padding: 2px 8px; border-radius: 100px;\n    }\n    .column-title .dot-badge {\n      width: 8px; height: 8px; border-radius: 50%;\n    }\n    .column-title .dot-badge.pink { background: var(--pink); }\n    .column-title .dot-badge.blue { background: var(--blue); }\n    .column-title .dot-badge.orange { background: var(--orange); }\n    .column-title .dot-badge.green { background: var(--green); }\n    .column-title .dot-badge.gray { background: var(--text-faint); }\n    .column-title .dot-badge.red { background: var(--red); }\n    .column-alert {\n      font-size: 11px; font-weight: 700; color: var(--orange);\n      display: inline-flex; align-items: center; gap: 3px;\n    }\n    .column-alert svg { width: 12px; height: 12px; }\n    .column-body {\n      padding: 12px; display: flex; flex-direction: column; gap: 10px;\n      overflow-y: auto; flex: 1;\n    }\n\n    /* ===== Applicant card ===== */\n    .appl-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n      transition: all 0.15s ease;\n      cursor: pointer; position: relative;\n    }\n    .appl-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }\n    .appl-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }\n    .appl-card.flagged { border-left: 3px solid var(--pink); }\n\n    .appl-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 10px; margin-bottom: 10px;\n    }\n    .appl-identity {\n      display: flex; align-items: center; gap: 10px;\n    }\n    .appl-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px; color: var(--blue);\n      background: var(--blue-pale); flex-shrink: 0;\n    }\n    .appl-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .appl-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .appl-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .appl-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .appl-name { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.2; }\n    .appl-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    .score-chip {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 13px; font-weight: 800; letter-spacing: -0.01em;\n      flex-shrink: 0;\n    }\n    .score-chip.strong { background: var(--green-bg); color: var(--green-dark); }\n    .score-chip.moderate { background: var(--orange-bg); color: var(--orange); }\n    .score-chip.risky { background: var(--red-bg); color: var(--red); }\n    .score-chip.incomplete { background: var(--surface-alt); color: var(--text-muted); }\n    .score-chip small { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-left: 3px; opacity: 0.8; }\n\n    .appl-property {\n      display: flex; align-items: center; gap: 6px;\n      font-size: 12px; color: var(--text-muted);\n      margin-bottom: 10px;\n    }\n    .appl-property svg { width: 12px; height: 12px; }\n\n    .appl-flags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }\n    .appl-flag {\n      display: inline-flex; align-items: center; gap: 3px;\n      padding: 2px 7px; border-radius: 4px;\n      font-size: 10px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .appl-flag.duplicate { background: var(--pink-bg); color: var(--pink); }\n    .appl-flag.income { background: var(--orange-bg); color: var(--orange); }\n    .appl-flag.eviction { background: var(--red-bg); color: var(--red); }\n    .appl-flag.ai { background: var(--purple-bg); color: var(--purple); }\n    .appl-flag svg { width: 10px; height: 10px; }\n\n    /* Doc completeness */\n    .appl-docs { margin-bottom: 10px; }\n    .appl-docs-label {\n      display: flex; justify-content: space-between; font-size: 11px;\n      color: var(--text-muted); margin-bottom: 4px;\n    }\n    .appl-docs-label strong { color: var(--text); font-weight: 600; }\n    .appl-docs-bar {\n      height: 4px; background: var(--surface-alt); border-radius: 100px;\n      overflow: hidden;\n    }\n    .appl-docs-fill {\n      height: 100%; background: var(--blue); border-radius: 100px;\n      transition: width 0.3s ease;\n    }\n    .appl-docs-fill.complete { background: var(--green); }\n    .appl-docs-fill.partial { background: var(--orange); }\n\n    /* Footer */\n    .appl-foot {\n      display: flex; justify-content: space-between; align-items: center;\n      padding-top: 10px; border-top: 1px solid var(--border);\n    }\n    .appl-time {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; color: var(--text-faint); font-weight: 500;\n    }\n    .appl-time svg { width: 12px; height: 12px; }\n    .appl-time.warn { color: var(--orange); }\n    .appl-time.urgent { color: var(--red); }\n    .appl-actions { display: flex; gap: 4px; }\n    .appl-action {\n      width: 24px; height: 24px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .appl-action:hover { background: var(--surface-alt); color: var(--blue); }\n    .appl-action.approve:hover { background: var(--green-bg); color: var(--green-dark); }\n    .appl-action.reject:hover { background: var(--red-bg); color: var(--red); }\n    .appl-action svg { width: 14px; height: 14px; }\n\n    /* Empty column state */\n    .column-empty {\n      text-align: center; padding: 24px 16px;\n      font-size: 12px; color: var(--text-faint);\n    }\n    .column-empty svg {\n      width: 28px; height: 28px; margin: 0 auto 8px; opacity: 0.3;\n    }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 520px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: flex; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 20px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 16px;\n    }\n    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }\n    .drawer-avatar {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue), var(--pink));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 18px; flex-shrink: 0;\n    }\n    .drawer-head-info h2 {\n      font-size: 20px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.2;\n    }\n    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    .drawer-score {\n      padding: 20px 24px; border-bottom: 1px solid var(--border);\n      display: flex; gap: 20px; align-items: center;\n    }\n    .drawer-score-big {\n      width: 72px; height: 72px; border-radius: 16px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 30px; font-weight: 800; letter-spacing: -0.02em;\n      flex-shrink: 0;\n    }\n    .drawer-score-breakdown { flex: 1; }\n    .drawer-score-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }\n    .breakdown-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;\n    }\n    .breakdown-item {\n      display: flex; justify-content: space-between; font-size: 12px;\n    }\n    .breakdown-item span:first-child { color: var(--text-muted); }\n    .breakdown-item strong { font-weight: 700; color: var(--green-dark); font-variant-numeric: tabular-nums; }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n    .drawer-tab-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n    }\n\n    .drawer-body {\n      flex: 1; overflow-y: auto; padding: 24px;\n    }\n    .drawer-section { margin-bottom: 24px; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n    }\n    .drawer-row {\n      display: grid; grid-template-columns: 120px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row span:first-child { color: var(--text-muted); }\n    .drawer-row span:last-child { color: var(--text); font-weight: 500; }\n\n    /* Doc tiles */\n    .doc-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;\n    }\n    .doc-tile {\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; display: flex; align-items: center; gap: 10px;\n      background: var(--surface);\n    }\n    .doc-tile.received { border-color: var(--green); background: var(--green-bg); }\n    .doc-tile.pending { border-color: var(--border); opacity: 0.7; }\n    .doc-tile-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      background: var(--surface); flex-shrink: 0;\n    }\n    .doc-tile.received .doc-tile-icon { background: rgba(255,255,255,0.6); color: var(--green-dark); }\n    .doc-tile.pending .doc-tile-icon { background: var(--surface-alt); color: var(--text-faint); }\n    .doc-tile-icon svg { width: 14px; height: 14px; }\n    .doc-tile-text { flex: 1; min-width: 0; }\n    .doc-tile-name { font-size: 12px; font-weight: 600; color: var(--text); }\n    .doc-tile-meta { font-size: 11px; color: var(--text-muted); }\n\n    /* Activity */\n    .activity-feed { position: relative; padding-left: 24px; }\n    .activity-feed::before {\n      content: \"\"; position: absolute; left: 10px; top: 4px; bottom: 4px;\n      width: 2px; background: var(--border);\n    }\n    .activity-node {\n      position: relative; padding: 0 0 18px 0;\n    }\n    .activity-node:last-child { padding-bottom: 0; }\n    .activity-node::before {\n      content: \"\"; position: absolute; left: -18px; top: 4px;\n      width: 10px; height: 10px; border-radius: 50%;\n      background: var(--blue-pale); border: 2px solid var(--blue);\n    }\n    .activity-node.pink::before { background: var(--pink-bg); border-color: var(--pink); }\n    .activity-node.green::before { background: var(--green-bg); border-color: var(--green); }\n    .activity-node-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .activity-node-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .activity-node-time { font-size: 11px; color: var(--text-faint); margin-top: 4px; }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 16px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: flex; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    /* hide for small screens (demo-only — real app responsive) */\n    @media (max-width: 1200px) {\n      .drawer { width: 420px; }\n    }\n  ";

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
          <a className="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Tenants
            <span className="sb-nav-count">12</span>
          </a>
          <a className="sb-nav-item" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>Leases
          </a>
          <a className="sb-nav-item active" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>Applications
            <span className="sb-nav-badge">7</span>
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
          <strong>Applications</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search applicants, properties…" />
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
          <h1>Applications</h1>
          <p>Pipeline from lead to lease — scored, flagged, and FCRA-ready.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
            Share apply link
          </button>
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Invite applicant
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New application
          </button>
        </div>
      </div>

      
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-label">Open applications</div>
          <div className="stat-value">7 <span className="stat-delta pink">+3 today</span></div>
          <div className="stat-sub">Across 4 properties</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg. score</div>
          <div className="stat-value">84</div>
          <div className="stat-sub">Last 30 days</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Time to decision</div>
          <div className="stat-value">18h</div>
          <div className="stat-sub">-42% vs. quarter</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Approved this month</div>
          <div className="stat-value">5 <span className="stat-delta up">+2</span></div>
          <div className="stat-sub">3 moved in already</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Needs your review</div>
          <div className="stat-value" style={{color: "var(--orange)"}}>2 <span className="stat-delta orange">SLA risk</span></div>
          <div className="stat-sub">Waiting &gt;24h</div>
        </div>
      </div>

      
      <div className="toolbar">
        <div className="saved-views">
          <div className="saved-view active">
            All <span className="saved-view-count">23</span>
          </div>
          <div className="saved-view">
            <span className="saved-view-dot" />
            New today <span className="saved-view-count">3</span>
          </div>
          <div className="saved-view">
            High score <span className="saved-view-count">8</span>
          </div>
          <div className="saved-view">
            Needs docs <span className="saved-view-count">4</span>
          </div>
          <div className="saved-view">
            Flagged <span className="saved-view-count">2</span>
          </div>
          <div className="saved-view">
            My waitlist <span className="saved-view-count">6</span>
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

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge gray" />
                Leads
                <span className="count">4</span>
              </div>
            </div>
            <div className="column-body">

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar purple">TR</div>
                    <div>
                      <div className="appl-name">Tara Ramirez</div>
                      <div className="appl-sub">Replied to listing · apartments.com</div>
                    </div>
                  </div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room D
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>2h in stage</div>
                  <div className="appl-actions">
                    <div className="appl-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                    <div className="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar">DJ</div>
                    <div>
                      <div className="appl-name">Derek Jackson</div>
                      <div className="appl-sub">Called · referred by Sarah Chen</div>
                    </div>
                  </div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>6h in stage</div>
                  <div className="appl-actions">
                    <div className="appl-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                    <div className="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar green">EN</div>
                    <div>
                      <div className="appl-name">Emma Novak</div>
                      <div className="appl-sub">Walk-in · open house</div>
                    </div>
                  </div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room D
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Yesterday</div>
                  <div className="appl-actions">
                    <div className="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar orange">AM</div>
                    <div>
                      <div className="appl-name">Alex Morales</div>
                      <div className="appl-sub">Inbound inquiry form</div>
                    </div>
                  </div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2907 Wilson
                </div>
                <div className="appl-foot">
                  <div className="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>3d — follow up</div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge blue" />
                Screening
                <span className="count">5</span>
              </div>
              <span className="column-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                1 overdue
              </span>
            </div>
            <div className="column-body">

              <div className="appl-card selected">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar">SC</div>
                    <div>
                      <div className="appl-name">Sarah Chen</div>
                      <div className="appl-sub">Submitted 2h ago</div>
                    </div>
                  </div>
                  <div className="score-chip strong">92<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room A
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents</span>
                    <strong>5 of 5</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill complete" style={{width: "100%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>2h in stage</div>
                  <div className="appl-actions">
                    <div className="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                    <div className="appl-action reject"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="appl-card flagged">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar pink">MJ</div>
                    <div>
                      <div className="appl-name">Marcus Johnson</div>
                      <div className="appl-sub">Submitted 5h ago</div>
                    </div>
                  </div>
                  <div className="score-chip moderate">74<small>OK</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave
                </div>
                <div className="appl-flags">
                  <span className="appl-flag duplicate">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    Duplicate
                  </span>
                  <span className="appl-flag income">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Low income
                  </span>
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents</span>
                    <strong>3 of 5</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill partial" style={{width: "60%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>5h — review</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar green">RA</div>
                    <div>
                      <div className="appl-name">Rebecca Almeida</div>
                      <div className="appl-sub">Submitted yesterday</div>
                    </div>
                  </div>
                  <div className="score-chip strong">89<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room E
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents</span>
                    <strong>4 of 5</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill" style={{width: "80%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>19h in stage</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar">NK</div>
                    <div>
                      <div className="appl-name">Nathan Kim</div>
                      <div className="appl-sub">Submitted 2 days ago</div>
                    </div>
                  </div>
                  <div className="score-chip incomplete">—<small>Scoring</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2907 Wilson
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents</span>
                    <strong>2 of 5</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill partial" style={{width: "40%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>2d — needs docs</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar orange">BA</div>
                    <div>
                      <div className="appl-name">Brianna Adams</div>
                      <div className="appl-sub">Submitted 3h ago</div>
                    </div>
                  </div>
                  <div className="score-chip strong">86<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room F
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents</span>
                    <strong>5 of 5</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill complete" style={{width: "100%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>3h in stage</div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge orange" />
                Review
                <span className="count">2</span>
              </div>
              <span className="column-alert" style={{color: "var(--red)"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                SLA risk
              </span>
            </div>
            <div className="column-body">

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar purple">JL</div>
                    <div>
                      <div className="appl-name">Jessica Liu</div>
                      <div className="appl-sub">Ready for decision</div>
                    </div>
                  </div>
                  <div className="score-chip strong">94<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room A
                </div>
                <div className="appl-flags">
                  <span className="appl-flag ai">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7v10l10 5 10-5V7z" /></svg>
                    AI: Top candidate
                  </span>
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents · References</span>
                    <strong>5 of 5 · 3 of 3</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill complete" style={{width: "100%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>22h pending</div>
                  <div className="appl-actions">
                    <div className="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                    <div className="appl-action reject"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="appl-card flagged">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar green">WP</div>
                    <div>
                      <div className="appl-name">Wes Peterson</div>
                      <div className="appl-sub">Ready for decision</div>
                    </div>
                  </div>
                  <div className="score-chip risky">62<small>Risky</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave
                </div>
                <div className="appl-flags">
                  <span className="appl-flag eviction">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                    Eviction (2022)
                  </span>
                </div>
                <div className="appl-docs">
                  <div className="appl-docs-label">
                    <span>Documents · References</span>
                    <strong>5 of 5 · 2 of 3</strong>
                  </div>
                  <div className="appl-docs-bar"><div className="appl-docs-fill" style={{width: "90%"}} /></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>2d — decide now</div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge green" />
                Approved
                <span className="count">3</span>
              </div>
            </div>
            <div className="column-body">

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar green">JB</div>
                    <div>
                      <div className="appl-name">Jordan Brooks</div>
                      <div className="appl-sub">Lease signing scheduled</div>
                    </div>
                  </div>
                  <div className="score-chip strong">91<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2909 Wilson, Room C
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>Move-in Apr 20</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar pink">CM</div>
                    <div>
                      <div className="appl-name">Carmen Miller</div>
                      <div className="appl-sub">Lease sent · awaiting signature</div>
                    </div>
                  </div>
                  <div className="score-chip strong">88<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  2907 Wilson
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>Sent 4h ago</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar">KW</div>
                    <div>
                      <div className="appl-name">Kai Wong</div>
                      <div className="appl-sub">Lease signed · onboarding</div>
                    </div>
                  </div>
                  <div className="score-chip strong">95<small>Strong</small></div>
                </div>
                <div className="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                  1523 Oak Ave
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Ready to move in</div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge pink" />
                Waitlist
                <span className="count">6</span>
              </div>
            </div>
            <div className="column-body">

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar orange">MR</div>
                    <div>
                      <div className="appl-name">Mei Richardson</div>
                      <div className="appl-sub">Waitlisted for 2909 Wilson</div>
                    </div>
                  </div>
                  <div className="score-chip strong">87<small>Strong</small></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>On waitlist 8d</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar green">TO</div>
                    <div>
                      <div className="appl-name">Tyler Owens</div>
                      <div className="appl-sub">Waitlisted for 1523 Oak Ave</div>
                    </div>
                  </div>
                  <div className="score-chip moderate">79<small>OK</small></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>On waitlist 14d</div>
                </div>
              </div>

              <div className="column-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                4 more on waitlist
              </div>

            </div>
          </div>

          
          <div className="column">
            <div className="column-head">
              <div className="column-title">
                <span className="dot-badge red" />
                Rejected
                <span className="count">3</span>
              </div>
            </div>
            <div className="column-body">

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar">PG</div>
                    <div>
                      <div className="appl-name">Parker Gates</div>
                      <div className="appl-sub">FCRA notice sent</div>
                    </div>
                  </div>
                  <div className="score-chip risky">48<small>Risky</small></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Rejected 3d ago</div>
                </div>
              </div>

              <div className="appl-card">
                <div className="appl-head">
                  <div className="appl-identity">
                    <div className="appl-avatar orange">LA</div>
                    <div>
                      <div className="appl-name">Leo Anderson</div>
                      <div className="appl-sub">Insufficient income</div>
                    </div>
                  </div>
                  <div className="score-chip risky">55<small>Risky</small></div>
                </div>
                <div className="appl-foot">
                  <div className="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Rejected 5d ago</div>
                </div>
              </div>

              <div className="column-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                1 more rejected
              </div>

            </div>
          </div>

        </div>
      </div>

      
      <div className="bulk-bar">
        <div className="bulk-count">3</div>
        <span>applicants selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Approve
          </button>
          <button className="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Message
          </button>
          <button className="bulk-btn">
            Move to Waitlist
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
              <p>Applied 2h ago · 2909 Wilson Dr NW, Room A · $850/mo</p>
            </div>
          </div>
          <button className="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="drawer-score">
          <div className="drawer-score-big">92</div>
          <div className="drawer-score-breakdown">
            <div className="drawer-score-label">Score breakdown</div>
            <div className="breakdown-grid">
              <div className="breakdown-item"><span>Income ratio</span><strong>28 / 30</strong></div>
              <div className="breakdown-item"><span>Credit</span><strong>24 / 25</strong></div>
              <div className="breakdown-item"><span>Background</span><strong>25 / 25</strong></div>
              <div className="breakdown-item"><span>References</span><strong>15 / 20</strong></div>
            </div>
          </div>
        </div>

        <div className="drawer-tabs">
          <div className="drawer-tab active">
            Overview
          </div>
          <div className="drawer-tab">
            Documents
            <span className="drawer-tab-count">5/5</span>
          </div>
          <div className="drawer-tab">
            References
            <span className="drawer-tab-count">3/3</span>
          </div>
          <div className="drawer-tab">
            Activity
          </div>
        </div>

        <div className="drawer-body">

          <div className="drawer-section">
            <div className="drawer-section-head">Applicant</div>
            <div className="drawer-row"><span>Email</span><span>sarah.chen@email.com</span></div>
            <div className="drawer-row"><span>Phone</span><span>(256) 555-0142</span></div>
            <div className="drawer-row"><span>Date of birth</span><span>Mar 14, 1995 (31 yrs)</span></div>
            <div className="drawer-row"><span>Current address</span><span>2014 Jefferson St, Huntsville, AL</span></div>
            <div className="drawer-row"><span>Move-in date</span><span>May 1, 2026</span></div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-head">Employment &amp; Income</div>
            <div className="drawer-row"><span>Employer</span><span>Redstone Federal</span></div>
            <div className="drawer-row"><span>Role</span><span>Senior Product Designer</span></div>
            <div className="drawer-row"><span>Monthly income</span><span>$6,400</span></div>
            <div className="drawer-row"><span>Income-to-rent ratio</span><span style={{color: "var(--green-dark)", fontWeight: "700"}}>7.5x · Strong</span></div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-head">Documents received</div>
            <div className="doc-grid">
              <div className="doc-tile received">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Photo ID — Front</div>
                  <div className="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div className="doc-tile received">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Photo ID — Back</div>
                  <div className="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div className="doc-tile received">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Pay Stub — Mar</div>
                  <div className="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div className="doc-tile received">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Pay Stub — Feb</div>
                  <div className="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div className="doc-tile received">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Background Check</div>
                  <div className="doc-tile-meta">Clear · $25</div>
                </div>
              </div>
              <div className="doc-tile pending">
                <div className="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <div className="doc-tile-text">
                  <div className="doc-tile-name">Pet application</div>
                  <div className="doc-tile-meta">Not required</div>
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-head">Recent activity</div>
            <div className="activity-feed">
              <div className="activity-node green">
                <div className="activity-node-title">Application submitted</div>
                <div className="activity-node-body">All required documents uploaded via branded portal</div>
                <div className="activity-node-time">2h ago</div>
              </div>
              <div className="activity-node pink">
                <div className="activity-node-title">AI scoring complete · 92 / 100</div>
                <div className="activity-node-body">Automatically scored on income, credit, background, references</div>
                <div className="activity-node-time">2h ago</div>
              </div>
              <div className="activity-node">
                <div className="activity-node-title">Background check passed</div>
                <div className="activity-node-body">Clear · processed via TransUnion SmartMove · $25</div>
                <div className="activity-node-time">1h ago</div>
              </div>
              <div className="activity-node">
                <div className="activity-node-title">Employment reference confirmed</div>
                <div className="activity-node-body">Jennifer Martinez (Redstone Federal) — responded: "excellent, would rehire"</div>
                <div className="activity-node-time">45m ago</div>
              </div>
            </div>
          </div>

        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Message
          </button>
          <button className="btn btn-dark">
            Waitlist
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Approve
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
