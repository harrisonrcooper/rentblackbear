"use client";

// Mock ported from ~/Desktop/tenantory/sign.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Black Bear brand tokens (same as portal/apply/listings) */\n    :root {\n      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;\n      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;\n      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;\n      --border: #e5e1d4; --border-strong: #c9c3b0;\n      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;\n      --red: #b23a3a; --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b; --amber-bg: rgba(199,132,59,0.12);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); }\n    .tb-help a { color: #fff; font-weight: 600; }\n    .tb-help a:hover { text-decoration: underline; }\n\n    /* Status banner */\n    .status-banner {\n      background: linear-gradient(135deg, var(--brand-pale) 0%, var(--surface-alt) 100%);\n      border-bottom: 1px solid var(--brand-soft);\n      padding: 18px 32px;\n      display: flex; align-items: center; gap: 14px;\n      max-width: 1180px; margin: 0 auto;\n    }\n    .status-icon {\n      width: 38px; height: 38px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .status-icon svg { width: 18px; height: 18px; }\n    .status-title { font-weight: 700; font-size: 14px; color: var(--text); }\n    .status-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }\n    .status-sub strong { color: var(--text); font-weight: 700; }\n\n    /* Layout */\n    .wrap {\n      max-width: 1180px; margin: 0 auto; padding: 28px 32px 60px;\n      display: grid; grid-template-columns: 360px 1fr; gap: 28px; align-items: flex-start;\n    }\n\n    /* ===== Left: lease summary (sticky) ===== */\n    .summary {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 24px;\n      box-shadow: var(--shadow-sm);\n      position: sticky; top: 20px;\n    }\n    .summary-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }\n    .summary-title { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .summary-addr { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }\n\n    .term-row {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      padding: 12px 0; border-bottom: 1px solid var(--border);\n      font-size: 13px;\n    }\n    .term-row:last-child { border-bottom: none; }\n    .term-key { color: var(--text-muted); flex: 0 0 auto; }\n    .term-val { color: var(--text); font-weight: 700; text-align: right; max-width: 60%; }\n\n    .totals {\n      margin-top: 16px; padding: 16px;\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius);\n    }\n    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: var(--text); }\n    .totals-row.big {\n      font-size: 18px; font-weight: 800; color: var(--brand-dark);\n      padding-top: 12px; margin-top: 8px;\n      border-top: 1px solid var(--brand-soft);\n    }\n\n    .signers {\n      margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--border);\n    }\n    .signers-title { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }\n    .signer-row {\n      display: flex; align-items: center; gap: 12px; padding: 8px 0;\n      font-size: 13px;\n    }\n    .signer-avatar {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 11px; flex-shrink: 0;\n    }\n    .signer-info { flex: 1; min-width: 0; }\n    .signer-name { font-weight: 600; color: var(--text); }\n    .signer-role { font-size: 11px; color: var(--text-muted); }\n    .signer-state { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 100px; }\n    .signer-state.signed { background: var(--green-bg); color: var(--green-dark); }\n    .signer-state.waiting { background: var(--amber-bg); color: var(--amber); }\n    .signer-state.you { background: var(--brand); color: #fff; }\n    .signer-state svg { width: 10px; height: 10px; vertical-align: -1px; margin-right: 3px; }\n\n    /* ===== Right: document + sign + pay ===== */\n    .main-col { min-width: 0; }\n\n    .panel {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); margin-bottom: 18px;\n      box-shadow: var(--shadow-sm);\n      overflow: hidden;\n    }\n    .panel-head {\n      padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;\n      border-bottom: 1px solid var(--border);\n    }\n    .panel-num {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 13px; font-weight: 700; flex-shrink: 0;\n    }\n    .panel-num svg { width: 14px; height: 14px; }\n    .panel-num.done { background: var(--green); }\n    .panel-title { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; flex: 1; padding-left: 14px; }\n    .panel-state { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; }\n    .panel-state.review { background: var(--accent-bg); color: var(--accent); }\n    .panel-state.todo { background: var(--surface-subtle); color: var(--text-muted); }\n    .panel-state.done { background: var(--green-bg); color: var(--green-dark); }\n\n    .panel-body { padding: 22px 24px; }\n\n    /* Document preview (accordions) */\n    .doc-section {\n      border-bottom: 1px solid var(--border);\n    }\n    .doc-section:last-child { border-bottom: none; }\n    .doc-section-head {\n      padding: 16px 0; display: flex; align-items: center; gap: 14px;\n      cursor: pointer; user-select: none;\n    }\n    .doc-section-num {\n      width: 24px; height: 24px; border-radius: 6px;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 700; flex-shrink: 0;\n      font-variant-numeric: tabular-nums;\n    }\n    .doc-section-title { flex: 1; font-weight: 700; font-size: 14px; color: var(--text); }\n    .doc-section-meta { font-size: 12px; color: var(--text-muted); }\n    .doc-section-chev { width: 16px; height: 16px; color: var(--text-muted); transition: transform 0.2s ease; }\n    .doc-section.open .doc-section-chev { transform: rotate(180deg); }\n    .doc-section.open .doc-section-num { background: var(--brand-pale); color: var(--brand-dark); }\n    .doc-section-body {\n      max-height: 0; overflow: hidden; transition: max-height 0.3s ease;\n    }\n    .doc-section.open .doc-section-body { max-height: 600px; padding-bottom: 16px; }\n    .doc-section-body p { font-size: 13.5px; color: var(--text); line-height: 1.7; margin-bottom: 10px; }\n    .doc-section-body p:last-child { margin-bottom: 0; }\n    .doc-highlight {\n      background: linear-gradient(transparent 65%, var(--accent-bg) 65%);\n      padding: 0 2px; font-weight: 600;\n    }\n    .doc-key {\n      background: var(--brand-pale); border-left: 3px solid var(--brand);\n      padding: 10px 14px; border-radius: 0 8px 8px 0;\n      font-size: 12.5px; color: var(--brand-dark); margin-top: 8px;\n      display: flex; gap: 8px;\n    }\n    .doc-key svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }\n\n    .doc-foot {\n      padding: 16px 24px; background: var(--surface-subtle);\n      display: flex; justify-content: space-between; align-items: center;\n      border-top: 1px solid var(--border);\n      font-size: 12.5px; color: var(--text-muted);\n    }\n    .doc-foot a { color: var(--brand); font-weight: 600; }\n    .doc-foot a:hover { text-decoration: underline; }\n    .doc-foot svg { width: 13px; height: 13px; vertical-align: -2px; margin-right: 4px; }\n\n    /* Signature block */\n    .sig-row {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;\n      margin-bottom: 16px;\n    }\n    .field { display: flex; flex-direction: column; }\n    .field-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .input {\n      padding: 11px 14px; background: var(--surface);\n      border: 1px solid var(--border); border-radius: var(--radius);\n      font-size: 14px; color: var(--text); outline: none;\n      transition: all 0.15s ease;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n\n    .sig-pad-wrap {\n      background: var(--surface-subtle); border: 2px dashed var(--border-strong);\n      border-radius: var(--radius); padding: 18px;\n      margin-bottom: 12px;\n      transition: all 0.15s ease;\n    }\n    .sig-pad-wrap.signed { border-style: solid; border-color: var(--brand); background: var(--brand-pale); }\n    .sig-render {\n      font-family: 'Caveat', cursive; font-size: 38px;\n      color: #14204a; min-height: 60px;\n      display: flex; align-items: center; padding: 4px 10px;\n      letter-spacing: 0.02em;\n    }\n    .sig-render-empty { color: var(--text-faint); font-style: italic; font-family: 'Inter', sans-serif; font-size: 14px; }\n    .sig-render-line { border-top: 1px solid var(--border-strong); margin-top: 4px; padding-top: 6px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; }\n    .sig-typed-input {\n      width: 100%; padding: 10px 12px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text); outline: none;\n    }\n    .sig-typed-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n\n    /* Payment block */\n    .pay-row {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;\n      margin-bottom: 16px;\n    }\n    .breakdown {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px; margin-bottom: 16px;\n    }\n    .breakdown-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }\n    .breakdown-row.total {\n      border-top: 1px solid var(--border); margin-top: 6px; padding-top: 12px;\n      font-size: 16px; font-weight: 800; color: var(--text);\n    }\n    .breakdown-row .strike { color: var(--text-faint); text-decoration: line-through; margin-right: 4px; }\n    .breakdown-row .free { color: var(--green-dark); font-weight: 700; }\n\n    .method-pick {\n      display: flex; align-items: center; gap: 14px; padding: 14px;\n      border: 2px solid var(--border); border-radius: var(--radius);\n      margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease;\n    }\n    .method-pick:hover { border-color: var(--brand); }\n    .method-pick.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .method-pick-radio {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      position: relative; transition: all 0.15s ease;\n    }\n    .method-pick.selected .method-pick-radio { border-color: var(--brand); background: var(--brand); }\n    .method-pick.selected .method-pick-radio::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n    .method-icon {\n      width: 40px; height: 28px; border-radius: 5px;\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-size: 10px; font-weight: 800; letter-spacing: 0.04em;\n    }\n    .method-icon.bank { background: linear-gradient(135deg, var(--brand), var(--brand-bright)); }\n    .method-icon.card { background: linear-gradient(135deg, #1a1f36, #3a4160); }\n    .method-label { font-weight: 600; font-size: 13px; color: var(--text); }\n    .method-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    /* Final agree */\n    .agree-block {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px;\n    }\n    .agree-row {\n      display: flex; gap: 12px; padding: 8px 0; font-size: 13px; color: var(--text); cursor: pointer; line-height: 1.5;\n    }\n    .agree-row strong { font-weight: 700; }\n    .agree-box {\n      width: 20px; height: 20px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .agree-row.checked .agree-box { background: var(--brand); border-color: var(--brand); }\n    .agree-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .agree-row.checked .agree-box svg { opacity: 1; }\n\n    /* Submit */\n    .submit-bar {\n      margin-top: 20px;\n      display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;\n    }\n    .save-note { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }\n    .save-note svg { width: 13px; height: 13px; color: var(--green-dark); }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 100px; font-weight: 700; font-size: 15px; transition: all 0.15s ease; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.25); }\n    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.35); }\n    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; box-shadow: none; }\n\n    /* Success screen */\n    .success-overlay {\n      position: fixed; inset: 0; background: rgba(20,77,49,0.6);\n      display: none; align-items: center; justify-content: center; z-index: 80;\n      padding: 20px;\n    }\n    .success-overlay.show { display: flex; }\n    .success-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 48px 36px; max-width: 560px; width: 100%;\n      box-shadow: var(--shadow-lg); text-align: center;\n      animation: pop 0.4s cubic-bezier(.2,.9,.3,1);\n    }\n    @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: none; } }\n    .success-badge {\n      width: 80px; height: 80px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--brand));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 22px;\n      box-shadow: 0 14px 40px rgba(30,111,71,0.35);\n    }\n    .success-badge svg { width: 40px; height: 40px; }\n    .success-card h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .success-sub { color: var(--text-muted); font-size: 14.5px; margin-bottom: 24px; line-height: 1.6; }\n    .success-sub strong { color: var(--text); font-weight: 700; }\n    .timeline {\n      text-align: left; background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 18px; margin-bottom: 24px;\n    }\n    .timeline-row {\n      display: flex; gap: 12px; padding: 8px 0; font-size: 13px;\n      align-items: flex-start;\n    }\n    .timeline-icon {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      font-size: 11px; font-weight: 700;\n    }\n    .timeline-icon svg { width: 12px; height: 12px; }\n    .timeline-icon.upcoming { background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); }\n    .timeline-text { color: var(--text); }\n    .timeline-text.muted { color: var(--text-muted); }\n    .timeline-text strong { font-weight: 700; }\n\n    /* Toast */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500;\n      box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 1180px; margin: 0 auto; padding: 24px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;\n      color: var(--text-faint); font-size: 11px;\n    }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n    .legal-foot a:hover { color: var(--brand); }\n\n    @media (max-width: 920px) {\n      .wrap { grid-template-columns: 1fr; }\n      .summary { position: static; }\n      .sig-row, .pay-row { grid-template-columns: 1fr; }\n      .status-banner { padding: 14px 16px; }\n    }\n  ";

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
        <div className="tb-brand-sub">Lease signing</div>
      </div>
    </div>
    <div className="tb-help">
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  
  <div className="status-banner">
    <div className="status-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </div>
    <div>
      <div className="status-title">You're approved, Jane.</div>
      <div className="status-sub">Harrison reviewed your application and approved it on <strong>Apr 16, 2026</strong>. Sign your lease and pay the move-in total below to lock in <strong>Room A · 908 Lee Drive · May 1</strong>.</div>
    </div>
  </div>

  <main className="wrap">

    
    <aside className="summary">
      <div className="summary-eyebrow">Lease summary</div>
      <div className="summary-title">Room A · 908 Lee Drive</div>
      <div className="summary-addr">Co-living house · Huntsville, AL 35816</div>

      <div className="term-row"><span className="term-key">Tenant</span><span className="term-val">Jane Doe</span></div>
      <div className="term-row"><span className="term-key">Term</span><span className="term-val">12 months</span></div>
      <div className="term-row"><span className="term-key">Start date</span><span className="term-val">May 1, 2026</span></div>
      <div className="term-row"><span className="term-key">End date</span><span className="term-val">Apr 30, 2027</span></div>
      <div className="term-row"><span className="term-key">Monthly rent</span><span className="term-val">$750.00</span></div>
      <div className="term-row"><span className="term-key">Due</span><span className="term-val">1st of month</span></div>
      <div className="term-row"><span className="term-key">Late fee</span><span className="term-val">$25 after the 5th</span></div>
      <div className="term-row"><span className="term-key">Security deposit</span><span className="term-val">$750.00</span></div>
      <div className="term-row"><span className="term-key">Pet deposit</span><span className="term-val">None</span></div>
      <div className="term-row"><span className="term-key">Utilities</span><span className="term-val">All included</span></div>

      <div className="totals">
        <div className="totals-row"><span>First month's rent</span><span>$750.00</span></div>
        <div className="totals-row"><span>Security deposit</span><span>$750.00</span></div>
        <div className="totals-row"><span>Admin fee</span><span style={{color: "var(--green-dark)", fontWeight: "700"}}>$0.00</span></div>
        <div className="totals-row big"><span>Total due today</span><span>$1,500.00</span></div>
      </div>

      <div className="signers">
        <div className="signers-title">Signers</div>
        <div className="signer-row">
          <div className="signer-avatar">HC</div>
          <div className="signer-info">
            <div className="signer-name">Harrison Cooper</div>
            <div className="signer-role">Owner · Black Bear Rentals</div>
          </div>
          <span className="signer-state signed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Signed
          </span>
        </div>
        <div className="signer-row">
          <div className="signer-avatar" style={{background: "linear-gradient(135deg, var(--accent), var(--brand-bright))"}}>JD</div>
          <div className="signer-info">
            <div className="signer-name">Jane Doe</div>
            <div className="signer-role">Tenant · awaiting your signature</div>
          </div>
          <span className="signer-state you" id="signerState">Your turn</span>
        </div>
      </div>
    </aside>

    
    <section className="main-col">

      
      <div className="panel">
        <div className="panel-head">
          <div className="panel-num done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="panel-title">Review your lease</div>
          <span className="panel-state review" id="reviewState">8 sections · ~5 min read</span>
        </div>
        <div className="panel-body" style={{paddingTop: "8px", paddingBottom: "8px"}}>

          <div className="doc-section open">
            <div className="doc-section-head">
              <div className="doc-section-num">1</div>
              <div className="doc-section-title">Term &amp; rent</div>
              <div className="doc-section-meta">2 paragraphs</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>This lease begins on <span className="doc-highlight">May 1, 2026</span> and ends on <span className="doc-highlight">April 30, 2027</span>. Monthly rent is <span className="doc-highlight">$750.00</span>, due on the 1st of each month. Rent paid by the 5th avoids late fees. Late rent incurs a flat $25 fee plus $5/day after the 10th, capped at 5% of monthly rent per Alabama Code §35-9A-161.</p>
              <p>If Tenant pays through Tenantory's autopay (ACH), there is no processing fee. Card payments incur a 2.95% processing fee charged by the payment processor (not retained by Landlord).</p>
              <div className="doc-key">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <div>If you turn on autopay before May 1, your $25 first-month autopay credit applies automatically.</div>
              </div>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">2</div>
              <div className="doc-section-title">Security deposit</div>
              <div className="doc-section-meta">1 paragraph</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Tenant pays a <span className="doc-highlight">$750.00</span> refundable security deposit at lease signing. Landlord holds the deposit in a separate Alabama account per §35-9A-201. Within <span className="doc-highlight">35 days of move-out</span>, Landlord returns the deposit minus any documented deductions for damages beyond ordinary wear and tear, with an itemized statement.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">3</div>
              <div className="doc-section-title">Utilities &amp; services</div>
              <div className="doc-section-meta">1 paragraph</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Landlord provides electricity, gas, water, sewer, trash, lawn care, and high-speed internet (gigabit fiber) at no extra cost to Tenant. If Tenant's individual electricity usage exceeds the house average by more than 50% for two consecutive months (measured by Sense smart meter), Landlord may bill Tenant for the overage at cost.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">4</div>
              <div className="doc-section-title">Maintenance &amp; repairs</div>
              <div className="doc-section-meta">2 paragraphs</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Tenant submits maintenance requests through the Black Bear tenant portal. Landlord responds within <span className="doc-highlight">24 hours</span> for non-emergency requests and same-day for emergencies (no heat in winter, no water, gas leak, flood, fire, no electricity). Tenant grants Landlord permission to enter the unit for repairs with 24 hours notice, except in true emergencies.</p>
              <p>Tenant is responsible for: light bulbs, smoke detector batteries, normal cleaning, pest issues caused by Tenant's housekeeping, and any damage Tenant causes. Landlord is responsible for: appliances, HVAC, plumbing, electrical, structural, exterior, and any pre-existing pest issues.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">5</div>
              <div className="doc-section-title">House rules &amp; quiet hours</div>
              <div className="doc-section-meta">1 paragraph</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Quiet hours are <span className="doc-highlight">10pm–8am</span> every night. Overnight guests are welcome — up to 3 nights without notice, longer stays require a heads-up to housemates. No subletting without written approval. Smoking is not permitted indoors. Tenant agrees to the full house rules document (provided separately) and may help amend them in housemate meetings.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">6</div>
              <div className="doc-section-title">Pets</div>
              <div className="doc-section-meta">1 paragraph</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Tenant has declared <span className="doc-highlight">no pets</span> at signing. Adding a pet later requires written approval, a $250 refundable pet deposit per animal, and proof of vaccinations. No more than 2 pets per Tenant. No aggressive breeds (per Alabama Insurance commissioner list). Service animals are always welcome and not subject to deposits.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">7</div>
              <div className="doc-section-title">Termination &amp; move-out</div>
              <div className="doc-section-meta">2 paragraphs</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>Lease ends naturally on <span className="doc-highlight">April 30, 2027</span>. Tenant must give <span className="doc-highlight">60 days written notice</span> if not renewing. If Tenant breaks the lease early, Tenant pays one month's rent as an early-termination fee plus rent through the date the room is re-leased (Landlord agrees to make reasonable efforts to re-lease promptly).</p>
              <p>Move-out: room returned in same condition as the move-in inspection report (provided separately at move-in). Tenant attends a move-out walkthrough with Landlord. Deposit returned within 35 days of move-out per §35-9A-201.</p>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-section-head">
              <div className="doc-section-num">8</div>
              <div className="doc-section-title">Signatures &amp; acknowledgments</div>
              <div className="doc-section-meta">Final</div>
              <svg className="doc-section-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="doc-section-body">
              <p>By signing below, Tenant and Landlord acknowledge they have read and agree to all 8 sections of this lease. This is a legally binding agreement under Alabama law. Both parties retain a copy of the executed lease in their Tenantory portal.</p>
            </div>
          </div>

        </div>
        <div className="doc-foot">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            12-page lease · Alabama Residential Landlord Tenant Act compliant
          </span>
          <a href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download PDF
          </a>
        </div>
      </div>

      
      <div className="panel">
        <div className="panel-head">
          <div className="panel-num" id="signPanelNum">2</div>
          <div className="panel-title">Sign your name</div>
          <span className="panel-state todo" id="signPanelState">Required</span>
        </div>
        <div className="panel-body">

          <div className="sig-row">
            <div className="field">
              <label className="field-label">Legal first name</label>
              <input className="input" type="text" id="firstName" value="Jane" />
            </div>
            <div className="field">
              <label className="field-label">Legal last name</label>
              <input className="input" type="text" id="lastName" value="Doe" />
            </div>
          </div>

          <label className="field-label">Type your full name to sign</label>
          <input className="sig-typed-input" type="text" id="typedSig" placeholder="Type your full legal name exactly as above" />

          <div className="sig-pad-wrap" id="sigWrap" style={{marginTop: "14px"}}>
            <div className="sig-render sig-render-empty" id="sigRender">Your signature will appear here</div>
            <div className="sig-render-line">
              <span><strong>Jane Doe</strong> · Tenant</span>
              <span id="sigDate">Apr 16, 2026</span>
            </div>
          </div>

          <p style={{fontSize: "11.5px", color: "var(--text-muted)", lineHeight: "1.6"}}>
            By typing your name above, you are providing a legally binding electronic signature under the Alabama Uniform Electronic Transactions Act (§8-1A-7). Your signature, IP address, timestamp, and authentication record are stored permanently and verifiable by both parties.
          </p>
        </div>
      </div>

      
      <div className="panel">
        <div className="panel-head">
          <div className="panel-num" id="payPanelNum">3</div>
          <div className="panel-title">Pay your move-in total</div>
          <span className="panel-state todo" id="payPanelState">$1,500.00</span>
        </div>
        <div className="panel-body">

          <div className="breakdown">
            <div className="breakdown-row"><span>First month's rent (May 2026)</span><span>$750.00</span></div>
            <div className="breakdown-row"><span>Security deposit (refundable)</span><span>$750.00</span></div>
            <div className="breakdown-row"><span>Application fee</span><span><span className="strike">$45.00</span><span className="free">Already paid</span></span></div>
            <div className="breakdown-row"><span>Admin fee</span><span className="free">$0.00</span></div>
            <div className="breakdown-row total"><span>Total today</span><span>$1,500.00</span></div>
          </div>

          <label className="field-label" style={{marginBottom: "10px", display: "block"}}>Payment method</label>
          <div className="method-pick selected" data-method="bank">
            <div className="method-pick-radio" />
            <div className="method-icon bank">ACH</div>
            <div style={{flex: "1"}}>
              <div className="method-label">Bank transfer (recommended)</div>
              <div className="method-sub">No fees · funds clear in 1–3 business days</div>
            </div>
          </div>
          <div className="method-pick" data-method="card">
            <div className="method-pick-radio" />
            <div className="method-icon card">CARD</div>
            <div style={{flex: "1"}}>
              <div className="method-label">Credit or debit card</div>
              <div className="method-sub">+$44.25 processing fee · funds clear instantly</div>
            </div>
          </div>

          <div style={{display: "flex", alignItems: "center", gap: "12px", marginTop: "14px", padding: "12px 14px", background: "var(--brand-pale)", borderRadius: "8px", border: "1px solid var(--brand-soft)"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: "18px", height: "18px", flexShrink: "0"}}><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
            <div style={{fontSize: "12.5px", color: "var(--brand-dark)"}}>
              <strong style={{fontWeight: "700"}}>Stripe-secured.</strong> Your payment goes directly to Black Bear's escrow account. Tenantory never holds your funds.
            </div>
          </div>
        </div>
      </div>

      
      <div className="panel">
        <div className="panel-head">
          <div className="panel-num" id="agreePanelNum">4</div>
          <div className="panel-title">Confirm &amp; submit</div>
          <span className="panel-state todo" id="agreePanelState">Last step</span>
        </div>
        <div className="panel-body">

          <div className="agree-block">
            <div className="agree-row" data-agree="read">
              <div className="agree-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div>I have <strong>read all 8 sections</strong> of this lease and agree to its terms.</div>
            </div>
            <div className="agree-row" data-agree="bind">
              <div className="agree-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div>I understand my typed signature is <strong>legally binding</strong> and that I am entering a 12-month rental agreement.</div>
            </div>
            <div className="agree-row" data-agree="pay">
              <div className="agree-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div>I authorize Black Bear Rentals to charge my chosen payment method <strong>$1,500.00</strong> today.</div>
            </div>
          </div>

          <div className="submit-bar">
            <div className="save-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              We auto-save your progress every 30 seconds.
            </div>
            <button className="btn btn-primary" id="submitBtn" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              Sign &amp; pay $1,500
            </button>
          </div>
        </div>
      </div>

    </section>
  </main>

  
  <div className="success-overlay" id="successOverlay">
    <div className="success-card">
      <div className="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2>Welcome to Black Bear, Jane!</h2>
      <p className="success-sub">Your lease is fully executed and your $1,500 move-in total is processing. <strong>You move in May 1.</strong> Harrison will reach out by Apr 28 to coordinate keys and the move-in walkthrough.</p>

      <div className="timeline">
        <div className="timeline-row">
          <div className="timeline-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="timeline-text"><strong>Today</strong> — receipt + executed lease emailed to you</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="timeline-text"><strong>Today</strong> — your tenant portal account is live</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">3</div>
          <div className="timeline-text muted"><strong>Apr 28</strong> — Harrison calls to confirm move-in time &amp; key handoff</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">4</div>
          <div className="timeline-text muted"><strong>May 1</strong> — move-in day &amp; walkthrough inspection</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">5</div>
          <div className="timeline-text muted"><strong>Jun 1</strong> — first regular rent payment due (autopay reminder will go out May 25)</div>
        </div>
      </div>

      <a className="btn btn-primary" href="portal.html" style={{display: "inline-flex"}}>
        Open my tenant portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  </div>

  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Fair Housing</a> · <a href="#">Privacy</a></div>
    <div className="powered-by">Powered by Tenantory</div>
  </footer>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
