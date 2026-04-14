"use client";

// Mock ported from ~/Desktop/tenantory/vendor.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Tenantory Flagship tokens (vendor sees Tenantory brand since they work across workspaces) */\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --gold-bg: rgba(245,166,35,0.12);\n      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --red-bg: rgba(214,69,69,0.1);\n      --orange: #ea8c3a; --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff; --purple-bg: rgba(124,77,255,0.12);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Topbar (Tenantory branded — vendor works across workspaces) ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 36px; height: 36px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; margin-top: 1px; }\n\n    .tb-nav { display: flex; gap: 2px; }\n    .tb-nav-item {\n      padding: 9px 16px; border-radius: 100px; font-size: 13px; font-weight: 600;\n      color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px;\n      transition: all 0.15s ease; position: relative;\n    }\n    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.08); }\n    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.14); }\n    .tb-nav-item svg { width: 15px; height: 15px; }\n    .tb-nav-badge {\n      background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 100px;\n      margin-left: 4px;\n    }\n\n    .tb-right { display: flex; align-items: center; gap: 12px; }\n    .tb-vendor {\n      display: flex; align-items: center; gap: 10px;\n      padding: 4px 4px 4px 14px; border-radius: 100px;\n      background: rgba(255,255,255,0.08);\n    }\n    .tb-vendor-name { font-size: 13px; font-weight: 700; color: #fff; }\n    .tb-vendor-sub { font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 1px; }\n    .tb-vendor-avatar {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--gold), var(--orange));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px;\n    }\n\n    /* ===== Wrap ===== */\n    .wrap { max-width: 1180px; margin: 0 auto; padding: 28px 32px 60px; }\n\n    .panel { display: none; }\n    .panel.active { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n\n    .page-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      margin-bottom: 24px; gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-text h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-text p { color: var(--text-muted); font-size: 14px; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }\n    .btn svg { width: 14px; height: 14px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-green { background: var(--green); color: #fff; }\n    .btn-green:hover { background: var(--green-dark); transform: translateY(-1px); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); }\n\n    /* ===== Stats strip ===== */\n    .stats {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n      margin-bottom: 20px;\n    }\n    .stat {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n      transition: all 0.15s ease;\n    }\n    .stat:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;\n      display: flex; align-items: center; gap: 8px;\n    }\n    .stat-label svg { width: 14px; height: 14px; }\n    .stat-value { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; color: var(--text); }\n    .stat-value small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }\n    .stat-delta { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n    .stat-delta.up { color: var(--green-dark); font-weight: 600; }\n    .stat-delta.warn { color: var(--orange); font-weight: 600; }\n\n    /* ===== Job grouping ===== */\n    .group-head {\n      display: flex; align-items: center; gap: 12px; margin: 22px 0 12px;\n    }\n    .group-head:first-of-type { margin-top: 0; }\n    .group-title { font-size: 12px; font-weight: 800; color: var(--text); text-transform: uppercase; letter-spacing: 0.12em; }\n    .group-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 2px 9px; border-radius: 100px; font-size: 11px; font-weight: 700;\n    }\n    .group-line { flex: 1; height: 1px; background: var(--border); }\n\n    /* ===== Job card ===== */\n    .job {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n      margin-bottom: 10px; cursor: pointer;\n      display: grid; grid-template-columns: auto 1fr auto auto; gap: 16px; align-items: center;\n      transition: all 0.15s ease;\n    }\n    .job:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); transform: translateY(-1px); }\n    .job-priority {\n      width: 4px; align-self: stretch; border-radius: 4px;\n    }\n    .job-priority.urgent { background: var(--red); }\n    .job-priority.high { background: var(--orange); }\n    .job-priority.normal { background: var(--blue); }\n    .job-priority.low { background: var(--text-faint); }\n\n    .job-body { min-width: 0; }\n    .job-row1 { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }\n    .ws-pill {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 3px 8px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.04em;\n    }\n    .ws-pill.bb { background: rgba(30,111,71,0.12); color: #144d31; }\n    .ws-pill.lakeside { background: rgba(124,77,255,0.12); color: #5a36c2; }\n    .ws-pill.huntsmore { background: rgba(245,166,35,0.16); color: #a96f10; }\n    .ws-pill-dot { width: 6px; height: 6px; border-radius: 50%; }\n    .ws-pill.bb .ws-pill-dot { background: #1e6f47; }\n    .ws-pill.lakeside .ws-pill-dot { background: #7c4dff; }\n    .ws-pill.huntsmore .ws-pill-dot { background: #f5a623; }\n\n    .pri-pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 3px 9px; border-radius: 100px;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;\n    }\n    .pri-pill.urgent { background: var(--red-bg); color: var(--red); }\n    .pri-pill.high { background: var(--orange-bg); color: var(--orange); }\n    .pri-pill.normal { background: var(--blue-pale); color: var(--blue); }\n    .pri-pill.low { background: var(--surface-alt); color: var(--text-muted); }\n\n    .job-title { font-weight: 700; font-size: 15px; color: var(--text); margin-bottom: 4px; }\n    .job-meta { font-size: 12.5px; color: var(--text-muted); display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }\n    .job-meta svg { width: 12px; height: 12px; vertical-align: -1px; margin-right: 4px; color: var(--text-faint); }\n\n    .job-when {\n      text-align: right; padding-right: 14px;\n      border-right: 1px solid var(--border); align-self: stretch;\n      display: flex; flex-direction: column; justify-content: center;\n    }\n    .job-when-label { font-size: 11px; color: var(--text-muted); font-weight: 600; }\n    .job-when-time { font-size: 14px; font-weight: 800; color: var(--text); margin-top: 2px; letter-spacing: -0.01em; }\n    .job-when-day { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    .job-actions { display: flex; gap: 8px; flex-shrink: 0; }\n    .job-status {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .job-status.new { background: var(--pink-bg); color: #c21a6a; }\n    .job-status.accepted { background: var(--blue-pale); color: var(--blue); }\n    .job-status.scheduled { background: var(--gold-bg); color: #a96f10; }\n    .job-status.in-progress { background: var(--orange-bg); color: var(--orange); }\n    .job-status.complete { background: var(--green-bg); color: var(--green-dark); }\n    .job-status svg { width: 11px; height: 11px; }\n    .icon-btn {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: inline-flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .icon-btn:hover { background: var(--blue-pale); color: var(--blue); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    /* ===== Invoices table ===== */\n    .table-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);\n    }\n    .table { width: 100%; border-collapse: collapse; font-size: 13px; }\n    .table th {\n      text-align: left; padding: 12px 16px; font-weight: 700;\n      color: var(--text-muted); font-size: 11px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .table td {\n      padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--text);\n    }\n    .table tr:last-child td { border-bottom: none; }\n    .table tr:hover td { background: var(--surface-subtle); }\n    .table-amt { font-weight: 700; font-variant-numeric: tabular-nums; }\n\n    /* ===== Invoice summary ===== */\n    .pay-summary {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n      margin-bottom: 18px;\n    }\n    .pay-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n    }\n    .pay-card.featured {\n      background: linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%);\n      color: #fff; border-color: transparent;\n    }\n    .pay-card-label {\n      font-size: 11px; font-weight: 700; text-transform: uppercase;\n      letter-spacing: 0.1em; margin-bottom: 8px;\n      color: var(--text-muted);\n    }\n    .pay-card.featured .pay-card-label { color: rgba(255,255,255,0.7); }\n    .pay-card-value { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }\n    .pay-card-sub { font-size: 12px; margin-top: 6px; color: var(--text-muted); }\n    .pay-card.featured .pay-card-sub { color: rgba(255,255,255,0.7); }\n\n    /* ===== Drawer ===== */\n    .drawer-bg {\n      position: fixed; inset: 0; background: rgba(20,32,74,0.45);\n      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;\n      z-index: 60; display: flex; justify-content: flex-end;\n    }\n    .drawer-bg.open { opacity: 1; pointer-events: auto; }\n    .drawer {\n      background: var(--surface); width: 540px; max-width: 100%;\n      height: 100%; overflow-y: auto;\n      transform: translateX(20px); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);\n      box-shadow: var(--shadow-lg);\n    }\n    .drawer-bg.open .drawer { transform: none; }\n    .drawer-head {\n      padding: 22px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      position: sticky; top: 0; background: var(--surface); z-index: 1;\n    }\n    .drawer-head-text { flex: 1; }\n    .drawer-head h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .drawer-head-sub { font-size: 13px; color: var(--text-muted); }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--red-bg); color: var(--red); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    .drawer-body { padding: 22px 24px; }\n\n    .det-row { display: grid; grid-template-columns: 110px 1fr; gap: 12px; padding: 8px 0; font-size: 13px; }\n    .det-key { color: var(--text-muted); font-weight: 600; }\n    .det-val { color: var(--text); }\n    .det-val.muted { color: var(--text-muted); }\n\n    .det-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }\n    .det-section-title { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }\n\n    .det-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n    .det-photo {\n      aspect-ratio: 1; border-radius: var(--radius);\n      background: linear-gradient(135deg, var(--blue-pale), var(--surface-alt));\n      border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); font-size: 11px; font-weight: 600;\n    }\n    .det-photo svg { width: 24px; height: 24px; opacity: 0.5; }\n\n    .det-thread {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n    }\n    .det-msg { display: flex; gap: 10px; padding: 8px 0; font-size: 13px; }\n    .det-msg + .det-msg { border-top: 1px solid var(--border); margin-top: 4px; padding-top: 12px; }\n    .det-msg-avatar {\n      width: 28px; height: 28px; border-radius: 50%;\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 11px; flex-shrink: 0;\n    }\n    .det-msg-avatar.tenant { background: linear-gradient(135deg, var(--blue), var(--blue-bright)); }\n    .det-msg-avatar.operator { background: linear-gradient(135deg, var(--gold), var(--orange)); }\n    .det-msg-avatar.you { background: linear-gradient(135deg, var(--green), var(--green-dark)); }\n    .det-msg-body { flex: 1; }\n    .det-msg-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }\n    .det-msg-name { font-weight: 700; font-size: 12.5px; color: var(--text); }\n    .det-msg-time { font-size: 11px; color: var(--text-faint); }\n    .det-msg-text { color: var(--text); line-height: 1.5; }\n\n    .det-reply {\n      margin-top: 12px; display: flex; gap: 8px;\n    }\n    .det-reply input {\n      flex: 1; padding: 9px 12px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 13px; color: var(--text); outline: none;\n    }\n    .det-reply input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .det-reply .btn { padding: 9px 14px; }\n\n    .time-log {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n    }\n    .time-log-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; }\n    .time-log-row + .time-log-row { border-top: 1px solid var(--border); }\n    .time-log-add {\n      margin-top: 10px; display: flex; gap: 8px; align-items: center;\n    }\n    .time-input {\n      width: 80px; padding: 8px 10px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 13px; outline: none;\n    }\n    .time-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n\n    .drawer-foot {\n      padding: 16px 24px; border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; gap: 10px; justify-content: flex-end;\n      position: sticky; bottom: 0;\n    }\n\n    /* ===== Profile ===== */\n    .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n    .prof-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n    }\n    .prof-card-title { font-size: 15px; font-weight: 800; margin-bottom: 14px; }\n\n    .trade-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }\n    .trade-pill {\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 600;\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    .trade-pill svg { width: 11px; height: 11px; cursor: pointer; opacity: 0.6; }\n    .trade-pill svg:hover { opacity: 1; }\n    .trade-add {\n      padding: 5px 12px; border-radius: 100px;\n      background: var(--surface-alt); border: 1px dashed var(--border-strong);\n      color: var(--text-muted); font-size: 12px; font-weight: 600;\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    .trade-add:hover { border-color: var(--blue); color: var(--blue); }\n\n    .doc-row {\n      display: grid; grid-template-columns: auto 1fr auto; gap: 12px;\n      align-items: center; padding: 12px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      margin-bottom: 8px;\n    }\n    .doc-row:hover { border-color: var(--blue); }\n    .doc-icon-sm {\n      width: 32px; height: 38px; border-radius: 5px;\n      background: linear-gradient(135deg, var(--blue-pale), var(--blue-softer));\n      color: var(--blue); display: flex; align-items: center; justify-content: center;\n      font-size: 9px; font-weight: 800;\n    }\n    .doc-row-title { font-weight: 700; font-size: 13px; }\n    .doc-row-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .doc-status { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 100px; }\n    .doc-status.ok { background: var(--green-bg); color: var(--green-dark); }\n    .doc-status.expiring { background: var(--orange-bg); color: var(--orange); }\n\n    /* ===== Toast ===== */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--green); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }\n      .tb-nav { width: 100%; overflow-x: auto; }\n      .wrap { padding: 20px 16px; }\n      .stats { grid-template-columns: repeat(2, 1fr); }\n      .pay-summary { grid-template-columns: 1fr; }\n      .job { grid-template-columns: auto 1fr; gap: 12px; }\n      .job-when, .job-actions { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; padding-right: 0; border-right: none; border-top: 1px solid var(--border); padding-top: 10px; }\n      .prof-grid { grid-template-columns: 1fr; }\n      .drawer { width: 100%; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Tenantory</div>
        <div className="tb-brand-sub">Vendor portal</div>
      </div>
    </div>
    <nav className="tb-nav">
      <a className="tb-nav-item active" data-panel="jobs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        Jobs <span className="tb-nav-badge">4</span>
      </a>
      <a className="tb-nav-item" data-panel="schedule">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        Schedule
      </a>
      <a className="tb-nav-item" data-panel="invoices">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>
        Invoices <span className="tb-nav-badge" style={{background: "var(--green)"}}>$1,820</span>
      </a>
      <a className="tb-nav-item" data-panel="profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        Profile
      </a>
    </nav>
    <div className="tb-right">
      <div className="tb-vendor">
        <div>
          <div className="tb-vendor-name">Joel Martinez</div>
          <div className="tb-vendor-sub">Joel's Plumbing &amp; HVAC</div>
        </div>
        <div className="tb-vendor-avatar">JM</div>
      </div>
    </div>
  </header>

  <main className="wrap">

    
    <section className="panel active" data-panel="jobs">

      <div className="page-head">
        <div className="page-head-text">
          <h1>Good morning, Joel.</h1>
          <p>You've got 4 active jobs across 3 properties. The Lee Drive faucet is your earliest visit today.</p>
        </div>
        <button className="btn btn-ghost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          Sync to Google Calendar
        </button>
      </div>

      
      <div className="stats">
        <div className="stat">
          <div className="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            Active jobs
          </div>
          <div className="stat-value">4</div>
          <div className="stat-delta">2 today · 1 tomorrow · 1 this week</div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            Awaiting your accept
          </div>
          <div className="stat-value">1</div>
          <div className="stat-delta warn">Lakeside HOA · respond by 5pm</div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Completed this month
          </div>
          <div className="stat-value">12</div>
          <div className="stat-delta up">+3 vs last month</div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Pending payouts
          </div>
          <div className="stat-value">$1,820<small>.00</small></div>
          <div className="stat-delta">3 invoices · $1,420 in escrow</div>
        </div>
      </div>

      
      <div className="group-head">
        <div className="group-title">Today · Apr 15</div>
        <span className="group-count">2</span>
        <div className="group-line" />
      </div>

      <div className="job">
        <div className="job-priority high" />
        <div className="job-body">
          <div className="job-row1">
            <span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span>
            <span className="pri-pill high">High</span>
          </div>
          <div className="job-title">Leaky kitchen faucet · constant drip</div>
          <div className="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>908 Lee Dr NW · Room C kitchen</span>
            <span>Tenant: Maya Thompson</span>
          </div>
        </div>
        <div className="job-when">
          <div className="job-when-label">Today</div>
          <div className="job-when-time">2:00 PM</div>
          <div className="job-when-day">~1 hour</div>
        </div>
        <div className="job-actions">
          <span className="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Accepted</span>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
      </div>

      <div className="job">
        <div className="job-priority urgent" />
        <div className="job-body">
          <div className="job-row1">
            <span className="ws-pill huntsmore"><span className="ws-pill-dot" />Huntsmore</span>
            <span className="pri-pill urgent">Urgent</span>
          </div>
          <div className="job-title">No hot water · entire unit</div>
          <div className="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>2104 Bankhead Pkwy · Unit 3</span>
            <span>Tenant: Aaron Park</span>
            <span style={{color: "var(--red)", fontWeight: "700"}}>Reported 1.5 hrs ago</span>
          </div>
        </div>
        <div className="job-when">
          <div className="job-when-label">Today</div>
          <div className="job-when-time">5:30 PM</div>
          <div className="job-when-day">~2 hours</div>
        </div>
        <div className="job-actions">
          <span className="job-status scheduled"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> Scheduled</span>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
      </div>

      
      <div className="group-head">
        <div className="group-title">Awaiting your accept</div>
        <span className="group-count">1</span>
        <div className="group-line" />
      </div>

      <div className="job">
        <div className="job-priority normal" />
        <div className="job-body">
          <div className="job-row1">
            <span className="ws-pill lakeside"><span className="ws-pill-dot" />Lakeside HOA</span>
            <span className="pri-pill normal">Normal</span>
          </div>
          <div className="job-title">Garbage disposal jammed</div>
          <div className="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>1402 Crescent Ln · Unit 12B</span>
            <span>Tenant: Priya Iyer</span>
            <span>Available: weekday afternoons</span>
          </div>
        </div>
        <div className="job-when">
          <div className="job-when-label">Respond by</div>
          <div className="job-when-time" style={{color: "var(--orange)"}}>5:00 PM</div>
          <div className="job-when-day">today</div>
        </div>
        <div className="job-actions">
          <button className="btn btn-green" style={{padding: "7px 14px", fontSize: "12px"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Accept
          </button>
          <button className="btn btn-ghost" style={{padding: "7px 14px", fontSize: "12px"}}>Decline</button>
        </div>
      </div>

      
      <div className="group-head">
        <div className="group-title">This week</div>
        <span className="group-count">1</span>
        <div className="group-line" />
      </div>

      <div className="job">
        <div className="job-priority normal" />
        <div className="job-body">
          <div className="job-row1">
            <span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span>
            <span className="pri-pill normal">Normal</span>
          </div>
          <div className="job-title">Slow-flushing toilet · master bathroom</div>
          <div className="job-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>3026 Turf Ave NW · main bathroom</span>
            <span>Tenant: Diego Ortiz</span>
          </div>
        </div>
        <div className="job-when">
          <div className="job-when-label">Thu Apr 17</div>
          <div className="job-when-time">10:00 AM</div>
          <div className="job-when-day">~45 min</div>
        </div>
        <div className="job-actions">
          <span className="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Accepted</span>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
      </div>

    </section>

    
    <section className="panel" data-panel="schedule">
      <div className="page-head">
        <div className="page-head-text">
          <h1>This week's schedule</h1>
          <p>Your jobs across all workspaces. Tap any block to see the job details.</p>
        </div>
      </div>

      <div style={{background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px"}}>
        <div style={{display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: "8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: "10px"}}>
          <div />
          <div>Mon 14</div><div style={{color: "var(--blue)"}}>Tue 15</div><div>Wed 16</div><div>Thu 17</div><div>Fri 18</div><div>Sat 19</div><div>Sun 20</div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: "8px", alignItems: "start"}}>
          <div style={{fontSize: "11px", color: "var(--text-faint)", fontVariantNumeric: "tabular-nums", textAlign: "right", paddingRight: "8px", lineHeight: "60px"}}>9 AM</div>
          <div /><div /><div />
          <div style={{background: "var(--blue-pale)", borderLeft: "3px solid var(--blue)", borderRadius: "6px", padding: "6px 8px", height: "60px", fontSize: "11px", color: "var(--blue)", fontWeight: "600", lineHeight: "1.3"}}>10:00<br /><span style={{color: "var(--text)", fontWeight: "700"}}>Toilet · Black Bear</span></div>
          <div /><div /><div />

          <div style={{fontSize: "11px", color: "var(--text-faint)", fontVariantNumeric: "tabular-nums", textAlign: "right", paddingRight: "8px", lineHeight: "60px"}}>12 PM</div>
          <div /><div /><div /><div /><div /><div /><div />

          <div style={{fontSize: "11px", color: "var(--text-faint)", fontVariantNumeric: "tabular-nums", textAlign: "right", paddingRight: "8px", lineHeight: "60px"}}>2 PM</div>
          <div />
          <div style={{background: "var(--orange-bg)", borderLeft: "3px solid var(--orange)", borderRadius: "6px", padding: "6px 8px", height: "80px", fontSize: "11px", color: "var(--orange)", fontWeight: "600", lineHeight: "1.3"}}>2:00<br /><span style={{color: "var(--text)", fontWeight: "700"}}>Faucet · Black Bear</span><br /><span style={{color: "var(--text-muted)", fontWeight: "500"}}>Lee Dr</span></div>
          <div /><div /><div /><div /><div />

          <div style={{fontSize: "11px", color: "var(--text-faint)", fontVariantNumeric: "tabular-nums", textAlign: "right", paddingRight: "8px", lineHeight: "60px"}}>5 PM</div>
          <div />
          <div style={{background: "var(--red-bg)", borderLeft: "3px solid var(--red)", borderRadius: "6px", padding: "6px 8px", height: "100px", fontSize: "11px", color: "var(--red)", fontWeight: "700", lineHeight: "1.3"}}>5:30 URGENT<br /><span style={{color: "var(--text)", fontWeight: "700"}}>Hot water · Huntsmore</span><br /><span style={{color: "var(--text-muted)", fontWeight: "500"}}>2104 Bankhead</span></div>
          <div /><div /><div /><div /><div />
        </div>

        <div style={{marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border)", fontSize: "13px", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px"}}>
          <span>Total this week: <strong style={{color: "var(--text)"}}>~5.5 hours scheduled</strong> · <strong style={{color: "var(--green-dark)"}}>$650 estimated</strong></span>
          <a className="btn btn-ghost" href="#" style={{padding: "7px 14px", fontSize: "12px"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export iCal
          </a>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="invoices">
      <div className="page-head">
        <div className="page-head-text">
          <h1>Invoices &amp; payouts</h1>
          <p>Submit invoices from any completed job. Payouts hit your bank in 1–2 business days after the operator approves.</p>
        </div>
        <button className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New invoice
        </button>
      </div>

      <div className="pay-summary">
        <div className="pay-card featured">
          <div className="pay-card-label">Pending payout</div>
          <div className="pay-card-value">$1,820<small style={{fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "500"}}>.00</small></div>
          <div className="pay-card-sub">3 invoices · arrives 2–3 days after approval</div>
        </div>
        <div className="pay-card">
          <div className="pay-card-label">Paid this month</div>
          <div className="pay-card-value">$3,440<small style={{fontSize: "13px", fontWeight: "500"}}>.00</small></div>
          <div className="pay-card-sub">9 invoices · paid out via ACH</div>
        </div>
        <div className="pay-card">
          <div className="pay-card-label">2026 YTD · 1099</div>
          <div className="pay-card-value">$11,830<small style={{fontSize: "13px", fontWeight: "500"}}>.00</small></div>
          <div className="pay-card-sub">W-9 on file · 1099-NEC issues Jan 31, 2027</div>
        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Workspace</th>
              <th>Job</th>
              <th>Submitted</th>
              <th style={{textAlign: "right"}}>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>JM-0142</strong></td>
              <td><span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span></td>
              <td>Bedroom outlet · GFCI reset · Mar 22</td>
              <td>Apr 12</td>
              <td className="table-amt" style={{textAlign: "right"}}>$185.00</td>
              <td><span className="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Approved</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0141</strong></td>
              <td><span className="ws-pill huntsmore"><span className="ws-pill-dot" />Huntsmore</span></td>
              <td>Water heater anode replacement · Apr 8</td>
              <td>Apr 10</td>
              <td className="table-amt" style={{textAlign: "right"}}>$640.00</td>
              <td><span className="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> Awaiting approval</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0140</strong></td>
              <td><span className="ws-pill lakeside"><span className="ws-pill-dot" />Lakeside HOA</span></td>
              <td>Dishwasher replacement (parts + labor) · Apr 4</td>
              <td>Apr 5</td>
              <td className="table-amt" style={{textAlign: "right"}}>$995.00</td>
              <td><span className="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> Awaiting approval</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0139</strong></td>
              <td><span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span></td>
              <td>Annual HVAC service · Mar 28</td>
              <td>Mar 30</td>
              <td className="table-amt" style={{textAlign: "right"}}>$425.00</td>
              <td><span className="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Paid Apr 2</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td><strong>JM-0138</strong></td>
              <td><span className="ws-pill huntsmore"><span className="ws-pill-dot" />Huntsmore</span></td>
              <td>Sink P-trap leak · Unit 7 · Mar 24</td>
              <td>Mar 25</td>
              <td className="table-amt" style={{textAlign: "right"}}>$220.00</td>
              <td><span className="job-status complete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Paid Mar 28</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    
    <section className="panel" data-panel="profile">
      <div className="page-head">
        <div className="page-head-text">
          <h1>Your business profile</h1>
          <p>Visible to operators when they assign you a job. Keep insurance and W-9 current to stay eligible.</p>
        </div>
      </div>

      <div className="prof-grid">
        <div className="prof-card">
          <div className="prof-card-title">Trade specialties</div>
          <div className="trade-pills">
            <span className="trade-pill">Plumbing <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
            <span className="trade-pill">HVAC <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
            <span className="trade-pill">Water heaters <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
            <span className="trade-pill">Garbage disposals <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
            <button className="trade-add">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add
            </button>
          </div>

          <div style={{marginTop: "18px", fontSize: "13px", color: "var(--text-muted)"}}>
            <div className="det-row"><span className="det-key">Service area</span><span className="det-val">Madison County, AL · 25 mi radius</span></div>
            <div className="det-row"><span className="det-key">Hourly rate</span><span className="det-val">$95/hr · 1-hr min</span></div>
            <div className="det-row"><span className="det-key">After hours</span><span className="det-val">$165/hr · weekends, holidays, &gt; 7pm</span></div>
            <div className="det-row"><span className="det-key">Response SLA</span><span className="det-val">Same day for urgent · 48hr standard</span></div>
          </div>
        </div>

        <div className="prof-card">
          <div className="prof-card-title">Documents on file</div>
          <div className="doc-row">
            <div className="doc-icon-sm">PDF</div>
            <div>
              <div className="doc-row-title">W-9 (Form W-9)</div>
              <div className="doc-row-meta">Updated Jan 2026 · Joel's Plumbing &amp; HVAC LLC · EIN ••••3204</div>
            </div>
            <span className="doc-status ok">Verified</span>
          </div>
          <div className="doc-row">
            <div className="doc-icon-sm">PDF</div>
            <div>
              <div className="doc-row-title">General liability insurance</div>
              <div className="doc-row-meta">$1M/$2M · Geico · expires <strong>Jul 14, 2026</strong></div>
            </div>
            <span className="doc-status ok">Active</span>
          </div>
          <div className="doc-row">
            <div className="doc-icon-sm">PDF</div>
            <div>
              <div className="doc-row-title">Workers comp certificate</div>
              <div className="doc-row-meta">Alabama state · expires <strong>Jun 1, 2026</strong></div>
            </div>
            <span className="doc-status expiring">Expires in 47d</span>
          </div>
          <div className="doc-row">
            <div className="doc-icon-sm">PDF</div>
            <div>
              <div className="doc-row-title">Plumbing license</div>
              <div className="doc-row-meta">Alabama Master Plumber #PM-08214 · expires Dec 2027</div>
            </div>
            <span className="doc-status ok">Active</span>
          </div>
        </div>

        <div className="prof-card" style={{gridColumn: "1 / -1"}}>
          <div className="prof-card-title">Workspaces you serve</div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px"}}>
            <div style={{padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius)"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                <span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span>
                <span style={{fontSize: "11px", color: "var(--text-muted)"}}>Since Jan 2025</span>
              </div>
              <div style={{fontWeight: "700", fontSize: "14px", marginBottom: "2px"}}>Black Bear Rentals</div>
              <div style={{fontSize: "12px", color: "var(--text-muted)"}}>Harrison Cooper · 7 properties</div>
              <div style={{fontSize: "12px", color: "var(--green-dark)", fontWeight: "700", marginTop: "8px"}}>★ 4.9 · 22 jobs · $5,420 YTD</div>
            </div>
            <div style={{padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius)"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                <span className="ws-pill huntsmore"><span className="ws-pill-dot" />Huntsmore</span>
                <span style={{fontSize: "11px", color: "var(--text-muted)"}}>Since Sep 2024</span>
              </div>
              <div style={{fontWeight: "700", fontSize: "14px", marginBottom: "2px"}}>Huntsmore Apartments</div>
              <div style={{fontSize: "12px", color: "var(--text-muted)"}}>Sara Diallo · 28 units</div>
              <div style={{fontSize: "12px", color: "var(--green-dark)", fontWeight: "700", marginTop: "8px"}}>★ 4.8 · 18 jobs · $4,210 YTD</div>
            </div>
            <div style={{padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius)"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                <span className="ws-pill lakeside"><span className="ws-pill-dot" />Lakeside HOA</span>
                <span style={{fontSize: "11px", color: "var(--text-muted)"}}>Since Mar 2025</span>
              </div>
              <div style={{fontWeight: "700", fontSize: "14px", marginBottom: "2px"}}>Lakeside Condo HOA</div>
              <div style={{fontSize: "12px", color: "var(--text-muted)"}}>Marcus Webb · 60 units</div>
              <div style={{fontSize: "12px", color: "var(--green-dark)", fontWeight: "700", marginTop: "8px"}}>★ 5.0 · 6 jobs · $2,200 YTD</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  
  <div className="drawer-bg" id="jobDrawer">
    <div className="drawer">
      <div className="drawer-head">
        <div className="drawer-head-text">
          <h2 id="drawerTitle">Leaky kitchen faucet · constant drip</h2>
          <div className="drawer-head-sub" id="drawerSub">
            <span className="ws-pill bb"><span className="ws-pill-dot" />Black Bear</span>
            · 908 Lee Dr NW · Room C kitchen
          </div>
        </div>
        <button className="drawer-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <div className="drawer-body">
        <div className="det-row"><span className="det-key">Status</span><span className="det-val"><span className="job-status accepted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Accepted</span></span></div>
        <div className="det-row"><span className="det-key">Priority</span><span className="det-val"><span className="pri-pill high">High</span></span></div>
        <div className="det-row"><span className="det-key">Tenant</span><span className="det-val">Maya Thompson · (256) 555-0184</span></div>
        <div className="det-row"><span className="det-key">Scheduled</span><span className="det-val">Today, Apr 15 · 2:00 PM</span></div>
        <div className="det-row"><span className="det-key">Access</span><span className="det-val">Tenant home · key in lockbox 4271 if needed</span></div>
        <div className="det-row"><span className="det-key">Operator</span><span className="det-val">Harrison Cooper · (256) 555-0102</span></div>

        <div className="det-section">
          <div className="det-section-title">Description from tenant</div>
          <p style={{fontSize: "13.5px", color: "var(--text)", lineHeight: "1.6"}}>
            "Kitchen faucet has been dripping constantly for about 4 days, getting worse. Both hot and cold sides drip even when fully closed. I tried tightening the handle but it didn't help. Probably needs a new cartridge. Photos attached."
          </p>
        </div>

        <div className="det-section">
          <div className="det-section-title">Photos (3)</div>
          <div className="det-photo-grid">
            <div className="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg></div>
            <div className="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg></div>
            <div className="det-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></svg></div>
          </div>
        </div>

        <div className="det-section">
          <div className="det-section-title">Conversation</div>
          <div className="det-thread">
            <div className="det-msg">
              <div className="det-msg-avatar tenant">MT</div>
              <div className="det-msg-body">
                <div className="det-msg-head"><span className="det-msg-name">Maya Thompson · Tenant</span><span className="det-msg-time">Apr 10, 9:14am</span></div>
                <div className="det-msg-text">Submitted with photos — constant dripping from both knobs.</div>
              </div>
            </div>
            <div className="det-msg">
              <div className="det-msg-avatar operator">HC</div>
              <div className="det-msg-body">
                <div className="det-msg-head"><span className="det-msg-name">Harrison Cooper · Operator</span><span className="det-msg-time">Apr 10, 10:02am</span></div>
                <div className="det-msg-text">Joel — likely a Moen cartridge. Coordinate directly with Maya, she said weekday afternoons work. Approved up to $250 parts &amp; labor.</div>
              </div>
            </div>
            <div className="det-msg">
              <div className="det-msg-avatar you">JM</div>
              <div className="det-msg-body">
                <div className="det-msg-head"><span className="det-msg-name">You</span><span className="det-msg-time">Apr 11, 8:30am</span></div>
                <div className="det-msg-text">Will be there Tue Apr 15 at 2pm. Bringing 2 cartridge options just in case.</div>
              </div>
            </div>
          </div>
          <div className="det-reply">
            <input type="text" placeholder="Reply to Maya and Harrison..." />
            <button className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>

        <div className="det-section">
          <div className="det-section-title">Time &amp; parts</div>
          <div className="time-log">
            <div className="time-log-row"><span style={{color: "var(--text-muted)"}}>Standard rate</span><span style={{fontWeight: "700"}}>$95.00/hr</span></div>
            <div className="time-log-row"><span>Drive time (15 min)</span><span style={{fontWeight: "700", fontVariantNumeric: "tabular-nums"}}>0.25 hr</span></div>
            <div className="time-log-row"><span>Labor logged</span><span style={{fontWeight: "700", fontVariantNumeric: "tabular-nums", color: "var(--text-muted)"}}>— start at job site</span></div>
            <div className="time-log-row"><span>Parts (Moen 1225 cartridge)</span><span style={{fontWeight: "700", fontVariantNumeric: "tabular-nums"}}>$28.50</span></div>
            <div className="time-log-add">
              <input className="time-input" type="text" placeholder="0.5 hr" />
              <input className="time-input" style={{width: "120px"}} type="text" placeholder="$ part" />
              <button className="btn btn-ghost" style={{padding: "7px 12px", fontSize: "12px"}}>Add line</button>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        <button className="btn btn-ghost">Close</button>
        <button className="btn btn-pink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Start timer
        </button>
        <button className="btn btn-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Complete &amp; invoice
        </button>
      </div>
    </div>
  </div>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
