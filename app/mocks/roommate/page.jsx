"use client";

// Mock ported verbatim from ~/Desktop/tenantory/roommate.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;
      min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* ===== Black Bear brand tokens (mirrors portal.html :root) ===== */
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
      --amber-bg: rgba(199,132,59,0.12);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* ===== Topbar (matches portal / sign / moveout) ===== */
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
    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 18px; }
    .tb-help a { color: #fff; font-weight: 600; }
    .tb-help a:hover { text-decoration: underline; }
    .tb-back { display: inline-flex; align-items: center; gap: 6px; }

    /* ===== Status banner ===== */
    .status-banner {
      max-width: 1100px; margin: 0 auto;
      background: var(--brand-pale);
      border-bottom: 1px solid var(--brand-soft);
      padding: 14px 32px; display: flex; gap: 12px; align-items: center;
    }
    .status-icon {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--brand); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .status-icon svg { width: 16px; height: 16px; }
    .status-text { font-size: 13.5px; color: var(--text); }
    .status-text strong { font-weight: 700; color: var(--brand-dark); }

    /* ===== Layout ===== */
    .wrap {
      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;
      display: grid; grid-template-columns: 320px 1fr; gap: 28px; align-items: flex-start;
    }

    /* ===== Sticky sidebar ===== */
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
      display: flex; gap: 14px; padding: 10px 0;
      transition: all 0.15s ease; position: relative;
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

    .sidebar-foot { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }
    .sidebar-contact {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius); padding: 14px;
      font-size: 12.5px; color: var(--text); line-height: 1.55;
    }
    .sidebar-contact strong { color: var(--brand-dark); font-weight: 700; }
    .sidebar-contact a { color: var(--brand); font-weight: 700; }

    /* ===== Main column ===== */
    .main { min-width: 0; }

    .page-head { margin-bottom: 22px; }
    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 640px; }

    .flow-summary {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px; margin-top: 14px;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    }
    .flow-row {
      display: flex; gap: 10px; align-items: flex-start;
      font-size: 13px; color: var(--text); line-height: 1.45;
    }
    .flow-dot {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--brand-pale); color: var(--brand-dark);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0;
    }
    .flow-row strong { font-weight: 700; display: block; }
    .flow-row span { color: var(--text-muted); font-size: 12px; }
    .flow-total {
      margin-top: 14px; font-size: 12px; color: var(--text-muted);
      display: flex; align-items: center; gap: 6px;
    }
    .flow-total svg { width: 13px; height: 13px; color: var(--brand); }

    /* ===== Cards ===== */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px;
      box-shadow: var(--shadow-sm); margin-bottom: 18px;
    }
    .card-head { margin-bottom: 18px; }
    .card-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
    .card-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 4px; }
    .card-num {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--brand); color: #fff;
      font-size: 11px; font-weight: 800; margin-right: 8px;
    }

    /* ===== Relationship radio ===== */
    .rel-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .rel {
      display: flex; gap: 12px; padding: 14px;
      border: 1.5px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease; align-items: center;
    }
    .rel:hover { border-color: var(--brand); }
    .rel.selected { border-color: var(--brand); background: var(--brand-pale); }
    .rel-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0; position: relative;
      transition: all 0.15s ease;
    }
    .rel.selected .rel-dot { border-color: var(--brand); background: var(--brand); }
    .rel.selected .rel-dot::after {
      content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #fff;
    }
    .rel-body { flex: 1; }
    .rel-title { font-weight: 700; font-size: 13.5px; color: var(--text); }
    .rel-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    .rel-copy {
      margin-top: 14px; padding: 12px 14px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); font-size: 13px; color: var(--text-muted);
      line-height: 1.55;
    }
    .rel-copy strong { color: var(--text); font-weight: 700; }

    /* ===== Form fields ===== */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .field { margin-bottom: 16px; }
    .field:last-child { margin-bottom: 0; }
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

    /* ===== Financial comparison ===== */
    .money-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    .money-card {
      border: 1.5px solid var(--border); border-radius: var(--radius-lg);
      padding: 18px; cursor: pointer; transition: all 0.15s ease;
      background: var(--surface);
    }
    .money-card:hover { border-color: var(--brand); }
    .money-card.selected { border-color: var(--brand); background: var(--brand-pale); box-shadow: 0 4px 14px rgba(30,111,71,0.1); }
    .money-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .money-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0; position: relative;
      transition: all 0.15s ease;
    }
    .money-card.selected .money-radio { border-color: var(--brand); background: var(--brand); }
    .money-card.selected .money-radio::after {
      content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #fff;
    }
    .money-title { font-weight: 700; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }
    .money-big {
      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--brand-dark); line-height: 1.1; margin-bottom: 4px;
      font-variant-numeric: tabular-nums;
    }
    .money-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

    .money-breakdown {
      margin-top: 16px; padding: 16px 18px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .mb-row {
      display: grid; grid-template-columns: 1fr auto auto auto;
      align-items: center; gap: 12px; padding: 8px 0;
      border-bottom: 1px dashed var(--border); font-size: 13px;
    }
    .mb-row:last-child { border-bottom: none; padding-top: 12px; }
    .mb-row.total { border-top: 1px solid var(--border-strong); border-bottom: none; padding-top: 12px; font-weight: 700; }
    .mb-label { color: var(--text); font-weight: 600; }
    .mb-then { color: var(--text-muted); font-variant-numeric: tabular-nums; text-decoration: line-through; font-size: 12.5px; }
    .mb-arrow { color: var(--text-faint); }
    .mb-arrow svg { width: 12px; height: 12px; }
    .mb-now { color: var(--brand-dark); font-weight: 700; font-variant-numeric: tabular-nums; }
    .mb-row.total .mb-now { color: var(--brand-dark); font-size: 15px; }

    /* ===== Info callout (application notice) ===== */
    .notice {
      display: flex; gap: 14px; padding: 18px;
      background: var(--accent-bg); border: 1px solid rgba(199,132,59,0.3);
      border-radius: var(--radius-lg);
    }
    .notice-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--accent); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .notice-icon svg { width: 18px; height: 18px; }
    .notice-body { flex: 1; }
    .notice-title { font-weight: 800; font-size: 14px; color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em; }
    .notice-body p { font-size: 13px; color: var(--text); line-height: 1.55; margin-bottom: 6px; }
    .notice-body p:last-child { margin-bottom: 0; }
    .notice-pills { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
    .notice-pill {
      font-size: 11.5px; font-weight: 700;
      background: var(--surface); border: 1px solid var(--border);
      padding: 4px 10px; border-radius: 100px;
      color: var(--text); display: inline-flex; align-items: center; gap: 5px;
    }
    .notice-pill svg { width: 11px; height: 11px; color: var(--accent); }

    /* ===== Agreement checkboxes ===== */
    .agree-list { display: flex; flex-direction: column; gap: 8px; }
    .agree {
      display: flex; gap: 12px; padding: 14px;
      border: 1px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease; align-items: flex-start;
      background: var(--surface);
    }
    .agree:hover { border-color: var(--brand-soft); background: var(--surface-subtle); }
    .agree.checked { border-color: var(--brand); background: var(--brand-pale); }
    .agree-box {
      width: 20px; height: 20px; border-radius: 5px;
      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; background: var(--surface);
    }
    .agree.checked .agree-box { background: var(--brand); border-color: var(--brand); }
    .agree-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }
    .agree.checked .agree-box svg { opacity: 1; }
    .agree-body { flex: 1; font-size: 13.5px; color: var(--text); line-height: 1.5; }
    .agree-body strong { font-weight: 700; }
    .agree.hidden { display: none; }

    /* ===== Submit bar ===== */
    .submit-bar {
      display: flex; justify-content: space-between; align-items: center;
      gap: 14px; flex-wrap: wrap;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 18px 22px;
      box-shadow: var(--shadow-sm); margin-top: 4px;
    }
    .submit-note {
      font-size: 12.5px; color: var(--text-muted);
      display: inline-flex; align-items: center; gap: 8px;
    }
    .submit-note svg { width: 14px; height: 14px; color: var(--brand); }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }
    .btn-primary:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }
    .btn-primary:disabled { background: var(--border-strong); color: #fff; cursor: not-allowed; box-shadow: none; opacity: 0.7; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }

    /* ===== Success overlay ===== */
    .success-overlay {
      position: fixed; inset: 0; background: rgba(20,77,49,0.6);
      display: none; align-items: center; justify-content: center; z-index: 80;
      padding: 20px; backdrop-filter: blur(4px);
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
      border-radius: var(--radius); padding: 16px; margin-bottom: 22px;
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
    .timeline-text { color: var(--text); line-height: 1.45; }
    .timeline-text strong { font-weight: 700; }
    .timeline-text .muted { color: var(--text-muted); font-size: 12px; display: block; margin-top: 2px; }

    /* ===== Toast ===== */
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

    /* ===== Footer ===== */
    .legal-foot {
      max-width: 1100px; margin: 0 auto; padding: 28px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
      color: var(--text-faint); font-size: 11px;
    }
    .legal-foot a:hover { color: var(--brand); }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }

    @media (max-width: 920px) {
      .wrap { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .money-grid { grid-template-columns: 1fr; }
      .rel-list { grid-template-columns: 1fr; }
      .grid-2 { grid-template-columns: 1fr; }
      .flow-summary { grid-template-columns: 1fr; }
      .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
      .tb-help { width: 100%; justify-content: space-between; }
    }`;

const MOCK_HTML = `<!-- ===== Topbar ===== -->
  <header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Invite a roommate</div>
      </div>
    </div>
    <div class="tb-help">
      <a class="tb-back" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to portal
      </a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <!-- ===== Status banner ===== -->
  <div class="status-banner">
    <div class="status-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    </div>
    <div class="status-text">
      <strong>Invite a roommate or partner to join your lease</strong> &middot; Room C &middot; 908 Lee Drive NW
    </div>
  </div>

  <main class="wrap">

    <!-- ===== Sticky sidebar ===== -->
    <aside class="sidebar">
      <div class="side-eyebrow">Roommate add-on</div>
      <div class="side-title">4 steps to a joint lease</div>
      <div class="side-sub">This is how it works once you submit the invite below.</div>

      <div class="steps" id="progressSteps">
        <div class="step active" data-step="1">
          <div class="step-num">1</div>
          <div class="step-body">
            <div class="step-label">Their info</div>
            <div class="step-meta">You fill out this form &middot; ~3 min</div>
          </div>
        </div>
        <div class="step" data-step="2">
          <div class="step-num">2</div>
          <div class="step-body">
            <div class="step-label">They apply</div>
            <div class="step-meta">We email them a link &middot; ~10 min</div>
          </div>
        </div>
        <div class="step" data-step="3">
          <div class="step-num">3</div>
          <div class="step-body">
            <div class="step-label">Harrison reviews</div>
            <div class="step-meta">Background + income &middot; 3-5 days</div>
          </div>
        </div>
        <div class="step" data-step="4">
          <div class="step-num">4</div>
          <div class="step-body">
            <div class="step-label">Updated lease</div>
            <div class="step-meta">Both sign digitally &middot; day 7</div>
          </div>
        </div>
      </div>

      <div class="sidebar-foot">
        <div class="sidebar-contact">
          <strong>Not sure if they'll qualify?</strong><br>
          Text Harrison at <a href="sms:2565550102">(256) 555-0102</a> before you send the invite. Saves everyone a $45 application fee if there's a blocker.
        </div>
      </div>
    </aside>

    <!-- ===== Main column ===== -->
    <section class="main">

      <div class="page-head">
        <div class="page-kicker">Room C &middot; 908 Lee Drive NW</div>
        <h1>Add someone to your lease</h1>
        <p>Whether it's a partner moving in or a new housemate, the process is the same and it's fast.</p>

        <div class="flow-summary">
          <div class="flow-row">
            <div class="flow-dot">1</div>
            <div><strong>You fill this out</strong><span>Who they are, how rent splits.</span></div>
          </div>
          <div class="flow-row">
            <div class="flow-dot">2</div>
            <div><strong>They get a link</strong><span>Standard Black Bear application.</span></div>
          </div>
          <div class="flow-row">
            <div class="flow-dot">3</div>
            <div><strong>Harrison approves</strong><span>Then we e-sign a joint lease.</span></div>
          </div>
        </div>

        <div class="flow-total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Start-to-finish: about <strong>&nbsp;7 days</strong>&nbsp; if they apply the same day.
        </div>
      </div>

      <!-- ===== a. Relationship ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">A</span>Who are they to you?</div>
          <div class="card-sub">This changes one or two things: rent splits, the "coordinate with housemates" step, and the tone of the invite email.</div>
        </div>

        <div class="rel-list" id="relList">
          <div class="rel selected" data-rel="partner">
            <div class="rel-dot"></div>
            <div class="rel-body">
              <div class="rel-title">Partner or spouse</div>
              <div class="rel-sub">Moving in together</div>
            </div>
          </div>
          <div class="rel" data-rel="roommate">
            <div class="rel-dot"></div>
            <div class="rel-body">
              <div class="rel-title">Roommate</div>
              <div class="rel-sub">Friend or new housemate</div>
            </div>
          </div>
          <div class="rel" data-rel="family">
            <div class="rel-dot"></div>
            <div class="rel-body">
              <div class="rel-title">Family member</div>
              <div class="rel-sub">Sibling, parent, cousin</div>
            </div>
          </div>
          <div class="rel" data-rel="other">
            <div class="rel-dot"></div>
            <div class="rel-body">
              <div class="rel-title">Other</div>
              <div class="rel-sub">Tell us in the notes</div>
            </div>
          </div>
        </div>

        <div class="rel-copy" id="relCopy">
          <strong>Partner / spouse add-on.</strong> Congrats on the next step. We'll send a warmer invite email that mentions you by name, and we default to the 50/50 split since you're sharing a room.
        </div>
      </div>

      <!-- ===== b. Their info ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">B</span>Their info</div>
          <div class="card-sub">We send the application link straight to their email. Double-check the spelling.</div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label class="field-label field-label-req">First name</label>
            <input class="input" id="fName" type="text" placeholder="Jordan" autocomplete="off">
          </div>
          <div class="field">
            <label class="field-label field-label-req">Last name</label>
            <input class="input" id="lName" type="text" placeholder="Rivera" autocomplete="off">
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label class="field-label field-label-req">Email</label>
            <input class="input" id="email" type="email" placeholder="jordan@example.com" autocomplete="off">
            <div class="field-hint">The application link goes here. They'll verify it before applying.</div>
          </div>
          <div class="field">
            <label class="field-label field-label-req">Phone</label>
            <input class="input" id="phone" type="tel" placeholder="(256) 555-0147" autocomplete="off">
          </div>
        </div>

        <div class="field" style="margin-bottom:0;">
          <label class="field-label field-label-req">Proposed move-in date</label>
          <input class="input" id="moveIn" type="date" style="max-width:260px;">
          <div class="field-hint">Defaults to two weeks from today. Harrison will confirm once the application clears.</div>
        </div>
      </div>

      <!-- ===== c. Financial impact ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">C</span>How does rent work now?</div>
          <div class="card-sub">Pick a split. You can renegotiate later, but this is what goes on the joint lease.</div>
        </div>

        <div class="money-grid" id="moneyGrid">
          <div class="money-card selected" data-option="split">
            <div class="money-head">
              <div class="money-radio"></div>
              <div class="money-title">Split 50/50</div>
            </div>
            <div class="money-big">$375 <span style="font-size:13px; color:var(--text-muted); font-weight:600;">each</span></div>
            <div class="money-sub">Each of you pays your half directly. If one person is late, only that person is late — the other isn't on the hook.</div>
          </div>
          <div class="money-card" data-option="keep">
            <div class="money-head">
              <div class="money-radio"></div>
              <div class="money-title">Keep $750 &middot; joint liability</div>
            </div>
            <div class="money-big">$750 <span style="font-size:13px; color:var(--text-muted); font-weight:600;">together</span></div>
            <div class="money-sub">You sort out who pays what. Both signers are equally responsible for the full amount — if one doesn't pay, the other owes it.</div>
          </div>
        </div>

        <div class="money-breakdown">
          <div class="mb-row">
            <div class="mb-label">Monthly rent</div>
            <div class="mb-then">$750</div>
            <div class="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
            <div class="mb-now" id="mbRent">$375 each</div>
          </div>
          <div class="mb-row">
            <div class="mb-label">Security deposit on file</div>
            <div class="mb-then">$750</div>
            <div class="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
            <div class="mb-now" id="mbDeposit">$1,125 total</div>
          </div>
          <div class="mb-row">
            <div class="mb-label">Deposit they owe at signing</div>
            <div class="mb-then">&mdash;</div>
            <div class="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
            <div class="mb-now" id="mbAdd">+ $375 due from them</div>
          </div>
          <div class="mb-row total">
            <div class="mb-label">Your out-of-pocket change</div>
            <div class="mb-then"></div>
            <div class="mb-arrow"></div>
            <div class="mb-now" id="mbYou">&minus; $375 / month starting next cycle</div>
          </div>
        </div>
      </div>

      <!-- ===== d. Application notice ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">D</span>They have to apply &mdash; it's not instant</div>
          <div class="card-sub">Same application you filled out when you moved in. No shortcuts, but it's quick.</div>
        </div>

        <div class="notice">
          <div class="notice-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
          </div>
          <div class="notice-body">
            <div class="notice-title">What happens on their end</div>
            <p>They get an email with a secure link to Black Bear's standard application. It asks for ID, employment, income (3x rent), rental history, and runs a soft background + credit check through TransUnion SmartMove.</p>
            <p>Harrison reviews the packet within 3&ndash;5 business days and either approves, asks a follow-up question, or politely declines. You'll get a copy of the decision either way.</p>
            <div class="notice-pills">
              <span class="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> $45 application fee (they pay)</span>
              <span class="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ~10 min to fill out</span>
              <span class="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Encrypted &middot; SOC 2</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== e. House impact disclosure ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">E</span>Anything housemates should know?</div>
          <div class="card-sub">Shared-space stuff matters. Be honest here &mdash; it saves a household meeting later.</div>
        </div>

        <div class="field" style="margin-bottom:0;">
          <label class="field-label" for="impact">Will they use the house differently?</label>
          <textarea class="input" id="impact" placeholder="Example: They work nights so they'd use the kitchen around 11pm. Has a small cat &mdash; already chatted with Maya about it. Plans to use the back bedroom as a home office two days a week."></textarea>
          <div class="field-hint">Optional, but if there's a pet, a second vehicle, a noise change, or a shared-bath logistics thing, flag it now. Harrison shares this summary with the other housemates before approving.</div>
        </div>
      </div>

      <!-- ===== f. Agreements ===== -->
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="card-num">F</span>Before you send the invite</div>
          <div class="card-sub">Three quick confirmations. Two are required, one depends on your situation.</div>
        </div>

        <div class="agree-list" id="agreeList">
          <div class="agree" data-id="a1">
            <div class="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="agree-body">
              <strong>I understand they have to apply.</strong> Black Bear runs a standard application + background + credit check on every signer. Approval isn't guaranteed just because I'm inviting them, and the $45 fee isn't refundable if they're declined.
            </div>
          </div>

          <div class="agree" data-id="a2">
            <div class="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="agree-body">
              <strong>I accept joint financial responsibility</strong> if we go with the "keep $750, both responsible" option. That means if they stop paying, I'm on the hook for the full rent until the lease ends or we re-sign. The 50/50 split doesn't have this clause.
            </div>
          </div>

          <div class="agree hidden" data-id="a3">
            <div class="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="agree-body">
              <strong>I've coordinated with my housemates.</strong> Since this is a roommate-add in a shared house, I've at least given the other tenants a heads-up and nobody's blocking it. Harrison will still confirm with them directly before approving.
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Submit bar ===== -->
      <div class="submit-bar">
        <div class="submit-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          We won't charge anyone until Harrison approves the application.
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <a class="btn btn-ghost" href="portal.html">Cancel</a>
          <button class="btn btn-primary" id="sendBtn" disabled onclick="sendInvite()">
            Send invite
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

    </section>
  </main>

  <!-- ===== Success overlay ===== -->
  <div class="success-overlay" id="successOverlay">
    <div class="success-card">
      <div class="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2>Invite sent to <span id="successName">Jordan</span></h2>
      <div class="success-sub">
        We just emailed <strong id="successEmail">jordan@example.com</strong> an application link. You'll get a copy too. Here's what's next.
      </div>

      <div class="timeline">
        <div class="timeline-row">
          <div class="timeline-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="timeline-text">
            <strong>Today</strong> &middot; Invite email sent
            <span class="muted">They have 7 days to start the application before the link expires.</span>
          </div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">2</div>
          <div class="timeline-text">
            <strong>Within a week</strong> &middot; They submit the application
            <span class="muted">We'll nudge them if they don't start it within 48 hours.</span>
          </div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">3</div>
          <div class="timeline-text">
            <strong>3&ndash;5 business days</strong> &middot; Harrison reviews
            <span class="muted">You'll get an email with the decision either way.</span>
          </div>
        </div>
        <div class="timeline-row">
          <div class="timeline-icon upcoming">4</div>
          <div class="timeline-text">
            <strong>Day 7 or so</strong> &middot; Joint lease + e-sign
            <span class="muted">Both of you sign in the portal. Deposit top-up hits at signing.</span>
          </div>
        </div>
      </div>

      <a class="btn btn-primary" href="portal.html" style="width:100%; justify-content:center;">
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>

  <!-- ===== Footer ===== -->
  <footer class="legal-foot">
    <div>&copy; 2026 Black Bear Rentals &middot; <a href="legal-privacy.md">Privacy</a> &middot; <a href="legal-terms.md">Terms</a></div>
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
