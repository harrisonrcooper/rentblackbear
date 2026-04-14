"use client";

// Mock ported verbatim from ~/Desktop/tenantory/lease-amendment.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text);
      background: var(--surface-alt);
      line-height: 1.5;
      font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    img, svg { display: block; max-width: 100%; }
    input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }

    :root {
      --navy: #2F3E83;
      --navy-dark: #1e2a5e;
      --navy-darker: #14204a;
      --blue: #1251AD;
      --blue-bright: #1665D8;
      --blue-pale: #eef3ff;
      --pink: #FF4998;
      --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36;
      --text-muted: #5a6478;
      --text-faint: #8a93a5;
      --surface: #ffffff;
      --surface-alt: #f7f9fc;
      --surface-subtle: #fafbfd;
      --border: #e3e8ef;
      --border-strong: #c9d1dd;
      --gold: #f5a623;
      --green: #1ea97c;
      --green-dark: #138a60;
      --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --red-bg: rgba(214,69,69,0.12);
      --orange: #ea8c3a;
      --orange-bg: rgba(234,140,58,0.12);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
    }

    /* ===== Layout shell ===== */
    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar ===== */
    .sidebar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.75);
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sb-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(18,81,173,0.3);
    }
    .sb-logo svg { width: 18px; height: 18px; color: #fff; }
    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }
    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
    .sb-section-label {
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.14em;
      padding: 8px 12px 10px;
    }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      color: rgba(255,255,255,0.75);
      transition: all 0.15s ease;
      position: relative;
    }
    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sb-nav-item.active {
      background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08));
      color: #fff;
    }
    .sb-nav-item.active::before {
      content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px;
      width: 3px; background: var(--pink); border-radius: 0 3px 3px 0;
    }
    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }
    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }
    .sb-nav-badge {
      margin-left: auto; background: var(--pink); color: #fff;
      font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px;
    }
    .sb-nav-count {
      margin-left: auto; background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      font-size: 11px; font-weight: 600;
      padding: 2px 7px; border-radius: 100px;
    }
    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .sb-user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease; cursor: pointer;
    }
    .sb-user-card:hover { background: rgba(255,255,255,0.08); }
    .sb-user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 12px;
    }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }
    .sb-user-action { color: rgba(255,255,255,0.5); }

    /* ===== Main ===== */
    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); }

    /* Topbar */
    .topbar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; flex-shrink: 0;
    }
    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
    .topbar-breadcrumb a:hover { color: var(--blue); }
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px;
      min-width: 280px; color: var(--text-faint);
      transition: all 0.15s ease;
    }
    .topbar-search:focus-within { border-color: var(--blue); background: var(--surface); }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 13px; color: var(--text);
    }
    .topbar-search kbd {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; background: var(--surface); border: 1px solid var(--border);
      padding: 2px 5px; border-radius: 4px; color: var(--text-faint);
    }
    .topbar-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; position: relative;
    }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot {
      position: absolute; top: 7px; right: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--pink); border: 2px solid #fff;
    }

    /* Content */
    .content { flex: 1; overflow-y: auto; padding: 28px 32px 48px; }

    /* Secondary breadcrumb */
    .subcrumb {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: var(--text-faint);
      font-weight: 500; margin-bottom: 18px;
    }
    .subcrumb a { color: var(--text-muted); }
    .subcrumb a:hover { color: var(--blue); }
    .subcrumb svg { width: 12px; height: 12px; opacity: 0.6; }
    .subcrumb .current { color: var(--text); font-weight: 600; }

    /* Context card */
    .ctx-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      display: grid; grid-template-columns: auto 1fr auto auto auto auto; gap: 28px;
      align-items: center; margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }
    .ctx-avatar {
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      color: #fff; font-weight: 700; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .ctx-title { font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -0.01em; }
    .ctx-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .ctx-sub { font-size: 12.5px; color: var(--text-muted); }
    .ctx-stat-label {
      font-size: 10.5px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
    }
    .ctx-stat-value { font-weight: 700; font-size: 14px; color: var(--text); font-variant-numeric: tabular-nums; }
    .ctx-link {
      font-size: 12.5px; font-weight: 600; color: var(--blue);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .ctx-link:hover { color: var(--navy); }
    .ctx-link svg { width: 12px; height: 12px; }

    /* Page head */
    .page-head { margin-bottom: 26px; }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.025em;
      color: var(--text); margin-bottom: 6px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 6px 20px rgba(255,73,152,0.3); }
    .btn-pink:hover { background: #e8357f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,73,152,0.4); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 14px 28px; font-size: 14px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Two-column layout ===== */
    .two-col {
      display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; align-items: flex-start;
    }

    /* ===== Card ===== */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .card-head {
      padding: 18px 22px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
    }
    .card-head h3 {
      font-size: 15px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em;
    }
    .card-head p { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }
    .card-body { padding: 22px; }

    /* Section spacing for stacked cards */
    .stack { display: flex; flex-direction: column; gap: 16px; }

    /* ===== Amendment type chips ===== */
    .type-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    }
    .type-chip {
      border: 1.5px solid var(--border); border-radius: 12px;
      padding: 14px 14px; display: flex; align-items: flex-start; gap: 11px;
      cursor: pointer; transition: all 0.15s ease;
      background: var(--surface);
      text-align: left; position: relative;
    }
    .type-chip:hover { border-color: var(--blue); background: var(--blue-pale); }
    .type-chip.selected {
      border-color: var(--pink); background: var(--pink-bg);
      box-shadow: 0 2px 10px rgba(255,73,152,0.12);
    }
    .type-chip-icon {
      width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
    }
    .type-chip.selected .type-chip-icon { background: #fff; color: var(--pink); }
    .type-chip-icon svg { width: 16px; height: 16px; }
    .type-chip-body { flex: 1; min-width: 0; }
    .type-chip-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .type-chip-desc { font-size: 11.5px; color: var(--text-muted); line-height: 1.35; }
    .type-chip-check {
      position: absolute; top: 10px; right: 10px;
      width: 18px; height: 18px; border-radius: 50%;
      border: 1.5px solid var(--border-strong); background: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .type-chip.selected .type-chip-check { background: var(--pink); border-color: var(--pink); }
    .type-chip-check svg { width: 10px; height: 10px; color: #fff; opacity: 0; }
    .type-chip.selected .type-chip-check svg { opacity: 1; }

    /* ===== Form fields ===== */
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text); }
    .field-hint { font-size: 11.5px; color: var(--text-faint); }
    .input, .select, .textarea {
      border: 1.5px solid var(--border); border-radius: 10px;
      padding: 10px 13px; font-size: 13.5px; background: var(--surface);
      transition: all 0.15s ease; width: 100%;
      color: var(--text);
    }
    .input:focus, .select:focus, .textarea:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .textarea { resize: vertical; min-height: 84px; line-height: 1.5; font-family: inherit; }
    .select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>");
      background-repeat: no-repeat; background-position: right 12px center; background-size: 14px;
      padding-right: 36px;
    }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

    .input-addon-wrap { position: relative; }
    .input-addon {
      position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
      font-weight: 600; color: var(--text-muted); font-size: 13.5px; pointer-events: none;
    }
    .input-addon-wrap .input { padding-left: 28px; font-variant-numeric: tabular-nums; font-weight: 600; }

    /* Conditional panels */
    .cond {
      display: none;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      overflow: hidden;
    }
    .cond.visible { display: block; animation: slideDown 0.25s ease; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
    .cond-head {
      padding: 14px 20px; background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
    }
    .cond-head-icon {
      width: 28px; height: 28px; border-radius: 7px;
      background: var(--pink-bg); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
    }
    .cond-head-icon svg { width: 14px; height: 14px; }
    .cond-head h4 { font-size: 13.5px; font-weight: 700; color: var(--text); }
    .cond-head-meta { margin-left: auto; font-size: 11.5px; color: var(--text-muted); }
    .cond-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }

    /* Legal notice strip */
    .notice {
      display: flex; gap: 10px; padding: 12px 14px;
      background: var(--blue-pale); border: 1px solid #d7e3fb;
      border-radius: 10px; font-size: 12.5px; color: var(--navy-dark);
      line-height: 1.5;
    }
    .notice svg { width: 16px; height: 16px; flex-shrink: 0; color: var(--blue); margin-top: 1px; }
    .notice strong { color: var(--navy-darker); font-weight: 700; }
    .notice.warn { background: #fff7ed; border-color: #ffe0bf; color: #8a4b10; }
    .notice.warn svg { color: var(--orange); }
    .notice.danger { background: var(--red-bg); border-color: #fbd0d0; color: #8a2525; }
    .notice.danger svg { color: var(--red); }

    /* Split rent toggle */
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-subtle);
    }
    .toggle-row + .toggle-row { margin-top: 8px; }
    .toggle-row-label { font-size: 13px; font-weight: 600; color: var(--text); }
    .toggle-row-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
    .switch { position: relative; width: 38px; height: 22px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .switch-slider {
      position: absolute; inset: 0; background: var(--border-strong);
      border-radius: 100px; cursor: pointer; transition: 0.2s;
    }
    .switch-slider::before {
      content: ""; position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; background: #fff; border-radius: 50%;
      transition: 0.2s; box-shadow: var(--shadow-sm);
    }
    .switch input:checked + .switch-slider { background: var(--pink); }
    .switch input:checked + .switch-slider::before { transform: translateX(16px); }

    /* File upload */
    .upload {
      border: 2px dashed var(--border-strong);
      border-radius: 10px; padding: 18px; text-align: center;
      background: var(--surface-subtle); transition: all 0.15s ease;
      cursor: pointer;
    }
    .upload:hover { border-color: var(--blue); background: var(--blue-pale); }
    .upload svg { width: 22px; height: 22px; color: var(--text-muted); margin: 0 auto 8px; }
    .upload-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .upload-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }

    /* Character count */
    .char-count {
      text-align: right; font-size: 11px; color: var(--text-faint);
      margin-top: -4px; font-variant-numeric: tabular-nums;
    }

    /* Roommate applicant card */
    .applicant-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border: 1px solid var(--border);
      border-radius: 10px; background: var(--surface-subtle);
    }
    .applicant-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }
    .applicant-body { flex: 1; min-width: 0; }
    .applicant-name { font-size: 13px; font-weight: 600; color: var(--text); }
    .applicant-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }

    /* Pill */
    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 3px 9px;
      border-radius: 100px; white-space: nowrap;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill svg { width: 10px; height: 10px; }

    /* Preview column (right) */
    .preview-wrap {
      position: sticky; top: 24px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .preview-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 4px;
    }
    .preview-head-title {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.12em;
      display: flex; align-items: center; gap: 7px;
    }
    .preview-head-title::before {
      content: ""; width: 6px; height: 6px; border-radius: 50%;
      background: var(--pink); box-shadow: 0 0 0 3px var(--pink-bg);
    }
    .preview-zoom {
      font-size: 11px; color: var(--text-muted); font-weight: 600;
      display: inline-flex; align-items: center; gap: 8px;
    }

    /* PDF-looking preview */
    .preview-doc {
      background: #fff; border: 1px solid var(--border);
      border-radius: 12px; box-shadow: var(--shadow-lg);
      overflow: hidden;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
    }
    .preview-doc::-webkit-scrollbar { width: 6px; }
    .preview-doc::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
    .preview-page {
      padding: 42px 44px 52px;
      font-family: 'Lora', Georgia, serif;
      color: #1a1a1a; font-size: 12.5px; line-height: 1.6;
    }
    .preview-header-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 14px; border-bottom: 1.5px solid #111;
      margin-bottom: 22px;
    }
    .preview-brand {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 800; color: #111;
      letter-spacing: 0.18em; text-transform: uppercase;
    }
    .preview-doc-id {
      font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
      color: #666; letter-spacing: 0.04em;
    }
    .preview-title {
      font-family: 'Lora', serif; font-size: 20px; font-weight: 600;
      color: #111; text-align: center; margin-bottom: 6px; letter-spacing: -0.01em;
    }
    .preview-sub {
      font-family: 'Inter', sans-serif; font-size: 10.5px;
      color: #666; text-align: center; margin-bottom: 26px;
      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;
    }
    .preview-section { margin-bottom: 18px; }
    .preview-section-h {
      font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 800;
      color: #111; text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #ddd;
    }
    .preview-section p { margin-bottom: 6px; }
    .preview-section em { font-style: italic; color: #444; }
    .preview-kv { display: flex; justify-content: space-between; gap: 12px; font-family: 'Inter', sans-serif; font-size: 11.5px; padding: 3px 0; }
    .preview-kv dt { color: #666; }
    .preview-kv dd { color: #111; font-weight: 600; font-variant-numeric: tabular-nums; }
    .preview-change {
      margin-bottom: 14px; padding: 10px 12px;
      background: #fcfbf5; border-left: 3px solid var(--pink);
      border-radius: 0 6px 6px 0;
    }
    .preview-change-h {
      font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 800;
      color: var(--pink); text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 4px;
    }
    .preview-change-body { font-size: 12px; color: #222; }
    .preview-change-body strong { font-weight: 600; color: #111; }
    .preview-placeholder {
      text-align: center; padding: 40px 20px; font-family: 'Inter', sans-serif;
      font-size: 12.5px; color: #999;
    }
    .preview-placeholder svg { width: 32px; height: 32px; margin: 0 auto 12px; color: #ccc; }
    .preview-signatures {
      display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
      margin-top: 32px; padding-top: 20px; border-top: 1px solid #ddd;
    }
    .preview-sig-block { font-family: 'Inter', sans-serif; }
    .preview-sig-line {
      height: 36px; border-bottom: 1.5px solid #111; margin-bottom: 6px;
      display: flex; align-items: flex-end; padding-bottom: 2px;
      font-family: 'Caveat', cursive; font-size: 18px; color: #999;
    }
    .preview-sig-label { font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }
    .preview-sig-name { font-size: 12px; color: #111; font-weight: 600; margin-top: 2px; }
    .preview-sig-date { font-size: 10px; color: #666; margin-top: 6px; }

    .preview-footer {
      margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc;
      font-family: 'Inter', sans-serif; font-size: 9.5px; color: #999;
      display: flex; justify-content: space-between;
    }

    /* Bottom CTA bar */
    .cta-bar {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px 22px; margin-top: 24px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 18px; box-shadow: var(--shadow-sm);
    }
    .cta-bar-info { display: flex; align-items: center; gap: 14px; }
    .cta-bar-icon {
      width: 44px; height: 44px; border-radius: 11px;
      background: linear-gradient(135deg, var(--pink), #e85a9a);
      color: #fff; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 0 4px 12px rgba(255,73,152,0.3);
    }
    .cta-bar-icon svg { width: 20px; height: 20px; }
    .cta-bar-title { font-size: 14px; font-weight: 700; color: var(--text); }
    .cta-bar-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .cta-bar-actions { display: flex; gap: 10px; align-items: center; }

    /* Activity log */
    .activity-log { margin-top: 28px; }
    .activity-log h3 {
      font-size: 14px; font-weight: 700; color: var(--text);
      margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    }
    .activity-log h3 svg { width: 16px; height: 16px; color: var(--text-muted); }
    .log-list { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
    .log-row {
      display: flex; gap: 14px; padding: 14px 20px;
      border-bottom: 1px solid var(--border); align-items: flex-start;
    }
    .log-row:last-child { border-bottom: none; }
    .log-dot {
      width: 30px; height: 30px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .log-dot.green { background: var(--green-bg); color: var(--green-dark); }
    .log-dot.blue { background: var(--blue-pale); color: var(--blue); }
    .log-dot.pink { background: var(--pink-bg); color: var(--pink); }
    .log-dot.gray { background: var(--surface-alt); color: var(--text-muted); }
    .log-dot svg { width: 13px; height: 13px; }
    .log-body { flex: 1; font-size: 13px; }
    .log-body strong { color: var(--text); font-weight: 600; }
    .log-body p { color: var(--text-muted); margin-top: 2px; }
    .log-time { font-size: 11.5px; color: var(--text-faint); flex-shrink: 0; font-variant-numeric: tabular-nums; }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(26,31,54,0.55);
      backdrop-filter: blur(4px); z-index: 40;
      display: none; align-items: center; justify-content: center;
      padding: 24px;
    }
    .modal-backdrop.visible { display: flex; animation: fadeIn 0.18s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: #fff; border-radius: 16px;
      max-width: 520px; width: 100%;
      box-shadow: var(--shadow-lg); overflow: hidden;
      animation: popIn 0.22s ease;
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    .modal-head {
      padding: 22px 24px 6px;
    }
    .modal-head h3 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    .modal-head p { font-size: 13px; color: var(--text-muted); margin-top: 6px; }
    .modal-body { padding: 16px 24px 6px; }
    .modal-foot {
      padding: 16px 24px 20px;
      display: flex; gap: 10px; justify-content: flex-end;
    }
    .recipient-box {
      display: flex; align-items: center; gap: 12px;
      padding: 14px; border: 1px solid var(--border);
      border-radius: 12px; background: var(--surface-alt);
      margin-bottom: 14px;
    }
    .recipient-box .ctx-avatar { width: 40px; height: 40px; font-size: 13px; }
    .summary-list { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; }
    .summary-list li { display: flex; gap: 8px; align-items: flex-start; }
    .summary-list svg { width: 13px; height: 13px; color: var(--green); margin-top: 3px; flex-shrink: 0; }
    .summary-list span { color: var(--text); }

    /* Success overlay */
    .success-overlay {
      position: fixed; inset: 0;
      background: linear-gradient(180deg, rgba(47,62,131,0.95), rgba(20,32,74,0.98));
      backdrop-filter: blur(10px);
      z-index: 50; display: none;
      align-items: center; justify-content: center; padding: 24px;
    }
    .success-overlay.visible { display: flex; animation: fadeIn 0.3s ease; }
    .success-card {
      background: #fff; border-radius: 20px;
      max-width: 560px; width: 100%; overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.3);
      animation: popIn 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.2);
    }
    .success-head {
      padding: 36px 36px 24px; text-align: center;
      background: linear-gradient(180deg, #fff, var(--surface-subtle));
    }
    .success-icon {
      width: 68px; height: 68px; margin: 0 auto 18px;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--green), var(--green-dark));
      color: #fff;
      box-shadow: 0 12px 30px rgba(30,169,124,0.4);
      animation: bounceIn 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.2);
    }
    @keyframes bounceIn { 0% { transform: scale(0); } 60% { transform: scale(1.1); } 100% { transform: scale(1); } }
    .success-icon svg { width: 32px; height: 32px; stroke-width: 3; }
    .success-head h3 { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
    .success-head p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }

    .success-timeline {
      padding: 20px 36px 24px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .success-timeline-label {
      font-size: 10.5px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
    }
    .success-step {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 8px 0;
    }
    .success-step-dot {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--surface); border: 2px solid var(--border-strong);
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      color: var(--text-faint);
      position: relative;
    }
    .success-step.done .success-step-dot {
      background: var(--green); border-color: var(--green); color: #fff;
    }
    .success-step-dot svg { width: 10px; height: 10px; }
    .success-step-dot::after {
      content: ""; position: absolute; top: 22px; left: 50%;
      transform: translateX(-50%); width: 2px; height: 14px;
      background: var(--border);
    }
    .success-step:last-child .success-step-dot::after { display: none; }
    .success-step-body { padding-top: 1px; }
    .success-step-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .success-step-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 1px; }

    .success-foot {
      padding: 20px 36px 32px;
      display: flex; gap: 10px; justify-content: center;
    }

    /* Small util */
    .hidden { display: none !important; }`;

const MOCK_HTML = `<div class="app">

    <!-- ===== SIDEBAR ===== -->
    <aside class="sidebar">
      <div class="sb-brand">
        <div class="sb-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </div>
        <div>
          <div class="sb-brand-name">Tenantory</div>
          <div class="sb-brand-ws">Black Bear Rentals</div>
        </div>
      </div>

      <div class="sb-section">
        <div class="sb-section-label">Overview</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>Dashboard
          </a>
          <a class="sb-nav-item" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>Properties
            <span class="sb-nav-count">4</span>
          </a>
          <a class="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Tenants
            <span class="sb-nav-count">12</span>
          </a>
          <a class="sb-nav-item active" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 14h6M9 18h6"/></svg>Leases
          </a>
          <a class="sb-nav-item" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>Applications
            <span class="sb-nav-badge">3</span>
          </a>
        </div>

        <div class="sb-section-label" style="margin-top: 20px;">Operations</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Payments
          </a>
          <a class="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1"/></svg>Maintenance
            <span class="sb-nav-count">5</span>
          </a>
          <a class="sb-nav-item" href="reports.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>Reports
          </a>
          <a class="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>Vendors
          </a>
        </div>

        <div class="sb-section-label" style="margin-top: 20px;">Workspace</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5"/></svg>Settings
          </a>
          <a class="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>Documents
          </a>
        </div>
      </div>

      <div class="sb-user">
        <div class="sb-user-card">
          <div class="sb-user-avatar">HC</div>
          <div class="sb-user-info">
            <div class="sb-user-name">Harrison Cooper</div>
            <div class="sb-user-email">harrison@rentblackbear.com</div>
          </div>
          <div class="sb-user-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </aside>

    <!-- ===== MAIN ===== -->
    <main class="main">

      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-breadcrumb">
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Leases</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, leases, invoices…">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="topbar-icon-dot"></span>
          </button>
          <button class="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="content">

        <!-- Subcrumb -->
        <div class="subcrumb">
          <a href="leases.html">Leases</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <a href="#">Maya Thompson (Room C)</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <span class="current">Amendment</span>
        </div>

        <!-- Context card -->
        <div class="ctx-card">
          <div class="ctx-avatar">MT</div>
          <div>
            <div class="ctx-title-row">
              <div class="ctx-title">Maya Thompson</div>
              <span class="pill pill-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Active
              </span>
            </div>
            <div class="ctx-sub">3026 Turf Ave NW, Room C &middot; Lease #L-2025-0428</div>
          </div>
          <div>
            <div class="ctx-stat-label">Term</div>
            <div class="ctx-stat-value">Dec 28 2025 → Dec 27 2026</div>
          </div>
          <div>
            <div class="ctx-stat-label">Current rent</div>
            <div class="ctx-stat-value">$895 / month</div>
          </div>
          <div>
            <div class="ctx-stat-label">Days remaining</div>
            <div class="ctx-stat-value">257 of 365</div>
          </div>
          <a class="ctx-link" href="#">
            View full lease
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </a>
        </div>

        <!-- Page head -->
        <div class="page-head">
          <h1>Amend Maya's lease</h1>
          <p>All changes take effect after Maya e-signs. You can stack multiple changes in a single amendment.</p>
        </div>

        <!-- Two column -->
        <div class="two-col">

          <!-- ===== LEFT: Amendment form ===== -->
          <div class="stack">

            <!-- Type selection -->
            <div class="card">
              <div class="card-head">
                <div>
                  <h3>What are you changing?</h3>
                  <p>Select one or more. The right changes appear below.</p>
                </div>
              </div>
              <div class="card-body">
                <div class="type-grid">
                  <button type="button" class="type-chip" data-type="rent">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Rent change</div>
                      <div class="type-chip-desc">Raise or lower monthly rent</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>

                  <button type="button" class="type-chip" data-type="pet">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="14" r="2"/><path d="M9 10a5 5 0 0 0-4.79 6.94l1.76 5.13A2 2 0 0 0 7.87 23h6.26a2 2 0 0 0 1.9-1.93l1.76-5.13A5 5 0 0 0 13 10z"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Add pet</div>
                      <div class="type-chip-desc">New pet with deposit</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>

                  <button type="button" class="type-chip" data-type="roommate">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Add roommate</div>
                      <div class="type-chip-desc">New co-signer on lease</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>

                  <button type="button" class="type-chip" data-type="extend">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Extend term</div>
                      <div class="type-chip-desc">Push out the end date</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>

                  <button type="button" class="type-chip" data-type="payday">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Change payment day</div>
                      <div class="type-chip-desc">Shift monthly due date</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>

                  <button type="button" class="type-chip" data-type="other">
                    <div class="type-chip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></div>
                    <div class="type-chip-body">
                      <div class="type-chip-title">Other clause</div>
                      <div class="type-chip-desc">Free-text addendum</div>
                    </div>
                    <span class="type-chip-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Rent change ===== -->
            <div class="cond" data-panel="rent">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h4>Rent change</h4>
                <div class="cond-head-meta">Current: $895 / month</div>
              </div>
              <div class="cond-body">
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">New monthly rent</label>
                    <div class="input-addon-wrap">
                      <span class="input-addon">$</span>
                      <input class="input" type="number" id="rent-new" value="950" step="5">
                    </div>
                    <span class="field-hint" id="rent-delta">+$55 / month &middot; +6.1%</span>
                  </div>
                  <div class="field">
                    <label class="field-label">Effective date</label>
                    <input class="input" type="date" id="rent-effective" value="2026-05-14" min="2026-05-14">
                    <span class="field-hint">Earliest allowed by state notice rules.</span>
                  </div>
                </div>
                <div class="notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div><strong>30 days notice required</strong> per Alabama Code §35-9A-161 for month-to-month terms. Today is Apr 14 2026 &mdash; earliest effective date is <strong>May 14 2026</strong>. Auto-calculated.</div>
                </div>
                <div class="field">
                  <label class="field-label">Reason (for your records)</label>
                  <select class="select" id="rent-reason">
                    <option value="market">Market adjustment</option>
                    <option value="capex">Capex recovery (improvements to unit)</option>
                    <option value="tenant-added">Added tenant / roommate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Add pet ===== -->
            <div class="cond" data-panel="pet">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="14" r="2"/><path d="M9 10a5 5 0 0 0-4.79 6.94l1.76 5.13A2 2 0 0 0 7.87 23h6.26a2 2 0 0 0 1.9-1.93l1.76-5.13A5 5 0 0 0 13 10z"/></svg>
                </div>
                <h4>Pet details</h4>
                <div class="cond-head-meta">Black Bear policy: 2 pets max, 50 lb each</div>
              </div>
              <div class="cond-body">
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">Pet type</label>
                    <select class="select" id="pet-type">
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Small mammal</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Pet name</label>
                    <input class="input" id="pet-name" placeholder="e.g. Biscuit" value="Biscuit">
                  </div>
                </div>
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">Breed</label>
                    <input class="input" id="pet-breed" placeholder="e.g. Mini Goldendoodle" value="Mini Goldendoodle">
                  </div>
                  <div class="field">
                    <label class="field-label">Weight (lbs)</label>
                    <input class="input" type="number" id="pet-weight" value="22">
                  </div>
                </div>
                <div class="field">
                  <label class="field-label">Pet deposit</label>
                  <div class="input-addon-wrap">
                    <span class="input-addon">$</span>
                    <input class="input" type="number" id="pet-deposit" value="250" step="25">
                  </div>
                  <span class="field-hint">Default $250 &middot; Refundable on move-out (less damages).</span>
                </div>
                <div class="field">
                  <label class="field-label">Vaccination / license records</label>
                  <div class="upload">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    <div class="upload-title">Drop file or click to upload</div>
                    <div class="upload-sub">PDF, JPG, PNG &middot; up to 10 MB</div>
                  </div>
                </div>
                <div class="field">
                  <label class="field-label">Pet rules (editable)</label>
                  <textarea class="textarea" id="pet-rules">Pet must be leashed in common areas. Tenant is responsible for all damages caused by pet and for cleaning any waste from grounds. Excessive noise may result in removal of pet privileges with 14 days notice.</textarea>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Roommate ===== -->
            <div class="cond" data-panel="roommate">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h4>Add roommate</h4>
                <div class="cond-head-meta">They become jointly and severally liable</div>
              </div>
              <div class="cond-body">
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">Full name</label>
                    <input class="input" id="rm-name" value="Jordan Patel">
                  </div>
                  <div class="field">
                    <label class="field-label">Email</label>
                    <input class="input" type="email" id="rm-email" value="jordan.patel@gmail.com">
                  </div>
                </div>

                <div>
                  <label class="field-label" style="display:block; margin-bottom:8px;">Application status</label>
                  <div class="applicant-card">
                    <div class="applicant-avatar">JP</div>
                    <div class="applicant-body">
                      <div class="applicant-name">Jordan Patel</div>
                      <div class="applicant-sub">Credit 742 &middot; Income 3.2x rent &middot; No flags</div>
                    </div>
                    <span class="pill pill-green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      Approved Mar 28
                    </span>
                  </div>
                </div>

                <div class="toggle-row">
                  <div>
                    <div class="toggle-row-label">Split rent with Maya</div>
                    <div class="toggle-row-sub">Auto-generates two invoices each month, 50 / 50.</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="rm-split" checked>
                    <span class="switch-slider"></span>
                  </label>
                </div>

                <div class="toggle-row">
                  <div>
                    <div class="toggle-row-label">Collect additional security deposit</div>
                    <div class="toggle-row-sub">Request $447.50 (half of one month's rent) from Jordan.</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="rm-deposit">
                    <span class="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Extend term ===== -->
            <div class="cond" data-panel="extend">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <h4>Extend term</h4>
                <div class="cond-head-meta">Current end: Dec 27 2026</div>
              </div>
              <div class="cond-body">
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">New end date</label>
                    <input class="input" type="date" id="ext-end" value="2027-06-27">
                    <span class="field-hint" id="ext-hint">Extends 182 days &middot; 6 months added</span>
                  </div>
                  <div class="field">
                    <label class="field-label">Rent during extension</label>
                    <select class="select" id="ext-rent">
                      <option value="same">Stays the same</option>
                      <option value="step">Step up to market rate</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                <div class="notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <div><strong>Renewal notice deadlines updated.</strong> 60-day notice window now opens Apr 28 2027. Auto-reminder scheduled.</div>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Payment day ===== -->
            <div class="cond" data-panel="payday">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <h4>Change payment day</h4>
                <div class="cond-head-meta">Current: 1st of month</div>
              </div>
              <div class="cond-body">
                <div class="row-2">
                  <div class="field">
                    <label class="field-label">New due date</label>
                    <select class="select" id="pd-day">
                      <option>1st</option><option>5th</option><option selected>15th</option>
                      <option>20th</option><option>25th</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Handle pro-rate</label>
                    <select class="select" id="pd-prorate">
                      <option value="credit">Credit Maya the difference</option>
                      <option value="charge">Charge Maya the difference</option>
                      <option value="skip">Skip &mdash; start fresh next cycle</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- ===== Conditional: Other ===== -->
            <div class="cond" data-panel="other">
              <div class="cond-head">
                <div class="cond-head-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
                </div>
                <h4>Custom clause</h4>
                <div class="cond-head-meta">Plain English &middot; we'll tidy the legalese</div>
              </div>
              <div class="cond-body">
                <div class="field">
                  <label class="field-label">Clause text</label>
                  <textarea class="textarea" id="other-text" maxlength="1200" style="min-height: 110px;" placeholder="e.g. Tenant agrees to maintain the backyard fence in good repair in exchange for a $25/month credit..."></textarea>
                  <div class="char-count"><span id="other-count">0</span> / 1200</div>
                </div>
              </div>
            </div>

            <!-- ===== Finishing touches ===== -->
            <div class="card">
              <div class="card-head">
                <div>
                  <h3>Finishing touches</h3>
                  <p>Fees, effective date, internal notes.</p>
                </div>
              </div>
              <div class="card-body" style="display: flex; flex-direction: column; gap: 14px;">
                <div class="toggle-row">
                  <div>
                    <div class="toggle-row-label">Charge amendment fee</div>
                    <div class="toggle-row-sub">$50 one-time fee invoiced with next rent payment.</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="fee-on">
                    <span class="switch-slider"></span>
                  </label>
                </div>

                <div class="field">
                  <label class="field-label">Overall effective date</label>
                  <input class="input" type="date" id="eff-date" value="2026-05-14" min="2026-05-14">
                  <span class="field-hint">Validated against legal notice minimums for selected changes.</span>
                </div>

                <div class="field">
                  <label class="field-label">Internal notes <span style="color: var(--text-faint); font-weight: 500;">(not on the document)</span></label>
                  <textarea class="textarea" id="notes" placeholder="Why are you making this change? Any tenant context worth remembering…"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== RIGHT: Preview ===== -->
          <div class="preview-wrap">
            <div class="preview-head">
              <div class="preview-head-title">Live preview &middot; updates as you type</div>
              <div class="preview-zoom">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><circle cx="11" cy="11" r="8"/><path d="M11 8v6M8 11h6M21 21l-4.3-4.3"/></svg>
                100%
              </div>
            </div>
            <div class="preview-doc">
              <div class="preview-page">
                <div class="preview-header-bar">
                  <div class="preview-brand">Black Bear Rentals</div>
                  <div class="preview-doc-id">AMEND-L2025-0428-01</div>
                </div>

                <div class="preview-title">Amendment No. 1</div>
                <div class="preview-sub">To Residential Lease dated Dec 28 2025</div>

                <div class="preview-section">
                  <div class="preview-section-h">Parties</div>
                  <p>This First Amendment ("Amendment") is entered into this <em>14th day of April, 2026</em>, by and between <strong>Black Bear Rentals LLC</strong> ("Landlord") and <strong>Maya Thompson</strong> ("Tenant"), collectively referred to as the "Parties."</p>
                </div>

                <div class="preview-section">
                  <div class="preview-section-h">Original Lease</div>
                  <dl>
                    <div class="preview-kv"><dt>Premises</dt><dd>3026 Turf Ave NW, Room C</dd></div>
                    <div class="preview-kv"><dt>Term</dt><dd>Dec 28, 2025 &ndash; Dec 27, 2026</dd></div>
                    <div class="preview-kv"><dt>Current rent</dt><dd>$895.00 / month</dd></div>
                    <div class="preview-kv"><dt>Lease ID</dt><dd>L-2025-0428</dd></div>
                  </dl>
                </div>

                <div id="preview-changes">
                  <div class="preview-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 11h4"/></svg>
                    Select an amendment type to preview the legal text.
                  </div>
                </div>

                <div id="preview-effective" class="preview-section" style="display:none;">
                  <div class="preview-section-h">Effective Date &amp; Reaffirmation</div>
                  <p>All changes above take effect on <strong id="preview-eff-date">May 14, 2026</strong>. All other terms of the Original Lease remain in full force and effect. Tenant acknowledges receipt of this Amendment and reaffirms all obligations under the Original Lease as modified herein.</p>
                </div>

                <div class="preview-signatures">
                  <div class="preview-sig-block">
                    <div class="preview-sig-line"></div>
                    <div class="preview-sig-label">Tenant</div>
                    <div class="preview-sig-name">Maya Thompson</div>
                    <div class="preview-sig-date">Date: ____________________</div>
                  </div>
                  <div class="preview-sig-block">
                    <div class="preview-sig-line" style="font-family: 'Caveat', cursive; color:#1a1f36;">Harrison Cooper</div>
                    <div class="preview-sig-label">Landlord / Agent</div>
                    <div class="preview-sig-name">Harrison Cooper, Black Bear Rentals LLC</div>
                    <div class="preview-sig-date">Date: Apr 14, 2026</div>
                  </div>
                </div>

                <div class="preview-footer">
                  <span>Page 1 of 1</span>
                  <span>Generated by Tenantory</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== Send CTA ===== -->
        <div class="cta-bar">
          <div class="cta-bar-info">
            <div class="cta-bar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
            </div>
            <div>
              <div class="cta-bar-title" id="cta-title">Nothing to send yet</div>
              <div class="cta-bar-sub" id="cta-sub">Pick at least one change to continue.</div>
            </div>
          </div>
          <div class="cta-bar-actions">
            <button class="btn btn-ghost" id="btn-download">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download PDF preview
            </button>
            <button class="btn btn-ghost" id="btn-draft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
              Save as draft
            </button>
            <button class="btn btn-pink btn-lg" id="btn-send" disabled style="opacity: 0.5; pointer-events: none;">
              Send to Maya for signature
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- ===== Activity log ===== -->
        <div class="activity-log">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Amendment &amp; change history
          </h3>
          <div class="log-list">
            <div class="log-row">
              <div class="log-dot gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </div>
              <div class="log-body">
                <strong>Amendment draft started</strong>
                <p>Harrison opened a new amendment to lease L-2025-0428.</p>
              </div>
              <div class="log-time">Just now</div>
            </div>
            <div class="log-row">
              <div class="log-dot green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div class="log-body">
                <strong>Rent paid on time</strong>
                <p>April rent of $895 received via ACH &middot; no outstanding balances.</p>
              </div>
              <div class="log-time">Apr 1 2026</div>
            </div>
            <div class="log-row">
              <div class="log-dot blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              </div>
              <div class="log-body">
                <strong>Lease signed &amp; activated</strong>
                <p>Both parties e-signed. Move-in walkthrough completed Dec 30.</p>
              </div>
              <div class="log-time">Dec 28 2025</div>
            </div>
            <div class="log-row">
              <div class="log-dot pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>
              </div>
              <div class="log-body">
                <strong>Application approved</strong>
                <p>Credit 768 &middot; Income 3.4x rent &middot; No prior flags.</p>
              </div>
              <div class="log-time">Dec 18 2025</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- ===== Confirmation modal ===== -->
  <div class="modal-backdrop" id="confirm-modal">
    <div class="modal">
      <div class="modal-head">
        <h3>Send amendment for signature?</h3>
        <p>Maya will receive an email + portal notification. Nothing changes until she signs.</p>
      </div>
      <div class="modal-body">
        <div class="recipient-box">
          <div class="ctx-avatar">MT</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--text);">Maya Thompson</div>
            <div style="font-size: 12px; color: var(--text-muted);">maya.thompson@gmail.com &middot; (256) 555-0142</div>
          </div>
        </div>
        <div style="font-size: 11px; font-weight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">She'll be asked to sign</div>
        <ul class="summary-list" id="modal-summary"></ul>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
        <button class="btn btn-pink" id="modal-confirm">
          Send now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- ===== Success overlay ===== -->
  <div class="success-overlay" id="success-overlay">
    <div class="success-card">
      <div class="success-head">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3>Sent to Maya</h3>
        <p>She'll get an email and a portal notification. We'll ping you the moment she signs.</p>
      </div>
      <div class="success-timeline">
        <div class="success-timeline-label">What happens next</div>
        <div class="success-step done">
          <div class="success-step-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div class="success-step-body">
            <div class="success-step-title">Amendment sent</div>
            <div class="success-step-sub">Just now &middot; email + SMS delivered</div>
          </div>
        </div>
        <div class="success-step">
          <div class="success-step-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></div>
          <div class="success-step-body">
            <div class="success-step-title">Maya reviews &amp; e-signs</div>
            <div class="success-step-sub">Typical turnaround: under 24 hours</div>
          </div>
        </div>
        <div class="success-step">
          <div class="success-step-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
          <div class="success-step-body">
            <div class="success-step-title">Changes apply automatically</div>
            <div class="success-step-sub">Rent, roster &amp; reminders update on effective date.</div>
          </div>
        </div>
      </div>
      <div class="success-foot">
        <button class="btn btn-ghost" id="success-close">Close</button>
        <a class="btn btn-primary" href="leases.html">
          View in leases
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
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
