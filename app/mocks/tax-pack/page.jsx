"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tax-pack.html.
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
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb a { color: var(--text-muted); transition: color 0.15s ease; }
    .topbar-breadcrumb a:hover { color: var(--blue); }
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
    .content { flex: 1; overflow-y: auto; padding: 32px; }
    .content-inner { max-width: 1280px; margin: 0 auto; }

    /* Breadcrumb (inline) */
    .crumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--text-muted); margin-bottom: 14px;
    }
    .crumb a { color: var(--text-muted); transition: color 0.15s ease; }
    .crumb a:hover { color: var(--blue); }
    .crumb svg { width: 12px; height: 12px; opacity: 0.5; }
    .crumb strong { color: var(--text); font-weight: 600; }

    .page-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 20px; margin-bottom: 24px; flex-wrap: wrap;
    }
    .page-head h1 {
      font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
      color: var(--text); margin-bottom: 6px;
    }
    .page-head p { color: var(--text-muted); font-size: 14px; max-width: 640px; }
    .page-head-actions { display: flex; gap: 10px; align-items: center; }

    /* ===== Buttons ===== */
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
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e8397f; transform: translateY(-1px); }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 12px 22px; font-size: 14px; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Cards ===== */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .card-head {
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .card-head h3 {
      font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em;
    }
    .card-head p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .card-body { padding: 20px; }

    /* ===== Year + entity selectors ===== */
    .controls-row {
      display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
      align-items: stretch;
    }
    .seg {
      display: inline-flex; background: var(--surface);
      border: 1px solid var(--border); border-radius: 100px; padding: 4px;
      box-shadow: var(--shadow-sm);
    }
    .seg-btn {
      padding: 8px 18px; font-size: 13px; font-weight: 600;
      color: var(--text-muted); border-radius: 100px;
      transition: all 0.15s ease;
    }
    .seg-btn:hover { color: var(--text); }
    .seg-btn.active { background: var(--navy); color: #fff; box-shadow: var(--shadow-sm); }
    .seg-btn .tag {
      font-size: 10px; font-weight: 700; padding: 1px 6px;
      border-radius: 100px; background: var(--pink-bg); color: var(--pink);
      margin-left: 6px;
    }
    .seg-btn.active .tag { background: rgba(255,255,255,0.2); color: #fff; }

    .entity-wrap {
      display: flex; align-items: center; gap: 10px; flex: 1;
      min-width: 320px;
    }
    .entity-label {
      font-size: 13px; font-weight: 600; color: var(--text-muted);
    }
    .entity-select {
      flex: 1; background: var(--surface);
      border: 1px solid var(--border); border-radius: 100px;
      padding: 10px 18px 10px 14px;
      font-size: 13px; font-weight: 600; color: var(--text);
      appearance: none;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 16px center;
      padding-right: 40px;
      box-shadow: var(--shadow-sm); cursor: pointer;
      transition: all 0.15s ease;
    }
    .entity-select:hover { border-color: var(--border-strong); }
    .entity-select:focus { outline: none; border-color: var(--blue); background-color: #fff; }

    /* ===== Summary card (hero) ===== */
    .summary {
      background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
      border-radius: var(--radius-lg); padding: 28px 32px;
      color: #fff; margin-bottom: 24px;
      position: relative; overflow: hidden;
    }
    .summary::after {
      content: ""; position: absolute; right: -60px; top: -60px;
      width: 240px; height: 240px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);
    }
    .summary-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 22px; position: relative; z-index: 1; gap: 16px;
    }
    .summary-label {
      display: inline-block; background: rgba(255,255,255,0.15); color: #fff;
      padding: 4px 12px; border-radius: 100px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.14em;
      text-transform: uppercase; margin-bottom: 8px;
    }
    .summary-head h2 {
      color: #fff; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
    }
    .summary-head p {
      color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 4px;
    }
    .summary-live {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; color: rgba(255,255,255,0.85);
      background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 100px;
      font-weight: 600;
    }
    .summary-live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
      box-shadow: 0 0 0 4px rgba(74,222,128,0.25);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .summary-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 24px; position: relative; z-index: 1;
    }
    .summary-metric-label {
      font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
    }
    .summary-metric-label svg { width: 12px; height: 12px; opacity: 0.7; }
    .summary-metric-value {
      font-size: 30px; font-weight: 800; color: #fff;
      letter-spacing: -0.02em; line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .summary-metric-value.net { color: #80ffc6; }
    .summary-metric-value.exp { color: #ffd3a0; }
    .summary-metric-delta {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 600; margin-top: 8px;
      background: rgba(255,255,255,0.1); padding: 3px 10px;
      border-radius: 100px;
    }
    .summary-metric-delta svg { width: 11px; height: 11px; }
    .summary-metric-delta.up { color: #80ffc6; }
    .summary-metric-delta.down { color: #ffb4b4; }
    .summary-line {
      font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;
      font-style: italic;
    }

    /* ===== Two-col tax pack contents ===== */
    .section-title {
      font-size: 18px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em; margin: 32px 0 14px;
    }
    .section-title-row {
      display: flex; justify-content: space-between; align-items: center;
      margin: 32px 0 14px;
    }
    .section-title-row h2 {
      font-size: 18px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em;
    }
    .section-sub { font-size: 13px; color: var(--text-muted); }

    .pack-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .pack-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
      display: flex; gap: 14px; align-items: flex-start;
      transition: all 0.15s ease; position: relative;
    }
    .pack-card:hover {
      border-color: var(--blue); transform: translateY(-1px);
      box-shadow: var(--shadow);
    }
    .pack-card-icon {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .pack-card-icon.blue { background: var(--blue-pale); color: var(--blue); }
    .pack-card-icon.green { background: var(--green-bg); color: var(--green-dark); }
    .pack-card-icon.pink { background: var(--pink-bg); color: var(--pink); }
    .pack-card-icon.orange { background: var(--orange-bg); color: var(--orange); }
    .pack-card-icon svg { width: 22px; height: 22px; }
    .pack-card-body { flex: 1; min-width: 0; }
    .pack-card-title {
      font-size: 14px; font-weight: 700; color: var(--text);
      margin-bottom: 4px; display: flex; align-items: center; gap: 8px;
    }
    .pack-card-title .pages {
      font-size: 11px; font-weight: 600; color: var(--text-faint);
      background: var(--surface-alt); padding: 2px 8px; border-radius: 100px;
    }
    .pack-card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
    .pack-card-meta {
      font-size: 11px; color: var(--text-faint); margin-top: 8px;
      display: flex; align-items: center; gap: 4px;
    }
    .pack-card-meta svg { width: 10px; height: 10px; }

    /* ===== Schedule E Preview ===== */
    .form-preview-wrap {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      box-shadow: var(--shadow);
    }
    .form-preview-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .form-preview-head h3 {
      font-size: 15px; font-weight: 700; color: var(--text);
    }
    .form-preview-actions { display: flex; gap: 8px; align-items: center; }
    .zoom-group {
      display: inline-flex; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 8px; padding: 2px;
    }
    .zoom-btn {
      padding: 4px 10px; font-size: 11px; font-weight: 600;
      color: var(--text-muted); border-radius: 6px;
    }
    .zoom-btn.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }

    .form-paper {
      background:
        linear-gradient(#fffef8, #fffef8),
        repeating-linear-gradient(0deg, rgba(0,0,0,0.015), rgba(0,0,0,0.015) 1px, transparent 1px, transparent 4px);
      background-blend-mode: multiply;
      border: 1px solid #d9d5c4;
      border-radius: 4px;
      padding: 28px 36px;
      font-family: 'Courier Prime', 'Courier New', monospace;
      color: #1a1a1a;
      position: relative;
      box-shadow: inset 0 0 40px rgba(196,180,110,0.05), 0 2px 8px rgba(0,0,0,0.05);
    }
    .form-watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-20deg);
      font-size: 80px; font-weight: 800; letter-spacing: 0.1em;
      color: rgba(47,62,131,0.06); pointer-events: none;
      white-space: nowrap; font-family: 'Inter', sans-serif;
    }
    .form-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding-bottom: 10px; border-bottom: 2px solid #1a1a1a;
      margin-bottom: 14px;
    }
    .form-header-left {
      display: flex; gap: 10px; align-items: flex-start;
    }
    .form-schedule-label {
      border: 2px solid #1a1a1a; padding: 4px 10px;
      font-weight: 700; font-size: 18px;
      font-family: 'Inter', sans-serif;
    }
    .form-title { font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
    .form-subtitle { font-size: 10px; margin-top: 2px; color: #4a4a4a; }
    .form-omb { font-size: 10px; text-align: right; color: #4a4a4a; line-height: 1.4; }
    .form-part-header {
      background: #1a1a1a; color: #fffef8; padding: 4px 10px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
      margin: 12px 0 10px;
      font-family: 'Inter', sans-serif;
    }
    .form-row {
      display: grid; grid-template-columns: 20px 1fr 2fr;
      gap: 10px; padding: 5px 0;
      border-bottom: 1px dotted #b8b2a1;
      align-items: center; font-size: 11px;
    }
    .form-line-num {
      font-weight: 700; font-size: 11px;
      width: 22px; height: 22px;
      border: 1px solid #1a1a1a;
      display: flex; align-items: center; justify-content: center;
      background: #fffef8;
    }
    .form-line-label { font-size: 11px; }
    .form-line-value {
      text-align: right; font-weight: 700;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #1a1a1a;
      padding: 2px 8px;
      background: rgba(255,253,190,0.35);
    }
    .form-line-value.empty { background: #fffef8; color: transparent; }

    .form-props-table {
      width: 100%; margin-top: 6px;
      font-size: 10px; border-collapse: collapse;
    }
    .form-props-table th {
      background: #e8e3d0; border: 1px solid #1a1a1a;
      padding: 4px 6px; text-align: left; font-weight: 700;
      font-family: 'Inter', sans-serif; font-size: 10px;
    }
    .form-props-table th.num { text-align: right; width: 90px; }
    .form-props-table td {
      border: 1px solid #1a1a1a; padding: 5px 6px;
      font-size: 10px;
    }
    .form-props-table td.num {
      text-align: right; font-weight: 700;
      background: rgba(255,253,190,0.35);
      letter-spacing: 0.03em;
    }
    .form-props-table td.label {
      font-size: 9px; color: #4a4a4a;
      font-weight: 700; letter-spacing: 0.04em;
      background: #f5efd8;
      font-family: 'Inter', sans-serif;
    }
    .form-props-table tr.totals td {
      border-top: 2px solid #1a1a1a;
      background: #e8e3d0; font-weight: 800;
    }
    .form-props-table tr.totals td.num {
      background: #ffe38a; font-weight: 800;
    }
    .form-footer {
      display: flex; justify-content: space-between;
      font-size: 9px; color: #4a4a4a; margin-top: 14px;
      padding-top: 8px; border-top: 1px solid #b8b2a1;
      font-family: 'Inter', sans-serif;
    }

    /* ===== Per-property table ===== */
    .prop-table { width: 100%; }
    .prop-row-head {
      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;
      gap: 16px; padding: 12px 20px;
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
    }
    .prop-row-head .num { text-align: right; }
    .prop-row {
      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;
      gap: 16px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .prop-row:hover { background: var(--surface-subtle); }
    .prop-row.expanded { background: var(--blue-pale); }
    .prop-row .chev {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); background: var(--surface-alt);
      transition: transform 0.15s ease;
    }
    .prop-row.expanded .chev {
      transform: rotate(90deg); background: var(--blue); color: #fff;
    }
    .prop-row .chev svg { width: 12px; height: 12px; }
    .prop-address { display: flex; flex-direction: column; gap: 2px; }
    .prop-address-main { font-weight: 700; color: var(--text); font-size: 13px; }
    .prop-address-meta { font-size: 11px; color: var(--text-faint); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .num-amt { font-weight: 700; color: var(--text); }
    .num-exp { color: var(--orange); font-weight: 600; }
    .num-dep { color: var(--blue); font-weight: 600; }
    .num-net { font-weight: 800; color: var(--green-dark); }
    .num-net.neg { color: var(--red); }
    .prop-action { display: flex; justify-content: flex-end; }

    .prop-expand {
      grid-column: 1 / -1;
      padding: 16px 60px 22px;
      background: var(--blue-pale);
      border-bottom: 1px solid var(--border);
      display: none;
    }
    .prop-expand.open { display: block; }
    .prop-expand-title {
      font-size: 11px; font-weight: 700; color: var(--navy);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 10px;
    }
    .cat-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 8px 32px;
    }
    .cat-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 7px 0; border-bottom: 1px dashed rgba(47,62,131,0.15);
      font-size: 12px;
    }
    .cat-row-label { color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
    .cat-row-label svg { width: 11px; height: 11px; color: var(--text-faint); }
    .cat-row-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }

    .prop-totals {
      display: grid; grid-template-columns: 28px 2.4fr 1fr 1fr 1fr 1fr 32px;
      gap: 16px; padding: 14px 20px;
      background: var(--navy); color: #fff;
      font-weight: 800; font-size: 13px; letter-spacing: -0.01em;
    }
    .prop-totals .num { color: #fff; }
    .prop-totals .net { color: #80ffc6; }

    /* ===== Donut chart + category legend ===== */
    .donut-wrap {
      display: grid; grid-template-columns: 240px 1fr;
      gap: 28px; padding: 20px 24px; align-items: center;
    }
    .donut {
      position: relative; width: 220px; height: 220px;
      margin: 0 auto;
    }
    .donut-center {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center;
    }
    .donut-center-label {
      font-size: 10px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .donut-center-value {
      font-size: 24px; font-weight: 800; color: var(--text);
      letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
    }
    .donut-center-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .legend { display: flex; flex-direction: column; gap: 10px; }
    .legend-row {
      display: grid; grid-template-columns: 14px 1fr 90px 50px;
      gap: 12px; align-items: center; font-size: 13px;
    }
    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend-label { color: var(--text); font-weight: 500; }
    .legend-amt { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; text-align: right; }
    .legend-pct {
      font-size: 11px; color: var(--text-muted);
      text-align: right; font-variant-numeric: tabular-nums;
      font-weight: 600;
    }

    /* ===== 1099 vendors ===== */
    .v-row {
      display: grid; grid-template-columns: 40px 2fr 1.2fr 1fr 1fr auto;
      gap: 16px; padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      align-items: center; font-size: 13px;
    }
    .v-row:last-child { border-bottom: none; }
    .v-row-head {
      background: var(--surface-alt);
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .v-avatar {
      width: 34px; height: 34px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
      background: var(--blue-pale); color: var(--blue);
    }
    .v-avatar.green { background: var(--green-bg); color: var(--green-dark); }
    .v-avatar.orange { background: var(--orange-bg); color: var(--orange); }
    .v-avatar.pink { background: var(--pink-bg); color: var(--pink); }
    .v-name { font-weight: 700; color: var(--text); }
    .v-meta { font-size: 11px; color: var(--text-faint); }

    .pill {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 3px 9px;
      border-radius: 100px; white-space: nowrap;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: var(--red-bg); color: var(--red); }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-orange { background: var(--orange-bg); color: var(--orange); }
    .pill-pink { background: var(--pink-bg); color: var(--pink); }
    .pill-gray { background: var(--surface-alt); color: var(--text-muted); }
    .pill svg { width: 10px; height: 10px; }

    .v-action { display: flex; justify-content: flex-end; }
    .v-btn {
      padding: 7px 14px; font-size: 12px; font-weight: 600;
      border-radius: 100px; background: var(--blue); color: #fff;
      transition: all 0.15s ease;
    }
    .v-btn:hover { background: var(--navy); }
    .v-btn.done {
      background: var(--green-bg); color: var(--green-dark);
      pointer-events: none;
    }
    .v-btn.disabled {
      background: var(--surface-alt); color: var(--text-faint);
      cursor: not-allowed;
    }

    /* ===== Send to CPA ===== */
    .cpa-card {
      background: linear-gradient(135deg, #fdfdff 0%, var(--surface) 100%);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 24px; box-shadow: var(--shadow);
      display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px;
      align-items: flex-start;
    }
    .cpa-card h3 {
      font-size: 16px; font-weight: 700; color: var(--text);
      margin-bottom: 4px; letter-spacing: -0.01em;
    }
    .cpa-card-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 18px; }
    .cpa-field { margin-bottom: 14px; }
    .cpa-field label {
      display: block; font-size: 12px; font-weight: 600;
      color: var(--text-muted); margin-bottom: 6px;
      letter-spacing: 0.02em;
    }
    .cpa-field input, .cpa-field textarea {
      width: 100%; background: var(--surface);
      border: 1px solid var(--border); border-radius: 10px;
      padding: 10px 14px; font-size: 13px; color: var(--text);
      transition: all 0.15s ease;
    }
    .cpa-field input:focus, .cpa-field textarea:focus {
      outline: none; border-color: var(--blue);
      box-shadow: 0 0 0 3px rgba(18,81,173,0.1);
    }
    .cpa-field textarea { min-height: 90px; resize: vertical; font-family: inherit; }
    .cpa-actions { display: flex; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
    .cpa-side {
      background: var(--blue-pale); border-radius: 12px; padding: 18px;
      border: 1px solid #dbe6ff;
    }
    .cpa-side h4 {
      font-size: 13px; font-weight: 700; color: var(--navy);
      margin-bottom: 12px;
    }
    .cpa-file {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; background: var(--surface);
      border: 1px solid var(--border); border-radius: 8px;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .cpa-file:last-child { margin-bottom: 0; }
    .cpa-file-icon {
      width: 28px; height: 28px; border-radius: 6px;
      background: #fee5eb; color: var(--pink);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .cpa-file-icon svg { width: 14px; height: 14px; }
    .cpa-file-name { flex: 1; font-weight: 600; color: var(--text); }
    .cpa-file-size { font-size: 11px; color: var(--text-faint); }

    /* ===== Footer note ===== */
    .footer-note {
      text-align: center; font-size: 12px; color: var(--text-faint);
      padding: 20px 0 8px; margin-top: 32px;
      border-top: 1px solid var(--border);
      font-style: italic; line-height: 1.6;
    }

    /* ===== Modal ===== */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(20,32,74,0.55);
      backdrop-filter: blur(4px);
      display: none; align-items: center; justify-content: center;
      z-index: 100; padding: 24px;
    }
    .modal-backdrop.open { display: flex; }
    .modal {
      background: var(--surface); border-radius: var(--radius-lg);
      width: 100%; max-width: 560px;
      box-shadow: var(--shadow-lg); overflow: hidden;
      max-height: 90vh; display: flex; flex-direction: column;
    }
    .modal-head {
      padding: 18px 22px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-head h3 { font-size: 15px; font-weight: 700; }
    .modal-close {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted);
    }
    .modal-close:hover { background: var(--surface-alt); }
    .modal-close svg { width: 16px; height: 16px; }
    .modal-body { padding: 22px; overflow-y: auto; }
    .email-preview {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px 18px; font-size: 13px;
      line-height: 1.6;
    }
    .email-preview-meta {
      display: grid; grid-template-columns: 60px 1fr; gap: 4px 10px;
      padding-bottom: 10px; margin-bottom: 10px;
      border-bottom: 1px dashed var(--border);
      font-size: 12px;
    }
    .email-preview-meta span:nth-child(odd) {
      color: var(--text-faint); font-weight: 600;
    }
    .email-preview-meta span:nth-child(even) { color: var(--text); font-weight: 500; }
    .email-preview-body { white-space: pre-line; color: var(--text); }
    .email-preview-attach {
      margin-top: 12px; padding-top: 10px;
      border-top: 1px dashed var(--border);
      display: flex; flex-direction: column; gap: 4px;
      font-size: 12px;
    }
    .email-attach-item {
      display: flex; align-items: center; gap: 6px;
      color: var(--blue); font-weight: 600;
    }
    .email-attach-item svg { width: 12px; height: 12px; }
    .modal-foot {
      padding: 14px 22px; border-top: 1px solid var(--border);
      display: flex; justify-content: flex-end; gap: 10px;
    }

    /* ===== Toast ===== */
    .toast {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--navy-darker); color: #fff;
      padding: 12px 18px 12px 14px; border-radius: 100px;
      box-shadow: var(--shadow-lg);
      display: none; align-items: center; gap: 10px;
      font-size: 13px; font-weight: 600;
      z-index: 110;
      animation: slide-in 0.3s ease;
    }
    .toast.open { display: inline-flex; }
    .toast-icon {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--green); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .toast-icon svg { width: 12px; height: 12px; }
    @keyframes slide-in {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* ===== Responsive niceties ===== */
    @media (max-width: 1100px) {
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
      .pack-grid { grid-template-columns: 1fr; }
      .cpa-card { grid-template-columns: 1fr; }
      .donut-wrap { grid-template-columns: 1fr; }
      .cat-grid { grid-template-columns: repeat(2, 1fr); }
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
          <a class="sb-nav-item active" href="reports.html">
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
          <a href="reports.html">Reports</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Tax Pack</strong>
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
          <button class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Quick add
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="content-inner">

          <!-- Breadcrumb -->
          <div class="crumb">
            <a href="reports.html">Reports</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            <strong>Tax pack</strong>
          </div>

          <!-- Page head -->
          <div class="page-head">
            <div>
              <h1 id="pageTitle">2025 Tax Pack</h1>
              <p>Schedule-E-ready export. Email your CPA, done. Updates live as transactions land.</p>
            </div>
            <div class="page-head-actions">
              <button class="btn btn-ghost" onclick="showToast('Printing Schedule E preview…')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                Print preview
              </button>
              <button class="btn btn-primary btn-lg" onclick="document.getElementById('cpaEmail').focus(); window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download tax pack
              </button>
            </div>
          </div>

          <!-- Year + entity selectors -->
          <div class="controls-row">
            <div class="seg" role="tablist" aria-label="Tax year">
              <button class="seg-btn" data-year="2024" onclick="setYear('2024')">2024</button>
              <button class="seg-btn active" data-year="2025" onclick="setYear('2025')">2025</button>
              <button class="seg-btn" data-year="2026" onclick="setYear('2026')">2026 <span class="tag">YTD</span></button>
            </div>
            <div class="entity-wrap">
              <label class="entity-label" for="entitySelect">For which entity?</label>
              <select class="entity-select" id="entitySelect" onchange="filterEntity(this.value)">
                <option value="all">All owned by me (4 properties)</option>
                <option value="llc">Black Bear Rentals LLC (3 properties)</option>
                <option value="personal">Harrison Cooper personally (1 property)</option>
                <option value="split">All — generate separate files per entity</option>
              </select>
            </div>
          </div>

          <!-- Summary card -->
          <div class="summary">
            <div class="summary-head">
              <div>
                <span class="summary-label">Tax Year <span id="yrLabel">2025</span> Summary</span>
                <h2>Schedule E totals, rolled up across your portfolio</h2>
                <p>Numbers below match line 26 of your Schedule E. Have your CPA verify before filing.</p>
              </div>
              <div class="summary-live">
                <span class="summary-live-dot"></span>
                Live — last synced 2m ago
              </div>
            </div>
            <div class="summary-grid">
              <div>
                <div class="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Gross rental income
                </div>
                <div class="summary-metric-value" id="mGross">$62,400</div>
                <div class="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  +8.3% YoY
                </div>
                <div class="summary-line">Schedule E, line 3</div>
              </div>
              <div>
                <div class="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  Total expenses
                </div>
                <div class="summary-metric-value exp" id="mExp">$28,840</div>
                <div class="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  +4.1% YoY
                </div>
                <div class="summary-line">Lines 5–19</div>
              </div>
              <div>
                <div class="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>
                  Depreciation
                </div>
                <div class="summary-metric-value" id="mDep">$11,260</div>
                <div class="summary-metric-delta neutral">
                  Identical to 2024
                </div>
                <div class="summary-line">Line 18 · Form 4562</div>
              </div>
              <div>
                <div class="summary-metric-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  Net rental income
                </div>
                <div class="summary-metric-value net" id="mNet">$22,300</div>
                <div class="summary-metric-delta up">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  +14.6% YoY
                </div>
                <div class="summary-line">Line 26 — flows to 1040</div>
              </div>
            </div>
          </div>

          <!-- What's in your Tax Pack -->
          <div class="section-title-row">
            <h2>What's in your Tax Pack</h2>
            <span class="section-sub">Four PDFs, one ZIP. Everything your CPA needs.</span>
          </div>

          <div class="pack-grid">
            <div class="pack-card">
              <div class="pack-card-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6M9 9h1"/></svg>
              </div>
              <div class="pack-card-body">
                <div class="pack-card-title">Schedule E worksheet <span class="pages">2 pp</span></div>
                <div class="pack-card-desc">Pre-filled IRS-form-style Schedule E with property totals mapped to each line. Ready to copy into your 1040.</div>
                <div class="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Reconciled against bank feed
                </div>
              </div>
            </div>
            <div class="pack-card">
              <div class="pack-card-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21V12h6v9"/></svg>
              </div>
              <div class="pack-card-body">
                <div class="pack-card-title">Property-by-property P&amp;L <span class="pages">4 pp</span></div>
                <div class="pack-card-desc">One page per property. Income, every expense line, net operating income, and cap rate — all rendered clean.</div>
                <div class="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  One page per entity
                </div>
              </div>
            </div>
            <div class="pack-card">
              <div class="pack-card-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>
              </div>
              <div class="pack-card-body">
                <div class="pack-card-title">Transaction ledger <span class="pages">18 pp</span></div>
                <div class="pack-card-desc">Every expense with date, amount, vendor, category, and a clickable link to the receipt image. Audit-ready.</div>
                <div class="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  287 transactions · 214 receipts attached
                </div>
              </div>
            </div>
            <div class="pack-card">
              <div class="pack-card-icon pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
              </div>
              <div class="pack-card-body">
                <div class="pack-card-title">Depreciation schedule <span class="pages">3 pp</span></div>
                <div class="pack-card-desc">Per-property MACRS schedule with basis, acquisition date, accumulated depreciation, and current-year amount.</div>
                <div class="pack-card-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Straight-line · 27.5 years residential
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule E preview -->
          <div class="section-title-row">
            <h2>Schedule E preview</h2>
            <span class="section-sub">Read-only preview · the PDF version is in your tax pack</span>
          </div>

          <div class="form-preview-wrap">
            <div class="form-preview-head">
              <h3>Form 1040 · Schedule E · Part I — Rental Real Estate</h3>
              <div class="form-preview-actions">
                <div class="zoom-group">
                  <button class="zoom-btn">75%</button>
                  <button class="zoom-btn active">100%</button>
                  <button class="zoom-btn">125%</button>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Opening full-screen preview…')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  Full screen
                </button>
              </div>
            </div>

            <div class="form-paper">
              <div class="form-watermark">PREVIEW</div>

              <div class="form-header">
                <div class="form-header-left">
                  <div class="form-schedule-label">SCHEDULE E<br><span style="font-size:9px;font-weight:400;">(Form 1040)</span></div>
                  <div>
                    <div class="form-title">Supplemental Income and Loss</div>
                    <div class="form-subtitle">(From rental real estate, royalties, partnerships, S corporations, estates, trusts, REMICs, etc.)</div>
                    <div class="form-subtitle" style="margin-top:6px;">Department of the Treasury · Internal Revenue Service</div>
                  </div>
                </div>
                <div class="form-omb">
                  OMB No. 1545-0074<br>
                  <strong style="font-size:14px;color:#1a1a1a;font-family:'Inter',sans-serif;font-weight:800;">2025</strong><br>
                  Attachment<br>Sequence No. 13
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px;font-size:10px;">
                <div><strong style="font-family:'Inter',sans-serif;">Name(s) shown on return</strong><div style="border-bottom:1px solid #1a1a1a;padding:3px 0;font-weight:700;">Harrison Cooper &amp; Black Bear Rentals LLC</div></div>
                <div><strong style="font-family:'Inter',sans-serif;">Your SSN / EIN</strong><div style="border-bottom:1px solid #1a1a1a;padding:3px 0;font-weight:700;">XXX-XX-4821 / 88-•••••••</div></div>
              </div>

              <div class="form-part-header">PART I — INCOME OR LOSS FROM RENTAL REAL ESTATE AND ROYALTIES</div>

              <div class="form-row">
                <div class="form-line-num">1a</div>
                <div class="form-line-label">Physical address of each property (street, city, state, ZIP)</div>
                <div class="form-line-value" style="text-align:left;font-size:10px;">See table below — 4 properties</div>
              </div>
              <div class="form-row">
                <div class="form-line-num">1b</div>
                <div class="form-line-label">Type of property (1 = Single family, 2 = Multi-family, 3 = Vacation, 4 = Commercial)</div>
                <div class="form-line-value" style="text-align:left;font-size:10px;">1, 2, 1, 1</div>
              </div>
              <div class="form-row">
                <div class="form-line-num">2</div>
                <div class="form-line-label">Fair rental days &nbsp;·&nbsp; Personal use days &nbsp;·&nbsp; QJV</div>
                <div class="form-line-value" style="text-align:left;font-size:10px;">365 / 0 / No</div>
              </div>

              <table class="form-props-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Address</th>
                    <th class="num">A · Income</th>
                    <th class="num">B · Expenses</th>
                    <th class="num">C · Depreciation</th>
                    <th class="num">D · Net</th>
                  </tr>
                </thead>
                <tbody id="formPropsBody">
                  <tr>
                    <td class="label">A</td>
                    <td>2909 Wilson Ave NW · Huntsville AL</td>
                    <td class="num">19,800</td>
                    <td class="num">8,420</td>
                    <td class="num">3,640</td>
                    <td class="num">7,740</td>
                  </tr>
                  <tr>
                    <td class="label">B</td>
                    <td>2907 Wilson Ave NW · Huntsville AL</td>
                    <td class="num">17,400</td>
                    <td class="num">7,180</td>
                    <td class="num">3,120</td>
                    <td class="num">7,100</td>
                  </tr>
                  <tr>
                    <td class="label">C</td>
                    <td>1523 Oak Ave · Huntsville AL</td>
                    <td class="num">16,200</td>
                    <td class="num">8,090</td>
                    <td class="num">2,780</td>
                    <td class="num">5,330</td>
                  </tr>
                  <tr>
                    <td class="label">D</td>
                    <td>908 Lee Dr NW · Huntsville AL</td>
                    <td class="num">9,000</td>
                    <td class="num">5,150</td>
                    <td class="num">1,720</td>
                    <td class="num">2,130</td>
                  </tr>
                  <tr class="totals">
                    <td colspan="2">TOTAL — Line 3 / 20 / 18 / 26</td>
                    <td class="num">62,400</td>
                    <td class="num">28,840</td>
                    <td class="num">11,260</td>
                    <td class="num">22,300</td>
                  </tr>
                </tbody>
              </table>

              <div class="form-part-header" style="margin-top:16px;">EXPENSE DETAIL (LINES 5 – 19)</div>
              <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0 24px;font-size:11px;">
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">5</div>
                  <div class="form-line-label">Advertising</div>
                  <div class="form-line-value" style="min-width:90px;">640</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">12</div>
                  <div class="form-line-label">Mortgage interest</div>
                  <div class="form-line-value" style="min-width:90px;">9,820</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">7</div>
                  <div class="form-line-label">Cleaning &amp; maintenance</div>
                  <div class="form-line-value" style="min-width:90px;">4,310</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">14</div>
                  <div class="form-line-label">Repairs</div>
                  <div class="form-line-value" style="min-width:90px;">3,680</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">9</div>
                  <div class="form-line-label">Insurance</div>
                  <div class="form-line-value" style="min-width:90px;">2,950</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">16</div>
                  <div class="form-line-label">Taxes (property)</div>
                  <div class="form-line-value" style="min-width:90px;">4,620</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">10</div>
                  <div class="form-line-label">Legal &amp; other professional</div>
                  <div class="form-line-value" style="min-width:90px;">420</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">17</div>
                  <div class="form-line-label">Utilities</div>
                  <div class="form-line-value" style="min-width:90px;">2,040</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">11</div>
                  <div class="form-line-label">Management fees</div>
                  <div class="form-line-value" style="min-width:90px;">0</div>
                </div>
                <div class="form-row" style="grid-template-columns:20px 1fr auto;">
                  <div class="form-line-num">18</div>
                  <div class="form-line-label">Depreciation (Form 4562)</div>
                  <div class="form-line-value" style="min-width:90px;">11,260</div>
                </div>
              </div>

              <div class="form-footer">
                <span>For Paperwork Reduction Act Notice, see the Instructions for Form 1040.</span>
                <span>Cat. No. 11344L · Schedule E (Form 1040) 2025</span>
              </div>
            </div>
          </div>

          <!-- Per-property breakdown -->
          <div class="section-title-row">
            <h2>Per-property breakdown</h2>
            <span class="section-sub">Click any row to expand expense categories</span>
          </div>

          <div class="card">
            <div class="prop-table">
              <div class="prop-row-head">
                <span></span>
                <span>Property</span>
                <span class="num">Income</span>
                <span class="num">Expenses</span>
                <span class="num">Depreciation</span>
                <span class="num">Net</span>
                <span></span>
              </div>

              <div id="propRows">
                <!-- Row 1 -->
                <div class="prop-row" data-entity="llc" onclick="toggleRow(this)">
                  <div class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
                  <div class="prop-address">
                    <div class="prop-address-main">2909 Wilson Ave NW</div>
                    <div class="prop-address-meta">Huntsville, AL · 3-bed co-living · Black Bear Rentals LLC</div>
                  </div>
                  <div class="num num-amt">$19,800</div>
                  <div class="num num-exp">$8,420</div>
                  <div class="num num-dep">$3,640</div>
                  <div class="num num-net">$7,740</div>
                  <div class="prop-action"><span class="pill pill-green">Synced</span></div>
                </div>
                <div class="prop-expand">
                  <div class="prop-expand-title">Expense categories · 2909 Wilson Ave NW</div>
                  <div class="cat-grid">
                    <div class="cat-row"><span class="cat-row-label">Mortgage interest</span><span class="cat-row-amt">$3,240</span></div>
                    <div class="cat-row"><span class="cat-row-label">Property tax</span><span class="cat-row-amt">$1,480</span></div>
                    <div class="cat-row"><span class="cat-row-label">Insurance</span><span class="cat-row-amt">$920</span></div>
                    <div class="cat-row"><span class="cat-row-label">Maintenance</span><span class="cat-row-amt">$1,640</span></div>
                    <div class="cat-row"><span class="cat-row-label">Utilities</span><span class="cat-row-amt">$620</span></div>
                    <div class="cat-row"><span class="cat-row-label">Management fees</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Advertising</span><span class="cat-row-amt">$220</span></div>
                    <div class="cat-row"><span class="cat-row-label">Legal &amp; professional</span><span class="cat-row-amt">$180</span></div>
                    <div class="cat-row"><span class="cat-row-label">Other</span><span class="cat-row-amt">$120</span></div>
                  </div>
                </div>

                <!-- Row 2 -->
                <div class="prop-row" data-entity="llc" onclick="toggleRow(this)">
                  <div class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
                  <div class="prop-address">
                    <div class="prop-address-main">2907 Wilson Ave NW</div>
                    <div class="prop-address-meta">Huntsville, AL · SFH · Black Bear Rentals LLC</div>
                  </div>
                  <div class="num num-amt">$17,400</div>
                  <div class="num num-exp">$7,180</div>
                  <div class="num num-dep">$3,120</div>
                  <div class="num num-net">$7,100</div>
                  <div class="prop-action"><span class="pill pill-green">Synced</span></div>
                </div>
                <div class="prop-expand">
                  <div class="prop-expand-title">Expense categories · 2907 Wilson Ave NW</div>
                  <div class="cat-grid">
                    <div class="cat-row"><span class="cat-row-label">Mortgage interest</span><span class="cat-row-amt">$2,860</span></div>
                    <div class="cat-row"><span class="cat-row-label">Property tax</span><span class="cat-row-amt">$1,260</span></div>
                    <div class="cat-row"><span class="cat-row-label">Insurance</span><span class="cat-row-amt">$780</span></div>
                    <div class="cat-row"><span class="cat-row-label">Maintenance</span><span class="cat-row-amt">$1,100</span></div>
                    <div class="cat-row"><span class="cat-row-label">Utilities</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Management fees</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Advertising</span><span class="cat-row-amt">$180</span></div>
                    <div class="cat-row"><span class="cat-row-label">Legal &amp; professional</span><span class="cat-row-amt">$120</span></div>
                    <div class="cat-row"><span class="cat-row-label">Other</span><span class="cat-row-amt">$880</span></div>
                  </div>
                </div>

                <!-- Row 3 -->
                <div class="prop-row" data-entity="llc" onclick="toggleRow(this)">
                  <div class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
                  <div class="prop-address">
                    <div class="prop-address-main">1523 Oak Ave</div>
                    <div class="prop-address-meta">Huntsville, AL · SFH · Black Bear Rentals LLC</div>
                  </div>
                  <div class="num num-amt">$16,200</div>
                  <div class="num num-exp">$8,090</div>
                  <div class="num num-dep">$2,780</div>
                  <div class="num num-net">$5,330</div>
                  <div class="prop-action"><span class="pill pill-green">Synced</span></div>
                </div>
                <div class="prop-expand">
                  <div class="prop-expand-title">Expense categories · 1523 Oak Ave</div>
                  <div class="cat-grid">
                    <div class="cat-row"><span class="cat-row-label">Mortgage interest</span><span class="cat-row-amt">$2,640</span></div>
                    <div class="cat-row"><span class="cat-row-label">Property tax</span><span class="cat-row-amt">$1,180</span></div>
                    <div class="cat-row"><span class="cat-row-label">Insurance</span><span class="cat-row-amt">$740</span></div>
                    <div class="cat-row"><span class="cat-row-label">Maintenance</span><span class="cat-row-amt">$1,290</span></div>
                    <div class="cat-row"><span class="cat-row-label">Utilities</span><span class="cat-row-amt">$1,420</span></div>
                    <div class="cat-row"><span class="cat-row-label">Management fees</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Advertising</span><span class="cat-row-amt">$140</span></div>
                    <div class="cat-row"><span class="cat-row-label">Legal &amp; professional</span><span class="cat-row-amt">$60</span></div>
                    <div class="cat-row"><span class="cat-row-label">Other</span><span class="cat-row-amt">$620</span></div>
                  </div>
                </div>

                <!-- Row 4 -->
                <div class="prop-row" data-entity="personal" onclick="toggleRow(this)">
                  <div class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>
                  <div class="prop-address">
                    <div class="prop-address-main">908 Lee Dr NW</div>
                    <div class="prop-address-meta">Huntsville, AL · SFH · Harrison Cooper (personal)</div>
                  </div>
                  <div class="num num-amt">$9,000</div>
                  <div class="num num-exp">$5,150</div>
                  <div class="num num-dep">$1,720</div>
                  <div class="num num-net">$2,130</div>
                  <div class="prop-action"><span class="pill pill-orange">Partial year</span></div>
                </div>
                <div class="prop-expand">
                  <div class="prop-expand-title">Expense categories · 908 Lee Dr NW</div>
                  <div class="cat-grid">
                    <div class="cat-row"><span class="cat-row-label">Mortgage interest</span><span class="cat-row-amt">$1,080</span></div>
                    <div class="cat-row"><span class="cat-row-label">Property tax</span><span class="cat-row-amt">$700</span></div>
                    <div class="cat-row"><span class="cat-row-label">Insurance</span><span class="cat-row-amt">$510</span></div>
                    <div class="cat-row"><span class="cat-row-label">Maintenance</span><span class="cat-row-amt">$280</span></div>
                    <div class="cat-row"><span class="cat-row-label">Utilities</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Management fees</span><span class="cat-row-amt">$0</span></div>
                    <div class="cat-row"><span class="cat-row-label">Advertising</span><span class="cat-row-amt">$100</span></div>
                    <div class="cat-row"><span class="cat-row-label">Legal &amp; professional</span><span class="cat-row-amt">$60</span></div>
                    <div class="cat-row"><span class="cat-row-label">Other (turn-over)</span><span class="cat-row-amt">$2,420</span></div>
                  </div>
                </div>
              </div>

              <div class="prop-totals">
                <span></span>
                <span>TOTAL · 4 properties</span>
                <span class="num">$62,400</span>
                <span class="num">$28,840</span>
                <span class="num">$11,260</span>
                <span class="num net">$22,300</span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- Expense donut -->
          <div class="section-title-row">
            <h2>Where the money went</h2>
            <span class="section-sub">2025 expenses by category · excludes depreciation</span>
          </div>

          <div class="card">
            <div class="donut-wrap">
              <div class="donut">
                <svg viewBox="0 0 120 120" width="220" height="220">
                  <!-- segments (stroke-dasharray trick on a circle, total circumference ~301.59) -->
                  <!-- cumulative fractions: MortInt 34%, PropTax 16%, Maint 15%, Ins 10.2%, Util 7.1%, Repairs 12.8%, Advert 2.2%, Legal 1.5%, Other 1.2% -->
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#eef3ff" stroke-width="20"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1251AD" stroke-width="20"
                    stroke-dasharray="102.5 301.5" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#2F3E83" stroke-width="20"
                    stroke-dasharray="48.2 301.5" stroke-dashoffset="-102.5" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#FF4998" stroke-width="20"
                    stroke-dasharray="45.2 301.5" stroke-dashoffset="-150.7" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#1ea97c" stroke-width="20"
                    stroke-dasharray="30.8 301.5" stroke-dashoffset="-195.9" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#ea8c3a" stroke-width="20"
                    stroke-dasharray="38.6 301.5" stroke-dashoffset="-226.7" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#f5a623" stroke-width="20"
                    stroke-dasharray="21.4 301.5" stroke-dashoffset="-265.3" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#8a93a5" stroke-width="20"
                    stroke-dasharray="6.6 301.5" stroke-dashoffset="-286.7" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#c9d1dd" stroke-width="20"
                    stroke-dasharray="4.5 301.5" stroke-dashoffset="-293.3" transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#d64545" stroke-width="20"
                    stroke-dasharray="3.6 301.5" stroke-dashoffset="-297.8" transform="rotate(-90 60 60)"/>
                </svg>
                <div class="donut-center">
                  <div class="donut-center-label">Total expenses</div>
                  <div class="donut-center-value">$28,840</div>
                  <div class="donut-center-sub">across 9 categories</div>
                </div>
              </div>
              <div class="legend">
                <div class="legend-row"><span class="legend-dot" style="background:#1251AD;"></span><span class="legend-label">Mortgage interest</span><span class="legend-amt">$9,820</span><span class="legend-pct">34.0%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#2F3E83;"></span><span class="legend-label">Property tax</span><span class="legend-amt">$4,620</span><span class="legend-pct">16.0%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#FF4998;"></span><span class="legend-label">Maintenance</span><span class="legend-amt">$4,310</span><span class="legend-pct">14.9%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#1ea97c;"></span><span class="legend-label">Insurance</span><span class="legend-amt">$2,950</span><span class="legend-pct">10.2%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#ea8c3a;"></span><span class="legend-label">Repairs</span><span class="legend-amt">$3,680</span><span class="legend-pct">12.8%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#f5a623;"></span><span class="legend-label">Utilities</span><span class="legend-amt">$2,040</span><span class="legend-pct">7.1%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#8a93a5;"></span><span class="legend-label">Advertising</span><span class="legend-amt">$640</span><span class="legend-pct">2.2%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#c9d1dd;"></span><span class="legend-label">Legal &amp; professional</span><span class="legend-amt">$420</span><span class="legend-pct">1.5%</span></div>
                <div class="legend-row"><span class="legend-dot" style="background:#d64545;"></span><span class="legend-label">Other</span><span class="legend-amt">$360</span><span class="legend-pct">1.3%</span></div>
              </div>
            </div>
          </div>

          <!-- 1099 vendors -->
          <div class="section-title-row">
            <h2>1099-NEC status</h2>
            <span class="section-sub">Vendors paid &gt; $600 need a 1099 filed by Jan 31</span>
          </div>

          <div class="card">
            <div class="v-row v-row-head">
              <span></span>
              <span>Vendor</span>
              <span>Category</span>
              <span>Paid (2025)</span>
              <span>W-9 status</span>
              <span></span>
            </div>
            <div class="v-row" data-vendor="joel">
              <div class="v-avatar green">JP</div>
              <div>
                <div class="v-name">Joel's Plumbing &amp; Drain</div>
                <div class="v-meta">Huntsville, AL · individual · 4 invoices</div>
              </div>
              <div>Maintenance</div>
              <div class="num-amt">$2,860</div>
              <div><span class="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>W-9 on file</span></div>
              <div class="v-action"><button class="v-btn" onclick="gen1099(this, 'Joel')">Generate 1099</button></div>
            </div>
            <div class="v-row" data-vendor="tina">
              <div class="v-avatar orange">TR</div>
              <div>
                <div class="v-name">Tina Ramos Painting</div>
                <div class="v-meta">Madison, AL · individual · 2 invoices</div>
              </div>
              <div>Turnover</div>
              <div class="num-amt">$1,480</div>
              <div><span class="pill pill-red">W-9 missing</span></div>
              <div class="v-action"><button class="v-btn disabled" onclick="showToast('Request W-9 from Tina first')">Request W-9</button></div>
            </div>
            <div class="v-row" data-vendor="clearview">
              <div class="v-avatar blue">CL</div>
              <div>
                <div class="v-name">ClearView Window Co.</div>
                <div class="v-meta">Huntsville, AL · LLC (taxed C-corp) · 1 invoice</div>
              </div>
              <div>Repairs</div>
              <div class="num-amt">$920</div>
              <div><span class="pill pill-gray">C-corp · exempt</span></div>
              <div class="v-action"><button class="v-btn disabled">Not required</button></div>
            </div>
            <div class="v-row" data-vendor="atlas">
              <div class="v-avatar pink">AL</div>
              <div>
                <div class="v-name">Atlas Landscaping</div>
                <div class="v-meta">Huntsville, AL · sole prop · 11 invoices</div>
              </div>
              <div>Maintenance</div>
              <div class="num-amt">$1,640</div>
              <div><span class="pill pill-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>W-9 on file</span></div>
              <div class="v-action"><button class="v-btn" onclick="gen1099(this, 'Atlas')">Generate 1099</button></div>
            </div>
          </div>

          <!-- Send to CPA -->
          <div class="section-title-row">
            <h2>Send it</h2>
            <span class="section-sub">One email to your CPA. Done for the year.</span>
          </div>

          <div class="cpa-card">
            <div>
              <h3>Email tax pack to your CPA</h3>
              <p class="cpa-card-sub">We'll attach the 4 PDFs plus a signed summary cover letter. Your CPA gets everything, in the order they expect it.</p>

              <div class="cpa-field">
                <label for="cpaEmail">CPA email</label>
                <input id="cpaEmail" type="email" value="rebecca@ccookecpa.com" placeholder="name@firm.com">
              </div>
              <div class="cpa-field">
                <label for="cpaSubject">Subject</label>
                <input id="cpaSubject" type="text" value="2025 Rental Tax Pack — Harrison Cooper / Black Bear Rentals">
              </div>
              <div class="cpa-field">
                <label for="cpaNote">Note to your CPA</label>
                <textarea id="cpaNote">Hi Rebecca — attached is my 2025 tax pack from Tenantory. Schedule E totals, property P&amp;Ls, the full transaction ledger with receipts, and depreciation schedule are included.

I added one property mid-year (908 Lee Dr NW, acquired May 14) — depreciation is pro-rated. Let me know what else you need. Thanks!</textarea>
              </div>
              <div class="cpa-actions">
                <button class="btn btn-primary btn-lg" onclick="openEmailModal()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
                  Email tax pack to CPA
                </button>
                <button class="btn btn-ghost" onclick="showToast('Generating ZIP · 24 files · ~4.2 MB')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Download all as ZIP
                </button>
              </div>
            </div>

            <div class="cpa-side">
              <h4>Attached (4 files · 4.2 MB)</h4>
              <div class="cpa-file">
                <div class="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
                <div class="cpa-file-name">Schedule_E_2025.pdf</div>
                <div class="cpa-file-size">180 KB</div>
              </div>
              <div class="cpa-file">
                <div class="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
                <div class="cpa-file-name">Property_PL_2025.pdf</div>
                <div class="cpa-file-size">320 KB</div>
              </div>
              <div class="cpa-file">
                <div class="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
                <div class="cpa-file-name">Transaction_Ledger_2025.pdf</div>
                <div class="cpa-file-size">3.4 MB</div>
              </div>
              <div class="cpa-file">
                <div class="cpa-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
                <div class="cpa-file-name">Depreciation_Schedule_2025.pdf</div>
                <div class="cpa-file-size">260 KB</div>
              </div>
            </div>
          </div>

          <!-- Footer note -->
          <div class="footer-note">
            Tenantory does not provide tax advice. This is a data export generated from your verified transactions and receipts.<br>
            Have your CPA verify before filing.
          </div>

        </div>
      </div>

    </main>
  </div>

  <!-- Email confirmation modal -->
  <div class="modal-backdrop" id="emailModal" onclick="if(event.target===this) closeEmailModal()">
    <div class="modal">
      <div class="modal-head">
        <h3>Ready to send · Preview</h3>
        <button class="modal-close" onclick="closeEmailModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="email-preview">
          <div class="email-preview-meta">
            <span>From</span><span>Harrison Cooper &lt;harrison@rentblackbear.com&gt;</span>
            <span>To</span><span id="eTo">rebecca@ccookecpa.com</span>
            <span>Subject</span><span id="eSubj">2025 Rental Tax Pack — Harrison Cooper / Black Bear Rentals</span>
          </div>
          <div class="email-preview-body" id="eBody"></div>
          <div class="email-preview-attach">
            <div class="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Schedule_E_2025.pdf · 180 KB</div>
            <div class="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Property_PL_2025.pdf · 320 KB</div>
            <div class="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Transaction_Ledger_2025.pdf · 3.4 MB</div>
            <div class="email-attach-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>Depreciation_Schedule_2025.pdf · 260 KB</div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="closeEmailModal()">Cancel</button>
        <button class="btn btn-primary" onclick="sendEmail()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
          Send now
        </button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" id="toast">
    <span class="toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
    <span id="toastMsg">Done.</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
