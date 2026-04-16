"use client";

// Mock ported from ~/Desktop/blackbear/settings.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar (shared with admin) ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-danger { background: var(--surface); border: 1px solid var(--red); color: var(--red); }\n    .btn-danger:hover { background: var(--red); color: #fff; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Settings layout ===== */\n    .settings-wrap {\n      flex: 1; overflow: auto;\n      padding: 20px 28px 28px;\n      display: flex; flex-direction: column; gap: 18px;\n    }\n    .settings-grid {\n      display: grid; grid-template-columns: 200px 1fr;\n      gap: 24px; align-items: flex-start;\n      flex: 1; min-height: 0;\n    }\n\n    .sub-nav {\n      position: sticky; top: 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 8px;\n      display: flex; flex-direction: column; gap: 2px;\n    }\n    .sub-nav-item {\n      display: flex; align-items: center; gap: 10px;\n      padding: 9px 12px; border-radius: 8px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease; position: relative;\n      text-align: left; width: 100%;\n    }\n    .sub-nav-item:hover { background: var(--surface-alt); color: var(--text); }\n    .sub-nav-item.active { background: var(--pink-bg); color: var(--text); }\n    .sub-nav-item.active::before {\n      content: \"\"; position: absolute; left: 0; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sub-nav-item svg { width: 15px; height: 15px; opacity: 0.7; }\n    .sub-nav-item.active svg { color: var(--pink); opacity: 1; }\n\n    .panel-col { min-width: 0; display: flex; flex-direction: column; gap: 18px; }\n    .settings-panel { display: none; flex-direction: column; gap: 18px; }\n    .settings-panel.active { display: flex; }\n\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px;\n    }\n    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 18px; }\n    .eyebrow {\n      font-size: 11px; font-weight: 700; color: var(--pink);\n      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;\n    }\n    .card-head h2 {\n      font-size: 20px; font-weight: 800; letter-spacing: -0.015em;\n    }\n    .card-head p {\n      font-size: 13px; color: var(--text-muted); margin-top: 4px;\n    }\n\n    /* ===== Theme picker ===== */\n    .theme-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    @media (max-width: 1200px) { .theme-grid { grid-template-columns: repeat(2, 1fr); } }\n    .theme-card {\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      overflow: hidden; cursor: pointer; background: var(--surface);\n      transition: all 0.15s ease; position: relative;\n      display: flex; flex-direction: column;\n    }\n    .theme-card:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }\n    .theme-card.active { border-color: var(--pink); box-shadow: 0 0 0 3px rgba(255,73,152,0.15); }\n    .theme-card-badge {\n      position: absolute; top: 10px; right: 10px;\n      width: 26px; height: 26px; border-radius: 50%;\n      background: var(--pink); color: #fff;\n      display: none; align-items: center; justify-content: center;\n      box-shadow: 0 4px 10px rgba(255,73,152,0.4);\n      z-index: 2;\n    }\n    .theme-card-badge svg { width: 14px; height: 14px; }\n    .theme-card.active .theme-card-badge { display: flex; }\n\n    .theme-preview {\n      height: 200px; display: flex; overflow: hidden;\n      border-bottom: 1px solid var(--border);\n    }\n    .tp-sidebar { width: 38%; padding: 14px 10px; display: flex; flex-direction: column; gap: 8px; }\n    .tp-logo { width: 18px; height: 18px; border-radius: 5px; }\n    .tp-sb-row { height: 6px; border-radius: 3px; opacity: 0.6; }\n    .tp-sb-row.active { opacity: 1; }\n    .tp-body { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; }\n    .tp-head-row { display: flex; justify-content: space-between; align-items: center; }\n    .tp-title { height: 8px; width: 50%; border-radius: 3px; }\n    .tp-chip { height: 10px; width: 26px; border-radius: 100px; }\n    .tp-kpi-row { display: flex; gap: 6px; }\n    .tp-kpi { flex: 1; height: 32px; border-radius: 5px; padding: 5px; display: flex; flex-direction: column; gap: 3px; }\n    .tp-kpi-bar-sm { height: 3px; width: 60%; border-radius: 2px; opacity: 0.5; }\n    .tp-kpi-bar-lg { height: 5px; width: 80%; border-radius: 2px; }\n    .tp-table { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }\n    .tp-row { display: flex; gap: 5px; align-items: center; }\n    .tp-avatar-dot { width: 8px; height: 8px; border-radius: 50%; }\n    .tp-row-line { height: 4px; border-radius: 2px; opacity: 0.4; flex: 1; }\n\n    /* Flagship preview */\n    .tp-flagship .tp-sidebar { background: linear-gradient(180deg, #1e2a5e, #14204a); }\n    .tp-flagship .tp-logo { background: linear-gradient(135deg, #1665D8, #FF4998); }\n    .tp-flagship .tp-sb-row { background: rgba(255,255,255,0.4); }\n    .tp-flagship .tp-sb-row.active { background: #FF4998; }\n    .tp-flagship .tp-body { background: #f7f9fc; }\n    .tp-flagship .tp-title { background: #1a1f36; }\n    .tp-flagship .tp-chip { background: #FF4998; }\n    .tp-flagship .tp-kpi { background: var(--surface); border: 1px solid #e3e8ef; }\n    .tp-flagship .tp-kpi-bar-lg { background: #1251AD; }\n    .tp-flagship .tp-kpi-bar-sm { background: #1a1f36; }\n    .tp-flagship .tp-avatar-dot { background: #1251AD; }\n    .tp-flagship .tp-row-line { background: #1a1f36; }\n\n    /* Hearth preview */\n    .tp-hearth .tp-sidebar { background: linear-gradient(180deg, #8a6a1f, #6b4f12); }\n    .tp-hearth .tp-logo { background: linear-gradient(135deg, #f5a623, #1ea97c); }\n    .tp-hearth .tp-sb-row { background: rgba(255,240,210,0.4); }\n    .tp-hearth .tp-sb-row.active { background: #f5a623; }\n    .tp-hearth .tp-body { background: #fdf6e8; }\n    .tp-hearth .tp-title { background: #3a2e14; }\n    .tp-hearth .tp-chip { background: #1ea97c; }\n    .tp-hearth .tp-kpi { background: var(--surface); border: 1px solid #ecdbb5; }\n    .tp-hearth .tp-kpi-bar-lg { background: #f5a623; }\n    .tp-hearth .tp-kpi-bar-sm { background: #3a2e14; }\n    .tp-hearth .tp-avatar-dot { background: #1ea97c; }\n    .tp-hearth .tp-row-line { background: #3a2e14; }\n\n    /* Nocturne preview */\n    .tp-nocturne .tp-sidebar { background: #000; }\n    .tp-nocturne .tp-logo { background: linear-gradient(135deg, #00e5ff, #ff00aa); }\n    .tp-nocturne .tp-sb-row { background: rgba(255,255,255,0.25); }\n    .tp-nocturne .tp-sb-row.active { background: #00e5ff; }\n    .tp-nocturne .tp-body { background: #0a0a12; }\n    .tp-nocturne .tp-title { background: #e8e8ff; }\n    .tp-nocturne .tp-chip { background: #ff00aa; }\n    .tp-nocturne .tp-kpi { background: #12121e; border: 1px solid #2a2a3a; }\n    .tp-nocturne .tp-kpi-bar-lg { background: #00e5ff; }\n    .tp-nocturne .tp-kpi-bar-sm { background: #8888aa; }\n    .tp-nocturne .tp-avatar-dot { background: #ff00aa; }\n    .tp-nocturne .tp-row-line { background: #8888aa; }\n\n    /* Slate preview */\n    .tp-slate .tp-sidebar { background: #f7f7f8; border-right: 1px solid #e3e3e6; }\n    .tp-slate .tp-logo { background: #2c6fe0; }\n    .tp-slate .tp-sb-row { background: #c0c0c8; }\n    .tp-slate .tp-sb-row.active { background: #2c6fe0; }\n    .tp-slate .tp-body { background: var(--surface); }\n    .tp-slate .tp-title { background: #1a1a1a; }\n    .tp-slate .tp-chip { background: #2c6fe0; }\n    .tp-slate .tp-kpi { background: #fafafa; border: 1px solid #e3e3e6; }\n    .tp-slate .tp-kpi-bar-lg { background: #2c6fe0; }\n    .tp-slate .tp-kpi-bar-sm { background: #888; }\n    .tp-slate .tp-avatar-dot { background: #444; }\n    .tp-slate .tp-row-line { background: #444; }\n\n    /* Custom preview */\n    .tp-custom {\n      border: 2px dashed var(--border-strong);\n      background: repeating-linear-gradient(45deg, #fafbfd, #fafbfd 10px, #f0f2f7 10px, #f0f2f7 20px);\n      display: flex; align-items: center; justify-content: center;\n      flex-direction: column; gap: 8px;\n    }\n    .tp-custom-icon {\n      width: 52px; height: 52px; border-radius: 50%;\n      background: conic-gradient(from 0deg, #FF4998, #f5a623, #1ea97c, #1251AD, #7c4dff, #FF4998);\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: var(--shadow);\n    }\n    .tp-custom-icon::after {\n      content: \"\"; width: 22px; height: 22px; border-radius: 50%; background: var(--surface);\n    }\n    .tp-custom-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; }\n\n    .theme-info { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }\n    .theme-name-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }\n    .theme-name { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }\n    .theme-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; }\n    .theme-action-row { margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n    .theme-use-btn {\n      padding: 7px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;\n      background: var(--surface-alt); color: var(--text); border: 1px solid var(--border);\n      transition: all 0.15s ease;\n    }\n    .theme-use-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .theme-card.active .theme-use-btn {\n      background: var(--green-bg); color: var(--green-dark); border-color: var(--green);\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .theme-card.active .theme-use-btn::before {\n      content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: var(--green);\n    }\n    .theme-tag {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n\n    /* ===== Advanced theme ===== */\n    .advanced {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .advanced-head {\n      padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none;\n    }\n    .advanced-head:hover { background: var(--surface-alt); }\n    .advanced-title { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 10px; }\n    .advanced-title svg { width: 16px; height: 16px; color: var(--text-muted); }\n    .advanced-chev { width: 16px; height: 16px; color: var(--text-muted); transition: transform 0.2s ease; }\n    .advanced.open .advanced-chev { transform: rotate(180deg); }\n    .advanced-body {\n      display: none; padding: 4px 20px 20px;\n      border-top: 1px solid var(--border);\n    }\n    .advanced.open .advanced-body { display: block; }\n\n    .adv-section { padding-top: 20px; }\n    .adv-section-title {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;\n    }\n\n    .field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }\n    .field-hint { font-size: 11px; color: var(--text-faint); }\n    .field-input, .field-select {\n      padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;\n      background: var(--surface); font-size: 13px; color: var(--text);\n      transition: all 0.15s ease; outline: none; width: 100%;\n    }\n    .field-input:focus, .field-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12); }\n    .field-prefix-group {\n      display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px;\n      background: var(--surface); overflow: hidden;\n    }\n    .field-prefix-group:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12); }\n    .field-prefix {\n      padding: 9px 12px; background: var(--surface-alt); border-right: 1px solid var(--border);\n      color: var(--text-muted); font-size: 13px; font-weight: 500;\n    }\n    .field-prefix-group input, .field-prefix-group .field-suffix {\n      border: none; padding: 9px 12px; font-size: 13px; flex: 1; outline: none; background: transparent;\n    }\n    .field-suffix { color: var(--text-muted); font-weight: 500; }\n\n    .color-picker {\n      display: flex; align-items: center; gap: 10px;\n      padding: 6px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface);\n    }\n    .color-swatch { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); position: relative; overflow: hidden; }\n    .color-swatch input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }\n    .color-hex { flex: 1; border: none; outline: none; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text); background: transparent; padding: 0 4px; }\n\n    .segmented {\n      display: inline-flex; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px; padding: 3px;\n    }\n    .segmented button {\n      padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .segmented button.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }\n    .segmented button:hover:not(.active) { color: var(--text); }\n\n    .checkbox-list { display: flex; flex-direction: column; gap: 2px; }\n    .checkbox-row {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      cursor: pointer; transition: background 0.15s ease;\n    }\n    .checkbox-row:hover { background: var(--surface-alt); }\n    .checkbox {\n      width: 18px; height: 18px; border: 1.5px solid var(--border-strong); border-radius: 5px;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      background: var(--surface); transition: all 0.15s ease;\n    }\n    .checkbox svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .checkbox-row.checked .checkbox { background: var(--blue); border-color: var(--blue); }\n    .checkbox-row.checked .checkbox svg { opacity: 1; }\n    .checkbox-label { font-size: 13px; font-weight: 500; flex: 1; }\n    .checkbox-sub { font-size: 11px; color: var(--text-faint); margin-top: 1px; }\n\n    .form-footer {\n      display: flex; justify-content: flex-end; gap: 10px;\n      margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);\n    }\n\n    /* ===== Toggle switch ===== */\n    .switch { width: 36px; height: 20px; background: var(--border-strong); border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; }\n    .switch::after {\n      content: \"\"; position: absolute; top: 2px; left: 2px;\n      width: 16px; height: 16px; border-radius: 50%; background: var(--surface);\n      transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n    }\n    .switch.on { background: var(--green); }\n    .switch.on::after { transform: translateX(16px); }\n\n    /* ===== Pills & badges ===== */\n    .pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n\n    /* ===== Workspace panel ===== */\n    .ws-meta { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 8px; }\n    .ws-meta-item { font-size: 12px; color: var(--text-muted); }\n    .ws-meta-item strong { color: var(--text); font-weight: 600; }\n\n    .domain-row {\n      display: flex; align-items: center; justify-content: space-between; gap: 14px;\n      padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px;\n      background: var(--surface-subtle);\n    }\n    .domain-info code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--blue); font-weight: 600; }\n    .domain-info-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    .danger-zone {\n      margin-top: 20px; padding: 18px 20px;\n      border: 1px solid var(--red); border-radius: var(--radius-lg);\n      background: rgba(214,69,69,0.03);\n      display: flex; justify-content: space-between; align-items: center; gap: 20px;\n    }\n    .danger-zone h4 { font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: 4px; }\n    .danger-zone p { font-size: 12px; color: var(--text-muted); }\n\n    /* ===== Brand panel ===== */\n    .upload-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n    .upload {\n      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);\n      padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;\n      cursor: pointer; transition: all 0.15s ease; background: var(--surface-subtle);\n    }\n    .upload:hover { border-color: var(--blue); background: var(--blue-pale); }\n    .upload-preview {\n      width: 64px; height: 64px; border-radius: 14px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: var(--shadow);\n    }\n    .upload-preview svg { width: 28px; height: 28px; color: #fff; }\n    .upload-preview.small { width: 36px; height: 36px; border-radius: 8px; }\n    .upload-preview.small svg { width: 18px; height: 18px; }\n    .upload-label { font-size: 13px; font-weight: 600; }\n    .upload-hint { font-size: 11px; color: var(--text-faint); text-align: center; }\n\n    /* ===== Subscription panel ===== */\n    .sub-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-lg); padding: 28px;\n      display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: flex-start;\n      position: relative; overflow: hidden;\n    }\n    .sub-card::before {\n      content: \"\"; position: absolute; right: -120px; top: -120px;\n      width: 300px; height: 300px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.25), transparent 70%);\n    }\n    .sub-card-eyebrow { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }\n    .sub-card h3 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .sub-price { display: flex; align-items: baseline; gap: 6px; margin: 12px 0; }\n    .sub-price strong { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; color: #fff; }\n    .sub-price span { font-size: 14px; color: rgba(255,255,255,0.7); }\n    .sub-locked-badge {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 4px 10px; border-radius: 100px;\n      background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;\n      margin-top: 4px;\n    }\n    .sub-card-right { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }\n\n    .usage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }\n    .usage-item { padding: 14px 16px; background: var(--surface-subtle); border: 1px solid var(--border); border-radius: var(--radius); }\n    .usage-label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }\n    .usage-val { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 8px; }\n    .usage-val span { font-size: 12px; color: var(--text-faint); font-weight: 500; }\n    .usage-bar { height: 5px; background: var(--border); border-radius: 100px; overflow: hidden; }\n    .usage-fill { height: 100%; background: var(--blue); border-radius: 100px; }\n    .usage-fill.warn { background: var(--orange); }\n    .usage-fill.ok { background: var(--green); }\n\n    /* ===== Tables ===== */\n    .t-table { width: 100%; border-collapse: collapse; }\n    .t-table th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;\n      padding: 10px 12px; border-bottom: 1px solid var(--border);\n    }\n    .t-table td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 13px; }\n    .t-table tr:last-child td { border-bottom: none; }\n    .t-table tr:hover td { background: var(--surface-subtle); }\n    .t-table a.link { color: var(--blue); font-weight: 600; }\n    .t-table a.link:hover { text-decoration: underline; }\n\n    code.mono {\n      font-family: 'JetBrains Mono', monospace; font-size: 12px;\n      background: var(--surface-alt); padding: 3px 8px; border-radius: 5px;\n      border: 1px solid var(--border); color: var(--text);\n    }\n    .copy-btn {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 8px; border-radius: 6px;\n      font-size: 11px; font-weight: 600; color: var(--text-muted);\n      background: var(--surface-alt); border: 1px solid var(--border);\n      transition: all 0.15s ease;\n    }\n    .copy-btn:hover { color: var(--blue); border-color: var(--blue); }\n    .copy-btn svg { width: 11px; height: 11px; }\n\n    /* ===== Integrations grid ===== */\n    .integ-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }\n    @media (max-width: 1200px) { .integ-grid { grid-template-columns: 1fr; } }\n    .integ-card {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      padding: 16px; display: flex; gap: 14px; align-items: flex-start;\n      background: var(--surface); transition: all 0.15s ease;\n    }\n    .integ-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }\n    .integ-logo {\n      width: 42px; height: 42px; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      color: #fff; font-weight: 800; font-size: 14px;\n    }\n    .integ-info { flex: 1; min-width: 0; }\n    .integ-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }\n    .integ-desc { font-size: 12px; color: var(--text-muted); }\n    .integ-action { flex-shrink: 0; }\n\n    /* ===== Team panel ===== */\n    .member-row {\n      display: flex; align-items: center; gap: 14px;\n      padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px;\n      background: var(--surface); transition: all 0.15s ease;\n    }\n    .member-row + .member-row { margin-top: 8px; }\n    .member-row:hover { border-color: var(--border-strong); }\n    .member-avatar {\n      width: 40px; height: 40px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; color: #fff; font-size: 13px; flex-shrink: 0;\n    }\n    .member-info { flex: 1; min-width: 0; }\n    .member-name { font-weight: 700; font-size: 14px; }\n    .member-email { font-size: 12px; color: var(--text-muted); }\n    .member-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* ===== Notifications panel ===== */\n    .notif-table { width: 100%; }\n    .notif-table th {\n      text-align: center; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;\n      padding: 12px; border-bottom: 1px solid var(--border);\n    }\n    .notif-table th:first-child { text-align: left; }\n    .notif-table td { padding: 14px 12px; border-bottom: 1px solid var(--border); }\n    .notif-table td:not(:first-child) { text-align: center; }\n    .notif-name { font-size: 13px; font-weight: 600; }\n    .notif-desc { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* ===== Security panel ===== */\n    .sec-item {\n      display: flex; justify-content: space-between; align-items: center; gap: 20px;\n      padding: 16px 0; border-bottom: 1px solid var(--border);\n    }\n    .sec-item:last-child { border-bottom: none; }\n    .sec-item-info h4 { font-size: 14px; font-weight: 700; margin-bottom: 2px; }\n    .sec-item-info p { font-size: 12px; color: var(--text-muted); }\n    .session-row {\n      padding: 12px 16px; background: var(--surface-subtle);\n      border: 1px solid var(--border); border-radius: var(--radius);\n      display: flex; align-items: center; gap: 12px;\n    }\n    .session-row + .session-row { margin-top: 8px; }\n    .session-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--blue-pale); color: var(--blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }\n    .session-icon svg { width: 18px; height: 18px; }\n    .session-info { flex: 1; min-width: 0; }\n    .session-title { font-size: 13px; font-weight: 700; }\n    .session-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* ===== Stripe panel ===== */\n    .stripe-head {\n      display: flex; align-items: center; gap: 16px; padding: 20px;\n      background: linear-gradient(135deg, #635bff, #4f46e5);\n      border-radius: var(--radius-lg); color: #fff;\n    }\n    .stripe-logo {\n      width: 48px; height: 48px; border-radius: 12px; background: var(--surface);\n      display: flex; align-items: center; justify-content: center;\n      color: #635bff; font-weight: 800; font-size: 22px; flex-shrink: 0;\n      font-family: 'Inter', sans-serif; font-style: italic;\n    }\n    .stripe-head-info { flex: 1; }\n    .stripe-head-info h3 { font-size: 18px; font-weight: 800; margin-bottom: 4px; }\n    .stripe-head-info p { font-size: 13px; color: rgba(255,255,255,0.85); }\n\n    /* ===== Webhook row ===== */\n    .webhook-row {\n      display: flex; align-items: center; gap: 14px;\n      padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px;\n      background: var(--surface-subtle);\n    }\n    .webhook-row + .webhook-row { margin-top: 8px; }\n    .webhook-status { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }\n    .webhook-status.active { background: var(--green); box-shadow: 0 0 0 4px rgba(30,169,124,0.2); }\n    .webhook-status.failing { background: var(--red); box-shadow: 0 0 0 4px rgba(214,69,69,0.2); }\n    .webhook-url { font-family: 'JetBrains Mono', monospace; font-size: 12px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .webhook-events { font-size: 11px; color: var(--text-faint); }\n\n    /* ===== Toast animation ===== */\n    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }\n\n    /* ===== Misc ===== */\n    .divider { height: 1px; background: var(--border); margin: 20px 0; }\n    .stack { display: flex; flex-direction: column; gap: 14px; }\n    .row { display: flex; align-items: center; gap: 10px; }\n    .row-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n    .muted { color: var(--text-muted); }\n    .strong { font-weight: 700; }\n\n    .social-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }\n\n    .hr-label { display: flex; align-items: center; gap: 12px; margin: 4px 0; }\n    .hr-label::before, .hr-label::after { content: \"\"; flex: 1; height: 1px; background: var(--border); }\n    .hr-label span { font-size: 11px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }\n\n    .dot-list { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }\n    .dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }\n  ";

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
          <strong>Settings</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input id="search-input" placeholder="Search settings…" />
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
          <h1>Settings</h1>
          <p>Workspace, brand, billing, integrations — everything in one place.</p>
        </div>
      </div>

      
      <div className="settings-wrap">
        <div className="settings-grid">

          
          <nav className="sub-nav" id="sub-nav">
            <button className="sub-nav-item" data-section="workspace">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              Workspace
            </button>
            <button className="sub-nav-item" data-section="brand">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></svg>
              Brand
            </button>
            <button className="sub-nav-item active" data-section="theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="19" cy="13" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="10" cy="20" r="2.5" /><path d="M12 22a10 10 0 1 1 10-10c0 2.5-3.2 2.5-4.5 1.3" /></svg>
              Theme
            </button>
            <button className="sub-nav-item" data-section="billing">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
              Subscription
            </button>
            <button className="sub-nav-item" data-section="stripe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              Stripe Connect
            </button>
            <button className="sub-nav-item" data-section="integrations">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20.8a8 8 0 1 1 4-15M14 3.2A8 8 0 0 1 17 17" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
              Integrations
            </button>
            <button className="sub-nav-item" data-section="team">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Team
            </button>
            <button className="sub-nav-item" data-section="notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              Notifications
            </button>
            <button className="sub-nav-item" data-section="security">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Security
            </button>
            <button className="sub-nav-item" data-section="privacy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" /></svg>
              Data & Privacy
            </button>
            <button className="sub-nav-item" data-section="api">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              API & Webhooks
            </button>
          </nav>

          
          <div className="panel-col">

            
            <section className="settings-panel" data-panel="workspace">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">WORKSPACE</div>
                    <h2>Name & identity</h2>
                    <p>This is how Black Bear Rentals recognizes your workspace across dashboards, emails, and the tenant portal.</p>
                  </div>
                </div>

                <div className="field-grid">
                  <div className="field">
                    <label className="field-label">Workspace name</label>
                    <input className="field-input" value="Black Bear Rentals" />
                    <span className="field-hint">Appears in the sidebar, invoices, and emails.</span>
                  </div>
                  <div className="field">
                    <label className="field-label">Legal entity</label>
                    <input className="field-input" value="Black Bear Rentals LLC" />
                  </div>
                  <div className="field">
                    <label className="field-label">Workspace ID</label>
                    <div className="row" style={{gap: "8px"}}>
                      <code className="mono" style={{flex: "1"}}>ws_9f2a_blackbear_01</code>
                      <button className="copy-btn" data-copy="ws_9f2a_blackbear_01">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Timezone</label>
                    <select className="field-select">
                      <option>America/New_York (EST)</option>
                      <option>America/Chicago (CST)</option>
                      <option>America/Denver (MST)</option>
                      <option>America/Los_Angeles (PST)</option>
                    </select>
                  </div>
                </div>

                <div className="form-footer">
                  <button className="btn btn-ghost" data-action="cancel">Cancel</button>
                  <button className="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">DOMAINS</div>
                    <h2>Subdomain & custom domain</h2>
                    <p>Host your tenant portal and public listings on your own domain.</p>
                  </div>
                </div>

                <div className="stack">
                  <div className="domain-row">
                    <div className="domain-info">
                      <div><code>portal.rentblackbear.com</code> <span className="pill pill-green" style={{marginLeft: "6px"}}><span className="pill-dot" />Live</span></div>
                      <div className="domain-info-sub">Default workspace subdomain · SSL provisioned · tenants land here</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="manage-subdomain">Manage</button>
                  </div>
                  <div className="domain-row">
                    <div className="domain-info">
                      <div><code>pay.rentblackbear.com</code> <span className="pill pill-orange" style={{marginLeft: "6px"}}><span className="pill-dot" />DNS pending</span></div>
                      <div className="domain-info-sub">Custom tenant portal domain · add CNAME → cname.blackbear.app</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="verify-dns">Verify DNS</button>
                  </div>
                  <button className="btn btn-ghost" style={{alignSelf: "flex-start"}} data-action="add-domain">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    Add another domain
                  </button>
                </div>
              </div>

              <div className="danger-zone">
                <div>
                  <h4>Delete this workspace</h4>
                  <p>Permanently remove Black Bear Rentals, all tenants, leases, and payments. This cannot be undone.</p>
                </div>
                <button className="btn btn-danger" data-action="delete-workspace">Delete workspace</button>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="brand">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">VISUAL ASSETS</div>
                    <h2>Logo & favicon</h2>
                    <p>Used on the tenant portal, apply pages, emails, and PDF statements.</p>
                  </div>
                </div>
                <div className="upload-row">
                  <div className="upload" data-action="upload-logo">
                    <div className="upload-preview">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
                    </div>
                    <div className="upload-label">Drop logo here or click to upload</div>
                    <div className="upload-hint">PNG or SVG · transparent background · at least 512px</div>
                  </div>
                  <div className="upload" data-action="upload-favicon">
                    <div className="upload-preview small">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
                    </div>
                    <div className="upload-label">Favicon</div>
                    <div className="upload-hint">32×32 or 64×64 · ICO / PNG</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">CONTACT</div>
                    <h2>Company contact info</h2>
                    <p>Shown in the portal footer, on invoices, and auto-replies.</p>
                  </div>
                </div>
                <div className="field-grid">
                  <div className="field">
                    <label className="field-label">Company name</label>
                    <input className="field-input" value="Black Bear Rentals" />
                  </div>
                  <div className="field">
                    <label className="field-label">Tagline</label>
                    <input className="field-input" value="Short-term & long-term homes in Western NC" />
                  </div>
                  <div className="field">
                    <label className="field-label">Phone</label>
                    <input className="field-input" value="(828) 555-0142" />
                  </div>
                  <div className="field">
                    <label className="field-label">Email</label>
                    <input className="field-input" value="hello@rentblackbear.com" />
                  </div>
                  <div className="field" style={{gridColumn: "span 2"}}>
                    <label className="field-label">Mailing address</label>
                    <input className="field-input" value="14 Biltmore Ave, Asheville NC 28801" />
                  </div>
                  <div className="field" style={{gridColumn: "span 2"}}>
                    <label className="field-label">Tenant-facing footer text</label>
                    <textarea className="field-input" rows="3">© Black Bear Rentals. For maintenance emergencies after hours, call (828) 555-0142. Equal housing opportunity.</textarea>
                  </div>
                </div>

                <div className="divider" />

                <div className="adv-section-title">Social links</div>
                <div className="social-grid">
                  <div className="field-prefix-group">
                    <span className="field-prefix">instagram.com/</span>
                    <input value="rentblackbear" />
                  </div>
                  <div className="field-prefix-group">
                    <span className="field-prefix">facebook.com/</span>
                    <input value="rentblackbear" />
                  </div>
                  <div className="field-prefix-group">
                    <span className="field-prefix">tiktok.com/@</span>
                    <input value="rentblackbear" />
                  </div>
                  <div className="field-prefix-group">
                    <span className="field-prefix">https://</span>
                    <input value="rentblackbear.com" />
                  </div>
                </div>

                <div className="form-footer">
                  <button className="btn btn-ghost" data-action="cancel">Cancel</button>
                  <button className="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>
            </section>

            
            <section className="settings-panel active" data-panel="theme">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">VISUAL IDENTITY</div>
                    <h2>Pick your theme.</h2>
                    <p>One click changes every pixel — admin dashboard, tenant portal, apply page, and emails.</p>
                  </div>
                </div>

                <div className="theme-grid" id="theme-grid">
                  
                  <div className="theme-card active" data-theme="Flagship">
                    <div className="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div className="theme-preview tp-flagship">
                      <div className="tp-sidebar">
                        <div className="tp-logo" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row active" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                      </div>
                      <div className="tp-body">
                        <div className="tp-head-row"><div className="tp-title" /><div className="tp-chip" /></div>
                        <div className="tp-kpi-row">
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                        </div>
                        <div className="tp-table">
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <div className="theme-name-row">
                        <span className="theme-name">Flagship</span>
                        <span className="theme-tag">Default</span>
                      </div>
                      <div className="theme-desc">Navy + blue + pink. Premium SaaS. The default Black Bear Rentals look.</div>
                      <div className="theme-action-row">
                        <button className="theme-use-btn">Active</button>
                        <span className="theme-tag">Applied</span>
                      </div>
                    </div>
                  </div>

                  
                  <div className="theme-card" data-theme="Hearth">
                    <div className="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div className="theme-preview tp-hearth">
                      <div className="tp-sidebar">
                        <div className="tp-logo" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row active" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                      </div>
                      <div className="tp-body">
                        <div className="tp-head-row"><div className="tp-title" /><div className="tp-chip" /></div>
                        <div className="tp-kpi-row">
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                        </div>
                        <div className="tp-table">
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <div className="theme-name-row"><span className="theme-name">Hearth</span></div>
                      <div className="theme-desc">Warm gold + green on cream. For operators who want warmth, not tech.</div>
                      <div className="theme-action-row">
                        <button className="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  
                  <div className="theme-card" data-theme="Nocturne">
                    <div className="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div className="theme-preview tp-nocturne">
                      <div className="tp-sidebar">
                        <div className="tp-logo" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row active" />
                        <div className="tp-sb-row" />
                      </div>
                      <div className="tp-body">
                        <div className="tp-head-row"><div className="tp-title" /><div className="tp-chip" /></div>
                        <div className="tp-kpi-row">
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                        </div>
                        <div className="tp-table">
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <div className="theme-name-row"><span className="theme-name">Nocturne</span></div>
                      <div className="theme-desc">Full dark mode. Bright accents on black. For night-shift power users.</div>
                      <div className="theme-action-row">
                        <button className="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  
                  <div className="theme-card" data-theme="Slate">
                    <div className="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div className="theme-preview tp-slate">
                      <div className="tp-sidebar">
                        <div className="tp-logo" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row active" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                        <div className="tp-sb-row" />
                      </div>
                      <div className="tp-body">
                        <div className="tp-head-row"><div className="tp-title" /><div className="tp-chip" /></div>
                        <div className="tp-kpi-row">
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                          <div className="tp-kpi"><div className="tp-kpi-bar-sm" /><div className="tp-kpi-bar-lg" /></div>
                        </div>
                        <div className="tp-table">
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                          <div className="tp-row"><div className="tp-avatar-dot" /><div className="tp-row-line" /></div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-info">
                      <div className="theme-name-row"><span className="theme-name">Slate</span></div>
                      <div className="theme-desc">Grayscale + single accent. Minimalist. Enterprise-buyer friendly.</div>
                      <div className="theme-action-row">
                        <button className="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  
                  <div className="theme-card" data-theme="Custom">
                    <div className="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div className="theme-preview tp-custom">
                      <div className="tp-custom-icon" />
                      <div className="tp-custom-label">Build your own</div>
                    </div>
                    <div className="theme-info">
                      <div className="theme-name-row"><span className="theme-name">Custom</span></div>
                      <div className="theme-desc">Pick your own accent + font. Your brand, your way.</div>
                      <div className="theme-action-row">
                        <button className="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="advanced open" id="advanced-theme">
                <div className="advanced-head">
                  <div className="advanced-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z" /></svg>
                    Advanced theme settings
                  </div>
                  <svg className="advanced-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
                <div className="advanced-body">

                  <div className="adv-section">
                    <div className="adv-section-title">Customize current theme · Flagship</div>
                    <div className="field-grid">
                      <div className="field">
                        <label className="field-label">Accent color</label>
                        <div className="color-picker">
                          <div className="color-swatch" style={{background: "#1251AD"}}>
                            <input type="color" value="#1251AD" />
                          </div>
                          <input className="color-hex" value="#1251AD" />
                        </div>
                        <span className="field-hint">Primary CTAs, links, active states.</span>
                      </div>
                      <div className="field">
                        <label className="field-label">Secondary accent</label>
                        <div className="color-picker">
                          <div className="color-swatch" style={{background: "#FF4998"}}>
                            <input type="color" value="#FF4998" />
                          </div>
                          <input className="color-hex" value="#FF4998" />
                        </div>
                        <span className="field-hint">Badges, highlights, the "what's new" color.</span>
                      </div>
                      <div className="field">
                        <label className="field-label">Font family</label>
                        <select className="field-select">
                          <option>Inter</option>
                          <option>IBM Plex Sans</option>
                          <option>Geist</option>
                          <option>Söhne</option>
                          <option>System default</option>
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">Heading weight</label>
                        <select className="field-select">
                          <option>800 (Extra bold)</option>
                          <option>700 (Bold)</option>
                          <option>600 (Semibold)</option>
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">Border radius</label>
                        <div className="segmented" data-group="radius">
                          <button>Sharp</button>
                          <button className="active">Rounded</button>
                          <button>Pill</button>
                        </div>
                      </div>
                      <div className="field">
                        <label className="field-label">Sidebar style</label>
                        <div className="segmented" data-group="sidebar-style">
                          <button className="active">Dark</button>
                          <button>Light</button>
                          <button>Minimal</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="adv-section">
                    <div className="adv-section-title">Where this applies</div>
                    <div className="checkbox-list">
                      <div className="checkbox-row checked" data-toggle="checkbox">
                        <div className="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                        <div>
                          <div className="checkbox-label">Admin dashboard</div>
                          <div className="checkbox-sub">This app — what owners and managers see.</div>
                        </div>
                      </div>
                      <div className="checkbox-row checked" data-toggle="checkbox">
                        <div className="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                        <div>
                          <div className="checkbox-label">Tenant portal</div>
                          <div className="checkbox-sub">Where tenants pay rent and submit work orders.</div>
                        </div>
                      </div>
                      <div className="checkbox-row checked" data-toggle="checkbox">
                        <div className="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                        <div>
                          <div className="checkbox-label">Apply page</div>
                          <div className="checkbox-sub">Public rental application shared via QR code and link.</div>
                        </div>
                      </div>
                      <div className="checkbox-row" data-toggle="checkbox">
                        <div className="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                        <div>
                          <div className="checkbox-label">Public listings</div>
                          <div className="checkbox-sub">Your branded listing site (portal.rentblackbear.com/listings).</div>
                        </div>
                      </div>
                      <div className="checkbox-row checked" data-toggle="checkbox">
                        <div className="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
                        <div>
                          <div className="checkbox-label">Email templates</div>
                          <div className="checkbox-sub">Receipts, reminders, lease offers — all system emails.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button className="btn btn-ghost" data-action="reset-theme">Reset to default</button>
                    <button className="btn btn-primary" data-action="save">Save changes</button>
                  </div>
                </div>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="billing">
              <div className="sub-card">
                <div style={{position: "relative", zIndex: "1"}}>
                  <div className="sub-card-eyebrow">CURRENT PLAN</div>
                  <h3>Black Bear Rentals Pro</h3>
                  <div className="sub-price"><strong>$99</strong><span>/ month</span></div>
                  <div className="sub-locked-badge">Founders' offer · Locked for life</div>
                  <div style={{marginTop: "14px", fontSize: "12px", color: "rgba(255,255,255,0.75)"}}>
                    Up to 25 units · Unlimited applications · Stripe + Plaid · Priority support
                  </div>
                </div>
                <div className="sub-card-right">
                  <span className="pill pill-green"><span className="pill-dot" />Active</span>
                  <div style={{fontSize: "12px", color: "rgba(255,255,255,0.75)", textAlign: "right"}}>Next billing</div>
                  <div style={{fontSize: "16px", fontWeight: "800"}}>May 1, 2026</div>
                  <button className="btn btn-pink btn-sm" data-action="manage-plan" style={{marginTop: "6px"}}>Compare plans</button>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">USAGE THIS CYCLE</div>
                    <h2>Where your plan is being used.</h2>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="usage-details">Full usage report</button>
                </div>
                <div className="usage-grid">
                  <div className="usage-item">
                    <div className="usage-label">Units in portfolio</div>
                    <div className="usage-val">12 <span>/ 25</span></div>
                    <div className="usage-bar"><div className="usage-fill ok" style={{width: "48%"}} /></div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-label">SMS credits</div>
                    <div className="usage-val">234 <span>/ 500</span></div>
                    <div className="usage-bar"><div className="usage-fill" style={{width: "47%"}} /></div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-label">AI screenings</div>
                    <div className="usage-val">18 <span>/ 50</span></div>
                    <div className="usage-bar"><div className="usage-fill ok" style={{width: "36%"}} /></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">PAYMENT METHOD</div>
                    <h2>Card on file</h2>
                  </div>
                </div>
                <div className="row-between" style={{padding: "14px 16px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--surface-subtle)"}}>
                  <div className="row" style={{gap: "14px"}}>
                    <div style={{width: "42px", height: "28px", borderRadius: "5px", background: "linear-gradient(135deg, #1a1f71, #2a5298)", color: "#fff", fontWeight: "800", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center"}}>VISA</div>
                    <div>
                      <div className="strong" style={{fontSize: "13px"}}>Visa ending ••4242</div>
                      <div className="muted" style={{fontSize: "11px"}}>Expires 08 / 2028 · Harrison Cooper</div>
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn btn-ghost btn-sm" data-action="manage-payment">Manage payment method</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">HISTORY</div>
                    <h2>Past invoices</h2>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="download-all-invoices">Download all</button>
                </div>
                <table className="t-table">
                  <thead>
                    <tr><th>Date</th><th>Invoice</th><th>Amount</th><th>Status</th><th /></tr>
                  </thead>
                  <tbody>
                    <tr><td>Apr 1, 2026</td><td><code className="mono">INV-2026-0041</code></td><td>$99.00</td><td><span className="pill pill-green"><span className="pill-dot" />Paid</span></td><td style={{textAlign: "right"}}><a className="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Mar 1, 2026</td><td><code className="mono">INV-2026-0029</code></td><td>$99.00</td><td><span className="pill pill-green"><span className="pill-dot" />Paid</span></td><td style={{textAlign: "right"}}><a className="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Feb 1, 2026</td><td><code className="mono">INV-2026-0017</code></td><td>$99.00</td><td><span className="pill pill-green"><span className="pill-dot" />Paid</span></td><td style={{textAlign: "right"}}><a className="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Jan 1, 2026</td><td><code className="mono">INV-2026-0005</code></td><td>$99.00</td><td><span className="pill pill-green"><span className="pill-dot" />Paid</span></td><td style={{textAlign: "right"}}><a className="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Dec 1, 2025</td><td><code className="mono">INV-2025-0108</code></td><td>$99.00</td><td><span className="pill pill-green"><span className="pill-dot" />Paid</span></td><td style={{textAlign: "right"}}><a className="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="stripe">
              <div className="card">
                <div className="stripe-head">
                  <div className="stripe-logo">S</div>
                  <div className="stripe-head-info">
                    <h3>Stripe Connect</h3>
                    <p>Accept rent, deposits, and application fees directly to your bank account.</p>
                  </div>
                  <span className="pill pill-green" style={{background: "rgba(255,255,255,0.2)", color: "#fff"}}><span className="pill-dot" style={{background: "var(--surface)"}} />Connected</span>
                </div>

                <div className="field-grid" style={{marginTop: "20px"}}>
                  <div className="field">
                    <label className="field-label">Account email</label>
                    <input className="field-input" value="harrison@rentblackbear.com" readOnly />
                  </div>
                  <div className="field">
                    <label className="field-label">Stripe account ID</label>
                    <div className="row" style={{gap: "8px"}}>
                      <code className="mono" style={{flex: "1"}}>acct_1PqXH82fKl9mQnRp</code>
                      <button className="copy-btn" data-copy="acct_1PqXH82fKl9mQnRp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Connected since</label>
                    <input className="field-input" value="Sep 14, 2025" readOnly />
                  </div>
                  <div className="field">
                    <label className="field-label">Payout schedule</label>
                    <select className="field-select">
                      <option>Daily (2-day rolling)</option>
                      <option>Weekly — every Friday</option>
                      <option>Monthly — 1st of month</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Platform fee passthrough</label>
                    <select className="field-select">
                      <option>Split with tenant (tenant pays 2.9% + 30¢)</option>
                      <option>Absorb all fees (you pay)</option>
                      <option>Split 50/50</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">ACH via Plaid</label>
                    <div className="row" style={{gap: "10px"}}>
                      <div className="switch on" />
                      <span className="muted" style={{fontSize: "12px"}}>$0.80 per ACH transfer · tenants love it</span>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Test mode</h4>
                    <p>Route all Stripe activity to test keys. Useful when onboarding a new workflow.</p>
                  </div>
                  <div className="switch" />
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Open Stripe Dashboard</h4>
                    <p>View transactions, disputes, and payouts in Stripe's native UI.</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="open-stripe">
                    Open dashboard
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
                  </button>
                </div>
              </div>

              <div className="danger-zone">
                <div>
                  <h4>Disconnect Stripe</h4>
                  <p>Tenants won't be able to pay online. Pending payouts continue on their original schedule.</p>
                </div>
                <button className="btn btn-danger" data-action="disconnect-stripe">Disconnect</button>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="integrations">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">CONNECTED</div>
                    <h2>Running integrations</h2>
                    <p>Third-party services actively powering your workspace.</p>
                  </div>
                </div>
                <div className="integ-grid">
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#2ca01c"}}>Qb</div>
                    <div className="integ-info">
                      <div className="integ-name">QuickBooks Online <span className="pill pill-green"><span className="pill-dot" />Connected</span></div>
                      <div className="integ-desc">Two-way sync of rent, expenses, and categories. Last sync 2m ago.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#000"}}>R</div>
                    <div className="integ-info">
                      <div className="integ-name">Resend <span className="pill pill-green"><span className="pill-dot" />Connected</span></div>
                      <div className="integ-desc">Transactional email · 2,413 sent this month · 99.6% delivered.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#f22f46"}}>T</div>
                    <div className="integ-info">
                      <div className="integ-name">Twilio <span className="pill pill-green"><span className="pill-dot" />Connected</span></div>
                      <div className="integ-desc">SMS rent reminders and two-way tenant messaging. 234/500 credits used.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#635bff"}}>$</div>
                    <div className="integ-info">
                      <div className="integ-name">Stripe <span className="pill pill-green"><span className="pill-dot" />Connected</span></div>
                      <div className="integ-desc">Payments · managed in Stripe Connect tab.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                </div>

                <div className="divider" />

                <div className="eyebrow" style={{color: "var(--text-faint)"}}>AVAILABLE</div>
                <div className="integ-grid" style={{marginTop: "14px"}}>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#1a1f36"}}>P</div>
                    <div className="integ-info">
                      <div className="integ-name">Plaid <span className="pill pill-gray"><span className="pill-dot" />Disconnected</span></div>
                      <div className="integ-desc">Income verification and bank account linking for ACH rent.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-primary btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#ff4a00"}}>Z</div>
                    <div className="integ-info">
                      <div className="integ-name">Zapier</div>
                      <div className="integ-desc">Trigger 6,000+ apps from Black Bear Rentals events — new lease, late payment, etc.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#4a154b"}}>Sl</div>
                    <div className="integ-info">
                      <div className="integ-name">Slack</div>
                      <div className="integ-desc">Post new applications, work orders, and payments to a Slack channel.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#4285f4"}}>G</div>
                    <div className="integ-info">
                      <div className="integ-name">Google Calendar</div>
                      <div className="integ-desc">Sync showings, inspections, and lease expirations to Google Calendar.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#000"}}>X</div>
                    <div className="integ-info">
                      <div className="integ-name">DocuSign</div>
                      <div className="integ-desc">E-sign lease agreements and addenda with legally-binding signatures.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div className="integ-card">
                    <div className="integ-logo" style={{background: "#00a699"}}>A</div>
                    <div className="integ-info">
                      <div className="integ-name">Airbnb / VRBO</div>
                      <div className="integ-desc">Pull short-term bookings into your unified rent roll. Beta.</div>
                    </div>
                    <div className="integ-action"><button className="btn btn-ghost btn-sm" data-action="waitlist">Join beta</button></div>
                  </div>
                </div>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="team">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">WORKSPACE MEMBERS</div>
                    <h2>Who has access to Black Bear Rentals</h2>
                    <p>2 active members · 2 pending invites · Up to 5 included in your plan.</p>
                  </div>
                  <button className="btn btn-primary" data-action="invite">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    Invite member
                  </button>
                </div>

                <div className="stack">
                  <div className="member-row">
                    <div className="member-avatar" style={{background: "linear-gradient(135deg, var(--pink), var(--gold))"}}>HC</div>
                    <div className="member-info">
                      <div className="member-name">Harrison Cooper · <span className="pill pill-pink" style={{fontSize: "10px"}}>Owner</span></div>
                      <div className="member-email">harrison@rentblackbear.com</div>
                      <div className="member-meta">Joined Sep 14, 2025 · Last active 2m ago</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="member-menu">You</button>
                  </div>
                  <div className="member-row">
                    <div className="member-avatar" style={{background: "linear-gradient(135deg, var(--blue-bright), var(--purple))"}}>CC</div>
                    <div className="member-info">
                      <div className="member-name">Carolina Cooper · <span className="pill pill-blue" style={{fontSize: "10px"}}>Manager</span></div>
                      <div className="member-email">carolina@rentblackbear.com</div>
                      <div className="member-meta">Joined Oct 2, 2025 · Last active 1h ago</div>
                    </div>
                    <div className="row">
                      <select className="field-select" style={{padding: "6px 10px", fontSize: "12px"}}>
                        <option>Manager</option>
                        <option>Owner</option>
                        <option>Viewer</option>
                      </select>
                      <button className="btn btn-ghost btn-sm" data-action="remove-member">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="hr-label" style={{marginTop: "24px"}}><span>Pending invites · 2</span></div>

                <div className="stack">
                  <div className="member-row" style={{background: "var(--surface-subtle)"}}>
                    <div className="member-avatar" style={{background: "var(--border-strong)", color: "var(--text-muted)"}}>?</div>
                    <div className="member-info">
                      <div className="member-name">maintenance@rentblackbear.com · <span className="pill pill-gray" style={{fontSize: "10px"}}>Viewer</span></div>
                      <div className="member-meta">Invited 3 days ago · Expires in 4 days</div>
                    </div>
                    <div className="row">
                      <button className="btn btn-ghost btn-sm" data-action="resend-invite">Resend</button>
                      <button className="btn btn-ghost btn-sm" data-action="revoke-invite">Revoke</button>
                    </div>
                  </div>
                  <div className="member-row" style={{background: "var(--surface-subtle)"}}>
                    <div className="member-avatar" style={{background: "var(--border-strong)", color: "var(--text-muted)"}}>?</div>
                    <div className="member-info">
                      <div className="member-name">bookkeeper@rentblackbear.com · <span className="pill pill-gray" style={{fontSize: "10px"}}>Viewer</span></div>
                      <div className="member-meta">Invited 1 day ago · Expires in 6 days</div>
                    </div>
                    <div className="row">
                      <button className="btn btn-ghost btn-sm" data-action="resend-invite">Resend</button>
                      <button className="btn btn-ghost btn-sm" data-action="revoke-invite">Revoke</button>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="adv-section-title">Roles & permissions</div>
                <table className="t-table">
                  <thead>
                    <tr><th>Role</th><th>What they can do</th><th>Seats used</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span className="pill pill-pink">Owner</span></td><td>Everything — billing, delete workspace, invite team.</td><td>1</td></tr>
                    <tr><td><span className="pill pill-blue">Manager</span></td><td>Properties, tenants, leases, payments, applications. No billing.</td><td>1</td></tr>
                    <tr><td><span className="pill pill-gray">Viewer</span></td><td>Read-only access to dashboards and reports.</td><td>0</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="notifications">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">CHANNELS</div>
                    <h2>How Black Bear Rentals reaches you</h2>
                    <p>Choose which events fire an email, a text, or a push to your phone.</p>
                  </div>
                </div>

                <table className="notif-table">
                  <thead>
                    <tr><th>Event</th><th>Email</th><th>SMS</th><th>Push</th></tr>
                  </thead>
                  <tbody id="notif-body">
                    <tr>
                      <td><div className="notif-name">Rent paid</div><div className="notif-desc">A tenant completed a rent payment.</div></td>
                      <td><div className="switch on" data-notif="rent-paid-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="rent-paid-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="rent-paid-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Late payment</div><div className="notif-desc">Rent is overdue past the grace period.</div></td>
                      <td><div className="switch on" data-notif="late-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="late-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="late-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Tenant message</div><div className="notif-desc">A tenant replied in their portal.</div></td>
                      <td><div className="switch on" data-notif="msg-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="msg-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="msg-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">New application</div><div className="notif-desc">A prospect submitted a rental application.</div></td>
                      <td><div className="switch on" data-notif="app-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="app-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="app-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Lease expiring</div><div className="notif-desc">60 / 30 / 7 days before a lease ends.</div></td>
                      <td><div className="switch on" data-notif="lease-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="lease-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="lease-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Maintenance request</div><div className="notif-desc">A tenant opened a work order.</div></td>
                      <td><div className="switch on" data-notif="maint-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="maint-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="maint-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Maintenance resolved</div><div className="notif-desc">Vendor or manager marked complete.</div></td>
                      <td><div className="switch" data-notif="maintdone-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="maintdone-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch on" data-notif="maintdone-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                    <tr>
                      <td><div className="notif-name">Weekly summary</div><div className="notif-desc">Monday morning digest of the portfolio.</div></td>
                      <td><div className="switch on" data-notif="wk-email" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="wk-sms" style={{margin: "0 auto"}} /></td>
                      <td><div className="switch" data-notif="wk-push" style={{margin: "0 auto"}} /></td>
                    </tr>
                  </tbody>
                </table>

                <div className="divider" />

                <div className="adv-section-title">Delivery preferences</div>
                <div className="field-grid">
                  <div className="field">
                    <label className="field-label">Email sender</label>
                    <input className="field-input" value="Black Bear Rentals <hello@rentblackbear.com>" />
                  </div>
                  <div className="field">
                    <label className="field-label">SMS quiet hours</label>
                    <input className="field-input" value="9:00 PM — 8:00 AM local time" />
                  </div>
                </div>

                <div className="form-footer">
                  <button className="btn btn-ghost" data-action="reset-notif">Reset defaults</button>
                  <button className="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="security">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">AUTHENTICATION</div>
                    <h2>Sign-in security</h2>
                  </div>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Two-factor authentication · <span className="pill pill-green" style={{marginLeft: "4px"}}><span className="pill-dot" />Enabled</span></h4>
                    <p>Using authenticator app (1Password) · backup codes generated Jan 2026</p>
                  </div>
                  <div className="row">
                    <button className="btn btn-ghost btn-sm" data-action="regen-backup">Regenerate codes</button>
                    <button className="btn btn-ghost btn-sm" data-action="disable-2fa">Disable</button>
                  </div>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Password</h4>
                    <p>Last changed 47 days ago</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="change-password">Change password</button>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Login alerts</h4>
                    <p>Email you when a new device signs in to this workspace.</p>
                  </div>
                  <div className="switch on" />
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">ACTIVE SESSIONS · 3</div>
                    <h2>Devices currently signed in</h2>
                  </div>
                  <button className="btn btn-danger btn-sm" data-action="signout-all">Sign out all devices</button>
                </div>
                <div className="session-row">
                  <div className="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                  </div>
                  <div className="session-info">
                    <div className="session-title">MacBook Pro · Chrome <span className="pill pill-green" style={{marginLeft: "6px"}}><span className="pill-dot" />This device</span></div>
                    <div className="session-meta">Asheville, NC · 73.134.22.18 · active now</div>
                  </div>
                </div>
                <div className="session-row">
                  <div className="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="3" /><path d="M12 18h.01" /></svg>
                  </div>
                  <div className="session-info">
                    <div className="session-title">iPhone 15 Pro · Safari</div>
                    <div className="session-meta">Asheville, NC · last active 6 min ago</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="revoke-session">Revoke</button>
                </div>
                <div className="session-row">
                  <div className="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                  </div>
                  <div className="session-info">
                    <div className="session-title">iPad · Safari</div>
                    <div className="session-meta">Asheville, NC · last active 3 days ago</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="revoke-session">Revoke</button>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">AUDIT</div>
                    <h2>Access logs</h2>
                    <p>Every login, permission change, and data export — kept for 12 months.</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="view-logs">
                    View full log
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="privacy">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">YOUR DATA, YOUR CALL</div>
                    <h2>Export everything</h2>
                    <p>Every property, tenant, lease, payment, document, and message — one JSON file.</p>
                  </div>
                </div>
                <button className="btn btn-dark" data-action="export-data" style={{padding: "14px 22px", fontSize: "14px"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  Export workspace data (JSON)
                </button>
                <div className="dot-list" style={{marginTop: "10px"}}>
                  <span>Last export: Mar 22, 2026</span>
                  <span className="dot-sep" />
                  <span>24.8 MB</span>
                  <span className="dot-sep" />
                  <a className="link" href="#" data-action="download-prev">Re-download previous export</a>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">COMPLIANCE TOOLS</div>
                    <h2>GDPR / CCPA requests</h2>
                    <p>One-click workflows for tenant data requests.</p>
                  </div>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Tenant data export</h4>
                    <p>Send a specific tenant everything you hold on them. Required within 30 days under GDPR.</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="export-tenant">Start request</button>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Right to be forgotten</h4>
                    <p>Redact a former tenant's PII while preserving anonymized lease history for your books.</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" data-action="forget-tenant">Start request</button>
                </div>
                <div className="sec-item">
                  <div className="sec-item-info">
                    <h4>Cookie consent banner</h4>
                    <p>Show EU visitors a banner on your listings page and apply form.</p>
                  </div>
                  <div className="switch on" />
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">RETENTION</div>
                    <h2>How long we keep things</h2>
                  </div>
                </div>
                <div className="field-grid">
                  <div className="field">
                    <label className="field-label">Rejected applications</label>
                    <select className="field-select">
                      <option>90 days (then auto-deleted)</option>
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Former tenant records</label>
                    <select className="field-select">
                      <option>7 years (IRS-compliant)</option>
                      <option>5 years</option>
                      <option>3 years</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Message transcripts</label>
                    <select className="field-select">
                      <option>While tenancy is active + 2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Payment records</label>
                    <select className="field-select">
                      <option>7 years (tax compliance)</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>
                <div className="form-footer">
                  <button className="btn btn-primary" data-action="save">Save retention policy</button>
                </div>
              </div>
            </section>

            
            <section className="settings-panel" data-panel="api">
              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">API ACCESS</div>
                    <h2>Your API keys</h2>
                    <p>Use these to connect Black Bear Rentals to your own tools. Treat the live key like a password.</p>
                  </div>
                  <button className="btn btn-primary btn-sm" data-action="new-key">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    New key
                  </button>
                </div>

                <table className="t-table">
                  <thead>
                    <tr><th>Name</th><th>Key</th><th>Created</th><th>Last used</th><th /></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="strong">Live production</span><div className="muted" style={{fontSize: "11px"}}>Read + write · all scopes</div></td>
                      <td><code className="mono">tnt_live_••••••••UJk2</code></td>
                      <td>Sep 14, 2025</td>
                      <td>14 min ago</td>
                      <td style={{textAlign: "right"}}>
                        <button className="copy-btn" data-copy="tnt_live_sk_UJk2xxxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copy
                        </button>
                        <button className="btn btn-ghost btn-sm" data-action="rotate-key" style={{marginLeft: "4px"}}>Rotate</button>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="strong">Test key</span><div className="muted" style={{fontSize: "11px"}}>Read-only · safe for local dev</div></td>
                      <td><code className="mono">tnt_test_••••••••9Qx0</code></td>
                      <td>Jan 4, 2026</td>
                      <td>Yesterday</td>
                      <td style={{textAlign: "right"}}>
                        <button className="copy-btn" data-copy="tnt_test_sk_9Qx0xxxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copy
                        </button>
                        <button className="btn btn-ghost btn-sm" data-action="rotate-key" style={{marginLeft: "4px"}}>Rotate</button>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="strong">Zapier</span><div className="muted" style={{fontSize: "11px"}}>Write only · applications + payments</div></td>
                      <td><code className="mono">tnt_live_••••••••Zp17</code></td>
                      <td>Feb 20, 2026</td>
                      <td>2 hours ago</td>
                      <td style={{textAlign: "right"}}>
                        <button className="copy-btn" data-copy="tnt_live_zap_Zp17xxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copy
                        </button>
                        <button className="btn btn-ghost btn-sm" data-action="rotate-key" style={{marginLeft: "4px"}}>Revoke</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <div className="eyebrow">WEBHOOKS</div>
                    <h2>Outbound endpoints</h2>
                    <p>Black Bear Rentals will POST to these URLs whenever a subscribed event happens.</p>
                  </div>
                  <button className="btn btn-primary btn-sm" data-action="add-webhook">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    Add webhook
                  </button>
                </div>

                <div className="stack">
                  <div className="webhook-row">
                    <div className="webhook-status active" />
                    <div style={{flex: "1", minWidth: "0"}}>
                      <div className="webhook-url">https://hooks.rentblackbear.com/blackbear</div>
                      <div className="webhook-events">payment.succeeded, payment.failed, lease.signed · 1,204 deliveries · 100% success</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                  <div className="webhook-row">
                    <div className="webhook-status active" />
                    <div style={{flex: "1", minWidth: "0"}}>
                      <div className="webhook-url">https://hooks.zapier.com/hooks/catch/8821/application.submitted</div>
                      <div className="webhook-events">application.submitted · 47 deliveries · 98% success</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                  <div className="webhook-row">
                    <div className="webhook-status failing" />
                    <div style={{flex: "1", minWidth: "0"}}>
                      <div className="webhook-url">https://n8n.internal.rentblackbear.com/hook/maintenance</div>
                      <div className="webhook-events">maintenance.created · 12 deliveries · 3 failing · last error: 504 Gateway Timeout</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                </div>

                <div className="divider" />

                <div className="adv-section-title">Signing secret</div>
                <div className="row" style={{gap: "10px"}}>
                  <code className="mono" style={{flex: "1"}}>whsec_e8f4a21c49••••••••••••d7b22f91</code>
                  <button className="copy-btn" data-copy="whsec_e8f4a21c49xxxxxxxxxxxxd7b22f91">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    Copy
                  </button>
                  <button className="btn btn-ghost btn-sm" data-action="rotate-secret">Rotate secret</button>
                </div>
                <div className="field-hint" style={{marginTop: "6px"}}>Verify this on your side using HMAC-SHA256 of the raw request body.</div>
              </div>
            </section>

          </div>
        </div>
      </div>

    </main>
  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "100", display: "flex", flexDirection: "column", gap: "8px"}} />

  

    </>
  );
}
