"use client";

// Mock ported verbatim from ~/Desktop/tenantory/applications.html.
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
      grid-template-columns: repeat(6, minmax(280px, 1fr));
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
      font-size: 11px; font-weight: 700; color: var(--orange);
      display: inline-flex; align-items: center; gap: 3px;
    }
    .column-alert svg { width: 12px; height: 12px; }
    .column-body {
      padding: 12px; display: flex; flex-direction: column; gap: 10px;
      overflow-y: auto; flex: 1;
    }

    /* ===== Applicant card ===== */
    .appl-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
      transition: all 0.15s ease;
      cursor: pointer; position: relative;
    }
    .appl-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }
    .appl-card.selected { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.15); }
    .appl-card.flagged { border-left: 3px solid var(--pink); }

    .appl-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 10px; margin-bottom: 10px;
    }
    .appl-identity {
      display: flex; align-items: center; gap: 10px;
    }
    .appl-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; color: var(--blue);
      background: var(--blue-pale); flex-shrink: 0;
    }
    .appl-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .appl-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .appl-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .appl-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .appl-name { font-weight: 700; font-size: 14px; color: var(--text); line-height: 1.2; }
    .appl-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    .score-chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px; border-radius: 100px;
      font-size: 13px; font-weight: 800; letter-spacing: -0.01em;
      flex-shrink: 0;
    }
    .score-chip.strong { background: var(--green-bg); color: var(--green-dark); }
    .score-chip.moderate { background: var(--orange-bg); color: var(--orange); }
    .score-chip.risky { background: var(--red-bg); color: var(--red); }
    .score-chip.incomplete { background: var(--surface-alt); color: var(--text-muted); }
    .score-chip small { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-left: 3px; opacity: 0.8; }

    .appl-property {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--text-muted);
      margin-bottom: 10px;
    }
    .appl-property svg { width: 12px; height: 12px; }

    .appl-flags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
    .appl-flag {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 7px; border-radius: 4px;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .appl-flag.duplicate { background: var(--pink-bg); color: var(--pink); }
    .appl-flag.income { background: var(--orange-bg); color: var(--orange); }
    .appl-flag.eviction { background: var(--red-bg); color: var(--red); }
    .appl-flag.ai { background: var(--purple-bg); color: var(--purple); }
    .appl-flag svg { width: 10px; height: 10px; }

    /* Doc completeness */
    .appl-docs { margin-bottom: 10px; }
    .appl-docs-label {
      display: flex; justify-content: space-between; font-size: 11px;
      color: var(--text-muted); margin-bottom: 4px;
    }
    .appl-docs-label strong { color: var(--text); font-weight: 600; }
    .appl-docs-bar {
      height: 4px; background: var(--surface-alt); border-radius: 100px;
      overflow: hidden;
    }
    .appl-docs-fill {
      height: 100%; background: var(--blue); border-radius: 100px;
      transition: width 0.3s ease;
    }
    .appl-docs-fill.complete { background: var(--green); }
    .appl-docs-fill.partial { background: var(--orange); }

    /* Footer */
    .appl-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid var(--border);
    }
    .appl-time {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .appl-time svg { width: 12px; height: 12px; }
    .appl-time.warn { color: var(--orange); }
    .appl-time.urgent { color: var(--red); }
    .appl-actions { display: flex; gap: 4px; }
    .appl-action {
      width: 24px; height: 24px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .appl-action:hover { background: var(--surface-alt); color: var(--blue); }
    .appl-action.approve:hover { background: var(--green-bg); color: var(--green-dark); }
    .appl-action.reject:hover { background: var(--red-bg); color: var(--red); }
    .appl-action svg { width: 14px; height: 14px; }

    /* Empty column state */
    .column-empty {
      text-align: center; padding: 24px 16px;
      font-size: 12px; color: var(--text-faint);
    }
    .column-empty svg {
      width: 28px; height: 28px; margin: 0 auto 8px; opacity: 0.3;
    }

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

    .drawer-score {
      padding: 20px 24px; border-bottom: 1px solid var(--border);
      display: flex; gap: 20px; align-items: center;
    }
    .drawer-score-big {
      width: 72px; height: 72px; border-radius: 16px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
      font-size: 30px; font-weight: 800; letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .drawer-score-breakdown { flex: 1; }
    .drawer-score-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }
    .breakdown-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    }
    .breakdown-item {
      display: flex; justify-content: space-between; font-size: 12px;
    }
    .breakdown-item span:first-child { color: var(--text-muted); }
    .breakdown-item strong { font-weight: 700; color: var(--green-dark); font-variant-numeric: tabular-nums; }

    .drawer-tabs {
      padding: 0 24px; display: flex; gap: 4px;
      border-bottom: 1px solid var(--border);
    }
    .drawer-tab {
      padding: 12px 14px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
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
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
    }
    .drawer-row {
      display: grid; grid-template-columns: 120px 1fr; gap: 12px;
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

    /* hide for small screens (demo-only — real app responsive) */
    @media (max-width: 1200px) {
      .drawer { width: 420px; }
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
          <a class="sb-nav-item active" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>Applications
            <span class="sb-nav-badge">7</span>
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
          <strong>Applications</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search applicants, properties…">
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
          <h1>Applications</h1>
          <p>Pipeline from lead to lease — scored, flagged, and FCRA-ready.</p>
        </div>
        <div class="page-head-actions">
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            Share apply link
          </button>
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Invite applicant
          </button>
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            New application
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-item">
          <div class="stat-label">Open applications</div>
          <div class="stat-value">7 <span class="stat-delta pink">+3 today</span></div>
          <div class="stat-sub">Across 4 properties</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg. score</div>
          <div class="stat-value">84</div>
          <div class="stat-sub">Last 30 days</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Time to decision</div>
          <div class="stat-value">18h</div>
          <div class="stat-sub">-42% vs. quarter</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Approved this month</div>
          <div class="stat-value">5 <span class="stat-delta up">+2</span></div>
          <div class="stat-sub">3 moved in already</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Needs your review</div>
          <div class="stat-value" style="color: var(--orange);">2 <span class="stat-delta orange">SLA risk</span></div>
          <div class="stat-sub">Waiting &gt;24h</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="saved-views">
          <div class="saved-view active">
            All <span class="saved-view-count">23</span>
          </div>
          <div class="saved-view">
            <span class="saved-view-dot"></span>
            New today <span class="saved-view-count">3</span>
          </div>
          <div class="saved-view">
            High score <span class="saved-view-count">8</span>
          </div>
          <div class="saved-view">
            Needs docs <span class="saved-view-count">4</span>
          </div>
          <div class="saved-view">
            Flagged <span class="saved-view-count">2</span>
          </div>
          <div class="saved-view">
            My waitlist <span class="saved-view-count">6</span>
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

          <!-- Column 1: Leads -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge gray"></span>
                Leads
                <span class="count">4</span>
              </div>
            </div>
            <div class="column-body">

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar purple">TR</div>
                    <div>
                      <div class="appl-name">Tara Ramirez</div>
                      <div class="appl-sub">Replied to listing · apartments.com</div>
                    </div>
                  </div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room D
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>2h in stage</div>
                  <div class="appl-actions">
                    <div class="appl-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div class="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar">DJ</div>
                    <div>
                      <div class="appl-name">Derek Jackson</div>
                      <div class="appl-sub">Called · referred by Sarah Chen</div>
                    </div>
                  </div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>6h in stage</div>
                  <div class="appl-actions">
                    <div class="appl-action"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div class="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar green">EN</div>
                    <div>
                      <div class="appl-name">Emma Novak</div>
                      <div class="appl-sub">Walk-in · open house</div>
                    </div>
                  </div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room D
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Yesterday</div>
                  <div class="appl-actions">
                    <div class="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar orange">AM</div>
                    <div>
                      <div class="appl-name">Alex Morales</div>
                      <div class="appl-sub">Inbound inquiry form</div>
                    </div>
                  </div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2907 Wilson
                </div>
                <div class="appl-foot">
                  <div class="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>3d — follow up</div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 2: Screening -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge blue"></span>
                Screening
                <span class="count">5</span>
              </div>
              <span class="column-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                1 overdue
              </span>
            </div>
            <div class="column-body">

              <div class="appl-card selected">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar">SC</div>
                    <div>
                      <div class="appl-name">Sarah Chen</div>
                      <div class="appl-sub">Submitted 2h ago</div>
                    </div>
                  </div>
                  <div class="score-chip strong">92<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room A
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents</span>
                    <strong>5 of 5</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill complete" style="width: 100%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>2h in stage</div>
                  <div class="appl-actions">
                    <div class="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                    <div class="appl-action reject"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="appl-card flagged">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar pink">MJ</div>
                    <div>
                      <div class="appl-name">Marcus Johnson</div>
                      <div class="appl-sub">Submitted 5h ago</div>
                    </div>
                  </div>
                  <div class="score-chip moderate">74<small>OK</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave
                </div>
                <div class="appl-flags">
                  <span class="appl-flag duplicate">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Duplicate
                  </span>
                  <span class="appl-flag income">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Low income
                  </span>
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents</span>
                    <strong>3 of 5</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill partial" style="width: 60%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>5h — review</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar green">RA</div>
                    <div>
                      <div class="appl-name">Rebecca Almeida</div>
                      <div class="appl-sub">Submitted yesterday</div>
                    </div>
                  </div>
                  <div class="score-chip strong">89<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room E
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents</span>
                    <strong>4 of 5</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill" style="width: 80%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>19h in stage</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar">NK</div>
                    <div>
                      <div class="appl-name">Nathan Kim</div>
                      <div class="appl-sub">Submitted 2 days ago</div>
                    </div>
                  </div>
                  <div class="score-chip incomplete">—<small>Scoring</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2907 Wilson
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents</span>
                    <strong>2 of 5</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill partial" style="width: 40%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>2d — needs docs</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar orange">BA</div>
                    <div>
                      <div class="appl-name">Brianna Adams</div>
                      <div class="appl-sub">Submitted 3h ago</div>
                    </div>
                  </div>
                  <div class="score-chip strong">86<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room F
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents</span>
                    <strong>5 of 5</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill complete" style="width: 100%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>3h in stage</div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 3: Review (PM decision) -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge orange"></span>
                Review
                <span class="count">2</span>
              </div>
              <span class="column-alert" style="color: var(--red);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                SLA risk
              </span>
            </div>
            <div class="column-body">

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar purple">JL</div>
                    <div>
                      <div class="appl-name">Jessica Liu</div>
                      <div class="appl-sub">Ready for decision</div>
                    </div>
                  </div>
                  <div class="score-chip strong">94<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room A
                </div>
                <div class="appl-flags">
                  <span class="appl-flag ai">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7v10l10 5 10-5V7z"/></svg>
                    AI: Top candidate
                  </span>
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents · References</span>
                    <strong>5 of 5 · 3 of 3</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill complete" style="width: 100%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>22h pending</div>
                  <div class="appl-actions">
                    <div class="appl-action approve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                    <div class="appl-action reject"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
                  </div>
                </div>
              </div>

              <div class="appl-card flagged">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar green">WP</div>
                    <div>
                      <div class="appl-name">Wes Peterson</div>
                      <div class="appl-sub">Ready for decision</div>
                    </div>
                  </div>
                  <div class="score-chip risky">62<small>Risky</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave
                </div>
                <div class="appl-flags">
                  <span class="appl-flag eviction">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                    Eviction (2022)
                  </span>
                </div>
                <div class="appl-docs">
                  <div class="appl-docs-label">
                    <span>Documents · References</span>
                    <strong>5 of 5 · 2 of 3</strong>
                  </div>
                  <div class="appl-docs-bar"><div class="appl-docs-fill" style="width: 90%;"></div></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time urgent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>2d — decide now</div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 4: Approved -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge green"></span>
                Approved
                <span class="count">3</span>
              </div>
            </div>
            <div class="column-body">

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar green">JB</div>
                    <div>
                      <div class="appl-name">Jordan Brooks</div>
                      <div class="appl-sub">Lease signing scheduled</div>
                    </div>
                  </div>
                  <div class="score-chip strong">91<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2909 Wilson, Room C
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>Move-in Apr 20</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar pink">CM</div>
                    <div>
                      <div class="appl-name">Carmen Miller</div>
                      <div class="appl-sub">Lease sent · awaiting signature</div>
                    </div>
                  </div>
                  <div class="score-chip strong">88<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  2907 Wilson
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>Sent 4h ago</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar">KW</div>
                    <div>
                      <div class="appl-name">Kai Wong</div>
                      <div class="appl-sub">Lease signed · onboarding</div>
                    </div>
                  </div>
                  <div class="score-chip strong">95<small>Strong</small></div>
                </div>
                <div class="appl-property">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  1523 Oak Ave
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Ready to move in</div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column 5: Waitlist -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge pink"></span>
                Waitlist
                <span class="count">6</span>
              </div>
            </div>
            <div class="column-body">

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar orange">MR</div>
                    <div>
                      <div class="appl-name">Mei Richardson</div>
                      <div class="appl-sub">Waitlisted for 2909 Wilson</div>
                    </div>
                  </div>
                  <div class="score-chip strong">87<small>Strong</small></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>On waitlist 8d</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar green">TO</div>
                    <div>
                      <div class="appl-name">Tyler Owens</div>
                      <div class="appl-sub">Waitlisted for 1523 Oak Ave</div>
                    </div>
                  </div>
                  <div class="score-chip moderate">79<small>OK</small></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>On waitlist 14d</div>
                </div>
              </div>

              <div class="column-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                4 more on waitlist
              </div>

            </div>
          </div>

          <!-- Column 6: Rejected -->
          <div class="column">
            <div class="column-head">
              <div class="column-title">
                <span class="dot-badge red"></span>
                Rejected
                <span class="count">3</span>
              </div>
            </div>
            <div class="column-body">

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar">PG</div>
                    <div>
                      <div class="appl-name">Parker Gates</div>
                      <div class="appl-sub">FCRA notice sent</div>
                    </div>
                  </div>
                  <div class="score-chip risky">48<small>Risky</small></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Rejected 3d ago</div>
                </div>
              </div>

              <div class="appl-card">
                <div class="appl-head">
                  <div class="appl-identity">
                    <div class="appl-avatar orange">LA</div>
                    <div>
                      <div class="appl-name">Leo Anderson</div>
                      <div class="appl-sub">Insufficient income</div>
                    </div>
                  </div>
                  <div class="score-chip risky">55<small>Risky</small></div>
                </div>
                <div class="appl-foot">
                  <div class="appl-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Rejected 5d ago</div>
                </div>
              </div>

              <div class="column-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                1 more rejected
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- BULK ACTION BAR -->
      <div class="bulk-bar">
        <div class="bulk-count">3</div>
        <span>applicants selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Approve
          </button>
          <button class="bulk-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message
          </button>
          <button class="bulk-btn">
            Move to Waitlist
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
              <p>Applied 2h ago · 2909 Wilson Dr NW, Room A · $850/mo</p>
            </div>
          </div>
          <button class="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="drawer-score">
          <div class="drawer-score-big">92</div>
          <div class="drawer-score-breakdown">
            <div class="drawer-score-label">Score breakdown</div>
            <div class="breakdown-grid">
              <div class="breakdown-item"><span>Income ratio</span><strong>28 / 30</strong></div>
              <div class="breakdown-item"><span>Credit</span><strong>24 / 25</strong></div>
              <div class="breakdown-item"><span>Background</span><strong>25 / 25</strong></div>
              <div class="breakdown-item"><span>References</span><strong>15 / 20</strong></div>
            </div>
          </div>
        </div>

        <div class="drawer-tabs">
          <div class="drawer-tab active">
            Overview
          </div>
          <div class="drawer-tab">
            Documents
            <span class="drawer-tab-count">5/5</span>
          </div>
          <div class="drawer-tab">
            References
            <span class="drawer-tab-count">3/3</span>
          </div>
          <div class="drawer-tab">
            Activity
          </div>
        </div>

        <div class="drawer-body">

          <div class="drawer-section">
            <div class="drawer-section-head">Applicant</div>
            <div class="drawer-row"><span>Email</span><span>sarah.chen@email.com</span></div>
            <div class="drawer-row"><span>Phone</span><span>(256) 555-0142</span></div>
            <div class="drawer-row"><span>Date of birth</span><span>Mar 14, 1995 (31 yrs)</span></div>
            <div class="drawer-row"><span>Current address</span><span>2014 Jefferson St, Huntsville, AL</span></div>
            <div class="drawer-row"><span>Move-in date</span><span>May 1, 2026</span></div>
          </div>

          <div class="drawer-section">
            <div class="drawer-section-head">Employment &amp; Income</div>
            <div class="drawer-row"><span>Employer</span><span>Redstone Federal</span></div>
            <div class="drawer-row"><span>Role</span><span>Senior Product Designer</span></div>
            <div class="drawer-row"><span>Monthly income</span><span>$6,400</span></div>
            <div class="drawer-row"><span>Income-to-rent ratio</span><span style="color: var(--green-dark); font-weight: 700;">7.5x · Strong</span></div>
          </div>

          <div class="drawer-section">
            <div class="drawer-section-head">Documents received</div>
            <div class="doc-grid">
              <div class="doc-tile received">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Photo ID — Front</div>
                  <div class="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div class="doc-tile received">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Photo ID — Back</div>
                  <div class="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div class="doc-tile received">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Pay Stub — Mar</div>
                  <div class="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div class="doc-tile received">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Pay Stub — Feb</div>
                  <div class="doc-tile-meta">Uploaded 2h ago</div>
                </div>
              </div>
              <div class="doc-tile received">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Background Check</div>
                  <div class="doc-tile-meta">Clear · $25</div>
                </div>
              </div>
              <div class="doc-tile pending">
                <div class="doc-tile-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div class="doc-tile-text">
                  <div class="doc-tile-name">Pet application</div>
                  <div class="doc-tile-meta">Not required</div>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <div class="drawer-section-head">Recent activity</div>
            <div class="activity-feed">
              <div class="activity-node green">
                <div class="activity-node-title">Application submitted</div>
                <div class="activity-node-body">All required documents uploaded via branded portal</div>
                <div class="activity-node-time">2h ago</div>
              </div>
              <div class="activity-node pink">
                <div class="activity-node-title">AI scoring complete · 92 / 100</div>
                <div class="activity-node-body">Automatically scored on income, credit, background, references</div>
                <div class="activity-node-time">2h ago</div>
              </div>
              <div class="activity-node">
                <div class="activity-node-title">Background check passed</div>
                <div class="activity-node-body">Clear · processed via TransUnion SmartMove · $25</div>
                <div class="activity-node-time">1h ago</div>
              </div>
              <div class="activity-node">
                <div class="activity-node-title">Employment reference confirmed</div>
                <div class="activity-node-body">Jennifer Martinez (Redstone Federal) — responded: "excellent, would rehire"</div>
                <div class="activity-node-time">45m ago</div>
              </div>
            </div>
          </div>

        </div>

        <div class="drawer-foot">
          <button class="btn btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message
          </button>
          <button class="btn btn-dark">
            Waitlist
          </button>
          <button class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Approve
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
