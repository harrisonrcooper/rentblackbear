"use client";

// Mock ported from ~/Desktop/tenantory/admin-v2.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name {\n      font-weight: 800; font-size: 18px; color: #fff;\n      letter-spacing: -0.02em;\n    }\n    .sb-brand-ws {\n      font-size: 11px; color: rgba(255,255,255,0.5);\n      font-weight: 500; margin-top: 2px;\n    }\n\n    .sb-section {\n      padding: 16px 12px;\n      flex: 1; overflow-y: auto;\n    }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover {\n      background: rgba(255,255,255,0.06);\n      color: #fff;\n    }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    .sb-user {\n      padding: 16px 12px;\n      border-top: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    /* Topbar */\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 32px; }\n\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 32px; flex-wrap: wrap;\n    }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 4px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== KPI cards row ===== */\n    .kpi-row {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      gap: 16px; margin-bottom: 24px;\n    }\n    .kpi-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n      transition: all 0.15s ease;\n    }\n    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }\n    .kpi-card-head {\n      display: flex; align-items: center; justify-content: space-between;\n      margin-bottom: 14px;\n    }\n    .kpi-card-label {\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .kpi-card-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .kpi-card-icon svg { width: 16px; height: 16px; }\n    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }\n    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }\n    .kpi-card-icon.pink { background: var(--pink-bg); color: var(--pink); }\n    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .kpi-card-value {\n      font-size: 30px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n    }\n    .kpi-card-delta {\n      font-size: 12px; font-weight: 600; margin-top: 6px;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .kpi-card-delta.up { color: var(--green-dark); }\n    .kpi-card-delta.down { color: var(--red); }\n    .kpi-card-delta.neutral { color: var(--text-muted); }\n    .kpi-card-delta svg { width: 12px; height: 12px; }\n    .kpi-card-sparkline {\n      margin-top: 10px; display: flex; align-items: flex-end; gap: 3px; height: 28px;\n    }\n    .kpi-bar {\n      flex: 1; background: var(--blue-pale); border-radius: 2px;\n    }\n\n    /* ===== Two-column layout ===== */\n    .two-col {\n      display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;\n    }\n\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .card-head {\n      padding: 18px 20px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .card-head h3 {\n      font-size: 15px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em;\n    }\n    .card-head-actions { display: flex; gap: 8px; align-items: center; }\n    .card-head-link {\n      font-size: 13px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .card-head-link:hover { color: var(--navy); }\n    .card-head-link svg { width: 14px; height: 14px; }\n\n    .card-tabs {\n      display: flex; gap: 0; border-bottom: 1px solid var(--border);\n      padding: 0 20px;\n    }\n    .card-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .card-tab:hover { color: var(--text); }\n    .card-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n\n    /* ===== Table ===== */\n    .table { width: 100%; }\n    .table-row {\n      display: grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 100px;\n      gap: 16px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      transition: background 0.15s ease;\n    }\n    .table-row:last-child { border-bottom: none; }\n    .table-row:hover:not(.table-row-head) { background: var(--surface-subtle); }\n    .table-row-head {\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .table-tenant {\n      display: flex; align-items: center; gap: 10px;\n    }\n    .table-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 11px; flex-shrink: 0;\n    }\n    .table-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .table-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .table-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .table-tenant-name { font-weight: 600; color: var(--text); }\n    .table-tenant-meta { font-size: 12px; color: var(--text-faint); }\n    .table-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 600; padding: 3px 9px;\n      border-radius: 100px; white-space: nowrap;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill svg { width: 10px; height: 10px; }\n\n    .table-action {\n      display: flex; justify-content: flex-end; gap: 4px;\n    }\n    .icon-btn {\n      width: 28px; height: 28px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); transition: all 0.15s ease;\n    }\n    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    /* ===== Activity feed ===== */\n    .activity { padding: 8px 0; }\n    .activity-item {\n      display: flex; gap: 12px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n    }\n    .activity-item:last-child { border-bottom: none; }\n    .activity-dot {\n      width: 32px; height: 32px; border-radius: 50%;\n      flex-shrink: 0; display: flex; align-items: center; justify-content: center;\n    }\n    .activity-dot.green { background: var(--green-bg); color: var(--green-dark); }\n    .activity-dot.blue { background: var(--blue-pale); color: var(--blue); }\n    .activity-dot.pink { background: var(--pink-bg); color: var(--pink); }\n    .activity-dot.orange { background: var(--orange-bg); color: var(--orange); }\n    .activity-dot svg { width: 14px; height: 14px; }\n    .activity-body { flex: 1; font-size: 13px; }\n    .activity-body strong { color: var(--text); font-weight: 600; }\n    .activity-body p { color: var(--text-muted); }\n    .activity-time { font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n\n    /* ===== Maintenance ===== */\n    .maint-item {\n      padding: 14px 20px; border-bottom: 1px solid var(--border);\n    }\n    .maint-item:last-child { border-bottom: none; }\n    .maint-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      margin-bottom: 6px; gap: 10px;\n    }\n    .maint-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .maint-meta { font-size: 12px; color: var(--text-muted); }\n    .maint-bar {\n      margin-top: 10px; display: flex; gap: 6px; align-items: center;\n      font-size: 11px; color: var(--text-faint);\n    }\n\n    /* ===== Bottom row ===== */\n    .bottom-row {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;\n    }\n    .chart-card { padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }\n    .chart-card-head {\n      display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;\n    }\n    .chart-card-head h4 { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }\n    .chart-card-value { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 4px; }\n    .chart-card-delta { font-size: 12px; font-weight: 600; }\n    .chart-card-delta.up { color: var(--green-dark); }\n    .chart-bars {\n      margin-top: 16px; height: 56px;\n      display: flex; align-items: flex-end; gap: 4px;\n    }\n    .chart-bar { flex: 1; background: var(--blue-pale); border-radius: 3px 3px 0 0; }\n    .chart-bar.active { background: var(--blue); }\n\n    /* ===== Founders banner ===== */\n    .founders-banner {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);\n      border-radius: var(--radius-lg); padding: 20px 24px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 20px; margin-bottom: 24px; color: #fff;\n      position: relative; overflow: hidden;\n    }\n    .founders-banner::after {\n      content: \"\"; position: absolute; right: -40px; top: -40px;\n      width: 180px; height: 180px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .founders-banner-text { position: relative; z-index: 1; }\n    .founders-banner-label {\n      display: inline-block; background: rgba(255,73,152,0.2); color: #fff;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.14em;\n      text-transform: uppercase; margin-bottom: 6px;\n    }\n    .founders-banner h3 { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 2px; letter-spacing: -0.01em; }\n    .founders-banner p { color: rgba(255,255,255,0.8); font-size: 13px; }\n    .founders-banner .btn {\n      position: relative; z-index: 1;\n      background: var(--surface); color: var(--navy); font-weight: 700;\n    }\n    .founders-banner .btn:hover { background: #f0f4ff; transform: translateY(-1px); }\n\n  ";

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
          <a className="sb-nav-item active" href="admin-v2.html">
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
          <strong>Dashboard</strong>
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

        
        <div className="page-head">
          <div>
            <h1>Good morning, Harrison.</h1>
            <p>Here's what's happening across your portfolio today — Monday, April 13.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Export
            </button>
            <button className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              New application
            </button>
          </div>
        </div>

        
        <div className="founders-banner">
          <div className="founders-banner-text">
            <span className="founders-banner-label">Founders' Offer</span>
            <h3>You're Founder #13 of 100.</h3>
            <p>$99/mo locked for life. Your bonuses include data migration, onboarding call, and state-specific lease template.</p>
          </div>
          <a href="#" className="btn">View my bonuses</a>
        </div>

        
        <div className="kpi-row">

          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Collected this month</div>
              <div className="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">$24,850</div>
            <div className="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
              +12% MoM
            </div>
            <div className="kpi-card-sparkline">
              <div className="kpi-bar" style={{height: "30%"}} />
              <div className="kpi-bar" style={{height: "45%"}} />
              <div className="kpi-bar" style={{height: "40%"}} />
              <div className="kpi-bar" style={{height: "60%"}} />
              <div className="kpi-bar" style={{height: "70%"}} />
              <div className="kpi-bar" style={{height: "85%", background: "var(--green)"}} />
              <div className="kpi-bar" style={{height: "95%", background: "var(--green-dark)"}} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Occupancy</div>
              <div className="kpi-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21V12h6v9" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">96%</div>
            <div className="kpi-card-delta neutral">22 of 23 rooms occupied</div>
            <div className="kpi-card-sparkline">
              <div className="kpi-bar" style={{height: "60%"}} />
              <div className="kpi-bar" style={{height: "70%"}} />
              <div className="kpi-bar" style={{height: "80%"}} />
              <div className="kpi-bar" style={{height: "75%"}} />
              <div className="kpi-bar" style={{height: "90%"}} />
              <div className="kpi-bar" style={{height: "95%", background: "var(--blue)"}} />
              <div className="kpi-bar" style={{height: "96%", background: "var(--navy)"}} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Open tickets</div>
              <div className="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">5</div>
            <div className="kpi-card-delta" style={{color: "var(--orange)"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
              1 urgent, 2 in progress
            </div>
            <div className="kpi-card-sparkline">
              <div className="kpi-bar" style={{height: "20%"}} />
              <div className="kpi-bar" style={{height: "30%"}} />
              <div className="kpi-bar" style={{height: "50%"}} />
              <div className="kpi-bar" style={{height: "40%"}} />
              <div className="kpi-bar" style={{height: "55%"}} />
              <div className="kpi-bar" style={{height: "35%"}} />
              <div className="kpi-bar" style={{height: "50%", background: "var(--orange)"}} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Time saved this week</div>
              <div className="kpi-card-icon pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">13h</div>
            <div className="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
              Automations ran 47×
            </div>
            <div className="kpi-card-sparkline">
              <div className="kpi-bar" style={{height: "50%"}} />
              <div className="kpi-bar" style={{height: "60%"}} />
              <div className="kpi-bar" style={{height: "65%"}} />
              <div className="kpi-bar" style={{height: "80%"}} />
              <div className="kpi-bar" style={{height: "70%"}} />
              <div className="kpi-bar" style={{height: "90%"}} />
              <div className="kpi-bar" style={{height: "100%", background: "var(--pink)"}} />
            </div>
          </div>

        </div>

        
        <div className="two-col">

          <div className="card">
            <div className="card-head">
              <h3>April rent roll</h3>
              <div className="card-head-actions">
                <a href="#" className="card-head-link">View all
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </a>
              </div>
            </div>
            <div className="card-tabs">
              <div className="card-tab active">All (23)</div>
              <div className="card-tab">Paid (19)</div>
              <div className="card-tab">Late (2)</div>
              <div className="card-tab">Upcoming (2)</div>
            </div>
            <div className="table">
              <div className="table-row table-row-head">
                <span>Tenant</span>
                <span>Unit</span>
                <span>Due</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="table-row">
                <div className="table-tenant">
                  <div className="table-avatar">SC</div>
                  <div>
                    <div className="table-tenant-name">Sarah Chen</div>
                    <div className="table-tenant-meta">Lease thru Aug 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room A</div>
                <div>Apr 1</div>
                <div className="table-amount">$850</div>
                <div><span className="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              </div>
              <div className="table-row">
                <div className="table-tenant">
                  <div className="table-avatar pink">ML</div>
                  <div>
                    <div className="table-tenant-name">Marcus Lee</div>
                    <div className="table-tenant-meta">Lease thru Dec 31, 2026</div>
                  </div>
                </div>
                <div>2907 Wilson</div>
                <div>Apr 1</div>
                <div className="table-amount">$1,450</div>
                <div><span className="pill pill-blue">Autopay</span></div>
              </div>
              <div className="table-row">
                <div className="table-tenant">
                  <div className="table-avatar green">PP</div>
                  <div>
                    <div className="table-tenant-name">Priya Patel</div>
                    <div className="table-tenant-meta">Lease thru Jul 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room B</div>
                <div>Apr 1</div>
                <div className="table-amount">$875</div>
                <div><span className="pill pill-red">2d late</span></div>
              </div>
              <div className="table-row">
                <div className="table-tenant">
                  <div className="table-avatar orange">JB</div>
                  <div>
                    <div className="table-tenant-name">Jordan Brooks</div>
                    <div className="table-tenant-meta">Lease thru Oct 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room C</div>
                <div>Apr 1</div>
                <div className="table-amount">$900</div>
                <div><span className="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              </div>
              <div className="table-row">
                <div className="table-tenant">
                  <div className="table-avatar">KW</div>
                  <div>
                    <div className="table-tenant-name">Kai Wong</div>
                    <div className="table-tenant-meta">Lease thru Jun 30, 2026</div>
                  </div>
                </div>
                <div>1523 Oak Ave</div>
                <div>Apr 5</div>
                <div className="table-amount">$1,350</div>
                <div><span className="pill pill-orange">Upcoming</span></div>
              </div>
            </div>
          </div>

          
          <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>

            <div className="card">
              <div className="card-head">
                <h3>Recent activity</h3>
              </div>
              <div className="activity">
                <div className="activity-item">
                  <div className="activity-dot green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <div className="activity-body">
                    <p><strong>Jordan Brooks</strong> paid April rent</p>
                    <div className="activity-time">12 min ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot pink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  </div>
                  <div className="activity-body">
                    <p><strong>New application</strong> for 2909 Wilson, Room D</p>
                    <div className="activity-time">1h ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  </div>
                  <div className="activity-body">
                    <p>Autopay ran for <strong>8 tenants</strong> overnight</p>
                    <div className="activity-time">8h ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                  </div>
                  <div className="activity-body">
                    <p><strong>Leaky faucet</strong> ticket opened by Priya Patel</p>
                    <div className="activity-time">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Maintenance queue</h3>
                <a href="#" className="card-head-link">See all
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </a>
              </div>
              <div>
                <div className="maint-item">
                  <div className="maint-head">
                    <div className="maint-title">Leaky faucet</div>
                    <span className="pill pill-red">Urgent</span>
                  </div>
                  <div className="maint-meta">2909 Wilson, Room B · Assigned to Joe's Plumbing</div>
                  <div className="maint-bar">
                    <span className="pill pill-blue">$180 est.</span>
                    <span>· Scheduled Apr 14</span>
                  </div>
                </div>
                <div className="maint-item">
                  <div className="maint-head">
                    <div className="maint-title">Garage door spring</div>
                    <span className="pill pill-orange">In progress</span>
                  </div>
                  <div className="maint-meta">1523 Oak Ave · Acme Garage Co.</div>
                </div>
                <div className="maint-item">
                  <div className="maint-head">
                    <div className="maint-title">HVAC filter replacement</div>
                    <span className="pill pill-gray">Scheduled</span>
                  </div>
                  <div className="maint-meta">2907 Wilson · May 1 preventive</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        
        <div className="bottom-row">
          <div className="chart-card">
            <div className="chart-card-head">
              <h4>NOI · YTD</h4>
              <span className="pill pill-green">+14%</span>
            </div>
            <div className="chart-card-value">$142,380</div>
            <div className="chart-card-delta up">47.6% margin</div>
            <div className="chart-bars">
              <div className="chart-bar" style={{height: "40%"}} />
              <div className="chart-bar" style={{height: "55%"}} />
              <div className="chart-bar" style={{height: "70%"}} />
              <div className="chart-bar" style={{height: "60%"}} />
              <div className="chart-bar" style={{height: "80%"}} />
              <div className="chart-bar" style={{height: "75%"}} />
              <div className="chart-bar" style={{height: "90%"}} />
              <div className="chart-bar" style={{height: "95%"}} />
              <div className="chart-bar active" style={{height: "100%"}} />
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-card-head">
              <h4>A/R Aging · 30/60/90+</h4>
              <span className="pill pill-gray">3 tenants</span>
            </div>
            <div className="chart-card-value">$1,724</div>
            <div className="chart-card-delta" style={{color: "var(--text-muted)"}}>Outstanding receivables</div>
            <div className="chart-bars">
              <div className="chart-bar" style={{height: "70%", background: "rgba(30,169,124,0.3)"}} />
              <div className="chart-bar" style={{height: "45%", background: "rgba(234,140,58,0.5)"}} />
              <div className="chart-bar" style={{height: "20%", background: "rgba(214,69,69,0.7)"}} />
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-card-head">
              <h4>Applications pipeline</h4>
              <span className="pill pill-pink">New</span>
            </div>
            <div className="chart-card-value">7</div>
            <div className="chart-card-delta up">3 approved · 2 screening · 2 waitlist</div>
            <div className="chart-bars">
              <div className="chart-bar active" style={{height: "70%"}} />
              <div className="chart-bar" style={{height: "50%"}} />
              <div className="chart-bar" style={{height: "50%"}} />
            </div>
          </div>
        </div>

      </div>
    </main>

  </div>


    </>
  );
}
