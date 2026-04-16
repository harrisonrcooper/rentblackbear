"use client";

// Mock ported from ~/Desktop/blackbear/inspection.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt); line-height: 1.5; font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }\n\n    /* ===== Workspace brand tokens (Black Bear Rentals — intentionally NOT Black Bear Rentals Flagship) ===== */\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --amber-bg: rgba(199,132,59,0.12);\n      --blue: #2b5db7;\n      --blue-bg: rgba(43,93,183,0.10);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 32px; height: 72px;\n      display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 2px 0 rgba(0,0,0,0.04);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: #fff;\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-right { display: flex; align-items: center; gap: 18px; font-size: 13px; color: rgba(255,255,255,0.75); }\n    .tb-right a { color: #fff; font-weight: 600; }\n    .tb-right a:hover { text-decoration: underline; }\n    .tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 100px; background: rgba(255,255,255,0.08); transition: all .15s ease; }\n    .tb-back:hover { background: rgba(255,255,255,0.16); text-decoration: none; }\n    .tb-back svg { width: 14px; height: 14px; }\n\n    /* ===== Status banner ===== */\n    .status-banner {\n      background: linear-gradient(135deg, var(--brand-pale), var(--brand-soft));\n      border-bottom: 1px solid var(--brand-soft);\n      padding: 18px 32px;\n      display: flex; align-items: center; gap: 16px;\n    }\n    .sb-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--brand); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; box-shadow: 0 4px 12px rgba(20,77,49,0.2);\n    }\n    .sb-icon svg { width: 22px; height: 22px; }\n    .sb-text { flex: 1; min-width: 0; }\n    .sb-crumbs { font-size: 11px; color: var(--brand-dark); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }\n    .sb-title { font-size: 16px; font-weight: 700; color: var(--text); }\n    .sb-title span { color: var(--text-muted); font-weight: 500; }\n    .sb-who { text-align: right; font-size: 12px; color: var(--text-muted); }\n    .sb-who strong { display: block; color: var(--text); font-size: 14px; font-weight: 700; }\n\n    /* ===== Layout ===== */\n    .wrap {\n      max-width: 1200px; margin: 0 auto; padding: 28px 32px 80px;\n      display: grid; grid-template-columns: 300px 1fr; gap: 28px; align-items: flex-start;\n    }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      position: sticky; top: 20px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      box-shadow: var(--shadow-sm);\n    }\n    .side-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }\n    .side-title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }\n    .side-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 18px; }\n    .overall-ring {\n      display: flex; align-items: center; gap: 14px;\n      padding: 14px; background: var(--brand-pale);\n      border-radius: var(--radius); margin-bottom: 18px;\n      border: 1px solid var(--brand-soft);\n    }\n    .ring-num { font-size: 26px; font-weight: 800; color: var(--brand-dark); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }\n    .ring-meta { font-size: 12px; color: var(--brand-dark); font-weight: 600; line-height: 1.3; }\n    .ring-meta small { display: block; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n\n    .room-progress-list { display: flex; flex-direction: column; gap: 6px; }\n    .rpi {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px 12px; border-radius: var(--radius);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      cursor: pointer; transition: all .15s ease; text-align: left;\n      width: 100%;\n    }\n    .rpi:hover { border-color: var(--brand-bright); background: var(--brand-pale); }\n    .rpi.done { background: var(--green-bg); border-color: var(--brand-soft); }\n    .rpi-check {\n      width: 20px; height: 20px; border-radius: 50%;\n      background: var(--surface); border: 1.5px solid var(--border-strong);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n      color: #fff;\n    }\n    .rpi.done .rpi-check { background: var(--brand); border-color: var(--brand); }\n    .rpi-check svg { width: 12px; height: 12px; opacity: 0; }\n    .rpi.done .rpi-check svg { opacity: 1; }\n    .rpi-body { flex: 1; min-width: 0; }\n    .rpi-label { font-weight: 600; font-size: 13px; color: var(--text); }\n    .rpi-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; font-variant-numeric: tabular-nums; }\n\n    .sidebar-foot {\n      margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border);\n      font-size: 11px; color: var(--text-muted); line-height: 1.5;\n    }\n    .sidebar-foot strong { color: var(--text); display: block; margin-bottom: 4px; font-size: 12px; }\n\n    /* ===== Main content ===== */\n    .main { min-width: 0; }\n    .page-head { margin-bottom: 22px; }\n    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }\n    .page-head h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.15; }\n    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }\n    .page-head p strong { color: var(--text); }\n\n    /* ===== Room section ===== */\n    .section {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); margin-bottom: 14px;\n      box-shadow: var(--shadow-sm); overflow: hidden;\n    }\n    .sec-head {\n      display: flex; align-items: center; gap: 14px;\n      padding: 18px 22px; cursor: pointer;\n      transition: background .15s ease;\n    }\n    .sec-head:hover { background: var(--surface-subtle); }\n    .section.open .sec-head { border-bottom: 1px solid var(--border); }\n    .sec-icon {\n      width: 38px; height: 38px; border-radius: 10px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .sec-icon svg { width: 20px; height: 20px; }\n    .sec-body-head { flex: 1; min-width: 0; }\n    .sec-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n    .sec-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .sec-count {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      padding: 4px 10px; border-radius: 100px; font-variant-numeric: tabular-nums;\n    }\n    .sec-count.done { color: var(--brand-dark); background: var(--brand-pale); border-color: var(--brand-soft); }\n    .sec-chev {\n      width: 28px; height: 28px; border-radius: 8px;\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: transform .2s ease;\n    }\n    .sec-chev svg { width: 14px; height: 14px; }\n    .section.open .sec-chev { transform: rotate(180deg); }\n\n    .sec-body { display: none; padding: 6px 22px 22px; }\n    .section.open .sec-body { display: block; }\n\n    /* ===== Item row ===== */\n    .item {\n      padding: 16px 0; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: 1fr; gap: 12px;\n    }\n    .item:last-child { border-bottom: none; padding-bottom: 6px; }\n    .item-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }\n    .item-name { font-weight: 700; font-size: 14px; color: var(--text); display: flex; align-items: center; gap: 8px; }\n    .item-name small { color: var(--text-muted); font-weight: 500; font-size: 12px; }\n\n    .rating-pills { display: flex; gap: 6px; flex-wrap: wrap; }\n    .rpill {\n      font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 100px;\n      background: var(--surface-subtle); border: 1.5px solid var(--border);\n      color: var(--text-muted); cursor: pointer; transition: all .12s ease;\n      display: inline-flex; align-items: center; gap: 6px;\n      white-space: nowrap;\n    }\n    .rpill:hover { border-color: var(--border-strong); color: var(--text); }\n    .rpill .rdot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .55; }\n    .rpill[data-val=\"excellent\"].active { background: var(--green-bg); border-color: var(--green); color: var(--green-dark); }\n    .rpill[data-val=\"good\"].active     { background: var(--blue-bg);  border-color: var(--blue);  color: var(--blue); }\n    .rpill[data-val=\"fair\"].active     { background: var(--amber-bg); border-color: var(--amber); color: var(--amber); }\n    .rpill[data-val=\"attn\"].active     { background: var(--red-bg);   border-color: var(--red);   color: var(--red); }\n    .rpill.active .rdot { opacity: 1; }\n\n    .item-extras { display: grid; grid-template-columns: 1fr 160px; gap: 12px; align-items: start; }\n    @media (max-width: 720px) { .item-extras { grid-template-columns: 1fr; } }\n\n    .note-input {\n      width: 100%; padding: 10px 12px; font-size: 13px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); outline: none; transition: all .15s ease;\n      min-height: 64px; resize: vertical; line-height: 1.45;\n    }\n    .note-input:focus { border-color: var(--brand); background: var(--surface); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .note-input::placeholder { color: var(--text-faint); }\n\n    .photo-tile {\n      height: 64px; border-radius: var(--radius);\n      border: 1.5px dashed var(--border-strong);\n      background: var(--surface-subtle); color: var(--text-muted);\n      display: flex; flex-direction: column; align-items: center; justify-content: center;\n      gap: 4px; cursor: pointer; transition: all .15s ease;\n      font-size: 12px; font-weight: 600;\n    }\n    .photo-tile:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }\n    .photo-tile svg { width: 18px; height: 18px; }\n    .photo-tile.added {\n      border-style: solid; background: var(--brand-pale);\n      border-color: var(--brand); color: var(--brand-dark);\n    }\n    .photo-tile.added svg { color: var(--brand); }\n\n    /* ===== Shared-space simple note section ===== */\n    .shared-note {\n      padding: 4px 0 8px;\n      color: var(--text-muted); font-size: 13px;\n      margin-bottom: 10px;\n    }\n    .shared-note strong { color: var(--text); }\n\n    /* ===== Keys & items ===== */\n    .keys-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;\n      margin-top: 4px;\n    }\n    @media (max-width: 720px) { .keys-grid { grid-template-columns: 1fr; } }\n    .key-row {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border: 1px solid var(--border);\n      border-radius: var(--radius); background: var(--surface-subtle);\n      transition: all .12s ease; cursor: pointer;\n    }\n    .key-row:hover { border-color: var(--brand-bright); }\n    .key-row.checked { background: var(--brand-pale); border-color: var(--brand); }\n    .key-check {\n      width: 22px; height: 22px; border-radius: 6px;\n      border: 1.5px solid var(--border-strong); background: var(--surface);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; flex-shrink: 0;\n    }\n    .key-row.checked .key-check { background: var(--brand); border-color: var(--brand); }\n    .key-check svg { width: 12px; height: 12px; opacity: 0; }\n    .key-row.checked .key-check svg { opacity: 1; }\n    .key-label { flex: 1; font-weight: 600; font-size: 13px; color: var(--text); }\n    .key-count {\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      display: flex; align-items: center; gap: 4px;\n    }\n    .count-btn {\n      width: 24px; height: 24px; border-radius: 6px;\n      background: var(--surface); border: 1px solid var(--border-strong);\n      color: var(--text-muted); font-weight: 700;\n      display: inline-flex; align-items: center; justify-content: center;\n      transition: all .12s ease;\n    }\n    .count-btn:hover { background: var(--brand); color: #fff; border-color: var(--brand); }\n    .count-num { min-width: 18px; text-align: center; font-variant-numeric: tabular-nums; color: var(--text); }\n\n    .smoke-row {\n      display: flex; align-items: center; gap: 14px; margin-top: 14px;\n      padding: 14px 16px; border: 1px solid var(--border);\n      border-radius: var(--radius); background: var(--surface-subtle);\n      cursor: pointer; transition: all .12s ease;\n    }\n    .smoke-row:hover { border-color: var(--brand-bright); }\n    .smoke-row.checked { background: var(--brand-pale); border-color: var(--brand); }\n    .smoke-icon {\n      width: 34px; height: 34px; border-radius: 8px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .smoke-row.checked .smoke-icon { background: var(--brand); color: #fff; }\n    .smoke-icon svg { width: 18px; height: 18px; }\n    .smoke-text { flex: 1; }\n    .smoke-title { font-weight: 700; font-size: 13px; color: var(--text); }\n    .smoke-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }\n\n    /* ===== Signature blocks ===== */\n    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 6px; }\n    @media (max-width: 720px) { .sig-grid { grid-template-columns: 1fr; } }\n    .sig-block {\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      padding: 18px; background: var(--surface-subtle);\n    }\n    .sig-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }\n    .sig-line {\n      border-bottom: 1.5px solid var(--border-strong);\n      min-height: 72px; margin-bottom: 8px; padding: 8px 4px 4px;\n      font-family: 'Caveat', cursive; font-size: 36px; line-height: 1; color: var(--text);\n      display: flex; align-items: flex-end;\n    }\n    .sig-line.empty { color: var(--text-faint); }\n    .sig-meta { font-size: 12px; color: var(--text-muted); }\n    .sig-meta strong { color: var(--text); }\n    .sig-input {\n      width: 100%; padding: 9px 12px; font-size: 13px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n      background: var(--surface); outline: none; margin-top: 8px;\n      transition: all .15s ease;\n    }\n    .sig-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n    .sig-block.landlord .sig-line { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; font-style: italic; color: var(--text-faint); }\n\n    /* ===== Open note ===== */\n    .open-note {\n      width: 100%; padding: 14px; font-size: 14px; line-height: 1.5;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); outline: none; min-height: 100px;\n      resize: vertical; transition: all .15s ease;\n    }\n    .open-note:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }\n\n    /* ===== Agreement + submit ===== */\n    .agree-row {\n      display: flex; align-items: flex-start; gap: 12px; margin-top: 20px;\n      padding: 14px 16px; border: 1px solid var(--border);\n      border-radius: var(--radius); background: var(--surface-subtle);\n      cursor: pointer; transition: all .12s ease;\n    }\n    .agree-row:hover { border-color: var(--brand-bright); }\n    .agree-row.checked { background: var(--brand-pale); border-color: var(--brand); }\n    .agree-check {\n      width: 22px; height: 22px; border-radius: 6px;\n      border: 1.5px solid var(--border-strong); background: var(--surface);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; flex-shrink: 0; margin-top: 1px;\n    }\n    .agree-row.checked .agree-check { background: var(--brand); border-color: var(--brand); }\n    .agree-check svg { width: 12px; height: 12px; opacity: 0; }\n    .agree-row.checked .agree-check svg { opacity: 1; }\n    .agree-text { font-size: 13px; color: var(--text); font-weight: 500; }\n    .agree-text strong { font-weight: 700; }\n\n    .submit-bar {\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 14px; margin-top: 22px; padding: 18px 22px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);\n      flex-wrap: wrap;\n    }\n    .submit-gate { font-size: 13px; color: var(--text-muted); }\n    .submit-gate strong { color: var(--text); }\n    .submit-gate.ready { color: var(--brand-dark); }\n    .submit-gate.ready strong { color: var(--brand); }\n    .btn-submit {\n      background: var(--brand); color: #fff;\n      padding: 13px 26px; border-radius: 100px;\n      font-weight: 700; font-size: 14px;\n      display: inline-flex; align-items: center; gap: 8px;\n      transition: all .15s ease;\n      box-shadow: 0 6px 18px rgba(20,77,49,0.24);\n    }\n    .btn-submit:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }\n    .btn-submit:disabled { background: var(--border-strong); color: var(--text-faint); box-shadow: none; cursor: not-allowed; }\n    .btn-submit svg { width: 15px; height: 15px; }\n\n    /* ===== Overlay ===== */\n    .overlay {\n      position: fixed; inset: 0; background: rgba(14,56,34,0.45);\n      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);\n      display: none; align-items: center; justify-content: center;\n      padding: 24px; z-index: 50;\n    }\n    .overlay.open { display: flex; animation: fadeIn .2s ease; }\n    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n    .overlay-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 36px; max-width: 520px; width: 100%;\n      box-shadow: var(--shadow-lg);\n      animation: popIn .25s ease;\n    }\n    @keyframes popIn { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n    .ov-icon {\n      width: 64px; height: 64px; border-radius: 18px;\n      background: linear-gradient(135deg, var(--brand), var(--brand-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      margin-bottom: 18px; box-shadow: 0 12px 32px rgba(20,77,49,0.28);\n    }\n    .ov-icon svg { width: 30px; height: 30px; }\n    .ov-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .ov-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 22px; line-height: 1.55; }\n    .ov-sub strong { color: var(--text); }\n    .ov-timeline { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }\n    .ov-step {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border-radius: var(--radius);\n      background: var(--surface-subtle); border: 1px solid var(--border);\n    }\n    .ov-step.done { background: var(--brand-pale); border-color: var(--brand-soft); }\n    .ov-dot {\n      width: 24px; height: 24px; border-radius: 50%;\n      background: var(--surface); border: 1.5px solid var(--border-strong);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; flex-shrink: 0;\n    }\n    .ov-step.done .ov-dot { background: var(--brand); border-color: var(--brand); }\n    .ov-dot svg { width: 12px; height: 12px; opacity: 0; }\n    .ov-step.done .ov-dot svg { opacity: 1; }\n    .ov-step-body { flex: 1; min-width: 0; }\n    .ov-step-label { font-weight: 700; font-size: 13px; color: var(--text); }\n    .ov-step-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }\n    .ov-actions { display: flex; gap: 10px; }\n    .btn-ov-primary {\n      flex: 1; background: var(--brand); color: #fff;\n      padding: 12px 18px; border-radius: 100px;\n      font-weight: 700; font-size: 13px; text-align: center;\n      transition: all .15s ease;\n    }\n    .btn-ov-primary:hover { background: var(--brand-dark); }\n    .btn-ov-ghost {\n      flex: 1; background: var(--surface-subtle); color: var(--text);\n      padding: 12px 18px; border-radius: 100px;\n      font-weight: 600; font-size: 13px; text-align: center;\n      border: 1px solid var(--border);\n      transition: all .15s ease;\n    }\n    .btn-ov-ghost:hover { background: var(--brand-pale); border-color: var(--brand); color: var(--brand-dark); }\n\n    @media (max-width: 960px) {\n      .wrap { grid-template-columns: 1fr; }\n      .sidebar { position: static; }\n      .status-banner { flex-wrap: wrap; }\n      .sb-who { text-align: left; }\n    }\n  ";

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
        <div className="tb-brand-sub">Move-in inspection</div>
      </div>
    </div>
    <div className="tb-right">
      <a className="tb-back" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Portal
      </a>
      <span>Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a></span>
    </div>
  </header>

  
  <div className="status-banner">
    <div className="sb-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" /></svg>
    </div>
    <div className="sb-text">
      <div className="sb-crumbs">Move-in inspection</div>
      <div className="sb-title">May 1, 2026 <span>·</span> Room C <span>·</span> 908 Lee Drive NW, Huntsville AL</div>
    </div>
    <div className="sb-who">
      <strong>Jordan Blake</strong>
      Tenant · Lease #BB-2026-0501
    </div>
  </div>

  <main className="wrap">

    
    <aside className="sidebar">
      <div className="side-eyebrow">Inspection progress</div>
      <div className="side-title">Walk the rooms</div>
      <div className="side-sub">Rate everything you see. Tap a room to jump there.</div>

      <div className="overall-ring">
        <div className="ring-num" id="overallPct">0%</div>
        <div className="ring-meta">
          Overall complete
          <small><span id="overallRated">0</span> of <span id="overallTotal">28</span> items rated</small>
        </div>
      </div>

      <div className="room-progress-list" id="roomProgress" />

      <div className="sidebar-foot">
        <strong>Be specific, not perfect.</strong>
        Even "small stain on baseboard" helps us both. This page autosaves as you go.
      </div>
    </aside>

    
    <section className="main">

      <div className="page-head">
        <div className="page-kicker">Day 1 · Move-in walkthrough</div>
        <h1>Log the condition of your new place.</h1>
        <p>This is your record of how the room looked the day you moved in. At move-out, we compare and return your deposit. <strong>Be honest — note anything that's already damaged, dirty, or not working.</strong> That protects you.</p>
      </div>

      
      <div id="sections" />

      
      <div className="section open" id="keysSection">
        <div className="sec-head" data-toggle="keysSection">
          <div className="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4" /><path d="M10.85 12.15L19 4" /><path d="M18 5l3 3" /><path d="M15 8l3 3" /></svg>
          </div>
          <div className="sec-body-head">
            <div className="sec-title">Keys & items received</div>
            <div className="sec-sub">Confirm what was handed off at move-in.</div>
          </div>
          <div className="sec-count" id="keysCount">0 of 6</div>
          <div className="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
        <div className="sec-body">
          <div className="keys-grid" id="keysGrid" />

          <div className="smoke-row" id="smokeRow">
            <div className="smoke-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="3" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21" /><line x1="3" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21" y2="12" /></svg>
            </div>
            <div className="smoke-text">
              <div className="smoke-title">Smoke & CO detectors tested and beeped</div>
              <div className="smoke-sub">Press and hold the test button on each detector. All units confirmed working.</div>
            </div>
            <div className="key-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </div>
        </div>
      </div>

      
      <div className="section open" id="notesSection">
        <div className="sec-head" data-toggle="notesSection">
          <div className="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
          </div>
          <div className="sec-body-head">
            <div className="sec-title">Anything else you noticed?</div>
            <div className="sec-sub">Optional · smells, sounds, previous tenant's leftovers, anything.</div>
          </div>
          <div className="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
        <div className="sec-body">
          <textarea className="open-note" id="openNote" placeholder="e.g. Slight mildew smell in bathroom when I first opened the door, went away after airing out. Kitchen drawer liner looks used but clean. Porch light bulb burned out." />
        </div>
      </div>

      
      <div className="section open" id="sigSection">
        <div className="sec-head" data-toggle="sigSection">
          <div className="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17c3-2 6 2 9 0s6-2 9 0" /><path d="M3 12c3-2 6 2 9 0s6-2 9 0" /><path d="M3 7c3-2 6 2 9 0s6-2 9 0" /></svg>
          </div>
          <div className="sec-body-head">
            <div className="sec-title">Sign off</div>
            <div className="sec-sub">You sign now. Harrison reviews and countersigns within 24 hours.</div>
          </div>
          <div className="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
        <div className="sec-body">
          <div className="sig-grid">
            <div className="sig-block">
              <div className="sig-label">Tenant signature</div>
              <div className="sig-line empty" id="sigPreview">Type your full name below</div>
              <div className="sig-meta">Jordan Blake · <strong id="sigDate">Apr 14, 2026</strong></div>
              <input className="sig-input" type="text" id="sigInput" placeholder="Type your full legal name" autoComplete="off" />
            </div>
            <div className="sig-block landlord">
              <div className="sig-label">Landlord signature</div>
              <div className="sig-line">Harrison will sign after reviewing</div>
              <div className="sig-meta">Harrison Cooper · <strong>Pending review</strong></div>
              <div style={{marginTop: "8px", fontSize: "12px", color: "var(--text-muted)"}}>You'll get an email when this is countersigned.</div>
            </div>
          </div>

          <div className="agree-row" id="agreeRow">
            <div className="agree-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="agree-text">
              <strong>I inspected the property and this accurately reflects its condition on move-in.</strong>
              I understand this document will be used as the baseline when my deposit is returned at move-out.
            </div>
          </div>
        </div>
      </div>

      
      <div className="submit-bar">
        <div className="submit-gate" id="submitGate">
          <strong>Almost there.</strong> Rate at least one item in each room, sign, and check the agreement.
        </div>
        <button className="btn-submit" id="submitBtn" disabled>
          File inspection
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>

    </section>
  </main>

  
  <div className="overlay" id="overlay">
    <div className="overlay-card">
      <div className="ov-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div className="ov-title">Inspection filed</div>
      <div className="ov-sub">A PDF copy is on its way to <strong>jordan@example.com</strong>. Your deposit is now protected by what you just documented.</div>

      <div className="ov-timeline">
        <div className="ov-step done">
          <div className="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="ov-step-body">
            <div className="ov-step-label">Inspection filed</div>
            <div className="ov-step-meta">Today · Apr 14, 2026</div>
          </div>
        </div>
        <div className="ov-step">
          <div className="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="ov-step-body">
            <div className="ov-step-label">Harrison countersigns</div>
            <div className="ov-step-meta">Within 24 hours</div>
          </div>
        </div>
        <div className="ov-step">
          <div className="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="ov-step-body">
            <div className="ov-step-label">Move-out comparison</div>
            <div className="ov-step-meta">When your lease ends</div>
          </div>
        </div>
        <div className="ov-step">
          <div className="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="ov-step-body">
            <div className="ov-step-label">Deposit returned</div>
            <div className="ov-step-meta">Within 35 days of move-out · per AL §35-9A-201</div>
          </div>
        </div>
      </div>

      <div className="ov-actions">
        <a className="btn-ov-ghost" href="portal.html">Back to portal</a>
        <button className="btn-ov-primary" id="downloadPdf">Download PDF</button>
      </div>
    </div>
  </div>

  

    </>
  );
}
