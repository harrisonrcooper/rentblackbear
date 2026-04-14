"use client";

// Mock ported verbatim from ~/Desktop/tenantory/referral.html.
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
    input { font-family: inherit; }

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
    .hero { padding: 72px 32px 32px; text-align: center; max-width: 960px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 58px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 860px; margin: 0 auto 18px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 680px; margin: 0 auto 32px; line-height: 1.55;
    }
    .hero-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

    .hero-stats {
      max-width: 860px; margin: 48px auto 0; padding: 0 16px;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    .hero-stat {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 18px; text-align: left;
    }
    .hero-stat-num { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); line-height: 1; margin-bottom: 6px; }
    .hero-stat-num em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero-stat-lbl { font-size: 12.5px; color: var(--text-muted); line-height: 1.4; }

    /* ===== Section shell ===== */
    .section { max-width: 1200px; margin: 88px auto 0; padding: 0 32px; }
    .section-head { text-align: center; margin-bottom: 40px; }
    .section-eyebrow {
      display: inline-block;
      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--pink); margin-bottom: 10px;
    }
    .section-title { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; }
    .section-sub { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 14px auto 0; }

    /* ===== Steps ===== */
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; position: relative; }
    .step {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px 26px;
      position: relative; transition: all 0.2s ease;
    }
    .step:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }
    .step-num {
      position: absolute; top: -14px; left: 26px;
      width: 32px; height: 32px; border-radius: 10px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      color: #fff; font-weight: 800; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 22px rgba(255,73,152,0.3);
    }
    .step-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin: 16px 0 18px;
    }
    .step-icon svg { width: 22px; height: 22px; }
    .step-title { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 8px; }
    .step-desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
    .step-payout {
      margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 12.5px;
    }
    .step-payout span { color: var(--text-muted); }
    .step-payout strong { color: var(--green-dark); font-weight: 800; }

    /* ===== Programs split ===== */
    .programs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .program {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 36px 32px;
      display: flex; flex-direction: column; position: relative;
      transition: all 0.2s ease;
    }
    .program:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .program.featured {
      border: 2px solid var(--pink);
      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);
      box-shadow: 0 20px 60px rgba(255,73,152,0.14);
    }
    .program-ribbon {
      position: absolute; top: -12px; left: 32px;
      background: linear-gradient(135deg, var(--pink), #ff7bb4);
      color: #fff; padding: 6px 14px; border-radius: 100px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      box-shadow: 0 8px 22px rgba(255,73,152,0.4);
    }
    .program-kicker {
      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--text-muted); margin-bottom: 10px;
    }
    .program-name { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .program-tag { font-size: 14px; color: var(--text-muted); margin-bottom: 22px; line-height: 1.5; }

    .math {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
      margin-bottom: 22px;
    }
    .math-row {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 8px 0; font-size: 13.5px; color: var(--text-muted);
    }
    .math-row + .math-row { border-top: 1px solid var(--border); }
    .math-row strong { color: var(--text); font-weight: 700; font-size: 14px; }
    .math-row.total { padding-top: 12px; margin-top: 4px; border-top: 2px solid var(--border-strong); }
    .math-row.total span { font-weight: 700; color: var(--text); font-size: 14px; }
    .math-row.total strong { color: var(--pink); font-size: 18px; font-weight: 900; letter-spacing: -0.01em; }

    .program-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }
    .program-list li {
      list-style: none; display: flex; align-items: flex-start; gap: 10px;
      font-size: 13.5px; color: var(--text); line-height: 1.45;
    }
    .program-list li svg {
      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;
      color: var(--green-dark); padding: 2px;
      background: var(--green-bg); border-radius: 50%;
    }
    .program-cta { margin-top: auto; display: flex; gap: 10px; flex-wrap: wrap; }
    .program-cta .btn { flex: 1; justify-content: center; min-width: 140px; }

    /* ===== Calculator ===== */
    .calc-wrap { max-width: 900px; margin: 88px auto 0; padding: 0 32px; }
    .calc {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 100%);
      color: #fff; border-radius: var(--radius-xl); padding: 44px 44px;
      position: relative; overflow: hidden;
    }
    .calc::before {
      content: ""; position: absolute; top: -80px; right: -80px;
      width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.35), transparent 70%);
    }
    .calc::after {
      content: ""; position: absolute; bottom: -100px; left: -60px;
      width: 280px; height: 280px; border-radius: 50%;
      background: radial-gradient(circle, rgba(22,101,216,0.3), transparent 70%);
    }
    .calc > * { position: relative; z-index: 1; }
    .calc-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pink); margin-bottom: 10px; }
    .calc h3 { font-size: clamp(22px, 3vw, 30px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 28px; line-height: 1.2; }
    .calc h3 em { font-style: normal; color: var(--pink); }
    .calc-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;
    }
    .calc-slider-wrap { }
    .calc-label {
      display: flex; justify-content: space-between; align-items: baseline;
      font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 12px; font-weight: 500;
    }
    .calc-label strong { color: #fff; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; }
    .calc-slider {
      width: 100%; -webkit-appearance: none; appearance: none;
      height: 6px; border-radius: 100px;
      background: rgba(255,255,255,0.15);
      outline: none; cursor: pointer;
    }
    .calc-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--pink); border: 3px solid #fff;
      box-shadow: 0 6px 18px rgba(255,73,152,0.5);
      cursor: pointer;
    }
    .calc-slider::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--pink); border: 3px solid #fff;
      box-shadow: 0 6px 18px rgba(255,73,152,0.5);
      cursor: pointer;
    }
    .calc-ticks {
      display: flex; justify-content: space-between;
      font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 10px;
    }
    .calc-outputs {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-lg); padding: 22px 24px;
      backdrop-filter: blur(8px);
    }
    .calc-out-row {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 13px; color: rgba(255,255,255,0.75);
    }
    .calc-out-row:last-child { border-bottom: none; padding-bottom: 0; }
    .calc-out-row:first-child { padding-top: 0; }
    .calc-out-row strong { color: #fff; font-weight: 800; font-size: 16px; letter-spacing: -0.01em; }
    .calc-out-row.big strong { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: var(--pink); }
    .calc-note { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 18px; line-height: 1.55; }

    /* ===== Dashboard preview ===== */
    .dash-wrap { max-width: 1100px; margin: 88px auto 0; padding: 0 32px; }
    .dash-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    .dash-chrome {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-bottom: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .dash-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }
    .dash-dot:nth-child(1) { background: #ff6b6b; }
    .dash-dot:nth-child(2) { background: var(--gold); }
    .dash-dot:nth-child(3) { background: var(--green); }
    .dash-url {
      margin-left: 12px; padding: 5px 12px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 12px; color: var(--text-muted);
      display: flex; align-items: center; gap: 6px;
    }
    .dash-url svg { width: 11px; height: 11px; color: var(--green-dark); }
    .dash-body { padding: 28px 32px; }
    .dash-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
    }
    .dash-head h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
    .dash-head-sub { font-size: 13px; color: var(--text-muted); }
    .dash-link {
      display: flex; align-items: center; gap: 8px;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      font-size: 13px; font-family: 'SF Mono', 'Monaco', monospace; color: var(--text);
      max-width: 360px; width: 100%;
    }
    .dash-link svg { width: 14px; height: 14px; color: var(--text-muted); flex-shrink: 0; }
    .dash-link-url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dash-link-copy {
      padding: 4px 10px; border-radius: 6px;
      background: var(--blue); color: #fff; font-size: 11px; font-weight: 700;
      letter-spacing: 0.04em; text-transform: uppercase;
    }

    .dash-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .dash-tile {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px 18px;
    }
    .dash-tile-lbl { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
    .dash-tile-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
    .dash-tile-val.green { color: var(--green-dark); }
    .dash-tile-val.pink { color: var(--pink); }

    .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .dash-table thead th {
      text-align: left; padding: 10px 14px;
      background: var(--surface-subtle);
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .dash-table td { padding: 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .dash-table tr:last-child td { border-bottom: none; }
    .dash-table td.right { text-align: right; }
    .dash-name { display: flex; align-items: center; gap: 10px; }
    .dash-ava {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      color: #fff; font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .dash-ava.b { background: linear-gradient(135deg, #1ea97c, #138a60); }
    .dash-ava.c { background: linear-gradient(135deg, #f5a623, #d68a13); }
    .dash-ava.d { background: linear-gradient(135deg, #5a6478, #3d4656); }
    .dash-name-main { font-weight: 600; color: var(--text); }
    .dash-name-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 2px; }
    .dash-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    }
    .dash-pill::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .pill-paid { background: var(--green-bg); color: var(--green-dark); }
    .pill-signed { background: var(--blue-pale); color: var(--blue); }
    .pill-pending { background: rgba(245,166,35,0.15); color: #a06a10; }
    .pill-lost { background: rgba(214,69,69,0.1); color: var(--red); }
    .dash-amt { font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .dash-amt.green { color: var(--green-dark); }
    .dash-amt.muted { color: var(--text-faint); text-decoration: line-through; }

    /* ===== FAQ ===== */
    .faq { max-width: 800px; margin: 88px auto 0; padding: 0 32px; }
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
    .faq-a strong { color: var(--text); }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1200px; margin: 88px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }
    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }

    .signed-link-box {
      max-width: 520px; margin: 24px auto 0;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
      border-radius: var(--radius-lg); padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      backdrop-filter: blur(8px);
    }
    .signed-link-box svg { width: 14px; height: 14px; color: rgba(255,255,255,0.7); flex-shrink: 0; }
    .signed-link-box code { flex: 1; font-size: 13px; font-family: 'SF Mono', monospace; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .signed-link-box button {
      padding: 6px 14px; border-radius: 100px;
      background: #fff; color: var(--navy);
      font-size: 12px; font-weight: 700;
    }
    .signed-link-box button:hover { background: var(--pink); color: #fff; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 24px; }
      .hero-stats { grid-template-columns: 1fr; }
      .section { padding: 0 16px; margin-top: 64px; }
      .steps, .programs { grid-template-columns: 1fr; }
      .calc-wrap { padding: 0 16px; margin-top: 64px; }
      .calc { padding: 32px 24px; }
      .calc-grid { grid-template-columns: 1fr; gap: 28px; }
      .dash-wrap { padding: 0 16px; margin-top: 64px; }
      .dash-body { padding: 20px 16px; }
      .dash-tiles { grid-template-columns: repeat(2, 1fr); }
      .dash-table { font-size: 12px; }
      .dash-table thead { display: none; }
      .dash-table tbody tr { display: block; padding: 12px 0; border-bottom: 1px solid var(--border); }
      .dash-table tbody tr:last-child { border-bottom: none; }
      .dash-table td { display: flex; justify-content: space-between; padding: 6px 4px; border: none; }
      .dash-table td.right { text-align: right; }
      .faq, .cta-bottom { margin-top: 64px; }
      .cta-card { padding: 36px 22px; }
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
      <a class="tb-nav-item active" href="referral.html">Refer &amp; earn</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a class="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3h4v4"/><path d="m21 3-7 7"/><circle cx="7" cy="17" r="4"/></svg>
      Double-sided $99 credit
    </div>
    <h1>Turn your REIA friends into <em>your first check.</em></h1>
    <p class="hero-sub">You already tell your PM buddies about the software that runs your portfolio. Now get paid for it. Refer another property manager to Tenantory Pro — you get a free month, they get a free month. No limit on how many you send.</p>
    <div class="hero-actions">
      <a class="btn btn-pink btn-lg" href="#programs">See the two programs
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a class="btn btn-ghost btn-lg" href="#calc">Calculate my payout</a>
    </div>

    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num"><em>$99</em> each</div>
        <div class="hero-stat-lbl">Credit for you, discount for them. Both sides win on day one.</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num"><em>20%</em> recurring</div>
        <div class="hero-stat-lbl">Affiliate revenue share for creators, coaches &amp; REIA leaders with audiences.</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num"><em>No cap</em></div>
        <div class="hero-stat-lbl">Stack credit on top of your Founder price. Refer ten, pay nothing for a year.</div>
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section class="section" id="how">
    <div class="section-head">
      <div class="section-eyebrow">How it works</div>
      <h2 class="section-title">Three steps. Zero awkward pitching.</h2>
      <p class="section-sub">You're not cold-emailing strangers. You're sending a link to the PM who asked, "wait, what do you use for rent?"</p>
    </div>

    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
        <div class="step-title">Grab your link</div>
        <div class="step-desc">Open your Tenantory admin, click <strong>Refer &amp; earn</strong>. Your unique link is there waiting. Copy it, text it, tweet it — whatever feels natural.</div>
        <div class="step-payout"><span>Takes</span><strong>~20 seconds</strong></div>
      </div>

      <div class="step">
        <div class="step-num">2</div>
        <div class="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </div>
        <div class="step-title">Share with a PM you respect</div>
        <div class="step-desc">The PM at your REIA meeting still wrestling with spreadsheets. The coach with fifty doors. The friend who just inherited a fourplex. One message, one link.</div>
        <div class="step-payout"><span>They get</span><strong>$99 off month one</strong></div>
      </div>

      <div class="step">
        <div class="step-num">3</div>
        <div class="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>
        </div>
        <div class="step-title">They subscribe — you both get paid</div>
        <div class="step-desc">The moment they enter payment info for Tenantory Pro, $99 drops into your account as credit against next month's bill. They've already saved $99 on month one. Nobody lost.</div>
        <div class="step-payout"><span>You get</span><strong>$99 credit</strong></div>
      </div>
    </div>
  </section>

  <!-- Two programs -->
  <section class="section" id="programs">
    <div class="section-head">
      <div class="section-eyebrow">Two programs, same door</div>
      <h2 class="section-title">Pick the one that fits how you actually talk about Tenantory.</h2>
      <p class="section-sub">Sending a link to a friend is different from posting it to your 40,000 YouTube subs. We pay both — differently.</p>
    </div>

    <div class="programs">
      <!-- Customer referral -->
      <div class="program featured">
        <div class="program-ribbon">Most common</div>
        <div class="program-kicker">For active customers</div>
        <div class="program-name">Customer Referral Program</div>
        <div class="program-tag">You pay Tenantory. Now Tenantory pays you. Every referral that signs up for Pro drops $99 in account credit — a free month, straight across.</div>

        <div class="math">
          <div class="math-row"><span>Your monthly credit per referral</span><strong>$99</strong></div>
          <div class="math-row"><span>Their first-month discount</span><strong>$99 off</strong></div>
          <div class="math-row"><span>Referrals per year (avg active customer)</span><strong>2–4</strong></div>
          <div class="math-row total"><span>You save</span><strong>$198 – $396 / yr</strong></div>
        </div>

        <ul class="program-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Unlimited referrals — stack credit indefinitely</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Credit applies to next invoice automatically</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Stacks with the $99 Founder price for life</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>No audience, portfolio, or follower count required</li>
        </ul>

        <div class="program-cta">
          <a class="btn btn-pink" href="onboarding.html">Grab my link
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="#calc">Run the math</a>
        </div>
      </div>

      <!-- Affiliate -->
      <div class="program">
        <div class="program-kicker">For creators &amp; coaches</div>
        <div class="program-name">Affiliate Program</div>
        <div class="program-tag">You've got a channel, a mastermind, a REIA, a newsletter. You send multiple PMs a month. Fine — 20% recurring on every Pro plan, for as long as they pay.</div>

        <div class="math">
          <div class="math-row"><span>Commission per Pro subscription</span><strong>20% / mo</strong></div>
          <div class="math-row"><span>Average Pro plan (Founder price)</span><strong>$99/mo</strong></div>
          <div class="math-row"><span>Average referred lifetime</span><strong>22 months</strong></div>
          <div class="math-row total"><span>Per referral (LTV)</span><strong>~$435</strong></div>
        </div>

        <ul class="program-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>20% recurring commission, paid monthly via Stripe</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Your referred PM still gets $99 off month one</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Custom coupon code, UTM tracking, dedicated landing page</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Light vetting: minimum 3 referrals/qtr or 5K audience</li>
        </ul>

        <div class="program-cta">
          <a class="btn btn-primary" href="mailto:affiliates@tenantory.com?subject=Tenantory%20Affiliate%20Application">Apply to affiliate
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="mailto:affiliates@tenantory.com">Talk to us</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Live calculator -->
  <section class="calc-wrap" id="calc">
    <div class="calc">
      <div class="calc-kicker">Run the numbers</div>
      <h3>If you refer <em id="calcCount">6</em> PMs this year, you pocket <em id="calcPayout">$594</em> in Tenantory credit.</h3>
      <div class="calc-grid">
        <div class="calc-slider-wrap">
          <div class="calc-label">
            <span>Referrals this year</span>
            <strong id="calcCountLbl">6</strong>
          </div>
          <input class="calc-slider" id="calcSlider" type="range" min="0" max="24" value="6">
          <div class="calc-ticks">
            <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
          </div>
        </div>

        <div class="calc-outputs">
          <div class="calc-out-row"><span>Credit earned (customer)</span><strong id="outCredit">$594</strong></div>
          <div class="calc-out-row"><span>Free months on Pro ($99/mo)</span><strong id="outMonths">6 mo</strong></div>
          <div class="calc-out-row"><span>Affiliate LTV equivalent</span><strong id="outAff">~$2,613</strong></div>
          <div class="calc-out-row big"><span>You save</span><strong id="outBig">$594</strong></div>
        </div>
      </div>
      <div class="calc-note">Customer program caps at month-to-month credit — no cashback. Affiliate LTV is indicative based on 20% recurring × ~22 month average lifetime. Past performance of other referrers does not guarantee yours, but it's a decent anchor.</div>
    </div>
  </section>

  <!-- Dashboard preview -->
  <section class="dash-wrap" id="dashboard">
    <div class="section-head">
      <div class="section-eyebrow">Inside the product</div>
      <h2 class="section-title">Your referral dashboard, front and center.</h2>
      <p class="section-sub">See who clicked, who signed up, who paid, and what's owed — same place you manage rent.</p>
    </div>

    <div class="dash-card">
      <div class="dash-chrome">
        <div class="dash-dot"></div><div class="dash-dot"></div><div class="dash-dot"></div>
        <div class="dash-url">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          app.tenantory.com/refer
        </div>
      </div>
      <div class="dash-body">
        <div class="dash-head">
          <div>
            <h3>Your referrals</h3>
            <div class="dash-head-sub">Track clicks, signups, and credit in real time.</div>
          </div>
          <div class="dash-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <div class="dash-link-url">tenantory.com/r/marcus-bh83</div>
            <div class="dash-link-copy">Copy</div>
          </div>
        </div>

        <div class="dash-tiles">
          <div class="dash-tile"><div class="dash-tile-lbl">Clicks</div><div class="dash-tile-val">142</div></div>
          <div class="dash-tile"><div class="dash-tile-lbl">Signups</div><div class="dash-tile-val">11</div></div>
          <div class="dash-tile"><div class="dash-tile-lbl">Paid &amp; credited</div><div class="dash-tile-val green">7</div></div>
          <div class="dash-tile"><div class="dash-tile-lbl">Credit available</div><div class="dash-tile-val pink">$693</div></div>
        </div>

        <table class="dash-table">
          <thead>
            <tr>
              <th>Referral</th>
              <th>Status</th>
              <th>Date</th>
              <th class="right">Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="dash-name">
                  <div class="dash-ava">JR</div>
                  <div><div class="dash-name-main">Jordan Reyes</div><div class="dash-name-sub">Reyes Property Group · 24 doors</div></div>
                </div>
              </td>
              <td><span class="dash-pill pill-paid">Paid</span></td>
              <td>Apr 02, 2026</td>
              <td class="right"><span class="dash-amt green">+$99.00</span></td>
            </tr>
            <tr>
              <td>
                <div class="dash-name">
                  <div class="dash-ava b">SP</div>
                  <div><div class="dash-name-main">Samira Patel</div><div class="dash-name-sub">Cobalt Key Rentals · 9 doors</div></div>
                </div>
              </td>
              <td><span class="dash-pill pill-paid">Paid</span></td>
              <td>Mar 28, 2026</td>
              <td class="right"><span class="dash-amt green">+$99.00</span></td>
            </tr>
            <tr>
              <td>
                <div class="dash-name">
                  <div class="dash-ava c">DH</div>
                  <div><div class="dash-name-main">Derek Holloway</div><div class="dash-name-sub">Holloway &amp; Sons · 41 doors</div></div>
                </div>
              </td>
              <td><span class="dash-pill pill-signed">Signed</span></td>
              <td>Apr 11, 2026</td>
              <td class="right"><span class="dash-amt">Pending $99</span></td>
            </tr>
            <tr>
              <td>
                <div class="dash-name">
                  <div class="dash-ava d">KO</div>
                  <div><div class="dash-name-main">Kimi Okafor</div><div class="dash-name-sub">Okafor Collective · 6 doors</div></div>
                </div>
              </td>
              <td><span class="dash-pill pill-pending">Trial</span></td>
              <td>Apr 13, 2026</td>
              <td class="right"><span class="dash-amt" style="color:var(--text-faint)">On trial — day 2/14</span></td>
            </tr>
            <tr>
              <td>
                <div class="dash-name">
                  <div class="dash-ava">LT</div>
                  <div><div class="dash-name-main">Lucas Tanaka</div><div class="dash-name-sub">North Loop PM · 18 doors</div></div>
                </div>
              </td>
              <td><span class="dash-pill pill-lost">Didn't convert</span></td>
              <td>Feb 19, 2026</td>
              <td class="right"><span class="dash-amt muted">$99.00</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq">
    <div class="section-head">
      <div class="section-eyebrow">Questions</div>
      <h2 class="section-title">Everything you were about to ask.</h2>
    </div>

    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">How do I get my referral link?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Sign in to Tenantory, open <strong>Refer &amp; earn</strong> from the sidebar. Your link is pre-generated — it looks like <strong>tenantory.com/r/your-handle</strong>. You can also grab a short social-ready version, a QR code for in-person REIA meetings, and email copy we've already written.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">When does the $99 credit actually hit?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">The moment your referred PM <strong>completes their first paid invoice</strong> on Tenantory Pro (usually right after the 14-day trial ends), $99 drops onto your account as credit against the next invoice. No waiting on clearing periods, no "qualification window." If you're already on Pro, it's a free month. If you refer 12 in a year, Tenantory costs you $0 that year.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">What if they cancel after a month? Do I lose the credit?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Customer referrals: <strong>no clawback</strong>. The credit is yours once they pay invoice one. For the Affiliate Program, commissions are paid monthly and naturally stop when the referred account churns — the lifetime earnings are just whatever the account lasted.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">Can I refer myself, a second LLC, or my cousin?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Self-referral (same payment method, same tax ID, same billing address) is blocked automatically. A separate LLC with separate billing, separate bank account, and a real PM operating it is fair game — that's a real customer, not a workaround. Your cousin is welcome, obviously.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">Tax implications — do I get a 1099?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Customer Referral credit is a <strong>discount against your invoice</strong>, not income — no 1099, no reporting needed. Affiliate commissions are cash payouts; we issue a <strong>1099-NEC</strong> if you cross $600 in a calendar year. Standard stuff. We're PMs, not CPAs — ask yours.</div>
      </div>

      <div class="faq-item">
        <button class="faq-q">How do I qualify for the affiliate program?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">We approve affiliates who either (a) have an audience of <strong>5,000+ real estate investors / PMs</strong> on any platform, or (b) run a REIA, mastermind, or coaching cohort, or (c) deliver <strong>3+ paid referrals per quarter</strong> via the customer program — at which point we upgrade you automatically. Email <strong>affiliates@tenantory.com</strong> with a quick intro; we reply inside 48 hours.</div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2 id="ctaHead">Your link is one click away.</h2>
      <p id="ctaCopy">Sign in, grab your link, send it to the PM at your next REIA meeting. That's the whole playbook.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" id="ctaPrimary" href="onboarding.html">Sign up to unlock referrals
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
      <div id="signedLinkBox" class="signed-link-box" style="display:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <code id="signedLinkUrl">tenantory.com/r/your-handle</code>
        <button id="copyBtn">Copy link</button>
      </div>
      <div class="cta-note">No cap on referrals. Double-sided reward. Credit applies automatically.</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="referral.html">Refer &amp; earn</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
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
