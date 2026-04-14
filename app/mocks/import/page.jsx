"use client";

// Mock ported verbatim from ~/Desktop/tenantory/import.html.
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
    input, select { font-family: inherit; font-size: inherit; }

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

    /* ===== Sidebar (copied verbatim from admin-v2) ===== */
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
    .sb-brand-name {
      font-weight: 800; font-size: 18px; color: #fff;
      letter-spacing: -0.02em;
    }
    .sb-brand-ws {
      font-size: 11px; color: rgba(255,255,255,0.5);
      font-weight: 500; margin-top: 2px;
    }

    .sb-section {
      padding: 16px 12px;
      flex: 1; overflow-y: auto;
    }
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
    .sb-nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: #fff;
    }
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

    .sb-user {
      padding: 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .sb-user-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease;
      cursor: pointer;
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

    .content { flex: 1; overflow-y: auto; padding: 32px; }

    .page-head { margin-bottom: 28px; }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 6px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 680px; }

    /* ===== Buttons ===== */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 100px;
      font-weight: 600; font-size: 13px;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-primary:disabled { background: var(--border-strong); color: #fff; cursor: not-allowed; transform: none; }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e33a85; transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-ghost:disabled { color: var(--text-faint); cursor: not-allowed; }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Step indicator ===== */
    .stepper {
      display: flex; align-items: center; gap: 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 24px;
      margin-bottom: 24px;
    }
    .step {
      display: flex; align-items: center; gap: 12px;
      flex: 1; cursor: pointer;
      transition: all 0.15s ease;
    }
    .step-num {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface-alt); border: 1.5px solid var(--border);
      color: var(--text-muted); font-weight: 700; font-size: 13px;
      flex-shrink: 0; transition: all 0.2s ease;
    }
    .step-num svg { width: 14px; height: 14px; }
    .step-label {
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      letter-spacing: -0.01em;
    }
    .step-sub { font-size: 11px; color: var(--text-faint); margin-top: 1px; }
    .step.active .step-num {
      background: var(--pink); border-color: var(--pink);
      color: #fff; box-shadow: 0 4px 12px rgba(255,73,152,0.25);
    }
    .step.active .step-label { color: var(--text); }
    .step.done .step-num {
      background: var(--green); border-color: var(--green); color: #fff;
    }
    .step.done .step-label { color: var(--text); }
    .step-bar {
      flex: 0 0 40px; height: 2px; background: var(--border);
      margin: 0 4px; border-radius: 1px;
    }
    .step.done + .step-bar { background: var(--green); }

    /* ===== Panel card ===== */
    .panel {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      display: none; overflow: hidden;
    }
    .panel.active { display: block; }
    .panel-head {
      padding: 22px 28px 18px;
      border-bottom: 1px solid var(--border);
    }
    .panel-head h2 {
      font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
      color: var(--text); margin-bottom: 4px;
    }
    .panel-head p { color: var(--text-muted); font-size: 13px; }
    .panel-body { padding: 28px; }

    /* ===== Step 1: Source cards ===== */
    .source-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .source-card {
      background: var(--surface); border: 1.5px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      cursor: pointer; transition: all 0.2s ease;
      display: flex; flex-direction: column; gap: 14px;
      text-align: left;
    }
    .source-card:hover {
      border-color: var(--blue); transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    .source-card.selected {
      border-color: var(--pink);
      box-shadow: 0 0 0 3px rgba(255,73,152,0.12);
    }
    .source-head { display: flex; align-items: center; gap: 14px; }
    .source-logo {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 800; font-size: 18px;
      letter-spacing: -0.02em; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(26,31,54,0.1);
    }
    .source-logo.appfolio { background: linear-gradient(135deg, #0d47a1, #1976d2); }
    .source-logo.buildium { background: linear-gradient(135deg, #00897b, #4db6ac); }
    .source-logo.doorloop { background: linear-gradient(135deg, #6a1b9a, #ab47bc); }
    .source-logo.csv { background: linear-gradient(135deg, var(--navy), var(--blue-bright)); }
    .source-name { font-weight: 700; font-size: 16px; color: var(--text); letter-spacing: -0.01em; }
    .source-meta { font-size: 12px; color: var(--text-faint); margin-top: 2px; }
    .source-desc { color: var(--text-muted); font-size: 13px; line-height: 1.55; }
    .source-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .source-chip {
      font-size: 11px; font-weight: 600;
      background: var(--blue-pale); color: var(--blue);
      padding: 4px 9px; border-radius: 100px;
    }
    .source-cta {
      margin-top: auto;
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: var(--blue);
      padding-top: 10px; border-top: 1px solid var(--border);
    }
    .source-card:hover .source-cta { color: var(--pink); }

    /* ===== Step 2: Upload ===== */
    .dropzone {
      border: 2px dashed var(--border-strong);
      border-radius: var(--radius-lg);
      padding: 56px 32px; text-align: center;
      background: var(--surface-subtle);
      transition: all 0.2s ease; cursor: pointer;
    }
    .dropzone:hover, .dropzone.hover {
      border-color: var(--blue);
      background: var(--blue-pale);
    }
    .dropzone-icon {
      width: 56px; height: 56px; border-radius: 14px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .dropzone-icon svg { width: 26px; height: 26px; }
    .dropzone h3 {
      font-size: 16px; font-weight: 700; color: var(--text);
      margin-bottom: 6px; letter-spacing: -0.01em;
    }
    .dropzone p { color: var(--text-muted); font-size: 13px; margin-bottom: 14px; }
    .dropzone-meta {
      font-size: 12px; color: var(--text-faint);
      display: flex; align-items: center; justify-content: center; gap: 14px;
    }
    .dropzone-meta span { display: inline-flex; align-items: center; gap: 5px; }
    .dropzone-meta svg { width: 12px; height: 12px; }

    .uploaded-file {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; background: var(--surface);
      border: 1.5px solid var(--green);
      border-radius: var(--radius-lg); margin-top: 16px;
      box-shadow: 0 0 0 3px rgba(30,169,124,0.08);
    }
    .file-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .file-icon svg { width: 20px; height: 20px; }
    .file-info { flex: 1; min-width: 0; }
    .file-name { font-weight: 600; color: var(--text); font-size: 14px; }
    .file-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .file-remove {
      color: var(--text-faint); padding: 6px; border-radius: 6px;
      transition: all 0.15s ease;
    }
    .file-remove:hover { background: var(--red-bg); color: var(--red); }
    .file-remove svg { width: 16px; height: 16px; }

    .format-hint {
      margin-top: 18px; padding: 14px 16px;
      background: var(--blue-pale); border-radius: var(--radius);
      font-size: 12px; color: var(--blue);
      display: flex; align-items: flex-start; gap: 10px;
    }
    .format-hint svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
    .format-hint strong { font-weight: 700; }
    .format-hint a { color: var(--blue); text-decoration: underline; font-weight: 600; }

    /* ===== Step 3: Mapping ===== */
    .map-table {
      width: 100%; border-collapse: collapse;
    }
    .map-table thead th {
      text-align: left; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .map-table tbody td {
      padding: 12px 14px; border-bottom: 1px solid var(--border);
      font-size: 13px; vertical-align: middle;
    }
    .map-table tbody tr:last-child td { border-bottom: none; }
    .col-name {
      font-family: 'JetBrains Mono', monospace; font-weight: 500;
      color: var(--text); font-size: 12px;
    }
    .col-sample { color: var(--text-faint); font-size: 12px; font-style: italic; }
    .map-arrow { color: var(--text-faint); text-align: center; }
    .map-arrow svg { width: 16px; height: 16px; margin: 0 auto; }
    .map-select {
      width: 100%; padding: 8px 32px 8px 12px;
      border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); color: var(--text);
      font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.15s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }
    .map-select:hover { border-color: var(--blue); }
    .map-select:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .map-select.unsure { border-color: var(--orange); background-color: rgba(234,140,58,0.04); }
    .map-status { text-align: right; }
    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 10px; font-weight: 700;
      padding: 3px 8px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .pill.confident { background: var(--green-bg); color: var(--green-dark); }
    .pill.unsure { background: var(--orange-bg); color: var(--orange); }
    .pill.skip { background: var(--surface-alt); color: var(--text-faint); }
    .pill svg { width: 10px; height: 10px; }

    /* ===== Step 4: Preview ===== */
    .preview-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 12px; margin-bottom: 22px;
    }
    .stat-card {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px;
      display: flex; align-items: center; gap: 12px;
    }
    .stat-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon svg { width: 20px; height: 20px; }
    .stat-val { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
    .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }

    .preview-section-title {
      font-size: 13px; font-weight: 700; color: var(--text);
      margin-bottom: 10px; letter-spacing: -0.01em;
      display: flex; align-items: center; justify-content: space-between;
    }
    .preview-section-title span { font-size: 11px; font-weight: 500; color: var(--text-faint); }

    .preview-table {
      width: 100%; border-collapse: collapse;
      border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
    }
    .preview-table thead th {
      text-align: left; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--text-muted); padding: 10px 12px;
      background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    .preview-table tbody td {
      padding: 11px 12px; font-size: 12px; color: var(--text);
      border-bottom: 1px solid var(--border);
    }
    .preview-table tbody tr:last-child td { border-bottom: none; }
    .preview-table tbody tr:hover { background: var(--surface-subtle); }

    .error-row {
      margin-top: 14px;
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: var(--red-bg); border: 1px solid rgba(214,69,69,0.25);
      border-radius: var(--radius); cursor: pointer;
      transition: all 0.15s ease;
    }
    .error-row:hover { background: rgba(214,69,69,0.18); }
    .error-row svg { width: 18px; height: 18px; color: var(--red); flex-shrink: 0; }
    .error-row-text { flex: 1; font-size: 13px; color: var(--red); font-weight: 600; }
    .error-row-cta { font-size: 12px; color: var(--red); font-weight: 700; }

    /* ===== Step 5: Import progress ===== */
    .import-progress {
      padding: 40px 20px; text-align: center;
    }
    .progress-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(18,81,173,0.25); }
      50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(18,81,173,0); }
    }
    .progress-icon svg { width: 32px; height: 32px; }
    .progress-title {
      font-size: 20px; font-weight: 700; color: var(--text);
      letter-spacing: -0.02em; margin-bottom: 6px;
    }
    .progress-sub {
      font-size: 13px; color: var(--text-muted); margin-bottom: 24px;
    }
    .progress-bar-wrap {
      max-width: 460px; margin: 0 auto;
      background: var(--surface-alt); border-radius: 100px;
      height: 10px; overflow: hidden;
      border: 1px solid var(--border);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--blue-bright), var(--pink));
      width: 0%; border-radius: 100px;
      transition: width 0.3s ease;
    }
    .progress-pct {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--text-muted); margin-top: 10px;
    }
    .progress-log {
      max-width: 460px; margin: 22px auto 0;
      text-align: left; font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--text-muted);
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
      height: 120px; overflow-y: auto;
    }
    .progress-log div { padding: 2px 0; }
    .progress-log .ok { color: var(--green-dark); }
    .progress-log .info { color: var(--blue); }

    /* Success overlay */
    .success-panel {
      display: none;
      padding: 40px 28px; text-align: center;
    }
    .success-panel.shown { display: block; }
    .success-icon {
      width: 84px; height: 84px; border-radius: 50%;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @keyframes pop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.12); }
      100% { transform: scale(1); opacity: 1; }
    }
    .success-icon svg { width: 40px; height: 40px; }
    .success-panel h3 {
      font-size: 24px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; margin-bottom: 8px;
    }
    .success-panel > p {
      color: var(--text-muted); font-size: 14px; margin-bottom: 28px;
    }
    .success-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 12px; max-width: 540px; margin: 0 auto 28px;
    }
    .success-stat {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 18px 14px;
    }
    .success-stat .num {
      font-size: 28px; font-weight: 800; color: var(--green-dark);
      letter-spacing: -0.02em; line-height: 1;
    }
    .success-stat .lbl {
      font-size: 12px; color: var(--text-muted); margin-top: 6px; font-weight: 500;
    }
    .success-actions {
      display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
    }

    /* ===== Panel footer ===== */
    .panel-footer {
      padding: 16px 28px;
      border-top: 1px solid var(--border);
      background: var(--surface-subtle);
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .footer-left { font-size: 12px; color: var(--text-faint); }
    .footer-right { display: flex; gap: 10px; }

    /* ===== Bottom skip link ===== */
    .skip-link {
      text-align: center; margin-top: 18px;
      font-size: 12px; color: var(--text-faint);
    }
    .skip-link a { color: var(--text-muted); text-decoration: underline; font-weight: 500; }
    .skip-link a:hover { color: var(--blue); }`;

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
        </div>

        <div class="sb-section-label" style="margin-top: 20px;">Workspace</div>
        <div class="sb-nav">
          <a class="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5"/></svg>Settings
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
          <a href="admin-v2.html">Workspace</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <a href="settings.html">Settings</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Bulk import</strong>
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

        <div class="page-head">
          <h1>Import tenants, leases, and properties from your old system</h1>
          <p>Bring your existing portfolio into Tenantory in five guided steps. We'll auto-detect common exports from AppFolio, Buildium, and DoorLoop — and you can map columns yourself if you're coming from something custom.</p>
        </div>

        <!-- Step indicator -->
        <div class="stepper" id="stepper">
          <div class="step active" data-step="1">
            <div class="step-num">1</div>
            <div>
              <div class="step-label">Source</div>
              <div class="step-sub">Pick your old system</div>
            </div>
          </div>
          <div class="step-bar"></div>
          <div class="step" data-step="2">
            <div class="step-num">2</div>
            <div>
              <div class="step-label">Upload</div>
              <div class="step-sub">Drop the CSV</div>
            </div>
          </div>
          <div class="step-bar"></div>
          <div class="step" data-step="3">
            <div class="step-num">3</div>
            <div>
              <div class="step-label">Map</div>
              <div class="step-sub">Match columns</div>
            </div>
          </div>
          <div class="step-bar"></div>
          <div class="step" data-step="4">
            <div class="step-num">4</div>
            <div>
              <div class="step-label">Preview</div>
              <div class="step-sub">Review rows</div>
            </div>
          </div>
          <div class="step-bar"></div>
          <div class="step" data-step="5">
            <div class="step-num">5</div>
            <div>
              <div class="step-label">Import</div>
              <div class="step-sub">Go live</div>
            </div>
          </div>
        </div>

        <!-- ===== Panel 1: Source ===== -->
        <div class="panel active" data-panel="1">
          <div class="panel-head">
            <h2>Where's your data coming from?</h2>
            <p>Select your previous property management system. We'll auto-detect the column layout and pre-map fields for you.</p>
          </div>
          <div class="panel-body">
            <div class="source-grid">

              <button class="source-card" data-source="appfolio">
                <div class="source-head">
                  <div class="source-logo appfolio">Af</div>
                  <div>
                    <div class="source-name">AppFolio</div>
                    <div class="source-meta">Property Manager export · tenants.csv</div>
                  </div>
                </div>
                <div class="source-desc">We recognize AppFolio's "Tenant Directory" and "Rent Roll" exports, including unit references and move-in dates.</div>
                <div class="source-chips">
                  <span class="source-chip">Tenant Name</span>
                  <span class="source-chip">Unit</span>
                  <span class="source-chip">Rent</span>
                  <span class="source-chip">Move-in</span>
                </div>
                <div class="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </button>

              <button class="source-card" data-source="buildium">
                <div class="source-head">
                  <div class="source-logo buildium">Bu</div>
                  <div>
                    <div class="source-name">Buildium</div>
                    <div class="source-meta">Rentals export · rental_owners.xlsx</div>
                  </div>
                </div>
                <div class="source-desc">Reads Buildium's Lease Listing and Tenant Balance reports. Handles co-tenants and security deposit fields automatically.</div>
                <div class="source-chips">
                  <span class="source-chip">Lease Start</span>
                  <span class="source-chip">Lease End</span>
                  <span class="source-chip">Deposit</span>
                  <span class="source-chip">Balance</span>
                </div>
                <div class="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </button>

              <button class="source-card" data-source="doorloop">
                <div class="source-head">
                  <div class="source-logo doorloop">Dl</div>
                  <div>
                    <div class="source-name">DoorLoop</div>
                    <div class="source-meta">People export · tenants_full.csv</div>
                  </div>
                </div>
                <div class="source-desc">Parses DoorLoop's People and Lease exports. Pulls emergency contacts, vehicle info, and notes into custom fields.</div>
                <div class="source-chips">
                  <span class="source-chip">Full Name</span>
                  <span class="source-chip">Email</span>
                  <span class="source-chip">Phone</span>
                  <span class="source-chip">Notes</span>
                </div>
                <div class="source-cta">
                  I've got their export
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </button>

              <button class="source-card" data-source="csv">
                <div class="source-head">
                  <div class="source-logo csv">Cs</div>
                  <div>
                    <div class="source-name">Generic CSV</div>
                    <div class="source-meta">Spreadsheet · any format</div>
                  </div>
                </div>
                <div class="source-desc">Coming from Excel, Google Sheets, or a custom system? Upload any CSV and we'll walk you through mapping it yourself.</div>
                <div class="source-chips">
                  <span class="source-chip">Any columns</span>
                  <span class="source-chip">Manual mapping</span>
                </div>
                <div class="source-cta">
                  Use my own spreadsheet
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </button>

            </div>
          </div>
          <div class="panel-footer">
            <div class="footer-left">Step 1 of 5 · Pick a source to continue</div>
            <div class="footer-right">
              <button class="btn btn-ghost" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary" id="next-1" disabled>
                Next: Upload
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Panel 2: Upload ===== -->
        <div class="panel" data-panel="2">
          <div class="panel-head">
            <h2>Upload your <span id="source-name-2">AppFolio</span> export</h2>
            <p>Drop the file below or click to browse. We accept .csv and .xlsx up to 25 MB.</p>
          </div>
          <div class="panel-body">
            <div class="dropzone" id="dropzone">
              <div class="dropzone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <h3>Drop your file here, or click to browse</h3>
              <p>We'll scan the first 1,000 rows to auto-detect columns.</p>
              <div class="dropzone-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                  .csv, .xlsx
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Up to 25 MB
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Encrypted in transit
                </span>
              </div>
            </div>

            <div class="uploaded-file" id="uploaded-file" style="display:none;">
              <div class="file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
              </div>
              <div class="file-info">
                <div class="file-name">blackbear_tenants_export_2026-04-14.csv</div>
                <div class="file-meta">284 KB · 47 rows · 18 columns detected · Parsed in 0.3s</div>
              </div>
              <button class="file-remove" id="file-remove" title="Remove file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="format-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <div>
                <strong>Not sure which file?</strong> From <span id="source-name-hint">AppFolio</span>, go to <em>Reports → Tenant Directory → Export CSV</em>. First row should be column headers.
                <a href="#">Download a sample CSV template</a>.
              </div>
            </div>
          </div>
          <div class="panel-footer">
            <div class="footer-left">Step 2 of 5 · Upload your export</div>
            <div class="footer-right">
              <button class="btn btn-ghost" data-back>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary" id="next-2" disabled>
                Next: Map columns
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Panel 3: Map ===== -->
        <div class="panel" data-panel="3">
          <div class="panel-head">
            <h2>Map your columns</h2>
            <p>We auto-detected most of your fields. Review the matches below — amber rows need your attention before you can continue.</p>
          </div>
          <div class="panel-body" style="padding: 0;">
            <table class="map-table">
              <thead>
                <tr>
                  <th style="width: 28%;">Your column</th>
                  <th style="width: 20%;">Sample value</th>
                  <th style="width: 4%;"></th>
                  <th style="width: 32%;">Tenantory field</th>
                  <th style="width: 16%; text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody id="map-tbody">
                <!-- rows injected by JS -->
              </tbody>
            </table>
          </div>
          <div class="panel-footer">
            <div class="footer-left"><span id="map-summary">10 of 12 mapped · 2 unsure</span></div>
            <div class="footer-right">
              <button class="btn btn-ghost" data-back>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-primary" id="next-3">
                Next: Preview
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Panel 4: Preview ===== -->
        <div class="panel" data-panel="4">
          <div class="panel-head">
            <h2>Preview your import</h2>
            <p>Here's how the first 5 rows will look in Tenantory. Everything green is ready. Anything red needs a second look.</p>
          </div>
          <div class="panel-body">

            <div class="preview-stats">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div class="stat-val">47</div>
                  <div class="stat-label">Tenants ready to import</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 14h6M9 18h6"/></svg>
                </div>
                <div>
                  <div class="stat-val">12</div>
                  <div class="stat-label">Leases detected</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                </div>
                <div>
                  <div class="stat-val">4</div>
                  <div class="stat-label">Properties to create</div>
                </div>
              </div>
            </div>

            <div class="preview-section-title">
              Sample rows <span>Showing 5 of 47</span>
            </div>

            <div style="overflow-x: auto;">
              <table class="preview-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Property</th>
                    <th>Room</th>
                    <th>Rent</th>
                    <th>Lease start</th>
                    <th>Lease end</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Marcus Whitfield</td>
                    <td>marcus.w@gmail.com</td>
                    <td>(256) 555-0142</td>
                    <td>3026 Turf Ave NW</td>
                    <td>A</td>
                    <td>$925</td>
                    <td>Aug 1, 2025</td>
                    <td>Jul 31, 2026</td>
                  </tr>
                  <tr>
                    <td>Jasmine Okonkwo</td>
                    <td>jokonkwo@outlook.com</td>
                    <td>(256) 555-0198</td>
                    <td>3026 Turf Ave NW</td>
                    <td>B</td>
                    <td>$950</td>
                    <td>Sep 15, 2025</td>
                    <td>Sep 14, 2026</td>
                  </tr>
                  <tr>
                    <td>Devon Ramirez</td>
                    <td>devon.ramirez@yahoo.com</td>
                    <td>(256) 555-0276</td>
                    <td>908 Lee Dr NW</td>
                    <td>2</td>
                    <td>$875</td>
                    <td>Jun 1, 2025</td>
                    <td>May 31, 2026</td>
                  </tr>
                  <tr>
                    <td>Priya Shankar</td>
                    <td>p.shankar@uah.edu</td>
                    <td>(256) 555-0311</td>
                    <td>908 Lee Dr NW</td>
                    <td>3</td>
                    <td>$895</td>
                    <td>Jan 8, 2026</td>
                    <td>Jan 7, 2027</td>
                  </tr>
                  <tr>
                    <td>Thomas Breaux</td>
                    <td>tbreaux.work@icloud.com</td>
                    <td>(256) 555-0489</td>
                    <td>1205 Poplar St SW</td>
                    <td>Whole</td>
                    <td>$1,450</td>
                    <td>Oct 1, 2025</td>
                    <td>Sep 30, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="error-row" onclick="alert('Validation details:\\n\\n• Row 14: Missing email for Kenji Alvarado\\n• Row 22: Bad phone format — \\'25655501xx\\' is not valid\\n• Row 31: Lease end (2024-12-31) is before lease start (2025-03-01)')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <div class="error-row-text">3 validation errors detected — missing email, bad phone format, and a lease end before start</div>
              <div class="error-row-cta">Click to review →</div>
            </div>

          </div>
          <div class="panel-footer">
            <div class="footer-left">Step 4 of 5 · Clean import looks ready</div>
            <div class="footer-right">
              <button class="btn btn-ghost" data-back>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
              <button class="btn btn-pink" id="next-4">
                Start import
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Panel 5: Import ===== -->
        <div class="panel" data-panel="5">
          <div class="panel-head">
            <h2>Importing to Tenantory</h2>
            <p>Hang tight — we're writing everything into your workspace. This usually takes under a minute.</p>
          </div>
          <div class="panel-body">

            <!-- Progress state -->
            <div class="import-progress" id="import-progress">
              <div class="progress-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <div class="progress-title" id="progress-title">Importing your records…</div>
              <div class="progress-sub" id="progress-sub">Writing tenants, leases, and properties into Tenantory.</div>
              <div class="progress-bar-wrap">
                <div class="progress-bar" id="progress-bar"></div>
              </div>
              <div class="progress-pct" id="progress-pct">0%</div>
              <div class="progress-log" id="progress-log">
                <div class="info">→ Preparing import payload…</div>
              </div>
            </div>

            <!-- Success state -->
            <div class="success-panel" id="success-panel">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
              </div>
              <h3>Your portfolio is live in Tenantory</h3>
              <p>All done. You can manage your tenants, leases, and properties like you've always been here.</p>
              <div class="success-stats">
                <div class="success-stat">
                  <div class="num">47</div>
                  <div class="lbl">Tenants imported</div>
                </div>
                <div class="success-stat">
                  <div class="num">12</div>
                  <div class="lbl">Leases imported</div>
                </div>
                <div class="success-stat">
                  <div class="num">4</div>
                  <div class="lbl">Properties created</div>
                </div>
              </div>
              <div class="success-actions">
                <a class="btn btn-primary" href="tenants.html">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Go to Tenants
                </a>
                <a class="btn btn-ghost" href="admin-v2.html">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  Go to Dashboard
                </a>
                <button class="btn btn-ghost" id="btn-another">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></svg>
                  Import another batch
                </button>
              </div>
            </div>

          </div>
        </div>

        <div class="skip-link">
          <a href="settings.html">I'll import manually later — take me back to Settings</a>
        </div>

      </div>

    </main>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
