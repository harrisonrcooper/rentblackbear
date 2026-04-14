"use client";

// Mock ported verbatim from ~/Desktop/tenantory/properties.html.
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
      min-width: 320px; color: var(--text-faint);
    }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }
    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }

    /* Scrollable page area */
    .page-scroll { flex: 1; overflow-y: auto; }

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
    .stat-item { border-right: 1px solid var(--border); padding-right: 24px; }
    .stat-item:last-child { border-right: none; padding-right: 0; }
    .stat-label {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
    }
    .stat-value {
      font-size: 24px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.1;
      display: flex; align-items: baseline; gap: 8px;
      font-variant-numeric: tabular-nums;
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
    .saved-view-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }

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

    /* ===== Property grid ===== */
    .properties-grid-wrap { padding: 16px 28px 28px; }
    .properties-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    @media (max-width: 1100px) { .properties-grid { grid-template-columns: 1fr; } }

    .prop-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: all 0.15s ease; cursor: pointer;
      display: flex; flex-direction: column;
      position: relative;
    }
    .prop-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-2px); }
    .prop-card.selected-bulk { outline: 2px solid var(--pink); outline-offset: -2px; }

    .prop-photo {
      aspect-ratio: 16/9; width: 100%;
      position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .prop-photo.grad-pink { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--pink) 100%); }
    .prop-photo.grad-blue { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--blue-bright) 100%); }
    .prop-photo.grad-green { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--green) 100%); }
    .prop-photo.grad-gold { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--gold) 100%); }
    .prop-photo::after {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.18), transparent 60%);
      pointer-events: none;
    }
    .prop-photo-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: rgba(255,255,255,0.16); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.28);
      display: flex; align-items: center; justify-content: center;
      color: #fff; z-index: 2;
    }
    .prop-photo-icon svg { width: 28px; height: 28px; }
    .prop-photo-tag {
      position: absolute; top: 12px; left: 12px;
      padding: 5px 10px; border-radius: 100px;
      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);
      color: #fff; font-size: 11px; font-weight: 700;
      display: inline-flex; align-items: center; gap: 5px;
      border: 1px solid rgba(255,255,255,0.18); z-index: 2;
    }
    .prop-photo-tag svg { width: 11px; height: 11px; }
    .prop-photo-tag.vacant { background: rgba(255,73,152,0.85); }
    .prop-photo-badge {
      position: absolute; top: 12px; right: 12px;
      padding: 5px 10px; border-radius: 100px;
      background: rgba(255,255,255,0.92); color: var(--navy-dark);
      font-size: 11px; font-weight: 700; z-index: 2;
    }

    .prop-body { padding: 16px 18px 14px; flex: 1; display: flex; flex-direction: column; gap: 12px; }

    .prop-head-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .prop-name { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; line-height: 1.25; }
    .prop-address { font-size: 12px; color: var(--text-muted); margin-top: 2px; display: inline-flex; align-items: center; gap: 5px; }
    .prop-address svg { width: 12px; height: 12px; }

    .prop-type-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 9px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
      white-space: nowrap;
    }
    .prop-type-pill svg { width: 11px; height: 11px; }
    .prop-type-pill.coliving { background: var(--pink-bg); color: var(--pink); }
    .prop-type-pill.single { background: var(--blue-pale); color: var(--blue); }
    .prop-type-pill.multi { background: var(--purple-bg); color: var(--purple); }

    .prop-stats-row {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 12px; padding: 12px; background: var(--surface-alt);
      border-radius: 10px;
    }
    .prop-stat-cell { display: flex; flex-direction: column; gap: 2px; }
    .prop-stat-cell-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }
    .prop-stat-cell-value { font-size: 15px; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
    .prop-stat-cell-sub { font-size: 10px; color: var(--text-muted); }
    .prop-stat-cell-value.up { color: var(--green-dark); }
    .prop-stat-cell-value.warn { color: var(--orange); }

    .prop-occupancy {
      display: flex; flex-direction: column; gap: 6px;
    }
    .prop-occupancy-label {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; color: var(--text-muted);
    }
    .prop-occupancy-label strong { color: var(--text); font-weight: 700; }
    .prop-units-row { display: flex; gap: 4px; }
    .prop-unit-cell {
      flex: 1; height: 10px; border-radius: 4px;
      background: var(--surface-alt); border: 1px solid var(--border);
    }
    .prop-unit-cell.filled { background: var(--green); border-color: var(--green-dark); }
    .prop-unit-cell.vacant { background: var(--pink-bg); border-color: var(--pink); }
    .prop-unit-cell.listed { background: var(--gold); border-color: var(--gold); opacity: 0.7; }

    .prop-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid var(--border);
    }
    .prop-foot-left { font-size: 11px; color: var(--text-faint); }
    .prop-foot-right { display: flex; gap: 6px; align-items: center; }
    .prop-view-btn {
      padding: 6px 14px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 700;
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .prop-view-btn:hover { background: var(--blue); color: #fff; }
    .prop-view-btn svg { width: 12px; height: 12px; }
    .prop-menu-btn {
      width: 28px; height: 28px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .prop-menu-btn:hover { background: var(--border); color: var(--text); }
    .prop-menu-btn svg { width: 16px; height: 16px; }

    /* ===== DRAWER ===== */
    .drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3);
      opacity: 1; transition: opacity 0.2s ease;
      z-index: 40;
    }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 600px; background: var(--surface);
      box-shadow: var(--shadow-xl);
      display: flex; flex-direction: column;
      z-index: 41;
      border-left: 1px solid var(--border);
    }
    .drawer-hero {
      position: relative; height: 300px;
      display: flex; align-items: flex-end;
      padding: 20px 24px;
    }
    .drawer-hero.grad-pink { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--pink) 100%); }
    .drawer-hero.grad-blue { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--blue-bright) 100%); }
    .drawer-hero.grad-green { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--green) 100%); }
    .drawer-hero.grad-gold { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 40%, var(--gold) 100%); }
    .drawer-hero::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(20,32,74,0.1) 0%, rgba(20,32,74,0.65) 100%);
      pointer-events: none;
    }
    .drawer-hero-top {
      position: absolute; top: 16px; left: 20px; right: 20px;
      display: flex; justify-content: space-between; align-items: flex-start;
      z-index: 2;
    }
    .drawer-hero-badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .drawer-hero-badge {
      padding: 5px 10px; border-radius: 100px;
      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);
      color: #fff; font-size: 11px; font-weight: 700;
      border: 1px solid rgba(255,255,255,0.18);
      display: inline-flex; align-items: center; gap: 5px;
    }
    .drawer-hero-badge svg { width: 11px; height: 11px; }
    .drawer-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(20,32,74,0.55); backdrop-filter: blur(12px);
      color: #fff; border: 1px solid rgba(255,255,255,0.18);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .drawer-close:hover { background: rgba(20,32,74,0.8); }
    .drawer-close svg { width: 16px; height: 16px; }

    .drawer-hero-title {
      position: relative; z-index: 2; color: #fff;
    }
    .drawer-hero-title h2 {
      font-size: 22px; font-weight: 800;
      letter-spacing: -0.02em; line-height: 1.15;
      text-shadow: 0 1px 8px rgba(0,0,0,0.22);
    }
    .drawer-hero-title p {
      font-size: 13px; margin-top: 4px;
      color: rgba(255,255,255,0.92);
      display: inline-flex; align-items: center; gap: 5px;
      text-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    .drawer-hero-title svg { width: 12px; height: 12px; }

    .drawer-stats {
      padding: 18px 24px; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: repeat(5, 1fr);
      gap: 14px;
    }
    .drawer-stat {
      display: flex; flex-direction: column; gap: 3px;
      padding-right: 12px; border-right: 1px solid var(--border);
    }
    .drawer-stat:last-child { border-right: none; padding-right: 0; }
    .drawer-stat-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .drawer-stat-value {
      font-size: 15px; font-weight: 800; color: var(--text);
      letter-spacing: -0.01em; font-variant-numeric: tabular-nums;
    }
    .drawer-stat-value.up { color: var(--green-dark); }
    .drawer-stat-value.pink { color: var(--pink); }

    .drawer-tabs {
      padding: 0 24px; display: flex; gap: 4px;
      border-bottom: 1px solid var(--border);
      overflow-x: auto;
    }
    .drawer-tab {
      padding: 12px 14px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
      white-space: nowrap;
    }
    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
    .drawer-tab:hover:not(.active) { color: var(--text); }
    .drawer-tab-count {
      background: var(--surface-alt); color: var(--text-muted);
      padding: 1px 7px; border-radius: 100px;
      font-size: 10px; font-weight: 700;
    }
    .drawer-tab.active .drawer-tab-count { background: var(--blue-pale); color: var(--blue); }

    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
    .drawer-section { margin-bottom: 24px; }
    .drawer-section:last-child { margin-bottom: 0; }
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .drawer-section-head a {
      font-size: 11px; color: var(--blue); font-weight: 700;
      letter-spacing: 0; text-transform: none;
    }
    .drawer-row {
      display: grid; grid-template-columns: 140px 1fr; gap: 12px;
      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);
    }
    .drawer-row:last-child { border-bottom: none; }
    .drawer-row span:first-child { color: var(--text-muted); }
    .drawer-row span:last-child { color: var(--text); font-weight: 500; }
    .drawer-row .pill {
      display: inline-flex; padding: 2px 8px; border-radius: 100px;
      font-size: 11px; font-weight: 700; gap: 4px; align-items: center;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-gold { background: rgba(245,166,35,0.14); color: var(--gold); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }

    /* Room/Unit list */
    .room-list { display: flex; flex-direction: column; gap: 8px; }
    .room-item {
      display: grid;
      grid-template-columns: 42px 1fr auto auto;
      gap: 12px; align-items: center;
      padding: 12px; border: 1px solid var(--border);
      border-radius: 10px; background: var(--surface);
      transition: all 0.15s ease;
    }
    .room-item:hover { border-color: var(--blue); background: var(--surface-subtle); }
    .room-item.vacant { border-style: dashed; background: var(--pink-bg); border-color: var(--pink); }
    .room-item.listed { background: rgba(245,166,35,0.08); border-color: var(--gold); }
    .room-letter {
      width: 42px; height: 42px; border-radius: 10px;
      background: var(--navy); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 16px; letter-spacing: -0.02em;
    }
    .room-item.vacant .room-letter { background: var(--pink); }
    .room-item.listed .room-letter { background: var(--gold); color: #fff; }
    .room-info { min-width: 0; }
    .room-title { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
    .room-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .room-price {
      font-size: 13px; font-weight: 800; color: var(--text);
      font-variant-numeric: tabular-nums; text-align: right;
    }
    .room-price-sub { font-size: 10px; color: var(--text-faint); font-weight: 500; }
    .room-action { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); background: var(--surface-alt); }
    .room-action:hover { background: var(--blue-pale); color: var(--blue); }
    .room-action svg { width: 14px; height: 14px; }

    /* Tenants tab */
    .tenant-list { display: flex; flex-direction: column; gap: 8px; }
    .tenant-item {
      display: grid; grid-template-columns: 40px 1fr auto; gap: 12px;
      padding: 12px; border: 1px solid var(--border);
      border-radius: 10px; align-items: center;
      background: var(--surface); transition: all 0.15s ease;
    }
    .tenant-item:hover { border-color: var(--blue); }
    .tenant-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .tenant-avatar.blue { background: var(--blue-pale); color: var(--blue); }
    .tenant-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .tenant-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .tenant-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .tenant-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .tenant-info .name { font-size: 13px; font-weight: 700; color: var(--text); }
    .tenant-info .sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .tenant-lease {
      text-align: right; font-size: 11px; color: var(--text-muted);
    }
    .tenant-lease strong { display: block; font-size: 12px; color: var(--text); font-weight: 700; }

    /* Financials tab chart */
    .fin-chart {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: 10px; padding: 16px;
      margin-bottom: 16px;
    }
    .fin-chart-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 14px;
    }
    .fin-chart-title { font-size: 12px; font-weight: 700; color: var(--text); }
    .fin-legend { display: flex; gap: 12px; font-size: 11px; color: var(--text-muted); }
    .fin-legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }
    .fin-bars {
      display: grid; grid-template-columns: repeat(6, 1fr);
      gap: 10px; align-items: end; height: 140px;
    }
    .fin-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
    .fin-bar-col-bars { display: flex; gap: 3px; align-items: end; flex: 1; width: 100%; justify-content: center; }
    .fin-bar {
      width: 12px; border-radius: 4px 4px 0 0;
    }
    .fin-bar.income { background: var(--blue); }
    .fin-bar.expense { background: var(--pink); }
    .fin-bar-label { font-size: 10px; color: var(--text-muted); font-weight: 600; }

    .fin-summary {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    }
    .fin-summary-cell {
      padding: 12px; background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
    }
    .fin-summary-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }
    .fin-summary-value { font-size: 18px; font-weight: 800; color: var(--text); margin-top: 4px; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
    .fin-summary-sub { font-size: 11px; color: var(--green-dark); font-weight: 700; margin-top: 2px; }
    .fin-summary-sub.neg { color: var(--red); }

    /* Photos tab */
    .photos-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
    }
    .photo-tile {
      aspect-ratio: 4/3; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 12px;
      position: relative; overflow: hidden;
    }
    .photo-tile::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(160deg, rgba(255,255,255,0.18), transparent 60%);
    }
    .photo-tile span { position: relative; z-index: 2; background: rgba(20,32,74,0.55); backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 100px; font-size: 11px; }

    /* Documents tab */
    .doc-list { display: flex; flex-direction: column; gap: 8px; }
    .doc-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border: 1px solid var(--border);
      border-radius: 10px; background: var(--surface);
      transition: all 0.15s ease;
    }
    .doc-item:hover { border-color: var(--blue); background: var(--surface-subtle); }
    .doc-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .doc-icon svg { width: 16px; height: 16px; }
    .doc-info { flex: 1; min-width: 0; }
    .doc-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .doc-meta { font-size: 11px; color: var(--text-muted); }

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
      .drawer { width: 520px; }
      .drawer-stats { grid-template-columns: repeat(3, 1fr); }
      .drawer-stats .drawer-stat:nth-child(3) { border-right: none; }
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
          <a class="sb-nav-item active" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
            Properties
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
            <span class="sb-nav-count">7</span>
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
          <strong>Properties</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search properties, addresses, units...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <div class="page-scroll">

        <!-- Page head -->
        <div class="page-head-bar">
          <div>
            <h1>Properties</h1>
            <p>Your portfolio at a glance — units, occupancy, financials, rooms</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost" data-action="import">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Import
            </button>
            <button class="btn btn-primary" data-action="add-property">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add property
            </button>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="stats-strip">
          <div class="stat-item">
            <div class="stat-label">Total properties</div>
            <div class="stat-value">4</div>
            <div class="stat-sub"><span class="stat-delta gray">Across Huntsville, AL</span></div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total units / rooms</div>
            <div class="stat-value">23</div>
            <div class="stat-sub">11 units · 12 rooms</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Occupancy</div>
            <div class="stat-value">96% <span class="stat-delta up">+2% MoM</span></div>
            <div class="stat-sub">1 vacancy accepting apps</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Monthly income</div>
            <div class="stat-value">$24,850 <span class="stat-delta up">+6.1%</span></div>
            <div class="stat-sub">Gross collected</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Avg rent</div>
            <div class="stat-value" style="font-size: 18px;">$1,080 <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">/unit</span></div>
            <div class="stat-sub">$810/room · blended</div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="saved-views">
            <div class="saved-view active" data-filter="all">
              All <span class="saved-view-count">4</span>
            </div>
            <div class="saved-view" data-filter="coliving">
              Co-Living <span class="saved-view-count">2</span>
            </div>
            <div class="saved-view" data-filter="single">
              Single-family <span class="saved-view-count">1</span>
            </div>
            <div class="saved-view" data-filter="multi">
              Multifamily <span class="saved-view-count">1</span>
            </div>
            <div class="saved-view" data-filter="vacant">
              <span class="saved-view-dot"></span>
              Vacant <span class="saved-view-count">1</span>
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
              <button class="active" data-view="grid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Grid
              </button>
              <button data-view="map">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/></svg>
                Map
              </button>
            </div>
          </div>
        </div>

        <!-- Properties grid -->
        <div class="properties-grid-wrap">
          <div class="properties-grid">

            <!-- Card 1: Wilson Co-Living -->
            <div class="prop-card" data-property="wilson-2909" data-type="coliving vacant">
              <div class="prop-photo grad-pink">
                <div class="prop-photo-tag vacant">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                  Room D — in apps pipeline
                </div>
                <div class="prop-photo-badge">5 rooms</div>
                <div class="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21v-6h6v6"/></svg>
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-head-row">
                  <div>
                    <div class="prop-name">2909 Wilson Dr NW</div>
                    <div class="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Huntsville, AL 35805
                    </div>
                  </div>
                  <div class="prop-type-pill coliving">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
                    Co-Living
                  </div>
                </div>
                <div class="prop-stats-row">
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Rooms</span>
                    <span class="prop-stat-cell-value">5</span>
                    <span class="prop-stat-cell-sub">4 occupied</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Occupancy</span>
                    <span class="prop-stat-cell-value warn">80%</span>
                    <span class="prop-stat-cell-sub">1 vacancy</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Monthly</span>
                    <span class="prop-stat-cell-value up">$4,500</span>
                    <span class="prop-stat-cell-sub">gross</span>
                  </div>
                </div>
                <div class="prop-occupancy">
                  <div class="prop-occupancy-label">
                    <span>Room fill</span>
                    <span><strong>4</strong> / 5</span>
                  </div>
                  <div class="prop-units-row">
                    <div class="prop-unit-cell filled" title="Room A — Sarah Chen"></div>
                    <div class="prop-unit-cell filled" title="Room B — Marcus Lee"></div>
                    <div class="prop-unit-cell filled" title="Room C — Jordan Brooks"></div>
                    <div class="prop-unit-cell vacant" title="Room D — Vacant"></div>
                    <div class="prop-unit-cell filled" title="Room E — Rebecca Almeida"></div>
                  </div>
                </div>
                <div class="prop-foot">
                  <div class="prop-foot-left">Acquired Jun 2023 · 2,850 sqft</div>
                  <div class="prop-foot-right">
                    <button class="prop-menu-btn" data-menu>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <button class="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2: Wilson 2907 Single-Family -->
            <div class="prop-card" data-property="wilson-2907" data-type="single">
              <div class="prop-photo grad-blue">
                <div class="prop-photo-badge">1 unit</div>
                <div class="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21v-6h6v6"/></svg>
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-head-row">
                  <div>
                    <div class="prop-name">2907 Wilson Dr NW</div>
                    <div class="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Huntsville, AL 35805
                    </div>
                  </div>
                  <div class="prop-type-pill single">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                    Single-Family
                  </div>
                </div>
                <div class="prop-stats-row">
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Units</span>
                    <span class="prop-stat-cell-value">1</span>
                    <span class="prop-stat-cell-sub">Marcus Lee</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Occupancy</span>
                    <span class="prop-stat-cell-value up">100%</span>
                    <span class="prop-stat-cell-sub">Lease active</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Monthly</span>
                    <span class="prop-stat-cell-value up">$1,450</span>
                    <span class="prop-stat-cell-sub">+pet $35</span>
                  </div>
                </div>
                <div class="prop-occupancy">
                  <div class="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 1</span>
                  </div>
                  <div class="prop-units-row">
                    <div class="prop-unit-cell filled" title="Unit — Marcus Lee"></div>
                  </div>
                </div>
                <div class="prop-foot">
                  <div class="prop-foot-left">Acquired Mar 2022 · 1,480 sqft</div>
                  <div class="prop-foot-right">
                    <button class="prop-menu-btn" data-menu>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <button class="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 3: Oak Ave Single-Family -->
            <div class="prop-card" data-property="oak-1523" data-type="coliving single">
              <div class="prop-photo grad-green">
                <div class="prop-photo-badge">1 unit</div>
                <div class="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21v-6h6v6"/></svg>
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-head-row">
                  <div>
                    <div class="prop-name">1523 Oak Ave</div>
                    <div class="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Huntsville, AL 35801
                    </div>
                  </div>
                  <div class="prop-type-pill coliving">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
                    Co-Living
                  </div>
                </div>
                <div class="prop-stats-row">
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Units</span>
                    <span class="prop-stat-cell-value">1</span>
                    <span class="prop-stat-cell-sub">Kai Wong</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Occupancy</span>
                    <span class="prop-stat-cell-value up">100%</span>
                    <span class="prop-stat-cell-sub">Lease active</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Monthly</span>
                    <span class="prop-stat-cell-value up">$1,350</span>
                    <span class="prop-stat-cell-sub">utilities incl.</span>
                  </div>
                </div>
                <div class="prop-occupancy">
                  <div class="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 1</span>
                  </div>
                  <div class="prop-units-row">
                    <div class="prop-unit-cell filled" title="Unit — Kai Wong"></div>
                  </div>
                </div>
                <div class="prop-foot">
                  <div class="prop-foot-left">Acquired Oct 2021 · 1,320 sqft</div>
                  <div class="prop-foot-right">
                    <button class="prop-menu-btn" data-menu>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <button class="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 4: Pine St Multifamily Duplex -->
            <div class="prop-card" data-property="pine-412" data-type="multi vacant">
              <div class="prop-photo grad-gold">
                <div class="prop-photo-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Unit 2 — listed for rent
                </div>
                <div class="prop-photo-badge">Duplex · 2 units</div>
                <div class="prop-photo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l5-4 5 4v12"/><path d="M13 9l5-4 5 4v12H13"/><path d="M8 21v-6M18 21v-6"/></svg>
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-head-row">
                  <div>
                    <div class="prop-name">412 Pine St</div>
                    <div class="prop-address">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Huntsville, AL 35801
                    </div>
                  </div>
                  <div class="prop-type-pill multi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l5-4 5 4v12"/><path d="M13 9l5-4 5 4v12H13"/></svg>
                    Multifamily
                  </div>
                </div>
                <div class="prop-stats-row">
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Units</span>
                    <span class="prop-stat-cell-value">2</span>
                    <span class="prop-stat-cell-sub">1 occupied</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Occupancy</span>
                    <span class="prop-stat-cell-value warn">50%</span>
                    <span class="prop-stat-cell-sub">1 listed</span>
                  </div>
                  <div class="prop-stat-cell">
                    <span class="prop-stat-cell-label">Monthly</span>
                    <span class="prop-stat-cell-value up">$2,200</span>
                    <span class="prop-stat-cell-sub">both at full</span>
                  </div>
                </div>
                <div class="prop-occupancy">
                  <div class="prop-occupancy-label">
                    <span>Unit fill</span>
                    <span><strong>1</strong> / 2</span>
                  </div>
                  <div class="prop-units-row">
                    <div class="prop-unit-cell filled" title="Unit A — Dana Okafor"></div>
                    <div class="prop-unit-cell listed" title="Unit B — Listed $1,100"></div>
                  </div>
                </div>
                <div class="prop-foot">
                  <div class="prop-foot-left">Acquired Feb 2024 · 2,100 sqft</div>
                  <div class="prop-foot-right">
                    <button class="prop-menu-btn" data-menu>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                    <button class="prop-view-btn">
                      View
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Bulk bar -->
      <div class="bulk-bar">
        <div class="bulk-count">2</div>
        <span>properties selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary" data-bulk="settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5"/></svg>
            Update settings
          </button>
          <button class="bulk-btn" data-bulk="export">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export portfolio
          </button>
          <button class="bulk-btn" data-bulk="reports">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
            Generate reports
          </button>
        </div>
      </div>

      <!-- DETAIL DRAWER -->
      <div class="drawer-backdrop"></div>
      <div class="drawer">
        <div class="drawer-hero">
          <div class="drawer-hero-top">
            <div class="drawer-hero-badges"></div>
            <button class="drawer-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="drawer-hero-title">
            <h2></h2>
            <p></p>
          </div>
        </div>
        <div class="drawer-stats"></div>
        <div class="drawer-tabs"></div>
        <div class="drawer-body"></div>
        <div class="drawer-foot">
          <button class="btn btn-ghost" data-drawer-action="edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
            Edit property
          </button>
          <button class="btn btn-dark" data-drawer-action="add-room">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add room/unit
          </button>
          <button class="btn btn-primary" data-drawer-action="listing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M10 14 21 3M21 14v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/></svg>
            View on listing site
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
