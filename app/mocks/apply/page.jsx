"use client";

// Mock ported from ~/Desktop/blackbear/apply.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt);\n      line-height: 1.5; font-size: 14px; min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Same brand tokens as portal.html (Black Bear Rentals) */\n    :root {\n      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;\n      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;\n      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;\n      --border: #e5e1d4; --border-strong: #c9c3b0;\n      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;\n      --red: #b23a3a; --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --radius-sm: 6px; --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); }\n    .tb-help a { color: #fff; font-weight: 600; }\n    .tb-help a:hover { text-decoration: underline; }\n\n    .wrap {\n      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;\n      display: grid; grid-template-columns: 340px 1fr; gap: 32px; align-items: flex-start;\n    }\n\n    /* ===== Unit preview (sticky left) ===== */\n    .unit-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      position: sticky; top: 20px; box-shadow: var(--shadow-sm);\n    }\n    .unit-hero {\n      aspect-ratio: 4 / 3;\n      background:\n        linear-gradient(135deg, rgba(30,111,71,0.7), rgba(199,132,59,0.5)),\n        radial-gradient(ellipse at 30% 70%, var(--brand-bright), transparent 60%),\n        linear-gradient(180deg, #b8a478, #8a7653);\n      position: relative;\n      display: flex; align-items: flex-end; padding: 18px;\n    }\n    .unit-hero-badge {\n      background: rgba(255,255,255,0.92); color: var(--brand-dark);\n      padding: 5px 11px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n    }\n    .unit-body { padding: 20px; }\n    .unit-rent { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }\n    .unit-rent small { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-left: 4px; }\n    .unit-title { font-size: 15px; font-weight: 700; color: var(--text); margin-top: 10px; }\n    .unit-addr { font-size: 13px; color: var(--text-muted); margin-top: 2px; }\n\n    .unit-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }\n    .unit-meta-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }\n    .unit-meta-item svg { width: 15px; height: 15px; color: var(--brand); flex-shrink: 0; }\n    .unit-meta-item strong { color: var(--text); font-weight: 700; }\n\n    .unit-features { display: flex; flex-direction: column; gap: 6px; padding-top: 14px; border-top: 1px solid var(--border); }\n    .unit-feature { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text); }\n    .unit-feature svg { width: 12px; height: 12px; color: var(--green); flex-shrink: 0; }\n\n    .unit-operator {\n      margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border);\n      display: flex; align-items: center; gap: 12px;\n    }\n    .unit-op-avatar {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 13px;\n    }\n    .unit-op-name { font-weight: 700; font-size: 13px; color: var(--text); }\n    .unit-op-role { font-size: 11px; color: var(--text-muted); }\n\n    /* ===== Form side ===== */\n    .form-col { min-width: 0; }\n\n    .form-head { margin-bottom: 20px; }\n    .form-kicker {\n      font-size: 11px; font-weight: 700; color: var(--brand);\n      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;\n    }\n    .form-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .form-head p { color: var(--text-muted); font-size: 14px; max-width: 560px; }\n\n    /* Step progress */\n    .steps-bar {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;\n      margin-bottom: 24px;\n    }\n    .step-pill {\n      padding: 10px 12px; border-radius: var(--radius);\n      background: var(--surface); border: 1px solid var(--border);\n      display: flex; align-items: center; gap: 10px;\n      font-size: 12px; color: var(--text-faint); font-weight: 600;\n      transition: all 0.2s ease;\n    }\n    .step-pill-num {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      flex-shrink: 0;\n    }\n    .step-pill-num svg { width: 11px; height: 11px; }\n    .step-pill.active { border-color: var(--brand); color: var(--brand-dark); background: var(--brand-pale); }\n    .step-pill.active .step-pill-num { background: var(--brand); border-color: var(--brand); color: #fff; }\n    .step-pill.done { border-color: var(--green); color: var(--green-dark); }\n    .step-pill.done .step-pill-num { background: var(--green); border-color: var(--green); color: #fff; }\n\n    /* Form */\n    .form-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 28px;\n      box-shadow: var(--shadow-sm);\n    }\n\n    .step-panel { display: none; }\n    .step-panel.active { display: block; animation: fadeIn 0.25s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n\n    .step-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .step-desc { color: var(--text-muted); font-size: 13px; margin-bottom: 22px; }\n\n    .field { margin-bottom: 16px; }\n    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .field-label-req::after { content: \" *\"; color: var(--red); }\n    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n\n    .input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    textarea.input { resize: vertical; min-height: 100px; line-height: 1.5; }\n    select.input {\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235e6b62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;\n    }\n\n    .input-prefix-wrap {\n      display: flex; align-items: center;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); overflow: hidden; transition: all 0.15s ease;\n    }\n    .input-prefix-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .input-prefix {\n      padding: 0 14px; color: var(--text-muted); font-size: 13px; font-weight: 500;\n      background: var(--surface-subtle); align-self: stretch; display: flex; align-items: center;\n      border-right: 1px solid var(--border);\n    }\n    .input-prefix-wrap input { flex: 1; padding: 11px 14px; border: none; outline: none; background: transparent; }\n\n    /* Upload */\n    .upload {\n      border: 1.5px dashed var(--border-strong); border-radius: var(--radius);\n      padding: 18px; text-align: center; background: var(--surface-subtle);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .upload:hover { border-color: var(--brand); background: var(--brand-pale); }\n    .upload svg { width: 28px; height: 28px; color: var(--text-faint); margin: 0 auto 8px; }\n    .upload-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .upload-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .upload.uploaded { border-style: solid; border-color: var(--green); background: var(--green-bg); }\n    .upload.uploaded svg { color: var(--green); }\n\n    /* Radio group */\n    .radio-group { display: flex; flex-direction: column; gap: 8px; }\n    .radio {\n      display: flex; align-items: flex-start; gap: 12px; padding: 14px;\n      border: 1.5px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .radio:hover { border-color: var(--brand); }\n    .radio.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .radio-dot {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;\n      position: relative; transition: all 0.15s ease;\n    }\n    .radio.selected .radio-dot { border-color: var(--brand); background: var(--brand); }\n    .radio.selected .radio-dot::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n    .radio-body { flex: 1; }\n    .radio-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .radio-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n\n    /* Landlord block */\n    .landlord-block {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px; margin-bottom: 14px;\n    }\n    .landlord-block-head {\n      display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;\n    }\n    .landlord-block-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .block-remove {\n      color: var(--red); font-size: 12px; font-weight: 600;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .block-remove:hover { text-decoration: underline; }\n    .block-remove svg { width: 12px; height: 12px; }\n\n    .link-btn { color: var(--brand); font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }\n    .link-btn:hover { text-decoration: underline; }\n    .link-btn svg { width: 14px; height: 14px; }\n\n    /* Review step */\n    .review-section {\n      padding: 16px; background: var(--surface-subtle); border-radius: var(--radius);\n      margin-bottom: 12px;\n    }\n    .review-section-head {\n      display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;\n    }\n    .review-section-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .review-edit { color: var(--brand); font-size: 12px; font-weight: 600; }\n    .review-edit:hover { text-decoration: underline; }\n    .review-kv { display: grid; grid-template-columns: 140px 1fr; gap: 12px; font-size: 13px; padding: 4px 0; }\n    .review-kv-k { color: var(--text-muted); }\n    .review-kv-v { color: var(--text); font-weight: 500; }\n\n    .fee-box {\n      background: linear-gradient(135deg, var(--brand-dark), var(--brand));\n      color: #fff; padding: 22px; border-radius: var(--radius-lg);\n      margin: 20px 0; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;\n    }\n    .fee-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: rgba(255,255,255,0.7); margin-bottom: 6px; }\n    .fee-amount { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }\n    .fee-note { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 6px; }\n    .fee-shield { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; }\n    .fee-shield svg { width: 24px; height: 24px; color: #fff; }\n\n    .check-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }\n    .check {\n      display: flex; gap: 12px; padding: 14px;\n      border: 1.5px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .check:hover { border-color: var(--brand); }\n    .check.checked { border-color: var(--brand); background: var(--brand-pale); }\n    .check-box {\n      width: 20px; height: 20px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; margin-top: 1px;\n    }\n    .check.checked .check-box { background: var(--brand); border-color: var(--brand); }\n    .check-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .check.checked .check-box svg { opacity: 1; }\n    .check-body { flex: 1; font-size: 13px; color: var(--text); line-height: 1.45; }\n    .check-body strong { font-weight: 700; }\n\n    /* Footer buttons */\n    .form-foot {\n      margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--brand); color: #fff; }\n    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(20,77,49,0.25); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n\n    /* Success screen */\n    .success {\n      padding: 48px 32px; text-align: center;\n    }\n    .success-badge {\n      width: 80px; height: 80px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--brand));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 22px; box-shadow: 0 14px 40px rgba(30,111,71,0.3);\n    }\n    .success-badge svg { width: 40px; height: 40px; }\n    .success h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .success-sub { color: var(--text-muted); font-size: 15px; max-width: 460px; margin: 0 auto 24px; }\n    .success-next {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 18px; margin: 0 auto 24px;\n      max-width: 420px; text-align: left;\n    }\n    .success-next-title { font-weight: 700; font-size: 13px; color: var(--text); margin-bottom: 10px; }\n    .success-next-step { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; font-size: 13px; color: var(--text); }\n    .success-next-step-num {\n      width: 20px; height: 20px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; flex-shrink: 0;\n    }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 1100px; margin: 20px auto 28px; padding: 0 32px;\n      color: var(--text-faint); font-size: 11px;\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;\n    }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n    .legal-foot a:hover { color: var(--brand); }\n\n    /* Toast */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 80; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    @media (max-width: 880px) {\n      .wrap { grid-template-columns: 1fr; }\n      .unit-card { position: static; }\n      .grid-2, .grid-3 { grid-template-columns: 1fr; }\n      .steps-bar { grid-template-columns: repeat(4, 1fr); gap: 4px; }\n      .step-pill { padding: 8px; font-size: 11px; }\n      .step-pill-label { display: none; }\n    }\n  ";

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
        <div className="tb-brand-sub">Rental application</div>
      </div>
    </div>
    <div className="tb-help">
      <a href="listings.html" style={{marginRight: "18px"}}>&larr; All listings</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <main className="wrap">

    
    <aside className="unit-card">
      <div className="unit-hero">
        <span className="unit-hero-badge">Available May 1</span>
      </div>
      <div className="unit-body">
        <div className="unit-rent">$750<small>/mo</small></div>
        <div className="unit-title">Room A · Co-living house</div>
        <div className="unit-addr">908 Lee Dr NW, Huntsville AL 35816</div>

        <div className="unit-meta">
          <div className="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M8 12h8M3 7l2-4h14l2 4" /></svg>
            <span><strong>135 sq ft</strong></span>
          </div>
          <div className="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <span>Lease <strong>12 months</strong></span>
          </div>
          <div className="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span>Deposit <strong>$750</strong></span>
          </div>
          <div className="unit-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" /></svg>
            <span><strong>Pets OK</strong></span>
          </div>
        </div>

        <div className="unit-features">
          <div className="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>All utilities included (gas, water, electric, internet)</div>
          <div className="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Furnished · bed, desk, dresser, nightstand</div>
          <div className="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Shared kitchen, laundry, and living room</div>
          <div className="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Off-street parking for one vehicle</div>
          <div className="unit-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>1.4 miles from UAH campus</div>
        </div>

        <div className="unit-operator">
          <div className="unit-op-avatar">HC</div>
          <div>
            <div className="unit-op-name">Harrison Cooper</div>
            <div className="unit-op-role">Owner · Black Bear Rentals</div>
          </div>
        </div>
      </div>
    </aside>

    
    <section className="form-col">

      <div className="form-head">
        <div className="form-kicker">Takes about 6 minutes · $45 application fee</div>
        <h1>Apply for Room A</h1>
        <p>We review every application personally within 48 hours. You'll hear back by email — approved, denied, or with follow-up questions.</p>
      </div>

      <div className="steps-bar">
        <div className="step-pill active" data-pill="1">
          <div className="step-pill-num">1</div>
          <span className="step-pill-label">About you</span>
        </div>
        <div className="step-pill" data-pill="2">
          <div className="step-pill-num">2</div>
          <span className="step-pill-label">Income</span>
        </div>
        <div className="step-pill" data-pill="3">
          <div className="step-pill-num">3</div>
          <span className="step-pill-label">History</span>
        </div>
        <div className="step-pill" data-pill="4">
          <div className="step-pill-num">4</div>
          <span className="step-pill-label">Review</span>
        </div>
      </div>

      <div className="form-card">

        
        <div className="step-panel active" data-panel="1">
          <h2 className="step-title">About you</h2>
          <p className="step-desc">Legal name and contact info so we can reach you and run a background check.</p>

          <div className="grid-2">
            <div className="field">
              <label className="field-label field-label-req">Legal first name</label>
              <input className="input" type="text" placeholder="Jane" required />
            </div>
            <div className="field">
              <label className="field-label field-label-req">Legal last name</label>
              <input className="input" type="text" placeholder="Doe" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label field-label-req">Email</label>
              <input className="input" type="email" placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label className="field-label field-label-req">Phone</label>
              <input className="input" type="tel" placeholder="(555) 123-4567" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label field-label-req">Date of birth</label>
              <input className="input" type="date" required />
            </div>
            <div className="field">
              <label className="field-label field-label-req">Move-in date</label>
              <input className="input" type="date" value="2026-05-01" required />
            </div>
          </div>

          <div className="field">
            <label className="field-label field-label-req">Current address</label>
            <input className="input" type="text" placeholder="Street, City, State, ZIP" required />
          </div>

          <div className="field">
            <label className="field-label">Government ID</label>
            <div className="upload">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M15 8h2M15 12h4M6 17h12" /></svg>
              <div className="upload-title">Upload a photo of your driver's license or passport</div>
              <div className="upload-sub">Encrypted · only visible to your landlord</div>
            </div>
          </div>
        </div>

        
        <div className="step-panel" data-panel="2">
          <h2 className="step-title">Income &amp; employment</h2>
          <p className="step-desc">We look for income of at least 2.5x the monthly rent ($1,875/mo in this case) through any combination of sources.</p>

          <div className="field">
            <label className="field-label field-label-req">Employment status</label>
            <div className="radio-group" id="employmentGroup">
              <div className="radio selected" data-val="w2">
                <div className="radio-dot" />
                <div className="radio-body">
                  <div className="radio-title">Employed (W-2)</div>
                  <div className="radio-sub">Steady paycheck from a single employer</div>
                </div>
              </div>
              <div className="radio" data-val="1099">
                <div className="radio-dot" />
                <div className="radio-body">
                  <div className="radio-title">Self-employed or 1099</div>
                  <div className="radio-sub">Freelance, contractor, or business owner</div>
                </div>
              </div>
              <div className="radio" data-val="student">
                <div className="radio-dot" />
                <div className="radio-body">
                  <div className="radio-title">Student (with guarantor)</div>
                  <div className="radio-sub">We'll also collect your guarantor's info</div>
                </div>
              </div>
              <div className="radio" data-val="other">
                <div className="radio-dot" />
                <div className="radio-body">
                  <div className="radio-title">Other income</div>
                  <div className="radio-sub">Retirement, disability, trust, housing assistance, etc.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label field-label-req">Employer / business name</label>
            <input className="input" type="text" placeholder="Acme Software LLC" required />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label field-label-req">Job title</label>
              <input className="input" type="text" placeholder="Software engineer" />
            </div>
            <div className="field">
              <label className="field-label field-label-req">Start date</label>
              <input className="input" type="month" />
            </div>
          </div>

          <div className="field">
            <label className="field-label field-label-req">Monthly gross income</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input type="number" placeholder="4000" min="0" step="100" required />
            </div>
            <div className="field-hint">Before taxes. Add up all income sources if you have more than one.</div>
          </div>

          <div className="field">
            <label className="field-label">Proof of income</label>
            <div className="upload">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
              <div className="upload-title">Upload 2 most recent pay stubs, or last year's tax return</div>
              <div className="upload-sub">PDF, JPG, or PNG · up to 5 files</div>
            </div>
          </div>
        </div>

        
        <div className="step-panel" data-panel="3">
          <h2 className="step-title">Rental history</h2>
          <p className="step-desc">Your two most recent landlords. We'll call both — this is the single biggest factor in our decision.</p>

          <div id="landlordList">
            <div className="landlord-block">
              <div className="landlord-block-head">
                <div className="landlord-block-title">Current (or most recent) landlord</div>
              </div>
              <div className="grid-2">
                <div className="field" style={{marginBottom: "10px"}}>
                  <label className="field-label">Landlord name</label>
                  <input className="input" type="text" placeholder="John Smith" />
                </div>
                <div className="field" style={{marginBottom: "10px"}}>
                  <label className="field-label">Phone</label>
                  <input className="input" type="tel" placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="grid-2">
                <div className="field" style={{marginBottom: "10px"}}>
                  <label className="field-label">Address you rented</label>
                  <input className="input" type="text" placeholder="123 Main St, City, ST" />
                </div>
                <div className="field" style={{marginBottom: "10px"}}>
                  <label className="field-label">Monthly rent</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">$</span>
                    <input type="number" placeholder="850" min="0" step="50" />
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div className="field" style={{marginBottom: "0"}}>
                  <label className="field-label">Moved in</label>
                  <input className="input" type="month" />
                </div>
                <div className="field" style={{marginBottom: "0"}}>
                  <label className="field-label">Moved out (or "present")</label>
                  <input className="input" type="text" placeholder="Present" />
                </div>
              </div>
            </div>
          </div>

          <button className="link-btn" style={{marginBottom: "22px"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add a second landlord
          </button>

          <div className="field">
            <label className="field-label">Have you ever been evicted?</label>
            <div className="radio-group" id="evictedGroup" style={{flexDirection: "row"}}>
              <div className="radio selected" data-val="no" style={{flex: "1"}}>
                <div className="radio-dot" />
                <div className="radio-body"><div className="radio-title">No</div></div>
              </div>
              <div className="radio" data-val="yes" style={{flex: "1"}}>
                <div className="radio-dot" />
                <div className="radio-body"><div className="radio-title">Yes · I'll explain</div></div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Pets</label>
            <input className="input" type="text" placeholder="e.g. one 15 lb dog, spayed · or " No="" pets="" />
            <div className="field-hint">Black Bear Rentals welcomes pets. $250 pet deposit per animal.</div>
          </div>

          <div className="field">
            <label className="field-label">Anything we should know?</label>
            <textarea className="input" placeholder="Tell us about yourself — why this place, anything unusual, references beyond landlords, etc. This often matters more than the numbers." />
          </div>
        </div>

        
        <div className="step-panel" data-panel="4">
          <h2 className="step-title">Review &amp; submit</h2>
          <p className="step-desc">Double-check your answers, authorize the background check, and pay the $45 application fee.</p>

          <div className="review-section">
            <div className="review-section-head">
              <div className="review-section-title">About you</div>
              <button className="review-edit">Edit</button>
            </div>
            <div className="review-kv"><span className="review-kv-k">Name</span><span className="review-kv-v">Jane Doe</span></div>
            <div className="review-kv"><span className="review-kv-k">Email</span><span className="review-kv-v">jane.doe@example.com</span></div>
            <div className="review-kv"><span className="review-kv-k">Phone</span><span className="review-kv-v">(555) 123-4567</span></div>
            <div className="review-kv"><span className="review-kv-k">Move-in</span><span className="review-kv-v">May 1, 2026</span></div>
          </div>
          <div className="review-section">
            <div className="review-section-head">
              <div className="review-section-title">Income</div>
              <button className="review-edit">Edit</button>
            </div>
            <div className="review-kv"><span className="review-kv-k">Status</span><span className="review-kv-v">Employed (W-2)</span></div>
            <div className="review-kv"><span className="review-kv-k">Employer</span><span className="review-kv-v">Acme Software LLC</span></div>
            <div className="review-kv"><span className="review-kv-k">Monthly gross</span><span className="review-kv-v">$4,000 · <span style={{color: "var(--green-dark)", fontWeight: "700"}}>5.3x rent</span></span></div>
          </div>
          <div className="review-section">
            <div className="review-section-head">
              <div className="review-section-title">Rental history</div>
              <button className="review-edit">Edit</button>
            </div>
            <div className="review-kv"><span className="review-kv-k">Landlords</span><span className="review-kv-v">1 landlord added</span></div>
            <div className="review-kv"><span className="review-kv-k">Evictions</span><span className="review-kv-v">None</span></div>
          </div>

          <div className="fee-box">
            <div>
              <div className="fee-label">Application fee</div>
              <div className="fee-amount">$45.00</div>
              <div className="fee-note">Non-refundable · covers background check + credit report</div>
            </div>
            <div className="fee-shield">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
          </div>

          <div className="check-group">
            <div className="check" data-check="bg">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">I authorize <strong>Black Bear Rentals</strong> to run a credit check, background check, and contact my listed landlords and employer to verify this application.</div>
            </div>
            <div className="check" data-check="truth">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">Everything I've entered is <strong>true and accurate</strong> to the best of my knowledge. Knowingly providing false information is grounds for denial.</div>
            </div>
            <div className="check" data-check="terms">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">I understand the <strong>$45 application fee is non-refundable</strong>, even if my application is denied, and agree to Black Bear Rentals' <a href="#" style={{color: "var(--brand)", textDecoration: "underline"}}>rental policies</a>.</div>
            </div>
          </div>
        </div>

        
        <div className="step-panel" data-panel="done">
          <div className="success">
            <div className="success-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2>Application submitted</h2>
            <p className="success-sub">Thanks, Jane. Harrison was just notified — he personally reviews every application within 48 hours, often sooner. A receipt for your $45 fee is on its way to your email.</p>
            <div className="success-next">
              <div className="success-next-title">What happens next</div>
              <div className="success-next-step"><div className="success-next-step-num">1</div><div>We run your credit and background checks (automated · takes ~10 minutes)</div></div>
              <div className="success-next-step"><div className="success-next-step-num">2</div><div>Harrison calls your current landlord and employer to verify</div></div>
              <div className="success-next-step"><div className="success-next-step-num">3</div><div>You'll get an email within 48 hours — approved, declined, or with follow-up questions</div></div>
              <div className="success-next-step"><div className="success-next-step-num">4</div><div>If approved, you'll get a link to <a href="sign.html" style={{color: "var(--brand)", fontWeight: "600", textDecoration: "underline"}}>e-sign your lease</a> and pay your deposit</div></div>
            </div>
            <div style={{display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
              <a className="btn btn-primary" href="sign.html">
                Preview the signing flow
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
              <a className="btn btn-ghost" href="mailto:hello@rentblackbear.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
                Email Harrison with a question
              </a>
            </div>
          </div>
        </div>

        
        <div className="form-foot" id="formFoot">
          <button className="btn btn-ghost" id="backBtn" disabled style={{opacity: "0.5", pointerEvents: "none"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <button className="btn btn-primary" id="nextBtn">
            <span id="nextLabel">Continue</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>

      </div>

    </section>
  </main>

  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Fair Housing</a> · <a href="#">Privacy</a></div>
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
