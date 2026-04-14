"use client";

// Mock ported verbatim from ~/Desktop/tenantory/vendor.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* Tenantory Flagship tokens (vendor sees Tenantory brand since they work across workspaces) */
    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --gold-bg: rgba(245,166,35,0.12);
      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545; --red-bg: rgba(214,69,69,0.1);
      --orange: #ea8c3a; --orange-bg: rgba(234,140,58,0.12);
      --purple: #7c4dff; --purple-bg: rgba(124,77,255,0.12);
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
    }

    /* ===== Topbar (Tenantory branded — vendor works across workspaces) ===== */
    .topbar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.9); padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 36px; height: 36px; border-radius: 9px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; margin-top: 1px; }

    .tb-nav { display: flex; gap: 2px; }
    .tb-nav-item {
      padding: 9px 16px; border-radius: 100px; font-size: 13px; font-weight: 600;
      color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px;
      transition: all 0.15s ease; position: relative;
    }
    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.08); }
    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.14); }
    .tb-nav-item svg { width: 15px; height: 15px; }
    .tb-nav-badge {
      background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 100px;
      margin-left: 4px;
    }

    .tb-right { display: flex; align-items: center; gap: 12px; }
    .tb-vendor {
      display: flex; align-items: center; gap: 10px;
      padding: 4px 4px 4px 14px; border-radius: 100px;
      background: rgba(255,255,255,0.08);
    }
    .tb-vendor-name { font-size: 13px; font-weight: 700; color: #fff; }
    .tb-vendor-sub { font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 1px; }
    .tb-vendor-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), var(--orange));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }

    /* ===== Wrap ===== */
    .wrap { max-width: 1180px; margin: 0 auto; padding: 28px 32px 60px; }

    .panel { display: none; }
    .panel.active { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .page-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; gap: 20px; flex-wrap: wrap;
    }
    .page-head-text h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .page-head-text p { color: var(--text-muted); font-size: 14px; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }
    .btn svg { width: 14px; height: 14px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-green { background: var(--green); color: #fff; }
    .btn-green:hover { background: var(--green-dark); transform: translateY(-1px); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); }

    /* ===== Stats strip ===== */
    .stats {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
      margin-bottom: 20px;
    }
    .stat {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
      transition: all 0.15s ease;
    }
    .stat:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); }
    .stat-label {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
      display: flex; align-items: center; gap: 8px;
    }
    .stat-label svg { width: 14px; height: 14px; }
    .stat-value { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; color: var(--text); }
    .stat-value small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }
    .stat-delta { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .stat-delta.up { color: var(--green-dark); font-weight: 600; }
    .stat-delta.warn { color: var(--orange); font-weight: 600; }

    /* ===== Job grouping ===== */
    .group-head {
      display: flex; align-items: center; gap: 12px; margin: 22px 0 12px;
    }
    .group-head:first-of-type { margin-top: 0; }
    .group-title { font-size: 12px; font-weight: 800; color: var(--text); text-transform: uppercase; letter-spacing: 0.12em; }
    .group-count {
      background: var(--surface-alt); color: var(--text-muted);
      padding: 2px 9px; border-radius: 100px; font-size: 11px; font-weight: 700;
    }
    .group-line { flex: 1; height: 1px; background: var(--border); }

    /* ===== Job card ===== */
    .job {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
      margin-bottom: 10px; cursor: pointer;
      display: grid; grid-template-columns: auto 1fr auto auto; gap: 16px; align-items: center;
      transition: all 0.15s ease;
    }
    .job:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    .job-priority {
      width: 4px; align-self: stretch; border-radius: 4px;
    }
    .job-priority.urgent { background: var(--red); }
    .job-priority.high { background: var(--orange); }
    .job-priority.normal { background: var(--blue); }
    .job-priority.low { background: var(--text-faint); }

    .job-body { min-width: 0; }
    .job-row1 { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
    .ws-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 8px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
    }
    .ws-pill.bb { background: rgba(30,111,71,0.12); color: #144d31; }
    .ws-pill.lakeside { background: rgba(124,77,255,0.12); color: #5a36c2; }
    .ws-pill.huntsmore { background: rgba(245,166,35,0.16); color: #a96f10; }
    .ws-pill-dot { width: 6px; height: 6px; border-radius: 50%; }
    .ws-pill.bb .ws-pill-dot { background: #1e6f47; }
    .ws-pill.lakeside .ws-pill-dot { background: #7c4dff; }
    .ws-pill.huntsmore .ws-pill-dot { background: #f5a623; }

    .pri-pill {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 100px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .pri-pill.urgent { background: var(--red-bg); color: var(--red); }
    .pri-pill.high { background: var(--orange-bg); color: var(--orange); }
    .pri-pill.normal { background: var(--blue-pale); color: var(--blue); }
    .pri-pill.low { background: var(--surface-alt); color: var(--text-muted); }

    .job-title { font-weight: 700; font-size: 15px; color: var(--text); margin-bottom: 4px; }
    .job-meta { font-size: 12.5px; color: var(--text-muted); display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .job-meta svg { width: 12px; height: 12px; vertical-align: -1px; margin-right: 4px; color: var(--text-faint); }

    .job-when {
      text-align: right; padding-right: 14px;
      border-right: 1px solid var(--border); align-self: stretch;
      display: flex; flex-direction: column; justify-content: center;
    }
    .job-when-label { font-size: 11px; color: var(--text-muted); font-weight: 600; }
    .job-when-time { font-size: 14px; font-weight: 800; color: var(--text); margin-top: 2px; letter-spacing: -0.01em; }
    .job-when-day { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .job-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .job-status {
      padding: 6px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .job-status.new { background: var(--pink-bg); color: #c21a6a; }
    .job-status.accepted { background: var(--blue-pale); color: var(--blue); }
    .job-status.scheduled { background: var(--gold-bg); color: #a96f10; }
    .job-status.in-progress { background: var(--orange-bg); color: var(--orange); }
    .job-status.complete { background: var(--green-bg); color: var(--green-dark); }
    .job-status svg { width: 11px; height: 11px; }
    .icon-btn {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .icon-btn:hover { background: var(--blue-pale); color: var(--blue); }
    .icon-btn svg { width: 14px; height: 14px; }

    /* ===== Invoices table ===== */
    .table-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);
    }
    .table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table th {
      text-align: left; padding: 12px 16px; font-weight: 700;
      color: var(--text-muted); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.08em;
      background: var(--surface-subtle); border-bottom: 1px solid var(--border);
    }
    .table td {
      padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--text);
    }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--surface-subtle); }
    .table-amt { font-weight: 700; font-variant-numeric: tabular-nums; }

    /* ===== Invoice summary ===== */
    .pay-summary {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
      margin-bottom: 18px;
    }
    .pay-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
    }
    .pay-card.featured {
      background: linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%);
      color: #fff; border-color: transparent;
    }
    .pay-card-label {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; margin-bottom: 8px;
      color: var(--text-muted);
    }
    .pay-card.featured .pay-card-label { color: rgba(255,255,255,0.7); }
    .pay-card-value { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
    .pay-card-sub { font-size: 12px; margin-top: 6px; color: var(--text-muted); }
    .pay-card.featured .pay-card-sub { color: rgba(255,255,255,0.7); }

    /* ===== Drawer ===== */
    .drawer-bg {
      position: fixed; inset: 0; background: rgba(20,32,74,0.45);
      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
      z-index: 60; display: flex; justify-content: flex-end;
    }
    .drawer-bg.open { opacity: 1; pointer-events: auto; }
    .drawer {
      background: var(--surface); width: 540px; max-width: 100%;
      height: 100%; overflow-y: auto;
      transform: translateX(20px); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);
      box-shadow: var(--shadow-lg);
    }
    .drawer-bg.open .drawer { transform: none; }
    .drawer-head {
      padding: 22px 24px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: flex-start;
      position: sticky; top: 0; background: var(--surface); z-index: 1;
    }
    .drawer-head-text { flex: 1; }
    .drawer-head h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .drawer-head-sub { font-size: 13px; color: var(--text-muted); }
    .drawer-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .drawer-close:hover { background: var(--red-bg); color: var(--red); }
    .drawer-close svg { width: 16px; height: 16px; }

    .drawer-body { padding: 22px 24px; }

    .det-row { display: grid; grid-template-columns: 110px 1fr; gap: 12px; padding: 8px 0; font-size: 13px; }
    .det-key { color: var(--text-muted); font-weight: 600; }
    .det-val { color: var(--text); }
    .det-val.muted { color: var(--text-muted); }

    .det-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }
    .det-section-title { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }

    .det-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .det-photo {
      aspect-ratio: 1; border-radius: var(--radius);
      background: linear-gradient(135deg, var(--blue-pale), var(--surface-alt));
      border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
      color: var(--text-faint); font-size: 11px; font-weight: 600;
    }
    .det-photo svg { width: 24px; height: 24px; opacity: 0.5; }

    .det-thread {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
    }
    .det-msg { display: flex; gap: 10px; padding: 8px 0; font-size: 13px; }
    .det-msg + .det-msg { border-top: 1px solid var(--border); margin-top: 4px; padding-top: 12px; }
    .det-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 11px; flex-shrink: 0;
    }
    .det-msg-avatar.tenant { background: linear-gradient(135deg, var(--blue), var(--blue-bright)); }
    .det-msg-avatar.operator { background: linear-gradient(135deg, var(--gold), var(--orange)); }
    .det-msg-avatar.you { background: linear-gradient(135deg, var(--green), var(--green-dark)); }
    .det-msg-body { flex: 1; }
    .det-msg-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .det-msg-name { font-weight: 700; font-size: 12.5px; color: var(--text); }
    .det-msg-time { font-size: 11px; color: var(--text-faint); }
    .det-msg-text { color: var(--text); line-height: 1.5; }

    .det-reply {
      margin-top: 12px; display: flex; gap: 8px;
    }
    .det-reply input {
      flex: 1; padding: 9px 12px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 13px; color: var(--text); outline: none;
    }
    .det-reply input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .det-reply .btn { padding: 9px 14px; }

    .time-log {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
    }
    .time-log-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; }
    .time-log-row + .time-log-row { border-top: 1px solid var(--border); }
    .time-log-add {
      margin-top: 10px; display: flex; gap: 8px; align-items: center;
    }
    .time-input {
      width: 80px; padding: 8px 10px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 13px; outline: none;
    }
    .time-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }

    .drawer-foot {
      padding: 16px 24px; border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; gap: 10px; justify-content: flex-end;
      position: sticky; bottom: 0;
    }

    /* ===== Profile ===== */
    .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .prof-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
    }
    .prof-card-title { font-size: 15px; font-weight: 800; margin-bottom: 14px; }

    .trade-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .trade-pill {
      padding: 5px 12px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 600;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .trade-pill svg { width: 11px; height: 11px; cursor: pointer; opacity: 0.6; }
    .trade-pill svg:hover { opacity: 1; }
    .trade-add {
      padding: 5px 12px; border-radius: 100px;
      background: var(--surface-alt); border: 1px dashed var(--border-strong);
      color: var(--text-muted); font-size: 12px; font-weight: 600;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .trade-add:hover { border-color: var(--blue); color: var(--blue); }

    .doc-row {
      display: grid; grid-template-columns: auto 1fr auto; gap: 12px;
      align-items: center; padding: 12px;
      border: 1px solid var(--border); border-radius: var(--radius);
      margin-bottom: 8px;
    }
    .doc-row:hover { border-color: var(--blue); }
    .doc-icon-sm {
      width: 32px; height: 38px; border-radius: 5px;
      background: linear-gradient(135deg, var(--blue-pale), var(--blue-softer));
      color: var(--blue); display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 800;
    }
    .doc-row-title { font-weight: 700; font-size: 13px; }
    .doc-row-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .doc-status { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; }
    .doc-status.ok { background: var(--green-bg); color: var(--green-dark); }
    .doc-status.expiring { background: var(--orange-bg); color: var(--orange); }

    /* ===== Toast ===== */
    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }
    .toast {
      background: var(--text); color: var(--surface);
      padding: 12px 18px; border-radius: var(--radius);
      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 10px;
      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);
    }
    .toast svg { width: 16px; height: 16px; color: var(--green); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
      .tb-nav { width: 100%; overflow-x: auto; }
      .wrap { padding: 20px 16px; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .pay-summary { grid-template-columns: 1fr; }
      .job { grid-template-columns: auto 1fr; gap: 12px; }
      .job-when, .job-actions { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; padding-right: 0; border-right: none; border-top: 1px solid var(--border); padding-top: 10px; }
      .prof-grid { grid-template-columns: 1fr; }
      .drawer { width: 100%; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Tenantory</div>
        <div class="tb-brand-sub">Vendor portal</div>
      </div>
    </div>
    <nav class="tb-nav">
      <a class="tb-nav-item active" data-panel="jobs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Jobs <span class="tb-nav-badge">4</span>
      </a>
      <a class="tb-nav-item" data-panel="schedule">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Schedule
      </a>
      <a class="tb-nav-item" data-panel="invoices">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
        Invoices <span class="tb-nav-badge" style="background:var(--green);">$1,820</span>
      </a>
      <a class="tb-nav-item" data-panel="profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profile
      </a>
    </nav>
    <div class="tb-right">
      <div class="tb-vendor">
        <div>
          <div class="tb-vendor-name">Joel Martinez</div>
          <div class="tb-vendor-sub">Joel's Plumbing &amp; HVAC</div>
        </div>
        <div class="tb-vendor-avatar">JM</div>
      </div>
    </div>
  </header>

  <main class="wrap">

    <!-- ========= JOBS ========= -->
    <section class="panel active" data-panel="jobs">

      <div class="page-head">
        <div class="page-head-text">
          <h1>Good morning, Joel.</h1>
          <p>You've got 4 active jobs across 3 properties. The Lee Drive faucet is your earliest visit today.</p>
        </div>
        <button class="btn btn-ghost" onclick="toast('Calendar synced')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Sync to Google Calendar
        </button>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <div class="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Active jobs
          </div>
          <div class="stat-value">4</div>
          <div class="stat-delta">2 today · 1 tomorrow · 1 this week</div>
        </div>
        <div class="stat">
          <div class="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Awaiting your accept
          </div>
          <div class="stat-value">1</div>
          <div class="stat-delta warn">Lakeside HOA · respond by 5pm</div>
        </div>
        <div class="stat">
          <div class="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Completed this month
          </div>
          <div class="stat-value">12</div>
          <div class="stat-delta up">+3 vs last month</div>
        </div>
        <div class="stat">
          <div class="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Pending payouts
          </div>
          <div class="stat-value">$1,820<small>.00</small></div>
          <div class="stat-delta">3 invoices · $1,420 in escrow</div>
        </div>
      </div>

      <!-- Today -->
      <div class="group-head">
        <div class="group-title">Today · Apr 15</div>
        <span class="group-count">2</span>
        <div class="group-line"></div>
      </div>

      <div class="job" onclick="openJob('lee-faucet')">
        <div class="job-priority high"></div>
        <div class="job-body">
          <div class="job-row1">
            <span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span>
            <span class="pri-pill high">High</span>
          </div>
          <div class="job-title">Leaky kitchen faucet · constant drip</div>
          <div class="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>908 Lee Dr NW · Room C kitchen</span>
            <span>Tenant: Maya Thompson</span>
          </div>
        </div>
        <div class="job-when">
          <div class="job-when-label">Today</div>
          <div class="job-when-time">2:00 PM</div>
          <div class="job-when-day">~1 hour</div>
        </div>
        <div class="job-actions">
          <span class="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Accepted</span>
          <button class="icon-btn" onclick="event.stopPropagation(); openJob('lee-faucet')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

      <div class="job" onclick="openJob('huntsmore-water')">
        <div class="job-priority urgent"></div>
        <div class="job-body">
          <div class="job-row1">
            <span class="ws-pill huntsmore"><span class="ws-pill-dot"></span>Huntsmore</span>
            <span class="pri-pill urgent">Urgent</span>
          </div>
          <div class="job-title">No hot water · entire unit</div>
          <div class="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>2104 Bankhead Pkwy · Unit 3</span>
            <span>Tenant: Aaron Park</span>
            <span style="color:var(--red);font-weight:700;">Reported 1.5 hrs ago</span>
          </div>
        </div>
        <div class="job-when">
          <div class="job-when-label">Today</div>
          <div class="job-when-time">5:30 PM</div>
          <div class="job-when-day">~2 hours</div>
        </div>
        <div class="job-actions">
          <span class="job-status scheduled"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Scheduled</span>
          <button class="icon-btn" onclick="event.stopPropagation(); openJob('huntsmore-water')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

      <!-- Awaiting accept -->
      <div class="group-head">
        <div class="group-title">Awaiting your accept</div>
        <span class="group-count">1</span>
        <div class="group-line"></div>
      </div>

      <div class="job" onclick="openJob('lakeside-disposal')">
        <div class="job-priority normal"></div>
        <div class="job-body">
          <div class="job-row1">
            <span class="ws-pill lakeside"><span class="ws-pill-dot"></span>Lakeside HOA</span>
            <span class="pri-pill normal">Normal</span>
          </div>
          <div class="job-title">Garbage disposal jammed</div>
          <div class="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>1402 Crescent Ln · Unit 12B</span>
            <span>Tenant: Priya Iyer</span>
            <span>Available: weekday afternoons</span>
          </div>
        </div>
        <div class="job-when">
          <div class="job-when-label">Respond by</div>
          <div class="job-when-time" style="color:var(--orange);">5:00 PM</div>
          <div class="job-when-day">today</div>
        </div>
        <div class="job-actions">
          <button class="btn btn-green" onclick="event.stopPropagation(); acceptJob(this)" style="padding:7px 14px;font-size:12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Accept
          </button>
          <button class="btn btn-ghost" onclick="event.stopPropagation(); declineJob(this)" style="padding:7px 14px;font-size:12px;">Decline</button>
        </div>
      </div>

      <!-- This week -->
      <div class="group-head">
        <div class="group-title">This week</div>
        <span class="group-count">1</span>
        <div class="group-line"></div>
      </div>

      <div class="job" onclick="openJob('bb-toilet')">
        <div class="job-priority normal"></div>
        <div class="job-body">
          <div class="job-row1">
            <span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span>
            <span class="pri-pill normal">Normal</span>
          </div>
          <div class="job-title">Slow-flushing toilet · master bathroom</div>
          <div class="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>3026 Turf Ave NW · main bathroom</span>
            <span>Tenant: Diego Ortiz</span>
          </div>
        </div>
        <div class="job-when">
          <div class="job-when-label">Thu Apr 17</div>
          <div class="job-when-time">10:00 AM</div>
          <div class="job-when-day">~45 min</div>
        </div>
        <div class="job-actions">
          <span class="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Accepted</span>
          <button class="icon-btn" onclick="event.stopPropagation(); openJob('bb-toilet')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

    </section>

    <!-- ========= SCHEDULE ========= -->
    <section class="panel" data-panel="schedule">
      <div class="page-head">
        <div class="page-head-text">
          <h1>This week's schedule</h1>
          <p>Your jobs across all workspaces. Tap any block to see the job details.</p>
        </div>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;">
        <div style="display:grid;grid-template-columns:60px repeat(7, 1fr);gap:8px;font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-align:center;margin-bottom:10px;">
          <div></div>
          <div>Mon 14</div><div style="color:var(--blue);">Tue 15</div><div>Wed 16</div><div>Thu 17</div><div>Fri 18</div><div>Sat 19</div><div>Sun 20</div>
        </div>
        <div style="display:grid;grid-template-columns:60px repeat(7, 1fr);gap:8px;align-items:start;">
          <div style="font-size:11px;color:var(--text-faint);font-variant-numeric:tabular-nums;text-align:right;padding-right:8px;line-height:60px;">9 AM</div>
          <div></div><div></div><div></div>
          <div style="background:var(--blue-pale);border-left:3px solid var(--blue);border-radius:6px;padding:6px 8px;height:60px;font-size:11px;color:var(--blue);font-weight:600;line-height:1.3;">10:00<br><span style="color:var(--text);font-weight:700;">Toilet · Black Bear</span></div>
          <div></div><div></div><div></div>

          <div style="font-size:11px;color:var(--text-faint);font-variant-numeric:tabular-nums;text-align:right;padding-right:8px;line-height:60px;">12 PM</div>
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div>

          <div style="font-size:11px;color:var(--text-faint);font-variant-numeric:tabular-nums;text-align:right;padding-right:8px;line-height:60px;">2 PM</div>
          <div></div>
          <div style="background:var(--orange-bg);border-left:3px solid var(--orange);border-radius:6px;padding:6px 8px;height:80px;font-size:11px;color:var(--orange);font-weight:600;line-height:1.3;">2:00<br><span style="color:var(--text);font-weight:700;">Faucet · Black Bear</span><br><span style="color:var(--text-muted);font-weight:500;">Lee Dr</span></div>
          <div></div><div></div><div></div><div></div><div></div>

          <div style="font-size:11px;color:var(--text-faint);font-variant-numeric:tabular-nums;text-align:right;padding-right:8px;line-height:60px;">5 PM</div>
          <div></div>
          <div style="background:var(--red-bg);border-left:3px solid var(--red);border-radius:6px;padding:6px 8px;height:100px;font-size:11px;color:var(--red);font-weight:700;line-height:1.3;">5:30 URGENT<br><span style="color:var(--text);font-weight:700;">Hot water · Huntsmore</span><br><span style="color:var(--text-muted);font-weight:500;">2104 Bankhead</span></div>
          <div></div><div></div><div></div><div></div><div></div>
        </div>

        <div style="margin-top:24px;padding-top:18px;border-top:1px solid var(--border);font-size:13px;color:var(--text-muted);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <span>Total this week: <strong style="color:var(--text);">~5.5 hours scheduled</strong> · <strong style="color:var(--green-dark);">$650 estimated</strong></span>
          <a class="btn btn-ghost" href="#" onclick="event.preventDefault(); toast('Calendar exported as iCal')" style="padding:7px 14px;font-size:12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export iCal
          </a>
        </div>
      </div>
    </section>

    <!-- ========= INVOICES ========= -->
    <section class="panel" data-panel="invoices">
      <div class="page-head">
        <div class="page-head-text">
          <h1>Invoices &amp; payouts</h1>
          <p>Submit invoices from any completed job. Payouts hit your bank in 1–2 business days after the operator approves.</p>
        </div>
        <button class="btn btn-primary" onclick="toast('Drafting invoice from completed jobs')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New invoice
        </button>
      </div>

      <div class="pay-summary">
        <div class="pay-card featured">
          <div class="pay-card-label">Pending payout</div>
          <div class="pay-card-value">$1,820<small style="font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;">.00</small></div>
          <div class="pay-card-sub">3 invoices · arrives 2–3 days after approval</div>
        </div>
        <div class="pay-card">
          <div class="pay-card-label">Paid this month</div>
          <div class="pay-card-value">$3,440<small style="font-size:13px;font-weight:500;">.00</small></div>
          <div class="pay-card-sub">9 invoices · paid out via ACH</div>
        </div>
        <div class="pay-card">
          <div class="pay-card-label">2026 YTD · 1099</div>
          <div class="pay-card-value">$11,830<small style="font-size:13px;font-weight:500;">.00</small></div>
          <div class="pay-card-sub">W-9 on file · 1099-NEC issues Jan 31, 2027</div>
        </div>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Workspace</th>
              <th>Job</th>
              <th>Submitted</th>
              <th style="text-align:right;">Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>JM-0142</strong></td>
              <td><span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span></td>
              <td>Bedroom outlet · GFCI reset · Mar 22</td>
              <td>Apr 12</td>
              <td class="table-amt" style="text-align:right;">$185.00</td>
              <td><span class="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Approved</span></td>
              <td><button class="icon-btn" onclick="toast('Invoice PDF downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0141</strong></td>
              <td><span class="ws-pill huntsmore"><span class="ws-pill-dot"></span>Huntsmore</span></td>
              <td>Water heater anode replacement · Apr 8</td>
              <td>Apr 10</td>
              <td class="table-amt" style="text-align:right;">$640.00</td>
              <td><span class="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Awaiting approval</span></td>
              <td><button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0140</strong></td>
              <td><span class="ws-pill lakeside"><span class="ws-pill-dot"></span>Lakeside HOA</span></td>
              <td>Dishwasher replacement (parts + labor) · Apr 4</td>
              <td>Apr 5</td>
              <td class="table-amt" style="text-align:right;">$995.00</td>
              <td><span class="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Awaiting approval</span></td>
              <td><button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0139</strong></td>
              <td><span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span></td>
              <td>Annual HVAC service · Mar 28</td>
              <td>Mar 30</td>
              <td class="table-amt" style="text-align:right;">$425.00</td>
              <td><span class="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Paid Apr 2</span></td>
              <td><button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0138</strong></td>
              <td><span class="ws-pill huntsmore"><span class="ws-pill-dot"></span>Huntsmore</span></td>
              <td>Sink P-trap leak · Unit 7 · Mar 24</td>
              <td>Mar 25</td>
              <td class="table-amt" style="text-align:right;">$220.00</td>
              <td><span class="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Paid Mar 28</span></td>
              <td><button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ========= PROFILE ========= -->
    <section class="panel" data-panel="profile">
      <div class="page-head">
        <div class="page-head-text">
          <h1>Your business profile</h1>
          <p>Visible to operators when they assign you a job. Keep insurance and W-9 current to stay eligible.</p>
        </div>
      </div>

      <div class="prof-grid">
        <div class="prof-card">
          <div class="prof-card-title">Trade specialties</div>
          <div class="trade-pills">
            <span class="trade-pill">Plumbing <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
            <span class="trade-pill">HVAC <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
            <span class="trade-pill">Water heaters <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
            <span class="trade-pill">Garbage disposals <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
            <button class="trade-add">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add
            </button>
          </div>

          <div style="margin-top:18px;font-size:13px;color:var(--text-muted);">
            <div class="det-row"><span class="det-key">Service area</span><span class="det-val">Madison County, AL · 25 mi radius</span></div>
            <div class="det-row"><span class="det-key">Hourly rate</span><span class="det-val">$95/hr · 1-hr min</span></div>
            <div class="det-row"><span class="det-key">After hours</span><span class="det-val">$165/hr · weekends, holidays, &gt; 7pm</span></div>
            <div class="det-row"><span class="det-key">Response SLA</span><span class="det-val">Same day for urgent · 48hr standard</span></div>
          </div>
        </div>

        <div class="prof-card">
          <div class="prof-card-title">Documents on file</div>
          <div class="doc-row">
            <div class="doc-icon-sm">PDF</div>
            <div>
              <div class="doc-row-title">W-9 (Form W-9)</div>
              <div class="doc-row-meta">Updated Jan 2026 · Joel's Plumbing &amp; HVAC LLC · EIN ••••3204</div>
            </div>
            <span class="doc-status ok">Verified</span>
          </div>
          <div class="doc-row">
            <div class="doc-icon-sm">PDF</div>
            <div>
              <div class="doc-row-title">General liability insurance</div>
              <div class="doc-row-meta">$1M/$2M · Geico · expires <strong>Jul 14, 2026</strong></div>
            </div>
            <span class="doc-status ok">Active</span>
          </div>
          <div class="doc-row">
            <div class="doc-icon-sm">PDF</div>
            <div>
              <div class="doc-row-title">Workers comp certificate</div>
              <div class="doc-row-meta">Alabama state · expires <strong>Jun 1, 2026</strong></div>
            </div>
            <span class="doc-status expiring">Expires in 47d</span>
          </div>
          <div class="doc-row">
            <div class="doc-icon-sm">PDF</div>
            <div>
              <div class="doc-row-title">Plumbing license</div>
              <div class="doc-row-meta">Alabama Master Plumber #PM-08214 · expires Dec 2027</div>
            </div>
            <span class="doc-status ok">Active</span>
          </div>
        </div>

        <div class="prof-card" style="grid-column: 1 / -1;">
          <div class="prof-card-title">Workspaces you serve</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <div style="padding:14px;border:1px solid var(--border);border-radius:var(--radius);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span>
                <span style="font-size:11px;color:var(--text-muted);">Since Jan 2025</span>
              </div>
              <div style="font-weight:700;font-size:14px;margin-bottom:2px;">Black Bear Rentals</div>
              <div style="font-size:12px;color:var(--text-muted);">Harrison Cooper · 7 properties</div>
              <div style="font-size:12px;color:var(--green-dark);font-weight:700;margin-top:8px;">★ 4.9 · 22 jobs · $5,420 YTD</div>
            </div>
            <div style="padding:14px;border:1px solid var(--border);border-radius:var(--radius);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="ws-pill huntsmore"><span class="ws-pill-dot"></span>Huntsmore</span>
                <span style="font-size:11px;color:var(--text-muted);">Since Sep 2024</span>
              </div>
              <div style="font-weight:700;font-size:14px;margin-bottom:2px;">Huntsmore Apartments</div>
              <div style="font-size:12px;color:var(--text-muted);">Sara Diallo · 28 units</div>
              <div style="font-size:12px;color:var(--green-dark);font-weight:700;margin-top:8px;">★ 4.8 · 18 jobs · $4,210 YTD</div>
            </div>
            <div style="padding:14px;border:1px solid var(--border);border-radius:var(--radius);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="ws-pill lakeside"><span class="ws-pill-dot"></span>Lakeside HOA</span>
                <span style="font-size:11px;color:var(--text-muted);">Since Mar 2025</span>
              </div>
              <div style="font-weight:700;font-size:14px;margin-bottom:2px;">Lakeside Condo HOA</div>
              <div style="font-size:12px;color:var(--text-muted);">Marcus Webb · 60 units</div>
              <div style="font-size:12px;color:var(--green-dark);font-weight:700;margin-top:8px;">★ 5.0 · 6 jobs · $2,200 YTD</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- ===== Job drawer ===== -->
  <div class="drawer-bg" id="jobDrawer" onclick="if(event.target===this)closeJob()">
    <div class="drawer">
      <div class="drawer-head">
        <div class="drawer-head-text">
          <h2 id="drawerTitle">Leaky kitchen faucet · constant drip</h2>
          <div class="drawer-head-sub" id="drawerSub">
            <span class="ws-pill bb"><span class="ws-pill-dot"></span>Black Bear</span>
            · 908 Lee Dr NW · Room C kitchen
          </div>
        </div>
        <button class="drawer-close" onclick="closeJob()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="drawer-body">
        <div class="det-row"><span class="det-key">Status</span><span class="det-val"><span class="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Accepted</span></span></div>
        <div class="det-row"><span class="det-key">Priority</span><span class="det-val"><span class="pri-pill high">High</span></span></div>
        <div class="det-row"><span class="det-key">Tenant</span><span class="det-val">Maya Thompson · (256) 555-0184</span></div>
        <div class="det-row"><span class="det-key">Scheduled</span><span class="det-val">Today, Apr 15 · 2:00 PM</span></div>
        <div class="det-row"><span class="det-key">Access</span><span class="det-val">Tenant home · key in lockbox 4271 if needed</span></div>
        <div class="det-row"><span class="det-key">Operator</span><span class="det-val">Harrison Cooper · (256) 555-0102</span></div>

        <div class="det-section">
          <div class="det-section-title">Description from tenant</div>
          <p style="font-size:13.5px;color:var(--text);line-height:1.6;">
            "Kitchen faucet has been dripping constantly for about 4 days, getting worse. Both hot and cold sides drip even when fully closed. I tried tightening the handle but it didn't help. Probably needs a new cartridge. Photos attached."
          </p>
        </div>

        <div class="det-section">
          <div class="det-section-title">Photos (3)</div>
          <div class="det-photo-grid">
            <div class="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div class="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div class="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><polyline points="21 15 16 10 5 21"/></svg></div>
          </div>
        </div>

        <div class="det-section">
          <div class="det-section-title">Conversation</div>
          <div class="det-thread">
            <div class="det-msg">
              <div class="det-msg-avatar tenant">MT</div>
              <div class="det-msg-body">
                <div class="det-msg-head"><span class="det-msg-name">Maya Thompson · Tenant</span><span class="det-msg-time">Apr 10, 9:14am</span></div>
                <div class="det-msg-text">Submitted with photos — constant dripping from both knobs.</div>
              </div>
            </div>
            <div class="det-msg">
              <div class="det-msg-avatar operator">HC</div>
              <div class="det-msg-body">
                <div class="det-msg-head"><span class="det-msg-name">Harrison Cooper · Operator</span><span class="det-msg-time">Apr 10, 10:02am</span></div>
                <div class="det-msg-text">Joel — likely a Moen cartridge. Coordinate directly with Maya, she said weekday afternoons work. Approved up to $250 parts &amp; labor.</div>
              </div>
            </div>
            <div class="det-msg">
              <div class="det-msg-avatar you">JM</div>
              <div class="det-msg-body">
                <div class="det-msg-head"><span class="det-msg-name">You</span><span class="det-msg-time">Apr 11, 8:30am</span></div>
                <div class="det-msg-text">Will be there Tue Apr 15 at 2pm. Bringing 2 cartridge options just in case.</div>
              </div>
            </div>
          </div>
          <div class="det-reply">
            <input type="text" placeholder="Reply to Maya and Harrison...">
            <button class="btn btn-primary" onclick="toast('Message sent')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <div class="det-section">
          <div class="det-section-title">Time &amp; parts</div>
          <div class="time-log">
            <div class="time-log-row"><span style="color:var(--text-muted);">Standard rate</span><span style="font-weight:700;">$95.00/hr</span></div>
            <div class="time-log-row"><span>Drive time (15 min)</span><span style="font-weight:700;font-variant-numeric:tabular-nums;">0.25 hr</span></div>
            <div class="time-log-row"><span>Labor logged</span><span style="font-weight:700;font-variant-numeric:tabular-nums;color:var(--text-muted);">— start at job site</span></div>
            <div class="time-log-row"><span>Parts (Moen 1225 cartridge)</span><span style="font-weight:700;font-variant-numeric:tabular-nums;">$28.50</span></div>
            <div class="time-log-add">
              <input class="time-input" type="text" placeholder="0.5 hr">
              <input class="time-input" style="width:120px;" type="text" placeholder="$ part">
              <button class="btn btn-ghost" style="padding:7px 12px;font-size:12px;" onclick="toast('Time logged')">Add line</button>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-foot">
        <button class="btn btn-ghost" onclick="closeJob()">Close</button>
        <button class="btn btn-pink" onclick="toast('Started timer'); closeJob();">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start timer
        </button>
        <button class="btn btn-green" onclick="toast('Marked complete · invoice drafted'); closeJob();">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Complete &amp; invoice
        </button>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
