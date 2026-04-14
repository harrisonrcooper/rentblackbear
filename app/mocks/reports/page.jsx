"use client";

// Mock ported verbatim from ~/Desktop/tenantory/reports.html.
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
    input, select { font-family: inherit; font-size: inherit; }

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
      --gold-bg: rgba(245,166,35,0.14);
      --gold-dark: #b87a15;
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

    /* ===== Scroll area ===== */
    .scroll { flex: 1; overflow-y: auto; padding-bottom: 40px; }

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
    }
    .stat-delta { font-size: 11px; font-weight: 700; }
    .stat-delta.up { color: var(--green-dark); }
    .stat-delta.pink { color: var(--pink); }
    .stat-delta.orange { color: var(--orange); }
    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .stat-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      background: var(--green-bg); color: var(--green-dark);
    }
    .stat-pill svg { width: 10px; height: 10px; }

    /* ===== Date range bar ===== */
    .range-bar {
      margin: 16px 28px 0;
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .range-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface);
      border: 1px solid var(--border); border-radius: 100px;
      font-size: 13px; font-weight: 600; color: var(--text);
      transition: all 0.15s ease;
    }
    .range-chip:hover { border-color: var(--blue); color: var(--blue); }
    .range-chip svg { width: 13px; height: 13px; opacity: 0.7; }
    .range-chip.accent { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }
    .range-chip .chip-sep { color: var(--text-faint); font-weight: 500; font-size: 11px; }
    .range-reset {
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      padding: 4px 8px; border-radius: 6px;
      transition: all 0.15s ease;
    }
    .range-reset:hover { color: var(--blue); background: var(--blue-pale); }

    /* ===== Tax Pack callout ===== */
    .tax-pack {
      margin: 20px 28px 0;
      border-radius: var(--radius-lg);
      padding: 24px 28px;
      background:
        radial-gradient(120% 140% at 0% 0%, rgba(255,73,152,0.12) 0%, rgba(255,73,152,0) 50%),
        radial-gradient(120% 140% at 100% 100%, rgba(18,81,173,0.08) 0%, rgba(18,81,173,0) 55%),
        linear-gradient(180deg, #fff 0%, #fff 100%);
      border: 1px solid var(--pink-strong);
      box-shadow: 0 4px 20px rgba(255,73,152,0.08);
      display: flex; align-items: center; gap: 28px; flex-wrap: wrap;
      position: relative; overflow: hidden;
    }
    .tax-pack::before {
      content: ""; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
      background: linear-gradient(180deg, var(--pink), var(--blue));
    }
    .tax-pack-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, var(--pink), var(--blue));
      color: #fff; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 0 8px 20px rgba(255,73,152,0.25);
    }
    .tax-pack-icon svg { width: 26px; height: 26px; }
    .tax-pack-text { flex: 1; min-width: 280px; }
    .tax-pack-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 800;
      color: var(--pink); letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 8px;
    }
    .tax-pack-eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--pink); }
    .tax-pack h3 {
      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
      margin-bottom: 6px; color: var(--text);
    }
    .tax-pack-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
    .tax-pack-actions { display: flex; gap: 10px; align-items: center; }
    .tax-pack-actions .btn-pink svg { width: 14px; height: 14px; }

    /* ===== Section heads ===== */
    .section-head {
      margin: 28px 28px 14px;
      display: flex; align-items: baseline; justify-content: space-between;
      gap: 12px;
    }
    .section-head h2 {
      font-size: 11px; font-weight: 800;
      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em;
    }
    .section-head .section-meta {
      font-size: 12px; color: var(--text-faint);
    }

    /* ===== Reports grid ===== */
    .reports-grid {
      margin: 0 28px;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    @media (max-width: 1280px) { .reports-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 860px) { .reports-grid { grid-template-columns: 1fr; } }

    .report-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px;
      display: flex; flex-direction: column; gap: 14px;
      cursor: pointer; transition: all 0.15s ease;
      position: relative; overflow: hidden;
    }
    .report-card:hover {
      border-color: var(--blue);
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .report-card.selected {
      border-color: var(--pink);
      box-shadow: 0 0 0 3px rgba(255,73,152,0.15);
    }
    .report-card-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px;
    }
    .report-chip {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .report-chip svg { width: 18px; height: 18px; }
    .report-chip.blue { background: var(--blue-pale); color: var(--blue); }
    .report-chip.green { background: var(--green-bg); color: var(--green-dark); }
    .report-chip.pink { background: var(--pink-bg); color: var(--pink); }
    .report-chip.gold { background: var(--gold-bg); color: var(--gold-dark); }
    .report-chip.orange { background: var(--orange-bg); color: var(--orange); }

    .report-tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 100px;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .report-tag.alert { background: var(--orange-bg); color: var(--orange); }
    .report-tag.info { background: var(--blue-pale); color: var(--blue); }
    .report-tag svg { width: 10px; height: 10px; }

    .report-card-body { flex: 1; }
    .report-title {
      font-size: 15px; font-weight: 600; color: var(--text);
      letter-spacing: -0.01em; margin-bottom: 4px;
    }
    .report-desc {
      font-size: 12.5px; color: var(--text-muted); line-height: 1.5;
    }
    .report-card-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 14px; border-top: 1px solid var(--border);
      gap: 10px;
    }
    .report-time {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .report-time svg { width: 11px; height: 11px; }
    .report-gen-btn {
      padding: 6px 12px; border-radius: 100px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 12px; font-weight: 600; color: var(--text);
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .report-gen-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }
    .report-gen-btn svg { width: 12px; height: 12px; }

    /* ===== Recent reports table ===== */
    .recent-wrap {
      margin: 10px 28px 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .recent-head {
      padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--border);
    }
    .recent-head h3 { font-size: 14px; font-weight: 700; }
    .recent-head-actions { display: flex; gap: 8px; }
    .recent-table { width: 100%; border-collapse: collapse; }
    .recent-table thead th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em;
      padding: 12px 20px; background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
    }
    .recent-table tbody td {
      padding: 14px 20px; font-size: 13px; color: var(--text);
      border-bottom: 1px solid var(--border); vertical-align: middle;
    }
    .recent-table tbody tr:last-child td { border-bottom: none; }
    .recent-table tbody tr { transition: background 0.15s ease; }
    .recent-table tbody tr:hover { background: var(--surface-subtle); }
    .recent-name {
      display: flex; align-items: center; gap: 10px;
      font-weight: 600;
    }
    .recent-name-chip {
      width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .recent-name-chip svg { width: 13px; height: 13px; }
    .recent-by { display: flex; align-items: center; gap: 8px; color: var(--text-muted); }
    .recent-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      color: #fff; font-size: 10px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .recent-format {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 6px;
      font-size: 10px; font-weight: 700;
      background: var(--surface-alt); color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .recent-format.pdf { background: var(--pink-bg); color: var(--pink); }
    .recent-format.csv { background: var(--green-bg); color: var(--green-dark); }
    .recent-format.xlsx { background: var(--blue-pale); color: var(--blue); }
    .recent-format.zip { background: var(--gold-bg); color: var(--gold-dark); }
    .recent-actions { display: flex; gap: 4px; justify-content: flex-end; }
    .recent-action {
      padding: 5px 10px; border-radius: 6px;
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 4px;
      transition: all 0.15s ease;
    }
    .recent-action:hover { background: var(--blue-pale); color: var(--blue); }
    .recent-action svg { width: 12px; height: 12px; }

    /* ===== DRAWER ===== */
    .drawer-backdrop {
      position: absolute; inset: 0;
      background: rgba(26,31,54,0.3);
      opacity: 1; transition: opacity 0.2s ease;
      z-index: 40;
      display: none;
    }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: 560px; background: var(--surface);
      box-shadow: var(--shadow-xl);
      display: none; flex-direction: column;
      z-index: 41;
      border-left: 1px solid var(--border);
    }
    .drawer-head {
      padding: 18px 22px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px;
    }
    .drawer-head-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
    .drawer-head-chip {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .drawer-head-chip svg { width: 22px; height: 22px; }
    .drawer-head-info h2 {
      font-size: 18px; font-weight: 800; color: var(--text);
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

    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 22px; }
    .drawer-section { margin-bottom: 22px; }
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;
    }

    /* Quick configure */
    .cfg-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 10px; margin-bottom: 10px;
    }
    .cfg-field label {
      display: block; font-size: 11px; font-weight: 600;
      color: var(--text-muted); margin-bottom: 5px;
    }
    .cfg-input, .cfg-select {
      width: 100%; padding: 9px 12px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; font-size: 13px; color: var(--text);
      transition: all 0.15s ease;
    }
    .cfg-input:focus, .cfg-select:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.1); }
    .cfg-select { appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
      padding-right: 32px;
    }

    .prop-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .prop-chip {
      padding: 6px 11px; border-radius: 100px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .prop-chip:hover { border-color: var(--blue); color: var(--blue); }
    .prop-chip.on { border-color: var(--blue); background: var(--blue-pale); color: var(--blue); }
    .prop-chip svg { width: 10px; height: 10px; }

    /* Preview area */
    .preview-wrap {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px;
    }
    .preview-doc-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding-bottom: 12px; border-bottom: 2px solid var(--border);
      margin-bottom: 12px;
    }
    .preview-doc-title {
      font-size: 14px; font-weight: 800; letter-spacing: -0.01em;
      color: var(--text);
    }
    .preview-doc-sub {
      font-size: 11px; color: var(--text-muted); margin-top: 2px;
    }
    .preview-doc-brand {
      font-size: 10px; font-weight: 700; color: var(--blue);
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .preview-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    .preview-table thead th {
      text-align: left; font-size: 9.5px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em;
      padding: 6px 4px; border-bottom: 1px solid var(--border);
    }
    .preview-table thead th.num { text-align: right; }
    .preview-table tbody td {
      padding: 6px 4px; border-bottom: 1px solid var(--border);
      font-variant-numeric: tabular-nums;
    }
    .preview-table tbody td.num { text-align: right; }
    .preview-table tbody td.emph { font-weight: 600; }
    .preview-table tfoot td {
      padding: 8px 4px; font-weight: 800;
      border-top: 2px solid var(--text); font-size: 12px;
    }
    .preview-table tfoot td.num { text-align: right; }
    .preview-total-row td { background: var(--blue-pale); color: var(--blue); }

    .preview-kv {
      display: grid; grid-template-columns: 1fr auto;
      padding: 6px 0; font-size: 12px;
      border-bottom: 1px dotted var(--border);
    }
    .preview-kv:last-child { border-bottom: none; }
    .preview-kv span:first-child { color: var(--text-muted); }
    .preview-kv span:last-child { font-weight: 600; font-variant-numeric: tabular-nums; }
    .preview-kv.total {
      padding: 10px 0 4px;
      border-top: 2px solid var(--text); margin-top: 6px;
      border-bottom: none; font-size: 14px;
    }
    .preview-kv.total span:first-child { color: var(--text); font-weight: 700; }
    .preview-kv.total span:last-child { color: var(--green-dark); font-weight: 800; }
    .preview-kv.neg span:last-child { color: var(--red); }

    .preview-chart {
      height: 120px; margin: 12px 0;
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
      padding: 12px;
    }

    .preview-badges { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .preview-badge {
      padding: 4px 10px; border-radius: 100px;
      font-size: 10px; font-weight: 700;
      background: var(--green-bg); color: var(--green-dark);
      display: inline-flex; align-items: center; gap: 4px;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .preview-badge svg { width: 10px; height: 10px; }
    .preview-badge.info { background: var(--blue-pale); color: var(--blue); }
    .preview-badge.warn { background: var(--orange-bg); color: var(--orange); }

    .preview-footer-note {
      margin-top: 12px; padding-top: 10px;
      border-top: 1px dashed var(--border);
      font-size: 10.5px; color: var(--text-faint);
      display: flex; justify-content: space-between;
    }

    /* Drawer footer */
    .drawer-foot {
      border-top: 1px solid var(--border); padding: 14px 22px;
      display: flex; gap: 8px; background: var(--surface-alt);
    }
    .drawer-foot .btn { flex: 1; justify-content: center; }

    /* ===== Bulk action bar ===== */
    .bulk-bar {
      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--navy-dark); color: #fff;
      border-radius: 100px; padding: 10px 16px;
      display: none; align-items: center; gap: 14px;
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
    .bulk-tip {
      color: rgba(255,255,255,0.55); font-size: 11px;
      margin-left: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.12);
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .drawer { width: 480px; }
      .stats-strip { grid-template-columns: repeat(3, 1fr); }
      .stats-strip .stat-item:nth-child(3n) { border-right: none; padding-right: 0; }
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
          <a class="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5"/></svg>Maintenance
            <span class="sb-nav-count">5</span>
          </a>
          <a class="sb-nav-item active" href="reports.html">
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
          <strong>Reports</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search reports, exports...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <div class="scroll">

        <!-- Page head -->
        <div class="page-head-bar">
          <div>
            <h1>Reports</h1>
            <p>Banker-ready financials, tax exports, investor packets — generated in seconds</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost" id="btn-schedule">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Schedule report
            </button>
            <button class="btn btn-ghost" id="btn-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              Custom report
            </button>
            <button class="btn btn-primary" id="btn-generate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Generate now
            </button>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="stats-strip">
          <div class="stat-item">
            <div class="stat-label">Reports this month</div>
            <div class="stat-value">12 <span class="stat-delta up">+4</span></div>
            <div class="stat-sub">vs. 8 last month</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">YTD income</div>
            <div class="stat-value">$298,400 <span class="stat-delta up">+14%</span></div>
            <div class="stat-sub">Jan 1 — Apr 13</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">YTD expenses</div>
            <div class="stat-value">$156,020</div>
            <div class="stat-sub">Op + CapEx + Debt</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Net operating income</div>
            <div class="stat-value">$142,380 <span class="stat-delta up">47.6% margin</span></div>
            <div class="stat-sub">Above target 42%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Schedule E ready</div>
            <div class="stat-value">
              <span class="stat-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Yes
              </span>
            </div>
            <div class="stat-sub">Last sync 2 min ago</div>
          </div>
        </div>

        <!-- Date range bar -->
        <div class="range-bar">
          <button class="range-chip accent" id="chip-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span id="chip-date-label">April 2026</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button class="range-chip" id="chip-props">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
            <span id="chip-props-label">All properties</span>
            <span class="chip-sep">· 4</span>
          </button>
          <button class="range-chip" id="chip-basis">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span id="chip-basis-label">Cash basis</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </button>
          <button class="range-reset" id="btn-reset">Reset filters</button>
        </div>

        <!-- Tax Pack callout -->
        <div class="tax-pack">
          <div class="tax-pack-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6M9 9h2"/></svg>
          </div>
          <div class="tax-pack-text">
            <div class="tax-pack-eyebrow">Tax Season · 2025 Return</div>
            <h3>Your 2025 tax package is ready.</h3>
            <div class="tax-pack-sub">Schedule E for all 4 properties · 1099-NEC for all vendors · Mortgage interest summary · Depreciation schedule</div>
          </div>
          <div class="tax-pack-actions">
            <button class="btn btn-ghost" id="btn-taxzip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download as ZIP
            </button>
            <button class="btn btn-pink" id="btn-taxpack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
              Generate full tax pack
            </button>
          </div>
        </div>

        <!-- FINANCIAL -->
        <div class="section-head">
          <h2>Financial</h2>
          <span class="section-meta">4 reports · updated live from ledger</span>
        </div>
        <div class="reports-grid" id="grid-financial">

          <div class="report-card" data-report="pl">
            <div class="report-card-head">
              <div class="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">P&amp;L by Property</div>
              <div class="report-desc">Income, expenses, NOI per address</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 2d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="cashflow">
            <div class="report-card-head">
              <div class="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h10"/><path d="M17 15l4 3-4 3"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Cash Flow Statement</div>
              <div class="report-desc">Operating, investing, financing</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 5d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="ar">
            <div class="report-card-head">
              <div class="report-chip orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
              </div>
              <span class="report-tag alert">$1,725 due</span>
            </div>
            <div class="report-card-body">
              <div class="report-title">A/R Aging Report</div>
              <div class="report-desc">30/60/90+ day buckets</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 1d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="rentroll">
            <div class="report-card-head">
              <div class="report-chip blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Rent Roll PDF</div>
              <div class="report-desc">Banker-formatted, all units, all leases</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 3d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        <!-- TAX & COMPLIANCE -->
        <div class="section-head">
          <h2>Tax &amp; Compliance</h2>
          <span class="section-meta">Schedule E synced 2 min ago</span>
        </div>
        <div class="reports-grid">

          <div class="report-card" data-report="schedulee">
            <div class="report-card-head">
              <div class="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Schedule E Export</div>
              <div class="report-desc">Form 1040 Schedule E ready, per property</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 2m ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="1099">
            <div class="report-card-head">
              <div class="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">1099 Vendor Report</div>
              <div class="report-desc">Auto-flagged contractors, total payments</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 4d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="mortgage">
            <div class="report-card-head">
              <div class="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M12 13v4M10 15h4"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Mortgage Interest Summary</div>
              <div class="report-desc">Form 1098 prep</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 12d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="yearend">
            <div class="report-card-head">
              <div class="report-chip green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7 9 18l-5-5"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              </div>
              <span class="report-tag info">12mo YTD</span>
            </div>
            <div class="report-card-body">
              <div class="report-title">Year-End Tax Package</div>
              <div class="report-desc">Bundle: Schedule E + 1099 + Mortgage + Depreciation</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Never run
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        <!-- OPERATIONAL -->
        <div class="section-head">
          <h2>Operational</h2>
          <span class="section-meta">Portfolio-wide operations insight</span>
        </div>
        <div class="reports-grid">

          <div class="report-card" data-report="maint">
            <div class="report-card-head">
              <div class="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Maintenance Cost Report</div>
              <div class="report-desc">Per property, per vendor, per category</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 6d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="vacancy">
            <div class="report-card-head">
              <div class="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Vacancy Report</div>
              <div class="report-desc">Days vacant per unit, lost income</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 9d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="turnover">
            <div class="report-card-head">
              <div class="report-chip pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Tenant Turnover Report</div>
              <div class="report-desc">Move-ins, move-outs, retention rate</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 14d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        <!-- INVESTOR -->
        <div class="section-head">
          <h2>Investor</h2>
          <span class="section-meta">Portfolio performance &amp; capital markets</span>
        </div>
        <div class="reports-grid">

          <div class="report-card" data-report="lender">
            <div class="report-card-head">
              <div class="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h6M9 16h6"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Lender Packet</div>
              <div class="report-desc">DSCR, LTV, NOI, cash-on-cash for refinance</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 22d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="investor">
            <div class="report-card-head">
              <div class="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Investor Update</div>
              <div class="report-desc">Quarterly performance brief</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run Q4 2025
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="compare">
            <div class="report-card-head">
              <div class="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">Period Comparison</div>
              <div class="report-desc">Compare any 2 time ranges side-by-side</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 30d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

          <div class="report-card" data-report="forecast">
            <div class="report-card-head">
              <div class="report-chip gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
              </div>
            </div>
            <div class="report-card-body">
              <div class="report-title">90-Day Forecast</div>
              <div class="report-desc">Projected income, vacancies, expenses</div>
            </div>
            <div class="report-card-foot">
              <span class="report-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Last run 7d ago
              </span>
              <button class="report-gen-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Generate
              </button>
            </div>
          </div>

        </div>

        <!-- Recent reports -->
        <div class="section-head">
          <h2>Recent reports</h2>
          <span class="section-meta">Last 30 days · 8 generated</span>
        </div>
        <div class="recent-wrap">
          <table class="recent-table">
            <thead>
              <tr>
                <th style="width: 40%;">Report</th>
                <th>Generated</th>
                <th>By</th>
                <th>Format</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="recent-tbody">
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip blue" style="background: var(--blue-pale); color: var(--blue);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
                    </div>
                    March P&amp;L by Property
                  </div>
                </td>
                <td>Apr 1, 2026 · 8:12 am</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format pdf">PDF</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--green-bg); color: var(--green-dark);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                    Schedule E Export — 2025
                  </div>
                </td>
                <td>Apr 1, 2026 · 7:50 am</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format xlsx">XLSX</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--blue-pale); color: var(--blue);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>
                    </div>
                    Rent Roll — All Properties
                  </div>
                </td>
                <td>Mar 29, 2026 · 2:40 pm</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format pdf">PDF</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--gold-bg); color: var(--gold-dark);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13"/></svg>
                    </div>
                    Lender Packet — 142 Birch Refi
                  </div>
                </td>
                <td>Mar 22, 2026 · 11:15 am</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format zip">ZIP</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--orange-bg); color: var(--orange);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                    </div>
                    A/R Aging — March 30
                  </div>
                </td>
                <td>Mar 20, 2026 · 9:01 am</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format csv">CSV</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--green-bg); color: var(--green-dark);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    1099-NEC Vendor Report — 2025
                  </div>
                </td>
                <td>Mar 15, 2026 · 4:22 pm</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format pdf">PDF</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--pink-bg); color: var(--pink);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/></svg>
                    </div>
                    Maintenance Cost — Q1 2026
                  </div>
                </td>
                <td>Mar 10, 2026 · 11:48 am</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format xlsx">XLSX</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="recent-name">
                    <div class="recent-name-chip" style="background: var(--gold-bg); color: var(--gold-dark);">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    Investor Update — Q1 2026
                  </div>
                </td>
                <td>Mar 4, 2026 · 3:15 pm</td>
                <td><div class="recent-by"><div class="recent-avatar">HC</div>Harrison Cooper</div></td>
                <td><span class="recent-format pdf">PDF</span></td>
                <td>
                  <div class="recent-actions">
                    <button class="recent-action" data-act="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download</button>
                    <button class="recent-action" data-act="Resend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Resend</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div><!-- /scroll -->

      <!-- DRAWER -->
      <div class="drawer-backdrop"></div>
      <aside class="drawer">
        <div class="drawer-head">
          <div class="drawer-head-left">
            <div class="drawer-head-chip report-chip blue" id="drawer-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
            </div>
            <div class="drawer-head-info">
              <h2 id="drawer-title">Report</h2>
              <p id="drawer-sub">—</p>
            </div>
          </div>
          <button class="drawer-close" id="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="drawer-body" id="drawer-body">
          <!-- injected -->
        </div>

        <div class="drawer-foot">
          <button class="btn btn-ghost" id="drw-schedule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Schedule recurring
          </button>
          <button class="btn btn-dark" id="drw-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email to
          </button>
          <button class="btn btn-primary" id="drw-generate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Generate now
          </button>
        </div>
      </aside>

      <!-- Bulk bar -->
      <div class="bulk-bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="bulk-count">0</span>
          <span>reports selected</span>
        </div>
        <div class="bulk-bar-actions">
          <button class="bulk-btn" data-bulk="Generate all selected">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Generate all selected
          </button>
          <button class="bulk-btn" data-bulk="Download as ZIP">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download as ZIP
          </button>
          <button class="bulk-btn primary" data-bulk="Email pack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email pack
          </button>
        </div>
        <span class="bulk-tip">Cmd-click to select</span>
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
