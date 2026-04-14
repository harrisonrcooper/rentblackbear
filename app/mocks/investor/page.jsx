"use client";

// Mock ported verbatim from ~/Desktop/tenantory/investor.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface-alt);
      line-height: 1.5; font-size: 14px; min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    .serif { font-family: 'Fraunces', 'Inter', serif; letter-spacing: -0.015em; }

    /* ===== Workspace brand tokens — Ridgeline Capital ===== */
    :root {
      --brand: #1a2744;
      --brand-dark: #121c34;
      --brand-darker: #0a1226;
      --brand-soft: #e9ecf3;
      --brand-pale: #f3f5fa;
      --accent: #8a2432;
      --accent-dark: #6e1b27;
      --accent-bright: #a32d3d;
      --accent-bg: rgba(138,36,50,0.1);
      --accent-soft: rgba(138,36,50,0.06);
      --gold: #b28a3b;
      --gold-bg: rgba(178,138,59,0.12);

      --text: #1c2233;
      --text-muted: #5a6278;
      --text-faint: #8f94a6;
      --surface: #ffffff;
      --surface-alt: #faf7f0;
      --surface-subtle: #f5f1e6;
      --border: #e6e0d0;
      --border-strong: #cdc4ab;

      --green: #2a7a5a;
      --green-dark: #1b5a42;
      --green-bg: rgba(42,122,90,0.12);
      --red: #a33232;
      --red-bg: rgba(163,50,50,0.1);

      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,39,68,0.05);
      --shadow: 0 4px 18px rgba(26,39,68,0.08);
      --shadow-lg: 0 18px 50px rgba(26,39,68,0.16);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9);
      padding: 0 36px; height: 76px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 3px solid var(--accent);
    }
    .tb-brand { display: flex; align-items: center; gap: 14px; }
    .tb-mark {
      width: 44px; height: 44px; border-radius: 10px;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
      display: flex; align-items: center; justify-content: center;
      color: #fff; box-shadow: 0 4px 14px rgba(138,36,50,0.35);
      position: relative; overflow: hidden;
    }
    .tb-mark::before {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
    }
    .tb-mark svg { width: 22px; height: 22px; position: relative; z-index: 1; }
    .tb-brand-text { display: flex; flex-direction: column; }
    .tb-brand-name { font-family: 'Fraunces', serif; font-weight: 800; font-size: 20px; color: #fff; letter-spacing: -0.02em; line-height: 1; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 3px; }

    .tb-nav { display: flex; gap: 2px; }
    .tb-nav-item {
      padding: 10px 18px; border-radius: 100px;
      color: rgba(255,255,255,0.65); font-weight: 600; font-size: 13px;
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .tb-nav-item.active { color: #fff; background: rgba(255,255,255,0.12); }

    .tb-right { display: flex; align-items: center; gap: 14px; }
    .tb-period {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 100px;
      background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85);
      font-size: 12px; font-weight: 600;
    }
    .tb-period svg { width: 12px; height: 12px; }
    .tb-period-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(138,36,50,0.25); }

    .tb-avatar {
      display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 14px;
      border-radius: 100px; background: rgba(255,255,255,0.06);
    }
    .tb-avatar-text { display: flex; flex-direction: column; align-items: flex-end; }
    .tb-avatar-name { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.1; }
    .tb-avatar-role { font-size: 10px; color: rgba(255,255,255,0.55); font-weight: 500; letter-spacing: 0.06em; margin-top: 1px; }
    .tb-avatar-img {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), var(--accent));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    /* ===== Layout ===== */
    .wrap { max-width: 1200px; margin: 0 auto; padding: 36px 36px 64px; }

    .section-lead { margin-bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
    .section-lead-text { flex: 1; min-width: 260px; }
    .section-kicker {
      font-size: 11px; font-weight: 700; color: var(--accent);
      letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 8px;
    }
    .section-lead h2 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
    .section-lead-sub { font-size: 14px; color: var(--text-muted); margin-top: 6px; }
    .section-lead-aside { font-size: 12px; color: var(--text-muted); }

    /* ===== Hero card ===== */
    .hero {
      background: linear-gradient(130deg, var(--brand) 0%, var(--brand-darker) 70%, #1b0e1c 100%);
      color: #fff; border-radius: var(--radius-xl);
      padding: 44px 48px; margin-bottom: 28px;
      position: relative; overflow: hidden;
      box-shadow: 0 24px 60px rgba(10,18,38,0.28);
    }
    .hero::before {
      content: ""; position: absolute; top: -40%; right: -10%;
      width: 540px; height: 540px; border-radius: 50%;
      background: radial-gradient(circle, rgba(138,36,50,0.35), transparent 65%);
    }
    .hero::after {
      content: ""; position: absolute; bottom: -60%; left: -15%;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(178,138,59,0.18), transparent 65%);
    }
    .hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: center; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
      color: rgba(255,255,255,0.9); padding: 5px 14px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; color: var(--gold); }
    .hero-label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; }
    .hero-value { font-family: 'Fraunces', serif; font-size: clamp(44px, 6vw, 68px); font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #fff; }
    .hero-value small { font-size: 0.48em; color: rgba(255,255,255,0.6); font-weight: 600; margin-left: 10px; letter-spacing: 0; font-family: 'Inter', sans-serif; }
    .hero-delta { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 6px 12px; border-radius: 100px; background: rgba(42,122,90,0.18); color: #7fd3a8; font-size: 13px; font-weight: 700; }
    .hero-delta svg { width: 12px; height: 12px; }
    .hero-sub { font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 16px; max-width: 420px; line-height: 1.55; }

    .hero-aside { display: flex; flex-direction: column; gap: 14px; }
    .hero-card {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      border-radius: var(--radius-lg); padding: 18px 22px;
      backdrop-filter: blur(4px);
    }
    .hero-card-label { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
    .hero-card-val { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; color: #fff; margin-top: 6px; letter-spacing: -0.02em; }
    .hero-card-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.6); }
    .hero-card-row strong { color: #fff; font-weight: 600; }
    .ownership-bar { height: 6px; border-radius: 100px; background: rgba(255,255,255,0.1); overflow: hidden; margin-top: 12px; }
    .ownership-bar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--accent-bright)); border-radius: 100px; }

    /* ===== Stats strip ===== */
    .stats {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
      margin-bottom: 32px;
    }
    .stat {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      display: flex; flex-direction: column; gap: 4px;
      position: relative; overflow: hidden;
    }
    .stat::before {
      content: ""; position: absolute; top: 0; left: 0; width: 3px; height: 100%;
      background: var(--accent); opacity: 0.6;
    }
    .stat-label {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em;
      display: flex; align-items: center; gap: 6px;
    }
    .stat-label svg { width: 12px; height: 12px; color: var(--accent); }
    .stat-value {
      font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700;
      letter-spacing: -0.025em; color: var(--text); margin-top: 6px;
    }
    .stat-value small { font-size: 0.55em; color: var(--text-muted); font-weight: 500; margin-left: 4px; font-family: 'Inter'; }
    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; }
    .stat-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 700; }
    .stat-chip.up { background: var(--green-bg); color: var(--green-dark); }
    .stat-chip.down { background: var(--red-bg); color: var(--red); }
    .stat-chip svg { width: 10px; height: 10px; }

    /* ===== Performance chart ===== */
    .performance {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px 30px;
      margin-bottom: 32px; box-shadow: var(--shadow-sm);
    }
    .perf-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
    .perf-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; letter-spacing: -0.015em; color: var(--text); }
    .perf-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

    .perf-legend { display: flex; gap: 18px; flex-wrap: wrap; }
    .perf-legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .perf-legend-swatch { width: 10px; height: 10px; border-radius: 3px; }
    .perf-legend-swatch.noi { background: var(--brand); }
    .perf-legend-swatch.dist { background: var(--accent); }
    .perf-legend-swatch.occ { background: var(--gold); }

    .perf-chart {
      height: 260px; position: relative;
      background: linear-gradient(180deg, var(--surface-subtle) 0%, var(--surface) 100%);
      border-radius: var(--radius-lg); border: 1px solid var(--border);
      padding: 20px;
    }
    .perf-chart svg { width: 100%; height: 100%; }
    .perf-axis { font-size: 10px; fill: var(--text-faint); font-family: 'Inter'; font-weight: 600; letter-spacing: 0.04em; }
    .perf-grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 3,4; }

    .perf-months { display: grid; grid-template-columns: repeat(12, 1fr); margin-top: 10px; font-size: 10px; color: var(--text-faint); font-weight: 600; letter-spacing: 0.04em; text-align: center; text-transform: uppercase; }

    .perf-summary {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
      margin-top: 22px; padding-top: 22px; border-top: 1px solid var(--border);
    }
    .perf-sum-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
    .perf-sum-val { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.02em; }
    .perf-sum-delta { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 2px; }
    .perf-sum-delta.down { color: var(--red); }

    /* ===== Two-column: distributions + messages ===== */
    .grid-two {
      display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px;
      margin-bottom: 32px;
    }

    /* Distributions table */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    .card-head {
      padding: 22px 28px 16px;
      display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;
      border-bottom: 1px solid var(--border);
    }
    .card-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; letter-spacing: -0.015em; color: var(--text); }
    .card-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .card-action { font-size: 12px; color: var(--accent); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
    .card-action svg { width: 12px; height: 12px; }
    .card-action:hover { color: var(--accent-dark); }

    .dist-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .dist-table thead th {
      padding: 12px 28px; text-align: left;
      font-size: 10px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em;
      background: var(--surface-subtle); border-bottom: 1px solid var(--border);
    }
    .dist-table thead th:last-child { text-align: right; }
    .dist-table tbody td { padding: 14px 28px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
    .dist-table tbody td:last-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; font-family: 'Fraunces', serif; font-size: 15px; }
    .dist-table tbody tr:last-child td { border-bottom: none; }
    .dist-date-pri { font-weight: 600; color: var(--text); }
    .dist-date-sec { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
    .dist-source { font-size: 12px; color: var(--text-muted); }

    .status-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.02em;
    }
    .status-chip svg { width: 10px; height: 10px; }
    .status-chip.paid { background: var(--green-bg); color: var(--green-dark); }
    .status-chip.pending { background: var(--gold-bg); color: var(--gold); }
    .status-chip.scheduled { background: var(--brand-soft); color: var(--brand); }

    .dist-total-row td {
      background: var(--surface-subtle);
      font-weight: 700; color: var(--text);
      font-size: 13px;
    }

    /* Messages */
    .msg-list { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
    .msg {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px 18px;
      position: relative; transition: all 0.15s ease;
    }
    .msg.unread { background: var(--surface); border-color: var(--accent); }
    .msg.unread::before {
      content: ""; position: absolute; top: 18px; right: 16px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--accent); box-shadow: 0 0 0 3px rgba(138,36,50,0.16);
    }
    .msg-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .msg-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand), var(--accent));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 11px;
    }
    .msg-meta { flex: 1; }
    .msg-from { font-size: 12px; font-weight: 700; color: var(--text); }
    .msg-time { font-size: 11px; color: var(--text-muted); }
    .msg-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.005em; }
    .msg-body { font-size: 12.5px; color: var(--text-muted); line-height: 1.55; }
    .msg-body strong { color: var(--text); font-weight: 600; }

    /* ===== Properties breakdown ===== */
    .props-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;
      margin-bottom: 32px;
    }
    .prop-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
      display: flex; flex-direction: column;
      transition: all 0.15s ease;
    }
    .prop-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--border-strong); }
    .prop-hero {
      height: 120px; position: relative; overflow: hidden;
      background: linear-gradient(135deg, var(--brand) 0%, var(--brand-darker) 100%);
    }
    .prop-hero.hero-b { background: linear-gradient(135deg, #3a2838 0%, var(--accent-dark) 100%); }
    .prop-hero.hero-c { background: linear-gradient(135deg, #1f3328 0%, #0d1a14 100%); }
    .prop-hero.hero-d { background: linear-gradient(135deg, #2a2c3f 0%, #403224 100%); }
    .prop-hero::after {
      content: ""; position: absolute; inset: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 40%);
    }
    .prop-hero-label {
      position: absolute; top: 14px; left: 16px; z-index: 1;
      font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.85);
      letter-spacing: 0.14em; text-transform: uppercase;
      background: rgba(0,0,0,0.25); backdrop-filter: blur(4px);
      padding: 4px 10px; border-radius: 100px;
    }
    .prop-hero-glyph {
      position: absolute; bottom: -20px; right: -20px; z-index: 0;
      width: 140px; height: 140px; color: rgba(255,255,255,0.12);
    }
    .prop-body { padding: 20px 22px; flex: 1; display: flex; flex-direction: column; }
    .prop-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--text); letter-spacing: -0.015em; }
    .prop-addr { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .prop-stats {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
      margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);
    }
    .prop-stat-label { font-size: 10px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .prop-stat-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--text); margin-top: 4px; letter-spacing: -0.02em; }
    .prop-stat-val.accent { color: var(--accent); }
    .prop-stat-val.green { color: var(--green-dark); }

    .prop-occ-bar { height: 5px; background: var(--surface-subtle); border-radius: 100px; margin-top: 10px; overflow: hidden; }
    .prop-occ-fill { height: 100%; background: linear-gradient(90deg, var(--brand), var(--accent)); border-radius: 100px; }

    .prop-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid var(--border);
      font-size: 12px;
    }
    .prop-row:last-child { border-bottom: none; }
    .prop-row-label { color: var(--text-muted); font-weight: 500; }
    .prop-row-val { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }

    /* ===== Documents ===== */
    .docs-card { margin-bottom: 32px; }
    .docs-filter {
      display: flex; gap: 6px; padding: 0 28px 16px; border-bottom: 1px solid var(--border);
    }
    .docs-tab {
      padding: 8px 14px; border-radius: 100px;
      font-size: 12px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease; cursor: pointer;
    }
    .docs-tab:hover { color: var(--text); background: var(--surface-subtle); }
    .docs-tab.active { background: var(--brand); color: #fff; }

    .docs-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
      padding: 22px 28px 28px;
    }
    .doc-item {
      display: flex; align-items: center; gap: 14px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
      transition: all 0.15s ease; position: relative;
    }
    .doc-item:hover { background: var(--surface); border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
    .doc-icon {
      width: 40px; height: 48px; border-radius: 6px;
      background: #fff; border: 1px solid var(--border);
      display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;
      font-size: 9px; font-weight: 800; color: var(--accent); letter-spacing: 0.04em;
      position: relative; flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .doc-icon::before {
      content: ""; position: absolute; top: 0; right: 0;
      width: 12px; height: 12px; background: var(--border);
      clip-path: polygon(0 0, 100% 100%, 0 100%);
    }
    .doc-icon.tax { color: #0a7043; }
    .doc-icon.legal { color: var(--brand); }
    .doc-icon.audit { color: var(--gold); }
    .doc-info { flex: 1; min-width: 0; }
    .doc-name { font-size: 13.5px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.3; }
    .doc-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; }
    .doc-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }
    .doc-dl {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--surface); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .doc-item:hover .doc-dl { background: var(--accent); color: #fff; border-color: var(--accent); }
    .doc-dl svg { width: 14px; height: 14px; }
    .doc-item.new::after {
      content: "New"; position: absolute; top: -6px; right: 12px;
      background: var(--accent); color: #fff;
      font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 2px 7px; border-radius: 100px;
    }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 24px auto 0; padding: 28px 36px;
      display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
      border-top: 1px solid var(--border);
      font-size: 12px; color: var(--text-muted);
    }
    .foot-left { display: flex; flex-direction: column; gap: 4px; }
    .foot-legal { font-size: 11px; color: var(--text-faint); max-width: 580px; }
    .foot-powered {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; color: var(--text-muted); font-weight: 500;
    }
    .foot-powered-mark {
      width: 18px; height: 18px; border-radius: 5px;
      background: linear-gradient(135deg, #1665D8, #FF4998);
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .foot-powered-mark svg { width: 10px; height: 10px; }
    .foot-powered strong { color: var(--text); font-weight: 700; }

    @media (max-width: 1000px) {
      .hero-grid { grid-template-columns: 1fr; gap: 28px; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .grid-two { grid-template-columns: 1fr; }
      .props-grid { grid-template-columns: 1fr; }
      .docs-grid { grid-template-columns: repeat(2, 1fr); }
      .perf-summary { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 680px) {
      .topbar { padding: 0 16px; height: 64px; }
      .tb-nav, .tb-period { display: none; }
      .tb-avatar-text { display: none; }
      .wrap { padding: 24px 16px 48px; }
      .hero { padding: 28px 24px; }
      .docs-grid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr; }
    }`;

const MOCK_HTML = `<!-- Topbar -->
  <header class="topbar">
    <div class="tb-brand">
      <div class="tb-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 20 8 11 12 15 16 7 21 20"/>
          <path d="M3 20h18"/>
        </svg>
      </div>
      <div class="tb-brand-text">
        <span class="tb-brand-name">Ridgeline Capital</span>
        <span class="tb-brand-sub">Investor Portal · Fund I</span>
      </div>
    </div>

    <nav class="tb-nav">
      <a class="tb-nav-item active" href="#">Overview</a>
      <a class="tb-nav-item" href="#distributions">Distributions</a>
      <a class="tb-nav-item" href="#properties">Properties</a>
      <a class="tb-nav-item" href="#documents">Documents</a>
      <a class="tb-nav-item" href="#messages">Messages</a>
    </nav>

    <div class="tb-right">
      <div class="tb-period">
        <span class="tb-period-dot"></span>
        <span>Q1 2026 · As of Apr 14</span>
      </div>
      <div class="tb-avatar">
        <div class="tb-avatar-text">
          <div class="tb-avatar-name">Clara Weiss</div>
          <div class="tb-avatar-role">LP since 2024</div>
        </div>
        <div class="tb-avatar-img">CW</div>
      </div>
    </div>
  </header>

  <div class="wrap">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="hero-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Your position in Ridgeline Fund I
          </div>
          <div class="hero-label">Portfolio value</div>
          <div class="hero-value">$487,320<small>.44</small></div>
          <div class="hero-delta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 6 23 6 23 12"/><path d="M1 18l9-9 4 4 8-8"/></svg>
            +$6,140 this month · +1.28%
          </div>
          <p class="hero-sub">Your share of the fund's equity value, marked to current net asset value. Recalculated monthly from property-level income, expenses, and independent valuations.</p>
        </div>

        <div class="hero-aside">
          <div class="hero-card">
            <div class="hero-card-label">Your ownership</div>
            <div class="hero-card-val">6.42%</div>
            <div class="ownership-bar"><div class="ownership-bar-fill" style="width:6.42%"></div></div>
            <div class="hero-card-row"><span>Your commitment</span><strong>$450,000</strong></div>
            <div class="hero-card-row"><span>Fund total equity</span><strong>$7.59M</strong></div>
          </div>
          <div class="hero-card">
            <div class="hero-card-label">Total return since entry</div>
            <div class="hero-card-val">+$37,320 <small style="font-size:14px;color:#7fd3a8;font-weight:600;margin-left:4px;">+8.29%</small></div>
            <div class="hero-card-row"><span>Entry date</span><strong>May 12, 2024</strong></div>
            <div class="hero-card-row"><span>IRR (annualized)</span><strong style="color:#7fd3a8;">14.7%</strong></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <section class="stats">
      <div class="stat">
        <div class="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6v12H3z"/><path d="M9 21v-6h6v6"/></svg>
          Units across fund
        </div>
        <div class="stat-value">142<small>doors</small></div>
        <div class="stat-sub">
          <span class="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>+12</span>
          <span>vs. end of 2025</span>
        </div>
      </div>

      <div class="stat">
        <div class="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Occupancy rate
        </div>
        <div class="stat-value">94.3<small style="font-size:0.55em;">%</small></div>
        <div class="stat-sub">
          <span class="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>+2.1pt</span>
          <span>vs. last quarter</span>
        </div>
      </div>

      <div class="stat">
        <div class="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          YTD distributions to you
        </div>
        <div class="stat-value">$13,441</div>
        <div class="stat-sub">
          <span class="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>+18%</span>
          <span>vs. YTD 2025 · 3 payments</span>
        </div>
      </div>

      <div class="stat">
        <div class="stat-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
          Fund NOI (YTD)
        </div>
        <div class="stat-value">$412K</div>
        <div class="stat-sub">
          <span class="stat-chip up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>+9.4%</span>
          <span>vs. same period 2025</span>
        </div>
      </div>
    </section>

    <!-- Performance chart -->
    <section class="performance">
      <div class="perf-head">
        <div>
          <div class="perf-title">Fund performance · trailing 12 months</div>
          <div class="perf-sub">Monthly NOI, distributions to LPs, and occupancy — indexed against your share of the fund.</div>
        </div>
        <div class="perf-legend">
          <div class="perf-legend-item"><span class="perf-legend-swatch noi"></span>Fund NOI</div>
          <div class="perf-legend-item"><span class="perf-legend-swatch dist"></span>LP distributions</div>
          <div class="perf-legend-item"><span class="perf-legend-swatch occ"></span>Occupancy %</div>
        </div>
      </div>

      <div class="perf-chart">
        <svg viewBox="0 0 720 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="noiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:var(--brand);stop-opacity:0.28"/>
              <stop offset="100%" style="stop-color:var(--brand);stop-opacity:0"/>
            </linearGradient>
            <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.22"/>
              <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0"/>
            </linearGradient>
          </defs>

          <!-- Grid -->
          <line class="perf-grid-line" x1="40" y1="40" x2="700" y2="40"/>
          <line class="perf-grid-line" x1="40" y1="90" x2="700" y2="90"/>
          <line class="perf-grid-line" x1="40" y1="140" x2="700" y2="140"/>
          <line class="perf-grid-line" x1="40" y1="190" x2="700" y2="190"/>

          <!-- Y-axis labels -->
          <text class="perf-axis" x="32" y="44" text-anchor="end">$55K</text>
          <text class="perf-axis" x="32" y="94" text-anchor="end">$45K</text>
          <text class="perf-axis" x="32" y="144" text-anchor="end">$35K</text>
          <text class="perf-axis" x="32" y="194" text-anchor="end">$25K</text>

          <!-- Occupancy axis (right) -->
          <text class="perf-axis" x="708" y="44" text-anchor="start" fill="var(--gold)">98%</text>
          <text class="perf-axis" x="708" y="94" text-anchor="start" fill="var(--gold)">94%</text>
          <text class="perf-axis" x="708" y="144" text-anchor="start" fill="var(--gold)">90%</text>
          <text class="perf-axis" x="708" y="194" text-anchor="start" fill="var(--gold)">86%</text>

          <!-- NOI area -->
          <path d="M40 140 L95 135 L150 128 L205 118 L260 108 L315 102 L370 95 L425 90 L480 82 L535 70 L590 62 L645 55 L700 48 L700 200 L40 200 Z" fill="url(#noiGrad)"/>
          <!-- NOI line -->
          <path d="M40 140 L95 135 L150 128 L205 118 L260 108 L315 102 L370 95 L425 90 L480 82 L535 70 L590 62 L645 55 L700 48" style="stroke:var(--brand);" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- NOI dots -->
          <circle cx="40" cy="140" r="3" fill="var(--brand)"/>
          <circle cx="150" cy="128" r="3" fill="var(--brand)"/>
          <circle cx="260" cy="108" r="3" fill="var(--brand)"/>
          <circle cx="370" cy="95" r="3" fill="var(--brand)"/>
          <circle cx="480" cy="82" r="3" fill="var(--brand)"/>
          <circle cx="590" cy="62" r="3" fill="var(--brand)"/>
          <circle cx="700" cy="48" r="4" fill="var(--brand)" stroke="#fff" stroke-width="2"/>

          <!-- Distributions bars -->
          <g>
            <rect x="48" y="172" width="14" height="28" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="103" y="168" width="14" height="32" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="158" y="164" width="14" height="36" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="213" y="160" width="14" height="40" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="268" y="156" width="14" height="44" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="323" y="152" width="14" height="48" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="378" y="150" width="14" height="50" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="433" y="146" width="14" height="54" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="488" y="140" width="14" height="60" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="543" y="132" width="14" height="68" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="598" y="128" width="14" height="72" rx="2" fill="var(--accent)" opacity="0.8"/>
            <rect x="653" y="120" width="14" height="80" rx="2" fill="var(--accent)"/>
          </g>

          <!-- Occupancy dashed line -->
          <path d="M40 110 L95 106 L150 100 L205 96 L260 94 L315 92 L370 88 L425 86 L480 82 L535 80 L590 76 L645 72 L700 68" style="stroke:var(--gold);" stroke-width="1.8" stroke-dasharray="4,4" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="perf-months">
        <div>May</div><div>Jun</div><div>Jul</div><div>Aug</div><div>Sep</div><div>Oct</div>
        <div>Nov</div><div>Dec</div><div>Jan</div><div>Feb</div><div>Mar</div><div>Apr</div>
      </div>

      <div class="perf-summary">
        <div>
          <div class="perf-sum-label">Avg monthly NOI</div>
          <div class="perf-sum-val">$43,900</div>
          <div class="perf-sum-delta">+$3,800 vs prior 12mo</div>
        </div>
        <div>
          <div class="perf-sum-label">Total LP distributions</div>
          <div class="perf-sum-val">$198,400</div>
          <div class="perf-sum-delta">+22.1% YoY</div>
        </div>
        <div>
          <div class="perf-sum-label">Avg occupancy</div>
          <div class="perf-sum-val">93.1%</div>
          <div class="perf-sum-delta">+1.9 pts YoY</div>
        </div>
        <div>
          <div class="perf-sum-label">Your share (TTM)</div>
          <div class="perf-sum-val">$12,740</div>
          <div class="perf-sum-delta">Pre-tax cash-on-cash 7.8%</div>
        </div>
      </div>
    </section>

    <!-- Distributions + Messages -->
    <div class="grid-two" id="distributions">

      <section class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Your distributions · last 6 months</div>
            <div class="card-sub">Deposits to account ending ···4812 · Chase Business Checking</div>
          </div>
          <a class="card-action" href="#">
            Full history
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <table class="dist-table">
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
                <div class="dist-date-pri">May 01, 2026</div>
                <div class="dist-date-sec">Q2 · scheduled</div>
              </td>
              <td><div class="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span class="status-chip scheduled">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Scheduled
                </span>
              </td>
              <td>$4,740</td>
            </tr>
            <tr>
              <td>
                <div class="dist-date-pri">Apr 03, 2026</div>
                <div class="dist-date-sec">ACH · in transit</div>
              </td>
              <td><div class="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span class="status-chip pending">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><polyline points="21 4 21 10 15 10"/></svg>
                  Pending
                </span>
              </td>
              <td>$4,612</td>
            </tr>
            <tr>
              <td>
                <div class="dist-date-pri">Mar 03, 2026</div>
                <div class="dist-date-sec">ACH ref #DV-228891</div>
              </td>
              <td><div class="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span class="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Paid
                </span>
              </td>
              <td>$4,489</td>
            </tr>
            <tr>
              <td>
                <div class="dist-date-pri">Feb 03, 2026</div>
                <div class="dist-date-sec">ACH ref #DV-221104</div>
              </td>
              <td><div class="dist-source">Operating + capital event<br><small style="color:var(--accent);font-weight:700;">Includes $1,050 refi cash-out</small></div></td>
              <td>
                <span class="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Paid
                </span>
              </td>
              <td>$5,340</td>
            </tr>
            <tr>
              <td>
                <div class="dist-date-pri">Jan 03, 2026</div>
                <div class="dist-date-sec">ACH ref #DV-215502</div>
              </td>
              <td><div class="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span class="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Paid
                </span>
              </td>
              <td>$3,612</td>
            </tr>
            <tr>
              <td>
                <div class="dist-date-pri">Dec 03, 2025</div>
                <div class="dist-date-sec">ACH ref #DV-208341</div>
              </td>
              <td><div class="dist-source">Operating cashflow · all properties</div></td>
              <td>
                <span class="status-chip paid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Paid
                </span>
              </td>
              <td>$3,488</td>
            </tr>
            <tr class="dist-total-row">
              <td colspan="2">Total distributed to you · trailing 6 months</td>
              <td></td>
              <td>$26,281</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card" id="messages">
        <div class="card-head">
          <div>
            <div class="card-title">From the operator</div>
            <div class="card-sub">Messages from Ridgeline's managing partner</div>
          </div>
        </div>
        <div class="msg-list">

          <div class="msg unread">
            <div class="msg-head">
              <div class="msg-avatar">HC</div>
              <div class="msg-meta">
                <div class="msg-from">Harrison Cooper · Managing Partner</div>
                <div class="msg-time">2 days ago · Apr 12</div>
              </div>
            </div>
            <div class="msg-title">Q1 distribution increased 5.7% vs Q4</div>
            <div class="msg-body">Stronger-than-expected occupancy at <strong>Oak Ridge (97%)</strong> and the refi closeout on Madison St. drove Q1 distributions $1,050 above the proforma. May payment is already on the rails for the 1st.</div>
          </div>

          <div class="msg unread">
            <div class="msg-head">
              <div class="msg-avatar">HC</div>
              <div class="msg-meta">
                <div class="msg-from">Harrison Cooper · Managing Partner</div>
                <div class="msg-time">1 week ago · Apr 7</div>
              </div>
            </div>
            <div class="msg-title">Q1 investor letter is ready</div>
            <div class="msg-body">Seven-page Q1 letter covering NOI, occupancy, the Madison refi, and the Greenbrier acquisition LOI is in your <strong>Documents</strong> tab. TL;DR: we're tracking 11% ahead of the 2026 pro-forma.</div>
          </div>

          <div class="msg">
            <div class="msg-head">
              <div class="msg-avatar">HC</div>
              <div class="msg-meta">
                <div class="msg-from">Harrison Cooper · Managing Partner</div>
                <div class="msg-time">Mar 18</div>
              </div>
            </div>
            <div class="msg-title">K-1s for tax year 2025 issued</div>
            <div class="msg-body">Your 2025 K-1 is posted in Documents. CPA contact for passthrough questions is Marla at Kepler &amp; Co. — her memo is attached alongside.</div>
          </div>

          <div class="msg">
            <div class="msg-head">
              <div class="msg-avatar">HC</div>
              <div class="msg-meta">
                <div class="msg-from">Harrison Cooper · Managing Partner</div>
                <div class="msg-time">Feb 11</div>
              </div>
            </div>
            <div class="msg-title">Madison St. refi closed — cash-out to LPs</div>
            <div class="msg-body">We closed the rate-and-term on Madison St. at <strong>6.1% fixed, 30-year</strong>. $78K of equity came out to the fund; your share ($1,050) was included in the Feb 3 distribution.</div>
          </div>

        </div>
      </section>
    </div>

    <!-- Properties breakdown -->
    <section class="section-lead" id="properties">
      <div class="section-lead-text">
        <div class="section-kicker">Property-by-property</div>
        <h2>The assets behind your position</h2>
        <div class="section-lead-sub">Ridgeline Fund I is currently deployed across four income-producing properties in Alabama and Tennessee.</div>
      </div>
      <div class="section-lead-aside">Q1 2026 · all figures pre-tax</div>
    </section>

    <div class="props-grid">

      <div class="prop-card">
        <div class="prop-hero">
          <div class="prop-hero-label">Multi-family · 48 units</div>
          <svg class="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="14"/><path d="M6 8V4M10 8V4M14 8V4M18 8V4"/><path d="M6 12h2M10 12h2M14 12h2M18 12h2M6 16h2M10 16h2M14 16h2M18 16h2"/></svg>
        </div>
        <div class="prop-body">
          <div class="prop-name">Oak Ridge Apartments</div>
          <div class="prop-addr">421 Oak Ridge Pkwy · Huntsville, AL</div>
          <div class="prop-stats">
            <div>
              <div class="prop-stat-label">Q1 NOI contrib.</div>
              <div class="prop-stat-val accent">$142K</div>
            </div>
            <div>
              <div class="prop-stat-label">Occupancy</div>
              <div class="prop-stat-val green">97%</div>
            </div>
            <div>
              <div class="prop-stat-label">Maint. spend</div>
              <div class="prop-stat-val">$8.4K</div>
            </div>
          </div>
          <div class="prop-occ-bar"><div class="prop-occ-fill" style="width:97%;"></div></div>
          <div style="margin-top:16px;">
            <div class="prop-row"><span class="prop-row-label">Valuation</span><span class="prop-row-val">$4.82M</span></div>
            <div class="prop-row"><span class="prop-row-label">Debt</span><span class="prop-row-val">$3.14M @ 5.8%</span></div>
            <div class="prop-row"><span class="prop-row-label">Your share of cashflow</span><span class="prop-row-val" style="color:var(--accent);">$9,116/yr</span></div>
          </div>
        </div>
      </div>

      <div class="prop-card">
        <div class="prop-hero hero-b">
          <div class="prop-hero-label">Mixed-use · 22 units + retail</div>
          <svg class="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-8h6v8"/><path d="M3 15h4M17 15h4"/></svg>
        </div>
        <div class="prop-body">
          <div class="prop-name">Madison Street Lofts</div>
          <div class="prop-addr">812 Madison St NE · Huntsville, AL</div>
          <div class="prop-stats">
            <div>
              <div class="prop-stat-label">Q1 NOI contrib.</div>
              <div class="prop-stat-val accent">$98K</div>
            </div>
            <div>
              <div class="prop-stat-label">Occupancy</div>
              <div class="prop-stat-val green">95%</div>
            </div>
            <div>
              <div class="prop-stat-label">Maint. spend</div>
              <div class="prop-stat-val">$6.1K</div>
            </div>
          </div>
          <div class="prop-occ-bar"><div class="prop-occ-fill" style="width:95%;"></div></div>
          <div style="margin-top:16px;">
            <div class="prop-row"><span class="prop-row-label">Valuation</span><span class="prop-row-val">$3.44M</span></div>
            <div class="prop-row"><span class="prop-row-label">Debt</span><span class="prop-row-val">$2.10M @ 6.1% <small style="color:var(--green-dark);font-weight:700;">new</small></span></div>
            <div class="prop-row"><span class="prop-row-label">Your share of cashflow</span><span class="prop-row-val" style="color:var(--accent);">$6,288/yr</span></div>
          </div>
        </div>
      </div>

      <div class="prop-card">
        <div class="prop-hero hero-c">
          <div class="prop-hero-label">Co-living · 5 houses · 32 bedrooms</div>
          <svg class="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M4 22V9l5-4 5 4v13"/><path d="M14 22V13l5-4 3 2.4V22"/></svg>
        </div>
        <div class="prop-body">
          <div class="prop-name">Bridge House Collective</div>
          <div class="prop-addr">1204 Greenwood Ave · Nashville, TN</div>
          <div class="prop-stats">
            <div>
              <div class="prop-stat-label">Q1 NOI contrib.</div>
              <div class="prop-stat-val accent">$116K</div>
            </div>
            <div>
              <div class="prop-stat-label">Occupancy</div>
              <div class="prop-stat-val green">96%</div>
            </div>
            <div>
              <div class="prop-stat-label">Maint. spend</div>
              <div class="prop-stat-val">$11.2K</div>
            </div>
          </div>
          <div class="prop-occ-bar"><div class="prop-occ-fill" style="width:96%;"></div></div>
          <div style="margin-top:16px;">
            <div class="prop-row"><span class="prop-row-label">Valuation</span><span class="prop-row-val">$2.98M</span></div>
            <div class="prop-row"><span class="prop-row-label">Debt</span><span class="prop-row-val">$1.82M @ 5.6%</span></div>
            <div class="prop-row"><span class="prop-row-label">Your share of cashflow</span><span class="prop-row-val" style="color:var(--accent);">$7,448/yr</span></div>
          </div>
        </div>
      </div>

      <div class="prop-card">
        <div class="prop-hero hero-d">
          <div class="prop-hero-label">Single-family portfolio · 40 doors</div>
          <svg class="prop-hero-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v11H3z"/><path d="M9 21v-6h6v6"/><path d="M3 10l3 3M21 10l-3 3"/></svg>
        </div>
        <div class="prop-body">
          <div class="prop-name">Chattahoochee SFR Portfolio</div>
          <div class="prop-addr">Scattered · Chattanooga, TN</div>
          <div class="prop-stats">
            <div>
              <div class="prop-stat-label">Q1 NOI contrib.</div>
              <div class="prop-stat-val accent">$56K</div>
            </div>
            <div>
              <div class="prop-stat-label">Occupancy</div>
              <div class="prop-stat-val" style="color:var(--gold);">88%</div>
            </div>
            <div>
              <div class="prop-stat-label">Maint. spend</div>
              <div class="prop-stat-val">$14.8K</div>
            </div>
          </div>
          <div class="prop-occ-bar"><div class="prop-occ-fill" style="width:88%;background:linear-gradient(90deg,var(--gold),var(--accent));"></div></div>
          <div style="margin-top:16px;">
            <div class="prop-row"><span class="prop-row-label">Valuation</span><span class="prop-row-val">$4.12M</span></div>
            <div class="prop-row"><span class="prop-row-label">Debt</span><span class="prop-row-val">$2.64M @ 6.4%</span></div>
            <div class="prop-row"><span class="prop-row-label">Your share of cashflow</span><span class="prop-row-val" style="color:var(--accent);">$3,594/yr</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Documents -->
    <section class="card docs-card" id="documents">
      <div class="card-head">
        <div>
          <div class="card-title">Documents &amp; reports</div>
          <div class="card-sub">Your personal K-1s, fund agreements, quarterly letters, and the annual audit.</div>
        </div>
        <a class="card-action" href="#">
          Archive (23)
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <div class="docs-filter">
        <button class="docs-tab active">All</button>
        <button class="docs-tab">Tax (K-1)</button>
        <button class="docs-tab">Quarterly letters</button>
        <button class="docs-tab">Legal</button>
        <button class="docs-tab">Audit</button>
      </div>

      <div class="docs-grid">

        <div class="doc-item new">
          <div class="doc-icon">PDF</div>
          <div class="doc-info">
            <div class="doc-name">Q1 2026 Investor Letter</div>
            <div class="doc-meta"><span>7 pages</span><span class="doc-meta-dot"></span><span>Apr 7, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item new">
          <div class="doc-icon tax">PDF</div>
          <div class="doc-info">
            <div class="doc-name">2025 Schedule K-1 · Weiss, Clara</div>
            <div class="doc-meta"><span>Tax year 2025</span><span class="doc-meta-dot"></span><span>Mar 18, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon tax">PDF</div>
          <div class="doc-info">
            <div class="doc-name">K-1 Reference Memo (Kepler &amp; Co.)</div>
            <div class="doc-meta"><span>4 pages</span><span class="doc-meta-dot"></span><span>Mar 18, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon audit">PDF</div>
          <div class="doc-info">
            <div class="doc-name">2025 Annual Audit · Redmond Advisors</div>
            <div class="doc-meta"><span>Independent audit</span><span class="doc-meta-dot"></span><span>Mar 4, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon">PDF</div>
          <div class="doc-info">
            <div class="doc-name">Q4 2025 Investor Letter</div>
            <div class="doc-meta"><span>6 pages</span><span class="doc-meta-dot"></span><span>Jan 14, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon">PDF</div>
          <div class="doc-info">
            <div class="doc-name">Madison St. Refi Memo</div>
            <div class="doc-meta"><span>Capital event · 3 pages</span><span class="doc-meta-dot"></span><span>Feb 8, 2026</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon legal">PDF</div>
          <div class="doc-info">
            <div class="doc-name">Fund I · Operating Agreement (v2.1)</div>
            <div class="doc-meta"><span>34 pages</span><span class="doc-meta-dot"></span><span>May 12, 2024</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon legal">PDF</div>
          <div class="doc-info">
            <div class="doc-name">Subscription Agreement · Weiss</div>
            <div class="doc-meta"><span>Executed</span><span class="doc-meta-dot"></span><span>May 12, 2024</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

        <div class="doc-item">
          <div class="doc-icon tax">PDF</div>
          <div class="doc-info">
            <div class="doc-name">2024 Schedule K-1 · Weiss, Clara</div>
            <div class="doc-meta"><span>Tax year 2024</span><span class="doc-meta-dot"></span><span>Mar 19, 2025</span></div>
          </div>
          <div class="doc-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></div>
        </div>

      </div>
    </section>

  </div>

  <!-- Footer -->
  <footer class="foot">
    <div class="foot-left">
      <div>&copy; 2026 Ridgeline Capital, LLC · Fund I</div>
      <div class="foot-legal">Figures shown are unaudited estimates for investor reference. Past performance does not guarantee future results. For tax reporting, rely on your official Schedule K-1, not this dashboard.</div>
    </div>
    <div class="foot-powered">
      <div class="foot-powered-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
      </div>
      <span>Powered by <strong>Tenantory</strong></span>
    </div>
  </footer>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
