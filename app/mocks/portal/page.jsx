"use client";

// Mock ported from ~/Desktop/blackbear/portal.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* ===== Workspace brand tokens (Black Bear Rentals — intentionally NOT Black Bear Rentals Flagship) ===== */\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* ===== Topbar (branded, NOT Black Bear Rentals) ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 32px;\n      height: 72px;\n      display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 2px 0 rgba(0,0,0,0.04);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n      color: #fff;\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n\n    .tb-nav { display: flex; gap: 2px; align-items: center; }\n    .tb-nav-item {\n      padding: 10px 16px; border-radius: 100px;\n      color: rgba(255,255,255,0.7); font-weight: 600; font-size: 13px;\n      display: flex; align-items: center; gap: 8px;\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.08); }\n    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.14); }\n    .tb-nav-item svg { width: 15px; height: 15px; }\n\n    .tb-right { display: flex; align-items: center; gap: 14px; }\n    .tb-bell {\n      position: relative; width: 36px; height: 36px; border-radius: 50%;\n      background: rgba(255,255,255,0.08); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .tb-bell:hover { background: rgba(255,255,255,0.16); }\n    .tb-bell svg { width: 16px; height: 16px; }\n    .tb-bell-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); border: 2px solid var(--brand-darker); }\n\n    .tb-avatar {\n      display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 12px;\n      border-radius: 100px; background: rgba(255,255,255,0.08);\n      transition: all 0.15s ease;\n    }\n    .tb-avatar:hover { background: rgba(255,255,255,0.16); }\n    .tb-avatar-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .tb-avatar-img {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px;\n    }\n\n    /* ===== Main content ===== */\n    .wrap { max-width: 1040px; margin: 0 auto; padding: 32px; }\n\n    .panel { display: none; }\n    .panel.active { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n\n    .page-head { margin-bottom: 24px; }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head p { color: var(--text-muted); font-size: 14px; }\n\n    /* ===== Hero card (Home) ===== */\n    .pay-hero {\n      background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%);\n      color: #fff;\n      border-radius: var(--radius-xl);\n      padding: 32px;\n      display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;\n      position: relative; overflow: hidden;\n      box-shadow: 0 20px 50px rgba(20,77,49,0.22);\n      margin-bottom: 20px;\n    }\n    .pay-hero::after {\n      content: \"\"; position: absolute; top: -40px; right: -40px;\n      width: 220px; height: 220px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(199,132,59,0.25), transparent 70%);\n    }\n    .pay-hero-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }\n    .pay-hero-amount { font-size: 48px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px; }\n    .pay-hero-due { font-size: 14px; color: rgba(255,255,255,0.85); }\n    .pay-hero-due strong { color: #fff; font-weight: 700; }\n    .pay-hero-actions { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }\n    .btn-pay {\n      background: #fff; color: var(--brand-dark);\n      padding: 14px 28px; border-radius: 100px;\n      font-weight: 700; font-size: 15px;\n      display: inline-flex; align-items: center; gap: 10px;\n      transition: all 0.15s ease; white-space: nowrap;\n      box-shadow: 0 6px 20px rgba(0,0,0,0.2);\n    }\n    .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.28); }\n    .btn-pay svg { width: 16px; height: 16px; }\n    .btn-autopay {\n      background: rgba(255,255,255,0.15); color: #fff;\n      padding: 11px 22px; border-radius: 100px;\n      font-weight: 600; font-size: 13px;\n      display: inline-flex; align-items: center; gap: 8px;\n      transition: all 0.15s ease;\n      border: 1px solid rgba(255,255,255,0.25);\n    }\n    .btn-autopay:hover { background: rgba(255,255,255,0.22); }\n    .btn-autopay svg { width: 14px; height: 14px; }\n\n    /* ===== Card grid ===== */\n    .home-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-top: 20px; }\n\n    .card {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 22px;\n      box-shadow: var(--shadow-sm);\n    }\n    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }\n    .card-title { font-size: 15px; font-weight: 700; color: var(--text); }\n    .card-link { color: var(--brand); font-size: 12px; font-weight: 600; }\n    .card-link:hover { text-decoration: underline; }\n\n    .kv-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }\n    .kv-row:last-child { border-bottom: none; }\n    .kv-row .kv-key { color: var(--text-muted); }\n    .kv-row .kv-val { color: var(--text); font-weight: 600; }\n\n    /* ===== Activity ===== */\n    .activity-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }\n    .activity-item:last-child { border-bottom: none; }\n    .activity-icon {\n      width: 34px; height: 34px; border-radius: 10px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .activity-icon.paid { background: var(--green-bg); color: var(--green-dark); }\n    .activity-icon.ticket { background: var(--accent-bg); color: var(--accent); }\n    .activity-icon svg { width: 16px; height: 16px; }\n    .activity-body { flex: 1; min-width: 0; }\n    .activity-title { font-weight: 600; color: var(--text); font-size: 13px; margin-bottom: 2px; }\n    .activity-meta { font-size: 12px; color: var(--text-muted); }\n\n    /* ===== Quick actions ===== */\n    .qa-list { display: flex; flex-direction: column; gap: 8px; }\n    .qa-item {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border-radius: var(--radius);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .qa-item:hover { border-color: var(--brand); background: var(--brand-pale); }\n    .qa-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .qa-item:hover .qa-icon { background: var(--brand); color: #fff; }\n    .qa-icon svg { width: 16px; height: 16px; }\n    .qa-label { font-weight: 600; font-size: 13px; color: var(--text); flex: 1; }\n    .qa-item svg.chev { width: 14px; height: 14px; color: var(--text-faint); }\n\n    /* ===== Payment methods ===== */\n    .method-row {\n      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;\n      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);\n      background: var(--surface); margin-bottom: 10px;\n    }\n    .method-row.default { border-color: var(--brand); background: var(--brand-pale); }\n    .method-icon {\n      width: 40px; height: 28px; border-radius: 5px;\n      background: linear-gradient(135deg, #1a1f36, #3a4160);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.04em;\n    }\n    .method-icon.bank { background: linear-gradient(135deg, var(--brand), var(--brand-bright)); }\n    .method-label { font-weight: 600; font-size: 13px; color: var(--text); }\n    .method-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .default-pill {\n      font-size: 10px; font-weight: 700; color: var(--brand-dark);\n      background: rgba(30,111,71,0.18); padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n\n    .add-method {\n      margin-top: 6px; padding: 14px 16px;\n      border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg);\n      color: var(--text-muted); font-weight: 600; font-size: 13px;\n      display: flex; align-items: center; justify-content: center; gap: 8px;\n      transition: all 0.15s ease; cursor: pointer; width: 100%;\n    }\n    .add-method:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }\n    .add-method svg { width: 14px; height: 14px; }\n\n    /* ===== Payment history table ===== */\n    .table {\n      width: 100%; border-collapse: collapse; font-size: 13px;\n    }\n    .table th {\n      text-align: left; padding: 10px 14px; font-weight: 700;\n      color: var(--text-muted); font-size: 11px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .table td {\n      padding: 14px; border-bottom: 1px solid var(--border);\n      color: var(--text);\n    }\n    .table tr:last-child td { border-bottom: none; }\n    .table tr:hover td { background: var(--surface-subtle); }\n    .table-amount { font-weight: 700; font-variant-numeric: tabular-nums; }\n    .pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-amber { background: var(--accent-bg); color: var(--accent); }\n    .pill-red { background: var(--red-bg); color: var(--red); }\n    .icon-btn {\n      width: 28px; height: 28px; border-radius: 7px;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: inline-flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .icon-btn:hover { background: var(--brand-pale); color: var(--brand); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    /* ===== Maintenance form ===== */\n    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .field { margin-bottom: 16px; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .input, textarea.input, select.input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    textarea.input { resize: vertical; min-height: 110px; line-height: 1.5; }\n    select.input {\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235e6b62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;\n    }\n\n    .priority-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n    .priority {\n      border: 2px solid var(--border); border-radius: var(--radius);\n      padding: 12px; text-align: center; background: var(--surface);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .priority:hover { border-color: var(--brand); }\n    .priority.selected.low { border-color: var(--green); background: var(--green-bg); }\n    .priority.selected.med { border-color: var(--amber); background: var(--accent-bg); }\n    .priority.selected.urgent { border-color: var(--red); background: var(--red-bg); }\n    .priority-label { font-weight: 700; font-size: 13px; color: var(--text); }\n    .priority-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    .drop-zone {\n      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);\n      padding: 24px; text-align: center; cursor: pointer;\n      transition: all 0.15s ease; background: var(--surface-subtle);\n    }\n    .drop-zone:hover { border-color: var(--brand); background: var(--brand-pale); }\n    .drop-zone svg { width: 32px; height: 32px; color: var(--text-faint); margin: 0 auto 8px; }\n    .drop-zone-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .drop-zone-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n\n    /* ===== Tickets list ===== */\n    .ticket-row {\n      display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px;\n      align-items: center; padding: 16px 18px;\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      background: var(--surface); margin-bottom: 10px;\n      transition: all 0.15s ease;\n    }\n    .ticket-row:hover { border-color: var(--brand-bright); box-shadow: var(--shadow-sm); transform: translateY(-1px); }\n    .ticket-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .ticket-icon.done { background: var(--green-bg); color: var(--green-dark); }\n    .ticket-icon svg { width: 18px; height: 18px; }\n    .ticket-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }\n    .ticket-meta { font-size: 12px; color: var(--text-muted); display: flex; gap: 10px; align-items: center; }\n    .ticket-meta svg { width: 11px; height: 11px; }\n\n    /* ===== Documents ===== */\n    .doc-row {\n      display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px;\n      align-items: center; padding: 14px 16px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); margin-bottom: 8px;\n      transition: all 0.15s ease;\n    }\n    .doc-row:hover { border-color: var(--brand); }\n    .doc-icon {\n      width: 36px; height: 44px; border-radius: 5px;\n      background: linear-gradient(135deg, var(--brand-pale), var(--brand-soft));\n      color: var(--brand); display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; position: relative; font-size: 9px; font-weight: 800;\n    }\n    .doc-icon::after {\n      content: \"\"; position: absolute; top: 0; right: 0; width: 10px; height: 10px;\n      background: var(--surface); border-left: 1px solid var(--border); border-bottom: 1px solid var(--border);\n    }\n    .doc-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }\n    .doc-meta { font-size: 12px; color: var(--text-muted); }\n\n    /* ===== Pay drawer ===== */\n    .drawer-bg {\n      position: fixed; inset: 0; background: rgba(14,56,34,0.45);\n      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;\n      z-index: 50; display: flex; align-items: center; justify-content: center;\n      padding: 20px;\n    }\n    .drawer-bg.open { opacity: 1; pointer-events: auto; }\n    .drawer {\n      background: var(--surface); width: 100%; max-width: 460px;\n      border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);\n      transform: translateY(20px) scale(0.98); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);\n      overflow: hidden;\n    }\n    .drawer-bg.open .drawer { transform: none; }\n    .drawer-head {\n      padding: 22px 24px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .drawer-head h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }\n    .drawer-close {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .drawer-close:hover { background: var(--red-bg); color: var(--red); }\n    .drawer-close svg { width: 16px; height: 16px; }\n    .drawer-body { padding: 22px 24px; }\n    .drawer-foot {\n      padding: 16px 24px; border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; gap: 10px; justify-content: flex-end;\n    }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; }\n    .btn-primary { background: var(--brand); color: #fff; }\n    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n\n    .pay-summary {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius); padding: 14px 16px; margin-bottom: 18px;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .pay-summary-label { font-size: 12px; color: var(--brand-dark); font-weight: 600; }\n    .pay-summary-amount { font-size: 24px; font-weight: 800; color: var(--brand-dark); letter-spacing: -0.02em; }\n\n    .method-pick {\n      display: flex; align-items: center; gap: 14px; padding: 14px;\n      border: 2px solid var(--border); border-radius: var(--radius);\n      margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease;\n    }\n    .method-pick:hover { border-color: var(--brand); }\n    .method-pick.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .method-pick-radio {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      position: relative; transition: all 0.15s ease;\n    }\n    .method-pick.selected .method-pick-radio {\n      border-color: var(--brand); background: var(--brand);\n    }\n    .method-pick.selected .method-pick-radio::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n\n    /* ===== Footer ===== */\n    .legal-foot {\n      max-width: 1040px; margin: 40px auto 28px; padding: 0 32px;\n      color: var(--text-faint); font-size: 11px; display: flex;\n      justify-content: space-between; flex-wrap: wrap; gap: 10px;\n    }\n    .legal-foot a:hover { color: var(--brand); }\n    .legal-foot-left { display: flex; align-items: center; gap: 8px; }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    /* ===== Toast ===== */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 80; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    @media (max-width: 780px) {\n      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }\n      .tb-nav { overflow-x: auto; width: 100%; }\n      .wrap { padding: 20px 16px; }\n      .pay-hero { grid-template-columns: 1fr; text-align: left; }\n      .home-grid, .form-grid { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z" /><circle cx="9" cy="9" r="0.8" fill="currentColor" /><circle cx="15" cy="9" r="0.8" fill="currentColor" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Black Bear Rentals</div>
        <div className="tb-brand-sub">Tenant portal</div>
      </div>
    </div>

    <nav className="tb-nav">
      <a className="tb-nav-item active" data-panel="home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" /></svg>
        Home
      </a>
      <a className="tb-nav-item" data-panel="payments">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        Pay rent
      </a>
      <a className="tb-nav-item" data-panel="maintenance">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        Maintenance
      </a>
      <a className="tb-nav-item" data-panel="documents">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
        Documents
      </a>
    </nav>

    <div className="tb-right">
      <button className="tb-bell">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
        <span className="tb-bell-dot" />
      </button>
      <div className="tb-avatar">
        <span className="tb-avatar-name">Maya Thompson</span>
        <div className="tb-avatar-img">MT</div>
      </div>
    </div>
  </header>

  <main className="wrap">

    
    <section className="panel active" data-panel="home">
      <div className="page-head">
        <h1>Welcome back, Maya</h1>
        <p>Room C · 908 Lee Drive · Lease through Dec 31, 2026</p>
      </div>

      <div className="pay-hero">
        <div>
          <div className="pay-hero-label">Next payment</div>
          <div className="pay-hero-amount">$750.00</div>
          <div className="pay-hero-due">Due <strong>May 1, 2026</strong> · 17 days</div>
        </div>
        <div className="pay-hero-actions">
          <button className="btn-pay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            Pay now
          </button>
          <button className="btn-autopay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            <span id="autopayLabel">Turn on autopay</span>
          </button>
        </div>
      </div>

      <div className="home-grid">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Recent activity</div>
            <a className="card-link" data-jump="payments">View all</a>
          </div>
          <div className="activity-item">
            <div className="activity-icon paid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
            <div className="activity-body">
              <div className="activity-title">April rent — $750.00 paid</div>
              <div className="activity-meta">Apr 1, 2026 · Bank · ••6891</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon ticket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></div>
            <div className="activity-body">
              <div className="activity-title">Leaky kitchen faucet — in progress</div>
              <div className="activity-meta">Opened Apr 10 · Joel (plumber) assigned Apr 11</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon paid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
            <div className="activity-body">
              <div className="activity-title">March rent — $750.00 paid</div>
              <div className="activity-meta">Mar 1, 2026 · Bank · ••6891</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Quick actions</div>
          </div>
          <div className="qa-list">
            <button className="qa-item" data-jump="maintenance">
              <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></div>
              <span className="qa-label">Submit a request</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <button className="qa-item" data-jump="documents">
              <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></div>
              <span className="qa-label">Download my lease</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <a className="qa-item" href="mailto:hello@rentblackbear.com">
              <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg></div>
              <span className="qa-label">Contact my landlord</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </a>
            <a className="qa-item" href="moveout.html">
              <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg></div>
              <span className="qa-label">Give move-out notice</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </a>
          </div>

          <div className="card-head" style={{marginTop: "22px", marginBottom: "10px"}}>
            <div className="card-title">Your lease</div>
          </div>
          <div className="kv-row"><span className="kv-key">Unit</span><span className="kv-val">Room C</span></div>
          <div className="kv-row"><span className="kv-key">Rent</span><span className="kv-val">$750 / mo</span></div>
          <div className="kv-row"><span className="kv-key">Due</span><span className="kv-val">1st of each month</span></div>
          <div className="kv-row"><span className="kv-key">Ends</span><span className="kv-val">Dec 31, 2026</span></div>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="payments">
      <div className="page-head">
        <h1>Pay rent</h1>
        <p>Manage your payment methods, turn on autopay, and review past payments.</p>
      </div>

      <div className="pay-hero" style={{marginBottom: "24px"}}>
        <div>
          <div className="pay-hero-label">Due May 1</div>
          <div className="pay-hero-amount">$750.00</div>
          <div className="pay-hero-due">You have <strong>17 days</strong> · No late fees before May 6</div>
        </div>
        <div className="pay-hero-actions">
          <button className="btn-pay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            Pay $750 now
          </button>
        </div>
      </div>

      <div className="card" style={{marginBottom: "16px"}}>
        <div className="card-head">
          <div className="card-title">Payment methods</div>
        </div>
        <div className="method-row default">
          <div className="method-icon bank">ACH</div>
          <div>
            <div className="method-label">Chase checking ••6891</div>
            <div className="method-sub">No fees · 1–2 business days</div>
          </div>
          <span className="default-pill">Default</span>
        </div>
        <div className="method-row">
          <div className="method-icon">VISA</div>
          <div>
            <div className="method-label">Visa ••4278</div>
            <div className="method-sub">2.95% processing fee applies</div>
          </div>
          <button className="icon-btn" title="Set as default">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </button>
        </div>
        <button className="add-method">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add payment method
        </button>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Payment history</div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Method</th><th style={{textAlign: "right"}}>Amount</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            <tr>
              <td>Apr 1, 2026</td><td>April rent</td><td>Bank ••6891</td>
              <td className="table-amount" style={{textAlign: "right"}}>$750.00</td>
              <td><span className="pill pill-green">Paid</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td>Mar 1, 2026</td><td>March rent</td><td>Bank ••6891</td>
              <td className="table-amount" style={{textAlign: "right"}}>$750.00</td>
              <td><span className="pill pill-green">Paid</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td>Feb 1, 2026</td><td>February rent</td><td>Bank ••6891</td>
              <td className="table-amount" style={{textAlign: "right"}}>$750.00</td>
              <td><span className="pill pill-green">Paid</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td>Jan 1, 2026</td><td>January rent</td><td>Visa ••4278</td>
              <td className="table-amount" style={{textAlign: "right"}}>$771.93</td>
              <td><span className="pill pill-green">Paid</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
            <tr>
              <td>Dec 1, 2025</td><td>December rent</td><td>Bank ••6891</td>
              <td className="table-amount" style={{textAlign: "right"}}>$750.00</td>
              <td><span className="pill pill-green">Paid</span></td>
              <td><button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    
    <section className="panel" data-panel="maintenance">
      <div className="page-head">
        <h1>Maintenance</h1>
        <p>Submit a request and track anything currently being worked on. Your landlord is notified instantly.</p>
      </div>

      <div className="card" style={{marginBottom: "20px"}}>
        <div className="card-head">
          <div className="card-title">Submit a new request</div>
        </div>
        <form id="maintForm">
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Category</label>
              <select className="input">
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>HVAC / heating / AC</option>
                <option>Appliance</option>
                <option>Exterior / yard</option>
                <option>Pest</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Location in unit</label>
              <select className="input">
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Bedroom (my room)</option>
                <option>Shared living area</option>
                <option>Laundry</option>
                <option>Exterior</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Title</label>
            <input className="input" type="text" placeholder="Short description (e.g. Kitchen sink dripping)" required />
          </div>

          <div className="field">
            <label className="field-label">Details</label>
            <textarea className="input" placeholder="When did it start? How bad is it? Any steps you've already tried?" required />
          </div>

          <div className="field">
            <label className="field-label">Priority</label>
            <div className="priority-row" id="priorityRow">
              <div className="priority low" data-pri="low">
                <div className="priority-label">Low</div>
                <div className="priority-sub">Can wait a week</div>
              </div>
              <div className="priority med selected" data-pri="med">
                <div className="priority-label">Normal</div>
                <div className="priority-sub">Fix this week</div>
              </div>
              <div className="priority urgent" data-pri="urgent">
                <div className="priority-label">Urgent</div>
                <div className="priority-sub">Safety or flooding</div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Photos (optional but helpful)</label>
            <div className="drop-zone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <div className="drop-zone-title">Tap to add photos</div>
              <div className="drop-zone-sub">Up to 5 photos · helps the handyman come prepared</div>
            </div>
          </div>

          <div style={{display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px"}}>
            <button type="submit" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Submit request
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Your requests</div>
        </div>
        <div id="ticketsList">
          <div className="ticket-row">
            <div className="ticket-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            </div>
            <div>
              <div className="ticket-title">Leaky kitchen faucet</div>
              <div className="ticket-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> Opened Apr 10</span>
                <span>Joel (plumber) assigned · visit Apr 15</span>
              </div>
            </div>
            <span className="pill pill-amber">In progress</span>
            <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
          </div>
          <div className="ticket-row">
            <div className="ticket-icon done">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <div className="ticket-title">Bedroom outlet not working</div>
              <div className="ticket-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> Resolved Mar 22</span>
                <span>GFCI reset · closed by Harrison</span>
              </div>
            </div>
            <span className="pill pill-green">Resolved</span>
            <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
          </div>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="documents">
      <div className="page-head">
        <h1>Documents</h1>
        <p>Everything your landlord has shared with you, plus every receipt we've generated.</p>
      </div>

      <div className="card">
        <div className="doc-row">
          <div className="doc-icon">PDF</div>
          <div>
            <div className="doc-title">Signed lease — 908 Lee Drive, Room C</div>
            <div className="doc-meta">Signed Dec 28, 2025 · 12 pages · 486 KB</div>
          </div>
          <span className="pill pill-green">Active</span>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
        </div>
        <div className="doc-row">
          <div className="doc-icon">PDF</div>
          <div>
            <div className="doc-title">Move-in inspection report</div>
            <div className="doc-meta">Completed Jan 2, 2026 · 4 pages · 1.2 MB</div>
          </div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
        <div className="doc-row">
          <div className="doc-icon">PDF</div>
          <div>
            <div className="doc-title">House rules &amp; quiet hours</div>
            <div className="doc-meta">Updated Jan 1, 2026 · 2 pages · 88 KB</div>
          </div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
        <div className="doc-row">
          <div className="doc-icon">PDF</div>
          <div>
            <div className="doc-title">Receipt — April rent</div>
            <div className="doc-meta">Apr 1, 2026 · $750.00 · Bank ••6891</div>
          </div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
        <div className="doc-row">
          <div className="doc-icon">PDF</div>
          <div>
            <div className="doc-title">Receipt — March rent</div>
            <div className="doc-meta">Mar 1, 2026 · $750.00 · Bank ••6891</div>
          </div>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></button>
          <button className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
      </div>
    </section>

  </main>

  <footer className="legal-foot">
    <div className="legal-foot-left">
      <span>&copy; 2026 Black Bear Rentals</span>
      <span>·</span>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>

  
  <div className="drawer-bg" id="payDrawer">
    <div className="drawer">
      <div className="drawer-head">
        <h2>Pay May rent</h2>
        <button className="drawer-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="drawer-body">
        <div className="pay-summary">
          <div>
            <div className="pay-summary-label">Amount due</div>
            <div className="pay-summary-amount">$750.00</div>
          </div>
          <div style={{textAlign: "right", fontSize: "11px", color: "var(--text-muted)"}}>
            Rent for May 2026<br />Due May 1
          </div>
        </div>

        <label className="field-label" style={{marginBottom: "10px"}}>Payment method</label>
        <div className="method-pick selected" data-method="bank">
          <div className="method-pick-radio" />
          <div className="method-icon bank">ACH</div>
          <div style={{flex: "1"}}>
            <div className="method-label">Chase checking ••6891</div>
            <div className="method-sub">No fees</div>
          </div>
        </div>
        <div className="method-pick" data-method="card">
          <div className="method-pick-radio" />
          <div className="method-icon">VISA</div>
          <div style={{flex: "1"}}>
            <div className="method-label">Visa ••4278</div>
            <div className="method-sub">+$22.13 processing fee</div>
          </div>
        </div>
      </div>
      <div className="drawer-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Pay $750.00
        </button>
      </div>
    </div>
  </div>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
