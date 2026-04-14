"use client";

// Mock ported from ~/Desktop/tenantory/renew.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Black Bear tokens (matches portal/apply/sign/moveout) */\n    :root {\n      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;\n      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;\n      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;\n      --border: #e5e1d4; --border-strong: #c9c3b0;\n      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;\n      --red: #b23a3a; --amber: #c7843b;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); }\n    .tb-help a { color: #fff; font-weight: 600; }\n    .tb-help a:hover { text-decoration: underline; }\n\n    .wrap { max-width: 900px; margin: 0 auto; padding: 32px 32px 60px; }\n\n    /* Status banner */\n    .banner {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius-lg); padding: 18px 22px;\n      display: flex; gap: 14px; align-items: center; margin-bottom: 24px;\n    }\n    .banner-icon {\n      width: 40px; height: 40px; border-radius: 50%;\n      background: var(--brand); color: #fff; flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .banner-icon svg { width: 18px; height: 18px; }\n    .banner-text { font-size: 13.5px; color: var(--text); line-height: 1.55; }\n    .banner-text strong { color: var(--brand-dark); font-weight: 700; }\n\n    .page-head { margin-bottom: 24px; }\n    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 640px; }\n\n    /* Choice cards */\n    .choices { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }\n    .choice {\n      background: var(--surface); border: 2px solid var(--border);\n      border-radius: var(--radius-xl); padding: 22px 26px;\n      cursor: pointer; transition: all 0.15s ease;\n      display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: center;\n    }\n    .choice:hover { border-color: var(--brand-soft); box-shadow: var(--shadow-sm); transform: translateY(-1px); }\n    .choice.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .choice.recommended { position: relative; }\n    .choice.recommended::after {\n      content: \"Recommended\"; position: absolute; top: -10px; right: 20px;\n      background: var(--brand); color: #fff; padding: 3px 10px; border-radius: 100px;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;\n    }\n    .choice-radio {\n      width: 22px; height: 22px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      position: relative; transition: all 0.15s ease;\n    }\n    .choice.selected .choice-radio { border-color: var(--brand); background: var(--brand); }\n    .choice.selected .choice-radio::after {\n      content: \"\"; position: absolute; inset: 4px; border-radius: 50%; background: #fff;\n    }\n    .choice-body { min-width: 0; }\n    .choice-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); margin-bottom: 4px; }\n    .choice-sub { font-size: 13px; color: var(--text-muted); line-height: 1.55; margin-bottom: 8px; }\n    .choice-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); }\n    .choice-meta-item { display: inline-flex; align-items: center; gap: 5px; }\n    .choice-meta-item svg { width: 12px; height: 12px; color: var(--brand); }\n    .choice-meta-item strong { color: var(--text); font-weight: 700; }\n    .choice-price { text-align: right; flex-shrink: 0; }\n    .choice-price-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }\n    .choice-price-val { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; margin-top: 4px; }\n    .choice-price-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }\n    .choice-price-delta { font-size: 11px; font-weight: 700; color: var(--amber); margin-top: 2px; }\n    .choice-price-delta.flat { color: var(--green-dark); }\n    .choice-price-delta.up { color: var(--amber); }\n\n    /* Details panel (conditional) */\n    .details {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px; margin-bottom: 20px;\n      box-shadow: var(--shadow-sm); display: none;\n    }\n    .details.show { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n    .det-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }\n    .det-title { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }\n    .det-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }\n\n    .kv-row {\n      display: grid; grid-template-columns: 1fr auto; gap: 14px;\n      padding: 12px 0; border-bottom: 1px solid var(--border);\n      font-size: 14px;\n    }\n    .kv-row:last-of-type { border-bottom: none; }\n    .kv-key { color: var(--text-muted); }\n    .kv-val { color: var(--text); font-weight: 700; text-align: right; }\n    .kv-val.highlight { color: var(--brand-dark); }\n    .kv-val .old { color: var(--text-faint); text-decoration: line-through; font-weight: 500; margin-right: 6px; font-size: 13px; }\n\n    .callout {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius); padding: 14px 16px; margin-top: 16px;\n      font-size: 13px; color: var(--brand-dark); line-height: 1.55;\n      display: flex; gap: 10px;\n    }\n    .callout svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--brand-dark); }\n\n    /* Why renew section */\n    .reasons {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      margin-bottom: 20px;\n    }\n    .reasons-title { font-size: 14px; font-weight: 800; margin-bottom: 14px; }\n    .reason-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n    .reason-item {\n      display: flex; gap: 10px; align-items: flex-start;\n      font-size: 13px; color: var(--text); line-height: 1.5;\n    }\n    .reason-item svg { width: 14px; height: 14px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }\n\n    /* Signature / agree */\n    .sig-block {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      margin-bottom: 16px;\n    }\n    .sig-block-head { margin-bottom: 14px; }\n    .sig-title { font-size: 15px; font-weight: 800; margin-bottom: 3px; }\n    .sig-sub { font-size: 12.5px; color: var(--text-muted); }\n    .sig-input {\n      width: 100%; padding: 12px 14px; background: var(--surface-subtle);\n      border: 1.5px solid var(--border); border-radius: var(--radius);\n      font-size: 14px; color: var(--text); outline: none; transition: all 0.15s ease;\n      margin-bottom: 10px;\n    }\n    .sig-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .sig-render {\n      padding: 16px 14px; border-radius: var(--radius);\n      background: var(--surface-subtle); border: 1.5px dashed var(--border-strong);\n      min-height: 62px; display: flex; align-items: center;\n      font-family: 'Inter', cursive; font-size: 30px; font-weight: 500;\n      font-style: italic; color: var(--brand-dark); letter-spacing: -0.01em;\n    }\n    .sig-render.empty { color: var(--text-faint); font-size: 14px; font-style: italic; font-weight: 400; }\n    .sig-render.signed { border-style: solid; border-color: var(--brand); background: var(--brand-pale); }\n\n    .agree-row {\n      display: flex; gap: 12px; padding: 10px 0;\n      font-size: 13px; color: var(--text); line-height: 1.5; cursor: pointer;\n    }\n    .agree-row strong { font-weight: 700; }\n    .agree-box {\n      width: 20px; height: 20px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .agree-row.checked .agree-box { background: var(--brand); border-color: var(--brand); }\n    .agree-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .agree-row.checked .agree-box svg { opacity: 1; }\n\n    /* Submit bar */\n    .submit-bar {\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 12px; flex-wrap: wrap; margin-top: 18px;\n    }\n    .save-note { font-size: 12px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px; }\n    .save-note svg { width: 13px; height: 13px; color: var(--green-dark); }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }\n    .btn-primary:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n\n    /* Success overlay */\n    .success-overlay {\n      position: fixed; inset: 0; background: rgba(20,77,49,0.6);\n      display: none; align-items: center; justify-content: center; z-index: 80;\n      padding: 20px;\n    }\n    .success-overlay.show { display: flex; }\n    .success-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 44px 34px; max-width: 500px; width: 100%;\n      box-shadow: var(--shadow-lg); text-align: center;\n      animation: pop 0.4s cubic-bezier(.2,.9,.3,1);\n    }\n    @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: none; } }\n    .success-badge {\n      width: 76px; height: 76px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--brand));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 20px; box-shadow: 0 14px 40px rgba(30,111,71,0.35);\n    }\n    .success-badge svg { width: 38px; height: 38px; }\n    .success-card h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .success-sub { color: var(--text-muted); font-size: 14.5px; margin-bottom: 22px; line-height: 1.6; }\n    .success-sub strong { color: var(--text); font-weight: 700; }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 900px; margin: 0 auto; padding: 24px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;\n      color: var(--text-faint); font-size: 11px;\n    }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    @media (max-width: 700px) {\n      .wrap { padding: 20px 16px; }\n      .choice { grid-template-columns: auto 1fr; padding: 18px; }\n      .choice-price { grid-column: 1 / -1; text-align: left; padding-top: 12px; border-top: 1px solid var(--border); }\n      .reason-list { grid-template-columns: 1fr; }\n    }\n  ";

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
        <div className="tb-brand-sub">Lease renewal</div>
      </div>
    </div>
    <div className="tb-help">
      <a href="portal.html" style={{marginRight: "18px"}}>&larr; Back to portal</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <main className="wrap">

    <div className="banner">
      <div className="banner-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
      </div>
      <div className="banner-text">
        Your lease for <strong>Room C · 908 Lee Drive</strong> ends <strong>Dec 31, 2026</strong> — that's 78 days from now. Pick one of the three options below. Harrison would love to have you stay, but zero pressure.
      </div>
    </div>

    <div className="page-head">
      <div className="page-kicker">Room C · 908 Lee Drive</div>
      <h1>Let's figure out what's next.</h1>
      <p>You've been at Black Bear for almost a year. Great housemate, always paid on time. Here are your three options — pick one, and Harrison will take it from there.</p>
    </div>

    
    <div className="choices" id="choices">

      <label className="choice recommended selected" data-choice="12mo">
        <div className="choice-radio" />
        <div className="choice-body">
          <div className="choice-title">Renew for 12 more months</div>
          <div className="choice-sub">Same room, same housemates. Rent stays flat — no increase this year.</div>
          <div className="choice-meta">
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Jan 1, 2027 – Dec 31, 2027</span>
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Same rent</span>
          </div>
        </div>
        <div className="choice-price">
          <div className="choice-price-label">Monthly</div>
          <div className="choice-price-val">$750</div>
          <div className="choice-price-delta flat">No change</div>
        </div>
      </label>

      <label className="choice" data-choice="mtm">
        <div className="choice-radio" />
        <div className="choice-body">
          <div className="choice-title">Month-to-month</div>
          <div className="choice-sub">Flexibility to leave anytime with 30 days notice. Slight rent bump to cover the turnover risk.</div>
          <div className="choice-meta">
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Month-to-month</span>
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>30-day notice</span>
          </div>
        </div>
        <div className="choice-price">
          <div className="choice-price-label">Monthly</div>
          <div className="choice-price-val">$800</div>
          <div className="choice-price-delta up">+$50/mo</div>
        </div>
      </label>

      <label className="choice" data-choice="moveout">
        <div className="choice-radio" />
        <div className="choice-body">
          <div className="choice-title">I'm moving out Dec 31</div>
          <div className="choice-sub">No hard feelings. We'll get your deposit back within 35 days of move-out and send references to your next landlord.</div>
          <div className="choice-meta">
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Ends Dec 31, 2026</span>
            <span className="choice-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>$750 deposit returned</span>
          </div>
        </div>
        <div className="choice-price">
          <div className="choice-price-label">Move-out</div>
          <div className="choice-price-val">Dec 31</div>
          <div className="choice-price-sub">Full checklist + walkthrough</div>
        </div>
      </label>

    </div>

    
    <div className="details show" id="details-12mo">
      <div className="det-head">
        <div>
          <div className="det-title">Your new lease terms</div>
          <div className="det-sub">Starts Jan 1, 2027. Everything else stays the same as your current lease.</div>
        </div>
      </div>
      <div className="kv-row"><span className="kv-key">Lease term</span><span className="kv-val">Jan 1, 2027 – Dec 31, 2027 · 12 months</span></div>
      <div className="kv-row"><span className="kv-key">Monthly rent</span><span className="kv-val highlight"><span className="old">$750</span>$750 · no change</span></div>
      <div className="kv-row"><span className="kv-key">Due date</span><span className="kv-val">1st of the month</span></div>
      <div className="kv-row"><span className="kv-key">Deposit</span><span className="kv-val">$750 held (no change)</span></div>
      <div className="kv-row"><span className="kv-key">Utilities</span><span className="kv-val">All still included</span></div>
      <div className="kv-row"><span className="kv-key">Pet policy</span><span className="kv-val">Same — let Harrison know if that changes</span></div>

      <div className="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <div>Rent could have gone up — Huntsville comps for this size room are running $780–$840 right now. Holding flat is a thank-you for being easy to work with. We appreciate you.</div>
      </div>
    </div>

    
    <div className="details" id="details-mtm">
      <div className="det-head">
        <div>
          <div className="det-title">Month-to-month terms</div>
          <div className="det-sub">Maximum flexibility. Either side can end it with 30 days written notice.</div>
        </div>
      </div>
      <div className="kv-row"><span className="kv-key">Start date</span><span className="kv-val">Jan 1, 2027</span></div>
      <div className="kv-row"><span className="kv-key">End date</span><span className="kv-val">Rolling · no fixed end</span></div>
      <div className="kv-row"><span className="kv-key">Monthly rent</span><span className="kv-val highlight"><span className="old">$750</span>$800 · +$50/mo</span></div>
      <div className="kv-row"><span className="kv-key">Notice to end</span><span className="kv-val">30 days written (either side)</span></div>
      <div className="kv-row"><span className="kv-key">Deposit</span><span className="kv-val">$750 held (no change)</span></div>

      <div className="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <div>The +$50/mo covers the higher turnover risk — month-to-month rooms stay vacant longer between tenants, and a filled room is worth more than an empty one. Totally fair, zero pressure either direction.</div>
      </div>
    </div>

    
    <div className="details" id="details-moveout">
      <div className="det-head">
        <div>
          <div className="det-title">Moving out · here's what happens next</div>
          <div className="det-sub">Same as our regular 60-day move-out flow, but since we're already past that threshold, you're all set on timing.</div>
        </div>
      </div>
      <div className="kv-row"><span className="kv-key">Final day</span><span className="kv-val">Dec 31, 2026</span></div>
      <div className="kv-row"><span className="kv-key">Last rent payment</span><span className="kv-val">Dec 1, 2026 · $750</span></div>
      <div className="kv-row"><span className="kv-key">Walkthrough</span><span className="kv-val">Schedule in the next step</span></div>
      <div className="kv-row"><span className="kv-key">Deposit return</span><span className="kv-val">By Feb 4, 2027 (within 35 days)</span></div>

      <div className="callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        <div>If you pick this, we'll redirect you to the full move-out form so you can schedule the walkthrough and set a forwarding address. Takes about 4 minutes.</div>
      </div>
    </div>

    
    <div className="reasons" id="reasonsBlock">
      <div className="reasons-title">Quick reminders of what you get by staying</div>
      <div className="reason-list">
        <div className="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>No moving costs, no deposit on a new place</div>
        <div className="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>All utilities + Wi-Fi stay included</div>
        <div className="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Your housemates are already here</div>
        <div className="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Maintenance team already knows the house</div>
      </div>
    </div>

    
    <div className="sig-block" id="sigBlock">
      <div className="sig-block-head">
        <div className="sig-title">Sign to accept the new lease</div>
        <div className="sig-sub">Type your full legal name. This counts as a legally binding electronic signature under Alabama Code §8-1A-7.</div>
      </div>
      <input className="sig-input" type="text" id="sigName" placeholder="Type your full legal name (e.g. Maya Thompson)" />
      <div className="sig-render empty" id="sigRender">Your signature will appear here</div>

      <div className="agree-row" id="agree1">
        <div className="agree-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
        <div>I agree to the updated lease terms shown above, effective <strong>Jan 1, 2027</strong>. All other terms of my original lease carry over unchanged.</div>
      </div>
    </div>

    
    <div className="submit-bar">
      <div className="save-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        Progress auto-saves · you can come back later
      </div>
      <div style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
        <a className="btn btn-ghost" href="portal.html">Not ready yet</a>
        <button className="btn btn-primary" id="submitBtn" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span id="submitLabel">Sign and renew</span>
        </button>
      </div>
    </div>

  </main>

  
  <div className="success-overlay" id="successOverlay">
    <div className="success-card">
      <div className="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2 id="successTitle">Renewed! Welcome to year two.</h2>
      <p className="success-sub" id="successSub">Your new lease runs <strong>Jan 1, 2027 – Dec 31, 2027</strong> at <strong>$750/mo</strong>. Executed PDF is on its way to your email. Harrison just got the notification too and said thanks.</p>
      <a className="btn btn-primary" href="portal.html" style={{display: "inline-flex"}}>
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  </div>

  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Privacy</a> · <a href="#">Terms</a></div>
    <div className="powered-by">Powered by Tenantory</div>
  </footer>

  

    </>
  );
}
