"use client";

// Mock ported from ~/Desktop/tenantory/admin-pay-vendor.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, textarea, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-dark: #e83687;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    .content { flex: 1; overflow-y: auto; padding: 28px 32px 56px; }\n\n    /* ===== Buttons ===== */\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 4px 12px rgba(255,73,152,0.25); }\n    .btn-pink:hover { background: var(--pink-dark); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,73,152,0.3); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-danger-ghost { color: var(--red); border: 1px solid var(--border); background: var(--surface); }\n    .btn-danger-ghost:hover { border-color: var(--red); background: var(--red-bg); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn-lg { padding: 13px 22px; font-size: 14px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* Page head */\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 24px; flex-wrap: wrap;\n    }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 4px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .breadcrumb-row {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 12px; color: var(--text-muted);\n      margin-bottom: 14px; font-weight: 500;\n    }\n    .breadcrumb-row a:hover { color: var(--blue); }\n    .breadcrumb-row svg { width: 12px; height: 12px; opacity: 0.6; }\n    .breadcrumb-row strong { color: var(--text); font-weight: 600; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      margin-bottom: 20px;\n    }\n    .stat {\n      padding: 18px 22px; border-right: 1px solid var(--border);\n      display: flex; flex-direction: column; gap: 6px;\n      position: relative;\n    }\n    .stat:last-child { border-right: none; }\n    .stat-label {\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      display: flex; align-items: center; gap: 6px;\n    }\n    .stat-label .dot { width: 6px; height: 6px; border-radius: 50%; }\n    .stat-label .dot.pink { background: var(--pink); }\n    .stat-label .dot.green { background: var(--green); }\n    .stat-label .dot.blue { background: var(--blue); }\n    .stat-label .dot.gray { background: var(--text-faint); }\n    .stat-value { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }\n    .stat-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; }\n    .stat-sub strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Main inbox layout ===== */\n    .inbox {\n      display: grid; grid-template-columns: 380px 1fr;\n      gap: 20px; align-items: flex-start;\n    }\n\n    /* Left list */\n    .list-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      display: flex; flex-direction: column;\n      min-height: 560px;\n    }\n    .list-head {\n      padding: 14px 16px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 10px;\n    }\n    .list-head h3 { font-size: 14px; font-weight: 700; color: var(--text); }\n    .list-head .count { font-size: 12px; color: var(--text-muted); font-weight: 500; }\n    .list-sort {\n      display: flex; gap: 4px; padding: 10px 12px;\n      border-bottom: 1px solid var(--border); background: var(--surface-subtle);\n    }\n    .sort-btn {\n      font-size: 11px; font-weight: 600;\n      color: var(--text-muted);\n      padding: 5px 10px; border-radius: 100px;\n      transition: all 0.15s ease;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .sort-btn:hover { background: var(--surface); color: var(--text); }\n    .sort-btn.active { background: var(--blue-pale); color: var(--blue); }\n    .sort-btn svg { width: 10px; height: 10px; }\n    .list-body { flex: 1; overflow-y: auto; }\n\n    .inv-row {\n      display: grid; grid-template-columns: 36px 1fr auto;\n      gap: 12px; padding: 14px 16px;\n      border-bottom: 1px solid var(--border);\n      cursor: pointer;\n      transition: all 0.2s ease;\n      position: relative;\n      align-items: center;\n    }\n    .inv-row:hover { background: var(--surface-subtle); }\n    .inv-row.active { background: var(--blue-pale); }\n    .inv-row.active::before {\n      content: \"\"; position: absolute; left: 0; top: 8px; bottom: 8px;\n      width: 3px; background: var(--blue); border-radius: 0 3px 3px 0;\n    }\n    .inv-row.removing { opacity: 0; transform: translateX(120%); max-height: 0; padding: 0 16px; border: none; overflow: hidden; }\n    .inv-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px; color: #fff;\n      flex-shrink: 0;\n    }\n    .inv-avatar.a { background: linear-gradient(135deg, #1665D8, #2F3E83); }\n    .inv-avatar.b { background: linear-gradient(135deg, #1ea97c, #138a60); }\n    .inv-avatar.c { background: linear-gradient(135deg, #ea8c3a, #d47730); }\n    .inv-avatar.d { background: linear-gradient(135deg, #FF4998, #e83687); }\n    .inv-avatar.e { background: linear-gradient(135deg, #6e56cf, #4f3eb8); }\n    .inv-body { min-width: 0; }\n    .inv-top {\n      display: flex; justify-content: space-between; align-items: baseline;\n      gap: 8px; margin-bottom: 2px;\n    }\n    .inv-name { font-weight: 700; font-size: 13px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .inv-amount { font-weight: 700; font-size: 13px; color: var(--text); font-variant-numeric: tabular-nums; flex-shrink: 0; }\n    .inv-meta { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .inv-foot { display: flex; align-items: center; gap: 8px; margin-top: 6px; }\n    .inv-date { font-size: 11px; color: var(--text-faint); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 10px; font-weight: 700; padding: 2px 8px;\n      border-radius: 100px; white-space: nowrap;\n      text-transform: uppercase; letter-spacing: 0.04em;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill svg { width: 10px; height: 10px; }\n\n    /* Right pane */\n    .detail { display: flex; flex-direction: column; gap: 16px; }\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .card-head {\n      padding: 16px 20px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 12px;\n    }\n    .card-head h3 { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n    .card-head .muted { font-size: 12px; color: var(--text-muted); font-weight: 500; }\n    .card-body { padding: 20px; }\n\n    /* Vendor card */\n    .vendor-card {\n      display: grid; grid-template-columns: 56px 1fr auto;\n      gap: 16px; padding: 20px;\n      align-items: center;\n    }\n    .vendor-avatar {\n      width: 56px; height: 56px; border-radius: 14px;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 20px; color: #fff;\n      background: linear-gradient(135deg, #1665D8, #2F3E83);\n      letter-spacing: -0.02em;\n    }\n    .vendor-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }\n    .vendor-name { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }\n    .vendor-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: var(--text-muted); }\n    .vendor-meta .sep { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }\n    .vendor-meta-item { display: inline-flex; align-items: center; gap: 5px; }\n    .vendor-meta-item strong { color: var(--text); font-weight: 700; }\n    .vendor-meta-item svg { width: 13px; height: 13px; }\n    .vendor-meta-item svg.star { color: var(--gold); }\n    .vendor-actions { display: flex; gap: 8px; }\n\n    /* Linked ticket */\n    .ticket-preview {\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .ticket-head {\n      padding: 14px 20px;\n      display: flex; align-items: center; justify-content: space-between;\n      cursor: pointer;\n      gap: 12px;\n    }\n    .ticket-head:hover { background: var(--blue-pale); }\n    .ticket-left { display: flex; align-items: center; gap: 12px; min-width: 0; }\n    .ticket-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--orange-bg); color: var(--orange);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .ticket-icon svg { width: 16px; height: 16px; }\n    .ticket-info { min-width: 0; }\n    .ticket-title { font-size: 13px; font-weight: 700; color: var(--text); }\n    .ticket-sub { font-size: 12px; color: var(--text-muted); }\n    .ticket-chev {\n      color: var(--text-faint);\n      transition: transform 0.2s ease;\n    }\n    .ticket-chev svg { width: 16px; height: 16px; }\n    .ticket-preview.open .ticket-chev { transform: rotate(90deg); }\n    .ticket-body {\n      display: none;\n      padding: 0 20px 18px;\n      font-size: 13px; color: var(--text-muted);\n      border-top: 1px solid var(--border);\n      padding-top: 14px;\n    }\n    .ticket-preview.open .ticket-body { display: block; }\n    .ticket-body .label { font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin: 12px 0 4px; }\n    .ticket-body p { color: var(--text); line-height: 1.55; }\n\n    /* Line items */\n    .line-table {\n      width: 100%; border-collapse: collapse;\n      font-size: 13px;\n    }\n    .line-table th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;\n      padding: 10px 20px; background: var(--surface-alt);\n      border-bottom: 1px solid var(--border);\n    }\n    .line-table th.num, .line-table td.num { text-align: right; font-variant-numeric: tabular-nums; }\n    .line-table td {\n      padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      vertical-align: top;\n    }\n    .line-desc { font-weight: 600; color: var(--text); }\n    .line-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .line-receipt {\n      display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;\n      font-size: 11px; color: var(--blue); font-weight: 600;\n      padding: 3px 8px; background: var(--blue-pale); border-radius: 6px;\n    }\n    .line-receipt svg { width: 10px; height: 10px; }\n    .line-table tfoot td {\n      padding: 10px 20px;\n      border-bottom: none;\n      font-size: 13px;\n    }\n    .line-table tfoot tr.sub td { color: var(--text-muted); padding-top: 14px; }\n    .line-table tfoot tr.total td {\n      font-weight: 800; font-size: 16px; color: var(--text);\n      border-top: 2px solid var(--text);\n      padding-top: 12px;\n    }\n\n    /* Receipts gallery */\n    .receipts {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;\n      padding: 20px;\n    }\n    .receipt-tile {\n      aspect-ratio: 4 / 3; border-radius: var(--radius);\n      background: var(--surface-alt); border: 1px solid var(--border);\n      display: flex; flex-direction: column; align-items: center; justify-content: center;\n      gap: 6px; color: var(--text-faint);\n      cursor: pointer; transition: all 0.15s ease;\n      overflow: hidden; position: relative;\n    }\n    .receipt-tile:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); box-shadow: var(--shadow-sm); }\n    .receipt-tile svg { width: 28px; height: 28px; }\n    .receipt-label {\n      position: absolute; bottom: 0; left: 0; right: 0;\n      background: linear-gradient(180deg, transparent, rgba(0,0,0,0.65));\n      color: #fff; font-size: 11px; font-weight: 600;\n      padding: 18px 10px 8px;\n    }\n    .receipt-tile.img-a { background: linear-gradient(135deg, #cfd9ee, #9fb3d9); }\n    .receipt-tile.img-b { background: linear-gradient(135deg, #e6d5c7, #c9a987); }\n    .receipt-tile.img-c { background: linear-gradient(135deg, #d4e8dc, #9ac6ab); }\n    .receipt-tile.img-a svg, .receipt-tile.img-b svg, .receipt-tile.img-c svg { color: rgba(255,255,255,0.85); }\n\n    /* Vendor note */\n    .vnote {\n      padding: 18px 20px; border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .vnote-head {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      margin-bottom: 8px;\n    }\n    .vnote-head svg { width: 12px; height: 12px; }\n    .vnote-body {\n      font-size: 13px; color: var(--text); line-height: 1.55;\n      font-style: italic;\n    }\n    .vnote-sig { font-size: 12px; color: var(--text-muted); margin-top: 8px; font-style: normal; }\n\n    /* Disputes & edits */\n    .disputes {\n      padding: 16px 20px; border-top: 1px dashed var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 12px; font-size: 13px; color: var(--text-muted);\n    }\n    .disputes-left { display: flex; align-items: center; gap: 10px; }\n    .disputes-left svg { width: 16px; height: 16px; color: var(--text-faint); }\n\n    /* Action row */\n    .action-row {\n      padding: 20px; border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 12px; flex-wrap: wrap;\n    }\n    .action-row .primary-side { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }\n    .action-row .meta-side { font-size: 12px; color: var(--text-muted); }\n    .action-row .meta-side strong { color: var(--text); font-weight: 700; }\n\n    /* Payout details card */\n    .payout-card {\n      background: linear-gradient(135deg, #fff 0%, var(--surface-subtle) 100%);\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      padding: 22px; display: grid; grid-template-columns: auto 1fr auto; gap: 20px;\n      align-items: center;\n    }\n    .payout-icon {\n      width: 52px; height: 52px; border-radius: 14px;\n      background: var(--pink-bg); color: var(--pink);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .payout-icon svg { width: 24px; height: 24px; }\n    .payout-body h4 {\n      font-size: 15px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.01em; margin-bottom: 4px;\n    }\n    .payout-body p { font-size: 13px; color: var(--text-muted); }\n    .payout-grid {\n      display: grid; grid-template-columns: repeat(3, auto); gap: 18px;\n      margin-top: 10px;\n    }\n    .payout-item { font-size: 12px; }\n    .payout-item .label { font-size: 10px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }\n    .payout-item .label svg { width: 11px; height: 11px; color: var(--green-dark); }\n    .payout-item .val { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .payout-amount { text-align: right; }\n    .payout-amount .big { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }\n    .payout-amount .sm { font-size: 11px; color: var(--text-muted); font-weight: 500; }\n\n    /* History */\n    .history-table { width: 100%; border-collapse: collapse; font-size: 13px; }\n    .history-table th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;\n      padding: 10px 20px; background: var(--surface-alt);\n      border-bottom: 1px solid var(--border);\n    }\n    .history-table th.num, .history-table td.num { text-align: right; font-variant-numeric: tabular-nums; }\n    .history-table td { padding: 12px 20px; border-bottom: 1px solid var(--border); }\n    .history-table tr:last-child td { border-bottom: none; }\n    .history-table tr:hover td { background: var(--surface-subtle); }\n    .history-title { font-weight: 600; color: var(--text); }\n    .history-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }\n\n    /* Toast */\n    .toast-wrap {\n      position: fixed; bottom: 28px; right: 28px; z-index: 200;\n      display: flex; flex-direction: column; gap: 10px;\n    }\n    .toast {\n      background: var(--text); color: #fff;\n      padding: 14px 18px; border-radius: var(--radius);\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 12px;\n      min-width: 320px; font-size: 13px;\n      animation: toast-in 0.3s ease;\n    }\n    .toast.success { background: var(--green-dark); }\n    .toast svg { width: 18px; height: 18px; flex-shrink: 0; }\n    .toast strong { font-weight: 700; }\n    .toast small { color: rgba(255,255,255,0.7); display: block; margin-top: 1px; font-size: 11px; }\n    @keyframes toast-in {\n      from { opacity: 0; transform: translateY(20px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    .toast.out { animation: toast-out 0.3s ease forwards; }\n    @keyframes toast-out {\n      to { opacity: 0; transform: translateX(20px); }\n    }\n\n    /* Modal */\n    .modal-wrap {\n      position: fixed; inset: 0; z-index: 150;\n      background: rgba(20, 32, 74, 0.45);\n      backdrop-filter: blur(4px);\n      display: none; align-items: center; justify-content: center;\n      padding: 24px;\n      opacity: 0;\n      transition: opacity 0.2s ease;\n    }\n    .modal-wrap.open { display: flex; opacity: 1; }\n    .modal {\n      background: var(--surface); border-radius: var(--radius-xl);\n      max-width: 520px; width: 100%;\n      box-shadow: var(--shadow-lg);\n      overflow: hidden;\n      transform: translateY(10px);\n      transition: transform 0.2s ease;\n    }\n    .modal-wrap.open .modal { transform: translateY(0); }\n    .modal.wide { max-width: 720px; }\n    .modal-head {\n      padding: 20px 24px 14px;\n      border-bottom: 1px solid var(--border);\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 12px;\n    }\n    .modal-head h2 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 4px; }\n    .modal-head p { font-size: 13px; color: var(--text-muted); }\n    .modal-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .modal-close:hover { background: var(--surface-alt); color: var(--text); }\n    .modal-close svg { width: 16px; height: 16px; }\n    .modal-body { padding: 22px 24px; }\n    .modal-foot {\n      padding: 16px 24px;\n      border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; justify-content: flex-end; gap: 10px;\n    }\n\n    .modal-summary {\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius);\n      padding: 16px; margin-bottom: 18px;\n    }\n    .modal-summary .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }\n    .modal-summary .row.total { border-top: 1px solid var(--border); margin-top: 6px; padding-top: 10px; font-weight: 800; font-size: 15px; }\n    .modal-summary .lbl { color: var(--text-muted); }\n    .modal-summary .val { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }\n\n    .confirm-input {\n      width: 100%; padding: 12px 14px;\n      border: 1px solid var(--border-strong); border-radius: var(--radius);\n      font-size: 14px; font-weight: 700; letter-spacing: 0.1em;\n      text-transform: uppercase; text-align: center;\n      color: var(--text); background: var(--surface);\n    }\n    .confirm-input:focus { outline: none; border-color: var(--pink); box-shadow: 0 0 0 3px var(--pink-bg); }\n    .confirm-hint { font-size: 12px; color: var(--text-muted); margin-top: 8px; text-align: center; }\n    .confirm-hint kbd {\n      background: var(--surface-alt); padding: 2px 6px; border-radius: 4px;\n      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text);\n      border: 1px solid var(--border);\n    }\n\n    .reason-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }\n    .reason-chip {\n      padding: 7px 14px; border-radius: 100px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .reason-chip:hover { border-color: var(--blue); color: var(--blue); }\n    .reason-chip.active { background: var(--blue-pale); border-color: var(--blue); color: var(--blue); }\n    textarea.field {\n      width: 100%; min-height: 120px;\n      padding: 12px 14px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      font-size: 13px; color: var(--text);\n      resize: vertical; font-family: inherit;\n    }\n    textarea.field:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n\n    /* Partial approve modal */\n    .partial-table { width: 100%; font-size: 13px; margin-bottom: 14px; border-collapse: collapse; }\n    .partial-table th {\n      text-align: left; font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;\n      padding: 8px 10px; border-bottom: 1px solid var(--border);\n    }\n    .partial-table th.num, .partial-table td.num { text-align: right; }\n    .partial-table td { padding: 10px; border-bottom: 1px solid var(--border); }\n    .partial-table input[type=\"number\"] {\n      width: 90px; padding: 7px 10px; border: 1px solid var(--border);\n      border-radius: 6px; text-align: right; font-variant-numeric: tabular-nums;\n      font-weight: 600; color: var(--text);\n    }\n    .partial-table input[type=\"number\"]:focus { outline: none; border-color: var(--blue); }\n    .partial-table input[type=\"checkbox\"] { width: 16px; height: 16px; accent-color: var(--blue); }\n    .partial-total {\n      padding: 14px 16px; background: var(--surface-subtle);\n      border: 1px solid var(--border); border-radius: var(--radius);\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 14px;\n    }\n    .partial-total .big { font-size: 20px; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }\n    .partial-total .delta { font-size: 12px; color: var(--text-muted); }\n    .partial-total .delta.red { color: var(--red); font-weight: 600; }\n\n    /* Empty state */\n    .empty-state {\n      padding: 48px 20px; text-align: center;\n      color: var(--text-muted);\n    }\n    .empty-state svg { width: 40px; height: 40px; color: var(--text-faint); margin: 0 auto 12px; }\n    .empty-state h4 { color: var(--text); font-weight: 700; font-size: 15px; margin-bottom: 4px; }\n    .empty-state p { font-size: 13px; }\n\n    @media (max-width: 1200px) {\n      .inbox { grid-template-columns: 340px 1fr; }\n    }\n    @media (max-width: 1024px) {\n      .inbox { grid-template-columns: 1fr; }\n      .stats-strip { grid-template-columns: repeat(2, 1fr); }\n      .stat:nth-child(2) { border-right: none; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

<div className="app">

  
  <aside className="sidebar">
    <div className="sb-brand">
      <div className="sb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <div>
        <div className="sb-brand-name">Tenantory</div>
        <div className="sb-brand-ws">Black Bear Rentals</div>
      </div>
    </div>

    <div className="sb-section">
      <div className="sb-section-label">Overview</div>
      <div className="sb-nav">
        <a className="sb-nav-item" href="admin-v2.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>Dashboard
        </a>
        <a className="sb-nav-item" href="properties.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>Properties
          <span className="sb-nav-count">4</span>
        </a>
        <a className="sb-nav-item" href="tenants.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Tenants
          <span className="sb-nav-count">12</span>
        </a>
        <a className="sb-nav-item" href="leases.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>Leases
        </a>
        <a className="sb-nav-item" href="applications.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>Applications
          <span className="sb-nav-badge">3</span>
        </a>
      </div>

      <div className="sb-section-label" style={{marginTop: "20px"}}>Operations</div>
      <div className="sb-nav">
        <a className="sb-nav-item" href="payments.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>Payments
        </a>
        <a className="sb-nav-item active" href="maintenance.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1" /></svg>Maintenance
          <span className="sb-nav-count">5</span>
        </a>
        <a className="sb-nav-item" href="reports.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>Reports
        </a>
        <a className="sb-nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>Vendors
        </a>
      </div>

      <div className="sb-section-label" style={{marginTop: "20px"}}>Workspace</div>
      <div className="sb-nav">
        <a className="sb-nav-item" href="settings.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5" /></svg>Settings
        </a>
        <a className="sb-nav-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>Documents
        </a>
      </div>
    </div>

    <div className="sb-user">
      <div className="sb-user-card">
        <div className="sb-user-avatar">HC</div>
        <div className="sb-user-info">
          <div className="sb-user-name">Harrison Cooper</div>
          <div className="sb-user-email">harrison@rentblackbear.com</div>
        </div>
        <div className="sb-user-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      </div>
    </div>
  </aside>

  
  <main className="main">

    
    <div className="topbar">
      <div className="topbar-breadcrumb">
        <a href="admin-v2.html">Workspace</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        <a href="maintenance.html">Maintenance</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        <strong>Vendor invoices</strong>
      </div>
      <div className="topbar-right">
        <div className="topbar-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input placeholder="Search invoices, vendors, tickets…" />
          <kbd>⌘K</kbd>
        </div>
        <button className="topbar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          <span className="topbar-icon-dot" />
        </button>
        <button className="topbar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </button>
        <button className="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Quick add
        </button>
      </div>
    </div>

    
    <div className="content">

      <div className="breadcrumb-row">
        <a href="maintenance.html">Maintenance</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        <strong>Vendor invoices</strong>
      </div>

      <div className="page-head">
        <div>
          <h1>Vendor invoices</h1>
          <p>Review, approve, and pay out. Payouts hit the vendor's bank in 1-2 business days after you approve.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export
          </button>
          <button className="btn btn-ghost btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            1099 report
          </button>
        </div>
      </div>

      
      <div className="stats-strip">
        <div className="stat">
          <div className="stat-label"><span className="dot pink" />Awaiting approval</div>
          <div className="stat-value" id="stat-pending-count">3</div>
          <div className="stat-sub"><strong id="stat-pending-amt">$1,820</strong> total pending</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="dot green" />Approved this month</div>
          <div className="stat-value">9</div>
          <div className="stat-sub"><strong>$3,440</strong> paid in April</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="dot blue" />Paid YTD</div>
          <div className="stat-value">32</div>
          <div className="stat-sub"><strong>$11,830</strong> across 7 vendors</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="dot gray" />Disputed</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">No open disputes</div>
        </div>
      </div>

      
      <div className="inbox">

        
        <div className="list-card">
          <div className="list-head">
            <h3>Pending invoices</h3>
            <span className="count" id="list-count">3 total</span>
          </div>
          <div className="list-sort">
            <button className="sort-btn active" data-sort="date">
              Date
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <button className="sort-btn" data-sort="amount">Amount</button>
            <button className="sort-btn" data-sort="vendor">Vendor</button>
            <button className="sort-btn" data-sort="property">Property</button>
          </div>
          <div className="list-body" id="list-body" />
        </div>

        
        <div className="detail" id="detail-pane" />

      </div>

      
      <div className="card" style={{marginTop: "28px"}}>
        <div className="card-head">
          <h3 id="history-title">Recent approved invoices — Joel's Plumbing</h3>
          <a href="#" className="btn btn-sm btn-ghost">View all</a>
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Property</th>
              <th>Approved</th>
              <th className="num">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="history-body">
            <tr>
              <td>
                <div className="history-title">INV-2041 · Water heater replacement</div>
                <div className="history-sub">Ticket #2183</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Mar 28, 2026</td>
              <td className="num"><strong>$1,240.00</strong></td>
              <td><span className="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div className="history-title">INV-2019 · Kitchen drain unclog</div>
                <div className="history-sub">Ticket #2141</div>
              </td>
              <td>3026 Turf Ave NW</td>
              <td>Mar 14, 2026</td>
              <td className="num"><strong>$185.00</strong></td>
              <td><span className="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div className="history-title">INV-1994 · Toilet rebuild, unit B</div>
                <div className="history-sub">Ticket #2110</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Feb 27, 2026</td>
              <td className="num"><strong>$310.00</strong></td>
              <td><span className="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div className="history-title">INV-1962 · Shutoff valve replace</div>
                <div className="history-sub">Ticket #2083</div>
              </td>
              <td>3026 Turf Ave NW</td>
              <td>Feb 11, 2026</td>
              <td className="num"><strong>$215.00</strong></td>
              <td><span className="pill pill-green">Paid</span></td>
            </tr>
            <tr>
              <td>
                <div className="history-title">INV-1928 · Garbage disposal install</div>
                <div className="history-sub">Ticket #2051</div>
              </td>
              <td>908 Lee Dr NW</td>
              <td>Jan 30, 2026</td>
              <td className="num"><strong>$260.00</strong></td>
              <td><span className="pill pill-green">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</div>


<div className="modal-wrap" id="modal-approve">
  <div className="modal">
    <div className="modal-head">
      <div>
        <h2 id="approve-title">Confirm payout</h2>
        <p id="approve-sub">Step 1 of 2 — review the transfer before releasing funds.</p>
      </div>
      <button className="modal-close" data-close="">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>

    <div className="modal-body" id="approve-body-1">
      <div className="modal-summary">
        <div className="row"><span className="lbl">Vendor</span><span className="val" id="ap-vendor">Joel's Plumbing</span></div>
        <div className="row"><span className="lbl">Invoice</span><span className="val" id="ap-invoice">INV-2058</span></div>
        <div className="row"><span className="lbl">Property</span><span className="val" id="ap-property">908 Lee Dr NW, Unit A</span></div>
        <div className="row"><span className="lbl">Destination</span><span className="val" id="ap-dest">Chase ••6891 (Plaid verified)</span></div>
        <div className="row"><span className="lbl">Expected arrival</span><span className="val">1-2 business days</span></div>
        <div className="row total"><span className="lbl">You're paying</span><span className="val" id="ap-total">$640.00</span></div>
      </div>
      <p style={{fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.55"}}>
        Funds are debited from your operating account immediately and released via ACH once the cutoff clears. You'll receive email confirmation with receipt. The vendor's 1099 YTD will update automatically.
      </p>
    </div>

    <div className="modal-body" id="approve-body-2" style={{display: "none"}}>
      <p style={{fontSize: "13px", color: "var(--text)", marginBottom: "14px", lineHeight: "1.55"}}>
        This releases <strong id="ap-confirm-amt">$640.00</strong> from your operating account to <strong id="ap-confirm-vendor">Joel's Plumbing</strong>. Type <strong>APPROVE</strong> below to finalize.
      </p>
      <input type="text" className="confirm-input" id="confirm-text" placeholder="Type APPROVE" autoComplete="off" />
      <div className="confirm-hint">Press <kbd>Enter</kbd> when ready, or <kbd>Esc</kbd> to cancel.</div>
    </div>

    <div className="modal-foot">
      <button className="btn btn-ghost btn-sm" data-close="">Cancel</button>
      <button className="btn btn-pink btn-sm" id="approve-next">
        Continue
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <button className="btn btn-pink btn-sm" id="approve-finalize" style={{display: "none"}} disabled>
        Release payout
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </button>
    </div>
  </div>
</div>


<div className="modal-wrap" id="modal-dispute">
  <div className="modal">
    <div className="modal-head">
      <div>
        <h2>Request a change</h2>
        <p>Send this back to the vendor with a reason. They'll get notified and can revise.</p>
      </div>
      <button className="modal-close" data-close="">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div className="modal-body">
      <div className="reason-grid" id="reason-grid">
        <button className="reason-chip" data-reason="Line item unclear — please itemize labor hours.">Itemize labor</button>
        <button className="reason-chip" data-reason="Parts total looks high vs estimate — attach receipts.">Parts look high</button>
        <button className="reason-chip" data-reason="Missing receipt for parts or materials.">Missing receipt</button>
        <button className="reason-chip" data-reason="After-hours surcharge was not pre-approved.">Surcharge not approved</button>
        <button className="reason-chip" data-reason="Tax applied incorrectly — should be exempt.">Tax error</button>
        <button className="reason-chip" data-reason="Scope of work differs from original ticket.">Scope mismatch</button>
      </div>
      <textarea className="field" id="dispute-text" placeholder="Add detail so the vendor can fix it quickly…" />
    </div>
    <div className="modal-foot">
      <button className="btn btn-ghost btn-sm" data-close="">Cancel</button>
      <button className="btn btn-primary btn-sm" id="dispute-send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
        Send to vendor
      </button>
    </div>
  </div>
</div>


<div className="modal-wrap" id="modal-partial">
  <div className="modal wide">
    <div className="modal-head">
      <div>
        <h2>Partial approve</h2>
        <p>Adjust what you'll pay. The vendor sees each edit with a reason.</p>
      </div>
      <button className="modal-close" data-close="">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div className="modal-body">
      <table className="partial-table">
        <thead>
          <tr>
            <th style={{width: "40px"}}>Pay</th>
            <th>Item</th>
            <th className="num" style={{width: "120px"}}>Approved amt</th>
          </tr>
        </thead>
        <tbody id="partial-body" />
      </table>
      <div className="partial-total">
        <div>
          <div className="delta" id="partial-delta">Original $640.00</div>
          <div style={{fontSize: "11px", fontWeight: "700", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px"}}>New total</div>
        </div>
        <div className="big" id="partial-total">$640.00</div>
      </div>
    </div>
    <div className="modal-foot">
      <button className="btn btn-ghost btn-sm" data-close="">Cancel</button>
      <button className="btn btn-pink btn-sm" id="partial-confirm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        Approve adjusted
      </button>
    </div>
  </div>
</div>

<div className="toast-wrap" id="toast-wrap" />




    </>
  );
}
