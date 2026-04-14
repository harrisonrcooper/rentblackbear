"use client";

// Mock ported from ~/Desktop/tenantory/admin-syndicate.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html, body { height: 100%; overflow: hidden; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt);\n      line-height: 1.5; font-size: 14px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, textarea, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --navy-darker: #14204a;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998;\n      --pink-bg: rgba(255,73,152,0.12);\n      --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --surface-subtle: #fafbfd;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --red-bg: rgba(214,69,69,0.12);\n      --orange: #ea8c3a;\n      --orange-bg: rgba(234,140,58,0.12);\n      --purple: #7c4dff;\n      --purple-bg: rgba(124,77,255,0.12);\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 16px rgba(26,31,54,0.06);\n      --shadow-lg: 0 12px 40px rgba(26,31,54,0.1);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.18);\n    }\n\n    /* ===== Layout ===== */\n    .app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; }\n\n    /* ===== Sidebar ===== */\n    .sidebar {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: rgba(255,255,255,0.75);\n      display: flex; flex-direction: column;\n      border-right: 1px solid rgba(255,255,255,0.04);\n    }\n    .sb-brand { display: flex; align-items: center; gap: 10px; padding: 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }\n    .sb-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(18,81,173,0.3); }\n    .sb-logo svg { width: 18px; height: 18px; color: #fff; }\n    .sb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .sb-brand-ws { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }\n    .sb-section { padding: 16px 12px; flex: 1; overflow-y: auto; }\n    .sb-section-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.14em; padding: 8px 12px 10px; }\n    .sb-nav { display: flex; flex-direction: column; gap: 2px; }\n    .sb-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); transition: all 0.15s ease; position: relative; }\n    .sb-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }\n    .sb-nav-item.active { background: linear-gradient(90deg, rgba(255,73,152,0.18), rgba(255,73,152,0.08)); color: #fff; }\n    .sb-nav-item.active::before { content: \"\"; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px; background: var(--pink); border-radius: 0 3px 3px 0; }\n    .sb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.9; }\n    .sb-nav-item.active svg { color: var(--pink); opacity: 1; }\n    .sb-nav-badge { margin-left: auto; background: var(--pink); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }\n    .sb-nav-count { margin-left: auto; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }\n    .sb-user { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }\n    .sb-user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.04); transition: all 0.15s ease; cursor: pointer; }\n    .sb-user-card:hover { background: rgba(255,255,255,0.08); }\n    .sb-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--pink), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }\n    .sb-user-info { flex: 1; min-width: 0; }\n    .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }\n    .sb-user-email { font-size: 11px; color: rgba(255,255,255,0.5); }\n    .sb-user-action { color: rgba(255,255,255,0.5); }\n\n    /* ===== Main ===== */\n    .main { display: flex; flex-direction: column; overflow: hidden; background: var(--surface-alt); position: relative; }\n\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 12px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 24px; flex-shrink: 0;\n    }\n    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }\n    .topbar-breadcrumb a { color: var(--text-muted); transition: color .15s; }\n    .topbar-breadcrumb a:hover { color: var(--blue); }\n    .topbar-breadcrumb strong { color: var(--text); font-weight: 600; }\n    .topbar-breadcrumb svg { width: 14px; height: 14px; opacity: 0.5; }\n    .topbar-right { display: flex; align-items: center; gap: 10px; }\n    .topbar-search {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; background: var(--surface-alt);\n      border: 1px solid var(--border); border-radius: 100px;\n      min-width: 320px; color: var(--text-faint);\n    }\n    .topbar-search svg { width: 16px; height: 16px; }\n    .topbar-search input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; color: var(--text); }\n    .topbar-search kbd { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--surface); border: 1px solid var(--border); padding: 2px 5px; border-radius: 4px; color: var(--text-faint); }\n    .topbar-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; position: relative; }\n    .topbar-icon:hover { background: var(--blue-pale); color: var(--blue); }\n    .topbar-icon svg { width: 18px; height: 18px; }\n    .topbar-icon-dot { position: absolute; top: 7px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--pink); border: 2px solid #fff; }\n\n    .page-scroll { flex: 1; overflow-y: auto; padding-bottom: 96px; }\n\n    /* ===== Page head ===== */\n    .page-head-bar {\n      padding: 24px 28px 0;\n      display: flex; justify-content: space-between; align-items: flex-start;\n      gap: 20px; flex-wrap: wrap;\n    }\n    .page-head-left { max-width: 680px; }\n    .page-head-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      background: var(--pink-bg); color: var(--pink);\n      font-size: 11px; font-weight: 800; letter-spacing: 0.1em;\n      text-transform: uppercase; padding: 4px 10px; border-radius: 100px;\n      margin-bottom: 10px;\n    }\n    .page-head-eyebrow svg { width: 11px; height: 11px; }\n    .page-head-bar h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.024em; margin-bottom: 6px; color: var(--text); }\n    .page-head-bar p { color: var(--text-muted); font-size: 14px; line-height: 1.55; }\n    .page-head-bar p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Buttons ===== */\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-dark { background: var(--navy); color: #fff; }\n    .btn-dark:hover { background: var(--navy-dark); }\n    .btn-pink { background: var(--pink); color: #fff; box-shadow: 0 8px 20px rgba(255,73,152,0.28); }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 10px 24px rgba(255,73,152,0.34); }\n    .btn-sm { padding: 6px 12px; font-size: 12px; }\n    .btn-lg { padding: 13px 22px; font-size: 14px; font-weight: 700; }\n    .btn svg { width: 14px; height: 14px; }\n\n    /* ===== Main grid ===== */\n    .syn-grid {\n      padding: 24px 28px 28px;\n      display: grid;\n      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);\n      gap: 24px;\n      align-items: start;\n    }\n    @media (max-width: 1200px) { .syn-grid { grid-template-columns: 1fr; } }\n\n    /* ===== Card ===== */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n    }\n    .card + .card { margin-top: 20px; }\n    .card-head {\n      padding: 18px 22px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between; gap: 14px;\n    }\n    .card-head-left { display: flex; align-items: center; gap: 12px; min-width: 0; }\n    .card-head-icon {\n      width: 32px; height: 32px; border-radius: 9px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .card-head-icon svg { width: 16px; height: 16px; }\n    .card-head-icon.pink { background: var(--pink-bg); color: var(--pink); }\n    .card-head-icon.green { background: var(--green-bg); color: var(--green-dark); }\n    .card-head-icon.purple { background: var(--purple-bg); color: var(--purple); }\n    .card-head-text h3 { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .card-head-text p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .card-head-badge {\n      font-size: 11px; font-weight: 700;\n      background: var(--green-bg); color: var(--green-dark);\n      padding: 4px 10px; border-radius: 100px;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .card-head-badge svg { width: 10px; height: 10px; }\n    .card-body { padding: 20px 22px; }\n\n    /* ===== Form ===== */\n    .field { display: flex; flex-direction: column; gap: 6px; }\n    .field + .field { margin-top: 16px; }\n    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }\n    .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-top: 16px; }\n    .label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.08em;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .label-hint { font-size: 10px; color: var(--text-faint); text-transform: none; letter-spacing: 0; font-weight: 500; }\n    .input, .textarea, .select {\n      width: 100%; padding: 11px 14px; border-radius: 10px;\n      border: 1px solid var(--border); background: var(--surface);\n      color: var(--text); font-size: 14px; font-weight: 500;\n      transition: all 0.15s ease; outline: none;\n    }\n    .input:focus, .textarea:focus, .select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-pale); }\n    .input.with-prefix { padding-left: 32px; }\n    .field-wrap { position: relative; }\n    .field-prefix {\n      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);\n      color: var(--text-faint); font-weight: 600; font-size: 14px; pointer-events: none;\n    }\n    .textarea { resize: vertical; min-height: 112px; line-height: 1.55; font-weight: 400; }\n    .char-count {\n      font-size: 11px; color: var(--text-faint);\n      margin-top: 6px; text-align: right;\n      font-variant-numeric: tabular-nums;\n    }\n    .ai-badge {\n      display: inline-flex; align-items: center; gap: 4px;\n      background: linear-gradient(135deg, var(--purple-bg), var(--pink-bg));\n      color: var(--purple); font-size: 10px; font-weight: 700;\n      padding: 3px 8px; border-radius: 100px;\n      letter-spacing: 0.04em;\n    }\n    .ai-badge svg { width: 10px; height: 10px; }\n\n    /* ===== Photo grid ===== */\n    .photo-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;\n    }\n    .photo-slot {\n      aspect-ratio: 4/3; border-radius: 10px;\n      background: var(--surface-alt); border: 1.5px dashed var(--border-strong);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-faint); position: relative; overflow: hidden;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .photo-slot:hover { border-color: var(--blue); color: var(--blue); }\n    .photo-slot svg { width: 22px; height: 22px; }\n    .photo-slot.filled {\n      border: 1px solid var(--border); cursor: grab;\n      color: rgba(255,255,255,0.95);\n    }\n    .photo-slot.filled.primary { outline: 2px solid var(--pink); outline-offset: 2px; }\n    .photo-slot.filled::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: radial-gradient(ellipse at 60% 30%, rgba(255,255,255,0.22), transparent 60%);\n      pointer-events: none;\n    }\n    .photo-slot.g1 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--pink) 100%); }\n    .photo-slot.g2 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--blue-bright) 100%); }\n    .photo-slot.g3 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--gold) 100%); }\n    .photo-slot.g4 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--green) 100%); }\n    .photo-slot.g5 { background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--purple) 100%); }\n    .photo-primary-tag {\n      position: absolute; top: 6px; left: 6px; z-index: 2;\n      background: var(--pink); color: #fff;\n      font-size: 9px; font-weight: 800; letter-spacing: 0.08em;\n      padding: 3px 7px; border-radius: 100px; text-transform: uppercase;\n    }\n    .photo-drag-handle {\n      position: absolute; top: 6px; right: 6px; z-index: 2;\n      width: 22px; height: 22px; border-radius: 6px;\n      background: rgba(20,32,74,0.55); backdrop-filter: blur(8px);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n    }\n    .photo-drag-handle svg { width: 12px; height: 12px; }\n    .photo-label {\n      position: absolute; bottom: 6px; left: 6px; z-index: 2;\n      font-size: 10px; font-weight: 700;\n      color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.4);\n    }\n    .photo-upload-note {\n      font-size: 11px; color: var(--text-muted); margin-top: 10px;\n      display: flex; align-items: center; gap: 6px;\n    }\n    .photo-upload-note svg { width: 12px; height: 12px; color: var(--blue); }\n\n    /* ===== Amenities grid ===== */\n    .amen-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;\n    }\n    @media (max-width: 900px) { .amen-grid { grid-template-columns: repeat(2, 1fr); } }\n    .amen-chip {\n      display: flex; align-items: center; gap: 8px;\n      padding: 10px 12px; border-radius: 10px;\n      border: 1px solid var(--border); background: var(--surface);\n      font-size: 12.5px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease; cursor: pointer; user-select: none;\n    }\n    .amen-chip:hover { border-color: var(--border-strong); color: var(--text); }\n    .amen-chip input { display: none; }\n    .amen-chip .check {\n      width: 16px; height: 16px; border-radius: 4px;\n      border: 1.5px solid var(--border-strong);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; background: var(--surface); transition: all 0.15s;\n    }\n    .amen-chip .check svg { width: 10px; height: 10px; color: #fff; opacity: 0; }\n    .amen-chip.on { border-color: var(--blue); color: var(--navy); background: var(--blue-pale); }\n    .amen-chip.on .check { background: var(--blue); border-color: var(--blue); }\n    .amen-chip.on .check svg { opacity: 1; }\n\n    /* ===== Radio list ===== */\n    .radio-list { display: flex; flex-direction: column; gap: 10px; }\n    .radio-card {\n      display: flex; align-items: flex-start; gap: 12px;\n      padding: 14px 16px; border-radius: 12px;\n      border: 1.5px solid var(--border); background: var(--surface);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .radio-card:hover { border-color: var(--border-strong); }\n    .radio-card.on { border-color: var(--blue); background: var(--blue-pale); }\n    .radio-card input { display: none; }\n    .radio-card .dot {\n      width: 18px; height: 18px; border-radius: 50%;\n      border: 2px solid var(--border-strong);\n      flex-shrink: 0; margin-top: 2px;\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s;\n    }\n    .radio-card.on .dot { border-color: var(--blue); }\n    .radio-card.on .dot::after {\n      content: \"\"; width: 8px; height: 8px; border-radius: 50%; background: var(--blue);\n    }\n    .radio-card-body { flex: 1; min-width: 0; }\n    .radio-card-title { font-size: 13px; font-weight: 700; color: var(--text); }\n    .radio-card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .radio-card input[type=\"url\"] {\n      margin-top: 8px; width: 100%;\n      padding: 8px 12px; border-radius: 8px;\n      border: 1px solid var(--border); outline: none;\n      font-size: 13px;\n    }\n    .radio-inline-input {\n      display: none;\n      margin-top: 8px; width: 100%;\n      padding: 8px 12px; border-radius: 8px;\n      border: 1px solid var(--border); outline: none;\n      font-size: 13px; background: var(--surface);\n    }\n    .radio-card.on .radio-inline-input { display: block; }\n\n    /* ===== Channel cards ===== */\n    .channel-list { display: flex; flex-direction: column; gap: 12px; }\n    .channel-card {\n      display: flex; align-items: center; gap: 16px;\n      padding: 16px 18px; border-radius: 12px;\n      border: 1.5px solid var(--border); background: var(--surface);\n      transition: all 0.15s ease;\n    }\n    .channel-card.on { border-color: var(--blue); background: linear-gradient(180deg, var(--blue-pale) 0%, var(--surface) 100%); }\n    .channel-card.disabled { opacity: 0.65; }\n    .channel-logo {\n      width: 52px; height: 52px; border-radius: 12px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; color: #fff; font-weight: 800; font-size: 14px;\n      letter-spacing: -0.02em;\n    }\n    .channel-logo.tenantory { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }\n    .channel-logo.zillow { background: #1c6bb9; }\n    .channel-logo.apartments { background: #0f2236; }\n    .channel-logo.hotpads { background: #f5a623; color: #1a1f36; }\n    .channel-logo.facebook { background: #1877f2; }\n    .channel-logo.craigslist { background: #5c2d91; }\n    .channel-logo svg { width: 22px; height: 22px; }\n    .channel-info { flex: 1; min-width: 0; }\n    .channel-name-row {\n      display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;\n    }\n    .channel-name { font-size: 14px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .channel-status {\n      display: inline-flex; align-items: center; gap: 4px;\n      font-size: 10.5px; font-weight: 700;\n      padding: 2px 8px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.06em;\n    }\n    .channel-status.ready { background: var(--green-bg); color: var(--green-dark); }\n    .channel-status.pushed { background: var(--blue-pale); color: var(--blue); }\n    .channel-status.manual { background: var(--orange-bg); color: var(--orange); }\n    .channel-status.disconnected { background: var(--surface-alt); color: var(--text-muted); }\n    .channel-status svg { width: 9px; height: 9px; }\n    .channel-meta { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }\n    .channel-meta svg { width: 11px; height: 11px; }\n    .channel-meta .dot-sep { color: var(--text-faint); }\n\n    .toggle {\n      flex-shrink: 0; width: 40px; height: 22px; border-radius: 100px;\n      background: var(--border-strong); position: relative;\n      transition: all 0.2s ease; cursor: pointer;\n    }\n    .toggle::after {\n      content: \"\"; position: absolute; top: 2px; left: 2px;\n      width: 18px; height: 18px; border-radius: 50%;\n      background: #fff; transition: all 0.2s ease;\n      box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n    }\n    .toggle.on { background: var(--blue); }\n    .toggle.on::after { left: 20px; }\n\n    .channel-card.expandable { flex-direction: column; align-items: stretch; padding: 0; }\n    .channel-card.expandable .channel-card-row {\n      display: flex; align-items: center; gap: 16px;\n      padding: 16px 18px;\n    }\n    .channel-card-expand {\n      background: var(--surface-subtle);\n      border-top: 1px solid var(--border);\n      padding: 0; max-height: 0; overflow: hidden;\n      transition: max-height 0.25s ease;\n    }\n    .channel-card.expandable.open .channel-card-expand { max-height: 400px; padding: 16px 18px; }\n    .expand-head {\n      display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;\n    }\n    .expand-title { font-size: 12px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 6px; }\n    .expand-title svg { width: 12px; height: 12px; color: var(--orange); }\n    .snippet-box {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 12px;\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 12px; line-height: 1.55;\n      color: var(--text); max-height: 180px; overflow: auto;\n      white-space: pre-wrap;\n    }\n    .expand-actions { display: flex; gap: 8px; margin-top: 10px; }\n\n    .expand-chevron {\n      margin-left: auto; color: var(--text-muted);\n      transition: transform 0.2s ease;\n    }\n    .expand-chevron svg { width: 14px; height: 14px; }\n    .channel-card.expandable.open .expand-chevron { transform: rotate(180deg); }\n\n    /* ===== Preview (right column sticky) ===== */\n    .sticky-col { position: sticky; top: 24px; }\n\n    .preview-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      box-shadow: var(--shadow);\n    }\n    .preview-head {\n      padding: 12px 16px; background: var(--surface-subtle);\n      border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between; gap: 10px;\n    }\n    .preview-head-left { display: flex; align-items: center; gap: 10px; }\n    .preview-dot-row { display: flex; gap: 4px; }\n    .preview-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); }\n    .preview-dot:nth-child(1) { background: #ff605c; }\n    .preview-dot:nth-child(2) { background: #ffbd44; }\n    .preview-dot:nth-child(3) { background: #00ca4e; }\n    .preview-head-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.04em; }\n    .preview-head-url {\n      font-family: 'JetBrains Mono', monospace;\n      font-size: 10.5px; color: var(--text-faint);\n      background: var(--surface); border: 1px solid var(--border);\n      padding: 3px 8px; border-radius: 100px;\n    }\n\n    .preview-carousel {\n      position: relative; aspect-ratio: 16/10; overflow: hidden;\n      background: linear-gradient(135deg, var(--navy-darker) 0%, var(--navy) 45%, var(--pink) 100%);\n    }\n    .preview-carousel::after {\n      content: \"\"; position: absolute; inset: 0;\n      background: radial-gradient(ellipse at 65% 30%, rgba(255,255,255,0.2), transparent 60%);\n      pointer-events: none;\n    }\n    .preview-carousel-nav {\n      position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);\n      display: flex; gap: 4px; z-index: 2;\n    }\n    .preview-carousel-nav span {\n      width: 6px; height: 6px; border-radius: 50%;\n      background: rgba(255,255,255,0.55);\n    }\n    .preview-carousel-nav span.on { background: #fff; width: 18px; border-radius: 3px; }\n    .preview-favorite {\n      position: absolute; top: 12px; right: 12px; z-index: 2;\n      width: 34px; height: 34px; border-radius: 50%;\n      background: rgba(255,255,255,0.94); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .preview-favorite svg { width: 16px; height: 16px; }\n    .preview-photo-count {\n      position: absolute; bottom: 12px; right: 12px; z-index: 2;\n      background: rgba(20,32,74,0.7); color: #fff;\n      font-size: 10.5px; font-weight: 700; padding: 4px 9px; border-radius: 100px;\n      display: inline-flex; align-items: center; gap: 4px;\n      backdrop-filter: blur(8px);\n    }\n    .preview-photo-count svg { width: 11px; height: 11px; }\n\n    .preview-body { padding: 16px 18px; }\n    .preview-price-row {\n      display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;\n    }\n    .preview-price { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.024em; font-variant-numeric: tabular-nums; }\n    .preview-price-sub { font-size: 13px; color: var(--text-muted); font-weight: 500; }\n    .preview-specs {\n      display: flex; gap: 14px; font-size: 13px; color: var(--text);\n      font-weight: 600; margin-bottom: 8px;\n    }\n    .preview-specs strong { font-weight: 800; }\n    .preview-specs .sep { color: var(--text-faint); font-weight: 400; }\n    .preview-address { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }\n    .preview-address svg { width: 12px; height: 12px; }\n\n    .preview-title { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; margin-bottom: 6px; line-height: 1.3; }\n    .preview-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }\n\n    .preview-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }\n    .preview-tag {\n      font-size: 11px; font-weight: 600; color: var(--navy);\n      background: var(--blue-pale); padding: 4px 10px; border-radius: 100px;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .preview-tag svg { width: 10px; height: 10px; }\n\n    .preview-actions {\n      display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border);\n    }\n    .preview-actions .btn-mini {\n      flex: 1; padding: 9px 10px;\n      font-size: 12px; font-weight: 700;\n      border-radius: 8px; text-align: center;\n      display: inline-flex; align-items: center; justify-content: center; gap: 5px;\n    }\n    .preview-actions .btn-mini.primary { background: var(--blue); color: #fff; }\n    .preview-actions .btn-mini.ghost { background: var(--surface-alt); color: var(--text); border: 1px solid var(--border); }\n    .preview-actions .btn-mini svg { width: 12px; height: 12px; }\n\n    /* ===== Analytics preview ===== */\n    .analytics-card {\n      margin-top: 16px; background: var(--surface);\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      padding: 18px 20px;\n    }\n    .analytics-head {\n      display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;\n    }\n    .analytics-head h4 {\n      font-size: 12px; font-weight: 800; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .analytics-head-sub { font-size: 11px; color: var(--text-faint); }\n    .analytics-total {\n      font-size: 24px; font-weight: 800; color: var(--text);\n      letter-spacing: -0.024em; margin-bottom: 2px;\n      font-variant-numeric: tabular-nums;\n    }\n    .analytics-total-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }\n    .analytics-row {\n      display: flex; align-items: center; gap: 10px;\n      padding: 8px 0; font-size: 12.5px;\n    }\n    .analytics-row + .analytics-row { border-top: 1px solid var(--border); }\n    .analytics-row-label { flex: 1; color: var(--text); font-weight: 600; }\n    .analytics-row-bar {\n      flex: 1.4; height: 6px; border-radius: 100px;\n      background: var(--surface-alt); overflow: hidden;\n    }\n    .analytics-row-fill { height: 100%; border-radius: 100px; background: var(--blue); }\n    .analytics-row-val { width: 60px; text-align: right; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n    .analytics-row.off { opacity: 0.45; }\n\n    /* ===== Bottom action bar ===== */\n    .action-bar {\n      position: absolute; left: 0; right: 0; bottom: 0;\n      background: var(--surface); border-top: 1px solid var(--border);\n      padding: 14px 28px;\n      display: flex; align-items: center; justify-content: space-between;\n      gap: 16px; z-index: 20;\n      box-shadow: 0 -4px 20px rgba(26,31,54,0.04);\n    }\n    .action-bar-left { display: flex; align-items: center; gap: 16px; font-size: 13px; color: var(--text-muted); }\n    .action-bar-left strong { color: var(--text); font-weight: 700; }\n    .action-bar-left .save-state {\n      display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--green-dark);\n    }\n    .action-bar-left .save-state svg { width: 12px; height: 12px; }\n    .action-bar-right { display: flex; align-items: center; gap: 10px; }\n\n    /* ===== Schedule dropdown ===== */\n    .schedule-wrap { position: relative; }\n    .schedule-menu {\n      position: absolute; bottom: calc(100% + 8px); right: 0;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 12px; padding: 6px;\n      box-shadow: var(--shadow-lg);\n      min-width: 220px; z-index: 30;\n      display: none; flex-direction: column; gap: 1px;\n    }\n    .schedule-menu.open { display: flex; }\n    .schedule-option {\n      display: flex; align-items: center; gap: 10px;\n      padding: 10px 12px; border-radius: 8px;\n      font-size: 13px; font-weight: 600; color: var(--text);\n      transition: background 0.15s; cursor: pointer;\n    }\n    .schedule-option:hover { background: var(--surface-alt); }\n    .schedule-option.on { background: var(--blue-pale); color: var(--blue); }\n    .schedule-option svg { width: 14px; height: 14px; opacity: 0.7; }\n    .schedule-option-label { flex: 1; }\n    .schedule-option-sub { font-size: 11px; color: var(--text-faint); font-weight: 500; }\n\n    /* ===== Push overlay ===== */\n    .push-overlay {\n      position: absolute; inset: 0;\n      background: rgba(20,32,74,0.55);\n      backdrop-filter: blur(8px);\n      display: none; align-items: center; justify-content: center;\n      z-index: 60;\n    }\n    .push-overlay.open { display: flex; }\n    .push-modal {\n      width: min(520px, 92vw);\n      background: var(--surface); border-radius: 20px;\n      padding: 28px 28px 22px;\n      box-shadow: var(--shadow-xl);\n      position: relative;\n    }\n    .push-modal-title {\n      font-size: 20px; font-weight: 800; letter-spacing: -0.02em;\n      margin-bottom: 4px; text-align: center;\n    }\n    .push-modal-sub {\n      font-size: 13px; color: var(--text-muted);\n      text-align: center; margin-bottom: 22px;\n    }\n    .push-channels-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }\n    .push-channel-row {\n      display: flex; align-items: center; gap: 12px;\n      padding: 12px 14px; border-radius: 10px;\n      background: var(--surface-alt); border: 1px solid var(--border);\n      transition: all 0.3s ease;\n    }\n    .push-channel-row.live { background: var(--green-bg); border-color: rgba(30,169,124,0.3); }\n    .push-channel-logo-sm {\n      width: 32px; height: 32px; border-radius: 8px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0; color: #fff; font-size: 11px; font-weight: 800;\n    }\n    .push-channel-name { flex: 1; font-size: 13px; font-weight: 700; color: var(--text); }\n    .push-channel-state {\n      font-size: 11px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .push-channel-state svg { width: 12px; height: 12px; }\n    .push-channel-row.pending .push-channel-state { color: var(--blue); }\n    .push-channel-row.live .push-channel-state { color: var(--green-dark); }\n\n    .push-spin { animation: push-spin 0.8s linear infinite; }\n    @keyframes push-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n\n    .push-success-summary {\n      display: none; padding: 14px 16px; border-radius: 12px;\n      background: linear-gradient(135deg, var(--green-bg), rgba(30,169,124,0.04));\n      border: 1px solid rgba(30,169,124,0.2);\n      margin-bottom: 16px; text-align: center;\n    }\n    .push-success-summary.show { display: block; }\n    .push-success-summary h4 { font-size: 15px; font-weight: 800; color: var(--green-dark); margin-bottom: 2px; }\n    .push-success-summary p { font-size: 12.5px; color: var(--text); }\n    .push-success-summary strong { font-weight: 800; }\n\n    .push-modal-actions { display: flex; gap: 10px; }\n    .push-modal-actions .btn { flex: 1; justify-content: center; }\n    .push-modal-close {\n      position: absolute; top: 14px; right: 14px;\n      width: 30px; height: 30px; border-radius: 8px;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      transition: all 0.15s;\n    }\n    .push-modal-close:hover { background: var(--border); color: var(--text); }\n    .push-modal-close svg { width: 14px; height: 14px; }\n\n    .push-headline-icon {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 14px;\n      color: #fff;\n    }\n    .push-headline-icon svg { width: 28px; height: 28px; }\n\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <div className="app">

    
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </div>
        <div>
          <div className="sb-brand-name">Tenantory</div>
          <div className="sb-brand-ws">Black Bear Rentals</div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-label">Overview</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="admin-v2.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>Dashboard
          </a>
          <a className="sb-nav-item active" href="properties.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /></svg>Properties
            <span className="sb-nav-count">4</span>
          </a>
          <a className="sb-nav-item" href="tenants.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>Tenants
            <span className="sb-nav-count">12</span>
          </a>
          <a className="sb-nav-item" href="leases.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 14h6M9 18h6" /></svg>Leases
          </a>
          <a className="sb-nav-item" href="applications.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>Applications
            <span className="sb-nav-badge">3</span>
          </a>
        </div>

        <div className="sb-section-label" style={{marginTop: "20px"}}>Operations</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="payments.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>Payments
          </a>
          <a className="sb-nav-item" href="maintenance.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1" /></svg>Maintenance
            <span className="sb-nav-count">5</span>
          </a>
          <a className="sb-nav-item" href="reports.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>Reports
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>Vendors
          </a>
        </div>

        <div className="sb-section-label" style={{marginTop: "20px"}}>Workspace</div>
        <div className="sb-nav">
          <a className="sb-nav-item" href="settings.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5" /></svg>Settings
          </a>
          <a className="sb-nav-item" href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>Documents
          </a>
        </div>
      </div>

      <div className="sb-user">
        <div className="sb-user-card">
          <div className="sb-user-avatar">HC</div>
          <div className="sb-user-info">
            <div className="sb-user-name">Harrison Cooper</div>
            <div className="sb-user-email">harrison@rentblackbear.com</div>
          </div>
          <div className="sb-user-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </aside>

    
    <main className="main">

      
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <a href="properties.html">Properties</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <a href="properties.html">Room A · 908 Lee Drive</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <strong>Syndicate</strong>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input placeholder="Search tenants, leases, invoices…" />
            <kbd>⌘K</kbd>
          </div>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="topbar-icon-dot" />
          </button>
          <button className="topbar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
        </div>
      </div>

      <div className="page-scroll">

        
        <div className="page-head-bar">
          <div className="page-head-left">
            <span className="page-head-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
              Syndicate
            </span>
            <h1>Push Room A to listing sites</h1>
            <p>Your listing goes live on every channel in about <strong>10 minutes</strong>. Edit once, broadcast to five sites, keep the leads flowing into one inbox.</p>
          </div>
        </div>

        
        <div className="syn-grid">

          
          <div>

            
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg></div>
                  <div className="card-head-text">
                    <h3>Basic info</h3>
                    <p>This is what tenants see at the top of every listing.</p>
                  </div>
                </div>
                <span className="ai-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                  AI filled
                </span>
              </div>
              <div className="card-body">
                <div className="field">
                  <div className="label">Listing title <span className="label-hint">Shown on all 5 channels</span></div>
                  <input className="input" id="f-title" value="Furnished room in co-living house · 908 Lee Dr NW" />
                </div>
                <div className="field-row-3">
                  <div className="field">
                    <div className="label">Monthly rent</div>
                    <div className="field-wrap">
                      <span className="field-prefix">$</span>
                      <input className="input with-prefix" id="f-rent" value="925" inputMode="numeric" />
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Available</div>
                    <input className="input" id="f-date" type="date" value="2026-05-01" />
                  </div>
                  <div className="field">
                    <div className="label">Lease term</div>
                    <select className="select" id="f-term">
                      <option>12 months</option>
                      <option selected>6 months</option>
                      <option>Month-to-month</option>
                      <option>3 months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21" /></svg></div>
                  <div className="card-head-text">
                    <h3>Photos <span style={{color: "var(--text-faint)", fontWeight: "500", fontSize: "13px"}}>· 5 of 8</span></h3>
                    <p>First slot is the hero image. Drag to reorder.</p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                  Upload
                </button>
              </div>
              <div className="card-body">
                <div className="photo-grid">
                  <div className="photo-slot filled primary g1">
                    <span className="photo-primary-tag">Primary</span>
                    <span className="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
                    <span className="photo-label">Exterior</span>
                  </div>
                  <div className="photo-slot filled g2">
                    <span className="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
                    <span className="photo-label">Living room</span>
                  </div>
                  <div className="photo-slot filled g3">
                    <span className="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
                    <span className="photo-label">Bedroom A</span>
                  </div>
                  <div className="photo-slot filled g4">
                    <span className="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
                    <span className="photo-label">Kitchen</span>
                  </div>
                  <div className="photo-slot filled g5">
                    <span className="photo-drag-handle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></svg></span>
                    <span className="photo-label">Bathroom</span>
                  </div>
                  <div className="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                  <div className="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                  <div className="photo-slot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                </div>
                <div className="photo-upload-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                  Zillow and Apartments.com require at least 6 photos. We recommend 8 for best results.
                </div>
              </div>
            </div>

            
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg></div>
                  <div className="card-head-text">
                    <h3>Description</h3>
                    <p>We drafted this from your property details — edit any part.</p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.39 0 4.68.94 6.37 2.63L21 8" /><path d="M21 3v5h-5" /></svg>
                  Regenerate
                </button>
              </div>
              <div className="card-body">
                <textarea className="textarea" id="f-desc" maxLength="400">Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal. Includes high-speed wifi, all utilities, washer/dryer, a fully-stocked kitchen, and a shared backyard. Tenants get their own private bedroom and share common areas with 3 other working professionals. Ideal for engineers, remote workers, and graduate students.</textarea>
                <div className="char-count"><span id="char-now">382</span> / 400 characters</div>
              </div>
            </div>

            
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3z" /></svg></div>
                  <div className="card-head-text">
                    <h3>Amenities</h3>
                    <p>Check every amenity that applies — syndicates to all channels.</p>
                  </div>
                </div>
                <span className="ai-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
                  Smart defaults
                </span>
              </div>
              <div className="card-body">
                <div className="amen-grid" id="amen-grid">
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Utilities" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Utilities included</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Furnished" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Fully furnished</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Wifi" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Wi-Fi</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Parking" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Off-street parking</label>

                  <label className="amen-chip on"><input type="checkbox" checked data-amen="W/D" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>In-unit laundry</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="AC" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Central A/C</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Heat" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Central heat</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Dishwasher" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Dishwasher</label>

                  <label className="amen-chip"><input type="checkbox" data-amen="Pets" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Pets allowed</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Yard" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Private yard</label>
                  <label className="amen-chip"><input type="checkbox" data-amen="Garage" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Garage</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Dryer" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Electric dryer</label>

                  <label className="amen-chip"><input type="checkbox" data-amen="Gym" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Gym</label>
                  <label className="amen-chip"><input type="checkbox" data-amen="Pool" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Pool</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Hardwood" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Hardwood floors</label>
                  <label className="amen-chip"><input type="checkbox" data-amen="Fireplace" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Fireplace</label>

                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Cable" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Cable-ready</label>
                  <label className="amen-chip"><input type="checkbox" data-amen="Balcony" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Balcony</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Storage" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Storage space</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Smoke-free" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Smoke-free</label>

                  <label className="amen-chip"><input type="checkbox" data-amen="EV" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>EV charging</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Disposal" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Garbage disposal</label>
                  <label className="amen-chip"><input type="checkbox" data-amen="Walk-in" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Walk-in closet</label>
                  <label className="amen-chip on"><input type="checkbox" checked data-amen="Coliving" /><span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>Co-living friendly</label>
                </div>
              </div>
            </div>

            
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg></div>
                  <div className="card-head-text">
                    <h3>Where do leads land?</h3>
                    <p>Pick where tenants go when they click "Apply" on any channel.</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="radio-list" id="apply-radio">
                  <label className="radio-card on">
                    <input type="radio" name="apply" value="tenantory" checked />
                    <span className="dot" />
                    <div className="radio-card-body">
                      <div className="radio-card-title">Tenantory apply page <span style={{fontSize: "10px", fontWeight: "800", letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--green-bg)", color: "var(--green-dark)", padding: "2px 7px", borderRadius: "100px", marginLeft: "6px"}}>Recommended</span></div>
                      <div className="radio-card-sub">Branded application form with ID verification, income checks, and auto-pushed leases. Leads arrive in your Applications inbox.</div>
                    </div>
                  </label>
                  <label className="radio-card">
                    <input type="radio" name="apply" value="external" />
                    <span className="dot" />
                    <div className="radio-card-body">
                      <div className="radio-card-title">External URL</div>
                      <div className="radio-card-sub">Send applicants to your own form. Leads won't show in Tenantory.</div>
                      <input className="radio-inline-input" type="url" placeholder="https://your-site.com/apply" />
                    </div>
                  </label>
                  <label className="radio-card">
                    <input type="radio" name="apply" value="both" />
                    <span className="dot" />
                    <div className="radio-card-body">
                      <div className="radio-card-title">Both — let the tenant choose</div>
                      <div className="radio-card-sub">Show both options on the listing. Some tenants prefer Tenantory, some prefer your form.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            
            <div className="card" style={{marginTop: "24px"}}>
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-head-icon pink"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg></div>
                  <div className="card-head-text">
                    <h3>Channels</h3>
                    <p>Five channels ready. Estimated combined reach updates below.</p>
                  </div>
                </div>
                <span className="card-head-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                  <span id="channel-count-badge">5 of 6 on</span>
                </span>
              </div>
              <div className="card-body">
                <div className="channel-list" id="channel-list">

                  <label className="channel-card on" data-channel="tenantory" data-reach="320">
                    <div className="channel-logo tenantory"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg></div>
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">Tenantory vacancy page</span>
                        <span className="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>Ready</span>
                      </div>
                      <div className="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        ~320 views/wk <span className="dot-sep">·</span> Your own listings.html <span className="dot-sep">·</span> Instant update
                      </div>
                    </div>
                    <span className="toggle on" />
                  </label>

                  <label className="channel-card on" data-channel="zillow" data-reach="540">
                    <div className="channel-logo zillow"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 10v12h6v-7h8v7h6V10z" /></svg></div>
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">Zillow Rental Manager</span>
                        <span className="channel-status pushed">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-5" /></svg>
                          Pushed 14 days ago
                        </span>
                      </div>
                      <div className="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V3" /><path d="m6 16 4-5 4 2 5-6" /></svg>
                        ~540 views/wk <span className="dot-sep">·</span> Goes live in 8-12 min <span className="dot-sep">·</span> API connected
                      </div>
                    </div>
                    <span className="toggle on" />
                  </label>

                  <label className="channel-card on" data-channel="apartments" data-reach="210">
                    <div className="channel-logo apartments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" /></svg></div>
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">Apartments.com Network</span>
                        <span className="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>Ready</span>
                      </div>
                      <div className="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V3" /><path d="m6 16 4-5 4 2 5-6" /></svg>
                        ~210 views/wk <span className="dot-sep">·</span> Includes Rentals.com, Apartamentos <span className="dot-sep">·</span> API
                      </div>
                    </div>
                    <span className="toggle on" />
                  </label>

                  <label className="channel-card on" data-channel="hotpads" data-reach="95">
                    <div className="channel-logo hotpads"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg></div>
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">Hotpads</span>
                        <span className="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>Ready</span>
                      </div>
                      <div className="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V3" /><path d="m6 16 4-5 4 2 5-6" /></svg>
                        ~95 views/wk <span className="dot-sep">·</span> Zillow-owned syndication partner
                      </div>
                    </div>
                    <span className="toggle on" />
                  </label>

                  <label className="channel-card on" data-channel="facebook" data-reach="75">
                    <div className="channel-logo facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></div>
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">Facebook Marketplace</span>
                        <span className="channel-status ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>Ready</span>
                      </div>
                      <div className="channel-meta">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        ~75 views/wk <span className="dot-sep">·</span> Posts to @BlackBearRentals page
                      </div>
                    </div>
                    <span className="toggle on" />
                  </label>

                  <div className="channel-card expandable" data-channel="craigslist" data-reach="110" id="craigslist-card">
                    <label className="channel-card-row">
                      <div className="channel-logo craigslist"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" /><path fill="#fff" d="M12 6c-2 0-4 2-4 5s2 5 4 5c1.5 0 2.8-1 3.4-2.2l-1.5-.8c-.3.6-.9 1-1.9 1-1 0-2.2-1-2.2-3s1.2-3 2.2-3c1 0 1.6.4 1.9 1l1.5-.8C14.8 7 13.5 6 12 6z" /></svg></div>
                      <div className="channel-info">
                        <div className="channel-name-row">
                          <span className="channel-name">Craigslist</span>
                          <span className="channel-status manual">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
                            Manual
                          </span>
                        </div>
                        <div className="channel-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
                          ~110 views/wk <span className="dot-sep">·</span> No API — we give you the text, you paste it
                        </div>
                      </div>
                      <button type="button" className="expand-chevron" id="craigslist-chev" aria-label="Toggle Craigslist paste">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                      </button>
                      <span className="toggle on" />
                    </label>
                    <div className="channel-card-expand">
                      <div className="expand-head">
                        <div className="expand-title">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copy this text into craigslist.org/hsv/apa/new
                        </div>
                        <button className="btn btn-ghost btn-sm" id="copy-cl-btn">Copy</button>
                      </div>
                      <div className="snippet-box" id="cl-snippet">$925 / 1br — Furnished room in co-living house · 908 Lee Dr NW (Huntsville, NW)

Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal.

INCLUDED: High-speed wifi, all utilities, washer/dryer, fully-stocked kitchen, off-street parking, central A/C, dishwasher.

TERMS: $925/mo · 6-month lease · Available May 1, 2026 · No pets · Smoke-free

Apply: tenantory.com/apply/lee908-a</div>
                      <div className="expand-actions">
                        <button className="btn btn-ghost btn-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></svg>
                          Open craigslist.org
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                          Download as .txt
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          
          <div className="sticky-col">

            
            <div className="preview-card">
              <div className="preview-head">
                <div className="preview-head-left">
                  <div className="preview-dot-row"><span className="preview-dot" /><span className="preview-dot" /><span className="preview-dot" /></div>
                  <span className="preview-head-label">Live preview · Zillow style</span>
                </div>
                <span className="preview-head-url">zillow.com/b/...</span>
              </div>
              <div className="preview-carousel">
                <span className="preview-favorite"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.6 1-1.1a5.5 5.5 0 0 0 0-7.7z" /></svg></span>
                <span className="preview-photo-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21" /></svg>
                  <span id="pv-photo-count">5 photos</span>
                </span>
                <div className="preview-carousel-nav">
                  <span className="on" /><span /><span /><span /><span />
                </div>
              </div>
              <div className="preview-body">
                <div className="preview-price-row">
                  <span className="preview-price" id="pv-price">$925</span>
                  <span className="preview-price-sub">/mo</span>
                </div>
                <div className="preview-specs">
                  <span><strong>1</strong> bd</span><span className="sep">·</span>
                  <span><strong>1.5</strong> ba</span><span className="sep">·</span>
                  <span><strong>220</strong> sqft</span>
                </div>
                <div className="preview-address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  908 Lee Dr NW, Huntsville, AL 35816
                </div>

                <div className="preview-title" id="pv-title">Furnished room in co-living house · 908 Lee Dr NW</div>
                <div className="preview-desc" id="pv-desc">Spacious, fully furnished private room in a beautifully renovated co-living house on a quiet NW Huntsville street. Walk to Blossomwood Elementary, 12 min to downtown, 18 min to Redstone Arsenal.</div>

                <div className="preview-tags" id="pv-tags">
                  <span className="preview-tag">Utilities incl.</span>
                  <span className="preview-tag">Furnished</span>
                  <span className="preview-tag">Wi-Fi</span>
                  <span className="preview-tag">Parking</span>
                  <span className="preview-tag">In-unit laundry</span>
                  <span className="preview-tag">+7 more</span>
                </div>

                <div className="preview-actions">
                  <button className="btn-mini ghost">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Call
                  </button>
                  <button className="btn-mini primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                    Apply now
                  </button>
                </div>
              </div>
            </div>

            
            <div className="analytics-card">
              <div className="analytics-head">
                <h4>Expected reach · Week 1</h4>
                <span className="analytics-head-sub">Based on 14-day avg</span>
              </div>
              <div className="analytics-total" id="an-total">1,240</div>
              <div className="analytics-total-sub">total impressions across on channels</div>

              <div className="analytics-row" data-channel="zillow">
                <span className="analytics-row-label">Zillow</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "100%"}} /></span>
                <span className="analytics-row-val">540</span>
              </div>
              <div className="analytics-row" data-channel="tenantory">
                <span className="analytics-row-label">Tenantory</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "59%", background: "var(--pink)"}} /></span>
                <span className="analytics-row-val">320</span>
              </div>
              <div className="analytics-row" data-channel="apartments">
                <span className="analytics-row-label">Apartments.com</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "39%", background: "var(--navy)"}} /></span>
                <span className="analytics-row-val">210</span>
              </div>
              <div className="analytics-row" data-channel="craigslist">
                <span className="analytics-row-label">Craigslist</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "20%", background: "var(--purple)"}} /></span>
                <span className="analytics-row-val">110</span>
              </div>
              <div className="analytics-row" data-channel="hotpads">
                <span className="analytics-row-label">Hotpads</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "18%", background: "var(--gold)"}} /></span>
                <span className="analytics-row-val">95</span>
              </div>
              <div className="analytics-row" data-channel="facebook">
                <span className="analytics-row-label">Facebook</span>
                <span className="analytics-row-bar"><span className="analytics-row-fill" style={{width: "14%", background: "var(--blue-bright)"}} /></span>
                <span className="analytics-row-val">75</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      
      <div className="action-bar">
        <div className="action-bar-left">
          <span className="save-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Draft saved 4 sec ago
          </span>
          <span>Publishing to <strong id="ab-channel-count">5 channels</strong> · <strong>Now</strong></span>
        </div>
        <div className="action-bar-right">
          <button className="btn btn-ghost">Save draft</button>
          <div className="schedule-wrap">
            <button className="btn btn-ghost" id="sched-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span id="sched-label">Schedule: Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="schedule-menu" id="sched-menu">
              <button className="schedule-option on" data-val="Now"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg><span className="schedule-option-label">Now<div className="schedule-option-sub">Live in ~10 min</div></span></button>
              <button className="schedule-option" data-val="In 1 hour"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 2" /></svg><span className="schedule-option-label">In 1 hour<div className="schedule-option-sub">Tue, 3:14 PM CT</div></span></button>
              <button className="schedule-option" data-val="Tomorrow 9am"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg><span className="schedule-option-label">Tomorrow 9:00 AM<div className="schedule-option-sub">Best time for leads</div></span></button>
              <button className="schedule-option" data-val="Custom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M12 14l2 2 4-4" /></svg><span className="schedule-option-label">Custom…<div className="schedule-option-sub">Pick a date & time</div></span></button>
            </div>
          </div>
          <button className="btn btn-pink btn-lg" id="push-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
            <span id="push-btn-label">Push to 5 channels</span>
          </button>
        </div>
      </div>

      
      <div className="push-overlay" id="push-overlay">
        <div className="push-modal">
          <button className="push-modal-close" id="push-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <div className="push-headline-icon" id="push-headline-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
          </div>
          <div className="push-modal-title" id="push-modal-title">Broadcasting to channels…</div>
          <div className="push-modal-sub" id="push-modal-sub">Don't close this window. You'll see each channel turn green as it goes live.</div>

          <div className="push-channels-list" id="push-channels-list" />

          <div className="push-success-summary" id="push-summary">
            <h4 id="push-summary-h">All 5 channels live</h4>
            <p><strong id="push-summary-reach">1,240</strong> estimated impressions per week · First lead typically arrives in 3-6 hours.</p>
          </div>

          <div className="push-modal-actions">
            <button className="btn btn-ghost" id="push-analytics-btn" style={{display: "none"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
              See analytics
            </button>
            <button className="btn btn-primary" id="push-view-btn" style={{display: "none"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></svg>
              View listing on Tenantory
            </button>
          </div>
        </div>
      </div>

    </main>

  </div>

  


    </>
  );
}
