"use client";

// Mock ported from ~/Desktop/blackbear/roommate.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* ===== Black Bear brand tokens (mirrors portal.html :root) ===== */\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --amber-bg: rgba(199,132,59,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* ===== Topbar (matches portal / sign / moveout) ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9); padding: 16px 32px;\n      display: flex; align-items: center; justify-content: space-between;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-help { font-size: 13px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 18px; }\n    .tb-help a { color: #fff; font-weight: 600; }\n    .tb-help a:hover { text-decoration: underline; }\n    .tb-back { display: inline-flex; align-items: center; gap: 6px; }\n\n    /* ===== Status banner ===== */\n    .status-banner {\n      max-width: 1100px; margin: 0 auto;\n      background: var(--brand-pale);\n      border-bottom: 1px solid var(--brand-soft);\n      padding: 14px 32px; display: flex; gap: 12px; align-items: center;\n    }\n    .status-icon {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--brand); color: #fff; flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .status-icon svg { width: 16px; height: 16px; }\n    .status-text { font-size: 13.5px; color: var(--text); }\n    .status-text strong { font-weight: 700; color: var(--brand-dark); }\n\n    /* ===== Layout ===== */\n    .wrap {\n      max-width: 1100px; margin: 0 auto; padding: 28px 32px 60px;\n      display: grid; grid-template-columns: 320px 1fr; gap: 28px; align-items: flex-start;\n    }\n\n    /* ===== Sticky sidebar ===== */\n    .sidebar {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 24px;\n      position: sticky; top: 20px;\n      box-shadow: var(--shadow-sm);\n    }\n    .side-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }\n    .side-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }\n    .side-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }\n\n    .steps { display: flex; flex-direction: column; gap: 0; }\n    .step {\n      display: flex; gap: 14px; padding: 10px 0;\n      transition: all 0.15s ease; position: relative;\n    }\n    .step-num {\n      width: 28px; height: 28px; border-radius: 50%;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 12px; font-weight: 700; flex-shrink: 0; z-index: 1;\n    }\n    .step-num svg { width: 13px; height: 13px; }\n    .step:not(:last-child)::before {\n      content: \"\"; position: absolute; left: 13.5px; top: 38px; bottom: -10px;\n      width: 1px; background: var(--border);\n    }\n    .step.done .step-num { background: var(--brand); border-color: var(--brand); color: #fff; }\n    .step.done:not(:last-child)::before { background: var(--brand); }\n    .step.active .step-num { background: var(--brand-pale); border-color: var(--brand); color: var(--brand-dark); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .step-body { flex: 1; padding-top: 2px; }\n    .step-label { font-weight: 700; font-size: 13px; color: var(--text); }\n    .step-meta { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }\n\n    .sidebar-foot { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }\n    .sidebar-contact {\n      background: var(--brand-pale); border: 1px solid var(--brand-soft);\n      border-radius: var(--radius); padding: 14px;\n      font-size: 12.5px; color: var(--text); line-height: 1.55;\n    }\n    .sidebar-contact strong { color: var(--brand-dark); font-weight: 700; }\n    .sidebar-contact a { color: var(--brand); font-weight: 700; }\n\n    /* ===== Main column ===== */\n    .main { min-width: 0; }\n\n    .page-head { margin-bottom: 22px; }\n    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }\n    .page-head h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .page-head p { color: var(--text-muted); font-size: 14.5px; max-width: 640px; }\n\n    .flow-summary {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px; margin-top: 14px;\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n    }\n    .flow-row {\n      display: flex; gap: 10px; align-items: flex-start;\n      font-size: 13px; color: var(--text); line-height: 1.45;\n    }\n    .flow-dot {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--brand-pale); color: var(--brand-dark);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 800; flex-shrink: 0;\n    }\n    .flow-row strong { font-weight: 700; display: block; }\n    .flow-row span { color: var(--text-muted); font-size: 12px; }\n    .flow-total {\n      margin-top: 14px; font-size: 12px; color: var(--text-muted);\n      display: flex; align-items: center; gap: 6px;\n    }\n    .flow-total svg { width: 13px; height: 13px; color: var(--brand); }\n\n    /* ===== Cards ===== */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px;\n      box-shadow: var(--shadow-sm); margin-bottom: 18px;\n    }\n    .card-head { margin-bottom: 18px; }\n    .card-title { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }\n    .card-sub { font-size: 12.5px; color: var(--text-muted); margin-top: 4px; }\n    .card-num {\n      display: inline-flex; align-items: center; justify-content: center;\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      font-size: 11px; font-weight: 800; margin-right: 8px;\n    }\n\n    /* ===== Relationship radio ===== */\n    .rel-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n    .rel {\n      display: flex; gap: 12px; padding: 14px;\n      border: 1.5px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease; align-items: center;\n    }\n    .rel:hover { border-color: var(--brand); }\n    .rel.selected { border-color: var(--brand); background: var(--brand-pale); }\n    .rel-dot {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0; position: relative;\n      transition: all 0.15s ease;\n    }\n    .rel.selected .rel-dot { border-color: var(--brand); background: var(--brand); }\n    .rel.selected .rel-dot::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n    .rel-body { flex: 1; }\n    .rel-title { font-weight: 700; font-size: 13.5px; color: var(--text); }\n    .rel-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n\n    .rel-copy {\n      margin-top: 14px; padding: 12px 14px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 13px; color: var(--text-muted);\n      line-height: 1.55;\n    }\n    .rel-copy strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Form fields ===== */\n    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .field { margin-bottom: 16px; }\n    .field:last-child { margin-bottom: 0; }\n    .field-label { display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }\n    .field-label-req::after { content: \" *\"; color: var(--red); }\n    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }\n    .input {\n      width: 100%; padding: 11px 14px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); font-size: 14px; color: var(--text);\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    textarea.input { resize: vertical; min-height: 100px; line-height: 1.5; }\n\n    /* ===== Financial comparison ===== */\n    .money-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n    }\n    .money-card {\n      border: 1.5px solid var(--border); border-radius: var(--radius-lg);\n      padding: 18px; cursor: pointer; transition: all 0.15s ease;\n      background: var(--surface);\n    }\n    .money-card:hover { border-color: var(--brand); }\n    .money-card.selected { border-color: var(--brand); background: var(--brand-pale); box-shadow: 0 4px 14px rgba(30,111,71,0.1); }\n    .money-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }\n    .money-radio {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong); flex-shrink: 0; position: relative;\n      transition: all 0.15s ease;\n    }\n    .money-card.selected .money-radio { border-color: var(--brand); background: var(--brand); }\n    .money-card.selected .money-radio::after {\n      content: \"\"; position: absolute; inset: 3px; border-radius: 50%; background: #fff;\n    }\n    .money-title { font-weight: 700; font-size: 14px; color: var(--text); letter-spacing: -0.01em; }\n    .money-big {\n      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;\n      color: var(--brand-dark); line-height: 1.1; margin-bottom: 4px;\n      font-variant-numeric: tabular-nums;\n    }\n    .money-sub { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n\n    .money-breakdown {\n      margin-top: 16px; padding: 16px 18px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n    }\n    .mb-row {\n      display: grid; grid-template-columns: 1fr auto auto auto;\n      align-items: center; gap: 12px; padding: 8px 0;\n      border-bottom: 1px dashed var(--border); font-size: 13px;\n    }\n    .mb-row:last-child { border-bottom: none; padding-top: 12px; }\n    .mb-row.total { border-top: 1px solid var(--border-strong); border-bottom: none; padding-top: 12px; font-weight: 700; }\n    .mb-label { color: var(--text); font-weight: 600; }\n    .mb-then { color: var(--text-muted); font-variant-numeric: tabular-nums; text-decoration: line-through; font-size: 12.5px; }\n    .mb-arrow { color: var(--text-faint); }\n    .mb-arrow svg { width: 12px; height: 12px; }\n    .mb-now { color: var(--brand-dark); font-weight: 700; font-variant-numeric: tabular-nums; }\n    .mb-row.total .mb-now { color: var(--brand-dark); font-size: 15px; }\n\n    /* ===== Info callout (application notice) ===== */\n    .notice {\n      display: flex; gap: 14px; padding: 18px;\n      background: var(--accent-bg); border: 1px solid rgba(199,132,59,0.3);\n      border-radius: var(--radius-lg);\n    }\n    .notice-icon {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: var(--accent); color: #fff; flex-shrink: 0;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .notice-icon svg { width: 18px; height: 18px; }\n    .notice-body { flex: 1; }\n    .notice-title { font-weight: 800; font-size: 14px; color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em; }\n    .notice-body p { font-size: 13px; color: var(--text); line-height: 1.55; margin-bottom: 6px; }\n    .notice-body p:last-child { margin-bottom: 0; }\n    .notice-pills { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }\n    .notice-pill {\n      font-size: 11.5px; font-weight: 700;\n      background: var(--surface); border: 1px solid var(--border);\n      padding: 4px 10px; border-radius: 100px;\n      color: var(--text); display: inline-flex; align-items: center; gap: 5px;\n    }\n    .notice-pill svg { width: 11px; height: 11px; color: var(--accent); }\n\n    /* ===== Agreement checkboxes ===== */\n    .agree-list { display: flex; flex-direction: column; gap: 8px; }\n    .agree {\n      display: flex; gap: 12px; padding: 14px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      cursor: pointer; transition: all 0.15s ease; align-items: flex-start;\n      background: var(--surface);\n    }\n    .agree:hover { border-color: var(--brand-soft); background: var(--surface-subtle); }\n    .agree.checked { border-color: var(--brand); background: var(--brand-pale); }\n    .agree-box {\n      width: 20px; height: 20px; border-radius: 5px;\n      border: 2px solid var(--border-strong); flex-shrink: 0; margin-top: 1px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s ease; background: var(--surface);\n    }\n    .agree.checked .agree-box { background: var(--brand); border-color: var(--brand); }\n    .agree-box svg { width: 12px; height: 12px; color: #fff; opacity: 0; }\n    .agree.checked .agree-box svg { opacity: 1; }\n    .agree-body { flex: 1; font-size: 13.5px; color: var(--text); line-height: 1.5; }\n    .agree-body strong { font-weight: 700; }\n    .agree.hidden { display: none; }\n\n    /* ===== Submit bar ===== */\n    .submit-bar {\n      display: flex; justify-content: space-between; align-items: center;\n      gap: 14px; flex-wrap: wrap;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 18px 22px;\n      box-shadow: var(--shadow-sm); margin-top: 4px;\n    }\n    .submit-note {\n      font-size: 12.5px; color: var(--text-muted);\n      display: inline-flex; align-items: center; gap: 8px;\n    }\n    .submit-note svg { width: 14px; height: 14px; color: var(--brand); }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 100px; font-weight: 700; font-size: 14px; transition: all 0.15s ease; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(20,77,49,0.2); }\n    .btn-primary:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }\n    .btn-primary:disabled { background: var(--border-strong); color: #fff; cursor: not-allowed; box-shadow: none; opacity: 0.7; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }\n\n    /* ===== Success overlay ===== */\n    .success-overlay {\n      position: fixed; inset: 0; background: rgba(20,77,49,0.6);\n      display: none; align-items: center; justify-content: center; z-index: 80;\n      padding: 20px; backdrop-filter: blur(4px);\n    }\n    .success-overlay.show { display: flex; }\n    .success-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 44px 34px; max-width: 520px; width: 100%;\n      box-shadow: var(--shadow-lg); text-align: center;\n      animation: pop 0.4s cubic-bezier(.2,.9,.3,1);\n    }\n    @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: none; } }\n    .success-badge {\n      width: 76px; height: 76px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright), var(--brand));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 20px; box-shadow: 0 14px 40px rgba(30,111,71,0.35);\n    }\n    .success-badge svg { width: 38px; height: 38px; }\n    .success-card h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; }\n    .success-sub { color: var(--text-muted); font-size: 14.5px; margin-bottom: 22px; line-height: 1.6; }\n    .success-sub strong { color: var(--text); font-weight: 700; }\n    .timeline {\n      text-align: left; background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px; margin-bottom: 22px;\n    }\n    .timeline-row { display: flex; gap: 12px; padding: 6px 0; font-size: 13px; align-items: flex-start; }\n    .timeline-icon {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      font-size: 11px; font-weight: 700;\n    }\n    .timeline-icon svg { width: 12px; height: 12px; }\n    .timeline-icon.upcoming { background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); }\n    .timeline-text { color: var(--text); line-height: 1.45; }\n    .timeline-text strong { font-weight: 700; }\n    .timeline-text .muted { color: var(--text-muted); font-size: 12px; display: block; margin-top: 2px; }\n\n    /* ===== Toast ===== */\n    .toast-stack { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 90; }\n    .toast {\n      background: var(--text); color: var(--surface);\n      padding: 12px 18px; border-radius: var(--radius);\n      font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg);\n      display: flex; align-items: center; gap: 10px;\n      animation: toastIn 0.3s cubic-bezier(.2,.9,.3,1);\n    }\n    .toast svg { width: 16px; height: 16px; color: var(--brand-bright); }\n    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }\n\n    /* ===== Footer ===== */\n    .legal-foot {\n      max-width: 1100px; margin: 0 auto; padding: 28px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;\n      color: var(--text-faint); font-size: 11px;\n    }\n    .legal-foot a:hover { color: var(--brand); }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    @media (max-width: 920px) {\n      .wrap { grid-template-columns: 1fr; }\n      .sidebar { position: static; }\n      .money-grid { grid-template-columns: 1fr; }\n      .rel-list { grid-template-columns: 1fr; }\n      .grid-2 { grid-template-columns: 1fr; }\n      .flow-summary { grid-template-columns: 1fr; }\n      .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }\n      .tb-help { width: 100%; justify-content: space-between; }\n    }\n  ";

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
        <div className="tb-brand-sub">Invite a roommate</div>
      </div>
    </div>
    <div className="tb-help">
      <a className="tb-back" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to portal
      </a>
      Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>
    </div>
  </header>

  
  <div className="status-banner">
    <div className="status-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    </div>
    <div className="status-text">
      <strong>Invite a roommate or partner to join your lease</strong> &middot; Room C &middot; 908 Lee Drive NW
    </div>
  </div>

  <main className="wrap">

    
    <aside className="sidebar">
      <div className="side-eyebrow">Roommate add-on</div>
      <div className="side-title">4 steps to a joint lease</div>
      <div className="side-sub">This is how it works once you submit the invite below.</div>

      <div className="steps" id="progressSteps">
        <div className="step active" data-step="1">
          <div className="step-num">1</div>
          <div className="step-body">
            <div className="step-label">Their info</div>
            <div className="step-meta">You fill out this form &middot; ~3 min</div>
          </div>
        </div>
        <div className="step" data-step="2">
          <div className="step-num">2</div>
          <div className="step-body">
            <div className="step-label">They apply</div>
            <div className="step-meta">We email them a link &middot; ~10 min</div>
          </div>
        </div>
        <div className="step" data-step="3">
          <div className="step-num">3</div>
          <div className="step-body">
            <div className="step-label">Harrison reviews</div>
            <div className="step-meta">Background + income &middot; 3-5 days</div>
          </div>
        </div>
        <div className="step" data-step="4">
          <div className="step-num">4</div>
          <div className="step-body">
            <div className="step-label">Updated lease</div>
            <div className="step-meta">Both sign digitally &middot; day 7</div>
          </div>
        </div>
      </div>

      <div className="sidebar-foot">
        <div className="sidebar-contact">
          <strong>Not sure if they'll qualify?</strong><br />
          Text Harrison at <a href="sms:2565550102">(256) 555-0102</a> before you send the invite. Saves everyone a $45 application fee if there's a blocker.
        </div>
      </div>
    </aside>

    
    <section className="main">

      <div className="page-head">
        <div className="page-kicker">Room C &middot; 908 Lee Drive NW</div>
        <h1>Add someone to your lease</h1>
        <p>Whether it's a partner moving in or a new housemate, the process is the same and it's fast.</p>

        <div className="flow-summary">
          <div className="flow-row">
            <div className="flow-dot">1</div>
            <div><strong>You fill this out</strong><span>Who they are, how rent splits.</span></div>
          </div>
          <div className="flow-row">
            <div className="flow-dot">2</div>
            <div><strong>They get a link</strong><span>Standard Black Bear application.</span></div>
          </div>
          <div className="flow-row">
            <div className="flow-dot">3</div>
            <div><strong>Harrison approves</strong><span>Then we e-sign a joint lease.</span></div>
          </div>
        </div>

        <div className="flow-total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Start-to-finish: about <strong>&nbsp;7 days</strong>&nbsp; if they apply the same day.
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">A</span>Who are they to you?</div>
          <div className="card-sub">This changes one or two things: rent splits, the "coordinate with housemates" step, and the tone of the invite email.</div>
        </div>

        <div className="rel-list" id="relList">
          <div className="rel selected" data-rel="partner">
            <div className="rel-dot" />
            <div className="rel-body">
              <div className="rel-title">Partner or spouse</div>
              <div className="rel-sub">Moving in together</div>
            </div>
          </div>
          <div className="rel" data-rel="roommate">
            <div className="rel-dot" />
            <div className="rel-body">
              <div className="rel-title">Roommate</div>
              <div className="rel-sub">Friend or new housemate</div>
            </div>
          </div>
          <div className="rel" data-rel="family">
            <div className="rel-dot" />
            <div className="rel-body">
              <div className="rel-title">Family member</div>
              <div className="rel-sub">Sibling, parent, cousin</div>
            </div>
          </div>
          <div className="rel" data-rel="other">
            <div className="rel-dot" />
            <div className="rel-body">
              <div className="rel-title">Other</div>
              <div className="rel-sub">Tell us in the notes</div>
            </div>
          </div>
        </div>

        <div className="rel-copy" id="relCopy">
          <strong>Partner / spouse add-on.</strong> Congrats on the next step. We'll send a warmer invite email that mentions you by name, and we default to the 50/50 split since you're sharing a room.
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">B</span>Their info</div>
          <div className="card-sub">We send the application link straight to their email. Double-check the spelling.</div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label field-label-req">First name</label>
            <input className="input" id="fName" type="text" placeholder="Jordan" autoComplete="off" />
          </div>
          <div className="field">
            <label className="field-label field-label-req">Last name</label>
            <input className="input" id="lName" type="text" placeholder="Rivera" autoComplete="off" />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label field-label-req">Email</label>
            <input className="input" id="email" type="email" placeholder="jordan@example.com" autoComplete="off" />
            <div className="field-hint">The application link goes here. They'll verify it before applying.</div>
          </div>
          <div className="field">
            <label className="field-label field-label-req">Phone</label>
            <input className="input" id="phone" type="tel" placeholder="(256) 555-0147" autoComplete="off" />
          </div>
        </div>

        <div className="field" style={{marginBottom: "0"}}>
          <label className="field-label field-label-req">Proposed move-in date</label>
          <input className="input" id="moveIn" type="date" style={{maxWidth: "260px"}} />
          <div className="field-hint">Defaults to two weeks from today. Harrison will confirm once the application clears.</div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">C</span>How does rent work now?</div>
          <div className="card-sub">Pick a split. You can renegotiate later, but this is what goes on the joint lease.</div>
        </div>

        <div className="money-grid" id="moneyGrid">
          <div className="money-card selected" data-option="split">
            <div className="money-head">
              <div className="money-radio" />
              <div className="money-title">Split 50/50</div>
            </div>
            <div className="money-big">$375 <span style={{fontSize: "13px", color: "var(--text-muted)", fontWeight: "600"}}>each</span></div>
            <div className="money-sub">Each of you pays your half directly. If one person is late, only that person is late — the other isn't on the hook.</div>
          </div>
          <div className="money-card" data-option="keep">
            <div className="money-head">
              <div className="money-radio" />
              <div className="money-title">Keep $750 &middot; joint liability</div>
            </div>
            <div className="money-big">$750 <span style={{fontSize: "13px", color: "var(--text-muted)", fontWeight: "600"}}>together</span></div>
            <div className="money-sub">You sort out who pays what. Both signers are equally responsible for the full amount — if one doesn't pay, the other owes it.</div>
          </div>
        </div>

        <div className="money-breakdown">
          <div className="mb-row">
            <div className="mb-label">Monthly rent</div>
            <div className="mb-then">$750</div>
            <div className="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            <div className="mb-now" id="mbRent">$375 each</div>
          </div>
          <div className="mb-row">
            <div className="mb-label">Security deposit on file</div>
            <div className="mb-then">$750</div>
            <div className="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            <div className="mb-now" id="mbDeposit">$1,125 total</div>
          </div>
          <div className="mb-row">
            <div className="mb-label">Deposit they owe at signing</div>
            <div className="mb-then">&mdash;</div>
            <div className="mb-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
            <div className="mb-now" id="mbAdd">+ $375 due from them</div>
          </div>
          <div className="mb-row total">
            <div className="mb-label">Your out-of-pocket change</div>
            <div className="mb-then" />
            <div className="mb-arrow" />
            <div className="mb-now" id="mbYou">&minus; $375 / month starting next cycle</div>
          </div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">D</span>They have to apply &mdash; it's not instant</div>
          <div className="card-sub">Same application you filled out when you moved in. No shortcuts, but it's quick.</div>
        </div>

        <div className="notice">
          <div className="notice-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>
          </div>
          <div className="notice-body">
            <div className="notice-title">What happens on their end</div>
            <p>They get an email with a secure link to Black Bear's standard application. It asks for ID, employment, income (3x rent), rental history, and runs a soft background + credit check through TransUnion SmartMove.</p>
            <p>Harrison reviews the packet within 3&ndash;5 business days and either approves, asks a follow-up question, or politely declines. You'll get a copy of the decision either way.</p>
            <div className="notice-pills">
              <span className="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> $45 application fee (they pay)</span>
              <span className="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> ~10 min to fill out</span>
              <span className="notice-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Encrypted &middot; SOC 2</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">E</span>Anything housemates should know?</div>
          <div className="card-sub">Shared-space stuff matters. Be honest here &mdash; it saves a household meeting later.</div>
        </div>

        <div className="field" style={{marginBottom: "0"}}>
          <label className="field-label" htmlFor="impact">Will they use the house differently?</label>
          <textarea className="input" id="impact" placeholder="Example: They work nights so they'd use the kitchen around 11pm. Has a small cat — already chatted with Maya about it. Plans to use the back bedroom as a home office two days a week." />
          <div className="field-hint">Optional, but if there's a pet, a second vehicle, a noise change, or a shared-bath logistics thing, flag it now. Harrison shares this summary with the other housemates before approving.</div>
        </div>
      </div>

      
      <div className="card">
        <div className="card-head">
          <div className="card-title"><span className="card-num">F</span>Before you send the invite</div>
          <div className="card-sub">Three quick confirmations. Two are required, one depends on your situation.</div>
        </div>

        <div className="agree-list" id="agreeList">
          <div className="agree" data-id="a1">
            <div className="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="agree-body">
              <strong>I understand they have to apply.</strong> Black Bear runs a standard application + background + credit check on every signer. Approval isn't guaranteed just because I'm inviting them, and the $45 fee isn't refundable if they're declined.
            </div>
          </div>

          <div className="agree" data-id="a2">
            <div className="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="agree-body">
              <strong>I accept joint financial responsibility</strong> if we go with the "keep $750, both responsible" option. That means if they stop paying, I'm on the hook for the full rent until the lease ends or we re-sign. The 50/50 split doesn't have this clause.
            </div>
          </div>

          <div className="agree hidden" data-id="a3">
            <div className="agree-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="agree-body">
              <strong>I've coordinated with my housemates.</strong> Since this is a roommate-add in a shared house, I've at least given the other tenants a heads-up and nobody's blocking it. Harrison will still confirm with them directly before approving.
            </div>
          </div>
        </div>
      </div>

      
      <div className="submit-bar">
        <div className="submit-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          We won't charge anyone until Harrison approves the application.
        </div>
        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
          <a className="btn btn-ghost" href="portal.html">Cancel</a>
          <button className="btn btn-primary" id="sendBtn" disabled>
            Send invite
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>

    </section>
  </main>

  
  <div className="success-overlay" id="successOverlay">
    <div className="success-card">
      <div className="success-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2>Invite sent to <span id="successName">Jordan</span></h2>
      <div className="success-sub">
        We just emailed <strong id="successEmail">jordan@example.com</strong> an application link. You'll get a copy too. Here's what's next.
      </div>

      <div className="timeline">
        <div className="timeline-row">
          <div className="timeline-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <div className="timeline-text">
            <strong>Today</strong> &middot; Invite email sent
            <span className="muted">They have 7 days to start the application before the link expires.</span>
          </div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">2</div>
          <div className="timeline-text">
            <strong>Within a week</strong> &middot; They submit the application
            <span className="muted">We'll nudge them if they don't start it within 48 hours.</span>
          </div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">3</div>
          <div className="timeline-text">
            <strong>3&ndash;5 business days</strong> &middot; Harrison reviews
            <span className="muted">You'll get an email with the decision either way.</span>
          </div>
        </div>
        <div className="timeline-row">
          <div className="timeline-icon upcoming">4</div>
          <div className="timeline-text">
            <strong>Day 7 or so</strong> &middot; Joint lease + e-sign
            <span className="muted">Both of you sign in the portal. Deposit top-up hits at signing.</span>
          </div>
        </div>
      </div>

      <a className="btn btn-primary" href="portal.html" style={{width: "100%", justifyContent: "center"}}>
        Back to portal
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  </div>

  
  <footer className="legal-foot">
    <div>&copy; 2026 Black Bear Rentals &middot; <a href="legal-privacy.md">Privacy</a> &middot; <a href="legal-terms.md">Terms</a></div>
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>

  <div className="toast-stack" id="toastStack" />

  

    </>
  );
}
