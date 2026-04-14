"use client";

// Mock ported verbatim from ~/Desktop/tenantory/apply.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt);
      line-height: 1.5; font-size: 14px; min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    /* Same brand tokens as portal.html (Black Bear Rentals) */
    :root {
      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;
      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;
      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);
      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;
      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;
      --border: #e5e1d4; --border-strong: #c9c3b0;
      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;
      --red: #b23a3a; --red-bg: rgba(178,58,58,0.1);
      --amber: #c7843b;
      --radius-sm: 6px; --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* Topbar */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9);
      padding: 16px 32px;
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

    .wrap {
      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;
      display: grid; grid-template-columns: 340px 1fr; gap: 32px; align-items: flex-start;
    }

    /* ===== Unit preview (sticky left) ===== */
    .unit-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      position: sticky; top: 20px; box-shadow: var(--shadow-sm);
    }
    .unit-hero {
      aspect-ratio: 4 / 3;
      background:
        linear-gradient(135deg, rgba(30,111,71,0.7), rgba(199,132,59,0.5)),
        radial-gradient(ellipse at 30% 70%, var(--brand-bright), transparent 60%),
        linear-gradient(180deg, #b8a478, #8a7653);
      position: relative;
      display: flex; align-items: flex-end; padding: 18px;
    }
    .unit-hero-badge {
      background: rgba(255,255,255,0.92); color: var(--brand-dark);
      padding: 5px 11px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    }
    .unit-body { padding: 20px; }
    .unit-rent { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
    .unit-rent small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }
    .unit-title { font-size: 15px; font-weight: 700; color: var(--text); margin-top: 10px; }
    .unit-addr { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

    .unit-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }
    .unit-meta-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
    .unit-meta-item svg { width: 15px; height: 15px; color: var(--brand); flex-shrink: 0; }
    .unit-meta-item strong { color: var(--text); font-weight: 700; }

    .unit-features { display: flex; flex-direction: column; gap: 6px; padding-top: 14px; border-top: 1px solid var(--border); }
    .unit-feature { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text); }
    .unit-feature svg { width: 12px; height: 12px; color: var(--green); flex-shrink: 0; }

    .unit-operator {
      margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
    }
    .unit-op-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand-bright), var(--accent));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .unit-op-name { font-weight: 700; font-size: 13px; color: var(--text); }
    .unit-op-role { font-size: 11px; color: var(--text-muted); }

    /* ===== Form side ===== */
    .form-col { min-width: 0; }

    .form-head { margin-bottom: 20px; }
    .form-kicker {
      font-size: 11px; font-weight: 700; color: var(--brand);
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;
    }
    .form-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .form-head p { color: var(--text-muted); font-size: 14px; max-width: 560px; }

    /* Step progress */
    .steps-bar {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
      margin-bottom: 24px;
    }
    .step-pill {
      padding: 10px 12px; border-radius: var(--radius);
      background: var(--surface); border: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
      font-size: 12px; color: var(--text-faint); font-weight: 600;
      transition: all 0.2s ease;
    }
    .step-pill-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--surface-subtle); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      flex-shrink: 0;
    }
    .step-pill-num svg { width: 11px; height: 11px; }
    .step-pill.active { border-color: var(--brand); color: var(--brand-dark); background: var(--brand-pale); }
    .step-pill.active .step-pill-num { background: var(--brand); border-color: var(--brand); color: #fff; }
    .step-pill.done { border-color: var(--green); color: var(--green-dark); }
    .step-pill.done .step-pill-num { background: var(--green); border-color: var(--green); color: #fff; }

    /* Form */
    .form-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px;
      box-shadow: var(--shadow-sm);
    }

    .step-panel { display: none; }
    .step-panel.active { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .step-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .step-desc { color: var(--text-muted); font-size: 13px; margin-bottom: 22px; }

    .field { margin-bottom: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
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

    .input-prefix-wrap {
      display: flex; align-items: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden; transition: all 0.15s ease;
    }
    .input-prefix-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    .input-prefix {
      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;
      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;
      border-right: 1px solid var(--border);
    }
    .input-prefix-wrap input { flex: 1; padding: 11px 14px; border: none; outline: none; background: transparent; }

    /* Upload */
    .upload {
      border: 1.5px dashed var(--border-strong); border-radius: var(--radius);
      padding: 18px; text-align: center; background: var(--surface-subtle);
      cursor: pointer; transition: all 0.15s ease;
    }
    .upload:hover { border-color: var(--brand); background: var(--brand-pale); }
    .upload svg { width: 28px; height: 28px; color: var(--text-faint); margin: 0 auto 8px; }
    .upload-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .upload-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .upload.uploaded { border-style: solid; border-color: var(--green); background: var(--green-bg); }
    .upload.uploaded svg { color: var(--green); }

    /* Radio group */
    .radio-group { display: flex; flex-direction: column; gap: 8px; }
    .radio {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px;
      border: 1.5px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease;
    }
    .radio:hover { border-color: var(--brand); }
    .radio.selected { border-color: var(--brand); background: var(--brand-pale); }
    .radio-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;
      position: relative; transition: all 0.15s ease;
    }
    .radio.selected .radio-dot { border-color: var(--brand); background: var(--brand); }
    .radio.selected .radio-dot::after {
      content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #fff;
    }
    .radio-body { flex: 1; }
    .radio-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .radio-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    /* Landlord block */
    .landlord-block {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px; margin-bottom: 14px;
    }
    .landlord-block-head {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    }
    .landlord-block-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .block-remove {
      color: var(--red); font-size: 12px; font-weight: 600;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .block-remove:hover { text-decoration: underline; }
    .block-remove svg { width: 12px; height: 12px; }

    .link-btn { color: var(--brand); font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .link-btn:hover { text-decoration: underline; }
    .link-btn svg { width: 14px; height: 14px; }

    /* Review step */
    .review-section {
      padding: 16px; background: var(--surface-subtle); border-radius: var(--radius);
      margin-bottom: 12px;
    }
    .review-section-head {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
    }
    .review-section-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .review-edit { color: var(--brand); font-size: 12px; font-weight: 600; }
    .review-edit:hover { text-decoration: underline; }
    .review-kv { display: grid; grid-template-columns: 140px 1fr; gap: 12px; font-size: 13px; padding: 4px 0; }
    .review-kv-k { color: var(--text-muted); }
    .review-kv-v { color: var(--text); font-weight: 500; }

    .fee-box {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: #fff; padding: 22px; border-radius: var(--radius-lg);
      margin: 20px 0; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
    }
    .fee-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
    .fee-amount { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
    .fee-note { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 6px; }
    .fee-shield { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; }
    .fee-shield svg { width: 24px; height: 24px; color: #fff; }

    .check-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .check {
      display: flex; gap: 12px; padding: 14px;
      border: 1.5px solid var(--border); border-radius: var(--radius);
      cursor: pointer; transition: all 0.15s ease;
    }
    .check:hover { border-color: var(--brand); }
    .check.checked { border-color: var(--brand); background: var(--brand-pale); }
    .check-box {
      width: 20px; height: 20px; border-radius: 5px;
      border: 2px solid var(--border-strong); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; margin-top: 1px;
    }
    .check.checked .check-box { background: var(--brand); border-color: var(--brand); }
    .check-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }
    .check.checked .check-box svg { opacity: 1; }
    .check-body { flex: 1; font-size: 13px; color: var(--text); line-height: 1.45; }
    .check-body strong { font-weight: 700; }

    /* Footer buttons */
    .form-foot {
      margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(20,77,49,0.25); }
    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }

    /* Success screen */
    .success {
      padding: 48px 32px; text-align: center;
    }
    .success-badge {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand-bright), var(--brand));
      color: #fff; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 22px; box-shadow: 0 14px 40px rgba(30,111,71,0.3);
    }
    .success-badge svg { width: 40px; height: 40px; }
    .success h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }
    .success-sub { color: var(--text-muted); font-size: 15px; max-width: 460px; margin: 0 auto 24px; }
    .success-next {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 18px; margin: 0 auto 24px;
      max-width: 420px; text-align: left;
    }
    .success-next-title { font-weight: 700; font-size: 13px; color: var(--text); margin-bottom: 10px; }
    .success-next-step { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; font-size: 13px; color: var(--text); }
    .success-next-step-num {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--brand); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }

    /* Footer */
    .legal-foot {
      max-width: 1100px; margin: 20px auto 28px; padding: 0 32px;
      color: var(--text-faint); font-size: 11px;
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;
    }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
    .legal-foot a:hover { color: var(--brand); }

    /* Toast */
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

    @media (max-width: 880px) {
      .wrap { grid-template-columns: 1fr; }
      .unit-card { position: static; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .steps-bar { grid-template-columns: repeat(4, 1fr); gap: 4px; }
      .step-pill { padding: 8px; font-size: 11px; }
      .step-pill-label { display: none; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Rental application</div>
      </div>
    </div>
    <div class="tb-help">
      <a href="listings.html" style="margin-right:18px;">&larr; All listings</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <main class="wrap">

    <!-- Unit preview -->
    <aside class="unit-card">
      <div class="unit-hero">
        <span class="unit-hero-badge">Available May 1</span>
      </div>
      <div class="unit-body">
        <div class="unit-rent">$750<small>/mo</small></div>
        <div class="unit-title">Room A · Co-living house</div>
        <div class="unit-addr">908 Lee Dr NW, Huntsville AL 35816</div>

        <div class="unit-meta">
          <div class="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M8 12h8M3 7l2-4h14l2 4"/></svg>
            <span><strong>135 sq ft</strong></span>
          </div>
          <div class="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Lease <strong>12 months</strong></span>
          </div>
          <div class="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Deposit <strong>$750</strong></span>
          </div>
          <div class="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5z"/></svg>
            <span><strong>Pets OK</strong></span>
          </div>
        </div>

        <div class="unit-features">
          <div class="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>All utilities included (gas, water, electric, internet)</div>
          <div class="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Furnished · bed, desk, dresser, nightstand</div>
          <div class="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Shared kitchen, laundry, and living room</div>
          <div class="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Off-street parking for one vehicle</div>
          <div class="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>1.4 miles from UAH campus</div>
        </div>

        <div class="unit-operator">
          <div class="unit-op-avatar">HC</div>
          <div>
            <div class="unit-op-name">Harrison Cooper</div>
            <div class="unit-op-role">Owner · Black Bear Rentals</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Form -->
    <section class="form-col">

      <div class="form-head">
        <div class="form-kicker">Takes about 6 minutes · $45 application fee</div>
        <h1>Apply for Room A</h1>
        <p>We review every application personally within 48 hours. You'll hear back by email — approved, denied, or with follow-up questions.</p>
      </div>

      <div class="steps-bar">
        <div class="step-pill active" data-pill="1">
          <div class="step-pill-num">1</div>
          <span class="step-pill-label">About you</span>
        </div>
        <div class="step-pill" data-pill="2">
          <div class="step-pill-num">2</div>
          <span class="step-pill-label">Income</span>
        </div>
        <div class="step-pill" data-pill="3">
          <div class="step-pill-num">3</div>
          <span class="step-pill-label">History</span>
        </div>
        <div class="step-pill" data-pill="4">
          <div class="step-pill-num">4</div>
          <span class="step-pill-label">Review</span>
        </div>
      </div>

      <div class="form-card">

        <!-- Step 1 -->
        <div class="step-panel active" data-panel="1">
          <h2 class="step-title">About you</h2>
          <p class="step-desc">Legal name and contact info so we can reach you and run a background check.</p>

          <div class="grid-2">
            <div class="field">
              <label class="field-label field-label-req">Legal first name</label>
              <input class="input" type="text" placeholder="Jane" required>
            </div>
            <div class="field">
              <label class="field-label field-label-req">Legal last name</label>
              <input class="input" type="text" placeholder="Doe" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label field-label-req">Email</label>
              <input class="input" type="email" placeholder="you@example.com" required>
            </div>
            <div class="field">
              <label class="field-label field-label-req">Phone</label>
              <input class="input" type="tel" placeholder="(555) 123-4567" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label field-label-req">Date of birth</label>
              <input class="input" type="date" required>
            </div>
            <div class="field">
              <label class="field-label field-label-req">Move-in date</label>
              <input class="input" type="date" value="2026-05-01" required>
            </div>
          </div>

          <div class="field">
            <label class="field-label field-label-req">Current address</label>
            <input class="input" type="text" placeholder="Street, City, State, ZIP" required>
          </div>

          <div class="field">
            <label class="field-label">Government ID</label>
            <div class="upload" onclick="markUploaded(this, 'Driver\\'s license · verified')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h4M6 17h12"/></svg>
              <div class="upload-title">Upload a photo of your driver's license or passport</div>
              <div class="upload-sub">Encrypted · only visible to your landlord</div>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-panel" data-panel="2">
          <h2 class="step-title">Income &amp; employment</h2>
          <p class="step-desc">We look for income of at least 2.5x the monthly rent ($1,875/mo in this case) through any combination of sources.</p>

          <div class="field">
            <label class="field-label field-label-req">Employment status</label>
            <div class="radio-group" id="employmentGroup">
              <div class="radio selected" data-val="w2">
                <div class="radio-dot"></div>
                <div class="radio-body">
                  <div class="radio-title">Employed (W-2)</div>
                  <div class="radio-sub">Steady paycheck from a single employer</div>
                </div>
              </div>
              <div class="radio" data-val="1099">
                <div class="radio-dot"></div>
                <div class="radio-body">
                  <div class="radio-title">Self-employed or 1099</div>
                  <div class="radio-sub">Freelance, contractor, or business owner</div>
                </div>
              </div>
              <div class="radio" data-val="student">
                <div class="radio-dot"></div>
                <div class="radio-body">
                  <div class="radio-title">Student (with guarantor)</div>
                  <div class="radio-sub">We'll also collect your guarantor's info</div>
                </div>
              </div>
              <div class="radio" data-val="other">
                <div class="radio-dot"></div>
                <div class="radio-body">
                  <div class="radio-title">Other income</div>
                  <div class="radio-sub">Retirement, disability, trust, housing assistance, etc.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field-label field-label-req">Employer / business name</label>
            <input class="input" type="text" placeholder="Acme Software LLC" required>
          </div>

          <div class="grid-2">
            <div class="field">
              <label class="field-label field-label-req">Job title</label>
              <input class="input" type="text" placeholder="Software engineer">
            </div>
            <div class="field">
              <label class="field-label field-label-req">Start date</label>
              <input class="input" type="month">
            </div>
          </div>

          <div class="field">
            <label class="field-label field-label-req">Monthly gross income</label>
            <div class="input-prefix-wrap">
              <span class="input-prefix">$</span>
              <input type="number" placeholder="4000" min="0" step="100" required>
            </div>
            <div class="field-hint">Before taxes. Add up all income sources if you have more than one.</div>
          </div>

          <div class="field">
            <label class="field-label">Proof of income</label>
            <div class="upload" onclick="markUploaded(this, 'Last 2 pay stubs · uploaded')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
              <div class="upload-title">Upload 2 most recent pay stubs, or last year's tax return</div>
              <div class="upload-sub">PDF, JPG, or PNG · up to 5 files</div>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="step-panel" data-panel="3">
          <h2 class="step-title">Rental history</h2>
          <p class="step-desc">Your two most recent landlords. We'll call both — this is the single biggest factor in our decision.</p>

          <div id="landlordList">
            <div class="landlord-block">
              <div class="landlord-block-head">
                <div class="landlord-block-title">Current (or most recent) landlord</div>
              </div>
              <div class="grid-2">
                <div class="field" style="margin-bottom:10px;">
                  <label class="field-label">Landlord name</label>
                  <input class="input" type="text" placeholder="John Smith">
                </div>
                <div class="field" style="margin-bottom:10px;">
                  <label class="field-label">Phone</label>
                  <input class="input" type="tel" placeholder="(555) 123-4567">
                </div>
              </div>
              <div class="grid-2">
                <div class="field" style="margin-bottom:10px;">
                  <label class="field-label">Address you rented</label>
                  <input class="input" type="text" placeholder="123 Main St, City, ST">
                </div>
                <div class="field" style="margin-bottom:10px;">
                  <label class="field-label">Monthly rent</label>
                  <div class="input-prefix-wrap">
                    <span class="input-prefix">$</span>
                    <input type="number" placeholder="850" min="0" step="50">
                  </div>
                </div>
              </div>
              <div class="grid-2">
                <div class="field" style="margin-bottom:0;">
                  <label class="field-label">Moved in</label>
                  <input class="input" type="month">
                </div>
                <div class="field" style="margin-bottom:0;">
                  <label class="field-label">Moved out (or "present")</label>
                  <input class="input" type="text" placeholder="Present">
                </div>
              </div>
            </div>
          </div>

          <button class="link-btn" onclick="addLandlord()" style="margin-bottom:22px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add a second landlord
          </button>

          <div class="field">
            <label class="field-label">Have you ever been evicted?</label>
            <div class="radio-group" id="evictedGroup" style="flex-direction:row;">
              <div class="radio selected" data-val="no" style="flex:1;">
                <div class="radio-dot"></div>
                <div class="radio-body"><div class="radio-title">No</div></div>
              </div>
              <div class="radio" data-val="yes" style="flex:1;">
                <div class="radio-dot"></div>
                <div class="radio-body"><div class="radio-title">Yes · I'll explain</div></div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Pets</label>
            <input class="input" type="text" placeholder="e.g. one 15 lb dog, spayed · or "No pets"">
            <div class="field-hint">Black Bear Rentals welcomes pets. $250 pet deposit per animal.</div>
          </div>

          <div class="field">
            <label class="field-label">Anything we should know?</label>
            <textarea class="input" placeholder="Tell us about yourself — why this place, anything unusual, references beyond landlords, etc. This often matters more than the numbers."></textarea>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="step-panel" data-panel="4">
          <h2 class="step-title">Review &amp; submit</h2>
          <p class="step-desc">Double-check your answers, authorize the background check, and pay the $45 application fee.</p>

          <div class="review-section">
            <div class="review-section-head">
              <div class="review-section-title">About you</div>
              <button class="review-edit" onclick="gotoStep(1)">Edit</button>
            </div>
            <div class="review-kv"><span class="review-kv-k">Name</span><span class="review-kv-v">Jane Doe</span></div>
            <div class="review-kv"><span class="review-kv-k">Email</span><span class="review-kv-v">jane.doe@example.com</span></div>
            <div class="review-kv"><span class="review-kv-k">Phone</span><span class="review-kv-v">(555) 123-4567</span></div>
            <div class="review-kv"><span class="review-kv-k">Move-in</span><span class="review-kv-v">May 1, 2026</span></div>
          </div>
          <div class="review-section">
            <div class="review-section-head">
              <div class="review-section-title">Income</div>
              <button class="review-edit" onclick="gotoStep(2)">Edit</button>
            </div>
            <div class="review-kv"><span class="review-kv-k">Status</span><span class="review-kv-v">Employed (W-2)</span></div>
            <div class="review-kv"><span class="review-kv-k">Employer</span><span class="review-kv-v">Acme Software LLC</span></div>
            <div class="review-kv"><span class="review-kv-k">Monthly gross</span><span class="review-kv-v">$4,000 · <span style="color:var(--green-dark);font-weight:700;">5.3x rent</span></span></div>
          </div>
          <div class="review-section">
            <div class="review-section-head">
              <div class="review-section-title">Rental history</div>
              <button class="review-edit" onclick="gotoStep(3)">Edit</button>
            </div>
            <div class="review-kv"><span class="review-kv-k">Landlords</span><span class="review-kv-v">1 landlord added</span></div>
            <div class="review-kv"><span class="review-kv-k">Evictions</span><span class="review-kv-v">None</span></div>
          </div>

          <div class="fee-box">
            <div>
              <div class="fee-label">Application fee</div>
              <div class="fee-amount">$45.00</div>
              <div class="fee-note">Non-refundable · covers background check + credit report</div>
            </div>
            <div class="fee-shield">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>

          <div class="check-group">
            <div class="check" data-check="bg" onclick="this.classList.toggle('checked')">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">I authorize <strong>Black Bear Rentals</strong> to run a credit check, background check, and contact my listed landlords and employer to verify this application.</div>
            </div>
            <div class="check" data-check="truth" onclick="this.classList.toggle('checked')">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">Everything I've entered is <strong>true and accurate</strong> to the best of my knowledge. Knowingly providing false information is grounds for denial.</div>
            </div>
            <div class="check" data-check="terms" onclick="this.classList.toggle('checked')">
              <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div class="check-body">I understand the <strong>$45 application fee is non-refundable</strong>, even if my application is denied, and agree to Black Bear Rentals' <a href="#" style="color:var(--brand);text-decoration:underline;">rental policies</a>.</div>
            </div>
          </div>
        </div>

        <!-- Submitted -->
        <div class="step-panel" data-panel="done">
          <div class="success">
            <div class="success-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2>Application submitted</h2>
            <p class="success-sub">Thanks, Jane. Harrison was just notified — he personally reviews every application within 48 hours, often sooner. A receipt for your $45 fee is on its way to your email.</p>
            <div class="success-next">
              <div class="success-next-title">What happens next</div>
              <div class="success-next-step"><div class="success-next-step-num">1</div><div>We run your credit and background checks (automated · takes ~10 minutes)</div></div>
              <div class="success-next-step"><div class="success-next-step-num">2</div><div>Harrison calls your current landlord and employer to verify</div></div>
              <div class="success-next-step"><div class="success-next-step-num">3</div><div>You'll get an email within 48 hours — approved, declined, or with follow-up questions</div></div>
              <div class="success-next-step"><div class="success-next-step-num">4</div><div>If approved, you'll get a link to <a href="sign.html" style="color:var(--brand);font-weight:600;text-decoration:underline;">e-sign your lease</a> and pay your deposit</div></div>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <a class="btn btn-primary" href="sign.html">
                Preview the signing flow
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a class="btn btn-ghost" href="mailto:hello@rentblackbear.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
                Email Harrison with a question
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="form-foot" id="formFoot">
          <button class="btn btn-ghost" id="backBtn" onclick="goBack()" disabled style="opacity:0.5;pointer-events:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button class="btn btn-primary" id="nextBtn" onclick="goNext()">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

      </div>

    </section>
  </main>

  <footer class="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Fair Housing</a> · <a href="#">Privacy</a></div>
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
