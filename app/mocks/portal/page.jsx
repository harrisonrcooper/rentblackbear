"use client";

// Mock ported verbatim from ~/Desktop/tenantory/portal.html.
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

    /* ===== Workspace brand tokens (Black Bear Rentals — intentionally NOT Tenantory Flagship) ===== */
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

    /* ===== Topbar (branded, NOT Tenantory) ===== */
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

    /* ===== Main content ===== */
    .wrap { max-width: 1040px; margin: 0 auto; padding: 32px; }

    .panel { display: none; }
    .panel.active { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .page-head { margin-bottom: 24px; }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .page-head p { color: var(--text-muted); font-size: 14px; }

    /* ===== Hero card (Home) ===== */
    .pay-hero {
      background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%);
      color: #fff;
      border-radius: var(--radius-xl);
      padding: 32px;
      display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;
      position: relative; overflow: hidden;
      box-shadow: 0 20px 50px rgba(20,77,49,0.22);
      margin-bottom: 20px;
    }
    .pay-hero::after {
      content: ""; position: absolute; top: -40px; right: -40px;
      width: 220px; height: 220px; border-radius: 50%;
      background: radial-gradient(circle, rgba(199,132,59,0.25), transparent 70%);
    }
    .pay-hero-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }
    .pay-hero-amount { font-size: 48px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px; }
    .pay-hero-due { font-size: 14px; color: rgba(255,255,255,0.85); }
    .pay-hero-due strong { color: #fff; font-weight: 700; }
    .pay-hero-actions { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
    .btn-pay {
      background: #fff; color: var(--brand-dark);
      padding: 14px 28px; border-radius: 100px;
      font-weight: 700; font-size: 15px;
      display: inline-flex; align-items: center; gap: 10px;
      transition: all 0.15s ease; white-space: nowrap;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.28); }
    .btn-pay svg { width: 16px; height: 16px; }
    .btn-autopay {
      background: rgba(255,255,255,0.15); color: #fff;
      padding: 11px 22px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      display: inline-flex; align-items: center; gap: 8px;
      transition: all 0.15s ease;
      border: 1px solid rgba(255,255,255,0.25);
    }
    .btn-autopay:hover { background: rgba(255,255,255,0.22); }
    .btn-autopay svg { width: 14px; height: 14px; }

    /* ===== Card grid ===== */
    .home-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-top: 20px; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: var(--shadow-sm);
    }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-title { font-size: 15px; font-weight: 700; color: var(--text); }
    .card-link { color: var(--brand); font-size: 12px; font-weight: 600; }
    .card-link:hover { text-decoration: underline; }

    .kv-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
    .kv-row:last-child { border-bottom: none; }
    .kv-row .kv-key { color: var(--text-muted); }
    .kv-row .kv-val { color: var(--text); font-weight: 600; }

    /* ===== Activity ===== */
    .activity-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .activity-item:last-child { border-bottom: none; }
    .activity-icon {
      width: 34px; height: 34px; border-radius: 10px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .activity-icon.paid { background: var(--green-bg); color: var(--green-dark); }
    .activity-icon.ticket { background: var(--accent-bg); color: var(--accent); }
    .activity-icon svg { width: 16px; height: 16px; }
    .activity-body { flex: 1; min-width: 0; }
    .activity-title { font-weight: 600; color: var(--text); font-size: 13px; margin-bottom: 2px; }
    .activity-meta { font-size: 12px; color: var(--text-muted); }

    /* ===== Quick actions ===== */
    .qa-list { display: flex; flex-direction: column; gap: 8px; }
    .qa-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: var(--radius);
      background: var(--surface-subtle); border: 1px solid var(--border);
      transition: all 0.15s ease; cursor: pointer;
    }
    .qa-item:hover { border-color: var(--brand); background: var(--brand-pale); }
    .qa-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .qa-item:hover .qa-icon { background: var(--brand); color: #fff; }
    .qa-icon svg { width: 16px; height: 16px; }
    .qa-label { font-weight: 600; font-size: 13px; color: var(--text); flex: 1; }
    .qa-item svg.chev { width: 14px; height: 14px; color: var(--text-faint); }

    /* ===== Payment methods ===== */
    .method-row {
      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;
      padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface); margin-bottom: 10px;
    }
    .method-row.default { border-color: var(--brand); background: var(--brand-pale); }
    .method-icon {
      width: 40px; height: 28px; border-radius: 5px;
      background: linear-gradient(135deg, #1a1f36, #3a4160);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; letter-spacing: 0.04em;
    }
    .method-icon.bank { background: linear-gradient(135deg, var(--brand), var(--brand-bright)); }
    .method-label { font-weight: 600; font-size: 13px; color: var(--text); }
    .method-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .default-pill {
      font-size: 10px; font-weight: 700; color: var(--brand-dark);
      background: rgba(30,111,71,0.18); padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .add-method {
      margin-top: 6px; padding: 14px 16px;
      border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg);
      color: var(--text-muted); font-weight: 600; font-size: 13px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.15s ease; cursor: pointer; width: 100%;
    }
    .add-method:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }
    .add-method svg { width: 14px; height: 14px; }

    /* ===== Payment history table ===== */
    .table {
      width: 100%; border-collapse: collapse; font-size: 13px;
    }
    .table th {
      text-align: left; padding: 10px 14px; font-weight: 700;
      color: var(--text-muted); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.08em;
      background: var(--surface-subtle); border-bottom: 1px solid var(--border);
    }
    .table td {
      padding: 14px; border-bottom: 1px solid var(--border);
      color: var(--text);
    }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--surface-subtle); }
    .table-amount { font-weight: 700; font-variant-numeric: tabular-nums; }
    .pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-amber { background: var(--accent-bg); color: var(--accent); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .icon-btn {
      width: 28px; height: 28px; border-radius: 7px;
      background: var(--surface-subtle); color: var(--text-muted);
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .icon-btn:hover { background: var(--brand-pale); color: var(--brand); }
    .icon-btn svg { width: 14px; height: 14px; }

    /* ===== Maintenance form ===== */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .field { margin-bottom: 16px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .input, textarea.input, select.input {
      width: 100%; padding: 11px 14px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 14px; color: var(--text);
      transition: all 0.15s ease; outline: none;
    }
    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    textarea.input { resize: vertical; min-height: 110px; line-height: 1.5; }
    select.input {
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235e6b62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
    }

    .priority-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .priority {
      border: 2px solid var(--border); border-radius: var(--radius);
      padding: 12px; text-align: center; background: var(--surface);
      cursor: pointer; transition: all 0.15s ease;
    }
    .priority:hover { border-color: var(--brand); }
    .priority.selected.low { border-color: var(--green); background: var(--green-bg); }
    .priority.selected.med { border-color: var(--amber); background: var(--accent-bg); }
    .priority.selected.urgent { border-color: var(--red); background: var(--red-bg); }
    .priority-label { font-weight: 700; font-size: 13px; color: var(--text); }
    .priority-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .drop-zone {
      border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
      padding: 24px; text-align: center; cursor: pointer;
      transition: all 0.15s ease; background: var(--surface-subtle);
    }
    .drop-zone:hover { border-color: var(--brand); background: var(--brand-pale); }
    .drop-zone svg { width: 32px; height: 32px; color: var(--text-faint); margin: 0 auto 8px; }
    .drop-zone-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .drop-zone-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    /* ===== Tickets list ===== */
    .ticket-row {
      display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px;
      align-items: center; padding: 16px 18px;
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface); margin-bottom: 10px;
      transition: all 0.15s ease;
    }
    .ticket-row:hover { border-color: var(--brand-bright); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    .ticket-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ticket-icon.done { background: var(--green-bg); color: var(--green-dark); }
    .ticket-icon svg { width: 18px; height: 18px; }
    .ticket-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }
    .ticket-meta { font-size: 12px; color: var(--text-muted); display: flex; gap: 10px; align-items: center; }
    .ticket-meta svg { width: 11px; height: 11px; }

    /* ===== Documents ===== */
    .doc-row {
      display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px;
      align-items: center; padding: 14px 16px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); margin-bottom: 8px;
      transition: all 0.15s ease;
    }
    .doc-row:hover { border-color: var(--brand); }
    .doc-icon {
      width: 36px; height: 44px; border-radius: 5px;
      background: linear-gradient(135deg, var(--brand-pale), var(--brand-soft));
      color: var(--brand); display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; position: relative; font-size: 9px; font-weight: 800;
    }
    .doc-icon::after {
      content: ""; position: absolute; top: 0; right: 0; width: 10px; height: 10px;
      background: var(--surface); border-left: 1px solid var(--border); border-bottom: 1px solid var(--border);
    }
    .doc-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }
    .doc-meta { font-size: 12px; color: var(--text-muted); }

    /* ===== Pay drawer ===== */
    .drawer-bg {
      position: fixed; inset: 0; background: rgba(14,56,34,0.45);
      opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
      z-index: 50; display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .drawer-bg.open { opacity: 1; pointer-events: auto; }
    .drawer {
      background: var(--surface); width: 100%; max-width: 460px;
      border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);
      transform: translateY(20px) scale(0.98); transition: transform 0.3s cubic-bezier(.2,.9,.3,1);
      overflow: hidden;
    }
    .drawer-bg.open .drawer { transform: none; }
    .drawer-head {
      padding: 22px 24px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .drawer-head h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
    .drawer-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--surface-subtle); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .drawer-close:hover { background: var(--red-bg); color: var(--red); }
    .drawer-close svg { width: 16px; height: 16px; }
    .drawer-body { padding: 22px 24px; }
    .drawer-foot {
      padding: 16px 24px; border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; gap: 10px; justify-content: flex-end;
    }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }

    .pay-summary {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius); padding: 14px 16px; margin-bottom: 18px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .pay-summary-label { font-size: 12px; color: var(--brand-dark); font-weight: 600; }
    .pay-summary-amount { font-size: 24px; font-weight: 800; color: var(--brand-dark); letter-spacing: -0.02em; }

    .method-pick {
      display: flex; align-items: center; gap: 14px; padding: 14px;
      border: 2px solid var(--border); border-radius: var(--radius);
      margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease;
    }
    .method-pick:hover { border-color: var(--brand); }
    .method-pick.selected { border-color: var(--brand); background: var(--brand-pale); }
    .method-pick-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0;
      position: relative; transition: all 0.15s ease;
    }
    .method-pick.selected .method-pick-radio {
      border-color: var(--brand); background: var(--brand);
    }
    .method-pick.selected .method-pick-radio::after {
      content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #fff;
    }

    /* ===== Footer ===== */
    .legal-foot {
      max-width: 1040px; margin: 40px auto 28px; padding: 0 32px;
      color: var(--text-faint); font-size: 11px; display: flex;
      justify-content: space-between; flex-wrap: wrap; gap: 10px;
    }
    .legal-foot a:hover { color: var(--brand); }
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
    }
    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

    @media (max-width: 780px) {
      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }
      .tb-nav { overflow-x: auto; width: 100%; }
      .wrap { padding: 20px 16px; }
      .pay-hero { grid-template-columns: 1fr; text-align: left; }
      .home-grid, .form-grid { grid-template-columns: 1fr; }
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
      <a class="tb-nav-item active" data-panel="home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z"/></svg>
        Home
      </a>
      <a class="tb-nav-item" data-panel="payments">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Pay rent
      </a>
      <a class="tb-nav-item" data-panel="maintenance">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Maintenance
      </a>
      <a class="tb-nav-item" data-panel="documents">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
        Documents
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

    <!-- ========= HOME ========= -->
    <section class="panel active" data-panel="home">
      <div class="page-head">
        <h1>Welcome back, Maya</h1>
        <p>Room C · 908 Lee Drive · Lease through Dec 31, 2026</p>
      </div>

      <div class="pay-hero">
        <div>
          <div class="pay-hero-label">Next payment</div>
          <div class="pay-hero-amount">$750.00</div>
          <div class="pay-hero-due">Due <strong>May 1, 2026</strong> · 17 days</div>
        </div>
        <div class="pay-hero-actions">
          <button class="btn-pay" onclick="openPayDrawer()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Pay now
          </button>
          <button class="btn-autopay" onclick="toggleAutopay()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            <span id="autopayLabel">Turn on autopay</span>
          </button>
        </div>
      </div>

      <div class="home-grid">
        <div class="card">
          <div class="card-head">
            <div class="card-title">Recent activity</div>
            <a class="card-link" data-jump="payments">View all</a>
          </div>
          <div class="activity-item">
            <div class="activity-icon paid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="activity-body">
              <div class="activity-title">April rent — $750.00 paid</div>
              <div class="activity-meta">Apr 1, 2026 · Bank · ••6891</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon ticket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
            <div class="activity-body">
              <div class="activity-title">Leaky kitchen faucet — in progress</div>
              <div class="activity-meta">Opened Apr 10 · Joel (plumber) assigned Apr 11</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon paid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="activity-body">
              <div class="activity-title">March rent — $750.00 paid</div>
              <div class="activity-meta">Mar 1, 2026 · Bank · ••6891</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title">Quick actions</div>
          </div>
          <div class="qa-list">
            <button class="qa-item" data-jump="maintenance">
              <div class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
              <span class="qa-label">Submit a request</span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button class="qa-item" data-jump="documents">
              <div class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
              <span class="qa-label">Download my lease</span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <a class="qa-item" href="mailto:hello@rentblackbear.com">
              <div class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg></div>
              <span class="qa-label">Contact my landlord</span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a class="qa-item" href="moveout.html">
              <div class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
              <span class="qa-label">Give move-out notice</span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>

          <div class="card-head" style="margin-top:22px;margin-bottom:10px;">
            <div class="card-title">Your lease</div>
          </div>
          <div class="kv-row"><span class="kv-key">Unit</span><span class="kv-val">Room C</span></div>
          <div class="kv-row"><span class="kv-key">Rent</span><span class="kv-val">$750 / mo</span></div>
          <div class="kv-row"><span class="kv-key">Due</span><span class="kv-val">1st of each month</span></div>
          <div class="kv-row"><span class="kv-key">Ends</span><span class="kv-val">Dec 31, 2026</span></div>
        </div>
      </div>
    </section>

    <!-- ========= PAYMENTS ========= -->
    <section class="panel" data-panel="payments">
      <div class="page-head">
        <h1>Pay rent</h1>
        <p>Manage your payment methods, turn on autopay, and review past payments.</p>
      </div>

      <div class="pay-hero" style="margin-bottom:24px;">
        <div>
          <div class="pay-hero-label">Due May 1</div>
          <div class="pay-hero-amount">$750.00</div>
          <div class="pay-hero-due">You have <strong>17 days</strong> · No late fees before May 6</div>
        </div>
        <div class="pay-hero-actions">
          <button class="btn-pay" onclick="openPayDrawer()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Pay $750 now
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-head">
          <div class="card-title">Payment methods</div>
        </div>
        <div class="method-row default">
          <div class="method-icon bank">ACH</div>
          <div>
            <div class="method-label">Chase checking ••6891</div>
            <div class="method-sub">No fees · 1–2 business days</div>
          </div>
          <span class="default-pill">Default</span>
        </div>
        <div class="method-row">
          <div class="method-icon">VISA</div>
          <div>
            <div class="method-label">Visa ••4278</div>
            <div class="method-sub">2.95% processing fee applies</div>
          </div>
          <button class="icon-btn" onclick="toast('Set as default')" title="Set as default">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        </div>
        <button class="add-method" onclick="toast('Stripe method flow would open')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add payment method
        </button>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title">Payment history</div>
        </div>
        <table class="table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Method</th><th style="text-align:right">Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Apr 1, 2026</td><td>April rent</td><td>Bank ••6891</td>
              <td class="table-amount" style="text-align:right">$750.00</td>
              <td><span class="pill pill-green">Paid</span></td>
              <td><button class="icon-btn" onclick="toast('Receipt downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td>Mar 1, 2026</td><td>March rent</td><td>Bank ••6891</td>
              <td class="table-amount" style="text-align:right">$750.00</td>
              <td><span class="pill pill-green">Paid</span></td>
              <td><button class="icon-btn" onclick="toast('Receipt downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td>Feb 1, 2026</td><td>February rent</td><td>Bank ••6891</td>
              <td class="table-amount" style="text-align:right">$750.00</td>
              <td><span class="pill pill-green">Paid</span></td>
              <td><button class="icon-btn" onclick="toast('Receipt downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td>Jan 1, 2026</td><td>January rent</td><td>Visa ••4278</td>
              <td class="table-amount" style="text-align:right">$771.93</td>
              <td><span class="pill pill-green">Paid</span></td>
              <td><button class="icon-btn" onclick="toast('Receipt downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
            <tr>
              <td>Dec 1, 2025</td><td>December rent</td><td>Bank ••6891</td>
              <td class="table-amount" style="text-align:right">$750.00</td>
              <td><span class="pill pill-green">Paid</span></td>
              <td><button class="icon-btn" onclick="toast('Receipt downloaded')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ========= MAINTENANCE ========= -->
    <section class="panel" data-panel="maintenance">
      <div class="page-head">
        <h1>Maintenance</h1>
        <p>Submit a request and track anything currently being worked on. Your landlord is notified instantly.</p>
      </div>

      <div class="card" style="margin-bottom:20px;">
        <div class="card-head">
          <div class="card-title">Submit a new request</div>
        </div>
        <form id="maintForm" onsubmit="submitTicket(event)">
          <div class="form-grid">
            <div class="field">
              <label class="field-label">Category</label>
              <select class="input">
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>HVAC / heating / AC</option>
                <option>Appliance</option>
                <option>Exterior / yard</option>
                <option>Pest</option>
                <option>Other</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">Location in unit</label>
              <select class="input">
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Bedroom (my room)</option>
                <option>Shared living area</option>
                <option>Laundry</option>
                <option>Exterior</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Title</label>
            <input class="input" type="text" placeholder="Short description (e.g. Kitchen sink dripping)" required>
          </div>

          <div class="field">
            <label class="field-label">Details</label>
            <textarea class="input" placeholder="When did it start? How bad is it? Any steps you've already tried?" required></textarea>
          </div>

          <div class="field">
            <label class="field-label">Priority</label>
            <div class="priority-row" id="priorityRow">
              <div class="priority low" data-pri="low">
                <div class="priority-label">Low</div>
                <div class="priority-sub">Can wait a week</div>
              </div>
              <div class="priority med selected" data-pri="med">
                <div class="priority-label">Normal</div>
                <div class="priority-sub">Fix this week</div>
              </div>
              <div class="priority urgent" data-pri="urgent">
                <div class="priority-label">Urgent</div>
                <div class="priority-sub">Safety or flooding</div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Photos (optional but helpful)</label>
            <div class="drop-zone" onclick="toast('Photo picker would open')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <div class="drop-zone-title">Tap to add photos</div>
              <div class="drop-zone-sub">Up to 5 photos · helps the handyman come prepared</div>
            </div>
          </div>

          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
            <button type="submit" class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit request
            </button>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title">Your requests</div>
        </div>
        <div id="ticketsList">
          <div class="ticket-row">
            <div class="ticket-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div>
              <div class="ticket-title">Leaky kitchen faucet</div>
              <div class="ticket-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Opened Apr 10</span>
                <span>Joel (plumber) assigned · visit Apr 15</span>
              </div>
            </div>
            <span class="pill pill-amber">In progress</span>
            <button class="icon-btn" onclick="toast('Opening thread')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
          <div class="ticket-row">
            <div class="ticket-icon done">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="ticket-title">Bedroom outlet not working</div>
              <div class="ticket-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Resolved Mar 22</span>
                <span>GFCI reset · closed by Harrison</span>
              </div>
            </div>
            <span class="pill pill-green">Resolved</span>
            <button class="icon-btn" onclick="toast('Opening thread')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
    </section>

    <!-- ========= DOCUMENTS ========= -->
    <section class="panel" data-panel="documents">
      <div class="page-head">
        <h1>Documents</h1>
        <p>Everything your landlord has shared with you, plus every receipt we've generated.</p>
      </div>

      <div class="card">
        <div class="doc-row">
          <div class="doc-icon">PDF</div>
          <div>
            <div class="doc-title">Signed lease — 908 Lee Drive, Room C</div>
            <div class="doc-meta">Signed Dec 28, 2025 · 12 pages · 486 KB</div>
          </div>
          <span class="pill pill-green">Active</span>
          <button class="icon-btn" onclick="toast('Downloading lease')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
        </div>
        <div class="doc-row">
          <div class="doc-icon">PDF</div>
          <div>
            <div class="doc-title">Move-in inspection report</div>
            <div class="doc-meta">Completed Jan 2, 2026 · 4 pages · 1.2 MB</div>
          </div>
          <button class="icon-btn" onclick="toast('Downloading')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
        <div class="doc-row">
          <div class="doc-icon">PDF</div>
          <div>
            <div class="doc-title">House rules &amp; quiet hours</div>
            <div class="doc-meta">Updated Jan 1, 2026 · 2 pages · 88 KB</div>
          </div>
          <button class="icon-btn" onclick="toast('Downloading')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
        <div class="doc-row">
          <div class="doc-icon">PDF</div>
          <div>
            <div class="doc-title">Receipt — April rent</div>
            <div class="doc-meta">Apr 1, 2026 · $750.00 · Bank ••6891</div>
          </div>
          <button class="icon-btn" onclick="toast('Downloading receipt')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
        <div class="doc-row">
          <div class="doc-icon">PDF</div>
          <div>
            <div class="doc-title">Receipt — March rent</div>
            <div class="doc-meta">Mar 1, 2026 · $750.00 · Bank ••6891</div>
          </div>
          <button class="icon-btn" onclick="toast('Downloading receipt')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
    </section>

  </main>

  <footer class="legal-foot">
    <div class="legal-foot-left">
      <span>&copy; 2026 Black Bear Rentals</span>
      <span>·</span>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
    <div class="powered-by">Powered by Tenantory</div>
  </footer>

  <!-- Pay drawer -->
  <div class="drawer-bg" id="payDrawer" onclick="if(event.target===this)closePayDrawer()">
    <div class="drawer">
      <div class="drawer-head">
        <h2>Pay May rent</h2>
        <button class="drawer-close" onclick="closePayDrawer()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="drawer-body">
        <div class="pay-summary">
          <div>
            <div class="pay-summary-label">Amount due</div>
            <div class="pay-summary-amount">$750.00</div>
          </div>
          <div style="text-align:right;font-size:11px;color:var(--text-muted);">
            Rent for May 2026<br>Due May 1
          </div>
        </div>

        <label class="field-label" style="margin-bottom:10px;">Payment method</label>
        <div class="method-pick selected" data-method="bank">
          <div class="method-pick-radio"></div>
          <div class="method-icon bank">ACH</div>
          <div style="flex:1;">
            <div class="method-label">Chase checking ••6891</div>
            <div class="method-sub">No fees</div>
          </div>
        </div>
        <div class="method-pick" data-method="card">
          <div class="method-pick-radio"></div>
          <div class="method-icon">VISA</div>
          <div style="flex:1;">
            <div class="method-label">Visa ••4278</div>
            <div class="method-sub">+$22.13 processing fee</div>
          </div>
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn-ghost" onclick="closePayDrawer()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmPay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Pay $750.00
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
