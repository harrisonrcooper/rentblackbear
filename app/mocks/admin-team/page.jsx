"use client";

// Mock ported from ~/Desktop/tenantory/admin-team.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;\n      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;\n      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12); --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;\n      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;\n      --border: #ecdbb5; --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000; --navy-dark: #000000; --navy-darker: #000000;\n      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15); --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;\n      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;\n      --border: #2a2a3a; --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;\n      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;\n      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1); --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;\n      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;\n      --border: #e3e3e6; --border-strong: #c0c0c8;\n    }\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-danger { background: var(--surface); border: 1px solid var(--red); color: var(--red); }\n    .btn-danger:hover { background: var(--red); color: #fff; }\n    .btn-danger-solid { background: var(--red); color: #fff; }\n    .btn-danger-solid:hover { background: #b93a3a; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Settings layout ===== */\n    .settings-wrap {\n      flex: 1; overflow: auto;\n      padding: 20px 28px 28px;\n      display: flex; flex-direction: column; gap: 18px;\n    }\n    .settings-grid {\n      display: grid; grid-template-columns: 200px 1fr;\n      gap: 24px; align-items: flex-start;\n      flex: 1; min-height: 0;\n    }\n    .sub-nav {\n      position: sticky; top: 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 8px;\n      display: flex; flex-direction: column; gap: 2px;\n    }\n    .sub-nav-item {\n      display: flex; align-items: center; gap: 10px;\n      padding: 9px 12px; border-radius: 8px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease; position: relative;\n      text-align: left; width: 100%;\n    }\n    .sub-nav-item:hover { background: var(--surface-alt); color: var(--text); }\n    .sub-nav-item.active { background: var(--pink-bg); color: var(--text); }\n    .sub-nav-item.active::before {\n      content: \"\"; position: absolute; left: 0; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sub-nav-item svg { width: 15px; height: 15px; opacity: 0.7; }\n    .sub-nav-item.active svg { color: var(--pink); opacity: 1; }\n\n    .panel-col { min-width: 0; display: flex; flex-direction: column; gap: 18px; }\n\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px;\n    }\n    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 18px; }\n    .eyebrow {\n      font-size: 11px; font-weight: 700; color: var(--pink);\n      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;\n    }\n    .card-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; }\n    .card-head p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }\n\n    /* Plan callout */\n    .plan-callout {\n      display: flex; align-items: center; justify-content: space-between; gap: 20px;\n      padding: 16px 20px; border-radius: var(--radius-lg);\n      background: linear-gradient(120deg, rgba(255,73,152,0.08), rgba(18,81,173,0.06));\n      border: 1px solid var(--border);\n    }\n    .plan-callout-left { display: flex; align-items: center; gap: 14px; }\n    .plan-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--pink), var(--blue-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      box-shadow: 0 4px 12px rgba(255,73,152,0.25);\n    }\n    .plan-icon svg { width: 20px; height: 20px; }\n    .plan-text { font-size: 13px; color: var(--text); line-height: 1.45; }\n    .plan-text strong { font-weight: 700; }\n    .plan-meter {\n      display: flex; flex-direction: column; gap: 6px; min-width: 220px;\n    }\n    .plan-meter-bar {\n      height: 6px; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; overflow: hidden;\n    }\n    .plan-meter-fill { height: 100%; width: 60%; background: linear-gradient(90deg, var(--blue-bright), var(--pink)); border-radius: 100px; }\n    .plan-meter-label { font-size: 11px; font-weight: 600; color: var(--text-muted); display: flex; justify-content: space-between; }\n\n    /* Invite card */\n    .invite-grid {\n      display: grid; grid-template-columns: 2fr 180px;\n      gap: 14px; align-items: flex-start;\n    }\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }\n    .field-hint { font-size: 11px; color: var(--text-faint); }\n    .field-input, .field-select, .field-textarea {\n      padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;\n      background: var(--surface); font-size: 13px; color: var(--text);\n      transition: all 0.15s ease; outline: none; width: 100%;\n    }\n    .field-textarea { resize: vertical; min-height: 68px; }\n    .field-input:focus, .field-select:focus, .field-textarea:focus {\n      border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12);\n    }\n    .invite-footer {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-top: 14px; gap: 12px;\n    }\n    .invite-footer-hint { font-size: 12px; color: var(--text-faint); }\n\n    /* Members table */\n    .members-table {\n      width: 100%; border-collapse: collapse;\n    }\n    .members-table th {\n      text-align: left; padding: 11px 14px;\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .members-table th:first-child { border-top-left-radius: 10px; }\n    .members-table th:last-child { border-top-right-radius: 10px; text-align: right; }\n    .members-table td {\n      padding: 14px; border-bottom: 1px solid var(--border);\n      font-size: 13px; vertical-align: middle;\n    }\n    .members-table tbody tr { transition: background 0.15s ease, opacity 0.3s ease; }\n    .members-table tbody tr:hover { background: var(--surface-subtle); }\n    .members-table tbody tr:last-child td { border-bottom: none; }\n    .members-table tbody tr.fading { opacity: 0; }\n    .members-table tbody tr.placeholder { background: repeating-linear-gradient(135deg, var(--surface-subtle), var(--surface-subtle) 8px, var(--surface-alt) 8px, var(--surface-alt) 16px); }\n    .members-table-wrap {\n      border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;\n    }\n\n    .member-cell { display: flex; align-items: center; gap: 12px; }\n    .member-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px; flex-shrink: 0;\n      background: linear-gradient(135deg, var(--blue-bright), var(--navy));\n    }\n    .member-avatar.pink { background: linear-gradient(135deg, var(--pink), var(--gold)); }\n    .member-avatar.green { background: linear-gradient(135deg, var(--green), #2bc39a); }\n    .member-avatar.purple { background: linear-gradient(135deg, var(--purple), var(--pink)); }\n    .member-avatar.pending {\n      background: var(--surface-alt); color: var(--text-faint);\n      border: 1.5px dashed var(--border-strong);\n    }\n    .member-avatar.placeholder-av {\n      background: var(--surface); color: var(--text-faint);\n      border: 1.5px dashed var(--border-strong);\n    }\n    .member-name { font-weight: 600; color: var(--text); }\n    .member-email { font-size: 12px; color: var(--text-muted); margin-top: 1px; }\n    .member-self { font-size: 10px; font-weight: 700; color: var(--pink); background: var(--pink-bg); padding: 2px 7px; border-radius: 100px; margin-left: 6px; letter-spacing: 0.04em; }\n\n    .role-pill {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 5px 11px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.04em;\n      cursor: pointer; transition: all 0.15s ease;\n      border: 1px solid transparent; position: relative;\n    }\n    .role-pill svg.chev { width: 11px; height: 11px; opacity: 0.6; }\n    .role-pill:hover { transform: translateY(-1px); }\n    .role-owner { background: var(--navy); color: #fff; cursor: default; }\n    .role-owner:hover { transform: none; }\n    .role-admin { background: var(--pink-bg); color: var(--pink); }\n    .role-manager { background: var(--blue-pale); color: var(--blue); }\n    .role-viewer { background: var(--surface-alt); color: var(--text-muted); border-color: var(--border); }\n\n    .role-menu {\n      position: absolute; top: calc(100% + 6px); left: 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 10px; box-shadow: var(--shadow-lg);\n      padding: 5px; min-width: 200px; z-index: 20;\n      display: none; flex-direction: column; gap: 1px;\n    }\n    .role-menu.open { display: flex; }\n    .role-menu button {\n      display: flex; align-items: center; gap: 10px;\n      padding: 9px 10px; border-radius: 7px;\n      font-size: 12px; font-weight: 600; color: var(--text);\n      text-align: left; width: 100%;\n    }\n    .role-menu button:hover { background: var(--surface-alt); }\n    .role-menu button .rm-title { font-weight: 700; }\n    .role-menu button .rm-sub { font-size: 11px; color: var(--text-faint); font-weight: 500; margin-top: 1px; }\n    .role-menu button .rm-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }\n    .role-menu button .rm-text { flex: 1; display: flex; flex-direction: column; }\n\n    .cell-muted { color: var(--text-muted); font-size: 12px; }\n    .cell-strong { color: var(--text); font-weight: 500; }\n    .active-dot {\n      display: inline-flex; align-items: center; gap: 6px;\n      color: var(--green-dark); font-weight: 600; font-size: 12px;\n    }\n    .active-dot::before {\n      content: \"\"; width: 7px; height: 7px; border-radius: 50%;\n      background: var(--green); box-shadow: 0 0 0 3px var(--green-bg);\n    }\n\n    .row-actions { display: flex; justify-content: flex-end; gap: 6px; }\n    .icon-btn {\n      width: 30px; height: 30px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: inline-flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; border: 1px solid transparent;\n    }\n    .icon-btn:hover { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-pale); }\n    .icon-btn.danger:hover { background: var(--red-bg); color: var(--red); border-color: var(--red-bg); }\n    .icon-btn svg { width: 14px; height: 14px; }\n    .icon-btn.disabled { opacity: 0.35; pointer-events: none; }\n\n    .pending-mini-btns { display: flex; gap: 6px; }\n    .mini-btn {\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 600;\n      background: var(--surface); border: 1px solid var(--border); color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .mini-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .mini-btn.danger:hover { border-color: var(--red); color: var(--red); }\n\n    .placeholder-cta {\n      display: inline-flex; align-items: center; gap: 8px;\n      font-size: 12px; font-weight: 600; color: var(--text-faint);\n      padding: 6px 12px; border-radius: 100px;\n      border: 1px dashed var(--border-strong); background: transparent;\n      transition: all 0.15s ease;\n    }\n    .placeholder-cta:hover { color: var(--blue); border-color: var(--blue); background: var(--blue-pale); }\n    .placeholder-cta svg { width: 12px; height: 12px; }\n\n    /* Roles explainer */\n    .roles-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n    }\n    @media (max-width: 1100px) { .roles-grid { grid-template-columns: 1fr; } }\n    .role-card {\n      padding: 18px; border: 1px solid var(--border); border-radius: var(--radius-lg);\n      background: var(--surface-subtle); display: flex; flex-direction: column; gap: 10px;\n    }\n    .role-card-head {\n      display: flex; align-items: center; gap: 10px;\n    }\n    .role-card-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; flex-shrink: 0;\n    }\n    .role-card-icon svg { width: 16px; height: 16px; }\n    .role-card-icon.admin { background: var(--pink); }\n    .role-card-icon.manager { background: var(--blue); }\n    .role-card-icon.viewer { background: var(--text-muted); }\n    .role-card h4 { font-size: 14px; font-weight: 800; letter-spacing: -0.01em; }\n    .role-card-sub { font-size: 11px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }\n    .role-perms { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }\n    .role-perm {\n      display: flex; align-items: flex-start; gap: 8px;\n      font-size: 12px; color: var(--text-muted); line-height: 1.4;\n    }\n    .role-perm svg { width: 13px; height: 13px; flex-shrink: 0; margin-top: 2px; }\n    .role-perm.yes svg { color: var(--green); }\n    .role-perm.no svg { color: var(--red); opacity: 0.7; }\n\n    /* Activity log */\n    .activity-head {\n      display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 14px;\n    }\n    .filter-chip-row { display: flex; gap: 6px; flex-wrap: wrap; }\n    .filter-chip {\n      padding: 5px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      background: var(--surface-alt); border: 1px solid var(--border);\n      transition: all 0.15s ease;\n    }\n    .filter-chip:hover { color: var(--text); border-color: var(--border-strong); }\n    .filter-chip.active { background: var(--navy); color: #fff; border-color: var(--navy); }\n\n    .activity-list { display: flex; flex-direction: column; }\n    .activity-row {\n      display: flex; align-items: flex-start; gap: 12px;\n      padding: 12px 4px; border-bottom: 1px dashed var(--border);\n      transition: opacity 0.2s ease;\n    }\n    .activity-row:last-child { border-bottom: none; }\n    .activity-row.hidden { display: none; }\n    .activity-avatar {\n      width: 28px; height: 28px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 10px; flex-shrink: 0;\n    }\n    .activity-avatar.a-hc { background: linear-gradient(135deg, var(--pink), var(--gold)); }\n    .activity-avatar.a-mc { background: linear-gradient(135deg, var(--blue-bright), var(--navy)); }\n    .activity-avatar.a-jr { background: linear-gradient(135deg, var(--green), #2bc39a); }\n    .activity-avatar.a-sys { background: var(--surface-alt); color: var(--text-faint); border: 1.5px dashed var(--border-strong); }\n    .activity-main { flex: 1; font-size: 13px; }\n    .activity-actor { font-weight: 700; color: var(--text); }\n    .activity-verb { color: var(--text-muted); }\n    .activity-target { font-weight: 600; color: var(--text); }\n    .activity-time { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* Security card */\n    .sec-row {\n      display: flex; align-items: center; justify-content: space-between; gap: 16px;\n      padding: 14px 0; border-bottom: 1px solid var(--border);\n    }\n    .sec-row:last-of-type { border-bottom: none; padding-bottom: 0; }\n    .sec-row-info { flex: 1; min-width: 0; }\n    .sec-row-title { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }\n    .sec-row-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.45; }\n    .upsell-pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 2px 8px; border-radius: 100px;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      background: var(--purple-bg); color: var(--purple);\n    }\n\n    .switch { width: 36px; height: 20px; background: var(--border-strong); border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; }\n    .switch::after {\n      content: \"\"; position: absolute; top: 2px; left: 2px;\n      width: 16px; height: 16px; border-radius: 50%; background: var(--surface);\n      transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n    }\n    .switch.on { background: var(--green); }\n    .switch.on::after { transform: translateX(16px); }\n    .switch.disabled { opacity: 0.4; cursor: not-allowed; }\n\n    .danger-zone {\n      margin-top: 20px; padding: 18px 20px;\n      border: 1px solid var(--red); border-radius: var(--radius-lg);\n      background: rgba(214,69,69,0.03);\n      display: flex; justify-content: space-between; align-items: center; gap: 20px;\n    }\n    .danger-zone h4 { font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: 4px; }\n    .danger-zone p { font-size: 12px; color: var(--text-muted); }\n\n    /* Toast */\n    .toast-container {\n      position: fixed; bottom: 24px; right: 24px; z-index: 1000;\n      display: flex; flex-direction: column; gap: 10px; pointer-events: none;\n    }\n    .toast {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 16px 12px 14px; border-radius: 12px;\n      background: var(--navy-dark); color: #fff;\n      box-shadow: var(--shadow-lg); min-width: 280px;\n      font-size: 13px; font-weight: 500;\n      animation: toastIn 0.22s ease-out;\n      pointer-events: auto;\n    }\n    .toast.success { background: linear-gradient(135deg, var(--green), var(--green-dark)); }\n    .toast.info { background: var(--navy); }\n    .toast.warn { background: linear-gradient(135deg, var(--orange), #c87025); }\n    .toast svg { width: 18px; height: 18px; flex-shrink: 0; }\n    .toast.leaving { animation: toastOut 0.2s ease-in forwards; }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n    @keyframes toastOut { to { opacity: 0; transform: translateY(6px); } }\n\n    /* Modal */\n    .modal-backdrop {\n      position: fixed; inset: 0; background: rgba(20,32,74,0.45);\n      backdrop-filter: blur(4px);\n      display: none; align-items: center; justify-content: center;\n      z-index: 900; padding: 24px;\n      animation: bdIn 0.18s ease-out;\n    }\n    .modal-backdrop.open { display: flex; }\n    @keyframes bdIn { from { opacity: 0; } to { opacity: 1; } }\n    .modal {\n      background: var(--surface); border-radius: var(--radius-lg);\n      width: 100%; max-width: 460px;\n      box-shadow: var(--shadow-xl);\n      animation: modalIn 0.22s ease-out;\n      overflow: hidden;\n    }\n    @keyframes modalIn { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }\n    .modal-head { padding: 20px 22px 10px; display: flex; gap: 14px; align-items: flex-start; }\n    .modal-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .modal-icon.danger { background: var(--red-bg); color: var(--red); }\n    .modal-icon.warn { background: var(--orange-bg); color: var(--orange); }\n    .modal-icon svg { width: 20px; height: 20px; }\n    .modal h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }\n    .modal-body { padding: 0 22px 16px 76px; font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n    .modal-body strong { color: var(--text); }\n    .modal-confirm-input {\n      margin-top: 12px; padding: 9px 12px;\n      border: 1px solid var(--border); border-radius: 8px;\n      width: 100%; font-size: 13px; outline: none;\n      font-family: 'JetBrains Mono', monospace;\n    }\n    .modal-confirm-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,69,69,0.12); }\n    .modal-foot {\n      padding: 14px 22px; background: var(--surface-subtle);\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: flex-end; gap: 10px;\n    }\n    .modal-step-pill {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11px; font-weight: 700; color: var(--red);\n      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;\n    }\n    .modal-step-pill::before { content: \"\"; width: 5px; height: 5px; border-radius: 50%; background: var(--red); }\n\n    /* Utility */\n    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }\n  ";

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
          <a className="sb-nav-item active" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>
            Settings
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
          <a href="settings.html">Settings</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Team</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search members, roles, activity…" />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      
      <div className="page-head-bar">
        <div>
          <h1>Team members</h1>
          <p>Invite teammates, assign roles, and control what they can touch inside the workspace.</p>
        </div>
        <button className="btn btn-primary" data-scroll-invite="">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Invite members
        </button>
      </div>

      
      <div className="settings-wrap">
        <div className="settings-grid">

          
          <nav className="sub-nav">
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              Workspace
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></svg>
              Branding
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
              Billing
            </a>
            <a className="sub-nav-item active" href="admin-team.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Team
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Security
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              Notifications
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20.8a8 8 0 1 1 4-15M14 3.2A8 8 0 0 1 17 17" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
              Integrations
            </a>
            <a className="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              API &amp; Webhooks
            </a>
          </nav>

          
          <div className="panel-col">

            
            <div className="plan-callout">
              <div className="plan-callout-left">
                <div className="plan-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
                <div>
                  <div className="eyebrow" style={{marginBottom: "2px"}}>Pro plan</div>
                  <div className="plan-text">Your plan includes up to <strong>5 team members</strong>. You're using <strong>3</strong>, with 1 pending invite. <strong>Upgrade to Scale</strong> for unlimited seats, SSO, and audit exports.</div>
                </div>
              </div>
              <div className="plan-meter">
                <div className="plan-meter-bar"><div className="plan-meter-fill" /></div>
                <div className="plan-meter-label"><span>3 of 5 seats</span><span>1 pending</span></div>
                <button className="btn btn-pink btn-sm" style={{alignSelf: "flex-end"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                  Upgrade to Scale
                </button>
              </div>
            </div>

            
            <section className="card" id="invite-card">
              <div className="card-head">
                <div>
                  <div className="eyebrow">Grow the team</div>
                  <h2>Invite members</h2>
                  <p>Send invites to multiple people at once. They'll get an email with a secure sign-in link.</p>
                </div>
              </div>
              <div className="invite-grid">
                <div className="field">
                  <label className="field-label" htmlFor="invite-emails">Email addresses</label>
                  <textarea id="invite-emails" className="field-textarea" placeholder="devon@blackbear.com, sam@blackbear.com, …" />
                  <span className="field-hint">Separate multiple emails with commas.</span>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="invite-role">Role</label>
                  <select id="invite-role" className="field-select">
                    <option value="admin">Admin</option>
                    <option value="manager" selected>Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <span className="field-hint">You can change this later.</span>
                </div>
              </div>
              <div className="field" style={{marginTop: "14px"}}>
                <label className="field-label" htmlFor="invite-note">Personal note <span style={{color: "var(--text-faint)", fontWeight: "500"}}>— optional</span></label>
                <textarea id="invite-note" className="field-textarea" placeholder="Hey — joining the Black Bear ops team. Here's your access…" />
              </div>
              <div className="invite-footer">
                <span className="invite-footer-hint">Invites expire in 7 days. You can resend any time.</span>
                <div style={{display: "flex", gap: "10px"}}>
                  <button className="btn btn-ghost btn-sm" id="invite-clear">Clear</button>
                  <button className="btn btn-primary" id="invite-send">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z" /></svg>
                    Send invites
                  </button>
                </div>
              </div>
            </section>

            
            <section className="card">
              <div className="card-head">
                <div>
                  <div className="eyebrow">Who has access</div>
                  <h2>Current members</h2>
                  <p>Owners can't be removed and can't lose access. Transfer ownership in Workspace settings.</p>
                </div>
              </div>
              <div className="members-table-wrap">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Added</th>
                      <th>Last active</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody id="members-tbody">
                    <tr data-member-id="hc">
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar pink">HC</div>
                          <div>
                            <div className="member-name">Harrison Cooper<span className="member-self">You</span></div>
                            <div className="member-email">harrison@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-pill role-owner">Owner</span>
                      </td>
                      <td className="cell-muted">Feb 3, 2026</td>
                      <td><span className="active-dot">Active now</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn disabled" title="Owner can't be removed">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="mc" data-member-name="Megan Cooper">
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar">MC</div>
                          <div>
                            <div className="member-name">Megan Cooper</div>
                            <div className="member-email">megan@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-pill-wrap" style={{position: "relative", display: "inline-block"}}>
                          <button className="role-pill role-admin" data-role-trigger="" data-current="admin">
                            Admin
                            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </button>
                          <div className="role-menu" data-role-menu="">
                            <button data-role="admin"><span className="rm-dot" style={{background: "var(--pink)"}} /><span className="rm-text"><span className="rm-title">Admin</span><span className="rm-sub">Full access, can manage billing</span></span></button>
                            <button data-role="manager"><span className="rm-dot" style={{background: "var(--blue)"}} /><span className="rm-text"><span className="rm-title">Manager</span><span className="rm-sub">Day-to-day operations</span></span></button>
                            <button data-role="viewer"><span className="rm-dot" style={{background: "var(--text-muted)"}} /><span className="rm-text"><span className="rm-title">Viewer</span><span className="rm-sub">Read-only access</span></span></button>
                          </div>
                        </div>
                      </td>
                      <td className="cell-muted">Feb 18, 2026</td>
                      <td className="cell-strong">2 hours ago</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" title="Resend invite email" data-resend="">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" /></svg>
                          </button>
                          <button className="icon-btn danger" title="Remove member" data-remove="">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="jr" data-member-name="Jordan Ruiz">
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar green">JR</div>
                          <div>
                            <div className="member-name">Jordan Ruiz</div>
                            <div className="member-email">jordan@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-pill-wrap" style={{position: "relative", display: "inline-block"}}>
                          <button className="role-pill role-manager" data-role-trigger="" data-current="manager">
                            Manager
                            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </button>
                          <div className="role-menu" data-role-menu="">
                            <button data-role="admin"><span className="rm-dot" style={{background: "var(--pink)"}} /><span className="rm-text"><span className="rm-title">Admin</span><span className="rm-sub">Full access, can manage billing</span></span></button>
                            <button data-role="manager"><span className="rm-dot" style={{background: "var(--blue)"}} /><span className="rm-text"><span className="rm-title">Manager</span><span className="rm-sub">Day-to-day operations</span></span></button>
                            <button data-role="viewer"><span className="rm-dot" style={{background: "var(--text-muted)"}} /><span className="rm-text"><span className="rm-title">Viewer</span><span className="rm-sub">Read-only access</span></span></button>
                          </div>
                        </div>
                      </td>
                      <td className="cell-muted">Mar 12, 2026</td>
                      <td className="cell-strong">Yesterday</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" title="Resend invite email" data-resend="">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" /></svg>
                          </button>
                          <button className="icon-btn danger" title="Remove member" data-remove="">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="devon" data-member-name="devon@blackbear.com">
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar pending">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" /></svg>
                          </div>
                          <div>
                            <div className="member-name">devon@blackbear.com</div>
                            <div className="member-email">Invitation pending · sent Apr 10</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-pill role-viewer" style={{cursor: "default"}}>
                          Viewer
                        </span>
                      </td>
                      <td className="cell-muted">—</td>
                      <td>
                        <span style={{display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", color: "var(--orange)", background: "var(--orange-bg)", padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.06em"}}>
                          Pending
                        </span>
                      </td>
                      <td>
                        <div className="pending-mini-btns" style={{justifyContent: "flex-end"}}>
                          <button className="mini-btn" data-resend="">Resend</button>
                          <button className="mini-btn danger" data-cancel-invite="">Cancel</button>
                        </div>
                      </td>
                    </tr>

                    <tr className="placeholder-row placeholder">
                      <td colSpan="5" style={{textAlign: "center", padding: "16px"}}>
                        <button className="placeholder-cta" data-scroll-invite="">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                          Invite someone — seat 4 of 5
                        </button>
                      </td>
                    </tr>
                    <tr className="placeholder-row placeholder">
                      <td colSpan="5" style={{textAlign: "center", padding: "16px"}}>
                        <button className="placeholder-cta" data-scroll-invite="">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                          Invite someone — seat 5 of 5
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            
            <section className="card">
              <div className="card-head">
                <div>
                  <div className="eyebrow">Permissions</div>
                  <h2>What each role can do</h2>
                  <p>Permissions apply across properties, leases, and finances. Owner-only actions are never delegated.</p>
                </div>
              </div>
              <div className="roles-grid">
                <div className="role-card">
                  <div className="role-card-head">
                    <div className="role-card-icon admin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z" /></svg>
                    </div>
                    <div>
                      <h4>Admin</h4>
                      <div className="role-card-sub">Full access</div>
                    </div>
                  </div>
                  <div className="role-perms">
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Invite, remove, and change roles of other members</div>
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Manage billing, plan, and payment methods</div>
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Everything a Manager can do</div>
                    <div className="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>Cannot delete the workspace or transfer ownership</div>
                  </div>
                </div>

                <div className="role-card">
                  <div className="role-card-head">
                    <div className="role-card-icon manager">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
                    </div>
                    <div>
                      <h4>Manager</h4>
                      <div className="role-card-sub">Day-to-day ops</div>
                    </div>
                  </div>
                  <div className="role-perms">
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Tenants, leases, maintenance tickets, and payments</div>
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Message residents and record rent activity</div>
                    <div className="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>Cannot view or change billing</div>
                    <div className="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>Cannot permanently delete records</div>
                  </div>
                </div>

                <div className="role-card">
                  <div className="role-card-head">
                    <div className="role-card-icon viewer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    <div>
                      <h4>Viewer</h4>
                      <div className="role-card-sub">Read-only</div>
                    </div>
                  </div>
                  <div className="role-perms">
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>View properties, leases, and financial reports</div>
                    <div className="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>Export CSVs — great for accountants and bookkeepers</div>
                    <div className="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>Cannot edit any record or send messages</div>
                    <div className="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>Cannot see team members or billing</div>
                  </div>
                </div>
              </div>
            </section>

            
            <section className="card">
              <div className="card-head" style={{marginBottom: "10px"}}>
                <div>
                  <div className="eyebrow">Audit trail</div>
                  <h2>Recent team activity</h2>
                  <p>Last 10 actions across your workspace. Filter by teammate.</p>
                </div>
                <a href="#" className="btn btn-ghost btn-sm">
                  View full log
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </a>
              </div>
              <div className="activity-head">
                <div className="filter-chip-row" id="activity-filters">
                  <button className="filter-chip active" data-filter="all">Everyone</button>
                  <button className="filter-chip" data-filter="hc">Harrison</button>
                  <button className="filter-chip" data-filter="mc">Megan</button>
                  <button className="filter-chip" data-filter="jr">Jordan</button>
                  <button className="filter-chip" data-filter="sys">System</button>
                </div>
              </div>
              <div className="activity-list" id="activity-list">
                <div className="activity-row" data-actor="mc">
                  <div className="activity-avatar a-mc">MC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Megan Cooper</span>
                    <span className="activity-verb"> added a tenant </span>
                    <span className="activity-target">Priya Shah</span>
                    <span className="activity-verb"> to </span>
                    <span className="activity-target">3026 Turf Ave, Room A</span>
                    <div className="activity-time">Today at 1:42 PM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="jr">
                  <div className="activity-avatar a-jr">JR</div>
                  <div className="activity-main">
                    <span className="activity-actor">Jordan Ruiz</span>
                    <span className="activity-verb"> closed maintenance ticket </span>
                    <span className="activity-target">#T-418 — leaky faucet</span>
                    <div className="activity-time">Today at 11:08 AM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="hc">
                  <div className="activity-avatar a-hc">HC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Harrison Cooper</span>
                    <span className="activity-verb"> changed the lease for </span>
                    <span className="activity-target">908 Lee Dr · Room C</span>
                    <span className="activity-verb"> — rent $950 → $1,025</span>
                    <div className="activity-time">Yesterday at 4:19 PM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="sys">
                  <div className="activity-avatar a-sys">SY</div>
                  <div className="activity-main">
                    <span className="activity-actor">System</span>
                    <span className="activity-verb"> invite resent to </span>
                    <span className="activity-target">devon@blackbear.com</span>
                    <div className="activity-time">Yesterday at 2:51 PM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="mc">
                  <div className="activity-avatar a-mc">MC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Megan Cooper</span>
                    <span className="activity-verb"> recorded payment </span>
                    <span className="activity-target">$1,200 from Aidan Hale</span>
                    <div className="activity-time">Apr 12 at 9:04 AM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="jr">
                  <div className="activity-avatar a-jr">JR</div>
                  <div className="activity-main">
                    <span className="activity-actor">Jordan Ruiz</span>
                    <span className="activity-verb"> assigned ticket </span>
                    <span className="activity-target">#T-419</span>
                    <span className="activity-verb"> to </span>
                    <span className="activity-target">Acme Plumbing</span>
                    <div className="activity-time">Apr 11 at 6:12 PM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="hc">
                  <div className="activity-avatar a-hc">HC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Harrison Cooper</span>
                    <span className="activity-verb"> invited </span>
                    <span className="activity-target">devon@blackbear.com</span>
                    <span className="activity-verb"> as Viewer</span>
                    <div className="activity-time">Apr 10 at 3:30 PM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="mc">
                  <div className="activity-avatar a-mc">MC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Megan Cooper</span>
                    <span className="activity-verb"> uploaded a signed lease for </span>
                    <span className="activity-target">Nguyen — 908 Lee Dr</span>
                    <div className="activity-time">Apr 9 at 10:22 AM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="hc">
                  <div className="activity-avatar a-hc">HC</div>
                  <div className="activity-main">
                    <span className="activity-actor">Harrison Cooper</span>
                    <span className="activity-verb"> promoted </span>
                    <span className="activity-target">Megan Cooper</span>
                    <span className="activity-verb"> from Manager to Admin</span>
                    <div className="activity-time">Apr 8 at 9:45 AM</div>
                  </div>
                </div>
                <div className="activity-row" data-actor="jr">
                  <div className="activity-avatar a-jr">JR</div>
                  <div className="activity-main">
                    <span className="activity-actor">Jordan Ruiz</span>
                    <span className="activity-verb"> exported rent roll — </span>
                    <span className="activity-target">April 2026.csv</span>
                    <div className="activity-time">Apr 7 at 4:58 PM</div>
                  </div>
                </div>
              </div>
            </section>

            
            <section className="card">
              <div className="card-head">
                <div>
                  <div className="eyebrow">Access controls</div>
                  <h2>Team security</h2>
                  <p>Enforce sign-in requirements across everyone in the workspace.</p>
                </div>
              </div>
              <div className="sec-row">
                <div className="sec-row-info">
                  <div className="sec-row-title">Require multi-factor authentication</div>
                  <div className="sec-row-sub">Every member must set up an authenticator app or passkey before signing in.</div>
                </div>
                <div className="switch on" data-switch="mfa" role="switch" aria-checked="true" tabIndex="0" />
              </div>
              <div className="sec-row">
                <div className="sec-row-info">
                  <div className="sec-row-title">Require SSO <span className="upsell-pill">Scale+</span></div>
                  <div className="sec-row-sub">Force sign-in through your identity provider (Google, Okta, Entra). Available on Scale.</div>
                </div>
                <div className="switch disabled" data-switch="sso" role="switch" aria-checked="false" tabIndex="-1" />
              </div>
              <div className="sec-row">
                <div className="sec-row-info">
                  <div className="sec-row-title">Session timeout</div>
                  <div className="sec-row-sub">Sign members out automatically after a period of inactivity.</div>
                </div>
                <select className="field-select" style={{width: "auto", minWidth: "170px"}}>
                  <option>15 minutes</option>
                  <option>1 hour</option>
                  <option selected>8 hours</option>
                  <option>24 hours</option>
                  <option>7 days</option>
                  <option>Never</option>
                </select>
              </div>

              <div className="danger-zone">
                <div>
                  <h4>Force sign out all users</h4>
                  <p>Immediately invalidates every active session, including yours. Use if a device is lost or a member leaves suddenly.</p>
                </div>
                <button className="btn btn-danger" id="force-signout-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>
                  Force sign out
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  </div>

  
  <div className="modal-backdrop" id="modal-remove" role="dialog" aria-modal="true">
    <div className="modal">
      <div className="modal-head">
        <div className="modal-icon danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
        </div>
        <div>
          <h3>Remove <span id="remove-name">member</span>?</h3>
        </div>
      </div>
      <div className="modal-body">
        They'll lose access immediately and won't receive notifications. Their activity history will remain in the audit log. This action can't be undone, but you can always invite them again.
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" data-modal-cancel="">Keep member</button>
        <button className="btn btn-danger-solid btn-sm" id="confirm-remove">Remove from workspace</button>
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop" id="modal-force-1" role="dialog" aria-modal="true">
    <div className="modal">
      <div className="modal-head">
        <div className="modal-icon warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></svg>
        </div>
        <div>
          <div className="modal-step-pill">Step 1 of 2</div>
          <h3>Sign out every active session?</h3>
        </div>
      </div>
      <div className="modal-body">
        This will sign out <strong>3 team members</strong> and <strong>all tenants currently signed in to the resident portal</strong>. Scheduled automations will continue running. You'll be redirected to the sign-in page.
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" data-modal-cancel="">Cancel</button>
        <button className="btn btn-danger btn-sm" id="force-step2">Continue</button>
      </div>
    </div>
  </div>

  <div className="modal-backdrop" id="modal-force-2" role="dialog" aria-modal="true">
    <div className="modal">
      <div className="modal-head">
        <div className="modal-icon danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>
        </div>
        <div>
          <div className="modal-step-pill">Step 2 of 2 · final</div>
          <h3>Type <code style={{fontFamily: "'JetBrains Mono',monospace", background: "var(--red-bg)", color: "var(--red)", padding: "1px 6px", borderRadius: "4px"}}>SIGN OUT</code> to confirm</h3>
        </div>
      </div>
      <div className="modal-body">
        Last chance. Once confirmed, sessions are revoked immediately and can't be restored.
        <input className="modal-confirm-input" id="force-confirm-input" placeholder="SIGN OUT" autoComplete="off" />
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" data-modal-cancel="">Back out</button>
        <button className="btn btn-danger-solid btn-sm" id="force-confirm" disabled style={{opacity: ".5", cursor: "not-allowed"}}>Force sign out now</button>
      </div>
    </div>
  </div>

  
  <div className="toast-container" id="toast-container" />

  

    </>
  );
}
