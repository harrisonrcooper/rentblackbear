"use client";

// Mock ported verbatim from ~/Desktop/tenantory/leases.html.
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

    /* ===== Sidebar ===== */
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
      min-width: 320px; color: var(--text-faint);
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
    .stat-delta.gray { color: var(--text-muted); }
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

    /* ===== Kanban board ===== */
    .kanban-wrap { flex: 1; overflow: auto; padding: 16px 28px 28px; }
    .kanban {
      display: grid;
      grid-template-columns: repeat(4, minmax(300px, 1fr));
      gap: 14px; height: 100%;
    }

    .column {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      display: flex; flex-direction: column;
      min-width: 300px;
      overflow: hidden;
    }
    .column-head {
      padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .column-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 700; color: var(--text);
    }
    .column-title .count {
      background: var(--surface-alt); color: var(--text-muted);
      font-size: 11px; font-weight: 700;
      padding: 2px 8px; border-radius: 100px;
    }
    .column-title .dot-badge {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .column-title .dot-badge.pink { background: var(--pink); }
    .column-title .dot-badge.blue { background: var(--blue); }
    .column-title .dot-badge.orange { background: var(--orange); }
    .column-title .dot-badge.green { background: var(--green); }
    .column-title .dot-badge.gray { background: var(--text-faint); }
    .column-title .dot-badge.red { background: var(--red); }
    .column-alert {
      font-size: 11px; font-weight: 700;
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 100px;
    }
    .column-alert.pink { background: var(--pink-bg); color: var(--pink); }
    .column-alert.orange { background: var(--orange-bg); color: var(--orange); }
    .column-alert svg { width: 11px; height: 11px; }
    .column-body {
      padding: 12px; display: flex; flex-direction: column; gap: 10px;
      overflow-y: auto; flex: 1;
    }

    /* ===== Lease card ===== */
    .lease-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
      transition: all 0.15s ease;
      cursor: pointer; position: relative;
    }
    .lease-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }
    .lease-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }
    .lease-card.stale { border-left: 3px solid var(--pink); }
    .lease-card.expiring { border-left: 3px solid var(--pink); }

    .lease-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 10px; margin-bottom: 10px;
    }
    .lease-identity {
      display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;
    }
    .lease-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; color: var(--blue);
      background: var(--blue-pale); flex-shrink: 0;
    }
    .lease-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .lease-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .lease-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .lease-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .lease-avatar.gold { background: rgba(245,166,35,0.12); color: var(--gold); }
    .lease-name { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.2; }
    .lease-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    .lease-rent-chip {
      display: inline-flex; align-items: baseline; gap: 2px;
      padding: 4px 10px; border-radius: 100px;
      background: var(--surface-alt); color: var(--text);
      font-size: 13px; font-weight: 800; letter-spacing: -0.01em;
      flex-shrink: 0;
    }
    .lease-rent-chip small { font-size: 10px; font-weight: 700; color: var(--text-muted); }

    .lease-property {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--text-muted);
      margin-bottom: 10px;
    }
    .lease-property svg { width: 12px; height: 12px; }

    .lease-term {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; color: var(--text); font-weight: 600;
      background: var(--surface-alt); padding: 6px 10px;
      border-radius: 8px; margin-bottom: 10px;
      font-variant-numeric: tabular-nums;
    }
    .lease-term svg { width: 12px; height: 12px; color: var(--text-faint); }
    .lease-term .arrow { color: var(--text-faint); margin: 0 2px; }

    .lease-flags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
    .lease-flag {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 7px; border-radius: 4px;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .lease-flag.stale { background: var(--pink-bg); color: var(--pink); }
    .lease-flag.renewal { background: var(--orange-bg); color: var(--orange); }
    .lease-flag.signed { background: var(--green-bg); color: var(--green-dark); }
    .lease-flag svg { width: 10px; height: 10px; }

    /* Status bar at bottom of card */
    .lease-status {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; border-radius: 8px;
      font-size: 11px; font-weight: 600;
      margin-bottom: 10px;
    }
    .lease-status svg { width: 12px; height: 12px; flex-shrink: 0; }
    .lease-status.pending { background: var(--orange-bg); color: var(--orange); }
    .lease-status.executed { background: var(--green-bg); color: var(--green-dark); }
    .lease-status.expiring { background: var(--pink-bg); color: var(--pink); }
    .lease-status.draft { background: var(--surface-alt); color: var(--text-muted); }

    /* Footer */
    .lease-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid var(--border);
    }
    .lease-time {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .lease-time svg { width: 12px; height: 12px; }
    .lease-time.warn { color: var(--orange); }
    .lease-time.urgent { color: var(--pink); }
    .lease-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }
    .lease-card:hover .lease-actions { opacity: 1; }
    .lease-action {
      width: 26px; height: 26px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .lease-action:hover { background: var(--surface-alt); color: var(--blue); }
    .lease-action.remind:hover { background: var(--orange-bg); color: var(--orange); }
    .lease-action.edit:hover { background: var(--blue-pale); color: var(--blue); }
    .lease-action svg { width: 14px; height: 14px; }

    /* ===== DRAWER ===== */
    .drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3);
      opacity: 1; transition: opacity 0.2s ease;
      z-index: 40;
    }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 620px; background: var(--surface);
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
    .drawer-head-info { min-width: 0; flex: 1; }
    .drawer-head-info h2 {
      font-size: 20px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.2;
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .drawer-head-info p { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.02em;
    }
    .status-pill.pending { background: var(--orange-bg); color: var(--orange); }
    .status-pill.executed { background: var(--green-bg); color: var(--green-dark); }
    .status-pill.expiring { background: var(--pink-bg); color: var(--pink); }
    .status-pill.draft { background: var(--surface-alt); color: var(--text-muted); }
    .status-pill::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .drawer-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .drawer-close:hover { background: var(--border); color: var(--text); }
    .drawer-close svg { width: 16px; height: 16px; }

    /* Snapshot bar */
    .drawer-snapshot {
      padding: 16px 24px; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;
      background: var(--surface-subtle);
    }
    .snapshot-item { border-right: 1px solid var(--border); padding-right: 16px; }
    .snapshot-item:last-child { border-right: none; padding-right: 0; }
    .snapshot-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;
    }
    .snapshot-value {
      font-size: 13px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em; line-height: 1.3;
      font-variant-numeric: tabular-nums;
    }
    .snapshot-value.green { color: var(--green-dark); }
    .snapshot-value.orange { color: var(--orange); }
    .snapshot-value.pink { color: var(--pink); }

    .drawer-tabs {
      padding: 0 24px; display: flex; gap: 4px;
      border-bottom: 1px solid var(--border);
    }
    .drawer-tab {
      padding: 12px 14px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
      cursor: pointer;
    }
    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
    .drawer-tab:hover:not(.active) { color: var(--text); }
    .drawer-tab-count {
      background: var(--surface-alt); color: var(--text-muted);
      padding: 1px 7px; border-radius: 100px;
      font-size: 10px; font-weight: 700;
    }
    .drawer-tab.active .drawer-tab-count {
      background: var(--blue-pale); color: var(--blue);
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
    .drawer-section-head-action {
      text-transform: none; letter-spacing: 0; font-size: 11px; color: var(--blue);
      font-weight: 600; cursor: pointer;
    }
    .drawer-section-head-action:hover { text-decoration: underline; }
    .drawer-row {
      display: grid; grid-template-columns: 140px 1fr; gap: 12px;
      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);
    }
    .drawer-row:last-child { border-bottom: none; }
    .drawer-row span:first-child { color: var(--text-muted); }
    .drawer-row span:last-child { color: var(--text); font-weight: 500; }

    /* Move-in chain */
    .chain { display: flex; flex-direction: column; gap: 2px; }
    .chain-step {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border);
      transition: all 0.15s ease;
    }
    .chain-step.done { background: var(--green-bg); border-color: rgba(30,169,124,0.2); }
    .chain-step.pending { opacity: 0.75; }
    .chain-step-icon {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface-alt); color: var(--text-faint);
      flex-shrink: 0;
    }
    .chain-step.done .chain-step-icon { background: var(--green); color: #fff; }
    .chain-step-icon svg { width: 14px; height: 14px; }
    .chain-step-text { flex: 1; }
    .chain-step-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .chain-step.pending .chain-step-name { color: var(--text-muted); }
    .chain-step-meta { font-size: 11px; color: var(--text-faint); margin-top: 1px; }

    /* Sections list */
    .sections-list { display: flex; flex-direction: column; gap: 2px; }
    .section-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border);
      transition: all 0.15s ease; cursor: pointer;
    }
    .section-row:hover { border-color: var(--blue); background: var(--blue-pale); }
    .section-number {
      width: 26px; height: 26px; border-radius: 6px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 11px;
      flex-shrink: 0; font-variant-numeric: tabular-nums;
    }
    .section-row:hover .section-number { background: var(--blue); color: #fff; }
    .section-name { flex: 1; font-size: 13px; font-weight: 600; color: var(--text); }
    .section-status {
      font-size: 10px; font-weight: 700; color: var(--green-dark);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .section-status.custom { color: var(--orange); }
    .section-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }
    .section-row:hover .section-actions { opacity: 1; }
    .section-action {
      width: 24px; height: 24px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted);
    }
    .section-action:hover { background: var(--surface); color: var(--blue); }
    .section-action svg { width: 13px; height: 13px; }

    /* Signature boxes */
    .sig-grid {
      display: grid; grid-template-columns: 1fr; gap: 14px;
    }
    .sig-card {
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 18px; background: var(--surface);
    }
    .sig-card.signed { border-color: rgba(30,169,124,0.3); background: linear-gradient(180deg, var(--green-bg), #fff); }
    .sig-card.pending { border-style: dashed; }
    .sig-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
    }
    .sig-party { display: flex; align-items: center; gap: 10px; }
    .sig-party-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700;
    }
    .sig-party-avatar.landlord { background: var(--navy); color: #fff; }
    .sig-party-avatar.tenant { background: var(--pink-bg); color: var(--pink); }
    .sig-party-name { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
    .sig-party-role { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
    .sig-status-pill {
      font-size: 10px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .sig-status-pill.signed { background: var(--green); color: #fff; }
    .sig-status-pill.pending { background: var(--orange-bg); color: var(--orange); }
    .sig-box {
      height: 80px; border: 1px dashed var(--border);
      border-radius: 8px; background: var(--surface-subtle);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-faint); font-size: 12px;
      position: relative; overflow: hidden;
    }
    .sig-card.signed .sig-box {
      background: var(--surface); border-style: solid; border-color: rgba(30,169,124,0.2);
      padding: 0 20px;
    }
    .sig-drawn {
      font-family: 'Dancing Script', 'Brush Script MT', cursive;
      font-size: 32px; color: var(--navy-dark); font-weight: 500;
      letter-spacing: -0.02em; transform: rotate(-3deg);
    }
    .sig-meta {
      display: flex; justify-content: space-between;
      font-size: 11px; color: var(--text-muted); margin-top: 10px;
      font-variant-numeric: tabular-nums;
    }
    .sig-meta strong { color: var(--text); font-weight: 600; }

    /* Documents tab */
    .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .doc-tile {
      padding: 12px; border: 1px solid var(--border);
      border-radius: 10px; display: flex; align-items: center; gap: 10px;
      background: var(--surface); transition: all 0.15s ease; cursor: pointer;
    }
    .doc-tile:hover { border-color: var(--blue); }
    .doc-tile-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--blue-pale); color: var(--blue); flex-shrink: 0;
    }
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

    @media (max-width: 1280px) {
      .drawer { width: 520px; }
      .drawer-snapshot { grid-template-columns: repeat(3, 1fr); }
      .drawer-snapshot .snapshot-item:nth-child(3) { border-right: none; }
      .drawer-snapshot .snapshot-item:nth-child(4),
      .drawer-snapshot .snapshot-item:nth-child(5) { border-right: 1px solid var(--border); padding-right: 16px; }
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
          <a class="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Tenants
            <span class="sb-nav-count">12</span>
          </a>
          <a class="sb-nav-item active" href="leases.html">
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
          <strong>Leases</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search leases, tenants, properties...">
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
          <h1>Leases</h1>
          <p>Templates, signatures, renewals — every contract in one place.</p>
        </div>
        <div class="page-head-actions">
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 14h6M9 18h6"/></svg>
            Lease templates
          </button>
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            New lease
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-item">
          <div class="stat-label">Active leases</div>
          <div class="stat-value">11 <span class="stat-delta up">+1 this month</span></div>
          <div class="stat-sub">Across 4 properties</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Pending signature</div>
          <div class="stat-value" style="color: var(--orange);">2</div>
          <div class="stat-sub">Avg 2.3 days to sign</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Expiring in 60 days</div>
          <div class="stat-value" style="color: var(--pink);">3</div>
          <div class="stat-sub">Renewal prompts sent</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg lease value</div>
          <div class="stat-value">$1,025<span style="font-size: 13px; font-weight: 600; color: var(--text-muted); letter-spacing: 0;">/mo</span></div>
          <div class="stat-sub">Across portfolio</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Templates</div>
          <div class="stat-value">4 <span class="stat-delta gray">Last edited 3d ago</span></div>
          <div class="stat-sub">2 state-compliant</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="saved-views">
          <div class="saved-view active" data-filter="all">
            All <span class="saved-view-count">11</span>
          </div>
          <div class="saved-view" data-filter="active">
            <span class="saved-view-dot" style="background: var(--green);"></span>
            Active <span class="saved-view-count">11</span>
          </div>
          <div class="saved-view" data-filter="draft">
            <span class="saved-view-dot" style="background: var(--text-faint);"></span>
            Draft <span class="saved-view-count">1</span>
          </div>
          <div class="saved-view" data-filter="pending">
            <span class="saved-view-dot" style="background: var(--orange);"></span>
            Pending signature <span class="saved-view-count">2</span>
          </div>
          <div class="saved-view" data-filter="executed">
            <span class="saved-view-dot" style="background: var(--green);"></span>
            Executed <span class="saved-view-count">8</span>
          </div>
          <div class="saved-view" data-filter="expiring">
            <span class="saved-view-dot"></span>
            Expiring soon <span class="saved-view-count">3</span>
          </div>
          <div class="saved-view" data-filter="templates">
            Templates <span class="saved-view-count">4</span>
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
            <button class="active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="18"/><rect x="15" y="3" width="6" height="12"/></svg>
              Board
            </button>
            <button>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              Table
            </button>
          </div>
        </div>
      </div>

      <!-- Kanban -->
      <div class="kanban-wrap">
        <div class="kanban">

          <!-- Column 1: Drafts -->
          <div class="column" data-column="draft">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge gray"></span>
                Drafts
                <span class="count">1</span>
              </div>
            </div>
            <div class="column-body">

              <div class="lease-card" data-lease="tara-ramirez" data-status="draft">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar purple">TR</div>
                    <div>
                      <div class="lease-name">Tara Ramirez</div>
                      <div class="lease-sub">Incoming tenant · from application</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$825<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room D
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  May 1, 2026 <span class="arrow">→</span> Apr 30, 2027
                </div>
                <div class="lease-status draft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                  Draft — 18 of 20 sections filled
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Created 4h ago</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 2: Pending Signature -->
          <div class="column" data-column="pending">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge orange"></span>
                Pending Signature
                <span class="count">2</span>
              </div>
              <span class="column-alert pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                1 stale 5d+
              </span>
            </div>
            <div class="column-body">

              <div class="lease-card" data-lease="sarah-chen" data-status="pending">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar">SC</div>
                    <div>
                      <div class="lease-name">Sarah Chen</div>
                      <div class="lease-sub">Sent via DocuSign · 2h ago</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$850<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room A
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  May 1, 2026 <span class="arrow">→</span> Apr 30, 2027
                </div>
                <div class="lease-status pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Awaiting tenant signature · sent 2h ago
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Landlord signed</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card stale" data-lease="carmen-miller" data-status="pending">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar pink">CM</div>
                    <div>
                      <div class="lease-name">Carmen Miller</div>
                      <div class="lease-sub">Sent via DocuSign · 5 days ago</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,425<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2907 Wilson Dr NW
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  May 1, 2026 <span class="arrow">→</span> Apr 30, 2027
                </div>
                <div class="lease-flags">
                  <span class="lease-flag stale">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    5 days stale
                  </span>
                </div>
                <div class="lease-status pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Awaiting tenant signature · 3 reminders sent
                </div>
                <div class="lease-foot">
                  <div class="lease-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>5d in stage</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 3: Executed -->
          <div class="column" data-column="executed">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge green"></span>
                Executed
                <span class="count">8</span>
              </div>
            </div>
            <div class="column-body">

              <div class="lease-card" data-lease="marcus-lee" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar green">ML</div>
                    <div>
                      <div class="lease-name">Marcus Lee</div>
                      <div class="lease-sub">Current tenant · 14 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,350<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Feb 1, 2025 <span class="arrow">→</span> Jan 31, 2027
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Auto-renews in 293d
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>14 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="priya-patel" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar orange">PP</div>
                    <div>
                      <div class="lease-name">Priya Patel</div>
                      <div class="lease-sub">Current tenant · 9 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$925<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room B
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Jul 15, 2025 <span class="arrow">→</span> Jul 14, 2026
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Auto-renews in 92d
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>9 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="jordan-brooks" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar green">JB</div>
                    <div>
                      <div class="lease-name">Jordan Brooks</div>
                      <div class="lease-sub">New tenant · just signed</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$900<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room C
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Apr 1, 2026 <span class="arrow">→</span> Mar 31, 2027
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Move-in chain 4/5
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Signed 12d ago</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="kai-wong" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar">KW</div>
                    <div>
                      <div class="lease-name">Kai Wong</div>
                      <div class="lease-sub">Current tenant · 7 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$875<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room E
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Sep 1, 2025 <span class="arrow">→</span> Aug 31, 2026
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Auto-renews in 140d
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>7 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="elena-garcia" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar pink">EG</div>
                    <div>
                      <div class="lease-name">Elena Garcia</div>
                      <div class="lease-sub">Current tenant · 22 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,100<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  412 Maple St · Unit 2
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Jun 1, 2024 <span class="arrow">→</span> May 31, 2026
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · 2-year term
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>22 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="tomas-rivera" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar gold">TR</div>
                    <div>
                      <div class="lease-name">Tomás Rivera</div>
                      <div class="lease-sub">Current tenant · 11 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$795<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson Dr NW · Room F
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  May 15, 2025 <span class="arrow">→</span> May 14, 2026
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Renewal pending
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>11 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="amelia-ford" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar purple">AF</div>
                    <div>
                      <div class="lease-name">Amelia Ford</div>
                      <div class="lease-sub">Current tenant · 5 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,250<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  412 Maple St · Unit 1
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Nov 1, 2025 <span class="arrow">→</span> Oct 31, 2026
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Auto-renews in 201d
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>5 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card" data-lease="nate-singh" data-status="executed">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar orange">NS</div>
                    <div>
                      <div class="lease-name">Nate Singh</div>
                      <div class="lease-sub">Current tenant · 3 mo</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,050<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave · Basement
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Jan 15, 2026 <span class="arrow">→</span> Jan 14, 2027
                </div>
                <div class="lease-status executed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Fully executed · Month-to-month after
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>3 mo active</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 4: Expiring Soon -->
          <div class="column" data-column="expiring">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge pink"></span>
                Expiring Soon
                <span class="count">3</span>
              </div>
              <span class="column-alert orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                Renewal action needed
              </span>
            </div>
            <div class="column-body">

              <div class="lease-card expiring" data-lease="daniel-kim" data-status="expiring">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar pink">DK</div>
                    <div>
                      <div class="lease-name">Daniel Kim</div>
                      <div class="lease-sub">Expires in 48 days</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$980<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2907 Wilson Dr NW · Upper
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Jun 1, 2025 <span class="arrow">→</span> May 31, 2026
                </div>
                <div class="lease-flags">
                  <span class="lease-flag renewal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
                    Renewal offer sent
                  </span>
                </div>
                <div class="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Expires May 31 · 48 days left
                </div>
                <div class="lease-foot">
                  <div class="lease-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Response pending</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card expiring" data-lease="olivia-reed" data-status="expiring">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar green">OR</div>
                    <div>
                      <div class="lease-name">Olivia Reed</div>
                      <div class="lease-sub">Expires in 78 days</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,180<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave · Upstairs
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Jul 1, 2025 <span class="arrow">→</span> Jun 30, 2026
                </div>
                <div class="lease-flags">
                  <span class="lease-flag renewal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
                    Renewal offer queued
                  </span>
                </div>
                <div class="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Expires Jun 30 · 78 days left
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Offer sends in 18d</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="lease-card expiring" data-lease="brandon-hayes" data-status="expiring">
                <div class="lease-head">
                  <div class="lease-identity">
                    <div class="lease-avatar">BH</div>
                    <div>
                      <div class="lease-name">Brandon Hayes</div>
                      <div class="lease-sub">Expires in 140 days</div>
                    </div>
                  </div>
                  <div class="lease-rent-chip">$1,395<small>/mo</small></div>
                </div>
                <div class="lease-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  412 Maple St · Unit 3
                </div>
                <div class="lease-term">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Sep 1, 2025 <span class="arrow">→</span> Aug 31, 2026
                </div>
                <div class="lease-status expiring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Expires Aug 31 · 140 days left
                </div>
                <div class="lease-foot">
                  <div class="lease-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Offer sends in 80d</div>
                  <div class="lease-actions">
                    <div class="lease-action" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <div class="lease-action remind" title="Send reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
                    <div class="lease-action edit" title="Open in editor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- BULK ACTION BAR -->
      <div class="bulk-bar">
        <div class="bulk-count">3</div>
        <span>leases selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            Send reminders
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
            Renew all
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
              <h2>
                <span class="drawer-name">Sarah Chen</span>
                <span class="status-pill pending"><span class="status-pill-label">Pending signature</span></span>
              </h2>
              <p class="drawer-subtitle">2909 Wilson Dr NW · Room A · Lease #TNT-2026-017</p>
            </div>
          </div>
          <button class="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="drawer-snapshot">
          <div class="snapshot-item">
            <div class="snapshot-label">Term</div>
            <div class="snapshot-value snap-term">May 1, 2026<br><span style="color: var(--text-muted); font-weight: 500;">→ Apr 30, 2027</span></div>
          </div>
          <div class="snapshot-item">
            <div class="snapshot-label">Monthly rent</div>
            <div class="snapshot-value snap-rent">$850/mo</div>
          </div>
          <div class="snapshot-item">
            <div class="snapshot-label">Security deposit</div>
            <div class="snapshot-value snap-deposit">$850</div>
          </div>
          <div class="snapshot-item">
            <div class="snapshot-label">Signatures</div>
            <div class="snapshot-value orange snap-sig">1 of 2</div>
          </div>
          <div class="snapshot-item">
            <div class="snapshot-label">Time on stage</div>
            <div class="snapshot-value snap-stage">2h</div>
          </div>
        </div>

        <div class="drawer-tabs">
          <div class="drawer-tab active" data-tab="overview">Overview</div>
          <div class="drawer-tab" data-tab="sections">
            Sections
            <span class="drawer-tab-count">20</span>
          </div>
          <div class="drawer-tab" data-tab="signatures">
            Signatures
            <span class="drawer-tab-count sig-count">1/2</span>
          </div>
          <div class="drawer-tab" data-tab="documents">
            Documents
            <span class="drawer-tab-count">4</span>
          </div>
          <div class="drawer-tab" data-tab="activity">Activity</div>
        </div>

        <div class="drawer-body">
          <!-- Drawer body contents populated by JS -->
        </div>

        <div class="drawer-foot">
          <button class="btn btn-ghost" data-action="reminder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            Send reminder
          </button>
          <button class="btn btn-dark" data-action="pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download PDF
          </button>
          <button class="btn btn-primary" data-action="edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
            Edit lease
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
