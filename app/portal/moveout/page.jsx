"use client";

// Mock ported from ~/Desktop/blackbear/moveout.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* Black Bear brand tokens (same as portal/apply/listings/sign) */\n    :root {\n      --brand: #1e6f47; --brand-dark: #144d31; --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e; --brand-pale: #e7f4ed; --brand-soft: #d1e8dc;\n      --accent: #c7843b; --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24; --text-muted: #5e6b62; --text-faint: #8b978f;\n      --surface: #ffffff; --surface-alt: #f6f4ee; --surface-subtle: #fbfaf4;\n      --border: #e5e1d4; --border-strong: #c9c3b0;\n      --green: #1e6f47; --green-bg: rgba(30,111,71,0.12); --green-dark: #144d31;\n      --red: #b23a3a; --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b; --amber-bg: rgba(199,132,59,0.12);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); }\n    .tb-help a { color: #fff; font-weight: 600; }\n    .tb-help a:hover { text-decoration: underline; }\n\n    /* Banner */\n    .info-banner {\n      max-width: 1100px; margin: 0 auto;\n      background: var(--amber-bg); border-bottom: 1px solid rgba(199,132,59,0.3);\n      padding: 14px 32px; display: flex; gap: 12px; align-items: flex-start;\n    }\n    .info-icon {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: var(--amber); color: #fff; flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .info-icon svg { width: 14px; height: 14px; }\n    .info-text { font-size: 13px; color: var(--text); }\n    .info-text strong { font-weight: 700; }\n\n    /* Layout */\n    .wrap {\n      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;\n      display: grid; grid-template-columns: 340px 1fr; gap: 28px; align-items: flex-start;\n    }\n\n    /* Left sidebar */\n    .sidebar {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 24px;\n      position: sticky; top: 20px;\n      box-shadow: var(--shadow-sm);\n    }\n    .side-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }\n    .side-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }\n    .side-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }\n\n    .steps { display: flex; flex-direction: column; gap: 0; }\n    .step {\n      display: flex; gap: 14px; padding: 10px 0; cursor: pointer;\n      transition: all 0.15s ease;\n      position: relative;\n    }\n    .step-num {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 12px; font-weight: 700; flex-shrink: 0; z-index: 1;\n    }\n    .step-num svg { width: 13px; height: 13px; }\n    .step:not(:last-child)::before {\n      content: \"\"; position: absolute; left: 13.5px; top: 38px; bottom: -10px;\n      width: 1px; background: var(--border);\n    }\n    .step.done .step-num { background: var(--brand); border-color: var(--brand); color: #fff; }\n    .step.done:not(:last-child)::before { background: var(--brand); }\n    .step.active .step-num { background: var(--brand-pale); border-color: var(--brand); color: var(--brand-dark); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .step-body { flex: 1; padding-top: 2px; }\n    .step-label { font-weight: 700; font-size: 13px; color: var(--text); }\n    .step-meta { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n    .step.done .step-label { color: var(--text-muted); text-decoration: line-through; text-decoration-thickness: 1px; }\n\n    .sidebar-foot {\n      margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border);\n    }\n    .sidebar-contact {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius); padding: 14px;\n      font-size: 12.5px; color: var(--text); line-height: 1.55;\n    }\n    .sidebar-contact strong { color: var(--brand-dark); font-weight: 700; }\n    .sidebar-contact a { color: var(--brand); font-weight: 700; }\n\n    /* Main column */\n    .main { min-width: 0; }\n\n    .page-head { margin-bottom: 22px; }\n    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 620px; }\n\n    /* Cards */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px;\n      box-shadow: var(--shadow-sm); margin-bottom: 18px;\n    }\n    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }\n    .card-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }\n    .card-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }\n\n    /* Notice date block */\n    .notice-date {\n      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px;\n      align-items: stretch; margin-bottom: 18px;\n    }\n    .date-block {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n    }\n    .date-block.highlight { background: var(--brand-pale); border-color: var(--brand-soft); }\n    .date-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }\n    .date-block.highlight .date-label { color: var(--brand-dark); }\n    .date-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); line-height: 1; }\n    .date-block.highlight .date-val { color: var(--brand-dark); }\n    .date-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n    .date-arrow {\n      align-self: center;\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--surface); border: 1px solid var(--border);\n      color: var(--brand); display: flex; align-items: center; justify-content: center;\n    }\n    .date-arrow svg { width: 14px; height: 14px; }\n\n    .field { margin-bottom: 18px; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .field-label-req::after { content: \" *\"; color: var(--red); }\n    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n    .input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    textarea.input { resize: vertical; min-height: 100px; line-height: 1.5; }\n    select.input {\n      -webkit-appearance: none; appearance: none;\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235e6b62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n      background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;\n    }\n\n    /* Reason radio */\n    .reason-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n    .reason {\n      display: flex; gap: 12px; padding: 14px;\n      border: 1.5px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .reason:hover { border-color: var(--brand); }\n    .reason.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .reason-dot {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0;\n      position: relative; transition: all 0.15s ease; margin-top: 2px;\n    }\n    .reason.selected .reason-dot { border-color: var(--brand); background: var(--brand); }\n    .reason.selected .reason-dot::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n    .reason-body { flex: 1; }\n    .reason-title { font-weight: 700; font-size: 13px; color: var(--text); line-height: 1.3; }\n    .reason-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n\n    /* Checklist */\n    .checklist { display: flex; flex-direction: column; gap: 6px; }\n    .check-item {\n      display: flex; gap: 12px; padding: 12px 14px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease;\n      align-items: flex-start;\n    }\n    .check-item:hover { border-color: var(--brand-soft); background: var(--surface-subtle); }\n    .check-item.checked { border-color: var(--brand); background: var(--brand-pale); }\n    .check-box {\n      width: 20px; height: 20px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease;\n    }\n    .check-item.checked .check-box { background: var(--brand); border-color: var(--brand); }\n    .check-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .check-item.checked .check-box svg { opacity: 1; }\n    .check-body { flex: 1; }\n    .check-title { font-weight: 600; font-size: 13.5px; color: var(--text); line-height: 1.4; }\n    .check-sub { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }\n\n    .check-group + .check-group { margin-top: 18px; }\n    .check-group-head {\n      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\n    }\n    .check-group-title { font-size: 12px; font-weight: 800; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }\n    .check-group-line { flex: 1; height: 1px; background: var(--border); }\n    .check-group-count {\n      font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px;\n      background: var(--surface-subtle); color: var(--text-muted);\n    }\n\n    /* Progress bar */\n    .progress {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: 100px; height: 8px; overflow: hidden; margin-bottom: 4px;\n    }\n    .progress-bar {\n      height: 100%; background: linear-gradient(90deg, var(--brand-bright), var(--brand));\n      border-radius: 100px; transition: width 0.35s cubic-bezier(.2,.9,.3,1);\n      width: 0%;\n    }\n    .progress-meta {\n      display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);\n      margin-bottom: 14px;\n    }\n\n    /* Deposit */\n    .deposit-box {\n      background: linear-gradient(135deg, var(--brand-dark), var(--brand));\n      color: #fff; border-radius: var(--radius-lg);\n      padding: 24px 26px; margin-bottom: 18px;\n      display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .deposit-box::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 180px; height: 180px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(199,132,59,0.3), transparent 70%);\n    }\n    .deposit-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }\n    .deposit-amount { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }\n    .deposit-sub { font-size: 12.5px; color: rgba(255,255,255,0.8); margin-top: 6px; line-height: 1.5; }\n\n    /* Forwarding */\n    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n\n    /* Walkthrough times */\n    .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }\n    .time-slot {\n      padding: 10px 12px; border: 1.5px solid var(--border); border-radius: var(--radius);\n      background: var(--surface); text-align: center; cursor: pointer;\n      transition: all 0.15s ease;\n    }\n    .time-slot:hover { border-color: var(--brand); }\n    .time-slot.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .time-slot-day { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }\n    .time-slot-date { font-weight: 800; font-size: 15px; color: var(--text); margin-top: 2px; letter-spacing: -0.01em; }\n    .time-slot-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n    .time-slot.selected .time-slot-day { color: var(--brand-dark); }\n\n    /* Submit */\n    .submit-bar {\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 12px; flex-wrap: wrap; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border);\n    }\n    .save-note {\n      font-size: 12px; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    .save-note svg { width: 13px; height: 13px; color: var(--green-dark); }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }\n    .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n\n    /* Success overlay */\n    .success-overlay {\n      position: fixed; inset: 0; background: rgba(20,77,49,0.6);\n      display: none; align-items: center; justify-content: center; z-index: 80;\n      padding: 20px;\n    }\n    .success-overlay.show { display: flex; }\n    .success-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 44px 34px; max-width: 520px; width: 100%;\n      box-shadow: var(--shadow-lg); text-align: center;\n      animation: pop 0.4s cubic-bezier(.2,.9,.3,1);\n    }\n    @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: none; } }\n    .success-badge {\n      width: 76px; height: 76px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--brand));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 20px; box-shadow: 0 14px 40px rgba(30,111,71,0.35);\n    }\n    .success-badge svg { width: 38px; height: 38px; }\n    .success-card h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .success-sub { color: var(--text-muted); font-size: 14.5px; margin-bottom: 22px; line-height: 1.6; }\n    .success-sub strong { color: var(--text); font-weight: 700; }\n    .timeline {\n      text-align: left; background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px; margin-bottom: 20px;\n    }\n    .timeline-row { display: flex; gap: 12px; padding: 6px 0; font-size: 13px; align-items: flex-start; }\n    .timeline-icon {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      font-size: 11px; font-weight: 700;\n    }\n    .timeline-icon svg { width: 12px; height: 12px; }\n    .timeline-icon.upcoming { background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); }\n    .timeline-text { color: var(--text); }\n    .timeline-text.muted { color: var(--text-muted); }\n    .timeline-text strong { font-weight: 700; }\n\n    /* Toast */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 1100px; margin: 0 auto; padding: 28px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;\n      color: var(--text-faint); font-size: 11px;\n    }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    @media (max-width: 920px) {\n      .wrap { grid-template-columns: 1fr; }\n      .sidebar { position: static; }\n      .notice-date { grid-template-columns: 1fr; }\n      .date-arrow { transform: rotate(90deg); margin: 0 auto; }\n      .reason-list { grid-template-columns: 1fr; }\n      .time-grid { grid-template-columns: 1fr 1fr; }\n      .info-banner { padding: 12px 16px; }\n    }\n  ";

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
        <div className="tb-brand-sub">Move-out notice</div>
      </div>
    </div>
    <div className="tb-help">
      <a href="portal.html" style={{marginRight: "18px"}}>&larr; Back to portal</a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  <div className="info-banner">
    <div className="info-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    </div>
    <div className="info-text">
      <strong>Your lease requires 60 days written notice.</strong> Submitting this form counts as written notice — we'll also email you a PDF confirmation. Your lease ends <strong>Dec 31, 2026</strong>.
    </div>
  </div>

  <main className="wrap">

    
    <aside className="sidebar">
      <div className="side-eyebrow">Move-out progress</div>
      <div className="side-title">4 steps until you're out</div>
      <div className="side-sub">This list updates automatically as you finish each step.</div>

      <div className="steps">
        <div className="step active">
          <div className="step-num">1</div>
          <div className="step-body">
            <div className="step-label">Submit written notice</div>
            <div className="step-meta">Today · 60-day countdown begins</div>
          </div>
        </div>
        <div className="step">
          <div className="step-num">2</div>
          <div className="step-body">
            <div className="step-label">Schedule walkthrough</div>
            <div className="step-meta">~2 weeks before move-out</div>
          </div>
        </div>
        <div className="step">
          <div className="step-num">3</div>
          <div className="step-body">
            <div className="step-label">Return keys + clean</div>
            <div className="step-meta">By 5pm on your last day</div>
          </div>
        </div>
        <div className="step">
          <div className="step-num">4</div>
          <div className="step-body">
            <div className="step-label">Deposit returned</div>
            <div className="step-meta">Within 35 days · per AL §35-9A-201</div>
          </div>
        </div>
      </div>

      <div className="sidebar-foot">
        <div className="sidebar-contact">
          <strong>Not sure about something?</strong><br />
          Text Harrison at <a href="sms:2565550102">(256) 555-0102</a> or email <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>. No wrong questions.
        </div>
      </div>
    </aside>

    
    <section className="main">

      <div className="page-head">
        <div className="page-kicker">Room C · 908 Lee Drive</div>
        <h1>Give move-out notice</h1>
        <p>Fill out this form honestly. Everything here becomes part of your move-out record and goes into Harrison's system instantly — no waiting, no phone tag.</p>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">When are you moving out?</div>
            <div className="card-sub">Your earliest possible move-out is 60 days from today.</div>
          </div>
        </div>

        <div className="notice-date">
          <div className="date-block">
            <div className="date-label">Notice given today</div>
            <div className="date-val">Apr 14, 2026</div>
            <div className="date-sub">60-day clock starts now</div>
          </div>
          <div className="date-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </div>
          <div className="date-block highlight">
            <div className="date-label">Your move-out date</div>
            <div className="date-val" id="moveDateDisplay">Jun 14, 2026</div>
            <div className="date-sub">We'll stop charging rent after this date</div>
          </div>
        </div>

        <div className="field">
          <label className="field-label field-label-req">Desired move-out date</label>
          <input className="input" type="date" id="moveDate" value="2026-06-14" min="2026-06-13" />
          <div className="field-hint">Default is exactly 60 days from today. You can pick later — but your lease goes through Dec 31, 2026, and early move-out after 60 days still requires you to pay rent through that date unless we re-lease.</div>
        </div>

        <div className="field">
          <label className="field-label field-label-req">Reason for moving</label>
          <div className="reason-list" id="reasonList">
            <div className="reason selected" data-reason="job">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">New job / relocating</div>
                <div className="reason-sub">Out of town</div>
              </div>
            </div>
            <div className="reason" data-reason="buying">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">Buying a home</div>
                <div className="reason-sub">In the area</div>
              </div>
            </div>
            <div className="reason" data-reason="roommate">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">Roommate / household change</div>
                <div className="reason-sub">Moving in with someone</div>
              </div>
            </div>
            <div className="reason" data-reason="life">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">Life event</div>
                <div className="reason-sub">Family, health, etc.</div>
              </div>
            </div>
            <div className="reason" data-reason="unhappy">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">Something's not working here</div>
                <div className="reason-sub">We want to hear about it</div>
              </div>
            </div>
            <div className="reason" data-reason="other">
              <div className="reason-dot" />
              <div className="reason-body">
                <div className="reason-title">Other</div>
                <div className="reason-sub">You'll explain below</div>
              </div>
            </div>
          </div>
        </div>

        <div className="field" style={{marginBottom: "0"}}>
          <label className="field-label">Anything you want Harrison to know?</label>
          <textarea className="input" placeholder="Totally optional. What would make your move easier? Any feedback on the house, housemates, or management? Harrison reads every one of these." />
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Forwarding address</div>
            <div className="card-sub">Where should we mail your deposit check and final statement?</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label field-label-req">Street address</label>
            <input className="input" type="text" placeholder="123 New Street" />
          </div>
          <div className="field">
            <label className="field-label">Apt / unit</label>
            <input className="input" type="text" placeholder="Apt 2B" />
          </div>
        </div>
        <div className="grid-2">
          <div className="field">
            <label className="field-label field-label-req">City</label>
            <input className="input" type="text" placeholder="Nashville" />
          </div>
          <div className="grid-2">
            <div className="field">
              <label className="field-label field-label-req">State</label>
              <input className="input" type="text" placeholder="TN" maxLength="2" style={{textTransform: "uppercase"}} />
            </div>
            <div className="field">
              <label className="field-label field-label-req">ZIP</label>
              <input className="input" type="text" placeholder="37203" maxLength="5" />
            </div>
          </div>
        </div>
        <div className="field" style={{marginBottom: "0"}}>
          <label className="field-label">Prefer deposit by</label>
          <select className="input">
            <option>ACH direct deposit (faster · 2–3 business days)</option>
            <option>Paper check by mail (5–7 business days)</option>
          </select>
          <div className="field-hint">ACH uses the same bank account currently on file for rent (Chase ••6891). You can change it in Settings → Payment methods.</div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Schedule your walkthrough</div>
            <div className="card-sub">15 minutes. You, Harrison, and a checklist. Recommended 1–2 days before you move out.</div>
          </div>
        </div>

        <label className="field-label">Available times near your move-out date</label>
        <div className="time-grid" id="timeGrid">
          <div className="time-slot selected">
            <div className="time-slot-day">Fri</div>
            <div className="time-slot-date">Jun 12</div>
            <div className="time-slot-time">10:00 AM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Fri</div>
            <div className="time-slot-date">Jun 12</div>
            <div className="time-slot-time">2:00 PM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Sat</div>
            <div className="time-slot-date">Jun 13</div>
            <div className="time-slot-time">9:00 AM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Sat</div>
            <div className="time-slot-date">Jun 13</div>
            <div className="time-slot-time">11:00 AM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Sat</div>
            <div className="time-slot-date">Jun 13</div>
            <div className="time-slot-time">3:00 PM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Sun</div>
            <div className="time-slot-date">Jun 14</div>
            <div className="time-slot-time">10:00 AM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Mon</div>
            <div className="time-slot-date">Jun 15</div>
            <div className="time-slot-time">5:30 PM</div>
          </div>
          <div className="time-slot">
            <div className="time-slot-day">Tue</div>
            <div className="time-slot-date">Jun 16</div>
            <div className="time-slot-time">6:00 PM</div>
          </div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Move-out checklist</div>
            <div className="card-sub">Full deposit returned when every item is done. Most are 10 minutes each.</div>
          </div>
          <div>
            <div className="progress-meta">
              <span><strong id="checklistCount">0</strong> of 14 done</span>
              <span id="checklistPct">0%</span>
            </div>
            <div className="progress" style={{width: "180px"}}>
              <div className="progress-bar" id="checklistBar" />
            </div>
          </div>
        </div>

        <div className="check-group">
          <div className="check-group-head">
            <div className="check-group-title">Your room</div>
            <div className="check-group-line" />
            <span className="check-group-count">5 items</span>
          </div>
          <div className="checklist">
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Remove all personal belongings</div>
                <div className="check-sub">Closet, dresser, nightstand, desk drawers, wall hooks. Under the bed counts.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Patch nail holes and touch up paint</div>
                <div className="check-sub">Spackle provided in the basement. Paint is labeled "Main bed room" in the utility closet. Normal nail holes are free — 10+ holes counts as damage.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Dust all surfaces and wipe down windowsills</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Vacuum or sweep your room thoroughly</div>
                <div className="check-sub">Vacuum is in the hall closet. Move the bed and nightstand.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Leave furniture (bed, dresser, nightstand, desk) in the same spot as move-in</div>
                <div className="check-sub">They belong to the house — don't take anything you didn't bring.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="check-group">
          <div className="check-group-head">
            <div className="check-group-title">Shared spaces</div>
            <div className="check-group-line" />
            <span className="check-group-count">4 items</span>
          </div>
          <div className="checklist">
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Clear the fridge/freezer shelf you were using</div>
                <div className="check-sub">Including that one condiment you've been keeping "just in case" since 2024.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Remove your items from the pantry and spice rack</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Wipe down your bathroom shelf and shower caddy</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Clear any shared laundry space (dryer, drying rack)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="check-group">
          <div className="check-group-head">
            <div className="check-group-title">Admin</div>
            <div className="check-group-line" />
            <span className="check-group-count">5 items</span>
          </div>
          <div className="checklist">
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Return all keys (room key + front door key)</div>
                <div className="check-sub">At walkthrough, or leave in the lockbox and tell Harrison. Lost keys: $75 each.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Submit USPS mail forwarding</div>
                <div className="check-sub">Do it at <a href="https://moversguide.usps.com" target="_blank" style={{color: "var(--brand)", fontWeight: "600"}}>moversguide.usps.com</a>. 10 minutes.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Cancel any subscriptions tied to this address</div>
                <div className="check-sub">Amazon, NYT, HelloFresh, etc. Not Harrison's problem but you'll thank yourself.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Confirm all rent is paid through your move-out date</div>
                <div className="check-sub">You're paid through May. One more payment ($750) due June 1. Autopay handles it unless you cancel.</div>
              </div>
            </div>
            <div className="check-item">
              <div className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="check-body">
                <div className="check-title">Take before/after photos of your room</div>
                <div className="check-sub">Protects both sides if there's a deposit dispute. Upload them in Portal → Documents.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Your deposit</div>
            <div className="card-sub">What happens to the $750 Harrison is holding.</div>
          </div>
        </div>

        <div className="deposit-box">
          <div>
            <div className="deposit-label">Held in escrow</div>
            <div className="deposit-amount">$750.00</div>
            <div className="deposit-sub">Returned within <strong style={{color: "#fff"}}>35 days of move-out</strong> per Alabama Code §35-9A-201, minus any documented damages.</div>
          </div>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: "52px", height: "52px"}}><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
          </div>
        </div>

        <div style={{fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6"}}>
          <p style={{marginBottom: "10px"}}><strong style={{color: "var(--text)"}}>What gets deducted (if anything):</strong></p>
          <p style={{marginBottom: "6px"}}>• Documented damage beyond normal wear and tear (photos required)</p>
          <p style={{marginBottom: "6px"}}>• Professional cleaning if the room isn't clean (typical cost $85–150)</p>
          <p style={{marginBottom: "6px"}}>• Replacement cost of missing items (keys, smoke detector battery, etc.)</p>
          <p style={{marginBottom: "6px"}}>• Any rent owed through a re-leased date (rare — Harrison fills rooms fast)</p>
          <p style={{marginTop: "12px", color: "var(--brand-dark)", fontWeight: "600"}}>Last year, 84% of Black Bear move-outs got their full deposit back. Average deduction when there was one: $65.</p>
        </div>
      </div>

      
      <div className="card">
        <div style={{fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6"}}>
          By submitting, you're giving Black Bear Rentals <strong style={{color: "var(--text)"}}>60 days written notice</strong> of move-out per the terms of your lease. A PDF confirmation will be emailed to you and to <strong style={{color: "var(--text)"}}>harrison@rentblackbear.com</strong> within 60 seconds. You can cancel your notice in the portal up to 7 days after submitting — after that, the notice is final.
        </div>

        <div className="submit-bar">
          <div className="save-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Progress auto-saves · you can close this and come back
          </div>
          <div style={{display: "flex", gap: "10px"}}>
            <a className="btn btn-ghost" href="portal.html">Cancel</a>
            <button className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Submit 60-day notice
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
      <h2>Notice submitted.</h2>
      <p className="success-sub">Your 60-day move-out notice is filed and Harrison has been notified. A PDF confirmation is on its way to your email. Your move-out date is <strong>Jun 14, 2026</strong>.</p>

      <div className="timeline">
        <div className="timeline-row">
          <div className="timeline-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="timeline-text"><strong>Today</strong> — PDF confirmation emailed</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">2</div>
          <div className="timeline-text muted"><strong>May 15</strong> — Harrison confirms walkthrough details</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">3</div>
          <div className="timeline-text muted"><strong>Jun 12</strong> — walkthrough (Fri 10am)</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">4</div>
          <div className="timeline-text muted"><strong>Jun 14</strong> — move-out day · keys returned</div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">5</div>
          <div className="timeline-text muted"><strong>Jul 19</strong> — deposit returned (within 35 days)</div>
        </div>
      </div>

      <a className="btn btn-primary" href="portal.html" style={{display: "inline-flex"}}>
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  </div>

  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals · <a href="#">Privacy</a> · <a href="#">Terms</a></div>
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
