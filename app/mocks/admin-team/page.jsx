"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-team.html.
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
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

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

    [data-theme="hearth"] {
      --navy: #8a6a1f; --navy-dark: #6b4f12; --navy-darker: #4a3608;
      --blue: #c88318; --blue-bright: #f5a623; --blue-pale: #fdf0d4;
      --pink: #1ea97c; --pink-bg: rgba(30,169,124,0.12); --pink-strong: rgba(30,169,124,0.22);
      --text: #3a2e14; --text-muted: #6b5830; --text-faint: #9b8558;
      --surface: #ffffff; --surface-alt: #fdf6e8; --surface-subtle: #fbf3e0;
      --border: #ecdbb5; --border-strong: #d4bd87;
    }
    [data-theme="nocturne"] {
      --navy: #000000; --navy-dark: #000000; --navy-darker: #000000;
      --blue: #00e5ff; --blue-bright: #00e5ff; --blue-pale: rgba(0,229,255,0.12);
      --pink: #ff00aa; --pink-bg: rgba(255,0,170,0.15); --pink-strong: rgba(255,0,170,0.28);
      --text: #e8e8ff; --text-muted: #a8a8c8; --text-faint: #6868aa;
      --surface: #12121e; --surface-alt: #0a0a12; --surface-subtle: #1a1a2e;
      --border: #2a2a3a; --border-strong: #3a3a4a;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
      --shadow: 0 4px 16px rgba(0,0,0,0.5);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
    }
    [data-theme="slate"] {
      --navy: #2a2a2e; --navy-dark: #1a1a1e; --navy-darker: #0e0e12;
      --blue: #2c6fe0; --blue-bright: #4a8af0; --blue-pale: #edf3fc;
      --pink: #2c6fe0; --pink-bg: rgba(44,111,224,0.1); --pink-strong: rgba(44,111,224,0.22);
      --text: #1a1a1a; --text-muted: #5a5a60; --text-faint: #8a8a92;
      --surface: #ffffff; --surface-alt: #fafafa; --surface-subtle: #f5f5f7;
      --border: #e3e3e6; --border-strong: #c0c0c8;
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
    .topbar-breadcrumb a:hover { color: var(--blue); }
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

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-dark { background: var(--navy); color: #fff; }
    .btn-dark:hover { background: var(--navy-dark); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; }
    .btn-danger { background: var(--surface); border: 1px solid var(--red); color: var(--red); }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .btn-danger-solid { background: var(--red); color: #fff; }
    .btn-danger-solid:hover { background: #b93a3a; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Settings layout ===== */
    .settings-wrap {
      flex: 1; overflow: auto;
      padding: 20px 28px 28px;
      display: flex; flex-direction: column; gap: 18px;
    }
    .settings-grid {
      display: grid; grid-template-columns: 200px 1fr;
      gap: 24px; align-items: flex-start;
      flex: 1; min-height: 0;
    }
    .sub-nav {
      position: sticky; top: 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 8px;
      display: flex; flex-direction: column; gap: 2px;
    }
    .sub-nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease; position: relative;
      text-align: left; width: 100%;
    }
    .sub-nav-item:hover { background: var(--surface-alt); color: var(--text); }
    .sub-nav-item.active { background: var(--pink-bg); color: var(--text); }
    .sub-nav-item.active::before {
      content: ""; position: absolute; left: 0; top: 8px; bottom: 8px;
      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;
    }
    .sub-nav-item svg { width: 15px; height: 15px; opacity: 0.7; }
    .sub-nav-item.active svg { color: var(--pink); opacity: 1; }

    .panel-col { min-width: 0; display: flex; flex-direction: column; gap: 18px; }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 18px; }
    .eyebrow {
      font-size: 11px; font-weight: 700; color: var(--pink);
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;
    }
    .card-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; }
    .card-head p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

    /* Plan callout */
    .plan-callout {
      display: flex; align-items: center; justify-content: space-between; gap: 20px;
      padding: 16px 20px; border-radius: var(--radius-lg);
      background: linear-gradient(120deg, rgba(255,73,152,0.08), rgba(18,81,173,0.06));
      border: 1px solid var(--border);
    }
    .plan-callout-left { display: flex; align-items: center; gap: 14px; }
    .plan-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--pink), var(--blue-bright));
      color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(255,73,152,0.25);
    }
    .plan-icon svg { width: 20px; height: 20px; }
    .plan-text { font-size: 13px; color: var(--text); line-height: 1.45; }
    .plan-text strong { font-weight: 700; }
    .plan-meter {
      display: flex; flex-direction: column; gap: 6px; min-width: 220px;
    }
    .plan-meter-bar {
      height: 6px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 100px; overflow: hidden;
    }
    .plan-meter-fill { height: 100%; width: 60%; background: linear-gradient(90deg, var(--blue-bright), var(--pink)); border-radius: 100px; }
    .plan-meter-label { font-size: 11px; font-weight: 600; color: var(--text-muted); display: flex; justify-content: space-between; }

    /* Invite card */
    .invite-grid {
      display: grid; grid-template-columns: 2fr 180px;
      gap: 14px; align-items: flex-start;
    }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }
    .field-hint { font-size: 11px; color: var(--text-faint); }
    .field-input, .field-select, .field-textarea {
      padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); font-size: 13px; color: var(--text);
      transition: all 0.15s ease; outline: none; width: 100%;
    }
    .field-textarea { resize: vertical; min-height: 68px; }
    .field-input:focus, .field-select:focus, .field-textarea:focus {
      border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12);
    }
    .invite-footer {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 14px; gap: 12px;
    }
    .invite-footer-hint { font-size: 12px; color: var(--text-faint); }

    /* Members table */
    .members-table {
      width: 100%; border-collapse: collapse;
    }
    .members-table th {
      text-align: left; padding: 11px 14px;
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
      background: var(--surface-subtle); border-bottom: 1px solid var(--border);
    }
    .members-table th:first-child { border-top-left-radius: 10px; }
    .members-table th:last-child { border-top-right-radius: 10px; text-align: right; }
    .members-table td {
      padding: 14px; border-bottom: 1px solid var(--border);
      font-size: 13px; vertical-align: middle;
    }
    .members-table tbody tr { transition: background 0.15s ease, opacity 0.3s ease; }
    .members-table tbody tr:hover { background: var(--surface-subtle); }
    .members-table tbody tr:last-child td { border-bottom: none; }
    .members-table tbody tr.fading { opacity: 0; }
    .members-table tbody tr.placeholder { background: repeating-linear-gradient(135deg, var(--surface-subtle), var(--surface-subtle) 8px, var(--surface-alt) 8px, var(--surface-alt) 16px); }
    .members-table-wrap {
      border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
    }

    .member-cell { display: flex; align-items: center; gap: 12px; }
    .member-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--blue-bright), var(--navy));
    }
    .member-avatar.pink { background: linear-gradient(135deg, var(--pink), var(--gold)); }
    .member-avatar.green { background: linear-gradient(135deg, var(--green), #2bc39a); }
    .member-avatar.purple { background: linear-gradient(135deg, var(--purple), var(--pink)); }
    .member-avatar.pending {
      background: var(--surface-alt); color: var(--text-faint);
      border: 1.5px dashed var(--border-strong);
    }
    .member-avatar.placeholder-av {
      background: var(--surface); color: var(--text-faint);
      border: 1.5px dashed var(--border-strong);
    }
    .member-name { font-weight: 600; color: var(--text); }
    .member-email { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
    .member-self { font-size: 10px; font-weight: 700; color: var(--pink); background: var(--pink-bg); padding: 2px 7px; border-radius: 100px; margin-left: 6px; letter-spacing: 0.04em; }

    .role-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 11px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
      cursor: pointer; transition: all 0.15s ease;
      border: 1px solid transparent; position: relative;
    }
    .role-pill svg.chev { width: 11px; height: 11px; opacity: 0.6; }
    .role-pill:hover { transform: translateY(-1px); }
    .role-owner { background: var(--navy); color: #fff; cursor: default; }
    .role-owner:hover { transform: none; }
    .role-admin { background: var(--pink-bg); color: var(--pink); }
    .role-manager { background: var(--blue-pale); color: var(--blue); }
    .role-viewer { background: var(--surface-alt); color: var(--text-muted); border-color: var(--border); }

    .role-menu {
      position: absolute; top: calc(100% + 6px); left: 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; box-shadow: var(--shadow-lg);
      padding: 5px; min-width: 200px; z-index: 20;
      display: none; flex-direction: column; gap: 1px;
    }
    .role-menu.open { display: flex; }
    .role-menu button {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 7px;
      font-size: 12px; font-weight: 600; color: var(--text);
      text-align: left; width: 100%;
    }
    .role-menu button:hover { background: var(--surface-alt); }
    .role-menu button .rm-title { font-weight: 700; }
    .role-menu button .rm-sub { font-size: 11px; color: var(--text-faint); font-weight: 500; margin-top: 1px; }
    .role-menu button .rm-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .role-menu button .rm-text { flex: 1; display: flex; flex-direction: column; }

    .cell-muted { color: var(--text-muted); font-size: 12px; }
    .cell-strong { color: var(--text); font-weight: 500; }
    .active-dot {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--green-dark); font-weight: 600; font-size: 12px;
    }
    .active-dot::before {
      content: ""; width: 7px; height: 7px; border-radius: 50%;
      background: var(--green); box-shadow: 0 0 0 3px var(--green-bg);
    }

    .row-actions { display: flex; justify-content: flex-end; gap: 6px; }
    .icon-btn {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; border: 1px solid transparent;
    }
    .icon-btn:hover { background: var(--blue-pale); color: var(--blue); border-color: var(--blue-pale); }
    .icon-btn.danger:hover { background: var(--red-bg); color: var(--red); border-color: var(--red-bg); }
    .icon-btn svg { width: 14px; height: 14px; }
    .icon-btn.disabled { opacity: 0.35; pointer-events: none; }

    .pending-mini-btns { display: flex; gap: 6px; }
    .mini-btn {
      padding: 4px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 600;
      background: var(--surface); border: 1px solid var(--border); color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .mini-btn:hover { border-color: var(--blue); color: var(--blue); }
    .mini-btn.danger:hover { border-color: var(--red); color: var(--red); }

    .placeholder-cta {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 600; color: var(--text-faint);
      padding: 6px 12px; border-radius: 100px;
      border: 1px dashed var(--border-strong); background: transparent;
      transition: all 0.15s ease;
    }
    .placeholder-cta:hover { color: var(--blue); border-color: var(--blue); background: var(--blue-pale); }
    .placeholder-cta svg { width: 12px; height: 12px; }

    /* Roles explainer */
    .roles-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    }
    @media (max-width: 1100px) { .roles-grid { grid-template-columns: 1fr; } }
    .role-card {
      padding: 18px; border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface-subtle); display: flex; flex-direction: column; gap: 10px;
    }
    .role-card-head {
      display: flex; align-items: center; gap: 10px;
    }
    .role-card-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }
    .role-card-icon svg { width: 16px; height: 16px; }
    .role-card-icon.admin { background: var(--pink); }
    .role-card-icon.manager { background: var(--blue); }
    .role-card-icon.viewer { background: var(--text-muted); }
    .role-card h4 { font-size: 14px; font-weight: 800; letter-spacing: -0.01em; }
    .role-card-sub { font-size: 11px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; }
    .role-perms { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .role-perm {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 12px; color: var(--text-muted); line-height: 1.4;
    }
    .role-perm svg { width: 13px; height: 13px; flex-shrink: 0; margin-top: 2px; }
    .role-perm.yes svg { color: var(--green); }
    .role-perm.no svg { color: var(--red); opacity: 0.7; }

    /* Activity log */
    .activity-head {
      display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 14px;
    }
    .filter-chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .filter-chip {
      padding: 5px 12px; border-radius: 100px;
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      background: var(--surface-alt); border: 1px solid var(--border);
      transition: all 0.15s ease;
    }
    .filter-chip:hover { color: var(--text); border-color: var(--border-strong); }
    .filter-chip.active { background: var(--navy); color: #fff; border-color: var(--navy); }

    .activity-list { display: flex; flex-direction: column; }
    .activity-row {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 4px; border-bottom: 1px dashed var(--border);
      transition: opacity 0.2s ease;
    }
    .activity-row:last-child { border-bottom: none; }
    .activity-row.hidden { display: none; }
    .activity-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 10px; flex-shrink: 0;
    }
    .activity-avatar.a-hc { background: linear-gradient(135deg, var(--pink), var(--gold)); }
    .activity-avatar.a-mc { background: linear-gradient(135deg, var(--blue-bright), var(--navy)); }
    .activity-avatar.a-jr { background: linear-gradient(135deg, var(--green), #2bc39a); }
    .activity-avatar.a-sys { background: var(--surface-alt); color: var(--text-faint); border: 1.5px dashed var(--border-strong); }
    .activity-main { flex: 1; font-size: 13px; }
    .activity-actor { font-weight: 700; color: var(--text); }
    .activity-verb { color: var(--text-muted); }
    .activity-target { font-weight: 600; color: var(--text); }
    .activity-time { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* Security card */
    .sec-row {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .sec-row:last-of-type { border-bottom: none; padding-bottom: 0; }
    .sec-row-info { flex: 1; min-width: 0; }
    .sec-row-title { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
    .sec-row-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.45; }
    .upsell-pill {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 100px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      background: var(--purple-bg); color: var(--purple);
    }

    .switch { width: 36px; height: 20px; background: var(--border-strong); border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px;
      width: 16px; height: 16px; border-radius: 50%; background: var(--surface);
      transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .switch.on { background: var(--green); }
    .switch.on::after { transform: translateX(16px); }
    .switch.disabled { opacity: 0.4; cursor: not-allowed; }

    .danger-zone {
      margin-top: 20px; padding: 18px 20px;
      border: 1px solid var(--red); border-radius: var(--radius-lg);
      background: rgba(214,69,69,0.03);
      display: flex; justify-content: space-between; align-items: center; gap: 20px;
    }
    .danger-zone h4 { font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: 4px; }
    .danger-zone p { font-size: 12px; color: var(--text-muted); }

    /* Toast */
    .toast-container {
      position: fixed; bottom: 24px; right: 24px; z-index: 1000;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    }
    .toast {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px 12px 14px; border-radius: 12px;
      background: var(--navy-dark); color: #fff;
      box-shadow: var(--shadow-lg); min-width: 280px;
      font-size: 13px; font-weight: 500;
      animation: toastIn 0.22s ease-out;
      pointer-events: auto;
    }
    .toast.success { background: linear-gradient(135deg, var(--green), var(--green-dark)); }
    .toast.info { background: var(--navy); }
    .toast.warn { background: linear-gradient(135deg, var(--orange), #c87025); }
    .toast svg { width: 18px; height: 18px; flex-shrink: 0; }
    .toast.leaving { animation: toastOut 0.2s ease-in forwards; }
    @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes toastOut { to { opacity: 0; transform: translateY(6px); } }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(20,32,74,0.45);
      backdrop-filter: blur(4px);
      display: none; align-items: center; justify-content: center;
      z-index: 900; padding: 24px;
      animation: bdIn 0.18s ease-out;
    }
    .modal-backdrop.open { display: flex; }
    @keyframes bdIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: var(--surface); border-radius: var(--radius-lg);
      width: 100%; max-width: 460px;
      box-shadow: var(--shadow-xl);
      animation: modalIn 0.22s ease-out;
      overflow: hidden;
    }
    @keyframes modalIn { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }
    .modal-head { padding: 20px 22px 10px; display: flex; gap: 14px; align-items: flex-start; }
    .modal-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .modal-icon.danger { background: var(--red-bg); color: var(--red); }
    .modal-icon.warn { background: var(--orange-bg); color: var(--orange); }
    .modal-icon svg { width: 20px; height: 20px; }
    .modal h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
    .modal-body { padding: 0 22px 16px 76px; font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .modal-body strong { color: var(--text); }
    .modal-confirm-input {
      margin-top: 12px; padding: 9px 12px;
      border: 1px solid var(--border); border-radius: 8px;
      width: 100%; font-size: 13px; outline: none;
      font-family: 'JetBrains Mono', monospace;
    }
    .modal-confirm-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,69,69,0.12); }
    .modal-foot {
      padding: 14px 22px; background: var(--surface-subtle);
      border-top: 1px solid var(--border);
      display: flex; justify-content: flex-end; gap: 10px;
    }
    .modal-step-pill {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700; color: var(--red);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
    }
    .modal-step-pill::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--red); }

    /* Utility */
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }`;

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
          <a class="sb-nav-item active" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5"/></svg>
            Settings
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

    <!-- ===== MAIN ===== -->
    <main class="main">
      <div class="topbar">
        <div class="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <a href="settings.html">Settings</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Team</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search members, roles, activity…">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <!-- Page head -->
      <div class="page-head-bar">
        <div>
          <h1>Team members</h1>
          <p>Invite teammates, assign roles, and control what they can touch inside the workspace.</p>
        </div>
        <button class="btn btn-primary" data-scroll-invite>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Invite members
        </button>
      </div>

      <!-- Two-column settings body -->
      <div class="settings-wrap">
        <div class="settings-grid">

          <!-- SUB NAV -->
          <nav class="sub-nav">
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Workspace
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>
              Branding
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              Billing
            </a>
            <a class="sub-nav-item active" href="admin-team.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Team
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Security
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              Notifications
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20.8a8 8 0 1 1 4-15M14 3.2A8 8 0 0 1 17 17"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              Integrations
            </a>
            <a class="sub-nav-item" href="settings.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              API &amp; Webhooks
            </a>
          </nav>

          <!-- PANEL -->
          <div class="panel-col">

            <!-- PLAN CALLOUT -->
            <div class="plan-callout">
              <div class="plan-callout-left">
                <div class="plan-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <div class="eyebrow" style="margin-bottom:2px;">Pro plan</div>
                  <div class="plan-text">Your plan includes up to <strong>5 team members</strong>. You're using <strong>3</strong>, with 1 pending invite. <strong>Upgrade to Scale</strong> for unlimited seats, SSO, and audit exports.</div>
                </div>
              </div>
              <div class="plan-meter">
                <div class="plan-meter-bar"><div class="plan-meter-fill"></div></div>
                <div class="plan-meter-label"><span>3 of 5 seats</span><span>1 pending</span></div>
                <button class="btn btn-pink btn-sm" style="align-self:flex-end;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  Upgrade to Scale
                </button>
              </div>
            </div>

            <!-- INVITE CARD -->
            <section class="card" id="invite-card">
              <div class="card-head">
                <div>
                  <div class="eyebrow">Grow the team</div>
                  <h2>Invite members</h2>
                  <p>Send invites to multiple people at once. They'll get an email with a secure sign-in link.</p>
                </div>
              </div>
              <div class="invite-grid">
                <div class="field">
                  <label class="field-label" for="invite-emails">Email addresses</label>
                  <textarea id="invite-emails" class="field-textarea" placeholder="devon@blackbear.com, sam@blackbear.com, …"></textarea>
                  <span class="field-hint">Separate multiple emails with commas.</span>
                </div>
                <div class="field">
                  <label class="field-label" for="invite-role">Role</label>
                  <select id="invite-role" class="field-select">
                    <option value="admin">Admin</option>
                    <option value="manager" selected>Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <span class="field-hint">You can change this later.</span>
                </div>
              </div>
              <div class="field" style="margin-top:14px;">
                <label class="field-label" for="invite-note">Personal note <span style="color:var(--text-faint);font-weight:500;">— optional</span></label>
                <textarea id="invite-note" class="field-textarea" placeholder="Hey — joining the Black Bear ops team. Here's your access…"></textarea>
              </div>
              <div class="invite-footer">
                <span class="invite-footer-hint">Invites expire in 7 days. You can resend any time.</span>
                <div style="display:flex;gap:10px;">
                  <button class="btn btn-ghost btn-sm" id="invite-clear">Clear</button>
                  <button class="btn btn-primary" id="invite-send">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                    Send invites
                  </button>
                </div>
              </div>
            </section>

            <!-- MEMBERS TABLE -->
            <section class="card">
              <div class="card-head">
                <div>
                  <div class="eyebrow">Who has access</div>
                  <h2>Current members</h2>
                  <p>Owners can't be removed and can't lose access. Transfer ownership in Workspace settings.</p>
                </div>
              </div>
              <div class="members-table-wrap">
                <table class="members-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Added</th>
                      <th>Last active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody id="members-tbody">
                    <tr data-member-id="hc">
                      <td>
                        <div class="member-cell">
                          <div class="member-avatar pink">HC</div>
                          <div>
                            <div class="member-name">Harrison Cooper<span class="member-self">You</span></div>
                            <div class="member-email">harrison@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="role-pill role-owner">Owner</span>
                      </td>
                      <td class="cell-muted">Feb 3, 2026</td>
                      <td><span class="active-dot">Active now</span></td>
                      <td>
                        <div class="row-actions">
                          <button class="icon-btn disabled" title="Owner can't be removed">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="mc" data-member-name="Megan Cooper">
                      <td>
                        <div class="member-cell">
                          <div class="member-avatar">MC</div>
                          <div>
                            <div class="member-name">Megan Cooper</div>
                            <div class="member-email">megan@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="role-pill-wrap" style="position:relative;display:inline-block;">
                          <button class="role-pill role-admin" data-role-trigger data-current="admin">
                            Admin
                            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                          <div class="role-menu" data-role-menu>
                            <button data-role="admin"><span class="rm-dot" style="background:var(--pink);"></span><span class="rm-text"><span class="rm-title">Admin</span><span class="rm-sub">Full access, can manage billing</span></span></button>
                            <button data-role="manager"><span class="rm-dot" style="background:var(--blue);"></span><span class="rm-text"><span class="rm-title">Manager</span><span class="rm-sub">Day-to-day operations</span></span></button>
                            <button data-role="viewer"><span class="rm-dot" style="background:var(--text-muted);"></span><span class="rm-text"><span class="rm-title">Viewer</span><span class="rm-sub">Read-only access</span></span></button>
                          </div>
                        </div>
                      </td>
                      <td class="cell-muted">Feb 18, 2026</td>
                      <td class="cell-strong">2 hours ago</td>
                      <td>
                        <div class="row-actions">
                          <button class="icon-btn" title="Resend invite email" data-resend>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/></svg>
                          </button>
                          <button class="icon-btn danger" title="Remove member" data-remove>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="jr" data-member-name="Jordan Ruiz">
                      <td>
                        <div class="member-cell">
                          <div class="member-avatar green">JR</div>
                          <div>
                            <div class="member-name">Jordan Ruiz</div>
                            <div class="member-email">jordan@rentblackbear.com</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="role-pill-wrap" style="position:relative;display:inline-block;">
                          <button class="role-pill role-manager" data-role-trigger data-current="manager">
                            Manager
                            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                          <div class="role-menu" data-role-menu>
                            <button data-role="admin"><span class="rm-dot" style="background:var(--pink);"></span><span class="rm-text"><span class="rm-title">Admin</span><span class="rm-sub">Full access, can manage billing</span></span></button>
                            <button data-role="manager"><span class="rm-dot" style="background:var(--blue);"></span><span class="rm-text"><span class="rm-title">Manager</span><span class="rm-sub">Day-to-day operations</span></span></button>
                            <button data-role="viewer"><span class="rm-dot" style="background:var(--text-muted);"></span><span class="rm-text"><span class="rm-title">Viewer</span><span class="rm-sub">Read-only access</span></span></button>
                          </div>
                        </div>
                      </td>
                      <td class="cell-muted">Mar 12, 2026</td>
                      <td class="cell-strong">Yesterday</td>
                      <td>
                        <div class="row-actions">
                          <button class="icon-btn" title="Resend invite email" data-resend>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/></svg>
                          </button>
                          <button class="icon-btn danger" title="Remove member" data-remove>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr data-member-id="devon" data-member-name="devon@blackbear.com">
                      <td>
                        <div class="member-cell">
                          <div class="member-avatar pending">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/></svg>
                          </div>
                          <div>
                            <div class="member-name">devon@blackbear.com</div>
                            <div class="member-email">Invitation pending · sent Apr 10</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="role-pill role-viewer" style="cursor:default;">
                          Viewer
                        </span>
                      </td>
                      <td class="cell-muted">—</td>
                      <td>
                        <span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--orange);background:var(--orange-bg);padding:3px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:0.06em;">
                          Pending
                        </span>
                      </td>
                      <td>
                        <div class="pending-mini-btns" style="justify-content:flex-end;">
                          <button class="mini-btn" data-resend>Resend</button>
                          <button class="mini-btn danger" data-cancel-invite>Cancel</button>
                        </div>
                      </td>
                    </tr>

                    <tr class="placeholder-row placeholder">
                      <td colspan="5" style="text-align:center;padding:16px;">
                        <button class="placeholder-cta" data-scroll-invite>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                          Invite someone — seat 4 of 5
                        </button>
                      </td>
                    </tr>
                    <tr class="placeholder-row placeholder">
                      <td colspan="5" style="text-align:center;padding:16px;">
                        <button class="placeholder-cta" data-scroll-invite>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                          Invite someone — seat 5 of 5
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- ROLE EXPLAINER -->
            <section class="card">
              <div class="card-head">
                <div>
                  <div class="eyebrow">Permissions</div>
                  <h2>What each role can do</h2>
                  <p>Permissions apply across properties, leases, and finances. Owner-only actions are never delegated.</p>
                </div>
              </div>
              <div class="roles-grid">
                <div class="role-card">
                  <div class="role-card-head">
                    <div class="role-card-icon admin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z"/></svg>
                    </div>
                    <div>
                      <h4>Admin</h4>
                      <div class="role-card-sub">Full access</div>
                    </div>
                  </div>
                  <div class="role-perms">
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Invite, remove, and change roles of other members</div>
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Manage billing, plan, and payment methods</div>
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Everything a Manager can do</div>
                    <div class="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>Cannot delete the workspace or transfer ownership</div>
                  </div>
                </div>

                <div class="role-card">
                  <div class="role-card-head">
                    <div class="role-card-icon manager">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                    </div>
                    <div>
                      <h4>Manager</h4>
                      <div class="role-card-sub">Day-to-day ops</div>
                    </div>
                  </div>
                  <div class="role-perms">
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Tenants, leases, maintenance tickets, and payments</div>
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Message residents and record rent activity</div>
                    <div class="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>Cannot view or change billing</div>
                    <div class="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>Cannot permanently delete records</div>
                  </div>
                </div>

                <div class="role-card">
                  <div class="role-card-head">
                    <div class="role-card-icon viewer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div>
                      <h4>Viewer</h4>
                      <div class="role-card-sub">Read-only</div>
                    </div>
                  </div>
                  <div class="role-perms">
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>View properties, leases, and financial reports</div>
                    <div class="role-perm yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>Export CSVs — great for accountants and bookkeepers</div>
                    <div class="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>Cannot edit any record or send messages</div>
                    <div class="role-perm no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>Cannot see team members or billing</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- ACTIVITY LOG -->
            <section class="card">
              <div class="card-head" style="margin-bottom:10px;">
                <div>
                  <div class="eyebrow">Audit trail</div>
                  <h2>Recent team activity</h2>
                  <p>Last 10 actions across your workspace. Filter by teammate.</p>
                </div>
                <a href="#" class="btn btn-ghost btn-sm">
                  View full log
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
              </div>
              <div class="activity-head">
                <div class="filter-chip-row" id="activity-filters">
                  <button class="filter-chip active" data-filter="all">Everyone</button>
                  <button class="filter-chip" data-filter="hc">Harrison</button>
                  <button class="filter-chip" data-filter="mc">Megan</button>
                  <button class="filter-chip" data-filter="jr">Jordan</button>
                  <button class="filter-chip" data-filter="sys">System</button>
                </div>
              </div>
              <div class="activity-list" id="activity-list">
                <div class="activity-row" data-actor="mc">
                  <div class="activity-avatar a-mc">MC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Megan Cooper</span>
                    <span class="activity-verb"> added a tenant </span>
                    <span class="activity-target">Priya Shah</span>
                    <span class="activity-verb"> to </span>
                    <span class="activity-target">3026 Turf Ave, Room A</span>
                    <div class="activity-time">Today at 1:42 PM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="jr">
                  <div class="activity-avatar a-jr">JR</div>
                  <div class="activity-main">
                    <span class="activity-actor">Jordan Ruiz</span>
                    <span class="activity-verb"> closed maintenance ticket </span>
                    <span class="activity-target">#T-418 — leaky faucet</span>
                    <div class="activity-time">Today at 11:08 AM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="hc">
                  <div class="activity-avatar a-hc">HC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Harrison Cooper</span>
                    <span class="activity-verb"> changed the lease for </span>
                    <span class="activity-target">908 Lee Dr · Room C</span>
                    <span class="activity-verb"> — rent $950 → $1,025</span>
                    <div class="activity-time">Yesterday at 4:19 PM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="sys">
                  <div class="activity-avatar a-sys">SY</div>
                  <div class="activity-main">
                    <span class="activity-actor">System</span>
                    <span class="activity-verb"> invite resent to </span>
                    <span class="activity-target">devon@blackbear.com</span>
                    <div class="activity-time">Yesterday at 2:51 PM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="mc">
                  <div class="activity-avatar a-mc">MC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Megan Cooper</span>
                    <span class="activity-verb"> recorded payment </span>
                    <span class="activity-target">$1,200 from Aidan Hale</span>
                    <div class="activity-time">Apr 12 at 9:04 AM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="jr">
                  <div class="activity-avatar a-jr">JR</div>
                  <div class="activity-main">
                    <span class="activity-actor">Jordan Ruiz</span>
                    <span class="activity-verb"> assigned ticket </span>
                    <span class="activity-target">#T-419</span>
                    <span class="activity-verb"> to </span>
                    <span class="activity-target">Acme Plumbing</span>
                    <div class="activity-time">Apr 11 at 6:12 PM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="hc">
                  <div class="activity-avatar a-hc">HC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Harrison Cooper</span>
                    <span class="activity-verb"> invited </span>
                    <span class="activity-target">devon@blackbear.com</span>
                    <span class="activity-verb"> as Viewer</span>
                    <div class="activity-time">Apr 10 at 3:30 PM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="mc">
                  <div class="activity-avatar a-mc">MC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Megan Cooper</span>
                    <span class="activity-verb"> uploaded a signed lease for </span>
                    <span class="activity-target">Nguyen — 908 Lee Dr</span>
                    <div class="activity-time">Apr 9 at 10:22 AM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="hc">
                  <div class="activity-avatar a-hc">HC</div>
                  <div class="activity-main">
                    <span class="activity-actor">Harrison Cooper</span>
                    <span class="activity-verb"> promoted </span>
                    <span class="activity-target">Megan Cooper</span>
                    <span class="activity-verb"> from Manager to Admin</span>
                    <div class="activity-time">Apr 8 at 9:45 AM</div>
                  </div>
                </div>
                <div class="activity-row" data-actor="jr">
                  <div class="activity-avatar a-jr">JR</div>
                  <div class="activity-main">
                    <span class="activity-actor">Jordan Ruiz</span>
                    <span class="activity-verb"> exported rent roll — </span>
                    <span class="activity-target">April 2026.csv</span>
                    <div class="activity-time">Apr 7 at 4:58 PM</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECURITY SUB-CARD -->
            <section class="card">
              <div class="card-head">
                <div>
                  <div class="eyebrow">Access controls</div>
                  <h2>Team security</h2>
                  <p>Enforce sign-in requirements across everyone in the workspace.</p>
                </div>
              </div>
              <div class="sec-row">
                <div class="sec-row-info">
                  <div class="sec-row-title">Require multi-factor authentication</div>
                  <div class="sec-row-sub">Every member must set up an authenticator app or passkey before signing in.</div>
                </div>
                <div class="switch on" data-switch="mfa" role="switch" aria-checked="true" tabindex="0"></div>
              </div>
              <div class="sec-row">
                <div class="sec-row-info">
                  <div class="sec-row-title">Require SSO <span class="upsell-pill">Scale+</span></div>
                  <div class="sec-row-sub">Force sign-in through your identity provider (Google, Okta, Entra). Available on Scale.</div>
                </div>
                <div class="switch disabled" data-switch="sso" role="switch" aria-checked="false" tabindex="-1"></div>
              </div>
              <div class="sec-row">
                <div class="sec-row-info">
                  <div class="sec-row-title">Session timeout</div>
                  <div class="sec-row-sub">Sign members out automatically after a period of inactivity.</div>
                </div>
                <select class="field-select" style="width:auto;min-width:170px;">
                  <option>15 minutes</option>
                  <option>1 hour</option>
                  <option selected>8 hours</option>
                  <option>24 hours</option>
                  <option>7 days</option>
                  <option>Never</option>
                </select>
              </div>

              <div class="danger-zone">
                <div>
                  <h4>Force sign out all users</h4>
                  <p>Immediately invalidates every active session, including yours. Use if a device is lost or a member leaves suddenly.</p>
                </div>
                <button class="btn btn-danger" id="force-signout-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
                  Force sign out
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- ===== REMOVE MEMBER MODAL ===== -->
  <div class="modal-backdrop" id="modal-remove" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-head">
        <div class="modal-icon danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
        </div>
        <div>
          <h3>Remove <span id="remove-name">member</span>?</h3>
        </div>
      </div>
      <div class="modal-body">
        They'll lose access immediately and won't receive notifications. Their activity history will remain in the audit log. This action can't be undone, but you can always invite them again.
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost btn-sm" data-modal-cancel>Keep member</button>
        <button class="btn btn-danger-solid btn-sm" id="confirm-remove">Remove from workspace</button>
      </div>
    </div>
  </div>

  <!-- ===== FORCE SIGN OUT — 2-STEP MODAL ===== -->
  <div class="modal-backdrop" id="modal-force-1" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-head">
        <div class="modal-icon warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>
        </div>
        <div>
          <div class="modal-step-pill">Step 1 of 2</div>
          <h3>Sign out every active session?</h3>
        </div>
      </div>
      <div class="modal-body">
        This will sign out <strong>3 team members</strong> and <strong>all tenants currently signed in to the resident portal</strong>. Scheduled automations will continue running. You'll be redirected to the sign-in page.
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost btn-sm" data-modal-cancel>Cancel</button>
        <button class="btn btn-danger btn-sm" id="force-step2">Continue</button>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="modal-force-2" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-head">
        <div class="modal-icon danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
        </div>
        <div>
          <div class="modal-step-pill">Step 2 of 2 · final</div>
          <h3>Type <code style="font-family:'JetBrains Mono',monospace;background:var(--red-bg);color:var(--red);padding:1px 6px;border-radius:4px;">SIGN OUT</code> to confirm</h3>
        </div>
      </div>
      <div class="modal-body">
        Last chance. Once confirmed, sessions are revoked immediately and can't be restored.
        <input class="modal-confirm-input" id="force-confirm-input" placeholder="SIGN OUT" autocomplete="off">
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost btn-sm" data-modal-cancel>Back out</button>
        <button class="btn btn-danger-solid btn-sm" id="force-confirm" disabled style="opacity:.5;cursor:not-allowed;">Force sign out now</button>
      </div>
    </div>
  </div>

  <!-- Toasts -->
  <div class="toast-container" id="toast-container"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
