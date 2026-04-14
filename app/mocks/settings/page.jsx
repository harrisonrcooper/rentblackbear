"use client";

// Mock ported verbatim from ~/Desktop/tenantory/settings.html.
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
    .settings-panel { display: none; flex-direction: column; gap: 18px; }
    .settings-panel.active { display: flex; }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 18px; }
    .eyebrow {
      font-size: 11px; font-weight: 700; color: var(--pink);
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;
    }
    .card-head h2 {
      font-size: 20px; font-weight: 800; letter-spacing: -0.015em;
    }
    .card-head p {
      font-size: 13px; color: var(--text-muted); margin-top: 4px;
    }

    /* ===== Theme picker ===== */
    .theme-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    @media (max-width: 1200px) { .theme-grid { grid-template-columns: repeat(2, 1fr); } }
    .theme-card {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden; cursor: pointer; background: var(--surface);
      transition: all 0.15s ease; position: relative;
      display: flex; flex-direction: column;
    }
    .theme-card:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow); }
    .theme-card.active { border-color: var(--pink); box-shadow: 0 0 0 3px rgba(255,73,152,0.15); }
    .theme-card-badge {
      position: absolute; top: 10px; right: 10px;
      width: 26px; height: 26px; border-radius: 50%;
      background: var(--pink); color: #fff;
      display: none; align-items: center; justify-content: center;
      box-shadow: 0 4px 10px rgba(255,73,152,0.4);
      z-index: 2;
    }
    .theme-card-badge svg { width: 14px; height: 14px; }
    .theme-card.active .theme-card-badge { display: flex; }

    .theme-preview {
      height: 200px; display: flex; overflow: hidden;
      border-bottom: 1px solid var(--border);
    }
    .tp-sidebar { width: 38%; padding: 14px 10px; display: flex; flex-direction: column; gap: 8px; }
    .tp-logo { width: 18px; height: 18px; border-radius: 5px; }
    .tp-sb-row { height: 6px; border-radius: 3px; opacity: 0.6; }
    .tp-sb-row.active { opacity: 1; }
    .tp-body { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; }
    .tp-head-row { display: flex; justify-content: space-between; align-items: center; }
    .tp-title { height: 8px; width: 50%; border-radius: 3px; }
    .tp-chip { height: 10px; width: 26px; border-radius: 100px; }
    .tp-kpi-row { display: flex; gap: 6px; }
    .tp-kpi { flex: 1; height: 32px; border-radius: 5px; padding: 5px; display: flex; flex-direction: column; gap: 3px; }
    .tp-kpi-bar-sm { height: 3px; width: 60%; border-radius: 2px; opacity: 0.5; }
    .tp-kpi-bar-lg { height: 5px; width: 80%; border-radius: 2px; }
    .tp-table { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
    .tp-row { display: flex; gap: 5px; align-items: center; }
    .tp-avatar-dot { width: 8px; height: 8px; border-radius: 50%; }
    .tp-row-line { height: 4px; border-radius: 2px; opacity: 0.4; flex: 1; }

    /* Flagship preview */
    .tp-flagship .tp-sidebar { background: linear-gradient(180deg, #1e2a5e, #14204a); }
    .tp-flagship .tp-logo { background: linear-gradient(135deg, #1665D8, #FF4998); }
    .tp-flagship .tp-sb-row { background: rgba(255,255,255,0.4); }
    .tp-flagship .tp-sb-row.active { background: #FF4998; }
    .tp-flagship .tp-body { background: #f7f9fc; }
    .tp-flagship .tp-title { background: #1a1f36; }
    .tp-flagship .tp-chip { background: #FF4998; }
    .tp-flagship .tp-kpi { background: var(--surface); border: 1px solid #e3e8ef; }
    .tp-flagship .tp-kpi-bar-lg { background: #1251AD; }
    .tp-flagship .tp-kpi-bar-sm { background: #1a1f36; }
    .tp-flagship .tp-avatar-dot { background: #1251AD; }
    .tp-flagship .tp-row-line { background: #1a1f36; }

    /* Hearth preview */
    .tp-hearth .tp-sidebar { background: linear-gradient(180deg, #8a6a1f, #6b4f12); }
    .tp-hearth .tp-logo { background: linear-gradient(135deg, #f5a623, #1ea97c); }
    .tp-hearth .tp-sb-row { background: rgba(255,240,210,0.4); }
    .tp-hearth .tp-sb-row.active { background: #f5a623; }
    .tp-hearth .tp-body { background: #fdf6e8; }
    .tp-hearth .tp-title { background: #3a2e14; }
    .tp-hearth .tp-chip { background: #1ea97c; }
    .tp-hearth .tp-kpi { background: var(--surface); border: 1px solid #ecdbb5; }
    .tp-hearth .tp-kpi-bar-lg { background: #f5a623; }
    .tp-hearth .tp-kpi-bar-sm { background: #3a2e14; }
    .tp-hearth .tp-avatar-dot { background: #1ea97c; }
    .tp-hearth .tp-row-line { background: #3a2e14; }

    /* Nocturne preview */
    .tp-nocturne .tp-sidebar { background: #000; }
    .tp-nocturne .tp-logo { background: linear-gradient(135deg, #00e5ff, #ff00aa); }
    .tp-nocturne .tp-sb-row { background: rgba(255,255,255,0.25); }
    .tp-nocturne .tp-sb-row.active { background: #00e5ff; }
    .tp-nocturne .tp-body { background: #0a0a12; }
    .tp-nocturne .tp-title { background: #e8e8ff; }
    .tp-nocturne .tp-chip { background: #ff00aa; }
    .tp-nocturne .tp-kpi { background: #12121e; border: 1px solid #2a2a3a; }
    .tp-nocturne .tp-kpi-bar-lg { background: #00e5ff; }
    .tp-nocturne .tp-kpi-bar-sm { background: #8888aa; }
    .tp-nocturne .tp-avatar-dot { background: #ff00aa; }
    .tp-nocturne .tp-row-line { background: #8888aa; }

    /* Slate preview */
    .tp-slate .tp-sidebar { background: #f7f7f8; border-right: 1px solid #e3e3e6; }
    .tp-slate .tp-logo { background: #2c6fe0; }
    .tp-slate .tp-sb-row { background: #c0c0c8; }
    .tp-slate .tp-sb-row.active { background: #2c6fe0; }
    .tp-slate .tp-body { background: var(--surface); }
    .tp-slate .tp-title { background: #1a1a1a; }
    .tp-slate .tp-chip { background: #2c6fe0; }
    .tp-slate .tp-kpi { background: #fafafa; border: 1px solid #e3e3e6; }
    .tp-slate .tp-kpi-bar-lg { background: #2c6fe0; }
    .tp-slate .tp-kpi-bar-sm { background: #888; }
    .tp-slate .tp-avatar-dot { background: #444; }
    .tp-slate .tp-row-line { background: #444; }

    /* Custom preview */
    .tp-custom {
      border: 2px dashed var(--border-strong);
      background: repeating-linear-gradient(45deg, #fafbfd, #fafbfd 10px, #f0f2f7 10px, #f0f2f7 20px);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 8px;
    }
    .tp-custom-icon {
      width: 52px; height: 52px; border-radius: 50%;
      background: conic-gradient(from 0deg, #FF4998, #f5a623, #1ea97c, #1251AD, #7c4dff, #FF4998);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow);
    }
    .tp-custom-icon::after {
      content: ""; width: 22px; height: 22px; border-radius: 50%; background: var(--surface);
    }
    .tp-custom-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; }

    .theme-info { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .theme-name-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .theme-name { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
    .theme-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; }
    .theme-action-row { margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .theme-use-btn {
      padding: 7px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
      background: var(--surface-alt); color: var(--text); border: 1px solid var(--border);
      transition: all 0.15s ease;
    }
    .theme-use-btn:hover { border-color: var(--blue); color: var(--blue); }
    .theme-card.active .theme-use-btn {
      background: var(--green-bg); color: var(--green-dark); border-color: var(--green);
      display: inline-flex; align-items: center; gap: 5px;
    }
    .theme-card.active .theme-use-btn::before {
      content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    }
    .theme-tag {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* ===== Advanced theme ===== */
    .advanced {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .advanced-head {
      padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
      cursor: pointer; user-select: none;
    }
    .advanced-head:hover { background: var(--surface-alt); }
    .advanced-title { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
    .advanced-title svg { width: 16px; height: 16px; color: var(--text-muted); }
    .advanced-chev { width: 16px; height: 16px; color: var(--text-muted); transition: transform 0.2s ease; }
    .advanced.open .advanced-chev { transform: rotate(180deg); }
    .advanced-body {
      display: none; padding: 4px 20px 20px;
      border-top: 1px solid var(--border);
    }
    .advanced.open .advanced-body { display: block; }

    .adv-section { padding-top: 20px; }
    .adv-section-title {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
    }

    .field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }
    .field-hint { font-size: 11px; color: var(--text-faint); }
    .field-input, .field-select {
      padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); font-size: 13px; color: var(--text);
      transition: all 0.15s ease; outline: none; width: 100%;
    }
    .field-input:focus, .field-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12); }
    .field-prefix-group {
      display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); overflow: hidden;
    }
    .field-prefix-group:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.12); }
    .field-prefix {
      padding: 9px 12px; background: var(--surface-alt); border-right: 1px solid var(--border);
      color: var(--text-muted); font-size: 13px; font-weight: 500;
    }
    .field-prefix-group input, .field-prefix-group .field-suffix {
      border: none; padding: 9px 12px; font-size: 13px; flex: 1; outline: none; background: transparent;
    }
    .field-suffix { color: var(--text-muted); font-weight: 500; }

    .color-picker {
      display: flex; align-items: center; gap: 10px;
      padding: 6px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface);
    }
    .color-swatch { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); position: relative; overflow: hidden; }
    .color-swatch input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .color-hex { flex: 1; border: none; outline: none; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text); background: transparent; padding: 0 4px; }

    .segmented {
      display: inline-flex; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px; padding: 3px;
    }
    .segmented button {
      padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
      color: var(--text-muted); transition: all 0.15s ease;
    }
    .segmented button.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }
    .segmented button:hover:not(.active) { color: var(--text); }

    .checkbox-list { display: flex; flex-direction: column; gap: 2px; }
    .checkbox-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 8px;
      cursor: pointer; transition: background 0.15s ease;
    }
    .checkbox-row:hover { background: var(--surface-alt); }
    .checkbox {
      width: 18px; height: 18px; border: 1.5px solid var(--border-strong); border-radius: 5px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      background: var(--surface); transition: all 0.15s ease;
    }
    .checkbox svg { width: 12px; height: 12px; color: #fff; opacity: 0; }
    .checkbox-row.checked .checkbox { background: var(--blue); border-color: var(--blue); }
    .checkbox-row.checked .checkbox svg { opacity: 1; }
    .checkbox-label { font-size: 13px; font-weight: 500; flex: 1; }
    .checkbox-sub { font-size: 11px; color: var(--text-faint); margin-top: 1px; }

    .form-footer {
      display: flex; justify-content: flex-end; gap: 10px;
      margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);
    }

    /* ===== Toggle switch ===== */
    .switch { width: 36px; height: 20px; background: var(--border-strong); border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px;
      width: 16px; height: 16px; border-radius: 50%; background: var(--surface);
      transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .switch.on { background: var(--green); }
    .switch.on::after { transform: translateX(16px); }

    /* ===== Pills & badges ===== */
    .pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    /* ===== Workspace panel ===== */
    .ws-meta { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 8px; }
    .ws-meta-item { font-size: 12px; color: var(--text-muted); }
    .ws-meta-item strong { color: var(--text); font-weight: 600; }

    .domain-row {
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-subtle);
    }
    .domain-info code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--blue); font-weight: 600; }
    .domain-info-sub { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    .danger-zone {
      margin-top: 20px; padding: 18px 20px;
      border: 1px solid var(--red); border-radius: var(--radius-lg);
      background: rgba(214,69,69,0.03);
      display: flex; justify-content: space-between; align-items: center; gap: 20px;
    }
    .danger-zone h4 { font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: 4px; }
    .danger-zone p { font-size: 12px; color: var(--text-muted); }

    /* ===== Brand panel ===== */
    .upload-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .upload {
      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
      padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;
      cursor: pointer; transition: all 0.15s ease; background: var(--surface-subtle);
    }
    .upload:hover { border-color: var(--blue); background: var(--blue-pale); }
    .upload-preview {
      width: 64px; height: 64px; border-radius: 14px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow);
    }
    .upload-preview svg { width: 28px; height: 28px; color: #fff; }
    .upload-preview.small { width: 36px; height: 36px; border-radius: 8px; }
    .upload-preview.small svg { width: 18px; height: 18px; }
    .upload-label { font-size: 13px; font-weight: 600; }
    .upload-hint { font-size: 11px; color: var(--text-faint); text-align: center; }

    /* ===== Subscription panel ===== */
    .sub-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-lg); padding: 28px;
      display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: flex-start;
      position: relative; overflow: hidden;
    }
    .sub-card::before {
      content: ""; position: absolute; right: -120px; top: -120px;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.25), transparent 70%);
    }
    .sub-card-eyebrow { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
    .sub-card h3 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .sub-price { display: flex; align-items: baseline; gap: 6px; margin: 12px 0; }
    .sub-price strong { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; color: #fff; }
    .sub-price span { font-size: 14px; color: rgba(255,255,255,0.7); }
    .sub-locked-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 100px;
      background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
      margin-top: 4px;
    }
    .sub-card-right { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }

    .usage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
    .usage-item { padding: 14px 16px; background: var(--surface-subtle); border: 1px solid var(--border); border-radius: var(--radius); }
    .usage-label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .usage-val { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 8px; }
    .usage-val span { font-size: 12px; color: var(--text-faint); font-weight: 500; }
    .usage-bar { height: 5px; background: var(--border); border-radius: 100px; overflow: hidden; }
    .usage-fill { height: 100%; background: var(--blue); border-radius: 100px; }
    .usage-fill.warn { background: var(--orange); }
    .usage-fill.ok { background: var(--green); }

    /* ===== Tables ===== */
    .t-table { width: 100%; border-collapse: collapse; }
    .t-table th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;
      padding: 10px 12px; border-bottom: 1px solid var(--border);
    }
    .t-table td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .t-table tr:last-child td { border-bottom: none; }
    .t-table tr:hover td { background: var(--surface-subtle); }
    .t-table a.link { color: var(--blue); font-weight: 600; }
    .t-table a.link:hover { text-decoration: underline; }

    code.mono {
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      background: var(--surface-alt); padding: 3px 8px; border-radius: 5px;
      border: 1px solid var(--border); color: var(--text);
    }
    .copy-btn {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 6px;
      font-size: 11px; font-weight: 600; color: var(--text-muted);
      background: var(--surface-alt); border: 1px solid var(--border);
      transition: all 0.15s ease;
    }
    .copy-btn:hover { color: var(--blue); border-color: var(--blue); }
    .copy-btn svg { width: 11px; height: 11px; }

    /* ===== Integrations grid ===== */
    .integ-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    @media (max-width: 1200px) { .integ-grid { grid-template-columns: 1fr; } }
    .integ-card {
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 16px; display: flex; gap: 14px; align-items: flex-start;
      background: var(--surface); transition: all 0.15s ease;
    }
    .integ-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
    .integ-logo {
      width: 42px; height: 42px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      color: #fff; font-weight: 800; font-size: 14px;
    }
    .integ-info { flex: 1; min-width: 0; }
    .integ-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }
    .integ-desc { font-size: 12px; color: var(--text-muted); }
    .integ-action { flex-shrink: 0; }

    /* ===== Team panel ===== */
    .member-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface); transition: all 0.15s ease;
    }
    .member-row + .member-row { margin-top: 8px; }
    .member-row:hover { border-color: var(--border-strong); }
    .member-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; font-size: 13px; flex-shrink: 0;
    }
    .member-info { flex: 1; min-width: 0; }
    .member-name { font-weight: 700; font-size: 14px; }
    .member-email { font-size: 12px; color: var(--text-muted); }
    .member-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* ===== Notifications panel ===== */
    .notif-table { width: 100%; }
    .notif-table th {
      text-align: center; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;
      padding: 12px; border-bottom: 1px solid var(--border);
    }
    .notif-table th:first-child { text-align: left; }
    .notif-table td { padding: 14px 12px; border-bottom: 1px solid var(--border); }
    .notif-table td:not(:first-child) { text-align: center; }
    .notif-name { font-size: 13px; font-weight: 600; }
    .notif-desc { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* ===== Security panel ===== */
    .sec-item {
      display: flex; justify-content: space-between; align-items: center; gap: 20px;
      padding: 16px 0; border-bottom: 1px solid var(--border);
    }
    .sec-item:last-child { border-bottom: none; }
    .sec-item-info h4 { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .sec-item-info p { font-size: 12px; color: var(--text-muted); }
    .session-row {
      padding: 12px 16px; background: var(--surface-subtle);
      border: 1px solid var(--border); border-radius: var(--radius);
      display: flex; align-items: center; gap: 12px;
    }
    .session-row + .session-row { margin-top: 8px; }
    .session-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--blue-pale); color: var(--blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .session-icon svg { width: 18px; height: 18px; }
    .session-info { flex: 1; min-width: 0; }
    .session-title { font-size: 13px; font-weight: 700; }
    .session-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* ===== Stripe panel ===== */
    .stripe-head {
      display: flex; align-items: center; gap: 16px; padding: 20px;
      background: linear-gradient(135deg, #635bff, #4f46e5);
      border-radius: var(--radius-lg); color: #fff;
    }
    .stripe-logo {
      width: 48px; height: 48px; border-radius: 12px; background: var(--surface);
      display: flex; align-items: center; justify-content: center;
      color: #635bff; font-weight: 800; font-size: 22px; flex-shrink: 0;
      font-family: 'Inter', sans-serif; font-style: italic;
    }
    .stripe-head-info { flex: 1; }
    .stripe-head-info h3 { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
    .stripe-head-info p { font-size: 13px; color: rgba(255,255,255,0.85); }

    /* ===== Webhook row ===== */
    .webhook-row {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-subtle);
    }
    .webhook-row + .webhook-row { margin-top: 8px; }
    .webhook-status { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .webhook-status.active { background: var(--green); box-shadow: 0 0 0 4px rgba(30,169,124,0.2); }
    .webhook-status.failing { background: var(--red); box-shadow: 0 0 0 4px rgba(214,69,69,0.2); }
    .webhook-url { font-family: 'JetBrains Mono', monospace; font-size: 12px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .webhook-events { font-size: 11px; color: var(--text-faint); }

    /* ===== Toast animation ===== */
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    /* ===== Misc ===== */
    .divider { height: 1px; background: var(--border); margin: 20px 0; }
    .stack { display: flex; flex-direction: column; gap: 14px; }
    .row { display: flex; align-items: center; gap: 10px; }
    .row-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .muted { color: var(--text-muted); }
    .strong { font-weight: 700; }

    .social-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

    .hr-label { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
    .hr-label::before, .hr-label::after { content: ""; flex: 1; height: 1px; background: var(--border); }
    .hr-label span { font-size: 11px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }

    .dot-list { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }
    .dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }`;

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

    <!-- MAIN -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Settings</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input id="search-input" placeholder="Search settings…">
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
          <h1>Settings</h1>
          <p>Workspace, brand, billing, integrations — everything in one place.</p>
        </div>
      </div>

      <!-- Two-column settings body -->
      <div class="settings-wrap">
        <div class="settings-grid">

          <!-- SUB NAV -->
          <nav class="sub-nav" id="sub-nav">
            <button class="sub-nav-item" data-section="workspace">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Workspace
            </button>
            <button class="sub-nav-item" data-section="brand">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>
              Brand
            </button>
            <button class="sub-nav-item active" data-section="theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="20" r="2.5"/><path d="M12 22a10 10 0 1 1 10-10c0 2.5-3.2 2.5-4.5 1.3"/></svg>
              Theme
            </button>
            <button class="sub-nav-item" data-section="billing">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              Subscription
            </button>
            <button class="sub-nav-item" data-section="stripe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Stripe Connect
            </button>
            <button class="sub-nav-item" data-section="integrations">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20.8a8 8 0 1 1 4-15M14 3.2A8 8 0 0 1 17 17"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              Integrations
            </button>
            <button class="sub-nav-item" data-section="team">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Team
            </button>
            <button class="sub-nav-item" data-section="notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              Notifications
            </button>
            <button class="sub-nav-item" data-section="security">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Security
            </button>
            <button class="sub-nav-item" data-section="privacy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/></svg>
              Data & Privacy
            </button>
            <button class="sub-nav-item" data-section="api">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              API & Webhooks
            </button>
          </nav>

          <!-- PANEL COLUMN -->
          <div class="panel-col">

            <!-- ========== WORKSPACE PANEL ========== -->
            <section class="settings-panel" data-panel="workspace">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">WORKSPACE</div>
                    <h2>Name & identity</h2>
                    <p>This is how Tenantory recognizes your workspace across dashboards, emails, and the tenant portal.</p>
                  </div>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label class="field-label">Workspace name</label>
                    <input class="field-input" value="Black Bear Rentals">
                    <span class="field-hint">Appears in the sidebar, invoices, and emails.</span>
                  </div>
                  <div class="field">
                    <label class="field-label">Legal entity</label>
                    <input class="field-input" value="Black Bear Rentals LLC">
                  </div>
                  <div class="field">
                    <label class="field-label">Workspace ID</label>
                    <div class="row" style="gap: 8px;">
                      <code class="mono" style="flex: 1;">ws_9f2a_blackbear_01</code>
                      <button class="copy-btn" data-copy="ws_9f2a_blackbear_01">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div class="field">
                    <label class="field-label">Timezone</label>
                    <select class="field-select">
                      <option>America/New_York (EST)</option>
                      <option>America/Chicago (CST)</option>
                      <option>America/Denver (MST)</option>
                      <option>America/Los_Angeles (PST)</option>
                    </select>
                  </div>
                </div>

                <div class="form-footer">
                  <button class="btn btn-ghost" data-action="cancel">Cancel</button>
                  <button class="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">DOMAINS</div>
                    <h2>Subdomain & custom domain</h2>
                    <p>Host your tenant portal and public listings on your own domain.</p>
                  </div>
                </div>

                <div class="stack">
                  <div class="domain-row">
                    <div class="domain-info">
                      <div><code>blackbear.tenantory.com</code> <span class="pill pill-green" style="margin-left: 6px;"><span class="pill-dot"></span>Live</span></div>
                      <div class="domain-info-sub">Default workspace subdomain · SSL provisioned · tenants land here</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="manage-subdomain">Manage</button>
                  </div>
                  <div class="domain-row">
                    <div class="domain-info">
                      <div><code>pay.rentblackbear.com</code> <span class="pill pill-orange" style="margin-left: 6px;"><span class="pill-dot"></span>DNS pending</span></div>
                      <div class="domain-info-sub">Custom tenant portal domain · add CNAME → cname.tenantory.app</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="verify-dns">Verify DNS</button>
                  </div>
                  <button class="btn btn-ghost" style="align-self: flex-start;" data-action="add-domain">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Add another domain
                  </button>
                </div>
              </div>

              <div class="danger-zone">
                <div>
                  <h4>Delete this workspace</h4>
                  <p>Permanently remove Black Bear Rentals, all tenants, leases, and payments. This cannot be undone.</p>
                </div>
                <button class="btn btn-danger" data-action="delete-workspace">Delete workspace</button>
              </div>
            </section>

            <!-- ========== BRAND PANEL ========== -->
            <section class="settings-panel" data-panel="brand">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">VISUAL ASSETS</div>
                    <h2>Logo & favicon</h2>
                    <p>Used on the tenant portal, apply pages, emails, and PDF statements.</p>
                  </div>
                </div>
                <div class="upload-row">
                  <div class="upload" data-action="upload-logo">
                    <div class="upload-preview">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
                    </div>
                    <div class="upload-label">Drop logo here or click to upload</div>
                    <div class="upload-hint">PNG or SVG · transparent background · at least 512px</div>
                  </div>
                  <div class="upload" data-action="upload-favicon">
                    <div class="upload-preview small">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
                    </div>
                    <div class="upload-label">Favicon</div>
                    <div class="upload-hint">32×32 or 64×64 · ICO / PNG</div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">CONTACT</div>
                    <h2>Company contact info</h2>
                    <p>Shown in the portal footer, on invoices, and auto-replies.</p>
                  </div>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <label class="field-label">Company name</label>
                    <input class="field-input" value="Black Bear Rentals">
                  </div>
                  <div class="field">
                    <label class="field-label">Tagline</label>
                    <input class="field-input" value="Short-term & long-term homes in Western NC">
                  </div>
                  <div class="field">
                    <label class="field-label">Phone</label>
                    <input class="field-input" value="(828) 555-0142">
                  </div>
                  <div class="field">
                    <label class="field-label">Email</label>
                    <input class="field-input" value="hello@rentblackbear.com">
                  </div>
                  <div class="field" style="grid-column: span 2;">
                    <label class="field-label">Mailing address</label>
                    <input class="field-input" value="14 Biltmore Ave, Asheville NC 28801">
                  </div>
                  <div class="field" style="grid-column: span 2;">
                    <label class="field-label">Tenant-facing footer text</label>
                    <textarea class="field-input" rows="3">© Black Bear Rentals. For maintenance emergencies after hours, call (828) 555-0142. Equal housing opportunity.</textarea>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="adv-section-title">Social links</div>
                <div class="social-grid">
                  <div class="field-prefix-group">
                    <span class="field-prefix">instagram.com/</span>
                    <input value="rentblackbear">
                  </div>
                  <div class="field-prefix-group">
                    <span class="field-prefix">facebook.com/</span>
                    <input value="rentblackbear">
                  </div>
                  <div class="field-prefix-group">
                    <span class="field-prefix">tiktok.com/@</span>
                    <input value="rentblackbear">
                  </div>
                  <div class="field-prefix-group">
                    <span class="field-prefix">https://</span>
                    <input value="rentblackbear.com">
                  </div>
                </div>

                <div class="form-footer">
                  <button class="btn btn-ghost" data-action="cancel">Cancel</button>
                  <button class="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>
            </section>

            <!-- ========== THEME PANEL ========== -->
            <section class="settings-panel active" data-panel="theme">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">VISUAL IDENTITY</div>
                    <h2>Pick your theme.</h2>
                    <p>One click changes every pixel — admin dashboard, tenant portal, apply page, and emails.</p>
                  </div>
                </div>

                <div class="theme-grid" id="theme-grid">
                  <!-- Flagship -->
                  <div class="theme-card active" data-theme="Flagship">
                    <div class="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="theme-preview tp-flagship">
                      <div class="tp-sidebar">
                        <div class="tp-logo"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row active"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                      </div>
                      <div class="tp-body">
                        <div class="tp-head-row"><div class="tp-title"></div><div class="tp-chip"></div></div>
                        <div class="tp-kpi-row">
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                        </div>
                        <div class="tp-table">
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                        </div>
                      </div>
                    </div>
                    <div class="theme-info">
                      <div class="theme-name-row">
                        <span class="theme-name">Flagship</span>
                        <span class="theme-tag">Default</span>
                      </div>
                      <div class="theme-desc">Navy + blue + pink. Premium SaaS. The default Tenantory look.</div>
                      <div class="theme-action-row">
                        <button class="theme-use-btn">Active</button>
                        <span class="theme-tag">Applied</span>
                      </div>
                    </div>
                  </div>

                  <!-- Hearth -->
                  <div class="theme-card" data-theme="Hearth">
                    <div class="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="theme-preview tp-hearth">
                      <div class="tp-sidebar">
                        <div class="tp-logo"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row active"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                      </div>
                      <div class="tp-body">
                        <div class="tp-head-row"><div class="tp-title"></div><div class="tp-chip"></div></div>
                        <div class="tp-kpi-row">
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                        </div>
                        <div class="tp-table">
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                        </div>
                      </div>
                    </div>
                    <div class="theme-info">
                      <div class="theme-name-row"><span class="theme-name">Hearth</span></div>
                      <div class="theme-desc">Warm gold + green on cream. For operators who want warmth, not tech.</div>
                      <div class="theme-action-row">
                        <button class="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  <!-- Nocturne -->
                  <div class="theme-card" data-theme="Nocturne">
                    <div class="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="theme-preview tp-nocturne">
                      <div class="tp-sidebar">
                        <div class="tp-logo"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row active"></div>
                        <div class="tp-sb-row"></div>
                      </div>
                      <div class="tp-body">
                        <div class="tp-head-row"><div class="tp-title"></div><div class="tp-chip"></div></div>
                        <div class="tp-kpi-row">
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                        </div>
                        <div class="tp-table">
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                        </div>
                      </div>
                    </div>
                    <div class="theme-info">
                      <div class="theme-name-row"><span class="theme-name">Nocturne</span></div>
                      <div class="theme-desc">Full dark mode. Bright accents on black. For night-shift power users.</div>
                      <div class="theme-action-row">
                        <button class="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  <!-- Slate -->
                  <div class="theme-card" data-theme="Slate">
                    <div class="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="theme-preview tp-slate">
                      <div class="tp-sidebar">
                        <div class="tp-logo"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row active"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                        <div class="tp-sb-row"></div>
                      </div>
                      <div class="tp-body">
                        <div class="tp-head-row"><div class="tp-title"></div><div class="tp-chip"></div></div>
                        <div class="tp-kpi-row">
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                          <div class="tp-kpi"><div class="tp-kpi-bar-sm"></div><div class="tp-kpi-bar-lg"></div></div>
                        </div>
                        <div class="tp-table">
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                          <div class="tp-row"><div class="tp-avatar-dot"></div><div class="tp-row-line"></div></div>
                        </div>
                      </div>
                    </div>
                    <div class="theme-info">
                      <div class="theme-name-row"><span class="theme-name">Slate</span></div>
                      <div class="theme-desc">Grayscale + single accent. Minimalist. Enterprise-buyer friendly.</div>
                      <div class="theme-action-row">
                        <button class="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>

                  <!-- Custom -->
                  <div class="theme-card" data-theme="Custom">
                    <div class="theme-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div class="theme-preview tp-custom">
                      <div class="tp-custom-icon"></div>
                      <div class="tp-custom-label">Build your own</div>
                    </div>
                    <div class="theme-info">
                      <div class="theme-name-row"><span class="theme-name">Custom</span></div>
                      <div class="theme-desc">Pick your own accent + font. Your brand, your way.</div>
                      <div class="theme-action-row">
                        <button class="theme-use-btn">Use this theme</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Advanced theme settings -->
              <div class="advanced open" id="advanced-theme">
                <div class="advanced-head">
                  <div class="advanced-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>
                    Advanced theme settings
                  </div>
                  <svg class="advanced-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="advanced-body">

                  <div class="adv-section">
                    <div class="adv-section-title">Customize current theme · Flagship</div>
                    <div class="field-grid">
                      <div class="field">
                        <label class="field-label">Accent color</label>
                        <div class="color-picker">
                          <div class="color-swatch" style="background: #1251AD;">
                            <input type="color" value="#1251AD">
                          </div>
                          <input class="color-hex" value="#1251AD">
                        </div>
                        <span class="field-hint">Primary CTAs, links, active states.</span>
                      </div>
                      <div class="field">
                        <label class="field-label">Secondary accent</label>
                        <div class="color-picker">
                          <div class="color-swatch" style="background: #FF4998;">
                            <input type="color" value="#FF4998">
                          </div>
                          <input class="color-hex" value="#FF4998">
                        </div>
                        <span class="field-hint">Badges, highlights, the "what's new" color.</span>
                      </div>
                      <div class="field">
                        <label class="field-label">Font family</label>
                        <select class="field-select">
                          <option>Inter</option>
                          <option>IBM Plex Sans</option>
                          <option>Geist</option>
                          <option>Söhne</option>
                          <option>System default</option>
                        </select>
                      </div>
                      <div class="field">
                        <label class="field-label">Heading weight</label>
                        <select class="field-select">
                          <option>800 (Extra bold)</option>
                          <option>700 (Bold)</option>
                          <option>600 (Semibold)</option>
                        </select>
                      </div>
                      <div class="field">
                        <label class="field-label">Border radius</label>
                        <div class="segmented" data-group="radius">
                          <button>Sharp</button>
                          <button class="active">Rounded</button>
                          <button>Pill</button>
                        </div>
                      </div>
                      <div class="field">
                        <label class="field-label">Sidebar style</label>
                        <div class="segmented" data-group="sidebar-style">
                          <button class="active">Dark</button>
                          <button>Light</button>
                          <button>Minimal</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="divider"></div>

                  <div class="adv-section">
                    <div class="adv-section-title">Where this applies</div>
                    <div class="checkbox-list">
                      <div class="checkbox-row checked" data-toggle="checkbox">
                        <div class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                        <div>
                          <div class="checkbox-label">Admin dashboard</div>
                          <div class="checkbox-sub">This app — what owners and managers see.</div>
                        </div>
                      </div>
                      <div class="checkbox-row checked" data-toggle="checkbox">
                        <div class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                        <div>
                          <div class="checkbox-label">Tenant portal</div>
                          <div class="checkbox-sub">Where tenants pay rent and submit work orders.</div>
                        </div>
                      </div>
                      <div class="checkbox-row checked" data-toggle="checkbox">
                        <div class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                        <div>
                          <div class="checkbox-label">Apply page</div>
                          <div class="checkbox-sub">Public rental application shared via QR code and link.</div>
                        </div>
                      </div>
                      <div class="checkbox-row" data-toggle="checkbox">
                        <div class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                        <div>
                          <div class="checkbox-label">Public listings</div>
                          <div class="checkbox-sub">Your branded listing site (blackbear.tenantory.com/listings).</div>
                        </div>
                      </div>
                      <div class="checkbox-row checked" data-toggle="checkbox">
                        <div class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                        <div>
                          <div class="checkbox-label">Email templates</div>
                          <div class="checkbox-sub">Receipts, reminders, lease offers — all system emails.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-footer">
                    <button class="btn btn-ghost" data-action="reset-theme">Reset to default</button>
                    <button class="btn btn-primary" data-action="save">Save changes</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- ========== BILLING PANEL ========== -->
            <section class="settings-panel" data-panel="billing">
              <div class="sub-card">
                <div style="position: relative; z-index: 1;">
                  <div class="sub-card-eyebrow">CURRENT PLAN</div>
                  <h3>Tenantory Pro</h3>
                  <div class="sub-price"><strong>$99</strong><span>/ month</span></div>
                  <div class="sub-locked-badge">Founders' offer · Locked for life</div>
                  <div style="margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.75);">
                    Up to 25 units · Unlimited applications · Stripe + Plaid · Priority support
                  </div>
                </div>
                <div class="sub-card-right">
                  <span class="pill pill-green"><span class="pill-dot"></span>Active</span>
                  <div style="font-size: 12px; color: rgba(255,255,255,0.75); text-align: right;">Next billing</div>
                  <div style="font-size: 16px; font-weight: 800;">May 1, 2026</div>
                  <button class="btn btn-pink btn-sm" data-action="manage-plan" style="margin-top: 6px;">Compare plans</button>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">USAGE THIS CYCLE</div>
                    <h2>Where your plan is being used.</h2>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="usage-details">Full usage report</button>
                </div>
                <div class="usage-grid">
                  <div class="usage-item">
                    <div class="usage-label">Units in portfolio</div>
                    <div class="usage-val">12 <span>/ 25</span></div>
                    <div class="usage-bar"><div class="usage-fill ok" style="width: 48%;"></div></div>
                  </div>
                  <div class="usage-item">
                    <div class="usage-label">SMS credits</div>
                    <div class="usage-val">234 <span>/ 500</span></div>
                    <div class="usage-bar"><div class="usage-fill" style="width: 47%;"></div></div>
                  </div>
                  <div class="usage-item">
                    <div class="usage-label">AI screenings</div>
                    <div class="usage-val">18 <span>/ 50</span></div>
                    <div class="usage-bar"><div class="usage-fill ok" style="width: 36%;"></div></div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">PAYMENT METHOD</div>
                    <h2>Card on file</h2>
                  </div>
                </div>
                <div class="row-between" style="padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-subtle);">
                  <div class="row" style="gap: 14px;">
                    <div style="width: 42px; height: 28px; border-radius: 5px; background: linear-gradient(135deg, #1a1f71, #2a5298); color: #fff; font-weight: 800; font-size: 11px; display: flex; align-items: center; justify-content: center;">VISA</div>
                    <div>
                      <div class="strong" style="font-size: 13px;">Visa ending ••4242</div>
                      <div class="muted" style="font-size: 11px;">Expires 08 / 2028 · Harrison Cooper</div>
                    </div>
                  </div>
                  <div class="row">
                    <button class="btn btn-ghost btn-sm" data-action="manage-payment">Manage payment method</button>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">HISTORY</div>
                    <h2>Past invoices</h2>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="download-all-invoices">Download all</button>
                </div>
                <table class="t-table">
                  <thead>
                    <tr><th>Date</th><th>Invoice</th><th>Amount</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Apr 1, 2026</td><td><code class="mono">INV-2026-0041</code></td><td>$99.00</td><td><span class="pill pill-green"><span class="pill-dot"></span>Paid</span></td><td style="text-align: right;"><a class="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Mar 1, 2026</td><td><code class="mono">INV-2026-0029</code></td><td>$99.00</td><td><span class="pill pill-green"><span class="pill-dot"></span>Paid</span></td><td style="text-align: right;"><a class="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Feb 1, 2026</td><td><code class="mono">INV-2026-0017</code></td><td>$99.00</td><td><span class="pill pill-green"><span class="pill-dot"></span>Paid</span></td><td style="text-align: right;"><a class="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Jan 1, 2026</td><td><code class="mono">INV-2026-0005</code></td><td>$99.00</td><td><span class="pill pill-green"><span class="pill-dot"></span>Paid</span></td><td style="text-align: right;"><a class="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                    <tr><td>Dec 1, 2025</td><td><code class="mono">INV-2025-0108</code></td><td>$99.00</td><td><span class="pill pill-green"><span class="pill-dot"></span>Paid</span></td><td style="text-align: right;"><a class="link" href="#" data-action="view-invoice">Download PDF</a></td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- ========== STRIPE PANEL ========== -->
            <section class="settings-panel" data-panel="stripe">
              <div class="card">
                <div class="stripe-head">
                  <div class="stripe-logo">S</div>
                  <div class="stripe-head-info">
                    <h3>Stripe Connect</h3>
                    <p>Accept rent, deposits, and application fees directly to your bank account.</p>
                  </div>
                  <span class="pill pill-green" style="background: rgba(255,255,255,0.2); color: #fff;"><span class="pill-dot" style="background: var(--surface);"></span>Connected</span>
                </div>

                <div class="field-grid" style="margin-top: 20px;">
                  <div class="field">
                    <label class="field-label">Account email</label>
                    <input class="field-input" value="harrison@rentblackbear.com" readonly>
                  </div>
                  <div class="field">
                    <label class="field-label">Stripe account ID</label>
                    <div class="row" style="gap: 8px;">
                      <code class="mono" style="flex: 1;">acct_1PqXH82fKl9mQnRp</code>
                      <button class="copy-btn" data-copy="acct_1PqXH82fKl9mQnRp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div class="field">
                    <label class="field-label">Connected since</label>
                    <input class="field-input" value="Sep 14, 2025" readonly>
                  </div>
                  <div class="field">
                    <label class="field-label">Payout schedule</label>
                    <select class="field-select">
                      <option>Daily (2-day rolling)</option>
                      <option>Weekly — every Friday</option>
                      <option>Monthly — 1st of month</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Platform fee passthrough</label>
                    <select class="field-select">
                      <option>Split with tenant (tenant pays 2.9% + 30¢)</option>
                      <option>Absorb all fees (you pay)</option>
                      <option>Split 50/50</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">ACH via Plaid</label>
                    <div class="row" style="gap: 10px;">
                      <div class="switch on"></div>
                      <span class="muted" style="font-size: 12px;">$0.80 per ACH transfer · tenants love it</span>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Test mode</h4>
                    <p>Route all Stripe activity to test keys. Useful when onboarding a new workflow.</p>
                  </div>
                  <div class="switch"></div>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Open Stripe Dashboard</h4>
                    <p>View transactions, disputes, and payouts in Stripe's native UI.</p>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="open-stripe">
                    Open dashboard
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
                  </button>
                </div>
              </div>

              <div class="danger-zone">
                <div>
                  <h4>Disconnect Stripe</h4>
                  <p>Tenants won't be able to pay online. Pending payouts continue on their original schedule.</p>
                </div>
                <button class="btn btn-danger" data-action="disconnect-stripe">Disconnect</button>
              </div>
            </section>

            <!-- ========== INTEGRATIONS PANEL ========== -->
            <section class="settings-panel" data-panel="integrations">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">CONNECTED</div>
                    <h2>Running integrations</h2>
                    <p>Third-party services actively powering your workspace.</p>
                  </div>
                </div>
                <div class="integ-grid">
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #2ca01c;">Qb</div>
                    <div class="integ-info">
                      <div class="integ-name">QuickBooks Online <span class="pill pill-green"><span class="pill-dot"></span>Connected</span></div>
                      <div class="integ-desc">Two-way sync of rent, expenses, and categories. Last sync 2m ago.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #000;">R</div>
                    <div class="integ-info">
                      <div class="integ-name">Resend <span class="pill pill-green"><span class="pill-dot"></span>Connected</span></div>
                      <div class="integ-desc">Transactional email · 2,413 sent this month · 99.6% delivered.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #f22f46;">T</div>
                    <div class="integ-info">
                      <div class="integ-name">Twilio <span class="pill pill-green"><span class="pill-dot"></span>Connected</span></div>
                      <div class="integ-desc">SMS rent reminders and two-way tenant messaging. 234/500 credits used.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #635bff;">$</div>
                    <div class="integ-info">
                      <div class="integ-name">Stripe <span class="pill pill-green"><span class="pill-dot"></span>Connected</span></div>
                      <div class="integ-desc">Payments · managed in Stripe Connect tab.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="configure">Configure</button></div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="eyebrow" style="color: var(--text-faint);">AVAILABLE</div>
                <div class="integ-grid" style="margin-top: 14px;">
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #1a1f36;">P</div>
                    <div class="integ-info">
                      <div class="integ-name">Plaid <span class="pill pill-gray"><span class="pill-dot"></span>Disconnected</span></div>
                      <div class="integ-desc">Income verification and bank account linking for ACH rent.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-primary btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #ff4a00;">Z</div>
                    <div class="integ-info">
                      <div class="integ-name">Zapier</div>
                      <div class="integ-desc">Trigger 6,000+ apps from Tenantory events — new lease, late payment, etc.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #4a154b;">Sl</div>
                    <div class="integ-info">
                      <div class="integ-name">Slack</div>
                      <div class="integ-desc">Post new applications, work orders, and payments to a Slack channel.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #4285f4;">G</div>
                    <div class="integ-info">
                      <div class="integ-name">Google Calendar</div>
                      <div class="integ-desc">Sync showings, inspections, and lease expirations to Google Calendar.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #000;">X</div>
                    <div class="integ-info">
                      <div class="integ-name">DocuSign</div>
                      <div class="integ-desc">E-sign lease agreements and addenda with legally-binding signatures.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="connect">Connect</button></div>
                  </div>
                  <div class="integ-card">
                    <div class="integ-logo" style="background: #00a699;">A</div>
                    <div class="integ-info">
                      <div class="integ-name">Airbnb / VRBO</div>
                      <div class="integ-desc">Pull short-term bookings into your unified rent roll. Beta.</div>
                    </div>
                    <div class="integ-action"><button class="btn btn-ghost btn-sm" data-action="waitlist">Join beta</button></div>
                  </div>
                </div>
              </div>
            </section>

            <!-- ========== TEAM PANEL ========== -->
            <section class="settings-panel" data-panel="team">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">WORKSPACE MEMBERS</div>
                    <h2>Who has access to Black Bear Rentals</h2>
                    <p>2 active members · 2 pending invites · Up to 5 included in your plan.</p>
                  </div>
                  <button class="btn btn-primary" data-action="invite">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                    Invite member
                  </button>
                </div>

                <div class="stack">
                  <div class="member-row">
                    <div class="member-avatar" style="background: linear-gradient(135deg, var(--pink), var(--gold));">HC</div>
                    <div class="member-info">
                      <div class="member-name">Harrison Cooper · <span class="pill pill-pink" style="font-size: 10px;">Owner</span></div>
                      <div class="member-email">harrison@rentblackbear.com</div>
                      <div class="member-meta">Joined Sep 14, 2025 · Last active 2m ago</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="member-menu">You</button>
                  </div>
                  <div class="member-row">
                    <div class="member-avatar" style="background: linear-gradient(135deg, var(--blue-bright), var(--purple));">CC</div>
                    <div class="member-info">
                      <div class="member-name">Carolina Cooper · <span class="pill pill-blue" style="font-size: 10px;">Manager</span></div>
                      <div class="member-email">carolina@rentblackbear.com</div>
                      <div class="member-meta">Joined Oct 2, 2025 · Last active 1h ago</div>
                    </div>
                    <div class="row">
                      <select class="field-select" style="padding: 6px 10px; font-size: 12px;">
                        <option>Manager</option>
                        <option>Owner</option>
                        <option>Viewer</option>
                      </select>
                      <button class="btn btn-ghost btn-sm" data-action="remove-member">Remove</button>
                    </div>
                  </div>
                </div>

                <div class="hr-label" style="margin-top: 24px;"><span>Pending invites · 2</span></div>

                <div class="stack">
                  <div class="member-row" style="background: var(--surface-subtle);">
                    <div class="member-avatar" style="background: var(--border-strong); color: var(--text-muted);">?</div>
                    <div class="member-info">
                      <div class="member-name">maintenance@rentblackbear.com · <span class="pill pill-gray" style="font-size: 10px;">Viewer</span></div>
                      <div class="member-meta">Invited 3 days ago · Expires in 4 days</div>
                    </div>
                    <div class="row">
                      <button class="btn btn-ghost btn-sm" data-action="resend-invite">Resend</button>
                      <button class="btn btn-ghost btn-sm" data-action="revoke-invite">Revoke</button>
                    </div>
                  </div>
                  <div class="member-row" style="background: var(--surface-subtle);">
                    <div class="member-avatar" style="background: var(--border-strong); color: var(--text-muted);">?</div>
                    <div class="member-info">
                      <div class="member-name">bookkeeper@rentblackbear.com · <span class="pill pill-gray" style="font-size: 10px;">Viewer</span></div>
                      <div class="member-meta">Invited 1 day ago · Expires in 6 days</div>
                    </div>
                    <div class="row">
                      <button class="btn btn-ghost btn-sm" data-action="resend-invite">Resend</button>
                      <button class="btn btn-ghost btn-sm" data-action="revoke-invite">Revoke</button>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="adv-section-title">Roles & permissions</div>
                <table class="t-table">
                  <thead>
                    <tr><th>Role</th><th>What they can do</th><th>Seats used</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span class="pill pill-pink">Owner</span></td><td>Everything — billing, delete workspace, invite team.</td><td>1</td></tr>
                    <tr><td><span class="pill pill-blue">Manager</span></td><td>Properties, tenants, leases, payments, applications. No billing.</td><td>1</td></tr>
                    <tr><td><span class="pill pill-gray">Viewer</span></td><td>Read-only access to dashboards and reports.</td><td>0</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- ========== NOTIFICATIONS PANEL ========== -->
            <section class="settings-panel" data-panel="notifications">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">CHANNELS</div>
                    <h2>How Tenantory reaches you</h2>
                    <p>Choose which events fire an email, a text, or a push to your phone.</p>
                  </div>
                </div>

                <table class="notif-table">
                  <thead>
                    <tr><th>Event</th><th>Email</th><th>SMS</th><th>Push</th></tr>
                  </thead>
                  <tbody id="notif-body">
                    <tr>
                      <td><div class="notif-name">Rent paid</div><div class="notif-desc">A tenant completed a rent payment.</div></td>
                      <td><div class="switch on" data-notif="rent-paid-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="rent-paid-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="rent-paid-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Late payment</div><div class="notif-desc">Rent is overdue past the grace period.</div></td>
                      <td><div class="switch on" data-notif="late-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="late-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="late-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Tenant message</div><div class="notif-desc">A tenant replied in their portal.</div></td>
                      <td><div class="switch on" data-notif="msg-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="msg-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="msg-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">New application</div><div class="notif-desc">A prospect submitted a rental application.</div></td>
                      <td><div class="switch on" data-notif="app-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="app-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="app-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Lease expiring</div><div class="notif-desc">60 / 30 / 7 days before a lease ends.</div></td>
                      <td><div class="switch on" data-notif="lease-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="lease-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="lease-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Maintenance request</div><div class="notif-desc">A tenant opened a work order.</div></td>
                      <td><div class="switch on" data-notif="maint-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="maint-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="maint-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Maintenance resolved</div><div class="notif-desc">Vendor or manager marked complete.</div></td>
                      <td><div class="switch" data-notif="maintdone-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="maintdone-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch on" data-notif="maintdone-push" style="margin: 0 auto;"></div></td>
                    </tr>
                    <tr>
                      <td><div class="notif-name">Weekly summary</div><div class="notif-desc">Monday morning digest of the portfolio.</div></td>
                      <td><div class="switch on" data-notif="wk-email" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="wk-sms" style="margin: 0 auto;"></div></td>
                      <td><div class="switch" data-notif="wk-push" style="margin: 0 auto;"></div></td>
                    </tr>
                  </tbody>
                </table>

                <div class="divider"></div>

                <div class="adv-section-title">Delivery preferences</div>
                <div class="field-grid">
                  <div class="field">
                    <label class="field-label">Email sender</label>
                    <input class="field-input" value="Black Bear Rentals <hello@rentblackbear.com>">
                  </div>
                  <div class="field">
                    <label class="field-label">SMS quiet hours</label>
                    <input class="field-input" value="9:00 PM — 8:00 AM local time">
                  </div>
                </div>

                <div class="form-footer">
                  <button class="btn btn-ghost" data-action="reset-notif">Reset defaults</button>
                  <button class="btn btn-primary" data-action="save">Save changes</button>
                </div>
              </div>
            </section>

            <!-- ========== SECURITY PANEL ========== -->
            <section class="settings-panel" data-panel="security">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">AUTHENTICATION</div>
                    <h2>Sign-in security</h2>
                  </div>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Two-factor authentication · <span class="pill pill-green" style="margin-left: 4px;"><span class="pill-dot"></span>Enabled</span></h4>
                    <p>Using authenticator app (1Password) · backup codes generated Jan 2026</p>
                  </div>
                  <div class="row">
                    <button class="btn btn-ghost btn-sm" data-action="regen-backup">Regenerate codes</button>
                    <button class="btn btn-ghost btn-sm" data-action="disable-2fa">Disable</button>
                  </div>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Password</h4>
                    <p>Last changed 47 days ago</p>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="change-password">Change password</button>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Login alerts</h4>
                    <p>Email you when a new device signs in to this workspace.</p>
                  </div>
                  <div class="switch on"></div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">ACTIVE SESSIONS · 3</div>
                    <h2>Devices currently signed in</h2>
                  </div>
                  <button class="btn btn-danger btn-sm" data-action="signout-all">Sign out all devices</button>
                </div>
                <div class="session-row">
                  <div class="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  </div>
                  <div class="session-info">
                    <div class="session-title">MacBook Pro · Chrome <span class="pill pill-green" style="margin-left: 6px;"><span class="pill-dot"></span>This device</span></div>
                    <div class="session-meta">Asheville, NC · 73.134.22.18 · active now</div>
                  </div>
                </div>
                <div class="session-row">
                  <div class="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></svg>
                  </div>
                  <div class="session-info">
                    <div class="session-title">iPhone 15 Pro · Safari</div>
                    <div class="session-meta">Asheville, NC · last active 6 min ago</div>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="revoke-session">Revoke</button>
                </div>
                <div class="session-row">
                  <div class="session-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  </div>
                  <div class="session-info">
                    <div class="session-title">iPad · Safari</div>
                    <div class="session-meta">Asheville, NC · last active 3 days ago</div>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="revoke-session">Revoke</button>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">AUDIT</div>
                    <h2>Access logs</h2>
                    <p>Every login, permission change, and data export — kept for 12 months.</p>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="view-logs">
                    View full log
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </section>

            <!-- ========== PRIVACY PANEL ========== -->
            <section class="settings-panel" data-panel="privacy">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">YOUR DATA, YOUR CALL</div>
                    <h2>Export everything</h2>
                    <p>Every property, tenant, lease, payment, document, and message — one JSON file.</p>
                  </div>
                </div>
                <button class="btn btn-dark" data-action="export-data" style="padding: 14px 22px; font-size: 14px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Export workspace data (JSON)
                </button>
                <div class="dot-list" style="margin-top: 10px;">
                  <span>Last export: Mar 22, 2026</span>
                  <span class="dot-sep"></span>
                  <span>24.8 MB</span>
                  <span class="dot-sep"></span>
                  <a class="link" href="#" data-action="download-prev">Re-download previous export</a>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">COMPLIANCE TOOLS</div>
                    <h2>GDPR / CCPA requests</h2>
                    <p>One-click workflows for tenant data requests.</p>
                  </div>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Tenant data export</h4>
                    <p>Send a specific tenant everything you hold on them. Required within 30 days under GDPR.</p>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="export-tenant">Start request</button>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Right to be forgotten</h4>
                    <p>Redact a former tenant's PII while preserving anonymized lease history for your books.</p>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="forget-tenant">Start request</button>
                </div>
                <div class="sec-item">
                  <div class="sec-item-info">
                    <h4>Cookie consent banner</h4>
                    <p>Show EU visitors a banner on your listings page and apply form.</p>
                  </div>
                  <div class="switch on"></div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">RETENTION</div>
                    <h2>How long we keep things</h2>
                  </div>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <label class="field-label">Rejected applications</label>
                    <select class="field-select">
                      <option>90 days (then auto-deleted)</option>
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Former tenant records</label>
                    <select class="field-select">
                      <option>7 years (IRS-compliant)</option>
                      <option>5 years</option>
                      <option>3 years</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Message transcripts</label>
                    <select class="field-select">
                      <option>While tenancy is active + 2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Payment records</label>
                    <select class="field-select">
                      <option>7 years (tax compliance)</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>
                <div class="form-footer">
                  <button class="btn btn-primary" data-action="save">Save retention policy</button>
                </div>
              </div>
            </section>

            <!-- ========== API PANEL ========== -->
            <section class="settings-panel" data-panel="api">
              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">API ACCESS</div>
                    <h2>Your API keys</h2>
                    <p>Use these to connect Tenantory to your own tools. Treat the live key like a password.</p>
                  </div>
                  <button class="btn btn-primary btn-sm" data-action="new-key">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    New key
                  </button>
                </div>

                <table class="t-table">
                  <thead>
                    <tr><th>Name</th><th>Key</th><th>Created</th><th>Last used</th><th></th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="strong">Live production</span><div class="muted" style="font-size: 11px;">Read + write · all scopes</div></td>
                      <td><code class="mono">tnt_live_••••••••UJk2</code></td>
                      <td>Sep 14, 2025</td>
                      <td>14 min ago</td>
                      <td style="text-align: right;">
                        <button class="copy-btn" data-copy="tnt_live_sk_UJk2xxxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          Copy
                        </button>
                        <button class="btn btn-ghost btn-sm" data-action="rotate-key" style="margin-left: 4px;">Rotate</button>
                      </td>
                    </tr>
                    <tr>
                      <td><span class="strong">Test key</span><div class="muted" style="font-size: 11px;">Read-only · safe for local dev</div></td>
                      <td><code class="mono">tnt_test_••••••••9Qx0</code></td>
                      <td>Jan 4, 2026</td>
                      <td>Yesterday</td>
                      <td style="text-align: right;">
                        <button class="copy-btn" data-copy="tnt_test_sk_9Qx0xxxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          Copy
                        </button>
                        <button class="btn btn-ghost btn-sm" data-action="rotate-key" style="margin-left: 4px;">Rotate</button>
                      </td>
                    </tr>
                    <tr>
                      <td><span class="strong">Zapier</span><div class="muted" style="font-size: 11px;">Write only · applications + payments</div></td>
                      <td><code class="mono">tnt_live_••••••••Zp17</code></td>
                      <td>Feb 20, 2026</td>
                      <td>2 hours ago</td>
                      <td style="text-align: right;">
                        <button class="copy-btn" data-copy="tnt_live_zap_Zp17xxx">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          Copy
                        </button>
                        <button class="btn btn-ghost btn-sm" data-action="rotate-key" style="margin-left: 4px;">Revoke</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="card">
                <div class="card-head">
                  <div>
                    <div class="eyebrow">WEBHOOKS</div>
                    <h2>Outbound endpoints</h2>
                    <p>Tenantory will POST to these URLs whenever a subscribed event happens.</p>
                  </div>
                  <button class="btn btn-primary btn-sm" data-action="add-webhook">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Add webhook
                  </button>
                </div>

                <div class="stack">
                  <div class="webhook-row">
                    <div class="webhook-status active"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div class="webhook-url">https://hooks.rentblackbear.com/tenantory</div>
                      <div class="webhook-events">payment.succeeded, payment.failed, lease.signed · 1,204 deliveries · 100% success</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                  <div class="webhook-row">
                    <div class="webhook-status active"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div class="webhook-url">https://hooks.zapier.com/hooks/catch/8821/application.submitted</div>
                      <div class="webhook-events">application.submitted · 47 deliveries · 98% success</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                  <div class="webhook-row">
                    <div class="webhook-status failing"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div class="webhook-url">https://n8n.internal.rentblackbear.com/hook/maintenance</div>
                      <div class="webhook-events">maintenance.created · 12 deliveries · 3 failing · last error: 504 Gateway Timeout</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="configure">Configure</button>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="adv-section-title">Signing secret</div>
                <div class="row" style="gap: 10px;">
                  <code class="mono" style="flex: 1;">whsec_e8f4a21c49••••••••••••d7b22f91</code>
                  <button class="copy-btn" data-copy="whsec_e8f4a21c49xxxxxxxxxxxxd7b22f91">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </button>
                  <button class="btn btn-ghost btn-sm" data-action="rotate-secret">Rotate secret</button>
                </div>
                <div class="field-hint" style="margin-top: 6px;">Verify this on your side using HMAC-SHA256 of the raw request body.</div>
              </div>
            </section>

          </div>
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
