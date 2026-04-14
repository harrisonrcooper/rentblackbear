"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-pay-vendor.html.
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
      --pink-dark: #e83687;
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

    /* ===== Shell ===== */
    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar ===== */
    .sidebar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.75);
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sb-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(18,81,173,0.3);
    }
    .sb-logo svg { width: 18px; height: 18px; color: #fff; }
    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
    .sb-section-label {
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.14em;
      padding: 8px 12px 10px;
    }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      color: rgba(255,255,255,0.75);
      transition: all 0.15s ease;
      position: relative;
    }
    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sb-nav-item.active {
      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));
      color: #fff;
    }
    .sb-nav-item.active::before {
      content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px;
      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;
    }
    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }
    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }
    .sb-nav-badge {
      margin-left: auto; background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 100px;
    }
    .sb-nav-count {
      margin-left: auto; background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      font-size: 11px; font-weight: 600;
      padding: 2px 7px; border-radius: 100px;
    }

    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .sb-user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease; cursor: pointer;
    }
    .sb-user-card:hover { background: rgba(255,255,255,0.08); }
    .sb-user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 12px;
    }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }
    .sb-user-action { color: rgba(255,255,255,0.5); }

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
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-breadcrumb a:hover { color: var(--blue); }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px;
      min-width: 280px; color: var(--text-faint);
      transition: all 0.15s ease;
    }
    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; background: var(--surface); border: 1px solid var(--border);
      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);
    }
    .topbar-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; position: relative;
    }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot {
      position: absolute; top: 7px; right: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--pink); border: 2px solid #fff;
    }

    .content { flex: 1; overflow-y: auto; padding: 28px 32px 56px; }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 4px 12px rgba(255,73,152,0.25); }
    .btn-pink:hover { background: var(--pink-dark); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,73,152,0.3); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-danger-ghost { color: var(--red); border: 1px solid var(--border); background: var(--surface); }
    .btn-danger-ghost:hover { border-color: var(--red); background: var(--red-bg); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 13px 22px; font-size: 14px; }
    .btn svg { width: 14px; height: 14px; }

    /* Page head */
    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 24px; flex-wrap: wrap;
    }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 4px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    .breadcrumb-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: var(--text-muted);
      margin-bottom: 14px; font-weight: 500;
    }
    .breadcrumb-row a:hover { color: var(--blue); }
    .breadcrumb-row svg { width: 12px; height: 12px; opacity: 0.6; }
    .breadcrumb-row strong { color: var(--text); font-weight: 600; }

    /* ===== Stats strip ===== */
    .stats-strip {
      display: grid; grid-template-columns: repeat(4, 1fr);
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      margin-bottom: 20px;
    }
    .stat {
      padding: 18px 22px; border-right: 1px solid var(--border);
      display: flex; flex-direction: column; gap: 6px;
      position: relative;
    }
    .stat:last-child { border-right: none; }
    .stat-label {
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
      display: flex; align-items: center; gap: 6px;
    }
    .stat-label .dot { width: 6px; height: 6px; border-radius: 50%; }
    .stat-label .dot.pink { background: var(--pink); }
    .stat-label .dot.green { background: var(--green); }
    .stat-label .dot.blue { background: var(--blue); }
    .stat-label .dot.gray { background: var(--text-faint); }
    .stat-value { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    .stat-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .stat-sub strong { color: var(--text); font-weight: 700; }

    /* ===== Main inbox layout ===== */
    .inbox {
      display: grid; grid-template-columns: 380px 1fr;
      gap: 20px; align-items: flex-start;
    }

    /* Left list */
    .list-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      display: flex; flex-direction: column;
      min-height: 560px;
    }
    .list-head {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      gap: 10px;
    }
    .list-head h3 { font-size: 14px; font-weight: 700; color: var(--text); }
    .list-head .count { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .list-sort {
      display: flex; gap: 4px; padding: 10px 12px;
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
    }
    .sort-btn {
      font-size: 11px; font-weight: 600;
      color: var(--text-muted);
      padding: 5px 10px; border-radius: 100px;
      transition: all 0.15s ease;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .sort-btn:hover { background: var(--surface); color: var(--text); }
    .sort-btn.active { background: var(--blue-pale); color: var(--blue); }
    .sort-btn svg { width: 10px; height: 10px; }
    .list-body { flex: 1; overflow-y: auto; }

    .inv-row {
      display: grid; grid-template-columns: 36px 1fr auto;
      gap: 12px; padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      align-items: center;
    }
    .inv-row:hover { background: var(--surface-subtle); }
    .inv-row.active { background: var(--blue-pale); }
    .inv-row.active::before {
      content: ""; position: absolute; left: 0; top: 8px; bottom: 8px;
      width: 3px; background: var(--blue); border-radius: 0 3px 3px 0;
    }
    .inv-row.removing { opacity: 0; transform: translateX(120%); max-height: 0; padding: 0 16px; border: none; overflow: hidden; }
    .inv-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; color: #fff;
      flex-shrink: 0;
    }
    .inv-avatar.a { background: linear-gradient(135deg, #1665D8, #2F3E83); }
    .inv-avatar.b { background: linear-gradient(135deg, #1ea97c, #138a60); }
    .inv-avatar.c { background: linear-gradient(135deg, #ea8c3a, #d47730); }
    .inv-avatar.d { background: linear-gradient(135deg, #FF4998, #e83687); }
    .inv-avatar.e { background: linear-gradient(135deg, #6e56cf, #4f3eb8); }
    .inv-body { min-width: 0; }
    .inv-top {
      display: flex; justify-content: space-between; align-items: baseline;
      gap: 8px; margin-bottom: 2px;
    }
    .inv-name { font-weight: 700; font-size: 13px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .inv-amount { font-weight: 700; font-size: 13px; color: var(--text); font-variant-numeric: tabular-nums; flex-shrink: 0; }
    .inv-meta { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .inv-foot { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    .inv-date { font-size: 11px; color: var(--text-faint); }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 10px; font-weight: 700; padding: 2px 8px;
      border-radius: 100px; white-space: nowrap;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill svg { width: 10px; height: 10px; }

    /* Right pane */
    .detail { display: flex; flex-direction: column; gap: 16px; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .card-head {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .card-head h3 { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
    .card-head .muted { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .card-body { padding: 20px; }

    /* Vendor card */
    .vendor-card {
      display: grid; grid-template-columns: 56px 1fr auto;
      gap: 16px; padding: 20px;
      align-items: center;
    }
    .vendor-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 20px; color: #fff;
      background: linear-gradient(135deg, #1665D8, #2F3E83);
      letter-spacing: -0.02em;
    }
    .vendor-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .vendor-name { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    .vendor-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: var(--text-muted); }
    .vendor-meta .sep { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }
    .vendor-meta-item { display: inline-flex; align-items: center; gap: 5px; }
    .vendor-meta-item strong { color: var(--text); font-weight: 700; }
    .vendor-meta-item svg { width: 13px; height: 13px; }
    .vendor-meta-item svg.star { color: var(--gold); }
    .vendor-actions { display: flex; gap: 8px; }

    /* Linked ticket */
    .ticket-preview {
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .ticket-head {
      padding: 14px 20px;
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer;
      gap: 12px;
    }
    .ticket-head:hover { background: var(--blue-pale); }
    .ticket-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .ticket-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--orange-bg); color: var(--orange);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .ticket-icon svg { width: 16px; height: 16px; }
    .ticket-info { min-width: 0; }
    .ticket-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .ticket-sub { font-size: 12px; color: var(--text-muted); }
    .ticket-chev {
      color: var(--text-faint);
      transition: transform 0.2s ease;
    }
    .ticket-chev svg { width: 16px; height: 16px; }
    .ticket-preview.open .ticket-chev { transform: rotate(90deg); }
    .ticket-body {
      display: none;
      padding: 0 20px 18px;
      font-size: 13px; color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 14px;
    }
    .ticket-preview.open .ticket-body { display: block; }
    .ticket-body .label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin: 12px 0 4px; }
    .ticket-body p { color: var(--text); line-height: 1.55; }

    /* Line items */
    .line-table {
      width: 100%; border-collapse: collapse;
      font-size: 13px;
    }
    .line-table th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;
      padding: 10px 20px; background: var(--surface-alt);
      border-bottom: 1px solid var(--border);
    }
    .line-table th.num, .line-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .line-table td {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    .line-desc { font-weight: 600; color: var(--text); }
    .line-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .line-receipt {
      display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;
      font-size: 11px; color: var(--blue); font-weight: 600;
      padding: 3px 8px; background: var(--blue-pale); border-radius: 6px;
    }
    .line-receipt svg { width: 10px; height: 10px; }
    .line-table tfoot td {
      padding: 10px 20px;
      border-bottom: none;
      font-size: 13px;
    }
    .line-table tfoot tr.sub td { color: var(--text-muted); padding-top: 14px; }
    .line-table tfoot tr.total td {
      font-weight: 800; font-size: 16px; color: var(--text);
      border-top: 2px solid var(--text);
      padding-top: 12px;
    }

    /* Receipts gallery */
    .receipts {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
      padding: 20px;
    }
    .receipt-tile {
      aspect-ratio: 4 / 3; border-radius: var(--radius);
      background: var(--surface-alt); border: 1px solid var(--border);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 6px; color: var(--text-faint);
      cursor: pointer; transition: all 0.15s ease;
      overflow: hidden; position: relative;
    }
    .receipt-tile:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
    .receipt-tile svg { width: 28px; height: 28px; }
    .receipt-label {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(180deg, transparent, rgba(0,0,0,0.65));
      color: #fff; font-size: 11px; font-weight: 600;
      padding: 18px 10px 8px;
    }
    .receipt-tile.img-a { background: linear-gradient(135deg, #cfd9ee, #9fb3d9); }
    .receipt-tile.img-b { background: linear-gradient(135deg, #e6d5c7, #c9a987); }
    .receipt-tile.img-c { background: linear-gradient(135deg, #d4e8dc, #9ac6ab); }
    .receipt-tile.img-a svg, .receipt-tile.img-b svg, .receipt-tile.img-c svg { color: rgba(255,255,255,0.85); }

    /* Vendor note */
    .vnote {
      padding: 18px 20px; border-top: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .vnote-head {
      display: flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
      margin-bottom: 8px;
    }
    .vnote-head svg { width: 12px; height: 12px; }
    .vnote-body {
      font-size: 13px; color: var(--text); line-height: 1.55;
      font-style: italic;
    }
    .vnote-sig { font-size: 12px; color: var(--text-muted); margin-top: 8px; font-style: normal; }

    /* Disputes & edits */
    .disputes {
      padding: 16px 20px; border-top: 1px dashed var(--border);
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; font-size: 13px; color: var(--text-muted);
    }
    .disputes-left { display: flex; align-items: center; gap: 10px; }
    .disputes-left svg { width: 16px; height: 16px; color: var(--text-faint); }

    /* Action row */
    .action-row {
      padding: 20px; border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }
    .action-row .primary-side { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .action-row .meta-side { font-size: 12px; color: var(--text-muted); }
    .action-row .meta-side strong { color: var(--text); font-weight: 700; }

    /* Payout details card */
    .payout-card {
      background: linear-gradient(135deg, #fff 0%, var(--surface-subtle) 100%);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 22px; display: grid; grid-template-columns: auto 1fr auto; gap: 20px;
      align-items: center;
    }
    .payout-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: var(--pink-bg); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
    }
    .payout-icon svg { width: 24px; height: 24px; }
    .payout-body h4 {
      font-size: 15px; font-weight: 800; color: var(--text);
      letter-spacing: -0.01em; margin-bottom: 4px;
    }
    .payout-body p { font-size: 13px; color: var(--text-muted); }
    .payout-grid {
      display: grid; grid-template-columns: repeat(3, auto); gap: 18px;
      margin-top: 10px;
    }
    .payout-item { font-size: 12px; }
    .payout-item .label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
    .payout-item .label svg { width: 11px; height: 11px; color: var(--green-dark); }
    .payout-item .val { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .payout-amount { text-align: right; }
    .payout-amount .big { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    .payout-amount .sm { font-size: 11px; color: var(--text-muted); font-weight: 500; }

    /* History */
    .history-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .history-table th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;
      padding: 10px 20px; background: var(--surface-alt);
      border-bottom: 1px solid var(--border);
    }
    .history-table th.num, .history-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .history-table td { padding: 12px 20px; border-bottom: 1px solid var(--border); }
    .history-table tr:last-child td { border-bottom: none; }
    .history-table tr:hover td { background: var(--surface-subtle); }
    .history-title { font-weight: 600; color: var(--text); }
    .history-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

    /* Toast */
    .toast-wrap {
      position: fixed; bottom: 28px; right: 28px; z-index: 200;
      display: flex; flex-direction: column; gap: 10px;
    }
    .toast {
      background: var(--text); color: #fff;
      padding: 14px 18px; border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 12px;
      min-width: 320px; font-size: 13px;
      animation: toast-in 0.3s ease;
    }
    .toast.success { background: var(--green-dark); }
    .toast svg { width: 18px; height: 18px; flex-shrink: 0; }
    .toast strong { font-weight: 700; }
    .toast small { color: rgba(255,255,255,0.7); display: block; margin-top: 1px; font-size: 11px; }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .toast.out { animation: toast-out 0.3s ease forwards; }
    @keyframes toast-out {
      to { opacity: 0; transform: translateX(20px); }
    }

    /* Modal */
    .modal-wrap {
      position: fixed; inset: 0; z-index: 150;
      background: rgba(20, 32, 74, 0.45);
      backdrop-filter: blur(4px);
      display: none; align-items: center; justify-content: center;
      padding: 24px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .modal-wrap.open { display: flex; opacity: 1; }
    .modal {
      background: var(--surface); border-radius: var(--radius-xl);
      max-width: 520px; width: 100%;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      transform: translateY(10px);
      transition: transform 0.2s ease;
    }
    .modal-wrap.open .modal { transform: translateY(0); }
    .modal.wide { max-width: 720px; }
    .modal-head {
      padding: 20px 24px 14px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px;
    }
    .modal-head h2 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 4px; }
    .modal-head p { font-size: 13px; color: var(--text-muted); }
    .modal-close {
      width: 32px; height: 32px; border-radius: 8px;
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-close:hover { background: var(--surface-alt); color: var(--text); }
    .modal-close svg { width: 16px; height: 16px; }
    .modal-body { padding: 22px 24px; }
    .modal-foot {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; justify-content: flex-end; gap: 10px;
    }

    .modal-summary {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px; margin-bottom: 18px;
    }
    .modal-summary .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .modal-summary .row.total { border-top: 1px solid var(--border); margin-top: 6px; padding-top: 10px; font-weight: 800; font-size: 15px; }
    .modal-summary .lbl { color: var(--text-muted); }
    .modal-summary .val { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }

    .confirm-input {
      width: 100%; padding: 12px 14px;
      border: 1px solid var(--border-strong); border-radius: var(--radius);
      font-size: 14px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; text-align: center;
      color: var(--text); background: var(--surface);
    }
    .confirm-input:focus { outline: none; border-color: var(--pink); box-shadow: 0 0 0 3px var(--pink-bg); }
    .confirm-hint { font-size: 12px; color: var(--text-muted); margin-top: 8px; text-align: center; }
    .confirm-hint kbd {
      background: var(--surface-alt); padding: 2px 6px; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text);
      border: 1px solid var(--border);
    }

    .reason-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .reason-chip {
      padding: 7px 14px; border-radius: 100px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .reason-chip:hover { border-color: var(--blue); color: var(--blue); }
    .reason-chip.active { background: var(--blue-pale); border-color: var(--blue); color: var(--blue); }
    textarea.field {
      width: 100%; min-height: 120px;
      padding: 12px 14px;
      border: 1px solid var(--border); border-radius: var(--radius);
      font-size: 13px; color: var(--text);
      resize: vertical; font-family: inherit;
    }
    textarea.field:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }

    /* Partial approve modal */
    .partial-table { width: 100%; font-size: 13px; margin-bottom: 14px; border-collapse: collapse; }
    .partial-table th {
      text-align: left; font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;
      padding: 8px 10px; border-bottom: 1px solid var(--border);
    }
    .partial-table th.num, .partial-table td.num { text-align: right; }
    .partial-table td { padding: 10px; border-bottom: 1px solid var(--border); }
    .partial-table input[type="number"] {
      width: 90px; padding: 7px 10px; border: 1px solid var(--border);
      border-radius: 6px; text-align: right; font-variant-numeric: tabular-nums;
      font-weight: 600; color: var(--text);
    }
    .partial-table input[type="number"]:focus { outline: none; border-color: var(--blue); }
    .partial-table input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--blue); }
    .partial-total {
      padding: 14px 16px; background: var(--surface-subtle);
      border: 1px solid var(--border); border-radius: var(--radius);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 14px;
    }
    .partial-total .big { font-size: 20px; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
    .partial-total .delta { font-size: 12px; color: var(--text-muted); }
    .partial-total .delta.red { color: var(--red); font-weight: 600; }

    /* Empty state */
    .empty-state {
      padding: 48px 20px; text-align: center;
      color: var(--text-muted);
    }
    .empty-state svg { width: 40px; height: 40px; color: var(--text-faint); margin: 0 auto 12px; }
    .empty-state h4 { color: var(--text); font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .empty-state p { font-size: 13px; }

    @media (max-width: 1200px) {
      .inbox { grid-template-columns: 340px 1fr; }
    }
    @media (max-width: 1024px) {
      .inbox { grid-template-columns: 1fr; }
      .stats-strip { grid-template-columns: repeat(2, 1fr); }
      .stat:nth-child(2) { border-right: none; }
    }`;

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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>Dashboard
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>Applications
          <span class="sb-nav-badge">3</span>
        </a>
      </div>

      <div class="sb-section-label" style="margin-top: 20px;">Operations</div>
      <div class="sb-nav">
        <a class="sb-nav-item" href="payments.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Payments
        </a>
        <a class="sb-nav-item active" href="maintenance.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1"/></svg>Maintenance
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5"/></svg>Settings
        </a>
        <a class="sb-nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>Documents
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
        <div class="sb-user-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  </aside>

  <!-- ===== MAIN ===== -->
  <main class="main">

    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-breadcrumb">
        <a href="admin-v2.html">Workspace</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        <a href="maintenance.html">Maintenance</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        <strong>Vendor invoices</strong>
      </div>
      <div class="topbar-right">
        <div class="topbar-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input placeholder="Search invoices, vendors, tickets…">
          <kbd>⌘K</kbd>
        </div>
        <button class="topbar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="topbar-icon-dot"></span>
        </button>
        <button class="topbar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Quick add
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">

      <div class="breadcrumb-row">
        <a href="maintenance.html">Maintenance</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        <strong>Vendor invoices</strong>
      </div>

      <div class="page-head">
        <div>
          <h1>Vendor invoices</h1>
          <p>Review, approve, and pay out. Payouts hit the vendor's bank in 1-2 business days after you approve.</p>
        </div>
        <div class="page-head-actions">
          <button class="btn btn-ghost btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export
          </button>
          <button class="btn btn-ghost btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            1099 report
          </button>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat">
          <div class="stat-label"><span class="dot pink"></span>Awaiting approval</div>
          <div class="stat-value" id="stat-pending-count">3</div>
          <div class="stat-sub"><strong id="stat-pending-amt">$1,820</strong> total pending</div>
        </div>
        <div class="stat">
          <div class="stat-label"><span class="dot green"></span>Approved this month</div>
          <div class="stat-value">9</div>
          <div class="stat-sub"><strong>$3,440</strong> paid in April</div>
        </div>
        <div class="stat">
          <div class="stat-label"><span class="dot blue"></span>Paid YTD</div>
          <div class="stat-value">32</div>
          <div class="stat-sub"><strong>$11,830</strong> across 7 vendors</div>
        </div>
        <div class="stat">
          <div class="stat-label"><span class="dot gray"></span>Disputed</div>
          <div class="stat-value">0</div>
          <div class="stat-sub">No open disputes</div>
        </div>
      </div>

      <!-- Inbox layout -->
      <div class="inbox">

        <!-- Left list -->
        <div class="list-card">
          <div class="list-head">
            <h3>Pending invoices</h3>
            <span class="count" id="list-count">3 total</span>
          </div>
          <div class="list-sort">
            <button class="sort-btn active" data-sort="date">
              Date
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="sort-btn" data-sort="amount">Amount</button>
            <button class="sort-btn" data-sort="vendor">Vendor</button>
            <button class="sort-btn" data-sort="property">Property</button>
          </div>
          <div class="list-body" id="list-body">
            <!-- Invoice rows rendered via JS -->
          </div>
        </div>

        <!-- Right detail pane -->
        <div class="detail" id="detail-pane">
          <!-- Populated by renderDetail() -->
        </div>

      </div>

      <!-- History section -->
      <div class="card" style="margin-top: 28px;">
        <div class="card-head">
          <h3 id="history-title">Recent approved invoices — Joel's Plumbing</h3>
          <a href="#" class="btn btn-sm btn-ghost">View all</a>
        </div>
        <table class="history-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Property</th>
              <th>Approved</th>
              <th class="num">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="history-body">
            <tr>
              <td>
                <div class="history-title">INV-2041 · Water heater replacement</div>
                <div class="history-sub">Ticket #2183</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Mar 28, 2026</td>
              <td class="num"><strong>$1,240.00</strong></td>
              <td><span class="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div class="history-title">INV-2019 · Kitchen drain unclog</div>
                <div class="history-sub">Ticket #2141</div>
              </td>
              <td>3026 Turf Ave NW</td>
              <td>Mar 14, 2026</td>
              <td class="num"><strong>$185.00</strong></td>
              <td><span class="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div class="history-title">INV-1994 · Toilet rebuild, unit B</div>
                <div class="history-sub">Ticket #2110</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Feb 27, 2026</td>
              <td class="num"><strong>$310.00</strong></td>
              <td><span class="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div class="history-title">INV-1962 · Shutoff valve replace</div>
                <div class="history-sub">Ticket #2083</div>
              </td>
              <td>3026 Turf Ave NW</td>
              <td>Feb 11, 2026</td>
              <td class="num"><strong>$215.00</strong></td>
              <td><span class="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div class="history-title">INV-1928 · Garbage disposal install</div>
                <div class="history-sub">Ticket #2051</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Jan 30, 2026</td>
              <td class="num"><strong>$260.00</strong></td>
              <td><span class="pill pill-green">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</div>

<!-- ===== Approve modal (2-step) ===== -->
<div class="modal-wrap" id="modal-approve">
  <div class="modal">
    <div class="modal-head">
      <div>
        <h2 id="approve-title">Confirm payout</h2>
        <p id="approve-sub">Step 1 of 2 — review the transfer before releasing funds.</p>
      </div>
      <button class="modal-close" data-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="modal-body" id="approve-body-1">
      <div class="modal-summary">
        <div class="row"><span class="lbl">Vendor</span><span class="val" id="ap-vendor">Joel's Plumbing</span></div>
        <div class="row"><span class="lbl">Invoice</span><span class="val" id="ap-invoice">INV-2058</span></div>
        <div class="row"><span class="lbl">Property</span><span class="val" id="ap-property">908 Lee Dr NW, Unit A</span></div>
        <div class="row"><span class="lbl">Destination</span><span class="val" id="ap-dest">Chase ••6891 (Plaid verified)</span></div>
        <div class="row"><span class="lbl">Expected arrival</span><span class="val">1-2 business days</span></div>
        <div class="row total"><span class="lbl">You're paying</span><span class="val" id="ap-total">$640.00</span></div>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); line-height: 1.55;">
        Funds are debited from your operating account immediately and released via ACH once the cutoff clears. You'll receive email confirmation with receipt. The vendor's 1099 YTD will update automatically.
      </p>
    </div>

    <div class="modal-body" id="approve-body-2" style="display:none;">
      <p style="font-size: 13px; color: var(--text); margin-bottom: 14px; line-height: 1.55;">
        This releases <strong id="ap-confirm-amt">$640.00</strong> from your operating account to <strong id="ap-confirm-vendor">Joel's Plumbing</strong>. Type <strong>APPROVE</strong> below to finalize.
      </p>
      <input type="text" class="confirm-input" id="confirm-text" placeholder="Type APPROVE" autocomplete="off">
      <div class="confirm-hint">Press <kbd>Enter</kbd> when ready, or <kbd>Esc</kbd> to cancel.</div>
    </div>

    <div class="modal-foot">
      <button class="btn btn-ghost btn-sm" data-close>Cancel</button>
      <button class="btn btn-pink btn-sm" id="approve-next">
        Continue
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <button class="btn btn-pink btn-sm" id="approve-finalize" style="display:none;" disabled>
        Release payout
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </button>
    </div>
  </div>
</div>

<!-- ===== Dispute modal ===== -->
<div class="modal-wrap" id="modal-dispute">
  <div class="modal">
    <div class="modal-head">
      <div>
        <h2>Request a change</h2>
        <p>Send this back to the vendor with a reason. They'll get notified and can revise.</p>
      </div>
      <button class="modal-close" data-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="reason-grid" id="reason-grid">
        <button class="reason-chip" data-reason="Line item unclear — please itemize labor hours.">Itemize labor</button>
        <button class="reason-chip" data-reason="Parts total looks high vs estimate — attach receipts.">Parts look high</button>
        <button class="reason-chip" data-reason="Missing receipt for parts or materials.">Missing receipt</button>
        <button class="reason-chip" data-reason="After-hours surcharge was not pre-approved.">Surcharge not approved</button>
        <button class="reason-chip" data-reason="Tax applied incorrectly — should be exempt.">Tax error</button>
        <button class="reason-chip" data-reason="Scope of work differs from original ticket.">Scope mismatch</button>
      </div>
      <textarea class="field" id="dispute-text" placeholder="Add detail so the vendor can fix it quickly…"></textarea>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost btn-sm" data-close>Cancel</button>
      <button class="btn btn-primary btn-sm" id="dispute-send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
        Send to vendor
      </button>
    </div>
  </div>
</div>

<!-- ===== Partial approve modal ===== -->
<div class="modal-wrap" id="modal-partial">
  <div class="modal wide">
    <div class="modal-head">
      <div>
        <h2>Partial approve</h2>
        <p>Adjust what you'll pay. The vendor sees each edit with a reason.</p>
      </div>
      <button class="modal-close" data-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <table class="partial-table">
        <thead>
          <tr>
            <th style="width: 40px;">Pay</th>
            <th>Item</th>
            <th class="num" style="width: 120px;">Approved amt</th>
          </tr>
        </thead>
        <tbody id="partial-body"></tbody>
      </table>
      <div class="partial-total">
        <div>
          <div class="delta" id="partial-delta">Original $640.00</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;">New total</div>
        </div>
        <div class="big" id="partial-total">$640.00</div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost btn-sm" data-close>Cancel</button>
      <button class="btn btn-pink btn-sm" id="partial-confirm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        Approve adjusted
      </button>
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
