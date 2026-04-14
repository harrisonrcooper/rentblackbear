"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-property-new.html.
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
    input, select, textarea { font-family: inherit; font-size: inherit; }

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
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 100px;
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
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-breadcrumb a:hover { color: var(--blue); }
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
    .content { flex: 1; overflow-y: auto; padding: 32px 40px 80px; }
    .wizard { max-width: 980px; margin: 0 auto; }

    /* Page head */
    .page-head { margin-bottom: 28px; }
    .page-head h1 {
      font-size: 30px; font-weight: 800; letter-spacing: -0.025em;
      color: var(--text); margin-bottom: 6px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-primary:disabled { background: var(--border-strong); cursor: not-allowed; transform: none; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-text { color: var(--blue); font-weight: 600; padding: 6px 10px; font-size: 13px; }
    .btn-text:hover { color: var(--navy); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 13px 26px; font-size: 14px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Stepper ===== */
    .stepper {
      display: flex; align-items: center; gap: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 14px 18px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }
    .step-pill {
      display: flex; align-items: center; gap: 10px;
      flex: 1; padding: 6px 4px; border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      opacity: 0.55;
    }
    .step-pill:hover { opacity: 0.85; }
    .step-pill.active { opacity: 1; }
    .step-pill.done { opacity: 1; }
    .step-pill.disabled { cursor: not-allowed; opacity: 0.35; }
    .step-pill.disabled:hover { opacity: 0.35; }
    .step-dot {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface-alt);
      border: 1.5px solid var(--border-strong);
      color: var(--text-muted);
      font-weight: 700; font-size: 12px;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .step-pill.active .step-dot {
      background: var(--blue); color: #fff; border-color: var(--blue);
      box-shadow: 0 0 0 4px var(--blue-pale);
    }
    .step-pill.done .step-dot {
      background: var(--green); color: #fff; border-color: var(--green);
    }
    .step-pill.done .step-dot svg { width: 14px; height: 14px; }
    .step-label {
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.05em;
      line-height: 1.1;
    }
    .step-sub {
      font-size: 13px; font-weight: 600; color: var(--text);
      margin-top: 2px;
    }
    .step-pill.active .step-label { color: var(--blue); }
    .step-connector {
      width: 32px; height: 2px; background: var(--border);
      flex-shrink: 0; margin: 0 4px;
    }
    .step-connector.done { background: var(--green); }

    /* ===== Panels ===== */
    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: 20px;
      overflow: hidden;
    }
    .panel[hidden] { display: none; }
    .panel-head {
      padding: 22px 26px 18px;
      border-bottom: 1px solid var(--border);
    }
    .panel-head h2 {
      font-size: 20px; font-weight: 700; letter-spacing: -0.015em;
      color: var(--text); margin-bottom: 4px;
    }
    .panel-head p { color: var(--text-muted); font-size: 13px; }
    .panel-body { padding: 26px; }

    .panel-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 26px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
    }

    /* ===== Tile cards (step 1) ===== */
    .tile-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .tile {
      display: flex; flex-direction: column; gap: 14px;
      padding: 22px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
      position: relative;
    }
    .tile:hover {
      border-color: var(--blue);
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    .tile.selected {
      border-color: var(--blue);
      background: var(--blue-pale);
      box-shadow: 0 0 0 4px rgba(18,81,173,0.08);
    }
    .tile.selected::after {
      content: ""; position: absolute; top: 14px; right: 14px;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--blue) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>") center / 14px no-repeat;
    }
    .tile-icon {
      width: 46px; height: 46px; border-radius: 12px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
    }
    .tile.selected .tile-icon { background: var(--blue); color: #fff; }
    .tile-icon svg { width: 22px; height: 22px; }
    .tile-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
    .tile-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .tile-eg {
      font-size: 11px; color: var(--text-faint);
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
      margin-top: auto;
    }
    .tile-eg span { color: var(--text-muted); text-transform: none; font-weight: 500; letter-spacing: 0; }

    /* ===== Forms ===== */
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-size: 12px; font-weight: 600; color: var(--text);
      letter-spacing: 0.01em;
    }
    .field label .opt { color: var(--text-faint); font-weight: 500; margin-left: 4px; }
    .field input, .field select, .field textarea {
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      font-size: 13px;
      transition: all 0.15s ease;
      outline: none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px var(--blue-pale);
    }
    .field input::placeholder { color: var(--text-faint); }
    .field-hint { font-size: 12px; color: var(--text-faint); }
    .field-prefix {
      display: flex; align-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      overflow: hidden;
      transition: all 0.15s ease;
    }
    .field-prefix:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .field-prefix span {
      padding: 10px 12px;
      background: var(--surface-alt);
      color: var(--text-muted);
      font-size: 13px; font-weight: 600;
      border-right: 1px solid var(--border);
    }
    .field-prefix input { border: none; flex: 1; padding: 10px 12px; }
    .field-prefix input:focus { box-shadow: none; }

    .form-grid { display: grid; gap: 16px; }
    .form-grid.cols-2 { grid-template-columns: 1fr 1fr; }
    .form-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-grid.addr { grid-template-columns: 2fr 1fr 1fr 1fr; }
    .section-divider {
      height: 1px; background: var(--border);
      margin: 24px 0;
    }
    .section-label {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 12px;
    }

    /* Autofill */
    .autofill-bar {
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px;
      padding: 14px 16px;
      background: linear-gradient(90deg, rgba(18,81,173,0.06), rgba(255,73,152,0.04));
      border: 1px solid var(--blue-pale);
      border-radius: var(--radius);
      margin-bottom: 20px;
    }
    .autofill-bar-text { display: flex; align-items: center; gap: 12px; }
    .autofill-bar-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--surface); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow-sm);
    }
    .autofill-bar-icon svg { width: 18px; height: 18px; }
    .autofill-bar h4 { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .autofill-bar p { font-size: 12px; color: var(--text-muted); }

    .btn.loading .spinner { display: inline-block; }
    .spinner {
      display: none;
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Dropzone */
    .dropzone {
      border: 2px dashed var(--border-strong);
      border-radius: var(--radius);
      padding: 32px 20px;
      text-align: center;
      background: var(--surface-subtle);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .dropzone:hover {
      border-color: var(--blue);
      background: var(--blue-pale);
    }
    .dropzone-icon {
      width: 48px; height: 48px; margin: 0 auto 10px;
      border-radius: 50%;
      background: var(--surface); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow-sm);
    }
    .dropzone-icon svg { width: 22px; height: 22px; }
    .dropzone-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
    .dropzone-sub { font-size: 12px; color: var(--text-muted); }

    /* ===== Units table (step 3) ===== */
    .units-ctrl {
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px;
      padding: 16px; margin-bottom: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .units-ctrl .field { flex: 0 0 240px; }
    .units-ctrl-hint { font-size: 12px; color: var(--text-muted); }

    .units-head {
      display: grid; grid-template-columns: 1.6fr 0.8fr 0.8fr 0.9fr 1fr 1fr 30px;
      gap: 10px; padding: 10px 12px;
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.06em;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    }
    .units-list { border: 1px solid var(--border); border-top: none; border-radius: 0 0 var(--radius-sm) var(--radius-sm); overflow: hidden; }
    .unit-row {
      display: grid; grid-template-columns: 1.6fr 0.8fr 0.8fr 0.9fr 1fr 1fr 30px;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      align-items: center;
    }
    .unit-row:last-child { border-bottom: none; }
    .unit-row input {
      width: 100%; padding: 8px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-size: 13px; color: var(--text);
      outline: none;
      transition: all 0.15s ease;
    }
    .unit-row input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .unit-remove {
      width: 30px; height: 30px; border-radius: 50%;
      color: var(--text-faint);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .unit-remove:hover { background: var(--red-bg); color: var(--red); }
    .unit-remove svg { width: 14px; height: 14px; }

    .add-row-btn {
      margin-top: 12px;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 14px;
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 13px; font-weight: 600;
      transition: all 0.15s ease;
      background: var(--surface);
    }
    .add-row-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }

    /* ===== Ownership (step 4) ===== */
    .radio-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
    }
    .radio-card {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
      padding: 14px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer; text-align: left;
      transition: all 0.15s ease;
      background: var(--surface);
    }
    .radio-card:hover { border-color: var(--blue); }
    .radio-card.selected {
      border-color: var(--blue); background: var(--blue-pale);
    }
    .radio-card-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .radio-card.selected .radio-card-icon { background: var(--blue); color: #fff; }
    .radio-card-icon svg { width: 16px; height: 16px; }
    .radio-card-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .radio-card-sub { font-size: 11px; color: var(--text-muted); }

    .entity-block {
      margin-top: 16px;
      padding: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .entity-block[hidden] { display: none; }

    .info-note {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px;
      background: var(--blue-pale);
      border: 1px solid rgba(18,81,173,0.15);
      border-radius: var(--radius-sm);
      color: var(--navy);
      font-size: 12px; line-height: 1.5;
      margin-top: 16px;
    }
    .info-note svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: var(--blue); }
    .info-note strong { font-weight: 700; }

    /* ===== Summary (step 5) ===== */
    .summary-card {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 20px;
    }
    .summary-head {
      padding: 14px 18px;
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .summary-head h4 {
      font-size: 13px; font-weight: 700; color: var(--text);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .summary-head .edit-link { color: var(--blue); font-size: 12px; font-weight: 600; }
    .summary-head .edit-link:hover { color: var(--navy); }
    .summary-body {
      padding: 16px 18px;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
    }
    .summary-row { display: flex; flex-direction: column; gap: 2px; }
    .summary-row .label {
      font-size: 11px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .summary-row .value { font-size: 14px; font-weight: 600; color: var(--text); }

    .checklist {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px 20px;
      margin-bottom: 22px;
    }
    .checklist h4 {
      font-size: 13px; font-weight: 700; color: var(--text);
      text-transform: uppercase; letter-spacing: 0.06em;
      margin-bottom: 12px;
    }
    .checklist ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .checklist li {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 13px; color: var(--text);
    }
    .checklist li svg {
      width: 18px; height: 18px; flex-shrink: 0;
      color: var(--green); margin-top: 1px;
    }
    .checklist li span.meta { color: var(--text-muted); font-weight: 500; }

    /* ===== Success overlay ===== */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(20,32,74,0.55);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 100;
      padding: 24px;
      animation: fade 0.25s ease;
    }
    .overlay[hidden] { display: none; }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    .overlay-modal {
      width: 100%; max-width: 560px;
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }
    @keyframes pop {
      from { transform: translateY(20px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .overlay-head {
      padding: 32px 32px 20px; text-align: center;
    }
    .success-badge {
      width: 64px; height: 64px; border-radius: 50%;
      background: var(--green); color: #fff;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
      box-shadow: 0 0 0 8px var(--green-bg);
    }
    .success-badge svg { width: 30px; height: 30px; }
    .overlay-head h2 {
      font-size: 22px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; margin-bottom: 6px;
    }
    .overlay-head p { color: var(--text-muted); font-size: 14px; }
    .overlay-body { padding: 0 32px 24px; }
    .next-card {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 10px;
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .next-card:hover { border-color: var(--blue); background: var(--blue-pale); transform: translateX(2px); }
    .next-card-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .next-card-icon svg { width: 18px; height: 18px; }
    .next-card-text { flex: 1; }
    .next-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
    .next-card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .next-card-arrow { color: var(--text-faint); }
    .next-card-arrow svg { width: 16px; height: 16px; }
    .overlay-foot {
      padding: 16px 32px 28px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: center;
      background: var(--surface-subtle);
    }
    .overlay-foot a { color: var(--text-muted); font-size: 13px; font-weight: 600; }
    .overlay-foot a:hover { color: var(--blue); }

    /* utility */
    .row-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .muted { color: var(--text-muted); font-size: 12px; }`;

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
          <a class="sb-nav-item active" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>Properties
            <span class="sb-nav-count">4</span>
          </a>
          <a class="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Tenants
            <span class="sb-nav-count">12</span>
          </a>
          <a class="sb-nav-item" href="leases.html">
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
          <a href="properties.html">Properties</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>New property</strong>
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
          <a class="btn btn-ghost btn-sm" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            Cancel
          </a>
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="wizard">

          <!-- Page head -->
          <div class="page-head">
            <h1>Add a new property</h1>
            <p>About 3 minutes. You can edit everything later.</p>
          </div>

          <!-- ===== Stepper ===== -->
          <div class="stepper" id="stepper">
            <div class="step-pill active" data-step="1">
              <div class="step-dot">1</div>
              <div>
                <div class="step-label">Step 1</div>
                <div class="step-sub">Type</div>
              </div>
            </div>
            <div class="step-connector"></div>
            <div class="step-pill disabled" data-step="2">
              <div class="step-dot">2</div>
              <div>
                <div class="step-label">Step 2</div>
                <div class="step-sub">Address</div>
              </div>
            </div>
            <div class="step-connector"></div>
            <div class="step-pill disabled" data-step="3">
              <div class="step-dot">3</div>
              <div>
                <div class="step-label">Step 3</div>
                <div class="step-sub">Units</div>
              </div>
            </div>
            <div class="step-connector"></div>
            <div class="step-pill disabled" data-step="4">
              <div class="step-dot">4</div>
              <div>
                <div class="step-label">Step 4</div>
                <div class="step-sub">Financials</div>
              </div>
            </div>
            <div class="step-connector"></div>
            <div class="step-pill disabled" data-step="5">
              <div class="step-dot">5</div>
              <div>
                <div class="step-label">Step 5</div>
                <div class="step-sub">Done</div>
              </div>
            </div>
          </div>

          <!-- ===== STEP 1 — Type ===== -->
          <section class="panel" data-panel="1">
            <div class="panel-head">
              <h2>What kind of property is this?</h2>
              <p>Pick the setup that fits best. You can still fine-tune units on the next step.</p>
            </div>
            <div class="panel-body">
              <div class="tile-grid" id="typeGrid">
                <button class="tile" data-type="single">
                  <div class="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>
                  </div>
                  <div>
                    <div class="tile-title">Single-family home</div>
                    <div class="tile-desc">One unit, one lease. The whole house rents as a single tenancy.</div>
                  </div>
                  <div class="tile-eg">Examples <span>— 908 Lee Dr, 3026 Turf Ave</span></div>
                </button>

                <button class="tile" data-type="coliving">
                  <div class="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/><path d="M7 11h2M11 11h2M15 11h2"/></svg>
                  </div>
                  <div>
                    <div class="tile-title">Co-living house</div>
                    <div class="tile-desc">One building, per-room leases, shared kitchen / living / utilities.</div>
                  </div>
                  <div class="tile-eg">Examples <span>— 5-bed rooming house, student rental</span></div>
                </button>

                <button class="tile" data-type="multi">
                  <div class="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="18"/><rect x="13" y="8" width="8" height="13"/><path d="M6 7h2M6 11h2M6 15h2M16 11h2M16 15h2"/></svg>
                  </div>
                  <div>
                    <div class="tile-title">Multi-family</div>
                    <div class="tile-desc">Duplex, triplex or apartment — multiple units, each with its own kitchen.</div>
                  </div>
                  <div class="tile-eg">Examples <span>— 2-unit duplex, 6-unit apartment</span></div>
                </button>

                <button class="tile" data-type="adu">
                  <div class="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V10l7-5 7 5v11"/><rect x="8" y="14" width="6" height="7"/><path d="M18 21v-6h3v6"/></svg>
                  </div>
                  <div>
                    <div class="tile-title">ADU / unit in larger structure</div>
                    <div class="tile-desc">Separate entrance, shared lot — garage apartment, basement suite, casita.</div>
                  </div>
                  <div class="tile-eg">Examples <span>— Carriage house, in-law suite</span></div>
                </button>
              </div>
            </div>
            <div class="panel-foot">
              <a href="properties.html" class="btn-text">Cancel</a>
              <button class="btn btn-primary btn-lg" id="next1" disabled>
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <!-- ===== STEP 2 — Address ===== -->
          <section class="panel" data-panel="2" hidden>
            <div class="panel-head">
              <h2>Where is it?</h2>
              <p>The address tenants see and what we use for rent-roll and mail.</p>
            </div>
            <div class="panel-body">

              <div class="autofill-bar">
                <div class="autofill-bar-text">
                  <div class="autofill-bar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <h4>Autofill from county assessor</h4>
                    <p>Alabama parcels only. Pre-fills sq ft and year built from public records.</p>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm" id="autofillBtn">
                  <span class="spinner"></span>
                  <span class="label">Autofill (AL only)</span>
                </button>
              </div>

              <div class="form-grid addr">
                <div class="field">
                  <label>Street address</label>
                  <input type="text" id="fAddr" placeholder="908 Lee Drive NW">
                </div>
                <div class="field">
                  <label>Apt / unit<span class="opt">optional</span></label>
                  <input type="text" placeholder="—">
                </div>
                <div class="field">
                  <label>City</label>
                  <input type="text" id="fCity" value="Huntsville">
                </div>
                <div class="field">
                  <label>State</label>
                  <select id="fState">
                    <option value="AL">Alabama</option>
                    <option value="GA">Georgia</option>
                    <option value="TN">Tennessee</option>
                    <option value="FL">Florida</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>
              </div>

              <div class="form-grid cols-3" style="margin-top:16px;">
                <div class="field">
                  <label>ZIP code</label>
                  <input type="text" id="fZip" placeholder="35816" maxlength="5">
                  <span class="field-hint" id="zipHint">Auto-filled from state</span>
                </div>
                <div class="field">
                  <label>Year built</label>
                  <input type="number" id="fYear" placeholder="1958">
                </div>
                <div class="field">
                  <label>Square feet<span class="opt">optional</span></label>
                  <input type="number" id="fSqft" placeholder="1,420">
                </div>
              </div>

              <div class="section-divider"></div>

              <div class="form-grid cols-2">
                <div class="field">
                  <label>Nickname / display name</label>
                  <input type="text" id="fNick" placeholder="908 Lee">
                  <span class="field-hint">Shown in lists and on tenant receipts.</span>
                </div>
                <div class="field">
                  <label>Property photos<span class="opt">optional</span></label>
                  <div class="dropzone">
                    <div class="dropzone-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
                    </div>
                    <div class="dropzone-title">Drag 1–8 photos here</div>
                    <div class="dropzone-sub">JPG or PNG, up to 10 MB each</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel-foot">
              <button class="btn btn-ghost" data-back="1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary btn-lg" data-next="3">
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <!-- ===== STEP 3 — Units ===== -->
          <section class="panel" data-panel="3" hidden>
            <div class="panel-head">
              <h2 id="step3Title">Set up your units</h2>
              <p id="step3Sub">One unit, one lease — we'll pre-fill it for you.</p>
            </div>
            <div class="panel-body">
              <div class="units-ctrl" id="unitsCtrl">
                <div class="field">
                  <label id="countLabel">How many rooms?</label>
                  <input type="number" id="unitCount" min="1" max="20" value="5">
                </div>
                <div class="units-ctrl-hint" id="ctrlHint">
                  Rows are auto-named. Rename any row inline — Room A can become "Primary suite".
                </div>
              </div>

              <div class="units-head" id="unitsHead">
                <div>Name</div>
                <div>Beds</div>
                <div>Baths</div>
                <div>Sq ft</div>
                <div>Market rent</div>
                <div>Deposit</div>
                <div></div>
              </div>
              <div class="units-list" id="unitsList"></div>
              <button class="add-row-btn" id="addRowBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
                Add another row
              </button>

              <div class="info-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <div><strong>Deposit defaults to one month's rent.</strong> Tenants can pay in installments if you allow it in settings.</div>
              </div>
            </div>
            <div class="panel-foot">
              <button class="btn btn-ghost" data-back="2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary btn-lg" data-next="4">
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <!-- ===== STEP 4 — Financials ===== -->
          <section class="panel" data-panel="4" hidden>
            <div class="panel-head">
              <h2>Financials &amp; ownership</h2>
              <p>All optional, but it helps us build your Schedule E and cash-flow reports.</p>
            </div>
            <div class="panel-body">

              <div class="section-label">Acquisition</div>
              <div class="form-grid cols-3">
                <div class="field">
                  <label>Purchase price<span class="opt">optional</span></label>
                  <div class="field-prefix"><span>$</span><input type="number" placeholder="225,000"></div>
                </div>
                <div class="field">
                  <label>Purchase date<span class="opt">optional</span></label>
                  <input type="date">
                </div>
                <div class="field">
                  <label>Mortgage / month<span class="opt">optional</span></label>
                  <div class="field-prefix"><span>$</span><input type="number" placeholder="1,140"></div>
                </div>
              </div>

              <div class="section-divider"></div>

              <div class="section-label">Recurring carry costs</div>
              <div class="form-grid cols-3">
                <div class="field">
                  <label>Property tax / year</label>
                  <div class="field-prefix"><span>$</span><input type="number" placeholder="1,820"></div>
                </div>
                <div class="field">
                  <label>Insurance / year</label>
                  <div class="field-prefix"><span>$</span><input type="number" placeholder="1,260"></div>
                </div>
                <div class="field">
                  <label>HOA / condo fees<span class="opt">if any</span></label>
                  <div class="field-prefix"><span>$</span><input type="number" placeholder="0 / month"></div>
                </div>
              </div>

              <div class="section-divider"></div>

              <div class="section-label">Who owns this property?</div>
              <div class="radio-grid" id="ownerGrid">
                <button class="radio-card selected" data-own="me">
                  <div class="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <div class="radio-card-title">Me personally</div>
                  <div class="radio-card-sub">Reports on your Schedule E</div>
                </button>
                <button class="radio-card" data-own="llc">
                  <div class="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="14"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </div>
                  <div class="radio-card-title">An LLC</div>
                  <div class="radio-card-sub">Tenantory tracks it separately</div>
                </button>
                <button class="radio-card" data-own="partnership">
                  <div class="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 20c0-3 2-5 5-5"/></svg>
                  </div>
                  <div class="radio-card-title">A partnership</div>
                  <div class="radio-card-sub">Multiple owners, K-1s issued</div>
                </button>
                <button class="radio-card" data-own="trust">
                  <div class="radio-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z"/></svg>
                  </div>
                  <div class="radio-card-title">A trust</div>
                  <div class="radio-card-sub">Held for a beneficiary</div>
                </button>
              </div>

              <!-- Entity details -->
              <div class="entity-block" id="entityBlock" hidden>
                <div class="form-grid cols-2">
                  <div class="field">
                    <label id="entityLabel">Owning entity</label>
                    <select id="entitySelect">
                      <option>The Lee Three LLC</option>
                      <option>Black Bear Rentals LLC</option>
                      <option>Cooper Holdings LLC</option>
                      <option>3026 Turf Partnership</option>
                    </select>
                  </div>
                  <div class="field" style="justify-content:flex-end;">
                    <label style="visibility:hidden;">spacer</label>
                    <a href="settings.html" class="btn-text" style="align-self:flex-start;">+ Add new entity</a>
                  </div>
                </div>

                <!-- Profit split -->
                <div style="margin-top:16px;">
                  <div class="section-label">Profit split</div>
                  <div class="units-head" style="grid-template-columns: 2fr 1fr 1fr 30px;">
                    <div>Owner</div>
                    <div>% ownership</div>
                    <div>Role</div>
                    <div></div>
                  </div>
                  <div class="units-list">
                    <div class="unit-row" style="grid-template-columns: 2fr 1fr 1fr 30px;">
                      <input type="text" value="Harrison Cooper">
                      <input type="number" value="50">
                      <input type="text" value="Managing member">
                      <button class="unit-remove" aria-label="remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div class="unit-row" style="grid-template-columns: 2fr 1fr 1fr 30px;">
                      <input type="text" value="Partner name">
                      <input type="number" value="50">
                      <input type="text" value="Member">
                      <button class="unit-remove" aria-label="remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                  <button class="add-row-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
                    Add owner
                  </button>
                </div>
              </div>

              <div class="info-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <div><strong>Tax reporting entity.</strong> This is what shows on 1099s and Schedule E. You can change it later under Settings → Entities.</div>
              </div>
            </div>
            <div class="panel-foot">
              <button class="btn btn-ghost" data-back="3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary btn-lg" data-next="5">
                Review
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <!-- ===== STEP 5 — Review / Ready ===== -->
          <section class="panel" data-panel="5" hidden>
            <div class="panel-head">
              <h2>Ready to go</h2>
              <p>Here's what we'll create. Click any section to jump back and edit.</p>
            </div>
            <div class="panel-body">

              <div class="summary-card">
                <div class="summary-head">
                  <h4>Property</h4>
                  <a class="edit-link" data-jump="2">Edit</a>
                </div>
                <div class="summary-body" id="sumProperty">
                  <div class="summary-row"><div class="label">Address</div><div class="value" data-k="address">908 Lee Drive NW, Huntsville AL 35816</div></div>
                  <div class="summary-row"><div class="label">Type</div><div class="value" data-k="type">Single-family home</div></div>
                  <div class="summary-row"><div class="label">Nickname</div><div class="value" data-k="nick">908 Lee</div></div>
                  <div class="summary-row"><div class="label">Year built · sq ft</div><div class="value" data-k="sqft">1958 · 1,420 sq ft</div></div>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-head">
                  <h4>Units</h4>
                  <a class="edit-link" data-jump="3">Edit</a>
                </div>
                <div class="summary-body" id="sumUnits" style="grid-template-columns: 1fr;"></div>
              </div>

              <div class="summary-card">
                <div class="summary-head">
                  <h4>Financials &amp; ownership</h4>
                  <a class="edit-link" data-jump="4">Edit</a>
                </div>
                <div class="summary-body">
                  <div class="summary-row"><div class="label">Owner</div><div class="value" id="sumOwner">Me personally</div></div>
                  <div class="summary-row"><div class="label">Tax-reporting entity</div><div class="value" id="sumEntity">Harrison Cooper · Schedule E</div></div>
                  <div class="summary-row"><div class="label">Property tax / year</div><div class="value">$1,820</div></div>
                  <div class="summary-row"><div class="label">Insurance / year</div><div class="value">$1,260</div></div>
                </div>
              </div>

              <div class="checklist">
                <h4>What happens when you click create</h4>
                <ul>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Property record is created with your address and photos
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Each unit or room is created with its own market rent and deposit
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    You'll be ready to invite tenants <span class="meta">— send invites from the property page</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Autopay for rent collection <span class="meta">— set up when your first tenant is invited</span>
                  </li>
                </ul>
              </div>

            </div>
            <div class="panel-foot">
              <button class="btn btn-ghost" data-back="4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary btn-lg" id="createBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>
                Create property
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>

  <!-- ===== SUCCESS OVERLAY ===== -->
  <div class="overlay" id="successOverlay" hidden>
    <div class="overlay-modal">
      <div class="overlay-head">
        <div class="success-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 id="successTitle">908 Lee Drive created</h2>
        <p>It's live in your portfolio. Pick what to do next.</p>
      </div>
      <div class="overlay-body">
        <a class="next-card" href="tenants.html">
          <div class="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          </div>
          <div class="next-card-text">
            <div class="next-card-title">Add tenants</div>
            <div class="next-card-sub">Invite by email or SMS — they'll sign the lease online</div>
          </div>
          <div class="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
        </a>
        <a class="next-card" href="#">
          <div class="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
          </div>
          <div class="next-card-text">
            <div class="next-card-title">List the property publicly</div>
            <div class="next-card-sub">Syndicate to Zillow, Trulia, and your tenantory.com page</div>
          </div>
          <div class="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
        </a>
        <a class="next-card" href="import.html">
          <div class="next-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div class="next-card-text">
            <div class="next-card-title">Import prior tenants</div>
            <div class="next-card-sub">Bring over existing leases, deposits, and ledgers from a CSV</div>
          </div>
          <div class="next-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
        </a>
      </div>
      <div class="overlay-foot">
        <a href="properties.html">Back to all properties →</a>
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
