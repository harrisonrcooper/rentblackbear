"use client";

// Mock ported verbatim from ~/Desktop/tenantory/partners.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }
    input, textarea, select { font-family: inherit; }

    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);
      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);
    }
    .tb-brand { display: flex; align-items: center; gap: 10px; }
    .tb-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }
    .tb-nav { display: flex; align-items: center; gap: 4px; }
    .tb-nav-item {
      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }
    .tb-nav-item.active { color: var(--blue); }
    .tb-cta { display: flex; gap: 10px; align-items: center; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-nav { padding: 9px 16px; font-size: 13px; }
    .btn-lg { padding: 14px 28px; font-size: 15px; }

    /* ===== Hero ===== */
    .hero { padding: 80px 32px 36px; text-align: center; max-width: 960px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(38px, 5.4vw, 62px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.03;
      max-width: 900px; margin: 0 auto 18px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 700px; margin: 0 auto 32px; line-height: 1.55;
    }
    .hero-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .hero-fine { margin-top: 16px; font-size: 13px; color: var(--text-faint); }

    /* ===== Trust stats ===== */
    .stats {
      max-width: 1100px; margin: 56px auto 0; padding: 0 32px;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }
    .stat {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px 20px; text-align: center;
      transition: all 0.15s ease;
    }
    .stat:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
    .stat-val {
      font-size: 30px; font-weight: 900; letter-spacing: -0.03em; line-height: 1;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
      margin-bottom: 8px;
    }
    .stat-lbl { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    /* ===== Section header ===== */
    .sec { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .sec-eyebrow {
      display: inline-block; font-size: 12px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--blue); margin-bottom: 10px;
    }
    .sec h2 {
      font-size: clamp(28px, 3.6vw, 40px);
      font-weight: 800; letter-spacing: -0.028em; line-height: 1.1;
      margin-bottom: 12px; max-width: 760px;
    }
    .sec-sub {
      font-size: 17px; color: var(--text-muted); max-width: 680px; line-height: 1.55;
    }
    .sec-head { margin-bottom: 40px; }

    /* ===== Who it's for ===== */
    .who-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    }
    .who-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 26px 24px;
      transition: all 0.15s ease;
    }
    .who-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--border-strong); }
    .who-icon {
      width: 42px; height: 42px; border-radius: 10px;
      background: var(--blue-softer); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .who-icon svg { width: 22px; height: 22px; }
    .who-card h3 { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 6px; }
    .who-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }

    /* ===== Calculator ===== */
    .calc-wrap {
      background: linear-gradient(180deg, var(--surface) 0%, var(--surface-alt) 100%);
      border: 1px solid var(--border); border-radius: var(--radius-xl);
      padding: 40px 40px 36px; max-width: 980px; margin: 0 auto;
    }
    .calc-slider-row {
      display: flex; align-items: center; gap: 20px; margin-bottom: 32px; flex-wrap: wrap;
    }
    .calc-count-lbl { font-size: 14px; font-weight: 600; color: var(--text-muted); }
    .calc-count-big {
      font-size: 56px; font-weight: 900; letter-spacing: -0.035em; line-height: 1;
      color: var(--text);
      min-width: 90px;
    }
    .calc-slider { flex: 1; min-width: 240px; }
    .calc-slider input {
      width: 100%; height: 6px; border-radius: 100px; background: var(--border);
      appearance: none; cursor: pointer; outline: none;
    }
    .calc-slider input::-webkit-slider-thumb {
      appearance: none; width: 26px; height: 26px; border-radius: 50%;
      background: var(--pink); border: 3px solid #fff;
      box-shadow: 0 4px 12px rgba(255,73,152,0.45); cursor: pointer;
    }
    .calc-slider input::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--pink); border: 3px solid #fff;
      box-shadow: 0 4px 12px rgba(255,73,152,0.45); cursor: pointer;
    }
    .calc-slider-ticks {
      display: flex; justify-content: space-between;
      margin-top: 8px; font-size: 11px; color: var(--text-faint); font-weight: 500;
    }
    .calc-results {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .calc-box {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px 26px;
    }
    .calc-box.primary {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%);
      border: none; color: #fff;
    }
    .calc-box-lbl { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; color: var(--text-muted); }
    .calc-box.primary .calc-box-lbl { color: rgba(255,255,255,0.7); }
    .calc-box-val { font-size: 40px; font-weight: 900; letter-spacing: -0.035em; line-height: 1; color: var(--text); margin-bottom: 6px; }
    .calc-box.primary .calc-box-val { color: #fff; }
    .calc-box-val em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .calc-box-note { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .calc-box.primary .calc-box-note { color: rgba(255,255,255,0.7); }
    .calc-foot {
      margin-top: 22px; font-size: 12px; color: var(--text-faint); text-align: center; line-height: 1.5;
    }

    /* ===== What you get ===== */
    .feat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .feat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px; display: flex; gap: 18px;
      transition: all 0.15s ease;
    }
    .feat-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
    .feat-icon {
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: var(--pink-bg); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
    }
    .feat-icon svg { width: 22px; height: 22px; }
    .feat-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.01em; }
    .feat-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }

    /* ===== Dashboard mockup ===== */
    .dash-wrap {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg);
    }
    .dash-head {
      padding: 20px 28px; border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
      background: var(--surface-alt);
    }
    .dash-title { font-size: 14px; font-weight: 700; color: var(--text); }
    .dash-meta { font-size: 13px; color: var(--text-muted); display: flex; gap: 16px; flex-wrap: wrap; }
    .dash-meta strong { color: var(--text); font-weight: 700; }
    .dash-kpis {
      display: grid; grid-template-columns: repeat(4, 1fr);
      border-bottom: 1px solid var(--border);
    }
    .dash-kpi { padding: 22px 26px; border-right: 1px solid var(--border); }
    .dash-kpi:last-child { border-right: none; }
    .dash-kpi-lbl { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 8px; }
    .dash-kpi-val { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: var(--text); }
    .dash-kpi-delta { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 4px; }

    .dash-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .dash-table th {
      padding: 14px 20px; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint);
      text-align: left; border-bottom: 1px solid var(--border); background: var(--surface-subtle);
    }
    .dash-table td { padding: 16px 20px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
    .dash-table tr:last-child td { border-bottom: none; }
    .dash-table td.num { font-variant-numeric: tabular-nums; font-weight: 600; }
    .dash-name { font-weight: 700; color: var(--text); }
    .dash-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .tag {
      display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.02em;
    }
    .tag-pro { background: var(--pink-bg); color: #c21a6a; }
    .tag-starter { background: var(--blue-softer); color: var(--blue); }
    .tag-port { background: rgba(245,166,35,0.14); color: #8a5a00; }
    .tag-active { background: var(--green-bg); color: var(--green-dark); }
    .tag-trial { background: rgba(138,147,165,0.14); color: var(--text-muted); }
    .tag-churned { background: rgba(214,69,69,0.12); color: var(--red); }

    /* ===== Creative assets ===== */
    .assets-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .asset {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px 22px 20px;
      display: flex; flex-direction: column;
      transition: all 0.15s ease;
    }
    .asset:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--border-strong); }
    .asset-preview {
      height: 110px; border-radius: var(--radius);
      background: var(--surface-alt); border: 1px solid var(--border);
      margin-bottom: 16px; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .asset-preview.social {
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
    }
    .asset-preview.social::after {
      content: ""; position: absolute; inset: 10px; border-radius: 8px;
      background: rgba(255,255,255,0.14); backdrop-filter: blur(8px);
    }
    .asset-preview.email {
      background: var(--surface); border: 1px solid var(--border);
      padding: 14px;
    }
    .email-line { height: 6px; border-radius: 2px; background: var(--border); margin-bottom: 6px; }
    .email-line.short { width: 62%; }
    .email-line.accent { background: var(--pink); width: 40%; }
    .asset-preview.banner {
      background: var(--surface); padding: 10px; gap: 8px; display: grid;
      grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr;
    }
    .banner-chip { border-radius: 4px; }
    .banner-chip.a { background: var(--navy); grid-column: span 2; }
    .banner-chip.b { background: var(--pink); }
    .banner-chip.c { background: var(--blue-pale); }
    .banner-chip.d { background: var(--blue-bright); grid-column: span 2; }
    .asset-preview.podcast {
      background: linear-gradient(135deg, var(--navy-darker), var(--navy));
      color: #fff;
    }
    .asset-preview.podcast svg { width: 42px; height: 42px; color: var(--pink); z-index: 1; }
    .asset-name { font-size: 14px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }
    .asset-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; flex: 1; }
    .asset-btn {
      font-size: 12px; font-weight: 700; color: var(--blue);
      padding: 8px 12px; border-radius: 100px; border: 1px solid var(--border);
      background: var(--surface); text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.15s ease;
    }
    .asset-btn:hover { border-color: var(--blue); background: var(--blue-softer); }
    .asset-btn svg { width: 14px; height: 14px; }

    /* ===== Requirements ===== */
    .req-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 32px 36px;
      max-width: 900px; margin: 0 auto;
    }
    .req-list { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 32px; }
    .req-item { display: flex; gap: 14px; }
    .req-check {
      width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
    }
    .req-check svg { width: 14px; height: 14px; }
    .req-item h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
    .req-item p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

    /* ===== FAQ ===== */
    .faq { max-width: 820px; margin: 96px auto 0; padding: 0 32px; }
    .faq-head { text-align: center; margin-bottom: 40px; }
    .faq-head h2 { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; letter-spacing: -0.028em; margin-bottom: 12px; }
    .faq-list { display: flex; flex-direction: column; gap: 10px; }
    .faq-item {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: all 0.15s ease;
    }
    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }
    .faq-q {
      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);
      display: flex; justify-content: space-between; align-items: center;
      cursor: pointer; user-select: none; width: 100%; text-align: left;
    }
    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }
    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }
    .faq-a {
      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;
      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6;
    }
    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }

    /* ===== Form ===== */
    .form-wrap {
      max-width: 820px; margin: 0 auto;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 40px 44px;
      box-shadow: var(--shadow);
    }
    .form-head { text-align: center; margin-bottom: 32px; }
    .form-head h3 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .form-head p { font-size: 15px; color: var(--text-muted); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .form-field { display: flex; flex-direction: column; }
    .form-field.full { grid-column: span 2; }
    .form-field label {
      font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;
    }
    .form-field input, .form-field select, .form-field textarea {
      border: 1px solid var(--border); border-radius: var(--radius);
      padding: 11px 14px; font-size: 14px; color: var(--text); background: var(--surface);
      transition: all 0.15s ease;
    }
    .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
      outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-softer);
    }
    .form-field textarea { resize: vertical; min-height: 90px; }
    .form-submit { text-align: center; margin-top: 8px; }
    .form-fine { font-size: 12px; color: var(--text-faint); text-align: center; margin-top: 12px; line-height: 1.5; }

    /* ===== Toast ===== */
    .toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(120%);
      background: var(--text); color: #fff;
      padding: 14px 22px; border-radius: 100px;
      font-size: 14px; font-weight: 600;
      box-shadow: var(--shadow-xl);
      display: flex; align-items: center; gap: 10px;
      max-width: calc(100% - 32px);
      transition: transform 0.3s cubic-bezier(0.2,0.9,0.3,1.2);
      z-index: 100;
    }
    .toast.show { transform: translateX(-50%) translateY(0); }
    .toast svg { width: 18px; height: 18px; color: var(--pink); flex-shrink: 0; }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 60px 48px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 420px; height: 420px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; }
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }
    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 980px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      .who-grid { grid-template-columns: repeat(2, 1fr); }
      .feat-grid { grid-template-columns: 1fr; }
      .assets-grid { grid-template-columns: repeat(2, 1fr); }
      .dash-kpis { grid-template-columns: repeat(2, 1fr); }
      .dash-kpi:nth-child(2) { border-right: none; }
      .dash-kpi:nth-child(1), .dash-kpi:nth-child(2) { border-bottom: 1px solid var(--border); }
      .req-list { grid-template-columns: 1fr; }
      .calc-results { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 28px; }
      .sec { padding-left: 16px; padding-right: 16px; margin-top: 72px; }
      .faq { padding-left: 16px; padding-right: 16px; margin-top: 72px; }
      .cta-bottom { padding-left: 16px; padding-right: 16px; margin-top: 72px; }
      .who-grid { grid-template-columns: 1fr; }
      .assets-grid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr 1fr; }
      .dash-table { font-size: 13px; }
      .dash-table th, .dash-table td { padding: 12px 14px; }
      .form-wrap { padding: 28px 22px; }
      .form-row { grid-template-columns: 1fr; }
      .form-field.full { grid-column: span 1; }
      .calc-wrap { padding: 28px 22px; }
      .calc-count-big { font-size: 44px; }
      .cta-card { padding: 40px 22px; }
    }`;

const MOCK_HTML = `<!-- Topbar -->
  <header class="topbar">
    <a class="tb-brand" href="landing.html">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <span class="tb-brand-name">Tenantory</span>
    </a>
    <nav class="tb-nav">
      <a class="tb-nav-item" href="landing.html">Home</a>
      <a class="tb-nav-item" href="pricing.html">Pricing</a>
      <a class="tb-nav-item active" href="partners.html">Partners</a>
      <a class="tb-nav-item" href="stories.html">Stories</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="#apply">Apply to partner</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      Tenantory Partner Program
    </div>
    <h1>Tenantory pays <em>30% for a year</em>. Per referral. Recurring.</h1>
    <p class="hero-sub">If you have an audience in the real estate or rental space — a REIA chapter, a coaching cohort, a podcast, a YouTube channel, or a service practice full of landlords — every PM you refer pays you for twelve months straight. Quarterly Stripe payouts. No cap on referrals. No cap on earnings.</p>
    <div class="hero-actions">
      <a class="btn btn-pink btn-lg" href="#apply">Apply to be a partner
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a class="btn btn-ghost btn-lg" href="#math">Run the numbers</a>
    </div>
    <div class="hero-fine">Applications reviewed personally. Typical reply in 3–5 business days.</div>
  </section>

  <!-- Stats -->
  <section class="stats">
    <div class="stat">
      <div class="stat-val">32</div>
      <div class="stat-lbl">Active partners this quarter</div>
    </div>
    <div class="stat">
      <div class="stat-val">$48k</div>
      <div class="stat-lbl">Paid out to partners in Q1</div>
    </div>
    <div class="stat">
      <div class="stat-val">384</div>
      <div class="stat-lbl">PMs referred by partners</div>
    </div>
    <div class="stat">
      <div class="stat-val">12 mo</div>
      <div class="stat-lbl">Revenue share duration</div>
    </div>
  </section>

  <!-- Who it's for -->
  <section class="sec" id="who">
    <div class="sec-head">
      <div class="sec-eyebrow">Who this is for</div>
      <h2>Built for operators with reach.</h2>
      <p class="sec-sub">Not every referral program needs to be the same. If the audience you've built intersects with landlords, investors, or property managers, the partner program is where you belong. If you're a single PM referring a friend, the <a href="referral.html" style="color:var(--blue); font-weight:600;">customer referral program</a> is simpler and pays a flat bonus.</p>
    </div>
    <div class="who-grid">
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>REIA chapter leaders</h3>
        <p>You run the meetup. Every month half the room is mid-argument about AppFolio versus Buildium. Give them a real third option and split the upside.</p>
      </div>
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <h3>Coaches &amp; educators</h3>
        <p>You teach landlords how to scale — the software they pick on day one determines whether they make it past unit ten. Your recommendation carries weight.</p>
      </div>
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <h3>Podcast hosts</h3>
        <p>A 60-second host-read ad in a real estate show outperforms any paid search campaign we've run. Custom tracking URLs, campaign codes, and attribution built in.</p>
      </div>
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </div>
        <h3>YouTube &amp; TikTok creators</h3>
        <p>Real estate is one of the highest-CPM verticals on the platform for a reason. Turn description-box links into a 12-month annuity.</p>
      </div>
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l9-4 9 4"/><path d="M4 10v10h16V10"/><path d="M8 20v-6h8v6"/><line x1="12" y1="10" x2="12" y2="14"/></svg>
        </div>
        <h3>Real estate attorneys</h3>
        <p>Every new LLC client needs a way to collect rent, store signed leases, and track expenses for their tax return. Be the one who hands them the tool that works.</p>
      </div>
      <div class="who-card">
        <div class="who-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <h3>Inspectors, photographers, turnover crews</h3>
        <p>You're already on the phone with landlords every week. When they ask what you'd use for rent collection, answer with a link that pays you back.</p>
      </div>
    </div>
  </section>

  <!-- Math calculator -->
  <section class="sec" id="math">
    <div class="sec-head">
      <div class="sec-eyebrow">The math</div>
      <h2>Your audience, quantified.</h2>
      <p class="sec-sub">Drag the slider. The payout is 30% of $99/mo Pro, paid for 12 months per conversion. Every new referral resets the 12-month clock on that specific account.</p>
    </div>
    <div class="calc-wrap">
      <div class="calc-slider-row">
        <div class="calc-count-lbl">Pro referrals per year</div>
        <div class="calc-count-big" id="calcCount">12</div>
        <div class="calc-slider">
          <input type="range" id="calcRange" min="1" max="100" value="12" step="1">
          <div class="calc-slider-ticks">
            <span>1</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>
      </div>
      <div class="calc-results">
        <div class="calc-box primary">
          <div class="calc-box-lbl">Year 1 earnings</div>
          <div class="calc-box-val" id="calcYear1">$4,277</div>
          <div class="calc-box-note">$99 × 30% × 12 months × referrals. Paid in quarterly installments via Stripe.</div>
        </div>
        <div class="calc-box">
          <div class="calc-box-lbl">Active monthly recurring</div>
          <div class="calc-box-val"><em id="calcMonthly">$356</em>/mo</div>
          <div class="calc-box-note">What you'd earn each month if all current-year referrals are still active. Continues until month 12 of each account.</div>
        </div>
      </div>
      <div class="calc-foot">Assumes $99/mo Pro subscriptions. Starter ($39/mo) pays 30% too — just at the Starter price point. Enterprise deals are negotiated case-by-case.</div>
    </div>
  </section>

  <!-- What you get -->
  <section class="sec" id="what">
    <div class="sec-head">
      <div class="sec-eyebrow">What you get</div>
      <h2>Tools to make promoting Tenantory feel easy.</h2>
    </div>
    <div class="feat-grid">
      <div class="feat-card">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div>
          <h3>30% rev-share for 12 months</h3>
          <p>Every account you refer pays you 30% of their subscription for a full year. No tiers, no claw-back after month three, no "qualified lead" gymnastics. They subscribe, you earn.</p>
        </div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        </div>
        <div>
          <h3>Dedicated partner dashboard</h3>
          <p>Unique tracking links per channel, live conversion funnel, MRR attribution, cumulative earnings, payout history, and a CSV export for your accountant. Updated in real time.</p>
        </div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h3>Creative asset library</h3>
          <p>Social post copy, 30/60/90-second podcast reads, four banner ad sizes, email templates, a 12-slide deck for your next REIA talk. Co-branded on request.</p>
        </div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div>
          <h3>First look at new features</h3>
          <p>Quarterly private briefing with Harrison on what's shipping next, plus early access to beta features so your audience hears about them before the changelog goes public.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Dashboard mockup -->
  <section class="sec" id="dashboard">
    <div class="sec-head">
      <div class="sec-eyebrow">Your dashboard</div>
      <h2>Every referral, tracked. Every dollar, visible.</h2>
      <p class="sec-sub">Preview of the partner dashboard. Once you're approved, this is your home screen.</p>
    </div>
    <div class="dash-wrap">
      <div class="dash-head">
        <div class="dash-title">Partner dashboard · April 2026</div>
        <div class="dash-meta">
          <span>Tracking code <strong>REIA-NORTH</strong></span>
          <span>Next payout <strong>Jul 1, 2026</strong></span>
        </div>
      </div>
      <div class="dash-kpis">
        <div class="dash-kpi">
          <div class="dash-kpi-lbl">Clicks this month</div>
          <div class="dash-kpi-val">1,284</div>
          <div class="dash-kpi-delta">+18% vs last month</div>
        </div>
        <div class="dash-kpi">
          <div class="dash-kpi-lbl">Conversions</div>
          <div class="dash-kpi-val">9</div>
          <div class="dash-kpi-delta">0.70% conversion rate</div>
        </div>
        <div class="dash-kpi">
          <div class="dash-kpi-lbl">Active attributed MRR</div>
          <div class="dash-kpi-val">$2,871</div>
          <div class="dash-kpi-delta">$861 your share</div>
        </div>
        <div class="dash-kpi">
          <div class="dash-kpi-lbl">Lifetime earned</div>
          <div class="dash-kpi-val">$4,922</div>
          <div class="dash-kpi-delta">$3,268 paid · $1,654 pending</div>
        </div>
      </div>
      <table class="dash-table">
        <thead>
          <tr>
            <th>Referral</th>
            <th>Signed up</th>
            <th>Plan</th>
            <th>Monthly commission</th>
            <th>Cumulative earned</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="dash-name">Hollis Property Group</div>
              <div class="dash-sub">hollispg.com · 18 units</div>
            </td>
            <td class="num">Oct 14, 2025</td>
            <td><span class="tag tag-pro">Pro</span></td>
            <td class="num">$29.70</td>
            <td class="num">$178.20</td>
            <td><span class="tag tag-active">Active · M6 of 12</span></td>
          </tr>
          <tr>
            <td>
              <div class="dash-name">Sarah Chen Rentals</div>
              <div class="dash-sub">sarahchen.co · 7 units</div>
            </td>
            <td class="num">Dec 03, 2025</td>
            <td><span class="tag tag-pro">Pro</span></td>
            <td class="num">$29.70</td>
            <td class="num">$118.80</td>
            <td><span class="tag tag-active">Active · M4 of 12</span></td>
          </tr>
          <tr>
            <td>
              <div class="dash-name">Bluestone Real Estate</div>
              <div class="dash-sub">bluestone-re.com · 44 units</div>
            </td>
            <td class="num">Jan 22, 2026</td>
            <td><span class="tag tag-pro">Pro</span></td>
            <td class="num">$29.70</td>
            <td class="num">$89.10</td>
            <td><span class="tag tag-active">Active · M3 of 12</span></td>
          </tr>
          <tr>
            <td>
              <div class="dash-name">Marcus Webb</div>
              <div class="dash-sub">Solo · 3 units</div>
            </td>
            <td class="num">Feb 08, 2026</td>
            <td><span class="tag tag-starter">Starter</span></td>
            <td class="num">$11.70</td>
            <td class="num">$23.40</td>
            <td><span class="tag tag-trial">Trial → paid</span></td>
          </tr>
          <tr>
            <td>
              <div class="dash-name">Redoak Management Co.</div>
              <div class="dash-sub">redoakmgmt.com · 112 units</div>
            </td>
            <td class="num">Mar 30, 2026</td>
            <td><span class="tag tag-port">Portfolio</span></td>
            <td class="num">$74.70</td>
            <td class="num">$74.70</td>
            <td><span class="tag tag-active">Active · M1 of 12</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Creative assets -->
  <section class="sec" id="assets">
    <div class="sec-head">
      <div class="sec-eyebrow">Creative library</div>
      <h2>Ready-to-ship assets for every channel.</h2>
      <p class="sec-sub">Don't stare at a blank page. Every partner gets instant access to copy, visuals, and scripts that convert — drafted by Harrison, tested on real campaigns.</p>
    </div>
    <div class="assets-grid">
      <div class="asset">
        <div class="asset-preview social"></div>
        <div class="asset-name">Social post copy</div>
        <div class="asset-desc">Six short-form hooks and two long-form threads. Twitter, LinkedIn, and Instagram variants, each under the character cap.</div>
        <button class="asset-btn" data-asset="Social post copy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </button>
      </div>
      <div class="asset">
        <div class="asset-preview email">
          <div style="width:100%">
            <div class="email-line" style="width:40%;"></div>
            <div class="email-line"></div>
            <div class="email-line short"></div>
            <div class="email-line"></div>
            <div class="email-line accent" style="margin-top:10px; height:10px;"></div>
          </div>
        </div>
        <div class="asset-name">Email template</div>
        <div class="asset-desc">Three-email nurture sequence for your newsletter. Subject lines tested on 40k-subscriber lists with 38% open rates.</div>
        <button class="asset-btn" data-asset="Email template">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </button>
      </div>
      <div class="asset">
        <div class="asset-preview banner">
          <div class="banner-chip a"></div>
          <div class="banner-chip b"></div>
          <div class="banner-chip c"></div>
          <div class="banner-chip d"></div>
        </div>
        <div class="asset-name">Banner ads (PNG)</div>
        <div class="asset-desc">Four sizes: 728×90 leaderboard, 300×250 medium rectangle, 160×600 skyscraper, 1200×628 open graph. Co-branded versions on request.</div>
        <button class="asset-btn" data-asset="Banner ads">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
      </div>
      <div class="asset">
        <div class="asset-preview podcast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <div class="asset-name">Podcast ad read</div>
        <div class="asset-desc">30, 60, and 90-second host-read scripts. Written to sound like you, not like a radio jingle. Custom discount code per show.</div>
        <button class="asset-btn" data-asset="Podcast ad read">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </button>
      </div>
    </div>
  </section>

  <!-- Requirements -->
  <section class="sec" id="rules">
    <div class="sec-head">
      <div class="sec-eyebrow">Program rules</div>
      <h2>The short version of the agreement.</h2>
      <p class="sec-sub">Six rules keep the program clean. Break any of them and we pause your payouts and have a conversation — nobody gets terminated by email for an honest mistake.</p>
    </div>
    <div class="req-card">
      <div class="req-list">
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>Disclose the affiliation publicly</h4>
            <p>Every post, video, email, or ad read mentions that you earn a commission. FTC-compliant, not buried in a footer.</p>
          </div>
        </div>
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>No misleading claims</h4>
            <p>Don't invent features. Don't promise income. Don't compare us to competitors with numbers we haven't published.</p>
          </div>
        </div>
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>No brand-bidding on paid search</h4>
            <p>No Google or Bing ads targeting "Tenantory" or common misspellings. Bid on your own audience, not our name.</p>
          </div>
        </div>
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>Three referrals before first payout</h4>
            <p>Minimum $297 accrued (roughly three Pro conversions) before the first Stripe transfer. Every quarter after, the floor drops to $50.</p>
          </div>
        </div>
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>No spam, no purchased lists</h4>
            <p>Owned audiences only. Cold outbound to scraped lists gets the account paused within 24 hours.</p>
          </div>
        </div>
        <div class="req-item">
          <div class="req-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4>90-day attribution window</h4>
            <p>Last-click attribution with a 90-day cookie. If someone clicks your link today and signs up in June, the commission is yours.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq">
    <div class="faq-head">
      <h2>Questions partners ask.</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">When do I actually get paid?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>Quarterly, via Stripe Connect. Payouts go out on the 1st of January, April, July, and October for the prior quarter's earnings. Your first payout requires at least $297 accrued; after that, the threshold drops to $50. You'll get an emailed statement the week before each transfer.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What counts as a conversion?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>A qualified conversion is an account that signs up through your link and completes their first paid billing cycle (i.e. survives the 14-day trial and stays through day 30). The 12-month commission clock starts the day they first pay. Trials that don't convert don't count toward your payout, but they do show in your dashboard as attribution data.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can I promote Tenantory across multiple channels?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>Yes — and we recommend it. Every partner gets separate tracking codes per channel (podcast vs. newsletter vs. YouTube, for example) so you can see which one converts best. No cap on channels, codes, or creative variations. Just keep them on your owned properties.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What happens if someone I refer cancels?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>Your commission stops the month they cancel — but every dollar you've already earned stays. There's no claw-back provision. If they cancel in month three, you keep months one through three in full; months four through twelve simply don't accrue. If they re-subscribe later through your same link within the 90-day attribution window, the clock picks back up.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Do I need an LLC to join?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>No. You can receive payouts as an individual — we'll collect a W-9 and issue a 1099-NEC at year end if you cross $600 in payouts, same as any other U.S. contractor. If you'd rather be paid to an LLC, just provide the EIN and bank details during Stripe Connect onboarding. International partners pay out through Stripe's supported countries list.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What's the difference between this and the customer referral program?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>The <a href="referral.html" style="color:var(--blue); font-weight:600;">customer referral program</a> is built for existing Tenantory subscribers referring PM friends one at a time — you get $99 in account credit per signup, they get $99 off their first month, no application required. The partner program is for people with audiences who are promoting Tenantory at scale: 30% revenue share for 12 months, paid in cash via Stripe, with a dedicated dashboard and creative library. Most partners earn 10–50× what the customer program would pay. You can participate in both simultaneously if you're an existing Tenantory customer with an audience.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can I negotiate a custom deal for a large launch?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-a"><p>Yes. If you're running a cohort launch, a summit, or a podcast tour and want co-branded landing pages, extended attribution windows, or a flat sponsorship fee layered on top of the rev-share, reply to the approval email with the details. We've done custom structures before and they usually land within a week.</p></div>
      </div>
    </div>
  </section>

  <!-- Application form -->
  <section class="sec" id="apply">
    <div class="sec-head" style="text-align:center;">
      <div class="sec-eyebrow">Apply to partner</div>
      <h2 style="margin-left:auto; margin-right:auto;">Tell us about your audience.</h2>
      <p class="sec-sub" style="margin-left:auto; margin-right:auto;">Every application goes to Harrison directly. We're selective — we'd rather have 40 partners who know our product than 400 who don't — but we read every submission inside a business week.</p>
    </div>
    <form class="form-wrap" id="partnerForm" onsubmit="return submitPartner(event)">
      <div class="form-row">
        <div class="form-field">
          <label for="pf-name">Your name</label>
          <input type="text" id="pf-name" required placeholder="Sarah Okonkwo">
        </div>
        <div class="form-field">
          <label for="pf-email">Email</label>
          <input type="email" id="pf-email" required placeholder="sarah@yourdomain.com">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="pf-url">Audience URL (channel, show, or site)</label>
          <input type="url" id="pf-url" required placeholder="https://youtube.com/@yourchannel">
        </div>
        <div class="form-field">
          <label for="pf-size">Audience size</label>
          <select id="pf-size" required>
            <option value="">Pick a range</option>
            <option value="u1k">Under 1,000</option>
            <option value="1-5k">1,000 – 5,000</option>
            <option value="5-25k">5,000 – 25,000</option>
            <option value="25-100k">25,000 – 100,000</option>
            <option value="100k+">100,000+</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field full">
          <label for="pf-type">What kind of audience is it?</label>
          <select id="pf-type" required>
            <option value="">Choose the closest fit</option>
            <option>REIA chapter / real estate meetup</option>
            <option>Real estate coach or educator</option>
            <option>Podcast host</option>
            <option>YouTube / TikTok / Instagram creator</option>
            <option>Newsletter / Substack</option>
            <option>Real estate attorney</option>
            <option>Service provider (inspector, photographer, GC)</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field full">
          <label for="pf-plan">How would you promote Tenantory?</label>
          <textarea id="pf-plan" required placeholder="Tell us what you'd do in the first 60 days. Be specific — 'a four-part newsletter series in April plus two YouTube videos' lands better than 'probably social posts.'"></textarea>
        </div>
      </div>
      <div class="form-submit">
        <button type="submit" class="btn btn-pink btn-lg">Submit application
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <div class="form-fine">By applying you agree to the program rules above. Harrison reviews every application personally.</div>
      </div>
    </form>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>A twelve-month annuity for one good post.</h2>
      <p>Every referral you send pays for a full year. The average partner earns $4,200 in their first twelve months — and that number keeps compounding as long as you keep sharing.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="#apply">Apply now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="mailto:partners@tenantory.com">Email Harrison directly</a>
      </div>
      <div class="cta-note">32 active partners · $48k paid out in Q1 · Reviewed personally in 3–5 business days</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="partners.html">Partners</a>
      <a href="referral.html">Refer a PM</a>
      <a href="mailto:partners@tenantory.com">Partner support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  <!-- Toast -->
  <div class="toast" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toastMsg">Application received — Harrison reviews partner applications personally, expect a reply in 3–5 business days.</span>
  </div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
