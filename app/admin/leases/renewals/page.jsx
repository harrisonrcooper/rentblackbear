"use client";

// Mock ported from ~/Desktop/blackbear/admin-renew.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-dark: #e5377f;\n      --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n    }\n\n    /* ===== Layout shell ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand {\n      display: flex; align-items: center; gap: 10px;\n      padding: 22px 20px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n    .sb-logo {\n      width: 34px; height: 34px; border-radius: 9px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(18,81,173,0.3);\n    }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label {\n      font-size: 10px; font-weight: 700;\n      color: rgba(255,255,255,0.4);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      padding: 8px 12px 10px;\n    }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.75);\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active {\n      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));\n      color: #fff;\n    }\n    .sb-nav-item.active::before {\n      content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px;\n      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;\n    }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge {\n      margin-left: auto; background: var(--pink); color: #fff;\n      font-size: 10px; font-weight: 700;\n      padding: 2px 7px; border-radius: 100px;\n    }\n    .sb-nav-count {\n      margin-left: auto; background: rgba(255,255,255,0.08);\n      color: rgba(255,255,255,0.7);\n      font-size: 11px; font-weight: 600;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px; border-radius: 10px;\n      background: rgba(255,255,255,0.04);\n      transition: all 0.15s ease;\n      cursor: pointer;\n    }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 12px;\n    }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }\n\n    .topbar {\n      background: var(--surface);\n      border-bottom: 1px solid var(--border);\n      padding: 14px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-right { display: flex; align-items: center; gap: 12px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 280px; color: var(--text-faint);\n      transition: all 0.15s ease;\n    }\n    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input {\n      flex: 1; border: none; outline: none; background: transparent;\n      font-size: 13px; color: var(--text);\n    }\n    .topbar-search kbd {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10px; background: var(--surface); border: 1px solid var(--border);\n      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);\n    }\n    .topbar-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; position: relative;\n    }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot {\n      position: absolute; top: 7px; right: 8px;\n      width: 8px; height: 8px; border-radius: 50%;\n      background: var(--pink); border: 2px solid #fff;\n    }\n\n    /* Content */\n    .content { flex: 1; overflow-y: auto; padding: 32px; }\n\n    .page-head {\n      display: flex; align-items: flex-start; justify-content: space-between;\n      gap: 20px; margin-bottom: 28px; flex-wrap: wrap;\n    }\n    .page-head h1 {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--text); margin-bottom: 4px;\n    }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 10px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease; white-space: nowrap;\n    }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: var(--pink-dark); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-sm { padding: 7px 14px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }\n\n    /* Filter bar */\n    .filter-bar {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 14px 16px;\n      display: flex; gap: 10px; align-items: center; flex-wrap: wrap;\n      margin-bottom: 20px;\n    }\n    .filter-group {\n      display: flex; align-items: center; gap: 8px;\n      font-size: 12px; color: var(--text-muted); font-weight: 600;\n    }\n    .filter-select {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 8px; padding: 8px 32px 8px 12px;\n      font-size: 13px; color: var(--text); font-weight: 500;\n      appearance: none; -webkit-appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .filter-select:hover { border-color: var(--border-strong); }\n    .filter-select:focus { outline: none; border-color: var(--blue); background-color: var(--surface); }\n    .filter-spacer { flex: 1; }\n    .filter-reset {\n      font-size: 12px; color: var(--text-muted); font-weight: 600;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .filter-reset:hover { color: var(--blue); }\n    .filter-reset svg { width: 12px; height: 12px; }\n\n    /* KPI row */\n    .kpi-row {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      gap: 16px; margin-bottom: 24px;\n    }\n    .kpi-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n      transition: all 0.15s ease;\n    }\n    .kpi-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }\n    .kpi-card-head {\n      display: flex; align-items: center; justify-content: space-between;\n      margin-bottom: 14px;\n    }\n    .kpi-card-label {\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .kpi-card-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .kpi-card-icon svg { width: 16px; height: 16px; }\n    .kpi-card-icon.blue { background: var(--blue-pale); color: var(--blue); }\n    .kpi-card-icon.green { background: var(--green-bg); color: var(--green-dark); }\n    .kpi-card-icon.pink { background: var(--pink-bg); color: var(--pink); }\n    .kpi-card-icon.orange { background: var(--orange-bg); color: var(--orange); }\n    .kpi-card-icon.gray { background: var(--surface-alt); color: var(--text-muted); }\n    .kpi-card-value {\n      font-size: 30px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n    }\n    .kpi-card-delta {\n      font-size: 12px; font-weight: 600; margin-top: 6px;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .kpi-card-delta.up { color: var(--green-dark); }\n    .kpi-card-delta.neutral { color: var(--text-muted); }\n    .kpi-card-delta.pink { color: var(--pink); }\n\n    /* Bulk-action bar */\n    .bulk-bar {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg) var(--radius-lg) 0 0;\n      padding: 14px 20px;\n      display: flex; align-items: center; gap: 14px;\n      border-bottom: none;\n    }\n    .bulk-bar.has-selection {\n      background: linear-gradient(90deg, rgba(255,73,152,0.06), rgba(18,81,173,0.04));\n      border-color: rgba(255,73,152,0.3);\n    }\n    .bulk-select {\n      display: flex; align-items: center; gap: 10px;\n      font-size: 13px; color: var(--text-muted); font-weight: 600;\n      cursor: pointer;\n    }\n    .bulk-count { color: var(--text); font-weight: 700; }\n    .bulk-spacer { flex: 1; }\n\n    /* Checkbox */\n    .cbx {\n      appearance: none; -webkit-appearance: none;\n      width: 18px; height: 18px; border-radius: 5px;\n      border: 1.5px solid var(--border-strong);\n      background: var(--surface); cursor: pointer;\n      display: inline-flex; align-items: center; justify-content: center;\n      flex-shrink: 0; transition: all 0.15s ease;\n      position: relative;\n    }\n    .cbx:hover { border-color: var(--blue); }\n    .cbx:checked { background: var(--blue); border-color: var(--blue); }\n    .cbx:checked::after {\n      content: \"\"; position: absolute;\n      width: 10px; height: 10px;\n      background: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E\") center/contain no-repeat;\n    }\n    .cbx.indeterminate { background: var(--blue); border-color: var(--blue); }\n    .cbx.indeterminate::after {\n      content: \"\"; position: absolute;\n      width: 10px; height: 2px; background: #fff; border-radius: 1px;\n    }\n\n    /* Table */\n    .table-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg);\n      overflow: hidden;\n    }\n    .table { width: 100%; }\n    .table-row {\n      display: grid;\n      grid-template-columns: 32px 1.6fr 1.3fr 100px 110px 90px 130px 110px 120px;\n      gap: 14px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      transition: background 0.15s ease; cursor: pointer;\n    }\n    .table-row:last-child { border-bottom: none; }\n    .table-row:hover:not(.table-row-head) { background: var(--surface-subtle); }\n    .table-row.selected { background: rgba(255,73,152,0.05); }\n    .table-row.selected:hover { background: rgba(255,73,152,0.08); }\n    .table-row-head {\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      cursor: default;\n    }\n    .table-tenant { display: flex; align-items: center; gap: 10px; min-width: 0; }\n    .table-avatar {\n      width: 34px; height: 34px; border-radius: 50%;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px; flex-shrink: 0;\n    }\n    .table-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .table-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .table-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .table-avatar.gray { background: var(--surface-alt); color: var(--text-muted); }\n    .table-tenant-name { font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .table-tenant-meta { font-size: 12px; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .table-property { color: var(--text); font-weight: 500; }\n    .table-property-unit { font-size: 12px; color: var(--text-faint); }\n    .table-amount { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .table-date { color: var(--text); font-weight: 500; }\n    .table-days { font-variant-numeric: tabular-nums; font-weight: 600; }\n    .table-days.urgent { color: var(--red); }\n    .table-days.warn { color: var(--orange); }\n    .table-days.ok { color: var(--text-muted); }\n    .table-term {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      padding: 6px 10px; border-radius: 8px;\n      font-size: 12px; font-weight: 600; color: var(--text);\n    }\n\n    /* Inline rent edit */\n    .rent-edit {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 8px; padding: 6px 10px;\n      font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;\n      color: var(--text); width: 100px;\n      transition: all 0.15s ease;\n    }\n    .rent-edit:hover { border-color: var(--blue); }\n    .rent-edit:focus { outline: none; border-color: var(--blue); background: var(--surface); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .rent-change {\n      display: block; font-size: 11px; margin-top: 3px; font-weight: 600;\n    }\n    .rent-change.up { color: var(--green-dark); }\n    .rent-change.flat { color: var(--text-muted); }\n    .rent-change.down { color: var(--red); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 600; padding: 4px 10px;\n      border-radius: 100px; white-space: nowrap;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: currentColor;\n    }\n\n    /* Empty state */\n    .empty-state {\n      text-align: center; padding: 64px 24px;\n      background: var(--surface); border: 1px dashed var(--border-strong);\n      border-radius: var(--radius-lg); margin-top: 20px;\n    }\n    .empty-state-icon {\n      width: 64px; height: 64px; border-radius: 16px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: inline-flex; align-items: center; justify-content: center;\n      margin-bottom: 14px;\n    }\n    .empty-state-icon svg { width: 28px; height: 28px; }\n    .empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em; }\n    .empty-state p { color: var(--text-muted); font-size: 13px; }\n\n    /* Footer info */\n    .page-footer-info {\n      margin-top: 20px;\n      background: var(--blue-pale);\n      border: 1px solid rgba(18,81,173,0.15);\n      border-radius: var(--radius-lg);\n      padding: 16px 20px;\n      display: flex; align-items: flex-start; gap: 14px;\n      color: var(--navy);\n    }\n    .page-footer-info-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--blue); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .page-footer-info-icon svg { width: 16px; height: 16px; }\n    .page-footer-info p { font-size: 13px; line-height: 1.55; color: var(--navy); }\n    .page-footer-info strong { font-weight: 700; }\n\n    /* Modal */\n    .modal-backdrop {\n      position: fixed; inset: 0; background: rgba(20,32,74,0.5);\n      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);\n      display: flex; align-items: center; justify-content: center;\n      z-index: 60; padding: 24px;\n      opacity: 0; pointer-events: none; transition: opacity 0.2s ease;\n    }\n    .modal-backdrop.open { opacity: 1; pointer-events: auto; }\n    .modal {\n      background: var(--surface); border-radius: var(--radius-xl);\n      width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto;\n      box-shadow: var(--shadow-lg);\n      transform: translateY(12px) scale(0.98); transition: transform 0.2s ease;\n    }\n    .modal-backdrop.open .modal { transform: translateY(0) scale(1); }\n    .modal-head {\n      padding: 22px 24px 4px;\n      display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;\n    }\n    .modal-head h2 { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .modal-head p { color: var(--text-muted); font-size: 13px; margin-top: 4px; }\n    .modal-close {\n      width: 30px; height: 30px; border-radius: 8px;\n      color: var(--text-muted); background: var(--surface-alt);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      transition: all 0.15s ease;\n    }\n    .modal-close:hover { background: var(--border); color: var(--text); }\n    .modal-close svg { width: 14px; height: 14px; }\n    .modal-body { padding: 16px 24px 4px; }\n    .modal-foot {\n      padding: 18px 24px 22px;\n      display: flex; gap: 10px; justify-content: flex-end;\n      border-top: 1px solid var(--border); margin-top: 18px;\n    }\n\n    .field { margin-bottom: 18px; }\n    .field-label {\n      display: block; font-size: 12px; font-weight: 700;\n      color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;\n      margin-bottom: 8px;\n    }\n    .segment {\n      display: flex; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 10px; padding: 3px;\n    }\n    .segment-opt {\n      flex: 1; padding: 9px 12px; border-radius: 8px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      text-align: center; transition: all 0.15s ease;\n    }\n    .segment-opt:hover { color: var(--text); }\n    .segment-opt.active { background: var(--surface); color: var(--blue); box-shadow: var(--shadow-sm); }\n    .field-input, .field-textarea {\n      width: 100%; background: var(--surface);\n      border: 1px solid var(--border); border-radius: 10px;\n      padding: 10px 14px; font-size: 14px; color: var(--text);\n      transition: all 0.15s ease;\n    }\n    .field-input:focus, .field-textarea:focus {\n      outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale);\n    }\n    .field-textarea { resize: vertical; min-height: 90px; font-family: inherit; line-height: 1.5; }\n    .field-hint { font-size: 12px; color: var(--text-faint); margin-top: 6px; }\n\n    /* Drawer */\n    .drawer-backdrop {\n      position: fixed; inset: 0; background: rgba(20,32,74,0.35);\n      z-index: 55; opacity: 0; pointer-events: none;\n      transition: opacity 0.2s ease;\n    }\n    .drawer-backdrop.open { opacity: 1; pointer-events: auto; }\n    .drawer {\n      position: fixed; top: 0; right: 0; bottom: 0;\n      width: 480px; max-width: 92vw;\n      background: var(--surface); z-index: 56;\n      box-shadow: -12px 0 40px rgba(20,32,74,0.12);\n      transform: translateX(100%); transition: transform 0.28s cubic-bezier(.4,0,.2,1);\n      display: flex; flex-direction: column;\n    }\n    .drawer.open { transform: translateX(0); }\n    .drawer-head {\n      padding: 22px 24px 18px;\n      border-bottom: 1px solid var(--border);\n      display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;\n      flex-shrink: 0;\n    }\n    .drawer-head-top {\n      display: flex; align-items: center; gap: 12px; margin-bottom: 8px;\n    }\n    .drawer-avatar {\n      width: 44px; height: 44px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 14px;\n    }\n    .drawer-head h2 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .drawer-head-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }\n    .drawer-foot {\n      padding: 16px 24px; border-top: 1px solid var(--border);\n      display: flex; gap: 10px; flex-shrink: 0; background: var(--surface-subtle);\n    }\n\n    .drawer-section { margin-bottom: 22px; }\n    .drawer-section-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;\n    }\n    .info-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n    }\n    .info-cell {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 10px; padding: 10px 12px;\n    }\n    .info-cell-label { font-size: 11px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }\n    .info-cell-value { font-size: 15px; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; margin-top: 3px; }\n    .info-cell-value.green { color: var(--green-dark); }\n\n    .history-row {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 9px 0; border-bottom: 1px solid var(--border);\n      font-size: 13px;\n    }\n    .history-row:last-child { border-bottom: none; }\n    .history-row-label { color: var(--text-muted); }\n    .history-row-value { font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }\n\n    .signal-bar {\n      display: flex; align-items: center; gap: 10px;\n      background: var(--green-bg); border: 1px solid rgba(30,169,124,0.25);\n      border-radius: 10px; padding: 12px 14px;\n    }\n    .signal-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--green-dark); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .signal-icon svg { width: 16px; height: 16px; }\n    .signal-title { font-size: 13px; font-weight: 700; color: var(--green-dark); }\n    .signal-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }\n\n    .ai-card {\n      background: linear-gradient(135deg, rgba(255,73,152,0.06), rgba(18,81,173,0.05));\n      border: 1px solid rgba(255,73,152,0.2);\n      border-radius: 12px; padding: 14px;\n    }\n    .ai-head {\n      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;\n      font-size: 11px; font-weight: 800; letter-spacing: 0.14em;\n      text-transform: uppercase; color: var(--pink);\n    }\n    .ai-head svg { width: 12px; height: 12px; }\n    .ai-rec {\n      font-size: 14px; color: var(--text); font-weight: 500; line-height: 1.55;\n    }\n    .ai-rec strong { font-weight: 700; color: var(--navy); }\n    .ai-opts {\n      display: flex; flex-direction: column; gap: 8px; margin-top: 12px;\n    }\n    .ai-opt {\n      display: flex; justify-content: space-between; align-items: center;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 10px; padding: 10px 12px; font-size: 13px;\n    }\n    .ai-opt-label { color: var(--text-muted); }\n    .ai-opt-value { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .ai-opt.recommended { border-color: var(--pink); background: rgba(255,73,152,0.04); }\n    .ai-opt.recommended .ai-opt-label { color: var(--pink); font-weight: 700; }\n\n    .ticket-row {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 10px 12px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 10px;\n      margin-bottom: 8px;\n    }\n    .ticket-row:last-child { margin-bottom: 0; }\n    .ticket-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .ticket-meta { font-size: 12px; color: var(--text-faint); margin-top: 1px; }\n\n    /* Toast */\n    .toast {\n      position: fixed; bottom: 28px; left: 50%;\n      transform: translateX(-50%) translateY(20px);\n      background: var(--navy-darker); color: #fff;\n      padding: 14px 20px; border-radius: 100px;\n      display: flex; align-items: center; gap: 10px;\n      font-size: 13px; font-weight: 600;\n      box-shadow: var(--shadow-lg); z-index: 80;\n      opacity: 0; pointer-events: none;\n      transition: all 0.25s cubic-bezier(.4,0,.2,1);\n    }\n    .toast.show {\n      opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto;\n    }\n    .toast-icon {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--green); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .toast-icon svg { width: 12px; height: 12px; }\n\n    @media (max-width: 1200px) {\n      .kpi-row { grid-template-columns: repeat(2, 1fr); }\n      .table-row { grid-template-columns: 32px 1.4fr 1.2fr 90px 100px 80px 120px 100px 110px; }\n    }\n  ";

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
          <div className="sb-brand-name">Black Bear Rentals</div>
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
          <a className="sb-nav-item active" href="leases.html">
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
          <a className="sb-nav-item" href="maintenance.html">
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
          <a href="leases.html">Leases</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Renewals</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, leases, invoices…" />
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

        
        <div className="page-head">
          <div>
            <h1>Renewals</h1>
            <p>7 leases expire in the next 90 days. Propose renewal terms and send tenant offers in bulk.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" id="previewBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              Preview offer
            </button>
            <button className="btn btn-ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Export
            </button>
          </div>
        </div>

        
        <div className="filter-bar">
          <div className="filter-group">
            <span>Expire within</span>
            <select className="filter-select" id="expireFilter">
              <option>Next 90 days</option>
              <option>Next 60 days</option>
              <option>Next 30 days</option>
            </select>
          </div>
          <div className="filter-group">
            <span>Property</span>
            <select className="filter-select">
              <option>All properties</option>
              <option>908 Lee Dr NW</option>
              <option>3026 Turf Ave NW</option>
              <option>1412 Oak St SE</option>
              <option>622 Meridian St</option>
            </select>
          </div>
          <div className="filter-group">
            <span>Status</span>
            <select className="filter-select">
              <option>All statuses</option>
              <option>Not started</option>
              <option>Offer sent</option>
              <option>Signed</option>
              <option>Declined</option>
              <option>Moved out</option>
            </select>
          </div>
          <div className="filter-spacer" />
          <button className="filter-reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            Reset
          </button>
        </div>

        
        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Expiring next 90d</div>
              <div className="kpi-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">7</div>
            <div className="kpi-card-delta neutral">2 inside 30 days</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Offers sent</div>
              <div className="kpi-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">3</div>
            <div className="kpi-card-delta neutral">Avg response 2.4 days</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Renewed</div>
              <div className="kpi-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">1</div>
            <div className="kpi-card-delta up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
              +$50/mo lift
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-head">
              <div className="kpi-card-label">Lost to move-out</div>
              <div className="kpi-card-icon gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
              </div>
            </div>
            <div className="kpi-card-value">0</div>
            <div className="kpi-card-delta neutral">0% churn YTD</div>
          </div>
        </div>

        
        <div className="bulk-bar" id="bulkBar">
          <label className="bulk-select">
            <input type="checkbox" className="cbx" id="selectAll" />
            <span id="selectLabel">Select all on page</span>
          </label>
          <div className="bulk-spacer" />
          <button className="btn btn-ghost btn-sm" id="editTermsBtn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
            Set default renewal terms for selected
          </button>
          <button className="btn btn-pink btn-sm" id="sendOffersBtn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
            Send offers to selected
          </button>
        </div>

        <div className="table-card" id="tableCard">
          <div className="table">
            <div className="table-row table-row-head">
              <div />
              <div>Tenant</div>
              <div>Property</div>
              <div>Current rent</div>
              <div>Lease ends</div>
              <div>Days left</div>
              <div>Proposed rent</div>
              <div>Term</div>
              <div>Status</div>
            </div>

            <div className="table-row" data-row="1" data-ends="May 13, 2026" data-days="29">
              <label><input type="checkbox" className="cbx row-cbx" data-row="1" /></label>
              <div className="table-tenant">
                <div className="table-avatar pink">MJ</div>
                <div>
                  <div className="table-tenant-name">Maya Jefferson</div>
                  <div className="table-tenant-meta">On-time 98% · 2.5 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">908 Lee Dr NW</div>
                <div className="table-property-unit">Unit A · 2 bed</div>
              </div>
              <div className="table-amount">$725</div>
              <div className="table-date">May 13, 2026</div>
              <div className="table-days urgent">29d</div>
              <div>
                <input type="text" className="rent-edit" value="$750" data-base="725" />
                <span className="rent-change up">+3.4% · +$25</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-gray"><span className="pill-dot" />Not started</span></div>
            </div>

            <div className="table-row" data-row="2" data-ends="May 31, 2026" data-days="47">
              <label><input type="checkbox" className="cbx row-cbx" data-row="2" /></label>
              <div className="table-tenant">
                <div className="table-avatar">TW</div>
                <div>
                  <div className="table-tenant-name">Travis Wheeler</div>
                  <div className="table-tenant-meta">On-time 100% · 3.1 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">3026 Turf Ave NW</div>
                <div className="table-property-unit">Unit 2 · 1 bed</div>
              </div>
              <div className="table-amount">$750</div>
              <div className="table-date">May 31, 2026</div>
              <div className="table-days warn">47d</div>
              <div>
                <input type="text" className="rent-edit" value="$775" data-base="750" />
                <span className="rent-change up">+3.3% · +$25</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Offer sent</span></div>
            </div>

            <div className="table-row" data-row="3" data-ends="June 10, 2026" data-days="57">
              <label><input type="checkbox" className="cbx row-cbx" data-row="3" /></label>
              <div className="table-tenant">
                <div className="table-avatar green">DR</div>
                <div>
                  <div className="table-tenant-name">Danielle Reyes</div>
                  <div className="table-tenant-meta">On-time 95% · 1.8 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">1412 Oak St SE</div>
                <div className="table-property-unit">Main house · 3 bed</div>
              </div>
              <div className="table-amount">$750</div>
              <div className="table-date">June 10, 2026</div>
              <div className="table-days warn">57d</div>
              <div>
                <input type="text" className="rent-edit" value="$750" data-base="750" />
                <span className="rent-change flat">Flat · no change</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-gray"><span className="pill-dot" />Not started</span></div>
            </div>

            <div className="table-row" data-row="4" data-ends="June 22, 2026" data-days="69">
              <label><input type="checkbox" className="cbx row-cbx" data-row="4" /></label>
              <div className="table-tenant">
                <div className="table-avatar orange">KB</div>
                <div>
                  <div className="table-tenant-name">Kareem Brooks</div>
                  <div className="table-tenant-meta">On-time 88% · 4.2 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">622 Meridian St</div>
                <div className="table-property-unit">Unit 4 · 1 bed</div>
              </div>
              <div className="table-amount">$750</div>
              <div className="table-date">June 22, 2026</div>
              <div className="table-days ok">69d</div>
              <div>
                <input type="text" className="rent-edit" value="$800" data-base="750" />
                <span className="rent-change up">+6.7% · +$50</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-green"><span className="pill-dot" />Signed</span></div>
            </div>

            <div className="table-row" data-row="5" data-ends="July 01, 2026" data-days="78">
              <label><input type="checkbox" className="cbx row-cbx" data-row="5" /></label>
              <div className="table-tenant">
                <div className="table-avatar">SP</div>
                <div>
                  <div className="table-tenant-name">Sarah Park</div>
                  <div className="table-tenant-meta">On-time 100% · 0.9 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">908 Lee Dr NW</div>
                <div className="table-property-unit">Unit B · 2 bed</div>
              </div>
              <div className="table-amount">$725</div>
              <div className="table-date">July 01, 2026</div>
              <div className="table-days ok">78d</div>
              <div>
                <input type="text" className="rent-edit" value="$750" data-base="725" />
                <span className="rent-change up">+3.4% · +$25</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Offer sent</span></div>
            </div>

            <div className="table-row" data-row="6" data-ends="July 09, 2026" data-days="86">
              <label><input type="checkbox" className="cbx row-cbx" data-row="6" /></label>
              <div className="table-tenant">
                <div className="table-avatar pink">AL</div>
                <div>
                  <div className="table-tenant-name">Alex Lindgren</div>
                  <div className="table-tenant-meta">On-time 93% · 2.0 yrs</div>
                </div>
              </div>
              <div>
                <div className="table-property">3026 Turf Ave NW</div>
                <div className="table-property-unit">Unit 1 · 2 bed</div>
              </div>
              <div className="table-amount">$775</div>
              <div className="table-date">July 09, 2026</div>
              <div className="table-days ok">86d</div>
              <div>
                <input type="text" className="rent-edit" value="$795" data-base="775" />
                <span className="rent-change up">+2.6% · +$20</span>
              </div>
              <div><span className="table-term">12 mo</span></div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Offer sent</span></div>
            </div>

            <div className="table-row" data-row="7" data-ends="July 12, 2026" data-days="89">
              <label><input type="checkbox" className="cbx row-cbx" data-row="7" /></label>
              <div className="table-tenant">
                <div className="table-avatar gray">RN</div>
                <div>
                  <div className="table-tenant-name">Rachel Novak</div>
                  <div className="table-tenant-meta">Gave notice · moving out</div>
                </div>
              </div>
              <div>
                <div className="table-property">1412 Oak St SE</div>
                <div className="table-property-unit">Basement · 1 bed</div>
              </div>
              <div className="table-amount">$650</div>
              <div className="table-date">July 12, 2026</div>
              <div className="table-days ok">89d</div>
              <div>
                <span style={{color: "var(--text-faint)", fontSize: "13px"}}>—</span>
              </div>
              <div><span className="table-term" style={{color: "var(--text-faint)"}}>—</span></div>
              <div><span className="pill pill-orange"><span className="pill-dot" />Moved out</span></div>
            </div>

          </div>
        </div>

        
        <div className="empty-state" id="emptyState" style={{display: "none"}}>
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h3>All caught up — no leases expiring in 90 days</h3>
          <p>We'll surface renewals here 90 days before each lease ends.</p>
        </div>

        
        <div className="page-footer-info">
          <div className="page-footer-info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          </div>
          <p><strong>How this works:</strong> The tenant sees the offer as a notification in their portal + email. They pick from your 3 options or decline. You see their response in this table — no back-and-forth texts needed.</p>
        </div>

      </div>

    </main>
  </div>

  
  <div className="modal-backdrop" id="modalBackdrop">
    <div className="modal">
      <div className="modal-head">
        <div>
          <h2>Set default renewal terms</h2>
          <p id="modalSub">Apply to <strong>0 selected</strong> tenants. You can still tweak any row individually.</p>
        </div>
        <button className="modal-close" id="modalClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="modal-body">

        <div className="field">
          <label className="field-label">Term length</label>
          <div className="segment" data-segment="term">
            <button className="segment-opt active" data-val="12mo">12 months</button>
            <button className="segment-opt" data-val="6mo">6 months</button>
            <button className="segment-opt" data-val="mtm">Month-to-month</button>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Rent change</label>
          <div className="segment" data-segment="rent">
            <button className="segment-opt" data-val="flat">Flat</button>
            <button className="segment-opt" data-val="2">+2%</button>
            <button className="segment-opt active" data-val="3">+3%</button>
            <button className="segment-opt" data-val="5">+5%</button>
            <button className="segment-opt" data-val="custom">Custom</button>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Offer expires in</label>
          <div className="segment" data-segment="expiry">
            <button className="segment-opt" data-val="7">7 days</button>
            <button className="segment-opt active" data-val="14">14 days</button>
            <button className="segment-opt" data-val="21">21 days</button>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Custom message (optional)</label>
          <textarea className="field-textarea" placeholder="Thanks for being a great tenant — here are three renewal options. Let me know which works best.">Thanks for being a great tenant — here are three renewal options. Let me know which works best.</textarea>
          <div className="field-hint">Included at the top of the tenant's renewal offer.</div>
        </div>

      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" id="modalCancel">Cancel</button>
        <button className="btn btn-primary btn-sm" id="modalApply">Apply to selected</button>
      </div>
    </div>
  </div>

  
  <div className="drawer-backdrop" id="drawerBackdrop" />
  <aside className="drawer" id="drawer">
    <div className="drawer-head">
      <div style={{flex: "1", minWidth: "0"}}>
        <div className="drawer-head-top">
          <div className="drawer-avatar pink" id="drawerAvatar" style={{background: "var(--pink-bg)", color: "var(--pink)"}}>MJ</div>
          <div style={{minWidth: "0"}}>
            <h2 id="drawerName">Maya Jefferson</h2>
            <div className="drawer-head-sub" id="drawerMeta">908 Lee Dr NW · Unit A · Ends May 13, 2026</div>
          </div>
        </div>
      </div>
      <button className="modal-close" id="drawerClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div className="drawer-body">

      <div className="drawer-section">
        <div className="info-grid">
          <div className="info-cell">
            <div className="info-cell-label">Current rent</div>
            <div className="info-cell-value">$725</div>
          </div>
          <div className="info-cell">
            <div className="info-cell-label">Tenure</div>
            <div className="info-cell-value">2.5 yrs</div>
          </div>
          <div className="info-cell">
            <div className="info-cell-label">On-time rate</div>
            <div className="info-cell-value green">98%</div>
          </div>
          <div className="info-cell">
            <div className="info-cell-label">Late payments</div>
            <div className="info-cell-value">1</div>
          </div>
        </div>
      </div>

      <div className="drawer-section">
        <div className="drawer-section-label">Rent history</div>
        <div className="history-row">
          <span className="history-row-label">Oct 2023 · Move-in</span>
          <span className="history-row-value">$685</span>
        </div>
        <div className="history-row">
          <span className="history-row-label">May 2024 · Renewal (+2.9%)</span>
          <span className="history-row-value">$705</span>
        </div>
        <div className="history-row">
          <span className="history-row-label">May 2025 · Renewal (+2.8%)</span>
          <span className="history-row-value">$725</span>
        </div>
      </div>

      <div className="drawer-section">
        <div className="drawer-section-label">Social signal</div>
        <div className="signal-bar">
          <div className="signal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div>
            <div className="signal-title">High-value tenant — keep them</div>
            <div className="signal-sub">30 of 30 rent cycles paid on-time. Zero noise complaints. 2 maintenance tickets, both same-day closed.</div>
          </div>
        </div>
      </div>

      <div className="drawer-section">
        <div className="drawer-section-label">Open maintenance tickets</div>
        <div className="ticket-row">
          <div>
            <div className="ticket-title">Kitchen faucet drip</div>
            <div className="ticket-meta">Opened 3 days ago · vendor scheduled</div>
          </div>
          <span className="pill pill-orange"><span className="pill-dot" />In progress</span>
        </div>
      </div>

      <div className="drawer-section">
        <div className="drawer-section-label">AI-suggested terms</div>
        <div className="ai-card">
          <div className="ai-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8L4 12l6.1 3.2L12 21l1.9-5.8L20 12l-6.1-3.2z" /></svg>
            Black Bear Rentals recommends
          </div>
          <div className="ai-rec">Offer <strong>$750 / 12 mo</strong> (+3.4%). Market comps at 908 Lee Dr average $755–$770. Her payment history supports a slight increase — she'll almost certainly renew.</div>
          <div className="ai-opts">
            <div className="ai-opt recommended">
              <span className="ai-opt-label">12-month renewal</span>
              <span className="ai-opt-value">$750/mo · +$25</span>
            </div>
            <div className="ai-opt">
              <span className="ai-opt-label">6-month renewal</span>
              <span className="ai-opt-value">$765/mo · +$40</span>
            </div>
            <div className="ai-opt">
              <span className="ai-opt-label">Month-to-month</span>
              <span className="ai-opt-value">$800/mo · +$75</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div className="drawer-foot">
      <button className="btn btn-ghost btn-sm" style={{flex: "1"}} id="drawerCancelBtn">Cancel</button>
      <a href="renew.html" className="btn btn-pink btn-sm" style={{flex: "2", justifyContent: "center"}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
        Send offer to tenant
      </a>
    </div>
  </aside>

  
  <div className="toast" id="toast">
    <div className="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    </div>
    <span id="toastMsg">3 renewal offers sent</span>
  </div>

  


    </>
  );
}
