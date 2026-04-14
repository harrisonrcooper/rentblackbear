"use client";

// Mock ported verbatim from ~/Desktop/tenantory/inspection.html.
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

    /* ===== Workspace brand tokens (Black Bear Rentals — intentionally NOT Tenantory Flagship) ===== */
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
      --blue: #2b5db7;
      --blue-bg: rgba(43,93,183,0.10);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9);
      padding: 0 32px; height: 72px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 0 rgba(0,0,0,0.04);
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--brand-bright), var(--accent));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: #fff;
    }
    .tb-logo svg { width: 22px; height: 22px; }
    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }
    .tb-right { display: flex; align-items: center; gap: 18px; font-size: 13px; color: rgba(255,255,255,0.75); }
    .tb-right a { color: #fff; font-weight: 600; }
    .tb-right a:hover { text-decoration: underline; }
    .tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 100px; background: rgba(255,255,255,0.08); transition: all .15s ease; }
    .tb-back:hover { background: rgba(255,255,255,0.16); text-decoration: none; }
    .tb-back svg { width: 14px; height: 14px; }

    /* ===== Status banner ===== */
    .status-banner {
      background: linear-gradient(135deg, var(--brand-pale), var(--brand-soft));
      border-bottom: 1px solid var(--brand-soft);
      padding: 18px 32px;
      display: flex; align-items: center; gap: 16px;
    }
    .sb-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--brand); color: #fff;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 0 4px 12px rgba(20,77,49,0.2);
    }
    .sb-icon svg { width: 22px; height: 22px; }
    .sb-text { flex: 1; min-width: 0; }
    .sb-crumbs { font-size: 11px; color: var(--brand-dark); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
    .sb-title { font-size: 16px; font-weight: 700; color: var(--text); }
    .sb-title span { color: var(--text-muted); font-weight: 500; }
    .sb-who { text-align: right; font-size: 12px; color: var(--text-muted); }
    .sb-who strong { display: block; color: var(--text); font-size: 14px; font-weight: 700; }

    /* ===== Layout ===== */
    .wrap {
      max-width: 1200px; margin: 0 auto; padding: 28px 32px 80px;
      display: grid; grid-template-columns: 300px 1fr; gap: 28px; align-items: flex-start;
    }

    /* ===== Sidebar ===== */
    .sidebar {
      position: sticky; top: 20px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      box-shadow: var(--shadow-sm);
    }
    .side-eyebrow { font-size: 11px; font-weight: 700; color: var(--brand); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
    .side-title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }
    .side-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 18px; }
    .overall-ring {
      display: flex; align-items: center; gap: 14px;
      padding: 14px; background: var(--brand-pale);
      border-radius: var(--radius); margin-bottom: 18px;
      border: 1px solid var(--brand-soft);
    }
    .ring-num { font-size: 26px; font-weight: 800; color: var(--brand-dark); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    .ring-meta { font-size: 12px; color: var(--brand-dark); font-weight: 600; line-height: 1.3; }
    .ring-meta small { display: block; color: var(--text-muted); font-weight: 500; margin-top: 2px; }

    .room-progress-list { display: flex; flex-direction: column; gap: 6px; }
    .rpi {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: var(--radius);
      background: var(--surface-subtle); border: 1px solid var(--border);
      cursor: pointer; transition: all .15s ease; text-align: left;
      width: 100%;
    }
    .rpi:hover { border-color: var(--brand-bright); background: var(--brand-pale); }
    .rpi.done { background: var(--green-bg); border-color: var(--brand-soft); }
    .rpi-check {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--surface); border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      color: #fff;
    }
    .rpi.done .rpi-check { background: var(--brand); border-color: var(--brand); }
    .rpi-check svg { width: 12px; height: 12px; opacity: 0; }
    .rpi.done .rpi-check svg { opacity: 1; }
    .rpi-body { flex: 1; min-width: 0; }
    .rpi-label { font-weight: 600; font-size: 13px; color: var(--text); }
    .rpi-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; font-variant-numeric: tabular-nums; }

    .sidebar-foot {
      margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border);
      font-size: 11px; color: var(--text-muted); line-height: 1.5;
    }
    .sidebar-foot strong { color: var(--text); display: block; margin-bottom: 4px; font-size: 12px; }

    /* ===== Main content ===== */
    .main { min-width: 0; }
    .page-head { margin-bottom: 22px; }
    .page-kicker { font-size: 11px; font-weight: 700; color: var(--brand); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
    .page-head h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.15; }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
    .page-head p strong { color: var(--text); }

    /* ===== Room section ===== */
    .section {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); margin-bottom: 14px;
      box-shadow: var(--shadow-sm); overflow: hidden;
    }
    .sec-head {
      display: flex; align-items: center; gap: 14px;
      padding: 18px 22px; cursor: pointer;
      transition: background .15s ease;
    }
    .sec-head:hover { background: var(--surface-subtle); }
    .section.open .sec-head { border-bottom: 1px solid var(--border); }
    .sec-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .sec-icon svg { width: 20px; height: 20px; }
    .sec-body-head { flex: 1; min-width: 0; }
    .sec-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
    .sec-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .sec-count {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      background: var(--surface-subtle); border: 1px solid var(--border);
      padding: 4px 10px; border-radius: 100px; font-variant-numeric: tabular-nums;
    }
    .sec-count.done { color: var(--brand-dark); background: var(--brand-pale); border-color: var(--brand-soft); }
    .sec-chev {
      width: 28px; height: 28px; border-radius: 8px;
      background: var(--surface-subtle); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s ease;
    }
    .sec-chev svg { width: 14px; height: 14px; }
    .section.open .sec-chev { transform: rotate(180deg); }

    .sec-body { display: none; padding: 6px 22px 22px; }
    .section.open .sec-body { display: block; }

    /* ===== Item row ===== */
    .item {
      padding: 16px 0; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: 1fr; gap: 12px;
    }
    .item:last-child { border-bottom: none; padding-bottom: 6px; }
    .item-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .item-name { font-weight: 700; font-size: 14px; color: var(--text); display: flex; align-items: center; gap: 8px; }
    .item-name small { color: var(--text-muted); font-weight: 500; font-size: 12px; }

    .rating-pills { display: flex; gap: 6px; flex-wrap: wrap; }
    .rpill {
      font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 100px;
      background: var(--surface-subtle); border: 1.5px solid var(--border);
      color: var(--text-muted); cursor: pointer; transition: all .12s ease;
      display: inline-flex; align-items: center; gap: 6px;
      white-space: nowrap;
    }
    .rpill:hover { border-color: var(--border-strong); color: var(--text); }
    .rpill .rdot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .55; }
    .rpill[data-val="excellent"].active { background: var(--green-bg); border-color: var(--green); color: var(--green-dark); }
    .rpill[data-val="good"].active     { background: var(--blue-bg);  border-color: var(--blue);  color: var(--blue); }
    .rpill[data-val="fair"].active     { background: var(--amber-bg); border-color: var(--amber); color: var(--amber); }
    .rpill[data-val="attn"].active     { background: var(--red-bg);   border-color: var(--red);   color: var(--red); }
    .rpill.active .rdot { opacity: 1; }

    .item-extras { display: grid; grid-template-columns: 1fr 160px; gap: 12px; align-items: start; }
    @media (max-width: 720px) { .item-extras { grid-template-columns: 1fr; } }

    .note-input {
      width: 100%; padding: 10px 12px; font-size: 13px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); outline: none; transition: all .15s ease;
      min-height: 64px; resize: vertical; line-height: 1.45;
    }
    .note-input:focus { border-color: var(--brand); background: var(--surface); box-shadow: 0 0 0 3px var(--brand-pale); }
    .note-input::placeholder { color: var(--text-faint); }

    .photo-tile {
      height: 64px; border-radius: var(--radius);
      border: 1.5px dashed var(--border-strong);
      background: var(--surface-subtle); color: var(--text-muted);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 4px; cursor: pointer; transition: all .15s ease;
      font-size: 12px; font-weight: 600;
    }
    .photo-tile:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-pale); }
    .photo-tile svg { width: 18px; height: 18px; }
    .photo-tile.added {
      border-style: solid; background: var(--brand-pale);
      border-color: var(--brand); color: var(--brand-dark);
    }
    .photo-tile.added svg { color: var(--brand); }

    /* ===== Shared-space simple note section ===== */
    .shared-note {
      padding: 4px 0 8px;
      color: var(--text-muted); font-size: 13px;
      margin-bottom: 10px;
    }
    .shared-note strong { color: var(--text); }

    /* ===== Keys & items ===== */
    .keys-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
      margin-top: 4px;
    }
    @media (max-width: 720px) { .keys-grid { grid-template-columns: 1fr; } }
    .key-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--surface-subtle);
      transition: all .12s ease; cursor: pointer;
    }
    .key-row:hover { border-color: var(--brand-bright); }
    .key-row.checked { background: var(--brand-pale); border-color: var(--brand); }
    .key-check {
      width: 22px; height: 22px; border-radius: 6px;
      border: 1.5px solid var(--border-strong); background: var(--surface);
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }
    .key-row.checked .key-check { background: var(--brand); border-color: var(--brand); }
    .key-check svg { width: 12px; height: 12px; opacity: 0; }
    .key-row.checked .key-check svg { opacity: 1; }
    .key-label { flex: 1; font-weight: 600; font-size: 13px; color: var(--text); }
    .key-count {
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      display: flex; align-items: center; gap: 4px;
    }
    .count-btn {
      width: 24px; height: 24px; border-radius: 6px;
      background: var(--surface); border: 1px solid var(--border-strong);
      color: var(--text-muted); font-weight: 700;
      display: inline-flex; align-items: center; justify-content: center;
      transition: all .12s ease;
    }
    .count-btn:hover { background: var(--brand); color: #fff; border-color: var(--brand); }
    .count-num { min-width: 18px; text-align: center; font-variant-numeric: tabular-nums; color: var(--text); }

    .smoke-row {
      display: flex; align-items: center; gap: 14px; margin-top: 14px;
      padding: 14px 16px; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--surface-subtle);
      cursor: pointer; transition: all .12s ease;
    }
    .smoke-row:hover { border-color: var(--brand-bright); }
    .smoke-row.checked { background: var(--brand-pale); border-color: var(--brand); }
    .smoke-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .smoke-row.checked .smoke-icon { background: var(--brand); color: #fff; }
    .smoke-icon svg { width: 18px; height: 18px; }
    .smoke-text { flex: 1; }
    .smoke-title { font-weight: 700; font-size: 13px; color: var(--text); }
    .smoke-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

    /* ===== Signature blocks ===== */
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 6px; }
    @media (max-width: 720px) { .sig-grid { grid-template-columns: 1fr; } }
    .sig-block {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 18px; background: var(--surface-subtle);
    }
    .sig-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
    .sig-line {
      border-bottom: 1.5px solid var(--border-strong);
      min-height: 72px; margin-bottom: 8px; padding: 8px 4px 4px;
      font-family: 'Caveat', cursive; font-size: 36px; line-height: 1; color: var(--text);
      display: flex; align-items: flex-end;
    }
    .sig-line.empty { color: var(--text-faint); }
    .sig-meta { font-size: 12px; color: var(--text-muted); }
    .sig-meta strong { color: var(--text); }
    .sig-input {
      width: 100%; padding: 9px 12px; font-size: 13px;
      border: 1px solid var(--border); border-radius: var(--radius);
      background: var(--surface); outline: none; margin-top: 8px;
      transition: all .15s ease;
    }
    .sig-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }
    .sig-block.landlord .sig-line { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; font-style: italic; color: var(--text-faint); }

    /* ===== Open note ===== */
    .open-note {
      width: 100%; padding: 14px; font-size: 14px; line-height: 1.5;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); outline: none; min-height: 100px;
      resize: vertical; transition: all .15s ease;
    }
    .open-note:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-pale); }

    /* ===== Agreement + submit ===== */
    .agree-row {
      display: flex; align-items: flex-start; gap: 12px; margin-top: 20px;
      padding: 14px 16px; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--surface-subtle);
      cursor: pointer; transition: all .12s ease;
    }
    .agree-row:hover { border-color: var(--brand-bright); }
    .agree-row.checked { background: var(--brand-pale); border-color: var(--brand); }
    .agree-check {
      width: 22px; height: 22px; border-radius: 6px;
      border: 1.5px solid var(--border-strong); background: var(--surface);
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0; margin-top: 1px;
    }
    .agree-row.checked .agree-check { background: var(--brand); border-color: var(--brand); }
    .agree-check svg { width: 12px; height: 12px; opacity: 0; }
    .agree-row.checked .agree-check svg { opacity: 1; }
    .agree-text { font-size: 13px; color: var(--text); font-weight: 500; }
    .agree-text strong { font-weight: 700; }

    .submit-bar {
      display: flex; align-items: center; justify-content: space-between;
      gap: 14px; margin-top: 22px; padding: 18px 22px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
    }
    .submit-gate { font-size: 13px; color: var(--text-muted); }
    .submit-gate strong { color: var(--text); }
    .submit-gate.ready { color: var(--brand-dark); }
    .submit-gate.ready strong { color: var(--brand); }
    .btn-submit {
      background: var(--brand); color: #fff;
      padding: 13px 26px; border-radius: 100px;
      font-weight: 700; font-size: 14px;
      display: inline-flex; align-items: center; gap: 8px;
      transition: all .15s ease;
      box-shadow: 0 6px 18px rgba(20,77,49,0.24);
    }
    .btn-submit:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 10px 24px rgba(20,77,49,0.3); }
    .btn-submit:disabled { background: var(--border-strong); color: var(--text-faint); box-shadow: none; cursor: not-allowed; }
    .btn-submit svg { width: 15px; height: 15px; }

    /* ===== Overlay ===== */
    .overlay {
      position: fixed; inset: 0; background: rgba(14,56,34,0.45);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      display: none; align-items: center; justify-content: center;
      padding: 24px; z-index: 50;
    }
    .overlay.open { display: flex; animation: fadeIn .2s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .overlay-card {
      background: var(--surface); border-radius: var(--radius-xl);
      padding: 36px; max-width: 520px; width: 100%;
      box-shadow: var(--shadow-lg);
      animation: popIn .25s ease;
    }
    @keyframes popIn { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .ov-icon {
      width: 64px; height: 64px; border-radius: 18px;
      background: linear-gradient(135deg, var(--brand), var(--brand-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      margin-bottom: 18px; box-shadow: 0 12px 32px rgba(20,77,49,0.28);
    }
    .ov-icon svg { width: 30px; height: 30px; }
    .ov-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .ov-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 22px; line-height: 1.55; }
    .ov-sub strong { color: var(--text); }
    .ov-timeline { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
    .ov-step {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: var(--radius);
      background: var(--surface-subtle); border: 1px solid var(--border);
    }
    .ov-step.done { background: var(--brand-pale); border-color: var(--brand-soft); }
    .ov-dot {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--surface); border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }
    .ov-step.done .ov-dot { background: var(--brand); border-color: var(--brand); }
    .ov-dot svg { width: 12px; height: 12px; opacity: 0; }
    .ov-step.done .ov-dot svg { opacity: 1; }
    .ov-step-body { flex: 1; min-width: 0; }
    .ov-step-label { font-weight: 700; font-size: 13px; color: var(--text); }
    .ov-step-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
    .ov-actions { display: flex; gap: 10px; }
    .btn-ov-primary {
      flex: 1; background: var(--brand); color: #fff;
      padding: 12px 18px; border-radius: 100px;
      font-weight: 700; font-size: 13px; text-align: center;
      transition: all .15s ease;
    }
    .btn-ov-primary:hover { background: var(--brand-dark); }
    .btn-ov-ghost {
      flex: 1; background: var(--surface-subtle); color: var(--text);
      padding: 12px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px; text-align: center;
      border: 1px solid var(--border);
      transition: all .15s ease;
    }
    .btn-ov-ghost:hover { background: var(--brand-pale); border-color: var(--brand); color: var(--brand-dark); }

    @media (max-width: 960px) {
      .wrap { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .status-banner { flex-wrap: wrap; }
      .sb-who { text-align: left; }
    }`;

const MOCK_HTML = `<!-- ===== Topbar ===== -->
  <header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Move-in inspection</div>
      </div>
    </div>
    <div class="tb-right">
      <a class="tb-back" href="portal.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Portal
      </a>
      <span>Questions? <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a></span>
    </div>
  </header>

  <!-- ===== Status banner ===== -->
  <div class="status-banner">
    <div class="sb-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z"/></svg>
    </div>
    <div class="sb-text">
      <div class="sb-crumbs">Move-in inspection</div>
      <div class="sb-title">May 1, 2026 <span>·</span> Room C <span>·</span> 908 Lee Drive NW, Huntsville AL</div>
    </div>
    <div class="sb-who">
      <strong>Jordan Blake</strong>
      Tenant · Lease #BB-2026-0501
    </div>
  </div>

  <main class="wrap">

    <!-- ===== Sidebar ===== -->
    <aside class="sidebar">
      <div class="side-eyebrow">Inspection progress</div>
      <div class="side-title">Walk the rooms</div>
      <div class="side-sub">Rate everything you see. Tap a room to jump there.</div>

      <div class="overall-ring">
        <div class="ring-num" id="overallPct">0%</div>
        <div class="ring-meta">
          Overall complete
          <small><span id="overallRated">0</span> of <span id="overallTotal">28</span> items rated</small>
        </div>
      </div>

      <div class="room-progress-list" id="roomProgress">
        <!-- populated by JS -->
      </div>

      <div class="sidebar-foot">
        <strong>Be specific, not perfect.</strong>
        Even "small stain on baseboard" helps us both. This page autosaves as you go.
      </div>
    </aside>

    <!-- ===== Main content ===== -->
    <section class="main">

      <div class="page-head">
        <div class="page-kicker">Day 1 · Move-in walkthrough</div>
        <h1>Log the condition of your new place.</h1>
        <p>This is your record of how the room looked the day you moved in. At move-out, we compare and return your deposit. <strong>Be honest — note anything that's already damaged, dirty, or not working.</strong> That protects you.</p>
      </div>

      <!-- Room sections injected by JS below -->
      <div id="sections"></div>

      <!-- ===== Keys & items received ===== -->
      <div class="section open" id="keysSection">
        <div class="sec-head" data-toggle="keysSection">
          <div class="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.85 12.15L19 4"/><path d="M18 5l3 3"/><path d="M15 8l3 3"/></svg>
          </div>
          <div class="sec-body-head">
            <div class="sec-title">Keys & items received</div>
            <div class="sec-sub">Confirm what was handed off at move-in.</div>
          </div>
          <div class="sec-count" id="keysCount">0 of 6</div>
          <div class="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="sec-body">
          <div class="keys-grid" id="keysGrid"></div>

          <div class="smoke-row" id="smokeRow">
            <div class="smoke-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="3" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21" y2="12"/></svg>
            </div>
            <div class="smoke-text">
              <div class="smoke-title">Smoke & CO detectors tested and beeped</div>
              <div class="smoke-sub">Press and hold the test button on each detector. All units confirmed working.</div>
            </div>
            <div class="key-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Anything else ===== -->
      <div class="section open" id="notesSection">
        <div class="sec-head" data-toggle="notesSection">
          <div class="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
          </div>
          <div class="sec-body-head">
            <div class="sec-title">Anything else you noticed?</div>
            <div class="sec-sub">Optional · smells, sounds, previous tenant's leftovers, anything.</div>
          </div>
          <div class="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="sec-body">
          <textarea class="open-note" id="openNote" placeholder="e.g. Slight mildew smell in bathroom when I first opened the door, went away after airing out. Kitchen drawer liner looks used but clean. Porch light bulb burned out."></textarea>
        </div>
      </div>

      <!-- ===== Signatures ===== -->
      <div class="section open" id="sigSection">
        <div class="sec-head" data-toggle="sigSection">
          <div class="sec-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c3-2 6 2 9 0s6-2 9 0"/><path d="M3 12c3-2 6 2 9 0s6-2 9 0"/><path d="M3 7c3-2 6 2 9 0s6-2 9 0"/></svg>
          </div>
          <div class="sec-body-head">
            <div class="sec-title">Sign off</div>
            <div class="sec-sub">You sign now. Harrison reviews and countersigns within 24 hours.</div>
          </div>
          <div class="sec-chev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="sec-body">
          <div class="sig-grid">
            <div class="sig-block">
              <div class="sig-label">Tenant signature</div>
              <div class="sig-line empty" id="sigPreview">Type your full name below</div>
              <div class="sig-meta">Jordan Blake · <strong id="sigDate">Apr 14, 2026</strong></div>
              <input class="sig-input" type="text" id="sigInput" placeholder="Type your full legal name" autocomplete="off">
            </div>
            <div class="sig-block landlord">
              <div class="sig-label">Landlord signature</div>
              <div class="sig-line">Harrison will sign after reviewing</div>
              <div class="sig-meta">Harrison Cooper · <strong>Pending review</strong></div>
              <div style="margin-top:8px; font-size:12px; color:var(--text-muted);">You'll get an email when this is countersigned.</div>
            </div>
          </div>

          <div class="agree-row" id="agreeRow">
            <div class="agree-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="agree-text">
              <strong>I inspected the property and this accurately reflects its condition on move-in.</strong>
              I understand this document will be used as the baseline when my deposit is returned at move-out.
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Submit ===== -->
      <div class="submit-bar">
        <div class="submit-gate" id="submitGate">
          <strong>Almost there.</strong> Rate at least one item in each room, sign, and check the agreement.
        </div>
        <button class="btn-submit" id="submitBtn" disabled>
          File inspection
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

    </section>
  </main>

  <!-- ===== Success overlay ===== -->
  <div class="overlay" id="overlay">
    <div class="overlay-card">
      <div class="ov-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="ov-title">Inspection filed</div>
      <div class="ov-sub">A PDF copy is on its way to <strong>jordan@example.com</strong>. Your deposit is now protected by what you just documented.</div>

      <div class="ov-timeline">
        <div class="ov-step done">
          <div class="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="ov-step-body">
            <div class="ov-step-label">Inspection filed</div>
            <div class="ov-step-meta">Today · Apr 14, 2026</div>
          </div>
        </div>
        <div class="ov-step">
          <div class="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="ov-step-body">
            <div class="ov-step-label">Harrison countersigns</div>
            <div class="ov-step-meta">Within 24 hours</div>
          </div>
        </div>
        <div class="ov-step">
          <div class="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="ov-step-body">
            <div class="ov-step-label">Move-out comparison</div>
            <div class="ov-step-meta">When your lease ends</div>
          </div>
        </div>
        <div class="ov-step">
          <div class="ov-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="ov-step-body">
            <div class="ov-step-label">Deposit returned</div>
            <div class="ov-step-meta">Within 35 days of move-out · per AL §35-9A-201</div>
          </div>
        </div>
      </div>

      <div class="ov-actions">
        <a class="btn-ov-ghost" href="portal.html">Back to portal</a>
        <button class="btn-ov-primary" id="downloadPdf">Download PDF</button>
      </div>
    </div>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
