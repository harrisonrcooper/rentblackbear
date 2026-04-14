"use client";

// Mock ported verbatim from ~/Desktop/tenantory/moveout.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* Black Bear brand tokens (same as portal/apply/listings/sign) */
    :root {
      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;
      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;
      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);
      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;
      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;
      --border: #e5e1d4; --border-strong: #c9c3b0;
      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;
      --red: #b23a3a; --red-bg: rgba(178,58,58,0.1);
      --amber: #c7843b; --amber-bg: rgba(199,132,59,0.12);
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* Topbar */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9); padding: 16px 32px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--brand-bright), var(--accent));
      display: flex; align-items: center; justify-content: center; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tb-logo svg { width: 22px; height: 22px; }
    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }
    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); }
    .tb-help a { color: #fff; font-weight: 600; }
    .tb-help a:hover { text-decoration: underline; }

    /* Banner */
    .info-banner {
      max-width: 1100px; margin: 0 auto;
      background: var(--amber-bg); border-bottom: 1px solid rgba(199,132,59,0.3);
      padding: 14px 32px; display: flex; gap: 12px; align-items: flex-start;
    }
    .info-icon {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--amber); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .info-icon svg { width: 14px; height: 14px; }
    .info-text { font-size: 13px; color: var(--text); }
    .info-text strong { font-weight: 700; }

    /* Layout */
    .wrap {
      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;
      display: grid; grid-template-columns: 340px 1fr; gap: 28px; align-items: flex-start;
    }

    /* Left sidebar */
    .sidebar {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 24px;
      position: sticky; top: 20px;
      box-shadow: var(--shadow-sm);
    }
    .side-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }
    .side-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }
    .side-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }

    .steps { display: flex; flex-direction: column; gap: 0; }
    .step {
      display: flex; gap: 14px; padding: 10px 0; cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
    }
    .step-num {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--surface-subtle); border: 1px solid var(--border);
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; flex-shrink: 0; z-index: 1;
    }
    .step-num svg { width: 13px; height: 13px; }
    .step:not(:last-child)::before {
      content: ""; position: absolute; left: 13.5px; top: 38px; bottom: -10px;
      width: 1px; background: var(--border);
    }
    .step.done .step-num { background: var(--brand); border-color: var(--brand); color: #fff; }
    .step.done:not(:last-child)::before { background: var(--brand); }
    .step.active .step-num { background: var(--brand-pale); border-color: var(--brand); color: var(--brand-dark); box-shadow: 0 0 0 3px var(--brand-pale); }
    .step-body { flex: 1; padding-top: 2px; }
    .step-label { font-weight: 700; font-size: 13px; color: var(--text); }
    .step-meta { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
    .step.done .step-label { color: var(--text-muted); text-decoration: line-through; text-decoration-thickness: 1px; }

    .sidebar-foot {
      margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border);
    }
    .sidebar-contact {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius); padding: 14px;
      font-size: 12.5px; color: var(--text); line-height: 1.55;
    }
    .sidebar-contact strong { color: var(--brand-dark); font-weight: 700; }
    .sidebar-contact a { color: var(--brand); font-weight: 700; }

    /* Main column */
    .main { min-width: 0; }

    .page-head { margin-bottom: 22px; }
    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 620px; }

    /* Cards */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px;
      box-shadow: var(--shadow-sm); margin-bottom: 18px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
    .card-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
    .card-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }

    /* Notice date block */
    .notice-date {
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px;
      align-items: stretch; margin-bottom: 18px;
    }
    .date-block {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
    }
    .date-block.highlight { background: var(--brand-pale); border-color: var(--brand-soft); }
    .date-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .date-block.highlight .date-label { color: var(--brand-dark); }
    .date-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); line-height: 1; }
    .date-block.highlight .date-val { color: var(--brand-dark); }
    .date-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .date-arrow {
      align-self: center;
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--brand); display: flex; align-items: center; justify-content: center;
    }
    .date-arrow svg { width: 14px; height: 14px; }

    .field { margin-bottom: 18px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .field-label-req::after { content: " *"; color: var(--red); }
    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .input {
      width: 100%; padding: 11px 14px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 14px; color: var(--text);
      transition: all 0.15s ease; outline: none;
    }
    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    textarea.input { resize: vertical; min-height: 100px; line-height: 1.5; }
    select.input {
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235e6b62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
    }

    /* Reason radio */
    .reason-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .reason {
      display: flex; gap: 12px; padding: 14px;
      border: 1.5px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease;
    }
    .reason:hover { border-color: var(--brand); }
    .reason.selected { border-color: var(--brand); background: var(--brand-pale); }
    .reason-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0;
      position: relative; transition: all 0.15s ease; margin-top: 2px;
    }
    .reason.selected .reason-dot { border-color: var(--brand); background: var(--brand); }
    .reason.selected .reason-dot::after {
      content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #fff;
    }
    .reason-body { flex: 1; }
    .reason-title { font-weight: 700; font-size: 13px; color: var(--text); line-height: 1.3; }
    .reason-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    /* Checklist */
    .checklist { display: flex; flex-direction: column; gap: 6px; }
    .check-item {
      display: flex; gap: 12px; padding: 12px 14px;
      border: 1px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease;
      align-items: flex-start;
    }
    .check-item:hover { border-color: var(--brand-soft); background: var(--surface-subtle); }
    .check-item.checked { border-color: var(--brand); background: var(--brand-pale); }
    .check-box {
      width: 20px; height: 20px; border-radius: 5px;
      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .check-item.checked .check-box { background: var(--brand); border-color: var(--brand); }
    .check-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }
    .check-item.checked .check-box svg { opacity: 1; }
    .check-body { flex: 1; }
    .check-title { font-weight: 600; font-size: 13.5px; color: var(--text); line-height: 1.4; }
    .check-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }

    .check-group + .check-group { margin-top: 18px; }
    .check-group-head {
      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    }
    .check-group-title { font-size: 12px; font-weight: 800; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
    .check-group-line { flex: 1; height: 1px; background: var(--border); }
    .check-group-count {
      font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px;
      background: var(--surface-subtle); color: var(--text-muted);
    }

    /* Progress bar */
    .progress {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: 100px; height: 8px; overflow: hidden; margin-bottom: 4px;
    }
    .progress-bar {
      height: 100%; background: linear-gradient(90deg, var(--brand-bright), var(--brand));
      border-radius: 100px; transition: width 0.35s cubic-bezier(.2,.9,.3,1);
      width: 0%;
    }
    .progress-meta {
      display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);
      margin-bottom: 14px;
    }

    /* Deposit */
    .deposit-box {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: #fff; border-radius: var(--radius-lg);
      padding: 24px 26px; margin-bottom: 18px;
      display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
      position: relative; overflow: hidden;
    }
    .deposit-box::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 180px; height: 180px; border-radius: 50%;
      background: radial-gradient(circle, rgba(199,132,59,0.3), transparent 70%);
    }
    .deposit-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
    .deposit-amount { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
    .deposit-sub { font-size: 12.5px; color: rgba(255,255,255,0.8); margin-top: 6px; line-height: 1.5; }

    /* Forwarding */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    /* Walkthrough times */
    .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
    .time-slot {
      padding: 10px 12px; border: 1.5px solid var(--border); border-radius: var(--radius);
      background: var(--surface); text-align: center; cursor: pointer;
      transition: all 0.15s ease;
    }
    .time-slot:hover { border-color: var(--brand); }
    .time-slot.selected { border-color: var(--brand); background: var(--brand-pale); }
    .time-slot-day { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .time-slot-date { font-weight: 800; font-size: 15px; color: var(--text); margin-top: 2px; letter-spacing: -0.01em; }
    .time-slot-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .time-slot.selected .time-slot-day { color: var(--brand-dark); }

    /* Submit */
    .submit-bar {
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px; flex-wrap: wrap; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border);
    }
    .save-note {
      font-size: 12px; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 6px;
    }
    .save-note svg { width: 13px; height: 13px; color: var(--green-dark); }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }
    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }

    /* Success overlay */
    .success-overlay {
      position: fixed; inset: 0; background: rgba(20,77,49,0.6);
      display: none; align-items: center; justify-content: center; z-index: 80;
      padding: 20px;
    }
    .success-overlay.show { display: flex; }
    .success-card {
      background: var(--surface); border-radius: var(--radius-xl);
      padding: 44px 34px; max-width: 520px; width: 100%;
      box-shadow: var(--shadow-lg); text-align: center;
      animation: pop 0.4s cubic-bezier(.2,.9,.3,1);
    }
    @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: none; } }
    .success-badge {
      width: 76px; height: 76px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand-bright), var(--brand));
      color: #fff; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px; box-shadow: 0 14px 40px rgba(30,111,71,0.35);
    }
    .success-badge svg { width: 38px; height: 38px; }
    .success-card h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }
    .success-sub { color: var(--text-muted); font-size: 14.5px; margin-bottom: 22px; line-height: 1.6; }
    .success-sub strong { color: var(--text); font-weight: 700; }
    .timeline {
      text-align: left; background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px; margin-bottom: 20px;
    }
    .timeline-row { display: flex; gap: 12px; padding: 6px 0; font-size: 13px; align-items: flex-start; }
    .timeline-icon {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--brand); color: #fff;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      font-size: 11px; font-weight: 700;
    }
    .timeline-icon svg { width: 12px; height: 12px; }
    .timeline-icon.upcoming { background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); }
    .timeline-text { color: var(--text); }
    .timeline-text.muted { color: var(--text-muted); }
    .timeline-text strong { font-weight: 700; }

    /* Toast */
    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }
    .toast {
      background: var(--text); color: var(--surface);
      padding: 12px 18px; border-radius: var(--radius);
      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 10px;
      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);
    }
    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

    /* Footer */
    .legal-foot {
      max-width: 1100px; margin: 0 auto; padding: 28px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
      color: var(--text-faint); font-size: 11px;
    }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }

    @media (max-width: 920px) {
      .wrap { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .notice-date { grid-template-columns: 1fr; }
      .date-arrow { transform: rotate(90deg); margin: 0 auto; }
      .reason-list { grid-template-columns: 1fr; }
      .time-grid { grid-template-columns: 1fr 1fr; }
      .info-banner { padding: 12px 16px; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Move-out notice</div>
      </div>
    </div>
    <div class="tb-help">
      <a href="portal.html" style="margin-right:18px;">&larr; Back to portal</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <div class="info-banner">
    <div class="info-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <div class="info-text">
      <strong>Your lease requires 60 days written notice.</strong> Submitting this form counts as written notice — we'll also email you a PDF confirmation. Your lease ends <strong>Dec 31, 2026</strong>.
    </div>
  </div>

  <main class="wrap">

    <!-- Left sidebar: checklist progress -->
    <aside class="sidebar">
      <div class="side-eyebrow">Move-out progress</div>
      <div class="side-title">4 steps until you're out</div>
      <div class="side-sub">This list updates automatically as you finish each step.</div>

      <div class="steps">
        <div class="step active">
          <div class="step-num">1</div>
          <div class="step-body">
            <div class="step-label">Submit written notice</div>
            <div class="step-meta">Today · 60-day countdown begins</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-body">
            <div class="step-label">Schedule walkthrough</div>
            <div class="step-meta">~2 weeks before move-out</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-body">
            <div class="step-label">Return keys + clean</div>
            <div class="step-meta">By 5pm on your last day</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-body">
            <div class="step-label">Deposit returned</div>
            <div class="step-meta">Within 35 days · per AL §35-9A-201</div>
          </div>
        </div>
      </div>

      <div class="sidebar-foot">
        <div class="sidebar-contact">
          <strong>Not sure about something?</strong><br>
          Text Harrison at <a href="sms:2565550102">(256) 555-0102</a> or email <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>. No wrong questions.
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <section class="main">

      <div class="page-head">
        <div class="page-kicker">Room C · 908 Lee Drive</div>
        <h1>Give move-out notice</h1>
        <p>Fill out this form honestly. Everything here becomes part of your move-out record and goes into Harrison's system instantly — no waiting, no phone tag.</p>
      </div>

      <!-- Notice date card -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">When are you moving out?</div>
            <div class="card-sub">Your earliest possible move-out is 60 days from today.</div>
          </div>
        </div>

        <div class="notice-date">
          <div class="date-block">
            <div class="date-label">Notice given today</div>
            <div class="date-val">Apr 14, 2026</div>
            <div class="date-sub">60-day clock starts now</div>
          </div>
          <div class="date-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div class="date-block highlight">
            <div class="date-label">Your move-out date</div>
            <div class="date-val" id="moveDateDisplay">Jun 14, 2026</div>
            <div class="date-sub">We'll stop charging rent after this date</div>
          </div>
        </div>

        <div class="field">
          <label class="field-label field-label-req">Desired move-out date</label>
          <input class="input" type="date" id="moveDate" value="2026-06-14" min="2026-06-13" onchange="updateMoveDate()">
          <div class="field-hint">Default is exactly 60 days from today. You can pick later — but your lease goes through Dec 31, 2026, and early move-out after 60 days still requires you to pay rent through that date unless we re-lease.</div>
        </div>

        <div class="field">
          <label class="field-label field-label-req">Reason for moving</label>
          <div class="reason-list" id="reasonList">
            <div class="reason selected" data-reason="job">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">New job / relocating</div>
                <div class="reason-sub">Out of town</div>
              </div>
            </div>
            <div class="reason" data-reason="buying">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">Buying a home</div>
                <div class="reason-sub">In the area</div>
              </div>
            </div>
            <div class="reason" data-reason="roommate">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">Roommate / household change</div>
                <div class="reason-sub">Moving in with someone</div>
              </div>
            </div>
            <div class="reason" data-reason="life">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">Life event</div>
                <div class="reason-sub">Family, health, etc.</div>
              </div>
            </div>
            <div class="reason" data-reason="unhappy">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">Something's not working here</div>
                <div class="reason-sub">We want to hear about it</div>
              </div>
            </div>
            <div class="reason" data-reason="other">
              <div class="reason-dot"></div>
              <div class="reason-body">
                <div class="reason-title">Other</div>
                <div class="reason-sub">You'll explain below</div>
              </div>
            </div>
          </div>
        </div>

        <div class="field" style="margin-bottom: 0;">
          <label class="field-label">Anything you want Harrison to know?</label>
          <textarea class="input" placeholder="Totally optional. What would make your move easier? Any feedback on the house, housemates, or management? Harrison reads every one of these."></textarea>
        </div>
      </div>

      <!-- Forwarding address -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Forwarding address</div>
            <div class="card-sub">Where should we mail your deposit check and final statement?</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label class="field-label field-label-req">Street address</label>
            <input class="input" type="text" placeholder="123 New Street">
          </div>
          <div class="field">
            <label class="field-label">Apt / unit</label>
            <input class="input" type="text" placeholder="Apt 2B">
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="field-label field-label-req">City</label>
            <input class="input" type="text" placeholder="Nashville">
          </div>
          <div class="grid-2">
            <div class="field">
              <label class="field-label field-label-req">State</label>
              <input class="input" type="text" placeholder="TN" maxlength="2" style="text-transform:uppercase;">
            </div>
            <div class="field">
              <label class="field-label field-label-req">ZIP</label>
              <input class="input" type="text" placeholder="37203" maxlength="5">
            </div>
          </div>
        </div>
        <div class="field" style="margin-bottom: 0;">
          <label class="field-label">Prefer deposit by</label>
          <select class="input">
            <option>ACH direct deposit (faster · 2–3 business days)</option>
            <option>Paper check by mail (5–7 business days)</option>
          </select>
          <div class="field-hint">ACH uses the same bank account currently on file for rent (Chase ••6891). You can change it in Settings → Payment methods.</div>
        </div>
      </div>

      <!-- Walkthrough scheduling -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Schedule your walkthrough</div>
            <div class="card-sub">15 minutes. You, Harrison, and a checklist. Recommended 1–2 days before you move out.</div>
          </div>
        </div>

        <label class="field-label">Available times near your move-out date</label>
        <div class="time-grid" id="timeGrid">
          <div class="time-slot selected">
            <div class="time-slot-day">Fri</div>
            <div class="time-slot-date">Jun 12</div>
            <div class="time-slot-time">10:00 AM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Fri</div>
            <div class="time-slot-date">Jun 12</div>
            <div class="time-slot-time">2:00 PM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Sat</div>
            <div class="time-slot-date">Jun 13</div>
            <div class="time-slot-time">9:00 AM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Sat</div>
            <div class="time-slot-date">Jun 13</div>
            <div class="time-slot-time">11:00 AM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Sat</div>
            <div class="time-slot-date">Jun 13</div>
            <div class="time-slot-time">3:00 PM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Sun</div>
            <div class="time-slot-date">Jun 14</div>
            <div class="time-slot-time">10:00 AM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Mon</div>
            <div class="time-slot-date">Jun 15</div>
            <div class="time-slot-time">5:30 PM</div>
          </div>
          <div class="time-slot">
            <div class="time-slot-day">Tue</div>
            <div class="time-slot-date">Jun 16</div>
            <div class="time-slot-time">6:00 PM</div>
          </div>
        </div>
      </div>

      <!-- Move-out checklist -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Move-out checklist</div>
            <div class="card-sub">Full deposit returned when every item is done. Most are 10 minutes each.</div>
          </div>
          <div>
            <div class="progress-meta">
              <span><strong id="checklistCount">0</strong> of 14 done</span>
              <span id="checklistPct">0%</span>
            </div>
            <div class="progress" style="width:180px;">
              <div class="progress-bar" id="checklistBar"></div>
            </div>
          </div>
        </div>

        <div class="check-group">
          <div class="check-group-head">
            <div class="check-group-title">Your room</div>
            <div class="check-group-line"></div>
            <span class="check-group-count">5 items</span>
          </div>
          <div class="checklist">
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Remove all personal belongings</div>
                <div class="check-sub">Closet, dresser, nightstand, desk drawers, wall hooks. Under the bed counts.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Patch nail holes and touch up paint</div>
                <div class="check-sub">Spackle provided in the basement. Paint is labeled "Main bed room" in the utility closet. Normal nail holes are free — 10+ holes counts as damage.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Dust all surfaces and wipe down windowsills</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Vacuum or sweep your room thoroughly</div>
                <div class="check-sub">Vacuum is in the hall closet. Move the bed and nightstand.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Leave furniture (bed, dresser, nightstand, desk) in the same spot as move-in</div>
                <div class="check-sub">They belong to the house — don't take anything you didn't bring.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="check-group">
          <div class="check-group-head">
            <div class="check-group-title">Shared spaces</div>
            <div class="check-group-line"></div>
            <span class="check-group-count">4 items</span>
          </div>
          <div class="checklist">
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Clear the fridge/freezer shelf you were using</div>
                <div class="check-sub">Including that one condiment you've been keeping "just in case" since 2024.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Remove your items from the pantry and spice rack</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Wipe down your bathroom shelf and shower caddy</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Clear any shared laundry space (dryer, drying rack)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="check-group">
          <div class="check-group-head">
            <div class="check-group-title">Admin</div>
            <div class="check-group-line"></div>
            <span class="check-group-count">5 items</span>
          </div>
          <div class="checklist">
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Return all keys (room key + front door key)</div>
                <div class="check-sub">At walkthrough, or leave in the lockbox and tell Harrison. Lost keys: $75 each.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Submit USPS mail forwarding</div>
                <div class="check-sub">Do it at <a href="https://moversguide.usps.com" target="_blank" style="color:var(--brand);font-weight:600;">moversguide.usps.com</a>. 10 minutes.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Cancel any subscriptions tied to this address</div>
                <div class="check-sub">Amazon, NYT, HelloFresh, etc. Not Harrison's problem but you'll thank yourself.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Confirm all rent is paid through your move-out date</div>
                <div class="check-sub">You're paid through May. One more payment ($750) due June 1. Autopay handles it unless you cancel.</div>
              </div>
            </div>
            <div class="check-item" onclick="toggleCheck(this)">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">
                <div class="check-title">Take before/after photos of your room</div>
                <div class="check-sub">Protects both sides if there's a deposit dispute. Upload them in Portal → Documents.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deposit summary -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Your deposit</div>
            <div class="card-sub">What happens to the $750 Harrison is holding.</div>
          </div>
        </div>

        <div class="deposit-box">
          <div>
            <div class="deposit-label">Held in escrow</div>
            <div class="deposit-amount">$750.00</div>
            <div class="deposit-sub">Returned within <strong style="color:#fff;">35 days of move-out</strong> per Alabama Code §35-9A-201, minus any documented damages.</div>
          </div>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:52px;height:52px;"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
        </div>

        <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">What gets deducted (if anything):</strong></p>
          <p style="margin-bottom:6px;">• Documented damage beyond normal wear and tear (photos required)</p>
          <p style="margin-bottom:6px;">• Professional cleaning if the room isn't clean (typical cost $85–150)</p>
          <p style="margin-bottom:6px;">• Replacement cost of missing items (keys, smoke detector battery, etc.)</p>
          <p style="margin-bottom:6px;">• Any rent owed through a re-leased date (rare — Harrison fills rooms fast)</p>
          <p style="margin-top:12px;color:var(--brand-dark);font-weight:600;">Last year, 84% of Black Bear move-outs got their full deposit back. Average deduction when there was one: $65.</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="card">
        <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">
          By submitting, you're giving Black Bear Rentals <strong style="color:var(--text);">60 days written notice</strong> of move-out per the terms of your lease. A PDF confirmation will be emailed to you and to <strong style="color:var(--text);">harrison@rentblackbear.com</strong> within 60 seconds. You can cancel your notice in the portal up to 7 days after submitting — after that, the notice is final.
        </div>

        <div class="submit-bar">
          <div class="save-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Progress auto-saves · you can close this and come back
          </div>
          <div style="display:flex;gap:10px;">
            <a class="btn btn-ghost" href="portal.html">Cancel</a>
            <button class="btn btn-primary" onclick="submitNotice()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Submit 60-day notice
            </button>
          </div>
        </div>
      </div>

    </section>
  </main>

  <!-- Success overlay -->
  <div class="success-overlay" id="successOverlay">
    <div class="success-card">
      <div class="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2>Notice submitted.</h2>
      <p class="success-sub">Your 60-day move-out notice is filed and Harrison has been notified. A PDF confirmation is on its way to your email. Your move-out date is <strong>Jun 14, 2026</strong>.</p>

      <div class="timeline">
        <div class="timeline-row">
          <div class="timeline-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="timeline-text"><strong>Today</strong> — PDF confirmation emailed</div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">2</div>
          <div class="timeline-text muted"><strong>May 15</strong> — Harrison confirms walkthrough details</div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">3</div>
          <div class="timeline-text muted"><strong>Jun 12</strong> — walkthrough (Fri 10am)</div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">4</div>
          <div class="timeline-text muted"><strong>Jun 14</strong> — move-out day · keys returned</div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">5</div>
          <div class="timeline-text muted"><strong>Jul 19</strong> — deposit returned (within 35 days)</div>
        </div>
      </div>

      <a class="btn btn-primary" href="portal.html" style="display:inline-flex;">
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>

  <footer class="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Privacy</a> · <a href="#">Terms</a></div>
    <div class="powered-by">Powered by Tenantory</div>
  </footer>

  <div class="toast-stack" id="toastStack"></div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
