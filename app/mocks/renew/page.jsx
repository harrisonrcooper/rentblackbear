"use client";

// Mock ported verbatim from ~/Desktop/tenantory/renew.html.
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
    input, select { font-family: inherit; font-size: inherit; color: inherit; }

    /* Black Bear tokens (matches portal/apply/sign/moveout) */
    :root {
      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;
      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;
      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);
      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;
      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;
      --border: #e5e1d4; --border-strong: #c9c3b0;
      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;
      --red: #b23a3a; --amber: #c7843b;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

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

    .wrap { max-width: 900px; margin: 0 auto; padding: 32px 32px 60px; }

    /* Status banner */
    .banner {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius-lg); padding: 18px 22px;
      display: flex; gap: 14px; align-items: center; margin-bottom: 24px;
    }
    .banner-icon {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--brand); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .banner-icon svg { width: 18px; height: 18px; }
    .banner-text { font-size: 13.5px; color: var(--text); line-height: 1.55; }
    .banner-text strong { color: var(--brand-dark); font-weight: 700; }

    .page-head { margin-bottom: 24px; }
    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 640px; }

    /* Choice cards */
    .choices { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
    .choice {
      background: var(--surface); border: 2px solid var(--border);
      border-radius: var(--radius-xl); padding: 22px 26px;
      cursor: pointer; transition: all 0.15s ease;
      display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center;
    }
    .choice:hover { border-color: var(--brand-soft); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    .choice.selected { border-color: var(--brand); background: var(--brand-pale); }
    .choice.recommended { position: relative; }
    .choice.recommended::after {
      content: "Recommended"; position: absolute; top: -10px; right: 20px;
      background: var(--brand); color: #fff; padding: 3px 10px; border-radius: 100px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .choice-radio {
      width: 22px; height: 22px; border-radius: 50%;
      border: 2px solid var(--border-strong); flex-shrink: 0;
      position: relative; transition: all 0.15s ease;
    }
    .choice.selected .choice-radio { border-color: var(--brand); background: var(--brand); }
    .choice.selected .choice-radio::after {
      content: ""; position: absolute; inset: 4px; border-radius: 50%; background: #fff;
    }
    .choice-body { min-width: 0; }
    .choice-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); margin-bottom: 4px; }
    .choice-sub { font-size: 13px; color: var(--text-muted); line-height: 1.55; margin-bottom: 8px; }
    .choice-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }
    .choice-meta-item { display: inline-flex; align-items: center; gap: 5px; }
    .choice-meta-item svg { width: 12px; height: 12px; color: var(--brand); }
    .choice-meta-item strong { color: var(--text); font-weight: 700; }
    .choice-price { text-align: right; flex-shrink: 0; }
    .choice-price-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
    .choice-price-val { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; margin-top: 4px; }
    .choice-price-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
    .choice-price-delta { font-size: 11px; font-weight: 700; color: var(--amber); margin-top: 2px; }
    .choice-price-delta.flat { color: var(--green-dark); }
    .choice-price-delta.up { color: var(--amber); }

    /* Details panel (conditional) */
    .details {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px; margin-bottom: 20px;
      box-shadow: var(--shadow-sm); display: none;
    }
    .details.show { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .det-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .det-title { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
    .det-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }

    .kv-row {
      display: grid; grid-template-columns: 1fr auto; gap: 14px;
      padding: 12px 0; border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    .kv-row:last-of-type { border-bottom: none; }
    .kv-key { color: var(--text-muted); }
    .kv-val { color: var(--text); font-weight: 700; text-align: right; }
    .kv-val.highlight { color: var(--brand-dark); }
    .kv-val .old { color: var(--text-faint); text-decoration: line-through; font-weight: 500; margin-right: 6px; font-size: 13px; }

    .callout {
      background: var(--brand-pale); border: 1px solid var(--brand-soft);
      border-radius: var(--radius); padding: 14px 16px; margin-top: 16px;
      font-size: 13px; color: var(--brand-dark); line-height: 1.55;
      display: flex; gap: 10px;
    }
    .callout svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--brand-dark); }

    /* Why renew section */
    .reasons {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      margin-bottom: 20px;
    }
    .reasons-title { font-size: 14px; font-weight: 800; margin-bottom: 14px; }
    .reason-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .reason-item {
      display: flex; gap: 10px; align-items: flex-start;
      font-size: 13px; color: var(--text); line-height: 1.5;
    }
    .reason-item svg { width: 14px; height: 14px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }

    /* Signature / agree */
    .sig-block {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      margin-bottom: 16px;
    }
    .sig-block-head { margin-bottom: 14px; }
    .sig-title { font-size: 15px; font-weight: 800; margin-bottom: 3px; }
    .sig-sub { font-size: 12.5px; color: var(--text-muted); }
    .sig-input {
      width: 100%; padding: 12px 14px; background: var(--surface-subtle);
      border: 1.5px solid var(--border); border-radius: var(--radius);
      font-size: 14px; color: var(--text); outline: none; transition: all 0.15s ease;
      margin-bottom: 10px;
    }
    .sig-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    .sig-render {
      padding: 16px 14px; border-radius: var(--radius);
      background: var(--surface-subtle); border: 1.5px dashed var(--border-strong);
      min-height: 62px; display: flex; align-items: center;
      font-family: 'Inter', cursive; font-size: 30px; font-weight: 500;
      font-style: italic; color: var(--brand-dark); letter-spacing: -0.01em;
    }
    .sig-render.empty { color: var(--text-faint); font-size: 14px; font-style: italic; font-weight: 400; }
    .sig-render.signed { border-style: solid; border-color: var(--brand); background: var(--brand-pale); }

    .agree-row {
      display: flex; gap: 12px; padding: 10px 0;
      font-size: 13px; color: var(--text); line-height: 1.5; cursor: pointer;
    }
    .agree-row strong { font-weight: 700; }
    .agree-box {
      width: 20px; height: 20px; border-radius: 5px;
      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .agree-row.checked .agree-box { background: var(--brand); border-color: var(--brand); }
    .agree-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }
    .agree-row.checked .agree-box svg { opacity: 1; }

    /* Submit bar */
    .submit-bar {
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px; flex-wrap: wrap; margin-top: 18px;
    }
    .save-note { font-size: 12px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px; }
    .save-note svg { width: 13px; height: 13px; color: var(--green-dark); }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }
    .btn-primary:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }
    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }
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
      padding: 44px 34px; max-width: 500px; width: 100%;
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

    /* Footer */
    .legal-foot {
      max-width: 900px; margin: 0 auto; padding: 24px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
      color: var(--text-faint); font-size: 11px;
    }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }

    @media (max-width: 700px) {
      .wrap { padding: 20px 16px; }
      .choice { grid-template-columns: auto 1fr; padding: 18px; }
      .choice-price { grid-column: 1 / -1; text-align: left; padding-top: 12px; border-top: 1px solid var(--border); }
      .reason-list { grid-template-columns: 1fr; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Lease renewal</div>
      </div>
    </div>
    <div class="tb-help">
      <a href="portal.html" style="margin-right:18px;">&larr; Back to portal</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <main class="wrap">

    <div class="banner">
      <div class="banner-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="banner-text">
        Your lease for <strong>Room C · 908 Lee Drive</strong> ends <strong>Dec 31, 2026</strong> — that's 78 days from now. Pick one of the three options below. Harrison would love to have you stay, but zero pressure.
      </div>
    </div>

    <div class="page-head">
      <div class="page-kicker">Room C · 908 Lee Drive</div>
      <h1>Let's figure out what's next.</h1>
      <p>You've been at Black Bear for almost a year. Great housemate, always paid on time. Here are your three options — pick one, and Harrison will take it from there.</p>
    </div>

    <!-- 3 options -->
    <div class="choices" id="choices">

      <label class="choice recommended selected" data-choice="12mo">
        <div class="choice-radio"></div>
        <div class="choice-body">
          <div class="choice-title">Renew for 12 more months</div>
          <div class="choice-sub">Same room, same housemates. Rent stays flat — no increase this year.</div>
          <div class="choice-meta">
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Jan 1, 2027 – Dec 31, 2027</span>
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Same rent</span>
          </div>
        </div>
        <div class="choice-price">
          <div class="choice-price-label">Monthly</div>
          <div class="choice-price-val">$750</div>
          <div class="choice-price-delta flat">No change</div>
        </div>
      </label>

      <label class="choice" data-choice="mtm">
        <div class="choice-radio"></div>
        <div class="choice-body">
          <div class="choice-title">Month-to-month</div>
          <div class="choice-sub">Flexibility to leave anytime with 30 days notice. Slight rent bump to cover the turnover risk.</div>
          <div class="choice-meta">
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Month-to-month</span>
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>30-day notice</span>
          </div>
        </div>
        <div class="choice-price">
          <div class="choice-price-label">Monthly</div>
          <div class="choice-price-val">$800</div>
          <div class="choice-price-delta up">+$50/mo</div>
        </div>
      </label>

      <label class="choice" data-choice="moveout">
        <div class="choice-radio"></div>
        <div class="choice-body">
          <div class="choice-title">I'm moving out Dec 31</div>
          <div class="choice-sub">No hard feelings. We'll get your deposit back within 35 days of move-out and send references to your next landlord.</div>
          <div class="choice-meta">
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Ends Dec 31, 2026</span>
            <span class="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>$750 deposit returned</span>
          </div>
        </div>
        <div class="choice-price">
          <div class="choice-price-label">Move-out</div>
          <div class="choice-price-val">Dec 31</div>
          <div class="choice-price-sub">Full checklist + walkthrough</div>
        </div>
      </label>

    </div>

    <!-- Details panel: 12mo renewal -->
    <div class="details show" id="details-12mo">
      <div class="det-head">
        <div>
          <div class="det-title">Your new lease terms</div>
          <div class="det-sub">Starts Jan 1, 2027. Everything else stays the same as your current lease.</div>
        </div>
      </div>
      <div class="kv-row"><span class="kv-key">Lease term</span><span class="kv-val">Jan 1, 2027 – Dec 31, 2027 · 12 months</span></div>
      <div class="kv-row"><span class="kv-key">Monthly rent</span><span class="kv-val highlight"><span class="old">$750</span>$750 · no change</span></div>
      <div class="kv-row"><span class="kv-key">Due date</span><span class="kv-val">1st of the month</span></div>
      <div class="kv-row"><span class="kv-key">Deposit</span><span class="kv-val">$750 held (no change)</span></div>
      <div class="kv-row"><span class="kv-key">Utilities</span><span class="kv-val">All still included</span></div>
      <div class="kv-row"><span class="kv-key">Pet policy</span><span class="kv-val">Same — let Harrison know if that changes</span></div>

      <div class="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>Rent could have gone up — Huntsville comps for this size room are running $780–$840 right now. Holding flat is a thank-you for being easy to work with. We appreciate you.</div>
      </div>
    </div>

    <!-- Details panel: MTM -->
    <div class="details" id="details-mtm">
      <div class="det-head">
        <div>
          <div class="det-title">Month-to-month terms</div>
          <div class="det-sub">Maximum flexibility. Either side can end it with 30 days written notice.</div>
        </div>
      </div>
      <div class="kv-row"><span class="kv-key">Start date</span><span class="kv-val">Jan 1, 2027</span></div>
      <div class="kv-row"><span class="kv-key">End date</span><span class="kv-val">Rolling · no fixed end</span></div>
      <div class="kv-row"><span class="kv-key">Monthly rent</span><span class="kv-val highlight"><span class="old">$750</span>$800 · +$50/mo</span></div>
      <div class="kv-row"><span class="kv-key">Notice to end</span><span class="kv-val">30 days written (either side)</span></div>
      <div class="kv-row"><span class="kv-key">Deposit</span><span class="kv-val">$750 held (no change)</span></div>

      <div class="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>The +$50/mo covers the higher turnover risk — month-to-month rooms stay vacant longer between tenants, and a filled room is worth more than an empty one. Totally fair, zero pressure either direction.</div>
      </div>
    </div>

    <!-- Details panel: moveout -->
    <div class="details" id="details-moveout">
      <div class="det-head">
        <div>
          <div class="det-title">Moving out · here's what happens next</div>
          <div class="det-sub">Same as our regular 60-day move-out flow, but since we're already past that threshold, you're all set on timing.</div>
        </div>
      </div>
      <div class="kv-row"><span class="kv-key">Final day</span><span class="kv-val">Dec 31, 2026</span></div>
      <div class="kv-row"><span class="kv-key">Last rent payment</span><span class="kv-val">Dec 1, 2026 · $750</span></div>
      <div class="kv-row"><span class="kv-key">Walkthrough</span><span class="kv-val">Schedule in the next step</span></div>
      <div class="kv-row"><span class="kv-key">Deposit return</span><span class="kv-val">By Feb 4, 2027 (within 35 days)</span></div>

      <div class="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div>If you pick this, we'll redirect you to the full move-out form so you can schedule the walkthrough and set a forwarding address. Takes about 4 minutes.</div>
      </div>
    </div>

    <!-- Why renew (only shown when renewal option selected) -->
    <div class="reasons" id="reasonsBlock">
      <div class="reasons-title">Quick reminders of what you get by staying</div>
      <div class="reason-list">
        <div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>No moving costs, no deposit on a new place</div>
        <div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>All utilities + Wi-Fi stay included</div>
        <div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Your housemates are already here</div>
        <div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Maintenance team already knows the house</div>
      </div>
    </div>

    <!-- Signature (for renewal options) -->
    <div class="sig-block" id="sigBlock">
      <div class="sig-block-head">
        <div class="sig-title">Sign to accept the new lease</div>
        <div class="sig-sub">Type your full legal name. This counts as a legally binding electronic signature under Alabama Code §8-1A-7.</div>
      </div>
      <input class="sig-input" type="text" id="sigName" placeholder="Type your full legal name (e.g. Maya Thompson)">
      <div class="sig-render empty" id="sigRender">Your signature will appear here</div>

      <div class="agree-row" id="agree1" onclick="this.classList.toggle('checked'); updateSubmit();">
        <div class="agree-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div>I agree to the updated lease terms shown above, effective <strong>Jan 1, 2027</strong>. All other terms of my original lease carry over unchanged.</div>
      </div>
    </div>

    <!-- Submit -->
    <div class="submit-bar">
      <div class="save-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Progress auto-saves · you can come back later
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a class="btn btn-ghost" href="portal.html">Not ready yet</a>
        <button class="btn btn-primary" id="submitBtn" disabled onclick="submitRenewal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span id="submitLabel">Sign and renew</span>
        </button>
      </div>
    </div>

  </main>

  <!-- Success -->
  <div class="success-overlay" id="successOverlay">
    <div class="success-card">
      <div class="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 id="successTitle">Renewed! Welcome to year two.</h2>
      <p class="success-sub" id="successSub">Your new lease runs <strong>Jan 1, 2027 – Dec 31, 2027</strong> at <strong>$750/mo</strong>. Executed PDF is on its way to your email. Harrison just got the notification too and said thanks.</p>
      <a class="btn btn-primary" href="portal.html" style="display:inline-flex;">
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>

  <footer class="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Privacy</a> · <a href="#">Terms</a></div>
    <div class="powered-by">Powered by Tenantory</div>
  </footer>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
