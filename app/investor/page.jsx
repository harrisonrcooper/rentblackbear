"use client";

// Mock ported from ~/Desktop/blackbear/investor.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface-alt);\n      line-height: 1.5; font-size: 14px; min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    .serif { font-family: 'Fraunces', 'Inter', serif; letter-spacing: -0.015em; }\n\n    /* ===== Workspace brand tokens — Ridgeline Capital ===== */\n    :root {\n      --brand: #1a2744;\n      --brand-dark: #121c34;\n      --brand-darker: #0a1226;\n      --brand-soft: #e9ecf3;\n      --brand-pale: #f3f5fa;\n      --accent: #8a2432;\n      --accent-dark: #6e1b27;\n      --accent-bright: #a32d3d;\n      --accent-bg: rgba(138,36,50,0.1);\n      --accent-soft: rgba(138,36,50,0.06);\n      --gold: #b28a3b;\n      --gold-bg: rgba(178,138,59,0.12);\n\n      --text: #1c2233;\n      --text-muted: #5a6278;\n      --text-faint: #8f94a6;\n      --surface: #ffffff;\n      --surface-alt: #faf7f0;\n      --surface-subtle: #f5f1e6;\n      --border: #e6e0d0;\n      --border-strong: #cdc4ab;\n\n      --green: #2a7a5a;\n      --green-dark: #1b5a42;\n      --green-bg: rgba(42,122,90,0.12);\n      --red: #a33232;\n      --red-bg: rgba(163,50,50,0.1);\n\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,39,68,0.05);\n      --shadow: 0 4px 18px rgba(26,39,68,0.08);\n      --shadow-lg: 0 18px 50px rgba(26,39,68,0.16);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 36px; height: 76px;\n      display: flex; align-items: center; justify-content: space-between;\n      border-bottom: 3px solid var(--accent);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 14px; }\n    .tb-mark {\n      width: 44px; height: 44px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; box-shadow: 0 4px 14px rgba(138,36,50,0.35);\n      position: relative; overflow: hidden;\n    }\n    .tb-mark::before {\n      content: \"\"; position: absolute; inset: 0;\n      background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);\n    }\n    .tb-mark svg { width: 22px; height: 22px; position: relative; z-index: 1; }\n    .tb-brand-text { display: flex; flex-direction: column; }\n    .tb-brand-name { font-family: 'Fraunces', serif; font-weight: 800; font-size: 20px; color: #fff; letter-spacing: -0.02em; line-height: 1; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 3px; }\n\n    .tb-nav { display: flex; gap: 2px; }\n    .tb-nav-item {\n      padding: 10px 18px; border-radius: 100px;\n      color: rgba(255,255,255,0.65); font-weight: 600; font-size: 13px;\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }\n    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.12); }\n\n    .tb-right { display: flex; align-items: center; gap: 14px; }\n    .tb-period {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 8px 14px; border-radius: 100px;\n      background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85);\n      font-size: 12px; font-weight: 600;\n    }\n    .tb-period svg { width: 12px; height: 12px; }\n    .tb-period-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(138,36,50,0.25); }\n\n    .tb-avatar {\n      display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 14px;\n      border-radius: 100px; background: rgba(255,255,255,0.06);\n    }\n    .tb-avatar-text { display: flex; flex-direction: column; align-items: flex-end; }\n    .tb-avatar-name { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.1; }\n    .tb-avatar-role { font-size: 10px; color: rgba(255,255,255,0.55); font-weight: 500; letter-spacing: 0.06em; margin-top: 1px; }\n    .tb-avatar-img {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--gold), var(--accent));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 13px; letter-spacing: 0.02em;\n      box-shadow: 0 2px 8px rgba(0,0,0,0.25);\n    }\n\n    /* ===== Layout ===== */\n    .wrap { max-width: 1200px; margin: 0 auto; padding: 36px 36px 64px; }\n\n    .section-lead { margin-bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; }\n    .section-lead-text { flex: 1; min-width: 260px; }\n    .section-kicker {\n      font-size: 11px; font-weight: 700; color: var(--accent);\n      letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 8px;\n    }\n    .section-lead h2 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }\n    .section-lead-sub { font-size: 14px; color: var(--text-muted); margin-top: 6px; }\n    .section-lead-aside { font-size: 12px; color: var(--text-muted); }\n\n    /* ===== Hero card ===== */\n    .hero {\n      background: linear-gradient(130deg, var(--brand) 0%, var(--brand-darker) 70%, #1b0e1c 100%);\n      color: #fff; border-radius: var(--radius-xl);\n      padding: 44px 48px; margin-bottom: 28px;\n      position: relative; overflow: hidden;\n      box-shadow: 0 24px 60px rgba(10,18,38,0.28);\n    }\n    .hero::before {\n      content: \"\"; position: absolute; top: -40%; right: -10%;\n      width: 540px; height: 540px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(138,36,50,0.35), transparent 65%);\n    }\n    .hero::after {\n      content: \"\"; position: absolute; bottom: -60%; left: -15%;\n      width: 500px; height: 500px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(178,138,59,0.18), transparent 65%);\n    }\n    .hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 8px;\n      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);\n      color: rgba(255,255,255,0.9); padding: 5px 14px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;\n      margin-bottom: 20px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; color: var(--gold); }\n    .hero-label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; }\n    .hero-value { font-family: 'Fraunces', serif; font-size: clamp(44px, 6vw, 68px); font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #fff; }\n    .hero-value small { font-size: 0.48em; color: rgba(255,255,255,0.6); font-weight: 600; margin-left: 10px; letter-spacing: 0; font-family: 'Inter', sans-serif; }\n    .hero-delta { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 6px 12px; border-radius: 100px; background: rgba(42,122,90,0.18); color: #7fd3a8; font-size: 13px; font-weight: 700; }\n    .hero-delta svg { width: 12px; height: 12px; }\n    .hero-sub { font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 16px; max-width: 420px; line-height: 1.55; }\n\n    .hero-aside { display: flex; flex-direction: column; gap: 14px; }\n    .hero-card {\n      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);\n      border-radius: var(--radius-lg); padding: 18px 22px;\n      backdrop-filter: blur(4px);\n    }\n    .hero-card-label { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }\n    .hero-card-val { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; color: #fff; margin-top: 6px; letter-spacing: -0.02em; }\n    .hero-card-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.6); }\n    .hero-card-row strong { color: #fff; font-weight: 600; }\n    .ownership-bar { height: 6px; border-radius: 100px; background: rgba(255,255,255,0.1); overflow: hidden; margin-top: 12px; }\n    .ownership-bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--accent-bright)); border-radius: 100px; }\n\n    /* ===== Stats strip ===== */\n    .stats {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n      margin-bottom: 32px;\n    }\n    .stat {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 22px;\n      display: flex; flex-direction: column; gap: 4px;\n      position: relative; overflow: hidden;\n    }\n    .stat::before {\n      content: \"\"; position: absolute; top: 0; left: 0; width: 3px; height: 100%;\n      background: var(--accent); opacity: 0.6;\n    }\n    .stat-label {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em;\n      display: flex; align-items: center; gap: 6px;\n    }\n    .stat-label svg { width: 12px; height: 12px; color: var(--accent); }\n    .stat-value {\n      font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700;\n      letter-spacing: -0.025em; color: var(--text); margin-top: 6px;\n    }\n    .stat-value small { font-size: 0.55em; color: var(--text-muted); font-weight: 500; margin-left: 4px; font-family: 'Inter'; }\n    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; }\n    .stat-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 700; }\n    .stat-chip.up { background: var(--green-bg); color: var(--green-dark); }\n    .stat-chip.down { background: var(--red-bg); color: var(--red); }\n    .stat-chip svg { width: 10px; height: 10px; }\n\n    /* ===== Performance chart ===== */\n    .performance {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px 30px;\n      margin-bottom: 32px; box-shadow: var(--shadow-sm);\n    }\n    .perf-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }\n    .perf-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; letter-spacing: -0.015em; color: var(--text); }\n    .perf-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }\n\n    .perf-legend { display: flex; gap: 18px; flex-wrap: wrap; }\n    .perf-legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); font-weight: 500; }\n    .perf-legend-swatch { width: 10px; height: 10px; border-radius: 3px; }\n    .perf-legend-swatch.noi { background: var(--brand); }\n    .perf-legend-swatch.dist { background: var(--accent); }\n    .perf-legend-swatch.occ { background: var(--gold); }\n\n    .perf-chart {\n      height: 260px; position: relative;\n      background: linear-gradient(180deg, var(--surface-subtle) 0%, var(--surface) 100%);\n      border-radius: var(--radius-lg); border: 1px solid var(--border);\n      padding: 20px;\n    }\n    .perf-chart svg { width: 100%; height: 100%; }\n    .perf-axis { font-size: 10px; fill: var(--text-faint); font-family: 'Inter'; font-weight: 600; letter-spacing: 0.04em; }\n    .perf-grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 3,4; }\n\n    .perf-months { display: grid; grid-template-columns: repeat(12, 1fr); margin-top: 10px; font-size: 10px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.04em; text-align: center; text-transform: uppercase; }\n\n    .perf-summary {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n      margin-top: 22px; padding-top: 22px; border-top: 1px solid var(--border);\n    }\n    .perf-sum-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }\n    .perf-sum-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.02em; }\n    .perf-sum-delta { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 2px; }\n    .perf-sum-delta.down { color: var(--red); }\n\n    /* ===== Two-column: distributions + messages ===== */\n    .grid-two {\n      display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;\n      margin-bottom: 32px;\n    }\n\n    /* Distributions table */\n    .card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);\n      overflow: hidden;\n    }\n    .card-head {\n      padding: 22px 28px 16px;\n      display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;\n      border-bottom: 1px solid var(--border);\n    }\n    .card-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; letter-spacing: -0.015em; color: var(--text); }\n    .card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .card-action { font-size: 12px; color: var(--accent); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }\n    .card-action svg { width: 12px; height: 12px; }\n    .card-action:hover { color: var(--accent-dark); }\n\n    .dist-table { width: 100%; border-collapse: collapse; font-size: 13px; }\n    .dist-table thead th {\n      padding: 12px 28px; text-align: left;\n      font-size: 10px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .dist-table thead th:last-child { text-align: right; }\n    .dist-table tbody td { padding: 14px 28px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }\n    .dist-table tbody td:last-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; font-family: 'Fraunces', serif; font-size: 15px; }\n    .dist-table tbody tr:last-child td { border-bottom: none; }\n    .dist-date-pri { font-weight: 600; color: var(--text); }\n    .dist-date-sec { font-size: 11px; color: var(--text-muted); margin-top: 1px; }\n    .dist-source { font-size: 12px; color: var(--text-muted); }\n\n    .status-chip {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.02em;\n    }\n    .status-chip svg { width: 10px; height: 10px; }\n    .status-chip.paid { background: var(--green-bg); color: var(--green-dark); }\n    .status-chip.pending { background: var(--gold-bg); color: var(--gold); }\n    .status-chip.scheduled { background: var(--brand-soft); color: var(--brand); }\n\n    .dist-total-row td {\n      background: var(--surface-subtle);\n      font-weight: 700; color: var(--text);\n      font-size: 13px;\n    }\n\n    /* Messages */\n    .msg-list { padding: 14px; display: flex; flex-direction: column; gap: 10px; }\n    .msg {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px 18px;\n      position: relative; transition: all 0.15s ease;\n    }\n    .msg.unread { background: var(--surface); border-color: var(--accent); }\n    .msg.unread::before {\n      content: \"\"; position: absolute; top: 18px; right: 16px;\n      width: 7px; height: 7px; border-radius: 50%;\n      background: var(--accent); box-shadow: 0 0 0 3px rgba(138,36,50,0.16);\n    }\n    .msg-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }\n    .msg-avatar {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand), var(--accent));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 11px;\n    }\n    .msg-meta { flex: 1; }\n    .msg-from { font-size: 12px; font-weight: 700; color: var(--text); }\n    .msg-time { font-size: 11px; color: var(--text-muted); }\n    .msg-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.005em; }\n    .msg-body { font-size: 12.5px; color: var(--text-muted); line-height: 1.55; }\n    .msg-body strong { color: var(--text); font-weight: 600; }\n\n    /* ===== Properties breakdown ===== */\n    .props-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;\n      margin-bottom: 32px;\n    }\n    .prop-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n      display: flex; flex-direction: column;\n      transition: all 0.15s ease;\n    }\n    .prop-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--border-strong); }\n    .prop-hero {\n      height: 120px; position: relative; overflow: hidden;\n      background: linear-gradient(135deg, var(--brand) 0%, var(--brand-darker) 100%);\n    }\n    .prop-hero.hero-b { background: linear-gradient(135deg, #3a2838 0%, var(--accent-dark) 100%); }\n    .prop-hero.hero-c { background: linear-gradient(135deg, #1f3328 0%, #0d1a14 100%); }\n    .prop-hero.hero-d { background: linear-gradient(135deg, #2a2c3f 0%, #403224 100%); }\n    .prop-hero::after {\n      content: \"\"; position: absolute; inset: 0;\n      background:\n        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 40%),\n        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 40%);\n    }\n    .prop-hero-label {\n      position: absolute; top: 14px; left: 16px; z-index: 1;\n      font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.85);\n      letter-spacing: 0.14em; text-transform: uppercase;\n      background: rgba(0,0,0,0.25); backdrop-filter: blur(4px);\n      padding: 4px 10px; border-radius: 100px;\n    }\n    .prop-hero-glyph {\n      position: absolute; bottom: -20px; right: -20px; z-index: 0;\n      width: 140px; height: 140px; color: rgba(255,255,255,0.12);\n    }\n    .prop-body { padding: 20px 22px; flex: 1; display: flex; flex-direction: column; }\n    .prop-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--text); letter-spacing: -0.015em; }\n    .prop-addr { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n    .prop-stats {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;\n      margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);\n    }\n    .prop-stat-label { font-size: 10px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }\n    .prop-stat-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.02em; }\n    .prop-stat-val.accent { color: var(--accent); }\n    .prop-stat-val.green { color: var(--green-dark); }\n\n    .prop-occ-bar { height: 5px; background: var(--surface-subtle); border-radius: 100px; margin-top: 10px; overflow: hidden; }\n    .prop-occ-fill { height: 100%; background: linear-gradient(90deg, var(--brand), var(--accent)); border-radius: 100px; }\n\n    .prop-row {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 10px 0; border-bottom: 1px solid var(--border);\n      font-size: 12px;\n    }\n    .prop-row:last-child { border-bottom: none; }\n    .prop-row-label { color: var(--text-muted); font-weight: 500; }\n    .prop-row-val { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }\n\n    /* ===== Documents ===== */\n    .docs-card { margin-bottom: 32px; }\n    .docs-filter {\n      display: flex; gap: 6px; padding: 0 28px 16px; border-bottom: 1px solid var(--border);\n    }\n    .docs-tab {\n      padding: 8px 14px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .docs-tab:hover { color: var(--text); background: var(--surface-subtle); }\n    .docs-tab.active { background: var(--brand); color: #fff; }\n\n    .docs-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;\n      padding: 22px 28px 28px;\n    }\n    .doc-item {\n      display: flex; align-items: center; gap: 14px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n      transition: all 0.15s ease; position: relative;\n    }\n    .doc-item:hover { background: var(--surface); border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow-sm); }\n    .doc-icon {\n      width: 40px; height: 48px; border-radius: 6px;\n      background: #fff; border: 1px solid var(--border);\n      display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;\n      font-size: 9px; font-weight: 800; color: var(--accent); letter-spacing: 0.04em;\n      position: relative; flex-shrink: 0;\n      box-shadow: 0 1px 3px rgba(0,0,0,0.06);\n    }\n    .doc-icon::before {\n      content: \"\"; position: absolute; top: 0; right: 0;\n      width: 12px; height: 12px; background: var(--border);\n      clip-path: polygon(0 0, 100% 100%, 0 100%);\n    }\n    .doc-icon.tax { color: #0a7043; }\n    .doc-icon.legal { color: var(--brand); }\n    .doc-icon.audit { color: var(--gold); }\n    .doc-info { flex: 1; min-width: 0; }\n    .doc-name { font-size: 13.5px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.3; }\n    .doc-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }\n    .doc-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }\n    .doc-dl {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: var(--surface); border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center;\n      color: var(--text-muted); flex-shrink: 0;\n      transition: all 0.15s ease;\n    }\n    .doc-item:hover .doc-dl { background: var(--accent); color: #fff; border-color: var(--accent); }\n    .doc-dl svg { width: 14px; height: 14px; }\n    .doc-item.new::after {\n      content: \"New\"; position: absolute; top: -6px; right: 12px;\n      background: var(--accent); color: #fff;\n      font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;\n      padding: 2px 7px; border-radius: 100px;\n    }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 24px auto 0; padding: 28px 36px;\n      display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;\n      border-top: 1px solid var(--border);\n      font-size: 12px; color: var(--text-muted);\n    }\n    .foot-left { display: flex; flex-direction: column; gap: 4px; }\n    .foot-legal { font-size: 11px; color: var(--text-faint); max-width: 580px; }\n    .foot-powered {\n      display: inline-flex; align-items: center; gap: 8px;\n      font-size: 11px; color: var(--text-muted); font-weight: 500;\n    }\n    .foot-powered-mark {\n      width: 18px; height: 18px; border-radius: 5px;\n      background: linear-gradient(135deg, #1665D8, #FF4998);\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .foot-powered-mark svg { width: 10px; height: 10px; }\n    .foot-powered strong { color: var(--text); font-weight: 700; }\n\n    @media (max-width: 1000px) {\n      .hero-grid { grid-template-columns: 1fr; gap: 28px; }\n      .stats { grid-template-columns: repeat(2, 1fr); }\n      .grid-two { grid-template-columns: 1fr; }\n      .props-grid { grid-template-columns: 1fr; }\n      .docs-grid { grid-template-columns: repeat(2, 1fr); }\n      .perf-summary { grid-template-columns: repeat(2, 1fr); }\n    }\n    @media (max-width: 680px) {\n      .topbar { padding: 0 16px; height: 64px; }\n      .tb-nav, .tb-period { display: none; }\n      .tb-avatar-text { display: none; }\n      .wrap { padding: 24px 16px 48px; }\n      .hero { padding: 28px 24px; }\n      .docs-grid { grid-template-columns: 1fr; }\n      .stats { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20 8 11 12 15 16 7 21 20" />
          <path d="M3 20h18" />
        </svg>
      </div>
      <div className="tb-brand-text">
        <span className="tb-brand-name">Ridgeline Capital</span>
        <span className="tb-brand-sub">Investor Portal · Fund I</span>
      </div>
    </div>

    <nav className="tb-nav">
      <a className="tb-nav-item active" href="#">Overview</a>
      <a className="tb-nav-item" href="#distributions">Distributions</a>
      <a className="tb-nav-item" href="#properties">Properties</a>
      <a className="tb-nav-item" href="#documents">Documents</a>
      <a className="tb-nav-item" href="#messages">Messages</a>
    </nav>

    <div className="tb-right">
      <div className="tb-period">
        <span className="tb-period-dot" />
        <span>Q1 2026 · As of Apr 14</span>
      </div>
      <div className="tb-avatar">
        <div className="tb-avatar-text">
          <div className="tb-avatar-name">Clara Weiss</div>
          <div className="tb-avatar-role">LP since 2024</div>
        </div>
        <div className="tb-avatar-img">CW</div>
      </div>
    </div>
  </header>

  <div className="wrap">

    
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="hero-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Your position in Ridgeline Fund I
          </div>
          <div className="hero-label">Portfolio value</div>
          <div className="hero-value">$487,320<small>.44</small></div>
          <div className="hero-delta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 6 23 6 23 12" /><path d="M1 18l9-9 4 4 8-8" /></svg>
            +$6,140 this month · +1.28%
          </div>
          <p className="hero-sub">Your share of the fund's equity value, marked to current net asset value. Recalculated monthly from property-level income, expenses, and independent valuations.</p>
        </div>

        <div className="hero-aside">
          <div className="hero-card">
            <div className="hero-card-label">Your ownership</div>
            <div className="hero-card-val">6.42%</div>
            <div className="ownership-bar"><div className="ownership-bar-fill" style={{width: "6.42%"}} /></div>
            <div className="hero-card-row"><span>Your commitment</span><strong>$450,000</strong></div>
            <div className="hero-card-row"><span>Fund total equity</span><strong>$7.59M</strong></div>
          </div>
          <div className="hero-card">
            <div className="hero-card-label">Total return since entry</div>
            <div className="hero-card-val">+$37,320 <small style={{fontSize: "14px", color: "#7fd3a8", fontWeight: "600", marginLeft: "4px"}}>+8.29%</small></div>
            <div className="hero-card-row"><span>Entry date</span><strong>May 12, 2024</strong></div>
            <div className="hero-card-row"><span>IRR (annualized)</span><strong style={{color: "#7fd3a8"}}>14.7%</strong></div>
          </div>
        </div>
      </div>
    </section>

    
    <section className="stats">
      <div className="stat">
        <div className="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-6 9 6v12H3z" /><path d="M9 21v-6h6v6" /></svg>
          Units across fund
        </div>
        <div className="stat-value">142<small>doors</small></div>
        <div className="stat-sub">
          <span className="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>+12</span>
          <span>vs. end of 2025</span>
        </div>
      </div>

      <div className="stat">
        <div className="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          Occupancy rate
        </div>
        <div className="stat-value">94.3<small style={{fontSize: "0.55em"}}>%</small></div>
        <div className="stat-sub">
          <span className="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>+2.1pt</span>
          <span>vs. last quarter</span>
        </div>
      </div>

      <div className="stat">
        <div className="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          YTD distributions to you
        </div>
        <div className="stat-value">$13,441</div>
        <div className="stat-sub">
          <span className="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>+18%</span>
          <span>vs. YTD 2025 · 3 payments</span>
        </div>
      </div>

      <div className="stat">
        <div className="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
          Fund NOI (YTD)
        </div>
        <div className="stat-value">$412K</div>
        <div className="stat-sub">
          <span className="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>+9.4%</span>
          <span>vs. same period 2025</span>
        </div>
      </div>
    </section>

    
    <section className="performance">
      <div className="perf-head">
        <div>
          <div className="perf-title">Fund performance · trailing 12 months</div>
          <div className="perf-sub">Monthly NOI, distributions to LPs, and occupancy — indexed against your share of the fund.</div>
        </div>
        <div className="perf-legend">
          <div className="perf-legend-item"><span className="perf-legend-swatch noi" />Fund NOI</div>
          <div className="perf-legend-item"><span className="perf-legend-swatch dist" />LP distributions</div>
          <div className="perf-legend-item"><span className="perf-legend-swatch occ" />Occupancy %</div>
        </div>
      </div>

      <div className="perf-chart">
        <svg viewBox="0 0 720 220" preserveAspectRatio="none">
          <defs>
            <lineargradient id="noiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{stopColor: "var(--brand)", stopOpacity: "0.28"}} />
              <stop offset="100%" style={{stopColor: "var(--brand)", stopOpacity: "0"}} />
            </lineargradient>
            <lineargradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{stopColor: "var(--accent)", stopOpacity: "0.22"}} />
              <stop offset="100%" style={{stopColor: "var(--accent)", stopOpacity: "0"}} />
            </lineargradient>
          </defs>

          
          <line className="perf-grid-line" x1="40" y1="40" x2="700" y2="40" />
          <line className="perf-grid-line" x1="40" y1="90" x2="700" y2="90" />
          <line className="perf-grid-line" x1="40" y1="140" x2="700" y2="140" />
          <line className="perf-grid-line" x1="40" y1="190" x2="700" y2="190" />

          
          <text className="perf-axis" x="32" y="44" textAnchor="end">$55K</text>
          <text className="perf-axis" x="32" y="94" textAnchor="end">$45K</text>
          <text className="perf-axis" x="32" y="144" textAnchor="end">$35K</text>
          <text className="perf-axis" x="32" y="194" textAnchor="end">$25K</text>

          
          <text className="perf-axis" x="708" y="44" textAnchor="start" fill="var(--gold)">98%</text>
          <text className="perf-axis" x="708" y="94" textAnchor="start" fill="var(--gold)">94%</text>
          <text className="perf-axis" x="708" y="144" textAnchor="start" fill="var(--gold)">90%</text>
          <text className="perf-axis" x="708" y="194" textAnchor="start" fill="var(--gold)">86%</text>

          
          <path d="M40 140 L95 135 L150 128 L205 118 L260 108 L315 102 L370 95 L425 90 L480 82 L535 70 L590 62 L645 55 L700 48 L700 200 L40 200 Z" fill="url(#noiGrad)" />
          
          <path d="M40 140 L95 135 L150 128 L205 118 L260 108 L315 102 L370 95 L425 90 L480 82 L535 70 L590 62 L645 55 L700 48" style={{stroke: "var(--brand)"}} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          
          <circle cx="40" cy="140" r="3" fill="var(--brand)" />
          <circle cx="150" cy="128" r="3" fill="var(--brand)" />
          <circle cx="260" cy="108" r="3" fill="var(--brand)" />
          <circle cx="370" cy="95" r="3" fill="var(--brand)" />
          <circle cx="480" cy="82" r="3" fill="var(--brand)" />
          <circle cx="590" cy="62" r="3" fill="var(--brand)" />
          <circle cx="700" cy="48" r="4" fill="var(--brand)" stroke="#fff" strokeWidth="2" />

          
          <g>
            <rect x="48" y="172" width="14" height="28" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="103" y="168" width="14" height="32" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="158" y="164" width="14" height="36" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="213" y="160" width="14" height="40" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="268" y="156" width="14" height="44" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="323" y="152" width="14" height="48" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="378" y="150" width="14" height="50" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="433" y="146" width="14" height="54" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="488" y="140" width="14" height="60" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="543" y="132" width="14" height="68" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="598" y="128" width="14" height="72" rx="2" fill="var(--accent)" opacity="0.8" />
            <rect x="653" y="120" width="14" height="80" rx="2" fill="var(--accent)" />
          </g>

          
          <path d="M40 110 L95 106 L150 100 L205 96 L260 94 L315 92 L370 88 L425 86 L480 82 L535 80 L590 76 L645 72 L700 68" style={{stroke: "var(--gold)"}} strokeWidth="1.8" strokeDasharray="4,4" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="perf-months">
        <div>May</div><div>Jun</div><div>Jul</div><div>Aug</div><div>Sep</div><div>Oct</div>
        <div>Nov</div><div>Dec</div><div>Jan</div><div>Feb</div><div>Mar</div><div>Apr</div>
      </div>

      <div className="perf-summary">
        <div>
          <div className="perf-sum-label">Avg monthly NOI</div>
          <div className="perf-sum-val">$43,900</div>
          <div className="perf-sum-delta">+$3,800 vs prior 12mo</div>
        </div>
        <div>
          <div className="perf-sum-label">Total LP distributions</div>
          <div className="perf-sum-val">$198,400</div>
          <div className="perf-sum-delta">+22.1% YoY</div>
        </div>
        <div>
          <div className="perf-sum-label">Avg occupancy</div>
          <div className="perf-sum-val">93.1%</div>
          <div className="perf-sum-delta">+1.9 pts YoY</div>
        </div>
        <div>
          <div className="perf-sum-label">Your share (TTM)</div>
          <div className="perf-sum-val">$12,740</div>
          <div className="perf-sum-delta">Pre-tax cash-on-cash 7.8%</div>
        </div>
      </div>
    </section>

    
    <div className="grid-two" id="distributions">

      <section className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Your distributions · last 6 months</div>
            <div className="card-sub">Deposits to account ending ···4812 · Chase Business Checking</div>
          </div>
          <a className="card-action" href="#">
            Full history
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
        </div>

        <table className="dist-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="dist-date-pri">May 01, 2026</div>
                <div className="dist-date-sec">Q2 · scheduled</div>
              </td>
              <td><div className="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span className="status-chip scheduled">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Scheduled
                </span>
              </td>
              <td>$4,740</td>
            </tr>
            <tr>
              <td>
                <div className="dist-date-pri">Apr 03, 2026</div>
                <div className="dist-date-sec">ACH · in transit</div>
              </td>
              <td><div className="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span className="status-chip pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9" /><polyline points="21 4 21 10 15 10" /></svg>
                  Pending
                </span>
              </td>
              <td>$4,612</td>
            </tr>
            <tr>
              <td>
                <div className="dist-date-pri">Mar 03, 2026</div>
                <div className="dist-date-sec">ACH ref #DV-228891</div>
              </td>
              <td><div className="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span className="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Paid
                </span>
              </td>
              <td>$4,489</td>
            </tr>
            <tr>
              <td>
                <div className="dist-date-pri">Feb 03, 2026</div>
                <div className="dist-date-sec">ACH ref #DV-221104</div>
              </td>
              <td><div className="dist-source">Operating + capital event<br /><small style={{color: "var(--accent)", fontWeight: "700"}}>Includes $1,050 refi cash-out</small></div></td>
              <td>
                <span className="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Paid
                </span>
              </td>
              <td>$5,340</td>
            </tr>
            <tr>
              <td>
                <div className="dist-date-pri">Jan 03, 2026</div>
                <div className="dist-date-sec">ACH ref #DV-215502</div>
              </td>
              <td><div className="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span className="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Paid
                </span>
              </td>
              <td>$3,612</td>
            </tr>
            <tr>
              <td>
                <div className="dist-date-pri">Dec 03, 2025</div>
                <div className="dist-date-sec">ACH ref #DV-208341</div>
              </td>
              <td><div className="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span className="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Paid
                </span>
              </td>
              <td>$3,488</td>
            </tr>
            <tr className="dist-total-row">
              <td colSpan="2">Total distributed to you · trailing 6 months</td>
              <td />
              <td>$26,281</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card" id="messages">
        <div className="card-head">
          <div>
            <div className="card-title">From the operator</div>
            <div className="card-sub">Messages from Ridgeline's managing partner</div>
          </div>
        </div>
        <div className="msg-list">

          <div className="msg unread">
            <div className="msg-head">
              <div className="msg-avatar">HC</div>
              <div className="msg-meta">
                <div className="msg-from">Harrison Cooper · Managing Partner</div>
                <div className="msg-time">2 days ago · Apr 12</div>
              </div>
            </div>
            <div className="msg-title">Q1 distribution increased 5.7% vs Q4</div>
            <div className="msg-body">Stronger-than-expected occupancy at <strong>Oak Ridge (97%)</strong> and the refi closeout on Madison St. drove Q1 distributions $1,050 above the proforma. May payment is already on the rails for the 1st.</div>
          </div>

          <div className="msg unread">
            <div className="msg-head">
              <div className="msg-avatar">HC</div>
              <div className="msg-meta">
                <div className="msg-from">Harrison Cooper · Managing Partner</div>
                <div className="msg-time">1 week ago · Apr 7</div>
              </div>
            </div>
            <div className="msg-title">Q1 investor letter is ready</div>
            <div className="msg-body">Seven-page Q1 letter covering NOI, occupancy, the Madison refi, and the Greenbrier acquisition LOI is in your <strong>Documents</strong> tab. TL;DR: we're tracking 11% ahead of the 2026 pro-forma.</div>
          </div>

          <div className="msg">
            <div className="msg-head">
              <div className="msg-avatar">HC</div>
              <div className="msg-meta">
                <div className="msg-from">Harrison Cooper · Managing Partner</div>
                <div className="msg-time">Mar 18</div>
              </div>
            </div>
            <div className="msg-title">K-1s for tax year 2025 issued</div>
            <div className="msg-body">Your 2025 K-1 is posted in Documents. CPA contact for passthrough questions is Marla at Kepler &amp; Co. — her memo is attached alongside.</div>
          </div>

          <div className="msg">
            <div className="msg-head">
              <div className="msg-avatar">HC</div>
              <div className="msg-meta">
                <div className="msg-from">Harrison Cooper · Managing Partner</div>
                <div className="msg-time">Feb 11</div>
              </div>
            </div>
            <div className="msg-title">Madison St. refi closed — cash-out to LPs</div>
            <div className="msg-body">We closed the rate-and-term on Madison St. at <strong>6.1% fixed, 30-year</strong>. $78K of equity came out to the fund; your share ($1,050) was included in the Feb 3 distribution.</div>
          </div>

        </div>
      </section>
    </div>

    
    <section className="section-lead" id="properties">
      <div className="section-lead-text">
        <div className="section-kicker">Property-by-property</div>
        <h2>The assets behind your position</h2>
        <div className="section-lead-sub">Ridgeline Fund I is currently deployed across four income-producing properties in Alabama and Tennessee.</div>
      </div>
      <div className="section-lead-aside">Q1 2026 · all figures pre-tax</div>
    </section>

    <div className="props-grid">

      <div className="prop-card">
        <div className="prop-hero">
          <div className="prop-hero-label">Multi-family · 48 units</div>
          <svg className="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="14" /><path d="M6 8V4M10 8V4M14 8V4M18 8V4" /><path d="M6 12h2M10 12h2M14 12h2M18 12h2M6 16h2M10 16h2M14 16h2M18 16h2" /></svg>
        </div>
        <div className="prop-body">
          <div className="prop-name">Oak Ridge Apartments</div>
          <div className="prop-addr">421 Oak Ridge Pkwy · Huntsville, AL</div>
          <div className="prop-stats">
            <div>
              <div className="prop-stat-label">Q1 NOI contrib.</div>
              <div className="prop-stat-val accent">$142K</div>
            </div>
            <div>
              <div className="prop-stat-label">Occupancy</div>
              <div className="prop-stat-val green">97%</div>
            </div>
            <div>
              <div className="prop-stat-label">Maint. spend</div>
              <div className="prop-stat-val">$8.4K</div>
            </div>
          </div>
          <div className="prop-occ-bar"><div className="prop-occ-fill" style={{width: "97%"}} /></div>
          <div style={{marginTop: "16px"}}>
            <div className="prop-row"><span className="prop-row-label">Valuation</span><span className="prop-row-val">$4.82M</span></div>
            <div className="prop-row"><span className="prop-row-label">Debt</span><span className="prop-row-val">$3.14M @ 5.8%</span></div>
            <div className="prop-row"><span className="prop-row-label">Your share of cashflow</span><span className="prop-row-val" style={{color: "var(--accent)"}}>$9,116/yr</span></div>
          </div>
        </div>
      </div>

      <div className="prop-card">
        <div className="prop-hero hero-b">
          <div className="prop-hero-label">Mixed-use · 22 units + retail</div>
          <svg className="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-8h6v8" /><path d="M3 15h4M17 15h4" /></svg>
        </div>
        <div className="prop-body">
          <div className="prop-name">Madison Street Lofts</div>
          <div className="prop-addr">812 Madison St NE · Huntsville, AL</div>
          <div className="prop-stats">
            <div>
              <div className="prop-stat-label">Q1 NOI contrib.</div>
              <div className="prop-stat-val accent">$98K</div>
            </div>
            <div>
              <div className="prop-stat-label">Occupancy</div>
              <div className="prop-stat-val green">95%</div>
            </div>
            <div>
              <div className="prop-stat-label">Maint. spend</div>
              <div className="prop-stat-val">$6.1K</div>
            </div>
          </div>
          <div className="prop-occ-bar"><div className="prop-occ-fill" style={{width: "95%"}} /></div>
          <div style={{marginTop: "16px"}}>
            <div className="prop-row"><span className="prop-row-label">Valuation</span><span className="prop-row-val">$3.44M</span></div>
            <div className="prop-row"><span className="prop-row-label">Debt</span><span className="prop-row-val">$2.10M @ 6.1% <small style={{color: "var(--green-dark)", fontWeight: "700"}}>new</small></span></div>
            <div className="prop-row"><span className="prop-row-label">Your share of cashflow</span><span className="prop-row-val" style={{color: "var(--accent)"}}>$6,288/yr</span></div>
          </div>
        </div>
      </div>

      <div className="prop-card">
        <div className="prop-hero hero-c">
          <div className="prop-hero-label">Co-living · 5 houses · 32 bedrooms</div>
          <svg className="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M4 22V9l5-4 5 4v13" /><path d="M14 22V13l5-4 3 2.4V22" /></svg>
        </div>
        <div className="prop-body">
          <div className="prop-name">Bridge House Collective</div>
          <div className="prop-addr">1204 Greenwood Ave · Nashville, TN</div>
          <div className="prop-stats">
            <div>
              <div className="prop-stat-label">Q1 NOI contrib.</div>
              <div className="prop-stat-val accent">$116K</div>
            </div>
            <div>
              <div className="prop-stat-label">Occupancy</div>
              <div className="prop-stat-val green">96%</div>
            </div>
            <div>
              <div className="prop-stat-label">Maint. spend</div>
              <div className="prop-stat-val">$11.2K</div>
            </div>
          </div>
          <div className="prop-occ-bar"><div className="prop-occ-fill" style={{width: "96%"}} /></div>
          <div style={{marginTop: "16px"}}>
            <div className="prop-row"><span className="prop-row-label">Valuation</span><span className="prop-row-val">$2.98M</span></div>
            <div className="prop-row"><span className="prop-row-label">Debt</span><span className="prop-row-val">$1.82M @ 5.6%</span></div>
            <div className="prop-row"><span className="prop-row-label">Your share of cashflow</span><span className="prop-row-val" style={{color: "var(--accent)"}}>$7,448/yr</span></div>
          </div>
        </div>
      </div>

      <div className="prop-card">
        <div className="prop-hero hero-d">
          <div className="prop-hero-label">Single-family portfolio · 40 doors</div>
          <svg className="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v11H3z" /><path d="M9 21v-6h6v6" /><path d="M3 10l3 3M21 10l-3 3" /></svg>
        </div>
        <div className="prop-body">
          <div className="prop-name">Chattahoochee SFR Portfolio</div>
          <div className="prop-addr">Scattered · Chattanooga, TN</div>
          <div className="prop-stats">
            <div>
              <div className="prop-stat-label">Q1 NOI contrib.</div>
              <div className="prop-stat-val accent">$56K</div>
            </div>
            <div>
              <div className="prop-stat-label">Occupancy</div>
              <div className="prop-stat-val" style={{color: "var(--gold)"}}>88%</div>
            </div>
            <div>
              <div className="prop-stat-label">Maint. spend</div>
              <div className="prop-stat-val">$14.8K</div>
            </div>
          </div>
          <div className="prop-occ-bar"><div className="prop-occ-fill" style={{width: "88%", background: "linear-gradient(90deg,var(--gold),var(--accent))"}} /></div>
          <div style={{marginTop: "16px"}}>
            <div className="prop-row"><span className="prop-row-label">Valuation</span><span className="prop-row-val">$4.12M</span></div>
            <div className="prop-row"><span className="prop-row-label">Debt</span><span className="prop-row-val">$2.64M @ 6.4%</span></div>
            <div className="prop-row"><span className="prop-row-label">Your share of cashflow</span><span className="prop-row-val" style={{color: "var(--accent)"}}>$3,594/yr</span></div>
          </div>
        </div>
      </div>

    </div>

    
    <section className="card docs-card" id="documents">
      <div className="card-head">
        <div>
          <div className="card-title">Documents &amp; reports</div>
          <div className="card-sub">Your personal K-1s, fund agreements, quarterly letters, and the annual audit.</div>
        </div>
        <a className="card-action" href="#">
          Archive (23)
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
      </div>

      <div className="docs-filter">
        <button className="docs-tab active">All</button>
        <button className="docs-tab">Tax (K-1)</button>
        <button className="docs-tab">Quarterly letters</button>
        <button className="docs-tab">Legal</button>
        <button className="docs-tab">Audit</button>
      </div>

      <div className="docs-grid">

        <div className="doc-item new">
          <div className="doc-icon">PDF</div>
          <div className="doc-info">
            <div className="doc-name">Q1 2026 Investor Letter</div>
            <div className="doc-meta"><span>7 pages</span><span className="doc-meta-dot" /><span>Apr 7, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item new">
          <div className="doc-icon tax">PDF</div>
          <div className="doc-info">
            <div className="doc-name">2025 Schedule K-1 · Weiss, Clara</div>
            <div className="doc-meta"><span>Tax year 2025</span><span className="doc-meta-dot" /><span>Mar 18, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon tax">PDF</div>
          <div className="doc-info">
            <div className="doc-name">K-1 Reference Memo (Kepler &amp; Co.)</div>
            <div className="doc-meta"><span>4 pages</span><span className="doc-meta-dot" /><span>Mar 18, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon audit">PDF</div>
          <div className="doc-info">
            <div className="doc-name">2025 Annual Audit · Redmond Advisors</div>
            <div className="doc-meta"><span>Independent audit</span><span className="doc-meta-dot" /><span>Mar 4, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon">PDF</div>
          <div className="doc-info">
            <div className="doc-name">Q4 2025 Investor Letter</div>
            <div className="doc-meta"><span>6 pages</span><span className="doc-meta-dot" /><span>Jan 14, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon">PDF</div>
          <div className="doc-info">
            <div className="doc-name">Madison St. Refi Memo</div>
            <div className="doc-meta"><span>Capital event · 3 pages</span><span className="doc-meta-dot" /><span>Feb 8, 2026</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon legal">PDF</div>
          <div className="doc-info">
            <div className="doc-name">Fund I · Operating Agreement (v2.1)</div>
            <div className="doc-meta"><span>34 pages</span><span className="doc-meta-dot" /><span>May 12, 2024</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon legal">PDF</div>
          <div className="doc-info">
            <div className="doc-name">Subscription Agreement · Weiss</div>
            <div className="doc-meta"><span>Executed</span><span className="doc-meta-dot" /><span>May 12, 2024</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

        <div className="doc-item">
          <div className="doc-icon tax">PDF</div>
          <div className="doc-info">
            <div className="doc-name">2024 Schedule K-1 · Weiss, Clara</div>
            <div className="doc-meta"><span>Tax year 2024</span><span className="doc-meta-dot" /><span>Mar 19, 2025</span></div>
          </div>
          <div className="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
        </div>

      </div>
    </section>

  </div>

  
  <footer className="foot">
    <div className="foot-left">
      <div>&copy; 2026 Ridgeline Capital, LLC · Fund I</div>
      <div className="foot-legal">Figures shown are unaudited estimates for investor reference. Past performance does not guarantee future results. For tax reporting, rely on your official Schedule K-1, not this dashboard.</div>
    </div>
    <div className="foot-powered">
      <div className="foot-powered-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
      </div>
      <span>Powered by <strong>Black Bear Rentals</strong></span>
    </div>
  </footer>

  

    </>
  );
}
