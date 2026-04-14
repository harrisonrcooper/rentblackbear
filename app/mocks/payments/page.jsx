"use client";

// Mock ported verbatim from ~/Desktop/tenantory/payments.html.
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
    input, select, textarea { font-family: inherit; font-size: inherit; }

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
      min-width: 340px; color: var(--text-faint);
    }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }
    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }

    /* ===== Scroll wrap ===== */
    .scroll-wrap { flex: 1; overflow-y: auto; }

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
    .btn-ghost-red { color: var(--red); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost-red:hover { border-color: var(--red); background: var(--red-bg); }
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

    /* ===== Toolbar ===== */
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
    .filter-chip {
      background: var(--blue-pale); color: var(--blue);
      padding: 2px 8px; border-radius: 100px;
      font-size: 11px; font-weight: 700; margin-left: 4px;
    }

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

    /* ===== Payments table card ===== */
    .table-card {
      margin: 16px 28px 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .table-card-head {
      padding: 14px 20px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
      background: var(--surface-subtle);
    }
    .table-card-title {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; font-weight: 700; color: var(--text);
    }
    .table-card-title-count {
      background: var(--blue-pale); color: var(--blue);
      padding: 2px 8px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
    }
    .table-card-actions { display: flex; gap: 6px; align-items: center; }
    .table-card-link {
      font-size: 13px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 10px; border-radius: 6px;
    }
    .table-card-link:hover { background: var(--blue-pale); }

    .pay-table { width: 100%; }
    .pay-thead {
      display: grid;
      grid-template-columns: 92px 1.6fr 110px 1.5fr 1.3fr 120px 120px 140px 48px;
      gap: 14px; padding: 10px 20px;
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 2;
    }
    .pay-row {
      display: grid;
      grid-template-columns: 92px 1.6fr 110px 1.5fr 1.3fr 120px 120px 140px 48px;
      gap: 14px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      transition: background 0.12s ease;
      cursor: pointer; position: relative;
    }
    .pay-row:last-child { border-bottom: none; }
    .pay-row:hover { background: var(--surface-subtle); }
    .pay-row.selected { background: var(--blue-pale); }
    .pay-row.bulked { outline: 2px solid var(--pink); outline-offset: -2px; background: var(--pink-bg); }

    .pay-date { font-variant-numeric: tabular-nums; color: var(--text-muted); font-weight: 500; }
    .pay-date strong { display: block; color: var(--text); font-weight: 700; }

    .pay-tenant { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .pay-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 11px; color: var(--blue);
      background: var(--blue-pale); flex-shrink: 0;
    }
    .pay-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .pay-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .pay-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .pay-avatar.purple { background: var(--purple-bg); color: var(--purple); }
    .pay-tenant-name { font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .type-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 700;
      padding: 3px 9px; border-radius: 6px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .type-badge.charge { background: var(--blue-pale); color: var(--blue); }
    .type-badge.payment { background: var(--green-bg); color: var(--green-dark); }
    .type-badge.refund { background: var(--purple-bg); color: var(--purple); }
    .type-badge.fee { background: var(--orange-bg); color: var(--orange); }

    .pay-prop { color: var(--text-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pay-prop strong { color: var(--text); font-weight: 600; display: block; font-size: 13px; }

    .pay-method {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--text); font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .pay-method-icon {
      width: 22px; height: 16px; border-radius: 3px;
      display: flex; align-items: center; justify-content: center;
      font-size: 8px; font-weight: 800; color: #fff; flex-shrink: 0;
      letter-spacing: 0.02em;
    }
    .pay-method-icon.visa { background: #1a1f71; }
    .pay-method-icon.mc { background: #eb001b; }
    .pay-method-icon.ach { background: var(--navy); font-size: 7px; }
    .pay-method-icon.cash { background: var(--green-dark); }
    .pay-method-icon.check { background: var(--text-muted); }
    .pay-method-icon.none { background: var(--surface-alt); color: var(--text-faint); border: 1px dashed var(--border-strong); }
    .pay-method-sub { color: var(--text-faint); font-size: 11px; margin-left: 4px; }

    .pay-amount {
      font-weight: 700; color: var(--text);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .pay-amount.negative { color: var(--purple); }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px; white-space: nowrap;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-purple { background: var(--purple-bg); color: var(--purple); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill svg { width: 10px; height: 10px; }
    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .stripe-ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--text-faint);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .stripe-ref.has-ref { color: var(--blue); }
    .stripe-ref.none { color: var(--text-faint); }

    .pay-actions {
      display: flex; gap: 2px; justify-content: flex-end;
      opacity: 0; transition: opacity 0.15s ease;
    }
    .pay-row:hover .pay-actions { opacity: 1; }
    .icon-btn {
      width: 26px; height: 26px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 0.12s ease;
    }
    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }
    .icon-btn.refund:hover { background: var(--purple-bg); color: var(--purple); }
    .icon-btn.resend:hover { background: var(--green-bg); color: var(--green-dark); }
    .icon-btn svg { width: 14px; height: 14px; }

    /* Floating inline action cluster on hover (right edge) */
    .row-actions-float {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      display: flex; gap: 4px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 100px; padding: 3px;
      box-shadow: var(--shadow);
      opacity: 0; pointer-events: none;
      transition: opacity 0.12s ease;
      z-index: 2;
    }
    .pay-row:hover .row-actions-float { opacity: 1; pointer-events: auto; }
    .row-actions-float .icon-btn { width: 24px; height: 24px; }

    /* ===== Upcoming charges ===== */
    .upcoming-wrap { margin: 20px 28px 28px; }
    .upcoming-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
    }
    .upcoming-head h2 {
      font-size: 15px; font-weight: 700; color: var(--text);
    }
    .upcoming-head-sub {
      font-size: 12px; color: var(--text-muted); margin-top: 2px;
    }
    .upcoming-head-link {
      font-size: 13px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 10px; border-radius: 6px;
    }
    .upcoming-head-link:hover { background: var(--blue-pale); }
    .upcoming-head-link svg { width: 14px; height: 14px; }

    .upcoming-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .upcoming-thead {
      display: grid;
      grid-template-columns: 120px 1.6fr 1.4fr 1fr 120px 120px;
      gap: 14px; padding: 10px 20px;
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
    }
    .upcoming-row {
      display: grid;
      grid-template-columns: 120px 1.6fr 1.4fr 1fr 120px 120px;
      gap: 14px; padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      transition: background 0.12s ease;
    }
    .upcoming-row:last-child { border-bottom: none; }
    .upcoming-row:hover { background: var(--surface-subtle); }

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
      padding: 22px 24px 20px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 16px;
    }
    .drawer-head-left { flex: 1; min-width: 0; }
    .drawer-amount {
      font-size: 34px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1; font-variant-numeric: tabular-nums;
    }
    .drawer-amount.negative { color: var(--purple); }
    .drawer-head-meta {
      margin-top: 8px; display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-muted);
    }
    .drawer-head-meta strong { color: var(--text); font-weight: 600; }
    .drawer-head-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }

    .drawer-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .drawer-close:hover { background: var(--border); color: var(--text); }
    .drawer-close svg { width: 16px; height: 16px; }

    .drawer-info-row {
      padding: 14px 24px; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 16px; background: var(--surface-subtle);
    }
    .drawer-info-cell { min-width: 0; }
    .drawer-info-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 6px;
    }
    .drawer-info-val {
      font-size: 13px; font-weight: 600; color: var(--text);
      display: flex; align-items: center; gap: 6px;
    }
    .drawer-info-val.mono {
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      color: var(--blue); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

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

    .drawer-body {
      flex: 1; overflow-y: auto; padding: 22px 24px;
    }
    .drawer-section { margin-bottom: 22px; }
    .drawer-section:last-child { margin-bottom: 0; }
    .drawer-section-head {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;
    }
    .drawer-row {
      display: grid; grid-template-columns: 140px 1fr; gap: 12px;
      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);
    }
    .drawer-row:last-child { border-bottom: none; }
    .drawer-row > span:first-child { color: var(--text-muted); }
    .drawer-row > span:last-child { color: var(--text); font-weight: 500; text-align: right; }
    .drawer-row .mono {
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      color: var(--blue);
    }

    /* Receipt preview */
    .receipt {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px;
      position: relative;
    }
    .receipt-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding-bottom: 14px; border-bottom: 1px solid var(--border);
      margin-bottom: 14px;
    }
    .receipt-brand { display: flex; align-items: center; gap: 10px; }
    .receipt-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .receipt-logo svg { width: 16px; height: 16px; }
    .receipt-brand-name { font-weight: 800; font-size: 15px; color: var(--text); }
    .receipt-brand-sub { font-size: 11px; color: var(--text-muted); }
    .receipt-meta { text-align: right; font-size: 11px; color: var(--text-muted); }
    .receipt-meta strong { display: block; color: var(--text); font-size: 12px; }

    .receipt-to {
      font-size: 11px; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
    }
    .receipt-to-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .receipt-to-addr { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }

    .receipt-line {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; font-size: 13px;
      border-bottom: 1px solid var(--border);
    }
    .receipt-line-desc strong { display: block; font-weight: 600; color: var(--text); }
    .receipt-line-desc span { font-size: 11px; color: var(--text-muted); }
    .receipt-line-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .receipt-total {
      display: flex; justify-content: space-between;
      padding: 12px 0 4px; font-size: 15px;
    }
    .receipt-total-label { color: var(--text-muted); font-weight: 600; }
    .receipt-total-amt { font-weight: 800; color: var(--text); font-size: 18px; font-variant-numeric: tabular-nums; }

    .receipt-stamp {
      position: absolute; top: 80px; right: 20px;
      transform: rotate(-8deg);
      border: 3px solid var(--green-dark); color: var(--green-dark);
      padding: 6px 14px; border-radius: 6px;
      font-weight: 800; font-size: 13px; letter-spacing: 0.1em;
      opacity: 0.72;
    }

    /* Activity feed */
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

    /* Refund form */
    .field { margin-bottom: 14px; }
    .field-label {
      font-size: 12px; font-weight: 600; color: var(--text);
      margin-bottom: 6px; display: block;
    }
    .field-label .req { color: var(--pink); }
    .field-input, .field-select, .field-textarea {
      width: 100%; padding: 10px 12px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; font-size: 13px; color: var(--text);
      outline: none; transition: border-color 0.15s ease;
    }
    .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.1); }
    .field-textarea { resize: vertical; min-height: 80px; font-family: inherit; }
    .field-input-wrap { position: relative; }
    .field-input-wrap::before {
      content: "$"; position: absolute; left: 12px; top: 50%;
      transform: translateY(-50%);
      font-weight: 700; color: var(--text-muted);
    }
    .field-input-wrap .field-input { padding-left: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .field-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

    .refund-preview {
      margin-top: 14px; padding: 14px; border-radius: 10px;
      background: var(--purple-bg);
      font-size: 12px;
    }
    .refund-preview-row {
      display: flex; justify-content: space-between; padding: 2px 0;
      color: var(--text);
    }
    .refund-preview-row strong { font-weight: 700; }

    /* Drawer footer */
    .drawer-foot {
      border-top: 1px solid var(--border); padding: 14px 24px;
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

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 1200px) {
      .drawer { width: 460px; }
      .pay-thead, .pay-row {
        grid-template-columns: 80px 1.4fr 90px 1.2fr 120px 100px 110px 48px;
      }
      .pay-thead .col-ref, .pay-row .cell-ref { display: none; }
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
          <strong>Payments</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search payments, tenants, charges...">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
        </div>
      </div>

      <div class="scroll-wrap">

        <!-- Page head -->
        <div class="page-head-bar">
          <div>
            <h1>Payments</h1>
            <p>Rent collection, autopay, and reconciliation — your money in motion</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost" data-action="Reconcile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.7"/><path d="m21 3-9 9-3-3"/></svg>
              Reconcile
            </button>
            <button class="btn btn-ghost" data-action="Record payment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              Record payment
            </button>
            <button class="btn btn-primary" data-action="Charge tenant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Charge tenant
            </button>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="stats-strip">
          <div class="stat-item">
            <div class="stat-label">Collected this month</div>
            <div class="stat-value">$24,850 <span class="stat-delta up">+12% MoM</span></div>
            <div class="stat-sub">Across 27 charges</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">On-time rate</div>
            <div class="stat-value">94% <span class="stat-delta up">+8%</span></div>
            <div class="stat-sub">vs. last 90 days</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">A/R aging</div>
            <div class="stat-value" style="color: var(--orange);">$1,725 <span class="stat-delta orange">1 tenant late</span></div>
            <div class="stat-sub">Priya Patel · 2d</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Autopay enrollment</div>
            <div class="stat-value">73% <span class="stat-delta pink">+5%</span></div>
            <div class="stat-sub">8 of 11 active leases</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Refunds MTD</div>
            <div class="stat-value" style="color: var(--text-muted);">$0 <span class="stat-delta gray">0 issued</span></div>
            <div class="stat-sub">Clean month</div>
          </div>
        </div>

        <!-- Toolbar: saved views + filters + view toggle -->
        <div class="toolbar">
          <div class="saved-views">
            <div class="saved-view active" data-view="all">All <span class="saved-view-count">84</span></div>
            <div class="saved-view" data-view="charges">Charges <span class="saved-view-count">52</span></div>
            <div class="saved-view" data-view="payments">Payments <span class="saved-view-count">28</span></div>
            <div class="saved-view" data-view="refunds">Refunds <span class="saved-view-count">2</span></div>
            <div class="saved-view" data-view="autopay">Autopay <span class="saved-view-count">32</span></div>
            <div class="saved-view" data-view="late">
              <span class="saved-view-dot" style="background: var(--red);"></span>
              Late <span class="saved-view-count">3</span>
            </div>
            <div class="saved-view" data-view="pending">Pending <span class="saved-view-count">2</span></div>
            <div class="saved-view" data-view="failed">Failed <span class="saved-view-count">1</span></div>
          </div>

          <div class="toolbar-right">
            <button class="filter-btn" data-filter="Filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></svg>
              Filter
              <span class="filter-chip">April 2026</span>
            </button>
            <button class="filter-btn" data-filter="Sort">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16"/></svg>
              Sort · Date
            </button>
            <div class="view-toggle">
              <button class="active" data-view-toggle="table">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                Table
              </button>
              <button data-view-toggle="calendar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Calendar
              </button>
            </div>
          </div>
        </div>

        <!-- Payments table -->
        <div class="table-card">
          <div class="table-card-head">
            <div class="table-card-title">
              Transactions
              <span class="table-card-title-count" id="txn-count">18 shown</span>
            </div>
            <div class="table-card-actions">
              <button class="table-card-link" data-action="Export CSV">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Export CSV
              </button>
              <button class="table-card-link" data-action="Send statements">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Send statements
              </button>
            </div>
          </div>

          <div class="pay-table">
            <div class="pay-thead">
              <div>Date</div>
              <div>Tenant</div>
              <div>Type</div>
              <div>Property</div>
              <div>Method</div>
              <div style="text-align: right;">Amount</div>
              <div>Status</div>
              <div class="col-ref">Stripe ref</div>
              <div></div>
            </div>
            <div id="pay-tbody"></div>
          </div>
        </div>

        <!-- Upcoming charges -->
        <div class="upcoming-wrap">
          <div class="upcoming-head">
            <div>
              <h2>Upcoming charges</h2>
              <div class="upcoming-head-sub">Next 7 days of scheduled rent</div>
            </div>
            <a class="upcoming-head-link" data-action="Manage schedule">
              Manage schedule
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="upcoming-card">
            <div class="upcoming-thead">
              <div>Due date</div>
              <div>Tenant</div>
              <div>Property</div>
              <div>Method</div>
              <div style="text-align: right;">Amount</div>
              <div>Status</div>
            </div>
            <div class="upcoming-row">
              <div><strong>Apr 15</strong></div>
              <div class="pay-tenant">
                <div class="pay-avatar green">KW</div>
                <div class="pay-tenant-name">Kai Wong</div>
              </div>
              <div class="pay-prop"><strong>1523 Oak Ave</strong></div>
              <div class="pay-method">
                <div class="pay-method-icon ach">ACH</div>
                Autopay
              </div>
              <div class="pay-amount" style="text-align: right;">$1,350.00</div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Scheduled</span></div>
            </div>
            <div class="upcoming-row">
              <div><strong>Apr 18</strong></div>
              <div class="pay-tenant">
                <div class="pay-avatar orange">DH</div>
                <div class="pay-tenant-name">Devon Harris</div>
              </div>
              <div class="pay-prop"><strong>2909 Wilson</strong> · Room D</div>
              <div class="pay-method">
                <div class="pay-method-icon visa">VISA</div>
                Card
              </div>
              <div class="pay-amount" style="text-align: right;">$900.00</div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Scheduled</span></div>
            </div>
            <div class="upcoming-row">
              <div><strong>Apr 20</strong></div>
              <div class="pay-tenant">
                <div class="pay-avatar purple">NA</div>
                <div class="pay-tenant-name">Nina Alvarez</div>
              </div>
              <div class="pay-prop"><strong>88 Pine St</strong> · Unit 2</div>
              <div class="pay-method">
                <div class="pay-method-icon ach">ACH</div>
                Autopay
              </div>
              <div class="pay-amount" style="text-align: right;">$1,625.00</div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Scheduled</span></div>
            </div>
            <div class="upcoming-row">
              <div><strong>Apr 20</strong></div>
              <div class="pay-tenant">
                <div class="pay-avatar pink">RB</div>
                <div class="pay-tenant-name">Ryan Bowers</div>
              </div>
              <div class="pay-prop"><strong>2907 Wilson</strong> · Room B</div>
              <div class="pay-method">
                <div class="pay-method-icon none">?</div>
                Not enrolled
              </div>
              <div class="pay-amount" style="text-align: right;">$875.00</div>
              <div><span class="pill pill-orange"><span class="pill-dot"></span>Awaiting autopay</span></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Drawer backdrop -->
      <div class="drawer-backdrop"></div>

      <!-- Drawer -->
      <aside class="drawer">
        <div class="drawer-head">
          <div class="drawer-head-left">
            <div class="drawer-amount" id="drawer-amount">$850.00</div>
            <div class="drawer-head-meta">
              <strong id="drawer-tenant">Sarah Chen</strong>
              <span class="dot"></span>
              <span id="drawer-property">2909 Wilson Dr NW · Room A</span>
            </div>
          </div>
          <button class="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="drawer-info-row">
          <div class="drawer-info-cell">
            <div class="drawer-info-label">Status</div>
            <div class="drawer-info-val"><span class="pill pill-green" id="drawer-status"><span class="pill-dot"></span>Paid</span></div>
          </div>
          <div class="drawer-info-cell">
            <div class="drawer-info-label">Method</div>
            <div class="drawer-info-val" id="drawer-method">
              <div class="pay-method-icon ach">ACH</div>
              Autopay
            </div>
          </div>
          <div class="drawer-info-cell">
            <div class="drawer-info-label">Date</div>
            <div class="drawer-info-val" id="drawer-processed">Apr 1, 2026</div>
          </div>
          <div class="drawer-info-cell">
            <div class="drawer-info-label">Ref</div>
            <div class="drawer-info-val mono" id="drawer-ref">pi_3Nf8...GT7</div>
          </div>
        </div>

        <div class="drawer-tabs">
          <button class="drawer-tab active" data-tab="overview">Overview</button>
          <button class="drawer-tab" data-tab="receipt">Receipt</button>
          <button class="drawer-tab" data-tab="activity">Activity</button>
          <button class="drawer-tab" data-tab="refund">Refund</button>
        </div>

        <div class="drawer-body" id="drawer-body">
          <!-- filled by JS -->
        </div>

        <div class="drawer-foot">
          <button class="btn btn-ghost" data-drawer-action="send-receipt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Send receipt
          </button>
          <button class="btn btn-ghost-red" data-drawer-action="issue-refund">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/></svg>
            Issue refund
          </button>
          <button class="btn btn-primary" data-drawer-action="download-pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download PDF
          </button>
        </div>
      </aside>

      <!-- BULK ACTION BAR -->
      <div class="bulk-bar">
        <div class="bulk-count">0</div>
        <span>transactions selected</span>
        <div class="bulk-bar-actions">
          <button class="bulk-btn primary" data-bulk="Send statements">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Send statements
          </button>
          <button class="bulk-btn" data-bulk="Export CSV">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
          <button class="bulk-btn" data-bulk="Mark reconciled">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Mark reconciled
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
