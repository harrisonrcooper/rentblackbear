"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tenants.html.
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
      --pink-strong: rgba(255,73,152,0.22);
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
      --purple: #7c4dff;
      --purple-bg: rgba(124,77,255,0.12);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);
    }

    /* ===== Theme overrides (data-theme switches) ===== */
    [data-theme="hearth"] {
      --navy: #8a6a1f;
      --navy-dark: #6b4f12;
      --navy-darker: #4a3608;
      --blue: #c88318;
      --blue-bright: #f5a623;
      --blue-pale: #fdf0d4;
      --pink: #1ea97c;
      --pink-bg: rgba(30,169,124,0.12);
      --pink-strong: rgba(30,169,124,0.22);
      --text: #3a2e14;
      --text-muted: #6b5830;
      --text-faint: #9b8558;
      --surface: #ffffff;
      --surface-alt: #fdf6e8;
      --surface-subtle: #fbf3e0;
      --border: #ecdbb5;
      --border-strong: #d4bd87;
    }
    [data-theme="nocturne"] {
      --navy: #000000;
      --navy-dark: #000000;
      --navy-darker: #000000;
      --blue: #00e5ff;
      --blue-bright: #00e5ff;
      --blue-pale: rgba(0,229,255,0.12);
      --pink: #ff00aa;
      --pink-bg: rgba(255,0,170,0.15);
      --pink-strong: rgba(255,0,170,0.28);
      --text: #e8e8ff;
      --text-muted: #a8a8c8;
      --text-faint: #6868aa;
      --surface: #12121e;
      --surface-alt: #0a0a12;
      --surface-subtle: #1a1a2e;
      --border: #2a2a3a;
      --border-strong: #3a3a4a;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
      --shadow: 0 4px 16px rgba(0,0,0,0.5);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
    }
    [data-theme="slate"] {
      --navy: #2a2a2e;
      --navy-dark: #1a1a1e;
      --navy-darker: #0e0e12;
      --blue: #2c6fe0;
      --blue-bright: #4a8af0;
      --blue-pale: #edf3fc;
      --pink: #2c6fe0;
      --pink-bg: rgba(44,111,224,0.1);
      --pink-strong: rgba(44,111,224,0.22);
      --text: #1a1a1a;
      --text-muted: #5a5a60;
      --text-faint: #8a8a92;
      --surface: #ffffff;
      --surface-alt: #fafafa;
      --surface-subtle: #f5f5f7;
      --border: #e3e3e6;
      --border-strong: #c0c0c8;
    }


    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar (shared with admin) ===== */
    .sidebar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.75);
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }
    .sb-logo svg { width: 18px; height: 18px; color: #fff; }
    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }
    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }
    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }
    .sb-nav-item.active::before { content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }
    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }
    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }
    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }
    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }
    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }
    .sb-user-card:hover { background: rgba(255,255,255,0.08); }
    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }

    /* ===== Main ===== */
    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }

    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 28px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; flex-shrink: 0;
    }
    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-right { display: flex; align-items: center; gap: 10px; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px;
      min-width: 280px; color: var(--text-faint);
    }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }
    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }

    /* ===== Page head ===== */
    .page-head-bar {
      padding: 20px 28px 0;
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 20px; flex-wrap: wrap;
    }
    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .page-head-bar p { color: var(--text-muted); font-size: 14px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-dark { background: var(--navy); color: #fff; }
    .btn-dark:hover { background: var(--navy-dark); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Stats strip ===== */
    .stats-strip {
      margin: 16px 28px 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 24px;
      display: grid; grid-template-columns: repeat(5, 1fr);
      gap: 24px; align-items: center;
    }
    .stat-item {
      border-right: 1px solid var(--border); padding-right: 24px;
    }
    .stat-item:last-child { border-right: none; padding-right: 0; }
    .stat-label {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
    }
    .stat-value {
      font-size: 24px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.1;
      display: flex; align-items: baseline; gap: 8px;
    }
    .stat-delta { font-size: 11px; font-weight: 700; }
    .stat-delta.up { color: var(--green-dark); }
    .stat-delta.pink { color: var(--pink); }
    .stat-delta.orange { color: var(--orange); }
    .stat-delta.gray { color: var(--text-faint); }
    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

    /* ===== View toolbar ===== */
    .toolbar {
      margin: 16px 28px 0;
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; flex-wrap: wrap;
    }
    .saved-views {
      display: flex; gap: 4px; flex-wrap: wrap;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 100px; padding: 4px;
    }
    .saved-view {
      padding: 7px 14px; border-radius: 100px;
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s ease; cursor: pointer;
    }
    .saved-view:hover { color: var(--text); }
    .saved-view.active { background: var(--navy); color: #fff; }
    .saved-view-count {
      background: var(--surface-alt); color: var(--text-muted);
      padding: 1px 7px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
    }
    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }
    .saved-view-dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--pink);
    }

    .toolbar-right { display: flex; gap: 10px; align-items: center; }
    .filter-btn {
      padding: 8px 14px; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 13px; font-weight: 600; color: var(--text);
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s ease;
    }
    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }
    .filter-btn svg { width: 14px; height: 14px; }

    .view-toggle {
      display: flex; background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 2px;
    }
    .view-toggle button {
      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s ease;
    }
    .view-toggle button svg { width: 14px; height: 14px; }
    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }

    /* ===== Tenants table ===== */
    .table-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }
    .tenants-table-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .tenants-table {
      width: 100%; border-collapse: collapse; font-size: 13px;
    }
    .tenants-table thead th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em;
      padding: 14px 18px; border-bottom: 1px solid var(--border);
      background: var(--surface-subtle); white-space: nowrap;
    }
    .tenants-table tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s ease;
      cursor: pointer;
    }
    .tenants-table tbody tr:last-child { border-bottom: none; }
    .tenants-table tbody tr:hover { background: var(--surface-subtle); }
    .tenants-table tbody tr.selected {
      outline: 2px solid var(--pink);
      outline-offset: -2px;
      background: var(--pink-bg);
    }
    .tenants-table tbody tr.active-row {
      background: var(--blue-pale);
    }
    .tenants-table td {
      padding: 14px 18px; vertical-align: middle;
    }

    .tenant-cell {
      display: flex; align-items: center; gap: 12px;
    }
    .tenant-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; color: var(--blue);
      background: var(--blue-pale); flex-shrink: 0;
    }
    .tenant-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .tenant-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .tenant-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .tenant-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .tenant-avatar.gold { background: rgba(245,166,35,0.12); color: var(--gold); }
    .tenant-name { font-weight: 700; font-size: 13.5px; color: var(--text); line-height: 1.2; }
    .tenant-email { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    .cell-property { color: var(--text); font-weight: 500; }
    .cell-property small { display: block; color: var(--text-faint); font-weight: 500; font-size: 11px; margin-top: 2px; }

    .cell-balance { font-variant-numeric: tabular-nums; font-weight: 700; }
    .cell-balance.zero { color: var(--green-dark); }
    .cell-balance.owed { color: var(--red); }

    .pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      white-space: nowrap;
    }
    .pill::before {
      content: ""; width: 6px; height: 6px; border-radius: 50%;
      background: currentColor;
    }
    .pill.green { background: var(--green-bg); color: var(--green-dark); }
    .pill.blue { background: var(--blue-pale); color: var(--blue); }
    .pill.red { background: var(--red-bg); color: var(--red); }
    .pill.orange { background: var(--orange-bg); color: var(--orange); }
    .pill.gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill.pink { background: var(--pink-bg); color: var(--pink); }

    .row-actions {
      display: flex; gap: 4px; justify-content: flex-end;
      opacity: 0; transition: opacity 0.15s ease;
    }
    .tenants-table tbody tr:hover .row-actions { opacity: 1; }
    .row-action {
      width: 28px; height: 28px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); background: var(--surface-alt);
      transition: all 0.15s ease;
    }
    .row-action:hover { background: var(--blue-pale); color: var(--blue); }
    .row-action svg { width: 14px; height: 14px; }

    /* ===== DRAWER ===== */
    .drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3);
      opacity: 1; transition: opacity 0.2s ease;
      z-index: 40;
    }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 520px; background: var(--surface);
      box-shadow: var(--shadow-xl);
      display: flex; flex-direction: column;
      z-index: 41;
      border-left: 1px solid var(--border);
    }
    .drawer-head {
      padding: 20px 24px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 16px;
    }
    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
    .drawer-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue), var(--pink));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px; flex-shrink: 0;
    }
    .drawer-head-info h2 {
      font-size: 20px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.2;
    }
    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .drawer-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .drawer-close:hover { background: var(--border); color: var(--text); }
    .drawer-close svg { width: 16px; height: 16px; }

    /* Big info row (balance / lease ends / days as tenant) */
    .drawer-info-row {
      padding: 18px 24px; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .info-cell {
      padding: 0 8px;
      border-right: 1px solid var(--border);
    }
    .info-cell:last-child { border-right: none; }
    .info-cell:first-child { padding-left: 0; }
    .info-cell .info-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;
    }
    .info-cell .info-value {
      font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
      line-height: 1.15; color: var(--text);
      font-variant-numeric: tabular-nums;
    }
    .info-cell .info-value.green { color: var(--green-dark); }
    .info-cell .info-value.red { color: var(--red); }
    .info-cell .info-sub {
      font-size: 11px; color: var(--text-muted); margin-top: 2px;
    }

    .drawer-tabs {
      padding: 0 24px; display: flex; gap: 4px;
      border-bottom: 1px solid var(--border);
      overflow-x: auto;
    }
    .drawer-tab {
      padding: 12px 14px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
      white-space: nowrap; cursor: pointer;
    }
    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
    .drawer-tab:hover:not(.active) { color: var(--text); }
    .drawer-tab-count {
      background: var(--surface-alt); color: var(--text-muted);
      padding: 1px 7px; border-radius: 100px;
      font-size: 10px; font-weight: 700;
    }

    .drawer-body {
      flex: 1; overflow-y: auto; padding: 24px;
    }
    .drawer-section { margin-bottom: 24px; }
    .drawer-section:last-child { margin-bottom: 0; }
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .drawer-section-head .chip {
      text-transform: none; letter-spacing: 0;
      font-size: 11px; font-weight: 700;
      padding: 2px 8px; border-radius: 100px;
      background: var(--orange-bg); color: var(--orange);
    }
    .drawer-row {
      display: grid; grid-template-columns: 140px 1fr; gap: 12px;
      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);
    }
    .drawer-row:last-child { border-bottom: none; }
    .drawer-row span:first-child { color: var(--text-muted); }
    .drawer-row span:last-child { color: var(--text); font-weight: 500; }

    /* Doc tiles */
    .doc-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    }
    .doc-tile {
      padding: 12px; border: 1px solid var(--border);
      border-radius: 10px; display: flex; align-items: center; gap: 10px;
      background: var(--surface);
    }
    .doc-tile.received { border-color: var(--green); background: var(--green-bg); }
    .doc-tile.pending { border-color: var(--border); opacity: 0.7; }
    .doc-tile-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface); flex-shrink: 0;
    }
    .doc-tile.received .doc-tile-icon { background: rgba(255,255,255,0.6); color: var(--green-dark); }
    .doc-tile.pending .doc-tile-icon { background: var(--surface-alt); color: var(--text-faint); }
    .doc-tile-icon svg { width: 14px; height: 14px; }
    .doc-tile-text { flex: 1; min-width: 0; }
    .doc-tile-name { font-size: 12px; font-weight: 600; color: var(--text); }
    .doc-tile-meta { font-size: 11px; color: var(--text-muted); }

    /* Activity */
    .activity-feed { position: relative; padding-left: 24px; }
    .activity-feed::before {
      content: ""; position: absolute; left: 10px; top: 4px; bottom: 4px;
      width: 2px; background: var(--border);
    }
    .activity-node {
      position: relative; padding: 0 0 18px 0;
    }
    .activity-node:last-child { padding-bottom: 0; }
    .activity-node::before {
      content: ""; position: absolute; left: -18px; top: 4px;
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--blue-pale); border: 2px solid var(--blue);
    }
    .activity-node.pink::before { background: var(--pink-bg); border-color: var(--pink); }
    .activity-node.green::before { background: var(--green-bg); border-color: var(--green); }
    .activity-node.orange::before { background: var(--orange-bg); border-color: var(--orange); }
    .activity-node-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .activity-node-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .activity-node-time { font-size: 11px; color: var(--text-faint); margin-top: 4px; }

    /* Payments list */
    .pmt-list {
      display: flex; flex-direction: column;
      border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden;
    }
    .pmt-row {
      display: grid; grid-template-columns: auto 1fr auto auto;
      gap: 12px; align-items: center;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .pmt-row:last-child { border-bottom: none; }
    .pmt-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--green-bg); color: var(--green-dark);
      flex-shrink: 0;
    }
    .pmt-icon.red { background: var(--red-bg); color: var(--red); }
    .pmt-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .pmt-icon svg { width: 14px; height: 14px; }
    .pmt-main { min-width: 0; }
    .pmt-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .pmt-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .pmt-amount {
      font-variant-numeric: tabular-nums; font-weight: 700;
      font-size: 13px; color: var(--text);
    }

    /* Notes */
    .note-card {
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 12px 14px; background: var(--surface);
      margin-bottom: 8px;
    }
    .note-card:last-child { margin-bottom: 0; }
    .note-head {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; margin-bottom: 6px;
    }
    .note-author { font-weight: 700; color: var(--text); }
    .note-time { color: var(--text-faint); }
    .note-body { font-size: 13px; color: var(--text); line-height: 1.45; }

    /* Checklist (move-out chain) */
    .checklist {
      border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden; background: var(--surface);
    }
    .check-item {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
    }
    .check-item:last-child { border-bottom: none; }
    .check-box {
      width: 18px; height: 18px; border-radius: 5px;
      border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 1px;
      cursor: pointer; transition: all 0.15s ease;
    }
    .check-box.done {
      background: var(--green-dark); border-color: var(--green-dark); color: #fff;
    }
    .check-box svg { width: 12px; height: 12px; }
    .check-text { flex: 1; min-width: 0; font-size: 13px; color: var(--text); }
    .check-text small { display: block; color: var(--text-faint); font-size: 11px; margin-top: 2px; }
    .check-item.done .check-text { color: var(--text-muted); text-decoration: line-through; }
    .check-item.done .check-text small { text-decoration: none; }

    /* Lease PDF download */
    .lease-pdf {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--surface-subtle);
      cursor: pointer; transition: all 0.15s ease;
    }
    .lease-pdf:hover { border-color: var(--blue); background: var(--blue-pale); }
    .lease-pdf-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--red-bg); color: var(--red);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .lease-pdf-icon svg { width: 16px; height: 16px; }
    .lease-pdf-text { flex: 1; min-width: 0; }
    .lease-pdf-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .lease-pdf-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .lease-pdf-dl {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .lease-pdf-dl svg { width: 14px; height: 14px; }

    /* Drawer footer */
    .drawer-foot {
      border-top: 1px solid var(--border); padding: 16px 24px;
      display: flex; gap: 8px; background: var(--surface-alt);
    }
    .drawer-foot .btn { flex: 1; justify-content: center; }

    /* ===== Bulk action bar ===== */
    .bulk-bar {
      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--navy-dark); color: #fff;
      border-radius: 100px; padding: 10px 16px;
      display: flex; align-items: center; gap: 14px;
      box-shadow: var(--shadow-xl);
      z-index: 30;
      font-size: 13px;
    }
    .bulk-count {
      background: var(--pink); color: #fff;
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 12px;
    }
    .bulk-bar-actions { display: flex; gap: 6px; }
    .bulk-btn {
      padding: 6px 12px; border-radius: 100px;
      font-size: 12px; font-weight: 600; color: #fff;
      background: rgba(255,255,255,0.1);
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .bulk-btn:hover { background: rgba(255,255,255,0.18); }
    .bulk-btn.primary { background: var(--pink); }
    .bulk-btn.primary:hover { background: #e63882; }
    .bulk-btn svg { width: 12px; height: 12px; }

    @media (max-width: 1200px) {
      .drawer { width: 420px; }
    }
    @media (max-width: 960px) {
      .app { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .stats-strip { grid-template-columns: repeat(2, 1fr); }
      .stat-item:nth-child(2n) { border-right: none; padding-right: 0; }
      .stat-item { padding-bottom: 12px; }
      .drawer { width: 100%; }
      .tenants-table thead { display: none; }
      .tenants-table, .tenants-table tbody, .tenants-table tr, .tenants-table td { display: block; width: 100%; }
      .tenants-table td { padding: 6px 14px; }
      .tenants-table tbody tr { padding: 10px 0; }
      .drawer-info-row { grid-template-columns: 1fr; }
      .info-cell { border-right: none; border-bottom: 1px solid var(--border); padding: 8px 0; }
      .info-cell:last-child { border-bottom: none; }
    }
  


    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }`;

const MOCK_HTML = `<div class="app">

    <!-- SIDEBAR -->
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
          <a class="sb-nav-item" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            Dashboard
          </a>
          <a class="sb-nav-item" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>Properties
            <span class="sb-nav-count">4</span>
          </a>
          <a class="sb-nav-item active" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Tenants
            <span class="sb-nav-count">12</span>
          </a>
          <a class="sb-nav-item" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 14h6M9 18h6"/></svg>Leases
          </a>
          <a class="sb-nav-item" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>
            Applications
          </a>
        </div>
        <div class="sb-section-label" style="margin-top: 20px;">Operations</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Payments
          </a>
          <a class="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5"/></svg>Maintenance
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5"/></svg>Settings
          </a>
          <a class="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6"/></svg>Documents
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
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main">

      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Tenants</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, properties...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <!-- Page head -->
      <div class="page-head-bar">
        <div>
          <h1>Tenants</h1>
          <p>Active leases, balances, and lifecycle status</p>
        </div>
        <div class="page-head-actions">
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export
          </button>
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Invite tenant
          </button>
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            New tenant
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-item">
          <div class="stat-label">Active tenants</div>
          <div class="stat-value">12 <span class="stat-delta pink">+2 this month</span></div>
          <div class="stat-sub">Across 4 properties</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">On-time rate</div>
          <div class="stat-value">94% <span class="stat-delta up">+8% MoM</span></div>
          <div class="stat-sub">Last 90 days</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg. balance</div>
          <div class="stat-value">$0</div>
          <div class="stat-sub">Across portfolio</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Renewals due</div>
          <div class="stat-value" style="color: var(--orange);">3 <span class="stat-delta orange">Within 60 days</span></div>
          <div class="stat-sub">Send renewal offers</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Move-outs scheduled</div>
          <div class="stat-value">1 <span class="stat-delta gray">Apr 30</span></div>
          <div class="stat-sub">Chain in progress</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="saved-views">
          <div class="saved-view active" data-view="all">
            All <span class="saved-view-count">12</span>
          </div>
          <div class="saved-view" data-view="current">
            Current <span class="saved-view-count">10</span>
          </div>
          <div class="saved-view" data-view="late">
            <span class="saved-view-dot"></span>
            Late <span class="saved-view-count">1</span>
          </div>
          <div class="saved-view" data-view="renewing">
            Renewing <span class="saved-view-count">3</span>
          </div>
          <div class="saved-view" data-view="moveout">
            Move-out coming <span class="saved-view-count">1</span>
          </div>
          <div class="saved-view" data-view="past">
            Past tenants <span class="saved-view-count">8</span>
          </div>
        </div>

        <div class="toolbar-right">
          <button class="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></svg>
            Filter
          </button>
          <button class="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16"/></svg>
            Sort
          </button>
          <div class="view-toggle">
            <button data-view-mode="board">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="18"/><rect x="15" y="3" width="6" height="12"/></svg>
              Board
            </button>
            <button class="active" data-view-mode="table">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              Table
            </button>
          </div>
        </div>
      </div>

      <!-- Tenants table -->
      <div class="table-wrap">
        <div class="tenants-table-card">
          <table class="tenants-table">
            <thead>
              <tr>
                <th style="width: 28%;">Tenant</th>
                <th style="width: 24%;">Property / Room</th>
                <th style="width: 14%;">Lease ends</th>
                <th style="width: 12%;">Balance</th>
                <th style="width: 14%;">Status</th>
                <th style="width: 8%; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="tenants-tbody">
              <!-- rows rendered by JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- BULK ACTION BAR -->
      <div class="bulk-bar">
        <div class="bulk-count">0</div>
        <span>tenants selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message all
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add charge
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            Send statement
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export
          </button>
        </div>
      </div>

      <!-- DETAIL DRAWER -->
      <div class="drawer-backdrop"></div>
      <div class="drawer">

        <div class="drawer-head">
          <div class="drawer-head-left">
            <div class="drawer-avatar">SC</div>
            <div class="drawer-head-info">
              <h2>Sarah Chen</h2>
              <p>Tenant · 2909 Wilson Dr NW, Room A</p>
            </div>
          </div>
          <button class="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Big info row -->
        <div class="drawer-info-row">
          <div class="info-cell">
            <div class="info-label">Balance</div>
            <div class="info-value green">$0</div>
            <div class="info-sub">Up to date</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Lease ends</div>
            <div class="info-value">Aug 31, 2026</div>
            <div class="info-sub">140 days</div>
          </div>
          <div class="info-cell">
            <div class="info-label">Days as tenant</div>
            <div class="info-value">228</div>
            <div class="info-sub">Since Aug 31, 2025</div>
          </div>
        </div>

        <div class="drawer-tabs">
          <div class="drawer-tab active" data-tab="overview">Overview</div>
          <div class="drawer-tab" data-tab="lease">Lease</div>
          <div class="drawer-tab" data-tab="payments">
            Payments
            <span class="drawer-tab-count">12</span>
          </div>
          <div class="drawer-tab" data-tab="documents">Documents</div>
          <div class="drawer-tab" data-tab="notes">Notes</div>
          <div class="drawer-tab" data-tab="activity">Activity</div>
        </div>

        <div class="drawer-body"><!-- JS renders this --></div>

        <div class="drawer-foot">
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message
          </button>
          <button class="btn btn-dark">
            Add charge
          </button>
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            Open lease
          </button>
        </div>

      </div>

    </main>

  </div>

  <!-- Toast container -->
  <div id="toast-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 100; display: flex; flex-direction: column; gap: 8px;"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
