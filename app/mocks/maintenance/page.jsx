"use client";

// Mock ported verbatim from ~/Desktop/tenantory/maintenance.html.
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
    input, textarea { font-family: inherit; font-size: inherit; }

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
    .btn-green { background: var(--green-dark); color: #fff; }
    .btn-green:hover { background: #0d6f4c; }
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
    .stat-item { border-right: 1px solid var(--border); padding-right: 24px; }
    .stat-item:last-child { border-right: none; padding-right: 0; }
    .stat-label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .stat-value { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; display: flex; align-items: baseline; gap: 8px; }
    .stat-delta { font-size: 11px; font-weight: 700; }
    .stat-delta.up { color: var(--green-dark); }
    .stat-delta.down { color: var(--red); }
    .stat-delta.pink { color: var(--pink); }
    .stat-delta.orange { color: var(--orange); }
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
    .saved-view-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }
    .saved-view-dot.red { background: var(--red); }

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
      grid-template-columns: repeat(5, minmax(280px, 1fr));
      gap: 14px; height: 100%;
    }

    .column {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      display: flex; flex-direction: column;
      min-width: 280px;
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
    .column-title .dot-badge { width: 8px; height: 8px; border-radius: 50%; }
    .column-title .dot-badge.pink { background: var(--pink); }
    .column-title .dot-badge.blue { background: var(--blue); }
    .column-title .dot-badge.orange { background: var(--orange); }
    .column-title .dot-badge.green { background: var(--green); }
    .column-title .dot-badge.gray { background: var(--text-faint); }
    .column-title .dot-badge.red { background: var(--red); }
    .column-alert {
      font-size: 11px; font-weight: 700; color: var(--orange);
      display: inline-flex; align-items: center; gap: 3px;
    }
    .column-alert svg { width: 12px; height: 12px; }
    .column-body {
      padding: 12px; display: flex; flex-direction: column; gap: 10px;
      overflow-y: auto; flex: 1;
    }
    .column-foot {
      padding: 10px 14px; border-top: 1px solid var(--border);
      background: var(--surface); font-size: 12px; font-weight: 600;
      color: var(--blue); text-align: center; cursor: pointer;
      transition: all 0.15s ease;
    }
    .column-foot:hover { background: var(--blue-pale); }

    /* ===== Ticket card ===== */
    .ticket-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
      transition: all 0.15s ease;
      cursor: pointer; position: relative;
    }
    .ticket-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }
    .ticket-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }
    .ticket-card.urgent-rail { border-left: 3px solid var(--pink); }

    .ticket-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 10px; margin-bottom: 8px;
    }
    .ticket-title { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.25; }
    .ticket-sub {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; color: var(--text-faint); margin-top: 3px;
    }
    .ticket-sub svg { width: 11px; height: 11px; }

    .urgency-pill {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 100px;
      font-size: 10px; font-weight: 800;
      letter-spacing: 0.04em; text-transform: uppercase;
      flex-shrink: 0;
    }
    .urgency-pill.urgent { background: var(--red-bg); color: var(--red); }
    .urgency-pill.normal { background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); }
    .urgency-pill.low { background: var(--blue-pale); color: var(--blue); }

    .ticket-meta-row {
      display: flex; align-items: center; gap: 8px;
      margin-top: 10px; flex-wrap: wrap;
    }
    .ticket-vendor {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--text);
    }
    .vendor-avatar {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--blue-pale); color: var(--blue);
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 9px; letter-spacing: 0.02em;
      flex-shrink: 0;
    }
    .vendor-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .vendor-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .vendor-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .vendor-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .vendor-avatar.gray { background: var(--surface-alt); color: var(--text-muted); }

    .cost-pill {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 8px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      background: var(--surface-alt); color: var(--text);
      border: 1px solid var(--border);
    }
    .cost-pill.actual { background: var(--green-bg); color: var(--green-dark); border-color: transparent; }

    .ticket-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid var(--border);
      margin-top: 10px;
    }
    .ticket-time {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .ticket-time svg { width: 11px; height: 11px; }
    .ticket-time.warn { color: var(--orange); }
    .ticket-time.urgent { color: var(--red); }
    .ticket-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s ease; }
    .ticket-card:hover .ticket-actions { opacity: 1; }
    .ticket-action {
      width: 24px; height: 24px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .ticket-action:hover { background: var(--surface-alt); color: var(--blue); }
    .ticket-action.assign:hover { background: var(--blue-pale); color: var(--blue); }
    .ticket-action.message:hover { background: var(--pink-bg); color: var(--pink); }
    .ticket-action.status:hover { background: var(--green-bg); color: var(--green-dark); }
    .ticket-action svg { width: 14px; height: 14px; }

    /* ===== DRAWER ===== */
    .drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3);
      opacity: 1; transition: opacity 0.2s ease;
      z-index: 40;
    }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 560px; background: var(--surface);
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
    .drawer-head-left { flex: 1; min-width: 0; }
    .drawer-head-left h2 {
      font-size: 20px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 4px;
    }
    .drawer-head-sub {
      display: flex; align-items: center; gap: 10px;
      font-size: 12px; color: var(--text-muted); flex-wrap: wrap;
    }
    .drawer-head-sub svg { width: 12px; height: 12px; }
    .drawer-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .drawer-close:hover { background: var(--border); color: var(--text); }
    .drawer-close svg { width: 16px; height: 16px; }

    /* Status pipeline bar */
    .pipeline-bar {
      padding: 18px 24px; border-bottom: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .pipeline-label {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;
    }
    .pipeline-steps {
      display: flex; align-items: center; gap: 0;
    }
    .pipeline-step {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      position: relative; font-size: 11px; font-weight: 600;
      color: var(--text-faint); text-align: center;
    }
    .pipeline-step .dot {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--surface); border: 2px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-faint); font-size: 10px; font-weight: 700;
      position: relative; z-index: 1; margin-bottom: 6px;
      transition: all 0.2s ease;
    }
    .pipeline-step.done .dot { background: var(--pink); border-color: var(--pink); color: #fff; }
    .pipeline-step.current .dot {
      background: var(--surface); border-color: var(--pink); color: var(--pink);
      box-shadow: 0 0 0 4px var(--pink-bg);
    }
    .pipeline-step.done, .pipeline-step.current { color: var(--text); }
    .pipeline-step .line {
      position: absolute; top: 11px; left: 50%; right: -50%;
      height: 2px; background: var(--border); z-index: 0;
    }
    .pipeline-step.done .line { background: var(--pink); }
    .pipeline-step:last-child .line { display: none; }

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

    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
    .drawer-section { margin-bottom: 24px; }
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .drawer-section-head a {
      font-size: 11px; color: var(--blue); font-weight: 600;
      text-transform: none; letter-spacing: 0; cursor: pointer;
    }
    .drawer-section-head a:hover { text-decoration: underline; }
    .drawer-row {
      display: grid; grid-template-columns: 140px 1fr; gap: 12px;
      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);
    }
    .drawer-row:last-child { border-bottom: none; }
    .drawer-row span:first-child { color: var(--text-muted); }
    .drawer-row span:last-child { color: var(--text); font-weight: 500; }

    .drawer-desc {
      background: var(--surface-alt); border-radius: var(--radius);
      padding: 12px 14px; font-size: 13px; color: var(--text);
      line-height: 1.5; border: 1px solid var(--border);
    }

    /* Vendor card inside drawer */
    .vendor-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--surface);
    }
    .vendor-card-avatar {
      width: 42px; height: 42px; border-radius: 10px;
      background: linear-gradient(135deg, var(--blue), var(--blue-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px; flex-shrink: 0;
    }
    .vendor-card-avatar.orange { background: linear-gradient(135deg, var(--orange), var(--gold)); }
    .vendor-card-avatar.green { background: linear-gradient(135deg, var(--green-dark), var(--green)); }
    .vendor-card-avatar.purple { background: linear-gradient(135deg, var(--purple), var(--purple-light, #a78bfa)); }
    .vendor-card-info { flex: 1; min-width: 0; }
    .vendor-card-name { font-weight: 700; font-size: 14px; color: var(--text); }
    .vendor-card-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; display: flex; gap: 8px; flex-wrap: wrap; }
    .vendor-card-meta svg { width: 11px; height: 11px; vertical-align: -1px; margin-right: 3px; }
    .badge-1099 {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 7px; border-radius: 4px;
      font-size: 10px; font-weight: 700;
      background: var(--green-bg); color: var(--green-dark);
      text-transform: uppercase; letter-spacing: 0.04em;
    }

    /* Photo grid */
    .photo-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }
    .photo-tile {
      aspect-ratio: 4 / 3; border-radius: var(--radius);
      background: linear-gradient(135deg, var(--blue-pale), var(--surface-subtle));
      border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-faint); position: relative;
      cursor: pointer; transition: all 0.15s ease;
    }
    .photo-tile:hover { border-color: var(--blue); }
    .photo-tile svg { width: 32px; height: 32px; opacity: 0.5; }
    .photo-tile-label {
      position: absolute; bottom: 8px; left: 10px;
      font-size: 10px; font-weight: 700; color: var(--text);
      background: rgba(255,255,255,0.9); padding: 2px 7px;
      border-radius: 4px;
    }

    /* Comms (chat) */
    .comms-thread { display: flex; flex-direction: column; gap: 12px; }
    .comms-msg {
      max-width: 82%; padding: 10px 14px;
      border-radius: 14px; font-size: 13px; line-height: 1.45;
    }
    .comms-msg.me {
      align-self: flex-end; background: var(--blue); color: #fff;
      border-bottom-right-radius: 4px;
    }
    .comms-msg.them {
      align-self: flex-start; background: var(--surface-alt);
      color: var(--text); border: 1px solid var(--border);
      border-bottom-left-radius: 4px;
    }
    .comms-time { font-size: 10px; color: var(--text-faint); margin-top: 2px; padding: 0 4px; }
    .comms-msg.me + .comms-time { align-self: flex-end; }

    /* Costs */
    .cost-table {
      width: 100%; border-collapse: collapse;
      border: 1px solid var(--border); border-radius: var(--radius);
      overflow: hidden;
    }
    .cost-table th, .cost-table td {
      text-align: left; padding: 10px 14px; font-size: 13px;
      border-bottom: 1px solid var(--border);
    }
    .cost-table th {
      background: var(--surface-alt); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); font-weight: 700;
    }
    .cost-table td:last-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
    .cost-table tfoot td {
      font-weight: 800; background: var(--surface-subtle);
      border-bottom: none; color: var(--text);
    }

    /* Drawer footer */
    .drawer-foot {
      border-top: 1px solid var(--border); padding: 16px 24px;
      display: flex; gap: 8px; background: var(--surface-alt);
    }
    .drawer-foot .btn { flex: 1; justify-content: center; }

    /* Bulk action bar */
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

    /* Vendor directory panel */
    .vendor-panel-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3); z-index: 42;
    }
    .vendor-panel {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 400px; background: var(--surface);
      box-shadow: var(--shadow-xl);
      z-index: 43; display: flex; flex-direction: column;
      border-left: 1px solid var(--border);
    }

    @media (max-width: 1400px) {
      .kanban { grid-template-columns: repeat(5, minmax(260px, 1fr)); }
    }
    @media (max-width: 1200px) {
      .drawer { width: 440px; }
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
          <a class="sb-nav-item active" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>Maintenance
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
          <strong>Maintenance</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tickets, vendors, properties...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon" id="open-vendor-panel" title="Open vendor directory">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </button>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <!-- Page head -->
      <div class="page-head-bar">
        <div>
          <h1>Maintenance</h1>
          <p>Tickets from open to closed — vendors, costs, and tenant comms in one queue.</p>
        </div>
        <div class="page-head-actions">
          <button class="btn btn-ghost" data-action="Vendors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Vendors
          </button>
          <button class="btn btn-primary" data-action="New ticket">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            New ticket
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-item">
          <div class="stat-label">Open tickets</div>
          <div class="stat-value">5 <span class="stat-delta orange">1 urgent</span></div>
          <div class="stat-sub">Across 3 properties</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg response time</div>
          <div class="stat-value">4.2h <span class="stat-delta up">-60% vs Q1</span></div>
          <div class="stat-sub">First vendor reply</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">In progress</div>
          <div class="stat-value">2</div>
          <div class="stat-sub">Vendors on-site</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Cost MTD</div>
          <div class="stat-value">$1,420</div>
          <div class="stat-sub">April · 5 tickets paid</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Resolved this month</div>
          <div class="stat-value">18 <span class="stat-delta up">+6</span></div>
          <div class="stat-sub">vs. 12 last month</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="saved-views">
          <div class="saved-view active" data-view="all">
            All <span class="saved-view-count">5</span>
          </div>
          <div class="saved-view" data-view="urgent">
            <span class="saved-view-dot red"></span>
            Urgent <span class="saved-view-count">1</span>
          </div>
          <div class="saved-view" data-view="open">
            Open <span class="saved-view-count">3</span>
          </div>
          <div class="saved-view" data-view="awaiting-vendor">
            Awaiting Vendor <span class="saved-view-count">2</span>
          </div>
          <div class="saved-view" data-view="in-progress">
            In Progress <span class="saved-view-count">2</span>
          </div>
          <div class="saved-view" data-view="awaiting-tenant">
            Awaiting Tenant <span class="saved-view-count">1</span>
          </div>
          <div class="saved-view" data-view="completed">
            Completed <span class="saved-view-count">15</span>
          </div>
          <div class="saved-view" data-view="mine">
            My tickets <span class="saved-view-count">3</span>
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

          <!-- Column 1: New -->
          <div class="column" data-col="new">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge gray"></span>
                New
                <span class="count">1</span>
              </div>
            </div>
            <div class="column-body">

              <div class="ticket-card" data-ticket="garage-not-closing">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Garage door not closing</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span class="urgency-pill normal">Normal</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar gray">KW</span>
                    Submitted by Kai Wong
                  </div>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    2h ago
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign" title="Assign vendor">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message" title="Message tenant">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status" title="Change status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 2: Assigned -->
          <div class="column" data-col="assigned">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge blue"></span>
                Assigned
                <span class="count">2</span>
              </div>
              <span class="column-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                1 urgent
              </span>
            </div>
            <div class="column-body">

              <div class="ticket-card urgent-rail" data-ticket="leaky-faucet">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Leaky bathroom faucet</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      2909 Wilson · Room B
                    </div>
                  </div>
                  <span class="urgency-pill urgent">Urgent</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar">JP</span>
                    Joe's Plumbing
                  </div>
                  <span class="cost-pill">$180 est.</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Submitted yesterday
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign" title="Reassign vendor">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message" title="Message tenant">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status" title="Change status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ticket-card" data-ticket="disposal-jammed">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Kitchen disposal jammed</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      2907 Wilson
                    </div>
                  </div>
                  <span class="urgency-pill normal">Normal</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar orange">AR</span>
                    Acme Repair
                  </div>
                  <span class="cost-pill">$120 est.</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Submitted 3d ago
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 3: In Progress -->
          <div class="column" data-col="in-progress">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge orange"></span>
                In Progress
                <span class="count">2</span>
              </div>
            </div>
            <div class="column-body">

              <div class="ticket-card urgent-rail" data-ticket="hvac-not-cooling">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">HVAC not cooling</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      2909 Wilson
                    </div>
                  </div>
                  <span class="urgency-pill urgent">Urgent</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar green">TH</span>
                    Trane HVAC
                  </div>
                  <span class="cost-pill">$450 est.</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Started today
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ticket-card" data-ticket="garage-spring">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Garage door spring replacement</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span class="urgency-pill normal">Normal</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar purple">AG</span>
                    Acme Garage Co
                  </div>
                  <span class="cost-pill">$320 est.</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    On-site 1h
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 4: Awaiting Tenant -->
          <div class="column" data-col="awaiting-tenant">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge pink"></span>
                Awaiting Tenant
                <span class="count">1</span>
              </div>
            </div>
            <div class="column-body">

              <div class="ticket-card" data-ticket="carpet-consult">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Carpet cleaning consult</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      412 Pine St
                    </div>
                  </div>
                  <span class="urgency-pill low">Low</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar pink">CC</span>
                    Coastal Cleaning
                  </div>
                  <span class="cost-pill">$90 est.</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time warn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Pending scheduling
                  </div>
                  <div class="ticket-actions">
                    <div class="ticket-action assign">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    </div>
                    <div class="ticket-action message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="ticket-action status">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 5: Completed -->
          <div class="column" data-col="completed">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge green"></span>
                Completed
                <span class="count">15</span>
              </div>
            </div>
            <div class="column-body">

              <div class="ticket-card" data-ticket="hvac-filter">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">HVAC filter replacement</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      2909 Wilson
                    </div>
                  </div>
                  <span class="urgency-pill normal">Normal</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar green">AH</span>
                    Acme HVAC
                  </div>
                  <span class="cost-pill actual">$45 actual</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Completed Apr 8
                  </div>
                </div>
              </div>

              <div class="ticket-card" data-ticket="doorbell">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Doorbell repair</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      1523 Oak Ave
                    </div>
                  </div>
                  <span class="urgency-pill low">Low</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar">HM</span>
                    Handyman (Joe)
                  </div>
                  <span class="cost-pill actual">$85 actual</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Completed Apr 5
                  </div>
                </div>
              </div>

              <div class="ticket-card" data-ticket="smoke-detector">
                <div class="ticket-head">
                  <div>
                    <div class="ticket-title">Smoke detector batteries</div>
                    <div class="ticket-sub">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                      2907 Wilson
                    </div>
                  </div>
                  <span class="urgency-pill low">Low</span>
                </div>
                <div class="ticket-meta-row">
                  <div class="ticket-vendor">
                    <span class="vendor-avatar gray">HC</span>
                    Self (Harrison)
                  </div>
                  <span class="cost-pill actual">$0</span>
                </div>
                <div class="ticket-foot">
                  <div class="ticket-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Completed Apr 2
                  </div>
                </div>
              </div>

            </div>
            <div class="column-foot" id="view-all-completed">
              View all 15 completed →
            </div>
          </div>

        </div>
      </div>

      <!-- BULK ACTION BAR -->
      <div class="bulk-bar">
        <div class="bulk-count">3</div>
        <span>tickets selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
            Reassign vendor
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Update status
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Mark complete
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
            <h2 id="drawer-title">Leaky bathroom faucet</h2>
            <div class="drawer-head-sub">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; width:12px; height:12px; vertical-align:-1px; margin-right:4px;"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                <span id="drawer-sub">2909 Wilson · Room B</span>
              </span>
              <span id="drawer-urgency" class="urgency-pill urgent">Urgent</span>
            </div>
          </div>
          <button class="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Pipeline -->
        <div class="pipeline-bar">
          <div class="pipeline-label">Status pipeline</div>
          <div class="pipeline-steps" id="pipeline-steps">
            <div class="pipeline-step done"><div class="dot">1</div>New<div class="line"></div></div>
            <div class="pipeline-step current"><div class="dot">2</div>Assigned<div class="line"></div></div>
            <div class="pipeline-step"><div class="dot">3</div>In Progress<div class="line"></div></div>
            <div class="pipeline-step"><div class="dot">4</div>Awaiting Tenant<div class="line"></div></div>
            <div class="pipeline-step"><div class="dot">5</div>Completed<div class="line"></div></div>
          </div>
        </div>

        <div class="drawer-tabs">
          <div class="drawer-tab active" data-tab="details">Details</div>
          <div class="drawer-tab" data-tab="photos">
            Photos <span class="drawer-tab-count">4</span>
          </div>
          <div class="drawer-tab" data-tab="vendor">Vendor</div>
          <div class="drawer-tab" data-tab="comms">
            Comms <span class="drawer-tab-count">4</span>
          </div>
          <div class="drawer-tab" data-tab="costs">Costs</div>
        </div>

        <div class="drawer-body" id="drawer-body">
          <!-- Populated by JS -->
        </div>

        <div class="drawer-foot">
          <button class="btn btn-ghost" data-drawer-action="message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message tenant
          </button>
          <button class="btn btn-dark" data-drawer-action="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Update status
          </button>
          <button class="btn btn-primary" data-drawer-action="complete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Mark complete
          </button>
        </div>

      </div>

    </main>

  </div>

  <!-- Toast container -->
  <div id="toast-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 200; display: flex; flex-direction: column; gap: 8px;"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
