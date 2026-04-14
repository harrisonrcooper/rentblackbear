"use client";

// Mock ported from ~/Desktop/tenantory/reports.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --gold-bg: rgba(245,166,35,0.14);\n      --gold-dark: #b87a15;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 320px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Scroll area ===== */\n    .scroll { flex: 1; overflow-y: auto; padding-bottom: 40px; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item { border-right: 1px solid var(--border); padding-right: 24px; }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n    .stat-pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n      background: var(--green-bg); color: var(--green-dark);\n    }\n    .stat-pill svg { width: 10px; height: 10px; }\n\n    /* ===== Date range bar ===== */\n    .range-bar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;\n    }\n    .range-chip {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .range-chip:hover { border-color: var(--blue); color: var(--blue); }\n    .range-chip svg { width: 13px; height: 13px; opacity: 0.7; }\n    .range-chip.accent { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }\n    .range-chip .chip-sep { color: var(--text-faint); font-weight: 500; font-size: 11px; }\n    .range-reset {\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      padding: 4px 8px; border-radius: 6px;\n      transition: all 0.15s ease;\n    }\n    .range-reset:hover { color: var(--blue); background: var(--blue-pale); }\n\n    /* ===== Tax Pack callout ===== */\n    .tax-pack {\n      margin: 20px 28px 0;\n      border-radius: var(--radius-lg);\n      padding: 24px 28px;\n      background:\n        radial-gradient(120% 140% at 0% 0%, rgba(255,73,152,0.12) 0%, rgba(255,73,152,0) 50%),\n        radial-gradient(120% 140% at 100% 100%, rgba(18,81,173,0.08) 0%, rgba(18,81,173,0) 55%),\n        linear-gradient(180deg, #fff 0%, #fff 100%);\n      border: 1px solid var(--pink-strong);\n      box-shadow: 0 4px 20px rgba(255,73,152,0.08);\n      display: flex; align-items: center; gap: 28px; flex-wrap: wrap;\n      position: relative; overflow: hidden;\n    }\n    .tax-pack::before {\n      content: \"\"; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;\n      background: linear-gradient(180deg, var(--pink), var(--blue));\n    }\n    .tax-pack-icon {\n      width: 56px; height: 56px; border-radius: 16px;\n      background: linear-gradient(135deg, var(--pink), var(--blue));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; box-shadow: 0 8px 20px rgba(255,73,152,0.25);\n    }\n    .tax-pack-icon svg { width: 26px; height: 26px; }\n    .tax-pack-text { flex: 1; min-width: 280px; }\n    .tax-pack-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 10px; font-weight: 800;\n      color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 8px;\n    }\n    .tax-pack-eyebrow::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }\n    .tax-pack h3 {\n      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;\n      margin-bottom: 6px; color: var(--text);\n    }\n    .tax-pack-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; }\n    .tax-pack-actions { display: flex; gap: 10px; align-items: center; }\n    .tax-pack-actions .btn-pink svg { width: 14px; height: 14px; }\n\n    /* ===== Section heads ===== */\n    .section-head {\n      margin: 28px 28px 14px;\n      display: flex; align-items: baseline; justify-content: space-between;\n      gap: 12px;\n    }\n    .section-head h2 {\n      font-size: 11px; font-weight: 800;\n      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em;\n    }\n    .section-head .section-meta {\n      font-size: 12px; color: var(--text-faint);\n    }\n\n    /* ===== Reports grid ===== */\n    .reports-grid {\n      margin: 0 28px;\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 14px;\n    }\n    @media (max-width: 1280px) { .reports-grid { grid-template-columns: repeat(2, 1fr); } }\n    @media (max-width: 860px) { .reports-grid { grid-template-columns: 1fr; } }\n\n    .report-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px;\n      display: flex; flex-direction: column; gap: 14px;\n      cursor: pointer; transition: all 0.15s ease;\n      position: relative; overflow: hidden;\n    }\n    .report-card:hover {\n      border-color: var(--blue);\n      box-shadow: var(--shadow);\n      transform: translateY(-2px);\n    }\n    .report-card.selected {\n      border-color: var(--pink);\n      box-shadow: 0 0 0 3px rgba(255,73,152,0.15);\n    }\n    .report-card-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 12px;\n    }\n    .report-chip {\n      width: 40px; height: 40px; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .report-chip svg { width: 18px; height: 18px; }\n    .report-chip.blue { background: var(--blue-pale); color: var(--blue); }\n    .report-chip.green { background: var(--green-bg); color: var(--green-dark); }\n    .report-chip.pink { background: var(--pink-bg); color: var(--pink); }\n    .report-chip.gold { background: var(--gold-bg); color: var(--gold-dark); }\n    .report-chip.orange { background: var(--orange-bg); color: var(--orange); }\n\n    .report-tag {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 9px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .report-tag.alert { background: var(--orange-bg); color: var(--orange); }\n    .report-tag.info { background: var(--blue-pale); color: var(--blue); }\n    .report-tag svg { width: 10px; height: 10px; }\n\n    .report-card-body { flex: 1; }\n    .report-title {\n      font-size: 15px; font-weight: 600; color: var(--text);\n      letter-spacing: -0.01em; margin-bottom: 4px;\n    }\n    .report-desc {\n      font-size: 12.5px; color: var(--text-muted); line-height: 1.5;\n    }\n    .report-card-foot {\n      display: flex; align-items: center; justify-content: space-between;\n      padding-top: 14px; border-top: 1px solid var(--border);\n      gap: 10px;\n    }\n    .report-time {\n      display: inline-flex; align-items: center; gap: 5px;\n      font-size: 11px; color: var(--text-faint); font-weight: 500;\n    }\n    .report-time svg { width: 11px; height: 11px; }\n    .report-gen-btn {\n      padding: 6px 12px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 12px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .report-gen-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }\n    .report-gen-btn svg { width: 12px; height: 12px; }\n\n    /* ===== Recent reports table ===== */\n    .recent-wrap {\n      margin: 10px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .recent-head {\n      padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;\n      border-bottom: 1px solid var(--border);\n    }\n    .recent-head h3 { font-size: 14px; font-weight: 700; }\n    .recent-head-actions { display: flex; gap: 8px; }\n    .recent-table { width: 100%; border-collapse: collapse; }\n    .recent-table thead th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em;\n      padding: 12px 20px; background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n    }\n    .recent-table tbody td {\n      padding: 14px 20px; font-size: 13px; color: var(--text);\n      border-bottom: 1px solid var(--border); vertical-align: middle;\n    }\n    .recent-table tbody tr:last-child td { border-bottom: none; }\n    .recent-table tbody tr { transition: background 0.15s ease; }\n    .recent-table tbody tr:hover { background: var(--surface-subtle); }\n    .recent-name {\n      display: flex; align-items: center; gap: 10px;\n      font-weight: 600;\n    }\n    .recent-name-chip {\n      width: 28px; height: 28px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .recent-name-chip svg { width: 13px; height: 13px; }\n    .recent-by { display: flex; align-items: center; gap: 8px; color: var(--text-muted); }\n    .recent-avatar {\n      width: 24px; height: 24px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      color: #fff; font-size: 10px; font-weight: 800;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .recent-format {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 9px; border-radius: 6px;\n      font-size: 10px; font-weight: 700;\n      background: var(--surface-alt); color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.04em;\n    }\n    .recent-format.pdf { background: var(--pink-bg); color: var(--pink); }\n    .recent-format.csv { background: var(--green-bg); color: var(--green-dark); }\n    .recent-format.xlsx { background: var(--blue-pale); color: var(--blue); }\n    .recent-format.zip { background: var(--gold-bg); color: var(--gold-dark); }\n    .recent-actions { display: flex; gap: 4px; justify-content: flex-end; }\n    .recent-action {\n      padding: 5px 10px; border-radius: 6px;\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 4px;\n      transition: all 0.15s ease;\n    }\n    .recent-action:hover { background: var(--blue-pale); color: var(--blue); }\n    .recent-action svg { width: 12px; height: 12px; }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n      display: none;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 560px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: none; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 18px 22px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 16px;\n    }\n    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }\n    .drawer-head-chip {\n      width: 48px; height: 48px; border-radius: 12px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .drawer-head-chip svg { width: 22px; height: 22px; }\n    .drawer-head-info h2 {\n      font-size: 18px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.2;\n    }\n    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 22px; }\n    .drawer-section { margin-bottom: 22px; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;\n    }\n\n    /* Quick configure */\n    .cfg-row {\n      display: grid; grid-template-columns: 1fr 1fr;\n      gap: 10px; margin-bottom: 10px;\n    }\n    .cfg-field label {\n      display: block; font-size: 11px; font-weight: 600;\n      color: var(--text-muted); margin-bottom: 5px;\n    }\n    .cfg-input, .cfg-select {\n      width: 100%; padding: 9px 12px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; font-size: 13px; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .cfg-input:focus, .cfg-select:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.1); }\n    .cfg-select { appearance: none; -webkit-appearance: none;\n      background-image: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;\n      padding-right: 32px;\n    }\n\n    .prop-chips { display: flex; flex-wrap: wrap; gap: 6px; }\n    .prop-chip {\n      padding: 6px 11px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .prop-chip:hover { border-color: var(--blue); color: var(--blue); }\n    .prop-chip.on { border-color: var(--blue); background: var(--blue-pale); color: var(--blue); }\n    .prop-chip svg { width: 10px; height: 10px; }\n\n    /* Preview area */\n    .preview-wrap {\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      padding: 18px;\n    }\n    .preview-doc-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      padding-bottom: 12px; border-bottom: 2px solid var(--border);\n      margin-bottom: 12px;\n    }\n    .preview-doc-title {\n      font-size: 14px; font-weight: 800; letter-spacing: -0.01em;\n      color: var(--text);\n    }\n    .preview-doc-sub {\n      font-size: 11px; color: var(--text-muted); margin-top: 2px;\n    }\n    .preview-doc-brand {\n      font-size: 10px; font-weight: 700; color: var(--blue);\n      text-transform: uppercase; letter-spacing: 0.1em;\n    }\n    .preview-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }\n    .preview-table thead th {\n      text-align: left; font-size: 9.5px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;\n      padding: 6px 4px; border-bottom: 1px solid var(--border);\n    }\n    .preview-table thead th.num { text-align: right; }\n    .preview-table tbody td {\n      padding: 6px 4px; border-bottom: 1px solid var(--border);\n      font-variant-numeric: tabular-nums;\n    }\n    .preview-table tbody td.num { text-align: right; }\n    .preview-table tbody td.emph { font-weight: 600; }\n    .preview-table tfoot td {\n      padding: 8px 4px; font-weight: 800;\n      border-top: 2px solid var(--text); font-size: 12px;\n    }\n    .preview-table tfoot td.num { text-align: right; }\n    .preview-total-row td { background: var(--blue-pale); color: var(--blue); }\n\n    .preview-kv {\n      display: grid; grid-template-columns: 1fr auto;\n      padding: 6px 0; font-size: 12px;\n      border-bottom: 1px dotted var(--border);\n    }\n    .preview-kv:last-child { border-bottom: none; }\n    .preview-kv span:first-child { color: var(--text-muted); }\n    .preview-kv span:last-child { font-weight: 600; font-variant-numeric: tabular-nums; }\n    .preview-kv.total {\n      padding: 10px 0 4px;\n      border-top: 2px solid var(--text); margin-top: 6px;\n      border-bottom: none; font-size: 14px;\n    }\n    .preview-kv.total span:first-child { color: var(--text); font-weight: 700; }\n    .preview-kv.total span:last-child { color: var(--green-dark); font-weight: 800; }\n    .preview-kv.neg span:last-child { color: var(--red); }\n\n    .preview-chart {\n      height: 120px; margin: 12px 0;\n      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;\n      padding: 12px;\n    }\n\n    .preview-badges { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }\n    .preview-badge {\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 10px; font-weight: 700;\n      background: var(--green-bg); color: var(--green-dark);\n      display: inline-flex; align-items: center; gap: 4px;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .preview-badge svg { width: 10px; height: 10px; }\n    .preview-badge.info { background: var(--blue-pale); color: var(--blue); }\n    .preview-badge.warn { background: var(--orange-bg); color: var(--orange); }\n\n    .preview-footer-note {\n      margin-top: 12px; padding-top: 10px;\n      border-top: 1px dashed var(--border);\n      font-size: 10.5px; color: var(--text-faint);\n      display: flex; justify-content: space-between;\n    }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 14px 22px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: none; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n    .bulk-tip {\n      color: rgba(255,255,255,0.55); font-size: 11px;\n      margin-left: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.12);\n    }\n\n    /* Responsive */\n    @media (max-width: 1200px) {\n      .drawer { width: 480px; }\n      .stats-strip { grid-template-columns: repeat(3, 1fr); }\n      .stats-strip .stat-item:nth-child(3n) { border-right: none; padding-right: 0; }\n    }\n\n    @keyframes slideIn {\n      from { opacity: 0; transform: translateX(20px); }\n      to { opacity: 1; transform: translateX(0); }\n    }\n  ";

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
          <strong>Reports</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search reports, exports..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      <div className="scroll">

        
        <div className="page-head-bar">
          <div>
            <h1>Reports</h1>
            <p>Banker-ready financials, tax exports, investor packets — generated in seconds</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" id="btn-schedule">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              Schedule report
            </button>
            <button className="btn btn-ghost" id="btn-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
              Custom report
            </button>
            <button className="btn btn-primary" id="btn-generate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Generate now
            </button>
          </div>
        </div>

        
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-label">Reports this month</div>
            <div className="stat-value">12 <span className="stat-delta up">+4</span></div>
            <div className="stat-sub">vs. 8 last month</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">YTD income</div>
            <div className="stat-value">$298,400 <span className="stat-delta up">+14%</span></div>
            <div className="stat-sub">Jan 1 — Apr 13</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">YTD expenses</div>
            <div className="stat-value">$156,020</div>
            <div className="stat-sub">Op + CapEx + Debt</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Net operating income</div>
            <div className="stat-value">$142,380 <span className="stat-delta up">47.6% margin</span></div>
            <div className="stat-sub">Above target 42%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Schedule E ready</div>
            <div className="stat-value">
              <span className="stat-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                Yes
              </span>
            </div>
            <div className="stat-sub">Last sync 2 min ago</div>
          </div>
        </div>

        
        <div className="range-bar">
          <button className="range-chip accent" id="chip-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            <span id="chip-date-label">April 2026</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button className="range-chip" id="chip-props">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>
            <span id="chip-props-label">All properties</span>
            <span className="chip-sep">· 4</span>
          </button>
          <button className="range-chip" id="chip-basis">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            <span id="chip-basis-label">Cash basis</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>
          </button>
          <button className="range-reset" id="btn-reset">Reset filters</button>
        </div>

        
        <div className="tax-pack">
          <div className="tax-pack-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6M9 9h2" /></svg>
          </div>
          <div className="tax-pack-text">
            <div className="tax-pack-eyebrow">Tax Season · 2025 Return</div>
            <h3>Your 2025 tax package is ready.</h3>
            <div className="tax-pack-sub">Schedule E for all 4 properties · 1099-NEC for all vendors · Mortgage interest summary · Depreciation schedule</div>
          </div>
          <div className="tax-pack-actions">
            <button className="btn btn-ghost" id="btn-taxzip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download as ZIP
            </button>
            <button className="btn btn-pink" id="btn-taxpack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
              Generate full tax pack
            </button>
          </div>
        </div>

        
        <div className="section-head">
          <h2>Financial</h2>
          <span className="section-meta">4 reports · updated live from ledger</span>
        </div>
        <div className="reports-grid" id="grid-financial">

          <div className="report-card" data-report="pl">
            <div className="report-card-head">
              <div className="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">P&amp;L by Property</div>
              <div className="report-desc">Income, expenses, NOI per address</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 2d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="cashflow">
            <div className="report-card-head">
              <div className="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h10" /><path d="M17 15l4 3-4 3" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Cash Flow Statement</div>
              <div className="report-desc">Operating, investing, financing</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 5d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="ar">
            <div className="report-card-head">
              <div className="report-chip orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
              </div>
              <span className="report-tag alert">$1,725 due</span>
            </div>
            <div className="report-card-body">
              <div className="report-title">A/R Aging Report</div>
              <div className="report-desc">30/60/90+ day buckets</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 1d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="rentroll">
            <div className="report-card-head">
              <div className="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Rent Roll PDF</div>
              <div className="report-desc">Banker-formatted, all units, all leases</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 3d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        
        <div className="section-head">
          <h2>Tax &amp; Compliance</h2>
          <span className="section-meta">Schedule E synced 2 min ago</span>
        </div>
        <div className="reports-grid">

          <div className="report-card" data-report="schedulee">
            <div className="report-card-head">
              <div className="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Schedule E Export</div>
              <div className="report-desc">Form 1040 Schedule E ready, per property</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 2m ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="1099">
            <div className="report-card-head">
              <div className="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">1099 Vendor Report</div>
              <div className="report-desc">Auto-flagged contractors, total payments</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 4d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="mortgage">
            <div className="report-card-head">
              <div className="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M12 13v4M10 15h4" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Mortgage Interest Summary</div>
              <div className="report-desc">Form 1098 prep</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 12d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="yearend">
            <div className="report-card-head">
              <div className="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7 9 18l-5-5" /><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
              </div>
              <span className="report-tag info">12mo YTD</span>
            </div>
            <div className="report-card-body">
              <div className="report-title">Year-End Tax Package</div>
              <div className="report-desc">Bundle: Schedule E + 1099 + Mortgage + Depreciation</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Never run
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        
        <div className="section-head">
          <h2>Operational</h2>
          <span className="section-meta">Portfolio-wide operations insight</span>
        </div>
        <div className="reports-grid">

          <div className="report-card" data-report="maint">
            <div className="report-card-head">
              <div className="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Maintenance Cost Report</div>
              <div className="report-desc">Per property, per vendor, per category</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 6d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="vacancy">
            <div className="report-card-head">
              <div className="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Vacancy Report</div>
              <div className="report-desc">Days vacant per unit, lost income</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 9d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="turnover">
            <div className="report-card-head">
              <div className="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Tenant Turnover Report</div>
              <div className="report-desc">Move-ins, move-outs, retention rate</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 14d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        
        <div className="section-head">
          <h2>Investor</h2>
          <span className="section-meta">Portfolio performance &amp; capital markets</span>
        </div>
        <div className="reports-grid">

          <div className="report-card" data-report="lender">
            <div className="report-card-head">
              <div className="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h6M9 16h6" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Lender Packet</div>
              <div className="report-desc">DSCR, LTV, NOI, cash-on-cash for refinance</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 22d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="investor">
            <div className="report-card-head">
              <div className="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Investor Update</div>
              <div className="report-desc">Quarterly performance brief</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run Q4 2025
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="compare">
            <div className="report-card-head">
              <div className="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18" /><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">Period Comparison</div>
              <div className="report-desc">Compare any 2 time ranges side-by-side</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 30d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

          <div className="report-card" data-report="forecast">
            <div className="report-card-head">
              <div className="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>
              </div>
            </div>
            <div className="report-card-body">
              <div className="report-title">90-Day Forecast</div>
              <div className="report-desc">Projected income, vacancies, expenses</div>
            </div>
            <div className="report-card-foot">
              <span className="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Last run 7d ago
              </span>
              <button className="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        
        <div className="section-head">
          <h2>Recent reports</h2>
          <span className="section-meta">Last 30 days · 8 generated</span>
        </div>
        <div className="recent-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th style={{width: "40%"}}>Report</th>
                <th>Generated</th>
                <th>By</th>
                <th>Format</th>
                <th style={{textAlign: "right"}}>Actions</th>
              </tr>
            </thead>
            <tbody id="recent-tbody">
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip blue" style={{background: "var(--blue-pale)", color: "var(--blue)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
                    </div>
                    March P&amp;L by Property
                  </div>
                </td>
                <td>Apr 1, 2026 · 8:12 am</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format pdf">PDF</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--green-bg)", color: "var(--green-dark)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    </div>
                    Schedule E Export — 2025
                  </div>
                </td>
                <td>Apr 1, 2026 · 7:50 am</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format xlsx">XLSX</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--blue-pale)", color: "var(--blue)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
                    </div>
                    Rent Roll — All Properties
                  </div>
                </td>
                <td>Mar 29, 2026 · 2:40 pm</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format pdf">PDF</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--gold-bg)", color: "var(--gold-dark)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13" /></svg>
                    </div>
                    Lender Packet — 142 Birch Refi
                  </div>
                </td>
                <td>Mar 22, 2026 · 11:15 am</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format zip">ZIP</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--orange-bg)", color: "var(--orange)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
                    </div>
                    A/R Aging — March 30
                  </div>
                </td>
                <td>Mar 20, 2026 · 9:01 am</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format csv">CSV</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--green-bg)", color: "var(--green-dark)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    </div>
                    1099-NEC Vendor Report — 2025
                  </div>
                </td>
                <td>Mar 15, 2026 · 4:22 pm</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format pdf">PDF</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--pink-bg)", color: "var(--pink)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" /></svg>
                    </div>
                    Maintenance Cost — Q1 2026
                  </div>
                </td>
                <td>Mar 10, 2026 · 11:48 am</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format xlsx">XLSX</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="recent-name">
                    <div className="recent-name-chip" style={{background: "var(--gold-bg)", color: "var(--gold-dark)"}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    Investor Update — Q1 2026
                  </div>
                </td>
                <td>Mar 4, 2026 · 3:15 pm</td>
                <td><div className="recent-by"><div className="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span className="recent-format pdf">PDF</span></td>
                <td>
                  <div className="recent-actions">
                    <button className="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download</button>
                    <button className="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>Resend</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      
      <div className="drawer-backdrop" />
      <aside className="drawer">
        <div className="drawer-head">
          <div className="drawer-head-left">
            <div className="drawer-head-chip report-chip blue" id="drawer-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
            </div>
            <div className="drawer-head-info">
              <h2 id="drawer-title">Report</h2>
              <p id="drawer-sub">—</p>
            </div>
          </div>
          <button className="drawer-close" id="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="drawer-body" id="drawer-body" />

        <div className="drawer-foot">
          <button className="btn btn-ghost" id="drw-schedule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            Schedule recurring
          </button>
          <button className="btn btn-dark" id="drw-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Email to
          </button>
          <button className="btn btn-primary" id="drw-generate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Generate now
          </button>
        </div>
      </aside>

      
      <div className="bulk-bar">
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <span className="bulk-count">0</span>
          <span>reports selected</span>
        </div>
        <div className="bulk-bar-actions">
          <button className="bulk-btn" data-bulk="Generate all selected">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            Generate all selected
          </button>
          <button className="bulk-btn" data-bulk="Download as ZIP">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download as ZIP
          </button>
          <button className="bulk-btn primary" data-bulk="Email pack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Email pack
          </button>
        </div>
        <span className="bulk-tip">Cmd-click to select</span>
      </div>

    </main>
  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "100", display: "flex", flexDirection: "column", gap: "8px"}} />

  

    </>
  );
}
