"use client";

// Mock ported verbatim from ~/Desktop/tenantory/admin-syndicate.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt);
      line-height: 1.5; font-size: 14px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    img, svg { display: block; max-width: 100%; }
    input, textarea, select { font-family: inherit; font-size: inherit; }

    :root {
      --navy: #2F3E83;
      --navy-dark: #1e2a5e;
      --navy-darker: #14204a;
      --blue: #1251AD;
      --blue-bright: #1665D8;
      --blue-pale: #eef3ff;
      --pink: #FF4998;
      --pink-bg: rgba(255,73,152,0.12);
      --pink-strong: rgba(255,73,152,0.22);
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
      --purple: #7c4dff;
      --purple-bg: rgba(124,77,255,0.12);
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 16px rgba(26,31,54,0.06);
      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);
    }

    /* ===== Layout ===== */
    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }

    /* ===== Sidebar ===== */
    .sidebar {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: rgba(255,255,255,0.75);
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }
    .sb-logo svg { width: 18px; height: 18px; color: #fff; }
    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }
    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }
    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }
    .sb-nav-item.active::before { content: ""; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }
    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }
    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }
    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }
    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }
    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }
    .sb-user-card:hover { background: rgba(255,255,255,0.08); }
    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }
    .sb-user-action { color: rgba(255,255,255,0.5); }

    /* ===== Main ===== */
    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }

    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 28px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; flex-shrink: 0;
    }
    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
    .topbar-breadcrumb a { color: var(--text-muted); transition: color .15s; }
    .topbar-breadcrumb a:hover { color: var(--blue); }
    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }
    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }
    .topbar-right { display: flex; align-items: center; gap: 10px; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; background: var(--surface-alt);
      border: 1px solid var(--border); border-radius: 100px;
      min-width: 320px; color: var(--text-faint);
    }
    .topbar-search svg { width: 16px; height: 16px; }
    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }
    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }
    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }
    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }
    .topbar-icon svg { width: 18px; height: 18px; }
    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }

    .page-scroll { flex: 1; overflow-y: auto; padding-bottom: 96px; }

    /* ===== Page head ===== */
    .page-head-bar {
      padding: 24px 28px 0;
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 20px; flex-wrap: wrap;
    }
    .page-head-left { max-width: 680px; }
    .page-head-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--pink-bg); color: var(--pink);
      font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
      text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
      margin-bottom: 10px;
    }
    .page-head-eyebrow svg { width: 11px; height: 11px; }
    .page-head-bar h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.024em; margin-bottom: 6px; color: var(--text); }
    .page-head-bar p { color: var(--text-muted); font-size: 14px; line-height: 1.55; }
    .page-head-bar p strong { color: var(--text); font-weight: 700; }

    /* ===== Buttons ===== */
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-dark { background: var(--navy); color: #fff; }
    .btn-dark:hover { background: var(--navy-dark); }
    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 8px 20px rgba(255,73,152,0.28); }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 10px 24px rgba(255,73,152,0.34); }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn-lg { padding: 13px 22px; font-size: 14px; font-weight: 700; }
    .btn svg { width: 14px; height: 14px; }

    /* ===== Main grid ===== */
    .syn-grid {
      padding: 24px 28px 28px;
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 1200px) { .syn-grid { grid-template-columns: 1fr; } }

    /* ===== Card ===== */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .card + .card { margin-top: 20px; }
    .card-head {
      padding: 18px 22px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
    }
    .card-head-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .card-head-icon {
      width: 32px; height: 32px; border-radius: 9px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-head-icon svg { width: 16px; height: 16px; }
    .card-head-icon.pink { background: var(--pink-bg); color: var(--pink); }
    .card-head-icon.green { background: var(--green-bg); color: var(--green-dark); }
    .card-head-icon.purple { background: var(--purple-bg); color: var(--purple); }
    .card-head-text h3 { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .card-head-text p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .card-head-badge {
      font-size: 11px; font-weight: 700;
      background: var(--green-bg); color: var(--green-dark);
      padding: 4px 10px; border-radius: 100px;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .card-head-badge svg { width: 10px; height: 10px; }
    .card-body { padding: 20px 22px; }

    /* ===== Form ===== */
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field + .field { margin-top: 16px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }
    .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-top: 16px; }
    .label {
      font-size: 11px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.08em;
      display: flex; justify-content: space-between; align-items: center;
    }
    .label-hint { font-size: 10px; color: var(--text-faint); text-transform: none; letter-spacing: 0; font-weight: 500; }
    .input, .textarea, .select {
      width: 100%; padding: 11px 14px; border-radius: 10px;
      border: 1px solid var(--border); background: var(--surface);
      color: var(--text); font-size: 14px; font-weight: 500;
      transition: all 0.15s ease; outline: none;
    }
    .input:focus, .textarea:focus, .select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }
    .input.with-prefix { padding-left: 32px; }
    .field-wrap { position: relative; }
    .field-prefix {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      color: var(--text-faint); font-weight: 600; font-size: 14px; pointer-events: none;
    }
    .textarea { resize: vertical; min-height: 112px; line-height: 1.55; font-weight: 400; }
    .char-count {
      font-size: 11px; color: var(--text-faint);
      margin-top: 6px; text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .ai-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: linear-gradient(135deg, var(--purple-bg), var(--pink-bg));
      color: var(--purple); font-size: 10px; font-weight: 700;
      padding: 3px 8px; border-radius: 100px;
      letter-spacing: 0.04em;
    }
    .ai-badge svg { width: 10px; height: 10px; }

    /* ===== Photo grid ===== */
    .photo-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
    }
    .photo-slot {
      aspect-ratio: 4/3; border-radius: 10px;
      background: var(--surface-alt); border: 1.5px dashed var(--border-strong);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-faint); position: relative; overflow: hidden;
      transition: all 0.15s ease; cursor: pointer;
    }
    .photo-slot:hover { border-color: var(--blue); color: var(--blue); }
    .photo-slot svg { width: 22px; height: 22px; }
    .photo-slot.filled {
      border: 1px solid var(--border); cursor: grab;
      color: rgba(255,255,255,0.95);
    }
    .photo-slot.filled.primary { outline: 2px solid var(--pink); outline-offset: 2px; }
    .photo-slot.filled::after {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 60% 30%, rgba(255,255,255,0.22), transparent 60%);
      pointer-events: none;
    }
    .photo-slot.g1 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--pink) 100%); }
    .photo-slot.g2 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--blue-bright) 100%); }
    .photo-slot.g3 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--gold) 100%); }
    .photo-slot.g4 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--green) 100%); }
    .photo-slot.g5 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--purple) 100%); }
    .photo-primary-tag {
      position: absolute; top: 6px; left: 6px; z-index: 2;
      background: var(--pink); color: #fff;
      font-size: 9px; font-weight: 800; letter-spacing: 0.08em;
      padding: 3px 7px; border-radius: 100px; text-transform: uppercase;
    }
    .photo-drag-handle {
      position: absolute; top: 6px; right: 6px; z-index: 2;
      width: 22px; height: 22px; border-radius: 6px;
      background: rgba(20,32,74,0.55); backdrop-filter: blur(8px);
      color: #fff; display: flex; align-items: center; justify-content: center;
    }
    .photo-drag-handle svg { width: 12px; height: 12px; }
    .photo-label {
      position: absolute; bottom: 6px; left: 6px; z-index: 2;
      font-size: 10px; font-weight: 700;
      color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.4);
    }
    .photo-upload-note {
      font-size: 11px; color: var(--text-muted); margin-top: 10px;
      display: flex; align-items: center; gap: 6px;
    }
    .photo-upload-note svg { width: 12px; height: 12px; color: var(--blue); }

    /* ===== Amenities grid ===== */
    .amen-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    }
    @media (max-width: 900px) { .amen-grid { grid-template-columns: repeat(2, 1fr); } }
    .amen-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border-radius: 10px;
      border: 1px solid var(--border); background: var(--surface);
      font-size: 12.5px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease; cursor: pointer; user-select: none;
    }
    .amen-chip:hover { border-color: var(--border-strong); color: var(--text); }
    .amen-chip input { display: none; }
    .amen-chip .check {
      width: 16px; height: 16px; border-radius: 4px;
      border: 1.5px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: var(--surface); transition: all 0.15s;
    }
    .amen-chip .check svg { width: 10px; height: 10px; color: #fff; opacity: 0; }
    .amen-chip.on { border-color: var(--blue); color: var(--navy); background: var(--blue-pale); }
    .amen-chip.on .check { background: var(--blue); border-color: var(--blue); }
    .amen-chip.on .check svg { opacity: 1; }

    /* ===== Radio list ===== */
    .radio-list { display: flex; flex-direction: column; gap: 10px; }
    .radio-card {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 16px; border-radius: 12px;
      border: 1.5px solid var(--border); background: var(--surface);
      cursor: pointer; transition: all 0.15s ease;
    }
    .radio-card:hover { border-color: var(--border-strong); }
    .radio-card.on { border-color: var(--blue); background: var(--blue-pale); }
    .radio-card input { display: none; }
    .radio-card .dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--border-strong);
      flex-shrink: 0; margin-top: 2px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .radio-card.on .dot { border-color: var(--blue); }
    .radio-card.on .dot::after {
      content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--blue);
    }
    .radio-card-body { flex: 1; min-width: 0; }
    .radio-card-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .radio-card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .radio-card input[type="url"] {
      margin-top: 8px; width: 100%;
      padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border); outline: none;
      font-size: 13px;
    }
    .radio-inline-input {
      display: none;
      margin-top: 8px; width: 100%;
      padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border); outline: none;
      font-size: 13px; background: var(--surface);
    }
    .radio-card.on .radio-inline-input { display: block; }

    /* ===== Channel cards ===== */
    .channel-list { display: flex; flex-direction: column; gap: 12px; }
    .channel-card {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 18px; border-radius: 12px;
      border: 1.5px solid var(--border); background: var(--surface);
      transition: all 0.15s ease;
    }
    .channel-card.on { border-color: var(--blue); background: linear-gradient(180deg, var(--blue-pale) 0%, var(--surface) 100%); }
    .channel-card.disabled { opacity: 0.65; }
    .channel-logo {
      width: 52px; height: 52px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: #fff; font-weight: 800; font-size: 14px;
      letter-spacing: -0.02em;
    }
    .channel-logo.tenantory { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }
    .channel-logo.zillow { background: #1c6bb9; }
    .channel-logo.apartments { background: #0f2236; }
    .channel-logo.hotpads { background: #f5a623; color: #1a1f36; }
    .channel-logo.facebook { background: #1877f2; }
    .channel-logo.craigslist { background: #5c2d91; }
    .channel-logo svg { width: 22px; height: 22px; }
    .channel-info { flex: 1; min-width: 0; }
    .channel-name-row {
      display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;
    }
    .channel-name { font-size: 14px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .channel-status {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 10.5px; font-weight: 700;
      padding: 2px 8px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .channel-status.ready { background: var(--green-bg); color: var(--green-dark); }
    .channel-status.pushed { background: var(--blue-pale); color: var(--blue); }
    .channel-status.manual { background: var(--orange-bg); color: var(--orange); }
    .channel-status.disconnected { background: var(--surface-alt); color: var(--text-muted); }
    .channel-status svg { width: 9px; height: 9px; }
    .channel-meta { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .channel-meta svg { width: 11px; height: 11px; }
    .channel-meta .dot-sep { color: var(--text-faint); }

    .toggle {
      flex-shrink: 0; width: 40px; height: 22px; border-radius: 100px;
      background: var(--border-strong); position: relative;
      transition: all 0.2s ease; cursor: pointer;
    }
    .toggle::after {
      content: ""; position: absolute; top: 2px; left: 2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff; transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle.on { background: var(--blue); }
    .toggle.on::after { left: 20px; }

    .channel-card.expandable { flex-direction: column; align-items: stretch; padding: 0; }
    .channel-card.expandable .channel-card-row {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 18px;
    }
    .channel-card-expand {
      background: var(--surface-subtle);
      border-top: 1px solid var(--border);
      padding: 0; max-height: 0; overflow: hidden;
      transition: max-height 0.25s ease;
    }
    .channel-card.expandable.open .channel-card-expand { max-height: 400px; padding: 16px 18px; }
    .expand-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
    }
    .expand-title { font-size: 12px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 6px; }
    .expand-title svg { width: 12px; height: 12px; color: var(--orange); }
    .snippet-box {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; line-height: 1.55;
      color: var(--text); max-height: 180px; overflow: auto;
      white-space: pre-wrap;
    }
    .expand-actions { display: flex; gap: 8px; margin-top: 10px; }

    .expand-chevron {
      margin-left: auto; color: var(--text-muted);
      transition: transform 0.2s ease;
    }
    .expand-chevron svg { width: 14px; height: 14px; }
    .channel-card.expandable.open .expand-chevron { transform: rotate(180deg); }

    /* ===== Preview (right column sticky) ===== */
    .sticky-col { position: sticky; top: 24px; }

    .preview-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      box-shadow: var(--shadow);
    }
    .preview-head {
      padding: 12px 16px; background: var(--surface-subtle);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
    }
    .preview-head-left { display: flex; align-items: center; gap: 10px; }
    .preview-dot-row { display: flex; gap: 4px; }
    .preview-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); }
    .preview-dot:nth-child(1) { background: #ff605c; }
    .preview-dot:nth-child(2) { background: #ffbd44; }
    .preview-dot:nth-child(3) { background: #00ca4e; }
    .preview-head-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.04em; }
    .preview-head-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px; color: var(--text-faint);
      background: var(--surface); border: 1px solid var(--border);
      padding: 3px 8px; border-radius: 100px;
    }

    .preview-carousel {
      position: relative; aspect-ratio: 16/10; overflow: hidden;
      background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--pink) 100%);
    }
    .preview-carousel::after {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 65% 30%, rgba(255,255,255,0.2), transparent 60%);
      pointer-events: none;
    }
    .preview-carousel-nav {
      position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 4px; z-index: 2;
    }
    .preview-carousel-nav span {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,255,255,0.55);
    }
    .preview-carousel-nav span.on { background: #fff; width: 18px; border-radius: 3px; }
    .preview-favorite {
      position: absolute; top: 12px; right: 12px; z-index: 2;
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.94); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
    }
    .preview-favorite svg { width: 16px; height: 16px; }
    .preview-photo-count {
      position: absolute; bottom: 12px; right: 12px; z-index: 2;
      background: rgba(20,32,74,0.7); color: #fff;
      font-size: 10.5px; font-weight: 700; padding: 4px 9px; border-radius: 100px;
      display: inline-flex; align-items: center; gap: 4px;
      backdrop-filter: blur(8px);
    }
    .preview-photo-count svg { width: 11px; height: 11px; }

    .preview-body { padding: 16px 18px; }
    .preview-price-row {
      display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;
    }
    .preview-price { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.024em; font-variant-numeric: tabular-nums; }
    .preview-price-sub { font-size: 13px; color: var(--text-muted); font-weight: 500; }
    .preview-specs {
      display: flex; gap: 14px; font-size: 13px; color: var(--text);
      font-weight: 600; margin-bottom: 8px;
    }
    .preview-specs strong { font-weight: 800; }
    .preview-specs .sep { color: var(--text-faint); font-weight: 400; }
    .preview-address { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
    .preview-address svg { width: 12px; height: 12px; }

    .preview-title { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; margin-bottom: 6px; line-height: 1.3; }
    .preview-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

    .preview-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .preview-tag {
      font-size: 11px; font-weight: 600; color: var(--navy);
      background: var(--blue-pale); padding: 4px 10px; border-radius: 100px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .preview-tag svg { width: 10px; height: 10px; }

    .preview-actions {
      display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border);
    }
    .preview-actions .btn-mini {
      flex: 1; padding: 9px 10px;
      font-size: 12px; font-weight: 700;
      border-radius: 8px; text-align: center;
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    }
    .preview-actions .btn-mini.primary { background: var(--blue); color: #fff; }
    .preview-actions .btn-mini.ghost { background: var(--surface-alt); color: var(--text); border: 1px solid var(--border); }
    .preview-actions .btn-mini svg { width: 12px; height: 12px; }

    /* ===== Analytics preview ===== */
    .analytics-card {
      margin-top: 16px; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 18px 20px;
    }
    .analytics-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
    }
    .analytics-head h4 {
      font-size: 12px; font-weight: 800; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .analytics-head-sub { font-size: 11px; color: var(--text-faint); }
    .analytics-total {
      font-size: 24px; font-weight: 800; color: var(--text);
      letter-spacing: -0.024em; margin-bottom: 2px;
      font-variant-numeric: tabular-nums;
    }
    .analytics-total-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }
    .analytics-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 0; font-size: 12.5px;
    }
    .analytics-row + .analytics-row { border-top: 1px solid var(--border); }
    .analytics-row-label { flex: 1; color: var(--text); font-weight: 600; }
    .analytics-row-bar {
      flex: 1.4; height: 6px; border-radius: 100px;
      background: var(--surface-alt); overflow: hidden;
    }
    .analytics-row-fill { height: 100%; border-radius: 100px; background: var(--blue); }
    .analytics-row-val { width: 60px; text-align: right; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
    .analytics-row.off { opacity: 0.45; }

    /* ===== Bottom action bar ===== */
    .action-bar {
      position: absolute; left: 0; right: 0; bottom: 0;
      background: var(--surface); border-top: 1px solid var(--border);
      padding: 14px 28px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; z-index: 20;
      box-shadow: 0 -4px 20px rgba(26,31,54,0.04);
    }
    .action-bar-left { display: flex; align-items: center; gap: 16px; font-size: 13px; color: var(--text-muted); }
    .action-bar-left strong { color: var(--text); font-weight: 700; }
    .action-bar-left .save-state {
      display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--green-dark);
    }
    .action-bar-left .save-state svg { width: 12px; height: 12px; }
    .action-bar-right { display: flex; align-items: center; gap: 10px; }

    /* ===== Schedule dropdown ===== */
    .schedule-wrap { position: relative; }
    .schedule-menu {
      position: absolute; bottom: calc(100% + 8px); right: 0;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 6px;
      box-shadow: var(--shadow-lg);
      min-width: 220px; z-index: 30;
      display: none; flex-direction: column; gap: 1px;
    }
    .schedule-menu.open { display: flex; }
    .schedule-option {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 600; color: var(--text);
      transition: background 0.15s; cursor: pointer;
    }
    .schedule-option:hover { background: var(--surface-alt); }
    .schedule-option.on { background: var(--blue-pale); color: var(--blue); }
    .schedule-option svg { width: 14px; height: 14px; opacity: 0.7; }
    .schedule-option-label { flex: 1; }
    .schedule-option-sub { font-size: 11px; color: var(--text-faint); font-weight: 500; }

    /* ===== Push overlay ===== */
    .push-overlay {
      position: absolute; inset: 0;
      background: rgba(20,32,74,0.55);
      backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center;
      z-index: 60;
    }
    .push-overlay.open { display: flex; }
    .push-modal {
      width: min(520px, 92vw);
      background: var(--surface); border-radius: 20px;
      padding: 28px 28px 22px;
      box-shadow: var(--shadow-xl);
      position: relative;
    }
    .push-modal-title {
      font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
      margin-bottom: 4px; text-align: center;
    }
    .push-modal-sub {
      font-size: 13px; color: var(--text-muted);
      text-align: center; margin-bottom: 22px;
    }
    .push-channels-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
    .push-channel-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 10px;
      background: var(--surface-alt); border: 1px solid var(--border);
      transition: all 0.3s ease;
    }
    .push-channel-row.live { background: var(--green-bg); border-color: rgba(30,169,124,0.3); }
    .push-channel-logo-sm {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: #fff; font-size: 11px; font-weight: 800;
    }
    .push-channel-name { flex: 1; font-size: 13px; font-weight: 700; color: var(--text); }
    .push-channel-state {
      font-size: 11px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .push-channel-state svg { width: 12px; height: 12px; }
    .push-channel-row.pending .push-channel-state { color: var(--blue); }
    .push-channel-row.live .push-channel-state { color: var(--green-dark); }

    .push-spin { animation: push-spin 0.8s linear infinite; }
    @keyframes push-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .push-success-summary {
      display: none; padding: 14px 16px; border-radius: 12px;
      background: linear-gradient(135deg, var(--green-bg), rgba(30,169,124,0.04));
      border: 1px solid rgba(30,169,124,0.2);
      margin-bottom: 16px; text-align: center;
    }
    .push-success-summary.show { display: block; }
    .push-success-summary h4 { font-size: 15px; font-weight: 800; color: var(--green-dark); margin-bottom: 2px; }
    .push-success-summary p { font-size: 12.5px; color: var(--text); }
    .push-success-summary strong { font-weight: 800; }

    .push-modal-actions { display: flex; gap: 10px; }
    .push-modal-actions .btn { flex: 1; justify-content: center; }
    .push-modal-close {
      position: absolute; top: 14px; right: 14px;
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .push-modal-close:hover { background: var(--border); color: var(--text); }
    .push-modal-close svg { width: 14px; height: 14px; }

    .push-headline-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
      color: #fff;
    }
    .push-headline-icon svg { width: 28px; height: 28px; }`;

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
          <a href="properties.html">Room A · 908 Lee Drive</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <strong>Syndicate</strong>
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

      <div class="page-scroll">

        <!-- Page head -->
        <div class="page-head-bar">
          <div class="page-head-left">
            <span class="page-head-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
              Syndicate
            </span>
            <h1>Push Room A to listing sites</h1>
            <p>Your listing goes live on every channel in about <strong>10 minutes</strong>. Edit once, broadcast to five sites, keep the leads flowing into one inbox.</p>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="syn-grid">

          <!-- LEFT COLUMN -->
          <div>

            <!-- Basic info -->
            <div class="card">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
                  <div class="card-head-text">
                    <h3>Basic info</h3>
                    <p>This is what tenants see at the top of every listing.</p>
                  </div>
                </div>
                <span class="ai-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  AI filled
                </span>
              </div>
              <div class="card-body">
                <div class="field">
                  <div class="label">Listing title <span class="label-hint">Shown on all 5 channels</span></div>
                  <input class="input" id="f-title" value="Furnished room in co-living house · 908 Lee Dr NW">
                </div>
                <div class="field-row-3">
                  <div class="field">
                    <div class="label">Monthly rent</div>
                    <div class="field-wrap">
                      <span class="field-prefix">$</span>
                      <input class="input with-prefix" id="f-rent" value="925" inputmode="numeric">
                    </div>
                  </div>
                  <div class="field">
                    <div class="label">Available</div>
                    <input class="input" id="f-date" type="date" value="2026-05-01">
                  </div>
                  <div class="field">
                    <div class="label">Lease term</div>
                    <select class="select" id="f-term">
                      <option>12 months</option>
                      <option selected>6 months</option>
                      <option>Month-to-month</option>
                      <option>3 months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Photos -->
            <div class="card">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21"/></svg></div>
                  <div class="card-head-text">
                    <h3>Photos <span style="color: var(--text-faint); font-weight: 500; font-size: 13px;">· 5 of 8</span></h3>
                    <p>First slot is the hero image. Drag to reorder.</p>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  Upload
                </button>
              </div>
              <div class="card-body">
                <div class="photo-grid">
                  <div class="photo-slot filled primary g1">
                    <span class="photo-primary-tag">Primary</span>
                    <span class="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>
                    <span class="photo-label">Exterior</span>
                  </div>
                  <div class="photo-slot filled g2">
                    <span class="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>
                    <span class="photo-label">Living room</span>
                  </div>
                  <div class="photo-slot filled g3">
                    <span class="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>
                    <span class="photo-label">Bedroom A</span>
                  </div>
                  <div class="photo-slot filled g4">
                    <span class="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>
                    <span class="photo-label">Kitchen</span>
                  </div>
                  <div class="photo-slot filled g5">
                    <span class="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>
                    <span class="photo-label">Bathroom</span>
                  </div>
                  <div class="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div class="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div class="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </div>
                <div class="photo-upload-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  Zillow and Apartments.com require at least 6 photos. We recommend 8 for best results.
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="card">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg></div>
                  <div class="card-head-text">
                    <h3>Description</h3>
                    <p>We drafted this from your property details — edit any part.</p>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.39 0 4.68.94 6.37 2.63L21 8"/><path d="M21 3v5h-5"/></svg>
                  Regenerate
                </button>
              </div>
              <div class="card-body">
                <textarea class="textarea" id="f-desc" maxlength="400">Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal. Includes high-speed wifi, all utilities, washer/dryer, a fully-stocked kitchen, and a shared backyard. Tenants get their own private bedroom and share common areas with 3 other working professionals. Ideal for engineers, remote workers, and graduate students.</textarea>
                <div class="char-count"><span id="char-now">382</span> / 400 characters</div>
              </div>
            </div>

            <!-- Amenities -->
            <div class="card">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3z"/></svg></div>
                  <div class="card-head-text">
                    <h3>Amenities</h3>
                    <p>Check every amenity that applies — syndicates to all channels.</p>
                  </div>
                </div>
                <span class="ai-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                  Smart defaults
                </span>
              </div>
              <div class="card-body">
                <div class="amen-grid" id="amen-grid">
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Utilities"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Utilities included</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Furnished"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Fully furnished</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Wifi"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Wi-Fi</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Parking"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Off-street parking</label>

                  <label class="amen-chip on"><input type="checkbox" checked data-amen="W/D"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>In-unit laundry</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="AC"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Central A/C</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Heat"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Central heat</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Dishwasher"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Dishwasher</label>

                  <label class="amen-chip"><input type="checkbox" data-amen="Pets"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Pets allowed</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Yard"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Private yard</label>
                  <label class="amen-chip"><input type="checkbox" data-amen="Garage"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Garage</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Dryer"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Electric dryer</label>

                  <label class="amen-chip"><input type="checkbox" data-amen="Gym"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Gym</label>
                  <label class="amen-chip"><input type="checkbox" data-amen="Pool"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Pool</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Hardwood"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Hardwood floors</label>
                  <label class="amen-chip"><input type="checkbox" data-amen="Fireplace"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Fireplace</label>

                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Cable"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Cable-ready</label>
                  <label class="amen-chip"><input type="checkbox" data-amen="Balcony"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Balcony</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Storage"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Storage space</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Smoke-free"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Smoke-free</label>

                  <label class="amen-chip"><input type="checkbox" data-amen="EV"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>EV charging</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Disposal"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Garbage disposal</label>
                  <label class="amen-chip"><input type="checkbox" data-amen="Walk-in"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Walk-in closet</label>
                  <label class="amen-chip on"><input type="checkbox" checked data-amen="Coliving"><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>Co-living friendly</label>
                </div>
              </div>
            </div>

            <!-- Application settings -->
            <div class="card">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></div>
                  <div class="card-head-text">
                    <h3>Where do leads land?</h3>
                    <p>Pick where tenants go when they click "Apply" on any channel.</p>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="radio-list" id="apply-radio">
                  <label class="radio-card on">
                    <input type="radio" name="apply" value="tenantory" checked>
                    <span class="dot"></span>
                    <div class="radio-card-body">
                      <div class="radio-card-title">Tenantory apply page <span style="font-size:10px; font-weight:800; letter-spacing: 0.06em; text-transform: uppercase; background: var(--green-bg); color: var(--green-dark); padding: 2px 7px; border-radius: 100px; margin-left: 6px;">Recommended</span></div>
                      <div class="radio-card-sub">Branded application form with ID verification, income checks, and auto-pushed leases. Leads arrive in your Applications inbox.</div>
                    </div>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="apply" value="external">
                    <span class="dot"></span>
                    <div class="radio-card-body">
                      <div class="radio-card-title">External URL</div>
                      <div class="radio-card-sub">Send applicants to your own form. Leads won't show in Tenantory.</div>
                      <input class="radio-inline-input" type="url" placeholder="https://your-site.com/apply">
                    </div>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="apply" value="both">
                    <span class="dot"></span>
                    <div class="radio-card-body">
                      <div class="radio-card-title">Both — let the tenant choose</div>
                      <div class="radio-card-sub">Show both options on the listing. Some tenants prefer Tenantory, some prefer your form.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Channels -->
            <div class="card" style="margin-top: 24px;">
              <div class="card-head">
                <div class="card-head-left">
                  <div class="card-head-icon pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg></div>
                  <div class="card-head-text">
                    <h3>Channels</h3>
                    <p>Five channels ready. Estimated combined reach updates below.</p>
                  </div>
                </div>
                <span class="card-head-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                  <span id="channel-count-badge">5 of 6 on</span>
                </span>
              </div>
              <div class="card-body">
                <div class="channel-list" id="channel-list">

                  <label class="channel-card on" data-channel="tenantory" data-reach="320">
                    <div class="channel-logo tenantory"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg></div>
                    <div class="channel-info">
                      <div class="channel-name-row">
                        <span class="channel-name">Tenantory vacancy page</span>
                        <span class="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>Ready</span>
                      </div>
                      <div class="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        ~320 views/wk <span class="dot-sep">·</span> Your own listings.html <span class="dot-sep">·</span> Instant update
                      </div>
                    </div>
                    <span class="toggle on"></span>
                  </label>

                  <label class="channel-card on" data-channel="zillow" data-reach="540">
                    <div class="channel-logo zillow"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 10v12h6v-7h8v7h6V10z"/></svg></div>
                    <div class="channel-info">
                      <div class="channel-name-row">
                        <span class="channel-name">Zillow Rental Manager</span>
                        <span class="channel-status pushed">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></svg>
                          Pushed 14 days ago
                        </span>
                      </div>
                      <div class="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21H3V3"/><path d="m6 16 4-5 4 2 5-6"/></svg>
                        ~540 views/wk <span class="dot-sep">·</span> Goes live in 8-12 min <span class="dot-sep">·</span> API connected
                      </div>
                    </div>
                    <span class="toggle on"></span>
                  </label>

                  <label class="channel-card on" data-channel="apartments" data-reach="210">
                    <div class="channel-logo apartments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01"/></svg></div>
                    <div class="channel-info">
                      <div class="channel-name-row">
                        <span class="channel-name">Apartments.com Network</span>
                        <span class="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>Ready</span>
                      </div>
                      <div class="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21H3V3"/><path d="m6 16 4-5 4 2 5-6"/></svg>
                        ~210 views/wk <span class="dot-sep">·</span> Includes Rentals.com, Apartamentos <span class="dot-sep">·</span> API
                      </div>
                    </div>
                    <span class="toggle on"></span>
                  </label>

                  <label class="channel-card on" data-channel="hotpads" data-reach="95">
                    <div class="channel-logo hotpads"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg></div>
                    <div class="channel-info">
                      <div class="channel-name-row">
                        <span class="channel-name">Hotpads</span>
                        <span class="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>Ready</span>
                      </div>
                      <div class="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21H3V3"/><path d="m6 16 4-5 4 2 5-6"/></svg>
                        ~95 views/wk <span class="dot-sep">·</span> Zillow-owned syndication partner
                      </div>
                    </div>
                    <span class="toggle on"></span>
                  </label>

                  <label class="channel-card on" data-channel="facebook" data-reach="75">
                    <div class="channel-logo facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></div>
                    <div class="channel-info">
                      <div class="channel-name-row">
                        <span class="channel-name">Facebook Marketplace</span>
                        <span class="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>Ready</span>
                      </div>
                      <div class="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        ~75 views/wk <span class="dot-sep">·</span> Posts to @BlackBearRentals page
                      </div>
                    </div>
                    <span class="toggle on"></span>
                  </label>

                  <div class="channel-card expandable" data-channel="craigslist" data-reach="110" id="craigslist-card">
                    <label class="channel-card-row">
                      <div class="channel-logo craigslist"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/><path fill="#fff" d="M12 6c-2 0-4 2-4 5s2 5 4 5c1.5 0 2.8-1 3.4-2.2l-1.5-.8c-.3.6-.9 1-1.9 1-1 0-2.2-1-2.2-3s1.2-3 2.2-3c1 0 1.6.4 1.9 1l1.5-.8C14.8 7 13.5 6 12 6z"/></svg></div>
                      <div class="channel-info">
                        <div class="channel-name-row">
                          <span class="channel-name">Craigslist</span>
                          <span class="channel-status manual">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
                            Manual
                          </span>
                        </div>
                        <div class="channel-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                          ~110 views/wk <span class="dot-sep">·</span> No API — we give you the text, you paste it
                        </div>
                      </div>
                      <button type="button" class="expand-chevron" id="craigslist-chev" aria-label="Toggle Craigslist paste">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                      <span class="toggle on"></span>
                    </label>
                    <div class="channel-card-expand">
                      <div class="expand-head">
                        <div class="expand-title">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          Copy this text into craigslist.org/hsv/apa/new
                        </div>
                        <button class="btn btn-ghost btn-sm" id="copy-cl-btn">Copy</button>
                      </div>
                      <div class="snippet-box" id="cl-snippet">$925 / 1br — Furnished room in co-living house · 908 Lee Dr NW (Huntsville, NW)

Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal.

INCLUDED: High-speed wifi, all utilities, washer/dryer, fully-stocked kitchen, off-street parking, central A/C, dishwasher.

TERMS: $925/mo · 6-month lease · Available May 1, 2026 · No pets · Smoke-free

Apply: tenantory.com/apply/lee908-a</div>
                      <div class="expand-actions">
                        <button class="btn btn-ghost btn-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>
                          Open craigslist.org
                        </button>
                        <button class="btn btn-ghost btn-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                          Download as .txt
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (sticky) -->
          <div class="sticky-col">

            <!-- Live preview -->
            <div class="preview-card">
              <div class="preview-head">
                <div class="preview-head-left">
                  <div class="preview-dot-row"><span class="preview-dot"></span><span class="preview-dot"></span><span class="preview-dot"></span></div>
                  <span class="preview-head-label">Live preview · Zillow style</span>
                </div>
                <span class="preview-head-url">zillow.com/b/...</span>
              </div>
              <div class="preview-carousel">
                <span class="preview-favorite"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.6 1-1.1a5.5 5.5 0 0 0 0-7.7z"/></svg></span>
                <span class="preview-photo-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21"/></svg>
                  <span id="pv-photo-count">5 photos</span>
                </span>
                <div class="preview-carousel-nav">
                  <span class="on"></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div class="preview-body">
                <div class="preview-price-row">
                  <span class="preview-price" id="pv-price">$925</span>
                  <span class="preview-price-sub">/mo</span>
                </div>
                <div class="preview-specs">
                  <span><strong>1</strong> bd</span><span class="sep">·</span>
                  <span><strong>1.5</strong> ba</span><span class="sep">·</span>
                  <span><strong>220</strong> sqft</span>
                </div>
                <div class="preview-address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  908 Lee Dr NW, Huntsville, AL 35816
                </div>

                <div class="preview-title" id="pv-title">Furnished room in co-living house · 908 Lee Dr NW</div>
                <div class="preview-desc" id="pv-desc">Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal.</div>

                <div class="preview-tags" id="pv-tags">
                  <span class="preview-tag">Utilities incl.</span>
                  <span class="preview-tag">Furnished</span>
                  <span class="preview-tag">Wi-Fi</span>
                  <span class="preview-tag">Parking</span>
                  <span class="preview-tag">In-unit laundry</span>
                  <span class="preview-tag">+7 more</span>
                </div>

                <div class="preview-actions">
                  <button class="btn-mini ghost">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Call
                  </button>
                  <button class="btn-mini primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    Apply now
                  </button>
                </div>
              </div>
            </div>

            <!-- Analytics preview -->
            <div class="analytics-card">
              <div class="analytics-head">
                <h4>Expected reach · Week 1</h4>
                <span class="analytics-head-sub">Based on 14-day avg</span>
              </div>
              <div class="analytics-total" id="an-total">1,240</div>
              <div class="analytics-total-sub">total impressions across on channels</div>

              <div class="analytics-row" data-channel="zillow">
                <span class="analytics-row-label">Zillow</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 100%;"></span></span>
                <span class="analytics-row-val">540</span>
              </div>
              <div class="analytics-row" data-channel="tenantory">
                <span class="analytics-row-label">Tenantory</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 59%; background: var(--pink);"></span></span>
                <span class="analytics-row-val">320</span>
              </div>
              <div class="analytics-row" data-channel="apartments">
                <span class="analytics-row-label">Apartments.com</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 39%; background: var(--navy);"></span></span>
                <span class="analytics-row-val">210</span>
              </div>
              <div class="analytics-row" data-channel="craigslist">
                <span class="analytics-row-label">Craigslist</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 20%; background: var(--purple);"></span></span>
                <span class="analytics-row-val">110</span>
              </div>
              <div class="analytics-row" data-channel="hotpads">
                <span class="analytics-row-label">Hotpads</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 18%; background: var(--gold);"></span></span>
                <span class="analytics-row-val">95</span>
              </div>
              <div class="analytics-row" data-channel="facebook">
                <span class="analytics-row-label">Facebook</span>
                <span class="analytics-row-bar"><span class="analytics-row-fill" style="width: 14%; background: var(--blue-bright);"></span></span>
                <span class="analytics-row-val">75</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- Bottom action bar -->
      <div class="action-bar">
        <div class="action-bar-left">
          <span class="save-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Draft saved 4 sec ago
          </span>
          <span>Publishing to <strong id="ab-channel-count">5 channels</strong> · <strong>Now</strong></span>
        </div>
        <div class="action-bar-right">
          <button class="btn btn-ghost">Save draft</button>
          <div class="schedule-wrap">
            <button class="btn btn-ghost" id="sched-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <span id="sched-label">Schedule: Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="schedule-menu" id="sched-menu">
              <button class="schedule-option on" data-val="Now"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span class="schedule-option-label">Now<div class="schedule-option-sub">Live in ~10 min</div></span></button>
              <button class="schedule-option" data-val="In 1 hour"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg><span class="schedule-option-label">In 1 hour<div class="schedule-option-sub">Tue, 3:14 PM CT</div></span></button>
              <button class="schedule-option" data-val="Tomorrow 9am"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span class="schedule-option-label">Tomorrow 9:00 AM<div class="schedule-option-sub">Best time for leads</div></span></button>
              <button class="schedule-option" data-val="Custom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M12 14l2 2 4-4"/></svg><span class="schedule-option-label">Custom…<div class="schedule-option-sub">Pick a date & time</div></span></button>
            </div>
          </div>
          <button class="btn btn-pink btn-lg" id="push-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
            <span id="push-btn-label">Push to 5 channels</span>
          </button>
        </div>
      </div>

      <!-- Push overlay -->
      <div class="push-overlay" id="push-overlay">
        <div class="push-modal">
          <button class="push-modal-close" id="push-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="push-headline-icon" id="push-headline-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          </div>
          <div class="push-modal-title" id="push-modal-title">Broadcasting to channels…</div>
          <div class="push-modal-sub" id="push-modal-sub">Don't close this window. You'll see each channel turn green as it goes live.</div>

          <div class="push-channels-list" id="push-channels-list">
            <!-- filled by JS -->
          </div>

          <div class="push-success-summary" id="push-summary">
            <h4 id="push-summary-h">All 5 channels live</h4>
            <p><strong id="push-summary-reach">1,240</strong> estimated impressions per week · First lead typically arrives in 3-6 hours.</p>
          </div>

          <div class="push-modal-actions">
            <button class="btn btn-ghost" id="push-analytics-btn" style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
              See analytics
            </button>
            <button class="btn btn-primary" id="push-view-btn" style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>
              View listing on Tenantory
            </button>
          </div>
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
