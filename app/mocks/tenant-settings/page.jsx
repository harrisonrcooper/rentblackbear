"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tenant-settings.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text);
      background: var(--surface-alt);
      line-height: 1.5;
      font-size: 14px;
      min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* ===== Workspace brand tokens (Black Bear Rentals) ===== */
    :root {
      --brand: #1e6f47;
      --brand-dark: #144d31;
      --brand-darker: #0e3822;
      --brand-bright: #2a8f5e;
      --brand-pale: #e7f4ed;
      --brand-soft: #d1e8dc;
      --accent: #c7843b;
      --accent-bg: rgba(199,132,59,0.12);
      --text: #1f2b24;
      --text-muted: #5e6b62;
      --text-faint: #8b978f;
      --surface: #ffffff;
      --surface-alt: #f6f4ee;
      --surface-subtle: #fbfaf4;
      --border: #e5e1d4;
      --border-strong: #c9c3b0;
      --green: #1e6f47;
      --green-bg: rgba(30,111,71,0.12);
      --green-dark: #144d31;
      --red: #b23a3a;
      --red-bg: rgba(178,58,58,0.1);
      --amber: #c7843b;
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9);
      padding: 0 32px;
      height: 72px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 0 rgba(0,0,0,0.04);
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--brand-bright), var(--accent));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      color: #fff;
    }
    .tb-logo svg { width: 22px; height: 22px; }
    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }

    .tb-nav { display: flex; gap: 2px; align-items: center; }
    .tb-nav-item {
      padding: 10px 16px; border-radius: 100px;
      color: rgba(255,255,255,0.7); font-weight: 600; font-size: 13px;
      display: flex; align-items: center; gap: 8px;
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.08); }
    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.14); }
    .tb-nav-item svg { width: 15px; height: 15px; }

    .tb-right { display: flex; align-items: center; gap: 14px; }
    .tb-bell {
      position: relative; width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.08); color: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .tb-bell:hover { background: rgba(255,255,255,0.16); }
    .tb-bell svg { width: 16px; height: 16px; }
    .tb-bell-dot { position: absolute; top: 8px; right: 9px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); border: 2px solid var(--brand-darker); }

    .tb-avatar {
      display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 12px;
      border-radius: 100px; background: rgba(255,255,255,0.08);
      transition: all 0.15s ease;
    }
    .tb-avatar:hover { background: rgba(255,255,255,0.16); }
    .tb-avatar-name { font-size: 13px; font-weight: 600; color: #fff; }
    .tb-avatar-img {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--brand-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }

    /* ===== Main wrap ===== */
    .wrap { max-width: 720px; margin: 0 auto; padding: 32px 28px; }

    .page-head { margin-bottom: 22px; }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .page-head p { color: var(--text-muted); font-size: 14px; }

    /* ===== Sub-nav tabs ===== */
    .subnav {
      display: flex; gap: 4px; border-bottom: 1px solid var(--border);
      margin-bottom: 28px; overflow-x: auto; scrollbar-width: none;
    }
    .subnav::-webkit-scrollbar { display: none; }
    .subnav-item {
      padding: 12px 16px; font-weight: 600; font-size: 13px;
      color: var(--text-muted); border-bottom: 2px solid transparent;
      transition: all 0.15s ease; white-space: nowrap;
      margin-bottom: -1px;
    }
    .subnav-item:hover { color: var(--brand); }
    .subnav-item.active { color: var(--brand); border-bottom-color: var(--brand); }

    /* ===== Panels ===== */
    .panel { display: none; }
    .panel.active { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    /* ===== Cards / sections ===== */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 16px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 14px; }
    .card-title { font-size: 15px; font-weight: 700; color: var(--text); }
    .card-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
    .card-link { color: var(--brand); font-size: 12px; font-weight: 600; cursor: pointer; }
    .card-link:hover { text-decoration: underline; }

    .note {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius); padding: 12px 14px;
      font-size: 12.5px; color: var(--brand-dark);
      display: flex; gap: 10px; align-items: flex-start;
    }
    .note svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--brand); }

    /* ===== Form ===== */
    .field { margin-bottom: 14px; }
    .field-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
    .input {
      width: 100%; padding: 11px 14px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 14px; color: var(--text);
      transition: all 0.15s ease; outline: none;
    }
    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    .input[readonly] { background: var(--surface-subtle); color: var(--text-muted); cursor: not-allowed; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field-hint { font-size: 11.5px; color: var(--text-faint); margin-top: 5px; }

    /* ===== Avatar upload ===== */
    .avatar-block { display: flex; align-items: center; gap: 18px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
    .avatar-big {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--brand-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 26px; flex-shrink: 0;
      box-shadow: var(--shadow);
    }
    .avatar-meta { flex: 1; }
    .avatar-meta-title { font-weight: 700; font-size: 14px; margin-bottom: 3px; }
    .avatar-meta-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
    .avatar-actions { display: flex; gap: 8px; }

    .drop-zone {
      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
      padding: 20px; text-align: center; cursor: pointer;
      transition: all 0.15s ease; background: var(--surface-subtle);
      margin-top: 12px; display: none;
    }
    .drop-zone.show { display: block; animation: fadeIn 0.2s ease; }
    .drop-zone:hover { border-color: var(--brand); background: var(--brand-pale); }
    .drop-zone svg { width: 28px; height: 28px; color: var(--text-faint); margin: 0 auto 6px; }
    .drop-zone-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .drop-zone-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }

    /* ===== Buttons ===== */
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }
    .btn-sm { padding: 7px 14px; font-size: 12.5px; }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }
    .btn-danger { color: var(--red); border: 1px solid var(--border); background: var(--surface); }
    .btn-danger:hover { border-color: var(--red); background: var(--red-bg); }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Notifications matrix ===== */
    .notif-matrix {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden; background: var(--surface);
    }
    .notif-row {
      display: grid; grid-template-columns: 1fr repeat(3, 64px);
      align-items: center; gap: 10px;
      padding: 14px 18px; border-bottom: 1px solid var(--border);
    }
    .notif-row:last-child { border-bottom: none; }
    .notif-row.head {
      background: var(--surface-subtle); padding: 10px 18px;
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .notif-row.head > div:not(:first-child) { text-align: center; }
    .notif-type { font-weight: 600; font-size: 13px; color: var(--text); }
    .notif-type-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; font-weight: 400; }
    .notif-cell { display: flex; justify-content: center; }

    /* ===== Toggle switch ===== */
    .toggle {
      width: 36px; height: 20px; border-radius: 100px;
      background: var(--border-strong); position: relative;
      cursor: pointer; transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .toggle::after {
      content: ""; position: absolute; top: 2px; left: 2px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
    }
    .toggle.on { background: var(--brand); }
    .toggle.on::after { transform: translateX(16px); }
    .toggle-lg { width: 44px; height: 24px; }
    .toggle-lg::after { width: 20px; height: 20px; }
    .toggle-lg.on::after { transform: translateX(20px); }

    .dnd-block { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 0; margin-top: 14px; border-top: 1px solid var(--border); gap: 16px; flex-wrap: wrap; }
    .dnd-title { font-weight: 600; font-size: 13px; }
    .dnd-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .dnd-times { display: flex; align-items: center; gap: 8px; }
    .dnd-times .input { padding: 8px 10px; font-size: 13px; width: 96px; }

    /* ===== Payment methods ===== */
    .autopay-card {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: #fff; border-radius: var(--radius-lg);
      padding: 20px 22px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 10px 30px rgba(20,77,49,0.18); gap: 14px;
    }
    .autopay-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 5px; }
    .autopay-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 3px; }
    .autopay-sub { font-size: 13px; color: rgba(255,255,255,0.85); }
    .autopay-pill {
      background: rgba(255,255,255,0.18); color: #fff;
      padding: 5px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .autopay-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: #7eead0; box-shadow: 0 0 0 3px rgba(126,234,208,0.25); }

    .method-row {
      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;
      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface); margin-bottom: 10px;
    }
    .method-row.default { border-color: var(--brand); background: var(--brand-pale); }
    .method-icon {
      width: 42px; height: 30px; border-radius: 5px;
      background: linear-gradient(135deg, #1a1f36, #3a4160);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; letter-spacing: 0.04em;
    }
    .method-icon.bank { background: linear-gradient(135deg, var(--brand), var(--brand-bright)); }
    .method-label { font-weight: 600; font-size: 13px; color: var(--text); }
    .method-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 8px; }
    .default-pill {
      font-size: 10px; font-weight: 700; color: var(--brand-dark);
      background: rgba(30,111,71,0.18); padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .method-actions { display: flex; gap: 6px; }
    .icon-btn {
      width: 28px; height: 28px; border-radius: 7px;
      background: var(--surface-subtle); color: var(--text-muted);
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .icon-btn:hover { background: var(--brand-pale); color: var(--brand); }
    .icon-btn.danger:hover { background: var(--red-bg); color: var(--red); }
    .icon-btn svg { width: 14px; height: 14px; }

    .add-method {
      margin-top: 4px; padding: 14px 16px;
      border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg);
      color: var(--text-muted); font-weight: 600; font-size: 13px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.15s ease; cursor: pointer; width: 100%;
    }
    .add-method:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }
    .add-method svg { width: 14px; height: 14px; }

    /* ===== Security ===== */
    .sec-row {
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      padding: 16px 0; border-bottom: 1px solid var(--border);
    }
    .sec-row:last-child { border-bottom: none; }
    .sec-label { font-weight: 600; font-size: 14px; }
    .sec-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; }

    .session-item {
      display: grid; grid-template-columns: 36px 1fr auto; gap: 14px; align-items: center;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .session-item:last-child { border-bottom: none; }
    .session-icon {
      width: 36px; height: 36px; border-radius: 9px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center;
    }
    .session-icon svg { width: 16px; height: 16px; }
    .session-title { font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px; }
    .session-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
    .current-pill {
      font-size: 10px; font-weight: 700; color: var(--green-dark);
      background: var(--green-bg); padding: 2px 8px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* ===== Data & privacy ===== */
    .priv-who {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .priv-who:last-child { border-bottom: none; }
    .priv-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--brand-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px; flex-shrink: 0;
    }
    .priv-avatar.op { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); }
    .priv-body { flex: 1; min-width: 0; }
    .priv-name { font-weight: 600; font-size: 13.5px; }
    .priv-role { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
    .access-pill {
      font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .access-full { background: var(--brand-pale); color: var(--brand-dark); }
    .access-limited { background: var(--accent-bg); color: var(--accent); }

    .deletion-card {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px; margin-top: 14px;
      font-size: 12.5px; color: var(--text-muted); line-height: 1.55;
    }
    .deletion-card strong { color: var(--text); font-weight: 700; }

    /* ===== Modal ===== */
    .modal-bg {
      position: fixed; inset: 0; background: rgba(14,56,34,0.45);
      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
      z-index: 50; display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .modal-bg.open { opacity: 1; pointer-events: auto; }
    .modal {
      background: var(--surface); width: 100%; max-width: 460px;
      border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);
      transform: translateY(16px) scale(0.98); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);
      overflow: hidden; max-height: 92vh; display: flex; flex-direction: column;
    }
    .modal-bg.open .modal { transform: none; }
    .modal-head {
      padding: 20px 22px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-head h2 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
    .modal-close {
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--surface-subtle); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-close:hover { background: var(--red-bg); color: var(--red); }
    .modal-close svg { width: 14px; height: 14px; }
    .modal-body { padding: 22px; overflow-y: auto; }
    .modal-foot {
      padding: 14px 22px; border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; gap: 10px; justify-content: flex-end;
    }

    /* ===== Stripe Elements mock ===== */
    .stripe-mock {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px; margin-bottom: 12px;
      display: flex; align-items: center; gap: 12px;
    }
    .stripe-mock-icon {
      width: 30px; height: 20px; border-radius: 4px;
      background: linear-gradient(135deg, #635bff, #8079ff);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 9px; font-weight: 800;
    }
    .stripe-mock-placeholder {
      color: var(--text-faint); font-size: 14px; font-family: 'SF Mono', Consolas, monospace;
    }

    /* ===== QR placeholder ===== */
    .qr-box {
      width: 168px; height: 168px; margin: 0 auto 14px;
      background:
        linear-gradient(45deg, var(--text) 25%, transparent 25%, transparent 75%, var(--text) 75%),
        linear-gradient(45deg, var(--text) 25%, transparent 25%, transparent 75%, var(--text) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 8px 8px;
      background-color: #fff;
      border: 6px solid var(--text); border-radius: 8px;
      position: relative;
    }
    .qr-box::after {
      content: ""; position: absolute; inset: 30%;
      background: #fff; border: 3px solid var(--text); border-radius: 4px;
    }
    .recovery-codes {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px; margin-top: 14px;
      font-family: 'SF Mono', Consolas, monospace; font-size: 13px;
      color: var(--text);
    }

    /* ===== Footer ===== */
    .legal-foot {
      max-width: 720px; margin: 40px auto 28px; padding: 0 28px;
      color: var(--text-faint); font-size: 11px; display: flex;
      justify-content: space-between; flex-wrap: wrap; gap: 10px;
    }
    .legal-foot a { color: var(--text-muted); }
    .legal-foot a:hover { color: var(--brand); text-decoration: underline; }
    .legal-foot-left { display: flex; align-items: center; gap: 8px; }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }

    /* ===== Toast ===== */
    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 80; }
    .toast {
      background: var(--text); color: var(--surface);
      padding: 12px 18px; border-radius: var(--radius);
      font-size: 13px; font-weight: 500;
      box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 10px;
      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);
      min-width: 240px;
    }
    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); flex-shrink: 0; }
    .toast-progress {
      height: 3px; background: rgba(255,255,255,0.15); border-radius: 100px;
      overflow: hidden; flex: 1;
    }
    .toast-progress-fill {
      height: 100%; background: var(--brand-bright); width: 0;
      transition: width 0.1s linear;
    }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

    @media (max-width: 780px) {
      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }
      .tb-nav { overflow-x: auto; width: 100%; }
      .wrap { padding: 20px 16px; }
      .field-row { grid-template-columns: 1fr; }
      .notif-row { grid-template-columns: 1fr repeat(3, 52px); padding: 12px 14px; gap: 6px; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Tenant portal</div>
      </div>
    </div>

    <nav class="tb-nav">
      <a class="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z"/></svg>
        Home
      </a>
      <a class="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Pay rent
      </a>
      <a class="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Maintenance
      </a>
      <a class="tb-nav-item" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
        Documents
      </a>
      <a class="tb-nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Settings
      </a>
    </nav>

    <div class="tb-right">
      <button class="tb-bell" onclick="toast('No new notifications')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
        <span class="tb-bell-dot"></span>
      </button>
      <div class="tb-avatar">
        <span class="tb-avatar-name">Maya Thompson</span>
        <div class="tb-avatar-img">MT</div>
      </div>
    </div>
  </header>

  <main class="wrap">
    <div class="page-head">
      <h1>Account settings</h1>
      <p>Manage your profile, notifications, payments, security, and data for your Black Bear lease.</p>
    </div>

    <nav class="subnav" role="tablist">
      <button class="subnav-item active" data-tab="profile">Profile</button>
      <button class="subnav-item" data-tab="notifications">Notifications</button>
      <button class="subnav-item" data-tab="payments">Payment methods</button>
      <button class="subnav-item" data-tab="security">Security</button>
      <button class="subnav-item" data-tab="privacy">Data &amp; privacy</button>
    </nav>

    <!-- ========== PROFILE ========== -->
    <section class="panel active" data-panel="profile">
      <div class="card">
        <div class="avatar-block">
          <div class="avatar-big" id="avatarBig">MT</div>
          <div class="avatar-meta">
            <div class="avatar-meta-title">Profile photo</div>
            <div class="avatar-meta-sub">PNG or JPG, up to 5MB. Visible to your operator and housemates.</div>
            <div class="avatar-actions">
              <button class="btn btn-ghost btn-sm" onclick="toggleDropZone()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
              </button>
              <button class="btn btn-ghost btn-sm" onclick="toast('Photo removed')">Remove</button>
            </div>
          </div>
        </div>

        <div class="drop-zone" id="dropZone" onclick="toast('File picker coming soon')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div class="drop-zone-title">Drop an image here, or click to browse</div>
          <div class="drop-zone-sub">Square images work best. Max 5MB.</div>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label">Legal name</label>
            <input class="input" value="Maya Elena Thompson" readonly>
            <div class="field-hint"><a class="card-link" onclick="toast('Request sent to Harrison for review')">Request name change</a> — this is the name on your lease.</div>
          </div>
          <div class="field">
            <label class="field-label">Display name</label>
            <input class="input" value="Maya">
            <div class="field-hint">Shown in chat and to housemates.</div>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Email</label>
          <input class="input" type="email" value="maya.thompson@northstar.edu">
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label">Phone</label>
            <input class="input" type="tel" value="(256) 555-0173">
          </div>
          <div class="field">
            <label class="field-label">Date of birth</label>
            <input class="input" value="March 14, 2003" readonly>
            <div class="field-hint">Verified during application.</div>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Emergency contact</label>
          <div class="field-row">
            <input class="input" placeholder="Name" value="Rosa Thompson (mother)">
            <input class="input" placeholder="Phone" value="(256) 555-0144">
          </div>
        </div>

        <div class="note" style="margin-top:6px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <div>Keep your contact info current — we use it for rent reminders, maintenance coordination, and lease-of-record accuracy.</div>
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px;">
          <button class="btn btn-ghost">Discard</button>
          <button class="btn btn-primary" onclick="toast('Profile saved', true)">Save changes</button>
        </div>
      </div>
    </section>

    <!-- ========== NOTIFICATIONS ========== -->
    <section class="panel" data-panel="notifications">
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">How you hear from us</div>
            <div class="card-sub">Choose how each type reaches you. You can always reach us by replying in-app.</div>
          </div>
        </div>

        <div class="notif-matrix" id="notifMatrix">
          <div class="notif-row head">
            <div>Type</div>
            <div>Email</div>
            <div>SMS</div>
            <div>Push</div>
          </div>
          <!-- populated by JS -->
        </div>

        <div class="dnd-block">
          <div>
            <div class="dnd-title">Do not disturb</div>
            <div class="dnd-sub">Pause non-urgent alerts during these hours. Urgent maintenance still pages you.</div>
          </div>
          <div class="dnd-times">
            <input class="input" type="time" value="21:00">
            <span style="color:var(--text-muted);font-size:12px;">to</span>
            <input class="input" type="time" value="08:00">
            <div class="toggle on" onclick="this.classList.toggle('on')"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== PAYMENT METHODS ========== -->
    <section class="panel" data-panel="payments">
      <div class="autopay-card" style="margin-bottom:16px;">
        <div>
          <div class="autopay-label">Autopay</div>
          <div class="autopay-title">$750.00 on May 1</div>
          <div class="autopay-sub">Bank ••6891 · runs 2 business days early</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <span class="autopay-pill"><span class="dot"></span> On</span>
          <a class="card-link" style="color:rgba(255,255,255,0.85);font-size:11.5px;" onclick="toast('Autopay paused')">Pause</a>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Your methods</div>
            <div class="card-sub">Bank transfers are free. Cards add a 2.9% processing fee.</div>
          </div>
        </div>

        <div class="method-row default">
          <div class="method-icon bank">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6v2H3v-2z"/><path d="M5 12v7M9 12v7M15 12v7M19 12v7M3 21h18"/></svg>
          </div>
          <div>
            <div class="method-label">Regions Checking ••6891</div>
            <div class="method-sub">
              <span class="default-pill">Default</span>
              <span>Added Feb 2026</span>
            </div>
          </div>
          <div class="method-actions">
            <button class="icon-btn" title="Replace" onclick="toast('Re-verifying with Plaid')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
            <button class="icon-btn danger" title="Remove" onclick="toast('Cannot remove default method')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </div>

        <div class="method-row">
          <div class="method-icon">VISA</div>
          <div>
            <div class="method-label">Visa ••4242</div>
            <div class="method-sub"><span>Expires 09/28</span></div>
          </div>
          <div class="method-actions">
            <button class="icon-btn" title="Make default" onclick="toast('Visa ••4242 is now default')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="icon-btn danger" title="Remove" onclick="removeMethod(this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </div>

        <button class="add-method" onclick="openModal('addMethodModal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add bank or card
        </button>
      </div>
    </section>

    <!-- ========== SECURITY ========== -->
    <section class="panel" data-panel="security">
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Password</div>
            <div class="card-sub">Last changed Feb 12, 2026.</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="openModal('passwordModal')">Change password</button>
        </div>

        <div class="sec-row">
          <div>
            <div class="sec-label">Two-factor authentication</div>
            <div class="sec-sub">Add a second step when signing in from a new device.</div>
          </div>
          <div class="toggle toggle-lg" id="mfaToggle" onclick="toggleMfa()"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Active sessions</div>
            <div class="card-sub">Devices signed in to your Black Bear account.</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="openModal('signoutModal')">Sign out all</button>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <div>
            <div class="session-title">iPhone 15 · Safari <span class="current-pill">This device</span></div>
            <div class="session-sub">Huntsville, AL · Active now</div>
          </div>
          <button class="icon-btn" title="Details" onclick="toast('Session looks normal')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div>
            <div class="session-title">MacBook Pro · Chrome</div>
            <div class="session-sub">Huntsville, AL · 3 hours ago</div>
          </div>
          <button class="icon-btn danger" title="Sign out" onclick="signOutSession(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <div>
            <div class="session-title">iPad · Safari</div>
            <div class="session-sub">Nashville, TN · 2 days ago</div>
          </div>
          <button class="icon-btn danger" title="Sign out" onclick="signOutSession(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ========== DATA & PRIVACY ========== -->
    <section class="panel" data-panel="privacy">
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Download your data</div>
            <div class="card-sub">Your profile, payment history, leases, and maintenance tickets as a ZIP.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="exportData()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export ZIP
          </button>
        </div>

        <div class="note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div>Your data is workspace-isolated. Harrison (your operator) cannot see tenants from any other Tenantory workspace, and other operators cannot see you.</div>
        </div>

        <div class="deletion-card">
          <strong>Delete my account</strong> — you can request deletion at any time. We acknowledge within 24 hours and complete within 30 days. A few financial records (rent receipts, tax-relevant ledger entries) are retained for 7 years per IRS requirements, but all personal data is removed. <a class="card-link" onclick="toast('Deletion request sent for review')">Start deletion request</a>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Who can see your info</div>
            <div class="card-sub">People in your Black Bear workspace.</div>
          </div>
        </div>

        <div class="priv-who">
          <div class="priv-avatar op">HC</div>
          <div class="priv-body">
            <div class="priv-name">Harrison Cooper</div>
            <div class="priv-role">Operator · Black Bear Rentals</div>
          </div>
          <span class="access-pill access-full">Full access</span>
        </div>

        <div class="priv-who">
          <div class="priv-avatar">JR</div>
          <div class="priv-body">
            <div class="priv-name">Jordan R.</div>
            <div class="priv-role">Housemate · Room A</div>
          </div>
          <span class="access-pill access-limited">Name &amp; initial only</span>
        </div>

        <div class="priv-who">
          <div class="priv-avatar">SP</div>
          <div class="priv-body">
            <div class="priv-name">Sam P.</div>
            <div class="priv-role">Housemate · Room B</div>
          </div>
          <span class="access-pill access-limited">Name &amp; initial only</span>
        </div>
      </div>
    </section>

  </main>

  <footer class="legal-foot">
    <div class="legal-foot-left">
      <span>Powered by Tenantory</span>
      <span>·</span>
      <span>Your data is workspace-isolated</span>
    </div>
    <div>
      <a href="security.html">Security &amp; privacy</a>
    </div>
  </footer>

  <!-- ========== ADD PAYMENT METHOD MODAL ========== -->
  <div class="modal-bg" id="addMethodModal" onclick="if(event.target===this)closeModal('addMethodModal')">
    <div class="modal">
      <div class="modal-head">
        <h2>Add payment method</h2>
        <button class="modal-close" onclick="closeModal('addMethodModal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div style="display:flex;gap:8px;margin-bottom:18px;">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="toast('Plaid link opening...')">Link bank (Plaid)</button>
          <button class="btn btn-ghost btn-sm" style="flex:1;">Card</button>
        </div>
        <div class="field">
          <label class="field-label">Card number</label>
          <div class="stripe-mock">
            <div class="stripe-mock-icon">S</div>
            <div class="stripe-mock-placeholder">1234 1234 1234 1234</div>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Expiry</label>
            <div class="stripe-mock"><div class="stripe-mock-placeholder">MM / YY</div></div>
          </div>
          <div class="field">
            <label class="field-label">CVC</label>
            <div class="stripe-mock"><div class="stripe-mock-placeholder">CVC</div></div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">ZIP</label>
          <div class="stripe-mock"><div class="stripe-mock-placeholder">35816</div></div>
        </div>
        <div class="field-hint" style="margin-top:4px;">Card payments include a 2.9% processing fee. Secured by Stripe.</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('addMethodModal')">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal('addMethodModal');toast('Card added', true)">Add card</button>
      </div>
    </div>
  </div>

  <!-- ========== CHANGE PASSWORD MODAL ========== -->
  <div class="modal-bg" id="passwordModal" onclick="if(event.target===this)closeModal('passwordModal')">
    <div class="modal">
      <div class="modal-head">
        <h2>Change password</h2>
        <button class="modal-close" onclick="closeModal('passwordModal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="field">
          <label class="field-label">Current password</label>
          <input class="input" type="password" placeholder="••••••••">
        </div>
        <div class="field">
          <label class="field-label">New password</label>
          <input class="input" type="password" placeholder="At least 12 characters">
          <div class="field-hint">Use a passphrase — three random words is stronger than &lt;symbols!&gt;.</div>
        </div>
        <div class="field">
          <label class="field-label">Confirm new password</label>
          <input class="input" type="password" placeholder="Repeat it">
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('passwordModal')">Cancel</button>
        <button class="btn btn-primary" onclick="closeModal('passwordModal');toast('Password updated', true)">Update password</button>
      </div>
    </div>
  </div>

  <!-- ========== MFA QR MODAL ========== -->
  <div class="modal-bg" id="mfaModal" onclick="if(event.target===this)cancelMfa()">
    <div class="modal">
      <div class="modal-head">
        <h2>Set up two-factor auth</h2>
        <button class="modal-close" onclick="cancelMfa()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:14px;">Scan with 1Password, Google Authenticator, or Authy.</div>
        <div class="qr-box"></div>
        <div style="text-align:center;font-family:'SF Mono',Consolas,monospace;font-size:12px;color:var(--text-muted);margin-bottom:14px;">or enter: JBSWY3DPEHPK3PXP</div>
        <div class="field">
          <label class="field-label">Enter 6-digit code</label>
          <input class="input" placeholder="000000" maxlength="6" style="letter-spacing:0.3em;text-align:center;font-family:'SF Mono',Consolas,monospace;">
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text);margin-top:14px;margin-bottom:6px;">Recovery codes</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Save these somewhere safe. Each works once.</div>
        <div class="recovery-codes">
          <div>4f3a-9c21</div><div>b8e1-7d04</div>
          <div>2a5f-c6b9</div><div>e0d3-1a87</div>
          <div>76bc-9f2e</div><div>c41d-58a3</div>
          <div>9e82-0b7f</div><div>3d64-af15</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="cancelMfa()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmMfa()">Turn on 2FA</button>
      </div>
    </div>
  </div>

  <!-- ========== SIGN OUT ALL MODAL ========== -->
  <div class="modal-bg" id="signoutModal" onclick="if(event.target===this)closeModal('signoutModal')">
    <div class="modal" style="max-width:400px;">
      <div class="modal-head">
        <h2>Sign out everywhere?</h2>
        <button class="modal-close" onclick="closeModal('signoutModal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--text);line-height:1.6;">This will end all 3 active sessions, including this one. You'll need to sign back in with your password and 2FA code.</p>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeModal('signoutModal')">Cancel</button>
        <button class="btn btn-primary" style="background:var(--red);" onclick="closeModal('signoutModal');toast('Signed out of all devices', true)">Sign out all</button>
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
