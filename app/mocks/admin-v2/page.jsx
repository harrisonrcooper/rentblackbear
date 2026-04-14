"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-v2.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text);
      background: var(--surface-alt);
      line-height: 1.5;
      font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    img, svg { display: block; max-width: 100%; }
    input { font-family: inherit; font-size: inherit; }

    :root {
      --navy: #2F3E83;
      --navy-dark: #1e2a5e;
      --navy-darker: #14204a;
      --blue: #1251AD;
      --blue-bright: #1665D8;
      --blue-pale: #eef3ff;
      --pink: #FF4998;
      --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36;
      --text-muted: #5a6478;
      --text-faint: #8a93a5;
      --surface: #ffffff;
      --surface-alt: #f7f9fc;
      --surface-subtle: #fafbfd;
      --border: #e3e8ef;
      --border-strong: #c9d1dd;
      --gold: #f5a623;
      --green: #1ea97c;
      --green-dark: #138a60;
      --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --red-bg: rgba(214,69,69,0.12);
      --orange: #ea8c3a;
      --orange-bg: rgba(234,140,58,0.12);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
    }

    /* ===== Layout shell ===== */
    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar ===== */
    .sidebar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.75);
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sb-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(18,81,173,0.3);
    }
    .sb-logo svg { width: 18px; height: 18px; color: #fff; }
    .sb-brand-name {
      font-weight: 800; font-size: 18px; color: #fff;
      letter-spacing: -0.02em;
    }
    .sb-brand-ws {
      font-size: 11px; color: rgba(255,255,255,0.5);
      font-weight: 500; margin-top: 2px;
    }

    .sb-section {
      padding: 16px 12px;
      flex: 1; overflow-y: auto;
    }
    .sb-section-label {
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.14em;
      padding: 8px 12px 10px;
    }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      color: rgba(255,255,255,0.75);
      transition: all 0.15s ease;
      position: relative;
    }
    .sb-nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: #fff;
    }
    .sb-nav-item.active {
      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));
      color: #fff;
    }
    .sb-nav-item.active::before {
      content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px;
      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;
    }
    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }
    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }
    .sb-nav-badge {
      margin-left: auto; background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 100px;
    }
    .sb-nav-count {
      margin-left: auto; background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      font-size: 11px; font-weight: 600;
      padding: 2px 7px; border-radius: 100px;
    }

    .sb-user {
      padding: 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .sb-user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .sb-user-card:hover { background: rgba(255,255,255,0.08); }
    .sb-user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 12px;
    }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }
    .sb-user-action { color: rgba(255,255,255,0.5); }

    /* ===== Main ===== */
    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }

    /* Topbar */
    .topbar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; flex-shrink: 0;
    }
    .topbar-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-muted);
    }
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px;
      min-width: 280px; color: var(--text-faint);
      transition: all 0.15s ease;
    }
    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 13px; color: var(--text);
    }
    .topbar-search kbd {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; background: var(--surface); border: 1px solid var(--border);
      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);
    }
    .topbar-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; position: relative;
    }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot {
      position: absolute; top: 7px; right: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--pink); border: 2px solid #fff;
    }

    /* Content */
    .content { flex: 1; overflow-y: auto; padding: 32px; }

    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 32px; flex-wrap: wrap;
    }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 4px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== KPI cards row ===== */
    .kpi-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 16px; margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      transition: all 0.15s ease;
    }
    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }
    .kpi-card-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .kpi-card-label {
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .kpi-card-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .kpi-card-icon svg { width: 16px; height: 16px; }
    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }
    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }
    .kpi-card-icon.pink { background: var(--pink-bg); color: var(--pink); }
    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .kpi-card-value {
      font-size: 30px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.1;
    }
    .kpi-card-delta {
      font-size: 12px; font-weight: 600; margin-top: 6px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .kpi-card-delta.up { color: var(--green-dark); }
    .kpi-card-delta.down { color: var(--red); }
    .kpi-card-delta.neutral { color: var(--text-muted); }
    .kpi-card-delta svg { width: 12px; height: 12px; }
    .kpi-card-sparkline {
      margin-top: 10px; display: flex; align-items: flex-end; gap: 3px; height: 28px;
    }
    .kpi-bar {
      flex: 1; background: var(--blue-pale); border-radius: 2px;
    }

    /* ===== Two-column layout ===== */
    .two-col {
      display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;
    }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .card-head {
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .card-head h3 {
      font-size: 15px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em;
    }
    .card-head-actions { display: flex; gap: 8px; align-items: center; }
    .card-head-link {
      font-size: 13px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .card-head-link:hover { color: var(--navy); }
    .card-head-link svg { width: 14px; height: 14px; }

    .card-tabs {
      display: flex; gap: 0; border-bottom: 1px solid var(--border);
      padding: 0 20px;
    }
    .card-tab {
      padding: 12px 14px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; cursor: pointer;
    }
    .card-tab:hover { color: var(--text); }
    .card-tab.active { color: var(--blue); border-bottom-color: var(--blue); }

    /* ===== Table ===== */
    .table { width: 100%; }
    .table-row {
      display: grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 100px;
      gap: 16px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      transition: background 0.15s ease;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover:not(.table-row-head) { background: var(--surface-subtle); }
    .table-row-head {
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .table-tenant {
      display: flex; align-items: center; gap: 10px;
    }
    .table-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 11px; flex-shrink: 0;
    }
    .table-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .table-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .table-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .table-tenant-name { font-weight: 600; color: var(--text); }
    .table-tenant-meta { font-size: 12px; color: var(--text-faint); }
    .table-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 3px 9px;
      border-radius: 100px; white-space: nowrap;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill svg { width: 10px; height: 10px; }

    .table-action {
      display: flex; justify-content: flex-end; gap: 4px;
    }
    .icon-btn {
      width: 28px; height: 28px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }
    .icon-btn svg { width: 14px; height: 14px; }

    /* ===== Activity feed ===== */
    .activity { padding: 8px 0; }
    .activity-item {
      display: flex; gap: 12px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
    }
    .activity-item:last-child { border-bottom: none; }
    .activity-dot {
      width: 32px; height: 32px; border-radius: 50%;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }
    .activity-dot.green { background: var(--green-bg); color: var(--green-dark); }
    .activity-dot.blue { background: var(--blue-pale); color: var(--blue); }
    .activity-dot.pink { background: var(--pink-bg); color: var(--pink); }
    .activity-dot.orange { background: var(--orange-bg); color: var(--orange); }
    .activity-dot svg { width: 14px; height: 14px; }
    .activity-body { flex: 1; font-size: 13px; }
    .activity-body strong { color: var(--text); font-weight: 600; }
    .activity-body p { color: var(--text-muted); }
    .activity-time { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* ===== Maintenance ===== */
    .maint-item {
      padding: 14px 20px; border-bottom: 1px solid var(--border);
    }
    .maint-item:last-child { border-bottom: none; }
    .maint-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 6px; gap: 10px;
    }
    .maint-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .maint-meta { font-size: 12px; color: var(--text-muted); }
    .maint-bar {
      margin-top: 10px; display: flex; gap: 6px; align-items: center;
      font-size: 11px; color: var(--text-faint);
    }

    /* ===== Bottom row ===== */
    .bottom-row {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    }
    .chart-card { padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
    .chart-card-head {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    }
    .chart-card-head h4 { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .chart-card-value { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 4px; }
    .chart-card-delta { font-size: 12px; font-weight: 600; }
    .chart-card-delta.up { color: var(--green-dark); }
    .chart-bars {
      margin-top: 16px; height: 56px;
      display: flex; align-items: flex-end; gap: 4px;
    }
    .chart-bar { flex: 1; background: var(--blue-pale); border-radius: 3px 3px 0 0; }
    .chart-bar.active { background: var(--blue); }

    /* ===== Founders banner ===== */
    .founders-banner {
      background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
      border-radius: var(--radius-lg); padding: 20px 24px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; margin-bottom: 24px; color: #fff;
      position: relative; overflow: hidden;
    }
    .founders-banner::after {
      content: ""; position: absolute; right: -40px; top: -40px;
      width: 180px; height: 180px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .founders-banner-text { position: relative; z-index: 1; }
    .founders-banner-label {
      display: inline-block; background: rgba(255,73,152,0.2); color: #fff;
      padding: 3px 10px; border-radius: 100px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.14em;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .founders-banner h3 { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 2px; letter-spacing: -0.01em; }
    .founders-banner p { color: rgba(255,255,255,0.8); font-size: 13px; }
    .founders-banner .btn {
      position: relative; z-index: 1;
      background: var(--surface); color: var(--navy); font-weight: 700;
    }
    .founders-banner .btn:hover { background: #f0f4ff; transform: translateY(-1px); }`;

const MOCK_HTML = `<div class="app">

    <!-- ===== SIDEBAR ===== -->
    <aside class="sidebar">
      <div class="sb-brand">
        <div class="sb-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </div>
        <div>
          <div class="sb-brand-name">Tenantory</div>
          <div class="sb-brand-ws">Black Bear Rentals</div>
        </div>
      </div>

      <div class="sb-section">
        <div class="sb-section-label">Overview</div>
        <div class="sb-nav">
          <a class="sb-nav-item active" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>Dashboard
          </a>
          <a class="sb-nav-item" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>Properties
            <span class="sb-nav-count">4</span>
          </a>
          <a class="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Tenants
            <span class="sb-nav-count">12</span>
          </a>
          <a class="sb-nav-item" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 14h6M9 18h6"/></svg>Leases
          </a>
          <a class="sb-nav-item" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>Applications
            <span class="sb-nav-badge">3</span>
          </a>
        </div>

        <div class="sb-section-label" style="margin-top: 20px;">Operations</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Payments
          </a>
          <a class="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1"/></svg>Maintenance
            <span class="sb-nav-count">5</span>
          </a>
          <a class="sb-nav-item" href="reports.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>Reports
          </a>
          <a class="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>Vendors
          </a>
        </div>

        <div class="sb-section-label" style="margin-top: 20px;">Workspace</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5"/></svg>Settings
          </a>
          <a class="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>Documents
          </a>
        </div>
      </div>

      <div class="sb-user">
        <div class="sb-user-card">
          <div class="sb-user-avatar">HC</div>
          <div class="sb-user-info">
            <div class="sb-user-name">Harrison Cooper</div>
            <div class="sb-user-email">harrison@rentblackbear.com</div>
          </div>
          <div class="sb-user-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </aside>

    <!-- ===== MAIN ===== -->
    <main class="main">

      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Dashboard</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, leases, invoices…">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Quick add
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="content">

        <!-- Page header -->
        <div class="page-head">
          <div>
            <h1>Good morning, Harrison.</h1>
            <p>Here's what's happening across your portfolio today — Monday, April 13.</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export
            </button>
            <button class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              New application
            </button>
          </div>
        </div>

        <!-- Founders banner -->
        <div class="founders-banner">
          <div class="founders-banner-text">
            <span class="founders-banner-label">Founders' Offer</span>
            <h3>You're Founder #13 of 100.</h3>
            <p>$99/mo locked for life. Your bonuses include data migration, onboarding call, and state-specific lease template.</p>
          </div>
          <a href="#" class="btn">View my bonuses</a>
        </div>

        <!-- KPI row -->
        <div class="kpi-row">

          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Collected this month</div>
              <div class="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">$24,850</div>
            <div class="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              +12% MoM
            </div>
            <div class="kpi-card-sparkline">
              <div class="kpi-bar" style="height:30%;"></div>
              <div class="kpi-bar" style="height:45%;"></div>
              <div class="kpi-bar" style="height:40%;"></div>
              <div class="kpi-bar" style="height:60%;"></div>
              <div class="kpi-bar" style="height:70%;"></div>
              <div class="kpi-bar" style="height:85%; background: var(--green);"></div>
              <div class="kpi-bar" style="height:95%; background: var(--green-dark);"></div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Occupancy</div>
              <div class="kpi-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21V12h6v9"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">96%</div>
            <div class="kpi-card-delta neutral">22 of 23 rooms occupied</div>
            <div class="kpi-card-sparkline">
              <div class="kpi-bar" style="height:60%;"></div>
              <div class="kpi-bar" style="height:70%;"></div>
              <div class="kpi-bar" style="height:80%;"></div>
              <div class="kpi-bar" style="height:75%;"></div>
              <div class="kpi-bar" style="height:90%;"></div>
              <div class="kpi-bar" style="height:95%; background: var(--blue);"></div>
              <div class="kpi-bar" style="height:96%; background: var(--navy);"></div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Open tickets</div>
              <div class="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">5</div>
            <div class="kpi-card-delta" style="color: var(--orange);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              1 urgent, 2 in progress
            </div>
            <div class="kpi-card-sparkline">
              <div class="kpi-bar" style="height:20%;"></div>
              <div class="kpi-bar" style="height:30%;"></div>
              <div class="kpi-bar" style="height:50%;"></div>
              <div class="kpi-bar" style="height:40%;"></div>
              <div class="kpi-bar" style="height:55%;"></div>
              <div class="kpi-bar" style="height:35%;"></div>
              <div class="kpi-bar" style="height:50%; background: var(--orange);"></div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Time saved this week</div>
              <div class="kpi-card-icon pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">13h</div>
            <div class="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              Automations ran 47×
            </div>
            <div class="kpi-card-sparkline">
              <div class="kpi-bar" style="height:50%;"></div>
              <div class="kpi-bar" style="height:60%;"></div>
              <div class="kpi-bar" style="height:65%;"></div>
              <div class="kpi-bar" style="height:80%;"></div>
              <div class="kpi-bar" style="height:70%;"></div>
              <div class="kpi-bar" style="height:90%;"></div>
              <div class="kpi-bar" style="height:100%; background: var(--pink);"></div>
            </div>
          </div>

        </div>

        <!-- Two-col: Rent roll + sidebar -->
        <div class="two-col">

          <div class="card">
            <div class="card-head">
              <h3>April rent roll</h3>
              <div class="card-head-actions">
                <a href="#" class="card-head-link">View all
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
            </div>
            <div class="card-tabs">
              <div class="card-tab active">All (23)</div>
              <div class="card-tab">Paid (19)</div>
              <div class="card-tab">Late (2)</div>
              <div class="card-tab">Upcoming (2)</div>
            </div>
            <div class="table">
              <div class="table-row table-row-head">
                <span>Tenant</span>
                <span>Unit</span>
                <span>Due</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div class="table-row">
                <div class="table-tenant">
                  <div class="table-avatar">SC</div>
                  <div>
                    <div class="table-tenant-name">Sarah Chen</div>
                    <div class="table-tenant-meta">Lease thru Aug 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room A</div>
                <div>Apr 1</div>
                <div class="table-amount">$850</div>
                <div><span class="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Paid</span></div>
              </div>
              <div class="table-row">
                <div class="table-tenant">
                  <div class="table-avatar pink">ML</div>
                  <div>
                    <div class="table-tenant-name">Marcus Lee</div>
                    <div class="table-tenant-meta">Lease thru Dec 31, 2026</div>
                  </div>
                </div>
                <div>2907 Wilson</div>
                <div>Apr 1</div>
                <div class="table-amount">$1,450</div>
                <div><span class="pill pill-blue">Autopay</span></div>
              </div>
              <div class="table-row">
                <div class="table-tenant">
                  <div class="table-avatar green">PP</div>
                  <div>
                    <div class="table-tenant-name">Priya Patel</div>
                    <div class="table-tenant-meta">Lease thru Jul 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room B</div>
                <div>Apr 1</div>
                <div class="table-amount">$875</div>
                <div><span class="pill pill-red">2d late</span></div>
              </div>
              <div class="table-row">
                <div class="table-tenant">
                  <div class="table-avatar orange">JB</div>
                  <div>
                    <div class="table-tenant-name">Jordan Brooks</div>
                    <div class="table-tenant-meta">Lease thru Oct 31, 2026</div>
                  </div>
                </div>
                <div>2909 Wilson, Room C</div>
                <div>Apr 1</div>
                <div class="table-amount">$900</div>
                <div><span class="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Paid</span></div>
              </div>
              <div class="table-row">
                <div class="table-tenant">
                  <div class="table-avatar">KW</div>
                  <div>
                    <div class="table-tenant-name">Kai Wong</div>
                    <div class="table-tenant-meta">Lease thru Jun 30, 2026</div>
                  </div>
                </div>
                <div>1523 Oak Ave</div>
                <div>Apr 5</div>
                <div class="table-amount">$1,350</div>
                <div><span class="pill pill-orange">Upcoming</span></div>
              </div>
            </div>
          </div>

          <!-- Right column: stacked -->
          <div style="display: flex; flex-direction: column; gap: 20px;">

            <div class="card">
              <div class="card-head">
                <h3>Recent activity</h3>
              </div>
              <div class="activity">
                <div class="activity-item">
                  <div class="activity-dot green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div class="activity-body">
                    <p><strong>Jordan Brooks</strong> paid April rent</p>
                    <div class="activity-time">12 min ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-dot pink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                  </div>
                  <div class="activity-body">
                    <p><strong>New application</strong> for 2909 Wilson, Room D</p>
                    <div class="activity-time">1h ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-dot blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div class="activity-body">
                    <p>Autopay ran for <strong>8 tenants</strong> overnight</p>
                    <div class="activity-time">8h ago</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-dot orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div class="activity-body">
                    <p><strong>Leaky faucet</strong> ticket opened by Priya Patel</p>
                    <div class="activity-time">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-head">
                <h3>Maintenance queue</h3>
                <a href="#" class="card-head-link">See all
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
              <div>
                <div class="maint-item">
                  <div class="maint-head">
                    <div class="maint-title">Leaky faucet</div>
                    <span class="pill pill-red">Urgent</span>
                  </div>
                  <div class="maint-meta">2909 Wilson, Room B · Assigned to Joe's Plumbing</div>
                  <div class="maint-bar">
                    <span class="pill pill-blue">$180 est.</span>
                    <span>· Scheduled Apr 14</span>
                  </div>
                </div>
                <div class="maint-item">
                  <div class="maint-head">
                    <div class="maint-title">Garage door spring</div>
                    <span class="pill pill-orange">In progress</span>
                  </div>
                  <div class="maint-meta">1523 Oak Ave · Acme Garage Co.</div>
                </div>
                <div class="maint-item">
                  <div class="maint-head">
                    <div class="maint-title">HVAC filter replacement</div>
                    <span class="pill pill-gray">Scheduled</span>
                  </div>
                  <div class="maint-meta">2907 Wilson · May 1 preventive</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Bottom row: 3 chart cards -->
        <div class="bottom-row">
          <div class="chart-card">
            <div class="chart-card-head">
              <h4>NOI · YTD</h4>
              <span class="pill pill-green">+14%</span>
            </div>
            <div class="chart-card-value">$142,380</div>
            <div class="chart-card-delta up">47.6% margin</div>
            <div class="chart-bars">
              <div class="chart-bar" style="height: 40%;"></div>
              <div class="chart-bar" style="height: 55%;"></div>
              <div class="chart-bar" style="height: 70%;"></div>
              <div class="chart-bar" style="height: 60%;"></div>
              <div class="chart-bar" style="height: 80%;"></div>
              <div class="chart-bar" style="height: 75%;"></div>
              <div class="chart-bar" style="height: 90%;"></div>
              <div class="chart-bar" style="height: 95%;"></div>
              <div class="chart-bar active" style="height: 100%;"></div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-card-head">
              <h4>A/R Aging · 30/60/90+</h4>
              <span class="pill pill-gray">3 tenants</span>
            </div>
            <div class="chart-card-value">$1,724</div>
            <div class="chart-card-delta" style="color: var(--text-muted);">Outstanding receivables</div>
            <div class="chart-bars">
              <div class="chart-bar" style="height: 70%; background: rgba(30,169,124,0.3);"></div>
              <div class="chart-bar" style="height: 45%; background: rgba(234,140,58,0.5);"></div>
              <div class="chart-bar" style="height: 20%; background: rgba(214,69,69,0.7);"></div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-card-head">
              <h4>Applications pipeline</h4>
              <span class="pill pill-pink">New</span>
            </div>
            <div class="chart-card-value">7</div>
            <div class="chart-card-delta up">3 approved · 2 screening · 2 waitlist</div>
            <div class="chart-bars">
              <div class="chart-bar active" style="height: 70%;"></div>
              <div class="chart-bar" style="height: 50%;"></div>
              <div class="chart-bar" style="height: 50%;"></div>
            </div>
          </div>
        </div>

      </div>
    </main>

  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
