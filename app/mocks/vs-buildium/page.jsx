"use client";

// Mock ported verbatim from ~/Desktop/tenantory/vs-buildium.html.
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
      border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-sm);
    }
    .ladder-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .ladder-table thead th {
      padding: 22px 18px; text-align: center;
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
      padding: 18px 18px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: center;
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
      padding: 16px 22px; font-size: 12px; color: var(--text-muted); text-align: center;
      background: var(--surface-subtle); border-top: 1px solid var(--border);
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

    /* ===== Preserved chips ===== */
    .preserve {
      margin-top: 22px; padding-top: 22px; border-top: 1px dashed var(--border);
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .preserve-label { width: 100%; font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .preserve-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--green-bg); color: var(--green-dark);
      padding: 6px 11px; border-radius: 100px;
      font-size: 12px; font-weight: 700;
    }
    .preserve-chip svg { width: 11px; height: 11px; }

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
      .reasons { grid-template-columns: repeat(2, 1fr); }
      .migrate-card { grid-template-columns: 1fr; gap: 32px; padding: 32px 28px; }
      .testi-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 32px; }
      .section, .compare-wrap, .migrate-wrap, .testi-wrap, .cta-bottom, .ladder-wrap { padding-left: 16px; padding-right: 16px; }
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
      <a class="tb-nav-item" href="vs-appfolio.html">vs AppFolio</a>
      <a class="tb-nav-item active" href="vs-buildium.html">vs Buildium</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Buildium vs Tenantory · the real math
    </div>
    <h1>Buildium's pricing <em>punishes you for growing</em>. Tenantory is flat for life.</h1>
    <p class="hero-sub">Buildium starts at $58/mo for 20 units, then jumps to $166/mo the second you sign tenant #21, plus per-unit fees on every door after. You get punished for doing your job. Tenantory is <strong style="color:var(--text);font-weight:700;">$99/mo flat for up to 50 doors</strong>, your brand on every tenant surface, migrated in 3 days.</p>
    <div class="hero-cta-row">
      <a class="btn btn-pink btn-lg" href="onboarding.html">
        Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a class="btn btn-ghost btn-lg" href="#ladder">See the price ladder</a>
    </div>
    <div class="hero-trust">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>No credit card</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Free 3-day migration</span>
      <span class="hero-trust-dot"></span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>$99/mo for life · Founder lock</span>
    </div>

    <div class="matchup">
      <div class="matchup-side them">
        <div class="matchup-logo">Buildium</div>
        <div class="matchup-sub">Owned by RealPage · per-unit pricing</div>
      </div>
      <div class="matchup-vs">VS</div>
      <div class="matchup-side us">
        <div class="matchup-logo">Tenantory</div>
        <div class="matchup-sub">Built for 1–50 units · $99/mo for life</div>
      </div>
    </div>
  </section>

  <!-- 7 reasons -->
  <section class="section" id="reasons">
    <div class="section-head">
      <div class="section-kicker">Why PMs are switching</div>
      <h2>7 reasons PMs leave Buildium for <em>Tenantory</em>.</h2>
      <p>Buildium was the best tool in 2012. Tenants still pay rent in 2026. Here's what operators hit a wall on — in their own words.</p>
    </div>

    <div class="reasons">

      <div class="reason-card hot">
        <div class="reason-index">01</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3>Per-unit pricing that punishes the doors you just closed on</h3>
        <p>Buildium Essential is $58/mo up to 20 units, but the moment you buy unit #21 you jump to Growth at $166/mo — a 186% increase overnight for adding one door. After 50 units you pay per-unit fees on every new lease. Tenantory is flat $99 whether you have 3 doors or 50.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">$58 to $166 at 21 units</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">$99 flat, 1–50 doors</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">02</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <h3>UI that still feels like 2012</h3>
        <p>Buildium's navigation, forms, and reports look like they were built for IE9 — dense tables, modal soup, and pagination from the Obama administration. Tenantory was designed this year, for mobile-first operators who pay bills between showings.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">Circa-2012 UI</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Modern, mobile-first</div>
          </div>
        </div>
      </div>

      <div class="reason-card hot">
        <div class="reason-index">03</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3>Your tenants see "Buildium" — not your brand</h3>
        <p>Applicants log into a generic Buildium.com-subdomain resident portal with Buildium's logo, Buildium's colors, and Buildium's marketing. You spent years building a name — Buildium owns the tenant relationship. Tenantory puts <em>yourco.tenantory.com</em> and your logo on every surface.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">Buildium-branded portal</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Your subdomain + logo</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">04</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </div>
        <h3>The tenant mobile experience is a crashy afterthought</h3>
        <p>Residents complain about the Buildium Resident app constantly — slow loads, failed payments, login loops. If your tenant can't pay rent on their phone in under 45 seconds, you get a "check in the mail" call. Tenantory's tenant portal is a PWA, passkey login, Apple/Google Pay by default.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">2.8-star app reviews</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Passkey + Apple Pay</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">05</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3>Support lives in a ticket queue measured in days</h3>
        <p>Since the RealPage acquisition, Buildium support is phone-tree → chatbot → ticket. Response times are measured in business days. Tenantory support is a founder email that answers in under 24 hours, seven days a week. You talk to someone who can change the code.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">Tier-1 ticket queue</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Founder email, &lt;24h</div>
          </div>
        </div>
      </div>

      <div class="reason-card">
        <div class="reason-index">06</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 10h16"/><path d="M10 4v16"/></svg>
        </div>
        <h3>Tenant communication is email blasts from 2005</h3>
        <p>Buildium's "tenant communication" is a plain-text email tool with a Buildium "from" address that spam filters love. Tenantory sends branded SMS + email, auto-categorizes replies, threads conversations per unit, and ties everything to the maintenance ticket or ledger entry it's about.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">Plain-text email blasts</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Branded SMS + threaded</div>
          </div>
        </div>
      </div>

      <div class="reason-card hot">
        <div class="reason-index">07</div>
        <div class="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <h3>Accounting setup is a 40-tab chart-of-accounts marathon</h3>
        <p>Buildium's double-entry accounting is powerful, but onboarding requires you to configure a full GL, link bank accounts, map recurring rules, and sit through training. Small operators never finish — they just use Buildium like a shoebox. Tenantory gives you a rental-specific chart of accounts out of the box with a one-click Schedule-E export.</p>
        <div class="reason-contrast">
          <div class="reason-contrast-col them">
            <div class="reason-contrast-label">Buildium</div>
            <div class="reason-contrast-val">Full GL setup required</div>
          </div>
          <div class="reason-contrast-col us">
            <div class="reason-contrast-label">Tenantory</div>
            <div class="reason-contrast-val">Pre-wired + Schedule-E</div>
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
      <p>Using Buildium's published pricing (Essential, Growth, Premium) plus typical add-ons most PMs end up on. Compared to Tenantory Pro flat at $99/mo, Scale flat at $299/mo above 50 doors.</p>
    </div>
    <div class="ladder">
      <table class="ladder-table">
        <thead>
          <tr>
            <th>Portfolio size</th>
            <th class="them">Buildium<span class="col-sub">Published tier + typical add-ons</span></th>
            <th class="us">Tenantory<span class="col-sub">Flat, for life</span></th>
            <th class="save">You save<span class="col-sub">Per year</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ladder-port">5 units<small>Small LLC / side-portfolio</small></td>
            <td class="ladder-price">$58/mo<small>Essential tier minimum</small></td>
            <td class="ladder-us">$99/mo<small>Tenantory Pro</small></td>
            <td class="ladder-save">-$492<small>Buildium cheaper at this size</small></td>
          </tr>
          <tr class="highlight">
            <td class="ladder-port">20 units<small>Right at Buildium's Essential ceiling</small></td>
            <td class="ladder-price">$58/mo<small>Essential ceiling</small></td>
            <td class="ladder-us">$99/mo<small>Tenantory Pro</small></td>
            <td class="ladder-save">-$492<small>Close · Buildium still edges</small></td>
          </tr>
          <tr class="highlight">
            <td class="ladder-port">21 units<small>The "one more door" tier jump</small></td>
            <td class="ladder-price">$166/mo<small>Forced onto Growth</small></td>
            <td class="ladder-us">$99/mo<small>Same $99 as before</small></td>
            <td class="ladder-save">$804<small>Tenantory passes Buildium</small></td>
          </tr>
          <tr>
            <td class="ladder-port">50 units<small>Typical independent PM</small></td>
            <td class="ladder-price">$196/mo<small>Growth + per-unit fees</small></td>
            <td class="ladder-us">$99/mo<small>Still Tenantory Pro</small></td>
            <td class="ladder-save">$1,164<small>First real payback</small></td>
          </tr>
          <tr>
            <td class="ladder-port">100 units<small>Bigger independent op</small></td>
            <td class="ladder-price">$479/mo<small>Premium + per-unit fees</small></td>
            <td class="ladder-us">$299/mo<small>Tenantory Scale</small></td>
            <td class="ladder-save">$2,160<small>Custom domain included</small></td>
          </tr>
        </tbody>
      </table>
      <div class="ladder-foot">Buildium tier bands and per-unit fees sourced from their public pricing page. Your mileage varies slightly by add-ons (e-sign, tenant screening, 1099 filer). Every one of those is included in Tenantory.</div>
    </div>
  </section>

  <!-- Comparison table -->
  <section class="compare-wrap" id="compare">
    <div class="section-head">
      <div class="section-kicker">Head-to-head</div>
      <h2>The full comparison, line by line.</h2>
      <p>Where Buildium wins, we say so — compliance depth, property-management-company scale, established accountant network. Everywhere else, the gap is real.</p>
    </div>
    <div class="compare">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="dim">Buildium<span class="compare-col-sub">Essential / Growth</span></th>
            <th class="featured">Tenantory<span class="compare-col-sub">Pro · $99/mo for life</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-head"><td colspan="3">Pricing &amp; commitment</td></tr>
          <tr><td>Starting price</td><td><span class="cmp-val-dim">$58/mo (up to 20 units)</span></td><td><span class="cmp-val-strong">$99/mo flat, for life</span></td></tr>
          <tr><td>Minimum unit count</td><td><span class="cmp-val">1 unit</span></td><td><span class="cmp-val">1 unit</span></td></tr>
          <tr><td>Per-unit fees above tier</td><td><span class="cmp-val-dim">$1.50–$2.50 / unit / mo</span></td><td><span class="cmp-val">None (flat)</span></td></tr>
          <tr><td>Price at unit #21</td><td><span class="cmp-val-dim">$166/mo (186% jump)</span></td><td><span class="cmp-val-strong">$99/mo (unchanged)</span></td></tr>
          <tr><td>Contract length</td><td><span class="cmp-val-dim">Annual / 2-year discounts</span></td><td><span class="cmp-val">Month-to-month</span></td></tr>
          <tr><td>Free trial without a card</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>10-hour money-back guarantee</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>

          <tr class="group-head"><td colspan="3">Your brand</td></tr>
          <tr><td>Branded subdomain (yourco.xxx.com)</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Full custom domain + SSL</td><td><span class="cmp-val-dim">Premium tier add-on</span></td><td><span class="cmp-val">Scale plan ($299)</span></td></tr>
          <tr><td>Tenant-facing logo &amp; colors</td><td><span class="cmp-val-dim">Logo only</span></td><td><span class="cmp-val">Logo + accent + email</span></td></tr>
          <tr><td>"Powered by" removal</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td><span class="cmp-val">Scale plan</span></td></tr>

          <tr class="group-head"><td colspan="3">Applications &amp; leasing</td></tr>
          <tr><td>Online rental application</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>AI application scoring</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Lease e-sign</td><td><span class="cmp-val-dim">$5 per signed lease</span></td><td><span class="cmp-val">Unlimited, included</span></td></tr>
          <tr><td>State-specific lease templates</td><td><span class="cmp-val-dim">Marketplace add-on</span></td><td><span class="cmp-val">20-section AL/TN/GA/FL</span></td></tr>
          <tr><td>Branded tenant portal</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Mobile app — tenant-facing</td><td><span class="cmp-val-dim">Buildium Resident app (2.8-star)</span></td><td><span class="cmp-val">PWA + Apple/Google Pay</span></td></tr>

          <tr class="group-head"><td colspan="3">Rent &amp; accounting</td></tr>
          <tr><td>ACH rent collection</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Accounting setup time</td><td><span class="cmp-val-dim">2–5 hours (chart of accounts)</span></td><td><span class="cmp-val">Pre-wired, 0 min</span></td></tr>
          <tr><td>Schedule-E tax export</td><td class="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
          <tr><td>Built-in 1099-NEC e-file</td><td><span class="cmp-val-dim">$0.99 per form + 3rd-party</span></td><td><span class="cmp-val">Included, in-app</span></td></tr>
          <tr><td>Owner / investor statements</td><td><span class="cmp-val">Auto PDF</span></td><td><span class="cmp-val">Auto PDF</span></td></tr>

          <tr class="group-head"><td colspan="3">Migration &amp; support</td></tr>
          <tr><td>Time to first value</td><td><span class="cmp-val-dim">2–4 weeks (setup + training)</span></td><td><span class="cmp-val-strong">15 minutes</span></td></tr>
          <tr><td>Free data migration</td><td><span class="cmp-val-dim">Self-service CSV only</span></td><td><span class="cmp-val">Free, 3 days, done-for-you</span></td></tr>
          <tr><td>Direct support (no ticket queue)</td><td><span class="cmp-val-dim">Phone queue, business hours</span></td><td><span class="cmp-val">Founder email, 24h</span></td></tr>

          <tr class="group-head"><td colspan="3">Where Buildium still wins</td></tr>
          <tr><td>Community association (HOA) management</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Rental-only</span></td></tr>
          <tr><td>Large PM-company features (10+ staff)</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Enterprise tier only</span></td></tr>
          <tr><td>Established accountant certification network</td><td class="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></td><td><span class="cmp-val-dim">Smaller firms only</span></td></tr>
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
          Done for you · 3 days · free
        </div>
        <h3>Switching from Buildium is a 3-day lift. We do the heavy part.</h3>
        <p>Buildium's CSV export is actually one of the cleaner ones in the industry — properties, units, tenants, leases, ledgers, maintenance history, and vendor 1099 data all come out. You send us the export, we rebuild your workspace inside Tenantory, you review, and we flip the switch. <strong>You keep using Buildium until cutover.</strong> No downtime, no double entry, no tenants re-registering.</p>
        <div class="migrate-cta">
          <a class="btn btn-pink" href="mailto:migrate@tenantory.com?subject=Buildium%20migration">
            Start my 3-day switch
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="btn btn-ghost" href="onboarding.html">Or start a trial first</a>
        </div>
        <div class="preserve">
          <div class="preserve-label">What gets preserved, 1:1</div>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Properties &amp; units</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenant contacts</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Active leases &amp; terms</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Ledger balances</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Maintenance history</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Vendor W-9s &amp; 1099 YTD</span>
          <span class="preserve-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Documents &amp; attachments</span>
        </div>
      </div>
      <div class="migrate-steps">
        <div class="migrate-step">
          <div class="migrate-step-num">1</div>
          <div class="migrate-step-text">Export from Buildium<small>Settings → Data Export → ZIP. We send the exact click-path.</small></div>
          <div class="migrate-step-clock">Day 1</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">2</div>
          <div class="migrate-step-text">We rebuild your workspace<small>Properties, tenants, leases, ledgers, maintenance, vendors.</small></div>
          <div class="migrate-step-clock">Day 1–2</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">3</div>
          <div class="migrate-step-text">You review &amp; reconcile<small>Side-by-side balance check against your Buildium numbers.</small></div>
          <div class="migrate-step-clock">Day 2</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">4</div>
          <div class="migrate-step-text">Tenants get a branded welcome<small>New portal link, your logo, same login email.</small></div>
          <div class="migrate-step-clock">Day 3</div>
        </div>
        <div class="migrate-step">
          <div class="migrate-step-num">5</div>
          <div class="migrate-step-text">Cancel Buildium. Keep the savings.<small>We credit up to $500 toward any contract buyout.</small></div>
          <div class="migrate-step-clock">Bonus</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testi-wrap">
    <div class="section-head">
      <div class="section-kicker">Switch stories</div>
      <h2>From PMs who made the jump.</h2>
      <p>Real operators in the 10–60 unit range who moved off Buildium in the last six months.</p>
    </div>

    <div class="testi-grid">

      <div class="testi-card">
        <div class="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z"/></svg>
        </div>
        <p class="testi-quote">"I closed on unit 21 and Buildium auto-bumped us to $166/mo the next billing cycle. <strong>Tripled my software cost for adding one door.</strong> I moved to Tenantory that weekend. Flat $99, doesn't care if I have 21 or 48 units, and my tenants stopped asking who Buildium was."</p>
        <div class="testi-person">
          <div class="testi-avatar">RP</div>
          <div>
            <div class="testi-name">Ryan P.</div>
            <div class="testi-role">Summit Door Co. · 24 units · Knoxville, TN</div>
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
        <p class="testi-quote">"We'd been on Buildium for 6 years. The UI literally hadn't changed. Migration took <strong>34 hours end-to-end</strong> — we sent them the Buildium export ZIP on Tuesday night and went live Friday morning with every tenant ledger reconciled to the penny. My wife, who does the books, cried happy tears."</p>
        <div class="testi-person">
          <div class="testi-avatar">TH</div>
          <div>
            <div class="testi-name">Travis H.</div>
            <div class="testi-role">Heritage Rentals · 41 units · Birmingham, AL</div>
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
        <p class="testi-quote">"Buildium's resident app has a 2.8-star rating and I could feel it — every rent cycle I got two or three 'the app won't let me pay' calls. Tenantory is a PWA with Apple Pay. <strong>Zero payment-support calls last month.</strong> That alone gave me back four hours a week."</p>
        <div class="testi-person">
          <div class="testi-avatar">SM</div>
          <div>
            <div class="testi-name">Sierra M.</div>
            <div class="testi-role">Magnolia Lane Leasing · 17 units · Macon, GA</div>
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
        <p class="testi-quote">"What sold me was the Schedule-E export. Our CPA used to spend a full day re-categorizing Buildium's generic P&amp;L at tax time. First year on Tenantory, <strong>she did it in 40 minutes</strong> and my bill dropped $600. The software pays for itself on accounting alone."</p>
        <div class="testi-person">
          <div class="testi-avatar">DW</div>
          <div>
            <div class="testi-name">Darnell W.</div>
            <div class="testi-role">Westpoint Holdings LLC · 33 units · Montgomery, AL</div>
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
      <h2>Switch from Buildium in 3 days. Lock $99/mo for life.</h2>
      <p>We do the migration for free, we credit up to $500 of any contract buyout, and if Tenantory doesn't save you 10 hours in your first 30 paid days, we refund every dollar and wire you $100 for the inconvenience.</p>
      <div class="cta-card-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start my 14-day trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="mailto:migrate@tenantory.com?subject=Buildium%20migration">
          Talk to a migration specialist
        </a>
      </div>
      <div class="cta-note">
        <span>No credit card required</span>
        <span class="cta-note-dot"></span>
        <span>Cancel anytime</span>
        <span class="cta-note-dot"></span>
        <span>Free 3-day migration</span>
        <span class="cta-note-dot"></span>
        <span>$500 contract buyout credit</span>
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
