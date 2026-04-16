"use client";

// Mock ported from ~/Desktop/blackbear/properties.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (shared with admin) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 320px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* Scrollable page area */\n    .page-scroll { flex: 1; overflow-y: auto; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item { border-right: 1px solid var(--border); padding-right: 24px; }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n      font-variant-numeric: tabular-nums;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-delta.gray { color: var(--text-muted); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== View toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Property grid ===== */\n    .properties-grid-wrap { padding: 16px 28px 28px; }\n    .properties-grid {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 20px;\n    }\n    @media (max-width: 1100px) { .properties-grid { grid-template-columns: 1fr; } }\n\n    .prop-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease; cursor: pointer;\n      display: flex; flex-direction: column;\n      position: relative;\n    }\n    .prop-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-2px); }\n    .prop-card.selected-bulk { outline: 2px solid var(--pink); outline-offset: -2px; }\n\n    .prop-photo {\n      aspect-ratio: 16/9; width: 100%;\n      position: relative; overflow: hidden;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .prop-photo.grad-pink { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--pink) 100%); }\n    .prop-photo.grad-blue { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--blue-bright) 100%); }\n    .prop-photo.grad-green { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--green) 100%); }\n    .prop-photo.grad-gold { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--gold) 100%); }\n    .prop-photo::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.18), transparent 60%);\n      pointer-events: none;\n    }\n    .prop-photo-icon {\n      width: 56px; height: 56px; border-radius: 16px;\n      background: rgba(255,255,255,0.16); backdrop-filter: blur(12px);\n      border: 1px solid rgba(255,255,255,0.28);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; z-index: 2;\n    }\n    .prop-photo-icon svg { width: 28px; height: 28px; }\n    .prop-photo-tag {\n      position: absolute; top: 12px; left: 12px;\n      padding: 5px 10px; border-radius: 100px;\n      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);\n      color: #fff; font-size: 11px; font-weight: 700;\n      display: inline-flex; align-items: center; gap: 5px;\n      border: 1px solid rgba(255,255,255,0.18); z-index: 2;\n    }\n    .prop-photo-tag svg { width: 11px; height: 11px; }\n    .prop-photo-tag.vacant { background: rgba(255,73,152,0.85); }\n    .prop-photo-badge {\n      position: absolute; top: 12px; right: 12px;\n      padding: 5px 10px; border-radius: 100px;\n      background: rgba(255,255,255,0.92); color: var(--navy-dark);\n      font-size: 11px; font-weight: 700; z-index: 2;\n    }\n\n    .prop-body { padding: 16px 18px 14px; flex: 1; display: flex; flex-direction: column; gap: 12px; }\n\n    .prop-head-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }\n    .prop-name { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; line-height: 1.25; }\n    .prop-address { font-size: 12px; color: var(--text-muted); margin-top: 2px; display: inline-flex; align-items: center; gap: 5px; }\n    .prop-address svg { width: 12px; height: 12px; }\n\n    .prop-type-pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 9px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n      white-space: nowrap;\n    }\n    .prop-type-pill svg { width: 11px; height: 11px; }\n    .prop-type-pill.coliving { background: var(--pink-bg); color: var(--pink); }\n    .prop-type-pill.single { background: var(--blue-pale); color: var(--blue); }\n    .prop-type-pill.multi { background: var(--purple-bg); color: var(--purple); }\n\n    .prop-stats-row {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 12px; padding: 12px; background: var(--surface-alt);\n      border-radius: 10px;\n    }\n    .prop-stat-cell { display: flex; flex-direction: column; gap: 2px; }\n    .prop-stat-cell-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }\n    .prop-stat-cell-value { font-size: 15px; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }\n    .prop-stat-cell-sub { font-size: 10px; color: var(--text-muted); }\n    .prop-stat-cell-value.up { color: var(--green-dark); }\n    .prop-stat-cell-value.warn { color: var(--orange); }\n\n    .prop-occupancy {\n      display: flex; flex-direction: column; gap: 6px;\n    }\n    .prop-occupancy-label {\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 11px; color: var(--text-muted);\n    }\n    .prop-occupancy-label strong { color: var(--text); font-weight: 700; }\n    .prop-units-row { display: flex; gap: 4px; }\n    .prop-unit-cell {\n      flex: 1; height: 10px; border-radius: 4px;\n      background: var(--surface-alt); border: 1px solid var(--border);\n    }\n    .prop-unit-cell.filled { background: var(--green); border-color: var(--green-dark); }\n    .prop-unit-cell.vacant { background: var(--pink-bg); border-color: var(--pink); }\n    .prop-unit-cell.listed { background: var(--gold); border-color: var(--gold); opacity: 0.7; }\n\n    .prop-foot {\n      display: flex; justify-content: space-between; align-items: center;\n      padding-top: 10px; border-top: 1px solid var(--border);\n    }\n    .prop-foot-left { font-size: 11px; color: var(--text-faint); }\n    .prop-foot-right { display: flex; gap: 6px; align-items: center; }\n    .prop-view-btn {\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700;\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .prop-view-btn:hover { background: var(--blue); color: #fff; }\n    .prop-view-btn svg { width: 12px; height: 12px; }\n    .prop-menu-btn {\n      width: 28px; height: 28px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .prop-menu-btn:hover { background: var(--border); color: var(--text); }\n    .prop-menu-btn svg { width: 16px; height: 16px; }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 600px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: flex; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-hero {\n      position: relative; height: 300px;\n      display: flex; align-items: flex-end;\n      padding: 20px 24px;\n    }\n    .drawer-hero.grad-pink { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--pink) 100%); }\n    .drawer-hero.grad-blue { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--blue-bright) 100%); }\n    .drawer-hero.grad-green { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--green) 100%); }\n    .drawer-hero.grad-gold { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--gold) 100%); }\n    .drawer-hero::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: linear-gradient(180deg, rgba(20,32,74,0.1) 0%, rgba(20,32,74,0.65) 100%);\n      pointer-events: none;\n    }\n    .drawer-hero-top {\n      position: absolute; top: 16px; left: 20px; right: 20px;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      z-index: 2;\n    }\n    .drawer-hero-badges { display: flex; gap: 6px; flex-wrap: wrap; }\n    .drawer-hero-badge {\n      padding: 5px 10px; border-radius: 100px;\n      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);\n      color: #fff; font-size: 11px; font-weight: 700;\n      border: 1px solid rgba(255,255,255,0.18);\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .drawer-hero-badge svg { width: 11px; height: 11px; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);\n      color: #fff; border: 1px solid rgba(255,255,255,0.18);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .drawer-close:hover { background: rgba(20,32,74,0.8); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    .drawer-hero-title {\n      position: relative; z-index: 2; color: #fff;\n    }\n    .drawer-hero-title h2 {\n      font-size: 22px; font-weight: 800;\n      letter-spacing: -0.02em; line-height: 1.15;\n      text-shadow: 0 1px 8px rgba(0,0,0,0.22);\n    }\n    .drawer-hero-title p {\n      font-size: 13px; margin-top: 4px;\n      color: rgba(255,255,255,0.92);\n      display: inline-flex; align-items: center; gap: 5px;\n      text-shadow: 0 1px 4px rgba(0,0,0,0.2);\n    }\n    .drawer-hero-title svg { width: 12px; height: 12px; }\n\n    .drawer-stats {\n      padding: 18px 24px; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 14px;\n    }\n    .drawer-stat {\n      display: flex; flex-direction: column; gap: 3px;\n      padding-right: 12px; border-right: 1px solid var(--border);\n    }\n    .drawer-stat:last-child { border-right: none; padding-right: 0; }\n    .drawer-stat-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .drawer-stat-value {\n      font-size: 15px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.01em; font-variant-numeric: tabular-nums;\n    }\n    .drawer-stat-value.up { color: var(--green-dark); }\n    .drawer-stat-value.pink { color: var(--pink); }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n      overflow-x: auto;\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n      white-space: nowrap;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n    .drawer-tab-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n    }\n    .drawer-tab.active .drawer-tab-count { background: var(--blue-pale); color: var(--blue); }\n\n    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }\n    .drawer-section { margin-bottom: 24px; }\n    .drawer-section:last-child { margin-bottom: 0; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .drawer-section-head a {\n      font-size: 11px; color: var(--blue); font-weight: 700;\n      letter-spacing: 0; text-transform: none;\n    }\n    .drawer-row {\n      display: grid; grid-template-columns: 140px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row span:first-child { color: var(--text-muted); }\n    .drawer-row span:last-child { color: var(--text); font-weight: 500; }\n    .drawer-row .pill {\n      display: inline-flex; padding: 2px 8px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; gap: 4px; align-items: center;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-gold { background: rgba(245,166,35,0.14); color: var(--gold); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n\n    /* Room/Unit list */\n    .room-list { display: flex; flex-direction: column; gap: 8px; }\n    .room-item {\n      display: grid;\n      grid-template-columns: 42px 1fr auto auto;\n      gap: 12px; align-items: center;\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; background: var(--surface);\n      transition: all 0.15s ease;\n    }\n    .room-item:hover { border-color: var(--blue); background: var(--surface-subtle); }\n    .room-item.vacant { border-style: dashed; background: var(--pink-bg); border-color: var(--pink); }\n    .room-item.listed { background: rgba(245,166,35,0.08); border-color: var(--gold); }\n    .room-letter {\n      width: 42px; height: 42px; border-radius: 10px;\n      background: var(--navy); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 16px; letter-spacing: -0.02em;\n    }\n    .room-item.vacant .room-letter { background: var(--pink); }\n    .room-item.listed .room-letter { background: var(--gold); color: #fff; }\n    .room-info { min-width: 0; }\n    .room-title { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }\n    .room-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .room-price {\n      font-size: 13px; font-weight: 800; color: var(--text);\n      font-variant-numeric: tabular-nums; text-align: right;\n    }\n    .room-price-sub { font-size: 10px; color: var(--text-faint); font-weight: 500; }\n    .room-action { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); background: var(--surface-alt); }\n    .room-action:hover { background: var(--blue-pale); color: var(--blue); }\n    .room-action svg { width: 14px; height: 14px; }\n\n    /* Tenants tab */\n    .tenant-list { display: flex; flex-direction: column; gap: 8px; }\n    .tenant-item {\n      display: grid; grid-template-columns: 40px 1fr auto; gap: 12px;\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; align-items: center;\n      background: var(--surface); transition: all 0.15s ease;\n    }\n    .tenant-item:hover { border-color: var(--blue); }\n    .tenant-avatar {\n      width: 40px; height: 40px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 13px;\n    }\n    .tenant-avatar.blue { background: var(--blue-pale); color: var(--blue); }\n    .tenant-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .tenant-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .tenant-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .tenant-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .tenant-info .name { font-size: 13px; font-weight: 700; color: var(--text); }\n    .tenant-info .sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .tenant-lease {\n      text-align: right; font-size: 11px; color: var(--text-muted);\n    }\n    .tenant-lease strong { display: block; font-size: 12px; color: var(--text); font-weight: 700; }\n\n    /* Financials tab chart */\n    .fin-chart {\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      border-radius: 10px; padding: 16px;\n      margin-bottom: 16px;\n    }\n    .fin-chart-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      margin-bottom: 14px;\n    }\n    .fin-chart-title { font-size: 12px; font-weight: 700; color: var(--text); }\n    .fin-legend { display: flex; gap: 12px; font-size: 11px; color: var(--text-muted); }\n    .fin-legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }\n    .fin-bars {\n      display: grid; grid-template-columns: repeat(6, 1fr);\n      gap: 10px; align-items: end; height: 140px;\n    }\n    .fin-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }\n    .fin-bar-col-bars { display: flex; gap: 3px; align-items: end; flex: 1; width: 100%; justify-content: center; }\n    .fin-bar {\n      width: 12px; border-radius: 4px 4px 0 0;\n    }\n    .fin-bar.income { background: var(--blue); }\n    .fin-bar.expense { background: var(--pink); }\n    .fin-bar-label { font-size: 10px; color: var(--text-muted); font-weight: 600; }\n\n    .fin-summary {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;\n    }\n    .fin-summary-cell {\n      padding: 12px; background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: 10px;\n    }\n    .fin-summary-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }\n    .fin-summary-value { font-size: 18px; font-weight: 800; color: var(--text); margin-top: 4px; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }\n    .fin-summary-sub { font-size: 11px; color: var(--green-dark); font-weight: 700; margin-top: 2px; }\n    .fin-summary-sub.neg { color: var(--red); }\n\n    /* Photos tab */\n    .photos-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;\n    }\n    .photo-tile {\n      aspect-ratio: 4/3; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n      position: relative; overflow: hidden;\n    }\n    .photo-tile::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: linear-gradient(160deg, rgba(255,255,255,0.18), transparent 60%);\n    }\n    .photo-tile span { position: relative; z-index: 2; background: rgba(20,32,74,0.55); backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 100px; font-size: 11px; }\n\n    /* Documents tab */\n    .doc-list { display: flex; flex-direction: column; gap: 8px; }\n    .doc-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px; border: 1px solid var(--border);\n      border-radius: 10px; background: var(--surface);\n      transition: all 0.15s ease;\n    }\n    .doc-item:hover { border-color: var(--blue); background: var(--surface-subtle); }\n    .doc-icon {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .doc-icon svg { width: 16px; height: 16px; }\n    .doc-info { flex: 1; min-width: 0; }\n    .doc-name { font-size: 13px; font-weight: 600; color: var(--text); }\n    .doc-meta { font-size: 11px; color: var(--text-muted); }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 16px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: flex; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    @media (max-width: 1200px) {\n      .drawer { width: 520px; }\n      .drawer-stats { grid-template-columns: repeat(3, 1fr); }\n      .drawer-stats .drawer-stat:nth-child(3) { border-right: none; }\n    }\n  ";

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
          <a className="sb-nav-item active" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
            Properties
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
            <span className="sb-nav-count">7</span>
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
          <strong>Properties</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search properties, addresses, units..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      <div className="page-scroll">

        
        <div className="page-head-bar">
          <div>
            <h1>Properties</h1>
            <p>Your portfolio at a glance — units, occupancy, financials, rooms</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" data-action="import">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Import
            </button>
            <button className="btn btn-primary" data-action="add-property">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Add property
            </button>
          </div>
        </div>

        
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-label">Total properties</div>
            <div className="stat-value">4</div>
            <div className="stat-sub"><span className="stat-delta gray">Across Huntsville, AL</span></div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total units / rooms</div>
            <div className="stat-value">23</div>
            <div className="stat-sub">11 units · 12 rooms</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Occupancy</div>
            <div className="stat-value">96% <span className="stat-delta up">+2% MoM</span></div>
            <div className="stat-sub">1 vacancy accepting apps</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Monthly income</div>
            <div className="stat-value">$24,850 <span className="stat-delta up">+6.1%</span></div>
            <div className="stat-sub">Gross collected</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg rent</div>
            <div className="stat-value" style={{fontSize: "18px"}}>$1,080 <span style={{fontSize: "11px", color: "var(--text-muted)", fontWeight: "600"}}>/unit</span></div>
            <div className="stat-sub">$810/room · blended</div>
          </div>
        </div>

        
        <div className="toolbar">
          <div className="saved-views">
            <div className="saved-view active" data-filter="all">
              All <span className="saved-view-count">4</span>
            </div>
            <div className="saved-view" data-filter="coliving">
              Co-Living <span className="saved-view-count">2</span>
            </div>
            <div className="saved-view" data-filter="single">
              Single-family <span className="saved-view-count">1</span>
            </div>
            <div className="saved-view" data-filter="multi">
              Multifamily <span className="saved-view-count">1</span>
            </div>
            <div className="saved-view" data-filter="vacant">
              <span className="saved-view-dot" />
              Vacant <span className="saved-view-count">1</span>
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
              <button className="active" data-view="grid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                Grid
              </button>
              <button data-view="map">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z" /><path d="M8 2v16M16 6v16" /></svg>
                Map
              </button>
            </div>
          </div>
        </div>

        
        <div className="properties-grid-wrap">
          <div className="properties-grid">

            
            <div className="prop-card" data-property="wilson-2909" data-type="coliving vacant">
              <div className="prop-photo grad-pink">
                <div className="prop-photo-tag vacant">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                  Room D — in apps pipeline
                </div>
                <div className="prop-photo-badge">5 rooms</div>
                <div className="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21v-6h6v6" /></svg>
                </div>
              </div>
              <div className="prop-body">
                <div className="prop-head-row">
                  <div>
                    <div className="prop-name">2909 Wilson Dr NW</div>
                    <div className="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Huntsville, AL 35805
                    </div>
                  </div>
                  <div className="prop-type-pill coliving">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                    Co-Living
                  </div>
                </div>
                <div className="prop-stats-row">
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Rooms</span>
                    <span className="prop-stat-cell-value">5</span>
                    <span className="prop-stat-cell-sub">4 occupied</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Occupancy</span>
                    <span className="prop-stat-cell-value warn">80%</span>
                    <span className="prop-stat-cell-sub">1 vacancy</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Monthly</span>
                    <span className="prop-stat-cell-value up">$4,500</span>
                    <span className="prop-stat-cell-sub">gross</span>
                  </div>
                </div>
                <div className="prop-occupancy">
                  <div className="prop-occupancy-label">
                    <span>Room fill</span>
                    <span><strong>4</strong> / 5</span>
                  </div>
                  <div className="prop-units-row">
                    <div className="prop-unit-cell filled" title="Room A — Sarah Chen" />
                    <div className="prop-unit-cell filled" title="Room B — Marcus Lee" />
                    <div className="prop-unit-cell filled" title="Room C — Jordan Brooks" />
                    <div className="prop-unit-cell vacant" title="Room D — Vacant" />
                    <div className="prop-unit-cell filled" title="Room E — Rebecca Almeida" />
                  </div>
                </div>
                <div className="prop-foot">
                  <div className="prop-foot-left">Acquired Jun 2023 · 2,850 sqft</div>
                  <div className="prop-foot-right">
                    <button className="prop-menu-btn" data-menu="">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    </button>
                    <button className="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="prop-card" data-property="wilson-2907" data-type="single">
              <div className="prop-photo grad-blue">
                <div className="prop-photo-badge">1 unit</div>
                <div className="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21v-6h6v6" /></svg>
                </div>
              </div>
              <div className="prop-body">
                <div className="prop-head-row">
                  <div>
                    <div className="prop-name">2907 Wilson Dr NW</div>
                    <div className="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Huntsville, AL 35805
                    </div>
                  </div>
                  <div className="prop-type-pill single">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                    Single-Family
                  </div>
                </div>
                <div className="prop-stats-row">
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Units</span>
                    <span className="prop-stat-cell-value">1</span>
                    <span className="prop-stat-cell-sub">Marcus Lee</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Occupancy</span>
                    <span className="prop-stat-cell-value up">100%</span>
                    <span className="prop-stat-cell-sub">Lease active</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Monthly</span>
                    <span className="prop-stat-cell-value up">$1,450</span>
                    <span className="prop-stat-cell-sub">+pet $35</span>
                  </div>
                </div>
                <div className="prop-occupancy">
                  <div className="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 1</span>
                  </div>
                  <div className="prop-units-row">
                    <div className="prop-unit-cell filled" title="Unit — Marcus Lee" />
                  </div>
                </div>
                <div className="prop-foot">
                  <div className="prop-foot-left">Acquired Mar 2022 · 1,480 sqft</div>
                  <div className="prop-foot-right">
                    <button className="prop-menu-btn" data-menu="">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    </button>
                    <button className="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="prop-card" data-property="oak-1523" data-type="coliving single">
              <div className="prop-photo grad-green">
                <div className="prop-photo-badge">1 unit</div>
                <div className="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21v-6h6v6" /></svg>
                </div>
              </div>
              <div className="prop-body">
                <div className="prop-head-row">
                  <div>
                    <div className="prop-name">1523 Oak Ave</div>
                    <div className="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Huntsville, AL 35801
                    </div>
                  </div>
                  <div className="prop-type-pill coliving">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                    Co-Living
                  </div>
                </div>
                <div className="prop-stats-row">
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Units</span>
                    <span className="prop-stat-cell-value">1</span>
                    <span className="prop-stat-cell-sub">Kai Wong</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Occupancy</span>
                    <span className="prop-stat-cell-value up">100%</span>
                    <span className="prop-stat-cell-sub">Lease active</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Monthly</span>
                    <span className="prop-stat-cell-value up">$1,350</span>
                    <span className="prop-stat-cell-sub">utilities incl.</span>
                  </div>
                </div>
                <div className="prop-occupancy">
                  <div className="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 1</span>
                  </div>
                  <div className="prop-units-row">
                    <div className="prop-unit-cell filled" title="Unit — Kai Wong" />
                  </div>
                </div>
                <div className="prop-foot">
                  <div className="prop-foot-left">Acquired Oct 2021 · 1,320 sqft</div>
                  <div className="prop-foot-right">
                    <button className="prop-menu-btn" data-menu="">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    </button>
                    <button className="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="prop-card" data-property="pine-412" data-type="multi vacant">
              <div className="prop-photo grad-gold">
                <div className="prop-photo-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Unit 2 — listed for rent
                </div>
                <div className="prop-photo-badge">Duplex · 2 units</div>
                <div className="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l5-4 5 4v12" /><path d="M13 9l5-4 5 4v12H13" /><path d="M8 21v-6M18 21v-6" /></svg>
                </div>
              </div>
              <div className="prop-body">
                <div className="prop-head-row">
                  <div>
                    <div className="prop-name">412 Pine St</div>
                    <div className="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Huntsville, AL 35801
                    </div>
                  </div>
                  <div className="prop-type-pill multi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l5-4 5 4v12" /><path d="M13 9l5-4 5 4v12H13" /></svg>
                    Multifamily
                  </div>
                </div>
                <div className="prop-stats-row">
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Units</span>
                    <span className="prop-stat-cell-value">2</span>
                    <span className="prop-stat-cell-sub">1 occupied</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Occupancy</span>
                    <span className="prop-stat-cell-value warn">50%</span>
                    <span className="prop-stat-cell-sub">1 listed</span>
                  </div>
                  <div className="prop-stat-cell">
                    <span className="prop-stat-cell-label">Monthly</span>
                    <span className="prop-stat-cell-value up">$2,200</span>
                    <span className="prop-stat-cell-sub">both at full</span>
                  </div>
                </div>
                <div className="prop-occupancy">
                  <div className="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 2</span>
                  </div>
                  <div className="prop-units-row">
                    <div className="prop-unit-cell filled" title="Unit A — Dana Okafor" />
                    <div className="prop-unit-cell listed" title="Unit B — Listed $1,100" />
                  </div>
                </div>
                <div className="prop-foot">
                  <div className="prop-foot-left">Acquired Feb 2024 · 2,100 sqft</div>
                  <div className="prop-foot-right">
                    <button className="prop-menu-btn" data-menu="">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    </button>
                    <button className="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      
      <div className="bulk-bar">
        <div className="bulk-count">2</div>
        <span>properties selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary" data-bulk="settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>
            Update settings
          </button>
          <button className="bulk-btn" data-bulk="export">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export portfolio
          </button>
          <button className="bulk-btn" data-bulk="reports">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
            Generate reports
          </button>
        </div>
      </div>

      
      <div className="drawer-backdrop" />
      <div className="drawer">
        <div className="drawer-hero">
          <div className="drawer-hero-top">
            <div className="drawer-hero-badges" />
            <button className="drawer-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="drawer-hero-title">
            <h2 />
            <p />
          </div>
        </div>
        <div className="drawer-stats" />
        <div className="drawer-tabs" />
        <div className="drawer-body" />
        <div className="drawer-foot">
          <button className="btn btn-ghost" data-drawer-action="edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
            Edit property
          </button>
          <button className="btn btn-dark" data-drawer-action="add-room">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add room/unit
          </button>
          <button className="btn btn-primary" data-drawer-action="listing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M21 14v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /></svg>
            View on listing site
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
