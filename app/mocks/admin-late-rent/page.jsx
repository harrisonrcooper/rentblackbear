"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-late-rent.html.
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
    input, textarea, select { font-family: inherit; font-size: inherit; }

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
    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }
    .topbar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; flex-shrink: 0;
    }
    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb a { color: var(--text-muted); transition: color 0.15s ease; }
    .topbar-breadcrumb a:hover { color: var(--blue); }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-right { display: flex; align-items: center; gap: 10px; }
    .topbar-search { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 100px; min-width: 280px; color: var(--text-faint); transition: all 0.15s ease; }
    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }
    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }

    /* Content */
    .content { flex: 1; overflow-y: auto; padding: 32px 32px 60px; }

    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 28px; flex-wrap: wrap;
    }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin-bottom: 6px; }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
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
    .btn-danger { background: var(--red); color: #fff; }
    .btn-danger:hover { background: #b83838; transform: translateY(-1px); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== KPI cards row ===== */
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; transition: all 0.15s ease; }
    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }
    .kpi-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .kpi-card-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .kpi-card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .kpi-card-icon svg { width: 16px; height: 16px; }
    .kpi-card-icon.red { background: var(--red-bg); color: var(--red); }
    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }
    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }
    .kpi-card-value { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; }
    .kpi-card-meta { font-size: 12px; color: var(--text-muted); margin-top: 6px; }

    /* ===== Automation status card (featured) ===== */
    .auto-card {
      background: linear-gradient(135deg, #fff 0%, #fbfcff 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .auto-card::before {
      content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--green), var(--blue-bright));
    }
    .auto-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .auto-title { display: flex; align-items: center; gap: 12px; }
    .auto-title-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
    }
    .auto-title-icon svg { width: 20px; height: 20px; }
    .auto-title h2 { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; display: flex; align-items: center; gap: 10px; }
    .auto-title p { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .auto-controls { display: flex; align-items: center; gap: 14px; }
    .auto-link { font-size: 13px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }
    .auto-link:hover { color: var(--navy); }
    .auto-link svg { width: 14px; height: 14px; }

    /* Toggle switch */
    .toggle-wrap { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--text); }
    .toggle {
      position: relative; width: 40px; height: 22px;
      background: var(--green); border-radius: 100px;
      transition: background 0.2s ease; cursor: pointer;
    }
    .toggle::after {
      content: ""; position: absolute; top: 2px; left: 20px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff; transition: left 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle.off { background: var(--border-strong); }
    .toggle.off::after { left: 2px; }

    /* Cadence timeline */
    .cadence { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 6px; }
    .cadence-step {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 12px;
      position: relative;
    }
    .cadence-step-day {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .cadence-step-title { font-size: 13px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.01em; }
    .cadence-step-desc { font-size: 11px; color: var(--text-muted); margin-top: 3px; line-height: 1.4; }
    .cadence-step-icon {
      width: 24px; height: 24px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 8px;
    }
    .cadence-step-icon svg { width: 12px; height: 12px; }
    .cadence-step-icon.grace { background: var(--blue-pale); color: var(--blue); }
    .cadence-step-icon.reminder { background: var(--blue-pale); color: var(--blue); }
    .cadence-step-icon.fee { background: var(--orange-bg); color: var(--orange); }
    .cadence-step-icon.second { background: var(--orange-bg); color: var(--orange); }
    .cadence-step-icon.notice { background: var(--red-bg); color: var(--red); }
    .cadence-step-icon.filing { background: var(--red-bg); color: var(--red); }

    /* Card */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; }
    .card-head { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .card-head h3 { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
    .card-head p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .card-head-actions { display: flex; gap: 8px; align-items: center; }
    .card-head-link { font-size: 13px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }
    .card-head-link:hover { color: var(--navy); }
    .card-head-link svg { width: 14px; height: 14px; }

    /* Table */
    .tbl { width: 100%; }
    .tbl-row {
      display: grid;
      grid-template-columns: 2fr 1fr 0.9fr 1.5fr 1.6fr 1fr 1fr;
      gap: 14px; padding: 14px 22px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      transition: background 0.15s ease;
    }
    .tbl-row:last-child { border-bottom: none; }
    .tbl-row-head {
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .tbl-row-body { cursor: pointer; }
    .tbl-row-body:hover { background: var(--surface-subtle); }
    .tbl-row-body.open { background: var(--surface-subtle); }
    .tbl-tenant { display: flex; align-items: center; gap: 10px; }
    .tbl-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--red-bg); color: var(--red); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .tbl-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .tbl-tenant-name { font-weight: 600; color: var(--text); }
    .tbl-tenant-meta { font-size: 12px; color: var(--text-faint); }
    .tbl-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .tbl-days { font-weight: 700; color: var(--red); font-variant-numeric: tabular-nums; }
    .tbl-days.warn { color: var(--orange); }
    .tbl-contact { font-size: 12px; color: var(--text-muted); }
    .tbl-contact strong { color: var(--text); font-weight: 600; display: block; }
    .tbl-contact-channel { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-faint); margin-top: 2px; }
    .tbl-contact-channel svg { width: 11px; height: 11px; }
    .tbl-next { font-size: 12px; color: var(--text-muted); }
    .tbl-next strong { color: var(--text); font-weight: 600; display: block; }
    .tbl-action { display: flex; justify-content: flex-end; gap: 6px; align-items: center; }
    .chevron { width: 18px; height: 18px; color: var(--text-faint); transition: transform 0.2s ease; }
    .tbl-row-body.open .chevron { transform: rotate(180deg); }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 3px 9px;
      border-radius: 100px; white-space: nowrap;
    }
    .pill::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.8; }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill.nodot::before { display: none; }

    .icon-btn { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.15s ease; }
    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }
    .icon-btn svg { width: 14px; height: 14px; }

    /* Expanded panel */
    .tbl-detail {
      display: none;
      padding: 0 22px 22px;
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
    }
    .tbl-detail.open { display: block; }
    .detail-inner {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 18px; padding-top: 4px;
    }
    .detail-panel {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px;
    }
    .detail-label {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 12px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .detail-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0; border-bottom: 1px dashed var(--border);
      font-size: 13px;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-row-date { color: var(--text-muted); font-size: 12px; }
    .detail-row-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .detail-row-amt.paid { color: var(--green-dark); }
    .detail-row-amt.due { color: var(--red); }

    .thread { display: flex; flex-direction: column; gap: 10px; }
    .thread-item {
      display: flex; gap: 10px; padding: 10px;
      border-radius: var(--radius-sm);
      background: var(--surface-alt);
      border-left: 3px solid var(--border-strong);
    }
    .thread-item.sent { border-left-color: var(--blue); }
    .thread-item.system { border-left-color: var(--green); }
    .thread-item.call { border-left-color: var(--orange); }
    .thread-icon {
      width: 26px; height: 26px; border-radius: 6px;
      background: var(--surface); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .thread-icon svg { width: 13px; height: 13px; }
    .thread-body { flex: 1; min-width: 0; font-size: 12px; }
    .thread-body strong { color: var(--text); font-weight: 600; display: block; font-size: 12px; }
    .thread-body p { color: var(--text-muted); line-height: 1.45; margin-top: 2px; }
    .thread-time { font-size: 10px; color: var(--text-faint); margin-top: 4px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }

    .notes-list { display: flex; flex-direction: column; gap: 8px; max-height: 170px; overflow-y: auto; margin-bottom: 10px; }
    .note-item {
      padding: 10px 12px;
      background: #fffdf6;
      border: 1px solid #f6e9b8;
      border-radius: var(--radius-sm);
      font-size: 12px; color: var(--text);
    }
    .note-item-meta { font-size: 10px; color: var(--text-faint); margin-top: 4px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }
    .note-input {
      display: flex; gap: 6px; margin-top: 8px;
    }
    .note-input input {
      flex: 1; padding: 8px 12px;
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      background: var(--surface); color: var(--text);
      outline: none; transition: border-color 0.15s ease;
    }
    .note-input input:focus { border-color: var(--blue); }
    .note-input button {
      padding: 8px 14px; border-radius: var(--radius-sm);
      background: var(--blue); color: #fff;
      font-size: 12px; font-weight: 600;
    }
    .note-input button:hover { background: var(--navy); }

    .quick-actions {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 8px; margin-top: 14px;
    }
    .quick-actions .btn { padding: 9px 12px; font-size: 12px; justify-content: center; }

    /* Eviction section */
    .eviction-card {
      background: linear-gradient(135deg, #fff8f6 0%, #fff 80%);
      border: 1px solid #f3cfc9;
      border-radius: var(--radius-lg);
      padding: 22px;
      margin-bottom: 24px;
    }
    .eviction-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr auto;
      gap: 14px; align-items: center;
      padding: 16px; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius);
      margin-top: 14px;
    }
    .eviction-prop { display: flex; align-items: center; gap: 12px; }
    .eviction-prop-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--red-bg); color: var(--red);
      display: flex; align-items: center; justify-content: center;
    }
    .eviction-prop-icon svg { width: 17px; height: 17px; }
    .eviction-prop-name { font-weight: 600; color: var(--text); font-size: 13px; }
    .eviction-prop-addr { font-size: 11px; color: var(--text-faint); }
    .eviction-field-label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
    .eviction-field-val { font-size: 13px; color: var(--text); font-weight: 600; }
    .eviction-partner-link {
      margin-top: 14px;
      padding: 12px 14px;
      background: var(--surface); border: 1px dashed var(--border-strong);
      border-radius: var(--radius);
      display: flex; align-items: center; justify-content: space-between;
      font-size: 13px;
    }
    .eviction-partner-link strong { color: var(--text); font-weight: 600; }
    .eviction-partner-link p { color: var(--text-muted); font-size: 12px; margin-top: 2px; }

    /* Templates section */
    .tpl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 18px 22px 22px; }
    .tpl-card {
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .tpl-card:hover { border-color: var(--blue); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
    .tpl-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .tpl-icon {
      width: 30px; height: 30px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
    }
    .tpl-icon svg { width: 14px; height: 14px; }
    .tpl-icon.blue { background: var(--blue-pale); color: var(--blue); }
    .tpl-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .tpl-icon.pink { background: var(--pink-bg); color: var(--pink); }
    .tpl-icon.red { background: var(--red-bg); color: var(--red); }
    .tpl-name { font-size: 13px; font-weight: 700; color: var(--text); }
    .tpl-meta { font-size: 11px; color: var(--text-faint); margin-top: 1px; }
    .tpl-preview {
      font-size: 12px; color: var(--text-muted); line-height: 1.5;
      padding: 10px 12px; background: var(--surface-alt); border-radius: var(--radius-sm);
      border-left: 3px solid var(--border-strong);
      font-style: italic;
    }
    .tpl-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .tpl-edit { font-size: 12px; font-weight: 600; color: var(--blue); display: inline-flex; align-items: center; gap: 4px; }
    .tpl-edit svg { width: 12px; height: 12px; }

    /* Honesty callout */
    .callout {
      background: linear-gradient(135deg, #fef9f2 0%, #fff 100%);
      border: 1px solid #f0dcbf;
      border-radius: var(--radius-lg);
      padding: 18px 22px;
      margin-bottom: 24px;
      display: flex; align-items: flex-start; gap: 14px;
    }
    .callout-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: #fff; border: 1px solid #f0dcbf;
      color: var(--gold);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .callout-icon svg { width: 18px; height: 18px; }
    .callout-body h4 { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
    .callout-body p { font-size: 13px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(20, 32, 74, 0.55);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: center; justify-content: center;
      padding: 20px;
    }
    .modal-backdrop.open { display: flex; }
    .modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      width: 100%; max-width: 520px;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: modalIn 0.18s ease;
    }
    .modal.wide { max-width: 640px; }
    @keyframes modalIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .modal-head { padding: 20px 22px 0; }
    .modal-head h3 { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .modal-head p { font-size: 13px; color: var(--text-muted); margin-top: 4px; line-height: 1.5; }
    .modal-body { padding: 18px 22px; }
    .modal-foot {
      padding: 14px 22px; border-top: 1px solid var(--border);
      display: flex; justify-content: flex-end; gap: 10px;
      background: var(--surface-subtle);
    }
    .field { margin-bottom: 14px; }
    .field:last-child { margin-bottom: 0; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
    .field input, .field select, .field textarea {
      width: 100%; padding: 10px 12px;
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      background: var(--surface); color: var(--text);
      outline: none; transition: border-color 0.15s ease;
    }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--blue); }
    .field textarea { resize: vertical; min-height: 120px; font-family: inherit; line-height: 1.5; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .warn-box {
      padding: 12px 14px;
      background: #fff8f5; border: 1px solid #f3cfc9;
      border-radius: var(--radius-sm);
      font-size: 13px; color: #8a3636;
      display: flex; gap: 10px;
    }
    .warn-box svg { flex-shrink: 0; width: 16px; height: 16px; color: var(--red); margin-top: 1px; }

    /* Toast */
    .toast-wrap {
      position: fixed; bottom: 24px; right: 24px;
      z-index: 200; display: flex; flex-direction: column; gap: 10px;
      pointer-events: none;
    }
    .toast {
      background: var(--text); color: #fff;
      padding: 12px 16px; border-radius: var(--radius);
      font-size: 13px; font-weight: 500;
      box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 10px;
      min-width: 260px; max-width: 380px;
      animation: toastIn 0.2s ease;
      pointer-events: auto;
    }
    .toast svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; }
    @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1200px) {
      .cadence { grid-template-columns: repeat(3, 1fr); }
      .detail-inner { grid-template-columns: 1fr; }
      .tbl-row { grid-template-columns: 2fr 1fr 1fr; }
      .tbl-row > *:nth-child(n+4):not(.tbl-action) { display: none; }
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
          <a class="sb-nav-item active" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Payments
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
          <a href="payments.html">Payments</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Late rent</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, notices, filings...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <div class="content">

        <!-- Page head -->
        <div class="page-head">
          <div>
            <h1>Late rent</h1>
            <p>2 tenants late this month. Automated reminders run by default — jump in only when you need to.</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost" onclick="showToast('Delinquency report exported')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
              Export report
            </button>
            <button class="btn btn-primary" onclick="openModal('modal-message-all')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Message all late
            </button>
          </div>
        </div>

        <!-- Honesty callout -->
        <div class="callout">
          <div class="callout-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="callout-body">
            <h4>Late rent sucks.</h4>
            <p>Our job is to make this as automatic and dignified as possible — for both of you. Everything below runs on a steady cadence unless you step in.</p>
          </div>
        </div>

        <!-- KPI row -->
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Currently late</div>
              <div class="kpi-card-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">2</div>
            <div class="kpi-card-meta">of 12 tenants · 17% of portfolio</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Total owed</div>
              <div class="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">$1,500</div>
            <div class="kpi-card-meta">rent + $75 in late fees</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Oldest delinquency</div>
              <div class="kpi-card-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">4 days</div>
            <div class="kpi-card-meta">Marcus Lee · 908 Lee Dr</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">On autopay</div>
              <div class="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">10<span style="font-size:18px; color:var(--text-faint); font-weight:700;"> / 12</span></div>
            <div class="kpi-card-meta">83% adoption · prevents most lates</div>
          </div>
        </div>

        <!-- Automation card -->
        <div class="auto-card">
          <div class="auto-head">
            <div class="auto-title">
              <div class="auto-title-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>
              </div>
              <div>
                <h2>Auto-reminders enabled <span class="pill pill-green nodot" style="font-size:10px; padding:2px 8px;">LIVE</span></h2>
                <p>Tenantory handles the chase. You only get pinged when something needs a human decision.</p>
              </div>
            </div>
            <div class="auto-controls">
              <a class="auto-link" href="#" onclick="event.preventDefault(); showToast('Opening cadence editor')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                Edit cadence
              </a>
              <label class="toggle-wrap">
                <span id="toggleLabel">Automation on</span>
                <span class="toggle" id="autoToggle" onclick="confirmToggle()"></span>
              </label>
            </div>
          </div>
          <div class="cadence">
            <div class="cadence-step">
              <div class="cadence-step-icon grace"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
              <div class="cadence-step-day">Day 1</div>
              <div class="cadence-step-title">Grace</div>
              <div class="cadence-step-desc">Silent 24h window. No action yet.</div>
            </div>
            <div class="cadence-step">
              <div class="cadence-step-icon reminder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div>
              <div class="cadence-step-day">Day 5</div>
              <div class="cadence-step-title">Email nudge</div>
              <div class="cadence-step-desc">Friendly reminder with autopay link.</div>
            </div>
            <div class="cadence-step">
              <div class="cadence-step-icon fee"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div class="cadence-step-day">Day 6</div>
              <div class="cadence-step-title">Late fee + SMS</div>
              <div class="cadence-step-desc">$50 fee applied, SMS notification.</div>
            </div>
            <div class="cadence-step">
              <div class="cadence-step-icon second"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h4.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div class="cadence-step-day">Day 10</div>
              <div class="cadence-step-title">2nd reminder + call task</div>
              <div class="cadence-step-desc">Task lands in your inbox.</div>
            </div>
            <div class="cadence-step">
              <div class="cadence-step-icon notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/></svg></div>
              <div class="cadence-step-day">Day 15</div>
              <div class="cadence-step-title">Certified notice</div>
              <div class="cadence-step-desc">Legal notice auto-drafted for send.</div>
            </div>
            <div class="cadence-step">
              <div class="cadence-step-icon filing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg></div>
              <div class="cadence-step-day">Day 30</div>
              <div class="cadence-step-title">Eviction option</div>
              <div class="cadence-step-desc">Filing workflow unlocked — you approve.</div>
            </div>
          </div>
        </div>

        <!-- Late tenants table -->
        <div class="card">
          <div class="card-head">
            <div>
              <h3>Late tenants</h3>
              <p>Click a row to see payment history, message thread, and notes.</p>
            </div>
            <div class="card-head-actions">
              <button class="btn btn-ghost btn-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                Filter
              </button>
            </div>
          </div>

          <div class="tbl">
            <div class="tbl-row tbl-row-head">
              <div>Tenant + property</div>
              <div>Amount owed</div>
              <div>Days late</div>
              <div>Last contact</div>
              <div>Automation next step</div>
              <div>Status</div>
              <div style="text-align:right;">Actions</div>
            </div>

            <!-- ROW 1: Marcus Lee -->
            <div class="tbl-row tbl-row-body" data-row="marcus" onclick="toggleDetail('marcus', event)">
              <div class="tbl-tenant">
                <div class="tbl-avatar">ML</div>
                <div>
                  <div class="tbl-tenant-name">Marcus Lee</div>
                  <div class="tbl-tenant-meta">908 Lee Dr NW · Unit A</div>
                </div>
              </div>
              <div class="tbl-amount">$950.00</div>
              <div class="tbl-days">4d</div>
              <div class="tbl-contact">
                <strong>Yesterday, 9:02am</strong>
                <span class="tbl-contact-channel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  Email · auto reminder
                </span>
              </div>
              <div class="tbl-next">
                <strong>Late fee + SMS</strong>
                Tomorrow, 8:00am
              </div>
              <div><span class="pill pill-orange">Warning</span></div>
              <div class="tbl-action" onclick="event.stopPropagation();">
                <button class="btn btn-ghost btn-sm" onclick="sendReminder('Marcus Lee')">Send reminder</button>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <div class="tbl-detail" data-detail="marcus">
              <div class="detail-inner">
                <div class="detail-panel">
                  <div class="detail-label">
                    <span>Payment history</span>
                    <a href="#" class="auto-link" style="font-size:11px;" onclick="event.preventDefault(); openModal('modal-log-payment')">Log payment</a>
                  </div>
                  <div class="detail-row">
                    <div><strong>Apr 2026 rent</strong><div class="detail-row-date">Due Apr 1 · 4 days late</div></div>
                    <div class="detail-row-amt due">$950.00</div>
                  </div>
                  <div class="detail-row">
                    <div><strong>Mar 2026 rent</strong><div class="detail-row-date">Paid Mar 3 · ACH</div></div>
                    <div class="detail-row-amt paid">$950.00</div>
                  </div>
                  <div class="detail-row">
                    <div><strong>Feb 2026 rent</strong><div class="detail-row-date">Paid Feb 1 · ACH</div></div>
                    <div class="detail-row-amt paid">$950.00</div>
                  </div>
                  <div class="detail-row">
                    <div><strong>Jan 2026 rent</strong><div class="detail-row-date">Paid Jan 6 · 5 days late · ACH</div></div>
                    <div class="detail-row-amt paid">$1,000.00</div>
                  </div>
                </div>

                <div class="detail-panel">
                  <div class="detail-label"><span>Communication thread</span></div>
                  <div class="thread">
                    <div class="thread-item sent">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div>
                      <div class="thread-body">
                        <strong>Auto reminder email sent</strong>
                        <p>"Hi Marcus — just a friendly heads up that April rent hasn't posted yet…"</p>
                        <div class="thread-time">Apr 13 · 9:02 AM</div>
                      </div>
                    </div>
                    <div class="thread-item system">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                      <div class="thread-body">
                        <strong>Grace period ended</strong>
                        <p>No payment detected · entered automation cadence.</p>
                        <div class="thread-time">Apr 2 · 12:00 AM</div>
                      </div>
                    </div>
                    <div class="thread-item">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                      <div class="thread-body">
                        <strong>Rent due</strong>
                        <p>$950.00 invoice issued.</p>
                        <div class="thread-time">Apr 1 · 12:00 AM</div>
                      </div>
                    </div>
                  </div>
                  <div class="quick-actions">
                    <button class="btn btn-primary btn-sm" onclick="sendReminder('Marcus Lee')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
                      Send reminder now
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="openModal('modal-log-payment')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      Log payment
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="applyFee('Marcus Lee')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
                      Apply late fee
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="openModal('modal-escalate')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                      Escalate to notice
                    </button>
                  </div>
                </div>

                <div class="detail-panel">
                  <div class="detail-label"><span>Private notes</span><span style="font-weight:500; color:var(--text-faint); text-transform:none; letter-spacing:0;">Only you</span></div>
                  <div class="notes-list" id="notes-marcus">
                    <div class="note-item">
                      Marcus called last month — new job started late, said he'd be on time from now on. Usually reliable.
                      <div class="note-item-meta">Mar 3, 2026 · Harrison</div>
                    </div>
                    <div class="note-item">
                      Tenant since Aug 2023. Never more than 5 days late. Don't escalate early.
                      <div class="note-item-meta">Jan 15, 2026 · Harrison</div>
                    </div>
                  </div>
                  <div class="note-input">
                    <input id="note-input-marcus" placeholder="Add a private note…" onkeypress="if(event.key==='Enter') addNote('marcus')">
                    <button onclick="addNote('marcus')">Add</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ROW 2: Dana Okafor -->
            <div class="tbl-row tbl-row-body" data-row="dana" onclick="toggleDetail('dana', event)">
              <div class="tbl-tenant">
                <div class="tbl-avatar orange">DO</div>
                <div>
                  <div class="tbl-tenant-name">Dana Okafor</div>
                  <div class="tbl-tenant-meta">3026 Turf Ave NW · Unit 2</div>
                </div>
              </div>
              <div class="tbl-amount">$550.00</div>
              <div class="tbl-days warn">2d</div>
              <div class="tbl-contact">
                <strong>Apr 12, 6:14pm</strong>
                <span class="tbl-contact-channel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  SMS · tenant replied
                </span>
              </div>
              <div class="tbl-next">
                <strong>Waiting on reply</strong>
                No action scheduled
              </div>
              <div><span class="pill pill-blue">Grace</span></div>
              <div class="tbl-action" onclick="event.stopPropagation();">
                <button class="btn btn-ghost btn-sm" onclick="sendReminder('Dana Okafor')">Send reminder</button>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <div class="tbl-detail" data-detail="dana">
              <div class="detail-inner">
                <div class="detail-panel">
                  <div class="detail-label">
                    <span>Payment history</span>
                    <a href="#" class="auto-link" style="font-size:11px;" onclick="event.preventDefault(); openModal('modal-log-payment')">Log payment</a>
                  </div>
                  <div class="detail-row">
                    <div><strong>Apr 2026 rent (partial)</strong><div class="detail-row-date">$700 received Apr 5 · $550 short</div></div>
                    <div class="detail-row-amt due">$550.00</div>
                  </div>
                  <div class="detail-row">
                    <div><strong>Mar 2026 rent</strong><div class="detail-row-date">Paid Mar 1 · Autopay</div></div>
                    <div class="detail-row-amt paid">$1,250.00</div>
                  </div>
                  <div class="detail-row">
                    <div><strong>Feb 2026 rent</strong><div class="detail-row-date">Paid Feb 1 · Autopay</div></div>
                    <div class="detail-row-amt paid">$1,250.00</div>
                  </div>
                </div>

                <div class="detail-panel">
                  <div class="detail-label"><span>Communication thread</span></div>
                  <div class="thread">
                    <div class="thread-item">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                      <div class="thread-body">
                        <strong>Tenant replied · SMS</strong>
                        <p>"Had a car repair this week — can I split the balance across the 15th and 20th?"</p>
                        <div class="thread-time">Apr 12 · 6:14 PM</div>
                      </div>
                    </div>
                    <div class="thread-item sent">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                      <div class="thread-body">
                        <strong>Auto SMS sent</strong>
                        <p>"Hi Dana — we've received $700 of April rent. $550 balance still outstanding."</p>
                        <div class="thread-time">Apr 12 · 5:00 PM</div>
                      </div>
                    </div>
                    <div class="thread-item system">
                      <div class="thread-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                      <div class="thread-body">
                        <strong>Partial payment received</strong>
                        <p>$700.00 ACH · balance $550.00.</p>
                        <div class="thread-time">Apr 5 · 2:18 PM</div>
                      </div>
                    </div>
                  </div>
                  <div class="quick-actions">
                    <button class="btn btn-primary btn-sm" onclick="sendReminder('Dana Okafor')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
                      Send reminder now
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="openModal('modal-log-payment')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      Log payment
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="applyFee('Dana Okafor')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
                      Apply late fee
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="openModal('modal-escalate')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                      Escalate to notice
                    </button>
                  </div>
                </div>

                <div class="detail-panel">
                  <div class="detail-label"><span>Private notes</span><span style="font-weight:500; color:var(--text-faint); text-transform:none; letter-spacing:0;">Only you</span></div>
                  <div class="notes-list" id="notes-dana">
                    <div class="note-item">
                      Dana asked for a split payment this month (15th and 20th). Agreed verbally — don't auto-escalate.
                      <div class="note-item-meta">Apr 12, 2026 · Harrison</div>
                    </div>
                  </div>
                  <div class="note-input">
                    <input id="note-input-dana" placeholder="Add a private note…" onkeypress="if(event.key==='Enter') addNote('dana')">
                    <button onclick="addNote('dana')">Add</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Eviction filings in progress -->
        <div class="eviction-card">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
            <div>
              <h3 style="font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.01em; display:flex; align-items:center; gap:10px;">
                Eviction filings in progress
                <span class="pill pill-red nodot" style="font-size:10px;">1 ACTIVE</span>
              </h3>
              <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Legal cases currently moving through court. Keep your attorney looped in.</p>
            </div>
            <button class="btn btn-ghost btn-sm">View archive</button>
          </div>

          <div class="eviction-row">
            <div class="eviction-prop">
              <div class="eviction-prop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
              </div>
              <div>
                <div class="eviction-prop-name">Jordan Whitt</div>
                <div class="eviction-prop-addr">1412 Church St · Unit B (vacated)</div>
              </div>
            </div>
            <div>
              <div class="eviction-field-label">Jurisdiction</div>
              <div class="eviction-field-val">Madison County, AL</div>
            </div>
            <div>
              <div class="eviction-field-label">Filing date</div>
              <div class="eviction-field-val">Mar 28, 2026</div>
            </div>
            <div>
              <div class="eviction-field-label">Next court date</div>
              <div class="eviction-field-val">Apr 22, 2026</div>
            </div>
            <div>
              <div class="eviction-field-label">Attorney</div>
              <div class="eviction-field-val">Holt &amp; Pierce LLC</div>
            </div>
            <div>
              <button class="btn btn-ghost btn-sm">Case file</button>
            </div>
          </div>

          <div class="eviction-partner-link">
            <div>
              <strong>Need an attorney in another state?</strong>
              <p>We maintain a vetted partner list across all 50 states — Alabama, Tennessee, Georgia, and more.</p>
            </div>
            <a href="#" class="btn btn-ghost btn-sm" onclick="event.preventDefault(); showToast('Opening attorney partner list')">
              Find an attorney
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Templates -->
        <div class="card">
          <div class="card-head">
            <div>
              <h3>Message templates</h3>
              <p>The four messages the system sends on your behalf. Edit the voice to match yours.</p>
            </div>
            <a href="#" class="card-head-link" onclick="event.preventDefault(); showToast('Preview mode coming soon')">
              Preview all
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="tpl-grid">
            <div class="tpl-card" onclick="openTemplate('reminder-email')">
              <div class="tpl-head">
                <div class="tpl-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </div>
                <div>
                  <div class="tpl-name">Reminder email</div>
                  <div class="tpl-meta">Day 5 · Email · friendly tone</div>
                </div>
              </div>
              <div class="tpl-preview">"Hi {{tenant_first_name}} — just a friendly heads up that {{month}} rent hasn't posted yet. No worries if it's on the way. Here's your payment link…"</div>
              <div class="tpl-foot">
                <span class="pill pill-green">Active</span>
                <span class="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                </span>
              </div>
            </div>

            <div class="tpl-card" onclick="openTemplate('late-fee-sms')">
              <div class="tpl-head">
                <div class="tpl-icon orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <div class="tpl-name">Late fee SMS</div>
                  <div class="tpl-meta">Day 6 · SMS · direct</div>
                </div>
              </div>
              <div class="tpl-preview">"Hi {{tenant_first_name}}, a $50 late fee was added to {{month}} rent. Total now due: {{balance}}. Pay: {{link}}"</div>
              <div class="tpl-foot">
                <span class="pill pill-green">Active</span>
                <span class="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                </span>
              </div>
            </div>

            <div class="tpl-card" onclick="openTemplate('second-reminder')">
              <div class="tpl-head">
                <div class="tpl-icon pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h4.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <div class="tpl-name">Second reminder + call task</div>
                  <div class="tpl-meta">Day 10 · Email + call task for Harrison</div>
                </div>
              </div>
              <div class="tpl-preview">"Hey {{tenant_first_name}} — reaching out again. If something's going on, let's talk. We'd rather work it out than escalate. Reply here or call {{landlord_phone}}."</div>
              <div class="tpl-foot">
                <span class="pill pill-green">Active</span>
                <span class="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                </span>
              </div>
            </div>

            <div class="tpl-card" onclick="openTemplate('certified-notice')">
              <div class="tpl-head">
                <div class="tpl-icon red">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                </div>
                <div>
                  <div class="tpl-name">Certified notice (legal)</div>
                  <div class="tpl-meta">Day 15 · Certified mail PDF</div>
                </div>
              </div>
              <div class="tpl-preview">"NOTICE OF PAST DUE RENT AND DEMAND FOR PAYMENT — pursuant to {{state_code}}. You have {{cure_days}} days from receipt to cure the default of {{balance}}…"</div>
              <div class="tpl-foot">
                <span class="pill pill-gray nodot">Jurisdiction-aware</span>
                <span class="tpl-edit">Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- =============== MODALS =============== -->

  <!-- Log payment -->
  <div class="modal-backdrop" id="modal-log-payment" onclick="if(event.target===this) closeModal('modal-log-payment')">
    <div class="modal">
      <div class="modal-head">
        <h3>Log a payment</h3>
        <p>Use this when rent came in outside Tenantory (cash, check, bank transfer).</p>
      </div>
      <div class="modal-body">
        <div class="field-row">
          <div class="field">
            <label>Amount</label>
            <input type="text" placeholder="$950.00" value="$950.00">
          </div>
          <div class="field">
            <label>Date received</label>
            <input type="date" value="2026-04-14">
          </div>
        </div>
        <div class="field">
          <label>Method</label>
          <select>
            <option>Bank transfer</option>
            <option>Cash</option>
            <option>Check</option>
            <option>Money order</option>
            <option>Zelle / Venmo</option>
            <option>Other</option>
          </select>
        </div>
        <div class="field">
          <label>Notes (optional)</label>
          <input type="text" placeholder="Check #4421 · dropped off in person">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('modal-log-payment')">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal('modal-log-payment'); showToast('Payment logged · balance updated')">Log payment</button>
      </div>
    </div>
  </div>

  <!-- Escalate -->
  <div class="modal-backdrop" id="modal-escalate" onclick="if(event.target===this) closeModal('modal-escalate')">
    <div class="modal">
      <div class="modal-head">
        <h3>Escalate to formal notice</h3>
        <p>This generates a certified-mail-ready legal notice. The tenant will be given the jurisdiction-required cure period.</p>
      </div>
      <div class="modal-body">
        <div class="warn-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
          <div>
            Continuing will pause all automated reminders, draft a certified notice, and open a legal timeline in the tenant file. You'll review and sign before anything sends.
          </div>
        </div>
        <div class="field" style="margin-top:14px;">
          <label>Reason for escalation</label>
          <select>
            <option>Non-payment of rent</option>
            <option>Habitual late payment</option>
            <option>Lease violation + arrears</option>
          </select>
        </div>
        <div class="field">
          <label>Internal note</label>
          <input type="text" placeholder="Why now? (private, for your records)">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('modal-escalate')">Cancel</button>
        <button class="btn btn-danger" onclick="closeModal('modal-escalate'); showToast('Notice drafted · pending your review')">Continue</button>
      </div>
    </div>
  </div>

  <!-- Pause automation -->
  <div class="modal-backdrop" id="modal-pause" onclick="if(event.target===this) closeModal('modal-pause')">
    <div class="modal">
      <div class="modal-head">
        <h3 id="pause-title">Pause automation?</h3>
        <p id="pause-body">Reminders, late fees, and SMS will stop firing until you turn it back on. You'll still see who's late — you just won't chase automatically.</p>
      </div>
      <div class="modal-body">
        <div class="warn-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <div>Most operators find manual chasing takes 30–60 minutes per late tenant, per month. We recommend keeping automation on unless you're handling a specific situation.</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('modal-pause')">Keep on</button>
        <button class="btn btn-danger" onclick="closeModal('modal-pause'); toggleAutoNow()">Pause automation</button>
      </div>
    </div>
  </div>

  <!-- Message all late -->
  <div class="modal-backdrop" id="modal-message-all" onclick="if(event.target===this) closeModal('modal-message-all')">
    <div class="modal wide">
      <div class="modal-head">
        <h3>Message all late tenants</h3>
        <p>This sends to 2 recipients: Marcus Lee, Dana Okafor. Personalization tokens auto-fill per tenant.</p>
      </div>
      <div class="modal-body">
        <div class="field">
          <label>Channel</label>
          <select>
            <option>Email + SMS (recommended)</option>
            <option>Email only</option>
            <option>SMS only</option>
          </select>
        </div>
        <div class="field">
          <label>Message</label>
          <textarea placeholder="Hi {{tenant_first_name}}, I wanted to check in on {{month}} rent…">Hi {{tenant_first_name}}, just a quick check-in on {{month}} rent. Your balance is {{balance}}. If anything's going on, reply here and we'll work something out. — Harrison</textarea>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('modal-message-all')">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal('modal-message-all'); showToast('Message queued to 2 tenants')">Send to all</button>
      </div>
    </div>
  </div>

  <!-- Template editor -->
  <div class="modal-backdrop" id="modal-template" onclick="if(event.target===this) closeModal('modal-template')">
    <div class="modal wide">
      <div class="modal-head">
        <h3 id="tpl-title">Edit template</h3>
        <p id="tpl-subtitle">Use tokens like {{tenant_first_name}}, {{month}}, {{balance}}, {{link}}.</p>
      </div>
      <div class="modal-body">
        <div class="field">
          <label>Subject / first line</label>
          <input id="tpl-subject" type="text" value="Quick note on {{month}} rent">
        </div>
        <div class="field">
          <label>Message body</label>
          <textarea id="tpl-body" style="min-height:180px;">Hi {{tenant_first_name}},

Just a friendly heads up that {{month}} rent hasn't posted yet — no stress if it's already on the way.

If you need to pay now: {{link}}

Thanks,
Harrison</textarea>
        </div>
        <div class="field">
          <label>Tone</label>
          <select>
            <option>Friendly (default)</option>
            <option>Neutral / business</option>
            <option>Firm</option>
          </select>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('modal-template')">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal('modal-template'); showToast('Template saved')">Save template</button>
      </div>
    </div>
  </div>

  <div class="toast-wrap" id="toast-wrap"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
