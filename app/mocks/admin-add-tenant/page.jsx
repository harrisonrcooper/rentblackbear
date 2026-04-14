"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-add-tenant.html.
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

    /* ===== Shell ===== */
    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar (copied from admin-v2) ===== */
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
      transition: all 0.15s ease; position: relative;
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
      font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px;
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
    .topbar-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-muted);
    }
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

    .content { flex: 1; overflow-y: auto; padding: 28px 32px 60px; }

    /* Page breadcrumb link row (inside content) */
    .page-crumbs {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text-muted);
      margin-bottom: 12px;
    }
    .page-crumbs a { color: var(--blue); font-weight: 600; }
    .page-crumbs a:hover { color: var(--navy); }
    .page-crumbs svg { width: 12px; height: 12px; opacity: 0.5; }
    .page-crumbs strong { color: var(--text); font-weight: 600; }

    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 6px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 12px 24px; font-size: 14px; }
    .btn svg { width: 14px; height: 14px; }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

    /* Warning callout */
    .callout {
      background: linear-gradient(90deg, rgba(234,140,58,0.07), rgba(234,140,58,0.02));
      border: 1px solid rgba(234,140,58,0.35);
      border-left: 3px solid var(--orange);
      border-radius: var(--radius-lg);
      padding: 16px 18px;
      display: flex; align-items: flex-start; gap: 14px;
      margin-bottom: 24px;
    }
    .callout-icon {
      width: 34px; height: 34px; border-radius: 9px;
      background: var(--orange-bg); color: var(--orange);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .callout-icon svg { width: 18px; height: 18px; }
    .callout-body { flex: 1; }
    .callout-body strong { color: var(--text); font-weight: 700; font-size: 13px; display: block; margin-bottom: 2px; }
    .callout-body p { color: var(--text-muted); font-size: 13px; }
    .callout-body a { color: var(--blue); font-weight: 600; }
    .callout-body a:hover { color: var(--navy); text-decoration: underline; }

    /* ===== Wizard layout ===== */
    .wizard {
      display: grid; grid-template-columns: 280px 1fr;
      gap: 24px; align-items: flex-start;
    }

    .stepper {
      position: sticky; top: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
    }
    .stepper-title {
      font-size: 11px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 14px;
    }
    .step {
      display: flex; gap: 12px; padding: 12px;
      border-radius: 10px;
      cursor: pointer; transition: all 0.15s ease;
      position: relative;
    }
    .step + .step::before {
      content: ""; position: absolute;
      left: 27px; top: -6px; height: 12px;
      width: 2px; background: var(--border);
    }
    .step.done + .step::before { background: var(--green); }
    .step:hover { background: var(--surface-alt); }
    .step.active { background: var(--blue-pale); }
    .step-num {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--surface-alt);
      border: 1.5px solid var(--border);
      color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .step.active .step-num {
      background: var(--blue); border-color: var(--blue); color: #fff;
      box-shadow: 0 0 0 4px var(--blue-pale);
    }
    .step.done .step-num {
      background: var(--green); border-color: var(--green); color: #fff;
    }
    .step.done .step-num svg { width: 14px; height: 14px; }
    .step-body { flex: 1; min-width: 0; padding-top: 3px; }
    .step-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 2px;
    }
    .step-title { font-size: 13px; font-weight: 600; color: var(--text); }
    .step.active .step-title { color: var(--blue); }
    .step-hint { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

    /* Form card */
    .form-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .form-card-head {
      padding: 22px 28px 18px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(180deg, var(--surface), var(--surface-subtle));
    }
    .form-card-head h2 {
      font-size: 20px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em; margin-bottom: 4px;
    }
    .form-card-head p { color: var(--text-muted); font-size: 13px; }
    .form-card-body { padding: 26px 28px; }
    .form-card-foot {
      padding: 16px 28px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; justify-content: space-between; align-items: center; gap: 12px;
    }
    .form-card-foot-left { font-size: 12px; color: var(--text-faint); display: flex; align-items: center; gap: 6px; }
    .form-card-foot-left svg { width: 14px; height: 14px; }
    .form-card-foot-right { display: flex; gap: 10px; }

    /* Step panels */
    .step-panel { display: none; }
    .step-panel.active { display: block; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    /* Form grid */
    .field-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px;
    }
    .field-grid .full { grid-column: span 2; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-size: 12px; font-weight: 600; color: var(--text);
      display: flex; align-items: center; justify-content: space-between;
    }
    .field label .opt {
      font-size: 10px; font-weight: 600; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .field-hint { font-size: 11px; color: var(--text-faint); }
    .input, .select, textarea.input {
      padding: 10px 12px; font-size: 13px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text);
      transition: all 0.15s ease;
      width: 100%;
    }
    .input:focus, .select:focus, textarea.input:focus {
      outline: none;
      border-color: var(--blue);
      box-shadow: 0 0 0 3px var(--blue-pale);
    }
    .select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      padding-right: 36px;
    }
    .input-prefix {
      position: relative; display: flex; align-items: center;
    }
    .input-prefix .prefix {
      position: absolute; left: 12px;
      color: var(--text-faint); font-size: 13px; font-weight: 600;
      pointer-events: none;
    }
    .input-prefix .input { padding-left: 26px; }

    /* Dropzone */
    .dropzone {
      border: 1.5px dashed var(--border-strong);
      border-radius: 10px;
      padding: 24px;
      background: var(--surface-subtle);
      display: flex; align-items: center; gap: 14px;
      cursor: pointer; transition: all 0.15s ease;
    }
    .dropzone:hover {
      border-color: var(--blue);
      background: var(--blue-pale);
    }
    .dropzone-icon {
      width: 42px; height: 42px; border-radius: 10px;
      background: var(--surface); color: var(--blue);
      border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .dropzone-icon svg { width: 20px; height: 20px; }
    .dropzone-body { flex: 1; }
    .dropzone-body strong { display: block; font-size: 13px; color: var(--text); font-weight: 600; margin-bottom: 2px; }
    .dropzone-body span { font-size: 12px; color: var(--text-muted); }
    .dropzone-action {
      font-size: 12px; font-weight: 600; color: var(--blue);
      padding: 7px 14px; border-radius: 100px;
      border: 1px solid var(--border); background: var(--surface);
    }

    /* Section heading inside step */
    .form-section-head {
      margin-top: 24px; padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .form-section-head:first-child { margin-top: 0; padding-top: 0; border-top: none; }
    .form-section-head h3 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .form-section-head p { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }

    /* Soft warning inline */
    .soft-warn {
      display: none;
      margin-top: 10px;
      padding: 10px 12px;
      background: var(--orange-bg);
      border: 1px solid rgba(234,140,58,0.35);
      border-radius: 8px;
      font-size: 12px; color: var(--text);
      align-items: flex-start; gap: 10px;
    }
    .soft-warn.show { display: flex; }
    .soft-warn svg { width: 14px; height: 14px; color: var(--orange); flex-shrink: 0; margin-top: 2px; }
    .soft-warn strong { color: var(--orange); font-weight: 700; }

    /* Co-tenant chip */
    .cotenant-list {
      display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
    }
    .cotenant {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px 6px 6px;
      background: var(--blue-pale); color: var(--blue);
      border-radius: 100px; font-size: 12px; font-weight: 600;
    }
    .cotenant-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--blue); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700;
    }

    /* Pet policy radio group */
    .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip-radio { position: relative; }
    .chip-radio input { position: absolute; opacity: 0; pointer-events: none; }
    .chip-radio label {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 14px;
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 12px; font-weight: 600;
      color: var(--text-muted);
      cursor: pointer; transition: all 0.15s ease;
      background: var(--surface);
    }
    .chip-radio label:hover { border-color: var(--blue); color: var(--blue); }
    .chip-radio input:checked + label {
      background: var(--blue); border-color: var(--blue); color: #fff;
    }

    /* Review summary */
    .summary-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .summary-card {
      border: 1px solid var(--border); border-radius: 12px;
      padding: 18px; background: var(--surface);
    }
    .summary-card h4 {
      font-size: 10px; font-weight: 700;
      color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
    }
    .summary-card h4 a { color: var(--blue); font-weight: 600; letter-spacing: 0; text-transform: none; font-size: 11px; }
    .summary-rows { display: flex; flex-direction: column; gap: 8px; }
    .summary-row {
      display: flex; justify-content: space-between; align-items: baseline;
      font-size: 13px; gap: 12px;
    }
    .summary-row span:first-child { color: var(--text-muted); }
    .summary-row span:last-child { color: var(--text); font-weight: 600; text-align: right; }

    /* Invite option cards */
    .option-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .option {
      display: flex; gap: 14px; padding: 16px;
      border: 1.5px solid var(--border); border-radius: 12px;
      cursor: pointer; transition: all 0.15s ease;
      background: var(--surface);
    }
    .option:hover { border-color: var(--blue); background: var(--surface-subtle); }
    .option input { display: none; }
    .option.selected {
      border-color: var(--blue);
      background: var(--blue-pale);
      box-shadow: 0 0 0 3px rgba(18,81,173,0.08);
    }
    .option-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong);
      flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease;
    }
    .option.selected .option-radio {
      border-color: var(--blue);
    }
    .option.selected .option-radio::after {
      content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--blue);
    }
    .option-body { flex: 1; }
    .option-body strong { display: block; font-size: 14px; color: var(--text); font-weight: 700; margin-bottom: 2px; }
    .option-body p { font-size: 12px; color: var(--text-muted); }

    /* Checkbox row */
    .check-row {
      margin-top: 16px;
      display: flex; align-items: flex-start; gap: 10px;
      padding: 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 10px;
      cursor: pointer;
    }
    .check-row input { display: none; }
    .check-box {
      width: 18px; height: 18px; border-radius: 5px;
      border: 1.5px solid var(--border-strong);
      flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface);
      transition: all 0.15s ease;
    }
    .check-row.checked .check-box {
      background: var(--blue); border-color: var(--blue);
    }
    .check-row.checked .check-box svg { display: block; }
    .check-box svg { display: none; width: 12px; height: 12px; color: #fff; }
    .check-row-body strong { display: block; font-size: 13px; color: var(--text); font-weight: 600; margin-bottom: 2px; }
    .check-row-body p { font-size: 12px; color: var(--text-muted); }

    /* Success overlay */
    .overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(20,32,74,0.5);
      backdrop-filter: blur(6px);
      z-index: 100;
      align-items: center; justify-content: center;
      padding: 24px;
    }
    .overlay.show { display: flex; animation: fadeIn 0.3s ease; }
    .overlay-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      max-width: 560px; width: 100%;
      padding: 36px;
      text-align: center;
    }
    .overlay-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
      box-shadow: 0 10px 24px rgba(30,169,124,0.3);
    }
    .overlay-icon svg { width: 32px; height: 32px; }
    .overlay-card h2 {
      font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 8px;
    }
    .overlay-card p {
      font-size: 14px; color: var(--text-muted); margin-bottom: 24px;
      max-width: 420px; margin-left: auto; margin-right: auto;
    }
    .overlay-actions {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 12px; margin-bottom: 18px;
    }
    .overlay-action {
      padding: 16px 14px;
      border: 1px solid var(--border); border-radius: 12px;
      background: var(--surface);
      cursor: pointer; transition: all 0.15s ease;
      text-align: left;
    }
    .overlay-action:hover {
      border-color: var(--blue);
      background: var(--blue-pale);
      transform: translateY(-2px);
    }
    .overlay-action-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 10px;
    }
    .overlay-action-icon svg { width: 16px; height: 16px; }
    .overlay-action strong { display: block; font-size: 13px; color: var(--text); font-weight: 700; margin-bottom: 2px; }
    .overlay-action span { font-size: 11px; color: var(--text-muted); }
    .overlay-foot { font-size: 12px; color: var(--text-faint); }
    .overlay-foot a { color: var(--blue); font-weight: 600; }

    @media (max-width: 1080px) {
      .wizard { grid-template-columns: 1fr; }
      .stepper { position: static; }
    }`;

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
          <a class="sb-nav-item active" href="tenants.html">
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
          <span>Workspace</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <a href="tenants.html">Tenants</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Add tenant</strong>
        </div>
        <div class="topbar-right">
          <div class="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search tenants, leases, invoices…">
            <kbd>⌘K</kbd>
          </div>
          <button class="topbar-icon" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </button>
          <button class="topbar-icon" aria-label="Inbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="content">

        <div class="page-crumbs">
          <a href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;width:12px;height:12px;"><path d="M15 18l-6-6 6-6"/></svg>
            Back to tenants
          </a>
        </div>

        <div class="page-head">
          <div>
            <h1>Add a tenant manually</h1>
            <p>Skip the application flow. Use this for existing tenants, grandfathered occupants, or bulk-imports that need finesse.</p>
          </div>
          <div class="page-head-actions">
            <a href="tenants.html" class="btn btn-ghost btn-sm">Cancel</a>
            <button class="btn btn-ghost btn-sm" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Import CSV instead
            </button>
          </div>
        </div>

        <!-- Warning callout -->
        <div class="callout">
          <div class="callout-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="callout-body">
            <strong>Heads up — no background or credit check runs on manual adds.</strong>
            <p>This tenant won't have gone through credit/background checks. If you want that, use the regular <a href="tenants.html">invite-to-apply</a> flow instead.</p>
          </div>
        </div>

        <!-- Wizard -->
        <div class="wizard">

          <!-- Stepper -->
          <aside class="stepper" id="stepper">
            <div class="stepper-title">Manual add</div>

            <div class="step active" data-step="1">
              <div class="step-num">1</div>
              <div class="step-body">
                <div class="step-label">Step 1</div>
                <div class="step-title">Who is this tenant?</div>
                <div class="step-hint">Name, contact, ID</div>
              </div>
            </div>

            <div class="step" data-step="2">
              <div class="step-num">2</div>
              <div class="step-body">
                <div class="step-label">Step 2</div>
                <div class="step-title">Where are they going?</div>
                <div class="step-hint">Property &amp; unit</div>
              </div>
            </div>

            <div class="step" data-step="3">
              <div class="step-num">3</div>
              <div class="step-body">
                <div class="step-label">Step 3</div>
                <div class="step-title">Lease terms</div>
                <div class="step-hint">Rent, deposit, dates</div>
              </div>
            </div>

            <div class="step" data-step="4">
              <div class="step-num">4</div>
              <div class="step-body">
                <div class="step-label">Step 4</div>
                <div class="step-title">Review &amp; invite</div>
                <div class="step-hint">Portal access</div>
              </div>
            </div>
          </aside>

          <!-- Form card -->
          <section class="form-card">

            <!-- ===== STEP 1 ===== -->
            <div class="step-panel active" data-panel="1">
              <div class="form-card-head">
                <h2>Who is this tenant?</h2>
                <p>Just the basics to create their profile. You can fill in the rest from their tenant page later.</p>
              </div>
              <div class="form-card-body">
                <div class="field-grid">
                  <div class="field">
                    <label>First name</label>
                    <input class="input" id="f_first" placeholder="Ramon" value="Ramon" required>
                  </div>
                  <div class="field">
                    <label>Last name</label>
                    <input class="input" id="f_last" placeholder="Jackson" value="Jackson" required>
                  </div>
                  <div class="field">
                    <label>Email <span class="opt">Required for portal invite</span></label>
                    <input class="input" id="f_email" type="email" placeholder="ramon@example.com" value="ramon.jackson@gmail.com" required>
                  </div>
                  <div class="field">
                    <label>Phone</label>
                    <input class="input" id="f_phone" type="tel" placeholder="(256) 555-0134" value="(256) 555-0134">
                  </div>
                  <div class="field">
                    <label>Date of birth</label>
                    <input class="input" id="f_dob" type="date" value="1989-04-22">
                  </div>
                  <div class="field">
                    <label>SSN last 4 <span class="opt">Optional</span></label>
                    <div class="input-prefix">
                      <span class="prefix">***-**-</span>
                      <input class="input" id="f_ssn" maxlength="4" inputmode="numeric" placeholder="0000">
                    </div>
                  </div>
                  <div class="field full">
                    <label>Current employer <span class="opt">Optional</span></label>
                    <input class="input" id="f_employer" placeholder="Redstone Federal Credit Union" value="Redstone Federal Credit Union">
                    <span class="field-hint">Helps with income verification and communication if rent is late.</span>
                  </div>
                  <div class="field full">
                    <label>Government ID <span class="opt">Optional</span></label>
                    <div class="dropzone" onclick="event.preventDefault()">
                      <div class="dropzone-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h3M15 12h3M5 18h14"/></svg>
                      </div>
                      <div class="dropzone-body">
                        <strong>Drop ID or click to upload</strong>
                        <span>Driver's license, passport, or state ID — PDF, JPG, or PNG up to 10MB</span>
                      </div>
                      <div class="dropzone-action">Choose file</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-card-foot">
                <div class="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  We never share tenant PII. Encrypted at rest.
                </div>
                <div class="form-card-foot-right">
                  <button class="btn btn-ghost" type="button" disabled>Back</button>
                  <button class="btn btn-primary" type="button" data-next="2">
                    Continue to placement
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== STEP 2 ===== -->
            <div class="step-panel" data-panel="2">
              <div class="form-card-head">
                <h2>Where are they going?</h2>
                <p>Pick the property and unit. We'll warn you if the unit already has a tenant.</p>
              </div>
              <div class="form-card-body">
                <div class="field-grid">
                  <div class="field">
                    <label>Property</label>
                    <select class="select" id="f_property">
                      <option value="">Select a property…</option>
                      <option value="lee" data-units="2" selected>908 Lee Dr NW — 2 units</option>
                      <option value="turf" data-units="3">3026 Turf Ave NW — 3 units</option>
                      <option value="pinhook" data-units="1">1145 Pinhook Rd — 1 unit</option>
                      <option value="oakwood" data-units="6">412 Oakwood St — 6 units</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Unit / room</label>
                    <select class="select" id="f_unit">
                      <option value="A" data-status="available">Unit A — Available</option>
                      <option value="B" data-status="occupied" selected>Unit B — Occupied by Dana Meyer</option>
                    </select>
                    <div class="soft-warn show" id="unit_warn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <div>
                        <strong>Unit B is currently occupied by Dana Meyer.</strong> They'll be listed as a co-tenant. To replace instead, end Dana's lease first from the lease page.
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <label>Move-in date</label>
                    <input class="input" id="f_movein" type="date" value="2026-05-01">
                  </div>
                  <div class="field">
                    <label>Relationship <span class="opt">Optional</span></label>
                    <select class="select" id="f_rel">
                      <option>Tenant (standard)</option>
                      <option>Grandfathered occupant</option>
                      <option>Friend or family</option>
                      <option>Migrated from other system</option>
                    </select>
                  </div>
                  <div class="field full">
                    <label>Co-tenants already in this unit</label>
                    <div class="cotenant-list">
                      <span class="cotenant">
                        <span class="cotenant-avatar">DM</span>
                        Dana Meyer — lease thru Dec 2026
                      </span>
                    </div>
                    <span class="field-hint">Ramon will share rent responsibility with existing co-tenants unless you mark separate rent on the lease step.</span>
                  </div>
                </div>
              </div>
              <div class="form-card-foot">
                <div class="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  4 properties · 12 units managed
                </div>
                <div class="form-card-foot-right">
                  <button class="btn btn-ghost" type="button" data-prev="1">Back</button>
                  <button class="btn btn-primary" type="button" data-next="3">
                    Continue to lease
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== STEP 3 ===== -->
            <div class="step-panel" data-panel="3">
              <div class="form-card-head">
                <h2>Lease terms</h2>
                <p>We pre-filled from 908 Lee Dr NW's defaults. Override anything that doesn't match their existing lease.</p>
              </div>
              <div class="form-card-body">

                <div class="form-section-head">
                  <h3>Rent &amp; deposit</h3>
                  <p>Set what Ramon pays and when.</p>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <label>Monthly rent</label>
                    <div class="input-prefix">
                      <span class="prefix">$</span>
                      <input class="input" id="f_rent" type="number" value="1450" step="25">
                    </div>
                    <span class="field-hint">Pre-filled from property default ($1,450).</span>
                  </div>
                  <div class="field">
                    <label>Security deposit</label>
                    <div class="input-prefix">
                      <span class="prefix">$</span>
                      <input class="input" id="f_deposit" type="number" value="1450" step="25">
                    </div>
                    <span class="field-hint">Pre-filled to one month of rent.</span>
                  </div>
                  <div class="field">
                    <label>Rent due on</label>
                    <select class="select" id="f_day">
                      <option>1st of the month</option>
                      <option>5th of the month</option>
                      <option>15th of the month</option>
                      <option selected>1st — aligned with portfolio</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>Late fee grace</label>
                    <select class="select">
                      <option>3 days</option>
                      <option selected>5 days</option>
                      <option>7 days</option>
                      <option>No grace period</option>
                    </select>
                  </div>
                </div>

                <div class="form-section-head">
                  <h3>Lease window</h3>
                  <p>If they signed a paper lease before Tenantory, put those dates.</p>
                </div>
                <div class="field-grid">
                  <div class="field">
                    <label>Lease start</label>
                    <input class="input" id="f_start" type="date" value="2026-05-01">
                  </div>
                  <div class="field">
                    <label>Lease end</label>
                    <input class="input" id="f_end" type="date" value="2027-04-30">
                  </div>
                </div>

                <div class="form-section-head">
                  <h3>Pet policy</h3>
                  <p>This flags the unit if they bring an animal in later.</p>
                </div>
                <div class="chip-group">
                  <div class="chip-radio">
                    <input type="radio" name="pets" id="pets_none" checked>
                    <label for="pets_none">No pets</label>
                  </div>
                  <div class="chip-radio">
                    <input type="radio" name="pets" id="pets_cat">
                    <label for="pets_cat">Cats OK</label>
                  </div>
                  <div class="chip-radio">
                    <input type="radio" name="pets" id="pets_dog">
                    <label for="pets_dog">Dogs OK</label>
                  </div>
                  <div class="chip-radio">
                    <input type="radio" name="pets" id="pets_all">
                    <label for="pets_all">Pets allowed (all)</label>
                  </div>
                  <div class="chip-radio">
                    <input type="radio" name="pets" id="pets_case">
                    <label for="pets_case">Case by case</label>
                  </div>
                </div>

                <div class="form-section-head">
                  <h3>Existing lease PDF <span style="font-weight: 500; color: var(--text-faint); font-size: 12px;">— optional</span></h3>
                  <p>Upload the signed paper lease. We'll attach it to their profile so payments and maintenance stay tied to a real document.</p>
                </div>
                <div class="dropzone" onclick="event.preventDefault()">
                  <div class="dropzone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
                  </div>
                  <div class="dropzone-body">
                    <strong>Drop signed lease PDF here</strong>
                    <span>Or click to browse — PDF only, up to 25MB</span>
                  </div>
                  <div class="dropzone-action">Choose file</div>
                </div>

              </div>
              <div class="form-card-foot">
                <div class="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Projected ARR impact: <strong style="color: var(--text); margin-left: 4px;">+$17,400/yr</strong>
                </div>
                <div class="form-card-foot-right">
                  <button class="btn btn-ghost" type="button" data-prev="2">Back</button>
                  <button class="btn btn-primary" type="button" data-next="4">
                    Continue to review
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== STEP 4 ===== -->
            <div class="step-panel" data-panel="4">
              <div class="form-card-head">
                <h2>Review &amp; send portal invite</h2>
                <p>One last look. Edit any section before you hit create.</p>
              </div>
              <div class="form-card-body">

                <div class="summary-grid">
                  <div class="summary-card">
                    <h4>Tenant <a href="#" data-jump="1">Edit</a></h4>
                    <div class="summary-rows">
                      <div class="summary-row"><span>Name</span><span id="s_name">Ramon Jackson</span></div>
                      <div class="summary-row"><span>Email</span><span id="s_email">ramon.jackson@gmail.com</span></div>
                      <div class="summary-row"><span>Phone</span><span id="s_phone">(256) 555-0134</span></div>
                      <div class="summary-row"><span>Employer</span><span>Redstone Federal Credit Union</span></div>
                    </div>
                  </div>

                  <div class="summary-card">
                    <h4>Placement <a href="#" data-jump="2">Edit</a></h4>
                    <div class="summary-rows">
                      <div class="summary-row"><span>Property</span><span>908 Lee Dr NW</span></div>
                      <div class="summary-row"><span>Unit</span><span>Unit B (w/ Dana Meyer)</span></div>
                      <div class="summary-row"><span>Move-in</span><span>May 1, 2026</span></div>
                      <div class="summary-row"><span>Relationship</span><span>Tenant (standard)</span></div>
                    </div>
                  </div>

                  <div class="summary-card" style="grid-column: span 2;">
                    <h4>Lease <a href="#" data-jump="3">Edit</a></h4>
                    <div class="summary-rows" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px;">
                      <div class="summary-row"><span>Rent</span><span>$1,450 / mo</span></div>
                      <div class="summary-row"><span>Deposit</span><span>$1,450</span></div>
                      <div class="summary-row"><span>Term</span><span>May 1, 2026 — Apr 30, 2027</span></div>
                      <div class="summary-row"><span>Due day</span><span>1st of month</span></div>
                      <div class="summary-row"><span>Pet policy</span><span>No pets</span></div>
                      <div class="summary-row"><span>Signed lease</span><span style="color: var(--text-faint); font-weight: 500;">Not uploaded</span></div>
                    </div>
                  </div>
                </div>

                <div class="form-section-head" style="margin-top: 28px;">
                  <h3>Portal access</h3>
                  <p>How should Ramon get into Tenantory?</p>
                </div>

                <div class="option-list">
                  <div class="option selected" data-opt="invite">
                    <input type="radio" name="invite" checked>
                    <div class="option-radio"></div>
                    <div class="option-body">
                      <strong>Send portal invite now</strong>
                      <p>Ramon gets an email at ramon.jackson@gmail.com, sets his own password, and lands in the tenant portal.</p>
                    </div>
                  </div>
                  <div class="option" data-opt="later">
                    <input type="radio" name="invite">
                    <div class="option-radio"></div>
                    <div class="option-body">
                      <strong>Create without invite — I'll send it later</strong>
                      <p>Profile gets created, but no email goes out. You can invite from their tenant page whenever you're ready.</p>
                    </div>
                  </div>
                </div>

                <label class="check-row" id="skip_row">
                  <input type="checkbox" id="f_skip">
                  <div class="check-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div class="check-row-body">
                    <strong>Skip the onboarding flow for this tenant — they're already living here</strong>
                    <p>Drops them straight on the portal dashboard. No welcome tour, no "verify your ID," no autopay wizard. Good for grandfathered residents.</p>
                  </div>
                </label>

              </div>
              <div class="form-card-foot">
                <div class="form-card-foot-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Ready to create
                </div>
                <div class="form-card-foot-right">
                  <button class="btn btn-ghost" type="button" data-prev="3">Back</button>
                  <button class="btn btn-primary btn-lg" type="button" id="submit_btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    Create tenant &amp; send invite
                  </button>
                </div>
              </div>
            </div>

          </section>
        </div>

      </div>

    </main>
  </div>

  <!-- ===== SUCCESS OVERLAY ===== -->
  <div class="overlay" id="success_overlay">
    <div class="overlay-card">
      <div class="overlay-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 id="overlay_title">Ramon Jackson added. Portal invite sent.</h2>
      <p id="overlay_sub">They'll get a welcome email at ramon.jackson@gmail.com within the next minute. You can track whether they've activated from their tenant page.</p>

      <div class="overlay-actions">
        <a class="overlay-action" href="tenant-profile.html">
          <div class="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <strong>View tenant profile</strong>
          <span>Open Ramon's page</span>
        </a>
        <a class="overlay-action" href="admin-add-tenant.html">
          <div class="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <strong>Add another tenant</strong>
          <span>Keep going</span>
        </a>
        <a class="overlay-action" href="#" id="autopay_card">
          <div class="overlay-action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.2-8.55"/><polyline points="21 4 21 10 15 10"/></svg>
          </div>
          <strong>Set up autopay</strong>
          <span>For Ramon</span>
        </a>
      </div>

      <div class="overlay-foot">
        Changed your mind? <a href="tenants.html">Back to tenants list</a>
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
