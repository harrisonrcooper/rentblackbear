"use client";

// Mock ported verbatim from ~/Desktop/tenantory/vs-doorloop.html.
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
    .hero { padding: 72px 32px 48px; text-align: center; max-width: 1080px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--blue-pale); color: var(--blue);
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5vw, 58px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      max-width: 940px; margin: 0 auto 20px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 720px; margin: 0 auto 34px; line-height: 1.55;
    }
    .hero-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
    .hero-trust {
      display: inline-flex; align-items: center; gap: 14px;
      font-size: 13px; color: var(--text-muted);
    }
    .hero-trust svg { width: 14px; height: 14px; color: var(--green-dark); }
    .hero-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }

    /* ===== Logos matchup ===== */
    .matchup {
      max-width: 700px; margin: 44px auto 0; padding: 0 32px;
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;
    }
    .matchup-side {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 22px;
      text-align: center;
    }
    .matchup-side.them { opacity: 0.82; }
    .matchup-side.us {
      border: 2px solid var(--pink);
      box-shadow: 0 14px 40px rgba(255,73,152,0.14);
    }
    .matchup-logo { font-weight: 900; font-size: 20px; letter-spacing: -0.02em; margin-bottom: 4px; color: var(--text); }
    .matchup-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .matchup-side.us .matchup-sub { color: var(--pink); font-weight: 700; }
    .matchup-vs {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--text); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; letter-spacing: 0.06em;
    }

    /* ===== Sections ===== */
    .section { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }
    .section-head { text-align: center; margin-bottom: 48px; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }
    .section-head h2 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }

    /* ===== Credit (what they get right) ===== */
    .credit-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    }
    .credit-card {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 26px 24px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .credit-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--green-bg); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
    }
    .credit-icon svg { width: 20px; height: 20px; }
    .credit-card h3 { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; line-height: 1.3; }
    .credit-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

    /* ===== Reasons grid ===== */
    .reasons {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    }
    .reason-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 26px 24px;
      transition: all 0.2s ease; position: relative;
      display: flex; flex-direction: column;
    }
    .reason-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }
    .reason-index {
      position: absolute; top: 20px; right: 22px;
      font-size: 11px; font-weight: 800; color: var(--text-faint); letter-spacing: 0.1em;
    }
    .reason-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--blue-pale); color: var(--blue);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .reason-icon svg { width: 20px; height: 20px; }
    .reason-card.hot .reason-icon { background: var(--pink-bg); color: var(--pink); }
    .reason-card h3 {
      font-size: 16px; font-weight: 800; letter-spacing: -0.01em;
      margin-bottom: 8px; line-height: 1.3;
    }
    .reason-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; }
    .reason-card .reason-contrast {
      display: flex; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);
      font-size: 12px;
    }
    .reason-contrast-col { flex: 1; }
    .reason-contrast-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
    .reason-contrast-col.them .reason-contrast-label { color: var(--text-faint); }
    .reason-contrast-col.us .reason-contrast-label { color: var(--green-dark); }
    .reason-contrast-val { font-weight: 700; color: var(--text); font-size: 13px; }
    .reason-contrast-col.them .reason-contrast-val { color: var(--text-muted); text-decoration: line-through; text-decoration-color: var(--border-strong); }

    /* ===== Price ladder ===== */
    .ladder-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }
    .ladder {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .ladder-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .ladder-table thead th {
      padding: 22px 16px; text-align: center;
      font-weight: 800; font-size: 15px; color: var(--text);
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
      vertical-align: middle;
    }
    .ladder-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .ladder-table thead th.them { color: var(--text-muted); }
    .ladder-table thead th.us {
      background: linear-gradient(180deg, var(--pink-bg), transparent);
      color: var(--pink);
    }
    .ladder-table thead th.save { color: var(--green-dark); background: var(--green-bg); }
    .ladder-table thead th .col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .ladder-table thead th.us .col-sub { color: #c21a6a; }
    .ladder-table thead th.save .col-sub { color: var(--green-dark); opacity: 0.8; }
    .ladder-table tbody td {
      padding: 18px 16px; border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle;
    }
    .ladder-table tbody td:first-child { text-align: left; }
    .ladder-table tbody tr:last-child td { border-bottom: none; }
    .ladder-table tbody tr.highlight td { background: linear-gradient(180deg, rgba(255,73,152,0.04), transparent); }
    .ladder-port { font-weight: 800; font-size: 15px; color: var(--text); }
    .ladder-port small { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .ladder-price { font-weight: 700; font-size: 16px; color: var(--text-muted); }
    .ladder-price small { display: block; font-weight: 500; font-size: 11px; color: var(--text-faint); margin-top: 2px; }
    .ladder-us { font-weight: 900; font-size: 18px; color: var(--pink); }
    .ladder-us small { display: block; font-weight: 500; font-size: 11px; color: var(--text-faint); margin-top: 2px; }
    .ladder-save { font-weight: 900; font-size: 16px; color: var(--green-dark); }
    .ladder-save small { display: block; font-weight: 600; font-size: 11px; color: var(--green-dark); margin-top: 2px; opacity: 0.8; }
    .ladder-foot {
      font-size: 12px; color: var(--text-faint); padding: 14px 20px;
      background: var(--surface-subtle); border-top: 1px solid var(--border);
      text-align: center; line-height: 1.55;
    }

    /* ===== Compare table ===== */
    .compare-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }
    .compare {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .compare-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .compare-table thead th {
      padding: 22px 16px; text-align: center;
      font-weight: 800; font-size: 15px; color: var(--text);
      border-bottom: 1px solid var(--border); background: var(--surface-subtle);
      vertical-align: middle;
    }
    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .compare-table thead th.featured {
      background: linear-gradient(180deg, var(--pink-bg), transparent);
      color: var(--pink);
    }
    .compare-table thead th.dim { color: var(--text-muted); }
    .compare-table thead th .compare-col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .compare-table thead th.featured .compare-col-sub { color: #c21a6a; }

    .compare-table tbody tr:nth-child(odd) td { background: var(--surface-subtle); }
    .compare-table tbody tr.group-head td {
      background: var(--surface) !important;
      padding-top: 24px !important; padding-bottom: 10px !important;
      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
      border-top: 1px solid var(--border);
    }
    .compare-table tbody tr.group-head:first-child td { border-top: none; padding-top: 16px !important; }
    .compare-table td {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .compare-table td:first-child { color: var(--text); font-weight: 500; }
    .compare-table td:not(:first-child) { text-align: center; }
    .compare-table tbody tr:last-child td { border-bottom: none; }
    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }
    .cmp-no svg { width: 18px; height: 18px; color: var(--text-faint); margin: 0 auto; padding: 2px; background: var(--surface-alt); border-radius: 50%; }
    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }
    .cmp-val-dim { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .cmp-val-strong { font-size: 14px; font-weight: 800; color: var(--pink); }

    /* ===== Migration callout ===== */
    .migrate-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }
    .migrate-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 44px 48px;
      display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
      box-shadow: var(--shadow);
    }
    .migrate-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--green-bg); color: var(--green-dark);
      padding: 5px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 16px;
    }
    .migrate-eyebrow svg { width: 12px; height: 12px; }
    .migrate-card h3 {
      font-size: clamp(24px, 3vw, 32px); font-weight: 800; letter-spacing: -0.025em;
      margin-bottom: 14px; line-height: 1.15;
    }
    .migrate-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 22px; }
    .migrate-card p strong { color: var(--text); font-weight: 700; }
    .migrate-cta { display: flex; gap: 10px; flex-wrap: wrap; }

    .migrate-steps { display: flex; flex-direction: column; gap: 14px; }
    .migrate-step {
      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 18px;
    }
    .migrate-step-num {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px;
      box-shadow: 0 6px 18px rgba(18,81,173,0.25);
    }
    .migrate-step-text { font-size: 14px; color: var(--text); font-weight: 600; }
    .migrate-step-text small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }
    .migrate-step-clock {
      font-size: 11px; color: var(--text-muted); font-weight: 700;
      background: var(--surface); border: 1px solid var(--border);
      padding: 4px 9px; border-radius: 100px; white-space: nowrap;
    }

    /* ===== Testimonials ===== */
    .testi-wrap { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }
    .testi-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    }
    .testi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 30px 30px 26px;
      display: flex; flex-direction: column;
      box-shadow: var(--shadow-sm);
    }
    .testi-card:nth-child(2) { background: linear-gradient(180deg, var(--surface) 0%, var(--blue-softer) 100%); }
    .testi-card:nth-child(3) { background: linear-gradient(180deg, var(--surface) 0%, rgba(255,73,152,0.04) 100%); }
    .testi-quote-mark {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--pink-bg); color: var(--pink);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .testi-quote-mark svg { width: 16px; height: 16px; }
    .testi-quote {
      font-size: 17px; line-height: 1.55; color: var(--text); font-weight: 500;
      letter-spacing: -0.005em; margin-bottom: 22px; flex: 1;
    }
    .testi-quote strong { background: var(--pink-bg); color: #c21a6a; padding: 1px 5px; border-radius: 4px; font-weight: 700; }
    .testi-person { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--border); }
    .testi-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--blue-bright));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px; letter-spacing: 0.02em;
      flex-shrink: 0;
    }
    .testi-card:nth-child(2) .testi-avatar { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }
    .testi-card:nth-child(3) .testi-avatar { background: linear-gradient(135deg, var(--pink), var(--gold)); }
    .testi-card:nth-child(4) .testi-avatar { background: linear-gradient(135deg, var(--green-dark), var(--blue)); }
    .testi-name { font-weight: 700; font-size: 14px; color: var(--text); }
    .testi-role { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
    .testi-switched {
      margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
      background: var(--green-bg); color: var(--green-dark);
      font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;
      letter-spacing: 0.02em;
    }
    .testi-switched svg { width: 10px; height: 10px; }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 60px 52px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 440px; height: 440px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card::after {
      content: ""; position: absolute; bottom: -50%; right: -10%;
      width: 420px; height: 420px; border-radius: 50%;
      background: radial-gradient(circle, rgba(22,101,216,0.35), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.12); color: #fff;
      padding: 5px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .cta-eyebrow svg { width: 12px; height: 12px; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }
    .cta-card p { font-size: 17px; color: rgba(255,255,255,0.85); max-width: 640px; margin: 0 auto 30px; line-height: 1.55; }
    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .cta-note-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.4); }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 960px) {
      .credit-grid { grid-template-columns: repeat(2, 1fr); }
      .reasons { grid-template-columns: repeat(2, 1fr); }
      .migrate-card { grid-template-columns: 1fr; gap: 32px; padding: 32px 28px; }
      .testi-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .section, .compare-wrap, .migrate-wrap, .testi-wrap, .cta-bottom, .ladder-wrap { padding-left: 16px; padding-right: 16px; }
      .credit-grid { grid-template-columns: 1fr; }
      .reasons { grid-template-columns: 1fr; }
      .matchup { grid-template-columns: 1fr auto 1fr; padding: 0 16px; }
      .compare, .ladder { overflow-x: auto; }
      .compare-table, .ladder-table { min-width: 560px; }
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
      <a class="tb-nav-item active" href="vs-doorloop.html">vs DoorLoop</a>
      <a class="tb-nav-item" href="portal.html" target="_blank">Tenant view</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      DoorLoop vs Tenantory &middot; honest comparison
    </div>
    <h1>DoorLoop built a modern PM tool. We built one that actually <em>looks like yours</em>.</h1>
    <p class="hero-sub">DoorLoop is a solid product &mdash; fair pricing, clean UI, real accounting. Credit where it's due. But your applicants still land on <em>yourco.doorloop.com</em> with DoorLoop's colors, DoorLoop's logo, and DoorLoop's name in every email. Tenantory is the same price as DoorLoop Pro ($99/mo), built for the same 1&ndash;100 unit operator, with your brand stitched through every surface your tenant sees.</p>
    <div class="hero-cta-row">
      <a class="btn btn-pink btn-lg" href="onboarding.html">
        Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a class="btn btn-ghost btn-lg" href="#compare">See full comparison</a>
    </div>
    <div class="hero-trust">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>No credit card</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Free migration from DoorLoop</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Live in 3 days</span>
    </div>

    <div class="matchup">
      <div class="matchup-side them">
        <div class="matchup-logo">DoorLoop</div>
        <div class="matchup-sub">Modern PM, generic portal &middot; $99/mo Pro</div>
      </div>
      <div class="matchup-vs">VS</div>
      <div class="matchup-side us">
        <div class="matchup-logo">Tenantory</div>
        <div class="matchup-sub">Same price. Your brand. $99/mo for life</div>
      </div>
    </div>
  </section>

  <!-- What DoorLoop gets right -->
  <section class="section" id="credit">
    <div class="section-head">
      <div class="section-kicker">Fair is fair</div>
      <h2>What DoorLoop <em>gets right</em>.</h2>
      <p>We're not here to trash a respectable competitor. If you're on DoorLoop today, you're on something meaningfully better than Buildium or AppFolio. Here's where their team has earned the good reviews.</p>
    </div>
    <div class="credit-grid">

      <div class="credit-card">
        <div class="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <h3>Genuinely modern UI</h3>
        <p>Compared to the AppFolio/Buildium generation, DoorLoop actually looks like it was built in the last five years. Onboarding chat works. The dashboard doesn't feel like a SharePoint site. That's real, and it's why PMs switch <em>to</em> them from older tools.</p>
      </div>

      <div class="credit-card">
        <div class="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3>Fair pricing up to 50 units</h3>
        <p>$59 Starter and $99 Pro are honest numbers for a full-stack PM platform. Compared to AppFolio's $280/mo floor, DoorLoop is the first vendor that respects a 20-unit operator. That positioning is well-earned.</p>
      </div>

      <div class="credit-card">
        <div class="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="13" y2="18"/></svg>
        </div>
        <h3>Solid accounting backbone</h3>
        <p>Double-entry ledger, bank reconciliation, decent P&amp;L reports. CPAs don't hate it. If your priority is "replace QuickBooks and have something that won't embarrass you at tax time," DoorLoop's Pro tier delivers.</p>
      </div>

    </div>
  </section>

  <!-- Where Tenantory pulls ahead -->
  <section class="section" id="reasons">
    <div class="section-head">
      <div class="section-kicker">Where we pull ahead</div>
      <h2>6 places Tenantory goes <em>further</em>.</h2>
      <p>Same price bracket, same 1&ndash;100 unit target. These are the differences PMs feel in week one.</p>
    </div>

    <div class="reasons">

      <div class="reason-card hot">
        <div class="reason-index">01</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3>Branded subdomain at Pro &mdash; not Enterprise</h3>
        <p>DoorLoop's tenant portal lives under a DoorLoop-branded URL on every plan under $499/mo. Tenantory gives you <em>yourco.tenantory.com</em> at Pro ($99), a full custom domain on Scale ($299). Your tenants pay rent to <strong>your</strong> company, not to ours.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop</div>
            <div class="reason-contrast-val">Generic portal</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Your subdomain</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">02</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 3v6"/><path d="M15 3v6"/><path d="M9 15v6"/><path d="M15 15v6"/></svg>
        </div>
        <h3>AI application scoring, not just a credit report</h3>
        <p>DoorLoop screening returns TransUnion credit and a background check. Useful &mdash; but it still leaves <em>you</em> to eyeball income, employment history, and red flags. Tenantory scores every applicant across 7 signals (income ratio, employment stability, prior evictions, app completeness, pet/smoker, duplicate detection) and surfaces the red flag before you open the file.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop</div>
            <div class="reason-contrast-val">Credit + background</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">7-signal AI score</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">03</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 4v4"/><path d="M16 4v4"/><path d="M7 14h2"/><path d="M11 14h2"/><path d="M15 14h2"/></svg>
        </div>
        <h3>Native co-living / rent-by-the-bedroom</h3>
        <p>DoorLoop models a unit as a unit. If you run co-living, student housing, or by-the-room rentals, you end up faking sub-units and hating your chart of accounts. Tenantory has room-level leases inside one property &mdash; separate rent, separate lease dates, separate ledgers, one roof.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop</div>
            <div class="reason-contrast-val">Unit-level only</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Native room leases</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">04</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3>15-minute onboarding, no scheduled call</h3>
        <p>DoorLoop's "free onboarding" is a scheduled 60-minute call, usually 3&ndash;5 business days out, then data entry on your end. Tenantory is a 6-step wizard you finish in ~15 minutes. The only non-skippable field is your workspace name. Real units can be bulk-imported after, or during your trial.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop</div>
            <div class="reason-contrast-val">Scheduled call, days out</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">15 min, self-serve</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">05</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3>Native investor portal + owner statements</h3>
        <p>If you manage units for partners or outside investors, DoorLoop makes you DIY the monthly report &mdash; export-to-Excel, paste into a template, email it out. Tenantory auto-generates a branded monthly owner statement (rent collected, expenses, NOI, reserves) as a shareable PDF with a login portal each investor can check themselves.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop</div>
            <div class="reason-contrast-val">Manual Excel build</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Native investor portal</div>
          </div>
        </div>
      </div>

      <div class="reason-card hot">
        <div class="reason-index">06</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3>Starter plan that's actually usable</h3>
        <p>DoorLoop Starter ($59/mo, 20 units) has no e-sign, no accounting, no owner portal &mdash; it's a lead-funnel for Pro. Tenantory Starter ($39/mo, 5 units) ships lease e-sign, the income/expense ledger, and full tenant portal from day one. Small portfolios deserve a real product, not a demo.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">DoorLoop Starter</div>
            <div class="reason-contrast-val">No e-sign, no books</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory Starter</div>
            <div class="reason-contrast-val">E-sign + accounting</div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Price ladder -->
  <section class="ladder-wrap" id="ladder">
    <div class="section-head">
      <div class="section-kicker">The real math</div>
      <h2>What you'll actually pay as you <em>add doors</em>.</h2>
      <p>Using DoorLoop's published pricing (Starter $59, Pro $99 up to 50 units, then ~$2/door after) against Tenantory Pro flat $99/mo up to 50, Scale flat $299/mo beyond. Both include the usual must-haves.</p>
    </div>
    <div class="ladder">
      <table class="ladder-table">
        <thead>
          <tr>
            <th>Portfolio size</th>
            <th class="them">DoorLoop<span class="col-sub">Published tier + per-unit</span></th>
            <th class="us">Tenantory<span class="col-sub">Flat, for life</span></th>
            <th class="save">Difference<span class="col-sub">Per year</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ladder-port">5 units<small>Small LLC / side-portfolio</small></td>
            <td class="ladder-price">$59/mo<small>DoorLoop Starter (thin features)</small></td>
            <td class="ladder-us">$39/mo<small>Tenantory Starter (full leasing)</small></td>
            <td class="ladder-save">$240<small>Tenantory cheaper &mdash; and has e-sign</small></td>
          </tr>
          <tr class="highlight">
            <td class="ladder-port">20 units<small>DoorLoop Starter ceiling</small></td>
            <td class="ladder-price">$99/mo<small>Bumped to DoorLoop Pro</small></td>
            <td class="ladder-us">$99/mo<small>Tenantory Pro</small></td>
            <td class="ladder-save">Even<small>Same price &mdash; branded subdomain wins</small></td>
          </tr>
          <tr>
            <td class="ladder-port">50 units<small>Typical independent PM</small></td>
            <td class="ladder-price">$99/mo<small>DoorLoop Pro ceiling</small></td>
            <td class="ladder-us">$99/mo<small>Still Tenantory Pro</small></td>
            <td class="ladder-save">Even<small>Still same &mdash; branding + AI tilt it</small></td>
          </tr>
          <tr class="highlight">
            <td class="ladder-port">75 units<small>DoorLoop per-unit kicks in</small></td>
            <td class="ladder-price">$249/mo<small>Pro + ~$2/door over 50</small></td>
            <td class="ladder-us">$299/mo<small>Tenantory Scale (custom domain)</small></td>
            <td class="ladder-save">-$600<small>DoorLoop still slightly cheaper here</small></td>
          </tr>
          <tr>
            <td class="ladder-port">100 units<small>Bigger independent op</small></td>
            <td class="ladder-price">$299/mo<small>Pro + per-door add-ons</small></td>
            <td class="ladder-us">$299/mo<small>Tenantory Scale flat</small></td>
            <td class="ladder-save">Even<small>Plus your own rentyourname.com</small></td>
          </tr>
        </tbody>
      </table>
      <div class="ladder-foot">DoorLoop per-unit rates sourced from their public pricing page (varies $1.50&ndash;$2.50/door above 50 depending on negotiation). Add-ons like custom domain, investor portal, and advanced screening are baked into Tenantory Pro and Scale &mdash; DoorLoop treats them as upsells.</div>
    </div>
  </section>

  <!-- Comparison table -->
  <section class="compare-wrap" id="compare">
    <div class="section-head">
      <div class="section-kicker">Head-to-head</div>
      <h2>The full comparison, line by line.</h2>
      <p>We tried to be fair. Where DoorLoop wins (mobile app polish, mature support team, Quickbooks integration depth) we say so. Everywhere else, the delta is real.</p>
    </div>
    <div class="compare">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="dim">DoorLoop<span class="compare-col-sub">Pro &middot; $99/mo</span></th>
            <th class="featured">Tenantory<span class="compare-col-sub">Pro &middot; $99/mo for life</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-head"><td colspan="3">Pricing &amp; commitment</td></tr>
          <tr><td>Pro plan price</td><td><span class="cmp-val-dim">$99/mo</span></td><td><span class="cmp-val-strong">$99/mo for life</span></td></tr>
          <tr><td>Unit ceiling on Pro</td><td><span class="cmp-val-dim">50 units</span></td><td><span class="cmp-val">50 units</span></td></tr>
          <tr><td>Per-unit fee above ceiling</td><td><span class="cmp-val-dim">~$1.50&ndash;$2.50/door</span></td><td><span class="cmp-val">None (flat Scale $299)</span></td></tr>
          <tr><td>Setup / onboarding fee</td><td><span class="cmp-val">$0</span></td><td><span class="cmp-val">$0</span></td></tr>
          <tr><td>Month-to-month</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Free trial without a card</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>10-hour money-back guarantee</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Your brand</td></tr>
          <tr><td>Branded subdomain on Pro</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Full custom domain + SSL</td><td><span class="cmp-val-dim">Premium tier ($199+)</span></td><td><span class="cmp-val">Scale tier ($299)</span></td></tr>
          <tr><td>Tenant portal color &amp; logo</td><td><span class="cmp-val-dim">Logo only</span></td><td><span class="cmp-val">Logo + accent + email</span></td></tr>
          <tr><td>"Powered by" removal</td><td><span class="cmp-val-dim">Premium tier</span></td><td><span class="cmp-val">Scale tier</span></td></tr>
          <tr><td>Branded application page</td><td><span class="cmp-val-dim">DoorLoop-branded</span></td><td><span class="cmp-val">Your subdomain</span></td></tr>

          <tr class="group-head"><td colspan="3">Applications &amp; leasing</td></tr>
          <tr><td>Online rental application</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>AI application scoring</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Duplicate applicant detection</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Credit + background check</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Lease e-sign (Pro)</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Lease e-sign (Starter)</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Room-level / co-living leases</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Rent &amp; accounting</td></tr>
          <tr><td>ACH rent collection</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Double-entry ledger</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Accounting on Starter plan</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Schedule-E tax export</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Built-in 1099-NEC e-file</td><td><span class="cmp-val-dim">Via 3rd-party</span></td><td><span class="cmp-val">Native e-file</span></td></tr>
          <tr><td>A/R aging report</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Portals &amp; workflow</td></tr>
          <tr><td>Tenant portal</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Native investor / owner portal</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Auto monthly owner statements</td><td><span class="cmp-val-dim">Manual Excel</span></td><td><span class="cmp-val">Branded PDF</span></td></tr>
          <tr><td>Maintenance ticketing</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Onboarding &amp; support</td></tr>
          <tr><td>Time to first value</td><td><span class="cmp-val-dim">2&ndash;5 days (scheduled call)</span></td><td><span class="cmp-val-strong">15 minutes</span></td></tr>
          <tr><td>Free data migration</td><td><span class="cmp-val">Included</span></td><td><span class="cmp-val">Free, 3 days</span></td></tr>
          <tr><td>Self-serve trial (no call)</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Direct support (no ticket queue)</td><td><span class="cmp-val-dim">Ticketed chat</span></td><td><span class="cmp-val">Founder email, 24h</span></td></tr>

          <tr class="group-head"><td colspan="3">Where DoorLoop still wins</td></tr>
          <tr><td>Polished native mobile apps (iOS/Android)</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">PWA, native in Q3</span></td></tr>
          <tr><td>Years of G2 reviews</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Newer product</span></td></tr>
          <tr><td>QuickBooks 2-way sync</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Export only</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Migration callout -->
  <section class="migrate-wrap" id="migrate">
    <div class="migrate-card">
      <div>
        <div class="migrate-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Free of charge &middot; done for you
        </div>
        <h3>Migrating from DoorLoop in 3 days.</h3>
        <p>DoorLoop lets you export clean CSVs from Settings &rarr; Data Export &mdash; that's the single biggest gift when switching. We walk you through three exports (properties + units, tenants + leases, transaction ledger), ingest them, reconcile every balance against your DoorLoop numbers, and go live on day 3. <strong>You keep using DoorLoop until we say cut over.</strong> No double-entry, no downtime, no data loss.</p>
        <p><strong>What's preserved:</strong> property &amp; unit structure, tenant contacts, active lease terms and rent amounts, outstanding balances, last 24 months of transactions, uploaded documents. <strong>What's better:</strong> rent-by-room structure if you need it, your branded subdomain, AI-scored historical applicants.</p>
        <div class="migrate-cta">
          <a class="btn btn-pink" href="mailto:migrate@tenantory.com?subject=DoorLoop%20migration">
            Start my 3-day switch
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="onboarding.html">Or start a trial first</a>
        </div>
      </div>
      <div class="migrate-steps">
        <div class="migrate-step">
          <div class="migrate-step-num">1</div>
          <div class="migrate-step-text">Export 3 CSVs from DoorLoop<small>We send the exact click-path. 10 minutes.</small></div>
          <div class="migrate-step-clock">Day 1 AM</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">2</div>
          <div class="migrate-step-text">We ingest &amp; rebuild your workspace<small>Properties, tenants, leases, balances, documents.</small></div>
          <div class="migrate-step-clock">Day 1 PM</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">3</div>
          <div class="migrate-step-text">You review reconciliation<small>Side-by-side balances vs your DoorLoop numbers.</small></div>
          <div class="migrate-step-clock">Day 2</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">4</div>
          <div class="migrate-step-text">Tenants get a branded welcome email<small>Your logo, your subdomain, seamless handoff.</small></div>
          <div class="migrate-step-clock">Day 3</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">5</div>
          <div class="migrate-step-text">Go live on Tenantory<small>Cancel DoorLoop when you're ready. No rush.</small></div>
          <div class="migrate-step-clock">Done</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testi-wrap">
    <div class="section-head">
      <div class="section-kicker">Switch stories</div>
      <h2>From PMs who moved off DoorLoop.</h2>
      <p>Four real operators, 8 to 55 units, who switched from DoorLoop in the last six months. Their reasons are specific, not vibes.</p>
    </div>

    <div class="testi-grid">

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"DoorLoop was fine. Good product. The thing that killed it for me was that my applicants were typing <strong>app.doorloop.com</strong> into their browser to pay rent. I'm a 12-year local brand in Huntsville &mdash; my tenants don't know what DoorLoop is and they shouldn't have to. Switched to Tenantory, same $99, my logo everywhere. Felt overdue."</p>
        <div class="testi-person">
          <div class="testi-avatar">KS</div>
          <div>
            <div class="testi-name">Kyle S.</div>
            <div class="testi-role">Southbluff Rentals &middot; 19 units &middot; Huntsville, AL</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Dec '25
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"We started on DoorLoop Starter because we had 8 units and it was $59. Found out real quick that e-sign was gated to Pro, which meant I was still pushing leases through HelloSign on the side. Then tenant screening was an add-on. Then owner statements weren't included. By the time we added everything we needed we were at <strong>$150/mo</strong>. Tenantory Starter is $39 and ships with all of it."</p>
        <div class="testi-person">
          <div class="testi-avatar">RP</div>
          <div>
            <div class="testi-name">Rachel P.</div>
            <div class="testi-role">Oakline Property Co &middot; 8 units &middot; Franklin, TN</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Feb '26
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"I run four co-living houses &mdash; 22 bedrooms across 4 addresses. DoorLoop forced me to either treat each house as 1 unit (wrong ledgers) or as 6 fake sub-units (ugly URL structure for the tenants). Tenantory has <strong>room-level leases natively</strong>. Migrated the ledger myself in an afternoon with their CSV template. Four hours on a Saturday and I was live."</p>
        <div class="testi-person">
          <div class="testi-avatar">MO</div>
          <div>
            <div class="testi-name">Miguel O.</div>
            <div class="testi-role">Westbound Co-Living &middot; 22 tenants &middot; Atlanta, GA</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Jan '26
          </div>
        </div>
      </div>

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"I manage 55 units for 6 different investors. Every month on DoorLoop I was exporting P&amp;Ls, pasting into a template, emailing each investor a PDF. 4 hours, every month. Tenantory has a <strong>native investor portal</strong> &mdash; each owner logs in, sees their own properties, downloads their own statement. That one feature was worth the switch by itself. AI app scoring was the bonus."</p>
        <div class="testi-person">
          <div class="testi-avatar">HW</div>
          <div>
            <div class="testi-name">Holly W.</div>
            <div class="testi-role">Ridgemont Asset Mgmt &middot; 55 units &middot; Nashville, TN</div>
          </div>
          <div class="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Switched Mar '26
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <div class="cta-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        87 Founders' spots left
      </div>
      <h2>Same $99. Your brand instead of ours.</h2>
      <p>We handle the DoorLoop CSV migration, reconcile every balance, and go live in 3 days. If Tenantory doesn't save you 10 hours in the first 30 paid days, we refund every dollar and wire you $100 for the inconvenience.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start my 14-day trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="mailto:migrate@tenantory.com?subject=DoorLoop%20migration">
          Talk to a migration specialist
        </a>
      </div>
      <div class="cta-note">
        <span>No credit card required</span>
        <span class="cta-note-dot"></span>
        <span>Cancel anytime</span>
        <span class="cta-note-dot"></span>
        <span>Free DoorLoop migration</span>
        <span class="cta-note-dot"></span>
        <span>$99/mo locked for life</span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="vs-appfolio.html">vs AppFolio</a>
      <a href="vs-buildium.html">vs Buildium</a>
      <a href="vs-doorloop.html">vs DoorLoop</a>
      <a href="portal.html">Tenant view</a>
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
