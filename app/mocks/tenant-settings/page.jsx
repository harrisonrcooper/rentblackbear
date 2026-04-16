"use client";

// Mock ported from ~/Desktop/blackbear/tenant-settings.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* ===== Workspace brand tokens (Black Bear Rentals) ===== */\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 32px;\n      height: 72px;\n      display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 2px 0 rgba(0,0,0,0.04);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n      color: #fff;\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n\n    .tb-nav { display: flex; gap: 2px; align-items: center; }\n    .tb-nav-item {\n      padding: 10px 16px; border-radius: 100px;\n      color: rgba(255,255,255,0.7); font-weight: 600; font-size: 13px;\n      display: flex; align-items: center; gap: 8px;\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.08); }\n    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.14); }\n    .tb-nav-item svg { width: 15px; height: 15px; }\n\n    .tb-right { display: flex; align-items: center; gap: 14px; }\n    .tb-bell {\n      position: relative; width: 36px; height: 36px; border-radius: 50%;\n      background: rgba(255,255,255,0.08); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .tb-bell:hover { background: rgba(255,255,255,0.16); }\n    .tb-bell svg { width: 16px; height: 16px; }\n    .tb-bell-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); border: 2px solid var(--brand-darker); }\n\n    .tb-avatar {\n      display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 12px;\n      border-radius: 100px; background: rgba(255,255,255,0.08);\n      transition: all 0.15s ease;\n    }\n    .tb-avatar:hover { background: rgba(255,255,255,0.16); }\n    .tb-avatar-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .tb-avatar-img {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 12px;\n    }\n\n    /* ===== Main wrap ===== */\n    .wrap { max-width: 720px; margin: 0 auto; padding: 32px 28px; }\n\n    .page-head { margin-bottom: 22px; }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .page-head p { color: var(--text-muted); font-size: 14px; }\n\n    /* ===== Sub-nav tabs ===== */\n    .subnav {\n      display: flex; gap: 4px; border-bottom: 1px solid var(--border);\n      margin-bottom: 28px; overflow-x: auto; scrollbar-width: none;\n    }\n    .subnav::-webkit-scrollbar { display: none; }\n    .subnav-item {\n      padding: 12px 16px; font-weight: 600; font-size: 13px;\n      color: var(--text-muted); border-bottom: 2px solid transparent;\n      transition: all 0.15s ease; white-space: nowrap;\n      margin-bottom: -1px;\n    }\n    .subnav-item:hover { color: var(--brand); }\n    .subnav-item.active { color: var(--brand); border-bottom-color: var(--brand); }\n\n    /* ===== Panels ===== */\n    .panel { display: none; }\n    .panel.active { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n\n    /* ===== Cards / sections ===== */\n    .card {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 22px;\n      box-shadow: var(--shadow-sm);\n      margin-bottom: 16px;\n    }\n    .card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 14px; }\n    .card-title { font-size: 15px; font-weight: 700; color: var(--text); }\n    .card-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; }\n    .card-link { color: var(--brand); font-size: 12px; font-weight: 600; cursor: pointer; }\n    .card-link:hover { text-decoration: underline; }\n\n    .note {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius); padding: 12px 14px;\n      font-size: 12.5px; color: var(--brand-dark);\n      display: flex; gap: 10px; align-items: flex-start;\n    }\n    .note svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--brand); }\n\n    /* ===== Form ===== */\n    .field { margin-bottom: 14px; }\n    .field-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }\n    .input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .input[readonly] { background: var(--surface-subtle); color: var(--text-muted); cursor: not-allowed; }\n    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n    .field-hint { font-size: 11.5px; color: var(--text-faint); margin-top: 5px; }\n\n    /* ===== Avatar upload ===== */\n    .avatar-block { display: flex; align-items: center; gap: 18px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }\n    .avatar-big {\n      width: 72px; height: 72px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 26px; flex-shrink: 0;\n      box-shadow: var(--shadow);\n    }\n    .avatar-meta { flex: 1; }\n    .avatar-meta-title { font-weight: 700; font-size: 14px; margin-bottom: 3px; }\n    .avatar-meta-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }\n    .avatar-actions { display: flex; gap: 8px; }\n\n    .drop-zone {\n      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);\n      padding: 20px; text-align: center; cursor: pointer;\n      transition: all 0.15s ease; background: var(--surface-subtle);\n      margin-top: 12px; display: none;\n    }\n    .drop-zone.show { display: block; animation: fadeIn 0.2s ease; }\n    .drop-zone:hover { border-color: var(--brand); background: var(--brand-pale); }\n    .drop-zone svg { width: 28px; height: 28px; color: var(--text-faint); margin: 0 auto 6px; }\n    .drop-zone-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .drop-zone-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n\n    /* ===== Buttons ===== */\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }\n    .btn-sm { padding: 7px 14px; font-size: 12.5px; }\n    .btn-primary { background: var(--brand); color: #fff; }\n    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n    .btn-danger { color: var(--red); border: 1px solid var(--border); background: var(--surface); }\n    .btn-danger:hover { border-color: var(--red); background: var(--red-bg); }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Notifications matrix ===== */\n    .notif-matrix {\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      overflow: hidden; background: var(--surface);\n    }\n    .notif-row {\n      display: grid; grid-template-columns: 1fr repeat(3, 64px);\n      align-items: center; gap: 10px;\n      padding: 14px 18px; border-bottom: 1px solid var(--border);\n    }\n    .notif-row:last-child { border-bottom: none; }\n    .notif-row.head {\n      background: var(--surface-subtle); padding: 10px 18px;\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .notif-row.head > div:not(:first-child) { text-align: center; }\n    .notif-type { font-weight: 600; font-size: 13px; color: var(--text); }\n    .notif-type-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; font-weight: 400; }\n    .notif-cell { display: flex; justify-content: center; }\n\n    /* ===== Toggle switch ===== */\n    .toggle {\n      width: 36px; height: 20px; border-radius: 100px;\n      background: var(--border-strong); position: relative;\n      cursor: pointer; transition: background 0.2s ease;\n      flex-shrink: 0;\n    }\n    .toggle::after {\n      content: \"\"; position: absolute; top: 2px; left: 2px;\n      width: 16px; height: 16px; border-radius: 50%;\n      background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n      transition: transform 0.2s ease;\n    }\n    .toggle.on { background: var(--brand); }\n    .toggle.on::after { transform: translateX(16px); }\n    .toggle-lg { width: 44px; height: 24px; }\n    .toggle-lg::after { width: 20px; height: 20px; }\n    .toggle-lg.on::after { transform: translateX(20px); }\n\n    .dnd-block { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 0; margin-top: 14px; border-top: 1px solid var(--border); gap: 16px; flex-wrap: wrap; }\n    .dnd-title { font-weight: 600; font-size: 13px; }\n    .dnd-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .dnd-times { display: flex; align-items: center; gap: 8px; }\n    .dnd-times .input { padding: 8px 10px; font-size: 13px; width: 96px; }\n\n    /* ===== Payment methods ===== */\n    .autopay-card {\n      background: linear-gradient(135deg, var(--brand-dark), var(--brand));\n      color: #fff; border-radius: var(--radius-lg);\n      padding: 20px 22px; display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 10px 30px rgba(20,77,49,0.18); gap: 14px;\n    }\n    .autopay-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 5px; }\n    .autopay-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 3px; }\n    .autopay-sub { font-size: 13px; color: rgba(255,255,255,0.85); }\n    .autopay-pill {\n      background: rgba(255,255,255,0.18); color: #fff;\n      padding: 5px 12px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    .autopay-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: #7eead0; box-shadow: 0 0 0 3px rgba(126,234,208,0.25); }\n\n    .method-row {\n      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;\n      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);\n      background: var(--surface); margin-bottom: 10px;\n    }\n    .method-row.default { border-color: var(--brand); background: var(--brand-pale); }\n    .method-icon {\n      width: 42px; height: 30px; border-radius: 5px;\n      background: linear-gradient(135deg, #1a1f36, #3a4160);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.04em;\n    }\n    .method-icon.bank { background: linear-gradient(135deg, var(--brand), var(--brand-bright)); }\n    .method-label { font-weight: 600; font-size: 13px; color: var(--text); }\n    .method-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 8px; }\n    .default-pill {\n      font-size: 10px; font-weight: 700; color: var(--brand-dark);\n      background: rgba(30,111,71,0.18); padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .method-actions { display: flex; gap: 6px; }\n    .icon-btn {\n      width: 28px; height: 28px; border-radius: 7px;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: inline-flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .icon-btn:hover { background: var(--brand-pale); color: var(--brand); }\n    .icon-btn.danger:hover { background: var(--red-bg); color: var(--red); }\n    .icon-btn svg { width: 14px; height: 14px; }\n\n    .add-method {\n      margin-top: 4px; padding: 14px 16px;\n      border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg);\n      color: var(--text-muted); font-weight: 600; font-size: 13px;\n      display: flex; align-items: center; justify-content: center; gap: 8px;\n      transition: all 0.15s ease; cursor: pointer; width: 100%;\n    }\n    .add-method:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }\n    .add-method svg { width: 14px; height: 14px; }\n\n    /* ===== Security ===== */\n    .sec-row {\n      display: flex; align-items: center; justify-content: space-between; gap: 14px;\n      padding: 16px 0; border-bottom: 1px solid var(--border);\n    }\n    .sec-row:last-child { border-bottom: none; }\n    .sec-label { font-weight: 600; font-size: 14px; }\n    .sec-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; }\n\n    .session-item {\n      display: grid; grid-template-columns: 36px 1fr auto; gap: 14px; align-items: center;\n      padding: 14px 0; border-bottom: 1px solid var(--border);\n    }\n    .session-item:last-child { border-bottom: none; }\n    .session-icon {\n      width: 36px; height: 36px; border-radius: 9px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .session-icon svg { width: 16px; height: 16px; }\n    .session-title { font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px; }\n    .session-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n    .current-pill {\n      font-size: 10px; font-weight: 700; color: var(--green-dark);\n      background: var(--green-bg); padding: 2px 8px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n\n    /* ===== Data & privacy ===== */\n    .priv-who {\n      display: flex; align-items: center; gap: 14px;\n      padding: 14px 0; border-bottom: 1px solid var(--border);\n    }\n    .priv-who:last-child { border-bottom: none; }\n    .priv-avatar {\n      width: 38px; height: 38px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 13px; flex-shrink: 0;\n    }\n    .priv-avatar.op { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); }\n    .priv-body { flex: 1; min-width: 0; }\n    .priv-name { font-weight: 600; font-size: 13.5px; }\n    .priv-role { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n    .access-pill {\n      font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .access-full { background: var(--brand-pale); color: var(--brand-dark); }\n    .access-limited { background: var(--accent-bg); color: var(--accent); }\n\n    .deletion-card {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px; margin-top: 14px;\n      font-size: 12.5px; color: var(--text-muted); line-height: 1.55;\n    }\n    .deletion-card strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Modal ===== */\n    .modal-bg {\n      position: fixed; inset: 0; background: rgba(14,56,34,0.45);\n      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;\n      z-index: 50; display: flex; align-items: center; justify-content: center;\n      padding: 20px;\n    }\n    .modal-bg.open { opacity: 1; pointer-events: auto; }\n    .modal {\n      background: var(--surface); width: 100%; max-width: 460px;\n      border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);\n      transform: translateY(16px) scale(0.98); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);\n      overflow: hidden; max-height: 92vh; display: flex; flex-direction: column;\n    }\n    .modal-bg.open .modal { transform: none; }\n    .modal-head {\n      padding: 20px 22px; border-bottom: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .modal-head h2 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }\n    .modal-close {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .modal-close:hover { background: var(--red-bg); color: var(--red); }\n    .modal-close svg { width: 14px; height: 14px; }\n    .modal-body { padding: 22px; overflow-y: auto; }\n    .modal-foot {\n      padding: 14px 22px; border-top: 1px solid var(--border);\n      background: var(--surface-subtle);\n      display: flex; gap: 10px; justify-content: flex-end;\n    }\n\n    /* ===== Stripe Elements mock ===== */\n    .stripe-mock {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px; margin-bottom: 12px;\n      display: flex; align-items: center; gap: 12px;\n    }\n    .stripe-mock-icon {\n      width: 30px; height: 20px; border-radius: 4px;\n      background: linear-gradient(135deg, #635bff, #8079ff);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-size: 9px; font-weight: 800;\n    }\n    .stripe-mock-placeholder {\n      color: var(--text-faint); font-size: 14px; font-family: 'SF Mono', Consolas, monospace;\n    }\n\n    /* ===== QR placeholder ===== */\n    .qr-box {\n      width: 168px; height: 168px; margin: 0 auto 14px;\n      background:\n        linear-gradient(45deg, var(--text) 25%, transparent 25%, transparent 75%, var(--text) 75%),\n        linear-gradient(45deg, var(--text) 25%, transparent 25%, transparent 75%, var(--text) 75%);\n      background-size: 16px 16px;\n      background-position: 0 0, 8px 8px;\n      background-color: #fff;\n      border: 6px solid var(--text); border-radius: 8px;\n      position: relative;\n    }\n    .qr-box::after {\n      content: \"\"; position: absolute; inset: 30%;\n      background: #fff; border: 3px solid var(--text); border-radius: 4px;\n    }\n    .recovery-codes {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px; margin-top: 14px;\n      font-family: 'SF Mono', Consolas, monospace; font-size: 13px;\n      color: var(--text);\n    }\n\n    /* ===== Footer ===== */\n    .legal-foot {\n      max-width: 720px; margin: 40px auto 28px; padding: 0 28px;\n      color: var(--text-faint); font-size: 11px; display: flex;\n      justify-content: space-between; flex-wrap: wrap; gap: 10px;\n    }\n    .legal-foot a { color: var(--text-muted); }\n    .legal-foot a:hover { color: var(--brand); text-decoration: underline; }\n    .legal-foot-left { display: flex; align-items: center; gap: 8px; }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    /* ===== Toast ===== */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 80; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n      min-width: 240px;\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); flex-shrink: 0; }\n    .toast-progress {\n      height: 3px; background: rgba(255,255,255,0.15); border-radius: 100px;\n      overflow: hidden; flex: 1;\n    }\n    .toast-progress-fill {\n      height: 100%; background: var(--brand-bright); width: 0;\n      transition: width 0.1s linear;\n    }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    @media (max-width: 780px) {\n      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }\n      .tb-nav { overflow-x: auto; width: 100%; }\n      .wrap { padding: 20px 16px; }\n      .field-row { grid-template-columns: 1fr; }\n      .notif-row { grid-template-columns: 1fr repeat(3, 52px); padding: 12px 14px; gap: 6px; }\n    }\n  ";

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
      <a className="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" /></svg>
        Home
      </a>
      <a className="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        Pay rent
      </a>
      <a className="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
        Maintenance
      </a>
      <a className="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
        Documents
      </a>
      <a className="tb-nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        Settings
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
    <div className="page-head">
      <h1>Account settings</h1>
      <p>Manage your profile, notifications, payments, security, and data for your Black Bear lease.</p>
    </div>

    <nav className="subnav" role="tablist">
      <button className="subnav-item active" data-tab="profile">Profile</button>
      <button className="subnav-item" data-tab="notifications">Notifications</button>
      <button className="subnav-item" data-tab="payments">Payment methods</button>
      <button className="subnav-item" data-tab="security">Security</button>
      <button className="subnav-item" data-tab="privacy">Data &amp; privacy</button>
    </nav>

    
    <section className="panel active" data-panel="profile">
      <div className="card">
        <div className="avatar-block">
          <div className="avatar-big" id="avatarBig">MT</div>
          <div className="avatar-meta">
            <div className="avatar-meta-title">Profile photo</div>
            <div className="avatar-meta-sub">PNG or JPG, up to 5MB. Visible to your operator and housemates.</div>
            <div className="avatar-actions">
              <button className="btn btn-ghost btn-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Upload
              </button>
              <button className="btn btn-ghost btn-sm">Remove</button>
            </div>
          </div>
        </div>

        <div className="drop-zone" id="dropZone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <div className="drop-zone-title">Drop an image here, or click to browse</div>
          <div className="drop-zone-sub">Square images work best. Max 5MB.</div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">Legal name</label>
            <input className="input" value="Maya Elena Thompson" readOnly />
            <div className="field-hint"><a className="card-link">Request name change</a> — this is the name on your lease.</div>
          </div>
          <div className="field">
            <label className="field-label">Display name</label>
            <input className="input" value="Maya" />
            <div className="field-hint">Shown in chat and to housemates.</div>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" type="email" value="maya.thompson@northstar.edu" />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">Phone</label>
            <input className="input" type="tel" value="(256) 555-0173" />
          </div>
          <div className="field">
            <label className="field-label">Date of birth</label>
            <input className="input" value="March 14, 2003" readOnly />
            <div className="field-hint">Verified during application.</div>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Emergency contact</label>
          <div className="field-row">
            <input className="input" placeholder="Name" value="Rosa Thompson (mother)" />
            <input className="input" placeholder="Phone" value="(256) 555-0144" />
          </div>
        </div>

        <div className="note" style={{marginTop: "6px"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          <div>Keep your contact info current — we use it for rent reminders, maintenance coordination, and lease-of-record accuracy.</div>
        </div>

        <div style={{display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "18px"}}>
          <button className="btn btn-ghost">Discard</button>
          <button className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="notifications">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">How you hear from us</div>
            <div className="card-sub">Choose how each type reaches you. You can always reach us by replying in-app.</div>
          </div>
        </div>

        <div className="notif-matrix" id="notifMatrix">
          <div className="notif-row head">
            <div>Type</div>
            <div>Email</div>
            <div>SMS</div>
            <div>Push</div>
          </div>
          
        </div>

        <div className="dnd-block">
          <div>
            <div className="dnd-title">Do not disturb</div>
            <div className="dnd-sub">Pause non-urgent alerts during these hours. Urgent maintenance still pages you.</div>
          </div>
          <div className="dnd-times">
            <input className="input" type="time" value="21:00" />
            <span style={{color: "var(--text-muted)", fontSize: "12px"}}>to</span>
            <input className="input" type="time" value="08:00" />
            <div className="toggle on" />
          </div>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="payments">
      <div className="autopay-card" style={{marginBottom: "16px"}}>
        <div>
          <div className="autopay-label">Autopay</div>
          <div className="autopay-title">$750.00 on May 1</div>
          <div className="autopay-sub">Bank ••6891 · runs 2 business days early</div>
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px"}}>
          <span className="autopay-pill"><span className="dot" /> On</span>
          <a className="card-link" style={{color: "rgba(255,255,255,0.85)", fontSize: "11.5px"}}>Pause</a>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Your methods</div>
            <div className="card-sub">Bank transfers are free. Cards add a 2.9% processing fee.</div>
          </div>
        </div>

        <div className="method-row default">
          <div className="method-icon bank">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-6 9 6v2H3v-2z" /><path d="M5 12v7M9 12v7M15 12v7M19 12v7M3 21h18" /></svg>
          </div>
          <div>
            <div className="method-label">Regions Checking ••6891</div>
            <div className="method-sub">
              <span className="default-pill">Default</span>
              <span>Added Feb 2026</span>
            </div>
          </div>
          <div className="method-actions">
            <button className="icon-btn" title="Replace">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            </button>
            <button className="icon-btn danger" title="Remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
            </button>
          </div>
        </div>

        <div className="method-row">
          <div className="method-icon">VISA</div>
          <div>
            <div className="method-label">Visa ••4242</div>
            <div className="method-sub"><span>Expires 09/28</span></div>
          </div>
          <div className="method-actions">
            <button className="icon-btn" title="Make default">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </button>
            <button className="icon-btn danger" title="Remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
            </button>
          </div>
        </div>

        <button className="add-method">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add bank or card
        </button>
      </div>
    </section>

    
    <section className="panel" data-panel="security">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Password</div>
            <div className="card-sub">Last changed Feb 12, 2026.</div>
          </div>
          <button className="btn btn-ghost btn-sm">Change password</button>
        </div>

        <div className="sec-row">
          <div>
            <div className="sec-label">Two-factor authentication</div>
            <div className="sec-sub">Add a second step when signing in from a new device.</div>
          </div>
          <div className="toggle toggle-lg" id="mfaToggle" />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Active sessions</div>
            <div className="card-sub">Devices signed in to your Black Bear account.</div>
          </div>
          <button className="btn btn-danger btn-sm">Sign out all</button>
        </div>

        <div className="session-item">
          <div className="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
          </div>
          <div>
            <div className="session-title">iPhone 15 · Safari <span className="current-pill">This device</span></div>
            <div className="session-sub">Huntsville, AL · Active now</div>
          </div>
          <button className="icon-btn" title="Details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          </button>
        </div>

        <div className="session-item">
          <div className="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </div>
          <div>
            <div className="session-title">MacBook Pro · Chrome</div>
            <div className="session-sub">Huntsville, AL · 3 hours ago</div>
          </div>
          <button className="icon-btn danger" title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>

        <div className="session-item">
          <div className="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
          </div>
          <div>
            <div className="session-title">iPad · Safari</div>
            <div className="session-sub">Nashville, TN · 2 days ago</div>
          </div>
          <button className="icon-btn danger" title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
      </div>
    </section>

    
    <section className="panel" data-panel="privacy">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Download your data</div>
            <div className="card-sub">Your profile, payment history, leases, and maintenance tickets as a ZIP.</div>
          </div>
          <button className="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export ZIP
          </button>
        </div>

        <div className="note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <div>Your data is workspace-isolated. Harrison (your operator) cannot see tenants from any other Black Bear Rentals workspace, and other operators cannot see you.</div>
        </div>

        <div className="deletion-card">
          <strong>Delete my account</strong> — you can request deletion at any time. We acknowledge within 24 hours and complete within 30 days. A few financial records (rent receipts, tax-relevant ledger entries) are retained for 7 years per IRS requirements, but all personal data is removed. <a className="card-link">Start deletion request</a>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Who can see your info</div>
            <div className="card-sub">People in your Black Bear workspace.</div>
          </div>
        </div>

        <div className="priv-who">
          <div className="priv-avatar op">HC</div>
          <div className="priv-body">
            <div className="priv-name">Harrison Cooper</div>
            <div className="priv-role">Operator · Black Bear Rentals</div>
          </div>
          <span className="access-pill access-full">Full access</span>
        </div>

        <div className="priv-who">
          <div className="priv-avatar">JR</div>
          <div className="priv-body">
            <div className="priv-name">Jordan R.</div>
            <div className="priv-role">Housemate · Room A</div>
          </div>
          <span className="access-pill access-limited">Name &amp; initial only</span>
        </div>

        <div className="priv-who">
          <div className="priv-avatar">SP</div>
          <div className="priv-body">
            <div className="priv-name">Sam P.</div>
            <div className="priv-role">Housemate · Room B</div>
          </div>
          <span className="access-pill access-limited">Name &amp; initial only</span>
        </div>
      </div>
    </section>

  </main>

  <footer className="legal-foot">
    <div className="legal-foot-left">
      <span>Powered by Black Bear Rentals</span>
      <span>·</span>
      <span>Your data is workspace-isolated</span>
    </div>
    <div>
      <a href="security.html">Security &amp; privacy</a>
    </div>
  </footer>

  
  <div className="modal-bg" id="addMethodModal">
    <div className="modal">
      <div className="modal-head">
        <h2>Add payment method</h2>
        <button className="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="modal-body">
        <div style={{display: "flex", gap: "8px", marginBottom: "18px"}}>
          <button className="btn btn-primary btn-sm" style={{flex: "1"}}>Link bank (Plaid)</button>
          <button className="btn btn-ghost btn-sm" style={{flex: "1"}}>Card</button>
        </div>
        <div className="field">
          <label className="field-label">Card number</label>
          <div className="stripe-mock">
            <div className="stripe-mock-icon">S</div>
            <div className="stripe-mock-placeholder">1234 1234 1234 1234</div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label">Expiry</label>
            <div className="stripe-mock"><div className="stripe-mock-placeholder">MM / YY</div></div>
          </div>
          <div className="field">
            <label className="field-label">CVC</label>
            <div className="stripe-mock"><div className="stripe-mock-placeholder">CVC</div></div>
          </div>
        </div>
        <div className="field">
          <label className="field-label">ZIP</label>
          <div className="stripe-mock"><div className="stripe-mock-placeholder">35816</div></div>
        </div>
        <div className="field-hint" style={{marginTop: "4px"}}>Card payments include a 2.9% processing fee. Secured by Stripe.</div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Add card</button>
      </div>
    </div>
  </div>

  
  <div className="modal-bg" id="passwordModal">
    <div className="modal">
      <div className="modal-head">
        <h2>Change password</h2>
        <button className="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="modal-body">
        <div className="field">
          <label className="field-label">Current password</label>
          <input className="input" type="password" placeholder="••••••••" />
        </div>
        <div className="field">
          <label className="field-label">New password</label>
          <input className="input" type="password" placeholder="At least 12 characters" />
          <div className="field-hint">Use a passphrase — three random words is stronger than &lt;symbols!&gt;.</div>
        </div>
        <div className="field">
          <label className="field-label">Confirm new password</label>
          <input className="input" type="password" placeholder="Repeat it" />
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Update password</button>
      </div>
    </div>
  </div>

  
  <div className="modal-bg" id="mfaModal">
    <div className="modal">
      <div className="modal-head">
        <h2>Set up two-factor auth</h2>
        <button className="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="modal-body">
        <div style={{textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px"}}>Scan with 1Password, Google Authenticator, or Authy.</div>
        <div className="qr-box" />
        <div style={{textAlign: "center", fontFamily: "'SF Mono',Consolas,monospace", fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px"}}>or enter: JBSWY3DPEHPK3PXP</div>
        <div className="field">
          <label className="field-label">Enter 6-digit code</label>
          <input className="input" placeholder="000000" maxLength="6" style={{letterSpacing: "0.3em", textAlign: "center", fontFamily: "'SF Mono',Consolas,monospace"}} />
        </div>
        <div style={{fontSize: "12px", fontWeight: "700", color: "var(--text)", marginTop: "14px", marginBottom: "6px"}}>Recovery codes</div>
        <div style={{fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px"}}>Save these somewhere safe. Each works once.</div>
        <div className="recovery-codes">
          <div>4f3a-9c21</div><div>b8e1-7d04</div>
          <div>2a5f-c6b9</div><div>e0d3-1a87</div>
          <div>76bc-9f2e</div><div>c41d-58a3</div>
          <div>9e82-0b7f</div><div>3d64-af15</div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Turn on 2FA</button>
      </div>
    </div>
  </div>

  
  <div className="modal-bg" id="signoutModal">
    <div className="modal" style={{maxWidth: "400px"}}>
      <div className="modal-head">
        <h2>Sign out everywhere?</h2>
        <button className="modal-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="modal-body">
        <p style={{fontSize: "13.5px", color: "var(--text)", lineHeight: "1.6"}}>This will end all 3 active sessions, including this one. You'll need to sign back in with your password and 2FA code.</p>
      </div>
      <div className="modal-foot">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary" style={{background: "var(--red)"}}>Sign out all</button>
      </div>
    </div>
  </div>

  <div className="toast-stack" id="toastStack" />

  


    </>
  );
}
