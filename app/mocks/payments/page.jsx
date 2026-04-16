"use client";

// Mock ported from ~/Desktop/blackbear/payments.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Theme overrides (data-theme switches) ===== */\n    [data-theme=\"hearth\"] {\n      --navy: #8a6a1f;\n      --navy-dark: #6b4f12;\n      --navy-darker: #4a3608;\n      --blue: #c88318;\n      --blue-bright: #f5a623;\n      --blue-pale: #fdf0d4;\n      --pink: #1ea97c;\n      --pink-bg: rgba(30,169,124,0.12);\n      --pink-strong: rgba(30,169,124,0.22);\n      --text: #3a2e14;\n      --text-muted: #6b5830;\n      --text-faint: #9b8558;\n      --surface: #ffffff;\n      --surface-alt: #fdf6e8;\n      --surface-subtle: #fbf3e0;\n      --border: #ecdbb5;\n      --border-strong: #d4bd87;\n    }\n    [data-theme=\"nocturne\"] {\n      --navy: #000000;\n      --navy-dark: #000000;\n      --navy-darker: #000000;\n      --blue: #00e5ff;\n      --blue-bright: #00e5ff;\n      --blue-pale: rgba(0,229,255,0.12);\n      --pink: #ff00aa;\n      --pink-bg: rgba(255,0,170,0.15);\n      --pink-strong: rgba(255,0,170,0.28);\n      --text: #e8e8ff;\n      --text-muted: #a8a8c8;\n      --text-faint: #6868aa;\n      --surface: #12121e;\n      --surface-alt: #0a0a12;\n      --surface-subtle: #1a1a2e;\n      --border: #2a2a3a;\n      --border-strong: #3a3a4a;\n      --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);\n      --shadow: 0 4px 16px rgba(0,0,0,0.5);\n      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);\n    }\n    [data-theme=\"slate\"] {\n      --navy: #2a2a2e;\n      --navy-dark: #1a1a1e;\n      --navy-darker: #0e0e12;\n      --blue: #2c6fe0;\n      --blue-bright: #4a8af0;\n      --blue-pale: #edf3fc;\n      --pink: #2c6fe0;\n      --pink-bg: rgba(44,111,224,0.1);\n      --pink-strong: rgba(44,111,224,0.22);\n      --text: #1a1a1a;\n      --text-muted: #5a5a60;\n      --text-faint: #8a8a92;\n      --surface: #ffffff;\n      --surface-alt: #fafafa;\n      --surface-subtle: #f5f5f7;\n      --border: #e3e3e6;\n      --border-strong: #c0c0c8;\n    }\n\n\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 340px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    /* ===== Scroll wrap ===== */\n    .scroll-wrap { flex: 1; overflow-y: auto; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 20px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-bar h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; }\n    .page-head-actions { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-ghost-red { color: var(--red); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost-red:hover { border-color: var(--red); background: var(--red-bg); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Stats strip ===== */\n    .stats-strip {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 24px;\n      display: grid; grid-template-columns: repeat(5, 1fr);\n      gap: 24px; align-items: center;\n    }\n    .stat-item {\n      border-right: 1px solid var(--border); padding-right: 24px;\n    }\n    .stat-item:last-child { border-right: none; padding-right: 0; }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;\n    }\n    .stat-value {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1.1;\n      display: flex; align-items: baseline; gap: 8px;\n    }\n    .stat-delta { font-size: 11px; font-weight: 700; }\n    .stat-delta.up { color: var(--green-dark); }\n    .stat-delta.pink { color: var(--pink); }\n    .stat-delta.orange { color: var(--orange); }\n    .stat-delta.gray { color: var(--text-faint); }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* ===== Toolbar ===== */\n    .toolbar {\n      margin: 16px 28px 0;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; flex-wrap: wrap;\n    }\n    .saved-views {\n      display: flex; gap: 4px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 4px;\n    }\n    .saved-view {\n      padding: 7px 14px; border-radius: 100px;\n      font-size: 13px; font-weight: 600; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .saved-view:hover { color: var(--text); }\n    .saved-view.active { background: var(--navy); color: #fff; }\n    .saved-view-count {\n      background: var(--surface-alt); color: var(--text-muted);\n      padding: 1px 7px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .saved-view.active .saved-view-count { background: rgba(255,255,255,0.15); color: #fff; }\n    .saved-view-dot {\n      width: 6px; height: 6px; border-radius: 50%; background: var(--pink);\n    }\n\n    .toolbar-right { display: flex; gap: 10px; align-items: center; }\n    .filter-btn {\n      padding: 8px 14px; border-radius: 8px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .filter-btn:hover { border-color: var(--blue); color: var(--blue); }\n    .filter-btn svg { width: 14px; height: 14px; }\n    .filter-chip {\n      background: var(--blue-pale); color: var(--blue);\n      padding: 2px 8px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; margin-left: 4px;\n    }\n\n    .view-toggle {\n      display: flex; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 2px;\n    }\n    .view-toggle button {\n      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;\n      color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;\n      transition: all 0.15s ease;\n    }\n    .view-toggle button svg { width: 14px; height: 14px; }\n    .view-toggle button.active { background: var(--surface-alt); color: var(--text); }\n\n    /* ===== Payments table card ===== */\n    .table-card {\n      margin: 16px 28px 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .table-card-head {\n      padding: 14px 20px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n      background: var(--surface-subtle);\n    }\n    .table-card-title {\n      display: flex; align-items: center; gap: 10px;\n      font-size: 14px; font-weight: 700; color: var(--text);\n    }\n    .table-card-title-count {\n      background: var(--blue-pale); color: var(--blue);\n      padding: 2px 8px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n    }\n    .table-card-actions { display: flex; gap: 6px; align-items: center; }\n    .table-card-link {\n      font-size: 13px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 6px 10px; border-radius: 6px;\n    }\n    .table-card-link:hover { background: var(--blue-pale); }\n\n    .pay-table { width: 100%; }\n    .pay-thead {\n      display: grid;\n      grid-template-columns: 92px 1.6fr 110px 1.5fr 1.3fr 120px 120px 140px 48px;\n      gap: 14px; padding: 10px 20px;\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      border-bottom: 1px solid var(--border);\n      position: sticky; top: 0; z-index: 2;\n    }\n    .pay-row {\n      display: grid;\n      grid-template-columns: 92px 1.6fr 110px 1.5fr 1.3fr 120px 120px 140px 48px;\n      gap: 14px; padding: 14px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      transition: background 0.12s ease;\n      cursor: pointer; position: relative;\n    }\n    .pay-row:last-child { border-bottom: none; }\n    .pay-row:hover { background: var(--surface-subtle); }\n    .pay-row.selected { background: var(--blue-pale); }\n    .pay-row.bulked { outline: 2px solid var(--pink); outline-offset: -2px; background: var(--pink-bg); }\n\n    .pay-date { font-variant-numeric: tabular-nums; color: var(--text-muted); font-weight: 500; }\n    .pay-date strong { display: block; color: var(--text); font-weight: 700; }\n\n    .pay-tenant { display: flex; align-items: center; gap: 10px; min-width: 0; }\n    .pay-avatar {\n      width: 30px; height: 30px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 11px; color: var(--blue);\n      background: var(--blue-pale); flex-shrink: 0;\n    }\n    .pay-avatar.pink { background: var(--pink-bg); color: var(--pink); }\n    .pay-avatar.green { background: var(--green-bg); color: var(--green-dark); }\n    .pay-avatar.orange { background: var(--orange-bg); color: var(--orange); }\n    .pay-avatar.purple { background: var(--purple-bg); color: var(--purple); }\n    .pay-tenant-name { font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n\n    .type-badge {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 700;\n      padding: 3px 9px; border-radius: 6px;\n      text-transform: uppercase; letter-spacing: 0.04em;\n    }\n    .type-badge.charge { background: var(--blue-pale); color: var(--blue); }\n    .type-badge.payment { background: var(--green-bg); color: var(--green-dark); }\n    .type-badge.refund { background: var(--purple-bg); color: var(--purple); }\n    .type-badge.fee { background: var(--orange-bg); color: var(--orange); }\n\n    .pay-prop { color: var(--text-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .pay-prop strong { color: var(--text); font-weight: 600; display: block; font-size: 13px; }\n\n    .pay-method {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 12px; color: var(--text); font-weight: 500;\n      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n    }\n    .pay-method-icon {\n      width: 22px; height: 16px; border-radius: 3px;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 8px; font-weight: 800; color: #fff; flex-shrink: 0;\n      letter-spacing: 0.02em;\n    }\n    .pay-method-icon.visa { background: #1a1f71; }\n    .pay-method-icon.mc { background: #eb001b; }\n    .pay-method-icon.ach { background: var(--navy); font-size: 7px; }\n    .pay-method-icon.cash { background: var(--green-dark); }\n    .pay-method-icon.check { background: var(--text-muted); }\n    .pay-method-icon.none { background: var(--surface-alt); color: var(--text-faint); border: 1px dashed var(--border-strong); }\n    .pay-method-sub { color: var(--text-faint); font-size: 11px; margin-left: 4px; }\n\n    .pay-amount {\n      font-weight: 700; color: var(--text);\n      font-variant-numeric: tabular-nums;\n      text-align: right;\n    }\n    .pay-amount.negative { color: var(--purple); }\n\n    .pill {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 11px; font-weight: 700;\n      padding: 3px 9px; border-radius: 100px; white-space: nowrap;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-orange { background: var(--orange-bg); color: var(--orange); }\n    .pill-pink { background: var(--pink-bg); color: var(--pink); }\n    .pill-purple { background: var(--purple-bg); color: var(--purple); }\n    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }\n    .pill svg { width: 10px; height: 10px; }\n    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n\n    .stripe-ref {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 11px; color: var(--text-faint);\n      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n    }\n    .stripe-ref.has-ref { color: var(--blue); }\n    .stripe-ref.none { color: var(--text-faint); }\n\n    .pay-actions {\n      display: flex; gap: 2px; justify-content: flex-end;\n      opacity: 0; transition: opacity 0.15s ease;\n    }\n    .pay-row:hover .pay-actions { opacity: 1; }\n    .icon-btn {\n      width: 26px; height: 26px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); transition: all 0.12s ease;\n    }\n    .icon-btn:hover { background: var(--surface-alt); color: var(--blue); }\n    .icon-btn.refund:hover { background: var(--purple-bg); color: var(--purple); }\n    .icon-btn.resend:hover { background: var(--green-bg); color: var(--green-dark); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    /* Floating inline action cluster on hover (right edge) */\n    .row-actions-float {\n      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);\n      display: flex; gap: 4px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 3px;\n      box-shadow: var(--shadow);\n      opacity: 0; pointer-events: none;\n      transition: opacity 0.12s ease;\n      z-index: 2;\n    }\n    .pay-row:hover .row-actions-float { opacity: 1; pointer-events: auto; }\n    .row-actions-float .icon-btn { width: 24px; height: 24px; }\n\n    /* ===== Upcoming charges ===== */\n    .upcoming-wrap { margin: 20px 28px 28px; }\n    .upcoming-head {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-bottom: 12px;\n    }\n    .upcoming-head h2 {\n      font-size: 15px; font-weight: 700; color: var(--text);\n    }\n    .upcoming-head-sub {\n      font-size: 12px; color: var(--text-muted); margin-top: 2px;\n    }\n    .upcoming-head-link {\n      font-size: 13px; font-weight: 600; color: var(--blue);\n      display: inline-flex; align-items: center; gap: 4px;\n      padding: 6px 10px; border-radius: 6px;\n    }\n    .upcoming-head-link:hover { background: var(--blue-pale); }\n    .upcoming-head-link svg { width: 14px; height: 14px; }\n\n    .upcoming-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .upcoming-thead {\n      display: grid;\n      grid-template-columns: 120px 1.6fr 1.4fr 1fr 120px 120px;\n      gap: 14px; padding: 10px 20px;\n      background: var(--surface-alt);\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.06em;\n      border-bottom: 1px solid var(--border);\n    }\n    .upcoming-row {\n      display: grid;\n      grid-template-columns: 120px 1.6fr 1.4fr 1fr 120px 120px;\n      gap: 14px; padding: 12px 20px;\n      border-bottom: 1px solid var(--border);\n      align-items: center; font-size: 13px;\n      transition: background 0.12s ease;\n    }\n    .upcoming-row:last-child { border-bottom: none; }\n    .upcoming-row:hover { background: var(--surface-subtle); }\n\n    /* ===== DRAWER ===== */\n    .drawer-backdrop {\n      position: absolute; inset: 0;\n      background: rgba(26,31,54,0.3);\n      opacity: 1; transition: opacity 0.2s ease;\n      z-index: 40;\n      display: none;\n    }\n    .drawer {\n      position: absolute; top: 0; right: 0; bottom: 0;\n      width: 560px; background: var(--surface);\n      box-shadow: var(--shadow-xl);\n      display: none; flex-direction: column;\n      z-index: 41;\n      border-left: 1px solid var(--border);\n    }\n    .drawer-head {\n      padding: 22px 24px 20px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 16px;\n    }\n    .drawer-head-left { flex: 1; min-width: 0; }\n    .drawer-amount {\n      font-size: 34px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.02em; line-height: 1; font-variant-numeric: tabular-nums;\n    }\n    .drawer-amount.negative { color: var(--purple); }\n    .drawer-head-meta {\n      margin-top: 8px; display: flex; align-items: center; gap: 8px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .drawer-head-meta strong { color: var(--text); font-weight: 600; }\n    .drawer-head-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); }\n\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .drawer-close:hover { background: var(--border); color: var(--text); }\n    .drawer-close svg { width: 16px; height: 16px; }\n\n    .drawer-info-row {\n      padding: 14px 24px; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      gap: 16px; background: var(--surface-subtle);\n    }\n    .drawer-info-cell { min-width: 0; }\n    .drawer-info-label {\n      font-size: 10px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-bottom: 6px;\n    }\n    .drawer-info-val {\n      font-size: 13px; font-weight: 600; color: var(--text);\n      display: flex; align-items: center; gap: 6px;\n    }\n    .drawer-info-val.mono {\n      font-family: 'JetBrains Mono', monospace; font-size: 12px;\n      color: var(--blue); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\n    }\n\n    .drawer-tabs {\n      padding: 0 24px; display: flex; gap: 4px;\n      border-bottom: 1px solid var(--border);\n    }\n    .drawer-tab {\n      padding: 12px 14px; font-size: 13px; font-weight: 600;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;\n    }\n    .drawer-tab.active { color: var(--blue); border-bottom-color: var(--blue); }\n    .drawer-tab:hover:not(.active) { color: var(--text); }\n\n    .drawer-body {\n      flex: 1; overflow-y: auto; padding: 22px 24px;\n    }\n    .drawer-section { margin-bottom: 22px; }\n    .drawer-section:last-child { margin-bottom: 0; }\n    .drawer-section-head {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;\n    }\n    .drawer-row {\n      display: grid; grid-template-columns: 140px 1fr; gap: 12px;\n      padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border);\n    }\n    .drawer-row:last-child { border-bottom: none; }\n    .drawer-row > span:first-child { color: var(--text-muted); }\n    .drawer-row > span:last-child { color: var(--text); font-weight: 500; text-align: right; }\n    .drawer-row .mono {\n      font-family: 'JetBrains Mono', monospace; font-size: 12px;\n      color: var(--blue);\n    }\n\n    /* Receipt preview */\n    .receipt {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 20px;\n      position: relative;\n    }\n    .receipt-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      padding-bottom: 14px; border-bottom: 1px solid var(--border);\n      margin-bottom: 14px;\n    }\n    .receipt-brand { display: flex; align-items: center; gap: 10px; }\n    .receipt-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .receipt-logo svg { width: 16px; height: 16px; }\n    .receipt-brand-name { font-weight: 800; font-size: 15px; color: var(--text); }\n    .receipt-brand-sub { font-size: 11px; color: var(--text-muted); }\n    .receipt-meta { text-align: right; font-size: 11px; color: var(--text-muted); }\n    .receipt-meta strong { display: block; color: var(--text); font-size: 12px; }\n\n    .receipt-to {\n      font-size: 11px; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;\n    }\n    .receipt-to-name { font-size: 13px; font-weight: 600; color: var(--text); }\n    .receipt-to-addr { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }\n\n    .receipt-line {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 10px 0; font-size: 13px;\n      border-bottom: 1px solid var(--border);\n    }\n    .receipt-line-desc strong { display: block; font-weight: 600; color: var(--text); }\n    .receipt-line-desc span { font-size: 11px; color: var(--text-muted); }\n    .receipt-line-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .receipt-total {\n      display: flex; justify-content: space-between;\n      padding: 12px 0 4px; font-size: 15px;\n    }\n    .receipt-total-label { color: var(--text-muted); font-weight: 600; }\n    .receipt-total-amt { font-weight: 800; color: var(--text); font-size: 18px; font-variant-numeric: tabular-nums; }\n\n    .receipt-stamp {\n      position: absolute; top: 80px; right: 20px;\n      transform: rotate(-8deg);\n      border: 3px solid var(--green-dark); color: var(--green-dark);\n      padding: 6px 14px; border-radius: 6px;\n      font-weight: 800; font-size: 13px; letter-spacing: 0.1em;\n      opacity: 0.72;\n    }\n\n    /* Activity feed */\n    .activity-feed { position: relative; padding-left: 24px; }\n    .activity-feed::before {\n      content: \"\"; position: absolute; left: 10px; top: 4px; bottom: 4px;\n      width: 2px; background: var(--border);\n    }\n    .activity-node {\n      position: relative; padding: 0 0 18px 0;\n    }\n    .activity-node:last-child { padding-bottom: 0; }\n    .activity-node::before {\n      content: \"\"; position: absolute; left: -18px; top: 4px;\n      width: 10px; height: 10px; border-radius: 50%;\n      background: var(--blue-pale); border: 2px solid var(--blue);\n    }\n    .activity-node.pink::before { background: var(--pink-bg); border-color: var(--pink); }\n    .activity-node.green::before { background: var(--green-bg); border-color: var(--green); }\n    .activity-node.orange::before { background: var(--orange-bg); border-color: var(--orange); }\n    .activity-node-title { font-size: 13px; font-weight: 600; color: var(--text); }\n    .activity-node-body { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .activity-node-time { font-size: 11px; color: var(--text-faint); margin-top: 4px; }\n\n    /* Refund form */\n    .field { margin-bottom: 14px; }\n    .field-label {\n      font-size: 12px; font-weight: 600; color: var(--text);\n      margin-bottom: 6px; display: block;\n    }\n    .field-label .req { color: var(--pink); }\n    .field-input, .field-select, .field-textarea {\n      width: 100%; padding: 10px 12px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; font-size: 13px; color: var(--text);\n      outline: none; transition: border-color 0.15s ease;\n    }\n    .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(18,81,173,0.1); }\n    .field-textarea { resize: vertical; min-height: 80px; font-family: inherit; }\n    .field-input-wrap { position: relative; }\n    .field-input-wrap::before {\n      content: \"$\"; position: absolute; left: 12px; top: 50%;\n      transform: translateY(-50%);\n      font-weight: 700; color: var(--text-muted);\n    }\n    .field-input-wrap .field-input { padding-left: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }\n    .field-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }\n\n    .refund-preview {\n      margin-top: 14px; padding: 14px; border-radius: 10px;\n      background: var(--purple-bg);\n      font-size: 12px;\n    }\n    .refund-preview-row {\n      display: flex; justify-content: space-between; padding: 2px 0;\n      color: var(--text);\n    }\n    .refund-preview-row strong { font-weight: 700; }\n\n    /* Drawer footer */\n    .drawer-foot {\n      border-top: 1px solid var(--border); padding: 14px 24px;\n      display: flex; gap: 8px; background: var(--surface-alt);\n    }\n    .drawer-foot .btn { flex: 1; justify-content: center; }\n\n    /* ===== Bulk action bar ===== */\n    .bulk-bar {\n      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);\n      background: var(--navy-dark); color: #fff;\n      border-radius: 100px; padding: 10px 16px;\n      display: none; align-items: center; gap: 14px;\n      box-shadow: var(--shadow-xl);\n      z-index: 30;\n      font-size: 13px;\n    }\n    .bulk-count {\n      background: var(--pink); color: #fff;\n      width: 24px; height: 24px; border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 12px;\n    }\n    .bulk-bar-actions { display: flex; gap: 6px; }\n    .bulk-btn {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: #fff;\n      background: rgba(255,255,255,0.1);\n      display: inline-flex; align-items: center; gap: 5px;\n      transition: all 0.15s ease;\n    }\n    .bulk-btn:hover { background: rgba(255,255,255,0.18); }\n    .bulk-btn.primary { background: var(--pink); }\n    .bulk-btn.primary:hover { background: #e63882; }\n    .bulk-btn svg { width: 12px; height: 12px; }\n\n    @keyframes slideIn {\n      from { opacity: 0; transform: translateX(20px); }\n      to { opacity: 1; transform: translateX(0); }\n    }\n\n    @media (max-width: 1200px) {\n      .drawer { width: 460px; }\n      .pay-thead, .pay-row {\n        grid-template-columns: 80px 1.4fr 90px 1.2fr 120px 100px 110px 48px;\n      }\n      .pay-thead .col-ref, .pay-row .cell-ref { display: none; }\n    }\n  ";

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
            Dashboard
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>
            Applications
          </a>
        </div>
        <div className="sb-section-label" style={{marginTop: "20px"}}>Operations</div>
        <div className="sb-nav">
          <a className="sb-nav-item active" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Payments
          </a>
          <a className="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>Maintenance
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5" /></svg>Settings
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" /><path d="M14 2v6h6" /></svg>Documents
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
        </div>
      </div>
    </aside>

    
    <main className="main">

      
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Payments</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search payments, tenants, charges..." />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
        </div>
      </div>

      <div className="scroll-wrap">

        
        <div className="page-head-bar">
          <div>
            <h1>Payments</h1>
            <p>Rent collection, autopay, and reconciliation — your money in motion</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" data-action="Reconcile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.7" /><path d="m21 3-9 9-3-3" /></svg>
              Reconcile
            </button>
            <button className="btn btn-ghost" data-action="Record payment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
              Record payment
            </button>
            <button className="btn btn-primary" data-action="Charge tenant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Charge tenant
            </button>
          </div>
        </div>

        
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-label">Collected this month</div>
            <div className="stat-value">$24,850 <span className="stat-delta up">+12% MoM</span></div>
            <div className="stat-sub">Across 27 charges</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">On-time rate</div>
            <div className="stat-value">94% <span className="stat-delta up">+8%</span></div>
            <div className="stat-sub">vs. last 90 days</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">A/R aging</div>
            <div className="stat-value" style={{color: "var(--orange)"}}>$1,725 <span className="stat-delta orange">1 tenant late</span></div>
            <div className="stat-sub">Priya Patel · 2d</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Autopay enrollment</div>
            <div className="stat-value">73% <span className="stat-delta pink">+5%</span></div>
            <div className="stat-sub">8 of 11 active leases</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Refunds MTD</div>
            <div className="stat-value" style={{color: "var(--text-muted)"}}>$0 <span className="stat-delta gray">0 issued</span></div>
            <div className="stat-sub">Clean month</div>
          </div>
        </div>

        
        <div className="toolbar">
          <div className="saved-views">
            <div className="saved-view active" data-view="all">All <span className="saved-view-count">84</span></div>
            <div className="saved-view" data-view="charges">Charges <span className="saved-view-count">52</span></div>
            <div className="saved-view" data-view="payments">Payments <span className="saved-view-count">28</span></div>
            <div className="saved-view" data-view="refunds">Refunds <span className="saved-view-count">2</span></div>
            <div className="saved-view" data-view="autopay">Autopay <span className="saved-view-count">32</span></div>
            <div className="saved-view" data-view="late">
              <span className="saved-view-dot" style={{background: "var(--red)"}} />
              Late <span className="saved-view-count">3</span>
            </div>
            <div className="saved-view" data-view="pending">Pending <span className="saved-view-count">2</span></div>
            <div className="saved-view" data-view="failed">Failed <span className="saved-view-count">1</span></div>
          </div>

          <div className="toolbar-right">
            <button className="filter-btn" data-filter="Filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></svg>
              Filter
              <span className="filter-chip">April 2026</span>
            </button>
            <button className="filter-btn" data-filter="Sort">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 4v16" /></svg>
              Sort · Date
            </button>
            <div className="view-toggle">
              <button className="active" data-view-toggle="table">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                Table
              </button>
              <button data-view-toggle="calendar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Calendar
              </button>
            </div>
          </div>
        </div>

        
        <div className="table-card">
          <div className="table-card-head">
            <div className="table-card-title">
              Transactions
              <span className="table-card-title-count" id="txn-count">18 shown</span>
            </div>
            <div className="table-card-actions">
              <button className="table-card-link" data-action="Export CSV">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Export CSV
              </button>
              <button className="table-card-link" data-action="Send statements">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Send statements
              </button>
            </div>
          </div>

          <div className="pay-table">
            <div className="pay-thead">
              <div>Date</div>
              <div>Tenant</div>
              <div>Type</div>
              <div>Property</div>
              <div>Method</div>
              <div style={{textAlign: "right"}}>Amount</div>
              <div>Status</div>
              <div className="col-ref">Stripe ref</div>
              <div />
            </div>
            <div id="pay-tbody" />
          </div>
        </div>

        
        <div className="upcoming-wrap">
          <div className="upcoming-head">
            <div>
              <h2>Upcoming charges</h2>
              <div className="upcoming-head-sub">Next 7 days of scheduled rent</div>
            </div>
            <a className="upcoming-head-link" data-action="Manage schedule">
              Manage schedule
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="upcoming-card">
            <div className="upcoming-thead">
              <div>Due date</div>
              <div>Tenant</div>
              <div>Property</div>
              <div>Method</div>
              <div style={{textAlign: "right"}}>Amount</div>
              <div>Status</div>
            </div>
            <div className="upcoming-row">
              <div><strong>Apr 15</strong></div>
              <div className="pay-tenant">
                <div className="pay-avatar green">KW</div>
                <div className="pay-tenant-name">Kai Wong</div>
              </div>
              <div className="pay-prop"><strong>1523 Oak Ave</strong></div>
              <div className="pay-method">
                <div className="pay-method-icon ach">ACH</div>
                Autopay
              </div>
              <div className="pay-amount" style={{textAlign: "right"}}>$1,350.00</div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Scheduled</span></div>
            </div>
            <div className="upcoming-row">
              <div><strong>Apr 18</strong></div>
              <div className="pay-tenant">
                <div className="pay-avatar orange">DH</div>
                <div className="pay-tenant-name">Devon Harris</div>
              </div>
              <div className="pay-prop"><strong>2909 Wilson</strong> · Room D</div>
              <div className="pay-method">
                <div className="pay-method-icon visa">VISA</div>
                Card
              </div>
              <div className="pay-amount" style={{textAlign: "right"}}>$900.00</div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Scheduled</span></div>
            </div>
            <div className="upcoming-row">
              <div><strong>Apr 20</strong></div>
              <div className="pay-tenant">
                <div className="pay-avatar purple">NA</div>
                <div className="pay-tenant-name">Nina Alvarez</div>
              </div>
              <div className="pay-prop"><strong>88 Pine St</strong> · Unit 2</div>
              <div className="pay-method">
                <div className="pay-method-icon ach">ACH</div>
                Autopay
              </div>
              <div className="pay-amount" style={{textAlign: "right"}}>$1,625.00</div>
              <div><span className="pill pill-blue"><span className="pill-dot" />Scheduled</span></div>
            </div>
            <div className="upcoming-row">
              <div><strong>Apr 20</strong></div>
              <div className="pay-tenant">
                <div className="pay-avatar pink">RB</div>
                <div className="pay-tenant-name">Ryan Bowers</div>
              </div>
              <div className="pay-prop"><strong>2907 Wilson</strong> · Room B</div>
              <div className="pay-method">
                <div className="pay-method-icon none">?</div>
                Not enrolled
              </div>
              <div className="pay-amount" style={{textAlign: "right"}}>$875.00</div>
              <div><span className="pill pill-orange"><span className="pill-dot" />Awaiting autopay</span></div>
            </div>
          </div>
        </div>

      </div>

      
      <div className="drawer-backdrop" />

      
      <aside className="drawer">
        <div className="drawer-head">
          <div className="drawer-head-left">
            <div className="drawer-amount" id="drawer-amount">$850.00</div>
            <div className="drawer-head-meta">
              <strong id="drawer-tenant">Sarah Chen</strong>
              <span className="dot" />
              <span id="drawer-property">2909 Wilson Dr NW · Room A</span>
            </div>
          </div>
          <button className="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="drawer-info-row">
          <div className="drawer-info-cell">
            <div className="drawer-info-label">Status</div>
            <div className="drawer-info-val"><span className="pill pill-green" id="drawer-status"><span className="pill-dot" />Paid</span></div>
          </div>
          <div className="drawer-info-cell">
            <div className="drawer-info-label">Method</div>
            <div className="drawer-info-val" id="drawer-method">
              <div className="pay-method-icon ach">ACH</div>
              Autopay
            </div>
          </div>
          <div className="drawer-info-cell">
            <div className="drawer-info-label">Date</div>
            <div className="drawer-info-val" id="drawer-processed">Apr 1, 2026</div>
          </div>
          <div className="drawer-info-cell">
            <div className="drawer-info-label">Ref</div>
            <div className="drawer-info-val mono" id="drawer-ref">pi_3Nf8...GT7</div>
          </div>
        </div>

        <div className="drawer-tabs">
          <button className="drawer-tab active" data-tab="overview">Overview</button>
          <button className="drawer-tab" data-tab="receipt">Receipt</button>
          <button className="drawer-tab" data-tab="activity">Activity</button>
          <button className="drawer-tab" data-tab="refund">Refund</button>
        </div>

        <div className="drawer-body" id="drawer-body" />

        <div className="drawer-foot">
          <button className="btn btn-ghost" data-drawer-action="send-receipt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Send receipt
          </button>
          <button className="btn btn-ghost-red" data-drawer-action="issue-refund">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-15-6.7L3 13" /></svg>
            Issue refund
          </button>
          <button className="btn btn-primary" data-drawer-action="download-pdf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download PDF
          </button>
        </div>
      </aside>

      
      <div className="bulk-bar">
        <div className="bulk-count">0</div>
        <span>transactions selected</span>
        <div className="bulk-bar-actions">
          <button className="bulk-btn primary" data-bulk="Send statements">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Send statements
          </button>
          <button className="bulk-btn" data-bulk="Export CSV">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export CSV
          </button>
          <button className="bulk-btn" data-bulk="Mark reconciled">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Mark reconciled
          </button>
        </div>
      </div>

    </main>

  </div>

  
  <div id="toast-container" style={{position: "fixed", bottom: "24px", right: "24px", zIndex: "100", display: "flex", flexDirection: "column", gap: "8px"}} />

  

    </>
  );
}
