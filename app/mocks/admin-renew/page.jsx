"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-renew.html.
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
      --pink-dark: #e5377f;
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
      transition: all 0.15s ease;
      cursor: pointer;
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
    .topbar-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-muted);
    }
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
    .topbar-search input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 13px; color: var(--text);
    }
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

    /* Content */
    .content { flex: 1; overflow-y: auto; padding: 32px; }

    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 28px; flex-wrap: wrap;
    }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 4px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: var(--pink-dark); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    /* Filter bar */
    .filter-bar {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 14px 16px;
      display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .filter-group {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: var(--text-muted); font-weight: 600;
    }
    .filter-select {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 32px 8px 12px;
      font-size: 13px; color: var(--text); font-weight: 500;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
      transition: all 0.15s ease; cursor: pointer;
    }
    .filter-select:hover { border-color: var(--border-strong); }
    .filter-select:focus { outline: none; border-color: var(--blue); background-color: var(--surface); }
    .filter-spacer { flex: 1; }
    .filter-reset {
      font-size: 12px; color: var(--text-muted); font-weight: 600;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .filter-reset:hover { color: var(--blue); }
    .filter-reset svg { width: 12px; height: 12px; }

    /* KPI row */
    .kpi-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 16px; margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      transition: all 0.15s ease;
    }
    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }
    .kpi-card-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .kpi-card-label {
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .kpi-card-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .kpi-card-icon svg { width: 16px; height: 16px; }
    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }
    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }
    .kpi-card-icon.pink { background: var(--pink-bg); color: var(--pink); }
    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .kpi-card-icon.gray { background: var(--surface-alt); color: var(--text-muted); }
    .kpi-card-value {
      font-size: 30px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.1;
    }
    .kpi-card-delta {
      font-size: 12px; font-weight: 600; margin-top: 6px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .kpi-card-delta.up { color: var(--green-dark); }
    .kpi-card-delta.neutral { color: var(--text-muted); }
    .kpi-card-delta.pink { color: var(--pink); }

    /* Bulk-action bar */
    .bulk-bar {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding: 14px 20px;
      display: flex; align-items: center; gap: 14px;
      border-bottom: none;
    }
    .bulk-bar.has-selection {
      background: linear-gradient(90deg, rgba(255,73,152,0.06), rgba(18,81,173,0.04));
      border-color: rgba(255,73,152,0.3);
    }
    .bulk-select {
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: var(--text-muted); font-weight: 600;
      cursor: pointer;
    }
    .bulk-count { color: var(--text); font-weight: 700; }
    .bulk-spacer { flex: 1; }

    /* Checkbox */
    .cbx {
      appearance: none; -webkit-appearance: none;
      width: 18px; height: 18px; border-radius: 5px;
      border: 1.5px solid var(--border-strong);
      background: var(--surface); cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s ease;
      position: relative;
    }
    .cbx:hover { border-color: var(--blue); }
    .cbx:checked { background: var(--blue); border-color: var(--blue); }
    .cbx:checked::after {
      content: ""; position: absolute;
      width: 10px; height: 10px;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/contain no-repeat;
    }
    .cbx.indeterminate { background: var(--blue); border-color: var(--blue); }
    .cbx.indeterminate::after {
      content: ""; position: absolute;
      width: 10px; height: 2px; background: #fff; border-radius: 1px;
    }

    /* Table */
    .table-card {
      background: var(--surface); border: 1px solid var(--border);
      border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      overflow: hidden;
    }
    .table { width: 100%; }
    .table-row {
      display: grid;
      grid-template-columns: 32px 1.6fr 1.3fr 100px 110px 90px 130px 110px 120px;
      gap: 14px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      transition: background 0.15s ease; cursor: pointer;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover:not(.table-row-head) { background: var(--surface-subtle); }
    .table-row.selected { background: rgba(255,73,152,0.05); }
    .table-row.selected:hover { background: rgba(255,73,152,0.08); }
    .table-row-head {
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
      cursor: default;
    }
    .table-tenant { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .table-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; flex-shrink: 0;
    }
    .table-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .table-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .table-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .table-avatar.gray { background: var(--surface-alt); color: var(--text-muted); }
    .table-tenant-name { font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .table-tenant-meta { font-size: 12px; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .table-property { color: var(--text); font-weight: 500; }
    .table-property-unit { font-size: 12px; color: var(--text-faint); }
    .table-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .table-date { color: var(--text); font-weight: 500; }
    .table-days { font-variant-numeric: tabular-nums; font-weight: 600; }
    .table-days.urgent { color: var(--red); }
    .table-days.warn { color: var(--orange); }
    .table-days.ok { color: var(--text-muted); }
    .table-term {
      background: var(--surface-alt); border: 1px solid var(--border);
      padding: 6px 10px; border-radius: 8px;
      font-size: 12px; font-weight: 600; color: var(--text);
    }

    /* Inline rent edit */
    .rent-edit {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 8px; padding: 6px 10px;
      font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;
      color: var(--text); width: 100px;
      transition: all 0.15s ease;
    }
    .rent-edit:hover { border-color: var(--blue); }
    .rent-edit:focus { outline: none; border-color: var(--blue); background: var(--surface); box-shadow: 0 0 0 3px var(--blue-pale); }
    .rent-change {
      display: block; font-size: 11px; margin-top: 3px; font-weight: 600;
    }
    .rent-change.up { color: var(--green-dark); }
    .rent-change.flat { color: var(--text-muted); }
    .rent-change.down { color: var(--red); }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 4px 10px;
      border-radius: 100px; white-space: nowrap;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill-dot {
      width: 6px; height: 6px; border-radius: 50%; background: currentColor;
    }

    /* Empty state */
    .empty-state {
      text-align: center; padding: 64px 24px;
      background: var(--surface); border: 1px dashed var(--border-strong);
      border-radius: var(--radius-lg); margin-top: 20px;
    }
    .empty-state-icon {
      width: 64px; height: 64px; border-radius: 16px;
      background: var(--green-bg); color: var(--green-dark);
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }
    .empty-state-icon svg { width: 28px; height: 28px; }
    .empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em; }
    .empty-state p { color: var(--text-muted); font-size: 13px; }

    /* Footer info */
    .page-footer-info {
      margin-top: 20px;
      background: var(--blue-pale);
      border: 1px solid rgba(18,81,173,0.15);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      display: flex; align-items: flex-start; gap: 14px;
      color: var(--navy);
    }
    .page-footer-info-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--blue); color: #fff;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .page-footer-info-icon svg { width: 16px; height: 16px; }
    .page-footer-info p { font-size: 13px; line-height: 1.55; color: var(--navy); }
    .page-footer-info strong { font-weight: 700; }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(20,32,74,0.5);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 60; padding: 24px;
      opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
    }
    .modal-backdrop.open { opacity: 1; pointer-events: auto; }
    .modal {
      background: var(--surface); border-radius: var(--radius-xl);
      width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto;
      box-shadow: var(--shadow-lg);
      transform: translateY(12px) scale(0.98); transition: transform 0.2s ease;
    }
    .modal-backdrop.open .modal { transform: translateY(0) scale(1); }
    .modal-head {
      padding: 22px 24px 4px;
      display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
    }
    .modal-head h2 { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .modal-head p { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
    .modal-close {
      width: 30px; height: 30px; border-radius: 8px;
      color: var(--text-muted); background: var(--surface-alt);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .modal-close:hover { background: var(--border); color: var(--text); }
    .modal-close svg { width: 14px; height: 14px; }
    .modal-body { padding: 16px 24px 4px; }
    .modal-foot {
      padding: 18px 24px 22px;
      display: flex; gap: 10px; justify-content: flex-end;
      border-top: 1px solid var(--border); margin-top: 18px;
    }

    .field { margin-bottom: 18px; }
    .field-label {
      display: block; font-size: 12px; font-weight: 700;
      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
      margin-bottom: 8px;
    }
    .segment {
      display: flex; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 10px; padding: 3px;
    }
    .segment-opt {
      flex: 1; padding: 9px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      text-align: center; transition: all 0.15s ease;
    }
    .segment-opt:hover { color: var(--text); }
    .segment-opt.active { background: var(--surface); color: var(--blue); box-shadow: var(--shadow-sm); }
    .field-input, .field-textarea {
      width: 100%; background: var(--surface);
      border: 1px solid var(--border); border-radius: 10px;
      padding: 10px 14px; font-size: 14px; color: var(--text);
      transition: all 0.15s ease;
    }
    .field-input:focus, .field-textarea:focus {
      outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale);
    }
    .field-textarea { resize: vertical; min-height: 90px; font-family: inherit; line-height: 1.5; }
    .field-hint { font-size: 12px; color: var(--text-faint); margin-top: 6px; }

    /* Drawer */
    .drawer-backdrop {
      position: fixed; inset: 0; background: rgba(20,32,74,0.35);
      z-index: 55; opacity: 0; pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .drawer-backdrop.open { opacity: 1; pointer-events: auto; }
    .drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 480px; max-width: 92vw;
      background: var(--surface); z-index: 56;
      box-shadow: -12px 0 40px rgba(20,32,74,0.12);
      transform: translateX(100%); transition: transform 0.28s cubic-bezier(.4,0,.2,1);
      display: flex; flex-direction: column;
    }
    .drawer.open { transform: translateX(0); }
    .drawer-head {
      padding: 22px 24px 18px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
      flex-shrink: 0;
    }
    .drawer-head-top {
      display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
    }
    .drawer-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px;
    }
    .drawer-head h2 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .drawer-head-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
    .drawer-foot {
      padding: 16px 24px; border-top: 1px solid var(--border);
      display: flex; gap: 10px; flex-shrink: 0; background: var(--surface-subtle);
    }

    .drawer-section { margin-bottom: 22px; }
    .drawer-section-label {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
    }
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    .info-cell {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 12px;
    }
    .info-cell-label { font-size: 11px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
    .info-cell-value { font-size: 15px; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; margin-top: 3px; }
    .info-cell-value.green { color: var(--green-dark); }

    .history-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 9px 0; border-bottom: 1px solid var(--border);
      font-size: 13px;
    }
    .history-row:last-child { border-bottom: none; }
    .history-row-label { color: var(--text-muted); }
    .history-row-value { font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }

    .signal-bar {
      display: flex; align-items: center; gap: 10px;
      background: var(--green-bg); border: 1px solid rgba(30,169,124,0.25);
      border-radius: 10px; padding: 12px 14px;
    }
    .signal-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--green-dark); color: #fff;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .signal-icon svg { width: 16px; height: 16px; }
    .signal-title { font-size: 13px; font-weight: 700; color: var(--green-dark); }
    .signal-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

    .ai-card {
      background: linear-gradient(135deg, rgba(255,73,152,0.06), rgba(18,81,173,0.05));
      border: 1px solid rgba(255,73,152,0.2);
      border-radius: 12px; padding: 14px;
    }
    .ai-head {
      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--pink);
    }
    .ai-head svg { width: 12px; height: 12px; }
    .ai-rec {
      font-size: 14px; color: var(--text); font-weight: 500; line-height: 1.55;
    }
    .ai-rec strong { font-weight: 700; color: var(--navy); }
    .ai-opts {
      display: flex; flex-direction: column; gap: 8px; margin-top: 12px;
    }
    .ai-opt {
      display: flex; justify-content: space-between; align-items: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 12px; font-size: 13px;
    }
    .ai-opt-label { color: var(--text-muted); }
    .ai-opt-value { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .ai-opt.recommended { border-color: var(--pink); background: rgba(255,73,152,0.04); }
    .ai-opt.recommended .ai-opt-label { color: var(--pink); font-weight: 700; }

    .ticket-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 12px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 10px;
      margin-bottom: 8px;
    }
    .ticket-row:last-child { margin-bottom: 0; }
    .ticket-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .ticket-meta { font-size: 12px; color: var(--text-faint); margin-top: 1px; }

    /* Toast */
    .toast {
      position: fixed; bottom: 28px; left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--navy-darker); color: #fff;
      padding: 14px 20px; border-radius: 100px;
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; font-weight: 600;
      box-shadow: var(--shadow-lg); z-index: 80;
      opacity: 0; pointer-events: none;
      transition: all 0.25s cubic-bezier(.4,0,.2,1);
    }
    .toast.show {
      opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto;
    }
    .toast-icon {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--green); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .toast-icon svg { width: 12px; height: 12px; }

    @media (max-width: 1200px) {
      .kpi-row { grid-template-columns: repeat(2, 1fr); }
      .table-row { grid-template-columns: 32px 1.4fr 1.2fr 90px 100px 80px 120px 100px 110px; }
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
          <a class="sb-nav-item active" href="leases.html">
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
          <a class="sb-nav-item" href="maintenance.html">
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
          <a href="leases.html">Leases</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Renewals</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, leases, invoices…">
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

        <!-- Page header -->
        <div class="page-head">
          <div>
            <h1>Renewals</h1>
            <p>7 leases expire in the next 90 days. Propose renewal terms and send tenant offers in bulk.</p>
          </div>
          <div class="page-head-actions">
            <button class="btn btn-ghost" id="previewBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview offer
            </button>
            <button class="btn btn-ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export
            </button>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <span>Expire within</span>
            <select class="filter-select" id="expireFilter">
              <option>Next 90 days</option>
              <option>Next 60 days</option>
              <option>Next 30 days</option>
            </select>
          </div>
          <div class="filter-group">
            <span>Property</span>
            <select class="filter-select">
              <option>All properties</option>
              <option>908 Lee Dr NW</option>
              <option>3026 Turf Ave NW</option>
              <option>1412 Oak St SE</option>
              <option>622 Meridian St</option>
            </select>
          </div>
          <div class="filter-group">
            <span>Status</span>
            <select class="filter-select">
              <option>All statuses</option>
              <option>Not started</option>
              <option>Offer sent</option>
              <option>Signed</option>
              <option>Declined</option>
              <option>Moved out</option>
            </select>
          </div>
          <div class="filter-spacer"></div>
          <button class="filter-reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
            Reset
          </button>
        </div>

        <!-- KPI row -->
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Expiring next 90d</div>
              <div class="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">7</div>
            <div class="kpi-card-delta neutral">2 inside 30 days</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Offers sent</div>
              <div class="kpi-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">3</div>
            <div class="kpi-card-delta neutral">Avg response 2.4 days</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Renewed</div>
              <div class="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">1</div>
            <div class="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              +$50/mo lift
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-head">
              <div class="kpi-card-label">Lost to move-out</div>
              <div class="kpi-card-icon gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
              </div>
            </div>
            <div class="kpi-card-value">0</div>
            <div class="kpi-card-delta neutral">0% churn YTD</div>
          </div>
        </div>

        <!-- Bulk action bar + table -->
        <div class="bulk-bar" id="bulkBar">
          <label class="bulk-select">
            <input type="checkbox" class="cbx" id="selectAll">
            <span id="selectLabel">Select all on page</span>
          </label>
          <div class="bulk-spacer"></div>
          <button class="btn btn-ghost btn-sm" id="editTermsBtn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
            Set default renewal terms for selected
          </button>
          <button class="btn btn-pink btn-sm" id="sendOffersBtn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
            Send offers to selected
          </button>
        </div>

        <div class="table-card" id="tableCard">
          <div class="table">
            <div class="table-row table-row-head">
              <div></div>
              <div>Tenant</div>
              <div>Property</div>
              <div>Current rent</div>
              <div>Lease ends</div>
              <div>Days left</div>
              <div>Proposed rent</div>
              <div>Term</div>
              <div>Status</div>
            </div>

            <div class="table-row" data-row="1" data-ends="May 13, 2026" data-days="29">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="1"></label>
              <div class="table-tenant">
                <div class="table-avatar pink">MJ</div>
                <div>
                  <div class="table-tenant-name">Maya Jefferson</div>
                  <div class="table-tenant-meta">On-time 98% · 2.5 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">908 Lee Dr NW</div>
                <div class="table-property-unit">Unit A · 2 bed</div>
              </div>
              <div class="table-amount">$725</div>
              <div class="table-date">May 13, 2026</div>
              <div class="table-days urgent">29d</div>
              <div>
                <input type="text" class="rent-edit" value="$750" data-base="725" onclick="event.stopPropagation();">
                <span class="rent-change up">+3.4% · +$25</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-gray"><span class="pill-dot"></span>Not started</span></div>
            </div>

            <div class="table-row" data-row="2" data-ends="May 31, 2026" data-days="47">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="2"></label>
              <div class="table-tenant">
                <div class="table-avatar">TW</div>
                <div>
                  <div class="table-tenant-name">Travis Wheeler</div>
                  <div class="table-tenant-meta">On-time 100% · 3.1 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">3026 Turf Ave NW</div>
                <div class="table-property-unit">Unit 2 · 1 bed</div>
              </div>
              <div class="table-amount">$750</div>
              <div class="table-date">May 31, 2026</div>
              <div class="table-days warn">47d</div>
              <div>
                <input type="text" class="rent-edit" value="$775" data-base="750" onclick="event.stopPropagation();">
                <span class="rent-change up">+3.3% · +$25</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Offer sent</span></div>
            </div>

            <div class="table-row" data-row="3" data-ends="June 10, 2026" data-days="57">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="3"></label>
              <div class="table-tenant">
                <div class="table-avatar green">DR</div>
                <div>
                  <div class="table-tenant-name">Danielle Reyes</div>
                  <div class="table-tenant-meta">On-time 95% · 1.8 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">1412 Oak St SE</div>
                <div class="table-property-unit">Main house · 3 bed</div>
              </div>
              <div class="table-amount">$750</div>
              <div class="table-date">June 10, 2026</div>
              <div class="table-days warn">57d</div>
              <div>
                <input type="text" class="rent-edit" value="$750" data-base="750" onclick="event.stopPropagation();">
                <span class="rent-change flat">Flat · no change</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-gray"><span class="pill-dot"></span>Not started</span></div>
            </div>

            <div class="table-row" data-row="4" data-ends="June 22, 2026" data-days="69">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="4"></label>
              <div class="table-tenant">
                <div class="table-avatar orange">KB</div>
                <div>
                  <div class="table-tenant-name">Kareem Brooks</div>
                  <div class="table-tenant-meta">On-time 88% · 4.2 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">622 Meridian St</div>
                <div class="table-property-unit">Unit 4 · 1 bed</div>
              </div>
              <div class="table-amount">$750</div>
              <div class="table-date">June 22, 2026</div>
              <div class="table-days ok">69d</div>
              <div>
                <input type="text" class="rent-edit" value="$800" data-base="750" onclick="event.stopPropagation();">
                <span class="rent-change up">+6.7% · +$50</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-green"><span class="pill-dot"></span>Signed</span></div>
            </div>

            <div class="table-row" data-row="5" data-ends="July 01, 2026" data-days="78">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="5"></label>
              <div class="table-tenant">
                <div class="table-avatar">SP</div>
                <div>
                  <div class="table-tenant-name">Sarah Park</div>
                  <div class="table-tenant-meta">On-time 100% · 0.9 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">908 Lee Dr NW</div>
                <div class="table-property-unit">Unit B · 2 bed</div>
              </div>
              <div class="table-amount">$725</div>
              <div class="table-date">July 01, 2026</div>
              <div class="table-days ok">78d</div>
              <div>
                <input type="text" class="rent-edit" value="$750" data-base="725" onclick="event.stopPropagation();">
                <span class="rent-change up">+3.4% · +$25</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Offer sent</span></div>
            </div>

            <div class="table-row" data-row="6" data-ends="July 09, 2026" data-days="86">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="6"></label>
              <div class="table-tenant">
                <div class="table-avatar pink">AL</div>
                <div>
                  <div class="table-tenant-name">Alex Lindgren</div>
                  <div class="table-tenant-meta">On-time 93% · 2.0 yrs</div>
                </div>
              </div>
              <div>
                <div class="table-property">3026 Turf Ave NW</div>
                <div class="table-property-unit">Unit 1 · 2 bed</div>
              </div>
              <div class="table-amount">$775</div>
              <div class="table-date">July 09, 2026</div>
              <div class="table-days ok">86d</div>
              <div>
                <input type="text" class="rent-edit" value="$795" data-base="775" onclick="event.stopPropagation();">
                <span class="rent-change up">+2.6% · +$20</span>
              </div>
              <div><span class="table-term">12 mo</span></div>
              <div><span class="pill pill-blue"><span class="pill-dot"></span>Offer sent</span></div>
            </div>

            <div class="table-row" data-row="7" data-ends="July 12, 2026" data-days="89">
              <label onclick="event.stopPropagation();"><input type="checkbox" class="cbx row-cbx" data-row="7"></label>
              <div class="table-tenant">
                <div class="table-avatar gray">RN</div>
                <div>
                  <div class="table-tenant-name">Rachel Novak</div>
                  <div class="table-tenant-meta">Gave notice · moving out</div>
                </div>
              </div>
              <div>
                <div class="table-property">1412 Oak St SE</div>
                <div class="table-property-unit">Basement · 1 bed</div>
              </div>
              <div class="table-amount">$650</div>
              <div class="table-date">July 12, 2026</div>
              <div class="table-days ok">89d</div>
              <div>
                <span style="color: var(--text-faint); font-size: 13px;">—</span>
              </div>
              <div><span class="table-term" style="color: var(--text-faint);">—</span></div>
              <div><span class="pill pill-orange"><span class="pill-dot"></span>Moved out</span></div>
            </div>

          </div>
        </div>

        <!-- Empty state (hidden when rows present) -->
        <div class="empty-state" id="emptyState" style="display: none;">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3>All caught up — no leases expiring in 90 days</h3>
          <p>We'll surface renewals here 90 days before each lease ends.</p>
        </div>

        <!-- Footer info -->
        <div class="page-footer-info">
          <div class="page-footer-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <p><strong>How this works:</strong> The tenant sees the offer as a notification in their portal + email. They pick from your 3 options or decline. You see their response in this table — no back-and-forth texts needed.</p>
        </div>

      </div>

    </main>
  </div>

  <!-- ===== BULK EDIT MODAL ===== -->
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal">
      <div class="modal-head">
        <div>
          <h2>Set default renewal terms</h2>
          <p id="modalSub">Apply to <strong>0 selected</strong> tenants. You can still tweak any row individually.</p>
        </div>
        <button class="modal-close" id="modalClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">

        <div class="field">
          <label class="field-label">Term length</label>
          <div class="segment" data-segment="term">
            <button class="segment-opt active" data-val="12mo">12 months</button>
            <button class="segment-opt" data-val="6mo">6 months</button>
            <button class="segment-opt" data-val="mtm">Month-to-month</button>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Rent change</label>
          <div class="segment" data-segment="rent">
            <button class="segment-opt" data-val="flat">Flat</button>
            <button class="segment-opt" data-val="2">+2%</button>
            <button class="segment-opt active" data-val="3">+3%</button>
            <button class="segment-opt" data-val="5">+5%</button>
            <button class="segment-opt" data-val="custom">Custom</button>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Offer expires in</label>
          <div class="segment" data-segment="expiry">
            <button class="segment-opt" data-val="7">7 days</button>
            <button class="segment-opt active" data-val="14">14 days</button>
            <button class="segment-opt" data-val="21">21 days</button>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Custom message (optional)</label>
          <textarea class="field-textarea" placeholder="Thanks for being a great tenant — here are three renewal options. Let me know which works best.">Thanks for being a great tenant — here are three renewal options. Let me know which works best.</textarea>
          <div class="field-hint">Included at the top of the tenant's renewal offer.</div>
        </div>

      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost btn-sm" id="modalCancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="modalApply">Apply to selected</button>
      </div>
    </div>
  </div>

  <!-- ===== DETAIL DRAWER ===== -->
  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="drawer" id="drawer">
    <div class="drawer-head">
      <div style="flex: 1; min-width: 0;">
        <div class="drawer-head-top">
          <div class="drawer-avatar pink" id="drawerAvatar" style="background: var(--pink-bg); color: var(--pink);">MJ</div>
          <div style="min-width: 0;">
            <h2 id="drawerName">Maya Jefferson</h2>
            <div class="drawer-head-sub" id="drawerMeta">908 Lee Dr NW · Unit A · Ends May 13, 2026</div>
          </div>
        </div>
      </div>
      <button class="modal-close" id="drawerClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="drawer-body">

      <div class="drawer-section">
        <div class="info-grid">
          <div class="info-cell">
            <div class="info-cell-label">Current rent</div>
            <div class="info-cell-value">$725</div>
          </div>
          <div class="info-cell">
            <div class="info-cell-label">Tenure</div>
            <div class="info-cell-value">2.5 yrs</div>
          </div>
          <div class="info-cell">
            <div class="info-cell-label">On-time rate</div>
            <div class="info-cell-value green">98%</div>
          </div>
          <div class="info-cell">
            <div class="info-cell-label">Late payments</div>
            <div class="info-cell-value">1</div>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-label">Rent history</div>
        <div class="history-row">
          <span class="history-row-label">Oct 2023 · Move-in</span>
          <span class="history-row-value">$685</span>
        </div>
        <div class="history-row">
          <span class="history-row-label">May 2024 · Renewal (+2.9%)</span>
          <span class="history-row-value">$705</span>
        </div>
        <div class="history-row">
          <span class="history-row-label">May 2025 · Renewal (+2.8%)</span>
          <span class="history-row-value">$725</span>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-label">Social signal</div>
        <div class="signal-bar">
          <div class="signal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div>
            <div class="signal-title">High-value tenant — keep them</div>
            <div class="signal-sub">30 of 30 rent cycles paid on-time. Zero noise complaints. 2 maintenance tickets, both same-day closed.</div>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-label">Open maintenance tickets</div>
        <div class="ticket-row">
          <div>
            <div class="ticket-title">Kitchen faucet drip</div>
            <div class="ticket-meta">Opened 3 days ago · vendor scheduled</div>
          </div>
          <span class="pill pill-orange"><span class="pill-dot"></span>In progress</span>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-label">AI-suggested terms</div>
        <div class="ai-card">
          <div class="ai-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8L4 12l6.1 3.2L12 21l1.9-5.8L20 12l-6.1-3.2z"/></svg>
            Tenantory recommends
          </div>
          <div class="ai-rec">Offer <strong>$750 / 12 mo</strong> (+3.4%). Market comps at 908 Lee Dr average $755–$770. Her payment history supports a slight increase — she'll almost certainly renew.</div>
          <div class="ai-opts">
            <div class="ai-opt recommended">
              <span class="ai-opt-label">12-month renewal</span>
              <span class="ai-opt-value">$750/mo · +$25</span>
            </div>
            <div class="ai-opt">
              <span class="ai-opt-label">6-month renewal</span>
              <span class="ai-opt-value">$765/mo · +$40</span>
            </div>
            <div class="ai-opt">
              <span class="ai-opt-label">Month-to-month</span>
              <span class="ai-opt-value">$800/mo · +$75</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="drawer-foot">
      <button class="btn btn-ghost btn-sm" style="flex: 1;" id="drawerCancelBtn">Cancel</button>
      <a href="renew.html" class="btn btn-pink btn-sm" style="flex: 2; justify-content: center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
        Send offer to tenant
      </a>
    </div>
  </aside>

  <!-- ===== TOAST ===== -->
  <div class="toast" id="toast">
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    <span id="toastMsg">3 renewal offers sent</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
